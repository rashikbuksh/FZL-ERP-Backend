BEGIN;
-- Create a temporary function to fill provided_quantity
CREATE OR REPLACE FUNCTION fill_provided_quantity()
RETURNS void AS $$
DECLARE
    pe_record RECORD;
    trx_record RECORD;
    remaining_quantity DECIMAL(20,4);
    allocation_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
BEGIN
    -- Loop through each material_uuid that has transactions
    FOR trx_record IN 
        SELECT 
            material_uuid,
            SUM(trx_quantity) as total_trx_quantity
        FROM material.trx 
        GROUP BY material_uuid
        HAVING SUM(trx_quantity) > 0
        ORDER BY material_uuid
    LOOP
        remaining_quantity := trx_record.total_trx_quantity;
        
        -- Loop through purchase entries for this material in ascending order (FIFO)
        FOR pe_record IN 
            SELECT 
                uuid,
                material_uuid,
                quantity,
                provided_quantity,
                created_at
            FROM purchase.entry 
            WHERE material_uuid = trx_record.material_uuid
            ORDER BY created_at ASC, uuid ASC
        LOOP
            -- Calculate how much more can be allocated to this entry
            available_from_entry := pe_record.quantity - pe_record.provided_quantity;
            
            -- Skip if this entry is already fully allocated
            IF available_from_entry <= 0 THEN
                CONTINUE;
            END IF;
            
            -- Skip if no more quantity to allocate
            IF remaining_quantity <= 0 THEN
                EXIT;
            END IF;
            
            -- Calculate allocation amount (minimum of available space and remaining quantity)
            allocation_amount := LEAST(available_from_entry, remaining_quantity);
            
            -- Update the purchase entry
            UPDATE purchase.entry 
            SET 
                provided_quantity = provided_quantity + allocation_amount,
                updated_at = NOW()
            WHERE uuid = pe_record.uuid;
            
            -- Reduce remaining quantity
            remaining_quantity := remaining_quantity - allocation_amount;
            
            RAISE NOTICE 'Allocated % to purchase entry % (material: %), remaining: %', 
                allocation_amount, pe_record.uuid, trx_record.material_uuid, remaining_quantity;
        END LOOP;
        
        -- Log if there's still remaining quantity that couldn't be allocated
        IF remaining_quantity > 0 THEN
            RAISE WARNING 'Material % has remaining unallocated quantity: %', 
                trx_record.material_uuid, remaining_quantity;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the migration
SELECT fill_provided_quantity ();

-- Drop the temporary function
DROP FUNCTION fill_provided_quantity ();

-- Verification queries
SELECT
    'Before Migration Check' as status,
    material_uuid,
    COUNT(*) as entry_count,
    SUM(quantity) as total_quantity,
    SUM(provided_quantity) as total_provided_quantity,
    SUM(quantity - provided_quantity) as remaining_quantity
FROM purchase.entry
GROUP BY
    material_uuid
ORDER BY material_uuid;

SELECT
    'Material Transactions' as status,
    material_uuid,
    SUM(trx_quantity) as total_trx_quantity
FROM material.trx
GROUP BY
    material_uuid
ORDER BY material_uuid;

-- Summary report
SELECT
    pe.material_uuid,
    pe.total_entries,
    pe.total_purchase_quantity,
    pe.total_provided_quantity,
    pe.remaining_purchase_quantity,
    COALESCE(mt.total_trx_quantity, 0) as total_trx_quantity,
    CASE
        WHEN COALESCE(mt.total_trx_quantity, 0) = pe.total_provided_quantity THEN 'MATCHED'
        ELSE 'MISMATCH'
    END as allocation_status
FROM (
        SELECT
            material_uuid, COUNT(*) as total_entries, SUM(quantity) as total_purchase_quantity, SUM(provided_quantity) as total_provided_quantity, SUM(quantity - provided_quantity) as remaining_purchase_quantity
        FROM purchase.entry
        GROUP BY
            material_uuid
    ) pe
    LEFT JOIN (
        SELECT
            material_uuid, SUM(trx_quantity) as total_trx_quantity
        FROM material.trx
        GROUP BY
            material_uuid
    ) mt ON pe.material_uuid = mt.material_uuid
