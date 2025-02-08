-- //* Inserted
-- Function for INSERT trigger
CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_insert_function() 
RETURNS TRIGGER AS $$
DECLARE 
    item_name TEXT;
    nylon_stopper_name TEXT;
    order_type TEXT;
    sfg_uuid_val TEXT;
BEGIN
    -- Fetch item_name and finishing_batch_uuid once
    SELECT vodf.item_name, vodf.nylon_stopper_name, vodf.order_type, sfg.uuid INTO item_name, nylon_stopper_name, order_type, sfg_uuid_val
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch_entry based on item_name and section
    UPDATE zipper.finishing_batch_entry fbe
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN NEW.production_quantity 
                        ELSE 
                            CASE
                                WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity 
                                ELSE NEW.production_quantity_in_kg 
                            END 
                    END
                ELSE 0
            END,
        finishing_stock = finishing_stock - 
            CASE 
                WHEN (NEW.section = 'finishing' AND lower(item_name) NOT IN ('vislon', 'nylon')) THEN 
                    CASE
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity
                        ELSE NEW.production_quantity_in_kg
                    END 
                ELSE 0
            END 
            + 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity 
                ELSE 0 
            END,
        finishing_prod = finishing_prod +
            CASE 
                WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                ELSE 0
            END,
        teeth_coloring_stock = teeth_coloring_stock - 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN 
                    CASE 
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity
                        ELSE NEW.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE fbe.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch based on item_name and section AND if order_type is not tape
    IF lower(item_name) IN ('metal', 'vislon', 'nylon') AND order_type != 'tape' THEN
        UPDATE zipper.finishing_batch fb
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        LEFT JOIN zipper.finishing_batch fb ON fbe.finishing_batch_uuid = fb.uuid
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = NEW.finishing_batch_entry_uuid and od.uuid = fb.order_description_uuid;
    END IF;

    -- Update sfg based on sfg_uuid_val
    UPDATE zipper.sfg
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN NEW.production_quantity 
                        ELSE 
                            CASE
                                WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity 
                                ELSE NEW.production_quantity_in_kg 
                            END 
                    END
                ELSE 0
            END,
        finishing_stock = finishing_stock - 
            CASE 
                WHEN (NEW.section = 'finishing' AND lower(item_name) NOT IN ('vislon', 'nylon')) THEN 
                    CASE
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity
                        ELSE NEW.production_quantity_in_kg
                    END 
                ELSE 0
            END 
            + 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity 
                ELSE 0 
            END,
        finishing_prod = finishing_prod +
            CASE 
                WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                ELSE 0
            END,
        teeth_coloring_stock = teeth_coloring_stock - 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN 
                    CASE 
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity
                        ELSE NEW.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE sfg.uuid = sfg_uuid_val;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT
CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_production_insert_trigger
AFTER INSERT ON zipper.finishing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_insert_function();



-- Function for UPDATE trigger
CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_update_function() 
RETURNS TRIGGER AS $$
DECLARE 
    item_name TEXT;
    nylon_stopper_name TEXT;
    order_type TEXT;
    sfg_uuid_val TEXT;
BEGIN
    -- Fetch item_name and finishing_batch_uuid once
    SELECT vodf.item_name, vodf.nylon_stopper_name, vodf.order_type, sfg.uuid INTO item_name, nylon_stopper_name, order_type, sfg_uuid_val
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch_entry based on item_name and section
    UPDATE zipper.finishing_batch_entry fbe
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg - OLD.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN NEW.production_quantity - OLD.production_quantity
                        ELSE 
                            CASE
                                WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                                ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                            END 
                    END
                ELSE 0
            END,
        finishing_stock = finishing_stock - 
            CASE 
                WHEN (NEW.section = 'finishing' AND lower(item_name) NOT IN ('vislon', 'nylon')) THEN 
                    CASE
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                        ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                    END 
                ELSE 0
            END 
            + 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0 
            END,
        finishing_prod = finishing_prod +
            CASE 
                WHEN NEW.section = 'finishing' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0
            END,
        teeth_coloring_stock = teeth_coloring_stock - 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN 
                    CASE 
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                        ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE fbe.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch based on item_name and section AND if order_type is not tape
    IF lower(item_name) IN ('metal', 'vislon', 'nylon') AND order_type != 'tape' THEN
        UPDATE zipper.finishing_batch fb
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity - OLD.production_quantity
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity - OLD.production_quantity
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        LEFT JOIN zipper.finishing_batch fb ON fbe.finishing_batch_uuid = fb.uuid
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = NEW.finishing_batch_entry_uuid and od.uuid = fb.order_description_uuid;
    END IF;

    -- Update sfg based on sfg_uuid_val
    UPDATE zipper.sfg
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg - OLD.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN NEW.production_quantity - OLD.production_quantity
                        ELSE 
                            CASE
                                WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                                ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                            END 
                    END
                ELSE 0
            END,
        finishing_stock = finishing_stock - 
            CASE 
                WHEN (NEW.section = 'finishing' AND lower(item_name) NOT IN ('vislon', 'nylon')) THEN 
                    CASE
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                        ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                    END 
                ELSE 0
            END 
            + 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0 
            END,
        finishing_prod = finishing_prod +
            CASE 
                WHEN NEW.section = 'finishing' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0
            END,
        teeth_coloring_stock = teeth_coloring_stock - 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN 
                    CASE 
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                        ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE sfg.uuid = sfg_uuid_val;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for UPDATE
CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_production_update_trigger
AFTER UPDATE ON zipper.finishing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_update_function();

