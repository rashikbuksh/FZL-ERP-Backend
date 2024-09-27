CREATE OR REPLACE FUNCTION thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS TRIGGER AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity + NEW.production_quantity,
        coning_production_quantity_in_kg = coning_production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE uuid = NEW.thread_batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = coning_production_quantity + NEW.production_quantity,
        production_quantity_in_kg = coning_production_quantity_in_kg + NEW.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS TRIGGER AS $$
BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity - OLD.production_quantity,
        coning_production_quantity_in_kg = coning_production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE uuid = OLD.thread_batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = coning_production_quantity - OLD.production_quantity,
        production_quantity_in_kg = coning_production_quantity_in_kg - OLD.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION thread_batch_entry_after_batch_entry_production_update_funct() RETURNS TRIGGER AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity - OLD.production_quantity + NEW.production_quantity,
        coning_production_quantity_in_kg = coning_production_quantity_in_kg - OLD.production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE uuid = NEW.thread_batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = coning_production_quantity - OLD.production_quantity + NEW.production_quantity,
        production_quantity_in_kg = coning_production_quantity_in_kg - OLD.production_quantity_in_kg + NEW.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_batch_entry_after_batch_entry_production_insert
AFTER INSERT ON thread.batch_entry_production
FOR EACH ROW
EXECUTE FUNCTION thread_batch_entry_after_batch_entry_production_insert_funct();

CREATE OR REPLACE TRIGGER thread_batch_entry_after_batch_entry_production_delete
AFTER DELETE ON thread.batch_entry_production
FOR EACH ROW
EXECUTE FUNCTION thread_batch_entry_after_batch_entry_production_delete_funct();

CREATE OR REPLACE TRIGGER thread_batch_entry_after_batch_entry_production_update
AFTER UPDATE ON thread.batch_entry_production
FOR EACH ROW
EXECUTE FUNCTION thread_batch_entry_after_batch_entry_production_update_funct();