ORDER BY pe.material_uuid;

COMMIT;

-- =============================================================================
-- TRIGGER FUNCTIONS FOR AUTOMATIC PROVIDED_QUANTITY MANAGEMENT
-- =============================================================================

-- Function to allocate material.trx quantity to purchase.entry records
CREATE OR REPLACE FUNCTION material.allocate_trx_to_purchase_entries()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    remaining_quantity DECIMAL(20,4);
    allocation_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
BEGIN
    -- Only process if this is an INSERT and trx_quantity > 0
    IF TG_OP = 'INSERT' AND NEW.trx_quantity > 0 THEN
        remaining_quantity := NEW.trx_quantity;
        
        -- Loop through purchase entries for this material in FIFO order
        FOR pe_record IN 
            SELECT 
                uuid,
                material_uuid,
                quantity,
                provided_quantity,
                created_at
            FROM purchase.entry 
            WHERE material_uuid = NEW.material_uuid
              AND provided_quantity < quantity  -- Only entries with available space
            ORDER BY created_at ASC, uuid ASC
        LOOP
            -- Exit if no more quantity to allocate
            IF remaining_quantity <= 0 THEN
                EXIT;
            END IF;
            
            -- Calculate available space in this entry
            available_from_entry := pe_record.quantity - pe_record.provided_quantity;
            
            -- Calculate allocation amount
            allocation_amount := LEAST(available_from_entry, remaining_quantity);
            
            -- Update the purchase entry
            UPDATE purchase.entry 
            SET 
                provided_quantity = provided_quantity + allocation_amount,
                updated_at = NOW()
            WHERE uuid = pe_record.uuid;
            
            -- Reduce remaining quantity
            remaining_quantity := remaining_quantity - allocation_amount;
            
            RAISE NOTICE 'Auto-allocated % from trx % to purchase entry % (material: %)', 
                allocation_amount, NEW.uuid, pe_record.uuid, NEW.material_uuid;
        END LOOP;
        
        -- Log if there's still remaining quantity that couldn't be allocated
        IF remaining_quantity > 0 THEN
            RAISE WARNING 'Material % has unallocated trx quantity: % from transaction %', 
                NEW.material_uuid, remaining_quantity, NEW.uuid;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new purchase.entry records and reallocate existing transactions
CREATE OR REPLACE FUNCTION purchase.reallocate_on_new_purchase_entry()
RETURNS TRIGGER AS $$
DECLARE
    trx_record RECORD;
    pe_record RECORD;
    remaining_quantity DECIMAL(20,4);
    allocation_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
    total_unallocated DECIMAL(20,4);
BEGIN
    -- Only process if this is an INSERT
    IF TG_OP = 'INSERT' THEN
        -- Calculate total unallocated material.trx quantity for this material
        SELECT COALESCE(
            SUM(mt.trx_quantity) - COALESCE(SUM(pe.provided_quantity), 0), 
            0
        ) INTO total_unallocated
        FROM material.trx mt
        LEFT JOIN (
            SELECT 
                material_uuid, 
                SUM(provided_quantity) as provided_quantity
            FROM purchase.entry 
            WHERE material_uuid = NEW.material_uuid
            GROUP BY material_uuid
        ) pe ON mt.material_uuid = pe.material_uuid
        WHERE mt.material_uuid = NEW.material_uuid;
        
        -- If there's unallocated quantity, allocate to this new entry
        IF total_unallocated > 0 THEN
            allocation_amount := LEAST(NEW.quantity, total_unallocated);
            
            UPDATE purchase.entry 
            SET 
                provided_quantity = allocation_amount,
                updated_at = NOW()
            WHERE uuid = NEW.uuid;
            
            RAISE NOTICE 'Auto-allocated % to new purchase entry % (material: %)', 
                allocation_amount, NEW.uuid, NEW.material_uuid;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle purchase.entry deletions and reallocate quantities
