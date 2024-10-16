-- * NEED FIX

CREATE OR REPLACE FUNCTION thread_order_entry_after_challan_received() RETURNS TRIGGER AS $$
BEGIN
    UPDATE thread.order_entry
        SET
            warehouse = warehouse - CASE WHEN NEW.received = 1 THEN thread_order_entry.quantity ELSE 0 END + CASE WHEN OLD.received = 1 THEN thread_order_entry.quantity ELSE 0 END,
            delivered = delivered + CASE WHEN NEW.received = 1 THEN thread_order_entry.quantity ELSE 0 END - CASE WHEN OLD.received = 1 THEN thread_order_entry.quantity ELSE 0 END
        FROM 
            (
                SELECT order_entry.uuid, challan_entry.quantity 
                FROM thread.challan_entry 
                LEFT JOIN thread.order_entry ON thread.challan_entry.order_entry_uuid = thread.order_entry.uuid 
                LEFT JOIN thread.challan ON thread.challan_entry.challan_uuid = thread.challan.uuid
                WHERE thread.challan.uuid = NEW.uuid
            ) as thread_order_entry
        WHERE
            thread.order_entry.uuid = thread_order_entry.uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_order_entry_after_challan_received
AFTER UPDATE OF received ON thread.challan
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_challan_received();