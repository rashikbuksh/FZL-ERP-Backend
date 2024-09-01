CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_insert() RETURNS TRIGGER AS $$
BEGIN
UPDATE thread.order_entry
      
        SET
            production_quantity = production_quantity + NEW.coning_production_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_update() RETURNS TRIGGER AS $$
BEGIN
UPDATE thread.order_entry
        SET
            production_quantity = production_quantity + NEW.coning_production_quantity - OLD.coning_production_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_delete() RETURNS TRIGGER AS $$
BEGIN
UPDATE thread.order_entry
        SET
            production_quantity = production_quantity - OLD.coning_production_quantity
        WHERE
            uuid = OLD.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry_insert
AFTER INSERT ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_insert();

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry_update
AFTER UPDATE ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_update();

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry_delete
AFTER DELETE ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_delete();



CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_transfer_quantity_insert() RETURNS TRIGGER AS $$
BEGIN
UPDATE thread.order_entry
        SET
            transfer_quantity = transfer_quantity + NEW.transfer_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_transfer_quantity_update() RETURNS TRIGGER AS $$
BEGIN
UPDATE thread.order_entry
        SET
            transfer_quantity = transfer_quantity + NEW.transfer_quantity - OLD.transfer_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION thread_order_entry_after_batch_entry_transfer_quantity_delete() RETURNS TRIGGER AS $$
BEGIN
UPDATE thread.order_entry
        SET
            transfer_quantity = transfer_quantity - OLD.transfer_quantity
        WHERE
            uuid = OLD.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_insert
AFTER INSERT ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_transfer_quantity_insert();

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_update
AFTER UPDATE ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_transfer_quantity_update();

CREATE OR REPLACE TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_delete
AFTER DELETE ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_batch_entry_transfer_quantity_delete();




