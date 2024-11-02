CREATE OR REPLACE FUNCTION slider.slider_stock_after_sfg_recipe_update() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.recipe_uuid IS NULL THEN 

        UPDATE slider.stock
        SET
            swatch_approved_quantity = swatch_approved_quantity + (SELECT quantity FROM zipper.order_entry WHERE uuid = NEW.order_entry_uuid)
        WHERE order_description_uuid = (SELECT order_description_uuid FROM zipper.order_entry WHERE uuid = NEW.order_entry_uuid);

    ELSIF NEW.recipe_uuid IS NULL THEN

        UPDATE slider.stock
        SET
            swatch_approved_quantity = swatch_approved_quantity - (SELECT quantity FROM zipper.order_entry WHERE uuid = NEW.order_entry_uuid)
        WHERE order_description_uuid = (SELECT order_description_uuid FROM zipper.order_entry WHERE uuid = OLD.order_entry_uuid);

    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER slider_stock_after_sfg_recipe_update
AFTER UPDATE OF recipe_uuid ON zipper.sfg
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_sfg_recipe_update();