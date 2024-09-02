CREATE OR REPLACE FUNCTION slider.slider_stock_after_slider_production_insert () RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.stock table for 'sa_prod' section
   
      IF NEW.section = 'sa_prod' THEN
            UPDATE slider.stock
            SET
                sa_prod = sa_prod + NEW.production_quantity,
                body_quantity =  body_quantity - NEW.production_quantity,
                cap_quantity = cap_quantity - NEW.production_quantity,
                puller_quantity = puller_quantity - NEW.production_quantity,
                link_quantity = link_quantity - NEW.production_quantity
            WHERE uuid = NEW.stock_uuid;
    END IF;

-- Update slider.stock table for 'coloring' section

    IF NEW.section = 'coloring' THEN

        UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity,
                coloring_prod = coloring_prod + NEW.production_quantity

            WHERE uuid = NEW.stock_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.slider_stock_after_slider_production_update () RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.stock table for 'sa_prod' section
    IF NEW.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod + NEW.production_quantity - OLD.production_quantity,
            body_quantity =  body_quantity - NEW.production_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity - NEW.production_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity - NEW.production_quantity + OLD.production_quantity,
            link_quantity = link_quantity - NEW.production_quantity + OLD.production_quantity
        WHERE uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF NEW.section = 'coloring' THEN
        UPDATE slider.stock
        SET
           coloring_stock = coloring_stock - NEW.production_quantity+ OLD.production_quantity,
            coloring_prod = coloring_prod + NEW.production_quantity- OLD.production_quantity
        WHERE uuid = NEW.stock_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_stock_after_slider_production_delete () RETURNS TRIGGER AS $$
BEGIN
   
    -- Update slider.stock table for 'sa_prod' section
    IF OLD.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod - OLD.production_quantity,
            body_quantity =  body_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity + OLD.production_quantity,
            link_quantity = link_quantity + OLD.production_quantity
        WHERE uuid = OLD.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF OLD.section = 'coloring' THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + OLD.production_quantity,
            coloring_prod = coloring_prod - OLD.production_quantity
        WHERE uuid = OLD.stock_uuid;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER slider_stock_after_slider_production_insert
AFTER INSERT ON slider.production
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();

CREATE  OR REPLACE TRIGGER slider_stock_after_slider_production_update
AFTER UPDATE ON slider.production
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();

CREATE  OR REPLACE TRIGGER slider_stock_after_slider_production_delete
AFTER DELETE ON slider.production
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();



    