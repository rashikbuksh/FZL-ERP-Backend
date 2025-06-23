CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_funct() RETURNS TRIGGER AS $$
DECLARE
    batchType VARCHAR(255);
BEGIN
    SELECT batch_type INTO batchType FROM thread.batch WHERE uuid = NEW.batch_uuid;

    IF batchType = 'extra' THEN
        UPDATE thread.order_entry
        SET damage_quantity = damage_quantity + NEW.quantity
        WHERE uuid = NEW.order_entry_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry
AFTER INSERT ON thread.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_funct();