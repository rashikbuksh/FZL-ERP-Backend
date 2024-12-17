-- * inserted 
CREATE OR REPLACE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS TRIGGER AS $$
DECLARE
    order_type_val TEXT;
BEGIN
    SELECT order_type INTO order_type_val
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    -- Update order_description
    UPDATE zipper.order_description
    SET
        -- tape_received = tape_received - NEW.trx_quantity,
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

   IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod + NEW.trx_quantity_in_meter
        WHERE uuid = NEW.sfg_uuid;
    END IF;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS TRIGGER AS $$
DECLARE
    order_type_val TEXT;
BEGIN
    SELECT order_type INTO order_type_val
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    -- Update order_description
    UPDATE zipper.order_description
    SET
        -- tape_received = tape_received + OLD.trx_quantity - NEW.trx_quantity,
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod + NEW.trx_quantity_in_meter - OLD.trx_quantity_in_meter
        WHERE uuid = NEW.sfg_uuid;
    END IF;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS TRIGGER AS $$
DECLARE
    order_type_val TEXT;
BEGIN
    SELECT order_type INTO order_type_val
    FROM zipper.order_description
    WHERE uuid = OLD.order_description_uuid;
    -- Update order_description
    UPDATE zipper.order_description
    SET
        -- tape_received = tape_received + OLD.trx_quantity,
        tape_transferred = tape_transferred - OLD.trx_quantity
    WHERE order_description.uuid = OLD.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod - OLD.trx_quantity_in_meter
        WHERE uuid = OLD.sfg_uuid;
    END IF;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

-- Trigger for dyed_tape_transaction


CREATE OR REPLACE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger
AFTER INSERT ON zipper.dyed_tape_transaction
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();

CREATE OR REPLACE TRIGGER order_description_after_dyed_tape_transaction_update_trigger
AFTER UPDATE ON zipper.dyed_tape_transaction
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();

CREATE OR REPLACE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger
AFTER DELETE ON zipper.dyed_tape_transaction
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();