CREATE OR REPLACE FUNCTION purchase.reallocate_on_purchase_entry_delete()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    freed_quantity DECIMAL(20,4);
    remaining_quantity DECIMAL(20,4);
    allocation_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
BEGIN
    -- Only process if provided_quantity > 0 in the deleted record
    IF OLD.provided_quantity > 0 THEN
        freed_quantity := OLD.provided_quantity;
        remaining_quantity := freed_quantity;
        
        -- Reallocate the freed quantity to other entries for the same material
        FOR pe_record IN 
            SELECT 
                uuid,
                material_uuid,
                quantity,
                provided_quantity,
                created_at
            FROM purchase.entry 
            WHERE material_uuid = OLD.material_uuid
              AND provided_quantity < quantity  -- Only entries with available space
              AND uuid != OLD.uuid  -- Exclude the deleted record
            ORDER BY created_at ASC, uuid ASC
        LOOP
            -- Exit if no more quantity to allocate
            IF remaining_quantity <= 0 THEN
                EXIT;
            END IF;
            
            -- Calculate available space in this entry
            available_from_entry := pe_record.quantity - pe_record.provided_quantity;
            
            -- Calculate allocation amount
            allocation_amount := LEAST(available_from_entry, remaining_quantity);
            
            -- Update the purchase entry
            UPDATE purchase.entry 
            SET 
                provided_quantity = provided_quantity + allocation_amount,
                updated_at = NOW()
            WHERE uuid = pe_record.uuid;
            
            -- Reduce remaining quantity
            remaining_quantity := remaining_quantity - allocation_amount;
            
            RAISE NOTICE 'Reallocated % from deleted entry % to entry % (material: %)', 
                allocation_amount, OLD.uuid, pe_record.uuid, OLD.material_uuid;
        END LOOP;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to handle material.trx deletions and decrease provided_quantity
CREATE OR REPLACE FUNCTION material.deallocate_on_material_trx_delete()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    remaining_to_deallocate DECIMAL(20,4);
    deallocation_amount DECIMAL(20,4);
BEGIN
    -- Only process if this is a DELETE and trx_quantity > 0
    IF TG_OP = 'DELETE' AND OLD.trx_quantity > 0 THEN
        remaining_to_deallocate := OLD.trx_quantity;
        
        -- Loop through purchase entries for this material in reverse FIFO order (LIFO for deallocation)
        -- This ensures we deallocate from the most recently allocated entries first
        FOR pe_record IN 
            SELECT 
                uuid,
                material_uuid,
                quantity,
                provided_quantity,
                created_at
            FROM purchase.entry 
            WHERE material_uuid = OLD.material_uuid
              AND provided_quantity > 0  -- Only entries with allocated quantity
            ORDER BY created_at DESC, uuid DESC  -- LIFO order for deallocation
        LOOP
            -- Exit if no more quantity to deallocate
            IF remaining_to_deallocate <= 0 THEN
                EXIT;
            END IF;
            
            -- Calculate deallocation amount (minimum of provided quantity and remaining to deallocate)
            deallocation_amount := LEAST(pe_record.provided_quantity, remaining_to_deallocate);
            
            -- Update the purchase entry
            UPDATE purchase.entry 
            SET 
                provided_quantity = provided_quantity - deallocation_amount,
                updated_at = NOW()
            WHERE uuid = pe_record.uuid;
            
            -- Reduce remaining quantity to deallocate
            remaining_to_deallocate := remaining_to_deallocate - deallocation_amount;
            
            RAISE NOTICE 'Deallocated % from purchase entry % due to trx deletion % (material: %)', 
                deallocation_amount, pe_record.uuid, OLD.uuid, OLD.material_uuid;
        END LOOP;
        
        -- Log if there's still remaining quantity that couldn't be deallocated
        IF remaining_to_deallocate > 0 THEN
            RAISE WARNING 'Material % could not deallocate remaining quantity: % from deleted transaction %', 
                OLD.material_uuid, remaining_to_deallocate, OLD.uuid;
        END IF;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to handle material.trx updates and adjust provided_quantity accordingly
