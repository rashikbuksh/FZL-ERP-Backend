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