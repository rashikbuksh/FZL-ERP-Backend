CREATE OR REPLACE FUNCTION material.stock_after_material_trx_against_order_description_insert() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        tape_making = tape_making 
            - CASE WHEN NEW.trx_to = 'tape_making' THEN NEW.trx_quantity ELSE 0 END,
        coil_forming = coil_forming 
            - CASE WHEN NEW.trx_to = 'coil_forming' THEN NEW.trx_quantity ELSE 0 END,
        dying_and_iron = dying_and_iron 
            - CASE WHEN NEW.trx_to = 'dying_and_iron' THEN NEW.trx_quantity ELSE 0 END,
        m_gapping = m_gapping 
            - CASE WHEN NEW.trx_to = 'm_gapping' THEN NEW.trx_quantity ELSE 0 END,
        v_gapping = v_gapping 
            - CASE WHEN NEW.trx_to = 'v_gapping' THEN NEW.trx_quantity ELSE 0 END,
        v_teeth_molding = v_teeth_molding 
            - CASE WHEN NEW.trx_to = 'v_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
        m_teeth_molding = m_teeth_molding 
            - CASE WHEN NEW.trx_to = 'm_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
        teeth_assembling_and_polishing = teeth_assembling_and_polishing 
            - CASE WHEN NEW.trx_to = 'teeth_assembling_and_polishing' THEN NEW.trx_quantity ELSE 0 END,
        m_teeth_cleaning = m_teeth_cleaning 
            - CASE WHEN NEW.trx_to = 'm_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END,
        v_teeth_cleaning = v_teeth_cleaning 
            - CASE WHEN NEW.trx_to = 'v_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END,
        plating_and_iron = plating_and_iron 
            - CASE WHEN NEW.trx_to = 'plating_and_iron' THEN NEW.trx_quantity ELSE 0 END,
        m_sealing = m_sealing 
            - CASE WHEN NEW.trx_to = 'm_sealing' THEN NEW.trx_quantity ELSE 0 END,
        v_sealing = v_sealing 
            - CASE WHEN NEW.trx_to = 'v_sealing' THEN NEW.trx_quantity ELSE 0 END,
        n_t_cutting = n_t_cutting 
            - CASE WHEN NEW.trx_to = 'n_t_cutting' THEN NEW.trx_quantity ELSE 0 END,
        v_t_cutting = v_t_cutting 
            - CASE WHEN NEW.trx_to = 'v_t_cutting' THEN NEW.trx_quantity ELSE 0 END,
        m_stopper = m_stopper 
            - CASE WHEN NEW.trx_to = 'm_stopper' THEN NEW.trx_quantity ELSE 0 END,
        v_stopper = v_stopper 
            - CASE WHEN NEW.trx_to = 'v_stopper' THEN NEW.trx_quantity ELSE 0 END,
        n_stopper = n_stopper 
            - CASE WHEN NEW.trx_to = 'n_stopper' THEN NEW.trx_quantity ELSE 0 END,
        cutting = cutting 
            - CASE WHEN NEW.trx_to = 'cutting' THEN NEW.trx_quantity ELSE 0 END,
        qc_and_packing = qc_and_packing 
            - CASE WHEN NEW.trx_to = 'qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
        die_casting = die_casting 
            - CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END,
        slider_assembly = slider_assembly 
            - CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END,
        coloring = coloring 
            - CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END,

    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.stock_after_material_trx_against_order_description_update() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        tape_making = tape_making 
            - CASE WHEN NEW.trx_to = 'tape_making' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'tape_making' THEN OLD.trx_quantity ELSE 0 END,
        coil_forming = coil_forming 
            - CASE WHEN NEW.trx_to = 'coil_forming' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'coil_forming' THEN OLD.trx_quantity ELSE 0 END,
        dying_and_iron = dying_and_iron 
            - CASE WHEN NEW.trx_to = 'dying_and_iron' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'dying_and_iron' THEN OLD.trx_quantity ELSE 0 END,
        m_gapping = m_gapping 
            - CASE WHEN NEW.trx_to = 'm_gapping' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'm_gapping' THEN OLD.trx_quantity ELSE 0 END,
        v_gapping = v_gapping 
            - CASE WHEN NEW.trx_to = 'v_gapping' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'v_gapping' THEN OLD.trx_quantity ELSE 0 END,
        v_teeth_molding = v_teeth_molding 
            - CASE WHEN NEW.trx_to = 'v_teeth_molding' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'v_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
        m_teeth_molding = m_teeth_molding 
            - CASE WHEN NEW.trx_to = 'm_teeth_molding' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'm_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
        teeth_assembling_and_polishing = teeth_assembling_and_polishing 
            - CASE WHEN NEW.trx_to = 'teeth_assembling_and_polishing' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'teeth_assembling_and_polishing' THEN OLD.trx_quantity ELSE 0 END,
        m_teeth_cleaning = m_teeth_cleaning 
            - CASE WHEN NEW.trx_to = 'm_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'm_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
        v_teeth_cleaning = v_teeth_cleaning 
            - CASE WHEN NEW.trx_to = 'v_teeth_cleaning' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'v_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
        plating_and_iron = plating_and_iron 
            - CASE WHEN NEW.trx_to = 'plating_and_iron' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'plating_and_iron' THEN OLD.trx_quantity ELSE 0 END,
        m_sealing = m_sealing 
            - CASE WHEN NEW.trx_to = 'm_sealing' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'm_sealing' THEN OLD.trx_quantity ELSE 0 END,
        v_sealing = v_sealing 
            - CASE WHEN NEW.trx_to = 'v_sealing' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'v_sealing' THEN OLD.trx_quantity ELSE 0 END,
        n_t_cutting = n_t_cutting 
            - CASE WHEN NEW.trx_to = 'n_t_cutting' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'n_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
        v_t_cutting = v_t_cutting 
            - CASE WHEN NEW.trx_to = 'v_t_cutting' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'v_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
        m_stopper = m_stopper 
            - CASE WHEN NEW.trx_to = 'm_stopper' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'm_stopper' THEN OLD.trx_quantity ELSE 0 END,
        v_stopper = v_stopper 
            - CASE WHEN NEW.trx_to = 'v_stopper' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'v_stopper' THEN OLD.trx_quantity ELSE 0 END,
        n_stopper = n_stopper 
            - CASE WHEN NEW.trx_to = 'n_stopper' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'n_stopper' THEN OLD.trx_quantity ELSE 0 END,
        cutting = cutting 
            - CASE WHEN NEW.trx_to = 'cutting' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'cutting' THEN OLD.trx_quantity ELSE 0 END,
        qc_and_packing = qc_and_packing 
            - CASE WHEN NEW.trx_to = 'qc_and_packing' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
        die_casting = die_casting 
            - CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
        slider_assembly = slider_assembly 
            - CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
        coloring = coloring 
            - CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END 
            + CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END,

    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.stock_after_material_trx_against_order_description_delete() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        tape_making = tape_making 
            + CASE WHEN OLD.trx_to = 'tape_making' THEN OLD.trx_quantity ELSE 0 END,
        coil_forming = coil_forming 
            + CASE WHEN OLD.trx_to = 'coil_forming' THEN OLD.trx_quantity ELSE 0 END,
        dying_and_iron = dying_and_iron 
            + CASE WHEN OLD.trx_to = 'dying_and_iron' THEN OLD.trx_quantity ELSE 0 END,
        m_gapping = m_gapping 
            + CASE WHEN OLD.trx_to = 'm_gapping' THEN OLD.trx_quantity ELSE 0 END,
        v_gapping = v_gapping 
            + CASE WHEN OLD.trx_to = 'v_gapping' THEN OLD.trx_quantity ELSE 0 END,
        v_teeth_molding = v_teeth_molding 
            + CASE WHEN OLD.trx_to = 'v_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
        m_teeth_molding = m_teeth_molding 
            + CASE WHEN OLD.trx_to = 'm_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
        teeth_assembling_and_polishing = teeth_assembling_and_polishing 
            + CASE WHEN OLD.trx_to = 'teeth_assembling_and_polishing' THEN OLD.trx_quantity ELSE 0 END,
        m_teeth_cleaning = m_teeth_cleaning 
            + CASE WHEN OLD.trx_to = 'm_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
        v_teeth_cleaning = v_teeth_cleaning 
            + CASE WHEN OLD.trx_to = 'v_teeth_cleaning' THEN OLD.trx_quantity ELSE 0 END,
        plating_and_iron = plating_and_iron 
            + CASE WHEN OLD.trx_to = 'plating_and_iron' THEN OLD.trx_quantity ELSE 0 END,
        m_sealing = m_sealing 
            + CASE WHEN OLD.trx_to = 'm_sealing' THEN OLD.trx_quantity ELSE 0 END,
        v_sealing = v_sealing 
            + CASE WHEN OLD.trx_to = 'v_sealing' THEN OLD.trx_quantity ELSE 0 END,
        n_t_cutting = n_t_cutting 
            + CASE WHEN OLD.trx_to = 'n_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
        v_t_cutting = v_t_cutting
            + CASE WHEN OLD.trx_to = 'v_t_cutting' THEN OLD.trx_quantity ELSE 0 END,
        m_stopper = m_stopper
            + CASE WHEN OLD.trx_to = 'm_stopper' THEN OLD.trx_quantity ELSE 0 END,
        v_stopper = v_stopper
            + CASE WHEN OLD.trx_to = 'v_stopper' THEN OLD.trx_quantity ELSE 0 END,
        n_stopper = n_stopper
            + CASE WHEN OLD.trx_to = 'n_stopper' THEN OLD.trx_quantity ELSE 0 END,
        cutting = cutting
            + CASE WHEN OLD.trx_to = 'cutting' THEN OLD.trx_quantity ELSE 0 END,
        qc_and_packing = qc_and_packing
            + CASE WHEN OLD.trx_to = 'qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
        die_casting = die_casting
            + CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
        slider_assembly = slider_assembly
            + CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
        coloring = coloring
            + CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END,

    WHERE material_uuid = OLD.material_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;





CREATE TRIGGER stock_after_material_trx_against_order_description_insert
AFTER INSERT ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION material.stock_after_material_trx_against_order_description_insert();

CREATE TRIGGER stock_after_material_trx_against_order_description_update
AFTER UPDATE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION material.stock_after_material_trx_against_order_description_update();

CREATE TRIGGER stock_after_material_trx_against_order_description_delete
AFTER DELETE ON zipper.material_trx_against_order_description
FOR EACH ROW
EXECUTE FUNCTION material.stock_after_material_trx_against_order_description_delete();



