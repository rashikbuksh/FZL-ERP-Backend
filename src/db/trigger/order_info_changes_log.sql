CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS log_order_info_audit_trigger ON zipper.order_info;

-- Create the trigger
CREATE TRIGGER log_order_info_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON zipper.order_info
    FOR EACH ROW EXECUTE FUNCTION zipper.log_order_info_changes();


-- For thread

CREATE OR REPLACE FUNCTION thread.order_info_log_after_thread_order_info_update_funct()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.CREATE OR REPLACE FUNCTION zipper.log_order_info_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            NEW.uuid, 'RECORD_CREATED', NULL, 'New record created', 'INSERT', NEW.created_by, NOW()
        );
        RETURN NEW;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        -- Log changes for each field that has been modified

        IF OLD.buyer_uuid IS DISTINCT FROM NEW.buyer_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'buyer_uuid', OLD.buyer_uuid::text, NEW.buyer_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.party_uuid IS DISTINCT FROM NEW.party_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'party_uuid', OLD.party_uuid::text, NEW.party_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_uuid IS DISTINCT FROM NEW.marketing_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_uuid', OLD.marketing_uuid::text, NEW.marketing_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.merchandiser_uuid IS DISTINCT FROM NEW.merchandiser_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'merchandiser_uuid', OLD.merchandiser_uuid::text, NEW.merchandiser_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_uuid IS DISTINCT FROM NEW.factory_uuid THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_uuid', OLD.factory_uuid::text, NEW.factory_uuid::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_sample IS DISTINCT FROM NEW.is_sample THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_sample', OLD.is_sample::text, NEW.is_sample::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_bill IS DISTINCT FROM NEW.is_bill THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_bill', OLD.is_bill::text, NEW.is_bill::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cash IS DISTINCT FROM NEW.is_cash THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cash', OLD.is_cash::text, NEW.is_cash::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.conversion_rate IS DISTINCT FROM NEW.conversion_rate THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'conversion_rate', OLD.conversion_rate::text, NEW.conversion_rate::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.marketing_priority IS DISTINCT FROM NEW.marketing_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'marketing_priority', OLD.marketing_priority, NEW.marketing_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.factory_priority IS DISTINCT FROM NEW.factory_priority THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'factory_priority', OLD.factory_priority, NEW.factory_priority, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'status', OLD.status::text, NEW.status::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'remarks', OLD.remarks, NEW.remarks, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.updated_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;, NOW());
        END IF;

        IF OLD.is_cancelled IS DISTINCT FROM NEW.is_cancelled THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_cancelled', OLD.is_cancelled::text, NEW.is_cancelled::text, 'UPDATE', NEW.created_by, NOW());
        END IF;

        IF OLD.sno_from_head_office IS DISTINCT FROM NEW.sno_from_head_office THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'sno_from_head_office', OLD.sno_from_head_office::text, NEW.sno_from_head_office::text, 'UPDATE', NEW.sno_from_head_office_by, NOW());
        END IF;

        IF OLD.receive_by_factory IS DISTINCT FROM NEW.receive_by_factory THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'receive_by_factory', OLD.receive_by_factory::text, NEW.receive_by_factory::text, 'UPDATE', NEW.receive_by_factory_by, NOW());
        END IF;

        IF OLD.production_pause IS DISTINCT FROM NEW.production_pause THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'production_pause', OLD.production_pause::text, NEW.production_pause::text, 'UPDATE', NEW.production_pause_by, NOW());
        END IF;

        IF OLD.is_swatch_attached IS DISTINCT FROM NEW.is_swatch_attached THEN
            INSERT INTO zipper.order_info_log (thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at)
            VALUES (NEW.uuid, 'is_swatch_attached', OLD.is_swatch_attached::text, NEW.is_swatch_attached::text, 'UPDATE', NEW.created_by, NOW());
        END IF;

        -- Set updated_at to current timestamp
        NEW.updated_at = NOW();
        
        RETURN NEW;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        INSERT INTO zipper.order_info_log (
            thread_order_info_uuid, field_name, old_value, new_value, operation, changed_by, changed_at
        ) VALUES (
            OLD.uuid, 'RECORD_DELETED', 'Record existed', NULL, 'DELETE', OLD.created_by, NOW()
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;

$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS log_thread_order_info_audit_trigger ON thread.order_info;

-- Create the trigger
CREATE TRIGGER log_thread_order_info_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON thread.order_info
    FOR EACH ROW EXECUTE FUNCTION thread.order_info_log_after_thread_order_info_update_funct();