CREATE OR REPLACE FUNCTION material.material_stock_after_booking_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock - NEW.quantity,
        booking = booking + NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_booking_update_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity - NEW.quantity,
        booking = booking + NEW.quantity - OLD.quantity
    WHERE material_uuid =  NEW.material_uuid;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_booking_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity,
        booking = booking - OLD.quantity
    WHERE material_uuid =  OLD.material_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER material_stock_after_booking_insert_trigger
AFTER INSERT ON material.booking
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_booking_insert_function();

CREATE OR REPLACE TRIGGER material_stock_after_booking_update_trigger
AFTER UPDATE ON material.booking
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_booking_update_function();

CREATE OR REPLACE TRIGGER material_stock_after_booking_delete_trigger
AFTER DELETE ON material.booking
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_booking_delete_function();