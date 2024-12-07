CREATE OR REPLACE FUNCTION commercial.pi_cash_after_cash_receive_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE commercial.pi_cash
    SET receive_amount = receive_amount + NEW.receive_amount
    WHERE uuid = NEW.pi_cash_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION commercial.pi_cash_after_cash_receive_update_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE commercial.pi_cash
    SET receive_amount = receive_amount + NEW.receive_amount - OLD.receive_amount
    WHERE uuid = NEW.pi_cash_uuid;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION commercial.pi_cash_after_cash_receive_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE commercial.pi_cash
    SET receive_amount = receive_amount - OLD.receive_amount
    WHERE uuid = OLD.pi_cash_uuid;
    RETURN OLD;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER pi_cash_after_cash_receive_insert
AFTER INSERT ON commercial.cash_receive
FOR EACH ROW
EXECUTE FUNCTION commercial.pi_cash_after_cash_receive_insert_function();

CREATE OR REPLACE TRIGGER pi_cash_after_cash_receive_update
AFTER UPDATE ON commercial.cash_receive
FOR EACH ROW
EXECUTE FUNCTION commercial.pi_cash_after_cash_receive_update_function();

CREATE OR REPLACE TRIGGER pi_cash_after_cash_receive_delete
AFTER DELETE ON commercial.cash_receive
FOR EACH ROW
EXECUTE FUNCTION commercial.pi_cash_after_cash_receive_delete_function();


