CREATE OR REPLACE FUNCTION delivery.delivery_challan_after_packing_list_update_funct() 
RETURNS TRIGGER AS $$

DECLARE
    challan_uuid_gp uuid;
BEGIN
    SELECT 
        challan_uuid INTO challan_uuid_gp 
    FROM 
        delivery.packing_list 
    WHERE 
        challan_uuid = NEW.challan_uuid;

    IF (SELECT 
            COUNT(*) 
        FROM 
            delivery.packing_list 
        WHERE 
            delivery.packing_list.challan_uuid = challan_uuid_gp AND delivery.packing_list.gate_pass != 1) = 0 THEN

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
AFTER INSERT OR UPDATE ON delivery.packing_list
FOR EACH ROW
EXECUTE FUNCTION delivery.delivery_challan_after_packing_list_update_funct();