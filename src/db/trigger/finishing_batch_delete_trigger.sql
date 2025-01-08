-- Create the trigger function
CREATE OR REPLACE FUNCTION trg_before_delete_finishing_batch()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete from finishing_batch_transaction
    DELETE FROM zipper.finishing_batch_transaction
    WHERE finishing_batch_entry_uuid IN (
        SELECT uuid FROM zipper.finishing_batch_entry
        WHERE finishing_batch_uuid = OLD.uuid
    );

    -- Delete from finishing_batch_production
    DELETE FROM zipper.finishing_batch_production
    WHERE finishing_batch_entry_uuid IN (
        SELECT uuid FROM zipper.finishing_batch_entry
        WHERE finishing_batch_uuid = OLD.uuid
    );

    -- Delete from finishing_batch_entry
    DELETE FROM zipper.finishing_batch_entry
    WHERE finishing_batch_uuid = OLD.uuid;

    DELETE FROM slider.stock
    WHERE finishing_batch_uuid = OLD.uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the finishing_batch table
CREATE TRIGGER trg_before_delete_finishing_batch
BEFORE DELETE ON zipper.finishing_batch
FOR EACH ROW
EXECUTE FUNCTION trg_before_delete_finishing_batch();
