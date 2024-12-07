-- * inserted 
CREATE OR REPLACE FUNCTION zipper.order_description_after_multi_color_tape_receive_insert() RETURNS TRIGGER AS $$

BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
    -- multi_color_tape_received will be updated 
        tape_transferred = tape_transferred + NEW.quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.order_description_after_multi_color_tape_receive_update() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred - OLD.quantity + NEW.quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.order_description_after_multi_color_tape_receive_delete() RETURNS TRIGGER AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred - OLD.quantity
    WHERE order_description.uuid = OLD.order_description_uuid;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

-- Trigger for multi_color_tape_receive


CREATE OR REPLACE TRIGGER order_description_after_multi_color_tape_receive_insert_trigger
AFTER INSERT ON zipper.multi_color_tape_receive
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_multi_color_tape_receive_insert();

CREATE OR REPLACE TRIGGER order_description_after_multi_color_tape_receive_update_trigger
AFTER UPDATE ON zipper.multi_color_tape_receive
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_multi_color_tape_receive_update();

CREATE OR REPLACE TRIGGER order_description_after_multi_color_tape_receive_delete_trigger
AFTER DELETE ON zipper.multi_color_tape_receive
FOR EACH ROW
EXECUTE FUNCTION zipper.order_description_after_multi_color_tape_receive_delete();

