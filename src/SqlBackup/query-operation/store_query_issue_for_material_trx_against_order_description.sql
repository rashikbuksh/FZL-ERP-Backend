CREATE OR REPLACE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS TRIGGER AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock 
            + OLD.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    IF (NEW.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity 
                + OLD.trx_quantity,
            trx_quantity = trx_quantity
                - OLD.trx_quantity
        WHERE uuid = NEW.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting
    IF (NEW.trx_to = 'slider_assembly') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
                - OLD.trx_quantity,
            weight = weight
                - OLD.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF (NEW.trx_to = 'tape_making' OR NEW.trx_to = 'tape_loom') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity 
                - OLD.trx_quantity
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

UPDATE zipper.material_trx_against_order_description SET trx_quantity = trx_quantity WHERE created_at < '2025-01-13 23:59:59';