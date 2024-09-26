-- * INSERTED problem FIXED

CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Trigger executing for batch UUID: %', NEW.uuid;

    -- Update order_entry
    UPDATE thread.order_entry oe
    SET 
        production_quantity = production_quantity 
        + CASE WHEN (NEW.is_drying_complete = 'true' AND OLD.is_drying_complete = 'false') THEN be.quantity ELSE 0 END 
        - CASE WHEN (NEW.is_drying_complete = 'false' AND OLD.is_drying_complete = 'true') THEN be.quantity ELSE 0 END
    FROM thread.batch_entry be
    LEFT JOIN thread.batch b ON be.batch_uuid = b.uuid
    WHERE b.uuid = NEW.uuid AND oe.uuid = be.order_entry_uuid;
    RAISE NOTICE 'Trigger executed for batch UUID: %', NEW.uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER order_entry_after_batch_is_dyeing_update_function
AFTER UPDATE OF is_drying_complete ON thread.batch
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();
