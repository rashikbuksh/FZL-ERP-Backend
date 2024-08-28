------ * Inserted
CREATE OR REPLACE FUNCTION  slider.slider_die_casting_after_trx_against_stock_insert()
RETURNS TRIGGER AS $$
BEGIN
--update slider.die_casting table
UPDATE slider.die_casting
    SET 
    quantity_in_sa = quantity_in_sa + NEW.quantity,
    quantity = quantity - NEW.quantity
    WHERE uuid = NEW.die_casting_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete()
RETURNS TRIGGER AS $$
BEGIN
--update slider.die_casting table
UPDATE slider.die_casting
    SET 
    quantity_in_sa = quantity_in_sa - OLD.quantity,
    quantity = quantity + OLD.quantity
    WHERE uuid = OLD.die_casting_uuid;
RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_die_casting_after_trx_against_stock_update()
RETURNS TRIGGER AS $$
BEGIN
--update slider.die_casting table
UPDATE slider.die_casting
    SET 
    quantity_in_sa = quantity_in_sa + NEW.quantity - OLD.quantity,
    quantity = quantity - NEW.quantity + OLD.quantity
    WHERE uuid = NEW.die_casting_uuid;

RETURN NEW;
    END;


$$ LANGUAGE plpgsql;

CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert
AFTER INSERT ON slider.trx_against_stock
FOR EACH ROW
EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();

CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete
AFTER DELETE ON slider.trx_against_stock
FOR EACH ROW
EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();

CREATE TRIGGER slider_die_casting_after_trx_against_stock_update
AFTER UPDATE ON slider.trx_against_stock
FOR EACH ROW
EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();


