CREATE OR REPLACE FUNCTION thread.order_entry_log_after_thread_order_entry_update_funct() 
RETURNS TRIGGER AS $$
BEGIN 
    IF (OLD.style IS DISTINCT FROM NEW.style OR
        OLD.color IS DISTINCT FROM NEW.color OR
        OLD.quantity IS DISTINCT FROM NEW.quantity OR
        OLD.company_price IS DISTINCT FROM NEW.company_price OR
        OLD.party_price IS DISTINCT FROM NEW.party_price OR
        OLD.created_by IS DISTINCT FROM NEW.created_by OR
        OLD.updated_at IS DISTINCT FROM NEW.updated_at) THEN

        INSERT INTO zipper.order_entry_log (
            thread_order_entry_uuid, 
            style, 
            color,  
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
            NEW.quantity, 
            NEW.company_price, 
            NEW.party_price, 
            NEW.created_by, 
            NEW.updated_at
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE OR REPLACE TRIGGER order_entry_log_after_thread_order_entry_update
AFTER UPDATE ON thread.order_entry
FOR EACH ROW
EXECUTE FUNCTION thread.order_entry_log_after_thread_order_entry_update_funct();