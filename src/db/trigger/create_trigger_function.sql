------------------------- SFG Commercial PI Entry Trigger ------------------------- * inserted in DB
CREATE OR REPLACE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_cash_quantity
    WHERE uuid = NEW.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi + NEW.pi_cash_quantity
    WHERE uuid = NEW.thread_order_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi - OLD.pi_cash_quantity
    WHERE uuid = OLD.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi - OLD.pi_cash_quantity
    WHERE uuid = OLD.thread_order_entry_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS TRIGGER AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_cash_quantity - OLD.pi_cash_quantity
    WHERE uuid = NEW.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi + NEW.pi_cash_quantity - OLD.pi_cash_quantity
    WHERE uuid = NEW.thread_order_entry_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sfg_after_commercial_pi_entry_insert_trigger
AFTER INSERT ON commercial.pi_cash_entry
FOR EACH ROW
EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();

CREATE OR REPLACE TRIGGER sfg_after_commercial_pi_entry_delete_trigger
AFTER DELETE ON commercial.pi_cash_entry
FOR EACH ROW
EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();

CREATE OR REPLACE TRIGGER sfg_after_commercial_pi_entry_update_trigger
AFTER UPDATE ON commercial.pi_cash_entry
FOR EACH ROW
EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();

------------------------- SFG Order Entry Trigger -------------------------
CREATE OR REPLACE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS TRIGGER AS $$
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

CREATE OR REPLACE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sfg_after_order_entry_insert
AFTER INSERT ON zipper.order_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();

CREATE OR REPLACE TRIGGER sfg_after_order_entry_delete
AFTER DELETE ON zipper.order_entry
FOR EACH ROW
EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();

------------------------- Purchase Entry Trigger ------------------------- // inserted in DB
CREATE OR REPLACE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
        SET 
            stock = stock + NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
        SET 
            stock = stock - OLD.quantity
    WHERE material_uuid = OLD.material_uuid;
    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS TRIGGER AS $$

BEGIN
    IF NEW.material_uuid <> OLD.material_uuid THEN
        -- Deduct the old quantity from the old item's stock
        UPDATE material.stock
        SET stock = stock - OLD.quantity
        WHERE material_uuid = OLD.material_uuid;

        -- Add the new quantity to the new item's stock
        UPDATE material.stock
        SET stock = stock + NEW.quantity
        WHERE material_uuid = NEW.material_uuid;
    ELSE
        -- If the item has not changed, update the stock with the difference
        UPDATE material.stock
        SET stock = stock + NEW.quantity - OLD.quantity
        WHERE material_uuid = NEW.material_uuid;
    END IF;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER material_stock_after_purchase_entry_insert
AFTER INSERT ON purchase.entry
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();

CREATE OR REPLACE TRIGGER material_stock_after_purchase_entry_delete
AFTER DELETE ON purchase.entry
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();

CREATE OR REPLACE TRIGGER material_stock_after_purchase_entry_update
AFTER UPDATE ON purchase.entry
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();