-- Function for DELETE trigger
CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_delete_function() 
RETURNS TRIGGER AS $$
DECLARE 
    item_name TEXT;
    nylon_stopper_name TEXT;
    order_type TEXT;
    sfg_uuid_val TEXT;
BEGIN
    -- Fetch item_name and finishing_batch_uuid once
    SELECT vodf.item_name, vodf.nylon_stopper_name, vodf.order_type, sfg.uuid INTO item_name, nylon_stopper_name, order_type, sfg_uuid_val
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;

    -- Update finishing_batch_entry based on item_name and section
    UPDATE zipper.finishing_batch_entry fbe
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN OLD.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN OLD.production_quantity
                        ELSE 
                            CASE
                                WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                                ELSE OLD.production_quantity_in_kg
                            END 
                    END
                ELSE 0
            END,
        finishing_stock = finishing_stock + 
            CASE 
                WHEN (OLD.section = 'finishing' AND lower(item_name) NOT IN ('vislon', 'nylon')) THEN 
                    CASE
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                        ELSE OLD.production_quantity_in_kg
                    END 
                ELSE 0
            END 
            - 
            CASE 
                WHEN OLD.section = 'teeth_coloring' THEN OLD.production_quantity
                ELSE 0 
            END,
        finishing_prod = finishing_prod - 
            CASE 
                WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                ELSE 0
            END,
        teeth_coloring_stock = teeth_coloring_stock + 
            CASE 
                WHEN OLD.section = 'teeth_coloring' THEN 
                    CASE 
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                        ELSE OLD.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE fbe.uuid = OLD.finishing_batch_entry_uuid;

    -- Update finishing_batch based on item_name and section AND if order_type is not tape
    IF lower(item_name) IN ('metal', 'vislon', 'nylon') AND order_type != 'tape' THEN
        UPDATE zipper.finishing_batch fb
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = OLD.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        LEFT JOIN zipper.finishing_batch fb ON fbe.finishing_batch_uuid = fb.uuid
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = OLD.finishing_batch_entry_uuid and od.uuid = fb.order_description_uuid;
    END IF;

    -- Update sfg based on sfg_uuid_val
    UPDATE zipper.sfg
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN OLD.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN OLD.production_quantity
                        ELSE 
                            CASE
                                WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                                ELSE OLD.production_quantity_in_kg
                            END 
                    END
                ELSE 0
            END,
        finishing_stock = finishing_stock + 
            CASE 
                WHEN (OLD.section = 'finishing' AND lower(item_name) NOT IN ('vislon', 'nylon')) THEN 
                    CASE
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                        ELSE OLD.production_quantity_in_kg
                    END 
                ELSE 0
            END 
            - 
            CASE 
                WHEN OLD.section = 'teeth_coloring' THEN OLD.production_quantity
                ELSE 0 
            END,
        finishing_prod = finishing_prod - 
            CASE 
                WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                ELSE 0
            END,
        teeth_coloring_stock = teeth_coloring_stock + 
            CASE 
                WHEN OLD.section = 'teeth_coloring' THEN 
                    CASE 
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                        ELSE OLD.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE sfg.uuid = sfg_uuid_val;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for DELETE
CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_production_delete_trigger
AFTER DELETE ON zipper.finishing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_delete_function();

