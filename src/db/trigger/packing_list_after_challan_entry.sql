-- * Inserted 
CREATE OR REPLACE FUNCTION delivery.packing_list_after_challan_entry_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update delivery,packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NEW.challan_uuid
    WHERE uuid = NEW.packing_list_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.packing_list_after_challan_entry_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update delivery,packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NULL
    WHERE uuid = OLD.packing_list_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.packing_list_after_challan_entry_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update delivery,packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NEW.challan_uuid
    WHERE uuid = NEW.packing_list_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER packing_list_after_challan_entry_insert
AFTER INSERT ON delivery.challan_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.packing_list_after_challan_entry_insert_function();

CREATE OR REPLACE TRIGGER packing_list_after_challan_entry_delete
AFTER DELETE ON delivery.challan_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.packing_list_after_challan_entry_delete_function();

CREATE OR REPLACE TRIGGER packing_list_after_challan_entry_update
AFTER UPDATE ON delivery.challan_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.packing_list_after_challan_entry_update_function();