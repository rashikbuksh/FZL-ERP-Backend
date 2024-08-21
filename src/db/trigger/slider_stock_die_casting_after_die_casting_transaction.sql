CREATE OR REPLACE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS TRIGGER AS $$
DECLARE d_is_body INT;
        d_is_puller INT;
        d_is_cap INT;
        d_is_link INT;
        d_h_bottom INT;
        d_is_u_top INT;
        d_is_box_pin INT;
        d_is_two_way_pin INT;
BEGIN
    --update slider.stock table
    UPDATE slider.die_casting
    SET
        quantity = quantity - NEW.trx_quantity
    WHERE uuid = NEW.die_casting_uuid;

    SELECT 
        is_body,
        is_puller,
        is_cap,
        is_link,
        is_h_bottom,
        is_u_top,
        is_box_pin,
        is_two_way_pin

    INTO 
        d_is_body,
        d_is_puller,
        d_is_cap,
        d_is_link,
        d_h_bottom,
        d_is_u_top,
        d_is_box_pin,
        d_is_two_way_pin

    FROM slider.die_casting
    WHERE uuid = NEW.die_casting_uuid;

    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            + CASE WHEN d_is_body = 1 THEN NEW.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            + CASE WHEN d_is_puller = 1 THEN NEW.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            + CASE WHEN d_is_cap = 1 THEN NEW.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            + CASE WHEN d_is_link = 1 THEN NEW.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            + CASE WHEN d_h_bottom = 1 THEN NEW.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            + CASE WHEN d_is_u_top = 1 THEN NEW.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            + CASE WHEN d_is_box_pin = 1 THEN NEW.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            + CASE WHEN d_is_two_way_pin = 1 THEN NEW.trx_quantity ELSE 0 END

    WHERE uuid = NEW.stock_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS TRIGGER AS $$
DECLARE d_is_body INT;
        d_is_puller INT;
        d_is_cap INT;
        d_is_link INT;
        d_h_bottom INT;
        d_is_u_top INT;
        d_is_box_pin INT;
        d_is_two_way_pin INT;
BEGIN
 UPDATE slider.die_casting
    SET
        quantity = quantity + OLD.trx_quantity
    WHERE uuid = OLD.die_casting_uuid;

    SELECT 
        is_body,
        is_puller,
        is_cap,
        is_link,
        is_h_bottom,
        is_u_top,
        is_box_pin,
        is_two_way_pin

    INTO
        d_is_body,
        d_is_puller,
        d_is_cap,
        d_is_link,
        d_h_bottom,
        d_is_u_top,
        d_is_box_pin,
        d_is_two_way_pin

    FROM slider.die_casting
    WHERE uuid = OLD.die_casting_uuid;

    --update slider.stock table
    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            - CASE WHEN d_is_body = 1 THEN OLD.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            - CASE WHEN d_is_puller = 1 THEN OLD.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            - CASE WHEN d_is_cap = 1 THEN OLD.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            - CASE WHEN d_is_link = 1 THEN OLD.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            - CASE WHEN d_h_bottom = 1 THEN OLD.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            - CASE WHEN d_is_u_top = 1 THEN OLD.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            - CASE WHEN d_is_box_pin = 1 THEN OLD.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            - CASE WHEN d_is_two_way_pin = 1 THEN OLD.trx_quantity ELSE 0 END

    WHERE uuid = OLD.stock_uuid;


RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS TRIGGER AS $$
DECLARE d_is_body INT;
        d_is_puller INT;
        d_is_cap INT;
        d_is_link INT;
        d_h_bottom INT;
        d_is_u_top INT;
        d_is_box_pin INT;
        d_is_two_way_pin INT;
BEGIN
    --update slider.stock table
    UPDATE slider.die_casting
    SET
        quantity = quantity - NEW.trx_quantity + OLD.trx_quantity

    WHERE uuid = NEW.die_casting_uuid;

    SELECT 
        is_body,
        is_puller,
        is_cap,
        is_link,
        is_h_bottom,
        is_u_top,
        is_box_pin,
        is_two_way_pin

    INTO
        d_is_body,
        d_is_puller,
        d_is_cap,
        d_is_link,
        d_h_bottom,
        d_is_u_top,
        d_is_box_pin,
        d_is_two_way_pin

    FROM slider.die_casting

    WHERE uuid = NEW.die_casting_uuid;

    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            + CASE WHEN d_is_body = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_body = 1 THEN OLD.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            + CASE WHEN d_is_puller = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_puller = 1 THEN OLD.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            + CASE WHEN d_is_cap = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_cap = 1 THEN OLD.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            + CASE WHEN d_is_link = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_link = 1 THEN OLD.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            + CASE WHEN d_h_bottom = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_h_bottom = 1 THEN OLD.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            + CASE WHEN d_is_u_top = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_u_top = 1 THEN OLD.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            + CASE WHEN d_is_box_pin = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_box_pin = 1 THEN OLD.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            + CASE WHEN d_is_two_way_pin = 1 THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN d_is_two_way_pin = 1 THEN OLD.trx_quantity ELSE 0 END

    WHERE uuid = NEW.stock_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE TRIGGER slider_stock_after_die_casting_transaction_insert
AFTER INSERT ON slider.transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();

CREATE TRIGGER slider_stock_after_die_casting_transaction_delete
AFTER DELETE ON slider.transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();

CREATE TRIGGER slider_stock_after_die_casting_transaction_update
AFTER UPDATE ON slider.transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();

  

  





        
       
 




   