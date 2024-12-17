------------------------- finishing_batch_entry Transaction Trigger ------------------------- 
-- * inserted in DB
CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_insert_function() RETURNS TRIGGER AS $$
BEGIN
    -- Updating stocks and productions based on NEW.trx_to and NEW.trx_from
    UPDATE zipper.finishing_batch_entry
    SET
        teeth_coloring_stock = teeth_coloring_stock + 
            CASE 
                WHEN NEW.trx_to = 'teeth_coloring_stock' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_stock = finishing_stock + 
            CASE 
                WHEN NEW.trx_to = 'finishing_stock' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        teeth_molding_prod = teeth_molding_prod - 
            CASE 
                WHEN NEW.trx_from = 'teeth_molding_prod' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_prod = finishing_prod - 
            CASE 
                WHEN NEW.trx_from = 'finishing_prod' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        warehouse = warehouse - 
            CASE 
                WHEN NEW.trx_from = 'warehouse' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END
    WHERE uuid = NEW.finishing_batch_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_delete_function() RETURNS TRIGGER AS $$
BEGIN
    -- Updating stocks and productions based on OLD.trx_to and OLD.trx_from
    UPDATE zipper.finishing_batch_entry
    SET
        teeth_coloring_stock = teeth_coloring_stock - 
            CASE 
                WHEN OLD.trx_to = 'teeth_coloring_stock' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_stock = finishing_stock - 
            CASE 
                WHEN OLD.trx_to = 'finishing_stock' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN OLD.trx_from = 'teeth_molding_prod' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_prod = finishing_prod + 
            CASE 
                WHEN OLD.trx_from = 'finishing_prod' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        warehouse = warehouse + 
            CASE 
                WHEN OLD.trx_from = 'warehouse' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END
    WHERE uuid = OLD.finishing_batch_entry_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_update_function() RETURNS TRIGGER AS $$
BEGIN
    -- Updating stocks and productions based on OLD.trx_to, NEW.trx_to, OLD.trx_from, and NEW.trx_from
    UPDATE zipper.finishing_batch_entry
    SET
        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        finishing_stock = finishing_stock 
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'finishing_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN OLD.trx_from = 'teeth_molding_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'teeth_molding_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        finishing_prod = finishing_prod 
            + CASE WHEN OLD.trx_from = 'finishing_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'finishing_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        warehouse = warehouse 
            + CASE WHEN OLD.trx_from = 'warehouse' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'warehouse' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = NEW.finishing_batch_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_insert_trigger
AFTER INSERT ON zipper.finishing_batch_transaction
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_insert_function();

CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_delete_trigger
AFTER DELETE ON zipper.finishing_batch_transaction
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_delete_function();

CREATE OR REPLACE TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_update_trigger
AFTER UPDATE ON zipper.finishing_batch_transaction
FOR EACH ROW
EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_update_function();