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
    UPDATE zipper.sfg
     SET
        dying_and_iron_stock = dying_and_iron_stock 
            - CASE WHEN OLD.trx_to = 'dying_and_iron_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_stock = teeth_molding_stock 
            - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        finishing_stock = finishing_stock 
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN OLD.trx_quantity ELSE 0 END,
        warehouse = warehouse 
            - CASE WHEN OLD.trx_to = 'warehouse' THEN OLD.trx_quantity ELSE 0 END
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

------------------------- SFG Order Entry Trigger -------------------------
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


CREATE OR REPLACE FUNCTION material_stock_after_purchase_entry_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
        SET 
            stock = stock + NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_after_purchase_entry_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
        SET 
            stock = stock - OLD.quantity
    WHERE material_uuid = OLD.material_uuid;
    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_after_purchase_entry_update() RETURNS TRIGGER AS $$

BEGIN
    UPDATE material.stock
        SET
            stock = stock + NEW.quantity - OLD.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER material_stock_after_purchase_entry_insert
AFTER INSERT ON purchase_entry
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_purchase_entry_insert();

CREATE TRIGGER material_stock_after_purchase_entry_delete
AFTER DELETE ON purchase_entry
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_purchase_entry_delete();

CREATE TRIGGER material_stock_after_purchase_entry_update
AFTER UPDATE ON purchase_entry
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_purchase_entry_update();