CREATE OR REPLACE FUNCTION material.adjust_on_material_trx_update()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    quantity_difference DECIMAL(20,4);
    remaining_to_process DECIMAL(20,4);
    adjustment_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
BEGIN
    -- Only process if trx_quantity has changed
    IF TG_OP = 'UPDATE' AND OLD.trx_quantity != NEW.trx_quantity THEN
        quantity_difference := NEW.trx_quantity - OLD.trx_quantity;
        remaining_to_process := ABS(quantity_difference);
        
        -- If quantity increased, allocate the additional amount
        IF quantity_difference > 0 THEN
            -- Loop through purchase entries for this material in FIFO order
            FOR pe_record IN 
                SELECT 
                    uuid,
                    material_uuid,
                    quantity,
                    provided_quantity,
                    created_at
                FROM purchase.entry 
                WHERE material_uuid = NEW.material_uuid
                  AND provided_quantity < quantity  -- Only entries with available space
                ORDER BY created_at ASC, uuid ASC
            LOOP
                -- Exit if no more quantity to allocate
                IF remaining_to_process <= 0 THEN
                    EXIT;
                END IF;
                
                -- Calculate available space in this entry
                available_from_entry := pe_record.quantity - pe_record.provided_quantity;
                
                -- Calculate allocation amount
                adjustment_amount := LEAST(available_from_entry, remaining_to_process);
                
                -- Update the purchase entry
                UPDATE purchase.entry 
                SET 
                    provided_quantity = provided_quantity + adjustment_amount,
                    updated_at = NOW()
                WHERE uuid = pe_record.uuid;
                
                -- Reduce remaining quantity
                remaining_to_process := remaining_to_process - adjustment_amount;
                
                RAISE NOTICE 'Allocated additional % from updated trx % to purchase entry % (material: %)', 
                    adjustment_amount, NEW.uuid, pe_record.uuid, NEW.material_uuid;
            END LOOP;
            
            -- Log if there's still remaining quantity that couldn't be allocated
            IF remaining_to_process > 0 THEN
                RAISE WARNING 'Material % has unallocated additional quantity: % from updated transaction %', 
                    NEW.material_uuid, remaining_to_process, NEW.uuid;
            END IF;
            
        -- If quantity decreased, deallocate the reduced amount
        ELSIF quantity_difference < 0 THEN
            -- Loop through purchase entries for this material in LIFO order for deallocation
            FOR pe_record IN 
                SELECT 
                    uuid,
                    material_uuid,
                    quantity,
                    provided_quantity,
                    created_at
                FROM purchase.entry 
                WHERE material_uuid = NEW.material_uuid
                  AND provided_quantity > 0  -- Only entries with allocated quantity
                ORDER BY created_at DESC, uuid DESC  -- LIFO order for deallocation
            LOOP
                -- Exit if no more quantity to deallocate
                IF remaining_to_process <= 0 THEN
                    EXIT;
                END IF;
                
                -- Calculate deallocation amount
                adjustment_amount := LEAST(pe_record.provided_quantity, remaining_to_process);
                
                -- Update the purchase entry
                UPDATE purchase.entry 
                SET 
                    provided_quantity = provided_quantity - adjustment_amount,
                    updated_at = NOW()
                WHERE uuid = pe_record.uuid;
                
                -- Reduce remaining quantity to deallocate
                remaining_to_process := remaining_to_process - adjustment_amount;
                
                RAISE NOTICE 'Deallocated % from purchase entry % due to trx update % (material: %)', 
                    adjustment_amount, pe_record.uuid, NEW.uuid, NEW.material_uuid;
            END LOOP;
            
            -- Log if there's still remaining quantity that couldn't be deallocated
            IF remaining_to_process > 0 THEN
                RAISE WARNING 'Material % could not deallocate remaining quantity: % from updated transaction %', 
                    NEW.material_uuid, remaining_to_process, NEW.uuid;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CREATE TRIGGERS
