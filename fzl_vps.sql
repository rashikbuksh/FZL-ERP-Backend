PGDMP          	        	    |            fzl_vps    16.3    16.3 �   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    288025    fzl_vps    DATABASE     �   CREATE DATABASE fzl_vps WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE fzl_vps;
                postgres    false                        2615    288026 
   commercial    SCHEMA        CREATE SCHEMA commercial;
    DROP SCHEMA commercial;
                postgres    false                        2615    288027    delivery    SCHEMA        CREATE SCHEMA delivery;
    DROP SCHEMA delivery;
                postgres    false                        2615    288028    drizzle    SCHEMA        CREATE SCHEMA drizzle;
    DROP SCHEMA drizzle;
                postgres    false                        2615    288029    hr    SCHEMA        CREATE SCHEMA hr;
    DROP SCHEMA hr;
                postgres    false            	            2615    288030    lab_dip    SCHEMA        CREATE SCHEMA lab_dip;
    DROP SCHEMA lab_dip;
                postgres    false            
            2615    288031    material    SCHEMA        CREATE SCHEMA material;
    DROP SCHEMA material;
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    15                        2615    288032    purchase    SCHEMA        CREATE SCHEMA purchase;
    DROP SCHEMA purchase;
                postgres    false                        2615    288033    slider    SCHEMA        CREATE SCHEMA slider;
    DROP SCHEMA slider;
                postgres    false                        2615    288034    thread    SCHEMA        CREATE SCHEMA thread;
    DROP SCHEMA thread;
                postgres    false                        2615    288035    zipper    SCHEMA        CREATE SCHEMA zipper;
    DROP SCHEMA zipper;
                postgres    false                       1247    288037    batch_status    TYPE     m   CREATE TYPE zipper.batch_status AS ENUM (
    'pending',
    'completed',
    'rejected',
    'cancelled'
);
    DROP TYPE zipper.batch_status;
       zipper          postgres    false    14                       1247    288046    order_type_enum    TYPE     U   CREATE TYPE zipper.order_type_enum AS ENUM (
    'full',
    'slider',
    'tape'
);
 "   DROP TYPE zipper.order_type_enum;
       zipper          postgres    false    14                       1247    288054    print_in_enum    TYPE     `   CREATE TYPE zipper.print_in_enum AS ENUM (
    'portrait',
    'landscape',
    'break_down'
);
     DROP TYPE zipper.print_in_enum;
       zipper          postgres    false    14                       1247    288062    slider_starting_section_enum    TYPE     �   CREATE TYPE zipper.slider_starting_section_enum AS ENUM (
    'die_casting',
    'slider_assembly',
    'coloring',
    '---'
);
 /   DROP TYPE zipper.slider_starting_section_enum;
       zipper          postgres    false    14                       1247    288072    swatch_status_enum    TYPE     a   CREATE TYPE zipper.swatch_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);
 %   DROP TYPE zipper.swatch_status_enum;
       zipper          postgres    false    14            X           1255    288079 /   sfg_after_commercial_pi_entry_delete_function()    FUNCTION     r  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS trigger
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
   commercial          postgres    false    5            �           1255    288080 /   sfg_after_commercial_pi_entry_insert_function()    FUNCTION     r  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS trigger
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
   commercial          postgres    false    5            s           1255    288081 /   sfg_after_commercial_pi_entry_update_function()    FUNCTION     �  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS trigger
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
   commercial          postgres    false    5            �           1255    288082 2   packing_list_after_challan_entry_delete_function()    FUNCTION     +  CREATE FUNCTION delivery.packing_list_after_challan_entry_delete_function() RETURNS trigger
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
       delivery          postgres    false    6            q           1255    288083 2   packing_list_after_challan_entry_insert_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_insert_function() RETURNS trigger
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
       delivery          postgres    false    6            �           1255    288084 2   packing_list_after_challan_entry_update_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_update_function() RETURNS trigger
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
       delivery          postgres    false    6            �           1255    288085 2   sfg_after_challan_receive_status_delete_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS trigger
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
       delivery          postgres    false    6            �           1255    288086 2   sfg_after_challan_receive_status_insert_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS trigger
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
       delivery          postgres    false    6            �           1255    288087 2   sfg_after_challan_receive_status_update_function()    FUNCTION     9  CREATE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS trigger
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
       delivery          postgres    false    6            I           1255    288088 .   sfg_after_packing_list_entry_delete_function()    FUNCTION     Q  CREATE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS trigger
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
       delivery          postgres    false    6            r           1255    288089 .   sfg_after_packing_list_entry_insert_function()    FUNCTION     Q  CREATE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS trigger
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
       delivery          postgres    false    6            u           1255    288090 .   sfg_after_packing_list_entry_update_function()    FUNCTION     o  CREATE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS trigger
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
       delivery          postgres    false    6            S           1255    288091 +   material_stock_after_material_info_delete()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 D   DROP FUNCTION material.material_stock_after_material_info_delete();
       material          postgres    false    10            L           1255    288092 +   material_stock_after_material_info_insert()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_insert() RETURNS trigger
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
       material          postgres    false    10            k           1255    288093 *   material_stock_after_material_trx_delete()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_delete() RETURNS trigger
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
       material          postgres    false    10            �           1255    288094 *   material_stock_after_material_trx_insert()    FUNCTION     l  CREATE FUNCTION material.material_stock_after_material_trx_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    288095 *   material_stock_after_material_trx_update()    FUNCTION     C  CREATE FUNCTION material.material_stock_after_material_trx_update() RETURNS trigger
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
       material          postgres    false    10            �           1255    288096 +   material_stock_after_material_used_delete()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_delete() RETURNS trigger
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
       material          postgres    false    10            N           1255    288097 +   material_stock_after_material_used_insert()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    288098 +   material_stock_after_material_used_update()    FUNCTION     L  CREATE FUNCTION material.material_stock_after_material_used_update() RETURNS trigger
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
       material          postgres    false    10            �           1255    288099 ,   material_stock_after_purchase_entry_delete()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS trigger
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
       material          postgres    false    10            �           1255    288100 ,   material_stock_after_purchase_entry_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    288101 ,   material_stock_after_purchase_entry_update()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS trigger
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
       material          postgres    false    10            _           1255    288102 .   material_stock_sfg_after_stock_to_sfg_delete()    FUNCTION     4  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS trigger
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
       material          postgres    false    10            n           1255    288103 .   material_stock_sfg_after_stock_to_sfg_insert()    FUNCTION     =  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS trigger
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
       material          postgres    false    10            o           1255    288104 .   material_stock_sfg_after_stock_to_sfg_update()    FUNCTION       CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS trigger
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
       material          postgres    false    10            �           1255    288105 >   thread_batch_entry_after_batch_entry_production_delete_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS trigger
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
       public          postgres    false    15            �           1255    288106 >   thread_batch_entry_after_batch_entry_production_insert_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS trigger
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
       public          postgres    false    15            O           1255    288107 >   thread_batch_entry_after_batch_entry_production_update_funct()    FUNCTION     P  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS trigger
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
       public          postgres    false    15            x           1255    288108 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_delete()    FUNCTION        CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() RETURNS trigger
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
       public          postgres    false    15            �           1255    288109 @   thread_batch_entry_and_order_entry_after_batch_entry_trx_funct()    FUNCTION       CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS trigger
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
       public          postgres    false    15            y           1255    288110 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_update()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() RETURNS trigger
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
       public          postgres    false    15            e           1255    288111 -   thread_order_entry_after_batch_entry_delete()    FUNCTION     ;  CREATE FUNCTION public.thread_order_entry_after_batch_entry_delete() RETURNS trigger
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
       public          postgres    false    15            A           1255    288112 -   thread_order_entry_after_batch_entry_insert()    FUNCTION     B  CREATE FUNCTION public.thread_order_entry_after_batch_entry_insert() RETURNS trigger
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
       public          postgres    false    15            z           1255    288113 ?   thread_order_entry_after_batch_entry_transfer_quantity_delete()    FUNCTION     @  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_delete() RETURNS trigger
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
       public          postgres    false    15            �           1255    288114 ?   thread_order_entry_after_batch_entry_transfer_quantity_insert()    FUNCTION     @  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_insert() RETURNS trigger
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
       public          postgres    false    15            v           1255    288115 ?   thread_order_entry_after_batch_entry_transfer_quantity_update()    FUNCTION     X  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_update() RETURNS trigger
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
       public          postgres    false    15            D           1255    288116 -   thread_order_entry_after_batch_entry_update()    FUNCTION     \  CREATE FUNCTION public.thread_order_entry_after_batch_entry_update() RETURNS trigger
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
       public          postgres    false    15            �           1255    288117 +   thread_order_entry_after_challan_received()    FUNCTION     (  CREATE FUNCTION public.thread_order_entry_after_challan_received() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE thread.order_entry
        SET
            warehouse = warehouse - CASE WHEN NEW.received = 1 THEN thread_order_entry.quantity ELSE 0 END + CASE WHEN OLD.received = 1 THEN thread_order_entry.quantity ELSE 0 END,
            delivered = delivered + CASE WHEN NEW.received = 1 THEN thread_order_entry.quantity ELSE 0 END - CASE WHEN OLD.received = 1 THEN thread_order_entry.quantity ELSE 0 END
        FROM 
            (
                SELECT order_entry.uuid, challan_entry.quantity 
                FROM thread.challan_entry 
                LEFT JOIN thread.order_entry ON thread.challan_entry.order_entry_uuid = thread.order_entry.uuid 
                LEFT JOIN thread.challan ON thread.challan_entry.challan_uuid = thread.challan.uuid
                WHERE thread.challan.uuid = NEW.uuid
            ) as thread_order_entry
        WHERE
            thread.order_entry.uuid = thread_order_entry.uuid;

    RETURN NEW;
END;
$$;
 B   DROP FUNCTION public.thread_order_entry_after_challan_received();
       public          postgres    false    15            d           1255    288118 2   zipper_batch_entry_after_batch_production_delete()    FUNCTION     F  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_delete() RETURNS trigger
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
       public          postgres    false    15            ^           1255    288119 2   zipper_batch_entry_after_batch_production_insert()    FUNCTION     R  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_insert() RETURNS trigger
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
       public          postgres    false    15            m           1255    288120 2   zipper_batch_entry_after_batch_production_update()    FUNCTION     �  CREATE FUNCTION public.zipper_batch_entry_after_batch_production_update() RETURNS trigger
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
       public          postgres    false    15            ~           1255    288121 %   zipper_sfg_after_batch_entry_delete()    FUNCTION     #  CREATE FUNCTION public.zipper_sfg_after_batch_entry_delete() RETURNS trigger
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
       public          postgres    false    15            J           1255    288122 %   zipper_sfg_after_batch_entry_insert()    FUNCTION     %  CREATE FUNCTION public.zipper_sfg_after_batch_entry_insert() RETURNS trigger
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
       public          postgres    false    15            U           1255    288123 %   zipper_sfg_after_batch_entry_update()    FUNCTION     E  CREATE FUNCTION public.zipper_sfg_after_batch_entry_update() RETURNS trigger
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
       public          postgres    false    15            w           1255    288124 A   assembly_stock_after_die_casting_to_assembly_stock_delete_funct()    FUNCTION     1  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288125 A   assembly_stock_after_die_casting_to_assembly_stock_insert_funct()    FUNCTION     <  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS trigger
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
       slider          postgres    false    12            {           1255    288126 A   assembly_stock_after_die_casting_to_assembly_stock_update_funct()    FUNCTION     U  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288127 8   slider_die_casting_after_die_casting_production_delete()    FUNCTION     |  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_delete() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288128 8   slider_die_casting_after_die_casting_production_insert()    FUNCTION     }  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() RETURNS trigger
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
       slider          postgres    false    12            |           1255    288129 8   slider_die_casting_after_die_casting_production_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_update() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288130 3   slider_die_casting_after_trx_against_stock_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288131 3   slider_die_casting_after_trx_against_stock_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() RETURNS trigger
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
       slider          postgres    false    12            K           1255    288132 3   slider_die_casting_after_trx_against_stock_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_update() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288133 0   slider_stock_after_coloring_transaction_delete()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288134 0   slider_stock_after_coloring_transaction_insert()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288135 0   slider_stock_after_coloring_transaction_update()    FUNCTION     7  CREATE FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288136 3   slider_stock_after_die_casting_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288137 3   slider_stock_after_die_casting_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS trigger
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
       slider          postgres    false    12            Z           1255    288138 3   slider_stock_after_die_casting_transaction_update()    FUNCTION     *  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS trigger
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
       slider          postgres    false    12            `           1255    288139 -   slider_stock_after_slider_production_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_slider_production_delete() RETURNS trigger
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
       slider          postgres    false    12            [           1255    288140 -   slider_stock_after_slider_production_insert()    FUNCTION     o  CREATE FUNCTION slider.slider_stock_after_slider_production_insert() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288141 -   slider_stock_after_slider_production_update()    FUNCTION     {  CREATE FUNCTION slider.slider_stock_after_slider_production_update() RETURNS trigger
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
       slider          postgres    false    12            g           1255    288142 '   slider_stock_after_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_transaction_delete() RETURNS trigger
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
       slider          postgres    false    12            f           1255    288143 '   slider_stock_after_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_transaction_insert() RETURNS trigger
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
       slider          postgres    false    12            �           1255    288144 '   slider_stock_after_transaction_update()    FUNCTION     `  CREATE FUNCTION slider.slider_stock_after_transaction_update() RETURNS trigger
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
       slider          postgres    false    12            i           1255    288145 *   order_entry_after_batch_is_drying_update()    FUNCTION     �  CREATE FUNCTION thread.order_entry_after_batch_is_drying_update() RETURNS trigger
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
       thread          postgres    false    13            �           1255    288146 *   order_entry_after_batch_is_dyeing_update()    FUNCTION       CREATE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS trigger
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
       thread          postgres    false    13            c           1255    288147 6   order_description_after_dyed_tape_transaction_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS trigger
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
       zipper          postgres    false    14            M           1255    288148 6   order_description_after_dyed_tape_transaction_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288149 6   order_description_after_dyed_tape_transaction_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS trigger
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
       zipper          postgres    false    14            W           1255    288150 4   order_description_after_tape_coil_to_dyeing_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() RETURNS trigger
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
       zipper          postgres    false    14            G           1255    288151 4   order_description_after_tape_coil_to_dyeing_insert()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() RETURNS trigger
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
       zipper          postgres    false    14            ]           1255    288152 4   order_description_after_tape_coil_to_dyeing_update()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() RETURNS trigger
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
       zipper          postgres    false    14            }           1255    288153    sfg_after_order_entry_delete()    FUNCTION     �   CREATE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 5   DROP FUNCTION zipper.sfg_after_order_entry_delete();
       zipper          postgres    false    14            E           1255    288154    sfg_after_order_entry_insert()    FUNCTION       CREATE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS trigger
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
       zipper          postgres    false    14            H           1255    288155 *   sfg_after_sfg_production_delete_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_delete_function() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288156 *   sfg_after_sfg_production_insert_function()    FUNCTION     �  CREATE FUNCTION zipper.sfg_after_sfg_production_insert_function() RETURNS trigger
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
       zipper          postgres    false    14            F           1255    288157 *   sfg_after_sfg_production_update_function()    FUNCTION     D  CREATE FUNCTION zipper.sfg_after_sfg_production_update_function() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288158 +   sfg_after_sfg_transaction_delete_function()    FUNCTION     (  CREATE FUNCTION zipper.sfg_after_sfg_transaction_delete_function() RETURNS trigger
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
       zipper          postgres    false    14            j           1255    288159 +   sfg_after_sfg_transaction_insert_function()    FUNCTION     *  CREATE FUNCTION zipper.sfg_after_sfg_transaction_insert_function() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288160 +   sfg_after_sfg_transaction_update_function()    FUNCTION     ?  CREATE FUNCTION zipper.sfg_after_sfg_transaction_update_function() RETURNS trigger
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
       zipper          postgres    false    14            a           1255    288161 A   stock_after_material_trx_against_order_description_delete_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288162 A   stock_after_material_trx_against_order_description_insert_funct()    FUNCTION     =  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288163 A   stock_after_material_trx_against_order_description_update_funct()    FUNCTION     i  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS trigger
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
       zipper          postgres    false    14            Q           1255    288164 &   tape_coil_after_tape_coil_production()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS trigger
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
       zipper          postgres    false    14                       1255    288165 -   tape_coil_after_tape_coil_production_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288166 -   tape_coil_after_tape_coil_production_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS trigger
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
       zipper          postgres    false    14            p           1255    288167 !   tape_coil_after_tape_trx_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS trigger
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
       zipper          postgres    false    14            T           1255    288168 !   tape_coil_after_tape_trx_insert()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS trigger
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
       zipper          postgres    false    14            V           1255    288169 !   tape_coil_after_tape_trx_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS trigger
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
       zipper          postgres    false    14            h           1255    288170 A   tape_coil_and_order_description_after_dyed_tape_transaction_del()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() RETURNS trigger
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
       zipper          postgres    false    14            b           1255    288171 A   tape_coil_and_order_description_after_dyed_tape_transaction_ins()    FUNCTION       CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    288172 A   tape_coil_and_order_description_after_dyed_tape_transaction_upd()    FUNCTION     2  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() RETURNS trigger
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
       zipper          postgres    false    14            �            1259    288173    bank    TABLE     /  CREATE TABLE commercial.bank (
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
   commercial         heap    postgres    false    5            �            1259    288178    lc_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.lc_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.lc_sequence;
    
   commercial          postgres    false    5            �            1259    288179    lc    TABLE     �  CREATE TABLE commercial.lc (
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
   commercial         heap    postgres    false    226    5            �            1259    288193    pi_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.pi_sequence;
    
   commercial          postgres    false    5            �            1259    288194    pi_cash    TABLE     �  CREATE TABLE commercial.pi_cash (
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
   commercial         heap    postgres    false    228    5            �            1259    288206    pi_cash_entry    TABLE     .  CREATE TABLE commercial.pi_cash_entry (
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
   commercial         heap    postgres    false    5            �            1259    288211    challan_sequence    SEQUENCE     {   CREATE SEQUENCE delivery.challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE delivery.challan_sequence;
       delivery          postgres    false    6            �            1259    288212    challan    TABLE     �  CREATE TABLE delivery.challan (
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
       delivery         heap    postgres    false    231    6            �            1259    288220    challan_entry    TABLE     �   CREATE TABLE delivery.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    packing_list_uuid text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 #   DROP TABLE delivery.challan_entry;
       delivery         heap    postgres    false    6            �            1259    288225    packing_list_sequence    SEQUENCE     �   CREATE SEQUENCE delivery.packing_list_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE delivery.packing_list_sequence;
       delivery          postgres    false    6            �            1259    288226    packing_list    TABLE     �  CREATE TABLE delivery.packing_list (
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
       delivery         heap    postgres    false    234    6            �            1259    288232    packing_list_entry    TABLE     Y  CREATE TABLE delivery.packing_list_entry (
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
       delivery         heap    postgres    false    6            �            1259    288239    users    TABLE     C  CREATE TABLE hr.users (
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
       hr         heap    postgres    false    8            �            1259    288245    buyer    TABLE     �   CREATE TABLE public.buyer (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.buyer;
       public         heap    postgres    false    15            �            1259    288250    factory    TABLE       CREATE TABLE public.factory (
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
       public         heap    postgres    false    15            �            1259    288255 	   marketing    TABLE       CREATE TABLE public.marketing (
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
       public         heap    postgres    false    15            �            1259    288260    merchandiser    TABLE     $  CREATE TABLE public.merchandiser (
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
       public         heap    postgres    false    15            �            1259    288265    party    TABLE       CREATE TABLE public.party (
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
       public         heap    postgres    false    15            �            1259    288270 
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
       public         heap    postgres    false    15            �            1259    288275    stock    TABLE     a  CREATE TABLE slider.stock (
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
       slider         heap    postgres    false    12            �            1259    288295    order_description    TABLE     T  CREATE TABLE zipper.order_description (
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
    is_inch integer DEFAULT 0,
    order_type zipper.order_type_enum DEFAULT 'full'::zipper.order_type_enum,
    is_meter integer DEFAULT 0,
    is_cm integer DEFAULT 0
);
 %   DROP TABLE zipper.order_description;
       zipper         heap    postgres    false    1042    1042    14    1048            �            1259    288311    order_entry    TABLE     y  CREATE TABLE zipper.order_entry (
    uuid text NOT NULL,
    order_description_uuid text,
    style text NOT NULL,
    color text,
    size text,
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
       zipper         heap    postgres    false    1051    1051    14            �            1259    288321    order_info_sequence    SEQUENCE     |   CREATE SEQUENCE zipper.order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE zipper.order_info_sequence;
       zipper          postgres    false    14            �            1259    288322 
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
       zipper         heap    postgres    false    247    1045    14    1045            �            1259    288334    sfg    TABLE     �  CREATE TABLE zipper.sfg (
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
       zipper         heap    postgres    false    14            �            1259    288352 	   tape_coil    TABLE     �  CREATE TABLE zipper.tape_coil (
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
       zipper         heap    postgres    false    14            �            1259    288364    v_order_details_full    VIEW     `  CREATE VIEW zipper.v_order_details_full AS
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
    order_description.is_inch,
    order_description.is_meter,
    order_description.is_cm,
    order_description.order_type
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
       zipper          postgres    false    244    245    245    245    245    245    245    238    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    245    238    239    239    248    248    239    240    240    248    241    241    242    242    243    243    243    244    244    245    245    248    248    248    248    248    248    248    248    248    248    248    248    248    250    250    248    237    237    1042    1048    14    1045            �            1259    288369    v_packing_list    VIEW     �  CREATE VIEW delivery.v_packing_list AS
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
       delivery          postgres    false    246    246    249    249    235    236    236    236    249    246    251    251    246    236    236    235    235    235    236    235    246    236    235    235    235    251    251    237    237    235    235    246    249    236    236    6            �            1259    288374    migrations_details    TABLE     t   CREATE TABLE drizzle.migrations_details (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
 '   DROP TABLE drizzle.migrations_details;
       drizzle         heap    postgres    false    7            �            1259    288379    migrations_details_id_seq    SEQUENCE     �   CREATE SEQUENCE drizzle.migrations_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE drizzle.migrations_details_id_seq;
       drizzle          postgres    false    7    253            �           0    0    migrations_details_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE drizzle.migrations_details_id_seq OWNED BY drizzle.migrations_details.id;
          drizzle          postgres    false    254            �            1259    288380 
   department    TABLE     �   CREATE TABLE hr.department (
    uuid text NOT NULL,
    department text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.department;
       hr         heap    postgres    false    8                        1259    288385    designation    TABLE     �   CREATE TABLE hr.designation (
    uuid text NOT NULL,
    designation text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.designation;
       hr         heap    postgres    false    8                       1259    288390    policy_and_notice    TABLE       CREATE TABLE hr.policy_and_notice (
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
       hr         heap    postgres    false    8                       1259    288395    info    TABLE     L  CREATE TABLE lab_dip.info (
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
       lab_dip         heap    postgres    false    9                       1259    288401    info_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE lab_dip.info_id_seq;
       lab_dip          postgres    false    9    258            �           0    0    info_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE lab_dip.info_id_seq OWNED BY lab_dip.info.id;
          lab_dip          postgres    false    259                       1259    288402    recipe    TABLE     t  CREATE TABLE lab_dip.recipe (
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
       lab_dip         heap    postgres    false    9                       1259    288409    recipe_entry    TABLE       CREATE TABLE lab_dip.recipe_entry (
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
       lab_dip         heap    postgres    false    9                       1259    288414    recipe_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE lab_dip.recipe_id_seq;
       lab_dip          postgres    false    9    260            �           0    0    recipe_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE lab_dip.recipe_id_seq OWNED BY lab_dip.recipe.id;
          lab_dip          postgres    false    262                       1259    288415    shade_recipe_sequence    SEQUENCE        CREATE SEQUENCE lab_dip.shade_recipe_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE lab_dip.shade_recipe_sequence;
       lab_dip          postgres    false    9                       1259    288416    shade_recipe    TABLE     }  CREATE TABLE lab_dip.shade_recipe (
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
       lab_dip         heap    postgres    false    263    9            	           1259    288423    shade_recipe_entry    TABLE       CREATE TABLE lab_dip.shade_recipe_entry (
    uuid text NOT NULL,
    shade_recipe_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE lab_dip.shade_recipe_entry;
       lab_dip         heap    postgres    false    9            
           1259    288428    info    TABLE     �  CREATE TABLE material.info (
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
    created_by text,
    average_lead_time integer DEFAULT 0
);
    DROP TABLE material.info;
       material         heap    postgres    false    10                       1259    288435    section    TABLE     �   CREATE TABLE material.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.section;
       material         heap    postgres    false    10                       1259    288440    stock    TABLE     �  CREATE TABLE material.stock (
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
       material         heap    postgres    false    10                       1259    288473    stock_to_sfg    TABLE     =  CREATE TABLE material.stock_to_sfg (
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
       material         heap    postgres    false    10                       1259    288478    trx    TABLE       CREATE TABLE material.trx (
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
       material         heap    postgres    false    10                       1259    288483    type    TABLE     �   CREATE TABLE material.type (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.type;
       material         heap    postgres    false    10                       1259    288488    used    TABLE     J  CREATE TABLE material.used (
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
       material         heap    postgres    false    10                       1259    288494    machine    TABLE     1  CREATE TABLE public.machine (
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
       public         heap    postgres    false    15                       1259    288506    section    TABLE     w   CREATE TABLE public.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text
);
    DROP TABLE public.section;
       public         heap    postgres    false    15                       1259    288511    purchase_description_sequence    SEQUENCE     �   CREATE SEQUENCE purchase.purchase_description_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE purchase.purchase_description_sequence;
       purchase          postgres    false    11                       1259    288512    description    TABLE     �  CREATE TABLE purchase.description (
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
       purchase         heap    postgres    false    275    11                       1259    288518    entry    TABLE     ;  CREATE TABLE purchase.entry (
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
       purchase         heap    postgres    false    11                       1259    288524    vendor    TABLE     M  CREATE TABLE purchase.vendor (
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
       purchase         heap    postgres    false    11                       1259    288529    assembly_stock    TABLE     �  CREATE TABLE slider.assembly_stock (
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
       slider         heap    postgres    false    12                       1259    288536    coloring_transaction    TABLE     R  CREATE TABLE slider.coloring_transaction (
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
       slider         heap    postgres    false    12                       1259    288542    die_casting    TABLE     T  CREATE TABLE slider.die_casting (
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
       slider         heap    postgres    false    12                       1259    288553    die_casting_production    TABLE     �  CREATE TABLE slider.die_casting_production (
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
       slider         heap    postgres    false    12                       1259    288558    die_casting_to_assembly_stock    TABLE     �  CREATE TABLE slider.die_casting_to_assembly_stock (
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
       slider         heap    postgres    false    12                       1259    288567    die_casting_transaction    TABLE     V  CREATE TABLE slider.die_casting_transaction (
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
       slider         heap    postgres    false    12                       1259    288573 
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
       slider         heap    postgres    false    12                       1259    288580    transaction    TABLE     �  CREATE TABLE slider.transaction (
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
       slider         heap    postgres    false    12                       1259    288586    trx_against_stock    TABLE     7  CREATE TABLE slider.trx_against_stock (
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
       slider         heap    postgres    false    12                        1259    288592    thread_batch_sequence    SEQUENCE     ~   CREATE SEQUENCE thread.thread_batch_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE thread.thread_batch_sequence;
       thread          postgres    false    13            !           1259    288593    batch    TABLE     �  CREATE TABLE thread.batch (
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
       thread         heap    postgres    false    288    13            "           1259    288601    batch_entry    TABLE     Z  CREATE TABLE thread.batch_entry (
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
       thread         heap    postgres    false    13            #           1259    288611    batch_entry_production    TABLE     M  CREATE TABLE thread.batch_entry_production (
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
       thread         heap    postgres    false    13            $           1259    288616    batch_entry_trx    TABLE     /  CREATE TABLE thread.batch_entry_trx (
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
       thread         heap    postgres    false    13            %           1259    288622    thread_challan_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE thread.thread_challan_sequence;
       thread          postgres    false    13            &           1259    288623    challan    TABLE     �  CREATE TABLE thread.challan (
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
       thread         heap    postgres    false    293    13            '           1259    288631    challan_entry    TABLE     �  CREATE TABLE thread.challan_entry (
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
       thread         heap    postgres    false    13            (           1259    288638    count_length    TABLE     �  CREATE TABLE thread.count_length (
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
       thread         heap    postgres    false    13            )           1259    288644    dyes_category    TABLE     B  CREATE TABLE thread.dyes_category (
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
       thread         heap    postgres    false    13            *           1259    288651    order_entry    TABLE        CREATE TABLE thread.order_entry (
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
       thread         heap    postgres    false    13            +           1259    288667    thread_order_info_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE thread.thread_order_info_sequence;
       thread          postgres    false    13            ,           1259    288668 
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
       thread         heap    postgres    false    299    13            -           1259    288677    programs    TABLE     %  CREATE TABLE thread.programs (
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
       thread         heap    postgres    false    13            .           1259    288683    batch    TABLE     w  CREATE TABLE zipper.batch (
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
       zipper         heap    postgres    false    1039    14    1039            /           1259    288691    batch_entry    TABLE     n  CREATE TABLE zipper.batch_entry (
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
       zipper         heap    postgres    false    14            0           1259    288699    batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE zipper.batch_id_seq;
       zipper          postgres    false    14    302            �           0    0    batch_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE zipper.batch_id_seq OWNED BY zipper.batch.id;
          zipper          postgres    false    304            1           1259    288700    batch_production    TABLE     J  CREATE TABLE zipper.batch_production (
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
       zipper         heap    postgres    false    14            2           1259    288705    dyed_tape_transaction    TABLE     )  CREATE TABLE zipper.dyed_tape_transaction (
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
       zipper         heap    postgres    false    14            3           1259    288710     dyed_tape_transaction_from_stock    TABLE     F  CREATE TABLE zipper.dyed_tape_transaction_from_stock (
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
       zipper         heap    postgres    false    14            4           1259    288716    dying_batch    TABLE     �   CREATE TABLE zipper.dying_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    mc_no integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.dying_batch;
       zipper         heap    postgres    false    14            5           1259    288721    dying_batch_entry    TABLE     v  CREATE TABLE zipper.dying_batch_entry (
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
       zipper         heap    postgres    false    14            6           1259    288726    dying_batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.dying_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE zipper.dying_batch_id_seq;
       zipper          postgres    false    14    308            �           0    0    dying_batch_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE zipper.dying_batch_id_seq OWNED BY zipper.dying_batch.id;
          zipper          postgres    false    310            7           1259    288727 &   material_trx_against_order_description    TABLE     [  CREATE TABLE zipper.material_trx_against_order_description (
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
       zipper         heap    postgres    false    14            8           1259    288732    planning    TABLE     �   CREATE TABLE zipper.planning (
    week text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.planning;
       zipper         heap    postgres    false    14            9           1259    288737    planning_entry    TABLE     �  CREATE TABLE zipper.planning_entry (
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
       zipper         heap    postgres    false    14            :           1259    288746    sfg_production    TABLE     �  CREATE TABLE zipper.sfg_production (
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
       zipper         heap    postgres    false    14            ;           1259    288754    sfg_transaction    TABLE     �  CREATE TABLE zipper.sfg_transaction (
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
       zipper         heap    postgres    false    14            <           1259    288761    tape_coil_production    TABLE     _  CREATE TABLE zipper.tape_coil_production (
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
       zipper         heap    postgres    false    14            =           1259    288767    tape_coil_required    TABLE     t  CREATE TABLE zipper.tape_coil_required (
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
       zipper         heap    postgres    false    14            >           1259    288772    tape_coil_to_dyeing    TABLE     /  CREATE TABLE zipper.tape_coil_to_dyeing (
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
       zipper         heap    postgres    false    14            ?           1259    288777    tape_trx    TABLE       CREATE TABLE zipper.tape_trx (
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
       zipper         heap    postgres    false    14            @           1259    288782    v_order_details    VIEW     �	  CREATE VIEW zipper.v_order_details AS
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
    order_description.is_inch,
    order_description.is_meter,
    order_description.is_cm,
    order_description.order_type
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
       zipper          postgres    false    245    237    237    238    238    239    239    240    240    241    241    242    242    243    243    243    245    245    245    245    245    245    245    245    245    245    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    248    1042    14            f           2604    288787    migrations_details id    DEFAULT     �   ALTER TABLE ONLY drizzle.migrations_details ALTER COLUMN id SET DEFAULT nextval('drizzle.migrations_details_id_seq'::regclass);
 E   ALTER TABLE drizzle.migrations_details ALTER COLUMN id DROP DEFAULT;
       drizzle          postgres    false    254    253            g           2604    288788    info id    DEFAULT     d   ALTER TABLE ONLY lab_dip.info ALTER COLUMN id SET DEFAULT nextval('lab_dip.info_id_seq'::regclass);
 7   ALTER TABLE lab_dip.info ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    259    258            i           2604    288789 	   recipe id    DEFAULT     h   ALTER TABLE ONLY lab_dip.recipe ALTER COLUMN id SET DEFAULT nextval('lab_dip.recipe_id_seq'::regclass);
 9   ALTER TABLE lab_dip.recipe ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    262    260            �           2604    288790    batch id    DEFAULT     d   ALTER TABLE ONLY zipper.batch ALTER COLUMN id SET DEFAULT nextval('zipper.batch_id_seq'::regclass);
 7   ALTER TABLE zipper.batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    304    302            �           2604    288791    dying_batch id    DEFAULT     p   ALTER TABLE ONLY zipper.dying_batch ALTER COLUMN id SET DEFAULT nextval('zipper.dying_batch_id_seq'::regclass);
 =   ALTER TABLE zipper.dying_batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    310    308            ?          0    288173    bank 
   TABLE DATA           �   COPY commercial.bank (uuid, name, swift_code, address, policy, created_at, updated_at, remarks, created_by, routing_no) FROM stdin;
 
   commercial          postgres    false    225   �I      A          0    288179    lc 
   TABLE DATA           �  COPY commercial.lc (uuid, party_uuid, lc_number, lc_date, payment_date, ldbc_fdbc, acceptance_date, maturity_date, commercial_executive, party_bank, production_complete, lc_cancel, handover_date, shipment_date, expiry_date, ud_no, ud_received, at_sight, amd_date, amd_count, problematical, epz, created_by, created_at, updated_at, remarks, id, document_receive_date, is_rtgs, lc_value, is_old_pi, pi_number) FROM stdin;
 
   commercial          postgres    false    227   L      C          0    288194    pi_cash 
   TABLE DATA             COPY commercial.pi_cash (uuid, id, lc_uuid, order_info_uuids, marketing_uuid, party_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, is_pi, conversion_rate, receive_amount, created_by, created_at, updated_at, remarks, weight, thread_order_info_uuids) FROM stdin;
 
   commercial          postgres    false    229    L      D          0    288206    pi_cash_entry 
   TABLE DATA           �   COPY commercial.pi_cash_entry (uuid, pi_cash_uuid, sfg_uuid, pi_cash_quantity, created_at, updated_at, remarks, thread_order_entry_uuid) FROM stdin;
 
   commercial          postgres    false    230   3O      F          0    288212    challan 
   TABLE DATA           �   COPY delivery.challan (uuid, carton_quantity, assign_to, receive_status, created_by, created_at, updated_at, remarks, id, gate_pass, order_info_uuid) FROM stdin;
    delivery          postgres    false    232   �\      G          0    288220    challan_entry 
   TABLE DATA           q   COPY delivery.challan_entry (uuid, challan_uuid, packing_list_uuid, created_at, updated_at, remarks) FROM stdin;
    delivery          postgres    false    233   ]      I          0    288226    packing_list 
   TABLE DATA           �   COPY delivery.packing_list (uuid, carton_size, carton_weight, created_by, created_at, updated_at, remarks, order_info_uuid, id, challan_uuid) FROM stdin;
    delivery          postgres    false    235   5]      J          0    288232    packing_list_entry 
   TABLE DATA           �   COPY delivery.packing_list_entry (uuid, packing_list_uuid, sfg_uuid, quantity, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    delivery          postgres    false    236   R]      Y          0    288374    migrations_details 
   TABLE DATA           C   COPY drizzle.migrations_details (id, hash, created_at) FROM stdin;
    drizzle          postgres    false    253   o]      [          0    288380 
   department 
   TABLE DATA           S   COPY hr.department (uuid, department, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    255   �v      \          0    288385    designation 
   TABLE DATA           U   COPY hr.designation (uuid, designation, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    256   Yy      ]          0    288390    policy_and_notice 
   TABLE DATA              COPY hr.policy_and_notice (uuid, type, title, sub_title, url, created_at, updated_at, status, remarks, created_by) FROM stdin;
    hr          postgres    false    257   �|      K          0    288239    users 
   TABLE DATA           �   COPY hr.users (uuid, name, email, pass, designation_uuid, can_access, ext, phone, created_at, updated_at, status, remarks, department_uuid) FROM stdin;
    hr          postgres    false    237   �|      ^          0    288395    info 
   TABLE DATA           �   COPY lab_dip.info (uuid, id, name, order_info_uuid, created_by, created_at, updated_at, remarks, lab_status, thread_order_info_uuid) FROM stdin;
    lab_dip          postgres    false    258   
�      `          0    288402    recipe 
   TABLE DATA           �   COPY lab_dip.recipe (uuid, id, lab_dip_info_uuid, name, approved, created_by, status, created_at, updated_at, remarks, sub_streat, bleaching) FROM stdin;
    lab_dip          postgres    false    260   A�      a          0    288409    recipe_entry 
   TABLE DATA           {   COPY lab_dip.recipe_entry (uuid, recipe_uuid, color, quantity, created_at, updated_at, remarks, material_uuid) FROM stdin;
    lab_dip          postgres    false    261   ,�      d          0    288416    shade_recipe 
   TABLE DATA           �   COPY lab_dip.shade_recipe (uuid, id, name, sub_streat, lab_status, created_by, created_at, updated_at, remarks, bleaching) FROM stdin;
    lab_dip          postgres    false    264   e�      e          0    288423    shade_recipe_entry 
   TABLE DATA           �   COPY lab_dip.shade_recipe_entry (uuid, shade_recipe_uuid, material_uuid, quantity, created_at, updated_at, remarks) FROM stdin;
    lab_dip          postgres    false    265   ��      f          0    288428    info 
   TABLE DATA           �   COPY material.info (uuid, section_uuid, type_uuid, name, short_name, unit, threshold, description, created_at, updated_at, remarks, created_by, average_lead_time) FROM stdin;
    material          postgres    false    266   ��      g          0    288435    section 
   TABLE DATA           h   COPY material.section (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    267   s�      h          0    288440    stock 
   TABLE DATA           �  COPY material.stock (uuid, material_uuid, stock, tape_making, coil_forming, dying_and_iron, m_gapping, v_gapping, v_teeth_molding, m_teeth_molding, teeth_assembling_and_polishing, m_teeth_cleaning, v_teeth_cleaning, plating_and_iron, m_sealing, v_sealing, n_t_cutting, v_t_cutting, m_stopper, v_stopper, n_stopper, cutting, die_casting, slider_assembly, coloring, remarks, lab_dip, m_qc_and_packing, v_qc_and_packing, n_qc_and_packing, s_qc_and_packing) FROM stdin;
    material          postgres    false    268   h�      i          0    288473    stock_to_sfg 
   TABLE DATA           �   COPY material.stock_to_sfg (uuid, material_uuid, order_entry_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    269   �      j          0    288478    trx 
   TABLE DATA           w   COPY material.trx (uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    270   1�      k          0    288483    type 
   TABLE DATA           e   COPY material.type (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    271   N�      l          0    288488    used 
   TABLE DATA           �   COPY material.used (uuid, material_uuid, section, used_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    272   �      L          0    288245    buyer 
   TABLE DATA           d   COPY public.buyer (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    238   �      M          0    288250    factory 
   TABLE DATA           v   COPY public.factory (uuid, party_uuid, name, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    239   ��      m          0    288494    machine 
   TABLE DATA           �   COPY public.machine (uuid, name, is_vislon, is_metal, is_nylon, is_sewing_thread, is_bulk, is_sample, min_capacity, max_capacity, water_capacity, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    273   Y3      N          0    288255 	   marketing 
   TABLE DATA           s   COPY public.marketing (uuid, name, short_name, user_uuid, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    240   
4      O          0    288260    merchandiser 
   TABLE DATA           �   COPY public.merchandiser (uuid, party_uuid, name, email, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    241   u8      P          0    288265    party 
   TABLE DATA           m   COPY public.party (uuid, name, short_name, remarks, created_at, updated_at, created_by, address) FROM stdin;
    public          postgres    false    242   ԉ      Q          0    288270 
   properties 
   TABLE DATA           y   COPY public.properties (uuid, item_for, type, name, short_name, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    243   ��      n          0    288506    section 
   TABLE DATA           B   COPY public.section (uuid, name, short_name, remarks) FROM stdin;
    public          postgres    false    274   �      p          0    288512    description 
   TABLE DATA           �   COPY purchase.description (uuid, vendor_uuid, is_local, lc_number, created_by, created_at, updated_at, remarks, id, challan_number) FROM stdin;
    purchase          postgres    false    276   2�      q          0    288518    entry 
   TABLE DATA           �   COPY purchase.entry (uuid, purchase_description_uuid, material_uuid, quantity, price, created_at, updated_at, remarks) FROM stdin;
    purchase          postgres    false    277   O�      r          0    288524    vendor 
   TABLE DATA           �   COPY purchase.vendor (uuid, name, contact_name, email, office_address, contact_number, remarks, created_at, updated_at, created_by) FROM stdin;
    purchase          postgres    false    278   l�      s          0    288529    assembly_stock 
   TABLE DATA           �   COPY slider.assembly_stock (uuid, name, die_casting_body_uuid, die_casting_puller_uuid, die_casting_cap_uuid, die_casting_link_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    279   ��      t          0    288536    coloring_transaction 
   TABLE DATA           �   COPY slider.coloring_transaction (uuid, stock_uuid, order_info_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    280   g�      u          0    288542    die_casting 
   TABLE DATA           �   COPY slider.die_casting (uuid, name, item, zipper_number, end_type, puller_type, logo_type, slider_body_shape, slider_link, quantity, weight, pcs_per_kg, created_at, updated_at, remarks, quantity_in_sa, is_logo_body, is_logo_puller, type) FROM stdin;
    slider          postgres    false    281   ��      v          0    288553    die_casting_production 
   TABLE DATA           �   COPY slider.die_casting_production (uuid, die_casting_uuid, mc_no, cavity_goods, cavity_defect, push, weight, order_description_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    slider          postgres    false    282   ��      w          0    288558    die_casting_to_assembly_stock 
   TABLE DATA           �   COPY slider.die_casting_to_assembly_stock (uuid, assembly_stock_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    283   ��      x          0    288567    die_casting_transaction 
   TABLE DATA           �   COPY slider.die_casting_transaction (uuid, die_casting_uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    284   ��      y          0    288573 
   production 
   TABLE DATA           �   COPY slider.production (uuid, stock_uuid, production_quantity, wastage, section, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    285   �      R          0    288275    stock 
   TABLE DATA           Q  COPY slider.stock (uuid, order_quantity, body_quantity, cap_quantity, puller_quantity, link_quantity, sa_prod, coloring_stock, coloring_prod, trx_to_finishing, u_top_quantity, h_bottom_quantity, box_pin_quantity, two_way_pin_quantity, created_at, updated_at, remarks, quantity_in_sa, order_description_uuid, finishing_stock) FROM stdin;
    slider          postgres    false    244   ��      z          0    288580    transaction 
   TABLE DATA           �   COPY slider.transaction (uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, from_section, to_section, assembly_stock_uuid, weight) FROM stdin;
    slider          postgres    false    286   ��      {          0    288586    trx_against_stock 
   TABLE DATA           �   COPY slider.trx_against_stock (uuid, die_casting_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    287   u�      }          0    288593    batch 
   TABLE DATA             COPY thread.batch (uuid, id, dyeing_operator, reason, category, status, pass_by, shift, dyeing_supervisor, coning_operator, coning_supervisor, coning_machines, created_by, created_at, updated_at, remarks, yarn_quantity, machine_uuid, lab_created_by, lab_created_at, lab_updated_at, yarn_issue_created_by, yarn_issue_created_at, yarn_issue_updated_at, is_drying_complete, drying_created_at, drying_updated_at, dyeing_created_by, dyeing_created_at, dyeing_updated_at, coning_created_by, coning_created_at, coning_updated_at, slot) FROM stdin;
    thread          postgres    false    289   [�      ~          0    288601    batch_entry 
   TABLE DATA           �   COPY thread.batch_entry (uuid, batch_uuid, order_entry_uuid, quantity, coning_production_quantity, coning_carton_quantity, created_at, updated_at, remarks, coning_created_at, coning_updated_at, transfer_quantity, transfer_carton_quantity) FROM stdin;
    thread          postgres    false    290   ��                0    288611    batch_entry_production 
   TABLE DATA           �   COPY thread.batch_entry_production (uuid, batch_entry_uuid, production_quantity, coning_carton_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    291   f�      �          0    288616    batch_entry_trx 
   TABLE DATA           �   COPY thread.batch_entry_trx (uuid, batch_entry_uuid, quantity, created_by, created_at, updated_at, remarks, carton_quantity) FROM stdin;
    thread          postgres    false    292   ��      �          0    288623    challan 
   TABLE DATA           �   COPY thread.challan (uuid, order_info_uuid, carton_quantity, created_by, created_at, updated_at, remarks, assign_to, gate_pass, received, id) FROM stdin;
    thread          postgres    false    294   A�      �          0    288631    challan_entry 
   TABLE DATA           �   COPY thread.challan_entry (uuid, challan_uuid, order_entry_uuid, quantity, created_by, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    thread          postgres    false    295   ^�      �          0    288638    count_length 
   TABLE DATA           �   COPY thread.count_length (uuid, count, sst, created_by, created_at, updated_at, remarks, min_weight, max_weight, length, price, cone_per_carton) FROM stdin;
    thread          postgres    false    296   {�      �          0    288644    dyes_category 
   TABLE DATA           �   COPY thread.dyes_category (uuid, name, upto_percentage, bleaching, id, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    297   m�      �          0    288651    order_entry 
   TABLE DATA           �  COPY thread.order_entry (uuid, order_info_uuid, lab_reference, color, po, style, count_length_uuid, quantity, company_price, party_price, swatch_approval_date, production_quantity, created_by, created_at, updated_at, remarks, bleaching, transfer_quantity, recipe_uuid, pi, delivered, warehouse, short_quantity, reject_quantity, production_quantity_in_kg, carton_quantity) FROM stdin;
    thread          postgres    false    298   ��      �          0    288668 
   order_info 
   TABLE DATA           �   COPY thread.order_info (uuid, id, party_uuid, marketing_uuid, factory_uuid, merchandiser_uuid, buyer_uuid, is_sample, is_bill, delivery_date, created_by, created_at, updated_at, remarks, is_cash) FROM stdin;
    thread          postgres    false    300   -�      �          0    288677    programs 
   TABLE DATA           �   COPY thread.programs (uuid, dyes_category_uuid, material_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    301   ��      �          0    288683    batch 
   TABLE DATA           �   COPY zipper.batch (uuid, id, created_by, created_at, updated_at, remarks, batch_status, machine_uuid, slot, received) FROM stdin;
    zipper          postgres    false    302   X�      �          0    288691    batch_entry 
   TABLE DATA           �   COPY zipper.batch_entry (uuid, batch_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks, sfg_uuid) FROM stdin;
    zipper          postgres    false    303   u�      �          0    288700    batch_production 
   TABLE DATA           �   COPY zipper.batch_production (uuid, batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    305   ��      �          0    288705    dyed_tape_transaction 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction (uuid, order_description_uuid, colors, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    306   ��      �          0    288710     dyed_tape_transaction_from_stock 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction_from_stock (uuid, order_description_uuid, trx_quantity, tape_coil_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    307   ��      �          0    288716    dying_batch 
   TABLE DATA           c   COPY zipper.dying_batch (uuid, id, mc_no, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    308   ��      �          0    288721    dying_batch_entry 
   TABLE DATA           �   COPY zipper.dying_batch_entry (uuid, dying_batch_uuid, batch_entry_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    309   �      �          0    288727 &   material_trx_against_order_description 
   TABLE DATA           �   COPY zipper.material_trx_against_order_description (uuid, order_description_uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    311   #�      S          0    288295    order_description 
   TABLE DATA           p  COPY zipper.order_description (uuid, order_info_uuid, item, zipper_number, end_type, lock_type, puller_type, teeth_color, puller_color, special_requirement, hand, coloring_type, is_slider_provided, slider, slider_starting_section_enum, top_stopper, bottom_stopper, logo_type, is_logo_body, is_logo_puller, description, status, created_at, updated_at, remarks, slider_body_shape, slider_link, end_user, garment, light_preference, garments_wash, created_by, garments_remarks, tape_received, tape_transferred, slider_finishing_stock, nylon_stopper, tape_coil_uuid, teeth_type, is_inch, order_type, is_meter, is_cm) FROM stdin;
    zipper          postgres    false    245   @�      T          0    288311    order_entry 
   TABLE DATA           �   COPY zipper.order_entry (uuid, order_description_uuid, style, color, size, quantity, company_price, party_price, status, swatch_status_enum, swatch_approval_date, created_at, updated_at, remarks, bleaching, is_inch) FROM stdin;
    zipper          postgres    false    246   �      V          0    288322 
   order_info 
   TABLE DATA           %  COPY zipper.order_info (uuid, id, reference_order_info_uuid, buyer_uuid, party_uuid, marketing_uuid, merchandiser_uuid, factory_uuid, is_sample, is_bill, is_cash, marketing_priority, factory_priority, status, created_by, created_at, updated_at, remarks, conversion_rate, print_in) FROM stdin;
    zipper          postgres    false    248   �      �          0    288732    planning 
   TABLE DATA           U   COPY zipper.planning (week, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    312         �          0    288737    planning_entry 
   TABLE DATA           �   COPY zipper.planning_entry (uuid, sfg_uuid, sno_quantity, factory_quantity, production_quantity, batch_production_quantity, created_at, updated_at, planning_week, sno_remarks, factory_remarks) FROM stdin;
    zipper          postgres    false    313         W          0    288334    sfg 
   TABLE DATA             COPY zipper.sfg (uuid, order_entry_uuid, recipe_uuid, dying_and_iron_prod, teeth_molding_stock, teeth_molding_prod, teeth_coloring_stock, teeth_coloring_prod, finishing_stock, finishing_prod, coloring_prod, warehouse, delivered, pi, remarks, short_quantity, reject_quantity) FROM stdin;
    zipper          postgres    false    249   ;      �          0    288746    sfg_production 
   TABLE DATA           �   COPY zipper.sfg_production (uuid, sfg_uuid, section, production_quantity_in_kg, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    314   09      �          0    288754    sfg_transaction 
   TABLE DATA           �   COPY zipper.sfg_transaction (uuid, trx_from, trx_to, trx_quantity, slider_item_uuid, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_kg) FROM stdin;
    zipper          postgres    false    315   M9      X          0    288352 	   tape_coil 
   TABLE DATA             COPY zipper.tape_coil (uuid, quantity, trx_quantity_in_coil, quantity_in_coil, remarks, item_uuid, zipper_number_uuid, name, raw_per_kg_meter, dyed_per_kg_meter, created_by, created_at, updated_at, is_import, is_reverse, trx_quantity_in_dying, stock_quantity) FROM stdin;
    zipper          postgres    false    250   j9      �          0    288761    tape_coil_production 
   TABLE DATA           �   COPY zipper.tape_coil_production (uuid, section, tape_coil_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    316   �<      �          0    288767    tape_coil_required 
   TABLE DATA           �   COPY zipper.tape_coil_required (uuid, end_type_uuid, item_uuid, nylon_stopper_uuid, zipper_number_uuid, top, bottom, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    317   V=      �          0    288772    tape_coil_to_dyeing 
   TABLE DATA           �   COPY zipper.tape_coil_to_dyeing (uuid, tape_coil_uuid, order_description_uuid, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    318   �@      �          0    288777    tape_trx 
   TABLE DATA              COPY zipper.tape_trx (uuid, tape_coil_uuid, trx_quantity, created_by, created_at, updated_at, remarks, to_section) FROM stdin;
    zipper          postgres    false    319   KA      �           0    0    lc_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.lc_sequence', 1, true);
       
   commercial          postgres    false    226            �           0    0    pi_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.pi_sequence', 8, true);
       
   commercial          postgres    false    228            �           0    0    challan_sequence    SEQUENCE SET     @   SELECT pg_catalog.setval('delivery.challan_sequence', 1, true);
          delivery          postgres    false    231            �           0    0    packing_list_sequence    SEQUENCE SET     E   SELECT pg_catalog.setval('delivery.packing_list_sequence', 1, true);
          delivery          postgres    false    234            �           0    0    migrations_details_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('drizzle.migrations_details_id_seq', 142, true);
          drizzle          postgres    false    254            �           0    0    info_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('lab_dip.info_id_seq', 24, true);
          lab_dip          postgres    false    259            �           0    0    recipe_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('lab_dip.recipe_id_seq', 39, true);
          lab_dip          postgres    false    262            �           0    0    shade_recipe_sequence    SEQUENCE SET     D   SELECT pg_catalog.setval('lab_dip.shade_recipe_sequence', 1, true);
          lab_dip          postgres    false    263            �           0    0    purchase_description_sequence    SEQUENCE SET     M   SELECT pg_catalog.setval('purchase.purchase_description_sequence', 1, true);
          purchase          postgres    false    275            �           0    0    thread_batch_sequence    SEQUENCE SET     C   SELECT pg_catalog.setval('thread.thread_batch_sequence', 2, true);
          thread          postgres    false    288            �           0    0    thread_challan_sequence    SEQUENCE SET     F   SELECT pg_catalog.setval('thread.thread_challan_sequence', 1, false);
          thread          postgres    false    293            �           0    0    thread_order_info_sequence    SEQUENCE SET     H   SELECT pg_catalog.setval('thread.thread_order_info_sequence', 5, true);
          thread          postgres    false    299            �           0    0    batch_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('zipper.batch_id_seq', 1, true);
          zipper          postgres    false    304            �           0    0    dying_batch_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('zipper.dying_batch_id_seq', 1, false);
          zipper          postgres    false    310            �           0    0    order_info_sequence    SEQUENCE SET     B   SELECT pg_catalog.setval('zipper.order_info_sequence', 21, true);
          zipper          postgres    false    247            �           2606    288793    bank bank_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_pkey;
    
   commercial            postgres    false    225            �           2606    288795 
   lc lc_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_pkey;
    
   commercial            postgres    false    227            �           2606    288797     pi_cash_entry pi_cash_entry_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pkey;
    
   commercial            postgres    false    230            �           2606    288799    pi_cash pi_cash_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_pkey;
    
   commercial            postgres    false    229            �           2606    288801     challan_entry challan_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_pkey;
       delivery            postgres    false    233            �           2606    288803    challan challan_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_pkey;
       delivery            postgres    false    232            �           2606    288805 *   packing_list_entry packing_list_entry_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_pkey;
       delivery            postgres    false    236            �           2606    288807    packing_list packing_list_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_pkey;
       delivery            postgres    false    235                       2606    288809 *   migrations_details migrations_details_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY drizzle.migrations_details
    ADD CONSTRAINT migrations_details_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY drizzle.migrations_details DROP CONSTRAINT migrations_details_pkey;
       drizzle            postgres    false    253                       2606    288811 '   department department_department_unique 
   CONSTRAINT     d   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_department_unique UNIQUE (department);
 M   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_department_unique;
       hr            postgres    false    255                       2606    288813    department department_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_pkey;
       hr            postgres    false    255                       2606    288815    department department_unique 
   CONSTRAINT     Y   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_unique UNIQUE (department);
 B   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_unique;
       hr            postgres    false    255                       2606    288817 *   designation designation_designation_unique 
   CONSTRAINT     h   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_designation_unique UNIQUE (designation);
 P   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_designation_unique;
       hr            postgres    false    256                       2606    288819    designation designation_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_pkey;
       hr            postgres    false    256                       2606    288821    designation designation_unique 
   CONSTRAINT     \   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_unique UNIQUE (designation);
 D   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_unique;
       hr            postgres    false    256            !           2606    288823 (   policy_and_notice policy_and_notice_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_pkey;
       hr            postgres    false    257            �           2606    288825    users users_email_unique 
   CONSTRAINT     P   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_email_unique;
       hr            postgres    false    237            �           2606    288827    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_pkey;
       hr            postgres    false    237            #           2606    288829    info info_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 9   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_pkey;
       lab_dip            postgres    false    258            '           2606    288831    recipe_entry recipe_entry_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_pkey;
       lab_dip            postgres    false    261            %           2606    288833    recipe recipe_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (uuid);
 =   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_pkey;
       lab_dip            postgres    false    260            +           2606    288835 *   shade_recipe_entry shade_recipe_entry_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_pkey PRIMARY KEY (uuid);
 U   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_pkey;
       lab_dip            postgres    false    265            )           2606    288837    shade_recipe shade_recipe_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_pkey;
       lab_dip            postgres    false    264            -           2606    288839    info info_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.info DROP CONSTRAINT info_pkey;
       material            postgres    false    266            /           2606    288841    section section_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY material.section DROP CONSTRAINT section_pkey;
       material            postgres    false    267            1           2606    288843    stock stock_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_pkey;
       material            postgres    false    268            3           2606    288845    stock_to_sfg stock_to_sfg_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_pkey;
       material            postgres    false    269            5           2606    288847    trx trx_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_pkey;
       material            postgres    false    270            7           2606    288849    type type_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.type DROP CONSTRAINT type_pkey;
       material            postgres    false    271            9           2606    288851    used used_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.used DROP CONSTRAINT used_pkey;
       material            postgres    false    272            �           2606    288853    buyer buyer_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_name_unique;
       public            postgres    false    238            �           2606    288855    buyer buyer_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_pkey;
       public            postgres    false    238            �           2606    288857    factory factory_name_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_name_unique UNIQUE (name);
 E   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_name_unique;
       public            postgres    false    239            �           2606    288859    factory factory_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_pkey;
       public            postgres    false    239            ;           2606    288861    machine machine_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_pkey;
       public            postgres    false    273            �           2606    288863    marketing marketing_name_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_name_unique UNIQUE (name);
 I   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_name_unique;
       public            postgres    false    240            �           2606    288865    marketing marketing_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_pkey;
       public            postgres    false    240            �           2606    288867 %   merchandiser merchandiser_name_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_name_unique UNIQUE (name);
 O   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_name_unique;
       public            postgres    false    241            �           2606    288870    merchandiser merchandiser_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_pkey;
       public            postgres    false    241                       2606    288873    party party_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.party DROP CONSTRAINT party_name_unique;
       public            postgres    false    242                       2606    288875    party party_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    242                       2606    288877    properties properties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY public.properties DROP CONSTRAINT properties_pkey;
       public            postgres    false    243            =           2606    288879    section section_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.section DROP CONSTRAINT section_pkey;
       public            postgres    false    274            ?           2606    288881    description description_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_pkey;
       purchase            postgres    false    276            A           2606    288884    entry entry_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_pkey;
       purchase            postgres    false    277            C           2606    288886    vendor vendor_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_pkey;
       purchase            postgres    false    278            E           2606    288888 "   assembly_stock assembly_stock_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_pkey;
       slider            postgres    false    279            G           2606    288891 .   coloring_transaction coloring_transaction_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_pkey;
       slider            postgres    false    280            I           2606    288893    die_casting die_casting_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_pkey;
       slider            postgres    false    281            K           2606    288895 2   die_casting_production die_casting_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_pkey;
       slider            postgres    false    282            M           2606    288900 @   die_casting_to_assembly_stock die_casting_to_assembly_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_pkey PRIMARY KEY (uuid);
 j   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_pkey;
       slider            postgres    false    283            O           2606    288902 4   die_casting_transaction die_casting_transaction_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_pkey PRIMARY KEY (uuid);
 ^   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_pkey;
       slider            postgres    false    284            Q           2606    288904    production production_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_pkey;
       slider            postgres    false    285                       2606    288906    stock stock_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_pkey;
       slider            postgres    false    244            S           2606    288909    transaction transaction_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_pkey;
       slider            postgres    false    286            U           2606    288912 (   trx_against_stock trx_against_stock_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_pkey;
       slider            postgres    false    287            Y           2606    288914    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_pkey;
       thread            postgres    false    290            [           2606    288917 2   batch_entry_production batch_entry_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_pkey;
       thread            postgres    false    291            ]           2606    288919 $   batch_entry_trx batch_entry_trx_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_pkey;
       thread            postgres    false    292            W           2606    288924    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pkey;
       thread            postgres    false    289            a           2606    288926     challan_entry challan_entry_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_pkey;
       thread            postgres    false    295            _           2606    288928    challan challan_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_pkey;
       thread            postgres    false    294            c           2606    288930 !   count_length count_length_uuid_pk 
   CONSTRAINT     a   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_uuid_pk PRIMARY KEY (uuid);
 K   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_uuid_pk;
       thread            postgres    false    296            e           2606    288932     dyes_category dyes_category_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_pkey;
       thread            postgres    false    297            g           2606    288934    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_pkey;
       thread            postgres    false    298            i           2606    288936    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_pkey;
       thread            postgres    false    300            k           2606    288938    programs programs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_pkey;
       thread            postgres    false    301            o           2606    288940    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_pkey;
       zipper            postgres    false    303            m           2606    288943    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_pkey;
       zipper            postgres    false    302            q           2606    288945 &   batch_production batch_production_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_pkey PRIMARY KEY (uuid);
 P   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_pkey;
       zipper            postgres    false    305            u           2606    288947 F   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_pkey PRIMARY KEY (uuid);
 p   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_pkey;
       zipper            postgres    false    307            s           2606    288949 0   dyed_tape_transaction dyed_tape_transaction_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_pkey;
       zipper            postgres    false    306            y           2606    288951 (   dying_batch_entry dying_batch_entry_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_pkey;
       zipper            postgres    false    309            w           2606    288953    dying_batch dying_batch_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.dying_batch
    ADD CONSTRAINT dying_batch_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.dying_batch DROP CONSTRAINT dying_batch_pkey;
       zipper            postgres    false    308            {           2606    288955 R   material_trx_against_order_description material_trx_against_order_description_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_pkey PRIMARY KEY (uuid);
 |   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_pkey;
       zipper            postgres    false    311            	           2606    288957 (   order_description order_description_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_pkey;
       zipper            postgres    false    245                       2606    288959    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_pkey;
       zipper            postgres    false    246                       2606    288961    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_pkey;
       zipper            postgres    false    248                       2606    288963 "   planning_entry planning_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_pkey;
       zipper            postgres    false    313            }           2606    288965    planning planning_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_pkey PRIMARY KEY (week);
 @   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_pkey;
       zipper            postgres    false    312                       2606    288967    sfg sfg_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_pkey;
       zipper            postgres    false    249            �           2606    288969 "   sfg_production sfg_production_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_pkey;
       zipper            postgres    false    314            �           2606    288971 $   sfg_transaction sfg_transaction_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_pkey;
       zipper            postgres    false    315                       2606    288973    tape_coil tape_coil_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_pkey;
       zipper            postgres    false    250            �           2606    288975 .   tape_coil_production tape_coil_production_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_pkey;
       zipper            postgres    false    316            �           2606    288977 *   tape_coil_required tape_coil_required_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_pkey PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_pkey;
       zipper            postgres    false    317            �           2606    288979 ,   tape_coil_to_dyeing tape_coil_to_dyeing_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_pkey;
       zipper            postgres    false    318            �           2606    288981    tape_trx tape_to_coil_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_pkey;
       zipper            postgres    false    319            V           2620    288982 :   pi_cash_entry sfg_after_commercial_pi_entry_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_delete_trigger AFTER DELETE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_delete_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    344    230            W           2620    288983 :   pi_cash_entry sfg_after_commercial_pi_entry_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_insert_trigger AFTER INSERT ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_insert_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    417    230            X           2620    288984 :   pi_cash_entry sfg_after_commercial_pi_entry_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_update_trigger AFTER UPDATE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_update_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    230    371            \           2620    288985 5   challan_entry packing_list_after_challan_entry_delete    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_delete AFTER DELETE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_delete_function();
 P   DROP TRIGGER packing_list_after_challan_entry_delete ON delivery.challan_entry;
       delivery          postgres    false    409    233            ]           2620    288986 5   challan_entry packing_list_after_challan_entry_insert    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_insert AFTER INSERT ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_insert_function();
 P   DROP TRIGGER packing_list_after_challan_entry_insert ON delivery.challan_entry;
       delivery          postgres    false    369    233            ^           2620    288987 5   challan_entry packing_list_after_challan_entry_update    TRIGGER     �   CREATE TRIGGER packing_list_after_challan_entry_update AFTER UPDATE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_update_function();
 P   DROP TRIGGER packing_list_after_challan_entry_update ON delivery.challan_entry;
       delivery          postgres    false    423    233            Y           2620    288988 /   challan sfg_after_challan_receive_status_delete    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_delete AFTER DELETE ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
 J   DROP TRIGGER sfg_after_challan_receive_status_delete ON delivery.challan;
       delivery          postgres    false    396    232            _           2620    288989 :   packing_list_entry sfg_after_challan_receive_status_delete    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_delete ON delivery.packing_list_entry;
       delivery          postgres    false    396    236            Z           2620    288990 /   challan sfg_after_challan_receive_status_insert    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_insert AFTER INSERT ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
 J   DROP TRIGGER sfg_after_challan_receive_status_insert ON delivery.challan;
       delivery          postgres    false    401    232            `           2620    288991 :   packing_list_entry sfg_after_challan_receive_status_insert    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_insert ON delivery.packing_list_entry;
       delivery          postgres    false    236    401            [           2620    288992 /   challan sfg_after_challan_receive_status_update    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_update AFTER UPDATE ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();
 J   DROP TRIGGER sfg_after_challan_receive_status_update ON delivery.challan;
       delivery          postgres    false    425    232            a           2620    288993 :   packing_list_entry sfg_after_challan_receive_status_update    TRIGGER     �   CREATE TRIGGER sfg_after_challan_receive_status_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();
 U   DROP TRIGGER sfg_after_challan_receive_status_update ON delivery.packing_list_entry;
       delivery          postgres    false    425    236            b           2620    288994 6   packing_list_entry sfg_after_packing_list_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_delete_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_delete ON delivery.packing_list_entry;
       delivery          postgres    false    236    329            c           2620    288995 6   packing_list_entry sfg_after_packing_list_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_insert_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_insert ON delivery.packing_list_entry;
       delivery          postgres    false    370    236            d           2620    288996 6   packing_list_entry sfg_after_packing_list_entry_update    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_update_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_update ON delivery.packing_list_entry;
       delivery          postgres    false    373    236            g           2620    288997 .   info material_stock_after_material_info_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_delete AFTER DELETE ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_delete();
 I   DROP TRIGGER material_stock_after_material_info_delete ON material.info;
       material          postgres    false    339    266            h           2620    288998 .   info material_stock_after_material_info_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_insert AFTER INSERT ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_insert();
 I   DROP TRIGGER material_stock_after_material_info_insert ON material.info;
       material          postgres    false    332    266            l           2620    288999 ,   trx material_stock_after_material_trx_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_delete AFTER DELETE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_delete();
 G   DROP TRIGGER material_stock_after_material_trx_delete ON material.trx;
       material          postgres    false    363    270            m           2620    289000 ,   trx material_stock_after_material_trx_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_insert AFTER INSERT ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_insert();
 G   DROP TRIGGER material_stock_after_material_trx_insert ON material.trx;
       material          postgres    false    421    270            n           2620    289001 ,   trx material_stock_after_material_trx_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_update AFTER UPDATE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_update();
 G   DROP TRIGGER material_stock_after_material_trx_update ON material.trx;
       material          postgres    false    384    270            o           2620    289002 .   used material_stock_after_material_used_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_delete AFTER DELETE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_delete();
 I   DROP TRIGGER material_stock_after_material_used_delete ON material.used;
       material          postgres    false    402    272            p           2620    289003 .   used material_stock_after_material_used_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_insert AFTER INSERT ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_insert();
 I   DROP TRIGGER material_stock_after_material_used_insert ON material.used;
       material          postgres    false    334    272            q           2620    289004 .   used material_stock_after_material_used_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_update AFTER UPDATE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_update();
 I   DROP TRIGGER material_stock_after_material_used_update ON material.used;
       material          postgres    false    272    395            i           2620    289005 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_delete    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete AFTER DELETE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_delete ON material.stock_to_sfg;
       material          postgres    false    269    351            j           2620    289006 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_insert    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert AFTER INSERT ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_insert ON material.stock_to_sfg;
       material          postgres    false    366    269            k           2620    289007 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_update    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update AFTER UPDATE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_update ON material.stock_to_sfg;
       material          postgres    false    269    367            r           2620    289008 0   entry material_stock_after_purchase_entry_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_delete AFTER DELETE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();
 K   DROP TRIGGER material_stock_after_purchase_entry_delete ON purchase.entry;
       purchase          postgres    false    277    420            s           2620    289009 0   entry material_stock_after_purchase_entry_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_insert AFTER INSERT ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();
 K   DROP TRIGGER material_stock_after_purchase_entry_insert ON purchase.entry;
       purchase          postgres    false    277    424            t           2620    289010 0   entry material_stock_after_purchase_entry_update    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_update AFTER UPDATE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();
 K   DROP TRIGGER material_stock_after_purchase_entry_update ON purchase.entry;
       purchase          postgres    false    397    277            {           2620    289011 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_delete    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete AFTER DELETE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    375    283            |           2620    289012 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_insert    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert AFTER INSERT ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    419    283            }           2620    289013 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_update    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update AFTER UPDATE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    283    379            x           2620    289014 M   die_casting_production slider_die_casting_after_die_casting_production_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_delete AFTER DELETE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_delete ON slider.die_casting_production;
       slider          postgres    false    282    408            y           2620    289015 M   die_casting_production slider_die_casting_after_die_casting_production_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_insert AFTER INSERT ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_insert ON slider.die_casting_production;
       slider          postgres    false    282    413            z           2620    289016 M   die_casting_production slider_die_casting_after_die_casting_production_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_update AFTER UPDATE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_update ON slider.die_casting_production;
       slider          postgres    false    380    282            �           2620    289017 C   trx_against_stock slider_die_casting_after_trx_against_stock_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete AFTER DELETE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_delete ON slider.trx_against_stock;
       slider          postgres    false    287    389            �           2620    289018 C   trx_against_stock slider_die_casting_after_trx_against_stock_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert AFTER INSERT ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_insert ON slider.trx_against_stock;
       slider          postgres    false    287    410            �           2620    289019 C   trx_against_stock slider_die_casting_after_trx_against_stock_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_update AFTER UPDATE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_update ON slider.trx_against_stock;
       slider          postgres    false    331    287            u           2620    289020 C   coloring_transaction slider_stock_after_coloring_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_delete AFTER DELETE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_delete ON slider.coloring_transaction;
       slider          postgres    false    386    280            v           2620    289021 C   coloring_transaction slider_stock_after_coloring_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_insert AFTER INSERT ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_insert ON slider.coloring_transaction;
       slider          postgres    false    412    280            w           2620    289022 C   coloring_transaction slider_stock_after_coloring_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_update AFTER UPDATE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_update ON slider.coloring_transaction;
       slider          postgres    false    280    403            ~           2620    289023 I   die_casting_transaction slider_stock_after_die_casting_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_delete AFTER DELETE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_delete ON slider.die_casting_transaction;
       slider          postgres    false    418    284                       2620    289024 I   die_casting_transaction slider_stock_after_die_casting_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_insert AFTER INSERT ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_insert ON slider.die_casting_transaction;
       slider          postgres    false    284    416            �           2620    289025 I   die_casting_transaction slider_stock_after_die_casting_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_update AFTER UPDATE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_update ON slider.die_casting_transaction;
       slider          postgres    false    284    346            �           2620    289026 6   production slider_stock_after_slider_production_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_delete AFTER DELETE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();
 O   DROP TRIGGER slider_stock_after_slider_production_delete ON slider.production;
       slider          postgres    false    285    352            �           2620    289027 6   production slider_stock_after_slider_production_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_insert AFTER INSERT ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();
 O   DROP TRIGGER slider_stock_after_slider_production_insert ON slider.production;
       slider          postgres    false    347    285            �           2620    289028 6   production slider_stock_after_slider_production_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_update AFTER UPDATE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();
 O   DROP TRIGGER slider_stock_after_slider_production_update ON slider.production;
       slider          postgres    false    285    406            �           2620    289029 1   transaction slider_stock_after_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_delete AFTER DELETE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();
 J   DROP TRIGGER slider_stock_after_transaction_delete ON slider.transaction;
       slider          postgres    false    286    359            �           2620    289030 1   transaction slider_stock_after_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_insert AFTER INSERT ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();
 J   DROP TRIGGER slider_stock_after_transaction_insert ON slider.transaction;
       slider          postgres    false    286    358            �           2620    289031 1   transaction slider_stock_after_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_update AFTER UPDATE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_update();
 J   DROP TRIGGER slider_stock_after_transaction_update ON slider.transaction;
       slider          postgres    false    286    388            �           2620    290086 7   batch order_entry_after_batch_is_dyeing_update_function    TRIGGER     �   CREATE TRIGGER order_entry_after_batch_is_dyeing_update_function AFTER UPDATE OF is_drying_complete ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();
 P   DROP TRIGGER order_entry_after_batch_is_dyeing_update_function ON thread.batch;
       thread          postgres    false    289    422    289            �           2620    289034 M   batch_entry_production thread_batch_entry_after_batch_entry_production_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_delete AFTER DELETE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_delete ON thread.batch_entry_production;
       thread          postgres    false    411    291            �           2620    289035 M   batch_entry_production thread_batch_entry_after_batch_entry_production_insert    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_insert AFTER INSERT ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_insert ON thread.batch_entry_production;
       thread          postgres    false    407    291            �           2620    289036 M   batch_entry_production thread_batch_entry_after_batch_entry_production_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_update AFTER UPDATE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_update ON thread.batch_entry_production;
       thread          postgres    false    335    291            �           2620    289037 H   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx AFTER INSERT ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
 a   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx ON thread.batch_entry_trx;
       thread          postgres    false    391    292            �           2620    289038 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete AFTER DELETE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete ON thread.batch_entry_trx;
       thread          postgres    false    376    292            �           2620    289039 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update AFTER UPDATE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update ON thread.batch_entry_trx;
       thread          postgres    false    292    377            �           2620    289040 1   challan thread_order_entry_after_challan_received    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_challan_received AFTER UPDATE OF received ON thread.challan FOR EACH ROW EXECUTE FUNCTION public.thread_order_entry_after_challan_received();
 J   DROP TRIGGER thread_order_entry_after_challan_received ON thread.challan;
       thread          postgres    false    294    393    294            �           2620    289041 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger AFTER DELETE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_delete_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    355    306            �           2620    289042 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger AFTER INSERT ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_insert_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    333    306            �           2620    289043 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_update_trigger AFTER UPDATE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_update_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    404    306            e           2620    289044 (   order_entry sfg_after_order_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_delete AFTER DELETE ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();
 A   DROP TRIGGER sfg_after_order_entry_delete ON zipper.order_entry;
       zipper          postgres    false    246    381            f           2620    289045 (   order_entry sfg_after_order_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_insert AFTER INSERT ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();
 A   DROP TRIGGER sfg_after_order_entry_insert ON zipper.order_entry;
       zipper          postgres    false    325    246            �           2620    289046 6   sfg_production sfg_after_sfg_production_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_delete_trigger AFTER DELETE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_delete_function();
 O   DROP TRIGGER sfg_after_sfg_production_delete_trigger ON zipper.sfg_production;
       zipper          postgres    false    328    314            �           2620    289047 6   sfg_production sfg_after_sfg_production_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_insert_trigger AFTER INSERT ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_insert_function();
 O   DROP TRIGGER sfg_after_sfg_production_insert_trigger ON zipper.sfg_production;
       zipper          postgres    false    314    405            �           2620    289048 6   sfg_production sfg_after_sfg_production_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_production_update_trigger AFTER UPDATE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_update_function();
 O   DROP TRIGGER sfg_after_sfg_production_update_trigger ON zipper.sfg_production;
       zipper          postgres    false    326    314            �           2620    289049 8   sfg_transaction sfg_after_sfg_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_delete_trigger AFTER DELETE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_delete_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_delete_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    390    315            �           2620    289050 8   sfg_transaction sfg_after_sfg_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_insert_trigger AFTER INSERT ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_insert_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_insert_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    362    315            �           2620    289051 8   sfg_transaction sfg_after_sfg_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_sfg_transaction_update_trigger AFTER UPDATE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_update_function();
 Q   DROP TRIGGER sfg_after_sfg_transaction_update_trigger ON zipper.sfg_transaction;
       zipper          postgres    false    399    315            �           2620    289052 `   material_trx_against_order_description stock_after_material_trx_against_order_description_delete    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_delete AFTER DELETE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_delete ON zipper.material_trx_against_order_description;
       zipper          postgres    false    311    353            �           2620    289053 `   material_trx_against_order_description stock_after_material_trx_against_order_description_insert    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_insert AFTER INSERT ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_insert ON zipper.material_trx_against_order_description;
       zipper          postgres    false    311    394            �           2620    289054 `   material_trx_against_order_description stock_after_material_trx_against_order_description_update    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_update AFTER UPDATE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_update ON zipper.material_trx_against_order_description;
       zipper          postgres    false    311    392            �           2620    289055 9   tape_coil_production tape_coil_after_tape_coil_production    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production AFTER INSERT ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();
 R   DROP TRIGGER tape_coil_after_tape_coil_production ON zipper.tape_coil_production;
       zipper          postgres    false    316    337            �           2620    289056 @   tape_coil_production tape_coil_after_tape_coil_production_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_delete AFTER DELETE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_delete ON zipper.tape_coil_production;
       zipper          postgres    false    383    316            �           2620    289057 @   tape_coil_production tape_coil_after_tape_coil_production_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_update AFTER UPDATE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_update ON zipper.tape_coil_production;
       zipper          postgres    false    415    316            �           2620    289058 .   tape_trx tape_coil_after_tape_trx_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_delete AFTER DELETE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_delete ON zipper.tape_trx;
       zipper          postgres    false    319    368            �           2620    289059 .   tape_trx tape_coil_after_tape_trx_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_insert AFTER INSERT ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_insert ON zipper.tape_trx;
       zipper          postgres    false    319    340            �           2620    289060 .   tape_trx tape_coil_after_tape_trx_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_update AFTER UPDATE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_update ON zipper.tape_trx;
       zipper          postgres    false    319    342            �           2620    289061 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_del    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del AFTER DELETE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    360    307            �           2620    289062 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_ins    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins AFTER INSERT ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    354    307            �           2620    289063 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_upd    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    398    307            �           2620    289064 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_delete AFTER DELETE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();
 M   DROP TRIGGER tape_coil_to_dyeing_after_delete ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    343    318            �           2620    289065 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_insert AFTER INSERT ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
 M   DROP TRIGGER tape_coil_to_dyeing_after_insert ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    327    318            �           2620    289066 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_update AFTER UPDATE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();
 M   DROP TRIGGER tape_coil_to_dyeing_after_update ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    349    318            �           2620    289073 A   batch_production zipper_batch_entry_after_batch_production_delete    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_delete AFTER DELETE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_delete();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_delete ON zipper.batch_production;
       zipper          postgres    false    356    305            �           2620    289074 A   batch_production zipper_batch_entry_after_batch_production_insert    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_insert AFTER INSERT ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_insert();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_insert ON zipper.batch_production;
       zipper          postgres    false    350    305            �           2620    289075 A   batch_production zipper_batch_entry_after_batch_production_update    TRIGGER     �   CREATE TRIGGER zipper_batch_entry_after_batch_production_update AFTER UPDATE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_update();
 Z   DROP TRIGGER zipper_batch_entry_after_batch_production_update ON zipper.batch_production;
       zipper          postgres    false    365    305            �           2606    289076 "   bank bank_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 P   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_created_by_users_uuid_fk;
    
   commercial          postgres    false    237    5359    225            �           2606    289081    lc lc_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_created_by_users_uuid_fk;
    
   commercial          postgres    false    5359    227    237            �           2606    289086    lc lc_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    227    242    5379            �           2606    289091 &   pi_cash pi_cash_bank_uuid_bank_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);
 T   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk;
    
   commercial          postgres    false    5341    229    225            �           2606    289096 (   pi_cash pi_cash_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_created_by_users_uuid_fk;
    
   commercial          postgres    false    229    5359    237            �           2606    289101 8   pi_cash_entry pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);
 f   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk;
    
   commercial          postgres    false    229    5345    230            �           2606    289106 0   pi_cash_entry pi_cash_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk;
    
   commercial          postgres    false    249    5391    230            �           2606    289111 G   pi_cash_entry pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (thread_order_entry_uuid) REFERENCES thread.order_entry(uuid);
 u   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk;
    
   commercial          postgres    false    230    5479    298            �           2606    289116 ,   pi_cash pi_cash_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 Z   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk;
    
   commercial          postgres    false    5367    229    239            �           2606    289121 "   pi_cash pi_cash_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 P   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    229    227    5343            �           2606    289126 0   pi_cash pi_cash_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk;
    
   commercial          postgres    false    229    240    5371            �           2606    289131 6   pi_cash pi_cash_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 d   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk;
    
   commercial          postgres    false    229    5375    241            �           2606    289136 (   pi_cash pi_cash_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    242    229    5379            �           2606    289141 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       delivery          postgres    false    5359    232    237            �           2606    289146 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       delivery          postgres    false    5359    232    237            �           2606    289151 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 d   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    5349    232    233            �           2606    289156 B   challan_entry challan_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 n   ALTER TABLE ONLY delivery.challan_entry DROP CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    233    235    5353            �           2606    289161 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 ^   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    232    5389    248            �           2606    289166 6   packing_list packing_list_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 b   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    5349    232    235            �           2606    289171 2   packing_list packing_list_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_created_by_users_uuid_fk;
       delivery          postgres    false    5359    237    235            �           2606    289176 L   packing_list_entry packing_list_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 x   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    5353    235    236            �           2606    289181 :   packing_list_entry packing_list_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 f   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk;
       delivery          postgres    false    236    5391    249            �           2606    289186 <   packing_list packing_list_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 h   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    235    5389    248            �           2606    289191    users hr_user_department    FK CONSTRAINT     ~   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT hr_user_department FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT hr_user_department;
       hr          postgres    false    237    255    5399            �           2606    289196 <   policy_and_notice policy_and_notice_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_created_by_users_uuid_fk;
       hr          postgres    false    237    5359    257            �           2606    289201 .   users users_department_uuid_department_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_department_uuid_department_uuid_fk FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 T   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_department_uuid_department_uuid_fk;
       hr          postgres    false    255    237    5399            �           2606    289206 0   users users_designation_uuid_designation_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_designation_uuid_designation_uuid_fk FOREIGN KEY (designation_uuid) REFERENCES hr.designation(uuid);
 V   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_designation_uuid_designation_uuid_fk;
       hr          postgres    false    237    256    5405            �           2606    289211 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 M   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       lab_dip          postgres    false    258    237    5359            �           2606    289216 ,   info info_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 W   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    248    258    5389            �           2606    289221 3   info info_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 ^   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    258    5481    300            �           2606    289226 &   recipe recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    260    237    5359            �           2606    289231 4   recipe_entry recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    266    261    5421            �           2606    289236 4   recipe_entry recipe_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk;
       lab_dip          postgres    false    260    261    5413            �           2606    289241 ,   recipe recipe_lab_dip_info_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk FOREIGN KEY (lab_dip_info_uuid) REFERENCES lab_dip.info(uuid);
 W   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk;
       lab_dip          postgres    false    5411    258    260            �           2606    289246 2   shade_recipe shade_recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ]   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    264    5359    237            �           2606    289251 @   shade_recipe_entry shade_recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 k   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    265    5421    266            �           2606    289256 L   shade_recipe_entry shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk FOREIGN KEY (shade_recipe_uuid) REFERENCES lab_dip.shade_recipe(uuid);
 w   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk;
       lab_dip          postgres    false    264    5417    265            �           2606    289261 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       material          postgres    false    266    5359    237            �           2606    289266 &   info info_section_uuid_section_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_section_uuid_section_uuid_fk FOREIGN KEY (section_uuid) REFERENCES material.section(uuid);
 R   ALTER TABLE ONLY material.info DROP CONSTRAINT info_section_uuid_section_uuid_fk;
       material          postgres    false    267    5423    266            �           2606    289271     info info_type_uuid_type_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_type_uuid_type_uuid_fk FOREIGN KEY (type_uuid) REFERENCES material.type(uuid);
 L   ALTER TABLE ONLY material.info DROP CONSTRAINT info_type_uuid_type_uuid_fk;
       material          postgres    false    266    271    5431            �           2606    289276 (   section section_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY material.section DROP CONSTRAINT section_created_by_users_uuid_fk;
       material          postgres    false    267    237    5359            �           2606    289281 &   stock stock_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_material_uuid_info_uuid_fk;
       material          postgres    false    268    5421    266            �           2606    289286 2   stock_to_sfg stock_to_sfg_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_created_by_users_uuid_fk;
       material          postgres    false    237    269    5359            �           2606    289291 4   stock_to_sfg stock_to_sfg_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 `   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk;
       material          postgres    false    266    5421    269            �           2606    289296 >   stock_to_sfg stock_to_sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 j   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk;
       material          postgres    false    246    5387    269            �           2606    289301     trx trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_created_by_users_uuid_fk;
       material          postgres    false    270    5359    237            �           2606    289306 "   trx trx_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 N   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_material_uuid_info_uuid_fk;
       material          postgres    false    266    5421    270            �           2606    289311 "   type type_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.type DROP CONSTRAINT type_created_by_users_uuid_fk;
       material          postgres    false    271    237    5359            �           2606    289316 "   used used_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.used DROP CONSTRAINT used_created_by_users_uuid_fk;
       material          postgres    false    237    5359    272            �           2606    289321 $   used used_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 P   ALTER TABLE ONLY material.used DROP CONSTRAINT used_material_uuid_info_uuid_fk;
       material          postgres    false    5421    266    272            �           2606    289326 $   buyer buyer_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_created_by_users_uuid_fk;
       public          postgres    false    237    5359    238            �           2606    289331 (   factory factory_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_created_by_users_uuid_fk;
       public          postgres    false    5359    237    239            �           2606    289336 (   factory factory_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_party_uuid_party_uuid_fk;
       public          postgres    false    5379    239    242            �           2606    289341 (   machine machine_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_created_by_users_uuid_fk;
       public          postgres    false    273    5359    237            �           2606    289346 ,   marketing marketing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_created_by_users_uuid_fk;
       public          postgres    false    5359    237    240            �           2606    289351 +   marketing marketing_user_uuid_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_user_uuid_users_uuid_fk FOREIGN KEY (user_uuid) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_user_uuid_users_uuid_fk;
       public          postgres    false    240    237    5359            �           2606    289356 2   merchandiser merchandiser_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_created_by_users_uuid_fk;
       public          postgres    false    237    241    5359            �           2606    289361 2   merchandiser merchandiser_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_party_uuid_party_uuid_fk;
       public          postgres    false    242    5379    241            �           2606    289366 $   party party_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.party DROP CONSTRAINT party_created_by_users_uuid_fk;
       public          postgres    false    242    5359    237            �           2606    289371 0   description description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_created_by_users_uuid_fk;
       purchase          postgres    false    5359    276    237            �           2606    289376 2   description description_vendor_uuid_vendor_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_vendor_uuid_vendor_uuid_fk FOREIGN KEY (vendor_uuid) REFERENCES purchase.vendor(uuid);
 ^   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_vendor_uuid_vendor_uuid_fk;
       purchase          postgres    false    5443    276    278            �           2606    289381 &   entry entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_material_uuid_info_uuid_fk;
       purchase          postgres    false    266    5421    277            �           2606    289386 9   entry entry_purchase_description_uuid_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_purchase_description_uuid_description_uuid_fk FOREIGN KEY (purchase_description_uuid) REFERENCES purchase.description(uuid);
 e   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_purchase_description_uuid_description_uuid_fk;
       purchase          postgres    false    5439    277    276            �           2606    289391 &   vendor vendor_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_created_by_users_uuid_fk;
       purchase          postgres    false    237    278    5359            �           2606    289396 6   assembly_stock assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    279    237    5359            �           2606    289401 G   assembly_stock assembly_stock_die_casting_body_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_body_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_body_uuid) REFERENCES slider.die_casting(uuid);
 q   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_body_uuid_die_casting_uuid_fk;
       slider          postgres    false    281    279    5449            �           2606    289406 F   assembly_stock assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_cap_uuid) REFERENCES slider.die_casting(uuid);
 p   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk;
       slider          postgres    false    279    5449    281            �           2606    289411 G   assembly_stock assembly_stock_die_casting_link_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_link_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_link_uuid) REFERENCES slider.die_casting(uuid);
 q   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_link_uuid_die_casting_uuid_fk;
       slider          postgres    false    279    5449    281            �           2606    289416 I   assembly_stock assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_puller_uuid) REFERENCES slider.die_casting(uuid);
 s   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk;
       slider          postgres    false    279    281    5449            �           2606    289421 B   coloring_transaction coloring_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_created_by_users_uuid_fk;
       slider          postgres    false    237    280    5359            �           2606    289426 L   coloring_transaction coloring_transaction_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 v   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk;
       slider          postgres    false    280    5389    248            �           2606    289431 B   coloring_transaction coloring_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    244    280    5383            �           2606    289436 3   die_casting die_casting_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 ]   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_end_type_properties_uuid_fk;
       slider          postgres    false    5381    281    243            �           2606    289441 /   die_casting die_casting_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 Y   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_item_properties_uuid_fk;
       slider          postgres    false    5381    281    243            �           2606    289446 4   die_casting die_casting_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 ^   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_logo_type_properties_uuid_fk;
       slider          postgres    false    5381    281    243            �           2606    289451 F   die_casting_production die_casting_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_created_by_users_uuid_fk;
       slider          postgres    false    5359    237    282            �           2606    289456 R   die_casting_production die_casting_production_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 |   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    282    281    5449            �           2606    289461 V   die_casting_production die_casting_production_order_description_uuid_order_description    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_order_description_uuid_order_description FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_order_description_uuid_order_description;
       slider          postgres    false    5385    245    282            �           2606    289466 6   die_casting die_casting_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_type_properties_uuid_fk;
       slider          postgres    false    281    243    5381            �           2606    289471 <   die_casting die_casting_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 f   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk;
       slider          postgres    false    5381    281    243            �           2606    289476 6   die_casting die_casting_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_link_properties_uuid_fk;
       slider          postgres    false    5381    243    281                        2606    289481 ]   die_casting_to_assembly_stock die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc;
       slider          postgres    false    283    279    5445                       2606    289486 T   die_casting_to_assembly_stock die_casting_to_assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    5359    283    237                       2606    289491 H   die_casting_transaction die_casting_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_created_by_users_uuid_fk;
       slider          postgres    false    237    284    5359                       2606    289496 T   die_casting_transaction die_casting_transaction_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    5449    281    284                       2606    289501 H   die_casting_transaction die_casting_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    284    244    5383            �           2606    289506 8   die_casting die_casting_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 b   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_zipper_number_properties_uuid_fk;
       slider          postgres    false    281    5381    243                       2606    289511 .   production production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_created_by_users_uuid_fk;
       slider          postgres    false    285    5359    237                       2606    289516 .   production production_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_stock_uuid_stock_uuid_fk;
       slider          postgres    false    285    5383    244            �           2606    289521 <   stock stock_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 f   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_order_description_uuid_order_description_uuid_fk;
       slider          postgres    false    244    5385    245                       2606    289526 B   transaction transaction_assembly_stock_uuid_assembly_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 l   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk;
       slider          postgres    false    286    5445    279                       2606    289531 0   transaction transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_created_by_users_uuid_fk;
       slider          postgres    false    286    5359    237            	           2606    289536 0   transaction transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    286    5383    244            
           2606    289541 <   trx_against_stock trx_against_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_created_by_users_uuid_fk;
       slider          postgres    false    287    5359    237                       2606    289546 H   trx_against_stock trx_against_stock_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 r   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    287    5449    281                       2606    289551 +   batch batch_coning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_coning_created_by_users_uuid_fk FOREIGN KEY (coning_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_coning_created_by_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289556 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289561 +   batch batch_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_created_by_users_uuid_fk FOREIGN KEY (dyeing_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_created_by_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289566 )   batch batch_dyeing_operator_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_operator_users_uuid_fk FOREIGN KEY (dyeing_operator) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_operator_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289571 +   batch batch_dyeing_supervisor_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_supervisor_users_uuid_fk FOREIGN KEY (dyeing_supervisor) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_supervisor_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289576 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES thread.batch(uuid);
 Z   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       thread          postgres    false    290    5463    289                       2606    289581 <   batch_entry batch_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 f   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    290    5479    298                       2606    289586 R   batch_entry_production batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 |   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    291    5465    290                       2606    289591 F   batch_entry_production batch_entry_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_created_by_users_uuid_fk;
       thread          postgres    false    5359    291    237                       2606    289596 D   batch_entry_trx batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 n   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    292    5465    290                       2606    289601 8   batch_entry_trx batch_entry_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_created_by_users_uuid_fk;
       thread          postgres    false    292    5359    237                       2606    289606 (   batch batch_lab_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_lab_created_by_users_uuid_fk FOREIGN KEY (lab_created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_lab_created_by_users_uuid_fk;
       thread          postgres    false    237    289    5359                       2606    289611 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       thread          postgres    false    5435    289    273                       2606    289616 !   batch batch_pass_by_users_uuid_fk    FK CONSTRAINT     ~   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pass_by_users_uuid_fk FOREIGN KEY (pass_by) REFERENCES hr.users(uuid);
 K   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pass_by_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289621 /   batch batch_yarn_issue_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk FOREIGN KEY (yarn_issue_created_by) REFERENCES hr.users(uuid);
 Y   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk;
       thread          postgres    false    289    5359    237                       2606    289626 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       thread          postgres    false    294    5359    237                       2606    289631 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       thread          postgres    false    5359    237    294                       2606    289636 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES thread.challan(uuid);
 b   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       thread          postgres    false    295    294    5471                       2606    289641 4   challan_entry challan_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_created_by_users_uuid_fk;
       thread          postgres    false    5359    237    295                        2606    289646 @   challan_entry challan_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 j   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    298    295    5479                       2606    289651 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 \   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    294    300    5481            !           2606    289656 2   count_length count_length_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_created_by_users_uuid_fk;
       thread          postgres    false    237    5359    296            "           2606    289661 4   dyes_category dyes_category_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_created_by_users_uuid_fk;
       thread          postgres    false    5359    237    297            #           2606    289666 >   order_entry order_entry_count_length_uuid_count_length_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk FOREIGN KEY (count_length_uuid) REFERENCES thread.count_length(uuid);
 h   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk;
       thread          postgres    false    5475    296    298            $           2606    289671 0   order_entry order_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_created_by_users_uuid_fk;
       thread          postgres    false    5359    298    237            %           2606    289676 :   order_entry order_entry_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 d   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    298    5481    300            &           2606    289681 2   order_entry order_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 \   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk;
       thread          postgres    false    298    5413    260            '           2606    289686 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       thread          postgres    false    238    5363    300            (           2606    289691 .   order_info order_info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_created_by_users_uuid_fk;
       thread          postgres    false    237    5359    300            )           2606    289696 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       thread          postgres    false    239    5367    300            *           2606    289701 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       thread          postgres    false    5371    300    240            +           2606    289706 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       thread          postgres    false    5375    241    300            ,           2606    289711 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       thread          postgres    false    5379    242    300            -           2606    289716 *   programs programs_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_created_by_users_uuid_fk;
       thread          postgres    false    301    237    5359            .           2606    289721 :   programs programs_dyes_category_uuid_dyes_category_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk FOREIGN KEY (dyes_category_uuid) REFERENCES thread.dyes_category(uuid);
 d   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk;
       thread          postgres    false    5477    301    297            /           2606    289726 ,   programs programs_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 V   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_material_uuid_info_uuid_fk;
       thread          postgres    false    5421    266    301            0           2606    289731 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       zipper          postgres    false    5359    237    302            2           2606    289736 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES zipper.batch(uuid);
 Z   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       zipper          postgres    false    303    302    5485            3           2606    289741 ,   batch_entry batch_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 V   ALTER TABLE ONLY zipper.batch_entry DROP CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    303    249    5391            1           2606    289746 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY zipper.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       zipper          postgres    false    5435    273    302            4           2606    289751 F   batch_production batch_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 p   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    5487    305    303            5           2606    289756 :   batch_production batch_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 d   ALTER TABLE ONLY zipper.batch_production DROP CONSTRAINT batch_production_created_by_users_uuid_fk;
       zipper          postgres    false    237    305    5359            6           2606    289761 D   dyed_tape_transaction dyed_tape_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 n   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    5359    306    237            8           2606    289766 Z   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk;
       zipper          postgres    false    5359    307    237            9           2606    289771 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_order_description_uuid_order_d    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d;
       zipper          postgres    false    5385    307    245            :           2606    289776 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_ FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_;
       zipper          postgres    false    250    307    5393            7           2606    289781 U   dyed_tape_transaction dyed_tape_transaction_order_description_uuid_order_description_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
    ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_;
       zipper          postgres    false    5385    245    306            ;           2606    289786 H   dying_batch_entry dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk;
       zipper          postgres    false    5487    303    309            <           2606    289791 H   dying_batch_entry dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk FOREIGN KEY (dying_batch_uuid) REFERENCES zipper.dying_batch(uuid);
 r   ALTER TABLE ONLY zipper.dying_batch_entry DROP CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk;
       zipper          postgres    false    5495    308    309            =           2606    289796 f   material_trx_against_order_description material_trx_against_order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk;
       zipper          postgres    false    311    237    5359            >           2606    289801 f   material_trx_against_order_description material_trx_against_order_description_material_uuid_info_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_ FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_;
       zipper          postgres    false    5421    311    266            ?           2606    289806 f   material_trx_against_order_description material_trx_against_order_description_order_description_uuid_o    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_order_description_uuid_o FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_order_description_uuid_o;
       zipper          postgres    false    245    5385    311            �           2606    289811 E   order_description order_description_bottom_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_bottom_stopper_properties_uuid_fk FOREIGN KEY (bottom_stopper) REFERENCES public.properties(uuid);
 o   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_bottom_stopper_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289816 D   order_description order_description_coloring_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_coloring_type_properties_uuid_fk FOREIGN KEY (coloring_type) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_coloring_type_properties_uuid_fk;
       zipper          postgres    false    245    243    5381            �           2606    289821 <   order_description order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_created_by_users_uuid_fk;
       zipper          postgres    false    237    5359    245            �           2606    289826 ?   order_description order_description_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_type_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289831 ?   order_description order_description_end_user_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_user_properties_uuid_fk FOREIGN KEY (end_user) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_user_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289836 ;   order_description order_description_hand_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_hand_properties_uuid_fk FOREIGN KEY (hand) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_hand_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289841 ;   order_description order_description_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_item_properties_uuid_fk;
       zipper          postgres    false    243    245    5381            �           2606    289846 G   order_description order_description_light_preference_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_light_preference_properties_uuid_fk FOREIGN KEY (light_preference) REFERENCES public.properties(uuid);
 q   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_light_preference_properties_uuid_fk;
       zipper          postgres    false    243    245    5381            �           2606    289851 @   order_description order_description_lock_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_lock_type_properties_uuid_fk FOREIGN KEY (lock_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_lock_type_properties_uuid_fk;
       zipper          postgres    false    5381    243    245            �           2606    289856 @   order_description order_description_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_logo_type_properties_uuid_fk;
       zipper          postgres    false    243    245    5381            �           2606    289861 D   order_description order_description_nylon_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_nylon_stopper_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289866 F   order_description order_description_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 p   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk;
       zipper          postgres    false    248    245    5389            �           2606    289871 C   order_description order_description_puller_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_color_properties_uuid_fk FOREIGN KEY (puller_color) REFERENCES public.properties(uuid);
 m   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_color_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289876 B   order_description order_description_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_type_properties_uuid_fk;
       zipper          postgres    false    5381    243    245            �           2606    289881 H   order_description order_description_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_body_shape_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289886 B   order_description order_description_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_link_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289891 =   order_description order_description_slider_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_properties_uuid_fk FOREIGN KEY (slider) REFERENCES public.properties(uuid);
 g   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289896 D   order_description order_description_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    245    250    5393            �           2606    289901 B   order_description order_description_teeth_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_color_properties_uuid_fk FOREIGN KEY (teeth_color) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_color_properties_uuid_fk;
       zipper          postgres    false    243    245    5381            �           2606    289906 A   order_description order_description_teeth_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_type_properties_uuid_fk FOREIGN KEY (teeth_type) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_type_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289911 B   order_description order_description_top_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_top_stopper_properties_uuid_fk FOREIGN KEY (top_stopper) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_top_stopper_properties_uuid_fk;
       zipper          postgres    false    243    5381    245            �           2606    289916 D   order_description order_description_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_zipper_number_properties_uuid_fk;
       zipper          postgres    false    245    5381    243            �           2606    289921 H   order_entry order_entry_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 r   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk;
       zipper          postgres    false    246    5385    245            �           2606    289926 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       zipper          postgres    false    248    5363    238            �           2606    289931 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       zipper          postgres    false    248    5367    239            �           2606    289936 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       zipper          postgres    false    248    5371    240            �           2606    289941 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       zipper          postgres    false    248    5375    241            �           2606    289946 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       zipper          postgres    false    248    5379    242            @           2606    289951 *   planning planning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_created_by_users_uuid_fk;
       zipper          postgres    false    312    5359    237            A           2606    289956 <   planning_entry planning_entry_planning_week_planning_week_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_planning_week_planning_week_fk FOREIGN KEY (planning_week) REFERENCES zipper.planning(week);
 f   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_planning_week_planning_week_fk;
       zipper          postgres    false    313    5501    312            B           2606    289961 2   planning_entry planning_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    313    5391    249            �           2606    289966 ,   sfg sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 V   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk;
       zipper          postgres    false    249    5387    246            C           2606    289971 6   sfg_production sfg_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_created_by_users_uuid_fk;
       zipper          postgres    false    314    237    5359            D           2606    289976 2   sfg_production sfg_production_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.sfg_production DROP CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    314    5391    249            �           2606    289981 "   sfg sfg_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 L   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk;
       zipper          postgres    false    5413    260    249            E           2606    289986 8   sfg_transaction sfg_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    315    5359    237            F           2606    289991 4   sfg_transaction sfg_transaction_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    249    315    5391            G           2606    289996 >   sfg_transaction sfg_transaction_slider_item_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk FOREIGN KEY (slider_item_uuid) REFERENCES slider.stock(uuid);
 h   ALTER TABLE ONLY zipper.sfg_transaction DROP CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk;
       zipper          postgres    false    244    5383    315            �           2606    290001 ,   tape_coil tape_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_created_by_users_uuid_fk;
       zipper          postgres    false    5359    250    237            �           2606    290006 0   tape_coil tape_coil_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 Z   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_item_uuid_properties_uuid_fk;
       zipper          postgres    false    250    5381    243            H           2606    290011 B   tape_coil_production tape_coil_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_created_by_users_uuid_fk;
       zipper          postgres    false    316    5359    237            I           2606    290016 J   tape_coil_production tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 t   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    316    250    5393            J           2606    290021 >   tape_coil_required tape_coil_required_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 h   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_created_by_users_uuid_fk;
       zipper          postgres    false    5359    317    237            K           2606    290026 F   tape_coil_required tape_coil_required_end_type_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk FOREIGN KEY (end_type_uuid) REFERENCES public.properties(uuid);
 p   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk;
       zipper          postgres    false    5381    317    243            L           2606    290031 B   tape_coil_required tape_coil_required_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk;
       zipper          postgres    false    5381    317    243            M           2606    290036 K   tape_coil_required tape_coil_required_nylon_stopper_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk FOREIGN KEY (nylon_stopper_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk;
       zipper          postgres    false    243    5381    317            N           2606    290041 K   tape_coil_required tape_coil_required_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    5381    317    243            O           2606    290046 @   tape_coil_to_dyeing tape_coil_to_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 j   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk;
       zipper          postgres    false    237    318    5359            P           2606    290051 S   tape_coil_to_dyeing tape_coil_to_dyeing_order_description_uuid_order_description_uu    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 }   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu;
       zipper          postgres    false    245    318    5385            Q           2606    290056 H   tape_coil_to_dyeing tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 r   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    250    318    5393            �           2606    290061 9   tape_coil tape_coil_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 c   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    5381    250    243            R           2606    290066 .   tape_trx tape_to_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_created_by_users_uuid_fk;
       zipper          postgres    false    319    5359    237            S           2606    290071 6   tape_trx tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 `   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    5393    319    250            T           2606    290076 *   tape_trx tape_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_created_by_users_uuid_fk;
       zipper          postgres    false    319    237    5359            U           2606    290081 2   tape_trx tape_trx_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 \   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    5393    319    250            ?   b  x�]S�r�0=��C''��4�s�Ʃ3I�N3��LFa4�J���������.��]=��k�u;����,u&�@�q&�#L&a8�"ߙF�2���&q���]XDQ��e�p=�$Z� Z��]��]<�A2��GHV��\��Cp���+gIv�z�R�V�d]Rx�����^w�!#;�m
��B�B��f0�v�8�FMa[���-+K,jXSHOiE3`
tAAԔS��v�1%%�DD�o�'�;Y/L�à�)ȥ�쬡�T"7ܷ�3K"5#%*�����t#���������������=W�$�����Y�l��Qi;4����>����k¾ڻ�!Ҧ�2�PS�DD���"�l��	�)IFUa���@Y��-I�&jzb*�%�T4�H��=!֖9[�Js[���Y5'܇�*{��K�[�(�0�ȍO��s�6�wh�5
��l� K)PUEPd+
C$KtO����2IS���"����"kR�]X&�h���W�X*���م�ɿ+�m�ɷ�&�7��n$�;Ծd�]�a6������cn��Ͻ�y�����}��6����}w�b�(H^��m�x�����{o�^�/P�W
      A      x������ � �      C     x���[��J ���Wl��줻i��\Pdw�����E��ˌ��3;��<,��)R_W�e�m���V7Ȕ�;�ۃ��W������,|x-k�f�I
jM����!�Y��j�����#�F�^���Y���hE�4��	��{F7�j:�# @��� ����kי�ZS������
0��+�_!��`	o��>��!��ˈ���Ow�K�V�P��;/Af?�"�
:�Z\w�p����x��Agd���dy �U�r^��"�
�I;�91j��'s��ɵ��A�.����!'������	�!;Ve��s��j�\ ��> z	�Ʋ��V:swI=;X�C�0�|>�ʀ�p9
+0O�yl����=�o���7���w
��0��L��C�c�0"~���.�IQ��$��[ͩL�e+u}2;���P�E����0�$+;/������Y@�Ns�ľ�B�( Jmy����/�ƾw���?v�}AH$Pd�w �-���y�X�!ٰ�㛀�l��e��y��|����z8�pyyU�A��6E�%4��V _���k����P���Z�:�X��j�{�p��_��f�"É��#681���(ۢxUF�r��u���p7�:Y׵1]�sA��⎋���r��zeХI���5�y�jX|P[���Q
��"�0o����"	lI���W #ȨL���űi���!r���N%Eb��lB2lY̔�X�(8�֜e�k�O_F�;�a��?b����k�n���8�~ 2�~S      D   �  x���׮�J� �k�S�̈�;��d���l�&���}�Μ�K�/�+K������칤1�4<,�H��Ңe��e\�vr�\��7��n;A����0�����C�_8�a����G��#=jAx����5vU��6I
Z�F �n�~v7���� ��He�����s�͂h��2y�g���X��P_x=��Pa�K���y�Ed6ߗ9z{�/��(�rox�&����vk6�J�Hb�X� �8����0��RAp��6m=�������������y��@qe�eEM��M�*�T�`[_�ǁp�� �Js����}5J��<@u�V�MB�:�cT����_�A�2ʧ�T�ll�O�tz����C�_�@����2}d��i�2��c;]��0���r�H3f��y4� �E����9�1��v��s���|{L+���P�ٶ]ԅ�oև�IB.m�U�>Y.�����[|�f&J����V��!��K��KH��PF�]N&�~���$ƻ(!$���I���U���r(�U��z�/�.��8������8A���=Ek)�@��\�f�k���਒�"�y���XX5� ��\`��K0�֦:���1��L�U��I��g	������[��>�V�~K��t�2N|B̕��):%b��׭!x%ܳG[��H��uI_i�W��~V5R�'�ŝ�̣%�^�	_�[7���$�̓0���*�iiS��I_0����RD��"����^F~�����]0m�=��[��e�ݏ7�7n�+qu�n� V�!�{��.�m(�=J��e�=|u<K-�Ra�rv"�ty=����b{O/�}qn���/�R�U�XZ���M�?�B��2_��>����jWB;^Y��i[1B�,��OM)S1a��%~��/��>x�:ٓ.e�E>5�DK��.��-+!��������V���l-��|��=�9�WP1x&y^;��8b�;v�%L���
�C(_PGVV�Xԡ�hx=�.����l,�w�~�`�5=�ʧ�v@�|���n��1t��\���%z�%�,����k���;a:\��	Io�<[��%�ʪP�|�0�]��;���	��b��v�5���O�'C�}t�;�����!��g&>Y��Mv�l�$���;�)��\@7;/�w��6��P�4_�ϓz·�`�\������(6yJTMp3�vSHvJ�n�����b�}�"�(�u��� T��su��&>��}�+���������Ā�ϔ~k%�M��S�w�"�`d}�x�{A�`�nJslek҄>��g`2qf>˔��ʒg ���Q�ܛ__����2�K������,�L��ߍ�F_��@
�GgGk��0��&S��0�5�^c��őK�s��\d[&p�TMf�2�O�P�o��p��U"Y~;k�`ao�]|M%[LA���^���Qt)����i8�)�Б,���KB�+=pΔU�NA�E������&�8��
�;*E����A?t+��~����q�h��Rm!���fy��z_������~J@mAS��N#���P��=��>4:�0���D��"ۧ��K�,0O���ǭ��iu���֎4Ɣ!����`V�;�tHw"�����G;��!~����@g4�:kJf�!�x}0�}�]�*a�] U:�{GQ%�����r��A�Z�3��\M�E�h�p��G�Z�F+�Y�?#�\����1���'��<(/%�r�;�
��]���_���<u?��Į%j=���4�� + *�1�א���*�K��<K��XmK��� �qeu�Վ����/%����͘���� �⁸y�T�>e��5�����¥�q6 43�<�=8C�OU�V�L��4��rG�$�Ge�>�&*^�`O�De�9�i���|,)�t��ge;�[���ЭNG��oL������c1���sF/�^�_^?S��e�T��6�85윰�<�K&c����Zp���P��O����qӶ �s&"�"�kӭ���_V�PC�_8���m�:;zdĪ.{��D���x��DO�?W����VQK�|��/ ����|��'a����J}�G׏���f}%�ϲ�[S8�U�
��JL5_��[UO�
���b\�o�����o�z8��|�-��mBO��k#����2��lu�K�^�B}U3/�9���$>]�T�̔{��-S���>�b�^�-hxPiy���&d��رqQ�P�ni�>�̜�:�s��G���_�+\b�ړ���.;?:ذ�ِ�-�VA�y���>9��$�a�P�9��y|��f�o�^:\n��5d�,S�T�B���<5��
A\�UC�э�W�݌��՟�;��(��i�U��tFއ*�����޹B˚"!Z����|vn�ju��(���O��Q�`�/�}C����IL'(Qf,]�O��#��ABi�Rs�Y���?�!�*n�- �6<�f]�4����8��f��L���3��Q@KH�B���ѵ0���E�8�U]xa`|1s�
>>�o�����üĈ��������v��*J{CT$�����U�D�FP������b�C�d��a�Q4�[U�}e�����j} L��^�֨i
�| �!'Lo�-g�+*6��<�Ԩo�-XrV�f�ߋZ�:{������࿾O(�o��Ó���j���<`N��"�iU��Zy�ܳ������s�0�E���YE*�z�Ls�*�5Cye��0o]?���3]���,���OO/e0����ޏܬW�����u3;�]L^37�^���B�5/�C�Ml�2��e� f����?3~�#�钙�sl�G���`r�v0�Ue=��g��� N��>�i�g��H.��dm�Sf����'�{۽��1>�P��/��ǹ�W���b���g���t�����)��c���=/ƣ ��0�MYlX��}m�d�������t�0?v��bI#����Z&A�����Sw�X��Dc3���S-=咩�j��f�Ǉdn�)��ެR�[�i��5�t�0������h1�$�g���L������y���{���l.8F"�̻v6Qs��HE�be��{�n偾����K&�F����m���{tj)�9�w
!�ݱk��VDC�73���m �|����cÊ��s�%sǴ�7�6�ܛ��pXw�_��]2s��s�{�����J�d��|����������p�hڀ���
y���5#Gz���HL.v��p\�,�Y�t���u�v�.����a|[`LB�7`:�$r�s~�_%�_��8�����K
��
,C��>�c�	�4s�9=Ξ�y��>���.�U�_������������4�tJ�!�9I��@�Qވ�X���@�[a�����SY����Y|g>P$QB;%�B��
��������      F      x������ � �      G      x������ � �      I      x������ � �      J      x������ � �      Y      x�=�Y�$+E��ӆ ���a���QDd�uW��A���ˣ��h���3i#�u��]��{FU���:�d�Iǘ"5�{};���4o����Q�5����=�k��}n]M��T��i���ro�I�߷-���G���Z+����J9��;�Fr�g�e�;>t�<K�y����ٯv���N���S�IU���-��jc�me�H�-��<�qG֞[���>3�1t����k�S�a۟��j�]=��I��rژt�(�l�}�(&s�#��I��䑄�q��sʋ���+�ܤ���g8͟9���������-i��֤<w�T�G�7�r{�_�.�sz�=csn~�H\v�Z�q|�H�%�1��f�pX�o�=9�ue��߂�����'�)�����k�yf�99�Ugm�f���:GK.@�F����W�K�����(�Z��k,`v��sM�N���KJ�N�]�j-�]3�*+GA�Ɂ��Jz��ɶ�Mz궝�� IHϣ=�W)�pN%�������U��r��
]��8�i|e�Rҡ� C�]6�XϪ�l9]����э|j�WQ�k}%?��$�L_���mz 8���S[�^�[i[����h�����K*����)�j�i�5JZ�Y�*��Is���7�AW��Ӷج���z���[j�>�'�A�V�T{Ϣ@�#ͥ��c�/a�z�`C�ҡ7��v]�4�5ևC���p�s��7�ơie��;9��)��:6[,e,p��W�G��J{X����2eKզO��q͌^�+ϼX�pO:� ω���,m~+��X��&&1Qhc��`���Ƨ��&0�l�$?��f�/;�*�߮]:E������f�s@��~�wU(�w�eӿU�zu��S:����[c�S�_�'C>�6f0�T���=�^��r:?�AȜ��Ӛ��v�)��U����]X�������^>�
�)w%9���ڌ�ة4��N>+�4���0�7�����!�|��.>��Id�}P� 2
���|f�)ֹ��κ9�7燅,�;�.@�v���1��N��f����L�W�3����oET����Y�L���lb��P���ޗ�\�$��&
�x[����z�x�U�Ϯ�cyV:SU�ޅ�ѐ!�青�b&9 ��v��8��hwf_�H��vLaffX�X΂15/[�b��x�]��̠m�61�mt�z�T�FK���0͓�>����V�%�';c�	�[kE����Ӻ'}��u5zl�P��Y�\��9C�􅢏��>TCe���vj��o�hj�*�ҍ]�gCۆ0*��ŉO�7�s04�fj@a�۹����,7Tv�o�S�s��O��k#,�Tx��_�E�v[�8��|,���y_�� �L����`g����Nk#NL����	����y6@��:�GF�0Xw��δ
����*f�)�o)�H�9�{�D,�Z�;xLn�ԥ�8t�v�W-�>6��.酌T�(~+v!-��/�WJ�K3$��@�6�����Z�u�m�*�T��^U�b�SOM튕��@u�E��L���ˌ�I�{B�9]�X�b�wV鯖g�\�����ٱՌda;S�7��z�"O�fH0�	9�L�lP������&ZP$ߒap�y��T9���6�Y�ű0]�_>��@��*j�f��=!1�a������X@>˖5��%��tts�9�р��*d,N���`K @�����B�Sj��8�,,.��ù�Qg;��_E~=�A�1L��ɛkWǔ-�ƌ���5"��`_pc��NG�oEK4��U�J9?RzbƌC��\2���\�x���͸T��F�ϼ&>k�oI��0k�՛,ιB���Nf�ߨU0AX��j���)�y��V�8�́�E�D���r<g��u�\wT���rQ�����:�~bj�V�h�׷��G ��ҋuoq�~�	��
ɳ���U무�b�	D����b7�)��~�/�g����1N�5�W��l10�@t.�#zl� ���-����<>!�8��!��D�Z��D� �k���A��~g�����q����J���g��o��ZE�x� ��
�$#�`gj�n�I���s��"�Q���d4�H"���MH	�y^��pY�]]8�3��c�q=��U�&�Ş��c |���`2��G�`�2$(T2��/ |��T����'T�-�AX>�΍A`x$���|RK�>#�bJ7�c1}��U��G�C�q������B�Zk39Z߸d�g� ��:P&�W� Jz�V�:#%�e`;j�\Rp�� �OZXFjg��w�/�>����v������sǊ|.PYP��|�=F_w
���^~N��EB�p������'	�G�%��{0|4$%:�� OfD�,�6Y��L�D/I�N�W<�����T�gF.e���݀�O��(L�>�(��m��C�/�/�z,�^"�Wd��Zx�.��^��pl�7�F�^X��>q��Ø7�3��1��ZX��DF<VU`7}c)��U1��L��i!�rJ���S���"��*"��H{+33�!�����@ ��y!'�\Ά�����<	�贆G:�),d�Pv��\�Y>j; e�ۘ_�%݁��lz`����ȡ���p˷"�	�5W�2����z�J�C����,za��!�'"O��>)Ps�~��c�9mwv��D���e�`O���dw��)�!�N����U��h����f&*��GIdWL'L��u�u�NH�3v���F�"������]��_��<|]ɑx�zl�bä{Cn`i@]�����(����6i}N�VDP '��x|:��+�D�D�K�L9�k!;���p�t�}|���A�T�`I��b2&�%��ҽ�����J	���-�b�R!�el͘�=���r�-�2W���^��f8nr:��4�
 �����ޤ��E@5Slk�e
�@��8���I�͂���`�q��C���.'�M�q7GÉx�����6�{[XT29<��f�й^�6�i"_�~)��K,z���d9��Y�HH<CX^b]B��d]�V,�iY��͌k^U ������t�e��}+vC�S�o��ZG��sNl��Z@�HLb!���4�(�?�� ��x��_E��:S�Y�x�T���&iJMX�C^�EĦ`aJq<`�[ĉ������`��� /A�uK�Lpr#�B�i�7hK��c=l>���'3�?ʔ�*ƍ��k��^HCQ`�����s��1��J��� E�+�]� �_����K�1���R6�pX�I��0�
$u\��QӚ<r��`��۵�������$�d`F
��߂��m�jĻ���LD���)��1�~��0e%Se�����i�d
G[C��9�ⶐ�ʶ���.7����5v�4nO_�Ö́%�߅�P���w�v��]�$Z�,��
{p�Ѣ{��7�ѐ.���0����+2�8��C�S$���$|���+.+�Uę��=!K���4��|"1m�ہ�lA024�%.�Z��5|�w���v|��'.�g�D�`|�~�<��ܡ3��U��Ew;$�u�?8���-�!q2��'�!�AT�N �`� PҖ����w�a:&�6��}og���]�o�w��$����o��"[�Jp1,͌�2ס-y�EF��<ӘT� �~1B�y��р�9�dvb����i�ρ��Sq�6�覿�!°YGg@A��|�a��rG'�G�l=�Z�@	S�#�'���,����d��}�>��4�� �b��@�j��g�k��ncF�D���gs܍�_��8;�i/�������f�O�$v�����򅁃j'!��)�����{v]�j��
��\�)�l�|<T���y��00��t9�OJ��b��oom���ɟ[cf�'>T@)f��=+�k!J$�x���=����d,�T��lEO#p5��e�%ˋ�3(-�q�W���a*���?~���ؼ.�D�V<�I$�]Cș�gP0��<8Cf.{<Z�X����4G�W�XZz=?�Q��p��&���� `	  �$��x` �0��+P���.�JC^j��n��,��(w����L����K0[0�"n=1�e*��%B��͌���d.�z���5��+Rf�_BAdŸ�C�8�%������U�HpJW�c���� �m�}BQ��4�ؠ���Dz�{ʉN�
r�	wM�Vĩƥ=}l�29����;��3��3s��4��!ZVb�����3����=�Xơ3wC�
~��1�$�J6b	�p�̳qJ���pޯb<kq20.�j�oT�kg	,��#��0b�ss`��"Jɏ)"�aH���q���
��	�ɞ"�|����	y��BJds��.`�OE�����+��b�?��)	���\-�f@>�6���OY���[_��#�p48����-�Ʊ8]�1ά�ǺB��o�a�ЍKx��X��'|�e�N�A�h��糖���49�z@2�W&��?X��N���;�O��I�$���Y
%������q��ec�&��i�+�!�I��q���%I>d�d��
�Gq�>�s�\O\t�_��t\2gÙS���O�g|�+�q��@�|�,��<Jʏ�L4[<� �`�z<F��n�xW�-�'^ ��A���b҂c��)%�j�����\~����D�tar�Y*-E֠Lb��G��J�{� �gX�(���xA%��\N�\��!�|�ٍ��W}���\���$Y��(I,��3�`&��=xC��qӅ���ҧ<� �H���e~G��|E�����P�wk��&�y��1�8k@������$82�}fap#[��K\���!y8�#^H ��Hu%�sa�:���8�����W��,L%q�F���x�I,���*.��Y��:�e$�E�˿3NI�1��̏mG�6%.��
�I@��W����
U�|p"2��Q[��
k�mܑJ�����}v�*�Uo���(9����OA5F�
 �6]��8��Kq��V �s�^C��?��C
ɸw�h�������D����m�WF�!JI�1��FͰ��Өt+2��)��j�/����3�<q�W~����-N<�c���#�f�JO{���n�p'�޶�7����|uLB���Ԧ%�Ǟ���!Q�kaw�D	�٘������-�ʪ�$v�%�ҒT " ����O+z3�/^6�a�9.>|@�����*}�G �d�)��d���Bc�� ��(7��*�"�4���%�u-:�f��o|��x�|�"�D�����>q��qb��d�P�f�]r9�$A����A��;F�r�Y��n%k�?��Y 7���#������k�xz��0�%h5dig'lNC���fdJ�DZPpXb?>�xR�,�Bq����/s�k]�|E�Q�p:���[�m�\'q�FI}�0#�������A%�V��ۉPO|8v�� ���ASx��(�ڝ� 2&	��k�X)�	���������P�\�Q�/Z�^���=J�'���(l�sǧ	�'�
�G��z<���,���|[��i�R���zƶ]�ə��Aǅ'����G5��CLxée�n!g`gd���E"%�>JړN<4�aI�I_�3�b�'�^p�a}2a5.����ZQ<�����S�F�o)�O�7���;�B�$${Bj����x(������`��[2�S�%�)q��s؈�	���<L��3@)���]��ǳ��03_\�r�:^E#�?Ǚ�ͨ}L+C�����znPΫ��`Ÿ�	G���o��	���m�M�+8�e���lc{�uvI���.����ᐒ����R��u��O��$.�S��$��5B��zx<�'��oL�H�|�G�^��J�����P}�L)˚q���[��p���=��V⭄)>�B�yY��Pr��b�/%���X���c��)<0/��~�~*9�ۀ���e2�%;��}�-|T<B\�S��3B���PnA����n�H�i�y�����C����DX��9���頲��F�@��$wQ��E��`�NB��:���T�;�WR���@�=5�6J<�����K��,�<��0�F��o^U�"�W/��8��K����DQ��:�ڭ�����z�;vag\�ų���d|I��u⒄�8d,J�1q�II�r��Sjf��L#o<����5���Ct��T�a��;������E�7,o���yA�������a+M�<M�`��8-���M���?�x�8�S$�j	R�$���:p9���m�6���+~�
�?�ѝ<�I��񐴨�|R2?�Tj�ha1Z$ �e�bK��v��$+��q�!��wFQ?%1��<Q��������I�      [   e  x���Ks�@F���`9Yd����	�`�7�+��ڑ�4��&�1���*V�9�{?���ơ���d-�sP2Q�r�[(KH!�F��G���K�t��0]ٌU�����X	�Q���L�O�<؉ �}�FPB:A�`x������.}�o}��Y���XB*Q5��#�JV0��;U� g4�d�&A��m"wN��-_�����Fv�-`fI���ZR)�����׹+0�/״���$~	荨��6.��%������b73�`]���CV^7��I'�x�̆#��FU�����o�O'J�������o���+���;ᴿ81�Xq)�j'!s\<̠u��ĩ���k�.��1ֻG�Ʃ���rj ��|Ǌ�ZQ�1J+Åi荩y8�`4:���6c�����w]o7|�ԓ �Yz�ۇ��-�x�l�Q���ze���J2k�d����|,a��Y������ZeE�SZ�Q%����M�7�И	��FҐkV�wz~T�����- �"�u�꽙b=콹��J�U�ڗ~x~s������~�"�k�
tgHhG��#ʛsף�z��(����(�|�������b��{j�?[��o�3      \   i  x���Kw�H����`5��4�c�4>����ot*`x��~%�$&3s��U]o�*�B�c}��d@q� "�J�cX^�D���S�u`A/��q
%���f��F�� "$ygYȰ��B��nl�*�j�QguX��S;��τ����!�����>si_-Ǯ7^�ŧ爿�C��n�d����ՙA�|V��h'��Y^9>@�a	r��q�ϛ���|O+��i��|��D��5P�9�k�� x)���f&�����p!� �|+ ��t׍ԑ�v�j�����B��]Tt��J'��憎X�p�'�� |�P����{��������w7=�)���ۗ�"6�FT?O�)�)�IA�1$Q��RNf��R�"��W~B�pw:�6)��X���{�`{�<;���;^^I���+W,N;]{�i`&z3��#[��S�W��b�>ߔ�'��Q;�nǑYJԏS:�`�ؗ��������	P��n�Pj�'n�_�Zc�ۆsH�e���),(_�ڼf���x>̤H�V�{,{`Dl���]������F7#�������L��ev���g����9��pY�#���]��6$t������a}P�=ɂ�����P�FUj���և�)@q�8�����iU|���7�kn�-a��z�<,�u�?7����I���m��;+obu���X^��h��%�&�K��R�Y�a�6��)��A�\����?P�>�g��h��eq�S�r��վx|��4,׻���s84�K�ܔ����w[���|1l���Q]�<��΂8J����d�
3�F3�%S��e�g|o�����s,d��S��k�~� u��S��?��N�o4�      ]      x������ � �      K      x��}is�J��g�W8NLܘ��#�
�ABZش�w��&@b������,�ڰ��}n�9DtK� �*����R�S��!��Վn�e ����)������mɴ*�k��A��B-Jdb\D��.�x{ۙ��T��y�Y/B��I��ٔ*����v*�������o0���M�Cv%_������k��ۿ���뫚���ja�j��Q�[���?���o��>_����P,SY?=S:�-k�k�jvZY�������7~�,� �n�IN�+{��k�7I��T�=����rJ�9��������~!J�Y��(�(y��~[��Zh:zA2�W�Q͠h�KI	ݢB�$?,J⻞懦v�6�t�$?������E�ב췋(�Գ�
��M!M�AYL��+8��W��MH�bz����s���d�XE+uJ�7�T���X
�}�Fv�G-�����n��T{���k�so�i�������!��
7r�'Ks��(Hz�vu�A^HnЛΧ�wR���������'��0��r\U��B_r�줍;U�WF�BK��>+�#u-Jݢl3%+�R�Q��^������3��Ij+5s�=�F�u]�Q����XR�O�E����d�_i���'uH�u6�,3�O��_�k��q˩��A���֤@u_-��؟k�B��F��>��
��� u뵧TD�r�|z[|vO�.�N�?獼�H/uk�%�I�H&w��G����ۚ#�QC�!�z�t�y7�GZvM�f������������۝��{{�����N:"��5���;[�3�`�_Q��g��?2��k5ѲMn�j��Ĺ�f���e�G�o޻�S��.�$<�yJy��S��_g��|���>7m��v3yի�d��q��6"�U�� �O��D_X�D��UN�0�q���_6�^fݿ�Ӣ�ph)_��nB���~�y,ςu�h���U���#�K��>�~Z齚�B�˶s:�7�=�{��{�|>�]����ϭ��l��.�Yt�X;'��b��s�V��ǐ������S�"^�b��N�Ng�]�w��qJQDgt�s]!���+���ImI1L�n�=���!F=ߞ�)w+��v:<V����t�����ה��p�j���o���y����띰�Z� ��_W�cd~��/'�X	5-4�l�R���6��v#����k�5���Ϧ�i�f���y���ew���C|��ŵ\��r~����~m���[����+�#��pn�����u�Rp�V���L���2\@�hϥ����?I_0d�^���V����dM�B�oDߣ87��9?������R
͖��B��h��3j�J\Lq�W]؍;���������-$��QRm3u��;��^:p�}����-|�R�Ʃ^��\ҵL��\�����R�_�Ω�D3;�����/e?�e�g��;�����/�/?2�  A�N�� ����C�D>B�#������� @�e���|��p��v�(���K��<�"[��fK���t�0r�����Ŗ��vבP�U	��At�	�,��`��a���w��H[�q���%�%}����J��� �p�HC���C����0�2pV�=B�#��G��%�d6
ܑ����`�Vie�b������,�p4�k�d�q��>����2g�����#� y�V�YR(���r����t6�5��#��G���0n78�'I������1��jF��dKp��aF������z�yp�IܩM��D�ڋJE��2�Xc]y�0����̠�z�rsx�����q<Իd��� ɲ� ��6�QI/r8�A��A���N0���F����[�=�+�ـ;!;����/�n�kأ��?Uz��1'q�	�����#x8���<0pɶ5����HM72�t�#�#���R{���WU#AMJKta�i�]����!��Y'����n�@
V����j~86D6�/8J�|�#e���^���vۀى�@��P� ��3��l�xb�WI}ޚM �{Ơ��6�ƼP�hI�}բ�KU ���8�H��`�N��]r�>��-N��ׅٙ��<<"�,�	�,>��ab=��2C����ѓn0R�+�B�iC�Nd�k�u�;����hG\����G(���
�5�Ѣ̂/����Y�ejp��Ζ�L�-g�hW�U�K��*�f���@*p�����f��(	C��
=@�#�zq'.� ����#Hd�9� �i;`=�$���;�yiO��x.z& Y p�\�JMD��	vߞ����;� 2in�{a��m�:�y�>��4�D���S�<��St�-]���K�,����&�8!����A� �EnD���]B�*�i��JV#˒��z�Y��q��m�Z��p?���6�ޠ�΢d�5�F�ibK^�ja��ۍ��>$�f+}���������;�gn�=�`b��D���֔CLʴM'�:�&��.��T�دwrX��פ'B�0��Y��	�T����u'I<��Mզ+{6�m'Z.(�o�ZǕ���W;�#V�N+Bڅ�3_���h��H*`���ܟ!��N��5����D��38Q-/��%$�jo���Fm��f�6�%S5KG�td�"�L�`P"�K]"�>�/�,7�f㏈?��2�M��8(1J�������88y�'�8�(y��ޞܿ*xM��]RJ���$yi�M��=})�R��V�+A�=��9�s�7|��ы
q������ M|����I��#Z�h��%��?�� H7����.E��]ݗ�{�4%�B	�P,��"/�hI� %��O��%��)j	�P �[,� �k�n*�c�s�0�������Dmȓ�O�p�8J��/�y !� I�[0'e�>��#���j���f�C�=i����ޑdS~hn��� Fv��ܫ�������j�Ef̴�++�xݦ.;&�����B���M�F�е0���l]%="���^��G��o�\q�euv�J�)$&: �(��z�-Y@ʉ��Iu&t{\��r��C95^�[mlψЮ�ՐH�`�����I/�е&�e�h��.�~�I��v���9���5Y���#X��f/��)��R���R�u�K\�D\�'yR��p GGÄZ��iה�l��n��@�Em�.# ��%�C�V�ŏ�BCuV�%c���x��HyJ�뀆�00	ҫ��>�	\�`(-�#����&�����tZ	r�
Yխ=��'���e(�+ 0�#&~L�>6�yf���qG�R��2����*a�����ΝĐ��°2�Ut�+ve?�Պ���F���1֊B���4�����!�#X%�������d��M䁓</��YQ?\�r���
K�m7�F��b��V�ºa���֩.��Q.��d�����m$�T�1>�x<���0>�eK�qeH�U;[��e4�8N@ksݭ,�L���u��W���݆Ag�h�D��Ub�[1��20Y�����|�� s��`Xg�����5�J���*]� 9�8v.�H�pL���p��ija�P�����̨#d��u�M�}b*�+ [ %�6W )�#��T��0,
�U�9@9R����i �p��
Vs���\�57=w>��36��m��|���G�V��J�v̂� `f��X�m�"L.Z䬾V��F�iG�C7�$9�8�[��	�T�m�V�I�*�"�t�;Z�� ����u��VZ,�
��7�Q�[�L(e����G R��d>�Z����pbH��`e��v�X�a����'D���gu����ڮ>�k���``�L]<4;:���'���'h�s78Y��$���|�s�3�T��>sX�ƣED��q��nE�&)3gU�h#�\5�|��Fshe4�<�������=7�<{��ބ�{��_*,S��T�2��Le{/�U����le*�GөLe;�He�LE�L�����G/�޻��!�G�DD=f�=��t�{��f;��   ���4���I�E4���kǍ�]?Z(��	�,��z����I(OJ/s�`������FC�EZ�]��H��04%dNz-g�8�Y5~�	%*�}��pHd�7��i�%�75���hZ�����V7�����vT'FK����*�km�t˨�ނ6��1+�Kj�X���tǴ�Q3l Iw��9ٮ��w?
���e $sv��V� �龺�{�a$ņ����W|�4����J��9���̪UVZ��b��Q(B��搈�����M��0kΈx�0.(��]a����P���n�!�`� �>�PJ�xzG�V'+��<�c�v0���r=�ڮxP'0�%�:n���|7�~w��� <�$T� ����I��2M�3�����R[�d#C�у(i�
�g*�v7�X2i)�6��T^X�"K�@9��Z$��2Z,�q��ˍ�|;$<S��>�x-��g��V]�� R�1����w��B!Zclօ�K���;B4���\�h���h841h���*���;b�@7�����{���v1���6i�3�@��K�~��a@���L_S�c"{Rݷ��D�4$q�^�"p�6E�|�o�7Yn�2@d@0� ��:��n��F��Q25�%���I�V[��+�qO�Wqteb�[u�;b�:��%=�{��K�m/P�z��M�w�����8��R!Օ�Q��8�����ǟchtu���?*���QD��,$,���d�������
�֩U���b�^h��(d���Br���,xI4-|i7@�7I��f����m��.Z��%��m��{.�T�����6�����WI�D�Ei���j�v�����E��Cl�!��٧*ߴR�؇����M��t���a$�}�.t3�ct��ۛ[n�;AUtx��|3����&�m����|�s(��@MB�ՆE'��5��kG�DM?sz=PZto��q�T��B��g���z�M����t��So6���Fl`�i5�ƞ�[���^ÏX��cq4쯍���&-�7�y�}��ْ�H��~CK�sxhT!�A�K�p O��Ѭ	7[ZS���H�ĸ�c8��mW���ͱ��k�>��隋��I���F��(橙?�6=;��Niȣ�fխ�&3�Sqj8��ڬKq����8�8�Xw�^�O��o�	-�-��";��穗��@%B��P�ojݮ��T������T��3��%֡ ��YWp���@�� ڸR���j�m���P7�j��Z����9nT):a����;��leآ�b��;M�Bs��^��~AR:�lq����P��m�5fԏw��l��옝���ǳF͝�vA+�F�v���[Q�B� �XA���$�I?r�k�\0��s��/��E��f%¹>��H[�t]^&h��:�Q�a� ��3'�uJޘ�]�e�hYR��B�/!t�\�4T"�H�E�O���}�M�&�YY-��@�-�s}�0�VӍ�[��Q���H@���w����鎾�3`���UG'n���Lw��[�2��x�N��ԝ[�iy�K����O����O����O��|��Cb�\�>x��yp}P���i#�&�=q.�[
����v����v�Zi4�m����ZZ��ع`��y�O��Ƅ]��t֏́��6Z�׍�f�G3d�\.���)���)���)���)��C(ⵓWn�O��:�;�<��-��XzC[Ă5����kd�0���ׇ�u���|�O�"�Rָ�F�9% ��d���5����x~�-e��Kȩt}Jקt}Jקt}Jקt}���� ��~��G��算�}��-���j����ax~l��аk�}k���R�j��aĎ+x͔��`ӆ`fSe�A�����_�0����+�8��w��w�R��ߕ��_i�N�,��/�qK��<X/�L���f�I|�I|?�I|��zS�hD'����e@�g�#%HQ	R��d	RT�� Eyө):��;V�򼽋����>��y{�y{��]���3��<oty�^y��O���y{_���y{"��y{�y{�k������}y�^y�^y�ީ��_ ���?��0�p����B���P�o�A.��{���k�`ե�v�j�e.)���nK�Y®I��ۏ���WC^�7=��Ԫ��1�io_�ɑ?�W����Q���*e�n��[&�^�l��[D��r�n�Z[���!��i}e���Uf������el������e쯛{Ya��z5�����7*��I��F��=��U9�^��9�b�q�)pދ��Pɨ��+�)w�����ק�l��.��Q�vN(?�����=���<��Z��3#ˬ���\f�Y����ˬ�?Z�e�`�5��)g�5�E�Zf���Y�e��w)�O���e��
)re�����0�P�B(G�n��3lJ|ū<-�! ���U
\�Ww������?��
+P�����? ��=�O�����e<u������4�����=u��F�"6�AuF�k�2o�a�39� ��BnB���D<�P�ɺRXm�L������5���W�8�D���/�d�ŭU`���������̍@o<��Vő%V4^�I��4���8�:����*}V��n5�O'Y����f���+�|]�����9�۳�3��E"��w�}-5��+�7��c.u��(�b�Y]����n��qH���P	(�0O�m[6�L��`K(g˯g}�&2��m������bG�=SW4X�n6{ɼ&t8dKq�@A[�a�L�:��?7���R�|���'�r�������ݘ��4��%/������>!�_:������"?����ӆ_f�{.�;Ϝ�w������s��eX�g����ɬ�d��Hl��7m6h{�kpa��Àh�r�g��M�Kb>�[h��3�h34�Ѭh�N�Sn�͙�d��5�!LED�G�F��,��S~�A�|���,�t���	��=�n�]|������}G�Q��/ːG0ۏ����|�Dd�L:�����۷���+      ^   '  x���Iw�J���_���"}jD��2�h �O6j�#*���?H��k�i�����[u�jd��7'SB������	{@x����mt���1��	���+u�Q��� AW�ܘ��68D��qc�F�v���)ВL�EK�ѱy:�ܸ�n��0Y0r�<uj�y�9s�Zd�������̩`�1,�0%}x쾛�+�jIb���Wy�E�ॊ�SI1A�\���V{!iD��Y��,}�,	�?!Ө�ؤ�j+��(ɍ/���O�C3<��Qi�{�2��ӌF���@��6�v_A��J^5B��q�莮�������m<L��0��?��W�(�m�q���g��jV���F������+�* ��jcύ���9h ���䖦�V�0"(�����f�9���^�R�[��T>�qCC/#7Mȑ�f�gF7�4<۴���7F���O�qW���n��v�g�7#��fp �l_�*$���T]g)�2e2V�mp�ry�`����c9ֵ�&��3�7R�b��F)jt���ؙ��=w�g��V�Ђxe!e��Ý7����g�ti���|\7%�a<d�m�-��/�{z=�cƴ�_5r�r0V����=�A���G]�W��K%�Q�͂�C�%��r>x�Oo���s�+Co�J�M�ط��s��?��U��J��,��s��{	�
~���ʹ~��o��҅����T+�R�ߌbaW��c����հ��T9έ�5[�@�ϖ�7�Z�a�Μ�;�TDP�x�򝪔�?}��j���7�      `   �  x��W˖�J\�|E/�.�����y��T<w�PQD���e�,��>�ͣDEeDd�to\��m�����pN?&>�?��1��n`����vF��s��y/[ �0�ΡwNy�D�*���<�}�_���2��*���+��L.C�G�c�1��s{u�i���]�]�����z0o�U	Dǃ�f�/�%�y�����N��!g}):.��y�W���,�uh�q�R�yg�Ų$/Q�&ߏ�@�I�[���y��#�.�����Rw"7��i�7�%��"��S�D���T�����淧��J����\ڽ|\����5������e���_���Nd�r��I� �jb�Q���8D�-xN���̪�S��
@y}�ܠ_�q�ۙt�c{X���X_�����.P��4cE(2S#��3WY�m�m����&ۙ�UG<����n:*���.D<miM���+�r�M.U0���b�&�!*��!2���w�ns�%	/@���^,X^f����6�)�<���{�4�۝�U�����#!����iq����v��igCg ��Qd=�,g��~�v��-��!H@ƽ�FH7�֩�@���P3��QS)�T�Q�Ԛ*�~�kW$�D�S�p�2��z��u��K�k㰙v�}r�v9��.��@8FF����2$��[�ofZ}�?Aױl��ۄ�B�[�q���۩Y�/h�x����yg_���,'�;���=&Jq�.H���O@�e���xݭx���Ykh6!KC�c��}%K�8����8�gg#�N@%7���tґҎ>:I���ߜ�N̽�ƴ�ł*�F"�n.�ٳu�*a�zЃ;h�X��},e'Z~e1=���1G����Q2��g�,��hh�Vė�4��k��q����k-g���aۋC�Pn)P�D<�NWe1��Ll����kfTS�=�ّ�_��z���$��y���-�E��>�<��}t"�$��j���	�aJcA�iT�N{�������0.�U�R�N��s��U:����Hk񭏆�d�]XإgԱ>��
�t��@8h��gI4�8�턾�, ��&5��PH�"&�7~��J[��G-��"®_yE+�7�	)��[!Mz'��_��G�p���b����>Ɂ(p4���TΑ��㷭F1���}@�5�V�&�e�>��Fv�U�&�L�������ôs�|��8���m��6�_^�'��?��q�|�>����{���R�&�2k�oPFG'�j���z�2�� �@��v�z'��4�GL��$��q4�f�.v@�s�6���k�\���b9yXI����xy�_��I�>f�;��g6V4܇��<�t��j��"CYϗx!��+P�O�ֆC_x�y�H<@N��<˖�V;���~>��Yk7y��A	�I���F���[n����(}�7h�τ(�0��N�E�x]C����g�k��|����q|{U������[��5���FN�=D������ׯ_��n�      a   )  x���ɒ�X���S�t\fw(2O*(�A�P��M�;+���r�q���3�46��=j�#��|&��]�\ou�gZ!��P( ���?1�] zA��_�`��ֱ|���m}v>
e���h��i� ����������(r}JT�J'qA���!�A'�)5����s�������'Ϸ�*�֤����|\�Pﵒ�,���0�3���i�K۶���:���S`<�w�|�/m������Y��_���D��n�<W�E瑗Y�����?Pj�@��>xNV�ӡ��8�0F��'����yVa�q�>�Q��7g%vG�D�"9Y�u��̑���[��c�c$� ^�:�ꕎ?�Cf~�j���r��5���P�H�@1���dr��}���U������`j��.�ZIhZF_�j�4� ��+6���}�eY�����/Hj���跮QY�����*�7�0L^9_�a�$|�"Jn�K�L=��?<rA����uT���m�M[�;o�eE�Iy4��Q�i��|}_�ª�ʽy��?(OZ�|��?v�Ewƛ��Ｉ�����f�vya��1�w�Ԑ
�����8O��*9��I��J՗���~��,!4ߪ�N}M��5#]�� D�/�t�m�Qu��ĵ�������7��ʎ}���j�x�޴~�RvvUd�{���+�flӝ�x�Q�����˳1Z?�Zw7TO��R���9�A���7�_m�mI�ԲJ�VF�}PI]�
~����� � ��&���������+����7�w���M�*���<�_���,T�&����c���^���v{b���%-��cc�/,��_pt��WNJҸ��B?�a<
g���{ΫM6���/�֙��\�_��<%�Sp?hcvhY+�[�)z���w��zӿ8���`�ƪd���������=�M�5z�z�	�Gb!���/����殗�Z��s޳u�U,����o�����7�C���C ��OC��M�Gf�؞�0bxb��ʦnfm��Ń��la�>"��t֘�d�20�/_�i��5Y咑�C�lyV-���2K[1��|�<��}9�_�n^6='�}�H���{޴�g�(��Ze�k��
�M�C�����X���AB�Nk�nw��a�в��'s���`u���,��C��7�V*)>�v��I{����3��IE!I���x�/�m��z{�W|�Z&r���z+X��l�G������t*d��ר� A��,az��sn�T�'�y��������>�	�
��bݣG����_��<b:O_<���:^�3i�d�#9�0�r�5���_<�@yP��a$ՐD�. #�����h*H-��/��cи�����4���,�825=�?y�t��x$�'���-.�z���f�l����K��~� ���6�{���ww��>Sm,By�\�A�`>�T�����\�C%�¦�<l��y��x?���쳴�1��J���*����#��շcbm��}Μ����;o�o����Wl�aǻ�!W��#��Ⱥ��._bAPPI�g�p e;��"�*|Z&�0�V��/	��/��b�Q�^�x�&�L�۝	�Eq̡���� �G{勺F�9gl� w�8����'Ҷ}����G���(��C�@N�Q�EE��7�%�W�s�+��m�r�GEN��(1!nnqyW��'&�~�B��������,�d��Q����#�-��q6߬���w�z�60���Λ��Z�g����GF�:IX����~85�����¥e�ѻxs�?�xS=ִ��O[u#�BHW��x	HSL��~Ƈ����?��mL�b8���7�H�0L�/��/Q�\s�?ߴ)лa�h��k��//�/��:�~S�zy>Ig�o�GgE�:�y�_��G�=c�,�8_��_�/NA�\#���5�m-�0�?�|Ǜ�Wp+5�C����!Lg�����WT�
�]|��/<�:f���1t	�Ia<ؼ��M��Iu	,��x(J���ś��׏����*��      d      x������ � �      e      x������ � �      f   �  x���[w�:���_�1�s{�pQxSQ���\�t�(������O����J�@�7ךdf�����t��a$�c���F`����Mym�9C�y̧!�`�A�� �� ">��3&K�HTI�P��	9��t�#״C�6�[Sq1���&�;�M��`���Ţ'=�	�����m�=6���ܟ�wG��kg+�5FQ+(�����vV�ȍeo�Fu�N�*�h���z��Ob��-��m��@��{��K7��3Fc�\��^DY�����O���e�/�c�L�mg��>؞^Os��{�nJ��p�N�cǨ�N��jR䳔� ���(. Q�tm�9��L������s1N�\������wN%��\(l �{$�����z/�q���,X���2�v��fzP����g"���>�*��E"��|�&��yT����6Ɏ�<�U�x/,^��Ƌ30h��!C,�H�hƽ������y��G��X������\Q,�&�dQӷ���2���fyo��f_� ���%��a�k��O���*k�<�������#T��@m3��2f��"\UB�]�����OP��Җ9
��^�YcZ=s/�����8/�c�U<�ƥvy�H}���S����z�<�Xcy� ��h� �-,�D�vM�� �Uw"O���v;�v1������e:��Ie$�#���T}�~>����� u�Id�vb�Ϙ��ŉ$��p�ӕП�q��_M���*2l��
%�!U(�X)�6�F�������:K��\��+^�����Z`%�l����#�o�v������]�Q'k?�~�D/r=��x��ق*�G%�� 1�utj�Gg���x�;^B��ǵ��B*����-�c��<�[v�|�^��Y��3V ��B�,��m�}yH����FdKV:�rU(��������?ȫ�(      g   �   x�m��n�0D��W����	�o�)A	�@@�`Bb
��4�DO�;�7������no�ۥ1�h������(�{�&$$h�!SD�Fq�O�v���B�See�h�N���4u�����v�����쉾o��*S�I}�h�� =�1J�/��xB��6�x�"y���Z�*�Ys$c{�ں/3}k����O���|	���2�fjR�؜O�1��Z�      h   �  x��ϻ��`�ḽ�)�P��/Gjt�a���w��d�:�N�ު/y����jo\���]�B-�H�����ZH��<�N�#!���(t���Hr�jU��ڀ���|���ߥv�"~�,(tf�ʩc�;-�6��fA�3�s�(n�$�O�p��Й�do7�⬒B�B�͂BgZcp��MU��v�=�͂Bg
�׾���ߟ��>n:s�jWt����_�����t�ƨ�6<�lK�&�͂Bg���9����]^�����L�VHє����p��Й�2;m7����6��fA�3e�><VFs����&����<���P�:�9����,(t�&+bI���}�}6�fA�3�qR����~��K�͂Bg�[#QF�(���]-7
���b��ZP-=;l7
���X,� �p_V      i      x������ � �      j      x������ � �      k   �   x�u��
�@E�o��0ތ��̮!I#!Apc8��!:&�}DP�hs��eu������c�k!+����q���E�r<�����w���SjmH6��3�v+����b����):H��?yL��;��X�إ�|��'(_0z2��E��\��n�B��SL��+B�*#8�      l      x������ � �      L      x���钢������*8_vt��T7���o8����Ɖ8�@
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
�?dU��pr�o�w�8��ã������=6��yvgܾ����l3+g�ޒ���X~0�!^_#� �  �l���(J�����nZ�;PB�L?���lNr�]��g�ᝲ�Ҟu]I�T��e����Lؾ+s$��z~��j)����z�c�E�ʎ@��cu8�k�?���C�����F��J#R�_�m�b'�����Go-n{*䁓(9�3-�`D�����p�j�0�P{v���b�c��G��Л:l�B�#��葶�l��z_�B0��Qy��E�Ƽ����Da7�P��ۂ�~um#Dp���i/�t��LU;���Ԑ�v�M���ݾ�+,e�8;�����_+��&K�3k&ܬ�<���Zy��8Կ�俩?sh��穤��_[�֛ ����+�.�j�;U�J)-����M�ʦ�~U�xI��m�=y���o7ڞ�t��>%�"��<��L�F���'��~S;gg�$@��r��Zk9͛�z	�Y��9�yp���P~��,]�h�Ȳ����]�lQ�ېO9k<�|,s�<]�T �%��? r�ӛdeE�^}-�
=4K�����?N�Y,�0��t��9mV�D�F�hJ�J �N��K����ʱ��B~t�*��S�%\�|�'{��,�1WU.h�A��A�r5��=��;���&�� r�a���
reN��fg�χ�t�9�;���*�>�`_�DH����<?(��6}��      M      x���َ���?x��),�t�?uU3�;�13ƀG}7�d0�l�~�~�~�;�2���/�T:�*�v� b�5��w�OMl��\ys����p��7�|B���7t����H�k4���z�����_y��/�#*�l��#%)�M��m�L(��	A�@鶿���_#��I?������cl��?1�'>�U^Y���/��f��\�b�	��c3���&�`b��ʊ�%yV��7R¤�?���ϵ�B�D?>$<��gz&J�@���a�N�W�0?�Q���iVVY:2�ʋ���FJ��x��zȳ����y��)	�b���
wd�0��j�騽��Ԏz���:Y��M2����!Ho$�a�� �|��,k����:-""ƃ8���/I*$����"�R���z�E�s���o�E2<����@FsPa�}�b�e)b�	c�1��% �EV磿����?/S�xAΜgKu��O@���H/´�rĤ�q�̊�+_�usɣ]��i�n}ӪF�0Ͻ��q]sAVJ��P|�����Z:��|���T[o��W����o�3y
/~�p�~so�1���`�+e	W���<��q��]�$���v{�-��k1u�ꮸ��,)����N��|湷����[��s]޵B3���GB]�ZQ��U����ȋ�	�(����]n2ՍY��]y��+/��>���,�r��5s�?��V����祣MV����!D��Ԙg�<�]�C�4P�E{n�����7��Y��+\da2޵:�_dVM�SK*��9R��T��"���-1�����}*y^��P�pY�o���"��/0�s�5�x���z)��#J��|�
�Y�F�dF�w4@�T��s�O B3��W�4eSe�\�zr���phr�6d�`� �^��6ׯ0��1H���
�,��Zۡ^l1���@D`�U]�g��$�.V�DG�?H�ny�h�e6�s��ց�~t7a�3����^�����$���0 �-X�ǰx�@����妯�q&ډ����`��o֭�i�i��ˋ�7}/_ȝ3=�'�
����"<'W��^8\�E
/�\^^�ph�LUf"� ��5;��:�~�Φ�p��	]f'���p���0����8-��҅ie�QzJ�W������2�^��H�!U��"w��A�7�_�aqR0L�i.&��88rO��5U�%CU�����u��-a��$	�/ְ'�x0�������Y���_���͆y����e�'$B'����IN�~E�V��S"و�ܟ�K�u��ON����i�6���f�0�//.*HXY��"L�,^�h��{
��
Z����
|����)�l���/�{zv����8��2��Js�'�)8O�c�D�Y�&D��������&�-- �Fz\���m�ӑ^;�n�����)H1p�2Ⱦ��^]�*G�5�.aB�Ho���:����`�qq;Nt��Yk������l��C���ty���hG.[%�<��Wg*^�a����`'a��r|��s�D�$����̪�Z^�%t�$�y|ӧ󄁝�i�UA��ߤ�eb<S�,�k��n�F��{{y�%}8��%��e�~�tl��h��㧡p������`BM
Z�.��;��]L֕u��nT�@Z��2�e���؇�rE����g���&�QK�*A���ОM������>�� ��������v?�l5u���c����%(\/�#h�3j��n�𻈞Ӝ����7�C�G�n��F�zm�Ag7.�ēM�ۈ�[��n���]�ta�V�-��nؑ}Dz���3�����
R��'x�C	$u�g�U%=Y���O��<���|e���_�d3$��0Z��M*�jک��*?|`ߎP�/�J@:
�5f]��r��GA��Vç^�ߋc�[pՑw�Օ}�`�~�����Z,�U߉ɷ���]�����*+���o�G��uC�L���D�E�؍���n����)�H�����odނ�)����0��cn���ܢt����m��_�Uҫ�k����t��O"�������|��V,=�
�9��)�P�u��a�u�b(�j���y����tXe�����p#]��n����"�¤�����>��k���� Y'0���ʱYU��e��/;�.��yb%0D�̧�k�ll��^�L�=(��,(�֏�d3�\���R��ձ�������e`t꺹���4/���K�:��5�Ox7sx"�9�����偞Mu��<�JL���w����\oj.$!��WW>���w|9̍�J*O�=�,�kA� 
o�_�.����Ù����VӬ;@c�PAZ����6gѪ�/��l���X�η��:�A�m��L�[���2��zC��L�!8������qk���ۄ#����ND�� ���6Y�N���iu�!�Q�`�����@���=�Si�3�]e4IK����<��Kz(I�B��ј�������E>{%8�A&1���|SS�9��iթ7�O�Eh��
OA-��̄/��b�.���(������E^��gD"p����kWF՛�ۓ�8�E����NVV����Y��2-��Zt���e��uڻJ2�uS���i/�№�	���{��Ȓ�6U)�u�g��5�gZjX�Q�\BI�� � ��e�H͆�@�����\�3�x�9;*f�|P�)��&�P�A���h�d����Ia7&��.ġ��ɇT *c�=��ί��]B�S���(��M�K��'��A4v�~�e�"�$����g'Vi�k������#J��0�������*�0/n1l�3���>^�ˣ��fQ�{ް�>d��[�R+����-�˧���Æu�GϒO��,bK#%fp&o���'�آ��*K�E��cv�3!\k
n�3��Ǧ�����UYM�T�,n��#%�����H-hmk�q_����U�-:&�a���^�I���+�Zv�Z7�Kb�wd�]�d�6#�(á$
۰�Zzc���ɝ?��^����ډ�`+o�����Ӂe��R9��yQ�p�����8Hi���LMװ�0����y8�,��~�9�/a_�������q6չij�����=�u����q����`�>�8�
6RL������H͛ej�.��/(��?ҝBV�=]��.3{��V�n�sa?n������<�������G�q��8�$��
/��-܏��"���:5�o�«Ԟ8�v
r�'������Ӵ��q� �L٭�RX�«��*SP��g�BL��Ih�r�K(�?�����q@(n��v(2�����3�9A�
m��%f�U���EV�N��#z����>�?�.Z�j$���AZ[�}-Z�f~eМ���q�X swѪ��5a���eP�8.���k'������'e�2sφӗ]=��r|��1$�$���и����&��N՛i2�TIv`��B��moD�.q�>��K��d�i��3��E�O���C�Ia��F�#F�:�0�W�p6�a��p�-�C�Ӭ�EI��a�w�4�&Љ+�uX���3xEo-Z�P��R�5�3p���#l�x�9e��N��	���=���&4=�����/�揰*� �w}]f������F��p�
�Q���y�`1��� ���U����y�YKg���
D@yp�}�SH�-�f�z�O�D�,���R�'0�Ͻ���N|`�b�8\Z-G�����-�^���ϕ�:,���N�l�t�tǍ �%�I���=��R��ȥj�ȉj�T���;g�a Z�6��G���-ti�4�J�S�f�� 'M�d�&' �@Q4�A 8_�:���-�5Z���@�#��N��&�� �yVT���o@�-�����(42\�`�Y�dhI'V�����g�q*��z��}4/	Q_��)�BO��\�":�300F�* %��5R	�?�lYWS�/8Rz��l3�8�O�`D��(���4U���W�I~�    i�WY�����T(59���	[�����wM�^���:��u���M��)�)�����Ŋ����XF��U��ҵ5�����<�	7܉��˸7&�
��VܓT����ʖҖ�)��*�G��G�J�<n�#�T-O�#A�m�
��v�v=���k����%��,�*([?���I���}C�g��-V\-��}Ϲ���|�6v��!������]�q��O�2(lrj��Q���b�ejW�v@�fptT����Ծ�K^�Mt���L\�"�VF�!k��C��� �֡��k�}�c/f�e��a���+w��^բ�G�}��N�v�$r�A������p��AF���j�#��>��պ��c���).y	�^��,�k�1����Y�ѕ{ק�y|�����f�Fħ�<O�l4��҅?2���Sp����k�LH#��턆k#Ӌ3ܒ8͢��Fj��y]��	������G/��(x��%[���s��{;�`č�"��>�c%�y��X�Mۚ[ �����=���9�;�:+���p'���ccE9�,fMM	�u�z��h�ҍ<�6>W<!l��#\�y�׾�*�]��DS�ɔ�&(\�Q��/D�i|�ԕ�)	��o|3���qfK��W�(=��Uc��.��m����\���BdP�nk�|��-��ԫBg���ybO�%����ɬ�.�V˘f��r/�d���d�
Z�}6"v�sԈ��	�l�pr�<ՠ�ۢ�F*	ќ5�������Ȣ�S��<�M���\�� n����Jz��]z!
s�8G+'��n�����9�8���Y���y�&�zu��OݞJx{p�8�ox���c���h�J4ˁ�d����p������4Ef��H�#�fE�*�!��ޯ�YNG};=�I���O�t���<��'�����~^6+X	��1�w��!-6��|r�N�$�61��®�������P2���-��cX�A�u �1�pN
�+p�����i�^��0��-��y�,x�~�{f��T�J<��m��(��!�uh(z���}�4�Ts#�fm���4��e�2;�������ʘE}��ח��zns�S	�538x�Y������>W����`���(�E%}��+�:��(J �X������D]�.3�5�SX�*].��656ł����$�mդd����8�87�݅�P�VO��y��N�&>N7�f��=y04k�b��2�%�>� )��yq7Eox���JL��G�0��[8"��F���ݲP(�vJ���"��b����~��^��M��;�>;p湵U�ֿ��t6�ibeI��� 'o9pT��a���/ܕ2�	��Qf����q��{�"��@��~��tC�:ɹ�or9n��$��I2MV����n���tϻ����q�7.�+\}7a���0�|V>ʬV�G^���5|��==\�B	*ù�ӵ�d�ڟ=�=��8��+�cYYY�>�FQQ�Q���P{��y����u_�Á�{5��k��8�̐�׾�ڗ��eOOh}�	�XY�AH��gLYfNW��7��\�"	:Y��K�W�^���~�;Eg&WK��E��ȁ�[{�gz�Wŉa�N2W��R��luM�Ӽ��ڗ	 ���%}�:���K�`�O3�tw�݊.�/mS���K���pD቙ќ��:&����y�%6�%UeɌQ�
�Bml�J#���Nؤ$:���Z;�pE������Fk�^=b5������˾�S6R42���^W�F�ϩ�D��'�P�O�����J�"���ǽ���-�(��}�B����B^8����BL���H�E���GW~�#{Q�]��;L�C�gi�$6��\�(��c�X�W�^"����+>��P�Z�Hc�8�&:�(�8�au#t��Η�3�X��s��ɰ�0�m�XO�t�EL�.�=�Ld^ >s�����L���p��vq{2i!*FLUuer����t�8�GL�h8Tb&�RM@P�&�n�Y+�&�Q����y{��R��e݁�]|�w���ˋ�vo3���<-`Oz��:AE��i��'�c��?1]����N���~?��,�9lJ����Rb�.�kbmq�i��.;pE"[W�{R�� ���Ph�i�.��M��'��~ߧ�A��D���Y7���P�"����{��;�"��Ac�����D��/�y��u��$s�׫�ٝ/��;/����W��g-75F�Ii������/Rd�z1�]��J��]>������n���1.d���j��f?�g��TP��YMiG^���)��I;�|���`�+�p�Br-�I-Yh� լ�j@��^`o��Ǟ��]������s��6G<�6���£.�Ѝl��xU+��?0��^ǡ���[�K��?{�Z(D�2�(ڨ�I*У|��O�z[*�>^����O'3L�/�x��a��qI�î6�oI�O�fk��rL70�4F�{�C�y��B3����b��0��j���ȕS�R����B8�hx-���X��ʒ�|ҷ蝳�A$= '�CC��"�O�ғ�*A��󨆲��9/�5G����i~���l,3t���J�޲~2MѬ2�_��}j�Yd��7��x��aR��Tq�.(��$���\��n��c��x���d����3&�a[�\��7��C���f^xؗq�?���x��؈����u�eW��W�������Y��B�x�?�{|�/�|�cr�0�G�r6c#�VuXª��p�H	�8�Y�sKɢ�x��?/u�Ϗ���	�==�+k*')�ܳ��C IxwgN�h�[M�ɞ��!cZ��Į���D��*��C�6�']����g3�a$�R�|��u�I�'���^^]�z�dw��bN�p�nI�����R:&h;�Ѡi<�ymQL��F��2��i�����nRd�೭�?�Y��{�M�T5�EMy�ktSr�/N�Y�A���<�����ܡNQW㶖D��'U=f����^?(�P�V��6l��^��Uc��R;N'�]#�Ut�{6a`��b�����p�Z�&�yvW�]�o��A脥���b�QA�M�E�'�S�"��~[ͥ��	v�T�|Gݘ0���kF�mj'��1{2���/R��!`�
�ǎM��2\x���z �s[fs4ΗzE�����O2�:=�u��t����f�����S;$1I\��N���|&���M|�gB��oE�|X<Y:��>U�"�/�<�|����n��;?%&��ɳ?)H+0jpA�2K�mD�`-zFSO&�t��
Y�[��Ed���;vb˛I;��N�ރ�Q�'��x^��>і�1�Q�Da1�Gw�9��T1,&��?x:�u�*,5)I�F�S��(S��Z��U�6ɢ�5%����VXj�������@���TJ�Ǐ�j6��YqB�*x�%��v�H����/��t�v`�S�w��C��[)��(2yq���roۃ�ݐD�<�J��b�:�:���5gd�]\>����B��� m�dC< ��6�wNr��S��֓���腗��~�]{$�������U�OfZo���l���6���̮��Wܨ���."�o�{�s�q��ӳB�-$�ݬ*�\\GI��Ě���y�_Q���މ|����7^�>g����Qhq��˾F�`����\�b����ɐ�x��>����dU8����jb+)L��H4�4n�Ed�"��bL�8|R����Āqe�s+�[,�"��6]� S�S����^\��"кU�NT�t��ޫ8�k�����%pu��!�%33�B]�Q���#���S�p�д�����a���o�Ŋ�n�d=�cb���p�FF�~���WE����z��+ɇ�u��3���=D쳹gXg�ź ��7�vB�0��V�BŸV6%:I��2X��+L鏙��j�2ۧ�59��^�4��ܴnZ�afq��y��H�Ũ=����:����1��*�0�i�%�>E��g��ŭO���l�4������^�'�cLu�V�	    �[G�f;���dm\����tO[?<"�C��+�'�l�H
��K;�^���u�v��C=��3�09Wo�'�&�ݩ�C���V�N�(�녢Z0���W�"F��x#���V�\Z��רz��y�bo�BVrS�A$��*r�{J����v�4G)���@>�����|���IFz^4�ɤ�V��'��G�T^�S���5	�i��f�O1��& ��w�%�4xϠNn�&2L��"���2O�$�4�s,
�� ����/t8˭�bř�9�H�E�7W�*0*H�Ш�&�)gl;0"*��,,c�JNq�jj*�{��5�c��/�E�O�[�M�͟ �n�Pز������U�ɬ������-{쨰����♛�
L���s�d�!��/],�V_�M�����+,��(ˉ�@Y��*̽v/��<�=�����-�}���$s����d��7K�](*��M�iK^&`�|�F�Ց1�r��mЅ�/u��Zr_�E6�(�˲�&�o�;ԭ>�K�0@st֞���%	���K�U#�㳼{Tߣ�I��`Y�0f`
Yݽd���$M��v��a�MS&s鐺k�)wv�yy�V�����H(U�\��Z���T^B��ɁV�tQA�c�,�1���u�IO�`Ny\��Q�'WW��='�G��Gm6�7��J�l0���^+"ս;��r>�Hˠ\�����M�Ff���C��R�;�_�q�@kπ�ԃ�D*�.qŽ���0�	x�/	��us~#��T1JP
F��O襎�_�R<)�$-Lk�*�i�^�e�$(��I>�\�Z�Vݯ<X ��ھ�EF&�j��.���ǡ��:,@I�;�� ��h��SB	RD��Ah�l`�Vj���u�ӯ���@���S��`�
�;�J��&�qq���z�_JeG�m�����7�Ŝ�oAM��C��x��V�X
�Ҋ��؆��xH�����`��I	��Se�a���<����K�=%m�,��A�6���z�a\�w v#���%���
�z����2zym�X-?�*z���2���^^;�Q���3T�5�#KFx��2t�a��:����1f��s�ZV uA�wԽE�6{∄c,f}mݺG��ˋK�� �r�� A�'�q0�S4//���Y	�Lhbe�m�[�"���45e�%ykP���s�� _�L�>��X{씾W+^Xvb��2
�$U����=<��w���H\��O�!>>�ڼ�%��n�R*9�[�TF��U��.�^s�:�;�Ʈr壙o�
������{��#��7���|9�^���TpF�{����Ryu�.�1+,��R��� �YW[�Q���ٔ�#<6��̣o�tt������a�z�ŉ���>���Jz����C?��<M.6�T��.~]i0Wi�X|�#��NB5�=�7�����5�u`��fNi���yL8{֥~�$����zű׷�NsF#��H%#��w�S��𽃪�f߫�~=�xT	�0"3 >2Q��5-Ƣ��ݜQR��ŧa���}}9�FFU��?��u9�{�ݨ�,�B|�l��-�ܻa5]D���O�\�[����ٸ�{_��0� ���u��f������w���v�k�f���L���a��d���@T�%+����΢ax�=��$uS��F��a��&)���p�/A �L�_)���ڤj�ߤ����hl�d����*�X.-Ī�7SK��Ζ�`���v��'��q���Vz��_��	gOq��B����L�'=E��^m�7G��8�kk��!������^�˫+��e�%9���.`�{�壵긿!�@�~��w�iZ���+ Mlg,�����������k�r�H"
_Y鍴�u#M�[鞊���L~�ķlb�L�*uӁ�e-�+�jmJ��Dk[������Ip����F������,K��R�ZU?�D�L��b}�̈2�`��
����g�c��� ��?�3�'{��e���^�����q����96	�a9��<���&_��1���|�!���-'�Q�H�:f��7��S�F�؇U� ]g��*;>=�f���3XJ��-t?i�{��U)��	��.H�fV0Pa��e�?E��sr����ސ@5��pl�?~]T�ɽ�z֚ �Gϼ2��[	�c�i:aP��.�ƣ<8�?��V~]�,<�e����Q���ē����aH�f�K�U6�3z�O��LQ��^���M��<V�)��Ϟ�w����_&a�.��Q7��x���#�|�����c�a�p`H���?�>A�U6^y�d��
�R�lP/P��p�:O+�Y>|0wC��в�kp;�z�rs��R�ڿ?�s.�ż(��*X�E���������R��	7IWo�^�XV0��)��c|}\�*`w�L��h��	`ϯ��ލ\���� ��"Ϻ��.������1� <�<�xQ�j���3^��d6�i���-�z������غuE�%WOJ.��q]��6̓b2ɘ���l<��}�V�ͪ�@��4,�,x����+�E&R���cܘ��������&3�%>����n{�������㵿;�p��±j8��qhyfF�=��Rﭴ�Z�~FuHN �5��i��40�B���nd'��.*мk�,���^^��]���9a�U��p+��������~�\�K��g��u��l��n�_�s=�,��.����j�1|-Fx;�u{,�&v�,	q�a/���~3N�ںRF5��1�0�8�jh��i]LЕ��� ���ճEq$�L���G�g�3|�3��cwb'��S�p��s�Y��J���c���M]�&�Z����"u�����W'C�wG�	-~��Z��l�wF�(L�SŤX=>����Z=2��K��J&z_`�ݬ��w�g�m_G�-���p��=u�����X古�1W��*6�t��Q���[l���b���53㎅���]eޣ�h@�#z3�$f�#	c8�=e8,ɺ<0W/�97y�-}��޽
д����Tqz����QO���������j����/�Q�r	� Sw���,�r|v��'�X_�	��v��@��3.,Q�����0cئLC7�릷��$���r�-"\�?����s��둷Gs̽��~H�7E���&8��蛺X�#�3e���E}e<���g����!�O�9�<����
3~*�{�p�w�aW�q��o7�0g_݇�w�β;�z�����sX Q�f�R��T�'�������M�SH�ub��f����ޮ��ב@?��J>��'}f��5}��"�3+D�tC�ӓV�,n�f�?F�Hr-�� �E&�*.��ZZۃ��ӍEp��tp%d���.+8it���^�7���XC�$�)3��Y�r`:���Ǘ���x���|��g��A�	o�����)*9��L00,P�k���?=� $�+l������d��Q�.]ȴ�
�~�ʘ�D��.j�[pF����Tz{fC4���&�D�N)��m�Ɍ�^�k�n�������5+/0,1���~�)H��N6wA^��u$�=a��}t;�R5��I6F���]����c�<gVQz��Y�T8{٥:nXΝ��܉�\L�l�t�>_�j���y�/�����	�>L�΃A�o������W,�`4˂�C�ݮU���Y��]�Kg嶟¢S�Y7޴�Z����w�+g��h�)���3+���`��ק	5�R��/�sN�P2W���ݗ�Q'�v�i�`��,榅�uV��괣S��|�S.bU�u������.Ul��%ʈ�Q�빻g�Ǽ*��͟h��B8R�fY�ס!�C�h�����?�d�}�wah�D7�Uh������ܽ-�}��Ӣfeͷ�c�铸H�@%�:�����"��^�z���>
��(f�e�dk�f`Nf�=s�4F�ќ����lޕډ��:d��=��}�bE�!S~���o�.�q�旦�O�2�ӟLxi9�3 b  b�q��7�O����^|�w��(h�.7��$�h�����
\4��ns��� 	���v���-��
�\�0��w����R�uvcy�Q<�]�>mӛy�,��rGL�R��/�(2w�;�*�ӽ�r�L�á]�-��+�����x�E���Փ<!H��w��Cȱ�ַ�*��P��`���^s�Zx��ĸ�ޣh������O�HFV��0m����_*��߻��{��rE�;
g�4��i|��X=�K9���皮y�KL}�����/��u���:D�yt���~�K��~���JL/�op*:�Z��;4�TaV ;sAt_���}V�~G_ m^ǐ��f)wY\*D���¼��������,��#J�=�jn���Ru�&�Kz�<��װ��ԉ�N�T���n�r�(=�,m�Qw��phQ��|c�ՠ����bQ=�yd��~��	�'	�|RJ:��g��<pKu��G]�9<����^r�Vzs�|K�L&+�3sP��h\nJ����za��|�Z������hj�E�_`k�?��[9�˫/�I�$�P��R��Կ;Z�Dr�/so.��]�E	�AX��R|Kq�{;a�������Sw=/Ȟ��	�י*�����{̩w9��&AN<UX�4�����_�t�WtH4'�����iͰl���:�/�X�T�-�l���:�j�vO�~�[U�]Uu���P`0g�B��N��������ܹ�;�f��?l|�j��PI|(�*���n���7�ԓV��m��T�ag�Y�:�kg�v*��V6���s;Ց�VWozn"���h3���\!l�_��t�Ο�|y�e�!W1��^�^����Ԩ��:NR3�l����TѬ3x�a=��aў�aF��;K���v�3p
(ϊ����0���F\a��I��4�5�hV�q��O��=�	�u��v���hbqj����4vT�:��,�8QD�pp�{P�}V<S���dM�i��}�a�z��e���񇩤��9�D�����4s�agu	N""I6M���繻�˞�\���3}����V�=�<w����U�H�'��ח��P��2wt/����J���I���~;7�W�F&�g��J�KX<��fz�`}�n��D�϶H]��F	�nϫq\$�����?qn[��B��׊J~����"�#uq73�yvn�,�,�����.}��㛏	��u;i8����<X���|q���[_ ��m{�������|fIsjJ�������{-q_���x3��i�.c��=(�#/}���֝�"�o[J���=M3	�}:Gr>MW�ƻ�E\�k��xj�U�l��O��TD��0`|̑M?a��80o>�H��C�ܞ<s�% ��~�f��()JN8�X���֢�n���la,(k9d�i>�eؠ�A�di5�w�e'�©��V�*�MP�M8��2պ��cis'�/!�T�b�X�v$k���c�X��1B"M#$F��@���h5��ڈ]���m��TF�d��K4�?�g,�ٷџ�1Bџ����3�'�����׊%i5^sx�&�r��[�}*.����~[�� �f�)�y�mw�E�]X��cK3�h�?7d��6j�r1�1��6�/��m�w��+L�����6Qj� ��xGCT����5Ưv�C���$̬�
]�)@�}�'S��{y��I��r3�=PF��S�Q�����$�cIaocZ�Gc����;Yi�B�>ڵwq�3c
+El�l2k���L`d�=b�O{�G�Ԯ�mp�#6�\�-�F�O3�+m���e����3~�����[�U��o������O7��'��K�������mٺ!x�6'7o������-Q��?Q�D��G����H��h��`o(E|����b#����7�ٷ�2|���LcD�[{�̮�PF��#8��o�y�n|�E�n���	�za o͘���6��ϙ��Z��v�e�+w{Di�F�c��F�:R{FU9e$0�7ҕv��X�U��%g��۫�B���f�#(6���.['��2��x�@��+u�QD���Y�b�6��c����ޚ�r����jG����xè������`$y]�o��M���!���>s{��֪�P���+�l!b���'�c�榆R����Yr����'xE�q#�۩!�����Q�;��N,�U����h���?��T�S�Ow�U���"7��Q�͝5:�9u�ŪY�{{��V��k�u���k�v��n�Cn?k�[U=�����~0��$��\v��!����%�z�䠹H%L�t��@���K��A��}��|
�ip�������񛖗T���U���<��h.u�X�a��o�
sS�|D�QBzL�k�ƨ3�4q{�h�\��W0Z��=��o��:�t����?����"�t��/}�W���`u:���:b9'�2�D�q��ߤ��!��+�[huE²u*�{��-2BV��h���&�`��YV|�ϳ�{�5p�s�Z��� ���Ͻ�ww�<�8ĵ�ј����݊S�U��[i}��}�[�4�/�w�γ҂�N����7�B��͉#m��/�7���/+���hq��=Ɍ%�����Zt��f�����/qW _mٟx�Ϙ����;m��Hd\����[闣Y��<#C�x�0����b�(�Cmǰ��o�wf���o���V�	��۞_v��<Q�3�\�v5D}�*�_&Bż߃�l�V��+�b�M��`�h�?�-�xJ���:aW�*l���]�=���޲g��]�C��������ҹ�K�R���7���U�:��-�6�X:��^л~z܌)p�w���~Z��w�X7���V�1v����g�u��ҔA з�6�.�8��TP�ޛy]]�G��������?&���Ik0�lu�l�^�ȴl��P+���0Q�+����]kC��2-���0���s����'w����}��K+�Z�Y�=�ˑ����r�= ��C	�&&ě��qw}7g���0�����O��kK8�C��%�\D��q��E/����qXDL�e��^�]Y�}�ջ<|�,��xcLN&o�(�4�i�۝���}+��������$?`�iNY��esg.�Lk��߸��$��ݷ�D�\�'B0���[wY�� &�Q9��w���p��E����~亪m�-@U� �6�����W[���ڢ�[	�DqB�ߛ���Q�
���Bn�oܪߌaq_4��.?Ѱɨ���fg��9&?[�;~���"���U)[i9���ݭ��6~r��y�����3n�2�h1
l�-���xڣ	����o
���d~��E{��������(_<�ok�p)�t��S�Ic	_j�~C�D�� TY�dUf�"��o�<+��v�wf����mG��k�{��Ͷ��ĨQ�l�ө�,�p��F�ۚQԅf��V��|2��mu�av����������t.��LJVY�z��~Ac�7G�lW�������o*c�B��>���[+K�-�0�􏦲���I��q������mu)N?���w�r5�n���ް��آ�ٛ�*}3���pQ8���H½��
Ƿ��[��Dz�U��$�v�"����Z�퍷�h����WU���}�O��;���dI���_����@`      m   �   x�}��
�@���>ž������Y�,CI�Ԗx�Bz��P�f�0�[U�������%lKAB~9������g/ӢM��I�BF����jn��zlw]�j���*�c�@�ۮw���L&3�*�PH��`��3�5�iC)0�H#�CܩX0��= 2�      N   [  x�u�˒�J���O��	(A��(���k̦�[���ix�S:��:��ŗfV���m.�k��zE�l�b 5��P����)3Gص�B ��K����8�
<�m���en�NjFQ�6��*F��ݰ��Y������#�D�'�L��v$���D���%|KS�PV���[�M�p�%�B!,����*�f�%Ȣ�z�GZ�]��!�W`��SG\�����l���+GCr
��^��T`&O�<J��BV�?���^����Q��E�ƾU�3]d&_������d'$�Ԁp����`���JU"�e��/W⧼��.��<m�ͤ���A�E�#��a��K#|K�|�y��ۣq�-F#��@��+@Z�}�j2&�d���Gő�3��_�$�f�N�0n�+�>����9�Bޏ�N�3�f���V�~-�������3Wb��y�_��s�{�/E1�I�ʹYZvaJ�<$��[Qvg�&���6/1���tF�U��m�ƂFKڤ��$��G=�Iփ���ּ�bM���3�Pf�����~�;��2�u�$���!��A�+'�v�$3����T�
w}:�>�V���ѧ��HNg����W�{<����Շ{9O��Cr+��^��t@mTUx؇��b"(H�3АY��]P�~��Z���qO�4�����P�S\g��k�����e:)\X��}���m-���ӵ풢�<�h���{TO��%(����t�YMae�^}?���u�-Ej\�QMn ����~$-��_�
L�� ;*���&���\skj;)z;m�w՛�P;9$4�~���X[C��ц�%C�=�p���&�A�[�na�y[!�{	�{��'��#Z�m�T��#y�8���Q�G����9����7�4{�������ks��t�AS��(��=~���Z^�����a�`w���y�չ@L�/��� ��O�֒�C餒���˩��w>�|N6��Z�ﹺ<�ZߓkꖻF+���ʔg��Y#�ч��ooU�h�ﴠ�o����v�)����V�ο��t�2/ގud�6���Cա�,�5�Q�%���_�m�W���/?0�=bZ�������X��      O      x���ǲ�Ȓ6��y���c67/	�� �!H�h�B<��<Yu���g����U�Y}Fxx��B9E!�X�Ie-�A�3�b��(
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
��>��$��e,E{N}�	n�T��� QZO����V}�'�C��y�5j;�+ߩ��8��A�4�8���_�,(5���J�k�k���w�FA�uF���aͳ���HW!ȳ��z��6�;n*�w��+\�7۟�}'?<�ެ��q��r����9��Ly��S��+�ڒݽ�xt���s�����Zd��A *�z�'��6������Bv��_zV̾kt�i{��PA�.��\�2��t�U���oJ�=�je�q�Ю��[#�'p>��T���+�M�_`M#6*j���/G�u�RK�N+�Cy���$����y}���%vf8m7U *at/�r�K]]��� Y������(����9�����7# ]dG�a�GD6���_A����7#D����gH=�{��pυ�B��ع�O4ؼ#�\��4]�f6��Z���Լ;F���<]�τ�Ur��B-p%��D�1��$>�|x�5��}��B$�m15��� �/Ct`�*�{�S��� =�©���3���W�=�*�����u���Y�@������؇s��r�Q����f���,�޺���|��!���qK؎s՗��N�{Η����q����|�Z&����0��`]}��W�c�����沶�2k�������:F��ʽ��iyb��w�c���Z�HmN� ̞O˻�>�9��wVȔ��-+*�*��S�ҁ�������"V�~�/���Wx������{&��3Ҫ �Z�U�!��^�3g��u�?ƍ��K[��m���Wڗ���-k>��)�KK]w73��3�y�1�0��h��ۻ�N��{Z"��eYʈEk������y��J��v�>>1����I��D�]��g�{=���ͥ�0��l"�:	�{�[�n�J�҉א�p+h���K�5T��r	�e�o��5k���;�.|��t �ʜ�^��/(b;zl��\c4�7����
N���c_�q�g��;�����%���s�+��cA��u�������o8Y�)�^�=�곈�K.�ҋv��W�_����MQ��8��c�"�B7*�]����?��A��b��=���Ov�=������&��u�Q�d��n�կ"��0 �w K-��,,<�G�Q �l�PW������P����:[�J#vRT�l�ŋ�6չ��oq�]�<� �a�C��ç������,N��3dw�Ehcy���7����g.�u�������<W�����=}Cñrio�����x�_�Ӂ%���ʜ��:3L/g���	�h=,��l�����C~�����|G� �E!��])��<�w���~�}�i=���
X�j~�����t�^�Q/��6!I^����8���d!&�����!���a�`�b��Dڙ�2'������ٳWο~e5�3�x8XӰ�"
۞�_5���	�Y�2�xr��T89R�k�	#�`�G��i�iIXR��*���L&�	��u��
Ĳ�������A��$��O^(f�,-�\P���v��O�7Ϗk�N�uc����	��XX^q�^q��T��Ǝ6�ҫ��A�t γAJ���(�r@������w������2x��L�SÐ$��� U���D>�w>� �PX�d�3bt��k��z.���W�ֵKpk\�� ��s���sTb��_S��T�s�4�Q�?M̢���y�8vw)ćށ��|    ���J�8j^2�t���F3g�LmZ��k���5ޗ5Yx��D>����d����O���1��x��*2*q1�>�W����zk���E[ff�K��� n��|������X�i�ō���bU$����	q��#v� 8�{�^�%FF����G��'�/���m�aϨ��T�B<����s������~W��[�u��q�A�9��O�1d�3��t�y�~E{;������MwW�l�_��r#&����٩|x�ч��l��>��9��x7c�GW��[)g7(�pfe�����s�V�qP�_�&C��e��*cb2�n~E6�ջ�&��S8�C��1/�{�䱢D��Øn(��2�m�r$�')�Z��t�Z�EǠ�x���k��7����dV��ː)
�o��'h3�p�&`������v���pm�A�8�� ��h��1�N��ws�7o��v�P�������d0�`���퓺t�·�?9�Ă�����7r��:{��]�?Q��t�7F�HT
P�ƚVV��(�X����%��Vc�Y����kFcc�V��er�=4nO��vq~����X��k�)�q��}In��}��F��KdݔΘ[5���׆��I��9gl	�z6�JwJ��}E[�m��]��`�,����U�����b�{YI� ..���{���+3������>��r����p���E�����i�����[~�������B7��3-����50��,���ͲRt�#�@������շ��m����[O����>�X��(j_���P}����b�Wyć�Z	o��G�=Fsqd��ye���D������B!01
";Zp�,[��\��\�KG�m�t6wy�,E�`:>��粬̻M��>+66��UQs�AgWd*訓�K�T�L{ȳ����%�f��6�ێ=:�*�N ��7�}n��4:�jm5ۆ��Ҩˁ-S�NhȷJ�Y���{2�^R�6��!m2p��}r�#�����Yn��5���C�4A�m����ZZ�$D�Zgg�T	Ҭ~ϿJ#�����e���а7�$��	����n�(�V���6��2܆��IhH�5Hq�Ce�VMӖ�Wh���g�`uq�"2�N��.j7:ќު%"�c�{�m�2��(�\��Ʌ5�C��y�0C��g�m��zL��E�{g�\����a�����}Ǯ���״��^������~:;�l�9M��W�Zɪm	��{�3��Kv��>����S����](�W�է��V]5�����?FS_gψr�}���~ӡ�����Ǯ��s����Y�ĔYo���l׽�r��4��<�������b������"F��ҬF<څƊ�9`
>/��R�w�6[�1�ٷ��s��(�R�>�f�g.�����r��w,�AurP�A��<dj1��~�qT�,��s��辸'=qM9�
�+���kX�WW�K���J��M���$[-@q]�y���M4,��h�<�[賵0Y9�h�h7��X���ۜ;�F�{��Rw�o��d��M���5���������>>O�9m.s�1�] �����w���k�Y3oR����><�wg��?6ӾLwQ�5�q��K1���U���0u�=�-�mzqj���q�`��DE��ą�����[[H�pJ���R&'u�ۙr��Y�:���w��; ���xGh������7�K�MB��'\�D���d�M����k�CN]��ˍɷ�gᩇd�I��Sc���	^H����|�C��v�E��h�^Nn��s���<��y�9I���W:5du�70�i�j$�X�L����]ǫ�+�&t�^҃z�q|�)pIG'����A��@L�5�QGot����7nS< �Gwt*t���7�V�kߺ\,�c0��� �
�ŋ^U7�v㿚�6����B!��&b�*���o�\���1�쭨ۀO:3�Pv�6��n{��T��:
\���|kⴣ/��J4�'툀H�9d68mZ�6Yy�)Oh�M�I��Xь_(8#ո84��Ge�˗o!�0B,aZ��z?W t�;��޷�R瀸��o�y��!�z������+�8�a�]��Ն1��-��z*a0>��Br�'�́U��R��lj{;���5�V�P�'U�;��#��	D���A.*7�uNnFs�D�y`n�������!-8��ɚWG��8��w��9bgq�wx�HT���۩�F�2�Qبz
����Ǜn�h�z�4��D�1~��.]�¶~�H72AO5�Ű(�G�_1ٌy"K��pn�+ӢE���:YXO��'��T����7�饾j%)����'�O��8˟c4�%>�Q=XŤN��̣���nc��ʎ)ih�O�׷Zm�#���I�q-'0��9�Y6�Eԟ.��?��8s/�ϏBk�W��O,�g�࿎�����dSK��ޑq��d���f��U�%��<��f��|�6����fs�@>gC����q�SS8D<����z+:`b�Xs!Ϫ�i,�T�s���D�jm��uz��7�Խ���$��v�Hg}9B��&\V���:����x���IG;G�@z����$%���*ۊ�OL�:��]���gO�R��ǩ>��6ض�Q�Н{�~f�9P݇�S��2u���[q+P�F�Ȉ㥸��'ڛ�v�U�P��Ɣ�B�I�CÎðq	����nO5������)�{��a�ʼ�c�d�� 6��2��c˛\��W��Q��P�f���Ң�Xf��
w��=![��I�4��aZ"�C���#`�:��P+y�B7m�8�Z��Qs*�:��J��þETX�]hx:0(m�8-��/������n���~�R��rHe+ *ӗ��_U�sM�z�U���qt�����t�t�(+�o��/��w����+ʯeo�9F�����x�������q3{-�|U�7E㣋��B����@L`e]Vd��F�?�2�{0Ž�0�_ϕF܀��=��"F	�5/�� ��h�c?L=��'� @q���ٟ�a�UB��',)5 ^ү��p^'�'-p��-��y�Nd�-w�U��~vO�nw6��zB)d0����f�$,�e5�Q^X΀�o�[�`_�(iV�-ؘ[�t\j�f�a�Dhƅ;^c��׾��W�-�H�n��i�8�l@�=fL<��;�@��g�{��ݮ1�Q�M|b�[�Bf�����F�����p�jSқ$GL��̤og	���!���@��[���Ƽ`�Яob�W��v��U5���3�"��W>sjl���[z*�#"�v�	���K�$�ޘ�<�n��wLQ�u۵��P�O�WlncT�-���-�v'��*�(��jR����?GU)������������wQ�� .O�\�&���X���	E`�����'������8ё?(�R�����k��?�u	 '�$P�w�{�'�|�0��n�u$,;=��eg%�3���U�z>� �_<��'���~M4vػld�3�����ȝ%{����Xi<��Ʋ)N<:�I	�B��@��|s|����Zw��s��~�u1�O��r1嘋������fh�S�Q8�`���������S�2\�v_n�4�g�F�I��
d*{(�Q7M�x�o�H	"�a	�I����P���)���P�����xK�D�^������mTS1�2�u󻫰?(ˢ��^b^u�e�cU������4�vO����
v��b}^�dY�Rt��]���f}U&%�C/�`O��_¿s��1d,Y�)�[d=j
Ԙ
/�@qCV��2��>|�ׇ�z�y}���߄�+���<�%� �½��-jq�i:7�t�qB�	G~F�������y��M1tE�4���O�n}^~V��������_�.��������Y��ğ��H�K7���#��(C�s�D�����ApӍ��ӥC	�����(2�J�w�l�?h�߬���O2����|���V�q�Vʽٶh�*q��{S��u 6  ��*��M�U�q��C�����a?�G����ã�k�ȹ$���D��æ�\�G��	��T��V���=�b(������(��E%G=R����cU;���� �Q�Ј;ͭ����I<���-�daYX|����Jjt��?V��H��A$�¾��lG�)�w�2�����_�~��A��e�a-��ǿ/���_.�w�֐{�K��#���*Z��������0��Us˪��?8��A,�{����ê��`��)�dV��\�O�4E;�܇0��R�a?����4nT�S��RV߁��ߏ�~���g�      P      x�����F�.|L���'E����9��c�}�f43>�o㿽}%��l�;������Sγ�V��j`0Ѹ>:q��?��-"��!՟D��7c��v����P���������԰�7:@l�D�9�����'���~S��4��L�5��A۾���;6�����1�#ʮ�����E����O�`��pW�SW��`�t����A���Z�D�����N�=�T �EɜO=���C[:lx����r��R6aPBV=S���2Z��z�t�I������(�3>���s�[����b=���k �t#{q���=M���ƭ����K�P��Ҝ�G"o�@'��4N"[��B�`(Qە�b�i;v�f��9׹.'z�&��2�W�!�hs�R@xo����<��yN'�p������0�#�u`{v�k�\������/�v�_Y9JZ�[v෶�|���9Pg�N�&���{J� ��'v�\0�[�^ܥ5�P��p���H�`��k�o���X>�N���}�BC�Lvt����.Q���)t|�`��5�� A�(v*���	�1�/��G��D|@P"b_>KG�˟u���&v�5d{qk�݄4�Pb:.Fv���߆}l!�D��xa�1��0��^�7���E�(���;@�֓P��ԏ��L<в37�Rn�};ɟî��q	?���x2a$[-2������<-�nlͼ(9���H�N�(����-��/�C!�ڷb�m�K5�Pb�x&Ol�g���~�����"��.�'W$UZ��;Vk�؉j�p�B��n��F�a���pS�9��-�*O��3ki(r���pu�
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
<Ɯ���4fq����e��mC�&^B$������<9H����!3�K����FJ̔�(������;����JD֛�����-ǘ��|���\�l��I�z��23�I�տ���Է;}�_�,��%��i�-;zy��S��Y͈��^�N���d��<�1c6�4����y=��Y�8峻גP�΢�z+&L�K<2���z�<iGE�.���S��Gf�E)���'(W���r�V��F��f�� ����_`(Qs\\se�=���C�?�ָ:t�����{�9X��̇����t˜4�0�ѣ��M��3�lAs��&	�:u;+�X'?kq��c�S{=��^���$2��>���|�a~���c%H��1��+ ol��r���5�pF�93��G�=�۽��7ľ�!2ʦH���̺g��ګ'�@\^������-J�9{�4[�vrLG���m�r�۫{ӌB	:8�p0�����x�\J��]���f����)�|�]}8<�Zz��z���YpF�yK������ZE��<s�"��{v�N靹aR�Bv�ؓ��G�]c_`87e{3�*<l.	]pF���A 8E���a�t�c�� _�5��^j��h���C��������ݻU(���Tv_*�{\�	Ϩ!ӛ�0�\�[ؗ-�/Op�9;I���iw&[k1E�<��������5:�v��]�Aߙ��B{�|F���~�=u1�\��QR��=6�P��ф��#���b��K��^�׋ξf�M��Q�w���M����+��^��(��q���yӳ
��g9�nW\ԓP�2��{�~�0�~�D����SK�9{:�Du0�����,R��� �9�S�+��L��>T��_�.y;��5J�*����7ۺ�Xh��s�S�^�ŵ\�x�M�I�r�cP�����@	PۣƱkn�~�AX�5�}��	�$�q��>k�!]F�Efe���Q?K����7G�ۣ��a8� ���j��.�1u.����#**z�[�z��s��$\ԺO�4��~J��p����\�Q�^d݃Nm@�y��0�B�q��T�4�&�l��O���lg}D~�W}��K�-5ӓ̧��7�?��S�g[뉧��S�� c�����7���|O-��Lއ�k�����9^�P���J�!r����hy���/"�i8���;����ı�;.'���f.�-Qv����vR(% R-�{�xK��0��E ��آ���Ȁ�x�i��1P��:Tu�,,`:>О��f�&.T����$F�	�˿� \�f����҈Tߣ兑��Ǧ�O n��������b���a���	�ޢ	��xM�6%/u������<�Opn3������g3g,�uu�yԷv�Wyp�e'�WL�؈�ۀؔ_��	@�/�|'d'y����z�!�-�FΪ*�m�\�s}�w5`�\�]k�1���W\3%�ܞ�ckN3R`�����׳�c����>��N����q�;'0l�z�����z�<j�
]���ǥ�- ��v�l=W)���E�`������ԚQ8�˒5�����ܣ�G`(T#��n�ޟw�tO*������6�r�C;�ݾ�p:v�b����f��&��k�d��V.�ﭵ�_F]#
���=��N��_QV��*���65 �k�[5�W;�����M�+��e��\9s'rq�Ep&��O�1�Gv�]��`<D�[������fx#c7o�aS��j���ނ_`(QO�3Z�X�*�p���������M���]`;)]�+}�G89��۬��E:��ŕ�L�ZDU�.��Z���i�Y��?��K���o�z�S�.��~F�e% ������TK�Қ�z��G� �ީnmЄ������=����P� �v;�����L��Ѹ4�������yŠ�dh�<���>�V�����ı�G�[`�Yp�B>�����|8�@�]۫/6]~ˀ�]c�$�<b�x6 �����Q׌B	r;�E�U���I��u n�be8��ow���o�.lݗo��o�-��MzT7S��n�&" .���ǋ5�p�nr���y���҅���ۍ췗����䓥���Ҝ��1zy��G{k)8�0o��$p1��=�NU�?�{�~����S)ϙ�;3*:׈d�A}�l�}����lk#�����B�s��s��b{|<\K増�.0�瞊��w��;��v
�.�!����w�M_��TJ�W~��S?vQT]�\��(�b1��ub,���.�L�����~_j�?�*��M���@�O"�����R �6�1B��\R���p�=��|��>��T:�y�G�Yʱ]+`7��~�\{�[�J!KU}�et��2��	%vTJ��z��*C.��VƱ^��H6����{��=�2�p�EK����tK/���Ɖ����\8�m�S�`i�n۫    ��L�p(aE�j�.1Gt+:a�,����&�{�@���`�(cYF�}��X�'�:�����3���`a!������&��i�A�Z�&`��pY����p�:��%v��m��o���������ÅdV�٬<�������g�fM\;�{��r�E�F��[ߏ�5aPBB�vV��f��#��|���-玍gn��V���U0���`}>C�.��w\���p��$���E������pk5�r7��<`�Vv�V.{5n�����{�C�">L�l��.�wg7@pvC~��9��>�8y���O�>N�6�p�ۖ�;s���rҋ�� V���?��P��L�Y���� - ���Ǒ��[5�p-��;۱3�H�` ��	����E̀[5��T�|�7��C� h�����_���FJ��]�,�Hr-U�A�i�/0�>f��4��}n'��	�G�|�U��{��X�cz2�y��bJ��[^p�O��c+:Ǽ9��.`�=��~�/߃���_��E�g��U>[w͓t���W�iD�L�t$
�(����������O�DGq��d��_;�ޖ�����}���`O��1�{i��F�G��Q�e&\wq	=8F��ފ�.���]�7^O��e�勩��Q~�?.�D���mm��yә��i"c�gE�+N�&�{8�����5 ���v��P1f���π�(��6�f�ٗB<*HME�4Rd��i��\/�u�Kc���~E��,��g(R?��`щʼ3�h�ag���~[Q�V@3
g�h�,У3;َ�#����L]WW+G*n�����D��vi���� Bk}�N�q����M-5�Sġ�p�� d����o0ܸ0�2�O�դ���8�*�s�[�2�á�a�J=-6,��}�̮��k	ߞ�^#jc�F���20ǀȫ�On�'w���w-]f@[�vY����֒P����K]��,�Ӊ�ʞ�nM�5aPB���0���N��u]>�e|Bps�AI8A��z�,��^n1��,�i(�� ��i.��1#��,��r�� P�hۉ�e>�]P��6��+�q��/3������.q�~Ğ�7�k��8�b���0�;�`T�\.	�s������Re��㝜T�%+�[S�ƨ���w+�8�M�Dت��0�lM�_��P�J2u֒�7��?Ҁ��W��%�F-��tT���N���z�{�f�4�H��Ѯ����%(s��\�pu4�ܽ(�
.�("��\���?(z������zq����k_��D��tHP,�=���@W�F��@	�p���3�h3�NoV���8l�B�i5�v�r�_�Y_�
^9(�C��3ڿʃ���n�Ԋ#}g��eE�Z���i(rY���XYDl�L�i`����0(!v3��h���E�wn�����q=	7�%�̋��&o� �'�|�N�1��8�Ru�Ƒl>�2�=G��?�;��zg-tY�E�5�OJ �+���B�v���ѽ�F.zP�j��g�d��K�m��7�~"p����9o2[0�	=�]�{������l1Ö+���*磀�\�9ZX��ˆ�x�m*@֠��lmF�bv�ܟ��z��lV,����P{�ΰ��p8��q8�< �.��N���s��������#'P��x�ى�	@�ǂf큥������e�V5,n�����i��������^�1Q��Ɋ߻�|O�ٲj�񮮋+B��7���;��jn��%.�.�O�R�xΈ�����a>~T�,8�]��||Le�j;ݺ�újˮ}ֵ�O���_����kW�V�X.+כ{k���p�-���`�m,c�ae�^���[ʾ�pS�b����M�X'�d�����0oD��Î�T{qV������u���*�s�tn������A��eO��lJ-	��q����nBr4��VZ��o@�lR͛d����b��{z�{�ܼ��9P�[����4n���:��]K�)8�~����x�)��^�u��p����������r�
K{osa4����}�Qp� �UHן8���I)�a�� c|	�ݝ�z�tm����펝/�Pt�<��6� �y'&��)9���Jd�U�¿f� ��=�)F����QS*zۭ	�	�
�ݡ�I�Aa������j��F�_��ͳAj�b����v�8nUg> ������b�]����s;`6�A��Z�������<(���CS���ݒw���W-��y�||���Gd�T7��^�֚@8��ٞ�����1M,������������͞m�x�E�m��nn��E�w�W�R�����u(�K�?��P��9�W�Ǟ.̆�]qF��|������f������������[�L2����3ctX)6�yaP�އ���C	�z���������!�j}�CR�J��Œ�x{hņ~g�U�k���'�yw��;�D0�G泔��~pf�����Mb�]�� [�� nf�����|�L�	��C��'(B�'YJ�v��v| 3y"�Z�\���$���BE�Fm}�In����I݈����W��H��WJ۴���o8��hI{R.B3'6m`a%�a�/��a�
�B��?���V�䌿��o�K�;{ts�
;X�`V�6��^�X�*�Wo�_dB��¡���� ���&S��d����i�1�G��M�s L�5�׸�۷�~�W}h��S�܁���(��q�Q�P��C%�j�������S�vj-WI�UJ�b-:��bF!w�$�����]�XIƋ�"{CK*��>�[9��=\�s�����@��u�W����v�#�O��_�V�C�J�Lϓ���({�]��f��"J$)'��ɘ�Z$"���\�t��iH�mo`�WD���_���Nw�9��I:�k��~p�ٽ��L�9���v��<ꣀʉ�y蠞��`\�:����m��uOv����=Wr:6���y�xRu���݌�)jZ�S��Y<1������7����+$>?���?'6% �_�xP��D8��-��J�v�pF���཮a(QL��T��Rbwq�_m�zo�7n��6�Q���dR1�?5��(qG��Qq�W������r��e�k\LX�R��y�<b��R�i���@>8W�#�\�%3����BW��ɾ����J�Sf|o2z����\`������q7�n$�C�+:9v�a�nfm�ČND�$���g�6*�$����~M���1���ݕ��J�>��a|:tù�X:��BmD4�N�s~lD�7"�5=0�z��`V�������B��ۨ��Ƿ��������́��`/�������J����n�拌���\�?��4I>R�D�ʢ��4"�Y��w�6�pS��͈�������c�{nѸ��@���L҂1�AN�D�Ⱦl7}_��C	#y�q�vj��� �� yx����༹Q0a�� ٫Y�R�v#�<�|�V[%�u.�l���l�OǺr�UQ���Z�Zl��f���yX���T��^����P��z��Z����������ֽ5*���@	�=e�8e+�p?��t��C�j�D9-vS?��30�#�Z��n!����,(�]���z���ȗ0Al�.��s���iK�W��	�*�S�~��[��%��y��9Τmo�H��A�_o����_����)��'�Ͷ��iw+��k�uU�=7Jļ<{ѱ��4f*��]�[A(1ܮ`&�}����.������t�CH�q�'4���~vV�cD�|�W��>8w'�<e̖����"%I���K��p��Q��h��Χ$!�:��Q(A�S<lc��Z1�$�Fv��O>��}��B1����Ӟ�J�Ai�8|���G�����q�ʭ� �Ȧ�4�ŀ|}��t]2q��*		%W�*<���3���d�	bĴQ��(�/�`0)=w2}��F8q);b��aQ`��#3h��s���0�]�d�ܴ?f�Q�%����p5O�3�����Fyd����G8NW���'��=�;}+�Fi׿�Ԍ���!^����,{� PfzK��ҮlH�w;���3��e��!�   I�.��Ŵ�؊�>BQ��c�3�#�-���f�JD��z����&���h�~E�JT���j�N K�	���0����_��=�o8�6��6)��Xݕmd8�~���垻f.܇�c��s�Ol��S�4����-���yo���9k��y~
-�1�΅��vl��0��U�+����{7 \�����<z�	�d�,�kf�"��t­[�l@��a�ݮ軝�~��bxl"�ס�t����bqq�Zc\���%N�h��|* \�S��\�H|+�?Z⒛L�&�a�K�ù������Ӛ�6���?�	�R�Z8���X������z��߽aS�(|-���p�G^%J�t����S�pI�kFZLA���i����o!E��q";zTr+����j�Օ�v��V���h�K�pA�n�6_rxU����?�ӄ�LO��9r9|1m��N�.���-^�r┛�����V�X�?���ΰ��vw���Q�?0�`�O@�$�O?@��{�J87����:/M���ĝ��P:�w�ՄB.WA������^���h��h�(ɭv��a��B��\.F{d�^JA���PUKq���I���]���r�y��h	��G�-�vR�(��n���lױ��Kv ��~�詟�-p�`�/��>9"�b)P(�DXJ<B�;���(��	8�ZS��Z3K��Z�X���������^
և�_�A�M5��dc�W0]׌6�ʥ���;�Z��2��ų3��j�fȱV���U�7J�}`�B�B�F?ʵ渠վWx�\*�:e~�1����o���)X:
�\/m�#`KWw`L<�=֖����0��Ʒ�*��^�]�R�K�N�馌�u���ؾ�k��G/�Z�яj���+�qr.�[x�?K������6�z�a�N�r�'��:(��M^1��!��%K	�"�Zm��^��N��H����%h-�A��������_}�-u�j[x��v���3̡cңTV4}p�~�w���ޓ_�G�U��F�>ے]J��x�zĠ���D�ȯJ�G�)o5��cL�y��@¨&����aU��l6��T�;�=؜~������ ���X���~�8��Ek�^�l���{��i�=yjd�M��������Ё�M�1�@�zY�Ue���z�5<,-�� ��U���5��N���E.��o���P�`k�l�S��z��l��C��-4ǰ�E�kbJT�t2a�/Z`�ë1/R��i��??�����]ɤ      Q     x���ْ������*8���W1
z&�#����_���" ��կ ��2��՟I����!�;%�ڡgL=��m?��nZ���or-��&́G��A�=@Ν�d:w���@�?���0�vI����?�2�Պ��o�m�l��T;(���>�.�v1$g[m�c!���	Sϳ������#X�����m�t��r�=MwC�׎aΧOx��1(��V�Zfŗ!#]��S9c2@�����R-�,�+����	�엑�.R0�}*l�vڑis�y�kQ���� O8����X;.Q���/�Uhv���	�^A���e/�/s�?�z����*����(�hI_�9���?ꯓJ�++eg���x�=��摳v	<���Ɵ�@���b�*j��/8N;�������Ơ�������Ap�tI�K��2��q������BZ9ng�_�t�r�5����<�+m�#O��GG�O�ߋ;��_�.Z,��;qw�u\m�۽׵��7���Y��*:�O_%�Dđ�{U����S��XGh��^�C�f�Tfw�|/��eM�}��ns�]X�^Eh���D%�(�%���Xq��v�b;>�(� f�S�TԹ����s�I���ow���N���t\aeEn�Z�f�82�p�FU�,[G���r�	}N4�&7��-^�$����a���I�+<,���J�������N�������D� ��F�i�c�H��m�u?Y�/~��2�����*:�v�v�?d�i�Re�0�\g�xg%��Pa=��> ����'���N:��y9!�����fj�L� ti�Ę�B�:���B�G�x�F#F7vC�S����rhm]0V����x���y�fta%L�ڱZz�3������_H4�2?�F��i��H�#nm���-���e��4����f`�R�E3��	����Fҝ�é:�Ѝx������&g���8�m�f�1�V�\� 5���f�rĒ�4Q���X�1�̊F�\�2GW$m�����{zQ4b+*��6tl̶�WM�v�.&?�ɣlc��/g~3J0i�t"ԪE�f��ZQ�����K�ݕ%�qނ�E�w�F=�ƨ�+>�,�����~�_3��Y�ԍ�,����q鷿�FQ��Th��ܵ����ꓨc�%.�G�p��I�tԊE�����`A���w�W�X���띭W�����x=	�̕��"<2��Q�������	r�ݙw/�Y��v}�Ǝ�����C��ʶ�����1Dov ��ԇ�����Մ�֨����s~���h�{�^����(��Q���b��Ӳ{�lO�x=I`#OT�4�=rvb'�c|���S�ښ�k�j���/��4D����t�D��
;[�e�O���7��%��u���/eK����uG ^�H@�Ƽ۰��C��ҫ�z�Q��ͻZ?y߇(C�<�xs�h���P�u���_v�!7�N��N!0ɚ_%��%�Y�ފ�p��� ٘��$���o�d6�I�Ċv�d��2��?��|OP�M>�3�.�F���,k6���-KX>Dg�}MRoHt1��l8�鞷Cs���]MAQ�ֳ�I�H���'��x�_�N�����D��ݨ6%E�3^�;�PgP���Dê#�E$�"�j�u�䇦��]�\��f���Q�+����9�Y[&�s� �3a8b���l�W b�R*�o��2B/)4���x���X*]�V�9����n������jDW��9��M����ҤҼ��q>=g���Q@��D�9^��Xh�+�]��k>���Y��(�3�d�ս�|��f#�l�n%�o>-�;��Sϱ�[�iU�Z�_	?ro�����'�fQX������]N1$rv�c��F���֍ԊVQg�3�S��F^8�J_�p����t4
���^�z s�o����`?(�ݳn�W�`��)EJ���L��~ݡo����jDW@�{F�QRk��W�����z6�?MH����xe�ڱ<RI����l��z*�����AJ&�_��/N[��8���'�JY�Q��	��U7�PE�(�f�CO���m��Ή/ !(�z2Zsʕ�iO�W�.mn.�@��[�ͯF��J�8
��s�m�}
�5�����ǹAk���j.F���d���R4�Dz?�FfE�N�vK�:���9�(�.����ڝ�6��x��;
n����y��(;�����O�(����7h��JV٫��\'4�dҰZ_���ʳ�Ŵ��Ұ���>�Y�24���6�M|=l��tZjkO��k �`$rV(=5����a�O��iob�R2ؓa�]�r��8���(��+6��!bu角v=�IO�Ul皮Fa�9�LѪ������߅����Ե��+*�wTO�h&L�@w__7��7��|8%�$�>#�/z����h�`���5�Ȧ�"�:~΢^Z�b�eR
U�^����y�t�����'��]��&CO548���y����A��L���^X
��9V��CI��=���4R=9�b�"ϋ���$/DwA�C�N�ƀ؛"�1Z��GlAѣ���P\]���&����ĔΟ���ʂ��p�
���ӹ.���"�0�w����H*G��
��q�
�m�`_T{�
"�w�c4qW;����+]/D���џ�0�\n�'%���W��	����e�'�ٍ]ó���"���o|ӂ4��6�����.d�^����^�P�F	��}b��(]���M� ���	�����CcQ���lR+��Ad���S���e����'�Ӛ���/���Ȟ���$�����Z��귩9G��� ?�y���
���~,���IA���q=��A���#���w�����+�{[3wL�׬���s��!#������T�NÀ`&��;8#�?�n�A`�?���O��Fq �V���4w�z��m�Q5��".�k�qf�vf����;7v�����zK���"�sf�	/9���G˵�oǜ@��b��d��`��nm��;l6��&������=짒x��˃�+�
�պ(��� ϗ�y�|G�X;)��P7�#��lx)��,3ܒ�"� �8Qx��d7PG;c��K�j��ןAE��Jf�%_&e�n#��%�hKF�c����TqJ��j+1��\h��#�{�{��|�S&�K���}�����J�/.�N�x_��n�. Y�F���F�-ڞ����̡mg�E��
#�=0#��
z�$�@*��$��AR��5XԆ�b +=������_1+ӅG�/G��^E��,�X�g����]8�⋨���ߵ�;�a'#�Q~>��2�p�Y2*?�a\:���<����y�L�R��D`�r���q�^-�oH���m�r��È__;�>/�����w`1���LO���Adj�/9��:Q��R�9q$Bk	V�/r��� �	�d�=ʾ
B嶄�c3Ey*/C�y:]��r8�������}Uo?w�U�:�M�Vy���4#*�ȃ�R�@6��9�PX�;�ވ+a%A$�LK� i��s����J�����ɢ0������|�=�<ي�w�/ʌ0������X_�8��#� 66��k�П�WX�?��FoM����X����{�up�)��=���������ַWB_!棏ʯq(`rgc�\��s�����B:S-�u��_����u��'�1Z�j���3�x�Eٹ?}�g���R�� �4�d�[e�ڊ*Yɷ��G��c|8&@ގm�^怷ċ����Z���P      n      x������ � �      p      x������ � �      q      x������ � �      r   <  x�m�Mo�@���+�^5����Im�F�ڤ%�2v+�~}�M��6�f�Ó	#g����ٙ��-���L0:ꪁeLF��T� �`wT��pWbV"]�L��(�g�G�1=2.t����
UwRR�H.L�vI�U^���S��l�\�3ϔ���Gv9�U�_���5��l��vw6�WiO���L�گ�긮c�q�Y���o�[�	���a���}b��?����4�g�H��]�A�b� @�t�MM��c����dg�s�0\���P���|�^֣�� �_H�����_��E-˳��f`���      s   �   x�-�M�0 ���:+s~伕S�6�2�؛�4uA��=燬�q*�Q�A�
��7硿�2�ZX>c�B�jF�k2�X-c��Ǹ )d�=ԅ�8�������$n������e�l_?;��M~�o9ь����z�C,���� �>4���؆a|F�-      t      x������ � �      u     x���]K�0���W��H��6�3�ڴV�8�n���Z���j����^e�`N ��pޮ����V^p��'̒ۇ�jLg���M��>�1&�Azy���A���[�e�cs��`�y~�jcdcna"(�����ǡV�lH_���M������#J��-��1A�)ʺ�a��<�4�\��Dc0@��,Mc����15�,V��tU�u?:&�"S�z�@��g����g��Ǹ�c��y9QA�F��B�A̎�      v   �   x����r�0����)�:7!�$;M�
A+�u7�Rl-�!���m�蒳��S�?�Ir�>�ߋ�|�����������C  8""��7�͡,6����[��5P��G�G���1�����b].�qd��쁝��<�,��7�cG�K�D�O��:w��Cx��8���+i� ������
Q��[m�k��U,�06ԗOӡN���1�n:�]u�k�]��_4u]�      w   d   x�3ȋt3���Jww(L�4(-�����M7�H���46 =�	�2�]�,]<�3�RSK8��Ltt-��,�9c�899M!Z�b���� �x      x      x������ � �      y   l   x�t�OOJvM�4���-�J	+O	�K�*�-�42 =�	���s�2��93�]�,]<�3�RSK�J�Ltt-���LM9c�899�Fp��qqq R�      R      x���َ�Lů�)�zRU���KBj�F�v������[��w7�"'B~9���j�!��@E��/�H���_ �
�+@/�*DR ~�o���`~:w���ɰ[#�SnFVi-GE
���H�S���s2�u�5׎�j�k�i�0I��Nsù�pm�?�\]�W���T�GɱB�����C����|BF���p��G�)DTD���Z��>\gṡ�em�����\�1�$�HH5p������e����i��(�*��5p�v-@6d�w?(R�F��6��w�Γg���~�|)������(�
2���>��4�(�Q���x�[����ޠ�M�j����x [���	V�(*�>fB̺۩I�,F��*Lu�:�o� �mF ˠ�LpDY򓆉��6��bc.,��'*l]ޜ�t{�IWA��j� �����|�|�����6*�Θ���:�I����[M��
�4�x��M3���	��~��sE�������$�ڬŘg�Zz,�q`�#��_K���x�m�d��]��&	Բ*|T<�ߚ��(�Q��mv�O���h�#%e�]L�`ujeS�Ź!`&!X��D�≛@�O�k���Ӯ؎.��W�]Q�����^P`�`B��f
�-���Dx��E���4�8&�}ao�%�FG�'��|�\KH��]��<�S�&b�i'$��\AF�Z��"�\��ca��=%��>5n��^�<Ǐ-9���ʾ��b������Y&��8��	)�G���n5�}��S�3�Vi��
Z|�ܒ��n��T
����?@�k�<�_lJ2;���ğ�%�b�=}[zk;(��U�����,6��[�#ཷ����MηJbI̮�j����9��t�<b�vC�ǖ�4>��}�������Fބ].v�7f�i�%3���\��E�ݎ	~+�|%?���c�	���1,��۵E�����驢O�02�^�557��U����i��StQ��P�w񶺯��W���KE(�      z   �   x����
�@E��_�(3^}�"�2�L
)�Tҙr��|}���^��a�Z�ڕ4]�M�JIhX�%�Dx�3��?��#t�GYd$I$�H7U�Tl��`�6l� ;!�r_���<>~�H�(��r���R3>���tf��@��r�;�%	��l�~���n�c���}�8Y5��!g����~�o5EQn��Vr      {   �   x���Kr�@���)r�y���f4��`��Qn,0>b$�U�>�r��^����M����s�.M��N.�?��8�I���Ԩ��%�#�j ��F,0QL(.`� �v���>�����i�o�����3b7����_m�V�^m�o�"0���t�-z�@l�Y��2i������~�z9��"���|��=<iBe����%p���抳+MZz��<��[�      }   �   x�ψ0�u�	�4-4�(��4��ÇR����S���2��CC9��Ltt-����L@�8�����3"��$�"2;/4��"���%E��h�[X���[Y��ԣ�hfeh�b�!W� ��1�      ~   j   x�1N���L��K�)2�ψ0�u�	�4-4�(��,�tO���(�1w�����425�3 Ncm���Ltt-����L8c�8A�L��c��b���� �,-         ^   x�+��*1��s���N�1N���L��K�)2�0�3 N#�j�T�Vn���id`d�kh�kh�`hleljel�������� ԕo      �   ]   x�+Mu�4LMɱ,�*6��1N���L��K�)2�45�3 �Tc�b�԰r��@���PN##]C]CKCc+cS+S�?NNC�=... U�#      �      x������ � �      �      x������ � �      �   �  x���Kw�0�5��.gs�$;-U� ު�3T�K�U���'��
xZ<�f���#_�+��G�)�����B3@kQ���S��Tk�j���@��{�� H^���Ǡ! �4�p���@=˟�[o8Q͘5�^�vFY����țx���������v�Sb~$ �MS �R�n�$1&ݳj"�?w�^���xX��!Q��D`���@�� R�gH��K��aw\9<W�?��;�������9Ja�e���{�G�>98.lr�=T0x� ���	�c�2A���UAQLȌ�8��<vJ��3�5�F�*�ϣ�<�1e�� �z��^=�+���f������Cb��4�Ꜯ��3g����٘����h4Pd4?�)�!�?���Uۍ���i�zŋ�3&�dQD~�9^���g/��wZ��5�@Y酃�8�N���bcM�*�����"1�!MT�u���Y����j-su�~DA�(0hu�n���`Ѯ���� ��<0�l�ρ�Y����x(�2$�X���/x]O����a��~��8��|(���g��a�X�-f�����9�o����)9HG��)S��汕[���o��U
e�����Y��\"��';^����-��
��5).�b!\�"���]��y�������V�i���҄�n��c��v;G-���/�ќ��>g>v3_��S���?���&L�O      �   (  x����R�@�����gwY4��3���0ƛE6���z��љ�i��\�9s����a�^L��_n��#�T �1B@���������J˾uǉ+D"TG���̤�P0{ ��tUŋ�:pGYj����4��t�)�������fb��M.U�z�J��Ŝ�&�0_AE�X���
��K��@:/v����d���1iKe2��7�.�2�M*�����rx��V����i����;���^�#�՝�t~��?d�ɼ���-ȽW59�y��*�b�����i�7�,��      �   x  x�ՙY��J���_�圪c�nv��W��r�(.����f�$��$cfRǱ�j�V������n�V	&��7�I�f����R�Z��>[-����{�vp�v �9��E2��,Ӿwl'n�����?-��֩�%��t����'����g� �X�ۀ�L�������f���C���U�Eg�H������,���-����X�J����:��`���@��mT���pܔ�*����,��%;�ZZ@Ѩ����5���ߎ�Nv���'�V���nm'�Sj�A� ��4jߛ���N7��q1�dU�9Wv���B�T-�^F����Nz9�/-�����O���E�C�8�j�M��dB�pvp��=�`�皨�L���#(h@9��RQRF��.�L����Z��}R��'l$��Y���=C^���]�_��Yeyd6e��Tr ��}�(<��`�L�;�1�K�M��ҭ�0�Ib��Y������5_�1m ����QH��aԃ�O`�W��KX��6^�{?1Ǳ��\��,��3[ѫ��'�	v�+�\��F��:Y�lx�7�U�{ӌӂ~�O���u.��.[E~S7z�ʉ���yKy�r{/$����P��0��R���f�!�1�3�O�^��}�6��E��%�RE���JT��X�S�w�-�̒��hv�����<�F�Ƃ�,���H�@a�=qM	��E����n�kƀ�!�zX��F����-ٲ��;q�r���7�%
���rl��r�\o<n>�_Pr���l转@�B�y�������?̹*/ �������0��FY���{��o�kuLH(�t,���Ƣ�k<�n�6�<_ň1�9�K�iG�#����#�JٞT	A��w���L����.;������Sv3W?2J������p}A��Ł�̜H�-�u?9_����'�l��Y
�` ��] �����tL�t�B�A{P�\�����]h�/�o��~��:k��&�J����`PP�l��Y_J$�ʭ�����.	�B�T�M�yIm;���7���3u���2/��>�\o:$��	���H�ż���A/�	V�<7��1�_) �V'���a4��a�~^��H���=�%����*�!�ⅻ��Y���&GZ-����͓�0(LMQ��e�z�
�/>�����]����d=�/���*FN�l�n�ŴZ����I��ˇ�O*�. ޮB����l��1E~�
�<R�f�;L��ޟ"��N�2^��������f%U-�`�� ̹��{���R,���݌\tQy�o��z�o���ڿ}��b ��Rݮjy�re}��z*ؽ���$���x�����u0G�:f3r�p��?~�tww�k��      �   �  x����n�@E��_�H��L1����3)�2�v�E3��n)�)RoZﮞ�nn�����ܘ� �4�ւ�v��c�u�`v�a�^x��̭��ņ
�x�`J�^`R2X^5&H��x�g�}u }ADx���OXV�Ԗ�%_�����WGz�T���%xY�ѹ�/����� �����3���UDT*���p|^�#�	3�2�dZ�"��8�Ch1�o�D>%�b��p�;�`�r>�}hc���l}Ԗ�/v����ڣ�=��4��&|F��u�<(�����J>����>�^��)��� �I'��%It5r����!�6�8�Ood;�/��y�쳅.��!~���pv�e�veX�҈~[�|��y!���t�w��JȷQT�ؗ_�����_      �   v  x����r�@�5~E~@kFv* �@y����A����HvdAY��S�ou��3>�R��-�$cZ�i��^�L��c1ĽX^c�OF  u�EP����8K�4~���߁�N�_!H$E��(�z��3�v'9>b��s�x��^<��W�HBSGJ�)~�W�x{1e^/"�=z�嵋Y*�^���6A��L:X*4������s�x���6��<�E�٬����tq��2��ͪwz�~�9�%��wfc�&L��ω����L^|ߴ��ᡀ�o�e���U���jt�����z۟�Fߓ�<-0����gu����Ȫv���x$��r��M����jX'��N���`�޺��Q�P_8�L�ﭠ0�_�n4~ �SM      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      S   �  x��XYs�h}&���SO��a�*��	&�@;b��5�}�3�qPlE��=6��{νͥ�v�TP�F�
`$�8#z��H� 2����DF�I�S ��j�C���2qW��$*dsi�hyjѬ�xm1�3�`�@Xc[to�F�Zy���Y��]�:������uW�������I*��7u(D�&�<��eݮ w�Κ`m������UO�� ��C%~3'�W�v��(�=g�v��Un� p�R�.�<�����!��!q���bCSw$��ɔ6��Mkmr���;l�����к� �k�
�f���@�n�[�5�i �>@�W���V�i��t ���V��3Wqܝ�w��hZq�Yg=��-Bj3�ls�^� �0�ØY,�����֫j`Q���/����5�Ո�{��@��نRp��,��	aBVc�d���b}��֐c���,�N�,�o�Td�AQ�t�Q����;��?�l�M+�Kۼ�Ѡ�e�D+���x 9[��J�H�ڠ� �۶�>m��ax��K��P}�8�����D�g����^f��/ה��yy�2��BѶ�&�MK?2sm'9QH|�{�_����Ң7��p�	���$�Yc`f�A��,��B?���d(s��"b�n��̩W�;Dp)�V6���[�/�_�w�{����D�'�K��8�A�J+
(芢�?H�zD�����9nȨ�I^ÑA0�l��z�������*�yR~�̀Ob���^hmm�3خ��(4ゞ�����c�ݣ%�B��n�0R�8O�2݃Y�&��")6	��ARn.9{!WDZ_��(�v�o�W�����h�cK�t�`�:[�<�}���qI�V�vyAt)�_�Mݕ�A�lkJK�Ҟ����w��w~29V���Ot�n�3��9��a�=�W�,{�6�zC:����l��j��n2;�2�q��8x�v���n�B����"���,��)�JT�I�nv9DɅ
���w�|�Kى��Z�1*��, 1n���
-<_��v}����hc�JK���
r	��/@�Q��P_ �^��UH���4�+PpE𾰔bk�+@�7-��T��Y�/D�V�=�L0_���P<<�c�����`�x�q��=�m����6��SE�͏��8�@VWt���@�V��[�"�,4٣�:�>{3H�
�>{�	2Sevkn�ڒ����뫚�2ۺ�Xv���5� ���P�D��ܖ���ܱ\d�tEToǆ0�6E��=���КSdq����"v��hMa�`NM�d�@^;o�������*�~��!�5����e�+=��� I�ӣ=-���ˇ3��X��h�6zN�u�܏�@Q���6�b�m��㱓��擲$�P��8�E���nɋ~`!W�'��4�����,��R�h]�፮}�]�7�>�����ͫ/����8����h��<�Y����T����|��0r��!;����'x�f'x��'ܙ	��{$��$D��a4A���}��]oL�KyeȜ��������;F=��|�N����K�&>켣��B��S�l���We�#(���Ğfq��UY��Ķ������$�$� ���=i����1�ash�l�16�������7�q~��S�5���Ms�}��ڛ	��}#ڲ%�l�0x��K�hM�N����$M�F�7G�O�(�k&�!�����d
E �A@N2m���m��C�+���x�����nyu[�9�N	.�z��˘ 53
f�ȉ&�zpu~u���2���� �;J��zswUϜ\w0��R:,e`��S�u����e�y�2���W�����t�������I�"_��C�zV�7��&ﲹG��}��c�kR��'Lk�Q
�c ��L]����Ѽ*eװ�{�_;�|�ñ]!|nEz{�����6�!�U�U�L���L��v�W(͍|���o�o�?N{}�W1�)����3Vt�E�Y����:N���A���B�܂CH��v���Wk�����vPs+ �G���徲�(��n�������d%���*�?,���ԫ��������x�O ����=�|��p(U�ƞϬ��ᒀz�6��Tv*����D��J����>��+J�t`]��.4���[�Fћ��)E����(��	�6� ���/YU~�F<Gx�܃!���]jG�ݧ�޽�7�]�      T      x�͝[s����ٟ"�{W=�ߜ��$r�(�s�"������d2���z��*UT*�׫שW7rV9��|i� �+�9z*ѩ��Y����b �^�� ��,Xg� a�� �'y��g���|��g{F�ۯf���b��/c ���I�X��E1�p�p���(�&�@�#��<A �P0�� =��-�I0x �0 �:��3L��E�����h=�檒+җ�q����N!�N8hr���>:U��z����y�	�����r��[c��*/B����z
 i�� �Ь��� P� ���O���� q{���y|�օ�Dݶ�K�Ws�j접��DH��v����k �7$�����ˀ�j�k�H��)g�(�p挊I��_��h��s��E�={���X}p�Q��+񂩌ː�uQ6-�_ǏQ0��'��f��Sl�y��l�	Mz�'Ԁ��u��0�_��k�,��0��y~FG����e��
�H������1�ߦƩ��t%�7�ό~�O��R�����0�wH��qѬ�bd�
U��o\��K�D_�H9�p"�ĵ!4�7-�R)\-�'\}�Hp��1+���o\�5�wu�F��H@Κ#!S# O�7]B}bw��IYG��I8��'u��g�����	�k�ld�l�Z$k�ē�9���T���>z�!"o�k8��+�~�G�-�AR�x�#��8F�Š�7示����a�`j�*��D�:(��Q	���=[I�3����)�]t������z%�e5w4r�2�e��H�z�� F }����R�{āQtk|;z��9L�� yb�����K��F=����{��Ԗv���D�/,�#�͙0�7�Z�3���q���ղ�F�"k����)���	#���v�Lnvg�MŭBcld�D��2H� %2��1��4\�&����$�_���x�|S�K��:�q�g���b�u���a�ۙ���q���	��Թ�o�T�0F��_���FB���#J�ܥ}E��#;\z�� �����:����3�4R�j�t���a,I��##�+�Z��Hg��:;���:�vv�8u��ΡAj_�t�3�!t䃵�=?�v����MXp�&,㠇�<#g��ֳ�����C]��F&0�]�O.۬xP��&��A_A�jk�1��e��%������@5u���K%8\�|���e��v�6�lQ�u�2�T&����r�i��-�Ԡ�E�O��u�-��Ҭ@���(3Z@'{]6c@ : �E�b���:Ƕ����դ���A����w�^�=��0_6�tPKX�p�<���y�d
~��-�3[��I�-&j���@I�}�s�%���!���a���
������v��|Yv�!sz�� M���
0��`�������g��v���6!|B;ޭ5���ӿ!���1�d����6�u�+��?�*��厠i�T�uf�6���ϯ�ӿ�î(��	�֥/������}�/�h�q��}�>1<m[�O�B�/�'�5+;�\���Eo���T�v��;Ҏ�Hd���S��|����Ћ�Hk�1]��<vt���hy�R�N��wZź��s*�/�qpBW5�)ߌ7Xr8�#��My1����7��� d����݌v�����{��F�e��#�v�_���%s]���.�ZA���|�uEY�
�o����J�=�?muF+��bW���a�J9�_e����p�g���k�䐬3mnӼ$���q��ꕵk�=��?*�`WЏ#���'����S���y�A��؟�;���Z�g<�Hn�in��=r�o:?ٽ��U�Eg�k�5yb�*��3՗n%>-�I,#��$��c+c��X�c��a�	36('���h߮t�ԳV�F��n�n��-[�^>�|9f��<CG�|;��1(ȳ1�C��-wb�+�p��O,�w�b�Y����X/��,����bˌV�k����� .^A�=d���KV�[+2dMUS�^��ү�ގ���#C��z�ؼ��\�4���~��A����Q~�M�T�J��Q՞o��;^8Tq(0�U�roƱ!�S2��jD��%�U�釆���#�7�_�y>��g�X%����W\�����0h���D��t�#��0�Ї�!۫�Q�&6S�$�>^R@@�����~‏TI�[���p�D���S�I
�HP��%.�$�BX��1�c ���ғף�2p��B�x�>=�3��!AU�[��*9v������&.����袏[�� IT�E��ٛQ;:=h]T�(�5]6rx����<����6O�0u5��MT�O�qr��7;rҁ�v��1��nyr�m��_��ݞ�f�=�C�n���tM'�rz����kv}����W]TY������[C�T�����<��|�%A_T�ŘVuK�Έ<�e��4(�klm� ��R�!lvs�$M�#;�	'!�i*m�������gZ&ۜӂ6�9����_�"k@�*k�Ya��K���ֹ=�h�v���46�б�����WG��M�`�[V���A@�o��X��ut^��N�#/�
�]g5�xRE���S�#��͜��0n�x�w`2	4�����Eb���{��Q����md����jˠ:m��U�Ģ�TfDh�k�|B�p���[VTu�C��4�o���-'�g.a��%��p������m�Bc�-ő	�@��!�Յ�hF�j�$���7R��r�=�oy}�nO�o}�Vϔ���4���(h���J`��ڊ��vv�EgVҡ��3D��}���.�WUIc�)��FU@Z`�ę����M>��7b�M5�]��
v��կ����>�Tlx'�����,Ӛ��X�xX����u�~C�jVA�Q��x&�Ǉ���"gbp$�Hi�\�������q�і�B����;�V_�m8����������sg�U^σh�������oc�ȉ����5�Đ�����	�v��u�7w8[���	�R�hWd���mznb����4�`H�[B����_���S�_�m!z�n��rfԦu���((pKQ��<��9�E�G�~��4�>��!�A������.%31g�cbLp�h\�S�[�L�=��*8�Ӵ��1к{�g�"f0/��]K�~g�".Q9
9�Uw{��a���5L�0�:����V�D���z�V�3����B���٥w�iT)��P-��[�AZ��)�l����K���
�>8#��m7�娅�~�9҉������w�;�(�r�jv���T��{5� �|]S���f؂�ǯ����s�Cf�,��o�����ħH�_��}:�OK����84�FOϝ����xE�#��//2�9�d�n��8IV��a�	�b��=��g�[�ٰ
Քӂ#�/�}/�Q�
�e�hlx������PI �rI�}����WKg��Кu�F���j�BIn�1>&�x�[	t�P��b<l�Z&+���,���>�R�Pڛ
�Љ#���di.H�8x�N|�O���|`�a�Ч/]"��IZ^
9�W*tḕFڵ6j$YX�#�/�2��FLv �� �.k9�B��ݽH�Z`+��{�f#��D�`�;1Ag�϶����59�13�9�g�l��Fe�.�;�K�y;�⊊��=��s7���G#����e�c�k�p{�{���@�=��0"�m1Z�5B��͙�=TSh)yw ��yt_�5B�v�S$H�J�ZC\}� ��&��ZC:c$�	���*n.�c�Zb%Wt��0�%w9�wz���!�Q�ye�y[��1�����<R� jIѯQ�V�Ը�Ԓ�~~/p�[k�0�Ba�KX*(a�^���j�1}�\�)i�lV`�8-�ߴ������%��<�#�m���؅�t�G�_����Kݿ��}μ_��)ze��g����U��R,�^0��c�H.6r� ��`j?���a���k
!З��^N�w~S{��g���^��$�nW"��e��h    ��6
��!/�v��������;ȚBC���]񮁼[v��I�ܽ�h���Vi1�8�]�AW:�݉[��qj�>&�XG�{�"Nw�ir��,ش>b칍��?�4�(Ba�Nf�����:B�M�d�S�{�9:�@/F��[{���3�2c�K�� ��N�#�k?��\I1�����^ӎ�\��gq�h��,�/Og�s0�[���=��b繏�m�`�ꆄ��P�a
�,I�
��%#���T��!I�eW�{���p�̟�D�<�66�_Z�?v`�-ZW���F����R�v_F��|.m]����.�������dϫ`�tTݕ��� ]���̷3���`9���*��$�\-O�����mW�xDs��Rn�x�d�tyY�:F��nK�.lu(�V�#|�5���vV~.�m�h���r
�XI|�܍��ꢻU�Z�ͷiS\�@��ѽ|f���A���m�m����!�2v�N���N8�R�����%�]��(��U��	2��[�vD����9t#����vD|�?����������/䥶^�9E:vUݠ�;����I9�;_�}��Aն�+!T��2��  I/HۼTH2�ռ�"��F!֭6ǟa��4Q.���:�%w�$����m륛������!�"t?:6�����pm���h5lL���v�zn#����$Ɵ���W�h�'�~�N���|.Xm4�y��e��d33,%����`j6X4�&��Uv�����"�+��\6�&��U6��6>t1�O�}���
bQ����V�&��Z����>?��95ec%�K�~�w�q��0͒����υ��&z�+��5�$�s��Y��_�\�G�Ņ��B�k[�6P����r{�t��%!���s��d�G��!��vA�9=7x�+��\�ЛK�|�����������a�e��l��&���v�q�ў�[�<^Q4�W�*8�J�W����*�ŉܫ�tI���o${��U�a�o)�G���� � m룟����O�6�껅)_�x��2�;�{��#���q����ftZ����Ô��S"a��F�&���(��VΞ[����щr^/�	�:h�_ u���-*gu\���`e��ڤ�,9CT
y`:�/�eg���O�G��f/~b��	k���r`����B@�	}=Mݾe�	��Q��g(�|��Ռb��L%�"U�M�����Ŏ_k� O��ޱViMм%��hC~���I�A��p죛˹�+p�M@�w5�j�!����6�ƒh�WrP#M`�mZO�AO^L����``���.:�2�ڪr'�a@��D���>iZ�a�a7|@eñI���)ɂ9��F;kr��f�U
^.\TS�f��cO����)��ݖ!c8�JC�]���ܞ|�wdד�c(E�Ĺ��ML�+��a���g�����?�W���c��
�!�#�	�{��!q$�1�Y��	g`#�����(+���h�)����g!�+ȇ�P������xL��f���R1��f
�3$7�������.��s���x��������l��T�GXg�/mw8f}Y�M��]����;��C�U~-��� ���,�l�!o���!^�_ ��3��bŗ�Q��˿�
�pli+~F�ʂ��DB�0��m���VY�%�b�pl�Pt�����?���wst"��!t�Z��s�-�H
�g�9S&J���7�l�ZM�5�� 2 "0`�mN���a�h��ۼ��< ����Ec�&� z�"�pS����ir��Qo�D ��&� <2Fo����5C��)�x8�ۀtlif6��H���-�v��p�҆��Tl<҇��T�VEgU��Kg��m*s=�`��=R�M����Y��U�~�~�`��!���-z����sZ��%�(1��E�c೵-�/8`ʛ���4�,	��-��5�`�p��tQ��<AR�(�ɦ�/(�y��Mb�ӎ�v�̢�Z�/�W�����OiE��2m�89�ݞ�BZ��Dr���}�_y�;����D�1��0i��|
l�C�m�ӖE�� �c\�
0�dZ�C���	��N����1%���R�x�g��R "~B�tҬ�2Y^,��{�d#!A��n�*�l�i�(y:��� dǴ�j�r�ur ��@��U�w��^������)u�y9ͧ�|��GH4�1���� A��#Z��d�:�X{��*D��d��L���2"c��ZD�[���!��-�Z(�)�zn���"�¨W;�X�{�Z���R;c�kƖ�KF�J�-��5��	��ܢL�n1�7"j�U�i�r�t�9:��H[=��7g#'��$����mf�R^�"�N=e�D���m��]�oQ���<��u:�Bܶʦ'���I����b�a�e��%(`�X�:�t�L����D�?�������<�ؘzr>��z6�۹��Rg�\d�Gc�^�>����B�C��n-��T%�^\y��k��H�#9��ʴ������:�?��׳���Iܗ�F��cI�܎A�?|*��d2��$�}��c$o�Y�j��K�;R�m�/5�GS=a���{'oG*ԣTь�qF���s��#�O����ӏ��'+��HE{����$�*�T�;R��,�8�X�OV�prq���M�G�J �s������up�?���C�*���f�x�~_nx�l���c���􌐟��^­V+�zIJ��7Ͱod�d�6»�9E9�>L��QO�{d�d0�0�g(~*�����^��d(��E��ˮ`�w���t�4���a>�n9d�mtK���u��0�_Ca��K��@ F=_��0����/��f�������ҟ�c¯�-�
l�U�W�w�{]a��+8�ۛ7�g�׆%�`��I��X��3��K�]����� F�1�<[��F�6�z3Z���^���Ǝ�!��0�H4�zQ,���Ė�E�A�A�.5*��xj$�>U�����y�R������:�9�/�}�1�s�7��-�� {p ��5-�4�_�d  �mc�=>� ��79p�2�8�����Q�l@0�� 荰���!]�
:x؅� �:}������ ~�Æ�J*��>�_�8�� 0��,��T& s,��2�a ( Q]g y�~d�*T]��EL��S/)���nzl=�x4��L2td(B��^��>��أ9l^l�!������I�������x�.BzU�;�E?uDg/@�"�#��[���"�£�Y��7����z�-���h��&N _Db���>�Uf���
A�;���1�|>��߆�ʄ��.�x�×�b��Pٺ0�����(@uV��^K>c!Á�c*&�f��mQ�ߖ%��2�!ٙIǊ�~�n�pW�G�F ���tT���H��o¿��I��'��D>��j��(����4W�5��G��u��8Tw�-���l�3_,�����}��W��A�對�$"����#���_^������A5��8M�c�G���Ӿ����4u����o��-Te�:5I�ە�[�� �S�x����\����H�袕�l�u��z�%�����%�Ki���/������qu��\C��M�c���1b�+<L�\��H�|��݀Qk���<������9
.�o���%��}�=��`���3��觗J�V�r��7�fY�G�7Ly���\)H��C(����ד%0�w���V�~@ �)YՖ,#\�Ο @���D8���j#.S�ri�'��P�Gw;��J�H�J�):�Dxo^��9��Ħ@��8�dv�&9 ~�������"�Y��u�V�%{C�I"ޟD7/�q���)t��Z���jn��� XnNG�Qel�D�?�g=^,��U����q	�?��5��1�g��1����rv���ja�)��&�X�<;�B�$o�d�H�9h����ȿ�gr�:��gc|�أV��I����@�Ж�$�菢�]���a��zb�M{�1�p�q��^,��}z�;sy� ��J�m���< �  2�QYW%`���Y�{�أw�ʂALЮ�b��O%��jP"�F�	=�Gsj�أ?{T-�����z\6I��;^�FHS%�[�Y���c�4���>���6�O%���\� �d%��n�أ�I1b����!4J��;��i�q\8�I��۟�$B�Nz?�m�ȡ�	�-�Hڿ���H:�? �pd��EUg�ʢP�Z/T�/�9QU �aF+��d"0Fc�u	����Z+�������8�������_�`�vw��d�)� �!3w��f2�0|8��c+�K3c�;^'�]W\�pd�F�<D�O�����Ǡ#��n7�i�������W�(~����"O��C] y�a���y�������k칞$�R����Y(ԣУ:�R�}V]X��,�Q()����)ß|r,�gO{��1�]z-��g�ut"sY�>�M����¯1�a.,]�+�/�UE$^��I)��0�v��;S�S���q�xN�ܙ��t>t�@��-E#�Jet�,��ȵ�)�(��P(G��H����f�f
�;ܚ9�i��smO�g�Ό|A>P �{���+P��?K,�>ϟ�E?��w{�_@��U	'���*�/!:[�~?�"��u���C���t�L��𱕓�$��!:{)�~��� EDN'j�*i����&�o�~�����\n���������ⶁ����g��2��Ќ���׷��I�A�"�-EA�~ޭ��m�4Stu�+֚B\"[��rfc���)�z�i���a���!����f��?�𑢵�
����E&ؒ?}��^����T�@�2�4r���;�d�Y��Y��M�L���o2;}L��*�c;�@���cv��^ka������Om�(Ꮑ���>�
�j���вς�ю�"mWc�e���|@�2�v<�+k��D�HKv� g���CG�fxl֍]5q�`�b��W������i4w�;�Z�Vu2d��~��h#���Z'>��/���vs��k���[�-DtP�j�d!)F�G��퓝�=x-�Z�C�<�W��2u�d�`<���2{� K��.t�j����o���a?9KP4�-M�c��{�}J�%qi�b�J�m>�V~K�z��&bvQ/�:;��ɺ�]�[?�x�vMו{Z��T�Υ���s��C��cg=[���XG;9�=nLq]+�[�k��(�����������X��e��˪[vi]��3��0��K��d�ѵ�G�8����9��s�5Xkγ]W�7���}hBaJ4���}#Dו�mm�Z�1�&�R-&����� ��n]q`Qp���"H��Ơ޹��:x?��Z�t/*������������)\�%�����-ٷ6MM� IV�1f���~�o��r�@[7JM�D�s&�Ĝa�j���q�9Z������2�4�x�cA��k�.��֭����_����R
C�      V      x���ْ�hF��y��Y�<x��� �D��,(�2��'Ouwu����.C� 4b���~�{�2�Y���O�嵰/h�x�B"�-N��s���� �*I^�#4����*�������}���֕*-�� �.��J۟䣦$����D���xC�7��R+�X!8�n0�o�򂶹������C��"�D@�J���~��]��{�v��j�cq
���vt�s�]�! �5�I��D��x�11#��L�^Y���sd����I��$���=���}�%�B>网w�9����ƺn���{.�V�t�Nc�' ��&0�Sgn���s�F"3�#�%��O�ʏ
���;��+s��<(g�B�D?��+}N;nK�6ę���j@ gy���:�XQ��Er�*C#5@ͻݹ�GIA�N�x�}n����(/� R]ۊ�����K���������@���Cfn��>�b+��	F4�dS�+��A
`�AW�V(Dnb�@f9S�;�$��L�R��Yu��kӳ?*2a����/=���؊ �p��JaA��]Ͻ�9������GN���;�M��;���Ҳ�'u/"RuD�J���mž���I_�������V����I_8e/��|�����7�?�w��*W�Ӌ�1�(�����#M�g[�83%��{�w����=XX����ήհ\�
������ ��x�Lt�(��������Z'��e)���J�t2O,��.P���o�!��OМg��f���Bb_�\��|am�!5�в��̸y�gM��c�F�O�.�Ҡv6��!��O�}��$\;K���e�#�>�ax���p��,�/D�+[S�h����L��	���Ib�h�p�	�a�5Ҩ9y/e���)����,t������]�j��;w�.�p���S,#�0���d=��K�m�&Nll��pIt����u�xُ�䔎g@�}��O��,�
)3���DD#��P\�V��Ӏ0"� �P�q+�
ÈZ�i�b[+L��-E_N�$�a{!����n8p3�4�[�((F�t�B[��B��T��:{6r������Q��_ؽ��܋yf�[m��;.��t����c�U̳v[+�@�Y �y{�Iu��`�f�V�\
�%�r���˞@��b	g|g�7N��b<d@��oa#d��ؠ|<}���.�č,Y�<��C۪�τ}w �?�vݍA�z/�JcT�'��o�GHmsU�<H�C���\о��4����{�-�A��+}�ϣuvv�$�t��]�������zk��S�-k���O�ZmJ�P�}7^ߒ��������_:���_=���.y1�i�^qQ��w����{�X_���ٯwF�w�;�װ��F�5Ŵ��u| ���/?H��Fx�"uIU��?��5X�x�l��ͦ��;_�]>��'?�tь����ք�~�gl���i၇�`�Ra��_�;���[j�}���o߾}�:��<      �      x������ � �      �      x������ � �      W      x���˖����q�9P���&��:E@n"<��=�8���I�����Ȅ*��N�ϩ�x����@����/�������"'>�������	��VwS����)�%�M(vXN�'eϾ��lB���ѳb5�� ؤ���;ϿDV��G؄b/e�<+o��_�&�|��NW�V
��� �PluN�Usޜ���lB����h
^��F؄b�8��L"��`��{?��q�	؄b=�ǂ}Oe�QS�&[���It�>ʀM(�mV���k}i"g� 6��ͬ5��j��o��	�zq����c���z{�&����Ǎ���ϨIlR��IgX�zP3_݂�I�@��PO��,�r� �P,m�RF�4�%��6����Ub��^�� 6���>��6�{�a�G�	�5�mS~�JRX&`��ԧ���Mİ�z��	Ū�Kv)o�@�}U� �Ե=�m��Z��W�P�j0M�]k�&�.6�^J{\^�c7�}��3`����G�^̜��z�&��a:�ޝ�//_lRP���>|� :|r�&5��|�דYN�elB��W��2]��M=|t�&�:�1��m$R�{��Plș۽q�a��;�	�6��Vd�63��IlR�ŵ�V��}����؄b;I�����+=�3`�:���g���܃�'�M��q��e�O%��[n؄b���O�գ[3=b�&��8
���yIˮ �P�sU������2�e�&՞S�׻P�44�9� ����R��NvS�=��ؤ��#{�P$׃3T`�ڻ�^��uWK��R6�X�T�����s����	��E��tU�)+���؄b�&�o�<>:��x�M(v���Sl��m�r�#`�Ms��V��t���� 6���`��q�e��%	�	�f��[�"��	�`�5������z;�`��r��ϣM��޳�M�s�Kq�K��b�	 ����E_����](5�I���hl:1g�5�	�>���I�l\���ҀM(�:H��g#N'��lRG�h����k�y���Im�k�����3'��Im�<�I�֐�<��Mj*��Kw��ڱ`��؄b���-�n�{(�6�M��
C>���7�lR����#���&�m��6���=P����G�*��&k�F���ԭf6�H�n��s�w�ؤ���5]���t��	�֛�}���z�N�m؄b�s�������G�6����9I{~j�|��&{Ͷ�ge�����PlûN&~��K��lB����珠Uz4`�Z�u]�2�H��'�&��:�.�u͞U�3`���(������� �Pl)�������`5�	���^��}6���Ql�&5\.z^!�zKV6��uܽ�c���5*W�&�ê�������<9�؄b���'__�v�Ρ6��ƿ��bD��e;�lB��"����RW'3lB���o�e8�~�F�&���[��F�,�tlR��'yc?I,�bݻ�Mja5h�҂OɴK�6�7�ٻv�տ�����M�����U:)��uulR�-Mُ$�sAˊ�ؤ����Ȉ����s}lR�ٵ�-��m(K� �P�!�ݡ��!V��ؤ��Ye�Q���V�w�M(6�tL�=�*[��C6�����6�؄`�zW�}��*�s_f�lB��2�nvZ��d�`�ک�<Nfk7-Ɏ�ؤv���牋����6��I�U�<�c�5e�Im���!��l��A)}�&5&BA�-ɠ� �P�f<�6AЛ����P�%p�2�\�Y���6�ml�~L�P�ɴ� �	�r�^t��"�c�x�&��/�9:fS��c�6����ƭT�hW&lb���>����k�6��>�����:~ؤV�ޗgC;�z�o�&�Km\ͽ��iC��Mj_j�]^}�����=�M(��|��H���Zؤz�����<6��~at�&K�Ιy\��9�;`��2���f^Ļ�� 6��m߻z�:>-�`�'`����sw��,�πMj��;����P��lR��V]�-��kO���M(V�i�x���kN�M�$��}���'%� ��If���]L�o�d �P�,�x+����lB�G�M_�͝գ�t��������d1�Z֥lRS��[�Z�$g�}�(�&+m[&�r0��� 6��J��¦�bWlB���:�-7i����Iͷn}3���yI�Sm ��������̜�o�M���m����v���� 6�ع=���>GG��Mja��b�*���lR��f�\Ҥ��)���MjL^�M,��~_Uw3 lB�?���e�� ؤ J羏�Ė~b���MjL6���=]�~�QؤvX�'��ժ~r�E�&���H	���@��9lR���|���ȼ�`����d޾�լwG� ��+�p����;�&�S�g���6��]u
�	�FU��'�5*6�S��mE҇/�/W|�6���&i)Y/�Hf�lRP����S������vX}j�o�ᙍylR�p�^\���/G�f&�Mj1Ҷ�4T:%��☀Mj�����d�R�րM(�����,�0��lB�O�^Z�%_���`����X�w��?��d4`��o�q�K�-+��6��|pr�O*Y�fF>6�-�i���<��|� 6�Q����o���K؄b��xK�9]w�w�d�&k�_��d�����P�4�]�Z��Z� ��j�<]�_�]�{�|ـM(��_N��R������67.�l�
�M��lRG�=>����d�ؤf�J�^��,:�؄bK��S���g��Z�	Şr�܍�>��%�T�
��\�#' �Pl}XG��J�:�lRk �s�v�I{����6��T1��~��{��`����V��U���X�Mj�k?���'��mؤ��I�߽}}RS�\9�&���c�u?���ؤVaW��Q_���I-��.d�*j���{� �P�z��'w���;e`��S7Ǚ��Ua��M�a�vf����Wj�πM(�����w|�3_g�lR�<+���]���	�6��Q��k'���&�{�}'���"��؄b3�/e2�ˮK9�I�RK-ط�˾t�&հ
]���8�5ǀM(����պ���^���	�EM�����Fy�M��=w���HBt�6��@��l�s*��j��MjLް}��B�[�Ԫ���2we�c؄b�r��ԙ5�ӎS'�&��h�]�y�c��/`�z�s���^Ir��`ؤ�@��]�/ؖzOT�&K1�er�� ��06�UAiXb߸�.��� ؤ�����N��~�`���<��rF�w����&kM�%U�O����lR3�W.���֓�<�
�I�R����;:��ޣ6��f_�C��v�?�M깍SSy�Ʃ��YwlR�������&�cs� �T�]���YI�Z�6�ر?*.?U&'�N�	�Fo��I+V��qlRP�^�װD��~^�&u��n��{NLN�]� 6�X�:sȟ���U]�M(��	��K��� _�I��d�B'=�ZǴ~< ��4_��9[�g�H�z�_��	��.y�����Ux�-��v?�-N|E�ܽ��`�:`�Z0����E�dg���.e�������~Rb�Asl��;P��k�[��|}~����u���ox�g򽩚����"wA�߻��������:�70?���`�^2��z��~[K߸���"�����e�?���&�ni���-���<��U,���Ů���\���A��x�v��f�����-��yĚз��ޛ��h��"�4�#y#u!/\�sm�� �o����]��B��.��+`�Z������7/M��m���V���������=���a�`����!;�ľVe�;�&6O����ٿ�G�}o ��<��~iw�*�|���M�A�E÷��8~
��קF�?���|��4��Ml�2��u��>����%lr���K��I�������럱�>e��ϐ.ԥ����k�G.��N�"�n�Zy�g�&t���,��z���~9`�-�{Z�鄪5�����Y��d\�� �
  ��F�5�&�k�%7�i���	j�&t����z/��C�&u��yMwAh��S��9`:\E����ǯ^��ؿ���<ޗ�Tߧu�l��M=`��� �$o�S�oa���];�M�vLe�sk>+o��V۟��;�)�o�n���ء�R?ԕ�ľL��.��C�L�h�"�~�;�&s.6�ۧ�O�q��ݢ��� ��n��ϖ;�l�jg1��;�_���{��396'7|ߪ�7�7bؿ׃�~>�m(�C,E�̭�s��O�j������q�M�
���G�eç��1�Pp�M��P?�k��-����r�&4�E`���/�%�va�+�n��s���ۤ�u[0?ou�Zwg��+������x���~�
A�QD=�|m&���N�gl2E��ϝ�Ҍ�X�����ڨ �o�0,幓�@�v����m���|*����~��uؤ:2e�966�I;�p�y�&ԑݹEɋ}fջh���a�:\;}s�՟|�=j[�&�{s�쒞�c�E� 6��l���UrT�?P�M�p���������R�&����W�lҍ�ˑlB��u��z�3�f�T 6����D방���'`��*a���Vb>�k ��k�Ж&�,W)6R�s9�q��پ�9������ui���d�細�%�N�Su��yq�_�fc6KǺ��σn2��������8�Ge����.`���ύ���%?�8g� �Pl�Yko�s���qlRq��Ʀvv��\��	�Z��1u;��(=�	�:ŷI䝽{�)%��P�~,���T�{+�* lB�ե8z���4��7`�5���7��r�K�ȀM(V����!��),�&˶�i�eJz(���6�Q�~�w5�˲����ö�o�;e�GyN����+��:_��L�E<v���e�5�z��~��穸5��y!Kjub���^0\�}��Q�"�=wM���쿩bgt������?= ��Tqw���]m�qۙ�S��3!���z�����
�¾������Ų]���*��f�7����o���x��t��m�_�ݍ��R��ye"u����*6��{^o^ԣ�ݦ�$�`:�d���IԌ�g�U|� �o.	%q�ߘ��	�(��o�d.	M�l�ǵ�M_��w>�y���\����?�[�{�U���:?b�n<�4�f�j�s�&��e��V�f�lB���8�{)�g�!`�:ڤO^����)�	Ş����.�8�ӛq�Pl����7y�ӏ�	�J'�Z�s'��42`��x����평� 6��v���5�ȗ�a��	Ŗi�����{��w?6���;��=�q>��	�����|G'f��&{���~O�+��'�	Ů�+��z�:��I�ꨟ7�V��L��E�cs�	�h�r����t-wwsl2U0��+/��6���y���؄ZV��|�=�\�ǧ��
؄�zoތ[G}�<�N���M�5-��ש�����zy�6��:���}k�it��92]	����^��}9-U�h���O�n��|����w� �_�p�?�b�MO�'Q�`�EF�|�������2�M���G��0�^�ǀM(�����8:��6���(�m�)��\�w���w_�˥�]�8Vt�	���{͈Gݒ:���'=3��O��K7����oO�
7�����כؤ��|�o�]t�y;��Mj��U�7=�]�m�6�f˾J��:�J�9�7�M(6�7�+v��YZ&M�M(���:�|+��؄b��+h�J,��$�؄b�jФs9��#g�`�:ɔ'|WEɌ��D9`�����v_o���_~��G�Ɔ��o�2j������8g��2�QU�����}���uYΑِ���-���li=�6�Y�N`�Z0����`\�b�������)z�3XxY�}a���i��;�e7��r�}���V؄b/^Uq�93�[+�&`��yd��5��k��M(VvoQ��́��`�=��[����� 6��u�^�L�����;lB�����4&ǇT��&K�Vqyh�x,>') l-������R��H����uA������9`�E�6�~������������>p���VDj`�����!O]� �/jxϺ��ҏ)+y�_�`q��{��rߛ�����m�e��J�M?f����Z��.쩝�=7��5d<el�� �r7�W��5�i������E� ;�^a!�_j��-����ˎ�#'��2X;�����z���&s?�,dǄow�۩�8jl�O�VO�)���$쿨�t#���˖)]�]�/��E�..y4�B�쿨A�ӷ{�=�KR<�����t���kv�����*`�E���ݹүP�#�������I"5pE65L���~ǚ>`�E	�p�].��K����5��F2��?���B�_���5Iƍ饽���5��*Ϫ���{yc�>��އ����!�ԐIV��������&�_Ԑ���;K{w�f[ ���h��?�.��o��Cעػ�t�6���O��5�� /�b��]J�����E�����/2��&_C�)��c�ž�~؄���i�O��ܞ��	ؤ�n�lm�(���y��n
?Uh>�e&/2�R O��"��щ'�_��Oy��0p�LP����<8�ʵ��Qn��l ؤ�<nL�Aq�ML؄b��4�u��N�b�&���ϟ�g��Ib������&���a�;��|g�
�q�Ei�̋�Z��-����$������q��      �      x������ � �      �      x������ � �      X   7  x���[o�L���_Aқ�/J��pY�g�X�5��*�*��?��b췍ɐIf�5�]�����x�'o8_l�$J��4@�� ����ȓ�L�So�݊:A?yhՉ�T�b�s���.��e�\���ܛ~`�TI�����t\-kҞ�Z���6� 	�G�?BY�HET��ղ��o�r��u�5�-������D-Yc��'�i$� ���W�x�����x`�~dء�53<�2L�������l������ �J$����JJ�.�s/��F��;�|ah�!�Y1�l&�'ݙ7+C�߆c'���bG�Ʋ��Ɉ �J��q�h)��w`]����2���rA@���
=�|Y��q��'T1�ԓ�)G^�:�6͗�K;?�z�Bp��`b��~��c�h�6�zn�I%&��h~*�l�QFa۝���?�%g��#��:�ZX�SZ��iƼ9k�q�a\��̍ᯃ+}KX��/�Vۭ韈Q��R7�Q��J���Q{HU��,7YIv���2[�Ef[�����o��VJ��_�D���P~<)�
V�j��^>G��{����/.ܲh���ٚX#���K���8�� ޹@�,��z��<S/�oP~2C�?��j�7���.�^�_������gN'�DoF�p�������i&+E�#���ԏuv�S,'S~&������RQ�7�H�m��]X���=���L."1NEBȿ����_��nL�7��(*�$E�WFϯՏ)s���ڐ @��(�e=`��������D��=�K�W��B���,�4u-��#*�����J�?Y/"      �   �   x�s�1tq4�����/���L����,w�((J*-qsˎ�
�4�3 N���bPf����ᕚZ�id`d�kh�kh�``iedfe`����UQlRiYᘞi��f��Y�X����\i�S�[��kR�l@��V�&V�`�c���� ;c0�      �   k  x��Vے�@|Ư�Ě.����DQ����������&)ٔ�}�j��{����Fo�^�t��d�!��, ����h)`6�Гr�%s͎l�N���L����zp]d� ����@�	�b�ϻ �;�C�R=�z�+���=��""gΜ��D.S�b^?G&S޺"�S�� �kz`��8�O3��N�߸9�����]\£F,���`�}s�,flnk�f!(y�
�f#�®�@�Z�=L~���'g#~~���y�R�0��	qx�㥖~M��&է
T1?A4�/�x�Y�7�`{$S����)�}�b�&�X��<Vм�3:֧�o�߄������n���6݅ת�:��"gj<�ũ>0�Ӈ�MI���h���(Lw����r.����,��vק� <�v։���	M�A�"xnU�G�`��˪f`g�Y�X�t����R�����`���?g��b �3
1S�X��$�_����̷�BP���`��;�N��71���V��J{�<�l��S��G×#��xZ�<�1�td���p?���b�r�K�Kq`��X�r�O�/q�m���n�R��rDglL������^ҍ&9|���(�j�.Y�z��Vѐ̚H��m$@��}ƖK�$SH�����p�6�S/rkL�j��b�f`Dtn�4�����QR"�m¤��Zl��z��8�������R���F��1��4ѱ.��1xJXܝ�a܄	���lyI"�y-���d��.�g�1�;�����q�U��Ci�F�~���]��Y��v.�BO�ÈbR�����K�������._�~��[�U]ê�s����O�?���u��֤�M]����t:?dv"      �   j   x����6)�6�MrJr	�rw.��ȩ�-��5)�+�t��/�,J��4�3 ��t�2KO�����N##]C]CKC+SS+�?N�=... 4      �      x������ � �     