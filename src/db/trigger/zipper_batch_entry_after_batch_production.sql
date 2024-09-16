-- .........inserted in DATABASE.............
CREATE OR REPLACE FUNCTION zipper_batch_entry_after_batch_production_insert() RETURNS TRIGGER AS $$
BEGIN
  UPDATE zipper.batch_entry
    SET
        production_quantity = production_quantity + NEW.production_quantity,
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.batch_entry_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper_batch_entry_after_batch_production_update() RETURNS TRIGGER AS $$
BEGIN
  UPDATE zipper.batch_entry
    SET
        production_quantity = production_quantity + NEW.production_quantity - OLD.production_quantity,
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
        production_quantity = production_quantity - OLD.production_quantity,
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.batch_entry_uuid;
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

-- .........inserted in DATABASE.............
CREATE OR REPLACE FUNCTION zipper_sfg_after_batch_entry_insert() RETURNS TRIGGER AS $$
BEGIN
  UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.sfg_uuid;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper_sfg_after_batch_entry_update() RETURNS TRIGGER AS $$
BEGIN
  UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = NEW.sfg_uuid;

    RETURN NEW;	
END;



$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper_sfg_after_batch_entry_delete() RETURNS TRIGGER AS $$

BEGIN
  UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.sfg_uuid;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_batch_entry_insert
AFTER INSERT ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper_sfg_after_batch_entry_insert();

CREATE OR REPLACE TRIGGER zipper_sfg_after_batch_entry_update
AFTER UPDATE ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper_sfg_after_batch_entry_update();

CREATE OR REPLACE TRIGGER zipper_sfg_after_batch_entry_delete
AFTER DELETE ON zipper.batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper_sfg_after_batch_entry_delete();

