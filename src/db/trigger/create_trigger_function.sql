-- Function for INSERT trigger
CREATE OR REPLACE FUNCTION sfg_production_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE sfg
    SET 
         teeth_molding_stock = CASE WHEN NEW.section = 'teeth_molding' CASE WHEN NEW.used_quantity = 0 THEN teeth_molding_stock = teeth_molding_stock - NEW.production_quantity
         ELSE teeth_molding_stock = teeth_molding_stock - NEW.used_quantity ELSE teeth_molding_stock END

         teeth_coloring_stock = CASE WHEN NEW.section = 'teeth_coloring' CASE WHEN NEW.used_quantity = 0 THEN teeth_coloring_stock = teeth_coloring_stock - NEW.production_quantity
         ELSE teeth_coloring_stock = teeth_coloring_stock - NEW.used_quantity ELSE teeth_coloring_stock END

        
         finishing_stock = CASE WHEN NEW.section = 'finishing' CASE WHEN NEW.used_quantity = 0 THEN finishing_stock = finishing_stock - NEW.production_quantity
         ELSE finishing_stock = finishing_stock - NEW.used_quantity ELSE finishing_stock END

         
        dying_and_iron_prod = CASE WHEN NEW.section = 'dying_and_iron' THEN dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity ELSE dying_and_iron_prod END
         
        teeth_molding_prod = CASE WHEN NEW.section = 'teeth_molding' THEN teeth_molding_prod = teeth_molding_prod + NEW.production_quantity ELSE teeth_molding_prod END

        teeth_coloring_prod = CASE WHEN NEW.section = 'teeth_coloring' THEN teeth_coloring_prod = teeth_coloring_prod + NEW.production_quantity ELSE teeth_coloring_prod END

        finishing_prod = CASE WHEN NEW.section = 'finishing' THEN finishing_prod = finishing_prod + NEW.production_quantity ELSE finishing_prod END

        coloring_prod = CASE WHEN NEW.section = 'coloring' THEN coloring_prod = coloring_prod + NEW.production_quantity ELSE coloring_prod END
        
        WHERE sfg.uuid = NEW.sfg_uuid;

    RETURN NEW;

    END

$$ LANGUAGE plpgsql;


-- Function for UPDATE trigger

CREATE OR REPLACE FUNCTION sfg_production_update_function() RETURNS TRIGGER AS $$
BEGIN 
UPDATE sfg
SET 
    teeth_molding_stock = 
    CASE WHEN OLD.section = 'teeth_molding' THEN 
    CASE WHEN OLD.used_quantity = 0 THEN teeth_molding_stock = teeth_molding_stock + OLD.production_quantity ELSE teeth_molding_stock = teeth_molding_stock + OLD.used_quantity
    ELSE teeth_molding_stock END

    teeth_molding_stock = CASE WHEN NEW.section = 'teeth_molding' THEN CASE WHEN NEW.used_quantity = 0 THEN teeth_molding_stock = teeth_molding_stock - NEW.production_quantity ELSE teeth_molding_stock = teeth_molding_stock - NEW.used_quantity ELSE teeth_molding_stock END

    teeth_coloring_stock =
    CASE WHEN OLD.section = 'teeth_coloring' THEN
    CASE WHEN OLD.used_quantity = 0 THEN teeth_coloring_stock = teeth_coloring_stock + OLD.production_quantity ELSE teeth_coloring_stock = teeth_coloring_stock + OLD.used_quantity
    ELSE teeth_coloring_stock END

    teeth_coloring_stock = CASE WHEN NEW.section = 'teeth_coloring' THEN CASE WHEN NEW.used_quantity = 0 THEN teeth_coloring_stock = teeth_coloring_stock - NEW.production_quantity ELSE teeth_coloring_stock = teeth_coloring_stock - NEW.used_quantity ELSE teeth_coloring_stock END

    finishing_stock =
    CASE WHEN OLD.section = 'finishing' THEN
    CASE WHEN OLD.used_quantity = 0 THEN finishing_stock = finishing_stock + OLD.production_quantity ELSE finishing_stock = finishing_stock + OLD.used_quantity
    ELSE finishing_stock END

    finishing_stock = CASE WHEN NEW.section = 'finishing' THEN CASE WHEN NEW.used_quantity = 0 THEN finishing_stock = finishing_stock - NEW.production_quantity ELSE finishing_stock = finishing_stock - NEW.used_quantity ELSE finishing_stock END

    dying_and_iron_prod = CASE WHEN OLD.section = 'dying_and_iron' THEN dying_and_iron_prod = dying_and_iron_prod - OLD.production_quantity ELSE dying_and_iron_prod END

    dying_and_iron_prod = CASE WHEN NEW.section = 'dying_and_iron' THEN dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity ELSE dying_and_iron_prod END

    teeth_molding_prod = CASE WHEN OLD.section = 'teeth_molding' THEN teeth_molding_prod = teeth_molding_prod - OLD.production_quantity ELSE teeth_molding_prod END

    teeth_molding_prod = CASE WHEN NEW.section = 'teeth_molding' THEN teeth_molding_prod = teeth_molding_prod + NEW.production_quantity ELSE teeth_molding_prod END

    teeth_coloring_prod = CASE WHEN OLD.section = 'teeth_coloring' THEN teeth_coloring_prod = teeth_coloring_prod - OLD.production_quantity ELSE teeth_coloring_prod END

    teeth_coloring_prod = CASE WHEN NEW.section = 'teeth_coloring' THEN teeth_coloring_prod = teeth_coloring_prod + NEW.production_quantity ELSE teeth_coloring_prod END

    finishing_prod = CASE WHEN OLD.section = 'finishing' THEN finishing_prod = finishing_prod - OLD.production_quantity ELSE finishing_prod END
    
    finishing_prod = CASE WHEN NEW.section = 'finishing' THEN finishing_prod = finishing_prod + NEW.production_quantity ELSE finishing_prod END

    coloring_prod = CASE WHEN OLD.section = 'coloring' THEN coloring_prod = coloring_prod - OLD.production_quantity ELSE coloring_prod END

    coloring_prod = CASE WHEN NEW.section = 'coloring' THEN coloring_prod = coloring_prod + NEW.production_quantity ELSE coloring_prod END

    WHERE sfg.uuid = NEW.sfg_uuid;

