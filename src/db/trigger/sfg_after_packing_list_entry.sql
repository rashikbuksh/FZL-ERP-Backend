-- * Inserted 
CREATE OR REPLACE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    IF NEW.sfg_uuid IS NOT NULL THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse + NEW.quantity,
            finishing_prod = finishing_prod - NEW.quantity
        WHERE uuid = NEW.sfg_uuid;
    ELSE
        UPDATE thread.order_entry
        SET
            warehouse = warehouse + NEW.quantity,
            carton_quantity = carton_of_production_quantity + NEW.quantity,
            production_quantity = production_quantity - NEW.quantity,
            carton_of_production_quantity = carton_of_production_quantity - NEW.quantity
        WHERE uuid = NEW.thread_order_entry_uuid;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    IF NEW.sfg_uuid IS NOT NULL THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse + OLD.quantity,
            finishing_prod = finishing_prod - OLD.quantity
        WHERE uuid = OLD.sfg_uuid;
    ELSE
        UPDATE thread.order_entry
        SET
            warehouse = warehouse - OLD.quantity,
            carton_quantity = carton_of_production_quantity - OLD.quantity,
            production_quantity = production_quantity + OLD.quantity,
            carton_of_production_quantity = carton_of_production_quantity + OLD.quantity
        WHERE uuid = OLD.thread_order_entry_uuid;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    IF NEW.sfg_uuid IS NOT NULL THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse + NEW.quantity - OLD.quantity,
            finishing_prod = finishing_prod - NEW.quantity + OLD.quantity
        WHERE uuid = NEW.sfg_uuid;
    ELSE
        UPDATE thread.order_entry
        SET
            warehouse = warehouse + NEW.quantity - OLD.quantity,
            carton_quantity = carton_of_production_quantity + NEW.quantity - OLD.quantity,
            production_quantity = production_quantity - NEW.quantity + OLD.quantity,
            carton_of_production_quantity = carton_of_production_quantity - NEW.quantity + OLD.quantity
        WHERE uuid = NEW.thread_order_entry_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sfg_after_packing_list_entry_insert
AFTER INSERT ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_insert_function();

CREATE OR REPLACE TRIGGER sfg_after_packing_list_entry_delete
AFTER DELETE ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_delete_function();

CREATE OR REPLACE TRIGGER sfg_after_packing_list_entry_update
AFTER UPDATE ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_update_function();