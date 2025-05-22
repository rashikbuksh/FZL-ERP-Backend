CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_update_funct() 
RETURNS TRIGGER AS $$

DECLARE
    item_for_gp TEXT;
BEGIN
    -- For Challan And zipper, thread
    SELECT
        pl.item_for INTO item_for_gp
    FROM
        delivery.packing_list pl
    WHERE
        pl.uuid = NEW.uuid;

    IF item_for_gp = 'thread' OR item_for_gp = 'sample_thread' THEN
        IF OLD.gate_pass = 0 AND NEW.gate_pass = 1 THEN
            UPDATE 
                thread.order_entry
            SET 
                delivered = delivered + ple.quantity,
                warehouse = warehouse - ple.quantity
            FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = order_entry.uuid;
        ELSIF OLD.gate_pass = 1 AND NEW.gate_pass = 0 THEN 
            UPDATE 
                thread.order_entry
            SET 
                delivered = delivered - ple.quantity,
                warehouse = warehouse - ple.quantity
            FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = order_entry.uuid;
        END IF;
    ELSE
        IF OLD.gate_pass = 0 AND NEW.gate_pass = 1 THEN
            UPDATE 
                zipper.sfg
            SET 
                delivered = delivered + ple.quantity,
                warehouse = warehouse - ple.quantity
            FROM 
                delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;
        ELSIF OLD.gate_pass = 1 AND NEW.gate_pass = 0 THEN 
            UPDATE 
                zipper.sfg
            SET 
                delivered = delivered - ple.quantity,
                warehouse = warehouse - ple.quantity
            FROM 
                delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;
        END IF;
    END IF;

    -- For packing_list_entry

    IF item_for_gp = 'thread' OR item_for_gp = 'sample_thread' THEN
        IF OLD.is_warehouse_received = FALSE AND NEW.is_warehouse_received = TRUE THEN
            UPDATE 
                thread.order_entry
            SET 
                warehouse = warehouse + ple.quantity
            FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = order_entry.uuid;
        ELSIF OLD.is_warehouse_received = TRUE AND NEW.is_warehouse_received = FALSE THEN 
            UPDATE 
                thread.order_entry
            SET 
                warehouse = warehouse - ple.quantity
            FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = order_entry.uuid;
        END IF;
    ELSE
        IF OLD.is_warehouse_received = FALSE AND NEW.is_warehouse_received = TRUE THEN
            UPDATE 
                zipper.sfg
            SET 
                warehouse = warehouse + ple.quantity
            FROM 
                delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;
        ELSIF OLD.is_warehouse_received = TRUE AND NEW.is_warehouse_received = FALSE THEN 
            UPDATE 
                zipper.sfg
            SET 
                warehouse = warehouse - ple.quantity
            FROM 
                delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;
        END IF;
    END IF;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delivery_challan_after_packing_list_update
AFTER UPDATE ON delivery.packing_list
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_update_funct();

CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_entry_insert_funct()
RETURNS TRIGGER AS $$
DECLARE
    item_for_gp TEXT;
    is_warehouse_received_gp BOOLEAN;
BEGIN
    -- For Challan And zipper, thread
    SELECT
        pl.item_for, pl.is_warehouse_received INTO item_for_gp, is_warehouse_received_gp
    FROM
        delivery.packing_list pl
    WHERE
        pl.uuid = NEW.packing_list_uuid;

    IF item_for_gp = 'thread' OR item_for_gp = 'sample_thread' THEN

        UPDATE 
            thread.order_entry
        SET 
            production_quantity = production_quantity - NEW.quantity
        WHERE 
            order_entry.uuid = NEW.thread_order_entry_uuid;

        IF is_warehouse_received_gp = TRUE THEN
            UPDATE 
                thread.order_entry
            SET 
                warehouse = warehouse + NEW.quantity
            WHERE 
                order_entry.uuid = NEW.thread_order_entry_uuid;
        END IF;
    ELSE

        UPDATE 
            zipper.sfg
        SET 
            finishing_prod = finishing_prod - NEW.quantity
        WHERE 
            sfg.uuid = NEW.sfg_uuid;

        IF is_warehouse_received_gp = TRUE THEN
            UPDATE 
                zipper.sfg
            SET 
                warehouse = warehouse + NEW.quantity
            WHERE 
                sfg.uuid = NEW.sfg_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delivery_challan_after_packing_list_entry_insert
AFTER INSERT ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_entry_insert_funct();

CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_entry_delete_funct()
RETURNS TRIGGER AS $$
DECLARE
    is_warehouse_received_gp BOOLEAN;
BEGIN
    -- For Challan And zipper, thread
    SELECT
        pl.is_warehouse_received INTO is_warehouse_received_gp
    FROM
        delivery.packing_list pl
    WHERE
        pl.uuid = OLD.packing_list_uuid;

    IF OLD.thread_order_entry_uuid IS NOT NULL THEN

        UPDATE 
            thread.order_entry te
        SET 
            production_quantity = production_quantity + OLD.quantity
        WHERE 
            te.uuid = OLD.thread_order_entry_uuid;

        IF is_warehouse_received_gp = TRUE THEN
            UPDATE 
                thread.order_entry te
            SET 
                warehouse = warehouse - OLD.quantity
            WHERE 
               te.uuid = OLD.thread_order_entry_uuid;
        END IF;
    ELSE

        UPDATE 
            zipper.sfg zs
        SET 
            finishing_prod = finishing_prod + OLD.quantity
        WHERE 
            zs.uuid = OLD.sfg_uuid;
            
        IF is_warehouse_received_gp = TRUE THEN
            UPDATE 
                zipper.sfg zs
            SET 
                warehouse = warehouse - OLD.quantity
            WHERE 
                zs.uuid = OLD.sfg_uuid;
        END IF;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delivery_challan_after_packing_list_entry_delete
AFTER DELETE ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_entry_delete_funct();

CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_entry_update_funct()
RETURNS TRIGGER AS $$
DECLARE
    is_warehouse_received_gp BOOLEAN;
BEGIN
    -- For Challan And zipper, thread
    SELECT
        pl.is_warehouse_received INTO is_warehouse_received_gp
    FROM
        delivery.packing_list pl
    WHERE
        pl.uuid = NEW.packing_list_uuid;

    IF NEW.thread_order_entry_uuid IS NOT NULL THEN

        UPDATE 
            thread.order_entry te
        SET 
            production_quantity = production_quantity + OLD.quantity - NEW.quantity
        WHERE 
            te.uuid = NEW.thread_order_entry_uuid;

        IF is_warehouse_received_gp = TRUE THEN
            UPDATE 
                thread.order_entry te
            SET 
                warehouse = warehouse - OLD.quantity + NEW.quantity
            WHERE 
               te.uuid = NEW.thread_order_entry_uuid;
        END IF;
    ELSE

        UPDATE 
            zipper.sfg zs
        SET 
            finishing_prod = finishing_prod + OLD.quantity - NEW.quantity
        WHERE 
            zs.uuid = NEW.sfg_uuid;
            
        IF is_warehouse_received_gp = TRUE THEN
            UPDATE 
                zipper.sfg zs
            SET 
                warehouse = warehouse - OLD.quantity + NEW.quantity
            WHERE 
                zs.uuid = NEW.sfg_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delivery_challan_after_packing_list_entry_update
AFTER UPDATE ON delivery.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_entry_update_funct();