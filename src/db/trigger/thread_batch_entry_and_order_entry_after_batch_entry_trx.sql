CREATE OR REPLACE FUNCTION thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS TRIGGER AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity + NEW.quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse + NEW.quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION thread_batch_entry_and_order_entry_after_batch_entry_trx_delete_funct() RETURNS TRIGGER AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity - OLD.quantity
    WHERE uuid = OLD.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse - OLD.quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);
    RETURN OLD;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION thread_batch_entry_and_order_entry_after_batch_entry_trx_update_funct() RETURNS TRIGGER AS $$
BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity - OLD.quantity + NEW.quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse - OLD.quantity + NEW.quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx
AFTER INSERT
ON thread.batch_entry_trx
FOR EACH ROW
EXECUTE FUNCTION thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();

CREATE OR REPLACE  TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete
AFTER DELETE
ON thread.batch_entry_trx
FOR EACH ROW
EXECUTE FUNCTION thread_batch_entry_and_order_entry_after_batch_entry_trx_delete_funct();

CREATE OR REPLACE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update
AFTER UPDATE
ON thread.batch_entry_trx
FOR EACH ROW
EXECUTE FUNCTION thread_batch_entry_and_order_entry_after_batch_entry_trx_update_funct();

