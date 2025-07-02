-- Global audit logging system
-- This migration creates a comprehensive audit system that logs ALL database changes

-- Create audit schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS audit;

-- Create global audit log table
CREATE TABLE IF NOT EXISTS audit.global_audit_log (
    id SERIAL PRIMARY KEY,
    
    -- Table information
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    
    -- Operation details
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    column_name TEXT, -- NULL for INSERT/DELETE, specific column for UPDATE
    
    -- Values
    old_value JSONB, -- Previous value (NULL for INSERT)
    new_value JSONB, -- New value (NULL for DELETE)
    
    -- Change metadata
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Audit metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    remarks TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_global_audit_log_schema_table ON audit.global_audit_log(schema_name, table_name);
CREATE INDEX IF NOT EXISTS idx_global_audit_log_record_id ON audit.global_audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_global_audit_log_changed_at ON audit.global_audit_log(changed_at);
CREATE INDEX IF NOT EXISTS idx_global_audit_log_operation ON audit.global_audit_log(operation);

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
    -- Determine the record ID (assumes 'uuid' or 'id' column exists)
    IF TG_OP = 'DELETE' THEN
        old_record := OLD;
        record_id := COALESCE(OLD.uuid::TEXT, OLD.id::TEXT);
    ELSE
        new_record := NEW;
        record_id := COALESCE(NEW.uuid::TEXT, NEW.id::TEXT);
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
            -- Get old and new values for this column
            EXECUTE format('SELECT ($1).%I', column_name) USING OLD INTO old_value;
            EXECUTE format('SELECT ($1).%I', column_name) USING NEW INTO new_value;
            
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
        SELECT schemaname, tablename, triggername
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE triggername LIKE 'audit_trigger_%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', 
            trigger_record.triggername, trigger_record.schemaname, trigger_record.tablename);
        RAISE NOTICE 'Removed audit trigger % from %.%', 
            trigger_record.triggername, trigger_record.schemaname, trigger_record.tablename;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create summary view for easier querying
CREATE OR REPLACE VIEW audit.v_audit_summary AS
SELECT 
    schema_name,
    table_name,
    record_id,
    COUNT(*) as total_changes,
    MIN(changed_at) as first_change,
    MAX(changed_at) as last_change,
    STRING_AGG(DISTINCT operation, ', ' ORDER BY operation) as operations
FROM audit.global_audit_log gal
GROUP BY schema_name, table_name, record_id;

-- Create detailed change view
CREATE OR REPLACE VIEW audit.v_audit_details AS
SELECT 
    gal.id,
    gal.schema_name,
    gal.table_name,
    gal.record_id,
    gal.operation,
    gal.column_name,
    gal.old_value,
    gal.new_value,
    gal.changed_at
FROM audit.global_audit_log gal
ORDER BY gal.changed_at DESC;

-- Execute the function to create triggers for all existing tables
SELECT audit.create_audit_triggers();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA audit TO PUBLIC;
GRANT SELECT ON audit.global_audit_log TO PUBLIC;
GRANT SELECT ON audit.v_audit_summary TO PUBLIC;
GRANT SELECT ON audit.v_audit_details TO PUBLIC;

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

COMMENT ON SCHEMA audit IS 'Global audit logging system for tracking all database changes';
COMMENT ON TABLE audit.global_audit_log IS 'Comprehensive audit log capturing all INSERT, UPDATE, and DELETE operations across all tables';
COMMENT ON FUNCTION audit.audit_trigger_function() IS 'Main trigger function that captures database changes and logs them to the audit table';
COMMENT ON FUNCTION audit.create_audit_triggers() IS 'Creates audit triggers on all tables in specified schemas';
COMMENT ON FUNCTION audit.remove_audit_triggers() IS 'Removes all audit triggers from the database';
COMMENT ON FUNCTION audit.set_audit_enabled(BOOLEAN) IS 'Enable or disable audit logging system';
