CREATE OR REPLACE FUNCTION material.material_stock_after_issue_procurement_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock - NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_issue_procurement_update_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock 
    SET
        stock = stock + OLD.quantity - NEW.quantity
    WHERE material_uuid =  NEW.material_uuid;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_issue_procurement_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity
    WHERE material_uuid =  OLD.material_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER material_stock_after_issue_procurement_insert_trigger
AFTER INSERT ON maintain.issue_procurement
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_issue_procurement_insert_function();

CREATE OR REPLACE TRIGGER material_stock_after_issue_procurement_update_trigger
AFTER UPDATE ON maintain.issue_procurement
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_issue_procurement_update_function();

CREATE OR REPLACE TRIGGER material_stock_after_issue_procurement_delete_trigger
AFTER DELETE ON maintain.issue_procurement
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_issue_procurement_delete_function();