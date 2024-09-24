CREATE OR REPLACE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_insert_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity - NEW.trx_quantity
    WHERE uuid = NEW.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_update_funct() RETURNS TRIGGER AS $$

BEGIN
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity - NEW.trx_quantity + OLD.trx_quantity
    WHERE uuid = NEW.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_delete_funct() RETURNS TRIGGER AS $$

BEGIN
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity + OLD.trx_quantity
    WHERE uuid = OLD.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
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

