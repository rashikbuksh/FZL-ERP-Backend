------------------------- Multi-Color Dashboard Trigger -------------------------
CREATE OR REPLACE FUNCTION zipper.multi_color_dashboard_after_order_description_insert() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_multi_color = 1 THEN
        INSERT INTO zipper.multi_color_dashboard (
            uuid, 
            order_description_uuid
        ) VALUES (
            NEW.uuid, 
            NEW.uuid
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.multi_color_dashboard_after_order_description_update() RETURNS TRIGGER AS $$
BEGIN
    -- if is_multi_color is updated to 1 then insert into multi_color_dashboard table
    IF NEW.is_multi_color = 1 AND OLD.is_multi_color = 0 THEN
        INSERT INTO zipper.multi_color_dashboard (
            uuid, 
            order_description_uuid
        ) VALUES (
            NEW.uuid, 
            NEW.uuid
        );
    -- if is_multi_color is updated to 0 then delete from multi_color_dashboard table
    ELSIF NEW.is_multi_color = 0 AND OLD.is_multi_color = 1 THEN
        DELETE FROM zipper.multi_color_dashboard
        WHERE order_description_uuid = NEW.uuid;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.multi_color_dashboard_after_order_description_delete() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_multi_color = 1 THEN
        DELETE FROM zipper.multi_color_dashboard
        WHERE order_description_uuid = OLD.uuid;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER multi_color_dashboard_after_order_description_insert
AFTER INSERT ON zipper.order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.multi_color_dashboard_after_order_description_insert();

CREATE OR REPLACE TRIGGER multi_color_dashboard_after_order_description_update
AFTER UPDATE ON zipper.order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.multi_color_dashboard_after_order_description_update();

CREATE OR REPLACE TRIGGER multi_color_dashboard_after_order_description_delete
AFTER DELETE ON zipper.order_description
FOR EACH ROW
EXECUTE FUNCTION zipper.multi_color_dashboard_after_order_description_delete();