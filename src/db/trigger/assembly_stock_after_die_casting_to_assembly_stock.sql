CREATE OR REPLACE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity + NEW.production_quantity,
        weight = weight + NEW.weight
    WHERE uuid = NEW.assembly_stock_uuid;

    -- die casting body 
    UPDATE slider.die_casting 
    SET 
        quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_body_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting cap
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_cap_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting puller
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_puller_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting link
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid AND assembly_stock.die_casting_link_uuid IS NOT NULL;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity 
            + NEW.production_quantity
            - OLD.production_quantity,
        weight = weight
            + NEW.weight
            - OLD.weight
    WHERE uuid = NEW.assembly_stock_uuid;

    -- die casting body
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_body_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting cap
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_cap_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting puller
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_puller_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting link
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity + NEW.wastage +  OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid AND assembly_stock.die_casting_link_uuid IS NOT NULL;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity - OLD.production_quantity,
        weight = weight - OLD.weight
    WHERE uuid = OLD.assembly_stock_uuid;

    -- die casting body
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_body_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    -- die casting cap
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_cap_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    -- die casting puller
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_puller_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    -- die casting link
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid AND assembly_stock.die_casting_link_uuid IS NOT NULL;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert
AFTER INSERT ON slider.die_casting_to_assembly_stock
FOR EACH ROW
EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();

CREATE OR REPLACE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update
AFTER UPDATE ON slider.die_casting_to_assembly_stock
FOR EACH ROW
EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();

CREATE OR REPLACE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete
AFTER DELETE ON slider.die_casting_to_assembly_stock
FOR EACH ROW
EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
