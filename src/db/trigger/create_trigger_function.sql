--------------------------------- SFG Production Trigger ------------------------------
CREATE OR REPLACE FUNCTION sfg_after_sfg_production_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg
    SET 
         teeth_molding_stock = teeth_molding_stock 
            - CASE WHEN NEW.section = 'teeth_molding' THEN 
                CASE WHEN NEW.used_quantity = 0 THEN NEW.production_quantity + NEW.wastage ELSE NEW.used_quantity + NEW.wastage END 
            ELSE 0 END,

        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN NEW.section = 'teeth_coloring' THEN 
                CASE WHEN NEW.used_quantity = 0 THEN NEW.production_quantity + NEW.wastage ELSE NEW.used_quantity + NEW.wastage END 
            ELSE 0 END,

        finishing_stock = finishing_stock 
            - CASE WHEN NEW.section = 'finishing' THEN 
                CASE WHEN NEW.used_quantity = 0 THEN NEW.production_quantity + NEW.wastage ELSE NEW.used_quantity + NEW.wastage END 
            ELSE 0 END,

        dying_and_iron_prod = dying_and_iron_prod 
            + CASE WHEN NEW.section = 'dying_and_iron' THEN NEW.production_quantity ELSE 0 END,

        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN NEW.section = 'teeth_molding' THEN NEW.production_quantity ELSE 0 END,

        teeth_coloring_prod = teeth_coloring_prod 
            + CASE WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity ELSE 0 END,

        finishing_prod = finishing_prod 
            + CASE WHEN NEW.section = 'finishing' THEN NEW.production_quantity ELSE 0 END,

        coloring_prod = coloring_prod 
            + CASE WHEN NEW.section = 'coloring' THEN NEW.production_quantity 
                WHEN NEW.section = 'finishing' THEN -NEW.production_quantity ELSE 0 END
        WHERE sfg.uuid = NEW.sfg_uuid;
    RETURN NEW;
    END
$$ LANGUAGE plpgsql;


-- Function for UPDATE trigger

CREATE OR REPLACE FUNCTION sfg_after_sfg_production_update_function() RETURNS TRIGGER AS $$
BEGIN 
UPDATE zipper.sfg
SET 
    teeth_molding_stock = teeth_molding_stock 
        + CASE WHEN OLD.section = 'teeth_molding' THEN 
            CASE WHEN OLD.used_quantity = 0 THEN OLD.production_quantity + OLD.wastage ELSE OLD.used_quantity + OLD.wastage END 
        ELSE 0 END
        - CASE WHEN NEW.section = 'teeth_molding' THEN 
            CASE WHEN NEW.used_quantity = 0 THEN NEW.production_quantity + NEW.wastage ELSE NEW.used_quantity + NEW.wastage END 
        ELSE 0 END,

    teeth_coloring_stock = teeth_coloring_stock 
        + CASE WHEN OLD.section = 'teeth_coloring' THEN 
            CASE WHEN OLD.used_quantity = 0 THEN OLD.production_quantity + OLD.wastage ELSE OLD.used_quantity + OLD.wastage END 
        ELSE 0 END
        - CASE WHEN NEW.section = 'teeth_coloring' THEN 
            CASE WHEN NEW.used_quantity = 0 THEN NEW.production_quantity + NEW.wastage ELSE NEW.used_quantity + NEW.wastage END 
        ELSE 0 END,

    finishing_stock = finishing_stock 
        + CASE WHEN OLD.section = 'finishing' THEN 
            CASE WHEN OLD.used_quantity = 0 THEN OLD.production_quantity + OLD.wastage ELSE OLD.used_quantity + OLD.wastage END 
        ELSE 0 END
        - CASE WHEN NEW.section = 'finishing' THEN 
            CASE WHEN NEW.used_quantity = 0 THEN NEW.production_quantity + NEW.wastage ELSE NEW.used_quantity + NEW.wastage END 
        ELSE 0 END,

    dying_and_iron_prod = dying_and_iron_prod 
        - CASE WHEN OLD.section = 'dying_and_iron' THEN OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'dying_and_iron' THEN NEW.production_quantity ELSE 0 END,

    teeth_molding_prod = teeth_molding_prod 
        - CASE WHEN OLD.section = 'teeth_molding' THEN OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'teeth_molding' THEN NEW.production_quantity ELSE 0 END,

    teeth_coloring_prod = teeth_coloring_prod 
        - CASE WHEN OLD.section = 'teeth_coloring' THEN OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity ELSE 0 END,

    finishing_prod = finishing_prod 
        - CASE WHEN OLD.section = 'finishing' THEN OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'finishing' THEN NEW.production_quantity ELSE 0 END,

    coloring_prod = coloring_prod 
        - CASE WHEN OLD.section = 'coloring' THEN OLD.production_quantity 
            WHEN OLD.section = 'finishing' THEN -OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'coloring' THEN NEW.production_quantity 
            WHEN NEW.section = 'finishing' THEN -NEW.production_quantity ELSE 0 END
    WHERE sfg.uuid = NEW.sfg_uuid;
