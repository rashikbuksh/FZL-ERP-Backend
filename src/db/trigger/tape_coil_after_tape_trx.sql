CREATE OR replace FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS TRIGGER AS $$

BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
       trx_quantity_in_dying = trx_quantity_in_dying + CASE WHEN NEW.to_section = 'dyeing' THEN NEW.trx_quantity ELSE 0 END,
       trx_quantity_in_coil = trx_quantity_in_coil + CASE WHEN NEW.to_section = 'coil' THEN NEW.trx_quantity ELSE 0 END,
       quantity = quantity - NEW.trx_quantity,
       trx_quantity_in_dying = trx_quantity_in_dying + CASE WHEN NEW.to_section = 'dyeing' AND (SELECT name FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN NEW.trx_quantity ELSE 0 END,
       quantity_in_coil = quantity_in_coil - CASE WHEN NEW.to_section = 'dyeing' AND (SELECT name FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN NEW.trx_quantity ELSE 0 END

    WHERE uuid = NEW.tape_coil_uuid;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
       trx_quantity_in_dying = trx_quantity_in_dying - CASE WHEN OLD.to_section = 'dyeing' THEN OLD.trx_quantity ELSE 0 END,
       trx_quantity_in_coil = trx_quantity_in_coil - CASE WHEN OLD.to_section = 'coil' THEN OLD.trx_quantity ELSE 0 END,
       quantity = quantity +  OLD.trx_quantity,
         trx_quantity_in_dying = trx_quantity_in_dying - CASE WHEN OLD.to_section = 'dyeing' AND (SELECT name FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN OLD.trx_quantity ELSE 0 END,

         quantity_in_coil = quantity_in_coil + CASE WHEN OLD.to_section = 'dyeing' AND (SELECT name FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN OLD.trx_quantity ELSE 0 END
       
    WHERE uuid = OLD.tape_coil_uuid;
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS TRIGGER AS $$

BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
       trx_quantity_in_dying = trx_quantity_in_dying + CASE WHEN NEW.to_section = 'dyeing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.to_section = 'dyeing' THEN OLD.trx_quantity ELSE 0 END,
       trx_quantity_in_coil = trx_quantity_in_coil + CASE WHEN NEW.to_section = 'coil' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.to_section = 'coil' THEN OLD.trx_quantity ELSE 0 END,
       quantity = quantity - NEW.trx_quantity + OLD.trx_quantity,
         trx_quantity_in_dying = trx_quantity_in_dying + CASE WHEN NEW.to_section = 'dyeing' AND (SELECT name FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.to_section = 'dyeing' AND (SELECT name FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN OLD.trx_quantity ELSE 0 END
    WHERE uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tape_coil_after_tape_trx_after_insert
AFTER INSERT ON zipper.tape_trx
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();

CREATE OR REPLACE TRIGGER tape_coil_after_tape_trx_after_delete
AFTER DELETE ON zipper.tape_trx
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();

CREATE OR REPLACE TRIGGER tape_coil_after_tape_trx_after_update
AFTER UPDATE ON zipper.tape_trx
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();

