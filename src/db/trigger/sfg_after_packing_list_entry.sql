CREATE OR REPLACE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + NEW.quantity,
        finishing_prod = finishing_prod - NEW.quantity
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - OLD.quantity,
        finishing_prod = finishing_prod + OLD.quantity
    WHERE uuid = OLD.sfg_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - OLD.quantity + NEW.quantity,
        finishing_prod = finishing_prod + OLD.quantity - NEW.quantity
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
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