RETURN NEW;
    
    END

$$ LANGUAGE plpgsql; 


-- Function for DELETE trigger
CREATE OR REPLACE FUNCTION sfg_after_sfg_production_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg
    SET 
        teeth_molding_stock = teeth_molding_stock 
            + CASE WHEN OLD.section = 'teeth_molding' THEN 
                CASE WHEN OLD.used_quantity = 0 THEN OLD.production_quantity + OLD.wastage ELSE OLD.used_quantity + OLD.wastage END 
            ELSE 0 END,

        teeth_coloring_stock = teeth_coloring_stock 
            + CASE WHEN OLD.section = 'teeth_coloring' THEN 
                CASE WHEN OLD.used_quantity = 0 THEN OLD.production_quantity + OLD.wastage ELSE OLD.used_quantity + OLD.wastage END 
            ELSE 0 END,

        finishing_stock = finishing_stock 
            + CASE WHEN OLD.section = 'finishing' THEN 
                CASE WHEN OLD.used_quantity = 0 THEN OLD.production_quantity + OLD.wastage ELSE OLD.used_quantity + OLD.wastage END 
            ELSE 0 END,

        dying_and_iron_prod = dying_and_iron_prod 
            - CASE WHEN OLD.section = 'dying_and_iron' THEN OLD.production_quantity ELSE 0 END,

        teeth_molding_prod = teeth_molding_prod 
            - CASE WHEN OLD.section = 'teeth_molding' THEN OLD.production_quantity ELSE 0 END,

        teeth_coloring_prod = teeth_coloring_prod 
            - CASE WHEN OLD.section = 'teeth_coloring' THEN OLD.production_quantity ELSE 0 END,

        finishing_prod = finishing_prod 
            - CASE WHEN OLD.section = 'finishing' THEN OLD.production_quantity ELSE 0 END,
            
        coloring_prod = coloring_prod 
            - CASE WHEN OLD.section = 'coloring' THEN OLD.production_quantity 
                WHEN OLD.section = 'finishing' THEN -OLD.production_quantity ELSE 0 END

        WHERE sfg.uuid = OLD.sfg_uuid;

    RETURN OLD;
    
        END

$$ LANGUAGE plpgsql;

-- Trigger for INSERT
CREATE TRIGGER sfg_after_sfg_production_insert_trigger
AFTER INSERT ON sfg_production
FOR EACH ROW
EXECUTE FUNCTION sfg_after_sfg_production_insert_function();

-- Trigger for UPDATE
CREATE TRIGGER sfg_after_sfg_production_update_trigger
AFTER UPDATE ON sfg_production
FOR EACH ROW
EXECUTE FUNCTION sfg_after_sfg_production_update_function();

-- Trigger for DELETE
CREATE TRIGGER sfg_after_sfg_production_delete_trigger
AFTER DELETE ON sfg_production
FOR EACH ROW
EXECUTE FUNCTION sfg_after_sfg_production_delete_function();

------------------------- SFG Transaction Trigger -------------------------

