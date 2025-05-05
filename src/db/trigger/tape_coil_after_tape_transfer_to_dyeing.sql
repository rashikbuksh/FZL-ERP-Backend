CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_transfer_to_dyeing_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.tape_coil
    SET
        quantity = quantity + 
            CASE 
                WHEN NEW.tape_transfer_type = 'tape_to_store' THEN NEW.trx_quantity
                WHEN NEW.tape_transfer_type = 'tape_to_dyeing' THEN -NEW.trx_quantity
                ELSE 0
            END,
        quantity_in_coil = quantity_in_coil + 
            CASE 
                WHEN NEW.tape_transfer_type = 'coil_to_store' THEN NEW.trx_quantity
                WHEN NEW.tape_transfer_type = 'coil_to_dyeing' THEN -NEW.trx_quantity
                ELSE 0
            END
    WHERE tape_coil.uuid = NEW.tape_coil_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_transfer_to_dyeing_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.tape_coil
    SET
        quantity = quantity - 
            CASE 
                WHEN OLD.tape_transfer_type = 'tape_to_store' THEN OLD.trx_quantity
                WHEN OLD.tape_transfer_type = 'tape_to_dyeing' THEN -OLD.trx_quantity
                ELSE 0
            END,
        quantity_in_coil = quantity_in_coil - 
            CASE 
                WHEN OLD.tape_transfer_type = 'coil_to_store' THEN OLD.trx_quantity
                WHEN OLD.tape_transfer_type = 'coil_to_dyeing' THEN -OLD.trx_quantity
                ELSE 0
            END
    WHERE tape_coil.uuid = OLD.tape_coil_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_transfer_to_dyeing_update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.tape_coil
    SET
        quantity = quantity - 
            CASE 
                WHEN OLD.tape_transfer_type = 'tape_to_store' THEN OLD.trx_quantity
                WHEN OLD.tape_transfer_type = 'tape_to_dyeing' THEN -OLD.trx_quantity
                ELSE 0
            END + 
            CASE 
                WHEN NEW.tape_transfer_type = 'tape_to_store' THEN NEW.trx_quantity
                WHEN NEW.tape_transfer_type = 'tape_to_dyeing' THEN -NEW.trx_quantity
                ELSE 0
            END,
        quantity_in_coil = quantity_in_coil - 
            CASE 
                WHEN OLD.tape_transfer_type = 'coil_to_store' THEN OLD.trx_quantity
                WHEN OLD.tape_transfer_type = 'coil_to_dyeing' THEN -OLD.trx_quantity
                ELSE 0
            END + 
            CASE 
                WHEN NEW.tape_transfer_type = 'coil_to_store' THEN NEW.trx_quantity
                WHEN NEW.tape_transfer_type = 'coil_to_dyeing' THEN -NEW.trx_quantity
                ELSE 0
            END
    WHERE tape_coil.uuid = NEW.tape_coil_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tape_coil_after_tape_transfer_to_dyeing_insert
AFTER INSERT ON zipper.tape_transfer_to_dyeing
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_transfer_to_dyeing_insert();

CREATE OR REPLACE TRIGGER tape_coil_after_tape_transfer_to_dyeing_delete
AFTER DELETE ON zipper.tape_transfer_to_dyeing
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_transfer_to_dyeing_delete();

CREATE OR REPLACE TRIGGER tape_coil_after_tape_transfer_to_dyeing_update
AFTER UPDATE ON zipper.tape_transfer_to_dyeing
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_transfer_to_dyeing_update();