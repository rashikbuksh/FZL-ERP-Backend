CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_update_funct() 
RETURNS TRIGGER AS $$

DECLARE
    challan_uuid_gp TEXT;
    old_gate_pass INTEGER;
BEGIN
    SELECT 
        uuid, gate_pass 
    INTO 
        challan_uuid_gp, old_gate_pass
    FROM 
        delivery.challan 
    WHERE 
       uuid = NEW.challan_uuid;

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
    ELSE
        UPDATE 
            delivery.challan
        SET 
            gate_pass = 1 
        WHERE 
            uuid = challan_uuid_gp;

        IF old_gate_pass = 0 THEN
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

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delivery_challan_after_packing_list_update
AFTER UPDATE ON delivery.packing_list
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_update_funct();