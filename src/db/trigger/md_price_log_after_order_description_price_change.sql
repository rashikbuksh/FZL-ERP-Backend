CREATE OR REPLACE FUNCTION zipper.md_price_log_after_order_description_price_change_funct()
RETURNS TRIGGER AS $$
BEGIN
    /*
      Log a row ONLY when at least one of the three price fields actually changed
      AND there is at least one non-zero value among OLD or NEW (prevents logging
      meaningless 0 -> 0 updates).
      This addresses the issue where rows with all 0 values were being logged.
    */
    IF (
        (   OLD.md_price          IS DISTINCT FROM NEW.md_price
         OR OLD.mkt_company_price IS DISTINCT FROM NEW.mkt_company_price
         OR OLD.mkt_party_price   IS DISTINCT FROM NEW.mkt_party_price
        )
        AND (
            COALESCE(OLD.md_price,0) > 0
         OR COALESCE(OLD.mkt_company_price,0) > 0
         OR COALESCE(OLD.mkt_party_price,0) > 0
        )
    ) THEN
        INSERT INTO zipper.md_price_log (
            order_description_uuid,
            md_price,
            mkt_company_price,
            mkt_party_price,
            created_by,
            created_at
        ) VALUES (
            NEW.uuid,
            OLD.md_price,
            OLD.mkt_company_price,
            OLD.mkt_party_price,
            NEW.updated_by,
            NEW.updated_at
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
    
-- Create the trigger
CREATE OR REPLACE TRIGGER md_price_log_after_zipper_order_description_update
AFTER UPDATE ON zipper.order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.md_price_log_after_order_description_price_change_funct();