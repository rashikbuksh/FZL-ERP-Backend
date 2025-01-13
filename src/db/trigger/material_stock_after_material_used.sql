--------------------------------- Material Used Trigger ------------------------------ // inserted in DB
CREATE OR REPLACE FUNCTION material.material_stock_after_material_used_insert() RETURNS TRIGGER AS $$
BEGIN
    UPDATE material.stock
    SET 
        lab_dip = lab_dip - CASE WHEN NEW.section = 'lab_dip' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        tape_making = tape_making - CASE WHEN NEW.section = 'tape_making' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        box_pin_metal = box_pin_metal - CASE WHEN NEW.section = 'box_pin_metal' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        chemicals_dyeing = chemicals_dyeing - CASE WHEN NEW.section = 'chemicals_dyeing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        chemicals_coating = chemicals_coating - CASE WHEN NEW.section = 'chemicals_coating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        coating_epoxy_paint_harmes = coating_epoxy_paint_harmes - CASE WHEN NEW.section = 'coating_epoxy_paint_harmes' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        coil_forming_sewing = coil_forming_sewing - CASE WHEN NEW.section = 'coil_forming_sewing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        coil_forming_sewing_forming = coil_forming_sewing_forming - CASE WHEN NEW.section = 'coil_forming_sewing_forming' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        dyeing = dyeing - CASE WHEN NEW.section = 'dyeing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END, 
        elastic = elastic - CASE WHEN NEW.section = 'elastic' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        electroplating = electroplating - CASE WHEN NEW.section = 'electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating - CASE WHEN NEW.section = 'gtz_india_pvt_ltd_electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating - CASE WHEN NEW.section = 'gtz_india_pvt_ltd_teeth_plating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        invisible = invisible - CASE WHEN NEW.section = 'invisible' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_finishing = metal_finishing - CASE WHEN NEW.section = 'metal_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal = metal - CASE WHEN NEW.section = 'metal' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_teeth_electroplating = metal_teeth_electroplating - CASE WHEN NEW.section = 'metal_teeth_electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding - CASE WHEN NEW.section = 'metal_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_teeth_plating = metal_teeth_plating - CASE WHEN NEW.section = 'metal_teeth_plating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        nylon = nylon - CASE WHEN NEW.section = 'nylon' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        nylon_finishing = nylon_finishing - CASE WHEN NEW.section = 'nylon_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        nylon_gapping = nylon_gapping - CASE WHEN NEW.section = 'nylon_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        pigment_dye = pigment_dye - CASE WHEN NEW.section = 'pigment_dye' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical - CASE WHEN NEW.section = 'qlq_enterprise_bangladesh_ltd_chemical' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        die_casting = die_casting - CASE WHEN NEW.section = 'die_casting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        slider_assembly = slider_assembly - CASE WHEN NEW.section = 'slider_assembly' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        sewing_thread_finishing = sewing_thread_finishing - CASE WHEN NEW.section = 'sewing_thread_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        sewing_thread = sewing_thread - CASE WHEN NEW.section = 'sewing_thread' THEN NEW.used_quantity + NEW.wastage ELSE 0 END, 
        slider_coating_epoxy_paint = slider_coating_epoxy_paint - CASE WHEN NEW.section = 'slider_coating_epoxy_paint' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        slider_electroplating = slider_electroplating - CASE WHEN NEW.section = 'slider_electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        soft_winding = soft_winding - CASE WHEN NEW.section = 'soft_winding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        tape_loom = tape_loom - CASE WHEN NEW.section = 'tape_loom' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        thread_dying = thread_dying - CASE WHEN NEW.section = 'thread_dying' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_finishing = vislon_finishing - CASE WHEN NEW.section = 'vislon_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_gapping = vislon_gapping - CASE WHEN NEW.section = 'vislon_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_injection = vislon_injection - CASE WHEN NEW.section = 'vislon_injection' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_open_injection = vislon_open_injection - CASE WHEN NEW.section = 'vislon_open_injection' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon = vislon - CASE WHEN NEW.section = 'vislon' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        zipper_dying = zipper_dying - CASE WHEN NEW.section = 'zipper_dying' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
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
        box_pin_metal = box_pin_metal + CASE WHEN OLD.section = 'box_pin_metal' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        chemicals_dyeing = chemicals_dyeing + CASE WHEN OLD.section = 'chemicals_dyeing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        chemicals_coating = chemicals_coating + CASE WHEN OLD.section = 'chemicals_coating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        coating_epoxy_paint_harmes = coating_epoxy_paint_harmes + CASE WHEN OLD.section = 'coating_epoxy_paint_harmes' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        coil_forming_sewing = coil_forming_sewing + CASE WHEN OLD.section = 'coil_forming_sewing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        coil_forming_sewing_forming = coil_forming_sewing_forming + CASE WHEN OLD.section = 'coil_forming_sewing_forming' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        dyeing = dyeing + CASE WHEN OLD.section = 'dyeing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        elastic = elastic + CASE WHEN OLD.section = 'elastic' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        electroplating = electroplating + CASE WHEN OLD.section = 'electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating + CASE WHEN OLD.section = 'gtz_india_pvt_ltd_electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating + CASE WHEN OLD.section = 'gtz_india_pvt_ltd_teeth_plating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        invisible = invisible + CASE WHEN OLD.section = 'invisible' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_finishing = metal_finishing + CASE WHEN OLD.section = 'metal_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal = metal + CASE WHEN OLD.section = 'metal' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_teeth_electroplating = metal_teeth_electroplating + CASE WHEN OLD.section = 'metal_teeth_electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding + CASE WHEN OLD.section = 'metal_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_teeth_plating = metal_teeth_plating + CASE WHEN OLD.section = 'metal_teeth_plating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        nylon = nylon + CASE WHEN OLD.section = 'nylon' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        nylon_finishing = nylon_finishing + CASE WHEN OLD.section = 'nylon_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        nylon_gapping = nylon_gapping + CASE WHEN OLD.section = 'nylon_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        pigment_dye = pigment_dye + CASE WHEN OLD.section = 'pigment_dye' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical + CASE WHEN OLD.section = 'qlq_enterprise_bangladesh_ltd_chemical' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        die_casting = die_casting + CASE WHEN OLD.section = 'die_casting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        slider_assembly = slider_assembly + CASE WHEN OLD.section = 'slider_assembly' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        sewing_thread_finishing = sewing_thread_finishing + CASE WHEN OLD.section = 'sewing_thread_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        sewing_thread = sewing_thread + CASE WHEN OLD.section = 'sewing_thread' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        slider_coating_epoxy_paint = slider_coating_epoxy_paint + CASE WHEN OLD.section = 'slider_coating_epoxy_paint' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        slider_electroplating = slider_electroplating + CASE WHEN OLD.section = 'slider_electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        soft_winding = soft_winding + CASE WHEN OLD.section = 'soft_winding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        tape_loom = tape_loom + CASE WHEN OLD.section = 'tape_loom' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        thread_dying = thread_dying + CASE WHEN OLD.section = 'thread_dying' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_finishing = vislon_finishing + CASE WHEN OLD.section = 'vislon_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_gapping = vislon_gapping + CASE WHEN OLD.section = 'vislon_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_injection = vislon_injection + CASE WHEN OLD.section = 'vislon_injection' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_open_injection = vislon_open_injection + CASE WHEN OLD.section = 'vislon_open_injection' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon = vislon + CASE WHEN OLD.section = 'vislon' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        zipper_dying = zipper_dying + CASE WHEN OLD.section = 'zipper_dying' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
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
        box_pin_metal = box_pin_metal +
        CASE WHEN OLD.section = 'box_pin_metal' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        chemicals_dyeing = chemicals_dyeing +
        CASE WHEN OLD.section = 'chemicals_dyeing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        chemicals_coating = chemicals_coating +
        CASE WHEN OLD.section = 'chemicals_coating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        coating_epoxy_paint_harmes = coating_epoxy_paint_harmes +
        CASE WHEN OLD.section = 'coating_epoxy_paint_harmes' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        coil_forming_sewing = coil_forming_sewing +
        CASE WHEN OLD.section = 'coil_forming_sewing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        coil_forming_sewing_forming = coil_forming_sewing_forming +
        CASE WHEN OLD.section = 'coil_forming_sewing_forming' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        dyeing = dyeing +
        CASE WHEN OLD.section = 'dyeing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        elastic = elastic +
        CASE WHEN OLD.section = 'elastic' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        electroplating = electroplating +
        CASE WHEN OLD.section = 'electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating +
        CASE WHEN OLD.section = 'gtz_india_pvt_ltd_electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating +
        CASE WHEN OLD.section = 'gtz_india_pvt_ltd_teeth_plating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        invisible = invisible +
        CASE WHEN OLD.section = 'invisible' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_finishing = metal_finishing +
        CASE WHEN OLD.section = 'metal_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal = metal +
        CASE WHEN OLD.section = 'metal' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_teeth_electroplating = metal_teeth_electroplating +
        CASE WHEN OLD.section = 'metal_teeth_electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding +
        CASE WHEN OLD.section = 'metal_teeth_molding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        metal_teeth_plating = metal_teeth_plating +
        CASE WHEN OLD.section = 'metal_teeth_plating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        nylon = nylon +
        CASE WHEN OLD.section = 'nylon' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        nylon_finishing = nylon_finishing +
        CASE WHEN OLD.section = 'nylon_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        nylon_gapping = nylon_gapping +
        CASE WHEN OLD.section = 'nylon_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        pigment_dye = pigment_dye +
        CASE WHEN OLD.section = 'pigment_dye' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical +
        CASE WHEN OLD.section = 'qlq_enterprise_bangladesh_ltd_chemical' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        die_casting = die_casting +
        CASE WHEN OLD.section = 'die_casting' THEN OLD.used_quantity + OLD.wastage ELSE 0 END, 
        slider_assembly = slider_assembly +
        CASE WHEN OLD.section = 'slider_assembly' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        sewing_thread_finishing = sewing_thread_finishing +
        CASE WHEN OLD.section = 'sewing_thread_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        sewing_thread = sewing_thread +
        CASE WHEN OLD.section = 'sewing_thread' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        slider_coating_epoxy_paint = slider_coating_epoxy_paint +
        CASE WHEN OLD.section = 'slider_coating_epoxy_paint' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        slider_electroplating = slider_electroplating +
        CASE WHEN OLD.section = 'slider_electroplating' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        soft_winding = soft_winding +
        CASE WHEN OLD.section = 'soft_winding' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        tape_loom = tape_loom +
        CASE WHEN OLD.section = 'tape_loom' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        thread_dying = thread_dying +
        CASE WHEN OLD.section = 'thread_dying' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_finishing = vislon_finishing +
        CASE WHEN OLD.section = 'vislon_finishing' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_gapping = vislon_gapping +
        CASE WHEN OLD.section = 'vislon_gapping' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_injection = vislon_injection +
        CASE WHEN OLD.section = 'vislon_injection' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon_open_injection = vislon_open_injection +
        CASE WHEN OLD.section = 'vislon_open_injection' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        vislon = vislon +
        CASE WHEN OLD.section = 'vislon' THEN OLD.used_quantity + OLD.wastage ELSE 0 END,
        zipper_dying = zipper_dying +
        CASE WHEN OLD.section = 'zipper_dying' THEN OLD.used_quantity + OLD.wastage ELSE 0 END
    WHERE material_uuid = NEW.material_uuid;

    UPDATE material.stock
    SET
        lab_dip = lab_dip -
        CASE WHEN NEW.section = 'lab_dip' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        tape_making = tape_making -
        CASE WHEN NEW.section = 'tape_making' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        box_pin_metal = box_pin_metal -
        CASE WHEN NEW.section = 'box_pin_metal' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        chemicals_dyeing = chemicals_dyeing -
        CASE WHEN NEW.section = 'chemicals_dyeing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        chemicals_coating = chemicals_coating -
        CASE WHEN NEW.section = 'chemicals_coating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        coating_epoxy_paint_harmes = coating_epoxy_paint_harmes -
        CASE WHEN NEW.section = 'coating_epoxy_paint_harmes' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        coil_forming_sewing = coil_forming_sewing -
        CASE WHEN NEW.section = 'coil_forming_sewing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        coil_forming_sewing_forming = coil_forming_sewing_forming -
        CASE WHEN NEW.section = 'coil_forming_sewing_forming' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        dyeing = dyeing -
        CASE WHEN NEW.section = 'dyeing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        elastic = elastic -
        CASE WHEN NEW.section = 'elastic' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        electroplating = electroplating -
        CASE WHEN NEW.section = 'electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating -
        CASE WHEN NEW.section = 'gtz_india_pvt_ltd_electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating -
        CASE WHEN NEW.section = 'gtz_india_pvt_ltd_teeth_plating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        invisible = invisible -
        CASE WHEN NEW.section = 'invisible' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_finishing = metal_finishing -
        CASE WHEN NEW.section = 'metal_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal = metal -
        CASE WHEN NEW.section = 'metal' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_teeth_electroplating = metal_teeth_electroplating -
        CASE WHEN NEW.section = 'metal_teeth_electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding -
        CASE WHEN NEW.section = 'metal_teeth_molding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        metal_teeth_plating = metal_teeth_plating -
        CASE WHEN NEW.section = 'metal_teeth_plating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        nylon = nylon -
        CASE WHEN NEW.section = 'nylon' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        nylon_finishing = nylon_finishing -
        CASE WHEN NEW.section = 'nylon_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        nylon_gapping = nylon_gapping -
        CASE WHEN NEW.section = 'nylon_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        pigment_dye = pigment_dye -
        CASE WHEN NEW.section = 'pigment_dye' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical -
        CASE WHEN NEW.section = 'qlq_enterprise_bangladesh_ltd_chemical' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        die_casting = die_casting -
        CASE WHEN NEW.section = 'die_casting' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        slider_assembly = slider_assembly -
        CASE WHEN NEW.section = 'slider_assembly' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        sewing_thread_finishing = sewing_thread_finishing -
        CASE WHEN NEW.section = 'sewing_thread_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        sewing_thread = sewing_thread -
        CASE WHEN NEW.section = 'sewing_thread' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        slider_coating_epoxy_paint = slider_coating_epoxy_paint -
        CASE WHEN NEW.section = 'slider_coating_epoxy_paint' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        slider_electroplating = slider_electroplating -
        CASE WHEN NEW.section = 'slider_electroplating' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        soft_winding = soft_winding -
        CASE WHEN NEW.section = 'soft_winding' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        tape_loom = tape_loom -
        CASE WHEN NEW.section = 'tape_loom' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        thread_dying = thread_dying -
        CASE WHEN NEW.section = 'thread_dying' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_finishing = vislon_finishing -
        CASE WHEN NEW.section = 'vislon_finishing' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_gapping = vislon_gapping -
        CASE WHEN NEW.section = 'vislon_gapping' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_injection = vislon_injection -
        CASE WHEN NEW.section = 'vislon_injection' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon_open_injection = vislon_open_injection -
        CASE WHEN NEW.section = 'vislon_open_injection' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        vislon = vislon -
        CASE WHEN NEW.section = 'vislon' THEN NEW.used_quantity + NEW.wastage ELSE 0 END,
        zipper_dying = zipper_dying -
        CASE WHEN NEW.section = 'zipper_dying' THEN NEW.used_quantity + NEW.wastage ELSE 0 END
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