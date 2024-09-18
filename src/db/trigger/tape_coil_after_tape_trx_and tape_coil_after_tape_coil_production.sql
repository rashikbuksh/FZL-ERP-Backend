
CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET

        quantity = quantity  
        - NEW.trx_quantity,

        trx_quantity_in_coil = trx_quantity_in_coil 
        + NEW.trx_quantity

    WHERE tape_coil.uuid = NEW.tape_coil_uuid;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity + OLD.trx_quantity,

        trx_quantity_in_coil = trx_quantity_in_coil 
        - OLD.trx_quantity

    WHERE tape_coil.uuid = OLD.tape_coil_uuid;

RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity - NEW.trx_quantity + OLD.trx_quantity,

        trx_quantity_in_coil = trx_quantity_in_coil 
            + NEW.trx_quantity
            - OLD.trx_quantity

    WHERE tape_coil.uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER tape_coil_after_tape_trx_insert
AFTER INSERT ON zipper.tape_trx
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();

CREATE TRIGGER tape_coil_after_tape_trx_delete
AFTER DELETE ON zipper.tape_trx
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();

CREATE TRIGGER tape_coil_after_tape_trx_update
AFTER UPDATE ON zipper.tape_trx
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();


CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity 
        + CASE WHEN NEW.section = 'tape' THEN NEW.production_quantity ELSE 0 END,

        trx_quantity_in_coil = trx_quantity_in_coil 
        - CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity + NEW.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil 
        + CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity ELSE 0 END

    WHERE uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity 
        - CASE WHEN OLD.section = 'tape' THEN OLD.production_quantity ELSE 0 END,

        trx_quantity_in_coil = trx_quantity_in_coil 
        + CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity + OLD.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil 
        - CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity ELSE 0 END

    WHERE uuid = OLD.tape_coil_uuid;

RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity 
        + CASE WHEN NEW.section = 'tape' THEN NEW.production_quantity ELSE 0 END
        - CASE WHEN OLD.section = 'tape' THEN OLD.production_quantity ELSE 0 END,

        trx_quantity_in_coil = trx_quantity_in_coil 
        - CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity + NEW.wastage ELSE 0 END
        + CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity + OLD.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil + CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END
        
    WHERE uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tape_coil_after_tape_coil_production
AFTER INSERT ON zipper.tape_coil_production
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();

CREATE TRIGGER tape_coil_after_tape_coil_production_delete
AFTER DELETE ON zipper.tape_coil_production
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();

CREATE TRIGGER tape_coil_after_tape_coil_production_update
AFTER UPDATE ON zipper.tape_coil_production
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();