CREATE OR REPLACE FUNCTION zipper.zipper_order_description_after_finishing_batch_update () RETURNS TRIGGER AS $$

BEGIN
    UPDATE zipper.order_description
    SET
        slider_finishing_stock = NEW.slider_finishing_stock
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_order_description_after_finishing_batch_update
AFTER UPDATE ON zipper.finishing_batch
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_order_description_after_finishing_batch_update();