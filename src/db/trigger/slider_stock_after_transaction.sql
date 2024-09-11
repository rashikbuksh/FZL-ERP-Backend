CREATE OR REPLACE FUNCTION slider.slider_stock_after_transaction_insert () RETURNS TRIGGER AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END,
        coloring_stock = coloring_stock - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
        coloring_prod = coloring_prod - CASE WHEN NEW.from_section = 'coloring_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_prod' THEN NEW.trx_quantity ELSE 0 END,
        trx_to_finishing = trx_to_finishing - CASE WHEN NEW.from_section = 'finishing' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'finishing' THEN NEW.trx_quantity ELSE 0 END

    WHERE uuid = NEW.stock_uuid;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.slider_stock_after_transaction_delete () RETURNS TRIGGER AS $$

BEGIN
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock = coloring_stock + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        coloring_prod = coloring_prod + CASE WHEN OLD.from_section = 'coloring_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        trx_to_finishing = trx_to_finishing + CASE WHEN OLD.from_section = 'finishing' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'finishing' THEN OLD.trx_quantity ELSE 0 END

    WHERE uuid = OLD.stock_uuid;

RETURN OLD;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_stock_after_transaction_update () RETURNS TRIGGER AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.stock
    SET
        
        sa_prod = sa_prod 
        - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock = coloring_stock 
        - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        coloring_prod = coloring_prod 
        - CASE WHEN NEW.from_section = 'coloring_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        trx_to_finishing = trx_to_finishing 
        - CASE WHEN NEW.from_section = 'finishing' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'finishing' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'finishing' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'finishing' THEN OLD.trx_quantity ELSE 0 END

    WHERE uuid = NEW.stock_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER slider_stock_after_transaction_insert
AFTER INSERT ON slider.transaction
FOR EACH ROW

EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();

CREATE TRIGGER slider_stock_after_transaction_delete
AFTER DELETE ON slider.transaction
FOR EACH ROW

EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();

CREATE TRIGGER slider_stock_after_transaction_update
AFTER UPDATE ON slider.transaction
FOR EACH ROW

EXECUTE FUNCTION slider.slider_stock_after_transaction_update();