CREATE OR REPLACE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update () RETURNS TRIGGER AS $$
DECLARE
    sfg_uuid uuid;
    finishing_prod numeric;
    warehouse numeric;
    dyed_tape_used_in_kg numeric;
    teeth_molding_prod numeric;
    teeth_coloring_stock numeric;
    finishing_stock numeric;

BEGIN
        SELECT sfg_uuid, SUM(warehouse), SUM(dyed_tape_used_in_kg), SUM(teeth_molding_prod), SUM(teeth_coloring_stock), SUM(finishing_stock)
        INTO sfg_uuid, warehouse, dyed_tape_used_in_kg, teeth_molding_prod, teeth_coloring_stock, finishing_stock
            FROM zipper.finishing_batch_entry
            WHERE sfg_uuid = NEW.sfg_uuid
            GROUP BY sfg_uuid;
    UPDATE zipper.sfg
    SET
        warehouse = warehouse,
        dyed_tape_used_in_kg = dyed_tape_used_in_kg,
        teeth_molding_prod = teeth_molding_prod,
        teeth_coloring_stock = teeth_coloring_stock,
        finishing_stock = finishing_stock
    WHERE uuid = sfg_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_finishing_batch_entry_update
AFTER UPDATE ON zipper.finishing_batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update();