--------------------------------- Material Used Trigger ------------------------------ // inserted in DB
CREATE OR REPLACE FUNCTION material.material_stock_after_material_used_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    lab_dip = lab_dip - CASE WHEN NEW.section = 'lab_dip' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    tape_making = tape_making - CASE WHEN NEW.section = 'tape_making' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    coil_forming = coil_forming - CASE WHEN NEW.section = 'coil_forming' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    dying_and_iron = dying_and_iron - CASE WHEN NEW.section = 'dying_and_iron' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_gapping = m_gapping - CASE WHEN NEW.section = 'm_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_gapping = v_gapping - CASE WHEN NEW.section = 'v_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_teeth_molding = v_teeth_molding - CASE WHEN NEW.section = 'v_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_teeth_molding = m_teeth_molding - CASE WHEN NEW.section = 'm_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing - CASE WHEN NEW.section = 'teeth_assembling_and_polishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning - CASE WHEN NEW.section = 'm_teeth_cleaning' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning - CASE WHEN NEW.section = 'v_teeth_cleaning' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    plating_and_iron = plating_and_iron - CASE WHEN NEW.section = 'plating_and_iron' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_sealing = m_sealing - CASE WHEN NEW.section = 'm_sealing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_sealing = v_sealing - CASE WHEN NEW.section = 'v_sealing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    n_t_cutting = n_t_cutting - CASE WHEN NEW.section = 'n_t_cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_t_cutting = v_t_cutting - CASE WHEN NEW.section = 'v_t_cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_stopper = m_stopper - CASE WHEN NEW.section = 'm_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_stopper = v_stopper - CASE WHEN NEW.section = 'v_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    n_stopper = n_stopper - CASE WHEN NEW.section = 'n_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    cutting = cutting - CASE WHEN NEW.section = 'cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_qc_and_packing = m_qc_and_packing - CASE WHEN NEW.section = 'm_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_qc_and_packing = v_qc_and_packing - CASE WHEN NEW.section = 'v_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    n_qc_and_packing = n_qc_and_packing - CASE WHEN NEW.section = 'n_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    s_qc_and_packing = s_qc_and_packing - CASE WHEN NEW.section = 's_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    die_casting = die_casting - CASE WHEN NEW.section = 'die_casting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    slider_assembly = slider_assembly - CASE WHEN NEW.section = 'slider_assembly' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    coloring = coloring - CASE WHEN NEW.section = 'coloring' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
   
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_material_used_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    lab_dip = lab_dip + CASE WHEN OLD.section = 'lab_dip' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    tape_making = tape_making + CASE WHEN OLD.section = 'tape_making' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    coil_forming = coil_forming + CASE WHEN OLD.section = 'coil_forming' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    dying_and_iron = dying_and_iron + CASE WHEN OLD.section = 'dying_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_gapping = m_gapping + CASE WHEN OLD.section = 'm_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_gapping = v_gapping + CASE WHEN OLD.section = 'v_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_teeth_molding = v_teeth_molding + CASE WHEN OLD.section = 'v_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_teeth_molding = m_teeth_molding + CASE WHEN OLD.section = 'm_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing + CASE WHEN OLD.section = 'teeth_assembling_and_polishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning + CASE WHEN OLD.section = 'm_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning + CASE WHEN OLD.section = 'v_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    plating_and_iron = plating_and_iron + CASE WHEN OLD.section = 'plating_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_sealing = m_sealing + CASE WHEN OLD.section = 'm_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_sealing = v_sealing + CASE WHEN OLD.section = 'v_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    n_t_cutting = n_t_cutting + CASE WHEN OLD.section = 'n_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_t_cutting = v_t_cutting + CASE WHEN OLD.section = 'v_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_stopper = m_stopper + CASE WHEN OLD.section = 'm_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_stopper = v_stopper + CASE WHEN OLD.section = 'v_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    n_stopper = n_stopper + CASE WHEN OLD.section = 'n_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    cutting = cutting + CASE WHEN OLD.section = 'cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_qc_and_packing = m_qc_and_packing + CASE WHEN OLD.section = 'm_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_qc_and_packing = v_qc_and_packing + CASE WHEN OLD.section = 'v_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    n_qc_and_packing = n_qc_and_packing + CASE WHEN OLD.section = 'n_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    s_qc_and_packing = s_qc_and_packing + CASE WHEN OLD.section = 's_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    die_casting = die_casting + CASE WHEN OLD.section = 'die_casting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    slider_assembly = slider_assembly + CASE WHEN OLD.section = 'slider_assembly' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    coloring = coloring + CASE WHEN OLD.section = 'coloring' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    WHERE material_uuid = OLD.material_uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_material_used_update() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
    lab_dip = lab_dip + 
    CASE WHEN NEW.section = 'lab_dip' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    tape_making = tape_making + 
    CASE WHEN OLD.section = 'tape_making' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    coil_forming = coil_forming + 
    CASE WHEN OLD.section = 'coil_forming' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    dying_and_iron = dying_and_iron + 
    CASE WHEN OLD.section = 'dying_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_gapping = m_gapping + 
    CASE WHEN OLD.section = 'm_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_gapping = v_gapping + 
    CASE WHEN OLD.section = 'v_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_teeth_molding = v_teeth_molding + 
    CASE WHEN OLD.section = 'v_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_teeth_molding = m_teeth_molding + 
    CASE WHEN OLD.section = 'm_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing + 
    CASE WHEN OLD.section = 'teeth_assembling_and_polishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning + 
    CASE WHEN OLD.section = 'm_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning + 
    CASE WHEN OLD.section = 'v_teeth_cleaning' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    plating_and_iron = plating_and_iron + 
    CASE WHEN OLD.section = 'plating_and_iron' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_sealing = m_sealing + 
    CASE WHEN OLD.section = 'm_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_sealing = v_sealing + 
    CASE WHEN OLD.section = 'v_sealing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    n_t_cutting = n_t_cutting + 
    CASE WHEN OLD.section = 'n_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_t_cutting = v_t_cutting + 
    CASE WHEN OLD.section = 'v_t_cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_stopper = m_stopper + 
    CASE WHEN OLD.section = 'm_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_stopper = v_stopper + 
    CASE WHEN OLD.section = 'v_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    n_stopper = n_stopper + 
    CASE WHEN OLD.section = 'n_stopper' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    cutting = cutting + 
    CASE WHEN OLD.section = 'cutting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    m_qc_and_packing = m_qc_and_packing + 
    CASE WHEN OLD.section = 'm_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    v_qc_and_packing = v_qc_and_packing + 
    CASE WHEN OLD.section = 'v_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    n_qc_and_packing = n_qc_and_packing + 
    CASE WHEN OLD.section = 'n_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    s_qc_and_packing = s_qc_and_packing + 
    CASE WHEN OLD.section = 's_qc_and_packing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    die_casting = die_casting + 
    CASE WHEN OLD.section = 'die_casting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    slider_assembly = slider_assembly + 
    CASE WHEN OLD.section = 'slider_assembly' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
    coloring = coloring + 
    CASE WHEN OLD.section = 'coloring' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    WHERE material_uuid = NEW.material_uuid;

    UPDATE material.stock
    SET
    lab_dip = lab_dip -
    CASE WHEN NEW.section = 'lab_dip' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    tape_making = tape_making -
    CASE WHEN NEW.section = 'tape_making' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    coil_forming = coil_forming -
    CASE WHEN NEW.section = 'coil_forming' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    dying_and_iron = dying_and_iron -
    CASE WHEN NEW.section = 'dying_and_iron' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_gapping = m_gapping -
    CASE WHEN NEW.section = 'm_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_gapping = v_gapping -
    CASE WHEN NEW.section = 'v_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_teeth_molding = v_teeth_molding -
    CASE WHEN NEW.section = 'v_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_teeth_molding = m_teeth_molding -
    CASE WHEN NEW.section = 'm_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    teeth_assembling_and_polishing = teeth_assembling_and_polishing -
    CASE WHEN NEW.section = 'teeth_assembling_and_polishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_teeth_cleaning = m_teeth_cleaning -
    CASE WHEN NEW.section = 'm_teeth_cleaning' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_teeth_cleaning = v_teeth_cleaning -
    CASE WHEN NEW.section = 'v_teeth_cleaning' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    plating_and_iron = plating_and_iron -
    CASE WHEN NEW.section = 'plating_and_iron' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_sealing = m_sealing -
    CASE WHEN NEW.section = 'm_sealing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_sealing = v_sealing -
    CASE WHEN NEW.section = 'v_sealing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    n_t_cutting = n_t_cutting -
    CASE WHEN NEW.section = 'n_t_cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_t_cutting = v_t_cutting -
    CASE WHEN NEW.section = 'v_t_cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_stopper = m_stopper -
    CASE WHEN NEW.section = 'm_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_stopper = v_stopper -
    CASE WHEN NEW.section = 'v_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    n_stopper = n_stopper -
    CASE WHEN NEW.section = 'n_stopper' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    cutting = cutting -
    CASE WHEN NEW.section = 'cutting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    m_qc_and_packing = m_qc_and_packing -
    CASE WHEN NEW.section = 'm_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    v_qc_and_packing = v_qc_and_packing -
    CASE WHEN NEW.section = 'v_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    n_qc_and_packing = n_qc_and_packing -
    CASE WHEN NEW.section = 'n_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    s_qc_and_packing = s_qc_and_packing -
    CASE WHEN NEW.section = 's_qc_and_packing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    die_casting = die_casting -
    CASE WHEN NEW.section = 'die_casting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    slider_assembly = slider_assembly -
    CASE WHEN NEW.section = 'slider_assembly' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
    coloring = coloring -
    CASE WHEN NEW.section = 'coloring' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER material_stock_after_material_used_insert
