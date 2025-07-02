-- Main audit trigger function
CREATE OR REPLACE FUNCTION audit.audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_record RECORD;
    new_record RECORD;
    excluded_columns TEXT[] := ARRAY['updated_at', 'created_at']; -- Columns to skip in UPDATE operations
    column_name TEXT;
    old_value JSONB;
    new_value JSONB;
    record_id TEXT;
BEGIN
    -- Determine the record ID - try different common primary key column names
    IF TG_OP = 'DELETE' THEN
        old_record := OLD;
        -- Try to extract record ID from various possible primary key columns
        BEGIN
            record_id := (to_jsonb(OLD) ->> 'uuid');
            IF record_id IS NULL THEN
                record_id := (to_jsonb(OLD) ->> 'id');
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                record_id := NULL;
        END;
    ELSE
        new_record := NEW;
        -- Try to extract record ID from various possible primary key columns
        BEGIN
            record_id := (to_jsonb(NEW) ->> 'uuid');
            IF record_id IS NULL THEN
                record_id := (to_jsonb(NEW) ->> 'id');
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                record_id := NULL;
        END;
    END IF;
    
    -- Skip if we can't determine record ID
    IF record_id IS NULL THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Handle different operations
    IF TG_OP = 'INSERT' THEN
        -- Log the entire new record as a single entry
        INSERT INTO audit.global_audit_log (
            schema_name, table_name, record_id, operation, new_value
        ) VALUES (
            TG_TABLE_SCHEMA, TG_TABLE_NAME, record_id, 'INSERT', to_jsonb(NEW)
        );
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log each changed column separately
        FOR column_name IN 
            SELECT attname FROM pg_attribute 
            WHERE attrelid = TG_RELID 
            AND attnum > 0 
            AND NOT attisdropped
            AND attname != ALL(excluded_columns)
        LOOP
            -- Get old and new values for this column using JSONB extraction
            old_value := to_jsonb(OLD) -> column_name;
            new_value := to_jsonb(NEW) -> column_name;
            
            -- Only log if the value actually changed
            IF old_value IS DISTINCT FROM new_value THEN
                INSERT INTO audit.global_audit_log (
                    schema_name, table_name, record_id, operation, column_name,
                    old_value, new_value
                ) VALUES (
                    TG_TABLE_SCHEMA, TG_TABLE_NAME, record_id, 'UPDATE', column_name,
                    old_value, new_value
                );
            END IF;
        END LOOP;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Log the entire old record as a single entry
        INSERT INTO audit.global_audit_log (
            schema_name, table_name, record_id, operation, old_value
        ) VALUES (
            TG_TABLE_SCHEMA, TG_TABLE_NAME, record_id, 'DELETE', to_jsonb(OLD)
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to create audit triggers for all tables
CREATE OR REPLACE FUNCTION audit.create_audit_triggers()
RETURNS VOID AS $$
DECLARE
    table_record RECORD;
    trigger_name TEXT;
BEGIN
    -- Loop through all tables in specified schemas
    FOR table_record IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname IN (
            'hr', 'public', 'zipper', 'slider', 'thread', 'material', 
            'lab_dip', 'delivery', 'commercial', 'purchase'
        )
        AND tablename NOT LIKE 'v_%'  -- Skip views
        AND tablename NOT LIKE '%_sequence'  -- Skip sequences
    LOOP
        trigger_name := format('audit_trigger_%s_%s', table_record.schemaname, table_record.tablename);
        
        -- Drop existing trigger if it exists
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', 
            trigger_name, table_record.schemaname, table_record.tablename);
        
        -- Create the trigger
        EXECUTE format('CREATE TRIGGER %I 
            AFTER INSERT OR UPDATE OR DELETE ON %I.%I
            FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function()',
            trigger_name, table_record.schemaname, table_record.tablename);
            
        RAISE NOTICE 'Created audit trigger for %.%', table_record.schemaname, table_record.tablename;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to remove all audit triggers
CREATE OR REPLACE FUNCTION audit.remove_audit_triggers()
RETURNS VOID AS $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT n.nspname as schemaname, c.relname as tablename, t.tgname as triggername
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE t.tgname LIKE 'audit_trigger_%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', 
            trigger_record.triggername, trigger_record.schemaname, trigger_record.tablename);
        RAISE NOTICE 'Removed audit trigger % from %.%', 
            trigger_record.triggername, trigger_record.schemaname, trigger_record.tablename;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create triggers for all existing tables
SELECT audit.create_audit_triggers ();

-- Function to enable/disable audit logging
CREATE OR REPLACE FUNCTION audit.set_audit_enabled(enabled BOOLEAN)
RETURNS VOID AS $$
BEGIN
    IF enabled THEN
        PERFORM audit.create_audit_triggers();
        RAISE NOTICE 'Audit logging enabled';
    ELSE
        PERFORM audit.remove_audit_triggers();
        RAISE NOTICE 'Audit logging disabled';
    END IF;
END;
$$ LANGUAGE plpgsql;