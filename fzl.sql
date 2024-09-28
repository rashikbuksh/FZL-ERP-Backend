PGDMP  /    8                |            fzl    16.3    16.3 �   o           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            p           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            q           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            r           1262    230068    fzl    DATABASE     ~   CREATE DATABASE fzl WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE fzl;
                postgres    false                        2615    230069 
   commercial    SCHEMA        CREATE SCHEMA commercial;
    DROP SCHEMA commercial;
                postgres    false                        2615    230070    delivery    SCHEMA        CREATE SCHEMA delivery;
    DROP SCHEMA delivery;
                postgres    false                        2615    230071    drizzle    SCHEMA        CREATE SCHEMA drizzle;
    DROP SCHEMA drizzle;
                postgres    false            	            2615    230072    hr    SCHEMA        CREATE SCHEMA hr;
    DROP SCHEMA hr;
                postgres    false            
            2615    230073    lab_dip    SCHEMA        CREATE SCHEMA lab_dip;
    DROP SCHEMA lab_dip;
                postgres    false                        2615    230074    material    SCHEMA        CREATE SCHEMA material;
    DROP SCHEMA material;
                postgres    false                        2615    230075    purchase    SCHEMA        CREATE SCHEMA purchase;
    DROP SCHEMA purchase;
                postgres    false                        2615    230076    slider    SCHEMA        CREATE SCHEMA slider;
    DROP SCHEMA slider;
                postgres    false                        2615    230077    thread    SCHEMA        CREATE SCHEMA thread;
    DROP SCHEMA thread;
                postgres    false                        2615    230078    zipper    SCHEMA        CREATE SCHEMA zipper;
    DROP SCHEMA zipper;
                postgres    false                       1247    230080    batch_status    TYPE     m   CREATE TYPE zipper.batch_status AS ENUM (
    'pending',
    'completed',
    'rejected',
    'cancelled'
);
    DROP TYPE zipper.batch_status;
       zipper          postgres    false    15            
           1247    230090    slider_starting_section_enum    TYPE     �   CREATE TYPE zipper.slider_starting_section_enum AS ENUM (
    'die_casting',
    'slider_assembly',
    'coloring',
    '---'
);
 /   DROP TYPE zipper.slider_starting_section_enum;
       zipper          postgres    false    15                       1247    230100    swatch_status_enum    TYPE     a   CREATE TYPE zipper.swatch_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);
 %   DROP TYPE zipper.swatch_status_enum;
       zipper          postgres    false    15            �           1255    230107 /   sfg_after_commercial_pi_entry_delete_function()    FUNCTION     r  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi - OLD.pi_cash_quantity
    WHERE uuid = OLD.sfg_uuid;

    UPDATE thread.order_entry SET
        pi = pi - OLD.pi_cash_quantity
    WHERE uuid = OLD.thread_order_entry_uuid;

    RETURN OLD;
END;
$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
    
   commercial          postgres    false    6            Z           1255    230108 /   sfg_after_commercial_pi_entry_insert_function()    FUNCTION     r  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS trigger
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
   commercial          postgres    false    6            E           1255    230109 /   sfg_after_commercial_pi_entry_update_function()    FUNCTION     �  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS trigger
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
   commercial          postgres    false    6            �           1255    230110 2   packing_list_after_challan_entry_delete_function()    FUNCTION     +  CREATE FUNCTION delivery.packing_list_after_challan_entry_delete_function() RETURNS trigger
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
       delivery          postgres    false    7            }           1255    230111 2   packing_list_after_challan_entry_insert_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_insert_function() RETURNS trigger
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
       delivery          postgres    false    7            L           1255    230112 2   packing_list_after_challan_entry_update_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_update_function() RETURNS trigger
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
       delivery          postgres    false    7            I           1255    230113 2   sfg_after_challan_receive_status_delete_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse + CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END,
        delivered = delivered - CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END
    WHERE uuid = OLD.sfg_uuid;
    RETURN OLD;
END;
$$;
 K   DROP FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
       delivery          postgres    false    7            �           1255    230114 2   sfg_after_challan_receive_status_insert_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$;
 K   DROP FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
       delivery          postgres    false    7            �           1255    230115 2   sfg_after_challan_receive_status_update_function()    FUNCTION     -  CREATE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper,sfg
    UPDATE zipper.sfg
    SET
        warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END,
        delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN NEW.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN OLD.quantity ELSE 0 END
    WHERE uuid = NEW.sfg_uuid;
    RETURN NEW;
END;
$$;
 K   DROP FUNCTION delivery.sfg_after_challan_receive_status_update_function();
       delivery          postgres    false    7            G           1255    230116 .   sfg_after_packing_list_entry_delete_function()    FUNCTION     Q  CREATE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS trigger
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
       delivery          postgres    false    7            �           1255    230117 .   sfg_after_packing_list_entry_insert_function()    FUNCTION     Q  CREATE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS trigger
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
       delivery          postgres    false    7            v           1255    230118 .   sfg_after_packing_list_entry_update_function()    FUNCTION     o  CREATE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS trigger
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
       delivery          postgres    false    7            �           1255    230119 +   material_stock_after_material_info_delete()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 D   DROP FUNCTION material.material_stock_after_material_info_delete();
       material          postgres    false    11            �           1255    230120 +   material_stock_after_material_info_insert()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_insert() RETURNS trigger
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
       material          postgres    false    11            �           1255    230121 *   material_stock_after_material_trx_delete()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_delete() RETURNS trigger
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
       material          postgres    false    11            {           1255    230122 *   material_stock_after_material_trx_insert()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_insert() RETURNS trigger
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
       material          postgres    false    11            �           1255    230123 *   material_stock_after_material_trx_update()    FUNCTION     C  CREATE FUNCTION material.material_stock_after_material_trx_update() RETURNS trigger
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
       material          postgres    false    11            �           1255    230124 +   material_stock_after_material_used_delete()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_delete() RETURNS trigger
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
       material          postgres    false    11            �           1255    230125 +   material_stock_after_material_used_insert()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_insert() RETURNS trigger
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
       material          postgres    false    11            b           1255    230126 +   material_stock_after_material_used_update()    FUNCTION     L  CREATE FUNCTION material.material_stock_after_material_used_update() RETURNS trigger
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
       material          postgres    false    11            w           1255    230127 ,   material_stock_after_purchase_entry_delete()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS trigger
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
       material          postgres    false    11            �           1255    230128 ,   material_stock_after_purchase_entry_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS trigger
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
       material          postgres    false    11            K           1255    230129 ,   material_stock_after_purchase_entry_update()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS trigger
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
       material          postgres    false    11            �           1255    230130 .   material_stock_sfg_after_stock_to_sfg_delete()    FUNCTION     4  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS trigger
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
       material          postgres    false    11                       1255    230131 .   material_stock_sfg_after_stock_to_sfg_insert()    FUNCTION     =  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS trigger
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
       material          postgres    false    11            l           1255    230132 .   material_stock_sfg_after_stock_to_sfg_update()    FUNCTION       CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS trigger
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
       material          postgres    false    11            H           1255    230133 >   thread_batch_entry_after_batch_entry_production_delete_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity - OLD.production_quantity,
        coning_production_quantity_in_kg = coning_production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE uuid = OLD.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = production_quantity - OLD.production_quantity,
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);

    RETURN OLD;
END;

$$;
 U   DROP FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct();
       public          postgres    false            [           1255    230134 >   thread_batch_entry_after_batch_entry_production_insert_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity + NEW.production_quantity,
        coning_production_quantity_in_kg = coning_production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = production_quantity + NEW.production_quantity,
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$;
 U   DROP FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct();
       public          postgres    false            W           1255    230135 >   thread_batch_entry_after_batch_entry_production_update_funct()    FUNCTION     h  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        coning_production_quantity = coning_production_quantity - OLD.production_quantity + NEW.production_quantity,
        coning_production_quantity_in_kg = coning_production_quantity_in_kg - OLD.production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        production_quantity = production_quantity - OLD.production_quantity + NEW.production_quantity,
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg + NEW.production_quantity_in_kg

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$;
 U   DROP FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct();
       public          postgres    false            �           1255    230136 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_delete()    FUNCTION     >  CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity - OLD.quantity,
        coning_production_quantity = coning_production_quantity + OLD.quantity
    WHERE uuid = OLD.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse - OLD.quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);
    RETURN OLD;
END;

$$;
 X   DROP FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
       public          postgres    false            �           1255    230137 @   thread_batch_entry_and_order_entry_after_batch_entry_trx_funct()    FUNCTION     =  CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity + NEW.quantity,
        coning_production_quantity = coning_production_quantity - NEW.quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse + NEW.quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    RETURN NEW;
END;

$$;
 W   DROP FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
       public          postgres    false            h           1255    230138 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_update()    FUNCTION     j  CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE thread.batch_entry
    SET
        transfer_quantity = transfer_quantity - OLD.quantity + NEW.quantity,
        coning_production_quantity = coning_production_quantity + OLD.quantity - NEW.quantity
    WHERE uuid = NEW.batch_entry_uuid;

    UPDATE thread.order_entry
    SET
        warehouse = warehouse - OLD.quantity + NEW.quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);
    RETURN NEW;
END;

