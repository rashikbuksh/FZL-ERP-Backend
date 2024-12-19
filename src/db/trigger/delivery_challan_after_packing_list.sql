CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_update_funct() 
RETURNS TRIGGER AS $$

DECLARE
    challan_uuid_gp TEXT;
    old_gate_pass INTEGER;
    item_for_gp TEXT;
BEGIN
    -- For Challan
    SELECT 
        challan.uuid, challan.gate_pass, pl.item_for
    INTO 
        challan_uuid_gp, old_gate_pass, item_for_gp
    FROM 
        delivery.challan 
    LEFT JOIN delivery.packing_list pl ON challan_uuid = challan.uuid
    WHERE 
       challan.uuid = NEW.challan_uuid;

    IF  (
            SELECT 
                COUNT(*) 
            FROM 
                delivery.packing_list 
            WHERE 
                challan_uuid = challan_uuid_gp AND gate_pass = 0
        ) > 0 THEN

        UPDATE 
            delivery.challan
        SET 
            gate_pass = 0 
        WHERE 
            uuid = challan_uuid_gp;

        IF old_gate_pass = 1 THEN

            IF item_for_gp = 'thread' OR item_for_gp = 'sample_thread' THEN
                UPDATE thread.order_entry
                SET
                    warehouse = warehouse + ple.quantity,
                    delivered = delivered - ple.quantity
                FROM
                    delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON ple.packing_list_uuid = pl.uuid
                WHERE
                    pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = thread.order_entry.uuid;
            ELSE
                UPDATE 
                    zipper.sfg
                SET 
                    warehouse = warehouse + ple.quantity,
                    delivered = delivered - ple.quantity
                FROM 
                    delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON ple.packing_list_uuid = pl.uuid 
                WHERE 
                    pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;

            END IF;

        END IF;
    ELSE
        UPDATE 
            delivery.challan
        SET 
            gate_pass = 1 
        WHERE 
            uuid = challan_uuid_gp;

        IF old_gate_pass = 0 THEN

            IF item_for_gp = 'thread' OR item_for_gp = 'sample_thread' THEN
                UPDATE thread.order_entry
                SET
                    warehouse = warehouse - ple.quantity,
                    delivered = delivered + ple.quantity
                FROM
                    delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON ple.packing_list_uuid = pl.uuid
                WHERE
                    pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = thread.order_entry.uuid;
            ELSE
                UPDATE 
                    zipper.sfg
                SET 
                    warehouse = warehouse - ple.quantity,
                    delivered = delivered + ple.quantity
                FROM 
                    delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON ple.packing_list_uuid = pl.uuid 
                WHERE 
                    pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;
            END IF;
            
        END IF;
    END IF;

    -- For packing_list_entry

    IF item_for_gp = 'thread' OR item_for_gp = 'sample_thread' THEN
        IF OLD.is_warehouse_received = FALSE AND NEW.is_warehouse_received = TRUE THEN
            UPDATE 
                thread.order_entry
            SET 
                warehouse = warehouse + ple.quantity,
                production_quantity = production_quantity - ple.quantity
            FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.thread_order_entry_uuid = order_entry.uuid;
        ELSIF OLD.is_warehouse_received = TRUE AND NEW.is_warehouse_received = FALSE THEN 
            UPDATE 
                thread.order_entry
            SET 
                warehouse = warehouse - ple.quantity,
                production_quantity = production_quantity + ple.quantity
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
                warehouse = warehouse + ple.quantity,
                finishing_prod = finishing_prod - ple.quantity
            FROM 
                delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            WHERE 
                pl.uuid = NEW.uuid AND ple.sfg_uuid = sfg.uuid;
        ELSIF OLD.is_warehouse_received = TRUE AND NEW.is_warehouse_received = FALSE THEN 
            UPDATE 
                zipper.sfg
            SET 
                warehouse = warehouse - ple.quantity,
                finishing_prod = finishing_prod + ple.quantity
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