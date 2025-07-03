-- Create the function to reset all sequences
CREATE OR REPLACE FUNCTION public.reset_all_sequences() RETURNS void AS $$
DECLARE
    seq RECORD;
    cmd TEXT;
BEGIN
    FOR seq IN
        SELECT sequence_schema, sequence_name
        FROM information_schema.sequences
        WHERE
            sequence_schema NOT IN ('drizzle', 'audit', 'information_schema', 'pg_catalog')
            AND sequence_name NOT LIKE '%log%'
            AND sequence_name NOT LIKE 'drizzle_%'
    LOOP
        -- Build the command with proper schema and sequence name quoting
        cmd := 'ALTER SEQUENCE ' || quote_ident(seq.sequence_schema) || '.' || quote_ident(seq.sequence_name) || ' RESTART WITH 1';
        
        -- Execute with error handling
        BEGIN
            EXECUTE cmd;
            RAISE NOTICE 'Reset sequence: %.%', seq.sequence_schema, seq.sequence_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING 'Failed to reset sequence %.%: %', seq.sequence_schema, seq.sequence_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Sequence reset operation completed';
END;
$$ LANGUAGE plpgsql;

-- to reset all sequences
SELECT public.reset_all_sequences();
-- CREATE OR REPLACE FUNCTION public.preview_sequences_to_reset() RETURNS TABLE(schema_name TEXT, sequence_name TEXT, current_value BIGINT) AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         s.sequence_schema::TEXT,
--         s.sequence_name::TEXT,
--         COALESCE(
--             (SELECT last_value FROM pg_sequences WHERE schemaname = s.sequence_schema AND sequencename = s.sequence_name),
--             0
--         ) as current_value
--     FROM information_schema.sequences s
--     WHERE
--         s.sequence_schema NOT IN ('drizzle', 'audit', 'information_schema', 'pg_catalog')
--         AND s.sequence_name NOT LIKE '%log%'
--         AND s.sequence_name NOT LIKE 'drizzle_%'
--     ORDER BY s.sequence_schema, s.sequence_name;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Preview sequences before resetting:
-- -- SELECT * FROM public.preview_sequences_to_reset();