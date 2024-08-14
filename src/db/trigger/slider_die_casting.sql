CREATE OR REPLACE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() 
RETURNS TRIGGER AS $$
BEGIN 
--update slider.die_casting table
UPDATE slider.die_casting
    SET 
    quantity = quantity + (NEW.cavity_goods * NEW.push)
    WHERE uuid = NEW.die_casting_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_die_casting_after_die_casting_production_delete()
RETURNS TRIGGER AS $$
BEGIN
--update slider.die_casting table
UPDATE slider.die_casting
    SET 
    quantity = quantity - (OLD.cavity_goods * OLD.push)
    WHERE uuid = OLD.die_casting_uuid;

RETURN OLD;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_die_casting_after_die_casting_production_update()
RETURNS TRIGGER AS $$

BEGIN

--update slider.die_casting table

UPDATE slider.die_casting
    SET 
    quantity = quantity + (NEW.cavity_goods * NEW.push) - (OLD.cavity_goods * OLD.push)
    WHERE uuid = NEW.die_casting_uuid;

RETURN NEW;
    END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER slider_die_casting_after_die_casting_production_insert
AFTER INSERT ON slider.die_casting_production
FOR EACH ROW
EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();

CREATE TRIGGER slider_die_casting_after_die_casting_production_delete
AFTER DELETE ON slider.die_casting_production
FOR EACH ROW
EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();

CREATE TRIGGER slider_die_casting_after_die_casting_production_update
AFTER UPDATE ON slider.die_casting_production
FOR EACH ROW
EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();


CREATE OR REPLACE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = CASE WHEN uuid = NEW.stock_uuid THEN sa_prod - NEW.trx_quantity ELSE sa_prod END,
        coloring_stock = CASE WHEN order_info_uuid = NEW.order_info_uuid THEN coloring_stock + NEW.trx_quantity ELSE coloring_stock END

    WHERE uuid = NEW.stock_uuid OR order_info_uuid = NEW.order_info_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;W;  
    

CREATE OR FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = CASE WHEN uuid = OLD.stock_uuid THEN sa_prod + OLD.trx_quantity ELSE sa_prod END,
        coloring_stock = CASE WHEN order_info_uuid = OLD.order_info_uuid THEN coloring_stock - OLD.trx_quantity ELSE coloring_stock END

    WHERE uuid = OLD.stock_uuid OR order_info_uuid = OLD.order_info_uuid;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS TRIGGER AS $$

BEGIN
    -- Update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = CASE WHEN uuid = NEW.stock_uuid THEN sa_prod - NEW.trx_quantity + OLD.trx_quantity ELSE sa_prod END,
        coloring_stock = CASE WHEN order_info_uuid = NEW.order_info_uuid THEN coloring_stock + NEW.trx_quantity - OLD.trx_quantity ELSE coloring_stock END

    WHERE uuid = NEW.stock_uuid OR order_info_uuid = NEW.order_info_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE TRIGGER slider_stock_after_coloring_transaction_insert
AFTER INSERT ON slider.coloring_transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();


CREATE TRIGGER slider_stock_after_coloring_transaction_delete
AFTER DELETE ON slider.coloring_transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();


CREATE TRIGGER slider_stock_after_coloring_transaction_update
AFTER UPDATE ON slider.coloring_transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();


