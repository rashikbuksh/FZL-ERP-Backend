-- * Inserted 
CREATE OR REPLACE FUNCTION delivery.sfg_and_packing_list_after_challan_insert_function() RETURNS TRIGGER AS $$
DECLARE 
    pl_sfg RECORD;
BEGIN
    SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity, packing_list.item_for, packing_list_entry.thread_order_entry_uuid
    INTO pl_sfg
    FROM delivery.packing_list 
    LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
    WHERE packing_list.challan_uuid = NEW.uuid;
    -- Update zipper.sfg
    IF NEW.receive_status = 1 THEN
        IF pl_sfg.item_for = 'thread' OR pl_sfg.item_for = 'sample_thread' THEN
            UPDATE thread.order_entry
            SET
                warehouse = warehouse - pl_sfg.quantity,
                delivered = delivered + pl_sfg.quantity
            WHERE thread.order_entry.uuid = pl_sfg.thread_order_entry_uuid;
        ELSE
            UPDATE zipper.sfg
            SET
                warehouse = warehouse - pl_sfg.quantity,
                delivered = delivered + pl_sfg.quantity
            WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delivery.sfg_and_packing_list_after_challan_delete_function() RETURNS TRIGGER AS $$
DECLARE 
    pl_sfg RECORD;
BEGIN
    SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity, packing_list.item_for, packing_list_entry.thread_order_entry_uuid
    INTO pl_sfg
    FROM delivery.packing_list
    LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
    WHERE packing_list.challan_uuid = OLD.uuid;
    -- Update zipper.sfg
    IF OLD.receive_status = 1 THEN
        IF pl_sfg.item_for = 'thread' OR pl_sfg.item_for = 'sample_thread' THEN
            UPDATE thread.order_entry
            SET
                warehouse = warehouse + pl_sfg.quantity,
                delivered = delivered - pl_sfg.quantity
            WHERE thread.order_entry.uuid = pl_sfg.thread_order_entry_uuid;
        ELSE
            UPDATE zipper.sfg
            SET
                warehouse = warehouse + pl_sfg.quantity,
                delivered = delivered - pl_sfg.quantity
            WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
        END IF;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delivery.sfg_and_packing_list_after_challan_update_function() RETURNS TRIGGER AS $$
DECLARE 
    pl_sfg RECORD;
BEGIN
    SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity, packing_list.item_for, packing_list_entry.thread_order_entry_uuid
    INTO pl_sfg
    FROM delivery.packing_list
    LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
    WHERE packing_list.challan_uuid = NEW.uuid;
    -- Update zipper.sfg
        IF pl_sfg.item_for = 'thread' OR pl_sfg.item_for = 'sample_thread' THEN
            UPDATE thread.order_entry
            SET
                warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
                delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
            WHERE thread.order_entry.uuid = pl_sfg.thread_order_entry_uuid;
        ELSE
            UPDATE zipper.sfg
            SET
                warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
                delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
            WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
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