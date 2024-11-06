-- .........inserted in DATABASE.............
CREATE OR REPLACE FUNCTION zipper.zipper_sfg_after_dyeing_batch_received_update() RETURNS TRIGGER AS $$
BEGIN

    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod 
            + CASE WHEN (NEW.received = 1 AND OLD.received = 0) THEN be.production_quantity_in_kg ELSE 0 END 
            - CASE WHEN (NEW.received = 0 AND OLD.received = 1) THEN be.production_quantity_in_kg ELSE 0 END
    FROM zipper.dyeing_batch_entry be
    WHERE
         zipper.sfg.uuid = be.sfg_uuid AND be.dyeing_batch_uuid = NEW.uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_dyeing_batch_received_update
AFTER UPDATE OF received ON zipper.dyeing_batch
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_sfg_after_dyeing_batch_received_update();
