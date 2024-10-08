PGDMP  )    -    	            |            fzl    16.4    16.4 _   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17923    fzl    DATABASE     ~   CREATE DATABASE fzl WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE fzl;
                postgres    false                        2615    17924 
   commercial    SCHEMA        CREATE SCHEMA commercial;
    DROP SCHEMA commercial;
                postgres    false                        2615    17925    delivery    SCHEMA        CREATE SCHEMA delivery;
    DROP SCHEMA delivery;
                postgres    false                        2615    17926    drizzle    SCHEMA        CREATE SCHEMA drizzle;
    DROP SCHEMA drizzle;
                postgres    false            	            2615    17927    hr    SCHEMA        CREATE SCHEMA hr;
    DROP SCHEMA hr;
                postgres    false            
            2615    17928    lab_dip    SCHEMA        CREATE SCHEMA lab_dip;
    DROP SCHEMA lab_dip;
                postgres    false                        2615    17929    material    SCHEMA        CREATE SCHEMA material;
    DROP SCHEMA material;
                postgres    false                        2615    17930    purchase    SCHEMA        CREATE SCHEMA purchase;
    DROP SCHEMA purchase;
                postgres    false                        2615    17931    slider    SCHEMA        CREATE SCHEMA slider;
    DROP SCHEMA slider;
                postgres    false                        2615    17932    thread    SCHEMA        CREATE SCHEMA thread;
    DROP SCHEMA thread;
                postgres    false                        2615    17933    zipper    SCHEMA        CREATE SCHEMA zipper;
    DROP SCHEMA zipper;
                postgres    false            �           1247    17935    batch_status    TYPE     \   CREATE TYPE zipper.batch_status AS ENUM (
    'pending',
    'completed',
    'rejected'
);
    DROP TYPE zipper.batch_status;
       zipper          postgres    false    15            �           1247    17942    slider_starting_section_enum    TYPE     �   CREATE TYPE zipper.slider_starting_section_enum AS ENUM (
    'die_casting',
    'slider_assembly',
    'coloring',
    '---'
);
 /   DROP TYPE zipper.slider_starting_section_enum;
       zipper          postgres    false    15            �           1247    17952    swatch_status_enum    TYPE     a   CREATE TYPE zipper.swatch_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);
 %   DROP TYPE zipper.swatch_status_enum;
       zipper          postgres    false    15            i           1255    17959 /   sfg_after_commercial_pi_entry_delete_function()    FUNCTION     �   CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi - OLD.pi_quantity
    WHERE uuid = OLD.sfg_uuid;

    RETURN OLD;
END;

$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
    
   commercial          postgres    false    6            e           1255    17960 /   sfg_after_commercial_pi_entry_insert_function()    FUNCTION     �   CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_quantity
    WHERE uuid = NEW.sfg_uuid;

    RETURN NEW;
END;

$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();
    
   commercial          postgres    false    6            �           1255    17961 /   sfg_after_commercial_pi_entry_update_function()    FUNCTION       CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.sfg SET
        pi = pi + NEW.pi_quantity - OLD.pi_quantity
    WHERE uuid = NEW.sfg_uuid;

    RETURN NEW;
END;

$$;
 J   DROP FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();
    
   commercial          postgres    false    6            H           1255    17962 +   material_stock_after_material_info_delete()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 D   DROP FUNCTION material.material_stock_after_material_info_delete();
       material          postgres    false    11            n           1255    17963 +   material_stock_after_material_info_insert()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_insert() RETURNS trigger
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
       material          postgres    false    11            \           1255    17964 *   material_stock_after_material_trx_delete()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_delete() RETURNS trigger
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
       material          postgres    false    11            S           1255    17965 *   material_stock_after_material_trx_insert()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_insert() RETURNS trigger
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
       material          postgres    false    11            z           1255    17966 *   material_stock_after_material_trx_update()    FUNCTION     C  CREATE FUNCTION material.material_stock_after_material_trx_update() RETURNS trigger
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
       material          postgres    false    11            W           1255    17967 +   material_stock_after_material_used_delete()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_delete() RETURNS trigger
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
       material          postgres    false    11            a           1255    17968 +   material_stock_after_material_used_insert()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_insert() RETURNS trigger
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
       material          postgres    false    11            Q           1255    17969 +   material_stock_after_material_used_update()    FUNCTION     L  CREATE FUNCTION material.material_stock_after_material_used_update() RETURNS trigger
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
       material          postgres    false    11            X           1255    17970 ,   material_stock_after_purchase_entry_delete()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS trigger
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
       material          postgres    false    11            x           1255    17971 ,   material_stock_after_purchase_entry_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS trigger
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
       material          postgres    false    11            �           1255    17972 ,   material_stock_after_purchase_entry_update()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS trigger
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
       material          postgres    false    11            @           1255    17973 .   material_stock_sfg_after_stock_to_sfg_delete()    FUNCTION     4  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS trigger
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
       material          postgres    false    11            g           1255    17974 .   material_stock_sfg_after_stock_to_sfg_insert()    FUNCTION     =  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS trigger
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
       material          postgres    false    11            w           1255    17975 .   material_stock_sfg_after_stock_to_sfg_update()    FUNCTION       CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS trigger
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
       material          postgres    false    11            N           1255    65738 2   zipper_batch_entry_after_batch_production_delete()    FUNCTION     :  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_delete() RETURNS trigger
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
        uuid = batch_entry.sfg_uuid AND batch_entry.uuid = OLD.batch_entry_uuid;
    RETURN OLD;
END;

$$;
 I   DROP FUNCTION public.zipper_batch_entry_after_batch_production_delete();
       public          postgres    false            c           1255    65736 2   zipper_batch_entry_after_batch_production_insert()    FUNCTION     0  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_insert() RETURNS trigger
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
        uuid = batch_entry.sfg_uuid AND batch_entry.uuid = NEW.batch_entry_uuid;
RETURN NEW;

END;

$$;
 I   DROP FUNCTION public.zipper_batch_entry_after_batch_production_insert();
       public          postgres    false            <           1255    65737 2   zipper_batch_entry_after_batch_production_update()    FUNCTION     �  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_update() RETURNS trigger
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
        uuid = batch_entry.sfg_uuid AND batch_entry.uuid = NEW.batch_entry_uuid;
    RETURN NEW;

RETURN NEW;
      
END;

