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

    IF (NEW.purpose = 'slider') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity + NEW.trx_quantity,
            weight = weight + NEW.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF (NEW.purpose = 'tape') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity + NEW.trx_quantity
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    -- Transfer to finishing floor

    IF(NEW.purpose = 'finishing_floor') THEN
        UPDATE zipper.order_description
        SET
            tape_transferred = tape_transferred + NEW.trx_quantity
        WHERE uuid = NEW.order_description_uuid;
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
    IF (NEW.purpose = 'slider') THEN
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

    IF (NEW.purpose = 'tape') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity 
                + NEW.trx_quantity
                - OLD.trx_quantity
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF(NEW.purpose = 'finishing_floor') THEN
        UPDATE zipper.order_description
        SET
            tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
        WHERE uuid = NEW.order_description_uuid;
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
    IF (OLD.purpose = 'slider') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity - OLD.trx_quantity,
            weight = weight - OLD.weight
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    IF (OLD.purpose = 'tape') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity - OLD.trx_quantity
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    IF(OLD.purpose = 'finishing_floor') THEN
        UPDATE zipper.order_description
        SET
            tape_transferred = tape_transferred + OLD.trx_quantity
        WHERE uuid = OLD.order_description_uuid;
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
