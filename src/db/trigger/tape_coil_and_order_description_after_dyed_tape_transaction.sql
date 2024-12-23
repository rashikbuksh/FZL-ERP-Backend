CREATE OR REPLACE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_insert_funct() RETURNS TRIGGER AS $$
DECLARE
    order_type_val TEXT;
    is_multi_color_tape INTEGER;
BEGIN
    SELECT order_type, is_multi_color INTO order_type_val, is_multi_color_tape
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity - CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE NEW.trx_quantity END
    WHERE uuid = NEW.tape_coil_uuid;
    
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        -- multi_color_tape_received = multi_color_tape_received - CASE WHEN is_multi_color_tape = 1 THEN NEW.trx_quantity ELSE 0 END,
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_update_funct() RETURNS TRIGGER AS $$
DECLARE
    order_type_val TEXT;
    is_multi_color_tape INTEGER;
BEGIN
    SELECT order_type, is_multi_color INTO order_type_val, is_multi_color_tape
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity + CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE OLD.trx_quantity END - CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE NEW.trx_quantity END
    WHERE uuid = NEW.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        -- multi_color_tape_received = multi_color_tape_received + CASE WHEN is_multi_color_tape = 1 THEN OLD.trx_quantity ELSE 0 END - CASE WHEN is_multi_color_tape = 1 THEN NEW.trx_quantity ELSE 0 END,
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_delete_funct() RETURNS TRIGGER AS $$
DECLARE
    order_type_val TEXT;
    is_multi_color_tape INTEGER;
BEGIN
    SELECT order_type, is_multi_color INTO order_type_val, is_multi_color_tape
    FROM zipper.order_description
    WHERE uuid = OLD.order_description_uuid;

    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity + CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE OLD.trx_quantity END
    WHERE uuid = OLD.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        -- multi_color_tape_received = multi_color_tape_received + CASE WHEN is_multi_color_tape = 1 THEN OLD.trx_quantity ELSE 0 END,
        tape_transferred = tape_transferred - OLD.trx_quantity
    WHERE uuid = OLD.order_description_uuid;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_insert
AFTER INSERT ON zipper.dyed_tape_transaction_from_stock
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_insert_funct();

CREATE OR REPLACE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_update
AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_update_funct();

CREATE OR REPLACE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_delete
AFTER DELETE ON zipper.dyed_tape_transaction_from_stock
FOR EACH ROW
EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_delete_funct();