AFTER INSERT ON material.used
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_used_insert();

CREATE OR REPLACE TRIGGER material_stock_after_material_used_delete
AFTER DELETE ON material.used
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_used_delete();

CREATE OR REPLACE TRIGGER material_stock_after_material_used_update
AFTER UPDATE ON material.used
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_used_update();


--------------------------------- Material Transaction Trigger --------------------------- * inserted in db
CREATE OR REPLACE FUNCTION material.material_stock_after_material_trx_insert() RETURNS TRIGGER AS $$
BEGIN

    IF NEW.booking_uuid IS NOT NULL THEN
        UPDATE material.stock
            SET 
            lab_dip = lab_dip + CASE WHEN NEW.trx_to = 'lab_dip' THEN NEW.trx_quantity ELSE 0 END,
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
            m_qc_and_packing = m_qc_and_packing + CASE WHEN NEW.trx_to = 'm_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
            v_qc_and_packing = v_qc_and_packing + CASE WHEN NEW.trx_to = 'v_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
            n_qc_and_packing = n_qc_and_packing + CASE WHEN NEW.trx_to = 'n_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
            s_qc_and_packing = s_qc_and_packing + CASE WHEN NEW.trx_to = 's_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
            die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END,
            coloring = coloring + CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END
        WHERE material_uuid = NEW.material_uuid;

        UPDATE material.booking
            SET 
                quantity = quantity - NEW.trx_quantity,
                trx_quantity = trx_quantity + NEW.trx_quantity
        WHERE uuid = NEW.booking_uuid;

    ELSE
        UPDATE material.stock
        SET 
        stock = stock -  NEW.trx_quantity,
        lab_dip = lab_dip + CASE WHEN NEW.trx_to = 'lab_dip' THEN NEW.trx_quantity ELSE 0 END,
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
        m_qc_and_packing = m_qc_and_packing + CASE WHEN NEW.trx_to = 'm_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
        v_qc_and_packing = v_qc_and_packing + CASE WHEN NEW.trx_to = 'v_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
        n_qc_and_packing = n_qc_and_packing + CASE WHEN NEW.trx_to = 'n_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
        s_qc_and_packing = s_qc_and_packing + CASE WHEN NEW.trx_to = 's_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END,
        die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END,
        slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END,
        coloring = coloring + CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_material_trx_delete() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.booking_uuid IS NOT NULL THEN
        UPDATE material.stock
        SET
            lab_dip = lab_dip - CASE WHEN OLD.trx_to = 'lab_dip' THEN OLD.trx_quantity ELSE 0 END,
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
            m_qc_and_packing = m_qc_and_packing - CASE WHEN OLD.trx_to = 'm_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            v_qc_and_packing = v_qc_and_packing - CASE WHEN OLD.trx_to = 'v_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            n_qc_and_packing = n_qc_and_packing - CASE WHEN OLD.trx_to = 'n_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            s_qc_and_packing = s_qc_and_packing - CASE WHEN OLD.trx_to = 's_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            coloring = coloring - CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END
        WHERE material_uuid = OLD.material_uuid;

        UPDATE material.booking
        SET 
            quantity = quantity + OLD.trx_quantity,
            trx_quantity = trx_quantity - OLD.trx_quantity
        WHERE uuid = OLD.booking_uuid;

    ELSE
        UPDATE material.stock
        SET 
            stock = stock + OLD.trx_quantity,
            lab_dip = lab_dip - CASE WHEN OLD.trx_to = 'lab_dip' THEN OLD.trx_quantity ELSE 0 END,
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
            m_qc_and_packing = m_qc_and_packing - CASE WHEN OLD.trx_to = 'm_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            v_qc_and_packing = v_qc_and_packing - CASE WHEN OLD.trx_to = 'v_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            n_qc_and_packing = n_qc_and_packing - CASE WHEN OLD.trx_to = 'n_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            s_qc_and_packing = s_qc_and_packing - CASE WHEN OLD.trx_to = 's_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            coloring = coloring - CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_material_trx_update() RETURNS TRIGGER AS $$
