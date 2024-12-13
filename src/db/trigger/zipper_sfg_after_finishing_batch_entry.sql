CREATE OR REPLACE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update () RETURNS TRIGGER AS $$
DECLARE
    sfg_uuid_val TEXT;
    warehouse_val numeric;
    dyed_tape_used_in_kg_val numeric;
    teeth_molding_prod_val numeric;
    teeth_coloring_stock_val numeric;
    finishing_stock_val numeric;
    finishing_prod_val numeric;
BEGIN
        SELECT finishing_batch_entry.sfg_uuid, SUM(finishing_batch_entry.warehouse), SUM(finishing_batch_entry.dyed_tape_used_in_kg), SUM(finishing_batch_entry.teeth_molding_prod), SUM(finishing_batch_entry.teeth_coloring_stock), SUM(finishing_batch_entry.finishing_stock), SUM(finishing_batch_entry.finishing_prod)
        INTO sfg_uuid_val, warehouse_val, dyed_tape_used_in_kg_val, teeth_molding_prod_val, teeth_coloring_stock_val, finishing_stock_val, finishing_prod_val
        FROM zipper.finishing_batch_entry
        WHERE finishing_batch_entry.uuid = NEW.uuid
        GROUP BY finishing_batch_entry.sfg_uuid;
    UPDATE zipper.sfg
    SET
        warehouse = warehouse_val,
        dyed_tape_used_in_kg = dyed_tape_used_in_kg_val,
        teeth_molding_prod = teeth_molding_prod_val,
        teeth_coloring_stock = teeth_coloring_stock_val,
        finishing_stock = finishing_stock_val,
        finishing_prod = finishing_prod_val
    FROM zipper.finishing_batch_entry fbe
    WHERE fbe.uuid = NEW.uuid AND fbe.sfg_uuid = zipper.sfg.uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_finishing_batch_entry_update
AFTER UPDATE ON zipper.finishing_batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update();