--------------------------------- Material Used Trigger ------------------------------
CREATE OR REPLACE FUNCTION material_stock_after_material_used_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    tape_making = tape_making - CASE WHEN NEW.section = 'tape_making' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    coil_forming = coil_forming - CASE WHEN NEW.section = 'coil_forming' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    dying_and_iron = dying_and_iron - CASE WHEN NEW.section = 'dying_and_iron' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    m_gapping = m_gapping - CASE WHEN NEW.section = 'm_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    v_gapping = v_gapping - CASE WHEN NEW.section = 'v_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    v_teeth_molding = v_teeth_molding - CASE WHEN NEW.section = 'v_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    m_teeth_molding = m_teeth_molding - CASE WHEN NEW.section = 'm_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    teeth_assembling_and_polishing = teeth_assembling_and_polishing - CASE WHEN NEW.section = 'teeth_assembling_and_polishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    m_teeth_cleaning = m_teeth_cleaning - CASE WHEN NEW.section = 'm_teeth_cleaning' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    v_teeth_cleaning = v_teeth_cleaning - CASE WHEN NEW.section = 'v_teeth_cleaning' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    plating_and_iron = plating_and_iron - CASE WHEN NEW.section = 'plating_and_iron' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    m_sealing = m_sealing - CASE WHEN NEW.section = 'm_sealing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    v_sealing = v_sealing - CASE WHEN NEW.section = 'v_sealing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    n_t_cutting = n_t_cutting - CASE WHEN NEW.section = 'n_t_cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    v_t_cutting = v_t_cutting - CASE WHEN NEW.section = 'v_t_cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    m_stopper = m_stopper - CASE WHEN NEW.section = 'm_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    v_stopper = v_stopper - CASE WHEN NEW.section = 'v_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    n_stopper = n_stopper - CASE WHEN NEW.section = 'n_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    cutting = cutting - CASE WHEN NEW.section = 'cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    qc_and_packing = qc_and_packing - CASE WHEN NEW.section = 'qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    die_casting = die_casting - CASE WHEN NEW.section = 'die_casting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    slider_assembly = slider_assembly - CASE WHEN NEW.section = 'slider_assembly' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    coloring = coloring - CASE WHEN NEW.section = 'coloring' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
   
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_after_material_used_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    tape_making = tape_making + CASE WHEN OLD.section = 'tape_making' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    coil_forming = coil_forming + CASE WHEN OLD.section = 'coil_forming' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    dying_and_iron = dying_and_iron + CASE WHEN OLD.section = 'dying_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_gapping = m_gapping + CASE WHEN OLD.section = 'm_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_gapping = v_gapping + CASE WHEN OLD.section = 'v_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_teeth_molding = v_teeth_molding + CASE WHEN OLD.section = 'v_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_teeth_molding = m_teeth_molding + CASE WHEN OLD.section = 'm_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    teeth_assembling_and_polishing = teeth_assembling_and_polishing + CASE WHEN OLD.section = 'teeth_assembling_and_polishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_teeth_cleaning = m_teeth_cleaning + CASE WHEN OLD.section = 'm_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_teeth_cleaning = v_teeth_cleaning + CASE WHEN OLD.section = 'v_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    plating_and_iron = plating_and_iron + CASE WHEN OLD.section = 'plating_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_sealing = m_sealing + CASE WHEN OLD.section = 'm_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_sealing = v_sealing + CASE WHEN OLD.section = 'v_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    n_t_cutting = n_t_cutting + CASE WHEN OLD.section = 'n_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_t_cutting = v_t_cutting + CASE WHEN OLD.section = 'v_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_stopper = m_stopper + CASE WHEN OLD.section = 'm_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_stopper = v_stopper + CASE WHEN OLD.section = 'v_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    n_stopper = n_stopper + CASE WHEN OLD.section = 'n_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    cutting = cutting + CASE WHEN OLD.section = 'cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    qc_and_packing = qc_and_packing + CASE WHEN OLD.section = 'qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    die_casting = die_casting + CASE WHEN OLD.section = 'die_casting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    slider_assembly = slider_assembly + CASE WHEN OLD.section = 'slider_assembly' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    coloring = coloring + CASE WHEN OLD.section = 'coloring' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    WHERE material_uuid = OLD.material_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_after_material_used_update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    tape_making = tape_making - CASE WHEN OLD.section = 'tape_making' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    coil_forming = coil_forming - CASE WHEN OLD.section = 'coil_forming' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    dying_and_iron = dying_and_iron - CASE WHEN OLD.section = 'dying_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_gapping = m_gapping - CASE WHEN OLD.section = 'm_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_gapping = v_gapping - CASE WHEN OLD.section = 'v_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_teeth_molding = v_teeth_molding - CASE WHEN OLD.section = 'v_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_teeth_molding = m_teeth_molding - CASE WHEN OLD.section = 'm_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    teeth_assembling_and_polishing = teeth_assembling_and_polishing - CASE WHEN OLD.section = 'teeth_assembling_and_polishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_teeth_cleaning = m_teeth_cleaning - CASE WHEN OLD.section = 'm_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_teeth_cleaning = v_teeth_cleaning - CASE WHEN OLD.section = 'v_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    plating_and_iron = plating_and_iron - CASE WHEN OLD.section = 'plating_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_sealing = m_sealing - CASE WHEN OLD.section = 'm_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_sealing = v_sealing - CASE WHEN OLD.section = 'v_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    n_t_cutting = n_t_cutting - CASE WHEN OLD.section = 'n_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_t_cutting = v_t_cutting - CASE WHEN OLD.section = 'v_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    m_stopper = m_stopper - CASE WHEN OLD.section = 'm_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    v_stopper = v_stopper - CASE WHEN OLD.section = 'v_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    n_stopper = n_stopper - CASE WHEN OLD.section = 'n_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    cutting = cutting - CASE WHEN OLD.section = 'cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    qc_and_packing = qc_and_packing - CASE WHEN OLD.section = 'qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    die_casting = die_casting - CASE WHEN OLD.section = 'die_casting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    slider_assembly = slider_assembly - CASE WHEN OLD.section = 'slider_assembly' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    coloring = coloring - CASE WHEN OLD.section = 'coloring' THEN OLD.used_quantity + OLD.wastage ELSE 0 END

    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER material_stock_after_material_used_insert
AFTER INSERT ON material_used
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_used_insert();

CREATE TRIGGER material_stock_after_material_used_delete
AFTER DELETE ON material_used
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_used_delete();

CREATE TRIGGER material_stock_after_material_used_update
AFTER UPDATE ON material_used
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_used_update();


