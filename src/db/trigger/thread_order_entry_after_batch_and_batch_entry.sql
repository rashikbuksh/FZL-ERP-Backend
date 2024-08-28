-- CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.is_drying_complete = TRUE THEN
--         -- Update order_entry table
--         UPDATE thread.order_entry
--         SET production_quantity = production_quantity + NEW.quantity - OLD.quantity
--         WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE batch_uuid = NEW.uuid);

--         -- Update batch_entry table
--         UPDATE thread.batch_entry
--         SET quantity = quantity - NEW.quantity + OLD.quantity
--         WHERE batch_uuid = NEW.uuid;
--     END IF;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS TRIGGER AS $$
BEGIN
    -- Handle insert when is_drying_complete is true
    IF TG_OP = 'INSERT' AND NEW.is_drying_complete = TRUE THEN
        -- Update order_entry table
        UPDATE thread.order_entry
        SET production_quantity = production_quantity + NEW.quantity
        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE batch_uuid = NEW.uuid);

        -- Update batch_entry table
        UPDATE thread.batch_entry
        SET quantity = quantity - NEW.quantity
        WHERE batch_uuid = NEW.uuid;

    -- Handle update when is_drying_complete remains true
    ELSIF TG_OP = 'UPDATE' AND OLD.is_drying_complete = TRUE AND NEW.is_drying_complete = TRUE THEN
        -- Update order_entry table
        UPDATE thread.order_entry
        SET production_quantity = production_quantity + NEW.quantity - OLD.quantity
        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE batch_uuid = NEW.uuid);

        -- Update batch_entry table
        UPDATE thread.batch_entry
        SET quantity = quantity - NEW.quantity + OLD.quantity
        WHERE batch_uuid = NEW.uuid;

    -- Handle remove when is_drying_complete changes from true to false
    ELSIF TG_OP = 'UPDATE' AND OLD.is_drying_complete = TRUE AND NEW.is_drying_complete = FALSE THEN
        -- Update order_entry table
        UPDATE thread.order_entry
        SET production_quantity = production_quantity - OLD.quantity
        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE batch_uuid = NEW.uuid);

        -- Update batch_entry table
        UPDATE thread.batch_entry
        SET quantity = quantity + OLD.quantity
        WHERE batch_uuid = NEW.uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER after_batch_insert_update
AFTER INSERT OR UPDATE ON thread.batch
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();



CREATE OR REPLACE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_entry
    -- is is_drying_complete is true and old.is_drying_complete is false then add the quantity to production_quantity
    UPDATE thread.order_entry
    LEFT JOIN thread.batch_entry ON order_entry.uuid = batch_entry.order_entry_uuid
    LEFT JOIN thread.batch ON batch_entry.batch_uuid = batch.uuid
    SET 
        order_entry.production_quantity = order_entry.production_quantity + CASE WHEN (NEW.is_drying_complete = 1 AND OLD.is_drying_complete = 0) THEN batch_entry.quantity ELSE 0 END,
        order_entry.production_quantity = order_entry.production_quantity - CASE WHEN (NEW.is_drying_complete = 0 AND OLD.is_drying_complete = 1) THEN batch_entry.quantity ELSE 0 END,
        order_entry.production_quantity = order_entry.production_quantity + CASE WHEN (NEW.is_drying_complete = 1 AND OLD.is_drying_complete = 1) THEN batch_entry.quantity - batch_entry.quantity ELSE 0 END,
        order_entry.production_quantity = order_entry.production_quantity - CASE WHEN (NEW.is_drying_complete = 0 AND OLD.is_drying_complete = 0) THEN 0 ELSE 0 END,
    WHERE batch.uuid = NEW.uuid;

    UPDATE thread.batch_entry
    SET
        batch_entry.quantity = batch_entry.quantity - CASE WHEN (NEW.is_drying_complete = 1 AND OLD.is_drying_complete = 0) THEN batch_entry.quantity ELSE 0 END,
        batch_entry.quantity = batch_entry.quantity + CASE WHEN (NEW.is_drying_complete = 0 AND OLD.is_drying_complete = 1) THEN batch_entry.quantity ELSE 0 END,
        batch_entry.quantity = batch_entry.quantity - CASE WHEN (NEW.is_drying_complete = 1 AND OLD.is_drying_complete = 1) THEN batch_entry.quantity - batch_entry.quantity ELSE 0 END,
        batch_entry.quantity = batch_entry.quantity + CASE WHEN (NEW.is_drying_complete = 0 AND OLD.is_drying_complete = 0) THEN 0 ELSE 0 END
    WHERE batch_entry.batch_uuid = OLD.uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER order_entry_after_batch_is_dyeing_update_function
AFTER UPDATE ON thread.batch
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();

-- Trigger for batch_entry

