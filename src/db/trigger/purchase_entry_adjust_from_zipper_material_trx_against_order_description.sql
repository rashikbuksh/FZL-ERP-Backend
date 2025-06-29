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