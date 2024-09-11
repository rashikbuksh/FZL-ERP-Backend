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
    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'finishing_stock'
    THEN
        UPDATE slider.stock
        SET
        coloring_prod = coloring_prod - NEW.trx_quantity,
        finishing_stock = finishing_stock + NEW.trx_quantity

        WHERE uuid = NEW.to_stock_uuid;

        UPDATE zipper.order_description
        SET
        slider_finishing_stock = slider_finishing_stock + NEW.trx_quantity
        WHERE uuid = (SELECT order_description_uuid FROM slider.stock WHERE uuid = NEW.to_stock_uuid);
        
    END IF;
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

    IF OLD.from_section = 'coloring_prod' AND OLD.to_section = 'finishing_stock'
    THEN
        UPDATE slider.stock
        SET
        coloring_prod = coloring_prod + OLD.trx_quantity,
        finishing_stock = finishing_stock - OLD.trx_quantity

        WHERE uuid = OLD.to_stock_uuid;

        UPDATE zipper.order_description
        SET
        slider_finishing_stock = slider_finishing_stock - OLD.trx_quantity
        WHERE uuid = (SELECT order_description_uuid FROM slider.stock WHERE uuid = OLD.to_stock_uuid);
        
    END IF;

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

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'finishing_stock'
    THEN
        UPDATE slider.stock
        SET
        coloring_prod = coloring_prod - NEW.trx_quantity,
        finishing_stock = finishing_stock + NEW.trx_quantity

        WHERE uuid = NEW.to_stock_uuid;

        UPDATE zipper.order_description
        SET
        slider_finishing_stock = slider_finishing_stock + NEW.trx_quantity
        WHERE uuid = (SELECT order_description_uuid FROM slider.stock WHERE uuid = NEW.to_stock_uuid);
        
    END IF;

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