CREATE OR REPLACE FUNCTION sfg_after_sfg_transaction_insert_function() RETURNS TRIGGER AS $$
DECLARE
    tocs_uuid INT;
BEGIN
        -- Updating stocks based on NEW.trx_to
        UPDATE zipper.sfg SET
            dying_and_iron_stock = dying_and_iron_stock - CASE WHEN NEW.trx_to = 'dying_and_iron_stock' THEN NEW.trx_quantity ELSE 0 END,
            teeth_molding_stock = teeth_molding_stock - CASE WHEN NEW.trx_to = 'teeth_molding_stock' THEN NEW.trx_quantity ELSE 0 END,
            teeth_coloring_stock = teeth_coloring_stock - CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
            finishing_stock = finishing_stock - CASE WHEN NEW.trx_to = 'finishing_stock' THEN NEW.trx_quantity ELSE 0 END,
            warehouse = warehouse - CASE WHEN NEW.trx_to = 'warehouse' THEN NEW.trx_quantity ELSE 0 END
        WHERE order_entry_uuid = NEW.order_entry_uuid;

        -- Fetching tocs_uuid
        SELECT DISTINCT tocs.uuid INTO tocs_uuid
        FROM order_entry oe
        JOIN v_order_details_full v_od_f ON oe.order_description_uuid = v_od_f.order_description_uuid
        JOIN zipper.tape_coil tocs ON tocs.type = v_od_f.item_name AND tocs.zipper_number = v_od_f.zipper_name
        WHERE oe.uuid = NEW.order_entry_uuid
        LIMIT 1;

        -- Updating slider stock if applicable
        IF NEW.slider_item_uuid > 0 THEN
            UPDATE slider.stock SET
                stock = stock - NEW.trx_quantity
            WHERE uuid = NEW.slider_item_uuid;
        END IF;

        -- Updating tape_coil quantities based on NEW.trx_from
        IF NEW.trx_from = 'tape_making' THEN
            UPDATE zipper.tape_coil SET
                quantity = quantity + NEW.trx_quantity
            WHERE uuid = tocs_uuid;
        ELSIF NEW.trx_from = 'coil_forming' THEN
            UPDATE zipper.tape_coil SET
                quantity_in_coil = quantity_in_coil + NEW.trx_quantity
            WHERE uuid = tocs_uuid;
        END IF;

        -- Updating productions based on NEW.trx_from
        UPDATE zipper.sfg SET
            dying_and_iron_prod = dying_and_iron_prod + CASE WHEN NEW.trx_from = 'dying_and_iron_prod' THEN NEW.trx_quantity ELSE 0 END,
            teeth_molding_prod = teeth_molding_prod + CASE WHEN NEW.trx_from = 'teeth_molding_prod' THEN NEW.trx_quantity ELSE 0 END,
            teeth_coloring_prod = teeth_coloring_prod + CASE WHEN NEW.trx_from = 'teeth_coloring_prod' THEN NEW.trx_quantity ELSE 0 END,
            finishing_prod = finishing_prod + CASE WHEN NEW.trx_from = 'finishing_prod' THEN NEW.trx_quantity ELSE 0 END,
            warehouse = warehouse + CASE WHEN NEW.trx_from = 'warehouse' THEN NEW.trx_quantity ELSE 0 END
        WHERE order_entry_uuid = NEW.order_entry_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sfg_after_sfg_transaction_delete_function() RETURNS TRIGGER AS $$
DECLARE
    tocs_uuid INT;
