-- //* Inserted
-- Function for INSERT trigger
CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_insert_function() 
RETURNS TRIGGER AS $$
DECLARE 
    item_name TEXT;
    od_uuid TEXT;
    nylon_stopper_name TEXT;
BEGIN
    -- Fetch item_name and order_description_uuid once
    SELECT vodf.item_name, oe.order_description_uuid, vodf.nylon_stopper_name INTO item_name, od_uuid, nylon_stopper_name
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

    -- Update order_description based on item_name
    IF lower(item_name) = 'metal' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;
    
        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'vislon' THEN
        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'teeth_molding' 
                        THEN NEW.dyed_tape_used_in_kg
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'plastic' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'finishing' 
                    THEN NEW.dyed_tape_used_in_kg
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' 
                        THEN NEW.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'metallic' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'finishing' 
                    THEN NEW.dyed_tape_used_in_kg
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;
    END IF;

    -- Update finishing_batch_entry table
    UPDATE zipper.finishing_batch_entry finishing_batch_entry
    SET 
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE WHEN lower(vodf.item_name) = 'metal' 
                    THEN NEW.production_quantity 
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
                WHEN NEW.section = 'finishing' THEN 
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
            END,
        dying_and_iron_prod = dying_and_iron_prod + 
            CASE 
                WHEN NEW.section = 'dying_and_iron' THEN NEW.production_quantity 
                ELSE 0 
            END,
        -- teeth_coloring_prod = teeth_coloring_prod + 
        --     CASE 
        --         WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity 
        --         ELSE 0 
        --     END,
        coloring_prod = coloring_prod + 
            CASE 
                WHEN NEW.section = 'coloring' THEN NEW.production_quantity
                ELSE 0 
            END
    FROM zipper.order_entry oe
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid AND finishing_batch_entry.order_entry_uuid = oe.uuid AND oe.order_description_uuid = od_uuid;

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
    od_uuid TEXT;
    nylon_stopper_name TEXT;
BEGIN
    -- Fetch item_name and order_description_uuid once
    SELECT vodf.item_name, oe.order_description_uuid, vodf.nylon_stopper_name INTO item_name, od_uuid, nylon_stopper_name
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.order_entry oe ON oe.uuid = finishing_batch_entry.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

    -- Update order_description based on item_name
    IF lower(item_name) = 'metal' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN (NEW.dyed_tape_used_in_kg) - (OLD.dyed_tape_used_in_kg)
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;
    
        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'vislon' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN 
                        (NEW.dyed_tape_used_in_kg) - (OLD.dyed_tape_used_in_kg)
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;
    
        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'plastic' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.dyed_tape_used_in_kg) - (OLD.dyed_tape_used_in_kg)
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'metallic' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.dyed_tape_used_in_kg) - (OLD.dyed_tape_used_in_kg)
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;
    END IF;

    -- Update finishing_batch_entry table
    UPDATE zipper.finishing_batch_entry finishing_batch_entry
    SET 
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE WHEN lower(vodf.item_name) = 'metal' 
                    THEN NEW.production_quantity - OLD.production_quantity 
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
                WHEN NEW.section = 'finishing' THEN 
                    CASE
                        WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity) - (OLD.production_quantity)
                        ELSE (NEW.production_quantity_in_kg) - (OLD.production_quantity_in_kg)
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity) - (OLD.production_quantity)
                        ELSE (NEW.production_quantity_in_kg) - (OLD.production_quantity_in_kg)
                    END 
                ELSE 0 
            END,
        dying_and_iron_prod = dying_and_iron_prod + 
            CASE 
                WHEN NEW.section = 'dying_and_iron' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0 
            END,
        -- teeth_coloring_prod = teeth_coloring_prod + 
        --     CASE 
        --         WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity - OLD.production_quantity
        --         ELSE 0 
        --     END,
        coloring_prod = coloring_prod + 
            CASE 
                WHEN NEW.section = 'coloring' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0 
            END
    FROM zipper.order_entry oe
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid AND finishing_batch_entry.order_entry_uuid = oe.uuid AND oe.order_description_uuid = od_uuid;

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
    od_uuid TEXT;
    nylon_stopper_name TEXT;
BEGIN
    -- Fetch item_name and order_description_uuid once
    SELECT vodf.item_name, oe.order_description_uuid, vodf.nylon_stopper_name INTO item_name, od_uuid, nylon_stopper_name
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.order_entry oe ON oe.uuid = finishing_batch_entry.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;

    -- Update order_description based on item_name
    IF lower(item_name) = 'metal' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
                CASE 
                    WHEN OLD.section = 'teeth_molding' THEN OLD.dyed_tape_used_in_kg
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'vislon' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
                CASE 
                    WHEN OLD.section = 'teeth_molding' THEN OLD.dyed_tape_used_in_kg 
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'plastic' THEN

        UPDATE zipper.finishing_batch_entry finishing_batch_entry 
        SET
            dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.dyed_tape_used_in_kg
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;

        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'metallic' THEN
        
        UPDATE zipper.finishing_batch_entry finishing_batch_entry
        SET 
            dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.dyed_tape_used_in_kg
                    ELSE 0
                END
        WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;
        
        UPDATE zipper.order_description od
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity 
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;
    END IF;

    -- Update finishing_batch_entry table
    UPDATE zipper.finishing_batch_entry finishing_batch_entry
    SET 
        teeth_molding_prod = teeth_molding_prod - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN 
                    CASE WHEN lower(vodf.item_name) = 'metal' 
                    THEN OLD.production_quantity 
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
                WHEN OLD.section = 'finishing' THEN 
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
            END,
        dying_and_iron_prod = dying_and_iron_prod - 
            CASE 
                WHEN OLD.section = 'dying_and_iron' THEN OLD.production_quantity 
                ELSE 0 
            END,
        -- teeth_coloring_prod = teeth_coloring_prod - 
        --     CASE 
        --         WHEN OLD.section = 'teeth_coloring' THEN OLD.production_quantity 
        --         ELSE 0 
        --     END,
        coloring_prod = coloring_prod - 
            CASE 
                WHEN OLD.section = 'coloring' THEN OLD.production_quantity
                ELSE 0 
            END
    FROM zipper.order_entry oe
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
    WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid AND finishing_batch_entry.order_entry_uuid = oe.uuid AND oe.order_description_uuid = od_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for DELETE
CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_production_delete_trigger
AFTER DELETE ON zipper.finishing_batch_production
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_delete_function();

