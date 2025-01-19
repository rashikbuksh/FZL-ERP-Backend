-- * INSERTED IN LOCAL SERVER
CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock - NEW.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    IF (NEW.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity - NEW.trx_quantity,
            trx_quantity = trx_quantity + NEW.trx_quantity
        WHERE uuid = NEW.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting

    IF (NEW.trx_to = 'slider_assembly' AND NEW.purpose = 'slider') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity + NEW.trx_quantity,
            weight = weight + NEW.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF ((NEW.trx_to = 'tape_making' OR NEW.trx_to = 'tape_loom') AND NEW.purpose = 'tape') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity + NEW.trx_quantity
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

    IF (NEW.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity 
                - NEW.trx_quantity
                + OLD.trx_quantity,
            trx_quantity = trx_quantity
                + NEW.trx_quantity
                - OLD.trx_quantity
        WHERE uuid = NEW.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting
    IF (NEW.trx_to = 'slider_assembly' AND NEW.purpose = 'slider') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
                + NEW.trx_quantity
                - OLD.trx_quantity,
            weight = weight
                + NEW.weight
                - OLD.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF ((NEW.trx_to = 'tape_making' OR NEW.trx_to = 'tape_loom') AND NEW.purpose = 'tape') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity 
                + NEW.trx_quantity
                - OLD.trx_quantity
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

    IF (OLD.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity + OLD.trx_quantity,
            trx_quantity = trx_quantity - OLD.trx_quantity
        WHERE uuid = OLD.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting
    IF (OLD.trx_to = 'slider_assembly' AND OLD.purpose = 'slider') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity - OLD.trx_quantity,
            weight = weight - OLD.weight
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    IF ((OLD.trx_to = 'tape_making' OR OLD.trx_to = 'tape_loom') AND OLD.purpose = 'tape') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity - OLD.trx_quantity
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
