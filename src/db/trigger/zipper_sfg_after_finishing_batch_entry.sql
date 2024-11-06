CREATE OR REPLACE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update () RETURNS TRIGGER AS $$

BEGIN
    UPDATE zipper.sfg
    SET
        dyed_tape_used_in_kg = NEW.dyed_tape_used_in_kg,
        teeth_molding_prod = NEW.teeth_molding_prod,
        teeth_coloring_stock = NEW.teeth_coloring_stock,
        finishing_stock = NEW.finishing_stock,
        finishing_prod = NEW.finishing_prod,
        warehouse = NEW.warehouse

    WHERE uuid = NEW.sfg_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_finishing_batch_entry_update
AFTER UPDATE ON zipper.finishing_batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update();

