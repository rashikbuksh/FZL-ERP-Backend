CREATE OR REPLACE FUNCTION thread.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS TRIGGER AS $$
BEGIN

    IF NEW.type = 'normal' THEN
        UPDATE thread.batch_entry
        SET
            coning_production_quantity = coning_production_quantity + NEW.production_quantity,
            coning_carton_quantity = coning_carton_quantity + NEW.coning_carton_quantity
        WHERE uuid = NEW.batch_entry_uuid;

        UPDATE thread.order_entry
        SET
            production_quantity = production_quantity + NEW.production_quantity,
            carton_of_production_quantity = carton_of_production_quantity + NEW.coning_carton_quantity

        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    ELSIF NEW.type = 'damage' THEN
        UPDATE thread.batch_entry
        SET
            damaged_quantity = damaged_quantity + NEW.production_quantity,
            coning_carton_quantity = coning_carton_quantity + NEW.coning_carton_quantity
        WHERE uuid = NEW.batch_entry_uuid;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.type = 'normal' THEN
        UPDATE thread.batch_entry
        SET
            coning_production_quantity = coning_production_quantity - OLD.production_quantity,
            coning_carton_quantity = coning_carton_quantity - OLD.coning_carton_quantity
        WHERE uuid = OLD.batch_entry_uuid;

        UPDATE thread.order_entry
        SET
            production_quantity = production_quantity - OLD.production_quantity,
            carton_of_production_quantity = carton_of_production_quantity - OLD.coning_carton_quantity

        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);
    ELSIF OLD.type = 'damage' THEN
        UPDATE thread.batch_entry
        SET
            damaged_quantity = damaged_quantity - OLD.production_quantity,
            coning_carton_quantity = coning_carton_quantity - OLD.coning_carton_quantity
        WHERE uuid = OLD.batch_entry_uuid;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thread.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'normal' THEN
        UPDATE thread.batch_entry
        SET
            coning_production_quantity = coning_production_quantity - OLD.production_quantity + NEW.production_quantity,
            coning_carton_quantity = coning_carton_quantity - OLD.coning_carton_quantity + NEW.coning_carton_quantity
        WHERE uuid = NEW.batch_entry_uuid;

        UPDATE thread.order_entry
        SET
            production_quantity = production_quantity - OLD.production_quantity + NEW.production_quantity,
            carton_of_production_quantity = carton_of_production_quantity - OLD.coning_carton_quantity + NEW.coning_carton_quantity

        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    ELSIF NEW.type = 'damage' THEN
        UPDATE thread.batch_entry
        SET
            damaged_quantity = damaged_quantity - OLD.production_quantity + NEW.production_quantity,
            coning_carton_quantity = coning_carton_quantity - OLD.coning_carton_quantity + NEW.coning_carton_quantity
        WHERE uuid = NEW.batch_entry_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER thread_batch_entry_after_batch_entry_production_insert
AFTER INSERT ON thread.batch_entry_production
FOR EACH ROW
EXECUTE FUNCTION thread.thread_batch_entry_after_batch_entry_production_insert_funct();

CREATE OR REPLACE TRIGGER thread_batch_entry_after_batch_entry_production_delete
AFTER DELETE ON thread.batch_entry_production
FOR EACH ROW
EXECUTE FUNCTION thread.thread_batch_entry_after_batch_entry_production_delete_funct();

CREATE OR REPLACE TRIGGER thread_batch_entry_after_batch_entry_production_update
AFTER UPDATE ON thread.batch_entry_production
FOR EACH ROW
EXECUTE FUNCTION thread.thread_batch_entry_after_batch_entry_production_update_funct();