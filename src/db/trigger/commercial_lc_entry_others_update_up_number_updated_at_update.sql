
CREATE OR REPLACE FUNCTION commercial.update_up_number_updated_at()
RETURNS TRIGGER AS $$
	BEGIN
		NEW.up_number_updated_at = now();
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_up_number_updated_at 
BEFORE INSERT OR UPDATE OF up_number ON commercial.lc_entry_others
FOR EACH ROW
EXECUTE FUNCTION commercial.update_up_number_updated_at();

