-- * Inserted 
CREATE OR REPLACE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity FROM delivery.packing_list LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid WHERE packing_list.challan_uuid = NEW.uuid) as pl_sfg
    WHERE uuid = pl_sfg.sfg_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity FROM delivery.packing_list LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid WHERE packing_list.challan_uuid = OLD.uuid) as pl_sfg
    WHERE uuid = pl_sfg.sfg_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity FROM delivery.packing_list LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid WHERE packing_list.challan_uuid = NEW.uuid) as pl_sfg
    WHERE uuid = pl_sfg.sfg_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sfg_after_challan_receive_status_insert
AFTER INSERT ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();

CREATE OR REPLACE TRIGGER sfg_after_challan_receive_status_delete
AFTER DELETE ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();

CREATE OR REPLACE TRIGGER sfg_after_challan_receive_status_update
AFTER UPDATE ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();