-- * Inserted 
CREATE OR REPLACE FUNCTION delivery.sfg_and_packing_list_after_challan_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper.sfg
    IF NEW.receive_status = 1 THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse - pl_sfg.quantity,
            delivered = delivered + pl_sfg.quantity
        FROM (
            SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity 
            FROM delivery.packing_list 
            LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
            WHERE packing_list.challan_uuid = NEW.uuid
        ) as pl_sfg
        WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
    END IF;

    -- Update delivery.packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NEW.challan_uuid
    WHERE uuid = NEW.packing_list_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_and_packing_list_after_challan_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper.sfg
    IF OLD.receive_status = 1 THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse + pl_sfg.quantity,
            delivered = delivered - pl_sfg.quantity
        FROM (
            SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity 
            FROM delivery.packing_list 
            LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
            WHERE packing_list.challan_uuid = OLD.uuid
        ) as pl_sfg
        WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
    END IF;

    -- Set challan_uuid to NULL in delivery.packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NULL
    WHERE challan_uuid = OLD.uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delivery.sfg_and_packing_list_after_challan_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper.sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (
        SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity 
        FROM delivery.packing_list 
        LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
        WHERE packing_list.challan_uuid = NEW.uuid
    ) as pl_sfg
    WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;

    -- Update delivery.packing_list
    IF NEW.challan_uuid IS NOT NULL THEN
        UPDATE delivery.packing_list
        SET
            challan_uuid = NEW.challan_uuid
        WHERE uuid = NEW.packing_list_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sfg_and_packing_list_after_challan_insert
AFTER INSERT ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_and_packing_list_after_challan_insert_function();

CREATE OR REPLACE TRIGGER sfg_and_packing_list_after_challan_delete
AFTER DELETE ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_and_packing_list_after_challan_delete_function();

CREATE OR REPLACE TRIGGER sfg_and_packing_list_after_challan_update
AFTER UPDATE ON delivery.challan
FOR EACH ROW
EXECUTE FUNCTION delivery.sfg_and_packing_list_after_challan_update_function();