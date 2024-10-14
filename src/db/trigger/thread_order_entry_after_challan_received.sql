CREATE OR REPLACE FUNCTION thread_order_entry_after_challan_received_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE thread.order_entry
        SET
            warehouse = warehouse - CASE WHEN NEW.received = 1 THEN thread_order_entry.quantity ELSE 0 END,
            delivered = delivered + CASE WHEN NEW.received = 1 THEN thread_order_entry.quantity ELSE 0 END
        FROM 
            (
                SELECT order_entry.uuid, order_entry.quantity 
                FROM zipper.challan_entry 
                LEFT JOIN thread.order_entry ON thread.challan_entry.order_entry_uuid = thread.order_entry.uuid 
                WHERE thread.challan_entry.uuid = NEW.uuid
            ) as thread_order_entry
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread_order_entry_after_challan_entry_update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE thread.order_entry
        SET
            production_quantity = production_quantity + NEW.coning_production_quantity - OLD.coning_production_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION thread_order_entry_after_challan_entry_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE thread.order_entry
        SET
            production_quantity = production_quantity - OLD.coning_production_quantity
        WHERE
            uuid = OLD.order_entry_uuid;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_order_entry_after_challan_entry_insert
AFTER INSERT ON zipper.challan_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_challan_entry_insert();

CREATE OR REPLACE TRIGGER thread_order_entry_after_challan_entry_update
AFTER UPDATE ON zipper.challan_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_challan_entry_update();

CREATE OR REPLACE TRIGGER thread_order_entry_after_challan_entry_delete
AFTER DELETE ON zipper.challan_entry
FOR EACH ROW
EXECUTE FUNCTION thread_order_entry_after_challan_entry_delete();

--* Incomplete