RETURN NEW;
    
    END

$$ LANGUAGE plpgsql; 


-- Function for DELETE trigger
CREATE OR REPLACE FUNCTION sfg_production_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE sfg
    SET 
        teeth_molding_stock = CASE WHEN OLD.section = 'teeth_molding' THEN WHEN  OLD.used_quantity = 0 THEN teeth_molding_stock = teeth_molding_stock + OLD.production_quantity ELSE teeth_molding_stock = teeth_molding_stock + OLD.used_quantity ELSE teeth_molding_stock END
        
        teeth_coloring_stock = CASE WHEN OLD.section = 'teeth_coloring' THEN WHEN  OLD.used_quantity = 0 THEN teeth_coloring_stock = teeth_coloring_stock + OLD.production_quantity ELSE teeth_coloring_stock = teeth_coloring_stock + OLD.used_quantity ELSE teeth_coloring_stock END

        finishing_stock = CASE WHEN OLD.section = 'finishing' THEN WHEN  OLD.used_quantity = 0 THEN finishing_stock = finishing_stock + OLD.production_quantity ELSE finishing_stock = finishing_stock + OLD.used_quantity ELSE finishing_stock END

        dying_and_iron_prod = CASE WHEN OLD.section = 'dying_and_iron' THEN dying_and_iron_prod = dying_and_iron_prod - OLD.production_quantity ELSE dying_and_iron_prod END

        teeth_molding_prod = CASE WHEN OLD.section = 'teeth_molding' THEN teeth_molding_prod = teeth_molding_prod - OLD.production_quantity ELSE teeth_molding_prod END

        teeth_coloring_prod = CASE WHEN OLD.section = 'teeth_coloring' THEN teeth_coloring_prod = teeth_coloring_prod - OLD.production_quantity ELSE teeth_coloring_prod END

        finishing_prod = CASE WHEN OLD.section = 'finishing' THEN finishing_prod = finishing_prod - OLD.production_quantity ELSE finishing_prod END

        coloring_prod = CASE WHEN OLD.section = 'coloring' THEN coloring_prod = coloring_prod - OLD.production_quantity ELSE coloring_prod END

        WHERE sfg.uuid = OLD.sfg_uuid;

    RETURN OLD;
    
        END

$$ LANGUAGE plpgsql;

-- Trigger for INSERT
CREATE TRIGGER sfg_production_insert_trigger
AFTER INSERT ON sfg_production
FOR EACH ROW
EXECUTE FUNCTION sfg_production_insert_function();

-- Trigger for UPDATE
CREATE TRIGGER sfg_production_update_trigger
AFTER UPDATE ON sfg_production
FOR EACH ROW
EXECUTE FUNCTION sfg_production_update_function();

-- Trigger for DELETE
CREATE TRIGGER sfg_production_delete_trigger
AFTER DELETE ON sfg_production
FOR EACH ROW
EXECUTE FUNCTION sfg_production_delete_function();


         
         
        
