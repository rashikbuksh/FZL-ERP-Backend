-- * INSERTED IN BOTH DATABASES
CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock - NEW.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    -- update slider.die_casting if material is present in die casting
    IF (NEW.trx_to = 'die_casting') THEN
        UPDATE slider.die_casting
        SET
            quantity = quantity + NEW.trx_quantity,
            weight = weight + NEW.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock 
            - NEW.trx_quantity
            + OLD.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    -- update slider.die_casting if material is present in die casting
    IF (NEW.trx_to = 'die_casting') THEN
        UPDATE slider.die_casting
        SET
            quantity = quantity 
                + NEW.trx_quantity
                - OLD.trx_quantity,
            weight = weight
                + NEW.weight
                - OLD.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock + OLD.trx_quantity
    WHERE material_uuid = OLD.material_uuid;

    -- update slider.die_casting if material is present in die casting
    IF (OLD.trx_to = 'die_casting') THEN
        UPDATE slider.die_casting
        SET
            quantity = quantity - OLD.trx_quantity,
            weight = weight - OLD.weight
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER stock_after_material_trx_against_order_description_insert
AFTER INSERT ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();

CREATE OR REPLACE TRIGGER stock_after_material_trx_against_order_description_update
AFTER UPDATE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();

CREATE OR REPLACE TRIGGER stock_after_material_trx_against_order_description_delete
AFTER DELETE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
