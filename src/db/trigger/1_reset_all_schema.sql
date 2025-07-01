-- Create the function to reset all sequences
CREATE OR REPLACE FUNCTION public.reset_all_sequences() RETURNS void AS $$
DECLARE
    seq RECORD;
BEGIN
    FOR seq IN
        SELECT sequence_schema, sequence_name
        FROM information_schema.sequences
        WHERE
            sequence_schema != 'drizzle'
            AND sequence_name NOT LIKE '%log%'
    LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(seq.sequence_schema) || '.' || quote_ident(seq.sequence_name) || ' RESTART WITH 1;';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- to reset all sequences
SELECT public.reset_all_sequences();