-- =============================================================================

-- MATERIAL.TRX TRIGGERS
-- Trigger for new material.trx records
DROP TRIGGER IF EXISTS trg_allocate_material_trx ON material.trx;

CREATE TRIGGER trg_allocate_material_trx
    AFTER INSERT ON material.trx
    FOR EACH ROW
    EXECUTE FUNCTION material.allocate_trx_to_purchase_entries();

-- Trigger for updated material.trx records
DROP TRIGGER IF EXISTS trg_adjust_material_trx ON material.trx;

CREATE TRIGGER trg_adjust_material_trx
    AFTER UPDATE ON material.trx
    FOR EACH ROW
    EXECUTE FUNCTION material.adjust_on_material_trx_update();

-- Trigger for deleted material.trx records
DROP TRIGGER IF EXISTS trg_deallocate_material_trx ON material.trx;

CREATE TRIGGER trg_deallocate_material_trx
    BEFORE DELETE ON material.trx
    FOR EACH ROW
    EXECUTE FUNCTION material.deallocate_on_material_trx_delete();

-- Trigger for new purchase.entry records
DROP TRIGGER IF EXISTS trg_reallocate_new_purchase_entry ON purchase.entry;

CREATE TRIGGER trg_reallocate_new_purchase_entry
    AFTER INSERT ON purchase.entry
    FOR EACH ROW
    EXECUTE FUNCTION purchase.reallocate_on_new_purchase_entry();

-- Trigger for deleted purchase.entry records
DROP TRIGGER IF EXISTS trg_reallocate_deleted_purchase_entry ON purchase.entry;

CREATE TRIGGER trg_reallocate_deleted_purchase_entry
    BEFORE DELETE ON purchase.entry
    FOR EACH ROW
    EXECUTE FUNCTION purchase.reallocate_on_purchase_entry_delete();

-- =============================================================================
-- STOCK_TO_SFG TRIGGER FUNCTIONS FOR AUTOMATIC PROVIDED_QUANTITY MANAGEMENT
-- =============================================================================

-- Function to allocate material.material_trx_against_order_description quantity to purchase.entry records
CREATE OR REPLACE FUNCTION material.allocate_material_trx_against_order_description_to_purchase_entries()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    remaining_quantity DECIMAL(20,4);
    allocation_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
BEGIN
    -- Only process if this is an INSERT and trx_quantity > 0
    IF TG_OP = 'INSERT' AND NEW.trx_quantity > 0 THEN
        remaining_quantity := NEW.trx_quantity;
        
        -- Loop through purchase entries for this material in FIFO order
        FOR pe_record IN 
            SELECT 
                uuid,
                material_uuid,
                quantity,
                provided_quantity,
                created_at
            FROM purchase.entry 
            WHERE material_uuid = NEW.material_uuid
              AND provided_quantity < quantity  -- Only entries with available space
            ORDER BY created_at ASC, uuid ASC
        LOOP
            -- Exit if no more quantity to allocate
            IF remaining_quantity <= 0 THEN
                EXIT;
            END IF;
            
            -- Calculate available space in this entry
            available_from_entry := pe_record.quantity - pe_record.provided_quantity;
            
            -- Calculate allocation amount
            allocation_amount := LEAST(available_from_entry, remaining_quantity);
            
            -- Update the purchase entry
            UPDATE purchase.entry 
            SET 
                provided_quantity = provided_quantity + allocation_amount,
                updated_at = NOW()
            WHERE uuid = pe_record.uuid;
            
            -- Reduce remaining quantity
            remaining_quantity := remaining_quantity - allocation_amount;
            
            RAISE NOTICE 'Auto-allocated % from material_trx_against_order_description % to purchase entry % (material: %)', 
                allocation_amount, NEW.uuid, pe_record.uuid, NEW.material_uuid;
        END LOOP;
        
        -- Log if there's still remaining quantity that couldn't be allocated
        IF remaining_quantity > 0 THEN
            RAISE WARNING 'Material % has unallocated material_trx_against_order_description quantity: % from transaction %', 
                NEW.material_uuid, remaining_quantity, NEW.uuid;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle material.material_trx_against_order_description deletions and decrease provided_quantity
