CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_update_funct() 
RETURNS TRIGGER AS $$

DECLARE
    challan_uuid_gp uuid;
BEGIN
    SELECT 
        uuid 
    INTO 
        challan_uuid_gp 
    FROM 
        delivery.challan 
    WHERE 
       uuid = NEW.challan_uuid;

    IF (SELECT 
            COUNT(*) 
        FROM 
            delivery.packing_list 
        WHERE 
            challan_uuid = challan_uuid_gp AND gate_pass != 1) = 0 THEN

        UPDATE 
            delivery.challan
        SET 
            gate_pass = 1 
        WHERE 
            uuid = challan_uuid_gp;
    END IF;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delivery_challan_after_packing_list_update
AFTER  UPDATE ON delivery.packing_list
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_update_funct();