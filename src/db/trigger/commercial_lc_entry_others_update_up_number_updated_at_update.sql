-- * UPDATED IN LOCAL SERVER
CREATE OR REPLACE FUNCTION commercial.update_up_number_updated_at()
RETURNS TRIGGER AS $$
	BEGIN
		NEW.up_number_updated_at = to_char(now(), 'YYYY-MM-DD HH24:MI:SS');
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_up_number_updated_at 
BEFORE INSERT OR UPDATE OF up_number ON commercial.lc_entry_others
FOR EACH ROW
EXECUTE FUNCTION commercial.update_up_number_updated_at();