BEGIN
    -- Updating stocks based on OLD.trx_to
    UPDATE zipper.sfg SET
        dying_and_iron_stock = dying_and_iron_stock - CASE WHEN OLD.trx_to = 'dying_and_iron_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_stock = teeth_molding_stock - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        finishing_stock = finishing_stock - CASE WHEN OLD.trx_to = 'finishing_stock' THEN OLD.trx_quantity ELSE 0 END,
        warehouse = warehouse - CASE WHEN OLD.trx_to = 'warehouse' THEN OLD.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = OLD.order_entry_uuid;

    -- Fetching tocs_uuid
    SELECT DISTINCT tocs.uuid INTO tocs_uuid
    FROM order_entry oe
    JOIN v_order_details_full v_od_f ON oe.order_description_uuid = v_od_f.order_description_uuid
    JOIN zipper.tape_coil tocs ON tocs.type = v_od_f.item_name AND tocs.zipper_number = v_od_f.zipper_name
    WHERE oe.uuid = OLD.order_entry_uuid
    LIMIT 1;

    -- Updating slider stock if applicable
    IF OLD.slider_item_uuid > 0 THEN
        UPDATE slider.stock SET
            stock = stock - OLD.trx_quantity
        WHERE uuid = OLD.slider_item_uuid;
    END IF;

    -- Updating tape_coil quantities based on OLD.trx_from
    IF OLD.trx_from = 'tape_making' THEN
        UPDATE zipper.tape_coil SET
            quantity = quantity + OLD.trx_quantity
        WHERE uuid = tocs_uuid;
    ELSIF OLD.trx_from = 'coil_forming' THEN
        UPDATE zipper.tape_coil SET
            quantity_in_coil = quantity_in_coil + OLD.trx_quantity
        WHERE uuid = tocs_uuid;
    END IF;

    -- Updating productions based on OLD.trx_from
    UPDATE zipper.sfg SET
        dying_and_iron_prod = dying_and_iron_prod + CASE WHEN OLD.trx_from = 'dying_and_iron_prod' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod + CASE WHEN OLD.trx_from = 'teeth_molding_prod' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_prod = teeth_coloring_prod + CASE WHEN OLD.trx_from = 'teeth_coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        finishing_prod = finishing_prod + CASE WHEN OLD.trx_from = 'finishing_prod' THEN OLD.trx_quantity ELSE 0 END,
        warehouse = warehouse + CASE WHEN OLD.trx_from = 'warehouse' THEN OLD.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = OLD.order_entry_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.sfg_after_sfg_transaction_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    tocs_uuid INT;
BEGIN
    -- Updating stocks based on OLD.trx_to and NEW.trx_to
    UPDATE zipper.sfg SET
        dying_and_iron_stock = dying_and_iron_stock 
            - CASE WHEN OLD.trx_to = 'dying_and_iron_stock' THEN OLD.trx_quantity ELSE 0 END
            + CASE WHEN NEW.trx_to = 'dying_and_iron_stock' THEN NEW.trx_quantity ELSE 0 END,
        teeth_molding_stock = teeth_molding_stock 
            - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN OLD.trx_quantity ELSE 0 END
            + CASE WHEN NEW.trx_to = 'teeth_molding_stock' THEN NEW.trx_quantity ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN OLD.trx_quantity ELSE 0 END
            + CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
        finishing_stock = finishing_stock 
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN OLD.trx_quantity ELSE 0 END
            + CASE WHEN NEW.trx_to = 'finishing_stock' THEN NEW.trx_quantity ELSE 0 END,
        warehouse = warehouse 
            - CASE WHEN OLD.trx_to = 'warehouse' THEN OLD.trx_quantity ELSE 0 END
            + CASE WHEN NEW.trx_to = 'warehouse' THEN NEW.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = NEW.order_entry_uuid;

    -- Fetching tocs_uuid
    SELECT DISTINCT tocs.uuid INTO tocs_uuid
    FROM order_entry oe
    JOIN v_order_details_full v_od_f ON oe.order_description_uuid = v_od_f.order_description_uuid
    JOIN zipper.tape_coil tocs ON tocs.type = v_od_f.item_name AND tocs.zipper_number::varchar = v_od_f.zipper_number_name::varchar
    WHERE oe.uuid = NEW.order_entry_uuid
    LIMIT 1;

    -- Updating slider stock if applicable
    IF NEW.slider_item_id > 0 THEN
        UPDATE slider.stock SET
            stock = stock - OLD.trx_quantity + NEW.trx_quantity
        WHERE uuid = NEW.slider_item_id;
    END IF;

    -- Updating tape_coil quantities based on NEW.trx_from
    IF NEW.trx_from = 'tape_making' THEN
        UPDATE zipper.tape_coil SET
            quantity = quantity + OLD.trx_quantity - NEW.trx_quantity
        WHERE uuid = tocs_uuid;
    ELSIF NEW.trx_from = 'coil_forming' THEN
        UPDATE zipper.tape_coil SET
            quantity_in_coil = quantity_in_coil + OLD.trx_quantity - NEW.trx_quantity
        WHERE uuid = tocs_uuid;
    END IF;

    -- Updating productions based on OLD.trx_from and NEW.trx_from
    UPDATE zipper.sfg SET
        dying_and_iron_prod = dying_and_iron_prod 
            + CASE WHEN OLD.trx_from = 'dying_and_iron_prod' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN NEW.trx_from = 'dying_and_iron_prod' THEN NEW.trx_quantity ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN OLD.trx_from = 'teeth_molding_prod' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN NEW.trx_from = 'teeth_molding_prod' THEN NEW.trx_quantity ELSE 0 END,
        teeth_coloring_prod = teeth_coloring_prod 
            + CASE WHEN OLD.trx_from = 'teeth_coloring_prod' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN NEW.trx_from = 'teeth_coloring_prod' THEN NEW.trx_quantity ELSE 0 END,
        finishing_prod = finishing_prod 
            + CASE WHEN OLD.trx_from = 'finishing_prod' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN NEW.trx_from = 'finishing_prod' THEN NEW.trx_quantity ELSE 0 END,
        warehouse = warehouse 
            + CASE WHEN OLD.trx_from = 'warehouse' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN NEW.trx_from = 'warehouse' THEN NEW.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = NEW.order_entry_uuid;
    RETURN NEW;
