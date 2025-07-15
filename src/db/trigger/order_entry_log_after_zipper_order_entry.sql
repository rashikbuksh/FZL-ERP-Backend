CREATE OR REPLACE FUNCTION zipper.order_entry_log_after_zipper_order_entry_update_funct() 
RETURNS TRIGGER AS $$
BEGIN 
    IF (OLD.style IS DISTINCT FROM NEW.style OR
        OLD.color IS DISTINCT FROM NEW.color OR
        OLD.color_ref IS DISTINCT FROM NEW.color_ref OR
        OLD.size IS DISTINCT FROM NEW.size OR
        OLD.quantity IS DISTINCT FROM NEW.quantity OR
        OLD.company_price IS DISTINCT FROM NEW.company_price OR
        OLD.party_price IS DISTINCT FROM NEW.party_price OR
        OLD.created_by IS DISTINCT FROM NEW.created_by OR
        OLD.updated_at IS DISTINCT FROM NEW.updated_at) THEN

        INSERT INTO zipper.order_entry_log (
            order_entry_uuid, 
            style, 
            color, 
            color_ref,
            size, 
            quantity, 
            company_price, 
            party_price, 
            created_by, 
            created_at
        )
        VALUES (
            NEW.uuid, 
            NEW.style, 
            NEW.color, 
            NEW.color_ref,
            NEW.size, 
            NEW.quantity, 
            NEW.company_price, 
            NEW.party_price, 
            NEW.created_by, 
            COALESCE(NEW.updated_at, NEW.created_at)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE OR REPLACE TRIGGER order_entry_log_after_zipper_order_entry_update
AFTER UPDATE ON zipper.order_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.order_entry_log_after_zipper_order_entry_update_funct();