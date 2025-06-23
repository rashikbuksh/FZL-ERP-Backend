-- .........inserted in DATABASE.............
CREATE OR REPLACE FUNCTION zipper.zipper_dyeing_batch_entry_after_dyeing_batch_production_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.dyeing_batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.dyeing_batch_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.zipper_dyeing_batch_entry_after_dyeing_batch_production__update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.dyeing_batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = NEW.dyeing_batch_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.zipper_dyeing_batch_entry_after_dyeing_batch_production_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.dyeing_batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.dyeing_batch_entry_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger definitions

CREATE OR REPLACE TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_insert
AFTER INSERT ON zipper.dyeing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_dyeing_batch_entry_after_dyeing_batch_production_insert();

CREATE  OR REPLACE TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_update
AFTER UPDATE ON zipper.dyeing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_dyeing_batch_entry_after_dyeing_batch_production__update();

CREATE  OR REPLACE TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_delete
AFTER DELETE ON zipper.dyeing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_dyeing_batch_entry_after_dyeing_batch_production_delete();