--------------------------------- Material Transaction Trigger ------------------------------
CREATE OR REPLACE FUNCTION material_stock_after_material_trx_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    stock = stock -  NEW.trx_quantity,
    tape_making = tape_making + CASE WHEN NEW.trx_to = 'tape_making' THEN NEW.trx_quantity ELSE 0 END,
    coil_forming = coil_forming + CASE WHEN NEW.trx_to = 'coil_forming' THEN NEW.trx_quantity ELSE 0 END,
    dying_and_iron = dying_and_iron + CASE WHEN NEW.trx_to = 'dying_and_iron' THEN NEW.trx_quantity ELSE 0 END,
    m_gapping = m_gapping + CASE WHEN NEW.trx_to = 'm_gapping' THEN NEW.trx_quantity ELSE 0 END,
    v_gapping = v_gapping + CASE WHEN NEW.trx_to = 'v_gapping' THEN NEW.trx_quantity ELSE 0 END,
    v_teeth_molding = v_teeth_molding + CASE WHEN NEW.trx_to = 'v_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
    m_teeth_molding = m_teeth_molding + CASE WHEN NEW.trx_to = 'm_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing + CASE WHEN NEW.trx_to = 'teeth_assembling_and_polishing' THEN NEW.trx_quantity ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning + CASE WHEN NEW.trx_to = 'm_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning + CASE WHEN NEW.trx_to = 'v_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END,
    plating_and_iron = plating_and_iron + CASE WHEN NEW.trx_to = 'plating_and_iron' THEN NEW.trx_quantity ELSE 0 END,
    m_sealing = m_sealing + CASE WHEN NEW.trx_to = 'm_sealing' THEN NEW.trx_quantity ELSE 0 END,
    v_sealing = v_sealing + CASE WHEN NEW.trx_to = 'v_sealing' THEN NEW.trx_quantity ELSE 0 END,
    n_t_cutting = n_t_cutting + CASE WHEN NEW.trx_to = 'n_t_cutting' THEN NEW.trx_quantity ELSE 0 END,
    v_t_cutting = v_t_cutting + CASE WHEN NEW.trx_to = 'v_t_cutting' THEN NEW.trx_quantity ELSE 0 END,
    m_stopper = m_stopper + CASE WHEN NEW.trx_to = 'm_stopper' THEN NEW.trx_quantity ELSE 0 END,
    v_stopper = v_stopper + CASE WHEN NEW.trx_to = 'v_stopper' THEN NEW.trx_quantity ELSE 0 END,
    n_stopper = n_stopper + CASE WHEN NEW.trx_to = 'n_stopper' THEN NEW.trx_quantity ELSE 0 END,
    cutting = cutting + CASE WHEN NEW.trx_to = 'cutting' THEN NEW.trx_quantity ELSE 0 END,
    qc_and_packing = qc_and_packing + CASE WHEN NEW.trx_to = 'qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
    die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END,
    slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END,
    coloring = coloring + CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_after_material_trx_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    stock = stock + OLD.trx_quantity,
    tape_making = tape_making - CASE WHEN OLD.trx_to = 'tape_making' THEN OLD.trx_quantity ELSE 0 END,
    coil_forming = coil_forming - CASE WHEN OLD.trx_to = 'coil_forming' THEN OLD.trx_quantity ELSE 0 END,
    dying_and_iron = dying_and_iron - CASE WHEN OLD.trx_to = 'dying_and_iron' THEN OLD.trx_quantity ELSE 0 END,
    m_gapping = m_gapping - CASE WHEN OLD.trx_to = 'm_gapping' THEN OLD.trx_quantity ELSE 0 END,
    v_gapping = v_gapping - CASE WHEN OLD.trx_to = 'v_gapping' THEN OLD.trx_quantity ELSE 0 END,
    v_teeth_molding = v_teeth_molding - CASE WHEN OLD.trx_to = 'v_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
    m_teeth_molding = m_teeth_molding - CASE WHEN OLD.trx_to = 'm_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing - CASE WHEN OLD.trx_to = 'teeth_assembling_and_polishing' THEN OLD.trx_quantity ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning - CASE WHEN OLD.trx_to = 'm_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning - CASE WHEN OLD.trx_to = 'v_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
    plating_and_iron = plating_and_iron - CASE WHEN OLD.trx_to = 'plating_and_iron' THEN OLD.trx_quantity ELSE 0 END,
    m_sealing = m_sealing - CASE WHEN OLD.trx_to = 'm_sealing' THEN OLD.trx_quantity ELSE 0 END,
    v_sealing = v_sealing - CASE WHEN OLD.trx_to = 'v_sealing' THEN OLD.trx_quantity ELSE 0 END,
    n_t_cutting = n_t_cutting - CASE WHEN OLD.trx_to = 'n_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
    v_t_cutting = v_t_cutting - CASE WHEN OLD.trx_to = 'v_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
    m_stopper = m_stopper - CASE WHEN OLD.trx_to = 'm_stopper' THEN OLD.trx_quantity ELSE 0 END,
    v_stopper = v_stopper - CASE WHEN OLD.trx_to = 'v_stopper' THEN OLD.trx_quantity ELSE 0 END,
    n_stopper = n_stopper - CASE WHEN OLD.trx_to = 'n_stopper' THEN OLD.trx_quantity ELSE 0 END,
    cutting = cutting - CASE WHEN OLD.trx_to = 'cutting' THEN OLD.trx_quantity ELSE 0 END,
    qc_and_packing = qc_and_packing - CASE WHEN OLD.trx_to = 'qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
    die_casting = die_casting - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
    slider_assembly = slider_assembly - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
    coloring = coloring - CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END

    WHERE material_uuid = OLD.material_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_after_material_trx_update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.material_stock
    SET 
    stock = stock - NEW.trx_quantity + OLD.trx_quantity,
    tape_making = tape_making + CASE WHEN NEW.trx_to = 'tape_making' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'tape_making' THEN OLD.trx_quantity ELSE 0 END,
    coil_forming = coil_forming + CASE WHEN NEW.trx_to = 'coil_forming' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coil_forming' THEN OLD.trx_quantity ELSE 0 END,
    dying_and_iron = dying_and_iron + CASE WHEN NEW.trx_to = 'dying_and_iron' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'dying_and_iron' THEN OLD.trx_quantity ELSE 0 END,
    m_gapping = m_gapping + CASE WHEN NEW.trx_to = 'm_gapping' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_gapping' THEN OLD.trx_quantity ELSE 0 END,
    v_gapping = v_gapping + CASE WHEN NEW.trx_to = 'v_gapping' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_gapping' THEN OLD.trx_quantity ELSE 0 END,
    v_teeth_molding = v_teeth_molding + CASE WHEN NEW.trx_to = 'v_teeth_molding' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
    m_teeth_molding = m_teeth_molding + CASE WHEN NEW.trx_to = 'm_teeth_molding' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing + CASE WHEN NEW.trx_to = 'teeth_assembling_and_polishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'teeth_assembling_and_polishing' THEN OLD.trx_quantity ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning + CASE WHEN NEW.trx_to = 'm_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning + CASE WHEN NEW.trx_to = 'v_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
    plating_and_iron = plating_and_iron + CASE WHEN NEW.trx_to = 'plating_and_iron' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'plating_and_iron' THEN OLD.trx_quantity ELSE 0 END,
    m_sealing = m_sealing + CASE WHEN NEW.trx_to = 'm_sealing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_sealing' THEN OLD.trx_quantity ELSE 0 END,
    v_sealing = v_sealing + CASE WHEN NEW.trx_to = 'v_sealing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_sealing' THEN OLD.trx_quantity ELSE 0 END,
    n_t_cutting = n_t_cutting + CASE WHEN NEW.trx_to = 'n_t_cutting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'n_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
    v_t_cutting = v_t_cutting + CASE WHEN NEW.trx_to = 'v_t_cutting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
    m_stopper = m_stopper + CASE WHEN NEW.trx_to = 'm_stopper' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_stopper' THEN OLD.trx_quantity ELSE 0 END,
    v_stopper = v_stopper + CASE WHEN NEW.trx_to = 'v_stopper' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_stopper' THEN OLD.trx_quantity ELSE 0 END,
    n_stopper = n_stopper + CASE WHEN NEW.trx_to = 'n_stopper' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'n_stopper' THEN OLD.trx_quantity ELSE 0 END,
    cutting = cutting + CASE WHEN NEW.trx_to = 'cutting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'cutting' THEN OLD.trx_quantity ELSE 0 END,
    qc_and_packing = qc_and_packing + CASE WHEN NEW.trx_to = 'qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
    die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
    slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
    coloring = coloring + CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER material_stock_after_material_trx_insert
