-- Trigger to automatically create monthly utility records
-- This trigger will be called manually or by a scheduled job to create utility records for each month

-- * Function to generate a random 15-character UUID
CREATE OR REPLACE FUNCTION generate_15_digit_uuid()
RETURNS VARCHAR AS $$
DECLARE
    result VARCHAR;
BEGIN
    SELECT substring(md5(random()::text), 1, 15) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- * Won't use it for now
-- CREATE OR REPLACE FUNCTION maintain.create_monthly_utility_record()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     start_date DATE;
--     end_date DATE;
--     current_date_iter DATE;
--     records_created INTEGER := 0;
--     utility_exists BOOLEAN;
-- BEGIN
--     -- Get the first and last day of the current month
--     start_date := DATE_TRUNC('month', CURRENT_DATE)::DATE;
--     end_date := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
--     -- Loop through each day of the month
--     current_date_iter := start_date;
    
--     WHILE current_date_iter <= end_date LOOP
--         -- Check if utility record already exists for this date
--         SELECT EXISTS(
--             SELECT 1 FROM maintain.utility 
--             WHERE date = current_date_iter
--         ) INTO utility_exists;
        
--         -- Only create if record doesn't exist
--         IF NOT utility_exists THEN
--             -- Insert new utility record for this date (only uuid and date)
--             INSERT INTO maintain.utility (
--                 uuid,
--                 date
--             ) VALUES (
--                 generate_15_digit_uuid(),
--                 current_date_iter
--             );
            
--             records_created := records_created + 1;
--         END IF;
        
--         -- Move to next day
--         current_date_iter := current_date_iter + INTERVAL '1 day';
--     END LOOP;
    
--     RAISE NOTICE 'Created % utility records for month: % to %', records_created, start_date, end_date;
    
--     RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- Create a function to manually trigger utility creation for specific date
CREATE OR REPLACE FUNCTION maintain.create_utility_for_date(target_month DATE)
RETURNS VOID AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    current_date_iter DATE;
    records_created INTEGER := 0;
    utility_exists BOOLEAN;
BEGIN
    -- Get the first and last day of the specified month
    start_date := DATE_TRUNC('month', target_month)::DATE;
    end_date := (DATE_TRUNC('month', target_month) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    -- Loop through each day of the month
    current_date_iter := start_date;
    
    WHILE current_date_iter <= end_date LOOP
        -- Check if utility record already exists for this date
        SELECT EXISTS(
            SELECT 1 FROM maintain.utility 
            WHERE date = current_date_iter
        ) INTO utility_exists;
        
        -- Only create if record doesn't exist
        IF NOT utility_exists THEN
            -- Insert new utility record for this date (only uuid and date)
            INSERT INTO maintain.utility (
                uuid,
                date,
                created_at
            ) VALUES (
                generate_15_digit_uuid(),
                current_date_iter,
                current_date_iter
            );
            
            records_created := records_created + 1;
        END IF;
        
        -- Move to next day
        current_date_iter := current_date_iter + INTERVAL '1 day';
    END LOOP;
    
    RAISE NOTICE 'Created % utility records for month: % to %', records_created, start_date, end_date;
END;
$$ LANGUAGE plpgsql;

-- Create for current month
SELECT maintain.create_utility_for_date(current_date);

-- Example usage to create utility records:
-- To create for current month (all days): SELECT maintain.create_monthly_utility_record();
-- To create for specific month (all days): SELECT maintain.create_utility_for_date('2025-01-01'::DATE);
-- To create for multiple months:
-- SELECT maintain.create_utility_for_date(generate_series('2025-01-01'::DATE, '2025-12-01'::DATE, '1 month'::INTERVAL)::DATE);

-- Note: Records are created with only UUID and date fields for EVERY DAY of the month
-- For January (31 days), it will create 31 records
-- For February (28/29 days), it will create 28/29 records
-- All other fields (previous_date, off_day, created_at, created_by, remarks) will be NULL
-- The function prevents duplicate records for existing dates
-- Each day gets its own record with unique UUID

-- If you want this to run automatically on the first day of each month,
-- you would need to set up a cron job or scheduled task that calls:
-- SELECT maintain.create_monthly_utility_record();
