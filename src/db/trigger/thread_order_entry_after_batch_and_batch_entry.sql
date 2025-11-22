-- * INSERTED problem FIXED

-- trigger causing production_quantity negative

-- be.coning_production_quantity != 0 negative production_quantity issue Handled

CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS TRIGGER AS $$
DECLARE
    quantity_delta NUMERIC;
BEGIN
    RAISE NOTICE 'Trigger executing for batch UUID: %', NEW.uuid;

    -- Calculate the quantity change based on is_drying_complete status change
    IF NEW.is_drying_complete = 'true' AND OLD.is_drying_complete = 'false' THEN
        quantity_delta := 1; -- Add quantity
    ELSIF NEW.is_drying_complete = 'false' AND OLD.is_drying_complete = 'true' THEN
        quantity_delta := -1; -- Subtract quantity
    ELSE
        quantity_delta := 0; -- No change
    END IF;

    -- Only proceed if there's a change
    IF quantity_delta != 0 THEN
        -- Update order_entry for each batch_entry that has coning_production_quantity != 0
        UPDATE thread.order_entry oe
        SET 
            production_quantity = production_quantity + (be.quantity * quantity_delta)
        FROM thread.batch_entry be
        WHERE be.batch_uuid = NEW.uuid 
            AND oe.uuid = be.order_entry_uuid
            AND be.coning_production_quantity != 0;
            
        RAISE NOTICE 'Updated order_entry production_quantity by % for batch UUID: %', quantity_delta, NEW.uuid;
    END IF;

    RAISE NOTICE 'Trigger executed for batch UUID: %', NEW.uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER order_entry_after_batch_is_dyeing_update_function
AFTER UPDATE OF is_drying_complete ON thread.batch
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();