CREATE OR REPLACE FUNCTION material.deallocate_on_material_trx_against_order_description_delete()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    remaining_to_deallocate DECIMAL(20,4);
    deallocation_amount DECIMAL(20,4);
BEGIN
    -- Only process if this is a DELETE and trx_quantity > 0
    IF TG_OP = 'DELETE' AND OLD.trx_quantity > 0 THEN
        remaining_to_deallocate := OLD.trx_quantity;
        
        -- Loop through purchase entries for this material in reverse FIFO order (LIFO for deallocation)
        -- This ensures we deallocate from the most recently allocated entries first
        FOR pe_record IN 
            SELECT 
                uuid,
                material_uuid,
                quantity,
                provided_quantity,
                created_at
            FROM purchase.entry 
            WHERE material_uuid = OLD.material_uuid
              AND provided_quantity > 0  -- Only entries with allocated quantity
            ORDER BY created_at DESC, uuid DESC  -- LIFO order for deallocation
        LOOP
            -- Exit if no more quantity to deallocate
            IF remaining_to_deallocate <= 0 THEN
                EXIT;
            END IF;
            
            -- Calculate deallocation amount (minimum of provided quantity and remaining to deallocate)
            deallocation_amount := LEAST(pe_record.provided_quantity, remaining_to_deallocate);
            
            -- Update the purchase entry
            UPDATE purchase.entry 
            SET 
                provided_quantity = provided_quantity - deallocation_amount,
                updated_at = NOW()
            WHERE uuid = pe_record.uuid;
            
            -- Reduce remaining quantity to deallocate
            remaining_to_deallocate := remaining_to_deallocate - deallocation_amount;
            
            RAISE NOTICE 'Deallocated % from purchase entry % due to material_trx_against_order_description deletion % (material: %)', 
                deallocation_amount, pe_record.uuid, OLD.uuid, OLD.material_uuid;
        END LOOP;
        
        -- Log if there's still remaining quantity that couldn't be deallocated
        IF remaining_to_deallocate > 0 THEN
            RAISE WARNING 'Material % could not deallocate remaining quantity: % from deleted material_trx_against_order_description %', 
                OLD.material_uuid, remaining_to_deallocate, OLD.uuid;
        END IF;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to handle material.material_trx_against_order_description updates and adjust provided_quantity accordingly
CREATE OR REPLACE FUNCTION material.adjust_on_material_trx_against_order_description_update()
RETURNS TRIGGER AS $$
DECLARE
    pe_record RECORD;
    quantity_difference DECIMAL(20,4);
    remaining_to_process DECIMAL(20,4);
    adjustment_amount DECIMAL(20,4);
    available_from_entry DECIMAL(20,4);
