CREATE OR REPLACE FUNCTION zipper.sfg_after_packing_list_entry_insert_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + NEW.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER sfg_after_packing_list_entry_insert
AFTER INSERT ON zipper.packing_list_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.sfg_after_packing_list_entry_insert_function();

CREATE TRIGGER sfg_after_material_trx_against_order_description_update
AFTER UPDATE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.sfg_after_material_trx_against_order_description_update_funct();

CREATE TRIGGER sfg_after_material_trx_against_order_description_delete
AFTER DELETE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.sfg_after_material_trx_against_order_description_delete_funct();