CREATE OR REPLACE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS TRIGGER AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.die_casting
    SET
        quantity = quantity - NEW.trx_quantity
    WHERE uuid = NEW.die_casting_uuid;

    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            + CASE WHEN NEW.type = 'body' THEN NEW.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            + CASE WHEN NEW.type = 'puller' THEN NEW.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            + CASE WHEN NEW.type = 'cap' THEN NEW.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            + CASE WHEN NEW.type = 'link' THEN NEW.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            + CASE WHEN NEW.type = 'h_bottom' THEN NEW.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            + CASE WHEN NEW.type = 'u_top' THEN NEW.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            + CASE WHEN NEW.type = 'box_pin' THEN NEW.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            + CASE WHEN NEW.type = 'two_way_pin' THEN NEW.trx_quantity ELSE 0 END

    WHERE uuid = NEW.stock_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS TRIGGER AS $$
BEGIN
 UPDATE slider.die_casting
    SET
        quantity = quantity + OLD.trx_quantity
    WHERE uuid = OLD.die_casting_uuid;

    --update slider.stock table
    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            - CASE WHEN OLD.type = 'body' THEN OLD.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            - CASE WHEN OLD.type = 'puller' THEN OLD.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            - CASE WHEN OLD.type = 'cap' THEN OLD.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            - CASE WHEN OLD.type = 'link' THEN OLD.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            - CASE WHEN OLD.type = 'h_bottom' THEN OLD.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            - CASE WHEN OLD.type = 'u_top' THEN OLD.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            - CASE WHEN OLD.type = 'box_pin' THEN OLD.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            - CASE WHEN OLD.type = 'two_way_pin' THEN OLD.trx_quantity ELSE 0 END

    WHERE uuid = OLD.stock_uuid;


RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS TRIGGER AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.die_casting
    SET
        quantity = quantity - NEW.trx_quantity + OLD.trx_quantity

    WHERE uuid = NEW.die_casting_uuid;

    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            + CASE WHEN NEW.type = 'body' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'body' THEN OLD.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            + CASE WHEN NEW.type = 'puller' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'puller' THEN OLD.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            + CASE WHEN NEW.type = 'cap' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'cap' THEN OLD.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            + CASE WHEN NEW.type = 'link' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'link' THEN OLD.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            + CASE WHEN NEW.type = 'h_bottom' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'h_bottom' THEN OLD.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            + CASE WHEN NEW.type = 'u_top' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'u_top' THEN OLD.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            + CASE WHEN NEW.type = 'box_pin' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'box_pin' THEN OLD.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            + CASE WHEN NEW.type = 'two_way_pin' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN OLD.type = 'two_way_pin' THEN OLD.trx_quantity ELSE 0 END

    WHERE uuid = NEW.stock_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE TRIGGER slider_stock_after_die_casting_transaction_insert
AFTER INSERT ON slider.die_casting_transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();

CREATE TRIGGER slider_stock_after_die_casting_transaction_delete
AFTER DELETE ON slider.die_casting_transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();

CREATE TRIGGER slider_stock_after_die_casting_transaction_update
AFTER UPDATE ON slider.die_casting_transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();
