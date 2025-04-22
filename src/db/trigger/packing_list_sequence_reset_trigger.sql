-- ! STILL IN TESTING PHASE

CREATE OR REPLACE FUNCTION delivery.reset_packing_list_sequence()
RETURNS TRIGGER AS $$
DECLARE
    last_packing_list_month TEXT;
    current_month TEXT;
BEGIN
    -- Get the current month
    current_month := TO_CHAR(NEW.created_at, 'YYYY-MM');

    -- Get the month of the last packing list
    SELECT TO_CHAR(created_at, 'YYYY-MM') INTO last_packing_list_month
    FROM delivery.packing_list
    ORDER BY created_at DESC
    LIMIT 1;

    -- Check if the last packing list's month is different from the current month
    IF last_packing_list_month IS NOT NULL AND last_packing_list_month != current_month THEN
        -- Reset the sequence to 1
        ALTER SEQUENCE delivery.packing_list_sequence RESTART WITH 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reset_packing_list_sequence_trigger
BEFORE INSERT ON delivery.packing_list
FOR EACH ROW
EXECUTE FUNCTION delivery.reset_packing_list_sequence();
