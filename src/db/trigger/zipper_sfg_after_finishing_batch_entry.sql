CREATE OR REPLACE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update () RETURNS TRIGGER AS $$
DECLARE
    sfg_uuid_val TEXT;
    dyed_tape_used_in_kg_val numeric;
    teeth_molding_prod_val numeric;
    teeth_coloring_stock_val numeric;
    finishing_stock_val numeric;
    finishing_prod_val numeric;
BEGIN
    -- Aggregate only the new or updated entries
    SELECT finishing_batch_entry.sfg_uuid, 
           SUM(finishing_batch_entry.dyed_tape_used_in_kg), 
           SUM(finishing_batch_entry.teeth_molding_prod), 
           SUM(finishing_batch_entry.teeth_coloring_stock), 
           SUM(finishing_batch_entry.finishing_stock), 
           SUM(finishing_batch_entry.finishing_prod)
    INTO sfg_uuid_val, dyed_tape_used_in_kg_val, teeth_molding_prod_val, teeth_coloring_stock_val, finishing_stock_val, finishing_prod_val
    FROM zipper.finishing_batch_entry
    WHERE finishing_batch_entry.sfg_uuid = NEW.sfg_uuid
    GROUP BY finishing_batch_entry.sfg_uuid;

    -- Update the sfg table
    UPDATE zipper.sfg
    SET
        dyed_tape_used_in_kg = COALESCE(dyed_tape_used_in_kg, 0) + dyed_tape_used_in_kg_val,
        teeth_molding_prod = COALESCE(teeth_molding_prod, 0) + teeth_molding_prod_val,
        teeth_coloring_stock = COALESCE(teeth_coloring_stock, 0) + teeth_coloring_stock_val,
        finishing_stock = COALESCE(finishing_stock, 0) + finishing_stock_val,
        finishing_prod = COALESCE(finishing_prod, 0) + finishing_prod_val
    WHERE zipper.sfg.uuid = sfg_uuid_val;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER zipper_sfg_after_finishing_batch_entry_update
AFTER INSERT OR UPDATE ON zipper.finishing_batch_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update();