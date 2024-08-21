CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock - NEW.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock 
            - NEW.trx_quantity
            + OLD.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock + OLD.trx_quantity
    WHERE material_uuid = OLD.material_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;





CREATE OR REPLACE TRIGGER stock_after_material_trx_against_order_description_insert
AFTER INSERT ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();

CREATE TRIGGER stock_after_material_trx_against_order_description_update
AFTER UPDATE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();

CREATE TRIGGER stock_after_material_trx_against_order_description_delete
AFTER DELETE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();



