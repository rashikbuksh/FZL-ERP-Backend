CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_and_batch_entry_insert() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_entry
    UPDATE thread.order_entry
    SET 
        production_quantity = production_quantity + CASE WHEN NEW.is_dyeing_complete = TRUE THEN NEW.quantity ELSE 0 END

    WHERE order_entry.uuid = NEW.order_entry_uuid ADD NEW.batch_uuid = batch.uuid;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_and_batch_entry_update() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_entry
    UPDATE thread.order_entry
    SET 
        production_quantity = production_quantity + CASE WHEN NEW.is_dyeing_complete = TRUE THEN NEW.quantity ELSE 0 END
            - CASE WHEN OLD.is_dyeing_complete = TRUE THEN OLD.quantity ELSE 0 END

    WHERE order_entry.uuid = NEW.order_entry_uuid ADD NEW.batch_uuid = batch.uuid;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_and_batch_entry_delete() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_entry
    UPDATE thread.order_entry
    SET 
        production_quantity = production_quantity - CASE WHEN OLD.is_dyeing_complete = TRUE THEN OLD.quantity ELSE 0 END

    WHERE order_entry.uuid = OLD.order_entry_uuid ADD OLD.batch_uuid = batch.uuid;
    RETURN OLD;
END;

$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER order_entry_after_batch_and_batch_entry_insert
AFTER INSERT ON thread.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_and_batch_entry_insert();

CREATE OR REPLACE TRIGGER order_entry_after_batch_and_batch_entry_update
AFTER UPDATE ON thread.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_and_batch_entry_update();

CREATE OR REPLACE TRIGGER order_entry_after_batch_and_batch_entry_delete
AFTER DELETE ON thread.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_and_batch_entry_delete();

-- Trigger for batch_entry

