-- * Inserted * -- 
CREATE OR REPLACE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() returns TRIGGER AS $$
BEGIN

    UPDATE zipper.tape_coil
    SET
        quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil - NEW.trx_quantity ELSE quantity_in_coil END,
        quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity - NEW.trx_quantity END
    FROM public.properties
    WHERE tape_coil.uuid = NEW.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;
    -- TODO: if is_multi_color is 1 then Do not update the zipper.order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() returns TRIGGER AS $$
BEGIN
    UPDATE zipper.tape_coil
        SET
            quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil + OLD.trx_quantity ELSE quantity_in_coil END,
            quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity + OLD.trx_quantity END
        FROM public.properties
        WHERE tape_coil.uuid = OLD.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;

        UPDATE zipper.order_description
        SET
            tape_received = tape_received - OLD.trx_quantity
        WHERE uuid = OLD.order_description_uuid;

        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() returns TRIGGER AS $$
BEGIN
    UPDATE zipper.tape_coil
    SET
        quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil + OLD.trx_quantity - NEW.trx_quantity ELSE quantity_in_coil END,
        quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity + OLD.trx_quantity - NEW.trx_quantity END
    FROM public.properties
    WHERE tape_coil.uuid = NEW.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;

    UPDATE zipper.order_description
    SET
        tape_received = tape_received - OLD.trx_quantity + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tape_coil_to_dyeing_after_insert
AFTER INSERT ON zipper.tape_coil_to_dyeing
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();

CREATE OR REPLACE TRIGGER tape_coil_to_dyeing_after_delete
AFTER DELETE ON zipper.tape_coil_to_dyeing
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();

CREATE OR REPLACE TRIGGER tape_coil_to_dyeing_after_update
AFTER UPDATE ON zipper.tape_coil_to_dyeing
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();