$$;
 I   DROP FUNCTION public.zipper_batch_entry_after_batch_production_update();
       public          postgres    false            [           1255    65744 %   zipper_sfg_after_batch_entry_delete()    FUNCTION     #  CREATE FUNCTION public.zipper_sfg_after_batch_entry_delete() RETURNS trigger
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
       public          postgres    false            h           1255    65742 %   zipper_sfg_after_batch_entry_insert()    FUNCTION     %  CREATE FUNCTION public.zipper_sfg_after_batch_entry_insert() RETURNS trigger
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
       public          postgres    false            o           1255    65743 %   zipper_sfg_after_batch_entry_update()    FUNCTION     E  CREATE FUNCTION public.zipper_sfg_after_batch_entry_update() RETURNS trigger
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
       public          postgres    false            �           1255    81959 A   assembly_stock_after_die_casting_to_assembly_stock_delete_funct()    FUNCTION       CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS trigger
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
       slider          postgres    false    13            �           1255    81957 A   assembly_stock_after_die_casting_to_assembly_stock_insert_funct()    FUNCTION       CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS trigger
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
       slider          postgres    false    13            |           1255    81958 A   assembly_stock_after_die_casting_to_assembly_stock_update_funct()    FUNCTION     
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
       slider          postgres    false    13            b           1255    17976 8   slider_die_casting_after_die_casting_production_delete()    FUNCTION     |  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_delete() RETURNS trigger
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
       slider          postgres    false    13            m           1255    17977 8   slider_die_casting_after_die_casting_production_insert()    FUNCTION     }  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() RETURNS trigger
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
       slider          postgres    false    13            P           1255    17978 8   slider_die_casting_after_die_casting_production_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_update() RETURNS trigger
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
       slider          postgres    false    13            O           1255    17979 3   slider_die_casting_after_trx_against_stock_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() RETURNS trigger
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
       slider          postgres    false    13            �           1255    17980 3   slider_die_casting_after_trx_against_stock_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() RETURNS trigger
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
       slider          postgres    false    13            j           1255    17981 3   slider_die_casting_after_trx_against_stock_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_update() RETURNS trigger
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
       slider          postgres    false    13            G           1255    17982 0   slider_stock_after_coloring_transaction_delete()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS trigger
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
       slider          postgres    false    13            R           1255    17983 0   slider_stock_after_coloring_transaction_insert()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS trigger
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
       slider          postgres    false    13            }           1255    17984 0   slider_stock_after_coloring_transaction_update()    FUNCTION     7  CREATE FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS trigger
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
       slider          postgres    false    13            ;           1255    17985 3   slider_stock_after_die_casting_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS trigger
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
       slider          postgres    false    13            ?           1255    17986 3   slider_stock_after_die_casting_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS trigger
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
       slider          postgres    false    13            `           1255    17987 3   slider_stock_after_die_casting_transaction_update()    FUNCTION     *  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS trigger
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
       slider          postgres    false    13            >           1255    17988 -   slider_stock_after_slider_production_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_slider_production_delete() RETURNS trigger
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
       slider          postgres    false    13            �           1255    17989 -   slider_stock_after_slider_production_insert()    FUNCTION     o  CREATE FUNCTION slider.slider_stock_after_slider_production_insert() RETURNS trigger
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
       slider          postgres    false    13            r           1255    17990 -   slider_stock_after_slider_production_update()    FUNCTION     {  CREATE FUNCTION slider.slider_stock_after_slider_production_update() RETURNS trigger
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
       slider          postgres    false    13            B           1255    17991 '   slider_stock_after_transaction_delete()    FUNCTION     {  CREATE FUNCTION slider.slider_stock_after_transaction_delete() RETURNS trigger
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
       slider          postgres    false    13                       1255    17992 '   slider_stock_after_transaction_insert()    FUNCTION     r  CREATE FUNCTION slider.slider_stock_after_transaction_insert() RETURNS trigger
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
       slider          postgres    false    13            D           1255    17993 '   slider_stock_after_transaction_update()    FUNCTION     k
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
       slider          postgres    false    13            Y           1255    17994 6   order_description_after_dyed_tape_transaction_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + OLD.trx_quantity,
        nylon_metallic_finishing = 
            nylon_metallic_finishing 
            - CASE WHEN  OLD.section = 'nylon_metallic_finishing' THEN OLD.trx_quantity ELSE 0 END,
        nylon_plastic_finishing = nylon_plastic_finishing 
            - CASE WHEN  OLD.section = 'nylon_plastic_finishing' THEN OLD.trx_quantity ELSE 0 END,
        vislon_teeth_molding = vislon_teeth_molding
            - CASE WHEN  OLD.section = 'vislon_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding
            - CASE WHEN  OLD.section = 'metal_teeth_molding' THEN OLD.trx_quantity ELSE 0 END

    WHERE order_description.uuid = OLD.order_description_uuid;

    RETURN OLD;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
       zipper          postgres    false    15            k           1255    17995 6   order_description_after_dyed_tape_transaction_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received - NEW.trx_quantity,
        nylon_metallic_finishing = 
            nylon_metallic_finishing + CASE WHEN  NEW.section = 'nylon_metallic_finishing' THEN NEW.trx_quantity ELSE 0 END,
        nylon_plastic_finishing = nylon_plastic_finishing 
            + CASE WHEN  NEW.section = 'nylon_plastic_finishing' THEN NEW.trx_quantity ELSE 0 END,
        vislon_teeth_molding = vislon_teeth_molding 
            + CASE WHEN  NEW.section = 'vislon_teeth_molding' THEN NEW.trx_quantity ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding 
            + CASE WHEN  NEW.section = 'metal_teeth_molding' THEN NEW.trx_quantity ELSE 0 END
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
       zipper          postgres    false    15            �           1255    17996 6   order_description_after_dyed_tape_transaction_update()    FUNCTION     b  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + OLD.trx_quantity - NEW.trx_quantity,
        nylon_metallic_finishing = 
            nylon_metallic_finishing + CASE WHEN  NEW.section = 'nylon_metallic_finishing' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN  OLD.section = 'nylon_metallic_finishing' THEN OLD.trx_quantity ELSE 0 END,
        nylon_plastic_finishing = nylon_plastic_finishing 
            + CASE WHEN  NEW.section = 'nylon_plastic_finishing' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN  OLD.section = 'nylon_plastic_finishing' THEN OLD.trx_quantity ELSE 0 END,
        vislon_teeth_molding = vislon_teeth_molding 
            + CASE WHEN  NEW.section = 'vislon_teeth_molding' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN  OLD.section = 'vislon_teeth_molding' THEN OLD.trx_quantity ELSE 0 END,
        metal_teeth_molding = metal_teeth_molding 
            + CASE WHEN  NEW.section = 'metal_teeth_molding' THEN NEW.trx_quantity ELSE 0 END 
            - CASE WHEN  OLD.section = 'metal_teeth_molding' THEN OLD.trx_quantity ELSE 0 END

    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
       zipper          postgres    false    15            {           1255    24577 4   order_description_after_tape_coil_to_dyeing_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() RETURNS trigger
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
       zipper          postgres    false    15            L           1255    24576 4   order_description_after_tape_coil_to_dyeing_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() RETURNS trigger
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
       zipper          postgres    false    15            C           1255    24578 4   order_description_after_tape_coil_to_dyeing_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() RETURNS trigger
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
       zipper          postgres    false    15            _           1255    17997    sfg_after_order_entry_delete()    FUNCTION     �   CREATE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 5   DROP FUNCTION zipper.sfg_after_order_entry_delete();
       zipper          postgres    false    15            E           1255    17998    sfg_after_order_entry_insert()    FUNCTION       CREATE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS trigger
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
       zipper          postgres    false    15            T           1255    17999 *   sfg_after_sfg_production_delete_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_delete_function() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    18000 *   sfg_after_sfg_production_insert_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_insert_function() RETURNS trigger
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
       zipper          postgres    false    15            I           1255    18001 *   sfg_after_sfg_production_update_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_update_function() RETURNS trigger
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
       zipper          postgres    false    15            p           1255    49154 +   sfg_after_sfg_transaction_delete_function()    FUNCTION     (  CREATE FUNCTION zipper.sfg_after_sfg_transaction_delete_function() RETURNS trigger
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
       zipper          postgres    false    15            =           1255    18003 +   sfg_after_sfg_transaction_insert_function()    FUNCTION     *  CREATE FUNCTION zipper.sfg_after_sfg_transaction_insert_function() RETURNS trigger
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
       zipper          postgres    false    15            �           1255    49155 +   sfg_after_sfg_transaction_update_function()    FUNCTION     ?  CREATE FUNCTION zipper.sfg_after_sfg_transaction_update_function() RETURNS trigger
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
       zipper          postgres    false    15            ^           1255    18005 A   stock_after_material_trx_against_order_description_delete_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS trigger
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
       zipper          postgres    false    15            l           1255    18006 A   stock_after_material_trx_against_order_description_insert_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS trigger
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
       zipper          postgres    false    15            ~           1255    18007 A   stock_after_material_trx_against_order_description_update_funct()    FUNCTION     i  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS trigger
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
       zipper          postgres    false    15            u           1255    18008 &   tape_coil_after_tape_coil_production()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS trigger
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
       zipper          postgres    false    15            A           1255    18009 -   tape_coil_after_tape_coil_production_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS trigger
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
       zipper          postgres    false    15            f           1255    18010 -   tape_coil_after_tape_coil_production_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS trigger
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
       zipper          postgres    false    15            Z           1255    81964 !   tape_coil_after_tape_trx_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS trigger
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
       zipper          postgres    false    15            y           1255    81963 !   tape_coil_after_tape_trx_insert()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS trigger
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
       zipper          postgres    false    15            K           1255    81965 !   tape_coil_after_tape_trx_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS trigger
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
       zipper          postgres    false    15            V           1255    131113 A   tape_coil_and_order_description_after_dyed_tape_transaction_del()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() RETURNS trigger
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
       zipper          postgres    false    15            s           1255    131111 A   tape_coil_and_order_description_after_dyed_tape_transaction_ins()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() RETURNS trigger
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
       zipper          postgres    false    15            J           1255    131112 A   tape_coil_and_order_description_after_dyed_tape_transaction_upd()    FUNCTION     2  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() RETURNS trigger
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
       zipper          postgres    false    15            �            1259    18014    bank    TABLE       CREATE TABLE commercial.bank (
    uuid text NOT NULL,
    name text NOT NULL,
    swift_code text NOT NULL,
    address text,
    policy text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    created_by text
);
    DROP TABLE commercial.bank;
    
   commercial         heap    postgres    false    6            �            1259    18019    lc_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.lc_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.lc_sequence;
    
   commercial          postgres    false    6            �            1259    18020    lc    TABLE     G  CREATE TABLE commercial.lc (
    uuid text NOT NULL,
    party_uuid text,
    lc_number text NOT NULL,
    lc_date text NOT NULL,
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
    document_receive_date timestamp without time zone
);
    DROP TABLE commercial.lc;
    
   commercial         heap    postgres    false    226    6            �            1259    18032    pi_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.pi_sequence;
    
   commercial          postgres    false    6            4           1259    81989    pi_cash    TABLE     q  CREATE TABLE commercial.pi_cash (
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
    remarks text
);
    DROP TABLE commercial.pi_cash;
    
   commercial         heap    postgres    false    228    6            5           1259    82002    pi_cash_entry    TABLE       CREATE TABLE commercial.pi_cash_entry (
    uuid text NOT NULL,
    pi_cash_uuid text,
    sfg_uuid text,
    pi_cash_quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 %   DROP TABLE commercial.pi_cash_entry;
    
   commercial         heap    postgres    false    6            8           1259    122885    challan_sequence    SEQUENCE     {   CREATE SEQUENCE delivery.challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE delivery.challan_sequence;
       delivery          postgres    false    7            �            1259    18044    challan    TABLE     �  CREATE TABLE delivery.challan (
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
       delivery         heap    postgres    false    312    7            �            1259    18050    challan_entry    TABLE     �   CREATE TABLE delivery.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    packing_list_uuid text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 #   DROP TABLE delivery.challan_entry;
       delivery         heap    postgres    false    7            6           1259    114693    packing_list_sequence    SEQUENCE     �   CREATE SEQUENCE delivery.packing_list_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE delivery.packing_list_sequence;
       delivery          postgres    false    7            �            1259    18055    packing_list    TABLE     �  CREATE TABLE delivery.packing_list (
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
       delivery         heap    postgres    false    310    7            �            1259    18060    packing_list_entry    TABLE     Y  CREATE TABLE delivery.packing_list_entry (
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
       delivery         heap    postgres    false    7            �            1259    18065    migrations_details    TABLE     t   CREATE TABLE drizzle.migrations_details (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
 '   DROP TABLE drizzle.migrations_details;
       drizzle         heap    postgres    false    8            �            1259    18070    migrations_details_id_seq    SEQUENCE     �   CREATE SEQUENCE drizzle.migrations_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE drizzle.migrations_details_id_seq;
       drizzle          postgres    false    8    233            �           0    0    migrations_details_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE drizzle.migrations_details_id_seq OWNED BY drizzle.migrations_details.id;
          drizzle          postgres    false    234            �            1259    18071 
   department    TABLE     �   CREATE TABLE hr.department (
    uuid text NOT NULL,
    department text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.department;
       hr         heap    postgres    false    9            �            1259    18076    designation    TABLE     �   CREATE TABLE hr.designation (
    uuid text NOT NULL,
    department_uuid text,
    designation text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.designation;
       hr         heap    postgres    false    9            �            1259    18081    policy_and_notice    TABLE       CREATE TABLE hr.policy_and_notice (
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
       hr         heap    postgres    false    9            �            1259    18086    users    TABLE     )  CREATE TABLE hr.users (
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
       hr         heap    postgres    false    9            �            1259    18092    info    TABLE     L  CREATE TABLE lab_dip.info (
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
       lab_dip         heap    postgres    false    10            �            1259    18098    info_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE lab_dip.info_id_seq;
       lab_dip          postgres    false    10    239            �           0    0    info_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE lab_dip.info_id_seq OWNED BY lab_dip.info.id;
          lab_dip          postgres    false    240            �            1259    18099    recipe    TABLE     t  CREATE TABLE lab_dip.recipe (
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
       lab_dip         heap    postgres    false    10            �            1259    18106    recipe_entry    TABLE       CREATE TABLE lab_dip.recipe_entry (
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
       lab_dip         heap    postgres    false    10            �            1259    18111    recipe_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE lab_dip.recipe_id_seq;
       lab_dip          postgres    false    10    241            �           0    0    recipe_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE lab_dip.recipe_id_seq OWNED BY lab_dip.recipe.id;
          lab_dip          postgres    false    243            �            1259    18112    shade_recipe_sequence    SEQUENCE        CREATE SEQUENCE lab_dip.shade_recipe_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE lab_dip.shade_recipe_sequence;
       lab_dip          postgres    false    10            �            1259    18113    shade_recipe    TABLE     }  CREATE TABLE lab_dip.shade_recipe (
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
       lab_dip         heap    postgres    false    244    10            �            1259    18120    shade_recipe_entry    TABLE       CREATE TABLE lab_dip.shade_recipe_entry (
    uuid text NOT NULL,
    shade_recipe_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE lab_dip.shade_recipe_entry;
       lab_dip         heap    postgres    false    10            �            1259    18125    info    TABLE     u  CREATE TABLE material.info (
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
       material         heap    postgres    false    11            �            1259    18131    section    TABLE     �   CREATE TABLE material.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.section;
       material         heap    postgres    false    11            �            1259    18136    stock    TABLE     �  CREATE TABLE material.stock (
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
       material         heap    postgres    false    11            �            1259    18169    stock_to_sfg    TABLE     =  CREATE TABLE material.stock_to_sfg (
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
       material         heap    postgres    false    11            �            1259    18174    trx    TABLE       CREATE TABLE material.trx (
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
       material         heap    postgres    false    11            �            1259    18179    type    TABLE     �   CREATE TABLE material.type (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.type;
       material         heap    postgres    false    11            �            1259    18184    used    TABLE     J  CREATE TABLE material.used (
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
       material         heap    postgres    false    11            �            1259    18190    buyer    TABLE     �   CREATE TABLE public.buyer (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.buyer;
       public         heap    postgres    false            �            1259    18195    factory    TABLE       CREATE TABLE public.factory (
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
       public         heap    postgres    false            1           1259    73775    machine    TABLE     1  CREATE TABLE public.machine (
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
       public         heap    postgres    false                        1259    18200 	   marketing    TABLE       CREATE TABLE public.marketing (
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
       public         heap    postgres    false                       1259    18205    merchandiser    TABLE     $  CREATE TABLE public.merchandiser (
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
       public         heap    postgres    false                       1259    18210    party    TABLE     �   CREATE TABLE public.party (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text NOT NULL,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.party;
       public         heap    postgres    false                       1259    18215 
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
       public         heap    postgres    false                       1259    18220    section    TABLE     w   CREATE TABLE public.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text
);
    DROP TABLE public.section;
       public         heap    postgres    false                       1259    18225    purchase_description_sequence    SEQUENCE     �   CREATE SEQUENCE purchase.purchase_description_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE purchase.purchase_description_sequence;
       purchase          postgres    false    12                       1259    18226    description    TABLE     �  CREATE TABLE purchase.description (
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
       purchase         heap    postgres    false    261    12                       1259    18232    entry    TABLE     ;  CREATE TABLE purchase.entry (
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
       purchase         heap    postgres    false    12                       1259    18238    vendor    TABLE     M  CREATE TABLE purchase.vendor (
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
       purchase         heap    postgres    false    12            2           1259    73799    assembly_stock    TABLE     �  CREATE TABLE slider.assembly_stock (
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
       slider         heap    postgres    false    13            	           1259    18243    coloring_transaction    TABLE     R  CREATE TABLE slider.coloring_transaction (
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
       slider         heap    postgres    false    13            
           1259    18248    die_casting    TABLE     T  CREATE TABLE slider.die_casting (
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
       slider         heap    postgres    false    13                       1259    18259    die_casting_production    TABLE     �  CREATE TABLE slider.die_casting_production (
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
       slider         heap    postgres    false    13            3           1259    81937    die_casting_to_assembly_stock    TABLE     �  CREATE TABLE slider.die_casting_to_assembly_stock (
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
       slider         heap    postgres    false    13                       1259    18264    die_casting_transaction    TABLE     V  CREATE TABLE slider.die_casting_transaction (
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
       slider         heap    postgres    false    13                       1259    18269 
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
       slider         heap    postgres    false    13                       1259    18274    stock    TABLE     a  CREATE TABLE slider.stock (
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
       slider         heap    postgres    false    13                       1259    18293    transaction    TABLE     �  CREATE TABLE slider.transaction (
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
       slider         heap    postgres    false    13                       1259    18298    trx_against_stock    TABLE     7  CREATE TABLE slider.trx_against_stock (
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
       slider         heap    postgres    false    13                       1259    18303    thread_batch_sequence    SEQUENCE     ~   CREATE SEQUENCE thread.thread_batch_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE thread.thread_batch_sequence;
       thread          postgres    false    14                       1259    18304    batch    TABLE     �  CREATE TABLE thread.batch (
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
       thread         heap    postgres    false    273    14                       1259    18311    batch_entry    TABLE     4  CREATE TABLE thread.batch_entry (
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
       thread         heap    postgres    false    14                       1259    18320    count_length    TABLE     y  CREATE TABLE thread.count_length (
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
       thread         heap    postgres    false    14                       1259    18325    dyes_category    TABLE     B  CREATE TABLE thread.dyes_category (
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
       thread         heap    postgres    false    14                       1259    18338    order_entry    TABLE     �  CREATE TABLE thread.order_entry (
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
    recipe_uuid text
);
    DROP TABLE thread.order_entry;
       thread         heap    postgres    false    14                       1259    18347    thread_order_info_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE thread.thread_order_info_sequence;
       thread          postgres    false    14                       1259    18348 
   order_info    TABLE        CREATE TABLE thread.order_info (
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
    remarks text
);
    DROP TABLE thread.order_info;
       thread         heap    postgres    false    279    14                       1259    18356    programs    TABLE     %  CREATE TABLE thread.programs (
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
       thread         heap    postgres    false    14                       1259    18362    batch    TABLE     W  CREATE TABLE zipper.batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    batch_status zipper.batch_status DEFAULT 'pending'::zipper.batch_status,
    machine_uuid text,
    slot integer DEFAULT 0
);
    DROP TABLE zipper.batch;
       zipper         heap    postgres    false    1009    15    1009                       1259    18368    batch_entry    TABLE     n  CREATE TABLE zipper.batch_entry (
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
       zipper         heap    postgres    false    15                       1259    18376    batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE zipper.batch_id_seq;
       zipper          postgres    false    282    15            �           0    0    batch_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE zipper.batch_id_seq OWNED BY zipper.batch.id;
          zipper          postgres    false    284                       1259    18377    batch_production    TABLE     J  CREATE TABLE zipper.batch_production (
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
       zipper         heap    postgres    false    15                       1259    18382    dyed_tape_transaction    TABLE     D  CREATE TABLE zipper.dyed_tape_transaction (
    uuid text NOT NULL,
    order_description_uuid text,
    colors text,
    section text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 )   DROP TABLE zipper.dyed_tape_transaction;
       zipper         heap    postgres    false    15            9           1259    131078     dyed_tape_transaction_from_stock    TABLE     F  CREATE TABLE zipper.dyed_tape_transaction_from_stock (
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
       zipper         heap    postgres    false    15                       1259    18387    dying_batch    TABLE     �   CREATE TABLE zipper.dying_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    mc_no integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.dying_batch;
       zipper         heap    postgres    false    15                        1259    18392    dying_batch_entry    TABLE     v  CREATE TABLE zipper.dying_batch_entry (
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
       zipper         heap    postgres    false    15            !           1259    18397    dying_batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.dying_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE zipper.dying_batch_id_seq;
       zipper          postgres    false    287    15            �           0    0    dying_batch_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE zipper.dying_batch_id_seq OWNED BY zipper.dying_batch.id;
          zipper          postgres    false    289            "           1259    18398 &   material_trx_against_order_description    TABLE     [  CREATE TABLE zipper.material_trx_against_order_description (
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
       zipper         heap    postgres    false    15            #           1259    18403    order_description    TABLE     �  CREATE TABLE zipper.order_description (
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
       zipper         heap    postgres    false    1012    15            $           1259    18418    order_entry    TABLE     A  CREATE TABLE zipper.order_entry (
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
    remarks text
);
    DROP TABLE zipper.order_entry;
       zipper         heap    postgres    false    1015    15    1015            %           1259    18427    order_info_sequence    SEQUENCE     |   CREATE SEQUENCE zipper.order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE zipper.order_info_sequence;
       zipper          postgres    false    15            &           1259    18428 
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
       zipper         heap    postgres    false    293    15            '           1259    18438    planning    TABLE     �   CREATE TABLE zipper.planning (
    week text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.planning;
       zipper         heap    postgres    false    15            (           1259    18443    planning_entry    TABLE     �  CREATE TABLE zipper.planning_entry (
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
       zipper         heap    postgres    false    15            )           1259    18452    sfg    TABLE     �  CREATE TABLE zipper.sfg (
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
       zipper         heap    postgres    false    15            *           1259    18468    sfg_production    TABLE     �  CREATE TABLE zipper.sfg_production (
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
       zipper         heap    postgres    false    15            +           1259    18476    sfg_transaction    TABLE     �  CREATE TABLE zipper.sfg_transaction (
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
       zipper         heap    postgres    false    15            ,           1259    18483 	   tape_coil    TABLE     �  CREATE TABLE zipper.tape_coil (
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
       zipper         heap    postgres    false    15            -           1259    18488    tape_coil_production    TABLE     _  CREATE TABLE zipper.tape_coil_production (
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
       zipper         heap    postgres    false    15            0           1259    65568    tape_coil_required    TABLE     t  CREATE TABLE zipper.tape_coil_required (
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
       zipper         heap    postgres    false    15            .           1259    18494    tape_coil_to_dyeing    TABLE     /  CREATE TABLE zipper.tape_coil_to_dyeing (
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
       zipper         heap    postgres    false    15            /           1259    18499    tape_trx    TABLE       CREATE TABLE zipper.tape_trx (
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
       zipper         heap    postgres    false    15            7           1259    114701    v_order_details    VIEW     Y	  CREATE VIEW zipper.v_order_details AS
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
       zipper          postgres    false    257    238    238    254    254    255    255    256    256    257    258    258    259    259    259    291    291    291    291    291    291    291    294    294    294    294    294    294    294    294    294    294    294    294    294    294    294    294    294    294    15            :           1259    131135    v_order_details_full    VIEW       CREATE VIEW zipper.v_order_details_full AS
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
       zipper          postgres    false    270    270    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    291    255    255    294    294    238    294    259    258    258    294    291    291    294    300    294    294    257    294    294    294    257    256    300    291    291    291    291    291    291    291    291    291    291    259    270    294    291    291    291    294    294    291    238    255    256    259    294    294    254    254    294    1012    15            �           2604    18514    migrations_details id    DEFAULT     �   ALTER TABLE ONLY drizzle.migrations_details ALTER COLUMN id SET DEFAULT nextval('drizzle.migrations_details_id_seq'::regclass);
 E   ALTER TABLE drizzle.migrations_details ALTER COLUMN id DROP DEFAULT;
       drizzle          postgres    false    234    233            �           2604    18515    info id    DEFAULT     d   ALTER TABLE ONLY lab_dip.info ALTER COLUMN id SET DEFAULT nextval('lab_dip.info_id_seq'::regclass);
 7   ALTER TABLE lab_dip.info ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    240    239            �           2604    18516 	   recipe id    DEFAULT     h   ALTER TABLE ONLY lab_dip.recipe ALTER COLUMN id SET DEFAULT nextval('lab_dip.recipe_id_seq'::regclass);
 9   ALTER TABLE lab_dip.recipe ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    243    241                       2604    18517    batch id    DEFAULT     d   ALTER TABLE ONLY zipper.batch ALTER COLUMN id SET DEFAULT nextval('zipper.batch_id_seq'::regclass);
 7   ALTER TABLE zipper.batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    284    282                       2604    18518    dying_batch id    DEFAULT     p   ALTER TABLE ONLY zipper.dying_batch ALTER COLUMN id SET DEFAULT nextval('zipper.dying_batch_id_seq'::regclass);
 =   ALTER TABLE zipper.dying_batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    289    287            �          0    18014    bank 
   TABLE DATA           x   COPY commercial.bank (uuid, name, swift_code, address, policy, created_at, updated_at, remarks, created_by) FROM stdin;
 
   commercial          postgres    false    225   ��      �          0    18020    lc 
   TABLE DATA           �  COPY commercial.lc (uuid, party_uuid, lc_number, lc_date, payment_value, payment_date, ldbc_fdbc, acceptance_date, maturity_date, commercial_executive, party_bank, production_complete, lc_cancel, handover_date, shipment_date, expiry_date, ud_no, ud_received, at_sight, amd_date, amd_count, problematical, epz, created_by, created_at, updated_at, remarks, id, document_receive_date) FROM stdin;
 
   commercial          postgres    false    227   @�      �          0    81989    pi_cash 
   TABLE DATA           �   COPY commercial.pi_cash (uuid, id, lc_uuid, order_info_uuids, marketing_uuid, party_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, is_pi, conversion_rate, receive_amount, created_by, created_at, updated_at, remarks) FROM stdin;
 
   commercial          postgres    false    308   ��      �          0    82002    pi_cash_entry 
   TABLE DATA           |   COPY commercial.pi_cash_entry (uuid, pi_cash_uuid, sfg_uuid, pi_cash_quantity, created_at, updated_at, remarks) FROM stdin;
 
   commercial          postgres    false    309   O�      �          0    18044    challan 
   TABLE DATA           �   COPY delivery.challan (uuid, carton_quantity, assign_to, receive_status, created_by, created_at, updated_at, remarks, id, gate_pass, order_info_uuid) FROM stdin;
    delivery          postgres    false    229   ��      �          0    18050    challan_entry 
   TABLE DATA           q   COPY delivery.challan_entry (uuid, challan_uuid, packing_list_uuid, created_at, updated_at, remarks) FROM stdin;
    delivery          postgres    false    230   �      �          0    18055    packing_list 
   TABLE DATA           �   COPY delivery.packing_list (uuid, carton_size, carton_weight, created_by, created_at, updated_at, remarks, order_info_uuid, id, challan_uuid) FROM stdin;
    delivery          postgres    false    231   ��      �          0    18060    packing_list_entry 
   TABLE DATA           �   COPY delivery.packing_list_entry (uuid, packing_list_uuid, sfg_uuid, quantity, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    delivery          postgres    false    232   C�      �          0    18065    migrations_details 
   TABLE DATA           C   COPY drizzle.migrations_details (id, hash, created_at) FROM stdin;
    drizzle          postgres    false    233   ��      �          0    18071 
   department 
   TABLE DATA           S   COPY hr.department (uuid, department, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    235   K�      �          0    18076    designation 
   TABLE DATA           f   COPY hr.designation (uuid, department_uuid, designation, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    236   T�      �          0    18081    policy_and_notice 
   TABLE DATA              COPY hr.policy_and_notice (uuid, type, title, sub_title, url, created_at, updated_at, status, remarks, created_by) FROM stdin;
    hr          postgres    false    237   ��      �          0    18086    users 
   TABLE DATA           �   COPY hr.users (uuid, name, email, pass, designation_uuid, can_access, ext, phone, created_at, updated_at, status, remarks) FROM stdin;
    hr          postgres    false    238   ��      �          0    18092    info 
   TABLE DATA           �   COPY lab_dip.info (uuid, id, name, order_info_uuid, created_by, created_at, updated_at, remarks, lab_status, thread_order_info_uuid) FROM stdin;
    lab_dip          postgres    false    239   ��      �          0    18099    recipe 
   TABLE DATA           �   COPY lab_dip.recipe (uuid, id, lab_dip_info_uuid, name, approved, created_by, status, created_at, updated_at, remarks, sub_streat, bleaching) FROM stdin;
    lab_dip          postgres    false    241   Ƿ      �          0    18106    recipe_entry 
   TABLE DATA           {   COPY lab_dip.recipe_entry (uuid, recipe_uuid, color, quantity, created_at, updated_at, remarks, material_uuid) FROM stdin;
    lab_dip          postgres    false    242   ۸      �          0    18113    shade_recipe 
   TABLE DATA           �   COPY lab_dip.shade_recipe (uuid, id, name, sub_streat, lab_status, created_by, created_at, updated_at, remarks, bleaching) FROM stdin;
    lab_dip          postgres    false    245   �      �          0    18120    shade_recipe_entry 
   TABLE DATA           �   COPY lab_dip.shade_recipe_entry (uuid, shade_recipe_uuid, material_uuid, quantity, created_at, updated_at, remarks) FROM stdin;
    lab_dip          postgres    false    246   ��      �          0    18125    info 
   TABLE DATA           �   COPY material.info (uuid, section_uuid, type_uuid, name, short_name, unit, threshold, description, created_at, updated_at, remarks, created_by) FROM stdin;
    material          postgres    false    247   x�      �          0    18131    section 
   TABLE DATA           h   COPY material.section (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    248   B�      �          0    18136    stock 
   TABLE DATA           �  COPY material.stock (uuid, material_uuid, stock, tape_making, coil_forming, dying_and_iron, m_gapping, v_gapping, v_teeth_molding, m_teeth_molding, teeth_assembling_and_polishing, m_teeth_cleaning, v_teeth_cleaning, plating_and_iron, m_sealing, v_sealing, n_t_cutting, v_t_cutting, m_stopper, v_stopper, n_stopper, cutting, die_casting, slider_assembly, coloring, remarks, lab_dip, m_qc_and_packing, v_qc_and_packing, n_qc_and_packing, s_qc_and_packing) FROM stdin;
    material          postgres    false    249   ��      �          0    18169    stock_to_sfg 
   TABLE DATA           �   COPY material.stock_to_sfg (uuid, material_uuid, order_entry_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    250   Q�      �          0    18174    trx 
   TABLE DATA           w   COPY material.trx (uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    251   n�      �          0    18179    type 
   TABLE DATA           e   COPY material.type (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    252   ��      �          0    18184    used 
   TABLE DATA           �   COPY material.used (uuid, material_uuid, section, used_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    253   ��      �          0    18190    buyer 
   TABLE DATA           d   COPY public.buyer (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    254   ��      �          0    18195    factory 
   TABLE DATA           v   COPY public.factory (uuid, party_uuid, name, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    255   �      �          0    73775    machine 
   TABLE DATA           �   COPY public.machine (uuid, name, is_vislon, is_metal, is_nylon, is_sewing_thread, is_bulk, is_sample, min_capacity, max_capacity, water_capacity, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    305   �<      �          0    18200 	   marketing 
   TABLE DATA           s   COPY public.marketing (uuid, name, short_name, user_uuid, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    256   k=      �          0    18205    merchandiser 
   TABLE DATA           �   COPY public.merchandiser (uuid, party_uuid, name, email, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    257   3>      �          0    18210    party 
   TABLE DATA           d   COPY public.party (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    258   ۋ      �          0    18215 
   properties 
   TABLE DATA           y   COPY public.properties (uuid, item_for, type, name, short_name, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    259   �      �          0    18220    section 
   TABLE DATA           B   COPY public.section (uuid, name, short_name, remarks) FROM stdin;
    public          postgres    false    260   ��      �          0    18226    description 
   TABLE DATA           �   COPY purchase.description (uuid, vendor_uuid, is_local, lc_number, created_by, created_at, updated_at, remarks, id, challan_number) FROM stdin;
    purchase          postgres    false    262   ��      �          0    18232    entry 
   TABLE DATA           �   COPY purchase.entry (uuid, purchase_description_uuid, material_uuid, quantity, price, created_at, updated_at, remarks) FROM stdin;
    purchase          postgres    false    263   ��      �          0    18238    vendor 
   TABLE DATA           �   COPY purchase.vendor (uuid, name, contact_name, email, office_address, contact_number, remarks, created_at, updated_at, created_by) FROM stdin;
    purchase          postgres    false    264   Z�      �          0    73799    assembly_stock 
   TABLE DATA           �   COPY slider.assembly_stock (uuid, name, die_casting_body_uuid, die_casting_puller_uuid, die_casting_cap_uuid, die_casting_link_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    306   �      �          0    18243    coloring_transaction 
   TABLE DATA           �   COPY slider.coloring_transaction (uuid, stock_uuid, order_info_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    265   ��      �          0    18248    die_casting 
   TABLE DATA           �   COPY slider.die_casting (uuid, name, item, zipper_number, end_type, puller_type, logo_type, slider_body_shape, puller_link, quantity, weight, pcs_per_kg, created_at, updated_at, remarks, quantity_in_sa, is_logo_body, is_logo_puller, type) FROM stdin;
    slider          postgres    false    266   ��      �          0    18259    die_casting_production 
   TABLE DATA           �   COPY slider.die_casting_production (uuid, die_casting_uuid, mc_no, cavity_goods, cavity_defect, push, weight, order_description_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    slider          postgres    false    267   ��      �          0    81937    die_casting_to_assembly_stock 
   TABLE DATA           �   COPY slider.die_casting_to_assembly_stock (uuid, assembly_stock_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    307   G�      �          0    18264    die_casting_transaction 
   TABLE DATA           �   COPY slider.die_casting_transaction (uuid, die_casting_uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    268   �      �          0    18269 
   production 
   TABLE DATA           �   COPY slider.production (uuid, stock_uuid, production_quantity, wastage, section, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    269   ��      �          0    18274    stock 
   TABLE DATA           Q  COPY slider.stock (uuid, order_quantity, body_quantity, cap_quantity, puller_quantity, link_quantity, sa_prod, coloring_stock, coloring_prod, trx_to_finishing, u_top_quantity, h_bottom_quantity, box_pin_quantity, two_way_pin_quantity, created_at, updated_at, remarks, quantity_in_sa, order_description_uuid, finishing_stock) FROM stdin;
    slider          postgres    false    270   ��      �          0    18293    transaction 
   TABLE DATA           �   COPY slider.transaction (uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, from_section, to_section, assembly_stock_uuid, weight) FROM stdin;
    slider          postgres    false    271   �      �          0    18298    trx_against_stock 
   TABLE DATA           �   COPY slider.trx_against_stock (uuid, die_casting_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    272   �      �          0    18304    batch 
   TABLE DATA             COPY thread.batch (uuid, id, dyeing_operator, reason, category, status, pass_by, shift, dyeing_supervisor, coning_operator, coning_supervisor, coning_machines, created_by, created_at, updated_at, remarks, yarn_quantity, machine_uuid, lab_created_by, lab_created_at, lab_updated_at, yarn_issue_created_by, yarn_issue_created_at, yarn_issue_updated_at, is_drying_complete, drying_created_at, drying_updated_at, dyeing_created_by, dyeing_created_at, dyeing_updated_at, coning_created_by, coning_created_at, coning_updated_at, slot) FROM stdin;
    thread          postgres    false    274   U�      �          0    18311    batch_entry 
   TABLE DATA           �   COPY thread.batch_entry (uuid, batch_uuid, order_entry_uuid, quantity, coning_production_quantity, coning_production_quantity_in_kg, created_at, updated_at, remarks, coning_created_at, coning_updated_at, transfer_quantity) FROM stdin;
    thread          postgres    false    275   ��      �          0    18320    count_length 
   TABLE DATA           �   COPY thread.count_length (uuid, count, sst, created_by, created_at, updated_at, remarks, min_weight, max_weight, length, price) FROM stdin;
    thread          postgres    false    276   ]�      �          0    18325    dyes_category 
   TABLE DATA           �   COPY thread.dyes_category (uuid, name, upto_percentage, bleaching, id, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    277   #�      �          0    18338    order_entry 
   TABLE DATA             COPY thread.order_entry (uuid, order_info_uuid, lab_reference, color, po, style, count_length_uuid, quantity, company_price, party_price, swatch_approval_date, production_quantity, created_by, created_at, updated_at, remarks, bleaching, transfer_quantity, recipe_uuid) FROM stdin;
    thread          postgres    false    278   Y�      �          0    18348 
   order_info 
   TABLE DATA           �   COPY thread.order_info (uuid, id, party_uuid, marketing_uuid, factory_uuid, merchandiser_uuid, buyer_uuid, is_sample, is_bill, delivery_date, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    280   �      �          0    18356    programs 
   TABLE DATA           �   COPY thread.programs (uuid, dyes_category_uuid, material_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    281   4�      �          0    18362    batch 
   TABLE DATA           x   COPY zipper.batch (uuid, id, created_by, created_at, updated_at, remarks, batch_status, machine_uuid, slot) FROM stdin;
    zipper          postgres    false    282   ��      �          0    18368    batch_entry 
   TABLE DATA           �   COPY zipper.batch_entry (uuid, batch_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks, sfg_uuid) FROM stdin;
    zipper          postgres    false    283   J�      �          0    18377    batch_production 
   TABLE DATA           �   COPY zipper.batch_production (uuid, batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    285   �      �          0    18382    dyed_tape_transaction 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction (uuid, order_description_uuid, colors, section, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    286   ,�      �          0    131078     dyed_tape_transaction_from_stock 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction_from_stock (uuid, order_description_uuid, trx_quantity, tape_coil_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    313   ��      �          0    18387    dying_batch 
   TABLE DATA           c   COPY zipper.dying_batch (uuid, id, mc_no, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    287   S�      �          0    18392    dying_batch_entry 
   TABLE DATA           �   COPY zipper.dying_batch_entry (uuid, dying_batch_uuid, batch_entry_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    288   p�      �          0    18398 &   material_trx_against_order_description 
   TABLE DATA           �   COPY zipper.material_trx_against_order_description (uuid, order_description_uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    290   ��      �          0    18403    order_description 
   TABLE DATA           c  COPY zipper.order_description (uuid, order_info_uuid, item, zipper_number, end_type, lock_type, puller_type, teeth_color, puller_color, special_requirement, hand, coloring_type, is_slider_provided, slider, slider_starting_section_enum, top_stopper, bottom_stopper, logo_type, is_logo_body, is_logo_puller, description, status, created_at, updated_at, remarks, slider_body_shape, slider_link, end_user, garment, light_preference, garments_wash, puller_link, created_by, garments_remarks, tape_received, tape_transferred, slider_finishing_stock, nylon_stopper, tape_coil_uuid, tape_color, teeth_type) FROM stdin;
    zipper          postgres    false    291   ��      �          0    18418    order_entry 
   TABLE DATA           �   COPY zipper.order_entry (uuid, order_description_uuid, style, color, size, quantity, company_price, party_price, status, swatch_status_enum, swatch_approval_date, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    292   X�      �          0    18428 
   order_info 
   TABLE DATA             COPY zipper.order_info (uuid, id, reference_order_info_uuid, buyer_uuid, party_uuid, marketing_uuid, merchandiser_uuid, factory_uuid, is_sample, is_bill, is_cash, marketing_priority, factory_priority, status, created_by, created_at, updated_at, remarks, conversion_rate) FROM stdin;
    zipper          postgres    false    294   /�      �          0    18438    planning 
   TABLE DATA           U   COPY zipper.planning (week, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    295   0�      �          0    18443    planning_entry 
   TABLE DATA           �   COPY zipper.planning_entry (uuid, sfg_uuid, sno_quantity, factory_quantity, production_quantity, batch_production_quantity, created_at, updated_at, planning_week, sno_remarks, factory_remarks) FROM stdin;
    zipper          postgres    false    296   M�      �          0    18452    sfg 
   TABLE DATA             COPY zipper.sfg (uuid, order_entry_uuid, recipe_uuid, dying_and_iron_prod, teeth_molding_stock, teeth_molding_prod, teeth_coloring_stock, teeth_coloring_prod, finishing_stock, finishing_prod, coloring_prod, warehouse, delivered, pi, remarks, short_quantity, reject_quantity) FROM stdin;
    zipper          postgres    false    297   j�      �          0    18468    sfg_production 
   TABLE DATA           �   COPY zipper.sfg_production (uuid, sfg_uuid, section, production_quantity_in_kg, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    298   k�      �          0    18476    sfg_transaction 
   TABLE DATA           �   COPY zipper.sfg_transaction (uuid, trx_from, trx_to, trx_quantity, slider_item_uuid, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_kg) FROM stdin;
    zipper          postgres    false    299   �       �          0    18483 	   tape_coil 
   TABLE DATA             COPY zipper.tape_coil (uuid, quantity, trx_quantity_in_coil, quantity_in_coil, remarks, item_uuid, zipper_number_uuid, name, raw_per_kg_meter, dyed_per_kg_meter, created_by, created_at, updated_at, is_import, is_reverse, trx_quantity_in_dying, stock_quantity) FROM stdin;
    zipper          postgres    false    300   B      �          0    18488    tape_coil_production 
   TABLE DATA           �   COPY zipper.tape_coil_production (uuid, section, tape_coil_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    301   �      �          0    65568    tape_coil_required 
   TABLE DATA           �   COPY zipper.tape_coil_required (uuid, end_type_uuid, item_uuid, nylon_stopper_uuid, zipper_number_uuid, top, bottom, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    304   C      �          0    18494    tape_coil_to_dyeing 
   TABLE DATA           �   COPY zipper.tape_coil_to_dyeing (uuid, tape_coil_uuid, order_description_uuid, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    302   �      �          0    18499    tape_trx 
   TABLE DATA              COPY zipper.tape_trx (uuid, tape_coil_uuid, trx_quantity, created_by, created_at, updated_at, remarks, to_section) FROM stdin;
    zipper          postgres    false    303   A
      �           0    0    lc_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.lc_sequence', 6, true);
       
   commercial          postgres    false    226            �           0    0    pi_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.pi_sequence', 9, true);
       
   commercial          postgres    false    228            �           0    0    challan_sequence    SEQUENCE SET     @   SELECT pg_catalog.setval('delivery.challan_sequence', 6, true);
          delivery          postgres    false    312            �           0    0    packing_list_sequence    SEQUENCE SET     F   SELECT pg_catalog.setval('delivery.packing_list_sequence', 10, true);
          delivery          postgres    false    310            �           0    0    migrations_details_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('drizzle.migrations_details_id_seq', 116, true);
          drizzle          postgres    false    234            �           0    0    info_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('lab_dip.info_id_seq', 131, true);
          lab_dip          postgres    false    240            �           0    0    recipe_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('lab_dip.recipe_id_seq', 8, true);
          lab_dip          postgres    false    243            �           0    0    shade_recipe_sequence    SEQUENCE SET     E   SELECT pg_catalog.setval('lab_dip.shade_recipe_sequence', 12, true);
          lab_dip          postgres    false    244            �           0    0    purchase_description_sequence    SEQUENCE SET     N   SELECT pg_catalog.setval('purchase.purchase_description_sequence', 10, true);
          purchase          postgres    false    261            �           0    0    thread_batch_sequence    SEQUENCE SET     D   SELECT pg_catalog.setval('thread.thread_batch_sequence', 25, true);
          thread          postgres    false    273            �           0    0    thread_order_info_sequence    SEQUENCE SET     H   SELECT pg_catalog.setval('thread.thread_order_info_sequence', 6, true);
          thread          postgres    false    279            �           0    0    batch_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('zipper.batch_id_seq', 10, true);
          zipper          postgres    false    284            �           0    0    dying_batch_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('zipper.dying_batch_id_seq', 1, false);
          zipper          postgres    false    289            �           0    0    order_info_sequence    SEQUENCE SET     B   SELECT pg_catalog.setval('zipper.order_info_sequence', 12, true);
          zipper          postgres    false    293            Y           2606    18520    bank bank_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_pkey;
    
   commercial            postgres    false    225            [           2606    18522 
   lc lc_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_pkey;
    
   commercial            postgres    false    227            �           2606    82008     pi_cash_entry pi_cash_entry_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pkey;
    
   commercial            postgres    false    309            �           2606    82001    pi_cash pi_cash_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_pkey;
    
   commercial            postgres    false    308            _           2606    18528     challan_entry challan_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_pkey;
       delivery            postgres    false    230            ]           2606    18530    challan challan_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_pkey;
       delivery            postgres    false    229            c           2606    18532 *   packing_list_entry packing_list_entry_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_pkey;
       delivery            postgres    false    232            a           2606    18534    packing_list packing_list_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_pkey;
       delivery            postgres    false    231            e           2606    18536 *   migrations_details migrations_details_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY drizzle.migrations_details
    ADD CONSTRAINT migrations_details_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY drizzle.migrations_details DROP CONSTRAINT migrations_details_pkey;
       drizzle            postgres    false    233            g           2606    18538    department department_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_pkey;
       hr            postgres    false    235            i           2606    18540    designation designation_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_pkey;
       hr            postgres    false    236            k           2606    18542 (   policy_and_notice policy_and_notice_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_pkey;
       hr            postgres    false    237            m           2606    18544    users users_email_unique 
   CONSTRAINT     P   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_email_unique;
       hr            postgres    false    238            o           2606    18546    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_pkey;
       hr            postgres    false    238            q           2606    18548    info info_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 9   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_pkey;
       lab_dip            postgres    false    239            u           2606    18550    recipe_entry recipe_entry_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_pkey;
       lab_dip            postgres    false    242            s           2606    18552    recipe recipe_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (uuid);
 =   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_pkey;
       lab_dip            postgres    false    241            y           2606    18554 *   shade_recipe_entry shade_recipe_entry_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_pkey PRIMARY KEY (uuid);
 U   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_pkey;
       lab_dip            postgres    false    246            w           2606    18556    shade_recipe shade_recipe_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_pkey;
       lab_dip            postgres    false    245            {           2606    18558    info info_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.info DROP CONSTRAINT info_pkey;
       material            postgres    false    247            }           2606    18560    section section_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY material.section DROP CONSTRAINT section_pkey;
       material            postgres    false    248                       2606    18562    stock stock_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_pkey;
       material            postgres    false    249            �           2606    18564    stock_to_sfg stock_to_sfg_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_pkey;
       material            postgres    false    250            �           2606    18566    trx trx_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_pkey;
       material            postgres    false    251            �           2606    18568    type type_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.type DROP CONSTRAINT type_pkey;
       material            postgres    false    252            �           2606    18570    used used_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.used DROP CONSTRAINT used_pkey;
       material            postgres    false    253            �           2606    18572    buyer buyer_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_name_unique;
       public            postgres    false    254            �           2606    18574    buyer buyer_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_pkey;
       public            postgres    false    254            �           2606    18576    factory factory_name_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_name_unique UNIQUE (name);
 E   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_name_unique;
       public            postgres    false    255            �           2606    18578    factory factory_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_pkey;
       public            postgres    false    255            �           2606    73788    machine machine_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_pkey;
       public            postgres    false    305            �           2606    18580    marketing marketing_name_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_name_unique UNIQUE (name);
 I   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_name_unique;
       public            postgres    false    256            �           2606    18582    marketing marketing_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_pkey;
       public            postgres    false    256            �           2606    18584 %   merchandiser merchandiser_name_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_name_unique UNIQUE (name);
 O   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_name_unique;
       public            postgres    false    257            �           2606    18586    merchandiser merchandiser_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_pkey;
       public            postgres    false    257            �           2606    18588    party party_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.party DROP CONSTRAINT party_name_unique;
       public            postgres    false    258            �           2606    18590    party party_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    258            �           2606    18592    properties properties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY public.properties DROP CONSTRAINT properties_pkey;
       public            postgres    false    259            �           2606    18594    section section_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.section DROP CONSTRAINT section_pkey;
       public            postgres    false    260            �           2606    18596    description description_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_pkey;
       purchase            postgres    false    262            �           2606    18598    entry entry_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_pkey;
       purchase            postgres    false    263            �           2606    18600    vendor vendor_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_pkey;
       purchase            postgres    false    264            �           2606    73807 "   assembly_stock assembly_stock_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_pkey;
       slider            postgres    false    306            �           2606    18602 .   coloring_transaction coloring_transaction_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_pkey;
       slider            postgres    false    265            �           2606    18604    die_casting die_casting_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_pkey;
       slider            postgres    false    266            �           2606    18606 2   die_casting_production die_casting_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_pkey;
       slider            postgres    false    267            �           2606    81945 @   die_casting_to_assembly_stock die_casting_to_assembly_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_pkey PRIMARY KEY (uuid);
 j   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_pkey;
       slider            postgres    false    307            �           2606    18608 4   die_casting_transaction die_casting_transaction_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_pkey PRIMARY KEY (uuid);
 ^   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_pkey;
       slider            postgres    false    268            �           2606    18610    production production_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_pkey;
       slider            postgres    false    269            �           2606    18612    stock stock_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_pkey;
       slider            postgres    false    270            �           2606    18614    transaction transaction_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_pkey;
       slider            postgres    false    271            �           2606    18616 (   trx_against_stock trx_against_stock_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_pkey;
       slider            postgres    false    272            �           2606    18618    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_pkey;
       thread            postgres    false    275            �           2606    18620    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pkey;
       thread            postgres    false    274            �           2606    18622 !   count_length count_length_uuid_pk 
   CONSTRAINT     a   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_uuid_pk PRIMARY KEY (uuid);
 K   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_uuid_pk;
       thread            postgres    false    276            �           2606    18624     dyes_category dyes_category_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_pkey;
       thread            postgres    false    277            �           2606    18628    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_pkey;
       thread            postgres    false    278            �           2606    18630    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_pkey;
       thread            postgres    false    280            �           2606    18632    programs programs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_pkey;
       thread            postgres    false    281            �           2606    18634    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_pkey;
       zipper            postgres    false    283            �           2606    18636    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_pkey;
       zipper            postgres    false    282            �           2606    18638 &   batch_production batch_production_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_pkey PRIMARY KEY (uuid);
 P   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_pkey;
       zipper            postgres    false    285            �           2606    131085 F   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_pkey PRIMARY KEY (uuid);
 p   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_pkey;
       zipper            postgres    false    313            �           2606    18640 0   dyed_tape_transaction dyed_tape_transaction_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_pkey;
       zipper            postgres    false    286            �           2606    18642 (   dying_batch_entry dying_batch_entry_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_pkey;
       zipper            postgres    false    288            �           2606    18644    dying_batch dying_batch_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.dying_batch
    ADD CONSTRAINT dying_batch_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.dying_batch DROP CONSTRAINT dying_batch_pkey;
       zipper            postgres    false    287            �           2606    18646 R   material_trx_against_order_description material_trx_against_order_description_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_pkey PRIMARY KEY (uuid);
 |   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_pkey;
       zipper            postgres    false    290            �           2606    18648 (   order_description order_description_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_pkey;
       zipper            postgres    false    291            �           2606    18650    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_pkey;
       zipper            postgres    false    292            �           2606    18652    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_pkey;
       zipper            postgres    false    294            �           2606    18654 "   planning_entry planning_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_pkey;
       zipper            postgres    false    296            �           2606    18656    planning planning_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_pkey PRIMARY KEY (week);
 @   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_pkey;
       zipper            postgres    false    295            �           2606    18658    sfg sfg_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_pkey;
       zipper            postgres    false    297            �           2606    18660 "   sfg_production sfg_production_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_pkey;
       zipper            postgres    false    298            �           2606    18662 $   sfg_transaction sfg_transaction_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_pkey;
       zipper            postgres    false    299            �           2606    18664    tape_coil tape_coil_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_pkey;
       zipper            postgres    false    300            �           2606    18666 .   tape_coil_production tape_coil_production_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_pkey;
       zipper            postgres    false    301            �           2606    65576 *   tape_coil_required tape_coil_required_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_pkey PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_pkey;
       zipper            postgres    false    304            �           2606    18668 ,   tape_coil_to_dyeing tape_coil_to_dyeing_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_pkey;
       zipper            postgres    false    302            �           2606    18670    tape_trx tape_to_coil_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_pkey;
       zipper            postgres    false    303            �           2620    18674 .   info material_stock_after_material_info_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_delete AFTER DELETE ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_delete();
 I   DROP TRIGGER material_stock_after_material_info_delete ON material.info;
       material          postgres    false    328    247            �           2620    18675 .   info material_stock_after_material_info_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_insert AFTER INSERT ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_insert();
 I   DROP TRIGGER material_stock_after_material_info_insert ON material.info;
       material          postgres    false    247    366            �           2620    18676 ,   trx material_stock_after_material_trx_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_delete AFTER DELETE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_delete();
 G   DROP TRIGGER material_stock_after_material_trx_delete ON material.trx;
       material          postgres    false    348    251            �           2620    18677 ,   trx material_stock_after_material_trx_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_insert AFTER INSERT ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_insert();
 G   DROP TRIGGER material_stock_after_material_trx_insert ON material.trx;
       material          postgres    false    251    339            �           2620    18678 ,   trx material_stock_after_material_trx_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_update AFTER UPDATE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_update();
 G   DROP TRIGGER material_stock_after_material_trx_update ON material.trx;
       material          postgres    false    378    251            �           2620    18679 .   used material_stock_after_material_used_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_delete AFTER DELETE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_delete();
 I   DROP TRIGGER material_stock_after_material_used_delete ON material.used;
       material          postgres    false    253    343            �           2620    18680 .   used material_stock_after_material_used_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_insert AFTER INSERT ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_insert();
 I   DROP TRIGGER material_stock_after_material_used_insert ON material.used;
       material          postgres    false    253    353            �           2620    18681 .   used material_stock_after_material_used_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_update AFTER UPDATE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_update();
 I   DROP TRIGGER material_stock_after_material_used_update ON material.used;
       material          postgres    false    337    253            �           2620    18682 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_delete    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete AFTER DELETE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_delete ON material.stock_to_sfg;
       material          postgres    false    250    320            �           2620    18683 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_insert    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert AFTER INSERT ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_insert ON material.stock_to_sfg;
       material          postgres    false    250    359            �           2620    18684 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_update    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update AFTER UPDATE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_update ON material.stock_to_sfg;
       material          postgres    false    250    375            �           2620    18685 0   entry material_stock_after_purchase_entry_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_delete AFTER DELETE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();
 K   DROP TRIGGER material_stock_after_purchase_entry_delete ON purchase.entry;
       purchase          postgres    false    344    263            �           2620    18686 0   entry material_stock_after_purchase_entry_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_insert AFTER INSERT ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();
 K   DROP TRIGGER material_stock_after_purchase_entry_insert ON purchase.entry;
       purchase          postgres    false    263    376            �           2620    18687 0   entry material_stock_after_purchase_entry_update    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_update AFTER UPDATE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();
 K   DROP TRIGGER material_stock_after_purchase_entry_update ON purchase.entry;
       purchase          postgres    false    394    263            �           2620    81962 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_delete    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete AFTER DELETE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    384    307            �           2620    81960 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_insert    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert AFTER INSERT ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    385    307            �           2620    81961 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_update    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update AFTER UPDATE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    307    380            �           2620    18688 M   die_casting_production slider_die_casting_after_die_casting_production_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_delete AFTER DELETE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_delete ON slider.die_casting_production;
       slider          postgres    false    267    354            �           2620    18689 M   die_casting_production slider_die_casting_after_die_casting_production_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_insert AFTER INSERT ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_insert ON slider.die_casting_production;
       slider          postgres    false    267    365            �           2620    18690 M   die_casting_production slider_die_casting_after_die_casting_production_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_update AFTER UPDATE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_update ON slider.die_casting_production;
       slider          postgres    false    336    267            �           2620    18691 C   trx_against_stock slider_die_casting_after_trx_against_stock_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete AFTER DELETE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_delete ON slider.trx_against_stock;
       slider          postgres    false    335    272            �           2620    18692 C   trx_against_stock slider_die_casting_after_trx_against_stock_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert AFTER INSERT ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_insert ON slider.trx_against_stock;
       slider          postgres    false    272    390            �           2620    18693 C   trx_against_stock slider_die_casting_after_trx_against_stock_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_update AFTER UPDATE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_update ON slider.trx_against_stock;
       slider          postgres    false    362    272            �           2620    18694 C   coloring_transaction slider_stock_after_coloring_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_delete AFTER DELETE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_delete ON slider.coloring_transaction;
       slider          postgres    false    327    265            �           2620    18695 C   coloring_transaction slider_stock_after_coloring_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_insert AFTER INSERT ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_insert ON slider.coloring_transaction;
       slider          postgres    false    265    338            �           2620    18696 C   coloring_transaction slider_stock_after_coloring_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_update AFTER UPDATE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_update ON slider.coloring_transaction;
       slider          postgres    false    381    265            �           2620    18697 I   die_casting_transaction slider_stock_after_die_casting_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_delete AFTER DELETE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_delete ON slider.die_casting_transaction;
       slider          postgres    false    268    315            �           2620    18698 I   die_casting_transaction slider_stock_after_die_casting_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_insert AFTER INSERT ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_insert ON slider.die_casting_transaction;
       slider          postgres    false    268    319            �           2620    18699 I   die_casting_transaction slider_stock_after_die_casting_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_update AFTER UPDATE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_update ON slider.die_casting_transaction;
       slider          postgres    false    352    268            �           2620    18700 6   production slider_stock_after_slider_production_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_delete AFTER DELETE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();
 O   DROP TRIGGER slider_stock_after_slider_production_delete ON slider.production;
       slider          postgres    false    269    318            �           2620    18701 6   production slider_stock_after_slider_production_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_insert AFTER INSERT ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();
 O   DROP TRIGGER slider_stock_after_slider_production_insert ON slider.production;
       slider          postgres    false    386    269            �           2620    18702 6   production slider_stock_after_slider_production_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_update AFTER UPDATE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();
 O   DROP TRIGGER slider_stock_after_slider_production_update ON slider.production;
       slider          postgres    false    269    370            �           2620    18703 1   transaction slider_stock_after_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_delete AFTER DELETE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();
 J   DROP TRIGGER slider_stock_after_transaction_delete ON slider.transaction;
       slider          postgres    false    322    271            �           2620    18704 1   transaction slider_stock_after_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_insert AFTER INSERT ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();
 J   DROP TRIGGER slider_stock_after_transaction_insert ON slider.transaction;
       slider          postgres    false    271    383            �           2620    18705 1   transaction slider_stock_after_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_update AFTER UPDATE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_update();
 J   DROP TRIGGER slider_stock_after_transaction_update ON slider.transaction;
       slider          postgres    false    324    271            �           2620    18706 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger AFTER DELETE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_delete_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    286    345            �           2620    18707 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger AFTER INSERT ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_insert_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    286    363            �           2620    18708 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_update_trigger AFTER UPDATE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_update_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    389    286            �           2620    18709 (   order_entry sfg_after_order_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_delete AFTER DELETE ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();
 A   DROP TRIGGER sfg_after_order_entry_delete ON zipper.order_entry;
       zipper          postgres    false    351    292            �           2620    18710 (   order_entry sfg_after_order_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_insert AFTER INSERT ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();
 A   DROP TRIGGER sfg_after_order_entry_insert ON zipper.order_entry;
       zipper          postgres    false    292    325            �           2620    18711 6   sfg_production sfg_after_sfg_production_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_delete_trigger AFTER DELETE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_delete_function();
 O   DROP TRIGGER sfg_after_sfg_production_delete_trigger ON zipper.sfg_production;
       zipper          postgres    false    340    298            �           2620    18712 6   sfg_production sfg_after_sfg_production_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_insert_trigger AFTER INSERT ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_insert_function();
 O   DROP TRIGGER sfg_after_sfg_production_insert_trigger ON zipper.sfg_production;
       zipper          postgres    false    298    387            �           2620    18713 6   sfg_production sfg_after_sfg_production_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_update_trigger AFTER UPDATE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_update_function();
 O   DROP TRIGGER sfg_after_sfg_production_update_trigger ON zipper.sfg_production;
       zipper          postgres    false    329    298            �           2620    106501 8   sfg_transaction sfg_after_sfg_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_delete_trigger AFTER DELETE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_delete_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_delete_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    368    299            �           2620    32768 8   sfg_transaction sfg_after_sfg_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_insert_trigger AFTER INSERT ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_insert_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_insert_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    299    317            �           2620    106502 8   sfg_transaction sfg_after_sfg_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_update_trigger AFTER UPDATE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_update_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_update_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    388    299            �           2620    18717 `   material_trx_against_order_description stock_after_material_trx_against_order_description_delete    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_delete AFTER DELETE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_delete ON zipper.material_trx_against_order_description;
       zipper          postgres    false    350    290            �           2620    18718 `   material_trx_against_order_description stock_after_material_trx_against_order_description_insert    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_insert AFTER INSERT ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_insert ON zipper.material_trx_against_order_description;
       zipper          postgres    false    290    364            �           2620    18719 `   material_trx_against_order_description stock_after_material_trx_against_order_description_update    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_update AFTER UPDATE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_update ON zipper.material_trx_against_order_description;
       zipper          postgres    false    382    290            �           2620    18720 9   tape_coil_production tape_coil_after_tape_coil_production    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production AFTER INSERT ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();
 R   DROP TRIGGER tape_coil_after_tape_coil_production ON zipper.tape_coil_production;
       zipper          postgres    false    301    373            �           2620    18721 @   tape_coil_production tape_coil_after_tape_coil_production_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_delete AFTER DELETE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_delete ON zipper.tape_coil_production;
       zipper          postgres    false    301    321            �           2620    18722 @   tape_coil_production tape_coil_after_tape_coil_production_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_update AFTER UPDATE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_update ON zipper.tape_coil_production;
       zipper          postgres    false    358    301            �           2620    81967 .   tape_trx tape_coil_after_tape_trx_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_delete AFTER DELETE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_delete ON zipper.tape_trx;
       zipper          postgres    false    303    346            �           2620    81966 .   tape_trx tape_coil_after_tape_trx_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_insert AFTER INSERT ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_insert ON zipper.tape_trx;
       zipper          postgres    false    303    377            �           2620    81968 .   tape_trx tape_coil_after_tape_trx_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_update AFTER UPDATE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_update ON zipper.tape_trx;
       zipper          postgres    false    331    303            �           2620    131116 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_del    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del AFTER DELETE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    342    313            �           2620    131114 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_ins    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins AFTER INSERT ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    313    371            �           2620    131115 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_upd    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    330    313            �           2620    24580 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_delete AFTER DELETE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();
 M   DROP TRIGGER tape_coil_to_dyeing_after_delete ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    302    379            �           2620    24579 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_insert AFTER INSERT ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
 M   DROP TRIGGER tape_coil_to_dyeing_after_insert ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    302    332            �           2620    24581 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_update AFTER UPDATE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();
 M   DROP TRIGGER tape_coil_to_dyeing_after_update ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    302    323            �           2620    98306 A   batch_production zipper_batch_entry_after_batch_production_delete    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_delete AFTER DELETE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_delete();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_delete ON zipper.batch_production;
       zipper          postgres    false    334    285            �           2620    98304 A   batch_production zipper_batch_entry_after_batch_production_insert    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_insert AFTER INSERT ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_insert();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_insert ON zipper.batch_production;
       zipper          postgres    false    355    285            �           2620    98305 A   batch_production zipper_batch_entry_after_batch_production_update    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_update AFTER UPDATE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_update();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_update ON zipper.batch_production;
       zipper          postgres    false    316    285            �           2606    18726 "   bank bank_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 P   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_created_by_users_uuid_fk;
    
   commercial          postgres    false    238    225    5231            �           2606    18731    lc lc_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_created_by_users_uuid_fk;
    
   commercial          postgres    false    238    227    5231            �           2606    18736    lc lc_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    258    227    5275            �           2606    82034 &   pi_cash pi_cash_bank_uuid_bank_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);
 T   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk;
    
   commercial          postgres    false    308    5209    225            �           2606    82039 (   pi_cash pi_cash_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_created_by_users_uuid_fk;
    
   commercial          postgres    false    238    308    5231            �           2606    82044 8   pi_cash_entry pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);
 f   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk;
    
   commercial          postgres    false    309    308    5363            �           2606    82049 0   pi_cash_entry pi_cash_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk;
    
   commercial          postgres    false    309    297    5341            �           2606    82029 ,   pi_cash pi_cash_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 Z   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk;
    
   commercial          postgres    false    308    5263    255            �           2606    82009 "   pi_cash pi_cash_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 P   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    227    308    5211            �           2606    82014 0   pi_cash pi_cash_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk;
    
   commercial          postgres    false    256    308    5267            �           2606    82024 6   pi_cash pi_cash_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 d   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk;
    
   commercial          postgres    false    257    308    5271            �           2606    82019 (   pi_cash pi_cash_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    5275    258    308            �           2606    18786 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       delivery          postgres    false    5231    229    238            �           2606    18791 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       delivery          postgres    false    238    5231    229            �           2606    18796 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 d   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    229    230    5213            �           2606    18801 B   challan_entry challan_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 n   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    5217    230    231            �           2606    131106 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 ^   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    294    5335    229                        2606    131140 6   packing_list packing_list_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 b   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    231    229    5213                       2606    65652 2   packing_list packing_list_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_created_by_users_uuid_fk;
       delivery          postgres    false    238    5231    231                       2606    18806 L   packing_list_entry packing_list_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 x   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    232    231    5217                       2606    18811 :   packing_list_entry packing_list_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 f   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk;
       delivery          postgres    false    5341    232    297                       2606    98307 <   packing_list packing_list_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 h   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    294    231    5335                       2606    65657 :   designation designation_department_uuid_department_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_department_uuid_department_uuid_fk FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 `   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_department_uuid_department_uuid_fk;
       hr          postgres    false    235    5223    236                       2606    18816 <   policy_and_notice policy_and_notice_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_created_by_users_uuid_fk;
       hr          postgres    false    237    238    5231                       2606    18821 0   users users_designation_uuid_designation_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_designation_uuid_designation_uuid_fk FOREIGN KEY (designation_uuid) REFERENCES hr.designation(uuid);
 V   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_designation_uuid_designation_uuid_fk;
       hr          postgres    false    5225    236    238                       2606    18826 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 M   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       lab_dip          postgres    false    238    5231    239            	           2606    18831 ,   info info_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 W   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    294    5335    239            
           2606    106496 3   info info_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 ^   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    280    5313    239                       2606    18836 &   recipe recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    238    5231    241                       2606    18841 4   recipe_entry recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    242    5243    247                       2606    18846 4   recipe_entry recipe_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk;
       lab_dip          postgres    false    5235    242    241                       2606    18851 ,   recipe recipe_lab_dip_info_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk FOREIGN KEY (lab_dip_info_uuid) REFERENCES lab_dip.info(uuid);
 W   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk;
       lab_dip          postgres    false    241    5233    239                       2606    18856 2   shade_recipe shade_recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ]   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    245    5231    238                       2606    18861 @   shade_recipe_entry shade_recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 k   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    246    5243    247                       2606    18866 L   shade_recipe_entry shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk FOREIGN KEY (shade_recipe_uuid) REFERENCES lab_dip.shade_recipe(uuid);
 w   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk;
       lab_dip          postgres    false    246    245    5239                       2606    18871 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       material          postgres    false    238    247    5231                       2606    18876 &   info info_section_uuid_section_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_section_uuid_section_uuid_fk FOREIGN KEY (section_uuid) REFERENCES material.section(uuid);
 R   ALTER TABLE ONLY material.info DROP CONSTRAINT info_section_uuid_section_uuid_fk;
       material          postgres    false    247    248    5245                       2606    18881     info info_type_uuid_type_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_type_uuid_type_uuid_fk FOREIGN KEY (type_uuid) REFERENCES material.type(uuid);
 L   ALTER TABLE ONLY material.info DROP CONSTRAINT info_type_uuid_type_uuid_fk;
       material          postgres    false    5253    252    247                       2606    18886 (   section section_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY material.section DROP CONSTRAINT section_created_by_users_uuid_fk;
       material          postgres    false    248    5231    238                       2606    65662 &   stock stock_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_material_uuid_info_uuid_fk;
       material          postgres    false    247    5243    249                       2606    65667 2   stock_to_sfg stock_to_sfg_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_created_by_users_uuid_fk;
       material          postgres    false    238    250    5231                       2606    18891 4   stock_to_sfg stock_to_sfg_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 `   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk;
       material          postgres    false    250    5243    247                       2606    18896 >   stock_to_sfg stock_to_sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 j   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk;
       material          postgres    false    250    292    5333                       2606    18901     trx trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_created_by_users_uuid_fk;
       material          postgres    false    5231    251    238                       2606    18906 "   trx trx_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 N   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_material_uuid_info_uuid_fk;
       material          postgres    false    5243    251    247                       2606    18911 "   type type_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.type DROP CONSTRAINT type_created_by_users_uuid_fk;
       material          postgres    false    238    252    5231                       2606    18916 "   used used_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.used DROP CONSTRAINT used_created_by_users_uuid_fk;
       material          postgres    false    238    253    5231                       2606    18921 $   used used_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 P   ALTER TABLE ONLY material.used DROP CONSTRAINT used_material_uuid_info_uuid_fk;
       material          postgres    false    247    253    5243                       2606    18926 $   buyer buyer_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_created_by_users_uuid_fk;
       public          postgres    false    254    5231    238                        2606    18931 (   factory factory_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_created_by_users_uuid_fk;
       public          postgres    false    255    238    5231            !           2606    18936 (   factory factory_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_party_uuid_party_uuid_fk;
       public          postgres    false    255    258    5275            �           2606    73789 (   machine machine_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_created_by_users_uuid_fk;
       public          postgres    false    305    5231    238            "           2606    18941 ,   marketing marketing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_created_by_users_uuid_fk;
       public          postgres    false    238    256    5231            #           2606    18946 +   marketing marketing_user_uuid_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_user_uuid_users_uuid_fk FOREIGN KEY (user_uuid) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_user_uuid_users_uuid_fk;
       public          postgres    false    256    238    5231            $           2606    18951 2   merchandiser merchandiser_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_created_by_users_uuid_fk;
       public          postgres    false    5231    238    257            %           2606    18956 2   merchandiser merchandiser_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_party_uuid_party_uuid_fk;
       public          postgres    false    5275    257    258            &           2606    18961 $   party party_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.party DROP CONSTRAINT party_created_by_users_uuid_fk;
       public          postgres    false    258    5231    238            '           2606    18966 0   description description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_created_by_users_uuid_fk;
       purchase          postgres    false    262    238    5231            (           2606    18971 2   description description_vendor_uuid_vendor_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_vendor_uuid_vendor_uuid_fk FOREIGN KEY (vendor_uuid) REFERENCES purchase.vendor(uuid);
 ^   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_vendor_uuid_vendor_uuid_fk;
       purchase          postgres    false    5285    262    264            )           2606    18976 &   entry entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_material_uuid_info_uuid_fk;
       purchase          postgres    false    5243    263    247            *           2606    18981 9   entry entry_purchase_description_uuid_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_purchase_description_uuid_description_uuid_fk FOREIGN KEY (purchase_description_uuid) REFERENCES purchase.description(uuid);
 e   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_purchase_description_uuid_description_uuid_fk;
       purchase          postgres    false    262    5281    263            +           2606    18986 &   vendor vendor_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_created_by_users_uuid_fk;
       purchase          postgres    false    5231    264    238            �           2606    73808 6   assembly_stock assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    238    306    5231            ,           2606    18991 B   coloring_transaction coloring_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_created_by_users_uuid_fk;
       slider          postgres    false    265    5231    238            -           2606    18996 L   coloring_transaction coloring_transaction_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 v   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk;
       slider          postgres    false    265    294    5335            .           2606    19001 B   coloring_transaction coloring_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    270    265    5297            /           2606    65682 3   die_casting die_casting_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 ]   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_end_type_properties_uuid_fk;
       slider          postgres    false    259    266    5277            0           2606    65672 /   die_casting die_casting_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 Y   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_item_properties_uuid_fk;
       slider          postgres    false    259    5277    266            1           2606    65692 4   die_casting die_casting_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 ^   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_logo_type_properties_uuid_fk;
       slider          postgres    false    5277    259    266            6           2606    19006 F   die_casting_production die_casting_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_created_by_users_uuid_fk;
       slider          postgres    false    5231    238    267            7           2606    19011 R   die_casting_production die_casting_production_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 |   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    267    5289    266            8           2606    73739 V   die_casting_production die_casting_production_order_description_uuid_order_description    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_order_description_uuid_order_description FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_order_description_uuid_order_description;
       slider          postgres    false    291    267    5331            2           2606    65702 6   die_casting die_casting_puller_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_link_properties_uuid_fk FOREIGN KEY (puller_link) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_link_properties_uuid_fk;
       slider          postgres    false    266    5277    259            3           2606    65687 6   die_casting die_casting_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_type_properties_uuid_fk;
       slider          postgres    false    266    259    5277            4           2606    65697 <   die_casting die_casting_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 f   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk;
       slider          postgres    false    266    259    5277            �           2606    81946 ]   die_casting_to_assembly_stock die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc;
       slider          postgres    false    307    306    5359            �           2606    81951 T   die_casting_to_assembly_stock die_casting_to_assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    238    5231    307            9           2606    19016 H   die_casting_transaction die_casting_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_created_by_users_uuid_fk;
       slider          postgres    false    238    5231    268            :           2606    19021 T   die_casting_transaction die_casting_transaction_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    268    5289    266            ;           2606    19026 H   die_casting_transaction die_casting_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    268    5297    270            5           2606    65677 8   die_casting die_casting_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 b   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_zipper_number_properties_uuid_fk;
       slider          postgres    false    266    259    5277            <           2606    19031 .   production production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_created_by_users_uuid_fk;
       slider          postgres    false    238    5231    269            =           2606    19036 .   production production_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_stock_uuid_stock_uuid_fk;
       slider          postgres    false    269    5297    270            >           2606    19041 <   stock stock_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 f   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_order_description_uuid_order_description_uuid_fk;
       slider          postgres    false    270    5331    291            ?           2606    82054 B   transaction transaction_assembly_stock_uuid_assembly_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 l   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk;
       slider          postgres    false    306    5359    271            @           2606    19046 0   transaction transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_created_by_users_uuid_fk;
       slider          postgres    false    271    5231    238            A           2606    19051 0   transaction transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    271    5297    270            B           2606    19056 <   trx_against_stock trx_against_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_created_by_users_uuid_fk;
       slider          postgres    false    272    5231    238            C           2606    19061 H   trx_against_stock trx_against_stock_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 r   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    272    5289    266            D           2606    19066 +   batch batch_coning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_coning_created_by_users_uuid_fk FOREIGN KEY (coning_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_coning_created_by_users_uuid_fk;
       thread          postgres    false    274    5231    238            E           2606    19071 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       thread          postgres    false    274    5231    238            F           2606    19076 +   batch batch_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_created_by_users_uuid_fk FOREIGN KEY (dyeing_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_created_by_users_uuid_fk;
       thread          postgres    false    274    5231    238            G           2606    19081 )   batch batch_dyeing_operator_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_operator_users_uuid_fk FOREIGN KEY (dyeing_operator) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_operator_users_uuid_fk;
       thread          postgres    false    274    5231    238            H           2606    19086 +   batch batch_dyeing_supervisor_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_supervisor_users_uuid_fk FOREIGN KEY (dyeing_supervisor) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_supervisor_users_uuid_fk;
       thread          postgres    false    274    5231    238            M           2606    19091 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES thread.batch(uuid);
 Z   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       thread          postgres    false    275    5303    274            N           2606    19096 <   batch_entry batch_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 f   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    275    5311    278            I           2606    19101 (   batch batch_lab_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_lab_created_by_users_uuid_fk FOREIGN KEY (lab_created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_lab_created_by_users_uuid_fk;
       thread          postgres    false    274    5231    238            J           2606    73794 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       thread          postgres    false    274    305    5357            K           2606    19111 !   batch batch_pass_by_users_uuid_fk    FK CONSTRAINT     ~   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pass_by_users_uuid_fk FOREIGN KEY (pass_by) REFERENCES hr.users(uuid);
 K   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pass_by_users_uuid_fk;
       thread          postgres    false    274    5231    238            L           2606    19116 /   batch batch_yarn_issue_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk FOREIGN KEY (yarn_issue_created_by) REFERENCES hr.users(uuid);
 Y   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk;
       thread          postgres    false    274    5231    238            O           2606    19121 2   count_length count_length_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_created_by_users_uuid_fk;
       thread          postgres    false    276    5231    238            P           2606    19126 4   dyes_category dyes_category_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_created_by_users_uuid_fk;
       thread          postgres    false    277    5231    238            Q           2606    19136 >   order_entry order_entry_count_length_uuid_count_length_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk FOREIGN KEY (count_length_uuid) REFERENCES thread.count_length(uuid);
 h   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk;
       thread          postgres    false    278    5307    276            R           2606    19141 0   order_entry order_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_created_by_users_uuid_fk;
       thread          postgres    false    278    5231    238            S           2606    19146 :   order_entry order_entry_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 d   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    278    5313    280            T           2606    122895 2   order_entry order_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 \   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk;
       thread          postgres    false    278    5235    241            U           2606    19156 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       thread          postgres    false    280    5259    254            V           2606    19161 .   order_info order_info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_created_by_users_uuid_fk;
       thread          postgres    false    280    5231    238            W           2606    19166 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       thread          postgres    false    280    5263    255            X           2606    19171 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       thread          postgres    false    280    5267    256            Y           2606    19176 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       thread          postgres    false    280    5271    257            Z           2606    19181 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       thread          postgres    false    280    5275    258            [           2606    19186 *   programs programs_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_created_by_users_uuid_fk;
       thread          postgres    false    281    5231    238            \           2606    19191 :   programs programs_dyes_category_uuid_dyes_category_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk FOREIGN KEY (dyes_category_uuid) REFERENCES thread.dyes_category(uuid);
 d   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk;
       thread          postgres    false    281    5309    277            ]           2606    19196 ,   programs programs_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 V   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_material_uuid_info_uuid_fk;
       thread          postgres    false    281    5243    247            ^           2606    65612 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       zipper          postgres    false    238    282    5231            `           2606    65602 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES zipper.batch(uuid);
 Z   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       zipper          postgres    false    282    283    5317            a           2606    65607 ,   batch_entry batch_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 V   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    283    297    5341            _           2606    90121 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       zipper          postgres    false    5357    305    282            b           2606    19201 F   batch_production batch_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 p   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    285    5319    283            c           2606    19206 :   batch_production batch_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 d   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_created_by_users_uuid_fk;
       zipper          postgres    false    285    5231    238            d           2606    19211 D   dyed_tape_transaction dyed_tape_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 n   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    286    5231    238            �           2606    131096 Z   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk;
       zipper          postgres    false    313    5231    238            �           2606    131086 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_order_description_uuid_order_d    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d;
       zipper          postgres    false    5331    313    291            �           2606    131091 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_ FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_;
       zipper          postgres    false    5347    313    300            e           2606    19216 U   dyed_tape_transaction dyed_tape_transaction_order_description_uuid_order_description_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
    ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_;
       zipper          postgres    false    286    5331    291            f           2606    19221 H   dying_batch_entry dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    288    5319    283            g           2606    19226 H   dying_batch_entry dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk FOREIGN KEY (dying_batch_uuid) REFERENCES zipper.dying_batch(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk;
       zipper          postgres    false    288    5325    287            h           2606    19231 f   material_trx_against_order_description material_trx_against_order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk;
       zipper          postgres    false    290    5231    238            i           2606    19236 f   material_trx_against_order_description material_trx_against_order_description_material_uuid_info_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_ FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_;
       zipper          postgres    false    290    5243    247            j           2606    19241 f   material_trx_against_order_description material_trx_against_order_description_order_description_uuid_o    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_order_description_uuid_o FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_order_description_uuid_o;
       zipper          postgres    false    290    5331    291            k           2606    19246 E   order_description order_description_bottom_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_bottom_stopper_properties_uuid_fk FOREIGN KEY (bottom_stopper) REFERENCES public.properties(uuid);
 o   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_bottom_stopper_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            l           2606    19251 D   order_description order_description_coloring_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_coloring_type_properties_uuid_fk FOREIGN KEY (coloring_type) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_coloring_type_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            m           2606    19256 <   order_description order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_created_by_users_uuid_fk;
       zipper          postgres    false    291    5231    238            n           2606    19261 ?   order_description order_description_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_type_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            o           2606    19266 ?   order_description order_description_end_user_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_user_properties_uuid_fk FOREIGN KEY (end_user) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_user_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            p           2606    19271 ;   order_description order_description_hand_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_hand_properties_uuid_fk FOREIGN KEY (hand) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_hand_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            q           2606    19276 ;   order_description order_description_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_item_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            r           2606    19281 G   order_description order_description_light_preference_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_light_preference_properties_uuid_fk FOREIGN KEY (light_preference) REFERENCES public.properties(uuid);
 q   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_light_preference_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            s           2606    19286 @   order_description order_description_lock_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_lock_type_properties_uuid_fk FOREIGN KEY (lock_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_lock_type_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            t           2606    19291 @   order_description order_description_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_logo_type_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            u           2606    65536 D   order_description order_description_nylon_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_nylon_stopper_properties_uuid_fk;
       zipper          postgres    false    5277    291    259            v           2606    19296 F   order_description order_description_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 p   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk;
       zipper          postgres    false    291    5335    294            w           2606    19301 C   order_description order_description_puller_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_color_properties_uuid_fk FOREIGN KEY (puller_color) REFERENCES public.properties(uuid);
 m   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_color_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            x           2606    19306 B   order_description order_description_puller_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_link_properties_uuid_fk FOREIGN KEY (puller_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_link_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            y           2606    19311 B   order_description order_description_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_type_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            z           2606    19316 H   order_description order_description_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_body_shape_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            {           2606    19321 B   order_description order_description_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_link_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            |           2606    19326 =   order_description order_description_slider_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_properties_uuid_fk FOREIGN KEY (slider) REFERENCES public.properties(uuid);
 g   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            }           2606    65552 D   order_description order_description_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    300    291    5347            ~           2606    65712 A   order_description order_description_tape_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_color_properties_uuid_fk FOREIGN KEY (tape_color) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_color_properties_uuid_fk;
       zipper          postgres    false    291    259    5277                       2606    19331 B   order_description order_description_teeth_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_color_properties_uuid_fk FOREIGN KEY (teeth_color) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_color_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            �           2606    73729 A   order_description order_description_teeth_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_type_properties_uuid_fk FOREIGN KEY (teeth_type) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_type_properties_uuid_fk;
       zipper          postgres    false    291    259    5277            �           2606    19336 B   order_description order_description_top_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_top_stopper_properties_uuid_fk FOREIGN KEY (top_stopper) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_top_stopper_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            �           2606    19341 D   order_description order_description_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_zipper_number_properties_uuid_fk;
       zipper          postgres    false    291    5277    259            �           2606    19346 H   order_entry order_entry_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 r   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk;
       zipper          postgres    false    292    5331    291            �           2606    19351 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       zipper          postgres    false    294    5259    254            �           2606    19356 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       zipper          postgres    false    294    5263    255            �           2606    19361 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       zipper          postgres    false    294    5267    256            �           2606    19366 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       zipper          postgres    false    294    5271    257            �           2606    19371 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       zipper          postgres    false    294    5275    258            �           2606    19376 *   planning planning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_created_by_users_uuid_fk;
       zipper          postgres    false    295    5231    238            �           2606    19381 <   planning_entry planning_entry_planning_week_planning_week_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_planning_week_planning_week_fk FOREIGN KEY (planning_week) REFERENCES zipper.planning(week);
 f   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_planning_week_planning_week_fk;
       zipper          postgres    false    296    5337    295            �           2606    19386 2   planning_entry planning_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    296    5341    297            �           2606    19391 ,   sfg sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 V   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk;
       zipper          postgres    false    5333    292    297            �           2606    19396 6   sfg_production sfg_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_created_by_users_uuid_fk;
       zipper          postgres    false    5231    298    238            �           2606    19401 2   sfg_production sfg_production_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    5341    298    297            �           2606    19406 "   sfg sfg_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 L   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk;
       zipper          postgres    false    241    5235    297            �           2606    19411 8   sfg_transaction sfg_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    5231    299    238            �           2606    19416 4   sfg_transaction sfg_transaction_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    297    299    5341            �           2606    19421 >   sfg_transaction sfg_transaction_slider_item_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk FOREIGN KEY (slider_item_uuid) REFERENCES slider.stock(uuid);
 h   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk;
       zipper          postgres    false    5297    299    270            �           2606    32790 ,   tape_coil tape_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_created_by_users_uuid_fk;
       zipper          postgres    false    300    5231    238            �           2606    32780 0   tape_coil tape_coil_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 Z   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_item_uuid_properties_uuid_fk;
       zipper          postgres    false    5277    259    300            �           2606    19426 B   tape_coil_production tape_coil_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_created_by_users_uuid_fk;
       zipper          postgres    false    5231    301    238            �           2606    19431 J   tape_coil_production tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 t   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    301    5347    300            �           2606    65597 >   tape_coil_required tape_coil_required_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 h   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_created_by_users_uuid_fk;
       zipper          postgres    false    238    5231    304            �           2606    65577 F   tape_coil_required tape_coil_required_end_type_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk FOREIGN KEY (end_type_uuid) REFERENCES public.properties(uuid);
 p   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk;
       zipper          postgres    false    304    259    5277            �           2606    65582 B   tape_coil_required tape_coil_required_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk;
       zipper          postgres    false    5277    304    259            �           2606    65587 K   tape_coil_required tape_coil_required_nylon_stopper_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk FOREIGN KEY (nylon_stopper_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk;
       zipper          postgres    false    259    304    5277            �           2606    65592 K   tape_coil_required tape_coil_required_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    5277    259    304            �           2606    19436 @   tape_coil_to_dyeing tape_coil_to_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 j   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk;
       zipper          postgres    false    302    5231    238            �           2606    19441 S   tape_coil_to_dyeing tape_coil_to_dyeing_order_description_uuid_order_description_uu    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 }   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu;
       zipper          postgres    false    302    5331    291            �           2606    19446 H   tape_coil_to_dyeing tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 r   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    5347    302    300            �           2606    32785 9   tape_coil tape_coil_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 c   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    5277    300    259            �           2606    19451 .   tape_trx tape_to_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_created_by_users_uuid_fk;
       zipper          postgres    false    303    5231    238            �           2606    19456 6   tape_trx tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 `   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    303    5347    300            �           2606    81932 *   tape_trx tape_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_created_by_users_uuid_fk;
       zipper          postgres    false    5231    303    238            �           2606    81927 2   tape_trx tape_trx_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 \   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    300    5347    303            �   o   x�+/K�.tJ67��J-���tJ�K�ILI-�P 2�9�����7�$#3+#55�3-1�8�����D��R��R�������Ђ3Ə3�8%���%�=�,�7��%���ѕ+F��� �E      �   2  x��RQo�@~>~� �܁�F6��$s�M�/N872%3�_?NE���a��\�^����M��,���o;kI,/8x��ijg���5u�@�C�A�a.@N|ʐ��,* �6��N?���f�����S�F\�yH6�Kk�ļ=rmw4:��H�
Hǒ� v��n�JwUh�����>�eO��+-_/w�
�����JwT��h��%���v�]7�J�3*�*�� s��qHV����(Z9���<�m�s;e^g��	��)� �ͧ䡷�{�6k�2�z8�65�(�H��}%H�@<$si\�4�8U�;      �   �  x���[��0ş�|
��:i��|� `Duȼpig).� ����n&�l�c�ٶI�Ӥ9�����/�}g��.���<��)�G�}r=K�/��MG&���yDQ��.pL�1�i~9n|�B�zI�4%�(MgL���:��t?l���X�}YfG�X3����́s�؇a������
�jƯmO=�s�5�M��D$��{X�`���>�Z�-+a�B�I
n�qd����@s����[�j��>߲�X�մ��� ��"��.#e����� ��lzZ���J#u݅-+�-5��PKG�$�L��b9޹Abb�5����{M��f���f+E�8����'F?俠�b���鈨ɤ�XX�K`��j+ۓ�&���|)�+�(�m��"�k*K{h��`�#�49Ġ�m���?~��f��o�A׾�S��,�;K'���7M�7�X��LX��f�Ax�s"7      �   �   x�U��C@@��?O��\������M"6�--����k�EO��sT"�&�ͭ�]������^9��~��:�@x	(�\ǶNl���qId�2j�CZsw캤:�!�s�������$��n�f�9�5��� �!R0�`f ���L,�      �     x����N�@���)���e���5���SE���(%�C+�K�<��4�$M��L�o�yT�Epo;��.�m�
 ff�j�W���s`���Ҙ��O� �]R%^�EU���M{�R���Zz�c'"C+>����i���OVO�<��2xB���l��v�a%���a��oE\��(<�֩���;O����#)���+��`���7|v���oe��3�dP?w�h���E;G�G����H��Jg2"~�}uUE�ovu'I�'	�#      �   �  x�}��r�@�q������i�g������GF��W�{�j�>GJ3_,P4l��$X���:}#�$]�]h�B���dO? ~��3�O�@9H9��qc�rC�5�a_�劾v8�d�Y�7�����$�����;\���y��/�P���8�F�ts�Δ�>���>��7���j�z���ޚ��W���C���O3�����j����>ū��d�ĵsR���3�;`m��Z��N^�.)Q$PL�-����}���浸�̗�6�*t�S�!��8��sr�q�4BW��q5PE���ɥh4��6� MP8B�ae��ѲG�����Oӆ�_�z�'� ��Z]k������>v��z���^�3J<��N�������b��S�x����a�o�g��      �   u  x����n�@���}�����ri�bE�q#k[T��;ҝ$�d2�����9F����̎��!"6@�e�V�o�;���"��0}@D`*K��t;yM���/�<R��	�����lڻ�USH��QKZb�������R�R��.ʡN�ɺ�p��x�?[�9��k�DyV�_��㫐Թ��%��p��`��ƈ`Z�n�z.������婭��0N<���j�M~�㪂p��%�Z�;&=���(�h�N�����1w�W5���HA0���+˩c4Q�th|⤜&s7�.����&�\�.X����T1Mq���٫ѧ�����}��wXw���!�c�5,X����wF���GEQ~�C��      �   Z  x���Ɏ�PE׏��4�7�o��b#"j�0)�2i��7�i�,���r�MU��,g��q�|�`��}y0�ŗ588a���b��ȼ��
 �H��7D��=is*�� ��DO)�rH(ζ ��dJF����\�phF�rH�4s�l����w"����2�>3�0#�.k0�̸(�z�������6�����a pЖ���r����i���uz�1dX2����l�����EQ1�ff������2���ǰ�+�(W��SD�-�a17U�r����8�����9�'��5uk&���)	ᰓ䖚����Fu<D8��_�E5T��h	��%��      �      x�=�[�$)E��3� !�����%�QDd�uWufF�A\����EJW�ُ���κ��]��{����:�d멌1E4�{};�\jmުzy�S�����V﹮u$m�\]��ݤ��snw��դ��m�bg�Q?��֪g�s����;�Fr�g�2+;:{����FN���W�h|�S���l��X���Ǯ��y[],�wK[��3�ȥ��춾�Lw�2nge���h=l�SВ�܋�W�t�,����%���o1�����{R�v�H�g�h���b'��
67і����3����m�_�]nMCg[�jl�ܱ���~o4���]~������͹�I#qp�}��Q��#ї�cV_�v�F�"{rN����߂��h}���/A�۷k�yf.srnKgm�f���:��\�č&����W�K�B_hT٥���X,���`�gM�N���kJ�Nխi����̪��Q�r��1���V�d[zS9�m��7H*�硧߫��m8���eb~�&=���R֒^��7�9M�g-lPj:4dȶ�F�Y�ϖ�Kr��5�����{�W���MR��ӛ�m��9
��9�Uܫ�������F/��L�W����+�9u���F�FI��^�s;iN���<��,��-6UV-K�0��bKM�c}��eI�{��9r)���1v q����	6
P:�f�߮5I� X�>
�P���;��}�0m�V�ɹ��(�>e���l�ֱ�m�_Ek��+�ak^��
[R�>j�53zu�<�b��=�Y�xN$�~hfm�[1&�z�01��b@�]�'7�R�uM``� (I~ng̀_v0� T~�v�eb$F�Z�4�����S<�K����M�V5��8�ͧt���9��Ơ�0��O�|�Ҙ�|ʦ
����1X��u���H!sf�h:>����*�$ w'Ȼ�Dw5ϑ�<�
�)w%9��Em�\�TL��g�F�TƝ�v}�<m_����Nu���&�q�AY��d�w��0[N�����Ut�́�9?,d�ܩ���m�v�tk;yޛYo��2�8\�g^?���oET����\�Ly@v6���P����W�����
����m�C�Gض��ۯ�vM�ҙ��[�B�hȐ��N�s1�� �r� Kcv[�;��/zD5Ԏ)��+��Y0f�K���B�;,����33h�M��4D�ݹ�>��bI���y��Ө�H����֔C�쌑&$n!������Ӻ'}���=�V�hO�Y�\��9C�􅢏��>TCe���vjM�7�LJj�*�ڍ]�gCۆ0*��ŉ'ϛ�ͦ�P��v�(�E#��]�[�Ô�����j��� 
���^$j��؂��-��}ԓ��3�*�F�����vZqr`:`��P���H8$�γ����p�<2
����u�)XB�-�`����V�	2�{�X�^�,u��.S�.�Z귏�îkz!�R�(~������+��*ni��w�MT�x-��e��6~fҠ���b֣GG�be <P]qQ{v�q�z���'Ԟ�Eፅ�*v|�JK}vVD�?���Ύ�f$�ؙ��YU/-��
�	�1!ǜ����a�Ӳ҄C+��[2μ1��m���}�yq,L�O�3P���%g3�؞�wkX�D��l�7�ϲe+h	�7�vt4������af���H���2�u_�qJ@m�Յe�e0}8<�l����'�0��T�T��t!ysmuLY-��`�L�\#��7�0��t4�V��AC.���B)�GJO̘q�����Y���Uh����0��@mƥ�E7��|�5�<�YykzF�Yì�dq�
�/�;�)~CU0AX��j�V�μ�`�ǿ3�/s�o�G�h��\��۸�c��%,L����Ŕ��`�	��P˷bF�0�]ߚ�%��R�^�{���L��8V�H��'cD��Tڮ�fQ� \Q[��=���A��"�l�36���Q��"�d��Q�s��c���*�p>����4�<�Ԧ��b�k�j�����j�ozo�����y�*J�a�ߪϾ��|����=���q+�IF�����
��%���_E4C���dJ�D.�0�7!%h �y�_������A Wc���W��W{�ǎ��e#h\6���D��]ʐ�P�� ��Sٯ"�P���}`��;7V��Z�
�1��ְ}FŔ�����WтAy���rB�+
�k)X�٘��Y���%#�83(��'Ё:0��PҫW�3�T������d�	s��# �~��2R;��c }Y9�s�z��b^���'�\�������{V�~�)L�Z{�9J��H�69����O���K�!�`�hHJ
t>GE�̈Y�m�*y��^4�6���x��5*���S�<3ry(�G�$�|ڜDa���@i�<m�u��|�~���ca��_�	Hbh�����z�c��5j��"���Ƽ���~g��Gf�B%�u�XT����W�L�3���a��)q�N�ꊬ�0r"�Uff�C�Af%!��$ ��BNt��?cGq�y(��i�t�SX��!����F�|h; e�ۘ_�%݁��lz`S\�n�PD}�	��[���㚕<#��4B��ެ���B��E/��9��D�ѫ�I�%����=��vg��`N
�b�l��_�{Ev'���B�]<^�.�f��of�" �{�Dv�t��$n��P7X�����ġ����|&6y��$䟸��=(�%������J��+�=������u�e�%��
�	i�����oEr��ǧӚݱ"�(�r�)'p�d���aq��������/�:1��,�󿘌�j	� �toxy�n���@�{D�}+��q�Ta[3�`���\qK���h�B��`g��������H�;�{�7i�bP������2p �8}�$�f��CT�����!F���IeѦR�n���-��=��Gؼ�maQ���^�yC�ze�h#��|!��L�*p\b���5$'�Y~�FB����wh&�԰b9L�*L�̸�5Q��ZL��I��@7]��۷b7�=�����u�;�Ķ��t��$"�Ը��@����D � ��í�*�u�L!f��?R�7�(5aM8l�ya������5n'N�^~*�?�-�&�����Lpr#�WB�i�7h�0��z:�|H��Nf��)�U�#�� �r!E5�-�v&���. ��C�.s'�A�hW���A:�����K�1���R6�pX�I��0�
$u\��QӚ<r��`8����������GMe��)��㶉��:��25Jç,�/�h�ޛa�"J&e��T�S����VC��9�ⶐ�ʶ�U��ދ���;Y�W^�G3a	�w!/TǷp���ݬd�>���(���h���=�_��hHJ�Z{�������a����!	/S$���$�������*�̫Qў�%��b�y>���6���f� %�%.��]5|�w���v|��'.�g�D�`��~�<��ܡ3�����k���aR�p�h�ׇ�4����8Ξ(�pp�5(%��
� %m�!Y�yG��`"iC���v&�1{����f}��L�y��?���A��lP��aif4׹m��3,2R��Ƥ�������C$x�D�AF ���0�h5M×x,e��G��HD7�U��::
�^�=�����1���T�@	S�#�'���,����f�_ky{y,��i �AT� c��-N�=���X���Y>���q7�N|�*��ئ���
W�%�ex�$���+tt���.!_8�v":�M������W�*�Z�j��*��\�)�l�|<T���y��00��t9�OJ��b��oom���ɟ[cf�'*�3x�uO	��%@�� p���OP�q2o*R\������2������8�K{'�G|j�e�z��W
o����L�m�{�D��b@������H6p��2s��Ղb�7��V�������z~����M����q�I[�� �   �aJ�W��Y1]d�4���~g�4>�˳�'�ލW�f�3��G�.�l�t�������Y�$,���ofL�'sa��K�(���t��HA��~	��A���<���
�CJd������
]������@=����)h�`�2���1�)':*ȡ'�5q�[�����=W��x2�Z��������Ô@��?��2E��>r�+�}�*f�~�u{.��<�Cf��U�N�c�IX�l�`��g�؍�]�_�x-��d`\2Վ�P�kg	,��#��0bʹ90�|�j�����0����q���
��	�ɞ"�|����	y��JJds��.`�OE�����+��b�?��j�?�ZǸ|m����1n7��gF �hpLOG�[.�cqe9�8�V<�>�&���B7.���c�*O���h���vѬ',�g-���irXz@2�W&��?X��N���;�O��I�$���Y+%��W;$,���c��M��B3T��_�	^H��ƕs����$��a��5.+J���ٟ�e=qe�G�EpɜEgN�RD>���ʯ��bB�gA��QR~�'d�������5j�v�Ż�m�>�?��� �Tc1iA������5�Mr��O.?Avx|"`�09�,��"kP&�e�#��J�{� �gXR����F�`!��\N�^��!�|�ٍ���أ��x�_I�2�Q�X��w��LDؿ��!_�M��J��D�"�?��Jp��}I1;�	\�����B	��]� />���	w�X�I =n�/�2��D�������A�lu6.q�l�1�X\�xE �h�r"!�Jυ]��/�Vq$i�=�$Y�*J
��$&����X���=T\���Q�Ƣ����$ј�wJ�Ƕ#���^s��$ ~�+P�xu��+NDF68�`K����w��c�dy�>;N�Z�F�t�Kb�{�W@5F�
 �6]��8��Kq�� ;G�54y|�q?�wRH�m�SF3�>�� �ܽ'��Sh\ڷ�_I��J��Y6j����F���PAM	�`8��'P���}�剻��;���mq���E�2��i&���n��f	w���m+�qs[��ȷ�Ih�⒙��
a���{��?�,j      �   �   x����n�@��w�b_�fXa�@��U+�J��a�)��Dxz%!�&�0��&���L�������e�~�b�@� N�6�Ƅ
�4)tI5�}��̦�a��j� t�y�� d�?���_��$���EJ^�j�*����!3\�������a�֛�3r�+�(a�dTr:n?�y�T�����u�[���M�T�L<~��r�L/�Ny�'_7vF���K���evL��c����ِ���pm8�R�Q�>`��8�i�      �   "  x����n�@F��S�6sS`vX1�BZ�"�8^P������X�I����#�K�vG�z�yd�w.|U�� CL;��@�"ʈ� ���)O��9h�f���{XrS�u�V{�����n:<����8 �C�Wщ�N*d����BPEC����o����<�HE�a�(�x�n�;Ɏ�<�*,.�ʜ�L^g�ע�G�F����˺:#�n�KL�E�
valO��5���@zf�r4y%h���A���6���U��pC��"��z��8p��t���c�da�u����MQ�����      �      x������ � �      �   �  x��]YS�J~��²���$��iQDDED�;ST�4�Y�n������v�#�|��,���;!�*�J�[�K�������Ǐ�D)ƫ2��m~c�ob��>�����C|ڽ�4�A��a��u���m�4���g�>�����o�f{
b����C._��tn!4���w�*Є��?g����3U��h�@���]2������3^�^c~�b�M�-E����7DUA�:j I��E�:R�J@���C(,�=mi4'�Z�>?3���D_�i���V�Ҿ&�NTm��&@	Hþ������h�����!2�z��6&j|(���V�����4��}�"�R��A�c�݅��$^��8��'�wj�����h�9�ճElp6��0���� y��ԡ��%��:I����m>^-��V�����N�pI�hN����FǺ�h�	*m��	��&� ��#����JD�	�<��?
/�hLmk@ƭ�W4�D��Y]�F�)k���z=	�S�X��Ų��qF7ԏ�8�� ��{e��ZfT� �f�Σ��^����Y�&Pz!a�/���
��YIuc7[��ol�{�� ��F4ZRKP�,n�X��	`/+|W���|y��\�a��t�Ѻ�P�P�i!��������]	z4�����$��l�1	�8�C�j��8cG���^��vh̶(�"�F�
b���p���eu���}k��QWU�G@ڑ�97I|�7\ �����*L0y{��)-tD�����u�n�]1?��.�V���N�X ��Hu�X���>��Q���퇓��ZԲ_lr�����a
�nQl�@���Ul�-��k.paxtVSp�]ƈ���[�P���!%��-օP��L$�C�l�����V�3}�5te�v\ "̼�5�l��o���ݱ�O�V��aƫǁ���M]��
�O�M`𛞢8
�p![�a e"YC��K(�-Q��%1��,a�ذ�!#��^�3����Uq��i1v�+B��8�+ ������.�&{��P�g���J�����MK���}:���q ���./r{��b��+�M۳�gf����=�8^�T��#���]�W�C�ma�h�[�#l��k��;�;��+p�p���6X�8��,XDK^E�^�c�q�u�ax�Q�r�6"~�d�E.�*b�d�����KDIa;��E[�7�6��{�Ӧ������Q�;v�m$�u(7�	f��w�eEk�K�F���1h���F �"ZP�!If�؇V��ԡ��#�P��Z��2��V��(��`���]MF��"#65`�UYp׎��J_Em�:]����X��h&���CgRK���4���O�x6Agi�[�2CP7N��
�j�\���5u1P��X猎��M������Cnz+<��P��S"ȼ���\��˥Xk��zE�9{�6��}$�F�Q�3�S����,_5�9e�l"����+�$�t{�	Jr}̪���$N�@i�珖���b��n%�h��{W����U�Vׯ��c�z�sE�X���.+�	�=I����U%Ɣ�Ƿ֠�U�V��/as���£?.$����5��op`�BNq��1�@��_�����4Y'3g3\b5���L*K��h2_��O:�$�T�漓�P�^j��b��,Pe�472�G������k�V����ܼ=�Ll$��G��χ���+����/v���\�3Q�Nx�D"a��2�x<�%W�NYS5��2�UgM�D6��TYOF�-��{_k��4kG��TJ�ZHZ�B�Z�ڝ$�e�Xt�i-�Q�>Z��݌�.��n%"$C�d�l�bY�d���!����N#�d�l���`+�-_��복�(���`y�M���f_8o��km>{J�������;س���ϲQu���vh`z�X��_�a�E��F���{��a%ո�RW\��b�9�_&�Ϋ����Ce�wD%�*�������CR>��H�I�!�?$�����ԟ S��,<I�!�?_+�g	��5H��W�b�y�M2�Lg��o<e��������_��$�g E��L�S���b�?/^ʓ~�7U�	�����ȈŪolF*��R��&�jMx�ST��{���[|Mz�Կ�� �����H��Mv�wٙ�CQ4�Ng8�����D�x6���>e��QQ�v@�\��v��S�h�	0(���M{KĀ椙�]���pl�yx󒆯�����wC��iQ���{7�K���K$�W�� $ɮ�;��������,]�g-DɅ�����H�'=�fWD̐�%)�dW�슽����rM~+��䃭Dh�&��Nތ����e[���(�������W������(�ۄyv��������G������w�ә�����ZK~p��qX��!h��{?�a�!X�BT?K��'q�Ќ�1��YػP�	��`��	��}!�܉����	�p��(w�&n�3C�~܁�Z�^���+�Z��@[��p�pU�У�C�����2%h���)c�����^sP�M߻���N�xh��k�]��9N��q����nXz�����/�Ǖ���g������.�P��)��X�U�I$I�Y���)��ƙ,��)�5���J�7.h��)U5�<�o���B��%�o��bb����/+fJ��W�막֝J��e7�ğ��<�j�^�=���1Grz���.QG�Z	��:�!@#�7!@�6� I�� I�۠XV&�X�zi�z� ��F4��n��l��o��f����6^B��z:��reIwK}�wL^WM^W�cBW�u�{`ى	K����',i&,�M�aI����%��%�і&,i>��$,�=*aIc��4aI�:���V7�:(^�&�ӡ��� [-;�9W{/\m��34��4���v�1�4����D�"<��������      �   /  x����v�Z��+O��Y�`s���]�G�T���V�ZO�v�����/��lH���p��� 3��,�-��B����x���g����~󬑌V��s����/��B�""�0��m���n���߼�e�D��bMrM�� X��	����Gw���e�d�b���|A���>����k�B��d�	+�d�>G���
�*��@+"�.G[�&R~p|��&/�A��{�q69@��"���HS����0��^�y�DzP��[�ѢM�>v��=n�@d��Q�3<>���J��"u$M�gV^���JT��[���ς\NdF����>6�?�� q�g������>��8��P�HW'N�∪���_�-+*�4\�/�t'	F8�ٕea�3� �������i_$�[-+��k��ߣ��"|ݯ�w���Q ��4`>3�{�VF����{�ю�P� �ܣfE��VC���*Tz��pǝ$� �.fМc�lw��h0�(K��d�>���������ܘ,�ܖ�A<S�:�#CV�V��M|3� �ZV^Gv��W�,.GێU`�Y���é��y@!�{�@E?Ey��Z�z�����a#�Q)�ܕ��M	�nt��x	|�޹�be��W�j���F�Mn�g��q/��r�j��6�k�[m9N��Xa��5��"A��Ӄ>f�FwthJc�X8�8������*V�Yy������N���{*+�z��V��m<:5�q�f��EX�p������Fw���˙�ŷ�K��,��ƺpl�,�d�4�}g��d_܍U�*�r����9�����I�?�qڍ�����R���'ي31\IPp>L��t���g'k*��p����MYL���`
N�f�d��砛�ܓ��2׍Ys�~�rS��3�t9"Y�����ن�k	�m��M?Z��o����;拔�m���I-ou�T���m/=�EO��W-�Ckd��Tu��6t�a�^:���y�X�O^��1y��G�Z��cӟ�W���w���7p^�n��Y��A�ʟ=��?///��Vw�      �     x����N�P����� ���Zv�B���7@��zJ����M�%nLf�g2_��]�����uV�`��Xu�f�TG1Ӏ�O�e��N,#*� : lk�3/7!��T(��Bf
Ӛ�Q[վU?���H �s��F�7[p��&,�i��ˆ~� vV�Ϣ�'��4���U��߶&#�����B�.�0XnDA��g5]�uV��j�p�@�E�?�6����5��ԭi�#Ǣ�w��8	媿�H���;b�      �   1  x����n�@�����f��@�݈/�((M7r�)U���M���:9ɗ��a�Z���ë;/�ed49��XՏ��1F���.� M&��;���j3HD�M�;��EU�A��m�\JIO�y���(/������O~$�G�*1�Q�֙��w��T�8ˢsi��ھ�X��!�/� Yyh'����K�z���*]"c����Y43=�_����W��B�14lq��E~��c	�'Vm���i$���N���v�:��[n�p��mzMُ��XV�a��OK#q���$I߾x�a      �      x�+�s1���Lω��p10�44�ts�52�,�(�4��Lw1(�t��
��JM-�4202�5��54W04�22�26��������M�IML���̏rMu//r�Ov�H�44��hJ��V@�h&��qqq �,      �   �   x���K�0 �u{
/��kK,�"!��47�(���xz�7�&c�2���]y{O(Ը��s<N,	G eU�2����Jֈ(#QBy��}��T3��6.��e�������v�����
�ó�ы��n�!j筹�"�;:]+���(U�l�/;���7���V5+��&�����}�� c���U�      �   �  x����v�0���S�ڕ��[�T��֮ޤ�r4k}���e�[7+	!��f��5�.�l��,u ��q竷L��{���XDJ��8jE��
�#�@��k��-� ����b�P������7м����׶�	 ���]��	�v48�x�`�@�~�i�γC�V�3{S�=9Ż�ݟ��~0��R��$��u@���~�j�"yaT��3�A��?)��lK�Q��[腜�a��pK��}������w�#����A>�vXJy\ʜFkm[�5-�D�	=s���O� �=�m�4�h�x+������v���cy҈�����D�k<!�>���NX�2��7�70.E�2������*�a>Tր�^��9^ːJ}�{�{��Jī�����}�שU���A���#�d;����1ш��~�)A�qv�ӓG���}�vv��>�ؖ%��h�Y&��];v�b�@�C"~˽��p�͟��[4��D����ڹLUճ�\�-�l��j�i9��\��X)�ͻ�c$>k���S�G9�_���AuiU�h�ܧ��^D*ͳH�\/2�ߚ�`�LVW�w�>�K�}����G�u&��.���;���T�U��$�3�c�o46��hg��7�O{mk-CYe��p!e��,X\�����)�1� (k���ZS�?
 �j0�g��{3�۽��m��� wʳ      �   �   x�m���0E��)������QY 5P��`���50�to�p�����Ok�qH�Uit�Ή0n���P.l_ GE�t����TGJ�^Y���� �(���W$��n��#���lf>���L ]���6^���s�|�1���@�+8��0��-�o��|�c���By      �   F  x����r�0����a�D��Z.-Ѐ\�8n�jAD
Vyz�pzI���&l28Y|ɺQ���'zjVu���k�C��˜]1���(��
=!c~�q�6Ӝٌ��k���"�l���S�ՉE��q�,��mԞ������"�L6�x�$e<뢷�����3wd��������q�yo|}�g;�.;���"�d�ˤ�̡_o��X�RPęw�W8��O����p�o)(�L�_�v��i�4�6���2��ߎS�����z�~^ !=�uK#��*�}�6����η�[�����!����ǘuZ7���N�>����3�=EQ�mP8�      �      x������ � �      �   s  x���َ�L�k�)�fB�㝂� ��IK5 [�"�ӏ��d�3���߿�s�T��'G/�7��� dy�	���|r��ʏ]Ì�O�x@a߱�o�Y�k.�zpSM�8���0���7ĩ!�~,o.65!�ߨ����G�k"t�xV���F��l�s�贓<:�L�r*	R���Q�=�ssψ���哭Oh5\$v1s��{�'/���9-R4](���-1���nf���^]��~�=G`C��s�Qׁ&�% ���~�B3���M����%�ɲ�<��z� @ ��d_�eTʇ�����_8� �k�%-ֺ;�s�y5��X�Z�� �SU��A2h�=������O�z?I�T��L���T���:�k�z�������^6ն��H�
�wN�Y�69��ƾ,#wW�hA���<j��6E5��m?�6�Nɉk�F��'��Y�b����z�����Gu�+�v��h�/ro��c��^���V��d�/��"�3}��
�le�.	"�4�������=�w����p7Sa$)�<�[��;���5��G s?�@^��!�cY\.��[/~=�U�s�3�	y���{�'����[b�S5<��1д/�ڹrV���@|�D�ۏً�k�թ�'�F�fq�'����4;������c�:�H��Ň����]=��_M)��s��Bof��n�'a��Z8Ѿ�g+Q�]�jzM�p|��K���J�Mgi��w3&�Fd6��٧���)G�OtB�m3��WŽׁfy*6�(�R����:�E�\�(�����lr����v0a�>JhZul;�C�3I������;�u��/.�������x,����m�I��������Ⱥ!      �   �   x�u��
�@E�o��0ތ��̮!I#!Apc8��!:&�}DP�hs��eu������c�k!+����q���E�r<�����w���SjmH6��3�v+����b����):H��?yL��;��X�إ�|��'(_0z2��E��\��n�B��SL��+B�*#8�      �   �   x�e��N1F��S��^��/e#"�	ɤ���h�<=�D3��$�����}�8f��?H{0�1�q�~n�+ʯs�L�`�C�Pm�G�&V�d/� ��.J�x��H&8��8��b�x>��2��N����k�?xٚ�7ky�(���٩�}���n��xZU٦��6mٿ�C�+�ʽ*.O�tX�i���ऩ�>f����<�/0io��A��@V�      �      x���钢N�����*�_����n}��**;�D) ��x7�Z΍�ġʪ�~^�9�E����Sk%gF��i��	����%�MH�O�"�#bRǍ¿���U�"��9z#)�;�o��o��d���,FSa�qf��â�U������(Q����.ۓ�v���2P�3J��H�S�r(��<�]�}0�wz��}�;մ�,��q�u;���=c�,Ԥ<������Hb
���=-�����c2�F˰�KB�B+
���"�����گk�O�������� ։��=k��-��en�S�Ú�n^����Ŝ�\�.��n��k� }��)���gN�.(��������)�7aχ5P�3�4��K��պN���wte�aτf0	A���(fa�ͣ$�CH�8��ϖ���Vp���Y̡�3�U:밾����2\��i&\���<F�1�d�AOP�� �z����Y�v�z.rg��W��ꑶ��w~�̣c	��#��{O�3}���YqN)*4*fQXj⿪uf��I��'������1H�O�;�ٞ��|#P�),��9�' ��G���k�;����2�c�BG"��@��h��t�ָ��;F����^U�ޅ��F~^��>1�bD��E�֞�ꬕ.s�i^#��~�>T�1m*�(1�a�~��.�o{}��I��|K�`��� �"B�A�!�s�"���*g�)'kt3���=��fT�	��Nlt�� ����EkO��cq��s�캖��aQ��~]Q7�R{��m��tyO0کs���t6�F�`����~�ѿ)��ٞ���)����թ3�����)0�f۵�!�gRg�����c��qHʞ��%��Fn(5�C"�W��_0�!����:e��v�C�s��&�_U��\��J��l�H�$Q3Z<e{� u�L[�6n5��cDH]�b�A_���4땡uI������1wCu��n� �@����<�T��Κ��Y��`���O��V7�v��1$�H��k�/���\���Ŀ"�'"���i�܋�S���d���,��s�o>�K�_,�џ�Ʈ'�d wg�.�S��?D{���ь�#���=�ho�чҞU�RLCjo���پ#���H� � �*����U�y�Ю�I�׽��ԓm�R�ӯ~�ȶe�tK.�wM� I �Oz{�)t�J�e�^-�KC1�G�ѻЕ5���3��7�s�t�K�d5�_~�)�=_���z+ܺ\ݦ�%��wٞ4�O;g,�ᆩ��f�"H0M?��r͎ь�t�`a�w��N8��^uO2ڎ�E~��6	�3vmB�@�g�����G3~��?���x}>s���N)j^��Qg|n�0��x����^/�kT8�-�	ŀ��Nx��������G �zU1x{pv{a=w�ɁA�7��=�0`W�L�Cg�����QO
��=K_�ř'w�VR��xG����ڞ7ѝI2�Μ�n�	:�A�1b�(6�8�"`���̉��h�if����:�^�4���|�0z_��S4׆�
Pm�"ÇE�c����?e��o�j�Ϋ�#ő̉��h�Y%kG�t�S��pl< �1G�������hWǎ���xOP���]n������<������Ӈ��j~[�������;�UQm8��`��zXCo�1ʃ8J�U1Ђ��c)�9���Ŭ�6����b�=f����]n��9���?��x��/9Q�*`��'�{�3���-w,�]z�_��5����y�װ<7�h:0���/4�b���g.FԱӻ�9����E�.�op��T��Y�`�ơ}92�ء�6�|�����e��s�K�	��6���������1^PY�����@����?���\K��vu�	��6�������?�_�=�W^���%��+�;���8+�ݺ�
^hm�/�����♋qާ���F�hџħ����Z(̵T�łvO�_yd?���\� {-�=�E��F=1��ï�?��?C��� �2R�i�p	$ޫ�ɱ��`�?F���= j�[n����{� M.yMΛLy`�Xnh�o�!�=ր�	���U�ND>Qr�o����163�T56qr��ѥ��(�M�+8��j��0�曥nr7���ԥ�����%�#�v�5�4)�<jB���^�˩� �i�kU��=�5�`�.F q��>�L�E�xF�Z�~���/��q6���o'Y6,�O�Q�'ʩ+B���m��#?zU1��8�����i�bN���C�Ć(D�CF]f�@1�S�y�X�607}�{ݕ���3�j�O���bD��@���rs�bY�P�Թ'�v�+��@5�[Ƴ�x�DOў3;��:-z���i� r�79���'��E����
�9�7���C�DhD������LcD�u2Z���ԙ��m��%�����teܙX�O0Z���%r�cF��V�C���������h39�cSޏ)E���b�B�;�o��Q�LԽ+�Y�������}'.B��5=˫��m�vi��v�ϓ\�u&H��)0�Y��SuR��2ܡ��qa��c����X.�˥|��}7���=m��\W����8TϨ�8Qs�n)F�RWG[N��Yf��s��ԯ*���sj<u��d����\t��c�6��l�r�ֺ3�A�F��(E��7�=�'�cJAM�uv<4��+����.�zI���G�=[�^r����ط�ks�5�z� �-�	��63iB��R �xY����%ƌ���)��P�ll7h��Cbl�p����;s�QF� �]�/Ʊ��j�}��w�,� �ЄqF�1r��X�����"�\��za�'J,b�:�<��{(����=���d���w�v^%O���S7XNXjx�g�sH?��?:����.Ҝb��5�,A�����"GpCI���i�H"��׏��8�<��〜-�y��B��bt�Hb��b䩗���ϵBqS�����|�u���i~�HifFOў�1=��V�Q��7���������jO��h%� ��rxxr���>�s��Cs-��W������[�t�������[���;�O�:|���d����>U�R;��I�5!����y�Em/�0�,I`����"�l�8��퉎ɳ�5�m!ՙ��`�N�$���jOͯTRw�����8G���]bx1s8X��W�R!3�G�Ὀ��C��n}��׺�'y��1b��n7Y�|��w��X�Y���+>���Ĉ,�ڕ,w�sqR �� }�-ڔtѸ��H=���N�{���jOՌ�{Y�et��>�4�O���	������T��\���)L37��X�p����ѻ
[�w�k���$��{�r���E�[ ��_���/S��ΧG2�f/����+n���ck�xu[p��0�~�(�݌O�Ҩ��>4�������;���@�������V��w�������T2^���o�O:Ƙ���J���_�M��������0zW��})�y����p����gl���*/ PT<��qR^t���م�w�	k]���G�6��EkO��+W�t�����`�o��b��urf7KJ=�_���3o��ۯ�5Wz��>ja�׾|�a1=�V�mSbܓ��h{�_Ik5�g]0[ފ?̻��z'+��'1���z\�O���Y���~%�L��Ls�`�o�*j��r\�K�)\b	��=�TC}BM��~�V�
1��eўc�����y��� j%︧՞��\)�*�ѹ9Z	��x�0��)�`A�\�'���ht��3]��b�̯E��_�<�8�Ό��<}
��������)���@,?��,<\��i�3��6���Mo�ۤ�?r�Aϗ�+� ���Pڳ�y�g������.:33��I{ƹּx�0Z��3������7#c��<t����Q� {%�������<��|B��8�Pڳ��4��hXg�� �ք��C�+���/���d�)�a�� �EkO���߽�3��+�hb�{�q    ��arЍ�I�2J��~�>R�vIŁ1^l��
���^�`����h0�aPF��;m;���݈`-���1įn|ڨ���Tg��m��EØǲ�9�x�u�J������]b�«�d ����z�$l��B���7��z=w8���落�ү��}�~�$��L�wfi���S���d��N2���E}Az��4��@�31��m�{�ӞS'�D]q���
�%�̆"y��8m&GuM��Y�ܘ[�Qg�������'.�<�(D��C`D�����/� �!�"�Y�D�6'�]kO�c�w!{�����2�-�	,�M����>82ZgN��H�򢵧M�`�����$9wn<ƹ�9vf�@��i�$�����v���h�Ψ�s�a_��I_n@n�=e{�E]�
9/zM�T�yV�)$f4�q����џ�8�+���~��[E�l`�cM�*�-��Ӊ�L�17�䓁�0���cpX���u^nW ~L���9-fc���g�~�d�+��!�f*1���������D�T�$)@{b���v��vZN�%�37�?�o�����<٘x�9��ǌ�gc~C�+桜�C�["�g�L����K��?�W몊wE��y�!0"��y��@>:e7,;sB`z0�b��n�@�&so�ƺ�+����*!�V��,��cr�$�pEG)��V���Ҟp�s���p��:�( ��=C\�V�e�8�LOR��
FJ��j�����Ʋ��In:0��W�=犯��y�	C���q�w�o�Άa��BU{����w�1�����<Y�j� �
nw`|h��D�ۭR��<�1$��4�}20�%4�?�w��F���Y��?������y��(BO����I2.J�J|=<� I����P�M
 ����p��	?��,��H���ŗ6\�.�S�;&>[��[���鏂���舓��J{�$��J��:�����#����x#��o�t����4�BH���C7�����o�BQwk3�/wz*V�mE(bJ�I�/V{j7�~ތ�ʴ���f�~�؇�1�
��F)8-���;�9�>y�H�q���:��p��#mO	�KR���|��MT>��I{���!C�3�[�� G� : �K���'��d�a�� �c�v��ݼ��]b�1<� ���酡�B�C�nFh��lۋ�q�y+��>�9� J
���.1fj�S�f�ӎ���p~�����OF{����Wq�{t*#�"��=~6�3]�4i��?rn���(7�E��s�
�%.E�\�Sb�h>�?�*E.�r���CA�h�*Fm�
��5?�ө��|������9.F��cJ���u�� ~L��!c^��r�%�gɕoX�]���0��c�w�3w�����$�#B�	��	����ϙ-{����Ps���L�ˈ/�������j���>���d���y[�b�����0�!*o�j���)��{A����^���h�i6gL]yF��19�FtO�3v��6�.{��eѼ��q\?���!��#/�*���\)��lzFt"�~��5*�̘�懂q��B��������\����r��i�}N�w��q�R�G�1��߭�//��z9�;��Dx
���[R��vXϷ+��|?�(kb�(����1��80�v��+�'���[�M��=&O<^��������~���$�&k3L����=i��	t�v҇ڮ��v�j���Z꫎1o�mn"��M����(������8V������d��?O��*zw��tw�wb���S��x�~)_	u��r�pB��C��P~Ņ�)�0ʑp�w�Gc�����ov{2�ƋZW�8%G��|��E�n�IoO�WJd}Y�,k���i�cc�����r�ٮ�!�8�jbp�����0
�A�!�u{��Sbx����,��@q�b� ����'>���9�"f�1v��N��+�}g���3�=�=�M�����>P_7�?�nV-����p%A�s{b���[�l�gf���I�p����a�Y�Z�)F��4�������L��"Qs��'c�o�e]���A�#LM��S`x�q��Qe������0o��^9�;3��<�������]b��G1�N�S.�s7�#�[0<��4�f��6d{��4��{�W�=q���_�B?�������?o����e��Jj��
*�#��O׼
�}y�������ߍ��~�:��?#�k�f�c�=��u-�W�0UPd��7��<����)J���;���,����o����V�MȢ5��B܏5�A��o���'�e4Z-m��nW�lט���3\�gV������w�����f�'e+�¥��!d���_�30�0ȧ�'8�5/�����!�5oX)ם�t�z<HΝEq�-{�P$ǼF��dC�o�۰���ը�fuۗ�d׭:"�&E��f(Nx����K����^:"�����̯��%�U'�#Ϩ|h�$��#����b���t���h�$tC� �+q#+^���ù?�(tG�a3��)~60<!��I��F7��{Ҟ����R��vXl��.׻-{�Դ憋�IM�5*�ܳ�Ns�^t�8=�~��Ψh�P jC�]�'��G�e��.h��~�����_��r�����˸#��m�h1�^=[9k��hhu�(�P��.1���e�q?p�1�n����<wyy��g�舥w[0��p��K�Nh�6��ZQ��W����p�f�8{1C�������w�~�d�Ne�l�!@�ZQ�.ۓ�r8����.��K���#�{ٔ����=eN�=�	B�.ۓj�T��RD���/k��H��tA	$�D���$���пW�=o�Rz��gC[�ݑ,��'��-^t��	S�A�#A����=�j{^Px�%��� �Z@�S梨�)1��SŌ�"�$��=	�&~��jO]N��L>�w����%��=��O��0Z=�bN]1�'�51����D��&�����`D�3r�fJa؜S���n�)�sV�ϔ���r��h�l�M3�(��$i��fc�յU�yt���}GrA�E)�r��Ͷ~�hώ2w@k~���_B��k��ã���D۾�:�ډ�Ab�G
��(8�ՕN:�|��Z�z
�:\=�J��,�=h��<rԼ1�fc��PY|/�v�2R��l.<"���������Bcl��k�M�F�x�E���y�-K_��n�S���u$߹-31�T똛2�U~D��ۂA(��+謼���ծȎ��F=K������<T)�0� r+��~42NCC�vl�F�w��%�?��0�Y���^mtQ_� |��)�<�2���L]˛Y��AěE��.�Y�/�u�kJ��͞}�g�
�c��W�\�He�ᇏ��8�)%=6 ���ۡ)�,�]o���b�h�Y`������9ݳ�,��.����-=����ZZj`����0Ɯ�WD�+��7��b�i��� }U��p�U��R�
�wHJP=4F��r0��������:/,��IoO,G�9LV2�(�����Sb��R��85���tC��	F�.0
��e?;Z���#gv����� �YUY���*�п=���b�}�I��3�]���O��ae5�W�qh��� ����D{�Hs[1�1��,C�x��h�)��)P�����a� r�M�����hY�.�3r0����kz
�\}�&�����b6mZdEL��٫ڞw��0O�������^4�w�@[S�Y�ˆqjޫ�1��qz!��y��!��%��6�I�N���5[�,�춴'}u~�Q���*�=�,���`���0���pEaΠm�N��=�r�10��2po=�\�V��J{e^x�q��6�$��Q?R��4r�UE��o�ʿ��X�P���0��3ۯcĦ����d���EWE?[���c�*���⦳tA B��_U�#aQ�bNۂ�.H�΍���2`� yX_m�Xa��$���SPY�CCJ"�~+�g�.�W�A��&��P��l[�~    60f�֛��f4�ƣAs�7�f>F�G����m��@=�(��~Ճ~!�
?@�&��g`~ez������L��%T�֩}��yC�Y����V�A(I7����=+&�5��4Ꞷp� ~����oT�����������+�	��F
��m�jҼ(�!�s�	�A�p�"�����(�{�J8���W�2����f0!$`՟t��,W�22�
�յ7�,}㶴'\���b�W��'%��o�ޘ�?��Uf��zZχ�EA�P�%�H�esw��s1FkQs�~�j�xn��(���.1���L/�?��L9�VEV�%�o߾a���~���uX�|U_���:pӺ�S`q!�����Wo��ML�W�ߧ��*>�K�<�k�	i��cV�D���|J�`Y(ƌ��'NY�@��ba�Ϧ��kL���/TWBt��h���׽m�^wѣgv�A�
F�#A��n�.�9]*mh��K�yN1����J�1�@��0l��'#*^m��-��+������m��*��n@�U�ZKAS�r�Y;��Q�ov{�I,��t!��4k� ����4�0K-��}I�UgNM���_m ˍm���d��i�ct�,��r�淡H��l�\�S�XOV�%��x_g=�`���Yr�X/�΀�z
��E���h��e���~�n6��0�',�dM�}����QL��*!DI̓(�\�|6�3w�$��@x�N�'��N��9^��/���z�v5���(`�Pڳ|�������<wŇҞս�Y<�r�˧�ؼ!Q�=��C�)��H9�YU�������	F���٬�I�P\TܳnK{�y7�8Jr���D ��mV��sZ{���0��}A1�����Umϓw��G4�%��V��W�KA�
F��|�:诜5��U��!O�S�k�:ߝ��P�}הGݗ
ܦy��}���;���̢��:�ރ�OƬ�j9���W����j�U��'�6;�����`e���cӰ�e{��<�2)#�K2ֽcg���|�C�������^Y݌w֦6skOٞ�E	6u�@{o��گ���×Ɏ�뢴�'(�KgB\Ø���� ��I���8��0�Z܏��a���ML��'�(��[�U�̌q/D<��W�̨�g���R���u��A�K��ӝ��e��f��I@�e���=UR�Y4)���]��ɓ�S?n���ǘ�Ze�c�w�5��F��$��T�
�O�J�y���a�B����%y�}51���uKUn8+�E?����'��������ڋ��8��X����Y7_I��[^�8i���E4��Ȣ{Ҟ1p� �Z=�λ�u~+�<����g��E&:�hY�?X�;�Cм�9�߳0ZP	�H�"Ua��vp�����c�ċNaJ�����%w�s����:=�ͫ�s`0��ckT�(|���o6�\U�H�^�e���ˍ�|+�)ۓz�o��d�%�	�=y���)0�u}����[c3en�(��e{c]hا���m�I�]�}�1Z��?7��d㸳.��ҞPm��Č�aY�jgؔ�]|J����nU^k8D�mlh;�73r�n��ÑU��h�'VGn��M�����'�=��z�3�=�r�yRV���IoO����
�Z=g�*�O��?�����Cw��ϲ�.<�#+ M��\�j�C�����ӉUl�g���o[�XE�ڞ�f}��Ag��G&h h`�W�Em�[^{���|���&9��7n�!0j�s�$�nN�櫄�;r��4�_��<�ʗ�z����l�]�c?���C�<jK�p���3$����C�`uY������z�%a�0�Gڞ2#��l��EQ���o��k}6�3�}R�Uy OǺ�4o�j�cF��v�����������
�#�y�n�Ylfi�A�,������Q�v���q�;�_ ����Ƙ��\ A��C�^(/�__ѿp�/��^�1�"t&|Gv��
�j}�0f�9C)�GZ��|�0f��ц�f���[#�F�$����r�/��=�%�����P��~T� m*ꋎ���O΄5G�T��GQ��Q�)ۓ�Jf��V"�˨�v���{�?fKO���Ugu@峬����W�ۗ-�]t�}u�����$��=��ɺdʤ>l�� ԄY�~Uq����au��:$ѱkF�%�G:��o���_�[�j��va�|�ۓ�8�YJ��wJP���Ȋ��Ci�"��*��]2��p{B�؃7O|11F���tCM]��Z�v9�(�Aλ��v儴F�-�l2C7h�����?��|����Q�>^av���$	D����~���])>�W��qSDm��l^9�b�?V/�9y�oH�6��!1�ľzN���#�G9�����Jҫ�1j�sr��+&��ܿR��-F��Ӟ�:�^���6Y� UD���?e�c
N'���c^�5��;3�[u�.�M��k_�������������� k�g��8^��>k�E��2dgS��#ΰ�
u�]1Vq'w�۽�
��Ka��I�	�U��]T^�Y����xt �S��٥�n�����(�C��i���zU/'eW��A�
F����V��$��rC�H��1q��В(O��5���H���'��rc�:ʧ'���`��3M���l���z"�J{�rX0��t�~�T��1�P0"E�P�TZ���2k����b���#d��E�(P����7Iv����h�ֻ�=;M�r�&�B�fs�I~��{�����_��<:]C`��$����{Ҟ��-Ir'�m�N��;��e��[�qff3ijj������?R��:���m�\��*oe�~
����������>+"�	6o_����}z�֜��Y���4q�"�X��d��� ��1�a�%������U���:79R�o�f���_m߻��i�j�,�yCjs��ɘy�@�+H�%�&o�KO��υ��b���7���6�-�1ƍ�ADR��\�J�Q\`:0GQŇ�1����/QQ��l9�3�,,�,;F]`��z0���>Y7���<=m���ٮ�fan�9�6�iܺ��H��(�>�X��nU�ȋB��w��~�H1|��^͌���{N$T>u���9��ҝ��dTf��8�q�b�
�'jX�8rCp�^����|(�e���+\���u���q�-���&:_�^�?��
q~7׵��n�3�{�hާ��5�ˈ�W.B�����s*���8���0A]�}�쳅�û�֟�2ں��|�(�翟#�^y�V���s�F>�I n_@�b��z�i�T�v��1yD�4�'��L�r*E;~�r�����?X��Qj����7�`�LzDR�,�]��m�O�?��?gb�[�q$�6gT�/I�q�Q�����T�d��˺�.ˍ��H5�/����f�K뤿QO=*!���QS��x�95o��;x�Z�Նܰ�[P�8���)�,`bF����z4�G�!ᙵ�jq@�H1� ����:�Z�#T>����ў�����(m�1L�IG�=!~�����b��)K7�Lͮ�vT�S�X~%-����\�&��mG�Zm�C�a��jOeH�ʯ�%�|v�4���2��{�՞���ݑ��8����"N��Uq�����l��B]Q�%*��p�5�4�����p��Q���=����y�w���J^�rvF��"d��U���KFԭ��h�����p�w���ǹE��[�Q�_B ��ׅ�����ٞ�L��4��5�<t�L�D�C`x&����Y�.�.�P6sܣL?2�o6FD����0/�]�L1BG���b3K?�8}^��7�xbry�(�m�衵kW*WC�l�ɢ�B@Ȩq^���kqe�VSpMm�W� v��9���S����o.`扛��EkOK��f9�N�"���%b���w��l床N����`b�0#��%_,��_��9�2sQ:g�9ľ铿�`�)�����s���΍�F�L�i���1"�z�[�;��iD*��<D{�Z��`�.g�E��:�yk�=�h�x�c�ԫ���wT�����'j�Y�    �]�����=¦6�E{�+���f.d ��_4�^D�������#
1� �ѻĘ_�����Φ�Z�$�C̣곁���$��Ѝ6�$�L���I�{�ov{����r�둱+��'p�C��lO2eU�z�S�,�$>	��CiϚ�F����(]PAA;��S`�"�Ü=�Ҽ��� fa��bxv�n2^�9ݙ����IoO��Ie�G��=\#?���I�崧��;��ڋk5�V�twўc�K�˪JҺU���wW���Qg���A���}�zd(�\3"������PJ��5���z�_Ha����ֶ���W���y�@�=B�n�vF��Mhoܜ�؇�S`��k�p�K�˨����; >F�$5���L��?�g�SB��[Cy��Sm����'g�������(�����be�/̼�.%�S�G�1'�\��ba���ɮF�΋b�H�Sr�����8ǺxX��" X�y�(J���/f{n歃�f�]���Ј����nW^0U�i�>����=i�����+�U�oŉ��j�=6��y��n�?�>.aX%w
 �(�6�ba�{'����XT�nOh�>�����4���8���'�_�/��ޞH^O4?]k�˪GӨ���ޕ�,+���2 ����K���d��d-�b¨cuqҋ�L"���K�n��13�����Pw� >R�a�y�Y�̐6ν��@��jO=3�q��V�ej�J�q�G��N���('6룺�u>�'�b���91&�t%]�ӗg���EØ���[q˂��.��C�PK�wSL�_�������x��v��&�x.�h�c�m�@��Z��+͖皻K��q�d��R�-�����p'�f�kO�m��rn�w�1�r����|w>�+�Y��9A�j`�K�kڽrI�	/5��|}��B����'�Q~����p��u��&�m���i�$LN�u:��f�r��]b�lw<(|=��0�� ��^���h��>sIq�l��0mH��E�Y�/��]wz�s͢�ۼT�7��j|�2��ǀDqd��U�����F� �(H�S�+=A[��$�0l^ƕ}51�M�IK{JO��A�@)t���۸��˹�3����[��C���lc1XC���E�{6�zc#ǩ����[��� ������c�E�R&�.�WR[�Z�/nd.K�¼�Q�ɭ8�B�f�CŘ�RN�T0�~�#�s%0~w����g�-��?�e��CCsy�i���y��CkOs��8�ԥTv�����]b�s+�^y̶_��4\#����Y�	1>T�>R#��Պ�0�.R���a�4.>B�/v{��6Q������!�V��wv�n�G�}t��-����\���~ǈM��2��+)��F�h�����Wc��y���9��Ѫ�ϋ)F�ǉ5�ggz'Ru��G���h�� c{L.���t�Gڞ"\Y82���}���� ��
��b��c_ے��1wzw��b�hH{Wڳª<nN}?��{q�C�A�G�#Mi��fc�:��9���8\cP�;�ǝU�-���6��QN0�����8�c$�C�b���?���'r���a�k9y������;���1[Q���Q]��@��ź�%�c&�7`�6�P:�V��p��� �
�a�ba�Y�2��{X57�gJ{V�T)+��+��� ~p��_������u��|�������(��gv�1��$^�n/*/W}'ߏ��q~d �OY3(�L�9GqEmL7�&��쳁�IG|�z�*�!����r䢾+�ϲ��IzzeC/�!�������}���P{�ir��;�v����?[{����|p�L7ˆ�63�������-/�P���ٔ�~}������̜M�S�n&j��qƣYx���Z��:�Йz#�I ~��71�ß�iO?��3�xh?Z��aS��0���U|�ƈ��ގYc[�֎2m���O�1w9��s�]Zgk�/�*�?Sެ�#S7���-��n��5��?����t�a1ڞV9�)mf>�x-��K0�W�0�w1�����z�ua�����r�߳$L��G�@�ޛğ����Y:,M���'f� ��MXO��]_g��Qp:��Iz���X���EKңkW�,��&Go]���(q�֧��K��m��Q\�c��w��󟿮��/c{x�\~\l�˕�37j�d`����P�cQ�^}�˯ x
�s��t�Su@G���n��S`D���*���]�2@����ջĈ�%e���S~0�p��Bh��ծ����&��v&���y��!�v��֞��u��Xc~{v�;������pn��b����Ciς�t��Z�X�_7�*�L�E��.wG������T�6�14�KOG��j{^�Ӥ�rCh> �#�V�pp�v��f�����7�xu슂`G���v��H���nGC#H������x��?������|����v6EQ�d?x����ba���S�+����s�����qLf�ȅ Uf�M{O�����OF{&�����s��>0�a�8�O#v�(��0گ�V��'�q?�X���%��}��m+\'J�1]�9SQ�A<W����v����Ҟ�-���vm��ax65�5��)0zr(o/��������X~(,m�g��T(��5������j�i+S��A\����vG�}�К�{�I=���Y���f2 c����Ωѡ� ��g%�i��ў=p�K	��C���!��H1�o���ױGIV-^�))}⇜��W�E8t�]���-p�-��j;���͢����*��Uǧ�j���R	��
ƹ�*�Y+����(�#6M�/����Ã�G������΋O:�>���f����m�J���j�=c����@zT�`B����l[6O¾��p<:x/^�Q��t��� ���b��'���o�����K�Ǡ���]�'9�1�SDu��;��Q�RܺŜtfRfSZ��Q��bǇҞ5TEgCr�'�eҨ"�c�#�SʴJ��;����Z�.1�!H��OW6}���!��Gڞ2�1���)��)tQ�۷`j�q��=5J��|�&��PR� �`��b5=���%gk�B��i{JXXUig�hx�S�8��?e{R���r(�/�GNC�fb$��֞V`n��(�	���"�l�v~J�����KA�S~��e�m������JR�Z:�_��|>4�y������B��|�v��S$X������h�\��b�tϴ�j�F��O(0zW0�VF�8�?��m���������=��S|_>0�괏QͿQ���Ƀ�Rr�z"��iH;{�L&=Ɯ�~�7ۼ�L���Q�RׂJ{����F����I��w����n�|���_�y���w'�1�$�WtA�?>=o���?�_ע���M8ȝt�{����/�Ǻ��M��!\"B�ݓ�r�Ȼ`<d��j��oŉ�n��A��!1n��D������e��Q��/�d����������鯖��/�(<����o�5�7����`G�.�w��������u1�6��7���O\����ޞh���b�mߞ�v��s|�]䓁���ϫ�q(ą������2��Gٍ�}Q�W!����~��>۹�p	���WR��G�O�*��3@�[� }I�0%�$��LT�+�Y9��b�+����y���?�%�#�O��@�@���-=F;��uw1�\��)�@���W�=����8�չ�]U�	��xH��W�=7Y�Q`�"9��~}�zԋ��-�g�G��h:��&	,�#B�þ����F�O�y��n�{��	*;�����J�sl��`E��|�;���J�lu��$?V.��?��#m��tFj�7���I�ׄ �?�g`DkGM5��QN���L����F~�0�N�8�*�\ʀ�x��|9�Gb�NΎv~��T�F�ܓ���T�x�,��ڿGu��P0�Y ��͇�#�|C�#�Q��h-ן�-7nγ;����gۘY9������������ �   �dc�FQ�����-t�߁�`�IoO�fs����>k�%?����Jҥ*8�/S7�^�f��]��#��=W��UK9�oO�.�UvB����^�i���ߜ��?0��V�J�Zn�;�U}�wpg�=zkq�S!�D�Q�iY�#��'��T[���ڳ���K�>���a�:��F��=es�����%���ʣx�(��0�ĸ8pvo&
�i�Z_Uߖ��������/C��       �      x��}I������Whu�/�>O�$�;@�!@c�M1#F1Я��s���]q"�O_������2��,�����0�u<�7���&�CPl�X-�_���9��s��f��_�?/�����\i�'_�
,;xW�x%D�C9I��6GV�b�X"�(�����D�g�-�-W�?#��c3d���k��UnY�����֬��.���oh��Q�;��|�	E/++fL��YV�L����_�kmt���?7����\�.]�zn,;����onN�$���*KgF�Uٸ��)�?�+��ۢ?�6�BI�k��8$��R;+����M��q������]�T>Tur�Y�d}��_� �ݙ����9fk,�6�[/-]D$�qI,D�h�X��z����p��6��g{??^�������"@fPa��bwb������%���,�+�:��λ��m=/���󶤣��}�[����$�1ӊ0�ܢ�Q�3�l�-�"t˷e=�j�Bt;2'[�����%�s�x{�@8�l��b��WC+�j8���6�T�m9��ݥ�ح8�w���Ry
7~��ȏ��y0���'����%�8����}���v�#j��k�_���(��DH����#�$;B�c�-�J�s�o��9�'��rM:�JC���_Eh�^��J��y���B;y!���vEk�:V.��f�G^�	��<�q��^����6w��
��
�MgǬ��/�#hy�S}�]�L�΁	RAU�w�'���w�:��Է[.h$a1n[������GZIYձ"Gj�y3�!�<�e�N����ڏ���exņ���Ɉ��/¼߁����L�Q�;�mA��6sXTx��p6�3'�z&*�rt�H�|	Z�e�n1��!(����nZ-y�KH
�K�ؓ�&Xu@"wJvʵ�l\��.f��-˱��TϨ'��0�XaU��7c��G�s�1�� 9b�S������rsUOԱ��������Ϟ.�Saf�0�-����~����}��lu�`X�� �zX���r�����D���L&X,C�uop��`�x����"5�٦��*����c3X���5Z�aA�0�^�n�^��Y�ܥ
��A�[К��>~}�q��ii_�j���_'���ph��J7v��IR�͝���N���"�kv���n���a#�菅��;�%5���2��`��M�\H(��ype_���mT�N���e�b�f᫇���BI&߼�H9��`*�������f��ɞ��X�X\-&�;G��[��_�� ���3�sV9�x�د/�d3vr7,����%�g����0H�T��í��� #ae��.lY��_,^�h���SP�G�c�ߍ^�����:�	)�E�:�W��q�C����@(�&w��u���=�v4�
?�������Z�yn�{�I5����X�߮��V�ko�_�C�A���q�`������M���\C�`A�L끩����Pڷ�4O4�����j�L>���W���X�p�^����|�!�Hs�s�E�|'��v'��
;��/.	��o8,"K��ͨz�县�K��IV?4z�Pp�CY�������-���{��q-��[��H1Doo/�#}_��������~\+DS�/�V�rߪbz�u)��Xp��Z�&�s�וy;�aT�� ��[�Q���un�l/!��lQ'�������U�D�oEhu����!4R#�>�d,vC�@t`0�y�?z�'`��iG�o�՟�uG��p�4IˑY�$vR�;G�dyvGa���wΉ���K����st��l�<fL��� w{�>�`�陥N�V|l�@�#���_iߑ_���}�z�i�Z��;AR�hq�U2�ݏ�.��v��6��m�/cr��>�(���5i�/D��~`�A���D ^��3����@�QP&���[���S�lu�c�2/�����5n�G������ꏙ��_�����UV�9���}���G0$JL�mp�_���a�Ξ�?�i����\�Z�Q�LX��x(�Ms��D��mLBS�3|��x�X#�?;�cI��C/(�"��t+�}s�o�P�m�e'>26A����ME�<Bɧ���Tu���n�2��g�6<��;������U������`���g��]2�C؟Y9&��	Q�$�Vs��i�+3�Ÿ �x�����Ar�D�mw<,��Pn�P�}9����r���^����j*2k8��٩����I:���#����+�x��ʁr�Ew<������-(b�땭�����>��vT#���Bl�$d�Ҿ���q�ė�V<y��.���`��(|��]kr^�k�YfB{M� �Y@Ci����1؜A�:o������Xi���-��8�3��C"�	�oKk�r2PP���<t�ټ�>_�>yL���b��hn�J��
?O��I�9����P�Rg�f������
�H��yg��8).�܃�&�o;a`D=4n���������7�U��I_�1�\H��&���k�Y���[>i� :Me<�A-�Mf�¸�kn�����_xZ[/�2�����v�Q�C-�UY��"c��J�O'++����|qޖ�v�:��_��A���p�?�$s�w5	>_�./nhI���}�c�HF��J�씓ͽ�kn�~�������	E-&d�_ K��MŁh1O�ӽT֦�sR�>j�)e���X�B�E`܎��1��ϲ�H	���²��,��Z�/6R�xb���=Dr
p�A<��Η���Q��CǦ�Л͜!g���l���H%�n�^�EL.�Չ}:�Z6�*B{�<D�.*�W��0X��5����#3��-�ew�sͨ 	םv�~���O�u�Sr�3E�|)����B�I��AW�l���5\�[ 3��I=�i�����z���p%��]��a�};۶��}�-HER�T���=t�(I��A�C��-��t8����zcߣ�i�Ȣ��N�Q��wA���y3�4椳W�?g;�j-`D�e8U�L`GFTJw������(|T����g���c�0���AO�!x�^����7E-�Ŗ�e$O,@Jz��o2%=��� �&�6�긥s��Y�+�X��
L;����aMk,��|�X!xֽ�g09nUC�������T�����Ӿ��Gj�(S�G�1_�^����r'����8���Z���~>�8�[�n�a/�M�r�aRW]�O��7q�L�jQ�Gx���$���3�oP����g�Ֆ�9p��cFu=B�{�@� oC��<�dk8E��X�EmU,��~[�*��okXBh�Cz=����!�C�8�Ms��E0��A�
-w|�%fNUo�����)���G��g��&�^�5j��D��� �/t��֟��_	t���-�8�
,�owћ�ɜ�|S���P(����8Bډ�֬�N�7���A��k��ˁ�1��ϐY � G��u�m��٤j��hD}��9���ü"wN"R��C��q���hL�W����#��xAW�⟆NӴw�?s���
�z���Ki���u������-K:�s�V��7UU�%��`�z?�)#�W��$U�����Fϋ �`���'&�]{+�ȃ���S@/?SH�hA�5<]���^��6�?�]_���t�u^�)��Û�;�pk7��������-e���{9��``���}  ���0�XB�h�!#�������2H���|�qW�%�q�����iU�7j"l�v^������_X���a���v*F���3�x�.._�)ϵ�_)���T��R���������8��M�z�-�$�:�qM:�$?%M�f��!7Uj�G�/���AQt�A ��a?4w���C�>~�11�u�d��K��| ��&+�>��7��	E��}�x]�;	�,yVy �J��*�8����2O� v\�y���K|4y���Е���Y*��s$�R��\\�����l��)�	�8�N^\�<�)GJv.v]D0��ƕB�?�/�� ��V    R��R�b��߰\��]��펮B�9D�F��$LaK)��~L.�_��.�p�Zꗮ������g��Z��ި��2��P`A����m�#Eu��[�O$��pH+���}��Uƛ�yW\��b��"���( Hj��n$y���yޞ���/a�W@��1Iˑ"�lz���S������L�a�Y��,��[>掺�X������k��s�
�u�9*V2QM�LD�e+�6��Ύ*�|#����x{P5�}�P�A�� ?���%6r�A�}@i�m�c�c#=1���Y���vŭz��������G��e�E�+-�&����QssU�E���+|\}h^~_�:����`%���(ꆁm�&m����
]�O{�ߏ��m�S&�����6�.�=�
[��f��Ga
����oR���qCÃ�i�nI��� �3%Kü.��x�Ï���w��r���΄��uv������'�K�����¶c�t=l�fL�j��v�~�l�36�����]6Eـ;)4�$`�_;3�� g0�6D89��C�9�@X̦�ȥ�{�-��uu�)��z�۫�Yc7��V",8<0@ဟܼq� �I�&R�.&�8|����7�xlg�1�y4��.�⋉ ��~�>n�<���-y�.D:Q�O����
=��A�M�*��E	�'-��I//f��V9�-c=��ݤɒ���
�mv;m D��0�v����7P����>�?��@b ��B�sߠztz�(�t�K:ƭ�;��T�Wp�+�j8�Aa�@
�b��r�6g`���a��<<=c��E�i�,��l_�Q0ֆ����M��Ǭk-(X@4�Uq�u�"���������b�9���9~?'�L�Cк�s�혋��`��~��V̌=^�K�|���p"�,ܡ�l���U;�72)O��Ej�z�YO��ڥ�UJ]6e��M�>拌NnQ��D5��������;�*��C/��L�H����+�Lgk�}�Zz[?1�x�9��S ���y�H>�2t�����0 �'�B,�CW,a�[\f�'��%��[x;uh����#�{���D�q��-��N�=�#�ף|���Ι�c�D'��3����l��᾿��׫𔃳�\:F��� �L��|��q�n�
~�'�e��p��� �6��E	�e����o>r^)�u�z�A��T*ȣ��~,��
��W�f1��(9�r��q��n��!LN�^�*��٭3-�.����aH���`j�h�؏]�N�K� )�|���0�o:Aeg&�l":�O�	΃�� ��#)1�]!*�����"�O��Ot��_A�(i���.��i	��\��C��/��
>��t�����؂�KG6�K4�k8^)�yö����s�Y0�2r`��,�����똫	:�>�n}7hγ�azk�����ao�a,`co�IL����<�������B��-��ۀ��u�0a|�J���}��J�h����G�լ�.�X7Ƃ��s��ى8+�3�_� �w	��1���E��f�dٺ�U)�q���}�y��ܰ��ŭ�T80w �u�brՓq���^[�\-!���by�>���Qe��GhlBi���d�=�wp�.ܲ���*��F�ZSs���L}�Z�Ľ?�gQj�E7[;�(�S)�p>S�3�������- � v��Ȧ���N>��ҘV�|���,�'�R���K��)�tD�
��ݥ�!^�(��ʶy<�S��ryG�Q�O|�a~����Ut;�R�+�|P}�
i����j���}�[����j��@4�.���¢z߸�L.'���_aɿ��#�k{���R�mζK=�z�Q��猇q�	oXv��S���O������S���Zn�!A�C��3M�C�cH�\9�3���-���Գ~!�􋸼�j����bVD���jjF��˫f�s�Ж78���v��f�>{-T\�w�+�l=�����؈
P������WE��U�� S#�:C�+�D9�*/�;DŌ����7�Ɋ��O�+w�$��S%F�{�)�%a��!�cٓD<����GK�%k6<c�g~g���xn��)�M l����n9�̩s[���$/X�#�tEe�~�˹�9kj,F���an��t<,&�ݎ`Wk�� ��r?K�_4�1�!��UqM�d9/�����`����1��a\��P�"��?���������nae�<_�!����^W�߿ڮh��z_S�{Ǻ�"������uа��Xc�.�a��IX��F�<l���ĶS8��e��)3�{70mx)(����f�Z/����
(�����x�[��?T���h�����	���2[;-D�t_0�B��FV:��q넅�<vM86H��2��"��8^v,^8�)�aP��EH@�V�~~�� w�>{D�l�;���<\^��=�"z[J�&�U�?��Ľ��	?���q˥�5&Z)<�t36��r80r�6�D-v'c��s��Ѧ>3>)����[UG@2�nۃ���6���"�oIJ�o��p�Qw{8���~���%�U��[ҽg_�OF V���H�ʭ��I.A��S��^�ƾ�K���pi|��{N$7:��w�fwW���hT��o���	5�.0:n{GB�]��P)H�O(�X��t7�f?z��؟)�	�,�"��n��eM�쫩6,�:2G>�p��J������Ŵ菗�~�۞��{7k��W5H�������U���e��wp��c^�4�G.R�f"���uX¦����Q
��ܱ��cw�IP��EN���)�6���swGFh-c�71���k�0ÃI�g'���G����Rۄ��C�w�M<'���q[�8^_ tq���-,���J>d��I����{{uu�(���B�esHT�H�x�ge����F�|IZA�:I��ӶG1���h��$�!���,Y'_��H*
����;[w�`qќ4J=�քK����0[q��U�#!(�ͽ�L?����	��IG�S�z��1�x6����u9��nf͂��7)GbLT٩Wڿ����b /�c��e3������Q�s��0�̵Jz�{�� �2RWB!�Ш���p���ө@�S�V��-��%�=����9u����@I�cm��&fn:���;�#���A�ض�����{g҃W$��܉:^�{S��N����s�S߫GX�Cd��#D�3J
�'�lO�Ob|�ȳƞ�]Tz#˛��
��r̻�}�t��U�E$�ޖ��P����^�\-n/JAZ�_�6ci��ꄅ�_MrM/��o�Y<�xEd����VbI�U��M�>�����؇��xS���Rw�5�Q�Da1c������VQ&��6\?x9��}�e�X� '��(�%����G� ���*;xQ��Z!�u�c� fCй�ȡ���*��ծ��)5:?_T�9�e����N\�ΠHǂ���~�ggp���j�1H�Q��0��7΋Wa�͂��R�$j��j�����kCKHV=��'�m\,�K�H���勱�Z�Gw%�H�eG��J	����V�I��gl;�`�^���V�of�����3a�t�8v�=<�]᯼Q�kCF|��~a�+} ӻ�+�,$�ݨ�DF8�=D�K̍`l��s�E����딟���^�e���c���s��7���J��hh�A�' /���Ȟ3�F�/U�
3�B���XNa!�D��@eOX�g���['����-~��/����ܘ1��GĒ��ה����~:Fݢ��>����JQ��a��'��mswgf!����ɚ��`	uYGce��ҵh�</(����??�Cḵ�{
{��a�����Ak�ݝ������/�������Q�W�6��8��H�Wsϴ~��l�Di��"RX�5T��1��]����u��QK�Ǥ�Q\����d���g�,����u��#��Q�:��c�F\�� ����3�^ӈ�2�w��c��7��F�D���lw9%�``5�����    ����Fa�6�u�h§9�Y~Y��-W������L,���n�W@KD������&d��'nZ��)��s��>R9[7H&��W�}���cl�J�����b����0�&E�����o�f�-l�ٴ_o`��v���@��$�p�Dh+r�+N�����(wW1"��B~̾��G�Ӭ�,2���{�V5�0����9Ȥr�Z�6�*��Ҷ���1H& ����E�9W'nG��$,e�"}���W\%>e��=��I���-��Xq�k "쑟�գF��*�����#���x�%��K�o�BI�w:��c��M�/��K�h17ˇz޼ �������dV�Æݭ�uI��ř��v���2�pgװS3�ߜ� ��}@�M����۸K����U��x���ܢ�7�b��֨�;�8�t�����L�ya��$s���<u�9�]'��
�
�.A���XKcs9���J�'�\}t)�����mO�ܗw��L�`�,�qxOπ��'O͜h�@c��u��$|�R��@V����E8�}��7�Ãcd�HN��zx?;���q�;��.a�ҩ�i@:�wMR���1'�j��v�Y����M����>����D��;(/n0_0Jq೦�?����d$v0hn!K�(���Q`�����1$�U]���h�sg���v?�"b=�Ӟ��64��:�,��y�����<�-勽�}�_�2���]=�%���,ۅ�e^�W� ��V��PY76|�
F�r��h��	��vǛ\����D[�\�2���(wƂ�z�?�$���C�}�7�{V�ﭶ��H��d_���Y��x6qhG��6xP�\�kvv���?���P(AJ�h�З�����rmu���qZ+(�TP���
!���>�ےًj�Uy+.؛*O�R�1�v6~0���; �<��n����72��}�&��v�J3��/r*��� ���y��4>��J�����y>\�o�7�Դy�M[�o��~�^5�8��=
9�upʽ��n�mha��2z{m�5�j
z%��2:��7"�^;�P��6kTJ���%=��E:�4ep��p�3n�x-+�:�;`�\>��u���XX���ú���e�B��>�G��/ �Ǉ�y{����rHS���9|�=nɋl"���j��ۭ����P������ OjV�S�<�.�~��e7,5�V)���Y����B8a��Mun��v�R�[~|}Q��lK�݌�X�
�����ҰW6�!	��9��5�\9��ȏ]������g��Ggl�)S��>5t���#׋�OgM~����M��[c�U89H9E6pk�4C�\��8Zĺu_��֎፟�=�LR��8q�K�����GI�C{�e���4O�ۣ(�繳h�*|��^-�ّ���:Cu��⎝�'6�-�e"�Q5hR�ª��q_��gC�WHr����W�c�Q�4�T|�]���p�����~vP3�G5�6�ʡFx�d��J�8��I�D�;�;�k�8��e��_gD	��k����2ҔhzMf�	,�`K����R�!Cx7�B���9xig{�_��Fp&����lȔv �>�EDY����ke���Fa8�p�k�x��\)�xew�/�yw��|������u42�5���f(����w3�����[�|�A*��$pȃ�D6mZ7��uI��G��5��O�*%G�e�K�~�k���M#�1lZU'iS��.��`~��AG���j�p���V�����q�Z�&y�C���gC�Ƣ�Ȣ��ިGXȳ{҉ŵ<��X���}��1��1��W�u�͘&�^��{(��~��%��zi�!�E�"{0�~'���X�{ �,{.�����I�1��أm��M$.��Y������.���BDZn�wz�v�I�*�C��G}���cu0Č<�/�����!�y�U� ��YPX�d� j��L�-��pbĘU��Dς��j� ?ӣ�Щt�������NY�9�(�n������`�⻛f��tdy=�+��j���%����x�\�9��N��{q`����S՟2f�����j�����t.�(Q1�`�K`h����r{��{��{k�������%��:6��;7�]bu�/Ij�!&+���O�a��\��u�EP�p��)Ɨ�۝�0v��p�{햁՟JP�C�n�BuNm�K�0�`�=��:�ux�1�:_P��V�JΑq���iH�a�K�U�QZWi�}�TQM%k��h�`k\���<�Wk׌m]��ҷ�DX톻��j���/�w�ɆPkd|��yϣt_��+��kx�h3&�'�����`u�H�8��g�i(U��]o{���a��$ө�6x܊�AٍZ�a-W��q,FN�y��}��x�`�
��JQ����	߾��s>#�1�`���/�y����@(-^���V58\0Ҭ���o
8rW��}�}��� C^P:�l8�ɏ�J�6E%�2x�z��Ƌ��
�z�i�z�VB�s8���5��*#�������r���aM?�����0O��*�6/���L��<����B�AʶDЉ��3��y<.>��\�M<Ӏ�_�!ܧ�x��������*ӯ�b;C����ѓ����-k?��Crp�����d\�H�	9�����L���i��7^�P6)��h{�kmʳ!�ɨ'`�W~r�B�Г{����c�Feh���dG�-Paj�����Lν�z�98%"��qPL��ؽ��W���#�q�.������T���	o�=]�H�c_	#wb���5�t�>���t�˪��[?Y�-8��>'w�䢛ˢ�&�Q��
�Jn�S(s%4$�v(V���{/R���5��qt$5�η���׵=}p��j������ݮ81;T��ll{���k�(�c]�\�0����"�Mgb
����.��j�&�~%��j�;�Y�i�VQ)V�oK8���a#��]�Ŋn�D��	u�#ZY5���5�z\�y<	����4�
w��j�$[����
�[��Cߑ�s�e�5{-�\�9gQ�~��&�7ч�'1eS�Ap"RV���i��O�n#Rn�&_}�ԟ�

�����}Y��	]�^	�CÈ���Jz[9���r�<Ǽ&>R�S��;@�E�L�������0n�~h���>i�ZV ?�z��P�h֓�9�S��I�������C�5GK�E��	�^�cڇb�x����3�^�꧹zv��'fy[�~�{X ݲT�6\B
�FOY��5L��I�[��$<��@B�����q��iH���u%���޴��'r�N}�օ`�Hq{����=��@�1E#����� �@�U%�����p"��Q
δ�&��,�L��F���
Г�9��l��rC�8��k����a9���ϝ�t����G[���`f�Ν8���F�FE�x��섕�k���-Z�pg�>'3�^�ǽ�������0��*}��;��mnn��q�>���7�2ԑ���l�,t��\9{-f���_�}w)[lį䝥�X�� �xѽ�tR�N9�l#�����C$
�
a���萜��J�_�l�&j�J:�*������v���G�-�7��*p)r��Ҵ:[]28+a�]17��p!Z���q'd���!;�����ۉs״�qvfr��3s��`�*Bgho|{��G���h�]~\`�U��0��?���S�Z#:Aʼ��fe�?/���K%dS�!˾'p^�-o��V���d9��)� �o��v/6ru�ֈ��u���_�Δ0uF�J�!��6Q�<_%�>�E�>F_�|IY܍�;5���J��q�N�׮�e����߽�L��	����r�h:�-��އ�H>�,#�`j�����x��"}��	��¢�;m�_/b���b\}������`�[��jж�b]7k9;�$�d�:�@Jb��ټ����]����0��R:z!e�笶�e�`T�s��x��4�Lɛ��n�.�k�T�i9	�Sb�y��la\^���G�ۋC����k�;�z؋�����r�{Ш �  ��=6(,#KA�I��AG�'�9<�u���<�N7�6~H�ك�Nv��j�i�>n�]q�w�%�<��E�9��I8{U��/�>2�'R9��7Ʋ`�*!�kK
x���W����sJϴ�>7��qTx<�����횡�g&^ȇ��y�g&r�E21{�wO�a�����p��R�{�u�����x_�����e��T��^�����{��`�F�T�a�����x�n������;ӏ�3��ԏ��׭���A���n�?�r�.ktj*X+��@���>��u�D_ ��ǐ��d)�l�
��0;��p�ٺ��K��pߠR�G�8a:�wN�KzGnw�����:q?ET�x|�ȍJh�jg1pExH��S����$f��J��aâ��W��Đ���	�%�2.���/*�?b�����gw
�0W	ݢ9<����^��Z�f��W����(PLt.�҂�k�57p�\�����&{є̍����5~1�o䉷W��IV��n�����h�S�M���˽���iS >�gٓy��l�/VBm��m���o��< �
�%��FU��b�?sN��iB�K|�*�.'a,��v�,��+�"�ew�|t�"Mk�e�~���#a���:'�l7gj��} �d�����{R�u�(��<sF�dQ����l͐����ʳyp�h���a��Z��O�"*
/r�ė�Q9o��I�,���xx�%�j�2���7�`�v����� u�Dn�:�Ѫu�{�$������1�=�d\���ݼ��{Bd<M�����V6����!�?'M���`� 5��q����D�op����Xtd���r<�S�<�
��p�S���wJD��P�-�h�y[�t ��܂�"�� ���$%l��������޺C��,�}�B���-�MV�;�!��/O#O|%��������v��7|Pֽ���Eաo���n����9ݴo�7E�$H����Y��k��B���2m{���I:�������U�Mv7�Z�-��P��2g��TN��~�W�dm��r{������IFƗ5x��P�V�W���&X;(ǋ���%-ܨ(��c���@I���to��mzzh�v{Uɟ��sY��J4��0R����Vɒ/J�g�ی���Ư���.0������_�/N�Vχ&�w?�p�i�0~L�{Kw7hC�N�����>��cU���*������E�OGn�y#�;SE�U;��,yG�F�S�n���N���9��l_"��Ԕ��$��t����-�������6�#s7���<�Z���i7hF�i�}��� �(�-�d�>���#$�6Z�s^>H!U��F�`�r q�����=�Y�2���G*𞎠��p�Kg����ki�7�
�~^k��L�4�T�<��>���osG�Dp��Ť.��z-�3f�h2{�c�P2+����ta�[���[j�ǌ�.������r��-ѿ���~����?C�_�?������̄U      �   �   x����0	����0��p��ML���KU0�4�4b45�3 N3mhdad���Y�xzfx���p��X�Z(�[�X����Z�s��$s�z���FU���eF�p����E@���4.{��M���֘p��qr��qqq �*2�      �   �   x�m��
�0���߫�ۜ�;[-��$+)��UTv��EP�����e3�~�mV�QwMj
�I�!�q��scF �a@1e6l� �rL9�Pf��Ę��xO/�DJ���
J�%
�R	�R%2�����Qʙ�	��o��xkԮ��fv_�^"�: ]m;�P�/�C�p�s����X��i�Fb      �      x���ɮ�Ȓ6��~����+��HժI�� ��D��<�3��%�ȼU�S����D #���r77�����l��6T�~��������a��;�i�ן�o�����=F��(B������r�����B�������������ہ�T���_�_���z9�=%fp�C�I��-�ӭ���"�2�nɘ�����������?�������t:�5�px�	�x�t�m�<�p�b]l�Kw��W�
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
m��N���'!��z�j^��z� �;LzO�z�g�]���I�vh�'	*lޑ<��XUSÙ���x�Z��11�������f\��2��q���ᵤq,��l:�/�v.u�q� �,KH�0o6�dK趌���*�Yw������ON�	�ӕ���[x�P��͚�M�Ei��Qc��<�ݼ���?��-T�g���p�-n���v�n��`_��;m1Ӳ��R�ש}����2rq1�z�\ۆ��q�y�+<��CWe���o��������m/�*��ǫG����'	l�c�ze�[��<��m�H�4W$T�s����a��G�����A2�gq����+���༰^����Wڕl+���q�S�a�n�(�PD�;AVM�AZ�����ܛY����0$�����/;t�_ҳ�{��;]r�$
=ބ��i$0��$1]���x��ex��u��Ƶ�.s����o� q�q�c��nv���������7OI� ����l�
�*�jZ{�I`�"��c�<q�[�.O��TG�pa���

�i9v��4�v�\ �2� =���Z�tb΋s��QU�[i�y�/r��Eٌf�{�4Z�c�ȫ���EV0N���'jv��& �)��%����s�y���t�������/�,O�$T-��z�� \|�\��m}+��rjԎTU��/��#�Hⴆ� ��4�ɂ9z��y�7��DP�G\��l���dc���L�f�����Ҁ��5�b{��y���ZC�X1�=���2l�TGy� �7ԑz���i2���Rg�Vj�N�j�T?K�|���!��[\w�0�@f���Ho��I�t�Ї�p����Λ3�e��u������+3�:�K�6>ze�#2[����9}C��tmo�~�%����W�r<���%�/Ao�Nӫ�"�`�=>��S�V�>����#j\�������7	"��$�}.�{m�C��T�I"��kv���:3*8ͨQdjǐ$��ݳ�RH��1i$���Y4�y�X0b�x�Z�2'�o-���J�7`�`�*�������1��(�P3�E����k',z�rXHW��ZW��"B�u9�M8�ݦQ�$ay8o�n/���D��Л/�Q���W}S.{%%�<�=b9�}x��AXJx��D�N���~ CK�b&��1O<���	9�4N����d��<�S����&�R�@����@�g��jy�����\�#r��rH�	f��Ǌ`�y��I��&I2��E�,���|J�<z>��<^ aɎ�mmL������0,�?l�*W��8�U �  ���.�Z(��-k�M\���J�ݣ~{�����s�2�k�c�.�$k��J�Xr^�Aw���Z�d�Lnڽ7�g����˚,\�[#o/��'��CcC�H���\3��~n�Qd���]�~�|�qgk���+����ƙ�{EF?nml�o�� �� 8�]q�OA�ɲ8K۽�Y[b��aw���T��G+�z��v����_�}�=-_/S�q��<��?����b����0	�2α3.7��B��I!�A湰��PK�K�'lx�����Mu6|QK�nz%$'Ǎ`����l�����_��I}W�9��x��C�{��&8�Cʘ͎L��@y�#s�V��&�ɰY\�@7�:�D�O&٩�oe�|dWp'c[�%Xo���V=y��v�ØjiH���ܶ�p�E�-�0�PlW�Uő�|�"��%�B#/�x&��k��$��f�j��b�0����cC'��~j���	e0A���ր��h�1#ܦY�:���7�r�z�	��Qp�IW�3��Q�%+�$���m�-GN�?L����F�^=ݯ�*���;�P>aQ�!Q+JY�[0�X�x[�^�`�{��ʟo�Ѓ���©(�ۗ�,+>+̖T�}����&�Ტxd)A����v�!�Eh���>���l�92�4eD3�VM$����~i�{�7>���]�D6�
.U�����������ܲ�f%�=���V�;�ǫ�x��B�t\�r��$&(n}���>7ݟ��	nE����+��/�1s>�/O�����c�jj��Q�Y%��?�XW�x��$�Q�@V�<�?-�=���-��P���}���Vӳ㇍������K���y�u���H�\qGw��	[2���|2�������t���l�h�����͌kA*���:�]�GG{�P:[:�<�$N����U�]��~7�����
�e1[�09'����t� ug����7�hS.�ܟ�{��CE	���h"�i���?��〝���7��.�U<��No�Z]�2ë́r�x���$�ĸ%}�u*�ݟ!�t�d�On~}��(��M2��}_;t��
�OU�"&��F�e`[�LuO�����;�䬇z]����]��2o�\��-t}�P*d�+#Lt�FMB!�{�AJ��NdMY�MQ{�֘�}�`����~u�Xl���D�Q[��x;��w�·[��R�i!���U����έ��]5�ek�ng5O��Vum�L~�;M��.�S�]��`g�)���-?�׵��p�t�<�0s�ϯⵔUp��{�3l�O6����W���S�������nթ��U�Em�u{������ٳ��v?�g/���h��=��ü��֮��.�Q艥8>�r�-�j�^�e�Bi�^>;Il�����{�X�n�b͖f4�ES�^DD��.ؼ`7k�ޭ�b���g_;��v�µ�����>���>���`W�+�̹$���� H����bS�#�D�����u7��:5q}������K?ܭ�GJ��z%V�$l�g�)��+80]⺤.��oN�D���� ����ș�����a�9��|��93v������Tw�Cex���Z��cr�Ç����7�����is]r�n�*0K�nF����N:���7\����C�t�&��/h��t��E��[ ��rƓ����9�+�d�����t*#�h��:,9��!Z,).ħ���n�@o�pJ�+��R:'U�����":���w��t�J�C`�>��Z�0�����*B���B�>����4�q8v�p5�7إK�>��l��]�H],�t�Wx��
m���JJ�{��%� -TD��v��99~�ζO��<��~�YI�����a����M7B5�V�t7��`��#y��J��*s/�A�z����;����r�L���g!�{�dC��7���	^e�E, �ǹ;[�nd֧���T+}k_9��Ѹ�,�ń�}����ZU7�t���<������D4�������rQ�KC���
G|��#��S����pڣ����ƙc�w��+5kK]]A(Y.���2آ1����D��<����*���5��p`���!�I�u8J��|����������KB˻���zfY����F�uL��fb���]Ʌm��{l��Dq��4%��z*Q0�R�3���D;90�������5�x�i�1��w��0��;t$ڿ��`��bQ9I�2
wӚ���[ק��2��C��n)�ɚ�8���L;��w��)���(1�Dre��v����T6��*�e�K�=Z�}=����<~�?��¶~�H!��.�a	�a���o�2�y"
�0[�s@���SAi��,�'�!�kۂC�%�/��RO6����|JP�����Cg�SF��W���'u��O�Yw��
'�Ƚ_vtI!�0}�?��
��d�3�j�8&Ȯ��T����N�?ﯼ�LyL���_Й��bυ���q�	�$��R�?�c<yJ�V*�����S�`9@����_�x"��3���qC�C]�-g'[2	����T7�e\����Ӌ�J�a�MǛ+i�n��1Ri��=�$j��I�w��]������
)��R�GFr�������0YI���s��h{����:K�@z���}�l~��`�>Љ�w� ����O�5�e-��|��Cǽ6�r�٫ֽ/���ddg��C���p�㕰�;��7���k��6t�N�h�7Ә���K�:�wd�08>��J�&*-\y�ю8�x��/���K����� --�g��v�ՙ*��?a1�<Kt�R�Fa�@��I
���������7�_�bM�����ll����Q��OWKy��P(�C瘃AŌ��@��������-:��5W�AYp�ߕ�u#�W��G��bDj�V׏]�yJ�p�h�@�����@�:G�O���}���1����Y����#����H�i�D��B~=6ԙ�y���\��?��*�~�f�J�z2wo��ۭp�+�;GvL�y�t`d]Vd��F�=�2#�L	�<�t��K��o��
�2�S�@��hq? ��6"v���Ә��D�=(����[��!��F���!��
jૈ?�q;q�kqQv޼����T�N��ޜU۹���O����β�B� ��b6I�"^a��VP�mqb#��k%�#y�!{ˌJM�l�:��(͸2� &���-���2H亵W����> Yu5�։�gA���7�9;]�o�J���|\��PL��6b9���0���S���>�h?�N�laG`���rOA���Z�Y�_q}.��e��Ը�m�/\�4���3�"���>-��{+��^����u��C�%����^��<�n?��u����ٽq۴�>������AV����_���U      �      x��}I�Ȳ��+�Ugp��ޙ��(�
6�7�i��_�{w�g�ڵ3�t�DFD6fʪ�ά����p#*H�'R��t�頝���P����_���N���S'�dD��A�j�?��EԆ}	SUEk�\V[���jў��H14L�E�l�Z��hb���
;6�?�����?� [/M������Ð'������.�%��5���5{3�t����N���2h��2R��� ѓ��j������Tq�a�am^سHw�:���"r��V�5����[�O��z@lv�+�f���Ds�3;�n�	�G/�ȸ��ָ��P�ۓ�a�%tsY�BGw�eO� k�ak�*?�+@s�x��&#�5��K8�UF���U	ps9���b��@{Gu�^=w�*Fj�!�k.aBn�C�H�t�c��h�W�9�ZF�"%�l��'d,�ƾ/�^�t�HUj1��uӌ��K6��azec� z���A�򳤹4:9*���)�4���)�������fQ�ps9�[�w{�X� T�}4�{b�
��%~�2P�! �<��G�9�1����ʶ����,@��U5�ώ�ʗȽ��>� �����A��CW,�3�e�덷�X��D*�t��D�K������ik{����y��/ ]�����0������@�yOɽ�6��0���Ж�ls^w|f�-Н42��\l-\3J_c�k.!����nh`w�[ -"P��#ݜ1�,�nh�N	!u|gQ�4O-�\ʼ�zK,''kL�8P�F(��mx��:��)�ř�b�Z����vy,�2�Aqdl�]dF���x{�b��v��`���gL������jE�V�͙�:��b�9=<1��i�������Q�(�A �Y/B�0�Tlf`����0qh�Σ�+y�:��(>���]�m�Ԟ��$�U��҅u���?�@�5sj-�\�ol�^N��L�em'�̮�|Q�s���.�r�eU.�bE��`�%������m�h,qCF���r*=�҆,�nBM�m���O0��g�in�hn����[+բͥ\��da���~D&{����W�9W*�v�g[i͟�+�M�����跊H���V$C`};�l�o}���u`s��Ŏ�|r�}�
7W:�5u��f�~�z(�#�^0��eH%U��;���+Hsv�o��#��������wJ/<�+F��E���ݞ��C�?���l��y���X>�d\��d���������ps9�4t�"�F���/��k�`�%�Y��n�d�GN��ds#�E�bf�o"�A�17 ����D�i0-.��	�'��{��+ꀅ��%�3��>�(�.��1*����IPK>��>��`�����$΁s���8���z���S+ֵ����7m[��P�}��T�9�}d���PV�kG�*��\sVv�2�.�⑌�9{!聻(�UP�q�x�Z���z��X+�v;�=�������5g��5i���7�|��jt��ߓ��V�'R"�}�&�. ��j��`��fe�I&�Q�iS#d\�6xVO6��'�!����:qk��V<���P�����!�HfSۋ3��5�[�m��kΚ�R���rc<=�Q��s{���];�]� ����@�N%\�A��Y��Ň���\�;�V���=|
Q3�n{+�:y��]P3��쐷�NW�2�*�8j�{�Aƹ"0g���o��c2���撱T$::�����'Kd\ '�_@����$��1������0�C�)�.ro��a=��m.�r�h�ώ[T;a�]�+����>�l�֏�HJww24F�h�Y aM$z�)饆�ݖ��U�I���4����?k�^�@|�=ߤ��w���+�]/J�E^�k�,����ٿZl`�W��|?D��o�?A���aw�N� �	�����\AD��Kr�8	� ��u{�1��Z��j�̘ +�X�6e�-#���8�5�]�0UW�;�)��z�8~����'Qw���ك��o�:�1��a���P��7r�\�� �[P�Mׂq�p����ΔSW7��5V���.��Q�jp1�g�+�"��bU��`�%�j�v�0�=�l�� הP�2�|���A�Gő���=6�3db���P%לuq����$NU�W21W��g<������q�o����� ���q�3#M���G��ۂw4�]ꗙh����^=��o!4���;t�<��K.����1����E�78��$`/��,��Oʷ'~�U˧׹�D�رZ����3�R����,�3�F��@�E��w	�ꂘ9]M�S'�� E&��Wf�/�E���;s�[��� \�蘭�򖂘�)9�7�M��lWr�^�����z��D�i�n	���������(�V1�鏪�Ya�p���]F�M}y�I �JX�Qu �}�QJ�v�d�P��9��6�]e,I��.l.s :v:V{j�K��[^���JC��w��gIsi_��>X�M\��v\�GbZ�����q�<^��&P��G�'d���9�I��
�U�dy��M���嚲���r�F�9�eW�8�k�}���>��*�3O.���|�ꦎ�Ȫ؟6Ė꫊S�&��-�������ġ���t@�D��������RBXˤCd�$2
��)���LEue���4�e�4��{�k�P�:r�'Ԣ��q��b��v�+�<�+��Ob+��Z"�m��0F�R�������K�vVqvz��v,=w9�aV{�)�<Hf�����i��!���������vZ6���2ݿ�േ��?*�a0�JE/9�;w���`��^�AF��o�%[���^x��="�s~�/�R�7�Y���p�Z)������b%$_�*�R�u�9�#�\�(�׈�7М�\���m���\�;zW���]~@�C1ϡ�x��#�e!�y�z������:��{��')���/�۳֣�/}ܴ��^�H���}�,^��l;3Y���3'̥��#|���;���ӻ�N�S U��|�>�,���J ��u��t�\�����(�� �����r���qۙ�y�W��u>��?B�_����t:x��+�5� �O��������72Q6��� ��g�����f-oT��I�����s��={H�zV�>ƅ<#~��p��G����T���X�lk�I���UϹ�DΎ�rl��N�M�A�{աͥ���϶�D�f���U��=����/E\�0�*�޶ߔ�gU�(h.�L�c��Ӎ��3v�Oe|����&�k.�	�)��~(�Vɝ��m�K�y�.�@�}%�6$B�~���F�����d�#3��9"���YT�͙g)6ں{j��=��W�Wl����5(}�%+�������x�:b&�:8�)R�u��`�R1�����S b2Do2V\u�'�� �u���/�g�Y�{�'B{`���]m������|B���!�3�l�wF���˯��Ɓ�d�c�q�{�o���ˇ�]��ǆqF�P�V3�5���:�%����ls�M^��{oN2��U.�T6^K��I܀�A�E2�C����n��W�@��^��;�e����)�#���U��%��;��,���-ƀ3��E�S��@���"���ŉ�F؟�,
@�쒵`ss�DCچ{��42-wP<Oy|� ���e�LML�H�-X�Kl�(Hu-�Oe:��F�p����h�E��w�C��W�s��n�jN�r�^���j���!��~�
O�b��u�1�w����*�C���-�n��7{�9}#�Y�{�wIsi����;ku'�$���8?'��9�����OQ�YX��JV*�o�(̌D,�۾$mq?_�W��4w���m.eo]"�J�w���L3���k�Jj1���c=�[bC>��>��v�_0Z2d��y���ø���6�]*�K=�\
�YT��)Ʂ�!E)0�t����.��!�0l������!�����{�9�!_�    �`�G+���%hM�0z��?��
�5�D�lj��mF�Wg봗���ڊ�d��w���ul��S���vYk`���l/7�D���k�LǷM����\z��vB��{�t�1�y?O��.��l7ꖸ�&�>�{+��Y�v<&�Z"��O4'c���`�<�IG��i��qy����{㣻��C?:���IG�^��v���RDr2���rhd���|���Ls�iT�y-������O��QZ»Z� DT�wf5�ȋ/�'�.R��j�� ,+T0�	ލr��O�ҳzOCx*�A��2�JT��g����G�͹�]�7X䛾3�d�CH�|����!�<�J'j�W�tOer�4%��W�R�����:��?�&,������v<���_�6���8&����qp���8R�A�L��q�R�v8<`�,'�{���6����>&�=<�{�=7�<뢊@�*9�"�˶yX�'(:/P�6w5��)�.�1���	��IF��;,#����@輽$e���d��-B�6�>��o �>B���k����$Q��dY&�+2��7͟���8�ޞ6�'2"W���mL=S��TY�q�Qrqx�3���������|�෩JV��D�|����A�7y���&�P{A��L�M�V����T��Ĉ��f���k�#+�_xsIٛ�Ù�-�d棙����������w���2�T�"3[tʫ"nA�g�ע��I�Ev��X>�]��р�<v�BH�����{�Q�CJ-��+��R�ޖ��%� |9��:�ǛK��K}�-�BC��#3�V��̋e��U�Ec�����v+�&��%����&`���o.������̙�w���]w���{਒��=͢C'[-�XK"����{�hs),ףcn��I4�c���Gz_�{���!�/,���.E{M�b0��kKS���C1�h�o(_^�#	����NLj��$��� ���ՙ�����N�/���J�U�\��\��e��Lg�Fi?j��C���D�6K{E�nJ���uO���~�0:�;L��6�0�����\�U�n.�l�Bry&Z_ t��5�<܁0�<�@I~K�^��x��~��Rm;��|ȦFR��h�P��`��͹G�}��:�"��[�Ԡ�G��Xi����bW����@(�m1��:���R�#;1�6�(O�4��\5oT`b~��~@XX3�q�D3�pl�7���񱣌S�Tb����):AS9<X���x�����!b�G�@Y-s��=>p����4g�y4�6�A�G����VD�ԏ4��n����d�r��F12���]���W�A��ݵ���a��,ᐹ"V��n�b�7�a:�c���U����/�s���dz�˥�\���W��V�����?����Y���8f�����j��Դ���/���@�g�ė7C��I$��[i��m'�ך����"��]���a���ؖ�@�Y[mi�BN
s�K*���뎝J���|E����f�|@32���\�� �Zv,1Z�l�/��p��c��i��L�\�kc�A���m�Ve���\��КM�2�N9���C�߽�Īd!�S<\_��(��!\&���c�u*}�7�:��;��pg�e�U���Ճ�}�-������r�yaMG�Ag��=�"�h�����0��˶/8�M�ӹ$tb�z��l.c>=�S�\�����t��Hk���I�>���p��Ê�YQT\�"���'�,�������5`]��}M�3aG��N_d�GCN�����0���h��8�(Z�MN�a�Я��s������'w�N�����,+�J�9/>fPmw��<�����[�7g��A��rva��T>!tx���-՜�c��y�9���C�������"����Řۭ�~{08�홃,��[����j���������X���(�09�����@X���̢����l�3���]1�k O+.��d;�^�B��r��]1��bNXN8'�^B�C'������^�TCXE�'&�@�+�r���l]���b��ě�sDw��J+���`�__���������"�zO�������US�^����ԣ���-�Ţ����>��R��g�9�`a���s�աτ��^�m��~Z��K "�Y�!պ�p�9�# �����2�� l����!���NF��"����k���&}��ɣ�x~�{�R�������]?`��G����-�mW��Y|6B�ߔ�2�].}�`'���0���Z��%��n!$��)PW�X^�Z��q1�E���~AD���tH�h-���H3��-�s����vgv0�sdiJ�i����蘵 D+3rw�8�}��-�N�����i\8&�I���آ$S�(��B�G�K��fdj�I�G��C�a���_��� b޼�⴫Do����"���=�R�����#����(�����"�z�iCQB�?\#KO�ޮ��d!|H�X��;�;��zqF���
&Ur0q��%M%Π�QW� Guom}��Y�\�&�֤У�>ٶS��{���v�DVr�䵯����� ��a*=�i�.�G����~�ia��/�9�+Y{��}F?Q�x o���2G�D�/�zޟ�no��4Ͳ>`4�XiѪ�>eT��w� ��AN����\��)͟�p�d!��}<%�>��cR]g�8��v�� �*�C��:=x�- we�l.�v��l�($�'�}Iw�U�m+����CD��z/fSZ�w�����]m5 �&.L��]�<u�9�t��nw<����3�He�件F��;����C!�.&�5OE�ۗ����j����c�y�8�v'�+{.��bTY)�G!"��eh����L*� �l�Γ�#�诗��C�\�R�d�����9�@֖�PVQ"3���@f�;h�0�(��t���C����}/�ւQ��ovk-���	ͯt��>W���Q��'�����\%���>?�\�n��Q��,ߝg`"�_gx� <c��x=S"=��KU�uʵr��Oeq�ff���N�OۀU߿��4�^�2���糪�"K*�-����kQk(��2\��qWv�u���%��_�ߏ��ǛK"��@;��DF��]jy����D�f��y'��m�|[��M�v���Ňj�9s��e�|��z-��q�h5Q���Yna�@�����V�(�U�J��s���]�P�q�������sOEd��EF7�DOQ�+E�^�oF���Bs��7?�V=�8��=�E��%.=��vjzZ�(�wj���_PT;:�~�W��i�{��� �L7?��a�9�g{Ʈ�v�}�u�ps9:�K�bu!��ю�a�ڤT�5ge�Ӂw����{1������������
Ӝ�v\���ab����{h��ps9+�Pi�Sq��� �K�Q��'���+�Ď|�67꬏��0���{�9#��tc�Oie"*m��m��Z;Y,�� &�f��ݽ�A��7}ku��.�j�Z�ٺd��r�o9�Tr����9Y��|�<�z�� <�݁n��,;<KS�|��;t��]�s��M�1?N��Ym����k.!	pO�ř�O��l��w׆��!�?AX��,��[���-�ڦS]��J�U�\Vw���@q��$� P����X=�\���F��Z�#����U "ֿѬ��ow��o��T3���_��b>?�z�n"'��,�8��Eo<�W�C!t��_�q!�Q�#�W>]u�r�_���:�֦2�s}~�'��-^�:�� F����W9>�B�?a�<����k�Oe�lu����s2�
k� �蹺_���V�}0�������7�3οK �P���8c%�^B#+O_�>s^��)���826C�S~��>/��!<�)�n���~8�����:�jQ��;��X�G{U|��~�����\�j���9g�_�i1��,[#�n�� ���pN���CJ�md?b�������|q�h⒎�!�C��h5���j�vW�Mj�Y�*�9o�    ��������b�;���=�kd��a��-<��c~�]�\�i�P3�
�ی,����+����K!4������>�7w�~��%e��p*O��g�>��#Ӊ���%ͥcz��#�Лh�:���%&J5�Ϗ�o�Ν�Z䃥���lj�^�c�~̥��r�z����uM��п�hɉ;̱�t�&���}J����h�0DDds������\�gz_�e;�am�(t~r�5�{�)���<V�5��S���E'���$6�W�~d |�	m��'�ж�� Wt���4�wA\�~���P�g`�ӋZS��<J� b���	�z��H�����f��_q�������#>�^���M�5�ܟ^��ń��JVZ���s��㨵 ��u���Qߏ۫|�>��f��F��ěK҂�ҩ��ٍ�C�:0D�s�G�SC�JG��e4�Em�߁ZU��x���`@D���2�:.�js�!�t��1��x�K!f��9,Ef�bǗ�^́�0��e��<	����o������43��LsN|�y�9\��s�QIE�Cu�g l�N7�6d�9��kڀ�tԛK��}9�1$�X
���jOgϛ��u���}8?�F�E!,�x�E{Ʀ�n��~�}���w=±���a��fqe����X��]siGk��L���t�k[���<���!�����9Hi���ǰ�-w��r51����.�tB�u���v��������v�S8��IbKB��g�����t���_��I(�`iW��Z���6�$����q����q ���kO�9�>5y0�'$~���G��c��nҿ޲�ig����
�֒z���޻��.�Xl�Q����TI-I�V���	� ��}��QmyX�a.;ȶ��_p�<lVAD�֊��nh,��v�lE����߿`���{y(^ΛYL�& 4�P�m��ۼ�o.	S6�e�g(��Syrc�]|����3��{���H�֞>,Ne�|#�&�`x���k�"E��P��^�}��m΋�.c����q��SG�]�_uXs	^���(�:l�N��iU,��!�YM����$bcw:n@f_��yD��������F��<�焘��{ş���4�v0O9�l'q	oa��.�N�;�_�f��b��P��G�̅����C���G���YF1�6-������[�9+�]��E;�X+eOh������*���Ǎ|��
}z!��f,*SQ?M�ps99[;^�r�n��I@���+�>2=��\�?�F�;�]d�jk����y����cG9n�t��i×[��m��a�81���q�"�8s�u��7М��HIgLM��N�.��ߓ�w����2��S����;[�U����4g_���і֦��]r��u@����q�[LX�T����}-����o��T�\���ǃ�N7+B�[d'J��z|�#��7g��N�e���\" �&����k.�lc���dy�L�Νm_�7�f!F�j�Q��벚Κ@����e�1ʊ^,��0u@�^g�� �͹�~G?Ꭰvv�.����f��4g��t�"M9S�#e�\o�����3R��Y{�2{"[���F��@���Gw+gF/�bF�T���N��� K5Y��z�[�Z^�( +����i��3�.��Å굧�����8f=
ᕛ��?C�ݠ��o�g=_y���N"T2:�ޚl���3ת~��wIsi\lG���1���N����1#�h�n���D�	�&�v��ݲ/�>_=b��'Q��Ŷ����+%�������;e?amU�6�2�4�]/�S���wAsY�X[y����-��7J�R��r��z�Ua#�K{5U<6<�"S��j\=SU6E�,T��]�~�ŉw��l8._���[^+�q��%��`m�XB��0��6?�L�@!f��(L�gi5WC/{��'f+c�m.�W(f�����4Ow�+�q���W��Oe^�e�cc�x�-dg^76>�GT��g�\���'F���"��(�+�]�@X��3K����Mؽ�q=�w_�wIsiҸ�{��^��Xߔut6_;t>s:��X�s�ɑ0̢�m����{���A�;�x����\��P̐���W��k�7	5 D�Y��t����wLЅ���'��!|4��Ǿ09���7+h�����j ��B��9'&�L��9��o"� ��&���pV��۴���� boLw���� ӎq�)�s�k7�� fL/6H��tr�n��5l�� ��iι�q�v�[��z�:[�����0?>l�x�?�5���4[�p\�6�}<����RQ��盩�h��h��V�U��:���yvrb��I���ő��/��y�����|ޭX�gj�8>��3p+w��!"��=�Ks>n+�����寕ʿ���,;�$u�=uK-�$,����?�AHLd�3����\g������G���*��H�H&�g�W��ΗN��7���f>��g�=Ir��ʵ�/1u ��W��5����5�Aw���Lsξ�ݑ��6=�����cm������/h��NG�� ��5`_ �La�������g`D��'�R���oH�q�Y-�Ƒ�*����n?��yF��K�!h����K��V�l�Zb�]ʛ��A�I��g�FT�]����$%j�򥯧��,���4����CP-Qo�ϯ����b���?A���vN���3X�`�(7\�N�2�Vm�?6�i�Bo9�V�-�� /v_�������l�r��A�@S�Sy�}|��%���V��Q9�X�|��7��3Ӝ���Q�Y�����b ;����YY�Cԍh伸�q�d����C�p�l|f�snB,'�e8%zCC�-/?YZ���=J��l����4���J�+o#��"E��ɇ�{KBĉ�B�����g�d�Ѭ����(j.�#��&��lB�������Y�Q�x���f�p�s��[��e�:�\�s�C���z���g��X0(����A<V��=��<������*�L�ZZLuDKLߘ?��L�� ��+G��i��nףc}:ϲ�%��$�pRF�Ɓ�w����y6=� �t��፽5�Hq��x�8��E�"p�*���ˡBL��ѱ��f/������d��C�&�dd-ȗ�P ������Y�\֙�cӰ��^ۇ���x���:{O�"޴]|�a�E�1���8���M�����Q��ϼ^�r����l]�C�P�j%�lo6�z��/������x$!��^:�xv�:Y'Ů}���5��`s���4���pM�����}������i���-w����?;|��`/B�_X˵e��D8봿��Z�=|As��w4E�i�P[s�W������B����
 �3�7�:�˒�R>�I���j���|2��4]&��$%�u=��J4�Rx�<�gbW��%�L<��-����C�we�#�p�k��]���gL4�3J?x)q���O�s��\���JQ.�^;��E��s!_��5�f5`#sCG@���ּ���**�5�?�Bh��&�S<Q�%o�:���:����.��.�a&X^)��y�WZ�7gvv�d*^�=�S�L嗐-P*�/�9{�HɚNM)��l�멚���r�$�ϳ������ �w`����jK�,j.�˱���}�j��)W�`�4�[��`���:�A�al=.3��4�d�[�h�Z��<���;7+��Oeoq�����a���n�Z~�����?s��K��	��ޣ�*y��%}nt���X3j66�^�_��+]�-��gܟ*Ps�"]^иC��I!�/<Vfn�_�/)�4a��D���[���r��w�s%���>�("�*㣪j��R.�p����tCy�!{�v<7�:�������y�����?r0���e�_y�ED��b��&<n�cd_^H5�ޓ��l����ly��'I��@�]a1��\@�� � M��m8�a^�u~�c/F��%��e�ٛ��㵮�4g��6v��ռ?��QpEϳ��i�� !  ��MAte��Q9��y��[��R��r�l��i� k� �ZnV�[S�Bh|R�C�(���g _����Ӎ�/>p���B{�258�'�x���j��MIߓ��&�9?j;��N�����kKMԜ?^+=sF��/����]W3?������񓂤emp�<��ΐC ��m�T��4_���ChVش����O�c�FN�婷�i��#�G!�jX>!5/uFa4r�]]^��\�vr>,zl����C���׷�ª�����Rݱ��M�Mz�AU?]�/�9�������?ב��      �   �  x���ْ�J�����r��	VA�D�\@A�Dt��" ��O?,�-z\����2��2Q��M�.�x�ﻞܝ 0B������ �}p�5��p�t鍦��=3�@ �@d�A��pŁ8�G�����;Cn��F���%x�*Q�h@�[~ac�O���ݎ^�o�mi���-�3��~"}�#Pd暋�e�h|f� q��X7���J��>`��6Z��!�Z�g&C��	�����&���l [P�`�?��#���P�#H�N��I������r����@�Ӂ%�e�X��L�p��Jz<�O�编�/9�Y�>_�D��-w�{���7�w��~P��m���e.��_}qF�^�E�L���乫\G�_g"
��i���V�p���T�8�O�%��T�L~˯x�����L���zY�/�V��YfN��c[-&��U�i�R�1��)��6d�x�u$QVa� N�����@(��8��˝j�|�������r����ƿ�����w�9^�=|'1
��ZJx2�8��*��l��|���p�%NG󼸯R��H���4�e���0���4�� ?u|���Fz��i���1a�o��u�c�Я�0f�C68H������tb����=`�#A��0Tl��O�Yr��m��)�6�3�}ژ0�xF��3c#3Ӟ�c�=����Q��j�g���Q�a��)g��φ������ 	4/�?���i�PO�lİ�x��Ήo���Ĳ�)��?��Z��;��ǙI��:��uy�*�N%�3&wBG�ٗ+���l;��O��Ej.��a�o^>,��"����."����Ӛ�V�x�m��Xn6�Σ�^qC���8�I�hH��$^*�n'3��%s~�"�k��ީ���*I1�D�l���Q'��pL)�)Q�0Aq���Cs����X��)CX]J�vܔm����Q����忀0j�#�|?E(m��{�*�V?�Z�5�����z6�8T��G%j�6�ԚV��0=���=#��Fjf��G;��\iH�,'�doD�(�e��E�Дa�s���l��K�!���g�	��C�m�k:�YX�FNH��:,61)�u��YS�d��������L�q�)�R>Z�5-3��Թv�XQ�b3�l���60RӴ(���8FV�'c�QӲD��Aϐ��ɢ���%ٛ�t?6.���5���a�K�.l)ٮD}�"�x�6�a_Ʈiم�����0	���J�'4ΉyU�� Tn��VQ�"�ֻK�:�����'Q�č���X�&���(����c�����`�[=c�2o��b<�VhM)����%sg�i��DU�c���Q�Bkd��u��ZJ{�Z�F�����h��*��KN��n݈�8y�fU�;��xPߚmB��<1x�K�5iG4QC%��Z�"jZv�mƧ�=�������"��OE|��֊��Z8莝������#���l]�F����)7GD%y�(k� V�cP-�ؗj+���q_���ҹt:�U��f���Y����>�;��a���,|Ϻ�"�\���M������[�\�-�?��k��Z��e/V�2�"����F������st�<!ڥ�8�~�Xf��.�O[~�͒�,�}o˺�IT}��'�sSD%ql��{˲z���f'�?�A����.�e��o#��Ø3�J������C���v8QY@����H�2�-��Ect���}U����V�khq�wV���k���~�_[z��k��Q�XP�^'[��]ď�7E[^��*W��Pʖ�	-�!yo�,��ۊ����\�����
��HWV�r}S���蛢e��1��z+��%[s7Yg�s�~U7p�Vt��X�m�-���!���}���lT�jN&�/�f�G��%�m�,�x�G��&�!p�N.�O�� C��/�2��Zm��\�ꢎ�� ��<FW�z����z��zO������y�sKU�����d2�� M-�}�ފ�9�d�,u��/R�!T%j��"d|��ԚVx�vgk�݀q�6���qK�X�hTS��j�r��y(kGs����/�Уl���`��	aϔ����æ�t��4p�(Z�5��@�Bb�ؑ��s��(����ۆDk[��Lb���h���QG�Nl�I�,[ѵO�$��%�n���rb�f�y�h&��b�"��tx%�+���-�"@s���Yi�Pw��OhY	�	�������>��ĵ�4�!�Z禜�����Y�V�8!��fj�$W1 �����1�p|v�5� 7d��T��
il<�VhM[��ՂD��R�P�m��N����j*"V�nMSQf~�L�����x�"}���p�t2����WnMCV��^_T��,�ٱu�����~��Rݒ�[ՂR��Hyr�ew�s���kzw=��nu�J�@b��_ɜ�x���[�UDM��b�ʒ�.@�o	؀W���jA��ZE�tO�m�D�KV���a~��RC�Z���(<A��@w�A�
+�v�����V�5-Uz���H*�I_q���(*7 �NX�m������&]�GA�r�G�U%-S$�L�N�S�g��n������?O3[=�}?ݬN�����0��q�@����x�XE�窧���㶻�'��d�������v'o�?U^`:|��2����/��|�x!A�w���n�o�����A��&:C�YV��HqO�3{��b���ro-e��A�:^��/>�����jw�^r��m�����Ln���9����q� �4QG�A_b�N��"2�� �-���5.ߵ8��:��̂�>)�;M�g��tA����~�%^'޺�����-����,X8xo��t���L�JE`X3�"��N�pb�a�����R�n���j�{�
��i�"8vv�&�Kq��*�f�ӅGx�}#��^��,��S�n�>�^~\���S��D��@�q}yX�M���
�?"��wX���͒�GH�~S�C�p�g2Ħ�tD(�d}��͂/}��)吙�~�����O4w���������kW�l�-y����e���hl��荎c}����?��p*�u������EqfV���"���[$��ґ��6+��f��Zp*S��������w����G�ܙ�=���o�k'@qf��n:_���f^B�S��	S�y���Ş�7�iX����O��Vqh�Jsq��������%�      �      x������ � �      �   �   x�s	�v�J�0�O�Lv�L6��M*̊,3w�L�4�4656��1�(�ʋ̮p/
��4202�5��54S0��22�22���,NLI,���ʲH�06
�2�Jv-6'�Xc3+S������*SNNC�u\1z\\\ g�1`      �   �   x�}��
�@E�o��P�:�;IS�,�U�Pcd�X��W�@*Z<���9��F&��.}�k���qW�8�� �V�w��
e
H)5�G�wb�Y:uu��3=f�:��2�'�j�����������g�B�ܳ{�@C����`Z�ߪ�2����˵9_U�޻y�����a__�B���IK      �   �   x�]���0 ���.Z
�#ƈ�ƅ���'�@��EG��.��S�>�ˏ��5b[�:�G�J�^��{���7�ϗ��z����T� �Em��ֵ�*�L�eIf�����q�O�(�UK��\�,�BFC��?6Aā�^&��K�6�s�0>��6      �   �   x��α�0���)|H[[�l��H��4.HBP��O/ĸ�8x���W
�*^H��Iht������';K�d
w���>.Σ\/�ک*wH$r����3ꚲY&��2P�4����X%�\�;�:�:6G�[�Z�o�b&��
�m7�����;���������_B>h�����P����4�P�U�      �      x������ � �      �   �  x����n�@Ư�)���®w�(�J��&FQj�*���DhZm��B ل?�?f�of��#�@�9��!e2���2siJzH�X�7�>e���؏N�e�6�Po揋�@qP�.X� �a���A��r��|�y<�d�l"m�>O��qةU<ҝh:"��q�cI���:p�\w��S��䅱�D��k�l��	�j/rx����Pq��.X�n2���q���f<6�����_��W(�"i��͛P���ko�ЩD;2���&*��&z��Me��ft�2yvz���p��R���.���)�J�KB����: ؛l��*0+�n�ݝ*Ţ�%�v49�V�l�V��L9P�;k����0|�v6;v��E�afz� �ݥ�|��
���;��g߰|	�u;���12�u���F�������U|�#��/a �m0�d���g���ɥ�쥖 �{	���/�F��frv���Kޕ�5	�*#��[R@��C�	�~�W���D�`�/"l��]'U���a	Vz�%Wf��"�]
�^�� �IhM��~��^�QY�m�:�Q(^ėnS�����-Z��U�S:�)�e�Y*����D2�޺惠V2h�~����bn}������)�1���h�+�f�Z�4N�/����|�C��?��,%      �   �  x���[s�0 ���+��I�p{�\E�/�"�
T�ۯ_��ۇ��ݲ��K2�999��v�ӣa;�`�G�^�5"�ϰ	 ���8|��z|�L/m�E��a� �!���'Dq��4n��&\0������(����r�%��p��z�)@���e7Hq���W���aH)�<�I���,d�9N߷���:A�4S��� ���,Q̱Xj+3mb�'U��5�/Dܷ��(@�mjo����f��?�nP���^��{�L�LP)	"�9��@�d�^|?YĎ�� �Y�F{�C!=v	=~f�����.�Ua$$[���k'���3����J��H�f%U[�8��l�	a�9�>l1�ae^�.��v��p!��22ZW�6�cʿ�O�=[w����)L9��|�	�r$1����Yz��V�v!h�(�u�G�n��h���k����!~����"Y?Y�jo���Y*vN 	�ܠ]�h�i��W�B�}���_U�듮�4ZZ��r�ک2ʥ�R�^��0�ĭW�N*�JL��j����n�%���Nr@^�%���G;6�|��4����ub���1	�F�n�Ó5Uw�5���2'MPiIv�VY���ao�Ty+	�c� �&�4PTOL{�����;A~}��f? ���R      �   �   x����
�@�׿O�(3:���(p�II)n4+Ӣ�BO_DB�
:�g��i���9ge^��r�Ʌ�v�sE`��g�]�F��;���Qn�#������0�rJ�6������A�j���U�f��Ǝ���8a��p�w�:K܅���fjX���ؖ�&{��`��g\'�0�7��~(���(l�Q      �   g  x����n�0�k�)��l�!�.l)k6 �zC�Yh ��ӷ��LG�f*UX�ʲ���?�o��Ŕ�f.m�rPq��Ϳ�ല�\��Of���Z�����<Ւ
`��8}@���8���	���#��pW��L�ZS@C'_:�����"�PVո$��%�)�KӺ����}��C1���Z�Z�Zv�����SDǮ1s���6<Ѯ]Sjl��1�@�����~�a8���(A�H��۝l��������0�>C��\�c�WV��ś>h;/9�۴K�ғ�������}��]��^7���^�lY�g&�p�T��TT��^���Î�a�#��n�~�8B��C�?e8���TZ���VF߀1#�a��U�V�x�����[�,����4����WT� �Sc4��Q��颏����Ͷ�����l�	ig�GF-�{��[�j��`��d��Zn����zKi�f0cV�Bd;:"�|m�d�V��8�
L6��@ٕ���t�����!���w��ذv~`�[�7T��દ�]����}(f���z�Q�M��9ڵ/�S醶�����}��%���ぜ�'W�$t2r��P���h4zqB��      �     x���is�@�?��?`j.d�o�'�4T���0^(Dȯ��]twI������~x��>o&v�¹6U��"��N�&4;-I�� �p�֯���7Ϫ�M�RݾsbZ�r�*H�"�"� ����8�� �D����w��Gy����߻e�cT����H6.�vǘ�;.p�)G�X*��0�pwbg�?m}u��Aw���k(�
"Y�T�Q%1㰺��/Ք���x�����c���)��șr��T�������9���+�v�޵[#�Lҹ��12�qS�rKO��(ʮ;[Ũ��)�/�?	2ǌ�73��4��SLk�Ѹ�ɰ�7o@���]����8�0Y!�zE9�`�N��u<�06g�T�n�t�Ĝ�^Rd�e�f�"hu���:�U����k���(P$}L�Ʒ�h�m�W��퍽�z���l	�T4��m�Q��ֆ�������a[��Xʡ7�K7��\5BѰ�1`��t��Pj���%�&�
�ٸ���-	�vI��T�c���q��A�c�z~�w/m�      �   F  x����n�@���)|�9r�;���-�"(Z[��;M��m��N��de��$_���J�����~7a	< ���H RJ�UHy��G�����j8o����\�l��m�k ����L ���O��?��oI�@��"w�̉��oM�B°� � �W��O}/^8��\�K���W<1:�j���WCx� x�2$3$^i��������~W�߆���v�7궇�������JJFpIS@*ԍ��3k����t�t��oң;��[��w��?���S�v6�`|n7�������㗹v�ԩ:l>���}�XX��ږ����F
NVaZ4
Fy�uax��p�M�R}^�?��e�<׮�[�i]��6�fug��vl��ݯ��u��s4 ��v��=��
�pFE���~��hJC��:.{�R������u${n	��H�P����T�M[�k�Z@�T[��[��Pכ��X]����1��K�"��<� �A�- 1����Wm\�+��n�$ҥ� �����9��,'��h�<��1�}��,���<��>��J�����      �   �  x����r�0���S��$!��P����z�3"VDI�}�j{�u:z�k�|k���辛��2���s2�[�ų��Yw���t�/;�l�x�;b� �$אB%�b��V�X�H ��y�.��ȧ��1��Q�HYR���� �����젙�7\@Kk�瘉\o��t2R���Q+v���|;�X���0`1���+�K�Jq�"�����|?f<>~|V���.xFwn�lH8���U�K��2���y˺p%��J���4�hЋ#/�8��(C}Hl�3mS��_����P�/5�l �O~L�Z�i�_&��b�·�P��s� %�v�$����y��Ki�ذ���^��z�\����Q���4n���h[nb�!����K����"~�z[�b�����,��c�n�o\����؛��Zꯠޟ��r�L�l�������T�W��;�G���x��Hm�^`Y5tc�3��Q��5i�      �   =  x����n�@���pހff�a�"�!��h��A��R���WC�6qa�Y�<��Vd�:�S����r>��G�pb�^� ��0oY$Y����y�b2��I$�����@�.�־���1M�=�x�X��SD�o�e7ʹ���Rj�9+ۻ��O�M��D�D�`�b}�+��L�����#kJC��մqߍjlo�e(Om�ܱ�T�E3�2c���<@D%T��?[��f��Y@�a�f?��J/�� M�9����5�cI���L�ֽ�)�/�*��(?��~�y#�VNOq�y�$�ʋ� !�J����	��+�O      �   �  x��S�n�0|v��(��v���W()�T		�h�A�|}�"�r��b�5���ء�/J�7֥��*!��}�[$���"у��f��zG��� _qv~!;-,-=��U��2$AA�T7e����R��W�j:z�0�'��N��j�L#���^��Yt21>A�d���W�6�#�y�����bmup�U����V���k8N�g \�L0E ��w�K�J���a7^���Ci��3yC�&�@�����{BN�jU������]H��ߟ��T;e��G�n��wy�˾J�zJ�^ŵ��R��Ѕ(~��s�Tp8��`8��댂�9pM���VόS�nM� ��o�v�5����'�L��lX~��ns"/�.�`�*`��\��|�����J�(I�'��+h      �   N  x����n�0���rހ�?i����]a�u
�����ّ���i�%_�<y����XOފ��"��^�s����e���}��MW�t`} |b�Y��\FA0w����瓤]m4ִ\�����Z��9	n�jH蕄q	��aG�9�Ot����������&̔��ˋ�?�Ix�I�f��ga������C ���n���d��	�C<N�Ѕ���!@�e��B��Cڤ<��Z��X���(|91Ow\�M�M����VvYM��¬i����;8��#{I>�~r�|�����¿I2ǔ�a�8�)O��#I�7IТ<      �   �   x�}���0 �sy
^ m;����%���BL���o/!�h�v��[�u��U�1]�?^������C���T�z�,�#�*�l��#�C8��u��24�� ��,�D�{i�2|yI��ezY�`�G�laC� �;����lSϟ�"[���]^"����:=���+ѡj�7}��MӾ5vE%      �   &  x����S�0����W�oCco%��V�q�Y��i����w���Ҟv���~�o?�ً����M�y#�
�:&B����T�y02�Qiٷ�8q��A����qb���
f@+(&.���1�"���s���&�ݽ�<]U���Q�.�y� �w8tj�6��L��?��u&6�T1��]*��0s^l�
��R�|y�b���<-��]�eқT���#����0i�wɌ�~��:��UX����&'��^k;��~7�?�p���Ο~塗����v�����(������iߔﴃ      �   �  x���Ms�@���)��hfw�r(A0Ԫ8����%""�ӗt�Mbri'��a�����c>&7	:.��2,��AC���SoV��A�e�O�tW��2��wonFj�V#�0�_��h O9b�I=�$K����ǻN�߀�����sx�)�0G�N5׽�D��dmA-9�����m�6��N6����9*���\m<��xn☨��f�VΧϿ�|�6'a���(L}��jW�Åop�q����t���1A�nI!�z�L^@.��� �8���]���-	�'�[O��F�s�$���t�>6(�~Ey�b$A�y�/
,��q�4}���LD�]B)�'���ȹd_���U/O����U0�������8e].���]v��]����5�M�3YެT~}�״��5���vK�Wf��9���)5=      �   
  x����n�0���S�X�R�n�af)��nZf2�0����x������9qT���s1|���6�v���T�1h1M*5���/2������ ������wPu>׳��}Ѹ_ �C�&�LbA�0�� ��!�.6Ǡ������!��3�0z�v��:�����
�7J���RM_��<�_�z��}�����]����6��G�Y�h��0��GJ��waf��#~�f��}(S�q�T�y0Ms9�����x�3���k�      �   s  x���K��0��1��7��@a�bbb�G9҈��m��ܯN�u3b*�T=��u�0�@�O��wRu�s7����Jn��jRe �1�A)�s�<�0,���>� � ��lt�g����c��!��ȵ9�]m������G������]���ήy7q����7����V V������d^l)��v�Y-~jg�߆η�2��3�5�q��F�Y�T�t�gk\ŧ��c3?s���BI �y��4ýZ�1�'-������%{)�r�r�����#�m�t�����,�t���r���tL!ԋ�<�6�_�
�JbWHZ�.��+UE3�L��̣f=͢�7�<��2�;-���AҰY��z�_P�M      �   �  x����r�@���������]#����h���!ħ_ح2�)����������7��0x0~GYj�E�!���f=�v�7ļ��E%R�z�<cu	xy�7k�S	<�@���O�v6�sÙo� ����3$�2���rf�}�X�l���o�9E�n��FɢH�a��n���h����#��ԧծWī�)G��c6e��T|�좵-�j��u��`�{̦��U�I���So��1֢:r�B�t��}g�Fˮ�xU��2���iP~��a`~�����tݚ����Ldm�J�O���4ͥ�j�q9qז%F��|f����#�t	�L�U	ה�P������ߺ@�w���s;e�Y`-��ӢܰoM��~�F����VӴ?w3�T      �   �  x����v�0��p���$!	�E"��
�s�AP�R�\�8�tڎ������y��ɷ�*�c���jͩ���C�#N�i�q�;pox����[ �Bz��LZܽ�q��dՒ�Z��,仏뱘o|��f���m}.��U�`������.�`'nS���	 ŭ?�>]B���4�����g�ޞ�3CI�����[&��܊zZ(�Z�{�0��7P�	�z�GZ��ŎU��y$:*�nK�kd/��Oh���<+�i�"�)i�-<�xJˊ�z)<�S͢��l8x�}ǧ� e��h�|x`I���z��c�,G}G'��fW��c���������)�W���ڶ;7j�\�?����{Æ��h���-��JS��G�1�3�����o���i�û��,��%��.0Ggx��xB����5�Xg���K�m5	�L59�+a2+8;f�|�	_¥��2�߶v�Epd���� �0�4�j?��v!<p�k�O�����\/繟lV��k�}��@�M�(����S�
�x�ڒxe�{cu����ͨ��f��rV�ғeu����X�)���̋�(�@O�����ws#�v��ϗ��Z�pAF�3,Q&ҹM0z�з�%Ŵ�p񠳵f��"��ީ��B�t��3|�|*C �?*kI�����0Qs�_�������� c��      �     x����n�@E����Hf`f��R.R���(rQ� ��wlL�=9�N�I���r�.q;G5g���,�`�t��@�T�b �1Q�^tf;a�dO�>A�i�?�hb$�cL��m�`��_ZSů�Ys^>�T:��_�5�@̲)-�jSA7\E��'�f Q<���pҟBiD@b�*)��9M�%�20�&����ţFn*w��p�"���~`V�������B �} �=���0��;V���w�Qo������ֵ,I��{�      �   �  x����N�@�����43�@a�j�I��X��Ĥ����A�y��Bc4�N�j_�o��W�얘X�顑�����Ƴ��H����_���ȶ�<�e����x���װ{ KtXi�ԾK�(*��\A�
)"Fb� x�¤���O�"�^:Z�Ϻ6Q���/b��1�J��o]bM��|��(<�W��qw<����mW�}��L�-�y�szL��i�@�{�Z�'�MĐʝ���yK�ͪ��M�qq ����Yr�yv��Q��%�`ID*� �җ�L("@Ht��L�e�].T���H���s��#��5%�Z�����e�]�?�P��K�m���0o?��DQ�Z��˫��e�����%��#�(�ڍ��]<�m���1�����Q�v�z��j_��O�DD�BH�PħkA�����      �   e  x����n�@�����f�]����"*"񢈂(R���6i��ij��I���g���z=Z�c��k��t����3��|<���V���+�W�����&���fs��P�m�X� Dk0�E^k�ޣvl�r������_w��{�{�ǈ�n��z�g	s�*���ɽ4���Qb�8�����ǚ�"̒->�/�x�e9OL�#,$���A�!aY�,��Dtܒ�������,,C�^���%`!�s �%�#HhAc4[^n�n��Q��ƭIwdxC�,�z��o���?p�D�]ګ�?xoP$&���yu��4�A����[��a2���2,EyD�!����-		�5���0�+����      �      x������ � �      �      x������ � �      �      x������ � �      �   �  x��W[��H~���<g����&7��� "�T��\Qnb*�}a�dٍcf�*VCsN76|������In�8�k2�	`�&x��iڄ��1�X+V�~&+@�
�)��8p��x,�H���2J��4`�W���r�Z���hjCL�U�A�;`�s�@Cv��&�~��r_Z����?}Or۠�����b>{ �4B��|��="��^}DƆ�`�������0Y��?�tLOp�*��gA�祅S`��Etd�k�� x������s�?w��8���v��|�H� �K)��23VƱ�rW�)^�Ĝ��r=SA�4$�$uJ8����$��D��I4wfiў2�۟��v�3RiNp6���0ʃ�{,`�O��JO]���3�'M����m戔�}P�&��:�뮘�1@��~�v�u޷#\3PI2S^x���7� =�s��|�d�����<���&p�1�aڶ=���5�Q	�y72?=
���*2����w��yzz1����֒wU$g��Mt�x>4G�j*T˔O<y�j#OFn�%s���������b��C�H���72�6��>[Y�m�MTT%4%�-�$&,���o�`�������ȍl:�
��[o�ծ��z��'n���#���b7k��Zo;��q{�[w��?�Ɓ��n���s3��}J�{"�0����æ�����a>�梽"��t���Dɂ�R���,Ж�q�Pt@A������a�6���I�24���K��p�	����j��lu��G�Ue�L+�	�I��Q�<g�k_�}��]�]����?wb�3Q��*a�3P1��`9�s����KK��O�"���?���I��x������+<���B�g�x��@oP�K,ˁc��$ZaE�tG�/e�Z�t�b�ʞ��n�<�?_��ٴ��wI��F{�˅*�3O�`�-H~�RM���x���Оz��El������@oj5�Ŋ�;XJ���'�c�'��U,��j|���(���u�����=:���!/}S���{��t�p�A��; E
��rO�N�`������g�:^����d��װi}W��7e�:�T����:U�u���[�Ɣe�E��;5Xgp�����H���GD��z�k[�ľ��F�!�vy}�v���˰�ѝ��tU1�eM�havR��w�X.i����:������%���;�/�>n�Y��#��*=�Q�q���b�����F^�F�߁�v!��8Co��������~S��2dfd�d(oe�}���:�}���-��*LǱ}7[����P಺Ϊj]��	�o�!�� Mu�&af�tm�U���i�=~�u���o)^?�Q�ڔ�	�ά�)�i�7n�%�ys.���{�}0��e_��= �2�L���7��ZrS�]>m��������U �      �   �  x���ْ�J�����h�V�T�7�%�FA\��`�ݧgڙ�h����0�~2�2�Zݑ�ڵ;G�m�p�kw����\��S�~�
��`���ik7v�~h CL_������L	��'��H����Ԅ�AJY�醼l����VUS�:��6� ��.�T�!��Q	q��C< |�r,-��r�B"DL��9=�2MbAwLZ���{:�ʂ G+��,�I8<��d�
ˑI���v4������	�2T��Z���|����+���W�O��l�82�J'Ҳ�u��tdץ#5��k�p"-S��G��u�v�oc;�,���--�˩.��j���9�Z^=��%�'�Q�j��Z��T��`�i��3��ӕ�^�F����r9��2<)vH��=`��G�EҋEg-�xh�E'�-��f�3y�"�qD���VƲ����x��xh���K��f8P�b���t�	��E���~'��zn�d�̈�;�s|��"��g�=Ua��L��)����+��ݞ��b��b���X����!�̳�@7�?;�T�����ŋMs\*����SR�;���~���ky%�A�,����6�������j�{u��?h�����dw
]�U�ږ�����ѭ[����I	C�q"FW�X�I�]$�9gFz�?7��g'�Tr2�s���%�5�!
}"!���%DER���_��42��c������������ē��$�AG@�7s={km�,�9���9�c� W;c�7G��E����Vt��ڌ�˷-� �+�l=H�/�~=��S
�>p�d�N2?�l�P�&�3��[�2��mu5./4����͓�R=,߸�TĠ�����`�����a�+i�S
+İ�x8�ߑ�ez��qn�w�f��}�;�L����n�^��Ukm�#���(�WB�Z�M7l�{���D.ӣ$����S�"KP:^N�ʀgR=�cI���{���i�g�z*2�EC�R��J��P[*��:���,�����0���k,j���p�VΓ,z )�w���tr�T�ZY����M���u��9i��f���\?��zT�Դ��.��ј6F���C9f���mA��ovG?�����x�w���Jy�{O��.�����Z�� ?b���*,k8B��᱉+�{*����x�
��c���ӇǸrO�|���$<Kŏ����?�Ѐ      �   �  x����n�@���S�D]��i��`�N�l����	p؞~�(	ш)J/��>|�_�,�&q�g�gG�u`���_�y�Ȧ�賕�Jz�܌3��YR�&	W�RG	B��3�w����-�tg��7����~���7�7K5�S5��ͭ8.��jD�!�"
Y�� 'w�\��Z��4NŨY>�og��^��So��V�$O�9��q�l?���[��mvEP��J,�����0����Z~�>k �9x(�e�8蛁{z�W��Q�WoH��j���.?�XT�:v�-�H�R��#�OV��p³�.�4Lu�q� C}�[�����8[�P��ޠ��RE��>A�Ey�Z��u��t8��sҜ� �w,e���ѰY�S�n�^&�
&	F��� �E��̹fKg����EA�
,6��:Z̗��*��k\�AA4Bם�wQQ,��,��`|�mxo�JUJ��_C�qt�*��o�fh      �      x������ � �      �      x������ � �      �   �  x���ɒ�J���w�
ft�"	(2(Fo�p@y��;l�TDu/
�$_@���� AM7�fꍒ�ޣ�@EN�<ܶi�/�j@�S�75?M�8S�C��zb�2��3�d�z��$�3������X�I�p;�'�U� {,���s#1���ɰ�԰��hV���{��Yr�C*�r�{��h��<��y���6�=�z`�Rd�����t�����&��M�	�{]��*�њl���
�柎�C=�3+Br�wv7�=`�1�!(b�\��W���GYl�Zy�VȄ{t�`��!x^�X>�rG�����P�QVD�4�n�V�{�i���*�{����cd�J�P����3#gd�#������ڛx�`�J����SjxUN
��������;�]�o��XǄ�4����&ߜ��{S��u���R��)�1ӯ�������zթt�ׅ��.��VA������p�i	�Cm��;'m[�ZV�0�����,�9r^ݩ��{���*�L�2E�	��*�������3��Y��9��2��j ,Os��Uֻ��P����W���ݓ��'������t����Ǟ��2s��!ȣ:n��ç�c�/ {�ϻ���)]ZE'3�'`ӑ�U���Q'�z�t�V!�1�Ա�j�c�S�Z�����r�:.`�1��	�Ԋ��R7�;`�1�8n�~M��~m��=�8\��&�I�p�=F��(kS�2<�����^��錄��U���ooo� %&_      �     x����n�@���}��.��7���FZ5&�|]���W%m�&z��������v���r����a:J�}�J|����C��L�"�""r*�vv���g��(�#	���~��;�	T��_�8��2	'�:)���ň��$4=W�SN�X�P�a�������)?j���Ĉ�,\P�كS��%�j���c��y��Y�݂�D<cVUg֔��Z���q�<�lf�R�uP��[���idf��a���������t���;���(_�2��      �   �   x���0�,J1�+J+OJ5�,IM-Ɉ���I��K�/(�O�
%����ĊK�9����3Əӻ*#��74���=�;������D��R��D���������3�0��������0#���bWeJ�cIz�I~�_j���u`'�e�eg l7"�vC+C|���qqq N�M      �   S  x���[��@���_A�7�Œ9q.�UDų풽au�*��+���v��!�<��>xyz�7�����@��С���z�9�4`������՘(���臁����p�u |�=��H��iq�$�X)��J�{��͡kr�1������4	�'����qj�vK�å����ƮB+�p#W$�ڡ��������ܩB����>a���]G�M�Lo�:��S!����� .�6k_z̶ƴ75�q��c�}�����~���1�k &�Κ�W;6Vm{�0['e�'��*ʬ�AIT�F]��f��Z񤗿�X0��5
o2t5��wic���� ��(��'�2*RJ���fi�=)<uO��=�U��0>8�H�LT�Ss��o�a�� �"�k���։7�'�$���`�����q�D��͸q7����TIe �:|)�)�C8��'�V����S��[�aQ���)�������{�J����U|����4�e��Zn~c�Kѯ��^tU>�~Ms�A�����m�2n�~�~g��ܟ��3+�����R�o�$�j���6o�      �   �  x����r�0 �����@;9pJ�TV!T[Q���RΤ���~w���^�"�����db.��S�)��r�T�. ��;����y�m�P �����+�x���1�
`��;H�:@�a�a^�@ʟ��/��v?~��W��U?��e҃�����P��F��en<�r����L[�L �⥙�"�����k֙,���M#2Zɻ�w��?�)#z�'�r�j�J)ς���)~�Ƞ��KG�_���CtY�%��i���\^.GW��Ş:s�ƘFvX~�t�O�F��u]K��-�̷�����[����T�}�5��j���1>oW(�j���:�E�vʽϛ[an��3�N�A=W�aQ���TߚF������ηR`��˄)��/��$�g��U      �   N  x���ێ�JF��)��SUP��DPN�(���Q�QZAE}�Q�����ĪtbBbb��?|U�t�]o�&b��{m� �u6���:d`��W�S2�V_g�g,+UX�t7���^��L.�T��`Ϡ7 `�x<��
JI5Lwc��A q߁��o��1+#��p��P9���v;@4�/-�I�*�&�Q˂m��D��A�TXb$����ͩ-Ө�bt��N�t��8��zcN1����9G��s��Z-�ߵ�j�(�~����.Z�j���M�؛���7m0K�H�	Q�����ֵ�V$`k�8�W��_��KZ0���;N涻s�[�qI��S�����r.K_�$#��Rpl^�Sowu�{ǵ5-�园�����c�
����`3M��.˚/���zL��O0f����`p��z�]����T`^���,@���{u�E��RS���ߌ���9(�`0,�X��!�ԼP�c�Q�,l,~=^Zpͤ��Ap��u������&PY��}Z �)���؉��0i�*��QG��G���ov?�f\Z!�E{ �פ��-;(Ӄ�\�˗����}���"a��{��C�eA�T�/ʐk�""�caw��}{ 	�� �O�LpN�]��nH��X�Oe��Ђ9�GBװl�+,
�&�>���d,����Q{����w��Wj�M�$&_J!�Q����tfI�+ɶ�E�I3���d͐d$�M0��'�Qx�r�k~Mb��Ԙ ����_L��f�3}k��v���ME}/��yy�߯&j!�8C;�S].>@��E�g�"8@i��N�������8݇��[���	�]v"      �   �  x����r�@�u��@���w@�\gp���%����O�*��LR5gy_�����i��/時3�w���`-&m�D {�����g%�W9�po�5�'�]/����p�c��,K�2��������
�QF�3�)��)�]�zȋ,�#0+E���W/i8�t��k��A��|��K��+B���/�Mͭ��������T	a&C&�}+mN���\�T������8��w��� ��7�~A��Iz�%�Ӈ�I�#���GG��T�9q��K}�ǌȃ:�%����"Mo�/}�{�̠6��<^�±ߦ�
A[����8q{�	DU.�$��Hyq�y���"*aȰ�Ƚ�mft�����.��S��N�_��ڤ��_m@Ƅ��~N�aʰ2�/��h�7��$      �   �  x���َ�@�k|�~��TQU,ug�@��Ҁ�d� .����<�0�b��h%p_N��䀮��s@|?�;�1���6�e��^dq �P߀{����M�q�g�s����@���$b����`�JZ���C��ެmc�[��QʆgD��4^�
�wtV��t��6G����f�,���g�^�@�fo[]�pK�I��Be��>�Dj2ї�,���l���-;e���4&T�@����;yQd9Y�h&HfʵFe�`3��t��,򵢬dk���������#�.���U���J�>i���i��r{^"=���l�JS������I�p?�f˷��o���A@	���ݣ_�6�<�̱��q��{v�w{�q�_��I�SWԔjĪ�����C�����~V?��Q(��F*��'΁�IQ����o�?��j�Q7	�uэ_���H�����>D�0#;��>����2�7����g
R�)�/�k�f�ݣ4��:�V��ra�`L�Ŕx��o_3���>H���-�A5j&;K�!��Џ�C�d�Aԋ�2d[�=S���΅7|b�����GŊ���
���!�bpQ�Μ>�=�xtę����	��Z=Q�3��ܳ�����w<�X����2�c�1���c	���2��8!��_Z��o�x��     