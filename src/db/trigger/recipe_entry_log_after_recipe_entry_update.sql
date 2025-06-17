CREATE OR REPLACE FUNCTION lab_dip.recipe_entry_log_after_recipe_entry_update_funct() 
RETURNS TRIGGER AS $$
BEGIN 
    IF (
        OLD.quantity IS DISTINCT FROM NEW.quantity OR 
        OLD.updated_at IS DISTINCT FROM NEW.updated_at OR 
        OLD.updated_by IS DISTINCT FROM NEW.updated_by OR 
        OLD.remarks IS DISTINCT FROM NEW.remarks
    ) THEN

        INSERT INTO lab_dip.recipe_entry_log (
            recipe_entry_uuid,
            quantity,
            updated_at,
            updated_by,
            remarks
        )
        VALUES (
            NEW.uuid,
            NEW.quantity,
            NEW.updated_at,
            NEW.updated_by,
            NEW.remarks
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE OR REPLACE TRIGGER recipe_entry_log_after_recipe_entry_update
AFTER UPDATE ON lab_dip.recipe_entry
FOR EACH ROW
EXECUTE FUNCTION lab_dip.recipe_entry_log_after_recipe_entry_update_funct();