BEGIN

    IF NEW.booking_uuid IS NOT NULL THEN 
        UPDATE material.stock
            SET 
            lab_dip = lab_dip + CASE WHEN NEW.trx_to = 'lab_dip' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'lab_dip' THEN OLD.trx_quantity ELSE 0 END,
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
            m_qc_and_packing = m_qc_and_packing + CASE WHEN NEW.trx_to = 'm_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            v_qc_and_packing = v_qc_and_packing + CASE WHEN NEW.trx_to = 'v_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            n_qc_and_packing = n_qc_and_packing + CASE WHEN NEW.trx_to = 'n_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'n_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            s_qc_and_packing = s_qc_and_packing + CASE WHEN NEW.trx_to = 's_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 's_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            coloring = coloring + CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END
            WHERE material_uuid = NEW.material_uuid;

        UPDATE material.booking
            SET 
                quantity = quantity - NEW.trx_quantity + OLD.trx_quantity,
                trx_quantity = trx_quantity + NEW.trx_quantity - OLD.trx_quantity
        WHERE uuid = NEW.booking_uuid;

    ELSE

        UPDATE material.stock
            SET 
            stock = stock - NEW.trx_quantity + OLD.trx_quantity,
            lab_dip = lab_dip + CASE WHEN NEW.trx_to = 'lab_dip' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'lab_dip' THEN OLD.trx_quantity ELSE 0 END,
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
            m_qc_and_packing = m_qc_and_packing + CASE WHEN NEW.trx_to = 'm_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'm_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            v_qc_and_packing = v_qc_and_packing + CASE WHEN NEW.trx_to = 'v_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'v_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            n_qc_and_packing = n_qc_and_packing + CASE WHEN NEW.trx_to = 'n_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'n_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            s_qc_and_packing = s_qc_and_packing + CASE WHEN NEW.trx_to = 's_qc_and_packing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 's_qc_and_packing' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            coloring = coloring + CASE WHEN NEW.trx_to = 'coloring' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coloring' THEN OLD.trx_quantity ELSE 0 END
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER material_stock_after_material_trx_insert
AFTER INSERT ON material.trx
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_trx_insert();