AFTER INSERT ON material_trx
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_trx_insert();

CREATE TRIGGER material_stock_after_material_trx_delete
AFTER DELETE ON material_trx
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_trx_delete();

CREATE TRIGGER material_stock_after_material_trx_update
AFTER UPDATE ON material_trx
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_trx_update();

--------------------------------- Material Stock SFG Trigger ------------------------------
CREATE OR REPLACE FUNCTION material_stock_sfg_after_stock_to_sfg_insert() RETURNS TRIGGER AS $$
BEGIN
    --Update material.stock table
    UPDATE material.stock 
    SET
        stock = stock - NEW.trx_quantity,
    WHERE material_uuid = NEW.material_uuid;

    --Update zipper.sfg table
    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod 
            + CASE WHEN NEW.trx_to = 'dying_and_iron_prod' THEN NEW.trx_quantity ELSE 0 END,
        teeth_molding_stock = teeth_molding_stock 
            + CASE WHEN NEW.trx_to = 'teeth_molding_stock' THEN NEW.trx_quantity ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN NEW.trx_to = 'teeth_molding_prod' THEN NEW.trx_quantity ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock
            + CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
        teeth_coloring_prod = teeth_coloring_prod
            + CASE WHEN NEW.trx_to = 'teeth_coloring_prod' THEN NEW.trx_quantity ELSE 0 END,
        finishing_stock = finishing_stock
            + CASE WHEN NEW.trx_to = 'finishing_stock' THEN NEW.trx_quantity ELSE 0 END,
        finishing_prod = finishing_prod
            + CASE WHEN NEW.trx_to = 'finishing_prod' THEN NEW.trx_quantity ELSE 0 END,
        coloring_prod = coloring_prod
            + CASE WHEN NEW.trx_to = 'coloring_prod' THEN NEW.trx_quantity ELSE 0 END,
        warehouse = warehouse
            + CASE WHEN NEW.trx_to = 'warehouse' THEN NEW.trx_quantity ELSE 0 END
        delivered = delivered
            + CASE WHEN NEW.trx_to = 'delivered' THEN NEW.trx_quantity ELSE 0 END
        pi = pi 
            + CASE WHEN NEW.trx_to = 'pi' THEN NEW.trx_quantity ELSE 0 END
        
    WHERE order_entry_uuid = NEW.order_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR FUNCTION material_stock_sfg_after_stock_to_sfg_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update material.stock table
    UPDATE material.stock 
    SET
        stock = stock + OLD.trx_quantity,
    WHERE material_uuid = OLD.material_uuid;

    --Update zipper.sfg table
    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod 
            - CASE WHEN OLD.trx_to = 'dying_and_iron_prod' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_stock = teeth_molding_stock 
            - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod 
            - CASE WHEN OLD.trx_to = 'teeth_molding_prod' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_prod = teeth_coloring_prod
            - CASE WHEN OLD.trx_to = 'teeth_coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        finishing_stock = finishing_stock
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN OLD.trx_quantity ELSE 0 END,
        finishing_prod = finishing_prod
            - CASE WHEN OLD.trx_to = 'finishing_prod' THEN OLD.trx_quantity ELSE 0 END,
        coloring_prod = coloring_prod
            - CASE WHEN OLD.trx_to = 'coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        warehouse = warehouse
            - CASE WHEN OLD.trx_to = 'warehouse' THEN OLD.trx_quantity ELSE 0 END
        delivered = delivered
            - CASE WHEN OLD.trx_to = 'delivered' THEN OLD.trx_quantity ELSE 0 END
        pi = pi 
            - CASE WHEN OLD.trx_to = 'pi' THEN OLD.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = OLD.order_entry_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR FUNCTION material_stock_sfg_after_stock_to_sfg_update() RETURNS TRIGGER AS $$
