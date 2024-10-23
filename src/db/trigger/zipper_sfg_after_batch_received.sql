-- .........inserted in DATABASE.............
CREATE OR REPLACE FUNCTION zipper_sfg_after_batch_received_update() RETURNS TRIGGER AS $$
BEGIN

    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod + be.production_quantity_in_kg - OLD.production_quantity_in_kg
    FROM zipper.batch_entry
    LEFT JOIN zipper.batch ON be.batch_uuid = zipper.batch.uuid
    WHERE
         zipper.sfg.uuid = batch_entry.sfg_uuid AND batch_entry.uuid = NEW.batch_entry_uuid;
    RETURN NEW;

RETURN NEW;
      
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_batch_received_update
AFTER UPDATE OF received ON zipper.batch
FOR EACH ROW
EXECUTE FUNCTION zipper_sfg_after_batch_received_update();
