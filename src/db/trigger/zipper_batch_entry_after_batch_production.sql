-- .........inserted in DATABASE.............
CREATE OR REPLACE FUNCTION zipper_batch_entry_after_batch_production_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.batch_entry_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper_batch_entry_after_batch_production_update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = NEW.batch_entry_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper_batch_entry_after_batch_production_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.batch_entry_uuid;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_batch_entry_after_batch_production_insert
AFTER INSERT ON zipper.batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper_batch_entry_after_batch_production_insert();

CREATE OR REPLACE TRIGGER zipper_batch_entry_after_batch_production_update
AFTER UPDATE ON zipper.batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper_batch_entry_after_batch_production_update();

CREATE OR REPLACE TRIGGER zipper_batch_entry_after_batch_production_delete
AFTER DELETE ON zipper.batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper_batch_entry_after_batch_production_delete();