CREATE OR REPLACE TRIGGER material_stock_after_material_trx_delete
AFTER DELETE ON material.trx
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_trx_delete();

CREATE OR REPLACE TRIGGER material_stock_after_material_trx_update
AFTER UPDATE ON material.trx
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_trx_update();

--------------------------------- Material Stock SFG Trigger ------------------------------ // inserted in DB
CREATE OR REPLACE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS TRIGGER AS $$
BEGIN
    --Update material.stock table
    UPDATE material.stock 
    SET
        stock = stock - NEW.trx_quantity
    WHERE stock.material_uuid = NEW.material_uuid;

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
            + CASE WHEN NEW.trx_to = 'warehouse' THEN NEW.trx_quantity ELSE 0 END,
        delivered = delivered
            + CASE WHEN NEW.trx_to = 'delivered' THEN NEW.trx_quantity ELSE 0 END,
        pi = pi 
            + CASE WHEN NEW.trx_to = 'pi' THEN NEW.trx_quantity ELSE 0 END
        
    WHERE order_entry_uuid = NEW.order_entry_uuid;
    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS TRIGGER AS $$
BEGIN
    --Update material.stock table
    UPDATE material.stock 
    SET
        stock = stock + OLD.trx_quantity
    WHERE stock.material_uuid = OLD.material_uuid;

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
            - CASE WHEN OLD.trx_to = 'warehouse' THEN OLD.trx_quantity ELSE 0 END,
        delivered = delivered
            - CASE WHEN OLD.trx_to = 'delivered' THEN OLD.trx_quantity ELSE 0 END,
        pi = pi 
            - CASE WHEN OLD.trx_to = 'pi' THEN OLD.trx_quantity ELSE 0 END
    WHERE order_entry_uuid = OLD.order_entry_uuid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS TRIGGER AS $$
BEGIN
    --Update material.stock table
    UPDATE material.stock 
    SET
        stock = stock - NEW.trx_quantity + OLD.trx_quantity
    WHERE stock.material_uuid = NEW.material_uuid;

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

CREATE OR REPLACE TRIGGER material_stock_sfg_after_stock_to_sfg_insert
AFTER INSERT ON material.stock_to_sfg
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();

CREATE OR REPLACE TRIGGER material_stock_sfg_after_stock_to_sfg_delete
AFTER DELETE ON material.stock_to_sfg
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();

CREATE OR REPLACE TRIGGER material_stock_sfg_after_stock_to_sfg_update
AFTER UPDATE ON material.stock_to_sfg
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();


------------------------- Material Info Trigger -------------------------- // inserted in DB

CREATE OR REPLACE FUNCTION material.material_stock_after_material_info_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO material.stock
       (uuid, material_uuid)
    VALUES
         (NEW.uuid, NEW.uuid);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION material.material_stock_after_material_info_delete() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER material_stock_after_material_info_insert
AFTER INSERT ON material.info
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_info_insert();

CREATE OR REPLACE TRIGGER material_stock_after_material_info_delete
AFTER DELETE ON material.info
FOR EACH ROW
EXECUTE FUNCTION material.material_stock_after_material_info_delete();





