CREATE OR REPLACE FUNCTION slider.stock_after_zipper_finishing_batch_entry_delete_funct () RETURNS TRIGGER AS $$
BEGIN
    UPDATE slider.stock
    SET
        batch_quantity = batch_quantity - OLD.quantity
    WHERE 
        uuid = (SELECT finishing_batch_uuid 
                FROM zipper.finishing_batch_entry 
                WHERE uuid = OLD.uuid);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER stock_after_zipper_finishing_batch_entry_delete
AFTER DELETE ON zipper.finishing_batch_entry
FOR EACH ROW
EXECUTE FUNCTION slider.stock_after_zipper_finishing_batch_entry_delete_funct();

