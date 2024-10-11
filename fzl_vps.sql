PGDMP  ,    	            	    |            fzl_vps    16.3    16.3 �   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    277709    fzl_vps    DATABASE     �   CREATE DATABASE fzl_vps WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE fzl_vps;
                postgres    false                        2615    277710 
   commercial    SCHEMA        CREATE SCHEMA commercial;
    DROP SCHEMA commercial;
                postgres    false                        2615    277711    delivery    SCHEMA        CREATE SCHEMA delivery;
    DROP SCHEMA delivery;
                postgres    false                        2615    277712    drizzle    SCHEMA        CREATE SCHEMA drizzle;
    DROP SCHEMA drizzle;
                postgres    false                        2615    277713    hr    SCHEMA        CREATE SCHEMA hr;
    DROP SCHEMA hr;
                postgres    false            	            2615    277714    lab_dip    SCHEMA        CREATE SCHEMA lab_dip;
    DROP SCHEMA lab_dip;
                postgres    false            
            2615    277715    material    SCHEMA        CREATE SCHEMA material;
    DROP SCHEMA material;
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    15                        2615    277716    purchase    SCHEMA        CREATE SCHEMA purchase;
    DROP SCHEMA purchase;
                postgres    false                        2615    277717    slider    SCHEMA        CREATE SCHEMA slider;
    DROP SCHEMA slider;
                postgres    false                        2615    277718    thread    SCHEMA        CREATE SCHEMA thread;
    DROP SCHEMA thread;
                postgres    false                        2615    277719    zipper    SCHEMA        CREATE SCHEMA zipper;
    DROP SCHEMA zipper;
                postgres    false                       1247    277721    batch_status    TYPE     m   CREATE TYPE zipper.batch_status AS ENUM (
    'pending',
    'completed',
    'rejected',
    'cancelled'
);
    DROP TYPE zipper.batch_status;
       zipper          postgres    false    14                       1247    277730    print_in_enum    TYPE     `   CREATE TYPE zipper.print_in_enum AS ENUM (
    'portrait',
    'landscape',
    'break_down'
);
     DROP TYPE zipper.print_in_enum;
       zipper          postgres    false    14                       1247    277738    slider_starting_section_enum    TYPE     �   CREATE TYPE zipper.slider_starting_section_enum AS ENUM (
    'die_casting',
    'slider_assembly',
    'coloring',
    '---'
);
 /   DROP TYPE zipper.slider_starting_section_enum;
       zipper          postgres    false    14                       1247    277748    swatch_status_enum    TYPE     a   CREATE TYPE zipper.swatch_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);
 %   DROP TYPE zipper.swatch_status_enum;
       zipper          postgres    false    14            �           1255    277755 /   sfg_after_commercial_pi_entry_delete_function()    FUNCTION     (  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi - OLD.pi_cash_quantity
    WHERE uuid = OLD.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi - OLD.pi_cash_quantity
    WHERE uuid = OLD.thread_order_entry_uuid;

    -- UPDATE pi_cash table and remove the particular order_info_uuids from the array if there is no sfg_uuid in pi_cash_entry
    IF OLD.sfg_uuid IS NOT NULL THEN 
    UPDATE commercial.pi_cash
    SET
        order_info_uuids = COALESCE(
            (
                SELECT jsonb_agg(elem)
                FROM (
                    SELECT elem
                    FROM jsonb_array_elements_text(order_info_uuids::jsonb) elem
                    WHERE elem != (
                        SELECT DISTINCT vod.order_info_uuid::text 
                        FROM zipper.v_order_details vod 
                        WHERE vod.order_description_uuid = (
                            SELECT oe.order_description_uuid 
                            FROM zipper.order_entry oe 
                            WHERE oe.uuid = OLD.sfg_uuid
                        )
                    )
                ) subquery
            ), '[]'::jsonb
        )
    WHERE EXISTS (
        -- Check existence after the deletion is complete
        SELECT 1
        FROM zipper.sfg sfg
        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
        LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
        WHERE sfg.uuid = OLD.sfg_uuid
    );
    END IF;

    -- If the pi_cash_entry is deleted, then delete the pi_cash_entry from pi_cash table for thread
    IF OLD.thread_order_entry_uuid IS NOT NULL THEN
    UPDATE commercial.pi_cash
    SET
        thread_order_info_uuids = COALESCE(
            (
                SELECT jsonb_agg(elem)
                FROM (
                    SELECT elem
                    FROM jsonb_array_elements_text(thread_order_info_uuids::jsonb) elem
                    WHERE elem != (
                        SELECT DISTINCT toi.uuid::text 
                        FROM thread.order_info toi 
                        WHERE toi.uuid = (
                            SELECT toe.order_info_uuid 
                            FROM thread.order_entry toe 
                            WHERE toe.uuid = OLD.thread_order_entry_uuid
                        )
                    )
                ) subquery
            ), '[]'::jsonb
        )
    WHERE EXISTS (
        -- Check existence after the deletion is complete
        SELECT 1
        FROM thread.order_entry toe
        LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
        WHERE toe.uuid = OLD.thread_order_entry_uuid
    );
    END IF;

    RETURN OLD;
END;
$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
    
   commercial          postgres    false    5            �           1255    277756 /   sfg_after_commercial_pi_entry_insert_function()    FUNCTION     r  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_cash_quantity
    WHERE uuid = NEW.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi + NEW.pi_cash_quantity
    WHERE uuid = NEW.thread_order_entry_uuid;

    RETURN NEW;
END;
$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();
    
   commercial          postgres    false    5            h           1255    277757 /   sfg_after_commercial_pi_entry_update_function()    FUNCTION     �  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_cash_quantity - OLD.pi_cash_quantity
    WHERE uuid = NEW.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi + NEW.pi_cash_quantity - OLD.pi_cash_quantity
    WHERE uuid = NEW.thread_order_entry_uuid;

    RETURN NEW;
END;
$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();
    
   commercial          postgres    false    5            �           1255    277758 2   packing_list_after_challan_entry_delete_function()    FUNCTION     +  CREATE FUNCTION delivery.packing_list_after_challan_entry_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update delivery,packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NULL
    WHERE uuid = OLD.packing_list_uuid;
    RETURN OLD;
END;
$$;
 K   DROP FUNCTION delivery.packing_list_after_challan_entry_delete_function();
       delivery          postgres    false    6            �           1255    277759 2   packing_list_after_challan_entry_insert_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update delivery,packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NEW.challan_uuid
    WHERE uuid = NEW.packing_list_uuid;
    RETURN NEW;
END;
$$;
 K   DROP FUNCTION delivery.packing_list_after_challan_entry_insert_function();
       delivery          postgres    false    6            N           1255    277760 2   packing_list_after_challan_entry_update_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update delivery,packing_list
    UPDATE delivery.packing_list
    SET
        challan_uuid = NEW.challan_uuid
    WHERE uuid = NEW.packing_list_uuid;
    RETURN NEW;
END;
$$;
 K   DROP FUNCTION delivery.packing_list_after_challan_entry_update_function();
       delivery          postgres    false    6            �           1255    277761 2   sfg_after_challan_receive_status_delete_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity FROM delivery.packing_list LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid WHERE packing_list.challan_uuid = OLD.uuid) as pl_sfg
    WHERE uuid = pl_sfg.sfg_uuid;
    RETURN OLD;
END;
$$;
 K   DROP FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
       delivery          postgres    false    6            s           1255    277762 2   sfg_after_challan_receive_status_insert_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity FROM delivery.packing_list LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid WHERE packing_list.challan_uuid = NEW.uuid) as pl_sfg
    WHERE uuid = pl_sfg.sfg_uuid;
    RETURN NEW;
END;
$$;
 K   DROP FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
       delivery          postgres    false    6            x           1255    277763 2   sfg_after_challan_receive_status_update_function()    FUNCTION     9  CREATE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
    FROM (SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity FROM delivery.packing_list LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid WHERE packing_list.challan_uuid = NEW.uuid) as pl_sfg
    WHERE uuid = pl_sfg.sfg_uuid;
    RETURN NEW;
END;
$$;
 K   DROP FUNCTION delivery.sfg_after_challan_receive_status_update_function();
       delivery          postgres    false    6            I           1255    277764 .   sfg_after_packing_list_entry_delete_function()    FUNCTION     Q  CREATE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - OLD.quantity,
        finishing_prod = finishing_prod + OLD.quantity
    WHERE uuid = OLD.sfg_uuid;
    RETURN OLD;
END;
$$;
 G   DROP FUNCTION delivery.sfg_after_packing_list_entry_delete_function();
       delivery          postgres    false    6            �           1255    277765 .   sfg_after_packing_list_entry_insert_function()    FUNCTION     Q  CREATE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + NEW.quantity,
        finishing_prod = finishing_prod - NEW.quantity
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$;
 G   DROP FUNCTION delivery.sfg_after_packing_list_entry_insert_function();
       delivery          postgres    false    6            i           1255    277766 .   sfg_after_packing_list_entry_update_function()    FUNCTION     o  CREATE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - OLD.quantity + NEW.quantity,
        finishing_prod = finishing_prod + OLD.quantity - NEW.quantity
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$;
 G   DROP FUNCTION delivery.sfg_after_packing_list_entry_update_function();
       delivery          postgres    false    6            `           1255    277767 +   material_stock_after_material_info_delete()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 D   DROP FUNCTION material.material_stock_after_material_info_delete();
       material          postgres    false    10            G           1255    277768 +   material_stock_after_material_info_insert()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO material.stock
       (uuid, material_uuid)
    VALUES
         (NEW.uuid, NEW.uuid);
    RETURN NEW;
END;
$$;
 D   DROP FUNCTION material.material_stock_after_material_info_insert();
       material          postgres    false    10            S           1255    277769 *   material_stock_after_material_trx_delete()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
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
    RETURN OLD;
END;
$$;
 C   DROP FUNCTION material.material_stock_after_material_trx_delete();
       material          postgres    false    10            �           1255    277770 *   material_stock_after_material_trx_insert()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
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
    RETURN NEW;
END;
$$;
 C   DROP FUNCTION material.material_stock_after_material_trx_insert();
       material          postgres    false    10            F           1255    277771 *   material_stock_after_material_trx_update()    FUNCTION     C  CREATE FUNCTION material.material_stock_after_material_trx_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
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
    RETURN NEW;
END;
$$;
 C   DROP FUNCTION material.material_stock_after_material_trx_update();
       material          postgres    false    10            l           1255    277772 +   material_stock_after_material_used_delete()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 D   DROP FUNCTION material.material_stock_after_material_used_delete();
       material          postgres    false    10            �           1255    277773 +   material_stock_after_material_used_insert()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 D   DROP FUNCTION material.material_stock_after_material_used_insert();
       material          postgres    false    10            �           1255    277774 +   material_stock_after_material_used_update()    FUNCTION     L  CREATE FUNCTION material.material_stock_after_material_used_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 D   DROP FUNCTION material.material_stock_after_material_used_update();
       material          postgres    false    10            m           1255    277775 ,   material_stock_after_purchase_entry_delete()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock
        SET 
            stock = stock - OLD.quantity
    WHERE material_uuid = OLD.material_uuid;
    RETURN OLD;
END;

$$;
 E   DROP FUNCTION material.material_stock_after_purchase_entry_delete();
       material          postgres    false    10            �           1255    277776 ,   material_stock_after_purchase_entry_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock
        SET 
            stock = stock + NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$;
 E   DROP FUNCTION material.material_stock_after_purchase_entry_insert();
       material          postgres    false    10            p           1255    277777 ,   material_stock_after_purchase_entry_update()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

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

$$;
 E   DROP FUNCTION material.material_stock_after_purchase_entry_update();
       material          postgres    false    10            �           1255    277778 .   material_stock_sfg_after_stock_to_sfg_delete()    FUNCTION     4  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 G   DROP FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();
       material          postgres    false    10            �           1255    277779 .   material_stock_sfg_after_stock_to_sfg_insert()    FUNCTION     =  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 G   DROP FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();
       material          postgres    false    10            W           1255    277780 .   material_stock_sfg_after_stock_to_sfg_update()    FUNCTION       CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 G   DROP FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();
       material          postgres    false    10            �           1255    277781 >   thread_batch_entry_after_batch_entry_production_delete_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity - OLD.production_quantity,
        coning_carton_quantity = coning_carton_quantity - OLD.coning_carton_quantity
    WHERE uuid = OLD.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = production_quantity - OLD.production_quantity
        -- production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);

    RETURN OLD;
END;

$$;
 U   DROP FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct();
       public          postgres    false    15            b           1255    277782 >   thread_batch_entry_after_batch_entry_production_insert_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity + NEW.production_quantity,
        coning_carton_quantity = coning_carton_quantity + NEW.coning_carton_quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = production_quantity + NEW.production_quantity
        -- production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$;
 U   DROP FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct();
       public          postgres    false    15            f           1255    277783 >   thread_batch_entry_after_batch_entry_production_update_funct()    FUNCTION     P  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity - OLD.production_quantity + NEW.production_quantity,
        coning_carton_quantity = coning_carton_quantity - OLD.coning_carton_quantity + NEW.coning_carton_quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = production_quantity - OLD.production_quantity + NEW.production_quantity
        -- production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg + NEW.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$;
 U   DROP FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct();
       public          postgres    false    15            �           1255    277784 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_delete()    FUNCTION        CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity - OLD.quantity,
        coning_production_quantity = coning_production_quantity + OLD.quantity,
        transfer_carton_quantity = transfer_carton_quantity - OLD.carton_quantity,
        coning_carton_quantity = coning_carton_quantity + OLD.carton_quantity
    WHERE uuid = OLD.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse - OLD.quantity,
        carton_quantity = carton_quantity - OLD.carton_quantity
    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);
    RETURN OLD;
END;

$$;
 X   DROP FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
       public          postgres    false    15            X           1255    277785 @   thread_batch_entry_and_order_entry_after_batch_entry_trx_funct()    FUNCTION       CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity + NEW.quantity,
        coning_production_quantity = coning_production_quantity - NEW.quantity,
        transfer_carton_quantity = transfer_carton_quantity + NEW.carton_quantity,
        coning_carton_quantity = coning_carton_quantity - NEW.carton_quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse + NEW.quantity,
        carton_quantity = carton_quantity + NEW.carton_quantity
    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    RETURN NEW;
END;

$$;
 W   DROP FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
       public          postgres    false    15            �           1255    277786 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_update()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity - OLD.quantity + NEW.quantity,
        coning_production_quantity = coning_production_quantity + OLD.quantity - NEW.quantity,
        transfer_carton_quantity = transfer_carton_quantity - OLD.carton_quantity + NEW.carton_quantity,
        coning_carton_quantity = coning_carton_quantity + OLD.carton_quantity - NEW.carton_quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse - OLD.quantity + NEW.quantity,
        carton_quantity = carton_quantity - OLD.carton_quantity + NEW.carton_quantity
    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    RETURN NEW;
END;

$$;
 X   DROP FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
       public          postgres    false    15            �           1255    279795 -   thread_order_entry_after_batch_entry_delete()    FUNCTION     ;  CREATE FUNCTION public.thread_order_entry_after_batch_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE thread.order_entry
        SET
            production_quantity = production_quantity - OLD.coning_production_quantity
        WHERE
            uuid = OLD.order_entry_uuid;
    END;
$$;
 D   DROP FUNCTION public.thread_order_entry_after_batch_entry_delete();
       public          postgres    false    15            O           1255    279793 -   thread_order_entry_after_batch_entry_insert()    FUNCTION     B  CREATE FUNCTION public.thread_order_entry_after_batch_entry_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE thread.order_entry
      
        SET
            production_quantity = production_quantity + NEW.coning_production_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$;
 D   DROP FUNCTION public.thread_order_entry_after_batch_entry_insert();
       public          postgres    false    15            d           1255    279801 ?   thread_order_entry_after_batch_entry_transfer_quantity_delete()    FUNCTION     @  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE thread.order_entry
        SET
            transfer_quantity = transfer_quantity - OLD.transfer_quantity
        WHERE
            uuid = OLD.order_entry_uuid;
    END;
$$;
 V   DROP FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_delete();
       public          postgres    false    15            �           1255    279799 ?   thread_order_entry_after_batch_entry_transfer_quantity_insert()    FUNCTION     @  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE thread.order_entry
        SET
            transfer_quantity = transfer_quantity + NEW.transfer_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$;
 V   DROP FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_insert();
       public          postgres    false    15            �           1255    279800 ?   thread_order_entry_after_batch_entry_transfer_quantity_update()    FUNCTION     X  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE thread.order_entry
        SET
            transfer_quantity = transfer_quantity + NEW.transfer_quantity - OLD.transfer_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$;
 V   DROP FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_update();
       public          postgres    false    15            j           1255    279794 -   thread_order_entry_after_batch_entry_update()    FUNCTION     \  CREATE FUNCTION public.thread_order_entry_after_batch_entry_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE thread.order_entry
        SET
            production_quantity = production_quantity + NEW.coning_production_quantity - OLD.coning_production_quantity
        WHERE
            uuid = NEW.order_entry_uuid;
    END;
$$;
 D   DROP FUNCTION public.thread_order_entry_after_batch_entry_update();
       public          postgres    false    15            E           1255    277787 2   zipper_batch_entry_after_batch_production_delete()    FUNCTION     F  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE zipper.batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.batch_entry_uuid;
    
    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod - OLD.production_quantity_in_kg
        FROM zipper.batch_entry
    WHERE
         zipper.sfg.uuid = batch_entry.sfg_uuid AND batch_entry.uuid = OLD.batch_entry_uuid;
    RETURN OLD;
END;

$$;
 I   DROP FUNCTION public.zipper_batch_entry_after_batch_production_delete();
       public          postgres    false    15                       1255    277788 2   zipper_batch_entry_after_batch_production_insert()    FUNCTION     R  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE zipper.batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.batch_entry_uuid;

    UPDATE zipper.sfg
        SET
            dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity_in_kg
        FROM zipper.batch_entry
        WHERE
            zipper.sfg.uuid = batch_entry.sfg_uuid AND batch_entry.uuid = NEW.batch_entry_uuid;
    RETURN NEW;

END;

$$;
 I   DROP FUNCTION public.zipper_batch_entry_after_batch_production_insert();
       public          postgres    false    15            Z           1255    277789 2   zipper_batch_entry_after_batch_production_update()    FUNCTION     �  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE zipper.batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = NEW.batch_entry_uuid;

    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
        FROM zipper.batch_entry
    WHERE
         zipper.sfg.uuid = batch_entry.sfg_uuid AND batch_entry.uuid = NEW.batch_entry_uuid;
    RETURN NEW;

RETURN NEW;
      
END;

$$;
 I   DROP FUNCTION public.zipper_batch_entry_after_batch_production_update();
       public          postgres    false    15            �           1255    277790 %   zipper_sfg_after_batch_entry_delete()    FUNCTION     #  CREATE FUNCTION public.zipper_sfg_after_batch_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
  UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.sfg_uuid;

    RETURN OLD;
END;

$$;
 <   DROP FUNCTION public.zipper_sfg_after_batch_entry_delete();
       public          postgres    false    15            �           1255    277791 %   zipper_sfg_after_batch_entry_insert()    FUNCTION     %  CREATE FUNCTION public.zipper_sfg_after_batch_entry_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.sfg_uuid;
    
    RETURN NEW;
END;
$$;
 <   DROP FUNCTION public.zipper_sfg_after_batch_entry_insert();
       public          postgres    false    15            �           1255    277792 %   zipper_sfg_after_batch_entry_update()    FUNCTION     E  CREATE FUNCTION public.zipper_sfg_after_batch_entry_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = NEW.sfg_uuid;

    RETURN NEW;	
END;



$$;
 <   DROP FUNCTION public.zipper_sfg_after_batch_entry_update();
       public          postgres    false    15            V           1255    277793 A   assembly_stock_after_die_casting_to_assembly_stock_delete_funct()    FUNCTION     1  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity - OLD.production_quantity,
        weight = weight - OLD.weight
    WHERE uuid = OLD.assembly_stock_uuid;

    -- die casting body
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_body_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    -- die casting cap
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_cap_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    -- die casting puller
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_puller_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    -- die casting link
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity + OLD.wastage ELSE 0 END
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid;

    RETURN OLD;
END;
$$;
 X   DROP FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
       slider          postgres    false    12            r           1255    277794 A   assembly_stock_after_die_casting_to_assembly_stock_insert_funct()    FUNCTION     <  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity + NEW.production_quantity,
        weight = weight + NEW.weight
    WHERE uuid = NEW.assembly_stock_uuid;

    -- die casting body 
    UPDATE slider.die_casting 
    SET 
        quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_body_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting cap
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_cap_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting puller
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_puller_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting link
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity - NEW.wastage ELSE 0 END
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
       slider          postgres    false    12            a           1255    277795 A   assembly_stock_after_die_casting_to_assembly_stock_update_funct()    FUNCTION     U  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity 
            + NEW.production_quantity
            - OLD.production_quantity,
        weight = weight
            + NEW.weight
            - OLD.weight
    WHERE uuid = NEW.assembly_stock_uuid;

    -- die casting body
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_body_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting cap
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_cap_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting puller
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_puller_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    -- die casting link
    UPDATE slider.die_casting
    SET quantity_in_sa = quantity_in_sa - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity + NEW.wastage ELSE 0 END + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity + OLD.wastage ELSE 0 END
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
       slider          postgres    false    12            �           1255    277796 8   slider_die_casting_after_die_casting_production_delete()    FUNCTION     |  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
--update slider.die_casting table
    UPDATE slider.die_casting
        SET 
        quantity = quantity - (OLD.cavity_goods * OLD.push),
        weight = weight - OLD.weight
        WHERE uuid = OLD.die_casting_uuid;
    RETURN OLD;
    END;
$$;
 O   DROP FUNCTION slider.slider_die_casting_after_die_casting_production_delete();
       slider          postgres    false    12            g           1255    277797 8   slider_die_casting_after_die_casting_production_insert()    FUNCTION     }  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN 
--update slider.die_casting table
    UPDATE slider.die_casting
        SET 
        quantity = quantity + (NEW.cavity_goods * NEW.push),
        weight = weight + NEW.weight
        WHERE uuid = NEW.die_casting_uuid;
    RETURN NEW;
    END;
$$;
 O   DROP FUNCTION slider.slider_die_casting_after_die_casting_production_insert();
       slider          postgres    false    12            L           1255    277798 8   slider_die_casting_after_die_casting_production_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

--update slider.die_casting table

    UPDATE slider.die_casting
        SET 
        quantity = quantity + (NEW.cavity_goods * NEW.push) - (OLD.cavity_goods * OLD.push),
        weight = weight + NEW.weight - OLD.weight
        WHERE uuid = NEW.die_casting_uuid;
    RETURN NEW;
    END;

$$;
 O   DROP FUNCTION slider.slider_die_casting_after_die_casting_production_update();
       slider          postgres    false    12            u           1255    277799 3   slider_die_casting_after_trx_against_stock_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
--update slider.die_casting table
    UPDATE slider.die_casting
        SET 
        quantity_in_sa = quantity_in_sa - OLD.quantity,
        quantity = quantity + OLD.quantity,
        weight = weight + OLD.weight
        WHERE uuid = OLD.die_casting_uuid;
    RETURN OLD;
    END;
$$;
 J   DROP FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();
       slider          postgres    false    12            k           1255    277800 3   slider_die_casting_after_trx_against_stock_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
--update slider.die_casting table
    UPDATE slider.die_casting
        SET 
        quantity_in_sa = quantity_in_sa + NEW.quantity,
        quantity = quantity - NEW.quantity,
        weight = weight - NEW.weight
        WHERE uuid = NEW.die_casting_uuid;

    RETURN NEW;
END;
$$;
 J   DROP FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();
       slider          postgres    false    12            y           1255    277801 3   slider_die_casting_after_trx_against_stock_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
--update slider.die_casting table
    UPDATE slider.die_casting
        SET 

        quantity_in_sa = quantity_in_sa + NEW.quantity - OLD.quantity,
        quantity = quantity - NEW.quantity + OLD.quantity,
        weight = weight - NEW.weight + OLD.weight
        WHERE uuid = NEW.die_casting_uuid;

    RETURN NEW;
END;
$$;
 J   DROP FUNCTION slider.slider_die_casting_after_trx_against_stock_update();
       slider          postgres    false    12            H           1255    277802 0   slider_stock_after_coloring_transaction_delete()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = CASE WHEN uuid = OLD.stock_uuid THEN sa_prod + OLD.trx_quantity ELSE sa_prod END,
        coloring_stock = CASE WHEN order_info_uuid = OLD.order_info_uuid THEN coloring_stock - OLD.trx_quantity ELSE coloring_stock END

    WHERE uuid = OLD.stock_uuid OR order_info_uuid = OLD.order_info_uuid;

    RETURN OLD;
END;

$$;
 G   DROP FUNCTION slider.slider_stock_after_coloring_transaction_delete();
       slider          postgres    false    12            �           1255    277803 0   slider_stock_after_coloring_transaction_insert()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = CASE WHEN uuid = NEW.stock_uuid THEN sa_prod - NEW.trx_quantity ELSE sa_prod END,
        coloring_stock = CASE WHEN order_info_uuid = NEW.order_info_uuid THEN coloring_stock + NEW.trx_quantity ELSE coloring_stock END

    WHERE uuid = NEW.stock_uuid OR order_info_uuid = NEW.order_info_uuid;

    RETURN NEW;
END;
$$;
 G   DROP FUNCTION slider.slider_stock_after_coloring_transaction_insert();
       slider          postgres    false    12            c           1255    277804 0   slider_stock_after_coloring_transaction_update()    FUNCTION     7  CREATE FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    -- Update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = CASE WHEN uuid = NEW.stock_uuid THEN sa_prod - NEW.trx_quantity + OLD.trx_quantity ELSE sa_prod END,
        coloring_stock = CASE WHEN order_info_uuid = NEW.order_info_uuid THEN coloring_stock + NEW.trx_quantity - OLD.trx_quantity ELSE coloring_stock END

    WHERE uuid = NEW.stock_uuid OR order_info_uuid = NEW.order_info_uuid;

    RETURN NEW;
END;

$$;
 G   DROP FUNCTION slider.slider_stock_after_coloring_transaction_update();
       slider          postgres    false    12            w           1255    277805 3   slider_stock_after_die_casting_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
 UPDATE slider.die_casting
    SET
        quantity = quantity + OLD.trx_quantity,
        weight = weight + OLD.weight
    WHERE uuid = OLD.die_casting_uuid;

    --update slider.stock table
    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            - CASE WHEN dc.type = 'body' THEN OLD.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            - CASE WHEN dc.type = 'puller' THEN OLD.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            - CASE WHEN dc.type = 'cap' THEN OLD.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            - CASE WHEN dc.type = 'link' THEN OLD.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            - CASE WHEN dc.type = 'h_bottom' THEN OLD.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            - CASE WHEN dc.type = 'u_top' THEN OLD.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            - CASE WHEN dc.type = 'box_pin' THEN OLD.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            - CASE WHEN dc.type = 'two_way_pin' THEN OLD.trx_quantity ELSE 0 END
    FROM slider.die_casting dc
    WHERE stock.uuid = NEW.stock_uuid AND dc.uuid = NEW.die_casting_uuid;


RETURN OLD;
END;

$$;
 J   DROP FUNCTION slider.slider_stock_after_die_casting_transaction_delete();
       slider          postgres    false    12            _           1255    277806 3   slider_stock_after_die_casting_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.die_casting
    SET
        quantity = quantity - NEW.trx_quantity,
        weight = weight - NEW.weight
    WHERE uuid = NEW.die_casting_uuid;

    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            + CASE WHEN dc.type = 'body' THEN NEW.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            + CASE WHEN dc.type = 'puller' THEN NEW.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            + CASE WHEN dc.type = 'cap' THEN NEW.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            + CASE WHEN dc.type = 'link' THEN NEW.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            + CASE WHEN dc.type = 'h_bottom' THEN NEW.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            + CASE WHEN dc.type = 'u_top' THEN NEW.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            + CASE WHEN dc.type = 'box_pin' THEN NEW.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            + CASE WHEN dc.type = 'two_way_pin' THEN NEW.trx_quantity ELSE 0 END
    FROM slider.die_casting dc
    WHERE stock.uuid = NEW.stock_uuid AND dc.uuid = NEW.die_casting_uuid;

RETURN NEW;
END;
$$;
 J   DROP FUNCTION slider.slider_stock_after_die_casting_transaction_insert();
       slider          postgres    false    12            ~           1255    277807 3   slider_stock_after_die_casting_transaction_update()    FUNCTION     *  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.die_casting
    SET
        quantity = quantity - NEW.trx_quantity + OLD.trx_quantity,
        weight = weight - NEW.weight + OLD.weight
    WHERE uuid = NEW.die_casting_uuid;

    UPDATE slider.stock
    SET
        body_quantity = body_quantity 
            + CASE WHEN dc.type = 'body' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'body' THEN OLD.trx_quantity ELSE 0 END,
        puller_quantity = puller_quantity 
            + CASE WHEN dc.type = 'puller' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'puller' THEN OLD.trx_quantity ELSE 0 END,
        cap_quantity = cap_quantity 
            + CASE WHEN dc.type = 'cap' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'cap' THEN OLD.trx_quantity ELSE 0 END,
        link_quantity = link_quantity 
            + CASE WHEN dc.type = 'link' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'link' THEN OLD.trx_quantity ELSE 0 END,
        h_bottom_quantity = h_bottom_quantity 
            + CASE WHEN dc.type = 'h_bottom' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'h_bottom' THEN OLD.trx_quantity ELSE 0 END,
        u_top_quantity = u_top_quantity 
            + CASE WHEN dc.type = 'u_top' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'u_top' THEN OLD.trx_quantity ELSE 0 END,
        box_pin_quantity = box_pin_quantity 
            + CASE WHEN dc.type = 'box_pin' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'box_pin' THEN OLD.trx_quantity ELSE 0 END,
        two_way_pin_quantity = two_way_pin_quantity 
            + CASE WHEN dc.type = 'two_way_pin' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN dc.type = 'two_way_pin' THEN OLD.trx_quantity ELSE 0 END
    FROM slider.die_casting dc
    WHERE stock.uuid = NEW.stock_uuid AND dc.uuid = NEW.die_casting_uuid;

RETURN NEW;
END;

$$;
 J   DROP FUNCTION slider.slider_stock_after_die_casting_transaction_update();
       slider          postgres    false    12            �           1255    277808 -   slider_stock_after_slider_production_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_slider_production_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   
    -- Update slider.stock table for 'sa_prod' section
    IF OLD.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod - OLD.production_quantity,
            body_quantity =  body_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity + OLD.production_quantity,
            link_quantity = link_quantity + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity ELSE 0 END
        FROM zipper.v_order_details_full vodf
        WHERE vodf.order_description_uuid = stock.order_description_uuid AND stock.uuid = OLD.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF OLD.section = 'coloring' THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + OLD.production_quantity,
            link_quantity = link_quantity + OLD.production_quantity,
            box_pin_quantity = box_pin_quantity + CASE WHEN lower(vodf.end_type_name) = 'open end' THEN OLD.production_quantity ELSE 0 END,
            h_bottom_quantity = h_bottom_quantity + CASE WHEN lower(vodf.end_type_name) = 'close end' THEN OLD.production_quantity ELSE 0 END,
            u_top_quantity = u_top_quantity + (2 * OLD.production_quantity),
            coloring_prod = coloring_prod - OLD.production_quantity
        FROM zipper.v_order_details_full vodf
        WHERE vodf.order_description_uuid = stock.order_description_uuid AND stock.uuid = OLD.stock_uuid;
    END IF;

    RETURN OLD;
END;
$$;
 D   DROP FUNCTION slider.slider_stock_after_slider_production_delete();
       slider          postgres    false    12            �           1255    277809 -   slider_stock_after_slider_production_insert()    FUNCTION     o  CREATE FUNCTION slider.slider_stock_after_slider_production_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.stock table for 'sa_prod' section
   
      IF NEW.section = 'sa_prod' THEN
            UPDATE slider.stock
            SET
                sa_prod = sa_prod + NEW.production_quantity,
                body_quantity =  body_quantity - NEW.production_quantity,
                cap_quantity = cap_quantity - NEW.production_quantity,
                puller_quantity = puller_quantity - NEW.production_quantity,
                link_quantity = link_quantity - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity ELSE 0 END
            WHERE stock.uuid = NEW.stock_uuid;
    END IF;

-- Update slider.stock table for 'coloring' section

    IF NEW.section = 'coloring' THEN

        UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity,
                link_quantity = link_quantity - NEW.production_quantity,
                box_pin_quantity = box_pin_quantity - CASE WHEN lower(vodf.end_type_name) = 'open end' THEN NEW.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity - CASE WHEN lower(vodf.end_type_name) = 'close end' THEN NEW.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity - (2 * NEW.production_quantity),
                coloring_prod = coloring_prod + NEW.production_quantity
            FROM zipper.v_order_details_full vodf
        WHERE vodf.order_description_uuid = stock.order_description_uuid AND stock.uuid = NEW.stock_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 D   DROP FUNCTION slider.slider_stock_after_slider_production_insert();
       slider          postgres    false    12            |           1255    277810 -   slider_stock_after_slider_production_update()    FUNCTION     {  CREATE FUNCTION slider.slider_stock_after_slider_production_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.stock table for 'sa_prod' section
    IF NEW.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod + NEW.production_quantity - OLD.production_quantity,
            body_quantity =  body_quantity - NEW.production_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity - NEW.production_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity - NEW.production_quantity + OLD.production_quantity,
            link_quantity = link_quantity - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity ELSE 0 END + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity ELSE 0 END
        WHERE stock.uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF NEW.section = 'coloring' THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock - NEW.production_quantity + OLD.production_quantity,
            link_quantity = link_quantity - NEW.production_quantity + OLD.production_quantity,
            box_pin_quantity = box_pin_quantity - CASE WHEN lower(vodf.end_type_name) = 'open end' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END,
            h_bottom_quantity = h_bottom_quantity - CASE WHEN lower(vodf.end_type_name) = 'close end' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END,
            u_top_quantity = u_top_quantity - (2 * (NEW.production_quantity - OLD.production_quantity)),
            coloring_prod = coloring_prod + NEW.production_quantity - OLD.production_quantity
            FROM zipper.v_order_details_full vodf
        WHERE vodf.order_description_uuid = stock.order_description_uuid AND stock.uuid = NEW.stock_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 D   DROP FUNCTION slider.slider_stock_after_slider_production_update();
       slider          postgres    false    12            �           1255    277811 '   slider_stock_after_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock = coloring_stock + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
    WHERE uuid = OLD.stock_uuid;

    IF OLD.from_section = 'coloring_prod' AND OLD.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
        coloring_prod = coloring_prod + OLD.trx_quantity,
        trx_to_finishing = trx_to_finishing - OLD.trx_quantity
        WHERE uuid = OLD.stock_uuid;

        UPDATE zipper.order_description
        SET
        slider_finishing_stock = slider_finishing_stock - OLD.trx_quantity
        WHERE uuid = (SELECT order_description_uuid FROM slider.stock WHERE uuid = OLD.stock_uuid);
        
    END IF;

    IF OLD.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        WHERE uuid = OLD.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.trx_quantity ELSE 0 END,
            weight = weight + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.weight ELSE 0 END
        WHERE uuid = OLD.assembly_stock_uuid;
    END IF;

    RETURN OLD;
END;
$$;
 >   DROP FUNCTION slider.slider_stock_after_transaction_delete();
       slider          postgres    false    12            �           1255    277812 '   slider_stock_after_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END,
        coloring_stock = coloring_stock - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
    WHERE uuid = NEW.stock_uuid;

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
        coloring_prod = coloring_prod - NEW.trx_quantity,
        trx_to_finishing = trx_to_finishing + NEW.trx_quantity
        WHERE uuid = NEW.stock_uuid;

        UPDATE zipper.order_description
        SET
        slider_finishing_stock = slider_finishing_stock + NEW.trx_quantity
        WHERE uuid = (SELECT order_description_uuid FROM slider.stock WHERE uuid = NEW.stock_uuid);
    END IF;

    IF NEW.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        WHERE uuid = NEW.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.trx_quantity ELSE 0 END,
            weight = weight - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.weight ELSE 0 END
        WHERE uuid = NEW.assembly_stock_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 >   DROP FUNCTION slider.slider_stock_after_transaction_insert();
       slider          postgres    false    12            �           1255    277813 '   slider_stock_after_transaction_update()    FUNCTION     `  CREATE FUNCTION slider.slider_stock_after_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --update slider.stock table
    UPDATE slider.stock
    SET
        
        sa_prod = sa_prod 
        - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock = coloring_stock 
        - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
    WHERE uuid = NEW.stock_uuid;

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
        coloring_prod = coloring_prod - NEW.trx_quantity + OLD.trx_quantity,
        trx_to_finishing = trx_to_finishing + NEW.trx_quantity - OLD.trx_quantity
        WHERE uuid = NEW.stock_uuid;

        UPDATE zipper.order_description
        SET
        slider_finishing_stock = slider_finishing_stock + NEW.trx_quantity - OLD.trx_quantity
        WHERE uuid = (SELECT order_description_uuid FROM slider.stock WHERE uuid = NEW.stock_uuid);
        
    END IF;

    -- assembly_stock_uuid -> OLD
    IF OLD.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock 
            - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        WHERE uuid = OLD.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
            + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.trx_quantity ELSE 0 END,
            weight = weight
            + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.weight ELSE 0 END
        WHERE uuid = OLD.assembly_stock_uuid;
    END IF;

    -- assembly_stock_uuid -> NEW
    IF NEW.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        WHERE uuid = NEW.stock_uuid;

        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
            - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.trx_quantity ELSE 0 END,
            weight = weight
            - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.weight ELSE 0 END
        WHERE uuid = NEW.assembly_stock_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 >   DROP FUNCTION slider.slider_stock_after_transaction_update();
       slider          postgres    false    12            M           1255    277814 *   order_entry_after_batch_is_drying_update()    FUNCTION     �  CREATE FUNCTION thread.order_entry_after_batch_is_drying_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Handle insert when is_drying_complete is true

    IF TG_OP = 'UPDATE' AND NEW.is_drying_complete = '1' THEN
        -- Update order_entry table
        UPDATE thread.order_entry
        SET production_quantity = production_quantity + NEW.quantity
        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE batch_uuid = NEW.uuid);

        -- Update batch_entry table
        UPDATE thread.batch_entry
        SET quantity = quantity - NEW.quantity
        WHERE batch_uuid = NEW.uuid;

    -- Handle remove when is_drying_complete changes from true to false

    ELSIF TG_OP = 'UPDATE' AND OLD.is_drying_complete = '1' AND NEW.is_drying_complete = '0' THEN
        -- Update order_entry table
        UPDATE thread.order_entry
        SET production_quantity = production_quantity - OLD.quantity
        WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE batch_uuid = NEW.uuid);

        -- Update batch_entry table
        UPDATE thread.batch_entry
        SET quantity = quantity + OLD.quantity
        WHERE batch_uuid = NEW.uuid;
    END IF;

    RETURN NEW;
END;
$$;
 A   DROP FUNCTION thread.order_entry_after_batch_is_drying_update();
       thread          postgres    false    13            t           1255    277815 *   order_entry_after_batch_is_dyeing_update()    FUNCTION       CREATE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    RAISE NOTICE 'Trigger executing for batch UUID: %', NEW.uuid;

    -- Update order_entry
    UPDATE thread.order_entry oe
    SET 
        production_quantity = production_quantity 
        + CASE WHEN (NEW.is_drying_complete = 'true' AND OLD.is_drying_complete = 'false') THEN be.quantity ELSE 0 END 
        - CASE WHEN (NEW.is_drying_complete = 'false' AND OLD.is_drying_complete = 'true') THEN be.quantity ELSE 0 END
    FROM thread.batch_entry be
    LEFT JOIN thread.batch b ON be.batch_uuid = b.uuid
    WHERE b.uuid = NEW.uuid AND oe.uuid = be.order_entry_uuid;
    RAISE NOTICE 'Trigger executed for batch UUID: %', NEW.uuid;
    RETURN NEW;
END;
$$;
 A   DROP FUNCTION thread.order_entry_after_batch_is_dyeing_update();
       thread          postgres    false    13            D           1255    277816 6   order_description_after_dyed_tape_transaction_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + OLD.trx_quantity,
        tape_transferred = tape_transferred - OLD.trx_quantity
    WHERE order_description.uuid = OLD.order_description_uuid;

    RETURN OLD;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
       zipper          postgres    false    14            \           1255    277817 6   order_description_after_dyed_tape_transaction_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received - NEW.trx_quantity,
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
       zipper          postgres    false    14            o           1255    277818 6   order_description_after_dyed_tape_transaction_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + OLD.trx_quantity - NEW.trx_quantity,
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
       zipper          postgres    false    14            Q           1255    277819 4   order_description_after_tape_coil_to_dyeing_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.tape_coil
        SET
            quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil + OLD.trx_quantity ELSE quantity_in_coil END,
            quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity + OLD.trx_quantity END
        FROM public.properties
        WHERE tape_coil.uuid = OLD.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;

        UPDATE zipper.order_description
        SET
            tape_received = tape_received - OLD.trx_quantity
        WHERE uuid = OLD.order_description_uuid;

        RETURN OLD;
    END;
$$;
 K   DROP FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();
       zipper          postgres    false    14            z           1255    277820 4   order_description_after_tape_coil_to_dyeing_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

    UPDATE zipper.tape_coil
    SET
        quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil - NEW.trx_quantity ELSE quantity_in_coil END,
        quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity - NEW.trx_quantity END
    FROM public.properties
    WHERE tape_coil.uuid = NEW.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;
    
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;
$$;
 K   DROP FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
       zipper          postgres    false    14            �           1255    277821 4   order_description_after_tape_coil_to_dyeing_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.tape_coil
    SET
        quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil + OLD.trx_quantity - NEW.trx_quantity ELSE quantity_in_coil END,
        quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity + OLD.trx_quantity - NEW.trx_quantity END
    FROM public.properties
    WHERE tape_coil.uuid = NEW.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;

    UPDATE zipper.order_description
    SET
        tape_received = tape_received - OLD.trx_quantity + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 K   DROP FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();
       zipper          postgres    false    14            v           1255    277822    sfg_after_order_entry_delete()    FUNCTION     �   CREATE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 5   DROP FUNCTION zipper.sfg_after_order_entry_delete();
       zipper          postgres    false    14            ]           1255    277823    sfg_after_order_entry_insert()    FUNCTION       CREATE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 5   DROP FUNCTION zipper.sfg_after_order_entry_insert();
       zipper          postgres    false    14            }           1255    277824 *   sfg_after_sfg_production_delete_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    item_name TEXT;
    od_uuid TEXT;
    nylon_stopper_name TEXT;
BEGIN
    -- Fetch item_name and order_description_uuid once
    SELECT vodf.item_name, oe.order_description_uuid, vodf.nylon_stopper_name INTO item_name, od_uuid, nylon_stopper_name
    FROM zipper.sfg sfg
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE sfg.uuid = OLD.sfg_uuid;

    -- Update order_description based on item_name
    IF lower(item_name) = 'metal' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred + 
                CASE 
                    WHEN OLD.section = 'teeth_molding' THEN OLD.production_quantity_in_kg + OLD.wastage 
                    ELSE 0
                END,
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'vislon' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred + 
                CASE 
                    WHEN OLD.section = 'teeth_molding' THEN 
                        CASE
                            WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity + OLD.wastage 
                            ELSE OLD.production_quantity_in_kg + OLD.wastage 
                        END
                    ELSE 0
                END,
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'plastic' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity_in_kg + OLD.wastage 
                    ELSE 
                        CASE
                            WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity + OLD.wastage 
                            ELSE OLD.production_quantity_in_kg + OLD.wastage 
                        END 
                END,
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'metallic' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity_in_kg + OLD.wastage 
                    ELSE 
                        CASE
                            WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity + OLD.wastage 
                            ELSE OLD.production_quantity_in_kg + OLD.wastage 
                        END 
                END,
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity 
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;
    END IF;

    -- Update sfg table
    UPDATE zipper.sfg sfg
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
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity + OLD.wastage 
                        ELSE OLD.production_quantity_in_kg + OLD.wastage 
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
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity + OLD.wastage 
                        ELSE OLD.production_quantity_in_kg + OLD.wastage 
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
    WHERE sfg.uuid = OLD.sfg_uuid AND sfg.order_entry_uuid = oe.uuid AND oe.order_description_uuid = od_uuid;

    RETURN OLD;
END;
$$;
 A   DROP FUNCTION zipper.sfg_after_sfg_production_delete_function();
       zipper          postgres    false    14            ^           1255    277825 *   sfg_after_sfg_production_insert_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    item_name TEXT;
    od_uuid TEXT;
    nylon_stopper_name TEXT;
BEGIN
    -- Fetch item_name and order_description_uuid once
    SELECT vodf.item_name, oe.order_description_uuid, vodf.nylon_stopper_name INTO item_name, od_uuid, nylon_stopper_name
    FROM zipper.sfg sfg
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE sfg.uuid = NEW.sfg_uuid;

    -- Update order_description based on item_name
    IF lower(item_name) = 'metal' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN NEW.production_quantity_in_kg + NEW.wastage 
                    ELSE 0
                END,
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'vislon' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN 
                        CASE
                            WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity + NEW.wastage 
                            ELSE NEW.production_quantity_in_kg + NEW.wastage 
                        END
                    ELSE 0
                END,
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'plastic' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity_in_kg + NEW.wastage 
                    ELSE 
                        CASE
                            WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity + NEW.wastage 
                            ELSE NEW.production_quantity_in_kg + NEW.wastage 
                        END 
                END,
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'metallic' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity_in_kg + NEW.wastage 
                    ELSE 
                        CASE
                            WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity + NEW.wastage 
                            ELSE NEW.production_quantity_in_kg + NEW.wastage 
                        END 
                END,
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;
    END IF;

    -- Update sfg table
    UPDATE zipper.sfg sfg
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity + NEW.wastage 
                        ELSE NEW.production_quantity_in_kg + NEW.wastage 
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity + NEW.wastage 
                        ELSE NEW.production_quantity_in_kg + NEW.wastage 
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
    WHERE sfg.uuid = NEW.sfg_uuid AND sfg.order_entry_uuid = oe.uuid AND oe.order_description_uuid = od_uuid;

    RETURN NEW;
END;
$$;
 A   DROP FUNCTION zipper.sfg_after_sfg_production_insert_function();
       zipper          postgres    false    14            {           1255    277826 *   sfg_after_sfg_production_update_function()    FUNCTION     D  CREATE FUNCTION zipper.sfg_after_sfg_production_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    item_name TEXT;
    od_uuid TEXT;
    nylon_stopper_name TEXT;
BEGIN
    -- Fetch item_name and order_description_uuid once
    SELECT vodf.item_name, oe.order_description_uuid, vodf.nylon_stopper_name INTO item_name, od_uuid, nylon_stopper_name
    FROM zipper.sfg sfg
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE sfg.uuid = NEW.sfg_uuid;

    -- Update order_description based on item_name
    IF lower(item_name) = 'metal' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
                    ELSE 0
                END,
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'vislon' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'teeth_molding' THEN 
                        CASE
                            WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity + NEW.wastage) - (OLD.production_quantity + OLD.wastage)
                            ELSE (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
                        END
                    ELSE 0
                END,
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'plastic' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
                    ELSE 
                        CASE
                            WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity + NEW.wastage) - (OLD.production_quantity + OLD.wastage)
                            ELSE (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
                        END 
                END,
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;

    ELSIF lower(item_name) = 'nylon' AND lower(nylon_stopper_name) = 'metallic' THEN
        UPDATE zipper.order_description od
        SET 
            tape_transferred = tape_transferred - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
                    ELSE 
                        CASE
                            WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity + NEW.wastage) - (OLD.production_quantity + OLD.wastage)
                            ELSE (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
                        END 
                END,
            slider_finishing_stock = slider_finishing_stock - 
                CASE 
                    WHEN NEW.section = 'finishing' THEN (NEW.production_quantity) - (OLD.production_quantity)
                    ELSE 0
                END
        WHERE od.uuid = od_uuid;
    END IF;

    -- Update sfg table
    UPDATE zipper.sfg sfg
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity + NEW.wastage) - (OLD.production_quantity + OLD.wastage)
                        ELSE (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN (NEW.production_quantity + NEW.wastage) - (OLD.production_quantity + OLD.wastage)
                        ELSE (NEW.production_quantity_in_kg + NEW.wastage) - (OLD.production_quantity_in_kg + OLD.wastage)
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
    WHERE sfg.uuid = NEW.sfg_uuid AND sfg.order_entry_uuid = oe.uuid AND oe.order_description_uuid = od_uuid;

    RETURN NEW;
END;
$$;
 A   DROP FUNCTION zipper.sfg_after_sfg_production_update_function();
       zipper          postgres    false    14            q           1255    277827 +   sfg_after_sfg_transaction_delete_function()    FUNCTION     (  CREATE FUNCTION zipper.sfg_after_sfg_transaction_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    tocs_uuid INT;
BEGIN
    -- Updating stocks based on OLD.trx_to
    UPDATE zipper.sfg
     SET
        teeth_molding_stock = teeth_molding_stock 
            - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN 
            CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN 
            CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END,
        finishing_stock = finishing_stock 
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN 
            CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END,
        warehouse = warehouse 
            - CASE WHEN OLD.trx_to = 'warehouse' THEN 
            CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = OLD.sfg_uuid;

    -- Updating productions based on OLD.trx_from
    UPDATE zipper.sfg SET
        teeth_molding_prod = teeth_molding_prod + 
        CASE WHEN OLD.trx_from = 'teeth_molding_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END,

        teeth_coloring_prod = teeth_coloring_prod + 
        CASE WHEN OLD.trx_from = 'teeth_coloring_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END,

        finishing_prod = finishing_prod + 
        CASE WHEN OLD.trx_from = 'finishing_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END,

        warehouse = warehouse + 
        CASE WHEN OLD.trx_from = 'warehouse' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = OLD.sfg_uuid;

    RETURN OLD;
END;
$$;
 B   DROP FUNCTION zipper.sfg_after_sfg_transaction_delete_function();
       zipper          postgres    false    14            �           1255    277828 +   sfg_after_sfg_transaction_insert_function()    FUNCTION     *  CREATE FUNCTION zipper.sfg_after_sfg_transaction_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    tocs_uuid INT;
BEGIN
    -- Updating stocks based on NEW.trx_to
    UPDATE zipper.sfg SET
        teeth_molding_stock = teeth_molding_stock + 
        CASE WHEN NEW.trx_to = 'teeth_molding_stock' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,

        teeth_coloring_stock = teeth_coloring_stock + 
        CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,

        finishing_stock = finishing_stock + 
        CASE WHEN NEW.trx_to = 'finishing_stock' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,

        warehouse = warehouse + 
        CASE WHEN NEW.trx_to = 'warehouse' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;

    -- Updating productions based on NEW.trx_from
    UPDATE zipper.sfg SET
        teeth_molding_prod = teeth_molding_prod - 
        CASE WHEN NEW.trx_from = 'teeth_molding_prod' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,

        teeth_coloring_prod = teeth_coloring_prod - 
        CASE WHEN NEW.trx_from = 'teeth_coloring_prod' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,

        finishing_prod = finishing_prod - 
        CASE WHEN NEW.trx_from = 'finishing_prod' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,

        warehouse = warehouse - 
        CASE WHEN NEW.trx_from = 'warehouse' THEN 
        CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;

    RETURN NEW;
END;
$$;
 B   DROP FUNCTION zipper.sfg_after_sfg_transaction_insert_function();
       zipper          postgres    false    14            U           1255    277829 +   sfg_after_sfg_transaction_update_function()    FUNCTION     ?  CREATE FUNCTION zipper.sfg_after_sfg_transaction_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    tocs_uuid INT;
BEGIN
    -- Updating stocks based on OLD.trx_to and NEW.trx_to
    UPDATE zipper.sfg SET
        teeth_molding_stock = teeth_molding_stock 
            - CASE WHEN OLD.trx_to = 'teeth_molding_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'teeth_molding_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        finishing_stock = finishing_stock 
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'finishing_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        warehouse = warehouse 
            - CASE WHEN OLD.trx_to = 'warehouse' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'warehouse' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;

    -- Updating productions based on OLD.trx_from and NEW.trx_from
    UPDATE zipper.sfg SET
        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN OLD.trx_from = 'teeth_molding_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'teeth_molding_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        teeth_coloring_prod = teeth_coloring_prod 
            + CASE WHEN OLD.trx_from = 'teeth_coloring_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'teeth_coloring_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        finishing_prod = finishing_prod 
            + CASE WHEN OLD.trx_from = 'finishing_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'finishing_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        warehouse = warehouse 
            + CASE WHEN OLD.trx_from = 'warehouse' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'warehouse' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END
        WHERE uuid = NEW.sfg_uuid;
    
    RETURN NEW;
END;
$$;
 B   DROP FUNCTION zipper.sfg_after_sfg_transaction_update_function();
       zipper          postgres    false    14            Y           1255    277830 A   stock_after_material_trx_against_order_description_delete_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock + OLD.trx_quantity
    WHERE material_uuid = OLD.material_uuid;

    RETURN OLD;
END;
$$;
 X   DROP FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
       zipper          postgres    false    14            �           1255    277831 A   stock_after_material_trx_against_order_description_insert_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock - NEW.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
       zipper          postgres    false    14            A           1255    277832 A   stock_after_material_trx_against_order_description_update_funct()    FUNCTION     i  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock 
            - NEW.trx_quantity
            + OLD.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
       zipper          postgres    false    14            T           1255    277833 &   tape_coil_after_tape_coil_production()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        -- Tape Production
        quantity = quantity 
        + CASE WHEN NEW.section = 'tape' THEN NEW.production_quantity ELSE 0 END,

        -- Coil Production
        trx_quantity_in_coil = trx_quantity_in_coil 
        - CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity + NEW.wastage ELSE 0 END,
        quantity_in_coil = quantity_in_coil
        + CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity ELSE 0 END,

        -- Tape Or Production for Stock
        trx_quantity_in_dying = trx_quantity_in_dying
        - CASE WHEN NEW.section = 'stock' THEN NEW.production_quantity + NEW.wastage ELSE 0 END,
        stock_quantity = stock_quantity 
        + CASE WHEN NEW.section = 'stock' THEN NEW.production_quantity ELSE 0 END

    WHERE uuid = NEW.tape_coil_uuid;

    RETURN NEW;
END;
$$;
 =   DROP FUNCTION zipper.tape_coil_after_tape_coil_production();
       zipper          postgres    false    14            P           1255    277834 -   tape_coil_after_tape_coil_production_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        -- Tape Production
        quantity = quantity 
        - CASE WHEN OLD.section = 'tape' THEN OLD.production_quantity ELSE 0 END,

        -- Coil Production
        trx_quantity_in_coil = trx_quantity_in_coil 
        + CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity + OLD.wastage ELSE 0 END,
        quantity_in_coil = quantity_in_coil
        - CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity ELSE 0 END,

        -- Tape Or Production for Stock
        trx_quantity_in_dying = trx_quantity_in_dying
        + CASE WHEN OLD.section = 'stock' THEN OLD.production_quantity  + OLD.wastage ELSE 0 END,
        stock_quantity = stock_quantity 
        - CASE WHEN OLD.section = 'stock' THEN OLD.production_quantity ELSE 0 END

    WHERE uuid = OLD.tape_coil_uuid;

    RETURN OLD;
END;
$$;
 D   DROP FUNCTION zipper.tape_coil_after_tape_coil_production_delete();
       zipper          postgres    false    14            �           1255    277835 -   tape_coil_after_tape_coil_production_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        -- Tape Production
        quantity = quantity 
        + CASE WHEN OLD.section = 'tape' THEN OLD.production_quantity ELSE 0 END
        - CASE WHEN NEW.section = 'tape' THEN NEW.production_quantity ELSE 0 END,

        -- Coil Production
        trx_quantity_in_coil = trx_quantity_in_coil 
        + CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity + OLD.wastage ELSE 0 END
        - CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity + NEW.wastage ELSE 0 END,

        quantity_in_coil = quantity_in_coil
        - CASE WHEN OLD.section = 'coil' THEN OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'coil' THEN NEW.production_quantity ELSE 0 END,

        -- Tape Or Production for Stock
        trx_quantity_in_dying = trx_quantity_in_dying
        + CASE WHEN OLD.section = 'stock' THEN OLD.production_quantity + OLD.wastage ELSE 0 END
        - CASE WHEN NEW.section = 'stock' THEN NEW.production_quantity + NEW.wastage ELSE 0 END,

        stock_quantity = stock_quantity 
        - CASE WHEN OLD.section = 'stock' THEN OLD.production_quantity ELSE 0 END
        + CASE WHEN NEW.section = 'stock' THEN NEW.production_quantity ELSE 0 END

    WHERE uuid = NEW.tape_coil_uuid;

    RETURN NEW;
END;
$$;
 D   DROP FUNCTION zipper.tape_coil_after_tape_coil_production_update();
       zipper          postgres    false    14            �           1255    277836 !   tape_coil_after_tape_trx_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        -- Tape Trx to Coil Or Dyeing
        quantity = quantity + CASE WHEN OLD.to_section = 'dyeing' OR OLD.to_section = 'coil' THEN OLD.trx_quantity ELSE 0 END,
        -- Coil To Dyeing
        quantity_in_coil = quantity_in_coil + CASE WHEN OLD.to_section = 'coil_dyeing' AND (SELECT lower(name) FROM public.properties WHERE zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN OLD.trx_quantity ELSE 0 END,
        -- Tape AND Coil Dyeing Trx
        trx_quantity_in_dying = trx_quantity_in_dying 
        - CASE WHEN OLD.to_section = 'dyeing' OR OLD.to_section = 'coil_dyeing' THEN OLD.trx_quantity ELSE 0 END
        + CASE WHEN OLD.to_section = 'stock' THEN OLD.trx_quantity ELSE 0 END,
        -- Tape to Coil Trx 
        trx_quantity_in_coil = trx_quantity_in_coil - CASE WHEN OLD.to_section = 'coil' THEN OLD.trx_quantity ELSE 0 END,
        -- Dyed Tape or Coil Stock
        stock_quantity = stock_quantity - CASE WHEN OLD.to_section = 'stock' THEN OLD.trx_quantity ELSE 0 END
    WHERE uuid = OLD.tape_coil_uuid;
    RETURN OLD;
END;
$$;
 8   DROP FUNCTION zipper.tape_coil_after_tape_trx_delete();
       zipper          postgres    false    14            �           1255    277837 !   tape_coil_after_tape_trx_insert()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    --Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        -- Tape Trx to Coil Or Dyeing
        quantity = quantity - CASE WHEN NEW.to_section = 'dyeing' OR NEW.to_section = 'coil' THEN NEW.trx_quantity ELSE 0 END,
        -- Coil To Dyeing
        quantity_in_coil = quantity_in_coil 
        - CASE WHEN NEW.to_section = 'coil_dyeing' AND (SELECT lower(name) FROM public.properties where zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN NEW.trx_quantity ELSE 0 END,
        -- Tape AND Coil Dyeing Trx
        trx_quantity_in_dying = trx_quantity_in_dying 
        + CASE WHEN NEW.to_section = 'dyeing' OR NEW.to_section = 'coil_dyeing' THEN NEW.trx_quantity ELSE 0 END 
        - CASE WHEN NEW.to_section = 'stock' THEN NEW.trx_quantity ELSE 0 END,
        
        -- Tape to Coil Trx 
        trx_quantity_in_coil = trx_quantity_in_coil + CASE WHEN NEW.to_section = 'coil' THEN NEW.trx_quantity ELSE 0 END,

        -- Dyed Tape or Coil Stock
        stock_quantity = stock_quantity + CASE WHEN NEW.to_section = 'stock' THEN NEW.trx_quantity ELSE 0 END

    WHERE uuid = NEW.tape_coil_uuid;
RETURN NEW;
END;
$$;
 8   DROP FUNCTION zipper.tape_coil_after_tape_trx_insert();
       zipper          postgres    false    14            �           1255    277838 !   tape_coil_after_tape_trx_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.tape_coil table
    UPDATE zipper.tape_coil 
    SET
        -- Tape Trx to Coil Or Dyeing
        quantity = quantity - CASE 
            WHEN NEW.to_section = 'dyeing' OR NEW.to_section = 'coil' THEN NEW.trx_quantity 
            ELSE 0 
        END + CASE 
            WHEN OLD.to_section = 'dyeing' OR OLD.to_section = 'coil' THEN OLD.trx_quantity 
            ELSE 0 
        END,
        -- Coil To Dyeing
        quantity_in_coil = quantity_in_coil - CASE 
            WHEN NEW.to_section = 'coil_dyeing' AND (SELECT lower(name) FROM public.properties WHERE zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN NEW.trx_quantity 
            ELSE 0 
        END + CASE 
            WHEN OLD.to_section = 'coil_dyeing' AND (SELECT lower(name) FROM public.properties WHERE zipper.tape_coil.item_uuid = public.properties.uuid) = 'nylon' THEN OLD.trx_quantity 
            ELSE 0 
        END,
        -- Tape AND Coil Dyeing Trx
        trx_quantity_in_dying = trx_quantity_in_dying + CASE 
            WHEN NEW.to_section = 'dyeing' OR NEW.to_section = 'coil_dyeing' THEN NEW.trx_quantity 
            ELSE 0 
        END - CASE 
            WHEN OLD.to_section = 'dyeing' OR OLD.to_section = 'coil_dyeing' THEN OLD.trx_quantity 
            ELSE 0 
        END
        - CASE 
            WHEN NEW.to_section = 'stock' THEN NEW.trx_quantity 
            ELSE 0 
        END + CASE 
            WHEN OLD.to_section = 'stock' THEN OLD.trx_quantity 
            ELSE 0 
        END,
        -- Tape to Coil Trx 
        trx_quantity_in_coil = trx_quantity_in_coil + CASE 
            WHEN NEW.to_section = 'coil' THEN NEW.trx_quantity 
            ELSE 0 
        END - CASE 
            WHEN OLD.to_section = 'coil' THEN OLD.trx_quantity 
            ELSE 0 
        END,
        -- Dyed Tape or Coil Stock
        stock_quantity = stock_quantity + CASE 
            WHEN NEW.to_section = 'stock' THEN NEW.trx_quantity 
            ELSE 0 
        END - CASE 
            WHEN OLD.to_section = 'stock' THEN OLD.trx_quantity 
            ELSE 0 
        END
    WHERE uuid = NEW.tape_coil_uuid;
    RETURN NEW;
END;
$$;
 8   DROP FUNCTION zipper.tape_coil_after_tape_trx_update();
       zipper          postgres    false    14            �           1255    277839 A   tape_coil_and_order_description_after_dyed_tape_transaction_del()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity + OLD.trx_quantity
    WHERE uuid = OLD.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred - OLD.trx_quantity
    WHERE uuid = OLD.order_description_uuid;

    RETURN OLD;
END;

$$;
 X   DROP FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
       zipper          postgres    false    14            �           1255    277840 A   tape_coil_and_order_description_after_dyed_tape_transaction_ins()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity - NEW.trx_quantity
    WHERE uuid = NEW.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 X   DROP FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
       zipper          postgres    false    14            �           1255    277841 A   tape_coil_and_order_description_after_dyed_tape_transaction_upd()    FUNCTION     2  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity - NEW.trx_quantity + OLD.trx_quantity
    WHERE uuid = NEW.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 X   DROP FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
       zipper          postgres    false    14            �            1259    277842    bank    TABLE     /  CREATE TABLE commercial.bank (
    uuid text NOT NULL,
    name text NOT NULL,
    swift_code text NOT NULL,
    address text,
    policy text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    created_by text,
    routing_no text
);
    DROP TABLE commercial.bank;
    
   commercial         heap    postgres    false    5            �            1259    277847    lc_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.lc_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.lc_sequence;
    
   commercial          postgres    false    5            �            1259    277848    lc    TABLE     �  CREATE TABLE commercial.lc (
    uuid text NOT NULL,
    party_uuid text,
    lc_number text NOT NULL,
    lc_date timestamp without time zone NOT NULL,
    payment_date timestamp without time zone,
    ldbc_fdbc text,
    acceptance_date timestamp without time zone,
    maturity_date timestamp without time zone,
    commercial_executive text NOT NULL,
    party_bank text NOT NULL,
    production_complete integer DEFAULT 0,
    lc_cancel integer DEFAULT 0,
    handover_date timestamp without time zone,
    shipment_date timestamp without time zone,
    expiry_date timestamp without time zone,
    ud_no text,
    ud_received text,
    at_sight text NOT NULL,
    amd_date timestamp without time zone,
    amd_count integer DEFAULT 0,
    problematical integer DEFAULT 0,
    epz integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    id integer DEFAULT nextval('commercial.lc_sequence'::regclass) NOT NULL,
    document_receive_date timestamp without time zone,
    is_rtgs integer DEFAULT 0,
    lc_value numeric(20,4) DEFAULT 0 NOT NULL,
    is_old_pi integer DEFAULT 0,
    pi_number text
);
    DROP TABLE commercial.lc;
    
   commercial         heap    postgres    false    226    5            �            1259    277861    pi_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.pi_sequence;
    
   commercial          postgres    false    5            �            1259    277862    pi_cash    TABLE     �  CREATE TABLE commercial.pi_cash (
    uuid text NOT NULL,
    id integer DEFAULT nextval('commercial.pi_sequence'::regclass) NOT NULL,
    lc_uuid text,
    order_info_uuids text NOT NULL,
    marketing_uuid text,
    party_uuid text,
    merchandiser_uuid text,
    factory_uuid text,
    bank_uuid text,
    validity integer DEFAULT 0,
    payment integer DEFAULT 0,
    is_pi integer DEFAULT 0,
    conversion_rate numeric(20,4) DEFAULT 0,
    receive_amount numeric(20,4) DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL,
    thread_order_info_uuids text
);
    DROP TABLE commercial.pi_cash;
    
   commercial         heap    postgres    false    228    5            �            1259    277874    pi_cash_entry    TABLE     .  CREATE TABLE commercial.pi_cash_entry (
    uuid text NOT NULL,
    pi_cash_uuid text,
    sfg_uuid text,
    pi_cash_quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    thread_order_entry_uuid text
);
 %   DROP TABLE commercial.pi_cash_entry;
    
   commercial         heap    postgres    false    5            �            1259    277879    challan_sequence    SEQUENCE     {   CREATE SEQUENCE delivery.challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE delivery.challan_sequence;
       delivery          postgres    false    6            �            1259    277880    challan    TABLE     �  CREATE TABLE delivery.challan (
    uuid text NOT NULL,
    carton_quantity integer NOT NULL,
    assign_to text,
    receive_status integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    id integer DEFAULT nextval('delivery.challan_sequence'::regclass),
    gate_pass integer DEFAULT 0,
    order_info_uuid text
);
    DROP TABLE delivery.challan;
       delivery         heap    postgres    false    231    6            �            1259    277888    challan_entry    TABLE     �   CREATE TABLE delivery.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    packing_list_uuid text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 #   DROP TABLE delivery.challan_entry;
       delivery         heap    postgres    false    6            �            1259    277893    packing_list_sequence    SEQUENCE     �   CREATE SEQUENCE delivery.packing_list_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE delivery.packing_list_sequence;
       delivery          postgres    false    6            �            1259    277894    packing_list    TABLE     �  CREATE TABLE delivery.packing_list (
    uuid text NOT NULL,
    carton_size text NOT NULL,
    carton_weight text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    order_info_uuid text,
    id integer DEFAULT nextval('delivery.packing_list_sequence'::regclass),
    challan_uuid text
);
 "   DROP TABLE delivery.packing_list;
       delivery         heap    postgres    false    234    6            �            1259    277900    packing_list_entry    TABLE     Y  CREATE TABLE delivery.packing_list_entry (
    uuid text NOT NULL,
    packing_list_uuid text,
    sfg_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    short_quantity integer DEFAULT 0,
    reject_quantity integer DEFAULT 0
);
 (   DROP TABLE delivery.packing_list_entry;
       delivery         heap    postgres    false    6            �            1259    277907    users    TABLE     C  CREATE TABLE hr.users (
    uuid text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    pass text NOT NULL,
    designation_uuid text,
    can_access text,
    ext text,
    phone text,
    created_at text NOT NULL,
    updated_at text,
    status text DEFAULT 0,
    remarks text,
    department_uuid text
);
    DROP TABLE hr.users;
       hr         heap    postgres    false    8            �            1259    277913    buyer    TABLE     �   CREATE TABLE public.buyer (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.buyer;
       public         heap    postgres    false    15            �            1259    277918    factory    TABLE       CREATE TABLE public.factory (
    uuid text NOT NULL,
    party_uuid text,
    name text NOT NULL,
    phone text,
    address text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    remarks text
);
    DROP TABLE public.factory;
       public         heap    postgres    false    15            �            1259    277923 	   marketing    TABLE       CREATE TABLE public.marketing (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    user_uuid text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.marketing;
       public         heap    postgres    false    15            �            1259    277928    merchandiser    TABLE     $  CREATE TABLE public.merchandiser (
    uuid text NOT NULL,
    party_uuid text,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    remarks text
);
     DROP TABLE public.merchandiser;
       public         heap    postgres    false    15            �            1259    277933    party    TABLE       CREATE TABLE public.party (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text NOT NULL,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    address text
);
    DROP TABLE public.party;
       public         heap    postgres    false    15            �            1259    277938 
   properties    TABLE     -  CREATE TABLE public.properties (
    uuid text NOT NULL,
    item_for text NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    short_name text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE public.properties;
       public         heap    postgres    false    15            �            1259    277943    stock    TABLE     a  CREATE TABLE slider.stock (
    uuid text NOT NULL,
    order_quantity numeric(20,4) DEFAULT 0,
    body_quantity numeric(20,4) DEFAULT 0,
    cap_quantity numeric(20,4) DEFAULT 0,
    puller_quantity numeric(20,4) DEFAULT 0,
    link_quantity numeric(20,4) DEFAULT 0,
    sa_prod numeric(20,4) DEFAULT 0,
    coloring_stock numeric(20,4) DEFAULT 0,
    coloring_prod numeric(20,4) DEFAULT 0,
    trx_to_finishing numeric(20,4) DEFAULT 0,
    u_top_quantity numeric(20,4) DEFAULT 0,
    h_bottom_quantity numeric(20,4) DEFAULT 0,
    box_pin_quantity numeric(20,4) DEFAULT 0,
    two_way_pin_quantity numeric(20,4) DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    quantity_in_sa numeric(20,4) DEFAULT 0,
    order_description_uuid text,
    finishing_stock numeric(20,4) DEFAULT 0
);
    DROP TABLE slider.stock;
       slider         heap    postgres    false    12            �            1259    277963    order_description    TABLE     �  CREATE TABLE zipper.order_description (
    uuid text NOT NULL,
    order_info_uuid text,
    item text,
    zipper_number text,
    end_type text,
    lock_type text,
    puller_type text,
    teeth_color text,
    puller_color text,
    special_requirement text,
    hand text,
    coloring_type text,
    is_slider_provided integer DEFAULT 0,
    slider text,
    slider_starting_section_enum zipper.slider_starting_section_enum,
    top_stopper text,
    bottom_stopper text,
    logo_type text,
    is_logo_body integer DEFAULT 0 NOT NULL,
    is_logo_puller integer DEFAULT 0 NOT NULL,
    description text,
    status integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    slider_body_shape text,
    slider_link text,
    end_user text,
    garment text,
    light_preference text,
    garments_wash text,
    created_by text,
    garments_remarks text,
    tape_received numeric(20,4) DEFAULT 0 NOT NULL,
    tape_transferred numeric(20,4) DEFAULT 0 NOT NULL,
    slider_finishing_stock numeric(20,4) DEFAULT 0 NOT NULL,
    nylon_stopper text,
    tape_coil_uuid text,
    teeth_type text,
    is_inch integer DEFAULT 0
);
 %   DROP TABLE zipper.order_description;
       zipper         heap    postgres    false    14    1044            �            1259    277975    order_entry    TABLE     �  CREATE TABLE zipper.order_entry (
    uuid text NOT NULL,
    order_description_uuid text,
    style text NOT NULL,
    color text NOT NULL,
    size text NOT NULL,
    quantity numeric(20,4) NOT NULL,
    company_price numeric(20,4) DEFAULT 0 NOT NULL,
    party_price numeric(20,4) DEFAULT 0 NOT NULL,
    status integer DEFAULT 1,
    swatch_status_enum zipper.swatch_status_enum DEFAULT 'pending'::zipper.swatch_status_enum,
    swatch_approval_date timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    bleaching text,
    is_inch integer DEFAULT 0
);
    DROP TABLE zipper.order_entry;
       zipper         heap    postgres    false    1047    14    1047            �            1259    277984    order_info_sequence    SEQUENCE     |   CREATE SEQUENCE zipper.order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE zipper.order_info_sequence;
       zipper          postgres    false    14            �            1259    277985 
   order_info    TABLE     �  CREATE TABLE zipper.order_info (
    uuid text NOT NULL,
    id integer DEFAULT nextval('zipper.order_info_sequence'::regclass) NOT NULL,
    reference_order_info_uuid text,
    buyer_uuid text,
    party_uuid text,
    marketing_uuid text,
    merchandiser_uuid text,
    factory_uuid text,
    is_sample integer DEFAULT 0,
    is_bill integer DEFAULT 0,
    is_cash integer DEFAULT 0,
    marketing_priority text,
    factory_priority text,
    status integer DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    conversion_rate numeric(20,4) DEFAULT 0 NOT NULL,
    print_in zipper.print_in_enum DEFAULT 'portrait'::zipper.print_in_enum
);
    DROP TABLE zipper.order_info;
       zipper         heap    postgres    false    247    1041    1041    14            �            1259    277997    sfg    TABLE     �  CREATE TABLE zipper.sfg (
    uuid text NOT NULL,
    order_entry_uuid text,
    recipe_uuid text,
    dying_and_iron_prod numeric(20,4) DEFAULT 0,
    teeth_molding_stock numeric(20,4) DEFAULT 0,
    teeth_molding_prod numeric(20,4) DEFAULT 0,
    teeth_coloring_stock numeric(20,4) DEFAULT 0,
    teeth_coloring_prod numeric(20,4) DEFAULT 0,
    finishing_stock numeric(20,4) DEFAULT 0,
    finishing_prod numeric(20,4) DEFAULT 0,
    coloring_prod numeric(20,4) DEFAULT 0,
    warehouse numeric(20,4) DEFAULT 0 NOT NULL,
    delivered numeric(20,4) DEFAULT 0 NOT NULL,
    pi numeric(20,4) DEFAULT 0 NOT NULL,
    remarks text,
    short_quantity integer DEFAULT 0,
    reject_quantity integer DEFAULT 0
);
    DROP TABLE zipper.sfg;
       zipper         heap    postgres    false    14            �            1259    278015 	   tape_coil    TABLE     �  CREATE TABLE zipper.tape_coil (
    uuid text NOT NULL,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    trx_quantity_in_coil numeric(20,4) DEFAULT 0 NOT NULL,
    quantity_in_coil numeric(20,4) DEFAULT 0 NOT NULL,
    remarks text,
    item_uuid text,
    zipper_number_uuid text,
    name text NOT NULL,
    raw_per_kg_meter numeric(20,4) DEFAULT 0 NOT NULL,
    dyed_per_kg_meter numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    is_import text,
    is_reverse text,
    trx_quantity_in_dying numeric(20,4) DEFAULT 0 NOT NULL,
    stock_quantity numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE zipper.tape_coil;
       zipper         heap    postgres    false    14            ?           1259    279779    v_order_details_full    VIEW       CREATE VIEW zipper.v_order_details_full AS
 SELECT order_info.uuid AS order_info_uuid,
    concat('Z', to_char(order_info.created_at, 'YY'::text), '-', lpad((order_info.id)::text, 4, '0'::text)) AS order_number,
    order_description.uuid AS order_description_uuid,
    (order_description.tape_received)::double precision AS tape_received,
    (order_description.tape_transferred)::double precision AS tape_transferred,
    (order_description.slider_finishing_stock)::double precision AS slider_finishing_stock,
    order_info.marketing_uuid,
    marketing.name AS marketing_name,
    order_info.buyer_uuid,
    buyer.name AS buyer_name,
    order_info.merchandiser_uuid,
    merchandiser.name AS merchandiser_name,
    order_info.factory_uuid,
    factory.name AS factory_name,
    factory.address AS factory_address,
    order_info.party_uuid,
    party.name AS party_name,
    order_info.created_by AS created_by_uuid,
    users.name AS created_by_name,
    order_info.is_cash,
    order_info.is_bill,
    order_info.is_sample,
    order_info.status AS order_status,
    order_info.created_at,
    order_info.updated_at,
    order_info.print_in,
    concat(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
    order_description.item,
    op_item.name AS item_name,
    op_item.short_name AS item_short_name,
    order_description.nylon_stopper,
    op_nylon_stopper.name AS nylon_stopper_name,
    op_nylon_stopper.short_name AS nylon_stopper_short_name,
    order_description.zipper_number,
    op_zipper.name AS zipper_number_name,
    op_zipper.short_name AS zipper_number_short_name,
    order_description.end_type,
    op_end.name AS end_type_name,
    op_end.short_name AS end_type_short_name,
    order_description.puller_type,
    op_puller.name AS puller_type_name,
    op_puller.short_name AS puller_type_short_name,
    order_description.lock_type,
    op_lock.name AS lock_type_name,
    op_lock.short_name AS lock_type_short_name,
    order_description.teeth_color,
    op_teeth_color.name AS teeth_color_name,
    op_teeth_color.short_name AS teeth_color_short_name,
    order_description.puller_color,
    op_puller_color.name AS puller_color_name,
    op_puller_color.short_name AS puller_color_short_name,
    order_description.hand,
    op_hand.name AS hand_name,
    op_hand.short_name AS hand_short_name,
    order_description.coloring_type,
    op_coloring.name AS coloring_type_name,
    op_coloring.short_name AS coloring_type_short_name,
    order_description.is_slider_provided,
    order_description.slider,
    op_slider.name AS slider_name,
    op_slider.short_name AS slider_short_name,
    order_description.slider_starting_section_enum AS slider_starting_section,
    order_description.top_stopper,
    op_top_stopper.name AS top_stopper_name,
    op_top_stopper.short_name AS top_stopper_short_name,
    order_description.bottom_stopper,
    op_bottom_stopper.name AS bottom_stopper_name,
    op_bottom_stopper.short_name AS bottom_stopper_short_name,
    order_description.logo_type,
    op_logo.name AS logo_type_name,
    op_logo.short_name AS logo_type_short_name,
    order_description.is_logo_body,
    order_description.is_logo_puller,
    order_description.special_requirement,
    order_description.description,
    order_description.status AS order_description_status,
    order_description.created_at AS order_description_created_at,
    order_description.updated_at AS order_description_updated_at,
    order_description.remarks,
    order_description.slider_body_shape,
    op_slider_body_shape.name AS slider_body_shape_name,
    op_slider_body_shape.short_name AS slider_body_shape_short_name,
    order_description.end_user,
    op_end_user.name AS end_user_name,
    op_end_user.short_name AS end_user_short_name,
    order_description.garment,
    order_description.light_preference,
    op_light_preference.name AS light_preference_name,
    op_light_preference.short_name AS light_preference_short_name,
    order_description.garments_wash,
    order_description.slider_link,
    op_slider_link.name AS slider_link_name,
    op_slider_link.short_name AS slider_link_short_name,
    order_info.marketing_priority,
    order_info.factory_priority,
    order_description.garments_remarks,
    stock.uuid AS stock_uuid,
    (stock.order_quantity)::double precision AS stock_order_quantity,
    order_description.tape_coil_uuid,
    tc.name AS tape_name,
    order_description.teeth_type,
    op_teeth_type.name AS teeth_type_name,
    op_teeth_type.short_name AS teeth_type_short_name,
    order_description.is_inch
   FROM ((((((((((((((((((((((((((((zipper.order_info
     LEFT JOIN zipper.order_description ON ((order_description.order_info_uuid = order_info.uuid)))
     LEFT JOIN public.marketing ON ((marketing.uuid = order_info.marketing_uuid)))
     LEFT JOIN public.buyer ON ((buyer.uuid = order_info.buyer_uuid)))
     LEFT JOIN public.merchandiser ON ((merchandiser.uuid = order_info.merchandiser_uuid)))
     LEFT JOIN public.factory ON ((factory.uuid = order_info.factory_uuid)))
     LEFT JOIN hr.users users ON ((users.uuid = order_info.created_by)))
     LEFT JOIN public.party ON ((party.uuid = order_info.party_uuid)))
     LEFT JOIN public.properties op_item ON ((op_item.uuid = order_description.item)))
     LEFT JOIN public.properties op_nylon_stopper ON ((op_nylon_stopper.uuid = order_description.nylon_stopper)))
     LEFT JOIN public.properties op_zipper ON ((op_zipper.uuid = order_description.zipper_number)))
     LEFT JOIN public.properties op_end ON ((op_end.uuid = order_description.end_type)))
     LEFT JOIN public.properties op_puller ON ((op_puller.uuid = order_description.puller_type)))
     LEFT JOIN public.properties op_lock ON ((op_lock.uuid = order_description.lock_type)))
     LEFT JOIN public.properties op_teeth_color ON ((op_teeth_color.uuid = order_description.teeth_color)))
     LEFT JOIN public.properties op_puller_color ON ((op_puller_color.uuid = order_description.puller_color)))
     LEFT JOIN public.properties op_hand ON ((op_hand.uuid = order_description.hand)))
     LEFT JOIN public.properties op_coloring ON ((op_coloring.uuid = order_description.coloring_type)))
     LEFT JOIN public.properties op_slider ON ((op_slider.uuid = order_description.slider)))
     LEFT JOIN public.properties op_top_stopper ON ((op_top_stopper.uuid = order_description.top_stopper)))
     LEFT JOIN public.properties op_bottom_stopper ON ((op_bottom_stopper.uuid = order_description.bottom_stopper)))
     LEFT JOIN public.properties op_logo ON ((op_logo.uuid = order_description.logo_type)))
     LEFT JOIN public.properties op_slider_body_shape ON ((op_slider_body_shape.uuid = order_description.slider_body_shape)))
     LEFT JOIN public.properties op_slider_link ON ((op_slider_link.uuid = order_description.slider_link)))
     LEFT JOIN public.properties op_end_user ON ((op_end_user.uuid = order_description.end_user)))
     LEFT JOIN public.properties op_light_preference ON ((op_light_preference.uuid = order_description.light_preference)))
     LEFT JOIN slider.stock ON ((stock.order_description_uuid = order_description.uuid)))
     LEFT JOIN zipper.tape_coil tc ON ((tc.uuid = order_description.tape_coil_uuid)))
     LEFT JOIN public.properties op_teeth_type ON ((op_teeth_type.uuid = order_description.teeth_type)));
 '   DROP VIEW zipper.v_order_details_full;
       zipper          postgres    false    245    250    250    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    244    244    244    243    243    243    242    242    241    241    240    240    239    239    239    238    238    237    237    14    1041    1044            @           1259    279784    v_packing_list    VIEW     �  CREATE VIEW delivery.v_packing_list AS
 SELECT pl.id AS packing_list_id,
    pl.uuid AS packing_list_uuid,
    concat('PL', to_char(pl.created_at, 'YY'::text), '-', lpad((pl.id)::text, 4, '0'::text)) AS packing_number,
    pl.carton_size,
    pl.carton_weight,
    pl.order_info_uuid,
    pl.challan_uuid,
    pl.created_by AS created_by_uuid,
    users.name AS created_by_name,
    pl.created_at,
    pl.updated_at,
    pl.remarks,
    ple.uuid AS packing_list_entry_uuid,
    ple.sfg_uuid,
    (ple.quantity)::double precision AS quantity,
    (ple.short_quantity)::double precision AS short_quantity,
    (ple.reject_quantity)::double precision AS reject_quantity,
    ple.created_at AS entry_created_at,
    ple.updated_at AS entry_updated_at,
    ple.remarks AS entry_remarks,
    oe.uuid AS order_entry_uuid,
    oe.style,
    oe.color,
        CASE
            WHEN (vodf.is_inch = 1) THEN (((oe.size)::numeric * 2.54))::text
            ELSE oe.size
        END AS size,
    concat(oe.style, ' / ', oe.color, ' / ',
        CASE
            WHEN (vodf.is_inch = 1) THEN (((oe.size)::numeric * 2.54))::text
            ELSE oe.size
        END) AS style_color_size,
    (oe.quantity)::double precision AS order_quantity,
    vodf.order_description_uuid,
    vodf.order_number,
    vodf.item_description,
    (sfg.warehouse)::double precision AS warehouse,
    (sfg.delivered)::double precision AS delivered,
    ((oe.quantity - sfg.warehouse))::double precision AS balance_quantity
   FROM (((((delivery.packing_list pl
     LEFT JOIN delivery.packing_list_entry ple ON ((ple.packing_list_uuid = pl.uuid)))
     LEFT JOIN hr.users ON ((users.uuid = pl.created_by)))
     LEFT JOIN zipper.sfg ON ((sfg.uuid = ple.sfg_uuid)))
     LEFT JOIN zipper.order_entry oe ON ((oe.uuid = sfg.order_entry_uuid)))
     LEFT JOIN zipper.v_order_details_full vodf ON ((vodf.order_description_uuid = oe.order_description_uuid)));
 #   DROP VIEW delivery.v_packing_list;
       delivery          postgres    false    246    249    235    246    235    246    235    237    237    236    319    319    236    235    235    235    235    236    236    319    319    249    236    236    246    246    249    246    235    235    236    236    236    235    249    6            �            1259    278037    migrations_details    TABLE     t   CREATE TABLE drizzle.migrations_details (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
 '   DROP TABLE drizzle.migrations_details;
       drizzle         heap    postgres    false    7            �            1259    278042    migrations_details_id_seq    SEQUENCE     �   CREATE SEQUENCE drizzle.migrations_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE drizzle.migrations_details_id_seq;
       drizzle          postgres    false    7    251            �           0    0    migrations_details_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE drizzle.migrations_details_id_seq OWNED BY drizzle.migrations_details.id;
          drizzle          postgres    false    252            �            1259    278043 
   department    TABLE     �   CREATE TABLE hr.department (
    uuid text NOT NULL,
    department text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.department;
       hr         heap    postgres    false    8            �            1259    278048    designation    TABLE     �   CREATE TABLE hr.designation (
    uuid text NOT NULL,
    designation text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.designation;
       hr         heap    postgres    false    8            �            1259    278053    policy_and_notice    TABLE       CREATE TABLE hr.policy_and_notice (
    uuid text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    sub_title text NOT NULL,
    url text NOT NULL,
    created_at text NOT NULL,
    updated_at text,
    status integer NOT NULL,
    remarks text,
    created_by text
);
 !   DROP TABLE hr.policy_and_notice;
       hr         heap    postgres    false    8                        1259    278058    info    TABLE     L  CREATE TABLE lab_dip.info (
    uuid text NOT NULL,
    id integer NOT NULL,
    name text NOT NULL,
    order_info_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    lab_status integer DEFAULT 0,
    thread_order_info_uuid text
);
    DROP TABLE lab_dip.info;
       lab_dip         heap    postgres    false    9                       1259    278064    info_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE lab_dip.info_id_seq;
       lab_dip          postgres    false    256    9            �           0    0    info_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE lab_dip.info_id_seq OWNED BY lab_dip.info.id;
          lab_dip          postgres    false    257                       1259    278065    recipe    TABLE     t  CREATE TABLE lab_dip.recipe (
    uuid text NOT NULL,
    id integer NOT NULL,
    lab_dip_info_uuid text,
    name text NOT NULL,
    approved integer DEFAULT 0,
    created_by text,
    status integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sub_streat text,
    bleaching text
);
    DROP TABLE lab_dip.recipe;
       lab_dip         heap    postgres    false    9                       1259    278072    recipe_entry    TABLE       CREATE TABLE lab_dip.recipe_entry (
    uuid text NOT NULL,
    recipe_uuid text,
    color text NOT NULL,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    material_uuid text
);
 !   DROP TABLE lab_dip.recipe_entry;
       lab_dip         heap    postgres    false    9                       1259    278077    recipe_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE lab_dip.recipe_id_seq;
       lab_dip          postgres    false    258    9            �           0    0    recipe_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE lab_dip.recipe_id_seq OWNED BY lab_dip.recipe.id;
          lab_dip          postgres    false    260                       1259    278078    shade_recipe_sequence    SEQUENCE        CREATE SEQUENCE lab_dip.shade_recipe_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE lab_dip.shade_recipe_sequence;
       lab_dip          postgres    false    9                       1259    278079    shade_recipe    TABLE     }  CREATE TABLE lab_dip.shade_recipe (
    uuid text NOT NULL,
    id integer DEFAULT nextval('lab_dip.shade_recipe_sequence'::regclass) NOT NULL,
    name text NOT NULL,
    sub_streat text,
    lab_status integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    bleaching text
);
 !   DROP TABLE lab_dip.shade_recipe;
       lab_dip         heap    postgres    false    261    9                       1259    278086    shade_recipe_entry    TABLE       CREATE TABLE lab_dip.shade_recipe_entry (
    uuid text NOT NULL,
    shade_recipe_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE lab_dip.shade_recipe_entry;
       lab_dip         heap    postgres    false    9                       1259    278091    info    TABLE     u  CREATE TABLE material.info (
    uuid text NOT NULL,
    section_uuid text,
    type_uuid text,
    name text NOT NULL,
    short_name text,
    unit text NOT NULL,
    threshold numeric(20,4) DEFAULT 0 NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    created_by text
);
    DROP TABLE material.info;
       material         heap    postgres    false    10            	           1259    278097    section    TABLE     �   CREATE TABLE material.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.section;
       material         heap    postgres    false    10            
           1259    278102    stock    TABLE     �  CREATE TABLE material.stock (
    uuid text NOT NULL,
    material_uuid text,
    stock numeric(20,4) DEFAULT 0 NOT NULL,
    tape_making numeric(20,4) DEFAULT 0 NOT NULL,
    coil_forming numeric(20,4) DEFAULT 0 NOT NULL,
    dying_and_iron numeric(20,4) DEFAULT 0 NOT NULL,
    m_gapping numeric(20,4) DEFAULT 0 NOT NULL,
    v_gapping numeric(20,4) DEFAULT 0 NOT NULL,
    v_teeth_molding numeric(20,4) DEFAULT 0 NOT NULL,
    m_teeth_molding numeric(20,4) DEFAULT 0 NOT NULL,
    teeth_assembling_and_polishing numeric(20,4) DEFAULT 0 NOT NULL,
    m_teeth_cleaning numeric(20,4) DEFAULT 0 NOT NULL,
    v_teeth_cleaning numeric(20,4) DEFAULT 0 NOT NULL,
    plating_and_iron numeric(20,4) DEFAULT 0 NOT NULL,
    m_sealing numeric(20,4) DEFAULT 0 NOT NULL,
    v_sealing numeric(20,4) DEFAULT 0 NOT NULL,
    n_t_cutting numeric(20,4) DEFAULT 0 NOT NULL,
    v_t_cutting numeric(20,4) DEFAULT 0 NOT NULL,
    m_stopper numeric(20,4) DEFAULT 0 NOT NULL,
    v_stopper numeric(20,4) DEFAULT 0 NOT NULL,
    n_stopper numeric(20,4) DEFAULT 0 NOT NULL,
    cutting numeric(20,4) DEFAULT 0 NOT NULL,
    die_casting numeric(20,4) DEFAULT 0 NOT NULL,
    slider_assembly numeric(20,4) DEFAULT 0 NOT NULL,
    coloring numeric(20,4) DEFAULT 0 NOT NULL,
    remarks text,
    lab_dip numeric(20,4) DEFAULT 0,
    m_qc_and_packing numeric(20,4) DEFAULT 0 NOT NULL,
    v_qc_and_packing numeric(20,4) DEFAULT 0 NOT NULL,
    n_qc_and_packing numeric(20,4) DEFAULT 0 NOT NULL,
    s_qc_and_packing numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE material.stock;
       material         heap    postgres    false    10                       1259    278135    stock_to_sfg    TABLE     =  CREATE TABLE material.stock_to_sfg (
    uuid text NOT NULL,
    material_uuid text,
    order_entry_uuid text,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 "   DROP TABLE material.stock_to_sfg;
       material         heap    postgres    false    10                       1259    278140    trx    TABLE       CREATE TABLE material.trx (
    uuid text NOT NULL,
    material_uuid text,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE material.trx;
       material         heap    postgres    false    10                       1259    278145    type    TABLE     �   CREATE TABLE material.type (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.type;
       material         heap    postgres    false    10                       1259    278150    used    TABLE     J  CREATE TABLE material.used (
    uuid text NOT NULL,
    material_uuid text,
    section text NOT NULL,
    used_quantity numeric(20,4) NOT NULL,
    wastage numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE material.used;
       material         heap    postgres    false    10                       1259    278156    machine    TABLE     1  CREATE TABLE public.machine (
    uuid text NOT NULL,
    name text NOT NULL,
    is_vislon integer DEFAULT 0,
    is_metal integer DEFAULT 0,
    is_nylon integer DEFAULT 0,
    is_sewing_thread integer DEFAULT 0,
    is_bulk integer DEFAULT 0,
    is_sample integer DEFAULT 0,
    min_capacity numeric(20,4) NOT NULL,
    max_capacity numeric(20,4) NOT NULL,
    water_capacity numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE public.machine;
       public         heap    postgres    false    15                       1259    278168    section    TABLE     w   CREATE TABLE public.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text
);
    DROP TABLE public.section;
       public         heap    postgres    false    15                       1259    278173    purchase_description_sequence    SEQUENCE     �   CREATE SEQUENCE purchase.purchase_description_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE purchase.purchase_description_sequence;
       purchase          postgres    false    11                       1259    278174    description    TABLE     �  CREATE TABLE purchase.description (
    uuid text NOT NULL,
    vendor_uuid text,
    is_local integer NOT NULL,
    lc_number text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    id integer DEFAULT nextval('purchase.purchase_description_sequence'::regclass) NOT NULL,
    challan_number text
);
 !   DROP TABLE purchase.description;
       purchase         heap    postgres    false    273    11                       1259    278180    entry    TABLE     ;  CREATE TABLE purchase.entry (
    uuid text NOT NULL,
    purchase_description_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    price numeric(20,4) DEFAULT NULL::numeric,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE purchase.entry;
       purchase         heap    postgres    false    11                       1259    278186    vendor    TABLE     M  CREATE TABLE purchase.vendor (
    uuid text NOT NULL,
    name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    office_address text NOT NULL,
    contact_number text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE purchase.vendor;
       purchase         heap    postgres    false    11                       1259    278191    assembly_stock    TABLE     �  CREATE TABLE slider.assembly_stock (
    uuid text NOT NULL,
    name text NOT NULL,
    die_casting_body_uuid text,
    die_casting_puller_uuid text,
    die_casting_cap_uuid text,
    die_casting_link_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
 "   DROP TABLE slider.assembly_stock;
       slider         heap    postgres    false    12                       1259    278198    coloring_transaction    TABLE     R  CREATE TABLE slider.coloring_transaction (
    uuid text NOT NULL,
    stock_uuid text,
    order_info_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
 (   DROP TABLE slider.coloring_transaction;
       slider         heap    postgres    false    12                       1259    278204    die_casting    TABLE     T  CREATE TABLE slider.die_casting (
    uuid text NOT NULL,
    name text NOT NULL,
    item text,
    zipper_number text,
    end_type text,
    puller_type text,
    logo_type text,
    slider_body_shape text,
    slider_link text,
    quantity numeric(20,4) DEFAULT 0,
    weight numeric(20,4) DEFAULT 0,
    pcs_per_kg numeric(20,4) DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    quantity_in_sa numeric(20,4) DEFAULT 0,
    is_logo_body integer DEFAULT 0,
    is_logo_puller integer DEFAULT 0,
    type text
);
    DROP TABLE slider.die_casting;
       slider         heap    postgres    false    12                       1259    278215    die_casting_production    TABLE     �  CREATE TABLE slider.die_casting_production (
    uuid text NOT NULL,
    die_casting_uuid text,
    mc_no integer NOT NULL,
    cavity_goods integer NOT NULL,
    cavity_defect integer NOT NULL,
    push integer NOT NULL,
    weight numeric(20,4) NOT NULL,
    order_description_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 *   DROP TABLE slider.die_casting_production;
       slider         heap    postgres    false    12                       1259    278220    die_casting_to_assembly_stock    TABLE     �  CREATE TABLE slider.die_casting_to_assembly_stock (
    uuid text NOT NULL,
    assembly_stock_uuid text,
    production_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    wastage numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    with_link integer DEFAULT 1,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
 1   DROP TABLE slider.die_casting_to_assembly_stock;
       slider         heap    postgres    false    12                       1259    278229    die_casting_transaction    TABLE     V  CREATE TABLE slider.die_casting_transaction (
    uuid text NOT NULL,
    die_casting_uuid text,
    stock_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
 +   DROP TABLE slider.die_casting_transaction;
       slider         heap    postgres    false    12                       1259    278235 
   production    TABLE     �  CREATE TABLE slider.production (
    uuid text NOT NULL,
    stock_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    wastage numeric(20,4) NOT NULL,
    section text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    with_link integer DEFAULT 1,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE slider.production;
       slider         heap    postgres    false    12                       1259    278242    transaction    TABLE     �  CREATE TABLE slider.transaction (
    uuid text NOT NULL,
    stock_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    from_section text NOT NULL,
    to_section text NOT NULL,
    assembly_stock_uuid text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE slider.transaction;
       slider         heap    postgres    false    12                       1259    278248    trx_against_stock    TABLE     7  CREATE TABLE slider.trx_against_stock (
    uuid text NOT NULL,
    die_casting_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
 %   DROP TABLE slider.trx_against_stock;
       slider         heap    postgres    false    12                       1259    278254    thread_batch_sequence    SEQUENCE     ~   CREATE SEQUENCE thread.thread_batch_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE thread.thread_batch_sequence;
       thread          postgres    false    13                       1259    278255    batch    TABLE     �  CREATE TABLE thread.batch (
    uuid text NOT NULL,
    id integer DEFAULT nextval('thread.thread_batch_sequence'::regclass) NOT NULL,
    dyeing_operator text,
    reason text,
    category text,
    status text,
    pass_by text,
    shift text,
    dyeing_supervisor text,
    coning_operator text,
    coning_supervisor text,
    coning_machines text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    yarn_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    machine_uuid text,
    lab_created_by text,
    lab_created_at timestamp without time zone,
    lab_updated_at timestamp without time zone,
    yarn_issue_created_by text,
    yarn_issue_created_at timestamp without time zone,
    yarn_issue_updated_at timestamp without time zone,
    is_drying_complete text,
    drying_created_at timestamp without time zone,
    drying_updated_at timestamp without time zone,
    dyeing_created_by text,
    dyeing_created_at timestamp without time zone,
    dyeing_updated_at timestamp without time zone,
    coning_created_by text,
    coning_created_at timestamp without time zone,
    coning_updated_at timestamp without time zone,
    slot integer DEFAULT 0
);
    DROP TABLE thread.batch;
       thread         heap    postgres    false    286    13                        1259    278263    batch_entry    TABLE     Z  CREATE TABLE thread.batch_entry (
    uuid text NOT NULL,
    batch_uuid text,
    order_entry_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    coning_production_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    coning_carton_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    coning_created_at timestamp without time zone,
    coning_updated_at timestamp without time zone,
    transfer_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    transfer_carton_quantity integer DEFAULT 0
);
    DROP TABLE thread.batch_entry;
       thread         heap    postgres    false    13            !           1259    278273    batch_entry_production    TABLE     M  CREATE TABLE thread.batch_entry_production (
    uuid text NOT NULL,
    batch_entry_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    coning_carton_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 *   DROP TABLE thread.batch_entry_production;
       thread         heap    postgres    false    13            "           1259    278278    batch_entry_trx    TABLE     /  CREATE TABLE thread.batch_entry_trx (
    uuid text NOT NULL,
    batch_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    carton_quantity integer DEFAULT 0
);
 #   DROP TABLE thread.batch_entry_trx;
       thread         heap    postgres    false    13            =           1259    279706    thread_challan_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE thread.thread_challan_sequence;
       thread          postgres    false    13            #           1259    278284    challan    TABLE     �  CREATE TABLE thread.challan (
    uuid text NOT NULL,
    order_info_uuid text,
    carton_quantity integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    assign_to text,
    gate_pass integer DEFAULT 0,
    received integer DEFAULT 0,
    id integer DEFAULT nextval('thread.thread_challan_sequence'::regclass)
);
    DROP TABLE thread.challan;
       thread         heap    postgres    false    317    13            $           1259    278291    challan_entry    TABLE     �  CREATE TABLE thread.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    order_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    short_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    reject_quantity numeric(20,4) DEFAULT 0 NOT NULL
);
 !   DROP TABLE thread.challan_entry;
       thread         heap    postgres    false    13            %           1259    278298    count_length    TABLE     �  CREATE TABLE thread.count_length (
    uuid text NOT NULL,
    count text NOT NULL,
    sst text NOT NULL,
    created_by text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    min_weight numeric(20,4),
    max_weight numeric(20,4),
    length numeric NOT NULL,
    price numeric(20,4) NOT NULL,
    cone_per_carton integer DEFAULT 0 NOT NULL
);
     DROP TABLE thread.count_length;
       thread         heap    postgres    false    13            &           1259    278304    dyes_category    TABLE     B  CREATE TABLE thread.dyes_category (
    uuid text NOT NULL,
    name text NOT NULL,
    upto_percentage numeric(20,4) DEFAULT 0 NOT NULL,
    bleaching text,
    id integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 !   DROP TABLE thread.dyes_category;
       thread         heap    postgres    false    13            '           1259    278311    order_entry    TABLE        CREATE TABLE thread.order_entry (
    uuid text NOT NULL,
    order_info_uuid text,
    lab_reference text,
    color text NOT NULL,
    po text,
    style text,
    count_length_uuid text,
    quantity numeric(20,4) NOT NULL,
    company_price numeric(20,4) DEFAULT 0 NOT NULL,
    party_price numeric(20,4) DEFAULT 0 NOT NULL,
    swatch_approval_date timestamp without time zone,
    production_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    bleaching text,
    transfer_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    recipe_uuid text,
    pi numeric(20,4) DEFAULT 0 NOT NULL,
    delivered numeric(20,4) DEFAULT 0 NOT NULL,
    warehouse numeric(20,4) DEFAULT 0 NOT NULL,
    short_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    reject_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    production_quantity_in_kg numeric(20,4) DEFAULT 0 NOT NULL,
    carton_quantity integer DEFAULT 0
);
    DROP TABLE thread.order_entry;
       thread         heap    postgres    false    13            (           1259    278327    thread_order_info_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE thread.thread_order_info_sequence;
       thread          postgres    false    13            )           1259    278328 
   order_info    TABLE       CREATE TABLE thread.order_info (
    uuid text NOT NULL,
    id integer DEFAULT nextval('thread.thread_order_info_sequence'::regclass) NOT NULL,
    party_uuid text,
    marketing_uuid text,
    factory_uuid text,
    merchandiser_uuid text,
    buyer_uuid text,
    is_sample integer DEFAULT 0,
    is_bill integer DEFAULT 0,
    delivery_date timestamp without time zone,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    is_cash integer DEFAULT 0
);
    DROP TABLE thread.order_info;
       thread         heap    postgres    false    296    13            *           1259    278337    programs    TABLE     %  CREATE TABLE thread.programs (
    uuid text NOT NULL,
    dyes_category_uuid text,
    material_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE thread.programs;
       thread         heap    postgres    false    13            +           1259    278343    batch    TABLE     w  CREATE TABLE zipper.batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    batch_status zipper.batch_status DEFAULT 'pending'::zipper.batch_status,
    machine_uuid text,
    slot integer DEFAULT 0,
    received integer DEFAULT 0
);
    DROP TABLE zipper.batch;
       zipper         heap    postgres    false    1038    1038    14            ,           1259    278351    batch_entry    TABLE     n  CREATE TABLE zipper.batch_entry (
    uuid text NOT NULL,
    batch_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    production_quantity numeric(20,4) DEFAULT 0,
    production_quantity_in_kg numeric(20,4) DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sfg_uuid text
);
    DROP TABLE zipper.batch_entry;
       zipper         heap    postgres    false    14            -           1259    278359    batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE zipper.batch_id_seq;
       zipper          postgres    false    299    14            �           0    0    batch_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE zipper.batch_id_seq OWNED BY zipper.batch.id;
          zipper          postgres    false    301            .           1259    278360    batch_production    TABLE     J  CREATE TABLE zipper.batch_production (
    uuid text NOT NULL,
    batch_entry_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    production_quantity_in_kg numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 $   DROP TABLE zipper.batch_production;
       zipper         heap    postgres    false    14            /           1259    278365    dyed_tape_transaction    TABLE     )  CREATE TABLE zipper.dyed_tape_transaction (
    uuid text NOT NULL,
    order_description_uuid text,
    colors text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 )   DROP TABLE zipper.dyed_tape_transaction;
       zipper         heap    postgres    false    14            0           1259    278370     dyed_tape_transaction_from_stock    TABLE     F  CREATE TABLE zipper.dyed_tape_transaction_from_stock (
    uuid text NOT NULL,
    order_description_uuid text,
    trx_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    tape_coil_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 4   DROP TABLE zipper.dyed_tape_transaction_from_stock;
       zipper         heap    postgres    false    14            1           1259    278376    dying_batch    TABLE     �   CREATE TABLE zipper.dying_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    mc_no integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.dying_batch;
       zipper         heap    postgres    false    14            2           1259    278381    dying_batch_entry    TABLE     v  CREATE TABLE zipper.dying_batch_entry (
    uuid text NOT NULL,
    dying_batch_uuid text,
    batch_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    production_quantity numeric(20,4) NOT NULL,
    production_quantity_in_kg numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 %   DROP TABLE zipper.dying_batch_entry;
       zipper         heap    postgres    false    14            3           1259    278386    dying_batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.dying_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE zipper.dying_batch_id_seq;
       zipper          postgres    false    14    305            �           0    0    dying_batch_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE zipper.dying_batch_id_seq OWNED BY zipper.dying_batch.id;
          zipper          postgres    false    307            4           1259    278387 &   material_trx_against_order_description    TABLE     [  CREATE TABLE zipper.material_trx_against_order_description (
    uuid text NOT NULL,
    order_description_uuid text,
    material_uuid text,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 :   DROP TABLE zipper.material_trx_against_order_description;
       zipper         heap    postgres    false    14            5           1259    278392    planning    TABLE     �   CREATE TABLE zipper.planning (
    week text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.planning;
       zipper         heap    postgres    false    14            6           1259    278397    planning_entry    TABLE     �  CREATE TABLE zipper.planning_entry (
    uuid text NOT NULL,
    sfg_uuid text,
    sno_quantity numeric(20,4) DEFAULT 0,
    factory_quantity numeric(20,4) DEFAULT 0,
    production_quantity numeric(20,4) DEFAULT 0,
    batch_production_quantity numeric(20,4) DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    planning_week text,
    sno_remarks text,
    factory_remarks text
);
 "   DROP TABLE zipper.planning_entry;
       zipper         heap    postgres    false    14            7           1259    278406    sfg_production    TABLE     �  CREATE TABLE zipper.sfg_production (
    uuid text NOT NULL,
    sfg_uuid text,
    section text NOT NULL,
    production_quantity_in_kg numeric(20,4) DEFAULT 0,
    production_quantity numeric(20,4) DEFAULT 0,
    wastage numeric(20,4) DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 "   DROP TABLE zipper.sfg_production;
       zipper         heap    postgres    false    14            8           1259    278414    sfg_transaction    TABLE     �  CREATE TABLE zipper.sfg_transaction (
    uuid text NOT NULL,
    trx_from text NOT NULL,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) DEFAULT 0,
    slider_item_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sfg_uuid text,
    trx_quantity_in_kg numeric(20,4) DEFAULT 0 NOT NULL
);
 #   DROP TABLE zipper.sfg_transaction;
       zipper         heap    postgres    false    14            9           1259    278421    tape_coil_production    TABLE     _  CREATE TABLE zipper.tape_coil_production (
    uuid text NOT NULL,
    section text NOT NULL,
    tape_coil_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    wastage numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 (   DROP TABLE zipper.tape_coil_production;
       zipper         heap    postgres    false    14            :           1259    278427    tape_coil_required    TABLE     t  CREATE TABLE zipper.tape_coil_required (
    uuid text NOT NULL,
    end_type_uuid text,
    item_uuid text,
    nylon_stopper_uuid text,
    zipper_number_uuid text,
    top numeric(20,4) NOT NULL,
    bottom numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 &   DROP TABLE zipper.tape_coil_required;
       zipper         heap    postgres    false    14            ;           1259    278432    tape_coil_to_dyeing    TABLE     /  CREATE TABLE zipper.tape_coil_to_dyeing (
    uuid text NOT NULL,
    tape_coil_uuid text,
    order_description_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE zipper.tape_coil_to_dyeing;
       zipper         heap    postgres    false    14            <           1259    278437    tape_trx    TABLE       CREATE TABLE zipper.tape_trx (
    uuid text NOT NULL,
    tape_coil_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    to_section text
);
    DROP TABLE zipper.tape_trx;
       zipper         heap    postgres    false    14            >           1259    279774    v_order_details    VIEW     x	  CREATE VIEW zipper.v_order_details AS
 SELECT order_info.uuid AS order_info_uuid,
    order_info.reference_order_info_uuid,
    concat('Z', to_char(order_info.created_at, 'YY'::text), '-', lpad((order_info.id)::text, 4, '0'::text)) AS order_number,
    concat(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
    op_item.name AS item_name,
    op_nylon_stopper.name AS nylon_stopper_name,
    op_zipper.name AS zipper_number_name,
    op_end.name AS end_type_name,
    op_puller.name AS puller_type_name,
    order_description.uuid AS order_description_uuid,
    order_info.buyer_uuid,
    buyer.name AS buyer_name,
    order_info.party_uuid,
    party.name AS party_name,
    order_info.marketing_uuid,
    marketing.name AS marketing_name,
    order_info.merchandiser_uuid,
    merchandiser.name AS merchandiser_name,
    order_info.factory_uuid,
    factory.name AS factory_name,
    order_info.is_sample,
    order_info.is_bill,
    order_info.is_cash,
    order_info.marketing_priority,
    order_info.factory_priority,
    order_info.status,
    order_info.created_by AS created_by_uuid,
    users.name AS created_by_name,
    order_info.created_at,
    order_info.updated_at,
    order_info.remarks,
    order_description.is_inch
   FROM ((((((((((((zipper.order_info
     LEFT JOIN zipper.order_description ON ((order_description.order_info_uuid = order_info.uuid)))
     LEFT JOIN public.marketing ON ((marketing.uuid = order_info.marketing_uuid)))
     LEFT JOIN public.buyer ON ((buyer.uuid = order_info.buyer_uuid)))
     LEFT JOIN public.merchandiser ON ((merchandiser.uuid = order_info.merchandiser_uuid)))
     LEFT JOIN public.factory ON ((factory.uuid = order_info.factory_uuid)))
     LEFT JOIN hr.users ON ((users.uuid = order_info.created_by)))
     LEFT JOIN public.party ON ((party.uuid = order_info.party_uuid)))
     LEFT JOIN public.properties op_item ON ((op_item.uuid = order_description.item)))
     LEFT JOIN public.properties op_zipper ON ((op_zipper.uuid = order_description.zipper_number)))
     LEFT JOIN public.properties op_end ON ((op_end.uuid = order_description.end_type)))
     LEFT JOIN public.properties op_puller ON ((op_puller.uuid = order_description.puller_type)))
     LEFT JOIN public.properties op_nylon_stopper ON ((op_nylon_stopper.uuid = order_description.nylon_stopper)));
 "   DROP VIEW zipper.v_order_details;
       zipper          postgres    false    248    237    238    238    239    239    240    240    241    241    242    242    243    243    243    245    245    245    245    245    245    245    245    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    237    248    14            _           2604    279805    migrations_details id    DEFAULT     �   ALTER TABLE ONLY drizzle.migrations_details ALTER COLUMN id SET DEFAULT nextval('drizzle.migrations_details_id_seq'::regclass);
 E   ALTER TABLE drizzle.migrations_details ALTER COLUMN id DROP DEFAULT;
       drizzle          postgres    false    252    251            `           2604    279806    info id    DEFAULT     d   ALTER TABLE ONLY lab_dip.info ALTER COLUMN id SET DEFAULT nextval('lab_dip.info_id_seq'::regclass);
 7   ALTER TABLE lab_dip.info ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    257    256            b           2604    279807 	   recipe id    DEFAULT     h   ALTER TABLE ONLY lab_dip.recipe ALTER COLUMN id SET DEFAULT nextval('lab_dip.recipe_id_seq'::regclass);
 9   ALTER TABLE lab_dip.recipe ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    260    258            �           2604    279808    batch id    DEFAULT     d   ALTER TABLE ONLY zipper.batch ALTER COLUMN id SET DEFAULT nextval('zipper.batch_id_seq'::regclass);
 7   ALTER TABLE zipper.batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    301    299            �           2604    279809    dying_batch id    DEFAULT     p   ALTER TABLE ONLY zipper.dying_batch ALTER COLUMN id SET DEFAULT nextval('zipper.dying_batch_id_seq'::regclass);
 =   ALTER TABLE zipper.dying_batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    307    305            =          0    277842    bank 
   TABLE DATA           �   COPY commercial.bank (uuid, name, swift_code, address, policy, created_at, updated_at, remarks, created_by, routing_no) FROM stdin;
 
   commercial          postgres    false    225   �V      ?          0    277848    lc 
   TABLE DATA           �  COPY commercial.lc (uuid, party_uuid, lc_number, lc_date, payment_date, ldbc_fdbc, acceptance_date, maturity_date, commercial_executive, party_bank, production_complete, lc_cancel, handover_date, shipment_date, expiry_date, ud_no, ud_received, at_sight, amd_date, amd_count, problematical, epz, created_by, created_at, updated_at, remarks, id, document_receive_date, is_rtgs, lc_value, is_old_pi, pi_number) FROM stdin;
 
   commercial          postgres    false    227   +Y      A          0    277862    pi_cash 
   TABLE DATA             COPY commercial.pi_cash (uuid, id, lc_uuid, order_info_uuids, marketing_uuid, party_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, is_pi, conversion_rate, receive_amount, created_by, created_at, updated_at, remarks, weight, thread_order_info_uuids) FROM stdin;
 
   commercial          postgres    false    229   HY      B          0    277874    pi_cash_entry 
   TABLE DATA           �   COPY commercial.pi_cash_entry (uuid, pi_cash_uuid, sfg_uuid, pi_cash_quantity, created_at, updated_at, remarks, thread_order_entry_uuid) FROM stdin;
 
   commercial          postgres    false    230   �Z      D          0    277880    challan 
   TABLE DATA           �   COPY delivery.challan (uuid, carton_quantity, assign_to, receive_status, created_by, created_at, updated_at, remarks, id, gate_pass, order_info_uuid) FROM stdin;
    delivery          postgres    false    232   �b      E          0    277888    challan_entry 
   TABLE DATA           q   COPY delivery.challan_entry (uuid, challan_uuid, packing_list_uuid, created_at, updated_at, remarks) FROM stdin;
    delivery          postgres    false    233    c      G          0    277894    packing_list 
   TABLE DATA           �   COPY delivery.packing_list (uuid, carton_size, carton_weight, created_by, created_at, updated_at, remarks, order_info_uuid, id, challan_uuid) FROM stdin;
    delivery          postgres    false    235   c      H          0    277900    packing_list_entry 
   TABLE DATA           �   COPY delivery.packing_list_entry (uuid, packing_list_uuid, sfg_uuid, quantity, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    delivery          postgres    false    236   :c      W          0    278037    migrations_details 
   TABLE DATA           C   COPY drizzle.migrations_details (id, hash, created_at) FROM stdin;
    drizzle          postgres    false    251   Wc      Y          0    278043 
   department 
   TABLE DATA           S   COPY hr.department (uuid, department, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    253   �z      Z          0    278048    designation 
   TABLE DATA           U   COPY hr.designation (uuid, designation, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    254   2}      [          0    278053    policy_and_notice 
   TABLE DATA              COPY hr.policy_and_notice (uuid, type, title, sub_title, url, created_at, updated_at, status, remarks, created_by) FROM stdin;
    hr          postgres    false    255   ��      I          0    277907    users 
   TABLE DATA           �   COPY hr.users (uuid, name, email, pass, designation_uuid, can_access, ext, phone, created_at, updated_at, status, remarks, department_uuid) FROM stdin;
    hr          postgres    false    237   Ȁ      \          0    278058    info 
   TABLE DATA           �   COPY lab_dip.info (uuid, id, name, order_info_uuid, created_by, created_at, updated_at, remarks, lab_status, thread_order_info_uuid) FROM stdin;
    lab_dip          postgres    false    256   C�      ^          0    278065    recipe 
   TABLE DATA           �   COPY lab_dip.recipe (uuid, id, lab_dip_info_uuid, name, approved, created_by, status, created_at, updated_at, remarks, sub_streat, bleaching) FROM stdin;
    lab_dip          postgres    false    258   `�      _          0    278072    recipe_entry 
   TABLE DATA           {   COPY lab_dip.recipe_entry (uuid, recipe_uuid, color, quantity, created_at, updated_at, remarks, material_uuid) FROM stdin;
    lab_dip          postgres    false    259   }�      b          0    278079    shade_recipe 
   TABLE DATA           �   COPY lab_dip.shade_recipe (uuid, id, name, sub_streat, lab_status, created_by, created_at, updated_at, remarks, bleaching) FROM stdin;
    lab_dip          postgres    false    262   ��      c          0    278086    shade_recipe_entry 
   TABLE DATA           �   COPY lab_dip.shade_recipe_entry (uuid, shade_recipe_uuid, material_uuid, quantity, created_at, updated_at, remarks) FROM stdin;
    lab_dip          postgres    false    263   ��      d          0    278091    info 
   TABLE DATA           �   COPY material.info (uuid, section_uuid, type_uuid, name, short_name, unit, threshold, description, created_at, updated_at, remarks, created_by) FROM stdin;
    material          postgres    false    264   Ԛ      e          0    278097    section 
   TABLE DATA           h   COPY material.section (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    265   g�      f          0    278102    stock 
   TABLE DATA           �  COPY material.stock (uuid, material_uuid, stock, tape_making, coil_forming, dying_and_iron, m_gapping, v_gapping, v_teeth_molding, m_teeth_molding, teeth_assembling_and_polishing, m_teeth_cleaning, v_teeth_cleaning, plating_and_iron, m_sealing, v_sealing, n_t_cutting, v_t_cutting, m_stopper, v_stopper, n_stopper, cutting, die_casting, slider_assembly, coloring, remarks, lab_dip, m_qc_and_packing, v_qc_and_packing, n_qc_and_packing, s_qc_and_packing) FROM stdin;
    material          postgres    false    266   \�      g          0    278135    stock_to_sfg 
   TABLE DATA           �   COPY material.stock_to_sfg (uuid, material_uuid, order_entry_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    267   �      h          0    278140    trx 
   TABLE DATA           w   COPY material.trx (uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    268    �      i          0    278145    type 
   TABLE DATA           e   COPY material.type (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    269   �      j          0    278150    used 
   TABLE DATA           �   COPY material.used (uuid, material_uuid, section, used_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    270   ѡ      J          0    277913    buyer 
   TABLE DATA           d   COPY public.buyer (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    238   �      K          0    277918    factory 
   TABLE DATA           v   COPY public.factory (uuid, party_uuid, name, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    239   ��      k          0    278156    machine 
   TABLE DATA           �   COPY public.machine (uuid, name, is_vislon, is_metal, is_nylon, is_sewing_thread, is_bulk, is_sample, min_capacity, max_capacity, water_capacity, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    271   "      L          0    277923 	   marketing 
   TABLE DATA           s   COPY public.marketing (uuid, name, short_name, user_uuid, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    240   �"      M          0    277928    merchandiser 
   TABLE DATA           �   COPY public.merchandiser (uuid, party_uuid, name, email, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    241   /'      N          0    277933    party 
   TABLE DATA           m   COPY public.party (uuid, name, short_name, remarks, created_at, updated_at, created_by, address) FROM stdin;
    public          postgres    false    242   Vx      O          0    277938 
   properties 
   TABLE DATA           y   COPY public.properties (uuid, item_for, type, name, short_name, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    243   X�      l          0    278168    section 
   TABLE DATA           B   COPY public.section (uuid, name, short_name, remarks) FROM stdin;
    public          postgres    false    272   l�      n          0    278174    description 
   TABLE DATA           �   COPY purchase.description (uuid, vendor_uuid, is_local, lc_number, created_by, created_at, updated_at, remarks, id, challan_number) FROM stdin;
    purchase          postgres    false    274   ��      o          0    278180    entry 
   TABLE DATA           �   COPY purchase.entry (uuid, purchase_description_uuid, material_uuid, quantity, price, created_at, updated_at, remarks) FROM stdin;
    purchase          postgres    false    275   ��      p          0    278186    vendor 
   TABLE DATA           �   COPY purchase.vendor (uuid, name, contact_name, email, office_address, contact_number, remarks, created_at, updated_at, created_by) FROM stdin;
    purchase          postgres    false    276   ü      q          0    278191    assembly_stock 
   TABLE DATA           �   COPY slider.assembly_stock (uuid, name, die_casting_body_uuid, die_casting_puller_uuid, die_casting_cap_uuid, die_casting_link_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    277   �      r          0    278198    coloring_transaction 
   TABLE DATA           �   COPY slider.coloring_transaction (uuid, stock_uuid, order_info_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    278   ,�      s          0    278204    die_casting 
   TABLE DATA           �   COPY slider.die_casting (uuid, name, item, zipper_number, end_type, puller_type, logo_type, slider_body_shape, slider_link, quantity, weight, pcs_per_kg, created_at, updated_at, remarks, quantity_in_sa, is_logo_body, is_logo_puller, type) FROM stdin;
    slider          postgres    false    279   I�      t          0    278215    die_casting_production 
   TABLE DATA           �   COPY slider.die_casting_production (uuid, die_casting_uuid, mc_no, cavity_goods, cavity_defect, push, weight, order_description_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    slider          postgres    false    280   f�      u          0    278220    die_casting_to_assembly_stock 
   TABLE DATA           �   COPY slider.die_casting_to_assembly_stock (uuid, assembly_stock_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    281   ��      v          0    278229    die_casting_transaction 
   TABLE DATA           �   COPY slider.die_casting_transaction (uuid, die_casting_uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    282   ��      w          0    278235 
   production 
   TABLE DATA           �   COPY slider.production (uuid, stock_uuid, production_quantity, wastage, section, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    283   ��      P          0    277943    stock 
   TABLE DATA           Q  COPY slider.stock (uuid, order_quantity, body_quantity, cap_quantity, puller_quantity, link_quantity, sa_prod, coloring_stock, coloring_prod, trx_to_finishing, u_top_quantity, h_bottom_quantity, box_pin_quantity, two_way_pin_quantity, created_at, updated_at, remarks, quantity_in_sa, order_description_uuid, finishing_stock) FROM stdin;
    slider          postgres    false    244   ھ      x          0    278242    transaction 
   TABLE DATA           �   COPY slider.transaction (uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, from_section, to_section, assembly_stock_uuid, weight) FROM stdin;
    slider          postgres    false    284   ��      y          0    278248    trx_against_stock 
   TABLE DATA           �   COPY slider.trx_against_stock (uuid, die_casting_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    285   ��      {          0    278255    batch 
   TABLE DATA             COPY thread.batch (uuid, id, dyeing_operator, reason, category, status, pass_by, shift, dyeing_supervisor, coning_operator, coning_supervisor, coning_machines, created_by, created_at, updated_at, remarks, yarn_quantity, machine_uuid, lab_created_by, lab_created_at, lab_updated_at, yarn_issue_created_by, yarn_issue_created_at, yarn_issue_updated_at, is_drying_complete, drying_created_at, drying_updated_at, dyeing_created_by, dyeing_created_at, dyeing_updated_at, coning_created_by, coning_created_at, coning_updated_at, slot) FROM stdin;
    thread          postgres    false    287   �      |          0    278263    batch_entry 
   TABLE DATA           �   COPY thread.batch_entry (uuid, batch_uuid, order_entry_uuid, quantity, coning_production_quantity, coning_carton_quantity, created_at, updated_at, remarks, coning_created_at, coning_updated_at, transfer_quantity, transfer_carton_quantity) FROM stdin;
    thread          postgres    false    288   4�      }          0    278273    batch_entry_production 
   TABLE DATA           �   COPY thread.batch_entry_production (uuid, batch_entry_uuid, production_quantity, coning_carton_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    289   Q�      ~          0    278278    batch_entry_trx 
   TABLE DATA           �   COPY thread.batch_entry_trx (uuid, batch_entry_uuid, quantity, created_by, created_at, updated_at, remarks, carton_quantity) FROM stdin;
    thread          postgres    false    290   n�                0    278284    challan 
   TABLE DATA           �   COPY thread.challan (uuid, order_info_uuid, carton_quantity, created_by, created_at, updated_at, remarks, assign_to, gate_pass, received, id) FROM stdin;
    thread          postgres    false    291   ��      �          0    278291    challan_entry 
   TABLE DATA           �   COPY thread.challan_entry (uuid, challan_uuid, order_entry_uuid, quantity, created_by, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    thread          postgres    false    292   ��      �          0    278298    count_length 
   TABLE DATA           �   COPY thread.count_length (uuid, count, sst, created_by, created_at, updated_at, remarks, min_weight, max_weight, length, price, cone_per_carton) FROM stdin;
    thread          postgres    false    293   ��      �          0    278304    dyes_category 
   TABLE DATA           �   COPY thread.dyes_category (uuid, name, upto_percentage, bleaching, id, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    294   ��      �          0    278311    order_entry 
   TABLE DATA           �  COPY thread.order_entry (uuid, order_info_uuid, lab_reference, color, po, style, count_length_uuid, quantity, company_price, party_price, swatch_approval_date, production_quantity, created_by, created_at, updated_at, remarks, bleaching, transfer_quantity, recipe_uuid, pi, delivered, warehouse, short_quantity, reject_quantity, production_quantity_in_kg, carton_quantity) FROM stdin;
    thread          postgres    false    295   ��      �          0    278328 
   order_info 
   TABLE DATA           �   COPY thread.order_info (uuid, id, party_uuid, marketing_uuid, factory_uuid, merchandiser_uuid, buyer_uuid, is_sample, is_bill, delivery_date, created_by, created_at, updated_at, remarks, is_cash) FROM stdin;
    thread          postgres    false    297   ��      �          0    278337    programs 
   TABLE DATA           �   COPY thread.programs (uuid, dyes_category_uuid, material_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    298   H�      �          0    278343    batch 
   TABLE DATA           �   COPY zipper.batch (uuid, id, created_by, created_at, updated_at, remarks, batch_status, machine_uuid, slot, received) FROM stdin;
    zipper          postgres    false    299   ��      �          0    278351    batch_entry 
   TABLE DATA           �   COPY zipper.batch_entry (uuid, batch_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks, sfg_uuid) FROM stdin;
    zipper          postgres    false    300   ��      �          0    278360    batch_production 
   TABLE DATA           �   COPY zipper.batch_production (uuid, batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    302   �      �          0    278365    dyed_tape_transaction 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction (uuid, order_description_uuid, colors, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    303   %�      �          0    278370     dyed_tape_transaction_from_stock 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction_from_stock (uuid, order_description_uuid, trx_quantity, tape_coil_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    304   B�      �          0    278376    dying_batch 
   TABLE DATA           c   COPY zipper.dying_batch (uuid, id, mc_no, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    305   _�      �          0    278381    dying_batch_entry 
   TABLE DATA           �   COPY zipper.dying_batch_entry (uuid, dying_batch_uuid, batch_entry_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    306   |�      �          0    278387 &   material_trx_against_order_description 
   TABLE DATA           �   COPY zipper.material_trx_against_order_description (uuid, order_description_uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    308   ��      Q          0    277963    order_description 
   TABLE DATA           S  COPY zipper.order_description (uuid, order_info_uuid, item, zipper_number, end_type, lock_type, puller_type, teeth_color, puller_color, special_requirement, hand, coloring_type, is_slider_provided, slider, slider_starting_section_enum, top_stopper, bottom_stopper, logo_type, is_logo_body, is_logo_puller, description, status, created_at, updated_at, remarks, slider_body_shape, slider_link, end_user, garment, light_preference, garments_wash, created_by, garments_remarks, tape_received, tape_transferred, slider_finishing_stock, nylon_stopper, tape_coil_uuid, teeth_type, is_inch) FROM stdin;
    zipper          postgres    false    245   ��      R          0    277975    order_entry 
   TABLE DATA           �   COPY zipper.order_entry (uuid, order_description_uuid, style, color, size, quantity, company_price, party_price, status, swatch_status_enum, swatch_approval_date, created_at, updated_at, remarks, bleaching, is_inch) FROM stdin;
    zipper          postgres    false    246   %�      T          0    277985 
   order_info 
   TABLE DATA           %  COPY zipper.order_info (uuid, id, reference_order_info_uuid, buyer_uuid, party_uuid, marketing_uuid, merchandiser_uuid, factory_uuid, is_sample, is_bill, is_cash, marketing_priority, factory_priority, status, created_by, created_at, updated_at, remarks, conversion_rate, print_in) FROM stdin;
    zipper          postgres    false    248   5�      �          0    278392    planning 
   TABLE DATA           U   COPY zipper.planning (week, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    309   ��      �          0    278397    planning_entry 
   TABLE DATA           �   COPY zipper.planning_entry (uuid, sfg_uuid, sno_quantity, factory_quantity, production_quantity, batch_production_quantity, created_at, updated_at, planning_week, sno_remarks, factory_remarks) FROM stdin;
    zipper          postgres    false    310   
�      U          0    277997    sfg 
   TABLE DATA             COPY zipper.sfg (uuid, order_entry_uuid, recipe_uuid, dying_and_iron_prod, teeth_molding_stock, teeth_molding_prod, teeth_coloring_stock, teeth_coloring_prod, finishing_stock, finishing_prod, coloring_prod, warehouse, delivered, pi, remarks, short_quantity, reject_quantity) FROM stdin;
    zipper          postgres    false    249   '�      �          0    278406    sfg_production 
   TABLE DATA           �   COPY zipper.sfg_production (uuid, sfg_uuid, section, production_quantity_in_kg, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    311   T      �          0    278414    sfg_transaction 
   TABLE DATA           �   COPY zipper.sfg_transaction (uuid, trx_from, trx_to, trx_quantity, slider_item_uuid, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_kg) FROM stdin;
    zipper          postgres    false    312   q      V          0    278015 	   tape_coil 
   TABLE DATA             COPY zipper.tape_coil (uuid, quantity, trx_quantity_in_coil, quantity_in_coil, remarks, item_uuid, zipper_number_uuid, name, raw_per_kg_meter, dyed_per_kg_meter, created_by, created_at, updated_at, is_import, is_reverse, trx_quantity_in_dying, stock_quantity) FROM stdin;
    zipper          postgres    false    250   �      �          0    278421    tape_coil_production 
   TABLE DATA           �   COPY zipper.tape_coil_production (uuid, section, tape_coil_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    313   �      �          0    278427    tape_coil_required 
   TABLE DATA           �   COPY zipper.tape_coil_required (uuid, end_type_uuid, item_uuid, nylon_stopper_uuid, zipper_number_uuid, top, bottom, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    314   �      �          0    278432    tape_coil_to_dyeing 
   TABLE DATA           �   COPY zipper.tape_coil_to_dyeing (uuid, tape_coil_uuid, order_description_uuid, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    315   +      �          0    278437    tape_trx 
   TABLE DATA              COPY zipper.tape_trx (uuid, tape_coil_uuid, trx_quantity, created_by, created_at, updated_at, remarks, to_section) FROM stdin;
    zipper          postgres    false    316   H      �           0    0    lc_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.lc_sequence', 1, true);
       
   commercial          postgres    false    226            �           0    0    pi_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.pi_sequence', 4, true);
       
   commercial          postgres    false    228            �           0    0    challan_sequence    SEQUENCE SET     @   SELECT pg_catalog.setval('delivery.challan_sequence', 1, true);
          delivery          postgres    false    231            �           0    0    packing_list_sequence    SEQUENCE SET     E   SELECT pg_catalog.setval('delivery.packing_list_sequence', 1, true);
          delivery          postgres    false    234            �           0    0    migrations_details_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('drizzle.migrations_details_id_seq', 131, true);
          drizzle          postgres    false    252            �           0    0    info_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('lab_dip.info_id_seq', 1, true);
          lab_dip          postgres    false    257            �           0    0    recipe_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('lab_dip.recipe_id_seq', 1, true);
          lab_dip          postgres    false    260            �           0    0    shade_recipe_sequence    SEQUENCE SET     D   SELECT pg_catalog.setval('lab_dip.shade_recipe_sequence', 1, true);
          lab_dip          postgres    false    261            �           0    0    purchase_description_sequence    SEQUENCE SET     M   SELECT pg_catalog.setval('purchase.purchase_description_sequence', 1, true);
          purchase          postgres    false    273            �           0    0    thread_batch_sequence    SEQUENCE SET     C   SELECT pg_catalog.setval('thread.thread_batch_sequence', 1, true);
          thread          postgres    false    286            �           0    0    thread_challan_sequence    SEQUENCE SET     F   SELECT pg_catalog.setval('thread.thread_challan_sequence', 1, false);
          thread          postgres    false    317            �           0    0    thread_order_info_sequence    SEQUENCE SET     H   SELECT pg_catalog.setval('thread.thread_order_info_sequence', 5, true);
          thread          postgres    false    296            �           0    0    batch_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('zipper.batch_id_seq', 1, true);
          zipper          postgres    false    301            �           0    0    dying_batch_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('zipper.dying_batch_id_seq', 1, false);
          zipper          postgres    false    307            �           0    0    order_info_sequence    SEQUENCE SET     B   SELECT pg_catalog.setval('zipper.order_info_sequence', 15, true);
          zipper          postgres    false    247            �           2606    278453    bank bank_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_pkey;
    
   commercial            postgres    false    225            �           2606    278455 
   lc lc_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_pkey;
    
   commercial            postgres    false    227            �           2606    278457     pi_cash_entry pi_cash_entry_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pkey;
    
   commercial            postgres    false    230            �           2606    278459    pi_cash pi_cash_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_pkey;
    
   commercial            postgres    false    229            �           2606    278461     challan_entry challan_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_pkey;
       delivery            postgres    false    233            �           2606    278463    challan challan_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_pkey;
       delivery            postgres    false    232            �           2606    278465 *   packing_list_entry packing_list_entry_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_pkey;
       delivery            postgres    false    236            �           2606    278467    packing_list packing_list_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_pkey;
       delivery            postgres    false    235                       2606    278469 *   migrations_details migrations_details_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY drizzle.migrations_details
    ADD CONSTRAINT migrations_details_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY drizzle.migrations_details DROP CONSTRAINT migrations_details_pkey;
       drizzle            postgres    false    251                       2606    279721 '   department department_department_unique 
   CONSTRAINT     d   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_department_unique UNIQUE (department);
 M   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_department_unique;
       hr            postgres    false    253                       2606    278471    department department_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_pkey;
       hr            postgres    false    253                       2606    278473    department department_unique 
   CONSTRAINT     Y   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_unique UNIQUE (department);
 B   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_unique;
       hr            postgres    false    253                       2606    279723 *   designation designation_designation_unique 
   CONSTRAINT     h   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_designation_unique UNIQUE (designation);
 P   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_designation_unique;
       hr            postgres    false    254                       2606    278475    designation designation_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_pkey;
       hr            postgres    false    254                       2606    278477    designation designation_unique 
   CONSTRAINT     \   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_unique UNIQUE (designation);
 D   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_unique;
       hr            postgres    false    254                       2606    278479 (   policy_and_notice policy_and_notice_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_pkey;
       hr            postgres    false    255            �           2606    278481    users users_email_unique 
   CONSTRAINT     P   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_email_unique;
       hr            postgres    false    237            �           2606    278483    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_pkey;
       hr            postgres    false    237                       2606    278485    info info_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 9   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_pkey;
       lab_dip            postgres    false    256                       2606    278487    recipe_entry recipe_entry_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_pkey;
       lab_dip            postgres    false    259                       2606    278489    recipe recipe_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (uuid);
 =   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_pkey;
       lab_dip            postgres    false    258            #           2606    278491 *   shade_recipe_entry shade_recipe_entry_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_pkey PRIMARY KEY (uuid);
 U   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_pkey;
       lab_dip            postgres    false    263            !           2606    278493    shade_recipe shade_recipe_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_pkey;
       lab_dip            postgres    false    262            %           2606    278495    info info_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.info DROP CONSTRAINT info_pkey;
       material            postgres    false    264            '           2606    278497    section section_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY material.section DROP CONSTRAINT section_pkey;
       material            postgres    false    265            )           2606    278499    stock stock_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_pkey;
       material            postgres    false    266            +           2606    278501    stock_to_sfg stock_to_sfg_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_pkey;
       material            postgres    false    267            -           2606    278503    trx trx_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_pkey;
       material            postgres    false    268            /           2606    278505    type type_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.type DROP CONSTRAINT type_pkey;
       material            postgres    false    269            1           2606    278507    used used_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.used DROP CONSTRAINT used_pkey;
       material            postgres    false    270            �           2606    278509    buyer buyer_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_name_unique;
       public            postgres    false    238            �           2606    278511    buyer buyer_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_pkey;
       public            postgres    false    238            �           2606    278513    factory factory_name_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_name_unique UNIQUE (name);
 E   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_name_unique;
       public            postgres    false    239            �           2606    278515    factory factory_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_pkey;
       public            postgres    false    239            3           2606    278517    machine machine_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_pkey;
       public            postgres    false    271            �           2606    278519    marketing marketing_name_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_name_unique UNIQUE (name);
 I   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_name_unique;
       public            postgres    false    240            �           2606    278521    marketing marketing_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_pkey;
       public            postgres    false    240            �           2606    278523 %   merchandiser merchandiser_name_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_name_unique UNIQUE (name);
 O   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_name_unique;
       public            postgres    false    241            �           2606    278525    merchandiser merchandiser_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_pkey;
       public            postgres    false    241            �           2606    278527    party party_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.party DROP CONSTRAINT party_name_unique;
       public            postgres    false    242            �           2606    278529    party party_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    242            �           2606    278531    properties properties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY public.properties DROP CONSTRAINT properties_pkey;
       public            postgres    false    243            5           2606    278533    section section_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.section DROP CONSTRAINT section_pkey;
       public            postgres    false    272            7           2606    278535    description description_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_pkey;
       purchase            postgres    false    274            9           2606    278537    entry entry_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_pkey;
       purchase            postgres    false    275            ;           2606    278539    vendor vendor_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_pkey;
       purchase            postgres    false    276            =           2606    278541 "   assembly_stock assembly_stock_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_pkey;
       slider            postgres    false    277            ?           2606    278543 .   coloring_transaction coloring_transaction_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_pkey;
       slider            postgres    false    278            A           2606    278545    die_casting die_casting_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_pkey;
       slider            postgres    false    279            C           2606    278547 2   die_casting_production die_casting_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_pkey;
       slider            postgres    false    280            E           2606    278549 @   die_casting_to_assembly_stock die_casting_to_assembly_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_pkey PRIMARY KEY (uuid);
 j   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_pkey;
       slider            postgres    false    281            G           2606    278551 4   die_casting_transaction die_casting_transaction_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_pkey PRIMARY KEY (uuid);
 ^   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_pkey;
       slider            postgres    false    282            I           2606    278553    production production_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_pkey;
       slider            postgres    false    283            �           2606    278555    stock stock_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_pkey;
       slider            postgres    false    244            K           2606    278557    transaction transaction_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_pkey;
       slider            postgres    false    284            M           2606    278559 (   trx_against_stock trx_against_stock_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_pkey;
       slider            postgres    false    285            Q           2606    278561    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_pkey;
       thread            postgres    false    288            S           2606    278563 2   batch_entry_production batch_entry_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_pkey;
       thread            postgres    false    289            U           2606    278565 $   batch_entry_trx batch_entry_trx_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_pkey;
       thread            postgres    false    290            O           2606    278567    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pkey;
       thread            postgres    false    287            Y           2606    278569     challan_entry challan_entry_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_pkey;
       thread            postgres    false    292            W           2606    278571    challan challan_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_pkey;
       thread            postgres    false    291            [           2606    278573 !   count_length count_length_uuid_pk 
   CONSTRAINT     a   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_uuid_pk PRIMARY KEY (uuid);
 K   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_uuid_pk;
       thread            postgres    false    293            ]           2606    278575     dyes_category dyes_category_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_pkey;
       thread            postgres    false    294            _           2606    278577    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_pkey;
       thread            postgres    false    295            a           2606    278579    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_pkey;
       thread            postgres    false    297            c           2606    278581    programs programs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_pkey;
       thread            postgres    false    298            g           2606    278583    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_pkey;
       zipper            postgres    false    300            e           2606    278585    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_pkey;
       zipper            postgres    false    299            i           2606    278587 &   batch_production batch_production_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_pkey PRIMARY KEY (uuid);
 P   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_pkey;
       zipper            postgres    false    302            m           2606    278589 F   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_pkey PRIMARY KEY (uuid);
 p   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_pkey;
       zipper            postgres    false    304            k           2606    278591 0   dyed_tape_transaction dyed_tape_transaction_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_pkey;
       zipper            postgres    false    303            q           2606    278593 (   dying_batch_entry dying_batch_entry_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_pkey;
       zipper            postgres    false    306            o           2606    278595    dying_batch dying_batch_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.dying_batch
    ADD CONSTRAINT dying_batch_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.dying_batch DROP CONSTRAINT dying_batch_pkey;
       zipper            postgres    false    305            s           2606    278597 R   material_trx_against_order_description material_trx_against_order_description_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_pkey PRIMARY KEY (uuid);
 |   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_pkey;
       zipper            postgres    false    308                       2606    278599 (   order_description order_description_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_pkey;
       zipper            postgres    false    245                       2606    278601    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_pkey;
       zipper            postgres    false    246                       2606    278603    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_pkey;
       zipper            postgres    false    248            w           2606    278605 "   planning_entry planning_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_pkey;
       zipper            postgres    false    310            u           2606    278607    planning planning_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_pkey PRIMARY KEY (week);
 @   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_pkey;
       zipper            postgres    false    309                       2606    278609    sfg sfg_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_pkey;
       zipper            postgres    false    249            y           2606    278611 "   sfg_production sfg_production_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_pkey;
       zipper            postgres    false    311            {           2606    278613 $   sfg_transaction sfg_transaction_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_pkey;
       zipper            postgres    false    312            	           2606    278615    tape_coil tape_coil_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_pkey;
       zipper            postgres    false    250            }           2606    278617 .   tape_coil_production tape_coil_production_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_pkey;
       zipper            postgres    false    313                       2606    278619 *   tape_coil_required tape_coil_required_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_pkey PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_pkey;
       zipper            postgres    false    314            �           2606    278621 ,   tape_coil_to_dyeing tape_coil_to_dyeing_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_pkey;
       zipper            postgres    false    315            �           2606    278623    tape_trx tape_to_coil_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_pkey;
       zipper            postgres    false    316            N           2620    278624 :   pi_cash_entry sfg_after_commercial_pi_entry_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_delete_trigger AFTER DELETE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_delete_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    389    230            O           2620    278625 :   pi_cash_entry sfg_after_commercial_pi_entry_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_insert_trigger AFTER INSERT ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_insert_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    395    230            P           2620    278626 :   pi_cash_entry sfg_after_commercial_pi_entry_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_update_trigger AFTER UPDATE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_update_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    360    230            T           2620    278627 5   challan_entry packing_list_after_challan_entry_delete    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_delete AFTER DELETE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_delete_function();
 P   DROP TRIGGER packing_list_after_challan_entry_delete ON delivery.challan_entry;
       delivery          postgres    false    415    233            U           2620    278628 5   challan_entry packing_list_after_challan_entry_insert    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_insert AFTER INSERT ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_insert_function();
 P   DROP TRIGGER packing_list_after_challan_entry_insert ON delivery.challan_entry;
       delivery          postgres    false    419    233            V           2620    278629 5   challan_entry packing_list_after_challan_entry_update    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_update AFTER UPDATE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_update_function();
 P   DROP TRIGGER packing_list_after_challan_entry_update ON delivery.challan_entry;
       delivery          postgres    false    334    233            Q           2620    279790 /   challan sfg_after_challan_receive_status_delete    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_delete AFTER DELETE ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
 J   DROP TRIGGER sfg_after_challan_receive_status_delete ON delivery.challan;
       delivery          postgres    false    413    232            W           2620    278630 :   packing_list_entry sfg_after_challan_receive_status_delete    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_delete ON delivery.packing_list_entry;
       delivery          postgres    false    236    413            R           2620    279789 /   challan sfg_after_challan_receive_status_insert    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_insert AFTER INSERT ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
 J   DROP TRIGGER sfg_after_challan_receive_status_insert ON delivery.challan;
       delivery          postgres    false    232    371            X           2620    278631 :   packing_list_entry sfg_after_challan_receive_status_insert    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_insert ON delivery.packing_list_entry;
       delivery          postgres    false    236    371            S           2620    279791 /   challan sfg_after_challan_receive_status_update    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_update AFTER UPDATE ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();
 J   DROP TRIGGER sfg_after_challan_receive_status_update ON delivery.challan;
       delivery          postgres    false    232    376            Y           2620    278632 :   packing_list_entry sfg_after_challan_receive_status_update    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_update ON delivery.packing_list_entry;
       delivery          postgres    false    376    236            Z           2620    278633 6   packing_list_entry sfg_after_packing_list_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_delete_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_delete ON delivery.packing_list_entry;
       delivery          postgres    false    236    329            [           2620    278634 6   packing_list_entry sfg_after_packing_list_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_insert_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_insert ON delivery.packing_list_entry;
       delivery          postgres    false    236    421            \           2620    278635 6   packing_list_entry sfg_after_packing_list_entry_update    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_update_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_update ON delivery.packing_list_entry;
       delivery          postgres    false    361    236            _           2620    278636 .   info material_stock_after_material_info_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_delete AFTER DELETE ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_delete();
 I   DROP TRIGGER material_stock_after_material_info_delete ON material.info;
       material          postgres    false    264    352            `           2620    278637 .   info material_stock_after_material_info_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_insert AFTER INSERT ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_insert();
 I   DROP TRIGGER material_stock_after_material_info_insert ON material.info;
       material          postgres    false    264    327            d           2620    278638 ,   trx material_stock_after_material_trx_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_delete AFTER DELETE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_delete();
 G   DROP TRIGGER material_stock_after_material_trx_delete ON material.trx;
       material          postgres    false    268    339            e           2620    278639 ,   trx material_stock_after_material_trx_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_insert AFTER INSERT ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_insert();
 G   DROP TRIGGER material_stock_after_material_trx_insert ON material.trx;
       material          postgres    false    423    268            f           2620    278640 ,   trx material_stock_after_material_trx_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_update AFTER UPDATE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_update();
 G   DROP TRIGGER material_stock_after_material_trx_update ON material.trx;
       material          postgres    false    268    326            g           2620    278641 .   used material_stock_after_material_used_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_delete AFTER DELETE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_delete();
 I   DROP TRIGGER material_stock_after_material_used_delete ON material.used;
       material          postgres    false    270    364            h           2620    278642 .   used material_stock_after_material_used_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_insert AFTER INSERT ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_insert();
 I   DROP TRIGGER material_stock_after_material_used_insert ON material.used;
       material          postgres    false    270    424            i           2620    278643 .   used material_stock_after_material_used_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_update AFTER UPDATE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_update();
 I   DROP TRIGGER material_stock_after_material_used_update ON material.used;
       material          postgres    false    270    403            a           2620    278644 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_delete    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete AFTER DELETE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_delete ON material.stock_to_sfg;
       material          postgres    false    409    267            b           2620    278645 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_insert    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert AFTER INSERT ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_insert ON material.stock_to_sfg;
       material          postgres    false    384    267            c           2620    278646 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_update    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update AFTER UPDATE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_update ON material.stock_to_sfg;
       material          postgres    false    267    343            j           2620    278647 0   entry material_stock_after_purchase_entry_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_delete AFTER DELETE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();
 K   DROP TRIGGER material_stock_after_purchase_entry_delete ON purchase.entry;
       purchase          postgres    false    365    275            k           2620    278648 0   entry material_stock_after_purchase_entry_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_insert AFTER INSERT ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();
 K   DROP TRIGGER material_stock_after_purchase_entry_insert ON purchase.entry;
       purchase          postgres    false    275    397            l           2620    278649 0   entry material_stock_after_purchase_entry_update    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_update AFTER UPDATE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();
 K   DROP TRIGGER material_stock_after_purchase_entry_update ON purchase.entry;
       purchase          postgres    false    275    368            s           2620    278650 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_delete    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete AFTER DELETE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    281    342            t           2620    278651 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_insert    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert AFTER INSERT ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    370    281            u           2620    278652 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_update    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update AFTER UPDATE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    281    353            p           2620    278653 M   die_casting_production slider_die_casting_after_die_casting_production_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_delete AFTER DELETE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_delete ON slider.die_casting_production;
       slider          postgres    false    280    417            q           2620    278654 M   die_casting_production slider_die_casting_after_die_casting_production_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_insert AFTER INSERT ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_insert ON slider.die_casting_production;
       slider          postgres    false    359    280            r           2620    278655 M   die_casting_production slider_die_casting_after_die_casting_production_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_update AFTER UPDATE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_update ON slider.die_casting_production;
       slider          postgres    false    280    332                       2620    278656 C   trx_against_stock slider_die_casting_after_trx_against_stock_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete AFTER DELETE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_delete ON slider.trx_against_stock;
       slider          postgres    false    373    285            �           2620    278657 C   trx_against_stock slider_die_casting_after_trx_against_stock_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert AFTER INSERT ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_insert ON slider.trx_against_stock;
       slider          postgres    false    285    363            �           2620    278658 C   trx_against_stock slider_die_casting_after_trx_against_stock_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_update AFTER UPDATE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_update ON slider.trx_against_stock;
       slider          postgres    false    377    285            m           2620    278659 C   coloring_transaction slider_stock_after_coloring_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_delete AFTER DELETE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_delete ON slider.coloring_transaction;
       slider          postgres    false    278    328            n           2620    278660 C   coloring_transaction slider_stock_after_coloring_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_insert AFTER INSERT ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_insert ON slider.coloring_transaction;
       slider          postgres    false    394    278            o           2620    278661 C   coloring_transaction slider_stock_after_coloring_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_update AFTER UPDATE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_update ON slider.coloring_transaction;
       slider          postgres    false    355    278            v           2620    278662 I   die_casting_transaction slider_stock_after_die_casting_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_delete AFTER DELETE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_delete ON slider.die_casting_transaction;
       slider          postgres    false    375    282            w           2620    278663 I   die_casting_transaction slider_stock_after_die_casting_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_insert AFTER INSERT ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_insert ON slider.die_casting_transaction;
       slider          postgres    false    282    351            x           2620    278664 I   die_casting_transaction slider_stock_after_die_casting_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_update AFTER UPDATE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_update ON slider.die_casting_transaction;
       slider          postgres    false    282    382            y           2620    278665 6   production slider_stock_after_slider_production_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_delete AFTER DELETE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();
 O   DROP TRIGGER slider_stock_after_slider_production_delete ON slider.production;
       slider          postgres    false    283    406            z           2620    278666 6   production slider_stock_after_slider_production_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_insert AFTER INSERT ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();
 O   DROP TRIGGER slider_stock_after_slider_production_insert ON slider.production;
       slider          postgres    false    283    402            {           2620    278667 6   production slider_stock_after_slider_production_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_update AFTER UPDATE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();
 O   DROP TRIGGER slider_stock_after_slider_production_update ON slider.production;
       slider          postgres    false    380    283            |           2620    278668 1   transaction slider_stock_after_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_delete AFTER DELETE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();
 J   DROP TRIGGER slider_stock_after_transaction_delete ON slider.transaction;
       slider          postgres    false    284    400            }           2620    278669 1   transaction slider_stock_after_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_insert AFTER INSERT ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();
 J   DROP TRIGGER slider_stock_after_transaction_insert ON slider.transaction;
       slider          postgres    false    284    408            ~           2620    278670 1   transaction slider_stock_after_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_update AFTER UPDATE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_update();
 J   DROP TRIGGER slider_stock_after_transaction_update ON slider.transaction;
       slider          postgres    false    407    284            �           2620    278671 7   batch order_entry_after_batch_is_drying_update_function    TRIGGER     �   CREATE TRIGGER order_entry_after_batch_is_drying_update_function AFTER UPDATE ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_drying_update();
 P   DROP TRIGGER order_entry_after_batch_is_drying_update_function ON thread.batch;
       thread          postgres    false    333    287            �           2620    278672 7   batch order_entry_after_batch_is_dyeing_update_function    TRIGGER     �   CREATE TRIGGER order_entry_after_batch_is_dyeing_update_function AFTER UPDATE OF is_drying_complete ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();
 P   DROP TRIGGER order_entry_after_batch_is_dyeing_update_function ON thread.batch;
       thread          postgres    false    287    287    372            �           2620    278673 M   batch_entry_production thread_batch_entry_after_batch_entry_production_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_delete AFTER DELETE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_delete ON thread.batch_entry_production;
       thread          postgres    false    392    289            �           2620    278674 M   batch_entry_production thread_batch_entry_after_batch_entry_production_insert    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_insert AFTER INSERT ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_insert ON thread.batch_entry_production;
       thread          postgres    false    354    289            �           2620    278675 M   batch_entry_production thread_batch_entry_after_batch_entry_production_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_update AFTER UPDATE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_update ON thread.batch_entry_production;
       thread          postgres    false    289    358            �           2620    278676 H   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx AFTER INSERT ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
 a   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx ON thread.batch_entry_trx;
       thread          postgres    false    344    290            �           2620    278677 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete AFTER DELETE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete ON thread.batch_entry_trx;
       thread          postgres    false    393    290            �           2620    278678 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update AFTER UPDATE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update ON thread.batch_entry_trx;
       thread          postgres    false    290    396            �           2620    278679 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger AFTER DELETE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_delete_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    303    324            �           2620    278680 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger AFTER INSERT ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_insert_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    348    303            �           2620    278681 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_update_trigger AFTER UPDATE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_update_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    367    303            ]           2620    278682 (   order_entry sfg_after_order_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_delete AFTER DELETE ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();
 A   DROP TRIGGER sfg_after_order_entry_delete ON zipper.order_entry;
       zipper          postgres    false    374    246            ^           2620    278683 (   order_entry sfg_after_order_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_insert AFTER INSERT ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();
 A   DROP TRIGGER sfg_after_order_entry_insert ON zipper.order_entry;
       zipper          postgres    false    349    246            �           2620    278684 6   sfg_production sfg_after_sfg_production_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_delete_trigger AFTER DELETE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_delete_function();
 O   DROP TRIGGER sfg_after_sfg_production_delete_trigger ON zipper.sfg_production;
       zipper          postgres    false    311    381            �           2620    278685 6   sfg_production sfg_after_sfg_production_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_insert_trigger AFTER INSERT ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_insert_function();
 O   DROP TRIGGER sfg_after_sfg_production_insert_trigger ON zipper.sfg_production;
       zipper          postgres    false    350    311            �           2620    278686 6   sfg_production sfg_after_sfg_production_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_update_trigger AFTER UPDATE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_update_function();
 O   DROP TRIGGER sfg_after_sfg_production_update_trigger ON zipper.sfg_production;
       zipper          postgres    false    311    379            �           2620    278687 8   sfg_transaction sfg_after_sfg_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_delete_trigger AFTER DELETE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_delete_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_delete_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    312    369            �           2620    278688 8   sfg_transaction sfg_after_sfg_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_insert_trigger AFTER INSERT ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_insert_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_insert_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    401    312            �           2620    278689 8   sfg_transaction sfg_after_sfg_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_update_trigger AFTER UPDATE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_update_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_update_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    341    312            �           2620    278690 `   material_trx_against_order_description stock_after_material_trx_against_order_description_delete    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_delete AFTER DELETE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_delete ON zipper.material_trx_against_order_description;
       zipper          postgres    false    308    345            �           2620    278691 `   material_trx_against_order_description stock_after_material_trx_against_order_description_insert    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_insert AFTER INSERT ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_insert ON zipper.material_trx_against_order_description;
       zipper          postgres    false    308    411            �           2620    278692 `   material_trx_against_order_description stock_after_material_trx_against_order_description_update    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_update AFTER UPDATE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_update ON zipper.material_trx_against_order_description;
       zipper          postgres    false    308    321            �           2620    278693 9   tape_coil_production tape_coil_after_tape_coil_production    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production AFTER INSERT ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();
 R   DROP TRIGGER tape_coil_after_tape_coil_production ON zipper.tape_coil_production;
       zipper          postgres    false    313    340            �           2620    278694 @   tape_coil_production tape_coil_after_tape_coil_production_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_delete AFTER DELETE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_delete ON zipper.tape_coil_production;
       zipper          postgres    false    336    313            �           2620    278695 @   tape_coil_production tape_coil_after_tape_coil_production_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_update AFTER UPDATE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_update ON zipper.tape_coil_production;
       zipper          postgres    false    313    387            �           2620    278696 .   tape_trx tape_coil_after_tape_trx_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_delete AFTER DELETE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_delete ON zipper.tape_trx;
       zipper          postgres    false    316    412            �           2620    278697 .   tape_trx tape_coil_after_tape_trx_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_insert AFTER INSERT ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_insert ON zipper.tape_trx;
       zipper          postgres    false    390    316            �           2620    278698 .   tape_trx tape_coil_after_tape_trx_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_update AFTER UPDATE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_update ON zipper.tape_trx;
       zipper          postgres    false    410    316            �           2620    278699 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_del    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del AFTER DELETE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    304    414            �           2620    278700 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_ins    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins AFTER INSERT ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    416    304            �           2620    278701 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_upd    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    398    304            �           2620    278702 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_delete AFTER DELETE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();
 M   DROP TRIGGER tape_coil_to_dyeing_after_delete ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    337    315            �           2620    278703 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_insert AFTER INSERT ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
 M   DROP TRIGGER tape_coil_to_dyeing_after_insert ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    315    378            �           2620    278704 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_update AFTER UPDATE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();
 M   DROP TRIGGER tape_coil_to_dyeing_after_update ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    315    420            �           2620    279798 7   batch_entry thread_order_entry_after_batch_entry_delete    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_batch_entry_delete AFTER DELETE ON zipper.batch_entry FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_batch_entry_delete();
 P   DROP TRIGGER thread_order_entry_after_batch_entry_delete ON zipper.batch_entry;
       zipper          postgres    false    391    300            �           2620    279796 7   batch_entry thread_order_entry_after_batch_entry_insert    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_batch_entry_insert AFTER INSERT ON zipper.batch_entry FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_batch_entry_insert();
 P   DROP TRIGGER thread_order_entry_after_batch_entry_insert ON zipper.batch_entry;
       zipper          postgres    false    335    300            �           2620    279804 I   batch_entry thread_order_entry_after_batch_entry_transfer_quantity_delete    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_delete AFTER DELETE ON zipper.batch_entry FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_delete();
 b   DROP TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_delete ON zipper.batch_entry;
       zipper          postgres    false    356    300            �           2620    279802 I   batch_entry thread_order_entry_after_batch_entry_transfer_quantity_insert    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_insert AFTER INSERT ON zipper.batch_entry FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_insert();
 b   DROP TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_insert ON zipper.batch_entry;
       zipper          postgres    false    300    405            �           2620    279803 I   batch_entry thread_order_entry_after_batch_entry_transfer_quantity_update    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_update AFTER UPDATE ON zipper.batch_entry FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_update();
 b   DROP TRIGGER thread_order_entry_after_batch_entry_transfer_quantity_update ON zipper.batch_entry;
       zipper          postgres    false    300    418            �           2620    279797 7   batch_entry thread_order_entry_after_batch_entry_update    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_batch_entry_update AFTER UPDATE ON zipper.batch_entry FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_batch_entry_update();
 P   DROP TRIGGER thread_order_entry_after_batch_entry_update ON zipper.batch_entry;
       zipper          postgres    false    362    300            �           2620    278705 A   batch_production zipper_batch_entry_after_batch_production_delete    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_delete AFTER DELETE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_delete();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_delete ON zipper.batch_production;
       zipper          postgres    false    302    325            �           2620    278706 A   batch_production zipper_batch_entry_after_batch_production_insert    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_insert AFTER INSERT ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_insert();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_insert ON zipper.batch_production;
       zipper          postgres    false    383    302            �           2620    278707 A   batch_production zipper_batch_entry_after_batch_production_update    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_update AFTER UPDATE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_update();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_update ON zipper.batch_production;
       zipper          postgres    false    302    346            �           2606    278708 "   bank bank_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 P   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_created_by_users_uuid_fk;
    
   commercial          postgres    false    5351    225    237            �           2606    278713    lc lc_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_created_by_users_uuid_fk;
    
   commercial          postgres    false    237    227    5351            �           2606    278718    lc lc_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    227    242    5371            �           2606    278723 &   pi_cash pi_cash_bank_uuid_bank_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);
 T   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk;
    
   commercial          postgres    false    225    229    5333            �           2606    278728 (   pi_cash pi_cash_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_created_by_users_uuid_fk;
    
   commercial          postgres    false    229    237    5351            �           2606    278733 8   pi_cash_entry pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);
 f   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk;
    
   commercial          postgres    false    230    5337    229            �           2606    278738 0   pi_cash_entry pi_cash_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk;
    
   commercial          postgres    false    5383    249    230            �           2606    278743 G   pi_cash_entry pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (thread_order_entry_uuid) REFERENCES thread.order_entry(uuid);
 u   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk;
    
   commercial          postgres    false    295    230    5471            �           2606    278748 ,   pi_cash pi_cash_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 Z   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk;
    
   commercial          postgres    false    229    239    5359            �           2606    278753 "   pi_cash pi_cash_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 P   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    5335    229    227            �           2606    278758 0   pi_cash pi_cash_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk;
    
   commercial          postgres    false    229    5363    240            �           2606    278763 6   pi_cash pi_cash_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 d   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk;
    
   commercial          postgres    false    241    5367    229            �           2606    278768 (   pi_cash pi_cash_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    242    229    5371            �           2606    278773 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       delivery          postgres    false    237    232    5351            �           2606    278778 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       delivery          postgres    false    232    5351    237            �           2606    278783 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 d   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    232    233    5341            �           2606    278788 B   challan_entry challan_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 n   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    5345    235    233            �           2606    278793 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 ^   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    232    5381    248            �           2606    278798 6   packing_list packing_list_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 b   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    232    235    5341            �           2606    278803 2   packing_list packing_list_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_created_by_users_uuid_fk;
       delivery          postgres    false    5351    235    237            �           2606    278808 L   packing_list_entry packing_list_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 x   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    5345    236    235            �           2606    278813 :   packing_list_entry packing_list_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 f   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk;
       delivery          postgres    false    5383    236    249            �           2606    278818 <   packing_list packing_list_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 h   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    248    5381    235            �           2606    278823    users hr_user_department    FK CONSTRAINT     ~   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT hr_user_department FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT hr_user_department;
       hr          postgres    false    5391    237    253            �           2606    278828 <   policy_and_notice policy_and_notice_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_created_by_users_uuid_fk;
       hr          postgres    false    255    5351    237            �           2606    279715 .   users users_department_uuid_department_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_department_uuid_department_uuid_fk FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 T   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_department_uuid_department_uuid_fk;
       hr          postgres    false    237    253    5391            �           2606    278833 0   users users_designation_uuid_designation_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_designation_uuid_designation_uuid_fk FOREIGN KEY (designation_uuid) REFERENCES hr.designation(uuid);
 V   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_designation_uuid_designation_uuid_fk;
       hr          postgres    false    237    254    5397            �           2606    278838 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 M   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       lab_dip          postgres    false    5351    237    256            �           2606    278843 ,   info info_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 W   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    256    248    5381            �           2606    278848 3   info info_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 ^   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    297    256    5473            �           2606    278853 &   recipe recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    258    237    5351            �           2606    278858 4   recipe_entry recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    264    259    5413            �           2606    278863 4   recipe_entry recipe_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk;
       lab_dip          postgres    false    5405    259    258            �           2606    278868 ,   recipe recipe_lab_dip_info_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk FOREIGN KEY (lab_dip_info_uuid) REFERENCES lab_dip.info(uuid);
 W   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk;
       lab_dip          postgres    false    256    5403    258            �           2606    278873 2   shade_recipe shade_recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ]   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    237    5351    262            �           2606    278878 @   shade_recipe_entry shade_recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 k   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    5413    264    263            �           2606    278883 L   shade_recipe_entry shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk FOREIGN KEY (shade_recipe_uuid) REFERENCES lab_dip.shade_recipe(uuid);
 w   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk;
       lab_dip          postgres    false    5409    263    262            �           2606    278888 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       material          postgres    false    264    5351    237            �           2606    278893 &   info info_section_uuid_section_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_section_uuid_section_uuid_fk FOREIGN KEY (section_uuid) REFERENCES material.section(uuid);
 R   ALTER TABLE ONLY material.info DROP CONSTRAINT info_section_uuid_section_uuid_fk;
       material          postgres    false    264    5415    265            �           2606    278898     info info_type_uuid_type_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_type_uuid_type_uuid_fk FOREIGN KEY (type_uuid) REFERENCES material.type(uuid);
 L   ALTER TABLE ONLY material.info DROP CONSTRAINT info_type_uuid_type_uuid_fk;
       material          postgres    false    5423    264    269            �           2606    278903 (   section section_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY material.section DROP CONSTRAINT section_created_by_users_uuid_fk;
       material          postgres    false    5351    237    265            �           2606    278908 &   stock stock_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_material_uuid_info_uuid_fk;
       material          postgres    false    266    5413    264            �           2606    278913 2   stock_to_sfg stock_to_sfg_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_created_by_users_uuid_fk;
       material          postgres    false    237    267    5351            �           2606    278918 4   stock_to_sfg stock_to_sfg_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 `   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk;
       material          postgres    false    267    264    5413            �           2606    278923 >   stock_to_sfg stock_to_sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 j   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk;
       material          postgres    false    267    246    5379            �           2606    278928     trx trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_created_by_users_uuid_fk;
       material          postgres    false    5351    268    237            �           2606    278933 "   trx trx_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 N   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_material_uuid_info_uuid_fk;
       material          postgres    false    268    5413    264            �           2606    278938 "   type type_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.type DROP CONSTRAINT type_created_by_users_uuid_fk;
       material          postgres    false    5351    237    269            �           2606    278943 "   used used_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.used DROP CONSTRAINT used_created_by_users_uuid_fk;
       material          postgres    false    237    270    5351            �           2606    278948 $   used used_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 P   ALTER TABLE ONLY material.used DROP CONSTRAINT used_material_uuid_info_uuid_fk;
       material          postgres    false    5413    270    264            �           2606    278953 $   buyer buyer_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_created_by_users_uuid_fk;
       public          postgres    false    238    237    5351            �           2606    278958 (   factory factory_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_created_by_users_uuid_fk;
       public          postgres    false    5351    239    237            �           2606    278963 (   factory factory_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_party_uuid_party_uuid_fk;
       public          postgres    false    242    239    5371            �           2606    278968 (   machine machine_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_created_by_users_uuid_fk;
       public          postgres    false    271    5351    237            �           2606    278973 ,   marketing marketing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_created_by_users_uuid_fk;
       public          postgres    false    5351    237    240            �           2606    278978 +   marketing marketing_user_uuid_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_user_uuid_users_uuid_fk FOREIGN KEY (user_uuid) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_user_uuid_users_uuid_fk;
       public          postgres    false    5351    240    237            �           2606    278983 2   merchandiser merchandiser_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_created_by_users_uuid_fk;
       public          postgres    false    237    5351    241            �           2606    278988 2   merchandiser merchandiser_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_party_uuid_party_uuid_fk;
       public          postgres    false    242    241    5371            �           2606    278993 $   party party_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.party DROP CONSTRAINT party_created_by_users_uuid_fk;
       public          postgres    false    237    242    5351            �           2606    278998 0   description description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_created_by_users_uuid_fk;
       purchase          postgres    false    237    274    5351            �           2606    279003 2   description description_vendor_uuid_vendor_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_vendor_uuid_vendor_uuid_fk FOREIGN KEY (vendor_uuid) REFERENCES purchase.vendor(uuid);
 ^   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_vendor_uuid_vendor_uuid_fk;
       purchase          postgres    false    5435    274    276            �           2606    279008 &   entry entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_material_uuid_info_uuid_fk;
       purchase          postgres    false    264    275    5413            �           2606    279013 9   entry entry_purchase_description_uuid_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_purchase_description_uuid_description_uuid_fk FOREIGN KEY (purchase_description_uuid) REFERENCES purchase.description(uuid);
 e   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_purchase_description_uuid_description_uuid_fk;
       purchase          postgres    false    275    5431    274            �           2606    279018 &   vendor vendor_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_created_by_users_uuid_fk;
       purchase          postgres    false    237    276    5351            �           2606    279023 6   assembly_stock assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    5351    277    237            �           2606    279752 G   assembly_stock assembly_stock_die_casting_body_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_body_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_body_uuid) REFERENCES slider.die_casting(uuid);
 q   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_body_uuid_die_casting_uuid_fk;
       slider          postgres    false    279    5441    277            �           2606    279762 F   assembly_stock assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_cap_uuid) REFERENCES slider.die_casting(uuid);
 p   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk;
       slider          postgres    false    277    5441    279            �           2606    279767 G   assembly_stock assembly_stock_die_casting_link_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_link_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_link_uuid) REFERENCES slider.die_casting(uuid);
 q   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_link_uuid_die_casting_uuid_fk;
       slider          postgres    false    277    279    5441            �           2606    279757 I   assembly_stock assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_puller_uuid) REFERENCES slider.die_casting(uuid);
 s   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk;
       slider          postgres    false    277    279    5441            �           2606    279028 B   coloring_transaction coloring_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_created_by_users_uuid_fk;
       slider          postgres    false    5351    278    237            �           2606    279033 L   coloring_transaction coloring_transaction_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 v   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk;
       slider          postgres    false    5381    278    248            �           2606    279038 B   coloring_transaction coloring_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    5375    278    244            �           2606    279043 3   die_casting die_casting_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 ]   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_end_type_properties_uuid_fk;
       slider          postgres    false    5373    279    243            �           2606    279048 /   die_casting die_casting_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 Y   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_item_properties_uuid_fk;
       slider          postgres    false    243    279    5373            �           2606    279053 4   die_casting die_casting_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 ^   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_logo_type_properties_uuid_fk;
       slider          postgres    false    279    5373    243            �           2606    279058 F   die_casting_production die_casting_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_created_by_users_uuid_fk;
       slider          postgres    false    237    280    5351            �           2606    279063 R   die_casting_production die_casting_production_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 |   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    5441    280    279            �           2606    279068 V   die_casting_production die_casting_production_order_description_uuid_order_description    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_order_description_uuid_order_description FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_order_description_uuid_order_description;
       slider          postgres    false    5377    280    245            �           2606    279073 6   die_casting die_casting_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_type_properties_uuid_fk;
       slider          postgres    false    5373    279    243            �           2606    279078 <   die_casting die_casting_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 f   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk;
       slider          postgres    false    5373    279    243            �           2606    279083 6   die_casting die_casting_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_link_properties_uuid_fk;
       slider          postgres    false    5373    279    243            �           2606    279088 ]   die_casting_to_assembly_stock die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc;
       slider          postgres    false    5437    281    277            �           2606    279093 T   die_casting_to_assembly_stock die_casting_to_assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    5351    281    237            �           2606    279098 H   die_casting_transaction die_casting_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_created_by_users_uuid_fk;
       slider          postgres    false    282    5351    237            �           2606    279103 T   die_casting_transaction die_casting_transaction_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    282    5441    279            �           2606    279108 H   die_casting_transaction die_casting_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    244    282    5375            �           2606    279113 8   die_casting die_casting_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 b   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_zipper_number_properties_uuid_fk;
       slider          postgres    false    5373    279    243            �           2606    279118 .   production production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_created_by_users_uuid_fk;
       slider          postgres    false    5351    283    237            �           2606    279123 .   production production_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_stock_uuid_stock_uuid_fk;
       slider          postgres    false    5375    283    244            �           2606    279128 <   stock stock_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 f   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_order_description_uuid_order_description_uuid_fk;
       slider          postgres    false    5377    244    245            �           2606    279133 B   transaction transaction_assembly_stock_uuid_assembly_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 l   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk;
       slider          postgres    false    5437    284    277                        2606    279138 0   transaction transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_created_by_users_uuid_fk;
       slider          postgres    false    5351    284    237                       2606    279143 0   transaction transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    284    244    5375                       2606    279148 <   trx_against_stock trx_against_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_created_by_users_uuid_fk;
       slider          postgres    false    285    5351    237                       2606    279153 H   trx_against_stock trx_against_stock_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 r   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    285    5441    279                       2606    279158 +   batch batch_coning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_coning_created_by_users_uuid_fk FOREIGN KEY (coning_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_coning_created_by_users_uuid_fk;
       thread          postgres    false    237    287    5351                       2606    279163 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       thread          postgres    false    5351    287    237                       2606    279168 +   batch batch_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_created_by_users_uuid_fk FOREIGN KEY (dyeing_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_created_by_users_uuid_fk;
       thread          postgres    false    5351    287    237                       2606    279173 )   batch batch_dyeing_operator_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_operator_users_uuid_fk FOREIGN KEY (dyeing_operator) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_operator_users_uuid_fk;
       thread          postgres    false    5351    287    237                       2606    279178 +   batch batch_dyeing_supervisor_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_supervisor_users_uuid_fk FOREIGN KEY (dyeing_supervisor) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_supervisor_users_uuid_fk;
       thread          postgres    false    5351    287    237                       2606    279183 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES thread.batch(uuid);
 Z   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       thread          postgres    false    5455    288    287                       2606    279188 <   batch_entry batch_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 f   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    5471    288    295                       2606    279193 R   batch_entry_production batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 |   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    288    289    5457                       2606    279198 F   batch_entry_production batch_entry_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_created_by_users_uuid_fk;
       thread          postgres    false    289    5351    237                       2606    279203 D   batch_entry_trx batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 n   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    288    290    5457                       2606    279208 8   batch_entry_trx batch_entry_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_created_by_users_uuid_fk;
       thread          postgres    false    5351    290    237            	           2606    279213 (   batch batch_lab_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_lab_created_by_users_uuid_fk FOREIGN KEY (lab_created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_lab_created_by_users_uuid_fk;
       thread          postgres    false    5351    287    237            
           2606    279218 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       thread          postgres    false    5427    287    271                       2606    279223 !   batch batch_pass_by_users_uuid_fk    FK CONSTRAINT     ~   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pass_by_users_uuid_fk FOREIGN KEY (pass_by) REFERENCES hr.users(uuid);
 K   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pass_by_users_uuid_fk;
       thread          postgres    false    5351    287    237                       2606    279228 /   batch batch_yarn_issue_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk FOREIGN KEY (yarn_issue_created_by) REFERENCES hr.users(uuid);
 Y   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk;
       thread          postgres    false    5351    287    237                       2606    279233 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       thread          postgres    false    5351    291    237                       2606    279238 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       thread          postgres    false    5351    291    237                       2606    279243 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES thread.challan(uuid);
 b   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       thread          postgres    false    291    292    5463                       2606    279248 4   challan_entry challan_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_created_by_users_uuid_fk;
       thread          postgres    false    292    5351    237                       2606    279253 @   challan_entry challan_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 j   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    295    292    5471                       2606    279258 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 \   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    5473    291    297                       2606    279263 2   count_length count_length_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_created_by_users_uuid_fk;
       thread          postgres    false    5351    293    237                       2606    279268 4   dyes_category dyes_category_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_created_by_users_uuid_fk;
       thread          postgres    false    5351    294    237                       2606    279273 >   order_entry order_entry_count_length_uuid_count_length_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk FOREIGN KEY (count_length_uuid) REFERENCES thread.count_length(uuid);
 h   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk;
       thread          postgres    false    5467    295    293                       2606    279278 0   order_entry order_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_created_by_users_uuid_fk;
       thread          postgres    false    5351    295    237                       2606    279283 :   order_entry order_entry_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 d   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    5473    295    297                       2606    279288 2   order_entry order_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 \   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk;
       thread          postgres    false    5405    295    258                       2606    279293 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       thread          postgres    false    297    5355    238                        2606    279298 .   order_info order_info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_created_by_users_uuid_fk;
       thread          postgres    false    297    5351    237            !           2606    279303 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       thread          postgres    false    239    297    5359            "           2606    279308 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       thread          postgres    false    5363    297    240            #           2606    279313 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       thread          postgres    false    5367    297    241            $           2606    279318 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       thread          postgres    false    5371    297    242            %           2606    279323 *   programs programs_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_created_by_users_uuid_fk;
       thread          postgres    false    5351    298    237            &           2606    279328 :   programs programs_dyes_category_uuid_dyes_category_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk FOREIGN KEY (dyes_category_uuid) REFERENCES thread.dyes_category(uuid);
 d   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk;
       thread          postgres    false    5469    298    294            '           2606    279333 ,   programs programs_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 V   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_material_uuid_info_uuid_fk;
       thread          postgres    false    5413    298    264            (           2606    279338 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       zipper          postgres    false    237    5351    299            *           2606    279343 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES zipper.batch(uuid);
 Z   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       zipper          postgres    false    5477    299    300            +           2606    279348 ,   batch_entry batch_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 V   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    300    5383    249            )           2606    279353 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       zipper          postgres    false    271    299    5427            ,           2606    279358 F   batch_production batch_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 p   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    5479    302    300            -           2606    279363 :   batch_production batch_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 d   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_created_by_users_uuid_fk;
       zipper          postgres    false    5351    302    237            .           2606    279368 D   dyed_tape_transaction dyed_tape_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 n   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    5351    303    237            0           2606    279373 Z   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk;
       zipper          postgres    false    5351    304    237            1           2606    279378 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_order_description_uuid_order_d    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d;
       zipper          postgres    false    5377    304    245            2           2606    279383 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_ FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_;
       zipper          postgres    false    250    5385    304            /           2606    279388 U   dyed_tape_transaction dyed_tape_transaction_order_description_uuid_order_description_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
    ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_;
       zipper          postgres    false    303    5377    245            3           2606    279393 H   dying_batch_entry dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    300    306    5479            4           2606    279398 H   dying_batch_entry dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk FOREIGN KEY (dying_batch_uuid) REFERENCES zipper.dying_batch(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk;
       zipper          postgres    false    5487    306    305            5           2606    279403 f   material_trx_against_order_description material_trx_against_order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk;
       zipper          postgres    false    5351    237    308            6           2606    279408 f   material_trx_against_order_description material_trx_against_order_description_material_uuid_info_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_ FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_;
       zipper          postgres    false    264    308    5413            7           2606    279413 f   material_trx_against_order_description material_trx_against_order_description_order_description_uuid_o    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_order_description_uuid_o FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_order_description_uuid_o;
       zipper          postgres    false    5377    245    308            �           2606    279418 E   order_description order_description_bottom_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_bottom_stopper_properties_uuid_fk FOREIGN KEY (bottom_stopper) REFERENCES public.properties(uuid);
 o   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_bottom_stopper_properties_uuid_fk;
       zipper          postgres    false    5373    243    245            �           2606    279423 D   order_description order_description_coloring_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_coloring_type_properties_uuid_fk FOREIGN KEY (coloring_type) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_coloring_type_properties_uuid_fk;
       zipper          postgres    false    5373    245    243            �           2606    279428 <   order_description order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_created_by_users_uuid_fk;
       zipper          postgres    false    237    5351    245            �           2606    279433 ?   order_description order_description_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_type_properties_uuid_fk;
       zipper          postgres    false    5373    243    245            �           2606    279438 ?   order_description order_description_end_user_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_user_properties_uuid_fk FOREIGN KEY (end_user) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_user_properties_uuid_fk;
       zipper          postgres    false    5373    243    245            �           2606    279443 ;   order_description order_description_hand_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_hand_properties_uuid_fk FOREIGN KEY (hand) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_hand_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279448 ;   order_description order_description_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_item_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279453 G   order_description order_description_light_preference_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_light_preference_properties_uuid_fk FOREIGN KEY (light_preference) REFERENCES public.properties(uuid);
 q   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_light_preference_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279458 @   order_description order_description_lock_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_lock_type_properties_uuid_fk FOREIGN KEY (lock_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_lock_type_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279463 @   order_description order_description_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_logo_type_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279468 D   order_description order_description_nylon_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_nylon_stopper_properties_uuid_fk;
       zipper          postgres    false    245    5373    243            �           2606    279473 F   order_description order_description_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 p   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk;
       zipper          postgres    false    248    245    5381            �           2606    279478 C   order_description order_description_puller_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_color_properties_uuid_fk FOREIGN KEY (puller_color) REFERENCES public.properties(uuid);
 m   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_color_properties_uuid_fk;
       zipper          postgres    false    243    5373    245            �           2606    279483 B   order_description order_description_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_type_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279488 H   order_description order_description_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_body_shape_properties_uuid_fk;
       zipper          postgres    false    5373    245    243            �           2606    279493 B   order_description order_description_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_link_properties_uuid_fk;
       zipper          postgres    false    245    5373    243            �           2606    279498 =   order_description order_description_slider_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_properties_uuid_fk FOREIGN KEY (slider) REFERENCES public.properties(uuid);
 g   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_properties_uuid_fk;
       zipper          postgres    false    5373    245    243            �           2606    279503 D   order_description order_description_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    245    5385    250            �           2606    279508 B   order_description order_description_teeth_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_color_properties_uuid_fk FOREIGN KEY (teeth_color) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_color_properties_uuid_fk;
       zipper          postgres    false    245    5373    243            �           2606    279513 A   order_description order_description_teeth_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_type_properties_uuid_fk FOREIGN KEY (teeth_type) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_type_properties_uuid_fk;
       zipper          postgres    false    243    245    5373            �           2606    279518 B   order_description order_description_top_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_top_stopper_properties_uuid_fk FOREIGN KEY (top_stopper) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_top_stopper_properties_uuid_fk;
       zipper          postgres    false    5373    245    243            �           2606    279523 D   order_description order_description_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_zipper_number_properties_uuid_fk;
       zipper          postgres    false    245    5373    243            �           2606    279528 H   order_entry order_entry_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 r   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk;
       zipper          postgres    false    5377    246    245            �           2606    279533 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       zipper          postgres    false    248    238    5355            �           2606    279538 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       zipper          postgres    false    5359    248    239            �           2606    279543 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       zipper          postgres    false    248    240    5363            �           2606    279548 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       zipper          postgres    false    248    5367    241            �           2606    279553 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       zipper          postgres    false    242    248    5371            8           2606    279558 *   planning planning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_created_by_users_uuid_fk;
       zipper          postgres    false    237    309    5351            9           2606    279563 <   planning_entry planning_entry_planning_week_planning_week_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_planning_week_planning_week_fk FOREIGN KEY (planning_week) REFERENCES zipper.planning(week);
 f   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_planning_week_planning_week_fk;
       zipper          postgres    false    5493    309    310            :           2606    279568 2   planning_entry planning_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    5383    310    249            �           2606    279573 ,   sfg sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 V   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk;
       zipper          postgres    false    249    246    5379            ;           2606    279578 6   sfg_production sfg_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_created_by_users_uuid_fk;
       zipper          postgres    false    5351    237    311            <           2606    279583 2   sfg_production sfg_production_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    311    5383    249            �           2606    279588 "   sfg sfg_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 L   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk;
       zipper          postgres    false    249    5405    258            =           2606    279593 8   sfg_transaction sfg_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    312    5351    237            >           2606    279598 4   sfg_transaction sfg_transaction_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    249    312    5383            ?           2606    279603 >   sfg_transaction sfg_transaction_slider_item_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk FOREIGN KEY (slider_item_uuid) REFERENCES slider.stock(uuid);
 h   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk;
       zipper          postgres    false    5375    312    244            �           2606    279608 ,   tape_coil tape_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_created_by_users_uuid_fk;
       zipper          postgres    false    237    5351    250            �           2606    279613 0   tape_coil tape_coil_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 Z   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_item_uuid_properties_uuid_fk;
       zipper          postgres    false    5373    250    243            @           2606    279618 B   tape_coil_production tape_coil_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_created_by_users_uuid_fk;
       zipper          postgres    false    237    313    5351            A           2606    279623 J   tape_coil_production tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 t   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    313    250    5385            B           2606    279628 >   tape_coil_required tape_coil_required_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 h   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_created_by_users_uuid_fk;
       zipper          postgres    false    314    237    5351            C           2606    279633 F   tape_coil_required tape_coil_required_end_type_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk FOREIGN KEY (end_type_uuid) REFERENCES public.properties(uuid);
 p   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk;
       zipper          postgres    false    243    314    5373            D           2606    279638 B   tape_coil_required tape_coil_required_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk;
       zipper          postgres    false    314    243    5373            E           2606    279643 K   tape_coil_required tape_coil_required_nylon_stopper_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk FOREIGN KEY (nylon_stopper_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk;
       zipper          postgres    false    314    243    5373            F           2606    279648 K   tape_coil_required tape_coil_required_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    243    314    5373            G           2606    279653 @   tape_coil_to_dyeing tape_coil_to_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 j   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk;
       zipper          postgres    false    315    237    5351            H           2606    279658 S   tape_coil_to_dyeing tape_coil_to_dyeing_order_description_uuid_order_description_uu    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 }   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu;
       zipper          postgres    false    315    245    5377            I           2606    279663 H   tape_coil_to_dyeing tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 r   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    315    5385    250            �           2606    279668 9   tape_coil tape_coil_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 c   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    250    5373    243            J           2606    279673 .   tape_trx tape_to_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_created_by_users_uuid_fk;
       zipper          postgres    false    316    5351    237            K           2606    279678 6   tape_trx tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 `   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    316    5385    250            L           2606    279683 *   tape_trx tape_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_created_by_users_uuid_fk;
       zipper          postgres    false    316    5351    237            M           2606    279688 2   tape_trx tape_trx_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 \   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    316    250    5385            =   b  x�]S�r�0=��C''��4�s�Ʃ3I�N3��LFa4�J���������.��]=��k�u;����,u&�@�q&�#L&a8�"ߙF�2���&q���]XDQ��e�p=�$Z� Z��]��]<�A2��GHV��\��Cp���+gIv�z�R�V�d]Rx�����^w�!#;�m
��B�B��f0�v�8�FMa[���-+K,jXSHOiE3`
tAAԔS��v�1%%�DD�o�'�;Y/L�à�)ȥ�쬡�T"7ܷ�3K"5#%*�����t#���������������=W�$�����Y�l��Qi;4����>����k¾ڻ�!Ҧ�2�PS�DD���"�l��	�)IFUa���@Y��-I�&jzb*�%�T4�H��=!֖9[�Js[���Y5'܇�*{��K�[�(�0�ȍO��s�6�wh�5
��l� K)PUEPd+
C$KtO����2IS���"����"kR�]X&�h���W�X*���م�ɿ+�m�ɷ�&�7��n$�;Ծd�]�a6������cn��Ͻ�y�����}��6����}w�b�(H^��m�x�����{o�^�/P�W
      ?      x������ � �      A   �  x�m��n�0���S��ods�1���B�]��i!O?$��(�ڲ���O��yW�$�k:]�@�m�fG~���F�2��:v��-��3Z�Z�8R�[vq>sC*T�)uŉM����h/������<�zF�/�d� "�d<��h\Gz2o>���)�/@��="��%���)'����	/�����EK��[`�R;�F��y�*�E;��Qs�����%�\���ӳP��,wA�qm�g/�U��נ��dw\���Q�������+�N6nF�E���J��Xz30�+0����^؈ۋ��.Яw�����\=��|�1حO����
�B9�ʹĵ���P�/+`�h�l����:��k�mct�:OUtUݰ2#��w�9�2�����m:�L~��      B   �  x����γJ�5�U��9|;����`@gc�`��d�~|4���E[^?���z���h�O�Ӱ(��E�GR--^<RU#�i'�̭�y�����F�?Gq�/�e���?$��q�����|e8�ZKRq�n��ʧCo���e��B�h�
3�67�	b�J����֯^X..�r�����U����Vd=�T��:����b����6�|`︘Z�nd�>�嗥pvk6�c(�L��� �P���	�(S�H
�M��^�/���Q�����"�y�H������F_q��t��Rՠ�6��q�|[+������UW� �.��o:�)�T�l�[��20��ٔ��b�*�C���Q��;^��Iy�Q�AI�<�#��H�7jZ��Gr��&^׿��`X�YΉ[w�Ɣ ��7}��oAG��S ����ϗ봊k�I5Xm��]t�N}x�LuaG\�����N9C��Gl��m(��p*Dp�d X%6��}-}�ו��'�����F����)6JvY�hTw��4��S�3��J�EI=��P�%2O\,�\V��x,I�T�Iϰf*>�ִ���&��<C� T�>og�ہ����0v�T���7�C�����F��R��S��Z Ú��_�&�&���[Q�0g>�%'����[|��c��n��'AͮI�򦮌v�!43ZU��y�5V��'�ş�,`l�^V����օ-���`���C��w�Dˍʹ)Q�a!&����R���L��ܖQ����������뤢ntآ������X�+�['�%mk�[m������7�T�ޣ�Q�*���:������A�=�l7��
�Ka��=o��ju�nF�����6d�}8<k3��@~<���\�3��\�|Z?5�o\ɕB��t��A����9��N4NHyz�N@MK�5�S59�d���^�**y$�����=� ���Ԙ�.}O|N!4*�_�<�=��is��xZI�!	�ΈΠ��k���;\���� �_IT���cɮ��[Ă�
��Z�,^A�} 5�r8ս5��Y��2�+*�T�
.xP+D����C_{�7a[.@5�G�n�6���=@��f���f�-����R���z�5��
�/=�#���8wZ�_�C@=�L~�b�҇��l�$�O��w��|#�n����Iϛj��C ��~^���6���a�j��j�o��05%̀�M���ݝ�n����5�9�s9�ZM���(����t�}�t�^=U+K ����*4�,�1*߯�_�@�N����������i����f*�z@����|��B� (���N������k��16�϶��[
�n�)���Fy����U�%?`��u�I��ZS{��꠹�+dd����=�-�0����F�}��w^y��*�,��׵ƈ�w U������D�I�����:�]J��m��	f6�c>�EY�dA!3�̸����	1���w�m��]O}c"d�]�W�Q٭�2�_���!������y�-�>e��Y�	Y�����
ЛdB�e���G� (͆�[~?�N�;T�����˶�%{=10O�.���y{��(ӯ=eL[1K�c�,U�:,F;���������<�X��S��ϧ�;�g�]�C�ܮ.�/�B)��z�b���ٽ�A��^��4�]�}��wS���Yz�+���j�j��}uJ_gl�p��4a=_�D����B+oU	CZ�N�}��a-վ΋�z�I�꾖��?�(�*	�TR	�7�Q`%�-h�BY���S.��0�� �OꐊR͍����
��B7gB�z���@]R��qe�o�A�G��8� �9d�H4õOYP���Sz
�'�
8��p;�&~V�t�P�B5�9�ir��Bl)�u�$fE;�[�$p�V�#��.�PA� T��ַ����5�P���*�a��xp%`�'I�[N�~%��������t��      D      x������ � �      E      x������ � �      G      x������ � �      H      x������ � �      W      x�=�Y�$+E���!���a���QDd�uW��A��x�G�J��^���F:늯�NK��l}�u�)֓�1s�2��5�z���y���GL�X�{��\�:��}��&j7�>;�R�]�m����m�bg�Q?UZkՋ���\��i�N���ʙ��d�Cg/��^�(�[����.?ѩ�}|
��"V�����6v�V�������;��Қ�����!�vV�{�9��ö?-i-]�������6&Y=J$g_1��9����I�픑2?��K*����+�ܲ���g8͟��R�W}nk�j���4t�5���;i���FK���_��k��^{������8��Es�(���ї�cV_�v�F�9��9��7?�-�K(Z���4�G s�vm>�,2'�t���lf>��s��
$n4AogϿ�=G+���Fɖ
�_c� �����h�w��){M�ҩ�5����ZXU]%
�M�8�7��I�lKo���vZ{�$i �=r|�R��J:V������*zKE%����r��4�U�`���t���]6�X��rv>]���_��h�W1{}syz�)�3}z��mz 8� �RR[�^�d[i[���m4�rp��ȿ�5�^�,ϩ�4�4�%�k��*�vҜ>l��y��)���mj^U��a�ǿ�-5���	b�|�䤽�,@�#�R���c���T�6�� �Cov��ZSnkԇC���p�s��7�ơiu[>wr0�3U�-�:�-��h�#v{s{X����2aKj�'C͸F��UfY,~�'�~��r.��Y��V���������D1��ɮ�E�SO��&0�bTN~ng̀?�`D $�]{�ebr��5�4���,�S<�K����M�V5��8��g���s�o�A3Lay�?B�٤1��Ȧ
���i�c��Uꨧ�#��y�9�t|��O�UԜ�ܝ ���}�2G����a�|Wʧ ���͘��j�	t��蟊�q�]ߒ��/TY�d�z���O9���D���?����J�şu�n�-�a!�N���n��3�[�����z}^��=��Uy����ؽ�[գ����Sh!(�&��Z�Ƹ�%�T9�of~�-u��d��r�x�U�Ϯ�c}V:SD�܅�ѐ�'�;s���0�l (��3�4�aW�E�[��'���1���aEc18Ɣ���)�P���RwamC����Ѷ��\O���`�l)��=L��٧QC�jKkU���<�#MH�BX�s=-�uO��;k5zl�R��Y�\��9C�􅢏��>TC�Fc��Ԛ�o2���Ul���φ��̨��'�<o��`h6�Ԁ�B�K@Aw-Yo��Zߊ�d�ǟ�W��FX�������E�v�-X��r��qp��A=9�=ӯ"l��3����Nk#NL�����9�� =���p�<

����u�)XB�J~0[NI~K0F��wL�B���W��K=�C�3�]�U귏�îkz!#<�_�.�ey���ZuI��[���F
^��AG��3i��+S�z�h�hW���+.j��`2_/3����s�(���_Ŏ���_��.�\�����ٱՂda;S�7��r�"O�fH0�	9�L�lP������&ZQ$߹����P,\�pl�m�΋ca�8�r��9���U�R��c{Bb8ܭa����`���|�-kXAK����s����U��X�3�6��@2��'7�������AqZ]X6\Ӈs���vj?���$z���c��1<L�7�VǔU��cF`j�,`�/����e�����%r�?f��)=1cơjӃKf�#W��k�����������f�����Y����_,w2S��j�a�nt�i[�S8�΃�V,8��5?D���r<g��u�\w(aa�|Q�����:�~bj�V,h��[˃��#�Q� �ź�8m�����c����x2Ft�N��m&����n�S��!��_-��F�;cc�?jTW��l10�@t.�#zlz �_����Z�������Yl"y�[m9CAP�B5�7��7�Ό�G}��<s�a�ߪϾ��r����=���q+�IF�����
��%���_E4C���d$�H"�'�MH	�y^�'pY�]]8�3��c�q=W�*B��j���1�l�g��`2��G�`�2$(T2��/ |��T����'T��AX>�.�A`x$���|�5l�B1%��������O�*Z�#�!�8��UN�~E�q-����	���o\2҈3�R �x��X%�z�<�N�H��
��5a.	8�p�'-,#�3��;җ����У��j~z�Xq��*����g���Nar����Q�Xs@�n���ߙ�$a�(�r������@�sT�ɌHQ2�MVE"/�����M'�+�op��M�u*�3#����z�݀�O��(L�>�(��m��CX.ޯ �z,�^"�+2I� -�~��X�@o8��7�F�^Y��>q��Ø7�3��1��Z���#��*�����}㪘	�a!��4�a9%�|��PC]�u~FN�����}H8���$�0��u`^ȉn���g�(��L8:���w
+Y<$�]�3�h�m��t���;p��� A,b�+܍���}0�~+���q\��g2)?�P l�7�$=���bg�3t�<y��}R��4�~��`s����̉��!6�6����/bu���u3#��:i�W��Y'B���� �%�]1�8��GX����vZXA����Ed>���Fd�䟸��=�����7��J��+�=���rK�e�%UpĄ�Is�cpڷ"�9�����i��X!
%�\:d�	\+�)�hX\  ��C���k��s��O�����/&c�Z?!�^�[;�$���nߊ)f�!BX�֌��G���U����O�j�a���k�3��MN��ՆW$��=ޛ�P���`�-a��LH<'�O�$ݒ1��l>.6}�Q/�r�,�$ws4�Ȁ�lam�_a�H���E%��Sxi���m���&�X��
�J�Ģ�kHN����5���3��%�%��L֕SÊ�0-K��Yp�k�
��:�b���a�n�lu�o�n{��m�Y�d���f��%�X�<S��^ ��9h�m(n�W�Sg
1k����ʐ���$�@�	k�aCu����T,L���q�8q2��S�l��0�%�^w��d �4r%��{����<����C�lp2���L�b����˅D0� vƵ31�|�p8FYi��1w"��v���󫨟۽���.e��E!�T��;�@R��EfZ��@C����]K
Op{M�>j�If�p��q��MT�x�1�`���Q>�`��L����,�dR�XAO�8	��Nf�h5���C�(n���l[x�z&��὘n�����q{�>ZK��y�
8����x5�f%��I��[%gV؃�V�س���q��t�4���iln8��_��+��d�9$�1E@b�J���`e`1]qY�"μ�	YB�/����i#�lf��C�^�r�(!�誱��w ���jǇ[�Bz�M
�w��(����:YY2���n�����GC�>�E�!<$N�q�D1���>��H�	@, �sG���;�0�I� ���3q��ك.ގ7�;�f��CE�7�L���%��fFK��Ж�<�"#�o�iL*N�~�!~�<D��h@�d2;1K	�V�4|���R��x�6�覿�!°YGg@A�K��Vc����#f����*�!a�q����Y�庿]ׂ�k���cqO9�*��48}���_`�6fDNd�d�l���w�ׯ"Ύm���p�q�!.�Ӧ��BGW�om	���A���yl��G�7��z�̮����.��j�UA�����JY��L�ؓ.����R��؂"���C��mw���V�ߘ�퉇fP��qϊ����Z�	 �l 8�C�'(�8�7).[��\�`as����Jx祽��#>5̀�h����7����L�m�{�D��b@������H6p��2s��Ղb�7��V�������zy��q���M����q�I Q  [�� �aJ�W��Y1]d�4���~g�4>��YēQ��+d�f�3��G�.�l�t�������)P�pd��of,gX�̅YC/q�x����"a��%DV�k<΋� ^2*�)�ү�F��B5��0��z�	ESМ`�
���1�)':*ȡ'�5q�[�����=7���d$5�������Y@��?��2E��>�W���U,�����\X`y�������F�p��*و%���3��)��[�_�x-��d`\2Վ�P�kg	,��#��0bʹ90�|�j��)"�aH���q���
��	�ɞ"�|����	y��JJds��.`�OE�����7�2X�E$���'$8�&�p����� ,&?e�c�.nl}!��@������6� \��d9Ƹ�V<�>�&����B7.���c�*O���h���vѬ',�g-���irXz@2-W&��?X��N���;�O��I�$���Y+%������q���ƦMB!��0�7s�/$�t��9����$��a��5.+$^Ņ���ղ��2膿�#�"�d�"�3�p)"O�w|�+�q�(@�|�,��<Jʏ��L4[�� �`�z�F���|�d[�O|@�܎���Ir������G��n�Cw|r�	���Ӆ�ixg��Y�2�-)�W�� �=Ò��O4���Js9�z��A����n�M��c�����%��D�FIb1n8�	3`���|7]x+}*	 �T�@+�1��K�م����?�:�-����y�h�pw�%Κ���B@���(I���Y��Vg�9.`�㐍<���$XN$]I�\ص��BhG�_#��J2����d�_ܱ�Ąѱ�7^q�񾻇���0|�>�#^Q��A�X���;�$��N���vD�bS��k�����}���Pu������
�4���۸#�;%�!��8U�\���(9����O@5F�
 �6]��8��Kq�� d�dzM���;)$�6�)��v��n�B��U�)4.���$�LC���cփ��aa!:�Q�*2$�)���j�/���ﳠ<q�W����-N<^�c��!#^��JO{���n��N���m�=n	a���ʘ��/.�)�Mj�=g�/!Q�kaw�D	�b�ehkblᆖwaUؿ$v�%�ҒT " ����O�r�/>lP�^s\<|@�����
}�G �d����d|���A,�Qn�	�T�Exi�5+�+ֵ� �E�o|�c��G@�7+�$�U)ox�w'��H��>h�صԓH$p�).��x�ct +��������|Y2�<�rğ_�8t�O/F|HZY��	�Ӑ�y���!���ς�9��7K�P\��u�e�z�듯H��!
UN�Tv뿍��r\�QR�������݊ ��۠\+����D(�7>;t�v�i��)	<Ps@o��{�������`	���}��~�m��\:;�"E�����"d����Ԓ3���IB��u�B���S=���e�m�D�-Jδ~�)�X�`�.��L����Qm\dǫ���!&�ᔺ}���	�2���"���_%�I'^�°�F��/�a�ϛg���>���m��XQ������SR#��O*7���;O!�h		Þ�����D<�EO�_@���-�)y���Ը��9lĀ̄��z�t&$�3@)@q�.V���]�?��/.i9CE#�?9&�3��Q��V�k?�#H%��ܠ.����`Ÿ�	G!��o�)	���m�M�+8�e�����v�uvI���]�7Fn:�CJ��:.K,�׽������r@g2      Y   e  x���Ks�@F���`9Yd����	�`�7�+��ڑ�4��&�1���*V�9�{?���ơ���d-�sP2Q�r�[(KH!�F��G���K�t��0]ٌU�����X	�Q���L�O�<؉ �}�FPB:A�`x������.}�o}��Y���XB*Q5��#�JV0��;U� g4�d�&A��m"wN��-_�����Fv�-`fI���ZR)�����׹+0�/״���$~	荨��6.��%������b73�`]���CV^7��I'�x�̆#��FU�����o�O'J�������o���+���;ᴿ81�Xq)�j'!s\<̠u��ĩ���k�.��1ֻG�Ʃ���rj ��|Ǌ�ZQ�1J+Åi荩y8�`4:���6c�����w]o7|�ԓ �Yz�ۇ��-�x�l�Q���ze���J2k�d����|,a��Y������ZeE�SZ�Q%����M�7�И	��FҐkV�wz~T�����- �"�u�꽙b=콹��J�U�ڗ~x~s������~�"�k�
tgHhG��#ʛsף�z��(����(�|�������b��{j�?[��o�3      Z   i  x���Kw�H����`5��4�c�4>����ot*`x��~%�$&3s��U]o�*�B�c}��d@q� "�J�cX^�D���S�u`A/��q
%���f��F�� "$ygYȰ��B��nl�*�j�QguX��S;��τ����!�����>si_-Ǯ7^�ŧ爿�C��n�d����ՙA�|V��h'��Y^9>@�a	r��q�ϛ���|O+��i��|��D��5P�9�k�� x)���f&�����p!� �|+ ��t׍ԑ�v�j�����B��]Tt��J'��憎X�p�'�� |�P����{��������w7=�)���ۗ�"6�FT?O�)�)�IA�1$Q��RNf��R�"��W~B�pw:�6)��X���{�`{�<;���;^^I���+W,N;]{�i`&z3��#[��S�W��b�>ߔ�'��Q;�nǑYJԏS:�`�ؗ��������	P��n�Pj�'n�_�Zc�ۆsH�e���),(_�ڼf���x>̤H�V�{,{`Dl���]������F7#�������L��ev���g����9��pY�#���]��6$t������a}P�=ɂ�����P�FUj���և�)@q�8�����iU|���7�kn�-a��z�<,�u�?7����I���m��;+obu���X^��h��%�&�K��R�Y�a�6��)��A�\����?P�>�g��h��eq�S�r��վx|��4,׻���s84�K�ܔ����w[���|1l���Q]�<��΂8J����d�
3�F3�%S��e�g|o�����s,d��S��k�~� u��S��?��N�o4�      [      x������ � �      I      x��]Ys�Ȳ~f~���č{"fdv��څ6���p�	���"�n��~A���a�{�{�,�BYU_VV��df5Զ@
�U�a�[Lblk	��ǿG���9�?P���P��5v�_%��Xnc2�n�ǒ�޾BUG�<Yuj�n�(�^�@�р��F�LV�#���hrh*�h_���K��ڗ���4=x~��(k5��٭H����O~���˵����ն����;�|-�"��*���#�s���%ϲm��׍>+�ye�����M�8�����K=���(H�AwA�|�_��r�^9
%N_p�O���Z�,�(I��)���mp)��W���DeI�׃���ƌΖ�g���������"u���cxFSJ�nP���
N&�����$]�����P}�)���(�J�R��]��X0�^(29{Y����T�<k<2�V���������
T/v�g[w��,Iz�v���A^j�n�[�ѻ��������v9�칝/��lgr�~��Z,5����|J�[e�W6�uk�?����u]QFޭ�l�H��-�����8�
���f�"��;ɲ�2 ٣$S.�u>Cm+����뼟�k��,���A���L[�m����>��Ֆ�k�R����@�|�n�THJ�a�����<����ZU�eC��L~�ɴ�|wR��Rr��DQz��y����ݻE9�%���ߞ�$�yOʮ)ޕ�o$G�8�}(||��v�j�����q���lDd_?J7�EgD�Ҹ��6mZ�w�G��2ʲO��T�7���#>����˚��n޻��Ҽ��󛧔7���޸�u�^�Ώ��K�wO�xx¯W��:/���!��WZD�BA�� {��k��M�![y�/�നĈZ*����%�������j�V���w�^���1瞲�ƽ��}��Q@qϢXLw������֯�|W�-��e�\;'��yE�1��ռ��U�H}k�Q@Q�ݝ=� .��O������f������dܲ��</-�
�߽s�������7/��������x��7�ܷ�'P��F����
~ϯ���X����H�#���l��oS2�o7��r��T_S� �lr�u���}T<o2�n��s���p��P=�>���?��_�98��{�g����O8�C�zqxuy��>�p�|bLz%��ܪ�a�-�s��_-z�?��̹�U|�!|oE�6�閭��w�O���F~R��C��RC�Q촤�?�����w�+X�?��E��}�5��t��NW���/�^z�G�~ƣ$�o=�=g�e�m��OY�\�J~N�;�8�����`)���V�����_��^��Ro�^_��BQ����iBa��������Op��E ��0��C���7er0^�m��!ɔ�r*GPx��(��	.��T�Ǐ����E��l;J��<d׋�}��}�jʕ��o6w�p��M���Rb�\ke'���g�&�f�b�͵����׺?ŵ�~��;E�W���\S}�p\>���8��9�8��2��8�~vǹ§p�+����ob+�Om&oY��]^�����b:z$�|�R@]�p|�8~����S���k�R����t���⿜[�������>�#���ޭ�?L��	�0Q�?�?����a�t�	�0?IP�f	�*��~��%8?������Wʏ��/��Y�5�q���8
!(�$EW��C��� O��}@�'�z�)��<F�������q�� )�}�}�Ŏ<Ԭ0�C(<��k�Q��{�?�ݳ�-�Ԝ�+�(5Ne��c��<��t)S���t�#+#]j��&߃�%çc������B�P�T��������G��Y��O(�g�]OS�8�F:,���
V��Vy啥<H�Cc�]�2���\�hT�D�K�]
����:�';�_ Ʈ�7b�ת�Kg�ۮ���u�?��D���u:}��a���vQ-Mc�=.@��U? �y����#��� ���y{%����6�zS�梉!����A�q<&�ʌe+�I���O~�9<�Ъ�q24�Մ� QV�A2ukmf��] !�zŬ�ܮ�G�p"�+ӋO護F{�/VJ��v"n�Y=d[[���.�kȽ`����}$}���n�05�}���Cx��8����r�eH>�S���+B0G�^0���գ������ߴ����f&WWv�۬U�>���n߂`	W�[�h�i�;6t>�/e�z�:��~L��wې;�����H�0�(Z+���!"�~%�yI����Wݳf���c"���/�F_�s�c*ΠM
fM,�gm���xB�K$x� 	U��(7�TM@GU!w�w#/w�Ͼ
@����f�t��F�Gj{�1X4�kۉ"����t�}���H������;E�V<Z /x�������5��-p���?<9篐C������r�C(��"ԉ�< ��iq'*�Gb�L��9Ǆ�i;�|����[w���ҙ`��\�-HrP��<��J�#!:}g����︃�j4к�����=��=}���J��� ��<@�*O٧,P	��*��� ����?P�!�RO�y�#�5�AT�#��u��];���
BY���׿����y�0��|M�������nL����4X�����"�6��Ѧ�d-���Ͽ��΃��7�A�<Pa��q��Τ�� ��փ�z���ֿ#Y��[��_�|��ܞܿ*���[�H���0�6����=}-��ϊ��/�-�*8��/�4�S&ȍ^�����=οJ���.0?r���@��)1�������l������	"�d�^+��q� ��We9����9��A\�O'� ������0邸~�����Ma|w����"y�k&(9�%����p';@v�O�. #0W�0\��]�y��'{[δכ�\s(:�/��1��莬X�C��͌�2���^mM�T�:{�̱Ď�vse���4�aǢ֒�uW8UwS��=�!3euG�Wi�N�}���b�z��#��C�1�ܨ747���䈞��{`+x�ɎlC�� ��L��q�Wm���/\�%9t�n��=+!��V�b�B<�S�p&q�Pb�Л̖3��b/z���<Z���������3��Sc�h׸<Fzmʉ=t�0�3I��r��b�ĉz^O��d���@��N��c��Y�)Om:���Pp7D�r�.���O�ef�A��#��H���\�(�$d�2�:�?,W��� P-`u���\oH�q����+c���
�M+QIQ�f�U���^B��iY@�`\�}��>$UQ3���|������RW�3�����UQP��mx�t��7I�7\EQe�h��P��~ h%���#:|z���́���
~3��d�P�^�2��2>�:�ci�$�����͋
����J�+x,��]�)�K�^���p��`��j3��Я����dx��Fn'����.G%Sg����؎'P� "�*���,=pV����S4����ʲ͆�]��Q]��mvf�W����A��Fow+�9\���������?�7�-���>i8�њ�8U���=� %�8Na���Z�#?\̢%Uk0���Jo���VaC4��S~���S1XI�@���y9�is��{��b��1EEQ�?�WN��!�mل��E�tU��R"Z�57=o>��3.��oU�#.�ZuX�5�椕��X%�`p�|]A��t%��hUg��:$�%4�-'v��-;Pt�(���n��&�RK�]��T%K����3D/��Tm��pc�K[/Y�\�mHe�`O(|##|ʄЈUGxMa1�)�x����BQl�H�A5�E?\�d�]��hX�����	��}*�8�0{=��զ}��
-٩GEV�`�b#n��$[Ʈ�	���$�5�f��3ߡ�� �Je
���x��5g\7�ڨ�ı����]Ռާ��a��5�F�ٜŃ�:�~<��Q��xt��_�����~�w�k�����W6����u��W6����t�l� f	  ��l��h��P��v��K���_7y���M�8V���O0�mu��|��'?D h�7�pd�G�tO~����%�n/TF�V�Vl?0���Ĕ'g�J0��ji���FàEZ.�]���R�0�dl^�[�u��jօ!;�ո�����0���n���nKnoH����d�����V7��X���hn"��^K�����md[F�kA�<�R���Ś�G�ۦGͨ��]K�Ul�����{�P�?a���Z�soŎ��X��e��)OFrbZZ6@�{ŗK+�*���lў7Xř�d���Uo.U���E_i�^9��������XPK��$���T�ڛ�ڜލx�.�Q�� ����`�;&u���j1v1��͍�.�C^l8�&��� ��t��o�z7����SH���i��8����MLY��'����dϲ6+�A�m���������E�(����V��Zi3�aO��,�V�ɮ�ajȸc��r����R���+���KEcF�򽎓�`��8�M]�r4��:4��X{I������?��U�5&�QM\���۔+Ɠ��o�ը�:����@�Cj��.������Mt=��$�N���J�~������<c��rY @����X3�ka���o���Z���b�\����1
bbN�q"��d�)����@�m`�H3�>�@�l�ΫM񁗃�����Wi_�����1�D�kZw�u��5^����i�.m��P{4���l�.c�!rS6� �l�<���|�w��k��_�M���eA�X��e��;�f!i�N';}=���>i�`}��
�j�D�������K-ED�T�
���mtI7mj��aԅX/���jV��܋;n�hi�۔��|ک,�=ۭm*�mWۛ����܋+�vK8%�&�4Q�饀Jպ�pQ�F�<w��|���G�9\��h�]��f�xug��p���°�9���{{k+�-n'�����D`Ő9c�~ߢ��ղ���)^l�&�	Z�n���7�����D�>z=P[��tՠ�JXy4R�?�T�L���j�)K7����g�x:�7qсV�Vݨ���H��k�(r�-m��I�+���(��Ɯ)C/_f\�817�{�4�I��F����Y���&W︭Ab+���3�nlv�� �tG���p�mPYm��{,W}n��ǋ>�f�To��!{���<����6���ߙ����f��z� �p���fc"�.[ݻ�>����VkO���4LM�iT*�l��N�-.(4�d�S��҇W;�=(�A� 
�����\�pO\2Ԓ˔_4�F��V*�3��`�WT�
�����@��c��Ym���8�l{���q��.lx$����&At?M�c_E'�
&�[13xњ︙"���'�<{���E{s�7�_5��Yu����45]TGFm�c�����d���N� �7�<?�gˎ��҆D���N�^ϳ�B���NhiDzCv�4�3���-�d����?�(+�f]ѭO�F_�����ƓcVpV�n���T-@��L>��r�o؄�ŕ�+'��/x��X��$�D��NW����G ��uѫ<��+6_�	D�j*�o�v_gG�dg
Z¥^�I�Y/�h<���uJ>nQ:߱����;����+Z���GA���z�3��co�����Y�)�� ����,S��Q_xP7�B��Oѵ�l,�i�@ڲ�h�2���o���~F��	�|���z��X�o�8����gedn�B�[�΍-��[M/Yo-j��F��+C��w��Nʲ���>'���5|��*��v�u��封�`퍟�TaO ݹ=��C^��T�� ��>@�����>U���+��/}i���R}6-zd5�˞4��-���t;?x�t;b�֛*Ӌ7q�h�-��$7�v<O����>ᖁ3��k�E=��?:��%p��k�U�Z.Y�� �(>@��P|�����"8S�I����vWg{��'����K(K�^pf�G�7�f|�.P}��@q2`��/5Z�Ҵ�9gDl5���=����5]?�U��3s�|��T�� ��>@�����>cLR6�����z=�#o�>���Ǽ|^�J$ּ�9޷�Ɋ����0��q�"-��6me7��?�U�E���JT����"�I"���B�m�N�����@�'�i?Y��D��D'�O�B���ĴP���,���R�E�lQ/M�lQ [�U4�@�����d^�>|g
�����ڍ�|�3�|�gs|>��|�I�
>,a����wU��{p�!8�|xʄ�BP,��	��Na�k.B���	5o�!y^�˳����o��?!�4
      \      x������ � �      ^      x������ � �      _      x������ � �      b      x������ � �      c      x������ � �      d   �  x���Ys�L���_�U�u2�͢r��������i�UdMn��kLL%�	C�/���9p8�վ�S�xC��x�{���ΰ���+��k�۩�0�)�.�!C����	 ����jO�@�h2��1�X*h���9S�4� ��Yk!�#�i�|��h������9L)fI��שּׁ���Ӌ;��s�{`U��|�d�4FA���9���}/�w�l�&0��L�6��VO@=7���mR7
�3��9K����#�3�v�ק����OA�5D4r�{�ʽDh��tt��=c�7K+,UC��-�}'�~�ϫ�I՘n�����8��1����?��<��S�Z$�8��!�&�t�ϩ�޹�g�k�$��z���i�0/�N���b�q��WׄSo�>�֯<K�M���q��(�53�AY�'�n��[b�_����k�M�?'i��CM��/F��Թ�<���4`G��Dc��yaB���߅�n��}�K};�����;�!�[����3U���<�k��ި�iM�{�l�׌%�����H\8|�8َ���FX]_�M�h���Z�CA��)U���[��N}̷c�ߔ"_%�c�R)�5�}3V���֘��&�RN}������������`�Z����Ѱ�"e�2<��VPOaH�z��L�U����I�	 }ӝ��ᡧ��N�]YIW#���u���Ii�������|�x�	q��-��wHb���Bn*���~`�IdK���^l���0�Ǽ��lѪ��oH�
�R���BfӦ3T=Ya��:��ߙ�(�/%T�W�R��P��h��t;U�^vF��<ȍ�5�>��� 
������g�78.�Y�ר�2�Ld����i>1�R����7tq�"������?ϕJ��jpE      e   �   x�m��n�0D��W����	�o�)A	�@@�`Bb
��4�DO�;�7������no�ۥ1�h������(�{�&$$h�!SD�Fq�O�v���B�See�h�N���4u�����v�����쉾o��*S�I}�h�� =�1J�/��xB��6�x�"y���Z�*�Ys$c{�ں/3}k����O���|	���2�fjR�؜O�1��Z�      f   w  x����n�`���x1T]j9T���~ҍǊ@D�\}��n��ff3y�o�[���|e���)\8�V^��c�>�?VE���Q+�0b��?́Bg^2ݍG���sF6�fA�3�a��w��������L�Wu��R���y�,(tfr�ȡ��2��.[n:���ꜝ���J�YP�L��|c�g���zp��Й��Z��5����{�͂Bg�����x���[p��Й�]yT��m�Z�YP��@�ާ���$��1�fA�37^%���z����n:3�NU�v�ZOE �YP�LU����Q�k�5/p��Й�kso�}�>{߶g���Μ'�Xѻ�\̵C�n:S�V��\��ofE�YP��ϗ�`�R}	l      g      x������ � �      h      x������ � �      i   �   x�u��
�@E�o��0ތ��̮!I#!Apc8��!:&�}DP�hs��eu������c�k!+����q���E�r<�����w���SjmH6��3�v+����b����):H��?yL��;��X�إ�|��'(_0z2��E��\��n�B��SL��+B�*#8�      j      x������ � �      J      x���钢������*8_vt��T7���o8����Ɖ8�@
�(3��{-��N�PeUu�?�Ot�k���ǔ�Z�ę�tvڬ{B�w�eg	j��������q��/����C�T������"�M��lמ��h*,6������m~~�<'�:J��n�����Gs���s�L�Ҁ�?����J�,vcL��޼�k_~�N5m>���j�x�3�=i�X$5)O�$*�F�;#��B;��EkO��v�?'��L��2�Ē��ЊB�y�)�~�������a;㻬���n�5�ub��Ci��C'f��G������%�[��=�j1g#��~����Z Hi{�#���� JC.G��f�ni{J��M��a�A�8�_��ҵw������]�t�3!�LB��s��YXo�(��G7�a���j�\?(zs��Lw��:�o�����}��~���0�<O��b�%z��T-�H���=g}�ݵ����`�d�z��)��*��G���Ȩ|�ޓ�C�&�mV�S�
���Yք���*F�Y)tw�	=�8�q����l���<��b
��eN���	��ѱ�!���Π�h���X�БH@�>�|2�3G�]G�5�����Q)��W�w���џ�W:�O�3���fQ�����@�:k��iڟ׈1���cL�
F JLy�����^�e{R�*Œ9�c�8���P�h�~���*���p������#mO���n�%;��67@�&�~��Ө�X�&�%��%�sXT��_Wԍ����h�h�)]��v�%�7�ͩ�4�-��}�o��j��2��Fa���r�iu����~
���B�v-aH:�������e҃�g�v�n��J������U��o��A<�N����{h�	�Wc�8����8�)�� IԌOٞ$H]7���[ͺ�R�|�u��z7�zeh]����8�C���G��߲ۯ)���2="�o��&&nV(�'���a�Ս��jg�q�C����y�3W��ǟ�w�/B�����1�a�!��?��~}2�o�0���+Ǜ���c��ƶ��	:�����8�ў3��y4�v���eq� >��q���g��Ӑ���b�o�907�,H����bx�l^$���BR�u��� ��_�<�����+�:�m�)ݒK�]�+@�p`��ޞx
]��AwY�W���PL�b�.te����g�L��M��4]��$Y�����j�'���
�.�G��gI�x�]�'M/���Ko�a�"��L�Oz{��\�c4�/�5XX򝢢�b�WÓ��ck�_��M¼�]�P3�|(�Y�o�&w�F�ь���Ͻ��.^��+{�S���'{k���?�c4^k'-�@�׋�NoK{B1`���(}>蹨����Ű^U���^�_�r`6��-mO9�U"����#3G�sԓ�Ci��`q������9�*,`����Mtg�̲3g��j��y��a�#�M&�<g�X��E s�<�/Z{��t=a@�Ά�91� $�_4�ޗ�<�͵���T���!�EQ@�X����OY��ۃ�Z���j�Hqds��)�sV�ڑ#���y6 �F̑���{F{6;�ձ#��=^�T��w�[��d�w�)�%+w�(��᰼���@�nF�?�a�N�DUT�"'��������[��`�� ��nU�����G��E��d�{c1��+?z�c���)hm�r{Φ���}#��KF���
Xv�zƉ�^����c�G�w�^��<kAM���{^�5,�Í=���`GC�M��?�㙋u���p��l/nQ��x������k�9X�qh_���)vh��?������r�=�����GBt|�M���~~���b�T���z��<P�o<��k�1�R.�]]-A�f{���z?�'�O���iO�k p�����Î��7Ίi�Z[�������x�b��)om�3Z�'�)�ƣ��
s-�~����W�Ϭ/���2�^Kl�l���QO����+�����Pb�1�E��TtF�9\B���b�Erl�<��Q?�g���}60F�1H�K�D��&S-�ڄ��iO�5`w�5�{���O�@���[<��b��9U�M�\�tti�6Jo��
�(�Z5?̤�f����å%u�.d�tI���qM-�G�1����n��r�)����E�#mOq0��H��:`?�ѽ�D��s0����d���Iև�5�S`��r��b's�1��ȏ^U�30ί+�/k������(D �0�!
Q���Q�� PL�Ts�$��M)�^w�踢��;��DA哤~��"-�=r�ܜ�XV3T>u�I{��
�;-PM��)�%�S���N=�N��(aZ4���AN>��im�a���Bt��Mgb��P?Q`|60b=���|����28u&f|[0��lC	�n�G+]w&������v{���Q�:��G��=ŨC�2;��!�L�F�ؔ��G�A���~�X����ۦ|7u�J{֠2��ptqŉ�!�DM��bl�]���]��${��R7|
�s���T��y�w��r\��E��s��8�K�r)� |ߍ��EkOۭ!��cy6�3j5N��[�����քӨk���\@�0A���1�䜚�O|>٠�r3���C���42z���L|�����8J����nO���؇RP�b������K��K�^o��t�B��>F�8<���A���`͢>�oK{B����L��%�H4�D|��w�1�#m�:o�t0�9�C������4������\v�!�}ׄ鋆q�'z��e����-�<�(4a�j�\�/V{*-*��.W�^XC�Ɖ�ء�(O���?�bx���$٥w�9���F�S`� ��������� �O� ���A�d潋4��94F'K����`���\�PR��k!�������6�(��8 g˅h�n�<ƹ�"�ث�y�d��sm�P�~�1�k?�n���@�c��#R���S��(FL�.��jԧ�����E���}��SG�6Z�,H�>���1��O:��>���\K��'e���'#>������f/���_��4Ydk�|�OU���fg��kMH ��j{�bQۋ#L'K%�z��o�+ίz{�c��p�s[G CHu��2X��;�~}��S�+��ݫ�0�m<�'�5~�^�����9�շTD�L�bx/���P:�[�=�n�E����d`��j�ۍE�<_,��)$Vn��)�D�o�31"��veK��\�g�H�%F�6%]4��5R�A}A?�S�a~��S5��^Vb]�6���a��rs�*�5�F6:�0tb
���/F4�e'�r��w����=I���޼�xE�k�@�������gc���=�������"�'8~Ċ�1�Ņ���*^��c�̢�;�y7㓦4j����.�&F,���0�#&9s�3u�%�]b��䢮3�;��ף'����1&��|�}��z�}��A�>���,���';o_
u�!�%�8�'�[n���ƋTO��}��#��~va��l�Z�eg��C�~�����J��$]�#�;�>�[s����d����R�R�㗨���ۂ1���xMƕ^�����D���/ߟ��zXLO��z�T���=#ڞ�W�ZM�Y̖���a���Ɋ/��If����S,�x-(�_	#�a;�ܸ-盩��+����mJ�X��EkO+�P�PS{����B�0Da�C��X��c�š�Dy>= ��E�;�i��z�.W���Jstn�V��-^5�md
0XP�:.W�	j)5���L���X8�k������86N�3#d?O�#�f���rwJ$'�� ��=���t�L���y�o��6)�ď�c��%�
7p�?��,u��kF+$m!����L�{Ҟq�5/9̄���B��,74��&���"7��?fb�9�^�"����<8O;3��s?�>��,&*M�2�Ù84 B�5�%�P0���$�Ko���t
|�8:���Ӧ���w��L����
1�X��b    +e�tc{R���{�����]Rq`�:�£���'X�C��e*c�Q��N��,p}7"X��gc��6����>ՙ�f~��~�0汬bN)�~��~�"�m�$}���j�/�/�+sǡ�'	Ǽy��h���8#��^�N�s1:d��+:�g²���<k1��Y'n��97�沓����vQ_�^r7M??P��L�#l��^����8%QW��0��w�1��H�8N��Q]�ag�!7�`����<<z���K5�,
Q��Q��,���(HuH��`�'!��Ix���B�X��A��i�E��nK{�h/��A���֙,!��h�i�$؃�8��t:IΝ[O�q�}���!*`��� 	1i���}51ڿ3���q�wuҗ���GOٞtQ�a�B΋^S1�u��|
�Y�<kܣ?fb��G7�G��򸫶߿�VQ>�XS�
m���t�'�w��9�d`�L>p�����F����`��CF��ئz����_6���z#~���JL������{��|'Q&U*I
О�m�����`���Sd�8�������'��)�O6&^g��1c����y(g�P���fS�.1�R��σ�պ���]!lx��~b^7�4��N���܇Є��̾X��-P�����.�ʃ�v��J����)���6�4\��A�i���鶴'�=�F$\d'��<
�=i��Ux���=�Gœ�/���������>����4w���2�Umϻ�zr^y5��C��]b�z��n���P���Fh��]`��(�39OG�Z# ���F�=Q�v��.ϭFL�@	�9�mA��y	��}����Q��c�z�� #���`��C�E�.����)0�A�����_�3HA=F-��0v� a��:�Fyb�c&K�r0��4����掉�F��Vq>d��`}(6:�$ &ƇҞ%���d��~h���� ވm�[-ݠ� �=��l���M�����۵P����˝��y[��Rb���՞�� ��7��2-�����7��a�'�°�Q
N=����c�OC!R�B�����v;�@�H�SiÒ���:�+{��{Ҟa�u�P�;�V63@�Q?��?���-�oت<���d7�7y�}O3@��aza���ᐿ��k7���c�BފcE��9i�6��B�q�K����Ĕ�Yﴣ�;�!w�qA��ўy�t��U�F���ȷ�tCχ���LW8MFF��/%Ǐ�"3��/�G�)�E����xa	A�K@�<W��=���ϲJ���ܿ��@�=懊Q��B�e|���t*v;�r�7wu��Q6�X�R,nv]0�S�������p�\b�)��Fr�Vn׫>4o�س���̝iq1B�-�㈐�}B�|B�%��s&F�j�0�.�\��>��2��K;��=�=�.m�?a%�Dcdfޖ����}=��#��f�ʛ���i{�*��^'3�!�פÃ x.�G/Z{��SW���aL�ǣ�ݓ��]�͢�lrY4/�x׏�=eH�p��A���Evxx�G��5���ȸ�#y��73���`�q�P�q�-��(�7��d�x��)g�f����8�Cܼ��b�3�w�)�ˋ�^��&Q�cl��d�����@�#��5
ÚG!
�e`̯,L�]��J����A��rӫo���:=n8��?�_��=I������A��gAzO�3wC�݄�����ݼb��c��u���{p�+�9�y���)0��$���p�E�>Yw��ӟ������2��������9��_ʗEB����v��k��9�_q�`J/�r$\����������ݞ�{���U2N�Q�t��nѶ}��G��Y_�;��u��}��E���X��p{�\f��@)����a��D3�r�rd��&����*�a%PܠX(��f.���h�{Ƽ�Yl��l���Ja�Y*���h϶FS�(�|�g����/��Ua�0�i?\IP��^���!��V?���tp=��9w�v����G����n$M���8e}#�4�{Ŀ�E������C�sA�>�~�S��^x\maTY�)+�尳0�ۂ�߮�C���̱7�7��4���{���Q���K��M����};���f��^b;M���UoOܤ�%�W��O��~�,���ۭ&�tYx�҃�b����������5c_���eg�x��w��_�;�����Z��m�}�+z]K�9LY.���7O�h�i��)�N�.�#D{}�����Us�hz��ca����c&�#��yA�V@K����7�5f�#�����v9¤�D��,#��p����G�
�p��|��+����:'��	Nb͋��,��pH>F�V�u'*ݥ�sgQ\o�^.�1���E=ِ;�[�6����{5j�Y���e1�u��H�I����^��ą�9G�����W��|�~�8�+�Gy	c�	��3*� ���EÈcf���;�c(��=:Z 	�9��
F�Ȋ�}n�p�O.
�a��in
��O�aw8�������$���g����e�a����nƞy&5����tRSv�J7������#N|�_�Fy�3*�/�����I���u��Za�$�)0����n|8��A�2w[0Z���B�V��h:Z1J"���K�,:�E�4C��mGL�ۂ�7�?�]^�6��3:b���m(�����Z<�M�#B�V�g�UŨCci2��*�^�$p��)0b����7Y�S�$�i�V����$��ce)�ˁ-�"�n�H1��^6%ǧ(�tO��lOj������>�����as��§�8��5]P	$�)�EG2�=p=��Umϛ������Ve@w$�*�	�og��#c��}��H���y���ڞ�p��p7��䔹(*xJ���T1�C��/	�jO����~��S���8����(,$f�8�yO0���?��VO��SW�oŉqM��4�8㼆	qh,��/������R6��b&��z�����3�j#��%:�6�ӌ7�~#I����cum�u]�0gcoߑ\�zQJ�\/�A��_3ڳ��К������P/�Z�=��g:�1Ѷ/)�N�v�z���ч�1>
ku����5������W ���/�e�g4O�5�CL����T�˧ݨ��f'�τk4�¯f{�g������uӲ�;޼d�j{�z���q��e�q�wn�L�B��:��l�Q���`J��
:+�#}0D�+���|准Q��:�a�q�U�(L-���w�����е�۳���{	��F{fz}���W]��G)i{
-�L�y4S��f�if�fg��d���jA���҄�i�g*�Y<�·�Xf��6W;R��a���(>vJI���e�v�G�1�b��8r�'Zw� ���-m�kN�l<���*n� >gK��A�9y���خy{7̇�1g���ʬ�m�u�nڼ�:H_���)�&G�*������T�������i�i���������}����<���A���� �j�������4NMCu�1��{����Aex�ώV ��ș]�y�p1lVUV�/�y��'�o������F_�tR0�t�b��S`pEY���a6 ��w7ў#��V{L�%�P8��)�s
at
�Gj�uu�7��qS�`�2ZּKy���L3�(`�އ�1�D��	��&#��M�YS7�f����]A�(B�Ӣ�i�i��#�ݟE1����D���a����<%F'r�^���l�48iAd�w��v7�Ӡjn�V;K#�-�	F_�w��=��n�:K3�-�o!L"m8�EQ�3h��miO�yb���[O-׼��ҞE��c���F6�"�oԏ#���zU�G���ۆ��oh< �(� #��������@>'n&� np��U��V{j(�X��+������,]����W�HX��Ӷ���s�"ǽ��%�A�W#Vs=I$=�T��А����
�������t�I5:Ԇ��4ۖ��    ����f>�MA��h������Q�t4�i�0�tPO�1ʥG�_��_H�� �	��%��_�^�.�!/%�cCp	ջujj{ސc=f�UmJ�bF��CiϊɅe�6���-ܼ#�������'�({���O?al��f�m��B��_���4/Jy��sx�2���ft�o��
�޼��7�*���L�}�L	X�'�&˕���iu�;K߸-�	��d�X��o�I���۰�7f�Ϩk�爛��!:BQ�<Ts��Ra��]��\��ZԜ��ߥ�'���'
C�'�K��69Ӌ���%S���D��f	��۷oز�����1��zV6_՗��:�Ŵ��G\���Ű���[�xS�U����h����:�}B�p�EŘ8Q'�4�R"XV�1���S�:���X�����z��Մ��)�s��uo��]��� d�����H�����KzN�J�5����j{�S��BrǬ��i�6�c3�n�Iǈ�W[�rK}�
���b��y[᫊ᡆP�Cծ�R�Խu��|��ݞ|���ĭ ��A���<͚/�=%F�(�6�R�xs_�n�Y�S=FD}�W�rc۰��� �s��C��7�t����m(R�Ag�+��#֓�Cf�g5��Y�A������_�\:�˱3`��� BDhQ�/F�|����_���bE7��	�0Y�q��z�bS8�JQ�$
3&���̝9	����	s��{������E~ �^�]n�=
�?��,߫-c����v8O�A�gu/t�����>6o�C�x���P1F
u<RNnV$c+;��{���1�b6�~.���Ҟp��3��ܥ�1@9z�Uf����֞�k�6bk_P�<|��zU���]i��x�0�U�����Rл��Fe%E��+g͢c5w������ڻ�w��6��D�5�Q���i�/:F_&��t�>��.�N������1��Z��o��b?��ZgU{����8�����g�f"B�����4�wٞ49O�L��ꒌu��Y�7_�P0FeeE-a>�WV7�ǝ�����S�'qQB�M$���Ŭ��� v����e�c�(-:�	���Y��0&�1�-�{R��_�1��,L���cmi�9"�uDa�I�8
)�VrU�3c���=�/3��cc���}ggn����&�t��}ٷ�Y~|�n�n��jO�kM��|�p��p�$E�ԏ��_�1�V��X�]zM��j-�{ջ��Ӯ�}^m�b`����#~sIf_M?�x�R��Jo�O�d�!����y�=�=��b-<=9Vg*�w��Bҧ��W#N�g;u��3�螴g�+�V���nt�ߊ7�!}(�Ysq����&Z�����4/�l���,�T;R�HU�p��`o���Ę-��E�R��}<qɝ���7��N�{�j������4
ߺ}�1�@�;R�WbY$g�r#5��x���y�[�!;Yz	yB}O��0{
�}]��pf����L� ��wٞ�X��<a�#v�{nWe_u�k�B�ύ�� �8���'T{91cxX��6�o� �c�k<`)�[��Q��j�Z����͌�߲ۯ�p�F��1(Z��Ց��}?� ��IoO��E�^��`O�\o���~~��7�7�B�V�Y�
ꓢ��ϯf{�G���$㳬�O���
@Sg2ׇ������1�}�tb[9�ٳ�`���#VQ����m�Y��e���	���yQ����dx9_�|�INh��[�y�Z�\/I��S��*!��<�k'�E��=���e��g�p8[d��O�_���6���:��>�L�o��P0X]V�{��^iI� �葶��Hxe6�|zQ@ԅ������D���Lq_��8cU�ӱn0�ۣ��EŘ�(�]0%��d(�=�����EňtF^�[y��Y�g$K"��,��bԺ��n$�A���ȣ�~�1�w2�@��Щ���W�/\����WhL��	ߑ]p�B@�EC�-��bΐ��F�9��+�_,�Y�`�a��y��ֈ�&	$& ������o��Cɭ9w:B�8��&H����cxu�3a͑8U���E�(�h|�������8��H�2��f&�bďY�ғ�hz��YP�,k����U���e�a�y_�-'�A>*I��jO=�G�.�2�O��>�5�E�_U�����fX+�It욇QoI{Ƒ����k;�F�V��Z�0�]�x$_�����(C�R/�Ԧ� ��$�Pڳȥ���e��-ܞ"����_L�Q�k)�PSy���]GN �qP��`��A9!��l3�����>%���D�9_.7�<e��F��W��z�7	FQ�����_#�gE���j�Q�g-�WN�������KƆtN^��R�M�~H�1���G�m��2�QG�}��������c���\d�	d�/��b�Ѿ紧���׽��MV(H+�o�O����	8?���~*����r�V]�KFg�k�ڗ��+eh;v:;'��u69Ț�Y?%�ר0�Ϛlw����m��3l�B]sW�UG���vﲂy�R��pRd�|��a�j�=)H�T�{vi�����/��P0|��7�^��I�U���@�䇂Q�z��b��:;I,��=��L@� #"�$���}M�#>p����X������}(=��_��u6G�9�����Ҟ�L�&ݺ�.Uo�D>�H�+#�V0���!�0z��y'����gbQ,
T��E���M���c��2ڳ��x�N��\���P���a��f�~�s1��*%�N�X�'	.����g,lK��Id۪Sn��b}�.����E���L���i"h&bC��cD�ζw4E�;�z��[��c�f楇1�0��ϊp���W�U�O�ޚ3�=�=��&�V��lrA�$1>L�|�1ڡ2�
V1Y�&Gj���L���{�>"�~@��7oH�c�ў#3�Hc�D��mv�)0��pp�T�v�B`�}��泅1Ƹ�1�H*X�+Q	;�L�(���0ƙ��z�%*JQ�-wƓ�E�eǨ���Y&�����'�a;#�����s�4���,̭:�Ն3#�[W�)7@�և���ݭ�yQH�#��د)��rЫ�qT=}�ʧ0��=g�_�����J�,�g3�RL�C��DKGn�ݫ��?�c�Ly�b���"T���~;�Z�D�ҋ���X!���v���pF������w���E������~N%�V�'�{#&��ϒ}�0zx����@VF[װ�/E^���SbD�+��js}��ȧ<	���_��T/8�*�N{�0&������=C^��i^N�hǏX�V����}<JM�ݟ����I�H*�Ź�r��������L�~�:�$��*�%I�#�;��5���ʒ��qY��e���?��a�%���،si��W �G�/��_�1j���=��ͳ��O�_����ڐ�z����9��L��]b�TP�F��:$<��P-�)F`�Cr]'�QKp��g7}2�3��t��͡?��8騿'ď��?_U�==e�f|���5�ӎ�|J˯����=����d2����yA�Mp(8��X���Z�u�䙀ώ�����]��wo|��S���;R��u�R�	b��*N�������[�+�1�De1λ��!x�>W��|!1�<���~�>o���47_�+X�ΈZ����={Ɉ�����^u���.1��8���v+8*��kC@r����������t�O��A]3��C��tJ�=�g"j�(���2��a37�=��#��fcD�����B�u�#tT�N(�1�������Ǜ�zs�'&�׈R��Z�v�r5���Ƙ,:*��z�EkO�Wvh5���F{`GOўS��=A�O��� f��H_���Ԟm����,Rk*^"Fh +z���V������`k��&63b	�Q���h��@���)3�s��C�>�[�9�2ى��;�km��XnDh�4��Z�W#r��'�5�����F���P�C�笕A��r6_���������S��0�71<I����~Gu �,���z{�&���    ��i��Q�s lj�]�� .�r�;�l�B� X�E��E�ZQ�� .�M<��@�K�������~}�lj��O�?�<�>^�QJB�hCNr��$Y <�����f�'�KqZ-����|:���$SVE�w>E���N��}(�Ys��ۚ�j!(a�0{
�Y�{��G]����< �,�^U�N�MfË�3�;3�^ �>�퉗�3������Q�����`䇁4�o=ɷ��t5�v'WB{q��r�ʛN�.�s�xIsYUIZ��6���j11���9�x��_���kF�� ��7cJ	9������^��)L?#�ڶvAu��_�;�a�GH���h"p�	퍛3��|
��|m}�{�ח�x����]��f_�X�	U����,sJȑ{k(�V{�`��1���̰ct�=����}�ў9^��񅙗ޥ��`
�H1����],��p4�ը�yQi{Jnr��>�Xk4Rk6�EI3���l�ͼu�����+��q�������*3M��#�>�ڻ'�A4�Sp�`����8�ZY̓��Ǧ�1#��-�Gy�ǅ!��NC ��F_,�v�b�$p���C���	��4Ծ��}U������K��~�����k�zY�h���v{=ԻҞee��aW�?�{i���ߘ��XLu�.NzQ�I��A��w���-�� fƞ�q��΢�G�1"L2O=�:��ƹ��h>Y��gf>�Ԋ�L�_�7��H1b�I��f}T7����d^U�Y8'#��b���ks���!x�h�X[+nY0\x����3`hj	A�n�I��v���?�_O��Nt�d�e�~���]`Qk2p����\sw��9��,}�W곅��Q�Y��r¬s�ɹM�5C����?fb�AN���r���pE1k�@`='�^�qiuM�W.I@=�f��Ϟ\�[�����<��<�N���v�ľ-Q4���i�B��Xn�K������c1���ܫ���Y�g.)n�����ya��5�B���ؾ��N�a9b�Y�A�rv����f�T�@��[�;��(��t�
��y����$ �r�p�'h�r7����˸��&F4�I=iiO�09�(E����a�{��R~97�sf���7qK}(3B�m,k�~T��{����B��cl�8UT5�pk�P��|z�t�(\�dե}�Jj�!�\�{����e�Q��6�;�'P�L��sQ�ɔ
&߯B~rDu���.9���쳅1�����Xrhh.�6��`5Ox~h�in�G����ʮB"��>��K�qn��+���k]��kDp��7�7!Ƈ��Gj$жZ��E�w�:l�"���G���nO^��&
�Y�p�=>6�ߪU�n�����H��ns��v�k������5V�]w%e�وپ���b�v; ��4"��2Zu4�y�#Ũ�8�&��L�D�.Q��`�[`l���qєN��H�S�+GF��9���UT>��@T�_T�~t�k[�=6�N�;�Ali�J{VX��ͩ�'�q/Nz1���d�)M2�l�^��7Ǟ��k�sG� ���곅Q����8�	6�]t�t�$"~hQ�z���r0b�D.�>3>�Cs-'O�7���w�w<f+*��=�K0 (?�X׸�����ކJ��jܝ��|��Q^4Z,�6��x�C�ܠz����Ci���*e�Cv������K��=�=���?�/�Q��z�Ű����?�_��+��Ee������x�"Ώ��)ce��6�(������[��t@�}60<�/Uo^�4�r@�0Z�\�wc�Y�S6I�B�l��7�=X:�߻/��jo>M.2G�.�71�gco��5 ݚ���f�p�fF���_��bb���E���:��կo��3��ߜ����z���D��6�x4+�UQW�tV�:So$?	ď��&F~��9���3�t�M�G��6lj�&������Q���1+cl���Q���)0��.G�q��K+�l-4���T�gʛ�]wd�F�U{�e���~�f���7c�Nc1,Fۓ�*G�!������ECy~	��� ��� ƿv��XQ�8�.� s��tY��{��iv��{���=�:K����ps��ldټ	�)1��댴8
N�p6I/7|� +UܹhIzt�*���#���KS}�%���4�~i���|=�+q̐�n��`��׵}�clO�����w���w���Cm�?w2
Aw,J|ԫo}�O�q���r��(����-"�}
���;X�p�v�kT�W<�"��z�q���{�}��nP[�?����?�_�D�C�����?ob�3D^����}��Ӕ�΀;`k�o�N�x�������Y��-:�QL\~(�Y��R]�+���XE��h����֖�_����&7��w���u^m�s���Tn��cdv�J3.���c��Ԍ�|�����f��]Q���r�NPi]����hh�4�u^> ����4�?���qT W�Φ(
���5��A_,�st�}�c�|r��~20���B���,�i�9�^~��h�d�����]�`����9�G�ia�eF��Ѫ����6���=���󱯓�m��D�<�+0g*�=��!�r?ݮST�t[�����߮M�:�æƸf�=FA��ŷvp��� ������Y�
��7��޺A��W�=me��?����}��h��Z3q�<�G?�=�=?�Ld�u6�95:ty���L�9m ��3ڳ.�s�"�y�:��)F�����:�(ɪ�+:%�O��S����b�����q���e;ZmG�ڹY��a��4U�����4_;�_*!���C�8�V��!k����w��i����S�"ux��HޒT���}@��y�I��g����sC����M_)�UT�g`��s�H�JL�\;۠��c��I�W��Go��ˁ5��ζ�D�Z��d��c�p}:�����bC�!8���$�9cꂨ��sg�>*W�[����L�lJ�50�aC�]��Pڳ���lH��$�LB���`�rcJ�V�{}畝�]Tk�%�<i[���&����="�y�H�S�2#�V�;EV8�.*�L��7��b��F�>���`�JJ�p2��^U�����҃��lX���#mO	�*�LOpj��CG���lO
27V��e��i��Ĺ�~����b�����4ᖝ]����O����]p)h!�`ʯ;�,�-0�O�P=SI�T�Ag��y�χ�1O�;��z^Hۢ�o��u��sT�?��\���V�B����	F�
������ 򧽶����4����'�{����[��1��7���1y�XJ�UOd=?�ag�ɤ����ӏ�f���ɱ�;�7@�Z�CiϢ��\�(���3�w���"��q���͜��k5/��9��d5F���.R�ǧ��~�����Ztw�	���t���}B#�Sb���X�Tv��p6�KDȲ{ҞA�y���_����8���?�!$�͗���������X?*��岂�9�ۺ���Q�6��rT����|A��-����P߳"��e�|��>}����.���ƽ����<��Kr���rRY,���S~p�nt�﷋|20z��y�;��д>�?0�W&��(��/j�*�2�=ۯ��gc;7".�����A�:�(�}�A�Wc�r����/i�D�ķ���w�=+�:_�w�u�9<�u��g�$�baD<��(�H���������b���.F��8E| ��>����q�Y�}�:׻�j?!?	��j��&�0
�X$�y=үOP�z�0�e`�L��MG����$��S`DH~�rq�����5����v�q6�BeǴ����U)u�ͷ��]b�Os���ZI���^����E���7c��Mߘ�H��&V2� ���d����h���f:8�)3����v��/�٩g[%�KpO��/��H����Ѯ�/��J���{Ҟ!T�����0_����
�?dU��pr�o�w�8��ã������=6��yvgܾ����l3+g�ޒ���X~0�!^_#� v  �l���(J�����nZ�;PB�L?���lNr�]��g�ᝲ�Ҟu]I�T��e����Lؾ+s$��z~��j)����z�c�E�ʎ@��cu8�k�?���C�����F��J#R�_�m�b'�����Go-n{*䁓(9�3-�`D�����p�j�0�P{v���b�c��G��Л:l�B�#��葶�l��z_�B0��Qy��E�Ƽ����Da7�P��ۂ�~um#Dp���i/�t��LU;���Ԑ�v�M���ݾ�+,e�8;�����_+��&K�3k&ܬ�<���Zy��8Կ�俩?sh��穤��_[粛0Dѵ���<0&ޥ�)	Ə�)uӄ6JQ����Th$Ksmi�f���[g/A6��SJ"�pf�-$������z���]��*0�&��iM�E3�,��ǅZH�RB)W��r�����.����͠��8x���Mh=�oO�_do�� �B�H� �=�$��4���k����`�y��ɸJ^��q:ϙ�'�HC�J��y�7��w$ �5�&$�.������m�h�x|�*�Ӂ��%\��Sr�O���sƈ�m�yF@�nA�����𞰝���џբf�	S�ኂ���w��y��,��6��      K      x���Y�������SX�����&9f2�7�13ƀG��b2����`w�;)�+���t�kQUk�����|jbc���ț�ǟ�K��!(F������c�>F�_������ӟ�Ok���K�������<l���@t7	ӷ12�p'}���z_�j��'A�$&�?������Ĉ���#Vye���x'�q�r���&�.oh��P�_��|��EK++Fl��YV�H	������~����'����0��(-���Ʋ���a~r� u!2Ӭ��td�YQ�#�?�����2)��gsW�XyS"�f���� a��h�Q{���Ԏz���:Y��M2����!Ho$�a�� �l�cf�5�jb}��A�{�ޗ$�Y\�X��z���p��"�����o�E2<����@FsPa�}w�ܲ�������I����"���߂����C����)m� gγ%�:��' J�s�aZyE9bRw�8�WfE�/Ӻ��Ѯ��a��>�iU�}��^��ʁ��� +��S(��V^UUw-�^����t���L�ثx�g��7ߙ<��~8���7�o�`k�𕃲�+ym�HθK�s�J^�=��[yPܵ���uYuW�OH��z�|A'�J>���u���-���.�Z��z��#�.���(�ەd��4�"k�6
.�ac��Luc�{W@ެ���0��;鷛�Q�ַf.�G��j��t�Ɋ����>��u��l�g��t����hϭ�����a{;+҃s僋l`!LƻV�vGf��=���X�#5�M+�!���c{n���N�����e�����֌��/¼݁������륈�(�N�1L*<gq8}��#t�� �R%��e<�ͼ2<�^1���9L��s���m\BT��¡Ɂ3ؐ̓Idz�f�\����� ��b4+���ohm�za��,�c �Vu9x3�֩It1>\��#���x�4���&�Gm�l
�-�'l��n��f�w�"m����HH��a@
�[�0r�a��a �]�M_?��L�Y!/;:�bZ߬[��2������o�^��;gz�O�,�?�}�ExN��սp ���^ڹ���U��r���D AnCk2vz�u�$�M�U�̙1�2�N�6_�P�a.cU�qZ"�������`���7Gie2���n#U��"w��A�7�_�aqR0L�i.&��88rO��5U���*��Slr�ںXϖ0�P@���kؓv����e{�qq��,���/�U���füqu�z�����{���$�\��n���)�l�u�O�:z�'�bgb��Z
R[U3z���$�,�^�W�O/[��~{
��
Z����
|����)�l���/�{zv����8��2��Js�'�)8O�c�D�Y�&D��������&���T#=�_��6��H�m7�q�_����^d_}\��i�#�L�0!w����y�omtz�׸�':���5����ރO}>��C���ty���hG.[%�<��Wg*^�a����`'a��r|��s�D�$����̪�Z^�%t�$�y|ӧ󄁝�i�UA��ߤ�eb<S�,�k��n�F��{{y�%}8��%��e�~�tl��h��㧡p������`BM
Z�.��;��]L֕u��nT�@Z��2�e���؇�rE����g���&�QK�*A���ОM������>�� ��������v?�l5u���c����%(\/�#h�3j��n�𻈞Ӝ����7�C�G�n��F�zm�Ag7.�ēM�ۈ�[��n���]�ta�V�-��nؑ}Dz���3�����
R��'x�C	$u�g�U%=Y���O��<���|e���_�d3$��0Z��M*�jک��*?|`ߎP�m% ���.�v��䣠L@��S���űۀ-��Ȼ���>q�~?FVv�o-ʪ�����Ȁۮ�mdzN���ط�#��:��Q�`}N���p�F	[sv��qK�H$N����72o���]�n���17r�lnQ���`�6�ů�*���5][^G�G�'�����l��d�LB+��m�ȜW��G��:\�0���1�S5gaռˈ��v7Vf���5�H�9�۩7��ȫ0i-��������y��,H�	`?�rlVU�zY"��N��z�X	L��@&���$[�ץ �h�kmʺ�#���)����xu�f0�"��{��n�g�$����fF��R��hu�x�^Ǎ��H�g���=�<г��N֘_��޽�vT=���-Bͅ$�6��
�'3����/��WiC���'��y#(D��+��~Avx8S]"3�j�uh��*Hk8U]���,Z��e1]��>1Q�+����rAU�1����)�@b�_�vQo�ּ���6$ǡ�c�;�8nmr�x�p�"��܉�[���&��i��s4��3�AB1J��X������g {*�x&���&i�`sV���줇��$,�����
�?�_�W��@dCi\�75�S+�V�z�/�^��i����2z�L�BX/��«�����_�Z�՛}F$�O>ሻveT��0�=)�S]d�qY��de|�Ϛ��iy`֢;?�Wg-��� �;��U�������L{�'��O�F����$#K��T�̗�����x�i�aUGEs	%=�d|����#5��b����s��,�	�쨘���A����6�LB�E`�6�����Gھ'�ݘ�s�~���"�'�@<0T�>"{.x�_=)<��Χ���QL�6�CO��h��!���^D&I'�>bs�N��.�2v:=��#J��0�������*�0/n1l�3���>^�ˣ��fQ�{ް�>d��[�R+����-�˧���Æu�GϒO��,bK#%fp&o���'�آ��*K�E��cv�3!\k
n�3��Ǧ�����UYM�T�,n��#%�����H-hmk�q_��H�*����0D�B/�$]F��-;���%1[�;2�.[�G����P
�mXI-�1B���Ο^x�T��^��s��7Y^��L���2_X���¼�e8ق�{�I����y��k�z������<�l�\��×�������z��8���45�O�R`������AO��Lm�D�F�K)&M����x���2�t�������N!�˞.pb��=Yb+c�ݹ�7�����y{J�`rS��#���y�]���e�������I�QYd���7J�UjOv;9���}Y�ۈiZ�Z�ȃ�u ^&��VyZ),v�Uqc�)(j�3c!���$4e9�
��%��`Ho�ٿ�8 ��n;�N�j�ę�� m	���?��۪U^�p�"+F�S�=z��~�d�ϰ�V�ɥ�z��z_�����_4��:�~���]�*mpMX>/�De��N���8B�ډ�欰F%��I���ܳ��eW�1����@�*�k�'4�a�d���>�S�f��9U���q���K�y�����e�>�_y� �Lan�DG�r;�PtR��������N+���*�MwX:ń9�w����4�oQ�~�i�9Ɲ4M�	tbÊu�l��^�[��t�"��l�� ����[6�z�B�"7�S�w-�|!5�	M��v����#�J?�]_��f{<5��Q�#��o���f^<XL%�9H{�d�1�/p^w��G`����P����R}C����^�S8�?�.������	��so��ط؅-�VE�Qa���t���d�D�s����S5�(]-�q#g�x��,|ϩ~��2r�Z7r�!�y�����:=�Q��}]�<&����e7�I�/٭�	 G.P�` �װ�o��@�� C���1Ё����>��+!�E~�U���P}�"��9��!
��,�yV� Z҉U�fl���~��l���|�KB�yj<G��Г�� W��N���x�
H���r�TB��>[������^�&ی,���:�-{*Jn,5MD>0��ƕb���_Z��A����    6JM���pp~�5�]��;{�evm.bS'a
kJ��c�s��x?3�Q.z��C�r�t�D�C�wu==k�wb�5�2�M�	��B���$�474�����yd
����ѣ��Q��_-����,U�S�HPa�� ��G�]��}�/��u{I�3��
�֏y-{� �t�P癯i�UW���C�s�d+���]m�q������_�|�w�
���qT�d��p��Z�U���U�C�8�/��s���2=����p�ڻ���f�9!�òu(-�Z�q��؋�nYtv�o8����W�(�Qoߣ�ӭ�5��wD�E�#�-?/�y���䩚�H�š��u��y��2t��K��DB��W�9�y�톾6+<�r���?���m�m&kD|���d��A�.]�#�i=�0箾���˄4rN�Nh�62�8�-��,*@�m�fi��E�������xp�~�2I��� �Y�%�;7@ؼ�s�Fܸ(�<V뎅۴���������ѳ-Μ#�� ��bI�	wR��M�@!>6V���b�Ԕ���^w��������(��cn�s���89�%��|�˫���	N4�P�Lٰ{`���y�"A�ƗH]y��0{��7��ogְ$��.�x%�ғ� ]5������~�>��y]/DU���7�
���A�K�*t�y	.�'�TZb����:1�rh��i�.��K�lqN֪����a!b�<G�h{�0��'W�S
o�-�j���@P�Y��ޮ<o�,�;u����j9��� ]����ܯ���ޥ�0w�s�r�I�V�?:�3��l���zPp��ܐgi��WY�������g����7�i9�a����a���D��Kvo.0�w_�ZO�OSd�m��>"nV$�"Ұ
���<��tԷ���[o��Ig���}R}�I���e����	�>z���b�Z�'��dO�nӚ�*�*�����ݑl�l %S_�����;���Zw` p��@���+y/[�a륽����{���MA����G�g��L5��Sx�6h�����]w���gH�ܷH�N57�o��Q�L�x]�,1��<M|_`���Y���}}y��'�6;� \3���N����/��qlO�
����^T�W[�1_+��^����2��뜏�&�jv���џ��T�r�����)Ԅ<�&�n��&%;de��Ĺ��.܅�x�z4 �{��0t*7�q���7SxȨ�Ƀ�Y��ܖ�,���I�6 ͋�)z�KE�Vb��<���V���0�@@?��BiX�SjފTދ�>F���{Q�75�g�LO��P����:TaZ�RP��٬���%MKO���i��Q=3<����2�pW�&�.llG�9p�?Sx�o����E"���� ���u�s�9��rܦdIι�d�8��-/i��_Y�w31����Zo\�W��n��שa�C��|�Y��3��F?ik���{z���T,�s�k��D�?{{b�q&�-`W%00Ʋ��}0X�2���'�*���p��*O-��v�Á�{5��k��8�̐�׾�ڗ��eOOh}�	�XY�AH��gLYfNW��7��\�"	:Y��K�W�^���~�;Eg&WK��E��ȁ�[{�gz�Wŉa�N2W��R��luM�Ӽ��ڗ	 ���%}�:��d'�H�ܧ�t�;�nE����������To8����h��f[�lr�<��Ò*��dƨe�[�66p��肁�l'lR�V�n�H�"TL���E��T����K�zى�e_�))�AXT�+W#���Ty"�Փq(��u�u�g}%O��c����r�{�}y�>m���DJ!/��kt[p!�
F������V��+�ԑ�(®�
��&С賴]U	���Yv�1��]�+c/�RKs��Lm(Z��F��1IuK�N�఺:�G����y�L��Jh�9V�dX{��6L��g��"&@��L&2/ ����gn��z�W�_�r����=��#���2�ޏG��C�^�#&K4*1��
�& (k�f7ɬ�xè����=��J������2����.>�;]����s;��X�q��'���f�����4J��1r�˟�.A���#}���=u�R�x:����8/����X[\vڀe��\��֕����,H�
=��%Ѹɶ�d����4 6H�ȷ�4���jX�u��qO~GPd�:hL�����HCZ�E=Ͻ��ڞd��zu�1���u�E������up��ƈ5)�`��^:8�E��X/f��KԢQ)8��g�۞��խ6ƅ�T�U��b���'����
�a8�)�ȫu;�4E?iG����	V�±'-$��Ԓ�vR�*���!���q�Y�oؕ���ފ<7)js�3lS<1�-<�B�ȶ�* �W�������u�|q�\���������W�%�BD/S������=�����������E�AN_�t2�$�B�7�f
���p9�jc���D�Tj��8/�t�Mcd�?��J/4ɸ9-֮s�6_�E����Z�N'�±G�k!�|�@e�Z��T��'哾E�}"�h8iuQ~r���T	�4x�G5��.�yi�9j-gG̀�H�T7fs`��KπtVj.���i�f��>����P3�"k����4Ń���d�����wA�M'�f���:�u�����7��e=$Sfם��1��j�����=2�,5��þ������ǛH��F�m�ͯ+/��g�� xd�4<��zM*�3�����|	�;�C�	?��������V����G*`Hp�Y�2�[J��œv��y�[~n�?_'���Ю����(6p�2�
$�ݝ8��o5�'{B��8�i���j����Z}�� tt~����$��lK!d��V��'��{yu����	��9��5$�%u<�2�Z�iHm蘠��D��5��E1��e��$3�������k�I���϶���f��X�u7�R�H5�1p��M9�Q�8�ga$�;?���cp�:E]��Z6u�O�T���?|��z��$C	�[fX�۰a4{�WA���K�8=�$v��Wс��ل�����WD�dc�1j��8��]qxv���Y��	KOY	�0B��t��On�E��[ͥ��	v�T�|Gݘ0���kF�mj'��1{2���/R�܊0k�c�&�s.<o�I^=��-�9�K���Kq	o�̮N~�Cì#�5<%��Y2�=aF��IL�5�ӹ-��>��C�gz�왐��[�:O�N��Oբ���+O=�����"��O�	~z��O
�
��\Cз��<l?G���ԓ�;�+�BwÖ�z�~!뎝��f�~�S�����B���",�ס�O��}�`�5QX�8����s#� ��*�����O"�."S��&% )#��p
���aʑ\+����&YTܳ��c��^�j �BMsCUBur������T{ޗJ����1^��S?+N�_Ov��h��/(j0��O�l6<�zW�:d �Z��*��"����,��=�I����h-樃�X��]sFV��壨��/t�O[�6K6ē�zk{��$�H<eo=I)����^xI��GܵG�J�+9�]��T`���9nΆ�� j�\����:ōZ�^�"���i��=��k:=+�
�2@2P�͊�2��u���~K��h�����5ߌ����z//�q�U�s��>���7[��kF��hh���+� ^<�鎧����OV�̊�&v���D�D��@�XDf+B1�-��D��'=~}�AQvA9�b���-��ls��2�:������E�-�[��DUq�@7X轊���^��\WW���]23�)�e�}=rKϞ:�gM�/�\|v}��^��6M��0&��god��{U$�M�����|�\9?#9��C�>�{�uF_�"n}�m'T
���,`�/T�keS��?.��.����٫V-�}��Z�C~��5L���M릵f׽�W(o�Ď[��㍍ 0���,_^ө���#�F_r��sP�y��-Q���8M�FI#�kX�߷�:?���`�3���Mx�:p4�i��'k    �Mmπ�{����Y�U^=�hd�gDR�_ځ�"L︭k��'�G�نɹz�>A4Y/�N�:�_'�¸t�DA]/Ղ�eŽ�h1:g��������|�FՋ��[{�����"�wU�C�S��,��9JDO�1��?�C��L2��M&5���N>!�>R���R�]�I�LK�6C~�A$�01h�[.���{u�p{7�a*݀�˔��)x�$90���cQ�����¿��P,�Z�g�� "���\ݫ�� C����������,����+9�ɫU���ݘ�A{�hX|�,�~bD��*o�n��v����UuO��OfD�W-Π�챣�
�+K�gn+0-����Y7���:4�ti�Z}7I�?X���T��,'�e�q�0�ڽXw,������GǷ<��Β�Ú���³�,�v-�0�0�4�-y��M���uWG��`��z�A��dԡngh�}y�̢(.�Қ��tw�[}r��a���=���K>3)f� �F\�gy���G�����&�&�a����{�:h�I����ƛ�L��!u�4S����&9���y��.P�x�rӵ`ǃ����G����.颂4��YJc �5W�2������"���O��
�{N��")��l�oVŕ�56�`Zg��VD�{w�3��|���A�8=�����Q�� �Q�����w&��*��F�֞����T�]�{�Ya�._R2���F⩩b��,��K��ʥxR�I6Z��$U��j����IP��@�|,�.�:`��_y� ~m�}}GF&�j��.���ǡ��:,@I�;�� ��h��SB	RD��Ah�l`�Vj���u�ӯ���@���S��`�
�;�J��&�qq���z�_JeG�m�����7�Ŝ�oAM�v#�>^h�,�º�"��$����.��!�99�=bR�ƻ�T{X��0�;���bOI7��z��i��u�8��݈9�pI�;jx��u�޵0=��^^[�2Vˏ��������������N|�w����zM�Ȓ���]o�0�N`z�|����\<��H]P�uo���ޅ8"�ˀY_[���c����1�\��(@��	�{L��ˋ�ysV�)�X��w�▼�"�C�MM���BI�0���=�ܳ1��/���k #֞;���Ǌ���G���-Iժgs�B8`���]�|9ץ��Ӄ}��O�6�m�=����JN��*��)l���B�ל��κ��\�h曦�8'tv�ޱ����>e*_N��i0!܀���k�G��T^���y�
s��488ȸE��քiԧ�r6%���<��,�k;//�vؤ�aq�y��'���C{�i���4O���$ջ��_W�UZ+_��C,���G�kO�M#��y`��CX稙S����z�Ξu�_1ɽ��^q��mG�Ӝ���(R����T�%|����j�_�+UB5������LT�bM���$w7g��)x�iX�~!A__u��QA���Okw]����D7j:K��Ђ?��~B:�nCM�m����6W�f��Fp6����l*���*&%D�����ggig��]Fa���]隴�b78S�x�v�c+�n�>�xɊ�x�s��hd�3�,I�T��6�Q�<nF�����I
�9��K@7��W
c�6���7��b).8Y*����6�K�j���Rm���%?��iǼݣD��1w�����^����f��S��P����/��CO�=���E��D��уnD,�����z|��'�*f�}�����r{I�G~���l�h�:�/D�-P�����]9�@�Vn��
H���g�e�#F>(ee�o+���%���WFVz#��H�V��"=79��>�-��+��
F�t�aY˃F�ʦZ�RFo�'�ږg�6�~�}�@�rq���g*��"Ç4�R%��VU�O��=S��X_�!3��4�t��!������Xz',�(�O������adⳗfu�8ay�87;��d�MDF=AXd'���F�ɗsq`��3_k��4FK���j�5�����p�êQ1�a�;-@י:l[�bǧ��lV�rKɴ���'�{OW�*%�=a��I��
*lV������PbN.������p�-����˃�:��S�Z���Wv{+A�oL�:M'j����x���g�}�ʯ˙��쳭�����N<�ݰ�?�$n�4oXe3>�7p�������*�e��,�cU�"���qWϩ;o�e"V{Იucq��'��=����8����q0�����н�3�$]Qa�L�����.Ep����g����e��s7$q�-���S���(7׊1,��[�C�q07�r^�+��8��u�Z��{zZx���-���p�Dp���u�eu����B=����Ьv�4��6A�� ��7�n�rU�NȐ'�y�]��w9��5Ee�1����	Ƌ�V���r]'��L+(���ph�׃�}�UFG�֭+,��xRra��뚴�a��I�̟De���۷mV�@��-���`�g��$��(�\��-2�Ҁ���Ɣ��w�.>����0�q,�1l%�u�{�l������Y��N��;Pù��C�33Z��,�zo��ע�#�0�Cr���V�M�G��c�Q�Jue0v#;��hpQ��][g�=������	s���'�[�^`��M=�Xl���B^��?35��g��wC�*��yd�t'��V���k1��9��cY5�cgqH��{Y_'����s�8�֕2�q��Ո�A80�1VCS6O�b�����$��d��-2�k �eJu�P\8z=���#�Ʌ�;Y����#�]�;��6V�dkU]n�4�H������ɨ+mt���:J�;jNh�g���f�3�Eaj�*&���}�?���1���X��W2у�;�f����=�m�:Bn�~_}��;$��uh��E4�*$U��"�V������=���bӞ�so�m��w,<N��(�eD
ћA&1�0�AH�1v��)�aI�偹zq�ȹ�k�l�+���5P���H���R�y��J�o:F=�"�GL��ʮ��O�=�wc̿�Fu�%�L�=?(�4����f�|c}�'0�z/�ճ2 Q��ϸ�D�jr�a�2�Ԯ��.���K��9��pi��F�*:��خG��1�n��!��5Fh���J�o�b�
��M^h̔1�o<������?C����A�����i�h�o}T��S��밅�#��:��X}�i�93��>��w��Q��D��D��i�R5#X��-_4��=1��o�0/nB�B.��6�u��v����y\W��,=�3����{`���n�Y!:�R���2fq�5+P�1r��@�k9��-2aU�p�}�����n,�;�פ��(!�fpY�I�{Me������r$9N�9�ϊ�ӱ~H?>v�~���!�;�!:���&h���v\T�lv2���@���c����0�����J��ۓGɺt!�+��*cr�3��~l�u��S���Ȟ�l�	:1�N�='3�{ծ��Wl.&���<������j�[��� r;�\�y)_ב$2p��b���8HJ�0�'�M��&pt��@�3���YE�);_d�S��e�J�<�a9w��gp'�r1aO���Cе�|U��n��祿b��'x7|�t���ߎ�u�;��/�X��(h�]�T�]����7�2��D���m?�E�(F�n�iյ�����W�ޛ�vR�I�gV&���į�Ojȥ(K_l���d�<�ݻ/}�N����,L��Y�M��X��iG�r?7�&>�&\Ī��HS�7��]��
�K����sw3Ά�y1T(�?�B��p�ZͲ4��CC�3���]���?~�� �8@����"f�nЫ�vaGM�{[�Q��30�E�ʚo7��+�'q3���(,J�up-V3<��gEZ�#�Z��=��U}:�Q���L������{�Ti��9�ס�s+ؼ+�5u>,Ȕ�{Z9x�ZŊC0�����6].�L�/Mß�e�?�*��r�g*>Ķ�Xn�8� p  ����v�N7Q��1\n`9lI���1tm���h����(L#KA�	��@C�[���paNe�`��M�!������v�x�?��}ڦ7�rY�厘z��_@Qd��'v~U.�{�n���C��[�#V0Q����J�d���'yB�<*I?&�K��cӭoU ����d!K��ҵ�+��qe�G�0�#tg���B�����a�4*-a�T��%�wu����-�rw�
iΫ�����z��r�=��5]�.�������_Hy�&��u��'��̏�������E����^���Tt�&�wh*��¬@v������P���@ڼ�!eK�RT�`���y�ɍ���1��Y^#G��{ ��j��a��tML��by�Y��a'A��D5��oo��Qz8Y�,�����Т������A=5�`Ţz�g��@�����O".b���*t>{�dey���a�2�@sxB���䔭������LV6lg�pA1иܔJ2�����|��;��ڗ��̋�5����1~2���r��W_�I&��ͥf'�w����<_���\4�m������������v�,��i���巧�z^�=�|�3U�=����S�r6�1L��x���i���K���D��hN�]=	Ӛa�2�/��u$l_�Ω0[��fU�u@����}�z��<����(�`�l�,���
3G7e?�Y�s#v�<�?X.��x�t)���$P|U��ݜ�o�9n��'����,�!�
��\�u���l�T0:i�lR���v�#�����D(��f��9f�B،�x�v�?���H���C�b|u�*r�.a�ϩQ=�u��f�������Yg�:�zn�â=�Ì�0w�����g�P��/7a$))��¾��.��i�kjЬ��,M�#{������9����<�mgi8�
ulNYnq�����@�����x��y�ɚ��/�+���F��ʺ5��SIs�'r~�N�é�i�6����DD�l���u��sw��=����g�bg�{2y��h�,O^��/����e��^�9L��%3�����vn���L2:�����V��x<��T��Z������m��½����W�HB#$���ܶ���&3����DA?�E�G��nfJ�<�ܪY�Y���]����7f�v�p�5�oy��W�9 ��V3m��$@����:�揁yo�̒�Ԕ���9>I��Z�"iI�f����]��I{PG^�~=�;[E�Q߶�le	{�f�C�t��|��P�w��>*�Z+��Ԑ���$?������a���#�~&�z7q`�|�����U�=y��K@.����*^�+PR��p8��J[G�E)�8ȡ���XP�r��|�˰AY�8��j�#��NB�Sw��UxOP�M8��2պ��cis'�/!�T�b�X�v$k���c�X��1B"M#$F��@���h5��ڈ]���m��TF�d��K4�?�g,�ٷџ�1Bџ����3�'���>��K�j����M���-���T\&sI3~��MA�8S�5����y��.���1sF����Y�F�_.F3fc0�F�B��__����
Ӯ*����(5B���xGCT����5Ưv�C���$̬�
]�)@�}�'S��{y��I��r3�=PF��S�Q��?ڳ�I�(���8ƴ��4�h���_��ą�}�k���g�V��~�ɬ���3���?��~b��oDI���W=b����r�kT�4C��і�X� y���8�'�I�����_ո��v���?����I~�Ro6�5{E�y�F�n������[���(��AKT���C�,Q�G���83��(�"&�J��Fp��H�6��M`��M����LcD�[{�̮�PF��#8��/���??|�E�~8`��)2��:@ޚ1
���m���3o��2Z��#�hW��1��7��H]�U唑�,W�HW�/��
�h���.9���^�H�u�7�A��?���q��Wf�ϼH�s���7�Q�8R���{cu�2�[3TN��BQ���#�1�o5�/�ut�l�$��m���>���"����gn�S�Z��"���v%�Fȟ�s~�	�X�����T���|�\'�-�	�A�o�Hh�vj��C`~�{���Ĩ�i��?��a-ګ��O�8����/�*��t���Hr֨�����:�bլؽ=TN����k�u�����X턵�����QoU��'�����Β��s�%:������hh��Փ��"�0}�-Bp1pf;��.Y�]��=_�)���q�v�Bf��oZ^RF����|�I��a��Rw�U!6�a��1�07��G%�Ǆ��j�:��K�G`�F��J{S���C��v���Hg��.�s� ���/NG��ҷx����V�3h}�#�s�)SH�W��M�y���B>��VW� ,[�2�����"#du����o�
F~�eŷ���<���]p1g����N�����g��b<��#򖶟��e�%����Sь��ƭM�ŻW�Yi�U�Kv	���u����đ�}ԗ͛iv��PDU�������d��E�׌j-��݋3]|�_��B��W[�g����3�+��N[j6���8�V��hVh*�Ȑ3�:�������2��P��1����Yk#��*v���l��}���]�<O���L9׫]Q��J�PEE1�� 0����J��oӅu?�/��O�d:��w|m�N�U�
�C��a0C������YykyW��x������U:wv�]
����fq��jQǴ�E�F]Kg��z�O��1���}�Ok������o��U�_���U��g�u��ҔA з�6�.�8��TP�ޛy]]�G��������?&���Ik0�lu�l�^�ȴl��P+���0Q�+����]kC��2-���0���t�?��O���K�%�J��V�}�x�N{<�#eū�8|{@�?�)�8ML�7y����n�X+Ea�/��s��G�|�O±�ҝ.��"��f��D-z������"b*-���}��߇Y��ç�h�7��d��J���@��y�;��Wa�2��ﾠ�_�ӂ��?�)+�Ѿl���im�~�ן�^b���܃���Dƹ:{�.��k:��`E�q�]��?#o�"n���{亪m�-@U� �6�����W[��'����n%l�	yo�ޛF+7����C�q�|3��}�t���D�&��;������l1������XV\�
T�l���~Kw�*����/����o�Vg̸���(�ն@{��i�& �[��>������	�C��L�G%��@���|[��K��$���N�Kx�R��$:���ʊ�� �2��}�YY}�3�3c����߾��u��aO��?�����C��      k   �   x����0	����0��p��ML���KU0�4�4b45�3 N3mhdad���Y�xzfx���p��X�Z(�[�X����Z�s��$s�z���FU���eF�p����E@���4.{��M���֘p��qr��qqq �*2�      L   [  x�u�˒�J���O��	(A��(���k̦�[���ix�S:��:��ŗfV���m.�k��zE�l�b 5��P����)3Gص�B ��K����8�
<�m���en�NjFQ�6��*F��ݰ��Y������#�D�'�L��v$���D���%|KS�PV���[�M�p�%�B!,����*�f�%Ȣ�z�GZ�]��!�W`��SG\�����l���+GCr
��^��T`&O�<J��BV�?���^����Q��E�ƾU�3]d&_������d'$�Ԁp����`���JU"�e��/W⧼��.��<m�ͤ���A�E�#��a��K#|K�|�y��ۣq�-F#��@��+@Z�}�j2&�d���Gő�3��_�$�f�N�0n�+�>����9�Bޏ�N�3�f���V�~-�������3Wb��y�_��s�{�/E1�I�ʹYZvaJ�<$��[Qvg�&���6/1���tF�U��m�ƂFKڤ��$��G=�Iփ���ּ�bM���3�Pf�����~�;��2�u�$���!��A�+'�v�$3����T�
w}:�>�V���ѧ��HNg����W�{<����Շ{9O��Cr+��^��t@mTUx؇��b"(H�3АY��]P�~��Z���qO�4�����P�S\g��k�����e:)\X��}���m-���ӵ풢�<�h���{TO��%(����t�YMae�^}?���u�-Ej\�QMn ����~$-��_�
L�� ;*���&���\skj;)z;m�w՛�P;9$4�~���X[C��ц�%C�=�p���&�A�[�na�y[!�{	�{��'��#Z�m�T��#y�8���Q�G����9����7�4{�������ks��t�AS��(��=~���Z^�����a�`w���y�չ@L�/��� ��O�֒�C餒���˩��w>�|N6��Z�ﹺ<�ZߓkꖻF+���ʔg��Y#�ч��ooU�h�ﴠ�o����v�)����V�ο��t�2/ގud�6���Cա�,�5�Q�%���_�m�W���/?0�=bZ�������X��      M      x���ǲ�Ȓ6��y���c67/	�� �!H�h�B<��<Yu���g����U�Y}Fxx��B9E!�X�Ie-�A�3�b��(
���*���������W�T`����E���R�� �C�ܑ��_��?������P�?v;������_���e�N��a�)Mݽ�^u`y�#뿨��¯k:e�������=�s�|����~�f�i�8�D�JQ4��D�]:؆�ua��!�`�!��s&N�����´�a�դm8�Vf>F4r�`�-ԻK�l�'��/:*�<�k�:Nյ�o�����i��ɲ8v®�{p�3e�\$�t�8�eܗK�d�s\*�1]tL焧���9O���ךSC�u0؍������]���.�����8����K/���0$f������\I�v������Z����-�8]Hp�c����37.�%�oo�ګ`�����I,��:�z^�T�U�s�&2(�N��Ħ� U�B��NxS[�_�9U^�Ť^�Pgst�K}(���,�Q���Nnq!ݵ�	P��A}���pc��&���| ��/#�©�<H<V=!q_8b�질���g>�&���F����-EsT���/�TLp��Wwu���A�QH��p��\n����|�����S�ex5��`ײ6��m1���O���`�}���I���,h���=5�_�=�RO�@�v?1(-Xm�1(�Wa1vt~X
�zie��v��4�Myp�,��>w�g�I���Ė��Ȫ^ZMPLr�."b�dw���ٹuз��(^�A�u���H�R8��p���	������ؿo�>�a�����)���v�O�F����\���|�����K����_� 3()e��|�'�vG�,uP�����X�z~zG��^W��L��8�D �]2[���f�^�P/�>��C�� }Y1���C��V� fL``kO�ҳ�'\-�����T�����Z4{���D��b�+�T~�֛��l��6ݕg�Љ�7�O�F��P�&{T���3�3s�������}F��z+�}&���(,2\j��/m��=���GN�l�G��Y(��$��*]�s%���Y�T�Tu�p������(��ˎy��_��VfPޖ����pb9����m1�F[��.�^~m�%v>��L��A<n��y�*A���iK�1�l|����o�����V��}(��4g@�͸��e�P>E#p���v�^w��6��C�]��颃*w/=�S���^5�_T	�������ϭ-��=�ey��\!�i�^����+��>���]C]^��y|H2�5�s�����l�
N�b���/�&sϷ�eWe=���V]7і��"�6���a�ݏ׀ۍ@�e��=X[&*�l���%[ؽ@���]�X-].��3*h�/�������R�;�a<�u�=w�!�s��{�I&��e�Կ���[~O<]Y�S�7� �S��(ffI���i}�!m���M(��~�����	:<�����{\����p�����&j�S|r́��t��پߐ�C0�e��d/����8���I�-~�7�� �|�%Ԓ���׃��*}���0�rBW�)۴.o*c��i����E�n
�|����YVM�H}@��-��E#�m�Y^l���9�<�zt�N{�:��[[l�V��܊猎 ;li\O��VU�z�))Lg:�o�M���*?�_�����������Ѭ��~q���i��p��n@�R}����楍�p9&�������i#;�;ܗ�e�؞ݺ���6�_L��a:�PF>�3aѽ��8kR݁�ф:�nl~x;�3����0���3��49�Kb��w{i��uȷ���>��udFkV�5��|v3��3X��s1%1�?��F�i�/�/�����ӪS����Ԃ���]�����uo��G<c(��߸�v��'�:�4�x��M��]�{@�z�56JS���.������i�2��^�#+0��>��5�]���x������'�����o�j��[C�9�Y���X��\vL�%K{�{�~L��N,vZǈ��L�	�� �o^�j�̥%s'��J���^���Q2�(+�/��A�_�#�S�;vg�)9�	0]Wܭ���f[���:���H���+j͈sq�-��(IU�!6������qR�gǜM{a����][֔b�����l��p��P=���4^�=#"�����tg&�Y�Eg��A��A�/D|��~�y���7?���?]48�G�"��"u-��"��){����8ž�f���bE\�߁�ǭ�G{ �|�9m����s�7�P��H����?��o+�x]�T��V[� ��aoG���X#@����it<H����&�z��[�)⩛R���SU��D�&����[�n����D��]>���[��,rKf��-�@m���/@�VG�=�e� ���0�=_�����Ğ��D��^vv>�>�K82d�-�h�W+�������(��Q�Rѵ;L�*P��ӭ��	��V]�Ox��W4�\c��*��{�:{������2 ��(Be�nd['�K��5��
������b�ظ��]��Jt䙻����r�d���L�=G�M譭�	ŧ�����x}����s�zj�T�G�0i�?�9-�Y[���B��a�B\�{�"g��mh�����ˡS�a|F��7�f�dH����i��3��C[���_��<����qD����������$�vs$�ƴq����_db�_���M���IB�)�b��᧠���pǪM��L��� ���t�՜��+W6�[K�x�"��V���&�S�*�+4���=��L�
�p�z�hE4���,nx?:D��|W�:\^�R�n�&���O�O��m�����QW1��\e�'F{#��T���_ھC�c��0�̓�Y2�U G���N�����gXO{A
���IzI��]�z��%l��e ���r�cPO����~O=����p<������n��×�2l��%������;�eY=�����C
��ǌ��(�<^�m��~cP�W�ʗ�]��W��ӺEO7�K{��=��M�n�"]��?%=]��p���2�2^��i���l��tzD�WWC��wM�1 F���ZZ�ƾ���awU/�����A^��|8��$�ʠNl��5��
ϫ-�F#���l��
��� H�L�ux��Ũ���'l�[#��`XC��Υ-6y�\>�_lk�>ʾ�
8]	��{p����j�mь�f.�JMX�3z�������g!����"���85Ǡm	Ә^���¿���� e����Õ8Ű�@��<5��FQ���Amn�lN	����������p|w��荑�!�폜�#��{����o��G�ȷ��3p�Gry���]�y��l.P,�j�퓇���| KR,L����m�o�o̺?{K;x�1^b�k�����ڈt��\Qs�sy`�����V�K��xFܣ���ι�������ΐg���ɡ���9����Y�6�𘜉�V:���s% ��5SsK���`���xa���,k���8/����PG
�xs�}��By��[�C�s�3s?u��G�������jw���\唕 bd���N���>�\[FJ���:�w	�l:�2�f����;����0���=��,�Y�֍S�����ܩM���s{!_%],�ߕ}��gj��F����v[�
�μ*�����ʢ��)��H�OxZS���Y�t�=��ړ���Ȟ����?�/Ͻ�_� ����3>m&l�ަ����z/��Qوt�{�B����в�v���2�{46*�c�����
޹0�-7d��P��«ʙ�����E�>�p��S�"����]U�;t
�P\��v�C��S������K�F����T�<Q���`UŅ���$!�wΙ�6ke�cF'�]�XU��d�o�T��c�Q���z����F	��&����(�VH��    � v����f�1s�S ��g�d�ى��5�>����o��E�NӴ#�����,����*<:�Q�)o1T%�����ݯ�Ôt�z�	���z�u1t�9�c;�����:��z����j��,��IQ���ɻ5^V�ʃZwr$iM$7u����ӣ�N[��r����'ǋ�q�V��@�g��S�##��9-�cL�A��>�/a�^�iC�u��)q�[z�N����\ђ��w*���d�&�E��6��[����;u'�L.G�G1�w_�K�"r=߫�����}����pF@�B�\�ھ��U��Γ�SID����
��y~P���U##K���Y�PD�S	̮ﺸ�-=(Ck�#�[ͼZ; 41u�Śl����_B�MP����;M��mm1�:'o�x�7���Z`4~�>�������$�rM��_����R��އ�����[l�-<wkx�u����l(�J�W�Ϧ:�޿],���>HV�`�]$H�=�N�'38�FG�3j���j1]wf,{<{&M=�����5�%�.�d+M,�M��{P�10�,o�[�a�GH�����(� >O�+�K�ǌ�ɛA��l���7�H���NC�9��뽱P����uL��3w���Ii��$�������Ϸ��M���G�M.#G����C�7��z�{��f2s-n��NUVc����b�>��8�έͳ�{2.E+F�i<��C����>�%A��d"�7���+�Pᦂ���$���\dkI�놴3HΑ��<�<2�}-���f��l����>�.�)�BP��×���tliϻvq����,��LP���֜��ckw%�X��v_~�Ӿ�����H��FJc�ض���=VwAX�w��p3��b6���^U����!�.���O���C��z������j��װ��X�"���,SleIB�}�����S�Q�J,��x��L?���	��x6k�AN	wcͅ�~��~o|8Wb��ciS���y��2V���,��v��-�.R5#��98�8��u�<�,�ǹoV��x��xx��x��jÃ��L������>[_b�7Poݱ��Vv��U��@{��h�m�]�F�ʇ �� KryO�36�*�X������T�>x%f\1+�1u�C�d[t�����7�ˀ,(2��!8�C�$Ŕ~��S����*�cJ0�E���� ���P�Q��1�p����)��Ǝ�i�P�!��A�ɕde��~�v����˹P�U"��y��u3�1>��!��6������C���ߎdD����/����i+��.h֮��xkT�c�O?������Cl�'����\�/��
�����b���G�[q �����!F�l8�8��a�Q�m�f�� ��h��(��'�{-���9�J,I�L��uWA%Q�w�Y��7�In�#ح�hǇ�y%=M{��������q�g�7�J�[-1 �Or��v9��r6�%T`���i�Ӟ��y���Z�����8�-3��r'	��!��&C;����|��������g�&���*1���֋/�k��8���kSt��7�eOs�/���\%f��r�-��*dU�?eL�ୂ�˺\w��XN�{������"պ;{��\nX��l��K�1���MXfa�AEa1�$����.a��TXG�� ���?�p�WRCZ��n)�(?��>�6g�m�p${З�MX��:%����'.^"��4�w��Rշk_�Y�G��]��k���n�rmDNm�:� �ۙj=�]�9+�"#h�Gݟ�鴍��i��x�o�	B�n�N�Z~�n7p�F3@�N�G�{��%���j,so��LWq,0����O�mp��>1��zw�B�\�6��p׼���+�������j��K�1V���]FL�P��Μ��{}����n{4<��h*8Z$0� 2��5���*���j���oPQ����}�O�7�t�!����ӊt�֟I�x��B���n�>�8c�Z꥗�w|�7� ����gv&-^#@����>o�һaD���G/����9~��͔S~�����~A9�	�Ku�t7����	��ԭ�#�bU&�p����?	��̂�z���+��6weB�/*~q׉r)��+�I�n�ئ��˒��y���.��G�w�y��y7�i
8z�V_��`z~���1��L�"�z+bBGS�~A7�˝����I�y` ZQ�q%����#m������i�X}�%WX�@#��p0�)�X'���%�ۖfa�Jɩ�Z��1Bٶ�8�^;R�Ήf-#K1���q��O��U��������1vD
T���^��R����1���.�׆��QؑJ���\���n4��xe�'��+����KH�f%��^pк��Q�P�+��4������K;�v����3��\�z�fE���ңseaub����-��<�d��sPq���)��I��t堾?z��_������o6��m��?�p<^,9u(|`��z������X��Zb�Lg�"r�L�3��j2Ȧt�r�v�ee�0� �}+��vޅ�\�<x¸�Z=����8H铬��L���;�z���E`�n�P�|��(�bz�X
ڥ�ow�̀�MY%<�oɡ#[|:���r�bq7��n}�$C?t[�u�]p� �)�i��y������ͷW�hK�
1��!�"N/�`m��R�e&����/��P,�E߻�؀�z�ޘ�b��m.!3�Ę9�vS��lRp���)��IxY�
�3,��$]�h��Z�J�X�GK��g��cܻ'�WU^��5�a�6U�����r�Dv�c����E�U�ޛ����KD��8�
:��=�o�S˗�lG��}��1�t����qd*E��g�3�8�@mE!�e�K����%7�nXP�s��|��'~�	�]��,?�����uY�����s>Ge�8~@�f��FZ���$sR�[I|�[������f��p"RM
,��R� �� ��Q׵��lѫ��� d��+�_�N�]�T���~���y0���d~.�Ep�}-BU۳"��o=�0b^��l�]T���_�V'�?e:��d���#�8���^�q�7�(��_�&|�+v�ئ�y�I��X��߅�5�%,Rקs_<5���I���H$�4B�Dc��pp�ʰ�,Kx�������$8;�T���Ļ���~7��Y�z&��$�=��?�^�D�i���8Q�Ǭ�{����#!2�㛥�^�)�Y�r{�[WB�7�NX�:�D�yؘ@��n�ߜ��k�����D�W�ԁ`�ͥ���M�&�=�:�;bD�"�j�Ϝ���ˆ���2��έ���C\d�4]���bmɦ)����S6����p�����S;VX�ԽZ� l��
W���K�͋�pN̘(�4�wed]�q�m̑Dh�AY �ěٿ��e2v�粟�.��nr=�n���
xu����]�����5I��֟���,�HGn�1�����d��;o��^��<\�(8�.I>F��q~���X7U���Ǧ��_�M)��O���Gq�>�u���ޏPĴ�:�v�5*�^+�8(����e�/�b]�g��{�n���0|���!�ł��M$k�ά�6�B�tUM�]ױIV>-[�s�n��v����-�1�ry!�j�<x~�[8fH�UQ��»�N!Y���\D���[IH�,,a7��ɷ��{���Z�9x\�+K^�&� 	�����1�K%��y�#K��ɓ�ĦO�z��8��⌏�Â��[���U�����)�h,.��MQ��{�b����#��ީ�����������������rZ�{�ʧ�[��b��OUw�Q����b	�ת�.��DY�eՖ`�N<�%�x��fʀ�pJ_��5K���y?������*�g��)>'��^��j�o����4a�ޕ�Sēr����Q�w=���#���	�Só�"�C��?���!�'|�epը�뗛�}J�����[S餢4�e����B�5�&,�\L�    ��8��ɷv�)u�n��A��jb/{^�ДN�5��*��#Cl>��-�X}�t�c�3Ӟ]?� ��.�|�!~��k��w9ߟ��;��$���y� H�"���<�;k�����NS�1�#c��p��}��"�c�!4i�{����uQ�Fu�ȈZ@v�E0Բ��=��U�'����O���>�}��2�.5��@^�����D@r1��l�U������Y7ָa(Q������}�^�"�J��[cX�A���?�MQ/ZN'��\��}���V�sG��?�LI�R7Žs�����#�g'���ml�L�
��p��b��-��������(7��[�-���+7�� �&�ȳ����2o�r�����W2����6�?x�h"u_��zZH���e�cWN��s,i�ߍw��@S��"@N+OJql� �G}0�
:�<ÿ;N�o�¤*	l��:�����&r�T� �;�d���Ke��:��H��y�����\r~���տ9�,!�D�0۷����CG��E��e�����oJ�m�L�U<$FnOG2�q����0"��d|S��ոgY�ʗoxf�[��Tz��7,��p�:x%��h�M�������ɻ0GZt(�`��=��;P��H�\7R*�ρ���t;!��h�!��#H#���O�߳_T8�C\'����$���~��K�_|k&��P�L��T>h�;��7}�����E���tS���:~%j�/�i�������=��w�IT�}�ӿ�[����`]�m�q�)21��XI#wϸ�P��?�}O'R���*m@�Zɒ��{(h=s`�ȴ�����_J�#K��A���+�큯Jq)������M���x!��"M]��ϝ��D����U�ֆ�˻�]5�OW����9}=��PA)n{ln���{�}������nΈ�t�����)�]D���]aٝ]Ƭ���i`�Aٺ�׌�x����\�zO�S�d�1������	�e893���1���i�uj�-�����&ݳ[�:Mqӄ�{8�t���	�Q��	��J�dO?�GP9�^�o�!�r'�[��Y�uЂhlL1|E��g�銓z��8>]�r�g"�T�W���Y���V�]�!����]t#=��4���C�����$\��L�L���<H�
��o��l����\u9��9����W&�?NYc�C%-��t0�T��"�)��V|O�X���lYr
�٦Ѝ����0p��%N7�}�v��7���ѿ^-�B$9��s˟V�������ٚ�����88Y@�^�{�kDH���ڰ^�Kjߋ�S��T���c�I����2�(�a�4wP�=��~����H]�rA���G�'-�Q�G�P�ĺ���ɮﴉ��^�ڳ�N	֖)�U4��OQ�s���r4�����(C��)T�'�SH����C7��_���������MZ��q��O�1^��nGO����6�x��'��JS~�nT�N�k��F����([�U�N�YQ�O���������G�o�Y���wn>d�����zs�˹>Ev�Ȍ�J��T@��֎9%�C��jy�1��Q�z禬�T�i���>���˵��O :~��\�n8>����1�Έ|�[���)$l�Xm��L���73�F��[�jK��U�|:~GV/:�I$>2��ƺa%,N�"᎓���?�U�$�J(���(L���Y�_�F�1��^r?��?������&�d��xh�XFy[��b�j-~~��M^�Ǹ2���6��}�����4S�X�k�gD�?�?
z���Y.�+�ӽd��=5?HxMȘ�,�L=�;w��/��yE�O)ϕjj(;6�rY��3�Ļ�T��E{#䄃����C��y[���-v�_��N��*�3�6#�vk�Cd�$٦�'�[� {�Tg|����U�2����O?!A'�Dz+,����W+/����8�U[P7[#���[�$!6ժ�pu��W�>}W߇f��p���/_�o��
K1����D�L���
)g~��J�*���wޣ��O"���CD�84�A�yȤ\9'9M;�Ϳ{��2����M�?(���j	�;�v*&��R��m�}׌�B�����f�����࿾]op�|�h��2<q\C,$���[:D���'��K	�4Ƞ�.�vO�7��վx��J{�*4�7ĖCT>���)/!pYN&���TQRPz�����7}ˀ��I��S�M��ϥz�������N
C�NP�s���wSY�h��P��ǋR��r����!�^�i�4���'��翚��·xͺ�kZ��LK�a��1�����~n�wS�"���iްl�SĔ7���vcKZy���g�����?��F�_p˟W�N��92�Э�%����B��wu�<3�Vz���*����K
�/�,%�Wш�Q�B�{֍������,�K�}�^>З��<�n=�K",kg�K�L��x�4x!�]!r@�Ml�sHPQ�V[���NM�A�І��\W��\W
P��}��տ]��.�'��H��	�=u�Ο2�_z�B:sa�����P�+�	�#��e�U�p�3�m#��0X�vK�{v�K�M@����'L�V�5f��WN:��DԞ��ٮH�����T�W��靶�<�>���d4����R`?s"hݑ*q��`�D���lv��x=�鎭�� �8N>7:��,rR_��K��rV�����鼋jBB0�,���7��GYS�s1�y(v��<C�n�}+���o��WLZ�[>@�}���5
�mF�\F�̹�t+�ؿ�ʤ�5>ژsl�DO'~R�"��m�_��N}���S��l|�y�Veς]���(�=O��3oݸ�����m��߶��jT~���NqB9�O�'������W(�t��3W2�ټ\$���e�[����>�XYJ����|¿��B"׀��;ZVQ�.1�!�Z%Ȼ2 �7I����ڧB}�=��e\k���m�l��=��Π�2�y�� &���K�����CǖF���N ]�e\M�1��hx5� \�>q6.��W�_s�����EA�u�����-��3�ג��`�oޑ�W�;b���. xq�r��Wn�%S��h� 83s;ܪ��������*�c��F�(�����@���9�F�O]��F��>�i����N�~���A��'���D&�'c�r��^���motc:6��aZz��O�f���s�q׸^}�f�+xi$fu{[�'K�|K;S�����KBګ8��lxy����{3LE��5�F���p��wo�2>՗�	JϨ�����`���8 ��k\0��p�?�w�9�&?퉁�Mu�:���&�b�a���!j4��G���~���K��N�z��0���G��Z�QrK,�ٱS�`�B�zX��Z��=l���A4n�'~�k�a�^W�F[�L؆�<Tp�g���,7���C������B&�;�
���Ƭ�~�B
�:}>\�[��I�N.���N�LA�7~�߬4ܝ�!�0s���)���b% �hwZR�6�D%l��6��e�9���ۀm	�j�mZlO��`'�߯�0Ȗ��Ȓ��\HX�����a��Z�V풅ޚ��;�w�yBOIIr�����!ӵ#��ƫ)5�K�Ƭ��y�� �����x����@�Ӿ�8��}��5n�щ��Lw�di�S^*kJ�DŇ^x]u� .�;�~��~�'�S6?=F�hL��m��V5X�s[2i�:�P^�W4q'��Kܘ�Ad�*�TG�̼�?��L��[��%����P�Y�Ҵz�j�6��-B���X5y~�y�}�����۰�%)F-�]|�@~���[��){����D��B�ge��;u�a�w�l�\"��C�����} �['�-���f ��a�8����7�����]�咨L�Fw���)��;!*���q
1xm�ֈ��lӃ���.r\.�_Erxc�O`�IA���}*���ryE���;Ut�;w/�    ��pi.������)�?@�
�G8��@�(��t��Ga|��r��28z��2ýQy���gu Ń����1J�+z<��%
|�ϑsTދ��ʼf��ޗ� �ہ!�������8=�h���r�s,�QMK�u}u����]f�1��Y�ݭ>�߳T�+ل�q�F�$Yi�@}����]��p����1�w�@�������$p-5���٭*��*���a��Z�=?�{`z}睓{J/����5��UF�ʂ�sB��������6�bO���}n��<n��)���=B	�� ߖ�Y��(vW�p��oZwR��i :[�:/��;i=�L���_��s%��Zm�E�ӈyv�����]���b��{4KT@6�����U��š`G�W�ؑ�Fc��Ԧ�wwz���rs&�U2���"��B�cW������EAd���"*�N auSPǞ��%���#W�����{��{�Tc��a	��T[Y)��p��{dٻ�H�^0r��x!6�
,<�	H4'�j�Ѷ[�ߍʿ��˅M�K�6�d+_^��C| 6����h�;��d��J��Y�]
��M�E]'s���o?.��l�I�y�A�GOA�e���\U��ya9=b\(���A�t�v��iB��z��S9�xz��&\V쪇%�9̼�*}�kS��~?�������w���ܯ�"��|��U����o���bo��pԋ�Xk�K��Dw|V̽�(���Y��ˋ�Av�F�����T���@�����~��K��襋X�ו��qo��l������=<��٩�)�ݵ�;�c���֫���#�x�_����2d����-S�ڳ^/����2�5��b��9�>3��+��X�[=Y57���U����@4O�P��ms�;uo��
'o��v�'�i�B9v���s-�,��rv��,����$y(/
�ٍT�N�� ���K�1ͩ���+�R�+f�}�l�	��	���n��.��N酨���o�L*������g�(�7�mj�T�ROvK��2�*?K�/�#3q��w7�?hj�T>'T�Z������Q�
i'[V�����K��ʃ�^�pC|�J�ؼ�և��6p{�lQ�T@=����}`?��yup� ;�\j��r/�f*_u��x�ޜF:u���=3�'�lmU䲈y����(���ח�7a�0���C㹼Qj8\|�\��m��4`����:��Ӷ�]l\�?��������B����
�3�q��y�|�v����p|Ew�N<-�����
|+j��X����5|%�C�N�lyF��e�N!��Uc��n��/����1�������Y�>��^V4#��bTjY��au�2��>�����*���`՞����+��}�?v�(?�����!�m%�������oԩ�n����G����e�����c��;7��"�������;�^�g�o����7���	�"�$T��i��Lg����ɫ�������2�>'XV9V̈V�����=u��~��.P�_L�d#��vX�p9)��z}�NǑ冤��A�^���e_�F�W����b�ӈ��2F�@>����F�G���	i5x��l�O��%F���^#�K���� _����p��71|0�)�w�����l��<�[��
���~@��NC;nP��B����E�0�9w�}ޡ���b��{�-.N��� /�B)P7�Y��J�����7����ijֺU�C*m�d�>��Ӕ���{
��`�^$Ѷ�]�]�e�Uq���2U���-���=#~�t�;���q�rƙ�An�����t2��*�G�6~����k�w�O���?0�y�\����󂖍0u���a�5Ǿ��oɋ�h|�~G���6�{�Kesi��qSd��V)��:����"!wga}�,��W3
8"��p3Z��k�F��w�Ԍ��8���Z����D�/�d��~�����.ׁU�e��j��o����ڌ����v�ûx�Ղⷘ��)�P\�1��6n~-�Ƀ�A��q��o�^l_3P�$�r���a�������x�Վ�������]��J����QX�ǒ����%�fE�k����%d��%O6!=b��#�=���)B����]� /�{�Yةҍ�����C���p���V���9����� �gEL��N?����'�ܫ��.�}:�"�s/J�-!M6�����r���rT6�j�ӡ`J{8� �-,��[�vNvw�A&�g�?M�Ii��?�%X���wH˶Sf��} �s
��>��$��e,E{N}�	n�T��� QZO����V}�'�C��y�5j;�+ߩ��8��A�4�8���_�,(5���J�k�k���w�FA�uF���aͳ���HW!ȳ��z��6�;n*�w��+\�7۟�}'?<�ެ��q��r����9��Ly��S��+�ڒݽ�xt���s�����Zd��A *�z�'��6������Bv��_zV̾kt�i{��PA�.��\�2��t�U���oJ�=�je�q�Ю��[#�'p>��T���+�M�_`M#6*j���/G�u�RK�N+�Cy���$����y}���%vf8m7U *at/�r�K]]��� Y������(����9�����7# ]dG�a�GD6���_A����7#D����gH=�{��pυ�B��ع�O4ؼ#�\��4]�f6��Z���Լ;F���<]�τ�Ur��B-p%��D�1��$>�|x�5��}��B$�m15��� �/Ct`�*�{�S��� =�©���3���W�=�*�����u���Y�@������؇s��r�Q����f���,�޺���|��!���qK؎s՗��N�{Η����q����|�Z&����0��`]}��W�c�����沶�2k�������:F��ʽ��iyb��w�c���Z�HmN� ̞O˻�>�9��wVȔ��-+*�*��S�ҁ�������"V�~�/���Wx������{&��3Ҫ �Z�U�!��^�3g��u�?ƍ��K[��m���Wڗ�:�lk>G��-�KK]7������̓�Q���hf���YU�����ĖR[��\+X� ��}�̳�)�`~�C_�����t�/'�:�HgE��}���>��H��T���{�b����P|1Wy�M�%�΁\��x�T���s�e;�:�
�b��E�m��U��K�#{��#𼝦Ѿ��s&�x!�����p�t��Z�CwhfeqT���i_jQ����'�������F��}i��;ݴ��M��Ƌ�]aP��7�,OeX+��FuiH���C�;����/�-l�pSV�,̆��X(�zM� ߎ�¦�)\C������>7u�0�#St~p�ζz���[GM0����1��%���p�qm_i�C���J��$~�X.|R���i�:��L�|�Cu*�:��t�˵Њa�g*^h�m��f���U�5�"�)�`ԙ8|>��/H��Fay�3O���I0�:t��lw'�J}E�bRe�­�_Y�u$vo�	X}��4����_��o��y>��v�1�[g�����%:F?\_�ѓ�j+�ڣ�n�n
�a�v�p��":�bH�<�	��4���N����+`�6|��1�O��j�x�-CK?$y�5{�/t�~��C�k�i�,x�t�T�T�@�sVd��M<�z�➽�ޭ�J��\�����2����@��Y��s���0%�#S
g{Y@�-���02��p�{�F�u��-����َ��W��7 �W~'1 �	5!�? �~R�B1��`����J��D���~��?��!+~T�u��p u�ˤy���F��yYe�l�da	�� Z��u�,��D��±6T�|ȁ>)���1{�'��'�k�$�8z'����d�1y���y8�8����%�_��?^;�{��7.��q��^�{�W�>��+-WE��b={|��6W���B���<��ֽ�2ٶ�k�#�N��Y    7_+qm+Y��8Ӫ�{�����^S�noz����/*2wo	=B�[�+��Poѡ�勫a|=�15��S*v0���W����jk����yS�F����	��B�5d��Z�ml�4��N��x1K��fp�����{|��= ����DϨ��P�r�$�Vs�3��z��g����a��?y�l��eq8�&m�"g���g��n,Y����8�zb�o_�ގbu;t�yלU�/��W�-�؈�q�Y��w
�,t2���<�϶e|E=<����uZ�X�	k�(�F�;���5r�֬�P�߸:E&i�ôv��J���S�_�Mk���Y�b�hSqʊ�^y*)A?VAD7��yv�i9⥳�R]��X���aPz:\q�Ey�B�(8`�t���ҧ����h1�F�_��7��v�O�Y���[��r����C8{O��aۤY�9��w�|�z��XЊ�v�HW�S|0a�M��QYZx�ƛ��}RAE�V��;�_;���F��$�K���G$,x(l"U-�d�cG,��տvci����[JcC�E|�M*�'��H�(��>�4��(�m*ܵK�B���N�����l�2��0e�S�^�$�t��}V�|l�����8�=�n���-{�P�!y�?@&g
r�r݊����s|���$�rW���M���J��4�Z^fo��>���I�g��6�QU��Ԑ��jH�O�M/K���>�~��Bӵ�5L�xp��7�б,޷�͢�5h��Z �D|��gc�[��@���u�+�{�H�t�wd6/���/?N���~1��4��E)���Xء��9?��yez��D������B�70
"|+�pM[N,�\��R�[G�m�t:�.y�LYa:.-/��(�����~Wl�(<�d��Ύ��*�P;�g��)҅v���L�y�:��q��Y�5��j���{Ծui��<���m��H�Nq�WE,ΊiH����ʄ{�_V�6���m0p�H]|�������Y����e���{��ێpp�45�#"vr����F�i�=��_��O��Mۥ���P��Y��#���:�חq���nL��Oװ�iHvOHp�E%�RÒ�Wj��g�`�ta�B�/���j'<Ӭ�("\"�}'��m�2W:�l(�^��فU�A�Һ?C������m���FW�м�܋x�6;v��b��I��y箽���4���^��R{�8^2۞dZMK�W�ZN�m��}�3��w�	���˛�$c�\���(�W�����Z�T����d�;�cW�όr�~����n�K�)MSӮ��K�sy����	�ހ��n{'�HQh��8�e�G���ɢ���e2F����Z8������`r.˹�R6�>��1D鷚�K3��x-*�RR���������r��{*�^�3P�A�]dl0��~���O��~�x�X�������f��I��E��V��v�	�b�sb.1R�R��Pl�.i(EH�Ps�zo��-�?�;�H��=�Ga���&c����������M�DQ��7���a�R�����el.I}�3�i[�f�+EO����7�$��g�p�.!��f���!�*O����3�XOQ�J�`,�ٲ�6�%�S�Qo�� �"���p��(���\ϳ�E�n	�D�b�2a2R��ʷ��%�u�jxZ���^q�sp�&n^^���ps�$��!Dlv���5xN�y9��v�vȹ��wx����pM<q�1�N�o����/�)�ޝ�/:�o6y��M����n���C7���M�5�S}Z��ws�g�Z,Ҏ�po�4XU�o�R+Bc�+W���}��5B+�݈@M?1�jz�����W;Lq�|��d���.O��7�V�:kߺ\�c�`�-�X>�u@%	W�,��D�m����.d��xhW�?�}-f������5RV$�Z`#�4�O����6�ɷ�mmqEE�qh>�'�"�"�Ϊ��I��MyB;n�N�����zй�Ba�����QU0�k\�|��BӢ�W����ݏ=��=�(4ۇ��s,bL�z� �u�T��v�m�[QQ-S�PW�j���$w\?��'f5o+�j���8꯷�\]�C�%0
x�'��)/���X�������ssR���K1�h޾'�BV�̓8B���;�3�O��-"��"Rq��6���kO�A�h	��{�=	�7�����h�G	�4|��.](��z�H6*A�.5y�ȇɷ���l�<�Ĺ�����4h�j�0O~T����i լ�d�:��S,��B9c�$���}�ٓFc[�3*kŅEA��$��:��j7&*��&	�h����~�$|�Uˍp$;���D�!��bc�_��xL���
�3䱼线g�&�e���v=����|	�+���6�8%�F*��z�h�c#���,L�PVX,.����`V�!�6�)&'�S�X����v�m���&��t�U[�c���+yQ�`N"$�����Mm��Ϫ�;U��a�5K���A�6kDr�h�	Z%f��7����:�ūY��Fmm�ɣ�G����{�l+�<2j�7hw%\b�5�K�ܧsu�[���mM7��ُ<8O^j�P����E{�zH��ʭ��E��]`��߬���I;�&�(V�CB�s>�(=�~�bذ��+Pi���j��A�g����`���iy�ёy6^S ��_�w���p[�Y���o�>O2S/t���Y\d��L�b�,��c"�����/N��[\L�.�)�x������Wrց7A��7��Yʤ#V!>IV��[�%��{HűtW:��+�Eo���/����m�V�m�{j�d�@a��P�����aPO��d�~�嬳�/d9���'���[<����
e�愗���ײ7���k�e���|z|%���w��N�\O�u^{�"����s����&� fڦy�,l$޳(3l��->�z�\��i�<�"`4ߓ�_|�O�mN9�a�D[#�� �a�f�"��W�f�0�D�8Q���O@f�V"�e��*����[�z���Ա��7��&�✳�����m$�h����&�ͅ� ���-F9~� ں�Ndf�uM¸^�7cm��p��}T%���t��KVy��[��t�䪹�,�Bc��Esu�1��o�>���Mvv��؇�:r��M
�i6�Kr<rφ�-r�!�Ƹ3H"
?�A�/"�#��"�	�'!p���Ztim\1cʵ��Y�T���z��qU����ٗ�,ɶ��Ϛ��o+힜�ǀ���
J*mcF6�c����U���ڍ�0�8¼�֘�x���ۘU���6�𡡚�l�AmAn)�{R�[�l+
���/�;�����(��^��ď�3��W�N�oz���*fD���0y����c0UV��ʥd�-^��ڮo��� �A(����=�A�T�X;���?���@}<�r�`va3+z�|^0�x��Oh��Zhd���9y���,Z��ϞW�3�mL�b��m|Oɔ�!��'�����5�zR���t[��	�Ő?���C&<�Kx�J"�@��N6��+�A^�.��������p��}y�ߚ�
�F5�O
��t�ӓf������������
N?���L	ҏ�*���C��{����L�*{�b��rl�f�|�ɍ����Y��A�&�خ�2�wP?���7^����i�~�\�!�U��kǣAɚm�.R����T%�C/�`�����`	+e�H4��>P�М*�
d7fA~G���$|�C]��^�ѵ/�O���[�~������8��|�A�{��}���{���2���(&��%{�B|y'������Y�vu޷y�v��Y�&��������o����!V������[Һo���\$��i��D�#PɎ]b���w`���^G����|��I_��_��?��+��==����o��O}�'N�+{��lH��V�q��F���2i� 
q��{C����� �   ���-�-�?����2\��?��~>_%_�SWĒsA^�υ�E�Gc�=��������\�����IC��v���J1�� �ʉ������_��%�ja�:�-�w����X���M,�/�?^E�v���;!w�Q�_��,[�(�w�2�+�p�������~�(�h�?�}q�O�rq�C5�ԙPWh&���7~P�`�L�?r���v�@�ޚ�Y�=��C3����~���o���ߠ      N      x�����F�.|L���'E����9��c�}�f43>�o㿽}%��l�;������Sγ�V��j`0Ѹ>:q��?��-"��!՟D��7c��v����P���������԰�7:@l�D�9�����'���~S��4��L�5��A۾���;6�����1�#ʮ�����E����O�`��pW�SW��`�t����A���Z�D�����N�=�T �EɜO=���C[:lx����r��R6aPBV=S���2Z��z�t�I������(�3>���s�[����b=���k �t#{q���=M���ƭ����K�P��Ҝ�G"o�@'��4N"[��B�`(Qە�b�i;v�f��9׹.'z�&��2�W�!�hs�R@xo����<��yN'�p������0�#�u`{v�k�\������/�v�_Y9JZ�[v෶�|���9Pg�N�&���{J� ��'v�\0�[�^ܥ5�P��p���H�`��k�o���X>�N���}�BC�Lvt����.Q���)t|�`��5�� A�(v*���	�1�/��G��D|@P"b_>KG�˟u���&v�5d{qk�݄4�Pb:.Fv���߆}l!�D��xa�1��0��^�7���E�(���;@�֓P��ԏ��L<в37�Rn�};ɟî��q	?���x2a$[-2������<-�nlͼ(9���H�N�(����-��/�C!�ڷb�m�K5�Pb�x&Ol�g���~�����"��.�'W$UZ��;Vk�؉j�p�B��n��F�a���pS�9��-�*O��3ki(r���pu�
�GdvR�qz:�D�<�O�N $h��M,Ը��Ʈ��+����s��Y�!��@�wm���x�3WN>w�ʌZ����q�|܈B	
�UYt��~�Qi���L����b� ��O|Z��S�<�Jٗk�@%�v�a?l+;kAX*�{`|V:��x*��J��I=�M�_��T:!m[(���vo^Z��t�㹃����m�+%0Y�Pt��E��,e)����uxv�O�3k��<۞��������Z�Kǽ�&J� ��+�;7��xuaZ��0�c���5��ݡ�9�8�R�%孫<^��@	0�vnz���|���rD@a}9u.��?n�wy��(�h��|���Q�eŖ��$k��ރ�a(Q�2��s: ��ڗ����k����E�~�z@�ø"��Ťra�/R>A��8����\%=*��'��7Pd���#�8f����)	P�8$L�Vq-����&��T��&a�`~���8-�;��4���f�xÀ��s'5�����]W6�6U������ޱ���X��K׹�Ʒ1��ld��t��y	�e��:)]4@�_��\o���gNs��v(� �|�$�RP�#������+�U�'� ��#%gͤL�z�wɲx�(������l?+d9�mf�������'��Mg>�N�^\����I"p"K��f����[��'��l@D�6�[
�8����+J����󠺖�5i.T_�h~9>�M0E�W�`}Bpja���H�`99V� �s��]�5K_^�	���n�-���V�̩����1�mj��b~]��.���ޘa��cKv�Dv��Ÿ�Ϣ��%�e�c��ovD�@�3�c~��o��g�ϻ��C����z.��G���ȭm� ���(}3
%���dUNvj�1íSVo��{(�B���i�(��Ƨ���Y�_3���,�d��r�b����ӄA	����Yj�hț#�I�x�n�ڕs���Y��e��O��\L������/�U��K���@�����r�S/ˀ������ūՓO��@�sO c��%^'�&�cg#gN;�M�����U��	.Ts����@5B~�g� �}8LE�*��m��õ��o	L'ݍ �;��í��]!4�p�ѡ�ZG~��J=���3N�Ѿ�����yq^M�|���]��]-��=����dy3��qC_h�j����Nз�bX�i��aa{�&u���߄|bpo"2ibm�j�O��[�3<UKAϏ��Z�e��!g c[�|D#�i��[�3s��� U� �_
�����Sd=U��=G�井�ȶ_�ڟ~�}�@�N��-�3��{���yU������3���{�G�i�"7�(	B������%��e�.����^��o��j[,wEi���w�.Lj~������Z�^D�Q����Y \{G\4;S]\���t��٭���7�3j�ޭ:��\{غ�1�j%A�^Y�Q8#ը��H�=hLP�	��uDI|�n�0�u�5�XSm������$#�H����ǚ@8�c���t��c�-0��#oU�$�ؖ�>��	%v {n��==�#�<���=*�ϛe�5J�#�}�/m�r�C���6��������q;>��8��%
�"��	�%��OvZ��5��9`B�+��u�����%�Vi���X6�..�iT6H�D�L�M��\>$�G�^ �K���-_3�<�ٯH���w��U�k`�5L����7#�;�hN/�5����]Pgx,�Y���:�N�F�ak���Y�k�8���i��`.n�`���Z�hD�Jxk?�O�|ͬ�#VQ�G��Wn�;/�B{�v��&��G�f�������;\Z��T��*�}M�?P�N4;�I~����3_��]nj�~��v:
��������Ͽ�[��i�v0�*�^�ۆ7�Z�n��,��9������+�R���<�Y�B����?��Ϡ�g�<Q<d;v�˸���L���r>�tTgf�^I�H�j-��y\V	>(zzI�R����,�0Њ)�@���M���7��7o���f� ��
���2m=�c� ��L7�j�Y��M���Z�f���EH��0�:�� �������θM8B	v�������ʥ҆'b�>u>t΀FW����S-	7���|�쉭D���ۯ|��N�Z
nN�썙/(Nݥm��Qm.VLe0�95�̄��ЁͰ�~�H#�k���E�� v�9�K:'�|�j=� .R��m�c?2چ�����;�K�z�Q�����lfg����Q�Gc�[��ݻ��\(��4*K\�\g���Å:���z3
7VȒ�)5uwXBF{䪭����P(AK~!�@e:6�&�2�����ø���tN�k�b*��-IU4�Qg_2��i7;=�����̪�;���0(!hI��D��7C��!��n����&�M|�D�}�4V4B�a�j�D�����t������!�����P�\�+c�ݷ��FBH`���3�XOC�st�������쾇�V�&n��<�/4�4:�q0���� ��>a����㚯sR6�,B^������Ƙc��ivhtȋM4�����p�mi������W�+;*�[�8<R�b9��%�t��+������s���e�"�nB����*���v�Q=	E�*���&��l8�B��s��[.8�e~D�Ҡ[#�����<�2|p�@/Y���4��L����e�c�{���SAXd��x�bs��2�h��zh�JDz�6�	RX6�)�K"�e��i#%fz����FdW���=$��6�)�ɓ:M4���2X@�R;�c�s�ʃ�K>�á!����P�g���Dp�c��
�T����|QPm�[L�p�@uq�;�n�������
�q�7�08
X�=먡�ç�+��N�9�s�'i2�,�����}�	 (n���0G5o��_��>�|���9_}E�����seET�'
%h��|2�4F�v���
���K��k1�Q��B\`'K���^�Ix{�o��4f��q��-�-*V@5��$��x?G�㡋#��D��^|9�{�L{e�e&���.�bF�X/����>C�n�e<���?�^ ��E�q�z��vZ���W?���Q6W    ���~�|J�C����{��/v\��=�nU}` �g�p~j�j�F�ˬm/tm����U�,ėnFK�G�{��
���3�����+] O�X5�Y�3���j�}k�¢���
��N��> ��ޢ
]M��� �k��w�|e�d���v���P5�P�dz<���bh��=<(����	(Z�:�T{���݃�r0�.�K3�15;�������N��8> 8�=X����Yu�_忽>�yB�A^�*�VTw�G/�	*�mP<(�v�����Q���ڏ��g�IA̕=����YOgK�����>���҆���|�?����]� �������Wv2��	u�t��lչ˩�ഫA6�f7�]� �p�����ޓP�c�oRr�#2�ǌ�cOͣR��DTJ�X���"ޣ@%�V�����qRY71_p��)��U��6��)X�&�}Y�-�7�R$����B��l+-~�� ������7�M�}E�`��P����g\����6����_���b%�u����E��ZH؞V��mY��Dv×��$��<і$��l�q.�Hn��Z� \\�>�~����ܐ�D�"�T�JTnF�0�:F	����}	�$r-����н�;���-�,6�=��B%����G���0��L\٫n��������l��:�v�sn�Ny
� ���'��S�9uꎑ�i�!��5�p�M;�L�'̢�b!�9�n��q(a��0���4F�&2	\���T�j{�~���	gMA&lɘU���l@z[�7�J�'��5m����52�l\��(V-	�%z��̇^�-�T�+.�Zx�-�Q(A��c4kj��^��]EZ�|[y|Jj��L9,�ж�$CR�.�h�C6�@P]�#�����u���_���V1o����n�߈�A�j5��-J����#��ib����ޫ���Í��B��.?�Yw�BY��������Cj{qK	�6Y������]�ou��uZ���Y�%6Y�����s���_`8����Ғ@6g�yz�E��c��&�W�pJ�r�r��Vv���a4�N|�U��G�M<�;�<AE=��0�D��H̙Q�rWO��2Gۓ]���[�Q(A���YfM�L ;��^��:0X��_3�̴���DG���!�W������N�s��R���+��t:C��x댏4�x�v�ޑ[ƙ�7���Wo�J@o7/�Qg�2��a�C��l-�mG��3\�W�do���b$`���r���R6ap&@w�x����</�Dd��u�-��<�[�8L1@w�`�������p�ܻ۞�925.��ŀ��U�g���%l9�3�3Ow8ߕ\d�C���jR�� � 7��P]V�)2�L�Z������riike�?GƱ�4=�B�ۜ? �iN0�~h��ƞҊͮ�䲋���3&��������VŴ��� .��
k���a6$�U��A�����@	�uL�cs��t��#�ھS[���C	Sؙ�Τ]P����i���j�$��K�˓VZg}����[o�+?�EB
7
<Ɯ���4fq����e��mC�&^B$��%ڝ�jlM���c
�ɖ}^���S�}��$�d�8�ԯn��L����zn��9�3�n��Dd�������r�	���� �E��8�d��;�P 3��Dp[h|O��c}�ӗ��Β�Q�̜�ڲ����>��Ռ����=�����$3fSLCz�������S>GV-	EM�,j���a¤��#��݄���ȓvT�뒟[>��{d_��X{y�"xu�y,�m���9h�9h�("�����5��5W�ۃ�q�N<d��h���F�KV�nq�����e���|��8M��IS�=�����=��4�;m��S���u�f|7@pA�|j����K���D�2�g��o*�Yps�b,�i�2Fz��-�~�t�f�>9gaf�s�ȹ�#x��e��0�?dC���Y�luBP{�9��U!�{�~ˀw��+��䁝�2wu[�\��I5�P�6L��}6� �Rod�.��=.~q`
'��FW�G�^w�ޫ�{��|�kb(�t�V�>2�ܟ� u%�Szg.A����+�d@���s���#F��L�
�KBW��}~o�NQi=m�;���X��3�W}����A(1Z|*���i��u@��ru�ou'�8�ݗ�����3j��fF1����e���\w�N�j<tڝ��ZL��� ��vG���6�p�Ϊ��|��E�wf7Ʒ(b%���`�wO]�?W|z���-��(� j4�s�H{�x��k�Dp/��j_3���(ͻFD��\IW�X����pk!��8P��ͼ�YD�i��4�I(j�H��r�b�C�?\"��^���%��J�\��?�uz�r~D���@�R����)��b�IW*O��M��~��%n�`K�Лm]s,�s��9�)\����Z
.8���&�$K9ȱ��ZO�D���Q�
��5�r?� �ܚ�>{�Z�8b�y�5���.#����zYN�[���YΛ���Q��0gR�K��L����:N�o��=��K@wL��ֹ�Z.@�'r�^?��e��S^o�.���I/���A�� ���_[m��8�N*L�FR��T��T�_v�>� �Ȃ�>������I�SFś؟�� ©�����S[b���K�1V���"��}@p����|&�C�5Hu��/M(܌�F���lu�J��Q^��4�J��d�TwL�X՝����]3
���(;cz��r;)�����=D���b��"��flыQNWd@{�]�� A���B�:J0�h��}�O��wk#MwHӄ�ϕ�F.B����ziD���������c��' 7���xun�}��Ij���ۇno�B�Y��&k�����L���!�'8��zA�V賙3к��<U\;���<� ���+&{lD�m@lʯ�����Q�����nqt�f�Đ�C#
gU�6[.⹾ǻ0~.�ٿ.���k�+��FnO�5���)0�����ޱVOBQ�e'Kvm�ǝ
�z=,v� I=E�{������Rߍ��{���������Ѣt0����Å���m�(�u�eɚY{���_�Q��#0����7_�ω�S�']��aMnY9졝܃n_`8;a��t��z��AC�f�zJ+����Z�/���s�]��s�i'�߯(�~Cap� �5u˭�m���{tW`d��Ň��C�2�u����8�֢
8��N�Z
��u�[�#��.��R0���w��	A�@S3������`���|N��C�o��/0�(�'�-j�L��8��QU�W���&Y��.���.�>�#���m�{}�"�u��Jj��e����i�Fk��է;��������R��7p��۩Q��C?�Ų�F���jv���i���
=^Уr�J�T�6h��|��v�My~xT(�~V+��ч��p����h\�D�u�r�����bPB��4I��~{�X+@x�����֣�-���,8W!�DJ�`>�H�����.�e@��1ti�w� ��z��ͨkF����qƢѪ��f���|t�: �P�2���Է{���˷�Տ���g�&=���Yg7I�ˊ��ŚP8}7�����<�ud�Bi������K}@pa����FfiNw���������N���W���{�����mp�ʃ�vܩ��L���k�������Y�ž`��|����������9pq�=���r��f�sO�{
λw��v;�H���PU�ͦ/�p*%�+�G���(��FN��ހ�:1K�F�e��~T��h�/����@A�&��l��'	��U�d���\�!jc�?�Y�F���}>�Y��d*�w��<�#w�,�خ���Z?�]���-K�������2��~޿̄;*��f��v�����R+�X/[D$����=J��c�I8墥P��{���    rm���G�u.��6˩f0��C���Ս��o8��"R5Q��#��0D�ab{i�?�=J���Fa�r���,#ž�d�Փp�Ǉ�����r��^VmT�E���� _�t0��?����	�{�V��;R�6����C��&�{�}��B2��lV�LW������j�&��=�N�^�Ģp#Bح��0(!!C;�T�
3��]O�ߥ���s��3���u+B�ު�|�{�>�!]���;.F�f8� Q�AҢ���������n�d|�S+;�r+�����G۽�!W&R6]S��� 8�!?Q��EU�����WLA8�mK슝���\9�Eo� ��z_�_q(aFtvL���x{h� v�l��t���a��h���X�k$m0����z��󢊿f���E*x>�[{�!| ���A�׈�s�f#���.d��G$��*��`�N��b���>��V��#�>~�*l�=EK�����=���ER1%Iy�-�	8��ͱ�c��m0ٞ~u?��OO�G�/s�"	��3��*����I�S���{�4�p�p�	�?b׍{�w�������'V��8�l�]�/��f_�Io���s��>�di�'�ۘl���[u��#���2�����|FoE}W��.˛�'�t������T�(�� P�`�׶6|��<��LX�4��̳��'h�=���M�ۂ��O;{�3`��g�FJP�f���K!��"|)����{
����:��1M�q���o���3���Od��De�k4�3x}E��(\+��3W�|�љ�l��P�^Y�����#7Apv�rn��b��D�^t����\�8�� �Ŧ���)��Z8sa��Q����7n\�A˧�jRD���Vι�|���P�0m���Q�>SfW���o�pA���X#Mdg�c@���'���;�X컖.3��-]��KV�OkI(jt}¥.au���DVeOR���0(!A����
Z�Sպ.��2>!���$�� Sk��	�s/&�c�4�f̅�4[☑S@��h9p�? (z����2��.({u��͕���䗙pc�X�z�8yF?bO��M� �C1Z�~M
�L0�b.�ܹ_RP�Rw����n��N��ؒ��-Uc��P仕z���&u�l�U�g����/_`(Q%�:kIn�i�Yʏ[�p#�}O:�V���]Db��=g�zn$`�h��vB���9~z.�	8�:�X�^�K�wS�X.��e� =YЊ�چ^L��}F�?ǵv|"PT:$(��͞��{��o#�D�p8���c��n�7��~~�k!g����[;p9ӯĬ� ���y��q�_�A	�Di��Pjő��3Gֲ"[���h�4�,wx~�,"�t�
	�40ǿ��M���ag�V��"�;7�ezi����p�c�E����O�˓k�T��]R�{��D�H6��˞��@��sOx����آ��'%���G�j�G;�Q��^`#
=(h5�����{2_������Kc?8SXBל7�-��耮Խz]}@pp��a˕�`K��Q�w���-,��e�i<׃6 kPӁZ�6�p1��O�d=ho6+P�`^��Jg�g	z8��8Kf�;�|�����9P��M�q�`�ё(dm�ć�D���cA����\�MLS@����o�<�ɩ�����'p����u罢c�,/��w�?����e�0�]]W�6�oL��/�����=J\�\0�����qe��u�|���oYp&��p9J����l�v�uq�uՖ]��kM_��w��02�K׮��D�\V"���X��BZ.���2�X� �ʲ�Ե߷�}A���(��G���NT����ϵaވB	
5�����L�u�Bi]����U�/����Z9������˞��ٔZn��(�s�݄�h42����%N߀�٤�7�g���Vq��B�X�y��s�*x�xw9�i�\U�u�����Sp���9+���S0̽��T��.[��-��e�t�����h(����)����ͫ��?q6I��RvÎ�����;�4�3�ڸ����;_���D-xf�sm���
NL�Srl���ګ.�9����q{4S�h��ۣ�T��[��Td�C����إ=0y��揍��ʃ�g�ԢŰ72i�_� qܪ�| 6�=E+��N��-�S3�v�l􃼵��Ou���yPB;����3���%�	+ЯZ��	.�2���tE�1��6��.����5�p&|/p�=�G��, c�X��tx}ρ��5Ǜ=� �t��7�ȯ]���;L���z)#�PV?�b~��D-:sf�t�=]�����6�_��	�T�36�)g/k���1����dNyOWg��Rl�� 26������&$A�ݣ��5C���&Ε<��%���Њ��x���m_Oz��H�KwF�`>��g)yW���t}���3����p����o ��b�ۭ���	�0>��7E�OP�|O��r7�p��� f�D��j��V��I(��?������&�܊+r����TG�	(�dݑ2����i%���p8#Nђ��\�fNl���JÐ_��e5�p(�7	~:I������߼��w���v����RmZ��2�ZU���h�Ȅk�Co19A+�M��s��-��7c��8�n� ��M�q�����"����D�oW�Q ��j��'�hi�J�ղ?��'�[�W�_��Z��d����Zt��ŌB�jI�U�=E�����1E���T`Y}�r\o{���o/�O?���*��
�����<Gğ�]3�<���������'�=RQ�d�v;���E�HRN6nS�13�HDT���N�;Ӑf���:�&��?6�<˝8�s���t,�H�=���{O��0sE�� ?`y�G�'���A=g��uPMSI�(A�����{��tl#����0��d7���SԴ(��ȡ�x,bH[�#ݗo��' �WH|~\'NlJ@^?��"�A�ph�[���f��"��{]5�P��3�>������y������o8�@mV5�r��:�.�b�j��P�L��>�l��������?����$�t�+��y�V���(���|"p��G$�0;Jf�Ӆ�ԟ�}=7������d�
}S����������n��H⇼Wtr��q�(����B���"�I~/�ϾmT�I������#�=c��}�(��+q���} �!8��t�sg�t\i�ڈhb����؈�5oD�kz`������n魩�է�&��Qyk�op��	��+z�i�^X�ѫ�m'� )��� �hY%��2>@�i�|�҉ܕE��iD������m�Tq���Ϲ�m{� ��ܢq����
6��cn���9�đ}�n����F��4���SA�<�x���ys�`�2�6�W�h�X�Fy���e��J��\��b���d��u-�x��������B�9̊�!��88A�����ӭ��Ƚ�L�� vsEY���{kT����{�Vq(�V��~�����զ�rZ�~�7�g`�Gv�s�BPo��YP"�"�!��&t���/`��j]V�ʳ���&�.#�U������-Kl��=s�I�� �@1�ȿ� [�ʃ{�S��O��m7s��V��'����{
n��yy��c�	fi�TT���޷6�Pb�]�Lp��K�iA]��9+Q��ȇ�%�/Nhڡ��쬜ǈT���2]%| p�N�yʘ-;cc�DJ�j'��GO��p������ݝOIBu�{�5�P�N�x���-�b�I���z��|7��Åb�e٧�=/�����q��A��4\#��x�[�;A��M�i����E�d�R�UJ�<Ux�=g���ɀĈi�LQ,_6�`Rz�d��Íp�<Rv�$3â�dcGf�b��2�'%`j���T�i̤�6�K�_��j��Wg��hC��������/�p��cO0{.v�V��Ү����!�C�系Y������P� �  �]���"�v��_g��U'��C֓$�]���i��=~}����rg�F�[����F��t���)P	A�L���e�����/0��0;�3�l�@��d�a|]�������p8m�VmRX���+��>p�z���=w�(\�+Ǵ�H�0�٧�i�?�(:[��� �s���'���Z\7b~�%����$YaD%�|W"]�n> ��у?]y���YN�̴ER��[�"ـ<�;�V�]�w;���-��6�DگC��������x)�Ƹ0m	K��Ѣ��T �0��-��l��V���%7��hM�Ô���s�D3?3V�5�m�����.�p��j�nU%�Y���a��{æ�Q�Z����x?��J�������p��׌�������$����B�*Y�Dv���V��+��Մ�+}�����������
����jm�����~j�	ٙ�6�9s�r�b���8]P��[�0��)7i���y������VA�a�����?X����`�(���2,I�.~������pn�W��u^���;9ӡt���	�\��l��PH�h���~S�$Q�[��oÞ�a����\*���t���j��?�����5@��:y��n��V�����ӏ�?Z����Q���-aٮc�	��� ���x�S?[�v��3^F�}rD��R�8P����x��(Jw:ASQ@�p���D��f�<_�&�d����Ñ-@�����ڃ6��j���ư�`��m��KUoUw
�f�e��ggt��2d͐c�J=���o����0���
�~(�k�qA�}�<�ܹTNu��Vc��۝��#R�S�t4�^�HG������x
z�-�1Pk�a�o�o?�Uf�������v��K�M�렃ñ}o�n�^b�7��Q]W�����\>��L�C;;mmN���b�.V#�Opq	tP˛>�b#-BZ�K��E���߽�ߝ^S�F��K�Z(��<�������-��p(Z��ն��U�\��g�CǤG��h��|� ����'�����އ���}�%�� ��C��������(ʑ_�Џ�S�j��ǘ��R+���QMR�êB��l��� w2{�9#�b)�OuA��f�$��C�hpf)H��t���1�@)�">�{���Z�0{+;�gs3N�%�,�c|� �����b!'�kxXZ�A���j���7\k�V�A�\2������~����i��      O     x��ZY��<���_��9���w�82)(h�U] (28��/���zN�6$���
����a�jp���z���A^�=�&�Ђzi�B=r�r�&ӹ3�����A��1�K�]�����ɮV�|~Kocd��E��u����'@���]������6C����i�Sϳ�ra٩�G���A��j�.����|4�^;b�9�>�� ��A������2k�,�b��3&�l���Q��'���z���a�7!���R��E
Le�
۳�vdڜl^�Z<~��h�~� R]��.Q���/�Uhv���	�� �O�^�_���f�յU ����Q�'�$Ip|m�f�	h�x~�T�X�]Y);[P���`���`9k��c�{� 7������*j��/8N;�������Ơ�������0��T�,��2��q������8�r���A����^�;����҆:�D���h�I�{�c�5�����E��;v'�.]����{��Ặ������"��Z��i�D���8�~��J���cAzJt����|h�F�(��$?�KpiY�t����_q֨7�4a���]�x��Xq��v�b;>�(� f�S�T̹����s�ɞ��ow���Ny��l\aeEn�Z�f�82�p�FU�,[G���r�}n4�&w��-^�$����a���IWxxz�*QF�tϷ�w����&ؼ o%���hdmv��2����'���#�O#d��^��u�v��U��?d�i��ʰ�tr��❕��B���$���P��q"���m]���HhF�QC"]�#1&�A�Uq�r!�M��F#F7vC�S����@��ں`�r3,Z�������6�+a�׮�ң�A���L���Bʠ+�Ѩw=�8b�wĭ����ܢ�b���#��x=��ZT�C@�Z��KD�xA#�΀��T�Ѝx�����æ`�+6�q�۴�b�'��s���ЊA,8�Y(�KR�D�:L��<�iƬXDʥ(st�@������Ӌ��b;lC��l{ x�dj�w1�YLm0V1��r�7��J@'B�Y$n減A+Fq��}uI���d6��Y�q�/�Y4��]�	g!��x'����ډ�����:�nde$"��a���vEU�R�5�s���'�O�����p�B�D�V���"5�)X9Z������H/�XP\������Z����zҙ+��Exd�AG�gZ���Z� ߝy��%Q[k�w��q�}4
���il�)(��n��.@���Z��q\5��:��j1:��C�fb�.�N}��S�{�����#w��`��ؽ��-P�|�m�(�b��U���i�=l��w��$���B���5<����1>���)}i���q�,܃�k&��6Fvq�K"P��	��-�2ӎ'�}���e�K�:�@i�d�����#��`�9�h���{	=t;)�ʯ�ōq�<�8����} ���b�[�F��Z��o�����a �u� ����Ub�TaXY"�Z�B.8c�$s�$�y����1i�X�λ��ּA�s��������T��"@>za�ۀ`|̲f���nYN� >������b$��W7�{�ͭk��w3L��T�gm�(��<=K� �1�/5�N�[��D��ݨ6%E�3^�;�P�>�3h�Us.�aUE���I���Z�~/���aAb�<�G·�4u����1��#��e�<'�=@�����F�J�AL]J���VFH�%�{�\��~#|�����j<�`��vk��˽F�J �#g7�)ۻX�T��^Y���6hP	dy��5����Jk�@��ڏ�A�����B9s�A�Z�� ���6�Wb����Vb���2�����a���߫3��*1SK�+�G��b؂���x"�a���[��1ӹ�)�D��Z"`�3����������(g��o��p�_�p��E|�L4
���^�z s�o����`?(����_1�9>�)��35f�uu�,�����b �u�3���ZS~`������l�� �ʻ�ʾ�cy���m;�Qy@���|s:H�E?��,xQ�lu��k�+>�`*eU_Du'H�׳�*fF�4cz��vn�d�P�����h�њBZ�k�=�_�����dr�o=���:�*lq`��(�b��k\{�'��{���/K�\�
���nC%6�䤟�@�њ��I�n)zA�s��1�]�B�X�G#hņv竍�;^�莂�������F���h�z��NקA�N�l�h�&���F}��t2i8���F���b��li���x��,I �����%�6�J:-�����E54�x0�+�F�"*Z<��	�<��BlYJ{2,�X��ǖF�"*�b�:"V�~*i�sIz��B�k��U���2E����W�^V܀<��G���lX1)��z�F3aB����t�`U�A���C!&K,�솎|\��Qږ;���5���"��L��9�zeLhq55t�=~�I)T�Sx�c��ѳJu����O>��"M��jhp^[%����,�=�Ώ�4�(�`)�6簪fJ%퉟�o������a�	�</�����L�IQ�;qbo�DH\�h�6P�؂���4x��v\��UM6)W��'�T⚲
,+���y(@Ⱥ�O�c���C.Na��+&�ۑT�|�z�;�DF��/�^Tg�
"�w�c4qW;����+�L/D���џ�`�y�\N
J�	������ꗯ��g7vς���ER,�߄�҂4��6�����.d�^�$ͷd/A(R#��Z�>1Y_������^�����pMPȡ��(�ig>��� ���e�)��2�/�G����fwGo���u0�g���N]�����P���Ԝ�H�U!�k;oa~� ���v���BR�egz\�5�Ck��?y���擵`�����=���;��kVo��y\��P^<�u��I}	�T˪a 0�Y����G��� 0��y�8�Q���	�����Ao5�-:ʠf��A���~mg��<�y~-�Ǝ6�5Y_o�q� 9g���c�+|�\ˡ�V��k.�/�p�w��hK��f��l�h� �� t���TO�py�w�ҩ�[���+��K*��21o��Hk'��
u#a8�@>���������0�-�/2��E?Nvu�3��1���.���3�h����gɏIY��H&u�0�Ò���__`$UT��_m%F:�km1}cz�x�0�O�z�DAc��2��7Q�������B�b�d����U�p+v��7T�
&0�l����%g�g%��q����(t`FDE�Ip�T��$�� )S�,jCq1����4�Yd��ؕ�£����_�"|D�l��C������=�pF�QS/,u�k�wH����G��Օ��k̒Q����RE�:�h�/�{g����'� ;�iº�v�`�A�]���v.w�?�������{�AH��~,v�W�鉷�4�L� ����9�e,.�G"��`��"�ȯr�@N�ۣ쫀*�%����i����t=d����R����,�6�~j�U�:�M�Vyӆ��\4#*��n)J ��TF��](,ȝCoD���� {�%r����9E��Dv�AKNY�dQ��n�{Pp�uϽ!O�"Ƌ2#�j�����~��p�a�O�ʵa�O�ϟ�|c�&�g�.����j{\n��m�(a'm�y�����J�b>���.w6���i��:7�ν�ҙ��h���^�����˾ו#�� �h��Q����1�����i�#Zn{H>���O���/=bx      l      x������ � �      n      x������ � �      o      x������ � �      p   <  x�m�Mo�@���+�^5����Im�F�ڤ%�2v+�~}�M��6�f�Ó	#g����ٙ��-���L0:ꪁeLF��T� �`wT��pWbV"]�L��(�g�G�1=2.t����
UwRR�H.L�vI�U^���S��l�\�3ϔ���Gv9�U�_���5��l��vw6�WiO���L�گ�긮c�q�Y���o�[�	���a���}b��?����4�g�H��]�A�b� @�t�MM��c����dg�s�0\���P���|�^֣�� �_H�����_��E-˳��f`���      q      x������ � �      r      x������ � �      s      x������ � �      t      x������ � �      u      x������ � �      v      x������ � �      w      x������ � �      P   �  x���Ɏ�P�5>E�@w�Ƚ�)e*A(@Lo�'dpD���JS���!$$',��s.�V�)�j��(��( ?As	�� "? ��e�e��_����,X^��j3�� ���{��:Z���2?6����F�Ȝ/}CI���quT�L˅YnLS՝L��I��������Q�ޖ��g�����*�C��PB� !ig���dBe*ݹ��;��u����j"�\?�䍙� ��#�;p��e�d�����*'���+7�o-3d�\:�t �V�u��/%@2~��d�-³�:&z�I�e�{>/=}��2�kAb]Lח5j�T�D��N�+��E6��I[���� E?�8���L��ܔ�P|�-F��sv<D{��Le���o��]ABM�$�Q&�$驆�����ak&f�C��-[��׌]MJ��z"PQ�F-��3o�s�W��n2�_�9��4�sg<ϋ}>o正��2�dj�5y�S�fP�2','�S�V������7� qg�Ÿ�ĳ�?��,0���c�jت���o�W�\�HBݸ��]#�f���-�MK,��I<�6}���[Q�\ ��?��� A3]k�6'^3q�+���ڟ�}���ز+X_����}i�q�J��}��&PF�s]���|M��6��'Х��U�]|-8`�`B:}A��ݚ�wl�8�S/��c훽+V��/�O⪪|w�6]m��(�z��Q��H|J��"���z�ٿP;      x      x������ � �      y      x������ � �      {      x������ � �      |      x������ � �      }      x������ � �      ~      x������ � �            x������ � �      �      x������ � �      �   �  x���Kw�0�5��.gs�$;-U� ު�3T�K�U���'��
xZ<�f���#_�+��G�)�����B3@kQ���S��Tk�j���@��{�� H^���Ǡ! �4�p���@=˟�[o8Q͘5�^�vFY����țx���������v�Sb~$ �MS �R�n�$1&ݳj"�?w�^���xX��!Q��D`���@�� R�gH��K��aw\9<W�?��;�������9Ja�e���{�G�>98.lr�=T0x� ���	�c�2A���UAQLȌ�8��<vJ��3�5�F�*�ϣ�<�1e�� �z��^=�+���f������Cb��4�Ꜯ��3g����٘����h4Pd4?�)�!�?���Uۍ���i�zŋ�3&�dQD~�9^���g/��wZ��5�@Y酃�8�N���bcM�*�����"1�!MT�u���Y����j-su�~DA�(0hu�n���`Ѯ���� ��<0�l�ρ�Y����x(�2$�X���/x]O����a��~��8��|(���g��a�X�-f�����9�o����)9HG��)S��汕[���o��U
e�����Y��\"��';^����-��
��5).�b!\�"���]��y�������V�i���҄�n��c��v;G-���/�ќ��>g>v3_��S���?���&L�O      �   (  x����R�@�����gwY4��3���0ƛE6���z��љ�i��\�9s����a�^L��_n��#�T �1B@���������J˾uǉ+D"TG���̤�P0{ ��tUŋ�:pGYj����4��t�)�������fb��M.U�z�J��Ŝ�&�0_AE�X���
��K��@:/v����d���1iKe2��7�.�2�M*�����rx��V����i����;���^�#�՝�t~��?d�ɼ���-ȽW59�y��*�b�����i�7�,��      �   �  x���I��H ��+<VG�d�{c�w5����"�ۯ�*����'�@d"��e�M&8V���%��K��_��Qu�'Z_얫�F������k��4ƲL��u�A[�� >�lk�S�-��4�SrP�g��ka� ��:�d�d���umd&����������緊u���d���yi�PC�s)X���j��b���\op�����tȦ��2��:�ed�tkQ�~(���=ᅰ�t�>��S}+k-���OЩ.�$� �{m���'�[��H�(��1����=qE��;]��5�vf+�V�m���aۍ|ה.~��(@}����M��~��D��|Ze�������������{`�4H�8�Q��D/��@.T.w���K�}�"ѡp{wA��s2�pq���Z�PX��K�>�C@��
.P�F@�&-J�h0�G�	��4ŸV�v�J�"���%��.]��1C����]�ߺ�ii��4c�N&�q)��+Ŗ�h����"����@aΤ�ᶗ\o�١�s�+N0� �q����4�`��p�N_�]Hߺh�Ԡ�_�'Yy�]��<RO�z�z���Pp����f�7�<�p��Lg�N\ee�2����ץi�q8��	����3O�z�x�"���4��	����JJy��ͳ�0o�Z:�F��r�S��@I؅�[��z^(x��V����)<��`�WLe���8�x=ҭ���,1�#�l������g/���i؅l��G9��F=����2;�Œ��xc��\��6kyD�a����Z�+�H%E®��km�q=�&ˁ�~�`W���)���>��%�u-}-\���K�gM7n\V(֥T��WX<wB♹(����01�|Ý��I�g43�ϼ�d۞Q��Ҧ�^N�U�6A�݈Jq�U��]�d��N0�fs+�&��<�F��`d ۥp�4RA-P,�w�WWFH��V?,��`���s�_P�b�6r����q�6�V�9�Wò��-2_�/��8s����a�a��7�%
��������|�|~�F�hi%oZ��>�
�)̗�G��l0�a���y� �h�^ua+aJG��q-�"_5ص9%$��:���Ƣ]/[�HՆ|?P1b����X�4��z�?P�py��iz UBН�~C�f�_G����v����ǌ�-�G�|�����7�٠Z      �   �  x����n�@E��_�H��L1����3)�2�v�E3��n)�)RoZﮞ�nn�����ܘ� �4�ւ�v��c�u�`v�a�^x��̭��ņ
�x�`J�^`R2X^5&H��x�g�}u }ADx���OXV�Ԗ�%_�����WGz�T���%xY�ѹ�/����� �����3���UDT*���p|^�#�	3�2�dZ�"��8�Ch1�o�D>%�b��p�;�`�r>�}hc���l}Ԗ�/v����ڣ�=��4��&|F��u�<(�����J>����>�^��)��� �I'��%It5r����!�6�8�Ood;�/��y�쳅.��!~���pv�e�veX�҈~[�|��y!���t�w��JȷQT�ؗ_�����_      �   v  x����r�@�5~E~@kFv* �@y����A����HvdAY��S�ou��3>�R��-�$cZ�i��^�L��c1ĽX^c�OF  u�EP����8K�4~���߁�N�_!H$E��(�z��3�v'9>b��s�x��^<��W�HBSGJ�)~�W�x{1e^/"�=z�嵋Y*�^���6A��L:X*4������s�x���6��<�E�٬����tq��2��ͪwz�~�9�%��wfc�&L��ω����L^|ߴ��ᡀ�o�e���U���jt�����z۟�Fߓ�<-0����gu����Ȫv���x$��r��M����jX'��N���`�޺��Q�P_8�L�ﭠ0�_�n4~ �SM      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      Q   _  x��X[���}��+�y:��p����!'
"rA4���ɜ�h��ezR9Q,��FԵ�^��>����t�bOF-`� c�	��2�[@�y����;�A �m���w��/+aTh�×�ץ�E��j�cQ���@L��لYyv]�`Ӹɉll�#�S�����؅y�j>������uЪ��"1�6q�� �O`o�-�a�`1���*���z�J�oeDQ�pK#!�-�`��EfɥN�R4~�dxj-An��(~���0!�A�v5��c�e�2/@�l�X��at���˯�k�#��)���]� �ѝ�,�E�������Y�  �����˭x�t��H�����" �@��c/%������PJ_�V_��Jȑ�N<��j5'��Z=�vdӱ�nhZ&~J��վO%����*���/ #�T��L��]��74e������h���i�=��K�SGUL�ˍ(�%��-�A��b�;�c��7�;�6NfT��d�A����31��&��chC�5gY�h�u�Ҿ%�r��c�z����~�u�[�:�#L�	�(4�U�f�B�l�����%R��L���v�-\�vm3�by���<�Bu4q+���6]��ic�S���R�ᘜ`��Sx�Y��1rs�Z e�қ�{�Ύ���-T+�}9���@�/���B�������"�{b��0���3�p�?�TNf�<x����ѥuZэ�,:�'�
�"Ǐ]1�
�v�-��{���V�G7�����;�	*6N���CYA��p(wP���aAw�vU4�*��8ln�zbgH����$Ƿ0d�5�v5�Bv-sm[f�k��M/sI�0�w��!���.�a��>��_`5s/�7(Ue��h����kw��f�S{��Q�{p�P���ƨ1N��e~�r�)�/
�q�m(��J�P̆���	��gA�Ph�G��e�n�gu�'��{�c#��E�E�Hj=��㶆i�р���%�}~Pܜ�i��i�cR ��
�j���,e"��1�����է�.��w-쑲�1�@c���lٖ~y<9IDJ��6��&��q-��(��-�=Qn5�8ԗn�⵶���p�^��bDt�kI��gqf�����Ƕ���	ۼ7Rɀ̹�
�g^LH��g����ؐ�h�*����&8u��j��-Ę���د�su
1?���J��[�S�T�Y���!�=Ӂ�WS�.�CjeQ��4n��������m���D%m#{IS��ߙ�O+�s�_+�AH�|<�U<RR��^�B���!�.�`������exr�33���,Z4�|mד����xB�p������,�j9�1�T�hM�0�`���Y�ө[	��ճÁb{�"�i���f-�S7y�Ji�=��f����6�qlNMF��i�D�4�竫n���h0%l����]~9.@����A�`
�"0���3@����]� 9��c85F�ЖH�7��c_��Ͷ��w!����/Q\%�Ƣ���f���w��S�VS�?]����z��o<�GV�sL��~gdu�s�JS�T�^p���ͪ�o���u~�����5�acl�fCxJ����/�c����� �E�����i5���ݓ��U�AKr�p#���E�چ"���:��iC��SРS7���}p��\��~��XTd��( qV�r$�M�sM^�{���[w���Lc�/�W����������d;�i
��W)�0�4���KSe]�'wУ�쇎�=�&.V�MCa��� ^�
��B3H�>�"��"��d��`x7izQ�=��!1F�/95;	��K<��F�l��9j�����OG209r�O9��>|��/�]�      R      x�͝[s�ڶ��ٿ"�kW�����7�rD�΋��r��5�^ݝh �S���Re�2>�}�9'"��N�/�=KQc@�Is���t�1pV0�<C(@ ��������Xe�&��0���O��/��g��@�B^5˳�E��/# �����H��U5�p�p��y_XK�Ee ����'D
F1�ǶI���?�&��7�PGB~��?>C��=a,l�I��Y�"}��!05_���1������� ��GU����>M���+|$���
���'4*��fΪ9��Fhd��T@�E�7F�Y噢 P� ���O���/ q��O��hw�T�:����[����Ec`�<&� B�|�3��W��	P� ��������$v�>��*�R`�]�Y�3T�[<�E�8�vH8�7�RȖ��s��x�����-uԬ��u�B���1
����5���hQG�����j*3k��&Ég�П%C�/���`�'D[}F@���T�i���� �)`�z�x�x���\0Nu�Š�G�}`��RӚF��o�kt�0ޡ�>�E�3!�T<e�6:��^p)��i�'�LژRE�}��N���=��'�`�I+��Q߸�k���wqAD�##3 ��.�=�y<��0�?����I[%�,\��ݥ�w͒w٩�xi�����re�� ե#z�^��O�(�|��~�G�-�A��lG��(B�Š��ऺ�ɏ�a�d�����8��Aѯ�JP����Ȏ��bw�Fi&�w���Vƒ��x���c���4Ϣ#�y�"�zA�@����z�
āQ41��=~�L�V yb̣������A���it2�s_��s��G���L��Y�3���~��"D��^��Yً�pYO!�)��0|Z$�e|m�;K��ܪ4Ɔ&H�������9��i�-s�]�Ā�_N�E�߀�(W%݆.�y��@�o�/(��Q�_��#,�ifb<�_�k[m�_�����B��0F��Snt��n��T��kG�*��U�	���kM� Ntͯ�8ֱ�����e�3�5ҥ#��$��f�{ɏ�W&;�%ؑN�q��k����ܡA�8�_�.^,�!t��|:ߧ��E#�a�A�����N��eVo�w?C�ͽ�����U��-�����xP�:����XA�Sb
_q�[�2�Ȓ���x��@�c��['8��|����0 �����}�/˕�L{l����ǆ���(jP��Y9V���Z���2` �d�:PFX@�t��ǀ t@������M�%���g��R�d�E����s�8Y��,��S:�'�h�4D��A��}`���Ձ�F�8�c����@II�o���}�?m2l��׊JĻ�tE����p�Xv��!kr�� M?_V_J0��`��'����7٠��&��iǻ�}�|���/#O6������w�_�.��V�|��M��*��C�AU���H��bvyU=1�t�Ko�������T.�0	�(�����[������B�O��ޚ�u��0ݥy����.�U�h�^�#�@�;���8�񻴷��,�#��DtC��R���Z���7N��_��u]��Tg;��FA���0�~3\a��`����0�!�ʂo�^= ��M�y�l+����G��J�e��#mR�3GU�����/�p���Ps>Q��8�7����u%�u�׉�荴X�
}=\(���׵�>��ˀ�ỮJ���c0Iˆ��f�}�Q/�]@�Ys�R�_�3���׭OvS����Me�EיY�ߵ�u����Y��ړ�=)M+ �=��f���k�Q�H�q���3�'�V����ަ��`�0'��Xx�8�j�V��@��W�E�����ڡ����P�k]?��������]4A�i�z���v̴�y���e2N����V˖9��v����&��y�ZpVb�o֍v��E�[�]$��*g��~/�p�
:�P	dZ�ƋW_�VdȞ�Lх�n㟥ގ���!k�y����lc���v;O�P��f)9�r���T�+5�?ڨjϷ*˜�U�*�nա<�86dJ�^�U�$����Ao=����u���g���ds�79��#ZB�\�_��]U��as�<c���/mC�WY�Fa��NTȖ�������設E@��.�>�$$�n���U�cR&�S$�BQ-'Ǩ�K��+`5�F��ƛK�_��*�us��
���Ψ<�	�T�*rw��0�{�q%���C��iW/���:��;��$ڔE���s��Nwz� 0Jt-�w9����`"8?�h��k��8B��*(R}_ �mN�;P\^v9&��c��N�D���4����i����[i��n�x�LppS�R]�tUrx ��E��̚��.��*[C\U��r�c�����r���	>j����~��2����5��� W�R�5l��5��D
�4k1��I*'�������g��IɌhQ<oν�<���d��B���f�(�h�������&���1�CG�t�i��J�a"�|y�s�u�b��Wᰙʹ*-/�����j2���I��w�V+F1�M��N1ڍ�B (���]�L�8�7�$8��#����d�{�wβ+��28�A�Ef[��{U;�).U	Z:�<��Ɯ$����s�CyfY;�6���~ۉ���%��xR��=��Oz꿷Ҡ��6�0�D_$����BBt�6����3Hn��o�.��<��'��ݴ�跿�hj�[�<����x��k���9���	):���U�)�<g���1�:54֞��ti�*H�g��L���0� �ߌ9��4r��N��?�Y�Ȫ���"ӫ�J�Z��72�lD���Ě�ݲ�ȷ.6��M�+��{M�"Wڌv��7E�R�'�P\ӊ���O��k�Q99��/��	�?�ޯ��st<'kW��|��?H�=Of�H���yN����̿�w0C�ĺ:���C:`���{��.��d�jlp���cx��a^e����"�<:�JK��2���*ZB�<��9��/R�_�m!z�n�l�Jf�-�~��V(hp[U�5�<��9w����.5ix�?��҅������.3���>6Ǹ�7��)��\&F-Dd��α�41Zw�ލY�¼����Z�&�a#�9o�������O5��a�,U��Ne��"�u���7�-h�Y��ݎ�1��_A��c�pRO:B���o7��R'�0�?*��4�*��9���Y�+a���sd�lQ�-f��4�H����:�Q���p�4��3�)��b�O��?{���*��YN�tqw����~�"a�\��t��K����84�F�(���6�hEE�����qNN&ⲉ���J��m>!,I��{O?���z0�J����G��~��ݕ��"v܄S42=y����ۣ� ��%i��2r\���V���w�R_�T�+����cJΛ�J��
� ��'uO����a�ʺq���I��R��\X*�б#�v!�b��$Q��� >ܧ{x~a�a/Ї�.aS��c�d�F]8���v��,�zOڔQaFd@���.�H�Ѭ���	=�`+�{��]
'1q��R���϶����krc�\�9�7��O��x]�w��{ l�� +F'*�v� ����/<�2�f���TX0b���[��`w1��+�*(�y��Kk��+�s&��Nh){ ��yt_�݅�f�X�={����!Ȯ��]�Cy�@�2�ͬ���*�!�c�Zb��'��o`2�r�:m�� [S�!¼����-Bϊ�}䯔x}T/�ZR����M�cD-�(���/k�>��ְ��,40�(K�5�X�h.�ԣ� ��,�K�la�>á�>Fb���Ŀ-�{|vѝ,���Ϥs��G����v����#��$�I������Y�)G����ܧ3 )��VY�#�,���q���tY;P����v;M���>�S/ ��gzYJ�O�(��$�1K��ш+:76 �  
��!�;��:�.x�Xx;EWiHy�+�%�w��]� y:�i��ir���*WsЅ�lGWs��1J����g����^�;ֲ8<�*6=�1��FwO��xC�]J�XMq��n��j��D�7��NV�i�a��[�^*
ɾ���N:TcF&��;u5�W�ި�RM1�>���醘t��=|8�c�iٸ�qy�:X��0�Q��U�@2�y�UET�>����_U7$\tZ�9�R���D�7p*(2����vvqj-�z��[D�+�#�0!�e-l�Pyl��~؁���iC�\�[���?+�Iф���|)'3���������`qeXO�@`:������ ]�Se��ׯN�q��찊�9�oV��]Y��L���W4�n'�6��N6I��E�1�� �t[Rua;���Ȫ�Ͻ�u������+����FD|��OV�5w�ú̈́��nUe�s�$=G�*���t���δ�|b����9��I���M�C4#�q��:��+^Ǘw���W���+Z�v�e���������Q3�D >I��]�������5?_(K}�q��諸A��ӵ4+��7�����]L��}ך��4�r 9��'$��g^4�m��֛�/0t�4Q)i7�)�����\S���[/��@.���_S�����#��V`�;�-!X��~��IxG�ϝ���!�
�P)��_�5�_��P�;��h��Ǐ�B ��ĵb�&�q������`j��h�M6٫����ᔪ�+��X6�&��U6��Z�*���;�F�dC`���HR�]�e����c��G�U�!(ʝ��&V�n��c���ǆ��7���YҒ��X8���D�r�z���p��(;݉/�U.٣���F`%穑m�;ʦ~��Uӧ�$,	9Ǥ�3�ǒ�W�T�r�]�VV�!aENw�
���n�I�-�]_���9۠���mh��F����d�z.�G�M�{���WU}֫`���OW���?�����J�r�%5;�V��ٹ��yිգ�]`� o%罟n�<�?=X��tb�K9z��ߩ��6أ�8��T��d[�ce0h��ׯwN��X���Q����B�o�r
nq&'^N��a���N��A����/��:9��jv��x��7�J�F�B�
�qk��<a���~O0��ŏ-~|�<fM��nF����g�'��H4u�.��H���|�/���Gϸ%��R#���J�G�Mՙd���am���Ɍ��?k�.���	w�hS����I��A����G��C��y��z}W��vBO�Bk�mm�f��I	��=0sj�O�I�o.F^\�?p�����2�J4���0��d��-�OZ��s�l0[Aeñɩ��%+�5ά�~v/$T�ɟRX�J�y���l6 N:�I+��e�����5�.����$���2�z��CC�f���-�7/��ò{("/�'y�?����/0~��[�!&q��E9C��c���[mbά��8W?gG�����G��������hD{y�꺿�6��	[��݃[*�!�L�J��Ɠ5��b��x�˭��ܟ�KXڅᩕ���-[C|�u�h�Ñ�`�W� l�4��!p.�^^7�.�N�Y0'�@���+ݶ鐷/���&^�� ���ˋo�D��X�i*ñ�T�3�T��#$�	#o��ZeqC�������:"��=z���wt"��cq=��6ʘ���0�2�b{�,���ķ�,o���5�] 0��u<E�u�h�����. �A���s!�ؤ��-�n�W�t:��i����  ���3 ��щ��e��ci-�u�["����-HG�ne���1��ï�^��5ڔ�F���G��֚�ի��*I��=9��dm�iF��#5�-���f$����s1 �ǳc��+"��+sZ��V�Q�΀��Z�|����p�K�$��p��M%�p���S��A�%*AF|����V�	�d�Tߖu¢*I�Ʊϗ���?Y���b��6����cλ�R@��GO���"?ZE:�>�M�q{ vD��N�W ��} t�P��+9h>����qWCp�/'}����Kd�������UA(ћ�\���b/�����#�~����'�c��֓��s�u�B��p�D�Bg�^�������.<ݮA? J�S|�*�RUe�޵WЯ@]Oa>੏�sP�H
�%#���%��O��������ע�" A�p������	��b9^�-�p '�+��]��)1�g�F�?l_y~���7��R�hB2¸����M"�XA��qj�����ڡ��4�/��ft��cl����v���ӌ�.�� ǌ��-������E�rrnS�na�+5��2�mf��y�����s���sH�L�Yی0|���%V�x�"AE'�r����ޢQ��U��Ŝm����Ł�R8Ƒ	`�]�p�2�
:�C���0�_Ca�?O��>#�Q//����<�^�r�j]�G!���_P���J�F�]?à?���*1*���il����F������п�������ym6��-74�Gd��о�{�u����ED��}��g��_؍���I�$�Z�~�:��Y/�<jZ�x*{�f�����6�5Ġ������[q�T�]��+:�zpYx[�� �nV;�r���v�~�m�^����T�/���rC�T؇j_�x2X��L�KQ��m��q/��FL�ᜠ!.�u���������"Z�Ģ怇P9�E���/W�_|��K�KG��M��T�Z��ٞ��D�a�V�R�~v������VѩJ3$l��ȕ\�⽷~���d�G���,d:p�O�����-mb��$C��*Vp4�E���2�lfr)#6��ɿ �C�w
����$,�庇܀^����᏷X�jM��
�}��V��7�J(W�b��*�v�� 5T	i7�����9�� �t�0��3t�O
�/�?.V^����RO�e��`�G#\��̃<ג3�k{�C�?�?�+�>۬�̗*����ޜ���z,vj�!A�S��q>���+h�R�I=�s�h�n���?��v�Q.vXb����SL�����v����R�R9��Y#�Y}(����n4�Mlޗ�T#/:y��;5��q�]?z,W�5N��:R6��q_�mv��X�3�%U2�����,�>�v��d�Ś����z �Ϡ���Ĉ~|�U�W<��gb��He4��Ƽ��R�Y�Y�sc_y�_��@j�	
̓)I�TE����(�����_��3�_      T   �  x���ɲ�XE�'�"�U\�+�L��F��з�( ��e6U��fԋ(�ˀъ}�9[︭����Eiy������4Q�a!�n���ʙ��م�,v�"˫�~��dή؉I��C��N�j�ZB��r��da�� ���Z�9}��H�@o��J�3j�f�M`���@ۜ����_���|{�)3�P3�B��C?�]p<qG��X�299��rBԎ��2��D�����5ei�dS#��0O����?imS������s�M6�k��/E,~�{�7������c]7�?�VŬ�7]��d���[�8���ԉ����ԬP�%�h����Ay2�}������]ZRE���
�=-���i�]AҚ�̩[���S����}y��P�A[n%�Rʄ�(+@H�}�-��9ew���oS���|n6�e�aџ��xJѯt���~Y�j&N2��e�N�g%�&l�넛r���5�0��ӕX�����5�$e�T`?�b���oV�k�0�Yy��k��K�b��ۗ�_	rA�G��i/��+�W�h _�H�fg�Yl�=쯌�;��B7n�l�U;�*�U$�$�d�����6�<>3e?i��sZuj7���>3�^Ѐ�h���sd�����Y�*�����rC/�l25�����1P�i2$M8��vc練��w��"���+�+Vi�zsE�`x�Uc��NK��>�v��9�]�����:�j9��S�F^�i+�U�G.4�4��İ�L�0�I�� ����+�EvX1��$Z[�VO���y�型���8ǻx��x=�ֽ�w�t	��(�K�8ulwx���p��<�_�0�g��o��}�T�'��1EOQ�f�s�	1x�*�~��B"j��)��k;f�e�kKǓ�b�YA�Io��>&����}n}�: ���M�����K���Y�p�u+�;�	#�ܳ�;\L,��3u�9k��Q��}�&FgM��j��WN@u!2�ց����lE�bx6�.]ǝ�K�+}������^uC>�.Əa{!���W��7,'�@�?FA�v����þ�vS�����HW^O'�����N�q3ݲ=���R��.�t�����_��<k���;�ȉ�L;�'e���sLW3��(ͩ��gK���_{�`�K��_�|�oQ��      �      x������ � �      �      x������ � �      U      x���ɲ�ڶ���8s�iR�T����TJ-"���<�5���d|��� dVDr��^�_W�8:�!�w��Q����������#�jPb�6%ŀM(���YNo�mO�-lB����r�?i;�	f�	e55
��o�z�g	�I]�0-� 42g�� lB�K���'��M�tLW�&�e��1��WB�匀M([��ܧZ�_����PV�3��])(oά�Pv��� 2�j��h~ �X���R(�ϳ��	e�������S�&�����Yv]�=��M(�u_�bw���"w�lBYv�v�Xw�=0'y؄�~�l7T㚕j~�`�6[�}{�����U�&5\����;��-���䱦~��Lf��؄���U�cd�KUq��I�@\�|��8�}9��M({���'s���؄�eD-m�U��%�m6��?�o5���[�ŀM(����R������lR��d��v2��7��؄�_��B��دk"*`�ZKm�ft�n�7�� 6�g[������}�	؄����χ�����	��M�*4n���uF�wؤf�)4�w�<�ω�|�P�X�mP��x��o�	e{�<D��G2%� �	e��%���8M;^�ȀM(�g��[�Qۅ9�N2`�.�ݸ���'���V�&�y�2N�^��t_ ��Պ/��0����~� 6�E�ן.��Tq�!�"`�*���cшn�|���f��j��Z�$���	eݫ�<l�����|V�����Ե�h}��lR_O��!�̵���`��ڷ:�}�\��T��M��nFe'�6I.Z؄��S��Q��`��23���	�>��؄����U���o�	e7Y�rK1/ob�j�&�M����t��b� 6�����I�y��~ϊ؄��v�I�P0��؄�VG��߻��ONؤF��cd�qp�e<9�&�r\*y���h�rˆ�M�����t�K�VlR����H\:3g�m}�&�}s�+�b^���рM(K�]��43N���6��u����\þ��lRW	�i;�A�^�:lRG&�bV��}�;���T@��zM�����3`ʪ�~-�g�O�QnX�&���JS=�/A�zlR���p���E���u�&���=մ�"��r� �P֮�TP��puq� 6�H�/�%����6�h���wN�t#lBٖ-�[�ڝ>��#`ʞ�^����1r�l ����>�I~l����C�&��f�,<�*�K�d[�&��������c�rހM(�Ҙ�����f�.lR;�q�u�I�s���I��5�������8�>6��l_ey�Wt�06�l%��G�qs�`�:秾L�l��/�9�Mj��_.���H���d`�Z��6��0a�i^��I��j��C2쫓���PV�<|��(�|<��I-j��+��(�Vn��&��5�����}�
�&�ݍ�B�>�y�<?��I��
vǈk$q��9_��1�Ie��;��^n�`�:D��4eo�w����lR_4���v�����7{�&������ܔֿm}lR�-M9�$������lR�f�802�ոݹ����_v�o�}|�X��G�&�5�I�]*n�r}Y�Mj���jp/��$��؄��ed����هY]
�IuV���ۥ���X6�o��U�J_3�g�y�&�>�e���VNVa6�����d��y�&��� 6���\��u��8v�`���YTP�̽<d����M��ĊMջe�9��* lRc��(i���t�{�؄��o&�}�OK��	e/��V��I�9+`�:�V��,KU���d��M(�w;�s����Q lR��^��U�y�=�Ԣ��^�R�l�W&lb���.�>Y�Vl?�؄�����7F}{�a
"�&�+�w����3m��h6�����Hq�v�ؤΥ�ۥyf,/4���6���}Kg/T��`�ZK}����%\v� lBY�r�������r9`�:2�b�f~$x�g������csxؾ���&5��{&w۲��,jπM��C'��0�P�4 6���S�C�Ӈ��s�	e�K�f�o�]��3`���G�9���ɮ�M�&3��7x�1�|� 6���������`���	e�@_6�h�`��z9���vY��}���T ��-����ÉlBYEU����*O�؄��*߿�?vm{:`�ڬ}�{~�~���J�Mj��ڛI$�Qf�f���'������9�K�.���'���uܕ�`��.��;�Y:�r�6�C�����6毪޼:�&5���V���lRc�'`c�	���έ�	e��qrC��41r�	�I�@������UAb��MjL��!�EϤ�j�6�V��+)o�z��ؤ>J��y.��],`�ڌ�:
+ב�?K�&5Jm�u['��殔6�O��%���T�&uRcd��<����}
�	e��䍓ۛ5��
���"�-��IPk� ��yr���jT�L�	ؤ^���lS__&>�)`;a����:6�S8�(/J{~~��J ��f��ge�Jz��lR�����	+�Q)��	eo��-��Z�;��j�&�}��l+>Y��)F�&�l�W��v]��N�рMj���6X+�&V�~	 �P��܂	�Z���QO�M��D�:g���S��ؤF)��	t;���8��	e��pK�%�n�u�U�&�����f��c�F`��s;&|�}�T�[�&���N��*s��ε�	e{���$h)���'`�����P�S)�������f�w���|�|��ؤf�Z�]a+8Y�p�6`�V�LmZ�Q3�:`ʞ
�<��7�_�K�lR�0Ԅ>������7`ʖћs�]��ǧA� ��H��6o'z\��M(�j���9��(�5�M(�O���ڥi���ـMj���Ź�W�W��6��`���ߵ'=�/؄���iyF�~^��]< 6����&o�ѳn�`��V[��;���:6��~�w'���z�3�I��i\��_]��!`�Z���2��奔ԫ=6�l3,e��>Z�Y� ��4ϩMn2Q0��slB�N���'���,���N��!yڞ#Ӯ���M(���|��i��1��&���^�;�s�x\c 6��4v�����M-1`�2�~��7�~�i��lB٩li#��a��6�Յ�1
׿J�"EW�I}M��Ω�źu�6�1�垝PHU\r��ؤvB���/���Lp(�P�S��C�9�<mx}lR����y���=$��X��7��o7��$ɍjC�I큨�P� 9��':`�R�z���s���e?6�]Ae���1S�dؤ��l�n��yk�&�lj�-Y݄�� �P֞�wJ���Z���
ؤf�U����'�{�5`���`sU7t�6�K� ��F���S��Jz�oo�&��Ʃ������x lR�������^���^f�&����ќvYE�ۣ؄���A󄹶x�vb�&������^����
ؤ^�ȻF���W~���M�&_��x�x99���lBY�ڗ�Q8��U���P��I篟>��^��*`�:����<���J���	eC����lNC�_�M*;�e$�j�|��lR/�Az�ɨї�vr�&5p��F6��ϓ��P6�f�8���ztX9lBYm;�yM+�Q{��}����y�nzf��}�kR���ׇ}���O�&�<���}�G�)�~ �e7�'�1�_�����9M� �ga���	ۼ�D�:�qo`�,���X�b��#٤�ؿ���[�����ݡKKO���"��	_o)�$wlҰ�z��Y���弫��������$��~]���17m���T�Ox�

`���~_O����6X�21|ؿ�}q���*��uG��?���ge��{ɏ��
#.���w�9�� ��;9i'n��z쟕��W�����:6�5���2M�ʬ2�ꔼ���y�����0�(�\�R�~�ge���5v7?M�c����Ϻ����4'�v�ֹ�[ؤf�;c��!q�uI�����a0��r.�a�,`��'�r�}��Z/��lr�ro��zڸ֎lr���S跽�ٵ��K ��f(�   \;{����{ĀMnR�o��~>Dk�J���w?0��S��՞.���Or���Ɛ�c׵�l�w����
��ݭF�f��u�&[S"KT�w?k��>�U�ek��t�m �w�Mɷ�-�A���3�.`�bÍ�wi���=�������e��c�ơ��9����]1�[Y��t1�5k�����jO_��v�9��*ϼ�߭@�?ݨ����+J���x�����)Z+y/go��`��K�Z�HFcu��߭��f�]�=���~�K���?]a�e��a��3`�ܯ�(W_σ���lB�r����N�v+�� �I�e������^r��[�&յڈR�в�p߅-`���C��e�T�dJ�ؤ.w���&<����f��	]n��GKV���ξ,`��\m�:����?`�ܜ�hE���v���UlR����8�!D�a+6����Kz�n��,�`�͖���N�{�ؤ.W��BSoE�z/͜6��6��˦�ՋlB������2�p��lBY��2{5Ӂ���ؿ[XQWt���v3<Z~��q�����o�{����Ύ=����-o��(�F���1&�� 6����V�Y������ߐw���5켺��޳-�2��ؤ> NG.s��W���� �w�w�Ԑ{L����r�x��?<B��Cό��fF-\�\��X���DYC���1�'V-�+`��$��{�rh��=a��)��� £O���'V��Sdo�&v�f{�V��ɟ��&�f���.��A�n{�
9�&^H��
���D��Q(�r�<`�.�V�h>���M����&4tEi����|��}ـM(k8���T���7�`ʞ������-e�P�;��6���Cc�	e�����ۥ؟xw� �P6�����b�Ӿ��IM�G=5���4I�Ib�&��e�g��UT���=�&�u˵Kԍ�iv��>�Pv�*���ծw��:lB��R�Z�����9 �P�+k�ɢ���QS�PVR�W￦�J�c�6�,�g���T�Tu�lB����������      �      x������ � �      �      x������ � �      V   �  x���Ks�@�����*���P��f�o�&Z٠vTD0�����Gg(���*��{��
�}��4�qN�k �Rte�� �Ͽ%�� ��*�뵠�i�/�8P��I��:B�ufBqn.�G�︷�?����D�Ȋ��h]�JҎ�j��ι���/���� ��dM��]�o/9✫�/ѵ7��E��Y] I���&O�2"B��칎�3�H	:~������72J����vy���S?XJPX:�=]��-���@����[�+ڇ�c4�/c�D��b���ǈŨr�ZKz�fc5�;��/TD�5"Ũ_{L��&���p\�R�I�R*��?��z��EVM���P��9rGy�-���Z�(��M��j�ʬ�9�B�`�X�\8c�t�`�(�iK����|A�[�t��i�"]��=��ᥞT�H>�ra��`U}m��7��H�H��]��>�Ͷ�O���
<a�HL0���DE�gWi|B�	���A��c�Q��p-,J(��̮XuT�U\�2Q���W���\��z�0Z���ˈQ��R7�Q��F���Q{(k�x��r��¨7�5l�^7>q5��=�r9�W9q��������l��=��^��n�V�nok�9։>���g�T�S�!��q�����{�xF^�z�_ �����+x�1*��F�^�	��^�J�p��Ӊ&�7#����cw��UOi�(���?i��@=��s�bY�L��x�|?O��eMJ3�'�.
�?���D      �      x������ � �      �   k  x��Vے�@|Ư�Ě.����DQ����������&)ٔ�}�j��{����Fo�^�t��d�!��, ����h)`6�Гr�%s͎l�N���L����zp]d� ����@�	�b�ϻ �;�C�R=�z�+���=��""gΜ��D.S�b^?G&S޺"�S�� �kz`��8�O3��N�߸9�����]\£F,���`�}s�,flnk�f!(y�
�f#�®�@�Z�=L~���'g#~~���y�R�0��	qx�㥖~M��&է
T1?A4�/�x�Y�7�`{$S����)�}�b�&�X��<Vм�3:֧�o�߄������n���6݅ת�:��"gj<�ũ>0�Ӈ�MI���h���(Lw����r.����,��vק� <�v։���	M�A�"xnU�G�`��˪f`g�Y�X�t����R�����`���?g��b �3
1S�X��$�_����̷�BP���`��;�N��71���V��J{�<�l��S��G×#��xZ�<�1�td���p?���b�r�K�Kq`��X�r�O�/q�m���n�R��rDglL������^ҍ&9|���(�j�.Y�z��Vѐ̚H��m$@��}ƖK�$SH�����p�6�S/rkL�j��b�f`Dtn�4�����QR"�m¤��Zl��z��8�������R���F��1��4ѱ.��1xJXܝ�a܄	���lyI"�y-���d��.�g�1�;�����q�U��Ci�F�~���]��Y��v.�BO�ÈbR�����K�������._�~��[�U]ê�s����O�?���u��֤�M]����t:?dv"      �      x������ � �      �      x������ � �     