--------------------------------- Material Transaction Trigger --------------------------- * inserted in db
CREATE OR REPLACE FUNCTION material.material_stock_after_material_trx_insert() RETURNS TRIGGER AS $$
BEGIN

    IF NEW.booking_uuid IS NOT NULL THEN
        UPDATE material.stock
            SET 
                lab_dip = lab_dip + CASE WHEN NEW.trx_to = 'lab_dip' THEN NEW.trx_quantity ELSE 0 END,
                tape_making = tape_making + CASE WHEN NEW.trx_to = 'tape_making' THEN NEW.trx_quantity ELSE 0 END,
                box_pin_metal = box_pin_metal + CASE WHEN NEW.trx_to = 'box_pin_metal' THEN NEW.trx_quantity ELSE 0 END,
                chemicals_dyeing = chemicals_dyeing + CASE WHEN NEW.trx_to = 'chemicals_dyeing' THEN NEW.trx_quantity ELSE 0 END,
                chemicals_coating = chemicals_coating + CASE WHEN NEW.trx_to = 'chemicals_coating' THEN NEW.trx_quantity ELSE 0 END,
                coating_epoxy_paint_harmes = coating_epoxy_paint_harmes + CASE WHEN NEW.trx_to = 'coating_epoxy_paint_harmes' THEN NEW.trx_quantity ELSE 0 END,
                coil_forming_sewing = coil_forming_sewing + CASE WHEN NEW.trx_to = 'coil_forming_sewing' THEN NEW.trx_quantity ELSE 0 END,
                coil_forming_sewing_forming = coil_forming_sewing_forming + CASE WHEN NEW.trx_to = 'coil_forming_sewing_forming' THEN NEW.trx_quantity ELSE 0 END,
                dyeing = dyeing + CASE WHEN NEW.trx_to = 'dyeing' THEN NEW.trx_quantity ELSE 0 END,
                elastic = elastic + CASE WHEN NEW.trx_to = 'elastic' THEN NEW.trx_quantity ELSE 0 END,
                electroplating = electroplating + CASE WHEN NEW.trx_to = 'electroplating' THEN NEW.trx_quantity ELSE 0 END,
                gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN NEW.trx_quantity ELSE 0 END,
                gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN NEW.trx_quantity ELSE 0 END,
                invisible = invisible + CASE WHEN NEW.trx_to = 'invisible' THEN NEW.trx_quantity ELSE 0 END,
                metal_finishing = metal_finishing + CASE WHEN NEW.trx_to = 'metal_finishing' THEN NEW.trx_quantity ELSE 0 END,
                metal = metal + CASE WHEN NEW.trx_to = 'metal' THEN NEW.trx_quantity ELSE 0 END,
                metal_teeth_electroplating = metal_teeth_electroplating + CASE WHEN NEW.trx_to = 'metal_teeth_electroplating' THEN NEW.trx_quantity ELSE 0 END,
                metal_teeth_molding = metal_teeth_molding + CASE WHEN NEW.trx_to = 'metal_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
                metal_teeth_plating = metal_teeth_plating + CASE WHEN NEW.trx_to = 'metal_teeth_plating' THEN NEW.trx_quantity ELSE 0 END,
                nylon = nylon + CASE WHEN NEW.trx_to = 'nylon' THEN NEW.trx_quantity ELSE 0 END,
                nylon_finishing = nylon_finishing + CASE WHEN NEW.trx_to = 'nylon_finishing' THEN NEW.trx_quantity ELSE 0 END,
                nylon_gapping = nylon_gapping + CASE WHEN NEW.trx_to = 'nylon_gapping' THEN NEW.trx_quantity ELSE 0 END,
                pigment_dye = pigment_dye + CASE WHEN NEW.trx_to = 'pigment_dye' THEN NEW.trx_quantity ELSE 0 END, 
                qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical + CASE WHEN NEW.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN NEW.trx_quantity ELSE 0 END,
                die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END,
                slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END, 
                sewing_thread_finishing = sewing_thread_finishing + CASE WHEN NEW.trx_to = 'sewing_thread_finishing' THEN NEW.trx_quantity ELSE 0 END,
                sewing_thread = sewing_thread + CASE WHEN NEW.trx_to = 'sewing_thread' THEN NEW.trx_quantity ELSE 0 END,
                slider_coating_epoxy_paint = slider_coating_epoxy_paint + CASE WHEN NEW.trx_to = 'slider_coating_epoxy_paint' THEN NEW.trx_quantity ELSE 0 END,
                slider_electroplating = slider_electroplating + CASE WHEN NEW.trx_to = 'slider_electroplating' THEN NEW.trx_quantity ELSE 0 END,
                soft_winding = soft_winding + CASE WHEN NEW.trx_to = 'soft_winding' THEN NEW.trx_quantity ELSE 0 END,
                tape_loom = tape_loom + CASE WHEN NEW.trx_to = 'tape_loom' THEN NEW.trx_quantity ELSE 0 END,
                thread_dying = thread_dying + CASE WHEN NEW.trx_to = 'thread_dying' THEN NEW.trx_quantity ELSE 0 END,
                vislon_finishing = vislon_finishing + CASE WHEN NEW.trx_to = 'vislon_finishing' THEN NEW.trx_quantity ELSE 0 END, 
                vislon_gapping = vislon_gapping + CASE WHEN NEW.trx_to = 'vislon_gapping' THEN NEW.trx_quantity ELSE 0 END,
                vislon_injection = vislon_injection + CASE WHEN NEW.trx_to = 'vislon_injection' THEN NEW.trx_quantity ELSE 0 END,
                vislon_open_injection = vislon_open_injection + CASE WHEN NEW.trx_to = 'vislon_open_injection' THEN NEW.trx_quantity ELSE 0 END,
                vislon = vislon + CASE WHEN NEW.trx_to = 'vislon' THEN NEW.trx_quantity ELSE 0 END,
                zipper_dying = zipper_dying + CASE WHEN NEW.trx_to = 'zipper_dying' THEN NEW.trx_quantity ELSE 0 END
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
                box_pin_metal = box_pin_metal + CASE WHEN NEW.trx_to = 'box_pin_metal' THEN NEW.trx_quantity ELSE 0 END,
                chemicals_dyeing = chemicals_dyeing + CASE WHEN NEW.trx_to = 'chemicals_dyeing' THEN NEW.trx_quantity ELSE 0 END,
                chemicals_coating = chemicals_coating + CASE WHEN NEW.trx_to = 'chemicals_coating' THEN NEW.trx_quantity ELSE 0 END,
                coating_epoxy_paint_harmes = coating_epoxy_paint_harmes + CASE WHEN NEW.trx_to = 'coating_epoxy_paint_harmes' THEN NEW.trx_quantity ELSE 0 END,
                coil_forming_sewing = coil_forming_sewing + CASE WHEN NEW.trx_to = 'coil_forming_sewing' THEN NEW.trx_quantity ELSE 0 END,
                coil_forming_sewing_forming = coil_forming_sewing_forming + CASE WHEN NEW.trx_to = 'coil_forming_sewing_forming' THEN NEW.trx_quantity ELSE 0 END,
                dyeing = dyeing + CASE WHEN NEW.trx_to = 'dyeing' THEN NEW.trx_quantity ELSE 0 END,
                elastic = elastic + CASE WHEN NEW.trx_to = 'elastic' THEN NEW.trx_quantity ELSE 0 END,
                electroplating = electroplating + CASE WHEN NEW.trx_to = 'electroplating' THEN NEW.trx_quantity ELSE 0 END,
                gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN NEW.trx_quantity ELSE 0 END,
                gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN NEW.trx_quantity ELSE 0 END,
                invisible = invisible + CASE WHEN NEW.trx_to = 'invisible' THEN NEW.trx_quantity ELSE 0 END,
                metal_finishing = metal_finishing + CASE WHEN NEW.trx_to = 'metal_finishing' THEN NEW.trx_quantity ELSE 0 END,
                metal = metal + CASE WHEN NEW.trx_to = 'metal' THEN NEW.trx_quantity ELSE 0 END,
                metal_teeth_electroplating = metal_teeth_electroplating + CASE WHEN NEW.trx_to = 'metal_teeth_electroplating' THEN NEW.trx_quantity ELSE 0 END,
                metal_teeth_molding = metal_teeth_molding + CASE WHEN NEW.trx_to = 'metal_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
                metal_teeth_plating = metal_teeth_plating + CASE WHEN NEW.trx_to = 'metal_teeth_plating' THEN NEW.trx_quantity ELSE 0 END,
                nylon = nylon + CASE WHEN NEW.trx_to = 'nylon' THEN NEW.trx_quantity ELSE 0 END,
                nylon_finishing = nylon_finishing + CASE WHEN NEW.trx_to = 'nylon_finishing' THEN NEW.trx_quantity ELSE 0 END,
                nylon_gapping = nylon_gapping + CASE WHEN NEW.trx_to = 'nylon_gapping' THEN NEW.trx_quantity ELSE 0 END,
                pigment_dye = pigment_dye + CASE WHEN NEW.trx_to = 'pigment_dye' THEN NEW.trx_quantity ELSE 0 END, 
                qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical + CASE WHEN NEW.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN NEW.trx_quantity ELSE 0 END,
                die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END,
                slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END, 
                sewing_thread_finishing = sewing_thread_finishing + CASE WHEN NEW.trx_to = 'sewing_thread_finishing' THEN NEW.trx_quantity ELSE 0 END,
                sewing_thread = sewing_thread + CASE WHEN NEW.trx_to = 'sewing_thread' THEN NEW.trx_quantity ELSE 0 END,
                slider_coating_epoxy_paint = slider_coating_epoxy_paint + CASE WHEN NEW.trx_to = 'slider_coating_epoxy_paint' THEN NEW.trx_quantity ELSE 0 END,
                slider_electroplating = slider_electroplating + CASE WHEN NEW.trx_to = 'slider_electroplating' THEN NEW.trx_quantity ELSE 0 END,
                soft_winding = soft_winding + CASE WHEN NEW.trx_to = 'soft_winding' THEN NEW.trx_quantity ELSE 0 END,
                tape_loom = tape_loom + CASE WHEN NEW.trx_to = 'tape_loom' THEN NEW.trx_quantity ELSE 0 END,
                thread_dying = thread_dying + CASE WHEN NEW.trx_to = 'thread_dying' THEN NEW.trx_quantity ELSE 0 END,
                vislon_finishing = vislon_finishing + CASE WHEN NEW.trx_to = 'vislon_finishing' THEN NEW.trx_quantity ELSE 0 END, 
                vislon_gapping = vislon_gapping + CASE WHEN NEW.trx_to = 'vislon_gapping' THEN NEW.trx_quantity ELSE 0 END,
                vislon_injection = vislon_injection + CASE WHEN NEW.trx_to = 'vislon_injection' THEN NEW.trx_quantity ELSE 0 END,
                vislon_open_injection = vislon_open_injection + CASE WHEN NEW.trx_to = 'vislon_open_injection' THEN NEW.trx_quantity ELSE 0 END,
                vislon = vislon + CASE WHEN NEW.trx_to = 'vislon' THEN NEW.trx_quantity ELSE 0 END,
                zipper_dying = zipper_dying + CASE WHEN NEW.trx_to = 'zipper_dying' THEN NEW.trx_quantity ELSE 0 END
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
            box_pin_metal = box_pin_metal - CASE WHEN OLD.trx_to = 'box_pin_metal' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_dyeing = chemicals_dyeing - CASE WHEN OLD.trx_to = 'chemicals_dyeing' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_coating = chemicals_coating - CASE WHEN OLD.trx_to = 'chemicals_coating' THEN OLD.trx_quantity ELSE 0 END,
            coating_epoxy_paint_harmes = coating_epoxy_paint_harmes - CASE WHEN OLD.trx_to = 'coating_epoxy_paint_harmes' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing = coil_forming_sewing - CASE WHEN OLD.trx_to = 'coil_forming_sewing' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing_forming = coil_forming_sewing_forming - CASE WHEN OLD.trx_to = 'coil_forming_sewing_forming' THEN OLD.trx_quantity ELSE 0 END,
            dyeing = dyeing - CASE WHEN OLD.trx_to = 'dyeing' THEN OLD.trx_quantity ELSE 0 END,
            elastic = elastic - CASE WHEN OLD.trx_to = 'elastic' THEN OLD.trx_quantity ELSE 0 END,
            electroplating = electroplating - CASE WHEN OLD.trx_to = 'electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            invisible = invisible - CASE WHEN OLD.trx_to = 'invisible' THEN OLD.trx_quantity ELSE 0 END,
            metal_finishing = metal_finishing - CASE WHEN OLD.trx_to = 'metal_finishing' THEN OLD.trx_quantity ELSE 0 END,
            metal = metal - CASE WHEN OLD.trx_to = 'metal' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_electroplating = metal_teeth_electroplating - CASE WHEN OLD.trx_to = 'metal_teeth_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_molding = metal_teeth_molding - CASE WHEN OLD.trx_to = 'metal_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_plating = metal_teeth_plating - CASE WHEN OLD.trx_to = 'metal_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            nylon = nylon - CASE WHEN OLD.trx_to = 'nylon' THEN OLD.trx_quantity ELSE 0 END,
            nylon_finishing = nylon_finishing - CASE WHEN OLD.trx_to = 'nylon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            nylon_gapping = nylon_gapping - CASE WHEN OLD.trx_to = 'nylon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            pigment_dye = pigment_dye - CASE WHEN OLD.trx_to = 'pigment_dye' THEN OLD.trx_quantity ELSE 0 END,
            qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical - CASE WHEN OLD.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread_finishing = sewing_thread_finishing - CASE WHEN OLD.trx_to = 'sewing_thread_finishing' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread = sewing_thread - CASE WHEN OLD.trx_to = 'sewing_thread' THEN OLD.trx_quantity ELSE 0 END,
            slider_coating_epoxy_paint = slider_coating_epoxy_paint - CASE WHEN OLD.trx_to = 'slider_coating_epoxy_paint' THEN OLD.trx_quantity ELSE 0 END,
            slider_electroplating = slider_electroplating - CASE WHEN OLD.trx_to = 'slider_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            soft_winding = soft_winding - CASE WHEN OLD.trx_to = 'soft_winding' THEN OLD.trx_quantity ELSE 0 END,
            tape_loom = tape_loom - CASE WHEN OLD.trx_to = 'tape_loom' THEN OLD.trx_quantity ELSE 0 END,
            thread_dying = thread_dying - CASE WHEN OLD.trx_to = 'thread_dying' THEN OLD.trx_quantity ELSE 0 END,
            vislon_finishing = vislon_finishing - CASE WHEN OLD.trx_to = 'vislon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            vislon_gapping = vislon_gapping - CASE WHEN OLD.trx_to = 'vislon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            vislon_injection = vislon_injection - CASE WHEN OLD.trx_to = 'vislon_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon_open_injection = vislon_open_injection - CASE WHEN OLD.trx_to = 'vislon_open_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon = vislon - CASE WHEN OLD.trx_to = 'vislon' THEN OLD.trx_quantity ELSE 0 END,
            zipper_dying = zipper_dying - CASE WHEN OLD.trx_to = 'zipper_dying' THEN OLD.trx_quantity ELSE 0 END
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
            box_pin_metal = box_pin_metal - CASE WHEN OLD.trx_to = 'box_pin_metal' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_dyeing = chemicals_dyeing - CASE WHEN OLD.trx_to = 'chemicals_dyeing' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_coating = chemicals_coating - CASE WHEN OLD.trx_to = 'chemicals_coating' THEN OLD.trx_quantity ELSE 0 END,
            coating_epoxy_paint_harmes = coating_epoxy_paint_harmes - CASE WHEN OLD.trx_to = 'coating_epoxy_paint_harmes' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing = coil_forming_sewing - CASE WHEN OLD.trx_to = 'coil_forming_sewing' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing_forming = coil_forming_sewing_forming - CASE WHEN OLD.trx_to = 'coil_forming_sewing_forming' THEN OLD.trx_quantity ELSE 0 END,
            dyeing = dyeing - CASE WHEN OLD.trx_to = 'dyeing' THEN OLD.trx_quantity ELSE 0 END,
            elastic = elastic - CASE WHEN OLD.trx_to = 'elastic' THEN OLD.trx_quantity ELSE 0 END,
            electroplating = electroplating - CASE WHEN OLD.trx_to = 'electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            invisible = invisible - CASE WHEN OLD.trx_to = 'invisible' THEN OLD.trx_quantity ELSE 0 END,
            metal_finishing = metal_finishing - CASE WHEN OLD.trx_to = 'metal_finishing' THEN OLD.trx_quantity ELSE 0 END,
            metal = metal - CASE WHEN OLD.trx_to = 'metal' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_electroplating = metal_teeth_electroplating - CASE WHEN OLD.trx_to = 'metal_teeth_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_molding = metal_teeth_molding - CASE WHEN OLD.trx_to = 'metal_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_plating = metal_teeth_plating - CASE WHEN OLD.trx_to = 'metal_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            nylon = nylon - CASE WHEN OLD.trx_to = 'nylon' THEN OLD.trx_quantity ELSE 0 END,
            nylon_finishing = nylon_finishing - CASE WHEN OLD.trx_to = 'nylon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            nylon_gapping = nylon_gapping - CASE WHEN OLD.trx_to = 'nylon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            pigment_dye = pigment_dye - CASE WHEN OLD.trx_to = 'pigment_dye' THEN OLD.trx_quantity ELSE 0 END,
            qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical - CASE WHEN OLD.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread_finishing = sewing_thread_finishing - CASE WHEN OLD.trx_to = 'sewing_thread_finishing' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread = sewing_thread - CASE WHEN OLD.trx_to = 'sewing_thread' THEN OLD.trx_quantity ELSE 0 END,
            slider_coating_epoxy_paint = slider_coating_epoxy_paint - CASE WHEN OLD.trx_to = 'slider_coating_epoxy_paint' THEN OLD.trx_quantity ELSE 0 END,
            slider_electroplating = slider_electroplating - CASE WHEN OLD.trx_to = 'slider_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            soft_winding = soft_winding - CASE WHEN OLD.trx_to = 'soft_winding' THEN OLD.trx_quantity ELSE 0 END,
            tape_loom = tape_loom - CASE WHEN OLD.trx_to = 'tape_loom' THEN OLD.trx_quantity ELSE 0 END,
            thread_dying = thread_dying - CASE WHEN OLD.trx_to = 'thread_dying' THEN OLD.trx_quantity ELSE 0 END,
            vislon_finishing = vislon_finishing - CASE WHEN OLD.trx_to = 'vislon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            vislon_gapping = vislon_gapping - CASE WHEN OLD.trx_to = 'vislon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            vislon_injection = vislon_injection - CASE WHEN OLD.trx_to = 'vislon_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon_open_injection = vislon_open_injection - CASE WHEN OLD.trx_to = 'vislon_open_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon = vislon - CASE WHEN OLD.trx_to = 'vislon' THEN OLD.trx_quantity ELSE 0 END,
            zipper_dying = zipper_dying - CASE WHEN OLD.trx_to = 'zipper_dying' THEN OLD.trx_quantity ELSE 0 END
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
            box_pin_metal = box_pin_metal + CASE WHEN NEW.trx_to = 'box_pin_metal' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'box_pin_metal' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_dyeing = chemicals_dyeing + CASE WHEN NEW.trx_to = 'chemicals_dyeing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'chemicals_dyeing' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_coating = chemicals_coating + CASE WHEN NEW.trx_to = 'chemicals_coating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'chemicals_coating' THEN OLD.trx_quantity ELSE 0 END,
            coating_epoxy_paint_harmes = coating_epoxy_paint_harmes + CASE WHEN NEW.trx_to = 'coating_epoxy_paint_harmes' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coating_epoxy_paint_harmes' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing = coil_forming_sewing + CASE WHEN NEW.trx_to = 'coil_forming_sewing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coil_forming_sewing' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing_forming = coil_forming_sewing_forming + CASE WHEN NEW.trx_to = 'coil_forming_sewing_forming' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coil_forming_sewing_forming' THEN OLD.trx_quantity ELSE 0 END,
            dyeing = dyeing + CASE WHEN NEW.trx_to = 'dyeing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'dyeing' THEN OLD.trx_quantity ELSE 0 END,
            elastic = elastic + CASE WHEN NEW.trx_to = 'elastic' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'elastic' THEN OLD.trx_quantity ELSE 0 END,
            electroplating = electroplating + CASE WHEN NEW.trx_to = 'electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            invisible = invisible + CASE WHEN NEW.trx_to = 'invisible' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'invisible' THEN OLD.trx_quantity ELSE 0 END,
            metal_finishing = metal_finishing + CASE WHEN NEW.trx_to = 'metal_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_finishing' THEN OLD.trx_quantity ELSE 0 END,
            metal = metal + CASE WHEN NEW.trx_to = 'metal' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_electroplating = metal_teeth_electroplating + CASE WHEN NEW.trx_to = 'metal_teeth_electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_teeth_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_molding = metal_teeth_molding + CASE WHEN NEW.trx_to = 'metal_teeth_molding' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_plating = metal_teeth_plating + CASE WHEN NEW.trx_to = 'metal_teeth_plating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            nylon = nylon + CASE WHEN NEW.trx_to = 'nylon' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'nylon' THEN OLD.trx_quantity ELSE 0 END,
            nylon_finishing = nylon_finishing + CASE WHEN NEW.trx_to = 'nylon_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'nylon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            nylon_gapping = nylon_gapping + CASE WHEN NEW.trx_to = 'nylon_gapping' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'nylon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            pigment_dye = pigment_dye + CASE WHEN NEW.trx_to = 'pigment_dye' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'pigment_dye' THEN OLD.trx_quantity ELSE 0 END,
            qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical + CASE WHEN NEW.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread_finishing = sewing_thread_finishing + CASE WHEN NEW.trx_to = 'sewing_thread_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'sewing_thread_finishing' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread = sewing_thread + CASE WHEN NEW.trx_to = 'sewing_thread' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'sewing_thread' THEN OLD.trx_quantity ELSE 0 END,
            slider_coating_epoxy_paint = slider_coating_epoxy_paint + CASE WHEN NEW.trx_to = 'slider_coating_epoxy_paint' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_coating_epoxy_paint' THEN OLD.trx_quantity ELSE 0 END,
            slider_electroplating = slider_electroplating + CASE WHEN NEW.trx_to = 'slider_electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            soft_winding = soft_winding + CASE WHEN NEW.trx_to = 'soft_winding' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'soft_winding' THEN OLD.trx_quantity ELSE 0 END,
            tape_loom = tape_loom + CASE WHEN NEW.trx_to = 'tape_loom' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'tape_loom' THEN OLD.trx_quantity ELSE 0 END,
            thread_dying = thread_dying + CASE WHEN NEW.trx_to = 'thread_dying' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'thread_dying' THEN OLD.trx_quantity ELSE 0 END,
            vislon_finishing = vislon_finishing + CASE WHEN NEW.trx_to = 'vislon_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            vislon_gapping = vislon_gapping + CASE WHEN NEW.trx_to = 'vislon_gapping' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            vislon_injection = vislon_injection + CASE WHEN NEW.trx_to = 'vislon_injection' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon_open_injection = vislon_open_injection + CASE WHEN NEW.trx_to = 'vislon_open_injection' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_open_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon = vislon + CASE WHEN NEW.trx_to = 'vislon' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon' THEN OLD.trx_quantity ELSE 0 END,
            zipper_dying = zipper_dying + CASE WHEN NEW.trx_to = 'zipper_dying' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'zipper_dying' THEN OLD.trx_quantity ELSE 0 END
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
            box_pin_metal = box_pin_metal + CASE WHEN NEW.trx_to = 'box_pin_metal' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'box_pin_metal' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_dyeing = chemicals_dyeing + CASE WHEN NEW.trx_to = 'chemicals_dyeing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'chemicals_dyeing' THEN OLD.trx_quantity ELSE 0 END,
            chemicals_coating = chemicals_coating + CASE WHEN NEW.trx_to = 'chemicals_coating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'chemicals_coating' THEN OLD.trx_quantity ELSE 0 END,
            coating_epoxy_paint_harmes = coating_epoxy_paint_harmes + CASE WHEN NEW.trx_to = 'coating_epoxy_paint_harmes' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coating_epoxy_paint_harmes' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing = coil_forming_sewing + CASE WHEN NEW.trx_to = 'coil_forming_sewing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coil_forming_sewing' THEN OLD.trx_quantity ELSE 0 END,
            coil_forming_sewing_forming = coil_forming_sewing_forming + CASE WHEN NEW.trx_to = 'coil_forming_sewing_forming' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'coil_forming_sewing_forming' THEN OLD.trx_quantity ELSE 0 END,
            dyeing = dyeing + CASE WHEN NEW.trx_to = 'dyeing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'dyeing' THEN OLD.trx_quantity ELSE 0 END,
            elastic = elastic + CASE WHEN NEW.trx_to = 'elastic' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'elastic' THEN OLD.trx_quantity ELSE 0 END,
            electroplating = electroplating + CASE WHEN NEW.trx_to = 'electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_electroplating = gtz_india_pvt_ltd_electroplating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            gtz_india_pvt_ltd_teeth_plating = gtz_india_pvt_ltd_teeth_plating + CASE WHEN NEW.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'gtz_india_pvt_ltd_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            invisible = invisible + CASE WHEN NEW.trx_to = 'invisible' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'invisible' THEN OLD.trx_quantity ELSE 0 END,
            metal_finishing = metal_finishing + CASE WHEN NEW.trx_to = 'metal_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_finishing' THEN OLD.trx_quantity ELSE 0 END,
            metal = metal + CASE WHEN NEW.trx_to = 'metal' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_electroplating = metal_teeth_electroplating + CASE WHEN NEW.trx_to = 'metal_teeth_electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_teeth_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_molding = metal_teeth_molding + CASE WHEN NEW.trx_to = 'metal_teeth_molding' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
            metal_teeth_plating = metal_teeth_plating + CASE WHEN NEW.trx_to = 'metal_teeth_plating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'metal_teeth_plating' THEN OLD.trx_quantity ELSE 0 END,
            nylon = nylon + CASE WHEN NEW.trx_to = 'nylon' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'nylon' THEN OLD.trx_quantity ELSE 0 END,
            nylon_finishing = nylon_finishing + CASE WHEN NEW.trx_to = 'nylon_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'nylon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            nylon_gapping = nylon_gapping + CASE WHEN NEW.trx_to = 'nylon_gapping' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'nylon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            pigment_dye = pigment_dye + CASE WHEN NEW.trx_to = 'pigment_dye' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'pigment_dye' THEN OLD.trx_quantity ELSE 0 END,
            qlq_enterprise_bangladesh_ltd_chemical = qlq_enterprise_bangladesh_ltd_chemical + CASE WHEN NEW.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'qlq_enterprise_bangladesh_ltd_chemical' THEN OLD.trx_quantity ELSE 0 END,
            die_casting = die_casting + CASE WHEN NEW.trx_to = 'die_casting' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'die_casting' THEN OLD.trx_quantity ELSE 0 END,
            slider_assembly = slider_assembly + CASE WHEN NEW.trx_to = 'slider_assembly' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_assembly' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread_finishing = sewing_thread_finishing + CASE WHEN NEW.trx_to = 'sewing_thread_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'sewing_thread_finishing' THEN OLD.trx_quantity ELSE 0 END,
            sewing_thread = sewing_thread + CASE WHEN NEW.trx_to = 'sewing_thread' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'sewing_thread' THEN OLD.trx_quantity ELSE 0 END,
            slider_coating_epoxy_paint = slider_coating_epoxy_paint + CASE WHEN NEW.trx_to = 'slider_coating_epoxy_paint' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_coating_epoxy_paint' THEN OLD.trx_quantity ELSE 0 END,
            slider_electroplating = slider_electroplating + CASE WHEN NEW.trx_to = 'slider_electroplating' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'slider_electroplating' THEN OLD.trx_quantity ELSE 0 END,
            soft_winding = soft_winding + CASE WHEN NEW.trx_to = 'soft_winding' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'soft_winding' THEN OLD.trx_quantity ELSE 0 END,
            tape_loom = tape_loom + CASE WHEN NEW.trx_to = 'tape_loom' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'tape_loom' THEN OLD.trx_quantity ELSE 0 END,
            thread_dying = thread_dying + CASE WHEN NEW.trx_to = 'thread_dying' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'thread_dying' THEN OLD.trx_quantity ELSE 0 END,
            vislon_finishing = vislon_finishing + CASE WHEN NEW.trx_to = 'vislon_finishing' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_finishing' THEN OLD.trx_quantity ELSE 0 END,
            vislon_gapping = vislon_gapping + CASE WHEN NEW.trx_to = 'vislon_gapping' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_gapping' THEN OLD.trx_quantity ELSE 0 END,
            vislon_injection = vislon_injection + CASE WHEN NEW.trx_to = 'vislon_injection' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon_open_injection = vislon_open_injection + CASE WHEN NEW.trx_to = 'vislon_open_injection' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon_open_injection' THEN OLD.trx_quantity ELSE 0 END,
            vislon = vislon + CASE WHEN NEW.trx_to = 'vislon' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'vislon' THEN OLD.trx_quantity ELSE 0 END,
            zipper_dying = zipper_dying + CASE WHEN NEW.trx_to = 'zipper_dying' THEN NEW.trx_quantity ELSE 0 END - CASE WHEN OLD.trx_to = 'zipper_dying' THEN OLD.trx_quantity ELSE 0 END
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