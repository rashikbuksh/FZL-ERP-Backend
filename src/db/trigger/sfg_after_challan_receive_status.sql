-- * Inserted 
CREATE OR REPLACE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END,
        delivered = delivered - CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END
    WHERE uuid = OLD.sfg_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sfg_after_challan_receive_status_insert
AFTER INSERT ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();

CREATE OR REPLACE TRIGGER sfg_after_challan_receive_status_delete
AFTER DELETE ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();

CREATE OR REPLACE TRIGGER sfg_after_challan_receive_status_update
AFTER UPDATE ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();