BEGIN
    --Update material.stock table
    UPDATE material.stock 
    SET
        stock = stock - NEW.trx_quantity + OLD.trx_quantity,
    WHERE material_uuid = NEW.material_uuid;

    --Update zipper.sfg table
    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod 
            + CASE WHEN NEW.trx_to = 'dying_and_iron_prod' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'dying_and_iron_prod' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_stock = teeth_molding_stock 
            + CASE WHEN NEW.trx_to = 'teeth_molding_stock' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN NEW.trx_to = 'teeth_molding_prod' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'teeth_molding_prod' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock
            + CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        teeth_coloring_prod = teeth_coloring_prod
            + CASE WHEN NEW.trx_to = 'teeth_coloring_prod' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'teeth_coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        finishing_stock = finishing_stock
            + CASE WHEN NEW.trx_to = 'finishing_stock' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN OLD.trx_quantity ELSE 0 END,
        finishing_prod = finishing_prod
            + CASE WHEN NEW.trx_to = 'finishing_prod' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'finishing_prod' THEN OLD.trx_quantity ELSE 0 END,
        coloring_prod = coloring_prod
            + CASE WHEN NEW.trx_to = 'coloring_prod' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'coloring_prod' THEN OLD.trx_quantity ELSE 0 END,
        warehouse = warehouse
            + CASE WHEN NEW.trx_to = 'warehouse' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'warehouse' THEN OLD.trx_quantity ELSE 0 END,
        delivered = delivered
            + CASE WHEN NEW.trx_to = 'delivered' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'delivered' THEN OLD.trx_quantity ELSE 0 END,
        pi = pi
            + CASE WHEN NEW.trx_to = 'pi' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN OLD.trx_to = 'pi' THEN OLD.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = NEW.order_entry_uuid;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert
AFTER INSERT ON stock_to_sfg
FOR EACH ROW
EXECUTE FUNCTION material_stock_sfg_after_stock_to_sfg_insert();

CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete
AFTER DELETE ON stock_to_sfg
FOR EACH ROW
EXECUTE FUNCTION material_stock_sfg_after_stock_to_sfg_delete();

CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update
AFTER UPDATE ON stock_to_sfg
FOR EACH ROW
EXECUTE FUNCTION material_stock_sfg_after_stock_to_sfg_update();




CREATE OR REPLACE FUNCTION material_stock_after_material_info_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO material.stock
       (uuid, material_uuid)
    VALUES
         (NEW.uuid, NEW.uuid);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material_stock_after_material_info_delete() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER material_stock_after_material_info_insert
AFTER INSERT ON material_info
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_info_insert();

CREATE TRIGGER material_stock_after_material_info_delete
AFTER DELETE ON material_info
FOR EACH ROW
EXECUTE FUNCTION material_stock_after_material_info_delete();


CREATE OR REPLACE tape_coil_after_tape_to_coil_insert() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity - NEW.trx_quantity

        trx_quantity_in_coil = trx_quantity_in_coil 
        + CASE WHEN type = 'nylon' THEN NEW.trx_quantity ELSE 0 END,

    WHERE uuid = NEW.tape_coil_uuid;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION tape_coil_after_tape_to_coil_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity + OLD.trx_quantity

        trx_quantity_in_coil = trx_quantity_in_coil 
        - CASE WHEN type = 'nylon' THEN OLD.trx_quantity ELSE 0 END,

    WHERE uuid = OLD.tape_coil_uuid;

RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tape_coil_after_tape_to_coil_update() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity - NEW.trx_quantity + OLD.trx_quantity

        trx_quantity_in_coil = trx_quantity_in_coil 
            + CASE WHEN type = 'nylon' THEN NEW.trx_quantity ELSE 0 END
            - CASE WHEN type = 'nylon' THEN OLD.trx_quantity ELSE 0 END,

    WHERE uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER tape_coil_after_tape_to_coil_insert
AFTER INSERT ON tape_to_coil
FOR EACH ROW
EXECUTE FUNCTION tape_coil_after_tape_to_coil_insert();

CREATE TRIGGER tape_coil_after_tape_to_coil_delete
AFTER DELETE ON tape_to_coil
FOR EACH ROW
EXECUTE FUNCTION tape_coil_after_tape_to_coil_delete();

CREATE TRIGGER tape_coil_after_tape_to_coil_update
AFTER UPDATE ON tape_to_coil
FOR EACH ROW
EXECUTE FUNCTION tape_coil_after_tape_to_coil_update();


CREATE OR REPLACE FUNCTION tape_coil_after_tape_coil_production() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity 
        + CASE WHEN NEW.section = 'tape' THEN NEW.production_quantity ELSE 0 END

        trx_quantity_in_coil = trx_quantity_in_coil 
        - CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity + NEW.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil + NEW.production_quantity

    WHERE uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION tape_coil_after_tape_coil_production_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity 
        - CASE WHEN OLD.section = 'tape' THEN OLD.production_quantity ELSE 0 END

        trx_quantity_in_coil = trx_quantity_in_coil 
        + CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity + OLD.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil - OLD.production_quantity

    WHERE uuid = OLD.tape_coil_uuid;

RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tape_coil_after_tape_coil_production_update() RETURNS TRIGGER AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        quantity = quantity 
        + CASE WHEN NEW.section = 'tape' THEN NEW.production_quantity ELSE 0 END
        - CASE WHEN OLD.section = 'tape' THEN OLD.production_quantity ELSE 0 END

        trx_quantity_in_coil = trx_quantity_in_coil 
        - CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity + NEW.wastage ELSE 0 END
        + CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity + OLD.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil + NEW.production_quantity - OLD.production_quantity

    WHERE uuid = NEW.tape_coil_uuid;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tape_coil_after_tape_coil_production
AFTER INSERT ON tape_coil_production
FOR EACH ROW
EXECUTE FUNCTION tape_coil_after_tape_coil_production();

CREATE TRIGGER tape_coil_after_tape_coil_production_delete
AFTER DELETE ON tape_coil_production
FOR EACH ROW
EXECUTE FUNCTION tape_coil_after_tape_coil_production_delete();

CREATE TRIGGER tape_coil_after_tape_coil_production_update
AFTER UPDATE ON tape_coil_production
FOR EACH ROW
EXECUTE FUNCTION tape_coil_after_tape_coil_production_update();




  





