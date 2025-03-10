PGDMP  4    5                |            fzl %   14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)     16.4 (Ubuntu 16.4-1.pgdg22.04+1) B   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    42979    fzl    DATABASE     k   CREATE DATABASE fzl WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE fzl;
                postgres    false                        2615    42980 
   commercial    SCHEMA        CREATE SCHEMA commercial;
    DROP SCHEMA commercial;
                postgres    false                        2615    42981    delivery    SCHEMA        CREATE SCHEMA delivery;
    DROP SCHEMA delivery;
                postgres    false                        2615    42982    drizzle    SCHEMA        CREATE SCHEMA drizzle;
    DROP SCHEMA drizzle;
                postgres    false                        2615    42983    hr    SCHEMA        CREATE SCHEMA hr;
    DROP SCHEMA hr;
                postgres    false            	            2615    42984    lab_dip    SCHEMA        CREATE SCHEMA lab_dip;
    DROP SCHEMA lab_dip;
                postgres    false            
            2615    42985    material    SCHEMA        CREATE SCHEMA material;
    DROP SCHEMA material;
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    15                        2615    42986    purchase    SCHEMA        CREATE SCHEMA purchase;
    DROP SCHEMA purchase;
                postgres    false                        2615    42987    slider    SCHEMA        CREATE SCHEMA slider;
    DROP SCHEMA slider;
                postgres    false                        2615    42988    thread    SCHEMA        CREATE SCHEMA thread;
    DROP SCHEMA thread;
                postgres    false                        2615    42989    zipper    SCHEMA        CREATE SCHEMA zipper;
    DROP SCHEMA zipper;
                postgres    false            '           1247    45662    item_for_enum    TYPE     �   CREATE TYPE delivery.item_for_enum AS ENUM (
    'zipper',
    'thread',
    'sample_zipper',
    'sample_thread',
    'slider',
    'tape'
);
 "   DROP TYPE delivery.item_for_enum;
       delivery          postgres    false    6            *           1247    45672    product_enum    TYPE     H   CREATE TYPE public.product_enum AS ENUM (
    'zipper',
    'thread'
);
    DROP TYPE public.product_enum;
       public          postgres    false    15            (           1247    42991    batch_status    TYPE     m   CREATE TYPE zipper.batch_status AS ENUM (
    'pending',
    'completed',
    'rejected',
    'cancelled'
);
    DROP TYPE zipper.batch_status;
       zipper          postgres    false    14            -           1247    45678    finishing_batch_status    TYPE     r   CREATE TYPE zipper.finishing_batch_status AS ENUM (
    'running',
    'hold',
    'completed',
    'rejected'
);
 )   DROP TYPE zipper.finishing_batch_status;
       zipper          postgres    false    14            +           1247    43000    order_type_enum    TYPE     U   CREATE TYPE zipper.order_type_enum AS ENUM (
    'full',
    'slider',
    'tape'
);
 "   DROP TYPE zipper.order_type_enum;
       zipper          postgres    false    14            .           1247    43008    print_in_enum    TYPE     `   CREATE TYPE zipper.print_in_enum AS ENUM (
    'portrait',
    'landscape',
    'break_down'
);
     DROP TYPE zipper.print_in_enum;
       zipper          postgres    false    14                       1247    45313    slider_provided_enum    TYPE     {   CREATE TYPE zipper.slider_provided_enum AS ENUM (
    'completely_provided',
    'partial_provided',
    'not_provided'
);
 '   DROP TYPE zipper.slider_provided_enum;
       zipper          postgres    false    14            1           1247    43016    slider_starting_section_enum    TYPE     �   CREATE TYPE zipper.slider_starting_section_enum AS ENUM (
    'die_casting',
    'slider_assembly',
    'coloring',
    '---'
);
 /   DROP TYPE zipper.slider_starting_section_enum;
       zipper          postgres    false    14            4           1247    43026    swatch_status_enum    TYPE     a   CREATE TYPE zipper.swatch_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);
 %   DROP TYPE zipper.swatch_status_enum;
       zipper          postgres    false    14            �           1255    46186 )   factory_delete_after_party_delete_funct()    FUNCTION     �   CREATE FUNCTION commercial.factory_delete_after_party_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.factory WHERE party_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 D   DROP FUNCTION commercial.factory_delete_after_party_delete_funct();
    
   commercial          postgres    false    5            �           1255    46184 )   factory_insert_after_party_insert_funct()    FUNCTION     `  CREATE FUNCTION commercial.factory_insert_after_party_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.factory (uuid, party_uuid, name, address, created_at, created_by, remarks)
    VALUES (NEW.uuid, NEW.uuid, NEW.name, NEW.address, NEW.created_at, NEW.created_by, NEW.remarks);
    RETURN NEW;
END;
$$;
 D   DROP FUNCTION commercial.factory_insert_after_party_insert_funct();
    
   commercial          postgres    false    5            �           1255    46202 .   material_stock_after_booking_delete_function()    FUNCTION     B  CREATE FUNCTION commercial.material_stock_after_booking_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity,
        booking = booking - OLD.quantity
    WHERE material_uuid =  OLD.material_uuid;
    RETURN OLD;
END;
$$;
 I   DROP FUNCTION commercial.material_stock_after_booking_delete_function();
    
   commercial          postgres    false    5            �           1255    46200 .   material_stock_after_booking_insert_function()    FUNCTION     A  CREATE FUNCTION commercial.material_stock_after_booking_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock - NEW.quantity,
        booking = booking + NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$;
 I   DROP FUNCTION commercial.material_stock_after_booking_insert_function();
    
   commercial          postgres    false    5            �           1255    46201 .   material_stock_after_booking_update_function()    FUNCTION     b  CREATE FUNCTION commercial.material_stock_after_booking_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity - NEW.quantity,
        booking = booking + NEW.quantity - OLD.quantity
    WHERE material_uuid =  NEW.material_uuid;
    RETURN NEW;
END;

$$;
 I   DROP FUNCTION commercial.material_stock_after_booking_update_function();
    
   commercial          postgres    false    5            �           1255    43033 /   sfg_after_commercial_pi_entry_delete_function()    FUNCTION     ~  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS trigger
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
   commercial          postgres    false    5            �           1255    43034 /   sfg_after_commercial_pi_entry_insert_function()    FUNCTION     ~  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS trigger
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
   commercial          postgres    false    5            �           1255    43035 /   sfg_after_commercial_pi_entry_update_function()    FUNCTION     �  CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS trigger
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
   commercial          postgres    false    5            �           1255    46215 >   thread_batch_entry_after_batch_entry_production_delete_funct()    FUNCTION     �  CREATE FUNCTION commercial.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS trigger
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
        production_quantity = production_quantity - OLD.production_quantity,
        carton_of_production_quantity = carton_of_production_quantity - OLD.coning_carton_quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = OLD.batch_entry_uuid);

    RETURN OLD;
END;

$$;
 Y   DROP FUNCTION commercial.thread_batch_entry_after_batch_entry_production_delete_funct();
    
   commercial          postgres    false    5            �           1255    46214 >   thread_batch_entry_after_batch_entry_production_insert_funct()    FUNCTION     �  CREATE FUNCTION commercial.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS trigger
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
        production_quantity = production_quantity + NEW.production_quantity,
        carton_of_production_quantity = carton_of_production_quantity + NEW.coning_carton_quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$;
 Y   DROP FUNCTION commercial.thread_batch_entry_after_batch_entry_production_insert_funct();
    
   commercial          postgres    false    5            �           1255    46216 >   thread_batch_entry_after_batch_entry_production_update_funct()    FUNCTION     g  CREATE FUNCTION commercial.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS trigger
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
        production_quantity = production_quantity - OLD.production_quantity + NEW.production_quantity,
        carton_of_production_quantity = carton_of_production_quantity - OLD.coning_carton_quantity + NEW.coning_carton_quantity

    WHERE uuid = (SELECT order_entry_uuid FROM thread.batch_entry WHERE uuid = NEW.batch_entry_uuid);

    RETURN NEW;
END;

$$;
 Y   DROP FUNCTION commercial.thread_batch_entry_after_batch_entry_production_update_funct();
    
   commercial          postgres    false    5            �           1255    46218 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_delete()    FUNCTION     7  CREATE FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() RETURNS trigger
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
 \   DROP FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
    
   commercial          postgres    false    5            �           1255    46217 @   thread_batch_entry_and_order_entry_after_batch_entry_trx_funct()    FUNCTION     6  CREATE FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS trigger
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
 [   DROP FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
    
   commercial          postgres    false    5            �           1255    46219 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_update()    FUNCTION     �  CREATE FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() RETURNS trigger
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
 \   DROP FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
    
   commercial          postgres    false    5            �           1255    46220 +   thread_order_entry_after_challan_received()    FUNCTION     ?  CREATE FUNCTION commercial.thread_order_entry_after_challan_received() RETURNS trigger
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
 F   DROP FUNCTION commercial.thread_order_entry_after_challan_received();
    
   commercial          postgres    false    5            P           1255    45582    update_up_number_updated_at()    FUNCTION     �   CREATE FUNCTION commercial.update_up_number_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
		NEW.up_number_updated_at = to_char(now(), 'YYYY-MM-DD HH24:MI:SS');
		RETURN NEW;
	END;
$$;
 8   DROP FUNCTION commercial.update_up_number_updated_at();
    
   commercial          postgres    false    5            �           1255    46222 A   zipper_dyeing_batch_entry_after_dyeing_batch_production__update()    FUNCTION     �  CREATE FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production__update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.dyeing_batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = NEW.dyeing_batch_entry_uuid;

    RETURN NEW;
END;
$$;
 \   DROP FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production__update();
    
   commercial          postgres    false    5            �           1255    46223 @   zipper_dyeing_batch_entry_after_dyeing_batch_production_delete()    FUNCTION     v  CREATE FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.dyeing_batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg - OLD.production_quantity_in_kg
    WHERE
        uuid = OLD.dyeing_batch_entry_uuid;

    RETURN OLD;
END;
$$;
 [   DROP FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production_delete();
    
   commercial          postgres    false    5            �           1255    46221 @   zipper_dyeing_batch_entry_after_dyeing_batch_production_insert()    FUNCTION     v  CREATE FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.dyeing_batch_entry
    SET
        production_quantity_in_kg = production_quantity_in_kg + NEW.production_quantity_in_kg
    WHERE
        uuid = NEW.dyeing_batch_entry_uuid;

    RETURN NEW;
END;
$$;
 [   DROP FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production_insert();
    
   commercial          postgres    false    5            �           1255    46182 2   delivery_challan_after_packing_list_update_funct()    FUNCTION     �  CREATE FUNCTION delivery.delivery_challan_after_packing_list_update_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

DECLARE
    challan_uuid_gp uuid;
BEGIN
    SELECT 
        uuid 
    INTO 
        challan_uuid_gp 
    FROM 
        delivery.challan 
    WHERE 
       uuid = NEW.challan_uuid;

    IF (SELECT 
            COUNT(*) 
        FROM 
            delivery.packing_list 
        WHERE 
            challan_uuid = challan_uuid_gp AND gate_pass != 1) = 0 THEN

        UPDATE 
            delivery.challan
        SET 
            gate_pass = 1 
        WHERE 
            uuid = challan_uuid_gp;
    END IF;

    RETURN NEW;
END;

$$;
 K   DROP FUNCTION delivery.delivery_challan_after_packing_list_update_funct();
       delivery          postgres    false    6            L           1255    43036 2   packing_list_after_challan_entry_delete_function()    FUNCTION     +  CREATE FUNCTION delivery.packing_list_after_challan_entry_delete_function() RETURNS trigger
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
       delivery          postgres    false    6            M           1255    43037 2   packing_list_after_challan_entry_insert_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_insert_function() RETURNS trigger
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
       delivery          postgres    false    6            N           1255    43038 2   packing_list_after_challan_entry_update_function()    FUNCTION     7  CREATE FUNCTION delivery.packing_list_after_challan_entry_update_function() RETURNS trigger
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
       delivery          postgres    false    6            O           1255    43039 2   sfg_after_challan_receive_status_delete_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS trigger
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
       delivery          postgres    false    6            Q           1255    43040 2   sfg_after_challan_receive_status_insert_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS trigger
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
       delivery          postgres    false    6            U           1255    43041 2   sfg_after_challan_receive_status_update_function()    FUNCTION     9  CREATE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS trigger
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
       delivery          postgres    false    6            �           1255    43042 .   sfg_after_packing_list_entry_delete_function()    FUNCTION     '  CREATE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.sfg
    IF OLD.sfg_uuid IS NOT NULL THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse - OLD.quantity,
            finishing_prod = finishing_prod + OLD.quantity
        WHERE uuid = OLD.sfg_uuid;
    ELSE
        UPDATE thread.order_entry
        SET
            warehouse = warehouse - OLD.quantity,
            -- carton_quantity = carton_quantity - OLD.quantity,
            production_quantity = production_quantity + OLD.quantity
            -- carton_of_production_quantity = carton_of_production_quantity + OLD.quantity
        WHERE uuid = OLD.thread_order_entry_uuid;
    END IF;
    RETURN OLD;
END;
$$;
 G   DROP FUNCTION delivery.sfg_after_packing_list_entry_delete_function();
       delivery          postgres    false    6            �           1255    43043 .   sfg_after_packing_list_entry_insert_function()    FUNCTION     '  CREATE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.sfg
    IF NEW.sfg_uuid IS NOT NULL THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse + NEW.quantity,
            finishing_prod = finishing_prod - NEW.quantity
        WHERE uuid = NEW.sfg_uuid;
    ELSE
        UPDATE thread.order_entry
        SET
            warehouse = warehouse + NEW.quantity,
            -- carton_quantity = carton_quantity + NEW.quantity,
            production_quantity = production_quantity - NEW.quantity
            -- carton_of_production_quantity = carton_of_production_quantity - NEW.quantity
        WHERE uuid = NEW.thread_order_entry_uuid;
    END IF;
    RETURN NEW;
END;
$$;
 G   DROP FUNCTION delivery.sfg_after_packing_list_entry_insert_function();
       delivery          postgres    false    6            �           1255    43044 .   sfg_after_packing_list_entry_update_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update zipper.sfg
    IF NEW.sfg_uuid IS NOT NULL THEN
        UPDATE zipper.sfg
        SET
            warehouse = warehouse + NEW.quantity - OLD.quantity,
            finishing_prod = finishing_prod - NEW.quantity + OLD.quantity
        WHERE uuid = NEW.sfg_uuid;
    ELSE
        UPDATE thread.order_entry
        SET
            warehouse = warehouse + NEW.quantity - OLD.quantity,
            -- carton_quantity = carton_quantity + NEW.quantity - OLD.quantity,
            production_quantity = production_quantity - NEW.quantity + OLD.quantity
            -- carton_of_production_quantity = carton_of_production_quantity - NEW.quantity + OLD.quantity
        WHERE uuid = NEW.thread_order_entry_uuid;
    END IF;
    RETURN NEW;
END;
$$;
 G   DROP FUNCTION delivery.sfg_after_packing_list_entry_update_function();
       delivery          postgres    false    6            �           1255    46207 4   sfg_and_packing_list_after_challan_delete_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_and_packing_list_after_challan_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    pl_sfg RECORD;
BEGIN
    SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity, packing_list.item_for, packing_list_entry.thread_order_entry_uuid
    INTO pl_sfg
    FROM delivery.packing_list
    LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
    WHERE packing_list.challan_uuid = OLD.uuid;
    -- Update zipper.sfg
    IF OLD.receive_status = 1 THEN
        IF pl_sfg.item_for = 'thread' OR pl_sfg.item_for = 'sample_thread' THEN
            UPDATE thread.order_entry
            SET
                warehouse = warehouse + pl_sfg.quantity,
                delivered = delivered - pl_sfg.quantity
            WHERE thread.order_entry.uuid = pl_sfg.thread_order_entry_uuid;
        ELSE
            UPDATE zipper.sfg
            SET
                warehouse = warehouse + pl_sfg.quantity,
                delivered = delivered - pl_sfg.quantity
            WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
        END IF;
    END IF;

    RETURN OLD;
END;
$$;
 M   DROP FUNCTION delivery.sfg_and_packing_list_after_challan_delete_function();
       delivery          postgres    false    6            �           1255    46206 4   sfg_and_packing_list_after_challan_insert_function()    FUNCTION     �  CREATE FUNCTION delivery.sfg_and_packing_list_after_challan_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    pl_sfg RECORD;
BEGIN
    SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity, packing_list.item_for, packing_list_entry.thread_order_entry_uuid
    INTO pl_sfg
    FROM delivery.packing_list 
    LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
    WHERE packing_list.challan_uuid = NEW.uuid;
    -- Update zipper.sfg
    IF NEW.receive_status = 1 THEN
        IF pl_sfg.item_for = 'thread' OR pl_sfg.item_for = 'sample_thread' THEN
            UPDATE thread.order_entry
            SET
                warehouse = warehouse - pl_sfg.quantity,
                delivered = delivered + pl_sfg.quantity
            WHERE thread.order_entry.uuid = pl_sfg.thread_order_entry_uuid;
        ELSE
            UPDATE zipper.sfg
            SET
                warehouse = warehouse - pl_sfg.quantity,
                delivered = delivered + pl_sfg.quantity
            WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;
 M   DROP FUNCTION delivery.sfg_and_packing_list_after_challan_insert_function();
       delivery          postgres    false    6            �           1255    46208 4   sfg_and_packing_list_after_challan_update_function()    FUNCTION     =  CREATE FUNCTION delivery.sfg_and_packing_list_after_challan_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    pl_sfg RECORD;
BEGIN
    SELECT packing_list_entry.sfg_uuid, packing_list_entry.quantity, packing_list.item_for, packing_list_entry.thread_order_entry_uuid
    INTO pl_sfg
    FROM delivery.packing_list
    LEFT JOIN delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid 
    WHERE packing_list.challan_uuid = NEW.uuid;
    -- Update zipper.sfg
        IF pl_sfg.item_for = 'thread' OR pl_sfg.item_for = 'sample_thread' THEN
            UPDATE thread.order_entry
            SET
                warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
                delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
            WHERE thread.order_entry.uuid = pl_sfg.thread_order_entry_uuid;
        ELSE
            UPDATE zipper.sfg
            SET
                warehouse = warehouse - CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END + CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END,
                delivered = delivered + CASE WHEN NEW.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END - CASE WHEN OLD.receive_status = 1 THEN pl_sfg.quantity ELSE 0 END
            WHERE zipper.sfg.uuid = pl_sfg.sfg_uuid;
        END IF;

    RETURN NEW;
END;
$$;
 M   DROP FUNCTION delivery.sfg_and_packing_list_after_challan_update_function();
       delivery          postgres    false    6            _           1255    43045 +   material_stock_after_material_info_delete()    FUNCTION     �   CREATE FUNCTION material.material_stock_after_material_info_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 D   DROP FUNCTION material.material_stock_after_material_info_delete();
       material          postgres    false    10            ^           1255    43046 +   material_stock_after_material_info_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_material_info_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    43047 *   material_stock_after_material_trx_delete()    FUNCTION     =  CREATE FUNCTION material.material_stock_after_material_trx_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 C   DROP FUNCTION material.material_stock_after_material_trx_delete();
       material          postgres    false    10            �           1255    43048 *   material_stock_after_material_trx_insert()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_trx_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 C   DROP FUNCTION material.material_stock_after_material_trx_insert();
       material          postgres    false    10            �           1255    43049 *   material_stock_after_material_trx_update()    FUNCTION     +  CREATE FUNCTION material.material_stock_after_material_trx_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;
 C   DROP FUNCTION material.material_stock_after_material_trx_update();
       material          postgres    false    10            �           1255    43050 +   material_stock_after_material_used_delete()    FUNCTION       CREATE FUNCTION material.material_stock_after_material_used_delete() RETURNS trigger
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
       material          postgres    false    10            �           1255    43051 +   material_stock_after_material_used_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_material_used_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    43052 +   material_stock_after_material_used_update()    FUNCTION     �  CREATE FUNCTION material.material_stock_after_material_used_update() RETURNS trigger
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
       material          postgres    false    10            �           1255    43053 ,   material_stock_after_purchase_entry_delete()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS trigger
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
       material          postgres    false    10            �           1255    43054 ,   material_stock_after_purchase_entry_insert()    FUNCTION       CREATE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    43055 ,   material_stock_after_purchase_entry_update()    FUNCTION     .  CREATE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS trigger
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
       material          postgres    false    10            �           1255    43056 .   material_stock_sfg_after_stock_to_sfg_delete()    FUNCTION     Y  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS trigger
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
       material          postgres    false    10            �           1255    43057 .   material_stock_sfg_after_stock_to_sfg_insert()    FUNCTION     c  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS trigger
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
       material          postgres    false    10            �           1255    43058 .   material_stock_sfg_after_stock_to_sfg_update()    FUNCTION     8  CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS trigger
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
       material          postgres    false    10            `           1255    43059 >   thread_batch_entry_after_batch_entry_production_delete_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS trigger
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
       public          postgres    false    15            a           1255    43060 >   thread_batch_entry_after_batch_entry_production_insert_funct()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS trigger
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
       public          postgres    false    15            b           1255    43061 >   thread_batch_entry_after_batch_entry_production_update_funct()    FUNCTION     P  CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS trigger
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
       public          postgres    false    15            c           1255    43062 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_delete()    FUNCTION        CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() RETURNS trigger
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
       public          postgres    false    15            d           1255    43063 @   thread_batch_entry_and_order_entry_after_batch_entry_trx_funct()    FUNCTION       CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS trigger
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
       public          postgres    false    15            e           1255    43064 A   thread_batch_entry_and_order_entry_after_batch_entry_trx_update()    FUNCTION     �  CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() RETURNS trigger
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
       public          postgres    false    15            f           1255    43065 -   thread_order_entry_after_batch_entry_delete()    FUNCTION     ;  CREATE FUNCTION public.thread_order_entry_after_batch_entry_delete() RETURNS trigger
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
       public          postgres    false    15            g           1255    43066 -   thread_order_entry_after_batch_entry_insert()    FUNCTION     B  CREATE FUNCTION public.thread_order_entry_after_batch_entry_insert() RETURNS trigger
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
       public          postgres    false    15            h           1255    43067 ?   thread_order_entry_after_batch_entry_transfer_quantity_delete()    FUNCTION     @  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_delete() RETURNS trigger
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
       public          postgres    false    15            i           1255    43068 ?   thread_order_entry_after_batch_entry_transfer_quantity_insert()    FUNCTION     @  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_insert() RETURNS trigger
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
       public          postgres    false    15            j           1255    43069 ?   thread_order_entry_after_batch_entry_transfer_quantity_update()    FUNCTION     X  CREATE FUNCTION public.thread_order_entry_after_batch_entry_transfer_quantity_update() RETURNS trigger
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
       public          postgres    false    15            k           1255    43070 -   thread_order_entry_after_batch_entry_update()    FUNCTION     \  CREATE FUNCTION public.thread_order_entry_after_batch_entry_update() RETURNS trigger
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
       public          postgres    false    15            l           1255    43071 +   thread_order_entry_after_challan_received()    FUNCTION     (  CREATE FUNCTION public.thread_order_entry_after_challan_received() RETURNS trigger
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
       public          postgres    false    15            �           1255    43078 A   assembly_stock_after_die_casting_to_assembly_stock_delete_funct()    FUNCTION     ]  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS trigger
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
    SET quantity_in_sa = quantity_in_sa + OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = OLD.assembly_stock_uuid AND assembly_stock.die_casting_link_uuid IS NOT NULL;

    RETURN OLD;
END;
$$;
 X   DROP FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
       slider          postgres    false    12            �           1255    43079 A   assembly_stock_after_die_casting_to_assembly_stock_insert_funct()    FUNCTION     i  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS trigger
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
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity - NEW.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid AND assembly_stock.die_casting_link_uuid IS NOT NULL;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
       slider          postgres    false    12            �           1255    43080 A   assembly_stock_after_die_casting_to_assembly_stock_update_funct()    FUNCTION     Z  CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() RETURNS trigger
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
    SET quantity_in_sa = quantity_in_sa - NEW.production_quantity + NEW.wastage +  OLD.production_quantity + OLD.wastage
    FROM slider.assembly_stock
    WHERE slider.die_casting.uuid = assembly_stock.die_casting_link_uuid AND assembly_stock.uuid = NEW.assembly_stock_uuid AND assembly_stock.die_casting_link_uuid IS NOT NULL;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
       slider          postgres    false    12            �           1255    46235 .   material_stock_after_booking_delete_function()    FUNCTION     >  CREATE FUNCTION slider.material_stock_after_booking_delete_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity,
        booking = booking - OLD.quantity
    WHERE material_uuid =  OLD.material_uuid;
    RETURN OLD;
END;
$$;
 E   DROP FUNCTION slider.material_stock_after_booking_delete_function();
       slider          postgres    false    12            �           1255    46233 .   material_stock_after_booking_insert_function()    FUNCTION     =  CREATE FUNCTION slider.material_stock_after_booking_insert_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock - NEW.quantity,
        booking = booking + NEW.quantity
    WHERE material_uuid = NEW.material_uuid;
    RETURN NEW;
END;
$$;
 E   DROP FUNCTION slider.material_stock_after_booking_insert_function();
       slider          postgres    false    12            �           1255    46234 .   material_stock_after_booking_update_function()    FUNCTION     ^  CREATE FUNCTION slider.material_stock_after_booking_update_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE material.stock 
    SET 
        stock = stock + OLD.quantity - NEW.quantity,
        booking = booking + NEW.quantity - OLD.quantity
    WHERE material_uuid =  NEW.material_uuid;
    RETURN NEW;
END;

$$;
 E   DROP FUNCTION slider.material_stock_after_booking_update_function();
       slider          postgres    false    12            o           1255    43081 8   slider_die_casting_after_die_casting_production_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_delete() RETURNS trigger
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
       slider          postgres    false    12            n           1255    43082 8   slider_die_casting_after_die_casting_production_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() RETURNS trigger
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
       slider          postgres    false    12            p           1255    43083 8   slider_die_casting_after_die_casting_production_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_update() RETURNS trigger
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
       slider          postgres    false    12            s           1255    43084 3   slider_die_casting_after_trx_against_stock_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() RETURNS trigger
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
       slider          postgres    false    12            r           1255    43085 3   slider_die_casting_after_trx_against_stock_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() RETURNS trigger
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
       slider          postgres    false    12            t           1255    43086 3   slider_die_casting_after_trx_against_stock_update()    FUNCTION     �  CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_update() RETURNS trigger
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
       slider          postgres    false    12            �           1255    43087 0   slider_stock_after_coloring_transaction_delete()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS trigger
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
       slider          postgres    false    12            q           1255    43088 0   slider_stock_after_coloring_transaction_insert()    FUNCTION       CREATE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS trigger
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
       slider          postgres    false    12            �           1255    43089 0   slider_stock_after_coloring_transaction_update()    FUNCTION     E  CREATE FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS trigger
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
       slider          postgres    false    12            u           1255    43090 3   slider_stock_after_die_casting_transaction_delete()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS trigger
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
       slider          postgres    false    12            w           1255    43091 3   slider_stock_after_die_casting_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS trigger
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
       slider          postgres    false    12            x           1255    43092 3   slider_stock_after_die_casting_transaction_update()    FUNCTION     S  CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS trigger
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
       slider          postgres    false    12            �           1255    43093 -   slider_stock_after_slider_production_delete()    FUNCTION        CREATE FUNCTION slider.slider_stock_after_slider_production_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT vodf.order_type INTO order_type
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON fb.uuid = ss.finishing_batch_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
    WHERE ss.uuid = NEW.stock_uuid;
   
    -- Update slider.stock table for 'sa_prod' section
    IF OLD.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod - OLD.production_quantity,
            sa_prod_weight = sa_prod_weight - OLD.weight,
            body_quantity =  body_quantity + OLD.production_quantity,
            cap_quantity = cap_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity + OLD.production_quantity,
            link_quantity = link_quantity + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity ELSE 0 END
        FROM zipper.finishing_batch fb
        LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
        WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF OLD.section = 'coloring' THEN
        IF order_type = 'slider' THEN 
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight + OLD.weight,
                coloring_prod = coloring_prod - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        ELSE
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight + OLD.weight,
                box_pin_quantity = box_pin_quantity + CASE WHEN lower(vodf.end_type_name) = 'open end' THEN OLD.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity + CASE WHEN lower(vodf.end_type_name) = 'close end' THEN OLD.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity + (2 * OLD.production_quantity),
                coloring_prod = coloring_prod - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        END IF;
    END IF;

    RETURN OLD;
END;
$$;
 D   DROP FUNCTION slider.slider_stock_after_slider_production_delete();
       slider          postgres    false    12            �           1255    43094 -   slider_stock_after_slider_production_insert()    FUNCTION     Y  CREATE FUNCTION slider.slider_stock_after_slider_production_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT vodf.order_type INTO order_type
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON fb.uuid = ss.finishing_batch_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
    WHERE ss.uuid = NEW.stock_uuid;
    
    -- Update slider.stock table for 'sa_prod' section
    IF NEW.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod + NEW.production_quantity,
            sa_prod_weight = sa_prod_weight + NEW.weight,
            body_quantity = body_quantity - NEW.production_quantity,
            cap_quantity = cap_quantity - NEW.production_quantity,
            puller_quantity = puller_quantity - NEW.production_quantity,
            link_quantity = link_quantity - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity ELSE 0 END
        WHERE slider.stock.uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF NEW.section = 'coloring' THEN
        IF order_type = 'slider' THEN 
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight,
                coloring_prod = coloring_prod + NEW.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        ELSE
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight,
                box_pin_quantity = box_pin_quantity - CASE WHEN lower(vodf.end_type_name) = 'open end' THEN NEW.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity - CASE WHEN lower(vodf.end_type_name) = 'close end' THEN NEW.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity - (2 * NEW.production_quantity),
                coloring_prod = coloring_prod + NEW.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;
 D   DROP FUNCTION slider.slider_stock_after_slider_production_insert();
       slider          postgres    false    12            v           1255    43095 -   slider_stock_after_slider_production_update()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_slider_production_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT vodf.order_type INTO order_type
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON fb.uuid = ss.finishing_batch_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
    WHERE ss.uuid = NEW.stock_uuid;

    -- Update slider.stock table for 'sa_prod' section
    IF NEW.section = 'sa_prod' THEN
        UPDATE slider.stock
        SET
            sa_prod = sa_prod + NEW.production_quantity - OLD.production_quantity,
            sa_prod_weight = sa_prod_weight + NEW.weight - OLD.weight,
            cap_quantity = cap_quantity - NEW.production_quantity + OLD.production_quantity,
            puller_quantity = puller_quantity - NEW.production_quantity + OLD.production_quantity,
            link_quantity = link_quantity - CASE WHEN NEW.with_link = 1 THEN NEW.production_quantity ELSE 0 END + CASE WHEN OLD.with_link = 1 THEN OLD.production_quantity ELSE 0 END
        WHERE stock.uuid = NEW.stock_uuid;
    END IF;

    -- Update slider.stock table for 'coloring' section
    IF NEW.section = 'coloring' THEN
        IF order_type = 'slider' THEN 
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight + OLD.weight,
                coloring_prod = coloring_prod + NEW.production_quantity - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        ELSE
            UPDATE slider.stock
            SET
                coloring_stock = coloring_stock - NEW.production_quantity + OLD.production_quantity,
                coloring_stock_weight = coloring_stock_weight - NEW.weight + OLD.weight,
                box_pin_quantity = box_pin_quantity - CASE WHEN lower(vodf.end_type_name) = 'open end' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END,
                h_bottom_quantity = h_bottom_quantity - CASE WHEN lower(vodf.end_type_name) = 'close end' THEN NEW.production_quantity - OLD.production_quantity ELSE 0 END,
                u_top_quantity = u_top_quantity - (2 * (NEW.production_quantity - OLD.production_quantity)),
                coloring_prod = coloring_prod + NEW.production_quantity - OLD.production_quantity,
                coloring_prod_weight = coloring_prod_weight + NEW.weight - OLD.weight
            FROM zipper.finishing_batch fb
            LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
            WHERE fb.uuid = slider.stock.finishing_batch_uuid AND slider.stock.uuid = NEW.stock_uuid;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;
 D   DROP FUNCTION slider.slider_stock_after_slider_production_update();
       slider          postgres    false    12            �           1255    43096 '   slider_stock_after_transaction_delete()    FUNCTION     J  CREATE FUNCTION slider.slider_stock_after_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT od.order_type INTO order_type 
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    LEFT JOIN zipper.order_description od ON fb.order_description_uuid = od.uuid
    WHERE ss.uuid = OLD.stock_uuid;
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod 
            + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        sa_prod_weight = sa_prod_weight 
            + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.weight ELSE 0 END
            - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.weight ELSE 0 END,
        coloring_stock = coloring_stock 
            + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
            - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock_weight = coloring_stock_weight
            + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
            - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
    WHERE uuid = OLD.stock_uuid;

    IF OLD.from_section = 'coloring_prod' AND OLD.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
            coloring_prod = coloring_prod + OLD.trx_quantity,
            coloring_prod_weight = coloring_prod_weight + OLD.weight,
            trx_to_finishing = trx_to_finishing - OLD.trx_quantity,
            trx_to_finishing_weight = trx_to_finishing_weight - OLD.weight
        WHERE uuid = OLD.stock_uuid;

        IF order_type = 'slider' THEN
            UPDATE zipper.finishing_batch_entry
            SET
                finishing_prod = finishing_prod - OLD.trx_quantity
            WHERE uuid = OLD.finishing_batch_entry_uuid;
        ELSE
            UPDATE zipper.finishing_batch
            SET
                slider_finishing_stock = slider_finishing_stock - OLD.trx_quantity
            WHERE uuid = (SELECT finishing_batch_uuid FROM slider.stock WHERE uuid = OLD.stock_uuid);
        END IF;
    END IF;

    IF OLD.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.weight ELSE 0 END
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
       slider          postgres    false    12            �           1255    43097 '   slider_stock_after_transaction_insert()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT od.order_type INTO order_type 
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    LEFT JOIN zipper.order_description od ON fb.order_description_uuid = od.uuid
    WHERE ss.uuid = NEW.stock_uuid;
    --update slider.stock table
    UPDATE slider.stock
    SET
        sa_prod = sa_prod - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END,
        sa_prod_weight = sa_prod_weight - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.weight ELSE 0 END,
        coloring_stock = coloring_stock - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
        coloring_stock_weight = coloring_stock_weight - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
    WHERE uuid = NEW.stock_uuid;

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'trx_to_finishing' THEN
        UPDATE slider.stock
        SET
            coloring_prod = coloring_prod - NEW.trx_quantity,
            coloring_prod_weight = coloring_prod_weight - NEW.weight,
            trx_to_finishing = trx_to_finishing + NEW.trx_quantity,
            trx_to_finishing_weight = trx_to_finishing_weight + NEW.weight
        WHERE uuid = NEW.stock_uuid;

        IF order_type = 'slider' THEN
            UPDATE zipper.finishing_batch_entry
            SET
                finishing_prod = finishing_prod + NEW.trx_quantity
            WHERE uuid = NEW.finishing_batch_entry_uuid;
        ELSE
            UPDATE zipper.finishing_batch
            SET
                slider_finishing_stock = slider_finishing_stock + NEW.trx_quantity
            WHERE uuid = (SELECT finishing_batch_uuid FROM slider.stock WHERE uuid = NEW.stock_uuid);
        END IF;
    END IF;

    IF NEW.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.weight ELSE 0 END
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
       slider          postgres    false    12            |           1255    43098 '   slider_stock_after_transaction_update()    FUNCTION     �  CREATE FUNCTION slider.slider_stock_after_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type TEXT;
BEGIN
    SELECT od.order_type INTO order_type 
    FROM slider.stock ss
    LEFT JOIN zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    LEFT JOIN zipper.order_description od ON fb.order_description_uuid = od.uuid
    WHERE ss.uuid = NEW.stock_uuid;
    --update slider.stock table
    UPDATE slider.stock
    SET
        
        sa_prod = sa_prod 
        - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.trx_quantity ELSE 0 END,
        sa_prod_weight = sa_prod_weight
        - CASE WHEN NEW.from_section = 'sa_prod' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'sa_prod' THEN NEW.weight ELSE 0 END
        + CASE WHEN OLD.from_section = 'sa_prod' THEN OLD.weight ELSE 0 END
        - CASE WHEN OLD.to_section = 'sa_prod' THEN OLD.weight ELSE 0 END,
        coloring_stock = coloring_stock 
        - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.trx_quantity ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
        coloring_stock_weight = coloring_stock_weight
        - CASE WHEN NEW.from_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
        + CASE WHEN NEW.to_section = 'coloring_stock' THEN NEW.weight ELSE 0 END
        + CASE WHEN OLD.from_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
        - CASE WHEN OLD.to_section = 'coloring_stock' THEN OLD.weight ELSE 0 END
    WHERE uuid = NEW.stock_uuid;

    IF NEW.from_section = 'coloring_prod' AND NEW.to_section = 'trx_to_finishing'
    THEN
        UPDATE slider.stock
        SET
            coloring_prod = coloring_prod - NEW.trx_quantity + OLD.trx_quantity,
            coloring_prod_weight = coloring_prod_weight - NEW.weight + OLD.weight,
            trx_to_finishing = trx_to_finishing + NEW.trx_quantity - OLD.trx_quantity,
            trx_to_finishing_weight = trx_to_finishing_weight + NEW.weight - OLD.weight
        WHERE uuid = NEW.stock_uuid;

        IF order_type = 'slider' THEN
            UPDATE zipper.finishing_batch_entry
            SET
                finishing_prod = finishing_prod + NEW.trx_quantity - OLD.trx_quantity
            WHERE uuid = NEW.finishing_batch_entry_uuid;
        ELSE
            UPDATE zipper.finishing_batch
            SET
                slider_finishing_stock = slider_finishing_stock - NEW.trx_quantity + OLD.trx_quantity
            WHERE uuid = (SELECT finishing_batch_uuid FROM slider.stock WHERE uuid = NEW.stock_uuid);
        END IF;
    END IF;

    -- assembly_stock_uuid -> OLD
    IF OLD.assembly_stock_uuid IS NOT NULL
    THEN
        UPDATE slider.stock
        SET
            coloring_stock = coloring_stock 
            - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight
            - CASE WHEN OLD.to_section = 'assembly_stock_to_coloring_stock' THEN OLD.weight ELSE 0 END
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
            coloring_stock = coloring_stock + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.trx_quantity ELSE 0 END,
            coloring_stock_weight = coloring_stock_weight + CASE WHEN NEW.to_section = 'assembly_stock_to_coloring_stock' THEN NEW.weight ELSE 0 END
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
       slider          postgres    false    12            �           1255    46212 7   stock_after_zipper_finishing_batch_entry_delete_funct()    FUNCTION     A  CREATE FUNCTION slider.stock_after_zipper_finishing_batch_entry_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE slider.stock
    SET
        batch_quantity = batch_quantity - OLD.quantity
    WHERE 
        finishing_batch_uuid = OLD.finishing_batch_uuid;
    RETURN OLD;
END;
$$;
 N   DROP FUNCTION slider.stock_after_zipper_finishing_batch_entry_delete_funct();
       slider          postgres    false    12            y           1255    43100 *   order_entry_after_batch_is_dyeing_update()    FUNCTION       CREATE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS trigger
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
       thread          postgres    false    13            �           1255    46195 A   finishing_batch_entry_after_finishing_batch_entry_transaction_d()    FUNCTION     �	  CREATE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_d() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Updating stocks and productions based on OLD.trx_to and OLD.trx_from
    UPDATE zipper.finishing_batch_entry
    SET
        teeth_coloring_stock = teeth_coloring_stock - 
            CASE 
                WHEN OLD.trx_to = 'teeth_coloring_stock' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_stock = finishing_stock - 
            CASE 
                WHEN OLD.trx_to = 'finishing_stock' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        warehouse = warehouse - 
            CASE 
                WHEN OLD.trx_to = 'warehouse' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN OLD.trx_from = 'teeth_molding_prod' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_prod = finishing_prod + 
            CASE 
                WHEN OLD.trx_from = 'finishing_prod' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        warehouse = warehouse + 
            CASE 
                WHEN OLD.trx_from = 'warehouse' THEN 
                    CASE 
                        WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity 
                        ELSE OLD.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END
    WHERE uuid = OLD.finishing_batch_entry_uuid;

    RETURN OLD;
END;
$$;
 X   DROP FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_d();
       zipper          postgres    false    14            �           1255    46194 A   finishing_batch_entry_after_finishing_batch_entry_transaction_i()    FUNCTION     �	  CREATE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_i() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Updating stocks and productions based on NEW.trx_to and NEW.trx_from
    UPDATE zipper.finishing_batch_entry
    SET
        teeth_coloring_stock = teeth_coloring_stock + 
            CASE 
                WHEN NEW.trx_to = 'teeth_coloring_stock' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_stock = finishing_stock + 
            CASE 
                WHEN NEW.trx_to = 'finishing_stock' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        warehouse = warehouse + 
            CASE 
                WHEN NEW.trx_to = 'warehouse' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        teeth_molding_prod = teeth_molding_prod - 
            CASE 
                WHEN NEW.trx_from = 'teeth_molding_prod' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        finishing_prod = finishing_prod - 
            CASE 
                WHEN NEW.trx_from = 'finishing_prod' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END,
        warehouse = warehouse - 
            CASE 
                WHEN NEW.trx_from = 'warehouse' THEN 
                    CASE 
                        WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity 
                        ELSE NEW.trx_quantity_in_kg 
                    END 
                ELSE 0 
            END
    WHERE uuid = NEW.finishing_batch_entry_uuid;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_i();
       zipper          postgres    false    14            �           1255    46196 A   finishing_batch_entry_after_finishing_batch_entry_transaction_u()    FUNCTION     "
  CREATE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_u() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Updating stocks and productions based on OLD.trx_to, NEW.trx_to, OLD.trx_from, and NEW.trx_from
    UPDATE zipper.finishing_batch_entry
    SET
        teeth_coloring_stock = teeth_coloring_stock 
            - CASE WHEN OLD.trx_to = 'teeth_coloring_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'teeth_coloring_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        finishing_stock = finishing_stock 
            - CASE WHEN OLD.trx_to = 'finishing_stock' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'finishing_stock' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        warehouse = warehouse 
            - CASE WHEN OLD.trx_to = 'warehouse' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            + CASE WHEN NEW.trx_to = 'warehouse' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        teeth_molding_prod = teeth_molding_prod 
            + CASE WHEN OLD.trx_from = 'teeth_molding_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'teeth_molding_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        finishing_prod = finishing_prod 
            + CASE WHEN OLD.trx_from = 'finishing_prod' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'finishing_prod' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END,
        warehouse = warehouse 
            + CASE WHEN OLD.trx_from = 'warehouse' THEN CASE WHEN OLD.trx_quantity_in_kg = 0 THEN OLD.trx_quantity ELSE OLD.trx_quantity_in_kg END ELSE 0 END
            - CASE WHEN NEW.trx_from = 'warehouse' THEN CASE WHEN NEW.trx_quantity_in_kg = 0 THEN NEW.trx_quantity ELSE NEW.trx_quantity_in_kg END ELSE 0 END
    WHERE uuid = NEW.finishing_batch_entry_uuid;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_u();
       zipper          postgres    false    14            �           1255    46192 A   finishing_batch_entry_after_finishing_batch_production_delete_f()    FUNCTION     �  CREATE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_delete_f() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    item_name TEXT;
    nylon_stopper_name TEXT;
    order_type TEXT;
BEGIN
    -- Fetch item_name and finishing_batch_uuid once
    SELECT vodf.item_name, vodf.nylon_stopper_name, vodf.order_type INTO item_name, nylon_stopper_name, order_type
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = OLD.finishing_batch_entry_uuid;

    -- Update finishing_batch_entry based on item_name and section
    UPDATE zipper.finishing_batch_entry fbe
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN OLD.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod - 
            CASE 
                WHEN OLD.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN OLD.production_quantity
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
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                        ELSE OLD.production_quantity_in_kg
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
                        WHEN OLD.production_quantity_in_kg = 0 THEN OLD.production_quantity
                        ELSE OLD.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE fbe.uuid = OLD.finishing_batch_entry_uuid;

    -- Update finishing_batch based on item_name and section AND if order_type is not tape
    IF lower(item_name) IN ('metal', 'vislon', 'nylon') AND order_type != 'tape' THEN
        UPDATE zipper.finishing_batch fb
        SET 
            slider_finishing_stock = slider_finishing_stock + 
                CASE 
                    WHEN OLD.section = 'finishing' THEN OLD.production_quantity
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = OLD.finishing_batch_entry_uuid;
    END IF;

    RETURN OLD;
END;
$$;
 X   DROP FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_delete_f();
       zipper          postgres    false    14            �           1255    46188 A   finishing_batch_entry_after_finishing_batch_production_insert_f()    FUNCTION     �  CREATE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_insert_f() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    item_name TEXT;
    nylon_stopper_name TEXT;
    order_type TEXT;
BEGIN
    -- Fetch item_name and finishing_batch_uuid once
    SELECT vodf.item_name, vodf.nylon_stopper_name, vodf.order_type INTO item_name, nylon_stopper_name, order_type
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch_entry based on item_name and section
    UPDATE zipper.finishing_batch_entry fbe
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN NEW.production_quantity 
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity
                        ELSE NEW.production_quantity_in_kg
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity
                        ELSE NEW.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE fbe.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch based on item_name and section AND if order_type is not tape
    IF lower(item_name) IN ('metal', 'vislon', 'nylon') AND order_type != 'tape' THEN
        UPDATE zipper.finishing_batch fb
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity 
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = NEW.finishing_batch_entry_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_insert_f();
       zipper          postgres    false    14            �           1255    46190 A   finishing_batch_entry_after_finishing_batch_production_update_f()    FUNCTION     �  CREATE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_update_f() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    item_name TEXT;
    nylon_stopper_name TEXT;
    order_type TEXT;
BEGIN
    -- Fetch item_name and finishing_batch_uuid once
    SELECT vodf.item_name, vodf.nylon_stopper_name, vodf.order_type INTO item_name, nylon_stopper_name, order_type
    FROM zipper.finishing_batch_entry finishing_batch_entry
    LEFT JOIN zipper.sfg sfg ON sfg.uuid = finishing_batch_entry.sfg_uuid
    LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    WHERE finishing_batch_entry.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch_entry based on item_name and section
    UPDATE zipper.finishing_batch_entry fbe
    SET 
        dyed_tape_used_in_kg = dyed_tape_used_in_kg + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN NEW.dyed_tape_used_in_kg - OLD.dyed_tape_used_in_kg
                ELSE 0
            END,
        teeth_molding_prod = teeth_molding_prod + 
            CASE 
                WHEN NEW.section = 'teeth_molding' THEN 
                    CASE 
                        WHEN lower(item_name) = 'metal' THEN NEW.production_quantity - OLD.production_quantity
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                        ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
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
                        WHEN NEW.production_quantity_in_kg = 0 THEN NEW.production_quantity - OLD.production_quantity
                        ELSE NEW.production_quantity_in_kg - OLD.production_quantity_in_kg
                    END 
                ELSE 0 
            END
    WHERE fbe.uuid = NEW.finishing_batch_entry_uuid;

    -- Update finishing_batch based on item_name and section AND if order_type is not tape
    IF lower(item_name) IN ('metal', 'vislon', 'nylon') AND order_type != 'tape' THEN
        UPDATE zipper.finishing_batch fb
        SET 
            slider_finishing_stock = slider_finishing_stock -
                CASE 
                    WHEN NEW.section = 'finishing' THEN NEW.production_quantity - OLD.production_quantity
                    ELSE 0
                END
        FROM zipper.finishing_batch_entry fbe
        WHERE fbe.finishing_batch_uuid = fb.uuid AND fbe.uuid = NEW.finishing_batch_entry_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_update_f();
       zipper          postgres    false    14            �           1255    45137 6   multi_color_dashboard_after_order_description_delete()    FUNCTION     $  CREATE FUNCTION zipper.multi_color_dashboard_after_order_description_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.is_multi_color = 1 THEN
        DELETE FROM zipper.multi_color_dashboard
        WHERE order_description_uuid = OLD.uuid;
    END IF;
END;
$$;
 M   DROP FUNCTION zipper.multi_color_dashboard_after_order_description_delete();
       zipper          postgres    false    14            �           1255    45135 6   multi_color_dashboard_after_order_description_insert()    FUNCTION     �  CREATE FUNCTION zipper.multi_color_dashboard_after_order_description_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.is_multi_color = 1 THEN
        INSERT INTO zipper.multi_color_dashboard (
            uuid, 
            order_description_uuid
        ) VALUES (
            NEW.uuid, 
            NEW.uuid
        );
    END IF;
    RETURN NEW;
END;
$$;
 M   DROP FUNCTION zipper.multi_color_dashboard_after_order_description_insert();
       zipper          postgres    false    14            �           1255    45136 6   multi_color_dashboard_after_order_description_update()    FUNCTION     �  CREATE FUNCTION zipper.multi_color_dashboard_after_order_description_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- if is_multi_color is updated to 1 then insert into multi_color_dashboard table
    IF NEW.is_multi_color = 1 AND OLD.is_multi_color = 0 THEN
        INSERT INTO zipper.multi_color_dashboard (
            uuid, 
            order_description_uuid
        ) VALUES (
            NEW.uuid, 
            NEW.uuid
        );
    -- if is_multi_color is updated to 0 then delete from multi_color_dashboard table
    ELSIF NEW.is_multi_color = 0 AND OLD.is_multi_color = 1 THEN
        DELETE FROM zipper.multi_color_dashboard
        WHERE order_description_uuid = NEW.uuid;
    END IF;
    RETURN NEW;
END;
$$;
 M   DROP FUNCTION zipper.multi_color_dashboard_after_order_description_update();
       zipper          postgres    false    14            {           1255    43101 6   order_description_after_dyed_tape_transaction_delete()    FUNCTION     4  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type_val TEXT;
BEGIN
    SELECT order_type INTO order_type_val
    FROM zipper.order_description
    WHERE uuid = OLD.order_description_uuid;
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + OLD.trx_quantity,
        tape_transferred = tape_transferred - OLD.trx_quantity
    WHERE order_description.uuid = OLD.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod - OLD.trx_quantity_in_meter
        WHERE uuid = OLD.sfg_uuid;
    END IF;

    RETURN OLD;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
       zipper          postgres    false    14            z           1255    43102 6   order_description_after_dyed_tape_transaction_insert()    FUNCTION     5  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type_val TEXT;
BEGIN
    SELECT order_type INTO order_type_val
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received - NEW.trx_quantity,
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

   IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod + NEW.trx_quantity_in_meter
        WHERE uuid = NEW.sfg_uuid;
    END IF;

    RETURN NEW;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
       zipper          postgres    false    14            �           1255    43103 6   order_description_after_dyed_tape_transaction_update()    FUNCTION     x  CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type_val TEXT;
BEGIN
    SELECT order_type INTO order_type_val
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + OLD.trx_quantity - NEW.trx_quantity,
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod + NEW.trx_quantity_in_meter - OLD.trx_quantity_in_meter
        WHERE uuid = NEW.sfg_uuid;
    END IF;

    RETURN NEW;
END;

$$;
 M   DROP FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
       zipper          postgres    false    14            �           1255    45112 9   order_description_after_multi_color_tape_receive_delete()    FUNCTION     l  CREATE FUNCTION zipper.order_description_after_multi_color_tape_receive_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received - OLD.quantity
    WHERE order_description.uuid = OLD.order_description_uuid;

    RETURN OLD;
END;

$$;
 P   DROP FUNCTION zipper.order_description_after_multi_color_tape_receive_delete();
       zipper          postgres    false    14            �           1255    45110 9   order_description_after_multi_color_tape_receive_insert()    FUNCTION     n  CREATE FUNCTION zipper.order_description_after_multi_color_tape_receive_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + NEW.quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 P   DROP FUNCTION zipper.order_description_after_multi_color_tape_receive_insert();
       zipper          postgres    false    14            �           1255    45111 9   order_description_after_multi_color_tape_receive_update()    FUNCTION     {  CREATE FUNCTION zipper.order_description_after_multi_color_tape_receive_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update order_description
    UPDATE zipper.order_description
    SET
        tape_received = tape_received - OLD.quantity + NEW.quantity
    WHERE order_description.uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 P   DROP FUNCTION zipper.order_description_after_multi_color_tape_receive_update();
       zipper          postgres    false    14            }           1255    43104 4   order_description_after_tape_coil_to_dyeing_delete()    FUNCTION     �  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43105 4   order_description_after_tape_coil_to_dyeing_insert()    FUNCTION     p  CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE zipper.tape_coil
    SET
        quantity_in_coil = CASE WHEN lower(properties.name) = 'nylon' THEN quantity_in_coil - NEW.trx_quantity ELSE quantity_in_coil END,
        quantity = CASE WHEN lower(properties.name) = 'nylon' THEN quantity ELSE quantity - NEW.trx_quantity END
    FROM public.properties
    WHERE tape_coil.uuid = NEW.tape_coil_uuid AND properties.uuid = tape_coil.item_uuid;
    -- TODO: if is_multi_color is 1 then Do not update the zipper.order_description
    --* INFO: Condition changed, multicolor will be treated as normal tape
    UPDATE zipper.order_description
    SET
        tape_received = tape_received + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;
$$;
 K   DROP FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
       zipper          postgres    false    14            �           1255    43106 4   order_description_after_tape_coil_to_dyeing_update()    FUNCTION       CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() RETURNS trigger
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
       zipper          postgres    false    14            ~           1255    43107    sfg_after_order_entry_delete()    FUNCTION     �   CREATE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;
 5   DROP FUNCTION zipper.sfg_after_order_entry_delete();
       zipper          postgres    false    14                       1255    43108    sfg_after_order_entry_insert()    FUNCTION       CREATE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS trigger
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
       zipper          postgres    false    14            m           1255    43115 A   stock_after_material_trx_against_order_description_delete_funct()    FUNCTION     c  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock + OLD.trx_quantity
    WHERE material_uuid = OLD.material_uuid;

    IF (OLD.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity + OLD.trx_quantity,
            trx_quantity = trx_quantity - OLD.trx_quantity
        WHERE uuid = OLD.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting
    IF (OLD.trx_to = 'slider_assembly') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity - OLD.trx_quantity,
            weight = weight - OLD.weight
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    IF (OLD.trx_to = 'tape_making') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity - OLD.trx_quantity
        WHERE material_uuid = OLD.material_uuid;
    END IF;

    RETURN OLD;
END;
$$;
 X   DROP FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
       zipper          postgres    false    14            �           1255    43116 A   stock_after_material_trx_against_order_description_insert_funct()    FUNCTION     c  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update material,stock
    UPDATE material.stock
    SET
        stock = stock - NEW.trx_quantity
    WHERE material_uuid = NEW.material_uuid;

    IF (NEW.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity - NEW.trx_quantity,
            trx_quantity = trx_quantity + NEW.trx_quantity
        WHERE uuid = NEW.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting
    IF (NEW.trx_to = 'slider_assembly') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity + NEW.trx_quantity,
            weight = weight + NEW.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF (NEW.trx_to = 'tape_making') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity + NEW.trx_quantity
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
       zipper          postgres    false    14            �           1255    43117 A   stock_after_material_trx_against_order_description_update_funct()    FUNCTION     �  CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS trigger
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

    IF (NEW.booking_uuid IS NOT NULL) THEN
        UPDATE material.booking
        SET
            quantity = quantity 
                - NEW.trx_quantity
                + OLD.trx_quantity,
            trx_quantity = trx_quantity
                + NEW.trx_quantity
                - OLD.trx_quantity
        WHERE uuid = NEW.booking_uuid;
    END IF;

    -- update slider.slider_assembly if material is present in die casting
    IF (NEW.trx_to = 'slider_assembly') THEN
        UPDATE slider.assembly_stock
        SET
            quantity = quantity 
                + NEW.trx_quantity
                - OLD.trx_quantity,
            weight = weight
                + NEW.weight
                - OLD.weight
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    IF (NEW.trx_to = 'tape_making') THEN
        UPDATE zipper.tape_coil
        SET
            quantity = quantity 
                + NEW.trx_quantity
                - OLD.trx_quantity
        WHERE material_uuid = NEW.material_uuid;
    END IF;

    RETURN NEW;
END;
$$;
 X   DROP FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
       zipper          postgres    false    14            �           1255    43118 &   tape_coil_after_tape_coil_production()    FUNCTION     	  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43119 -   tape_coil_after_tape_coil_production_delete()    FUNCTION       CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43120 -   tape_coil_after_tape_coil_production_update()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43121 !   tape_coil_after_tape_trx_delete()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43122 !   tape_coil_after_tape_trx_insert()    FUNCTION       CREATE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43123 !   tape_coil_after_tape_trx_update()    FUNCTION     	  CREATE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS trigger
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
       zipper          postgres    false    14            �           1255    43124 A   tape_coil_and_order_description_after_dyed_tape_transaction_del()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type_val TEXT;
    is_multi_color_tape INTEGER;
BEGIN
    SELECT order_type, is_multi_color INTO order_type_val, is_multi_color_tape
    FROM zipper.order_description
    WHERE uuid = OLD.order_description_uuid;

    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity + CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE OLD.trx_quantity END
    WHERE uuid = OLD.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        -- multi_color_tape_received = multi_color_tape_received + CASE WHEN is_multi_color_tape = 1 THEN OLD.trx_quantity ELSE 0 END,
        tape_transferred = tape_transferred - OLD.trx_quantity
    WHERE uuid = OLD.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod - OLD.trx_quantity_in_meter
        WHERE uuid = OLD.sfg_uuid;
    END IF;

    RETURN OLD;
END;

$$;
 X   DROP FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
       zipper          postgres    false    14            �           1255    43125 A   tape_coil_and_order_description_after_dyed_tape_transaction_ins()    FUNCTION     �  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type_val TEXT;
    is_multi_color_tape INTEGER;
BEGIN
    SELECT order_type, is_multi_color INTO order_type_val, is_multi_color_tape
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    
    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity - CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE NEW.trx_quantity END
    WHERE uuid = NEW.tape_coil_uuid;
    
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        -- multi_color_tape_received = multi_color_tape_received - CASE WHEN is_multi_color_tape = 1 THEN NEW.trx_quantity ELSE 0 END,
        tape_transferred = tape_transferred + NEW.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod + NEW.trx_quantity_in_meter
        WHERE uuid = NEW.sfg_uuid;
    END IF;

    RETURN NEW;
END;

$$;
 X   DROP FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
       zipper          postgres    false    14            �           1255    43126 A   tape_coil_and_order_description_after_dyed_tape_transaction_upd()    FUNCTION     ]  CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    order_type_val TEXT;
    is_multi_color_tape INTEGER;
BEGIN
    SELECT order_type, is_multi_color INTO order_type_val, is_multi_color_tape
    FROM zipper.order_description
    WHERE uuid = NEW.order_description_uuid;

    -- Update zipper.tape_coil
    UPDATE zipper.tape_coil
    SET
        stock_quantity = stock_quantity + CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE OLD.trx_quantity END - CASE WHEN is_multi_color_tape = 1 THEN 0 ELSE NEW.trx_quantity END
    WHERE uuid = NEW.tape_coil_uuid;
    -- Update zipper.order_description
    UPDATE zipper.order_description
    SET
        -- multi_color_tape_received = multi_color_tape_received + CASE WHEN is_multi_color_tape = 1 THEN OLD.trx_quantity ELSE 0 END - CASE WHEN is_multi_color_tape = 1 THEN NEW.trx_quantity ELSE 0 END,
        tape_transferred = tape_transferred + NEW.trx_quantity - OLD.trx_quantity
    WHERE uuid = NEW.order_description_uuid;

    IF order_type_val = 'tape' THEN
        -- Update zipper.sfg
        UPDATE zipper.sfg
        SET
            finishing_prod = finishing_prod + NEW.trx_quantity_in_meter - OLD.trx_quantity_in_meter
        WHERE uuid = NEW.sfg_uuid;
    END IF;

    RETURN NEW;
END;

$$;
 X   DROP FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
       zipper          postgres    false    14            �           1255    46227 7   zipper_order_description_after_finishing_batch_update()    FUNCTION     @  CREATE FUNCTION zipper.zipper_order_description_after_finishing_batch_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN
    UPDATE zipper.order_description
    SET
        slider_finishing_stock = NEW.slider_finishing_stock
    WHERE uuid = NEW.order_description_uuid;

    RETURN NEW;
END;

$$;
 N   DROP FUNCTION zipper.zipper_order_description_after_finishing_batch_update();
       zipper          postgres    false    14            �           1255    46229 /   zipper_sfg_after_dyeing_batch_received_update()    FUNCTION     O  CREATE FUNCTION zipper.zipper_sfg_after_dyeing_batch_received_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

    UPDATE zipper.sfg
    SET
        dying_and_iron_prod = dying_and_iron_prod 
            + CASE WHEN (NEW.received = 1 AND OLD.received = 0) THEN be.production_quantity_in_kg ELSE 0 END 
            - CASE WHEN (NEW.received = 0 AND OLD.received = 1) THEN be.production_quantity_in_kg ELSE 0 END
    FROM zipper.dyeing_batch_entry be
    WHERE
         zipper.sfg.uuid = be.sfg_uuid AND be.dyeing_batch_uuid = NEW.uuid;

    RETURN NEW;
END;

$$;
 F   DROP FUNCTION zipper.zipper_sfg_after_dyeing_batch_received_update();
       zipper          postgres    false    14            �           1255    46231 /   zipper_sfg_after_finishing_batch_entry_update()    FUNCTION     �  CREATE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    sfg_uuid_val TEXT;
    warehouse_val numeric;
    dyed_tape_used_in_kg_val numeric;
    teeth_molding_prod_val numeric;
    teeth_coloring_stock_val numeric;
    finishing_stock_val numeric;
    finishing_prod_val numeric;
BEGIN
        SELECT finishing_batch_entry.sfg_uuid, SUM(finishing_batch_entry.warehouse), SUM(finishing_batch_entry.dyed_tape_used_in_kg), SUM(finishing_batch_entry.teeth_molding_prod), SUM(finishing_batch_entry.teeth_coloring_stock), SUM(finishing_batch_entry.finishing_stock), SUM(finishing_batch_entry.finishing_prod)
        INTO sfg_uuid_val, warehouse_val, dyed_tape_used_in_kg_val, teeth_molding_prod_val, teeth_coloring_stock_val, finishing_stock_val, finishing_prod_val
        FROM zipper.finishing_batch_entry
        WHERE finishing_batch_entry.uuid = NEW.uuid
        GROUP BY finishing_batch_entry.sfg_uuid;
    UPDATE zipper.sfg
    SET
        warehouse = warehouse_val,
        dyed_tape_used_in_kg = dyed_tape_used_in_kg_val,
        teeth_molding_prod = teeth_molding_prod_val,
        teeth_coloring_stock = teeth_coloring_stock_val,
        finishing_stock = finishing_stock_val,
        finishing_prod = finishing_prod_val
    FROM zipper.finishing_batch_entry fbe
    WHERE fbe.uuid = NEW.uuid AND fbe.sfg_uuid = zipper.sfg.uuid;

    RETURN NEW;
END;

$$;
 F   DROP FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update();
       zipper          postgres    false    14            �            1259    43127    bank    TABLE     /  CREATE TABLE commercial.bank (
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
   commercial         heap    postgres    false    5            F           1259    46258    cash_receive    TABLE       CREATE TABLE commercial.cash_receive (
    uuid text NOT NULL,
    pi_cash_uuid text,
    amount numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 $   DROP TABLE commercial.cash_receive;
    
   commercial         heap    postgres    false    5            �            1259    43132    lc_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.lc_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.lc_sequence;
    
   commercial          postgres    false    5            �            1259    43133    lc    TABLE       CREATE TABLE commercial.lc (
    uuid text NOT NULL,
    party_uuid text,
    lc_number text NOT NULL,
    lc_date timestamp without time zone NOT NULL,
    commercial_executive text NOT NULL,
    party_bank text NOT NULL,
    production_complete integer DEFAULT 0,
    lc_cancel integer DEFAULT 0,
    shipment_date timestamp without time zone,
    expiry_date timestamp without time zone,
    at_sight text,
    amd_date timestamp without time zone,
    amd_count integer DEFAULT 0,
    problematical integer DEFAULT 0,
    epz integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    id integer DEFAULT nextval('commercial.lc_sequence'::regclass) NOT NULL,
    is_rtgs integer DEFAULT 0,
    lc_value numeric(20,4) DEFAULT 0 NOT NULL,
    is_old_pi integer DEFAULT 0,
    pi_number text
);
    DROP TABLE commercial.lc;
    
   commercial         heap    postgres    false    220    5            7           1259    45320    lc_entry    TABLE     +  CREATE TABLE commercial.lc_entry (
    uuid text NOT NULL,
    lc_uuid text,
    ldbc_fdbc text,
    handover_date timestamp without time zone,
    document_receive_date timestamp without time zone,
    acceptance_date timestamp without time zone,
    maturity_date timestamp without time zone,
    payment_date timestamp without time zone,
    payment_value numeric(20,4) DEFAULT 0 NOT NULL,
    amount numeric(20,4) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
     DROP TABLE commercial.lc_entry;
    
   commercial         heap    postgres    false    5            <           1259    45552    lc_entry_others    TABLE     P  CREATE TABLE commercial.lc_entry_others (
    uuid text NOT NULL,
    lc_uuid text,
    ud_no text,
    ud_received timestamp without time zone,
    up_number text,
    up_number_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE commercial.lc_entry_others;
    
   commercial         heap    postgres    false    5            6           1259    45319    manual_pi_sequence    SEQUENCE        CREATE SEQUENCE commercial.manual_pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE commercial.manual_pi_sequence;
    
   commercial          postgres    false    5            8           1259    45329 	   manual_pi    TABLE     �  CREATE TABLE commercial.manual_pi (
    uuid text NOT NULL,
    id integer DEFAULT nextval('commercial.manual_pi_sequence'::regclass),
    pi_uuids text[] DEFAULT ARRAY[]::text[] NOT NULL,
    marketing_uuid text,
    party_uuid text,
    buyer_uuid text,
    merchandiser_uuid text,
    factory_uuid text,
    bank_uuid text,
    validity integer DEFAULT 0,
    payment integer DEFAULT 0,
    remarks text,
    created_by text,
    receive_amount numeric(20,4) DEFAULT 0 NOT NULL,
    weight numeric(20,4) DEFAULT 0 NOT NULL,
    date timestamp without time zone,
    pi_number text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone
);
 !   DROP TABLE commercial.manual_pi;
    
   commercial         heap    postgres    false    310    5            9           1259    45342    manual_pi_entry    TABLE     �  CREATE TABLE commercial.manual_pi_entry (
    uuid text NOT NULL,
    manual_pi_uuid text,
    order_number text NOT NULL,
    po text,
    style text,
    item text,
    specification text,
    size text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    unit_price numeric(20,4) DEFAULT 0 NOT NULL,
    is_zipper boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE commercial.manual_pi_entry;
    
   commercial         heap    postgres    false    5            �            1259    43147    pi_sequence    SEQUENCE     x   CREATE SEQUENCE commercial.pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE commercial.pi_sequence;
    
   commercial          postgres    false    5            �            1259    43148    pi_cash    TABLE     �  CREATE TABLE commercial.pi_cash (
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
    thread_order_info_uuids text,
    is_rtgs boolean DEFAULT false
);
    DROP TABLE commercial.pi_cash;
    
   commercial         heap    postgres    false    222    5            �            1259    43160    pi_cash_entry    TABLE     .  CREATE TABLE commercial.pi_cash_entry (
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
   commercial         heap    postgres    false    5            :           1259    45352    carton    TABLE     +  CREATE TABLE delivery.carton (
    uuid text NOT NULL,
    size text NOT NULL,
    name text NOT NULL,
    used_for text NOT NULL,
    active integer DEFAULT 1,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE delivery.carton;
       delivery         heap    postgres    false    6            �            1259    43165    challan_sequence    SEQUENCE     {   CREATE SEQUENCE delivery.challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE delivery.challan_sequence;
       delivery          postgres    false    6            �            1259    43166    challan    TABLE     �  CREATE TABLE delivery.challan (
    uuid text NOT NULL,
    carton_quantity integer DEFAULT 0,
    assign_to text,
    receive_status integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    id integer DEFAULT nextval('delivery.challan_sequence'::regclass),
    gate_pass integer DEFAULT 0,
    order_info_uuid text,
    vehicle_uuid text,
    name text,
    delivery_cost numeric(20,4) DEFAULT 0 NOT NULL,
    is_hand_delivery boolean DEFAULT false,
    thread_order_info_uuid text,
    delivery_date timestamp without time zone,
    is_own boolean DEFAULT false,
    delivery_type text
);
    DROP TABLE delivery.challan;
       delivery         heap    postgres    false    225    6            �            1259    43179    packing_list_sequence    SEQUENCE     �   CREATE SEQUENCE delivery.packing_list_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE delivery.packing_list_sequence;
       delivery          postgres    false    6            �            1259    43180    packing_list    TABLE     <  CREATE TABLE delivery.packing_list (
    uuid text NOT NULL,
    carton_weight text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    order_info_uuid text,
    id integer DEFAULT nextval('delivery.packing_list_sequence'::regclass),
    challan_uuid text,
    carton_uuid text,
    is_warehouse_received boolean DEFAULT false,
    gate_pass integer DEFAULT 0,
    item_for delivery.item_for_enum DEFAULT 'zipper'::delivery.item_for_enum NOT NULL,
    thread_order_info_uuid text
);
 "   DROP TABLE delivery.packing_list;
       delivery         heap    postgres    false    227    1319    1319    6            �            1259    43186    packing_list_entry    TABLE     �  CREATE TABLE delivery.packing_list_entry (
    uuid text NOT NULL,
    packing_list_uuid text,
    sfg_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    short_quantity integer DEFAULT 0,
    reject_quantity integer DEFAULT 0,
    poli_quantity integer DEFAULT 0,
    thread_order_entry_uuid text
);
 (   DROP TABLE delivery.packing_list_entry;
       delivery         heap    postgres    false    6            �            1259    43193    users    TABLE     C  CREATE TABLE hr.users (
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
       hr         heap    postgres    false    8            �            1259    43199    buyer    TABLE     �   CREATE TABLE public.buyer (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE public.buyer;
       public         heap    postgres    false    15            �            1259    43204    factory    TABLE       CREATE TABLE public.factory (
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
       public         heap    postgres    false    15            �            1259    43219    party    TABLE       CREATE TABLE public.party (
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
       public         heap    postgres    false    15            "           1259    43621    thread_order_info_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE thread.thread_order_info_sequence;
       thread          postgres    false    13            #           1259    43622 
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
       thread         heap    postgres    false    290    13            �            1259    43275    order_info_sequence    SEQUENCE     |   CREATE SEQUENCE zipper.order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE zipper.order_info_sequence;
       zipper          postgres    false    14            �            1259    43276 
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
       zipper         heap    postgres    false    240    1070    1070    14            J           1259    46345    v_packing_list    VIEW     �  CREATE VIEW delivery.v_packing_list AS
 SELECT packing_list.uuid,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN packing_list.order_info_uuid
            ELSE packing_list.thread_order_info_uuid
        END AS order_info_uuid,
    row_number() OVER (PARTITION BY
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN packing_list.order_info_uuid
            ELSE packing_list.thread_order_info_uuid
        END ORDER BY packing_list.created_at) AS packing_list_wise_rank,
    packing_list_wise_counts.packing_list_wise_count,
    concat('PL', to_char(packing_list.created_at, 'YY'::text), '-', lpad((packing_list.id)::text, 4, '0'::text)) AS packing_number,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN concat('Z',
            CASE
                WHEN (order_info.is_sample = 1) THEN 'S'::text
                ELSE ''::text
            END, to_char(order_info.created_at, 'YY'::text), '-', lpad((order_info.id)::text, 4, '0'::text))
            ELSE concat('ST',
            CASE
                WHEN (toi.is_sample = 1) THEN 'S'::text
                ELSE ''::text
            END, to_char(toi.created_at, 'YY'::text), '-', lpad((toi.id)::text, 4, '0'::text))
        END AS order_number,
    packing_list.challan_uuid,
        CASE
            WHEN (packing_list.challan_uuid IS NOT NULL) THEN
            CASE
                WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN concat('ZC', to_char(challan.created_at, 'YY'::text), '-', lpad((challan.id)::text, 4, '0'::text))
                ELSE concat('TC', to_char(challan.created_at, 'YY'::text), '-', lpad((challan.id)::text, 4, '0'::text))
            END
            ELSE NULL::text
        END AS challan_number,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN order_info.party_uuid
            ELSE toi.party_uuid
        END AS party_uuid,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN party.name
            ELSE toi_party.name
        END AS party_name,
    carton.size AS carton_size,
    packing_list.carton_weight,
    packing_list.carton_uuid,
    carton.name AS carton_name,
    packing_list.is_warehouse_received,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN order_info.factory_uuid
            ELSE toi.factory_uuid
        END AS factory_uuid,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN factory.name
            ELSE toi_fac.name
        END AS factory_name,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN order_info.buyer_uuid
            ELSE toi.buyer_uuid
        END AS buyer_uuid,
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN buyer.name
            ELSE toi_buyer.name
        END AS buyer_name,
    packing_list.created_by,
    users.name AS created_by_name,
    packing_list.created_at,
    packing_list.updated_at,
    packing_list.remarks,
    packing_list.gate_pass,
    packing_list.item_for
   FROM ((((((((((((delivery.packing_list
     LEFT JOIN hr.users ON ((packing_list.created_by = users.uuid)))
     LEFT JOIN zipper.order_info ON ((packing_list.order_info_uuid = order_info.uuid)))
     LEFT JOIN thread.order_info toi ON ((packing_list.thread_order_info_uuid = toi.uuid)))
     LEFT JOIN delivery.challan ON ((packing_list.challan_uuid = challan.uuid)))
     LEFT JOIN delivery.carton ON ((packing_list.carton_uuid = carton.uuid)))
     LEFT JOIN public.factory ON ((order_info.factory_uuid = factory.uuid)))
     LEFT JOIN public.party ON ((order_info.party_uuid = party.uuid)))
     LEFT JOIN public.buyer ON ((order_info.buyer_uuid = buyer.uuid)))
     LEFT JOIN public.factory toi_fac ON ((toi.factory_uuid = toi_fac.uuid)))
     LEFT JOIN public.buyer toi_buyer ON ((toi.buyer_uuid = toi_buyer.uuid)))
     LEFT JOIN public.party toi_party ON ((toi.party_uuid = toi_party.uuid)))
     LEFT JOIN ( SELECT packing_list_1.order_info_uuid,
            count(*) AS packing_list_wise_count
           FROM delivery.packing_list packing_list_1
          WHERE ((packing_list_1.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list_1.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list_1.item_for = 'slider'::delivery.item_for_enum) OR (packing_list_1.item_for = 'tape'::delivery.item_for_enum))
          GROUP BY packing_list_1.order_info_uuid
        UNION ALL
         SELECT packing_list_1.thread_order_info_uuid AS order_info_uuid,
            count(*) AS packing_list_wise_count
           FROM delivery.packing_list packing_list_1
          WHERE (packing_list_1.item_for <> 'zipper'::delivery.item_for_enum)
          GROUP BY packing_list_1.thread_order_info_uuid) packing_list_wise_counts ON ((packing_list_wise_counts.order_info_uuid =
        CASE
            WHEN ((packing_list.item_for = 'zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'sample_zipper'::delivery.item_for_enum) OR (packing_list.item_for = 'slider'::delivery.item_for_enum) OR (packing_list.item_for = 'tape'::delivery.item_for_enum)) THEN packing_list.order_info_uuid
            ELSE packing_list.thread_order_info_uuid
        END)));
 #   DROP VIEW delivery.v_packing_list;
       delivery          postgres    false    241    232    231    231    230    291    232    291    291    235    235    230    226    226    228    226    228    228    241    228    228    228    228    228    228    228    291    228    228    314    291    314    314    291    228    228    241    291    241    1319    241    241    241    6    1319            �            1259    43209 	   marketing    TABLE       CREATE TABLE public.marketing (
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
       public         heap    postgres    false    15            �            1259    43214    merchandiser    TABLE     $  CREATE TABLE public.merchandiser (
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
       public         heap    postgres    false    15            �            1259    43224 
   properties    TABLE     H  CREATE TABLE public.properties (
    uuid text NOT NULL,
    item_for text NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    short_name text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    order_sheet_name text
);
    DROP TABLE public.properties;
       public         heap    postgres    false    15                       1259    43592    count_length    TABLE     �  CREATE TABLE thread.count_length (
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
       thread         heap    postgres    false    13            !           1259    43605    order_entry    TABLE     5  CREATE TABLE thread.order_entry (
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
    carton_quantity integer DEFAULT 0,
    carton_of_production_quantity integer DEFAULT 0
);
    DROP TABLE thread.order_entry;
       thread         heap    postgres    false    13            �            1259    43249    order_description    TABLE       CREATE TABLE zipper.order_description (
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
    is_cm integer DEFAULT 0,
    is_multi_color integer DEFAULT 0,
    slider_provided zipper.slider_provided_enum DEFAULT 'not_provided'::zipper.slider_provided_enum,
    is_waterproof boolean DEFAULT false,
    multi_color_tape_received numeric(20,4) DEFAULT 0 NOT NULL
);
 %   DROP TABLE zipper.order_description;
       zipper         heap    postgres    false    1067    1298    1073    1067    1298    14            �            1259    43265    order_entry    TABLE     s  CREATE TABLE zipper.order_entry (
    uuid text NOT NULL,
    order_description_uuid text,
    style text NOT NULL,
    color text,
    size text,
    quantity integer NOT NULL,
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
       zipper         heap    postgres    false    1076    14    1076            �            1259    43288    sfg    TABLE     6  CREATE TABLE zipper.sfg (
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
    reject_quantity integer DEFAULT 0,
    dyed_tape_used_in_kg numeric(20,4) DEFAULT 0 NOT NULL,
    batch_quantity numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE zipper.sfg;
       zipper         heap    postgres    false    14            �            1259    43306 	   tape_coil    TABLE     �  CREATE TABLE zipper.tape_coil (
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
    stock_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    material_uuid text
);
    DROP TABLE zipper.tape_coil;
       zipper         heap    postgres    false    14            H           1259    46335    v_order_details_full    VIEW     �  CREATE VIEW zipper.v_order_details_full AS
 SELECT order_info.uuid AS order_info_uuid,
    concat('Z',
        CASE
            WHEN (order_info.is_sample = 1) THEN 'S'::text
            ELSE ''::text
        END, to_char(order_info.created_at, 'YY'::text), '-', lpad((order_info.id)::text, 4, '0'::text)) AS order_number,
    order_info.id,
    order_description.uuid AS order_description_uuid,
    (order_description.tape_received)::double precision AS tape_received,
    (order_description.multi_color_tape_received)::double precision AS multi_color_tape_received,
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
    order_description.slider_provided,
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
    order_description.tape_coil_uuid,
    tc.name AS tape_name,
    order_description.teeth_type,
    op_teeth_type.name AS teeth_type_name,
    op_teeth_type.short_name AS teeth_type_short_name,
    order_description.is_inch,
    order_description.is_meter,
    order_description.is_cm,
    order_description.order_type,
    order_description.is_multi_color,
    order_description.is_waterproof
   FROM (((((((((((((((((((((((((((zipper.order_info
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
     LEFT JOIN zipper.tape_coil tc ON ((tc.uuid = order_description.tape_coil_uuid)))
     LEFT JOIN public.properties op_teeth_type ON ((op_teeth_type.uuid = order_description.teeth_type)));
 '   DROP VIEW zipper.v_order_details_full;
       zipper          postgres    false    235    235    236    243    243    241    230    236    236    238    230    241    241    241    238    238    238    238    238    241    238    238    238    238    241    241    238    238    238    238    238    238    238    238    238    238    238    238    241    241    241    238    238    238    238    238    238    238    238    238    238    241    241    241    238    238    238    238    241    241    241    238    238    238    238    238    238    238    241    238    238    232    232    232    233    231    231    233    234    234    1070    1067    1073    1298    14            I           1259    46340    v_packing_list_details    VIEW     c  CREATE VIEW delivery.v_packing_list_details AS
 SELECT pl.id AS packing_list_id,
    pl.uuid AS packing_list_uuid,
    concat('PL', to_char(pl.created_at, 'YY'::text), '-', lpad((pl.id)::text, 4, '0'::text)) AS packing_number,
    carton.name AS carton_name,
    carton.size AS carton_size,
    pl.carton_weight,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN pl.order_info_uuid
            ELSE pl.thread_order_info_uuid
        END AS order_info_uuid,
    pl.challan_uuid,
    pl.created_by AS created_by_uuid,
    users.name AS created_by_name,
    pl.created_at,
    pl.updated_at,
    pl.remarks,
    pl.is_warehouse_received,
    pl.item_for,
        CASE
            WHEN (pl.challan_uuid IS NOT NULL) THEN
            CASE
                WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN concat('ZC', to_char(ch.created_at, 'YY'::text), '-', lpad((ch.id)::text, 4, '0'::text))
                ELSE concat('TC', to_char(ch.created_at, 'YY'::text), '-', lpad((ch.id)::text, 4, '0'::text))
            END
            ELSE NULL::text
        END AS challan_number,
    pl.gate_pass,
    ch.receive_status,
    ple.uuid AS packing_list_entry_uuid,
    ple.sfg_uuid,
    (ple.quantity)::double precision AS quantity,
    ple.poli_quantity,
    (ple.short_quantity)::double precision AS short_quantity,
    (ple.reject_quantity)::double precision AS reject_quantity,
    ple.created_at AS entry_created_at,
    ple.updated_at AS entry_updated_at,
    ple.remarks AS entry_remarks,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN oe.uuid
            ELSE toe.uuid
        END AS order_entry_uuid,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN oe.style
            ELSE toe.style
        END AS style,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN oe.color
            ELSE toe.color
        END AS color,
    oe.size,
    vodf.is_inch,
    vodf.is_meter,
    vodf.is_cm,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN concat(oe.style, ' / ', oe.color, ' / ', oe.size)
            ELSE concat(toe.style, ' / ', toe.color)
        END AS style_color_size,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN (oe.quantity)::double precision
            ELSE (toe.quantity)::double precision
        END AS order_quantity,
    vodf.order_description_uuid,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN vodf.order_number
            ELSE concat('ST',
            CASE
                WHEN (toi.is_sample = 1) THEN 'S'::text
                ELSE ''::text
            END, to_char(toi.created_at, 'YY'::text), '-', lpad((toi.id)::text, 4, '0'::text))
        END AS order_number,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN vodf.item_description
            ELSE concat(tc.count, ' - ', tc.length)
        END AS item_description,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN (sfg.warehouse)::double precision
            ELSE (toe.warehouse)::double precision
        END AS warehouse,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN (sfg.delivered)::double precision
            ELSE (toe.delivered)::double precision
        END AS delivered,
    vodf.order_type,
        CASE
            WHEN ((pl.item_for = 'zipper'::delivery.item_for_enum) OR (pl.item_for = 'sample_zipper'::delivery.item_for_enum) OR (pl.item_for = 'slider'::delivery.item_for_enum) OR (pl.item_for = 'tape'::delivery.item_for_enum)) THEN
            CASE
                WHEN (vodf.order_type = 'tape'::zipper.order_type_enum) THEN (((oe.size)::double precision - (sfg.warehouse)::double precision) - (sfg.delivered)::double precision)
                ELSE (((oe.quantity)::double precision - (sfg.warehouse)::double precision) - (sfg.delivered)::double precision)
            END
            ELSE (((toe.quantity - toe.warehouse) - toe.delivered))::double precision
        END AS balance_quantity
   FROM ((((((((((delivery.packing_list_entry ple
     LEFT JOIN delivery.packing_list pl ON ((pl.uuid = ple.packing_list_uuid)))
     LEFT JOIN delivery.carton ON ((carton.uuid = pl.carton_uuid)))
     LEFT JOIN hr.users ON ((users.uuid = pl.created_by)))
     LEFT JOIN zipper.sfg ON ((sfg.uuid = ple.sfg_uuid)))
     LEFT JOIN zipper.order_entry oe ON ((oe.uuid = sfg.order_entry_uuid)))
     LEFT JOIN zipper.v_order_details_full vodf ON ((vodf.order_description_uuid = oe.order_description_uuid)))
     LEFT JOIN thread.order_entry toe ON ((toe.uuid = ple.thread_order_entry_uuid)))
     LEFT JOIN thread.count_length tc ON ((tc.uuid = toe.count_length_uuid)))
     LEFT JOIN thread.order_info toi ON ((toi.uuid = toe.order_info_uuid)))
     LEFT JOIN delivery.challan ch ON ((ch.uuid = pl.challan_uuid)));
 +   DROP VIEW delivery.v_packing_list_details;
       delivery          postgres    false    242    226    226    1067    226    226    228    228    228    228    228    230    239    239    239    239    239    239    242    242    242    287    287    287    230    229    229    229    229    229    229    228    228    228    228    228    228    228    328    328    328    328    328    328    328    1319    314    314    314    291    291    291    291    228    228    229    229    229    229    229    289    289    289    289    289    289    289    289    6    1319    1067            ;           1259    45360    vehicle    TABLE     I  CREATE TABLE delivery.vehicle (
    uuid text NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    number text NOT NULL,
    driver_name text NOT NULL,
    active integer DEFAULT 1,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE delivery.vehicle;
       delivery         heap    postgres    false    6            �            1259    43328    migrations_details    TABLE     t   CREATE TABLE drizzle.migrations_details (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
 '   DROP TABLE drizzle.migrations_details;
       drizzle         heap    postgres    false    7            �            1259    43333    migrations_details_id_seq    SEQUENCE     �   CREATE SEQUENCE drizzle.migrations_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE drizzle.migrations_details_id_seq;
       drizzle          postgres    false    7    244            �           0    0    migrations_details_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE drizzle.migrations_details_id_seq OWNED BY drizzle.migrations_details.id;
          drizzle          postgres    false    245            �            1259    43334 
   department    TABLE     �   CREATE TABLE hr.department (
    uuid text NOT NULL,
    department text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.department;
       hr         heap    postgres    false    8            �            1259    43339    designation    TABLE     �   CREATE TABLE hr.designation (
    uuid text NOT NULL,
    designation text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE hr.designation;
       hr         heap    postgres    false    8            �            1259    43344    policy_and_notice    TABLE       CREATE TABLE hr.policy_and_notice (
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
       hr         heap    postgres    false    8            �            1259    43349    info    TABLE     L  CREATE TABLE lab_dip.info (
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
       lab_dip         heap    postgres    false    9            K           1259    46352 
   info_entry    TABLE     E  CREATE TABLE lab_dip.info_entry (
    uuid text NOT NULL,
    lab_dip_info_uuid text,
    recipe_uuid text,
    approved integer DEFAULT 0,
    approved_date timestamp without time zone,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE lab_dip.info_entry;
       lab_dip         heap    postgres    false    9            �            1259    43355    info_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE lab_dip.info_id_seq;
       lab_dip          postgres    false    9    249            �           0    0    info_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE lab_dip.info_id_seq OWNED BY lab_dip.info.id;
          lab_dip          postgres    false    250            �            1259    43356    recipe    TABLE     8  CREATE TABLE lab_dip.recipe (
    uuid text NOT NULL,
    id integer NOT NULL,
    name text NOT NULL,
    created_by text,
    status integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sub_streat text,
    bleaching text
);
    DROP TABLE lab_dip.recipe;
       lab_dip         heap    postgres    false    9            �            1259    43363    recipe_entry    TABLE       CREATE TABLE lab_dip.recipe_entry (
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
       lab_dip         heap    postgres    false    9            �            1259    43368    recipe_id_seq    SEQUENCE     �   CREATE SEQUENCE lab_dip.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE lab_dip.recipe_id_seq;
       lab_dip          postgres    false    9    251            �           0    0    recipe_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE lab_dip.recipe_id_seq OWNED BY lab_dip.recipe.id;
          lab_dip          postgres    false    253            �            1259    43369    shade_recipe_sequence    SEQUENCE        CREATE SEQUENCE lab_dip.shade_recipe_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE lab_dip.shade_recipe_sequence;
       lab_dip          postgres    false    9            �            1259    43370    shade_recipe    TABLE     }  CREATE TABLE lab_dip.shade_recipe (
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
       lab_dip         heap    postgres    false    254    9                        1259    43377    shade_recipe_entry    TABLE       CREATE TABLE lab_dip.shade_recipe_entry (
    uuid text NOT NULL,
    shade_recipe_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 '   DROP TABLE lab_dip.shade_recipe_entry;
       lab_dip         heap    postgres    false    9            >           1259    45688    booking    TABLE     d  CREATE TABLE material.booking (
    uuid text NOT NULL,
    id integer NOT NULL,
    material_uuid text,
    marketing_uuid text,
    quantity numeric(20,4) NOT NULL,
    trx_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE material.booking;
       material         heap    postgres    false    10            =           1259    45687    booking_id_seq    SEQUENCE     �   CREATE SEQUENCE material.booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE material.booking_id_seq;
       material          postgres    false    318    10            �           0    0    booking_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE material.booking_id_seq OWNED BY material.booking.id;
          material          postgres    false    317                       1259    43382    info    TABLE     �  CREATE TABLE material.info (
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
    average_lead_time integer DEFAULT 0,
    is_priority_material integer DEFAULT 0
);
    DROP TABLE material.info;
       material         heap    postgres    false    10                       1259    43389    section    TABLE     �   CREATE TABLE material.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.section;
       material         heap    postgres    false    10                       1259    43394    stock    TABLE     &  CREATE TABLE material.stock (
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
    s_qc_and_packing numeric(20,4) DEFAULT 0 NOT NULL,
    booking numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE material.stock;
       material         heap    postgres    false    10                       1259    43427    stock_to_sfg    TABLE     =  CREATE TABLE material.stock_to_sfg (
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
       material         heap    postgres    false    10                       1259    43432    trx    TABLE     0  CREATE TABLE material.trx (
    uuid text NOT NULL,
    material_uuid text,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    booking_uuid text
);
    DROP TABLE material.trx;
       material         heap    postgres    false    10                       1259    43437    type    TABLE     �   CREATE TABLE material.type (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);
    DROP TABLE material.type;
       material         heap    postgres    false    10                       1259    43442    used    TABLE     J  CREATE TABLE material.used (
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
       material         heap    postgres    false    10                       1259    43448    machine    TABLE     1  CREATE TABLE public.machine (
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
       public         heap    postgres    false    15            ?           1259    45697    marketing_team    TABLE     �   CREATE TABLE public.marketing_team (
    uuid text NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    remarks text
);
 "   DROP TABLE public.marketing_team;
       public         heap    postgres    false    15            @           1259    45706    marketing_team_entry    TABLE     .  CREATE TABLE public.marketing_team_entry (
    uuid text NOT NULL,
    marketing_team_uuid text,
    marketing_uuid text,
    is_team_leader boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    remarks text
);
 (   DROP TABLE public.marketing_team_entry;
       public         heap    postgres    false    15            A           1259    45714    marketing_team_member_target    TABLE     �  CREATE TABLE public.marketing_team_member_target (
    uuid text NOT NULL,
    marketing_uuid text,
    year integer NOT NULL,
    month integer NOT NULL,
    zipper_amount numeric(20,4) DEFAULT 0 NOT NULL,
    thread_amount numeric(20,4) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    remarks text
);
 0   DROP TABLE public.marketing_team_member_target;
       public         heap    postgres    false    15            B           1259    45723    production_capacity    TABLE     �  CREATE TABLE public.production_capacity (
    uuid text NOT NULL,
    product public.product_enum DEFAULT 'zipper'::public.product_enum,
    item text,
    nylon_stopper text,
    zipper_number text,
    end_type text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    remarks text
);
 '   DROP TABLE public.production_capacity;
       public         heap    postgres    false    1322    15    1322            	           1259    43460    section    TABLE     w   CREATE TABLE public.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text
);
    DROP TABLE public.section;
       public         heap    postgres    false    15            
           1259    43465    purchase_description_sequence    SEQUENCE     �   CREATE SEQUENCE purchase.purchase_description_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE purchase.purchase_description_sequence;
       purchase          postgres    false    11                       1259    43466    description    TABLE     �  CREATE TABLE purchase.description (
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
       purchase         heap    postgres    false    266    11                       1259    43472    entry    TABLE     ;  CREATE TABLE purchase.entry (
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
       purchase         heap    postgres    false    11                       1259    43478    vendor    TABLE     M  CREATE TABLE purchase.vendor (
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
       purchase         heap    postgres    false    11                       1259    43483    assembly_stock    TABLE     �  CREATE TABLE slider.assembly_stock (
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
    weight numeric(20,4) DEFAULT 0 NOT NULL,
    material_uuid text
);
 "   DROP TABLE slider.assembly_stock;
       slider         heap    postgres    false    12                       1259    43490    coloring_transaction    TABLE     R  CREATE TABLE slider.coloring_transaction (
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
       slider         heap    postgres    false    12                       1259    43496    die_casting    TABLE     i  CREATE TABLE slider.die_casting (
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
    type text,
    created_by text
);
    DROP TABLE slider.die_casting;
       slider         heap    postgres    false    12                       1259    43507    die_casting_production    TABLE     �  CREATE TABLE slider.die_casting_production (
    uuid text NOT NULL,
    die_casting_uuid text,
    mc_no integer NOT NULL,
    cavity_goods integer NOT NULL,
    cavity_defect integer NOT NULL,
    push integer NOT NULL,
    weight numeric(20,4) NOT NULL,
    finishing_batch_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 *   DROP TABLE slider.die_casting_production;
       slider         heap    postgres    false    12                       1259    43512    die_casting_to_assembly_stock    TABLE     �  CREATE TABLE slider.die_casting_to_assembly_stock (
    uuid text NOT NULL,
    assembly_stock_uuid text,
    production_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    wastage numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
 1   DROP TABLE slider.die_casting_to_assembly_stock;
       slider         heap    postgres    false    12                       1259    43521    die_casting_transaction    TABLE     V  CREATE TABLE slider.die_casting_transaction (
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
       slider         heap    postgres    false    12                       1259    43527 
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
    with_link integer DEFAULT 0,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE slider.production;
       slider         heap    postgres    false    12            �            1259    43229    stock    TABLE     �  CREATE TABLE slider.stock (
    uuid text NOT NULL,
    batch_quantity numeric(20,4) DEFAULT 0,
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
    finishing_batch_uuid text,
    finishing_stock numeric(20,4) DEFAULT 0,
    sa_prod_weight numeric(20,4) DEFAULT 0,
    coloring_stock_weight numeric(20,4) DEFAULT 0,
    coloring_prod_weight numeric(20,4) DEFAULT 0,
    finishing_stock_weight numeric(20,4) DEFAULT 0,
    trx_to_finishing_weight numeric(20,4) DEFAULT 0,
    swatch_approved_quantity numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE slider.stock;
       slider         heap    postgres    false    12                       1259    43534    transaction    TABLE     �  CREATE TABLE slider.transaction (
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
    weight numeric(20,4) DEFAULT 0 NOT NULL,
    finishing_batch_entry_uuid text
);
    DROP TABLE slider.transaction;
       slider         heap    postgres    false    12                       1259    43540    trx_against_stock    TABLE     7  CREATE TABLE slider.trx_against_stock (
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
       slider         heap    postgres    false    12                       1259    43546    thread_batch_sequence    SEQUENCE     ~   CREATE SEQUENCE thread.thread_batch_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE thread.thread_batch_sequence;
       thread          postgres    false    13                       1259    43547    batch    TABLE     X  CREATE TABLE thread.batch (
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
    slot integer DEFAULT 0,
    production_date timestamp without time zone DEFAULT '2024-01-01 00:00:00'::timestamp without time zone NOT NULL
);
    DROP TABLE thread.batch;
       thread         heap    postgres    false    279    13                       1259    43555    batch_entry    TABLE     �  CREATE TABLE thread.batch_entry (
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
    transfer_carton_quantity integer DEFAULT 0,
    yarn_quantity numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE thread.batch_entry;
       thread         heap    postgres    false    13                       1259    43565    batch_entry_production    TABLE     M  CREATE TABLE thread.batch_entry_production (
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
       thread         heap    postgres    false    13                       1259    43570    batch_entry_trx    TABLE     /  CREATE TABLE thread.batch_entry_trx (
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
       thread         heap    postgres    false    13                       1259    43576    thread_challan_sequence    SEQUENCE     �   CREATE SEQUENCE thread.thread_challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE thread.thread_challan_sequence;
       thread          postgres    false    13                       1259    43577    challan    TABLE       CREATE TABLE thread.challan (
    uuid text NOT NULL,
    order_info_uuid text,
    carton_quantity integer DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    gate_pass integer DEFAULT 0,
    received integer DEFAULT 0,
    id integer DEFAULT nextval('thread.thread_challan_sequence'::regclass),
    vehicle_uuid text,
    is_hand_delivery boolean DEFAULT false,
    name text,
    delivery_cost numeric(20,4) DEFAULT 0 NOT NULL
);
    DROP TABLE thread.challan;
       thread         heap    postgres    false    284    13                       1259    43585    challan_entry    TABLE     �  CREATE TABLE thread.challan_entry (
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
       thread         heap    postgres    false    13                        1259    43598    dyes_category    TABLE     B  CREATE TABLE thread.dyes_category (
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
       thread         heap    postgres    false    13            $           1259    43631    programs    TABLE     %  CREATE TABLE thread.programs (
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
       thread         heap    postgres    false    13            %           1259    43637    dyeing_batch    TABLE     �  CREATE TABLE zipper.dyeing_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    batch_status zipper.batch_status DEFAULT 'pending'::zipper.batch_status,
    machine_uuid text,
    slot integer DEFAULT 0,
    received integer DEFAULT 0,
    production_date timestamp without time zone DEFAULT '2024-01-01 00:00:00'::timestamp without time zone NOT NULL
);
     DROP TABLE zipper.dyeing_batch;
       zipper         heap    postgres    false    1064    1064    14            '           1259    43653    batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE zipper.batch_id_seq;
       zipper          postgres    false    14    293            �           0    0    batch_id_seq    SEQUENCE OWNED BY     D   ALTER SEQUENCE zipper.batch_id_seq OWNED BY zipper.dyeing_batch.id;
          zipper          postgres    false    295            )           1259    43659    dyed_tape_transaction    TABLE     x  CREATE TABLE zipper.dyed_tape_transaction (
    uuid text NOT NULL,
    order_description_uuid text,
    colors text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sfg_uuid text,
    trx_quantity_in_meter numeric(20,4) DEFAULT 0 NOT NULL
);
 )   DROP TABLE zipper.dyed_tape_transaction;
       zipper         heap    postgres    false    14            *           1259    43664     dyed_tape_transaction_from_stock    TABLE     �  CREATE TABLE zipper.dyed_tape_transaction_from_stock (
    uuid text NOT NULL,
    order_description_uuid text,
    trx_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    tape_coil_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sfg_uuid text,
    trx_quantity_in_meter numeric(20,4) DEFAULT 0 NOT NULL
);
 4   DROP TABLE zipper.dyed_tape_transaction_from_stock;
       zipper         heap    postgres    false    14            &           1259    43645    dyeing_batch_entry    TABLE     |  CREATE TABLE zipper.dyeing_batch_entry (
    uuid text NOT NULL,
    dyeing_batch_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    production_quantity numeric(20,4) DEFAULT 0,
    production_quantity_in_kg numeric(20,4) DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    sfg_uuid text
);
 &   DROP TABLE zipper.dyeing_batch_entry;
       zipper         heap    postgres    false    14            (           1259    43654    dyeing_batch_production    TABLE     X  CREATE TABLE zipper.dyeing_batch_production (
    uuid text NOT NULL,
    dyeing_batch_entry_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    production_quantity_in_kg numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 +   DROP TABLE zipper.dyeing_batch_production;
       zipper         heap    postgres    false    14            D           1259    45732    finishing_batch    TABLE     B  CREATE TABLE zipper.finishing_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    order_description_uuid text,
    slider_lead_time integer,
    dyeing_lead_time integer,
    status zipper.finishing_batch_status DEFAULT 'running'::zipper.finishing_batch_status,
    slider_finishing_stock numeric(20,4) DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    production_date timestamp without time zone DEFAULT '2024-01-01 00:00:00'::timestamp without time zone NOT NULL
);
 #   DROP TABLE zipper.finishing_batch;
       zipper         heap    postgres    false    1325    1325    14            E           1259    45743    finishing_batch_entry    TABLE     o  CREATE TABLE zipper.finishing_batch_entry (
    uuid text NOT NULL,
    finishing_batch_uuid text,
    sfg_uuid text,
    quantity numeric(20,4) NOT NULL,
    dyed_tape_used_in_kg numeric(20,4) DEFAULT 0 NOT NULL,
    teeth_molding_prod numeric(20,4) DEFAULT 0 NOT NULL,
    teeth_coloring_stock numeric(20,4) DEFAULT 0 NOT NULL,
    finishing_stock numeric(20,4) DEFAULT 0 NOT NULL,
    finishing_prod numeric(20,4) DEFAULT 0 NOT NULL,
    warehouse numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 )   DROP TABLE zipper.finishing_batch_entry;
       zipper         heap    postgres    false    14            C           1259    45731    finishing_batch_id_seq    SEQUENCE     �   CREATE SEQUENCE zipper.finishing_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE zipper.finishing_batch_id_seq;
       zipper          postgres    false    324    14            �           0    0    finishing_batch_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE zipper.finishing_batch_id_seq OWNED BY zipper.finishing_batch.id;
          zipper          postgres    false    323            .           1259    43700    finishing_batch_production    TABLE     �  CREATE TABLE zipper.finishing_batch_production (
    uuid text NOT NULL,
    finishing_batch_entry_uuid text,
    section text NOT NULL,
    production_quantity_in_kg numeric(20,4) DEFAULT 0,
    production_quantity numeric(20,4) DEFAULT 0,
    wastage numeric(20,4) DEFAULT 0,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    dyed_tape_used_in_kg numeric(20,4) DEFAULT 0 NOT NULL
);
 .   DROP TABLE zipper.finishing_batch_production;
       zipper         heap    postgres    false    14            /           1259    43708    finishing_batch_transaction    TABLE     �  CREATE TABLE zipper.finishing_batch_transaction (
    uuid text NOT NULL,
    trx_from text NOT NULL,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) DEFAULT 0,
    slider_item_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    finishing_batch_entry_uuid text,
    trx_quantity_in_kg numeric(20,4) DEFAULT 0 NOT NULL
);
 /   DROP TABLE zipper.finishing_batch_transaction;
       zipper         heap    postgres    false    14            +           1259    43681 &   material_trx_against_order_description    TABLE     �  CREATE TABLE zipper.material_trx_against_order_description (
    uuid text NOT NULL,
    order_description_uuid text,
    material_uuid text,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL,
    booking_uuid text
);
 :   DROP TABLE zipper.material_trx_against_order_description;
       zipper         heap    postgres    false    14            4           1259    45058    multi_color_dashboard    TABLE     �  CREATE TABLE zipper.multi_color_dashboard (
    uuid text NOT NULL,
    order_description_uuid text,
    expected_tape_quantity numeric(20,4) DEFAULT 0,
    is_swatch_approved integer DEFAULT 0,
    tape_quantity numeric(20,4) DEFAULT 0,
    coil_uuid text,
    coil_quantity numeric(20,4) DEFAULT 0,
    thread_quantity numeric(20,4) DEFAULT 0,
    is_coil_received_sewing integer DEFAULT 0,
    is_thread_received_sewing integer DEFAULT 0,
    remarks text,
    thread_uuid text
);
 )   DROP TABLE zipper.multi_color_dashboard;
       zipper         heap    postgres    false    14            5           1259    45072    multi_color_tape_receive    TABLE       CREATE TABLE zipper.multi_color_tape_receive (
    uuid text NOT NULL,
    order_description_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
 ,   DROP TABLE zipper.multi_color_tape_receive;
       zipper         heap    postgres    false    14            ,           1259    43686    planning    TABLE     �   CREATE TABLE zipper.planning (
    week text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);
    DROP TABLE zipper.planning;
       zipper         heap    postgres    false    14            -           1259    43691    planning_entry    TABLE     �  CREATE TABLE zipper.planning_entry (
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
       zipper         heap    postgres    false    14            0           1259    43715    tape_coil_production    TABLE     _  CREATE TABLE zipper.tape_coil_production (
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
       zipper         heap    postgres    false    14            1           1259    43721    tape_coil_required    TABLE     t  CREATE TABLE zipper.tape_coil_required (
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
       zipper         heap    postgres    false    14            2           1259    43726    tape_coil_to_dyeing    TABLE     \  CREATE TABLE zipper.tape_coil_to_dyeing (
    uuid text NOT NULL,
    tape_coil_uuid text,
    order_description_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    is_received_in_sewing integer DEFAULT 0
);
 '   DROP TABLE zipper.tape_coil_to_dyeing;
       zipper         heap    postgres    false    14            3           1259    43731    tape_trx    TABLE       CREATE TABLE zipper.tape_trx (
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
       zipper         heap    postgres    false    14            G           1259    46330    v_order_details    VIEW     ;  CREATE VIEW zipper.v_order_details AS
 SELECT order_info.uuid AS order_info_uuid,
    order_info.reference_order_info_uuid,
    concat('Z',
        CASE
            WHEN (order_info.is_sample = 1) THEN 'S'::text
            ELSE ''::text
        END, to_char(order_info.created_at, 'YY'::text), '-', lpad((order_info.id)::text, 4, '0'::text)) AS order_number,
    order_info.id,
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
    order_description.order_type,
    order_description.is_multi_color,
    order_description.created_at AS order_description_created_at,
    order_description.updated_at AS order_description_updated_at,
    (order_description.tape_received)::double precision AS tape_received,
    (order_description.multi_color_tape_received)::double precision AS multi_color_tape_received,
    (order_description.tape_transferred)::double precision AS tape_transferred,
    order_description.remarks AS order_description_remarks
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
       zipper          postgres    false    236    241    241    238    241    241    241    241    241    241    241    236    236    235    238    238    238    235    234    234    241    241    241    241    241    241    233    233    232    232    231    231    238    230    230    238    238    238    238    238    238    238    238    238    238    238    241    241    241    238    238    1067    14            �           2604    43741    migrations_details id    DEFAULT     �   ALTER TABLE ONLY drizzle.migrations_details ALTER COLUMN id SET DEFAULT nextval('drizzle.migrations_details_id_seq'::regclass);
 E   ALTER TABLE drizzle.migrations_details ALTER COLUMN id DROP DEFAULT;
       drizzle          postgres    false    245    244            �           2604    43742    info id    DEFAULT     d   ALTER TABLE ONLY lab_dip.info ALTER COLUMN id SET DEFAULT nextval('lab_dip.info_id_seq'::regclass);
 7   ALTER TABLE lab_dip.info ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    250    249            �           2604    43743 	   recipe id    DEFAULT     h   ALTER TABLE ONLY lab_dip.recipe ALTER COLUMN id SET DEFAULT nextval('lab_dip.recipe_id_seq'::regclass);
 9   ALTER TABLE lab_dip.recipe ALTER COLUMN id DROP DEFAULT;
       lab_dip          postgres    false    253    251            �           2604    45691 
   booking id    DEFAULT     l   ALTER TABLE ONLY material.booking ALTER COLUMN id SET DEFAULT nextval('material.booking_id_seq'::regclass);
 ;   ALTER TABLE material.booking ALTER COLUMN id DROP DEFAULT;
       material          postgres    false    318    317    318            Z           2604    43744    dyeing_batch id    DEFAULT     k   ALTER TABLE ONLY zipper.dyeing_batch ALTER COLUMN id SET DEFAULT nextval('zipper.batch_id_seq'::regclass);
 >   ALTER TABLE zipper.dyeing_batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    295    293            �           2604    45735    finishing_batch id    DEFAULT     x   ALTER TABLE ONLY zipper.finishing_batch ALTER COLUMN id SET DEFAULT nextval('zipper.finishing_batch_id_seq'::regclass);
 A   ALTER TABLE zipper.finishing_batch ALTER COLUMN id DROP DEFAULT;
       zipper          postgres    false    323    324    324            Y          0    43127    bank 
   TABLE DATA           �   COPY commercial.bank (uuid, name, swift_code, address, policy, created_at, updated_at, remarks, created_by, routing_no) FROM stdin;
 
   commercial          postgres    false    219         �          0    46258    cash_receive 
   TABLE DATA           s   COPY commercial.cash_receive (uuid, pi_cash_uuid, amount, created_by, created_at, updated_at, remarks) FROM stdin;
 
   commercial          postgres    false    326   �
      [          0    43133    lc 
   TABLE DATA           1  COPY commercial.lc (uuid, party_uuid, lc_number, lc_date, commercial_executive, party_bank, production_complete, lc_cancel, shipment_date, expiry_date, at_sight, amd_date, amd_count, problematical, epz, created_by, created_at, updated_at, remarks, id, is_rtgs, lc_value, is_old_pi, pi_number) FROM stdin;
 
   commercial          postgres    false    221   �
      �          0    45320    lc_entry 
   TABLE DATA           �   COPY commercial.lc_entry (uuid, lc_uuid, ldbc_fdbc, handover_date, document_receive_date, acceptance_date, maturity_date, payment_date, payment_value, amount, created_at, updated_at, remarks) FROM stdin;
 
   commercial          postgres    false    311   B      �          0    45552    lc_entry_others 
   TABLE DATA           �   COPY commercial.lc_entry_others (uuid, lc_uuid, ud_no, ud_received, up_number, up_number_updated_at, created_at, updated_at, remarks) FROM stdin;
 
   commercial          postgres    false    316   �      �          0    45329 	   manual_pi 
   TABLE DATA           �   COPY commercial.manual_pi (uuid, id, pi_uuids, marketing_uuid, party_uuid, buyer_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, remarks, created_by, receive_amount, weight, date, pi_number, created_at, updated_at) FROM stdin;
 
   commercial          postgres    false    312         �          0    45342    manual_pi_entry 
   TABLE DATA           �   COPY commercial.manual_pi_entry (uuid, manual_pi_uuid, order_number, po, style, item, specification, size, quantity, unit_price, is_zipper, created_at, updated_at, remarks) FROM stdin;
 
   commercial          postgres    false    313   +      ]          0    43148    pi_cash 
   TABLE DATA           $  COPY commercial.pi_cash (uuid, id, lc_uuid, order_info_uuids, marketing_uuid, party_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, is_pi, conversion_rate, receive_amount, created_by, created_at, updated_at, remarks, weight, thread_order_info_uuids, is_rtgs) FROM stdin;
 
   commercial          postgres    false    223   H      ^          0    43160    pi_cash_entry 
   TABLE DATA           �   COPY commercial.pi_cash_entry (uuid, pi_cash_uuid, sfg_uuid, pi_cash_quantity, created_at, updated_at, remarks, thread_order_entry_uuid) FROM stdin;
 
   commercial          postgres    false    224   �      �          0    45352    carton 
   TABLE DATA           s   COPY delivery.carton (uuid, size, name, used_for, active, created_by, created_at, updated_at, remarks) FROM stdin;
    delivery          postgres    false    314   �;      `          0    43166    challan 
   TABLE DATA             COPY delivery.challan (uuid, carton_quantity, assign_to, receive_status, created_by, created_at, updated_at, remarks, id, gate_pass, order_info_uuid, vehicle_uuid, name, delivery_cost, is_hand_delivery, thread_order_info_uuid, delivery_date, is_own, delivery_type) FROM stdin;
    delivery          postgres    false    226   �<      b          0    43180    packing_list 
   TABLE DATA           �   COPY delivery.packing_list (uuid, carton_weight, created_by, created_at, updated_at, remarks, order_info_uuid, id, challan_uuid, carton_uuid, is_warehouse_received, gate_pass, item_for, thread_order_info_uuid) FROM stdin;
    delivery          postgres    false    228   �=      c          0    43186    packing_list_entry 
   TABLE DATA           �   COPY delivery.packing_list_entry (uuid, packing_list_uuid, sfg_uuid, quantity, created_at, updated_at, remarks, short_quantity, reject_quantity, poli_quantity, thread_order_entry_uuid) FROM stdin;
    delivery          postgres    false    229   �?      �          0    45360    vehicle 
   TABLE DATA              COPY delivery.vehicle (uuid, type, name, number, driver_name, active, created_by, created_at, updated_at, remarks) FROM stdin;
    delivery          postgres    false    315   B      r          0    43328    migrations_details 
   TABLE DATA           C   COPY drizzle.migrations_details (id, hash, created_at) FROM stdin;
    drizzle          postgres    false    244   �B      t          0    43334 
   department 
   TABLE DATA           S   COPY hr.department (uuid, department, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    246   �^      u          0    43339    designation 
   TABLE DATA           U   COPY hr.designation (uuid, designation, created_at, updated_at, remarks) FROM stdin;
    hr          postgres    false    247   Aa      v          0    43344    policy_and_notice 
   TABLE DATA              COPY hr.policy_and_notice (uuid, type, title, sub_title, url, created_at, updated_at, status, remarks, created_by) FROM stdin;
    hr          postgres    false    248   �d      d          0    43193    users 
   TABLE DATA           �   COPY hr.users (uuid, name, email, pass, designation_uuid, can_access, ext, phone, created_at, updated_at, status, remarks, department_uuid) FROM stdin;
    hr          postgres    false    230   �d      w          0    43349    info 
   TABLE DATA           �   COPY lab_dip.info (uuid, id, name, order_info_uuid, created_by, created_at, updated_at, remarks, lab_status, thread_order_info_uuid) FROM stdin;
    lab_dip          postgres    false    249   ��      �          0    46352 
   info_entry 
   TABLE DATA           �   COPY lab_dip.info_entry (uuid, lab_dip_info_uuid, recipe_uuid, approved, approved_date, created_by, created_at, updated_at, remarks) FROM stdin;
    lab_dip          postgres    false    331   j�      y          0    43356    recipe 
   TABLE DATA           }   COPY lab_dip.recipe (uuid, id, name, created_by, status, created_at, updated_at, remarks, sub_streat, bleaching) FROM stdin;
    lab_dip          postgres    false    251   ܘ      z          0    43363    recipe_entry 
   TABLE DATA           {   COPY lab_dip.recipe_entry (uuid, recipe_uuid, color, quantity, created_at, updated_at, remarks, material_uuid) FROM stdin;
    lab_dip          postgres    false    252   ��      }          0    43370    shade_recipe 
   TABLE DATA           �   COPY lab_dip.shade_recipe (uuid, id, name, sub_streat, lab_status, created_by, created_at, updated_at, remarks, bleaching) FROM stdin;
    lab_dip          postgres    false    255   �      ~          0    43377    shade_recipe_entry 
   TABLE DATA           �   COPY lab_dip.shade_recipe_entry (uuid, shade_recipe_uuid, material_uuid, quantity, created_at, updated_at, remarks) FROM stdin;
    lab_dip          postgres    false    256   8�      �          0    45688    booking 
   TABLE DATA           �   COPY material.booking (uuid, id, material_uuid, marketing_uuid, quantity, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    318   U�                0    43382    info 
   TABLE DATA           �   COPY material.info (uuid, section_uuid, type_uuid, name, short_name, unit, threshold, description, created_at, updated_at, remarks, created_by, average_lead_time, is_priority_material) FROM stdin;
    material          postgres    false    257   r�      �          0    43389    section 
   TABLE DATA           h   COPY material.section (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    258   ��      �          0    43394    stock 
   TABLE DATA           �  COPY material.stock (uuid, material_uuid, stock, tape_making, coil_forming, dying_and_iron, m_gapping, v_gapping, v_teeth_molding, m_teeth_molding, teeth_assembling_and_polishing, m_teeth_cleaning, v_teeth_cleaning, plating_and_iron, m_sealing, v_sealing, n_t_cutting, v_t_cutting, m_stopper, v_stopper, n_stopper, cutting, die_casting, slider_assembly, coloring, remarks, lab_dip, m_qc_and_packing, v_qc_and_packing, n_qc_and_packing, s_qc_and_packing, booking) FROM stdin;
    material          postgres    false    259   ��      �          0    43427    stock_to_sfg 
   TABLE DATA           �   COPY material.stock_to_sfg (uuid, material_uuid, order_entry_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    260   �	      �          0    43432    trx 
   TABLE DATA           �   COPY material.trx (uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks, booking_uuid) FROM stdin;
    material          postgres    false    261   
	      �          0    43437    type 
   TABLE DATA           e   COPY material.type (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    material          postgres    false    262   �	      �          0    43442    used 
   TABLE DATA           �   COPY material.used (uuid, material_uuid, section, used_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    material          postgres    false    263   y	      e          0    43199    buyer 
   TABLE DATA           d   COPY public.buyer (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    231   '	      f          0    43204    factory 
   TABLE DATA           v   COPY public.factory (uuid, party_uuid, name, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    232   T	      �          0    43448    machine 
   TABLE DATA           �   COPY public.machine (uuid, name, is_vislon, is_metal, is_nylon, is_sewing_thread, is_bulk, is_sample, min_capacity, max_capacity, water_capacity, created_by, created_at, updated_at, remarks) FROM stdin;
    public          postgres    false    264   P�	      g          0    43209 	   marketing 
   TABLE DATA           s   COPY public.marketing (uuid, name, short_name, user_uuid, remarks, created_at, updated_at, created_by) FROM stdin;
    public          postgres    false    233   �	      �          0    45697    marketing_team 
   TABLE DATA           a   COPY public.marketing_team (uuid, name, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    319   à	      �          0    45706    marketing_team_entry 
   TABLE DATA           �   COPY public.marketing_team_entry (uuid, marketing_team_uuid, marketing_uuid, is_team_leader, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    320   �	      �          0    45714    marketing_team_member_target 
   TABLE DATA           �   COPY public.marketing_team_member_target (uuid, marketing_uuid, year, month, zipper_amount, thread_amount, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    321   ��	      h          0    43214    merchandiser 
   TABLE DATA           �   COPY public.merchandiser (uuid, party_uuid, name, email, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    234   �	      i          0    43219    party 
   TABLE DATA           m   COPY public.party (uuid, name, short_name, remarks, created_at, updated_at, created_by, address) FROM stdin;
    public          postgres    false    235   ��	      �          0    45723    production_capacity 
   TABLE DATA           �   COPY public.production_capacity (uuid, product, item, nylon_stopper, zipper_number, end_type, quantity, created_at, updated_at, created_by, remarks) FROM stdin;
    public          postgres    false    322   �-
      j          0    43224 
   properties 
   TABLE DATA           �   COPY public.properties (uuid, item_for, type, name, short_name, created_by, created_at, updated_at, remarks, order_sheet_name) FROM stdin;
    public          postgres    false    236   �0
      �          0    43460    section 
   TABLE DATA           B   COPY public.section (uuid, name, short_name, remarks) FROM stdin;
    public          postgres    false    265   �A
      �          0    43466    description 
   TABLE DATA           �   COPY purchase.description (uuid, vendor_uuid, is_local, lc_number, created_by, created_at, updated_at, remarks, id, challan_number) FROM stdin;
    purchase          postgres    false    267   �A
      �          0    43472    entry 
   TABLE DATA           �   COPY purchase.entry (uuid, purchase_description_uuid, material_uuid, quantity, price, created_at, updated_at, remarks) FROM stdin;
    purchase          postgres    false    268   {G
      �          0    43478    vendor 
   TABLE DATA           �   COPY purchase.vendor (uuid, name, contact_name, email, office_address, contact_number, remarks, created_at, updated_at, created_by) FROM stdin;
    purchase          postgres    false    269   /S
      �          0    43483    assembly_stock 
   TABLE DATA           �   COPY slider.assembly_stock (uuid, name, die_casting_body_uuid, die_casting_puller_uuid, die_casting_cap_uuid, die_casting_link_uuid, quantity, created_by, created_at, updated_at, remarks, weight, material_uuid) FROM stdin;
    slider          postgres    false    270   �V
      �          0    43490    coloring_transaction 
   TABLE DATA           �   COPY slider.coloring_transaction (uuid, stock_uuid, order_info_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    271   �W
      �          0    43496    die_casting 
   TABLE DATA             COPY slider.die_casting (uuid, name, item, zipper_number, end_type, puller_type, logo_type, slider_body_shape, slider_link, quantity, weight, pcs_per_kg, created_at, updated_at, remarks, quantity_in_sa, is_logo_body, is_logo_puller, type, created_by) FROM stdin;
    slider          postgres    false    272   	X
      �          0    43507    die_casting_production 
   TABLE DATA           �   COPY slider.die_casting_production (uuid, die_casting_uuid, mc_no, cavity_goods, cavity_defect, push, weight, finishing_batch_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
    slider          postgres    false    273   !\
      �          0    43512    die_casting_to_assembly_stock 
   TABLE DATA           �   COPY slider.die_casting_to_assembly_stock (uuid, assembly_stock_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    274   7]
      �          0    43521    die_casting_transaction 
   TABLE DATA           �   COPY slider.die_casting_transaction (uuid, die_casting_uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    275   �]
      �          0    43527 
   production 
   TABLE DATA           �   COPY slider.production (uuid, stock_uuid, production_quantity, wastage, section, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
    slider          postgres    false    276   �^
      k          0    43229    stock 
   TABLE DATA           �  COPY slider.stock (uuid, batch_quantity, body_quantity, cap_quantity, puller_quantity, link_quantity, sa_prod, coloring_stock, coloring_prod, trx_to_finishing, u_top_quantity, h_bottom_quantity, box_pin_quantity, two_way_pin_quantity, created_at, updated_at, remarks, quantity_in_sa, finishing_batch_uuid, finishing_stock, sa_prod_weight, coloring_stock_weight, coloring_prod_weight, finishing_stock_weight, trx_to_finishing_weight, swatch_approved_quantity) FROM stdin;
    slider          postgres    false    237   3_
      �          0    43534    transaction 
   TABLE DATA           �   COPY slider.transaction (uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, from_section, to_section, assembly_stock_uuid, weight, finishing_batch_entry_uuid) FROM stdin;
    slider          postgres    false    277   8`
      �          0    43540    trx_against_stock 
   TABLE DATA           �   COPY slider.trx_against_stock (uuid, die_casting_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
    slider          postgres    false    278   	a
      �          0    43547    batch 
   TABLE DATA           .  COPY thread.batch (uuid, id, dyeing_operator, reason, category, status, pass_by, shift, dyeing_supervisor, coning_operator, coning_supervisor, coning_machines, created_by, created_at, updated_at, remarks, yarn_quantity, machine_uuid, lab_created_by, lab_created_at, lab_updated_at, yarn_issue_created_by, yarn_issue_created_at, yarn_issue_updated_at, is_drying_complete, drying_created_at, drying_updated_at, dyeing_created_by, dyeing_created_at, dyeing_updated_at, coning_created_by, coning_created_at, coning_updated_at, slot, production_date) FROM stdin;
    thread          postgres    false    280   �a
      �          0    43555    batch_entry 
   TABLE DATA           
  COPY thread.batch_entry (uuid, batch_uuid, order_entry_uuid, quantity, coning_production_quantity, coning_carton_quantity, created_at, updated_at, remarks, coning_created_at, coning_updated_at, transfer_quantity, transfer_carton_quantity, yarn_quantity) FROM stdin;
    thread          postgres    false    281   -e
      �          0    43565    batch_entry_production 
   TABLE DATA           �   COPY thread.batch_entry_production (uuid, batch_entry_uuid, production_quantity, coning_carton_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    282   �g
      �          0    43570    batch_entry_trx 
   TABLE DATA           �   COPY thread.batch_entry_trx (uuid, batch_entry_uuid, quantity, created_by, created_at, updated_at, remarks, carton_quantity) FROM stdin;
    thread          postgres    false    283   Ui
      �          0    43577    challan 
   TABLE DATA           �   COPY thread.challan (uuid, order_info_uuid, carton_quantity, created_by, created_at, updated_at, remarks, gate_pass, received, id, vehicle_uuid, is_hand_delivery, name, delivery_cost) FROM stdin;
    thread          postgres    false    285   �i
      �          0    43585    challan_entry 
   TABLE DATA           �   COPY thread.challan_entry (uuid, challan_uuid, order_entry_uuid, quantity, created_by, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
    thread          postgres    false    286   j
      �          0    43592    count_length 
   TABLE DATA           �   COPY thread.count_length (uuid, count, sst, created_by, created_at, updated_at, remarks, min_weight, max_weight, length, price, cone_per_carton) FROM stdin;
    thread          postgres    false    287   7j
      �          0    43598    dyes_category 
   TABLE DATA           �   COPY thread.dyes_category (uuid, name, upto_percentage, bleaching, id, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    288   rm
      �          0    43605    order_entry 
   TABLE DATA           �  COPY thread.order_entry (uuid, order_info_uuid, lab_reference, color, po, style, count_length_uuid, quantity, company_price, party_price, swatch_approval_date, production_quantity, created_by, created_at, updated_at, remarks, bleaching, transfer_quantity, recipe_uuid, pi, delivered, warehouse, short_quantity, reject_quantity, production_quantity_in_kg, carton_quantity, carton_of_production_quantity) FROM stdin;
    thread          postgres    false    289   �n
      �          0    43622 
   order_info 
   TABLE DATA           �   COPY thread.order_info (uuid, id, party_uuid, marketing_uuid, factory_uuid, merchandiser_uuid, buyer_uuid, is_sample, is_bill, delivery_date, created_by, created_at, updated_at, remarks, is_cash) FROM stdin;
    thread          postgres    false    291   �z
      �          0    43631    programs 
   TABLE DATA           �   COPY thread.programs (uuid, dyes_category_uuid, material_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    thread          postgres    false    292   g
      �          0    43659    dyed_tape_transaction 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction (uuid, order_description_uuid, colors, trx_quantity, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_meter) FROM stdin;
    zipper          postgres    false    297   �
      �          0    43664     dyed_tape_transaction_from_stock 
   TABLE DATA           �   COPY zipper.dyed_tape_transaction_from_stock (uuid, order_description_uuid, trx_quantity, tape_coil_uuid, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_meter) FROM stdin;
    zipper          postgres    false    298   ��
      �          0    43637    dyeing_batch 
   TABLE DATA           �   COPY zipper.dyeing_batch (uuid, id, created_by, created_at, updated_at, remarks, batch_status, machine_uuid, slot, received, production_date) FROM stdin;
    zipper          postgres    false    293   9�
      �          0    43645    dyeing_batch_entry 
   TABLE DATA           �   COPY zipper.dyeing_batch_entry (uuid, dyeing_batch_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks, sfg_uuid) FROM stdin;
    zipper          postgres    false    294   ȃ
      �          0    43654    dyeing_batch_production 
   TABLE DATA           �   COPY zipper.dyeing_batch_production (uuid, dyeing_batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    296   ��
      �          0    45732    finishing_batch 
   TABLE DATA           �   COPY zipper.finishing_batch (uuid, id, order_description_uuid, slider_lead_time, dyeing_lead_time, status, slider_finishing_stock, created_by, created_at, updated_at, remarks, production_date) FROM stdin;
    zipper          postgres    false    324   @�
      �          0    45743    finishing_batch_entry 
   TABLE DATA           �   COPY zipper.finishing_batch_entry (uuid, finishing_batch_uuid, sfg_uuid, quantity, dyed_tape_used_in_kg, teeth_molding_prod, teeth_coloring_stock, finishing_stock, finishing_prod, warehouse, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    325   @�
      �          0    43700    finishing_batch_production 
   TABLE DATA           �   COPY zipper.finishing_batch_production (uuid, finishing_batch_entry_uuid, section, production_quantity_in_kg, production_quantity, wastage, created_by, created_at, updated_at, remarks, dyed_tape_used_in_kg) FROM stdin;
    zipper          postgres    false    302   �
      �          0    43708    finishing_batch_transaction 
   TABLE DATA           �   COPY zipper.finishing_batch_transaction (uuid, trx_from, trx_to, trx_quantity, slider_item_uuid, created_by, created_at, updated_at, remarks, finishing_batch_entry_uuid, trx_quantity_in_kg) FROM stdin;
    zipper          postgres    false    303   )�
      �          0    43681 &   material_trx_against_order_description 
   TABLE DATA           �   COPY zipper.material_trx_against_order_description (uuid, order_description_uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks, weight, booking_uuid) FROM stdin;
    zipper          postgres    false    299   F�
      �          0    45058    multi_color_dashboard 
   TABLE DATA           �   COPY zipper.multi_color_dashboard (uuid, order_description_uuid, expected_tape_quantity, is_swatch_approved, tape_quantity, coil_uuid, coil_quantity, thread_quantity, is_coil_received_sewing, is_thread_received_sewing, remarks, thread_uuid) FROM stdin;
    zipper          postgres    false    308   Ӑ
      �          0    45072    multi_color_tape_receive 
   TABLE DATA           �   COPY zipper.multi_color_tape_receive (uuid, order_description_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    309   ��
      l          0    43249    order_description 
   TABLE DATA           �  COPY zipper.order_description (uuid, order_info_uuid, item, zipper_number, end_type, lock_type, puller_type, teeth_color, puller_color, special_requirement, hand, coloring_type, slider, slider_starting_section_enum, top_stopper, bottom_stopper, logo_type, is_logo_body, is_logo_puller, description, status, created_at, updated_at, remarks, slider_body_shape, slider_link, end_user, garment, light_preference, garments_wash, created_by, garments_remarks, tape_received, tape_transferred, slider_finishing_stock, nylon_stopper, tape_coil_uuid, teeth_type, is_inch, order_type, is_meter, is_cm, is_multi_color, slider_provided, is_waterproof, multi_color_tape_received) FROM stdin;
    zipper          postgres    false    238   U�
      m          0    43265    order_entry 
   TABLE DATA           �   COPY zipper.order_entry (uuid, order_description_uuid, style, color, size, quantity, company_price, party_price, status, swatch_status_enum, swatch_approval_date, created_at, updated_at, remarks, bleaching, is_inch) FROM stdin;
    zipper          postgres    false    239   +�
      o          0    43276 
   order_info 
   TABLE DATA           %  COPY zipper.order_info (uuid, id, reference_order_info_uuid, buyer_uuid, party_uuid, marketing_uuid, merchandiser_uuid, factory_uuid, is_sample, is_bill, is_cash, marketing_priority, factory_priority, status, created_by, created_at, updated_at, remarks, conversion_rate, print_in) FROM stdin;
    zipper          postgres    false    241   v�
      �          0    43686    planning 
   TABLE DATA           U   COPY zipper.planning (week, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    300   n      �          0    43691    planning_entry 
   TABLE DATA           �   COPY zipper.planning_entry (uuid, sfg_uuid, sno_quantity, factory_quantity, production_quantity, batch_production_quantity, created_at, updated_at, planning_week, sno_remarks, factory_remarks) FROM stdin;
    zipper          postgres    false    301   �      p          0    43288    sfg 
   TABLE DATA           E  COPY zipper.sfg (uuid, order_entry_uuid, recipe_uuid, dying_and_iron_prod, teeth_molding_stock, teeth_molding_prod, teeth_coloring_stock, teeth_coloring_prod, finishing_stock, finishing_prod, coloring_prod, warehouse, delivered, pi, remarks, short_quantity, reject_quantity, dyed_tape_used_in_kg, batch_quantity) FROM stdin;
    zipper          postgres    false    242   �      q          0    43306 	   tape_coil 
   TABLE DATA             COPY zipper.tape_coil (uuid, quantity, trx_quantity_in_coil, quantity_in_coil, remarks, item_uuid, zipper_number_uuid, name, raw_per_kg_meter, dyed_per_kg_meter, created_by, created_at, updated_at, is_import, is_reverse, trx_quantity_in_dying, stock_quantity, material_uuid) FROM stdin;
    zipper          postgres    false    243   �A      �          0    43715    tape_coil_production 
   TABLE DATA           �   COPY zipper.tape_coil_production (uuid, section, tape_coil_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    304   �E      �          0    43721    tape_coil_required 
   TABLE DATA           �   COPY zipper.tape_coil_required (uuid, end_type_uuid, item_uuid, nylon_stopper_uuid, zipper_number_uuid, top, bottom, created_by, created_at, updated_at, remarks) FROM stdin;
    zipper          postgres    false    305   cG      �          0    43726    tape_coil_to_dyeing 
   TABLE DATA           �   COPY zipper.tape_coil_to_dyeing (uuid, tape_coil_uuid, order_description_uuid, trx_quantity, created_by, created_at, updated_at, remarks, is_received_in_sewing) FROM stdin;
    zipper          postgres    false    306   �J      �          0    43731    tape_trx 
   TABLE DATA              COPY zipper.tape_trx (uuid, tape_coil_uuid, trx_quantity, created_by, created_at, updated_at, remarks, to_section) FROM stdin;
    zipper          postgres    false    307   FL      �           0    0    lc_sequence    SEQUENCE SET     =   SELECT pg_catalog.setval('commercial.lc_sequence', 4, true);
       
   commercial          postgres    false    220            �           0    0    manual_pi_sequence    SEQUENCE SET     E   SELECT pg_catalog.setval('commercial.manual_pi_sequence', 1, false);
       
   commercial          postgres    false    310            �           0    0    pi_sequence    SEQUENCE SET     >   SELECT pg_catalog.setval('commercial.pi_sequence', 20, true);
       
   commercial          postgres    false    222            �           0    0    challan_sequence    SEQUENCE SET     @   SELECT pg_catalog.setval('delivery.challan_sequence', 6, true);
          delivery          postgres    false    225            �           0    0    packing_list_sequence    SEQUENCE SET     F   SELECT pg_catalog.setval('delivery.packing_list_sequence', 15, true);
          delivery          postgres    false    227            �           0    0    migrations_details_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('drizzle.migrations_details_id_seq', 157, true);
          drizzle          postgres    false    245            �           0    0    info_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('lab_dip.info_id_seq', 56, true);
          lab_dip          postgres    false    250            �           0    0    recipe_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('lab_dip.recipe_id_seq', 95, true);
          lab_dip          postgres    false    253            �           0    0    shade_recipe_sequence    SEQUENCE SET     D   SELECT pg_catalog.setval('lab_dip.shade_recipe_sequence', 1, true);
          lab_dip          postgres    false    254            �           0    0    booking_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('material.booking_id_seq', 1, false);
          material          postgres    false    317            �           0    0    purchase_description_sequence    SEQUENCE SET     N   SELECT pg_catalog.setval('purchase.purchase_description_sequence', 56, true);
          purchase          postgres    false    266            �           0    0    thread_batch_sequence    SEQUENCE SET     D   SELECT pg_catalog.setval('thread.thread_batch_sequence', 12, true);
          thread          postgres    false    279            �           0    0    thread_challan_sequence    SEQUENCE SET     F   SELECT pg_catalog.setval('thread.thread_challan_sequence', 1, false);
          thread          postgres    false    284            �           0    0    thread_order_info_sequence    SEQUENCE SET     I   SELECT pg_catalog.setval('thread.thread_order_info_sequence', 15, true);
          thread          postgres    false    290            �           0    0    batch_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('zipper.batch_id_seq', 8, true);
          zipper          postgres    false    295            �           0    0    finishing_batch_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('zipper.finishing_batch_id_seq', 4, true);
          zipper          postgres    false    323            �           0    0    order_info_sequence    SEQUENCE SET     B   SELECT pg_catalog.setval('zipper.order_info_sequence', 58, true);
          zipper          postgres    false    240            �           2606    43747    bank bank_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_pkey;
    
   commercial            postgres    false    219            l           2606    46264    cash_receive cash_receive_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY commercial.cash_receive
    ADD CONSTRAINT cash_receive_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY commercial.cash_receive DROP CONSTRAINT cash_receive_pkey;
    
   commercial            postgres    false    326            Z           2606    45558 $   lc_entry_others lc_entry_others_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY commercial.lc_entry_others
    ADD CONSTRAINT lc_entry_others_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY commercial.lc_entry_others DROP CONSTRAINT lc_entry_others_pkey;
    
   commercial            postgres    false    316            P           2606    45328    lc_entry lc_entry_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY commercial.lc_entry
    ADD CONSTRAINT lc_entry_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY commercial.lc_entry DROP CONSTRAINT lc_entry_pkey;
    
   commercial            postgres    false    311            �           2606    43749 
   lc lc_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_pkey;
    
   commercial            postgres    false    221            T           2606    45351 $   manual_pi_entry manual_pi_entry_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY commercial.manual_pi_entry
    ADD CONSTRAINT manual_pi_entry_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY commercial.manual_pi_entry DROP CONSTRAINT manual_pi_entry_pkey;
    
   commercial            postgres    false    313            R           2606    45341    manual_pi manual_pi_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_pkey;
    
   commercial            postgres    false    312            �           2606    43751     pi_cash_entry pi_cash_entry_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pkey;
    
   commercial            postgres    false    224            �           2606    43753    pi_cash pi_cash_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_pkey;
    
   commercial            postgres    false    223            V           2606    45359    carton carton_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY delivery.carton
    ADD CONSTRAINT carton_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY delivery.carton DROP CONSTRAINT carton_pkey;
       delivery            postgres    false    314            �           2606    43757    challan challan_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_pkey;
       delivery            postgres    false    226            �           2606    43759 *   packing_list_entry packing_list_entry_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_pkey;
       delivery            postgres    false    229            �           2606    43761    packing_list packing_list_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_pkey;
       delivery            postgres    false    228            X           2606    45367    vehicle vehicle_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY delivery.vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY delivery.vehicle DROP CONSTRAINT vehicle_pkey;
       delivery            postgres    false    315            �           2606    43763 *   migrations_details migrations_details_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY drizzle.migrations_details
    ADD CONSTRAINT migrations_details_pkey PRIMARY KEY (id);
 U   ALTER TABLE ONLY drizzle.migrations_details DROP CONSTRAINT migrations_details_pkey;
       drizzle            postgres    false    244            �           2606    43765 '   department department_department_unique 
   CONSTRAINT     d   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_department_unique UNIQUE (department);
 M   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_department_unique;
       hr            postgres    false    246            �           2606    43767    department department_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_pkey;
       hr            postgres    false    246            �           2606    43769    department department_unique 
   CONSTRAINT     Y   ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_unique UNIQUE (department);
 B   ALTER TABLE ONLY hr.department DROP CONSTRAINT department_unique;
       hr            postgres    false    246            �           2606    43771 *   designation designation_designation_unique 
   CONSTRAINT     h   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_designation_unique UNIQUE (designation);
 P   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_designation_unique;
       hr            postgres    false    247            �           2606    43773    designation designation_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_pkey;
       hr            postgres    false    247            �           2606    43775    designation designation_unique 
   CONSTRAINT     \   ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_unique UNIQUE (designation);
 D   ALTER TABLE ONLY hr.designation DROP CONSTRAINT designation_unique;
       hr            postgres    false    247            �           2606    43777 (   policy_and_notice policy_and_notice_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_pkey;
       hr            postgres    false    248            �           2606    43779    users users_email_unique 
   CONSTRAINT     P   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_email_unique;
       hr            postgres    false    230            �           2606    43781    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_pkey;
       hr            postgres    false    230            n           2606    46359    info_entry info_entry_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY lab_dip.info_entry
    ADD CONSTRAINT info_entry_pkey PRIMARY KEY (uuid);
 E   ALTER TABLE ONLY lab_dip.info_entry DROP CONSTRAINT info_entry_pkey;
       lab_dip            postgres    false    331            �           2606    43783    info info_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 9   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_pkey;
       lab_dip            postgres    false    249            �           2606    43785    recipe_entry recipe_entry_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_pkey;
       lab_dip            postgres    false    252            �           2606    43787    recipe recipe_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (uuid);
 =   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_pkey;
       lab_dip            postgres    false    251            �           2606    43789 *   shade_recipe_entry shade_recipe_entry_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_pkey PRIMARY KEY (uuid);
 U   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_pkey;
       lab_dip            postgres    false    256            �           2606    43791    shade_recipe shade_recipe_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_pkey PRIMARY KEY (uuid);
 I   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_pkey;
       lab_dip            postgres    false    255            \           2606    45696    booking booking_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY material.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY material.booking DROP CONSTRAINT booking_pkey;
       material            postgres    false    318            �           2606    45535    info info_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY material.info DROP CONSTRAINT info_name_unique;
       material            postgres    false    257            �           2606    43793    info info_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.info DROP CONSTRAINT info_pkey;
       material            postgres    false    257            �           2606    45537    section section_name_unique 
   CONSTRAINT     X   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_name_unique UNIQUE (name);
 G   ALTER TABLE ONLY material.section DROP CONSTRAINT section_name_unique;
       material            postgres    false    258            �           2606    43795    section section_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY material.section DROP CONSTRAINT section_pkey;
       material            postgres    false    258            �           2606    43797    stock stock_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_pkey;
       material            postgres    false    259            �           2606    43799    stock_to_sfg stock_to_sfg_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_pkey;
       material            postgres    false    260            �           2606    43801    trx trx_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_pkey PRIMARY KEY (uuid);
 8   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_pkey;
       material            postgres    false    261            �           2606    45539    type type_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY material.type DROP CONSTRAINT type_name_unique;
       material            postgres    false    262            �           2606    43803    type type_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.type DROP CONSTRAINT type_pkey;
       material            postgres    false    262            �           2606    43805    used used_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY material.used DROP CONSTRAINT used_pkey;
       material            postgres    false    263            �           2606    43807    buyer buyer_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_name_unique;
       public            postgres    false    231            �           2606    43809    buyer buyer_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_pkey;
       public            postgres    false    231            �           2606    43811    factory factory_name_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_name_unique UNIQUE (name);
 E   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_name_unique;
       public            postgres    false    232            �           2606    43813    factory factory_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_pkey;
       public            postgres    false    232            �           2606    43815    machine machine_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_pkey;
       public            postgres    false    264            �           2606    43817    marketing marketing_name_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_name_unique UNIQUE (name);
 I   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_name_unique;
       public            postgres    false    233            �           2606    43819    marketing marketing_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_pkey;
       public            postgres    false    233            b           2606    45713 .   marketing_team_entry marketing_team_entry_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.marketing_team_entry
    ADD CONSTRAINT marketing_team_entry_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY public.marketing_team_entry DROP CONSTRAINT marketing_team_entry_pkey;
       public            postgres    false    320            d           2606    45722 >   marketing_team_member_target marketing_team_member_target_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.marketing_team_member_target
    ADD CONSTRAINT marketing_team_member_target_pkey PRIMARY KEY (uuid);
 h   ALTER TABLE ONLY public.marketing_team_member_target DROP CONSTRAINT marketing_team_member_target_pkey;
       public            postgres    false    321            ^           2606    45705 )   marketing_team marketing_team_name_unique 
   CONSTRAINT     d   ALTER TABLE ONLY public.marketing_team
    ADD CONSTRAINT marketing_team_name_unique UNIQUE (name);
 S   ALTER TABLE ONLY public.marketing_team DROP CONSTRAINT marketing_team_name_unique;
       public            postgres    false    319            `           2606    45703 "   marketing_team marketing_team_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.marketing_team
    ADD CONSTRAINT marketing_team_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY public.marketing_team DROP CONSTRAINT marketing_team_pkey;
       public            postgres    false    319            �           2606    43821 %   merchandiser merchandiser_name_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_name_unique UNIQUE (name);
 O   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_name_unique;
       public            postgres    false    234            �           2606    43823    merchandiser merchandiser_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_pkey;
       public            postgres    false    234            �           2606    43825    party party_name_unique 
   CONSTRAINT     R   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_name_unique UNIQUE (name);
 A   ALTER TABLE ONLY public.party DROP CONSTRAINT party_name_unique;
       public            postgres    false    235            �           2606    43827    party party_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    235            f           2606    45730 ,   production_capacity production_capacity_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.production_capacity
    ADD CONSTRAINT production_capacity_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY public.production_capacity DROP CONSTRAINT production_capacity_pkey;
       public            postgres    false    322            �           2606    43829    properties properties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY public.properties DROP CONSTRAINT properties_pkey;
       public            postgres    false    236            �           2606    43831    section section_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.section DROP CONSTRAINT section_pkey;
       public            postgres    false    265                        2606    43833    description description_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_pkey;
       purchase            postgres    false    267                       2606    43835    entry entry_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (uuid);
 <   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_pkey;
       purchase            postgres    false    268                       2606    43837    vendor vendor_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_pkey;
       purchase            postgres    false    269                       2606    45575 2   assembly_stock assembly_stock_material_uuid_unique 
   CONSTRAINT     v   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_material_uuid_unique UNIQUE (material_uuid);
 \   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_material_uuid_unique;
       slider            postgres    false    270                       2606    43839 "   assembly_stock assembly_stock_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_pkey;
       slider            postgres    false    270            
           2606    43841 .   coloring_transaction coloring_transaction_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_pkey;
       slider            postgres    false    271                       2606    43843    die_casting die_casting_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_pkey;
       slider            postgres    false    272                       2606    43845 2   die_casting_production die_casting_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_pkey;
       slider            postgres    false    273                       2606    43847 @   die_casting_to_assembly_stock die_casting_to_assembly_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_pkey PRIMARY KEY (uuid);
 j   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_pkey;
       slider            postgres    false    274                       2606    43849 4   die_casting_transaction die_casting_transaction_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_pkey PRIMARY KEY (uuid);
 ^   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_pkey;
       slider            postgres    false    275                       2606    43851    production production_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_pkey;
       slider            postgres    false    276            �           2606    43853    stock stock_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_pkey;
       slider            postgres    false    237                       2606    43855    transaction transaction_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_pkey;
       slider            postgres    false    277                       2606    43857 (   trx_against_stock trx_against_stock_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_pkey;
       slider            postgres    false    278                       2606    43859    batch_entry batch_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_pkey;
       thread            postgres    false    281                       2606    43861 2   batch_entry_production batch_entry_production_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_pkey PRIMARY KEY (uuid);
 \   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_pkey;
       thread            postgres    false    282                        2606    43863 $   batch_entry_trx batch_entry_trx_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_pkey;
       thread            postgres    false    283                       2606    43865    batch batch_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pkey;
       thread            postgres    false    280            $           2606    43867     challan_entry challan_entry_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_pkey;
       thread            postgres    false    286            "           2606    43869    challan challan_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_pkey;
       thread            postgres    false    285            &           2606    43871 !   count_length count_length_uuid_pk 
   CONSTRAINT     a   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_uuid_pk PRIMARY KEY (uuid);
 K   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_uuid_pk;
       thread            postgres    false    287            (           2606    43873     dyes_category dyes_category_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_pkey PRIMARY KEY (uuid);
 J   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_pkey;
       thread            postgres    false    288            *           2606    43875    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_pkey;
       thread            postgres    false    289            ,           2606    43877    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_pkey;
       thread            postgres    false    291            .           2606    43879    programs programs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_pkey;
       thread            postgres    false    292            2           2606    43881 #   dyeing_batch_entry batch_entry_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY zipper.dyeing_batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);
 M   ALTER TABLE ONLY zipper.dyeing_batch_entry DROP CONSTRAINT batch_entry_pkey;
       zipper            postgres    false    294            0           2606    43883    dyeing_batch batch_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY zipper.dyeing_batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);
 A   ALTER TABLE ONLY zipper.dyeing_batch DROP CONSTRAINT batch_pkey;
       zipper            postgres    false    293            4           2606    43885 -   dyeing_batch_production batch_production_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY zipper.dyeing_batch_production
    ADD CONSTRAINT batch_production_pkey PRIMARY KEY (uuid);
 W   ALTER TABLE ONLY zipper.dyeing_batch_production DROP CONSTRAINT batch_production_pkey;
       zipper            postgres    false    296            8           2606    43887 F   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_pkey PRIMARY KEY (uuid);
 p   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_pkey;
       zipper            postgres    false    298            6           2606    43889 0   dyed_tape_transaction dyed_tape_transaction_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_pkey;
       zipper            postgres    false    297            j           2606    45755 0   finishing_batch_entry finishing_batch_entry_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.finishing_batch_entry
    ADD CONSTRAINT finishing_batch_entry_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.finishing_batch_entry DROP CONSTRAINT finishing_batch_entry_pkey;
       zipper            postgres    false    325            h           2606    45742 $   finishing_batch finishing_batch_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY zipper.finishing_batch
    ADD CONSTRAINT finishing_batch_pkey PRIMARY KEY (uuid);
 N   ALTER TABLE ONLY zipper.finishing_batch DROP CONSTRAINT finishing_batch_pkey;
       zipper            postgres    false    324            :           2606    43895 R   material_trx_against_order_description material_trx_against_order_description_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_pkey PRIMARY KEY (uuid);
 |   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_pkey;
       zipper            postgres    false    299            L           2606    45071 0   multi_color_dashboard multi_color_dashboard_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.multi_color_dashboard
    ADD CONSTRAINT multi_color_dashboard_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.multi_color_dashboard DROP CONSTRAINT multi_color_dashboard_pkey;
       zipper            postgres    false    308            N           2606    45078 6   multi_color_tape_receive multi_color_tape_receive_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY zipper.multi_color_tape_receive
    ADD CONSTRAINT multi_color_tape_receive_pkey PRIMARY KEY (uuid);
 `   ALTER TABLE ONLY zipper.multi_color_tape_receive DROP CONSTRAINT multi_color_tape_receive_pkey;
       zipper            postgres    false    309            �           2606    43897 (   order_description order_description_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_pkey PRIMARY KEY (uuid);
 R   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_pkey;
       zipper            postgres    false    238            �           2606    43899    order_entry order_entry_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_pkey;
       zipper            postgres    false    239            �           2606    43901    order_info order_info_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_pkey;
       zipper            postgres    false    241            >           2606    43903 "   planning_entry planning_entry_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_pkey PRIMARY KEY (uuid);
 L   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_pkey;
       zipper            postgres    false    301            <           2606    43905    planning planning_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_pkey PRIMARY KEY (week);
 @   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_pkey;
       zipper            postgres    false    300            �           2606    43907    sfg sfg_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_pkey PRIMARY KEY (uuid);
 6   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_pkey;
       zipper            postgres    false    242            @           2606    43909 .   finishing_batch_production sfg_production_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY zipper.finishing_batch_production
    ADD CONSTRAINT sfg_production_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY zipper.finishing_batch_production DROP CONSTRAINT sfg_production_pkey;
       zipper            postgres    false    302            B           2606    43911 0   finishing_batch_transaction sfg_transaction_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY zipper.finishing_batch_transaction
    ADD CONSTRAINT sfg_transaction_pkey PRIMARY KEY (uuid);
 Z   ALTER TABLE ONLY zipper.finishing_batch_transaction DROP CONSTRAINT sfg_transaction_pkey;
       zipper            postgres    false    303            �           2606    45541 (   tape_coil tape_coil_material_uuid_unique 
   CONSTRAINT     l   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_material_uuid_unique UNIQUE (material_uuid);
 R   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_material_uuid_unique;
       zipper            postgres    false    243            �           2606    43913    tape_coil tape_coil_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_pkey PRIMARY KEY (uuid);
 B   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_pkey;
       zipper            postgres    false    243            D           2606    43915 .   tape_coil_production tape_coil_production_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_pkey PRIMARY KEY (uuid);
 X   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_pkey;
       zipper            postgres    false    304            F           2606    43917 *   tape_coil_required tape_coil_required_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_pkey PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_pkey;
       zipper            postgres    false    305            H           2606    43919 ,   tape_coil_to_dyeing tape_coil_to_dyeing_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_pkey PRIMARY KEY (uuid);
 V   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_pkey;
       zipper            postgres    false    306            J           2606    43921    tape_trx tape_to_coil_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_pkey PRIMARY KEY (uuid);
 D   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_pkey;
       zipper            postgres    false    307            i           2620    43922 :   pi_cash_entry sfg_after_commercial_pi_entry_delete_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_delete_trigger AFTER DELETE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_delete_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    224    408            j           2620    43923 :   pi_cash_entry sfg_after_commercial_pi_entry_insert_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_insert_trigger AFTER INSERT ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_insert_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    407    224            k           2620    43924 :   pi_cash_entry sfg_after_commercial_pi_entry_update_trigger    TRIGGER     �   CREATE TRIGGER sfg_after_commercial_pi_entry_update_trigger AFTER UPDATE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();
 W   DROP TRIGGER sfg_after_commercial_pi_entry_update_trigger ON commercial.pi_cash_entry;
    
   commercial          postgres    false    224    409            �           2620    45583 +   lc_entry_others update_up_number_updated_at    TRIGGER     �   CREATE TRIGGER update_up_number_updated_at BEFORE INSERT OR UPDATE OF up_number ON commercial.lc_entry_others FOR EACH ROW EXECUTE FUNCTION commercial.update_up_number_updated_at();
 H   DROP TRIGGER update_up_number_updated_at ON commercial.lc_entry_others;
    
   commercial          postgres    false    336    316    316            o           2620    43934 6   packing_list_entry sfg_after_packing_list_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_delete_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_delete ON delivery.packing_list_entry;
       delivery          postgres    false    229    430            p           2620    43935 6   packing_list_entry sfg_after_packing_list_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_insert_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_insert ON delivery.packing_list_entry;
       delivery          postgres    false    429    229            q           2620    43936 6   packing_list_entry sfg_after_packing_list_entry_update    TRIGGER     �   CREATE TRIGGER sfg_after_packing_list_entry_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_update_function();
 Q   DROP TRIGGER sfg_after_packing_list_entry_update ON delivery.packing_list_entry;
       delivery          postgres    false    431    229            l           2620    46210 1   challan sfg_and_packing_list_after_challan_delete    TRIGGER     �   CREATE TRIGGER sfg_and_packing_list_after_challan_delete AFTER DELETE ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_and_packing_list_after_challan_delete_function();
 L   DROP TRIGGER sfg_and_packing_list_after_challan_delete ON delivery.challan;
       delivery          postgres    false    226    433            m           2620    46209 1   challan sfg_and_packing_list_after_challan_insert    TRIGGER     �   CREATE TRIGGER sfg_and_packing_list_after_challan_insert AFTER INSERT ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_and_packing_list_after_challan_insert_function();
 L   DROP TRIGGER sfg_and_packing_list_after_challan_insert ON delivery.challan;
       delivery          postgres    false    226    432            n           2620    46211 1   challan sfg_and_packing_list_after_challan_update    TRIGGER     �   CREATE TRIGGER sfg_and_packing_list_after_challan_update AFTER UPDATE ON delivery.challan FOR EACH ROW EXECUTE FUNCTION delivery.sfg_and_packing_list_after_challan_update_function();
 L   DROP TRIGGER sfg_and_packing_list_after_challan_update ON delivery.challan;
       delivery          postgres    false    226    434            �           2620    46205 3   booking material_stock_after_booking_delete_trigger    TRIGGER     �   CREATE TRIGGER material_stock_after_booking_delete_trigger AFTER DELETE ON material.booking FOR EACH ROW EXECUTE FUNCTION slider.material_stock_after_booking_delete_function();
 N   DROP TRIGGER material_stock_after_booking_delete_trigger ON material.booking;
       material          postgres    false    459    318            �           2620    46203 3   booking material_stock_after_booking_insert_trigger    TRIGGER     �   CREATE TRIGGER material_stock_after_booking_insert_trigger AFTER INSERT ON material.booking FOR EACH ROW EXECUTE FUNCTION slider.material_stock_after_booking_insert_function();
 N   DROP TRIGGER material_stock_after_booking_insert_trigger ON material.booking;
       material          postgres    false    457    318            �           2620    46204 3   booking material_stock_after_booking_update_trigger    TRIGGER     �   CREATE TRIGGER material_stock_after_booking_update_trigger AFTER UPDATE ON material.booking FOR EACH ROW EXECUTE FUNCTION slider.material_stock_after_booking_update_function();
 N   DROP TRIGGER material_stock_after_booking_update_trigger ON material.booking;
       material          postgres    false    318    458            y           2620    43937 .   info material_stock_after_material_info_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_delete AFTER DELETE ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_delete();
 I   DROP TRIGGER material_stock_after_material_info_delete ON material.info;
       material          postgres    false    257    351            z           2620    43938 .   info material_stock_after_material_info_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_info_insert AFTER INSERT ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_insert();
 I   DROP TRIGGER material_stock_after_material_info_insert ON material.info;
       material          postgres    false    350    257            ~           2620    43939 ,   trx material_stock_after_material_trx_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_delete AFTER DELETE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_delete();
 G   DROP TRIGGER material_stock_after_material_trx_delete ON material.trx;
       material          postgres    false    401    261                       2620    43940 ,   trx material_stock_after_material_trx_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_insert AFTER INSERT ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_insert();
 G   DROP TRIGGER material_stock_after_material_trx_insert ON material.trx;
       material          postgres    false    400    261            �           2620    43941 ,   trx material_stock_after_material_trx_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_trx_update AFTER UPDATE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_update();
 G   DROP TRIGGER material_stock_after_material_trx_update ON material.trx;
       material          postgres    false    414    261            �           2620    43942 .   used material_stock_after_material_used_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_delete AFTER DELETE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_delete();
 I   DROP TRIGGER material_stock_after_material_used_delete ON material.used;
       material          postgres    false    398    263            �           2620    43943 .   used material_stock_after_material_used_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_insert AFTER INSERT ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_insert();
 I   DROP TRIGGER material_stock_after_material_used_insert ON material.used;
       material          postgres    false    263    413            �           2620    43944 .   used material_stock_after_material_used_update    TRIGGER     �   CREATE TRIGGER material_stock_after_material_used_update AFTER UPDATE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_update();
 I   DROP TRIGGER material_stock_after_material_used_update ON material.used;
       material          postgres    false    263    399            {           2620    43945 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_delete    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete AFTER DELETE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_delete ON material.stock_to_sfg;
       material          postgres    false    260    416            |           2620    43946 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_insert    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert AFTER INSERT ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_insert ON material.stock_to_sfg;
       material          postgres    false    415    260            }           2620    43947 9   stock_to_sfg material_stock_sfg_after_stock_to_sfg_update    TRIGGER     �   CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update AFTER UPDATE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();
 T   DROP TRIGGER material_stock_sfg_after_stock_to_sfg_update ON material.stock_to_sfg;
       material          postgres    false    260    417            r           2620    46187 '   party factory_delete_after_party_delete    TRIGGER     �   CREATE TRIGGER factory_delete_after_party_delete AFTER DELETE ON public.party FOR EACH ROW EXECUTE FUNCTION commercial.factory_delete_after_party_delete_funct();
 @   DROP TRIGGER factory_delete_after_party_delete ON public.party;
       public          postgres    false    420    235            s           2620    46185 '   party factory_insert_after_party_insert    TRIGGER     �   CREATE TRIGGER factory_insert_after_party_insert AFTER INSERT ON public.party FOR EACH ROW EXECUTE FUNCTION commercial.factory_insert_after_party_insert_funct();
 @   DROP TRIGGER factory_insert_after_party_insert ON public.party;
       public          postgres    false    235    419            �           2620    43948 0   entry material_stock_after_purchase_entry_delete    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_delete AFTER DELETE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();
 K   DROP TRIGGER material_stock_after_purchase_entry_delete ON purchase.entry;
       purchase          postgres    false    411    268            �           2620    43949 0   entry material_stock_after_purchase_entry_insert    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_insert AFTER INSERT ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();
 K   DROP TRIGGER material_stock_after_purchase_entry_insert ON purchase.entry;
       purchase          postgres    false    410    268            �           2620    43950 0   entry material_stock_after_purchase_entry_update    TRIGGER     �   CREATE TRIGGER material_stock_after_purchase_entry_update AFTER UPDATE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();
 K   DROP TRIGGER material_stock_after_purchase_entry_update ON purchase.entry;
       purchase          postgres    false    412    268            �           2620    43951 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_delete    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete AFTER DELETE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    274    406            �           2620    43952 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_insert    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert AFTER INSERT ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    274    404            �           2620    43953 W   die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_update    TRIGGER     �   CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update AFTER UPDATE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();
 p   DROP TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update ON slider.die_casting_to_assembly_stock;
       slider          postgres    false    405    274            �           2620    43954 M   die_casting_production slider_die_casting_after_die_casting_production_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_delete AFTER DELETE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_delete ON slider.die_casting_production;
       slider          postgres    false    273    367            �           2620    43955 M   die_casting_production slider_die_casting_after_die_casting_production_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_insert AFTER INSERT ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_insert ON slider.die_casting_production;
       slider          postgres    false    273    366            �           2620    43956 M   die_casting_production slider_die_casting_after_die_casting_production_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_die_casting_production_update AFTER UPDATE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();
 f   DROP TRIGGER slider_die_casting_after_die_casting_production_update ON slider.die_casting_production;
       slider          postgres    false    273    368            �           2620    43957 C   trx_against_stock slider_die_casting_after_trx_against_stock_delete    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete AFTER DELETE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_delete ON slider.trx_against_stock;
       slider          postgres    false    371    278            �           2620    43958 C   trx_against_stock slider_die_casting_after_trx_against_stock_insert    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert AFTER INSERT ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_insert ON slider.trx_against_stock;
       slider          postgres    false    370    278            �           2620    43959 C   trx_against_stock slider_die_casting_after_trx_against_stock_update    TRIGGER     �   CREATE TRIGGER slider_die_casting_after_trx_against_stock_update AFTER UPDATE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();
 \   DROP TRIGGER slider_die_casting_after_trx_against_stock_update ON slider.trx_against_stock;
       slider          postgres    false    278    372            �           2620    43960 C   coloring_transaction slider_stock_after_coloring_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_delete AFTER DELETE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_delete ON slider.coloring_transaction;
       slider          postgres    false    435    271            �           2620    43961 C   coloring_transaction slider_stock_after_coloring_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_insert AFTER INSERT ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_insert ON slider.coloring_transaction;
       slider          postgres    false    271    369            �           2620    43962 C   coloring_transaction slider_stock_after_coloring_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_coloring_transaction_update AFTER UPDATE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();
 \   DROP TRIGGER slider_stock_after_coloring_transaction_update ON slider.coloring_transaction;
       slider          postgres    false    271    436            �           2620    43963 I   die_casting_transaction slider_stock_after_die_casting_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_delete AFTER DELETE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_delete ON slider.die_casting_transaction;
       slider          postgres    false    275    373            �           2620    43964 I   die_casting_transaction slider_stock_after_die_casting_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_insert AFTER INSERT ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_insert ON slider.die_casting_transaction;
       slider          postgres    false    275    375            �           2620    43965 I   die_casting_transaction slider_stock_after_die_casting_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_die_casting_transaction_update AFTER UPDATE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();
 b   DROP TRIGGER slider_stock_after_die_casting_transaction_update ON slider.die_casting_transaction;
       slider          postgres    false    275    376            �           2620    43966 6   production slider_stock_after_slider_production_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_delete AFTER DELETE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();
 O   DROP TRIGGER slider_stock_after_slider_production_delete ON slider.production;
       slider          postgres    false    276    438            �           2620    43967 6   production slider_stock_after_slider_production_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_insert AFTER INSERT ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();
 O   DROP TRIGGER slider_stock_after_slider_production_insert ON slider.production;
       slider          postgres    false    276    437            �           2620    43968 6   production slider_stock_after_slider_production_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_slider_production_update AFTER UPDATE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();
 O   DROP TRIGGER slider_stock_after_slider_production_update ON slider.production;
       slider          postgres    false    276    374            �           2620    43969 1   transaction slider_stock_after_transaction_delete    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_delete AFTER DELETE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();
 J   DROP TRIGGER slider_stock_after_transaction_delete ON slider.transaction;
       slider          postgres    false    461    277            �           2620    43970 1   transaction slider_stock_after_transaction_insert    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_insert AFTER INSERT ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();
 J   DROP TRIGGER slider_stock_after_transaction_insert ON slider.transaction;
       slider          postgres    false    277    442            �           2620    43971 1   transaction slider_stock_after_transaction_update    TRIGGER     �   CREATE TRIGGER slider_stock_after_transaction_update AFTER UPDATE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_update();
 J   DROP TRIGGER slider_stock_after_transaction_update ON slider.transaction;
       slider          postgres    false    277    380            �           2620    43972 7   batch order_entry_after_batch_is_dyeing_update_function    TRIGGER     �   CREATE TRIGGER order_entry_after_batch_is_dyeing_update_function AFTER UPDATE OF is_drying_complete ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();
 P   DROP TRIGGER order_entry_after_batch_is_dyeing_update_function ON thread.batch;
       thread          postgres    false    280    377    280            �           2620    43973 M   batch_entry_production thread_batch_entry_after_batch_entry_production_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_delete AFTER DELETE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION commercial.thread_batch_entry_after_batch_entry_production_delete_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_delete ON thread.batch_entry_production;
       thread          postgres    false    445    282            �           2620    43974 M   batch_entry_production thread_batch_entry_after_batch_entry_production_insert    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_insert AFTER INSERT ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION commercial.thread_batch_entry_after_batch_entry_production_insert_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_insert ON thread.batch_entry_production;
       thread          postgres    false    282    444            �           2620    43975 M   batch_entry_production thread_batch_entry_after_batch_entry_production_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_after_batch_entry_production_update AFTER UPDATE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION commercial.thread_batch_entry_after_batch_entry_production_update_funct();
 f   DROP TRIGGER thread_batch_entry_after_batch_entry_production_update ON thread.batch_entry_production;
       thread          postgres    false    446    282            �           2620    43976 H   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx AFTER INSERT ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();
 a   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx ON thread.batch_entry_trx;
       thread          postgres    false    283    447            �           2620    43977 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_delete    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete AFTER DELETE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete ON thread.batch_entry_trx;
       thread          postgres    false    448    283            �           2620    43978 O   batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_update    TRIGGER     �   CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update AFTER UPDATE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION commercial.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();
 h   DROP TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update ON thread.batch_entry_trx;
       thread          postgres    false    283    449            �           2620    43979 1   challan thread_order_entry_after_challan_received    TRIGGER     �   CREATE TRIGGER thread_order_entry_after_challan_received AFTER UPDATE OF received ON thread.challan FOR EACH ROW EXECUTE FUNCTION commercial.thread_order_entry_after_challan_received();
 J   DROP TRIGGER thread_order_entry_after_challan_received ON thread.challan;
       thread          postgres    false    450    285    285            �           2620    46198 [   finishing_batch_transaction finishing_batch_entry_after_finishing_batch_entry_transaction_d    TRIGGER     �   CREATE TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_d AFTER DELETE ON zipper.finishing_batch_transaction FOR EACH ROW EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_d();
 t   DROP TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_d ON zipper.finishing_batch_transaction;
       zipper          postgres    false    303    423            �           2620    46197 [   finishing_batch_transaction finishing_batch_entry_after_finishing_batch_entry_transaction_i    TRIGGER     �   CREATE TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_i AFTER INSERT ON zipper.finishing_batch_transaction FOR EACH ROW EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_i();
 t   DROP TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_i ON zipper.finishing_batch_transaction;
       zipper          postgres    false    303    422            �           2620    46199 [   finishing_batch_transaction finishing_batch_entry_after_finishing_batch_entry_transaction_u    TRIGGER     �   CREATE TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_u AFTER UPDATE ON zipper.finishing_batch_transaction FOR EACH ROW EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_entry_transaction_u();
 t   DROP TRIGGER finishing_batch_entry_after_finishing_batch_entry_transaction_u ON zipper.finishing_batch_transaction;
       zipper          postgres    false    303    424            �           2620    46193 Z   finishing_batch_production finishing_batch_entry_after_finishing_batch_production_delete_t    TRIGGER     �   CREATE TRIGGER finishing_batch_entry_after_finishing_batch_production_delete_t AFTER DELETE ON zipper.finishing_batch_production FOR EACH ROW EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_delete_f();
 s   DROP TRIGGER finishing_batch_entry_after_finishing_batch_production_delete_t ON zipper.finishing_batch_production;
       zipper          postgres    false    421    302            �           2620    46189 Z   finishing_batch_production finishing_batch_entry_after_finishing_batch_production_insert_t    TRIGGER     �   CREATE TRIGGER finishing_batch_entry_after_finishing_batch_production_insert_t AFTER INSERT ON zipper.finishing_batch_production FOR EACH ROW EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_insert_f();
 s   DROP TRIGGER finishing_batch_entry_after_finishing_batch_production_insert_t ON zipper.finishing_batch_production;
       zipper          postgres    false    402    302            �           2620    46191 Z   finishing_batch_production finishing_batch_entry_after_finishing_batch_production_update_t    TRIGGER     �   CREATE TRIGGER finishing_batch_entry_after_finishing_batch_production_update_t AFTER UPDATE ON zipper.finishing_batch_production FOR EACH ROW EXECUTE FUNCTION zipper.finishing_batch_entry_after_finishing_batch_production_update_f();
 s   DROP TRIGGER finishing_batch_entry_after_finishing_batch_production_update_t ON zipper.finishing_batch_production;
       zipper          postgres    false    302    403            t           2620    45140 F   order_description multi_color_dashboard_after_order_description_delete    TRIGGER     �   CREATE TRIGGER multi_color_dashboard_after_order_description_delete AFTER DELETE ON zipper.order_description FOR EACH ROW EXECUTE FUNCTION zipper.multi_color_dashboard_after_order_description_delete();
 _   DROP TRIGGER multi_color_dashboard_after_order_description_delete ON zipper.order_description;
       zipper          postgres    false    238    395            u           2620    45138 F   order_description multi_color_dashboard_after_order_description_insert    TRIGGER     �   CREATE TRIGGER multi_color_dashboard_after_order_description_insert AFTER INSERT ON zipper.order_description FOR EACH ROW EXECUTE FUNCTION zipper.multi_color_dashboard_after_order_description_insert();
 _   DROP TRIGGER multi_color_dashboard_after_order_description_insert ON zipper.order_description;
       zipper          postgres    false    428    238            v           2620    45139 F   order_description multi_color_dashboard_after_order_description_update    TRIGGER     �   CREATE TRIGGER multi_color_dashboard_after_order_description_update AFTER UPDATE ON zipper.order_description FOR EACH ROW EXECUTE FUNCTION zipper.multi_color_dashboard_after_order_description_update();
 _   DROP TRIGGER multi_color_dashboard_after_order_description_update ON zipper.order_description;
       zipper          postgres    false    394    238            �           2620    43980 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_delete_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger AFTER DELETE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_delete_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    297    379            �           2620    43981 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_insert_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger AFTER INSERT ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_insert_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    297    378            �           2620    43982 R   dyed_tape_transaction order_description_after_dyed_tape_transaction_update_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_dyed_tape_transaction_update_trigger AFTER UPDATE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();
 k   DROP TRIGGER order_description_after_dyed_tape_transaction_update_trigger ON zipper.dyed_tape_transaction;
       zipper          postgres    false    297    454            �           2620    45115 X   multi_color_tape_receive order_description_after_multi_color_tape_receive_delete_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_multi_color_tape_receive_delete_trigger AFTER DELETE ON zipper.multi_color_tape_receive FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_multi_color_tape_receive_delete();
 q   DROP TRIGGER order_description_after_multi_color_tape_receive_delete_trigger ON zipper.multi_color_tape_receive;
       zipper          postgres    false    391    309            �           2620    45113 X   multi_color_tape_receive order_description_after_multi_color_tape_receive_insert_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_multi_color_tape_receive_insert_trigger AFTER INSERT ON zipper.multi_color_tape_receive FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_multi_color_tape_receive_insert();
 q   DROP TRIGGER order_description_after_multi_color_tape_receive_insert_trigger ON zipper.multi_color_tape_receive;
       zipper          postgres    false    392    309            �           2620    45114 X   multi_color_tape_receive order_description_after_multi_color_tape_receive_update_trigger    TRIGGER     �   CREATE TRIGGER order_description_after_multi_color_tape_receive_update_trigger AFTER UPDATE ON zipper.multi_color_tape_receive FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_multi_color_tape_receive_update();
 q   DROP TRIGGER order_description_after_multi_color_tape_receive_update_trigger ON zipper.multi_color_tape_receive;
       zipper          postgres    false    309    390            w           2620    43983 (   order_entry sfg_after_order_entry_delete    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_delete AFTER DELETE ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();
 A   DROP TRIGGER sfg_after_order_entry_delete ON zipper.order_entry;
       zipper          postgres    false    239    382            x           2620    43984 (   order_entry sfg_after_order_entry_insert    TRIGGER     �   CREATE TRIGGER sfg_after_order_entry_insert AFTER INSERT ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();
 A   DROP TRIGGER sfg_after_order_entry_insert ON zipper.order_entry;
       zipper          postgres    false    239    383            �           2620    43991 `   material_trx_against_order_description stock_after_material_trx_against_order_description_delete    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_delete AFTER DELETE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_delete ON zipper.material_trx_against_order_description;
       zipper          postgres    false    365    299            �           2620    43992 `   material_trx_against_order_description stock_after_material_trx_against_order_description_insert    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_insert AFTER INSERT ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_insert ON zipper.material_trx_against_order_description;
       zipper          postgres    false    396    299            �           2620    43993 `   material_trx_against_order_description stock_after_material_trx_against_order_description_update    TRIGGER     �   CREATE TRIGGER stock_after_material_trx_against_order_description_update AFTER UPDATE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();
 y   DROP TRIGGER stock_after_material_trx_against_order_description_update ON zipper.material_trx_against_order_description;
       zipper          postgres    false    397    299            �           2620    46213 E   finishing_batch_entry stock_after_zipper_finishing_batch_entry_delete    TRIGGER     �   CREATE TRIGGER stock_after_zipper_finishing_batch_entry_delete AFTER DELETE ON zipper.finishing_batch_entry FOR EACH ROW EXECUTE FUNCTION slider.stock_after_zipper_finishing_batch_entry_delete_funct();
 ^   DROP TRIGGER stock_after_zipper_finishing_batch_entry_delete ON zipper.finishing_batch_entry;
       zipper          postgres    false    439    325            �           2620    43994 9   tape_coil_production tape_coil_after_tape_coil_production    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production AFTER INSERT ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();
 R   DROP TRIGGER tape_coil_after_tape_coil_production ON zipper.tape_coil_production;
       zipper          postgres    false    304    440            �           2620    43995 @   tape_coil_production tape_coil_after_tape_coil_production_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_delete AFTER DELETE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_delete ON zipper.tape_coil_production;
       zipper          postgres    false    304    441            �           2620    43996 @   tape_coil_production tape_coil_after_tape_coil_production_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_coil_production_update AFTER UPDATE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();
 Y   DROP TRIGGER tape_coil_after_tape_coil_production_update ON zipper.tape_coil_production;
       zipper          postgres    false    443    304            �           2620    43997 .   tape_trx tape_coil_after_tape_trx_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_delete AFTER DELETE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_delete ON zipper.tape_trx;
       zipper          postgres    false    307    386            �           2620    43998 .   tape_trx tape_coil_after_tape_trx_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_insert AFTER INSERT ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_insert ON zipper.tape_trx;
       zipper          postgres    false    307    385            �           2620    43999 .   tape_trx tape_coil_after_tape_trx_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_after_tape_trx_after_update AFTER UPDATE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();
 G   DROP TRIGGER tape_coil_after_tape_trx_after_update ON zipper.tape_trx;
       zipper          postgres    false    387    307            �           2620    44000 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_del    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del AFTER DELETE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    389    298            �           2620    44001 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_ins    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins AFTER INSERT ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    388    298            �           2620    44002 `   dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_upd    TRIGGER     �   CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();
 y   DROP TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd ON zipper.dyed_tape_transaction_from_stock;
       zipper          postgres    false    298    460            �           2620    44003 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_delete    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_delete AFTER DELETE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();
 M   DROP TRIGGER tape_coil_to_dyeing_after_delete ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    306    381            �           2620    44004 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_insert    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_insert AFTER INSERT ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();
 M   DROP TRIGGER tape_coil_to_dyeing_after_insert ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    306    393            �           2620    44005 4   tape_coil_to_dyeing tape_coil_to_dyeing_after_update    TRIGGER     �   CREATE TRIGGER tape_coil_to_dyeing_after_update AFTER UPDATE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();
 M   DROP TRIGGER tape_coil_to_dyeing_after_update ON zipper.tape_coil_to_dyeing;
       zipper          postgres    false    306    384            �           2620    46226 V   dyeing_batch_production zipper_dyeing_batch_entry_after_dyeing_batch_production_delete    TRIGGER     �   CREATE TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_delete AFTER DELETE ON zipper.dyeing_batch_production FOR EACH ROW EXECUTE FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production_delete();
 o   DROP TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_delete ON zipper.dyeing_batch_production;
       zipper          postgres    false    453    296            �           2620    46224 V   dyeing_batch_production zipper_dyeing_batch_entry_after_dyeing_batch_production_insert    TRIGGER     �   CREATE TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_insert AFTER INSERT ON zipper.dyeing_batch_production FOR EACH ROW EXECUTE FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production_insert();
 o   DROP TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_insert ON zipper.dyeing_batch_production;
       zipper          postgres    false    296    451            �           2620    46225 V   dyeing_batch_production zipper_dyeing_batch_entry_after_dyeing_batch_production_update    TRIGGER     �   CREATE TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_update AFTER UPDATE ON zipper.dyeing_batch_production FOR EACH ROW EXECUTE FUNCTION commercial.zipper_dyeing_batch_entry_after_dyeing_batch_production__update();
 o   DROP TRIGGER zipper_dyeing_batch_entry_after_dyeing_batch_production_update ON zipper.dyeing_batch_production;
       zipper          postgres    false    296    452            �           2620    46228 E   finishing_batch zipper_order_description_after_finishing_batch_update    TRIGGER     �   CREATE TRIGGER zipper_order_description_after_finishing_batch_update AFTER UPDATE ON zipper.finishing_batch FOR EACH ROW EXECUTE FUNCTION zipper.zipper_order_description_after_finishing_batch_update();
 ^   DROP TRIGGER zipper_order_description_after_finishing_batch_update ON zipper.finishing_batch;
       zipper          postgres    false    324    455            �           2620    46230 :   dyeing_batch zipper_sfg_after_dyeing_batch_received_update    TRIGGER     �   CREATE TRIGGER zipper_sfg_after_dyeing_batch_received_update AFTER UPDATE OF received ON zipper.dyeing_batch FOR EACH ROW EXECUTE FUNCTION zipper.zipper_sfg_after_dyeing_batch_received_update();
 S   DROP TRIGGER zipper_sfg_after_dyeing_batch_received_update ON zipper.dyeing_batch;
       zipper          postgres    false    456    293    293            �           2620    46232 C   finishing_batch_entry zipper_sfg_after_finishing_batch_entry_update    TRIGGER     �   CREATE TRIGGER zipper_sfg_after_finishing_batch_entry_update AFTER UPDATE ON zipper.finishing_batch_entry FOR EACH ROW EXECUTE FUNCTION zipper.zipper_sfg_after_finishing_batch_entry_update();
 \   DROP TRIGGER zipper_sfg_after_finishing_batch_entry_update ON zipper.finishing_batch_entry;
       zipper          postgres    false    462    325            o           2606    44009 "   bank bank_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 P   ALTER TABLE ONLY commercial.bank DROP CONSTRAINT bank_created_by_users_uuid_fk;
    
   commercial          postgres    false    4008    219    230            d           2606    46271 2   cash_receive cash_receive_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.cash_receive
    ADD CONSTRAINT cash_receive_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY commercial.cash_receive DROP CONSTRAINT cash_receive_created_by_users_uuid_fk;
    
   commercial          postgres    false    326    230    4008            e           2606    46266 6   cash_receive cash_receive_pi_cash_uuid_pi_cash_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.cash_receive
    ADD CONSTRAINT cash_receive_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);
 d   ALTER TABLE ONLY commercial.cash_receive DROP CONSTRAINT cash_receive_pi_cash_uuid_pi_cash_uuid_fk;
    
   commercial          postgres    false    326    223    3996            p           2606    44014    lc lc_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_created_by_users_uuid_fk;
    
   commercial          postgres    false    4008    221    230            E           2606    45383 $   lc_entry lc_entry_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc_entry
    ADD CONSTRAINT lc_entry_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 R   ALTER TABLE ONLY commercial.lc_entry DROP CONSTRAINT lc_entry_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    311    221    3994            P           2606    45564 2   lc_entry_others lc_entry_others_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc_entry_others
    ADD CONSTRAINT lc_entry_others_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 `   ALTER TABLE ONLY commercial.lc_entry_others DROP CONSTRAINT lc_entry_others_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    3994    221    316            q           2606    44019    lc lc_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 L   ALTER TABLE ONLY commercial.lc DROP CONSTRAINT lc_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    221    4028    235            F           2606    45413 *   manual_pi manual_pi_bank_uuid_bank_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);
 X   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_bank_uuid_bank_uuid_fk;
    
   commercial          postgres    false    3992    219    312            G           2606    45398 ,   manual_pi manual_pi_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 Z   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_buyer_uuid_buyer_uuid_fk;
    
   commercial          postgres    false    4012    312    231            H           2606    45418 ,   manual_pi manual_pi_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_created_by_users_uuid_fk;
    
   commercial          postgres    false    230    312    4008            M           2606    45423 @   manual_pi_entry manual_pi_entry_manual_pi_uuid_manual_pi_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi_entry
    ADD CONSTRAINT manual_pi_entry_manual_pi_uuid_manual_pi_uuid_fk FOREIGN KEY (manual_pi_uuid) REFERENCES commercial.manual_pi(uuid);
 n   ALTER TABLE ONLY commercial.manual_pi_entry DROP CONSTRAINT manual_pi_entry_manual_pi_uuid_manual_pi_uuid_fk;
    
   commercial          postgres    false    313    312    4178            I           2606    45408 0   manual_pi manual_pi_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 ^   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_factory_uuid_factory_uuid_fk;
    
   commercial          postgres    false    4016    232    312            J           2606    45388 4   manual_pi manual_pi_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 b   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_marketing_uuid_marketing_uuid_fk;
    
   commercial          postgres    false    4020    233    312            K           2606    45403 :   manual_pi manual_pi_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 h   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_merchandiser_uuid_merchandiser_uuid_fk;
    
   commercial          postgres    false    234    4024    312            L           2606    45393 ,   manual_pi manual_pi_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.manual_pi
    ADD CONSTRAINT manual_pi_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 Z   ALTER TABLE ONLY commercial.manual_pi DROP CONSTRAINT manual_pi_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    235    312    4028            r           2606    44024 &   pi_cash pi_cash_bank_uuid_bank_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);
 T   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk;
    
   commercial          postgres    false    219    3992    223            s           2606    44029 (   pi_cash pi_cash_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_created_by_users_uuid_fk;
    
   commercial          postgres    false    4008    223    230            y           2606    44034 8   pi_cash_entry pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);
 f   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk;
    
   commercial          postgres    false    223    3996    224            z           2606    44039 0   pi_cash_entry pi_cash_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk;
    
   commercial          postgres    false    242    224    4040            {           2606    44044 G   pi_cash_entry pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (thread_order_entry_uuid) REFERENCES thread.order_entry(uuid);
 u   ALTER TABLE ONLY commercial.pi_cash_entry DROP CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk;
    
   commercial          postgres    false    289    224    4138            t           2606    44049 ,   pi_cash pi_cash_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 Z   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk;
    
   commercial          postgres    false    223    4016    232            u           2606    44054 "   pi_cash pi_cash_lc_uuid_lc_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);
 P   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk;
    
   commercial          postgres    false    223    221    3994            v           2606    44059 0   pi_cash pi_cash_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 ^   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk;
    
   commercial          postgres    false    233    4020    223            w           2606    44064 6   pi_cash pi_cash_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 d   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk;
    
   commercial          postgres    false    234    4024    223            x           2606    44069 (   pi_cash pi_cash_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 V   ALTER TABLE ONLY commercial.pi_cash DROP CONSTRAINT pi_cash_party_uuid_party_uuid_fk;
    
   commercial          postgres    false    4028    235    223            N           2606    45428 &   carton carton_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.carton
    ADD CONSTRAINT carton_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY delivery.carton DROP CONSTRAINT carton_created_by_users_uuid_fk;
       delivery          postgres    false    314    4008    230            |           2606    44074 '   challan challan_assign_to_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_assign_to_users_uuid_fk;
       delivery          postgres    false    4008    230    226            }           2606    44079 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       delivery          postgres    false    4008    230    226            ~           2606    44094 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 ^   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    226    241    4038                       2606    45863 9   challan challan_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 e   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_thread_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    4140    291    226            �           2606    45438 ,   challan challan_vehicle_uuid_vehicle_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_vehicle_uuid_vehicle_uuid_fk FOREIGN KEY (vehicle_uuid) REFERENCES delivery.vehicle(uuid);
 X   ALTER TABLE ONLY delivery.challan DROP CONSTRAINT challan_vehicle_uuid_vehicle_uuid_fk;
       delivery          postgres    false    4184    226    315            �           2606    45448 4   packing_list packing_list_carton_uuid_carton_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_carton_uuid_carton_uuid_fk FOREIGN KEY (carton_uuid) REFERENCES delivery.carton(uuid);
 `   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_carton_uuid_carton_uuid_fk;
       delivery          postgres    false    4182    314    228            �           2606    44099 6   packing_list packing_list_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);
 b   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_challan_uuid_challan_uuid_fk;
       delivery          postgres    false    226    4000    228            �           2606    44104 2   packing_list packing_list_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_created_by_users_uuid_fk;
       delivery          postgres    false    4008    228    230            �           2606    44109 L   packing_list_entry packing_list_entry_packing_list_uuid_packing_list_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);
 x   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk;
       delivery          postgres    false    229    4002    228            �           2606    44114 :   packing_list_entry packing_list_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 f   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk;
       delivery          postgres    false    242    229    4040            �           2606    45873 Q   packing_list_entry packing_list_entry_thread_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_thread_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (thread_order_entry_uuid) REFERENCES thread.order_entry(uuid);
 }   ALTER TABLE ONLY delivery.packing_list_entry DROP CONSTRAINT packing_list_entry_thread_order_entry_uuid_order_entry_uuid_fk;
       delivery          postgres    false    289    229    4138            �           2606    44119 <   packing_list packing_list_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 h   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    228    4038    241            �           2606    45868 C   packing_list packing_list_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 o   ALTER TABLE ONLY delivery.packing_list DROP CONSTRAINT packing_list_thread_order_info_uuid_order_info_uuid_fk;
       delivery          postgres    false    228    291    4140            O           2606    45433 (   vehicle vehicle_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY delivery.vehicle
    ADD CONSTRAINT vehicle_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY delivery.vehicle DROP CONSTRAINT vehicle_created_by_users_uuid_fk;
       delivery          postgres    false    315    4008    230            �           2606    44124    users hr_user_department    FK CONSTRAINT     ~   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT hr_user_department FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 >   ALTER TABLE ONLY hr.users DROP CONSTRAINT hr_user_department;
       hr          postgres    false    4050    246    230            �           2606    44129 <   policy_and_notice policy_and_notice_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY hr.policy_and_notice DROP CONSTRAINT policy_and_notice_created_by_users_uuid_fk;
       hr          postgres    false    4008    230    248            �           2606    44134 .   users users_department_uuid_department_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_department_uuid_department_uuid_fk FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);
 T   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_department_uuid_department_uuid_fk;
       hr          postgres    false    4050    230    246            �           2606    44139 0   users users_designation_uuid_designation_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_designation_uuid_designation_uuid_fk FOREIGN KEY (designation_uuid) REFERENCES hr.designation(uuid);
 V   ALTER TABLE ONLY hr.users DROP CONSTRAINT users_designation_uuid_designation_uuid_fk;
       hr          postgres    false    4056    230    247            �           2606    44144 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 M   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       lab_dip          postgres    false    249    4008    230            f           2606    46370 .   info_entry info_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info_entry
    ADD CONSTRAINT info_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Y   ALTER TABLE ONLY lab_dip.info_entry DROP CONSTRAINT info_entry_created_by_users_uuid_fk;
       lab_dip          postgres    false    4008    230    331            g           2606    46360 4   info_entry info_entry_lab_dip_info_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info_entry
    ADD CONSTRAINT info_entry_lab_dip_info_uuid_info_uuid_fk FOREIGN KEY (lab_dip_info_uuid) REFERENCES lab_dip.info(uuid);
 _   ALTER TABLE ONLY lab_dip.info_entry DROP CONSTRAINT info_entry_lab_dip_info_uuid_info_uuid_fk;
       lab_dip          postgres    false    249    331    4062            h           2606    46365 0   info_entry info_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info_entry
    ADD CONSTRAINT info_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 [   ALTER TABLE ONLY lab_dip.info_entry DROP CONSTRAINT info_entry_recipe_uuid_recipe_uuid_fk;
       lab_dip          postgres    false    331    4064    251            �           2606    44149 ,   info info_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 W   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    4038    249    241            �           2606    44154 3   info info_thread_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);
 ^   ALTER TABLE ONLY lab_dip.info DROP CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk;
       lab_dip          postgres    false    4140    249    291            �           2606    44159 &   recipe recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Q   ALTER TABLE ONLY lab_dip.recipe DROP CONSTRAINT recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    4008    230    251            �           2606    44164 4   recipe_entry recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    252    4074    257            �           2606    44169 4   recipe_entry recipe_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 _   ALTER TABLE ONLY lab_dip.recipe_entry DROP CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk;
       lab_dip          postgres    false    251    252    4064            �           2606    44179 2   shade_recipe shade_recipe_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ]   ALTER TABLE ONLY lab_dip.shade_recipe DROP CONSTRAINT shade_recipe_created_by_users_uuid_fk;
       lab_dip          postgres    false    4008    255    230            �           2606    44184 @   shade_recipe_entry shade_recipe_entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 k   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk;
       lab_dip          postgres    false    4074    256    257            �           2606    44189 L   shade_recipe_entry shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk FOREIGN KEY (shade_recipe_uuid) REFERENCES lab_dip.shade_recipe(uuid);
 w   ALTER TABLE ONLY lab_dip.shade_recipe_entry DROP CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk;
       lab_dip          postgres    false    4068    256    255            Q           2606    45778 (   booking booking_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.booking
    ADD CONSTRAINT booking_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY material.booking DROP CONSTRAINT booking_created_by_users_uuid_fk;
       material          postgres    false    230    4008    318            R           2606    45773 0   booking booking_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.booking
    ADD CONSTRAINT booking_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 \   ALTER TABLE ONLY material.booking DROP CONSTRAINT booking_marketing_uuid_marketing_uuid_fk;
       material          postgres    false    318    233    4020            S           2606    45768 *   booking booking_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.booking
    ADD CONSTRAINT booking_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 V   ALTER TABLE ONLY material.booking DROP CONSTRAINT booking_material_uuid_info_uuid_fk;
       material          postgres    false    318    257    4074            �           2606    44194 "   info info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.info DROP CONSTRAINT info_created_by_users_uuid_fk;
       material          postgres    false    4008    257    230            �           2606    44199 &   info info_section_uuid_section_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_section_uuid_section_uuid_fk FOREIGN KEY (section_uuid) REFERENCES material.section(uuid);
 R   ALTER TABLE ONLY material.info DROP CONSTRAINT info_section_uuid_section_uuid_fk;
       material          postgres    false    4078    257    258            �           2606    44204     info info_type_uuid_type_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_type_uuid_type_uuid_fk FOREIGN KEY (type_uuid) REFERENCES material.type(uuid);
 L   ALTER TABLE ONLY material.info DROP CONSTRAINT info_type_uuid_type_uuid_fk;
       material          postgres    false    4088    257    262            �           2606    44209 (   section section_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY material.section DROP CONSTRAINT section_created_by_users_uuid_fk;
       material          postgres    false    230    258    4008            �           2606    45475 &   stock stock_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid) ON DELETE CASCADE;
 R   ALTER TABLE ONLY material.stock DROP CONSTRAINT stock_material_uuid_info_uuid_fk;
       material          postgres    false    4074    259    257            �           2606    44219 2   stock_to_sfg stock_to_sfg_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_created_by_users_uuid_fk;
       material          postgres    false    260    4008    230            �           2606    44224 4   stock_to_sfg stock_to_sfg_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 `   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk;
       material          postgres    false    257    260    4074            �           2606    44229 >   stock_to_sfg stock_to_sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 j   ALTER TABLE ONLY material.stock_to_sfg DROP CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk;
       material          postgres    false    4036    260    239            �           2606    45878 $   trx trx_booking_uuid_booking_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_booking_uuid_booking_uuid_fk FOREIGN KEY (booking_uuid) REFERENCES material.booking(uuid);
 P   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_booking_uuid_booking_uuid_fk;
       material          postgres    false    318    4188    261            �           2606    44234     trx trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 L   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_created_by_users_uuid_fk;
       material          postgres    false    4008    261    230            �           2606    44239 "   trx trx_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 N   ALTER TABLE ONLY material.trx DROP CONSTRAINT trx_material_uuid_info_uuid_fk;
       material          postgres    false    4074    261    257            �           2606    44244 "   type type_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.type DROP CONSTRAINT type_created_by_users_uuid_fk;
       material          postgres    false    4008    262    230            �           2606    44249 "   used used_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY material.used DROP CONSTRAINT used_created_by_users_uuid_fk;
       material          postgres    false    4008    263    230            �           2606    44254 $   used used_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 P   ALTER TABLE ONLY material.used DROP CONSTRAINT used_material_uuid_info_uuid_fk;
       material          postgres    false    4074    263    257            �           2606    44259 $   buyer buyer_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.buyer DROP CONSTRAINT buyer_created_by_users_uuid_fk;
       public          postgres    false    4008    231    230            �           2606    44264 (   factory factory_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_created_by_users_uuid_fk;
       public          postgres    false    232    4008    230            �           2606    44269 (   factory factory_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 R   ALTER TABLE ONLY public.factory DROP CONSTRAINT factory_party_uuid_party_uuid_fk;
       public          postgres    false    232    4028    235            �           2606    44274 (   machine machine_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY public.machine DROP CONSTRAINT machine_created_by_users_uuid_fk;
       public          postgres    false    230    264    4008            �           2606    44279 ,   marketing marketing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_created_by_users_uuid_fk;
       public          postgres    false    4008    233    230            T           2606    45783 6   marketing_team marketing_team_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing_team
    ADD CONSTRAINT marketing_team_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY public.marketing_team DROP CONSTRAINT marketing_team_created_by_users_uuid_fk;
       public          postgres    false    4008    319    230            U           2606    45798 B   marketing_team_entry marketing_team_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing_team_entry
    ADD CONSTRAINT marketing_team_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY public.marketing_team_entry DROP CONSTRAINT marketing_team_entry_created_by_users_uuid_fk;
       public          postgres    false    320    230    4008            V           2606    45788 T   marketing_team_entry marketing_team_entry_marketing_team_uuid_marketing_team_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing_team_entry
    ADD CONSTRAINT marketing_team_entry_marketing_team_uuid_marketing_team_uuid_fk FOREIGN KEY (marketing_team_uuid) REFERENCES public.marketing_team(uuid);
 ~   ALTER TABLE ONLY public.marketing_team_entry DROP CONSTRAINT marketing_team_entry_marketing_team_uuid_marketing_team_uuid_fk;
       public          postgres    false    320    4192    319            W           2606    45793 J   marketing_team_entry marketing_team_entry_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing_team_entry
    ADD CONSTRAINT marketing_team_entry_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 t   ALTER TABLE ONLY public.marketing_team_entry DROP CONSTRAINT marketing_team_entry_marketing_uuid_marketing_uuid_fk;
       public          postgres    false    320    4020    233            X           2606    45808 R   marketing_team_member_target marketing_team_member_target_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing_team_member_target
    ADD CONSTRAINT marketing_team_member_target_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 |   ALTER TABLE ONLY public.marketing_team_member_target DROP CONSTRAINT marketing_team_member_target_created_by_users_uuid_fk;
       public          postgres    false    4008    230    321            Y           2606    45803 Z   marketing_team_member_target marketing_team_member_target_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing_team_member_target
    ADD CONSTRAINT marketing_team_member_target_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 �   ALTER TABLE ONLY public.marketing_team_member_target DROP CONSTRAINT marketing_team_member_target_marketing_uuid_marketing_uuid_fk;
       public          postgres    false    233    4020    321            �           2606    44284 +   marketing marketing_user_uuid_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_user_uuid_users_uuid_fk FOREIGN KEY (user_uuid) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY public.marketing DROP CONSTRAINT marketing_user_uuid_users_uuid_fk;
       public          postgres    false    4008    233    230            �           2606    44289 2   merchandiser merchandiser_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_created_by_users_uuid_fk;
       public          postgres    false    4008    234    230            �           2606    44294 2   merchandiser merchandiser_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 \   ALTER TABLE ONLY public.merchandiser DROP CONSTRAINT merchandiser_party_uuid_party_uuid_fk;
       public          postgres    false    4028    234    235            �           2606    44299 $   party party_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY public.party DROP CONSTRAINT party_created_by_users_uuid_fk;
       public          postgres    false    4008    235    230            Z           2606    45833 @   production_capacity production_capacity_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.production_capacity
    ADD CONSTRAINT production_capacity_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 j   ALTER TABLE ONLY public.production_capacity DROP CONSTRAINT production_capacity_created_by_users_uuid_fk;
       public          postgres    false    322    4008    230            [           2606    45828 C   production_capacity production_capacity_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.production_capacity
    ADD CONSTRAINT production_capacity_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 m   ALTER TABLE ONLY public.production_capacity DROP CONSTRAINT production_capacity_end_type_properties_uuid_fk;
       public          postgres    false    4030    236    322            \           2606    45813 ?   production_capacity production_capacity_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.production_capacity
    ADD CONSTRAINT production_capacity_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY public.production_capacity DROP CONSTRAINT production_capacity_item_properties_uuid_fk;
       public          postgres    false    236    322    4030            ]           2606    45818 H   production_capacity production_capacity_nylon_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.production_capacity
    ADD CONSTRAINT production_capacity_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY public.production_capacity DROP CONSTRAINT production_capacity_nylon_stopper_properties_uuid_fk;
       public          postgres    false    236    322    4030            ^           2606    45823 H   production_capacity production_capacity_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.production_capacity
    ADD CONSTRAINT production_capacity_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY public.production_capacity DROP CONSTRAINT production_capacity_zipper_number_properties_uuid_fk;
       public          postgres    false    236    4030    322            �           2606    44304 0   description description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_created_by_users_uuid_fk;
       purchase          postgres    false    4008    267    230            �           2606    44309 2   description description_vendor_uuid_vendor_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_vendor_uuid_vendor_uuid_fk FOREIGN KEY (vendor_uuid) REFERENCES purchase.vendor(uuid);
 ^   ALTER TABLE ONLY purchase.description DROP CONSTRAINT description_vendor_uuid_vendor_uuid_fk;
       purchase          postgres    false    269    267    4100            �           2606    44314 &   entry entry_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 R   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_material_uuid_info_uuid_fk;
       purchase          postgres    false    268    4074    257            �           2606    44319 9   entry entry_purchase_description_uuid_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_purchase_description_uuid_description_uuid_fk FOREIGN KEY (purchase_description_uuid) REFERENCES purchase.description(uuid);
 e   ALTER TABLE ONLY purchase.entry DROP CONSTRAINT entry_purchase_description_uuid_description_uuid_fk;
       purchase          postgres    false    267    268    4096            �           2606    44324 &   vendor vendor_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY purchase.vendor DROP CONSTRAINT vendor_created_by_users_uuid_fk;
       purchase          postgres    false    4008    269    230            �           2606    44329 6   assembly_stock assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 `   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    4008    270    230            �           2606    44334 G   assembly_stock assembly_stock_die_casting_body_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_body_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_body_uuid) REFERENCES slider.die_casting(uuid);
 q   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_body_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    270    272            �           2606    44339 F   assembly_stock assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_cap_uuid) REFERENCES slider.die_casting(uuid);
 p   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_cap_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    270    272            �           2606    44344 G   assembly_stock assembly_stock_die_casting_link_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_link_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_link_uuid) REFERENCES slider.die_casting(uuid);
 q   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_link_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    270    272            �           2606    44349 I   assembly_stock assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_puller_uuid) REFERENCES slider.die_casting(uuid);
 s   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_die_casting_puller_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    270    272            �           2606    45569 8   assembly_stock assembly_stock_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 b   ALTER TABLE ONLY slider.assembly_stock DROP CONSTRAINT assembly_stock_material_uuid_info_uuid_fk;
       slider          postgres    false    4074    270    257            �           2606    44354 B   coloring_transaction coloring_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_created_by_users_uuid_fk;
       slider          postgres    false    271    230    4008            �           2606    44359 L   coloring_transaction coloring_transaction_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 v   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk;
       slider          postgres    false    271    4038    241            �           2606    44364 B   coloring_transaction coloring_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 l   ALTER TABLE ONLY slider.coloring_transaction DROP CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    271    4032    237            �           2606    45103 0   die_casting die_casting_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_created_by_users_uuid_fk;
       slider          postgres    false    4008    230    272            �           2606    44369 3   die_casting die_casting_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 ]   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_end_type_properties_uuid_fk;
       slider          postgres    false    236    272    4030            �           2606    44374 /   die_casting die_casting_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 Y   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_item_properties_uuid_fk;
       slider          postgres    false    4030    272    236            �           2606    44379 4   die_casting die_casting_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 ^   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_logo_type_properties_uuid_fk;
       slider          postgres    false    4030    272    236            �           2606    44384 F   die_casting_production die_casting_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_created_by_users_uuid_fk;
       slider          postgres    false    4008    273    230            �           2606    44389 R   die_casting_production die_casting_production_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 |   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    273    272            �           2606    45883 V   die_casting_production die_casting_production_finishing_batch_uuid_finishing_batch_uui    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_finishing_batch_uuid_finishing_batch_uui FOREIGN KEY (finishing_batch_uuid) REFERENCES zipper.finishing_batch(uuid);
 �   ALTER TABLE ONLY slider.die_casting_production DROP CONSTRAINT die_casting_production_finishing_batch_uuid_finishing_batch_uui;
       slider          postgres    false    324    273    4200            �           2606    44399 6   die_casting die_casting_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_puller_type_properties_uuid_fk;
       slider          postgres    false    4030    272    236            �           2606    44404 <   die_casting die_casting_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 f   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk;
       slider          postgres    false    4030    272    236            �           2606    44409 6   die_casting die_casting_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 `   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_slider_link_properties_uuid_fk;
       slider          postgres    false    236    272    4030            �           2606    44414 ]   die_casting_to_assembly_stock die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc;
       slider          postgres    false    274    4104    270            �           2606    44419 T   die_casting_to_assembly_stock die_casting_to_assembly_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_to_assembly_stock DROP CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk;
       slider          postgres    false    230    274    4008            �           2606    44424 H   die_casting_transaction die_casting_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_created_by_users_uuid_fk;
       slider          postgres    false    4008    275    230            �           2606    44429 T   die_casting_transaction die_casting_transaction_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 ~   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    275    272            �           2606    44434 H   die_casting_transaction die_casting_transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 r   ALTER TABLE ONLY slider.die_casting_transaction DROP CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    4032    275    237            �           2606    44439 8   die_casting die_casting_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 b   ALTER TABLE ONLY slider.die_casting DROP CONSTRAINT die_casting_zipper_number_properties_uuid_fk;
       slider          postgres    false    4030    272    236            �           2606    44444 .   production production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_created_by_users_uuid_fk;
       slider          postgres    false    4008    276    230            �           2606    44449 .   production production_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 X   ALTER TABLE ONLY slider.production DROP CONSTRAINT production_stock_uuid_stock_uuid_fk;
       slider          postgres    false    4032    276    237            �           2606    45888 8   stock stock_finishing_batch_uuid_finishing_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_finishing_batch_uuid_finishing_batch_uuid_fk FOREIGN KEY (finishing_batch_uuid) REFERENCES zipper.finishing_batch(uuid);
 b   ALTER TABLE ONLY slider.stock DROP CONSTRAINT stock_finishing_batch_uuid_finishing_batch_uuid_fk;
       slider          postgres    false    4200    324    237            �           2606    44459 B   transaction transaction_assembly_stock_uuid_assembly_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);
 l   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk;
       slider          postgres    false    4104    277    270            �           2606    44464 0   transaction transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_created_by_users_uuid_fk;
       slider          postgres    false    277    4008    230            �           2606    46375 K   transaction transaction_finishing_batch_entry_uuid_finishing_batch_entry_uu    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_finishing_batch_entry_uuid_finishing_batch_entry_uu FOREIGN KEY (finishing_batch_entry_uuid) REFERENCES zipper.finishing_batch_entry(uuid);
 u   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_finishing_batch_entry_uuid_finishing_batch_entry_uu;
       slider          postgres    false    325    4202    277            �           2606    44469 0   transaction transaction_stock_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);
 Z   ALTER TABLE ONLY slider.transaction DROP CONSTRAINT transaction_stock_uuid_stock_uuid_fk;
       slider          postgres    false    277    4032    237            �           2606    44474 <   trx_against_stock trx_against_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_created_by_users_uuid_fk;
       slider          postgres    false    230    278    4008            �           2606    44479 H   trx_against_stock trx_against_stock_die_casting_uuid_die_casting_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);
 r   ALTER TABLE ONLY slider.trx_against_stock DROP CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk;
       slider          postgres    false    4108    278    272            �           2606    44484 +   batch batch_coning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_coning_created_by_users_uuid_fk FOREIGN KEY (coning_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_coning_created_by_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44489 $   batch batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 N   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_created_by_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44494 +   batch batch_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_created_by_users_uuid_fk FOREIGN KEY (dyeing_created_by) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_created_by_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44499 )   batch batch_dyeing_operator_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_operator_users_uuid_fk FOREIGN KEY (dyeing_operator) REFERENCES hr.users(uuid);
 S   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_operator_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44504 +   batch batch_dyeing_supervisor_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_supervisor_users_uuid_fk FOREIGN KEY (dyeing_supervisor) REFERENCES hr.users(uuid);
 U   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_dyeing_supervisor_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44509 0   batch_entry batch_entry_batch_uuid_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES thread.batch(uuid);
 Z   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk;
       thread          postgres    false    280    281    4122                        2606    44514 <   batch_entry batch_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 f   ALTER TABLE ONLY thread.batch_entry DROP CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    281    4138    289                       2606    44519 R   batch_entry_production batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 |   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    281    282    4124                       2606    44524 F   batch_entry_production batch_entry_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 p   ALTER TABLE ONLY thread.batch_entry_production DROP CONSTRAINT batch_entry_production_created_by_users_uuid_fk;
       thread          postgres    false    4008    282    230                       2606    44529 D   batch_entry_trx batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);
 n   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk;
       thread          postgres    false    4124    283    281                       2606    44534 8   batch_entry_trx batch_entry_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY thread.batch_entry_trx DROP CONSTRAINT batch_entry_trx_created_by_users_uuid_fk;
       thread          postgres    false    4008    283    230            �           2606    44539 (   batch batch_lab_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_lab_created_by_users_uuid_fk FOREIGN KEY (lab_created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_lab_created_by_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44544 (   batch batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 R   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_machine_uuid_machine_uuid_fk;
       thread          postgres    false    4092    280    264            �           2606    44549 !   batch batch_pass_by_users_uuid_fk    FK CONSTRAINT     ~   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pass_by_users_uuid_fk FOREIGN KEY (pass_by) REFERENCES hr.users(uuid);
 K   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_pass_by_users_uuid_fk;
       thread          postgres    false    4008    280    230            �           2606    44554 /   batch batch_yarn_issue_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk FOREIGN KEY (yarn_issue_created_by) REFERENCES hr.users(uuid);
 Y   ALTER TABLE ONLY thread.batch DROP CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk;
       thread          postgres    false    230    4008    280                       2606    44564 (   challan challan_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 R   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_created_by_users_uuid_fk;
       thread          postgres    false    285    230    4008                       2606    44569 8   challan_entry challan_entry_challan_uuid_challan_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES thread.challan(uuid);
 b   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk;
       thread          postgres    false    4130    285    286            	           2606    44574 4   challan_entry challan_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_created_by_users_uuid_fk;
       thread          postgres    false    286    4008    230            
           2606    44579 @   challan_entry challan_entry_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);
 j   ALTER TABLE ONLY thread.challan_entry DROP CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk;
       thread          postgres    false    289    286    4138                       2606    44584 2   challan challan_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 \   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    4140    285    291                       2606    45453 ,   challan challan_vehicle_uuid_vehicle_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_vehicle_uuid_vehicle_uuid_fk FOREIGN KEY (vehicle_uuid) REFERENCES delivery.vehicle(uuid);
 V   ALTER TABLE ONLY thread.challan DROP CONSTRAINT challan_vehicle_uuid_vehicle_uuid_fk;
       thread          postgres    false    285    4184    315                       2606    44589 2   count_length count_length_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY thread.count_length DROP CONSTRAINT count_length_created_by_users_uuid_fk;
       thread          postgres    false    4008    287    230                       2606    44594 4   dyes_category dyes_category_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 ^   ALTER TABLE ONLY thread.dyes_category DROP CONSTRAINT dyes_category_created_by_users_uuid_fk;
       thread          postgres    false    4008    288    230                       2606    44599 >   order_entry order_entry_count_length_uuid_count_length_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk FOREIGN KEY (count_length_uuid) REFERENCES thread.count_length(uuid);
 h   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk;
       thread          postgres    false    4134    287    289                       2606    44604 0   order_entry order_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 Z   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_created_by_users_uuid_fk;
       thread          postgres    false    289    4008    230                       2606    44609 :   order_entry order_entry_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);
 d   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk;
       thread          postgres    false    289    4140    291                       2606    44614 2   order_entry order_entry_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 \   ALTER TABLE ONLY thread.order_entry DROP CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk;
       thread          postgres    false    251    4064    289                       2606    44619 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       thread          postgres    false    291    231    4012                       2606    44624 .   order_info order_info_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_created_by_users_uuid_fk;
       thread          postgres    false    291    230    4008                       2606    44629 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       thread          postgres    false    291    232    4016                       2606    44634 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       thread          postgres    false    233    4020    291                       2606    44639 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       thread          postgres    false    4024    234    291                       2606    44644 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY thread.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       thread          postgres    false    4028    235    291                       2606    44649 *   programs programs_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_created_by_users_uuid_fk;
       thread          postgres    false    4008    230    292                       2606    44654 :   programs programs_dyes_category_uuid_dyes_category_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk FOREIGN KEY (dyes_category_uuid) REFERENCES thread.dyes_category(uuid);
 d   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk;
       thread          postgres    false    4136    288    292                       2606    44659 ,   programs programs_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 V   ALTER TABLE ONLY thread.programs DROP CONSTRAINT programs_material_uuid_info_uuid_fk;
       thread          postgres    false    257    292    4074                        2606    44694 D   dyed_tape_transaction dyed_tape_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 n   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    230    4008    297            #           2606    44699 Z   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk;
       zipper          postgres    false    298    4008    230            $           2606    44704 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_order_description_uuid_order_d    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d;
       zipper          postgres    false    4034    238    298            %           2606    45933 V   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    4040    298    242            &           2606    44709 `   dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_ FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 �   ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock DROP CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_;
       zipper          postgres    false    4044    298    243            !           2606    44714 U   dyed_tape_transaction dyed_tape_transaction_order_description_uuid_order_description_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
    ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_;
       zipper          postgres    false    297    4034    238            "           2606    45928 @   dyed_tape_transaction dyed_tape_transaction_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 j   ALTER TABLE ONLY zipper.dyed_tape_transaction DROP CONSTRAINT dyed_tape_transaction_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    242    4040    297                       2606    45903 2   dyeing_batch dyeing_batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyeing_batch
    ADD CONSTRAINT dyeing_batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 \   ALTER TABLE ONLY zipper.dyeing_batch DROP CONSTRAINT dyeing_batch_created_by_users_uuid_fk;
       zipper          postgres    false    4008    293    230                       2606    45908 L   dyeing_batch_entry dyeing_batch_entry_dyeing_batch_uuid_dyeing_batch_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyeing_batch_entry
    ADD CONSTRAINT dyeing_batch_entry_dyeing_batch_uuid_dyeing_batch_uuid_fk FOREIGN KEY (dyeing_batch_uuid) REFERENCES zipper.dyeing_batch(uuid);
 v   ALTER TABLE ONLY zipper.dyeing_batch_entry DROP CONSTRAINT dyeing_batch_entry_dyeing_batch_uuid_dyeing_batch_uuid_fk;
       zipper          postgres    false    293    294    4144                       2606    45913 :   dyeing_batch_entry dyeing_batch_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyeing_batch_entry
    ADD CONSTRAINT dyeing_batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 d   ALTER TABLE ONLY zipper.dyeing_batch_entry DROP CONSTRAINT dyeing_batch_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    4040    294    242                       2606    45898 6   dyeing_batch dyeing_batch_machine_uuid_machine_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyeing_batch
    ADD CONSTRAINT dyeing_batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);
 `   ALTER TABLE ONLY zipper.dyeing_batch DROP CONSTRAINT dyeing_batch_machine_uuid_machine_uuid_fk;
       zipper          postgres    false    264    4092    293                       2606    45923 H   dyeing_batch_production dyeing_batch_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyeing_batch_production
    ADD CONSTRAINT dyeing_batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 r   ALTER TABLE ONLY zipper.dyeing_batch_production DROP CONSTRAINT dyeing_batch_production_created_by_users_uuid_fk;
       zipper          postgres    false    296    230    4008                       2606    45918 W   dyeing_batch_production dyeing_batch_production_dyeing_batch_entry_uuid_dyeing_batch_en    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.dyeing_batch_production
    ADD CONSTRAINT dyeing_batch_production_dyeing_batch_entry_uuid_dyeing_batch_en FOREIGN KEY (dyeing_batch_entry_uuid) REFERENCES zipper.dyeing_batch_entry(uuid);
 �   ALTER TABLE ONLY zipper.dyeing_batch_production DROP CONSTRAINT dyeing_batch_production_dyeing_batch_entry_uuid_dyeing_batch_en;
       zipper          postgres    false    294    296    4146            _           2606    45843 8   finishing_batch finishing_batch_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch
    ADD CONSTRAINT finishing_batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 b   ALTER TABLE ONLY zipper.finishing_batch DROP CONSTRAINT finishing_batch_created_by_users_uuid_fk;
       zipper          postgres    false    324    230    4008            a           2606    45858 D   finishing_batch_entry finishing_batch_entry_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_entry
    ADD CONSTRAINT finishing_batch_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 n   ALTER TABLE ONLY zipper.finishing_batch_entry DROP CONSTRAINT finishing_batch_entry_created_by_users_uuid_fk;
       zipper          postgres    false    4008    230    325            b           2606    45848 U   finishing_batch_entry finishing_batch_entry_finishing_batch_uuid_finishing_batch_uuid    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_entry
    ADD CONSTRAINT finishing_batch_entry_finishing_batch_uuid_finishing_batch_uuid FOREIGN KEY (finishing_batch_uuid) REFERENCES zipper.finishing_batch(uuid);
    ALTER TABLE ONLY zipper.finishing_batch_entry DROP CONSTRAINT finishing_batch_entry_finishing_batch_uuid_finishing_batch_uuid;
       zipper          postgres    false    325    324    4200            c           2606    45853 @   finishing_batch_entry finishing_batch_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_entry
    ADD CONSTRAINT finishing_batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 j   ALTER TABLE ONLY zipper.finishing_batch_entry DROP CONSTRAINT finishing_batch_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    325    242    4040            `           2606    45838 O   finishing_batch finishing_batch_order_description_uuid_order_description_uuid_f    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch
    ADD CONSTRAINT finishing_batch_order_description_uuid_order_description_uuid_f FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 y   ALTER TABLE ONLY zipper.finishing_batch DROP CONSTRAINT finishing_batch_order_description_uuid_order_description_uuid_f;
       zipper          postgres    false    324    4034    238            .           2606    45948 N   finishing_batch_production finishing_batch_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_production
    ADD CONSTRAINT finishing_batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 x   ALTER TABLE ONLY zipper.finishing_batch_production DROP CONSTRAINT finishing_batch_production_created_by_users_uuid_fk;
       zipper          postgres    false    230    302    4008            /           2606    45943 Z   finishing_batch_production finishing_batch_production_finishing_batch_entry_uuid_finishing    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_production
    ADD CONSTRAINT finishing_batch_production_finishing_batch_entry_uuid_finishing FOREIGN KEY (finishing_batch_entry_uuid) REFERENCES zipper.finishing_batch_entry(uuid);
 �   ALTER TABLE ONLY zipper.finishing_batch_production DROP CONSTRAINT finishing_batch_production_finishing_batch_entry_uuid_finishing;
       zipper          postgres    false    302    325    4202            0           2606    45958 P   finishing_batch_transaction finishing_batch_transaction_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_transaction
    ADD CONSTRAINT finishing_batch_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 z   ALTER TABLE ONLY zipper.finishing_batch_transaction DROP CONSTRAINT finishing_batch_transaction_created_by_users_uuid_fk;
       zipper          postgres    false    4008    230    303            1           2606    45953 V   finishing_batch_transaction finishing_batch_transaction_slider_item_uuid_stock_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.finishing_batch_transaction
    ADD CONSTRAINT finishing_batch_transaction_slider_item_uuid_stock_uuid_fk FOREIGN KEY (slider_item_uuid) REFERENCES slider.stock(uuid);
 �   ALTER TABLE ONLY zipper.finishing_batch_transaction DROP CONSTRAINT finishing_batch_transaction_slider_item_uuid_stock_uuid_fk;
       zipper          postgres    false    237    4032    303            '           2606    45938 f   material_trx_against_order_description material_trx_against_order_description_booking_uuid_booking_uui    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_booking_uuid_booking_uui FOREIGN KEY (booking_uuid) REFERENCES material.booking(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_booking_uuid_booking_uui;
       zipper          postgres    false    318    299    4188            (           2606    44729 f   material_trx_against_order_description material_trx_against_order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk;
       zipper          postgres    false    299    230    4008            )           2606    44734 f   material_trx_against_order_description material_trx_against_order_description_material_uuid_info_uuid_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_ FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_;
       zipper          postgres    false    299    257    4074            *           2606    44739 f   material_trx_against_order_description material_trx_against_order_description_order_description_uuid_o    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_order_description_uuid_o FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.material_trx_against_order_description DROP CONSTRAINT material_trx_against_order_description_order_description_uuid_o;
       zipper          postgres    false    299    4034    238            @           2606    45088 B   multi_color_dashboard multi_color_dashboard_coil_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.multi_color_dashboard
    ADD CONSTRAINT multi_color_dashboard_coil_uuid_info_uuid_fk FOREIGN KEY (coil_uuid) REFERENCES material.info(uuid);
 l   ALTER TABLE ONLY zipper.multi_color_dashboard DROP CONSTRAINT multi_color_dashboard_coil_uuid_info_uuid_fk;
       zipper          postgres    false    257    4074    308            A           2606    45083 U   multi_color_dashboard multi_color_dashboard_order_description_uuid_order_description_    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.multi_color_dashboard
    ADD CONSTRAINT multi_color_dashboard_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
    ALTER TABLE ONLY zipper.multi_color_dashboard DROP CONSTRAINT multi_color_dashboard_order_description_uuid_order_description_;
       zipper          postgres    false    4034    308    238            B           2606    46296 D   multi_color_dashboard multi_color_dashboard_thread_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.multi_color_dashboard
    ADD CONSTRAINT multi_color_dashboard_thread_uuid_info_uuid_fk FOREIGN KEY (thread_uuid) REFERENCES material.info(uuid);
 n   ALTER TABLE ONLY zipper.multi_color_dashboard DROP CONSTRAINT multi_color_dashboard_thread_uuid_info_uuid_fk;
       zipper          postgres    false    257    308    4074            C           2606    45098 J   multi_color_tape_receive multi_color_tape_receive_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.multi_color_tape_receive
    ADD CONSTRAINT multi_color_tape_receive_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 t   ALTER TABLE ONLY zipper.multi_color_tape_receive DROP CONSTRAINT multi_color_tape_receive_created_by_users_uuid_fk;
       zipper          postgres    false    230    309    4008            D           2606    45093 X   multi_color_tape_receive multi_color_tape_receive_order_description_uuid_order_descripti    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.multi_color_tape_receive
    ADD CONSTRAINT multi_color_tape_receive_order_description_uuid_order_descripti FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 �   ALTER TABLE ONLY zipper.multi_color_tape_receive DROP CONSTRAINT multi_color_tape_receive_order_description_uuid_order_descripti;
       zipper          postgres    false    309    4034    238            �           2606    44744 E   order_description order_description_bottom_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_bottom_stopper_properties_uuid_fk FOREIGN KEY (bottom_stopper) REFERENCES public.properties(uuid);
 o   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_bottom_stopper_properties_uuid_fk;
       zipper          postgres    false    236    238    4030            �           2606    44749 D   order_description order_description_coloring_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_coloring_type_properties_uuid_fk FOREIGN KEY (coloring_type) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_coloring_type_properties_uuid_fk;
       zipper          postgres    false    236    238    4030            �           2606    44754 <   order_description order_description_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 f   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_created_by_users_uuid_fk;
       zipper          postgres    false    4008    230    238            �           2606    44759 ?   order_description order_description_end_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_type_properties_uuid_fk;
       zipper          postgres    false    236    238    4030            �           2606    44764 ?   order_description order_description_end_user_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_user_properties_uuid_fk FOREIGN KEY (end_user) REFERENCES public.properties(uuid);
 i   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_end_user_properties_uuid_fk;
       zipper          postgres    false    236    4030    238            �           2606    44769 ;   order_description order_description_hand_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_hand_properties_uuid_fk FOREIGN KEY (hand) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_hand_properties_uuid_fk;
       zipper          postgres    false    238    236    4030            �           2606    44774 ;   order_description order_description_item_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);
 e   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_item_properties_uuid_fk;
       zipper          postgres    false    4030    236    238            �           2606    44779 G   order_description order_description_light_preference_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_light_preference_properties_uuid_fk FOREIGN KEY (light_preference) REFERENCES public.properties(uuid);
 q   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_light_preference_properties_uuid_fk;
       zipper          postgres    false    4030    238    236            �           2606    44784 @   order_description order_description_lock_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_lock_type_properties_uuid_fk FOREIGN KEY (lock_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_lock_type_properties_uuid_fk;
       zipper          postgres    false    236    238    4030            �           2606    44789 @   order_description order_description_logo_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);
 j   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_logo_type_properties_uuid_fk;
       zipper          postgres    false    238    236    4030            �           2606    44794 D   order_description order_description_nylon_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_nylon_stopper_properties_uuid_fk;
       zipper          postgres    false    238    4030    236            �           2606    44799 F   order_description order_description_order_info_uuid_order_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);
 p   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk;
       zipper          postgres    false    241    4038    238            �           2606    44804 C   order_description order_description_puller_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_color_properties_uuid_fk FOREIGN KEY (puller_color) REFERENCES public.properties(uuid);
 m   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_color_properties_uuid_fk;
       zipper          postgres    false    238    4030    236            �           2606    44809 B   order_description order_description_puller_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_puller_type_properties_uuid_fk;
       zipper          postgres    false    238    4030    236            �           2606    44814 H   order_description order_description_slider_body_shape_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);
 r   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_body_shape_properties_uuid_fk;
       zipper          postgres    false    236    4030    238            �           2606    44819 B   order_description order_description_slider_link_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_link_properties_uuid_fk;
       zipper          postgres    false    236    4030    238            �           2606    44824 =   order_description order_description_slider_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_properties_uuid_fk FOREIGN KEY (slider) REFERENCES public.properties(uuid);
 g   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_slider_properties_uuid_fk;
       zipper          postgres    false    236    4030    238            �           2606    44829 D   order_description order_description_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    243    238    4044            �           2606    44834 B   order_description order_description_teeth_color_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_color_properties_uuid_fk FOREIGN KEY (teeth_color) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_color_properties_uuid_fk;
       zipper          postgres    false    4030    236    238            �           2606    44839 A   order_description order_description_teeth_type_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_type_properties_uuid_fk FOREIGN KEY (teeth_type) REFERENCES public.properties(uuid);
 k   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_teeth_type_properties_uuid_fk;
       zipper          postgres    false    238    236    4030            �           2606    44844 B   order_description order_description_top_stopper_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_top_stopper_properties_uuid_fk FOREIGN KEY (top_stopper) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_top_stopper_properties_uuid_fk;
       zipper          postgres    false    236    238    4030            �           2606    44849 D   order_description order_description_zipper_number_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);
 n   ALTER TABLE ONLY zipper.order_description DROP CONSTRAINT order_description_zipper_number_properties_uuid_fk;
       zipper          postgres    false    4030    238    236            �           2606    44854 H   order_entry order_entry_order_description_uuid_order_description_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 r   ALTER TABLE ONLY zipper.order_entry DROP CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk;
       zipper          postgres    false    4034    238    239            �           2606    44859 .   order_info order_info_buyer_uuid_buyer_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk;
       zipper          postgres    false    241    4012    231            �           2606    44864 2   order_info order_info_factory_uuid_factory_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);
 \   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_factory_uuid_factory_uuid_fk;
       zipper          postgres    false    241    4016    232            �           2606    44869 6   order_info order_info_marketing_uuid_marketing_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);
 `   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk;
       zipper          postgres    false    241    233    4020            �           2606    44874 <   order_info order_info_merchandiser_uuid_merchandiser_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);
 f   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk;
       zipper          postgres    false    4024    234    241            �           2606    44879 .   order_info order_info_party_uuid_party_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);
 X   ALTER TABLE ONLY zipper.order_info DROP CONSTRAINT order_info_party_uuid_party_uuid_fk;
       zipper          postgres    false    241    235    4028            +           2606    44884 *   planning planning_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.planning DROP CONSTRAINT planning_created_by_users_uuid_fk;
       zipper          postgres    false    300    230    4008            ,           2606    44889 <   planning_entry planning_entry_planning_week_planning_week_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_planning_week_planning_week_fk FOREIGN KEY (planning_week) REFERENCES zipper.planning(week);
 f   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_planning_week_planning_week_fk;
       zipper          postgres    false    4156    300    301            -           2606    44894 2   planning_entry planning_entry_sfg_uuid_sfg_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);
 \   ALTER TABLE ONLY zipper.planning_entry DROP CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk;
       zipper          postgres    false    4040    301    242            �           2606    44899 ,   sfg sfg_order_entry_uuid_order_entry_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);
 V   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk;
       zipper          postgres    false    242    4036    239            �           2606    44914 "   sfg sfg_recipe_uuid_recipe_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);
 L   ALTER TABLE ONLY zipper.sfg DROP CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk;
       zipper          postgres    false    251    242    4064            �           2606    44934 ,   tape_coil tape_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 V   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_created_by_users_uuid_fk;
       zipper          postgres    false    230    4008    243            �           2606    44939 0   tape_coil tape_coil_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 Z   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_item_uuid_properties_uuid_fk;
       zipper          postgres    false    236    4030    243            �           2606    45529 .   tape_coil tape_coil_material_uuid_info_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);
 X   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_material_uuid_info_uuid_fk;
       zipper          postgres    false    4074    243    257            2           2606    44944 B   tape_coil_production tape_coil_production_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_created_by_users_uuid_fk;
       zipper          postgres    false    4008    230    304            3           2606    44949 J   tape_coil_production tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 t   ALTER TABLE ONLY zipper.tape_coil_production DROP CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    304    243    4044            4           2606    44954 >   tape_coil_required tape_coil_required_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 h   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_created_by_users_uuid_fk;
       zipper          postgres    false    305    4008    230            5           2606    44959 F   tape_coil_required tape_coil_required_end_type_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk FOREIGN KEY (end_type_uuid) REFERENCES public.properties(uuid);
 p   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk;
       zipper          postgres    false    305    236    4030            6           2606    44964 B   tape_coil_required tape_coil_required_item_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);
 l   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk;
       zipper          postgres    false    4030    236    305            7           2606    44969 K   tape_coil_required tape_coil_required_nylon_stopper_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk FOREIGN KEY (nylon_stopper_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk;
       zipper          postgres    false    4030    236    305            8           2606    44974 K   tape_coil_required tape_coil_required_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 u   ALTER TABLE ONLY zipper.tape_coil_required DROP CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    236    305    4030            9           2606    44979 @   tape_coil_to_dyeing tape_coil_to_dyeing_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 j   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk;
       zipper          postgres    false    4008    230    306            :           2606    44984 S   tape_coil_to_dyeing tape_coil_to_dyeing_order_description_uuid_order_description_uu    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);
 }   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu;
       zipper          postgres    false    4034    306    238            ;           2606    44989 H   tape_coil_to_dyeing tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 r   ALTER TABLE ONLY zipper.tape_coil_to_dyeing DROP CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    306    4044    243            �           2606    44994 9   tape_coil tape_coil_zipper_number_uuid_properties_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);
 c   ALTER TABLE ONLY zipper.tape_coil DROP CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk;
       zipper          postgres    false    236    243    4030            <           2606    44999 .   tape_trx tape_to_coil_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 X   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_created_by_users_uuid_fk;
       zipper          postgres    false    230    307    4008            =           2606    45004 6   tape_trx tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 `   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    243    307    4044            >           2606    45009 *   tape_trx tape_trx_created_by_users_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);
 T   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_created_by_users_uuid_fk;
       zipper          postgres    false    230    307    4008            ?           2606    45014 2   tape_trx tape_trx_tape_coil_uuid_tape_coil_uuid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);
 \   ALTER TABLE ONLY zipper.tape_trx DROP CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk;
       zipper          postgres    false    243    4044    307            Y   n  x��UMo�8=˿bEOr"���A�H�Ʊ���/(h��K�JRJ�_�C�N���n��-������|o|=~e��Lg_'��82�$߁'1�����x���1�x�	o1����� V��I`«���^{����.�����!\�fe�x�]zm۱zƒ�3��̄���:�0?QP�h�CL�$�&
XqQpA˷0��KU��^b��p��(�;��x�`M!�yD3��
��9h�P���X���p��	+Z�JX�a�<�s5t�7��qΒ�H
��Ҕ���t��ƹ�m���܎u�!�f�,�0���z_��=u��c�o�j�����Û�a�E�-�.
��@�^�����[? � �)��L�rgρĕ. 낇�$�aB"�+&#����R>�c� �1+�R}�X�P�f����XV��Q%�4�����Od��eP�Q$D)$���{,�YeIV�!1�T��+����4f�F
�'�Bh^_��q���`��2���
Kn��r6� ���;A�u������3�J���/�EUƸ4^`����Q1�c9ݶm��3���8Γ��;�v���ي���e�!���������v[��x����?�O>�5VHf�����1�����E)`�������h����dp��Ġ��#`;v�<$�pc��=;�-]��=?ay�5�Ï������;��n��6�ݶ:`[�Y�q���ێ�s�h�~kʶE\v���;�[#LHr�fMa&Ѳ�������U`�DeDޢ�����~��1�a��G��eך6a��Ma�O�u�&ŶO�z��c�0,��i�t���0x���?����� ��ջ��G��Z7'�V��1�      �      x������ � �      [   �  x�}��n�0���S� K5�}g0QN�9@���4�Di��t�U�~��Z-6���|��La�r�������<<��vR����~4A�9� E��]E�"P�&뛬��L��P�':\��ouU���.�qd�z�	��/#>~�(D4����bd�h�M��t�M��} ��įZ�P}]�ƽ�JЁ(\�{%��<���<8�<���腯�"!m�kZ�l���]spw�4�M���n$Ys<��u����~��ӫ�/��B�b�R�T�D�i�;!��}�
����Y�����w�������o��osB��a:X��ܛ/�M�g�gF�}�u��/�k_�U�vbs���E��D��RtCS\� �>���U��      �   S   x����-�L4+3pK�����N�v	4v
		���tu��CAz@�idl c���+YY�XB�r��qqq ��      �   Y   x�K�05�0��4w�L2��N�v	4v
		���L-J-�4202�54�50Q00�#�?�����������%���T��+F��� ��Q      �      x������ � �      �      x������ � �      ]   I  x���[��H����D_�lPx�P�0;�Y��
��~���ozt"fc��D��Oe��/�����۝2#� ���j-:2�dN�����WВz��+�VE�z&�ռ�2�HPb�,!�-oG����يsЂL���.�@A�Ǖ�U��a @4~�'6��]�NU=I���˨� �!��?AbJ�)dn���9a�_����b�����I�>j ~�H����϶*��b#�u��=:��u��"G�Y�6�\�G�҄��[�*0[H��Ib��p�s
��gh�VAh"�1?P�S������ox�HU���Y^՞r��.�j��o����j|����"/l����`5�$f80��%6�Y��4/�����b���a���E�qO�>Eo���z�ʔ+jr Kb�2y�:�}Ӳ]��U��9;���b���2 �o���o\�Ӏ�(
m����Y AlH�oWv6$g���3�~������8����g������ ���@�`rg�5�qyyDau��+_Azl,�rT�b�Ȅ������M��R�tU�n!���sH�,֥B�5W5��3]<���,nTh�SS�am$E��:)ۢ��V�:��D��9��"���Lv�KA���	YӜh���h*���AG�z�H욋%�$�W�v��u������U��g���!�F����@�!xXƇֲ�P�T��"0z�N]J$8��/@=�Ĩ�/���i���$�_������1��a�)>���V�߲#��X)	eQ�T�����U��vq�<��Ɲ�&�+�C0��
�,���$ u��hԥ����_TS#�V&0�|��͎�a� >ř)�72�{5-/C��k�
a�.����&�W҄�09��r�����I�\��L�W0��v�L-7��w��t���L���{;{����p�4���N��V��K�P�l�D� ��5f)(�V&r����PQ����7��EX����qDC��+(�:�fm���-"@���ޝ�A\�q���PI��X�qJ��T\�G.H>4g^�����kM��z1��anx,�!]�It�0S³���v�o֓,,f�o��4���a<qͮKf���3 ߧ�1j�����=�Q.?2LN��'����d��]s���d�����w���s��4J�����xణ����2��6%�)9y`����Mxji5��S2�+�w*Ś���G�\!�.w6�O\]^� �&l�^ͪ"R�@�����g#����q�%btZ�<��<,������A�8 ��sPP��<R��s�:o�@�N�L�6�F�,lr��s'�V ybU;��'j!��i��p7��򑌁��g�e��x�Q�#׿��Iܚ��KB���U�p� �OD�O)1'�cqV7;2�3I�#��\`���w����Ks <�ىO���)��C̫���U���_d��	��M#������+y�M��$�7�׹`�e�ǿu9�p�����[n�/����v.��THz������	�K9)6W�+���b���0�pAџt��ĳ	"�t�[������Vѡldף�w���:~�~��["��w�a�K����-k��+ ߝIA���� +��"�a;dtk0��P���ݯ�Zqvi�g��k��NB�K2�/��^�]��L��K}�[B���х`7G��3���P��=Nt�Gk�4\uMn��5x���/�5靸m����0��%�6�q���bBaX�b�.~��W��swv�Bg���.���R�d=��Uѣ7F�fRp�a������_�^��S�KX���������JR��
�%�◿�|yy��b�      ^      x���ٲ�J� �k����6�!��$fX�0����oE�]]��,�OX\�m��-�r�������c��7��G�A�8�˘4ܚ��2}�?,���t#��}��������c�0�L�������W��$-�ϿE �jk�x�6I
R47��,Ԕ~zh��Y�X���gv�Uٱ�`�(���Y���;���P�X5�_��K�rCP�
�L�/s��(_v�}"\���am�/�#ح��Q�X�@���XTb�6���C��Hn0���h�)�|��)u��X���k�yc<��`�J��ʊ�'�"�*�4��=�>�\�!W��*Yo��G�������
�I�T�T���ĒW�K~ࢌpI#�N6 ����5����|@7®d�eH��i��)= jR������DN�}n(�_aYz�h#��q�����j8��<7�4����b��`N+�6-_��mڰߨ�-���aGX�d�Ў}���5��Q%Ԉ'�o��X)T��*�.�7� ��"4߹��]<o8z��A��L@��4,]UB;*��[A�8��`�R������q.+��? ���zZԑ��p���֤���@��;���H�cv���o��u|����d�:�%�\�N�74I_��
�qq���$x49��Y�#I��Q�K;�y���-Tљ0C�v�%រQd1�"���ԕ��N��΢���1F�����z�Cyoŀ��-�ʫ0�I�����u�9�
��. ՠ.��W�OH��q"����^n{�1f���Z`�b=��Y��y�ݏ��n�>W�j��Z^,��||�M��`k���Kok��̵g��
�����XxU*�wԲ������Yr�H�Y�V��dS��Y���EV�����&u!Nm���������nB�M�X��Ft��P��� ����8x�[ٓi6a�E>5)DK%a�.����7��������QL��w_T��u��6�LL�߈+��,�,�Rw	� �9<��'�g}��n	]PFV>h�"���:P]���7�l�w��Tb����T.(��״#���^l=}����[�b[���$z�9�����Ck���[a�\���q
m�<[���$��*_Q\���]����a�	���`
r�k�?�;���Ol��0�r�W?,��z��X2�R���wpl�$/Luwv|}n4}���g��Lգ�| �s�m�%YB���+}��{Ql��
gg@m��h�pݞ�"���p�D���5�s1��굟���>rs�Ůd��5"�TI�o� ��I]h$�M��.��� P��]	��]�p�n,B�Lak҄���90=�y�<�h@�X\�;ePPW�������G��V��g��
XV�J�T�Z�7���W��]�J��'~�O�9�仯���֋%�$�0P��n)ςuP5�I7e�KJ�,����Z��N3�4�
F�� Ի��r�5M8�{rq!X���&hIn��^`�&�D"/

���^�LZ���陲!}+�O�m�A�����m���E�p�v=ĵ��������ͨ���o��%2����aվN��E{��� j��Vpz>�H %(߳���i��|^j�s�DS>�yI�L �)W�n
/���FW/�n�HCD>�ֹ.��~���V$�ʾ���һ ;�������Χ����S����~_:��؂�9@�և��QT�ytN{��?�y�z�m�q�]0يL^����$�ֵ�>���+q3<�98��$�W��˞�����������w�e��+�r�#�赆Z���W� ���i��R��ʉK�8�O�ؖ\˟=`���ϋ{���??����L�h3�x�b(�Z�ょIᓖH^C�8P�6)�����eq�A)"�Eq\��^O�oO�_l����Q����_'�ZCe�>�i�z��|L)M�9ϥy3�[�D�ЭJ��:�!�MT���������K�^��^��S��yL��1�(y�n�Y��L�f�=����njJ�b�+٦���ۺ���!���Pe��w������?`��B���:3xDȨ.y��x�^B4ݏ��������O�(jN�������Z�v}'��2ƌw�����cd��`1�| j��Q��
��	��E�����������z�f��YJ���7WT�NbѷOS�T�{~�-W��ց�^lk-cO�S�bmq�������B������U�'�,YN�t�ʽxʆ�*�
����k�N�^ڳ� @��A�r��;mG���H.8�%�Z"#D���,-X��.����u�K�TyR�ߦ稃v>kB�E�zyK\M�,3%�������Gw?��<)F��K��=��0i���Dԗ��qj�;���V�7"�*<"kT��x!�3��vQ��N��{_��~Է�v����+�J�9}]��\����v}#���o���� �}C!����3G�!wm.6" /.��sk�����`����0�RD��&����� �ƞڬ��	��a������w�#�n��8�Eϟp������uC��vt-L���v���68�0��1�/:��oa���߇y�!!��5837�8P�.*By}����"�VcP	!j^y(	f-P���:�]e�Ia+k��,�^AW[��i��+�4M������	��kZg��ٱ����G�sr�7^x.��f��_����>��p�a�`������x_2-�WaE�(��4��FdR�H�Y�/�{Z����~.i�&eZ�q�Z�����$c�W���L$� �`��a�W�ẗ�xٍ�g-h*��~��ǰ��n`g���KfI�iR0Z�\T^�9l�=7��/=b\2�X��إe+�������)7���t�L9�96��)ig{0Y�N�90Eaw�&�x�J�Ϭ� s5�$�Rw�F+��K�"Y[��i���I���v�;}��[��Kf뱮�N?�#v��`��/F{�R���k��C� ���/�����e��� w+�Z�4������d�c0G;�f1��P	�Zwm|��
3����1�i��͈voO0$��K�N�q�/�]#A�)��^�R�Y���"���ۏ�7=��>`�a���~���LR���}8�T9R���=,p�糖�/���*���MĘ}4Ta��P���=x
¨���h��d�M�;1b�6�/O��N-aQ�N>@�;z�~ڊ���HeQz�̶�i�jFTŌ].��8$���B��L�� ��G�����v��\h��ֱ_�'�4����9Co���%���ȈYB4l�\��M(T�z`	��W��F���n�ɀ��2C��0����b�^�m�Jp�L��D�Y���cٵv>Σ%4��|I�]�F�<C�ݠ���y�M����g���~7t?�e�*��{n�ן!�/���&磤

�։�5�h��%_D��8x�'�V�$�,<�d��8r�,�3+��~xC��f�Z�Um��s���t��^p�$�ħ��m�oVZ��s�=�Q��0��!�|�r��D�`�#� 6̲|��7��i�7��{	?�Iy�ƄF˙�<��Lt�ͦZ�^�>.���M���K��l:�މD����V����)�U�ܙ�LuRV`����^*�j�*u�U��z�B��҆�,�*�K�*w ��T�*{���	����=v]���0^X�I�W���NK�FQ4�I,�v���d��`.�X�MMAPU����S���.�����r��(��]2dx�B`�j��e�z�_����r��>�-�p��s��Z9��=��X�5|�{�HY�p�l'H\G|�B�jNW���o?s�&�+�~3w���e��|����k�������_l��fJ�����b�.=E��ȡ"~T	�ߩ��$/!������kP<����)4�f[��E���0�r'T�/��	��k��v5T��"�S;�ԛ{���w�C�Z�+����s�� @m+r(˦�H�l�_>×����r���I�������m��p�$�s9�)L�x��fZI��@����N    �G�)�p�yӑ�������	ٌZ ���j����̊��"B�pN�fg5��!�6z&��/#X�7Sf���3���4�"���MD��&.���dh	������!���:C�C��M3�o�� �i�����sE�]T��'(����+��7��T`T����Ǻ����|Wl���ހ�.�y�$d#����K`�<n�r�%| U�\�ۭ❑��o؟{�U���3��Ќ��z�-�C�:ڳ��憣�5�����?���Ti��]Seb��}c���v�4��-<�):Pz���00�Sy1�U��η�IVb�sa3�)]�
#�]T���hӪ�F(G|�$R��z�h�5�[o���C�/��A��?/+#�?������!����[7Փ7ܩ ն��1�ʎ�L�7����~R�vh����M:۪�g�!6�3+��0�	?ވ#{p�@�z��_�eP�iT�����*����1�	]z�C*D;f�~ΆK	o�g�I5�Nv���o� Ps�r���l��z��=d!�:�f�d��B�a��V���^-�f��4�[y~�������H����_8��*ܼ��V@�c�n�j���"�&�q#Z7���>�m�[��UQ@M����{�*���n���/F���s.�oR	��Bʾ��
�y���}�>��{̽�� �H��{�������P���GG3���1Y3 l��(�*;1�ru�������&�����>>�T��֓uǩrl��YٻvAu�Ο7*4'�m��F3�ӯwˍ�.�-.��tG�EJ��������>���vid-��9oT�)@GcRN�cG�Z�����0&:�>��v�<�VA�a�吮����ơ[d�w�Lg����BAe(_��������FE���P+�����3�K���.��I������o��P�}�tI��T���RSɟ�[~�@�2�~J�����R�υ����/+��|,���cl3�GLǃ,��a#��Hu���� ��6���N�v��(�ߏr_�@�v��m���m j>Zr��c
�/��������aB�����w*O<N2M'�p�z�ÊW����l��(��3����ڬZ3�޻�ç�tp��Ɲ}D�	�b�I�Z�V6�4]a�8�U�C��B���!��T%��G"лN�/ -�w��u��+���8���s��}iG���R�@� Q�i�JյYe����N{䉡����â�{>և1�e]C_!�-�+/��@�9_�x!�+���F�W�t����k,Z���.���.KҺ�i^�}�f �ɺ���*I ԙ��W{��t�O-WP,��W�>��k
)���,b^�:�Z��:6G4�O���!E/P�k��=��
5&a�.T����
�l�4�m�Ε�}s��T~H���V~A�W��Z,������f�]C��Nj�Q�s�**��X��.�x@��M�keR��t��pu� ����I>�.�#���k����Mu����A ���9���RA̵��X�Oa:�@�{m�hC|�s��	�=\�}x�nzH+��*�mpF����l$�F���5���hN�Y}��"�7����~�W��ݦ�-��+Q�I����[!��Fp������G��L���ɠ�*#��*��`�E���tw)�u�3����g8����%/���&Ӑ;�8j�,�Q ���mauls��U�]T�c�E�����{����C+pF�U��MϓhI�+�"~�z9��w.d�;�1/��<l�V��r
��,�`���=h��.�f�D�v�s�4�c k���A�,A��\T�h�F'F�c�Tq���{��;Ƽܾ�:�keB�tN�<�P�����vzX�+e�E�s�T9 ���!#Y��5���a�߆�Ã�?g �d�y���@3�Q���ӗ5uK]T{c,�F>Hd�l+T,��ǔv2Yb�\U�S��\qW��
P�$ �~�ћUѫ� wy*�kT�ci@�w�T_��.H�x��Gu��Ԃ��?��{+I(9��g��^<��e\���!���	���O�:.�k���b����*�|6�E���B�>����΋�W1��)����d`}u�'����s3��ʦ��H4O�5R4�����2>T�nMW3�垞֕�8�����H�&ЩQs���E�}Na忒b���3�ec>[E���)].��hwTtض�N^ �Q}�΄���'�T���`�-�>��)�u1��x����Ql���[�$ 8����H��b;�qǫU��F���&v�CB�'|I�}&�E����V��|FZ� �f-���@L&9Ӌ���uf����쀪*�`H��;�㤋�Z�>#�tԍ|gQ�:.��A^W�W׭��O��aJ�Y�e�q|{�?ww���%�\�Fg��(��5"��6�7V��*ׄ��b���,�nq��Io������8�:�/�`o�KAK�I��~\ݻX�N���̓�7�-���zX����߰���^	^gKR��La~�뷋�°_�?]�'�݅���a�0�p��·Ȫ�[�|�ٍ"�?o���J�����N;qho��괅b|Ҽp���}��RiM	Wp����l�"�<s���#��7�[߯������R-��
��x��)	c�FP^�Im�2@Ç�w�>F@�K�.;̇&��o�+�.���3�",�R�Z�n[�Qό��bo�S�+�By���E���.�Ʊ����N��i�^�$�c���T,o�mb���\0�dZ�����r
�"lR��22z����vO�ⳊbӬ�6i/(�ޟ2j��-<eREg-��a7���ԍ¿of!�/쟾�v�f}O+�+��T:�[�;�Kd�>��F�yK�GuŜ

��qV�������|0�;^a���?�\��~%�OL�s[��)�ζ���@{�gS;�zT�g[�����E�oğ��Q�A�K�Ӝq<����!��Ә~��w���F��;��}|wȏ8<��t�CUk�ô�qC���?����x��]�Ky����$}Lω�o���@!H�yxV$cz�2��d�'=A죐*���"Β�rSO5�23�/
�7SǛu5�#��@��k{���N�~L��k���D�G^�d�BZ\낉�Ge!.���پ.����6��O�NZP�����4ӹ�C#�]PA�~�J�L��<�b��:;�]�n�����Q%G�ژGS*74p"���w�+�)�|�������e�ѓ!Tj�O�d?5�:6�{���|;ˏl�n��pD�tX]� ;�X�޷��>�/6v��I�aA��*�oO�hr*��%�������\�HO@�Ȯ?Ȼ��]���)P��"�X�<�C`O%�9#͎%��Ҿ������%��PB2�y�pi�UY~��^,݊�(�E��*w[ T���C�v����\Tg�W�~.&��D
PcGoK�4h�@��tu�چz4d�	���=Ό�?��
c6�ť��nxm�aPv�À�ww��_g�c:W��'u��ڃ���2�JW��>^lk���1��7��A g3�RΨN�DW���"�6��С���}x��dD�4L���hx	V{`Yn�SH�5�,������"]]f"A��`�z���(�K���㬰�玽�.��#�ib��Pz�o}����*��bvq�%�W2���J%���Ogf����p����b'tUn���+����"�j��d���3���h�i<���:li܌��`V�>.����Հ�-�ns�,>a)�H��D�'6��A�%L��0�a��Y�Au�ru"d/hI�DK�ZI	,\�y�m��o��K�ErK����m��x�tHL�[Sx1W'�g��h����ݖ�É��0��k���x���Q#Mw��`
\r/61�ç�齫{.!7�������\��2� T5�\]j�Z>���7G�j�`k�y�d�]����%����È�H�a��x�!����Q{C�?_�#�c��=��T�@���ga�Z��;t冐|�=g�8�7pvj [��Ԉ%�Z�����b���`�Z�	�   ������*ja_m�ԓ�]�ӣq�Rs�Oz��a��نp��5��b�B�u_�,��uڮ4h�������K���WG5��b����+h���S����������#۶�Y�?�C�*`j�q4$��*Ք1��x�Q�r;�RL~'Ip��hY09v�tQM7W�iJ>P�F(��qe�)��}:��ٵ"#��w�/6Y0������y����>~���3~BKT:�5�A�A��i�C c=^"W�̙m�;���� ��	q�y��!��s�To�C�GC}>�N�%��$~(���U�Pz�>ׇ@�>NU��_�C;��8��K�Ja��<$�
n��6�!�Fv�k��j˞�Im*�ɏ�@�-�F�G_�6�{�Z\��gK��B��POtiP�$�g�������zXl0�kS��)J��B������I[:S�.&�OR"M��Pt�/F�'�������>wW+�Zik��ý��I�k��"�z��/����=C�9�	�&��<�+���(S��k,�nc�{�CJ���H�fV|/J�Ojw�t:�a�����>QO�e��N��+0���d�a�P�vI]]O,KP�\���S]c�+Q���D{yI���d�ћ�l�!��u�����e�y`�]^�2my�|v�~~�Z���.y�G���ᏻ�,�{.I��7`\^����I�A�ƍwɥ�Q�'iu��8�ғ�{l#S�&<����s]�L⬷�V?��g��i�@��b|qQ�#^�x��^6x��"f��:,8U+�L���T {�4�U&�7~Ce'����}�[��E�N��7n���^J����,b�H��.]�m�+��-:����΄�W"����=�;^�.w|t�pk�v���cv�Y��� ��i� �	�g	�
w��4���T�Q���'������(��B���.V�� �w1g
�p�/�W��U������������R��%�`
�'�V\���(l|�?�������#rb��6��I�ƽR���.D�M��}^����?�-��������o$����1���&w6s+}�a��@�<��������K�Q�w�ԤB�Q���6��Yy��c-S1���_��t5���*�(y��a���4U�Yf��,zW㄰�vr!(j��a�9lB_��܄Z�;=Wð�~��{��'Y'@���8��oA�G��ݬq�'�>Hn#eS�����6�x�e��a������R��'����đ����a�߉#�}�&Br��pH?]<�~sV����0���R ��8޽��=�s��#�A���E�K������w��_~F������?���T+�H���reE��uh�R��(����0��l��!O�R��N�p��&�u?@�����){��~���J�E�o����>���}'�g65�c�I����+T��d��w� ����0˘g�^�q@�O<P��L�c���jͥ��=]�evTTg䧰�0FV&Nt2}ޱ~�韇Ŀ�8�+�O3�"*�GęYi�t1�r@��E���=C���r%N�'�I־�	�*�{�4�b'NW�)��@�b��8�=Ǩ�K��e��rCh�o�)a��>�vI� ��4����l�IR7�_K��aP?I
Y·�=���0Jw�A�~�\�C�a8��F�0Y��P��}gc�Y�ŭ�4*ue���{n�a�ő�CX��#磑�!��a����Y�Z���!Z�?U6��/w:�f��p�S�%����8��=�/���N�4�(�-e�Q�o����믿�dqol      �   �   x�u�Ko�@����+{�9sAg�j�`�Kl��#��i��`�6�]�ͷ8O޼���G(��I�A��ɶpH5�"=�xC����|;9��ײDB�����BqP��7n�T�)J�T_�!�g�?���`�8��Ѷ����[Ye�M�8�ޠIp�ϏR_�����T1�7���h����m��g���r�1��)¿b����
�o��FP �mY���YR      `   �   x����n�@������fva�fXXD6�.��X"�%��wC�zh��\��|��,�fOs���` E�y�q}h��Y�-P�֜�9!3bq��M!X�ջ��i�܏�QTm����"yW~���8�~�3�pD>UEb^�<L\3�7��z�?��J��u�NQY���0�g�	´\}���`��s��T���ȹ��evj$C/R����	q�eN[�Y'�j���R���� ��@��a��Ze�      b   �  x���ێ�@���)|7}���P�Q�`&�x@���F}�����;��U��W�w���r�VǓ1IU�@���QѺ��AP1m ܀JaAd�9x�����7���'���堛��aɝu3�,P�y�O���h���R-�g5f������+(��Q�2�"��F�."/��B焇S������ߠT .�B�����<�ہ{����t����/�}� }8)Bu�����ɢ��J��~$v��Y�g�`��u�a�W@E^��io���y�*��T*��te��i�L0E0�ǂ!A�7O����S�c�H�^��A/t���l[�PHq ������H�g�~?��i=��Eb��k�:���e�"9V���=�x�מXPI|���奋�T�G�M����%�=�W �W���+d YF��_[�}�͚t�����`�tDI@, �yP&���YA`���`�t��ӻv^�pp[g?�t�Nm���C����������Z��	H�E�      c   @  x����r�0�u���@;IH d� ("
Ӎ�W� ���WϪ�:s:I6������ե�����
��)U��	�9�� ��@�����{�e���� ��W_1yA���۷	��w�C�=��M�
��UX��ij	�ALG��b�ll�g��m0���ǌzo�����A�#�~��
�n](壩�����Q�W����s�(At/a�5�����("������*5^�zƶ~��}5(U�O�����>]�iu7��ss��qh��f��]ܶXJЭy���<�AΎࣚ-�j��Q}ſ��ʷf
��it����3��#H����҅�Љo�:����v噽y&���
����̼��+`\���ȧ�%����-]�yOۻz�D9צ�d���.JJ?�]0��
 /,ܙ^6�2�8=�)y(;YnV�]���h�@W�Ca[�@v�^ӓ���8���5��4�q���{��b*k�e\�6V-�b-{����v�_8ʩ̩�#u�/�Ԩ3�[$�Vg��H�&�t?.Vd�,�j8Y<	�ay��ş4B/qA�D�ߓ8B��z�t:_~O      �   `   x�+�2����p�I/sI���,)*M���
����F�Ff�f&��������.e�.�^�^��%�FF&��F���
��VF&V���bƦ�\1z\\\ ;0�      r      x�=�W�d�E�oF\�E?����������g"!�1��c%[�^<%?��:�Y�|�uj�g����N?��`c�K���}=�%˹z���k����k��z�#���-�Zi7�}v�)ջ�몱��[��J#���Z�'��sc>��;[�[:���l�CgO3מ�H��>���]T~���x�X�Z���O����vˋE��a���;��Tk���3��������8%��l����ӧ<�[N�������5��9���	��I#D~ƭ$O!-v2�/`�K��'�3��ҽ����~K���0ʬk��;v(�G�W��x{���=�N�>����	#P�侭�J)����K(cf_��L�F�1�I�֍���)�(%�n�������<3ٜ�m��Gݳ����:�rʴ�U�����G��|�!Q�-��_e�4ff;z*�ߩ3��9�K��.a՚�.�U��oR�F>1<��d[�;e���t�U:=�r��^�F��*�䴘�\B9��^C*>���t���Bfc�1�C�錸�e�����Ύ�[������tJ�1z������h����
�&4�0Z/�P���rb[a�~W-���K���s�=�='�V��Z%d�%�^���0���ҦduZ=u�6K\�V9�y�"�Py̏�!�C�=E��)y���h�c�h��+2U�Nz�h�Cnv����X�X��/d'�v缻o��C��n��I1Lm�g����b�cѷ��"�J��}b}X����eƖJ�>j�51zy�4�b��=���8c����\�7�&���?��	LZ��<X�8��)ٽ�I�� ���Κi�����h!���c'(52���s�2�7��� ��͛��܈W�i����}�|���Q0��O�'>�Uf0�D�1#x���z�<���H�C�<̜�p|��O�E,1�2`w �3Kt���)��g�bƻB<�6���Rs�C� A�|VZa�7bdܩ��O�O���ҥeg��3�bw�E@��`w:sKA�?��_Dg����B�;�δ��m�z��Vw�7�^G�����Õ������{�7"�G��?ɞD
���lb�N@`��1�}�L�N��Do�=�m� ��"��k��4�kw�i$d���Θ�b&t6h(��#m����-ҝ�·{b)b;�013�h,g���V;B�ML�A�T�坘�����h�
i��\o�RA��B���0͓�>��na�\rH��v�o"��y�{��uO���ui��L�����´��u�/}�5��U�0H1n8ޮ�Z-�[L,�k�]�g��Ȩ�>y��ρ�l����N]�U%2_��Z߈�d�t�?��ʯI�X��3��\.��(ȂE������:�'��3�"�F9?�im��i��
��pb�Bb��<�F��v8�^	�C`�M�y�z�������a�9�{k"dm��BOnz�ǲU�8#�˼Z��"~�u���� �jq����˲�0����DHh-�u�Mw���@�"����3�rJ��K+�����gwzR�/���� �S]���_Ď�,�,?;H�?�	���&(�ؙ��YU��x�6��QL�15���Z�;��A��0��#��	gޘ�ԤJ������</���~�T?s�J�/���y��(���"�H� \��ћj�g��*R���txs�s����E�И*�� ���d�\a��|���S�B��2�>�u֓��E�'�0��?�<����tAys�∲l��������=���%~��������?�-�r�Tz4c���Z*��o�\vn�h��4�6�RѢB|�y|��>9<����74չ ���Nf��(%"��zW�����Aʼ���FL(�DA?9>E@���r4���:�e�;
fa�xa0M��d��~��.���4�{/���%�b�&�H��j��/N�d$͂&cDW)����l���l��h`O�g����@?7���wƦQ~��@�x��P�E�B?�ǭ�/b��i���"O(��Yd"~��\c���k�ox�蝩�}��<c�ן\�}W��6�zB��g
���@��alhv�f��D���� ��"�� T��h<c  oL�` �yɟ�euu��� �W��F����P����W����x��`
&Y0L�K0��h��h����X��?�|�*+��H-D�4�Iɒ}�(1����~��	�����H� �g�bH�Y� �,`}���F��B��'�t ~3MI�>?Oi�⩉��5f.}D˃A������G�1����s�_����)��#�1>�VY@�����o;H䬵��SHc�j!\x�T{g�u��Q�`p�=>��ϑ��ְ)2�xU(�2)Q��8m2��`x��U���D�gʗ�YP=�n��&�mN�0��A� i�<i�ya�h�D����I���& �����b_ �5������g��O��� �v���5�����Èk@r�7��oT3�?L�Z���,�@��
4�%��1R��)����̌C�Ӓ4p�|������3rU�&��>:����w
3^\ʮ��H��R�2í�/��@ul6��{@�VP���C!��"��oD�8�j.����@OC46қU��+Jjg����9����[��-����=4'�ή�A��/�Ymc���V��N�nF�X��"�Ѫw!4��~3��4��Q�щ�:=BB]�.D�Ia�G錝,��HT�mX������w����������.�H�r9m��F��+tJ��y�JJ��
�	a���Ga�7"�8�����I��H�
�\8x�I�f���h4 @����Q�5��1O���K�h�"c�Z?��ohy�nmI@�]�nߌ(f�LXB֌�G��e.�R��*iX0=�ޙ�:��ȿ\�*4	z}���-d$ U��b���)h��2�I��"Bv4H���/0���`�4��l��cЖU����4������xrp
-ͼ�s=�m�Є� �R�PX�<d
B�R˷� ���.@p�d��*R,I�,c�fB5�	+`�������	t�e��~#����?�?k�ԝs�m�kѺXb�g���KC��i�(*���Z�E�3��5�g �pe��@k�V�Ԁ4��@��,B6	����N'J�\���Mj��_�ˎE���Iߟ1��^�-c"O�� �E�?��`�0S�������D�����Đ�P�>b!��ܱt�"�t00B����{���~P)^8,
r�S�CBw���K/R�ȴ��A;��vmA2��i����M<0#�����Q�XUٻ���G�����)���#6�|��e�����L�d�����Ɍ�����9S�Ke����oh/��k�xiԞ}ZyJ�,!�.�+��j��Ր���'֒o�QX��6�g�qu�u�4�V��zCo�!ϟia�OD�n ��|`��K����"��s#b{DK��E4����1m�ہ̬�8L����e�kтo����Վo�с��L��!#M�5wȌ��E�y�]Na&��C�:���`�q�=V��60ә P�ri�v�!^�y���`,i�����{�ŧ�����Lh���<S "k�A,��є�:��gPd���3�IE	��B����� 5��!kG��p5IC�xR/%��GJ��HH7�E	�f��B��{��*��.�Y{��J�)�EH�a--��\���������i:�'�T��@F�kL�]��k�X��)�	-���q7�.��EDٱ��ޖT��7,�eh��x�2����M�j'&��A�G�7���^"�.p5p�2�_%���l���X��҄A`{�e��(��_�*�L�^�|o��?/��F�l|h�K�W笰{�)� t�A��_��F9�2M7A���W�X���dy���iiGy��q��O1PXt����W�������=N�i�"2�g�wP ��<(Cf.� .  �
��V�j�����XZ�xzУ�:p��&���n�`bĖ.��~���|VLY%��/�_�+�ƥ�ݞ�=�n�Bdl�A?co@}��bL�-�q�SO|�$!	G���f����k�%JMW�tz�@��b
�u�!�y���Q�>�DF�|�U��
y,:N�����)��9C%H�ܣ�)'<AW�C��5v���C{�X���h2��m]��3�.�{�L%�i���.+1�'��������\P��r	�,d����J�P��*ވ%��ҙg���M����_D]�UU��Sm�F��v����=$����00�+��ic�[P���?��C��q���
�c	�ɞ���� W��YR�%�9*G����ʟ���ca��� ����UK�-�6 ��AO��
��[�gCBiPLO��� �ı8[�0N��ǺD��o�"�h��Cx��H��'��2j���]$�$C����b�C'ӣ������V@I�ui��c'@���~�j�LH��t�A�@;]G�=nd����A ��b���V6����/$���uXa�����h��#�"}ɜɆ3�`)$�O���B��=`Ə��uO�D������F�jw�hW�-�G��h���i�4��6^����@3�ćn	||�ء���$��TR
��ؖ����I��lj���
́�tu#Z��$�*�]:��5�6���=:[ �W���+ca*!�Ũa�	
����u�F�_��b%OiBx���a�8���$��N|%�/�Aסo�T�6	���y@�1�(k@�I��h����84���h`#���G�J���\�ĥ�K������`h.�ZG~A�E_Ð�B2���"dD_ܱh�	�#y��8��h�ݥ�t��ڧ��+�< 0@�֗g��Xc6�	�����z�%��A|�+`]]��XF68�!Ku�l������섴�UU��"��0>Ǧs���j�"�X�:�t�_T�_a�T`�
�vN$�������A���D��NͰ�\w�(��=a%>�ą}k���I�w�z�QS�sn��6����i�>i5�~|���`���_y��\���"GjÆ.NN��=PCl7E����[��q��M��ژ��o_2S@�e��=g�aK��0���;@$�ԘKqk`l憔wcUȿ(�ߐ:�ĕ��0�a�d��`�nB��A���\|� � 5��� ����ߐz��B�q K|�7��GW�Epi�5K�iֵ� ���^|�xu=B�|�"����f�#m}t��Qb��d�`�g��S>'��t�Ϡ�z���x������Lp�=�rȟ_�(��OOj�i �����9T<��#R��*X`?<�<�o�F ���˔z�듯�.x�B�ꠞҮ��q|]ԁ!�����G��w3x�۠,��h�|;�t�Cف���L�wMH�6��tkw6���N`0hL_J ��'�;F���os�aȹ*Q�-P/��h�����#~��,@��:La�Q�J���,H3��O�[bP��-T&�3P=!�.��Lȥ�:��T��.�uUs�:��6����*:�4v�&��$��A�+d{�ѥ)�k�$}1�K{o�=��%}fU�um=+��bg�o�"�_��'%��������O��yJ��=@5'���x0��AO_���7��S��d�6d�g�x�z
�;����PP�]����.�/�̷/I9C��hX�'j⨩NF�+Z
����T�π�Ѕ�*h6PQ'=R�z���"H�:�^'���r�]f��=gۋ.��8���]�WFl:�L�muT�5��2=�n�:h��� ��g�si<�7;������ĺWϿ�Ug�=f�lQʲ�N����<��0�J�g2kY�f��0`�pO���&&o:���>z����#�tZ�:'Sx@^����)��B۪�OB.�y.����#7�(]!�/uk^|�� ��K�lT�{��n
���fXy4=hy�`�n�!8IAgV>���8��-���w�!��D�@��C�[;��� �AÎ�%`5�֞�����]����Jy�庅aB6�y͐�P��^
 �q�/�������r�|k��/׽z�{d��tW���.ѳ��C�H�1��^#.t�IH�rO�-5��O&�W���^]C�*}��!��+2I�	�����D,R�0G��m�(4��`j��0��4F�aWۢ�(٪	����`�^egzrԫ� �㚆�!��+��B�T+��?�n����莟�R�-N��z�I���Vj�h�U�q�� v�m�+���|&^�>W�:��	F}C"��y�!����tI��%"���i��2�j)8Y:(!� h�9���í����2��D�s~�}�eH��1�gh����ڢtS��5�0���h�"_L���`�6|n��x.�N�ȃ�Y���O�B�k�	��%��=����je)oH�%f�iz����ɹ���W�~p�EO����M����/z� ���U� ���=$���˻��񡂐G@D�q��(���)�9(R&�8�J���7d��C�,�Q>t�N��Y�j\�[�A�b��h��4��Ղ�Y�����*�I<�*��*�}����i�1$t��V����L� �%��zCR�)�<U�]���o=J�Y��3���=�h�x�Ĩ3�z����c�=�R/����ǖ��L�Ъ��y��@.�
:i����v�j�v�� ��j;�!+�A��, �˖ e���Ho!�F��1`�+�>:�oz�~��m��*�mb�L�^��4����5	%d�L�� /}n�#���A��+E2���q}�*uJ�E/����`rE?cCf �|��d��C�H�P�wi M��	%�G��JQ:�*^
!���ѕ���VuG��y��/�/�
Gi�o(L�+5��t�GoZ	YF��rN2�� ,��x��5�,A����u>���S/�{N��Lo��=��4�r!W�ݾTڨ�k���Ei�a�
��?���En|�G��[�Q������?
��,      t   e  x���Ks�@F���`9Yd����	�`�7�+��ڑ�4��&�1���*V�9�{?���ơ���d-�sP2Q�r�[(KH!�F��G���K�t��0]ٌU�����X	�Q���L�O�<؉ �}�FPB:A�`x������.}�o}��Y���XB*Q5��#�JV0��;U� g4�d�&A��m"wN��-_�����Fv�-`fI���ZR)�����׹+0�/״���$~	荨��6.��%������b73�`]���CV^7��I'�x�̆#��FU�����o�O'J�������o���+���;ᴿ81�Xq)�j'!s\<̠u��ĩ���k�.��1ֻG�Ʃ���rj ��|Ǌ�ZQ�1J+Åi荩y8�`4:���6c�����w]o7|�ԓ �Yz�ۇ��-�x�l�Q���ze���J2k�d����|,a��Y������ZeE�SZ�Q%����M�7�И	��FҐkV�wz~T�����- �"�u�꽙b=콹��J�U�ڗ~x~s������~�"�k�
tgHhG��#ʛsף�z��(����(�|�������b��{j�?[��o�3      u   �  x����v�H���S0�Y��
�6C
��5Ѭ�@^�p��%I'&ݽ��Nm���T�XHD7���yP�C1� ��2��YQ���TXx��U�^��{�f��x��a�y�;� �$A��n,O�I��Sg�v��vd��	�A��b��C��.siO-u�ןI���q�]�aI�
��d�M�i�L�0_��y��h'�ɳ�r>@� AƂ�E7.��e����U�J�f��WyXd꿁�̲_k��K!l꫉ �z��-d��M�(s� 8A��C��U�����/f���6�F���ܶ���Ā���d��k�T��?�8l�S��2?���iJa����<�-���Ӻ�i�������E�OJYuo��E��7�G�=o[���wN�w�z|G�%/Έ�*���WF�a������ОhZ�����Ȗ>���	��-�qpM�{�q�~�m9��Y�D�8�#
�}���I�.N�� ��-�j U��q↑���5�d�^8�T|U��8òO���iԞN�� �"![*���г]&�w=�^���-|+�2�P��-%����u��k�l�}�W��s�����!��:"a���5`����iOc�xö3�J��0���6��Y��������
P'Σ,e�bZ_i�:��[���W&�8?���ݟ/�4��(ʇ�:Y���<obug��XN��h��%�F#bH|H��忰\�9ҔEo/�i������z��5�V����{�ؚ;�uk_<��n��o���r�إgv�����w[x���l�_�Y���4�u�;�(�������!3m<�LQ��)P�У�{��c] }�j��B}e7#�v?��RW�<LmJ���Y��r��	��o����ݫ��z������[�      v      x������ � �      d      x��}i��J��gί�1��3sm��O㮸���@@A�dQ���ض+(���s.'�CAVUfeeeVef�^u�at��EAB�5o�S��x�)��k��]ٿ��帺�Ǔ`h�?��? �[z��Ay���(L���<��.IV�=ʛ2��@��9m�LW��x�ԩ�4������S�b���  DDQ
0�B�� ��Y̢�Y���,�  (�"���5��I�~Lڮmt%����9( M1���se����B���,�OF�<����׫0�h�[�*��lCt��lC=�E׬�3�4�� �쪺��E�1Y���һ��E�K��,��a��<W�Y�m�RU)�0���n������o2,ԲG�9�ɯM�О1�ȶӟ�q&�/�	iv���j�!Mg4��$F�B�52H��m%?�֭Y�Zc����ɒ���Q�"0��BF����Z�ݪ���l���/V�ʨ3�OJ��{�������y\�E�n��t���	F^c���B�ryMgM"�i��iȼ�I�SN�]QTt���'#�0��V� ��ϲ�*9ɛ��eeV�����.L6�^�S���f�� `��^��}1W�;6d��:p��0��M�t	�7
����?��#Y�<D	��\���1����3\#�2�--�=���1�)Yl�jq�����2���p���%&h��0�5;�d���Joę
��ڀ���TQ���1VkhC��۪�t�b.̶��bŐ+�s��`�|�1)i��MZ���y[��%����X/���_�(Y//����jo��#���O���k��Ϣ�J���",^^!uW�H֡Pq$ͯ�,�tC�_ز�~�U���n�e�W�ֽCۡ ���ן��3-E8��t���`w��RѧF2����D�G�g	�$K�y]T�Ny�1���-')�e���(R,n��9x��础�I����pu�E���#?�vVO�p!���{_�L���ˋ*<���4�NaM%���$ARVҋ���k_�����[�d�A&˄�1�Teb�|q�@��,)�7��c�_�7d�?a�)P��,v^eA(XT!�r1��W��j���1�&�����+7O-#�:u#Z�l�8��uV<6�����+_�����Z��q��6�ܮ�rm�lz��	^n5��%���� �S���������D�sü'%a��)����S�X����p�o���ÛTZ=q�)�����V���>�g���-V���u�_,�Z1�ц-�^U]_˄���«��OMp�1�h2��h���h��X��h*�͋�����t��vV�f:Z��c�t�'�����vo��eֳ�[��*̱��JjwY���J�Ȥ���D�Q�ɋ��//���u^;>��X<�+���$��dw^��$��?G"I�b&���1�NaDo_E2}� ���^�5��m��5�8��F���n���Ͻ�R�P�Z��<��߫���}��X�{�������(Y�|M�C�*��*~�v�_a����ٙ_��f�����h^g|r$��CF0�����j_�O����h�U�������<B�}�� *$	��W���D�k>�U�X�~�+��?���D`��-��ģ���bk�{����F\�g��@Wߞڧ�a�q�5�]�:����������������x�����oJ{��7u��:���+(�]a���g)�נ��Y����*9��oO�_8����Kʡ��<�J����S-�����qx��2�J��!�S�z�'�M)y�ӷ�+f���bI�[9f�7>�����1�U�-�����F��|\?$�0;���#'HH/nQ'V�.Hx������y�ɍ�����O�L�]K�6��;�gN�=+���i|}\cԱ�=0�.�(�_i�������m�D��aq��h�XKx(��f_�w'����>Ej�B$���t��OD�3p���7uT�Y�c��G~�}�Ցf���`�њY�w�&j
|�,�c�T��ֆh�|�P�o^����r�_ܙ]C��pk���x�n�KF �\?Y?�֍TL�������ϡ�u;��W��Cő$G~�ULB�p�&vx#�,��s�5�'Q���ߵ�X{�=C�?�v�m|�%`�3,C5���|��LB��>v/����}ùm�ʫC͛S���!��u V����IB�0�s�?؁����	-�[U$2coVt4t�)l���N�ʌw����9��>'�{H޶%m�z�f��y����8=���j�B���6ހF�NIi�L}<9���w��5Eu�Mr�?b|{�$[r^L����:b�Ϥ`��~�V�X��	�Ρo<͟}q���*'$«W3H��x�`��'��E͝�AO ��,��y5���� 2p�b N�u� ��O��	O����]}���P��s�3(����1+���֬o=Q��h�[4z���(3�L��Jq����S����?S��+��ϧ6u4�:�__S�������¹��L_)9�Ӆ(�'����D���S���|�X�L�������c�L�q'��8��U0i])�h��D�d�o��k�hN�*�D�'q��Dd8�D�O�E�,H��&��b��\���ծ��v��j��w�@N���D�<|}I�]���9BM���\���(�8�GWJs�훵�lҪ*ĂS���9�f ��Lr\@�hI�йW'�m�Y�<�Wt�,����[�2��!�3��?�&��T�5^|L�L��Y���u�l7�;�s:ކ��r���)�$�e3�3>0gZ�]�'.0�J�U{��[�h�w0	�������>�����!X%����̯y�j�6�30�-w���E�0�ɯklNܦ.a,�\1%�S�*i/���0�nC�1��$L� �Y�2�����ÕQG�g�<E-�����q�k�-⩩�<`�O�-Zb;N�]@�܅�-��J����	�v��8�C�yu��>fnI��*A	��dM�L/W����T
�	Jh��y�g9)Ȅ1�=Ee�hb�
�׵���!�ޚ;N����L�2�&#f&^�/�5Vkb&g�=)i
8�&W���9J8����aT��P�5E�g[y���Oܠ(��'v,N �9���>Z)0�]_��h&�.
����\��/[h�6�2�&,$%Nx���1f]k�֫vv�S5��O� S���ΊP$�BiIm7u� ����e��c����X���:t@4C���z"����Rkj+m�����/�bwir�б[y��]�qwA����s&��XL���E�[�Ⱥ�>wZ�3%���X#6S�n�	-v��^�_i�֚sh��I����*���P6[��,+�kbg�tޓ��]�5��"P�p]��:�MiY7FCs4l�y�E+�UYK�WL� 2�(�5/㶫JBT0_W��K�S�25�/�O�.�h��T�U^��C*���,\���U�h��V��3�p��3��@4X�J��X��v�.rIQA�0�:C��c`����b%��l�rF)OE�W�"0Q�����=���x5��n+�H�%H�}��Ěh�fr���7�AC���� �:�-آ[���/Ʈ�	�\&�z��Q�r�B�o��3S���/�N4��@�]3�^1�v[V�l�u�6ߺ�E�-G�e��-�o�T���"7�4�k��A|Z�Z��,q�Ù#NQ����`���@U��lwj����ٔWEI�9.*c������l��G�`CW�n�) ^mSf:�Z$yk�[7�,r)�}E \��]M�l�>�ĩ�	R�=u���5�a�>*�S�rSWYuT�'�P�3d���G\�Pr$kNJ-rM�5T�,���^td���²�U�/�P}-?"7���MA��n�Z���So���}�AQ�\��{:bn`������a�ZƄ��L��	8Üՠ�-ׅ�Uk�7h��8%ǹ�L�Mp]��ɺ��C���Ж�U����W�j02�����$����7j�x����	�
�JnѪ�;��D'vS6�S-�Wp��x:X{    ����V��8�N8��h��{ǃ��x�J"<.cx�e��*�ۮ���N�{#�M
d���<;�72R	�u�-�\*�nѐ���j)��-N���3=$Rð��OFt�m�̾Gj�s��c����9�� ������.:��"��dK��r��2�/�sl���+v-��}��f�N�L� $L	G�d�bs��q&7rk��I{S�|��ZIs���D`�m)�dt�k2�fԼX�k�6��(eZ]�Q��W����<+=�|�d1���#0PT�I��͛XG�+�%�����|���(�G��#����<w��7�b�__���
U�*C�s+c�W��",H�� ����*<%K*1�
 ����]'�@�j��j\�9�W�m;^53�����W�=i�j�V6������W+LK�6~���NO��
�v\؁D�i�[��K�� ��!�糒Zӫ�߿�QК^���k�g�=�F}����ް�nf/J����ːn7
Q+̧E]��s(Z�@%RdĂZ�h�Sj�g������P.��"�g�̳<�j�a?���3�P�;���n�������j��Z.�
�"�j\u���7���[���B�K`�c<P�-�W�v���p��+��`K�/����4�b��S��dPpy�p�%�T�Jl�SձW!{�:=V�.�+H�<�o]���MC��D��\4J�h���L[85�k{��]r�W�A�o�3��I_�kϚB�:�7�uX�������9b��{kpT]����rs����)�^�#ʹ�t�����Y8r����*:Rc��jЕ|�7$^�,�����O��K�]A
���F����YMhi�.�h�^�4[�Dނj.�?���-��n����6�"�����q�5_KP�H��(+i����eP��D�T����,�JC����Ff�u�3�ں=��[V���1���R�ש��Wr��VUt�9��t�O�H3BZ-;�pP.�0����6M�_׸�|S� �g�s�B�ZUr�mu nԆ���s���h�	�ם��}Ϩ������qxz����pߢu��xԉ�}7�x�c��'�o���r���I(��V �/�������$�0�V�TcDk��:2Ph��6�떞��Y�' �iX~�#�Mp�Wf+����/�.G(W*��m�VfK�Ux]Dz֜��HN	S�1�Q�`C�:7CD�$}�"4�e��*EjZ�F��k�'jZ7�D��P(	���t���Yf���G�RqGkf0z.��SKk�):�\}� �X��z�HS�2��QZr�r�$�"R+"�"R+�mf����ݤxk#fR��I���I���k��;��~�}���{u(�`�R*�4絢Z)�J@NU� ����L���ـd`���7md;o1kY��K97���4>�o3յF�y5�m���l�g�ޚ��	�>7�گ�������(!�^l�VYD��V�p�U���Ȋu�Z�c:�d�@>���c�V3��MY*qË_��dY���ew��)��!���^s,��4���17\���;��},E��i��,�[��{C�X�>#_��:�?o@�����c���&oq=�fx�'���_ �a_s�qB!��ς�_E��*�!_ss$۹
ԗ�f�Ŧ29n˥��ȁ���7b��f�3�[4�4�bYX��F9�w����N��pJ�i�3�t�ɍ�4T���t�1,�bL�Og��k�1�0L7��t��nb�@ N\x-��A�<M��z-�V4=*���b��-��}}��y��P9��i�X��4����G�F=#L�ڴ��Wm��L���\of�A����١R�3U9S�3U9S�3U9S�3U9=�� (C�+GY�L5���(�rַ2�7{�M�2�O� �є�x'HH����q}^�H�7!{�M���8.���}BH8z�cG6�mM)��n,�j��>��z��T3�$�_�Y��
5�eC=u%�3�D�����+�<f:�G"I��:��ǐ;�}�}�V����^��ESg����4�=������fjD���7pji�@�K4g1������5ԣ3�]׳��n��!�3~�����ܟ����T��-T��x#�A'��G���F�b����M8������7'7����_�uDz�x���=�J�E#�Y������oO��01�/ �2�$���]����㛫�;~w���{�[�ߜ߯��=��.�>�L�X�M��T|�B�w���W���/O!���^f��|}df����tK���ձ_s�}H�z/��qa|^��@���\�Q^����z���`�M�Nn��Q'�Ju���#Q�q�H�w	 �]��ȏ�*c��[�=�Ƈ��9�Ƈ4�=��Q3�t�T|If;�!�u�C��v~9��]���U��Пt��/~�ɹ��(��������I�3�3/��e������c�9�
�%t���9�&��W��C�o8�7��Y���u���qI~���wt���O�nQܪ��w�*:Z���{zㄎ߻1?��
��}�ˋ������?���CC1o�?�XH�@~6vQɍ>��<����*]�-9/�Oݵ��Ǟ�3) �2�/�
��R>���9t�ئ�s#�/RWӄD�R!A1� )<���\�r(����JN����ҰY��f��q�L8Y��������VSrԪ�+h�i�kN��Ū���RkPt�҈.�Gs�4n���K��*\%l��?b%9��O=[�.�P�5������g��Sd:��ۆG6O�դ[m���"7�/$1ʝOn���� ��_�w'��$"$��/�� a3
�փ�D�����(H��bω��T��?.��w���￧�3wzk��(G��޶ܜ�4��m�3�����^���4���ϴ٬g��	ם>M�|;q��7'�@�Io�j���전4�x��3�Ma��S��ԡ��9t���:{Y�k���4��lB'sX>����зW^����81���s�w���ٟ��|�z�÷ǂ�rB�>�X�\g�ۏ	�[O���r���EɁD����U��8&u�~�����#%�{�V~�,���H�_]�a�^��2ABz�N����_��Q��K<�c��:�Q�_��!�1�|�w��p�uL�����4x�T�s.����WT9-'Ν����Zq��y,u[�Ց$�$��t��0!�`wHƬ�����:���O��Gq����h/���4���N�� �-�R�Կ�{j޽;��ۅ5�_��%56C����&h�qO�E�o�'�_g����#q�?�.��0����+bߍ�������a���ώ�{7w��.���(��E#T����X���}$�#|l���;�vJ��h�nK��I�v����}��z��1~��l��5���>�Ny�ּ%Ɇ�\AWw��ū�끸̐Q��T�1��r�j��}!��|� �J�AMv*�����[����?t�_����uz���N�����i2�vUG��SpޚIN<4wa)��:� ��d��Qt ����2�O�*�n���`)�
-g/ �
f���`��CCRU�,jMm�R�ҁ%���!�w�����Y+��Zl����#N�uM���AN�k�Ct���E#� R��5�Հ�a�כS����/H���h#���ǋ���@�u�n1��
����J(2P@W���l�6�-*�R���!��n�(t!��E��}r��m��_����}��,�.������&�.��Kb꒘�$�.���S�e������o���r�c!��9��~����$HD
=��gA<�g��QY��bd��o�²dw�m����"���0���m�W���.p��_kH�Uޘ��. ��Aa��&���%�>+�[K�1�ʢ��U}���wl��N��0tQ��Y�]���]�Mej�	��:���.`�~"�(V�֨�m�0Z��FW-W�L[y�!Ի[���9W/2.8�j���qoy���'z�^,�(M���zԉ��_y�Q4�� �  ���/���8u&c�,LfYJI�`ŗ;�Da���h�P�Q?l�WhOj#m5*U#��s���U��O��i�̸�V�>�F�:�XG��12��f�h���!oJ#��,��x�ܹ�;��α>�x�x���ܪ:���g�~��o�����W~����Q"1�-u�뿁��Q���24��B�4�)���3�[�I �>傄R�ȫ�.�T����Ft�O4Z���YV���J�j��!ּH�p��+��r#�Ewސ {Ql�CV.���<ǿ��lQ���c�Q)�"�]�MR��=����Lj�|s?uqN]�ߡ��-]����	4�]־�')5.�ޙ�a �m&.��Y��3-	��h�-�+�쑖�S������3�z�2o ����H���lkkT;4"-f����:�؛>ͺ���c��+�R�U78�jx�����X�]DPj�=1pof���3�4��e��D0��[_�0�z;����䳛y��n}|ϝ��:!^>�Z<�ma�Q�A�@P`�AP�B�v~Jke��*�noդ�2�cU���X�G;�����<�3j�@ڲ�v1�̐CDsK[�������V��R��l���r�)�e����֋|���8w�O)�8�`�+M����/J�q\��,�,����	�!��#u(ò��8Ve���Zj��.W�����R�+=����!�����'B�1�2�[�)�+�uyn+ZɅV�"3ԶCe��&�[=s]��H?�ڙ5�C�J����r���=���Z��9������	1m�4�K�s���妢 Y$0yB�v��S4`� ��Z�L��Ѱ:冞���*��D 謁L��j�236�mK.���rZ�ܤh7?��AwQ�
�h^C�Y�8��1 �Fm�!�|>7Y*�ujg��K݋�jz�Ǘ��~FQM}���eW�~�����>���ƺ<9���_�3��8����:���Xƹh8.�_�{�P�wz���gx7��p��;������}�>�pE.ˈ,�ׅ�X�����y?�A5�)*�*=��@n"���ˊ�V���(��*?��񺶄7æ�ɵ�Wm��%��u*3^<�:U��%����Fǁ2����>AH�<�&�H�{�R�l%F���E�>�	AB��� l�Ƈ���u���̏?�g�m�      w   �  x��XI{��W~E��|���ft6���~w�����b~�+��O�g��[k�nV�R�ЪH�S��z��z�
�q��C5�����$c�&�8�#�*Pz���$���� 8��r�����/��1Z��ѥ�� |E�`�m���r8��I��|@CD��Ϳ���Z-�[���\?�L�L�L�_bPfa�J����f�W�;�|n^�[3�Mv��h-
�z����x�#2�)��-[Vs�kH��
�+2�ȼ��7ȸ��*x©Zlf�	�+��Ȃ��7��w0�UW���z� �G�_��
�|���S`�я�U��8�4)jzMWɋ͵&������� @\۩3
ZA�?��e���دھ��Xb]�� �6z�S3�˔�P�%&�P��@y��q�����V�|�$m cQ���4ɘ�NC���9�[=�潌��5����=}$#�|Y�`��xW,���<hئ彚c��l���"�<���E���NF24�ˀx_��8��_Pѯ�Z��OGY!M�j��.����Q4ֵl�����2'��Ї��=:��)��j��� ���=˂K�;tmQ:ب��8�.�� �'i��F�ä��1��hwu5��.5[�a���7&D[�H#� �U�u���6
��}8e��}'���[��U!��`����ct֒gA���+��8X���js3�j a��:n��\��	[#��,T�"��[9`�^J��Bx#D��²3�u�K��z[�X���ȫ�5�n�V���!|��I��3~d��p�#�=)�(8+���d�y�i�QS��@�x�ɊW��2���㨓�f
�oeI*�mg�����l���:�U }���xcr�G�ݜ���͢	�^�'*���B�z��>K=�6����.�c6�"�{]o��j�}�{!cI�r�W
�g����[ҽT�ӝ�$]��}1�j֚��|Ԯ���/@";��o6M��a���_G��hH�C�R�\�cz�='s755�Tی�z���`E���S[�`������03R��%��lަ�`�u �O��;$�MQ�7�;�n�� �so� ���Ũ�!��c䚿�g�xz\�q�f[���*�C�Y�&����X���y3��c�c��:�U@K��z�Q���	)I�vT��C�j�h>�#������{�p0Ys�O �x�VB���,
���a�kX��㜱T��')�83���#m>X-[Uh�E��h����K�N�
}���S/���0���nQ�,�֚�/wh!uʭ�nЈ�/[�ޢ���c�gwv>өh:�P��VX����b��)����M9����}h�~o�� ����"g��X��1��E��N<�f�Ś_�l V��U�Al'��\A�(���!�{�~T����&"����Q)o�צ�i<>>#�Wg��FvZ���g���rZ��f@ZsO]����`Ȇꆻ����j����w
��Fɍ�։���f�M���!���55ch�҄ߝ�?v�l�Lo��+�m>���l'E��I���9��3u�6��qf�R�������t�M��z�2h[4ۀ��߯W�#%�Ԉ��hī�`�J�cB���D�Z1F�k���*`o���A�D�ND���qA~�ntW�����L���]LbF����m�Y�^�#9`N�t�����| z������v����c3��`�r���w����FX��;S=�C��D��� �����&=�ī�-)� ��{���=���X���ϳ�(���z1`S�R���.����}�iW]��%�E����/��8�e&Q�/�&ڬ�{9s��nrn��)U�!�6����υ
+IG�#I�4Ձ� ��Z��۴��Um������.ئ�����>��������"m�7l�K�����|�V�-S�ߚ����_���������(<P      �   b  x���ْ����ӧ��̃w�"2�D� 32*����jﳻ�Q���*c���\ke�o%��:w5Pl��Ca���8n(@��O������� ��	#��0���5�<塑�e�Ȕ8��6�V��/?����:^gwa�Xbe8�s���~��|FT[y�&�
������ ���V2QJ	q"��C������R�G%�Wj_�x��=P����Tvz���ѧCǔ)cf�C_�ż�(�eNAj|�	h��
����;�@�'&q'T��v������b��U������0�F�5�?�V�x�F�7��N0�.0׻,��38�9#|����o���\!�r#�f�� ttHС��wa�$H���>��h��~M�/;�ݳ8B\ς-=l���8�
<�(qe��sq�m��7��5�*�s��Rk�.̕ʁ��YM��������zq
Z^I/�l��C`U�GucBaiV�j�dn|1�d'������K�����K�Qt�"_&�G̳td�c�.�e?���[�+���Dc�����y��R�V��u��$<Q%��!:�vX�S��7 �������"�0�8iǊB�~cp<� �0I�8�F?���ѽd=r����-���ܦ[��c����S鋳�;m6ڎ�M:�K<��(��j�k��[�������2�0%���؄�>��r#\�V�=�!���}�k_����9{�2`e�hs��Zb]�!��bd�78w�@�'V���~ ��������a&F1�m��"U,�u��A"x�li�S��Z���z���tB�K�RVy�6ؕ�#�L�r��9=�>��m�)k-h�F���?b��5�V�(S٦T$1FĴ�wx�N*D�[����25fyW-p�<eL��!� �[ƇDxGܠ6��=��8Vŋ��J�1���L}N�z��[��U�킶-���p�����{�����.T�\ϡ��#7�*�f?�T�=�gA�T�W�����x��|��f�8��}����Rk��-��
?B9Vq�*?_?���V���tD��3��0��4���mx��Pj,	�t��d����x����ߊakCw/�[���0[F�N��n��)fq�8����E����y��[#�`jL|�дK�`!.3R] �#�T���m�T���棼�`�p���! -��B�v۵�A�2*Ɵ�<�������Q�������8����S^��(J���j2��y$��6ǩ�����=R_�6��t�\����E0����5#>u�E�^��K�B2�^�󆛮����_ؙG�v~�¦.����2����m��W���ө	�����HJ���W9��f,H�c����_����(��j.�`�ts�5�&�6w\��g����[J~�Զ��I������1���HUcN�[��v��W���Q��d���*�r�-r�JlZ�Q�s5US�D��ğ�d{��
	!�NU����(0�`,ò��p%�j�+t�l_=�URJ^�O�>�&A`uar�1�3�9|3�f%�������������Ѧ��&6�7�̯�#�a��x��"^�/_�O�*�����ǔV�0>�ws�:ّg���,��������z��ٙQ�m
�`[�-��Lt�fַ4zv�״��'�	[�`��XH�y`��S˨�wQ. ��_�̋p����X������,Eڛ�i��~1LL��.E"7d�a0�l o�=]�)��y�~K{�y�
�\e����Y\�qA��㴃��ƌ��|��E|�8�̳�����z�c�z6��)j�R��e'��zy?������u��y���?�����      y   	  x��Zɖ�J����X�8C;�A��&��ؑ���W���4ak���ώ��F=W��F��yC�Aɰ������F����[;��� @�(D�C�ED���8�r# �&�&+י����ϓʢ�=h�J� �fX\��Ⱦ�Oo� �+-](B��%��"�����O�qK�w�y�8O���=�$��K�������8��ד+Qg�Ac��Ԟ��dHE1I�AT��`b�X5aGǋ���:V�ch�
V���(����X�n�ז!=����:�V#3 &+F,
r� ����[[8؆յ��U@��\Qy,F�'q�p'���u(z��{���(i�̪�E��'�^�<����X���O��x)�yU��"L��Dg-;��"��� ���{��] E��g4j��B�	��B�/�d��<Ґ�6�8�<����a�l�.7���`	(-��Sԏ��#�GJ��M%��L��\�LeQ��2�������'�(�gG��Mv��h�����J���X���yR�gbz��J;	L��|\�nZ�ƈ3"�tF��8������Цá���p��Ӳ�-&�C��>��n����v���jP�^qB�����a���I�$K	Qy'��S-uv���S��hfq>R�PD��8674������������h����j����]_�)h=�3�K[�����U�#��YV�̋��Kq��T�Z��v�@�9����g5v��Qb1��yZ���d/��o:��x�f �6��^<7��Y�le������fa�E�\��F�v
*���jo���한	�˘���x���v�Lf�N�K��d��옳$~sB����"th�^��r� �9>���C�D������䩩��*X�Y��<�)��z�)\$ҋH�la'}>�S�"��|؃!G����I޺�3�������P[�&K��{�s��Tu75�vH���66�ܫ3ǒ�^J�� ۬N�}J������5�ɋb���`ع�րUTk^�}����b�"�i
�h(�f4��i�k<G�0҃���J�FT�	/��i��nׯs� Hs�X,�9�b��gr]��<���:���HD�xZ���tmR�y��f�U� ɲ�7폶Qh��	�Q�BM��%��j��cc�U��`!�������P	���l%z����e_i�*.]HM�$�?Si�J"ȑ�!�L��h>�\K�v�7�Z���D����ʹ��a��u���[s;=����	� 7~I��X��HF���G��ݓ�W�<4d���y�����a'r4���H")�38[��[������s�!�*pQi�vgt�C�JT��J�E垞�3����e'�ז �v�$��H2���|�3��?�O�L��1s��Po�K� ��.~�67�0�NG�H��+ˍU���A�P��0�ۄIɊ���>xj����Q�r[����J��y����}O0i�+z>Wj���vЊ�'|���N��	��=m~��s�4:��Ӱ��3.�w��(<���:��n�q:J�:8.�3��I�H.�Ɲ����Z�|�i��=p�S>%8XR��GbU��:�Zo���X��#*��(��ҵi#�h� _ə��G,� Ѫ��XU��p_Q=�E���$J�_g$�Fћ�>�E����2�����j�!��>��."�	�^D�&�௽8M+]{��8�ˆ˾��ō=x��{r��5lz�<B�+�.��kܲ�tB�7��7�R�m7�Ϸ���K��3���H�D���*g2��sR$@E�W�
)�m���k6�D4��QUx�EW�����ޕ�W�Mh (zK�Pi&*ߨ%��F�`�v���Ϊ2�uݗ�k�"���߫%�˨�鋺_֥U�k��_�OP��������~�jݐ�έ�tʮFZ#@�7��~|A�wU���5$4�}��`(������б.x�����y}6��tWM�g��r�W��|�X:Ls��]�^�Y���v��G=+'����� sGjXk�����s�e@�3Y�8q`�_9���~H-����@�[k����k}{x�N�wGT���5dH_���������}���t]����Q�����ޱ��vz�KV�eOځ?aj�� �R#R��L�t�8�Z%���rׄ�����<��]�o�uk�Y��թ��݀D��(�+>i��Y�d��k�X�RK���Vm �o�IE������,�՘���l4<���j����:�_B4(S\�%״��|N�C����eH�+�_����\|%��Ǹ�O�^_7�ů"�� �\lG{�E/ה�f��L0d��='�D�3�|�}=XZ1Uհ�`���9��������]+�k=p���� 籘Fw���ba�7��I�'��G�
9"A��#�7�U�]���[S�� �A[1��b�����;���r�o�JKߘ�yB�c;����F��4��پT�0�(����"��j�������`�7t����j\�*�nߜ�G{�׀��d汚F��)�������5��������g�x��s�G%c��`\���0�:O��~{NC�.�yUYN�j{!��@�Դz�j���p)��]���v�$���i�,>�g�.��K�:�^�d>�}�����?���P�$|�:4J�Xi�ᗗS ��m��+���w"�kS�g��z��v�h�_b���y>���C�}<V�L��5�tB6,���gr�����������	�"      z      x���ג�H���駘�'��F+�V8!aO�R�tw5�zwb#ꊈ���<6O�t����q,�\p��ϟ�kR�jC�7��0��(������(��3�uB�{�3|�]�N�8�J��5����D߈�C��;���+�W�1�[�ې��PiR�A�P�S��}����0b�é�;/�Qē��A:���~�ϑ�}\�Ta(�|���-׻���c�����N�?��鱶EfK�~y�F�[*(a40��c�__����ə�:o>���C�`��>P�މgw�������	�C�?���L�����<��7!�n�N����sId�K��!;�ȝ��C>`�a�ߘ�� ?�L�k'��17�yJTd���`W
�ܵ ���F��+���K�c:��)�Z �7�V�tه��7Ilo�&�J���"�_���_��eI�w��}�%��u}�0�mU�[��W��%P���K%D�������]�Z�9N_W.����q�~n;��J���W�C�-C�+o����ݬ��t���X���(S�u���R�? O��|i>&׾���V)�+oi_9�3��aS1�i�8�W��!e6�P�VYgZ����A�RN�6�ѵ�كyn!p�M۟�+�L�g���C���[���0+�3I���׼���������� I���ܿa�s�&��#�����L�_NX㓮kco����?�~�;X�6�F�c��M���o�W݅5Γ�&mo;�v�oob�s���F?�� ��ۺy?5-�e7 ���/�ʾ���f�
�����z��x��(�J��d�C�ۑ�ˣ����G��z/m�7�I������ ��G�4��NW	�Gb�{�����j�S���GE�5��X��o�O	�>\u�;��2���(�S�8Gg��7���үԹ%�
�ZU�8 �o%{�[�W<<t��G�@"��xK��m6�a'c�:�����j� \��~�O�<����M&y����H�!��=�-o�D�h(30$���B�J��Ќ���y������z�{�9ĩ�5��� �_~��GÈ��6�-�+��3J�����U����wͣ~��U���J��Ϫ�̑ ���y��-*V�a����ք��j�{�����xcpbɣ?p�^�,h��c]�v�fMg�T�$�N@�{K�À���x�)�t���Һ��q���s����@�~�p�_B[����r���7���a� �3�2S	�|�(�7f\$�P��fTB��f��%_�=����=;X��w�?�L�rK8�Ka�O8�޲`�x�2�~���y�H����d�U�\���5~���'��<�����͘Ƴ&B3P�4�f{,x�^�.�����ܨ{�*s��4g�D_����Q����#��퀰B����f���2Θ�.T�qp�X/�W����~26Q=R��ցgAb4tc�qy�؞ڃ~���-���KZ�n#�UiSk������~|o�}��/'�W��[��6REݛL
�G�O��ڝb4Q��N��y�:޾�V�&��>�#f��R��A�Np2h[�c�w��?p�#��`=�J�%9h�EO�)*Z:h#q��'� �㕯��6��nPM��(\���f�P�����W?���zd�\��T2*X�pB��R��o�yD:�>y��������,ޘi���;l��0J��-�G�w)�z�u��|2v҃DnS�����������9�K-�r���A�|�����)�d���<܏3��Ŗd��:�[�C_yK��q:2d��o���fE;:rҨ���}�0r�#��#�$4z�Սg���<p|��-�!P"#���:	OP_�¹
	c�j����/�����*�9�W�T�x �����1;���a�3m�j�h�:���y�����+��Z�Y����r�. H����=�}�qA�6�]��>�	"��^�/���?y	\o��Qs�����[
�#��-����,���ƪ�z��{{(l�r�ò_2��{���]F�x?G�k3��~��E��B���Q�C�����-�[���Q��)�;3�Zӵ]�+A˵�:���_ȳ�ϖ�^���������
�-G����W�UQ	Q��;i���r��3׵Kӷn�V$d�|$F$v!a�?��#��2~�}�#�\H����7-y���p����`z�U�s��yݒ���)f�G���SWn�i#
����f��f���E�߈�Yo@�es��a;��-����.�.�8Y����:($7ʪ��9���/�kN��F����j��ﲆ|������A@+x/`�s'�<�Zr��K�^�i<$;io|� ��h�?��)=���e�<V}^��=��C����3!�G��10,��ٝ[k��	D{�OYc��������Sſ^��������I��@�;��~���өW����XF�2TR�1n�'2lL�`_O���0��VY�
�D�~��Pk��N�B��,�>���/��$a�G����뚇�M��-7@��Ͷ���#f�9>��������%��=]y���I ��%���dl��a� ޗcޚ��/�œ>l� Ǝ���\�$���]�8�v1���g,����P�t�J�ŦGd���k���@
h��5^?J��`��8့��19,Ƣ?y�;���=�Nl�s�}�#����[�W�������r��y�"���}���	��m'4hjc"m������A����[�ѵ�(�N�����苓� ��?
X���9��)��siAD�]a��dlp7��x�5X#� �l�B��t)^G��׿�-=����V,9���� �����U����a���]޳t+5
���q-�ԓ���>N���_��3Q�sO�xvA�/eu�[��4ĸ{�����v�����ye�\�˻�<���Mo�X�Ox9�Ax_ak�R�:;L�>R�����P?���}+�~|e�Sx)�"�@�M�l&��(Uٽ�?�qp[�W�E��?�t[=�҄��95Z�d���H���._�Nz�b���vi�z�������|~�t��Q?���٭RI������x������,�AX:����pޚ�}@Y�h1j������Hey;�Ί�i㄀x+��[��}�'�I����j�0�M��_/�K��=I�3�!-�h"Lf�'��?x0��Ƽ|r�p��,��V� 	 �#`�d����K�����㚝h�nH�y(��|&5�(`s���e��*/��4َDvL�p`���擇�����0�����t9�> �����Z�$�������L��oi �/�*��f#O	OC�v;Z�D�%�d�F��I	�~������J@!��v�J��h������M�lc�q��$ `�?X&�1�d���a�rʳ�Ƒt!������T��L�~�|&ir)��x��M�P
,��F%�"�B����;�0����ɉ!��ed��m�ܷ\�] ����� j-`�.ȱ83�G��ޢ?Xm�5�+�~�M#��h��S'N�×�a��m�f�u7�����C׉�o�fS�¶
�u�K~�a�x�B4V�.���c�A�J��,�{>����{sC1�� �)y�`�}@<@���[�'��Rni<k���P����ds������t�c���Zo�'�酩>S�-��~V?����ٰ�� a��x$7��l4��]��5���jH�iXa��P8��ڃ�Ӆ��l�K����C�x$�]�0�Q#^��B�'j�����;}n:(��>W�ue�����Σ��0�Tړy������Z��2)i1"�
6�_�r�x�*UQ�RӍ���Y6��*ӿ�@����6/����c�N���� `��`�,E�����g��[�޻���@2�C)q�?yz�����h���h�b�1�\�Q���v� .��G�2���Å]�R�����T�44y������6�.�D��љh�N��   u�����
ˡ�O��a������Z +[i%�'�ݰ���6ཀ��eiW�����[�
� ¸�|�S�4���0��+�nd%�w���P�&0�kk�,���K�%;�����pmUH9[�%��~�/�~gS��e�� �^Xے�\9�����z���i�#��B�M�W�C���wF�=��"���-W��.�rp��w�Lr��Ź�p��������+�A��tC��|:Hg��bڱR}A�9�U���ׁ�Xo9��m�R?Km���u�,:WBh*慓6ǩ�/�F���lG�!$'W��<�/x�Σ/9��y�!���Y��$�qnt2�>���sϰ��fq6�;���Qޚ�^�{���ْ����&F%����V��)A��z�%�xU�7w�y��n:a=�e�m�!�LTD�w΄��<�.���{�6,మ��I�QL;C��3�]kX]�m�_p���wo�m�zE��V���5o�I/xK{��ͬՋPw��^d(�o�����������<+����Օ|��K�h8�Q>�Ғs7S�C����������{)-s���2FD��@<��[�5o��Tiz��m�N0��&k���eޝī�����>��\�� #�g�e�ӑ۱�&	�a�0��~�.ၕ7Lv�g�K��K�T]���=�n��w�HMlg�x��2|�A<�O���\m3⋑��FHJ�c��92�0c_^O,�;
�	!s!��ίU[֠���~J�{F���y�,`�����.x�����=j��KC� ���8Œq�+���W���GD�vjL�Eɗn��_�g�o�ZA�|--��5$�m��qRa�P C��<���rkJ�C���4�} ����U�?�7;��'� CD���bK���x������o^���[^%oc�X�[U������b��!�A�#��&D�Fǔj�g`E�>��Ї�Sܪ-]������A<��8P`E����|����_��}�J�f�NB�v;��o�A<��Y~c^>�R����� �W<w      }      x������ � �      ~      x������ � �      �      x������ � �            x��}Y��ʶ�s�_��{�{3�ٙE�ԛv�(؎�����Ic��oh���U{u�ʪr~1c��c>n�����FJ�O^��D�M��@�N�7}����]�]��|Q5��zZd�f�D�g��ۼ08����I���	#��4��"^�_������x�p��;fGk>��c!�Rw�U6��(����o�	#����`�o�6u� �۝��1�(!��.Ϗ��ɔ?�ç%q���d�r*��{�7��g�s�t5��B�%Y�H��1��M��2����gB�:���� ��r�S��vL�AŶ��S8��%�X�
�$�I��t	I�:�T�;*n�ʮ\�<ݩ����`y$�nӭ�o4՛"�_f�N�]��Gs���$D�x���l�[��,�8	 "���oF ��0��>����8v�B �# O�g�����qI~t&^3:��LuD����ul�n���+�{��N�t��Mf�:I�*��s�Xd�Ru������������{b*��i�}&yP���|�2��qz��L�;M�5����o�g��7��k��oX���]�T&X�IH���N2�����4��O���Q35��i��MK�O�FA֑��w��:7ڎt���TӳW����毚gٟ��]a�|^ý����f`�&�flj�6V5����
���;l�� ��:ۼD�f�S1͛/,����^���4�2OK���S+0�W
 �N� �o�+��t�U/�<S"�O�D?�(A� U�}(����D�Վ���I8��e��1��4���o������3�_q� !{��|<�1�]�*�Kʍ��ek���|{&_n2��-K�;�`^?���X//���v!S]�]��죌@��~)�Uc�2'��)Q�/�Y���EԼ`��&*&E/d���onE&��w[ƪ�S��X��|�!S=��=�3=a8`)��h�c����˩�O�=�A{(���hP�����}f�k)��}9�wA��]�nԬ�����j��>G���o�Q������?��#~�&Éߴ ]�lP%�Y�رR=��H���ь������M�ip~�g$P!.�A�t�8]�f�R������f�u�jZ!�����_�DDC��d��L��o}$����w�f��.��Z�L\U�`-�m�Q�
<��~�s��a��0�l�D�B�5�n�؎q��Fm^^�(xy�#���d����D"��N�2�D�+�ك9(<K����xiGljZ��>�\�f�
��^�w� 9���'ˏ:|����W�)�EB&�"�&g-��$z�g��ޤ���CT�}-�na���5��� &{�����5J�z����V�7A����-��%�����,�h�gE�����Հ��z\0�,���4{�������-��'��@H�>����x;�W���j8{c׮��Vuu⫁����쵱���@�0E �6�I���x}]����&��N ��<�B��;A�{�3]T�#g�2�2N����F8�G�,\I6�ĭ#MT��B��h��c�8����H����"�q`?�N"E�ϲ�-������k0�iZ��0��� �d�#��FP��|djgh)�'����M���ڢ��0�Ζ���x�+z�1 ��������dD�����u���9���P!�q�ؿ$S�]��Ar#�����%�4����S��"���p;�v�W�M��M��"G�EL�%d�S�Af�[�7�_�`��lLu��xqQ�`���z}���椤A$@?�0����ꈀ:�UBk�HVn�y�G�_�/����oY��/�E@c��P
e�\���dzی��jV�2xBF="cQ�@����W���ȩ��ֺ�w�?DƤ<��e��Rd�4R<*��e��Ě6eJ��{n⚓@�F�ܧ�
�r��p-׫;�#��E*����c���2�����z�*�02١n]����]�6Se��M��������8��ъLl/�F����a��GC:C�4�����?��.ް%�����7S��Y�(�1
�ZKy'Zta���mx*`�GQ��������ļ��1]ҷQ���T;c2���^�aw�D�I9�DRZz`�d22a�"�ƃ�eD��p.��)�W1��5m�j��.,W�me��~��.�)0e��6�L�g"�PS�bw#v~i9�T\�XI}���{�m��B��G��#ܚC�k�8%�WK�g�n�c� ߅	I��a3���>�kМioh�2���E�yœ���O�d�1��8�̛���E�,�.�Ú�1��;5R1�b�55O���9��|=wkFG/��������"���Q����x�:��!$I�<T����:�t��b��n�Q嗄)���;˛������
��G��HF�A�c����hVѴ����)�
}�$��>n�*��a�"�^�PU�,4�ڏ`2�焥|LE-RiԹ��ܖ0E,-f'	]��Tf�$��#���3�_j��߰sԨ�a��Sh�t��lCԔ���t6_ٯ�_i�W�7��:Y��� ���e"h����j����J�y������x���d7�6�)�lƇ5*ax�J>=�ԑ����Q��qU�$RF�yy�=I]�Ψ���b�ZS֓JY�.�:��YG"�:�֞P�hU���V�N�IO���� �y�~�y'IZ@kJ����g]<�/�KtA�Z��	-C)�(��YzBH��8�޵-~����F"�8_n�{s5��+ѱX��w���oKVB����g�w�e��šë�Fr�4]��ެZ)!�Խ���@���RvL��}�?�F����)N��]E S�Jy�y� �u!P�GWi����V�Ǿ!Wv��Z�'�GU{��I*5WUok���NI���M%�����В��S_��&eG$���@�iE)m�[-����Y�E�5���I���x��Y>^�Y�I:�6���š��q 6�fq �^#�\*`xy H�e�a
��s ���і�ƛ��v�H:p����v��
�`6�_Q=V���_
��s��A)��R�g�JwB�&ֺ�o~��0n��+>-b-��<���UC���n��ɘU�嫥���NN��9���r貆��`����yN�?�}���qΩl%�
�1rh��j�N$Á�*����Ҡ���J7>+�:�I]�)�'P��N���X3���<	��o�����f�w��gV���)���2${�l�Ί�5����Y�|f�z..���Fe���ڦ�6�;�`o���At
���#������ۓ��9��I�&$���.ә]��?�8­�?�R=⭋7�����<b�!U��U�h��`�ޕ¨Z������F�D�b	N*Q)}��ң�H���a�^�Ƿq�&���-�C`�H���&
�o+��S��h��3��{��BJlea>�����h`�Q�C[ف���7�k18���x..���V%�Y��Wź ��-��/@�O����H54I����ڭ@���J�E󯃷�)-B���<��3��0ƾ/.�^���B0�q�G�"�+o~U���#��JH
�O2Škm˶��z6�S�s�	��x���o���]�ο�����d[ժ���sw�c*�n>���}�^�Z�H��nMs���<����T�b�LwZV��-�x����4�Չ����Gu�hu5"��ǭ�Y5�ܤ��42ֶ�G���9J�Ѿ�&Ѹo�oɕ�����v�^4$�9E�$�毦�Su������+�rҙY�ܝ���g�X/5�=_����[�+���B�թ���?à���~��O�5�72'Tc[��в15��g�b�>��>XD ��|�M�<�;5��'���x�F㈋��fv����/=-�>�	EX�|&C~�S����M���kƞ}tOK���}���ճ�а�m�<у*�k.ֳ��kC��ط�����N��%+}���Sh���(��)i��n)7�\��lP����)�`,�S��m�������b    ���ilC���1gM��'ő����ث�隝����J?��1Bv�z��ƴ[�ٖ4��B�m� �J�X�v���)�?���9�\ӏ���L�ͮ���G��-͵NWݩ��K���'/������g�Q#ڎ+Nm3��B� '^�
���d��	�?[nɎ�z��Fq!���(ʔ1U��I��[2RA>�>h}�-�,�Z�1^OD�Xc^!���닣ѯ�gU;60e���r�m��6��ԭЬu�KU8��jY�и�rKr�#x�f���m�ղ}!�ց��ٺ�a�6s�*	ݶ��C=M��b˛Ӱm,J!hZ���_ �*?�w��2��Zê�Kث�O��%�Wd���`��	�Kw�}{��s0�8�^��2�%@� Y�Q�#����u/p+�J��{���.V��@!��|N�T$J#v���'!�� ߔ���Ƞ^t��~�aC,^�k��Ӛ�؇b�x�2I����6?Y�ܷ�n Yi����=����f���K��(Mϭ����Ǜ��Բ#� h{���s�&t�j��;.&j���Ct+-���s'3C�+l�s�?�\�Umo;ܦ���r�+�� X]��^Ǯu�V�b��\�D����L�I'�i�놿9�j����8a�z��
~L2@��_��,KA!��4Au��x�Ź�OqA�T:�>��֜H��Ror�,��j��/
��,�I����[�jN���| �����VӒ�vC�{Z����5�"]ɧ�u�{A���+i�6�0�:��veRo�a�4��Q���a�2�o�ɞ��D
��3.�T5�}K.��;��|�ƴ��Wj�Zg֏iEWgK�S
o�����d���8��>�'��8}�wg�<����4J���] �_$���b$�hG��gP+�e��9�%:ո_j30�f~U+C1o9�J
��*��L��1{'��۹�P�`�4�+���N��(ad�g8�/��(���=��s�jȥ� )�x�y���$��o\�3�����{�� fc��&'P�ݭ<l�Db���DA_�p��8�*�(FN�_�^d�����	�?=�Ч�xۣM��JC��#OPy����������(���.�ɶ�/�e�~^��'G:��S�X�x�GX0��%��L��a5`ǥ�B.T�7!���"�[2����5��G�2P�3E��{eo?��Z$8�?�Ym�����ڬq�N׻��kR�T��8}��G`��^�������7]��k�,$����c�5i"����U�q����mnPT�\+4�b�����}�`�~2�,�?=��汥��#!��4�4�����Y=��2�'��N��Q�7;1�-�,!�^�Z���:�R&��X��^T��^�x�N�Ⱦ���4�9U�$uЋO�P�c7b��|RJ�vÓ�g�r� �k���l��.+��Q�����8-�x@'�\t C$jRHx��;����[?�5*PgQ!R�<d��Υ��#9G<q��̮�Q��H�'��x��{/�cwz	�
yF�1���+LZ{�D8N��k�����OT�#!)��?��:��>܂�G9	)�x�����*�i6`���g'�I׶���}�@���S��|?�TԪ�rkk�3c�R��X�Xn�C��,���B�
�[�Q�.�r� U���*ʵ�h���;���˪�ʂ��~o�h�3��b���3د��!������6f'i�D�`����G(�����騒4.�A�ȑ��O��FK4���m�B��f�b0|6�{(�6ABS�\��su�]{��݀Xm�J	��_}�������A2o	�\,4�������՛]��4,�Q���� g�ϼa�;v�1��#3���"�+�i�%�5i�=�Ʊ��K��ۜdl��� �ʙ���"��xvR�<��p�X�ـy'.��G�X���Ƨ�x�_��HM��o�����h_��WH<�Y��V��ǝΔ,��?�k��,�k����nj9�;�oW툫��N�JP�t�gL�]�|�In  !�ϵ�@���5�Q�y)�w5K|'�I.� a����L�`[g���0��$\��K6=R̾��E��^�I�ޭ%l5}l��0Y���:�k����˸�pbF.���jޗ��?h $����:�8�[�!���O0^�V�(2��}~�{�6��"j��'��Y�8i�u�Gk_�y����-�����p�|L\"�- ��4���\T78���V!�db'���Io#5�n^T6�9_pQd)6.�eP��7)Hp�J�\'0�{���7��石��kO(��t:�����@%|��u���%�:¢�D�iXou�^^϶3t`�٧[XɈŬO��t8]����}��(���%3�
N�Jv�]a� i8~�	����U��*���O�o�^��Pՠm�γ	1���X�"�����Ӛ���dM)������u�7���<��dÔ�l,'��H\:^�C��H�)١�{*��^`(>]���%���%�,Q̾>�6ɻ==��lQ<rQ���!����/����V!V\�7Z���u� �a ���u��O�=���#rn��:�)���^Ӧ1�t�� \F���i�̅jl'��Pk�3�o�]�!�#�d���D�����(��c0ܭ^�ڼgm�F׳YZ>>�7|�G �S!�g �6�m3�ʗ�BH�ږ� b ���p�:��0�ǫRB2�cu�&�x#�l��`�l/ؿY� 
�<45&`�7��]u�G�$zj��/xGD�K�b�h���^]#�L�Qo0\���0ċ�\�T\x[��5ƹ<4YE�u�f.9�A�sn���R�W*	�)o��e@�ݲ]�]��T���\����9
G��oG��d� ���d9�Μ�F'�8���<��yy��[vQ,e	��\�BA�vn�1�;�K��n�]�ZІ"���t���7��� r$���o���a{[�˕%8���q�i
�J��(�^\3C��A4�'"dF���Q�����>�^���R)��� �_��nD��}�&"q��ŏ�@i^T��MuYͰl��`�-Mޜ�3iP���kñ���(�r�؝��CC��!�;$x�]6?�D;�ׇJW
6�x�rv���p�����YM�FG M��Z���~_G�"�X�q.:|� sbXZ2��ǃSw9��{����|��D�[6Ca�s0�V��R��x�/$m*IS���{Mn���wp ���2g��d��0g�RJ�8���=%hYlF 4�3�"�$W̑9?bۭט������KX
PV6���2����;2��̓�s.:Y�K�Cs�T"?��,��?9�H��K��TR^f}5���)j�U[�?��]��J��%����E{�q���QЭ�~̞;8�G�E`��P�5އM3�Ǜ��_6-�����j��g�*v v���`���ɯ#«C9{t$s:�=��Z�ᕂR�ṡ x���FY�q���FV���6�k�w*�Qߗ�A�Z��s�>�|Ó]�M��9�;�IB�V������e)8�������*Q
���
�Oo��@[�����c)�n����
	�)�I� qC8���w�w:�?o���+}�W�N`w&
�[�$����dL�d*���<� R�ͅݘY�(c���C��'�~1�����a9��~�2��dK��9ƈ���NS��xĩ�b$L>���%$�H��Fm3�#>�#/�=�V�&$YÈn8�]-��ƈ�U���^��?����z�3E�O/=�c���,F�_A��ϒ�d�冂�~15ٓ3��~{��:m�/�jw����ҫ�� �A�:/(�9�%�̡^LM=IFfZ��ҧd��B�U=z�;6���	E�o��F�&�j�rv(�����٤����q�˒�����$t�U)����t��u�ԕ��%GS�'��u�?�P�V	�֏�r ���!Fp�b��ǿ�tŰ��Ic>ٸ���	=�Tg�a������� �y
��[KY��E3��4_��`�<�b�`厑v����𲚱Jp�%    /���K�	�6�<��N�<6��?�u?�b8Q�)E7TN�0��Z96ֻ�r&TK�x|f�-4���A]��5k2ǬW���|kcJ�*�cDIE�9�(�O��td��2�J@0K�?�Ӓ�0d�s�X���ɭ��3�LsF�	��	��A?6�fW�騽���<�5�\{W�
���X�����9�/U2��U�Mc����hҖ+���G�+ou*;��a�3���y9"��tL�\�+�)=U�tQ�*��[|O�HcT�x}�9i��n��@�����	�i�z��_���������tm���]j��p��B��#d�R�0&=�����g�]�V��»M����~{���S�R
ͼ�p�o�R3'�
�v<G��ZMy8�zCy�3���(z������ht�����ݻ2Mg��^�#ؿDL4�J��܄$��3�BPm�u�3�h�.(���X��<�c?N3�hRM�p���GmJ�c���5�uJ؂{(yco��;�Ϯa��}.W�Ӥu�!^���;�1���*��r/��)޿H��bà�@���n���Y�������s�!?�\ږ��I\NɿLo߶%{�~�xr5nD(n�>��R9�wO�{#'�T��F]?1���6����h|0���]u�9@X&Gw�OFA�4k��p��X�r?����(27�9�*u�[e�pq^�
lvI�)J2������E�&�͍���a���
�ʈ=��{��.q��&��vMN��4�nb)͓��d�s�M�˸S�Xl E�RIu\1S!�̚��ǰ��V�A��R
��V�V�"�w����:�,?V��A��'���|*o��\�뛓�S���Z]L	m��J���?w=���=�Y�6o�9ڂtmϖכv�N��ƺ;�i�.5�e�-���V���$6�ݬ=.� %�,�6�+��ى4_!�'������P�s�L>
�=�� ��`mR���豼�w񦥋o��S���ż<exgL.k֚�� N�+�R���V�?ǔ�4i����w|�\�G�
�:w���ݰ/ڦ6mI9�Eg�Q�.�}��__fy���bf�6���AbNv݆��v8E�`�I&������9�W��O��h�ڭ����� ���Ѧ=,/jTi�\��6}R��&��z�[_8U��B6(�&��_q�[)2�M̈�[Rf^-�����N�V�)w����?ǃ%�N	��MC��s\;�q��^՗�8唂u��z	f�v��Y��s��5}���jD��!��@����SPI�c����<�{�.�y^i`�]�|�OW�3���kh��ɯ4V��&i�;-�]欣P<1��&E���A_�U3�ڟ��l"1j	�0�4�_[u�G@����o(	��>�ڞ;NſA�x��?�ܙ����8-�'j�0J�	��,����(@���'��]у��d����"z�8�ylD�
>Ǟ#ܞQ�ɃGޢ��館DI+ x�0�7�u�_���l�����D}�'(DEx���l�-�1�vgM�\��G��CH�ܙ��#)��s�{ݵ�뇲���?�,�(|�2x��6�17߹����L\N�<owx�$��\G>�cA�I���B���7*aA�n��\�y�.����#.��/k��_B��T�5'5�_g�+Q`��>�XJ�ן24/�SLI��2a�ց�{����8��=�lLn�nbҕy�y��f���d�W//G^(���ְ�W�Hu�/}�����P���"�=MB�{��sW���MHĭUL��t�7�d��aM%/!:*��7U��կjN!�+U@��dzOx�d�)�Uq>��Y��N\R���]o ��J.�����҉{ڲ1>�s�'d��d�[H]���S�#i6�B�p��-������H�Fwi���z��Ŋ�-$�<݆/U+h1g�{�9T�ܳ�~<ߵ�v��+�
���Κ,�/��/���F�钇Aꔻ���C��(���2�܋�١����Hx���&��C&o�xm:���dK��c�f���@�<��;&T��
j^-���*�N�*G�A}�( I���1{�a69͘���W���蕊˳�|�zd�e���C֛mF�B0�u��(��͛:"�qS������\�$��;���h�@�]�Gyj�B{�s�S�~���P���� I�u��fB%�ň�T4R.M�������]��n���4̊3���bُ4��b�rc����q-,����̖?����3v���n�Z��a�N�ر,�lcX�,��U�0p��:
�öU�[�Vc�'(>�cy*����m�N�XKl	�`��l����(A�s��a�D��fMF����ZYo�K��>?����䝊��9�4z��p��DV!�[��J.�\�\[)'���3|z��Gt�yti<���6�d�vN�,���^y]3m/ (����!������gv_��3�T��ZA���4Vx`�A���ʅl�B����3|N9�(��Z_f���JF�i� XH-41
G3�ϩ�A�gV9�7я�'~(�*i:�� S�3tH��/�"ɬ�ō~�U7M�<��:��~!���p�w���P�=�j> �ۄ���:����tyY�j���θaH�~"�P�� ���k�pB�0V�lǷ[�\�1H��|��O��LԖ��tTE�
-��Ld��r�9��p֔�`&�$�-��Y1M�FHꦘ�WW��`?��Y2+	qV���ӯr;��c��jZndz'lQ���j*�d2�$|t��[	w-�,nau��d%��H�]w���`���N,7�TH���Nxz83.��Ev�r0B�w�YeC��r�Q���]��e7/���G�R߉�f�m�v7L��>�X<��c�L�.I�u�]~�df�ۭw���␴i2��+�iq���ۇz��)ӽ��a,�y�5�����W_��ju'J�~��\��l�P�`�1�P�7V�(�);[�Jmf��V�Se���O�ܑ��{�Ԏ1�Ӌ����V!�Zpa����U��i@�e��?1���]�uϦӤ$��)��(�\�aCj��0���$�U~�Z����c4CRJ
 ��%��x�ǽ�d�=c�sckʶXA��꫘=H�D��JX���Z]���a�A�W}��4~�I๱_�bx�Џ=7��T�&��|	ͼ�"��e��'���D�\)��I�*Է_5�==k����m@Y/�M]��
5�vY����}� }|��Q��
��]�|��S{�.�`Z��AMLL�F�\���H�=MGT!`���k|�$�1Uk��R(����J�磁�(r��6����́��P�ܲ*�ڻ��6^���ImP�H*VkI�Q��xmQo�T�\uD�G�"�98=���Ϻ�Ӳ�t0�O� �E�t�]�2b�̊*�Y���%χ<PՊ�Wz߷�VW�������mLcK:��:���r"Bc�a� M2#��n���I~�z���6m�L��7ܹ����\H$��v|�$��VsC��v����)���#��Y�I���t\j���7V����ơw���3��u9yL�ݩ�Bgt)�=����y}4h6���f� e�|���d ��ҙ+�MgEn[�֠},^ �=�ޮ�F��\��ti��3XK�ƴ����>�[�j)L,�+�9�SN�G�\+��#�F��'ø��}sm�zF�ٙk�JE��a}�e��N���t�Wm^i���Q۳��d��d�~%�� C���`^yku�*l�-KV�"��J��BQo��n�_z�c�6�]+���A�����j3T�~��e�f>�I�G�`B�ێ^�m[�#���)��\�Bގ.|�P�}���5�,�E���A
9 ��~�zR禦X����s��R�$�����:[�>l!ձ��*�Q�;4IQ���2�z�!����`$j���
Yw�S�_��8���L�^���Z��)t]�,���-{���D�}S0��io�?j�ݏ���\�WE�V���W�S ��}`Q�=*��Cm�.��SPU4�j(D���Z�r��;F�%=,ޟP=4��8�wD�Eg>����E���)�ie�� "  H��&⪥�Ϫ�Bʕ�"Uj���k��{RhՇ)�e�ؒT|�/7�Ѹ�rO�1� @,�oơ���X�k���v�MY�<�{hd�3���Թl]�B��龬NPr�7����ru��jggQ,N]�F�̧��͓'9�����f�ጣh�c�-�� Ȣ&n$�%�=>4����9:	F!�t.���^�;wCyT�=$_�q����jzl�7�Q���^�DD���I��(w�	W��$H�����j����.�%	Ry<����i�?�=�w��b���W�3��\�Sz�9��E�nI^_�w��7&�׏�������O�9�O�L��u��UaIR�i��T�Sf�J��sQj��T�rڞ�c�WH����$�<����+��.�r�$٫�}L~��3�;<<Q��oI�U@��Ǔa��ݑeFC��­�c��cʩ���E1�ɫ&�1��[�%Vȱe��4g׼��n�P?���j����`�S~b�-2�<-M�����}��C,t1'�;�~�Z=.������R����<��7�Z\EǱ���=����Ay���B��1�'?y�S>m��p֕����:�P q�VAP�Q����i����a����l<1��g�'!K峴��?���9��q~%Zv'Ң��M���!q�r$��ᵁ��FF� �veK/�tQ��R�P](���7긾��ƚwN��e�>c����g#A/��#�sˤV̯�y->T��;?��OYL,Ӣ[�4��H=J�!q6_!���l�Oޫjg�ԣ7��~�c/?��'��o��J�k������%��[`kl
�(� ��^̖���7c��\����1����V�)���[��A�ѥ��0��7h�4��{a9�v����/�I��~��\�a�狢��zx�Vx@	'�d<Ð�Hgf��;�3�8,~�p�EF�����q1Ƀo^���bɈ��[��<�*X3�����g{���)U/vW��R�z`���:��,����Q �u�sQ\��d�G���8��=��ud8���k@Q����Ir�;R�E�&�9v�zl�����a�zL�:t�fm���p4�N��qm.A�����%�����Nb�����0j������,��`�����D����Ҹ��=�D�����N�q������AF P׫�~ЯU���r�s��,?��#h{��vs-!O]>�'�>B$�cI�}�Z������
�h���#��<"�g�����;�߼��~ϭڣ�Z/~��j
|��}�{~Kl�ͥ����?��HFKL      �   �  x���K��J��տ�Fw%�Nx�����ƕ	6� �~��VH2j����S��>U}���i�޼�����9�#0�"(�$^)
��H2"B����8�`hzC��QR�G4+��,[����k Nd���jķ�Pt�Lg������a/Nw~��n�c�\��J�EĊ���@��e�ۀ?��hg��ئ'/����H����:	�Z�s�,<ph�!E�n���'P��[�nS��_�PJd�&h�SD���~�'!��u~�6R�-�kl�����֛����M�;.����y-
[_cȚ��I�A�;H�Kz#A�I�.)��Q�
A��t}u0lY01�q�pZ�ɃJX�Y'�����y����V>����Y�-�����P>��IԱ$SÚ�ѢH���x��5pmۼF5V\���K�COX�^�.6��[�M������S�\ք��	XJ������U�kh��l!B\z���xR�-����ˤ�ԜWb뭠�vi�@BgG�C �JNVY�%Ԩ��H�U�j���]�(N�.�����ۧDi�. H��بB�\��N��Y�l�ʅ����U�aVg��rE5{X��>��H�v�3n����D�m��{{G��,�r+����R��7~W��t���G�#�"D��\\�ד�7���A��PE��(��Vvo�pއVH�H��:,��q&	�KT+��;фu�!��G�O���{�/�p�ԃ��k��>�!���������L�C�o*
B"��T���R�H>�ޘP�����|�_ԏ��ʽ�S����I�~>��=q��/.�������>&hX�h^$��$.j�4�np.��lE�wW�t�4�~�t������VӍ^J����<��a۾v����� ��a�nPg#-���H���)�[F:Y�w���:i(A$�{�j�����4�V�XVl��F#_�n
��\�W�ʷ5��$Y��5O�u��Q��q����(�\@�`���k�..��9eR��3��g��h-�z.����s!�H����d�i
P�jj�׶H~��LB9��|l��l�ό��/�7𗖑�]�4��}	[N��)X�D�Cb�?B?���MP����٦0LE�π��8MR�lx׉6���̃Z�B��'A$ʃFM���Pj쭽���@���z9:_�qȿ}r��5�U!Tam	����X����v��Y�S���Mտ��	�� 8��9=?=V�JFd�緗����      �      x���K���֨��X?��CSAAD��:�" ��������cuv�U�*���܉�q�F�X2ᦝ�s�O��������_������_��c��f8H�i=���
1�9OB�>��e	��pS!"�}	ǳ��ʝ�2�n*DĴ���{���x��uq 7"bZW/�60ToȽs�n*DĴ��m�����6�BDLk���<��83Y� 7"b��y��i
��wo�M�����/�W�1�(V��pS!"�e��gT����Ϧ
7"b�k?��gֱ���
pS!"�]�Ӏ��Sk��[� n*DĴ�5�x�X��7���BDL˝�G�����W~& n*DĴ������O`��1R�-0���,�������eyp�#Ȳ	p����g�B��!6r�9���
���[R�������?��9	��.��p�,+P�"�>R�I��>�>Cܪ�����Mļ^zq��;'��u	ps�@����3�mwz#����pK<����7�~��M���m�_�[����y�_�04�Py-͚ 7'(���}1o�s�7(��)��n�����&r���S����Iݷ<�7�2����Ww�E�O�Yҷ< n��������eSCKc1��$H�D'���VF/�u����9Y��D��}��/��o��� �,�����Q������k6�$��!�����-C�n�/O���n�+n���D��
K�ť�=��X�[RDLļ��q���0C�ٿl}��z�������oܬ�w]�u�\>Aqf�Q��M��2�_u�����+{z��
�YN��D��\��XZ��%9�n����y\���J_�69j7n�����m�έF�WK��:�ǻ=��i���Zn�
1nQ���}��l���Y�1��95G���oDn����[,bd=׊���Lה��ܲ��,b���9��iT����fE�o{��Iˮ���8�s� 7"bZ�;���M���Җ#�M���6L9�q���j����O�k�c=K�0n*DĴ���J��}�P8�BDL�s�;����^40��
1m�]�6
�;��*v�BDN�9��~�}�Q��BDL;+�I,)v\1�j�M�����x�:e��O��	��Ӻ�調���̦vZ�M����X'�Ly��Z�Ā�
���8�*������)n*DĴ�N��_����BDL������gs��T��iMQ���zX�^ջ=�BDL;�VN/�|����T��i=����0�n� �T��i?���,����������}��z��Z+�M�������~ܮ�ƭb?6�BDL��l���Տ��S n*D�&��.5��,k���k�M���6�]���_�qJr�M���Vڥ���v������v�؝ח˲��w��Ӧ��<���+�u� n*DĴ��X�P-��R�$�M����{���o�<������
�q�:�����f���1r󺏇������J�-s�ǩ��*�rgȔ7�)�VD��
�#�fܥɻ�kp���W(�+�Z��ɽ{���
���_u�f��o	����|OV6�V���o"��Ǉ)3�'Y�i�􀛓��t�[d�Ĩ^_#���p��"�U�*nc�J�$��������D�>9��έ��=�BDL�_!���{F����>UC�Xϲó���\ħs�EPh@?�tb�j���� ��+���ʱީ�4����n���2q��٧=�����:p���Ҁ"VF���N]>�ת�+����W�����=����k5t)^O*���ȟp����T������}'��M�����Ifp�e����Ƅ�Y�h`#����e��������9AP���CK�a��v���h�9^愿븫�}�M׽ʇ%�n���v����R}��V��
1m�l�%d�7m�XY�BDL�_ۢ+7Y5u��n*DĴ��i�	b������^����⣴}f�n*DĴC<�W���e�o*�M���V���S��F+� ���z�%�目����,��
1��3�d���i_7r���&Vn��e�Ssh�pS!"��u�1���QbFM}�M���V��U(8w�}��|�T��i��qe����R�V}�T��i�I=��c����2�M���v�	>J�?���K���^&�ƞ3��&��7"b�~���Q8�:�>v��
1��E�8�*�6��Yn*DĴU�����Xw1�T��i����Ϫ��Y���
1m�umR{gG^��f����J����8���M���v��,���X�ŧ�7"b�Bݾ������47��
1�6����V�c�vopS!"���R��g?��4~�n*DĴ+.�����T�n=���
1�{���~�;��%]�M���v�m=�Ƅf�n3����7sk�i^���7"bZyWWw�N�C�u�M���V��i3��i��M'�T��i��iR]s72"��9�M���6����Ī�� n*DĴ���O���[�pS!"�=ؒsV���%��)�T��iuK����}k�$�M���vP�^�y]q�7k 7"bڢ��pd{q�w	pS!"�e��|o��6�~�,��hDĴ�|��l��*|��pS!"�=��׷���0�E��Ӳ��w�`��Z-n*DĴ��:�V���T'���M����+���[�v�z7�n*DĴ�&��I�F�
�������@a\OO��
1����[��� 7"b�ӛ�\���5cl�M���v�_j�PY[U�s������me�����
1mZ^�{e�W�	���*+]HO�۵r�����
9m4��b�ڠ�S�M�������wF��in*DĴ�#|:g{	7�f=�M���v�Ų���Z?~�� n*DĴ��eaa����
1me�mo�N�S��n*D����>Ϻˎ'�
�M���6*�m�2�5���pS!"����&������n*DĴ�8�}�W�}����
1m��v��wu�{pS!"�՜�c�S����m	������}�z�f��<�7"bګ����8�+0�=�BDL[ţ�4Ţo�J�� 7"b�w����U�c�JK�M�����u�Xo�o�3.�pS!"�u��?�b��񮍀�
1-�uct=��f�rS���F��������7�n*DĴI˝�G7�6{��/��
1m��J�*����
pS!"�e��pڰ��jt��
��4��iߞ�3�m�m�K�M����Ş��2NA��n*DĴ�K��z�%���pS!"�uv��u}2���
�����9�l3������n 7"b�Tbm�yV�9�v���f�p�>��oo�n*DĴ�8�᱿vo?3J	pS!"�Փ!��Dn˄�]�n*DĴ��θ���s+�p�T��i?m:d�p����7"b��b��_��G�:~��
1-[ٺ&���d~�����ʻ��u�͒q:�grqS!"��Z�2s���3��
1��I���NպVUpS!"���+wvW{5n*DĴ�6��f9ta�{pS!"�]T����Ų�v�� 7"bZ����w������
1�[�X/^_ck��
���b��Vu'M��
1���v*�4�Ww�|pS!"��Dcyign�΍=�M�������y!�_K����Ε*�̴���BDL[E`��Ą���M�����]�d��.�
����f��$c��ޔ��
9-'�u��.�c+�T��i#�������~=�M�����ﺦ޴��*o n*DĴ��9���.���pS!"�ͣ�.x�z^9�f��ӎ�χ���Ƚ�� n*DĴ��F������}� 7"bZ�0{^X�#�M��pS!"�M��#?M��y�&�pS!"�]U�9�ʶ(��Z �T��i�r5��V&C��BDL뾏�h��[�}+?n*D�&�Vl.Vw����V�M�������>�-q�g����Ӳa��e'|k��y� 7"bZ��z��so�S�N%�BDL۪{����"��Y�T��i���j#���{ޯ 7"bZmkz����0�
pS!"�����[O��I|��M (
  ���V��ᙯv~���pS!"��Ҙs�T��9+��M�����yXf���U0G��BDLk^{�-b�]�fY
1��۽��V��E�pS!"��WY6�����r�n*DĴY��r=�ھ?'�M���v��t�^���}�]r�M�����4�[��]��T��i.W�7V߻�#�M����)��w�o�ۣ�M�����s���^_XpS!"����U{_Q��;vgn*DĴ�Cc�n�f�L�pS!"��y��<�$���T��i�Q�bQiB�=rpS!"7���<ɷ���
�� 7"b�2zڛ��<����BDL��j�d�a���m��T��i��|���lւX怛
1��U�~��,8oi �T��iw��)|��Cz���qS!"��>�b[-�u��� n*DĴZ�ǰ\���y�M���V|��0Z����Z�T��i77�\sB'ϗ��	��
1�����;�1 �T��i�˴�	��j�<��BDL��Bfi����������r�I7᰹�u��n*DĴ��z���y]��w�T��i7�]P(K�t�$��M����jI[V�+�.��<<n*DĴ{���sgﾽ�U�7"b�����D٫� pS!"�}G���O\�~_~���ʚ쳧������| 7�Pa"��%��"�>^|�怛
1����C��TA�����F��:ﾟ�i�����2��n���N�'hL���ADL�O���ۇ�N�M���V�ؠ���<F-g��*��BDN;��fܧ�M8K�pS!"�m�<�c�3>���9n*DĴw��{S79�X��BDL{�ί��)���}[&�BDL��|�ǋ����pS!"���5�������y�M���V�;dC��E���T��i��ٕ��7��D<(��
1�=\5.��WR�?�M���vV��T��$ȏ��pS!"�u'/|���d쫟��T��i�I�����*�<�M����	����6�9��?�gq� "�=�c{��g���c�����zh�cak����
1m��[U.>;��I�T��i��u���)���|j��
1m���n�/.��}��
������.�z��pS!"�=?�4*{Ӽ�k� �T��i�>�]��$uyb� pS!"����S�$Eq��}�������-"�sw�n*DĴ�YJ��u��pS!"���f�f�||پ�,��
1m���Hz&Fz����T��i�2���StH��qZ�M���6·��]�O��pS!"���ڛms���/��pS!"�=��N����̀�
1�W?�����bx��BDL+v���k�Co�7"b����5�o�*���؀�
1��4_~��Y�����7"r��������Ĳ�����K��o����m7"bZ?���/��w��BDL�=�R�+�Q��� n*DĴ��V"����jpS!"�eNoM�<��������ADL���JpϦ}��3��T��i�N����u~5����^��X�ǭ�ĹԀ�
1�I)d�v~S]����T��Mr�)�Y��G^��pS!"����]x-��bt{�7"bZ�+�͞�+=���
���J�xSԕ�|7�s�M�������ÙuN�����T��iu�u��:)�{W�?�M�����O�\8S�w�T��ik��ߍ�{�4 7"bZg�Wa��q�V� 7"b��A1���Oف��k�M���V`���O��+A�7"rkk)��<�����C�T��i���y��NҶ�T��i���ȶﻜo��A�T��i���]%�E�������V�潼*�Q>�m 7"b�K'o^*�震Z	����w�?����er\��
1m���R�*s���ӲY5�Fj�9���pS!"�Uo�9����J�n=�M�����J�~���͝��	��������Z�W&|n*DĴ��q}�S'{{��
1�����G�{��Ou��
1��"�=u��Cf�M���6��i�̅�?�T��i��<�S��_C_��
1�b��n�Za�[N�n*DĴoY�̡�����\ 7"bZ�J�~!�'���4��i��^y���ܛ���7"b��;W��vn�q{�M������N/y��։7"bZEc����u���pS!"�͌�\����u��;n*DĴ���o^�IͨO:�BDL��e��̩�@����
1�&4-HWs�k��pS!"����[�	�M����pS!"��<���;M�u���n*DĴ�Yʕ���gt	��
1��NT������L�T��i��}��s��7"b����ڛ��6�����
1m���)��k��;pS!"�M��������o�n*DĴ_����c��h�pS!"�}K����*��-�� 7"bZG��ȹ���PX�'�BDL;t�ӿ�,WZ�J�n*DĴ�m,�P����+����>F�Ɯ�qby{�5��
1��b�Wf���w(�pS!"�=��t�E�ꓽ� n*DĴi6���~���*i���Z��j�����y�7"bڅ�������bep�*�q4���W� ����qe��d�M������׿�� �N�      �      x������ � �      �   �   x���A�0���_�P��Q�M��L�@Yj˖ef�_����{~q�hv2Tw#�DCb��.{�q�글����.u��"�8��p�؜DY���q�������x>z��a�������0�>�;8B�qT,T��/����U��/���O��ل�!7�      �   �  x�u�[o�@���S��̍ۼYX6�вV�/����~���t[�/g�I�������߉Զ��ۅ�ϯˡ 1�Am��(#*��-��<k��b�,���i����㚶�����yT�~��o��%\��9���R���q�������(eP��a*"�a��]t����v�j�W��~}���#�!<+#8.��P�e���ҁS�}����^�! _��KbUĄI��e��O����#��Z�N������Ū\�W>O�Xԓ�H?o>ے�a��!:a+#�%�qh�o���0�2m�w}G%�V&S8�w��u�.�ڍ�?��1�=,1�N�t?Wg����J���|�mLʐ2aj#3�ۖfq�5��m̦�;����{X����B������n!�rjK�V��hL��W����� � ���      �   �   x����
�0���oW�(��0=I��Q �ٲek���W������O��m"�dj��VâsZ3k:WBOh���uQ�S�o�;��Tb�O�\�(R�rТ�����`4�ldy�Գ�=�&�K`�8�}��D��|@i�1ߙ���1�`H�FfB^��7�      e      x���钢������*8_vt��T7���o8����Ɖ8�@
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
�?dU��pr�o�w�8��ã������=6��yvgܾ����l3+g�ޒ���X~0�!^_#� �  �l���(J�����nZ�;PB�L?���lNr�]��g�ᝲ�Ҟu]I�T��e����Lؾ+s$��z~��j)����z�c�E�ʎ@��cu8�k�?���C�����F��J#R�_�m�b'�����Go-n{*䁓(9�3-�`D�����p�j�0�P{v���b�c��G��Л:l�B�#��葶�l��z_�B0��Qy��E�Ƽ����Da7�P��ۂ�~um#Dp���i/�t��LU;���Ԑ�v�M���ݾ�+,e�8;�����_+��&K�3k&ܬ�<���Zy��8Կ�俩?sh��穤��_[綤(������S�p!�9@����*�z�udŧߠ�x�������7Tu�|����82��#v�A��.�nnT�6�jv����i�"|�r\ԓϕ�ZyOX<� ��nva	|�W[���9���F+K��dJ��ނ��d�T�� S`:0&�� TC>�$[Ԟ7���类�񩧾�B��Å[�q�q:�"
��6y )��`z�)��=q�Oo(k58�(�L�f���d����;Wē��=������E�I�4�XY!�q���<����.��E�d��<�Z�� ܍��ၢ,N��eN>*�S���2�%@�2qd��Y!_E6dxd�m��p��������;�� 0��o�ȟu�Aꊶ��7���P����a��r��(B��2Y�j,����.E˹MA��=@n�b�siK��봘���͙.�@Jat7���>���,�������\m��\��(%���he2.M�~��X�������j	2����,4+�!�]�7��@���;B�ZS����')�|\5�6[�84����۝���ܢ������DV%���V�|
�����A\#��)�X1(w����-���4��K���(5L�      f      x���َ���6z�
K���K�����3�1`c���I0�h��h�þ�}%`gVfU�?�	-������"��y�p��.�Mx��c�?��,`8A�c�l���N~a��p4���������_x��/wG#*�l㟎��P:����`���")��t᯷��k�1Q�_���g��#b���_�%Vye��?'���jIJ�6d�<&f8�o�m>&��ʊ!�%yV��7T���}n�cm|�M���?$<�F��LZ����U���rm������fe��C3ϊ��z���q�T�/�R�y6I51O�7�R\�:Y�&^Z�-����:���*��N6g{�̶���qR��iX}>�.�Ƴ3˚�5��M�C�	 ν[�KZ����"�J���z�e�q���Pk^�X[�)t�Z��t(Y��=���:޿�Li�9{��H�Y>�P2�C���+�!��C�q�2+B��2��K��Z��[n��s�V5<�y�_^9�65d�"�F����U
�`��'�2�j�R2�*���%E�l��y
/���(w��޹S�����W�<���kTr!]z�ӘV����ԡJ@�s)u�j��#�2��E�*+�"�����Ov��纼W���K� �uQ��2����:J#/��x��Ҁ��x��X=�"6����a��w��k�'9�ܛ�,�lz�!d�����6+bw8e�D��ĩ1�y&��@Gi��xn�z�c֙��ݬH��M��A�(�V��UwT_�fE��1�<GH�jp����a:�Z5܅J���>\\�,&wf����L����L]�$�p���<���K����a7B����T�vs��B3���W��4g�Se�\ozr�R869p>�td�y0n�<Y��.�o(�	1H���
�,�ꛉ�ǽ0����1@�������1�Ωi|9:^��#��"~'�u�(�'�����-������Ä�	����yE
����?Xx -�R�܃������B�� �oZn���;�$;����$D� �5T8����8y���;��a��Q��1�
,�Kr3o���[������k�/W�ʎE�6�&k�����M"��T^Μa�+����a�u�Q�*Vu��,hk�4�bԞ0^	ʈ��s|�����!�~H�����zeЗ�����|�F܀�Ӹi�K	��3
N���f��_�WEQyJ���Q���
�
H�0�d;�!N���p��7w�̒���\W�X�l.�W�o�(�� :A�Ӱg���s��+�o^Ɇ|���^Xz_G���\�M"�VCAA*$P5çY��⒂�����������-½���W ��&x��w��X�vXY���=����e7a�cG�R	t�9�N����1t��,|#����;{v�s�H���_����4�8�~��	��)H�1p�2�ɾ��^��*��p��PB�P����:����hoHi7Jt�GYk����E��l���7��uy�����iG�;%'<���&^�a�^ϻ��a��s�s�L�$�zmf��םk)�;�v���<aQ�gZdU��j�G���21��/ƵT�v�z#E�}y���xԃkx�x�B�>�JQ_?�OC�L�,�EzF	5)�
�+8\7w�����+�Cݨ�;���leN�&7��uyQ!�:��?���5bV�m����#<����Bw���[��������e��y��������#����%(\/�3h�1j��n��h2��"���_\�w��)����0�p;N6ƥun�N^x��{r1���B���b�K˷J���D�g��M.>¾O�2�o� ���|L��9\���hq�*��j�-8�dJ-�A��Q�+��*�m��~�j�>2���'N��T�����:~�n'q�!�+�[^ �(( 5|�ݽ8np_��\߸����ʮ^�b���N����p�oC�s���>"��!��#�	�\��i.��n������;X��"i<�N�����0nsi��@���gs��5o���	�~�UI������&j�.��<�C���'��eZ��l'F�b�h<B��*��l�<�B�8UsPͻ/�_�b�~f?����:'�{��y&�r���PJ��i�Go��&A�{T�˪��W//h���'v���%と'��tt����o������A[����~d�#�9��ܵ��O�%Tdv{/=�S����]���Yޢ��(?\�����a�͙��Fd�/$��il��z`V��l���Wb��7o��U�l�f�1s1	��������8~��~n�m�e��x>���A�������_�=�T�ʤ��f��h��
��NU]�9�Wu~]N�`��Mu�J't�A.��8�����$B���ejW����+(�jK�h�����1��]�m≈L�zvǒP�PP�vK۬M����Ѵ�̰�(uר_`ݠ?���d ;*�x&��lBO����=��K:(�ł}<�E#�B�����'���<N�2M�Rη5���L�N��xR'B�4U�x
j�f&z!�{v�U�{�@�����G-���!���;�p������dX��Ź.2�v��>������/���n$w~$o�FF��; �*�ܯ����L{�g����1��c�HF^�n#2�2_�;Gx�k^�}���U�5\�1`��`(�,�Y_��t3�]Juf/0gKń^�;��b�`<P�y�*+���;R؏����+u,*�{�!�{��8��d�e����a����.4�i}���������=8��t���MÉ�F��\F��͵́]�N�O�1%;h�X	��Pq\v[�Cw�dA�6���Y!��憐y�6�ʄ�����!x�z�a���ѱ�'���H��H��ɛ C�$�-:꯲q��^�k);eG4�CSp�.L��s{2�̗�D��M?j�b]�)�N?�V�4��h9�v��4P�Ct�O"�#��Г2*o(/h��s�L'�����ي;�$�ȗ���Pb�-��a�9�������t	v�6�����1�Y���kա��E���&[�C�:I@�t��|c����&pA�3|0���4ׯ1�
%ꫲ~�~��Yz&ͦ:?M�Ӌz��!x�w�9.5S;-ɟ`εB��&o���x��2�E|�����p��t���eG8���������]ԏ����e��<�=%i����_�<ή=Iś�"�|u����Ȩ,�V����*s�������Ek�>-�m�6� hC��İ�:O+�#��*�P�2E�|d,���2	MYMw��	�G�a�8�o��ǦS�:�p�='H!�����\bnWA�E���fQt:u�ѣ'���!�l�q��u�p��B�s���`?�+��\Tgҏ� ����zׄ��2LT��_�U���#��ϧoΊhTzN��9��=M_��}��IH!�q%���-L��W6��t��N��.d�y"7.�9�ƭ��d�O�_.����	v��-&���\����"LSh��c�_���zΦ{"��ͻeu赚��(i��4��Ϛ�M(|l��u�l�v^Mv�D�YPJ�2�5z0p���#�x�9Ke��EM�>@x�Bj:�����r'�Y'T��꺾.���tn�[�Z'4oް��ͼ���.�qq�JN���ug�N/88"�,EaH�����,�{���;^4����:����Yv�w�nG`>�{c�������.jq��* G�������Y���ϗ�:,����R���X5B&����T�8��*�Qv�}݉yJTU>(��~�n��&_�{�S �(��(���\na�uo���� Я��ӱ��I��Ct��b���<+*��z�c��9��!�����yV� �[jIT�vd���a�JjP��o�MEb�jOK�Г���V�H�=c�zA���*��{_*kk���BF/��]F'�E}��?Z4MD>0G��{R�?�R�Qi�D����6KM���x&Vh� ��9���ۄ2���W���0�    ����-��af��\򀉆�e�t�D�S#��6k�-f�ϱ�]E	��(?��v$�4w<�q�b7�)�j*��Ϟ�gIw�<j��R-O!#QEm�
��v�}p��[���5�\(T�UPB��L�H���C�\f��-�Z���O}ϻ���}�>r��c�G������䓾���UP���@��j'=ń��Eݤ��4C���w>�ve\�vi��T]��ʢ@��Ż&6s�	A��ѳ�[�]�V�f����q��͛�v��^Q̳�Cϥ[;�� �F'ԋ}]��� ���S5�Y�WgrB����sZI��.}�܃��9T��cp������-�Ч�z~�ס���d���cy���2h�եKh:�#Spi���c~��Fϩ�7F��Up�EH��,󺀿	�;x�N ��G_&) I��T9Kvtc�����6���WE������c�6�5C� ~5�S�T?:���s�t��uQ��b�:p�S�O�哀�kj.P�]�۔p�DX߆}�n��ѥ(q{����G�˫���	��ax��Q����k�Eh.�����ţQ��%�n&q��ʬ�h
�_y�F�/&u�U�š��v�P��|]/DS�w��7�
ߡi;�K�*t�y	.�'�t�"R7=��Ab�e�*ӄ.��k��HM�� ��[�A�{��F���YewB����������@T1����n޶l��,�{u���$j9ۣemm����<����ާW�0��s�r�EJUo�2Z�Ӌ�l���zP���ޱW雛WY������wGgJ��V0�i9Ba���~���D��+�`.	�>�Pߡ�ޥY1�'�Qw+�U	iX���d��r>��y��;o��Ig��=�pR�p�q��e�F��	�8:��X��Z�Ƿ��@�n�`��m�\�E�H���B(g\��3��z��� ���;)�n�qD�J��I�E�����`B�Cɛ��P�#�γ�Φ�V�9<�<�Q���n�@C�1�k Ҝ��	wk�v����L|]�,3��<M|_丿�XY֏����6]��]�*E�f��� �\�5_ӧ�*؝W
��ţأ��pEj�Qp�E	�/��|8�_�|l?V׳�L�F�jS�ͱvҦƶX2c�2G�͡#��옕�Ǔ憳��W���E� 8o�,�|Щ�ħ����M9P �}�)kι��Y��+���9������p����y4�C#��`؂�n��ۯ
�шl���)��Q��0��Oxމڡ��kgz"d��C�P�i�SA���沎&V^hZzf���M#���)�.��ѕ�1�8&�ac�8�́�����<�����EC�G� �i�õ�����|rڥ[lE����4IT�[^�ڟ��w36����7�8�7�*n��'שa�A��}�]�����6y�n�	�w�py��X
�&9����~���G�t$w�[{�Ȣ���"�Ao5�J�b���TĆ9����4<C4�~U���L*m� �,|1��Q��ph���.{z2��x���d[}Ɩe�U4]CK�-���$��e���r�+��Stv|�to�XTzD��ړ��C�*As�t���ٕ��`��pZ7��}T�~� VbwZM�7��_|�3,wi��/�[MJ�/v������U�?���h.�vS;�l�<n���*��bG�e�;�6�h�䂞�l'lR�V�~�i�RSJ���DZ�����+�v�K��P�)�E44�����\E���3���/Ɣ�ֵ�_��<5$�P��	��!�!�(��m
B�q��B_y��7���I�Zto�v"݄��$	u=TP�n?�%���%�U� �К�ea��s�:؅�2�Tji�p��
ȡU߈�)���n��Sg4�n�N�ޑ�{��3�*�qN�3�&����eR���+�/&�������#7�S�CL(\�ą�]�_L@��![Um�Z���1�,O�4Tb&�
��&�k�f��Y+�6FQ��=�l;��Q���c�A�P��w��͗��8�e`3�yZ����+[��w�����(�^�G�-b���V�t�J?
�,�yb����Rb��/�jc��yV�.;hE"WW�[R��P���0x�i�����l�/&��O`���}N�v��1���E^���4�w��_�Ɋ�3�Si8�_xQ�s�_gmoa��z}�����u�E��L�����[�mMPz�G��[�`�"2j��	��`��ʠ�]!�]xRVVC3�o�
�8�Z��|��/������Ts��o��x�q��M\��?z~N���[:i�p-�E-YhC�jVaգ�_
9/�wDX�b�B}ö�W��^��0�������9���ڪ�4^���&����q���}|#6��Zn/�QAK����L%���~^�I������J�ϗ*z9Ex|��X�׉tG�T���	��a[۵�#�fg��r4iP�iͷ��s<'K��@2j�ˍ�܆�ͯE����Y��g���GÃ�_>Ld2c#�+&KF��E?�w�>�t 4���&����x1�$��mNT_ֺ:���ᙍ��4�"�R��˞e��d��oU��rhV��O���5�"q��[FS<��)H���x�tn���C�@�؟+��,�a�2���Ì�m�V�����Y����v娙e��/�)?�*�9Ρkk~[{�ͽ��������{�k�T�N��+4����O����͸ȯ�e��*~4�<S}�;�z�	�ja1,Y�h����K���c��y2mG�ƙ�y��YZ�!�$|��=�T4�����@��D1��vHWM�{b�|�ʀ�ܷ�]����c3�a$�R�|���ɋ�O�I�}yu�����1�K9��5$�'u<�2���ԧ6tDM�%c2����W�bʏ�þ.��|�<��ݜܠ̓l|�u�k8k�.�⠻i��F���E[S�v�`O��q=#)(���@G0�?��;��f�7����|���Ǆ�l�1F���0���g�������;;�X���N��y�m0�*Z��>gг�V��C�J�n�m4F����<�-Ϯ�7}� ���QVB)��ݦ�ы۩@{}���Sg���T�-zG��.����V�ok'��1w6���o/Ev�1`7
8ĎMm�2Zx�	�H��܎ݞ�˵^3���B?�̾N�~�A�l"�5��}�dQ{�{ԩ���n��^�w��|6���Mr{`C�:�$�r\�X:��nDɧח:>�Sy7��Rc���9���5���k��y�5y4N�d6a^L�i������Ջ�KYw�Ė��u�N�ނ��Qק��x^��>�V�)BQ�Da1�gw����\�!��?x9���"2U8f\�1����ޞ7�鍲;��lc�EſjJ<Չ�u����47T%T�G���|*(ε�}������l4����U��K�#�A�vE�_������V`�[oKS�
ڈ�r�K#����}�nʣmw}a�D+����������9#���^���:��&6G7ԋ��:����s�K$������נ�E/���!됰��FO��E}.�x��sa�6��67�}Ⱥq#���mD��dv�r���t3I/
�"���w����qI�}L��5�̹
ޑ����h�o|u���y~��}޸�Ga����&�ˮF�`�����$�������S���c*O��ɪpLXq���>VR�ȳ���h����lM)��#�Hq����_�v��Ŕ}Pέ��X�G�$�u��M�V�~$::qQr� t�J�*�h��Uq���P3C.���z�e���P
uYG]�-��ҳ�N�'�c���o¶�����5Kܧ�fL���������}7s��䭉��=��B>�o�\�ѼVb�=�:����v���vc&E��m��*Ƶ�)�qJ�V�z�PJ����T���>c��1?�J���M��3��N��w@�����0���	�_^�Й��Ȉ��F_���sP��y��-Q��8M�EI#�T��>����K삩�ں6�u����Y~o�+1�=��)��#�3!�:6�z���     [�"��8���a��mm�]7�P��̶l������yi{jӁ�urk�O�I��RQ-�\V<*��Q��Kv��KqE�`�*z>-��+Q�H̼uq0�+%+�)�z[���#���b�U��"b��@>����邼���I�ɼh��q-$���/�������iWk*�ұ�P�	1L@���/$�<�9o����(�v@��iJʗ)x�qrdMC�ĒX_
���	�@�C��i)Q\���ȏ��NFms���lEDeѓ�eBX�)I߬BM%t�c�q�5�~�ŋ4�#"GVy��� �����쬪}�onx�h<�*?kqz}ˁ8)���q���P�e~ٽ9�2Ð�C�/�#�/�&�C��v�j{���Z�?jb�^��dA�]������ǽP�Y���_s�q�QΛ%��F]�&��%_&`S�������5vGrA�6hC���Z���-�//�Y�gYZ��7=j�O��������azM�W&�ld�ۋ�E��q�,
t�����8bQ
Yݾ0�����d6ڍ8��7M=���}�'l��!0�W�sT?�"�]�T�r�k�^ Sy������{Z]���Ŝ8Jf������Z�q�t��T y�~rsUp=r"]Iy�f�|�.n�}c��:�o�"��s�=�\ͧm�KN���9��d�P2�T�X��}�*��3�5u���ʃK�H/�(�!�Q��SB�Gfݜ�i25U���C��#�z��uW��@/H����5N����;�AY��wh���ˬ�T�k�ϭ�_�"���u�RR�������Љ:`�����НlDV��w)��D�AiG�lP�Vj������$5���۝d^�� ��'w���B���h�����~)}N�vL�=A�ӑo��9�ނ��C���:@��`�7�ɧ�Tu�,��Y���܉X$x�ϕq@[�e�O/v��Q�LoG�֜���IGq!��΁ح�K�f��F6kTw�mӳ���kkD�i�IW��4(�1@�������>�e��4�d��(C��'���=�9�/�eR]G�[�}{��!�-H�Ge��oЭ{��}y���Z��(����{L�D̗.�梄S64�2G�▼�z"�c�M͘��RI^0���#�ܱ1����/h��6��:�o�Ǌ��tG��¯hժDg{%B4`����\�|=Q���
ӣ}�O/�6om����Z���/�u*�S�*[Y�|�9�:��ƾr哙o��М��9�G��3��5���B9�]���VHE��i����xu�.�1'.��j���A�-���&L�.E��)Gdlؗ�7���Ѿ���E7��{"N<�p�����P�;�mh�#��a��iz�],���%ok�*��'=��~�$�Q��ca�,�̼ �f����s�������v�G͞��_)ɽ�n�^q�umG�Ӝ��Ւ*҅��;֩�%|�j��wj���+WB5������LT�bM���$w���t�iXt~!A�\�uF�Q����wk�]·��D7�I�� �K=~.K}BZ��CM��}����6��e��Fp.����l*���:��:FCw3����Ru��l���j��$[��y�Y��q�F��n��|��|7=�BV`�$�w�/������3��s�ڢ:����%RR2�h"St�~�f�R��۩��N�f2~p?�Ӗ���S]���Vz���n�1oOI�2Bi������g?G���Wm�y4.���8�k��1�_����1��˫+��g�59����)P���U�h��p�Bb�����ݖ���h嶾��bl;#	�:��xƯ{����}���F�@�����P�^��D���H�M�v/��&�ʤ��a;��_F�Me[m�E6��/"��g��njw�A�vI����f�#�c�(ˋJ�E�YU��D�,����
��e����5
?ď���9� D��f�O��� _�4������ֹ۱ �sb,Q("	²';y�u32M�^�S����\���1�s�ȫ�m����49�S�a95*F>�z�h�F�}V���%�۵���R2m��A��oխ��vτGuASv�.+ s�.2���Ku<��TS4G��sԷ�Q��۫�	�X��+�JP�����1��v�7���Y����rf�%,�|���On��N<��r���$��4�De�>�7hj��l�U�
�U��,�SU�\���7ϩ[O��D"���U1=���/P1<��?�f]
*}�5��a˞Р�X�Wy�]�k��l���8��ކ���N�T��s>��b�*|�`�$Ӿ%o��~.����Z1B�\�)L�8��.^/�y%2��P���Ϧ���9:Ku�{,�&ZYez�CVm0���g0V���iI-5�@�3ͮ�m�"���ywz��ggd؋:�<k���������2Ϛ"��C��E%���_N��6�l4�
F��ыb��G��Z�l;��(��K�E9���6n�څyR��;1���s�n�J�YHr�d�f�J=����CQ�K�b��"8Y�9
L	����eN�.�����p�C���8�`�f��⍿�HhI���{wh8��u&�̌�4��>�\ub�,�ꘜA@j2��Q�����T=W�X���Nt;��׼t��Z_^��]�]`s�ܨ�@��P��rS��è��ע�/l�����eo�J?K�:Y6Y����7�IG�������۱�<&��F����_���9{<n�Jդ_�j��� ����)��M1������mjU���5��2u�T\4�<����x���c;Y_��C#�m:ͺ6=�t�jU]m�6�(����ϊdؖ�=cb\�%ߟ4'���+j�G#p��Œ85����L�>�o�^u����z���7:у��:�f�����sa�:��~�|�@�i�Mhw�4G�p�U��a�N�ѥ����:���iGKK�wܶ6�?�6��(�%>=��A'1밗�hñv���~	�Ց�yq�ɹ����3%x�(@�����R�y�q�J��:������lue[��%�O�#¿�[Vu��l�>��+�4����n�}cs��(�z+�ճ2 Q�a̤��Y�f�P�2�Ԯ��.��LV�w��N���Lt�Oj`�}6�<:a���0��0̘��	>P�kNd�o�Rc��!}؃����x�}�C��$��_������ř0�݃�Z8�;�{����xI�w��f�3C��]�>:sg�E}���_З���T�U��T�����G���&�sH��nR��f��i�ή��ױ@���J�\/z�b�m��Yӵæ[vVH����m�Y�f���ur+G� �%6�*	-�o�M��-�ӎ,p�����*J�eǣ\�h��Q��N�4�t�&�N4�+3��9�rP:֏ŏ�/�?�����.|��B4^��Y{>*�S|�l�2Ţ�@���c����4�=���p�Z�;��F��t!���@�1�K�[֎0�Ќ:{�txf}�'r��6�T���E�&�^����k݀+6�ceekQ^QXb����~�)H��N6��A^ʷM��X4z�e���D�%�j��l�'�U�4��������yή���]��«h��M%�\��;_2�ci�sg��!h[q>+�n7d���_)��3�5B��]��N�m%8�%,oD��(h�m�R�mᗗoDlm�����(������ѣUۆ�-���x�`F�-H�u�Y���;}�	��|�s���\4�̗�}��k�I�]y��)8`wC�i�x����љ����/�����6T���s}�)v��e��$�������#X
K����B4R�fY׷�!�K�x�������d�}��ahQ�D7&��vQGM�}��Y��10�E�ښﶧ�+�q3���(,J�Mp+�32���WEZ㵠zo��.���*f�u�dq¢�̞:�T'�d��|^����Q��N�<�y� S�&��(ط*V����(���zej~mᬮb4��V����@>[	!���H���q��=�ķw���FtN�j��!$F=G$Lj�]��U,�>�Q    Y
��K�o��d7q��H/]�S��izrSq��&�s��(��o]�.-��y�*�jOM�RFg#��(2��s{�*WӃ���L<��]�-���'�����t�Ht���yB�<+Iߧ��K��#ӭ�[U��:��d1K��ڶ��+��Ies��0�#|o���b�����a�\6�����(�}��?��m!_���xQhs^�h��7���KHa��w�O��ԧ��,l�J�;79��c�����`z�"��.~Z������������Ρ�`���ۛK:�D�u�?�W������R��,��k��5ZZ�w���ٞC�_�v�i�?O���v�0�W�>���j�\�s�j�IP��{#Q�*�;XwL�j��W6����jط��~����jpO�fGT�����<��e��������Z�(�
����1YY��:Ÿ��/��d�s�,ek��e�%n�㵍ڙ9(\P�4.w�҃�n�S���h>_���~vmve45�"y#,��x�_�Z����˫/�q�%�P��f�&�u����<_���R4�}�D��C��ޥ���\v�.��y�E��g�:^�=��U�h���G̩s9��&E�=U\���= K���X�&!՜�#�~�5�2�O���Hؾ*R�3a�q5ʪ&t@��m������TyvS�9�CID��	�,���
3G7e�<�Y�w#u�<�>�~.��h݈�r�/�����߸����a��Icüh�m�M	�A�S��㙳�qf�B�	��1H�.�۹���y�K���ߴ1�5�e��;.���Z�OOut��<�*!T��ba��
uA��ԑ_���Aj��-u?������5�xp-��f��H��Tڬ�w4��"���w�<�	����Ѩ�����2y�,�	'	$GD��� ���t�{J��jyn^߶�4�wT�:���,�xI�/hp�}��m�;[t����S��}�Q��x+�eG���t���3=�F�+���4s�~gu��X�f�m����۾���U�!ӗ{��������s'�ܩ^E�du�*rs]b<
��,s��"�~�����(����\�s#zE�ld�M���=�hu��ǫ�LG�o��A��Ŗ��۸ �{��j@Ih��|�	/�[z 4�yPT����L���s���DP�V͒���M��%�?���8[Z��F��Ƀ���_=�/n5���kD��Q���a����/mNͅ��4�i��QK�U$�E���4rW��y�Ƒ���EG��U�y�w����PO�L¸o�Ή�O�5�	�cQ����-O��
�K����ي�\�����#ֹ���棌v�<$n���$^"p��m��Z^��YDəD��:j�����f�#Q��![L�.�e�$K����.7^��:T�oڂ�o¾/����<9�6�����X-g��&Y[�5��5�0�&�&h��{�g3IrKUW�ݷ��*���G�&��;c�ξ/�Ĩ!��E���_~F����aȖ�Xs�D�7<�I�:rktH�U2_h+lK���7%A3�m��?X�k�|n�m3sV��sC�oC�����췡����n�߱���pU���m������ɖ����'BX�C:�cf�l�o�`�����)���IO����L���:k��9l7���&H��b����}���$m���Z��������Ϭ)�	n�d7,��Lde��=�_�r�8�����G\�� ��F��3�+m��2�Ӈ�?�l���[�Y���o����6y��}<ί|��ƾf����kd뎑�ؼ���HCȃ�������Y�&��x?3�a�	C���P���H�?�P���&���)+��-g+)����{x����������z���/�q���s$f�s�,�����o������F����2����	1�G#z�CS�����2�՚�
��7Nd%Cմ7ə-ex�CY��<n�;�����8�r�Y��3o�R��h�P!�qk�1�XC]�xk��k�S^.���6a5 ��0�����^$y]�o���� jm�#l�����SҠ��1'�1\	�m���J9U�`nj8=�����M��M<�3�ɀ�Pl���=�׻Ǳ�8N[a�X����).k	���?ٿ�T�U�/w�Sn��27��������5:�;u�#�Y�<U�ypP^��?�c�V��w���Q��z�u��`���b?�kt	��}��dh�����b�8�%��8�=�]��̓6K����T��y�U[m!���7��T��������V^X[2W�s�
�M���ƪ��\D>&�8�xN��Vcؚ����!��xSj���~����I�5���\3(?`ˀ������<;����|��:9/�3���Q�>ދ���o	
�-B]���Ne�hW��EF������T�8ˊo���y�w���>d/ɖ釭��WxwK ��c\�1���	�p+N]VY�}��~��M�'��Œ������ue����Ӷ}�W��4[���J(�*Y��|5e��e�׬j-��=H;]~�o��B<�g[�{�	����;c��4���iv���~=���3:�A���^P�SVy*\� �`ߌ��FN��Rk��f���S��^_v�	UG3�R��5B}��O�J�b>�Ad����Z��oӥ�8�O��w�4/�;�6�$�:[�ͱR���#筯�wQ�w��Ï�S�Xm�sk��R��?�7�_Xk�:��-�6lXZ�/�M?=o�y�;��y?�����o��*��;&v�z��,����_��@)|��Ƿ圜�!��70Ϡ�+~o:~b��?����6�ƀ�i�gkx���\�x�((�ʺ�+um�	-�!9B��Ρ��F�hw����o��
�A>Tˁu>��)�(^�F��	�~C�N�jL���9k��?ݾ�C㏿���-��_֞.����e��­�j������b&-�����ì���Cd)�=4I^kȷ|ǡ}�k��������0�<g�p6�eso�.,���o\\RdI�`u 9���ru6h/�}7-����G$����gH�pp�o�~亪m� ���c|���e�鳭�}���mQۯ�m�8��L�h̩"IC����9Ԁ_C���I�=����
�v63x�W�1�b��K�����<�J�-Vs{���U��ɳ3Z��]���Pg��!���*�ն <�����	�w�~���'~=��m�"� 0�El|;:*}�EƗ��`�R.C���|����X�㧚�_�$��/' UV��Y�٠��m�ge����֌�C��_vu<7�%{Sx4۩�3�F���s�`D��W�F�`�*�R��&�9"����V9������s4�P���%^�I�)K�R���/&�l�h��:��<9���m���$B����ܲ\[�P���[�?�ʦ/���3������u)9y���r5�f���މ�������*�ps�*���j,��Y������wL��Y5�N�x.��hy
r�7=Q������*Ђ�'�~���r�MZ��SgI��?+�횉g���d����h�6f�=7;�#���&LA���ccfFmG�1,���q��-��oLpi?��?�����I���z��u�EVv�!�#{~�O?�_?���'>���������)ρ���a��A��E�/�y�E>;T�
�t����p���)y&	�>P�)oX�_UQ�3�� "�fPVtV���T���k�E�+/%����Ȕ���Y@ny.��d{��f�\�A��fgs�;7%��2��д�
o�q��w|�����JL!"x�eP5?�k}����!?�0D��?�Pg��L�D�>����u8��ul C)>|rR��ͣ3xD�8tU'��c��Fn���Z���&�J��![��_謎��]�$���孮/��.�Y���H��U����~�3Lxm��[,�ڈ63���D�d�c�=�tT�	[<�,��2g�1��	hS��8���$X��#5��Y�a��2[ ��r}� *  �x������w�^c�r��7y�A��Ȏ_�����j䧦x�.�Tr8�r�F����G4=H�[��<����Vf�⺤��)��w=<\�[�����	9a��@��c]�!�P� �A�a��}Q�U#^��;�ؔ Y�	��;z \�3W/N+UH��4�����7®�'��5p�}QPo=���T�����5�xYP"a�I�0>8�'Sc�{� �n�j�c�x�6bx��햦ޱN�
��@�^�4�p�����S��%�ܡ<�C������f�S���(��I�?�d�#�*(�PqI'>|��b4	�-�4����g8&�P����筕:Z�C��3ԗÿ��eA<Ed�I!$k�S*���� �s�X�M^^�􈽞�Жm=�"��-:zm��С�n=\�߿���h��h����}�}���BY0��q��h��Gv�
���rK��u�s������;>��g��m�\2��Ӱ~���o���P��_~G/��gg�k�/�ފ�Rg�2g�N�MjW�df <�:\s�{jKx�<���?����H�_����8��\��}a�A=�������O���[;8��j`��-���&�*�Z�<
�b��m����y��&{\��M?��cct+@8�5z��
���Z��)q��9�q�����)�?_a{�	�6dL`�?�(DC� ę}羵����7�DK�������9F��ni;���c&R�BZ��`�&��p�-�*�3b(�Z}��C���s�k)� /��;����`� ��{���y�+%��^�ih �v'�_�>~;XL�D�AXY|��#���l��ߴ+Y��V-�gR��S�W�=o����M��G�� Go64�ů ���Ź���g�O�g�w�X�ϝP�I��c�V��S���y���ۜ�p��|�����U60lK���V��2����FԷ��]���o0f�j��@0#���]=��f��o��_��u]N�y�6Kd�E~�_F�}�3V����6D�����v�&�^[�����?����H      �   �  x����r�J �5>�/�T�а��
�Q���q�3������	'.$I�hU/��������gt����j3��TPH^ ~%�}���'���B���ˎ���<A��@a��TR *�%l9�t[����[�(.��#<��%H��*�N,����`�rC�x~��B%�QA 5��E�]+���u���;F\�/g��6O�Im���펣���ɣ�Gʾ�$FU�8����ljΗa�QR�X�����6���t��������,��D4o��O�U��P�P�/��3B�H-�:�z���t�p�	�H��}���`���)T(M�fj��|	%u�K.���G{&��J�s�v���Es��M&@�I�ߟa�H�A
X��;��������q��P(�?_�� 0+���E��qd8B=_�w�Yބ�([U��ٴ�+��S��F��lڙ��F4�@�
*($o���9�ޗ3(�~Ü����!�яK������
(���'��Җl�{[���uQ)��sZ��3Iԓ]ڜ�A�g�\D�f�RȈ���kw��Mn��d�]P����3��)���q�1�遷2�ƈ�R��� =���B��.I��\��@m�^�0�\7/� S�o�RQ��954x�:l�z�.�!��)����nc���t���� �o(�!0�ǆ�P�l�f�����|H66C�Ã#��9z��:@�s�) ����ߢ��F!6o���^C��}�@�m5Yt7����*�G'������^�IO��h��yh5���_E"W� ��w�URR�w�~��ܼ@����h�qA���f9�ݨyƘ^��洕���I����y]Dk'�5���/�~C���y���[I�h�p4����.�:ȳ䨛�j�&�^D"����`��m�_ճ��-��g�6�\�o$��z\X'}f��V�S.��0�2��s�R�G��d      g   �  x�u�˒�H���O��	(@��(�ܽ�lJ�U�M��������sb��@�,���3��os�]��+
�`[��E�R�%@�B_�����
! ���/���CN���d*��o�d�(s�tS3�ڷ!�W1�>͠ ̲�T��}�'�`<Yd�8��``E���_�C��-M}CY�ܪl��/	p
ay����]�,:�wz�u�yi�/�
lQ�bꈇ���MR�{�`�n�7�^�
��	�Gi�U��4����������EϺ<
���1�3��O&�>�&���P/��QD�����LO��1ZF��re~��,�/����L��?X�;Bn����4·��'��&��#��m!���K i
EV���0�Ƙ�� uG2�h2�I��<�q��a�:W]����)�B��N2�f���V�~-��񫓏3Wf��y�_��{�d�D~�bL�V�s����=xH0�nEٝ����*ڼĐ���Wl/2Ǚ����IѣI07�z��{Յ�y���7`�ᘅn�2�����pB�e����� ������Ւa�`K#�W�yt,���0,��Z���gF�
X�+��a��C�[9/�єWX�V��4�A��PN{e�.�uPU�� �����T i�@CfEwA��[k%u��=U Z�K>�����;u^��g�g/�I���o�K\/o뱺I?=��.)���m1{�*��R���T{>�.3�)��]ӫ�{A��v���Rԡ��u����%9��0މ�R�_����/r�"�,��m�Mm�5���ӑ�G`k+���\D�d�0�p��M�_bm]�E~,�u�i�/���D=5�������
�K���Ku=��j/m��r>�{ĩ�����\���yE�pwvxc�@�Gj8j��{��6ŵ����<G!�f�Yh�s�LU��«ƪ��\Fvy[��@�Ą�x�r�߷�S�y�����P:�d�e�r����	>%;7�V��{��ϧ���z�]�h�_[_��Lr9k�0��>w��J���G��Z�\y�4e��Ҫ��׻�.T�E�;��!�t�:T��&9���v����j����e�L�G���,�դ�y��`f{����⏓��Jes2s�>��l(r�8���x�}�'�+��?�����_ooo� �]      �      x������ � �      �      x������ � �      �      x������ � �      h      x���ǲ�Ȓ6��y���c67/	�� �!H�h�B<��<Yu���g����U�Y}Fxx��B9E!�X�Ie-�A�3�b��(
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
��>��$��e,E{N}�	n�T��� QZO����V}�'�C��y�5j;�+ߩ��8��A�4�8���_�,(5���J�k�k���w�FA�uF���aͳ���HW!ȳ��z��6�;n*�w��+\�7۟�}'?<�ެ��q��r����9��Ly��S��+�ڒݽ�xt���s�����Zd��A *�z�'��6������Bv��_zV̾kt�i{��PA�.��\�2��t�U���oJ�=�je�q�Ю��[#�'p>��T���+�M�_`M#6*j���/G�u�RK�N+�Cy���$����y}���%vf8m7U *at/�r�K]]��� Y������(����9�����7# ]dG�a�GD6���_A����7#D����gH=�{��pυ�B��ع�O4ؼ#�\��4]�f6��Z���Լ;F���<]�τ�Ur��B-p%��D�1��$>�|x�5��}��B$�m15��� �/Ct`�*�{�S��� =�©���3���W�=�*�����u���Y�@������؇s��r�Q����f���,�޺���|��!���qK؎s՗��N�{Η����q����|�Z&����0��`]}��W�c�����沶�2k�������:F��ʽ��iyb��w�c���Z�HmN� ̞O˻�>�9��wVȔ��-+*�*��S�ҁ�������"V�~�/���Wx������{&��3Ҫ �Z�U�!��^�3g��u�?ƍ��K[��m���Wڗ�:�,�>g��+]��S�6������`F��f4�l��_�Wuw�Z{�%�J.��Ȍ��)c��7�Y�k{>��v�=>nq�;S,�˻K��+7ly	θ봤"���->�4@��⣁��]�_�ݲd�=P�0��=���AA`�α�8]e]<�W�B;7�.�T����p��Mc�]�����!xſ�"��Ǣ{��z��fPGg����GE��.�(���_��K�[����z�����t���{�m���uU�~����P��b�jt��4pq$>m
7DLc�X�������Ji0L��CE�k
b{�U>=?��u�ο�O� \�1����J��*Ĉm�`�����)5�<�LX�����k��L+��(l�Ta�G��yȴ�E�(2�P���SI��P��Z��V+���P��,c��f���U�)�"P)>�ԙ|8��{K��D�EكH�[d+`� �u��B�����I�-s�>�����q =`�yW3p����jp�ej��y�p�U;��ù�@k��(�;&F?��e4϶Z:l��gg�{��m�� �t�s{ 1�h;7ޝͽ&]1Iu/��0[�T�=���� w�oZ���	(��^{��q�~��B�k��cg���.�;��,1���yL�/͞=�޹�J�>��%�$L��7�0�-kؿ�\.{N�Rр-��=����-�ľ3`�&��#_�4j�qP�[nI{\@���;|�U)l��HE�_	�r�PIXoЌI? xv1[d`��	��W
�_�������kU[�$!��Q�Lލ�t7�q�'U��Ʒ�0��u~\� ��^N���io3@��90[5`�ϮwO؁��KeO9�,EQq�
R�������*�ۭO���0 

�����������3Ʌ~X���,T���_jG>�+������t�g�_�v���e�B����p���K�e�m���G=    �x�g]�V��V��5	�ݻ��^��CzJպ!��+�-�Z�}QQ��zc�jߺ����z	��]�/���yJ��2�I��;[-�q�<o��H	��$ ���5Gt8^ Z�-L�4��B���h�� `��I���#rzlx�k�^�1BEvo�Wu����n��>��UO�{��͙��Op�'�����"�6�ɘ�ȹ�#�f�I>Y�����zbΟ�^����2�9�'���baO��3���Bp����	�7.�[�-��l��v5"��&�� W�	o��F�;���sY���PE��:E�q�B��å��:x�lZ�w��2G;�e���mV\�
�mIK:WӰ0P�Yv�j9w9���5�(V巓�C�vs"vϑ�_<�q�)�TQ@t1U-�҈��#tƴ���-��\�%�!���,'p_�{8؄�7w��-�4'���.'o�KZ����~
��_��~W���񆍸�>���vi��՟:�������?@��s�F�rhX�P�D�}Q&kp�v�����N���+�H��W���S��N��-Y�'0��cϯ)-%�6
��������䥜�E��إ�lz���G,�N��l��r�S�R�)b�*]���Y-~36��$�=�n!��V�r��x�y��L��Ft��UoL����d��;%fэ�99��њ�U:���Њ
�/]��p�J�9�_V�QU����!���-u>�7�,��^����Bӵ�5L��
��o|�c�/ٛE�h�Fsh��-�ïĞɷH�e�	uM�W�׺�n>��td6���]_���Ru?�yw#��Z�x�a�
�!�rV;�Lo\1s���>��-�}�!ҷR�����q˳�ɩ��+u�[fJ�C�R�Tvw؀�@H��(J�j�w�{Ɋ��bGUDՌ�����r4�N��!uwd\t���:�b�x�,��y�m�li"G+�c�_k�:6px���dm�ˆ�m�B���+���.�Xqꃸ�)_~R�^\����©���_m��,�:�?g�>k�ft���O�HD�Tp�'O��������9��_�.=��������#'�p	\_!������WJX���1)�	a��N�Tðv�3�Ƈ��~��4�!�T@13�^k�����w��R��[6��N����{�A�ں�8@������e��|�]=��Fs��f���Z}��2��&�+v�-ͽfDGw�R;��w� �K�ۙV�0��3x�������3 I�ǈ������l$ɽ����(���t���`N���@��N��mx�t�(7�j;��v���\S��H�k�`��Q�F�vҀ���k� w��20�	��N��#F$��J*V�K�-�f��Aߟ<���6�\@Ʋ�ڗ��Տ!J����GK˧��h5�>biޞ��+8����~[P�jg$�e��#qw�{�C��Ӆ��v��W���s�2U�� P��4�òݪ�\��+�WlwN,$F*[j�9�ocץ��� =������>W�w3�5"�����ӵ��[�X(x��P���Eގ�3Co�WT�ì���5�+�����ԧ!��檉 �����Rf��3�2��˂T&��b�^Y]���bا�U����wc>����=S�A�l��;[��
���rJ3�M}c�[4�p�[���<�k�[K@#cpO���	�Q�T9GͰ�[��n��֯4AwO.8ʐg/��<��I��B���@�>k�,��8ʵ�v����/^,||��&��h�L���o�Y��5_�GJ9�2+���YdQf�N����q�Y���nl/v�6����N�iU�kq �g�Z.o�I��?`��hr�V�V��_�WOA� ;�ek�V<�;
�5hzĴ�Q�y��tȕ�4�v� u�<ڭ]b7~��d��j%���%�br-�+�D�ň�E�X$������Y��H��F
$dِ۴���>�mJ_����Ik���j��,p��ld1�\17�"߼"$_�8mk�+�2C@�a�EA(<:���>ym;�e�̭Y'et��y}Ӆ�H���ѵC@��mS7e���/u���T�����P���.\/xk�*
���b�,8��&�V=O��:�6�T��v^i�K��Z0�֡�O���0�=�N�b|���=�j;c���?��r217�wP� ��|#�_�������҉;�ߋ�> =��Aq�>t^�F���%G��"P*շ���G�,�B�LǡZ�0���&�z&jUK �^�np�H{�cKVws�	��=n�OK�ʠ��8��H��KAޏ�����gH�<��C��/�3�`y�����iP���OM�f2%�/��K<��!T�{������Q��c4�=|Fe���,Iq�d=�G���va��	m��-h���O�Z.lG�x�M���CXq��?�ǥ��<I���X޼�/�3w�������,{���9	�}��̹Oɢ�J����^*Z�kc40���#��#;��+v��l�5 ���C�@oA6X[����m2�?]i��n���:�n0$�e�`����y����W�W�z��L_k��(��r�L�樍[hT՘O�9��g��ֹ��7|��a��oAr���5�oǃ�k�U���|g#�ޟ!�D����}���8T۾_��p#��}̓��K*��:u�~G_w��ʥ}+0�����J�S~����Գbx}�%�%c0�wW�Gx���ȼ;*Ͳ�T�op���}�9$C�.(|F&2Ƴ
`��W<%��6���aV}�����G&Cv� �
�D�(9w�kױ�����'hݍ.��%!�ip��$��GN+%��k@��g�y�d"^%?@V��K�;j�.!\�tz?༄�}!���`�����,SZmwk��g��L�lW�vV��1z�V�,�Ǜ3t���,gR�� YY��C�8q'(C�-Q&�g���^Ds��N��
P�������_q3�}�z�x����F����p���5���i���7?�����p��Ϧ^5�{��4G��Y�pF�)��y�s�eF9��ޱ�6y"䛻>��#�=S���)':$���� ��mwd4��a��x�-�a�Jd�+�묇vt�\�\bu��m4�1���E6��A��Y�	�x�u���D딄q=9o�·e^#�:��Q�l���6��sD�ʳ��佥!Wͱ��=��6�3z�j������` ���^Dg���uX��BlMW�F����؄��n��p�ny��3(2
Y?��\�2F��G3��@��K�����8��#�ή`}@�g�����Uu�m��}L��jA���y[���Kr(�7Tj������6f��:��`~u[��.|`
�H �Ҵ�C�?�W����Q�4���4t���-�-%�෪A��o�)���`���E��@�9�-��
�ɬS�G��.���c(̂H��"zp�Cy!��{^�w+ڥ��^�srm'i�v�
 �I����?��(�)B_�ۻ̪�-iZ��7(ѕE�fP�rކ(���!?�ρF6w��)g��`�A��5������<��hcZ4/mmce�"���Ji�0�g��7�k�����q[�y��b�(��b�[&]�cx�K2$@b)�7q���A�^&�<��c��N�!����ְ�P���
vt�Pҭf���]��%ve��a�o��SPhi���+�i�cM|�?�TO��V+~m�\4�DJ��i���D�m�4k���ﰠ�&�	~ƍW'鹝����
��V1��48Π�6��������ʠ���`�I|f/�I�+OZ)KE�y2���G�@�с��<�/h���jG >�3{�ε�����b^O������^��D�x�[�����pb`QLf1O�����
�����Y�vu޷y<9鿧�$�L���9��?'^�m%W�7�]�m%xcZ�Ϳ�y��|4�"�O�lg�.���$�`�I�=^9��/�>˟6�P���3O�2�^ճ�����P? l�O|�nO<Wݳ[JF0�C6r� �  ���P�K�^r��s�&¯hF2@[V?����2������?fQ�9>i�(�J�xj(����!�x�h�3��H��g��VNt�ȏ`k
�1 ���2�4���J��n��ȷ��v2�ϵ��B����w�s�#���\At,�D&��'�o�G�v�뷕�R@ޟ�'��e�v��M��D������ۊ�~�h�3���?��@�O�9t��:�
����#�7Z�L��i�3����~��kNd�x��3��2��C�F�Ve���qK�}ǩg��n��Ќ��=����@��{ժ�E	��NC��Yg��'�ʕX؂r䌅x�`��s��R��g�g���s;D�Lf+�]��O0^S���x�暰,�,��Φ�秢�nɷ�Z����n�r Я���6��(�r�,�O���!�O��o*-1��;�x�������RH�DK����e:��\����#�-^�`�ʭ�Yx]�>�nx'S��2������~`�g7�����Y!L��Du�@�7¹������eؼ�W���_�V�������h�F&QI!�E[Y�v��JR�I�=Y$G����X%�Z&2s%���𙆈-�N��^U�0�Ȩ�6l�L]>d�H�K�N�X�7���?�0˪��?��_�Y�dz��g�K#��m*n�P8� �>���\tE(�T��6EIo~H��5aٵI��L�~J���!lO��n䧈�n;6Y�g� i6�h䪗��U�p-f��~N�}oI�=���J{��sXw��_�	�X�(9!���#����&�ῐrrG�j��$W������J3<wU3ӷ��u�{��:�tk�ʽ l��7?5��)>��(�Ώ�����P�]����(��䓹P`b�0,�4
���'�����ҙ�2���7�@���b��x��k�� ͰOѽ�ؓ���6~����۪o�iT��<1������w��e��61)Հ4�;���vls�G����%f���i\�ͻ��Ia�a���^���"���褘-Ɵ^������n�(?��h�5�8�ۙV�	����?o�.���z��k�]���Ȁ)t��<�U��9��cj3�zS�W`�K�AЊ������>��:	��������]i���'Km�ׂ�Y�"�x�����?���a\��      i      x��}�����5�F������]
�u��"�S�3�(��W��z�$�8��������/�o%9�\k��`b���ě��0=�9�T��df����"h������Z�����.Z�������d�8"���33��_�/����Zþ���a��������aÿ�]��3#��������\]�K����)2��X�rz�j���נ%Ey���k�3�G�"�Vgt���$s>�0�qve��.�ڪI�"K�A؄A	Y�lq�b@.�%�ݵ&I���(��0�Dr̄�e`�������d@��Iz-_%����C�@��
~������.�@��{2ɂ��$p^��4K\3�y��D��N��Y�1W��)�L53�79o��1�\�pG���x��{�>���n�':+�K}�Fp��Ǳ��>�7p3�h��J�
%΅�餧!�&Y�VSǍ���T��5J��1֙�0ꖒ�K@����""�lwi�0�(O&<"ڧ=��p����57�w�ץٸ�8�#���k�=E��t��b
�=�w0��^k��D��5ze��1�/
�G��D|@P"�P=+{�+�M����g��j���ظ	i�Ġ>F�k��>6M܈�Y�8J�x�fJT/B�+F��̡ g��
=�W�I(�p�R� ����-�T[l�f��k���$~@�e"Ll'l@��N�L�4}{�"-s��:� �v)�y%2_�S#
%hz�zs���lWȠ��T_��RGM �-��78e?�&���jb�ߨ� v�㚢+�6���Ӓ27ӝT���h>�(��X�WwBp��@��Y�^zf-E��X/�|􈣛Ud���8Q����� DY����MԸ�'����+����{�&&�cD�T}�w����L\z'��j3J"��3��ӆ���;˲���J��U��q�)�@�;��÷���y�,��TC�6	4`PB�!���qG�8s��< ��a��S٥U�NO��k���7P����	�b�M]��	xi�FJСo�Y?W#��R���dy>@ѝt>�v!je�F/,���>!��l���l}���J���\�q_:�4�PbD���X9�����cԢB``ǉ��� ���^�ۛ��夁�h[V޺��j� ;��@UV�M����T�(l�f��U����_��.�~ %��+��ʎ���sa�CUsU`6�������fJ�����b�������0(!z�y����8��Lm1�Z�ꋔOn8�� �Y�J��0�9ď4�}���YciwȢ��<	�UE�G�'%"�If�ѹ�ʘ!�_�î5�K��J��g����opa����m��=E�\�W��M��yz��t��l��t{����\t�[
�X�O\b�|��O%�)�RV�&h�<��@#
7*��h��ϼ��z(�(�|�$�RPģp��ݑ�����t Ujf� ��#%�̔�vܙ��'�.�ɒ��K4`pf�w�c��Y��0#���8�]3{Dl�@8��p��B=^���9&���4�'��|F<�����"r�i�RP�GZ�l��tpj;��յԯ	Hsy���C��A����A-��	���I_�4�Q��b��*8�@�jk���B
WE�nG�G�Z��i��pӫ1�mj��b~]�5w>�v��1�!xi��
�ʉ��q{�E�!J8vRI�&L���9����+P�a�7�����0�(���~�cm}���!rk!o�=JߌB	b2[���ض����)��7@p�=V8�Ob���i'��g���Y�_3�쑣]�A;�N�'����ܞ&J��n�<��{K]�p@��O���4�pSզd�s��T�bˊ��n5�f.�m	�^\�*^�����*D�lW��w���,/  ן�7�&.^�BZ�Er�ce�����x��08���<��x�8��""��͗'�P��؎6݊vˁAj�6p�<I\]��D��k[X�:κ+Q�w΋�[i�Bh��"�C})%a�J3R��3ͮѾ����S�8/'�ib�0��2^�Z��{\����	f���=��ЪuԀA	9�h��bX�y/ a��&Ͱ��߄|bpo"3y欺zO���;�3<UKA��r�H[�ڙf�[��5B-/шzn�V�<r����z ۿ�57m�8�����.�&߯t�DuÚ�������p�f�(��ni/�٪"#����g(RU���3N��fI� Q���%GK�	Ӌg�R��w3d��f}X|Bp"�	s�;r�)J���|�taV�[������Eе��$�)9!��(k�����mtj��8q ]�nkl�<���~�6Kty*� �*;�Vt�e���3b��"�s;�� �4U �Q�����,�^G_���%97�z�Y�k�*2N��H�}�	���1��B�K'���y��$QŶ�����L(�5�O��3���`$�g�x�G��~�̾�@	��sH����[L}r��u��2��pS�"���~'�=�h��|x�o	8����`�ǥm�0Ê�i����?dC�vuM�p=2�ť�'e��O�dZ娹�OCB�+�!|0X�ר�o�������vI�L�4�s�`�j]c�a�/0���<3��O�k�6��[���x��5�p��������9gE�7
-�0Cݬ�_3��9 }:�6+�ǭ����]��(�R��l��d%F��XE�Q�_q�I�<�țB�dS@�U�{���m�Rpċ���7D���ީ?��<�08��N��hn�S�#B$���|}��nt�����q/r;h�$:=�}��f��ܪ���փiW;���u|����.�2_ك8)g��}�",Pz6:��c��a/�~#<������(�1�g+I����w���	��S��l�����2��]��T1��*�' EO/Y��؛�	Z1����)���F�2��\��G\Sb�EB�f���ѱO ��Z�U�m�����۵��(\���p�a�ڡ��!��������U<j��9�I���Ke�L!uޡg@cj@�w�������Ht����Z�p���W>�fe-7�ݕ}�S���;u�Z]���`zsj~�	gǵ.�i��:"��17��e�����v/��q�Su���| p��ܒ]���ձ�������_�pճO�%�󇳙]�A_CF��?lY���F��s��ʨ,q��J�w�(����(�X!K����`�l���6�z�kB�-��H"u4��h4�������~�v����Y��b{ْTE3u�%Jܞ&p�َ�I�z�S�	<vD]%5`PB�%i�'+��*�o�B����n�7apo���d{�7JkI#�׬�OJ@x���J�]Ľ�!�wϥ��"���d���mGY��ֽ>���4��ʶg�<v+�Z���{(o�o��?* ���J-��!`<��s�H�V���1n�&��h�C����?p��p3=�:O �b��w�>BQ��'WY�ju�����éއ
��%O�c��к�ٕ�G�3?|��9pA��q��"5,~Br���*���vn�I=	E�,���*��\<	�B��s��[.8ÄL�A)g:&!�o�j�=�2|p�@/�t4>��p��*B�i�.cU�X���g��T�]�?�1��
<�(sZ����S������v
��t��~�B���hb���e2C�j���{
n��r1u�MD���M����������R�OF�ph���h,"T��>!(�p�u�"��.��{�/���u����>��g�7���}%�����s\��3�"���P=v{�tv���5g�{�@�L������+��M� A��/�S�XϚ\�*�)����Hv.�5M$�/��ʊ���OJ��߄�Q1}�:�B@Ż�(�]�4bp��'D�<����W����B�2 �i��ݽ���5�-*V@5��$G��x�Ԏ��.�Ъ��z
z��p�}3����p_��8�E�c�<��#P��E�.�4����z�������	��i�g@�_�.    �G�|!̂�{ە�)�7Q�4���p~����7"(w������@
�*����R�,O���� �]����U�c�/�#�X���7z�+p`G�����K/M�<�c��g=�~�V�5�	���*c+(�=7];ۈ|0�f�*L=��k6�p��߄����o�FڏNO���������C�����AYm�O@�R%�Q��ޣ��^lL���dt1^�A�ň���8/�C������Cq|@p�Y{�l�D7O��==�*�����N���jm���E?@��' E��ҽ[.�e�Z�к�XAz}��䓶e�+s?�\�Юf^���a_YT�����7f��p毇��e�@�T��Q�Ψݪ��(�su�~,���Ӯ1X���dLq8T`­&�[�{OBQ�mj���i�8*=f�{j�RG�&�R�������Tb�����G3�*��&�7>e)Z&�ҙD�Ê4s��
o	8��Ҵ"3l�.�r$"te[��0���6wT�V�u����l�
]7����K���@��pb���"R9U���u�=��M݈	70Ju�.��~������ӑ�Qē9�ˀ+1�ۣ�VA3���]�f��W$21�/���u�jxt2:mG!�t��Z��%̣{c8����� ���@K�;
M��rV5�Ώ���Md�Auc�5����(\gX��ԣ�Rd�����>AHEN�Z�w'��#�ӊBƻj�����~O�%��\�s>��G�5�P�Den��'3�����I���S�S��,8��Lxg*�*�*֬⍌�������Ѿ�P���J��NL�[�2�l\��(V-	�%z�ǰà��\n�WP-�ϖ�(� A�1�3utr�:�����<>%5�p��Oh�ֲ�eD9����k5�!n ��L�/��֖�����u��↟���V�`sKvk�?;݈�Q�5��-J\h�%#r�abs;���߫���Í��FJ]_�E�cw�DUs�������Cj{yM��6Yr����5.귺�C�:�;����
�-p���9S�}�/0��6�G�iE$w�3�<���������\8�Lyf9N����)�֝�&�@я櫔JhĞDB��Lj;L?�5�sf���5󡠱�����xK3
%h3��ig[&R=a��,[k���ȯpf���B�f�n���+�����NVO�k�����WPAѝe&z���{��E<^���mo�5�V���� 	�-��@	�m�2�ۥ��O�����j�nb�=Õz9϶β��G"6ʑ��&�j�*egtZ`kk�$�AF��Z��ق+t�x�駧�twv��AZ�Kwȭ��Y�|B���^�������r���-�[&�F�����L��b��橚�>/����M��8֗Ý��J#Ӱ�6���e����"I[�ω��2�L����6� n���c�:�nkp��bs�*��b����I�T�YfCb�v�b��܈�
� e�s��:{g7�Z�������@	�U)%,�s�p�P���n���s��P�4nf�3e@%cd�G�y�Z-	g���`���d������6[��O}�Є����pR��)2�,}�m(��K����W_��]�F�8��d�yX?��B��R�E4늝�9�3���m��D{�����6�����5���ڝ�qrԃ�N��Y��$����{
�H�h_�G�mG2�Z��&/pp�gX�5�*�	2{�����<f̪�ƴ�G��t�Cf����^KBQ8׶����0�I�Y�n���P�Y')b�X'�N����<6^��#Ag#9"�帣FgA�'q���e�/0�(�%��w��ԟ��h��#@��O�nq����հ��|���<�����v�=�����=��ٍ1��塋.�=`���Y��g��i��A��$ª@���d��0?ɂS���&H�wd�aP �Ա���<�7k�ጆ�1>�m���������yC���!�l���٬{v��^u8A���B�_��oP�Ή�㔙D��>!�o���F�W������`%��s�
��z��>�S����9pA�Sx�����A �����{U~ς3b�kB"���$��Gأ��9n��D���tJo�� ��2B�礁
(C3y��ù�m�73�"�XE�j�3q��� �)*�g{�C?�v���Q��R#%�H�@fwG#�T��Vw�V�pBMs����Yp1'�H���*�'v��½la}y���ǃ��:Y;�)2w5�i�.n���F��9�˲��ϣ�7�1��� (�������{�b¹�3����{lF�Q�	}��t0KG�+!����ܯ�}̀���Ե�7�K�z�̹oRx}�[��F���fL�: :��ĸ]qQOBQ�D���%������Gv�rO-	���m�������3,TKA�s����3ͺ�Pfxm���D��(q�[л�l��c�sB���zG��Rp�ElNV��8�NM@��z�'%@�8N}{��O(©�ٯ��N�%�#�b���e�|� �S��G�,�7�r^�n�R$��AH� 7Z3Sb�\���VGTR2��'m�n���s��$\ԺO��v_�9m.
���z37`p1GS�z���uw&�� a����d#%���8M(���b<������I\�v/���̎!eU���Y ��>�FO>tf�˂S=j]o�x���{�)�m�.o|��	��񸤴<�:ݾ�,n���E�3�R��Fq6�;&q���@��Ym����&�67czst��ZE	�tG"��p1��b);u���DWd@{�ݴ� A���\�f�,`:>О��f�&.T��n$#mHӄ����F.B#�RZX�n��vya���)���l>^�;a_.M�#���5��[4�Pb�A01TcU
JwZ��O�����6��A�s5�l�h]�|���F�Y\ D�	�-6"N@l��߃�����i�f$ł��t��Đ�C#
gU�������Ż0~.�9����~��+��F���Z�ӣގr`���׳�c����޳%z�6f�Ž
�~=�u�JH=E�tz��o����܌�,x�H������o�����3�w���5�p��$F
v�u�ض.L�P�F��#�|�=g�F�����7&p���a���t����	����ߛ�v2���5S�C^�\��$�tu�(�K��8f���B����U���mj ���-��q=\n���#;�B?/>��fJ�MK'����a$�:�̞۟j)(b�߮����㪗��<oݿ��OJD{0�1+Y�#F���97���;��P�x�4g�lp*UJ+p���������M�F��c%_�Ks�Gx5M�۬��E:C-��Kjf�U��DU�.������4�c��/��ҧ����o��˅�e��Ţ�'�~�jv���i���=�ӣr�+�T�6h��|[i=댦�0�kT@?��v���_`8�A�i\�$[��x���}^1(!Ǆ�E��ag�9K@x��b��5��-���,8W�4I�����B<Q@0}7�/6]~ˀו��$1b�Gl XO�ÎoF]3
%�Gw�KF��eΓ��)� �B���(���O��ۻ�M�P���~�ͷ<8[`3�Qݣ~D7�<�q���(=^�	��wØO�����*J�o7��^���O�1�K{����˻<?�[K���#�����4���;U54{�M�Y�����2����\#n��_��բ#�E;=�����nG/W=�}ρ��m�m4p#W��q��>�T���{��a�.Z�t�[U�u��l���RJ�{DD�������PlD��� M�T�V�
(���.���Rۿ�	T�`�_�;Ɉ��Z�Xߔ� ��Q��1��Ø���������ٞL��&�����"5ukl��F��6�B��,O��S�B7A_z���fB��
����67�Ye��e�HT+{����@	��3��|��zO�bW�m���?υ��v95,f��    tg�Yި?o`��C	+ݐM�ٷײ��"�� o��@	t�و ,NM�a4��E�������z��o����ѡy.sTݵ@]4���N�7"
�J7����˚��п�k�q8,�=5�\>�ݮw�7�.$���f�^b�r��F�U�5ap�n��t�,�W* 4���~ĭ	�3���ՠ�c|�������o	8wl<�;��t�v'X��)T����u!B�1:��I ��č��G�g��f���t���(�"n�����e������z��2�L9A�4�����n8�����~[�N_��>-�8���YokbSl����I/yc�X%�K4��C	���g3�����- �Վ�Ǒ��[5�p-����9�ge0�6��z��󢊿f���y.!Zkw�!B�����׈��s�f#E�s���IJJE5�6���c�SL���o�%6A����ߢ
7xO@��y�pnf�^0�*�,+��5g�����OX���&70����=��h�i.\$�0{��_�fR�>(w�uo�F��WQ�	{��i��N��^��^�����(������02�k0�m9�{\ܧ�-,�@+�C�K�U7�<��o��O3ẋO��>9��lnҊ��eyS��$�n���i>��m[X��(Q0�k[��p��t&.z��8�Yӄ�����n�&�uA�lǇ���U�G`��g�FJP�掉�Wb<)HCG�<����i��\/�;}�+c���~Ee�,��g(���?��M�:6h�ag���y[Q�V@3
g�h�,ң37Y��{@ijfe����W�T����n[��w�"bK�]'�8M� �Ŧ��;y��=V �jսA"���vT��a��	5u�S�s�{+_��o8�0�X���c4�ϔ�+��Z·g��׈Z9��g����1 
j��[��Íoͷ]�TХ�i\�%����$u[:�J�pЅs8�Uٳܯ��&JH�9t#��֢��U���.���wZƇs2w��Ft ���������W��3۞������c�������XO���냲W���\ُ�G~�	7��Ejv�C`����1_ۤ�9�%�ɤ`���*��rI���%E�t:(��g���@�:�v�5�j�Z�|�����٦􎫺�{ƙk����JTI枤�]y�M�=8K�qu�[n$�r({�Iz�ᴋ�Qj���lVOÍ,mPc#&��/A�ӧ��s����oe��pu3m#b�����A���'Z�9�2�i�vΈ�c\���'%@�c�����)�~ ��6�OJ �s-�<��t�ެ���qخ���n�^�؎?1�J�t�*x�<i_�h�,J�!+�uЦ�<��{,"�����I?�P䪊
�X�'\�M5�`����0(!n�bt$��|~
��"��vZO�8~�1l����
Ԛ/� ��<f��^�/�i�ڀ/��e��Q��w}����D%��ɀ-���"P����iW/�d�x��� lD��gx��nO��T�&�z��'g
+m�&�9s��ЕfP��� >�g�b�x�B��6�;��O���{�r�4eͨCE�j:����f.&����I;���j�J��Wi���c���vt��� ����B����9P����q��ɞ)D�^�Cnf|P��h8[`i��6fh�9�S��� <9�~��_�.06=�>�+P��	*Y�����	8[V���o��0F#������?��ۿg@�;��ӱRz�7"��@��n�O�-����>O���s����t.���M��q��Wp���r�7��,��J������o8\��8)�9Xdb;2��r� ���-e_P�)|>JO���O��$������0oD��Í$�3?kӓԿP:׏�}g��yn�:K/��A?�ɽ�	��M�%�9��˪�*&G��m.`�e/q��&5��qwv�kl�v/t�u����=J��w�H��@�������ܵ��������8EN����`�u}��wٺ~o�.(��˸t�.'C�@._����D�b^�4�p��wIj��ʰ�.�K������pΠ������7;C�KZ8�̒��X��4u���1*()�n�9����q��Q��5V���Vѻ~�KPM\P��EL�
k���<V�?6r�,n��r����Ȧ�p��i�:�،��(�h����S��o��F���q߾�u���A	E�����@]o�&�ȼj��'���h��%�8!;����ך����?n�~۝��0�c�O�q����Ѿ�x�������F����ۿ�p�b�����w�,UD�U�c)��7J�e�����Lq6�܊3���+��'���آ���(	��c�o	83ɞ
��Ϭ�n�����QelJ�%�؛��������#"U���@8W��/tw$�C'��;㭪^P�}3�ݑa�����|���R
��	���$��3�Ķ�x ���o ����u���0>���>�OP�BOq�r3D��z�3y��F�\���$���bM^'suT��+�����T���(��#�U����d���p8#N3�Τ����Xu���E������j��*P�~8�|�k�3�"�y/��n۫��Ӹ�"�J�i5��iU�z��$J�3w��D�EQ�/�7���%�\L�\�i!�l���`�����޾����k��t1e��	n��?�6�{����,].�C�??8�ު>5�j���p��:���%���3
��%�ԝ��2�J2���:P�e����q���z�;���?� J|��i�.:�)=��"�����.h��e����S�#��@uk�#�,ПdA�$�l�`�53S�Dd�t��)�bc[�l�8�����f��G�r�ϟ��09(�RB��F���{
΄a�v[N;��ۀ�K3�y蠞��`#\Iжa�k���@����{��tj�v#���0��d7���SԴ(��ģ��XƐ*��'f��|�O ίP��^�А%.%"�_�xP��Dx��/���p6�xn#��{]5�P����~7K������~��뽝�p��&��n%�Owtt���y��ɾf@��3}�J����*�/��˝���l4 p!0qA*�R���y�U�0�$����|"p�r@d'q�W�4���]i>'�zn^+y^�	�� ��"�{���#\�]i��"��@Oإ��IT����3:E:S�ޑ>��U1f�)|����0�Yӭ�{Q�\��������zB��3�1�4ch0�:fk�f�ٟIu�lRު�[�2;��rI/N�u�s������Y%@9��f�>͏Dd+�������P�=�OԮ*�@#�{����Fn���Gb�y��lD�;'n2>8��I^0�::���4q/�@��'��PH]�a:��q �T�=�!��|@pN�(�p�h����,�"ƴ%�	Lը-^�<N����8��cӈy������{-6�Pbv�ⰋNsuX켨�T�^����P�4�\#:����M���� ֽ5*���@	8�Z�(�Պ�v*�����ա�rZl�aԷ�3���Z%����[�k�Ȯ,��"�b_Z�,W��j��<l��:����Eb����ܻ_>󖀢刵p���<o�n0@P�(	���������吟��?�W��v+��sh�5X���%�<ɾXE�<e*���Y�;�A(1��`&����s�0�.�Շ������CH�q>������Y;��:�q_��J�@༐��1W�cKZ�"�dY�A����p����ш�7�C��V��^g�(���!v�pM-���2d��Af����p|Q��i/ȕ��ti�������cd����t#�8���Xp��^�(}��|j�̢Hi��O5{O��p�y2�E9a:�$� S����)������p#�8��19�qQ`"�r;jq�s���0u}�`���?f�Q�e��ܯ�p5O��g��C��������_�8S��ǁhϷ���k5�J��i�fn��w�|h���j����h��j�������b��<ή:P�����`�|�\L������#�X �  ޗK�y�vx>� 5@P"��s�@%D�3y:_�.k��7'|��D��3=ӭ�ڋT�;A։��E[3�s��?S���F�n�!Ł�뛲�l#/2���\?׌�E�rL[1qN�	�͐m���|��s��~��^И'!���ei݈�y.��wS����-O�ٙ�w��5��ޅ�e@�x����Tb�-���^j�e�yУ�V�S�wъ~�	�f+l�l��Eп:�8\/���-q���h��� YJ��2-_��-y�O��&�n*("�������X˃�`��
��~�p9��.�HͥVU�Z/���7l*�K�-����U��O���-���4.1�|
�&�+�Ig�_b�*9�@�fR����E�K���J߿�+!�w��g���Zc<^U�z~��<#��a�����\�O[2���s��kK��<�'-�~?�4����*��������xj����P��������-h%�����b�K���>�o:T�]N(�rCc�n��h@�E���7M�e ����2�('�����h�L��"Tk�U%r/K �N���M���[��-1>�h�G�w�<ܫvZ�%��3��Q=����=��9��;Dq4�f{��/D����E@菢t��4�?�[%+-�YB՚Ă���7�'[�z!�^:v��/����Zþ���auN-u�U]�ӚUwL<ѭV�RKM�*����1P���ڭ6P(����r�9>ju���K�T��o5޸���ﱘb�|�j��z�"� [���bh豮�@�E��-���V���E��/Ž��_�~��]�=��;�v��~�eN��(��ںi�ڟ柼zR�-�h>K��9{��z�a!�����\^ �����H�P$y�Q�H�V��������4�t.�h��?�(p����������{2�h��V��;W�s���e=��f����;]��߿����2<J7�z6���ٖ�B!��?��w��p�[����e� �:�FZ����/��[H��$u��1�*�}�Ͷ4���;X�a����k�� ���3_��?Z;�Y�ʼ5��8�"��(eZ��@qO���vo鞆�k�9t�D��b���^�~ՃAY+�Ş�w�P���������o����|�"��?={�(Z�w�)dv=Q6}���E:�V4ǰ�E�1%*]:�8��-0��՘�)��4E�z�6a�1�L)L��tӒ�휒n3&��]8ک�{��7�65iڗ�1�M����ף�YY����ɻ2��n�z��+˶��6�|D���,`���C?U�B�(�F\���?e~�_���m&(�,�+\'&z.t移ǬњO��,
v2GjBQ0y\*�@e�Y����GA��_�)C��X����[k]�9�=���Aς�t�t����.Zsj���Ta�6��)�[�O5��M�sy��`�_�_�����T�y!����H��bM��u:2�=���VNg�����cw��`����gY�?
չh8�*X5G4
WX��}3�~6ʧ�E��e��P��L0`b�� ?�]��G����w�M���}`��I�7��F����D��"@e�z%���;_�D�Ik���C��e�P��8a��D�(��Z,?�/��B���d��J:pS��J�fk�b�q�0/�/�4ߋL̬5�`�2�%[{�j����d���د����AU=(�j�"/��7Ue�]�B�=#
�	/��ֽj��t�濌Z�Z%�р7k\�s��{��Y��n�����ޱn���U�h�v����ZS��{�j=}T(ΰ��fh�n�ju_mݽg9:��<R�����37�����KF6��
�Ҵ����������_�]_%�      �     x���ɒ�LE��S�/����N�IJ'�7L*��� <}S��h���7F�����c:ku(棃cOX�K�2�(x.Z��(ȊF��?֖�9�\u�_�����9�S!����b>�R�C�Xx� ~�@!��_���?�H,/1�Ǧҍ.����H���YA�Je�N#͸@���x�уl~�s��Ԅ("HbED �.
�:O�x�ӑ؆ޘ�W�Nl���;�M�5��:6�?F]����]+�s��2�������S]Y_�ᚓ����$���0,OB��rD	�Sr��g�2��C��D4��WW���f�Ӕ@��  !����̦����'Y]�U���g&���"4����1ݙ->d���B�5쟚=0qFt_%;#�iܹɣ}tL�ݻ&����"4!6E���pҙ_f<���i�-�w^5\mO���{��%��N�b�W���)x�}�����X��<:���8U��<`?�}b0�� <|:PŠ�?[���W�w/	� 	��F�D-ݬXq�l.���,m�M3X6�"�m�m�j�<`'�9��}���.Sû��%�?��)"��x��w��6$�!a_҉����n�3g�?6��D����^�'-�HoH��\)ЗmiQV���>�=����Z��%�M��>]d=`?��@����G���e#�ۡ�W�_��Ռ���}���e�X'�0���i���ۚ��!�!��r�_Jν4��g�OkFf��Ͷ�"u3��#��֩��n��3��Y��������w��1y��O����/xB      j      x��[ْ��ҽ�����\���މ�Ȥ��q":�APDpz�S��j���ۚBWRCf��b�7K��p��\6��q�Ȏ~h�~�kd7:i"<�6:|����S�7Oݱm'��o���0���&����|Y�b�M���:DMw��	����?�0�6��q���Lc��
�'���L�����=G�0j̳�0��[%0��P�9$�{m�J`;��g�";@��jH܇5 [m��U��h�6iKa�ѪZ���	�����&�ƛ%�Ú��|^DVk�.JL3�ø��ب���W���W�i�P�4�;V%J�u�$�Z�!�������T��7u�:Q�g���� k��N�A�S���P�|*�ꤩZ�������P���K��!���g����jSt��KP�RW��OnL��N�?�};Gt��0�F���0ow�����7�xc�{;H�?g��V���	�6V��~���|�[���8��y7��b۱c;0�b y7�Q(Q	E]e��15]^�GQ.�z��o,���E=�`tf>�|S��9߂q����u,�3��k���b(�Qm�h�D����694�
T�GV<��}������[���*4��������ST%7�z��D{�g��L���X��{��U��a��$X���_�,��%ֻ�C[�����x�o�I0m��=��q�W��i?;1��PHA '�x&R;Yi�n���&	�բ6!��ő�,�SșN�mjP���O-2Aǣ��(�8Y�tG�oP�~uY�&��Zn:6K�(7|����4�z�8"��cx
g�3v`�����U�?�D���i�dq!�(�m�߽8��F��?�W/���A�rpxr7ԃ����l�g���3,(j7A?.�����̫ǅ�s�8��SL��8��{G���3�~�;��C�r�f���]Ow��{��Q���D��;S�=����i0X���[;�)�b��SBY_F=!�oE-2�L;��9�'�4��B�o�=��:lv��瓰$�<SC&a�J�e���^�p�]�S���ٕ�Dtf�}d:�Z��a�>\�yF����m��g��x�ɮ*(.�������t�Ɂ9���3� �-;(�Z\��p	�$x��$K�R�<�]/�"��q�:�2`�䲘��[̒�Ɏ�=�ؤ����o�j��Ns��<����=�8#�Y��N�خWO�Ӏ`o�2�2#I�uN����0Cx�zR+���8^i��=T+/�(>z@c���d�`��@*�F4~���D���9���3L�t=��;d;�`��;�q`-Ʉ��v�+���9z�Џ��a��L�������V8�䓫�� ��繄��m��C���T�[�L��G�El��B����x&�g�z��%+k�]�������N�Ď�
b4��X����;�y<J<=��T-;�ڵG�nۓ����׌׿a*�a���$�8D䌼p!+�;�}��,k����A��m3��o�7ro��ѽ�!�me�$�]n�Js�1%1���r���'PH��x ��]��6�B�!����\�[>&�{���n��:��#(Rgȭ��ji[��+�2$�BD��l��Y���eȩ4����:b�]�V>�c�V���sg1�r�>g)��鯭Zt�W�Į3�Ё�9ۺ��`��<uje��RL�����,Aѝ�Ȁ2W�ԩ�'1��i���+t���N��Y�#3k��L�E�k�($��oe{k��w��w�V���)q!�ػ���_��p$.����S�V�ϦS�W�259鉈�O���Ǻ�p�	��ͱ-�?��/
a�;$w�݂���S��<��^��]�;���ƲF��k%��cJLiUN���D�.,͚qd^V��0��.�κ목=z�*���^N&������w\l�ͣ2�(�j�!��ڥ�ݻߟ�b�������[�a�7��8�5��;�K�0M��vZ0���vc����d[��={�]pp�<J�ڌ��&��U�sfıU�V�{B<�]u��\�&:�3(��v�0x�ҟ�>1X�I�F�>4N�7�o���}f���?);����件=������b�"����x/k' S�b�43cҩ�Vp���F�9�������A5G�φ����~�ZH����&��c�0NG0��	�gR4�b��.ߊ,&����0��lm��|�A������Nw"�جŇ��e�R�a���-C���-���ė^����Ĉ���/"|��vD�f��d�{��J�9��ȣ�RY��`̮���1��ʃ���0��T��.ĭ�,���0��wJ��	Ӷ��M�Ţ��[�g�("9�����#�*Zê۝���D:����&�.?~���m%u7h2��Y�7}��Is����S?��J�р"<���A`&82�Ƹ�"��u��Z��!7�`ݏv#����L�[\e��tŢ=es;�/9�1�"�:�:��{���K�bm�Hu���䂋}⺧Խ�#����`M�c��G>ʢ~紐X�-pn�\$��r7;�.����l�aO��*T�
����%v����}'��}�Q�-p�8�$�l�T���p����p3E�J>PT��P�,*�5쒣�G�p����@�L��7��BӦ�WQ�L��xiⅱN�#_]O+K�|�:(z�К�\�)̷��`3q�/(��c�>�� ���q�Mz�ӔW�����MOPT���yv<["�:Z������x���*�AЖ�y��q���xd�[ux�����%g���ܢ#��:��z� O} ӈ�YR�0��h��;w����ʫ����<!�N"V+�s�.wto��:��u�R{�U�q�g�����Y1����ĕ�b{��\��N�^�1�L��H�ݵ�_��R����)�o����}�a/v�&:0��3�dؙ���L�a�/�����a�w�%'+vˢ�����t:�������m���}�$�����!k?��C��sĐd� K1����ig�l�9��E �Nw�(��Tf}�]Sg�+�!��f��B�e�E����Wd�N{S=dl���l�r����|G���P~��y���Va�jw&�G�`�Pb���7k(�'`,�a�����5��Qv�.�{a�A�>���TLȞ�j�ѲH>�_�h3��Ԯ�Hz_���#�����U�3��L����EL��|SZVQ�[�&��,�ڙ�o7}���r�w/?b��u�:;g5a ���%�~���Ϙ���D��\T����w�\c������P�6^����Mvayia���
}�s/?cV+��F}s� �Me`�ZbAilN��υ��ɣ�߼��WC46�"ƭ֪è���i�7�F�P��+��$ )� 6jh��p�H�Q�ˬ$���YX���+a�\��՚#œkd�yu�Q$q�-������|dw,w	�a�J[���諍�o��=�\�	���G�R3��eEE�]��:a
�!k��fkޝp��Wuc6���&��=N��İ�N����z�.��dh[��̻��ƍ>mhk� ���[y��AΣ��.'�CĊ�1n1���	�߇���g���u���������n4���{
��1���M�>�H/y�\�{��YAKk5q{�[��ΜÓ̅s����s�]�n�,O'�,Ƃ�Z�c�(�V��C�Q�^˙(Kez�<e���}�
W�Ow\V�a�;�x{��0E�o�D��8$��é��S}�Q���ϋ��$P��1>^R�*݅�4�w��-@��#���g�|̌U�;k�Lɋ���E)n�+_o�4_�6J�����zuG4�����4{��j=�if+��g�%��^��HSQe��A��!�Beo��$s��湚k����)A��׋��6=�)o�N�>Ui��G#G���NN���8�?�}H=@�A���:*7�g��l���0���1e~��'_��A?w�O� ��d�8���?J+����M�Ս�����b���%���2�:���|�W�1�����'_���$��O�8�,ئ�W�7hbY���|�� �   ��=9�v�iȯG����L�6bQ��^���t���@��aC�al�k
~��J��K�?`�[�?�*�<�x�dg��E4��(՛�N��,n#�t���� �6�a�D�}��ӯ](Ov��*h,1.��s���K�����3�|}����k55N2n�f4ǠG�\���d��DC^�5줸�v/��_qW%N�<		b}�u��[�S,�ߪ��3�k�c�|V�~��߯���I���      �      x������ � �      �     x���َ�J����N���t**8����7�(�����ʤsN'pk:�_�Zߪ��΃�fl��h�'r0�:�VK_M#�� ��J�e�s�<
 ��7"T,�H���T U!R�"켠2��Jp:-���M�ȋ$`���<��$Nw�^K�B3=k�}q�V*@A�l�+��ؽ��ŽW�FR�*$*��߮ ��"�dyl�֭�-���
1�
�U
���Pɂ@�!g�°���Z�>��C��U�y����*%bck�U�*�
C��I� �w�足�"��u�Q(D��2Vi�(��f�Z~�Fֆ�{���X|0�7�K̝uH��9�3%-������fjC'�o��!o���)�d�Ƀ	��ʺF-zÛg��c	(R鳧پ���Nf:������%��u���J5`��3��$�%��|�OcQ�-$�*�x:��P�]'�M0�Z�6Z�����'Jq(��&����xq=���mK[��%�H%�=��ǔ��1��ʛ�����������N�q.1v��TJ������g�"!��z��O��Q�۲���f���K�(��8�w�����2\+Z�f�%���2��?gM|���upefPl?��{�/�ũ�9X�����j�K@�)��p7���h4/b	(;��C\4�Zb%��Z�(U�C	(��E;�Ҵo�;�l�Mw\*��)�Q�$�xv�]2ЮTzۋ�h���G���7O�Y�	ʜ �v�Ϻv"t�s�%�p����}J��;��8�qf6�}��<��kW��̓��&�%�2[���hSg�[�iU�$�'Q1V�������|��������60�%�$6�����`C)3�������U��������+�ýi��+�.	g�*����EA�ߢ���n��*umR�n�Aa��c�)�Eq}�X�ֺ�&���p.E����7v�ƬL��Cg�݂|u���},|���A�~�9�B균�v������=ی��w��{�Dc�L��/����K~�2rql�I;���Q��:N���&0:��v<]�����k�ш���p�.��yB����ʅ��ht�Q;�,7)�)���1����N�a��l����R��z_��������;ުN({��>��8���K�y|=0)�f~B�׈��h��'�Ǖ�D˶3hU�
��~���G���]<��^�G��2�D�������c�����w��q@��e�b���x�2�.9x�Z��	ׁ�~	(Q�J�u��Ͱ<n[Z�R��%�~�Q:��/��(�����®H|�@�Ǻ�>�+�$%v���J���r���I���hyۺk���*|O�u��B�@]�⮓�zq({����r�Q���|r�C��,_G�@�c�|}}�q�%      �   �  x��X�z������}o�nh�LEEP�3A����O'���Kr���q��zUժU^�lSW��iG��E ;��D���7=c׃`�i�8&p�lO�����? �?� ��e���7˼b���|'�f�W��"��u����\w���|�Ef�b��J�_��{F@�c��?+�+���&��G0��ߠ���J;`�����=	�P�����U����G�.�9+e��W*��%����'݇� K@$�z�^�����o�e�+F��7'\ԆI�*��#�>�=}�OBDJ��ae�L����.Q�~$�!��#�Y�ch�_�qo/��N.�&��8�ł�ϱ�"r��|~��Z��s�\r�m����(���g0����3O�����t���6��N,�ZL��J&_�с���n����vx�y��"���{,Z�}�E^�q&�y���_�޲�}=��k>%
��t�\��D��:a��*�˓�ߴ��8�^�����s�z���<��M�z���]�RV�ݜ;椄������W��������0�>�6�&;X�/�����Y}M�j�������}�@��x�'�E�g�o�t�w�(����Ŝm�L�]<O�i�/�x�Q��v���1��-�Xxa߳f(���5�?	�
�m���"�X@�W�k{�Muڂ�Wf-7q/�8�8�ѡ����4|�S��כ������F��N�t������ՄFi�/o�� ,�R"� 9̣H{�+:G{�]�X[��l�+&��@�0��|0WL^ M�����*��4_�A7�h��;2yRR�[[":;=����! T�`�����|z\��<�Ε ��J�(��?P"<y<��z/u-�[��@.�ո=��v<"p��:��Ų�[e�����c͚��~�}vvoC?c�u9����`h��-IF8@��5�0��B�"�����Pe�7F |�����͹+#��L��3M��b��P�!���܅��� Ac�s/�|kl�_�cf\������?�X��]Z�{X��v���(L�*��J��޳,�~G�=W�����(�;4�_��H� �&�� Vxt�e-V�
x���0a�;�gK�4P`$�$�k�c���iZ��Ҫ2�������<0��N�3��	�5�=$$��P�D[[�#8'&;��9��������C��S~?�C�?j��1�t�^�'�%����r"�K9m�.��~��@╱ݞ=u���)�(!�	?��ѳ7��"�tuE���/��kF�F��΃t�@���ݬG�HWy�̋�#�d�E�^�'N�.6�U��"��Ij�-E���"�b5J�'�p�(R���h�i>�b��@�.�X����ͼ�7��y{Ѝ0^��M
��Xv��hN@?"����h�K��r�%���cx�?��8%2�������#E�1����s��s	V�)cW͌��iJ�u��u�ցKk�2&�
3u��l?�rtN�|���/Ԧ��c>�`4<�cv�C��8Ǭ�[��d�F����fD_��@�h�)&�h�ay\r���A�䵦X���vn��Ɯ�w��ߚ�3bo�.�6�j+	��_%��8d3��tZŎ2er E��!����uu��>�$��߯�M������'�C�6������ ���X� ��\l�d�fv�j�/+�S��r���轻�-+����?��Щ���%K^ȏ�9���s�;���PTBU�5�����F�b���P�U�Z;����
`D����{�����o�K���H��(��ns�f�g`��-�j3*�	�B�ys*��_��*�K�}�36��i��yqܤ��Tށ����8�8�d�YW�a��� ��Ǯc@»f ~�.x�P�q�Y�M�`< �]U�K蜍����M#>Z�'���P���
?C�������^-�2��i����h��*cz*Kd���%W)N�M�.ptw��J�?��.�f�ߞ!�i����T(3�qA�';����,��5(5��D�W�9Ɍ#@���!���W��oj����b�_�!	�ڽ鷇�2;.7�j���Mڜ�;с�p�(�ȏ�����޴E>��0KB0$z(7+�����D!LԺ�w�@ֆ���o���J�V>��g�b�C:  6�]��b���s��\9-n�{ao�l�H��������6HV��u:�]U���J��������:=V�l	Q�J�LW|����C��<,_�s�أ�T���ۄQV���&�Wx�4�M%Hp��z]��:�~��g�G�,us�;���0�"��1����Q��m��a�O"�ω�!]�\O۴��Wk�gB��� 
C?�C`�َ�����5���+�����sB���˞Lug��'�/N��ά���+K�;*�MC�@//�o�J�ŧZG��.�#\�t��D;�.wk2#\��U=Y����dج����whz��v�6��N����Y��Ӕ����~�_n`��Ĩ���4��/գ���a�������6�zc"6�1�V �3���{'��}u6��(��X�K���6OIԫ	���t�@�������9�/p��h�%���@:r�o���y �Y�V4�[Up�߁y5;Su��f\_Ug�'t���������s�Q�!(&�8�N��
��Gԙ:�^d��v sD?� o��H/�t��������{L�H6V�ಘ�2�:R�I����dw�n��yy�m��'*�[�վ��FpH��	A���q���=M����L�-����@ON�<l��/,'����pv���-���56љ���]�LA��B�S����M�},��!�y���͝��a?_:�V����RA�^$}��[�+��mf.��#�ә�' "�GyL� �r����>��˯_���w;0      �   �  x���[��:����ө9ul�px[l��*�J׼D��B������tM͙�����o�콲��Ww{���`�؂%����b�
�v�Q��'9� �>���k��4�B��!�K){Br.��چ��/�b���LSFSQ5�� �$9�(��=��2 �lٚ��?E�`9E�jL��e�}���Le-M������H�>�&����	>� @Ff�4dM�4�����b���f`0�O�ࢰ@}m��ck�~���Q%4 ��	�@�2\&����Cu���&�Y���p4z�m2M�r؟�L�8j,�O��l�7b;��rF�E2&�j��pWe���$�J�s���XQG4�ˊ��_�bE�����B����Yuz�K#kB?VC�6����J6�8���Ϊ�QĴ�N�Hl�_"�V�9�c��c|1����,LH��8+ł�6�VQ�J,[S�DL~֏��!�d��}�%B�c=�!����z3۰e�V�&6�����y1<X�#�3&�F���\l
�J�I�/��;Td���{	�wty�p&��4���+"e����6����e6�4t��ALX&j��BѰ�ٲ҄2��ye�G��R�����+��B �U
��?���������L�{I�����4�y��.ܭ��ۻ��:�.�h��m�����K
�4�E�}z�n�i���� 8�͌��p�vOt�/L��^RSa3_�eM���9�����i��]9c��]{gu/r��\tcE���ߨ������)����F��������g��y&��Fqȉd��E�YGĖ�5�L�p�x��r�{�`D�W������K�>&#��&��≟OCc[L�8��g�������#-�V�>��6��	�6tđ�%�Ī�XHWD:~j�'E�D���jc|�Z��w�F	�      �   �   x���Kk�0��ͯ�vHb|ĝ5:��XGZ�MaR�2�4>Z��+������rΗQs�B�hr�$��r>icX�d��qꃤ�b�v��:WeP����ʄ�Ipy�h
��:�����3ҋ �����x�b�/���PL�M���EHH����(�~o��{?�c��^�J�εn*+���rn�h3�_�\���Ŕ\�^.ɿFw����m�2�{!u�ĵ��ưV�
���bR����>j�lB_��^      �      x������ � �      �     x���[��HF��W����C�@]��M@�؊���""*^~�`��i	F���Ą(�j���v��5�7�@�t=��2,�����e�_�NXV��S��N����k��{�6M�1�9�i��_��V��xڣ	>_�\���2�蕡_)3�g ���w��j�;�s�����M����\�"5[]��8QI� $�2+NU'�(���E����0<JH���Jk5�]�T{��>�����8L_6Co��l�IA!O#|�R���?��K+���$ũq�����hm��1��3��7,��jʳP'�XQ�JQ�?���	)Bʂ5��V�!���7�Xt��i��x�3S�$��c�\���c��>�C'q�]uC_������h�4�A������C�fF��2�TJu"���p=g^�&�e�����c�����5^|�	���gԮǹ�Y�s(٠��e�+�L��ޮ���'�t�n$�Չ��c��J���j�)�C���XS��\H�}��U���Ph�ñ�/L�ވ@eg��&�NqR|Nd!��S�t��D��4�i>�N+|�0(Djt&Is�Mf����S.�����z�iJ��x������{3C\���:�[K�O��y�����1�FX0�cE ����[�yyȷ�t@�^,���0�[_��V��(c������E��獘~<>Tv���O �B����K���ˉ2����j1��B�\�WUҚD=p����[��2i|Q!T��e�E�N�,��Aͳ��Y�xX�#ہt���/�4hS�1����GB��t:�"�Ds=�cE��ե4�%=;-F��Ӕs�ځZP[I��Z˵0�4��i���Eh��j�����Tͧ�_�"�B�GO��̒�����b|?�����[6��#�#��H[@r�m��zK���G��iі���*��Y��f�/-+�"'�����٬ްש��ɘH�i����,��*�S�gH��H�Z�%W�-���/϶�G*V�O):�=L���G��V*���R9�      �     x����N�@���S�%w�3tfv2�? �"i�3`Q��N���&.�]��͗�SU�Oiz�:��vQ����,�1�Gz
�@@pD D��9�L��X�`�_Cc*�H�K�%�PŘ������lY�IǫK�vܳ 6C��S:z�9vԹTL��hWRk�}���8����Bƺ���wy�M��"��K�X��W:/Y�aPO>�}�]�M ��wչ"��=!g���~��?Óf�� �_w�b�EQQ��7=�q~ ZJtt      �   �   x�3ȋt3���Jww(L�4(-�����M7�H���46 =�	�2�]�,]<�3�RSK8��Ltt-��,�9c�89M!�
J������3ͼSS�0�0DXa��
#]��VFfV�f+���b���� =$1�      �   �   x���Ar�0 ���)z����� a�⨌�����zz=��~c��y��"���j�M셻{`'e��G���7�p^ED�	�Rk��NҢI��!���^(]r�D� ��K�l���wߗ�����F~{��l5_��a#�gEܵ�Lf���WY(MFg���ωtA$ѵ�/��
�}��n~T��|�H9�J��B��al�      �   n   x�p�)4�.�p)2���I7��4u����01��4400�bN(����_���Ι��bPf����ᕚZ�id`d�kh�k`�`hhelne`����i 4��+F��� �/�      k   �   x����j�0�����(�Ils�6��ҮS�7�ۚnu�Е��ׁ�
�!��������2�+�z�e�}h�qp��;lM�
������C�($Gg��~`PD��}��&D�8����b�J��e�*0��Dw�Rv�e���DL����&z�r������{vN ���Ua��V,����K~�:<ܗ��yf�\�ҧiU��Ԉ�<���ż �D�m����p	Tr�M�e����t��U.��i�}B��N�      �   �   x����
�0 ���S��f�����Ea�"H�MQ�r3��S�����\�Á鬒L�vS�����p蘸�ٖ0;��#�)���1Y�6�*�%P���H�C������!>�(D\��&���W$B��2e�u�U�8q�M��ZFK|�|�\������z$����Sn���)�f_JY�;�s�R��kwA�?P��U      �   �   x���Kr�@���)r�y���f4��`��Qn,0>b$�U�>�r��^����M����s�.M��N.�?��8�I���Ԩ��%�#�j ��F,0QL(.`� �v���>�����i�o�����3b7����_m�V�^m�o�"0���t�-z�@l�Y��2i������~�z9��"���|��=<iBe����%p���抳+MZz��<��[�      �   .  x��V�v�0}N��p�IH���Zk�]}QK[����� E��q�u�''{�v��R^K.�S�4�!��O1u���I*S*m:� ��n��0B��1.`�3�)�����/���=�.�ŕ�㯍�m�8V�+`��8%тL)�͉RHv`�k ~��.t���IG��:�DѤ�o��	��;�i��˞Y^J�l��ڢc�3M�7�V�4�hF9(�"ԩ��^
����KAKJIcN�VZ�N^��P4� ���m��U��<2j������Ô,�w�_���w����4�㬮�����D &dj&���F���7%΢1��CP8$ュC)����,"���m�e�l���/D�`�����0pvhD�#��F���si<��*�2?���h�2�)�H��iK�c��A��(�Ћq�0Ǟ��l_u*�&�-��&�gx�o��R����v{Yy�}N�L�t�����J�1_-��.���b��d?gȒ���n6���U�䰂G���B5�a��[S|iR6�p�b
�6�N�zoэ1h��0�:)ѥ� ��>�dM,��H�O��sU�-��}�TT������t�Ĭ���,s}��٪�E&_��#�$����f�$gX�L�T8�:��~.�O�,ܶZ���[�� ht��8�M�U~ݷ��;|��XI|u/P.sL���:-���h��݇j�=D�����꾧KcO�n�(�AR�%r4�g!���?�9~:H�]��;K]j�儱;��V�5��ìӳ��}dyؓ��lN�~��,�C�^��J���x���~����۪l.      �   �  x���ے�0E��W�h%!	�rmT�~eD�(�~����ӭ���PP�N���>��8]0���] �-�o�\LG�oΗ �1�:k�*�@������CL�WzAL�H$����+���r�eU�'�4�b�7��XwTY�N��eB��@�?�蝹P��i�(ޝ�g�CM�u��D�KG u\�؍�����������Z�EBﭳ=���稻�P8�U�����]S�#��=��zlm��m�Z� }�� (B""���k�'C����<;�X~uՁ,(�|���%C3TNIͰ�-��(B"Ə�׾U�(�|y=%����`��IO���Ѣ�c)�[?&�ʹ-�g.^)�C�����ck�5�IX8faZ �:��`82Zj�c���d�eS{p�'��'fa�P,���_je�pS�qʯ���E��^�s7ـ��0�յV4�l�y&�~�K�j�L����Ut�b(R���[@�"��@1��M?�Hj�,q�2����L���\ g�i�kj��=i���_�.&"�Q#稗Z � �N����5�:���� ��[�{ؖ���
�ߥ�~|Ք�l�S")�wW�D�����;Z"~�Ɉ|'��'1]LS'�w4\x���f�H>X�Ou�0��DB�8C���������q������*��O�2[�      �   X  x����n�@���� f�`vDQ1nT@PQ�ا/����;��sC�;��Nz�m�M�ԴAjl�S	Ȱ�p5ҹ����bKw`������&"��� �2@��.ϧ^x�G�.� �;qЖ��XX�� �T�F����V�A������=�n���>B�!%���IH�tiw�:�i��oM�NM����5��b��ȩ���u:�d����s)�+�m�F����4�{���߮�8�\�՝g[��a�{5����+JK�՘)+�$��3�%�Zo]5�pL����վ�}���iQ�}U�X���^q��[�W�M(sL����h4� 'b�,      �   �   x�=̻�0@�}
_ ҫJ7	��P���d��y|I4��|����Pu�l&���WC�i�[�:�$>YC��)���m�)�C�0�Q��`C��RI��!�S��c}	���)C�ܵp؏�r��]O�#�:"sic���l%�b\�/)p�c�?�t+�      �      x������ � �      �      x������ � �      �   +  x����r�0E��W��^$�hK�f�1S�P�ap3$$`3}K��`w%�\eJ����{R77��eQk���؈�1��`��J�9����@ �;���@� �X�5.נ� b�p���@�?�m�7��a�[���8�8��#fI��[� `!W�����(`�c5_��Հ�� ���4E�7k�4�P�p�J����a`Vl������;�F}R��O:D,�$��%�1E�Bn��}{��u�7���W~^q�(��V�@�	G�s���~�A�*qZ~�tu8%q�W~\z�EX�����$��ࠃXGS�Az�{���v�~�N�P�,=I�B�g
w[]#�Q7[�.f����"q\/�0�w��Q�z�2��hC�
ʽ߽mq�ws��VRsM�V4����`�F�P�i{xY��]4n5%N')D��N�.���F�����B;�zy������R���I�{����"���]/��"��\����.�y?�?�Z�	$&F���w2~����݌��gz�J������J<Vi�^z�FgI�����emkM�eR���(�T$�0�H���(�g_x���G�f���C�x ,ޕհ�$�'e�ةt�i����"����0�欃,���I5X�߫QY���Q(<����o�B�º�cՒz�64-�`��)�y޾�ÈɣQ��)	�Q<gB���=��F:z.����/"=��V7V�ӂu���f��IB��鳫��W�Y��6���**���������u���m9 �9�T�e��Յ�o0�e�/>R���4�?�	.�      �   (  x����R�@�����gwY4��3���0ƛE6���z��љ�i��\�9s����a�^L��_n��#�T �1B@���������J˾uǉ+D"TG���̤�P0{ ��tUŋ�:pGYj����4��t�)�������fb��M.U�z�J��Ŝ�&�0_AE�X���
��K��@:/v����d���1iKe2��7�.�2�M*�����rx��V����i����;���^�#�՝�t~��?d�ɼ���-ȽW59�y��*�b�����i�7�,��      �   D  x�ݛY��J���_�cO����	�ƾ�l*Ƽ�⎂���Ak���Z=�tT���w�<yz�ń|T��$-��L�G��H�}h�y!��Ǯ�\3��l�d!�B�_�w��L,�T6�FT=���Ulk��-6I��r�7Q��/.��T5��TGL��r�	�";0��w�\�G��W�y�;K����ŻD���/�G�G�އKk!z�����#����x[��~�E���.�mh�Q�����`���O���n�������q�3�V�M�T��0�B�F`�_H ?U�i:�Q7���l�ɪ��\��2ؖ��W�0���䨇a0�c}�%�Ґ��
*�$م&�&I�˚7�J�����d�%us(��+l�'`j��kTP�rv	*s[�I�F�m(���	�U���gȏٖ/���[��Z.U��í� �=41g$5`�G��0ق�`g��ڏ�22�1�ӕ��n�l��)�	f�U�{Z�W8�c� �![��T�1è{U�`���I�Z/7w~l�=��\����d6��D�����a����tVqn9��Nn�l>�FN�9�鴌�@�<�	D��b�F+[��!�V��Zcg'Į��r�#oML�g4�f�l�)C3��y3|`[5���LmL7S���xl�\T懞�LHޥ7el���;�F����td���M��� v�d$�:/�=�uO6�$��f����4ل��l��l��U�ʊ���*�3��V��:��M��#�ۺ2�vJk��-�3(����X�;Y�.C�$��SY�h0xןr�x�0@����`���J�d���6ro'�˛&�1��Q'���il9�]ħ��D� ��U���i��e`�d�N����tF�]%KڃR)Aw���y�֧��ݽҾe5��{���]O�?�2���[�.�T�Wx)4���uQy�{�}�PPut6������1�~8���p�A0��פ�,��Ǌ��<5½$�	�;Z�υ�� �)���g]C�Zۭ�K��$�
�	5�z��lw�^e�䪨��P�m�� �j��h��:���)ފ�Y���<��ټ䙿�0�~��+~�T�� ��d�7ρ�嶹f?\�Vq����l��9|7��n��1�w�=$�}�	՝��1�Y��ە�jMUCJ�4��|�L��3D�jup�M Y���Y�5�@q�#���OQ��U��}�L;XţC���OQ�f`�G�J$�3�!�g�,�p�=1�Ґp�����4���Ӊ��X0���I�/ �	�x|�ԇ={��\��� �p�2:�E��u_$U�~�)-ó@�:ɔIc9f�ͤK."�j�E�A?�#Ou�M�՛�a"�������ܥRA���=��7Ie������tl&��5PɅ:m��z0����ԛ�R�<T�ʅ�P.w��:I|�\�icמ,p����]�HdK[J	�ot�+�����g�X4��;Q'�oMO��
��K�Vp�hb�g�G�3jj�:g��	��ޅ�yܜ|$�)�*5t}�;Vs':k�ut�p�Y9�<f�|�K�dޜ��zR���[�%K��]0�5��֔��Z�߀B[D��8P����J?%��a��hq��ދ���j5�Z�e
�����E�]��5����b7ݎ���:����YԘ�!�"
�
���.�L�vF���	 ���
�oE}zܗP��&R��%HZe����ST�Q�߀����i��q=��ȋ]�Q��E--�E=8�I�H��T��\�"˳)nPP w��:�o�Dћj��8�Ás�(�@�W�"el��gy3�s�$��̷Cr��e��ߡ�FXQ��
��L�l��
j4��N!�o�x{�C?r��.O�)���$N�1o`��	�wi�ّ�8c��6�"ѓ3���.s�v;a���ᬍ���ōg��wč�"�1X���8?V����:o�������\�Dk��|��^GM������/�P$�V�n�T6�����,m�Ԩ�܆�W�2�S�Z�8ϼ����`�~��n'崳C�/ ��[����OO��;_�.���A��S�2A
��ka�Ж���Yܛ^�j�:�b�"�\+���oxPea{���2��+j���I�;��xK ����;�@�?H�2����Jc�����r#]y)���5�8��8��L��� k��	��p��Y��l��ˮK9�!���՘�%՝��AJ6a>W�WF��򣗐�]����s���b���/!Ɗ77�<_�z�TD�7�$��Y��
|_��@|#����4����d[Sl�dI�ZY�Cc��e��n:���ET����Kշy�r��_�Ϙ��C~���-�r躄"��k���:W�ٮ��ZӘ���/�5H��S(@��sjo��,�IT�������b65�������/~����E�ς8M��z��3����P��Q���.ՖxBU�͞��Vt�;<�%鳀
-���ovX���c[�l�['�<��s\�q�r�_�MU��F�w��e�5��6�J��7pŊ/����c�=��d�v�D�}}��i��ĀSō�i����KÏ*N��4]�u��C�BpS�è?Y�q%���	X��z[,��~�b�yš�,t:��R����&�D�o����##�Z��i�`C8}B]o`�� ���I"p��!�۠�,��6>� ���8�8�kس��"�k��Q�s�Cd<���Z��e�}"���Ҿ����Üv�\��TVgs��C��~�D�]��h fe/�SVGcWa�CS�FN�y��3��R���j05�%p�Pε1	 �VM�yl⢻�'�/��n��w	�Zw�0�'	�95��q)���y�HW��@�&�#L����6�3�6���l��FQ�fؘVO!5�Z�������^�v�f�|Wm�*]��)�I'�ɫV��W=Ǳ
�#k$�$H�ƽu����	fLO)�o(�,ôG�j��)N���QD�'B@���&\GJ�N����Q6��s�8�XJ���'N,Uj�as����Ww�Ǫ�H����Y�ӡ�k��oZ�͜�j��H?��:��oA���?~��/����      �   Y  x���َ�Xǯ�z�z���sX��e��(Ȣ�����VWuw�t��2�	\q ��!*������SY���b�=��d���g銣}Kw^},�-L�*�2���"И��#nݩ��
p�%ޕ+3��U�d.���/�����J��L�3g�,Z��;�3f�?��i��Cq����<+%�����c�ѻg��1�>��f~׊�lG+���q�n����Y�K���A����֧��t�:�g�&�ۙ6ӕsTv�����0����j����/�Ӹ��L��y���# =&��wd4�_��|��1O�8F�	,,��On�b�A�s�o�wj�-b�{v����㟩xTakF��O�W�HЃ�������n���o�y߰�u��$������ �Ҳ�v�q��vK��R�\��^�'�	rx��}��j��H�Sc�?$����HS�R���ޤ`��������Ai����߬l$ԉaf�T�t���|���,rD6Y)2P6_�.}�����;k���y$�sc���h<���i��:lY��E9`��@2J���V�-k�]N��z�x<��B�z�Oɬ��QC�6�f\f�Qm�a�r�q7S�4�ڤ�Of���рe,�@m*�m-� k��颛�MoҼxcJ��t�*�۱�8���i�� �W�(��k��WN���%�p
��vRr�N�0E�'�ReE~����lZ��խ�k��`i���Ե��a� r��޼
�����{s�gľ��KF��~�-5�d�0����$�Lm�ӑ�i"a��_I�A��6�1Xm� �����S㗵��ߔ=0�'\-5��Ş�p�&������2�YӡTU[]��w	`"��%lNU˗5�U��☉�{�N祣��O\8.��:�y��$���ie%-�A��?�= p��/�d���B��Z'f�����a8�,��K��7e�1��^�"�H�:0B¿	��}!/f��="��I���H�-
��o�?b"��*�#j=_��v�Y󙛓& �vIhr����r���¨T��6 ���,�L��:��w5����rB��9��}���� 8L5�������?�������/U�t�      �   v  x����r�@�5~E~@kFv* �@y����A����HvdAY��S�ou��3>�R��-�$cZ�i��^�L��c1ĽX^c�OF  u�EP����8K�4~���߁�N�_!H$E��(�z��3�v'9>b��s�x��^<��W�HBSGJ�)~�W�x{1e^/"�=z�嵋Y*�^���6A��L:X*4������s�x���6��<�E�٬����tq��2��ͪwz�~�9�%��wfc�&L��ω����L^|ߴ��ᡀ�o�e���U���jt�����z۟�Fߓ�<-0����gu����Ȫv���x$��r��M����jX'��N���`�޺��Q�P_8�L�ﭠ0�_�n4~ �SM      �   �   x�u��
�@�ϻO�(������n JQ^4,5�*z�"�4�\��k�u��2�W��9��-q槙��:�|1$K"+�����y~c$L����`:�%!��E:��M���T���ε7�7U������8��(
%��!HJ�J�߷�✿�3�      �   �   x��v�L�2�3�,�J3���+���*,�q6�0��44�3 ����JK�(��Jc7άl�J�D���
��HcN##]C#]CC+#S+#�?N����䙚ꑜk��D-�̬�l����� �v8�      �     x����r�0��ǧ�위pˮj�m�KKǍ�V�"��.��2�IV����3�A�����W��dX�Z��no�|?���	�)�����+c�Ȝ� �z�pi����L��q.Hĕ���6�66�����/����цDTNg�M&3�`��E[?�=(�[�3���w��p�Re���-�8ĻJ8Jhp��ޗ��7�\a��m�� �%�e���
t0���dj�m���'(hZG�pT��ΞK��e:��IR��N���!X��9iv�弳*f�?H�MFP�_7|'�3�K�������|	������k�h9%��8�9�eb��5�v��9�%�iKr����[���Ы�b����b��c�$�j��7ϡ�A      �   �  x���˒�J���S�LUP\�!rGATb6�"
�(���>'�̴t��1l�`�}Y�_I�6<�3�6t)��Q'��4�n�$ I����x��HD���D����#����z�܈B#	�^�W��lm�y+�sn�q�Ȟ­�`��[���\��&jD��8�E]H�O�]�!�+��îP�����`x`�Ku�0{�,�����P�u����D�g���$���#�}|wWrQ��T��i�
�M�,�,�zD�������^Y�~��&�޾�lJJ�WA���\���r�}�{h'��7t�19p���k�t�*`6���6O�89��sǣy��c�1Gݿ��V#]o@�nގS'�9?�x��TwO������e�i���]�U�l���A�[:��M3wc�Zp&�E�c`V�m�Rjn�bat<�N��pJ�k%�[�X�����K�3���E�C��u{8V��,�s��	A��;������C܈D��A�UnW�?V���������a(��&�!���r��Uy_%¶�0�m��	�>��C�yX=��[�+K�����<�
�S��3��b2Y��)���`�s�� �J&��8:�`�p���)r4a������Ŧee��`��w��~��	ǿ�7�L���x�&�� f��u-/�]Ƌ+�	<d���qH���~װ��0-��Јrl�:���3�C���V7Gց��hP������4����}Q=����8XcT�	f�.ʫ�'���M���������Mr�7�>�t���{����Ʋ�xϠ��q�Ӭ4ىc)�.<P����)}n����M~Q�'���hL�}�x�7�}"0#G4�/��mob�v��T���t�VWړC6��r�0�y��1֝B/uj)���S����\���3�#�|�9��~�Wncč��c*JC@���p=����o?h��:��{��{i+��ul�@�d��I7�YΞX���O��:ӊv�2�����
���4�f�
t��3>���S�XWwk͒b}{�@��|R����o��߻��'_�g����|�$G�/]���ek�>���*��WS[ë(�zJ�X�'$��X�R��rؒq1^w8:X�Xf�x��tH���qu�`�{Nĸ>�y�4�!�]��� ߬��7�	*�Lyk�\-����JRs{���������W�ZG]_�H/1��
 ��Sa      �   �  x���َ�L��˧8/���b�ePE��dpbhy�cw��x��TR��{��+�O,#Hm6�#y+ k%�oƽqQ�@d�N]��A>�,��'�"��4E�7H�����	��!b�Ft����@$�3��/�@����M��2R�v��ݥ(Y� �5ԃ���]0��b��yѯ��Բ��;j�v_�f�ޝ��n�v��̵�֋{`V��ҶAtp�^_�ɠ�t�٩jZ�#o}���kW��6s���;�����q3h�Ucn9�IG�^55��*I;�^���d�W%̃�30�0L�8q�,yV�;�0M��ƙ�&+��F� ���;������TS5]n���l�<l򃜿4
�F�O?h�ӣ���A�D&�`�%�l�k�f4TZ�sG%O��.WѬS���z��3�g�X�VT�k޽�k�T��oT��ZU7� 1��\�:jOL����Ӈ�~����!�����Q��|�;Ec��P�ՁeBS��I�;�ש�L�ʐ�C����j}
���ú�ϓ�4y�Gj&�fg;��6R �<�_���N���V+���ZE�mMŖ��Fh< �u�1JeR��s�Q�4Y��f-Hrq�v�ZVӒK�.�}���J=���j��S�>g��L�q��HEj���ji�2 �%<_*s�����up>]}*	y�-�|���Y|݂؝*i0�f�.��
�ye�4?D��z�Mw&��%]s��*��mǶ7�D�ݴX�u*�:r�XqqBvX��e�a�6D���`�:U�3p��
���`q��G�Q+�B��w�;K�ש��K�Ur��Z* ��l�=g�ؕ7lx��&���ȵx��t(�Q-�OI����qn?�n���ax��%)��IZ&�LrA�K��Hg�0�`���J����`0��>�      �   �   x����N�@���)x���v�V]�,Q�D�I�t�vIj�ѧ�x����ɜ�d��&,��*���nad��e�r�K�5�ޮ����C�a7��ߕ�؇�fY):D5 D�9�����%���)�Kׇt�l]��m}1���v�������\�H<˸�(�T�fO�����:�i7J���x[9q�V��Ϲ���t���m<���)C���
�T��7��f�̊r�      �   �  x���Ɏ�J�u�)�$��
�1��`3���@��`0�������*AJ�ԖY�Y�q��^�26fK����Y��E~�7
;�PW(�׮[%��� $(�;���n��R��� �o��F��@(@V`�Gy.=ϕR��Ѧ)&p��+��||��`-g8�Es!���h��/�G�(N`>ˋ�����u��0ӵI"9I<��֑������m�2��ў�;M8ם������E�� "�z���=���j9��B�Y��R�Νx` �|�� �O�j��"���k��3���ȕ�R��D�S6�?�܉Qz�ڭ}�[���U����S��8}|�_�y�@�z�[>&Vjb4��E[oRs��w2gA���o�e�ں�H��:����;��C�mWn3~���;�=�1����=�f7�pu�e����*]�3��'�׏��-v�~b������!�����y���le�Ec�3ݰ�����u;t>��D<r����TpX��̐�e�d�WF	�S����� %�8-���^;��΍nF[7�4����i�qa2x��?Je��N��ŴJrr�IB�����U�\7Ǖ�ⴡ�>�G��tQ�z�#G=i,��j5 ��:��9�,#�5�^����b�(��vů���*��b%���.�կ(S|��E��G���xc�`
|9n�@��}�?�/�����C      �      x������ � �      �      x������ � �      �   }   x�Kus.w��*5����+�t��/�,J��4w62��s���.�)�L�L�ON,.��K�420�3 ��t�2KO�����������������������!g�'�!T}�W� .�!M      �   �   x��N��0<o��/0mMϊ��%FC��Z0���������^vf2�;�t_��2�E2����.~�/�����ډ�����u��#/c�J��tS���`��ހ�d|�ש*�F�V�|����=f�ɖ�_���w�T.�r�	%�Nr�����#vv��.VQ���l�k��s�E=�(W�      �   �   x���M
�@ ���)��2�8��۴�LM�~p�a%�i���pD� o�v�i����X��E���i[zE)����������-��QB�
D�L�	����a�ox��2�����;ݘ��Wz�0~�aB�7���وCf���Q�tL���k�7xT@/      l      x��]�s�j����+��05S��˾Xu?�) ;(���
.���N������M4�5��cbx4���s����id&Σ�@F(�`D/b:=�pIPs��i(l� ��^�xgA��*����3B��*�ͥF��6ts�W�ބ��3#4B&�g�5�
`��7��j:��K�����<\|�������@.{�x�o�q�0XC�(ݵ?�� x||��0Kڃ��K�<�����T�Q����ǎ�<�����C��a�< 0���5�CPC���#�nj��k�Ѧ��ΦU�6��5�7�ɻ�5��#p��(��UQ��jW��i�9jв\�X�  �����~g�6ئ��ktm*_� O�������d�t5� |��߈N�.��qc-i�++-�	��ŌY� �gá��VC �(W��aNYd z�{CwDp+ؙ�.>M�M�1)c0��є��>�K�BX&�\��R�rԌ��1�&g�h9|�MV���\�կ�$`���jl�I�5��y�Gk<�,�gEZ�ٿ�5�V�GE[��v����ٶ��jf�ax�DQT�5��>�k^G�:H�{��w�h��&6��6�u������)oZZ����=h��L`��T��-1��&�5�������u�80=@U�Ģ�ж���6�rO�� �h�H�r�y -��u�t冣��רn�=�vb����	�TR=J�r��ɲ���'E��#�Q��WW��XTt������+Am�[�gnBra��+`�m8��	�^MK��#+������P��~JUT'-ؙ Kp7v��2�j�t�L'�,��q��P���b<�Mk�t9>D�^5im��B�� �Eл�
T��`����p[@�q�Ѳ�^�l
���nn����Ě:�ᥙؿ>����P�D���#�*���=[�w:�al� �G��g;�y�@��QG�z�${ W��6�t��Dg{o/%��m$6�[^�&�(E�C�Z���:�{���P"�v(��Mæ<3��:����P��7"����R�$�� 4Z�iz�	��q9 �=l6��h��*�Ũ-�J����r��Ek� �#�� ���S7]o�ao�@�_	 �8�5bbQ�l(�u���B[<��3t�G�7�7�2�#X�9��s�[1�\��ѯ��G<����5Ykj5�-˼�'��z��Vk�&kf��U�hE���W�
%��D�ғ OL�F�7�+f`֘�ܪ��\��E������V/e��Jd�1��,C�"k��i��Ѳ�����4�K"����u��&^��5��#��ܝ���f�"�f�A8�]�;Y@I��u~�L3XFKe��r/C]�[C�}�6$z�2�t��1B+�T{���n�8���8�����,]�k ��r��M�rBп�OR�m�t�|��cw�m%@��95�[�(��ww�v2i�)>�YJ����r��E� ���c��5�vh�w���Bu���sK�N�2H���eBP���.��*�2�<�m��rT*E_�~�j"}uٙ�ݡڤ��	�3��ӫuؚ(�C�v�X �g�F�`����u����'+���^�@��TG�:|�s#G@0y���d���Ftq�J8�Op�j���2 ϸY&6�HPcc�L��Bd�R��p��ɏ(��Sz�ʓ��Di��3O�	3�h��0,��`Lrs��|[u!JH�3����}@i�:O���X.	� dh��B��X^Nā	�<���Ƙv�5�;	��2	!,5?F�Կ3(�1�Q�t�H�����鰧��{?������:_�xZ�^F���ä��G�x�����5��T�������Rd[h�
�t>��|C����M��۔qoo�L�-��	��$���̺l���q�J�ѥ��}�9�y?�W��X�ɠ�F����0R����O�6Ҹ����ġ��O׀��d�]��tC�p��~����ك�=���ђ=×[=��zO�'k�ކY6n�Lb ���0pd��Q��A����;U�.-�[��]2t��Ǎ��Љ�v�oH�C��ɚĽ�f:v*����(#yA\�:��J��s���L�CM���B�0X��YG�'r��M^e��fr��Q�G�"�.V�^�I�6��I��`ִ.��Ң�e0]c��a�D0V�߆������E/�P�8��j'1�I�+wPL�F3^�Cl�N[�����JB�A���̩��g���y��a���zXV����P��3@O��o���M�ep+���<�V�c���:A�o��@����xk��G��)����ʺ=����
a��62���N��?&�p�!<���/T
���t:��%�Rz����l��̆��Y�0VP2MtM����H���	d�7�Z�¢�[`m��F�DcoEؿ`��($PEڐ��V%w@
h�Y*�.�U���g�a�؊��8c� �a>�2��|��.�ktl<�+�U�գ��?�8Z5>��=$L���3Y_�q:��ZL�a�oĮfC�Sl�E̅V϶�����Cv$E�Ƒk;�b�}�#x�﬈�t���\u�\�K�1�-�k%7���3�$g�j�M#dsw�ǹ�]�ɴ��:��u�$+Lu�9)�	k�@��)ʣI{i5�I��6�,������%G�S�H��&�jPՋX��7�ϻ��I>��i��I1-����o��l��!���5ԃ�l�f
����Ȑg	�>��/7��*���B�@���%��LP����ؒ��P��L��gtD?	��F����3� �*��,Y/�z��T��@�F��fyM��R(��b@b8��gh�~��t��_���@��nnQ��f�hQ�q.�=��Bt�*���v:x����z���v�^�Y���P!���64�&�o�Â}"��p=�j'���������~���������KC_x�-�J�B�n����}�C�m����CͲE��=�vl�k����u/v�y�O�Yog(�A�HG�tGx'0�-0�S��`:�3�޽��tP6��,t7\D�%JT�{*x����P�Xj��,��l �&�m�$KtqR}�I�.�dK2���U�D��w��*E���va�N�-�g��_g	���1!�k���O-����(P��nE�ɔ�����}\��(��N���B�uقH/�D  R>�. ����6U�Z�kX+�M��u�ϳ@��翼HJ������V1D0U�1�僑�S�����a�O9��8E��q��~5P5-�b��ɷ�}�X�s���+i����f���C���p;n?�����g�U]��'	����nw��I\��p���DER�>�#�}%��
 ���� ��,��o�}��}��!���(�ꉨo���4�5E�Ǯ�r��	�*U���\���t�>8�d/{�p�I*�+z�k�-y5��gw/d��D�#��:Y��S�������mh���I��.R�7�L#'	�淁8��1��K9�)�g,i��zw�{��&����w��_�2ϛ��AE_��Io螛��*��2�@�G !��о�F}x#��a��gn|d�H����rB����PT��J� Ƶ��ҵ:[�
.��K��u�윖�)��̗�|�!{[�9�"Ǣu��Uc�aK�{+�|(�G�f#�H�+I�Ф����>Y�ឣ�&�"ڧ���0��(v����㳖�pu~̧��LC�$ږ�0 n1�
��X��$��7�:�)&l���Ʋз��.3<莛9Gw��I��9b��jR�JYQ8r���S|8�8s8�La����Q�ș�e��w(gX�]'|�#�S��xc�s��o��7iM�mE:�����&���㤙����g���eS��~ֆ��|�w�[(X��:s��t��f�ֶ���Bz��?1��vϰ�o���=��0�*�X��� ���7<����@Ϧ
�� ���� �:V�!�@ƀi��"Di�]�p ~���[ ���� �`��.w�l*�
#Y����]����#n+� �  _��=a�3Z \ߢE�y�7Nu8/�N:�.���LP�����p�`x��k���y�} ����TRu�ɭ�7הVa�S0�(nbv� v\
x\�#8�I��=�ۄ�s�u��7:�w��Ï�nk������7JFWd do�AR��!eK�]���~�������a��?���� ��z�mw'�>��\��.���;��3I��i	�����n0)�ZCC�h6G�.q2�:Y�fmd���)���s�o�B�;�N��}����'�f�6�j�cg;=�bCr�t�> \�9�9VG��ח�z\�12[jN���hi�����":�fd����O���)w��&�Q��t_��o8S�_Ϭ�nA�bOs����&b>gb٘��C)��ܯ���~�|y�ȾR����u�W�$"�� �S�*�T����y���)�����|{W�*�sZ��	6B�x��@T���l"t�����a���&�j��nl��ߋ�+A"��ǁ�F�-p�q����q���?>:���y�ӳ\z٧s�ۇސ?����0������>�h���G~�| �'	�����B	�!$�qo�s�"��}(|�����S�vo�b]���ښek�Λω���t�����pP�~��W������T�� r�Gy�q�i�5O��`�*y�Tͮ�4��j��;���k�hh��,O ?�1l�v�֬�����~�]3�exۀL]���	� ��Ij�\�>���]�&n%
*;�&�N����~'BTm��˨hu��s����$�@�PK�X����|��.d��`���p�������Z[��T�fMU.u>���{��n%��Q5����Z5�A^�ܺ�Qm���l<�VG}'�{�����Z�����"��˝1��Ӡӫ�xg���\�[+��)�Y�1.~�y
θ�d��^ؕ�}���<�N�M�2����6��<�
#^v?��AEɎ�FA�C�K|�� r�GE���ތr��/%�҉�\�M���k6������=3M��Zl36׵Y+k�Á�ibݝ��#��ތqo��|_�l��Ab�ZB���7���ʟ(V�!b��<�³<����>��s�{y�J�r�\��q�6B/h��qߊ�U]'�6�����?(��Yÿ�a������PayWR=|�9���\:�{~���ɽ&�r���kVz���������#xU߸6�q
�+��������_�      m      x�̽Y��J��y�|����<z�>�R�\���`6�57����ӏq�RU^
�af�#�d����Ȉ���$A��U�D����ƀ>��=����I����b � ��`�L�$��! �0�����B�+����|��W{E���&���l���W �ؘL��(�2�I���'�@�X�"������Q�mҬd�/��� ��0��_a��o(����Ń�t�jj�-ɉ\~���VhE��C��;<�AÁˏ=�Q�%h�`��M��A#��exV.q|C��`��p��I׃R�Y_d]x`T�U~P � �d#��_Q�$�?+OW�j�)�N2{rj�|�ꋝ�fvx.A��d�Xj��_�� A�]<v<�,p�������HWʔK�,LB�9�R���/�	�Y"y�]z�pO�>+�l*U_k_�1�Y0~�,X�Xo`�5P�<5F�pھ��(D���>�`�td&��a2�p��d�����BL^�_��������5mkliq� 0h�p<o�\a��Z�b���>2F���Q��5i�0�7�/����[!�V�W��I�)E�"� ��8�֦��dנ�u����ߓ�? ��&�X�l�]��oy�E0?$�䨻222`��nJh/�n�xQ��*��E[n�I�|���|�"�=Ħ�2��k������]�հ�yN���;�5�P��X镺;�"�A��mW.��
Ef�R�1H5�f�SèɜX���0̴^��x$�.r�H��dg�x��#�o��NCI{>����9c��v��N燊�!ci�t�X�z^�Fэ����cW0��t���t5Z|i�ԠC�:�0�;�y7d�9��Kw�X�u�x���¦���|\`�U5?�3�Z��=K��eTq�����l3��u-�F�Q1��� ��,�<@��tM#��1w1�� 8I�!�� ��Ԧ�6:���~����(��Q�_�Sƥ�����30���4��U�6�y#��ct0t8�ܘ�6��f��cz��8p����h�2��p�kmrC�x�܎��4����k�?0W������(|��B]"i�@-[);M��~�� �?��i�]��Y��D���3ͷ�
�F<�j�}u5=TG��yR���@�Ջ{"�f�)ƍg�b�>���U�bt0�вژ��x�����GZ<U8��,�8|�Z���v"��<\�����{��*�������|��C��z՗�ĳ$*�e������0��C�2t�X��`κ|L h?'6�������h?���\�H{/�S2�;Ш�>Y�F���)�kԗ4���b����C}9~vd3���l�e������ @b�ynb��һ�߃���1	��sg�����x�Xv��5��� M����m��_�~7v�+�y�5:Л��!��u�m/�@ԏ��ȋ�z��32ެF}���G4J��rG�4I�:2dJ���w3���˲�}�.��uj��^H'оJg��`«��	�w���c�?
A�
��Ƙ�7<���v�-mz��-fmP�Y	�t@��9NA{����׺�Y#�%�]��֧��������m��"���%֢4o���|���]�aN��X�9�^8s.�Gj0�!�J�Y9�ː#�T�w�h�+�Ȱѐ?�J5h�������~mw��UUt��m��{�S�<W�}2���/��B�b�М2���4����ķ��K�$��-����{���-ɞ0=}n�iI��3���)/�-Z-�1w�\��I�#�n�U/�9 ��hz��"4H�}��]7�ڜ�j89��G�i-�M���2��V����J���~��-�4�$�����
s2�{?\9Z��1���jy��9'8dD�r�7)�f��� �ϔ�6`靇n��--/�"^OC6��o��n��)-�DDy�Ѻ�I����?���%�.Q-8I��_����lD����6�`��m����!���$��l��L�X�������T�)z�{�WN��o�d���&�slz����t��W޵c_)HN�0�wCm+�25�G�9�2Mw<<s��at���c=Փ�b�k!���F�F7�3�W�hձ}�}�C_!���5���I���������LP/y	�e�6E�c�y�al�A��PY��4�TȖ���� �hi�ق(��b��CMB�[R�@/s��1[&�j%�� ����Ӫ�S��3`5�D
� Z�M���o�$��;ka8�x��0�c@PU6��C�-��b�q%���K�Zu(fm�Pw��6��!�氈2:������! %ZLy�����:��]5A� �����م��~���E?�v�@}H�����pW��6���6v�#��؍$:��m�t<-GO8ǺL�/�*�<�w剳*9��:���/������� ��p�FI����>iͰ��("�HW7����!�bpe�Q�>���x�#����v'�J�F[y3}��
_��^6�x�2"-�ߟr�/�&��C�x��}w�Y;�.��@X��C?`7�h�؀C��v�e,��BW� /f�y5��.*|�H�:�ǵ#�Ti>�#�z�&��/�d��a�d�T���Ń�T@�oF>TOdЌw�:-N2���ޫ_|�l�b�C���I�>_T�"�VfS��z|vhS�Va$hi��D_r��wVT���:ȴ�Qw6��g�a��ǣ�tI����i�A�ɖ�`	����wf	��s`D�LHnL�Y�M��tsX ��h���l���n1�>B�E���ǺJ��j�o��):��PG�O��g���bxY�4����gV�/�3qd9xw:�SKۮ\C��
3��i�� Yu]����$��ʝ�>����-+���"m]��w���^ɹ&'+OZ���u;Kx���	&Z�f��K��FYLǢ;; �<T(��pg�l�W��&�d|*V�CϾ���w@+m���p��O�������v�Av^.��KiA�Y}��`oF�bH�=A�cy15��Rۆ�,Y��qS���nXj�/��)P�����hgǟ-��[�_�M��� nN�!(�y�����)��I�U�)��qAk��p����lyG���lRB��
nL�Y�Q2C�����Bn��tVd��=4�%*��bT>%�~�;Pso5K�+�t�P�3���),珵��y������CX*K�t(���5}��?f��9;�.<�ap��x�� ʘ�aŠR+�wVnA�v.�#
�0�?�u���Ub}pd	;�W�ʝ\d�x��k't?N�Hw[U#�n�;�vL�4:~Vdu]U�ϔ�����&���;e��p������-�?�	���y��bN����t��7R�d��D\R�������^G��x��:�q������B$	<@��|����Y�hڙf)ی#\u�u���CA��:t��_�4���$ 5���#���܍t	Z�����n/��M1f�);����P��N�ϫ�K�b��t�<��P�佥2����^��֌$���5��;S�z���
�}��y~ʔ�ԨE������C��]�ľD�t�7Wd@��*�!�(,|q���q����Ϟ}���!����h;)F��m�pӻJ�<�9���l�o�&x[K���Gl��@VXUT���	�ǽ�v�����b}�N�̰��p���3��I	��3��S#�Ӕ��b꡾�
�َ�������V�����ݮ`�X ���4���%
�E���Vk�G=F��`�mn�:��Es��J��O�&��)���|7#�R��0��n� m�����|5Y*qp��jЙxKok�VԜX���Y|���(�����Ԣ��g��{)���CsI���-�rv�Z��Y3����i%l�i�D�ע��'��|��3鞊��|�gQ��(˫v�$�ܦۓ��R�;[c���F�`�H*"%PZ�TX����q�ߗKO!z���z��[��+L��Ч���|�Mw(    �YJ�k���Nϩ��
�+u)�!���`�Z���<�����4�	�֖쒑O�m� ٙ�O4z�DMި����^��lVp˥!n~��g��]�n�z�kY��2v{�1���b/�G��\lJ��987�^zh;�u�����U��Ǭ�a	�[a�����;X�Q�MnkHl;�-��|ש��`�\�GgM�Z:>r�ދw������8	<��֩����N��d�ӕ��Wi:��&\���`=q��@�a*��I������\ezq�C���m=��U�^fo�?��t^"JO�؇���d�64|��� ������;}S3�Tތ�mT��r��Yr�X-.gZ-LK�]��_���\;*M&�̛d�,��Aٛ�&�̗�y�--w2ߴ����j�u�S�c7m�Y�2U� �4^��:�T`U'�w~v��zW��O��sK$�S���ʿ�W�5n����2K2=榛�yEq���~����\��a�@,��t�c,{K��z{@4cW�8K�N�5Y��\ېe������7*�>d��Ȅ�1��I3�̀�"�޺�������Δ�����*�m����	�q�CGhXzS�����XK�͘QC�3���t�S��#��ˀ&� ��3���+=:�J'���x�H���C o��O$1=$x@�����?w�:yH����g����t��
�Tp�J�Cb|�p(���=y@�#m�{|t���>�<@�^���mI�����Z|�%Kv%���J�pJU���ߗE~�R]ɂ0;-t���`:|0��/Y�JWXI
}H�}�`ux_��O]������Z����~?,���� 9`�%-p�u���%��T��d��1�WI� x�7I���Į�L6Ύ�D��R?%�2m���%!����{_|����[/�6�,���A�@�3��%�.B՛���ɋ�-���a�VhK��=w!�������;�%��q�WU}ܕ���Ɲe4����8�P�Jr;��gc�ΐ�j���5�t�yXX���9�l��O}ԉ�f;2v3K9��52}���9/؍�8������l�����A�|g�{q:^�2F�D}0�g���w������ѱz\�d�}F��L��3w�U�2_�+�3�+�nT�0;Q�X���t�}��rs��jr�/�.N`c���?�z1;��KԪؿ��(����W�z�
�,�L�b86w�IB�ꌝޣ!��4y}ߡ�e'14�1�"��2�zh�/�[�_�� �"!���lD��)�Q���B�@�EG�B)-�L�m�kl���Z�"0�֏��A� �50N=P(���2E�B��I��\KU�e�t�5g�5��Mh �,s{@Q0z�jl���M���p/1���֭d�LBc6v��Z�^�X�M-(�|rk���<��Ń6[�]槨���i�D\���e�,���f$�J�����2b�ʁݠ��" �4�1��u�)z)#���FZ��ho��c�b�L[�ml�K/3A��M��s�%0��T�4���-�KFu�٫�7������N�������)R��|��d2�UYH��m��^ܳ�3y�Cy�e�n�}Cy2}N��|��������I[=J���$�����+ H���e�?P���(�8��9����`}c�p���x�W��'� �'���yr���y<?�*B���ȇp�������)�TUe�8<c�>��"m�:��l�ll+p�c5״����v{�]~��Q��O9h:���38���8��SDO��Vk���p(�K0D3�R�(Cr�qI�,VWF��|�N��B���h@ W�
�rh������N�f��W묊�W��_����c}�W���:\ɉ�(Q��!��(����	�] �Lw�~ck�a��*���Q�+v������΃M~,7����X��n�C��kLv�>��6�>6"��$e N��t�&8����{�0��(�	�����:��7����Sp;�P��'��o��|���d�K�M����b�Z�!ҧ]Q��-��~��G@�>dM��_�o�^Ȱ�/h���4�&_ma�O���c�w�z1�q��F��ϡ��G���`Ov�I���bm��yܐ��01[����2�ʴ�(u2�Y���i�Տ܈�l�f	�Rg�Ի�t�"/N�����lBZ�t�"v1�����[dKVk�X�1�	aR�fj�骠T@�[�˪2K�ڑ�؞�G��R��v��0�e�� ��,J�)R�ݪ��	�.ȩMY�s�!�a�^�ӖY�l96��h��#M��_���n�;HX�NI�f@���5,���Wgq*:�������RY�O.�ה����dT�s.�ۈK=P�s�	����|CP�t6�}� i�SI�@1��Ұ����4:�V�w%�4�~.�����e0��zyW��p�-����H�V#7������F�����sI��x�˃��^���W����$��U�/-pSi`�)���!�����7�!���}��*�j�ňW���Mu� |���~�^��)W�l�����|	��H4����A����B�Y)b�	L�'�y�>���A�ط��8C�#ɘ�����P(0%��^&�o���h>t��v�0�,��v�!�$2T�C�!�a����������@�z����eyT������?��\2��޵�ǿ���)�!�Š\�C*%^A�%>�R���>s ��f"�2b�n�}9dCv~Ũo��|A����nG7� �rP���^�C��;��8Ń0$� �Ĝ���Jy�ot�ja��đW���]�������\�6т��n,h.x��n�Dy삼��e}М�&�ͮ&ޚ�K��D�v@��ߘ��&�nbq����qe�������c`��t$̔lz��v��v��cG��_cp�1��$����rI�T���-0-�ƿi�Y8)d��`�σ�Q �Z����(:�i��9����NR����{?�ң�wd��$C��*d�j�	=�.T��NK�lcd��GNl.���?�����5�8Xg��2���Y7A�G�_$9���'����w�y�t��~M�uqՌ���ssr-v�I��A����'�h6��/��Mn7���aE�@>R�_s_4�������c6H��b���r���(@�1�w�s%���B���V��������W�#�."YϢrQu��w����~"�aX��$���������
=���ޣ _��
��ԟ�܉o婶9�-W��~�l��6E�	[.�d"e�~�Exkc�O���E��"8�q��я>7A�7��oҠ-�F8S��醱&�6�m�9�w� ������х�7P����@�IZ�m�zK��[^M�]�>��	u�=�"C�c�Q��'R�ܻJ�-�,#������T��UL.��t��A {�C�w������K�oh�K�ݻ)&�wF��रW��B4���fI�>���s�i82b�^RI��4�ao��N 桲ɓX��+?��4�?	ȦZxJ|�Tɍr����I� i�ǅ�\ñ��syA7���
�V��˔���y~�q���%l�[$�ڲ_N~ɗ�F;�و�	x|���}���`��4\yC�*s���V�m����7-e�f��\ H���(����s�0��]��^�ܨ�ƈ�ζ������C���=��������<:G� ��Գ4o�\gq�w���,��MpJR&�B� �(C�xI�bMr |�|���\�_Q䞓M`��m5gsZg���N��i�����GP���Gb���P�q@�l�S:�*a�����l���=�|�{ v��]����(�Ĉ�;2�э��ʓ��]��na8��a���i��e�&w�����AVw09M�dĺ'�ޓ]ź1�h0,���9�P8p�Gb�ę�r��(D�hx��#�n\_�T��'Aγ��@�#�{c�?�����}$�͘]�eu�/J���s/]]źq��:ctΜ�8"rW��%��t    �e�`�Gb�ę�GA���rϭ��X7����:0�*q�>x�ĺq��/�$ni3:���j��b�~�!d����)�;�ĺq+��x��v� ]<����A1�8.����������u*�xe��ǡK�1mʌ��\��u*��/�����떇P��cm�{k�cP�C}�+��&]�y���~W롯(~�{c��W���	��l_�Y��j���/�H)���$\����Ω���0��Z���m���'�uX����w��?�Z�U�W���.l���$�������<�[��E������t清4g|7x�x~�&7�gk�7� ��
:��U>ۏ�v ��mP����@�G��a�� H+ �1 R�i��S}O��ɓ!�Z ����X�N��Qf���n ~�X�� �v���W�˃ǜ��e2�?�o����/��&�+w�YA{h]>�oc���'~e��} I�'�ۄ �~���J��Rd�����~���~����0���y�O�p�f7��[���~�K�7՟x��3��фO�O�l��A�0� #?�ֲ.��ZD� k ͑��&�zdWz�z�"/ H��*9-��������%̷ �cP��=͟�2��|�p��ih^-	|�SY�r:9���z��:*�V&�3'�Gk&��F�/���!�1<�C��ۘ��N���,�;tsA�'[G1J�$�6����	aA��� l�(���+e�p�z�l��9C��ŴⰇ)�h�2���gLI<p5��W���~�翤l�q�"䌘Ϫs�i,jc ��%�De�̚U a���//c4F��u}uY���WEo���]��r]r�-�>�C�m�)}l�d������>�vV�Ol6�����T���C�+��E�J?<h�j')�ʭ��	�6i�TW�KF��e9<o�s5g���A�H�q����w�A~<�5�.�z�	i1���Þ1�R!F3�:�ө�yfL0�e(ws˼�e�X�#A^����f��Itk�?�T7��XJN�	_'�aJ;w��?G��{l���
��÷�,�z�˿>)G�>���à� ۙ;w��wći�һ�H�=�0a����w�p��V��&�k�z"k\���F�|[�2��)$~鷨��GԾЗuW cmJ�+�O�-־�~�?4�05�n	Q���~��J���&��nJ}0���v������.�p�BE�'A>��l>��m
9����ӄ������Y=�o��[�>�h,�x��"[淽�?ٻ�^��H�-�rʬ|)�س���%BcXWK�l[�vA���q�?-��e�5��c;����G&<= �"��3
Ǳ��@�DP�^��c_C�h�Q�VI׉���j�>�@�4Ӿ��|_�NXD��)�?[a��������V�3o�"q��x��^l�ޡ��a�e��d���,��A��ލ�����T�$*�eS1���rWƶ ��W����h�R�_�G3q:������w-�Ɗ�"��0ZWnY���Y�8���.i@7�n@�b8/&za[�T`����ݦt
/��
����A�&��Ԩ97K��p���E<�vT��Ajo/���������'H��G�C��L�Ó3��|�ʏ��������@t��p��coQ��Y���lp�7����P������u)Ȟ0�6�����8�ܟ�g1����2�R�Dg�uI��0���Z���B����e��wO�A��3�%<��d��z�B�z~N��*��7zb��|��\϶�S��M@u��7#��Ls�=+x24U`ub�G?��~�,+�,�~H���~0��?u�����,���	���� ymB]�xR?��+��~�裋l2j��%�;�2|���/h2oY�{6�RoS���Fϴ��2��p�q������>m�otXϖӓ��v�V*������c��ڱli��xD|	/l�x��砧ٷ��#^�?��i/�pD�����ޱ8�v�r|���\�F\�h��v��� ��@�s�}>�m��l�4�<U����ܮ��2����,8ہt�$�Y��۲��@�����M���D�k�MeϜ��jS��@�ؔE?ٔU-y	� �ƃԱ�P�$P�Y�c�۔Cs�Z�O�J��[��야,�%�H�Q}lL��W��J`��f�Z%Z`��Y4�R�l�T3m���1�>�d�R��b�L��-ځ�a"g4vH�宑6Qߑ�vaw԰�c	e˒v즙:�i�>�V���/W�r�Z�5ӆ�@�u>>��ѐh�� -���t	'�`��f���iSכ�:P�E�E�� �`7R'a i�2�ڃ�^�hD�;�����b�J/v,�c�"(�;l�e��r��1�
�T�s�any'�Qb�z>t4cy���f��*���1�x�kd�<���;
j�ٝ�{A���Ă�;��Ѓ��#��������N���{2�hR�B\�ҝe��1�`pO��(��]�9\
hd���fQ�YM�h��ߊb����l����0�����je�Z�bB�nLS�}r��ӛ�?Jaԇ��_.��I�+([%�f<!xz����{3� Xˠ�xb����Fa��(A��' A9���!u��!@ ����п�c�E�(�SIwd�3q-NJ��N����:ԥ.�eA�@�R������g*L��	�	��R��E�g�xU�/�xu��x��iS�d�:G\?��]v�G��E}y	��7�^y�w>y �$�+��rth�TY%�>�˔�4�-u
�Ms&�!pLyh�,��ɞ�4ۜ����2vCx��g��dS6��7L��m��]Z1���W�1�A�"==b%�Dw����М�)C��)��s|̀���QG��!��(�V=�Gs�Aq��x�t�c�@�1�-��D��T `9���nN�$B��T��?4B�S�����?*E��S����	�6N�o��w�/V����������0�t���`�1�ᴈ)�"��2�@�����Y����?\�p�J�?#[�����t~Ό}�"�$�#9O�H�Hv��E� یl��0�cK[Ӏ��h��Q�������5����Wy������3���k[��R�͊]��3�0�<2[�
�_ �.8>R�]�_�0��ᨋ_P��^�f��P���)�\o�����N6}�"�q��@�a��SпhG��o虴�xJ���R�����~۷k���Α� dfqa,B �3��<��84�"�aJ�=���;�o�?�߇�밬�a���N�5�}ڷ��0��'��7~�R��6lZ���-��Ȅ4�o@��.(ڤ��/�7�+B�${q,X�p��~H�7����C;A����=iKc���Y��G��^,zȽ����#��& e�|wް�J��G8�2�2x��\�a(�{4��<I��@L�xv�����0�\��'�ɑ�/c�W+r�O�����'D_�xb}J�y�9' ad��v�Sr��E[�ǟ�jU��?���jCn�Z�{��fŊ
�q��v��n֝'yl���I�T��C��F]��_�Cg�
�BP-S��|���R���ut��i���=d�kӷ�z�u�Bd�K���="D_P�uP���8p�=�����S���`�����WzN�������[F2�3븳G�/lQׄH��
p�?m�G{�'��}Մ��w�<�Ip�K_T��_�1"��S�gv `���ϳŕ�{0F4<l�6,��/���s�}`�L�@���D������r��Tgb>�(�ο�����(1�ÉN"<&����E?���CdBAH����[�ꪷ����"�)�Q�ʤv�c�zc��}��J�w�]q���ʷ_P����A�#a��ňP�����>�¦{�$	±��7�s��f�cT�iA��]=�ׯu�$��)'Re��؂u*�/F����Mx��5s�_X�e6��ѹ<�ႏ��ٴ�4�@+tJS�L�/2�5o����SR�QU摕G�m��x��<][*@3?;د    .��� ��%���7于�m���N�A�/�NN� �}!�&Z	�I����/�Aљ3���)���/]̗��͆#�y�W�&��M��<���D�{㗟[�}1�'��,Uu���O��Dc�ٌ�&�d<u��)?c��bP>Z��C5  {~��6*3��t��w�v�	�({�ЛO����=1;�p��������W�>#��j}m�ڸ�	��Dc�}��xΌg�c���ؘ`o�S��Wb䛔���3��.=�T�,g���I���х�b��cڜ ��m���	�����>A��B������J�B�c�qh�
|�1�[YE)��	�C󐜐Um�����1A�QhL �v��=TC�p�����Ǝp�n���ϬO��x��615F��hƐ@�k݌�%����x�$$"���r���|���[�,^.��2Y3
r�~1������+&QGo�P��C۵Dc�%VqA(.�-��� ����W�<�CC�ƀ�-}��۩��P {�2�;��F<���6�Ⲥ�W�݀���t�sX:�a���S��x�x��h�ʧ��cV^�/�1gf�CGK�؝A>���E��I"�vu�row��d�z{��|y(<��4a��麭c6Nא��ss��A����m�����Sz��ԁ���QhY�5���ưrL�<��v�o�/��b
x�+PXK����r�h�U����0&X�n�-�	ZN�	&��Q*{5嶮� FT����[��bD��0���(`�8	�ؕ���`u�F�Ͽ]?rr���9�x��X�:~�T�8 � ����Q����`I.gX�(f�z� ��$����҉E
��)��OЁ(� ��H��� X'�Vn�JP�H&E�L������EZ`�j��9�����NsP N"��b�NFš9�+:�G��)�=� �0�y����~�/e��?������$��� ������q��!��]?�����7���|ت�b���`0]�X!"�[�Y� 4�cW4`�C���\� �@~N�(������9l��/u}�6��|)����6@muA;iEN1 Q�'Ҷc��%�1����k���������G�|�\!����~�f�>=�
k�鲹�B�BQ��J�U4�b�_��a P A\_{�!�ޝϿ�0����
�������ű�������5��r
l�j������$��S@�ѝ�n!˔���2Lx�O2��u�f�:��Ѫ���iM����p��dD� %%)?��"x�� �������6Մ뻦����߭��4�$��cw� ��S:a���`��ܪL��[��h��=bӓ$w��q�f���)� ����9�Pup�_e˹���f���`�̆��$��<0Vg[a!��:�����9y1�0��}���6=.E���q����%H���.�.���v'FT��"��4�8�تR�Z3^ߟ�
śB�H%��x��'�;�?�I��<g�@��|Ѹ>��b�i��8�V�����e���e�0�9��?����7g�E�3�ͤngX`��"�^(�C�8���|��eydDٶp�%|�Y�)^���
K�C`]J���E;�j��m26H�#��z�*���Dh�M0y�m`��]�mm3�c��ｴ���Բ6����w�%*n-CAN�Prw�{��U�?� �ɧmn2P]��}	:�DS��F�rȑy#��N�z�<#�Xv6�a����z=��`Os�� r����9;z<s2<���.ZYnNu�&5RV�\�Ꮣt=^ؼ����}��~�����Zf���$se��־�xWT\f!���_#|�Ei���;�j�E%x��R���6ɧ�%�u�H}<���� ��$�_�����uڲ'"�q��,�?�*��P@QvY6���������z��NC{�Eb����$�s2G�M[�K�$;w��M����!�q���!?~aL}<�b��)��4�F�;Jlem�[B
0u�R�Ͳ���[��j�Le��+V������o�}Y�P�ä�
e�'KsU��-[�oF|��b=or+�W"�q�p'.�_���KB�z�)}�9��X�"0����'��c�l(��B A�Z�ئ�C�}¨{.�m�N���j`���z�9�������z!�Χ�6��!ͩ�W� H�9s�r2��2��Q�>_�f�����o����f�u�˼�����}��և����47սr(F#CK����gnF[��"T&>,����c�6YY"��*	���O�Za�G{��,��U��H�$&-��`�r0�w�r��ij���!��wP�5�.Xb�4Ys��	�O��ld�-�*;����D�mZ"_����4�?d3C��`��f�Ϻ�??Y��o�_���݈Ѳe��@��hx�*���e\ҁB�Mc�S��m�|2�����3AGZ�כ��\4���,�t���t���60x����~c�	���t(��]�����6!H�9ɧE�*h�����.�8I��	��Oe�q�g�;��ph�s1���`lc��s�u$vԂ���.(�s
�(��X��kӣ���B������(��-B��L��ȁ��X�{���%gJ����`O�9v��D��G���˵�E[���m��Kb�;ޟ����:�c�8���eY�Y�>(R���@m;�l�OӃ���w���q��<���$o"�=�=�v�$B4a�[XWf�^1���SN����1Z,������zOMݜ�9R��;�Q��Y�I�@�sC1
���E�}�u.h&\�і%�����?@�������,z�m៳�O>W�����my]��~�6x]�����"6�ف/��6��M���`�w�?����O{蚒�d �|6[��<$�L�3��2b���"�?����$���o��*�	~��0V�|xa�CY&�~76�[��A���Xc���h���q9�G}�f���3������� "�ķH��M��qrbb�0&a����󐺮Ao�5#SeE��n������"����.��|2ME`��z�7+��d�kÖ_��%�]���ێ�LH�����p�>�l�Ͷ/%����ײ��+^՟I6�^ߗ�P��h�Ҡ"�E�L����t��@0�Nk��͟I6���KI��Y��Sm̯���d�O�})ɏ�Q	��Y��ud>�l�}�/%��9?����Ё��$~��K����ٕ�{��d�����;9A��T&s�<�l�!�/%�!�	��R
Z���$�U���~]_�
8�+�s#��T��\��$���r,�}��K�y�"��;+r�~Z�=��S*�?�iE$�ʨ�Iv��&�Z����GǙ���Iv�}<Ϟ���<-��8̞Iv�}�B�{�Ã1���g�]����Ц��%���g�]%�B:�8��xAw�L����S����}J��IZ!��W��5�} �1���jP��Vm{�ߨ�^!�χ�~�_!�~���y ��L���R�q��B/0�d2�D����?��t�y��Wv�v���L9wq�<6$�/��Tx��,w��#�?vy[Z7;�ЖE���(}1c����Gw9h��f�x��w�(2o��ku�d�Tu	ɋr�2#�6p�޼�Rr��p���"�|i�Gh���Y�\FH����U`�����-�Zٵ/s�=���}����@N[�$�)#X��@\S�V���'�9�_��`� ��\+�&R�	f1�*v].�۳�P�d��0-|�q���P�����~���v����^#�L�4Hv��E�fi��{����L<`�������rK�4l��<�i����`���iN�z��R��@mf�7�y�6�Ԝ��$*Q�Q�Cg��6�i9/5��{;��`W�r6��q:@�l����j� ��=�q�^��KK�卣B���O?�`�M�th/��b��7!��\������=���3$u:�Y;y�1�c�ݡ .�һJ��r�    1���i�q�O��ő6�K�^�_s�I���6�9IJ��(��Jo3\��/I���a�)*H�pr�S����6<�ߖ$�3�cCn�4=�}m���C��AK��N8G<�9I)B��Khv|�-�#��64#R�2j��0�����J�,��=�%�.��!MU&h摏��H�K��e�g�:sA�W|�I�nn�ת�!�b�4U�Q����j/F��O���>-p�ۓ��(��=p�����ki��t���|O)�Au��㱸�{�4�����w^Iqi����.�$G_3���NC�ݫ�>�L��:���Q<�*Uqy�y�	�'g]2^!�h~C�P�W�}���"Q8o͝�+�����]?������z����0ژh���*�)M�՜�d�k�0���^)�۩[f�04~\|��S<�<�m�*��l����	r}'\I$y>$�,r�J�+2��9�
�~*���7��
�D��]
O��`��S+��`I!2Ydd�����,Ff�����b�
��k��C>��L`P��=��)] I�W����[�g}��,pHq)/��:&�{���D@���n�O�bw�lm��-�`��XG�ŀ4G9B�en��2D�^�JKmS��?��XC�A��彅��f���E�e�vD�I�HLX���=!mQ�ʒ�4nd3x�L��;V��5ԋ�՘��hrr����>�n���:��]YKǺ���������};�m΢p��$��� v�2�ͤۜ�8\x4a$c�(|ݑ��@K��;�,砺�q'��7�Z�4w�	9�lA�w[�I�;���{���n���`D��|�م��W~3�lid������Ez��,.���@t7���(}%�B��x6K}��BI~�]��V���
���UZj���$ؖ�ss�e�G�I�
�>�޹IZk[C�赎!��`����8�'?��~\���`Κ���&���0��Z�.E��B���p3�O��A�QsmU�7G�zd(�,m�R_�ԋY�x�����[Ӎ�Ff���t����+U��N�4id�L?�d1?ˌ�;;������L_��j���Q{٘Y�u�Y�\?;���=�'� ��WH�̟�]L��������:@Dνm��(���'�H&��b\��=��go�[8�]�)f�*�`�����F�]8<Q�8^��-q��Rx���Un����5�����P�ȿmz��	�'�ŦBU2�rR
���y��*(���(ء*WD�����etP�ݑW��yF2g���~����+s���:$7s[O��v���b��	�����эrWnMEE���?����v{n��������lj���`Y�_�D�j;�%E�& _�O1����w�(� �,s�*��,���bUW[�P0�sU��'��y�'c1m͓������ʙ����p�����)'�Hn���;�k��p|I�:�1ޱھ5��U�Z��D��!���*��]^S�#9��^B�ZΈj ��Y��]4�=L�nm~eyնp��"B��(0��僛=5��9O��[M˸`����5�����M�׸�b}<�����������Y";��t�)'8�h��U.1�Ώp/D�`���G(�s����(29�����x��UntB��90�H�o��?�y��2G���j2��{I�}�^���m^��HzMd�=���,�^�:G}�F:�-�E1m�`��P���p*�F���ߎ�"�ի�^�H�f�+��ͼ���x7�_Ա(�E>�;TO+F���3�RC��l[�.�Uf�p����1Iy:կT�˽�O��p{��Ę�Gw��o-տ�Y��ǈO������7�H�s�S�Y��d13y}�%���_S�S*C���8�PR��?y �Y��T	�g��s�Q�c}���)ŷ��.��$�
���ğ�\�;��&2[���#��2q����9��ɈY������ۗ���S��>vک�׺�B��P�l��-�>���hl-}d�xҪ��܋ɕ�6T?���,��C��N��&�Գ�'���b�$W�����b�ν�'9k2����z�I䳼D��8�
Xʪ�	
 q��m>E˩��<W��`�H:6��n��˦'���Ҷ|��=����/��=L�.=+��>;[�%f�Ώ��n��=��V �GIN�ZE�*�z��y�iQl�K��>%s��) JdP��6�� �	 ��C�K�r�a�Ȳ��B�#&&#��%+e}��'FQo�Ѯ��買���~���XL-`�a�wPp�_+L"��a�;�5�"�ZaK��8��e�/�2~(�s%vl^�.��.>�r�X�f ��>����m?~y�-õ�NGx6:3P�H�I"�5?���*#8�M$����v�R,��
��k�M$�$�ȑ�GGi�򪼰m"�'���\X��|<Pt!�DbO	�yFv��E�浉ğ$r����R(T��u�D�O)�1���.��>hI<�+�RNYj|�ys[DB�
�ɓ~�/��P���w�>]�%�#Խ���b0�yp$�U��}A��}��z�����Q��B`���}a�jcG��6���R�CDx�0�s�A�1O�[��%�)k��HI�km�fZ�1��a��}~K�i��=���@�+t!!�	�_��Fmܶ꽵��0ah�ĥE�����X�6��ڀ�j��gRlSSXy�hc�z2|�C#��ƨ��PfS��hc@{2`]�a�J�6�#@V0����@ve�rV��$���~�\�e�ɘ���G�.ՠ6�'��(�� G�}t�2�Ahc z2t�K��9(�dH�/�.�b3,��c���r6߽�]c�j�	�O��ʠ��FP�칡�mz����sl3y����P���6=�?\c�k6٤���,skO>��qC��u��k���p/`;{Vf�~����;�5��P0����.-��l�����ڙ!5l�E�K@��f-�/5�j�!���~�ǳP�hch��P�YMG-A.�����7�>�	�;狵(���/��V�_��']c��z@��pR���"���C�;�5��M&��q��@�V2������:Cg= N�Ґ�����3�Az�(�~Ⱥå>�P  ��{/>d��p����g� #�g#&Be��q��Z�W.�SأI�3R����]y�`\�W׵�3�K?P̓�x�1L��5}�SZ�]yp`����kuI�YK��� ���mg�T�^D�-���ll)�rY�:k�� �2�F�t�Q1�1�5UH���4�M�7G�u-�kۓ&(�����g1TN�u����|��moE�������T$��r�L�]}�쐱4�P�HDf�>Lh�F��B������̏uJ@�����刴U��7A�<�C[O�T޶�Ξ�_��>M� D�$���r#{�eo���`(z��m/\{o�{v����\���?�?O��;ň��H.�Tro��v�Gv8����RX-K8G��	<���8@ee��h%]y���v�6o]wȭ�����mVU���2V�)��*r��a��o�]K�Mș��܌0Ho(##�m��>��q�\X��)[�9%8�&}��ug�+�w
�r��Ɵf�,7�Q�JÝ���(��.f1d��K����R���+$��X�� F��YK坿P����D֛݈(�0E	��%f���Г��L~l,�W���R�]5Pm4��$�W��uw��م(�'�l]� �I/�bg���wu� ���#��C�ԫ�/^�U���钟�Sbk&'(��qB*��vR�?���R�Hu^_VX<)��3qI�0Њ[���q��c�g��� Vo�;G�<��R?�Af��.�db�N���UH�"�ާ�|�,P%�v���7�'HV�
�fC?ڒi���^V�S!�~,� �j�0_3UW �����`�֌Ж-��ly�pu������^�#�F��1�B�j�	M ���}f�k4�lc*]Ǟ����%;�^��F�8�b "  X\^ չx�ꐯ�VV�?�ݥ���lP[����]C& n4߇ـ��T��� ��9�=<�_5��q�9���$��o�a����E�Ƒ���W\�������̕����Y|�����e�.>�h�$s<�3���;1Ǘ�<έc7Ʒߖ_SsF�!�3W�[RV�!'��'��֖�a�~m����m�����ߖ�|���������P�W�:����|[ή<(�=O�s�v��)8A2����1
�?��л�q�b�w&'o�����׬B�=���q���i��%�C$o���<�3b�&�싍���Z��b������{���ei����*��1�"n��J���ГT����Y�}-�v^G�Sߨ�:n�q��S,�ŜR���=��Օ�o���&��hL���eO��6�������U���`�D���k&_��3�V-%������u4imai�Uʫ�S)_��
PϾ��h�+d��#L"cT���p���"�y5 L���z��A�}!������Ǐ�&�G,      o   �  x�͚�r�X���w=E�@v0�c� q�y���Uu�SRe�*;�qؾp���[�_k�^75��Β$3w� ��vu)��wI�� ��F�������tE�t������u9���YȈ��w���{[���E� ��!*���'�7U=�B7׷�tW�@���@�?`��� �� ���	mo��.�%,�_ԩ[E�����PP �C�sǩq��kx���J�(}��I��Ud�d����N�lC��2=���H�Qf�H�X�`��"u,y:��mޘox1��^�;o�B{��[�v �=Wh/hC�#� �����+�f��L ����"#c=�Ep�1�j7*�����y���ϓ|�j�*�[Z������B>d-{KU������oCe	�XV���h�u��� �U�zg*�yu?��9ܗ.;�A8�"�6q5^��kr����������7,<+�`_�[V�}�=���u�8�$�}t�?|d'&�,��\��0JRr}PB�V;Nv�Vn߁��Mr��Zʟ�������o���V
R�q�rU�� �p� �C��Ui���3�� �QT��Ôq���
��$;����q������L�WZj~N�[z�d,�j@=��Cɹԙ]����n�ʋTk$�+� ��BK�x�*,�)�83D���)�����6V�B���e��b]��B��	� �3��E�����Ĳ1�PR�5K�0���Mg���1�a��t�u1>Wcr�y!�>3m��e���7~�_�6�p��x�*\��i ���s�+{DZ�'K�6s�S��4�[�{�����^��e8�`�$	����M�iz��g�K�A�F�Br�[B��~�� �O�����,mJK��q0�z�G��'�$�B��c~�9)%30N��5�������O��O�!?��:A���< x����A�σL���x���z��]��ȑ6����7�.�����8M��v����$|;�EWCU��:��b�{��,YN%�	@Vy���Q�(A���з25�|��O�.�o��B�p��p����,$�D��6
�>��ސp���ݾ>;&T>���-�)�H���z���?S��5����龿C��5�Р��+�� ����>�0������0�����g&�r��l>�o�θAw'�6�Z����ϻ�PfN�D�.��r����ㆶ�~�t�����a�3���G�a�R0�z�)wz=>�9/�~\b�+R�0 Gj��Łپ���m|��h�H�-8p�ۯ�o���۬���$Qw*� xS�'E�j���ެ@l̾S����<�.��`�:'h�)�7�+��㸾�Uv�Q���{���?`�-K^c)TP�⬼���'�e�k{ԣx����mF�9,����%�~���Xs��  iwR1ǒ�!��6�	ڀ>�a�a��|��:;!�q5x�˷B�n���;���	n�����Ќ`CC��h�X>b�R"(��3sG��d�=�9n�S&dͩ��щW�|�&o��3��I�<�/�5z1tS���y�S�)�eIp,ؒ��D`�^L������j����n��1�ƺ�B�7 �1�aG.s'̽�D[���o�=Ǖs��y�M�3E)@�����������:p<��a z6AO�.sX��B#�.+Fm6�䱾�2�)��I�mư��w��Z'	��yȓ�cT.�H��b�և��L��Q�J�[C��F�6�w�N�6��r�}����&�\.-a���pH�ݝ}˴,�����u���W�|�
�ܜ�D���p~1�!��C)�d�7��Хں�7���ܲ��wح��/��t9(Fa�����o����O2�mԵ�29?-??(�m;&?�z�{I��e��eF"�� �řNx~:��\"���������� ��m{�ߡ�-����-Wt{ۑ����W]�H����^���őo�s�&�8��_��d�m�:d� ��]���{$M݄�j����a.F�!/��;����z�t�3��⨧4j�x+���ȁ�+۷�� ��H0���]����$\��pʙ.����>�ڶ���rG��+��q6� �\0u�*�#��q�"Dv��^�zP&C�c�xqc��;�4��#"A�f��3)�X�'>��cA�\��EɪM�X��7	C��(����o�J!��a�?I7������5��t-��O�$�y�å2u�aK��@�r��Q8�����5l�ej�O������mu�E�y�(6J�P;h�m��������&�E���^5�q��l��CoDF���m� �Z�;��z�I� �6�ݾ׭c&�]�o*��b�%��U,*`˜(R9
k�\ ��vj�(f� �Ì��uѺI9d����\?�F�ڄe݊5�Ph��y�]��W�O���w��+R)�Bc�[	M @�Hs��mx�7.�n�j����?��c/oK���TՓ%�[u��w|[¹}R����8��'�ng�YҾ"#�Æϑ��e��x��s7 `���qW<�;
�6{�bڽ��&�I�,��к���m�ǂ�b�@Y/g����`�uNMjƇx�~�{>���o(�"��d��Ǵ�˳�-"�D �%�hB�d��e��TYr/{Q1$�������&C�� 0���+?q�Dmi.�M�D�J�~� >.�
�*���`M�V��7M`��^I�"�{��7>y?^4J0���8��d1�7¿A��{��y��J�����N��7hY'CY��ؕpp��B񝃡z,����,?2u0�^$��Ɩ�;<�w��>��n �������C[��C*�ߜ:�x7
z�W���z�e3�U�=���u���aJ��R�4g��.��-��F�2���K>E��)���	2��`� {��AI#݂��<Լb�Ý�\
��Mќ{'���2X�e��(�������\�l���>����0�9fJR!nq������v�jO��w&������P0��(��J-�BHWvg	`O.&�}�!Kp��]�Y��V|
�4����"��D�5u�Q[Za:%��`h���7X~9nǀUNrŜ��J�'�=y��s`L��#�o�քC�\%�+�n�A?�(���>6\�p�{}xƭKlv�emQ��:���(��ϸ���� ���(Ӆ�wf��'�o�&���G[���.q�khvP��I-�G������;.�r�Oc:���E��� �N��e��\.h�]܄�����I�"'�m\}�_T`��ă��ݘɶ�~������p_EE���lX�t~1���-�h�����go����S>d��l�����qƱ�*��������ޚ�wb���ِ�89^��a�k���J�Ɣ(�[�`�]���\i��O��l�x)��'n�r��f�Z$�J��>��������z��	'%�#�r׶\{��;D���N^�g=��|��P��sK��#9��-g.5���+,��~_�ſ���/��!�2      �      x������ � �      �      x������ � �      p      x���Y��L����k�� �! �� �>A�I�D��}WGGG�*�]�zg�I�o���#��L�k�F�}��X��Q�5����_ԟ��������c�����w��u���HDZ�K5Xy������D"��u�i�����D܎��G=8o�D��6��b��h
^y��`���b��D�j�] �P��Ɯ+�ǭ���D$z����}N�ᥝ �HD)�o�&�q��^l"l��ʕ�З&r���D��M��f[��A�H�'��;�R�~<��D�7���F�j�gԤ6��U�3,w����]���<E��Vˊ�,>=Z�M$�6?Jr��i.Kvul2OQ�W>
�.�gW`���[�j�Tּ� �HDQ�mʷ�N
�l"�V۟����1`�Є4K��.�f_�6�M�������۽U��D|�Lp)c���U�&3��T�s�f��'sl2���%3'���D�ò���w����� 6�K4_��5�{o�h����Stt��kf	���D"������".��6�����#��F2%=?>`�8p�`l��0/ʀM$b����"�63s4B��ܬ�M���?�J�,o�&�)�e��9�SX̀Mf$������ɹ;�O ����m�t|�%{�N l"J���+���LU�d^_Κ['3M˾6��%�%p��9��*`�y������֧���c��<�[�[��8ݼ��.�Mf$^�`��"9��� 6�5�۽SYw7I��o�M$b>Z}�˭�����D\e��tm�SV���Mc�x��/�y�Puܝ� �H����S��"ܝ���D�r�n�%<�e�K ��m�`����t�9*
`��h����d?s搅�M$�l��۝����n ��3gY��6}0��l2����g�M;��� �ɬ�{]����d\�r#6����hK�ib��7n<�&Q���S�y{>�K6�j�AϮ��i�<W�Mf$��*�1{_�*u��HD�f�<i?x���
�d��|R�ρ�<�=T�M�F?��|>m�S>��M$B�w���?��z��+�&3���������'�l2�O�g��w�6[i�M$"vw����9+�5`�y�~N�w��`��� ���?9�_���_��v^�����g*?؀���ԿN������ܞx�Y��@66`��qI�Ӎ�x>}�W�
�dn\;�k�����
��D<V��r�<�6]�`�8έ ˢh�W饈�M��Ꜥ=֛v��v`�8g���Y�i��]= �HDûN&���+��l"㚙�/i���U�d�Mf���Z�9G���<6�u���rt�5��G�&![gY~ve���� �HD)������^���D��^�#���YۀM�f�KSz�,���-Y	�d^�F�~�w~���q}l2{kSU�g�ܕ�3z�M$BkO=ߕ͵;�1`�����请Q2�َ��̖u�|���U2]݊;��Y� ���M�U]��e���e��}�8�ST�K�Dk��-�u�D�K��V#NK�k����2xZ����V��Hb���΀���¬���+k�Jb����?�`X���at�\���8��r��a1�s{Yvq�(K� �P�V�W���|K�=`�:;�K�Q������];���5KI_2����32�Y���qlB�2���k3��n����g�d��@�Y�^Jh�[�&�!�����7��2ؿ;GE�[��U�fko/�$��`��Cb�/�I�����}�6U�I�ǌ��{ɖ)֥؄�uw��K��W�,�&���T��d���i5l�&��Σ�<Wr��Mj�|2�n� �MٻۀMhJ�5��:�E�����M�\�6G�l�x[=`���o�QP
=���̜ ���atG#:�+��oVlBG��)ߟ{�|j,�ؤ�>t��*͊���f��Mjf\9/����g^�&lBSR���y�gn؄2��_F}����G�M�$��Kz���5�� �P�C�:o7GZ?���	���+���^-����M�&uK�suE;4Y�86�sT[���|x�UlRw���]�p�ז�e��	�6�\�Y<~J���	e���1�n5�'8L�Mhb�l;���+��u�6����Ə�w1�>��lR�+���q��;^�7`:*{�I��Օգ����P�Ax�&_'G�}�`:96���&�Ͳ��I�7U�>5��G�`z�Z+�(�ܴY��]I�M�)K��˖�K��29�`�z�����7n�� 6�͕���zk!�O`����t�]![��y�6�ż=���v�t�F�&!�SN9qV���U��̮ߢ$\|�
�j�s�D"���%\��T��7�M$�6�����Om8��l"-���!��'jw=`����TW����d�ЀMf$����b
�%�(�M$�r�=���v����l"%E�'�V�:�w��D"�|{�F�E��8�F�&���o�A}|FN}6��"z��b��ǡ�i��D�k/t�iS�t���H�imj��2�� :]�M$�:4�{[��ǧ��`���W~,�����6�ش�^=�j'��p�M$����ȟe|���l"I,w��Q{�&ћ݁�oQ�\��	��Dh�e����=e`��mo�n�3�k��
 �Hǉf����>��86���s.��μ��LjX�~�2����6��F�U�~�x���؄^��Ϥ�\[�]s �HD���L�g�u'�l2s�%w[Ζ��w��L���9��iX^�6�&�ҳuq�������DŃ֯C��j� ���J^���Β�H�Y l2�E��Y��'��5�X6�gǊ�>�ʸ`���ɼ���&�~���a�}�D"�r��ԑ���i`���m�b�z�}k���,!��Cd�{�\�G  6�wQ�z���K��]��D�hO�����y��c؄vVs{t��q���|�6���Gr,vsgU��`��qX�m�ɕ�r	k�i 6��"��3���|��k_ 6�}�զ���{���Ց2���f��~۞;�Qx��ܕO��w�E��&(R^|���z�>`���n��%�����)�&t�F���C�����qR�g����`�&i)U/�Hf��u�|p-�������eؿ���sT�H�Ǳ_���L �������3��o�b��ؤ>bж�2�tJ��1�wGE�/��K����;�&u�pcy�Z������lR�N���M���QC�&t��Mc�����R��ؤ�a�5~��R��MK}�&�hἱ����.����M����r*��G���MlR�a�o�������	ؤN�Q��5�A6�nl26�֒��}v��&;�&���=��Ƀ}�����d^!yJ�䌬���ڬ�H�5+J��^7�l�7`�Yt{�%5��'����6���ϪHG��sT"�&���?�!�_
zs�/�&A�'s�ǩ���6����kρ�N�j�N�Mf]\���`d%�n.`����姛�ɗpe6���>�}��7�U���%���>,�u��-`�9g��G������/�&�P�b>��N�ڧl"��t�x��wjꨀMf�?:���g<=�
��Ljnz~�>^]6ʤ��g��m��2��������5o�W@��3-N�G��=��n��������6�}��uz���8���Y�׷���˃4��Tx;
��2D}]��_R�JNw?���߽�_K��ܚ}n��ڭ$�w��·���H�H�ՆW �����2z�ξ[K_���p`�p�����(��nʖ[�g|�up_7�X
#̅Xr��wTد��,�s��>5�h����i�m46Rߺ���\�ō^��N���̶R�/��sm�y�/����O��u)��� �`�n5����n\��i/ۦ��.���N��튝�y	��y,*ӥ ��S�b���O��,WlBO���:u>�)�ߴ�`�z���l,�������6�IGo���[Z���lR���Q藵�V�F�f�	=e�ur���&��sj 6�I��k˃ѓN;	g��+�"r�����pZ��x ��ſT�b��
����D�Ⳮ���]    �����D"
à��P���}�&s<�O2~����B7�M��|D�����&x 6�����Zv[ip ��P���$�m�jv���P�7ӎ[���[�}Z�8��6wi��kk�ٶ)N=`��q&}�}_"������o��� 6e�1���`�7o���I�64�Q��z�Ϧ�`6w�E�YN�˓���p}�}��W�9���m���w�i��]�b_���VW�Zz���]N·W�`�2��b��\�=`�.��u�������}�Wrؿ�����/�)XS�z��Jd
*`�'�(���֐��s;������ʩ]�����'�R!`���|E}����fo	t`l7g��_��|}5��u}0eU0+�� �̓{m���Mw����s��<��ܲ�#�b4��.`�
��䴐�k>���T\\6KO!ua�}Q,�M䀘[�_�[r�nk� ��PH�#_���>���tl2��y?8��J���� 6�Һ���3n�� l"�ۉ^�n��ǭw���g-��9íU���> ��&_��z��u�R�˙��õ3�ۃ�Ȩ'k�Q3���m�?��}{�+�#��[�R���?\���Z��_\]~t�)���[�uO��O�q=�G��b��\*���q�%�w!�L`��;��[�o����6���A;mWG�'�ĀM$�y�c^ZU鹀M$bܨ�k��<�w�q5����%b���}#_��|���D��^\>;���� �H��9��_��~��`���O�����)$��D��5r�����d\�&qb/	��]�M$B	)��;�(��Q�H��+���r��~��׀M$���a�Vj�`�|l"�)ڜާ�X����HD���/��8?�� �D"z?m�M.҉�Tv�D"��������2yh6�]���itN�12]���nS��.�rk��GEԷ"���W�9m��2�M�(�_�BN��J֧`�/�F������~���&sw��*�sY�y��ǀM$�le���<:��6��e/�mҭ�t�N�W��ᇂ��2JJ>��8$�i:�k���!�����yq�����{7E�E�dJ��M���>67ǽ��- l�EN�nU�ŻA�O=`�/ڬ�LJ8�z�j�P�aNi�:n�WLU���q?H��oM����綼!��`�s-��)f�;��x�?;��E���M��غe^��v�1`��&���MJ�>�gULB�Z����I����#y����R?��fا�P��ҝ������{���~���{T�U;Ʋ���n��\w�6����4����.浦;?���e�9��r��c���}:5��hw�gN�mu:`'&+��1����/��K~0L_?��ܢ�zoOO�����x����ݛ���l���+�z����^����o�2Q:i��wc����}ml�!������}���}����_.�K�u{��?��4N�c�
2-0����`��q��}H)��7fg�Z���o ����_�<oE$�7�x$�ؿ�C�~^�Ԏf���8�#��;��w��{_�D6m�������s�X�M��0��xU$��/��=2�U���i��1��,`���geP�g�Bc�D"�ye�rw�7�&S&�&�?Y�98�z}�+cl"S��G%�}�>l"�m�(�r,�*g���ʓޟ�:�^�$���uLԵ�C��HTD})*6��a��˼�����%�c�8f�k���|�To�(���<�G�l2���<2/��:�C�6�}�����w�&�&�����S�%��� 6��p�^�L;]���y l"���s8&�J���&A�V�V]��P	 {��Nb��Xs)�I&P����.i����)l�E�fh��0��>�C�֪�[��v��o��X��f��K�'�&_��u靝^������Yܟ����6�6���	�A��(�����f�'/��Zy��CO��pl �|Q�Sە��Ib�F�`�/�Wʇ�ϟ�at˚섻
E~S�h�@{���s��2� v�_��7x�`��� q�*e��o��%,��i�����11���#b�/2�H�nN*0�˸�&�,z'qv���LK���i���^.��&E��M��4>��}v7睯�5�&_$��:�t�L����l��#�\��!P���0��n�"k��M�(�*�se|���䋴�Q��Y����ЀM��@���i˸1����䋎�-�n�k��<ƀ=�Ĝ6��a��(�+���sW>�El�E��h��±W�m���)�T�rt)���_�Z_�b:�U����m/�A]N��RKw)�|� Z4�j���_H��?�tQí��ˤ��~�D4s{	<��s{nj��D�$̩R&�N�p
`��ƫWy�>��}d��E�-N���`��2�;����h\ˮ3�=p: 6���O�pKq�Mo���D��9-�[����� 6�c��e���#���l����,�m��5�4O�&r��b#���B���`�����h����. �����N֩S��W���I�<�O�GI4ͣ�%�Ls@����5z"0J�^���G������R�H��=���0�"��L�������o�Xĩ����kO�l�+�N߇�=�5=��|�D.�3}M�>6�~�ڀM$"�Rٍ�u9���߉?��tY�;���H�[m�}O(�yȴ`�`o�56�Ӆ��L�M$§��px�A؞(�l2#���ɶ��-v��D">�ɝ��\-F�(�&3ѧ��-7���?���D��#�Un��+�"�&37b�d������}�l"�����zwZݺ�6�U���5��#�@l"���ו�ˋz~,�&�,#sj׌r?���l"E�pӜ�-�
+��ܬ^�e^�,R-堵�M$»�K)>��{�
sl"����+�}&��Hİs8)�2m��m6��S��}�W�s�6��"��f���<�D"�H�9��f���,6�M$"5N�M���o��� l"S�C�f��(��rψߚ�Q1���i8Ge`��&��oh��]�s���9�&r���?����u���I�M泏����v�ȣGe�&��ڬ(�u(ٟ[�&�V��k���,�zl2�s��QGk��9�t`�HW�}v!-�l!p�M$�_�W��6�����l"m}:K�S�i�YsG�&��Y[�{i�l�o��l2ܶ�i���
�d>\���:����^�`�y��	��of��R�HD���KC�Z-	��ܶ���>u+P��p�6�����>�i�_f�%�&sǌM�)e�Y
�1x�&sbz'�����k�l2K��l=�sڵs+��YM��~��yey���x~y��?���N�}�{6zVq	kk؄2���S�n4��m�&uT��cW�Esf�M,�Iu��Ug�C'�*kɀM��5}�Cî����ؤ:V�&w��-1���ʀM�4��~onَ�śؤ��Y���y�*M����	��u��S�TE����IG��w�vZ_.Tly`����i4�`�^ڭU�&�Kl������P6����;���~Y�^樿�ώC�������܇T-.,`ʨ(Uc�V��϶{�&��L�g�t�ݝ�KD6��-u����>�����~]�w�!�������2�շ�ؐ��}�Xk�6#V�����k2�^��ӦL+�8��M��_V)�l����*`�x�<Sua�./ϝؿ;7���4O�v��|3�|x��ݕ"|;E�v5��J9�&/+ �P��Tk���]1���
������()��K���I�0	`�.C��1�\�ƴz��B��`����I�<1|�������_����x��d$+������P���*��x�o^�����wws��GYwg�2Ns2o��1Z��:(��x�����A���q �w��o3��G9�C���Q�!`��$e�}��j`%��R�Z��e�e�߾���Ze0t���5 ��W엊�̏*}(���d�byv���zW�i�����U���R���2�6�#��}9���d<��j��n�_��%��/�Ί�Mf,�2y���<�k}�,���X�ߦ�\�h�    ��������T�6e^�����:[4`�n6���x�u@]cƬ.ϕ^6�3�UVG#�o�;
e|l2�x�#�\��.E=`�n���e�%�q��
 �w���_S?Q����|O1�6����Q��:�n�����j��?�]�Ș'�!�7?��������>��u�s�ɵ�&���p�|��e����dN��<�5E������H	�d�:^ؿ�ݩ������Mf,�h�QJ��ʹHԟ�2�	W�m�p�����`��eS��Z�_u%�6`��xe7c�r����ʀM�Q��Z{n��V��e| 6��꫞_]:	;�zQ��w�T��}ou�5?/��ɜ�{PAξ~:Q2`��R�|����k�eZ�w�M��d����ڼ�Cxl2W��ݏ�U��8���b���>�F�y�U]�O���ߍ��}�7o�t���� lBϱi�ϟ�y>_7w�&����9��y���N3�&�a�۶?�삓7k�lB7_�-CM��ͷ`������B�v/� �ԕ����k(n�S�(6���X�Cx��*e��lB�1^��1���A�F�&u���zG�h]J*ׯ��Ai�ն�/�}��"`�`�u�.�V�i��؄2�瘟3�j�*�Z��M(���j�U!��lb�!nO��F�]�PF��m�W|̬blB���Շ��S��I�7�"��b4�x��&�!'�������~ lBq�ď3���1��`ʸ���;>L�0��elB�I���Eߝv�M�X�g�K��p�G�M(#?u�.�/�[i�ؤ���ρ�η�r<o�Pm����:�����؄2,�Y�t��Qu�&�1*[��D�M���M(c�V7��zl+lB'^|Jn�zz]H[{�&53��E���B��VlR���\�U�E�q�`����x=s�l:U
ؿ�ٯ����mk9����`�n/��}Ж9��)��%ŀ�ou�O���?�?��%��3]6����:`��}�P��/��a�_�/E���Rn�ä���r�Sҷ����ZH��}ӽ0;��Í/��ɢ�S��b*�������9��V6lD�ҭJ���qa��u���������M[��ݽ�f�շS����_�^v�|ػw8����j�5�p	\:�gKS�&x�L��X���֋�m*O;����-�ۡ �g�m#�auG�d���	�K���M�����@���_�i���牋�������J�ۧ8!�UibҝY���	e�B�Gqf�c�[`:U�Ƨ�U��Y�!`�pf��/f����6Ṽ����������Mo�u8��3�����oW�!�LS��8�f 6���W�E~���Io.`�0�5��D�yG6�6���S�:��L�����D������ju�Il2'&%�엠��l[���D��zM_,�{���l"��x�3�Wo�&ѕ�k�[�D.U+i ��H��h&�7Nv�K�&qz-����ת~l"���%�߁�R�D"
Y�j!�7���`�H巻��D��ng 6���`|.N<�y`���d����1�����M$�r[���q l"�i�z{Y[��0�)`����b�I�-�S�`����V��Ezœf�M$b�sM�/�2�b#�����O���{�i�n�d�N�R�;�{se.�M��n뭯�n�&\e�&��C^���z�y�|l"��|j��e�Rv��M$�lo���"pf�6���j��xΤ�i��ԀM�)*Z#���&zNH��sf��������3���c��x�^�uR���`���7�k�9�ڍzu���5i��r�45�mm��v�t���|ì��x\�k�9x	����-���v
����[Šr:z�F���V<i4��gGq�S������Žؤ:^k��N=��{�׿ �w[_�E��^�0���s$W�M�b1�h�p�%���}���.��v�>v�j��i�[�,ǀMf��q�\��潦����,�̧4�js~���� 6����Ǌ$'Zx�J�M$b{ɝ��Y~o�ڡ�E|��%:YO���VσY-{����%�~�W��t�y}w���w��~����9f+�L�ճl2�������,`�`Ey�swh�7G�&3oBe)!��tg8 6���z���U����N l"Gi^�h�G�
��D<s\Ni�E��` 6�}��ze�G�Y���p ��TK�br3����k���:�8������ր��up������A�V���gtr���Cw� e��[���"��S���Yƙ8�5�
���˳v�ƭ;M:��wl)�/�2SF��S�|Q�5G樯�����eK�y�Y���0:�&_$����ճ�G�6���`o�+�<��݅l2�f�s�c.��6�zN�p_�2e�T6���z�V\�����&��z����\U��Mf���j�&�s�*�xl"��3���zlٍm�Mfc��W��4�Ҍ��	�d���lV)5E�O-�&�赮�k�u�: 6�����yd^Qb�E����m��)��)-��D\u%h�ֆ�4�`�	+O6{�[��]����*3�sMۿΉU6��8>������r,�&�O�%���׫Vl"������~n�K���Mfcv�w���$���D"�7W������k�&3V�j�0���;3`�H��?��v+�,6�;榵u�T�K�'����1�4�����	y�K�M$b�t3�*󧥳 �HD�֋Z������2�d>��n~i�+n?���\���l������=�HDgG�6���^� l2ӻtW�/aN���g�&sb&n�1����M$B���>n��ֿ��l"�a��S�b��}vN�M$�w.�^J��X)��l2/?��1�X�O�`�&�2�
�j����6�c8w��>%�a�� �D"Lz۫�������d�M$���gk�m]��J� 6�U�J�==G^�d`v�����8��l2ӻ�����o�{��M朠��1v�2]�r+l2������˼�6-8�M�<��8���!�j���D��ۜ�Ť��9l[�&��S������6�k�V��Vw�o��ɬc�7)��;�o�l2�#_��f=��k�?�M$bI"�鎮U��G�6�/���Y�y6��l2�h�\�d�5��F�D"�{�.^>�K}�M$�w���w��2�����m��~������)z�Mf��_�^���,t�d��g�xfg4W�6l�&���}����S�n l2�	=B�u�B}��'`��:n�u�Q�H�r�M$�ż�*X��^W/�&���J�\�`_��d��Ċ�o�y����6�=���e����.�yl"�+�/�h�f6�U	�dVtoC���粜���J͞��u�ev�ϡ���D7���c�ʔ[���M�pp�ӝ������>�d&�J<m��7A��-`�ْ|w�T^��!��6�;�i�ێIsv�s�=`�(��u/��o��6 ��Dw��bu,��>0�-`��:��s}�ƾv��l2���iM�G̓�πM�S+'v��ŮS��̊Zgn�{�YhƂl2+�o�3E�ʗ�n�k�&�ɛ��Ѭ$��6��U�܎e�]͇�	*�&q�CѸ�W*���c6�K�>_�C�]�ܐ�1�F&��Д�68W# lB�cr4��}�W��6�ٶu�g�?(|��{�&sb�c/W��Ҍ� ��*�,��u�i���ɬԈ�t��C�X+݊l2K��p)^��x��=�l2�c�?��|w9`�و�k�ݽ����d>?����^��W9�dV�mR��S��q�ȀM�f���j�����l"��=E��x��è �HD8��E�9�n˺� 6�;&���qm�d)�d�ǵ�?j;O��r. �H�C�w�<����^$`��3���m��)��̣�����ݪ��t�D"ų=�����˘s�M$��V���[�6�7���uo/��*w�M$B�ۓ�{C�9}~� ���6��]ʾyN�f'��<;$�_�x���� 6����<nv�yc����D<#�Q�H�/�a�.�Mf$ �	  ��8/�ZK�,2.�M$"��6ӵ/+v�^S	�d��c��_T���(O�M$bw+�;�=o�����ܬn�2��3~T��Y!���y�%���m�H�'K�L��)Ұk �HD ܴ�����^� �ɼ:�.n���#� 6��w�N�n�u.����D�mU�f[�+c�Mf1u���t���V��`�Д��X�~�"� �H�z������'~[ԀM�>�l��>��D�
��,����x�9� 6�=�gl,�_�RX
�ɼ��/�(�<�Ϣ�Q&�&�C��Y�)��ﺲl2;?�XޢPT�i�3`�y�?��;����2��	��D��g��s���6��#s�}�(�6~��	�D"��}1r������Mf����\���y�"sl2���8�،���0)`�3��~�9)P��ɌĢ�ڲ��0���	���1�3w����}6�I�*�hwjw�Y���6��O|\��{E_k��6�墻|����G�}h�&�اz�ߍ�����d�$?�n���i?�gFl"}�~1�Ċ��z�dnV7v�sEF����.l2��,���WOz8<)�&A�E��ג�Q�J�̔�;9n��w��!Y���D"��2�^��w��`�Y�[���Ֆw�c���d���{Z:���/�%�H�4�c�(��s���dֶ?��rT?����O`���R���k�# 6����ۇya�{��i�M$"	�"�I�%�$
�Mf�Zݟ�'>���3�l2�O٧*��Z���1�M�5P�wa^�����[�&3�c���~�8+.h�&�����_?={uޟ>o��lS/�s������-6������`���q^�Hč�W��\�T/.l2+5į�S(�06%`���y��W�*�&3�v{��Vg�/���dv~6�9�&���y�\�&�4`����/�z���D"�'3�w��RĲ�����:����j�.&Pd���Q�t�����x������Ƨv>���Ǡ�C�)k󫔯G�p�DG2���
I��t�)��˭w��@Ѷ4���Q��b��8���i�ݦ9�	�"�^����jk�
���L4-�,�j������5G=?vI��M�m�<`��#�xї�;�+�R�M�(7zn_�-�:�Jv l�EE5��^�5�����U΃ʋ��\/k�&_�K��z#���c
�&_4$} [����T�&_��r�^8�*����B*�N5�S��=F`�/�7gm�wnT�]��M�趻��j�-��Vi6�M��4<�q������Fl�E�]����.���1�M��d�{ԩ���r����[9����>ds��<�vN��r�,�,N7�M���>�ίu��vL�6�";���K<JWuϮ5���G��P�,��}'�����ǌ�tbQ�	U��?e�,���"��|Q�g���͢(\ �|�~����P����S���ݲ紣�A��|Ѳ�������������U�T�ʿlw�}�����Q����v!P$\�W!�T=
F0� �|�}|�??3%�v`�/����t]��;�>6�"��h���G6���4n��T:��,׀��ni+6#v�?Ja�oM\�-��E�zy�o>����������p��W[���>`��(��]r��ݬ7b��z�J ��4�"C���PJܮ���
��w�X��_޼O|�/~{�3)k��lӮ,���x��7�&����,N�J��6�=�ύ7��������;?���e�9��r�������?o�oMlx�Ͷ���[Z���M���MO^���ֻL�I�'��KMߣ��m�v�|�L}*���/�j��j���8�v���G�����?����'�6��Mwe��[�-`'&+��1����/������&I_�,Wo˅�R��`?������I��G��|�����N�v���p%`�����}��ZS���U��j��w�D��Ҕz��3���ro�&{��v��RʓL��MS�.=���]c�1 ����!���?M�@Σ�=şژn�-�����*��KhJx��M��\>�"����o+l��u��Z��@Qs��o�˰��'`?��TŌ������3��s��[n��&��7�_ς�*�ݦz��zZ}�%ս�bL={:/[�&r��g5s���;�~6�"'r�s>�yQ2���j���Vs�6���@Ѿ6��˅����q ��ɽh��=g�.��b����-�sZ��[����=`���s���R()��I`��,������:�_����|k�Z�ZT�@;r��M�1���/I�!�f�f�Ɠn�XI�o'�ҷ�diF|��~�t�c{�nZI?xI������>�խ��?��i��v�X�W���03]�*o��;M���j��5��e�c�`���.�[U;�sVl���]]�5�/EIܷɀ��� ��<�U� �_Z��o���,��Y�Z��쿴��}{�]l���#��#�� �����4�ng\��f����˳v�ƭ;M:����_�������,R      q     x����S�Zů�`���E���w'��DŢt�!$	Pѿ�l�M���4����=�g=k-�vɦ7�����'� $���ܿlk�>@�ө7��J;qo��׫OJ(�PQ���@|\S��Z�@��p�N;�U$D�5T����ٴ�j���m�I���E�4D5
�7=���+N����������}�[ON���� ܡ�§�(�c�/8�U�� 07��׳8#O���U������l��b�����H!�� :~��Pր��!X%��:�ºY}g]���w˱���N����x9.�^8���J�5N�?�����L�"�|��Q�h>w�����B�������t{=]�C6i���\���&���hTb��#L�v0���詻;:��)e.yf������UR5��7 9苙\���J%B�ߺ�-��{Z�H�9����)��?��Ɗ&E�ڈz�z���Aא��cB�C��%�ݽ=Ƴ0t��ڜX�B�;��W ��@�L�LC,���A��~��!��\��+����_�摔�"E�/�I�ōx���t+�5����-��Q�� �
ߨL����P��`{(�P\_���&�0�@����G�I�2��͆�� �iK$�#�����m�&�Yd�e�h�K �6�F��K7`)êa��W�y�I����:-���6?q���-qѶ|{�[Ɍ#�bq�c8�f)g���,�?O	�M�MI�]Aޣ
_�!�g�2 wtwl�����&��/����๡
���ી�5TR�GHW��ͭ�7�m��K�!gaE����D���!(֪��F�؈hD>~�hqW�[�
Tp9_#�d��,��:X'��kT����[����J��JR��hv5��;�8,{#8�U���R�/��󷋵� � U�*��f�R3Z/��eZ���1�������T���9��4��%c٭F����{b靁�\7�ٛ)5�a���ٹ��}��Zc�����J����):}�8�I�I�J�?_��      �   �  x����n�0��s��T�oC��#b(�	�� )M���L�T�T�x���l�BS'��֪zW���P�7S��O���y�m	^���Cb��z���%�2G�#�.�B '�u/J�;=9p�	�G��:&��^+�����1L����W-7�y��wwU8�Vo��Z�1�/�	WG�~oS埭���Η�V��@m��P��#D����\خ�$�fB7�ù����_d����h;tѸw䧱�2���A�$Q'�T�(�v��$J6�eW�mǎ֘�zI!{.#����d��&�r��G��w�ڳ͇�p�� *p�Kg����x���L_ڟ����B/-�
�k�VI����;�Sl\E��:r�s�:�<����I�x#`�~���f�kק      �   k  x��Vے�@|Ư�Ě.����DQ����������&)ٔ�}�j��{����Fo�^�t��d�!��, ����h)`6�Гr�%s͎l�N���L����zp]d� ����@�	�b�ϻ �;�C�R=�z�+���=��""gΜ��D.S�b^?G&S޺"�S�� �kz`��8�O3��N�߸9�����]\£F,���`�}s�,flnk�f!(y�
�f#�®�@�Z�=L~���'g#~~���y�R�0��	qx�㥖~M��&է
T1?A4�/�x�Y�7�`{$S����)�}�b�&�X��<Vм�3:֧�o�߄������n���6݅ת�:��"gj<�ũ>0�Ӈ�MI���h���(Lw����r.����,��vק� <�v։���	M�A�"xnU�G�`��˪f`g�Y�X�t����R�����`���?g��b �3
1S�X��$�_����̷�BP���`��;�N��71���V��J{�<�l��S��G×#��xZ�<�1�td���p?���b�r�K�Kq`��X�r�O�/q�m���n�R��rDglL������^ҍ&9|���(�j�.Y�z��Vѐ̚H��m$@��}ƖK�$SH�����p�6�S/rkL�j��b�f`Dtn�4�����QR"�m¤��Zl��z��8�������R���F��1��4ѱ.��1xJXܝ�a܄	���lyI"�y-���d��.�g�1�;�����q�U��Ci�F�~���]��Y��v.�BO�ÈbR�����K�������._�~��[�U]ê�s����O�?���u��֤�M]����t:?dv"      �   X  x���Kr�@���en@�v7B�L@bx%>��@(�
�>$e2K�l���Ż��:r��Zb<C8��U��8�q��6��2᳃]g#`=lo+O�a���(M@��]�]�t����",] �J��y���������e�{^Jc6ng��K�Xq�ċ���o��BT$��� ��@��֤�J�z�@Hp��_r�h��I����o�T�P��%�.*_�*�ׄ� <OU�%��1�)л �_@��;�x�Wik�S�d}�p�n���]�V�Xk�X̄��oSs]s�v�ټ��N}�mļ_�`�p���k����;�BNy�n
�{ �*��k�����      �     x���Kn�P���an@s��;S�6��������66i5����'���愺5ح�@��k�T5���M%���<5�l���e��P�|LpL����L0���y�hZP:e��}p,��~&mV��ym��_&�1"T�(T��L�Q��_d���7���4�]��I�=��_(�\�d��{��ś�a����K|/�	uze�]�
�lu��ߜ�τ�M+k0��*�-��Z��@��>��u�T�#�������y����,x����*�e�EQ>���     