$$;
 X   DROP FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
       public          postgres    false            _           1255    230139 2   zipper_batch_entry_after_batch_production_delete()    FUNCTION     F  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_delete() RETURNS trigger
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
       public          postgres    false            �           1255    230140 2   zipper_batch_entry_after_batch_production_insert()    FUNCTION     7  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_insert() RETURNS trigger
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
       public          postgres    false            �           1255    230141 2   zipper_batch_entry_after_batch_production_update()    FUNCTION     �  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_update() RETURNS trigger
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
       public          postgres    false            k           1255    230142 %   zipper_sfg_after_batch_entry_delete()    FUNCTION     #  CREATE FUNCTION public.zipper_sfg_after_batch_entry_delete() RETURNS trigger
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
       public          postgres    false            �           1255    230143 %   zipper_sfg_after_batch_entry_insert()    FUNCTION     %  CREATE FUNCTION public.zipper_sfg_after_batch_entry_insert() RETURNS trigger
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
       public          postgres    false            y           1255    230144 %   zipper_sfg_after_batch_entry_update()    FUNCTION     E  CREATE FUNCTION public.zipper_sfg_after_batch_entry_update() RETURNS trigger
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
       public          postgres    false            D           1255    230145 A   assembly_stock_after_die_casting_to_assembly_stock_delete_funct()    FUNCTION       CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity - OLD.production_quantity
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
       slider          postgres    false    13            s           1255    230146 A   assembly_stock_after_die_casting_to_assembly_stock_insert_funct()    FUNCTION       CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity + NEW.production_quantity
    WHERE uuid = NEW.assembly_stock_uuid;

    -- die casting body 
    UPDATE slider.die_casting 
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
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
       slider          postgres    false    13            o           1255    230147 A   assembly_stock_after_die_casting_to_assembly_stock_update_funct()    FUNCTION     
  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update slider.assembly_stock
    UPDATE slider.assembly_stock
    SET
        quantity = quantity 
            + NEW.production_quantity
            - OLD.production_quantity
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
       slider          postgres    false    13            �           1255    230148 8   slider_die_casting_after_die_casting_production_delete()    FUNCTION     |  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_delete() RETURNS trigger
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
       slider          postgres    false    13            N           1255    230149 8   slider_die_casting_after_die_casting_production_insert()    FUNCTION     }  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() RETURNS trigger
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
       slider          postgres    false    13            q           1255    230150 8   slider_die_casting_after_die_casting_production_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_update() RETURNS trigger
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
       slider          postgres    false    13            x           1255    230151 3   slider_die_casting_after_trx_against_stock_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() RETURNS trigger
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
       slider          postgres    false    13            �           1255    230152 3   slider_die_casting_after_trx_against_stock_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() RETURNS trigger
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
       slider          postgres    false    13            �           1255    230153 3   slider_die_casting_after_trx_against_stock_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_update() RETURNS trigger
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
       slider          postgres    false    13            T           1255    230154 0   slider_stock_after_coloring_transaction_delete()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS trigger
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
       slider          postgres    false    13            u           1255    230155 0   slider_stock_after_coloring_transaction_insert()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS trigger
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
       slider          postgres    false    13            c           1255    230156 0   slider_stock_after_coloring_transaction_update()    FUNCTION     7  CREATE FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS trigger
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
       slider          postgres    false    13            A           1255    230157 3   slider_stock_after_die_casting_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS trigger
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
       slider          postgres    false    13            r           1255    230158 3   slider_stock_after_die_casting_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS trigger
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
       slider          postgres    false    13            S           1255    230159 3   slider_stock_after_die_casting_transaction_update()    FUNCTION     *  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS trigger
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
       slider          postgres    false    13            i           1255    230160 -   slider_stock_after_slider_production_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_slider_production_delete() RETURNS trigger
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
       slider          postgres    false    13            F           1255    230161 -   slider_stock_after_slider_production_insert()    FUNCTION     o  CREATE FUNCTION slider.slider_stock_after_slider_production_insert() RETURNS trigger
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
       slider          postgres    false    13            `           1255    230162 -   slider_stock_after_slider_production_update()    FUNCTION     {  CREATE FUNCTION slider.slider_stock_after_slider_production_update() RETURNS trigger
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
       slider          postgres    false    13            �           1255    230163 '   slider_stock_after_transaction_delete()    FUNCTION     {  CREATE FUNCTION slider.slider_stock_after_transaction_delete() RETURNS trigger
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
            quantity = quantity + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.trx_quantity ELSE 0 END
        WHERE uuid = OLD.assembly_stock_uuid;
    END IF;

    RETURN OLD;
END;
$$;
 >   DROP FUNCTION slider.slider_stock_after_transaction_delete();
       slider          postgres    false    13            O           1255    230164 '   slider_stock_after_transaction_insert()    FUNCTION     r  CREATE FUNCTION slider.slider_stock_after_transaction_insert() RETURNS trigger
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
            quantity = quantity - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.trx_quantity ELSE 0 END
        WHERE uuid = NEW.assembly_stock_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 >   DROP FUNCTION slider.slider_stock_after_transaction_insert();
       slider          postgres    false    13            e           1255    230165 '   slider_stock_after_transaction_update()    FUNCTION     k
  CREATE FUNCTION slider.slider_stock_after_transaction_update() RETURNS trigger
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
            + CASE WHEN OLD.from_section = 'assembly_stock' THEN OLD.trx_quantity ELSE 0 END
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
            quantity = quantity - CASE WHEN NEW.from_section = 'assembly_stock' THEN NEW.trx_quantity ELSE 0 END
        WHERE uuid = NEW.assembly_stock_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 >   DROP FUNCTION slider.slider_stock_after_transaction_update();
       slider          postgres    false    13            �           1255    230166 *   order_entry_after_batch_is_drying_update()    FUNCTION     �  CREATE FUNCTION thread.order_entry_after_batch_is_drying_update() RETURNS trigger
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
       thread          postgres    false    14            �           1255    230167 *   order_entry_after_batch_is_dyeing_update()    FUNCTION       CREATE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS trigger
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
       thread          postgres    false    14            z           1255    230168 6   order_description_after_dyed_tape_transaction_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS trigger
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
       zipper          postgres    false    15            @           1255    230169 6   order_description_after_dyed_tape_transaction_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS trigger
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
       zipper          postgres    false    15            t           1255    230170 6   order_description_after_dyed_tape_transaction_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230171 4   order_description_after_tape_coil_to_dyeing_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() RETURNS trigger
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
       zipper          postgres    false    15            p           1255    230172 4   order_description_after_tape_coil_to_dyeing_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230173 4   order_description_after_tape_coil_to_dyeing_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230174    sfg_after_order_entry_delete()    FUNCTION     �   CREATE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 5   DROP FUNCTION zipper.sfg_after_order_entry_delete();
       zipper          postgres    false    15            d           1255    230175    sfg_after_order_entry_insert()    FUNCTION       CREATE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS trigger
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
       zipper          postgres    false    15            n           1255    230176 *   sfg_after_sfg_production_delete_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_delete_function() RETURNS trigger
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
        teeth_coloring_prod = teeth_coloring_prod - 
            CASE 
                WHEN OLD.section = 'teeth_coloring' THEN OLD.production_quantity 
                ELSE 0 
            END,
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
       zipper          postgres    false    15            a           1255    230177 *   sfg_after_sfg_production_insert_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_insert_function() RETURNS trigger
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
        teeth_coloring_prod = teeth_coloring_prod + 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity 
                ELSE 0 
            END,
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
       zipper          postgres    false    15            �           1255    230178 *   sfg_after_sfg_production_update_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_update_function() RETURNS trigger
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
        teeth_coloring_prod = teeth_coloring_prod + 
            CASE 
                WHEN NEW.section = 'teeth_coloring' THEN NEW.production_quantity - OLD.production_quantity
                ELSE 0 
            END,
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
       zipper          postgres    false    15            \           1255    230179 +   sfg_after_sfg_transaction_delete_function()    FUNCTION     (  CREATE FUNCTION zipper.sfg_after_sfg_transaction_delete_function() RETURNS trigger
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
       zipper          postgres    false    15            Y           1255    230180 +   sfg_after_sfg_transaction_insert_function()    FUNCTION     *  CREATE FUNCTION zipper.sfg_after_sfg_transaction_insert_function() RETURNS trigger
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
       zipper          postgres    false    15            R           1255    230181 +   sfg_after_sfg_transaction_update_function()    FUNCTION     ?  CREATE FUNCTION zipper.sfg_after_sfg_transaction_update_function() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230182 A   stock_after_material_trx_against_order_description_delete_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS trigger
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
       zipper          postgres    false    15            f           1255    230183 A   stock_after_material_trx_against_order_description_insert_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230184 A   stock_after_material_trx_against_order_description_update_funct()    FUNCTION     i  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230185 &   tape_coil_after_tape_coil_production()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS trigger
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
       zipper          postgres    false    15            X           1255    230186 -   tape_coil_after_tape_coil_production_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS trigger
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
       zipper          postgres    false    15            Q           1255    230187 -   tape_coil_after_tape_coil_production_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230188 !   tape_coil_after_tape_trx_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    230189 !   tape_coil_after_tape_trx_insert()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS trigger
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
       zipper          postgres    false    15            m           1255    230190 !   tape_coil_after_tape_trx_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS trigger
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
       zipper          postgres    false    15            ^           1255    230191 A   tape_coil_and_order_description_after_dyed_tape_transaction_del()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() RETURNS trigger
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
       zipper          postgres    false    15            U           1255    230192 A   tape_coil_and_order_description_after_dyed_tape_transaction_ins()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() RETURNS trigger
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
       zipper          postgres    false    15            g           1255    230193 A   tape_coil_and_order_description_after_dyed_tape_transaction_upd()    FUNCTION     2  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() RETURNS trigger
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
       zipper          postgres    false    15            �            1259    230194    bank    TABLE     /  CREATE TABLE commercial.bank (
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
   commercial         heap    postgres    false    6            �            1259    230199    lc_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.lc_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.lc_sequence;
    
   commercial          postgres    false    6            �            1259    230200    lc    TABLE     }  CREATE TABLE commercial.lc (
    uuid text NOT NULL,
    party_uuid text,
    lc_number text NOT NULL,
    lc_date timestamp without time zone NOT NULL,
    payment_value numeric(20,4) DEFAULT 0,
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
    is_rtgs integer DEFAULT 0
);
    DROP TABLE commercial.lc;
    
   commercial         heap    postgres    false    226    6            �            1259    230213    pi_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.pi_sequence;
    
   commercial          postgres    false    6            �            1259    230214    pi_cash    TABLE     �  CREATE TABLE commercial.pi_cash (
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
   commercial         heap    postgres    false    228    6            �            1259    230226    pi_cash_entry    TABLE     .  CREATE TABLE commercial.pi_cash_entry (
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
   commercial         heap    postgres    false    6            �            1259    230231    challan_sequence    SEQUENCE     {   CREATE SEQUENCE delivery.challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE delivery.challan_sequence;
       delivery          postgres    false    7            �            1259    230232    challan    TABLE     �  CREATE TABLE delivery.challan (
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
       delivery         heap    postgres    false    231    7            �            1259    230240    challan_entry    TABLE     �   CREATE TABLE delivery.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    packing_list_uuid text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 #   DROP TABLE delivery.challan_entry;
       delivery         heap    postgres    false    7            �            1259    230245    packing_list_sequence    SEQUENCE     �   CREATE SEQUENCE delivery.packing_list_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE delivery.packing_list_sequence;
       delivery          postgres    false    7            �            1259    230246    packing_list    TABLE     �  CREATE TABLE delivery.packing_list (
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
       delivery         heap    postgres    false    234    7            �            1259    230252    packing_list_entry    TABLE     Y  CREATE TABLE delivery.packing_list_entry (
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
       delivery         heap    postgres    false    7            �            1259    230280    users    TABLE     )  CREATE TABLE hr.users (
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
    remarks text
);
    DROP TABLE hr.users;
       hr         heap    postgres    false    9                       1259    230384    buyer    TABLE     �   CREATE TABLE public.buyer (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.buyer;
       public         heap    postgres    false                       1259    230389    factory    TABLE       CREATE TABLE public.factory (
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
       public         heap    postgres    false                       1259    230406 	   marketing    TABLE       CREATE TABLE public.marketing (
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
       public         heap    postgres    false                       1259    230411    merchandiser    TABLE     $  CREATE TABLE public.merchandiser (
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
       public         heap    postgres    false                       1259    230416    party    TABLE       CREATE TABLE public.party (
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
       public         heap    postgres    false                       1259    230421 
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
       public         heap    postgres    false                       1259    230500    stock    TABLE     a  CREATE TABLE slider.stock (
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
       slider         heap    postgres    false    13            /           1259    230662    order_description    TABLE     �  CREATE TABLE zipper.order_description (
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
    puller_link text,
    created_by text,
    garments_remarks text,
    tape_received numeric(20,4) DEFAULT 0 NOT NULL,
    tape_transferred numeric(20,4) DEFAULT 0 NOT NULL,
    slider_finishing_stock numeric(20,4) DEFAULT 0 NOT NULL,
    nylon_stopper text,
    tape_coil_uuid text,
    tape_color text,
    teeth_type text
);
 %   DROP TABLE zipper.order_description;
       zipper         heap    postgres    false    15    1034            0           1259    230674    order_entry    TABLE     U  CREATE TABLE zipper.order_entry (
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
    swatch_approval_date text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    bleaching text
);
    DROP TABLE zipper.order_entry;
       zipper         heap    postgres    false    1037    1037    15            1           1259    230683    order_info_sequence    SEQUENCE     |   CREATE SEQUENCE zipper.order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE zipper.order_info_sequence;
       zipper          postgres    false    15            2           1259    230684 
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
    conversion_rate numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE zipper.order_info;
       zipper         heap    postgres    false    305    15            5           1259    230709    sfg    TABLE     �  CREATE TABLE zipper.sfg (
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
       zipper         heap    postgres    false    15            8           1259    230742 	   tape_coil    TABLE     �  CREATE TABLE zipper.tape_coil (
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
       zipper         heap    postgres    false    15            >           1259    230780    v_order_details_full    VIEW       CREATE VIEW zipper.v_order_details_full AS
 SELECT order_info.uuid AS order_info_uuid,
    concat('Z', to_char(order_info.created_at, 'YY'::text), '-', lpad((order_info.id)::text, 4, '0'::text)) AS order_number,
    order_description.uuid AS order_description_uuid,
    order_description.tape_received,
    order_description.tape_transferred,
    order_description.slider_finishing_stock,
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
    order_description.tape_color,
    op_tape_color.name AS tape_color_name,
    op_tape_color.short_name AS tape_color_short_name,
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
    order_description.slider_link,
    op_slider_link.name AS slider_link_name,
    op_slider_link.short_name AS slider_link_short_name,
    order_description.end_user,
    op_end_user.name AS end_user_name,
    op_end_user.short_name AS end_user_short_name,
    order_description.garment,
    order_description.light_preference,
    op_light_preference.name AS light_preference_name,
    op_light_preference.short_name AS light_preference_short_name,
    order_description.garments_wash,
    order_description.puller_link,
    op_puller_link.name AS puller_link_name,
    op_puller_link.short_name AS puller_link_short_name,
    order_info.marketing_priority,
    order_info.factory_priority,
    order_description.garments_remarks,
    stock.uuid AS stock_uuid,
    stock.order_quantity AS stock_order_quantity,
    order_description.tape_coil_uuid,
    tc.name AS tape_name,
    order_description.teeth_type,
    op_teeth_type.name AS teeth_type_name,
    op_teeth_type.short_name AS teeth_type_short_name
   FROM ((((((((((((((((((((((((((((((zipper.order_info
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
     LEFT JOIN public.properties op_tape_color ON ((op_tape_color.uuid = order_description.tape_color)))
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
     LEFT JOIN public.properties op_puller_link ON ((op_puller_link.uuid = order_description.puller_link)))
     LEFT JOIN slider.stock ON ((stock.order_description_uuid = order_description.uuid)))
     LEFT JOIN zipper.tape_coil tc ON ((tc.uuid = order_description.tape_coil_uuid)))
     LEFT JOIN public.properties op_teeth_type ON ((op_teeth_type.uuid = order_description.teeth_type)));
 '   DROP VIEW zipper.v_order_details_full;
       zipper          postgres    false    261    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    303    277    277    277    264    264    264    263    263    262    262    261    259    259    259    258    258    242    242    312    312    306    306    306    306    306    306    306    306    306    306    306    306    306    306    306    306    303    303    303    303    303    303    1034    15            ?           1259    232041    v_packing_list    VIEW     �  CREATE VIEW delivery.v_packing_list AS
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
    ple.quantity,
    ple.short_quantity,
    ple.reject_quantity,
    ple.created_at AS entry_created_at,
    ple.updated_at AS entry_updated_at,
    ple.remarks AS entry_remarks,
    oe.uuid AS order_entry_uuid,
    oe.style,
    oe.color,
    oe.size,
    concat(oe.style, ' / ', oe.color, ' / ', oe.size) AS style_color_size,
    oe.quantity AS order_quantity,
    vodf.order_description_uuid,
    vodf.order_number,
    vodf.item_description,
    sfg.warehouse,
    sfg.delivered,
    (oe.quantity - sfg.warehouse) AS balance_quantity
   FROM (((((delivery.packing_list pl
     LEFT JOIN delivery.packing_list_entry ple ON ((ple.packing_list_uuid = pl.uuid)))
     LEFT JOIN hr.users ON ((users.uuid = pl.created_by)))
     LEFT JOIN zipper.sfg ON ((sfg.uuid = ple.sfg_uuid)))
     LEFT JOIN zipper.order_entry oe ON ((oe.uuid = sfg.order_entry_uuid)))
     LEFT JOIN zipper.v_order_details_full vodf ON ((vodf.order_description_uuid = oe.order_description_uuid)));
 #   DROP VIEW delivery.v_packing_list;
       delivery          postgres    false    236    242    242    236    236    235    235    235    236    236    236    236    236    318    318    236    235    235    318    309    309    235    235    309    309    304    304    235    235    304    304    304    304    235    7            �            1259    230259    migrations_details    TABLE     t   CREATE TABLE drizzle.migrations_details (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
 '   DROP TABLE drizzle.migrations_details;
       drizzle         heap    postgres    false    8            �            1259    230264    migrations_details_id_seq    SEQUENCE     �   CREATE SEQUENCE drizzle.migrations_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE drizzle.migrations_details_id_seq;
       drizzle          postgres    false    237    8            s           0    0    migrations_details_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE drizzle.migrations_details_id_seq OWNED BY drizzle.migrations_details.id;
          drizzle          postgres    false    238            �            1259    230265 
   department    TABLE     �   CREATE TABLE hr.department (
    uuid text NOT NULL,
    department text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.department;
       hr         heap    postgres    false    9            �            1259    230270    designation    TABLE     �   CREATE TABLE hr.designation (
    uuid text NOT NULL,
    department_uuid text,
    designation text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.designation;
       hr         heap    postgres    false    9            �            1259    230275    policy_and_notice    TABLE       CREATE TABLE hr.policy_and_notice (
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
       hr         heap    postgres    false    9            �            1259    230286    info    TABLE     L  CREATE TABLE lab_dip.info (
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
       lab_dip         heap    postgres    false    10            �            1259    230292    info_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE lab_dip.info_id_seq;
       lab_dip          postgres    false    10    243            t           0    0    info_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE lab_dip.info_id_seq OWNED BY lab_dip.info.id;
          lab_dip          postgres    false    244            �            1259    230293    recipe    TABLE     t  CREATE TABLE lab_dip.recipe (
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
       lab_dip         heap    postgres    false    10            �            1259    230300    recipe_entry    TABLE       CREATE TABLE lab_dip.recipe_entry (
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
       lab_dip         heap    postgres    false    10            �            1259    230305    recipe_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE lab_dip.recipe_id_seq;
       lab_dip          postgres    false    245    10            u           0    0    recipe_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE lab_dip.recipe_id_seq OWNED BY lab_dip.recipe.id;
          lab_dip          postgres    false    247            �            1259    230306    shade_recipe_sequence    SEQUENCE        CREATE SEQUENCE lab_dip.shade_recipe_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE lab_dip.shade_recipe_sequence;
       lab_dip          postgres    false    10            �            1259    230307    shade_recipe    TABLE     }  CREATE TABLE lab_dip.shade_recipe (
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
       lab_dip         heap    postgres    false    248    10            �            1259    230314    shade_recipe_entry    TABLE       CREATE TABLE lab_dip.shade_recipe_entry (
    uuid text NOT NULL,
    shade_recipe_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE lab_dip.shade_recipe_entry;
       lab_dip         heap    postgres    false    10            �            1259    230319    info    TABLE     u  CREATE TABLE material.info (
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
       material         heap    postgres    false    11            �            1259    230325    section    TABLE     �   CREATE TABLE material.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.section;
       material         heap    postgres    false    11            �            1259    230330    stock    TABLE     �  CREATE TABLE material.stock (
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
       material         heap    postgres    false    11            �            1259    230363    stock_to_sfg    TABLE     =  CREATE TABLE material.stock_to_sfg (
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
       material         heap    postgres    false    11            �            1259    230368    trx    TABLE       CREATE TABLE material.trx (
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
       material         heap    postgres    false    11                        1259    230373    type    TABLE     �   CREATE TABLE material.type (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.type;
       material         heap    postgres    false    11                       1259    230378    used    TABLE     J  CREATE TABLE material.used (
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
       material         heap    postgres    false    11                       1259    230394    machine    TABLE     1  CREATE TABLE public.machine (
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
       public         heap    postgres    false            	           1259    230426    section    TABLE     w   CREATE TABLE public.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text
);
    DROP TABLE public.section;
       public         heap    postgres    false            
           1259    230431    purchase_description_sequence    SEQUENCE     �   CREATE SEQUENCE purchase.purchase_description_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE purchase.purchase_description_sequence;
       purchase          postgres    false    12                       1259    230432    description    TABLE     �  CREATE TABLE purchase.description (
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
       purchase         heap    postgres    false    266    12                       1259    230438    entry    TABLE     ;  CREATE TABLE purchase.entry (
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
       purchase         heap    postgres    false    12                       1259    230444    vendor    TABLE     M  CREATE TABLE purchase.vendor (
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
       purchase         heap    postgres    false    12                       1259    230449    assembly_stock    TABLE     �  CREATE TABLE slider.assembly_stock (
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
       slider         heap    postgres    false    13                       1259    230456    coloring_transaction    TABLE     R  CREATE TABLE slider.coloring_transaction (
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
       slider         heap    postgres    false    13                       1259    230462    die_casting    TABLE     T  CREATE TABLE slider.die_casting (
    uuid text NOT NULL,
    name text NOT NULL,
    item text,
    zipper_number text,
    end_type text,
    puller_type text,
    logo_type text,
    slider_body_shape text,
    puller_link text,
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
       slider         heap    postgres    false    13                       1259    230473    die_casting_production    TABLE     �  CREATE TABLE slider.die_casting_production (
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
       slider         heap    postgres    false    13                       1259    230478    die_casting_to_assembly_stock    TABLE     �  CREATE TABLE slider.die_casting_to_assembly_stock (
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
       slider         heap    postgres    false    13                       1259    230487    die_casting_transaction    TABLE     V  CREATE TABLE slider.die_casting_transaction (
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
       slider         heap    postgres    false    13                       1259    230493 
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
       slider         heap    postgres    false    13                       1259    230520    transaction    TABLE     �  CREATE TABLE slider.transaction (
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
       slider         heap    postgres    false    13                       1259    230526    trx_against_stock    TABLE     7  CREATE TABLE slider.trx_against_stock (
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
       slider         heap    postgres    false    13                       1259    230532    thread_batch_sequence    SEQUENCE     ~   CREATE SEQUENCE thread.thread_batch_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE thread.thread_batch_sequence;
       thread          postgres    false    14                       1259    230533    batch    TABLE     �  CREATE TABLE thread.batch (
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
       thread         heap    postgres    false    280    14                       1259    230541    batch_entry    TABLE     4  CREATE TABLE thread.batch_entry (
    uuid text NOT NULL,
    batch_uuid text,
    order_entry_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    coning_production_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    coning_production_quantity_in_kg numeric(20,4) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    coning_created_at timestamp without time zone,
    coning_updated_at timestamp without time zone,
    transfer_quantity numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE thread.batch_entry;
       thread         heap    postgres    false    14                       1259    230550    batch_entry_production    TABLE     P  CREATE TABLE thread.batch_entry_production (
    uuid text NOT NULL,
    batch_entry_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    production_quantity_in_kg numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 *   DROP TABLE thread.batch_entry_production;
       thread         heap    postgres    false    14                       1259    230555    batch_entry_trx    TABLE       CREATE TABLE thread.batch_entry_trx (
    uuid text NOT NULL,
    batch_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 #   DROP TABLE thread.batch_entry_trx;
       thread         heap    postgres    false    14                       1259    230560    challan    TABLE        CREATE TABLE thread.challan (
    uuid text NOT NULL,
    order_info_uuid text,
    carton_quantity integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE thread.challan;
       thread         heap    postgres    false    14                       1259    230565    challan_entry    TABLE       CREATE TABLE thread.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    order_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 !   DROP TABLE thread.challan_entry;
       thread         heap    postgres    false    14                       1259    230570    count_length    TABLE     y  CREATE TABLE thread.count_length (
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
    price numeric(20,4) NOT NULL
);
     DROP TABLE thread.count_length;
       thread         heap    postgres    false    14                        1259    230575    dyes_category    TABLE     B  CREATE TABLE thread.dyes_category (
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
       thread         heap    postgres    false    14            !           1259    230582    order_entry    TABLE     �  CREATE TABLE thread.order_entry (
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
    production_quantity_in_kg numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE thread.order_entry;
       thread         heap    postgres    false    14            "           1259    230597    thread_order_info_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE thread.thread_order_info_sequence;
       thread          postgres    false    14            #           1259    230598 
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
       thread         heap    postgres    false    290    14            $           1259    230607    programs    TABLE     %  CREATE TABLE thread.programs (
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
       thread         heap    postgres    false    14            %           1259    230613    batch    TABLE     w  CREATE TABLE zipper.batch (
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
       zipper         heap    postgres    false    1031    1031    15            &           1259    230621    batch_entry    TABLE     n  CREATE TABLE zipper.batch_entry (
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
       zipper         heap    postgres    false    15            '           1259    230629    batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE zipper.batch_id_seq;
       zipper          postgres    false    293    15            v           0    0    batch_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE zipper.batch_id_seq OWNED BY zipper.batch.id;
          zipper          postgres    false    295            (           1259    230630    batch_production    TABLE     J  CREATE TABLE zipper.batch_production (
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
       zipper         heap    postgres    false    15            )           1259    230635    dyed_tape_transaction    TABLE     )  CREATE TABLE zipper.dyed_tape_transaction (
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
       zipper         heap    postgres    false    15            *           1259    230640     dyed_tape_transaction_from_stock    TABLE     F  CREATE TABLE zipper.dyed_tape_transaction_from_stock (
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
       zipper         heap    postgres    false    15            +           1259    230646    dying_batch    TABLE     �   CREATE TABLE zipper.dying_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    mc_no integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.dying_batch;
       zipper         heap    postgres    false    15            ,           1259    230651    dying_batch_entry    TABLE     v  CREATE TABLE zipper.dying_batch_entry (
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
       zipper         heap    postgres    false    15            -           1259    230656    dying_batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.dying_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE zipper.dying_batch_id_seq;
       zipper          postgres    false    299    15            w           0    0    dying_batch_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE zipper.dying_batch_id_seq OWNED BY zipper.dying_batch.id;
          zipper          postgres    false    301            .           1259    230657 &   material_trx_against_order_description    TABLE     [  CREATE TABLE zipper.material_trx_against_order_description (
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
       zipper         heap    postgres    false    15            3           1259    230695    planning    TABLE     �   CREATE TABLE zipper.planning (
    week text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.planning;
       zipper         heap    postgres    false    15            4           1259    230700    planning_entry    TABLE     �  CREATE TABLE zipper.planning_entry (
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
       zipper         heap    postgres    false    15            6           1259    230727    sfg_production    TABLE     �  CREATE TABLE zipper.sfg_production (
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
       zipper         heap    postgres    false    15            7           1259    230735    sfg_transaction    TABLE     �  CREATE TABLE zipper.sfg_transaction (
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
       zipper         heap    postgres    false    15            9           1259    230754    tape_coil_production    TABLE     _  CREATE TABLE zipper.tape_coil_production (
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
       zipper         heap    postgres    false    15            :           1259    230760    tape_coil_required    TABLE     t  CREATE TABLE zipper.tape_coil_required (
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
       zipper         heap    postgres    false    15            ;           1259    230765    tape_coil_to_dyeing    TABLE     /  CREATE TABLE zipper.tape_coil_to_dyeing (
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
       zipper         heap    postgres    false    15            <           1259    230770    tape_trx    TABLE       CREATE TABLE zipper.tape_trx (
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
       zipper         heap    postgres    false    15            =           1259    230775    v_order_details    VIEW     Y	  CREATE VIEW zipper.v_order_details AS
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
    order_info.remarks
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
       zipper          postgres    false    303    306    306    306    306    306    306    306    306    306    306    306    306    306    306    306    306    306    306    303    303    303    303    303    303    264    264    264    263    263    262    262    261    261    259    259    258    258    242    242    15                       2604    230785    migrations_details id    DEFAULT     �   ALTER TABLE ONLY drizzle.migrations_details ALTER COLUMN id SET DEFAULT nextval('drizzle.migrations_details_id_seq'::regclass);
 E   ALTER TABLE drizzle.migrations_details ALTER COLUMN id DROP DEFAULT;
       drizzle          postgres    false    238    237                       2604    230786    info id    DEFAULT     d   ALTER TABLE ONLY lab_dip.info ALTER COLUMN id SET DEFAULT nextval('lab_dip.info_id_seq'::regclass);
 7   ALTER TABLE lab_dip.info ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    244    243                        2604    230787 	   recipe id    DEFAULT     h   ALTER TABLE ONLY lab_dip.recipe ALTER COLUMN id SET DEFAULT nextval('lab_dip.recipe_id_seq'::regclass);
 9   ALTER TABLE lab_dip.recipe ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    247    245            �           2604    230788    batch id    DEFAULT     d   ALTER TABLE ONLY zipper.batch ALTER COLUMN id SET DEFAULT nextval('zipper.batch_id_seq'::regclass);
 7   ALTER TABLE zipper.batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    295    293            �           2604    230789    dying_batch id    DEFAULT     p   ALTER TABLE ONLY zipper.dying_batch ALTER COLUMN id SET DEFAULT nextval('zipper.dying_batch_id_seq'::regclass);
 =   ALTER TABLE zipper.dying_batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    301    299                      0    230194    bank 
   TABLE DATA           �   COPY commercial.bank (uuid, name, swift_code, address, policy, created_at, updated_at, remarks, created_by, routing_no) FROM stdin;
 
   commercial          postgres    false    225   ;                0    230200    lc 
   TABLE DATA           �  COPY commercial.lc (uuid, party_uuid, lc_number, lc_date, payment_value, payment_date, ldbc_fdbc, acceptance_date, maturity_date, commercial_executive, party_bank, production_complete, lc_cancel, handover_date, shipment_date, expiry_date, ud_no, ud_received, at_sight, amd_date, amd_count, problematical, epz, created_by, created_at, updated_at, remarks, id, document_receive_date, is_rtgs) FROM stdin;
 
   commercial          postgres    false    227   �                0    230214    pi_cash 
   TABLE DATA             COPY commercial.pi_cash (uuid, id, lc_uuid, order_info_uuids, marketing_uuid, party_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, is_pi, conversion_rate, receive_amount, created_by, created_at, updated_at, remarks, weight, thread_order_info_uuids) FROM stdin;
 
   commercial          postgres    false    229   �                0    230226    pi_cash_entry 
   TABLE DATA           �   COPY commercial.pi_cash_entry (uuid, pi_cash_uuid, sfg_uuid, pi_cash_quantity, created_at, updated_at, remarks, thread_order_entry_uuid) FROM stdin;
 
   commercial          postgres    false    230   R                0    230232    challan 
   TABLE DATA           �   COPY delivery.challan (uuid, carton_quantity, assign_to, receive_status, created_by, created_at, updated_at, remarks, id, gate_pass, order_info_uuid) FROM stdin;
    delivery          postgres    false    232   �                0    230240    challan_entry 
   TABLE DATA           q   COPY delivery.challan_entry (uuid, challan_uuid, packing_list_uuid, created_at, updated_at, remarks) FROM stdin;
    delivery          postgres    false    233   �                0    230246    packing_list 
   TABLE DATA           �   COPY delivery.packing_list (uuid, carton_size, carton_weight, created_by, created_at, updated_at, remarks, order_info_uuid, id, challan_uuid) FROM stdin;
    delivery          postgres    false    235   m                0    230252    packing_list_entry 
   TABLE DATA           �   COPY delivery.packing_list_entry (uuid, packing_list_uuid, sfg_uuid, quantity, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    delivery          postgres    false    236   �                0    230259    migrations_details 
   TABLE DATA           C   COPY drizzle.migrations_details (id, hash, created_at) FROM stdin;
    drizzle          postgres    false    237   U                0    230265 
   department 
   TABLE DATA           S   COPY hr.department (uuid, department, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    239   �.                 0    230270    designation 
   TABLE DATA           f   COPY hr.designation (uuid, department_uuid, designation, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    240   �/      !          0    230275    policy_and_notice 
   TABLE DATA              COPY hr.policy_and_notice (uuid, type, title, sub_title, url, created_at, updated_at, status, remarks, created_by) FROM stdin;
    hr          postgres    false    241   1      "          0    230280    users 
   TABLE DATA           �   COPY hr.users (uuid, name, email, pass, designation_uuid, can_access, ext, phone, created_at, updated_at, status, remarks) FROM stdin;
    hr          postgres    false    242   $1      #          0    230286    info 
   TABLE DATA           �   COPY lab_dip.info (uuid, id, name, order_info_uuid, created_by, created_at, updated_at, remarks, lab_status, thread_order_info_uuid) FROM stdin;
    lab_dip          postgres    false    243   �=      %          0    230293    recipe 
   TABLE DATA           �   COPY lab_dip.recipe (uuid, id, lab_dip_info_uuid, name, approved, created_by, status, created_at, updated_at, remarks, sub_streat, bleaching) FROM stdin;
    lab_dip          postgres    false    245   8C      &          0    230300    recipe_entry 
   TABLE DATA           {   COPY lab_dip.recipe_entry (uuid, recipe_uuid, color, quantity, created_at, updated_at, remarks, material_uuid) FROM stdin;
    lab_dip          postgres    false    246   �E      )          0    230307    shade_recipe 
   TABLE DATA           �   COPY lab_dip.shade_recipe (uuid, id, name, sub_streat, lab_status, created_by, created_at, updated_at, remarks, bleaching) FROM stdin;
    lab_dip          postgres    false    249   �H      *          0    230314    shade_recipe_entry 
   TABLE DATA           �   COPY lab_dip.shade_recipe_entry (uuid, shade_recipe_uuid, material_uuid, quantity, created_at, updated_at, remarks) FROM stdin;
    lab_dip          postgres    false    250   ;I      +          0    230319    info 
   TABLE DATA           �   COPY material.info (uuid, section_uuid, type_uuid, name, short_name, unit, threshold, description, created_at, updated_at, remarks, created_by) FROM stdin;
    material          postgres    false    251   J      ,          0    230325    section 
   TABLE DATA           h   COPY material.section (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    252   �L      -          0    230330    stock 
   TABLE DATA           �  COPY material.stock (uuid, material_uuid, stock, tape_making, coil_forming, dying_and_iron, m_gapping, v_gapping, v_teeth_molding, m_teeth_molding, teeth_assembling_and_polishing, m_teeth_cleaning, v_teeth_cleaning, plating_and_iron, m_sealing, v_sealing, n_t_cutting, v_t_cutting, m_stopper, v_stopper, n_stopper, cutting, die_casting, slider_assembly, coloring, remarks, lab_dip, m_qc_and_packing, v_qc_and_packing, n_qc_and_packing, s_qc_and_packing) FROM stdin;
    material          postgres    false    253   �M      .          0    230363    stock_to_sfg 
   TABLE DATA           �   COPY material.stock_to_sfg (uuid, material_uuid, order_entry_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    254   �N      /          0    230368    trx 
   TABLE DATA           w   COPY material.trx (uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    255   O      0          0    230373    type 
   TABLE DATA           e   COPY material.type (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    256   �R      1          0    230378    used 
   TABLE DATA           �   COPY material.used (uuid, material_uuid, section, used_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    257   ;S      2          0    230384    buyer 
   TABLE DATA           d   COPY public.buyer (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    258   vT      3          0    230389    factory 
   TABLE DATA           v   COPY public.factory (uuid, party_uuid, name, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    259   �      4          0    230394    machine 
   TABLE DATA           �   COPY public.machine (uuid, name, is_vislon, is_metal, is_nylon, is_sewing_thread, is_bulk, is_sample, min_capacity, max_capacity, water_capacity, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    260   ��      5          0    230406 	   marketing 
   TABLE DATA           s   COPY public.marketing (uuid, name, short_name, user_uuid, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    261   H�      6          0    230411    merchandiser 
   TABLE DATA           �   COPY public.merchandiser (uuid, party_uuid, name, email, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    262   {�      7          0    230416    party 
   TABLE DATA           m   COPY public.party (uuid, name, short_name, remarks, created_at, updated_at, created_by, address) FROM stdin;
    public          postgres    false    263   �      8          0    230421 
   properties 
   TABLE DATA           y   COPY public.properties (uuid, item_for, type, name, short_name, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    264   �N      9          0    230426    section 
   TABLE DATA           B   COPY public.section (uuid, name, short_name, remarks) FROM stdin;
    public          postgres    false    265   �[      ;          0    230432    description 
   TABLE DATA           �   COPY purchase.description (uuid, vendor_uuid, is_local, lc_number, created_by, created_at, updated_at, remarks, id, challan_number) FROM stdin;
    purchase          postgres    false    267   �[      <          0    230438    entry 
   TABLE DATA           �   COPY purchase.entry (uuid, purchase_description_uuid, material_uuid, quantity, price, created_at, updated_at, remarks) FROM stdin;
    purchase          postgres    false    268   Y\      =          0    230444    vendor 
   TABLE DATA           �   COPY purchase.vendor (uuid, name, contact_name, email, office_address, contact_number, remarks, created_at, updated_at, created_by) FROM stdin;
    purchase          postgres    false    269   %]      >          0    230449    assembly_stock 
   TABLE DATA           �   COPY slider.assembly_stock (uuid, name, die_casting_body_uuid, die_casting_puller_uuid, die_casting_cap_uuid, die_casting_link_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    270   ^      ?          0    230456    coloring_transaction 
   TABLE DATA           �   COPY slider.coloring_transaction (uuid, stock_uuid, order_info_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    271   �^      @          0    230462    die_casting 
   TABLE DATA           �   COPY slider.die_casting (uuid, name, item, zipper_number, end_type, puller_type, logo_type, slider_body_shape, puller_link, quantity, weight, pcs_per_kg, created_at, updated_at, remarks, quantity_in_sa, is_logo_body, is_logo_puller, type) FROM stdin;
    slider          postgres    false    272   �^      A          0    230473    die_casting_production 
   TABLE DATA           �   COPY slider.die_casting_production (uuid, die_casting_uuid, mc_no, cavity_goods, cavity_defect, push, weight, order_description_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    slider          postgres    false    273   �a      B          0    230478    die_casting_to_assembly_stock 
   TABLE DATA           �   COPY slider.die_casting_to_assembly_stock (uuid, assembly_stock_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    274   Ed      C          0    230487    die_casting_transaction 
   TABLE DATA           �   COPY slider.die_casting_transaction (uuid, die_casting_uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    275   e      D          0    230493 
   production 
   TABLE DATA           �   COPY slider.production (uuid, stock_uuid, production_quantity, wastage, section, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    276   �g      E          0    230500    stock 
   TABLE DATA           Q  COPY slider.stock (uuid, order_quantity, body_quantity, cap_quantity, puller_quantity, link_quantity, sa_prod, coloring_stock, coloring_prod, trx_to_finishing, u_top_quantity, h_bottom_quantity, box_pin_quantity, two_way_pin_quantity, created_at, updated_at, remarks, quantity_in_sa, order_description_uuid, finishing_stock) FROM stdin;
    slider          postgres    false    277   Fj      F          0    230520    transaction 
   TABLE DATA           �   COPY slider.transaction (uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, from_section, to_section, assembly_stock_uuid, weight) FROM stdin;
    slider          postgres    false    278   �m      G          0    230526    trx_against_stock 
   TABLE DATA           �   COPY slider.trx_against_stock (uuid, die_casting_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    279   �o      I          0    230533    batch 
   TABLE DATA             COPY thread.batch (uuid, id, dyeing_operator, reason, category, status, pass_by, shift, dyeing_supervisor, coning_operator, coning_supervisor, coning_machines, created_by, created_at, updated_at, remarks, yarn_quantity, machine_uuid, lab_created_by, lab_created_at, lab_updated_at, yarn_issue_created_by, yarn_issue_created_at, yarn_issue_updated_at, is_drying_complete, drying_created_at, drying_updated_at, dyeing_created_by, dyeing_created_at, dyeing_updated_at, coning_created_by, coning_created_at, coning_updated_at, slot) FROM stdin;
    thread          postgres    false    281   *q      J          0    230541    batch_entry 
   TABLE DATA           �   COPY thread.batch_entry (uuid, batch_uuid, order_entry_uuid, quantity, coning_production_quantity, coning_production_quantity_in_kg, created_at, updated_at, remarks, coning_created_at, coning_updated_at, transfer_quantity) FROM stdin;
    thread          postgres    false    282   Ms      K          0    230550    batch_entry_production 
   TABLE DATA           �   COPY thread.batch_entry_production (uuid, batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    283   �t      L          0    230555    batch_entry_trx 
   TABLE DATA           x   COPY thread.batch_entry_trx (uuid, batch_entry_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    284   Ou      M          0    230560    challan 
   TABLE DATA           v   COPY thread.challan (uuid, order_info_uuid, carton_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    285   �u      N          0    230565    challan_entry 
   TABLE DATA           �   COPY thread.challan_entry (uuid, challan_uuid, order_entry_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    286   �u      O          0    230570    count_length 
   TABLE DATA           �   COPY thread.count_length (uuid, count, sst, created_by, created_at, updated_at, remarks, min_weight, max_weight, length, price) FROM stdin;
    thread          postgres    false    287   �u      P          0    230575    dyes_category 
   TABLE DATA           �   COPY thread.dyes_category (uuid, name, upto_percentage, bleaching, id, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    288   �v      Q          0    230582    order_entry 
   TABLE DATA           o  COPY thread.order_entry (uuid, order_info_uuid, lab_reference, color, po, style, count_length_uuid, quantity, company_price, party_price, swatch_approval_date, production_quantity, created_by, created_at, updated_at, remarks, bleaching, transfer_quantity, recipe_uuid, pi, delivered, warehouse, short_quantity, reject_quantity, production_quantity_in_kg) FROM stdin;
    thread          postgres    false    289   �w      S          0    230598 
   order_info 
   TABLE DATA           �   COPY thread.order_info (uuid, id, party_uuid, marketing_uuid, factory_uuid, merchandiser_uuid, buyer_uuid, is_sample, is_bill, delivery_date, created_by, created_at, updated_at, remarks, is_cash) FROM stdin;
    thread          postgres    false    291   �z      T          0    230607    programs 
   TABLE DATA           �   COPY thread.programs (uuid, dyes_category_uuid, material_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    292   Q|      U          0    230613    batch 
   TABLE DATA           �   COPY zipper.batch (uuid, id, created_by, created_at, updated_at, remarks, batch_status, machine_uuid, slot, received) FROM stdin;
    zipper          postgres    false    293   �}      V          0    230621    batch_entry 
   TABLE DATA           �   COPY zipper.batch_entry (uuid, batch_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks, sfg_uuid) FROM stdin;
    zipper          postgres    false    294   �      X          0    230630    batch_production 
   TABLE DATA           �   COPY zipper.batch_production (uuid, batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    296   h�      Y          0    230635    dyed_tape_transaction 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction (uuid, order_description_uuid, colors, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    297   ��      Z          0    230640     dyed_tape_transaction_from_stock 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction_from_stock (uuid, order_description_uuid, trx_quantity, tape_coil_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    298   �      [          0    230646    dying_batch 
   TABLE DATA           c   COPY zipper.dying_batch (uuid, id, mc_no, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    299   �      \          0    230651    dying_batch_entry 
   TABLE DATA           �   COPY zipper.dying_batch_entry (uuid, dying_batch_uuid, batch_entry_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    300   3�      ^          0    230657 &   material_trx_against_order_description 
   TABLE DATA           �   COPY zipper.material_trx_against_order_description (uuid, order_description_uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    302   P�      _          0    230662    order_description 
   TABLE DATA           c  COPY zipper.order_description (uuid, order_info_uuid, item, zipper_number, end_type, lock_type, puller_type, teeth_color, puller_color, special_requirement, hand, coloring_type, is_slider_provided, slider, slider_starting_section_enum, top_stopper, bottom_stopper, logo_type, is_logo_body, is_logo_puller, description, status, created_at, updated_at, remarks, slider_body_shape, slider_link, end_user, garment, light_preference, garments_wash, puller_link, created_by, garments_remarks, tape_received, tape_transferred, slider_finishing_stock, nylon_stopper, tape_coil_uuid, tape_color, teeth_type) FROM stdin;
    zipper          postgres    false    303   m�      `          0    230674    order_entry 
   TABLE DATA           �   COPY zipper.order_entry (uuid, order_description_uuid, style, color, size, quantity, company_price, party_price, status, swatch_status_enum, swatch_approval_date, created_at, updated_at, remarks, bleaching) FROM stdin;
    zipper          postgres    false    304   ]�      b          0    230684 
   order_info 
   TABLE DATA             COPY zipper.order_info (uuid, id, reference_order_info_uuid, buyer_uuid, party_uuid, marketing_uuid, merchandiser_uuid, factory_uuid, is_sample, is_bill, is_cash, marketing_priority, factory_priority, status, created_by, created_at, updated_at, remarks, conversion_rate) FROM stdin;
    zipper          postgres    false    306   ǖ      c          0    230695    planning 
   TABLE DATA           U   COPY zipper.planning (week, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    307   ʙ      d          0    230700    planning_entry 
   TABLE DATA           �   COPY zipper.planning_entry (uuid, sfg_uuid, sno_quantity, factory_quantity, production_quantity, batch_production_quantity, created_at, updated_at, planning_week, sno_remarks, factory_remarks) FROM stdin;
    zipper          postgres    false    308   �      e          0    230709    sfg 
   TABLE DATA             COPY zipper.sfg (uuid, order_entry_uuid, recipe_uuid, dying_and_iron_prod, teeth_molding_stock, teeth_molding_prod, teeth_coloring_stock, teeth_coloring_prod, finishing_stock, finishing_prod, coloring_prod, warehouse, delivered, pi, remarks, short_quantity, reject_quantity) FROM stdin;
    zipper          postgres    false    309   �      f          0    230727    sfg_production 
   TABLE DATA           �   COPY zipper.sfg_production (uuid, sfg_uuid, section, production_quantity_in_kg, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    310   ��      g          0    230735    sfg_transaction 
   TABLE DATA           �   COPY zipper.sfg_transaction (uuid, trx_from, trx_to, trx_quantity, slider_item_uuid, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_kg) FROM stdin;
    zipper          postgres    false    311   ��      h          0    230742 	   tape_coil 
   TABLE DATA             COPY zipper.tape_coil (uuid, quantity, trx_quantity_in_coil, quantity_in_coil, remarks, item_uuid, zipper_number_uuid, name, raw_per_kg_meter, dyed_per_kg_meter, created_by, created_at, updated_at, is_import, is_reverse, trx_quantity_in_dying, stock_quantity) FROM stdin;
    zipper          postgres    false    312   z�      i          0    230754    tape_coil_production 
   TABLE DATA           �   COPY zipper.tape_coil_production (uuid, section, tape_coil_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    313   �      j          0    230760    tape_coil_required 
   TABLE DATA           �   COPY zipper.tape_coil_required (uuid, end_type_uuid, item_uuid, nylon_stopper_uuid, zipper_number_uuid, top, bottom, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    314   ��      k          0    230765    tape_coil_to_dyeing 
   TABLE DATA           �   COPY zipper.tape_coil_to_dyeing (uuid, tape_coil_uuid, order_description_uuid, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    315   ��      l          0    230770    tape_trx 
   TABLE DATA              COPY zipper.tape_trx (uuid, tape_coil_uuid, trx_quantity, created_by, created_at, updated_at, remarks, to_section) FROM stdin;
    zipper          postgres    false    316   ��      x           0    0    lc_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.lc_sequence', 9, true);
       
   commercial          postgres    false    226            y           0    0    pi_sequence    SEQUENCE SET     >   SELECT pg_catalog.setval('commercial.pi_sequence', 35, true);
       
   commercial          postgres    false    228            z           0    0    challan_sequence    SEQUENCE SET     @   SELECT pg_catalog.setval('delivery.challan_sequence', 6, true);
          delivery          postgres    false    231            {           0    0    packing_list_sequence    SEQUENCE SET     F   SELECT pg_catalog.setval('delivery.packing_list_sequence', 10, true);
          delivery          postgres    false    234            |           0    0    migrations_details_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('drizzle.migrations_details_id_seq', 126, true);
          drizzle          postgres    false    238            }           0    0    info_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('lab_dip.info_id_seq', 135, true);
          lab_dip          postgres    false    244            ~           0    0    recipe_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('lab_dip.recipe_id_seq', 16, true);
          lab_dip          postgres    false    247                       0    0    shade_recipe_sequence    SEQUENCE SET     E   SELECT pg_catalog.setval('lab_dip.shade_recipe_sequence', 12, true);
          lab_dip          postgres    false    248            �           0    0    purchase_description_sequence    SEQUENCE SET     N   SELECT pg_catalog.setval('purchase.purchase_description_sequence', 10, true);
          purchase          postgres    false    266            �           0    0    thread_batch_sequence    SEQUENCE SET     D   SELECT pg_catalog.setval('thread.thread_batch_sequence', 26, true);
          thread          postgres    false    280            �           0    0    thread_order_info_sequence    SEQUENCE SET     H   SELECT pg_catalog.setval('thread.thread_order_info_sequence', 8, true);
          thread          postgres    false    290            �           0    0    batch_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('zipper.batch_id_seq', 13, true);
          zipper          postgres    false    295            �           0    0    dying_batch_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('zipper.dying_batch_id_seq', 1, false);
          zipper          postgres    false    301            �           0    0    order_info_sequence    SEQUENCE SET     B   SELECT pg_catalog.setval('zipper.order_info_sequence', 16, true);
          zipper          postgres    false    305            �           2606    230791    bank bank_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_pkey;
    
   commercial            postgres    false    225            �           2606    230793 
   lc lc_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_pkey;
    
   commercial            postgres    false    227            �           2606    230795     pi_cash_entry pi_cash_entry_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pkey;
    
   commercial            postgres    false    230            �           2606    230797    pi_cash pi_cash_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_pkey;
    
   commercial            postgres    false    229            �           2606    230799     challan_entry challan_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_pkey;
       delivery            postgres    false    233            �           2606    230801    challan challan_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_pkey;
       delivery            postgres    false    232            �           2606    230803 *   packing_list_entry packing_list_entry_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_pkey;
       delivery            postgres    false    236            �           2606    230805    packing_list packing_list_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_pkey;
       delivery            postgres    false    235            �           2606    230807 *   migrations_details migrations_details_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY drizzle.migrations_details
    ADD CONSTRAINT migrations_details_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY drizzle.migrations_details DROP CONSTRAINT migrations_details_pkey;
       drizzle            postgres    false    237            �           2606    230809    department department_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_pkey;
       hr            postgres    false    239            �           2606    230811    designation designation_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_pkey;
       hr            postgres    false    240            �           2606    230813 (   policy_and_notice policy_and_notice_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_pkey;
       hr            postgres    false    241            �           2606    230815    users users_email_unique 
   CONSTRAINT     P   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_email_unique;
       hr            postgres    false    242            �           2606    230817    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_pkey;
       hr            postgres    false    242            �           2606    230819    info info_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 9   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_pkey;
       lab_dip            postgres    false    243            �           2606    230821    recipe_entry recipe_entry_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_pkey;
       lab_dip            postgres    false    246            �           2606    230823    recipe recipe_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (uuid);
 =   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_pkey;
       lab_dip            postgres    false    245            �           2606    230825 *   shade_recipe_entry shade_recipe_entry_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_pkey PRIMARY KEY (uuid);
 U   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_pkey;
       lab_dip            postgres    false    250            �           2606    230827    shade_recipe shade_recipe_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_pkey;
       lab_dip            postgres    false    249            �           2606    230829    info info_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.info DROP CONSTRAINT info_pkey;
       material            postgres    false    251            �           2606    230831    section section_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY material.section DROP CONSTRAINT section_pkey;
       material            postgres    false    252            �           2606    230833    stock stock_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_pkey;
       material            postgres    false    253            �           2606    230835    stock_to_sfg stock_to_sfg_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_pkey;
       material            postgres    false    254            �           2606    230837    trx trx_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_pkey;
       material            postgres    false    255            �           2606    230839    type type_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.type DROP CONSTRAINT type_pkey;
       material            postgres    false    256            �           2606    230841    used used_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.used DROP CONSTRAINT used_pkey;
       material            postgres    false    257            �           2606    230843    buyer buyer_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_name_unique;
       public            postgres    false    258            �           2606    230845    buyer buyer_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_pkey;
       public            postgres    false    258            �           2606    230847    factory factory_name_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_name_unique UNIQUE (name);
 E   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_name_unique;
       public            postgres    false    259            �           2606    230849    factory factory_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_pkey;
       public            postgres    false    259            �           2606    230851    machine machine_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_pkey;
       public            postgres    false    260            �           2606    230853    marketing marketing_name_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_name_unique UNIQUE (name);
 I   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_name_unique;
       public            postgres    false    261            �           2606    230855    marketing marketing_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_pkey;
       public            postgres    false    261                        2606    230857 %   merchandiser merchandiser_name_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_name_unique UNIQUE (name);
 O   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_name_unique;
       public            postgres    false    262                       2606    230859    merchandiser merchandiser_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_pkey;
       public            postgres    false    262                       2606    230861    party party_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.party DROP CONSTRAINT party_name_unique;
       public            postgres    false    263                       2606    230863    party party_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    263                       2606    230865    properties properties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY public.properties DROP CONSTRAINT properties_pkey;
       public            postgres    false    264            
           2606    230867    section section_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.section DROP CONSTRAINT section_pkey;
       public            postgres    false    265                       2606    230869    description description_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_pkey;
       purchase            postgres    false    267                       2606    230871    entry entry_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_pkey;
       purchase            postgres    false    268                       2606    230873    vendor vendor_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_pkey;
       purchase            postgres    false    269                       2606    230875 "   assembly_stock assembly_stock_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_pkey;
       slider            postgres    false    270                       2606    230877 .   coloring_transaction coloring_transaction_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_pkey;
       slider            postgres    false    271                       2606    230879    die_casting die_casting_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_pkey;
       slider            postgres    false    272                       2606    230881 2   die_casting_production die_casting_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_pkey;
       slider            postgres    false    273                       2606    230883 @   die_casting_to_assembly_stock die_casting_to_assembly_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_pkey PRIMARY KEY (uuid);
 j   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_pkey;
       slider            postgres    false    274                       2606    230885 4   die_casting_transaction die_casting_transaction_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_pkey PRIMARY KEY (uuid);
 ^   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_pkey;
       slider            postgres    false    275                       2606    230887    production production_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_pkey;
       slider            postgres    false    276                        2606    230889    stock stock_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_pkey;
       slider            postgres    false    277            "           2606    230891    transaction transaction_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_pkey;
       slider            postgres    false    278            $           2606    230893 (   trx_against_stock trx_against_stock_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_pkey;
       slider            postgres    false    279            (           2606    230895    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_pkey;
       thread            postgres    false    282            *           2606    230897 2   batch_entry_production batch_entry_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_pkey;
       thread            postgres    false    283            ,           2606    230899 $   batch_entry_trx batch_entry_trx_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_pkey;
       thread            postgres    false    284            &           2606    230901    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pkey;
       thread            postgres    false    281            0           2606    230903     challan_entry challan_entry_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_pkey;
       thread            postgres    false    286            .           2606    230905    challan challan_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_pkey;
       thread            postgres    false    285            2           2606    230907 !   count_length count_length_uuid_pk 
   CONSTRAINT     a   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_uuid_pk PRIMARY KEY (uuid);
 K   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_uuid_pk;
       thread            postgres    false    287            4           2606    230909     dyes_category dyes_category_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_pkey;
       thread            postgres    false    288            6           2606    230911    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_pkey;
       thread            postgres    false    289            8           2606    230913    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_pkey;
       thread            postgres    false    291            :           2606    230915    programs programs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_pkey;
       thread            postgres    false    292            >           2606    230917    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_pkey;
       zipper            postgres    false    294            <           2606    230919    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_pkey;
       zipper            postgres    false    293            @           2606    230921 &   batch_production batch_production_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_pkey PRIMARY KEY (uuid);
 P   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_pkey;
       zipper            postgres    false    296            D           2606    230923 F   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_pkey PRIMARY KEY (uuid);
 p   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_pkey;
       zipper            postgres    false    298            B           2606    230925 0   dyed_tape_transaction dyed_tape_transaction_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_pkey;
       zipper            postgres    false    297            H           2606    230927 (   dying_batch_entry dying_batch_entry_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_pkey;
       zipper            postgres    false    300            F           2606    230929    dying_batch dying_batch_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.dying_batch
    ADD CONSTRAINT dying_batch_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.dying_batch DROP CONSTRAINT dying_batch_pkey;
       zipper            postgres    false    299            J           2606    230931 R   material_trx_against_order_description material_trx_against_order_description_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_pkey PRIMARY KEY (uuid);
 |   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_pkey;
       zipper            postgres    false    302            L           2606    230933 (   order_description order_description_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_pkey;
       zipper            postgres    false    303            N           2606    230935    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_pkey;
       zipper            postgres    false    304            P           2606    230937    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_pkey;
       zipper            postgres    false    306            T           2606    230939 "   planning_entry planning_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_pkey;
       zipper            postgres    false    308            R           2606    230941    planning planning_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_pkey PRIMARY KEY (week);
 @   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_pkey;
       zipper            postgres    false    307            V           2606    230943    sfg sfg_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_pkey;
       zipper            postgres    false    309            X           2606    230945 "   sfg_production sfg_production_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_pkey;
       zipper            postgres    false    310            Z           2606    230947 $   sfg_transaction sfg_transaction_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_pkey;
       zipper            postgres    false    311            \           2606    230949    tape_coil tape_coil_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_pkey;
       zipper            postgres    false    312            ^           2606    230951 .   tape_coil_production tape_coil_production_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_pkey;
       zipper            postgres    false    313            `           2606    230953 *   tape_coil_required tape_coil_required_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_pkey PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_pkey;
       zipper            postgres    false    314            b           2606    230955 ,   tape_coil_to_dyeing tape_coil_to_dyeing_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_pkey;
       zipper            postgres    false    315            d           2606    230957    tape_trx tape_to_coil_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_pkey;
       zipper            postgres    false    316            +           2620    230958 :   pi_cash_entry sfg_after_commercial_pi_entry_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_delete_trigger AFTER DELETE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_delete_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    230    403            ,           2620    230959 :   pi_cash_entry sfg_after_commercial_pi_entry_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_insert_trigger AFTER INSERT ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_insert_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    346    230            -           2620    230960 :   pi_cash_entry sfg_after_commercial_pi_entry_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_update_trigger AFTER UPDATE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_update_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    325    230            .           2620    230961 5   challan_entry packing_list_after_challan_entry_delete    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_delete AFTER DELETE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_delete_function();
 P   DROP TRIGGER packing_list_after_challan_entry_delete ON delivery.challan_entry;
       delivery          postgres    false    233    387            /           2620    230962 5   challan_entry packing_list_after_challan_entry_insert    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_insert AFTER INSERT ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_insert_function();
 P   DROP TRIGGER packing_list_after_challan_entry_insert ON delivery.challan_entry;
       delivery          postgres    false    381    233            0           2620    230963 5   challan_entry packing_list_after_challan_entry_update    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_update AFTER UPDATE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_update_function();
 P   DROP TRIGGER packing_list_after_challan_entry_update ON delivery.challan_entry;
       delivery          postgres    false    332    233            1           2620    230964 :   packing_list_entry sfg_after_challan_receive_status_delete    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_delete ON delivery.packing_list_entry;
       delivery          postgres    false    329    236            2           2620    230965 :   packing_list_entry sfg_after_challan_receive_status_insert    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_insert ON delivery.packing_list_entry;
       delivery          postgres    false    390    236            3           2620    230966 :   packing_list_entry sfg_after_challan_receive_status_update    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_update ON delivery.packing_list_entry;
       delivery          postgres    false    236    414            4           2620    230967 6   packing_list_entry sfg_after_packing_list_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_delete_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_delete ON delivery.packing_list_entry;
       delivery          postgres    false    327    236            5           2620    230968 6   packing_list_entry sfg_after_packing_list_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_insert_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_insert ON delivery.packing_list_entry;
       delivery          postgres    false    417    236            6           2620    230969 6   packing_list_entry sfg_after_packing_list_entry_update    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_update_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_update ON delivery.packing_list_entry;
       delivery          postgres    false    374    236            7           2620    230970 .   info material_stock_after_material_info_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_delete AFTER DELETE ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_delete();
 I   DROP TRIGGER material_stock_after_material_info_delete ON material.info;
       material          postgres    false    406    251            8           2620    230971 .   info material_stock_after_material_info_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_insert AFTER INSERT ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_insert();
 I   DROP TRIGGER material_stock_after_material_info_insert ON material.info;
       material          postgres    false    391    251            <           2620    230972 ,   trx material_stock_after_material_trx_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_delete AFTER DELETE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_delete();
 G   DROP TRIGGER material_stock_after_material_trx_delete ON material.trx;
       material          postgres    false    401    255            =           2620    230973 ,   trx material_stock_after_material_trx_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_insert AFTER INSERT ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_insert();
 G   DROP TRIGGER material_stock_after_material_trx_insert ON material.trx;
       material          postgres    false    379    255            >           2620    230974 ,   trx material_stock_after_material_trx_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_update AFTER UPDATE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_update();
 G   DROP TRIGGER material_stock_after_material_trx_update ON material.trx;
       material          postgres    false    398    255            ?           2620    230975 .   used material_stock_after_material_used_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_delete AFTER DELETE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_delete();
 I   DROP TRIGGER material_stock_after_material_used_delete ON material.used;
       material          postgres    false    397    257            @           2620    230976 .   used material_stock_after_material_used_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_insert AFTER INSERT ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_insert();
 I   DROP TRIGGER material_stock_after_material_used_insert ON material.used;
       material          postgres    false    394    257            A           2620    230977 .   used material_stock_after_material_used_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_update AFTER UPDATE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_update();
 I   DROP TRIGGER material_stock_after_material_used_update ON material.used;
       material          postgres    false    257    354            9           2620    230978 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_delete    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete AFTER DELETE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_delete ON material.stock_to_sfg;
       material          postgres    false    386    254            :           2620    230979 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_insert    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert AFTER INSERT ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_insert ON material.stock_to_sfg;
       material          postgres    false    383    254            ;           2620    230980 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_update    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update AFTER UPDATE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_update ON material.stock_to_sfg;
       material          postgres    false    254    364            B           2620    230981 0   entry material_stock_after_purchase_entry_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_delete AFTER DELETE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();
 K   DROP TRIGGER material_stock_after_purchase_entry_delete ON purchase.entry;
       purchase          postgres    false    375    268            C           2620    230982 0   entry material_stock_after_purchase_entry_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_insert AFTER INSERT ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();
 K   DROP TRIGGER material_stock_after_purchase_entry_insert ON purchase.entry;
       purchase          postgres    false    385    268            D           2620    230983 0   entry material_stock_after_purchase_entry_update    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_update AFTER UPDATE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();
 K   DROP TRIGGER material_stock_after_purchase_entry_update ON purchase.entry;
       purchase          postgres    false    331    268            K           2620    230984 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_delete    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete AFTER DELETE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    324    274            L           2620    230985 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_insert    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert AFTER INSERT ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    371    274            M           2620    230986 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_update    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update AFTER UPDATE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    367    274            H           2620    230987 M   die_casting_production slider_die_casting_after_die_casting_production_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_delete AFTER DELETE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_delete ON slider.die_casting_production;
       slider          postgres    false    404    273            I           2620    230988 M   die_casting_production slider_die_casting_after_die_casting_production_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_insert AFTER INSERT ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_insert ON slider.die_casting_production;
       slider          postgres    false    334    273            J           2620    230989 M   die_casting_production slider_die_casting_after_die_casting_production_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_update AFTER UPDATE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_update ON slider.die_casting_production;
       slider          postgres    false    369    273            W           2620    230990 C   trx_against_stock slider_die_casting_after_trx_against_stock_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete AFTER DELETE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_delete ON slider.trx_against_stock;
       slider          postgres    false    376    279            X           2620    230991 C   trx_against_stock slider_die_casting_after_trx_against_stock_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert AFTER INSERT ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_insert ON slider.trx_against_stock;
       slider          postgres    false    409    279            Y           2620    230992 C   trx_against_stock slider_die_casting_after_trx_against_stock_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_update AFTER UPDATE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_update ON slider.trx_against_stock;
       slider          postgres    false    279    393            E           2620    230993 C   coloring_transaction slider_stock_after_coloring_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_delete AFTER DELETE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_delete ON slider.coloring_transaction;
       slider          postgres    false    340    271            F           2620    230994 C   coloring_transaction slider_stock_after_coloring_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_insert AFTER INSERT ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_insert ON slider.coloring_transaction;
       slider          postgres    false    373    271            G           2620    230995 C   coloring_transaction slider_stock_after_coloring_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_update AFTER UPDATE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_update ON slider.coloring_transaction;
       slider          postgres    false    271    355            N           2620    230996 I   die_casting_transaction slider_stock_after_die_casting_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_delete AFTER DELETE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_delete ON slider.die_casting_transaction;
       slider          postgres    false    321    275            O           2620    230997 I   die_casting_transaction slider_stock_after_die_casting_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_insert AFTER INSERT ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_insert ON slider.die_casting_transaction;
       slider          postgres    false    370    275            P           2620    230998 I   die_casting_transaction slider_stock_after_die_casting_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_update AFTER UPDATE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_update ON slider.die_casting_transaction;
       slider          postgres    false    339    275            Q           2620    230999 6   production slider_stock_after_slider_production_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_delete AFTER DELETE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();
 O   DROP TRIGGER slider_stock_after_slider_production_delete ON slider.production;
       slider          postgres    false    361    276            R           2620    231000 6   production slider_stock_after_slider_production_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_insert AFTER INSERT ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();
 O   DROP TRIGGER slider_stock_after_slider_production_insert ON slider.production;
       slider          postgres    false    326    276            S           2620    231001 6   production slider_stock_after_slider_production_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_update AFTER UPDATE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();
 O   DROP TRIGGER slider_stock_after_slider_production_update ON slider.production;
       slider          postgres    false    352    276            T           2620    231002 1   transaction slider_stock_after_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_delete AFTER DELETE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();
 J   DROP TRIGGER slider_stock_after_transaction_delete ON slider.transaction;
       slider          postgres    false    405    278            U           2620    231003 1   transaction slider_stock_after_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_insert AFTER INSERT ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();
 J   DROP TRIGGER slider_stock_after_transaction_insert ON slider.transaction;
       slider          postgres    false    335    278            V           2620    231004 1   transaction slider_stock_after_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_update AFTER UPDATE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_update();
 J   DROP TRIGGER slider_stock_after_transaction_update ON slider.transaction;
       slider          postgres    false    357    278            Z           2620    231005 7   batch order_entry_after_batch_is_drying_update_function    TRIGGER     �   CREATE TRIGGER order_entry_after_batch_is_drying_update_function AFTER UPDATE ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_drying_update();
 P   DROP TRIGGER order_entry_after_batch_is_drying_update_function ON thread.batch;
       thread          postgres    false    384    281            [           2620    231006 7   batch order_entry_after_batch_is_dyeing_update_function    TRIGGER     �   CREATE TRIGGER order_entry_after_batch_is_dyeing_update_function AFTER UPDATE OF is_drying_complete ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();
 P   DROP TRIGGER order_entry_after_batch_is_dyeing_update_function ON thread.batch;
       thread          postgres    false    281    402    281            \           2620    231007 M   batch_entry_production thread_batch_entry_after_batch_entry_production_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_delete AFTER DELETE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_delete ON thread.batch_entry_production;
       thread          postgres    false    328    283            ]           2620    231008 M   batch_entry_production thread_batch_entry_after_batch_entry_production_insert    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_insert AFTER INSERT ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_insert ON thread.batch_entry_production;
       thread          postgres    false    347    283            ^           2620    231009 M   batch_entry_production thread_batch_entry_after_batch_entry_production_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_update AFTER UPDATE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_update ON thread.batch_entry_production;
       thread          postgres    false    283    343            _           2620    231010 H   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx AFTER INSERT ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
 a   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx ON thread.batch_entry_trx;
       thread          postgres    false    396    284            `           2620    231011 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete AFTER DELETE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete ON thread.batch_entry_trx;
       thread          postgres    false    407    284            a           2620    231012 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update AFTER UPDATE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update ON thread.batch_entry_trx;
       thread          postgres    false    360    284            e           2620    231013 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger AFTER DELETE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_delete_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    378    297            f           2620    231014 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger AFTER INSERT ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_insert_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    320    297            g           2620    231015 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_update_trigger AFTER UPDATE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_update_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    372    297            n           2620    231016 (   order_entry sfg_after_order_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_delete AFTER DELETE ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();
 A   DROP TRIGGER sfg_after_order_entry_delete ON zipper.order_entry;
       zipper          postgres    false    392    304            o           2620    231017 (   order_entry sfg_after_order_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_insert AFTER INSERT ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();
 A   DROP TRIGGER sfg_after_order_entry_insert ON zipper.order_entry;
       zipper          postgres    false    356    304            p           2620    231018 6   sfg_production sfg_after_sfg_production_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_delete_trigger AFTER DELETE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_delete_function();
 O   DROP TRIGGER sfg_after_sfg_production_delete_trigger ON zipper.sfg_production;
       zipper          postgres    false    366    310            q           2620    231019 6   sfg_production sfg_after_sfg_production_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_insert_trigger AFTER INSERT ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_insert_function();
 O   DROP TRIGGER sfg_after_sfg_production_insert_trigger ON zipper.sfg_production;
       zipper          postgres    false    353    310            r           2620    231020 6   sfg_production sfg_after_sfg_production_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_update_trigger AFTER UPDATE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_update_function();
 O   DROP TRIGGER sfg_after_sfg_production_update_trigger ON zipper.sfg_production;
       zipper          postgres    false    408    310            s           2620    231021 8   sfg_transaction sfg_after_sfg_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_delete_trigger AFTER DELETE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_delete_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_delete_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    348    311            t           2620    231022 8   sfg_transaction sfg_after_sfg_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_insert_trigger AFTER INSERT ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_insert_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_insert_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    345    311            u           2620    231023 8   sfg_transaction sfg_after_sfg_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_update_trigger AFTER UPDATE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_update_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_update_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    338    311            k           2620    231024 `   material_trx_against_order_description stock_after_material_trx_against_order_description_delete    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_delete AFTER DELETE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_delete ON zipper.material_trx_against_order_description;
       zipper          postgres    false    416    302            l           2620    231025 `   material_trx_against_order_description stock_after_material_trx_against_order_description_insert    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_insert AFTER INSERT ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_insert ON zipper.material_trx_against_order_description;
       zipper          postgres    false    302    358            m           2620    231026 `   material_trx_against_order_description stock_after_material_trx_against_order_description_update    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_update AFTER UPDATE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_update ON zipper.material_trx_against_order_description;
       zipper          postgres    false    389    302            v           2620    231027 9   tape_coil_production tape_coil_after_tape_coil_production    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production AFTER INSERT ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();
 R   DROP TRIGGER tape_coil_after_tape_coil_production ON zipper.tape_coil_production;
       zipper          postgres    false    399    313            w           2620    231028 @   tape_coil_production tape_coil_after_tape_coil_production_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_delete AFTER DELETE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_delete ON zipper.tape_coil_production;
       zipper          postgres    false    344    313            x           2620    231029 @   tape_coil_production tape_coil_after_tape_coil_production_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_update AFTER UPDATE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_update ON zipper.tape_coil_production;
       zipper          postgres    false    337    313            |           2620    231030 .   tape_trx tape_coil_after_tape_trx_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_delete AFTER DELETE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_delete ON zipper.tape_trx;
       zipper          postgres    false    412    316            }           2620    231031 .   tape_trx tape_coil_after_tape_trx_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_insert AFTER INSERT ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_insert ON zipper.tape_trx;
       zipper          postgres    false    413    316            ~           2620    231032 .   tape_trx tape_coil_after_tape_trx_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_update AFTER UPDATE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_update ON zipper.tape_trx;
       zipper          postgres    false    365    316            h           2620    231033 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_del    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del AFTER DELETE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    350    298            i           2620    231034 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_ins    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins AFTER INSERT ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    341    298            j           2620    231035 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_upd    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    359    298            y           2620    231036 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_delete AFTER DELETE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();
 M   DROP TRIGGER tape_coil_to_dyeing_after_delete ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    415    315            z           2620    231037 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_insert AFTER INSERT ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
 M   DROP TRIGGER tape_coil_to_dyeing_after_insert ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    368    315            {           2620    231038 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_update AFTER UPDATE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();
 M   DROP TRIGGER tape_coil_to_dyeing_after_update ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    411    315            b           2620    231039 A   batch_production zipper_batch_entry_after_batch_production_delete    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_delete AFTER DELETE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_delete();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_delete ON zipper.batch_production;
       zipper          postgres    false    351    296            c           2620    231040 A   batch_production zipper_batch_entry_after_batch_production_insert    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_insert AFTER INSERT ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_insert();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_insert ON zipper.batch_production;
       zipper          postgres    false    296    410            d           2620    231041 A   batch_production zipper_batch_entry_after_batch_production_update    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_update AFTER UPDATE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_update();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_update ON zipper.batch_production;
       zipper          postgres    false    388    296            e           2606    231042 "   bank bank_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 P   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_created_by_users_uuid_fk;
    
   commercial          postgres    false    225    5336    242            f           2606    231047    lc lc_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_created_by_users_uuid_fk;
    
   commercial          postgres    false    242    227    5336            g           2606    231052    lc lc_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    227    5382    263            h           2606    231057 &   pi_cash pi_cash_bank_uuid_bank_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);
 T   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk;
    
   commercial          postgres    false    225    229    5310            i           2606    231062 (   pi_cash pi_cash_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_created_by_users_uuid_fk;
    
   commercial          postgres    false    229    242    5336            o           2606    231067 8   pi_cash_entry pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);
 f   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk;
    
   commercial          postgres    false    5314    229    230            p           2606    231072 0   pi_cash_entry pi_cash_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk;
    
   commercial          postgres    false    230    5462    309            q           2606    231077 G   pi_cash_entry pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (thread_order_entry_uuid) REFERENCES thread.order_entry(uuid);
 u   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk;
    
   commercial          postgres    false    230    5430    289            j           2606    231082 ,   pi_cash pi_cash_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 Z   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk;
    
   commercial          postgres    false    5368    229    259            k           2606    231087 "   pi_cash pi_cash_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 P   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    229    5312    227            l           2606    231092 0   pi_cash pi_cash_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk;
    
   commercial          postgres    false    261    5374    229            m           2606    231097 6   pi_cash pi_cash_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 d   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk;
    
   commercial          postgres    false    229    262    5378            n           2606    231102 (   pi_cash pi_cash_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    229    5382    263            r           2606    231107 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       delivery          postgres    false    242    5336    232            s           2606    231112 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       delivery          postgres    false    5336    242    232            u           2606    231117 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 d   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    233    5318    232            v           2606    231122 B   challan_entry challan_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 n   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    235    233    5322            t           2606    231127 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 ^   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    232    306    5456            w           2606    231132 6   packing_list packing_list_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 b   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    235    232    5318            x           2606    231137 2   packing_list packing_list_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_created_by_users_uuid_fk;
       delivery          postgres    false    5336    235    242            z           2606    231142 L   packing_list_entry packing_list_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 x   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    236    5322    235            {           2606    231147 :   packing_list_entry packing_list_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 f   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk;
       delivery          postgres    false    5462    309    236            y           2606    231152 <   packing_list packing_list_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 h   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    306    235    5456            |           2606    231157 :   designation designation_department_uuid_department_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_department_uuid_department_uuid_fk FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 `   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_department_uuid_department_uuid_fk;
       hr          postgres    false    240    239    5328            }           2606    231162 <   policy_and_notice policy_and_notice_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_created_by_users_uuid_fk;
       hr          postgres    false    5336    241    242            ~           2606    231167 0   users users_designation_uuid_designation_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_designation_uuid_designation_uuid_fk FOREIGN KEY (designation_uuid) REFERENCES hr.designation(uuid);
 V   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_designation_uuid_designation_uuid_fk;
       hr          postgres    false    242    5330    240                       2606    231172 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 M   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       lab_dip          postgres    false    243    242    5336            �           2606    231177 ,   info info_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 W   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    5456    243    306            �           2606    231182 3   info info_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 ^   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    291    5432    243            �           2606    231187 &   recipe recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    245    242    5336            �           2606    231192 4   recipe_entry recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    5348    251    246            �           2606    231197 4   recipe_entry recipe_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk;
       lab_dip          postgres    false    245    246    5340            �           2606    231202 ,   recipe recipe_lab_dip_info_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk FOREIGN KEY (lab_dip_info_uuid) REFERENCES lab_dip.info(uuid);
 W   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk;
       lab_dip          postgres    false    245    243    5338            �           2606    231207 2   shade_recipe shade_recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ]   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    5336    249    242            �           2606    231212 @   shade_recipe_entry shade_recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 k   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    250    5348    251            �           2606    231217 L   shade_recipe_entry shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk FOREIGN KEY (shade_recipe_uuid) REFERENCES lab_dip.shade_recipe(uuid);
 w   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk;
       lab_dip          postgres    false    250    5344    249            �           2606    231222 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       material          postgres    false    251    5336    242            �           2606    231227 &   info info_section_uuid_section_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_section_uuid_section_uuid_fk FOREIGN KEY (section_uuid) REFERENCES material.section(uuid);
 R   ALTER TABLE ONLY material.info DROP CONSTRAINT info_section_uuid_section_uuid_fk;
       material          postgres    false    251    5350    252            �           2606    231232     info info_type_uuid_type_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_type_uuid_type_uuid_fk FOREIGN KEY (type_uuid) REFERENCES material.type(uuid);
 L   ALTER TABLE ONLY material.info DROP CONSTRAINT info_type_uuid_type_uuid_fk;
       material          postgres    false    251    5358    256            �           2606    231237 (   section section_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY material.section DROP CONSTRAINT section_created_by_users_uuid_fk;
       material          postgres    false    242    5336    252            �           2606    231242 &   stock stock_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_material_uuid_info_uuid_fk;
       material          postgres    false    5348    251    253            �           2606    231247 2   stock_to_sfg stock_to_sfg_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_created_by_users_uuid_fk;
       material          postgres    false    242    254    5336            �           2606    231252 4   stock_to_sfg stock_to_sfg_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 `   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk;
       material          postgres    false    251    5348    254            �           2606    231257 >   stock_to_sfg stock_to_sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 j   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk;
       material          postgres    false    304    5454    254            �           2606    231262     trx trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_created_by_users_uuid_fk;
       material          postgres    false    5336    255    242            �           2606    231267 "   trx trx_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 N   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_material_uuid_info_uuid_fk;
       material          postgres    false    255    5348    251            �           2606    231272 "   type type_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.type DROP CONSTRAINT type_created_by_users_uuid_fk;
       material          postgres    false    5336    242    256            �           2606    231277 "   used used_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.used DROP CONSTRAINT used_created_by_users_uuid_fk;
       material          postgres    false    5336    257    242            �           2606    231282 $   used used_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 P   ALTER TABLE ONLY material.used DROP CONSTRAINT used_material_uuid_info_uuid_fk;
       material          postgres    false    5348    251    257            �           2606    231287 $   buyer buyer_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_created_by_users_uuid_fk;
       public          postgres    false    242    5336    258            �           2606    231292 (   factory factory_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_created_by_users_uuid_fk;
       public          postgres    false    242    5336    259            �           2606    231297 (   factory factory_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_party_uuid_party_uuid_fk;
       public          postgres    false    259    5382    263            �           2606    231302 (   machine machine_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_created_by_users_uuid_fk;
       public          postgres    false    260    5336    242            �           2606    231307 ,   marketing marketing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_created_by_users_uuid_fk;
       public          postgres    false    261    5336    242            �           2606    231312 +   marketing marketing_user_uuid_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_user_uuid_users_uuid_fk FOREIGN KEY (user_uuid) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_user_uuid_users_uuid_fk;
       public          postgres    false    242    5336    261            �           2606    231317 2   merchandiser merchandiser_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_created_by_users_uuid_fk;
       public          postgres    false    5336    262    242            �           2606    231322 2   merchandiser merchandiser_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_party_uuid_party_uuid_fk;
       public          postgres    false    262    5382    263            �           2606    231327 $   party party_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.party DROP CONSTRAINT party_created_by_users_uuid_fk;
       public          postgres    false    263    5336    242            �           2606    231332 0   description description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_created_by_users_uuid_fk;
       purchase          postgres    false    5336    267    242            �           2606    231337 2   description description_vendor_uuid_vendor_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_vendor_uuid_vendor_uuid_fk FOREIGN KEY (vendor_uuid) REFERENCES purchase.vendor(uuid);
 ^   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_vendor_uuid_vendor_uuid_fk;
       purchase          postgres    false    5392    267    269            �           2606    231342 &   entry entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_material_uuid_info_uuid_fk;
       purchase          postgres    false    5348    268    251            �           2606    231347 9   entry entry_purchase_description_uuid_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_purchase_description_uuid_description_uuid_fk FOREIGN KEY (purchase_description_uuid) REFERENCES purchase.description(uuid);
 e   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_purchase_description_uuid_description_uuid_fk;
       purchase          postgres    false    5388    268    267            �           2606    231352 &   vendor vendor_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_created_by_users_uuid_fk;
       purchase          postgres    false    5336    269    242            �           2606    231357 6   assembly_stock assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    5336    270    242            �           2606    231362 B   coloring_transaction coloring_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_created_by_users_uuid_fk;
       slider          postgres    false    5336    242    271            �           2606    231367 L   coloring_transaction coloring_transaction_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 v   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk;
       slider          postgres    false    306    271    5456            �           2606    231372 B   coloring_transaction coloring_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    277    271    5408            �           2606    231377 3   die_casting die_casting_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 ]   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_end_type_properties_uuid_fk;
       slider          postgres    false    264    5384    272            �           2606    231382 /   die_casting die_casting_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 Y   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_item_properties_uuid_fk;
       slider          postgres    false    264    272    5384            �           2606    231387 4   die_casting die_casting_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 ^   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_logo_type_properties_uuid_fk;
       slider          postgres    false    5384    272    264            �           2606    231392 F   die_casting_production die_casting_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_created_by_users_uuid_fk;
       slider          postgres    false    242    5336    273            �           2606    231397 R   die_casting_production die_casting_production_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 |   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    272    5398    273            �           2606    231402 V   die_casting_production die_casting_production_order_description_uuid_order_description    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_order_description_uuid_order_description FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_order_description_uuid_order_description;
       slider          postgres    false    5452    303    273            �           2606    231407 6   die_casting die_casting_puller_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_link_properties_uuid_fk FOREIGN KEY (puller_link) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_link_properties_uuid_fk;
       slider          postgres    false    272    5384    264            �           2606    231412 6   die_casting die_casting_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_type_properties_uuid_fk;
       slider          postgres    false    264    272    5384            �           2606    231417 <   die_casting die_casting_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 f   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk;
       slider          postgres    false    264    5384    272            �           2606    231422 ]   die_casting_to_assembly_stock die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc;
       slider          postgres    false    274    270    5394            �           2606    231427 T   die_casting_to_assembly_stock die_casting_to_assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    242    274    5336            �           2606    231432 H   die_casting_transaction die_casting_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_created_by_users_uuid_fk;
       slider          postgres    false    242    275    5336            �           2606    231437 T   die_casting_transaction die_casting_transaction_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    272    5398    275            �           2606    231442 H   die_casting_transaction die_casting_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    277    275    5408            �           2606    231447 8   die_casting die_casting_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 b   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_zipper_number_properties_uuid_fk;
       slider          postgres    false    272    264    5384            �           2606    231452 .   production production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_created_by_users_uuid_fk;
       slider          postgres    false    276    5336    242            �           2606    231457 .   production production_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_stock_uuid_stock_uuid_fk;
       slider          postgres    false    276    5408    277            �           2606    231462 <   stock stock_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 f   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_order_description_uuid_order_description_uuid_fk;
       slider          postgres    false    277    5452    303            �           2606    231467 B   transaction transaction_assembly_stock_uuid_assembly_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 l   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk;
       slider          postgres    false    278    5394    270            �           2606    231472 0   transaction transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_created_by_users_uuid_fk;
       slider          postgres    false    278    5336    242            �           2606    231477 0   transaction transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    278    5408    277            �           2606    231482 <   trx_against_stock trx_against_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_created_by_users_uuid_fk;
       slider          postgres    false    279    5336    242            �           2606    231487 H   trx_against_stock trx_against_stock_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 r   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    279    5398    272            �           2606    231492 +   batch batch_coning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_coning_created_by_users_uuid_fk FOREIGN KEY (coning_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_coning_created_by_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231497 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231502 +   batch batch_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_created_by_users_uuid_fk FOREIGN KEY (dyeing_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_created_by_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231507 )   batch batch_dyeing_operator_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_operator_users_uuid_fk FOREIGN KEY (dyeing_operator) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_operator_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231512 +   batch batch_dyeing_supervisor_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_supervisor_users_uuid_fk FOREIGN KEY (dyeing_supervisor) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_supervisor_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231517 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES thread.batch(uuid);
 Z   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       thread          postgres    false    282    5414    281            �           2606    231522 <   batch_entry batch_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 f   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    282    5430    289            �           2606    231527 R   batch_entry_production batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 |   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    283    5416    282            �           2606    231532 F   batch_entry_production batch_entry_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_created_by_users_uuid_fk;
       thread          postgres    false    283    5336    242            �           2606    231537 D   batch_entry_trx batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 n   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    284    5416    282            �           2606    231542 8   batch_entry_trx batch_entry_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_created_by_users_uuid_fk;
       thread          postgres    false    284    5336    242            �           2606    231547 (   batch batch_lab_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_lab_created_by_users_uuid_fk FOREIGN KEY (lab_created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_lab_created_by_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231552 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       thread          postgres    false    281    5370    260            �           2606    231557 !   batch batch_pass_by_users_uuid_fk    FK CONSTRAINT     ~   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pass_by_users_uuid_fk FOREIGN KEY (pass_by) REFERENCES hr.users(uuid);
 K   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pass_by_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231562 /   batch batch_yarn_issue_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk FOREIGN KEY (yarn_issue_created_by) REFERENCES hr.users(uuid);
 Y   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk;
       thread          postgres    false    281    5336    242            �           2606    231567 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       thread          postgres    false    285    5336    242            �           2606    231572 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES thread.challan(uuid);
 b   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       thread          postgres    false    286    5422    285            �           2606    231577 4   challan_entry challan_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_created_by_users_uuid_fk;
       thread          postgres    false    286    5336    242            �           2606    231582 @   challan_entry challan_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 j   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    286    5430    289            �           2606    231587 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 \   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    285    5432    291            �           2606    231592 2   count_length count_length_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_created_by_users_uuid_fk;
       thread          postgres    false    287    5336    242            �           2606    231597 4   dyes_category dyes_category_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_created_by_users_uuid_fk;
       thread          postgres    false    288    5336    242            �           2606    231602 >   order_entry order_entry_count_length_uuid_count_length_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk FOREIGN KEY (count_length_uuid) REFERENCES thread.count_length(uuid);
 h   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk;
       thread          postgres    false    289    5426    287            �           2606    231607 0   order_entry order_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_created_by_users_uuid_fk;
       thread          postgres    false    289    5336    242            �           2606    231612 :   order_entry order_entry_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 d   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    289    5432    291            �           2606    231617 2   order_entry order_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 \   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk;
       thread          postgres    false    289    5340    245            �           2606    231622 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       thread          postgres    false    291    5364    258            �           2606    231627 .   order_info order_info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_created_by_users_uuid_fk;
       thread          postgres    false    291    5336    242            �           2606    231632 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       thread          postgres    false    291    5368    259            �           2606    231637 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       thread          postgres    false    291    5374    261            �           2606    231642 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       thread          postgres    false    291    5378    262            �           2606    231647 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       thread          postgres    false    291    5382    263            �           2606    231652 *   programs programs_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_created_by_users_uuid_fk;
       thread          postgres    false    292    5336    242            �           2606    231657 :   programs programs_dyes_category_uuid_dyes_category_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk FOREIGN KEY (dyes_category_uuid) REFERENCES thread.dyes_category(uuid);
 d   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk;
       thread          postgres    false    292    5428    288            �           2606    231662 ,   programs programs_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 V   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_material_uuid_info_uuid_fk;
       thread          postgres    false    292    5348    251            �           2606    231667 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       zipper          postgres    false    293    5336    242            �           2606    231672 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES zipper.batch(uuid);
 Z   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       zipper          postgres    false    294    5436    293            �           2606    231677 ,   batch_entry batch_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 V   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    294    5462    309            �           2606    231682 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       zipper          postgres    false    293    5370    260            �           2606    231687 F   batch_production batch_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 p   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    296    5438    294            �           2606    231692 :   batch_production batch_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 d   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_created_by_users_uuid_fk;
       zipper          postgres    false    296    5336    242            �           2606    231697 D   dyed_tape_transaction dyed_tape_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 n   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    297    5336    242            �           2606    231702 Z   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk;
       zipper          postgres    false    298    5336    242            �           2606    231707 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_order_description_uuid_order_d    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d;
       zipper          postgres    false    298    5452    303            �           2606    231712 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_ FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_;
       zipper          postgres    false    298    5468    312            �           2606    231717 U   dyed_tape_transaction dyed_tape_transaction_order_description_uuid_order_description_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
    ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_;
       zipper          postgres    false    297    5452    303            �           2606    231722 H   dying_batch_entry dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    300    5438    294            �           2606    231727 H   dying_batch_entry dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk FOREIGN KEY (dying_batch_uuid) REFERENCES zipper.dying_batch(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk;
       zipper          postgres    false    300    5446    299            �           2606    231732 f   material_trx_against_order_description material_trx_against_order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk;
       zipper          postgres    false    302    5336    242            �           2606    231737 f   material_trx_against_order_description material_trx_against_order_description_material_uuid_info_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_ FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_;
       zipper          postgres    false    302    5348    251            �           2606    231742 f   material_trx_against_order_description material_trx_against_order_description_order_description_uuid_o    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_order_description_uuid_o FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_order_description_uuid_o;
       zipper          postgres    false    302    5452    303            �           2606    231747 E   order_description order_description_bottom_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_bottom_stopper_properties_uuid_fk FOREIGN KEY (bottom_stopper) REFERENCES public.properties(uuid);
 o   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_bottom_stopper_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231752 D   order_description order_description_coloring_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_coloring_type_properties_uuid_fk FOREIGN KEY (coloring_type) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_coloring_type_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231757 <   order_description order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_created_by_users_uuid_fk;
       zipper          postgres    false    303    5336    242            �           2606    231762 ?   order_description order_description_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_type_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231767 ?   order_description order_description_end_user_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_user_properties_uuid_fk FOREIGN KEY (end_user) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_user_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231772 ;   order_description order_description_hand_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_hand_properties_uuid_fk FOREIGN KEY (hand) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_hand_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231777 ;   order_description order_description_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_item_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231782 G   order_description order_description_light_preference_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_light_preference_properties_uuid_fk FOREIGN KEY (light_preference) REFERENCES public.properties(uuid);
 q   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_light_preference_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231787 @   order_description order_description_lock_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_lock_type_properties_uuid_fk FOREIGN KEY (lock_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_lock_type_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231792 @   order_description order_description_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_logo_type_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231797 D   order_description order_description_nylon_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_nylon_stopper_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231802 F   order_description order_description_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 p   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk;
       zipper          postgres    false    303    5456    306            �           2606    231807 C   order_description order_description_puller_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_color_properties_uuid_fk FOREIGN KEY (puller_color) REFERENCES public.properties(uuid);
 m   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_color_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            �           2606    231812 B   order_description order_description_puller_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_link_properties_uuid_fk FOREIGN KEY (puller_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_link_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                        2606    231817 B   order_description order_description_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_type_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231822 H   order_description order_description_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_body_shape_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231827 B   order_description order_description_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_link_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231832 =   order_description order_description_slider_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_properties_uuid_fk FOREIGN KEY (slider) REFERENCES public.properties(uuid);
 g   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231837 D   order_description order_description_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    303    5468    312                       2606    231842 A   order_description order_description_tape_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_color_properties_uuid_fk FOREIGN KEY (tape_color) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_color_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231847 B   order_description order_description_teeth_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_color_properties_uuid_fk FOREIGN KEY (teeth_color) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_color_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231852 A   order_description order_description_teeth_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_type_properties_uuid_fk FOREIGN KEY (teeth_type) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_type_properties_uuid_fk;
       zipper          postgres    false    303    5384    264                       2606    231857 B   order_description order_description_top_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_top_stopper_properties_uuid_fk FOREIGN KEY (top_stopper) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_top_stopper_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            	           2606    231862 D   order_description order_description_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_zipper_number_properties_uuid_fk;
       zipper          postgres    false    303    5384    264            
           2606    231867 H   order_entry order_entry_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 r   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk;
       zipper          postgres    false    304    5452    303                       2606    231872 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       zipper          postgres    false    306    5364    258                       2606    231877 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       zipper          postgres    false    306    5368    259                       2606    231882 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       zipper          postgres    false    306    5374    261                       2606    231887 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       zipper          postgres    false    306    5378    262                       2606    231892 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       zipper          postgres    false    306    5382    263                       2606    231897 *   planning planning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_created_by_users_uuid_fk;
       zipper          postgres    false    307    5336    242                       2606    231902 <   planning_entry planning_entry_planning_week_planning_week_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_planning_week_planning_week_fk FOREIGN KEY (planning_week) REFERENCES zipper.planning(week);
 f   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_planning_week_planning_week_fk;
       zipper          postgres    false    308    5458    307                       2606    231907 2   planning_entry planning_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    308    5462    309                       2606    231912 ,   sfg sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 V   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk;
       zipper          postgres    false    309    5454    304                       2606    231917 6   sfg_production sfg_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_created_by_users_uuid_fk;
       zipper          postgres    false    310    5336    242                       2606    231922 2   sfg_production sfg_production_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    310    5462    309                       2606    231927 "   sfg sfg_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 L   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk;
       zipper          postgres    false    309    5340    245                       2606    231932 8   sfg_transaction sfg_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    311    5336    242                       2606    231937 4   sfg_transaction sfg_transaction_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    311    5462    309                       2606    231942 >   sfg_transaction sfg_transaction_slider_item_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk FOREIGN KEY (slider_item_uuid) REFERENCES slider.stock(uuid);
 h   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk;
       zipper          postgres    false    311    5408    277                       2606    231947 ,   tape_coil tape_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_created_by_users_uuid_fk;
       zipper          postgres    false    312    5336    242                       2606    231952 0   tape_coil tape_coil_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 Z   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_item_uuid_properties_uuid_fk;
       zipper          postgres    false    312    5384    264                       2606    231957 B   tape_coil_production tape_coil_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_created_by_users_uuid_fk;
       zipper          postgres    false    313    5336    242                       2606    231962 J   tape_coil_production tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 t   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    313    5468    312                       2606    231967 >   tape_coil_required tape_coil_required_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 h   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_created_by_users_uuid_fk;
       zipper          postgres    false    314    5336    242                        2606    231972 F   tape_coil_required tape_coil_required_end_type_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk FOREIGN KEY (end_type_uuid) REFERENCES public.properties(uuid);
 p   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk;
       zipper          postgres    false    314    5384    264            !           2606    231977 B   tape_coil_required tape_coil_required_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk;
       zipper          postgres    false    314    5384    264            "           2606    231982 K   tape_coil_required tape_coil_required_nylon_stopper_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk FOREIGN KEY (nylon_stopper_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk;
       zipper          postgres    false    314    5384    264            #           2606    231987 K   tape_coil_required tape_coil_required_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    314    5384    264            $           2606    231992 @   tape_coil_to_dyeing tape_coil_to_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 j   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk;
       zipper          postgres    false    315    5336    242            %           2606    231997 S   tape_coil_to_dyeing tape_coil_to_dyeing_order_description_uuid_order_description_uu    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 }   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu;
       zipper          postgres    false    315    5452    303            &           2606    232002 H   tape_coil_to_dyeing tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 r   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    315    5468    312                       2606    232007 9   tape_coil tape_coil_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 c   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    312    5384    264            '           2606    232012 .   tape_trx tape_to_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_created_by_users_uuid_fk;
       zipper          postgres    false    316    5336    242            (           2606    232017 6   tape_trx tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 `   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    316    5468    312            )           2606    232022 *   tape_trx tape_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_created_by_users_uuid_fk;
       zipper          postgres    false    316    5336    242            *           2606    232027 2   tape_trx tape_trx_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 \   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    316    5468    312               �  x�]SKs�0>�_��NN$���� ��@ȫ��0�Yl�dɕ����]�@����Z�~��*�E:���lm:���yC�� ���2�1��~�.�6a(T��aK���
u0S�'�s���c��V�9m�O����Ջ;�|<���@͹<"b��ǻpgo���F?O�I[��	[�Nc[�?�����+'y@�WSf�����Dٌ�e��`�UΤ�a�5+U��������kQ��+��2\&JJ��r�;
�o�I�P�e��x���AI��	�Y
܀���I�����	�N�J^�\>e��e��$UB�U+Xj��^G����q_~�20BmYJES�R�����'h'� k���6�f���p�J��Ǣ�ŋMŴ���6n����O�����6,��Ǎq�P0�U
h\���h��`�r�MP0-���Q�r�\�4�&a%������~!���8K����p^��C�幟�aI�3���Q7�P^F�EE;�֒���0ӊT�H"K�I!y���ĕ�4�%��gX���*�$,=���DoS�.�L�e�L�mn�~Ǐ�99�-���o'�;��n4�i�q�EK��)��-]bS�������>��q�����vܥt;@��	F��C�a�6���kz��Y���0��	            x������ � �         C  x���Ko�@��˧h8k��7���UA����c���(/�ӗ��bzi��L&�?L��i�U��T=����8��`c�5+�	*Gj��a��9�aIW�"Pn�;�5�}a+"5ɮ��lA�t� �Đ'$N0T���i�l�A{�N
/uvg��&4]RI3@S��i��AIm �m��3l��hl��I��~<R^ 9܅r��� �C�/����JR��k��N���z
� j�n�X��1b�:���bЫ/O�lfz�E�
��J�LBse��^t���t�0�[-�s�P����$�۹l)�f�J��~�	� =fRk��6��| ���         ,  x���Qo�0 �g�+�4m�Jy[d���Lk|TZ'�,��o˘K���rw_�*�DJ>�۩��)��Em��P�
C[{�(&�ge�؇m(b�i�/��;��@Y��CI�˗֨5��(m��O�vb(�5:��^�)�ֱRl���a���` 5}�AQ)�nK/6� M��ܤ�����TЌQ�t��k���ނl����������J�xhbKͳ�ll��0��{O��s6�T;��9/�����׸4穚�ǋ�'f*f�bΪO�����B�s�ʪ �B�            x����n�0�㏫�X���L����L�'�i�\��v���ҳ�k��}�����4g��o��ԉO��S7�U<��q��"��x�>� �0M�ؒ�K"`B�}�&�N�2�&*�}]|XoƳHg��1/��R��݋���w�0��I��Z�F<_�]W4��FQ�&�����PK2��w4����s�M���^�M���E	�H��eے��k�&e��$�NA�+Mg�P,$�/P��TU	 4`�E��Wm����F��v�*��-I(4��{�Ӱ��0�Y��         �   x��J+0ʲH*..�,H*�,M6I5�J	���-7��L��(��-��5K5.��4202�5��52U04�25�25D3�26�26����q�*�L�1�(+M��0ڱ #���%��ϩ(���1b&�%��%\�^.^9���ie��9d�rf� ��Gj         G  x����n�@�����lf��Ei�%.��Y���(O�z��I�ɹ�O�}g�wye�ח��g������(؏ݣ��e�i�}Lz���W#�Y��NU��>e��>,�]l�uB3�n���4�`8E��g7?��2&�N��-3�!"0�e��LA���3k^5qQ�F�|����1�~�ga��!�
����<L��ҟ�N�y��3O��͍$ڒ�ܡ�m"KC�
Mbی[�O��7��w�f���"�M&���\��4��o��Y�,���9�!�^e�7�A�#��,�TK���t���/��`�:ò�fݽA_�V�Ճa?U��         �  x����N�@E����js��ۂ��!��K���Em�^4MK����kg�3��{�������w(Z�UwSG|��%��8_ǚe�����
p�C0�@��ɕ�Ƃ�3��t�4F�@ј��R�)#�`��dD��f�^j�Nv�a-M �g�J�oL�(��_o��M���}��6��:��Z0��~x~��{��{NԬ��"QW�N�D,,���?ӳ���/�ǓK�͹9<����Xᤚ%��.\q[X] �w�U�W�������G���ո
s0������ �ع����R�evjiP� c��0��rl"�XfVh�k���;��Ϧ��F��3sj�=s��o̻0���Us�
֎�Ҳj~5�<]+����|            x�=�[�$)E��3!�����%�QDd��TueF�A\����������,��κ����=C%[_i�~��$c̜��{};�lEjmު����5����=׵��m�����M��N��v�{[-w�}ۢ�Ye�OA��Z��<7�#~ڼ�l$�r�.3����ˬ��5J��g�y���':���O��U�j��>v��.��b��[ں��qG�^Z���>3�1d���t�5��z����%����W�tU���$�G�d��+F�<�=y�=I��2R�3.Z�����8���-kKo{���Y�*��y��֯֞oMCg[�jl�ܱ�f��h���{��vN�gl��O��+�[47����}I:f��lWk���Ӻy��o�\2@���'��]8�۷k�yf�99�����g3��e�#�T q�	z;{��9Z��?4J�T� ������E?�fN�kJ�Nխi�V��ª�*Q�or��1�9=M�d[z�ݶ��$I�e��{u����Tұ�@�oդ�W�[**��t���4�)���sM���������z������G>���(G˿�ٻ����MY���[�m��9蕒���'�J��]Mo����KtF�U����fyN��i�!�(i]��U9����a�l΃�Ni��lS���<�Ul�)}�OC�[%'��d�y�Ru��;��|e���	6(z��oךr� X�>
?P��˝��a�6M���Ð�i�y���l�ֱ�m�_Ek�ۛ��ּ�	[R�>jƵ0zu�2�b��=ɬ�<�s������bL������$&�mLv,r��xJu�5����r�s;k�y#� !���s�(�cd�	����e����]
e���n���QOǱn>sg���k�a
˛�)��&�,G6U f�O��U�RG=��2�a�D���n?�WQs2pw��+Kt�Q���˳o�1�])��[Т6c.v�&�ɳ�J�*fƝ�v}K~ھP=dU.����g�?�<�>(KY���rf+)ֹ��κ9�����,�;uW z���Θnm'/{3�m�yA��W�׏�{�"�GI�o���BP�M,�
���q�Kf�r���&*�x[���l��@����]����t��\�M�!#O�w�23a�� P,�g`i�î`�v��EOV�c
3Ê�bp�)e�3Rl��/ڥ��چj���mݹ�>���R~K{��ɳO��"Ֆ֪ZS	y�3F�����*��
zZL���w�j��Z��=�0�(-s�r�Eg|�
�(�Ƣ��5E�2d"����j7vݟ5l�QI-N<y���`h6�Ԁ�B�K@Aw-Yo��Zߊ�d�ǟ�W��FX�������E�v�-X��r��qp��A=9�=ӯ"l��3����Nk#NL�����9�� =���p�<

����u�)XB�J~0[NI~J0F��wL�B���W��K=�C�3�]�U귏�îkz!#<�_�.�ey���ZuI��[���F
^��AG��3i��+S�z�h�hW���+.j��`2_/3����s�(���_Ŏ���_��.�\�����ٱՂda;S�7��r�"O�fH0�	9�L�lP������&ZQ$߹����P,\�pl�m�΋ca�8�r��9���U�R��c{Bb8ܭa����`���|�-kXAK����s����U��X�3�6��@2��'7�������AqZ]X6\Ӈs���vj?��|=�A�1L��ɛk�cʪ�Ã1#05s�0���������[��x���RΏ���1�P���%������ε��ax��ڂKŋn���k�yX3ykzF�Yì�dq�
�/�;�)~B5c��z7:մ��)�y���+�_�@ߚ�e{s9��n�:�e�;��0�G�(XL��f�@?��|+4������_��(b��b�[���`B�űJG�T<#�T��v�6����b7���~ү�g����1N����'[�*���� �W����ǧ!��6=d�H^�V[�PԵPM�͠@��3c�Q��8�_Ŝj�����\c��"t<s {�
�m���35�|��$`��o�9�W�Px�:8I#����	�xR�p���	\�pW����k\�տ��D �ڳ>v�/A�`C(�Ld��0إ	
�Lp�� �p<��*"�	�yk��O�KcE	�E� ßh�g�PL�`�&,��/�ӿ��z�3�c��_Qh\�`mfc"gA���4�̠@@6�@���*V@I�^%ϠS1R��l'CM�K��<��I�H�L<����er���?�hw����^:V��s�ʂj'G���Y1��S�����s�6�"����wf>I>J/�܃�!)!(��y2#R��l�U��ˤ��E#iӉ�
��\�bt������,��|7 ���$
�p�&JC�i[�c����+@����H��L@3@��ž �+��-���Q�W��O���0��L�;k�?2�*���È�*�
�o,e߸*f�|X�4#DXN�3p*�PWd�_E��i�23sz0+	�8$p�r����l�;��.�@�Nkx���J	e���5��C�)3���B,�\�f�8@����
w#�"�cL��ߊ$'x׬�L��O# ��*I�+��Y���C.OD�j�(%M�_�1؜�;��s"�~�ͲM��?��X�+�;A�̈!�N����U��h։��f&*��GIdWL',����"��V�8�3v���F�"��2�'���F�?���Ml��#��zl�j�r����Ҁ�nAYiI\1!m�������@N�#��tZ�;VD�B� ��r�Jv�)��P����\'�S��%q<��ɘ���BH���G�֎+	$�G�۷b�wH�V�5cf�� <}�+n)���mX(=���0�q�ӱ��U 	~��&-T,� �%�bKX�/S ����S&I�d��0D���Mbԋ��$�6���'2�-[X�{��Gؼ�maQ���^�yC�ze�h#��|!��B�8.��y����,?g#!�a}�u	�;4�u�԰b%L��n\�Ao����}X��.[��[�j[�:�;�Ķ��t��$"�Ը��@���@� `��[�U��ԙB��30�2do�5I+Pjp�P��,"6S��k�"N���TD [�=Ly	�ם52�)��_	��ޠ-a"��t���"���`�(S��7F�A�r!E5��q�L=�;\ ��GV�p̝H)�])�A��*��v/�Ơ��K���aQ�{$�>��N(��q�"G��ք�1А#l��oג���^����d��)�gd�mU#�uL-e"j��O9X$?��{o�)�(��5V�S1N����9Za��P,��B.c(���	"nx/��k�diܞ������B^��o��;^�Yɮ}-�V����@�U&��|=n\�!](�k�a�x�Wd�
�q>I�@L��惒�}2XXLW\V���3�FE{B���i ��D:b�ȷ�ق`򐠗� JH%�j,���@�#����֟���a����1�d.ps��DV�L>���!)�ä����Яoh��q�=Q��j wP��9��QC�2�8Lg�D҆2����L�=b����������d�P��2Sbk�A	.����R�:��#ϰ�H�g����/F��#��15��N�R�x��4_�%�Tp*�9��D"��b�0l��P����9��X��$����'���rH�z!�?��@g��o׵��Z���X���@N���A��+N�=���X���Y>=��n�]�����c��Bo+\m�oH���)G�î����[[B�0pP�$Dt���Q�M!���5�k}��y���ZrUg�d��RVg)e�����qG|r��T�*��������{۝�y���7ff{��boܳ��)a��D�7 ����	�%N��ME��V�4W#XX�\��x9���yi���O3�,Z/�*B፱y=?y[�'�4���3?�`<�yp��\�x��X����4���h,-�^��x\8��:�;n0	b b  +^�?L)�
�@>+����Ɛ�����Ç�<�x2��x��،�&����%��-�s���:J��L��͌�˓�0k�%NO�@:�W� �x���Ȋq�� �yq�KF��!%2B�U�HpBW����p �6P�>�(�`
�lPAtz"=�=�D'@9�&�~+�T�Ҟ>��f29���&;^��3��3K��4��!Z�1�'��r߿�����{ݞk,�P���!u���nV%�X8|��8%v�}�����Z��K���J|�,�B7{�9"��� FL97Ƒoq@-�T�1E�1�p20.ޟY���b�"!5�S����?��9!o�TI�l��C�l���؟�f\�@��ğ���������S3 �@���৬}��ō�/�كH8�����K�X�,�֊�c���ķ�0z@��%<_v�T�	�}C�s�.���%�����28MKH�����1���V�I�u}G��0����?5k�$s#q��@�@9=�{�شI(�1�@��fΐ����n\9G�ۿ�$2�Q��e�ī�P���Z�W��Wp$]��Y�p�.E���O~%=.�Ϟ1�GI�񞐉�b��,V�ר�ڝ/ޕlK��_ ��A���b҂c���5�j�����\~����D�tar�Y*-E֠Lb��GJ����-@dϰ�(���xA!��\N����C��:p�cӯ�أ��x�_I�2�Q�X��w��LD�_z�F&_�M��J��D�"�?��Jp����8bv�+9p��%�z��A^|0��Y� z�t_�%�����;����l<�lx��ǀcq9���ˉ��+	��ֱ_��H��k�_I&�2U����;��0:���+Nb1�w�pPq���Gu�+�: 0H�֗g��Dc6�)YێWlJ\z�������@�����<8��P������w��c��<d���}���>� ǒ��� �	��aR��������a)8~+ �9�^C����y�!�d܆;e4��s�P��{�J<�ƥ}[����i�P�t�z�Q3,,D�4*]E�5%���2S�@�E_�}�'����x��^�ŉ�+r�5dċ�BR�i��-9�I�ß����-!l�>�\����%3�I���,��%$
�a-��#AZ��mM��!���.�
�����d\Z��D�q��`Un���/���#2�!�B�� 0Yk*�-���Bc�� ��(7��*�"�4��ڕ�Zt�͢�7~�c��G@�7+�$�U)ox�w'��H��>h�صԓH$p�).��x�ct +��߯DI����d�x0�??2<�q�=�^�8��%h5di'lNC���fdJ�DZPpXb?>�xR�,�Bq���ŗ9굮O�"�(T9�S٭�6N��q�FIy�7��(��V�~���Z9��Gn'BI���ء��L�wMI����xkw6؃���$04��K`��'�;F�o[���!ع)B��h�{�.B�(�OH-�1����$d�XG(4-~K�ǻ;��̺�O�ۢ��L��x���=����2L΄\:.<���Ev���lb�N��w9� � ��~/)	h���������	���         �   x����n�@��w�b_�fXa�@��U+�J��a�)��Dxz%!�&�0��&���L�������e�~�b�@� N�6�Ƅ
�4)tI5�}��̦�a��j� t�y�� d�?���_��$���EJ^�j�*����!3\�������a�֛�3r�+�(a�dTr:n?�y�T�����u�[���M�T�L<~��r�L/�Ny�'_7vF���K���evL��c����ِ���pm8�R�Q�>`��8�i�          "  x����n�@F��S�6sS`vX1�BZ�"�8^P������X�I����#�K�vG�z�yd�w.|U�� CL;��@�"ʈ� ���)O��9h�f���{XrS�u�V{�����n:<����8 �C�Wщ�N*d����BPEC����o����<�HE�a�(�x�n�;Ɏ�<�*,.�ʜ�L^g�ע�G�F����˺:#�n�KL�E�
valO��5���@zf�r4y%h���A���6���U��pC��"��z��8p��t���c�da�u����MQ�����      !      x������ � �      "   �  x��][s��~&�"��og� ���m�D�1�1&1gOY-��rQ@���~E�QsLN�L��[�k���߂"_���~�(�n
�TA��@�
���)�_l�/��K��٧�������}T�}�
�J�z�~���ܳޚ��W��[�#�@���"=�+���-�&����t�"������M��n�D�v��Lx�cqɏ^��A{q�:V:P_%J&T��uihJ��2��6mY^ �e�6U7R�p�k(,�}uiw,o��Z�������X��:�u�w�j�V��+� eh� m')�]�[��C��)�"&�|��d�����qt�kC��t� �:mAb�݃�� $��x�����WWꐗ����xʹ�1�sDlp���(����e�cl@�#K�"u�pa�s��b�Z�/��݅= ����#!�9�2�*?�G�=;��浱j�e��f�6;L<8m ���/�1U,h�y�+F��X4��:Pp��5M0q[{�������Ŕ=�I@F���ګD,�ڀbYٍJ8���P���asl�e��Yf\� �f�ɣ��A����[�Pa�R��h��$K���-�eF7��xb���E4ZR�2P,��X��q`?�}���by�\�a��tѺ���H�i)��?�@����[�5��]��"%���iE^�9�	T-�}��q<d�w��v;2f���;=kq�Ó=O\*��X��Zn}�F�3�j*j0�����M�����>Z�	c��?q\JCIv�F�<��~S�Wc����7%9��m��.0��t#�qc�W}��;���M�;7'k��t�U���$�&�͇�sPtG)u�b����,b�o���hwF��K
���lX��v�nUhK:R2j���6�Tc=�I�c���0&�����Ā���nێAD�7�q��-������{������;�x帐�������Ea�N�L~�]TGA.b�0�Z�=�)H���ݕT������v�[��2���S{�|�]����Q�N� 䱆�O��Dn/?��6�_���D2�������NS��/�Vj��r-�Ƒ��w�����s�X�[z>`������c��5Yӝ>(�4��jq�v[�0^í�1�`a��j��;Ns��W>����95Sm�2diA�Y��V��н��,A�����/���fmL�\ɮ�\W���f_A뛗���v�@�v�o�m/9h�b�M������]�|Vw�.;H`P�����w�UA�K�BF���1l��RG (ZP�#�̖p��?uh@�=D6�"7Y���6�$�e�E�
0�^�h��� W�J��::�Ϫl�g�b�3�P���G�'w(�e)�I�i&���4��l�'�����L2���tΟ�2C��0�\��:��b���ݝy��Tj�̞�n�njb���0�L�s��Ld�Ⱦ�F%��]�k�Dw��fA��G�b�dj��ٕL��d�s���\�M�+Μ3L>�A�Q�ձ,��Y�U���j���$Y@�t��ﮦ�cΤ���j�ѹ�{_����l7����qm�*l�r���',�x�[/�2��S�ߺ�aWҔf�!��a�Yr\H�O��0�<B���v����C!�G#	�k�-�P�A�5��1I6�K��7��I��tM櫴�9C�M�h�;ی���I����	�����
%� $��r��W���q%��yTۘ.O�í�6G��ar�؈��e|հ���}�fYFD�tVe$xb��I�	��g�`�$x�OD����p+��P����MY�rᷮ|_�ꤘl���E�-��2�h[��N��C��>�A:�go�����ʞt�昝�q%L�M��q��g{#�����y�㰂9<�-!��"1�\�o�5U]�Q��
�{�y�����Gs� �ots�X��
��r&?F@˧��|YK"���1�a��ǈ'�����0�s#��S"TN�ҿ�q�P��1���/�� �G�8l Eg����� �����+1q��d=04dvµ��ƔD4�;9D�	�.�7�4�Ɇo��������ߔ���J��)Q5�0
�GH�FQnh�	Ze{wt�*�ߞ+-&1j7����|�����0	��J��x�+�bN)��T*e�rY�K&��f���&�g2봜�L*��6+�!�~�~�J��g� U�:!�\͌�1H�_]�Ԭac0S��^_��˩�H4�ج\}+M�z���M��HS�n��z�|S~�HB<�����������`�Â?�3�l.�&3�'&"�O��l@Z����=�J5u��+���l�s����Ag�*�����u/c>��w�K���_�����~7�>�x�ď8�U���f`
ݫ_ӊ V^��Fѹ���Mq)�a��dS�L*�d�l* �k<��z ]k�?�%��5�Ft�L�p� �d�o1���d���qi�a��ʤ������[���wS��YE���7�nT����6��p�0$	� �d�u:�.		� �$܃�{acG��N8��[���	o��<�$��1y�ɮR�SLp}��3��
��
�|�x�֏:��>a��������?�҄�O��'眄� G%l}�]U��'l���2�ߊ|�;6�>yj\�߄'��C��ds�yC.o�˓�g@��;�90if?��r�nX��ꈺ������*�&\/h�4>�kO��ٲ�+�Av<)��k'�6)�]��ڝ��RSV*�Ժc> +�����=�q\ ?���oe��\r3-m34���_A���1��34L��+(l56�Bݭȵ�ҭ�cV.��:x�]Y\��I9NU���{J`�1#���K�~�+&��W6KSL�M�L�U�����\>���D��gO�F��|���ڌ�I�J���|����Tk���a_JM^2���:N���q�d���\���s�Q��ϣ����D�XMkR�*�ijDX���IX���IX�[�CX�;����ɬ��!O����$yV6yVv���E4����m���pnW�ɳ�ɳ�ɳ�w�z�P���݉<+����aMքa'�fXm��O.V��k���f��MH݄��UMNHݟmiB�&��sNB�>��R7ƶ=!uR���y{�ڟ,�A�#��#�=9{Q�i��ҹM炨�4朦�t��73��?�����XO�F      #   =  x���ɒ�J��YO�t�H�L��J���Fo�DAx���v[]�]�.����?��ρʱ�j�c���r�4+��
�!����\Q/��5�z�ͳN4��jbh%� �B�'����$S��>н��lR �͋2�(�E���06 ��5������z�O2�'�BE>#'�ZYL.�l� ����<�-����e�ʐ{(�R�z��b��G�&Q�y1��v��j����� �<,��_�t�F<��Bg󪯺C��E��})���p�i/̉��vJ�����{x/y�Hųu�͇|C|-o,~��e�uT�;k`�n.D�D ��"T��t���8q��~1�)��~L;�w�U�rqR�E됙* �T�ܡZ�����f�Y�J@�u,ٯј�9t=��	����f����L�ޣfE��ZG���T�_���9/L�XI�nj�G�a�ڭ�h�
����Dx���d�L�݆W�v-)D|����q��d�T&�L����>� C�q�J5%Ts�m9���[�,��LS��:rG�CK�H�)*KKG��:��e�6���g�H�9*���R=��%!Tu�n׀��z��XA&�;J��'И��w%�"N���4����r�f��	������;�U��+�0K�Lfߕ��fJ�YK崙P2}�������Ż<�ai��L~�%dq�Qs/m&�E祟�bf����Bey`�1z9}�	2nͶ�F�~j,����� �	��4�&��l����k�`�u��� �,���w���,���]��K�}�CJ�֡�����8-G[��g舺�X���;�u�pT��"�g�6�W�}!Us��/�>����Nve�l�c$�����Y��>�-W�Mֹ���e�K���τ�<E�M�������L��97���hY�'�C[듔(s�Rcs��Q=���B���+�A-R��>k��y�4���5��I�{@��J�t[X�ϟT� -���U��=�GS���l'�����yl+�p���|ݯ`�Ҿ86#�v���s%���j�$=�C��e������s�6�F1�$\��V���;�.+����s_=���(u(:��g=�~mm� ���w���� 	������ķ�d��b=�HtK�����F���R�^S�˞q�z�'��;UB���I�ctDc�@'�7{-�:��黵��^��Si���!�J`�}=�ſ\�e���7��`���+��)���Yy���^�
����=&�~0��ڄV��߯6V1nPx�9��f̛=�M���4v��z3(+���x˴~�����?��      %   e  x����r�@��ۧ�ؚ~�Q#�bH�q�F(H�O��٪�l��⪫����cgG���8��T;� S�辤�5=��1��`^���I&�a�����w��  ��22e�I�`�d�^�D3� �eY�ɳO�ek�C�|��(��~X��+�RuF�k�°Ѡ��ȮC���*MS�<���<]\��d����B�xN�%�1�2_�F�Dȫ%ߕ�P'iG�~���Ʊ:�v�+��F���Y��q����%c������@�"4~��J���� ա��l�03#����n${0!a��t��]o��@�o��=�8?b	��R�^��	�	Cf��mp��?u�7�>W�
0�������0j�q3^��=�2ǰz�q�E�����P8�s�>�#�E�8�Lo�9z���E��y4�w^w���nR���	� ;�':�HW���r�����9�vc�{p��"AwD��\�3.mVk.��sz: ������LN}5#������v	FC��)IX���mT9yJ.RL��,aF�h���干}UN&~��V､׫���|��n������m#�r;���?n�Sŧ_<�xM�[}��j��|]�      &   �  x���ɲ�@F��S� �-�e� �
2*T6(8 ʠ��A�E��TQ,zq�?|�+Iu
����ܻPn���Λ�8���� E ������!�i���C`s�4�!*�[*���Q�ƹ:���8 (���˜��U$O$<�GԓgB�c���[�O����Qu[l\�����4�N�>#6&��W}̀��x��Sx�a��w|wI����^�~Ib���qVe ªn&�<-?ky�b��n6m%i�4�3���O��,����V�&^���y�iI��r�鬼?1O��Zө�XwG�㱓���&_Ƶ���7��]5�lum@SW��G{�Z/�2z���C����ݚ�R*�V��� #6�x����{�_<i�+�[n` e�	`�S9R����9�z�������O�/�� �V���P�hPy[&�[A96��	�eh����Mp��橹����47d���E�ע�i���18�ID�7%7�����ٵc5�����^߉�h+�L�m���yG���*
�bn�3�#�G�Fy7��6S4ת�B������{�WWq>���&5<U��ցyf����<�O�/|?�xD'��Aч"B{׷,#�jш��jw�/���ў��sI�yāB<I�G�z<!�p��֖DlٺN�z=,72���nL@3�#x��soH���Wȡ��G�_$���A,~ȗ@S8D���L��Syiݳ/�����K5�lmmOdB���H�w��ð�=ҪD      )      x�+�s1���Lω��p10�44�ts�52�,�(�4��Lw1(�t��
��JM-�4202�5��54W04�22�26��������M�IML���̏rMu//r�Ov�H�44��hJ��V@�h&��qqq �,      *   �   x���K�0 �u{
/��kK,�"!��47�(���xz�7�&c�2���]y{O(Ը��s<N,	G eU�2����Jֈ(#QBy��}��T3��6.��e�������v�����
�ó�ы��n�!j筹�"�;:]+���(U�l�/;���7���V5+��&�����}�� c���U�      +   �  x����v�0���S�ڕ��[�T��֮ޤ�r4k}���e�[7+	!��f��5�.�l��,u ��q竷L��{���XDJ��8jE��
�#�@��k��-� ����b�P������7м����׶�	 ���]��	�v48�x�`�@�~�i�γC�V�3{S�=9Ż�ݟ��~0��R��$��u@���~�j�"yaT��3�A��?)��lK�Q��[腜�a��pK��}������w�#����A>�vXJy\ʜFkm[�5-�D�	=s���O� �=�m�4�h�x+������v���cy҈�����D�k<!�>���NX�2��7�70.E�2������*�a>Tր�^��9^ːJ}�{�{��Jī�����}�שU���A���#�d;����1ш��~�)A�qv�ӓG���}�vv��>�ؖ%��h�Y&��];v�b�@�C"~˽��p�͟��[4��D����ڹLUճ�\�-�l��j�i9��\��X)�ͻ�c$>k���S�G9�_���AuiU�h�ܧ��^D*ͳH�\/2�ߚ�`�LVW�w�>�K�}����G�u&��.���;���T�U��$�3�c�o46��hg��7�O{mk-CYe��p!e��,X\�����)�1� (k���ZS�?
 �j0�g��{3�۽��m��� wʳ      ,   �   x�m���0E��)������QY 5P��`���50�to�p�����Ok�qH�Uit�Ή0n���P.l_ GE�t����TGJ�^Y���� �(���W$��n��#���lf>���L ]���6^���s�|�1���@�+8��0��-�o��|�c���By      -   L  x����r�0����a�D	�e-�l�[qܨՂ0����u�N/i�l�&��a&ٰj�2�򱞚U]8�b���x���$�_����i�4�&���<��?^�叕��V�������N�$�o��ZB�Q�
=!�~��؛LuBdS��G�l�BP��{C7������H�`[
?s���6jW���alA�g&�I<p�2�v�[��BP��[�Onvvjk�\E�-��i���Ӈy��ʢ�BP��T���y��K�%�-��y��C+��xzs����\��}�/+|�<˺�e�<���$���i�vӎ�v��	�-��9�I���z8�      .      x������ � �      /   s  x���َ�L�k�)�fB�㝂� ��IK5 [�"�ӏ��d�3���߿�s�T��'G/�7��� dy�	���|r��ʏ]Ì�O�x@a߱�o�Y�k.�zpSM�8���0���7ĩ!�~,o.65!�ߨ����G�k"t�xV���F��l�s�贓<:�L�r*	R���Q�=�ssψ���哭Oh5\$v1s��{�'/���9-R4](���-1���nf���^]��~�=G`C��s�Qׁ&�% ���~�B3���M����%�ɲ�<��z� @ ��d_�eTʇ�����_8� �k�%-ֺ;�s�y5��X�Z�� �SU��A2h�=������O�z?I�T��L���T���:�k�z�������^6ն��H�
�wN�Y�69��ƾ,#wW�hA���<j��6E5��m?�6�Nɉk�F��'��Y�b����z�����Gu�+�v��h�/ro��c��^���V��d�/��"�3}��
�le�.	"�4�������=�w����p7Sa$)�<�[��;���5��G s?�@^��!�cY\.��[/~=�U�s�3�	y���{�'����[b�S5<��1д/�ڹrV���@|�D�ۏً�k�թ�'�F�fq�'����4;������c�:�H��Ň����]=��_M)��s��Bof��n�'a��Z8Ѿ�g+Q�]�jzM�p|��K���J�Mgi��w3&�Fd6��٧���)G�OtB�m3��WŽׁfy*6�(�R����:�E�\�(�����lr����v0a�>JhZul;�C�3I������;�u��/.�������x,����m�I��������Ⱥ!      0   �   x�u��
�@E�o��0ތ��̮!I#!Apc8��!:&�}DP�hs��eu������c�k!+����q���E�r<�����w���SjmH6��3�v+����b����):H��?yL��;��X�إ�|��'(_0z2��E��\��n�B��SL��+B�*#8�      1   +  x����n�@@��W��2#2;m��wIL�P�>��Hmˢws��8'�z�d�� �_��0��rm v��=��]�u����-�$�`;�m0�';��32���5�6�ʠ̀�������a�{��q��'!����1�Vܐ䉹�X�nz��^����wb�t�y��Q点�gHl��ǀ��F�2�ӹ�vs1\c��{��xA��7���le�Ʒ��`�q�@W��fD��qZ�<����G�Y������ܭ��{�{���ϙ.���r������['�f�7���nI��	���      2      x���钢������Up�����n���TT4ވ	���2	�͹�sc'q�����K�]�Z+��1�V2�V<�׫���ᥳ ��Ց��AL�@�zq������P$�{#Go$EtG�����&�s&d9���;�0��罍*�ζ�FvG��̋�wٞ�p�x&��v�!�t(�#mO9)��͋p{6w�d��͚����D�gӢ�����v��I{�<�k��ȒZ��3"�	tR_���x�$�SrdʏQ�%�Gv9��Eȹ���?�_������eM>�w;�I�R�J{��	[N�=�Z��~���(��h�iW�9���wc�Rf�a�H�S\q[L�8��P�*4;wK�Sr��^ s�Dg�m�ڗ����}�����Þ1�a��3�P��~��i^D�8xIӟ-�W����aٳ�}5c��l�aۻ'�e�(飠��\*��)x
�c.�ȇ�>�j�'"@���9��o��L�O&c, ��#mO�o�H�Ň$�{WA�Kg��$���݋�Ҩx��QMhi�bԙ�J�I�Ӝ�'I�M�Pw�g�=W�Z�TK�o�3�ĥ ��G���k���H��"6�BG"��@��h�-��\�����;F����_U�ޅNfvZ�.�NbƁ��ً֞���.s��`V#w?O*Ƙ6�P���~�A��n{}��I��r�.���� � B�A�!�s�2��ʾL�{��i��=���J�R�:Z����aD^
��=��p�&�f,��l	�ò�-������"�FsF_�M��=�h��A&{���m�5���S�W�=��o�*S��c������)0�f��!۵�!鞦r��{�{�1z�$����ܦ��Zi(5�Cb��W��_0�!����>���f�E�S��&r^U���ӽF'\�UeAҸ-��=I��^��Gk��v2�z�u0�F7�{��>��{��q���yQ�:�e�_3���yrĚ�lgM����P0zO����dc�'I�	.���`x���4�Z����N�;���B�����Ƚ�?�_�B�*ʓ��/��� Q����)�1�=� C�;Eu��!�s�4����ۂ"� @{��J{�ŐR�dS����6fꅱ�e��\��-ʔ��BL+��5� ���k�'���?��ᇎGq/ޅςm�+@�pa��ޞx�<�R@wQ�����P,��b�.tes�b0E����|aY�cҼF���?e��K�e\�_]V��gi���]�'M·����f�9"d9�2̲Oz{��\�C<�����ʝ���b�WÓ�7�=/���!aq�p�Ch9H?���0�#�����h*�Q���z}��g�3ڪe-(�=�p���q+��g�j~]���miO(L�q�#e�=���|�����ہ�׋�������f����)��LR��bd�|�zR�|(�Y��O���e�w�K���yc������ڦ�s6#ƈbӱ��*6jk1�ݸ���֞f�]_�˓��$^G�(������m�>�3}�,�Ն86H�q?V���SV{�fok�)m��:P<���8~���e�r��|m�9� ވr�|~�h�fG�:qEOr�E2F58y{w�5jH6~���0|P��v�ˌ��W��������<���k���Q��p�����zxk��y�K��[�=lh=�bx�3���pgΧU�n�G�c챲��bMnN��^��o��|}���2wU	/ݰ��3>����ث�b����W��:_P�;���~��p�&k1��P�B�(��x�bD[�;�	�7�I�"���o�Gu���q�a9�c��-m��'�;��r��{�da�c1>�r�&�~P?��_r1�*/�ˊ[Ch�7�ǵИk�,�]C����w}��~�OrۯE8Ѿֻ��ȧ��+�;��>���n��D?�7�X�G�{���8����#f4c��G�q-�Z��|N{G*�|���_x�?�e����9CS�����W�V���Hfu�5tF�9\B���b�EJ�,}X�q?����60F�9��s����:W=�9�X�iO�5`��=sz����O�B���[<��b��9��u���ltn�6�n��
�(�ٵ0���zaX��å��ś+����t;\M-�G�1����vf��b�������#mO�L0x�H]��;c`?�ѽ�D��s0���N��wҼ�g�����c�ؕ��^�7�Dq��g�+�K���4u��{�P�@� 
`�@��!�.�a�Z����q"]��=R�����aI9����ʧi�H1"EZ�{�v�>ɉ��|�ޓ�'�p{����/�iS<O�hϙ{n��"�V���l ���~���ڦ�bl��;����ͣ~"2���l`�z�9"��*-�Ex쌭�`�����n�FKC�:c��	F����Tɶ�(�
s����b�!C��Xa��'�wh��#Š�Cz7�/2HvG�MS>N���w�=kP���X������C�U��gyU1�M�,�~�)�YZH����=�9�ht���,^D[�W�3��`̀y�݊K�K0e�LhA�%q򢵧mW��N�r�vB�ƍ��vK1b���<8�xu�K��<L�@��b�?�e�)P�@H�h���C�.�P0�j3����ި{co�:� �h�����?����=e�PkZ��þ!�_����Y�K���;���F(�\����������]��X�Ç�miO��7I��c��/D�7��(�]b���k�,��
����xa�4c���m|�S]���ax�^4�c=6r�.����nX�đ����r��SiI=��e�m�=�n�8��-ꈊ>��s.���s��{��UR�mxQ�>F2˼p1f��Q�.N �t����f�;�3��As�p��
F>�]�%�;��"�� �_?�j�x�ʰ�q!9]�%�x#E�)0�v�Xf��|�k�����s\B�2�����b��&ܞ�8Z�!R�[�S��fBO���rԧ&����Eh^���SG�>Z*,��>���'c���V2׽
t��̼���c��'�8������IyRVы֞�Hlm��������Sp�	D�Umϛ�kg~��xA��-����ޞ�Z;\	���R�	8�V���__����J�u����v�p⤐��w�����`q�ϼk^[C��r)��"��.eP��>ܡ^�V����:�Oƈ��~�Y�d-�ߙ@b�幗4����1#�X�Wf�P�a�'i�p���]b�hK6$���#��gD�:#���=U7��y)]�k�����|��7LPV^\����A�F^HL`�{Q��������U�.�s<�]�'T��Y磠�B-��P�40��l`���#�h69���6{Y��ǏX�SF<{P�]GGūۂs����{���BڔF�>���E��Ĉe����F̤'~/v&���K�؝��u��G���j�$ |�1Ƥ%'dK)��p���
��j���y<i��w�.B/B���d��=c�O��D]������Y�z���cĿ@�M�l���Y���L|�u`d�/Z{Z]_��gsc�w9��q�5�ٞK��]/t(�|a�z?ߺ-�o�JVdR�hT�Q���������P��q�\m�����gěc�J��	=���V�q`�5��;���Z���p*�q�o<������8�@Ű3)�ۂq�����R�/\ٿ�Mi�P�h�i-2��ę��Z�/#�PX��9vam�n�ﻱO�� ��q��{Z����K՚Sktj�V
��+_5�mdJ0�S�>,��1j)5���L/�X8�k����4�n�3%��Ȟ#�ff���j���� ��=�� W�lL���y�o��6�Y��������(�Yڬ۳V�^��\�杩���=�T�~2r�1�s�\�Lm/2��!v��!7��?fb�9�^�2����48M:ӀP� �?��,&�X�y4��Sih�xk�K��`���q\���2d�)`���EkO��c�߽^�b�?͗��ĺ��X    ��to���J��C�8{��JB����Ȏ��^�`���ih0L`x�C�w�t��x1�� �>cHP���� ���4���<���1�e�3J��뀕��1�ٻ����#a� a�]Z[�<i�8��3�hG�o6��/�z��]H�>'e_�>{]�������0�ЙfI��Oўc��I���/�.��s�e��*���q�����;^s���,���K��U���q\�ڊ�:��1��Nw����_u_Z��y�q��������'��Σ03 �"�i�Ƅ5'�]kO���E�"�0���Ǘ�'��>�!T�����!�֞6N�JC��&��ԹUP��>�٩��%��S��o9�W�������}i[�}�yM���Igm�(�<5�Py�Y�'��V�*��=�c&Fz�b-m����;n�ುQ�u��Ҏąǣ0�cn��'�7`��g$`���m-�ܮ@���r0Z�ڱ�c?�]���W��C��Tb��?��F�+�g[�����f �i�������e"�<���j�0��]��r2�s�wf�3��-��q�Z���2���|f���K��T���`u�����WD���#�[�u8	��{�F��,�Ђ�X>̿X��k=�����Đ��y�_]%$���������T.�x/4���x[�u�X3VB>v�}g����gH��2:W�9�
P�4C��`Ġ�eZ5a@��\t�;�-�����]�c=>-}qH����!^�.1�#�u��lz�kZo|#4U�.0f|�dr�S�H��Z! ���F�=R�f�����/GL�@	�9�mA��y	��ћi�Q��c���� c��`��C�E�.�г�)0�Q�ͳ�g�PS�@?F-��0�� q�m;<��Ej�c&K�J8Rf�p�5���掉�F��VI1d��p�/��! ��Ҟ%+���
�~�h��� ވM�[�x����$�#H��@/+R����o�\ն++�-�F&U�mE(bʈq
/_���nh�]*�Vn{���}c�x�/M;e�87"[��?��d��Z��n�����Gڞ�k��t�3�B�Y�|ߓ�˫#��r~�]:� G� : �K���'�7d�f��^^��N�z�w���4t>fg�ڈ��9�{N�m/:�q/��ĩ"}(Hk�F�"��]b��e�2���[�H��1r�t?�G�z~ů��Aѩ���/^��ў����������{�@�oƅ����(r�0e��m1��)(��ʟ�G��I�(r>T�gtR�G��P1j�D��\���M�n��^���N��S�u)������1A
����y�˧��Q�c�W�a��v��C��='ڮN����#���"�	�0 �* �_�?gb�졾���\+�`0>'~��ß�3ڳ�����cVV,4F��miOH� 0b����,j���y�����,���$��ٽ����!~���ޜxʔ�	�q��ߓ��m�O���E�Ψx�ԏ�=eHyp�(sQ�J�Mvx�G��5��ɤy#e��73���`�q8�6I�)'쾼,n����X�{���]A���|�q�R�G�1��߮&��̇�z1T:���9x
���_Pㅾ_�6K��B?�8�j��#����_��J�:ץ,��A��-�_��'/tz�p�l�Nws����s[�|G��잴g����A{)@}�
�y5��C-�Uǘ��67��P�us��4��S`Di�h���ԋ�]�����?[]���l{�uDb�S����n���)u���b�MpD��C��PA�G�	=7/#�:�n�Ʀ��ϟ���d�?r����$#G����E�^�IoO��j�d}^mm{���i�c�F���|�:^�!�$�jbp������0�A�#�}{��Sbx��·�H�r�"��{  >���9�"V�6���V�OK�}gi��3�=�=�M�������>P_7���nV+ű�X��p)C�s{bVD�[�l�g����M�h��f�~ҙ�Z��)F��<���Ä̸�L��"�qs��'cݭ�E=�a LM(�S`x�I��qe���ҽ;sӺ-��j1�Y��z�d�oJ�_�w�_�x2����*�l��m���7����������۔~�^���uvX�`��������i�0��j����=��&*Lhh�{���>^��1<����[t�[0|7>�U沣����������W��-�a���r��od�y�CkOS���o�LE!����˷�-���%{�SĤ���\�9�3��n!��h�z�ݮ��.����\��v����#����C��f�';���!d���_�30�8(&�/��=+S�3O��!�5oX�׭�vF2HO�yy�-{9We׺ƪ�S�Ho�۰���թ�zy��|��V�z�c��r'���sYw�-v�Uw��	A�Hq�W<��SƮS�'T>r@�ً��L#k�s��H>�;t�@yr ��������
�,�U�#�(����?���nep,���Is�I�=i�0��I-/�fX��5�.Ͽ-{�[Ԥ���Q��*�ܳ�ens�^t�8=�~�합�hh�P ���]�'�v�c�!ꥳz�����_��������3ב"��`�ǨŞ����d4�;R�ƨ�{��Y|XI�e���x�����co�`Vx�2X�͓ov��[0��t��sΎii�����q��W�q�x8� 3Tݝ�#H�E�S`��[�8��x�1i>� ��8}��I�e�%�B�G
dDH��b���|Br�8=w���lOf������>^`y.�=����_j��H�lN�$�%�b�;�E���j{�,\f�hL��� �#�vyO0|;G:4�c��nG�u��{�_������s���A4��� ��CQ�Sb�'�Ǌ��ռ8���?	�A��jO]���T9q�QT��q"�`�'y�B1ǮT܊\M��41?\QÔ8 4���HyJn��T-M�7
1S�m=E{N�Jŉ���{���6'x��7�~#I����cum�u_��`ב=��qF,=?@��_3ڳ���z�.��>�Q/���=���3�/��A�v�����1>�.kw彛�� ���E6����W ���/�E�g4��7�C̾���T��+&��k�N6�		�h�_��\�Π�Yپ�:uӲ�;޼d��j{�j��W.�z�:�����c&f.9�j��f�,�tr[0��V���`�jW�������euF��i�n�>�q�� ���
F?�ǡi�'q���;��ԟ����
�d��C�6����3=��Z���i������� ��"N�g٪��֢��5�	͋�f�>T��xe`Na���:����ù89���L��E�v�G�1��ԛ$J87^u 8��-�kMvl2-v�3*n�>gCO�A�E��:8�u{7̇�1g���ʬ�5m�U�^ּ�:�^���	ܤ���%9���;$#�#�9��L�����i������'^F�����
�(�����Sb���>�d.�L��9�!�#Z�����PBő3���h�|:��.�@�OM�A}Q1|�����d�)���*����0��:K�0�H�j �m�n�=G�����JO�x��S�����~�Գ�r?k ��e�C��e��y��L�99��Q�Գ�c.�>�ca[�Gb9�4-�"&^
��Umϻ�XU�X��������^4�ww��P_Q�#Y��qlޫ�1���F����:�p�����ole~'a�ܚ�uf~[�̾6;l){sbUÙvVv[0��R��p8��`�6���ҞP�����z��ڞu��O�=���ϸ;_��E���)F�?y���^�ۆ��oh< V(� #��������D>/��� ip��U��V{j$�D�*Kw�NZwA��ʫ�q$lJ��hGԲ9	й���\�S�"뫍+p|O�H�;����7�4&��60��i9$�MZ����=0Ͷe�g    cfj��q4��(6�#�!7�!0b>*��@8nR洓� �)0F��`��JYP�D0���8�+Ӌ�=�t|h���N�Cm��̼ǌ���"Y�A�8:~(�Y	9���ơQ����w�5�7-{����oݟ��'�m_�L���rd��ksT��E)ўc�� 2�TŊ��=@ޛW��W��tYݴ�,�)!���c�d��	� ���ag���=��o��`�� ����6l�Y��Z�?j��l��P6՜���4xi�.�s.�h-��j-l3ݗNM�G��%F{��yH{�J��������7�����c�	�*���ϛMuB8�i=�)0����+�a�i٫7��&e�������x���u�5��4��1+p���q6�$��Bc&���<sa|�0�g���5!i��)��)!y�S������1�^�;��S�( I�#ʑ!�e����.�5�k޹^��<��ե�q���Y�6�C3;^�Iǈ����.���+�����W�C�֠.��S�䰩{�]��(�7�=�(]�#�t!��,o� ����<]3=�݅���� �!0"�S�ZC���	N"���i�ct^ϳ�b�6�Dq��6W��)F����ܖNZ���ʇ0�w��,��3.�;`�� BL�qd/F�|�V�`,���z��F��嘬	��^�����2B\�YG���F{���ŞBՑ����	�=�K`V���ؓv��,7��J{V�׶9�w�|3�������Pڳ�g:O8�p�bbp���S�q*�H�q#���UI2��E�*�'j��Kf���\�Pq߾-�	��,�)�[x>t��ie5�|h�i����0�w%�(�گW�=O�^�"�?f�*�ܿ�\
zW0ڨ��82@�Xt����{ڞ­��l{�jSی�mSu_����c�e2�lAw0��b0�4/xn?�j���FY�w}�;��/�O�ܯ�N?'�c�/�ΪOp������i�e2F�db���
����ȇ�1*�Kj�������uV�5skOٞ��)�u�Bg���*����×����b�QOTw��*�(��	�I�l	�ۓ�?���q$�Q*浴��i��MLG�'�(d�_*U�LM�!


i{�'����79s�^���*ɽ��%��MO�V�J�����$�ݲ���՞*��4_�Ӊ��m��)��S?n���ǘ�Z�å��+���PkI�����v��j��"���O�(�jb��놪�hz���Tn@����ϟg�3ڳk?ѣ��Wm��Fg�|!${
oy9��]����h7e ��I{����pc�X����٭x�҇Ҟ5����s��Y�`��؏@�����hA�Īk*m6�����%~|<���wG>��{�����ig]̀�=[�A���[�O~�1��˖T�t)ӓ{���oe<e{R����Ð/��<�����?ƾ��|T���nc�'����lOb�3�t�2���=	����:F���f�A���K:�2�-�	��Y����v�M��5��Ę��,���˵�C��ځ�F6�!xI3#�������Q�v�J�nlw��m��>�~~���Z�iW:7�#���'e	������u�����S�k���������W�=ק�S��W;
�C�ԙ�����?dax��@8Y�Q;��"X���e����y�a�7{9t[zd����qE^���ŵ7�O�P��#���`�ֻ�sng�t�Lɤ�4�:isQ�Emϣ�¥\�ra8���3�|�'�/�s�X}a��]o��$�w�(�.���i�_-�4jV�H�S�$�2�M19� ��{�������F{���"J��� ��P7���Q�c�b�H\�m8!'�t(=�����EňtF~j�E��i�g$O㠹,��bԺ-�^��A���ȣ�~�1�wr(@���Э����W�/\�(�ӬW�L8�ܱ�Q<p�BD�EC�-��rƐ����)��+�_,�Y�p�f��u����w�)$� ��苅�o�6C٫�`{ܗb�8A_,�5�E���fGw�Z#i����(q�(���I+5w�3p{K�2�c{�L�=ň��;�򫳻ܣ�y�Lc���+6�λ���]��9�|T��՞z4d}a.i},��A�	=�A����ݵ��P�uD�c�<�zK�3t���Z9a�4���?�:�����#�b�'w�pJ����E6����ҞE.<M���t@m���?n��bb�
][�F�6/��lo;J
Q���w��.c��ᦴ��!���~�Sbx�L읊�b�+2F�o�x�٭�{�Ah�U���[�5
A~V�dZZ��O�yֲy�ī��;���s6���_7��k��Cb��}픺JocĶ%�:J��͕�Wc��
r�s*npٽR��-F��Ӟ�<~�(Y� UB���?e�c�G���c^�5h�?1�)[u�!��u��k_�����o�����Y o�g��8^�ʄk�e��2dg]Z�#�p�
u�])�\i�t�۽�*��q��q���U��]T^�Y����d�'��%ر;[�4�}Q̇���$�������:��&?�Z��;���QfI���$�c��1��q�5�k��/��7��0�9�>(�'���`���`E�锋ikb?��=K�ϙ�K�u?[h��|(�"�(F�����1+�p���b������d�Ke9/Q���T�7Iv����h�6�܎���u�v���"��ä���=��?�b��UFܮ)��O=���=iϘ;�,{��q4��1:��e��[�qb�Syb�Ǳ�[�M<R��:9����TN�-*o��y
������9jn��R�������kd��5g�{V{>/���Ļ6<0���`Hc���|�1ڡ:��v9^O�ō�L���{��.&�~HԹ?kH�c�ў#�S_�ks	�삺����S`x�3q�&�Tm���
 �x��gc��C�T��,%5��\X���C�gv�G縼H�t1�3�,,�4?�]`��j0>��>Y7�ؙ�,;��o�ӹٮ�fan�)�ּ�����X��8�?�XL�n4c*�R��w�%A�H1|��QM̓�;�eT>s���9��F�xt1�2D�q��.��?OԴ%.�"p�^���|(�e)�䘨|���wT���q�-�����P]���?I��n�k��g���ѼO	k��P/=���?���TJm�My$��76a����,�g���<�?	u��L��q�7�?%Fd���>3v��|�@ܾ���jO���֭�ͤ�y@�,�'�ʪ�N��D���oś����ǣ����~���􈤒iRx?�̞�^���跨�Hvެ�@��?⺣�_�ۯ�r!�Er�k��X��T�0���~Ml�{�AK�������5�`s;߭��w�������6��ڀ˒���B��V�.1Z*�G#cd�S�Y٨!��#p�!���cެe8B�󏛊>홻Y�N�z��`&�;��1���E��WcO�y��
5���a�ѐO�a�������S5�\a64/hu���=�!5���
�a�pr�+����V{jГ���ħ�z�8a<bZ%is��=wU3G���G�iۀ�"���J��I(eF���� 8���-�ށ�gKe	/�"D6����*F�~a$�������AJ���x���i�]�ɵ!� �]��������d!L��^[1��G��r/�{�D�q4��.y��[�	�Qf[�7#"ޝ-U��Ҷ{�����wB���g�t�>�ϭG��9[|Q#Jy[0zh�ڕ/ˡ���x��  ԋ�/Z{ڵ���P�)��'�+h'~������1�A���g����A����e�t���D��d��	��]bx���.����z;�:0ʉ8���E��}j�&�L�O�g�k��o9�D�7fj�T���{cy1��r�k�_m��5����W�V8�He󡘇h�Y�����t6��iG;6o���ma��x(�zy5V����Y��^��D]�ʃ    ����١��B���h�\t��wP�܃�@�΋�ы�����\�dD!��(~��+%y���;�F/���Y\}60��"�E2��59.���!�a������ݞl,�I�Xl{d��	<�l�.ۓ,E����g{�?JO�����g��Gnja�ͩ��"���)0f��~�y�S�C� �(U1<;m;���֚l�\�����'�ߢ�
re�S�fOC���Y�z�o9��Z��c�����)�h:��h�q���U%�ݪZ������Ĩ33` Ғݮ=0ٞ�ȁ�l�Y(5�ڞD�vs�/�(�l`�x+��9�͆�~u�<^ ��!i;\�����ƴ�5g8	��������r�<�����O�ѻ,H�9ǉ>E�D���Y�Pb��P^����\�����tt�}����}�ў�͗6wff�|��`J�H1�ܳ؝���p4�֨��qi{Ja�ڛ�Đ�+4R�k5��i3���l���U�>ü����S4��m�i���N4f���}��O�3�x&�
�pYd�[q�����o�M��cF�]��@HJSV靆 4����X���i�#�������ih��4�X�U�F<_���/��IoO$�GZ����y٣i�w�����P�J{��O���%±4�s���d��d-�r�h�6?e}"" Y�%�_7v���|{��[ԝ���cD�vR3�{/�1�|��SǑ�6Ԓ�-�_i7��H1b�q��g���}T7����d^U�Y8#c�����ks���%�h�X�`#mX0��ṷ�3`d��������b�_h�.���)��	�~x��]`Q{<���b�^o��9��<{�W곅��Q�i2nEr̬
�ɹM�5C����?fb�A��7�z�mO{pE1k�B`?'�^�qiyͺW>MA=�f���=؟����4*��2=��v�Թ-Q4C���q�
#���^�K���q�20"Nʆ��Gh7�j=%FkVv�GJf���YCj^X�/B��~�0���z�St1�<^#_9��K�x�Q�P���/��sIG�):P%H�"�l`�2�̒�xM��c�e��C��Q�2������rO^8z,�����Рk�h�����LX̬����M��
ƌP���
�f��ދ����C`�k%�TM���2��PD�'�/�
Yu逼��|�(���`x�p��yzg���o�	�7��*�\�z��)v�HP�� �w���������T,94uO@�v�a7Ox~h�i^�Fぶ�/]�D>�}�y���R��>��׆8�V��e�o6hB����I�o�r#��L�huԼE���P�ݞ<w�u���u�;4�ߚ]�n�����H�^s��~�k����1b�S']o)��Ɍ�ٹ���b�v[����8"��"^vt���#Ũ���dz��U_P���`�[�a�p��0oJ����)╅#3��<�7�*�BO!��/*F?��������5���n��DCڻҞU����R尓�=�t{�?�ٔ&�o6F�#�CO,��5婣C~�Y��¨iY�|���̻�c�f?�8A�~��9�p�\�>��W��R�'���a����8��r9ݡ�C���������ހ�[3C��\r�	�;�7�A��Eà%�v��s� 2��{X57��J{V�V+���K��� ~��_������u��l�������8��gv�1��dA�n��Wc�܏���Al��OY3(��pxW�$}��7��������I��E�gUBC� ���E}W0��e}u����ҁ~qC�e����K�s�}��&�Y����&��la�m_���[��<Y/��Ԍ�P_L���r�z��N�|���̼�7g���F�m=ֺ��3���kU�վ�����܉?R����z�� ������Þ�CsC�ꃵ��Z��4�^W�9#*��[fir�ҭ]u� a�c.�|��@{���+��/�*�?S���y#�0S�ڙ�-�O^����8 ?����d�HQ9�EV=X)kf>�x-*�s��=`��;��~m}�0�^.�Ό����vY���{�FY~��{���=�6�&����3�Ȭ�y�Sbx��)i��L�t��o�DA<V�z3ɖ���U}�xG�)�[����?j��i�?��~m�z��ǐ�v5�`��׵}�cl���� H�5���w���Cm�?w<�a��d!�շ��
§�8�]��9�t\��x�q�=FD�,�^��5���W<�"�z�q���z�s,���Q[��?����?�_�X"�ɕ�J8��3�~����{����K�o��6'lNn�x�᲌Ц���X.�:�qB|}(�Y�㋶RxV�W���s�}�0��큭���.ƕ�IoF��ӑ�ڜ��$����@?��삥n�<\����U
2+���?fb��Q�<t%Qtb�/P;Aq�}}
��
7��f��#��� �����
��k>�Q|E��,�>��v}�0Z���wU�J,K��ɹ�����8&�3]b���̡�'�p{��'�=�I���joA��Nn��0~ݧ�;��A���v�s۸�_��T��̸� ǎV��yLW`�T�;��TS�(�l��P��miO�^&��fe��~x65Ƴ��)0zr�l΁�������X|(,��3'q"���қz��{V_����%�� ����NG/�Л�{�I=���Y���z< ����֭ѡ+R ��{��i9��ў=����)��"���!��H1�o��$WΧd����\⇒���W�E�t�_��#����k'���������ո�l9�l~i�����\ە~��N3{}P��e��O�����'[���& q��'c���v=+L�8o��R~k�~���yf?ݓ>�ΙȽv6a3[�^�'a_u�Zȍ���O{T�ϝM�5�4���������<��x K�	�_��@p|��I.s���q����&{T��n1G�_�	������v��Ci�j��&���
iV��{�1�R�%�z�쌭�la�Z�.1�!H��W6}^��!*�Gڞ2S)���1��	�P�۷`� ����=5Nw�l�"��PV������a��b5#K��V�с� �=�����������NL�wh�h�z���Ia�%�~�V�bx��9��/Z{ڥk��F�(K�EgVs��SbDd'w�KZLu�	��6�nF�#?�NT���r���z���a�n�A�����k��C�"�����F{��r����V�R�V��F�
���_
ǝ�����6����'Z;J�+{�_w	��7J�0y�p����*FqR��6�IO�1gg�����C�w�n�̳�ҞE����V)~{'���\/C�y�i����30��jA"�3�_�tɡJ�zE�����v?��C�uͻ�3XG�Aw�C��9��)1��3l�]�������g�[Wنܐ����"�'޺}�!@/��|)����گ8��⋶;���y"[��0j޺�\���T��T�/��Ͽec��;V�-5:�߁oۧo?�_�ٚ:כ��0��>�i�B�Oz{�I�+��7}g"�������v�OF�;;-{�������f��ľe�-��^,#>7����}60�s-����媳���5TxU1f�*�,�!��f.�v3Q���g��ݶ��SW����,c�f_,���9�CSerYz�^d��)0�؁c�����l^� �O���y�zzI��U���Us����~~5�s�E�N"����'�G�hq�"�{�p0��n��k�k���S`DHA�i�[�ɵ�����v�q6�\c9Z\ۻ��"wͷ��]b�Ok�[�K���C;?	ď�����o6�E[�9�����t�AR�5&������A׬lpP2fh/�'����_,��S��J+�2�0?9_��i㓫_Ap��]#P
�I{�XQ�q8DN�b܊�:L~(�,P4����)�\\g/�G���+�KzlhX��θ}a�C��6fz�BzC^��|����x}� L  �_�1��8�zz薆esw����}��7���ez��:�;e��=뺔�
���ċ��;���}W0�Hrz�W�lOA�VO7�ۓ��ǂ�~���g�j��������'�?�����G�ڿ^6���ު>:���>���ͱTn��ϴ�ۂ�'b���e���HG��K�g�q����}o�������Gڞ�>p��Đ��8��(ރ��?4�y))��ӛJ�v���Wշ�{�v=����}�XW�0�t�T��v������1H���)]���`�'��4Y�`���jnU|�����$�o����*w�|���O������������ ��2      3      x���[���-���+���'>{� !�o�w�@�8/�q���{��.��#&b{zە]Te��̕Y���<ria��x�o�?���M�����X���o�]�9G�?����矗?�Z��?���ʓoD������ɡ�$L�#Kr�/pA����\�����/�_~���s�͐�_��b9�ܲ
S�?���8o�Y��1$���[��wH���^VV��,ɳ2�ܙ&��8�������Bn$�W�;��m �n��Xv�{CXߜ(HH��U���<+��qA1S=�TΏ�E�~��������eH��vV83���V�� �s_�K��r���p�����8Aj�39��r��8z�ۭ�?�L!�0Ĺێ>$��̢�bE6�.���qg�t�o����x-f^�B�K  ��A��]���%�=' ���8���,�/�:��.���m</���󶤣��}�]����pH��Ü�E�VnQ��ԙѶ�Y��۲q�j1�ٓ��aY���[��r j.�J)q�����U5�p�o����n�E�V��w����y
7~��(���y���('����%�8�����p�s�&�������VOk"�N]V��S�-��1O���<�[{q�ԉ��\�Ͻ�0n�x&�EڠW�q��,u�Fn�[������dtc�G@~��G^�	��<�q��\�����2������MgǬ��/�#?ĩ��.y&z�@�i����������;l�VE��-4�������~Gf��#���X�#5�1�.�!�<�m�N��v��#%���J�ŋ���_�y�ӽ���vL���"jآ���簨���l�%f6N��LTJ�贖���r��O�b�MCP�g��ݴz򘗐���w9�';�u��Lm���-|��$Y]�V�[�c���Q7N؎��@B`�U]Nތ}�k���f��uɑ�"�w��p���U;��¾BK��{?{��O���>�@�H{�?��/H.H��a@
�G�1�a��a ���1���J�Y!�3�`��oֽ��/�����_<��g��/�lk��X`ޓ�l��A�nRxi�y{�V��r���R AnAk�V���1�i�b�}a��9:2|�h/�á12*��ƪ./(��mXFP�ub��e�Xqk�R�L�?��F,����(k!�4�w �,n��bB#�H΃+����n��w2�D�y�-�����jc$I�|�#�`�G�i�^�'��%�'{ƋcMbq��0�]noQv!"��p�c��Y��U�c�<��͸!��ݰt�G���V�M,g���� �Pu����⢂��N��a�!�b�G���?�;�n�
�������XDNHY-�Թ�:��Ø�8�H�b	t��������1���W�!D�w^�O���s�KH�����r��v��v^y�
:R?�[��>��mZ�Ⱥ�frfzL��﭅2�uX��y�#|���>P�g�i̯���uơ�K��||-�#��G���c.���;oa��ĵ;�,�e�i�|qI��q#`Y�Gmf�[-w���u�&[y�ЙuB�ASdU0�jv�D�ߴ�ma<]�,�k�hO��F�!z{{�-��zЄ_ƇF��Z� ��xi(�:@��F��,�KAo�ǂ��:Y�c��v�FŮ�j<��Y-����7���J�u2>~^�.�!X&jDn�V�VW����G#5��ñK�a7d$#�g����q�ٞq���]��[7pt	
�MC���Lb'��sD�)N`aw����^�~���0���>u0�G�zɦ�c�ƽ�p�7�����]���8����~��W�w��/�v�zZ/!�%��=Z\�G���j�#���߬��=��W�m�eL�Sr��%���$������2���;�����0?`�=m//�|�	�-|��8��W]y�ܷ� ��c������BY�'��cfd����cf�v�α?f)�����k��s7Jػ����Gx�@"q9׮�~���Oa<��9~s"���;R��3|�M�x�X#�?;�cɇ�C/(�"��t+�}s�o�ЊM�g'!2������MM�<C�gԜ�Ts���n�2��g�6<J�;�Շ���U������`���gM��]*�C؟Y96��	Q�,Vs��i��]�qA4��53o��hI\�nXD��������8r�'[��u������
Td�p.�S�����t/�G��WH�>���n�:����_5��[P/�֧VK[]0>ӛ}F��FT3'�\I��}�'3p���/���t$�Կ]{{?�JQ� �
� ��W��gb{M� ͮ��
��vUc�9�Vu�l�8�K����?�[P�q�?fZ)�Db\ߖ֨�d6���#A�y���yY1|�8�}�|�p�"s�ܜ��'~��1�i��s�T��!����vm�^�?+�#�f��}F����M��v2��Hzh�Fs�����ݏo�9���S�L`(���cM�ߩ��]���o��Q��4U����6�	�ƮU�U��"0>�鹯En}�dx"p�+&�q�@�-�^X˲��E�^���NVV�_���<�-�� }���h��?��@VI��jb�2�m^�В��1������,�N'���ު'�u����*KMc]JzL�ܿ ���35���b�֧{��v��9H1��委�jZ`�%
�y;f��~��GJ8����~��E��/6R�xb��5<Dv�:�A<��Η���Q0�CǦ�Л͞!g���l���H'�a�^�Gl.�Չ}:�Z��*B{�<D�.&T��ܱ�:�k ��=��Gf20[�����YA.�;���lqw�����f���R����a���1���-������H�\�[ 3��I=�i�����z����p%��]��a�};۶��}�)(UV�T���=t�(I��A�EE����8�+��zcߣ�i�Ȣ��A�Q��wA���y3�4�dpWZ8g[�j-`D�e8U�BbGVRKw�Pk����(|T����g���c�0����L�!x�^�qĿ뢖�b��2�'	 ���3֙�`�aT��py�0���͗p�J{���a��bt�I��>@
�<�^�3�7��]���Q��T�����Ӿ��Gj�,SK@ϱPl_����r�����8���Zn��q>�8�[�n�a/�u�J�arW]�O���q�L�jQ��Gx���$���3�oP�U��糂��rC��o��1�����=� ����!�}�V
�5�*�a����*bj�-BS��I�u,!uއ!�f�B����!{�Q�a���"�w� ���;�����7^��8!{F���=����6�Ɇ�a�V�;�!a>H������i�Wݭ�n/���]�&m2',_�a��4Jz��d�'�P�v��5+�S��⦬Qz�Zp�r�sL��T�! P%9b�BF&v6���:Y�dΩ�l�0��ȝӟ��5��~\�o�_6S����g
��$*2_�������4������¸���s�R�p�-�Cw��˒�����c�M�4
G�lXa�g3ud�:�(M�A)�J���y�����ƌkoy\"}
���g
�-��������؋��¦������2ݝ���k;uw�����u��OVSI�|�▬:V�uW��Ip0����>����U�O,!��萇�}����Uր�O��H`�^�K�����z��q��*�56�[/@O�asN�/�?W���wz;U����֙w�p��u��s��WJa�E.�݃X�FH�|^�@z�?@�&}=�VN��ʼ&l����]���!7Mn�G�� �\�(��  �۰���A�̇�F�����8Uy��=Ľ�*�Ί����~B�h�<��N�)f�UH�R:��<΍t���S1��g��g��E���-t�]��,��9W!ዋ\#�P��-8��c!���)#�+��#:�HC�ͥ�����<���RL�'��w^d���    Oi�Pjr임�����������C(���؈]��)l)�����Ş�����F��NU��ҵu�����XK �]8�v*,�3���x���{�y˖҉�ix�����x�<�+�Uw����1*����I���|3��S�RwV{�}�)��KG�W��m��g�{�9�xe����;�
������ҿ����o�6(,�1`�Z�D5�2	��H� O38;��~���:������b�0w���z~֟�OKl��8,��r�U��m��Ģ+}�̖�;�U��Q��~Do�S���� ��W8Z~M�!��檚aKhcSW���м��2u��C��RB�sQ�5ۚu�~Cߛ>�r�����}�x�L�������6�=�[��f��Ga
�����o҈5���������$2YT�􏙚�a^�?��<����Go��(��\%'���}���v����"P�%Y�J�pa۱q��u3� ^5�]�W?F�řkdao��]�I�	wR��I�D%�v�(���v�)���J����c6��F.���+����h>�o�Jd��(�#9������~r��e�H6��Hݻ�����[�L�u�U�8�h8�ůҋ� ��~�>n�<���-y�.DY�O��3�
=��A�M�*��E	�'#m��I//f�V9�-c�=��ݤɒ���*�mv;m D��0������{��w�ޟ�O 1E�?�ع�Q#:=��r��%�V��O%�TD�<� �0{ N� �Y=u�7�Z��0	e`��1��"� �����]N�(�C����&�g�gW� ��8պu��3�H��mf�����2����a��!C�V9����`0��R?�rT+f���%��HVE8��+ܡ�l���U?17*)O��Ej�~�YO�����eJ_�e��M�	>拌Nn�Ď�j!_��兀�5�w�U8�^��=�l�)�_����>�����~b���4g�@l�m�|�e�"�c��ma@�'�B��+pX����Ii7SM+��N���q�H���F12�m^z|K������Q���x_�v&b`��$�'�����l��᾿�E��𔃳�㎙�)k;�F3��[�6=<���m[�A�OC񤲌����
j��Q� ށX��+���#祺_5+��lM���<ʚ�bC.��j��R2?+�_W\���rǫՋT�?�u�E��������<L9�a ��_L��Y��MV�~	$���47f�M'�lw�ɳ�	�|��?1�l �HJ�y[(��eg���H哢�]��WP0Jڥ��mez�g~׻{�P�i��@����f#]�,iZz#7��2�����W�f�p-i
K�v�����?��o�q�:��E"�����F����t��Zs=�GdK���d����ܤ���G����W���u!]����AX��uj�0>{��{�@^�^4S|��#�jn��d,�ksAջs��ى8+�3�_� �wI��1�.+����(-*�u3�R:����(�֣�aW#��[��x`� �����'��F���.�zB�kL���N}҃=��2���؄��5I�T�9߷p�.ܲ���*��N/۝�n���0���{�Ϣ�(��a6v�V�Rn��|��gL�����}[ R�t�RMk;���|��1-���n9UO:��?��1S���3����C��h��ʵy<�S��reK���.<	�q��M�&V���K	����A�	��*�iv���{��U���-�6g�l.%\(����E��q0���,o�1�%�򮣎���e��K=�)8�.��G��G�g�3�k$�ḅw@O� �?U0��+�oO�O�"j���\D=TP��4�E���?�Jg0gSX�ϩg#�B\	��Z�K��bVD���jjF��U7ѹD��N���췙<��^�_	���ʕ[<��5s�*.��px��<$3p�U�}|Ud?��Ȯ��G.Q޷�ǋ�Q1��j �~�������_1Y��T���^p
�'w�4{Hf���F�f�$���-�����݆gl������ϭ8>e��uZ����-�9un���L��'s����,��`�#c9�>o�B��2�3̍�㼜������lk]�a$[W�g)��=f;$��K��-�ż�L ,�� �?fL6���jX�u�'��Y��A����1�.�̛�xR��(�u�����J�>���}�7p��.�+o�\��k?�v_�����`d�a��]"7�J��]>���K���wӆ������Y�5�?�x~Aſ0֔�D�{�M�/���{�c�v���p��N�ٹ/l�ՃT�
�	bȺ�u��b�;86H��2��"�M�<^v,^8�)�aP��EH@�V�~~��w�>{D_o�;���<\^��=�"z[JU�&�U�?��Ľ��	?���q˧�&Y%>�t3.��r80r�6�D#u's��s��Ѧ13?)���R�@@2�n�����6���"WnIJ�o��p��p{8�&��q��-�%�e��[ҽg_�OF N���D�"�/�ҋI.A��S��^�ƾo�G��pi~��{N$7:�
Hw��w[���hV��o���	5�.�a{GRS\���)H�O(�8��t��f?z��؟-�	�,�"��j��eE���6,�:2G>�p��j������Ŵ菗�~�۞��{7k��W5H�b�����QI���e�ηp��c^�4�G.r�b#�V6uX¦����Q
��ܱ����Ҏ�ŋ&����S~m����Z�TnRwg�$�3��8���5�%\_��*C�w�M<'���q[4�8^_ tq���-,���J!d��Iש��{{um�(���Bs<�9$x$u<�2t��i
#u�SVP�AQx���QL��2��:I�)��8���IG�W3�g��,.��F�j$��ti���f+N�Q���Wa$�����	��cr_<I��� �zʗ/X=f�_C���P���#3v�B�`�h��M�Q���n�+��$���G1��᱆�M��.����6�рs��0�̵Jz�{�� �2RWB1�Ш ��p���ө@�S�Vs�-��%U<����9u����@ˏcm��:fo���;�#�"�A�ض��Z���3����iw�D�ƽ���}+n��|�9ש��#,�!��UǓ��%�z6���'1���s'�EW ������x�C������߼X:��*V�"�ooK�|l�rN��g/ŗ�ۋǆR�V`&Ԡ�X���:q������~����,F<��"��F�m+���2��ަT���߅h�CIX��CA_j[���k���q�G��ȍ�d}�h��������0
K.K@�Fp�����ӌ#qPN�m�L���W���:qܱl�]C2��*��������ծ��)5:?_T�9�e����N\�ΠHǂ���~�ggp�I��j�1H�QJ�8�L4΋Wa�͂��R['Z�QZ̑�����CKHV=��'�m\,�˷(�%:���Y�������{$޲�{X�����E/ܤ��3�Q���%�s+շ3w�����a�t�<v�=<�]᯼Q��CF|��~��+s�һB��,$�ݬp2#���"׿%��h���w�E����딟���^�����㌻���7���Z��h����+N ^<*>O�=g�j_��%����ϱ��B>����Ɲ�����bX'����=~��/��(�\�b����������p���*t��E�#}Xe��RU��a��'��kswgf!���
ɚ��`	uYGce��ҵ�</h����??�Cḵ7{{0�a�0�厇�>��;3B秛�}_$������9��/�MίN�/����i��ͮA���ӒLa1�P��ƸVv%�L�m�?G-,��FGq�2�#��n��>G`�~����g�Y\�zԡ| ��0��,��|�����NV�naD��[Z}��g�atKw�)v��Q҉�V��-�    �<p���4��k^��&|�����h0�rX��>��Ă����y�D�@�m^	IA~kB֋0}ⶡ�n�r�>�ث#�s��p�d�n:|�������=ƥ�$
�z��;X\V<FӤ��=�>����,��=�����Q"V�h��Jn�gH�>�"���YyY��Jw�"2�^(�����~� ?���"#�.��rY�	���a��L*7�EZ�[�
Sږ���Ġ��Z�$����]�D��cY�o�Yޖ�J�ħMC�ǢP�!	���á؞�+�D�D�=�z�� C#}M���ܲaDT����{9]��PS�ݟ�� ���f��w��#Z�w�C;�_ �a��T�r�U�Ækí��UI��ř��vUX�в�x�V��2�ߜ� �a�}@�IM���꛸K����U��x��d�AYo��*|{�QWw.���ϙ���\��Β�Ӛ���A�Yw��C(*��]��K�`���r@���6N>���6R��'�۞J�/�"��H�˲�&�==�ޞ<5s�i���օi��K1�Y5�{���=j����nI�s�������DoOPT�i-v	;�I]XL�)�k�.�V�yy�V���Ϻ��(U�\y�Zp�#o�����%&z]�Ai���YJs �5���e&#����E�G����
�gMd�!)��j��EK�;Nl�}�����ѝ��f�f0bg�΂Zg��Q�� �C��R��K�����@k���Փ^b*/�.�������ͷ�Ԅʺ�~��T1RP
F��O覶;��<!-6ژ�e��_��rg(�I��M��8���zs�wa��j���4�H��VI�E���g�v4:k�@ %�ǆnggZ��~�����|��`�Vj����}��[Q�,���},�Wx0A����pv/i�F��h`o�>�K������D�k�t"�Lo�&�SPӢ�Ȱ����6[�P�"��"����.>ҡ���W�^1)A�sx����Z������~�HM�w���������U�q!��щأ����ݫ�����Ї��.���ְ��򫮢W��`(c� �|#����lo�Be��	�Y2»[���NS�L���1�ߋв����w���[�p�H��u���>���{{qIqi����y h��}|�������X��g�㖼�&"0?݂�&M��(ɋ�y e�L>�l��f��x`��u���}��a9��x�J+ܖPw�`,������T�抷[�����닪�g[��fn��S���Oe����.������A�]7Ε#_���U� �	=�~vl}dp�f�2�/�S�KBY0r����t���ѫ�YǬ�1�[I����Sd�&L�1�����"6��ʥ�vo�����f���ŉ�^Z.�=?J� ���,+�^8�y��%�>ϝE���[��j�͎|�Ŵ��s�%�=�. l�y���P�V�}N�\=J�b��U=d���ێj�9��^����;ڮzO��A5���LXW<��j��?+Q�Ț;zG&�s���N3a1�]���u�QA�������/#M�n�T�� ���l�z=»i��D���K;�ܳ'�B}6��qm�>fS��@�1!!�Nݭ\+KO5�0
�	��^פ#�=�J��+�Ӟx��ۃ�W�-+Zb�bW�4<�^WQ����S��u�M�0����n��5��� �ٴi�|V``�%���;|�F?���L	'U��Cj,]����
�7�8�ri!V�|dv�e�pQ��c�:2���P�s��ҍ4�m�K�b0�C���>��7�Ec�F;�B�=ؓND,��aw��؏��3p�Cx{u�p��m��_����';XJ�������ك��;QF��Ǻ�ii�s����H�O���.�=چ)�D^�0��Jw����tQ�K/d��&g�!l�[�����0�xZq��(^9VSʨ#�")��١r�Y����H���;C�鳠e��^��]U�/�ѳ ��Z7�ό(3:��a�{�!|�S���A ʼ��B=ܿx<��t|wӬ��,�G�a�<X������*ˉ��E����4��� ��;U�)c���ȭF��_��s!iV����^� C�m��3���x�[��%L��/�ֱqd(¹a.���S��ClV���*3ٹX�k�bH�b�r[�/��[_e��=�w����-�?���7�^ݘ%���<:�ta*�*{�s�u8���c�u��T��ĕ�#��/AӐ�ü���,ڣ���<��颚J�����I�ƼV�)�yү֮׺v=�o����sՍ�=2^���������ϣ߸�+�jx�h=&�'+�ZTn�<`�g�Jĳ�4
���Kޮ���m�0OG��T�^<nErX��Z+氖���8#��<��YWIrR�|�(����o_v�s>#�1�`���/�y����Dh=^�|��
8\0Ӭ���o
8rW��}�}�� C^P:�l8�ɏ���6Ee�6�z��Ƌ��
�z�i�j��
R�s8���5��*������\��`vX�O�=�S�'�r�����x�}�Kz[U!Ё(g2�$X�Y��<
"W.�;"�Ҁ^�!ܧ�x���������:3��b;C����ѓ���-g?"ܡx8X|���2.N���v||��w&�~�4��цk/`i��Wf����6���dԍ�1*?��`���I�=��z��1L�24UKc�Q���h05Bs���&��^�����5nT��2v�a�땿.��a�˼k���;]�&�s��gO�/��W¨���i{iw]:����pb��e�Ҋ퍟�w���7���r��+eT/��R����\Mټ�%�w�ދ�?�{�l�AIw�T�Łs�ڞ>��^6��YZ��nW,����i6�=tAd�V���.	�W�����"�Mgb
B������f�;~�JZ��2=vҳ(0止S���p8���a#��2Sϥ�i�D��	�u�#ZY5���u�z|�y<	����4�*%T�n��X����
�[��Cߑ�s��;�+�Z���s΢�� CM�o��Hbڦ�9�0D����3��J�[�n�8F���L��.�?{�������Tq������/z!����r��!��y�yM|�U���w���:�V[���a�<��zK�}Ҏ��@4~l�Bآ4ٚ���sا0��Zu7:�����
+��������Ǵ�q���d���?�Os��^eO���,��@:�T�6\b
�FOY��-L��I�[H�$<��@B�����q���H���u%��ҋ޴��'r�Ns�W�h�Hq{����=��@�1E#����� �H�U%�����p��Q
δ�&����l��f���
Г�9��l��rC��)+{��Ά��~H?~�d��_�W?�ز]�\C0t�ĩ^g.*�*�ǳ�ӰV���c��h�ÝM���{��BT,��jtc�臫��Ct�즶��.�ӏ�Y�ٔ����?fsOХ!Ep�쵘���~��ݥbq��T���be� s�E���IA:�t��x�Rn�$�p*��b�Cr���a~I�9�h�&p��﯆�w�%�sz�����
�¥ȡ.0�K�
�\u��,��f��`�Ç`h�nTǝ���Ko��\o�n�>*o'6�]�v��َߴX���c�CWU:C{���w�7O�D�����~袘��������X?�Zκ���R�_4+���y��_��ՐKQ�j,���ya����[1cs<���L���<v|�6�;x���S�N�^n�]|OM����v���3TzY����2�|�a�0m�hG����%tZ���,K㺝��]�x����߽�L��	���;|���-�T�އ�H>�,#�`Z��w���E�"K0�E�w�b�Z�"3Ÿ��՛�����ՠo�bU7+%;�d�:�@Ja�͹�M����]����0��R:z��筶��`t�s��x��4�L͛��o�6�k�t�i9	��b�y��la^^���G�ۋ����k�=�z؋�����r6{� �  h�{�QXF��$�X;���N�s.b��7�}��n�m*�����[��R�3��j}\���l�8�2<�A E�9��I8{U�e.:�=2�'Ry��7Ʋ`�&#�kK�D��W����sJϴ�17��qT"�����횡�g&^(���y��L��db�`�ӢPِ(�
ǥ����>����+��U�+���n8���5�{)�pq����kn�]a������zC�''�;?R_̰�~�?.�_��.k���b`�Q����YԻ�ѩ�`�
�9�"�"�8��+��}��{C�;5K�f�T�`�����i����6��]> W����<j�	�i�s�ƙ-���r��k8HP���QM��]vDi4R�[��+�Cb5����:�u��f+6,��~5�L��K��^��q��������G�K�۪�^et���T#��{�)��]�y;�\�-�ϬA�b�sy(�dD�_��nW��:�دnұM��H>�� \�#��F�x{���̑d��Z�Np9���8�\��ܽ܋N{�60�cx�=�W�S���J�w�폰���y���dWE�dq��*t_�p�g�i47M�'��*ls
��FhgO�2.��+*Ļ��iZ3,���+t	[�"�9f�9[�W��P5s��|�?ޓ*�ZU=,�y(
0�3{%���.f��,�^V��ȃD3��_�b����PI|�(&�D�Z�yM_N�za����{.�T��lX���{u�+��^6�3&r�Ց�V��ܻ��ot��֎Y�6�ח��E���"�i�~�b|ն�i�-��s�����vR3?����$�lpx�c��n��#{���0g�����W�P��"/7��������pl�%�m��+����>Ț����8�3� 7
�ܺC��,�}�B���[��8QD�pr`x��s�<]�<�[L���S}��Â�����#is#�Mtk ����}�&���$YI�����^���6�雳u�O���(���M������l�R|�9�'�r�e��%+�X���n��X�L2*�����V��z�J͌4��A=^����-�l�FE	<�W�HB#$�{˿n{��C��۫J�|�`����+����L)���[5K�(���n3&�?x����7m�a��[l����P|q��v>4	��)��N��cb�[���ɘ�w�w�e������;)>.s���m`^���q䦟g1һ�Ud^�S/�R�p�i&a<���J��t�j�c���� ��[��NM9
�M�����
�o1?fϦ_������g���!�*�O��	�@3:N;�㽼�)E�m'3�i��(e!9��Z��A��׺;���,�&?��9�2T8�<�P��t�ׅS_:Sw͍��w���	��6+zǝf�&�m̔��9B E!F�����/��j%j3v��
w�c��
'sƌ�q�[��z�ǌ�/��7~��>Cѿp�/t���a!���W�W�)[)�kf�[=�m�lP��|ѝ���9����UVt��a8��5w����_�P|� -��p����O�:��x�d�����|��g�>��m!�׶�~	��H��.Xo��?�o��'��A{�f�A���c��"��o��!�a�8:���������/v��)�?�������Śs      4   �   x����0	����0��p��ML���KU0�4�4b45�3 N3mhdad���Y�xzfx���p��X�Z(�[�X����Z�s��$s�z���FU���eF�p����E@���4.{��M���֘p��qr��qqq �*2�      5   #  x�m��r�0����U��(d!�a䯊��h����X��[�������{L�w}�u�,]���ʝ0O���G�u�)�Ё��!�3	#���6к3�ˎ*_�iZXn\��@�%h*yJ�;�ñ�a�a�>���R�UV8�K;#~) j��=?[�	�ԛ�c�F�VI�:a�UQ�&I
��B�h*ݕ�B��9�s�Gm?��&��6��#8���o���y�i�C���NN��e3ҵ�:N��~7�'�f�͈u��>wA�Wg�I��X?���J{>      6      x���ɮ�Ȓ6��~����+��HժI�� ��D��<�3��%�ȼU�S����D #���r77�����l��6T�~��������a��;�i�ן�o�����=F��(B������r�����B�������������ہ�T���_�_���z9�=%fp�C�I��-�ӭ���"�2�nɘ�����������?�������t:�5�px�	�x�t�m�<�p�b]l�Kw��W�
��r���`����Y���F6�2g�3�W�ko�'��/*,�<�*�6����������I��3��4Yf�n��{p�RyK$.5�8�=ܗ��htsTȒ>^5����N���O�*�ך�}��0ص7��+�]ǝ�
ܯ�ۻX�����K+��j�f1���������r���R��Z2��&9��Ŀv.�s�����S�7v�0�[�g�(�흶}�T5/�H�����9 J��)�v'�md���P&���܇���c��K����
:��9��:����;U������#���Ȥw��\�[��Yq�[�?�������X|�.�+�C�?߫=�)�{b{����2��a� M܏�b8�ſ�����wH=eW�an�U>?
��
��I�m[Y��<�VW�~�t��R�VT:[;M-D�D�I�>�!�g��*�.�%M�vܧ���P��h��G�x�i�=����/���K7I��z���#g�.�Q�Ŧ��co�L����bxY�M�J�A��U@t_��݁�r7+3����R���qr��s���� zF�ѭ�7GT��7F�F0�{��)��ϋVn��'h=l��69��t�*��hK
�扚�x�I1a��|�F��@�4�Q�����P��zy�#�yK��+ìGHE�mđ�.���e�p#q7p���3c3�&��(�̤�>A��=�0��+o�E����
�VN}"������Zk5��J�΂WJ2>?N%Z�?aku�$[0��Ms��T�k�'p=�<�s�N�b,�̸�L_* l(&�+K]Pg1�
����,2���J!���4�ؿ�����#gJ�:�%w�4�2���˥��X���K�4�"�q-M:�Dܼ�l��h}ҳ|뺣_w�����)ےG�����#��e[t]���hn�2�����փc��ú��t��ԍ��1�7�M]J������o�� ��VU#��>�]�12 �z���2�(��!x�n�r�:7�;�O��C�޺����2v4'N��ah��/��c�h�%��h�sk�n�D~�n�=WHZ�?�j���e�6k�IK��Ӈ$�]8�X\pl� ��:�����R��DƠ����ʴ�d^N�vm���h��v��t��� �_�/ͅ�e��OS<]Ӆ��H�CN>ګ�櫩i���zzu�e�c�\4��[{{���
���ri��޳�N|`�i0v��-��zW����k��s�s��� �F����i}�>������a�8[�w��� �1���܈ۉ�n���#8��޴�s��9:� f_�4*^t�b=�ț�}�B�m7ZK54{v�f�
΁+n�}�&�e�w<�,^j	��B��� ػR�3���ѕ��&���;�1zpd�XHl� 7�xM��~w�v��")�' ��϶ܠ!�4�DW��~�K׺�짅S_��<���>���hNɱz���Ԏ+Qy��J��!)L�[�k�M�ؒ,>�_��V����s�8uhZ�B����K�4�C��5K5=�~)��~�����.?���XK�t������-���:`L�l�4����s�������_4w�LU�Z�*G�C�5��o��>}���
8ݿ�K@����lmP�g^��z;��x[{��B(�#�j���]拓R`E��긟�1�0��4�u|�u߻i�%�%�V�['�%�Rɉ+��@ܕ����V6���������S3h���b��P�N7w�Ԡ�����d�GlmQ�8�u��q�\ws�8MY��=�{bx��_�{8��;K|����k�=8}��N�+��"�Zy�bFf�6z�8U����c��ڿ����t�+�"�f��T�	�p!��n�*��&�������MNx����(I����vO'�/��8��;vg	1���m�?̋��j���޺$)�EW���5gľ:���ޖ��(M��������c��k�0����.kB2qxs%��>\;!dG'�#��O��0a��q	�)Ϳ���]�0���s�S3O�K����7?���=)\�C�<�j�$45|"��)�哀	=��b=#�[�"������Cx��/\� )��*.�v�D�m>7؁���'?��o+�t[�DH��R����r��X� �C�c�4:.�թwKzg}<�����M1���2�݈�S�������~;��o��xIĽ�!���2��J:�K��+@��������R�%)�OGpY�<@g���th�7����zP��س�_�0����ʆ�'pY����re8I�۟�[�{9)72����Xy2��}����l�!���|���?�Xu���n��`�2e�ȯxT@e�DSŭ������ gm�?�Y	�Z�`EY�����U���r�id��B]\[;�Kяg�8N�7�s�v�z�ʶ�����᎓�x��֛�9�uPiS���|���an���u���*�����\����S�~xz��w�a� �@95L���O��
,o���'�A(����^~9���E��3X�	?��D���W�����|=��w`��"�FH��;l>�*iw���K8��Rs	@�mŚ�~~8Ri῵ԍF��?UU2^P�(!smh`V�S.��JN�ҡ�˴(�W�5����ݩ��g������Q�I���P^+y��}׎]Mg�A�	��ۧp��W��	�&	?�����R��Άwm��O�?B7Nk$�V�d���>��sk�n=��	��9��H���q�?K�6�e ݮ����+gS�����A4���1OO��h������2l��%�����;�a-�����C
��G���0 ]N�#8�ڝF]j8�t3[^vMt_�O�>i���p{L�����EZ�~|JzR�2��e��E�r9�H��Q?]?��h/׎���&���FW����� ��߄
�awS���h� �^Z�+�\0��
D�L�Nl\���O�甆T��mR��f�9�~g $p�����Oz�+�<��m�k��k�V㥰�:����+�Z�O��+�NW|�;�&�ҝI)#�-�ލ�X�+5`�/S�~��R�4����pEj?旓j��L~���Ǵ���wҔ�A�4�:���>�Hٚ%��e�0l��t �͍l��H�Q_��;8?b��.��z�E�w�k��>zn�B�o��g=�)��{�t)���_'��w���/WX���xK�}<�l7J���2a���7N�}ӿ!m��-��V�h�t�V�[�Gb!�!}�y�J���`���B5�\0$����1�&T����|d�F�w�,-���ME�o���gJc���&���xY}y� �����Ħ���<<�[r�����^�x�mq^��I@<�#����W�<
��N�s����\v���@�ia7�E�J�������.`.3Ҍ!4/�Ľx᳃��\������?��ΫQ�ƿ�N�$������nO?6����Hi��P��߿^J�񹽐��?�>�r�����VS2�Μ"춟�����ʢ���W��}-	��9�c ��5i,�.�\.��'�[�=�=Eq��} �n��������=<m�o��"����vnw������*��!��%wm��=DE�uh,��
9�]ɗ��s'`��OK�&"�%�[3b��xy�<�p������]�=�2��l��v��}v<�t�����/9�~}�!uqD.�节U���Z���9gFR�!���h��T�cQ�#���e�~�IJ�;�r_,�	c8�&Q�~�er��Sn� �    �H�3A��� V��b���L=ЊB����c�kP�UU��!Go�@^��Y
��l�j����le���Wަ*�/2��xt� v\Ⱥ*Kmg��0r�|u�=�g�?�A��@y;��I�jg�-�bf�� 5�;9��Ƣ���s���y*��Vp�������q������ϓą�Dp��<!煚�d��*�����G�7�[����7��F�h�nno�-�h}��
^�B�m�lxT���o+�Z���,��f( �0���t��Fn�Gy��n�ًǖ����  h[�k^Y�`���$b���\�l1�@�qy<� H���{��𣢧D�5��5
_pXǬjz�ťM�BZݗm����dd����
��N�O������U�az�U����s�����o�&�� ��RH�wZ��禅���h�-ƛn�<k
(�{8�NC��N�	�ܭ~�O�u=�{i��$/�>�j#{����*y ^%�	w!/��<�������N�س���d�6����8vh�[O�\TR9�4��$6A:Z�n"u��m�^�&��#���#����@to7l7ӌJ�;�JVi�Gί�Z�8�5�e�C�AƯ��B	f'���k��	����iAt7�,��Ϸ����T��U�m�E���a����C�-��[~��u,�
��7�(w�W$��Iէ�un-�)��~�!t�i'�֜v��$K���+j�D��+ܙ�oM���E�+fs��$d�`]7�Y�^�Oܞ�@�A�kk���C�e�Tg�vyU�P>�2}b�_����{�Ұ���Ş�ӄ�`��)�x�ǽ>G	`,�T�JL�HU/VW|�Ӿ������&�7��ڊ�m�g�ٻ�<���Q�ac����ln�~��  s��C4�M:���%��N����!ԯaj1�E8�nS�!X��L㘪�h�o�'!��_�5��a�&l&��~/��ʦ�s��c���������O,��]�5뎫��(��恧݇
��s*���쟲��Ӻ�.Z���e�wT���V>�GqGQY��y�H����}������޺#��T�h�[^��������8�m-���Z�&�C�䦐%��+���ϥ��f���V�*a習�.aB�e��8塐�-�~JI����C���_ps�MQ6���|q5���4jR���/�_��z� ��䶛���1;J辱���}�׳��'b%��ܟ�i�!誘s�
Q9�ОϬ�.�s^i�o3#,X&��:$x�����HG�>���3�����(�VA��?���A9?���9MX�ui"��;�����rL��j�	�c�h�N/:3�(w:qߊ��_�蹽I��6@�{?	�v7Mx�n��Gko�'^�]^٫���@��d�`q�{Fb��
*�:x(��&���R��n=�;.�������w���x���G5c����l�Yu����ˎ�]Y �}R@9�G�G-��������p�vi���"��-�c�:�;g�T�S 7[~�.��޺�,��V� p]��B#����ܸѕv�Z{�v�mn���\���i��ſ��<��Ĭ�{F89����ާ�������6�l�=����D�?�H�����X�ۯV���%��Y3��X�A�B�Hܤ�o��}tp�g�"�*T��@�{��������<tW�]B"P�?�]�mN����t���;`ٗ.�Sk��JV����� �$�-}��YQ����HN��9&����u�2�V��pU�X�J5m��+� hʩ�ν�$m��z�}7��b»��6�R�����\��𑦕zm���|�}�j���h,Qe�4�������㮇���n܇�a�Q�b�f��5k��r��j�]��i��F�Cb��A���ʨ�g��ܞ�����������.,�{����w�OA���u����7(/��?��u�ς;tT�!�����t��]�#>�����9��yzqz3�k'>�����~(������09e��\���Ky������O���R�Zd��l��pۇ,����Y��]�s�9ɼ��O��n��Y��T�ؒ��$�2��яk'*Z?������P�����Cz�Vru���?`n W�/��Z���mC*����M���s3���,���G�zʇ���.���Jgj.��"�'t8�tc�̮��+�2�h�%ɝV����x�����`��zs�CF;��P�l8tiS��1 �q�i�RrJ�>V����O�=ϩ'�C��h�D0�R�8�F��ĭ_�,P{Z�j!>�.m�Of�Z�V���d�k�����p`5��?ԍ�Nd���.��#Q	7zr]���.���^D�&�H����֤P+O��m!_���)�/G�_����SyyLO��p>���e�<.�^J�b�'��m�?�#��q��%��^�⻟d�O*����E��z�?�~�~�N\�nc�c��Ի�hW����z��.*j}�����lr����^Ϛ��դ�M�J�J��Lm~��>(�F�.ͼJ)�8�r�$��k�#��=nj�AB�%Y?z�N7�T����^f��+������(�մ)�m�ߏ�P�)ã�krѷ8b	O�+�!3�&{'���wpI2ԤY��3����uΏ=y�wM���^��Y1��-N���0������!RAk�Ql���������C�pWm�B��:}<�T��os	��&D��뱻"'E����t~��T<�;��;ò�N҅�Q�#bY�V�%��RL���c�=qݲt�/��vC���짖8�i�	k][TT.J���Q�9�n]"Ʂ���g��,�w'�J��D3���?�>&#|(��N��	��]��R8j�2�,CV8���/�~uÂZ�G��@�.�����<f��ǘ��/�w�3H��9���q*����wd��a�y��M4F�����zO/z,�i��'b!�8�B��IY�c�1�(*��m������<B
Y��xEa��M�����I�>�{�"�s��0�{�k*/����~� ����E�����T�⟰:s�9��"�E����b��^�%�^�����l����a7��ۻ{5�o�i�ރ���L�Be}�����5N��NF i��(��;p�n4SJ�x�0J���K2��sry=xu�k�*=ip�l�فqn�~D^O�������UK(V3Zә|L���ʛ}
�P'N�(-���̘���޺��T�P��,`�da<~ӈ�c"�F��n�3�k"qYB�i���#Sv0���f�Uw��\Ah�|\XK���w�eb�]e��_�8O�?i�,>����M���u�N��c4x{z<z�����X�������9�AC�e���}]���
gᄔ�F�nW��-�X�����	�K������^G}w}.��m#�q�[��ķ���m���W��m�����k� �١F���q�S2���N�w'\�r!��h�e;.��1��͹��Ũ��"Tަ����4�<�+Z+vH&M�b}x~=t7Y�X��xFEo>	����SX@�>�(q��]��Nk&��~�����e�t7����.��w���^nA����$]���u(�8�ά�6�|#�eEXm�2qZ<-[ű6�n�̴���-y��oRq%�rw�9��J�⏘.v7Y��O��z8�dD'�Eb�8�:�-9&h"7�]�{��ܿs������?]�Cܤ:{� ���ҩ��ܹ����+N��$O���4Y�`���Â�[���U�1	���ѝP�P�D��*+c�>u�~u������IgW���r������������|^�s&�'��L�!�Ϗ���o��w�N���k��W_��4v��l
�GG�Mco�EA=�@v8�/��
�%��a����ߩwp���E!8��p��6��'��Z������&�o�;R}��h�/cڳ?
�����~�?�a9�u�9�*�y���G9�=$�$t�%,�^���n��R������ڐ[1/�Ch�ާ�	d��h���J�����    ��Dp�U,}B��{�$�?��u��K���	��^V�RwD������+��.0bt��{>����i�ļZc�����/)84����]��':��N^2�~:����x��R����^	@C�C�H��g��1As����k�r�Q�8�=��т*����DH.�
Z���J�r����*��R�H8��4�.`�. ��;�B�m:��ʁ��#PG�X��&�{�n�]�$q����]��x�����__��A�H:�.'�V�f}�<��`�D���Qq+ҷ�Zy�=6�������;'�O4S���Iao_�w] ��dK�y�Z�ٹmo���<��;<X�0�e@g�p%�9�6�8�I����T�xON%G�]'��K���ҬӺ��	����Ap�����![Э����7�;��p$4O��z�Oț�:��a7V�}*�$��_�y�C�6y��i-b�
W �����s*�pq�u�}�r�EFO^>p����N���+6.[n���ظ!��}��-����NS�������)98�`N�E�-��	y\�C�O����;_�������U���R�v��Gr]D�����;��fa��*b=3O� �8�<&�~��;B�j����ڹH�t?��g+J&�GqǢʜ[��[��-�1嵣z�������lR;X�w������Oɞm�F������t����i�ػ8�'wi�	�{��g��lgס�x70�O��6l��o��芜*�X*��<���yGEu��!1AhR�%��x
<�B����W7P���Fs8�S�p���r�.Qmx���E��;��;X7~�EDع��ρZ=������#P���u�S��z����R�ѓZ0Dlh.
���(�S��$�����B�^�b��Q������{�)bT��.c�{��p�1�)��ގ� ���k��ҽ����w)�ė$Zp걈cۡ�SqJ>�*ni)������o�	�2
=9��Q�S5ɸ
a˙S}�5e�S��y�ݐ��Q�AC�h/��޵�.\���YE��sv� ���S��@�,��v�%�w�4fHj����l�g��R}Om��ߌk��c�m�H6�L��H�c��]��_�ݝ����E��أ�+��{j�&���җ�q���=w��)����xma���(
�c�]M��y��'CK!���BB{����Y�)h�֔ �#�a�ߵBB���a��r�����rT���"4�qD6Cx8��p�1���a<��6j0컥1VMJ*f���]��@��sڅ�PwP��yЇ����O�#�����=�gB����|]��A�D7���~49���x���s(�=}�����+r��(����pg�QG�9�`Cj�l����}��#Q}@?-��f/�k��~�cuȮ��ȗO	��R�^Dx�y���9�>��'��������a��{p�%;����+���i�?锎j�0����U�2?���������6\� ������y�
���)*|�~�[���Y� r�"p)�DUk4>�t�����T�8Ǜ>����Э��4��n/��Ώ�ƫ��V�'7�/�ۍP���?�Ɇ��X	3�X�P�:�y2�Y1?�_��g���`��Ou����z������~��.U�Z�c 3&���R�L�;�c���c ��^�w�]^31'�h��L�N�ej�fg ��'�[��q�JZ�p@a���� �i�w/K���lS��}�H9
[gb�%gG��������0D׹P'�;���(&�=�����$�2�eL�:?N���~���j�v>2�^t>��?k�Ắ��;����x�x��r�T���J���??	�������7��~���!t��6��X,V���<�(�3�/)s�L����>	s����1~�n���w��ֺ.Ԯ���R�+UWPvl�g�T���vk�� ��r��;���I�Q��!���{.v|�����U-h��m��]�<�`�X��1��{Ca��I�k� ���F����kI4�;>	�\�/��?�ߩ��3�oyO�y<�;����ˍ����O�tU�Iא�B��(�u������pT���󠃣'�xOV�IWz86@w�%��st	�~{=\�z��R��aVr�ț�&Υ��O"���Y4�^ܹ8H�LX;��u3������С_��;��.O�r	��v
&�R���ޭ����yB��������c���}�zp�re)7u"8��8�X@`m{l� }�o��=����H/;�������'��c~�\��vJ(�'� [a1ɼ������%~�*CA	^�h�C�;�-2�Op�x���b��J�\�����I���  �}Zk+�� ��gғ&T/��*W���>�A�+�T �}Z �+tͯ���z����SD^��z�V'7?n:��J�>>���'�?�x���Im��sU�_��)b�����[��D����Wt�����`��/�g�+G��Ȉ.,��oWܔ�)�� ��]0��$3�\�[o�R��DN�cb��� ^EC:C�)i;��������������՗��1��z���_�ֲ�L��$�\s�M�\ș�w��.N��zX-��;[YEkZm2MA2b]I@����ԃ:�T��忇~�M��ȏ�3"��R^>et��t�$s�����P�-�� ̉c�"cK�?y��P})Ll���#=���ĠjO�|��3&�+��HSw�+M_�CrO^�t�'{�����y���d�~�H&v��"S��S��5��b)l����C��Z����-n��.=>��q�y�x$�ep9����%�x���S߉�|م."�~�ޡ�w��ɤ��F���-k�t��y�̄�CH�5_�^�n��e�e�+����Mp��`⽈)}�δ�רLxocΰ��{q�	`�4!w+��/������U����V%!��G��9�y�4�1Rf4�u8$?��~X�U+\O�3�q���?I���w��_�X��R����q��*�!KM�����~��"?�7���&¿-���*7�.�Z�a�,�!�Z%Ȼ��/wQ��X�B}W���e\�k���*Z۹�ߟ��N�E|w�3�$7�+��}���	7�m�IG%~��x����ga���I��a�vx�� wˬ�XF�9����O�W5��_/XW�z:��xwOL���	3�wM��]�On���"�J���H���h�Ǒ/к�I�����Û�I�Mp�\#Bp	���98!s��Ot�~+*,��ns<�(�wD�N!�	d�9<Xښ�P��B������TW���Ʌ>��6|@]�E��m��K#1��[|6����2��ܽU��^92Ⱥ����.�3�D�-M���@
�P��GSѹ��έzz���_?��vWZ��� �[�����p��x������q�Pv��;��P7�V�UD	�c����>�_v3s���3�^�FWw�{]�.���� _�m+�q�@�I��G;x�"�a� ��~o?�;���4Su°Jw�T<����硂˚��0W�e��:T�oO�O��R�e�6�(�������P��e�ͼZ���cw�)"�����-�;*wg�z���\fwo��H�	?ܝ�D��w��'�I2g�R��S����vIN��>.�+='���/�0Ȧ�YȒV̜�X'��\�a�Ś7f���������qF�qA�,��nPA�ԫ'N�7C�Ow�Q�W�u~L>v+�����3e���D�붯���
���[V)�Ĝ6��`���\��U���}�W����9��1�ym�deYG���e����3�ԯ�	�2ܼ�Z�DX�D\B�P8�\�z�����y~?d�o����+8�ȢGr7��pF�F��紅�|��*�S�%� �������E��״,���<�jJ����g\�>]�^
�!x��5�����EC;;���פּG�X��]=� :k��a,X��Ew����wa��k��~>�I]��w-    T�TKID��y[C",>�2D�p��rM�2��;|�Oڌ�76t�Ȉ��+Ȥ�{�g2o�w^`7����lP�#C0~�~�@�hm��az��L�/S������C:�ࣈ�cݹ�Y��֥����C�o��wA�ǖз�[v	��^�w�X�5&�s�t8�l�h����k��<�nYs4t��|�o��ӫ�dk���"�v���4�Q:���<��ey�+��y��O�8��zlCa{���]��~�rɐ���,�����BŮ��wL%x<���}�q
�	6�b��!�\/�{`�]�Ή=��[v�.��U�,j$������A[3fn��ϭ�����ݟ���.���>B�� ݗ
����0rV���mj{�ۓa� :[�6/��;�!����_Mɿ�0� �Z�Oyg〹W��p���U��=ݰQ�=�&�!{n�p�N��;k�E�T4*O�-���xu�MR8vw~���
R}!�Uԁ��C�5�eV�������/0�a2�R��HP�eԶ�Kz���)�iS�����wSB�z�v�(Nԕ����������
���#�/OW|a�-ǂ�X���TQn���ݻ��ʾ�T��dr�r�-zL�� R3��d���`gM�l�Ф��F~qH�wq4��<�d�y\&�E�u��*!����=L,iq��X�锹A 9PcXH��K~���� SGׁ�ri�����q4���\���8)�Y̸)4*~�c��|?���lg���ܭ�D�!8�\��9*kg]���!_���ޯg1�j�����.(�G^N(�����=�l�����+�K\b���q��N��%��W,�d�6dO��|<D��k�3�q ���b��d!3;%5$��uG�
� D�v�-��!��W�B7�2�@�W�!��En����M]i���������]p�Jk���ڮ����ML�~շ�$�{a9��S%�z{���A>j�$��]��݁�9��/�V��G���ɝ^�6_��dW�J���e��2ځ��q�bW`0Vu�0�>�Ǟ8</����Y�hˮ_:}Bw��;C�KԸj�K-)�;(��K�G{k����1�8D���6Ug��[�Ż%�:	�%w���'q=���w��?�j�.��\��-{ �P�(�H4���Y�͗�v��^�`C<�F���懀W�m��� �t�,H�����}`?Y�\��ڄ�Mm�1��E��#�nPv�`mv-���T�n(�D#T&�"�iHO��mJ� ���uu�|sz��h.��Wp8n�A�_�$��gS����mF�%:������D��!��`"����Z��x�Q���w��xE�����%�����\#��E_X���c|%�C�N0LqAǍa�����U"�v�����������n�b�b��!���� ��jZ�sP������3��lw7����O�|���G�>Ѧ�8H�$N@��&dn+.'�m�`��=u'ϝ�۾k��ڢ�f0�XZ����mWoK�s��'��0)H���zA������jm�*��-P�YN�:��d�l��l~�r���ȿ�K�@�3�a�oF�`�6�)�ؓ�0�v�� ��E'u:@1�ÒŹ�Kq�d8���D�[�(���;����7�}�1n���`��A!�H)����͵"$S��n
i58�N-�K������Q!�k�5�5�����TtF?nB0ї��v���+ٝ���{��9�b����K�v��19��������2�y�:�q��3`�΅l�Q��#izi��@���b�7r��ֽ#�uY����S�;�TgU�+�!�c?M�#*Ѱ'��	�����_4i�U[O�$3�l�)�zY�UtO)�u��k]��N�w��p���A0��|6�<����^�����[��ǟ���`��j�r~mr�-j`�~�~;��uE��$7r���%\����a?JM��͡ mDu�r8�X)�k��n ���<��#��nE���f���h)=���)�s�	SR�B����S��b��]g�8ĭ�������]��<�HT�V�������<-C��c�w�����o1����סb�'_#��ѹ��*����S?�5�ݯx�ؾ��T1\�c��/s^c�LZ�q?\"�e�[� J�}�p���!|Oz\{�W5E����:�f�������3~��)��3��H�X�5E�'��"���a��� �����KM?Y��?$��
W���j��}Ϛ��t�y�`���{�˱�/�T���}ݒ��·B�v�Q�`��'��Z�v_N�PDe�Ȇ=r���S����t��Mk��.dR�v���8���ƟH�X�Z���i�fL����wN!��G��ǜ��,K`�*S���s�=L��t�ޣ�ʯ�pt��:ϻZi�u�Z�Z4�H������6��/p���w�����A5�s-#�:#T�~�aͳ��=OV����}κ�Ξ6��S�w[6���O�>N�\,wV9�X�)�E����I*�;�)��p-��z:٧����%� s	"dqL"�sI���������UO��_--���-#��5:޸�|k(�����Α��
{�hp�[���^z���wH�=�je���R��0[�;gp91�D����/u���`�6*����-'4�b�vɏC�<���$��;��]����wF0nw��K~p��r�K]]䛃 i�������hI�@'�%i�3���wD ��
m��N���'!��z�j^��z� �;LzO�z�g�]���I�vh�'	*lޑ<��XUSÙ���x�Z��11�������f\��2��q���ᵤq,��l:�/�v.u�q� �,KH�0o6�dK趌���*�Yw������ON�	�ӕ���[x�P��͚�M�Ei��Qc��<�ݼ���?��-T�g���p�-n���v�n��`_��;m1Ӳ��R�ש}����2rq1�z�\ۆ��q�y�+<��CWe���o��������m/�*��ǫG����'	l�c�ze�[��<��m�H�4W$T�s����a��G�����A2�gq����+���༰^����Wڕ,��,�u�W����mD�Z1�y��f����[CV�j˻
m���##����h�]��K~v�r�� r�K��L����Q7��9e�Kp{K�ƛ���]x3�mm����/a�6P�2Ϛ�<F��5v��ʎ/'�:C��t�φ���R��5�p�A�����-�\�U&�xs��)��u��gN�����1Z�s)���0.���X��gW�AK"���iq���6�F�R+/��3�n��~�([�e�l�7�;���:*Ί��⼭�8Ѳ��7a�[R0�~�W��ݾt��~^�!P������A�C�A�剑�j����}�Kl��t��ile뛎B��1��*���0q��d^o��IW�,��G����jb�@h=��˝K6�5����~F)%�=�tT���í��k�f��:r0�و���I�W��';���z��,2�,��H�	��:[�r#tbT���Y�Z��h�noq�]�<�+�!�I��.�C_
��[�^x�;mN�ԱG\�e��nW���\L�.����ݻ��n����P����)���һ_��ḻk�9�:#L������񱌟t_��s�!6���o(�½(D|�$��y����h����S	G�`v6z��)JN��j�4�VD��B�
�w�����Pb���ϳd��s`��J-
���eN�\���o�z��Ufs��K���4,��Bݲ�{�����c!S	g{]�'[�H�7Pl�7��g�F������A����7�IT7�7_�.:@([���0 �wjJn{�r:����b`����K������M��ʈ����:
�f<�&�e�<�������nF6q���~� Z�'M�<�T�[vO]����}RB�N�S~�<N���DO>7EQI�.Re�u�Sz��ɧv�ἐ 	Knt�l{��n{�=��y�!�jM� S  ����j��v��B5v�����l��B�>WK����GX�2�e�ꮥ�yȻ𢬅v+Ic+yɘ$ө�{�7�͒]3�iw���i?[�/k�po���2t��t��5��,_\����vs�"�'�җ�˗6[�θ-^Q�efd�8Μ �+2�q{���-��� ����$�YQ�������%���`�Ϩj�5�xF�ֻ�Ű�����õϰg��y*=>�G������/�(�.��4i�;�rC~jh9)d;�:�!�<�S��N6<�Up�s�9����ny%$&Ǎd���(\X�l�F��c��>����f������zHY����5*���?2�aňEj2����u�ڠ3.B2)N�+��#�����]آ��v���oe�S�j/��:��A��=�a��m��/��l����5����d�Õ���-�yqx 2�(_�u�d�7S�<���pA&`<���n6ı9��r ��u^��/���{"Čp�f!��6g�����6�'�VF�)�\��P��DŇ��v�ʵ��x)��bw�x�7j����~�gMEH�G����#�<����U�#�1�#Q�J���_�eV~}��d41NE�ݮL�`Y�Ye�����.��77���#K	r���M��"ڤ��7���W���h�ܪ�"׾ֵ�J�/螱ɏ�o'w��-���d�^�*�%O�G��La��=��Y	m�WK�Jr�`�pu�
�l��.�г��x��[���>7ݟ��	nE���D���/�1s~�7�<�&���菅�kMg�fy���7~�c]���Ͳ�5dF�Y������Gn�-p@G����+�[��?t<|d�/\�~��N��_�8�Fr�(p7��z\�Ra����=]��~�O��o�`gx� ��η2�Adj�zb��4��=:�Å��ҹԁ0eiB����\ʲ2�f4q��[�,vQxL�I_��T��v�/�n�H�Ş�3u�ݾ�(��-ĳlk���ut<��Ľ�K�F��.�V�7xJJ�.�c�rVB�@�U|}Tfr�R����=�����f��'7�>�{�[�&�^����g
g����Դ�)d��k\�G����j����=�Ĭ�z.݆��x���f��7m�����L�������:_�&��=� %�8K1K�_�56j���º�(�:c�;�	��L�Z���p�y�]���Ve�ta�Hv����AU�!�ҹ5� ��e�a�uV���1^��{[��Ǿ�Ub'�=u޵kv�����
�x]o��KۓL+�i��*^�Yװ�':�&-�dc�P�o}�
�4���"N�A	H\�V�J���j�Zȭ��v���Ξ��:={�=�G��M��M/��0^���9�R��!�ق�N�XQh��8�峓��邓骿��e*F�hif#�u�JEDz���n�V�ݾ-�_xq�Ѱ#~i�n/^���+�SK���y�D�^����JjP�|��� ؅�\lj	�H?���x��&�W�� ��v�A�0`�xy�u�HI�OR��K�L���p{�K\�2�2�w���y�1`�k~2svn�h3x`��<_�mΎma���!�]��P�����nD��C��������^���,��5`�6��~S�� ?�o�"���C�t�.�F�/h���.�*Ϸ@Z�䬧�t���s0V�l9�-�ũ�Tf<���D=�wXr$�}��r\HO���m��ެ�*WbS�LNi��29��E�w.[��F�' ��$8���]���C�7�K#�!f�3��t��Kj0��ر#���`�.y����vwM2u�3�^�o��=�/�+%����8�Pe~ĳ�sr���/>���O��f'][o_C��!����.`ӈ�Hٱ�7�������Vj���{I��#��gߡlm���fsd?1݋%���~s'�k��s����dW�ȮO��7�V��>r.�c9H9��IP�
���VU7�r⿗�<�����D�����sI�[G��C�>錌CɩW��C8�A�S���ĳ��B��������4�,g���H�Xl�Yuzdm��S�ЎP�I��Dь:w_���}��$��:�G^�~��s vB�Ң��ۥ��ݎ�m=�,5��~#�9��0&����u�R��u�c˰��J(M��i��S��q�{n���RO���^�Z��d�[+��k�V��P{gE	�;��#��D#� �����7�	~�~1��ōi齌 ����[
.T��<EbT�������؁��,1q�DJe��v����t6��:�e���Fz�v�z2U���<���8�P�m�ґB*���~	�a��o��S�y"��0۷S��x�i�4O~֓�ɵm��}���tz��X~�Er>%(�C�3Aq�"��'�\�3��EEAH�4v?u�_V�A*�Ȧv~�1%�,��C��ZAl<n�R}���	L����1���UО)��=�����.��P� =����|.	��
��?�'N	�J�s�c� ��q�,({X����Hĕy��_�#n�r(3 �rv�%���l-m���)�]<����0���R��4�A*/9�#�D�6	��:�K����ްt� EVj��Hm=!��$lV�/����|�3^��5|m���V;�އi���x9�I��Se�X��ĸ���swp�iY��6�������܈#;;�y�2�ʁ��<��\|��w�=^	�[�[4N�F�E`�?dC�@�p��Ɣ�|�I�#Æ%�q�W�;Qi��S�~ �Ƴ��pN��}X���l��<�- hjY"#�;���VQ^�N��ϳ�4+�o�pWļ�P�X8������%)���K��������Ū�Q�k9��� ʀ�(0�ݛt�*����������u��ay�B�Հ�W��r�o����h�^�H-�����KyO�>�L(L_��(z����V�½��Y�:;�B^Й���,C{�#��+�o�Y���$��u�M]s"od"����w¿e?I3{5v=��7E����J�΁�f�1�Y�ٳ��zϦ��S�->�y�R����'�"4?P��\�O �����0��=2�y�ä���B��E^#�����S�D-�5ğ�̺���׵8�xA�7n�-�'��c�!��f���	������	�m��h�<���E����GX�s�z�u[���y�FI�H�|��2��b6۸+&�@3��)��K^{��{do�亽,�"c�$c ���(c�)A΂>
��o�{v���F�:q��0�=��l��6�x���0r�1���7�]1~2��]D���3��&����G�Z�Yc\	c.���*��q����i<x�}ɨ��ZN����ﭴ[z.�#&�V��*��Y�0�A{}r��}��A6��"�v�m�vƬ?�˯�dU�?	\�j�DD3;����M�#�.�1�%���	��h�����'�ԯ�.���0����a�f����͟��w��þ6G&����`c>�������;��=������,��'�����R���8�<���K���Ϳ�����k�/F��G�fa��׿��{dF���B�?Q�O�|�ؐй?U�|�ZK^_�������@��      7      x��}YתF��5�^e%k�샂S�DDQTp`}7� �����Y�7霬�l�i��P]U=��겇N���t��>+�H�'֢����/t���������x��uп�>b$���6M�����M��R%}Г1MS�6�-��Z��;~��"��=�e�V��K�.Ej��	��8 �gd�G��Y�WF�����?r�N����1�tg=;��R�H��~k�'������_M�z����K%�_D�ty�b�i�mA�q>j��k��� l ���Ɔ	�U�������4���� Ew���9�=t�%��Z��F-EZ]߯	���֢�Ď�r���B�I���S�%� (�deL�C������[š�Eu!o0����D��g���[-��L�b-|��A	S�݀�D�8�Ǉޫ��E�2ġ?Ϩ8���ɭQH��2�\+��F,���+�v�]Y)��ک�פ{}́Ȥu�-'|oh%/�ZP�I���.��e�M���K�D��NM��{��&���(�85z��,	�����P��Xq�;:ߠ��ۀ�+kz����e S;=#cH>߳z�A��<�N<Ε�m��[�Ԑ�F��z�B��8�i�;o��Y��T?����g�h��Du 䴣��fĘ��V�<��z�ڛyѶX��g�,��t��Zsϊ�g�k�����K�xLL�� %�E�Z�=C�煉G&ㆱчW"�E;5�P�f%�]`5^ab΃�7#�{��K5�Pb䈑��˱�i��5dt����Qn`�۳2�EX�2���6�b�l��
��tכ�|�ٌ�`�r6CFNk��6�c��2ki(�E��\�n�H��"[jh�S)t5/�8��Y��651P��_l9�{/�Z���JL��'�	��6�X����g&��lnef�%���Q�x܈B	
�u����8�)Z�|�y��{1u ������x^+�]��
ɓj�@%�tVA/h�sA�
2rA��tX�UUvi��ӓZd޿��KLz�)iY�"�Y[��&��Q(A�1�ۣr�R�N�R��� E�)ː�F^	�}��r�M��k̪Ĕ̾�SN�"`ڻ�bZ/��
�@(1���I�b|pӎ�F�5��V�}p��/����۾m�[\ܚ��j� #hg�+	����z�op+G��'Š�%����_��.�~ %��(��v�.XEF�$[0�$�b��[p3%J�n\&}2_+=���y��J���n��j���8�*B/�Zt"��"���}
?��:�N�Iy�`q|Yr^��aI�?�c�?o ����� ����S$�r��w1= �˵۵�I�ѭ�$��7�p�\���ى�w姨��8�q���@8Ou'��[�[����G��]��E7�����QƆ�2L�
��[F�Yn���@$��Q�^��wRY.U���w�2�cP�7K�-E<�+�Qw2p�6�����x}��\���ʩ��<�,p��~ݗh��������\��ۦ�Ȩ�~�ƾbi�#b��}�W<��.8������M�Bp�-̡7gwİl�@Db�V�[
�8���q��hrd�΃��֯	Hs��x�Iq��yk��)L�Z��S���Z����*���H-&y��&��p��Q���21f(�܊���K�����ᬥ��Z��f�Q�E��ʩ�hŋq{E�!J8�Id� 4!��t��J���Ե���K�_ws��%���qUN��zȭn8|��x�fJ��6�~�t�NY�x�����H�����mo|*����5�I��0�r��L{��X-���4aPBT�ط��;��N�Pz>����Ŝ/�x���ɼ���iU�kl�!��Z�ŵ���w���������N1|�)����Dy��S� �x�r�(^ِGq�
}d�^���@Є�y`,3�甽�S6�*B�w,E{y�Ո�qx�+z�͏,褚g �N��R$O�4_`�:0�=�I��m�S~�x����+�f.2:P��Ћ=��|�8���{Qڍ \`<���z�eS5ô��j��B~�s�ژ��M���Ҧ��T�@��2_n��6���r�0�\���WE�oB>1�/��$6w����`1EƦ�O�RP��Sq2�Gi"jZ�ԑ��zrR<��4��-�Rc��T�Ů�N//���넆��]U���`r�JM%˫y�O?��] ~�j���ap�H�5�
2T��:xy�"��n����;���~`=X_p�ĉ��Y�d�$Z�[|Bp"�)�)m�8䅑SW>��0��-�s�fG���u��ܐ���jQ� >�
vO#���4~e�S�y�k�����HO+���b�bۊ���|�diF�XT���܆tXQ�ۀ2�Al?��Kq��q/��Yp����c��2g	���F�6������^�B�v��X��Y-��b[�{��9Jl_r�l�u�4�m�Ģ���wT.��7��k�@[(�IO�����!!]'l.]�-7t��vt��F�}�P�jO�-�������0�>��W=�����l(і"ۑr�i����;	���(�ɴK:�����$P�p@g�>����k���,w�5��{��B���u���	��P�2u�t���Fyp��j���?�@8�c�v�|��f�w:�y��j���F��P�L��f��a�9#�� �k�5�Fn��3�c�Lη��:a��}D!~}���rA�d����� i\��qh��VK��Pi>:w�Ag���;�$�c�G���*3�b�]�K"tv��3\t_�L��]�j砢C?{N?�����n���Y����3\.��a��km���,vF?s���������1���Z����o�*Q�R�-[��]��ÿg�����DC5���
O"DlTs)U��2K�	@�S+�╴�2I��ZL�z�~o���}ѷ�q+x4m6q��!%�HZ���' E���ݮ�A�as��`��q3
Wl�" ,g�Ď,�);7���E����.�{�<zh��r����`�}�b�4���u��jI��/�P�
�H���x���YqQK��)��3��d���;�Q�.VLe0�95?f��qhߢY�x����j���Ei:'�9�M|*#�|�b>� .R��ec/�ۺ���Y�;�K�xNa��w��y	�:�22�h��a˲�s7"~΅L
âI�c�w%^�}��7�p}�,��DI����jk-�7�&JЊ[l�|3I5l:NeV����Qx���L�-f��˒�*��(�/P�N12:]���[sZ�Y�	<VD]%5`PBЂ�Щ:���r����q��n�7ap_��I��S}M!�Ԭ�OJ�w��D%[*��B��K=E>̈́���W��-�vB�^�A�z�x��́/���&�;�}����@��o�\�ʅ�)N�`̤�P$�������x�z�RH�E����_p��M�0K�v��@���Dsк_�(�2��}"�:V:^�n<�d��oP�F��櫁k��3W�_-V��ݿ���<�y���)ɂ�/�@��� ��z�z]���ΟQl0��32Q�炅�\p�M����~��
�E&�fH^����	���x�t��<�R�'!0�E )���s��Uo�y*���� m$�֏͇Vn��D$ed�	G����;� _�&��NA(13�%S�D;�]�2�֐<�ۼ����y�N,L����sb��`L}v�<8�䎦�b0ХSo8� ��|BP"��S��y�Y���|�_-�[L�p�@u.��u�##@���U�V`����p��i���LG	��h�\9�vz���%�8�Yg�m��W�+��M� A�p�`>^��s[�^�*�)�����bӓ�s�BYVV�G�}�P�v��#SA��Y�l��$*޺D9ﺦ��E]�'�v6�}�ju������L#��O�5O�Gx^�:� ��?�(� ޷�$�248���$9��������b�+�p_0rF,�cD�u�0ۏ@��3�XE�p��K��    �(lM�(~�Aqۭ�H���E�&�2���jy��;�S�I��?�g���|�!�!1����T�:�WJ���]R�$�>fk��c������H���I)Aw�^��уV1v�����9p��Zې��X1FLwi<i�ٚ� �E����쉝�ͣO>I�5�5%��k6�p��~t��kcć=)�ϞU3
%H��}LX,f��AY-�O@�N
��N+�;�=cux0]6F���xi�&#fFGd���:R�z0nc-x(��<CE�xR�u'{�U���3�'��g���bE5�|��_� �:���o�T�?/�=w�+��P���Az}��L>��vb�[ �%kW7��E�v�ĝϙީ;��r�8�����w�@�T�|�F	O�%@g)�}[N-�]u��sw��Fk��P���oM�=	E=6&�]BκD*t�1�z��yJ��
aI.mk���(P�~�V�o�ZW�M���[�#���oP���}Z�-�w��Ǫ�Qł�7U�Vj�0L?8;eS���r�Hz���V-�P�ϸĿ��KX؈`ڛ�:�%V�+�s�n�'(BMQ�r�B�\A���,h�%�t�2�M�1��r3�W��Gz-�f..O�u긎��N4v$2U�/�����d��1���N��u	��R-���fSݱ3��آLW`�Z.��wG�	��N̝;����Ӊ�LɭN������k�t����~�k�e����AHE�M�C�(�lr���u�⃐��a�������n�p�XwΧ�(�fJ�FXb`�4�G���Z��~���5u?d�iz�4g��DX��T����X��67p��/8�0��f[J�����-2�,\y�(V-	�$��M�n�\��&U\n5=�>Z6�P�8�K���TȣdZ��20+�6����ÙrX2�,C�w��'@7\&<����l���[Ӂ�r�2��������?���Vg���Q��%�݈�~�5��-J����5�a���`E���܋�������Lnq�c�2�k��d+~N�(�o8�����;�M�l�t �k�� �[Y}��D���Xʞ�ƫs���Z>G�����3 ��an�(%lHqW���*��3�7�?��)剭.3�R��3�V�;�MV��.v�|����lCl����
�On�D�KZ�%\K�<Gh˕���[�Q(A����F���/�:B��V��0X��_3�̴��zDGfXq0r�+k�Nz_z�K�i�����ԋt:���J���'��E<>���m�=m��ܝG3t�Э��%�{��s\{q�:1��8)+�ޞ��z����:g�6L��"��j�z�&��W�k��y�qGf�T��ق��蒣�ً��twv�߶ �O62ɣ����!3�b/\�?Z�~��{����G:����a�ႃ���b�/���>������8P���UY���W���P3n&�t+�ze��p@�jQ5r_���s}ajb��*{N*6�*��*�Z
Θ��b���#v^��[��x�� pQ6'�Y�}2Ef@�U�x~�6���@	�mD�m-���� Gı<�6���&���0B��'k#�8�σ�jI8s��Vg�0Km��)��[k+?�EB
�\ژ{��<fG�2B������x	��C6�hgVړ��786k�'#�R�y��NQ�']ɏ���Tq��W��B��M��Ʉ��֦=.�;��F�JD�e���$|{���W�5���8�q:M� r�&G����h|O��c=�ӓ������0F��5�������cU=��Ga?E��&�?�'a�]>�m�SngGa|�.�=����&F,�o��8��L�&x7��i(������7ɔ#�D�?V_��}N���O��q[�1d*}�=�PzΨ��D�G�vY����i�L]d��h���F�CV�fq=���%���|��=?K��Y���^��jb��gv�:�G�3�Yc'�:�U3� � V����<qc�='���Y���
�!nY�y� �nJK7���[�s��_���'e�:GOK�|_�2M�f��lȀ�,X�S���	@�U� �.T����-J\�]V`���NO��;��^�{���Q8�J7�AIV�~�\��r��U�{�Z��A��r�c�ݕk'9�ߍ��9p����l��6��.r��.ܽ���,8S��[b�gT�U�2O�_��w%�bN�u0V}?�YH���������P�˨f�bsa�ˀ3���
i��t��U���U�� ��ގ��k�Ĩѹ��s1U=^�BӤ��*�OHQ"9/�=.r6J'���� ����[���/Op�9=���nw�{s1C�,E��ﭵ��tV���C�~�fn�o�JĈ!�S|�g�ʊO㢶z��4N��9Q.ek�\f���z\�����<L2\��lYP�w��}���3�4K<<����;+@T�R���'��%"9v�㚦�^o�B�῜&TK¹��B5��t�����,�ܪ� �R�s�ɼI�b\*W�U�����%nc+J�2{�o������\�	�Z
.�
��.QS��Tl��"P��0G7��1�R/� ��b~g:�����h}�c�#�IV!p�YI����w�|����I��a��� ��&j��$�!���E�{{i8	�v���;%neF];k-	{���x��P�*\�߯Ws9��������d�������FJ�=�$�i_U)BH���h�ˢ�G��,��#�n��'���D�xc��@8�]Zj�?���� #�o]ϸx|��֪�ƥ�1����7���҄xlX�6�I&ޓ�Ս�bP��x��T�2;�?�����3P�R\��kF�"��
e�����\�(�bJ�C�[.<�[-|�mD&�fTE���y����/����dn�����ߗ5ap���%1�pE��0���n�?[7YoWz��#Z\Y�{,m����<�˶�����V~���M ��mߝ���+8��`��<��<rt��]K�J#�M�u5��a����<�؊�S�ͧGlHdm@lH���}P�0[D1��N3�T�f����C#
gU�}�ZDs�8�U`�\:�w��k�1V��\3%�ܟ�}}o�R�`�i�	���c����>͋N���8�Ϡ+X�u����z�<lwsM9���J;��};���+���м�1M��#�B�y+\3
g]-�xKo]��VGa�t��'�>��2v2~V�5�W5එ��X�=���ӱS���e�aD��b$�T.�ﭭ�]z]#
�;�5�4ݎO}�WQV�f���kj �ׄ{%����A��}�I�+��eP�L.�grqnyp��E\�1���K��C��&�?�ϻ�����gKLw��a���[�M�2Q�;߂_`(QK���WYiRlw�t*GU�����dUw��B���ڴ�,�(�n���3)��sYLu,�mUU��[[E�n��jE��n_���7��km˃⬧�Z��J@V���ѩ��3�U}y����Dx���A��n�L{8��I��ԃ�Z�a��6��3$<�F�4<nv���|��WJH�*HS�kcsK7��W�,-,�k?d��
�4�{k[p�T @s,�>�u�-J���i����vS�X���7����tD���ặR��|R>E���X�����Av�Y��T������|˃���O��s�&1���e���aM(��ː=̥,�v$�Bih��\��G}@pa���R�Fa���|����Z
N'���nY#>�#�NUu�?�+�~ʃ�v�s!��x)��IXֈd�����[���ƈ�9������I����s��b����#5��n� K_���5�Sp޽�h��<U��������/�p�D��^���s/��(����w�FN�n�p;	�N� e���Wqq�ߧ���O�^�w��ӗ�ӘH��f������<����7&L�F��=��|��>��L(>C���3@VRd�^����}J+9|�^g��L������һ�~��?fB��|�=�    qy���R�(ҊJz�60ρx\��4�-��&���t
7��ښ����s.��6����bҡڧ��F�y��7JX**�	�	��v � �ܤɟ��%�1C��Y)��XGV�lݯR��$\�?p�}<uZY�&�I����h�ۖ����)�n����9�?�W�coP`�ɬM����v;��^y_`�����0�iK�|�k��U�5ap��itvt�;	��n}ߨׄA		h�^'���h� ��J�cz�p�ؘqڣ�f�h�]w �'���3��B��^�����. �Cˏ[����5n�/���|vf�'���e���/�����u�u���@�Ԥ���n�Γc�bb�Ce;��B�vA�cOq#g��C~0v����v�7�?�Ur=
�ϯ8�0=,m��;���=�A ;C2|�q��U�0\uT�`٦Ȱz�� (`�ץ?/��kܬ��_$ף<}o�1��6~ۣ���9n4�;��Bb'ѐ$�BE�7����c���Ҩ�-��"\����oMr�}O@�[ݷ��B�����+�8.��5g�t�[S��G�� &�ծ��r������I ������ō�p���W�
iD�L�d��2w�&K<������߷	�V��(�|l�_�/��j]�Io���s��>�x��牻3�{���\�G��Q�1��8�����v�*�j��M�דp�Aޫ�bf�G�[�΀(Q��kK��p�ƌ٬�*O�F)�\�	�Dzg7�p�>��	�4���:�c
��؈B	jSl=!�9�*�����/H{O����$*��0��� �UT�Ͳ{{�"��ޙ����:c�B�V�ϗ�یµ �Q8s�OI���t?FO�R���2uM���	��Vs���ɛ֢�lZ�ۡX�=�\lj��\��o��F��� ������/"�|ZO�p2� �Y�s�k+_��o8�0L]+�Ŏ�e�G��z���3\�k8ٙ��Ē��1 rk����	����/���I4�"SS/����Z�ݞGN���y>�ջǉSSsM��}�}����өJ]�ʺ�On,�x�-����9����1�z�|����0{┒3@���h9p�? (z����qS���x��L��+�q|ʏ�p}��GN�]��g���Z'u Ρ�)/�9���ؤb�/Gܹ_RP��R��KN�qv��Ȕ���/Ue��P䇵r�Kcr�D�j�V
�3K���/0���L쭠���8�q �[�'P��
'����G6~����Ѭ���	X4<t��&�~�9zz.�	8�:��Α�
y$f(�I"�p���P�dN�k�Z>s�v�l�kw�|"P* &,]�@W_F��@	X�X��2�ަ�N���~}��k!G�G���ݫ�l�w�W�c��u��OyPBU^8�]t�^�bϞ#[I�������#E.I�ˋ�-�L2���cq%�jcz�ne�ȼ΍p�\j;�'�:�r����8��3�r��/� ��<��e7QVhJ��.cٳs�(z��1��+j��gy����?(t������Zx�m��6�pу�R�Q�.���Um�:��<�O���ҝ2��RS��[/�� N�Z6�R�
�ʺ�����·J�f�\��ق���z����	X��7E�m��ۭY@i�q��)�a�ƨ(�T|���qz�]�F�{�@>q�`���cxZn&�V�Y��	@�G�<Ks160U�˼��q��'���?���Ύ3��e9���������-�)�h�&��Pycj�~9�P����Pⲑ��糱Pخ=$��@��.���-��p�r��\tJ$��;ͼ�ÚbI�Ujj�Ew��Wp&1U�d�h��U%�z�pm��7.ԡf�\��MKi`X���8����/(��FY�$/gZ�U��j�s��7�P��f��I{QʳlۻP�׫�>��?���b���͵R�~/���uYzߛRK�Mr�$k.�����������8�Tu��XZ�[G����1p�~��@	�Gx�s�j�Q#c]��z�ZzO�i��k۬�GGW�$0�Z�]���,]������uPXGk�)G.�u\N��˵�W! \{ZZ�d� :�K������pΠc��CO��|���F�3�sc�Wp��Ț�cS'n�l��l��ͬ �wDSY�X�?�rEo9����0�� �6���s��t��>f�?r��7���I�AwhPo} �Q�������f�w�ywћ�� �F��Z{�z���-?�A	��.��쾴?�8X�vՂ/Op��!�f뉯��l��|��k�Zg�w}'=r=�b�c��Լ��8�{\o?m��ѵtr����Fz����p�b���䙐�UB+$dH��T�o0��EgNe���6���*��v���)Nh����N͖�*7���znsK��Iƌs5�ч�Z�@����t?��JXڝ�Ĥ�\�(+)���w?$5�p�d��W>䬁�ڝ�VT�	(ڞw��P�
���`<��[r��	���ږ�Eb�C�w[�T� nd����u���S�?��u��'(B�+�rqt���X#y,yj5]+��$����߇mm�
N�:ڇI݈�u��G��e�O�<����aƵ��p8#NV���XFF���}]�^6��e5�p(�r0�x�4Q��'g�E��.)���Ie�����R-Z��"6[U��^i?dB�5������͆_��7�x�)�\LSۍ).\��l��"`�K����n��!����2}�@�"gUߑ��j��'�h){G�Uo0�-�&����_��Z��$��Ŗ���3A�j���=E�����ф�L����<�r\ok���o�O?���e�S6��E�~�!�/�_�V��B�hY�[C�%W�j�#�,���D�R,�ظ=���I"��]��5J;?���}�\O^{,~y�{/gj;�N�g�Tl��yx�=f���3a�,�b�~&bY�C���s�A=g��#!젪���^�
�\ɖ���4ܛS�!�����ƃ`R'�Y��(�2����xm*��<�T��Q�y�ͷ���
��N۸��ɾ5� �����AP"lJZ���Z5ĦD���ཬa(Qt��:�
�՝Ņ�~��둠�p���[����b���^H����d_3�ĝ�6�z��w�]d\X���/��Xm@�B`�)$kN���![��\KB?x�����.g�$Q���]�=�zn\+�K��Ӿ�͵]E� 3�V.�G����C�pn�ɰK�B�v�k#%fx&��nJ���W���y����#x]}v�<��W�j)�{G�Cp��Yă��Xَ�F-�7�N�s|lD�7$�9ig���M�5s��%iZ`����7�1�RX��V�������;n@��(8��l���V��&���*H�I2�p�w]�Bx+���J�FnH��)!�߷4»�%7\�!g�i�����ȃ��~Z���!�p(a�/�KU=����ڔ?7<��|@p��П�����5��]�C8���f�~΅-v^�N��XS�%gV��s�ֽ�@(1"��E?[H�\��6R����N���"w��l�~�9�cVd��a�ڨ4�% s�lO&���3�N�P_�0��6E��0���1/�iZ�t�u	A�V�fA��y�C
�]�=[!�����Εg�=�NY�(�$J��)7o	(Z��s%��˥AYn�k��w=��/~ʃ��s��g�I���a�qu{�xO��>+J7<�;�I"���.{_�B�Yrz:��n���cuO�VP>�� (e�8�I����R.ǈPm���2]%| p�N���-:c}��l!���(��~��3Z.�ùs(�qL�u�{�5�P���h�Ƽ�dM��#;�q}/��n��ŌVE��u�D8��F��]i�6FƮ���::l6#dWݺp1 _�(����t�����O�{O��pQ9�/7|H��0� SI�E0��+���p=�(�򁘦F����Y��X�9M��@	�Yv6��7��a�ŏ���p%Od���}u��Q���8���΀���b�n �  ��q�;}/EzaկwjF�FJ��,�ݪ��e��6�\ڕ�!to;���9ή:OL8d]A�����6;K֢�G(�1*�֦�����Xl� A�HVjך���J2+/|�I��#��P����E��m_�)�� ��k�_�~��7Nq�Mn�fo��6r�m_�c�r�]3
�Ê1�DjSc�c�:��|���6��~��c����-"����Eu#��\(��Ȋ��'�:;��i��� (�V���Ӱ8�6~9Ќ�¸@����t[���x��N��Zm�o��76� ��H������8'��02��į� ��R�X��Ҕz�p�ɩ1ף������O�c[���g��׏�Kꍶ�7���+�͢�ǌw��iȳ%r9׺��������c�;�S5�j����HSfr������~���o�h]z      8   �  x���ג��������O�` �]��������R��H����{��O����%F'D>n�� n^Y1����Oz�,`��!��M`��3�N��t�rg���`���0��}�8���'�q��vr�/��$��/}-I=�~�/l,�)�&-I�juͮ�pG��Q���	��!��@%��>:V��������c][N�k1�,�����h�>��pg5���)3W�;<��?��l@1��M��2d���J*�OG�ٝ���<qw���x��t`��H�^���.㍓��Ҝ��y��?Av���� �>�-��R��Y���̕�@#���|-�R���\������,HЙ�\��cW��Y+��$D�L�04E
Nw��D����4�%��T�L~˯x����(��Ë�Ⴜ��j�ڰ�����v�V���*7-Vi�(g�팢��)�{�Y�W8ͷ�C�h&�:
½>N��j�Z���>�8�8jD�*q��o��}~/����U�F��TG�V�&�Z�>Z+_�>\m���>����y�n`?����(�l+�ê:�O_%��ĝu>��4����7k�{�>W����J3T�!W��X̶�n��fz�u $/�� ��a$����q�?�,��C��
$�L���L�6&�0އ�>�����t��Xt/� q&Ś��ab��g�f|�Y���!c��>�0H"-��d[����0k9�;'�:x�s���}�|nJ{���-�K���~f���]����S	��ɍ0�����rV�� �N��i�C��q����v�n���?���;�+%�E�O!m؁� ����V,��g��<Y��%?����dm���OL҅��n63�\2ƹ!�vj�aa�,�P�MT�͇�u��)M��f(n\��Bd^>V��c�!e���Ki��O�ƱZZ��a�g����v>���e�C{�_T�i�o��O+��Ua<\�6��c�y�qT��a�N�i'��8 9%�2��j��f)�Ck�u�I����H%����� ��q�2L�c��55Sݡ�u�0�����4���1����ck֢֡x@�7a��IY�P�̚�elSO��6���-��Z�h�ִ�FT2����d�jT������>��HMӒ�S�)�\�!�򍚖'�z����"���t�����T�%@[�1�s��n��rvM!N|x��-H�I<|�DR��?�u̼�*�R�D�v}������H*X捻��4�M�O���z`����OZ��Q,5��PbXRD��a0�-�m���E+��?��r䳹��ut�^���7��^�Bk������i�P�����^p�j�/�V�m�%�s�&�X�ɫ1{��w̬;���&��l�K�q^td�P$�Y�kI��jQWi=>�n1��{l�*���P�2k��ωݱ��0�7W7�V���²��*��p�Փ�,@I�۫��U ��)��	�S�^��xhN	�d��r8ʯ���2�4�Ɇ�ĖH��9O�����v����B_�*}�|ؘ��U�1	�=Xz7�u�]��a/\�0�㹨�6�]�2!O7�s�[	L��W�U� ���`�'^/�5�o{�T5��M���?�[�"*KS+��k���W@�7;�����A��<C��P.>S�u�QbYsf����"��W޷N�, �G�_�I�oUq�d0����U��h��V�oiv��VdV��ێ~�_�Ez�Y�sȀ�Q�\PUv�� {ɴ�}c���BjO���Q�XD�R�f�^&�1}$L�7�fK��k�_�:W���	�� uk��
��	򹿷��j+��g S[f��U�%="�7����>��z+��e[��r;=�l{����Z+��̜ص����,��}P��l�4ZԜY����x�D&'(��ؗy�񘏗F���X�;9�!��N�vJ�_��.���
��0�G=cIA�5 �~���b����~�=��j.M������;��@�)�ij�o_���C�V+�K|~RR�^�S>,C�G�J�iq�Y�;�8k�G����x�rX��ZG���
�3���C��#��l�ae��e+��+tE��t��OĄ6���^`��{ъ�)�|a��3kƍ�G<���a;���6$Z��=f�"�D�)"V){�f�lE�6<!���h�ܻn�]�!�9� �G3n8)�4w��q[�Wo!����'ʏJ��ZX��|@S�A�D��H���eQ��m�q�d�+��E	t�:7՜�?�=ܐ�ld��"ڭ��J�@��7�!�NԎ�a��V�. F�9�E+��-���@��)g�Q�m��N����j*�N�ol[�fa�M������2}1���E&�N[V�+��!K��N:ca��H\]��"k�滳�(��@g�u��$2�"s��\m����WEiy�(kkGb�_ɝ�x��h���*��xL�N1D�H_���[�7�%���d�V����b���R���"��o�ZiHCW���"5M HY���Wa�u�[����*���ZO�
IE)j�C��"e�
 �󇓜b[A�'�{���YW�Q��m�᫒V�W�a��)�#݂�{8��v�A���,���}=�s]�N������06��H����z�Xe�P�ć��1Ӷ����d�M��R��FR7����^�#`:B�*ڝ*e��.��|GA�=�Ӧ�2�b���uŠ��&:wC�YV��Hyu�3�{�;ׇ�`�u�FY�ч3�g����0.���i���o��)��"઒褬Πa��\!;L��3X��'p�;��$��_��W�_���&�	��H��!�h�5=����BxSק�y���JP�R����3�����m�6=f2w�������U^�MN����+�o�>�]���0r_v%�Gƃ�J$�|ř��=N���x�o���ՉEn��EV*5��zLX~�:�ZX4K���^���C5���n�#B�&��FmtY��=L%�̍黜na����V8?O}Q_=\���"O���պ�fw������q�����<~�'�5^��.�b	�{��g/��AU��|K�3Sy���z)B���])"7����l��);a��"���-L��7!�[Zk	�J�N������6��.B����CR�y��ݱ��W�kX&g�m�O��Vqh��
q��x�l4�V�uO5L�0���/�%�/���B!���۬k��e����7�W������}�2������������      9      x������ � �      ;   �   x�s	�v�J�0�O�Lv�L6��M*̊,3w�L�4�4656��1�(�ʋ̮p/
��4202�5��54S0��22�22���,NLI,���ʲH�06
�2�Jv-6'�Xc3+S������*SNNC�u\1z\\\ g�1`      <   �   x�}��
�@E�o��P�:�;IS�,�U�Pcd�X��W�@*Z<���9��F&��.}�k���qW�8�� �V�w��
e
H)5�G�wb�Y:uu��3=f�:��2�'�j�����������g�B�ܳ{�@C����`Z�ߪ�2����˵9_U�޻y�����a__�B���IK      =   �   x�e�AO�@�Ϗ_���f�.](��1Fj$$���Ҋ��Z���-6��03���e��_��&��2w��=Pyt�R�6�>u,�Ch
ݏ_���tݩ��u>�9�i&��ue�,�fQ�1���*D�*C]Ӄ�"���G�p���o'�@����͛sҽ��7V�ژ�0�{��I��v�o�z���D!NL���%C��������n�y�7�MQD      >   �   x��α�0���)|H[[�l��H��4.HBP��O/ĸ�8x���W
�*^H��Iht������';K�d
w���>.Σ\/�ک*wH$r����3ꚲY&��2P�4����X%�\�;�:�:6G�[�Z�o�b&��
�m7�����;���������_B>h�����P����4�P�U�      ?      x������ � �      @   �  x����n�P���)�4{����p�R���D�Z�
����Ӵژr!�� a���f���C�@�9��aR�R65�,��w�Ѿo�=�Ե���˔m>!���>�� ��n4��fh ^��������<_�y��H�U{<V�Oǡ�BT�Hw��DtE��ǒD�u�Z���1�&5�e߉���$�<�R�^���z��⯢C�ѣ��p�"s��z��i���t��N��d{_�ȋ�-
l��BA".Q�EB�z��0ڏ���ٯ)����.������,
e��t%A��4o�/�]8��%�"�KL������7ٰGЭ��l��wwr�F�%e9R�Y4�8�@��	�TV��8_��͎�޴;�L�d¸�Ԝ���
u�ί �{��f���Y�x���g���ɥ��ܖL]��M�B����7	��b�я��-!j[�rp��E�J.�\���L;ח�+�k�%Jݖ ����M_X��ϊ� t�4X��f�m6N��n�J�bؕ�uh���b���5�\�SeƏ���S�2)k�����[0��*�����6ғ�E+�:
�c�0[Λ�2�(��px�����g�,��)�֗n�?��tMY�Yy�q�Y�6����͍�%`ߜo�$I�oS,      A   �  x���[s�0 ���+��I�p{�\E�/�"�
T�ۯ_��ۇ��ݲ��K2�999��v�ӣa;�`�G�^�5"�ϰ	 ���8|��z|�L/m�E��a� �!���'Dq��4n��&\0������(����r�%��p��z�)@���e7Hq���W���aH)�<�I���,d�9N߷���:A�4S��� ���,Q̱Xj+3mb�'U��5�/Dܷ��(@�mjo����f��?�nP���^��{�L�LP)	"�9��@�d�^|?YĎ�� �Y�F{�C!=v	=~f�����.�Ua$$[���k'���3����J��H�f%U[�8��l�	a�9�>l1�ae^�.��v��p!��22ZW�6�cʿ�O�=[w����)L9��|�	�r$1����Yz��V�v!h�(�u�G�n��h���k����!~����"Y?Y�jo���Y*vN 	�ܠ]�h�i��W�B�}���_U�듮�4ZZ��r�ک2ʥ�R�^��0�ĭW�N*�JL��j����n�%���Nr@^�%���G;6�|��4����ub���1	�F�n�Ó5Uw�5���2'MPiIv�VY���ao�Ty+	�c� �&�4PTOL{�����;A~}��f? ���R      B   �   x����
�@�׿O�(3:���(p�II)n4+Ӣ�BO_DB�
:�g��i���9ge^��r�Ʌ�v�sE`��g�]�F��;���Qn�#������0�rJ�6������A�j���U�f��Ǝ���8a��p�w�:K܅���fjX���ؖ�&{��`��g\'�0�7��~(���(l�Q      C   �  x����n�H���S�f���`�3'��c0���l�1�lx��d�;�E��"P_��>Uu�5���!�I��W�N�WG��A/�|�E�a ��0 �÷��%dL'{H���� CL��7�<#����a���O���0}3�VWA#7{qC?�wU�����H*���O6*��{��pf�b�lo���i	m'�Mhs4�ѱg��\�hM_rZϒ;��"RqA���x?�ax��ɨa��xW��b9>��W�ł���1�)C�Ĕ����Y�-XF?����$�/wsU�]R��a/�Z��jX7lǋA9��,- ��g	v��jۋ��o�}F4����w��;��8b�<�'Ŋ,u��kM`��g�yL���>���y_�x�_�U��3	2;��Rf�-�$��?��g��	�S�������ݡ���R�l��h��!�,]�VyL��o�N���}��;e��;ϟ,�y���U���V���.��Jc��h�`�?�M�6��Vy�~�7C�ס��c�:ٕ��bmtT�)����j��뽡��1�IOk�T��5�A{��aH'����V��^B�=QrK_ Jf�I������I��Z��t��n2h�B�Y�a��G�ӝ�ɯ�q�@cW���f��6e5��LU�u"�5�ʾ0ʓy���j6�^�/7�*�';`&�������ZAQ0      D   X  x���ko�@�?����f��|� (�ؒ&Dn�w�B�B�KKH&��yx�{��j�X<ק�;{N�fl&��хvg�g��0� *���c�-��:���J{r��'� "M(4��ǋ���W ����R��!b�;.�s���ֻc��8���*g����:/��5?��8����_�c"���wCc{\G67 g��㖏]�Z.{�p�F�W��y"�qsm6s�g��琴^�Þ[=���W�@(��R�Nv��O�$��7@\�=p{Fp�qGR��o��kܔ&"E��a����̖)��w���� ����fF�N����C�L�[N�����:�fVYa&BV�˳""���r2�������n��ޭA�*����U��� �p��@z?�f�p���0� �3-&�7���or�JGA�	��:UϋCpqh./�-OT#����p����s�[�`>k9�sd���e+���M�.�#.��~tܜ�}3D��`1��:e�^� �%m��:N}b%(OWAlk���h8����S3ύ��c��B����K�DJ.ri\w�&�w�dW!u�z�T���c�������      E   P  x���ے�<���)|�r�*h��bk�"*Z��'N�i���ꟃV�Rl����vP:�NU}������7�ҿ�@�X	�EHU,�!}w.��@�xX��/�$�Z.�;��fת�Qe�d�Dޟ�_M%�>��%�(ת�Ż�͉U U�>jJ�UHo����cư$�Qmr൲������#�;���)�Gw��z�� E����*-�EnO���ҥ%g#�}�=J�U]�6����K�!�_r�ET@��y�,ZL<��T2�x��<�q߰�!$2���9>0�O=�|W#��o�OK��nj���6��(�_z��oW�n�;��X��iCE%$W��|��R�a{�N��[�1�@��mT� �Z��8��3lY�#C���1 ���6��Wg05I;[5u��������k�?�#����ý��ߐl%Ma��f�ժw�C�0jȭ���ܡ�Z�D&�_�B*���Xݦ��T��Ɠm�i��_�<h�u37�z6f>��3zȻ��p�?j�%�/ι5vX��i�G���}(����,m��v�X�)��g㣌[;w�h��!YX�,rL��.Qs���d[ۙ/A���W��=�?E�Y����ՈO4iO�q��Ƶs�4�1ć�^��|��X�m���<J+��`,w'�&������A�TF�/Я�}����}�k��`�_�P��H�������s�����[;���0&�d ���nя��"�5*����$0���֚%x_�zԄ��D�K��|�/��IT
s'v	0�nO@LW��������,�{8ĺ����/�ow��G�%�����s!�O�|�ۘ��#}��g�7O�_1��[�P�џU�      F   '  x����r�0���S��$!�ށ������8�X)J�>��=�:=�=a���^y5�IHK�[��OA��,�7૖���gX�=ƾ`��C�u`�����PG�
���$�
� �U�'�t�gs��Ôe�E�и����'BmBy�7�GU�.Y�$0�N��G�cZ� �YH��G��W��Q��{��q噻���
�$��>�a:[Sʲ���g��K�����t��	'�}�
	��̰�a=3�+U�]�d��K�@�A�p���ɡN����clq�n�j�\���Ÿ���B���/@���)T�<��ֱj�'+���c
T�6;���˅�}zG�"�;l�h�8�P- ��ׅ�MKtn��lb5�NnvL'6Ð�CsU�y��������V�c�2L�D��HӰ�0�w.���N��̂lo��H���F	�$O�[�n���1T0�����K���5���ʌ�=��G�e�НN/�~?�v��c-���MД�"���_Eoֻ櫈�XV��S|�gq�[����a��~��;�^�oϵZ�/��&      G   =  x����n�@���pހff�a�"�!��h��A��R���WC�6qa�Y�<��Vd�:�S����r>��G�pb�^� ��0oY$Y����y�b2��I$�����@�.�־���1M�=�x�X��SD�o�e7ʹ���Rj�9+ۻ��O�M��D�D�`�b}�+��L�����#kJC��մqߍjlo�e(Om�ܱ�T�E3�2c���<@D%T��?[��f��Y@�a�f?��J/�� M�9����5�cI���L�ֽ�)�/�*��(?��~�y#�VNOq�y�$�ʋ� !�J����	��+�O      I     x��S�r�@}��Hjn�0o�T$�D]�R�R��%r���/l���%�U;�CO����i�7!v�����T) �@��&3����Շ-����GN���_V���xs�	��3/��e��<�om獙>2E�in�<�P�t�v��Q_�1����5D99a%��E�# �a~��� ���������Us���ك�5�8�9��>VC��:'�"�(�Rh��5t��	�&՘��tH=����DʶF�6㭡h�>A(m�X[�^��i߱?S���t���u��R<�8�E`��&Q�Tg��C�>W^HN\)
�L�~I�P_6փ^>x�/�vNH�!�)����-\;6(̽��>���4q5F�e�j��'Q*0 gh9K+�A��c|�߯XRC�RNYeVw5~	����5���P!�|?r���9ڠ�����M���]X��t��I=M6���|i���|X��;p��З��"m��X[����<\�.�O�_?������O�P>�N��{A~M��6      J   �  x����n�@���)|�6��,��	�g�h$�X�TT��O_L{QKڦ��l2���?~d'�*4�vQ���,0�k�,F��2��kd�î�,��+D�qU?|�A~����L8�ha�{W�cIR̦>�z��p��L-���nԻ�nM"�I B9���Ìqs�ot��"HX7qSg3��[8S��g��=$�UN��C�nF	ح�sYA^?]N����&[�D��8��6�D��������p�r��T�Ŏ+���}c ���y։���U�7k�%����L�q�|�7�nؗy�n�C�QT�e{*z��D��2Ba��|m��x���\���!w���R��t�=�Ź(\9h�1�n�fD���sc�֪{>"짋���ܒϒ$���u      K   \   x���p�tq*3�7)��7�O5�H/)7-.0���45�3 8�]��h��U���V�id`d�k`�kd�`d`elie`�������� �?      L   _   x��Ju�r�+ά2�L1�O5�H/)7-.0���45�3 N戴D3�Ь
�t�bN##]K]#s#+#+C341SS+c3N�=... �@p      M      x������ � �      N      x������ � �      O   �   x�}���0 �sy
^ m;����%���BL���o/!�h�v��[�u��U�1]�?^������C���T�z�,�#�*�l��#�C8��u��24�� ��,�D�{i�2|yI��ezY�`�G�laC� �;����lSϟ�"[���]^"����:=���+ѡj�7}��MӾ5vE%      P   &  x����S�0����W�oCco%��V�q�Y��i����w���Ҟv���~�o?�ً����M�y#�
�:&B����T�y02�Qiٷ�8q��A����qb���
f@+(&.���1�"���s���&�ݽ�<]U���Q�.�y� �w8tj�6��L��?��u&6�T1��]*��0s^l�
��R�|y�b���<-��]�eқT���#����0i�wɌ�~��:��UX����&'��^k;��~7�?�p���Ο~塗����v�����(������iߔﴃ      Q   �  x�ݖKs�@����p3KS� v���H>*A��~�D&�Hԙd15,h�u���{h�-��Jb�(yjF+!f�ݦ?a#��]�$�ϛ�A�������KP�Vv����;H/�_t�1S�B	e�E�D(�S�?k���P����nVؚ�p��x��DL ���e{�6��2ni{EQ�z���/��R_��¦�FE�Rh�����28f�4LUd�W��Q���]Q��?�A��n���p7��b�hk�v/K@�H��QUd�7x�����S������6�����ݮ@{�W}���A�tp�r�m�1��bxT���8)��	�iF���[���!�cy&����|�H�4���rE���5F��(�*ehZu�	Q�q;�hT;�P�S��7����42 w�M����V'��Q�B��XA	���6��[b ���.���S�h�]�E��NI���WF�H���qj`�JP�����)�-Y�Kd�7����_E[��R�����
�?��jX�[�.T��.�?O&���/������+�ļ�Y�+Ȥ��x`a(/��ngO�3I�v�v��"�2���<��#���3���{�7I!q���������<��$�҈c<�v�@���JWם��F��0�ao�v"��������|W*�~G[=�      S   �  x�͒�n�@���S��v�e���f��Ԅ5�R`q���`�?}�T	U9D�E���7�4��������aE����e=�~�6+��C��T�:�w�F5���*/L.���<g�<���#�wYc�:CΌ���@�x���0x]��>y;����I3u��A M�ޮ�x򭢕>�	m���ݎ/4�\�s�DXY�H�����+O�/H�p�	-�^�4'�v�e��v~��t��|=z7N�4�#�u��j���u}��� �/>B:�5b����D��'�y��`~����n/�q���>k� ���`SG�/z�wQ�~�
��M���#�n=f2NX��I�o�Г��Ro���
=���c�~|�4�J=�j      T   s  x���K��0��1��7��@a�bbb�G9҈��m��ܯN�u3b*�T=��u�0�@�O��wRu�s7����Jn��jRe �1�A)�s�<�0,���>� � ��lt�g����c��!��ȵ9�]m������G������]���ήy7q����7����V V������d^l)��v�Y-~jg�߆η�2��3�5�q��F�Y�T�t�gk\ŧ��c3?s���BI �y��4ýZ�1�'-������%{)�r�r�����#�m�t�����,�t���r���tL!ԋ�<�6�_�
�JbWHZ�.��+UE3�L��̣f=͢�7�<��2�;-���AҰY��z�_P�M      U   �  x����r�@��ۧ�dkN�̝Q@4ₕT�h�O���֮�![5S}�u����?X�Qg꣕o'v �n�Cg��L�AW@a�H$����9Vnj*'*�`�8M�5�Cd,.�i����Vev�^ޯq��0��%�T���=k;ܔ�TB8������|�˷�m���!�=T' �-.���ӽF�<S��p]��P[�̹�Ū�pE<z���Vbǣ�W�g�y�����f*�� ̑vS�9i��8��Cٸݬ���>/�8|K�� ��nX��q�nv9v?s׶�D���t5X��X� !"�5a(n�f�4�����=g1a���~����Ve*����A\фR��q+���O�$\���ʷs˸q��J�*HMժ�13����Ɛ	%�@q�n|S8e�����w5�W�;̋�056�/6K���rr��	5ǜ�6����P9���+�l��>D��jL.&�5�^&��G��� ��=      V   �  x���ے�:���)��+��;	��57 *ض"O�՞��{tzvWST%���K��R��h�E�AᥱeR�-�Li�e�jDq <��G�; ( ��o�{bX��G}�)j��u��_Т��a��uD������2ڻ;�c�Ȩ�5�������Y|�'�r6o�9[�oi"�,�c�����k�F��t�{!)�6��`��q��RP���5u��!�s����E��7z���U�!7��`K+��̶�i9�m�~@���C� ˸�Եe�*􎑹,�A�h w�l-<zEE�\8�'�ǄyF�����xun�z(8'��4%+y����͔���d���q��,�Y0�	���xU��E:��������(w����B����{[�6N���j��!��A��g�	(��SU)b���x\��v��
 �����,C3�'�^Ft8�]0�@r:�,�̟�,��eU6F�Ô&R��� %�p�R��`N�󴶚�b��]t�c�eD�-��w$yZ������RA�ոu��/��SQ&d?��`���D[ae7^�Z�������B��9-��\:w��U�M�j����?�}��va��
A����~,�+)&�zt���~2��*ߝ�Fu�4��K<
�\ٵ�D'�I�JJ�i�2�S9�"��.\{�"�ֶs�e|"Vg�=���
&]���pϾP��}?��C �@Dop�YTa�][I�w�u�1��i�{/���)�a����₦����\��c�8�sP����sEZG8����X ���\�y�b���m���߅=����.V��7�Ί���9^�{k�%�;͋T ��Q�5��s�Q\N�^�����ė��ZCO'^ep�Q�@8y��\�p���}M����L��?��      X   ;  x����n�@���S���ˮ:H�b���"�u���I�tcON�'�$ߗ?˙���>�q;�`���e3x���r A"�n 1��)��tl��e��K��>"=�J���M���
��0&�s��<���<n>պ��M�-c�H&�?D�2ۡ����K�c���D��p�@k�:�/�T" P+�Ksᑸ
����Ur�<��[U�Uy4���	���V_�~Cb�+ � l߯��Ƨ�q}��=��h2 n����y�zn6V��4Y�Q��A�K��Ҋ M<�5I��*)=D�2�S�� �A��      Y   L  x����n�@���)x�̰ϝ�%,Z\�J�!�"T�B���McS����?��On�ycw\6�� \5���Ux��s��@�v�>Q�EQMk�ZQT1?�� �,Fb� �LSR�7L-����i�+��ݖ�@�ћ[�ݶi�/�U#���[TX�ЊR'�9W8������!�h/��<)�US큌�c�L8H0��M�	���r��-<�z��{5p��?��'�]j���d��PV�{= ܓsՕU���8/'�'��Z���=��ۉm�{�=�1Q"�����,6_-����n\��5��&�΋.d/�u,̳	;q3d�|>�      Z   �  x���[s�0���)��I ��"AE���E�T�r�����ٝq/S�y�L~9���yۙVC��ǆ��鮈M�N�B�N��8�`�ߌV2B#i~5��-�F?/X8��G(=r��c�	x��@p��w��,W+Pv�4ZN�b���w��S(�<oe�ٕ�V꘴���Z��uU>{�4Lf��9��Ὃ�lM��i��n�sG�C� ����8H	���+�M$/�p��4O|Фv5erqrr�E� �tC���X���e���bQ��X�V�<�xu>D ��k3���A��]`;������lsG��I�<V���I��H9\��@N$ޫ�"�/��`n��/�<@H�Dɰ���G��K��#iĺF-/2�����od���f1W��#��>���Mc���7�h7��Gw�C�K=W�/8)VR:��_�K��]�'I�F��B]<��{	\-����+�k6��OF��@�k��}�����p�m'7�y/OPϿ>�o�l`[      [      x������ � �      \      x������ � �      ^      x������ � �      _   �  x��XY��h}&�'�;����&��& ��٧��.lB�����՝X]jf����� p�ƍd/�I��ڐ�F<���I���m ܌Sw����� \�OT\+�.T�����F�3R:�5��m}�.��q��{����,J����^r>Jȩ��b��ciƅ�=���_������:v�8[ ;���S�y��vjg��'�x�����uG�<o|s(��3=��^�^�3����`���D{>���cJ�r���C)�"�U����B���@q+*sܮ�K��ia!�� �#gn$�`�i�ΐ0Ys�x�ɦ��Cp�~1~_�隷��X��~ Kd �cl8���c�h�$�9�����_���A�zM�Y[��M�N�+�<�6���r(���u ��uM�d
�.�� ����l�0�Di��*|�)iZކĩ���eP�0��΋�DX��ϰ�"u�i�x�|� ;�!�F.���?�D�B`��5��W�_���Ft���3
�o+7͙���G��U��FF����=��g�3��Nx/�/�pi��<�$����h �c�R�vv�7��6%J��"�X=�#�<,	����T��H�S��e_(�M�e$�JH�U�'@�����p������
#��	E�Ë��"^�#��3��q�)T��Q���¾PҪ��+�K��F����t���v������kI��X��p��6| �cd4������Y����";=A�{���6
bl{Nf+q�eK����Tʋ�vs�@�H�!,�0�XgZ�Ѐ�b��P?!�p~:/�!�WE�h+��?���.?�> �w6x�9�
�U:�\���ӓ&6wIB�g�udXsW����`��(�2Ҁ�q�̯2��x��\l����
�H��=ri�q�\�"@�3(g�jcX�.��T�]S�2K4q�;�Ѹ�f��I�Bu�#	p�7�|[QpM�9�/�C���ȟ��dZ�>�����D�j��v��,��,D����w6�.XU����q ��tE���K�GZ�:}>��L]mѐ�w���B3�)vjN�%����k� ]���c��>���B'COX��֙�om��̂X'���V0ΑT��$۫�����|N0��]��G*�
u}��0�@���\@Km��q0���u�!����M��T��$Mi���Mx����m��t�x���e@/�"�������9;e�y,)nu0l�����nF�� �댢�E=m?�Ňݗ��у���Pq~a)Tm0�!��y���[�y:?m9,�]욤c��Њ1�u(�Hbŝ�"�~6��9����#����B)�z8;Quk��]B�T��Z�C��oVm�A�f�[TI7s�����"�gqว��,s+�?�۫}�2�K����v;��GN֎#��݁vu�3�/�ף��e��{�vݞr�\h��j�1����_�@�u�i*���c��v�R5�����L�p�}����1������<�,E�ڝ~,��Nߋ¬}NнR�������aC@�H��+ݵ�Q]9�NK�=��P26�N1���Ok`?���.��m��.�C]�� �?��U�.�~�\��Oc���3����������#)��|��j}���X���p�e}����<Fw6�,����ᕄ�������k=�K񒧘�䃣 w/>G�ˊ~g����w}�v���?r}�ې{��������p�      `   Z  x�ř�r�J��;O��E7��;DQ0Rs�� "���~C�h21��LM�@Q��s�^�^i�Fv�mw�Y3�X9k�U�$�?]��	G�z0��Q!���VNh�C�R "~!��=C�JqU~x�U	T�\��_�S\�z{>��M'`�)����l��O6�h�Djtk�!�ro��HC�L�T����D�3�U��"��i��ߛ��V+��t�� �1�� ��4�R���6c0�=<�L����#Ԇٟ�0�L@*s��^@T.�3/����"�
q��i�L,�iz�Fua1�1���]QA�a��Y��^dʯ���yV4r�Lnj�Z�f``�=�3�(�6���E��!s�a BD�*�><�����e�ɒ!��^�!�J2�/FY�Oێaž �0?��U%�*I]�����$=�ā"�.��X ���"��,�EKBW8TB��M[t<�Sq��q���L�r#�q�k$�W� `��� ��%^��Q� ȥJp������kzm�0��P�~�G�+X��� $A{j�P�f��BЙ4IV�|��Va��m���a�N�4œs����i��"H�R 	X2��Hb.ɍ+S��(�t���¡����*�Ř�7\��<��Z��u}�,�tY�囉H��`+��'�~\�L� g���H��4E�=��E�N��|$���C�5H����� ���P��n�s��>���b�k|��E�rj��7J_J�ި6
1�׌�1������ߴȹdn�^$
8�};&�<����E� ��6�����!�*����+��h��̬�N^QɜQ�uo�� �e!��Uoը��_뒹.��Q7���G֝yL4g��@���9�[�m�v
�N��?�r�Z�B�%�o�a��<C���Ux��S;1����w�s��=t�)�ap�]ެ��5u<���ii��>Pq��O�?�ћ�ɋ��G,�g�T������l�5��⢳!<�;֚���x�}}���`?��^<�=;��-&U����d��w�5���)tV���[П�s��_t裩�!�j/�t��"K��AL�W��X��`I����%�O��ֶO���=B1��N�J�N%��m�������|%F�N%�1R O���Mo��_���S	bV#~m�����u��hXR�o,Ð�α�>��{b��CW)����|Y{�����Y-��q:�'����i�ܝB�΅ ��ѿ��#� �?ڈ���&���%Ϣ�b�����|��M�f������u��)q Uɒo��)A���o�M�a������%�(<��Y=hӽ��
3F����:]A���>�9i����-��0�e����!��%�|���{q �t�W�a�Ze���]YI��R�m8S��v��An܁�2��IdG� ��p]��&b��@���Q>Lw���Ն�����7���F� ɬ5�%0Hc5�F�c7|�	K�k�P[���RC�it��`��`�[��S�����9�2��3���e˃�m;p3�tF����`��� ��P�视�q�K��ا&�v�@u��ޖ�0��MK��]y��=���L��s�l7C޸Kc⫮Qpi��H��4��͵���3�㿢��֪�����M�����t����,�j��Hv���^C����uY>��傾-0�_�~����VmL��~ ���8�O������V�h&oh>��?��3�ވmq;Yl�]�E��& Z�>�~�r���.�č��2�&��w�wo��7��Ȍ׶GMFkB3wPz�7A冀��D5�+5�Y�k����|��?6��eٯF��t��:�{�W�D���<==��.5      b   �  x���Yw�J��O~E����� oFdPAp��� 'D~}�7��طW��f5P/U<|{�>��6���m�+.Φ"��3�� �m�4Ǡ-6�;}�-&�t�E��$\�1B�����h}.&�(K�B��v�V�}����'��&
��J�p�F�@	e�l��̡�7�{@"�H�<X��$�y�R�ۡ1��Y#Ӊ����n3��d�I��B��v�0r5��}�.Ȕ��$:��8��,�_��Z��}�@���Tk??i�g_~�7�ɤ)c�n���O5��@�WE����W�#�*<\�ٞ�:�4�t��>ͥ���-����-L4��:���V��jIP\����F������2E�c�E��h��?�g6i��=����0�����2�9�}*��^'�ʌ����� H_(����ҵ�I��KA�EA��6r��.̗���*�e��
$��7
�1��rX�e���>�����K���� H�{�D�khގn�����ܞg�����K��wfS�JYǝ�;�J]�Ɠ��Ds�.x�VZ'�Ej��r���V��*g��Y�Jl;#o8�@7�ڦ?�Bt�.��u����fX��?�%J&�M�������{�(�X<�gc�X9%\[��F࿋?oq�(|=zu|���m"_�'m���W��Tv
( �F�
g׶�I���c��SιHΎ�ғF,���QD}�[UI<�h�X�ᤌ��V��������+��d|�����u�&�      c      x������ � �      d      x������ � �      e   m  x���I��X�����/��RAD���AAD>}W'��S/�z�]�_����r��jR)X4�E���o�_���;���Od��O��I�/[�j�:R���8��"s؄��B|���j�Y��ܬ��6 ��ȣ}�v��H�H%�k������(�(m
����J7��7���ظ�2�^��:�N��2ݤ ��q#��|�G/3$g0��%޶`O1����CN�Lw�f �)�d�J����A�n�x,���q�tc�eѮ)� �4�d.�-_ݪ {�B��]]�X��{;��b>�a�Ӆ��R4��h��~Yݠ3�m3�to
C���6�zs�0�i��=Vk�Y�7�v�w�? �1�����|U��I&�^�V+V2��;��"C���du�s[����� Q�w����oŝE�H�0m5����=��ʹ �M�IW��y�g��Z�u�_�W���i^��=R�7���)���:���� ���V#S~��&�iF�hN��B/�]~��5I}ص�Փ��c>���(cQ��V�����Tf�=�����NF3m���=ֲ��3Ҿ�oe�~E`�u�����ݞzC�He�a0$6߆��(�_�8�~��~8�����{�����E��dɏ,�L��,�%<���J)�K�UAlF�@�5�vF��V {��l^+���c��:��)Ƃ��Q��q�\�r�)Ƣ".C�KW+d {�~�vC�2Ͻ*&h$���h��j�Y�b+l��-P����8�O�j��m�Sӕ� y��?��@��LΆ[�z�G�;ڂ)�%K�)U:`�T�%�e�e��G*{[~_y�y'��=R�:ɹzs���ߺ%`Oq�����/���A6g�=��{��1�ȗ��Ȝ�G*{�V1}ւ{�U�R�+K�����UR�}41`O1Ե�7�<x>�b�#��ϕ��Tuӻ��F� {�v\ef-Ԑ[�2`�T6�co��D>��}�)�-�I�-Y;�=	�Gj�#�o��ws��{�������U�k��(�u�޴�٪X�G*�Gekp3�%��y ��xR�>����e�ǁ��bs�V�~ȂG�ŕ�?�x�sݿ����ϗ8�      f   	  x����n�@���S�$���P�h)h��1bL�j��Rhi)Oo�&��&:�I���e&h��9M�䷮��a`�(�N�4q�臗�x�ʔ���p0�{�~��~4G��u��Oj���v��V�R��e@h!�җ�n4,���uUT�[l�~&P	s�%m4����g�~��`IVf����Kk�f�)	��sޤ\[�� ��W2w��<���Ģv�*�3l[IK1؝8K���?�pʣğ�P�'�O1���P(�3��M�Ҡ�n �z�_      g   �   x���]�0���+��6����QiQ�~Ͳn��������\��眔�T���p��>*M_�E��|}�D�bQ��I%�0`�D6|c��m�x�0� Cl�꘴P�!���B��ǁE1A<�
<4oe`�uW��o�g��=NȊC!�����t��������鶼|���ͦ��{6i$o<ۺ3�0�v��4�
��q�      h   W  x���Ks�@F�ͯ�*��E�~�h��(����3R�mE$� *������EUS]p9��w�"�ߍ7�⩇�@	�ׇ��͏�AoB�y�m��������[5W�h�(�Q�[���o#��IʿY�0-�Ȋ��r]��cF�z���kȮ�""�cY�x��;�K���ݎaD� �/\�7���V� �f�.H�w"pk�'��0���������  �|�Wx�2x�s���-�W@LE�tJtB*:�(��7�8y�f�i{��C�(n^ U�'�1*QJ��l;�¬��$
k��K^n�.�d�& ㆈ6���
�3�?��]�9�vğ�d��(��[{�[m�X[t�gpEjŢ��c��7�eI��n�m�Gyf��M�I&��ȍE���T9�i"":�u� z�i�Pݎ�Y�,6V:��H����@o��?�d;˕Ծ?�?]���\�V�ʒ�)9�ȡ��G|��{a��G�msbS{ſ8yg�|4��1K�\iFu<��Y���mU��J���>�t�e��X!��i�+.4��񙀿u�)�Y�k��勣�<�%�(���1���	�=�'��9+����ߣj%^�(	��s&o�      i   �  x����n�@ ��5>�/�f.�fv*Gn�"J-�J�CA<}NNӪ��̊_��33WV�V�=�2�Sẋ$�׺�=͓]�b8 �����#
$p$���B��*��r�1D�!�eɌR#*��������'��G����O^�,����,A"q�s#t`�.�Ti��S�V�s���Dl��gv�r?~���Dʲ=��i���n���ݹ��8�X��(Xo[��1�o�q=��p(�z|���i(�W���	�'Q��M�XK+��\�B�_Xq#Ɂ�_8��r��y]ףM���`��B��ݭ��x�6��n'�|�,�<B�����wuV^n�r�jͭ0�nș���Þ�����A�Ӝe�TW�%)���}s��e�[){�YL��sa�q4�FC��׷"��� nI�y�r?�>׾��      j   N  x���ێ�JF��)��SUP��DPN�(���Q�QZAE}�Q�����ĪtbBbb��?|U�t�]o�&b��{m� �u6���:d`��W�S2�V_g�g,+UX�t7���^��L.�T��`Ϡ7 `�x<��
JI5Lwc��A q߁��o��1+#��p��P9���v;@4�/-�I�*�&�Q˂m��D��A�TXb$����ͩ-Ө�bt��N�t��8��zcN1����9G��s��Z-�ߵ�j�(�~����.Z�j���M�؛���7m0K�H�	Q�����ֵ�V$`k�8�W��_��KZ0���;N涻s�[�qI��S�����r.K_�$#��Rpl^�Sowu�{ǵ5-�园�����c�
����`3M��.˚/���zL��O0f����`p��z�]����T`^���,@���{u�E��RS���ߌ���9(�`0,�X��!�ԼP�c�Q�,l,~=^Zpͤ��Ap��u������&PY��}Z �)���؉��0i�*��QG��G���ov?�f\Z!�E{ �פ��-;(Ӄ�\�˗����}���"a��{��C�eA�T�/ʐk�""�caw��}{ 	�� �O�LpN�]��nH��X�Oe��Ђ9�GBװl�+,
�&�>���d,����Q{����w��Wj�M�$&_J!�Q����tfI�+ɶ�E�I3���d͐d$�M0��'�Qx�r�k~Mb��Ԙ ����_L��f�3}k��v���ME}/��yy�߯&j!�8C;�S].>@��E�g�"8@i��N�������8݇��[���	�]v"      k   �  x����r�@�u��@���w@�\gp���%����O�*��LR5gy_�����i��/時3�w���`-&m�D {�����g%�W9�po�5�'�]/����p�c��,K�2��������
�QF�3�)��)�]�zȋ,�#0+E���W/i8�t��k��A��|��K��+B���/�Mͭ��������T	a&C&�}+mN���\�T������8��w��� ��7�~A��Iz�%�Ӈ�I�#���GG��T�9q��K}�ǌȃ:�%����"Mo�/}�{�̠6��<^�±ߦ�
A[����8q{�	DU.�$��Hyq�y���"*aȰ�Ƚ�mft�����.��S��N�_��ڤ��_m@Ƅ��~N�aʰ2�/��h�7��$      l   %  x����n�h�k|��������,�J���"*�""��C�����e�1�c�_+�C�֎<�0�Cg:e.2H��L�(�<� �Y_�y1a��{/.��y���Px�T�D$��5d�5LzF�^���U�&�n����V�5�!xGWe�7=��\w�5�z0��b �;��le����P6�C�
�k,�"�M� ����5������7��#,�<UG�>S:��8���(l��Bw��r�QAİ@\:�C-���kڑ�?�o��#9L����U�+ˋ��6ؠ��!���~����iJ�����~b�<���vQ�o��DJE��z��oΞ&�T�zm����MȻ}�^���ܩ�I�\���tU��c��@���S�eZ��tG!��j{���X�=��o7�������@�艟�
=~9ue9ܱ$�s�IO��)����W��[�/M�Y��7d&�N�B��|�n:>>򞲎��v��I�-ۗG3v.<:Oe��5s���A]si���I�0�����,#	*����5�5�zѶC�y{nH�[�vA�6���V,���r�����,�+�y��V�G�{�ϭ���V����8��\������H,�2�����E�����2�s90<R�)��y�L�e��F�|���M��a;0q�P��i��G����F� ?��V���ogE"���~�� ̼���&Y�����6�^h�A��|�i��\)|ي�9+ԧO�Z��{��#�Y �y�3�ਙ��|�_X%�G��o���&���vV\�_?{���y�?     