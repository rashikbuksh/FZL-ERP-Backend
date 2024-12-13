CREATE OR REPLACE FUNCTION slider.slider_stock_after_transaction_insert () RETURNS TRIGGER AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT od.order_type INTO order_type 
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    LEFT JOIN zipper.order_description od ON fb.order_description_uuid = od.uuid
    WHERE ss.uuid = NEW.stock_uuid;
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END,
        sa_prod_weight = sa_prod_weight - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.weight ELSE 0 END,
        coloring_stock = coloring_stock - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
        coloring_stock_weight = coloring_stock_weight - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
    WHERE uuid = NEW.stock_uuid;

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'trx_to_finishing' THEN
        UPDATE slider.stock
        SET
            coloring_prod = coloring_prod - NEW.trx_quantity,
            coloring_prod_weight = coloring_prod_weight - NEW.weight,
            trx_to_finishing = trx_to_finishing + NEW.trx_quantity,
            trx_to_finishing_weight = trx_to_finishing_weight + NEW.weight
        WHERE uuid = NEW.stock_uuid;

        IF order_type = 'slider' THEN
            UPDATE zipper.finishing_batch_entry
            SET
                finishing_prod = finishing_prod + NEW.trx_quantity
            WHERE finishing_batch_entry_uuid = NEW.finishing_batch_entry_uuid;
        ELSE
            UPDATE zipper.finishing_batch
            SET
                slider_finishing_stock = slider_finishing_stock + NEW.trx_quantity
            WHERE uuid = (SELECT finishing_batch_uuid FROM slider.stock WHERE uuid = NEW.stock_uuid);
        END IF;
    END IF;

    IF NEW.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.weight ELSE 0 END
        WHERE uuid = NEW.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.trx_quantity ELSE 0 END,
            weight = weight - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.weight ELSE 0 END
        WHERE uuid = NEW.assembly_stock_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.slider_stock_after_transaction_delete () RETURNS TRIGGER AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT od.order_type INTO order_type 
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    LEFT JOIN zipper.order_description od ON fb.order_description_uuid = od.uuid
    WHERE ss.uuid = OLD.stock_uuid;
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod 
            + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        sa_prod_weight = sa_prod_weight 
            + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.weight ELSE 0 END
            - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.weight ELSE 0 END,
        coloring_stock = coloring_stock 
            + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock_weight = coloring_stock_weight
            + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
            - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
    WHERE uuid = OLD.stock_uuid;

    IF OLD.from_section = 'coloring_prod' AND OLD.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
            coloring_prod = coloring_prod + OLD.trx_quantity,
            coloring_prod_weight = coloring_prod_weight + OLD.weight,
            trx_to_finishing = trx_to_finishing - OLD.trx_quantity,
            trx_to_finishing_weight = trx_to_finishing_weight - OLD.weight
        WHERE uuid = OLD.stock_uuid;

        IF order_type = 'slider' THEN
            UPDATE zipper.finishing_batch_entry
            SET
                finishing_prod = finishing_prod - OLD.trx_quantity
            WHERE finishing_batch_entry_uuid = OLD.finishing_batch_entry_uuid;
        ELSE
            UPDATE zipper.finishing_batch
            SET
                slider_finishing_stock = slider_finishing_stock - OLD.trx_quantity
            WHERE uuid = (SELECT finishing_batch_uuid FROM slider.stock WHERE uuid = OLD.stock_uuid);
        END IF;
    END IF;

    IF OLD.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.weight ELSE 0 END
        WHERE uuid = OLD.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.trx_quantity ELSE 0 END,
            weight = weight + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.weight ELSE 0 END
        WHERE uuid = OLD.assembly_stock_uuid;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION slider.slider_stock_after_transaction_update () RETURNS TRIGGER AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT od.order_type INTO order_type 
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    LEFT JOIN zipper.order_description od ON fb.order_description_uuid = od.uuid
    WHERE ss.uuid = NEW.stock_uuid;
    --update slider.stock table
    UPDATE slider.stock
    SET
        
        sa_prod = sa_prod 
        - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        sa_prod_weight = sa_prod_weight
        - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.weight ELSE 0 END
        + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.weight ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.weight ELSE 0 END,
        coloring_stock = coloring_stock 
        - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock_weight = coloring_stock_weight
        - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
    WHERE uuid = NEW.stock_uuid;

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
            coloring_prod = coloring_prod - NEW.trx_quantity + OLD.trx_quantity,
            coloring_prod_weight = coloring_prod_weight - NEW.weight + OLD.weight,
            trx_to_finishing = trx_to_finishing + NEW.trx_quantity - OLD.trx_quantity,
            trx_to_finishing_weight = trx_to_finishing_weight + NEW.weight - OLD.weight
        WHERE uuid = NEW.stock_uuid;

        IF order_type = 'slider' THEN
            UPDATE zipper.finishing_batch_entry
            SET
                finishing_prod = finishing_prod + NEW.trx_quantity - OLD.trx_quantity
            WHERE finishing_batch_entry_uuid = NEW.finishing_batch_entry_uuid;
        ELSE
            UPDATE zipper.finishing_batch
            SET
                slider_finishing_stock = slider_finishing_stock - NEW.trx_quantity + OLD.trx_quantity
            WHERE uuid = (SELECT finishing_batch_uuid FROM slider.stock WHERE uuid = NEW.stock_uuid);
        END IF;
    END IF;

    -- assembly_stock_uuid -> OLD
    IF OLD.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock 
            - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight
            - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.weight ELSE 0 END
        WHERE uuid = OLD.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
            + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.trx_quantity ELSE 0 END,
            weight = weight
            + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.weight ELSE 0 END
        WHERE uuid = OLD.assembly_stock_uuid;
    END IF;

    -- assembly_stock_uuid -> NEW
    IF NEW.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.weight ELSE 0 END
        WHERE uuid = NEW.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
            - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.trx_quantity ELSE 0 END,
            weight = weight
            - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.weight ELSE 0 END
        WHERE uuid = NEW.assembly_stock_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER slider_stock_after_transaction_insert
AFTER INSERT ON slider.transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();

CREATE OR REPLACE TRIGGER slider_stock_after_transaction_delete
AFTER DELETE ON slider.transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();

CREATE OR REPLACE TRIGGER slider_stock_after_transaction_update
AFTER UPDATE ON slider.transaction
FOR EACH ROW
EXECUTE FUNCTION slider.slider_stock_after_transaction_update();