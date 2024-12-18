-- * UPDATED IN LOCAL 

CREATE OR REPLACE FUNCTION slider.slider_stock_after_slider_production_insert () RETURNS TRIGGER AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT vodf.order_type INTO order_type
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON fb.uuid = ss.finishing_batch_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
    WHERE ss.uuid = NEW.stock_uuid;
    
    -- Update slider.stock table for 'sa_prod' section
    IF NEW.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod + NEW.production_quantity,
            sa_prod_weight = sa_prod_weight + NEW.weight,
            body_quantity = body_quantity - NEW.production_quantity,
            cap_quantity = cap_quantity - NEW.production_quantity,
            puller_quantity = puller_quantity - NEW.production_quantity,
            link_quantity = link_quantity - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity ELSE 0 END
        WHERE slider.stock.uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF NEW.section = 'coloring' THEN
        IF order_type = 'slider' THEN 
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight,
                coloring_prod = coloring_prod + NEW.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        ELSE
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight,
                box_pin_quantity = box_pin_quantity - CASE WHEN lower(vodf.end_type_name) = 'open end' THEN NEW.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity - CASE WHEN lower(vodf.end_type_name) = 'close end' THEN NEW.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity - (2 * NEW.production_quantity),
                coloring_prod = coloring_prod + NEW.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.slider_stock_after_slider_production_update () RETURNS TRIGGER AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT vodf.order_type INTO order_type
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON fb.uuid = ss.finishing_batch_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
    WHERE ss.uuid = NEW.stock_uuid;

    -- Update slider.stock table for 'sa_prod' section
    IF NEW.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod + NEW.production_quantity - OLD.production_quantity,
            sa_prod_weight = sa_prod_weight + NEW.weight - OLD.weight,
            body_quantity = body_quantity - NEW.production_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity - NEW.production_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity - NEW.production_quantity + OLD.production_quantity,
            link_quantity = link_quantity - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity ELSE 0 END + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity ELSE 0 END
        WHERE stock.uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF NEW.section = 'coloring' THEN
        IF order_type = 'slider' THEN 
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight + OLD.weight,
                coloring_prod = coloring_prod + NEW.production_quantity - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        ELSE
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight + OLD.weight,
                box_pin_quantity = box_pin_quantity - CASE WHEN lower(vodf.end_type_name) = 'open end' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity - CASE WHEN lower(vodf.end_type_name) = 'close end' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity - (2 * (NEW.production_quantity - OLD.production_quantity)),
                coloring_prod = coloring_prod + NEW.production_quantity - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_stock_after_slider_production_delete () RETURNS TRIGGER AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT vodf.order_type INTO order_type
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON fb.uuid = ss.finishing_batch_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
    WHERE ss.uuid = OLD.stock_uuid;
   
    -- Update slider.stock table for 'sa_prod' section
    IF OLD.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod - OLD.production_quantity,
            sa_prod_weight = sa_prod_weight - OLD.weight,
            body_quantity =  body_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity + OLD.production_quantity,
            link_quantity = link_quantity + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity ELSE 0 END
        FROM zipper.finishing_batch fb
        LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
        WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = OLD.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF OLD.section = 'coloring' THEN
        IF order_type = 'slider' THEN 
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight + OLD.weight,
                coloring_prod = coloring_prod - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = OLD.stock_uuid;
        ELSE
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight + OLD.weight,
                box_pin_quantity = box_pin_quantity + CASE WHEN lower(vodf.end_type_name) = 'open end' THEN OLD.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity + CASE WHEN lower(vodf.end_type_name) = 'close end' THEN OLD.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity + (2 * OLD.production_quantity),
                coloring_prod = coloring_prod - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = OLD.stock_uuid;
        END IF;
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