END;
$$;

CREATE TRIGGER sfg_after_sfg_transaction_insert_trigger
AFTER INSERT ON sfg_transaction
FOR EACH ROW
EXECUTE FUNCTION sfg_after_sfg_transaction_insert_function();

CREATE TRIGGER sfg_after_sfg_transaction_delete_trigger
AFTER DELETE ON sfg_transaction
FOR EACH ROW
EXECUTE FUNCTION sfg_after_sfg_transaction_delete_function();

CREATE TRIGGER sfg_after_sfg_transaction_update_trigger
AFTER UPDATE ON sfg_transaction
FOR EACH ROW
EXECUTE FUNCTION sfg_after_sfg_transaction_update_function();


------------------------- SFG Commercial PI Entry Trigger -------------------------
CREATE OR REPLACE FUNCTION sfg_after_commercial_pi_entry_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_quantity
    WHERE uuid = NEW.sfg_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sfg_after_commercial_pi_entry_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi - OLD.pi_quantity
    WHERE uuid = OLD.sfg_uuid;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sfg_after_commercial_pi_entry_update_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_quantity - OLD.pi_quantity
    WHERE uuid = NEW.sfg_uuid;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER sfg_after_commercial_pi_entry_insert_trigger
AFTER INSERT ON pi_entry
FOR EACH ROW
EXECUTE FUNCTION sfg_after_commercial_pi_entry_insert_function();

CREATE TRIGGER sfg_after_commercial_pi_entry_delete_trigger
AFTER DELETE ON pi_entry
FOR EACH ROW
EXECUTE FUNCTION sfg_after_commercial_pi_entry_delete_function();

CREATE TRIGGER sfg_after_commercial_pi_entry_update_trigger
AFTER UPDATE ON pi_entry
FOR EACH ROW
EXECUTE FUNCTION sfg_after_commercial_pi_entry_update_function();


CREATE OR REPLACE FUNCTION sfg_after_order_entry_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO zipper.sfg (
        uuid, 
        order_entry_uuid
    ) VALUES (
        NEW.uuid, 
        NEW.uuid
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sfg_after_order_entry_delete() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sfg_after_order_entry_insert
AFTER INSERT ON order_entry
FOR EACH ROW
EXECUTE FUNCTION sfg_after_order_entry_insert();

CREATE TRIGGER sfg_after_order_entry_delete
AFTER DELETE ON order_entry
FOR EACH ROW
EXECUTE FUNCTION sfg_after_order_entry_delete();