CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_entry
    -- is is_dyeing_complete is true and old.is_dyeing_complete is false then add the quantity to production_quantity
    UPDATE thread.order_entry
    LEFT JOIN thread.batch_entry ON order_entry.uuid = batch_entry.order_entry_uuid
    LEFT JOIN thread.batch ON batch_entry.batch_uuid = batch.uuid
    SET 
        order_entry.production_quantity = order_entry.production_quantity + CASE WHEN (NEW.is_dyeing_complete = 1 AND OLD.is_dyeing_complete = 0) THEN batch_entry.quantity ELSE 0 END,
        order_entry.production_quantity = order_entry.production_quantity - CASE WHEN (NEW.is_dyeing_complete = 0 AND OLD.is_dyeing_complete = 1) THEN batch_entry.quantity ELSE 0 END,
        order_entry.production_quantity = order_entry.production_quantity + CASE WHEN (NEW.is_dyeing_complete = 1 AND OLD.is_dyeing_complete = 1) THEN batch_entry.quantity - batch_entry.quantity ELSE 0 END,
        order_entry.production_quantity = order_entry.production_quantity - CASE WHEN (NEW.is_dyeing_complete = 0 AND OLD.is_dyeing_complete = 0) THEN 0 ELSE 0 END,
    WHERE batch.uuid = NEW.uuid;

    UPDATE thread.batch_entry
    SET
        batch_entry.quantity = batch_entry.quantity - CASE WHEN (NEW.is_dyeing_complete = 1 AND OLD.is_dyeing_complete = 0) THEN batch_entry.quantity ELSE 0 END,
        batch_entry.quantity = batch_entry.quantity + CASE WHEN (NEW.is_dyeing_complete = 0 AND OLD.is_dyeing_complete = 1) THEN batch_entry.quantity ELSE 0 END,
        batch_entry.quantity = batch_entry.quantity - CASE WHEN (NEW.is_dyeing_complete = 1 AND OLD.is_dyeing_complete = 1) THEN batch_entry.quantity - batch_entry.quantity ELSE 0 END,
        batch_entry.quantity = batch_entry.quantity + CASE WHEN (NEW.is_dyeing_complete = 0 AND OLD.is_dyeing_complete = 0) THEN 0 ELSE 0 END
    WHERE batch_entry.batch_uuid = OLD.uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER order_entry_after_batch_is_dyeing_update_function
AFTER UPDATE ON thread.batch
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();

-- Trigger for batch_entry

