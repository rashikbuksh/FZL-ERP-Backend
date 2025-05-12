CREATE OR REPLACE FUNCTION delivery.delivery_quantity_return_insert() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_entry_uuid IS NOT NULL THEN 
        UPDATE zipper.order_entry
        SET 
            fresh_quantity = fresh_quantity + NEW.fresh_quantity,
            repair_quantity = repair_quantity + NEW.repair_quantity
        WHERE uuid = NEW.order_entry_uuid;
    ELSIF NEW.thread_order_entry_uuid IS NOT NULL THEN
        UPDATE thread.order_entry
        SET 
            fresh_quantity = fresh_quantity + NEW.fresh_quantity,
            repair_quantity = repair_quantity + NEW.repair_quantity
        WHERE uuid = NEW.thread_order_entry_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_quantity_return_insert_trigger
AFTER INSERT ON delivery.quantity_return
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_quantity_return_insert();

CREATE OR REPLACE FUNCTION delivery.delivery_quantity_return_update() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_entry_uuid IS NOT NULL THEN 
        UPDATE zipper.order_entry
        SET 
            fresh_quantity = fresh_quantity - OLD.fresh_quantity + NEW.fresh_quantity,
            repair_quantity = repair_quantity - OLD.repair_quantity + NEW.repair_quantity
        WHERE uuid = NEW.order_entry_uuid;
    ELSIF NEW.thread_order_entry_uuid IS NOT NULL THEN
        UPDATE thread.order_entry
        SET 
            fresh_quantity = fresh_quantity - OLD.fresh_quantity + NEW.fresh_quantity,
            repair_quantity = repair_quantity - OLD.repair_quantity + NEW.repair_quantity
        WHERE uuid = NEW.thread_order_entry_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_quantity_return_update_trigger
AFTER UPDATE ON delivery.quantity_return
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_quantity_return_update();

CREATE OR REPLACE FUNCTION delivery.delivery_quantity_return_delete() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.order_entry_uuid IS NOT NULL THEN 
        UPDATE zipper.order_entry
        SET 
            fresh_quantity = fresh_quantity - OLD.fresh_quantity,
            repair_quantity = repair_quantity - OLD.repair_quantity
        WHERE uuid = OLD.order_entry_uuid;
    ELSIF OLD.thread_order_entry_uuid IS NOT NULL THEN
        UPDATE thread.order_entry
        SET 
            fresh_quantity = fresh_quantity - OLD.fresh_quantity,
            repair_quantity = repair_quantity - OLD.repair_quantity
        WHERE uuid = OLD.thread_order_entry_uuid;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_quantity_return_delete_trigger
AFTER DELETE ON delivery.quantity_return
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_quantity_return_delete();