BEGIN
    -- Only process if trx_quantity has changed
    IF TG_OP = 'UPDATE' AND OLD.trx_quantity != NEW.trx_quantity THEN
        quantity_difference := NEW.trx_quantity - OLD.trx_quantity;
        remaining_to_process := ABS(quantity_difference);
        
        -- If quantity increased, allocate the additional amount
        IF quantity_difference > 0 THEN
            -- Loop through purchase entries for this material in FIFO order
            FOR pe_record IN 
                SELECT 
                    uuid,
                    material_uuid,
                    quantity,
                    provided_quantity,
                    created_at
                FROM purchase.entry 
                WHERE material_uuid = NEW.material_uuid
                  AND provided_quantity < quantity  -- Only entries with available space
                ORDER BY created_at ASC, uuid ASC
            LOOP
                -- Exit if no more quantity to allocate
                IF remaining_to_process <= 0 THEN
                    EXIT;
                END IF;
                
                -- Calculate available space in this entry
                available_from_entry := pe_record.quantity - pe_record.provided_quantity;
                
                -- Calculate allocation amount
                adjustment_amount := LEAST(available_from_entry, remaining_to_process);
                
                -- Update the purchase entry
                UPDATE purchase.entry 
                SET 
                    provided_quantity = provided_quantity + adjustment_amount,
                    updated_at = NOW()
                WHERE uuid = pe_record.uuid;
                
                -- Reduce remaining quantity
                remaining_to_process := remaining_to_process - adjustment_amount;
                
                RAISE NOTICE 'Allocated additional % from updated material_trx_against_order_description % to purchase entry % (material: %)', 
                    adjustment_amount, NEW.uuid, pe_record.uuid, NEW.material_uuid;
            END LOOP;
            
            -- Log if there's still remaining quantity that couldn't be allocated
            IF remaining_to_process > 0 THEN
                RAISE WARNING 'Material % has unallocated additional quantity: % from updated material_trx_against_order_description %', 
                    NEW.material_uuid, remaining_to_process, NEW.uuid;
            END IF;
            
        -- If quantity decreased, deallocate the reduced amount
        ELSIF quantity_difference < 0 THEN
            -- Loop through purchase entries for this material in LIFO order for deallocation
            FOR pe_record IN 
                SELECT 
                    uuid,
                    material_uuid,
                    quantity,
                    provided_quantity,
                    created_at
                FROM purchase.entry 
                WHERE material_uuid = NEW.material_uuid
                  AND provided_quantity > 0  -- Only entries with allocated quantity
                ORDER BY created_at DESC, uuid DESC  -- LIFO order for deallocation
            LOOP
                -- Exit if no more quantity to deallocate
                IF remaining_to_process <= 0 THEN
                    EXIT;
                END IF;
                
                -- Calculate deallocation amount
                adjustment_amount := LEAST(pe_record.provided_quantity, remaining_to_process);
                
                -- Update the purchase entry
                UPDATE purchase.entry 
                SET 
                    provided_quantity = provided_quantity - adjustment_amount,
                    updated_at = NOW()
                WHERE uuid = pe_record.uuid;
                
                -- Reduce remaining quantity to deallocate
                remaining_to_process := remaining_to_process - adjustment_amount;
                
                RAISE NOTICE 'Deallocated % from purchase entry % due to material_trx_against_order_description update % (material: %)', 
                    adjustment_amount, pe_record.uuid, NEW.uuid, NEW.material_uuid;
            END LOOP;
            
            -- Log if there's still remaining quantity that couldn't be deallocated
            IF remaining_to_process > 0 THEN
                RAISE WARNING 'Material % could not deallocate remaining quantity: % from updated material_trx_against_order_description %', 
                    NEW.material_uuid, remaining_to_process, NEW.uuid;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CREATE TRIGGERS FOR STOCK_TO_SFG
-- =============================================================================

-- Trigger for new material.material_trx_against_order_description records
DROP TRIGGER IF EXISTS trg_allocate_material_trx_against_order_description ON material.material_trx_against_order_description;

CREATE TRIGGER trg_allocate_material_trx_against_order_description
    AFTER INSERT ON zipper.material_trx_against_order_description
    FOR EACH ROW
    EXECUTE FUNCTION material.allocate_material_trx_against_order_description_to_purchase_entries();

-- Trigger for deleted material.material_trx_against_order_description records
DROP TRIGGER IF EXISTS trg_deallocate_material_trx_against_order_description ON material.material_trx_against_order_description;

CREATE TRIGGER trg_deallocate_material_trx_against_order_description
    BEFORE DELETE ON zipper.material_trx_against_order_description
    FOR EACH ROW
    EXECUTE FUNCTION material.deallocate_on_material_trx_against_order_description_delete();

-- Trigger for updated material.material_trx_against_order_description records
DROP TRIGGER IF EXISTS trg_adjust_material_trx_against_order_description ON material.material_trx_against_order_description;

CREATE TRIGGER trg_adjust_material_trx_against_order_description
    AFTER UPDATE ON zipper.material_trx_against_order_description
    FOR EACH ROW
    EXECUTE FUNCTION material.adjust_on_material_trx_against_order_description_update();