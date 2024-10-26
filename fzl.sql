--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 16.4 (Ubuntu 16.4-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: commercial; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA commercial;


ALTER SCHEMA commercial OWNER TO postgres;

--
-- Name: delivery; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA delivery;


ALTER SCHEMA delivery OWNER TO postgres;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: hr; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hr;


ALTER SCHEMA hr OWNER TO postgres;

--
-- Name: lab_dip; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA lab_dip;


ALTER SCHEMA lab_dip OWNER TO postgres;

--
-- Name: material; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA material;


ALTER SCHEMA material OWNER TO postgres;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: purchase; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA purchase;


ALTER SCHEMA purchase OWNER TO postgres;

--
-- Name: slider; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA slider;


ALTER SCHEMA slider OWNER TO postgres;

--
-- Name: thread; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA thread;


ALTER SCHEMA thread OWNER TO postgres;

--
-- Name: zipper; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA zipper;


ALTER SCHEMA zipper OWNER TO postgres;

--
-- Name: batch_status; Type: TYPE; Schema: zipper; Owner: postgres
--

CREATE TYPE zipper.batch_status AS ENUM (
    'pending',
    'completed',
    'rejected',
    'cancelled'
);


ALTER TYPE zipper.batch_status OWNER TO postgres;

--
-- Name: print_in_enum; Type: TYPE; Schema: zipper; Owner: postgres
--

CREATE TYPE zipper.print_in_enum AS ENUM (
    'portrait',
    'landscape',
    'break_down'
);


ALTER TYPE zipper.print_in_enum OWNER TO postgres;

--
-- Name: slider_starting_section_enum; Type: TYPE; Schema: zipper; Owner: postgres
--

CREATE TYPE zipper.slider_starting_section_enum AS ENUM (
    'die_casting',
    'slider_assembly',
    'coloring',
    '---'
);


ALTER TYPE zipper.slider_starting_section_enum OWNER TO postgres;

--
-- Name: swatch_status_enum; Type: TYPE; Schema: zipper; Owner: postgres
--

CREATE TYPE zipper.swatch_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE zipper.swatch_status_enum OWNER TO postgres;

--
-- Name: sfg_after_commercial_pi_entry_delete_function(); Type: FUNCTION; Schema: commercial; Owner: postgres
--

CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() RETURNS trigger
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


ALTER FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function() OWNER TO postgres;

--
-- Name: sfg_after_commercial_pi_entry_insert_function(); Type: FUNCTION; Schema: commercial; Owner: postgres
--

CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() RETURNS trigger
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


ALTER FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function() OWNER TO postgres;

--
-- Name: sfg_after_commercial_pi_entry_update_function(); Type: FUNCTION; Schema: commercial; Owner: postgres
--

CREATE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() RETURNS trigger
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


ALTER FUNCTION commercial.sfg_after_commercial_pi_entry_update_function() OWNER TO postgres;

--
-- Name: packing_list_after_challan_entry_delete_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.packing_list_after_challan_entry_delete_function() RETURNS trigger
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


ALTER FUNCTION delivery.packing_list_after_challan_entry_delete_function() OWNER TO postgres;

--
-- Name: packing_list_after_challan_entry_insert_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.packing_list_after_challan_entry_insert_function() RETURNS trigger
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


ALTER FUNCTION delivery.packing_list_after_challan_entry_insert_function() OWNER TO postgres;

--
-- Name: packing_list_after_challan_entry_update_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.packing_list_after_challan_entry_update_function() RETURNS trigger
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


ALTER FUNCTION delivery.packing_list_after_challan_entry_update_function() OWNER TO postgres;

--
-- Name: sfg_after_challan_receive_status_delete_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.sfg_after_challan_receive_status_delete_function() RETURNS trigger
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


ALTER FUNCTION delivery.sfg_after_challan_receive_status_delete_function() OWNER TO postgres;

--
-- Name: sfg_after_challan_receive_status_insert_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.sfg_after_challan_receive_status_insert_function() RETURNS trigger
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


ALTER FUNCTION delivery.sfg_after_challan_receive_status_insert_function() OWNER TO postgres;

--
-- Name: sfg_after_challan_receive_status_update_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.sfg_after_challan_receive_status_update_function() RETURNS trigger
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


ALTER FUNCTION delivery.sfg_after_challan_receive_status_update_function() OWNER TO postgres;

--
-- Name: sfg_after_packing_list_entry_delete_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.sfg_after_packing_list_entry_delete_function() RETURNS trigger
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


ALTER FUNCTION delivery.sfg_after_packing_list_entry_delete_function() OWNER TO postgres;

--
-- Name: sfg_after_packing_list_entry_insert_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.sfg_after_packing_list_entry_insert_function() RETURNS trigger
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


ALTER FUNCTION delivery.sfg_after_packing_list_entry_insert_function() OWNER TO postgres;

--
-- Name: sfg_after_packing_list_entry_update_function(); Type: FUNCTION; Schema: delivery; Owner: postgres
--

CREATE FUNCTION delivery.sfg_after_packing_list_entry_update_function() RETURNS trigger
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


ALTER FUNCTION delivery.sfg_after_packing_list_entry_update_function() OWNER TO postgres;

--
-- Name: material_stock_after_material_info_delete(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_info_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM material.stock
    WHERE material_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;


ALTER FUNCTION material.material_stock_after_material_info_delete() OWNER TO postgres;

--
-- Name: material_stock_after_material_info_insert(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_info_insert() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_info_insert() OWNER TO postgres;

--
-- Name: material_stock_after_material_trx_delete(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_trx_delete() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_trx_delete() OWNER TO postgres;

--
-- Name: material_stock_after_material_trx_insert(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_trx_insert() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_trx_insert() OWNER TO postgres;

--
-- Name: material_stock_after_material_trx_update(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_trx_update() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_trx_update() OWNER TO postgres;

--
-- Name: material_stock_after_material_used_delete(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_used_delete() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_used_delete() OWNER TO postgres;

--
-- Name: material_stock_after_material_used_insert(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_used_insert() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_used_insert() OWNER TO postgres;

--
-- Name: material_stock_after_material_used_update(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_material_used_update() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_material_used_update() OWNER TO postgres;

--
-- Name: material_stock_after_purchase_entry_delete(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_purchase_entry_delete() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_purchase_entry_delete() OWNER TO postgres;

--
-- Name: material_stock_after_purchase_entry_insert(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_purchase_entry_insert() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_purchase_entry_insert() OWNER TO postgres;

--
-- Name: material_stock_after_purchase_entry_update(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_after_purchase_entry_update() RETURNS trigger
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


ALTER FUNCTION material.material_stock_after_purchase_entry_update() OWNER TO postgres;

--
-- Name: material_stock_sfg_after_stock_to_sfg_delete(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() RETURNS trigger
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


ALTER FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete() OWNER TO postgres;

--
-- Name: material_stock_sfg_after_stock_to_sfg_insert(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() RETURNS trigger
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


ALTER FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert() OWNER TO postgres;

--
-- Name: material_stock_sfg_after_stock_to_sfg_update(); Type: FUNCTION; Schema: material; Owner: postgres
--

CREATE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() RETURNS trigger
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


ALTER FUNCTION material.material_stock_sfg_after_stock_to_sfg_update() OWNER TO postgres;

--
-- Name: thread_batch_entry_after_batch_entry_production_delete_funct(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct() RETURNS trigger
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


ALTER FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct() OWNER TO postgres;

--
-- Name: thread_batch_entry_after_batch_entry_production_insert_funct(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct() RETURNS trigger
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


ALTER FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct() OWNER TO postgres;

--
-- Name: thread_batch_entry_after_batch_entry_production_update_funct(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct() RETURNS trigger
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


ALTER FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct() OWNER TO postgres;

--
-- Name: thread_batch_entry_and_order_entry_after_batch_entry_trx_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() RETURNS trigger
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


ALTER FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete() OWNER TO postgres;

--
-- Name: thread_batch_entry_and_order_entry_after_batch_entry_trx_funct(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() RETURNS trigger
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


ALTER FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct() OWNER TO postgres;

--
-- Name: thread_batch_entry_and_order_entry_after_batch_entry_trx_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() RETURNS trigger
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


ALTER FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update() OWNER TO postgres;

--
-- Name: zipper_batch_entry_after_batch_production_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.zipper_batch_entry_after_batch_production_delete() RETURNS trigger
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


ALTER FUNCTION public.zipper_batch_entry_after_batch_production_delete() OWNER TO postgres;

--
-- Name: zipper_batch_entry_after_batch_production_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.zipper_batch_entry_after_batch_production_insert() RETURNS trigger
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


ALTER FUNCTION public.zipper_batch_entry_after_batch_production_insert() OWNER TO postgres;

--
-- Name: zipper_batch_entry_after_batch_production_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.zipper_batch_entry_after_batch_production_update() RETURNS trigger
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


ALTER FUNCTION public.zipper_batch_entry_after_batch_production_update() OWNER TO postgres;

--
-- Name: zipper_sfg_after_batch_entry_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.zipper_sfg_after_batch_entry_delete() RETURNS trigger
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


ALTER FUNCTION public.zipper_sfg_after_batch_entry_delete() OWNER TO postgres;

--
-- Name: zipper_sfg_after_batch_entry_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.zipper_sfg_after_batch_entry_insert() RETURNS trigger
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


ALTER FUNCTION public.zipper_sfg_after_batch_entry_insert() OWNER TO postgres;

--
-- Name: zipper_sfg_after_batch_entry_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.zipper_sfg_after_batch_entry_update() RETURNS trigger
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


ALTER FUNCTION public.zipper_sfg_after_batch_entry_update() OWNER TO postgres;

--
-- Name: assembly_stock_after_die_casting_to_assembly_stock_delete_funct(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() RETURNS trigger
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


ALTER FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct() OWNER TO postgres;

--
-- Name: assembly_stock_after_die_casting_to_assembly_stock_insert_funct(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() RETURNS trigger
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


ALTER FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct() OWNER TO postgres;

--
-- Name: assembly_stock_after_die_casting_to_assembly_stock_update_funct(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() RETURNS trigger
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


ALTER FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct() OWNER TO postgres;

--
-- Name: slider_die_casting_after_die_casting_production_delete(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_delete() RETURNS trigger
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


ALTER FUNCTION slider.slider_die_casting_after_die_casting_production_delete() OWNER TO postgres;

--
-- Name: slider_die_casting_after_die_casting_production_insert(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_insert() RETURNS trigger
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


ALTER FUNCTION slider.slider_die_casting_after_die_casting_production_insert() OWNER TO postgres;

--
-- Name: slider_die_casting_after_die_casting_production_update(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_die_casting_after_die_casting_production_update() RETURNS trigger
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


ALTER FUNCTION slider.slider_die_casting_after_die_casting_production_update() OWNER TO postgres;

--
-- Name: slider_die_casting_after_trx_against_stock_delete(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() RETURNS trigger
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


ALTER FUNCTION slider.slider_die_casting_after_trx_against_stock_delete() OWNER TO postgres;

--
-- Name: slider_die_casting_after_trx_against_stock_insert(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() RETURNS trigger
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


ALTER FUNCTION slider.slider_die_casting_after_trx_against_stock_insert() OWNER TO postgres;

--
-- Name: slider_die_casting_after_trx_against_stock_update(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_die_casting_after_trx_against_stock_update() RETURNS trigger
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


ALTER FUNCTION slider.slider_die_casting_after_trx_against_stock_update() OWNER TO postgres;

--
-- Name: slider_stock_after_coloring_transaction_delete(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_coloring_transaction_delete() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_coloring_transaction_delete() OWNER TO postgres;

--
-- Name: slider_stock_after_coloring_transaction_insert(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_coloring_transaction_insert() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_coloring_transaction_insert() OWNER TO postgres;

--
-- Name: slider_stock_after_coloring_transaction_update(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_coloring_transaction_update() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_coloring_transaction_update() OWNER TO postgres;

--
-- Name: slider_stock_after_die_casting_transaction_delete(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_delete() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_die_casting_transaction_delete() OWNER TO postgres;

--
-- Name: slider_stock_after_die_casting_transaction_insert(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_insert() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_die_casting_transaction_insert() OWNER TO postgres;

--
-- Name: slider_stock_after_die_casting_transaction_update(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_die_casting_transaction_update() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_die_casting_transaction_update() OWNER TO postgres;

--
-- Name: slider_stock_after_slider_production_delete(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_slider_production_delete() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_slider_production_delete() OWNER TO postgres;

--
-- Name: slider_stock_after_slider_production_insert(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_slider_production_insert() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_slider_production_insert() OWNER TO postgres;

--
-- Name: slider_stock_after_slider_production_update(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_slider_production_update() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_slider_production_update() OWNER TO postgres;

--
-- Name: slider_stock_after_transaction_delete(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_transaction_delete() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_transaction_delete() OWNER TO postgres;

--
-- Name: slider_stock_after_transaction_insert(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_transaction_insert() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_transaction_insert() OWNER TO postgres;

--
-- Name: slider_stock_after_transaction_update(); Type: FUNCTION; Schema: slider; Owner: postgres
--

CREATE FUNCTION slider.slider_stock_after_transaction_update() RETURNS trigger
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


ALTER FUNCTION slider.slider_stock_after_transaction_update() OWNER TO postgres;

--
-- Name: order_entry_after_batch_is_drying_update(); Type: FUNCTION; Schema: thread; Owner: postgres
--

CREATE FUNCTION thread.order_entry_after_batch_is_drying_update() RETURNS trigger
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


ALTER FUNCTION thread.order_entry_after_batch_is_drying_update() OWNER TO postgres;

--
-- Name: order_entry_after_batch_is_dyeing_update(); Type: FUNCTION; Schema: thread; Owner: postgres
--

CREATE FUNCTION thread.order_entry_after_batch_is_dyeing_update() RETURNS trigger
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


ALTER FUNCTION thread.order_entry_after_batch_is_dyeing_update() OWNER TO postgres;

--
-- Name: order_description_after_dyed_tape_transaction_delete(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() RETURNS trigger
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


ALTER FUNCTION zipper.order_description_after_dyed_tape_transaction_delete() OWNER TO postgres;

--
-- Name: order_description_after_dyed_tape_transaction_insert(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() RETURNS trigger
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


ALTER FUNCTION zipper.order_description_after_dyed_tape_transaction_insert() OWNER TO postgres;

--
-- Name: order_description_after_dyed_tape_transaction_update(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.order_description_after_dyed_tape_transaction_update() RETURNS trigger
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


ALTER FUNCTION zipper.order_description_after_dyed_tape_transaction_update() OWNER TO postgres;

--
-- Name: order_description_after_tape_coil_to_dyeing_delete(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() RETURNS trigger
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


ALTER FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete() OWNER TO postgres;

--
-- Name: order_description_after_tape_coil_to_dyeing_insert(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() RETURNS trigger
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


ALTER FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert() OWNER TO postgres;

--
-- Name: order_description_after_tape_coil_to_dyeing_update(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() RETURNS trigger
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


ALTER FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update() OWNER TO postgres;

--
-- Name: sfg_after_order_entry_delete(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_order_entry_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM zipper.sfg
    WHERE order_entry_uuid = OLD.uuid;
    RETURN OLD;
END;
$$;


ALTER FUNCTION zipper.sfg_after_order_entry_delete() OWNER TO postgres;

--
-- Name: sfg_after_order_entry_insert(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_order_entry_insert() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_order_entry_insert() OWNER TO postgres;

--
-- Name: sfg_after_sfg_production_delete_function(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_sfg_production_delete_function() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_sfg_production_delete_function() OWNER TO postgres;

--
-- Name: sfg_after_sfg_production_insert_function(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_sfg_production_insert_function() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_sfg_production_insert_function() OWNER TO postgres;

--
-- Name: sfg_after_sfg_production_update_function(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_sfg_production_update_function() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_sfg_production_update_function() OWNER TO postgres;

--
-- Name: sfg_after_sfg_transaction_delete_function(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_sfg_transaction_delete_function() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_sfg_transaction_delete_function() OWNER TO postgres;

--
-- Name: sfg_after_sfg_transaction_insert_function(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_sfg_transaction_insert_function() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_sfg_transaction_insert_function() OWNER TO postgres;

--
-- Name: sfg_after_sfg_transaction_update_function(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.sfg_after_sfg_transaction_update_function() RETURNS trigger
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


ALTER FUNCTION zipper.sfg_after_sfg_transaction_update_function() OWNER TO postgres;

--
-- Name: stock_after_material_trx_against_order_description_delete_funct(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() RETURNS trigger
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


ALTER FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct() OWNER TO postgres;

--
-- Name: stock_after_material_trx_against_order_description_insert_funct(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() RETURNS trigger
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


ALTER FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct() OWNER TO postgres;

--
-- Name: stock_after_material_trx_against_order_description_update_funct(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() RETURNS trigger
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


ALTER FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct() OWNER TO postgres;

--
-- Name: tape_coil_after_tape_coil_production(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_after_tape_coil_production() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_after_tape_coil_production() OWNER TO postgres;

--
-- Name: tape_coil_after_tape_coil_production_delete(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_delete() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_after_tape_coil_production_delete() OWNER TO postgres;

--
-- Name: tape_coil_after_tape_coil_production_update(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_after_tape_coil_production_update() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_after_tape_coil_production_update() OWNER TO postgres;

--
-- Name: tape_coil_after_tape_trx_delete(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_after_tape_trx_delete() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_after_tape_trx_delete() OWNER TO postgres;

--
-- Name: tape_coil_after_tape_trx_insert(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_after_tape_trx_insert() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_after_tape_trx_insert() OWNER TO postgres;

--
-- Name: tape_coil_after_tape_trx_update(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_after_tape_trx_update() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_after_tape_trx_update() OWNER TO postgres;

--
-- Name: tape_coil_and_order_description_after_dyed_tape_transaction_del(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del() OWNER TO postgres;

--
-- Name: tape_coil_and_order_description_after_dyed_tape_transaction_ins(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins() OWNER TO postgres;

--
-- Name: tape_coil_and_order_description_after_dyed_tape_transaction_upd(); Type: FUNCTION; Schema: zipper; Owner: postgres
--

CREATE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() RETURNS trigger
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


ALTER FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bank; Type: TABLE; Schema: commercial; Owner: postgres
--

CREATE TABLE commercial.bank (
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


ALTER TABLE commercial.bank OWNER TO postgres;

--
-- Name: lc_sequence; Type: SEQUENCE; Schema: commercial; Owner: postgres
--

CREATE SEQUENCE commercial.lc_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE commercial.lc_sequence OWNER TO postgres;

--
-- Name: lc; Type: TABLE; Schema: commercial; Owner: postgres
--

CREATE TABLE commercial.lc (
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


ALTER TABLE commercial.lc OWNER TO postgres;

--
-- Name: pi_sequence; Type: SEQUENCE; Schema: commercial; Owner: postgres
--

CREATE SEQUENCE commercial.pi_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE commercial.pi_sequence OWNER TO postgres;

--
-- Name: pi_cash; Type: TABLE; Schema: commercial; Owner: postgres
--

CREATE TABLE commercial.pi_cash (
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


ALTER TABLE commercial.pi_cash OWNER TO postgres;

--
-- Name: pi_cash_entry; Type: TABLE; Schema: commercial; Owner: postgres
--

CREATE TABLE commercial.pi_cash_entry (
    uuid text NOT NULL,
    pi_cash_uuid text,
    sfg_uuid text,
    pi_cash_quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    thread_order_entry_uuid text
);


ALTER TABLE commercial.pi_cash_entry OWNER TO postgres;

--
-- Name: challan_sequence; Type: SEQUENCE; Schema: delivery; Owner: postgres
--

CREATE SEQUENCE delivery.challan_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE delivery.challan_sequence OWNER TO postgres;

--
-- Name: challan; Type: TABLE; Schema: delivery; Owner: postgres
--

CREATE TABLE delivery.challan (
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


ALTER TABLE delivery.challan OWNER TO postgres;

--
-- Name: challan_entry; Type: TABLE; Schema: delivery; Owner: postgres
--

CREATE TABLE delivery.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    packing_list_uuid text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE delivery.challan_entry OWNER TO postgres;

--
-- Name: packing_list_sequence; Type: SEQUENCE; Schema: delivery; Owner: postgres
--

CREATE SEQUENCE delivery.packing_list_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE delivery.packing_list_sequence OWNER TO postgres;

--
-- Name: packing_list; Type: TABLE; Schema: delivery; Owner: postgres
--

CREATE TABLE delivery.packing_list (
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


ALTER TABLE delivery.packing_list OWNER TO postgres;

--
-- Name: packing_list_entry; Type: TABLE; Schema: delivery; Owner: postgres
--

CREATE TABLE delivery.packing_list_entry (
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


ALTER TABLE delivery.packing_list_entry OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.users (
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


ALTER TABLE hr.users OWNER TO postgres;

--
-- Name: buyer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyer (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);


ALTER TABLE public.buyer OWNER TO postgres;

--
-- Name: factory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factory (
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


ALTER TABLE public.factory OWNER TO postgres;

--
-- Name: marketing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketing (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    user_uuid text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);


ALTER TABLE public.marketing OWNER TO postgres;

--
-- Name: merchandiser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchandiser (
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


ALTER TABLE public.merchandiser OWNER TO postgres;

--
-- Name: party; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.party (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text NOT NULL,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text,
    address text
);


ALTER TABLE public.party OWNER TO postgres;

--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
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


ALTER TABLE public.properties OWNER TO postgres;

--
-- Name: stock; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.stock (
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


ALTER TABLE slider.stock OWNER TO postgres;

--
-- Name: order_description; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.order_description (
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
    slider_provided integer DEFAULT 0,
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
    teeth_type text
);


ALTER TABLE zipper.order_description OWNER TO postgres;

--
-- Name: order_entry; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.order_entry (
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
    bleaching text
);


ALTER TABLE zipper.order_entry OWNER TO postgres;

--
-- Name: order_info_sequence; Type: SEQUENCE; Schema: zipper; Owner: postgres
--

CREATE SEQUENCE zipper.order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE zipper.order_info_sequence OWNER TO postgres;

--
-- Name: order_info; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.order_info (
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


ALTER TABLE zipper.order_info OWNER TO postgres;

--
-- Name: sfg; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.sfg (
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


ALTER TABLE zipper.sfg OWNER TO postgres;

--
-- Name: tape_coil; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.tape_coil (
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


ALTER TABLE zipper.tape_coil OWNER TO postgres;

--
-- Name: v_order_details_full; Type: VIEW; Schema: zipper; Owner: postgres
--

CREATE VIEW zipper.v_order_details_full AS
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
    stock.uuid AS stock_uuid,
    stock.order_quantity AS stock_order_quantity,
    order_description.tape_coil_uuid,
    tc.name AS tape_name,
    order_description.teeth_type,
    op_teeth_type.name AS teeth_type_name,
    op_teeth_type.short_name AS teeth_type_short_name
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


ALTER VIEW zipper.v_order_details_full OWNER TO postgres;

--
-- Name: v_packing_list; Type: VIEW; Schema: delivery; Owner: postgres
--

CREATE VIEW delivery.v_packing_list AS
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


ALTER VIEW delivery.v_packing_list OWNER TO postgres;

--
-- Name: migrations_details; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.migrations_details (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.migrations_details OWNER TO postgres;

--
-- Name: migrations_details_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.migrations_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.migrations_details_id_seq OWNER TO postgres;

--
-- Name: migrations_details_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.migrations_details_id_seq OWNED BY drizzle.migrations_details.id;


--
-- Name: department; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.department (
    uuid text NOT NULL,
    department text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE hr.department OWNER TO postgres;

--
-- Name: designation; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.designation (
    uuid text NOT NULL,
    department_uuid text,
    designation text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE hr.designation OWNER TO postgres;

--
-- Name: policy_and_notice; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.policy_and_notice (
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


ALTER TABLE hr.policy_and_notice OWNER TO postgres;

--
-- Name: info; Type: TABLE; Schema: lab_dip; Owner: postgres
--

CREATE TABLE lab_dip.info (
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


ALTER TABLE lab_dip.info OWNER TO postgres;

--
-- Name: info_id_seq; Type: SEQUENCE; Schema: lab_dip; Owner: postgres
--

CREATE SEQUENCE lab_dip.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE lab_dip.info_id_seq OWNER TO postgres;

--
-- Name: info_id_seq; Type: SEQUENCE OWNED BY; Schema: lab_dip; Owner: postgres
--

ALTER SEQUENCE lab_dip.info_id_seq OWNED BY lab_dip.info.id;


--
-- Name: recipe; Type: TABLE; Schema: lab_dip; Owner: postgres
--

CREATE TABLE lab_dip.recipe (
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


ALTER TABLE lab_dip.recipe OWNER TO postgres;

--
-- Name: recipe_entry; Type: TABLE; Schema: lab_dip; Owner: postgres
--

CREATE TABLE lab_dip.recipe_entry (
    uuid text NOT NULL,
    recipe_uuid text,
    color text NOT NULL,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    material_uuid text
);


ALTER TABLE lab_dip.recipe_entry OWNER TO postgres;

--
-- Name: recipe_id_seq; Type: SEQUENCE; Schema: lab_dip; Owner: postgres
--

CREATE SEQUENCE lab_dip.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE lab_dip.recipe_id_seq OWNER TO postgres;

--
-- Name: recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: lab_dip; Owner: postgres
--

ALTER SEQUENCE lab_dip.recipe_id_seq OWNED BY lab_dip.recipe.id;


--
-- Name: shade_recipe_sequence; Type: SEQUENCE; Schema: lab_dip; Owner: postgres
--

CREATE SEQUENCE lab_dip.shade_recipe_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE lab_dip.shade_recipe_sequence OWNER TO postgres;

--
-- Name: shade_recipe; Type: TABLE; Schema: lab_dip; Owner: postgres
--

CREATE TABLE lab_dip.shade_recipe (
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


ALTER TABLE lab_dip.shade_recipe OWNER TO postgres;

--
-- Name: shade_recipe_entry; Type: TABLE; Schema: lab_dip; Owner: postgres
--

CREATE TABLE lab_dip.shade_recipe_entry (
    uuid text NOT NULL,
    shade_recipe_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE lab_dip.shade_recipe_entry OWNER TO postgres;

--
-- Name: info; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.info (
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


ALTER TABLE material.info OWNER TO postgres;

--
-- Name: section; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);


ALTER TABLE material.section OWNER TO postgres;

--
-- Name: stock; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.stock (
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


ALTER TABLE material.stock OWNER TO postgres;

--
-- Name: stock_to_sfg; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.stock_to_sfg (
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


ALTER TABLE material.stock_to_sfg OWNER TO postgres;

--
-- Name: trx; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.trx (
    uuid text NOT NULL,
    material_uuid text,
    trx_to text NOT NULL,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE material.trx OWNER TO postgres;

--
-- Name: type; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.type (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    created_by text
);


ALTER TABLE material.type OWNER TO postgres;

--
-- Name: used; Type: TABLE; Schema: material; Owner: postgres
--

CREATE TABLE material.used (
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


ALTER TABLE material.used OWNER TO postgres;

--
-- Name: machine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine (
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


ALTER TABLE public.machine OWNER TO postgres;

--
-- Name: section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section (
    uuid text NOT NULL,
    name text NOT NULL,
    short_name text,
    remarks text
);


ALTER TABLE public.section OWNER TO postgres;

--
-- Name: purchase_description_sequence; Type: SEQUENCE; Schema: purchase; Owner: postgres
--

CREATE SEQUENCE purchase.purchase_description_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE purchase.purchase_description_sequence OWNER TO postgres;

--
-- Name: description; Type: TABLE; Schema: purchase; Owner: postgres
--

CREATE TABLE purchase.description (
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


ALTER TABLE purchase.description OWNER TO postgres;

--
-- Name: entry; Type: TABLE; Schema: purchase; Owner: postgres
--

CREATE TABLE purchase.entry (
    uuid text NOT NULL,
    purchase_description_uuid text,
    material_uuid text,
    quantity numeric(20,4) NOT NULL,
    price numeric(20,4) DEFAULT NULL::numeric,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE purchase.entry OWNER TO postgres;

--
-- Name: vendor; Type: TABLE; Schema: purchase; Owner: postgres
--

CREATE TABLE purchase.vendor (
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


ALTER TABLE purchase.vendor OWNER TO postgres;

--
-- Name: assembly_stock; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.assembly_stock (
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


ALTER TABLE slider.assembly_stock OWNER TO postgres;

--
-- Name: coloring_transaction; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.coloring_transaction (
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


ALTER TABLE slider.coloring_transaction OWNER TO postgres;

--
-- Name: die_casting; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.die_casting (
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


ALTER TABLE slider.die_casting OWNER TO postgres;

--
-- Name: die_casting_production; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.die_casting_production (
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


ALTER TABLE slider.die_casting_production OWNER TO postgres;

--
-- Name: die_casting_to_assembly_stock; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.die_casting_to_assembly_stock (
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


ALTER TABLE slider.die_casting_to_assembly_stock OWNER TO postgres;

--
-- Name: die_casting_transaction; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.die_casting_transaction (
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


ALTER TABLE slider.die_casting_transaction OWNER TO postgres;

--
-- Name: production; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.production (
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


ALTER TABLE slider.production OWNER TO postgres;

--
-- Name: transaction; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.transaction (
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


ALTER TABLE slider.transaction OWNER TO postgres;

--
-- Name: trx_against_stock; Type: TABLE; Schema: slider; Owner: postgres
--

CREATE TABLE slider.trx_against_stock (
    uuid text NOT NULL,
    die_casting_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    weight numeric(20,4) DEFAULT 0 NOT NULL
);


ALTER TABLE slider.trx_against_stock OWNER TO postgres;

--
-- Name: thread_batch_sequence; Type: SEQUENCE; Schema: thread; Owner: postgres
--

CREATE SEQUENCE thread.thread_batch_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE thread.thread_batch_sequence OWNER TO postgres;

--
-- Name: batch; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.batch (
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


ALTER TABLE thread.batch OWNER TO postgres;

--
-- Name: batch_entry; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.batch_entry (
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


ALTER TABLE thread.batch_entry OWNER TO postgres;

--
-- Name: batch_entry_production; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.batch_entry_production (
    uuid text NOT NULL,
    batch_entry_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    coning_carton_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE thread.batch_entry_production OWNER TO postgres;

--
-- Name: batch_entry_trx; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.batch_entry_trx (
    uuid text NOT NULL,
    batch_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    carton_quantity integer DEFAULT 0
);


ALTER TABLE thread.batch_entry_trx OWNER TO postgres;

--
-- Name: challan; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.challan (
    uuid text NOT NULL,
    order_info_uuid text,
    carton_quantity integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    assign_to text,
    gate_pass integer DEFAULT 0,
    received integer DEFAULT 0
);


ALTER TABLE thread.challan OWNER TO postgres;

--
-- Name: challan_entry; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.challan_entry (
    uuid text NOT NULL,
    challan_uuid text,
    order_entry_uuid text,
    quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    carton_quantity integer NOT NULL,
    short_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    reject_quantity numeric(20,4) DEFAULT 0 NOT NULL
);


ALTER TABLE thread.challan_entry OWNER TO postgres;

--
-- Name: count_length; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.count_length (
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


ALTER TABLE thread.count_length OWNER TO postgres;

--
-- Name: dyes_category; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.dyes_category (
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


ALTER TABLE thread.dyes_category OWNER TO postgres;

--
-- Name: order_entry; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.order_entry (
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


ALTER TABLE thread.order_entry OWNER TO postgres;

--
-- Name: thread_order_info_sequence; Type: SEQUENCE; Schema: thread; Owner: postgres
--

CREATE SEQUENCE thread.thread_order_info_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE thread.thread_order_info_sequence OWNER TO postgres;

--
-- Name: order_info; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.order_info (
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


ALTER TABLE thread.order_info OWNER TO postgres;

--
-- Name: programs; Type: TABLE; Schema: thread; Owner: postgres
--

CREATE TABLE thread.programs (
    uuid text NOT NULL,
    dyes_category_uuid text,
    material_uuid text,
    quantity numeric(20,4) DEFAULT 0 NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE thread.programs OWNER TO postgres;

--
-- Name: batch; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.batch (
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


ALTER TABLE zipper.batch OWNER TO postgres;

--
-- Name: batch_entry; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.batch_entry (
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


ALTER TABLE zipper.batch_entry OWNER TO postgres;

--
-- Name: batch_id_seq; Type: SEQUENCE; Schema: zipper; Owner: postgres
--

CREATE SEQUENCE zipper.batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE zipper.batch_id_seq OWNER TO postgres;

--
-- Name: batch_id_seq; Type: SEQUENCE OWNED BY; Schema: zipper; Owner: postgres
--

ALTER SEQUENCE zipper.batch_id_seq OWNED BY zipper.batch.id;


--
-- Name: batch_production; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.batch_production (
    uuid text NOT NULL,
    batch_entry_uuid text,
    production_quantity numeric(20,4) NOT NULL,
    production_quantity_in_kg numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE zipper.batch_production OWNER TO postgres;

--
-- Name: dyed_tape_transaction; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.dyed_tape_transaction (
    uuid text NOT NULL,
    order_description_uuid text,
    colors text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE zipper.dyed_tape_transaction OWNER TO postgres;

--
-- Name: dyed_tape_transaction_from_stock; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.dyed_tape_transaction_from_stock (
    uuid text NOT NULL,
    order_description_uuid text,
    trx_quantity numeric(20,4) DEFAULT 0 NOT NULL,
    tape_coil_uuid text,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE zipper.dyed_tape_transaction_from_stock OWNER TO postgres;

--
-- Name: dying_batch; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.dying_batch (
    uuid text NOT NULL,
    id integer NOT NULL,
    mc_no integer NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE zipper.dying_batch OWNER TO postgres;

--
-- Name: dying_batch_entry; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.dying_batch_entry (
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


ALTER TABLE zipper.dying_batch_entry OWNER TO postgres;

--
-- Name: dying_batch_id_seq; Type: SEQUENCE; Schema: zipper; Owner: postgres
--

CREATE SEQUENCE zipper.dying_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE zipper.dying_batch_id_seq OWNER TO postgres;

--
-- Name: dying_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: zipper; Owner: postgres
--

ALTER SEQUENCE zipper.dying_batch_id_seq OWNED BY zipper.dying_batch.id;


--
-- Name: material_trx_against_order_description; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.material_trx_against_order_description (
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


ALTER TABLE zipper.material_trx_against_order_description OWNER TO postgres;

--
-- Name: planning; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.planning (
    week text NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE zipper.planning OWNER TO postgres;

--
-- Name: planning_entry; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.planning_entry (
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


ALTER TABLE zipper.planning_entry OWNER TO postgres;

--
-- Name: sfg_production; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.sfg_production (
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


ALTER TABLE zipper.sfg_production OWNER TO postgres;

--
-- Name: sfg_transaction; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.sfg_transaction (
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


ALTER TABLE zipper.sfg_transaction OWNER TO postgres;

--
-- Name: tape_coil_production; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.tape_coil_production (
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


ALTER TABLE zipper.tape_coil_production OWNER TO postgres;

--
-- Name: tape_coil_required; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.tape_coil_required (
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


ALTER TABLE zipper.tape_coil_required OWNER TO postgres;

--
-- Name: tape_coil_to_dyeing; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.tape_coil_to_dyeing (
    uuid text NOT NULL,
    tape_coil_uuid text,
    order_description_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text
);


ALTER TABLE zipper.tape_coil_to_dyeing OWNER TO postgres;

--
-- Name: tape_trx; Type: TABLE; Schema: zipper; Owner: postgres
--

CREATE TABLE zipper.tape_trx (
    uuid text NOT NULL,
    tape_coil_uuid text,
    trx_quantity numeric(20,4) NOT NULL,
    created_by text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    remarks text,
    to_section text
);


ALTER TABLE zipper.tape_trx OWNER TO postgres;

--
-- Name: v_order_details; Type: VIEW; Schema: zipper; Owner: postgres
--

CREATE VIEW zipper.v_order_details AS
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


ALTER VIEW zipper.v_order_details OWNER TO postgres;

--
-- Name: migrations_details id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.migrations_details ALTER COLUMN id SET DEFAULT nextval('drizzle.migrations_details_id_seq'::regclass);


--
-- Name: info id; Type: DEFAULT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.info ALTER COLUMN id SET DEFAULT nextval('lab_dip.info_id_seq'::regclass);


--
-- Name: recipe id; Type: DEFAULT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe ALTER COLUMN id SET DEFAULT nextval('lab_dip.recipe_id_seq'::regclass);


--
-- Name: batch id; Type: DEFAULT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch ALTER COLUMN id SET DEFAULT nextval('zipper.batch_id_seq'::regclass);


--
-- Name: dying_batch id; Type: DEFAULT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dying_batch ALTER COLUMN id SET DEFAULT nextval('zipper.dying_batch_id_seq'::regclass);


--
-- Data for Name: bank; Type: TABLE DATA; Schema: commercial; Owner: postgres
--

COPY commercial.bank (uuid, name, swift_code, address, policy, created_at, updated_at, remarks, created_by, routing_no) FROM stdin;
\.


--
-- Data for Name: lc; Type: TABLE DATA; Schema: commercial; Owner: postgres
--

COPY commercial.lc (uuid, party_uuid, lc_number, lc_date, payment_value, payment_date, ldbc_fdbc, acceptance_date, maturity_date, commercial_executive, party_bank, production_complete, lc_cancel, handover_date, shipment_date, expiry_date, ud_no, ud_received, at_sight, amd_date, amd_count, problematical, epz, created_by, created_at, updated_at, remarks, id, document_receive_date, is_rtgs) FROM stdin;
\.


--
-- Data for Name: pi_cash; Type: TABLE DATA; Schema: commercial; Owner: postgres
--

COPY commercial.pi_cash (uuid, id, lc_uuid, order_info_uuids, marketing_uuid, party_uuid, merchandiser_uuid, factory_uuid, bank_uuid, validity, payment, is_pi, conversion_rate, receive_amount, created_by, created_at, updated_at, remarks, weight, thread_order_info_uuids) FROM stdin;
\.


--
-- Data for Name: pi_cash_entry; Type: TABLE DATA; Schema: commercial; Owner: postgres
--

COPY commercial.pi_cash_entry (uuid, pi_cash_uuid, sfg_uuid, pi_cash_quantity, created_at, updated_at, remarks, thread_order_entry_uuid) FROM stdin;
\.


--
-- Data for Name: challan; Type: TABLE DATA; Schema: delivery; Owner: postgres
--

COPY delivery.challan (uuid, carton_quantity, assign_to, receive_status, created_by, created_at, updated_at, remarks, id, gate_pass, order_info_uuid) FROM stdin;
\.


--
-- Data for Name: challan_entry; Type: TABLE DATA; Schema: delivery; Owner: postgres
--

COPY delivery.challan_entry (uuid, challan_uuid, packing_list_uuid, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: packing_list; Type: TABLE DATA; Schema: delivery; Owner: postgres
--

COPY delivery.packing_list (uuid, carton_size, carton_weight, created_by, created_at, updated_at, remarks, order_info_uuid, id, challan_uuid) FROM stdin;
\.


--
-- Data for Name: packing_list_entry; Type: TABLE DATA; Schema: delivery; Owner: postgres
--

COPY delivery.packing_list_entry (uuid, packing_list_uuid, sfg_uuid, quantity, created_at, updated_at, remarks, short_quantity, reject_quantity) FROM stdin;
\.


--
-- Data for Name: migrations_details; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.migrations_details (id, hash, created_at) FROM stdin;
1	354313859229e7716a0ecf39cfce60fea53178c0ce8e27803aab1152aff9cb8c	1723446964593
2	373cacd9864fef954a056def5c6357f05ded0d226fc996c618ed0f6ccb8ec2a4	1723536664929
3	f14e39e6bfb77a0972eb5c773d6964b82b4682ca20878b8f1a71665c7817289a	1723615337489
4	7f57ad2d74c8649d60d5c92eafa2382667f68deb0faa3af8cb85dbcbae54eff9	1723705428392
5	0f53c931303c8238207aedf378261bafe1a9fe0387e2a01c8293529202cb5cae	1723706971560
6	a9ce6b22c22ffbf59bd768f5481f40a5b6cb387817efad0519a8ffa05631f881	1723708148317
7	ad3aa9e0a02af299d351605dad3e1374805ab49c67d46dea8d11dbd0dcf1dd35	1723712185954
8	00b1933d63bd9d9569beb23bb666c5b8a6db6779a92cee3424cd9ffe035f85ca	1723718129355
9	61b3d34c61ecf6aa93544081d19250f856b1019400f7064d50c662ad521214c2	1724008647303
10	638b05a5f03e5d7d0cdd4e3362292a5e3e9dc8ad2027a91c80e72977a9f4505e	1724009602530
11	1f2e9ea86553643b67140e563ae51d7fee30521c52ed1e838a1e4a0f7a6d2e52	1724009619835
12	84f01395925f256aa3d357aa3faa2206c39945e17c0d78fc65f6fe0fdad0d193	1724009640484
13	e4b750d0a376f2578523dc4859e0bb9a7c2de34192b36e6d17b51c43c5ea791a	1724009660653
14	229e1791210588213a019d913245a7fd9178b7efc9c1d2d86b0b13c67e0e5d62	1724050165934
15	5a5b7e490e73fbbfd8d8c06ae1e84d71efb80e399d38b1a555ad96444ac35127	1724057663897
16	8b7cbf754336d157b9b0d554e21a94dc2b2c588a9903b471616a11288ee0f46b	1724070817888
17	a08ff02c63c94abbfae26b7c4995cbe9e727492109ef8d71b231d9cb85377a32	1724091870854
18	007639458bba6452f2c63c468253829d4f4dd2dc478d75ae7879b180d584eedb	1724093131852
19	25489b636bd92e3d8295361ed08daa4abc24a4e8b632640bbe237350e9a6f8e4	1724095107503
20	374394999a42ba24ff84ef17f51fc01e22e56faa3567602d04600b5b4ab2c0a8	1724134205095
21	6df26f3872fd0db5914f594f5011afdec0c87811a3ea7f1a2e4c2720abc2ecef	1724139735112
22	fc0c6e6b5d4065f87b86eab976d092dd5d76a8bffd9981c67c414ff9e96eaff1	1724143173558
23	263697329b2cc3d246d71171f28c3b243e09f1f38467df608b38e1b5b93e8267	1724149205093
24	c0eb333f3fcc2a134a1bfc6b12bc5d679e6aae292d8188a7b7ed4c49f8422dd2	1724155097253
25	5711aca5bc29332c1ad1aab739cf8d3e25834d29c17dcd9063816ce871038f90	1724562571701
26	058b88ae67395fef70cc4540282937eaa0b6db7ca205bae95e236bbfddbb2ca8	1724579817641
27	3de3b805339902ffec392a4aeca9bbea8d78f7821d66782b694965bf51132306	1724579864873
28	dd8dd7a12c6043af0b2cbf21725053e29d402d20eb28011a7856d4c44f1c82cc	1724581936252
29	08c629da682c15a91ea07545f424d6a52d7cc0ec9d7a23496768ce3aacc2db0c	1724596416351
30	55acdb109413ae83e681200e11f9cb945fbeddec1b688f5139a2f6acfcfdf1ae	1724650651493
31	0ce9cdbedd3f6c162a9dddabc2c137314c918e09dc5d815d9c171b1cc3ff8346	1724672836240
32	330f59f5efa0c71d4830d5445c32e7360aad2fd70b208342bfb6b1d1de676a46	1724747857274
33	37b4e5e50a9bcbc2ca1b9e6a4afadb898d3392a5f93ed548c00181457c617c3f	1724748922518
34	d25c06f7315c0743ed731429a75de82ddddfb683f7916bd3a3a3b6156655c624	1724764198878
35	c0b879486b9d12fae92d71027954a35aca84f699b4bf8a6ca5ae82e69ebaa787	1724764322770
36	f754120d513850d81a1021bbe65c2459d5dc7c7613070afeb9912a7eebffac63	1724764451240
37	36c679d70d40c15ef562f2d708ca7900596de5cb64c5161d7dbb3e967fb6e48e	1724769003693
38	bb950f39d0c965a99bcd59c5b434e451a6d0a87ca6162cfd8cf9e8afa2643a69	1724770723237
39	77c88eb1a94dea785793e565e8de70dd371417df7b256864e76c125b6f88d853	1725006163033
40	a88c3631ff07ed735a3ecc96b351d855517aa00ff4451656c8908266893e796e	1725022142710
41	5cc2ae45bc9052fae6af9105bcfa5773b9101f1e2cc3fadc097b2e70314f043e	1725260220785
42	c66a1199637922fe2a6a1029f95e29b0e741a92b55f662ac55b5f395bd03444f	1725350471752
43	21c583e2d8147996cd4dd8b9e7c5b53570295eed705ae33a35bc4a049975e070	1725350676637
44	9b7f8e2653b926f3c0d53187461100e68cc1121f1b610cc68eeb71d4501e9013	1725351041019
45	dfc8f2f721ce611cfa7c756cdaf4c1bd68df37c249b4aef9c24ff95c0d447cc9	1725352055342
46	5cc30a4831f06a3912e6b88117c31c4f55f309d06b7f3398d408de96655edbf5	1725352518693
47	cbbfae39dc7a82c11e0a706b50d609413ae23240822cd1a07947dd5303a979b7	1725353550306
48	93644735b26c4fadb0e9c291d675d77815495cb76bfece3ba6b3bace568c9517	1725353772745
49	6911f3a00bfc4f8dfc03e4cb60339c67c16d13ceca6401209e7f05b034307422	1725354252881
50	6075b6f81e62031bd592af0396c905bbe735994c70fecd58e4f7b9c73ef66c90	1725355895571
51	8285a5c80f0e6c429bb7f9dfdb48823d0e1b5ccdc9ee5a0741cc68b777bd44de	1725370549670
52	ed16df51700ad2c06ba4d9c774002151d051e83fb5f1cb606f68c1683fbaa281	1725370634020
53	b2eafb9e69331fd6b73c0b7bb81f76f4f5ce8a6d58174284aa5f392f9982b715	1725371735089
54	145bb4ff9432fc5a0c51f3eb1b33111cd5e81f784b5fd98b46da80a8f451a077	1725374988774
55	07e0752a6d5792c419d2638d5fe47c56321ec77baecd9d00ca6a77c5044cefb8	1725376178286
56	5bde40515eb4468aa9db05304a62956a97a4c4d237f60db52b452401e66f0be9	1725466673149
57	3f7f4f9a56ebe7b0f6b4a9970fa493d4b5ef794c26f758aed657aca1adede6f4	1725471600658
58	018daff1072e4c092aa94390d54527ec5797751220debba65f5750165320b9f3	1725779633196
59	fa037aac88ec7d21244cac8ee384412bbd4b1e5c105484317028fc2ff4b65a22	1725779651760
60	22a8d45f16bfbddaf996c40c86a941e8a587f04b75ebd20b28f74a419a4e3e94	1725785383019
61	a4145659034545e7da47a71896f915e0b604d31624c0435c2b5b0dae77df9665	1725792282242
62	e865fd884f3c8702e30eef8b0894f262c06a76d2ebb3a54612299cadd714b005	1725804439381
63	b8308594c417b737e097cdd1e86168f84edf4819bb7607fde2754ab192dad76f	1725961995112
64	1cde71a7ebebe3aaffe08e5e46f2da1a130bea56dca24ea7a30428b77d3bf8ae	1725977292360
65	2bdc421918a7d688dd9c10c67c15f249e03c79233d5c9565d66a4a6950ffe365	1725979848437
66	17e72e5a46521eeb78497c265b6fcdadc7e4829723f9d0a1abe80431c7b44544	1726061022864
67	0aefeb8310c1060592c363c337fb2736cb495eb3cc840cf8abad7256f0f772d6	1726087570048
68	cce1fbaeee8a7dacac4b6914c44487b54859ff7a7eddf8b128c3c162d7bfaa84	1726088175958
69	075a900fdd13aa2a78ce8c101a961645b640ec56d14fe24494e441f40b29f0ff	1726120894237
70	45841c5d1523067cd26e22442be6d86c503ee3e780e898451cc8aa69a8ab6200	1726120912179
71	13fede1ce47ef813b6a71445bd81176869a150cfcafe89d4cef4f70a2e4a9cde	1726125086470
72	18e8f2db9eee6d7dd1de68acd59b66f5f9f6dc256114509559a41e670f4c25ff	1726305138109
73	8a403b70cb00de90cb16af8dbb678db10876cd9c51146dc23f7875353158b51a	1726377545050
74	0a475630c619ab148557422fee10816af7ced11e866d3cb0591b4b97f72cad9f	1726383996633
75	52225676fa94468926c1a6872144f4a528ba2f446211b8892afed2143bc0d23e	1726444498782
76	2366974f0d6977eaa4bad9c2188cedf93fd8699b042e314aa4dfb2a318953ae0	1726444668472
77	4c4dfb9fdc9bae2e21bbd0a650a5106dad71a32596c392857341b1511b8f1306	1726445222885
78	46deb4f559cd7445996a2bc3c3a9e633e9cd31acc43d6ec89cea849e41ee404f	1726477089300
79	c6c63fc2b70ec40338c627c2e2efe810d185efefa2c304bb9a32c0764a4470d2	1726638727610
80	68dca5b07beec4ec4a5e241c77da2806b0c4125813a24bcee2154666273a026e	1726640012869
81	da2c968367499bbfed07237e13fe0ce579451180a9216af2d9891314d8455120	1726640797764
82	ebc005f083684c6a5ba8cbcca79680b4b55d20510f9c0f078de0ffe422e73cf2	1726642065543
83	764d5c402bc79095c2a6cf3618ab8cee3cd0d6e7bb6d0a965e1262bafd34019c	1726649333677
84	cbd5914c932a2abbe01c076b0f6a5ec814c9d3edf44ff725b17c8c2a0ccb881a	1726652598514
85	c50be18e74db405a7595134314ae9304274b22b861448a31b72303b4e1ebe702	1726652620892
86	913ff6fb3fffc90b699f3d902591f5507efe23724200997c72ec4f4c612b79d2	1726656864264
87	6380a24f5e41cfa6ace72877304137408e4129600588b6ee6b86bb358615f861	1726658946222
91	ba1acdea80147d51a968b9fe038381c296f5e1498f1290d785b48dce5e8f0ba5	1726658973800
92	de439e48e48db3659710ae29faec2400f4aeb482980b241e4103b6bbd90e3b6c	1726665429089
93	cf7ba4fda301beeaea6d6f8a2e8b1f5a5d5cfa91a1a5bc1734b3df94caa12aee	1726671156145
94	b12e4ca586c00640566f419d8fa5fc7a83aacb64669f4c65ed551c722cd6af54	1726727431292
95	dd8a98c2bd9e675f63d0815404c4d3aff28ac803648dd7bdb13ffb50e6b4a50d	1726731713180
96	f18cc7379943d73cafeff427881eb21abe44409c82939b65c5dd661ea954e4fd	1726732432393
97	f2efb7999ff743189871e64dc764b3e30306174713a65d884ed7e767558d32e2	1726736229689
98	45ced7471500b85c5f42945da6102ce3fd66559855bee9642f8df40c60c511f2	1726742893835
99	cf57c90faaebbb6a9c7f42a95e966afa0e594bbc89d324d052394191032ba8ab	1726979172601
100	fd677e75bd324d1203b1b21b905260798c78b909080656b8df8767fb27f004c5	1726985765380
101	8fee6674964b2a93c927529c7eb3ebbe338dd0026aba69ffc1adbbe9b2946b82	1727026850185
102	aa2ae1ccc978260bf2e5e34b58627d4479299e1520c0158eaf5cf8cad6f9f36b	1727070077444
103	c3100e52293c3e8e65c81dcd2b7a49235073417bf1d74bba12875d4ea362166b	1727075870347
104	691373fb1286d18e095e6c9087eee042090be4561e693ea64dbdfb81dce0e53b	1727092643389
105	c7c801e1cb32458b15e662c1a461b008ea864923d1ffdd053c8763579984ba05	1727154063804
106	44e41cb4ecc9160d78490a8eba1ab6f65a0f2b82ae85615206800581a7d4a931	1727155585941
107	a705cb819692a951093c57e520264f1945223874a091d4df8f39ada81b0588c8	1727156576886
108	0c8a9ef86711b3c72e38f63d1ef75f306c66d73382b6863f9463f34046041b52	1727160204610
109	28b1dec828e8d39d4ccb520ade0214da6ce40fd8486bf3ffccc23cbd1390780c	1727171598491
110	a8185e65b9b85c678090cdacaea946b01f45c0359c71a8b4f17c52c90c35906a	1727177914767
111	ebfac1dcbda3619f452f8969abd89a32bfc4c62de55aed084a39365e04f8c9ab	1727179226028
112	7d9be748cb1e62bca4df7c193d4b725e673db45bfa0249715a533aee76c38abc	1727179358555
113	41fd452253a3f518a7919d46f77265179983ce0205325194c5b0e64c0a95f301	1727194286710
114	be1bd15c5e9ac5b9ed9f543d9e6f6e9ccd20d8bcfd565481dbf4183c7670df64	1727196753933
115	26f7618b1ee4fd699360f52bd30e34655582b08b8a9c40aafcdcbb2b500f0e4a	1727197041061
116	8b664f523a5d40277580da5953ce21c6127efcbf6c47cc228ac59d52f3ab4c22	1727206018348
117	ecf0ecab7301bd8ca9971282e4871527a1a22cd0f8fe91b53a83719fd31c310f	1727259949727
118	c0dd9830de9043f201c19d92dca5f51018af9fc51dcdc7336f7864bfab9d5029	1727272896011
119	73226397a6c930abcf6ce1ca579c642f1619cc1c6d52dd8f0960a1fa616855ff	1727335281332
120	e597786eec8e8848abee5cead424e07c28c17847175a8179d77fe9374540846b	1727335504319
121	44fd51de440a81aa38915ba5ecf0b92e62bdd75ea78012752d29754b7665bede	1727337917789
122	102ddcd1830108d24eb921995b9f5c1836c4ccf9b95b388eb40349fd6c02d68f	1727347211054
123	27807de1d3e70df41adf5793e468003e20490a2e0d135006e919466d8ac5bc90	1727348716978
124	1ed612365f4f2333aa95205655aefb54e04a0aa89f1a9297bc5a35fc6fd34532	1727361127341
125	7826deb14eb1e8a530fb210d49e79a6092d8d81a41f2b4d7a532f66112a6ee4b	1727433209036
126	ff97097effe5c72e428769dd83dae33f3e27c1081b34d9d63c87b9942fb88f94	1727437868776
127	0e2ca159c07b5b98c08bcd079d7a294e3bba8a2c6c73596cd52edbb3ed12a404	1727588926030
128	43b8a7e02efe8ba2744610a7554ddc00ae0f34e198fc0f73fd1c5d4699abe7dd	1727598510940
129	490d5362d03514acb5eecf232880e521fea1d3fae5dfbf7ffa597aa02fa5352e	1727609983317
130	11619a0ab5b07ff7430843dfbc4c0106acaab67410c7e567f933b9ee7c8035e3	1727682046309
131	6b61e589e09afd435f6e49c6ad950e747faf12777a9186f097a1e7f1d03194cf	1727700375047
\.


--
-- Data for Name: department; Type: TABLE DATA; Schema: hr; Owner: postgres
--

COPY hr.department (uuid, department, created_at, updated_at, remarks) FROM stdin;
UOBzrqBVXPqdfxZ	test	2024-09-03 14:38:04	\N	\N
igD0v9DIJQhHeey	HR	2024-09-03 14:38:04	\N	\N
igD0v9DIJQhJeet	Admin	2024-09-03 14:38:04	\N	\N
VB1CeInHpYvsYpF	IT	2024-09-10 19:10:20	\N	\N
x0CqEsTizTaWZuV	Store	2024-09-12 15:58:13	\N	
GzUqh4918qAyiJO	Lab	2024-09-17 13:32:12	\N	\N
Pguakl6ZLLUIvn1	Delivery	2024-09-24 14:29:33	\N	\N
mh0pWGsOpALsytm	SNO	2024-09-28 08:56:37	\N	\N
9uihcGEPBk1Hl2D	Commercial	2024-09-28 08:56:47	\N	\N
lQrVXHEOnfTSFrm	Lab	2024-09-28 08:56:57	\N	\N
EwCskNLxUZs0H5a	Dyeing	2024-09-28 08:58:28	\N	\N
5PlbYS0UNaB6iHi	Tape	2024-09-28 08:58:34	\N	\N
I2ifvRCUYkyCyzH	Metal	2024-09-28 08:58:40	\N	\N
pbiRlkgoMN4aL19	Nylon	2024-09-28 08:58:46	\N	\N
BrBVaP4YlZ56uHI	Vislon	2024-09-28 08:58:52	\N	\N
yFAsYmBV7cQIgse	Slider	2024-09-28 08:59:08	\N	\N
oST2Mo0DG4YMmSy	Packing	2024-09-28 08:59:48	\N	\N
kvWa62nUUj9dgQB	Delivery	2024-09-28 08:59:56	\N	\N
tDo2rCd81we5pcQ	Thread	2024-09-28 10:14:02	\N	\N
wijxfiATUvMJMh5	Thread Coning	2024-09-28 10:14:16	\N	\N
gisj7qYNyu9I9yH	Batch Create	2024-09-28 10:31:44	\N	
moY6URp2sgVVfhD	Coordination	2024-09-28 10:33:53	\N	\N
igD0v9DIJQhQeey	Sales And Marketing	2024-09-03 14:38:04	2024-10-02 11:51:29	
\.


--
-- Data for Name: designation; Type: TABLE DATA; Schema: hr; Owner: postgres
--

COPY hr.designation (uuid, department_uuid, designation, created_at, updated_at, remarks) FROM stdin;
igD0v9DIJQhJeet	igD0v9DIJQhJeet	Admin	2024-09-03 14:38:04	\N	\N
0veAgtyvIwm7w4q	VB1CeInHpYvsYpF	Software Engineer	2024-09-10 19:10:39	\N	\N
PXfqpfiomUQSgCe	x0CqEsTizTaWZuV	Manager	2024-09-12 15:58:33	\N	\N
6fAPyVgfcUlVdDO	GzUqh4918qAyiJO	Manager	2024-09-17 13:32:28	\N	
DwFktdfBCwIdgIV	Pguakl6ZLLUIvn1	Driver	2024-09-24 14:29:57	\N	\N
igD0v9DIJQhHeey	igD0v9DIJQhHeey	Manager	2024-09-03 14:38:04	2024-09-28 09:01:17	\N
FRD7gdiBE7wgVxI	9uihcGEPBk1Hl2D	Manager	2024-09-28 10:07:43	\N	\N
HAe7AXgWIOYNRB0	EwCskNLxUZs0H5a	Manager	2024-09-28 10:08:23	\N	\N
6RmxkIdBTWDC0FC	5PlbYS0UNaB6iHi	Manager	2024-09-28 10:09:42	\N	\N
0qPEgDdrDU6vOQK	I2ifvRCUYkyCyzH	Manager	2024-09-28 10:12:25	\N	\N
yYbb5GYKyqMLqQ9	pbiRlkgoMN4aL19	Manager	2024-09-28 10:12:33	\N	\N
StUB4Yt6VmdbXzb	BrBVaP4YlZ56uHI	Manager	2024-09-28 10:12:40	\N	\N
KKzy53tc0rz9hz7	yFAsYmBV7cQIgse	Manager	2024-09-28 10:12:50	\N	\N
nA9Ad8FM2GS2xCB	oST2Mo0DG4YMmSy	Manager	2024-09-28 10:12:58	\N	\N
FXlQMx3Uv7hEjIK	kvWa62nUUj9dgQB	Manager	2024-09-28 10:13:04	\N	\N
ZHpDQX21ptJkF1j	tDo2rCd81we5pcQ	Manager	2024-09-28 10:14:38	\N	\N
W1sENUt7a0M5r4C	wijxfiATUvMJMh5	Manager	2024-09-28 10:14:43	\N	\N
cyDCsZu4IadjTvW	gisj7qYNyu9I9yH	Manager	2024-09-28 10:31:53	\N	\N
ggEw5WqFrMaG8bo	moY6URp2sgVVfhD	Manager	2024-09-28 10:34:11	\N	\N
JrT4QfxbcPviuTZ	mh0pWGsOpALsytm	Sr. Executive	2024-10-01 17:27:51	\N	\N
skDLWXXRhD46C8y	mh0pWGsOpALsytm	Asst. Manager	2024-09-28 10:07:33	2024-10-01 17:28:00	\N
2LIXP78BBAbqi3m	mh0pWGsOpALsytm	Jr. Executive	2024-10-01 17:28:41	\N	\N
0P1sj5nCHdVdAEy	igD0v9DIJQhQeey	Sr. Manager	2024-10-02 11:52:32	\N	\N
hyJemS4jyK8yzL2	igD0v9DIJQhQeey	Director	2024-10-02 11:52:47	\N	
yIxFQPc3vkCehzo	igD0v9DIJQhQeey	DGM	2024-10-02 11:52:57	\N	\N
geEAvOguYZzRoOd	igD0v9DIJQhQeey	Sr. Business Development Manager	2024-10-02 11:53:15	\N	\N
n9TFZkTW9Juiq6w	igD0v9DIJQhQeey	Manager	2024-10-02 11:53:37	\N	\N
zjQS3pilMz2ehNO	igD0v9DIJQhQeey	Asst. Manager	2024-10-02 11:58:25	\N	\N
Yvr6Hob4Kfp0jxp	igD0v9DIJQhQeey	Asst. Officer	2024-10-02 11:58:38	\N	\N
B6n0KDaKrWcKfZA	igD0v9DIJQhQeey	Executive	2024-10-02 11:59:01	\N	\N
Ud8vxjJENfsiOrJ	igD0v9DIJQhQeey	Jr. Business Development Manager	2024-10-02 11:59:39	\N	\N
GwPgBj518RjTwZv	igD0v9DIJQhQeey	Sr. Executive	2024-10-02 11:59:55	\N	\N
N6DDbhp0dvYooh4	igD0v9DIJQhQeey	Jr. Officer	2024-10-02 12:00:22	\N	\N
m0YInOw9fhosfKf	igD0v9DIJQhQeey	Trainee Officer	2024-10-02 12:00:34	\N	\N
4A2E70Jh3w0XG0C	igD0v9DIJQhQeey	Co-ordinator	2024-10-02 12:01:02	\N	\N
Q0f8ZAFh8RM0wFf	igD0v9DIJQhQeey	AGM	2024-10-02 12:01:12	\N	\N
rIQGt9n7tUAdpw6	igD0v9DIJQhQeey	Head of Business Development	2024-10-02 12:01:33	\N	\N
hXJOLLi7ICjfDnc	igD0v9DIJQhQeey	Business Development Manager	2024-10-02 12:02:03	\N	\N
jHFCgCzD2RmSA4u	igD0v9DIJQhQeey	Delivery Assistant	2024-10-02 12:02:18	\N	\N
emcLahNMDTq2acG	igD0v9DIJQhQeey	Marketing Assistant	2024-10-02 12:02:35	\N	\N
8LywEUpc2Vlj06A	igD0v9DIJQhQeey	Accounts & Delivery	2024-10-02 12:03:00	\N	\N
QEdyDS7FAP6Mumw	igD0v9DIJQhQeey	Office Assistant	2024-10-02 12:03:15	\N	\N
\.


--
-- Data for Name: policy_and_notice; Type: TABLE DATA; Schema: hr; Owner: postgres
--

COPY hr.policy_and_notice (uuid, type, title, sub_title, url, created_at, updated_at, status, remarks, created_by) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: hr; Owner: postgres
--

COPY hr.users (uuid, name, email, pass, designation_uuid, can_access, ext, phone, created_at, updated_at, status, remarks) FROM stdin;
DcGQ6QMjIDlGFAE	Alif	alif@gmail.com	$2b$10$i8Q2RKzTDxO3zjNQbrqKJOqhAjIKKJ6WKz.79TrYwjHBmxXAbgza.	igD0v9DIJQhJeet	{"dashboard":["read"],"order__details":["create","read","update","delete","click_order_number","click_item_description","show_all_orders"],"order__details_by_order_number":["read","update"],"order__details_by_uuid":["read","update","show_price"],"order__entry":["create","read","update","delete"],"order__entry_update":["create","read","update","delete"],"order__info":["create","read","update","delete"],"order__buyer":["create","read","update","delete"],"order__marketing":["create","read","update","delete"],"order__merchandiser":["create","read","update","delete"],"order__factory":["create","read","update","delete"],"order__party":["create","read","update","delete"],"order__properties":["create","read","update","delete"],"lab_dip__rm":["create","read","update","delete","click_name","click_used"],"lab_dip__info":["create","read","update","delete"],"lab_dip__info_entry":["create","read","update","delete"],"lab_dip__info_entry_update":["create","read","update","delete"],"lab_dip__info_details":["read","update"],"lab_dip__recipe":["create","read","update","delete"],"lab_dip__recipe_entry":["create","read","update","delete"],"lab_dip__recipe_entry_update":["create","read","update","delete"],"lab_dip__recipe_details":["create","read","update","delete"],"lab_dip__log":["create","read","update","delete","click_name","click_used","click_update_rm_order","click_delete_rm_order"],"thread__order_info_details":["create","read","update","delete"],"thread__count_length":["create","read","update","delete"],"thread__order_info_entry":["create","read","update","delete"],"thread__order_info_update":["create","read","update","delete"],"thread__order_info_in_details":["create","read","update","delete"],"thread__coning_update":["create","read","update","delete"],"thread__coning_in_details":["create","read","update","delete"],"thread__coning_details":["create","read","update","delete"],"commercial__lc":["create","read","update","delete"],"commercial__lc_details":["create","read","update","delete"],"commercial__lc_entry":["create","read","update","delete"],"commercial__lc_update":["create","read","update","delete"],"commercial__pi":["create","read","update","delete","click_receive_status"],"commercial__pi_details":["create","read","update","delete","click_receive_status"],"commercial__pi_entry":["create","read","update","delete"],"commercial__pi_update":["create","read","update","delete"],"commercial__pi-cash":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_details":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_entry":["create","read","update","delete"],"commercial__pi_cash_update":["create","read","update","delete"],"commercial__bank":["create","read","update","delete"],"delivery__packing_list":["create","read","update","delete","click_receive_status"],"delivery__packing_list_entry":["create","read","update","delete","click_receive_status"],"delivery__packing_list_details":["create","read","update","delete","click_receive_status"],"delivery__packing_list_update":["create","read","update","delete","click_receive_status"],"delivery__challan":["create","read","update","delete","click_receive_status"],"delivery__challan_details":["create","read","update","delete","click_receive_status"],"delivery__challan_entry":["create","read","update","delete"],"delivery__challan_update":["create","read","update","delete"],"delivery__rm":["create","read","used","delete"],"delivery__log":["create","read","update","delete","click_update_rm_order","click_delete_rm_order"],"store__stock":["create","read","update","delete","click_trx_against_order","click_action"],"store__section":["create","read","update","delete"],"store__type":["create","read","update","delete"],"store__vendor":["create","read","update","delete"],"store__receive":["create","read","update"],"store__receive_by_uuid":["create","read","update"],"store__receive_entry":["create","read","update"],"store__receive_update":["create","read","update"],"store__log":["read","update_log","delete_log","update_log_against_order","delete_log_against_order"],"common__tape_rm":["read","click_name","click_used"],"common__tape_sfg":["read","click_production","click_to_coil","click_to_dyeing"],"common__tape_log":["read","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_tape_to_dying","click_delete_tape_to_dying","click_update_tape_production","click_delete_tape_production","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"common__tape_sfg_entry_to_dyeing":["read","create","update","click_production","click_to_dyeing"],"common__coil_rm":["read","click_name","click_used"],"common__coil_sfg":["read","click_production","click_to_dyeing"],"common__coil_sfg_entry_to_dyeing":["read","click_production","click_to_dyeing","create","update"],"common__coil_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_coil_production","click_delete_coil_production","click_update_rm_order","click_delete_rm_order"],"dyeing__dyeing_and_iron_rm":["read","click_name","click_used"],"dyeing__planning":["read"],"dyeing__planning_sno":["create","read","update"],"dyeing__planning_sno_entry":["create","read","update"],"dyeing__planning_sno_entry_update":["create","read","update"],"dyeing__planning_sno_entry_details":["read"],"dyeing__planning_head_office":["create","read","update"],"dyeing__planning_head_office_entry":["create","read","update"],"dyeing__planning_head_office_entry_update":["create","read","update"],"dyeing__planning_head_office_details":["read"],"dyeing__thread_batch":["create","read","update"],"dyeing__thread_batch_entry":["create","read","update"],"dyeing__thread_batch_details":["read"],"dyeing__thread_batch_entry_update":["create","read","update"],"dyeing__dyeing_and_iron_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_production","click_delete_production","click_update_rm_order","click_delete_rm_order"],"nylon__metallic_finishing_rm":["read","click_name","click_used"],"nylon__metallic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__metallic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"nylon__plastic_finishing_rm":["read","click_name","click_used"],"nylon__plastic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__plastic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__teeth_molding_rm":["read","click_name","click_used"],"vislon__teeth_molding_production":["create","read","update","click_production","click_transaction"],"vislon__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__finishing_rm":["read","click_name","click_used"],"vislon__finishing_production":["create","read","update","click_production","click_transaction"],"vislon__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__teeth_molding_rm":["read","click_name","click_used"],"metal__teeth_molding_production":["create","read","update","click_production","click_transaction"],"metal__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"metal__teeth_coloring_rm":["read","click_name","click_used"],"metal__teeth_coloring_production":["create","read","update","click_production","click_transaction"],"metal__teeth_coloring_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__finishing_rm":["read","click_name","click_used"],"metal__finishing_production":["create","read","update","click_production","click_transaction"],"metal__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"slider__dashboard_info":["read","create","update","delete"],"slider__die_casting_rm":["read","click_name","click_used"],"slider__die_casting_production":["read","create","update","delete"],"slider__die_casting_stock":["read","create","update","delete"],"slider__die_casting_transfer":["read","create","update","delete"],"slider__die_casting_transfer_entry":["read","create","update","delete"],"slider__die_casting_transfer_update":["read","create","update","delete"],"slider__die_casting_log":["read","update","delete","click_update_rm_order","click_delete_rm_order"],"slider__die_casting_production_entry":["read","create","update","delete"],"slider__die_casting_production_update":["read","update"],"slider__assembly_production":["read","create","update","delete","click_production","click_transaction"],"slider__assembly_log":["read","create","update","delete"],"slider__coloring_production":["read","create","update","delete","click_production","click_transaction"],"slider__coloring_log":["read","create","update","delete"],"admin__user":["create","read","update","delete","click_status","click_reset_password","click_page_assign"],"admin__user_designation":["create","read","update","delete"],"admin__user_department":["create","read","update","delete"],"library__users":["read"],"library__policy":["create","read","update","delete","click_status"]}	222	01660141086	2024-09-10 13:40:09	2024-09-10 13:40:21	1	test
jk8y1aKmYx2oY3O	Riyad	riyad@fortunezip.com	$2b$10$1UTZuDBmUChtBTIE43Wi0ucXnjBgZ4L7SuDijEBQB6rohEXuMDcTW	PXfqpfiomUQSgCe	{"dashboard":["read"],"order__details":["read","show_all_orders"],"order__details_by_order_number":["read"],"order__details_by_uuid":["read"],"thread__order_info_details":["create"],"thread__order_info_in_details":["read"],"store__stock":["create","read","update","delete","click_trx_against_order","click_action"],"store__section":["create","read","update","delete"],"store__type":["create","read","update","delete"],"store__vendor":["create","read","update","delete"],"store__receive":["create","read","update"],"store__receive_by_uuid":["create","read","update"],"store__receive_entry":["create","read","update"],"store__receive_update":["create","read","update"],"store__log":["read","update_log","delete_log","update_log_against_order","delete_log_against_order"],"common__tape_rm":["read","click_name","click_used"],"common__tape_sfg":["read","click_production","click_to_coil","click_to_dyeing","click_to_dyeing_against_stock","click_to_stock","click_to_transfer","update","delete"],"common__tape_log":["read","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_tape_to_dying","click_delete_tape_to_dying","click_update_tape_production","click_delete_tape_production","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_delete_transfer","click_update_transfer"],"common__tape_required":["read","create","update","delete"],"common__tape_sfg_entry_to_transfer":["read","create","update","click_production","click_to_dyeing"],"common__tape_sfg_entry_to_dyeing":["read","create","update","click_production","click_to_dyeing"],"common__coil_rm":["read","click_name","click_used"],"common__coil_sfg":["read","click_production","click_to_dyeing","click_to_dyeing_against_stock","click_to_stock","click_to_transfer"],"common__coil_sfg_entry_to_dyeing":["read","click_production","click_to_dyeing","create","update"],"common__common_sfg_entry_to_transfer":["read","create","update","click_production","click_to_dyeing"],"common__coil_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_coil_production","click_delete_coil_production","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_rm_order","click_delete_rm_order","click_delete_transfer","click_update_transfer"],"common__dyeing_transfer":["read","create","update","delete"],"common__dyeing_transfer_entry":["read","create","update","delete"],"dyeing__zipper_batch":["read"],"dyeing__zipper_batch_details":["read"],"dyeing__zipper_batch_production":["read"],"dyeing__thread_batch":["read"],"dyeing__thread_batch_details":["read"]}	701	01589132894	2024-09-12 16:06:22	2024-09-28 11:21:14	1	
igD0v9DIJQhJeet	admin	admin@fzl.com	$2b$10$rwiY9thm6UzFMghJROAz/.GPstuOU.76ia8WMqG12Jq/JpMK.fqba	igD0v9DIJQhJeet	{"dashboard":["read"],"order__details":["create","read","update","delete","click_order_number","click_item_description","show_all_orders"],"order__details_by_order_number":["read","update"],"order__details_by_uuid":["read","update","show_price"],"order__entry":["create","read","update","delete"],"order__entry_update":["create","read","update","delete"],"order__info":["create","read","update","delete"],"order__buyer":["create","read","update","delete"],"order__marketing":["create","read","update","delete"],"order__merchandiser":["create","read","update","delete"],"order__factory":["create","read","update","delete"],"order__party":["create","read","update","delete"],"order__properties":["create","read","update","delete"],"lab_dip__rm":["create","read","update","delete","click_name","click_used"],"lab_dip__info":["create","read","update","delete"],"lab_dip__info_entry":["create","read","update","delete"],"lab_dip__info_entry_update":["create","read","update","delete"],"lab_dip__info_details":["read","update"],"lab_dip__recipe":["create","read","update","delete"],"lab_dip__recipe_entry":["create","read","update","delete"],"lab_dip__recipe_entry_update":["create","read","update","delete"],"lab_dip__recipe_details":["create","read","update","delete"],"lab_dip__zipper_swatch":["read","update"],"lab_dip__thread_swatch":["read","update"],"lab_dip__log":["create","read","update","delete","click_name","click_used","click_update_rm_order","click_delete_rm_order"],"thread__order_info_details":["create","read","update","delete"],"thread__count_length":["create","read","update","delete"],"thread__order_info_entry":["create","read","update","delete"],"thread__order_info_update":["create","read","update","delete"],"thread__order_info_in_details":["create","read","update","delete"],"thread__coning_update":["create","read","update","delete"],"thread__coning_in_details":["create","read","update","delete"],"thread__coning_details":["create","read","update","delete","click_production","click_transaction"],"thread__log":["create","read","update","delete"],"commercial__lc":["create","read","update","delete"],"commercial__lc_details":["create","read","update","delete"],"commercial__lc_entry":["create","read","update","delete"],"commercial__lc_update":["create","read","update","delete"],"commercial__pi":["create","read","update","delete","click_receive_status"],"commercial__pi_details":["create","read","update","delete","click_receive_status"],"commercial__pi_entry":["create","read","update","delete"],"commercial__pi_update":["create","read","update","delete"],"commercial__pi-cash":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_details":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_entry":["create","read","update","delete"],"commercial__pi_cash_update":["create","read","update","delete"],"commercial__bank":["create","read","update","delete"],"delivery__packing_list":["create","read","update","delete","click_receive_status"],"delivery__packing_list_entry":["create","read","update","delete","click_receive_status"],"delivery__packing_list_details":["create","read","update","delete","click_receive_status"],"delivery__packing_list_update":["create","read","update","delete","click_receive_status"],"delivery__challan":["create","read","update","delete","click_receive_status"],"delivery__challan_details":["create","read","update","delete","click_receive_status"],"delivery__challan_entry":["create","read","update","delete"],"delivery__challan_update":["create","read","update","delete"],"delivery__rm":["create","read","used","delete"],"delivery__log":["create","read","update","delete","click_update_rm_order","click_delete_rm_order"],"store__stock":["create","read","update","delete","click_trx_against_order","click_action"],"store__section":["create","read","update","delete"],"store__type":["create","read","update","delete"],"store__vendor":["create","read","update","delete"],"store__receive":["create","read","update"],"store__receive_by_uuid":["create","read","update"],"store__receive_entry":["create","read","update"],"store__receive_update":["create","read","update"],"store__log":["read","update_log","delete_log","update_log_against_order","delete_log_against_order"],"common__tape_rm":["read","click_name","click_used"],"common__tape_sfg":["read","click_production","click_to_coil","click_to_dyeing","click_to_dyeing_against_stock","click_to_stock","click_to_transfer","update","delete"],"common__tape_log":["read","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_tape_to_dying","click_delete_tape_to_dying","click_update_tape_production","click_delete_tape_production","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_delete_transfer","click_update_transfer"],"common__tape_required":["read","create","update","delete"],"common__tape_sfg_entry_to_transfer":["read","create","update","click_production","click_to_dyeing"],"common__tape_sfg_entry_to_dyeing":["read","create","update","click_production","click_to_dyeing"],"common__coil_rm":["read","click_name","click_used"],"common__coil_sfg":["read","click_production","click_to_dyeing","click_to_dyeing_against_stock","click_to_stock","click_to_transfer"],"common__coil_sfg_entry_to_dyeing":["read","click_production","click_to_dyeing","create","update"],"common__common_sfg_entry_to_transfer":["read","create","update","click_production","click_to_dyeing"],"common__coil_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_coil_production","click_delete_coil_production","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_rm_order","click_delete_rm_order","click_delete_transfer","click_update_transfer"],"common__dyeing_transfer":["read","create","update","delete"],"common__dyeing_transfer_entry":["read","create","update","delete"],"dyeing__dyeing_and_iron_rm":["read","click_name","click_used"],"dyeing__zipper_batch":["create","read","update"],"dyeing__zipper_batch_entry":["create","read","update"],"dyeing__zipper_batch_entry_update":["create","read","update"],"dyeing__zipper_batch_details":["read"],"dyeing__zipper_batch_production":["create","read","update"],"dyeing__thread_batch":["create","read","update"],"dyeing__thread_batch_entry":["create","read","update"],"dyeing__thread_batch_details":["read"],"dyeing__thread_batch_entry_update":["create","read","update"],"dyeing__thread_batch_conneing":["create","read","update"],"dyeing__machine":["create","read","update","delete"],"dyeing__dyes_category":["create","read","update","delete"],"dyeing__programs":["create","read","update","delete"],"dyeing__dyeing_and_iron_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_production","click_delete_production","click_update_rm_order","click_delete_rm_order"],"nylon__metallic_finishing_rm":["read","click_name","click_used"],"nylon__metallic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__metallic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"nylon__plastic_finishing_rm":["read","click_name","click_used"],"nylon__plastic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__plastic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__teeth_molding_rm":["read","click_name","click_used"],"vislon__teeth_molding_production":["create","read","update","click_production","click_transaction"],"vislon__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__finishing_rm":["read","click_name","click_used"],"vislon__finishing_production":["create","read","update","click_production","click_transaction"],"vislon__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__teeth_molding_rm":["read","click_name","click_used"],"metal__teeth_molding_production":["create","read","update","click_production","click_transaction"],"metal__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"metal__teeth_coloring_rm":["read","click_name","click_used"],"metal__teeth_coloring_production":["create","read","update","click_production","click_transaction"],"metal__teeth_coloring_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__finishing_rm":["read","click_name","click_used"],"metal__finishing_production":["create","read","update","click_production","click_transaction"],"metal__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"slider__dashboard_info":["read","create","update","delete"],"slider__die_casting_rm":["read","click_name","click_used"],"slider__die_casting_production":["read","create","update","delete"],"slider__die_casting_stock":["read","create","update","delete"],"slider__die_casting_transfer":["read","create","update","delete"],"slider__die_casting_transfer_entry":["read","create","update","delete"],"slider__die_casting_transfer_update":["read","create","update","delete"],"slider__die_casting_log":["read","update","delete","click_update_rm_order","click_delete_rm_order","click_update_rm","click_delete_rm"],"slider__die_casting_production_entry":["read","create","update","delete"],"slider__die_casting_production_update":["read","update"],"slider__assembly_rm":["read","create","update","delete","click_used"],"slider__assembly_stock":["read","create","update","delete"],"slider__assembly_production":["read","create","update","delete","click_production","click_transaction"],"slider__assembly_log":["read","create","update","delete","click_update_rm","click_delete_rm"],"slider__coloring_rm":["read","create","update","delete","click_used"],"slider__coloring_production":["read","create","update","delete","click_production","click_transaction"],"slider__coloring_log":["read","create","update","delete","click_update_rm","click_delete_rm"],"admin__user":["create","read","update","delete","click_status","click_reset_password","click_page_assign"],"admin__user_designation":["create","read","update","delete"],"admin__user_department":["create","read","update","delete"],"library__users":["read"],"library__policy":["create","read","update","delete","click_status"]}	123	123456578	2023-10-15 12:05:23	2023-10-15 12:05:23	1	\N
Kzha6MUjxDGgKfs	Shafayat	shafayat1777@gmail.com	$2b$10$teuyb8U/MuGvxtuQmvHV7eWe10Y/JkZtn/pazIiEa.xX2LqDlP0H.	igD0v9DIJQhJeet	{"dashboard":["read"],"order__details":["create","read","update","delete","click_order_number","click_item_description","show_all_orders"],"order__details_by_order_number":["read","update"],"order__details_by_uuid":["read","update","show_price"],"order__entry":["create","read","update","delete"],"order__entry_update":["create","read","update","delete"],"order__info":["create","read","update","delete"],"order__buyer":["create","read","update","delete"],"order__marketing":["create","read","update","delete"],"order__merchandiser":["create","read","update","delete"],"order__factory":["create","read","update","delete"],"order__party":["create","read","update","delete"],"order__properties":["create","read","update","delete"],"lab_dip__rm":["create","read","update","delete","click_name","click_used"],"lab_dip__info":["create","read","update","delete"],"lab_dip__info_entry":["create","read","update","delete"],"lab_dip__info_entry_update":["create","read","update","delete"],"lab_dip__info_details":["read","update"],"lab_dip__recipe":["create","read","update","delete"],"lab_dip__recipe_entry":["create","read","update","delete"],"lab_dip__recipe_entry_update":["create","read","update","delete"],"lab_dip__recipe_details":["create","read","update","delete"],"lab_dip__zipper_swatch":["read","update"],"lab_dip__thread_swatch":["read","update"],"lab_dip__log":["create","read","update","delete","click_name","click_used","click_update_rm_order","click_delete_rm_order"],"thread__order_info_details":["create","read","update","delete"],"thread__count_length":["create","read","update","delete"],"thread__order_info_entry":["create","read","update","delete"],"thread__order_info_update":["create","read","update","delete"],"thread__order_info_in_details":["create","read","update","delete"],"thread__coning_update":["create","read","update","delete"],"thread__coning_in_details":["create","read","update","delete"],"thread__coning_details":["create","read","update","delete","click_production","click_transaction"],"thread__log":["create","read","update","delete"],"thread__challan":["create","read","update","delete"],"thread__challan_details":["create","read","update","delete"],"thread__challan_entry":["create","read","update","delete"],"commercial__lc":["create","read","update","delete"],"commercial__lc_details":["create","read","update","delete"],"commercial__lc_entry":["create","read","update","delete"],"commercial__lc_update":["create","read","update","delete"],"commercial__pi":["create","read","update","delete","click_receive_status"],"commercial__pi_details":["create","read","update","delete","click_receive_status"],"commercial__pi_entry":["create","read","update","delete"],"commercial__pi_update":["create","read","update","delete"],"commercial__bank":["create","read","update","delete"],"delivery__packing_list":["create","read","update","delete","click_receive_status"],"delivery__packing_list_entry":["create","read","update","delete","click_receive_status"],"delivery__packing_list_details":["create","read","update","delete","click_receive_status"],"delivery__packing_list_update":["create","read","update","delete","click_receive_status"],"delivery__challan":["create","read","update","delete","click_receive_status"],"delivery__challan_details":["create","read","update","delete","click_receive_status"],"delivery__challan_entry":["create","read","update","delete"],"delivery__challan_update":["create","read","update","delete"],"delivery__rm":["create","read","used","delete"],"delivery__log":["create","read","update","delete","click_update_rm_order","click_delete_rm_order"],"store__stock":["create","read","update","delete","click_trx_against_order","click_action"],"store__section":["create","read","update","delete"],"store__type":["create","read","update","delete"],"store__vendor":["create","read","update","delete"],"store__receive":["create","read","update"],"store__receive_by_uuid":["create","read","update"],"store__receive_entry":["create","read","update"],"store__receive_update":["create","read","update"],"store__log":["read","update_log","delete_log","update_log_against_order","delete_log_against_order"],"common__tape_rm":["read","click_name","click_used"],"common__tape_sfg":["read","click_production","click_to_coil","click_to_dyeing","update","delete"],"common__tape_log":["read","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_tape_to_dying","click_delete_tape_to_dying","click_update_tape_production","click_delete_tape_production","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"common__tape_required":["read","create","update","delete"],"common__tape_sfg_entry_to_dyeing":["read","create","update","click_production","click_to_dyeing"],"common__coil_rm":["read","click_name","click_used"],"common__coil_sfg":["read","click_production","click_to_dyeing"],"common__coil_sfg_entry_to_dyeing":["read","click_production","click_to_dyeing","create","update"],"common__coil_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_coil_production","click_delete_coil_production","click_update_rm_order","click_delete_rm_order"],"common__dyeing_transfer":["read","create","update","delete"],"common__dyeing_transfer_entry":["read","create","update","delete"],"dyeing__dyeing_and_iron_rm":["read","click_name","click_used"],"dyeing__planning":["read"],"dyeing__planning_sno":["create","read","update"],"dyeing__planning_sno_entry":["create","read","update"],"dyeing__planning_sno_entry_update":["create","read","update"],"dyeing__planning_sno_entry_details":["read"],"dyeing__planning_head_office":["create","read","update"],"dyeing__planning_head_office_entry":["create","read","update"],"dyeing__planning_head_office_entry_update":["create","read","update"],"dyeing__planning_head_office_details":["read"],"dyeing__zipper_batch":["create","read","update"],"dyeing__zipper_batch_entry":["create","read","update"],"dyeing__zipper_batch_entry_update":["create","read","update"],"dyeing__zipper_batch_details":["read"],"dyeing__zipper_batch_production":["create","read","update"],"dyeing__thread_batch":["create","read","update"],"dyeing__thread_batch_entry":["create","read","update"],"dyeing__thread_batch_details":["read"],"dyeing__thread_batch_entry_update":["create","read","update"],"dyeing__thread_batch_conneing":["create","read","update"],"dyeing__machine":["create","read","update","delete"],"dyeing__dyeing_and_iron_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_production","click_delete_production","click_update_rm_order","click_delete_rm_order"],"nylon__metallic_finishing_rm":["read","click_name","click_used"],"nylon__metallic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__metallic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"nylon__plastic_finishing_rm":["read","click_name","click_used"],"nylon__plastic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__plastic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__teeth_molding_rm":["read","click_name","click_used"],"vislon__teeth_molding_production":["create","read","update","click_production","click_transaction"],"vislon__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__finishing_rm":["read","click_name","click_used"],"vislon__finishing_production":["create","read","update","click_production","click_transaction"],"vislon__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__teeth_molding_rm":["read","click_name","click_used"],"metal__teeth_molding_production":["create","read","update","click_production","click_transaction"],"metal__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"metal__teeth_coloring_rm":["read","click_name","click_used"],"metal__teeth_coloring_production":["create","read","update","click_production","click_transaction"],"metal__teeth_coloring_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__finishing_rm":["read","click_name","click_used"],"metal__finishing_production":["create","read","update","click_production","click_transaction"],"metal__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"slider__dashboard_info":["read","create","update","delete"],"slider__die_casting_rm":["read","click_name","click_used"],"slider__die_casting_production":["read","create","update","delete"],"slider__die_casting_stock":["read","create","update","delete"],"slider__die_casting_transfer":["read","create","update","delete"],"slider__die_casting_transfer_entry":["read","create","update","delete"],"slider__die_casting_transfer_update":["read","create","update","delete"],"slider__die_casting_log":["read","update","delete","click_update_rm_order","click_delete_rm_order"],"slider__die_casting_production_entry":["read","create","update","delete"],"slider__die_casting_production_update":["read","update"],"slider__assembly_rm":["read","create","update","delete"],"slider__assembly_stock":["read","create","update","delete"],"slider__assembly_production":["read","create","update","delete","click_production","click_transaction"],"slider__assembly_log":["read","create","update","delete"],"slider__coloring_rm":["read","create","update","delete"],"slider__coloring_production":["read","create","update","delete","click_production","click_transaction"],"slider__coloring_log":["read","create","update","delete"],"admin__user":["create","read","update","delete","click_status","click_reset_password","click_page_assign"],"admin__user_designation":["create","read","update","delete"],"admin__user_department":["create","read","update","delete"],"library__users":["read"],"library__policy":["create","read","update","delete","click_status"]}		12345678910	2024-09-10 19:11:13	2024-09-12 12:47:07	1	
IMPhbfmV3GUYSpi	SNO	sno@fortunezip.com	$2b$10$.H4ySJ/5RmLmX2JbczHnMuiDD2Cgz90t2dGohG3/NMLQmBMLbDDJu	skDLWXXRhD46C8y	{"dashboard":["read"],"order__details":["create","read","update","delete","click_order_number","click_item_description","show_all_orders"],"order__details_by_order_number":["read","update"],"order__details_by_uuid":["read","update","show_price"],"order__entry":["create","read","update","delete"],"order__entry_update":["create","read","update","delete"],"order__info":["create","read","update","delete"],"order__buyer":["create","read","update","delete"],"order__marketing":["create","read","update","delete"],"order__merchandiser":["create","read","update","delete"],"order__factory":["create","read","update","delete"],"order__party":["create","read","update","delete"],"order__properties":["create","read","update","delete"],"thread__order_info_details":["create","read","update","delete"],"thread__count_length":["create","read","update","delete"],"thread__order_info_entry":["create","read","update","delete"],"thread__order_info_update":["create","read","update","delete"],"thread__order_info_in_details":["create","read","update","delete"],"commercial__lc":["create","read","update","delete"],"commercial__lc_details":["create","read","update","delete"],"commercial__lc_entry":["create","read","update","delete"],"commercial__lc_update":["create","read","update","delete"],"commercial__pi":["create","read","update","delete","click_receive_status"],"commercial__pi_details":["create","read","update","delete","click_receive_status"],"commercial__pi_entry":["create","read","update","delete"],"commercial__pi_update":["create","read","update","delete"],"commercial__bank":["create","read","update","delete"],"library__users":["read"],"library__policy":["read"]}		01771199541	2024-09-28 10:27:51	2024-09-28 11:01:26	1	
RL1xtJnYkxGrTMz	Mirsad	mirsad@fzl.com	$2b$10$d5g94Yk8ctpji4vV7HNMnu6sUZQsFRyrjzlGvCj5Aq3TelTqEfJ/i	0veAgtyvIwm7w4q	{"dashboard":["read"],"order__details":["create","read","update","delete","click_order_number","click_item_description","show_all_orders"],"order__details_by_order_number":["read","update"],"order__details_by_uuid":["read","update","show_price"],"order__entry":["create","read","update","delete"],"order__entry_update":["create","read","update","delete"],"order__info":["create","read","update","delete"],"order__buyer":["create","read","update","delete"],"order__marketing":["create","read","update","delete"],"order__merchandiser":["create","read","update","delete"],"order__factory":["create","read","update","delete"],"order__party":["create","read","update","delete"],"order__properties":["create","read","update","delete"],"lab_dip__rm":["create","read","update","delete","click_name","click_used"],"lab_dip__info":["create","read","update","delete"],"lab_dip__info_entry":["create","read","update","delete"],"lab_dip__info_entry_update":["create","read","update","delete"],"lab_dip__info_details":["read","update"],"lab_dip__recipe":["create","read","update","delete"],"lab_dip__recipe_entry":["create","read","update","delete"],"lab_dip__recipe_entry_update":["create","read","update","delete"],"lab_dip__recipe_details":["create","read","update","delete"],"lab_dip__zipper_swatch":["read","update"],"lab_dip__thread_swatch":["read","update"],"lab_dip__log":["create","read","update","delete","click_name","click_used","click_update_rm_order","click_delete_rm_order"],"thread__order_info_details":["create","read","update","delete"],"thread__count_length":["create","read","update","delete"],"thread__order_info_entry":["create","read","update","delete"],"thread__order_info_update":["create","read","update","delete"],"thread__order_info_in_details":["create","read","update","delete"],"thread__coning_update":["create","read","update","delete"],"thread__coning_in_details":["create","read","update","delete"],"thread__coning_details":["create","read","update","delete"],"commercial__lc":["create","read","update","delete"],"commercial__lc_details":["create","read","update","delete"],"commercial__lc_entry":["create","read","update","delete"],"commercial__lc_update":["create","read","update","delete"],"commercial__pi":["create","read","update","delete","click_receive_status"],"commercial__pi_details":["create","read","update","delete","click_receive_status"],"commercial__pi_entry":["create","read","update","delete"],"commercial__pi_update":["create","read","update","delete"],"commercial__pi-cash":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_details":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_entry":["create","read","update","delete"],"commercial__pi_cash_update":["create","read","update","delete"],"commercial__bank":["create","read","update","delete"],"delivery__packing_list":["create","read","update","delete","click_receive_status"],"delivery__packing_list_entry":["create","read","update","delete","click_receive_status"],"delivery__packing_list_details":["create","read","update","delete","click_receive_status"],"delivery__packing_list_update":["create","read","update","delete","click_receive_status"],"delivery__challan":["create","read","update","delete","click_receive_status"],"delivery__challan_details":["create","read","update","delete","click_receive_status"],"delivery__challan_entry":["create","read","update","delete"],"delivery__challan_update":["create","read","update","delete"],"delivery__rm":["create","read","used","delete"],"delivery__log":["create","read","update","delete","click_update_rm_order","click_delete_rm_order"],"store__stock":["create","read","update","delete","click_trx_against_order","click_action"],"store__section":["create","read","update","delete"],"store__type":["create","read","update","delete"],"store__vendor":["create","read","update","delete"],"store__receive":["create","read","update"],"store__receive_by_uuid":["create","read","update"],"store__receive_entry":["create","read","update"],"store__receive_update":["create","read","update"],"store__log":["read","update_log","delete_log","update_log_against_order","delete_log_against_order"],"common__tape_rm":["read","click_name","click_used"],"common__tape_sfg":["read","click_production","click_to_coil","click_to_dyeing","click_to_dyeing_against_stock","click_to_stock","click_to_transfer","update","delete"],"common__tape_log":["read","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_tape_to_dying","click_delete_tape_to_dying","click_update_tape_production","click_delete_tape_production","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_delete_transfer","click_update_transfer"],"common__tape_required":["read","create","update","delete"],"common__tape_sfg_entry_to_transfer":["read","create","update","click_production","click_to_dyeing"],"common__tape_sfg_entry_to_dyeing":["read","create","update","click_production","click_to_dyeing"],"common__coil_rm":["read","click_name","click_used"],"common__coil_sfg":["read","click_production","click_to_dyeing","click_to_dyeing_against_stock","click_to_stock","click_to_transfer"],"common__coil_sfg_entry_to_dyeing":["read","click_production","click_to_dyeing","create","update"],"common__common_sfg_entry_to_transfer":["read","create","update","click_production","click_to_dyeing"],"common__coil_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_coil_production","click_delete_coil_production","click_update_tape_to_coil","click_delete_tape_to_coil","click_update_rm_order","click_delete_rm_order","click_delete_transfer","click_update_transfer"],"common__dyeing_transfer":["read","create","update","delete"],"common__dyeing_transfer_entry":["read","create","update","delete"],"dyeing__dyeing_and_iron_rm":["read","click_name","click_used"],"dyeing__zipper_batch":["create","read","update"],"dyeing__zipper_batch_entry":["create","read","update"],"dyeing__zipper_batch_entry_update":["create","read","update"],"dyeing__zipper_batch_details":["read"],"dyeing__zipper_batch_production":["create","read","update"],"dyeing__thread_batch":["create","read","update"],"dyeing__thread_batch_entry":["create","read","update"],"dyeing__thread_batch_details":["read"],"dyeing__thread_batch_entry_update":["create","read","update"],"dyeing__thread_batch_conneing":["create","read","update"],"dyeing__machine":["create","read","update","delete"],"dyeing__dyes_category":["create","read","update","delete"],"dyeing__programs":["create","read","update","delete"],"dyeing__dyeing_and_iron_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_production","click_delete_production","click_update_rm_order","click_delete_rm_order"],"nylon__metallic_finishing_rm":["read","click_name","click_used"],"nylon__metallic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__metallic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"nylon__plastic_finishing_rm":["read","click_name","click_used"],"nylon__plastic_finishing_production":["create","read","update","click_production","click_transaction"],"nylon__plastic_finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__teeth_molding_rm":["read","click_name","click_used"],"vislon__teeth_molding_production":["create","read","update","click_production","click_transaction"],"vislon__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"vislon__finishing_rm":["read","click_name","click_used"],"vislon__finishing_production":["create","read","update","click_production","click_transaction"],"vislon__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__teeth_molding_rm":["read","click_name","click_used"],"metal__teeth_molding_production":["create","read","update","click_production","click_transaction"],"metal__teeth_molding_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order","click_update_tape","click_delete_tape"],"metal__teeth_coloring_rm":["read","click_name","click_used"],"metal__teeth_coloring_production":["create","read","update","click_production","click_transaction"],"metal__teeth_coloring_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"metal__finishing_rm":["read","click_name","click_used"],"metal__finishing_production":["create","read","update","click_production","click_transaction"],"metal__finishing_log":["read","click_update_sfg","click_delete_sfg","click_update_rm","click_delete_rm","click_update_rm_order","click_delete_rm_order"],"slider__dashboard_info":["read","create","update","delete"],"slider__die_casting_rm":["read","click_name","click_used"],"slider__die_casting_production":["read","create","update","delete"],"slider__die_casting_stock":["read","create","update","delete"],"slider__die_casting_transfer":["read","create","update","delete"],"slider__die_casting_transfer_entry":["read","create","update","delete"],"slider__die_casting_transfer_update":["read","create","update","delete"],"slider__die_casting_log":["read","update","delete","click_update_rm_order","click_delete_rm_order","click_update_rm","click_delete_rm"],"slider__die_casting_production_entry":["read","create","update","delete"],"slider__die_casting_production_update":["read","update"],"slider__assembly_rm":["read","create","update","delete","click_used"],"slider__assembly_stock":["read","create","update","delete"],"slider__assembly_production":["read","create","update","delete","click_production","click_transaction"],"slider__assembly_log":["read","create","update","delete","click_update_rm","click_delete_rm"],"slider__coloring_rm":["read","create","update","delete","click_used"],"slider__coloring_production":["read","create","update","delete","click_production","click_transaction"],"slider__coloring_log":["read","create","update","delete","click_update_rm","click_delete_rm"],"admin__user":["create","read","update","delete","click_status","click_reset_password","click_page_assign"],"admin__user_designation":["create","read","update","delete"],"admin__user_department":["create","read","update","delete"],"library__users":["read"],"library__policy":["create","read","update","delete","click_status"]}		01080990090	2024-09-10 19:11:10	2024-09-11 00:03:45	1	
qF8TiD9fKSYSQvA	Pranto	pranto@fortunezip.com	$2b$10$5kcCEcAKuquHgEpFR4.66OYRiGuYwQWY/CVOfrmWXLwiMdtKAG4/m	skDLWXXRhD46C8y	\N		01521430766	2024-10-01 17:30:47	2024-10-01 17:30:52	1	
DsiBgYUwNgI9w5o	Rabbi Sheikh	rabbi@fortunezip.com	$2b$10$61C.h9hOx9qRTHsVSJjhouboQKkvgGYPZjbEC2HtOUHjgK1vBZzou	B6n0KDaKrWcKfZA	\N		01771199541	2024-10-02 12:24:58	\N	0	
7CpI2OXocdQ2T9Q	Shanto	shanto@fortunezip.com	$2b$10$kM2bH3X3WvqTngyIsTcGjOA3tWCdvVbQpGwBbIMKzydnHh4HSkLUC	JrT4QfxbcPviuTZ	{"dashboard":["read"],"order__details":["create","read","update","delete","click_order_number","click_item_description","show_all_orders"],"order__details_by_order_number":["read","update"],"order__details_by_uuid":["read","update","show_price"],"order__entry":["create","read","update","delete"],"order__entry_update":["create","read","update","delete"],"order__info":["create","read","update","delete"],"order__buyer":["create","read","update","delete"],"order__marketing":["create","read","update","delete"],"order__merchandiser":["create","read","update","delete"],"order__factory":["create","read","update","delete"],"order__party":["create","read","update","delete"],"order__properties":["create","read","update","delete"],"thread__order_info_details":["create","read","update","delete"],"thread__count_length":["create","read","update","delete"],"thread__order_info_entry":["create","read","update","delete"],"thread__order_info_update":["create","read","update","delete"],"thread__order_info_in_details":["create","read","update","delete"],"thread__coning_update":["create","read","update","delete"],"thread__coning_in_details":["create","read","update","delete"],"thread__coning_details":["create","read","update","delete","click_production","click_transaction"],"commercial__lc":["create","read","update","delete"],"commercial__lc_details":["create","read","update","delete"],"commercial__lc_entry":["create","read","update","delete"],"commercial__lc_update":["create","read","update","delete"],"commercial__pi":["create","read","update","delete","click_receive_status"],"commercial__pi_details":["create","read","update","delete","click_receive_status"],"commercial__pi_entry":["create","read","update","delete"],"commercial__pi_update":["create","read","update","delete"],"commercial__pi-cash":["create","read","update","delete","click_receive_status"],"commercial__pi_cash_entry":["create","read","update","delete"],"commercial__pi_cash_update":["create","read","update","delete"],"commercial__bank":["create","read","update","delete"],"library__users":["read"],"library__policy":["read"]}		01317492178	2024-10-01 17:32:27	2024-10-01 17:32:29	1	
hfpNR5fh8ZOhEP2	Farhana	farhana@fortunezip.com	$2b$10$Qrg1/46rJQUWLSDFck7dduEYAR3jT8EJlUlPCULtEnprB.ufbPAYa	JrT4QfxbcPviuTZ	\N		01551031067	2024-10-02 11:29:09	2024-10-02 11:29:13	1	
gvJJYFEowkvi7Vz	Tamanna	tamanna@fortunezip.com	$2b$10$TbfDDHgvLJ0wcSOlB4VoK.cbJIfCSBvO3MQb3GqpwxcQz51IYlVWC	JrT4QfxbcPviuTZ	\N		01779554341	2024-10-02 11:30:20	2024-10-02 11:30:23	1	
GAOgluHl4k07Zj1	Nipa	nipa@fortunezip.com	$2b$10$mgPsYlkYeAzf/KZIPRMxE.u7PLD5m3Gb5ggbfy1OseTLdTg4rChru	2LIXP78BBAbqi3m	\N		01771199541	2024-10-02 11:41:59	2024-10-02 11:42:11	1	
Fumdes3KgrdftPc	Md Tawhidul Islam	tawhidulislam@fortunezip.com	$2b$10$PKlRlYDJbmXl6.8OajKYS.CHcA8RpbEN8w8jm4dGqLYKqJkPhuQci	0P1sj5nCHdVdAEy	\N		01771199541	2024-10-02 12:25:54	\N	0	
rOKV2OENRmtpaTw	Ahmed Habib Chowdhury	habib@fortunezip.com	$2b$10$KBk8jc59X/dhUSJUJGEjluVpIEgbNHi7kSlLTIj4At9xWhCuCgetu	hyJemS4jyK8yzL2	\N		01771199541	2024-10-02 12:07:46	\N	0	
7wknowYIruZcAaL	Md. Shafiul Azam Chowdhury	azam@fortunezip.com	$2b$10$OIoByDAqXTNrF8MFn0IjzuugN7RNtia3Y9pFnzJnzj9.0eQNJN8cu	0P1sj5nCHdVdAEy	\N		01771199541	2024-10-02 12:07:02	2024-10-02 12:07:50	0	
WIFaGq6lPSpYSil	Md. Al-amin	alamin@fortunezip.com	$2b$10$HdnwRTfoFQLQ/PxFvDn7Re0pZDiZ7pPJjbpy6P5Zk6YtWxJG8TEtC	yIxFQPc3vkCehzo	\N		01771199541	2024-10-02 12:14:37	\N	0	
OTKNhqASD3at8Vg	SK Abir Kamal	abir@fortunezip.com	$2b$10$/XS8DGUBK9FsLjnuZnAn6O2fGFG5zJS1xCve3uR.5/6WpgmVuwZbu	geEAvOguYZzRoOd	\N		01771199541	2024-10-02 12:17:35	\N	0	
m6bgXQOz7U35GBO	Shakhawat Hossaion	faruk@fortunezip.com	$2b$10$.RVdsooKapawkwy0MbuMne5R6/GpeJPEaWl8sqQZxNQQ4ns1zZ6xG	0P1sj5nCHdVdAEy	\N		01771199541	2024-10-02 12:18:34	\N	0	
SF4tdXBgahf4rRS	Md. Shahabuddin Mina	sabu@fortunezip.com	$2b$10$BrJeRPtCOC4DS2T1nz8xHebU86v0b0ibrRby268A3jBlz4oLV5pzW	n9TFZkTW9Juiq6w	\N		01771199541	2024-10-02 12:19:43	\N	0	
6YUHqPQn4Hz407d	Swapon Kumar Biswas	swapon@fortunezip.com	$2b$10$zJZvA1BmIna427Uw/a164u88H/y9yfQNMWcB2r8WYx6.TeSF6UEPK	n9TFZkTW9Juiq6w	\N		01771199541	2024-10-02 12:20:47	\N	0	
w9RQUADr5NxpiCC	Md. Joynal Abedin	joynal@fortunezip.com	$2b$10$zM5sl0ZwIPxoVw1aKNjtt.Vwd4Ugcm.zMQd.byUaCFmRmM5pSp8Ue	n9TFZkTW9Juiq6w	\N		01771199541	2024-10-02 12:22:02	\N	0	
SiT2d8ZJa24na4U	Hamiduzzaman Pappu	hamid@fortunezip.com	$2b$10$PydPrSc8lj0UasV4GCQCyOKwgF4.BRkCirOSkgAIJjqN4Psp9F1lW	0P1sj5nCHdVdAEy	\N		01771199541	2024-10-02 12:22:57	\N	0	
bOusoTe0SGNpj0c	Md. Rajib Sarker Rana	rana@fortunezip.com	$2b$10$TBRk59OyUI72SLOnzrHcYORVx7PZ1gx9/0DupKF.JfA4A1dFulnpq	zjQS3pilMz2ehNO	\N		01771199541	2024-10-02 12:23:33	\N	0	
NQQ5QwIO7wWmUHP	Md. Almas Hossain	almas@fortunezip.com	$2b$10$v7ieyr4JelOMnp781kikI.fGJsZ5nk6H7/cZhIvtsHXt04.94MCq2	Ud8vxjJENfsiOrJ	\N		01771199541	2024-10-02 12:27:21	\N	0	
BJAABmnRp7APLNQ	Mohammed Alauddin	alauddin@fortunezip.com	$2b$10$p4.QrY1dKrVC0Yj/hy4iAeygRzqGgIeKOXhOCbxynEB9Lp8nKpILi	0P1sj5nCHdVdAEy	\N		01771199541	2024-10-02 12:28:07	\N	0	
sNBJLzwDmZTkJEy	Bin Amin	binamin@fortunezip.com	$2b$10$.hniR/PNZXtf7BDAZm8tR.KzzCLbJdT3N2tYkyPVGL8WRrjS4MR0O	N6DDbhp0dvYooh4	\N		01771199541	2024-10-02 12:29:48	\N	0	
ByyuchRoOr2eHiC	Md. Bodiuzzaman	zaman@fortunezip.com	$2b$10$R1NsYGjQPBwpp2GJyoWm8OtVgaGZ..aq2b8pTOS0U5IbXJJ.mh7Pq	zjQS3pilMz2ehNO	\N		01771199541	2024-10-02 12:24:14	2024-10-02 12:30:11	0	
Sq83R22RRcOIdPY	Anayet ullah	anayet@fortunezip.com	$2b$10$56nchKn7R2.xEqKoYXpYXOwacu4GQ9mHRrn2vQFC0QudeBmy.uOHi	N6DDbhp0dvYooh4	\N		01771199541	2024-10-02 12:30:56	\N	0	
VAQ2tJcT4ru5EQT	Asha Rani Dey	tuly@fortunezip.com	$2b$10$iM9rlRpsjhM1ZvZnlTN.3eBq082V8ynL7w7OgghKKA6xBWLePRk12	Ud8vxjJENfsiOrJ	\N		01771199541	2024-10-02 12:32:01	\N	0	
IS29ZF9XBkcN52f	Taimum Islam	taimum@fortunezip.com	$2b$10$nhPxkkSV4fdwvI6.m9SiR.RcaKgRotHe/7Bx1J0DzeSvowjnO.JDS	Ud8vxjJENfsiOrJ	\N		01771199541	2024-10-02 12:33:20	\N	0	
cTxxDpu72UZP0IG	Sumya Akhter	sumya@fortunezip.com	$2b$10$zDjiGFQ8N1Qpp.sfg6m83e9o9zJhD3t6U/wQR/Qpuf8DLdlDY2oA.	4A2E70Jh3w0XG0C	\N		01771199541	2024-10-02 12:35:26	\N	0	
\.


--
-- Data for Name: info; Type: TABLE DATA; Schema: lab_dip; Owner: postgres
--

COPY lab_dip.info (uuid, id, name, order_info_uuid, created_by, created_at, updated_at, remarks, lab_status, thread_order_info_uuid) FROM stdin;
\.


--
-- Data for Name: recipe; Type: TABLE DATA; Schema: lab_dip; Owner: postgres
--

COPY lab_dip.recipe (uuid, id, lab_dip_info_uuid, name, approved, created_by, status, created_at, updated_at, remarks, sub_streat, bleaching) FROM stdin;
\.


--
-- Data for Name: recipe_entry; Type: TABLE DATA; Schema: lab_dip; Owner: postgres
--

COPY lab_dip.recipe_entry (uuid, recipe_uuid, color, quantity, created_at, updated_at, remarks, material_uuid) FROM stdin;
\.


--
-- Data for Name: shade_recipe; Type: TABLE DATA; Schema: lab_dip; Owner: postgres
--

COPY lab_dip.shade_recipe (uuid, id, name, sub_streat, lab_status, created_by, created_at, updated_at, remarks, bleaching) FROM stdin;
\.


--
-- Data for Name: shade_recipe_entry; Type: TABLE DATA; Schema: lab_dip; Owner: postgres
--

COPY lab_dip.shade_recipe_entry (uuid, shade_recipe_uuid, material_uuid, quantity, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: info; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.info (uuid, section_uuid, type_uuid, name, short_name, unit, threshold, description, created_at, updated_at, remarks, created_by) FROM stdin;
ji7KS0JN4FkLJ4G	vPMlkocwntdMI10	YpVi3p1kB6fR4u2	Material 1	M1	kg	10.0000		2024-08-12 15:42:54	\N		\N
0UEnxvp0dRSNN3O	2qVTCV4YOaixaoW	YpVi3p1kB6fR4u2	Tape Material	tape rm	kg	5.0000		2024-08-12 15:43:31	\N		\N
uEDEPRyiLRpyNTI	2qVTCV4YOaixaoW	7dfUh5uu3mAOmCk	Matarial2	matarial	kg	25.0000	This material 2 for tape making section . Threshold value for this material 25	2024-09-10 11:02:21	\N	Remarks 1	igD0v9DIJQhJeet
et6nSGkVDhFprlK	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Material 1	mirsad	ltr	0.0000		2024-09-11 11:22:05	\N		RL1xtJnYkxGrTMz
11stu9DnhpKtEjU	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Red 3g	r3g	ltr	20.0000		2024-09-11 19:15:21	\N		RL1xtJnYkxGrTMz
bqrutkcp1xzPGGA	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Bule 45	b-45	kg	40.0000	This is Bule 45	2024-09-14 15:52:49	2024-09-14 15:53:20	ere	RL1xtJnYkxGrTMz
ZT21XJErO6USBxq	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Leveling Agent	LA	kg	0.0000		2024-09-16 14:09:21	\N		igD0v9DIJQhJeet
YfXU3KYnUZzTwiO	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Buffering Agent	BA	kg	0.0000		2024-09-16 14:09:44	\N		igD0v9DIJQhJeet
o4QY8qJhJ9Ua70R	\N	\N	Sequestering Agent	SA	kg	0.0000		2024-09-16 14:10:15	\N		igD0v9DIJQhJeet
FvQfPDBkio16bzL	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Caustic Soda	CS	kg	0.0000		2024-09-16 14:10:37	\N		igD0v9DIJQhJeet
NDgVnTF9PrfPYlc	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Hydrose	Hydrose	kg	0.0000		2024-09-16 14:10:55	\N		igD0v9DIJQhJeet
CROlKNp5WMHSPaK	hxZxXNa6pafB5DW	wslLdV6wFN71Fub	Neutralizer	Neutralizer	kg	0.0000		2024-09-16 14:11:17	\N		igD0v9DIJQhJeet
Q1Nz7zZz5vJYh25	vPMlkocwntdMI10	YpVi3p1kB6fR4u2	test	test short name	kg	25.3300		2024-09-20 02:16:24	2024-09-20 02:34:13		DcGQ6QMjIDlGFAE
Z3zJoptGzVW8vlQ	2qVTCV4YOaixaoW	7dfUh5uu3mAOmCk	#5 nylon tape reverse		kg	500.0000		2024-09-28 12:22:52	\N		jk8y1aKmYx2oY3O
NbVc3KQjU4PrAli	2qVTCV4YOaixaoW	7dfUh5uu3mAOmCk	#300d/96 Air		kg	2000.0000		2024-09-28 13:22:19	\N		jk8y1aKmYx2oY3O
BYaT07wSnIB6dnL	2qVTCV4YOaixaoW	7dfUh5uu3mAOmCk	#300d/96 Wooly		kg	2000.0000		2024-09-28 13:23:38	\N		jk8y1aKmYx2oY3O
KGnDkSoRWcGF76w	XgJEIBj4Amam8Na	YpVi3p1kB6fR4u2	5 monofilament 0.68mm		kg	1500.0000		2024-09-28 13:59:10	\N		jk8y1aKmYx2oY3O
XLoN0SwU7ZwUQJs	XgJEIBj4Amam8Na	YpVi3p1kB6fR4u2	3 monofilament 0.50		kg	1000.0000		2024-09-28 14:00:07	\N		jk8y1aKmYx2oY3O
\.


--
-- Data for Name: section; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.section (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
vPMlkocwntdMI10	Section	Section		2024-09-03 14:38:04	\N	igD0v9DIJQhJeet
2qVTCV4YOaixaoW	Tape Making	Tape	test	2024-09-03 14:38:04	2024-09-08 17:12:01	igD0v9DIJQhJeet
hxZxXNa6pafB5DW	test2			2024-09-10 16:44:53	2024-09-17 03:24:32	igD0v9DIJQhJeet
XgJEIBj4Amam8Na	Coil Forming/Sewing Frming			2024-09-28 13:56:29	\N	jk8y1aKmYx2oY3O
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.stock (uuid, material_uuid, stock, tape_making, coil_forming, dying_and_iron, m_gapping, v_gapping, v_teeth_molding, m_teeth_molding, teeth_assembling_and_polishing, m_teeth_cleaning, v_teeth_cleaning, plating_and_iron, m_sealing, v_sealing, n_t_cutting, v_t_cutting, m_stopper, v_stopper, n_stopper, cutting, die_casting, slider_assembly, coloring, remarks, lab_dip, m_qc_and_packing, v_qc_and_packing, n_qc_and_packing, s_qc_and_packing) FROM stdin;
et6nSGkVDhFprlK	et6nSGkVDhFprlK	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
0UEnxvp0dRSNN3O	0UEnxvp0dRSNN3O	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
ji7KS0JN4FkLJ4G	ji7KS0JN4FkLJ4G	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
uEDEPRyiLRpyNTI	uEDEPRyiLRpyNTI	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
ZT21XJErO6USBxq	ZT21XJErO6USBxq	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
YfXU3KYnUZzTwiO	YfXU3KYnUZzTwiO	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
o4QY8qJhJ9Ua70R	o4QY8qJhJ9Ua70R	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
FvQfPDBkio16bzL	FvQfPDBkio16bzL	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
NDgVnTF9PrfPYlc	NDgVnTF9PrfPYlc	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
CROlKNp5WMHSPaK	CROlKNp5WMHSPaK	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
KGnDkSoRWcGF76w	KGnDkSoRWcGF76w	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
Q1Nz7zZz5vJYh25	Q1Nz7zZz5vJYh25	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
XLoN0SwU7ZwUQJs	XLoN0SwU7ZwUQJs	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
Z3zJoptGzVW8vlQ	Z3zJoptGzVW8vlQ	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
11stu9DnhpKtEjU	11stu9DnhpKtEjU	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
bqrutkcp1xzPGGA	bqrutkcp1xzPGGA	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
BYaT07wSnIB6dnL	BYaT07wSnIB6dnL	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
NbVc3KQjU4PrAli	NbVc3KQjU4PrAli	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	0.0000	\N	0.0000	0.0000	0.0000	0.0000	0.0000
\.


--
-- Data for Name: stock_to_sfg; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.stock_to_sfg (uuid, material_uuid, order_entry_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: trx; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.trx (uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: type; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.type (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
7dfUh5uu3mAOmCk	Yarn	Yarn		2024-09-03 14:38:04	\N	igD0v9DIJQhJeet
YpVi3p1kB6fR4u2	Raw Material	RM		2024-09-03 14:38:04	\N	\N
wslLdV6wFN71Fub	Dyes	dyes	test	2024-09-10 16:44:09	2024-09-14 09:08:26	igD0v9DIJQhJeet
\.


--
-- Data for Name: used; Type: TABLE DATA; Schema: material; Owner: postgres
--

COPY material.used (uuid, material_uuid, section, used_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: buyer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyer (uuid, name, short_name, remarks, created_at, updated_at, created_by) FROM stdin;
GcoDEfQO4IrWi8w	Mayce Of Jolo Fashion	Mayce Of Jolo Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eoYJ4URHFqdkhnd	Rossini	Rossini	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MgpoFH4MmSjteB7	2Tall	2Tall	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jPnLVtumVqbWmDW	4F	4F	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EADTTFEu5VxBrk1	7Fam	7Fam	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JrJSrwflLKRuQPH	90 Degree	90 Degree	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oUgpWjrmB0rG9Mn	A M Londong Fashion Ltd.	A M Londong Fashion Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QXC85UEH1AbGl51	Ab Order	Ab Order	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WehpAvDQ42cQrf5	Acquaviva	Acquaviva	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zd7jbuIkqWCXcPF	Adams	Adams	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hIVuEhosJmeL8Gu	Adler	Adler	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tXeQn4letGeTavn	Ah	Ah	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Lz4zdzCjlWHhXRC	Aj International(Rcvd-Fortune Zipper)	Aj International(Rcvd-Fortune Zipper)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
G5mv4d7YxF71NsE	Aldi	Aldi	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Q8Mv3fHP5stKvGE	Allura	Allura	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JbM0nkekT62yL4I	Alsaad	Alsaad	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OjKoVzyFKGjb7XN	Altex	Altex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5VlnRFoZpoIfYhP	Alvi	Alvi	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
bXDrngcxGhwKR3i	Antony Srl	Antony Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LNR3rp1uC3BHTpp	Apparel 62 Srl	Apparel 62 Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
S8uuQI2RcIJUqF0	Apparel Brands Ltd.	Apparel Brands Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Fh6yaK9QMoXpPxi	Arav Fashion	Arav Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9NY2eihX3TGfila	Arav S.R.L	Arav S.R.L	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zGHjb5FjNXAWrcj	Arbolitos	Arbolitos	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
naLzhOR17Z33lFy	Area B Srl	Area B Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jDIbmKL7wY9m3lL	Ariella	Ariella	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
4zPZKw7YcBgZ6oU	Arvind	Arvind	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ivmxSxdwEahwCOn	Atlas	Atlas	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xLE2sQnMA6Hahpb	Aubanirey	Aubanirey	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2DBKUrcFA01idKj	Avx	Avx	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tRSQlMPK49J7TQd	Avxw	Avxw	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LhZL04DEF29L6Bx	Azm/Fortune/23	Azm/Fortune/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7YUQR7vWKNiafNf	B.Nosy	B.Nosy	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
nnpImA1dI80hjEL	Bab Fashion	Bab Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5pn36w4gNVrVDQP	Baby Look Of Jolo Fashion	Baby Look Of Jolo Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
odGd6p8dft8zU6V	Bajukurang	Bajukurang	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OZmqrYS3pBtVRLI	Barotex	Barotex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IL1itTJ9QixE1HB	Basic	Basic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tlI1X1st4wndqrz	Basic Fashion, Finland	Basic Fashion, Finland	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
aIsaPLyqDj6oSHc	Bay City	Bay City	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zHkefYDUXbDgppS	Be Board	Be Board	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Wpqj9VcNYDf4HjI	Be Board & Renato Balestra	Be Board & Renato Balestra	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
P0uUxntp1FuGwBQ	Be Board Mans	Be Board Mans	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
b2BgbV4IX0mP1EB	Befree	Befree	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6lKFoE2VZodHPKW	Bel & Bo	Bel & Bo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wXLp3e2EpUv8lQU	Bel & Bo-Fabrimode Nv	Bel & Bo-Fabrimode Nv	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GAuvr3iluIrxXy4	Bellaire Of Jolo Fashion Ss24	Bellaire Of Jolo Fashion Ss24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Q9ggPhwiwGslV6V	Ben Sherman	Ben Sherman	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fniHxPa1MvONJnq	Bench	Bench	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
O3xdB8uYl7utTqX	Benucci (Martytex)	Benucci (Martytex)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KCNoy8pRGOwOZiB	Bershka	Bershka	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DqZfVh6mMk8Q7xJ	Best & Less	Best & Less	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dGfiZoE3q1OaJdP	Best Seller	Best Seller	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FoUBdJuqojg0euw	Big Star	Big Star	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mldncGYk9F9EHCc	Bitex	Bitex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7Zxg9VRvyHPCWd9	Bj	Bj	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dBOTfTseaX3OJzO	Bjs	Bjs	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
v67xUhnf2XF64iI	Black Ford	Black Ford	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vWaji4n5OFhlCY7	Blend	Blend	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Y6ANrP0S8h8u9cu	Blue Bag	Blue Bag	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XJaJjH0V3Tw2XQZ	Blue Seven	Blue Seven	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CXhCrEtjGdSUxCx	Bm	Bm	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
P92ArChPF72oada	Boathouse	Boathouse	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cr1kI60NjbPWKGT	Bonmarche	Bonmarche	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
G3dkdfoFT8PNeYI	Booble Goom (Osil)	Booble Goom (Osil)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
UYdSdbKVky2Z2G0	Boohoo	Boohoo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NrOhPoXHkSFt8Bb	Boohoo - Frankie	Boohoo - Frankie	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
A9VyphIiKgBMpC7	Bp-/Fortune/S280/23	Bp-/Fortune/S280/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
o0xiWJwF3YYMzc7	Bp-/Fortune/S283/24	Bp-/Fortune/S283/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mgCSRSge9ohmVmW	Bp-/Fortune/S284/24	Bp-/Fortune/S284/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KJ7bwYK9r1xv6Tm	Bp-47	Bp-47	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
aFB0xhmWbJExxQH	Bp-49	Bp-49	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DcsO2edUMQ0UjtD	Bp-49/Fortune /23	Bp-49/Fortune /23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xWxvew1myEGKKWX	Bp-49/Fortune/23	Bp-49/Fortune/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
O9MVAeVq4ulyHAg	Bp-49/Fortune/D3/23	Bp-49/Fortune/D3/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MZ8Qg9D6cM6V3eH	Bp-49/Fortune/S273/23	Bp-49/Fortune/S273/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tVX18FHmiEWKUxw	Bp-Fortune/Dr-5/24	Bp-Fortune/Dr-5/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xJW8pngqZ7cQvVc	Bp/Fortune/23	Bp/Fortune/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lPw1Y4iDMd5oIoZ	Bp/Fortune/Dr-4(2)/23	Bp/Fortune/Dr-4(2)/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
C2tupwOBOaXP6S2	Bp/Fortune/Dr-4(3)/23	Bp/Fortune/Dr-4(3)/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wMz1XSwarAtW7An	Bp/Fortune/Dr-4(4)/24	Bp/Fortune/Dr-4(4)/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Hj3kS4wqd6IGrXO	Bp/Fortune/Dr-4/23	Bp/Fortune/Dr-4/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kBtvD1y1iIkndUP	Bp/Fortune/Dr-5(1)/24	Bp/Fortune/Dr-5(1)/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lDHdUo979J5Cpfm	Bp/Fortune/Dr-5(2)/24	Bp/Fortune/Dr-5(2)/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xWJJ3if2lxk05td	Bp/Fortune/Dr-6(2)/24	Bp/Fortune/Dr-6(2)/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
pg9gK73294KpWu8	Bp/Fortune/Dr-6/24	Bp/Fortune/Dr-6/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BnnL7lBauK2woSP	Brand Park	Brand Park	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fPpgNkeuWZo5mHE	Brand Studio	Brand Studio	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
A4b6srquroCjQtR	Brand Trading Llc	Brand Trading Llc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eyaAVIdFg4xcVKI	Break Free	Break Free	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
m70DSbQprq2s9qR	Bros Srl	Bros Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KJSdyH8tLFQMXcG	Bross Srl	Bross Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rywiJPl8h10gZa1	By2Mc	By2Mc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2r0nVFXvsMDTRC7	C.Vox	C.Vox	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iba66iJ9arhSqWm	Cad (Fashion Tex)	Cad (Fashion Tex)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Y05ZEEPgw5grt5e	Cadica	Cadica	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fCRf1KedAaGPGU6	Campagnolo	Campagnolo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rBuzNaWwy32qcCY	Canada Weathergear	Canada Weathergear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eAmmRclfyGkCpKz	Canis	Canis	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
f1LoZN3HtGZSTCR	Carry	Carry	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
v3I340VMQjLpPSt	Cash	Cash	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
go4veVfJDTRGMpE	Castro	Castro	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Ef4hysvI3QRn5Dv	Casual Wear	Casual Wear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
syd3nuOlUIojogQ	Cb/Greenbomb	Cb/Greenbomb	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ccb90vFOr9MKMmf	Ccp	Ccp	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
atQ2IB1ukO9NXRB	Cdil	Cdil	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ii14rPsV79sksxE	Celio	Celio	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fXREjAHYoQCjb4Z	Cello	Cello	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fL83WCJMse019FU	Celopman	Celopman	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6xbUYIvhXKWopri	Centro Tex	Centro Tex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fHUMc51gvHFruK4	Chasin	Chasin	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
a4an9fxfRFoMnVe	Chiemsee	Chiemsee	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Fi6WOBpPwlEAGsH	Chillipop	Chillipop	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VOeG1IDBPEBnSjv	Chori	Chori	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ONSNZgTIf91cwtY	Cia Hering	Cia Hering	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2uGSsnbH2YlHrQv	Citi Ten	Citi Ten	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mbsob6Q3URYXYdO	Claton (Boston)	Claton (Boston)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
4PFpleLmy3KytZY	Clayton (Boston)	Clayton (Boston)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lVst4rpQziZ0ijd	Clique	Clique	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
M8Z5gYYL1gG6OAy	Cmp	Cmp	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1YUpntLC3wGMI0z	Code-22	Code-22	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NLQBXHcP3m8PGgG	Cogimex	Cogimex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
18EVozY21BBGtZP	Complices	Complices	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lCXtoMn5HzX1UA6	Concept Sport	Concept Sport	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3KRfo3wNsUyJd8S	Concord Ventures Ltd.	Concord Ventures Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Kayqrtq4flhPr3h	Connor	Connor	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
pFsimMCA28fHEMj	Consept Sport	Consept Sport	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3yM7F4qLF2AFeb9	Contrast	Contrast	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
C9ohIia72LmW3y3	Corolla Fashion	Corolla Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fCP8uWBm0EMJKcf	Corona	Corona	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KBm1voLAzkJ9kSq	Corta High Rise	Corta High Rise	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iluUUiDBY3nB3HF	Costco	Costco	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Rbp3EqNNN9526by	Cotton & Silk	Cotton & Silk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9XT9NPAasI53M8Y	Cotton Belt	Cotton Belt	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
HXClBecOLB1zH3x	Cotton Fild	Cotton Fild	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BjiXZvz4Oc4uGjP	Cotton On	Cotton On	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PKAyXjqyfxyMTjc	Crazy Lane	Crazy Lane	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JJygJZesCM0abwa	Cross Jeans	Cross Jeans	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hcHA8OHGUhIa8e2	Dafatex & Co.	Dafatex & Co.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
uz2ry1zSh7VUpBu	Dare 2B	Dare 2B	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FFe6MZoqGhbzldS	Datch	Datch	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VKQfh2X2VOYmWMj	Datch Junior	Datch Junior	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MSyknUQd0yHHvJ5	De Nittis Micele Srl	De Nittis Micele Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sMTz76MRi8lGprv	Decimas	Decimas	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
RcLXKbzid9Sjmyq	Delsys Canada	Delsys Canada	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Tby1qNKwozyp5aQ	Delys Canada	Delys Canada	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
avxiulzPeO2sogh	Denim Destiny	Denim Destiny	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
e59tfhqZkzIUHha	Denimic	Denimic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
X21bWcqfHRIHyKb	Development.	Development.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3tSW0RnFDZ0nIhy	Devo	Devo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3KNGE7IqieKThgT	Dex	Dex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
e5Ma7J54ZKu1tHr	Dex Collection	Dex Collection	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ci8PrY6Xo7rjGYI	Diadora	Diadora	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
E0JyythkfaS0pO9	Diadora Spa	Diadora Spa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9NBHsNKleXHq3Q1	Diadora Sports Srl	Diadora Sports Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ViKCVkWwIyumin5	Dips	Dips	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
UGElZDRQkpIeaSR	Distriction	Distriction	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6aIWEqAuVECAdzM	Dk Agency	Dk Agency	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
yyz2pxCsJX9G1BG	Dk Agency Ss24	Dk Agency Ss24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
0yrjAQMTeL4kHMv	Dkc	Dkc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
P5xpO0pxXwn9v5T	Dn	Dn	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5EnZy8vDfNNOUrl	Dpam	Dpam	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oUf5z0dND3E1aEM	Dpam Ss24	Dpam Ss24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
E4fdpqcQhrb7BRQ	Dst	Dst	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EoJ2T5xI9capnoe	Dub	Dub	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
y7xvykvItwBv5wA	Dubai Max	Dubai Max	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wSnXC2DgFWESxGN	Dunnes	Dunnes	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ducV71vY5hok0jf	Dunnes Stores	Dunnes Stores	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kwqeMNRcJ2wc9je	Duradrive	Duradrive	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
d7va6J2adZMNFCG	Dyanamic Fill	Dyanamic Fill	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fXoKN5lq6KFmQh5	E Plus	E Plus	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
N7F5zq2iVRoPrvL	E Plus M	E Plus M	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GaIHeO5sDmX7yTs	E-Plus	E-Plus	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
RwLH9hZm4lLizeQ	E-Sports	E-Sports	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SF14cO7TvLTJLSJ	Ecru	Ecru	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jyTkp9h7C3TBSJP	Edinburg Wollen Mill	Edinburg Wollen Mill	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
keAz0vtG5HWj6jD	El Pulpo	El Pulpo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7owchq98y8EK8ba	El-Corte	El-Corte	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
98CnlwkMUe3Le7s	Elemental	Elemental	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DyC751zwEIx5jJN	Elise	Elise	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kR8rYXbUfR2t2X4	Ellos	Ellos	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
d2pmbBJQ3ndnZXN	Ellos Ab	Ellos Ab	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SS2pxpemwomX4fU	Emilio Adani	Emilio Adani	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
olx6ipfQSJhHH52	Encuentro	Encuentro	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ldvF2RkXz6ALXjz	Engbers	Engbers	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XN9HM7aHM1NcVG5	Ernsting Family	Ernsting Family	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dYMXyFhGS3uKoYt	Ernstings Family	Ernstings Family	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Ynw5rSYLcjTp7sH	Esprit	Esprit	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
bGCDuPhrEa8wz1P	Esquiss Fashion Ltd.	Esquiss Fashion Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XgcB44fWGSCBs0M	Essenza	Essenza	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BRLkDpafQCZSO3n	Etam	Etam	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oEWj8Zk5zTkKMIb	Etonic	Etonic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FqjPXBq9msXe0YI	Euro Knit	Euro Knit	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
nPZwH16nAZFsyUs	Ewm	Ewm	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
A7TCkuHp6xX6Z7T	F A K I R	F A K I R	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CrmWa8K83GsDCrj	Famila	Famila	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XlGAEcnaIxaccHI	Far East-Mango	Far East-Mango	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lh95XGZ85KVyr5P	Fariani	Fariani	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qSMntIqiqXy2p2t	Fashion De Executive	Fashion De Executive	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SZipu9nNdkGzTWW	Fashion Nova	Fashion Nova	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oTS1R3gKBmffHCC	Fashion Plus	Fashion Plus	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
b7u6iXpaYM55dSo	Fashion Tex (Cad)	Fashion Tex (Cad)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FQgcSf5lthXqQtL	Fashion Tex- (Key Largo)	Fashion Tex- (Key Largo)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dH5FVL2c2wRrsao	Fbb	Fbb	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
X1Y6MUDwDIatrBn	Fc	Fc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
RWrO867vD6kPbCk	Feeha Fashion	Feeha Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eIFRcYwEw8TGMte	Ficoesa	Ficoesa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BKylj6OzdzSKhGz	Fintex	Fintex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
UCczQmDmPZhw1nw	Fleece Jacket	Fleece Jacket	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QTmSGCFkBipXKXR	Fleece-Hering Kids	Fleece-Hering Kids	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lCYQrL8N3oYLu3w	Fnf	Fnf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZyuAZAboPmGogrY	Foma	Foma	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KJNNnq8OaqeBkcl	Forsberg	Forsberg	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
w0wEx8SH63YiybM	Franchetti	Franchetti	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zXfyCjNkI83ay2U	Francis	Francis	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jXnW1Q7FEqJSS4C	Fransa	Fransa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6RpDweEPurJZHxO	Fredmello	Fredmello	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Uf2AUURv41HGN97	French Terry	French Terry	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ET258lIiFS49uTU	Fsk	Fsk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
n0oIg4XaCUe8HAj	Furaso	Furaso	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
AILLbqRtsLHy8ZE	Fusaro	Fusaro	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Zeu8nIVCvaaIDiV	G Source	G Source	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PKePm9PF3HqlLQG	Gaia Sourcing	Gaia Sourcing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
j1xpu8759mOYvQX	Garma Cb	Garma Cb	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LPA6xTPeOmT5ngS	Garma Cb, Brand - Up/Swimwear/Doone Athleisure	Garma Cb, Brand - Up/Swimwear/Doone Athleisure	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JRSVOcmFMVXsKx0	Garments Crew	Garments Crew	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1ta3XjQ9wxcdPgS	Gate Wear	Gate Wear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BYvbdt9safJXndH	Gds	Gds	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BeIoRyvKWVl5XA1	Gekas	Gekas	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mLQA02TTiXHuRWc	Gemo	Gemo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ciyn72BtGYVNg76	Gerry Weber	Gerry Weber	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5U0uQAxwYI8wZsA	Gfg Int	Gfg Int	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EH37aTGp8sq72UI	Giant Tiger	Giant Tiger	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BvPUKBRI3Zu0c9Q	Gise La	Gise La	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
78L7wEE4fV2XrH3	Gloria Jeans	Gloria Jeans	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fGXH4kxGQP1ZIIo	Gold Twinkle	Gold Twinkle	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iIfC9bs5WMLhloh	Golden Touch	Golden Touch	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ltRZJ5jsNnpJdIm	Gravity	Gravity	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jl75jPS20J8P5qa	Great Wear	Great Wear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cDItGtHyHF3sDK1	Greenbomb	Greenbomb	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Bv9tEkAh2RdGEzO	Greenbomb (Denbe)	Greenbomb (Denbe)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Yi1GrdKs2GgbrzH	Greta Srl	Greta Srl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eZ4gnVOjGj3KJ9t	Grupo Padel Xxl S.L.	Grupo Padel Xxl S.L.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
58TWnozJSuLlWl7	Gt (Giant Tiger)	Gt (Giant Tiger)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
x8Mgk5eaHCALPcg	Gtc	Gtc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
pbllXoaVFhIFnre	Guess	Guess	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Np2BkmprEI701zr	Hamaki Ho	Hamaki Ho	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gGbDiPE3B8p0BB9	Hamo	Hamo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
V5VTEoqWaQuPKcq	Happy	Happy	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
82ieN7PJIRzKbd0	Hejaz	Hejaz	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LmQ4bof0p5ni9PO	Hellenic	Hellenic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xeJSUpuUvDAYvwM	Hellinic	Hellinic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
uhwETQWu35V7JYo	Herma	Herma	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
o5VODGHPJ8OyM8P	Hirota	Hirota	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7kM2CMTYOFUNbIm	Hrm (Sonny Bono)	Hrm (Sonny Bono)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SJY7xTzgzNLH0U6	Hrm/Lucky Star Apparels Ltd.	Hrm/Lucky Star Apparels Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hUfLECOcnrJdTeG	Htms	Htms	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IiCehbX3ir0leTV	Hug Of Fire	Hug Of Fire	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
C1HrQv4eQuR0QIm	Hurley	Hurley	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zrppS88Wj4o3WrO	I	I	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PFOz6x3VYtwsVZW	I Club	I Club	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kkWMPqJr2jKvzMU	Ibafer	Ibafer	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2lxGn6D3Jbw9IzF	Ihl (Duradrive)	Ihl (Duradrive)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
HkfBJyXS0ps09yh	Il Granchio	Il Granchio	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9ONR1am0yqOVddV	In Fashion	In Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
HpLqmn8UqqqEgil	In Fashion Lpp	In Fashion Lpp	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
H8oRVKlQ8om06sG	Inditex	Inditex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EJZiRJ8xI2G6vJR	Initial  Sourcing	Initial  Sourcing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wcvQbVE8VKojNRA	Initial S0Urcing	Initial S0Urcing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
d9DaJvLuEheQuda	Initial Sourcing	Initial Sourcing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ASvICR7cfW8NLeP	Intersun A/S	Intersun A/S	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tEfYhrXn6iWFGYD	J.M.K	J.M.K	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Ce1oLDxYfZDAlbo	Jack & Jones	Jack & Jones	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LWQcMoeigZslmpl	Jay Pi	Jay Pi	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lpxUeoxdvftw1w8	Jbc	Jbc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BOM8GAGj7Z4FpQY	Jbc N.V	Jbc N.V	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1ZKoDCkfuLOuisF	Jbl	Jbl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cUDoGEQJT8A4rgh	Jbl Fashion	Jbl Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QsZMelNsI5rxWXq	Jg	Jg	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5xCSLqJklR4eTRb	Jg Sms	Jg Sms	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fyfzu5fmZ5PFi4M	Jhk	Jhk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
8GpUlxshA9zWjPO	Jit	Jit	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IjN3OyLBN08sRIo	Jkt-05/23	Jkt-05/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
RRmXsHiCpDXPP9o	Jolo Fashion	Jolo Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Nuz2rKd64PIp5pT	Joma	Joma	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
059bhuHIR99NaTs	Jomo Fashion	Jomo Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BAF9cjeM5Edp4Vu	Josef Witt Gmbh	Josef Witt Gmbh	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZPdnknMRmOu8eAx	Josef Witt Gmbh.	Josef Witt Gmbh.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fI6uDikIhrdFvrd	Jp1880	Jp1880	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
88xRzVKR1MXp6rj	Jvz	Jvz	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZJRLhczoRTo4PbP	K-Mart	K-Mart	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ST2MQNjBgqJCV1x	K2-Logistic	K2-Logistic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JLThZhdI1XO1WRI	Kally	Kally	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iIik2kr7dyrek0j	Kangaroos	Kangaroos	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
uEncJWhYZnLfLWP	Karniner	Karniner	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VAKzWucleFlCqR3	Kenneth Cole	Kenneth Cole	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
HhAVLaZlcb5VFKJ	Kera	Kera	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XAWjRvwuU8vQIQ3	Kik	Kik	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Vkc2DyG8JffSsAO	King Fisher	King Fisher	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gml75xV9YPEX7SJ	Klingel	Klingel	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
4WZAiAtZXITvgOJ	Klingl	Klingl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
teVdi1pYfn564qB	Knk	Knk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SgXyI4gRjT9D98d	Koroshi	Koroshi	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
AoZOKPcbmbKW6iU	Ksk	Ksk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
t3lFuiHP6NQbjkb	Kwk	Kwk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Avh1FqtAC3KYOcH	La Redoute	La Redoute	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VBLC86sa78RhWKt	Lamino	Lamino	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7VLXjQtoVS7rtET	Lanidor	Lanidor	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Tw8BpRMLiM6gKlL	Lapin	Lapin	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
04tD0Bforq1fthT	Lascana	Lascana	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
y3fwevqvoYaWG8H	Lawyee	Lawyee	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VHzsJ2I0aLK7wdJ	Lc Waikiki	Lc Waikiki	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FmNs39NlE8gSPa3	Lddv	Lddv	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5gKqX3a9bC7y5a1	Lee Copper	Lee Copper	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mvkIqoWeV6n8eyI	Lefties	Lefties	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Phfx7BYxJuqr3ST	Lefties Girls	Lefties Girls	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MCvZEPjBV9nvL7M	Lenc	Lenc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
St58o8d4P27f1Ku	Lenc By 913 Jf Buyer Zara	Lenc By 913 Jf Buyer Zara	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EE0UlfERvbgGXp2	Lerros	Lerros	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rAKuj2iT9hwErXa	Lgl-Tb-23-00302	Lgl-Tb-23-00302	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
uydyyuozzeuApkW	Liaskos Nikolaos	Liaskos Nikolaos	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oti63TlrNu5YlLn	Lidl	Lidl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NEX3k7oU5LRbX33	Like Flo	Like Flo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gIhAd1LYhsFTlai	Lindex	Lindex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SmzkazVKc5M6MM4	Lion Of Porches	Lion Of Porches	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
4JaxdH4uD1owoSo	Lisure Keyline	Lisure Keyline	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kdsebBcsY4AgyyI	Little Gem	Little Gem	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OUA3zBmV64RR6TG	Llh	Llh	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dJKg6xOpGD7ENuZ	Llp	Llp	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dwTw1IXAPWoX68n	Logo Club	Logo Club	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Nsys26n4jQhUYkx	Lonsdale	Lonsdale	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mobf8bXT6gpgE9V	Lonsdale/May	Lonsdale/May	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sza73jX38Z4yb11	Losan	Losan	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3P8ttT4k37yyPQE	Lpp	Lpp	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EVqLcypCkmyISV4	Lpp Sinsay	Lpp Sinsay	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dfavldaBPA3NUuS	Lw	Lw	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XBopZ6VRw3BbeRI	M & B	M & B	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QgyUptaPmJ9ahoO	Maag	Maag	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NMgG1cDWApEuWVq	Madame	Madame	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NU3En6mkhuuOLMT	Magic Tex	Magic Tex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Ikvojz7OHQ3baOo	Maison Sms	Maison Sms	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DeUrZS2w5KLpSIY	Maison Ss 24 Bulk	Maison Ss 24 Bulk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3bpsrXWLyjJk8hk	Maison Ss24	Maison Ss24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
w9Fryz66uGmCNP7	Malfini	Malfini	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NwT6iLBscbSiGB3	Malu	Malu	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JI7RGeR8qWEZdmK	Mana	Mana	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eJ6mgASRNvlIHuv	Marbel Spa	Marbel Spa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rQXNn3rv7uEa1JZ	Marcus	Marcus	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
r7RRN8gNHZ8c0bc	Marina	Marina	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
K3GUKn47xTrMnIZ	Marine	Marine	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vI9fmRk40TszNYF	Maruhisa	Maruhisa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XTtoadaFRet06Dt	Maverick	Maverick	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Z3jLCHVxC9IvEDo	Max Direct	Max Direct	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zaoRRIoacfJwy3l	Max India	Max India	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tWjKKmTO2Cf0ylM	Maxfort	Maxfort	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
0KGGXvP0BjcfTeC	Maxmoda	Maxmoda	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
g6VLGCeDmx6kPbS	Mbt	Mbt	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
b5SFZV2dUjARXgE	Mcs	Mcs	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
svICoT88Eoonu7S	Mdf	Mdf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xhPCb6bZBwmiNP7	Medicine	Medicine	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2cqHG7hWkT69g0A	Melby	Melby	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
799iyNx3ZiyeBne	Melby-Sms O-230/2023	Melby-Sms O-230/2023	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9AsYbVqLGKQCt6p	Melon Fashion	Melon Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
nLepLzPNhYGaBKQ	Miamania/P	Miamania/P	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7d2HJF3gISsJ0a7	Micheal Strahan	Micheal Strahan	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SBG4LK0kifmxdMY	Micro Fleece	Micro Fleece	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sjND6pWUrx9Yybi	Micro Strass	Micro Strass	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
AOQFB37TR8d4967	Mig-11	Mig-11	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
o2sLZc6HfUr7jWL	Mig-12	Mig-12	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
esZd5x4elvLHRH6	Mineral	Mineral	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SFz74nSM38HLrCZ	Mini Skort	Mini Skort	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
8G7J47CkOST6nLL	Miniconf	Miniconf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
p0Jdd8Ug3SFZUeQ	Miniconf (Sms-Ss-25 Lot-1)	Miniconf (Sms-Ss-25 Lot-1)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
8N37mUtQLnd4lz6	Mirada	Mirada	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cCaHas7GlRPcoYg	Miranda	Miranda	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
an9ak6zR5NgMsyY	Mister Lady	Mister Lady	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
APxIMobaNasxz48	Mlb	Mlb	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
q5CUJNlONHblrwS	Moda	Moda	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WjiyNP7kfSfOF8g	Mom Jacquard & Sewing	Mom Jacquard & Sewing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tKThOQHVsTkKjRI	Monnari	Monnari	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eCj3Jm2lYiqtRZZ	Moodstreet Of Jolo Fashion Aw24	Moodstreet Of Jolo Fashion Aw24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
0yOnxgHxyqUUxjP	Mosaic	Mosaic	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WIpGOd7AejN4yUL	Mosaic-Ksl	Mosaic-Ksl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
N3oCNpjPM2j8yyA	Mosaic-Lpp	Mosaic-Lpp	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mf2fcfFD2KaMxmO	Mpa Softshell	Mpa Softshell	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dchSezp03SqlvrS	Mr Kim	Mr Kim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
T5zWgbYi41J43Eg	Mr Pappu	Mr Pappu	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JLeA1AQUi0kh12s	Mr Sofiqul	Mr Sofiqul	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hvFyvLiBAiS3spA	Mr Zahangir	Mr Zahangir	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
INUaNiwXViIVOkq	Ms Apparel	Ms Apparel	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gnQayu8SgxOLmUL	Munich Swimwear	Munich Swimwear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fKw6FfGNa35Veeo	Mustang	Mustang	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ALEQ7MTtHcWw3ix	Nafisa	Nafisa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wj5xQeAGBgbgljI	Nath Kids	Nath Kids	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SQJsEMEOHUnK2B6	Nelly	Nelly	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vPRYtdKjSpWyt4h	Nemesis	Nemesis	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oMGsBXwBh67L4R7	Neo Tools	Neo Tools	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tqBOFlCHOSQQJN3	Neotools	Neotools	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DB5lk4lRbvDe9zL	New Frontier	New Frontier	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VcCmuY3lmeeZxfG	New Frontier Gmbh	New Frontier Gmbh	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
c7OWJJuY0d4xUN6	New Wave	New Wave	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
lkydb6GWyJU8Fra	New Weav	New Weav	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1q3tpB2uhGuDXBc	New Yorker	New Yorker	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NSB9Rfitxv07gRV	Next	Next	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
bnpAN7QO5rnJRit	Nkd	Nkd	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jVFtG2LiMik7oae	No-Excess	No-Excess	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
HTAT8mpdWv27P8e	No-Excess.	No-Excess.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PVwguo37kr8save	Non Lidl	Non Lidl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oPRu9onXa5NhOAt	Norma	Norma	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BOkzFVfnybSUCXV	North Sails	North Sails	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SLAPVa1Ul7J1M6E	Nova Fashion	Nova Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rSdhIXUPNJWB3zT	Nykaa Fashion	Nykaa Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oYQVg5t0QCIbIw4	O5 Bcbg	O5 Bcbg	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CjD17s7PSM0pXkZ	Oak+Fort	Oak+Fort	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IRN2Meu6gNd1tHB	Ochnick	Ochnick	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Gor3aQymregWgvE	Olympia	Olympia	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JtZ4zJwd3n4IRWq	One Step Up (Avalanche)	One Step Up (Avalanche)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CEnrItyKWBTMbcu	Only & Sons	Only & Sons	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GsekNPxxW6EbB4n	Onnar	Onnar	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iKqE2qkbBbVRwNW	Optimum	Optimum	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IrjsVTWlPlgkEuZ	Optimum Socim	Optimum Socim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LRdEoCwmjjGDeVr	Optimum Soursing(Socim)	Optimum Soursing(Socim)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9NtjZw5i3O24t9g	Oriental	Oriental	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hNsWuxUaJ6bc0Is	Oriental/Grunt	Oriental/Grunt	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
TZzU2xinEwkJ5rL	Original Marines	Original Marines	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ykpTnZ8kPpSESGX	Others	Others	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gN9GLWtVSJo9WE7	Otto	Otto	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6hzamUd4A3u1ozF	Otto Bon	Otto Bon	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FKJtKhGJkCTtslF	Otto International	Otto International	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iwagoRkoSRAnUU6	Otto-45	Otto-45	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
akofqID2f5gZfGr	Otto-Bon	Otto-Bon	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sjWczblGa6F36I5	Otto-Season-150	Otto-Season-150	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
e2wV0RyNKwvrjhq	Ottoman	Ottoman	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
40z5dZ8ACMkr0fW	Outlet	Outlet	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sOYGnvhEWWUbQD7	Outlook	Outlook	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7dq3e53ur759AU4	Outlook Tex	Outlook Tex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
TcpIulFbZRJatBp	Ovs	Ovs	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xQgMCcpeYMvNyh8	Ovs Spa	Ovs Spa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qB6A2RGNwzye8el	Oxygen And Van Hipster	Oxygen And Van Hipster	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YZ29xQhbmeKdWCd	P & C (Gms)	P & C (Gms)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zSvsSz3tbAfAPyQ	P & C (Nak)	P & C (Nak)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QpkFdnaOSjttSIS	P & C (Review)	P & C (Review)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
k3ueiQrBjPROvkR	Padma Textile Ltd.	Padma Textile Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
r5lHffARgRZWAjh	Pan-Uk Nos	Pan-Uk Nos	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
U8t5b4teh6V39ca	Pantaloons	Pantaloons	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Mz4C8qjqUHyQrfR	Pb Tex	Pb Tex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xhzqrmVF2EFNr0p	Pellegrini	Pellegrini	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2zHwvOFtH88EJtq	Pentaloons	Pentaloons	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
8gcZTMdYY1iWmkc	Pep & Co	Pep & Co	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
81APl4VjO5ONTrn	Pepco	Pepco	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
E0ez7QUuDqRao1e	Pepco+Pep&Co	Pepco+Pep&Co	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KWxn2KEASHaefZy	Pepe Janes	Pepe Janes	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VwxVmD0DNr8Lu40	Pepe Jeans	Pepe Jeans	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
o9krXdut5aQEs57	Petrol Ind	Petrol Ind	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xV7TXipmr66oAF3	Petrol Ind Ltd.	Petrol Ind Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DtiaPaIKoO8hyJR	Petrol Ind. Ltd.	Petrol Ind. Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IHIEs4vT7mJnhCH	Piazza Italia	Piazza Italia	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jvF70vhAoRjs40d	Piazza Italya	Piazza Italya	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cm9Q7xEczk5d9Gg	Pierre Cardin	Pierre Cardin	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
h9U8LiyGlVfYvIv	Pillowcases	Pillowcases	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iFfhCAc9KDSkOZA	Pioneer	Pioneer	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ORtgmqah4NK2XPh	Pirma	Pirma	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CtxA3CWKckxqhNY	Pittarello	Pittarello	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
yPd7AJ1F5SVMC3J	Pizza Italian	Pizza Italian	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fXZ0yw7wryfvAue	Play Today	Play Today	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
o9Qd1cnxZxTyn0h	Pmpl	Pmpl	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Z3ot6blcOgm5vb5	Pmpl(Synergies)	Pmpl(Synergies)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1qeE2bPLsku4frR	Pomodoro	Pomodoro	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
0MiSKSqVr62UeUf	Popken Fashion	Popken Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
E1dR1nTSJupOLdV	Prenatal	Prenatal	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
c6wC0d6bmUvctCE	Primark	Primark	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
47oijuMMQWus7St	Prime Source Ltd.-Lambretta	Prime Source Ltd.-Lambretta	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
HltqRLpYjNciTGD	Promo Star	Promo Star	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jIHBSqtAn3u0q5Q	Proxima	Proxima	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
V5SjrhP4UXodcK9	Pull & Bear	Pull & Bear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KBu0JtBx7mPhlwW	Pull & Bear Woman	Pull & Bear Woman	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NZuk1zlPg0xfGrK	Pure-Cotton(Daffah)	Pure-Cotton(Daffah)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
S0MGj7MEAx1eXLb	Q4	Q4	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3dz2bTVADEjre4T	Quattro	Quattro	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2zR7mlAcAvp1170	Qvc	Qvc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QgAxell1KpShKVP	R & B	R & B	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MIFieCvtIPzP381	R Karim	R Karim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
p9Y03fwlWAMdsQb	Ra-23027	Ra-23027	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Dp4DzzSqfRVxf6d	Ra-23030	Ra-23030	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
N4HQ2A8xSEfLA0R	Ra-24003(Caprabo Trouser)	Ra-24003(Caprabo Trouser)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qYGXf2HDGBKdZPf	Ra-24004	Ra-24004	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EElO3uzEEBo3cDd	Ra-24005	Ra-24005	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
RYJ7vir1y5sMSkW	Ra-24006	Ra-24006	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
relNiniwdm9qi7O	Ragno	Ragno	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gfP1hPv0utKvvJv	Rainer,Rk/001/24	Rainer,Rk/001/24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
X1BWADrIcqz1rqY	Rancon Auto Ind. Ltd.	Rancon Auto Ind. Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Vxs0Zh1bIAittIi	Rasa	Rasa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JgdLLiCoggShwUX	Rd International	Rd International	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1j7EELDcTfCITcX	Rebel	Rebel	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
4xjgkZcKgkjvEyV	Redtag	Redtag	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YEksYB2JcWYK5AK	Reference:S0539-24	Reference:S0539-24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GLCiUKGhdeZ7tCq	Renaro Balestra	Renaro Balestra	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ER6zIdvCOucG0Tu	Renato Belestra	Renato Belestra	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CvgWo0d5m26RJkF	Renner	Renner	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LbEkH6LQbNe3sw0	Review	Review	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oFIYhpsKxVkJIAH	Revo Sourcing	Revo Sourcing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MipZmo02mNwNKRn	Riacheulo	Riacheulo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ppAUknqovwKLEM6	Riachlo	Riachlo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EtZo1ad6IQO6CqW	Riachuelo	Riachuelo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
obpFsfQaIoVhjq6	Richlo	Richlo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jnxQGcoTGOx3loR	Richmond	Richmond	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
yH1USXYmPJvLzZB	Riply	Riply	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2YXxEbZSkXWanCL	Rishab	Rishab	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
95MiEn2C9wbcvmy	Rjcp1275	Rjcp1275	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KbdKBoinaZ1zT1W	Rjcp1276	Rjcp1276	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9cP8pfpRGylvnSG	Rk Collection	Rk Collection	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fd8rXHxwko5YjKx	Rk/Fortune/01/23	Rk/Fortune/01/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
R52HsAbGq9HyNi3	Rn	Rn	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
DA5u2r2USUvf0Jv	Roberto Jeans	Roberto Jeans	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YiiT5DmPR9Uibd1	Rookies	Rookies	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZNkyUTFXWjpernR	Rookies Denim	Rookies Denim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kmfVhxrUD4lIB0Z	Ross	Ross	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PO5rDuwDLoVH9AG	Rossini (Akl-Tb-23-00201)	Rossini (Akl-Tb-23-00201)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
93902pEpuiSGEUF	Rossini,Akl-Tb-23-00	Rossini,Akl-Tb-23-00	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
o2Z9LggGbxtlLLK	Rossini,Akl-Tb-23-00195	Rossini,Akl-Tb-23-00195	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ww0oMpwyyGqMQlp	Rossini,Akl-Tb-23-00223	Rossini,Akl-Tb-23-00223	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
AtGi3X0lNao4SZR	Rossini,Akl-Tb-23-00228	Rossini,Akl-Tb-23-00228	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZZdBWkhyHcjiQWv	Rossini(Akl-Tb-23-00201)	Rossini(Akl-Tb-23-00201)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9ubdOUawNGT3zF2	Roverco	Roverco	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Yay99X9dYrH7OdG	Rumee	Rumee	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rgi80VozCGbyLe9	Ruta Fashion	Ruta Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WFsQrZLQY5BesKC	S/C (Zinc)	S/C (Zinc)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YftsQBZP2EzoHZD	S24	S24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3INK1Yjx9I7tP7U	Salling Group	Salling Group	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
70SduzWMH7mHtZQ	Salt & Pepper	Salt & Pepper	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
l4LVZ22ippk2YTs	Sampai Express	Sampai Express	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
UeXRSb92KRJ9IjV	Samsuna	Samsuna	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ErsYjHvL7SFtqZT	Samsung	Samsung	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Lvi4Z3GFNPNewEj	Sand Place	Sand Place	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Pw7KXdmgQTgkMkx	Sandvik	Sandvik	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EZFd2jUUIhSekpz	Sanmar Canadá	Sanmar Canadá	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hDMHDr1YSO7h9kT	Schwab	Schwab	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fKTMonEwOwt1akp	Scuba Interlock	Scuba Interlock	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VWqcRIFvKV1j27I	Sd Connects	Sd Connects	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9u5BQ9OQqpCcGuy	Sdv	Sdv	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZTz1LwN8Pi6QbCJ	Sea Pinch	Sea Pinch	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zvzAFmTy2eMoDgs	Sebago	Sebago	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xZlmAfmm5lrh5Qq	Securitas	Securitas	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sgEQMB1CjK2O2pM	Senbado	Senbado	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oUPyxofTHW66UbU	Sergent Major	Sergent Major	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EWJ6TEc9D7FKLjt	Sergent Major W24	Sergent Major W24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zLtPho7yGjuOTFh	Sergio Tacchini	Sergio Tacchini	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MoekKVGO3VHjlB3	Sevrry	Sevrry	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OR6p1m6iMEFJyXE	Sfera	Sfera	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9FpQpeZvryNzXO5	Sha Sha Tex	Sha Sha Tex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
TLcvZbmAOfWqUWs	Sheego	Sheego	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
aKeM1Pm4ZPAtieA	Sheego Ag	Sheego Ag	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VIyRS576eMHQp92	Shimano	Shimano	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
C6Pt9i5yqGg2UTu	Shimano, Fox	Shimano, Fox	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rbwLIup8ioQ0Cu3	Shirtmakers/Fha	Shirtmakers/Fha	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XMKDxMMV40piIHQ	Sieh An	Sieh An	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cPSKd4jfosYdkfK	Sieh An!	Sieh An!	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FHb40UyH9sJ2JIR	Signet	Signet	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2b1YFAZXLF4RV8a	Signet Ent	Signet Ent	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YSVCE8qPVcDVctT	Signet Ent.	Signet Ent.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qukc2txeBvyk29R	Simito & Pasolini	Simito & Pasolini	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SsU1CoGwegJzxFP	Simura	Simura	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gpM3GtxxLT1xxQG	Simura Fashion	Simura Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cFacuanSpWW5zZ7	Sindico Melange	Sindico Melange	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
yRnGH3dDnIVUzzX	Sindico Mens	Sindico Mens	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sOgdmAJ21s8N5xj	Sinsay	Sinsay	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
KV8Oh9CIG4C3kBi	Siplec	Siplec	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
xOdYY5L1q95OqyZ	Siplee	Siplee	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rM0TgqopTEII2vC	Sisters Point	Sisters Point	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6JT6hBfKTPtbgps	Skinny Denim	Skinny Denim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BJNdBq7FwkqwaGL	Skiva	Skiva	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
whqI1JJb989CVy7	Skope	Skope	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ucGoPOYbjpXKYOo	Sm Accessories	Sm Accessories	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tkOmQqet4VwO1E5	Sml	Sml	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gpUNkmDS7DsOZZJ	Smyk	Smyk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mo9lZDazea8NusZ	Smyk (2Nd Lot Aw24)	Smyk (2Nd Lot Aw24)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PVMWZP6HpvbI8xr	Smyk Intake-9	Smyk Intake-9	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
yallrmiRi7KvxGI	Socim	Socim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
S5lj8wcgzSn9GGy	Socim S.P.A	Socim S.P.A	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
0zf3HDOTzqN433j	Sok-Ss24	Sok-Ss24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dtDNYVwmaHfvXiq	Sok/Ss24	Sok/Ss24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
MKvC7SBSJfXvyj0	Solasta	Solasta	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
TJlW6p7BkdQhRVc	Sonae	Sonae	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cCtkSjPXJlWbLQh	Sonae Fashion	Sonae Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
j7FBnU2NGdcT5xS	Sonai	Sonai	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fCmpvqRfAt5wcgT	Sonny Bono	Sonny Bono	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3eF0o7cGpi3xLz4	South Hem	South Hem	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WUlUKUAa8Jkmq4M	Southend Sweater Co.Ltd.	Southend Sweater Co.Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
H0HLVKiArBpFPKo	Splice	Splice	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fdC6iLEMYhzuiMM	Sports Direct	Sports Direct	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
226EpJ8VI0C7OuT	Sports Group Denmark	Sports Group Denmark	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dGXkUGRjFVjYazU	Spread Group	Spread Group	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wNzs1zGrrayCHLk	Springfield	Springfield	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vj9uYtPEqYfxPO1	Srg	Srg	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
E3emH0erfOOmnh4	Stadium	Stadium	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ciB6vlXnBKs8mgY	Stedman	Stedman	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jPWti0KU7QkQ8sY	Stich & Stone	Stich & Stone	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cv1iDjnw97ztoQP	Stock	Stock	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SHvq4MGMsVgZm02	Stradivarius	Stradivarius	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qLaKbv0SGSIz3CP	Suite Benedict	Suite Benedict	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YTL4LMgD3CICYX6	Suits Inc	Suits Inc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6QikGsHMFcljtdY	Sumitomo	Sumitomo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
oogbJ6OeAbloviX	Sungil	Sungil	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PQPpsRSSmqGOcbR	Sungil/Hunk	Sungil/Hunk	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mnMP0x13l0z0TJ8	Suzy	Suzy	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BeQPGtrZIF4QRiC	Suzy Shier	Suzy Shier	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zRfcLv7uWNnHCZ2	Swab/106/2023	Swab/106/2023	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
T5DHbR6A08bTiHr	Swdemount	Swdemount	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iysZ9C6SMLw1R0J	Sweater	Sweater	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WNH3Nk7U5yXIDnO	Swiss/Alps	Swiss/Alps	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vT0aTUTvUI6zJsH	Syn Paper Denim	Syn Paper Denim	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
JgmQomuEmhGTgBZ	Syn/Sdv/Mens/Pant/Zipper/Tfl/23	Syn/Sdv/Mens/Pant/Zipper/Tfl/23	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
udBRD1iNLtgjboJ	Syngergies	Syngergies	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
dVaPOhlf9082MoN	Takko	Takko	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
iuBrdCpEj3VK2yw	Tao	Tao	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
i7T1xYepgB0MZJo	Tarek	Tarek	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IzAe9bnV3G35X5S	Tata Trent	Tata Trent	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YBlTU0iYYQcVX1O	Tb Urban	Tb Urban	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
nxwZQf5lrPZWKC4	Tb6143,Pb24-007	Tb6143,Pb24-007	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
BHXQZ4IuvYzpavj	Team Sourcing	Team Sourcing	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
us8qjq2hm6g2UJ1	Techbro (Topitop)	Techbro (Topitop)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
trPwm57BYOncOPr	Techbro(Topitop)	Techbro(Topitop)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
W1BqiBBAx2tLrWo	Temakaw Fashion Ltd.	Temakaw Fashion Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Sc4Q78LfNNB1DaG	Terranova	Terranova	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SpIVQOYB6le7cQk	Tex Beat	Tex Beat	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5WrxsAKYmoaANi5	Tex Beat (G.I.T)	Tex Beat (G.I.T)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GzWalCFJm9uNUk8	Tex Beat (Hope Srl)	Tex Beat (Hope Srl)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LHR1UqS7eqzXVPk	Tex Fashion Global	Tex Fashion Global	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gUtXgGhRiKTNmCY	Tex Merchant	Tex Merchant	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EoHwSkFxp3e2ua3	Tex Tune	Tex Tune	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LAAkRQr4q3Ngeku	Tex Xone	Tex Xone	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
WwrWhpYykFDrqPH	Tex Xpression	Tex Xpression	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
E5Kzma1yHmZqDQM	Tex-Ebo/ Sfera	Tex-Ebo/ Sfera	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YwqIIyOMxjcLzly	Tex-Merchant	Tex-Merchant	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EfhTXnSfuSQCS1a	Texbeat	Texbeat	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2zdwhNY62nhDk9P	Texbeat (Fc-Koln)	Texbeat (Fc-Koln)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZY76GX73B8caloO	Texbeat (Union Berlin)	Texbeat (Union Berlin)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fFkV7NbBgP1yhRD	Texeye	Texeye	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
yqZS7hZ3i3RBtOI	Texmerchant	Texmerchant	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kE5ii9cXbrGxWbD	Texojit(Acoola)	Texojit(Acoola)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
uDDpKnv9UfIARZc	Texsport	Texsport	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qo8PFqmBuNYa77z	Texsport B.V.	Texsport B.V.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jBt2q7IPGpXr1AG	Texsport/Ernsting Family	Texsport/Ernsting Family	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GSEsD6MchGFHf7Q	Texwave	Texwave	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vzE0dG2eDDeECsq	Texweave	Texweave	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
sRiFKdLXoz1RkdX	Texweave-Po-13250,Rpo-533	Texweave-Po-13250,Rpo-533	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
UPzZKNKB70yVOJ3	Texweave,Po-13250,Rpo-533	Texweave,Po-13250,Rpo-533	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Snfqq6lpvQGqzA6	Texweave/Kik	Texweave/Kik	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
IC68Im1BKLHo4yn	Texzam	Texzam	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
v1GXTa0DS63ouF8	Tivoli	Tivoli	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
T16NpeQOhozowm1	Tj. Max	Tj. Max	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PLRO4TgfuYchnQG	Tnc Of Jolo Fashion Aw24	Tnc Of Jolo Fashion Aw24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CLlnXgtPFOHjQpc	Tokamanni	Tokamanni	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Rwytai67RdBHUjh	Tokmanni	Tokmanni	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Xmd27m3KAgeNnU1	Top  Gun	Top  Gun	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ezs8owSOPGAI5xv	Top Notch	Top Notch	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5VZAydluzMCxbUr	Top Ten	Top Ten	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
LKyuxUjJcDr5lsP	Toptex	Toptex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2haNTbmGeMkwg11	Trasco Apparels Ltd.	Trasco Apparels Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fnpNZ1KIIgohku8	Trendz	Trendz	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XeU98bmsDmB0yuw	Trendz Fashion (Dapper)	Trendz Fashion (Dapper)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
2aGx3hQvvvg05mw	Trendz-Dapper	Trendz-Dapper	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CZhyWxlOpccKaHZ	Trendz-Rumee	Trendz-Rumee	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
XEq3vuImsREsg3k	Trendz-Zarel	Trendz-Zarel	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7rmxXiyiM0aFT0U	Trendz(Daper)	Trendz(Daper)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gQR6pY9WNZdyhfH	Trendz(Zarel)	Trendz(Zarel)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
AqpFBlX0lgdnOrR	Trent	Trent	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vWapFRbPwP5sUOs	Trf	Trf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
1wDf5UOc02Y8Z8w	Tricot	Tricot	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
508PUqldVxaiR9k	Tricot M	Tricot M	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5TB57jIDIvYlcTr	Trim Wear	Trim Wear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NcKe56pwvh9jlHg	Tuli Trading  Ltd.	Tuli Trading  Ltd.	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
pQC60paTOtCVhyt	Turaag_Corporate	Turaag_Corporate	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6i7XGsJrGRFneko	Turag	Turag	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
CxMDpzBk2LdyKzM	Twl (Psbd)	Twl (Psbd)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
gh3ptzZ6OgIGfUA	Tygo&Vito	Tygo&Vito	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vfecSRHFASBfFN8	U.S Polo	U.S Polo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NdxTjeAdmEsdQZP	U.S Polo Assn	U.S Polo Assn	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
stvshHaOk0HdLSb	Ulla Popken	Ulla Popken	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vXzVQFubIklBiUs	Ulla Popken/Sadi	Ulla Popken/Sadi	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eG7YEY0k2rJ7nhz	Umbro Aw-24	Umbro Aw-24	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6B9Yk6kpM6d9yJq	Unicorn Trade International	Unicorn Trade International	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tOfZaNHqplpa5zK	Unileaf	Unileaf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
h7ZmCbDiaoynO8j	Us Polo	Us Polo	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
7fX7CwtD3Pyabx8	Us Sweat	Us Sweat	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
8SKhQ0GKPcbP0bx	Uspa	Uspa	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Em27cLtTxPWXVkw	Velilla	Velilla	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Z0gdlfzAra5GHzW	Venus	Venus	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
FP7Kpdp4fodnDei	Vero Style-Gg	Vero Style-Gg	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
orWuF6O06DU8LRu	Vertbaudet	Vertbaudet	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
EXspR4enOwGgTad	Vesin	Vesin	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
nvdxwgtR98feDbg	Vingino	Vingino	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
mtipRY6RxlPcZGT	Visionary	Visionary	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wvCacUWi9n9srGM	Volcano	Volcano	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
PjhVmqv3IrTesHO	Vts	Vts	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SelfG8Sj2rsRxN6	W.Fashion	W.Fashion	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YVYlpSjJLUv1uQS	Wadi Al Feli	Wadi Al Feli	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OwwJOh1j3RuvSxO	Walbufch	Walbufch	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SXm9GQaheHfWTUy	Water Lemon	Water Lemon	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
cW2H5PY7GNfWpRu	Waterlemon	Waterlemon	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eZwLizXrPXuf828	Westin	Westin	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kXZgQUu5hCZ14ZS	Westside	Westside	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
3OxFLQR2GVzaj0X	Whispering Smith	Whispering Smith	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jyHK0EFaGzBrNBi	Williams (Salling Group)	Williams (Salling Group)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
J1VqaQn6uhoa1DW	Wingfat	Wingfat	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ZuBXdSAQTSeE8eM	Witt	Witt	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
0VhPVmB8AF5xNMl	Witt -15 ( Heine Brand )	Witt -15 ( Heine Brand )	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
agMmAlowSWqqNe7	Witt -16 ( Heine Brand )	Witt -16 ( Heine Brand )	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
kQ5NM9xlvPonjv0	Witt -16 (Heine Brand)	Witt -16 (Heine Brand)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
jHb8XWAKHmV29qQ	Witt -16-( Heine Brand )	Witt -16-( Heine Brand )	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
qcFlTB4FQewubR0	Witt Gruppe	Witt Gruppe	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
b0CxdAGU5gDH6YT	Witt-15/2023	Witt-15/2023	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YFjN4Z8IpvTT5Hu	Witt-16/2023	Witt-16/2023	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
VBM5KTuNnGtXijg	Witt-16/2024	Witt-16/2024	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
YQKaIqn8lX5SYLx	Wool Worth	Wool Worth	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
fxivv1ma8lLTQ7w	Worldtex	Worldtex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
ueXHvWVvdfEhHHG	Xd Connectors	Xd Connectors	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NgfqmbIavpfasrw	Xindao	Xindao	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
p6gXO1J9qqadGRK	Xindao -50	Xindao -50	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
GQEwpu5cxjyVzSg	Xindao (Vinga)	Xindao (Vinga)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
rMnomgpK0Duy9Xz	Xindao 42	Xindao 42	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
vMmd4cHZXYhTXe7	Y.Crew	Y.Crew	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6ln5IuKJ4QX5Dzu	Ym Inc	Ym Inc	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
NaJSAB3IQdW6NwL	Zalando	Zalando	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
pcVkc5wxNLCUXSq	Zalando (Nitex)	Zalando (Nitex)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Z3clbDE0ThkCdrD	Zalando (P&C 05)	Zalando (P&C 05)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
hZTScs6ZPs78dMs	Zalando-Nitex	Zalando-Nitex	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6yhhUxrxi2be8pC	Zalando(Nitex)	Zalando(Nitex)	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
9SCjhTzalwWtS3y	Zara	Zara	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Ix2SXZZngtmeuOl	Zara 420	Zara 420	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OaPSTgHnCZatlbK	Zara Boys	Zara Boys	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
SG5COdip4AmXcFt	Zara Kids	Zara Kids	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
Oa7EwEe3U0zsqJM	Zara Kids, Pull & Bear	Zara Kids, Pull & Bear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
5oosTp3EZ1vXcdB	Zara Ladies	Zara Ladies	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
UtF0GLhei0j5Ag8	Zara Man	Zara Man	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zNLXLxmfjqDinzq	Zara Trf	Zara Trf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
tt3WGxyFY2eSdRj	Zara-Trf	Zara-Trf	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
eJ5xtZaItsZxYjl	Zara, Trf, Zara Kids, Pull & Bear	Zara, Trf, Zara Kids, Pull & Bear	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
6UL90R5zwU5qgr0	Zarel	Zarel	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
k3UdGUfvP6hrRuo	Zdd	Zdd	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
npIlVKnNsTOnnTy	Zippy	Zippy	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
zLlX9lzY4DhAsNf	Zudio	Zudio	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
QZByWxHImBdPwaZ	Zulements	Zulements	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
wKpvYGg4EKIVDtM	Zxy	Zxy	\N	2024-09-02 19:20:04	\N	igD0v9DIJQhJeet
OXTQIoeMVUHs4nC	GUESS			2024-09-28 11:33:41	\N	IMPhbfmV3GUYSpi
NX2dCMGkcy7nQO3	PEGADOR	PEGADOR		2024-09-28 12:10:21	\N	IMPhbfmV3GUYSpi
N3SbTYjDLXys0yQ	RK  COLLECTION	RK		2024-09-28 12:10:37	\N	IMPhbfmV3GUYSpi
pcMn7JTysicu9u8	LPP	PP		2024-09-28 12:51:07	\N	IMPhbfmV3GUYSpi
\.


--
-- Data for Name: factory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factory (uuid, party_uuid, name, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
cf-daf86b3eedf1	cf-daf86b3eedf1	ggwop	12354654	ggwp	2024-01-01 00:00:00	2024-01-01 00:00:00	\N	\N
eKQfsXgRkr3oVfjgWj8JL	cf-daf86b3eedf1	Admin	01684545112	asdasd	2024-08-08 18:55:56	2024-09-03 14:35:46	\N	testing
GcoDEfQO4IrWi8w	2l3D21fVnWp63Ir	Ador Composite Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eoYJ4URHFqdkhnd	2l3D21fVnWp63Ir	Boston Sportswear Mfg Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MgpoFH4MmSjteB7	2l3D21fVnWp63Ir	Concord Raiment Wear Limited.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jPnLVtumVqbWmDW	2l3D21fVnWp63Ir	Alliance Knit Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EADTTFEu5VxBrk1	2l3D21fVnWp63Ir	Galpex Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JrJSrwflLKRuQPH	2l3D21fVnWp63Ir	Grade One Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oUgpWjrmB0rG9Mn	2l3D21fVnWp63Ir	Jahara Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QXC85UEH1AbGl51	2l3D21fVnWp63Ir	Noman Group (Head Office)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WehpAvDQ42cQrf5	2l3D21fVnWp63Ir	S.S Printers And Accesories	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zd7jbuIkqWCXcPF	2l3D21fVnWp63Ir	St Zipper	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hIVuEhosJmeL8Gu	2l3D21fVnWp63Ir	Uttara Knitwear Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tXeQn4letGeTavn	2l3D21fVnWp63Ir	W-Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Lz4zdzCjlWHhXRC	2l3D21fVnWp63Ir	Nassa Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
G5mv4d7YxF71NsE	2l3D21fVnWp63Ir	Nippon Garment Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Q8Mv3fHP5stKvGE	xZdY9X7cfpPKYMn	Bengal Hurricane Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JbM0nkekT62yL4I	30dE6BPRDlMZdH1	Tarasima Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OjKoVzyFKGjb7XN	30dE6BPRDlMZdH1	Green World Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5VlnRFoZpoIfYhP	30dE6BPRDlMZdH1	Natural Indigo Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bXDrngcxGhwKR3i	30dE6BPRDlMZdH1	Nextgen Style Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LNR3rp1uC3BHTpp	30dE6BPRDlMZdH1	Quazi Abedin Tex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ppsiYiJwEol4XSl	30dE6BPRDlMZdH1	Triple Seven Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S8uuQI2RcIJUqF0	30dE6BPRDlMZdH1	Tivoli   Apparels   Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jY9a2JnLkXFKf06	30dE6BPRDlMZdH1	Designer Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
12AgBLDcwxPmz0s	30dE6BPRDlMZdH1	Energypac Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Fh6yaK9QMoXpPxi	30dE6BPRDlMZdH1	Glamour Dresses Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9NY2eihX3TGfila	30dE6BPRDlMZdH1	Habitus Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cXcu72O0gwTmaFk	30dE6BPRDlMZdH1	Jl Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zGHjb5FjNXAWrcj	30dE6BPRDlMZdH1	Pacific  Knitex Ltd. (Concern Of Pacific Jeans)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
naLzhOR17Z33lFy	30dE6BPRDlMZdH1	Rishab World Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jDIbmKL7wY9m3lL	30dE6BPRDlMZdH1	Sun Sourcing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4zPZKw7YcBgZ6oU	30dE6BPRDlMZdH1	T.F Zipper	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ivmxSxdwEahwCOn	30dE6BPRDlMZdH1	Tcw	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xLE2sQnMA6Hahpb	30dE6BPRDlMZdH1	Abnz Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2DBKUrcFA01idKj	30dE6BPRDlMZdH1	Afiya Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tRSQlMPK49J7TQd	30dE6BPRDlMZdH1	Ahsan Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LhZL04DEF29L6Bx	30dE6BPRDlMZdH1	Ahsan Knitting Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7YUQR7vWKNiafNf	30dE6BPRDlMZdH1	Alyana Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nnpImA1dI80hjEL	30dE6BPRDlMZdH1	Spartan Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5pn36w4gNVrVDQP	30dE6BPRDlMZdH1	Lammim Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3jzh3N2PsTQdlrz	30dE6BPRDlMZdH1	Amana Knit Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rjbCipydPKxqkov	30dE6BPRDlMZdH1	Amichi Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
odGd6p8dft8zU6V	30dE6BPRDlMZdH1	Amico Enterpeise	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OZmqrYS3pBtVRLI	30dE6BPRDlMZdH1	Amity Design	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IL1itTJ9QixE1HB	30dE6BPRDlMZdH1	Ams International (Sweater) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tlI1X1st4wndqrz	30dE6BPRDlMZdH1	Apparel Village Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aIsaPLyqDj6oSHc	30dE6BPRDlMZdH1	Quick Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zHkefYDUXbDgppS	30dE6BPRDlMZdH1	Asset Plus	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Wpqj9VcNYDf4HjI	30dE6BPRDlMZdH1	Bangladesh Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P0uUxntp1FuGwBQ	30dE6BPRDlMZdH1	Bd Police	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b2BgbV4IX0mP1EB	30dE6BPRDlMZdH1	Best Dress Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6lKFoE2VZodHPKW	30dE6BPRDlMZdH1	Best Style Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wXLp3e2EpUv8lQU	30dE6BPRDlMZdH1	Blue Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C6iyNYp4ZmGFRq7	30dE6BPRDlMZdH1	Bongo Stiches Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5PCqKbplzPBFmAl	30dE6BPRDlMZdH1	Brothers Trade International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GAuvr3iluIrxXy4	30dE6BPRDlMZdH1	Dr Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Q9ggPhwiwGslV6V	30dE6BPRDlMZdH1	Dress Maker Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fniHxPa1MvONJnq	30dE6BPRDlMZdH1	Dynamic Zipper	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O3xdB8uYl7utTqX	30dE6BPRDlMZdH1	Elegant Sourcing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KCNoy8pRGOwOZiB	30dE6BPRDlMZdH1	Erum Tex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DqZfVh6mMk8Q7xJ	30dE6BPRDlMZdH1	Magic Works Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dGfiZoE3q1OaJdP	30dE6BPRDlMZdH1	Fashion.Com Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FoUBdJuqojg0euw	30dE6BPRDlMZdH1	Gardenia Accessories	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mldncGYk9F9EHCc	30dE6BPRDlMZdH1	Glamour Dress Limited (Gdl)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7Zxg9VRvyHPCWd9	30dE6BPRDlMZdH1	Handz Clothing Bd Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dBOTfTseaX3OJzO	30dE6BPRDlMZdH1	J And A Zipper And Accessories	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v67xUhnf2XF64iI	30dE6BPRDlMZdH1	Jamuna Denims Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vWaji4n5OFhlCY7	30dE6BPRDlMZdH1	Kappa Fashion Wear Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Y6ANrP0S8h8u9cu	30dE6BPRDlMZdH1	Kashfi Knit Wears Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XJaJjH0V3Tw2XQZ	30dE6BPRDlMZdH1	Lakhsma Innerwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CXhCrEtjGdSUxCx	30dE6BPRDlMZdH1	A.H. Tower, Plot-56, Road-02, Sector-03, Uttara	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P92ArChPF72oada	30dE6BPRDlMZdH1	Lithe Complex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cr1kI60NjbPWKGT	30dE6BPRDlMZdH1	Hilton Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
G3dkdfoFT8PNeYI	30dE6BPRDlMZdH1	Sawftex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UYdSdbKVky2Z2G0	30dE6BPRDlMZdH1	Tarabo Dress Maker	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NrOhPoXHkSFt8Bb	30dE6BPRDlMZdH1	Max Clothing Bd Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A9VyphIiKgBMpC7	30dE6BPRDlMZdH1	New Genaration Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o0xiWJwF3YYMzc7	30dE6BPRDlMZdH1	Optimum Fashion Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mgCSRSge9ohmVmW	30dE6BPRDlMZdH1	Pacific Cotton Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KJ7bwYK9r1xv6Tm	30dE6BPRDlMZdH1	Peak Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aFB0xhmWbJExxQH	30dE6BPRDlMZdH1	Pioneer Casual Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DcsO2edUMQ0UjtD	30dE6BPRDlMZdH1	Probashi Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xWxvew1myEGKKWX	30dE6BPRDlMZdH1	Rs Composite	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O9MVAeVq4ulyHAg	30dE6BPRDlMZdH1	Sara Fashionwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MZ8Qg9D6cM6V3eH	30dE6BPRDlMZdH1	Sf Sweaters Litd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tVX18FHmiEWKUxw	30dE6BPRDlMZdH1	Shell Tex International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xJW8pngqZ7cQvVc	30dE6BPRDlMZdH1	Pakiza Knit Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lPw1Y4iDMd5oIoZ	30dE6BPRDlMZdH1	Super Trims Manufacturing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C2tupwOBOaXP6S2	30dE6BPRDlMZdH1	Bscic, Fatullah, Narayanaganj	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wMz1XSwarAtW7An	30dE6BPRDlMZdH1	Comfort Collection	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Hj3kS4wqd6IGrXO	30dE6BPRDlMZdH1	Pakiza Woven Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kBtvD1y1iIkndUP	30dE6BPRDlMZdH1	Txm Lifestyle Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lDHdUo979J5Cpfm	30dE6BPRDlMZdH1	Heaven Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xWJJ3if2lxk05td	30dE6BPRDlMZdH1	M.T. Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pg9gK73294KpWu8	30dE6BPRDlMZdH1	Tex Tune Bangladesh Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BnnL7lBauK2woSP	30dE6BPRDlMZdH1	Celebrety Garments Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fPpgNkeuWZo5mHE	30dE6BPRDlMZdH1	Fashion Export Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A4b6srquroCjQtR	30dE6BPRDlMZdH1	Mostafa Garments Industries	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eyaAVIdFg4xcVKI	30dE6BPRDlMZdH1	Rafi Texmode	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
m70DSbQprq2s9qR	30dE6BPRDlMZdH1	Sajib Fashion Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KJSdyH8tLFQMXcG	30dE6BPRDlMZdH1	Texeye Sourcing (Head Office)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rywiJPl8h10gZa1	30dE6BPRDlMZdH1	Top Moon Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2r0nVFXvsMDTRC7	30dE6BPRDlMZdH1	Top Star Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iba66iJ9arhSqWm	30dE6BPRDlMZdH1	Tm Designers Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Y05ZEEPgw5grt5e	30dE6BPRDlMZdH1	Total Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fCRf1KedAaGPGU6	30dE6BPRDlMZdH1	Diana Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rBuzNaWwy32qcCY	30dE6BPRDlMZdH1	Yagi Bangladesh	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eAmmRclfyGkCpKz	30dE6BPRDlMZdH1	Unity Fabrics Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
f1LoZN3HtGZSTCR	30dE6BPRDlMZdH1	Urban Global Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v3I340VMQjLpPSt	30dE6BPRDlMZdH1	Zee Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
go4veVfJDTRGMpE	30dE6BPRDlMZdH1	Crown Fashion & Sweater Ind. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ef4hysvI3QRn5Dv	30dE6BPRDlMZdH1	Dhaka Pullover Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
syd3nuOlUIojogQ	30dE6BPRDlMZdH1	Eurozone Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ccb90vFOr9MKMmf	30dE6BPRDlMZdH1	Greenlife Knittex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
atQ2IB1ukO9NXRB	30dE6BPRDlMZdH1	Honey Well Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ii14rPsV79sksxE	30dE6BPRDlMZdH1	Novus Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fXREjAHYoQCjb4Z	30dE6BPRDlMZdH1	Oasis Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fL83WCJMse019FU	30dE6BPRDlMZdH1	Pacific Cotton Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6xbUYIvhXKWopri	30dE6BPRDlMZdH1	S.B Knitting Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fHUMc51gvHFruK4	30dE6BPRDlMZdH1	4Z Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
a4an9fxfRFoMnVe	30dE6BPRDlMZdH1	Sadat Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Fi6WOBpPwlEAGsH	30dE6BPRDlMZdH1	Afrah Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VOeG1IDBPEBnSjv	30dE6BPRDlMZdH1	Anabia Trading Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ONSNZgTIf91cwtY	30dE6BPRDlMZdH1	Anm Global	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2uGSsnbH2YlHrQv	30dE6BPRDlMZdH1	Asia Style House Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mbsob6Q3URYXYdO	30dE6BPRDlMZdH1	Day Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4PFpleLmy3KytZY	30dE6BPRDlMZdH1	Fashion Flow Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lVst4rpQziZ0ijd	30dE6BPRDlMZdH1	Asrotex Group (Head Office)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
M8Z5gYYL1gG6OAy	30dE6BPRDlMZdH1	Head Office, Ayesha & Galeya	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1YUpntLC3wGMI0z	30dE6BPRDlMZdH1	Baruca Fashion Inc	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NLQBXHcP3m8PGgG	30dE6BPRDlMZdH1	Rio Fashion Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
18EVozY21BBGtZP	30dE6BPRDlMZdH1	Techno Fiber Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lCXtoMn5HzX1UA6	30dE6BPRDlMZdH1	Bd Knit Design Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3KRfo3wNsUyJd8S	30dE6BPRDlMZdH1	Novel Hurricane Knit Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Kayqrtq4flhPr3h	30dE6BPRDlMZdH1	Arabi Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pFsimMCA28fHEMj	30dE6BPRDlMZdH1	Well Lord Knit Wears Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3yM7F4qLF2AFeb9	30dE6BPRDlMZdH1	Besta Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C9ohIia72LmW3y3	30dE6BPRDlMZdH1	Beximco Denims Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fCP8uWBm0EMJKcf	30dE6BPRDlMZdH1	Croydon Kowloon Designs Limited (Ckdl)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KBm1voLAzkJ9kSq	30dE6BPRDlMZdH1	Dbl Group (Jinnat Knitwear)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iluUUiDBY3nB3HF	30dE6BPRDlMZdH1	Louietex Manufacturing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Rbp3EqNNN9526by	30dE6BPRDlMZdH1	Virgo Mh Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9XT9NPAasI53M8Y	30dE6BPRDlMZdH1	Denimach Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HXClBecOLB1zH3x	30dE6BPRDlMZdH1	Denimic Industry Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BjiXZvz4Oc4uGjP	30dE6BPRDlMZdH1	Denimic Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PKAyXjqyfxyMTjc	30dE6BPRDlMZdH1	The New Delta Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JJygJZesCM0abwa	30dE6BPRDlMZdH1	Dew Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hcHA8OHGUhIa8e2	30dE6BPRDlMZdH1	Dip Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uz2ry1zSh7VUpBu	30dE6BPRDlMZdH1	Dowas-Land Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FFe6MZoqGhbzldS	30dE6BPRDlMZdH1	Entrust Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VKQfh2X2VOYmWMj	30dE6BPRDlMZdH1	Esquire Knit Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MSyknUQd0yHHvJ5	30dE6BPRDlMZdH1	Perfect Sweater Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sMTz76MRi8lGprv	30dE6BPRDlMZdH1	Euro Denim & Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RcLXKbzid9Sjmyq	30dE6BPRDlMZdH1	Euro Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Tby1qNKwozyp5aQ	30dE6BPRDlMZdH1	Harry Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
avxiulzPeO2sogh	30dE6BPRDlMZdH1	S.B. Knitting Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e59tfhqZkzIUHha	30dE6BPRDlMZdH1	Fortis Group (Head Office)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X21bWcqfHRIHyKb	30dE6BPRDlMZdH1	Spotfame Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3tSW0RnFDZ0nIhy	30dE6BPRDlMZdH1	Global Dresses Hk Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3KNGE7IqieKThgT	30dE6BPRDlMZdH1	Icarus Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e5Ma7J54ZKu1tHr	30dE6BPRDlMZdH1	Fashion Forum Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ci8PrY6Xo7rjGYI	30dE6BPRDlMZdH1	Ids Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E0JyythkfaS0pO9	30dE6BPRDlMZdH1	Impress Newtex Composite Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9NBHsNKleXHq3Q1	30dE6BPRDlMZdH1	Indesore Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ViKCVkWwIyumin5	30dE6BPRDlMZdH1	K.G. Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UGElZDRQkpIeaSR	30dE6BPRDlMZdH1	Kentucky Knit Bd Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6aIWEqAuVECAdzM	30dE6BPRDlMZdH1	Knittex Industries Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yyz2pxCsJX9G1BG	30dE6BPRDlMZdH1	Leaf Grade Casualwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0yrjAQMTeL4kHMv	30dE6BPRDlMZdH1	Mahmud Jeans Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P5xpO0pxXwn9v5T	30dE6BPRDlMZdH1	Masco Cottons Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5EnZy8vDfNNOUrl	30dE6BPRDlMZdH1	Cutting Edge Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oUf5z0dND3E1aEM	30dE6BPRDlMZdH1	Head Office	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E4fdpqcQhrb7BRQ	30dE6BPRDlMZdH1	Mbm Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EoJ2T5xI9capnoe	30dE6BPRDlMZdH1	Meghna Denims Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
y7xvykvItwBv5wA	30dE6BPRDlMZdH1	Chittagong Fashion Specialised Textiles Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wSnXC2DgFWESxGN	30dE6BPRDlMZdH1	Metro Maker Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ducV71vY5hok0jf	30dE6BPRDlMZdH1	Pakiza Woven Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kwqeMNRcJ2wc9je	30dE6BPRDlMZdH1	Crosswear Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d7va6J2adZMNFCG	30dE6BPRDlMZdH1	Flaxen Dress Maker Ltd. (Knit & Woven)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fXoKN5lq6KFmQh5	30dE6BPRDlMZdH1	Natex Of Scandinavia A/S	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N7F5zq2iVRoPrvL	30dE6BPRDlMZdH1	Bokran, Monipur, Mirzapur, Gazipur	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GaIHeO5sDmX7yTs	30dE6BPRDlMZdH1	Raiyan Knit Composite Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RwLH9hZm4lLizeQ	30dE6BPRDlMZdH1	Odyssey Craft (Pvt.) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SF14cO7TvLTJLSJ	30dE6BPRDlMZdH1	Padma Textiles Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jyTkp9h7C3TBSJP	30dE6BPRDlMZdH1	Purbani Group, Head Office	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
keAz0vtG5HWj6jD	30dE6BPRDlMZdH1	Dhaka	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7owchq98y8EK8ba	30dE6BPRDlMZdH1	Sardar Trims Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
98CnlwkMUe3Le7s	30dE6BPRDlMZdH1	Head Office, Sml Global	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DyC751zwEIx5jJN	30dE6BPRDlMZdH1	Gtal (Glory Textile & Apparels Ltd.)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kR8rYXbUfR2t2X4	30dE6BPRDlMZdH1	Genetic Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d2pmbBJQ3ndnZXN	30dE6BPRDlMZdH1	Rbsr Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SS2pxpemwomX4fU	30dE6BPRDlMZdH1	Matrix Dresses Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
olx6ipfQSJhHH52	30dE6BPRDlMZdH1	Sqaure Denims Limited (Garments Unit)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ldvF2RkXz6ALXjz	30dE6BPRDlMZdH1	Square Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XN9HM7aHM1NcVG5	30dE6BPRDlMZdH1	Fortune Head Office	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dYMXyFhGS3uKoYt	30dE6BPRDlMZdH1	Tex Xpressions Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ynw5rSYLcjTp7sH	30dE6BPRDlMZdH1	Powertex Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bGCDuPhrEa8wz1P	30dE6BPRDlMZdH1	Texeurop(Bd) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XgcB44fWGSCBs0M	30dE6BPRDlMZdH1	Tivoli Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BRLkDpafQCZSO3n	30dE6BPRDlMZdH1	Zuzus Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oEWj8Zk5zTkKMIb	30dE6BPRDlMZdH1	Trendz Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FqjPXBq9msXe0YI	30dE6BPRDlMZdH1	A Plus Ind. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nPZwH16nAZFsyUs	30dE6BPRDlMZdH1	San Souring Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A7TCkuHp6xX6Z7T	30dE6BPRDlMZdH1	Abanti Colour Tex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CrmWa8K83GsDCrj	30dE6BPRDlMZdH1	Blue Planet Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XlGAEcnaIxaccHI	30dE6BPRDlMZdH1	Cotton Bridge	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lh95XGZ85KVyr5P	30dE6BPRDlMZdH1	4Z Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qSMntIqiqXy2p2t	30dE6BPRDlMZdH1	Denim Venture Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SZipu9nNdkGzTWW	30dE6BPRDlMZdH1	Mim Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oTS1R3gKBmffHCC	30dE6BPRDlMZdH1	Sadat Outwears	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b7u6iXpaYM55dSo	30dE6BPRDlMZdH1	Echotex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FQgcSf5lthXqQtL	30dE6BPRDlMZdH1	Fashion Asia Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dH5FVL2c2wRrsao	30dE6BPRDlMZdH1	Islam Garments	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X1Y6MUDwDIatrBn	30dE6BPRDlMZdH1	Lexim Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RWrO867vD6kPbCk	30dE6BPRDlMZdH1	Logos Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eIFRcYwEw8TGMte	30dE6BPRDlMZdH1	Mac Tex Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BKylj6OzdzSKhGz	30dE6BPRDlMZdH1	Marma Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UCczQmDmPZhw1nw	30dE6BPRDlMZdH1	Nelima Fashion Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QTmSGCFkBipXKXR	30dE6BPRDlMZdH1	Texeurop (Bd)Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lCYQrL8N3oYLu3w	30dE6BPRDlMZdH1	Jstex Garments & Textile Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZyuAZAboPmGogrY	30dE6BPRDlMZdH1	Platinum Apparel Manufacturing Co. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KJNNnq8OaqeBkcl	30dE6BPRDlMZdH1	Siji Garments	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
w0wEx8SH63YiybM	30dE6BPRDlMZdH1	Space Sweater Limited.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zXfyCjNkI83ay2U	30dE6BPRDlMZdH1	Synergies Source Bangladesh Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jXnW1Q7FEqJSS4C	30dE6BPRDlMZdH1	Temakaw Fashion. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6RpDweEPurJZHxO	30dE6BPRDlMZdH1	Fair Textile Mills	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Uf2AUURv41HGN97	30dE6BPRDlMZdH1	Tex Fashion Global	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ET258lIiFS49uTU	30dE6BPRDlMZdH1	Tex International Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
n0oIg4XaCUe8HAj	30dE6BPRDlMZdH1	Tosrifa Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AILLbqRtsLHy8ZE	30dE6BPRDlMZdH1	Unique Tex Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Zeu8nIVCvaaIDiV	30dE6BPRDlMZdH1	Afrah Dress	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PKePm9PF3HqlLQG	30dE6BPRDlMZdH1	Atex Associetes Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
j1xpu8759mOYvQX	30dE6BPRDlMZdH1	Caesar Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LPA6xTPeOmT5ngS	30dE6BPRDlMZdH1	Cleartex Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JRSVOcmFMVXsKx0	30dE6BPRDlMZdH1	Ctg Buying House	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1ta3XjQ9wxcdPgS	30dE6BPRDlMZdH1	Dress King	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BYvbdt9safJXndH	30dE6BPRDlMZdH1	Dress. Me Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BeIoRyvKWVl5XA1	30dE6BPRDlMZdH1	Explore Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mLQA02TTiXHuRWc	30dE6BPRDlMZdH1	Idas Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ciyn72BtGYVNg76	30dE6BPRDlMZdH1	Innova Associates	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5U0uQAxwYI8wZsA	30dE6BPRDlMZdH1	Jk Shirt	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EH37aTGp8sq72UI	30dE6BPRDlMZdH1	Jp Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BvPUKBRI3Zu0c9Q	30dE6BPRDlMZdH1	K & K Corporation Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
78L7wEE4fV2XrH3	30dE6BPRDlMZdH1	Ma J&J Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fGXH4kxGQP1ZIIo	30dE6BPRDlMZdH1	Masud Buying House	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iIfC9bs5WMLhloh	30dE6BPRDlMZdH1	Orbit Style Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ltRZJ5jsNnpJdIm	30dE6BPRDlMZdH1	Provati Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jl75jPS20J8P5qa	30dE6BPRDlMZdH1	Rich Cotton Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cDItGtHyHF3sDK1	30dE6BPRDlMZdH1	Saz Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Bv9tEkAh2RdGEzO	30dE6BPRDlMZdH1	Shehan Specialized Textile Mills Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Yi1GrdKs2GgbrzH	30dE6BPRDlMZdH1	Skr Attire Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eZ4gnVOjGj3KJ9t	30dE6BPRDlMZdH1	Smart Jeans Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
58TWnozJSuLlWl7	30dE6BPRDlMZdH1	Soetex Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
x8Mgk5eaHCALPcg	30dE6BPRDlMZdH1	Venture Trim	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pbllXoaVFhIFnre	30dE6BPRDlMZdH1	Western Cotton Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Np2BkmprEI701zr	30dE6BPRDlMZdH1	A & A Trousers Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gGbDiPE3B8p0BB9	30dE6BPRDlMZdH1	Alps Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
V5VTEoqWaQuPKcq	30dE6BPRDlMZdH1	Cute Dress Industry Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
82ieN7PJIRzKbd0	30dE6BPRDlMZdH1	T.H-Bhaban.71, Borobagh.Mirpur-2.Dhaka-1216	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LmQ4bof0p5ni9PO	30dE6BPRDlMZdH1	Flaxen Dress Maker Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xeJSUpuUvDAYvwM	30dE6BPRDlMZdH1	Frill Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uhwETQWu35V7JYo	30dE6BPRDlMZdH1	Global Knitwear Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o5VODGHPJ8OyM8P	30dE6BPRDlMZdH1	Golden Touch International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7kM2CMTYOFUNbIm	30dE6BPRDlMZdH1	Green Mark Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SJY7xTzgzNLH0U6	30dE6BPRDlMZdH1	Kvl. International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hUfLECOcnrJdTeG	30dE6BPRDlMZdH1	Libas Stitch Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IiCehbX3ir0leTV	30dE6BPRDlMZdH1	New Asia Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zrppS88Wj4o3WrO	30dE6BPRDlMZdH1	Singair Road, Hemayetpur Road, Savar	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PFOz6x3VYtwsVZW	30dE6BPRDlMZdH1	Prime Sweater Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kkWMPqJr2jKvzMU	30dE6BPRDlMZdH1	Primodial Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2lxGn6D3Jbw9IzF	30dE6BPRDlMZdH1	Bay Emporium Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HkfBJyXS0ps09yh	30dE6BPRDlMZdH1	R S Trims Sourcing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9ONR1am0yqOVddV	30dE6BPRDlMZdH1	Flaxen Dress Maker	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HpLqmn8UqqqEgil	30dE6BPRDlMZdH1	Reaz Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
H8oRVKlQ8om06sG	30dE6BPRDlMZdH1	Revo Sourcing Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EJZiRJ8xI2G6vJR	30dE6BPRDlMZdH1	Shinha Knit Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wcvQbVE8VKojNRA	30dE6BPRDlMZdH1	Sinha Knit And Denims Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d9DaJvLuEheQuda	30dE6BPRDlMZdH1	Stoffatex Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ASvICR7cfW8NLeP	30dE6BPRDlMZdH1	Anam Garments Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tEfYhrXn6iWFGYD	30dE6BPRDlMZdH1	Versatile Creation Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ce1oLDxYfZDAlbo	30dE6BPRDlMZdH1	Axis Knit Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LWQcMoeigZslmpl	30dE6BPRDlMZdH1	Bengal Knittex Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lpxUeoxdvftw1w8	30dE6BPRDlMZdH1	Bij Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BOM8GAGj7Z4FpQY	30dE6BPRDlMZdH1	Crown Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1ZKoDCkfuLOuisF	30dE6BPRDlMZdH1	Euro Bangla Associates	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cUDoGEQJT8A4rgh	30dE6BPRDlMZdH1	Friends Knitwear & Accessories Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5xCSLqJklR4eTRb	30dE6BPRDlMZdH1	Hamid Tex Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fyfzu5fmZ5PFi4M	30dE6BPRDlMZdH1	Liberty Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8GpUlxshA9zWjPO	30dE6BPRDlMZdH1	Mastercham Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RRmXsHiCpDXPP9o	30dE6BPRDlMZdH1	Motex Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Nuz2rKd64PIp5pT	30dE6BPRDlMZdH1	Nazmul Hosiery (Pvt.) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
059bhuHIR99NaTs	30dE6BPRDlMZdH1	Prisma Apparel	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BAF9cjeM5Edp4Vu	30dE6BPRDlMZdH1	Akh Knitting & Dyeing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZPdnknMRmOu8eAx	30dE6BPRDlMZdH1	Ratul Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fI6uDikIhrdFvrd	30dE6BPRDlMZdH1	S.M. Knit Wears Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
88xRzVKR1MXp6rj	30dE6BPRDlMZdH1	Sabah Designers	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZJRLhczoRTo4PbP	30dE6BPRDlMZdH1	Sara Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ST2MQNjBgqJCV1x	30dE6BPRDlMZdH1	Shinest Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JLThZhdI1XO1WRI	30dE6BPRDlMZdH1	Motaleb Monowara Composite (Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iIik2kr7dyrek0j	30dE6BPRDlMZdH1	Starlet Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uEncJWhYZnLfLWP	30dE6BPRDlMZdH1	United Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VAKzWucleFlCqR3	30dE6BPRDlMZdH1	Uttara Knitwears Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HhAVLaZlcb5VFKJ	30dE6BPRDlMZdH1	Texstream Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XAWjRvwuU8vQIQ3	30dE6BPRDlMZdH1	Texstream Yungfung	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Vkc2DyG8JffSsAO	30dE6BPRDlMZdH1	A Z Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gml75xV9YPEX7SJ	30dE6BPRDlMZdH1	Alif Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4WZAiAtZXITvgOJ	30dE6BPRDlMZdH1	Aman Knitting & Aman Fashion Design	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
teVdi1pYfn564qB	30dE6BPRDlMZdH1	Ananta Huaxiang Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SgXyI4gRjT9D98d	30dE6BPRDlMZdH1	Apex Holdings Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AoZOKPcbmbKW6iU	30dE6BPRDlMZdH1	Comtextile (Hk) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
t3lFuiHP6NQbjkb	30dE6BPRDlMZdH1	Fakir Eco Knit Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Avh1FqtAC3KYOcH	30dE6BPRDlMZdH1	Fashion Flow Apparels	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VBLC86sa78RhWKt	30dE6BPRDlMZdH1	Jamuna Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7VLXjQtoVS7rtET	30dE6BPRDlMZdH1	Majumder Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Tw8BpRMLiM6gKlL	30dE6BPRDlMZdH1	Marquee Manufacturers Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
04tD0Bforq1fthT	30dE6BPRDlMZdH1	Mega Yarn Dyeing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
y3fwevqvoYaWG8H	30dE6BPRDlMZdH1	Mim Design Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VHzsJ2I0aLK7wdJ	30dE6BPRDlMZdH1	Metro Knitting & Dyeing Mills Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FmNs39NlE8gSPa3	30dE6BPRDlMZdH1	Patriot Eco Apparel Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5gKqX3a9bC7y5a1	30dE6BPRDlMZdH1	Pearl Global	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mvkIqoWeV6n8eyI	30dE6BPRDlMZdH1	Premier Exim	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Phfx7BYxJuqr3ST	ecdpCimdya8Wyxc	S.Suhi Industrial Park Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MCvZEPjBV9nvL7M	ecdpCimdya8Wyxc	Ram Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
St58o8d4P27f1Ku	mTFISFfiGeg4x2S	Riya Trading	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EE0UlfERvbgGXp2	mTFISFfiGeg4x2S	Shams Design	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rAKuj2iT9hwErXa	mTFISFfiGeg4x2S	Simple Approach Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oti63TlrNu5YlLn	mTFISFfiGeg4x2S	Square Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NEX3k7oU5LRbX33	mTFISFfiGeg4x2S	Srg Apparels Plc	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gIhAd1LYhsFTlai	lIzkE9oWgPMw1BE	Mars Stitch Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SmzkazVKc5M6MM4	lIzkE9oWgPMw1BE	The Source Expert	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4JaxdH4uD1owoSo	lIzkE9oWgPMw1BE	Tusuka Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kdsebBcsY4AgyyI	lIzkE9oWgPMw1BE	Vital Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OUA3zBmV64RR6TG	lIzkE9oWgPMw1BE	Wave Riders Ltd.(Urmi Group)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dJKg6xOpGD7ENuZ	lIzkE9oWgPMw1BE	A Plus Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dwTw1IXAPWoX68n	lIzkE9oWgPMw1BE	Ab Mart Fashion Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Nsys26n4jQhUYkx	lIzkE9oWgPMw1BE	Anabia Trading Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mobf8bXT6gpgE9V	lIzkE9oWgPMw1BE	Apparel Buyer Solution	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sza73jX38Z4yb11	lIzkE9oWgPMw1BE	Asrotex Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3P8ttT4k37yyPQE	lIzkE9oWgPMw1BE	Fariha Knit Tex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EVqLcypCkmyISV4	lIzkE9oWgPMw1BE	Asrotex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dfavldaBPA3NUuS	lIzkE9oWgPMw1BE	Aukotex Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XBopZ6VRw3BbeRI	lIzkE9oWgPMw1BE	Baraka Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QgyUptaPmJ9ahoO	lIzkE9oWgPMw1BE	Barnali Textile & Printing Ind.Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NMgG1cDWApEuWVq	lIzkE9oWgPMw1BE	Centex Textile & Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NU3En6mkhuuOLMT	lIzkE9oWgPMw1BE	Coretex Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ikvojz7OHQ3baOo	lIzkE9oWgPMw1BE	Ensa Clothing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DeUrZS2w5KLpSIY	lIzkE9oWgPMw1BE	Pratik Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3bpsrXWLyjJk8hk	lIzkE9oWgPMw1BE	Fabrics & Yarn Solution Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
w9Fryz66uGmCNP7	lIzkE9oWgPMw1BE	Fashion Step Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NwT6iLBscbSiGB3	lIzkE9oWgPMw1BE	Himalay Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JI7RGeR8qWEZdmK	lIzkE9oWgPMw1BE	Hong Kong Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eJ6mgASRNvlIHuv	lIzkE9oWgPMw1BE	Kd Sourcing International Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rQXNn3rv7uEa1JZ	lIzkE9oWgPMw1BE	Power Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
r7RRN8gNHZ8c0bc	lIzkE9oWgPMw1BE	Tsr Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
K3GUKn47xTrMnIZ	lIzkE9oWgPMw1BE	Knit Valley  Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vI9fmRk40TszNYF	lIzkE9oWgPMw1BE	Masco Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XTtoadaFRet06Dt	lIzkE9oWgPMw1BE	New Asia Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Z3jLCHVxC9IvEDo	lIzkE9oWgPMw1BE	Nofs Garments	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zaoRRIoacfJwy3l	lIzkE9oWgPMw1BE	Olympia International Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tWjKKmTO2Cf0ylM	lIzkE9oWgPMw1BE	Pb Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0KGGXvP0BjcfTeC	lIzkE9oWgPMw1BE	Promoda Textile Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
g6VLGCeDmx6kPbS	lIzkE9oWgPMw1BE	Rusayla Clothing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b5SFZV2dUjARXgE	lIzkE9oWgPMw1BE	Shahara Exports Incorporation Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
svICoT88Eoonu7S	lIzkE9oWgPMw1BE	Shamser Knit Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xhPCb6bZBwmiNP7	lIzkE9oWgPMw1BE	Signet Enterprise	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2cqHG7hWkT69g0A	lIzkE9oWgPMw1BE	Southern Clothing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
799iyNx3ZiyeBne	lIzkE9oWgPMw1BE	Swan Jeans Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9AsYbVqLGKQCt6p	lIzkE9oWgPMw1BE	Tream Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nLepLzPNhYGaBKQ	lIzkE9oWgPMw1BE	24/7 Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7d2HJF3gISsJ0a7	lIzkE9oWgPMw1BE	Al-Muslim Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SBG4LK0kifmxdMY	lIzkE9oWgPMw1BE	Aman Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sjND6pWUrx9Yybi	lIzkE9oWgPMw1BE	Aus Bangla Jutex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AOQFB37TR8d4967	lIzkE9oWgPMw1BE	Trent Shoes	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o2sLZc6HfUr7jWL	lIzkE9oWgPMw1BE	Daeyu Bangladesh	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
esZd5x4elvLHRH6	lIzkE9oWgPMw1BE	Dewan Fashion Wears Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SFz74nSM38HLrCZ	lIzkE9oWgPMw1BE	Experience Clothing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8G7J47CkOST6nLL	lIzkE9oWgPMw1BE	Far East Knitting & Dyeing Ind. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
p0Jdd8Ug3SFZUeQ	lIzkE9oWgPMw1BE	Fashion Glob	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8N37mUtQLnd4lz6	lIzkE9oWgPMw1BE	Flick Trading	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cCaHas7GlRPcoYg	lIzkE9oWgPMw1BE	Jstex  Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
an9ak6zR5NgMsyY	lIzkE9oWgPMw1BE	Lucas Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
APxIMobaNasxz48	lIzkE9oWgPMw1BE	Mashiata Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
q5CUJNlONHblrwS	lIzkE9oWgPMw1BE	Merchantex Co (Bd) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WjiyNP7kfSfOF8g	lIzkE9oWgPMw1BE	Mnr Swater	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tKThOQHVsTkKjRI	lIzkE9oWgPMw1BE	Natural Indigo Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eCj3Jm2lYiqtRZZ	lIzkE9oWgPMw1BE	Nippon Garments Ind. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0yOnxgHxyqUUxjP	lIzkE9oWgPMw1BE	Palmal Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WIpGOd7AejN4yUL	lIzkE9oWgPMw1BE	Pure Cotton	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N3oCNpjPM2j8yyA	lIzkE9oWgPMw1BE	Rahmat Knit	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mf2fcfFD2KaMxmO	lIzkE9oWgPMw1BE	Riverside Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dchSezp03SqlvrS	lIzkE9oWgPMw1BE	Standard Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
T5zWgbYi41J43Eg	lIzkE9oWgPMw1BE	Suxes Attire	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JLeA1AQUi0kh12s	lIzkE9oWgPMw1BE	Sweater Tech	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hvFyvLiBAiS3spA	lIzkE9oWgPMw1BE	Texpro Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gnQayu8SgxOLmUL	lIzkE9oWgPMw1BE	Vasper Sourcing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fKw6FfGNa35Veeo	lIzkE9oWgPMw1BE	Bengal Leisure Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ALEQ7MTtHcWw3ix	lIzkE9oWgPMw1BE	Fair Textile Mills Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wj5xQeAGBgbgljI	lIzkE9oWgPMw1BE	Venture Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SQJsEMEOHUnK2B6	lIzkE9oWgPMw1BE	Tosa Creations	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vPRYtdKjSpWyt4h	lIzkE9oWgPMw1BE	Well Touch Appareal Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oMGsBXwBh67L4R7	lIzkE9oWgPMw1BE	Zeysha Fashionwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tqBOFlCHOSQQJN3	lIzkE9oWgPMw1BE	Adroit Linkers	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DB5lk4lRbvDe9zL	lIzkE9oWgPMw1BE	Ckdl	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VcCmuY3lmeeZxfG	lIzkE9oWgPMw1BE	Fashinza Manufacturing Simplified	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
c7OWJJuY0d4xUN6	lIzkE9oWgPMw1BE	Next Sourcing Limited(Head Office)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lkydb6GWyJU8Fra	lIzkE9oWgPMw1BE	S.M Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NSB9Rfitxv07gRV	lIzkE9oWgPMw1BE	The Impetus Gallery Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bnpAN7QO5rnJRit	lIzkE9oWgPMw1BE	Active Trims Bd Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jVFtG2LiMik7oae	lIzkE9oWgPMw1BE	Aukotex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HTAT8mpdWv27P8e	lIzkE9oWgPMw1BE	Birds Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PVwguo37kr8save	lIzkE9oWgPMw1BE	Birds A & Z Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oPRu9onXa5NhOAt	lIzkE9oWgPMw1BE	Confidence Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BOkzFVfnybSUCXV	lIzkE9oWgPMw1BE	Cotton Club Bd Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SLAPVa1Ul7J1M6E	lIzkE9oWgPMw1BE	Debonair Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rSdhIXUPNJWB3zT	lIzkE9oWgPMw1BE	Dhaka Knitting Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oYQVg5t0QCIbIw4	lIzkE9oWgPMw1BE	Dk Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CjD17s7PSM0pXkZ	lIzkE9oWgPMw1BE	Fly Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IRN2Meu6gNd1tHB	lIzkE9oWgPMw1BE	Graphics Textiles Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Gor3aQymregWgvE	lIzkE9oWgPMw1BE	Haque Apparels & Textile Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JtZ4zJwd3n4IRWq	lIzkE9oWgPMw1BE	Hdf Apparel Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CEnrItyKWBTMbcu	lIzkE9oWgPMw1BE	K.C. Bottom & Shirt Wear	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GsekNPxxW6EbB4n	lIzkE9oWgPMw1BE	Latest Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iKqE2qkbBbVRwNW	lIzkE9oWgPMw1BE	Libas Textile Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IrjsVTWlPlgkEuZ	lIzkE9oWgPMw1BE	Sheen Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LRdEoCwmjjGDeVr	lIzkE9oWgPMw1BE	M.M Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9NtjZw5i3O24t9g	lIzkE9oWgPMw1BE	Mamun Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hNsWuxUaJ6bc0Is	lIzkE9oWgPMw1BE	Northern Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TZzU2xinEwkJ5rL	lIzkE9oWgPMw1BE	Rose N Tex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ykpTnZ8kPpSESGX	lIzkE9oWgPMw1BE	Stylesmyth San Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gN9GLWtVSJo9WE7	lIzkE9oWgPMw1BE	Textown Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6hzamUd4A3u1ozF	lIzkE9oWgPMw1BE	Tg321 Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FKJtKhGJkCTtslF	lIzkE9oWgPMw1BE	Thk Asia	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iwagoRkoSRAnUU6	lIzkE9oWgPMw1BE	Z.H Accessorise International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
akofqID2f5gZfGr	lIzkE9oWgPMw1BE	Alvenous Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sjWczblGa6F36I5	lIzkE9oWgPMw1BE	Bhis Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e2wV0RyNKwvrjhq	lIzkE9oWgPMw1BE	4A Yarn Dyeing Ltd. (Jacket Unit)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
40z5dZ8ACMkr0fW	lIzkE9oWgPMw1BE	Brands Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sOYGnvhEWWUbQD7	lIzkE9oWgPMw1BE	Byzid Apparels (Pvt).Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7dq3e53ur759AU4	lIzkE9oWgPMw1BE	Corona Fashion Limited.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TcpIulFbZRJatBp	lIzkE9oWgPMw1BE	Crl Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xQgMCcpeYMvNyh8	lIzkE9oWgPMw1BE	Deshbandhu Textile Mills Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qB6A2RGNwzye8el	lIzkE9oWgPMw1BE	Doreen Apparels Division	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YZ29xQhbmeKdWCd	lIzkE9oWgPMw1BE	Doreen Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zSvsSz3tbAfAPyQ	lIzkE9oWgPMw1BE	Euro Arte Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QpkFdnaOSjttSIS	lIzkE9oWgPMw1BE	Fashion De Executive	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
k3ueiQrBjPROvkR	lIzkE9oWgPMw1BE	Florence Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
r5lHffARgRZWAjh	lIzkE9oWgPMw1BE	Hug Of Fire	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
U8t5b4teh6V39ca	lIzkE9oWgPMw1BE	Inditex  Wear	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Mz4C8qjqUHyQrfR	lIzkE9oWgPMw1BE	Interlink Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xhzqrmVF2EFNr0p	lIzkE9oWgPMw1BE	Mb Knit Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2zHwvOFtH88EJtq	lIzkE9oWgPMw1BE	Mrs Design Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8gcZTMdYY1iWmkc	lIzkE9oWgPMw1BE	Seven Links Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
81APl4VjO5ONTrn	lIzkE9oWgPMw1BE	Snow White Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E0ez7QUuDqRao1e	lIzkE9oWgPMw1BE	Spot Fame Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KWxn2KEASHaefZy	lIzkE9oWgPMw1BE	Tekstil Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VwxVmD0DNr8Lu40	lIzkE9oWgPMw1BE	Virgo Mh Limited.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o9krXdut5aQEs57	lIzkE9oWgPMw1BE	Ab Apparels Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xV7TXipmr66oAF3	lIzkE9oWgPMw1BE	Al Nesar Garments	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DtiaPaIKoO8hyJR	lIzkE9oWgPMw1BE	Caretex Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IHIEs4vT7mJnhCH	lIzkE9oWgPMw1BE	Green Life Knit Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jvF70vhAoRjs40d	lIzkE9oWgPMw1BE	Jf & Co. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cm9Q7xEczk5d9Gg	lIzkE9oWgPMw1BE	Knit Plus Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
h9U8LiyGlVfYvIv	lIzkE9oWgPMw1BE	Masco Knit Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iFfhCAc9KDSkOZA	lIzkE9oWgPMw1BE	Momtex Expo Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ORtgmqah4NK2XPh	lIzkE9oWgPMw1BE	Natural Denims Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CtxA3CWKckxqhNY	lIzkE9oWgPMw1BE	Nexus Sweater	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yPd7AJ1F5SVMC3J	lIzkE9oWgPMw1BE	Pentagon Knit Com Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fXZ0yw7wryfvAue	lIzkE9oWgPMw1BE	Prime Source Enterprises Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o9Qd1cnxZxTyn0h	lIzkE9oWgPMw1BE	Rizvi Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Z3ot6blcOgm5vb5	lIzkE9oWgPMw1BE	Rich Cotton Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1qeE2bPLsku4frR	lIzkE9oWgPMw1BE	Seihin Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0MiSKSqVr62UeUf	lIzkE9oWgPMw1BE	Stoffatex Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E1dR1nTSJupOLdV	lIzkE9oWgPMw1BE	Ducati Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
c6wC0d6bmUvctCE	lIzkE9oWgPMw1BE	Techno Design	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
47oijuMMQWus7St	lIzkE9oWgPMw1BE	Transform Tread International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HltqRLpYjNciTGD	lIzkE9oWgPMw1BE	Trasco Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jIHBSqtAn3u0q5Q	lIzkE9oWgPMw1BE	Trendz Fashion Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KBu0JtBx7mPhlwW	lIzkE9oWgPMw1BE	Sumi Apparels (Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NZuk1zlPg0xfGrK	lIzkE9oWgPMw1BE	Wear Vibes	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S0MGj7MEAx1eXLb	lIzkE9oWgPMw1BE	Wraps Clothes-Line Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3dz2bTVADEjre4T	lIzkE9oWgPMw1BE	Yokoe Ind. Bangladesh	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2zR7mlAcAvp1170	lIzkE9oWgPMw1BE	Abir Fashion(Head Office)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QgAxell1KpShKVP	lIzkE9oWgPMw1BE	Abir Fashions (Narayanganj)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MIFieCvtIPzP381	lIzkE9oWgPMw1BE	Al Amin Attiers	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
p9Y03fwlWAMdsQb	lIzkE9oWgPMw1BE	Aurum Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Dp4DzzSqfRVxf6d	lIzkE9oWgPMw1BE	Bangla Poshak Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N4HQ2A8xSEfLA0R	lIzkE9oWgPMw1BE	Bidnbuy Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qYGXf2HDGBKdZPf	lIzkE9oWgPMw1BE	Hejaz Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EElO3uzEEBo3cDd	lIzkE9oWgPMw1BE	Fashion Mart Dot Com	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RYJ7vir1y5sMSkW	lIzkE9oWgPMw1BE	Ishayat Apparel	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
relNiniwdm9qi7O	lIzkE9oWgPMw1BE	Isource Your Garments	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gfP1hPv0utKvvJv	lIzkE9oWgPMw1BE	Kleider Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X1BWADrIcqz1rqY	lIzkE9oWgPMw1BE	Pole Star Fashion Design Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Vxs0Zh1bIAittIi	lIzkE9oWgPMw1BE	Prince Jacquard Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JgdLLiCoggShwUX	lIzkE9oWgPMw1BE	Rahman Sports Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1j7EELDcTfCITcX	lIzkE9oWgPMw1BE	T.J. Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4xjgkZcKgkjvEyV	lIzkE9oWgPMw1BE	Sayem Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YEksYB2JcWYK5AK	lIzkE9oWgPMw1BE	M/S. Nexus Sweater Ind. (Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GLCiUKGhdeZ7tCq	lIzkE9oWgPMw1BE	Tex Arena Global	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ER6zIdvCOucG0Tu	lIzkE9oWgPMw1BE	Azim & Son (Pvt.) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CvgWo0d5m26RJkF	lIzkE9oWgPMw1BE	Azim & Son (Pvt.) Ltd. (U-02)	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LbEkH6LQbNe3sw0	lIzkE9oWgPMw1BE	Salman Adnan (Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oFIYhpsKxVkJIAH	lIzkE9oWgPMw1BE	Cold Asia Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MipZmo02mNwNKRn	lIzkE9oWgPMw1BE	Denim Venture & Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ppAUknqovwKLEM6	lIzkE9oWgPMw1BE	Eurotex Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EtZo1ad6IQO6CqW	lIzkE9oWgPMw1BE	Giant Star Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
obpFsfQaIoVhjq6	lIzkE9oWgPMw1BE	Gimex Clothing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jnxQGcoTGOx3loR	lIzkE9oWgPMw1BE	Dohs Baridhara	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yH1USXYmPJvLzZB	lIzkE9oWgPMw1BE	Arr Dismatics Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2YXxEbZSkXWanCL	lIzkE9oWgPMw1BE	Cosmic Sweater.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
95MiEn2C9wbcvmy	lIzkE9oWgPMw1BE	Esquire Sweater	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KbdKBoinaZ1zT1W	lIzkE9oWgPMw1BE	Ocean Sweater	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9cP8pfpRGylvnSG	lIzkE9oWgPMw1BE	Max Mind Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fd8rXHxwko5YjKx	lIzkE9oWgPMw1BE	Mim Fashion Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
R52HsAbGq9HyNi3	lIzkE9oWgPMw1BE	Moonlux Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DA5u2r2USUvf0Jv	lIzkE9oWgPMw1BE	Nexus Sweater Ind(Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YiiT5DmPR9Uibd1	lIzkE9oWgPMw1BE	Manvill Styles Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZNkyUTFXWjpernR	lIzkE9oWgPMw1BE	Samad Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kmfVhxrUD4lIB0Z	lIzkE9oWgPMw1BE	Shams Design & Marketing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PO5rDuwDLoVH9AG	lIzkE9oWgPMw1BE	Aj Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
93902pEpuiSGEUF	lIzkE9oWgPMw1BE	Lucky Star Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o2Z9LggGbxtlLLK	lIzkE9oWgPMw1BE	Astro Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ww0oMpwyyGqMQlp	lIzkE9oWgPMw1BE	Athens Design Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AtGi3X0lNao4SZR	lIzkE9oWgPMw1BE	Bangla Poshak Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZZdBWkhyHcjiQWv	lIzkE9oWgPMw1BE	Banika Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9ubdOUawNGT3zF2	lIzkE9oWgPMw1BE	Bonami Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Yay99X9dYrH7OdG	lIzkE9oWgPMw1BE	Century Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rgi80VozCGbyLe9	lIzkE9oWgPMw1BE	Fashion Tex	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WFsQrZLQY5BesKC	lIzkE9oWgPMw1BE	Harrods Knit Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YftsQBZP2EzoHZD	lIzkE9oWgPMw1BE	Gds International Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3INK1Yjx9I7tP7U	lIzkE9oWgPMw1BE	Grameen Fabrics & Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
70SduzWMH7mHtZQ	lIzkE9oWgPMw1BE	Honeywell Garments Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
l4LVZ22ippk2YTs	lIzkE9oWgPMw1BE	Hrm Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UeXRSb92KRJ9IjV	lIzkE9oWgPMw1BE	Ifs Texwear ( Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ErsYjHvL7SFtqZT	lIzkE9oWgPMw1BE	Esquire Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Lvi4Z3GFNPNewEj	lIzkE9oWgPMw1BE	Fujl Knitwears Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Pw7KXdmgQTgkMkx	lIzkE9oWgPMw1BE	N.A.Z Bangladesh Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EZFd2jUUIhSekpz	lIzkE9oWgPMw1BE	Jokky Garments	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hDMHDr1YSO7h9kT	lIzkE9oWgPMw1BE	K.C Bottom & Shirt Wear Company	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fKTMonEwOwt1akp	lIzkE9oWgPMw1BE	Nipa Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VWqcRIFvKV1j27I	lIzkE9oWgPMw1BE	Muazuddin Textile Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9u5BQ9OQqpCcGuy	lIzkE9oWgPMw1BE	Lumen Textite Mills Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZTz1LwN8Pi6QbCJ	lIzkE9oWgPMw1BE	Martin Knitwear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zvzAFmTy2eMoDgs	lIzkE9oWgPMw1BE	Meek Sweater & Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xZlmAfmm5lrh5Qq	lIzkE9oWgPMw1BE	Microtex Design	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sgEQMB1CjK2O2pM	lIzkE9oWgPMw1BE	Sinha Knit Industries Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oUPyxofTHW66UbU	lIzkE9oWgPMw1BE	Fardar Fashions Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zLtPho7yGjuOTFh	lIzkE9oWgPMw1BE	Multitech Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MoekKVGO3VHjlB3	lIzkE9oWgPMw1BE	Natural Denim	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OR6p1m6iMEFJyXE	lIzkE9oWgPMw1BE	Nexus Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9FpQpeZvryNzXO5	lIzkE9oWgPMw1BE	Olympic Fashion Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TLcvZbmAOfWqUWs	lIzkE9oWgPMw1BE	Prime Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aKeM1Pm4ZPAtieA	lIzkE9oWgPMw1BE	Reliant Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VIyRS576eMHQp92	lIzkE9oWgPMw1BE	Ricowell Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C6Pt9i5yqGg2UTu	lIzkE9oWgPMw1BE	Sisal Composite	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rbwLIup8ioQ0Cu3	lIzkE9oWgPMw1BE	Sms Mode Lid	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XMKDxMMV40piIHQ	lIzkE9oWgPMw1BE	Sparkle Knit Composite Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cPSKd4jfosYdkfK	lIzkE9oWgPMw1BE	Spider Group	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FHb40UyH9sJ2JIR	lIzkE9oWgPMw1BE	Srp Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2b1YFAZXLF4RV8a	lIzkE9oWgPMw1BE	Starlight Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YSVCE8qPVcDVctT	lIzkE9oWgPMw1BE	Texland Bd	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qukc2txeBvyk29R	lIzkE9oWgPMw1BE	West Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SsU1CoGwegJzxFP	lIzkE9oWgPMw1BE	Aman Knittins Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gpM3GtxxLT1xxQG	lIzkE9oWgPMw1BE	Daeyu Bangladesh Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cFacuanSpWW5zZ7	lIzkE9oWgPMw1BE	Fordart Investment Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yRnGH3dDnIVUzzX	lIzkE9oWgPMw1BE	Lariz Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sOgdmAJ21s8N5xj	lIzkE9oWgPMw1BE	4A Yarn Dyeing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KV8Oh9CIG4C3kBi	lIzkE9oWgPMw1BE	A Plus Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xOdYY5L1q95OqyZ	lIzkE9oWgPMw1BE	Aboni Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rM0TgqopTEII2vC	lIzkE9oWgPMw1BE	Akh Stitch Art Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6JT6hBfKTPtbgps	lIzkE9oWgPMw1BE	Alif Casual Wear Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BJNdBq7FwkqwaGL	lIzkE9oWgPMw1BE	Body Fashion Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
whqI1JJb989CVy7	lIzkE9oWgPMw1BE	Fashion And Sourcing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ucGoPOYbjpXKYOo	lIzkE9oWgPMw1BE	Fci Bd Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tkOmQqet4VwO1E5	lIzkE9oWgPMw1BE	Good Rich Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gpUNkmDS7DsOZZJ	lIzkE9oWgPMw1BE	Hera Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mo9lZDazea8NusZ	lIzkE9oWgPMw1BE	Honeywell Garments Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PVMWZP6HpvbI8xr	lIzkE9oWgPMw1BE	Jazz Sweaters Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yallrmiRi7KvxGI	lIzkE9oWgPMw1BE	Modele De Capital Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S5lj8wcgzSn9GGy	lIzkE9oWgPMw1BE	Mom Jacquard & Sewing	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0zf3HDOTzqN433j	lIzkE9oWgPMw1BE	Ocean Sweater Ind:(Pvt) Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dtDNYVwmaHfvXiq	lIzkE9oWgPMw1BE	S.S. Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MKvC7SBSJfXvyj0	lIzkE9oWgPMw1BE	Siatex Bd Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TJlW6p7BkdQhRVc	lIzkE9oWgPMw1BE	Silken Sewing Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cCtkSjPXJlWbLQh	lIzkE9oWgPMw1BE	Smile Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
j7FBnU2NGdcT5xS	lIzkE9oWgPMw1BE	Sonia & Sweater Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fCmpvqRfAt5wcgT	lIzkE9oWgPMw1BE	Southend Sweater Co. Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3eF0o7cGpi3xLz4	lIzkE9oWgPMw1BE	Temakaw Fashion	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WUlUKUAa8Jkmq4M	lIzkE9oWgPMw1BE	Unicorn Trade International	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
H0HLVKiArBpFPKo	lIzkE9oWgPMw1BE	Valmont Sweater Limited	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fdC6iLEMYhzuiMM	lIzkE9oWgPMw1BE	Wasfyia Apparels Ltd.	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MTwq9jsbEqKbiwi	30dE6BPRDlMZdH1	MODATEX KNITWEAR LTD	01711991737	MOMTAZ UDDIN COMPLEX, MALEKER BARI, MAIN ROAD, GAZIPUR	2024-09-15 22:52:26	2024-09-15 23:12:21	igD0v9DIJQhJeet	
UC79MlVE4ldmtQZ	pT0ZnIQmFJNRAGV	OISHI DESIGNS LTD	\N	2/1, MATBOR BARI ROAD, FAKIR MARKET, BORO DAWRA, TONGI, GAZIPUR, BANGLADESH.	2024-09-28 11:21:24	\N	IMPhbfmV3GUYSpi	
6ioTDU2V2na1LJd	fQqSH3VZKVnj76t	MEDLAR APPARELS  LTD.	01973438783	EAST- NARSHINDIPUR, UNION- YEARPUR, ASHULIA, SAVAR, DHAKA	2024-09-28 11:38:33	\N	IMPhbfmV3GUYSpi	
27NxYXhxPkCkkd3	pEEyMfqD2eryNQn	Islam Knit Designs Ltd.	\N	JARUN ROAD, KONABARI, GAZIPUR	2024-09-28 12:02:19	\N	IMPhbfmV3GUYSpi	
Yl6pwEneD6fNbU5	eXyKTz14pVabEKy	BARNALI TEXTILE & PRINTING IND. LTD.	01788898563	285,(147/3 NEW),HAZARIBAG, GODNAIL,NARAYANGANJ-1432\nBANGLADESH	2024-09-28 12:06:22	\N	IMPhbfmV3GUYSpi	
aCHVqkHoMwCcaKH	y07iHMbYYWoDfpA	DVL URBAN TRADE	01729392007	23 SM MOZAMMEL HAQUE PLAZA,CHAIRMNN BARI, DOKHIN KHAN DHAKA-1230.	2024-09-28 12:09:27	\N	IMPhbfmV3GUYSpi	
olLlDeUam4vtMVk	85i2MRvHJlNuR9Y	ARMOUR GARMENTS LTD	880241020100115	380/13/1, East Rampura, \nDhaka-1219, Bangladesh \nBIN:0021323760202	2024-09-28 12:17:39	\N	IMPhbfmV3GUYSpi	
G5LjtVhFSN28bgp	YfC7VmVX9eHeR89	E H FABRICS  LTD	01788898563	221-225 , SATAISH  ROAD, KHORTOIL, GAZIPURA, GAZIPUR	2024-09-28 12:49:20	\N	IMPhbfmV3GUYSpi	
\.


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.machine (uuid, name, is_vislon, is_metal, is_nylon, is_sewing_thread, is_bulk, is_sample, min_capacity, max_capacity, water_capacity, created_by, created_at, updated_at, remarks) FROM stdin;
XjH4UxYknUP0xhE	Machine 2	0	1	0	0	0	0	55.0000	60.0000	123.0000	igD0v9DIJQhJeet	2024-09-18 17:50:56	2024-09-18 17:51:07	sedas
eKULEZzMufiQXPT	ST-2-3	1	1	1	1	1	1	8.0000	10.0000	10.0000	igD0v9DIJQhJeet	2024-09-22 15:37:54	\N	
\.


--
-- Data for Name: marketing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marketing (uuid, name, short_name, user_uuid, remarks, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: merchandiser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchandiser (uuid, party_uuid, name, email, phone, address, created_at, updated_at, created_by, remarks) FROM stdin;
LDedGLTqSAipBf1	cf-daf86b3eedf1	Admin	admin@fzl.com	01589132894	Dhaka	2024-08-07 21:17:42	2024-08-07 21:33:00	\N	\N
GcoDEfQO4IrWi8w	DHzq53DhhZ1UZVP	Tanvir Ahmed Vhuiya	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eoYJ4URHFqdkhnd	Q5gRJpvOrO7DQSQ	Mr Badhon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MgpoFH4MmSjteB7	jP7ERDBHn0Qmgz4	Mr. Belal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jPnLVtumVqbWmDW	jP7ERDBHn0Qmgz4	Mr.Rashed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EADTTFEu5VxBrk1	4riLziZ2gmPL5dT	Mr.Faisal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JrJSrwflLKRuQPH	uOgGB9TPiXdafmh	Mr Ashiq	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oUgpWjrmB0rG9Mn	WQh03uqWJoXeVON	A Plus	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QXC85UEH1AbGl51	BFQV8MnZFgYqBXu	Mr.Akter	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WehpAvDQ42cQrf5	OgZ9oKwFtx8QcBW	Mr.Anam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zd7jbuIkqWCXcPF	BnwxUu8LPyH1swd	Mohsin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hIVuEhosJmeL8Gu	JvXdWthUHaYET6Q	Suman Chandra	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tXeQn4letGeTavn	QZak4FKp6Hh0pMD	Ahsan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Lz4zdzCjlWHhXRC	QZak4FKp6Hh0pMD	Md.Riadul Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
G5mv4d7YxF71NsE	QZak4FKp6Hh0pMD	Mr Habib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Q8Mv3fHP5stKvGE	QZak4FKp6Hh0pMD	Mr Jewel/Mr Mukul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JbM0nkekT62yL4I	QZak4FKp6Hh0pMD	Mr Joynul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OjKoVzyFKGjb7XN	QZak4FKp6Hh0pMD	Mr Masud Rana	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5VlnRFoZpoIfYhP	QZak4FKp6Hh0pMD	Mr Rume	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bXDrngcxGhwKR3i	QZak4FKp6Hh0pMD	Mr Zaman/Jewel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LNR3rp1uC3BHTpp	Xtcl1VHxR0Bj4xk	Zahid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ppsiYiJwEol4XSl	xXCNpbFVfwCCg9H	Sultan Mahmud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S8uuQI2RcIJUqF0	snazUjT4PzeT5AR	Hadi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jY9a2JnLkXFKf06	2l3D21fVnWp63Ir	Mr Arif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
12AgBLDcwxPmz0s	2l3D21fVnWp63Ir	Mr Repon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Fh6yaK9QMoXpPxi	5pnWpjVHc5RAJhE	Mr Maznu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9NY2eihX3TGfila	nInsSyOZ1UR2gmJ	Mr.Touhid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cXcu72O0gwTmaFk	nInsSyOZ1UR2gmJ	Shahadat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zGHjb5FjNXAWrcj	rlmCjTCnsh3ZTqg	Ctg	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
naLzhOR17Z33lFy	yqLh4shJmrtZsHX	Mr Newaz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jDIbmKL7wY9m3lL	yqLh4shJmrtZsHX	Mr Polash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4zPZKw7YcBgZ6oU	yqLh4shJmrtZsHX	Mr Rejbi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ivmxSxdwEahwCOn	Iz35L3yFBO3ZxTE	Mr Yusuf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xLE2sQnMA6Hahpb	Iz35L3yFBO3ZxTE	Mr. Maruf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2DBKUrcFA01idKj	bsJaGimPMUj837e	Shafik	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tRSQlMPK49J7TQd	mpixSqcAbUcUQ0C	Md. Washim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LhZL04DEF29L6Bx	xzxRRRB3pSpVxMw	Ashif Iqbal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7YUQR7vWKNiafNf	Ag3spQzNxm5Cvit	Mr.Abdul Kader	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nnpImA1dI80hjEL	APot0wsxte3Gh3e	Yeasir Arafat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5pn36w4gNVrVDQP	mgI0CGJvoDpE43g	Mamun Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3jzh3N2PsTQdlrz	mgI0CGJvoDpE43g	Md.Taibul Rahaman Jony	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rjbCipydPKxqkov	mgI0CGJvoDpE43g	Rayhan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
odGd6p8dft8zU6V	DQkwKkYbJESCYjz	Mr Amirul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OZmqrYS3pBtVRLI	phQyx40qY9VcF0t	H.R.Palash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IL1itTJ9QixE1HB	h6tkAYqQc3kyTPP	Md Sumon Sourov	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tlI1X1st4wndqrz	C82Op6p1bXhLChc	Saidur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aIsaPLyqDj6oSHc	E6IGDiiRytIiSl7	Mr Shaishob	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zHkefYDUXbDgppS	q6gBKkAz8V9FvVa	Safiq	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Wpqj9VcNYDf4HjI	wcNrPBgxRbOUYW2	Mr.Tushar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P0uUxntp1FuGwBQ	DdaJzJWzfvPaFsT	Mr.Al Amin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b2BgbV4IX0mP1EB	RRqlu3yBXlphksQ	Mr.Rubel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6lKFoE2VZodHPKW	s0Wz0X0OKMS7khb	Afzal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wXLp3e2EpUv8lQU	gp1wgmaUV9Xn36N	Md Eusup	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C6iyNYp4ZmGFRq7	05xoZaKBkpMLMn0	Badhon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5PCqKbplzPBFmAl	05xoZaKBkpMLMn0	Mr Sanjidur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GAuvr3iluIrxXy4	cxrmuntdxeoFBps	B.M. Tanvir Mosharaf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Q9ggPhwiwGslV6V	q7F4YxDQt5ErEzq	Mr Rayhan Chowdhury	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fniHxPa1MvONJnq	gXNHW3s4jqto7Gs	Md. Nadim Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O3xdB8uYl7utTqX	oFDHLUxoz4VtH8z	Mr Tarek	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KCNoy8pRGOwOZiB	y3QZau1wkugf5bz	Mahmood Hossain Limon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DqZfVh6mMk8Q7xJ	J0mEbcTi1XMzIWe	Mr Tuhin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dGfiZoE3q1OaJdP	eN59VazzNdln2WV	Md. Asraf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FoUBdJuqojg0euw	eN59VazzNdln2WV	Md. Rakib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mldncGYk9F9EHCc	eN59VazzNdln2WV	Md. Rasel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7Zxg9VRvyHPCWd9	eN59VazzNdln2WV	Mr Rashed Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dBOTfTseaX3OJzO	9nYOFi9gs5E8lU1	Mr Partha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v67xUhnf2XF64iI	9nYOFi9gs5E8lU1	Mr Saha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vWaji4n5OFhlCY7	NhJUvbvZe6nlDy4	Sheikh Farhad Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Y6ANrP0S8h8u9cu	CqqkYTOTP75NUTR	Mr.Ohian	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XJaJjH0V3Tw2XQZ	43lHRqmAJMMpsfR	Mr.Rashel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CXhCrEtjGdSUxCx	vFb1YNxyhAEYJt2	Mr.Mizan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P92ArChPF72oada	AP7cnehFPOBqSgm	Avik Biswas	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cr1kI60NjbPWKGT	AP7cnehFPOBqSgm	Chandan Krishna	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
G3dkdfoFT8PNeYI	AP7cnehFPOBqSgm	Mr Kamrul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UYdSdbKVky2Z2G0	yG6Tob2HUs7OGjp	Khosru	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NrOhPoXHkSFt8Bb	yG6Tob2HUs7OGjp	Saif Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A9VyphIiKgBMpC7	v441Rc92WcEgIn2	Istiaque Ahamed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o0xiWJwF3YYMzc7	v441Rc92WcEgIn2	Mr.Jibon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mgCSRSge9ohmVmW	v441Rc92WcEgIn2	Nasir Ahammed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KJ7bwYK9r1xv6Tm	W4MieZlC0i65BHM	Moktadir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aFB0xhmWbJExxQH	3waD2gCeUwVXCvL	Adnan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DcsO2edUMQ0UjtD	3waD2gCeUwVXCvL	Alim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xWxvew1myEGKKWX	3waD2gCeUwVXCvL	Azom	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O9MVAeVq4ulyHAg	3waD2gCeUwVXCvL	Mahabub	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MZ8Qg9D6cM6V3eH	3waD2gCeUwVXCvL	Nazmul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tVX18FHmiEWKUxw	3waD2gCeUwVXCvL	Rahat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xJW8pngqZ7cQvVc	3waD2gCeUwVXCvL	Rana	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lPw1Y4iDMd5oIoZ	UfZAlml30cjiZ0n	Mr Mahbub	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C2tupwOBOaXP6S2	PpUMR6D36uvtbwS	Mokarrom	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wMz1XSwarAtW7An	cvgxChqbv5whkRR	Biplob	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Hj3kS4wqd6IGrXO	eXyKTz14pVabEKy	Md.Mustafijur Rahaman Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kBtvD1y1iIkndUP	6VrYVchl4Imvvzq	Ibne Zobaer	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lDHdUo979J5Cpfm	6VrYVchl4Imvvzq	Md. Abdullah Al Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xWJJ3if2lxk05td	6VrYVchl4Imvvzq	Mr Shiful	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pg9gK73294KpWu8	BcqnFTcRDYZKmU7	Mr Mahafuz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BnnL7lBauK2woSP	wMJ9kKFkNAvGMr3	Salma	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fPpgNkeuWZo5mHE	xZdY9X7cfpPKYMn	Mr Mahady	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A4b6srquroCjQtR	xZdY9X7cfpPKYMn	Mr Parvez Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eyaAVIdFg4xcVKI	xZdY9X7cfpPKYMn	Mr Refat Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
m70DSbQprq2s9qR	xZdY9X7cfpPKYMn	Mr Rezaul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KJSdyH8tLFQMXcG	xZdY9X7cfpPKYMn	Mr Salim Bachu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rywiJPl8h10gZa1	xZdY9X7cfpPKYMn	Mr Sazzad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2r0nVFXvsMDTRC7	xZdY9X7cfpPKYMn	Mr Sharif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iba66iJ9arhSqWm	xZdY9X7cfpPKYMn	Mrs Tamanna Jannat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Y05ZEEPgw5grt5e	xZdY9X7cfpPKYMn	Sharif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fCRf1KedAaGPGU6	6gPWC3aBt4VRTjx	Md.Jaynul Abedin Nannu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rBuzNaWwy32qcCY	6gPWC3aBt4VRTjx	Mr Azhar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eAmmRclfyGkCpKz	6gPWC3aBt4VRTjx	Sohel Rana	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
f1LoZN3HtGZSTCR	58cQSrntnJyeoUY	Mizan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v3I340VMQjLpPSt	XsKxzQGewGdw3eN	Jamil	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
go4veVfJDTRGMpE	BoN7qhmJUPXNkHF	Mr Arham	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ef4hysvI3QRn5Dv	BoN7qhmJUPXNkHF	Mr Sayeed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
syd3nuOlUIojogQ	BoN7qhmJUPXNkHF	Sanjoy Karmakar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ccb90vFOr9MKMmf	zxNReWSx8yAu5mP	Selim Newaz Mridul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
atQ2IB1ukO9NXRB	BTHuthV4c5PtpLG	Md.Razu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ii14rPsV79sksxE	KjyjhSYaEZeepNf	Mr Masum	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fXREjAHYoQCjb4Z	KjyjhSYaEZeepNf	Mr Mizanur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fL83WCJMse019FU	KjyjhSYaEZeepNf	Mr Mubarak	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6xbUYIvhXKWopri	WaAvgQvMF70bZ5o	Mr.Nahid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fHUMc51gvHFruK4	xgkxv5H0cmulZoj	Md. Atiqur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
a4an9fxfRFoMnVe	wYhU2J4iYFknFKf	Maruf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Fi6WOBpPwlEAGsH	ac57YehBrPqXQDV	Afif Tanjil Galib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VOeG1IDBPEBnSjv	aCjCekpJOycL0ZJ	Sazzad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ONSNZgTIf91cwtY	amGHwc1TyXxygxF	Mr Saiful Babu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2uGSsnbH2YlHrQv	raxm4fcywmrCwrw	Ms.Pervin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mbsob6Q3URYXYdO	wmjATg2IeTOivGh	Mr Faisal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4PFpleLmy3KytZY	eHcwSXQ2QwySm3S	Mr Mahbub Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lVst4rpQziZ0ijd	30dE6BPRDlMZdH1	Md Moniruzzaman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
M8Z5gYYL1gG6OAy	30dE6BPRDlMZdH1	Mr Ataur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1YUpntLC3wGMI0z	30dE6BPRDlMZdH1	Mr Jewel/Mr Masud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NLQBXHcP3m8PGgG	dTudLcnMfpigLqa	Kabir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
18EVozY21BBGtZP	dTudLcnMfpigLqa	Rajjak/Asif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lCXtoMn5HzX1UA6	dTudLcnMfpigLqa	Rajjak/Sirajul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3KRfo3wNsUyJd8S	dTudLcnMfpigLqa	Sirajul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Kayqrtq4flhPr3h	U3Hdtn24FrmHmWy	Sumon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pFsimMCA28fHEMj	7amlwAe5evpbknp	Majharul Islam Chowdhury	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3yM7F4qLF2AFeb9	zOs1sj66ACkjAO0	Mr.Liton	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C9ohIia72LmW3y3	yMIx7mjhBBygg7H	Mr. Shoyeb	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fCP8uWBm0EMJKcf	icbUSAcrPthiASx	Shahnawaz Zegar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KBm1voLAzkJ9kSq	5Vu2eZNw8CSjUFL	Asif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iluUUiDBY3nB3HF	5Vu2eZNw8CSjUFL	Faisal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Rbp3EqNNN9526by	5Vu2eZNw8CSjUFL	Indrajit	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9XT9NPAasI53M8Y	5Vu2eZNw8CSjUFL	Murad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HXClBecOLB1zH3x	5Vu2eZNw8CSjUFL	Zahed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BjiXZvz4Oc4uGjP	cNzVYQDRH6edmzs	Mynul Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PKAyXjqyfxyMTjc	cNzVYQDRH6edmzs	Neon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JJygJZesCM0abwa	pDvmJDzlGPKk0Tg	Mr. Shafayet	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hcHA8OHGUhIa8e2	KLv2DxBvthzf22s	Farid Hussain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uz2ry1zSh7VUpBu	hP70wqVXV3lAfyE	Mr Ibrahim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FFe6MZoqGhbzldS	RPhYBeqDKSHSFj3	Arefin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VKQfh2X2VOYmWMj	rzLFObFmTXxRXtI	Liton	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MSyknUQd0yHHvJ5	rO0aKAq5M82NuxY	Siddhartha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sMTz76MRi8lGprv	XyfdMcIZFM75Unv	Mr Biplab	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RcLXKbzid9Sjmyq	H4NIhZg6p5oi1xE	F.Hoque	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Tby1qNKwozyp5aQ	qXdtW7I4bz5vXWp	Robiul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
avxiulzPeO2sogh	PLVg7prxHh7jplP	Miraj	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e59tfhqZkzIUHha	svs9yzfrs8Hbisk	Mr Zahidul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X21bWcqfHRIHyKb	gyK7Ee0eHJkYcTD	Mahin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3tSW0RnFDZ0nIhy	FOCTUtOaR5Jur3p	Mr Bipu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3KNGE7IqieKThgT	iuUT0vARRsCX3ox	Mr. Arif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e5Ma7J54ZKu1tHr	fOuVV50gpvw3Kgn	Mr Anisur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ci8PrY6Xo7rjGYI	fOuVV50gpvw3Kgn	Mr. Zahir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E0JyythkfaS0pO9	FuLpCil8rVZ2bUb	Kazi Nahid Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9NBHsNKleXHq3Q1	FuLpCil8rVZ2bUb	Mr Shah Alom	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ViKCVkWwIyumin5	FuLpCil8rVZ2bUb	Safkat Salam Nabil	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UGElZDRQkpIeaSR	SivNVp90CMY3nHL	Mr Shohel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6aIWEqAuVECAdzM	d8qCJS7CnEzZ2zp	Azad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yyz2pxCsJX9G1BG	qa8drcPykYCWUEA	Mr Zahir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0yrjAQMTeL4kHMv	qa8drcPykYCWUEA	Ms Tonima	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P5xpO0pxXwn9v5T	y07iHMbYYWoDfpA	Arif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5EnZy8vDfNNOUrl	y07iHMbYYWoDfpA	Saiduzzaman (Babu)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oUf5z0dND3E1aEM	YHHxCX6K05uoFwC	Farzana Yeasmin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E4fdpqcQhrb7BRQ	YHHxCX6K05uoFwC	Md.Safiqul Islam (Aple)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EoJ2T5xI9capnoe	xufTiggBnrf1fkL	Mr Abir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
y7xvykvItwBv5wA	xufTiggBnrf1fkL	Mr Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wSnXC2DgFWESxGN	xufTiggBnrf1fkL	Mrs Farzana	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ducV71vY5hok0jf	yjr6yK5l8JJgxzb	Anik	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kwqeMNRcJ2wc9je	DU9yyAa3lkBVaFZ	Md Mahbub Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d7va6J2adZMNFCG	dDyPAEculX3tDrY	Arif Imroz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fXoKN5lq6KFmQh5	dDyPAEculX3tDrY	Faridul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N7F5zq2iVRoPrvL	dDyPAEculX3tDrY	Kaiume	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GaIHeO5sDmX7yTs	dDyPAEculX3tDrY	Mamun-Merchandiser	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RwLH9hZm4lLizeQ	dDyPAEculX3tDrY	Millat/Rony	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SF14cO7TvLTJLSJ	dDyPAEculX3tDrY	Minhaz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jyTkp9h7C3TBSJP	dDyPAEculX3tDrY	Minhaz / Kaium	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
keAz0vtG5HWj6jD	dDyPAEculX3tDrY	Mr Kaiume-Rnd	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7owchq98y8EK8ba	dDyPAEculX3tDrY	Mr Salam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
98CnlwkMUe3Le7s	dDyPAEculX3tDrY	Mr. Anowar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DyC751zwEIx5jJN	dDyPAEculX3tDrY	Mr. Anwar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kR8rYXbUfR2t2X4	dDyPAEculX3tDrY	Mr. Ataur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d2pmbBJQ3ndnZXN	dDyPAEculX3tDrY	Mr. Minhaj	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SS2pxpemwomX4fU	dDyPAEculX3tDrY	Nazmul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
olx6ipfQSJhHH52	OPLRCxREve3G99G	Mr Sakib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ldvF2RkXz6ALXjz	8s1chepqzuzS3hH	Habibur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XN9HM7aHM1NcVG5	jFCAg25ghRbShSd	Anis	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dYMXyFhGS3uKoYt	0yDe0GdKSV8aNNv	Mr. Kabir Ahmed.	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ynw5rSYLcjTp7sH	jnDKniD0j6dyfQF	Kishlu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bGCDuPhrEa8wz1P	nqpP7aFuSFxp5QX	Elias	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XgcB44fWGSCBs0M	GwUr7QfO4Y1UVVU	\r\nShahnoor Parvez	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BRLkDpafQCZSO3n	XyK0JXTzLPZVaEW	Nihaz/Hrishikesh	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oEWj8Zk5zTkKMIb	XyK0JXTzLPZVaEW	Nur Shamim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FqjPXBq9msXe0YI	XyK0JXTzLPZVaEW	Shahnoor Parvez	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nPZwH16nAZFsyUs	SEmCPxdbyf2yj78	Mr. Siddique	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A7TCkuHp6xX6Z7T	3D5BAdneNUv820M	Md.Abul Kalam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CrmWa8K83GsDCrj	ZzwiUWua62ivBQj	Mr Ismail	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XlGAEcnaIxaccHI	5uhhj0xsdfNGDMM	Mr Al Amin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lh95XGZ85KVyr5P	QyzjLVoIFMpGndq	Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qSMntIqiqXy2p2t	pmvnrDsU7yTtc3S	Mahmudur Rahman Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SZipu9nNdkGzTWW	O5tSc2pqKsPvc6a	Al Helal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oTS1R3gKBmffHCC	O5tSc2pqKsPvc6a	Mr Hafizur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b7u6iXpaYM55dSo	FnEopxvZyjqW3KA	Mr.Sourav	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FQgcSf5lthXqQtL	uzskMuPCDRQZVYI	Mahmudul Hassan Romel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dH5FVL2c2wRrsao	uzskMuPCDRQZVYI	Md. Rakibul Islam(Rakib)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X1Y6MUDwDIatrBn	uzskMuPCDRQZVYI	Shamim-Tex	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RWrO867vD6kPbCk	IZmZahbRsVTMQrJ	Hamiduzzaman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eIFRcYwEw8TGMte	8EqGdEi3aBbGRMJ	Ashikur Rahman Chowdhury	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BKylj6OzdzSKhGz	8EqGdEi3aBbGRMJ	M.A.Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UCczQmDmPZhw1nw	8EqGdEi3aBbGRMJ	Mr Ashikur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QTmSGCFkBipXKXR	8EqGdEi3aBbGRMJ	Mr Kamrul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lCYQrL8N3oYLu3w	8EqGdEi3aBbGRMJ	Mr Nabid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZyuAZAboPmGogrY	8EqGdEi3aBbGRMJ	Mr Sadiq	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KJNNnq8OaqeBkcl	8EqGdEi3aBbGRMJ	Mr Sumon Kumar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
w0wEx8SH63YiybM	8EqGdEi3aBbGRMJ	Sabrina	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zXfyCjNkI83ay2U	8EqGdEi3aBbGRMJ	Seuly Akter	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jXnW1Q7FEqJSS4C	3mAG9y88faj69BR	Mr Mizan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6RpDweEPurJZHxO	N8jt44RKueiEXc5	Jaglul Haider Jemi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Uf2AUURv41HGN97	N8jt44RKueiEXc5	Milu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ET258lIiFS49uTU	N8jt44RKueiEXc5	Mostafa	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
n0oIg4XaCUe8HAj	N8jt44RKueiEXc5	Pranesh	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AILLbqRtsLHy8ZE	UprNsYNzA59Agp0	Asad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Zeu8nIVCvaaIDiV	0jR311J2cpi5AIJ	Mr Asad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PKePm9PF3HqlLQG	0jR311J2cpi5AIJ	Mr Bashar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
j1xpu8759mOYvQX	0jR311J2cpi5AIJ	Mr Heron	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LPA6xTPeOmT5ngS	0jR311J2cpi5AIJ	Mr Mamun/Mr Abir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JRSVOcmFMVXsKx0	0jR311J2cpi5AIJ	Mr Nipun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1ta3XjQ9wxcdPgS	0jR311J2cpi5AIJ	Mr Sohag	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BYvbdt9safJXndH	0jR311J2cpi5AIJ	Tanjila Akter	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BeIoRyvKWVl5XA1	CqUGI2OeSbsFTO6	Shipon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mLQA02TTiXHuRWc	lrpKBOpw0dmKkfG	Aminul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ciyn72BtGYVNg76	hBDKLR6bbRCpyKn	Md.Aminur Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5U0uQAxwYI8wZsA	35PoCTL3qhcW6p0	Mr Tareq	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EH37aTGp8sq72UI	FnsMg4jSQTFWA4x	Shahadet	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BvPUKBRI3Zu0c9Q	TokHusA6w0pjZ4A	Mr.Rokibul Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
78L7wEE4fV2XrH3	ypAlAM3o3Cu35us	Abdullah Al Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fGXH4kxGQP1ZIIo	WyOsIrRu69N35oU	Mr Asif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iIfC9bs5WMLhloh	YT2lCk9CEiJ6llp	Mr Sirajum Monir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ltRZJ5jsNnpJdIm	vpAOlvFUfmC65Fd	Mohammad Noman Mazumder	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jl75jPS20J8P5qa	gUBfmxMjMIWhYoD	Atiar Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cDItGtHyHF3sDK1	GWAXnKQg8ptXA0s	Md. Ruhul Amin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Bv9tEkAh2RdGEzO	aFB73ULL8hxtjlZ	Mir Koishor	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Yi1GrdKs2GgbrzH	EyTFWjOc5EfngOX	Mr Aman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eZ4gnVOjGj3KJ9t	EyTFWjOc5EfngOX	Nazmul Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
58TWnozJSuLlWl7	EyTFWjOc5EfngOX	Tabassum-Seowan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
x8Mgk5eaHCALPcg	HIg2ZMNAxFqpa7i	Shaikh  Moinur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pbllXoaVFhIFnre	80ZhXvC4urFVQ2w	Nayeem	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Np2BkmprEI701zr	A57wxiclob0ekDD	Al-Amin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gGbDiPE3B8p0BB9	14F57KyQ6mEfcbo	Mr Kowshik Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
V5VTEoqWaQuPKcq	TTwbYHQVejJ5eMy	Jakir Hossain Rubel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
82ieN7PJIRzKbd0	6UVCEmKKJ6j5BPJ	Mr Alamgir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LmQ4bof0p5ni9PO	WbXaAuFtEZV4su2	Md Nizam Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xeJSUpuUvDAYvwM	YfC7VmVX9eHeR89	Mr. Rubel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uhwETQWu35V7JYo	BgEBVuDI5CvU5HB	Aminur Chowdhury Amin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o5VODGHPJ8OyM8P	HTSoQrbAiFtSEn8	Mr Manjur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7kM2CMTYOFUNbIm	GVbbxtdgPFyLToR	Shakil Mahmud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SJY7xTzgzNLH0U6	F0MvU6ftb1Cu6bc	Sakil Mahmud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hUfLECOcnrJdTeG	ecdpCimdya8Wyxc	Mr Nayan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IiCehbX3ir0leTV	8qFhURweJ7NNRAT	Rezaul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C1HrQv4eQuR0QIm	DFqfFYQsqHVZgVD	Md. Nazmul Haque Bappy.	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zrppS88Wj4o3WrO	wgrE8vhtFs0ChME	Mr.Enamul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PFOz6x3VYtwsVZW	kF5Bl8Gf3LzvO7i	Anisur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kkWMPqJr2jKvzMU	kF5Bl8Gf3LzvO7i	Mr.Kader	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2lxGn6D3Jbw9IzF	kF5Bl8Gf3LzvO7i	Pavel Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HkfBJyXS0ps09yh	MEhVmE74Lvl7Hue	Md Rafi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9ONR1am0yqOVddV	8QvKOIkFWSoeKN7	Nahid Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HpLqmn8UqqqEgil	BgnGFX2yzZwEq4B	Mr.Badhon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
H8oRVKlQ8om06sG	UddZnH65RJrVLLU	Mr.Shariful	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EJZiRJ8xI2G6vJR	RULg8C8kTH0s0Yg	Mr Asraf Ali	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wcvQbVE8VKojNRA	eHGNhIRRaCiUfJl	Kawsar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d9DaJvLuEheQuda	mTFISFfiGeg4x2S	Mr Rasel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ASvICR7cfW8NLeP	B5fkHK8mxNLMuea	Mdohian Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tEfYhrXn6iWFGYD	B5fkHK8mxNLMuea	Rakib Hassan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ce1oLDxYfZDAlbo	PT5HdhIhcDYahiX	Md.Asaduzzaman Azad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LWQcMoeigZslmpl	13uGFigbtVfdoui	Lalon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lpxUeoxdvftw1w8	13uGFigbtVfdoui	Mahbub Alom	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BOM8GAGj7Z4FpQY	13uGFigbtVfdoui	Md. Al-Amin Hossain Lalon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1ZKoDCkfuLOuisF	13uGFigbtVfdoui	Md. Farid Ahmed Raju	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cUDoGEQJT8A4rgh	13uGFigbtVfdoui	Md. Rashedul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QsZMelNsI5rxWXq	13uGFigbtVfdoui	Mizanur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5xCSLqJklR4eTRb	13uGFigbtVfdoui	Mr.Ashraf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fyfzu5fmZ5PFi4M	13uGFigbtVfdoui	Mr.Kamrul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8GpUlxshA9zWjPO	13uGFigbtVfdoui	Mr.Tofaiel Ahammed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IjN3OyLBN08sRIo	13uGFigbtVfdoui	Rafiqul Islam Manna	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RRmXsHiCpDXPP9o	13uGFigbtVfdoui	Rustam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Nuz2rKd64PIp5pT	13uGFigbtVfdoui	Zahedul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
059bhuHIR99NaTs	86QHpcOl9b0TyQ8	Cash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BAF9cjeM5Edp4Vu	YsPgMQKYf8o7NJw	Mr Masud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZPdnknMRmOu8eAx	ndqcQHRMlqGgMZD	Rasel Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fI6uDikIhrdFvrd	e9bDS4lPJozv48Q	Nahid Uddin Shaikh	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
88xRzVKR1MXp6rj	METWERW53GQMpl2	M. G. Sarwar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZJRLhczoRTo4PbP	METWERW53GQMpl2	Nizam Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ST2MQNjBgqJCV1x	qL1rYzbnUMtOq7H	Ariful Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JLThZhdI1XO1WRI	Dm9XKkD0FURDZVz	Mr.Afzal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iIik2kr7dyrek0j	REkey8PwhvzU6tI	Zia	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uEncJWhYZnLfLWP	9LVsK8S2oKwRCRc	Mr. Niaz Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VAKzWucleFlCqR3	uZHzHb4a4eu8PbK	Mr Anis	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HhAVLaZlcb5VFKJ	X9lvhg10tYHoakf	Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Vkc2DyG8JffSsAO	22ZfercsWkBjdMo	Khairuzzaman Roman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gml75xV9YPEX7SJ	VXDWHkKfxmKsIkz	Ashis Biswas	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4WZAiAtZXITvgOJ	5XKyt92YQgWZ8wX	Mk Arman Mollik	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
teVdi1pYfn564qB	VQLtYhQxJL9R39u	Mr Alif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SgXyI4gRjT9D98d	UV2ZmDA6h6sw7I3	Mr Nazmul Hoq	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AoZOKPcbmbKW6iU	Wjy3AhDYlW5fnTw	Foysal Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
t3lFuiHP6NQbjkb	O8YHtk9BIXAP4Ul	Mr Abdullah	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Avh1FqtAC3KYOcH	O8YHtk9BIXAP4Ul	Mr Hridom	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VBLC86sa78RhWKt	O8YHtk9BIXAP4Ul	Mr Mamun Mia	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7VLXjQtoVS7rtET	O8YHtk9BIXAP4Ul	Mr Rana Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Tw8BpRMLiM6gKlL	O8YHtk9BIXAP4Ul	Nur Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
04tD0Bforq1fthT	eTBpcQ8Zh69dbaF	Infashion Gopi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
y3fwevqvoYaWG8H	mwUOfoSbV6zrfj4	Mr Hanif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VHzsJ2I0aLK7wdJ	qRfLheZ1CZYdMqu	Mohammad Abdul Motin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FmNs39NlE8gSPa3	paSsCfikiNnOh72	Mr Lemon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5gKqX3a9bC7y5a1	bMJflJU7FxEET31	Hira	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Phfx7BYxJuqr3ST	emHgKnGxqBMAnNs	Mr Zahid Hossan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MCvZEPjBV9nvL7M	lIzkE9oWgPMw1BE	Md Nasir Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
St58o8d4P27f1Ku	lIzkE9oWgPMw1BE	Mr Shoaeb	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EE0UlfERvbgGXp2	U6clpZmaotBtYjd	Mr.Ashim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rAKuj2iT9hwErXa	IEY7EECFKiR1Bzp	Idris	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uydyyuozzeuApkW	v5JYiWjZXokWNHg	Ahsan Kabir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oti63TlrNu5YlLn	Fg1BvGvcmXZPnRx	Md. Ali Zubayer	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NEX3k7oU5LRbX33	X6i26aPLXhaZY9t	Mainul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gIhAd1LYhsFTlai	pIUCPMdfsfBYUWG	Mr Ikram	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SmzkazVKc5M6MM4	JHVxIpFS62zSIYZ	Mahadi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4JaxdH4uD1owoSo	t1rxpSyPKhnEwcY	Biplob Rahman (Director)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kdsebBcsY4AgyyI	KATSNy6177jIlGm	Mr Ashadur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OUA3zBmV64RR6TG	GTIuWHqdbZBXF9m	Mr Ahmed Raju/Shahed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dJKg6xOpGD7ENuZ	GTIuWHqdbZBXF9m	Mr.Raju	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dwTw1IXAPWoX68n	GTIuWHqdbZBXF9m	Sahbaj Sahriar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Nsys26n4jQhUYkx	GTIuWHqdbZBXF9m	Shahed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mobf8bXT6gpgE9V	GTIuWHqdbZBXF9m	Tuhin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sza73jX38Z4yb11	VgKXdGtAQq42Q3j	Md Roman Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3P8ttT4k37yyPQE	VgKXdGtAQq42Q3j	Md.Kamrul Hasan (Pappu)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EVqLcypCkmyISV4	VgKXdGtAQq42Q3j	Mehedi Hasan Naim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dfavldaBPA3NUuS	VgKXdGtAQq42Q3j	Mr.Masum	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XBopZ6VRw3BbeRI	n3zq1SBKumt01KD	Abdul Kader	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QgyUptaPmJ9ahoO	n3zq1SBKumt01KD	Faruk	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NMgG1cDWApEuWVq	n3zq1SBKumt01KD	Mejbaul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NU3En6mkhuuOLMT	n3zq1SBKumt01KD	Mr.Anwar Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ikvojz7OHQ3baOo	n3zq1SBKumt01KD	Shakib Hasan Omi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DeUrZS2w5KLpSIY	eLBT0CDg5vHa8mx	Mahfuz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3bpsrXWLyjJk8hk	Pzvpvi0K0jNlqjD	Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
w9Fryz66uGmCNP7	B5bUi7jtJ4zh2pd	Mr Jahid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NwT6iLBscbSiGB3	zrT5MUJSDZMGju9	Mr Rakib Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JI7RGeR8qWEZdmK	5fg8kgF9uabde7z	Al Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eJ6mgASRNvlIHuv	5fg8kgF9uabde7z	Dulal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rQXNn3rv7uEa1JZ	5fg8kgF9uabde7z	Jahid Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
r7RRN8gNHZ8c0bc	5fg8kgF9uabde7z	Masud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
K3GUKn47xTrMnIZ	5fg8kgF9uabde7z	Masud Rana	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vI9fmRk40TszNYF	5fg8kgF9uabde7z	Md Anisur Rahman Anis	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XTtoadaFRet06Dt	5fg8kgF9uabde7z	Md Arifuzzaman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Z3jLCHVxC9IvEDo	5fg8kgF9uabde7z	Md. Abu Talha Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zaoRRIoacfJwy3l	5fg8kgF9uabde7z	Mr Roni	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tWjKKmTO2Cf0ylM	5fg8kgF9uabde7z	Mr.Batchu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0KGGXvP0BjcfTeC	5fg8kgF9uabde7z	Mr.Jewel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
g6VLGCeDmx6kPbS	5fg8kgF9uabde7z	Mr.Seraj	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b5SFZV2dUjARXgE	5fg8kgF9uabde7z	Mr.Talha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
svICoT88Eoonu7S	5fg8kgF9uabde7z	Piash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xhPCb6bZBwmiNP7	5fg8kgF9uabde7z	Rubel Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2cqHG7hWkT69g0A	5fg8kgF9uabde7z	Shohag Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
799iyNx3ZiyeBne	Zk387IomyNW6MsV	Md. Muhibbullah	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9AsYbVqLGKQCt6p	RZHxkwWwf4e87om	Mr Golam Kibria	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nLepLzPNhYGaBKQ	RZHxkwWwf4e87om	Mr Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7d2HJF3gISsJ0a7	iJjIIFXgO7optyo	Md Mahbubul Ashraf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SBG4LK0kifmxdMY	50M5Jdhxm3KUR4b	Mr Rishad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sjND6pWUrx9Yybi	50M5Jdhxm3KUR4b	Mr.Mehedi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AOQFB37TR8d4967	Vd5d85qq6pBd3YJ	Abdur Rashid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o2sLZc6HfUr7jWL	Vd5d85qq6pBd3YJ	Ahmed Ali (Sohail)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
esZd5x4elvLHRH6	Vd5d85qq6pBd3YJ	Ahmed Ali Sohali	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SFz74nSM38HLrCZ	Vd5d85qq6pBd3YJ	Manju Ali Mia	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8G7J47CkOST6nLL	Vd5d85qq6pBd3YJ	Md Jahedul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
p0Jdd8Ug3SFZUeQ	Vd5d85qq6pBd3YJ	Md. Shahin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8N37mUtQLnd4lz6	Vd5d85qq6pBd3YJ	Monju	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cCaHas7GlRPcoYg	Vd5d85qq6pBd3YJ	Rabbiul Islam Tamal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
an9ak6zR5NgMsyY	Vd5d85qq6pBd3YJ	Sahe Alam Mithu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
APxIMobaNasxz48	Vd5d85qq6pBd3YJ	Sujon Mahmud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
q5CUJNlONHblrwS	Vd5d85qq6pBd3YJ	Zane Alam Titu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WjiyNP7kfSfOF8g	dsqy7TKZvdnTd2o	Mr Bashar Shahed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tKThOQHVsTkKjRI	9AvE8H5Jfx8wK7l	Shahin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eCj3Jm2lYiqtRZZ	RvqUQB8k12GWhLI	Md Jewel Sikder	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0yOnxgHxyqUUxjP	5Mc4KKXs6pLo6kJ	Mr.Salim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WIpGOd7AejN4yUL	5Mc4KKXs6pLo6kJ	Shakil	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N3oCNpjPM2j8yyA	AJCZj7BYB4q43Pz	Md. Saiful Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mf2fcfFD2KaMxmO	AJCZj7BYB4q43Pz	Mr.Piyash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dchSezp03SqlvrS	E9GFwljFmJs9biS	Rabby	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
T5zWgbYi41J43Eg	nq9uw4frD5INyFz	Jiayul Haque	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JLeA1AQUi0kh12s	nq9uw4frD5INyFz	Md Salauddin Kabir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hvFyvLiBAiS3spA	1t9j7coCPXJmIzc	Mainuddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
INUaNiwXViIVOkq	aCuY5yYQHHZ668O	Afjal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gnQayu8SgxOLmUL	8eDO0en7J25ROKj	Md.Faruk Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fKw6FfGNa35Veeo	WjKqwwbThHIt4eB	Md. Inzamam Sadi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ALEQ7MTtHcWw3ix	Qt3OFZ5JWlgBR1w	Mr Jubaer Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wj5xQeAGBgbgljI	uOpeGVudUhbZasm	Md. Asad Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SQJsEMEOHUnK2B6	uOpeGVudUhbZasm	Md. Mustakim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vPRYtdKjSpWyt4h	uOpeGVudUhbZasm	Md. Shahin Mia	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oMGsBXwBh67L4R7	uOpeGVudUhbZasm	Md.Monirul Islam (Monir)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tqBOFlCHOSQQJN3	uOpeGVudUhbZasm	Nilima Azad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DB5lk4lRbvDe9zL	uOpeGVudUhbZasm	Noman Al Mahm	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VcCmuY3lmeeZxfG	uOpeGVudUhbZasm	Salauddin Kader	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
c7OWJJuY0d4xUN6	uOpeGVudUhbZasm	Sharif Sikder	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lkydb6GWyJU8Fra	c19x0RBslgWa6w2	Chittagong	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1q3tpB2uhGuDXBc	PHfK6MgYHRuOres	Tanzid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NSB9Rfitxv07gRV	GVjU45EUSffkk7p	Mr Abir Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bnpAN7QO5rnJRit	w6Wa9EryHF95SYO	Md.Anwarul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jVFtG2LiMik7oae	26CwF06Tm6uFeOx	Proshanto Kumar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HTAT8mpdWv27P8e	OeTt5rhZZ4ZeEWo	Md.Mohiuddin Titu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PVwguo37kr8save	k82uRG7ddFCUvLV	Nadim Mahmud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oPRu9onXa5NhOAt	k82uRG7ddFCUvLV	Noushad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BOkzFVfnybSUCXV	nzid5Tq1UHjuTPU	Ismail	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SLAPVa1Ul7J1M6E	nzid5Tq1UHjuTPU	Rajib Das	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rSdhIXUPNJWB3zT	KdtePvaYpnlfDnQ	Mohammed Ismail	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oYQVg5t0QCIbIw4	EMryfkCwah46brO	Helal Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CjD17s7PSM0pXkZ	EMryfkCwah46brO	Mr Rifat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IRN2Meu6gNd1tHB	EMryfkCwah46brO	Sharjah Mohammad Saif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Gor3aQymregWgvE	cNwXUhX7E4BDA3x	Mahfuz Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JtZ4zJwd3n4IRWq	cNwXUhX7E4BDA3x	Mr Anwar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CEnrItyKWBTMbcu	cNwXUhX7E4BDA3x	Raushon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GsekNPxxW6EbB4n	cNwXUhX7E4BDA3x	Saifur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iKqE2qkbBbVRwNW	cNwXUhX7E4BDA3x	Sanjoy	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IrjsVTWlPlgkEuZ	6rO0MJH5L2OWGxb	Shohid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LRdEoCwmjjGDeVr	7cfLc8ce0DxhKUR	Mr.Monir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9NtjZw5i3O24t9g	7cfLc8ce0DxhKUR	Rakib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hNsWuxUaJ6bc0Is	7cfLc8ce0DxhKUR	Shakib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TZzU2xinEwkJ5rL	7cfLc8ce0DxhKUR	Shoriful Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ykpTnZ8kPpSESGX	bXYXSD3Dgl8FFCh	Mr Mannan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gN9GLWtVSJo9WE7	oSmuQSOfrcgAY0y	Kibria	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6hzamUd4A3u1ozF	2KuBQz1n6TyeDEB	Mizanur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FKJtKhGJkCTtslF	S7mGdadVyPU4Ixd	Md Sohaibe Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iwagoRkoSRAnUU6	z0Wmo5ibFzgwHho	Sanu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
akofqID2f5gZfGr	eUlMGCmxGY39Cw1	Md.  Somon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sjWczblGa6F36I5	LrwLstD2opPehNF	Azim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e2wV0RyNKwvrjhq	LrwLstD2opPehNF	Nazmon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
40z5dZ8ACMkr0fW	LrwLstD2opPehNF	Robin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sOYGnvhEWWUbQD7	QxAWvOLsKeYA4dm	Shafiqul Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7dq3e53ur759AU4	DWqK7fWgIvc0ouw	Jahid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TcpIulFbZRJatBp	DWqK7fWgIvc0ouw	Jane Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xQgMCcpeYMvNyh8	DWqK7fWgIvc0ouw	Mr Ranak	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qB6A2RGNwzye8el	DWqK7fWgIvc0ouw	Sajal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YZ29xQhbmeKdWCd	DWqK7fWgIvc0ouw	Sohel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zSvsSz3tbAfAPyQ	jKy2vtX1HjYAkqn	Md Reaz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QpkFdnaOSjttSIS	jKy2vtX1HjYAkqn	Md.Shatil	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
k3ueiQrBjPROvkR	jKy2vtX1HjYAkqn	Mr.Anis	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
r5lHffARgRZWAjh	jKy2vtX1HjYAkqn	Mr.Prince	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
U8t5b4teh6V39ca	r15xecX6zjOeX9L	Md.Sumon Chandra Roy	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Mz4C8qjqUHyQrfR	Dvle0xyk3eZH9AZ	Mr.Bashir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xhzqrmVF2EFNr0p	wNvtSHSmZqWnOY0	Mr.Hannan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2zHwvOFtH88EJtq	nYztlXb4qc0QFpX	Ishtiak Nasim (Ishtiak)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8gcZTMdYY1iWmkc	bGM35IX5N5JJZTe	Pabitra Sarkar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
81APl4VjO5ONTrn	AleiBpKHH1tj7P6	Md. Shah Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E0ez7QUuDqRao1e	W4yWcvW8QXljlQF	Palash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KWxn2KEASHaefZy	gFSwbzNqDLq9STc	Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VwxVmD0DNr8Lu40	gFSwbzNqDLq9STc	Rakibul Hasan Adon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o9krXdut5aQEs57	MlYWUmD4NXvV5uL	Mr Salekin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xV7TXipmr66oAF3	07IN3fm9fXK1RoS	Moshiur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DtiaPaIKoO8hyJR	NPDeJFTdMaEySV3	Mainul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IHIEs4vT7mJnhCH	2dmWL3XUuOiQeG6	Mr. Shiplu Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jvF70vhAoRjs40d	J2fghNyEJdBad10	Farzana Akter Shoshi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cm9Q7xEczk5d9Gg	gNXcr4Mnffez0xO	Ashik Uj Zaman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
h9U8LiyGlVfYvIv	EdfNjbFBLF9y7uU	Rony	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iFfhCAc9KDSkOZA	GSWJ19IPP8jbEmF	Mr Raju	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ORtgmqah4NK2XPh	ea4vFAUGrYSyMNR	Saddam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CtxA3CWKckxqhNY	vrCodUaGin1YthQ	Magfurul Sun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yPd7AJ1F5SVMC3J	vrCodUaGin1YthQ	Nue E Alam Babu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fXZ0yw7wryfvAue	6wGrb6Qk3LPpGUO	Mr. Faruk	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o9Qd1cnxZxTyn0h	4S30GrdmCYkmv37	Mr.Mofijul Islam Riad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Z3ot6blcOgm5vb5	l2Zfz3r9Q6OdJth	Mr Jibon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1qeE2bPLsku4frR	qQfkEi6148wq6i5	Mr Bijoy	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0MiSKSqVr62UeUf	28pNrMXKawt52aU	Mr. Rubaeat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E1dR1nTSJupOLdV	GK1PVNyCATsnpY3	Iqbal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
c6wC0d6bmUvctCE	ENqyaKHtNZjvErz	Mr.Uching	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
47oijuMMQWus7St	OYAYo7mAduax5vJ	Mr Dipu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HltqRLpYjNciTGD	7lwXHl42xTFyZQ8	Mr Rakib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jIHBSqtAn3u0q5Q	SEUnQn5CoDq6s84	Mominul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
V5SjrhP4UXodcK9	SEUnQn5CoDq6s84	Mr.Sirajul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KBu0JtBx7mPhlwW	lgm7Cm2s3sUtVea	Mr Lutfor Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NZuk1zlPg0xfGrK	TmG6OJ7bKGtCuFJ	Mr. Tarek Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S0MGj7MEAx1eXLb	7n3CTdBN68pEJs1	Anup Karmakar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3dz2bTVADEjre4T	7n3CTdBN68pEJs1	Mr Mukul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2zR7mlAcAvp1170	7n3CTdBN68pEJs1	Shawon Sheikh	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QgAxell1KpShKVP	M0GIUzXoJDqw9l8	Mr Mahfuj	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MIFieCvtIPzP381	M0GIUzXoJDqw9l8	Mr. Prodeep	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
p9Y03fwlWAMdsQb	G7FezP4N1QwhhcE	Abul Kalam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Dp4DzzSqfRVxf6d	G7FezP4N1QwhhcE	Maruf Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N4HQ2A8xSEfLA0R	9yUKVSYW4b8nXpO	Mr Sohel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qYGXf2HDGBKdZPf	YNMHGpINrORxFcE	Md Robel Mia	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EElO3uzEEBo3cDd	5gyIdfHZu2F1j1Q	Mehedi Hasan Babu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RYJ7vir1y5sMSkW	5gyIdfHZu2F1j1Q	Saikot Das	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
relNiniwdm9qi7O	xrcdTeUHj0WTkpp	Md.  Nannu Sheikh	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gfP1hPv0utKvvJv	MXPpkYj28ezy7Lh	Mehedi Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X1BWADrIcqz1rqY	rQXJJyjSH4T65io	Mr. Anisur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Vxs0Zh1bIAittIi	hnYH0IYmyO3rpVa	Mr Sadad Al Ahsan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JgdLLiCoggShwUX	pHFkQuamxgpABrA	Mr Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1j7EELDcTfCITcX	gBJl1AYehr01mQ2	Ms.Choity	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4xjgkZcKgkjvEyV	eaDqP62l3FsgpGm	Md. Mohidul Islam Khandaker	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YEksYB2JcWYK5AK	K4yX7vPwoMIhvjp	Mr Rashel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GLCiUKGhdeZ7tCq	bWYn2DQrPptUv8n	Mr  Arif	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ER6zIdvCOucG0Tu	bWYn2DQrPptUv8n	Mr Jahirul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CvgWo0d5m26RJkF	bWYn2DQrPptUv8n	Mr.Musfique	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LbEkH6LQbNe3sw0	SwqEYw03Zx60bkw	Ebrahim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oFIYhpsKxVkJIAH	AWCXxXgVA1NyG5r	Mr.Borhan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MipZmo02mNwNKRn	b2dZXikhZJMft1A	Monir  Hosain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ppAUknqovwKLEM6	z8TLuRmnFnfWiB3	Md Ibrahim Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EtZo1ad6IQO6CqW	xb22WLaMEs9DDSU	Mr Elias	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
obpFsfQaIoVhjq6	xb22WLaMEs9DDSU	Mr Shafiq	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jnxQGcoTGOx3loR	5M1xIvsz6NXUQ3G	Mr. Shafaet Jamil	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yH1USXYmPJvLzZB	CSfoki8LetJ5mLt	Abdul Wadud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2YXxEbZSkXWanCL	924w3QFw3mKAnil	Rimon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
95MiEn2C9wbcvmy	4Ce5gPjQwJS4gqU	Alauddin Ahmed Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KbdKBoinaZ1zT1W	7uVotbPj3EN4s54	Shahriar Ahmed (Merchandiser)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9cP8pfpRGylvnSG	tC3y09steo3GWQK	Somor Singha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fd8rXHxwko5YjKx	61tOfMqEmVgM2Ml	Mr Sayed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
R52HsAbGq9HyNi3	9lCeojrwJFWTeXs	Abu Sayed Himel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DA5u2r2USUvf0Jv	9lCeojrwJFWTeXs	Md,Faisal Alam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YiiT5DmPR9Uibd1	9lCeojrwJFWTeXs	Riyaj	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZNkyUTFXWjpernR	zbWdwLIgbY0PO6q	Mr Hafizur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kmfVhxrUD4lIB0Z	GIJRO5dTHhgzbbP	Mr Zieo	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4zGApFD4kClUs9h	eWxE7ChzgpqXiYZ	Fahad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PO5rDuwDLoVH9AG	eWxE7ChzgpqXiYZ	Joshi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
93902pEpuiSGEUF	eWxE7ChzgpqXiYZ	Rajib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o2Z9LggGbxtlLLK	1FMvrg6UpArxDdc	Rehnuma Tanjim Habiba	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ww0oMpwyyGqMQlp	6BaZc7AUBFCX8s6	Mr Shaon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AtGi3X0lNao4SZR	nv6qDoL2ryw2BdF	Mr. Rimon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZZdBWkhyHcjiQWv	r7FazRF9zMGWB0j	Mr.Feroz Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9ubdOUawNGT3zF2	AOKg0fLWOhThiL2	Mr Motaleb	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Yay99X9dYrH7OdG	EOdf2xZT8hLkKR7	Afrina	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rgi80VozCGbyLe9	GgoysaqjQGxrEIi	Md Sabuz Miah	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WFsQrZLQY5BesKC	3dQcqLVMHbi6Hyv	Mr Mahmudul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YftsQBZP2EzoHZD	O9EVhMfutakOogB	Mr.Tutul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3INK1Yjx9I7tP7U	Jp78XlfLY4heaHH	Md. Asif Ali Zardary	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
70SduzWMH7mHtZQ	Jp78XlfLY4heaHH	Mr Mehedi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
l4LVZ22ippk2YTs	0SqAU4Ch2OhqqDB	Md Sheikh Sadi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UeXRSb92KRJ9IjV	o1q4oHMkWRd22yv	Mr Abadat Khan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ErsYjHvL7SFtqZT	o1q4oHMkWRd22yv	Mr Nahid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Lvi4Z3GFNPNewEj	tZbtNnLDuhSYXRh	Raju Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Pw7KXdmgQTgkMkx	V7oKRtggLWCjvDI	Mrs Ritu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EZFd2jUUIhSekpz	Ejxse4Cqmf6rMqM	Omar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hDMHDr1YSO7h9kT	f9QFnprGxHM7G3E	Mrs Parvin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fKTMonEwOwt1akp	U4OcEjxalt3PkwP	Nazmul Ashraf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VWqcRIFvKV1j27I	XQcjG9zgEqFZMyv	Md. Anamul Lasker	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9u5BQ9OQqpCcGuy	yDukSUe4TV4rnjF	Mr. Musfiqur Mithun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZTz1LwN8Pi6QbCJ	V3s9X2dXRrEcoyF	Omar Zafor	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zvzAFmTy2eMoDgs	SrGhlYTaybAaXI0	Mr Hannan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xZlmAfmm5lrh5Qq	DxFbgMifexIms1z	S.M. Rukanuzzaman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sgEQMB1CjK2O2pM	cFpCEMFsg5U46mR	Mr Helal Uddin Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oUPyxofTHW66UbU	NAMHFSJkf1H425J	Mr.Nazmul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EWJ6TEc9D7FKLjt	NAMHFSJkf1H425J	Sumon Mahmud	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zLtPho7yGjuOTFh	0Su40gWR3ZNwH6J	Mr Akher	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MoekKVGO3VHjlB3	dTUXWm0EQNDZ6kK	Emdadul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OR6p1m6iMEFJyXE	aa2PPBbLrMykIbD	Hanif Fashion Tex	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9FpQpeZvryNzXO5	VNO3HKx4nPfgPiq	Salauddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TLcvZbmAOfWqUWs	XHXtxz5ucO0srag	Mr. Fedous Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aKeM1Pm4ZPAtieA	Z62gYCmZe2SR4MT	Rasel Perves	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VIyRS576eMHQp92	HswQNFicxerXHkc	Rasel Parvez	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C6Pt9i5yqGg2UTu	4xFctAx19Ni5aPD	Benzir Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rbwLIup8ioQ0Cu3	GU0SNmGJLHzGFGe	Russell	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XMKDxMMV40piIHQ	yoiz4MpIsKeo1Eo	Ms.Irin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cPSKd4jfosYdkfK	9i6z6G0tS71VVQM	Ahsan Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FHb40UyH9sJ2JIR	Ovt0ZZZFtj88oOP	Mr Khokon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2b1YFAZXLF4RV8a	TultpB1fMYrjNRE	Mr Ashraf	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YSVCE8qPVcDVctT	sRdhYWGlLBg3dbe	Sufian Rafi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qukc2txeBvyk29R	7IqllK5x2g0MPaD	Bipad Hari Bhowmik	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SsU1CoGwegJzxFP	EcpvPleeTQCd99c	Mahfuzul Haque Bablu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gpM3GtxxLT1xxQG	wAfNoKIBUykmk9C	Md. Niamul Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cFacuanSpWW5zZ7	eZvdmuSledQTTyO	Mr Salim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yRnGH3dDnIVUzzX	AdwUKe7OtR13vHR	Mr.Saiful Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sOgdmAJ21s8N5xj	iL9sw1jbNIeseCc	Imran Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KV8Oh9CIG4C3kBi	iL9sw1jbNIeseCc	Muhib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xOdYY5L1q95OqyZ	iL9sw1jbNIeseCc	Rasel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rM0TgqopTEII2vC	pdHM9SE1LzbIwS6	Mr Imran	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6JT6hBfKTPtbgps	fkiuKhQkrFA76sk	Amzad Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BJNdBq7FwkqwaGL	xjaiKaMVpD999gf	Mr Shihab	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
whqI1JJb989CVy7	0dmGvZzi4W3Qs4q	Arif Bhuyain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ucGoPOYbjpXKYOo	bA4yoPlOKPFAgQk	Mr.Kawser	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tkOmQqet4VwO1E5	TjmkkMUTsYmb3a0	Md Shakil Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gpUNkmDS7DsOZZJ	1auQpyiYiNpr8ax	Mr Didarul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mo9lZDazea8NusZ	1auQpyiYiNpr8ax	Mr Mohidul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PVMWZP6HpvbI8xr	SliAgX6ZBWXMKLc	Moinul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yallrmiRi7KvxGI	GY0vbfrW3yWjdby	Plabon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S5lj8wcgzSn9GGy	JM48R3U47xfXu5C	Faysal Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0zf3HDOTzqN433j	JM48R3U47xfXu5C	Md. Ariful Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dtDNYVwmaHfvXiq	JM48R3U47xfXu5C	Md.Rawshan Ali	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MKvC7SBSJfXvyj0	JM48R3U47xfXu5C	Mr Rumel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TJlW6p7BkdQhRVc	JM48R3U47xfXu5C	Mr Shakil	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cCtkSjPXJlWbLQh	JM48R3U47xfXu5C	Mr Tamzid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
j7FBnU2NGdcT5xS	JM48R3U47xfXu5C	Mr.Ehashan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fCmpvqRfAt5wcgT	EouhFTp59gFRnQX	Baktier	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3eF0o7cGpi3xLz4	RST21x5L6IgwNXo	Sheikh Tahmid	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WUlUKUAa8Jkmq4M	t9JnAIQEodfBrD1	Mir Imtiaz	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
H0HLVKiArBpFPKo	35olvYP60iJCY7L	Nayem Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fdC6iLEMYhzuiMM	fjSNPg5ifDAuW0w	Riazuddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
226EpJ8VI0C7OuT	okl76bIUu1dCeya	Tanvir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dGXkUGRjFVjYazU	AgIPmecJf9ZQbi1	 Delwar Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wNzs1zGrrayCHLk	AgIPmecJf9ZQbi1	Afsana	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vj9uYtPEqYfxPO1	AgIPmecJf9ZQbi1	Mr Mahmudul Hassan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E3emH0erfOOmnh4	v5GDCE6ljmPYbcv	Mr. Shamim Al Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ciB6vlXnBKs8mgY	yz6xOF49Pi8hsfe	Abdulla Hill Backy	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jPWti0KU7QkQ8sY	yz6xOF49Pi8hsfe	Md Mahmudul Hasan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cv1iDjnw97ztoQP	yz6xOF49Pi8hsfe	Mr Fahad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SHvq4MGMsVgZm02	yz6xOF49Pi8hsfe	Mr Manik	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qLaKbv0SGSIz3CP	yz6xOF49Pi8hsfe	Mr Nazimuddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YTL4LMgD3CICYX6	yz6xOF49Pi8hsfe	Nahid Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6QikGsHMFcljtdY	yz6xOF49Pi8hsfe	Robiul Awal	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oogbJ6OeAbloviX	yz6xOF49Pi8hsfe	Sakhawat Hussain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PQPpsRSSmqGOcbR	yz6xOF49Pi8hsfe	Sazzadul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mnMP0x13l0z0TJ8	yz6xOF49Pi8hsfe	Shahriar Bhuiyan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BeQPGtrZIF4QRiC	yz6xOF49Pi8hsfe	Taheera Khatun Jushan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zRfcLv7uWNnHCZ2	6et5K49deylJETs	Miraz Bin Mohammad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
T5DHbR6A08bTiHr	ceSP6zJFD3YXpWm	Mr Raton	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iysZ9C6SMLw1R0J	GinWWmmnRqSewGa	Mr Faruk	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WNH3Nk7U5yXIDnO	P5UhbyX82NLWBZ3	Momotaj Begum	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vT0aTUTvUI6zJsH	Wh6qpbTWr1eVvUl	Bappi	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JgmQomuEmhGTgBZ	LjnHoENx7v49bKa	Mr Aminul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
udBRD1iNLtgjboJ	Tbdt1GyLpgwCV1x	Mr.Mohashin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dVaPOhlf9082MoN	WUpUN89RnuGudWU	Mr Shohag	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iuBrdCpEj3VK2yw	aw2Y0VjdZbM7OnL	Selim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
i7T1xYepgB0MZJo	h7RZ5LGTNRRTLQO	Mr Ferdous	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IzAe9bnV3G35X5S	XeVBFPrNm3IWfHZ	Mr Sabuj	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YBlTU0iYYQcVX1O	a05NsZoHy0NZPiO	Mr Ripon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nxwZQf5lrPZWKC4	FkEtsQO68K6LqhX	Mr Khairul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BHXQZ4IuvYzpavj	XahyUaLSTkBBLJE	Mr Mintu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
us8qjq2hm6g2UJ1	54bbncRhhwszWKw	Mr Abed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
trPwm57BYOncOPr	74ZtMUtJewtoi9c	Mrs Jannat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
W1BqiBBAx2tLrWo	DatZH3B1EGBHIhD	Saed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Sc4Q78LfNNB1DaG	akxXgfUJW57hzQG	Mr. Majharul Anwar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SpIVQOYB6le7cQk	DlGklG2znrqUjyS	Md. Shafiur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5WrxsAKYmoaANi5	DlGklG2znrqUjyS	Mr.Aminur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GzWalCFJm9uNUk8	AKM003W7wZ3wr60	Md Jahidur	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LHR1UqS7eqzXVPk	foAUr20ddcDifyc	Mr.Zonayet Hossain	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gUtXgGhRiKTNmCY	AFsgZZ9RNmeB8pE	Ayesha Akter	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EoHwSkFxp3e2ua3	FEIxxYqrkFvsBT3	Golam Mostafa	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LAAkRQr4q3Ngeku	FEIxxYqrkFvsBT3	Rakib Abdullah	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WwrWhpYykFDrqPH	3UPwjSt2nKD7iER	Ms Payel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E5Kzma1yHmZqDQM	3UPwjSt2nKD7iER	Ms.Payel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YwqIIyOMxjcLzly	kFaNOBoQdhXCRz0	Mohua	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EfhTXnSfuSQCS1a	Hs3gE60AeyUMflL	Al Amin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2zdwhNY62nhDk9P	aTiMcfryLAsZFov	Ahsanul Haque	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZY76GX73B8caloO	aTiMcfryLAsZFov	Mr.Hashem	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fFkV7NbBgP1yhRD	jH63Es6Pco23Vsg	Mr Samim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yqZS7hZ3i3RBtOI	bRODUuQPbK1z9Mc	Mr.Tushar Kuri	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kE5ii9cXbrGxWbD	tmCtwRJjUgsro4q	Mr Auion/Mamun	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uDDpKnv9UfIARZc	tmCtwRJjUgsro4q	Tofazzel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qo8PFqmBuNYa77z	kVbX9UP8Pmx2w30	Mohammad Shamsul Momin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jBt2q7IPGpXr1AG	9qCxsJUn5vFznif	Md.Shahabur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GSEsD6MchGFHf7Q	98n5fIYPnnjRTXf	Mr Rashed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vzE0dG2eDDeECsq	TqZ4pKkLOklUQ0i	Mr Saju	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sRiFKdLXoz1RkdX	XrCKHhIZHlSJHFr	Mr Nasir Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UPzZKNKB70yVOJ3	eKGF3yQFOw2NLLM	Mr. Mizan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Snfqq6lpvQGqzA6	UvApX70wLvCodvM	Tazul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IC68Im1BKLHo4yn	dUajEuGa4aTmmPF	Ibrahim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v1GXTa0DS63ouF8	fTWvCZWnNlWW1XH	Mr Monir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
T16NpeQOhozowm1	vxMtGuxHgWowDXk	Soyab	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PLRO4TgfuYchnQG	CoaVNNddq151v7r	Rakibul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CLlnXgtPFOHjQpc	CoaVNNddq151v7r	Mr.Tanvir	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Rwytai67RdBHUjh	W9oGMH9739iQJtV	Mr. Sujon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Xmd27m3KAgeNnU1	jVnsvGYuBedpNPh	Bijit Saha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ezs8owSOPGAI5xv	jVnsvGYuBedpNPh	Mr.Indrojit Shaha	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5VZAydluzMCxbUr	jVnsvGYuBedpNPh	Mr.Rakib	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LKyuxUjJcDr5lsP	mSJbidowRX7gYrr	Arafat Ahmed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2haNTbmGeMkwg11	mSJbidowRX7gYrr	Md. Zulfiker Ali	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fnpNZ1KIIgohku8	mSJbidowRX7gYrr	Mr Toslim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XeU98bmsDmB0yuw	mSJbidowRX7gYrr	Shankar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2aGx3hQvvvg05mw	wmbWbkEEibx8YIP	Md Taslim Uddin	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CZhyWxlOpccKaHZ	wmbWbkEEibx8YIP	Syed Golam Kibria (Sawon)	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XEq3vuImsREsg3k	1FCyIxXIno6gKzD	Ms. Dammika	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7rmxXiyiM0aFT0U	4TP2DUSVplU8fwO	Mr.Polash	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gQR6pY9WNZdyhfH	hMyk187OgPcOrgd	Mr. Shahriar Haque	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AqpFBlX0lgdnOrR	MCWPzJ0zNNgFim7	Md.Ariful Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vWapFRbPwP5sUOs	hquwzqflvWVKgi4	Saiful Babu	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1wDf5UOc02Y8Z8w	ZTwyzmrjxVoJusH	Md.Shohag	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
508PUqldVxaiR9k	NXxHGAiZ5uLAqLE	Mr Ahsan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5TB57jIDIvYlcTr	NXxHGAiZ5uLAqLE	Ripon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NcKe56pwvh9jlHg	zwLq0u2F66vzbzB	Mr Samrat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pQC60paTOtCVhyt	FtdmbBMy2BfSVRR	Mr Jewel	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6i7XGsJrGRFneko	FtdmbBMy2BfSVRR	Mr Parvez	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CxMDpzBk2LdyKzM	fHby99KlXzqttDf	Hizbul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gh3ptzZ6OgIGfUA	qqs813nWEQHoMkt	Mahbub	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vfecSRHFASBfFN8	qqs813nWEQHoMkt	Nur Mohammad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NdxTjeAdmEsdQZP	QAOy6FI5muUj7yi	Mr Rezaul Karim	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
stvshHaOk0HdLSb	NDtmmNPcNQsXRRA	Farhat	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vXzVQFubIklBiUs	NDtmmNPcNQsXRRA	Mr Ali	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eG7YEY0k2rJ7nhz	NDtmmNPcNQsXRRA	Mr Farhad	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6B9Yk6kpM6d9yJq	NDtmmNPcNQsXRRA	Mr Mahbubur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tOfZaNHqplpa5zK	ZCz9bXCGvgpxx3R	Sisili Ferha Shova	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
h7ZmCbDiaoynO8j	Iil3qgcNI6BHu91	Md. Abu Sayeed	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7fX7CwtD3Pyabx8	lCwQzD4W7d8d10P	Mr Sujon	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8SKhQ0GKPcbP0bx	MFZsL8fzzlVO5l7	Sayed Fayzul Haque	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Em27cLtTxPWXVkw	jqEhTtow5UU3lLB	Dolar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Z0gdlfzAra5GHzW	BTjyXfSkHTYhegp	Sobhan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FP7Kpdp4fodnDei	pvzFJcf7WkoaU4G	Raihan	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
orWuF6O06DU8LRu	NPZQ1DR7h6BcXy1	Hedayet	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EXspR4enOwGgTad	A3yBFfpCzreGH3J	Rume	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nvdxwgtR98feDbg	iRBjWK573AxF3kS	Khalilur Rahman	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mtipRY6RxlPcZGT	iRBjWK573AxF3kS	Mohammad Jahidul Islam	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wvCacUWi9n9srGM	iRBjWK573AxF3kS	Mr.Mahbub	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PjhVmqv3IrTesHO	nAisgDMR9EtQwXy	Abed Quasar	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SelfG8Sj2rsRxN6	nAisgDMR9EtQwXy	Mahabubul	\N	\N	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
x0zUR41CrArsVRV	pT0ZnIQmFJNRAGV	MR.MUNNA		\N		2024-09-28 11:21:58	\N	IMPhbfmV3GUYSpi	
t5Vlz1m0oDw531D	fQqSH3VZKVnj76t	SOFIUL AZAM	azam@medlar.com	01788898563		2024-09-28 11:40:33	\N	IMPhbfmV3GUYSpi	
bK6swKDN4J8SThJ	pEEyMfqD2eryNQn	MR.HIRA		\N		2024-09-28 12:02:53	\N	IMPhbfmV3GUYSpi	
fUEqLQiEUyhqVRO	eXyKTz14pVabEKy	MD.MUSTAFIJUR RAHAMAN KHAN	mustafizur.barnali@gmail.com	01788898563		2024-09-28 12:09:39	\N	IMPhbfmV3GUYSpi	
mvkIqoWeV6n8eyI	85i2MRvHJlNuR9Y	Mr Sahariar	\N	\N	\N	2024-09-02 19:20:00	2024-09-28 12:19:02	igD0v9DIJQhJeet	\N
nhbTyLo3TwOdQJN	LAixMiJPRR9JYtj	JAHID SHUVO	J.EH@GMAIL.COM	01788898563		2024-09-28 12:50:47	\N	IMPhbfmV3GUYSpi	
\.


--
-- Data for Name: party; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.party (uuid, name, short_name, remarks, created_at, updated_at, created_by, address) FROM stdin;
7GdN60GkIcn8svW	ToMad	Mad	testings	2024-09-03 14:12:42	2024-09-03 14:20:07	igD0v9DIJQhJeet	\N
cf-daf86b3eedf2	Rossini	Rossini	Rossini	2024-09-03 14:38:04	\N	igD0v9DIJQhJeet	\N
cf-daf86b3eedf3	2Tall	2Tall	2Tall	2024-09-03 14:38:04	\N	igD0v9DIJQhJeet	\N
cf-daf86b3eedf4	4F	4F	4F	2024-09-03 14:38:04	\N	igD0v9DIJQhJeet	\N
t3eXflQIq4bNao8	24/7 Sourcing Ltd.	24/7 Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DHzq53DhhZ1UZVP	4A Yarn Dyeing Ltd.	4A Yarn Dyeing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Q5gRJpvOrO7DQSQ	4Z Group	4Z Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jP7ERDBHn0Qmgz4	A & A Trousers Ltd.	A & A Trousers Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4riLziZ2gmPL5dT	A Plus Ind. Ltd.	A Plus Ind. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uOgGB9TPiXdafmh	A Plus Industries Ltd.	A Plus Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WQh03uqWJoXeVON	A Plus Sweater Ltd.	A Plus Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BFQV8MnZFgYqBXu	A Z Group	A Z Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OgZ9oKwFtx8QcBW	Ab Apparels Limited	Ab Apparels Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BnwxUu8LPyH1swd	Ab Mart Fashion Wear Ltd.	Ab Mart Fashion Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JvXdWthUHaYET6Q	Abanti Colour Tex Ltd.	Abanti Colour Tex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kTCkCojs5DAZg7f	Abedin Group	Abedin Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QZak4FKp6Hh0pMD	Abir Fashion	Abir Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Xtcl1VHxR0Bj4xk	Abnz Sourcing Ltd.	Abnz Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xXCNpbFVfwCCg9H	Aboni Fashion Ltd.	Aboni Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
snazUjT4PzeT5AR	Active Trims Bd Ltd.	Active Trims Bd Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2l3D21fVnWp63Ir	Ador Composite Limited	Ador Composite Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5pnWpjVHc5RAJhE	Adroit Linkers	Adroit Linkers	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nInsSyOZ1UR2gmJ	Afiya Knitwear Ltd.	Afiya Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rlmCjTCnsh3ZTqg	Afrah Dress	Afrah Dress	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yqLh4shJmrtZsHX	Afrah Dresses Limited	Afrah Dresses Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Iz35L3yFBO3ZxTE	Ahsan Composite Ltd.	Ahsan Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bsJaGimPMUj837e	Aj Group	Aj Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mpixSqcAbUcUQ0C	Akh Stitch Art Ltd.	Akh Stitch Art Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xzxRRRB3pSpVxMw	Al Amin Attiers	Al Amin Attiers	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ag3spQzNxm5Cvit	Al Nesar Garments	Al Nesar Garments	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
APot0wsxte3Gh3e	Al-Muslim Group	Al-Muslim Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mgI0CGJvoDpE43g	Alif Group	Alif Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DQkwKkYbJESCYjz	Alps Apparels Limited	Alps Apparels Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
phQyx40qY9VcF0t	Alvenous Fashion	Alvenous Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
h6tkAYqQc3kyTPP	Alyana Fashion Ltd.	Alyana Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
C82Op6p1bXhLChc	Aman Knitting & Aman Fashion Design	Aman Knitting & Aman Fashion Design	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E6IGDiiRytIiSl7	Aman Knittins Limited	Aman Knittins Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
q6gBKkAz8V9FvVa	Aman Tex	Aman Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wcNrPBgxRbOUYW2	Amana Knit Fashion	Amana Knit Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DdaJzJWzfvPaFsT	Amichi Apparels Ltd.	Amichi Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RRqlu3yBXlphksQ	Amico Enterprise	Amico Enterprise	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
s0Wz0X0OKMS7khb	Amity Design Ltd.	Amity Design Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gp1wgmaUV9Xn36N	Ams International (Sweater) Ltd.	Ams International (Sweater) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
05xoZaKBkpMLMn0	Anabia Trading Limited	Anabia Trading Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eb8mtzu7DxQc6Uj	Anabia Trading Ltd.	Anabia Trading Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cxrmuntdxeoFBps	Ananta Huaxiang Ltd.	Ananta Huaxiang Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
q7F4YxDQt5ErEzq	Anm Global	Anm Global	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gXNHW3s4jqto7Gs	Apex Holdings Ltd.	Apex Holdings Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oFDHLUxoz4VtH8z	Apparel Buyer Solution	Apparel Buyer Solution	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
y3QZau1wkugf5bz	Apparel Village Ltd.	Apparel Village Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
J0mEbcTi1XMzIWe	Ascending Tex	Ascending Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PAwMrgc9u9c0wyN	Asia Style House Ltd.	Asia Style House Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eN59VazzNdln2WV	Asrotex Group	Asrotex Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9nYOFi9gs5E8lU1	Asset Plus	Asset Plus	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NhJUvbvZe6nlDy4	Astro Knitwear Ltd.	Astro Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bQNinvxaat6M1H9	Atex Associetes Ltd.	Atex Associetes Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CqqkYTOTP75NUTR	Athens Design Ltd.	Athens Design Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
43lHRqmAJMMpsfR	Aukotex Group	Aukotex Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vFb1YNxyhAEYJt2	Aukotex Ltd.	Aukotex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AP7cnehFPOBqSgm	Aurum Sweater Ltd.	Aurum Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yG6Tob2HUs7OGjp	Aus Bangla Jutex Ltd.	Aus Bangla Jutex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v441Rc92WcEgIn2	Axis Knit Wear Ltd.	Axis Knit Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
W4MieZlC0i65BHM	Ayesha & Galeya Fashion Limited	Ayesha & Galeya Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3waD2gCeUwVXCvL	Azim & Son (Pvt.) Ltd.	Azim & Son (Pvt.) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UfZAlml30cjiZ0n	Bangla Poshak Limited	Bangla Poshak Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HmDtQyGXR0fY3fl	Bangla Poshak Ltd.	Bangla Poshak Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PpUMR6D36uvtbwS	Bangladesh Apparels Ltd.	Bangladesh Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cvgxChqbv5whkRR	Banika Fashion Ltd.	Banika Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
diY7kLoc6jfaVZA	Baraka Fashions Ltd.	Baraka Fashions Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eXyKTz14pVabEKy	Barnali Textile & Printing Ind.Ltd.	Barnali Textile & Printing Ind.Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6VrYVchl4Imvvzq	Baruca Fashion Inc	Baruca Fashion Inc	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BcqnFTcRDYZKmU7	Bd Knit Design Ltd.	Bd Knit Design Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wMJ9kKFkNAvGMr3	Bd Police	Bd Police	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xZdY9X7cfpPKYMn	Bengal Hurricane Group	Bengal Hurricane Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6gPWC3aBt4VRTjx	Bengal Knittex Limited	Bengal Knittex Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
58cQSrntnJyeoUY	Best Dress Wear Ltd.	Best Dress Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XsKxzQGewGdw3eN	Best Style Composite Ltd.	Best Style Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BoN7qhmJUPXNkHF	Besta Apparels Ltd.	Besta Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zxNReWSx8yAu5mP	Beximco Denims Ltd.	Beximco Denims Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BTHuthV4c5PtpLG	Bhis Apparels	Bhis Apparels	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KjyjhSYaEZeepNf	Bidnbuy Fashion	Bidnbuy Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WaAvgQvMF70bZ5o	Bij Apparels	Bij Apparels	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xgkxv5H0cmulZoj	Billion Gain International Holdings Limited	Billion Gain International Holdings Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wYhU2J4iYFknFKf	Birds Group	Birds Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ac57YehBrPqXQDV	Bitopi Group	Bitopi Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aCjCekpJOycL0ZJ	Blue Apparels Ltd.	Blue Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
amGHwc1TyXxygxF	Blue Planet Knitwear Ltd.	Blue Planet Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
raxm4fcywmrCwrw	Body Fashion Ltd.	Body Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wmjATg2IeTOivGh	Bonami Bd	Bonami Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eHcwSXQ2QwySm3S	Bongo Stiches Limited	Bongo Stiches Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
30dE6BPRDlMZdH1	Boston Sportswear Mfg Ltd.	Boston Sportswear Mfg Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dTudLcnMfpigLqa	Brands Apparels Ltd.	Brands Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
U3Hdtn24FrmHmWy	Brothers Trade International	Brothers Trade International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7amlwAe5evpbknp	Byzid Apparels (Pvt).Ltd.	Byzid Apparels (Pvt).Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kUznE6UW7kOIlD8	Caesar Group	Caesar Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zOs1sj66ACkjAO0	Caretex Ltd.	Caretex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yMIx7mjhBBygg7H	Centex Textile & Apparels Ltd.	Centex Textile & Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
icbUSAcrPthiASx	Century Apparels Ltd.	Century Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5Vu2eZNw8CSjUFL	Cleartex Industries Ltd.	Cleartex Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cNzVYQDRH6edmzs	Cold Asia Sweater Ltd.	Cold Asia Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pDvmJDzlGPKk0Tg	Comtextile (Hk) Ltd.	Comtextile (Hk) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KLv2DxBvthzf22s	Confidence Knitwear Ltd.	Confidence Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hP70wqVXV3lAfyE	Coretex Apparels Ltd.	Coretex Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RPhYBeqDKSHSFj3	Corona Fashion Limited.	Corona Fashion Limited.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rzLFObFmTXxRXtI	Cotton Bridge	Cotton Bridge	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rO0aKAq5M82NuxY	Cotton Club Bd Ltd.	Cotton Club Bd Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XyfdMcIZFM75Unv	Crl Fashion	Crl Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
H4NIhZg6p5oi1xE	Crown Fashion & Sweater Ind. Ltd.	Crown Fashion & Sweater Ind. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qXdtW7I4bz5vXWp	Crown Knitwear Ltd.	Crown Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PLVg7prxHh7jplP	Croydon Kowloon Designs Limited (Ckdl)	Croydon Kowloon Designs Limited (Ckdl)	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
svs9yzfrs8Hbisk	Croydon Kowloon Designs Ltd.	Croydon Kowloon Designs Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gyK7Ee0eHJkYcTD	Ctg Buying House	Ctg Buying House	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FOCTUtOaR5Jur3p	Cute Dress Industry Ltd.	Cute Dress Industry Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iuUT0vARRsCX3ox	Daeyu Bangladesh	Daeyu Bangladesh	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fOuVV50gpvw3Kgn	Daeyu Bangladesh Ltd.	Daeyu Bangladesh Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FuLpCil8rVZ2bUb	Dbl Group	Dbl Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SivNVp90CMY3nHL	Dbs Group	Dbs Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
d8qCJS7CnEzZ2zp	Debonair Group	Debonair Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qa8drcPykYCWUEA	Denim Density	Denim Density	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RviVgwLENcXu1mE	Denim Venture & Fashion Ltd.	Denim Venture & Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
y07iHMbYYWoDfpA	Denim Venture Ltd.	Denim Venture Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YHHxCX6K05uoFwC	Denimach Limited	Denimach Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xufTiggBnrf1fkL	Denimic Limited	Denimic Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yjr6yK5l8JJgxzb	Deshbandhu Textile Mills Ltd.	Deshbandhu Textile Mills Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DU9yyAa3lkBVaFZ	Deshone Apparels Ltd.	Deshone Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dDyPAEculX3tDrY	Designer Fashion Ltd.	Designer Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OPLRCxREve3G99G	Dew Fashion Ltd.	Dew Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8s1chepqzuzS3hH	Dewan Fashion Wears Ltd.	Dewan Fashion Wears Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jFCAg25ghRbShSd	Dhaka Knitting Ltd.	Dhaka Knitting Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0yDe0GdKSV8aNNv	Dhaka Pullover Ltd.	Dhaka Pullover Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jnDKniD0j6dyfQF	Dip Knitwear Ltd.	Dip Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nqpP7aFuSFxp5QX	Dk Sweater Ltd.	Dk Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GwUr7QfO4Y1UVVU	Doreen Apparels	Doreen Apparels	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XyK0JXTzLPZVaEW	Doreen Garments Ltd.	Doreen Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SEmCPxdbyf2yj78	Dowas-Land Group	Dowas-Land Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3D5BAdneNUv820M	Dr Tex	Dr Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hB3khnXIvZ17kPv	Dress King	Dress King	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZzwiUWua62ivBQj	Dress Maker Fashion Ltd.	Dress Maker Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ArbvxO8miOCb4WJ	Dress. Me Industries Ltd.	Dress. Me Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5uhhj0xsdfNGDMM	Dynamic Zipper	Dynamic Zipper	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QyzjLVoIFMpGndq	Echotex Ltd.	Echotex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pmvnrDsU7yTtc3S	Elegant Sourcing	Elegant Sourcing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O5tSc2pqKsPvc6a	Energypac Fashion Limited	Energypac Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FnEopxvZyjqW3KA	Ensa Clothing Ltd.	Ensa Clothing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uzskMuPCDRQZVYI	Entrust Fashion Ltd.	Entrust Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IZmZahbRsVTMQrJ	Erum Tex Ltd.	Erum Tex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8EqGdEi3aBbGRMJ	Esquire Knit Composite Ltd.	Esquire Knit Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3mAG9y88faj69BR	Eu Fashion Limited	Eu Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
N8jt44RKueiEXc5	Euro Arte Apparels Ltd.	Euro Arte Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UprNsYNzA59Agp0	Euro Bangla Associates	Euro Bangla Associates	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0jR311J2cpi5AIJ	Euro Denim & Fashion Ltd.	Euro Denim & Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CqUGI2OeSbsFTO6	Euro Knitwear Ltd.	Euro Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lrpKBOpw0dmKkfG	Eurotex Knitwear Ltd.	Eurotex Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hBDKLR6bbRCpyKn	Eurozone Fashion Ltd.	Eurozone Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VlXnDvUdHcI2h1Z	Experience Clothing	Experience Clothing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
35PoCTL3qhcW6p0	Experience Clothing Ltd.	Experience Clothing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FnsMg4jSQTFWA4x	Explore Garments Ltd.	Explore Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TokHusA6w0pjZ4A	Fabrics & Yarn Solution Ltd.	Fabrics & Yarn Solution Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ypAlAM3o3Cu35us	Fakir Group	Fakir Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WyOsIrRu69N35oU	Far East Knitting & Dyeing Ind. Ltd.	Far East Knitting & Dyeing Ind. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sEiNxRxHONjkYVb	Far East Knitting(Rabbi)	Far East Knitting(Rabbi)	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YT2lCk9CEiJ6llp	Fashinza Manufacturing Simplified	Fashinza Manufacturing Simplified	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vpAOlvFUfmC65Fd	Fashion And Sourcing Ltd.	Fashion And Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dQeRDqNBcgAJ5Ng	Fashion Asia Limited	Fashion Asia Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gUBfmxMjMIWhYoD	Fashion De Executive	Fashion De Executive	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GWAXnKQg8ptXA0s	Fashion Flow Apparels	Fashion Flow Apparels	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aFB73ULL8hxtjlZ	Fashion Glob	Fashion Glob	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EyTFWjOc5EfngOX	Fashion Mart Dot Com	Fashion Mart Dot Com	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HIg2ZMNAxFqpa7i	Fashion Step Group	Fashion Step Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
80ZhXvC4urFVQ2w	Fashion Tex	Fashion Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A57wxiclob0ekDD	Fashion.Com Ltd.	Fashion.Com Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
14F57KyQ6mEfcbo	Fci Bd Ltd.	Fci Bd Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TTwbYHQVejJ5eMy	Fiber Tex	Fiber Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6UVCEmKKJ6j5BPJ	Flaxen Trims Ltd.	Flaxen Trims Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WbXaAuFtEZV4su2	Flick Trading	Flick Trading	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YfC7VmVX9eHeR89	Florence Group	Florence Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BgEBVuDI5CvU5HB	Fly Fashions Ltd.	Fly Fashions Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
syUNDLL1iWLsY0d	Fordart Investment Ltd.	Fordart Investment Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HTSoQrbAiFtSEn8	Fortis Group	Fortis Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GVbbxtdgPFyLToR	Friends Knitwear	Friends Knitwear	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
F0MvU6ftb1Cu6bc	Friends Knitwear & Accessories Ltd.	Friends Knitwear & Accessories Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
i3ACJ1RYQxoaMaT	Frill Tex	Frill Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ecdpCimdya8Wyxc	Galpex Limited	Galpex Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8qFhURweJ7NNRAT	Gardenia Accessories	Gardenia Accessories	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DFqfFYQsqHVZgVD	Gds International Ltd.	Gds International Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wgrE8vhtFs0ChME	Giant Star Fashion Ltd.	Giant Star Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kF5Bl8Gf3LzvO7i	Gimex Clothing Ltd.	Gimex Clothing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MEhVmE74Lvl7Hue	Glamour Dress Limited	Glamour Dress Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8QvKOIkFWSoeKN7	Glamour Dresses Ltd.	Glamour Dresses Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BgnGFX2yzZwEq4B	Global Dresses Hk Ltd.	Global Dresses Hk Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UddZnH65RJrVLLU	Global Knitwear Limited	Global Knitwear Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RULg8C8kTH0s0Yg	Golden Touch International	Golden Touch International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eHGNhIRRaCiUfJl	Good Rich Sweaters Ltd.	Good Rich Sweaters Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mTFISFfiGeg4x2S	Grade One Ltd.	Grade One Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
B5fkHK8mxNLMuea	Grameen Fashions Ltd.	Grameen Fashions Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PT5HdhIhcDYahiX	Graphics Textiles Ltd.	Graphics Textiles Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
13uGFigbtVfdoui	Green Life Knit Composite Ltd.	Green Life Knit Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
86QHpcOl9b0TyQ8	Green Mark Apparels Limited	Green Mark Apparels Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YsPgMQKYf8o7NJw	Green World Fashion Ltd.	Green World Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ndqcQHRMlqGgMZD	Greenlife Knittex Ltd.	Greenlife Knittex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
e9bDS4lPJozv48Q	Habitus Fashion Limited	Habitus Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
METWERW53GQMpl2	Hamid Tex Fashion Ltd.	Hamid Tex Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qL1rYzbnUMtOq7H	Handz Clothing Bd Ltd.	Handz Clothing Bd Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Dm9XKkD0FURDZVz	Haque Apparels & Textile Ltd.	Haque Apparels & Textile Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
REkey8PwhvzU6tI	Hdf Apparel Ltd.	Hdf Apparel Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9LVsK8S2oKwRCRc	Hera Sweater Ltd.	Hera Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uZHzHb4a4eu8PbK	Himalay Sourcing Ltd.	Himalay Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X9lvhg10tYHoakf	Honey Well Garments Ltd.	Honey Well Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wGhMnC2bJMZ8Al0	Honeywell Garments Limited (Tawhidul)	Honeywell Garments Limited (Tawhidul)	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
22ZfercsWkBjdMo	Honeywell Garments Ltd.	Honeywell Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VXDWHkKfxmKsIkz	Hrm Sourcing Ltd.	Hrm Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5XKyt92YQgWZ8wX	Hug Of Fire	Hug Of Fire	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VQLtYhQxJL9R39u	Icarus Fashion Ltd.	Icarus Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
B4ObmgbWKwPPUqT	Idas Fashion Ltd.	Idas Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UV2ZmDA6h6sw7I3	Ids Group	Ids Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Wjy3AhDYlW5fnTw	Ifs Texwear ( Pvt) Ltd.	Ifs Texwear ( Pvt) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O8YHtk9BIXAP4Ul	Impress Newtex Composite Limited	Impress Newtex Composite Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eTBpcQ8Zh69dbaF	In Fashion Ltd.	In Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mwUOfoSbV6zrfj4	Indesore Fashion	Indesore Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qRfLheZ1CZYdMqu	Inditex  Wear	Inditex  Wear	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PbwyRttg8nCVi4n	Initial Sourcing	Initial Sourcing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6lubMf1jhZJ8Cz4	Innova Associates	Innova Associates	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
paSsCfikiNnOh72	Interlink Apparels Ltd.	Interlink Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bMJflJU7FxEET31	Islam Garments	Islam Garments	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8CsOqdyhzeKWsLv	Isource Your Garments	Isource Your Garments	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
emHgKnGxqBMAnNs	J And A Zipper And Accessories	J And A Zipper And Accessories	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lIzkE9oWgPMw1BE	Jahara Fashion Limited	Jahara Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
U6clpZmaotBtYjd	Jamuna Apparels Ltd.	Jamuna Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
IEY7EECFKiR1Bzp	Jamuna Denims Ltd.	Jamuna Denims Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v5JYiWjZXokWNHg	Jazz Sweaters Ltd.	Jazz Sweaters Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Fg1BvGvcmXZPnRx	Jf & Co. Ltd.	Jf & Co. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
X6i26aPLXhaZY9t	Jk Shirt	Jk Shirt	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pIUCPMdfsfBYUWG	Jl Fashion	Jl Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JHVxIpFS62zSIYZ	Jokky Garments	Jokky Garments	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CAM0fSWaZGHuwUP	Jp Sweater Ltd.	Jp Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
t1rxpSyPKhnEwcY	Jstex  Bd	Jstex  Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oPcKoToDjyB1cx3	K & K Corporation Ltd.	K & K Corporation Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KATSNy6177jIlGm	K.C Bottom & Shirt Wear Company	K.C Bottom & Shirt Wear Company	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GTIuWHqdbZBXF9m	K.C. Bottom & Shirt Wear	K.C. Bottom & Shirt Wear	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VgKXdGtAQq42Q3j	K.G. Garments Ltd.	K.G. Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
n3zq1SBKumt01KD	Kappa Fashion Wear Limited	Kappa Fashion Wear Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eLBT0CDg5vHa8mx	Kashfi Knit Wears Ltd.	Kashfi Knit Wears Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Pzvpvi0K0jNlqjD	Kd Sourcing International Ltd.	Kd Sourcing International Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
B5bUi7jtJ4zh2pd	Kentucky Knit Bd Limited	Kentucky Knit Bd Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zrT5MUJSDZMGju9	Kleider Sourcing Ltd.	Kleider Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5fg8kgF9uabde7z	Knit Plus Ltd.	Knit Plus Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Zk387IomyNW6MsV	Knit Valley  Fashion Ltd.	Knit Valley  Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RZHxkwWwf4e87om	Knittex Industries Limited	Knittex Industries Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qzWCSC8TwFtSc06	Kvl. International	Kvl. International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iJjIIFXgO7optyo	Lakhsma Innerwear Ltd.	Lakhsma Innerwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
50M5Jdhxm3KUR4b	Lariz Fashion Ltd.	Lariz Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Vd5d85qq6pBd3YJ	Latest Garments Ltd.	Latest Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dsqy7TKZvdnTd2o	Leaf Grade Casualwear Ltd.	Leaf Grade Casualwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9AvE8H5Jfx8wK7l	Lexim Tex	Lexim Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RvqUQB8k12GWhLI	Libas Stitch Limited	Libas Stitch Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5Mc4KKXs6pLo6kJ	Libas Textile Ltd.	Libas Textile Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AJCZj7BYB4q43Pz	Liberty Knitwear Ltd.	Liberty Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
E9GFwljFmJs9biS	Life Textile (Pvt.) Ltd.	Life Textile (Pvt.) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nq9uw4frD5INyFz	Lithe Group	Lithe Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1t9j7coCPXJmIzc	Lizzard Sports	Lizzard Sports	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aCuY5yYQHHZ668O	Logos Apparels	Logos Apparels	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
8eDO0en7J25ROKj	Lucas Fashion	Lucas Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WjKqwwbThHIt4eB	Lumen Textite Mills Ltd.	Lumen Textite Mills Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Qt3OFZ5JWlgBR1w	M.K.R Traders	M.K.R Traders	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uOpeGVudUhbZasm	M.M Knitwear Ltd.	M.M Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
c19x0RBslgWa6w2	Ma J&J Limited	Ma J&J Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
PHfK6MgYHRuOres	Mac Tex Industries Ltd.	Mac Tex Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GVjU45EUSffkk7p	Mahmud Jeans Ltd.	Mahmud Jeans Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
w6Wa9EryHF95SYO	Majumder Group	Majumder Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
26CwF06Tm6uFeOx	Mamun Knitwear Ltd.	Mamun Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OeTt5rhZZ4ZeEWo	Marma Composite Ltd.	Marma Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
k82uRG7ddFCUvLV	Marquee Manufacturers Ltd.	Marquee Manufacturers Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2Cg5uPWEJetvnEf	Martin Knitwear Ltd.	Martin Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nzid5Tq1UHjuTPU	Masco Cottons Ltd.	Masco Cottons Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
KdtePvaYpnlfDnQ	Masco Industries Ltd.	Masco Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EMryfkCwah46brO	Masco Knit Ltd.	Masco Knit Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cNwXUhX7E4BDA3x	Mashiata Sweater Ltd.	Mashiata Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6rO0MJH5L2OWGxb	Mastercham Ltd.	Mastercham Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
t6OLoU1gshFL9wF	Masud Buying House	Masud Buying House	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7cfLc8ce0DxhKUR	Matrix Dresses Ltd.	Matrix Dresses Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bXYXSD3Dgl8FFCh	Max Clothing Bd Ltd.	Max Clothing Bd Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
oSmuQSOfrcgAY0y	Max Mind Fashion	Max Mind Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2KuBQz1n6TyeDEB	Mb Knit Fashion Ltd.	Mb Knit Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
S7mGdadVyPU4Ixd	Mbm Group	Mbm Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
z0Wmo5ibFzgwHho	Meek Sweater & Fashion Ltd.	Meek Sweater & Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eUlMGCmxGY39Cw1	Mega Yarn Dyeing	Mega Yarn Dyeing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LrwLstD2opPehNF	Meghna Denims Limited	Meghna Denims Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QxAWvOLsKeYA4dm	Merchantex Co (Bd) Ltd.	Merchantex Co (Bd) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DWqK7fWgIvc0ouw	Metro Maker Bd	Metro Maker Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jKy2vtX1HjYAkqn	Microtex Design	Microtex Design	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
r15xecX6zjOeX9L	Mim Design Ltd.	Mim Design Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Dvle0xyk3eZH9AZ	Mim Fashion Wear Ltd.	Mim Fashion Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wNvtSHSmZqWnOY0	Mnr Swater	Mnr Swater	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nYztlXb4qc0QFpX	Modele De Capital Ltd.	Modele De Capital Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bGM35IX5N5JJZTe	Mom Jacquard & Sewing	Mom Jacquard & Sewing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AleiBpKHH1tj7P6	Momtex Expo Ltd.	Momtex Expo Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
W4yWcvW8QXljlQF	Moonlux Composite Ltd.	Moonlux Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gFSwbzNqDLq9STc	Motex Fashion	Motex Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MlYWUmD4NXvV5uL	Mrs Design Limited	Mrs Design Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
07IN3fm9fXK1RoS	Muazuddin Textile Ltd.	Muazuddin Textile Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NPDeJFTdMaEySV3	Multitech Apparels Ltd.	Multitech Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2dmWL3XUuOiQeG6	Nassa Group	Nassa Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
J2fghNyEJdBad10	Natex Of Scandinavia A/S Bangladesh	Natex Of Scandinavia A/S Bangladesh	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gNXcr4Mnffez0xO	Natural Denim	Natural Denim	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EdfNjbFBLF9y7uU	Natural Denims Ltd.	Natural Denims Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GSWJ19IPP8jbEmF	Natural Indigo Limited	Natural Indigo Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ea4vFAUGrYSyMNR	Natural Indigo Ltd.	Natural Indigo Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vrCodUaGin1YthQ	Nazmul Hosiery (Pvt.) Ltd.	Nazmul Hosiery (Pvt.) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6wGrb6Qk3LPpGUO	Nelima Fashion Wear Ltd.	Nelima Fashion Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4S30GrdmCYkmv37	New Asia Fashion Ltd.	New Asia Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
l2Zfz3r9Q6OdJth	New Asia Limited	New Asia Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qQfkEi6148wq6i5	New Genaration Fashion Ltd.	New Genaration Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wXG5E4vcv2XGutT	Next Sourcing Limited	Next Sourcing Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
28pNrMXKawt52aU	Nextgen Style Ltd.	Nextgen Style Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5GOid9gygIXlB0T	Nexus Sweater	Nexus Sweater	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GK1PVNyCATsnpY3	Nexus Sweater Ind(Pvt) Ltd.	Nexus Sweater Ind(Pvt) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ENqyaKHtNZjvErz	Nexus Sweater Ltd.	Nexus Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AeVO1T6RgsvKJWi	Nippon Garments Ind. Ltd.	Nippon Garments Ind. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
OYAYo7mAduax5vJ	Nofs Garments	Nofs Garments	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7lwXHl42xTFyZQ8	Noman Group	Noman Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SEUnQn5CoDq6s84	Northern Fashion Ltd.	Northern Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lgm7Cm2s3sUtVea	Novel Hurricane Knit Garments Ltd.	Novel Hurricane Knit Garments Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TmG6OJ7bKGtCuFJ	Novus Fashion Ltd.	Novus Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7n3CTdBN68pEJs1	Nur Group	Nur Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
M0GIUzXoJDqw9l8	Oasis Fashion Ltd.	Oasis Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
G7FezP4N1QwhhcE	Ocean Sweater Ind:(Pvt) Ltd.	Ocean Sweater Ind:(Pvt) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9yUKVSYW4b8nXpO	Odyssey Craft (Pvt.) Ltd.	Odyssey Craft (Pvt.) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
YNMHGpINrORxFcE	Olympia International Fashion	Olympia International Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5gyIdfHZu2F1j1Q	Olympic Fashion Limited	Olympic Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xrcdTeUHj0WTkpp	Optimum Fashion Wear Ltd.	Optimum Fashion Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hAJ9CCfMaro8oBf	Orbit Style Bd	Orbit Style Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MXPpkYj28ezy7Lh	Pacific  Knitex Ltd. (Concern Of Pacific Jeans)	Pacific  Knitex Ltd. (Concern Of Pacific Jeans)	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5Bn8y3jEI1DM6Wn	Pacific Cotton Limited	Pacific Cotton Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
rQXJJyjSH4T65io	Pacific Cotton Ltd.	Pacific Cotton Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hnYH0IYmyO3rpVa	Padma Textiles Ltd.	Padma Textiles Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pHFkQuamxgpABrA	Palmal Group	Palmal Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
gBJl1AYehr01mQ2	Panam Group	Panam Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eaDqP62l3FsgpGm	Patriot Eco Apparel Ltd.	Patriot Eco Apparel Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
K4yX7vPwoMIhvjp	Pb Tex	Pb Tex	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bWYn2DQrPptUv8n	Peak Apparels Ltd.	Peak Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SwqEYw03Zx60bkw	Pearl Global Hk Ltd.	Pearl Global Hk Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AWCXxXgVA1NyG5r	Pearl Global(Norp Knit)	Pearl Global(Norp Knit)	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
frzkgHx2QSA18fp	Pentagon Knit Com Ltd.	Pentagon Knit Com Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
b2dZXikhZJMft1A	Pioneer Casual Wear Ltd.	Pioneer Casual Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
z8TLuRmnFnfWiB3	Pole Star Fashion Design Ltd.	Pole Star Fashion Design Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xb22WLaMEs9DDSU	Polo Composite Limited	Polo Composite Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
5M1xIvsz6NXUQ3G	Premier Exim	Premier Exim	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CSfoki8LetJ5mLt	Pretty Group	Pretty Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
924w3QFw3mKAnil	Prime Source Enterprises Ltd.	Prime Source Enterprises Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4Ce5gPjQwJS4gqU	Prime Sweater Limited	Prime Sweater Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7uVotbPj3EN4s54	Prime Sweaters Ltd.	Prime Sweaters Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tC3y09steo3GWQK	Primodial Industries Ltd.	Primodial Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
61tOfMqEmVgM2Ml	Prince Jacquard Sweater Ltd.	Prince Jacquard Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9lCeojrwJFWTeXs	Prisma Apparel	Prisma Apparel	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zbWdwLIgbY0PO6q	Probashi Knitwear Ltd.	Probashi Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GIJRO5dTHhgzbbP	Promoda Textile Ltd.	Promoda Textile Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eWxE7ChzgpqXiYZ	Provati Apparels Ltd.	Provati Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1FMvrg6UpArxDdc	Purbani Group	Purbani Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6BaZc7AUBFCX8s6	Pure Cotton	Pure Cotton	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nv6qDoL2ryw2BdF	Quazi Abedin Tex Ltd.	Quazi Abedin Tex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
r7FazRF9zMGWB0j	Quebec Collections	Quebec Collections	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AOKg0fLWOhThiL2	R S Trims Sourcing	R S Trims Sourcing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EOdf2xZT8hLkKR7	Rafa International Co.	Rafa International Co.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GgoysaqjQGxrEIi	Rahman Sports Wear Ltd.	Rahman Sports Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3dQcqLVMHbi6Hyv	Rahmat Knit	Rahmat Knit	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
O9EVhMfutakOogB	Ram Apparels Ltd.	Ram Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Jp78XlfLY4heaHH	Rashed Exports	Rashed Exports	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0SqAU4Ch2OhqqDB	Ratul Knitwear Ltd.	Ratul Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
o1q4oHMkWRd22yv	Reaz Knitwear Ltd.	Reaz Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tZbtNnLDuhSYXRh	Reliant Fashion	Reliant Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
V7oKRtggLWCjvDI	Revo Sourcing Bd	Revo Sourcing Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
m3odWGlmvnDoKlh	Rich Cotton Apparels Limited	Rich Cotton Apparels Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ejxse4Cqmf6rMqM	Rich Cotton Ltd.	Rich Cotton Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
f9QFnprGxHM7G3E	Ricowell Ltd.	Ricowell Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
U4OcEjxalt3PkwP	Rishab World Bd	Rishab World Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XQcjG9zgEqFZMyv	Riverside Sweater Ltd.	Riverside Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yDukSUe4TV4rnjF	Riya Trading	Riya Trading	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tFTnmUjchr5W8I4	Rose N Tex Ltd.	Rose N Tex Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
V3s9X2dXRrEcoyF	Rs Composite	Rs Composite	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SrGhlYTaybAaXI0	Rusayla Clothing	Rusayla Clothing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DxFbgMifexIms1z	S.B Knitting Ltd.	S.B Knitting Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
cFpCEMFsg5U46mR	S.M Knitwear Ltd.	S.M Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NAMHFSJkf1H425J	S.M. Knit Wears Ltd.	S.M. Knit Wears Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0Su40gWR3ZNwH6J	S.S Printers And Accesories	S.S Printers And Accesories	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dTUXWm0EQNDZ6kK	Sabah Designers	Sabah Designers	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aa2PPBbLrMykIbD	Sadat Apparels Ltd.	Sadat Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
i13fp29SccLLwn2	Sadat Outwears	Sadat Outwears	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
VNO3HKx4nPfgPiq	Samad Sweater Ltd.	Samad Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XHXtxz5ucO0srag	San Souring Ltd.	San Souring Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Z62gYCmZe2SR4MT	Sara Fashion Ltd.	Sara Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
HswQNFicxerXHkc	Sara Fashionwear Ltd.	Sara Fashionwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4xFctAx19Ni5aPD	Sardar Trims Ltd.	Sardar Trims Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GU0SNmGJLHzGFGe	Sayem Fashion Ltd.	Sayem Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3vLJ3OQUk3OcNn0	Saz Fashion Ltd.	Saz Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yoiz4MpIsKeo1Eo	Searock Apparels Ltd.	Searock Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9i6z6G0tS71VVQM	Seihin Fashion Ltd.	Seihin Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Ovt0ZZZFtj88oOP	Seven Links Apparels Ltd.	Seven Links Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TultpB1fMYrjNRE	Sf Sweaters Litd	Sf Sweaters Litd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
sRdhYWGlLBg3dbe	Shahara Exports Incorporation Ltd.	Shahara Exports Incorporation Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
7IqllK5x2g0MPaD	Shams Design	Shams Design	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EcpvPleeTQCd99c	Shams Design & Marketing	Shams Design & Marketing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wAfNoKIBUykmk9C	Shamser Knit Fashions Ltd.	Shamser Knit Fashions Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
clLlNEdoPsjuaMe	Shehan Specialized Textile Mills Ltd.	Shehan Specialized Textile Mills Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eZvdmuSledQTTyO	Shell Tex International	Shell Tex International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AdwUKe7OtR13vHR	Shimulia Fashion Wear	Shimulia Fashion Wear	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iL9sw1jbNIeseCc	Shinest Apparels Ltd.	Shinest Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pdHM9SE1LzbIwS6	Shinha Knit Industries Ltd.	Shinha Knit Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fkiuKhQkrFA76sk	Siatex Bd Ltd.	Siatex Bd Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
xjaiKaMVpD999gf	Signet Enterprise	Signet Enterprise	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
0dmGvZzi4W3Qs4q	Signet Entrprises Limited	Signet Entrprises Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bA4yoPlOKPFAgQk	Siji Garments	Siji Garments	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TjmkkMUTsYmb3a0	Silken Sewing Ltd.	Silken Sewing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1auQpyiYiNpr8ax	Simple Approach Ltd.	Simple Approach Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fNiDEBtyU84p2i3	Sisal Composite	Sisal Composite	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
SliAgX6ZBWXMKLc	Skr Attire Limited	Skr Attire Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aqHssiIDBherEmy	Smart Jeans Ltd.	Smart Jeans Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GY0vbfrW3yWjdby	Smile Apparels Ltd.	Smile Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
JM48R3U47xfXu5C	Sml Global Sourcing Limited	Sml Global Sourcing Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
EouhFTp59gFRnQX	Sms Mode Lid	Sms Mode Lid	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
RST21x5L6IgwNXo	Snow White Apparels Limited	Snow White Apparels Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
2om0uAk7aWXOPll	Soetex Bd	Soetex Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
t9JnAIQEodfBrD1	Sonia & Sweater Ltd.	Sonia & Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
35olvYP60iJCY7L	Southend Sweater Co. Ltd.	Southend Sweater Co. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fjSNPg5ifDAuW0w	Southern Clothing Ltd.	Southern Clothing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
okl76bIUu1dCeya	Space Sweater Limited.	Space Sweater Limited.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
L2KHYb4j5eRJ8ki	Sparkle Knit Composite Ltd.	Sparkle Knit Composite Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Lvcm2BfFINiOxhS	Spider Group	Spider Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AgIPmecJf9ZQbi1	Spot Fame Apparels Ltd.	Spot Fame Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
v5GDCE6ljmPYbcv	Square Apparels Ltd.	Square Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
yz6xOF49Pi8hsfe	Square Group	Square Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
6et5K49deylJETs	Srg Apparels Plc	Srg Apparels Plc	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ceSP6zJFD3YXpWm	Srp Sweater Ltd.	Srp Sweater Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
GinWWmmnRqSewGa	St Zipper	St Zipper	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
P5UhbyX82NLWBZ3	Standard Group	Standard Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Wh6qpbTWr1eVvUl	Starlet Apparels Ltd.	Starlet Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
LjnHoENx7v49bKa	Starlight Sweaters Ltd.	Starlight Sweaters Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Tbdt1GyLpgwCV1x	Stoffatex Fashion Ltd.	Stoffatex Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
WUpUN89RnuGudWU	Stoffatex Fashions Ltd.	Stoffatex Fashions Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aw2Y0VjdZbM7OnL	Stylesmyth San Apparels Ltd.	Stylesmyth San Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
h7RZ5LGTNRRTLQO	Sun Sourcing	Sun Sourcing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XeVBFPrNm3IWfHZ	Super Trims Manufacturing	Super Trims Manufacturing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
a05NsZoHy0NZPiO	Suxes Attire	Suxes Attire	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FkEtsQO68K6LqhX	Swan Jeans Ltd.	Swan Jeans Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XahyUaLSTkBBLJE	Sweater Tech	Sweater Tech	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Qs3yDsLsED58hbm	Synergies Source Bangladesh Ltd.	Synergies Source Bangladesh Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
54bbncRhhwszWKw	T.F Zipper	T.F Zipper	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
74ZtMUtJewtoi9c	Tamai Knit Fashion Limited	Tamai Knit Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DatZH3B1EGBHIhD	Tcw	Tcw	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
akxXgfUJW57hzQG	Team Group	Team Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
DlGklG2znrqUjyS	Techno Design	Techno Design	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AKM003W7wZ3wr60	Tekstil Fashion	Tekstil Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
foAUr20ddcDifyc	Temakaw Fashion	Temakaw Fashion	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
AFsgZZ9RNmeB8pE	Temakaw Fashion. Ltd.	Temakaw Fashion. Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FEIxxYqrkFvsBT3	Tex Arena Global	Tex Arena Global	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
3UPwjSt2nKD7iER	Tex Fashion Global	Tex Fashion Global	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kFaNOBoQdhXCRz0	Tex International Ltd.	Tex International Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Hs3gE60AeyUMflL	Tex Merchant Bd Limited	Tex Merchant Bd Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
aTiMcfryLAsZFov	Tex Tune Bangladesh Ltd.	Tex Tune Bangladesh Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jH63Es6Pco23Vsg	Tex Xpressions Bd	Tex Xpressions Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
bRODUuQPbK1z9Mc	Texeurop(Bd) Ltd.	Texeurop(Bd) Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
tmCtwRJjUgsro4q	Texeye Sourcing	Texeye Sourcing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XyNNbJP5G7o5xeV	Texland Bd	Texland Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
kVbX9UP8Pmx2w30	Texpro Sourcing Ltd.	Texpro Sourcing Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
9qCxsJUn5vFznif	Textown Group	Textown Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
98n5fIYPnnjRTXf	Texture Bd Limited	Texture Bd Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
TqZ4pKkLOklUQ0i	Tg321 Fashion Limited	Tg321 Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
XrCKHhIZHlSJHFr	The Impetus Gallery Ltd.	The Impetus Gallery Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eKGF3yQFOw2NLLM	The Source Expert	The Source Expert	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
UvApX70wLvCodvM	Thk Asia	Thk Asia	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
dUajEuGa4aTmmPF	Tivoli Apparels Ltd.	Tivoli Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fTWvCZWnNlWW1XH	Tm Designers Ltd.	Tm Designers Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vxMtGuxHgWowDXk	Tosrifa Industries Ltd.	Tosrifa Industries Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
CoaVNNddq151v7r	Total Fashion Ltd.	Total Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
W9oGMH9739iQJtV	Transform Tread International	Transform Tread International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jVnsvGYuBedpNPh	Trasco Apparels Ltd.	Trasco Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZJxqZowLa8xZko1	Tream Wear Ltd.	Tream Wear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
mSJbidowRX7gYrr	Trendz Fashion Bd	Trendz Fashion Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
wmbWbkEEibx8YIP	Trendz Fashion Limited	Trendz Fashion Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
1FCyIxXIno6gKzD	Triple Seven Apparels Ltd.	Triple Seven Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
4TP2DUSVplU8fwO	Tunic Apparels Ltd.	Tunic Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hMyk187OgPcOrgd	Tusuka Group	Tusuka Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MCWPzJ0zNNgFim7	Unicorn Trade International	Unicorn Trade International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
hquwzqflvWVKgi4	Unique Tex Bd	Unique Tex Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZTwyzmrjxVoJusH	United Knitwear Ltd.	United Knitwear Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NXxHGAiZ5uLAqLE	Unity Fabrics Ltd.	Unity Fabrics Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
zwLq0u2F66vzbzB	Urban Global Ltd.	Urban Global Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
FtdmbBMy2BfSVRR	Uttara Knitwear Limited	Uttara Knitwear Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
fHby99KlXzqttDf	Uttara Knitwears Ltd.	Uttara Knitwears Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
qqs813nWEQHoMkt	Valmont Sweater Limited	Valmont Sweater Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
QAOy6FI5muUj7yi	Vasper Sourcing	Vasper Sourcing	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NDtmmNPcNQsXRRA	Venture Bd	Venture Bd	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
llDtlEGQtooU0DQ	Venture Trim	Venture Trim	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
eszG7NRTrH1Zrr3	Versatile Creation Ltd.	Versatile Creation Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
ZCz9bXCGvgpxx3R	Virgo Mh Limited.	Virgo Mh Limited.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
Iil3qgcNI6BHu91	Vital Group	Vital Group	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
lCwQzD4W7d8d10P	W-Apparels	W-Apparels	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
vebjLBmRgLYNvFr	Wasfyia Apparels Ltd.	Wasfyia Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
MFZsL8fzzlVO5l7	Wave Riders Ltd.(Urmi Group)	Wave Riders Ltd.(Urmi Group)	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
jqEhTtow5UU3lLB	Wear Vibes	Wear Vibes	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
BTjyXfSkHTYhegp	West Apparels Ltd.	West Apparels Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
uOd5iII5mo6zDwz	Western Cotton Limited	Western Cotton Limited	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pvzFJcf7WkoaU4G	Wraps Clothes-Line Ltd.	Wraps Clothes-Line Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
NPZQ1DR7h6BcXy1	Yokoe Ind. Bangladesh	Yokoe Ind. Bangladesh	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
A3yBFfpCzreGH3J	Yungfung	Yungfung	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
iRBjWK573AxF3kS	Z.H Accessorise International	Z.H Accessorise International	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
nAisgDMR9EtQwXy	Zee Fashion Ltd.	Zee Fashion Ltd.	\N	2024-09-02 19:20:00	\N	igD0v9DIJQhJeet	\N
pT0ZnIQmFJNRAGV	OISHI DESIGNS LTD	OISHI DESIGNS LTD		2024-09-28 11:20:42	\N	IMPhbfmV3GUYSpi	2/1, MATBOR BARI ROAD, FAKIR MARKET, BORO DAWRA, TONGI, GAZIPUR, BANGLADESH.
fQqSH3VZKVnj76t	MEDLAR APPARELS  LTD.	MED		2024-09-28 11:35:58	\N	IMPhbfmV3GUYSpi	EAST- NARSHINDIPUR, UNION- YEARPUR, ASHULIA, SAVAR, DHAKA
pEEyMfqD2eryNQn	Islam Knit Designs Ltd.	Islam Knit Designs Ltd.		2024-09-28 12:01:42	\N	IMPhbfmV3GUYSpi	JARUN ROAD, KONABARI, GAZIPUR
Aq1utD2IqVUg7Tw	BARNALI TEXTILE & PRINTING IND. LTD.	BTP		2024-09-28 12:05:58	\N	IMPhbfmV3GUYSpi	285,(147/3 NEW),HAZARIBAG, GODNAIL,NARAYANGANJ-1432 BANGLADESH
WqNqkI8UqKXKQGE	Denim Venture Ltd	Denim Venture Ltd		2024-09-28 12:07:06	\N	IMPhbfmV3GUYSpi	UTTARA 14
85i2MRvHJlNuR9Y	ISOURCE YOUR GARMENTS	ISYG		2024-09-28 12:15:20	\N	IMPhbfmV3GUYSpi	House 06, Road 9B, Nikunja-1 , Khilkhet, Dhaka-1229, Bangladesh.
LAixMiJPRR9JYtj	FLORENCE GROUP	FG		2024-09-28 12:48:01	\N	IMPhbfmV3GUYSpi	ASHRAF SETU SHOPPING COMPLEX(2ND FLOOR), TONGI, GAZIPUR-1710
cf-daf86b3eedf1	Mayce  Of  Jolo Fashion	MJF   fadfasd	MJF	2024-09-03 14:38:04	2024-09-30 00:02:40	igD0v9DIJQhJeet	House No 16, Road No 2, Banani , Dhaka 1212
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (uuid, item_for, type, name, short_name, created_by, created_at, updated_at, remarks) FROM stdin;
bgYh7Dv2WqYY6no	zipper	lock_type	Auto Lock	AL	igD0v9DIJQhJeet	2024-08-11 21:51:35	\N	
bv33zMTct6AWrNP	zipper	stopper_type	Plastic	plastic	igD0v9DIJQhJeet	2024-08-11 21:54:54	\N	
dEVVEQQyuyH0chm	zipper	logo_type	FZL	FZL	igD0v9DIJQhJeet	2024-08-11 22:01:20	\N	
FKcl3GZF4Be0GqF	zipper	puller_type	Regular Puller	RP	igD0v9DIJQhJeet	2024-08-11 21:58:42	\N	
gQGJfFBMXm24dQJ	zipper	top_stopper	U Top	UTop	igD0v9DIJQhJeet	2024-08-11 22:00:29	\N	
LbID0d6H3jmWJDM	zipper	end_type	Open End	OE	igD0v9DIJQhJeet	2024-08-11 21:49:09	\N	
TjuNcvgu9S8dIZm	zipper	zipper_number	3	3	igD0v9DIJQhJeet	2024-08-11 21:47:26	\N	
U116BzwwVpd9JhV	zipper	color	Black	Black	igD0v9DIJQhJeet	2024-08-11 21:53:29	\N	
ZccaXVoOg6jkBT3	zipper	bottom_stopper	H Bottom	HBottom	igD0v9DIJQhJeet	2024-08-11 22:00:56	\N	
zTVTfgNTlR2Mn56	zipper	hand	Left Hand Puller	LHP	igD0v9DIJQhJeet	2024-08-11 22:01:45	\N	
TWuXzw338h0ht59	zipper	end_user	Male	male	igD0v9DIJQhJeet	2024-09-03 19:57:52	\N	
edTZmIl4gc53Ovm	zipper	end_user	Female	female	igD0v9DIJQhJeet	2024-09-03 19:58:07	\N	
xpz1ikvQ95VXFa0	zipper	garments_wash	garments	garments	igD0v9DIJQhJeet	2024-09-03 19:59:19	\N	
mkfqLzPw29iXjAf	zipper	light_preference	light preference	light preference	igD0v9DIJQhJeet	2024-09-03 19:59:39	\N	
jewvtnIrYJ5t7e5	zipper	puller_link	U link	U link	igD0v9DIJQhJeet	2024-09-03 20:01:29	\N	
0hSjjX1TuYx6sNP	zipper	item	Vislon	V	igD0v9DIJQhJeet	2024-09-08 17:51:05	\N	wow
eJujrClyQnVLwEb	zipper	zipper_number	8	8	igD0v9DIJQhJeet	2024-09-10 15:13:43	\N	testing
eE9nM0TDosBNqoT	zipper	end_type	Close End	CE	igD0v9DIJQhJeet	2024-09-03 16:17:49	2024-09-03 16:18:09	TESTS
dXuYENebmB2FRWr	zipper	lock_type	Semi Lock	SL	igD0v9DIJQhJeet	2024-09-03 19:41:00	\N	\N
MPPP3z03bkJf7dI	zipper	lock_type	No Lock	NL	igD0v9DIJQhJeet	2024-09-04 19:41:00	\N	\N
7alneHz7d3zLZoZ	zipper	item	Metal	M	igD0v9DIJQhJeet	2024-09-05 19:41:00	\N	\N
KmrRN5WBKZWYCtY	zipper	zipper_number	4	4	igD0v9DIJQhJeet	2024-09-06 19:41:00	\N	\N
6Vs8xVrvoEcfnWg	zipper	zipper_number	4.5	4.5	igD0v9DIJQhJeet	2024-09-07 19:41:00	\N	\N
NJIxKsOzEPNCT7p	zipper	zipper_number	5	5	igD0v9DIJQhJeet	2024-09-08 19:41:00	\N	\N
MCBl7HtOaudhuJc	zipper	puller_type	Normal	N	igD0v9DIJQhJeet	2024-09-09 19:41:00	\N	\N
p4opi8L52Buw4oA	zipper	puller_type	Thumb	T	igD0v9DIJQhJeet	2024-09-10 19:41:00	\N	\N
rGBabfXB7Cu35cy	zipper	puller_type	Special	S	igD0v9DIJQhJeet	2024-09-11 19:41:00	\N	\N
3CBeTQp6BaNVNIM	zipper	puller_type	Tear-Drop (Inv)	TD	igD0v9DIJQhJeet	2024-09-12 19:41:00	\N	\N
ow2BcARCfY5xZSg	zipper	puller_type	YG	YG	igD0v9DIJQhJeet	2024-09-13 19:41:00	\N	\N
orGAxqfL4Graz0i	zipper	puller_type	Rubber	R	igD0v9DIJQhJeet	2024-09-14 19:41:00	\N	\N
MSTCrn8MXsYFZDe	zipper	puller_type	Ring	Ri	igD0v9DIJQhJeet	2024-09-15 19:41:00	\N	\N
wr8fMNX589D8f37	zipper	puller_type	Fish Fabric	FFP	igD0v9DIJQhJeet	2024-09-16 19:41:00	\N	\N
ZhCcu6Eor0bQkq2	zipper	puller_type	Link	L	igD0v9DIJQhJeet	2024-09-17 19:41:00	\N	\N
RLgBRTTm2tu5d1W	zipper	puller_type	Bell	B	igD0v9DIJQhJeet	2024-09-18 19:41:00	\N	\N
uLu1BmiSoPXYpf3	zipper	puller_type	Tala	Tala	igD0v9DIJQhJeet	2024-09-19 19:41:00	\N	\N
f2Z8sbKck4MWdBy	zipper	puller_type	RI-RI	RI-RI	igD0v9DIJQhJeet	2024-09-20 19:41:00	\N	\N
swvMZGt2PRTo8tN	zipper	puller_type	Stick	S	igD0v9DIJQhJeet	2024-09-21 19:41:00	\N	\N
xSojCVwulzTUBZh	zipper	hand	Right Hand Puller	RHP	igD0v9DIJQhJeet	2024-09-23 19:41:00	\N	\N
vNowjNsfSVjHrCy	zipper	special_requirement	hand spray	hand spray	igD0v9DIJQhJeet	2024-09-28 19:41:00	\N	\N
T8X49zXtbCvDzIV	zipper	special_requirement	multi color tape	multi color tape	igD0v9DIJQhJeet	2024-10-04 19:41:00	\N	\N
oVFL8T2o6mAC9P6	zipper	color	Silver	Silver	igD0v9DIJQhJeet	2024-10-06 19:41:00	\N	\N
fmxqNuKiPncRpmB	zipper	color	Golden	Golden	igD0v9DIJQhJeet	2024-10-08 19:41:00	\N	\N
h3fvMiwrvPOXYXx	zipper	color	shiny silver	shiny silver	igD0v9DIJQhJeet	2024-10-09 19:41:00	\N	\N
isVgy6sSGW58ycJ	zipper	color	antique silver	antique silver	igD0v9DIJQhJeet	2024-10-10 19:41:00	\N	\N
qHeSl5NTgWEcXV7	zipper	color	antique brass	antique brass	igD0v9DIJQhJeet	2024-10-11 19:41:00	\N	\N
xVRGmjzrB4AKk4D	zipper	color	gun metal	gun metal	igD0v9DIJQhJeet	2024-10-12 19:41:00	\N	\N
rA6GiRi4lNdQz2z	zipper	color	antic copper	antic copper	igD0v9DIJQhJeet	2024-10-13 19:41:00	\N	\N
ayiW2un38SikZcq	zipper	color	Matt black	Matt black	igD0v9DIJQhJeet	2024-10-14 19:41:00	\N	\N
viDO9uns3Jasxqu	zipper	slider	Zinc	zinc	igD0v9DIJQhJeet	2024-08-11 22:00:07	2024-09-28 15:38:50	
5odI72veTwKXmqW	zipper	color	Dyed To Match	DTM	igD0v9DIJQhJeet	2024-10-07 19:41:00	2024-09-14 15:19:40	\N
KObQCyZEwpl1cIu	zipper	slider_link	Hook Link	hook-link	igD0v9DIJQhJeet	2024-09-03 20:01:44	2024-09-12 11:00:51	
ih3cjnU9jpLFoNE	zipper	slider_link	Teeth Link	teeth-link	igD0v9DIJQhJeet	2024-09-03 19:58:22	2024-09-12 11:01:42	
rROFRLbY9DtZdZp	zipper	slider_body_shape	Butterfly Body	butterfly-body	igD0v9DIJQhJeet	2024-09-03 19:59:03	2024-09-12 17:55:02	
1wBWyD4Bn2eeKFH	zipper	item	Nylon	N	igD0v9DIJQhJeet	2024-09-03 19:41:57	2024-09-14 14:25:55	test
uLZ5ivcFdciddYD	zipper	coloring_type	Electro-Plating	electro-plating	igD0v9DIJQhJeet	2024-08-11 21:59:45	2024-09-17 14:37:51	
ZWh2J5O89HVdf5k	zipper	puller_type	Love	LOVE	igD0v9DIJQhJeet	2024-09-22 19:41:00	2024-09-25 11:50:43	\N
Fk3xHUMFdl2otgz	zipper	color	Light Silver	Light Silver	igD0v9DIJQhJeet	2024-10-15 19:41:00	\N	\N
OAHEZQ0ZYedMMLS	zipper	color	Old Nickel	Old Nickel	igD0v9DIJQhJeet	2024-10-16 19:41:00	\N	\N
0daPuOQybNVbp83	zipper	color	Dull Silver	Dull Silver	igD0v9DIJQhJeet	2024-10-17 19:41:00	\N	\N
uUfVHQEcXHMffYP	zipper	color	gun color	gun color	igD0v9DIJQhJeet	2024-10-18 19:41:00	\N	\N
grhfGg7ncAweXPz	zipper	color	Antiq Nickel	Antiq Nickel	igD0v9DIJQhJeet	2024-10-19 19:41:00	\N	\N
r5vsRGY2pdMSXfP	zipper	color	Pearl Silver	Pearl Silver	igD0v9DIJQhJeet	2024-10-20 19:41:00	\N	\N
s6Hv3o71LdjZ0jX	zipper	color	Antiq gold	Antiq gold	igD0v9DIJQhJeet	2024-10-21 19:41:00	\N	\N
bl3icPB03yn8S4E	zipper	color	dull antiq silver	dull antiq silver	igD0v9DIJQhJeet	2024-10-22 19:41:00	\N	\N
Xu3x4nriywbgNho	zipper	color	SHINY EBONY	SHINY EBONY	igD0v9DIJQhJeet	2024-10-23 19:41:00	\N	\N
uQiLTbP5KvXtN2B	zipper	hand	No Hand	No Hand	igD0v9DIJQhJeet	2024-10-25 19:41:00	\N	\N
7v1Lb6JeMeGlpFl	zipper	color	Dark Matt Copper	Dark Matt Copper	igD0v9DIJQhJeet	2024-10-27 19:41:00	\N	\N
jPJlND9qCZck24l	zipper	coloring_type	Coating	Coating	igD0v9DIJQhJeet	2024-10-28 19:41:00	\N	\N
Q3Q7TPtJaKv7HEC	zipper	top_stopper	Zinc U	Zinc U	igD0v9DIJQhJeet	2024-10-29 19:41:00	\N	\N
WxFAbChTueJMDbV	zipper	logo_type	YKK	YKK	igD0v9DIJQhJeet	2024-10-30 19:41:00	\N	\N
9FHt26sVMsI2W7e	zipper	logo_type	Without	Without	igD0v9DIJQhJeet	2024-10-31 19:41:00	\N	\N
7S8BdkAagW9yUtj	zipper	bottom_stopper	wire	wire	igD0v9DIJQhJeet	2024-11-03 19:41:00	\N	\N
uaX5gICx7zPZyi5	zipper	bottom_stopper	metallic	metallic	igD0v9DIJQhJeet	2024-11-04 19:41:00	\N	\N
NmK2Wm3t0g2FsTx	zipper	bottom_stopper	plastic	plastic	igD0v9DIJQhJeet	2024-11-05 19:41:00	\N	\N
Go2ulhTZ8eEC73A	zipper	bottom_stopper	without	without	igD0v9DIJQhJeet	2024-11-06 19:41:00	\N	\N
UWgNi27pjRIfZ8N	zipper	slider	Brass	Brass	igD0v9DIJQhJeet	2024-11-07 19:41:00	\N	\N
qScc78R8uQNbS2h	zipper	color	pewter	pewter	igD0v9DIJQhJeet	2024-11-08 19:41:00	\N	\N
fvxg0WfMXwahT3d	zipper	slider	---	---	igD0v9DIJQhJeet	2024-11-09 19:41:00	\N	\N
X7gplUffaaJoruI	zipper	top_stopper	---	---	igD0v9DIJQhJeet	2024-11-10 19:41:00	\N	\N
SWExdoGCL9pd8tI	zipper	bottom_stopper	---	---	igD0v9DIJQhJeet	2024-11-11 19:41:00	\N	\N
1SKjwdgXKUbg0wb	zipper	color	shinny gun	shinny gun	igD0v9DIJQhJeet	2024-11-13 19:41:00	\N	\N
xkZTVPqUXRej84R	zipper	color	SHINNY GOLDEN	SHINNY GOLDEN	igD0v9DIJQhJeet	2024-11-14 19:41:00	\N	\N
Fs3I42bM8lVp2UD	zipper	color	AS PER SAMPLE	AS PER SAMPLE	igD0v9DIJQhJeet	2024-11-15 19:41:00	\N	\N
Z1hZ4sWFnuPXxv3	zipper	color	Dull Antique Brass	Dull Antique Brass	igD0v9DIJQhJeet	2024-11-16 19:41:00	\N	\N
qaaS78WTTECVNja	zipper	color	light antique silver	light antique silver	igD0v9DIJQhJeet	2024-11-17 19:41:00	\N	\N
a9WlOX8Bpt8oaia	zipper	end_type	2 Way	2-way	igD0v9DIJQhJeet	2024-09-12 10:53:59	\N	
maru6S9B0XODY3C	zipper	slider_link	M Link	m-link	igD0v9DIJQhJeet	2024-09-12 11:01:17	\N	
Fh4j3mS5PpWSqpx	zipper	puller_type	YG Puller	yg-puller	igD0v9DIJQhJeet	2024-09-12 11:05:52	\N	
rd1tFlSpX1ovYeh	zipper	color	Matt DTM	matt-dtm	igD0v9DIJQhJeet	2024-09-12 11:07:38	\N	
sNYK0ZrqUVZU2WH	zipper	stopper_type	F-Shape	f-shape	igD0v9DIJQhJeet	2024-09-12 18:09:57	\N	
bTEilCNEdVQdRTt	zipper	stopper_type	Without Stopper	without-stopper	igD0v9DIJQhJeet	2024-09-12 18:10:23	\N	
Ir9H9LKbCiAOYgL	zipper	stopper_type	Metal	metal	igD0v9DIJQhJeet	2024-09-12 18:10:54	\N	
WXgFh7PGt6Inuvy	zipper	slider_body_shape	Spring Body	spring-body	igD0v9DIJQhJeet	2024-09-12 18:14:49	\N	
4mHbD4jdO4p4wH1	zipper	puller_type	Reverse	reverse	igD0v9DIJQhJeet	2024-09-12 18:17:30	\N	
SQYWXSd7iSgzqB6	zipper	color	JET STREAM 11-0605	JET STREAM 11-0605	igD0v9DIJQhJeet	2024-09-16 11:31:12	\N	
FMftx2NF3ym5TmM	zipper	color	MAUVEGLOW 16-1617	MAUVEGLOW 16-1617	igD0v9DIJQhJeet	2024-09-16 11:31:50	\N	
gs1tiV2EQ8xOWAV	zipper	color	ROSE GOLD	ROSE GOLD	igD0v9DIJQhJeet	2024-09-16 11:32:49	\N	
LQTNqT15ntBsVLw	zipper	nylon_stopper	Invisible	I	igD0v9DIJQhJeet	2024-09-14 14:19:28	2024-09-16 14:05:51	
72ZqsLNjQwnERSO	zipper	nylon_stopper	Metallic	M	igD0v9DIJQhJeet	2024-09-14 14:19:10	2024-09-16 14:05:55	
HC4IYwD7aaHQjUZ	zipper	nylon_stopper	Plastic	P	igD0v9DIJQhJeet	2024-09-14 14:18:53	2024-09-16 14:06:00	
sKioreoKwIlTbQR	zipper	garments_wash	Garment 2	Garment 2	Kzha6MUjxDGgKfs	2024-09-16 14:54:21	\N	Garment 2
pWaNb1n67QL75ik	zipper	teeth_type	Normal	normal	\N	2024-09-18 12:05:00	\N	
DRPT0U9JmYQXTL1	zipper	teeth_type	Y-Teeth	y_teeth	\N	2024-09-18 12:05:42	\N	
jTHzoseKiH76YEa	zipper	bottom_stopper	Brass H	brass_h	igD0v9DIJQhJeet	2024-11-02 19:41:00	2024-09-25 01:02:44	\N
BIKtlkhGgMmGyZi	zipper	bottom_stopper	Zinc H	zinc_h	igD0v9DIJQhJeet	2024-11-01 19:41:00	2024-09-25 01:03:01	\N
2fXiGuDAVQyR9TD	zipper	teeth_type	Corn Teeth	ct	igD0v9DIJQhJeet	2024-09-26 18:29:29	\N	
Yu6raaX6LC3bRnE	zipper	puller_link	---	---	igD0v9DIJQhJeet	2024-09-26 18:33:24	\N	
yEGZreIYxyubkOi	zipper	color	ANY	ANY	IMPhbfmV3GUYSpi	2024-09-28 11:30:01	\N	
WCNoDpHCi60Gc4F	zipper	color	KHAKI	KHAKI	IMPhbfmV3GUYSpi	2024-09-28 11:38:42	\N	
xzpCuPOqKpUkgfW	zipper	color	NAVY	NAVY	IMPhbfmV3GUYSpi	2024-09-28 11:38:56	\N	
OvwIdyHqnhPXEgt	zipper	color	g7y5  remarkable blue	RE  BLUE	IMPhbfmV3GUYSpi	2024-09-28 11:44:34	\N	
mmIfDWGfbY6HMU8	zipper	color	JET  BLACK	BLACK	IMPhbfmV3GUYSpi	2024-09-28 11:45:10	\N	
yTR1crS5aP4b6FV	zipper	color	---	---	igD0v9DIJQhJeet	2024-09-28 11:57:40	\N	---
tbuDQXo8eBC02BA	zipper	color	HANGER PLATING	HP	IMPhbfmV3GUYSpi	2024-09-28 12:00:44	\N	
ji9VTCRNLslqeHj	zipper	color	SHINNY SILVER	SS	IMPhbfmV3GUYSpi	2024-09-28 12:01:18	\N	
Gwc16JMsPhfCBkb	zipper	color	DTM	DTM	IMPhbfmV3GUYSpi	2024-09-28 12:01:46	\N	
NIT8zzT9WSCyAqm	zipper	color	ROYAL BLUE	ROYAL BLUE	IMPhbfmV3GUYSpi	2024-09-28 12:03:36	\N	
K4DOTWNa9d4LoPS	zipper	color	15-1306 TCX OXFORD TAN	15-1306 TCX OXFORD TAN	IMPhbfmV3GUYSpi	2024-09-28 12:12:14	\N	
JRl8CwmNCYVr3G5	zipper	color	AA-580	AA-580	IMPhbfmV3GUYSpi	2024-09-28 12:12:35	\N	
pK7swOXWwE7zzXZ	zipper	color	BEIGE	BEIGE	IMPhbfmV3GUYSpi	2024-09-28 12:12:50	\N	
THl3XBUBWMGOcps	zipper	color	L-280	L-280	IMPhbfmV3GUYSpi	2024-09-28 12:12:54	\N	
EVGClHK3mmoPR4F	zipper	color	BLACK	BL	IMPhbfmV3GUYSpi	2024-09-28 12:13:04	\N	
Mlv54eUNSstOD2k	zipper	color	ROYAL BLUE	RB	IMPhbfmV3GUYSpi	2024-09-28 12:13:24	\N	
c9wzXnkGMYx91aQ	zipper	color	K-058	K-058	IMPhbfmV3GUYSpi	2024-09-28 12:13:25	\N	
nTUuqMg3uordXb5	zipper	puller_type	YG PULLER WITHOUT LOGO	YP WL	IMPhbfmV3GUYSpi	2024-09-28 12:45:02	\N	
jKHedUqRiy9yazL	zipper	color	09J  GREY	GREY	IMPhbfmV3GUYSpi	2024-09-28 12:45:44	\N	
\.


--
-- Data for Name: section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section (uuid, name, short_name, remarks) FROM stdin;
\.


--
-- Data for Name: description; Type: TABLE DATA; Schema: purchase; Owner: postgres
--

COPY purchase.description (uuid, vendor_uuid, is_local, lc_number, created_by, created_at, updated_at, remarks, id, challan_number) FROM stdin;
\.


--
-- Data for Name: entry; Type: TABLE DATA; Schema: purchase; Owner: postgres
--

COPY purchase.entry (uuid, purchase_description_uuid, material_uuid, quantity, price, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: vendor; Type: TABLE DATA; Schema: purchase; Owner: postgres
--

COPY purchase.vendor (uuid, name, contact_name, email, office_address, contact_number, remarks, created_at, updated_at, created_by) FROM stdin;
Yc7OMbqjYv7GNQb	Royal Factory	Md Abdur Rahman	abdurrahman@gmail.com	House no-10, Road 3, Block D, Banani	+8801782345671	Remarks	2024-09-16 19:21:48	2024-09-16 19:22:22	RL1xtJnYkxGrTMz
zev6Amzgv4cX86G	a	a	admin@fzl.com	sdssd	33123213213	sdsa	2024-09-25 13:16:06	\N	RL1xtJnYkxGrTMz
Bn0S1R837QHiQKF	zhejian hengyi	shakil			01878604394		2024-09-28 13:26:18	\N	jk8y1aKmYx2oY3O
jJJ9NWOACrq3enY	Qlq ent	polash			01878604393		2024-09-28 13:55:50	\N	jk8y1aKmYx2oY3O
\.


--
-- Data for Name: assembly_stock; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.assembly_stock (uuid, name, die_casting_body_uuid, die_casting_puller_uuid, die_casting_cap_uuid, die_casting_link_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
\.


--
-- Data for Name: coloring_transaction; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.coloring_transaction (uuid, stock_uuid, order_info_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
\.


--
-- Data for Name: die_casting; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.die_casting (uuid, name, item, zipper_number, end_type, puller_type, logo_type, slider_body_shape, slider_link, quantity, weight, pcs_per_kg, created_at, updated_at, remarks, quantity_in_sa, is_logo_body, is_logo_puller, type) FROM stdin;
\.


--
-- Data for Name: die_casting_production; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.die_casting_production (uuid, die_casting_uuid, mc_no, cavity_goods, cavity_defect, push, weight, order_description_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: die_casting_to_assembly_stock; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.die_casting_to_assembly_stock (uuid, assembly_stock_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
\.


--
-- Data for Name: die_casting_transaction; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.die_casting_transaction (uuid, die_casting_uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
\.


--
-- Data for Name: production; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.production (uuid, stock_uuid, production_quantity, wastage, section, created_by, created_at, updated_at, remarks, with_link, weight) FROM stdin;
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.stock (uuid, order_quantity, body_quantity, cap_quantity, puller_quantity, link_quantity, sa_prod, coloring_stock, coloring_prod, trx_to_finishing, u_top_quantity, h_bottom_quantity, box_pin_quantity, two_way_pin_quantity, created_at, updated_at, remarks, quantity_in_sa, order_description_uuid, finishing_stock) FROM stdin;
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.transaction (uuid, stock_uuid, trx_quantity, created_by, created_at, updated_at, remarks, from_section, to_section, assembly_stock_uuid, weight) FROM stdin;
\.


--
-- Data for Name: trx_against_stock; Type: TABLE DATA; Schema: slider; Owner: postgres
--

COPY slider.trx_against_stock (uuid, die_casting_uuid, quantity, created_by, created_at, updated_at, remarks, weight) FROM stdin;
\.


--
-- Data for Name: batch; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.batch (uuid, id, dyeing_operator, reason, category, status, pass_by, shift, dyeing_supervisor, coning_operator, coning_supervisor, coning_machines, created_by, created_at, updated_at, remarks, yarn_quantity, machine_uuid, lab_created_by, lab_created_at, lab_updated_at, yarn_issue_created_by, yarn_issue_created_at, yarn_issue_updated_at, is_drying_complete, drying_created_at, drying_updated_at, dyeing_created_by, dyeing_created_at, dyeing_updated_at, coning_created_by, coning_created_at, coning_updated_at, slot) FROM stdin;
\.


--
-- Data for Name: batch_entry; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.batch_entry (uuid, batch_uuid, order_entry_uuid, quantity, coning_production_quantity, coning_carton_quantity, created_at, updated_at, remarks, coning_created_at, coning_updated_at, transfer_quantity, transfer_carton_quantity) FROM stdin;
\.


--
-- Data for Name: batch_entry_production; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.batch_entry_production (uuid, batch_entry_uuid, production_quantity, coning_carton_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: batch_entry_trx; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.batch_entry_trx (uuid, batch_entry_uuid, quantity, created_by, created_at, updated_at, remarks, carton_quantity) FROM stdin;
\.


--
-- Data for Name: challan; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.challan (uuid, order_info_uuid, carton_quantity, created_by, created_at, updated_at, remarks, assign_to, gate_pass, received) FROM stdin;
\.


--
-- Data for Name: challan_entry; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.challan_entry (uuid, challan_uuid, order_entry_uuid, quantity, created_by, created_at, updated_at, remarks, carton_quantity, short_quantity, reject_quantity) FROM stdin;
\.


--
-- Data for Name: count_length; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.count_length (uuid, count, sst, created_by, created_at, updated_at, remarks, min_weight, max_weight, length, price, cone_per_carton) FROM stdin;
KBLu6r1TcGxyCaO	30/3	sst	igD0v9DIJQhJeet	2024-09-18 19:59:10	2024-09-29 15:15:08		30.0000	40.0000	2500	150.0000	50
VBheEDMA8rRw3aj	60/3	sst	igD0v9DIJQhJeet	2024-09-22 15:25:26	2024-09-29 15:16:04		0.0930	0.0970	2500	0.0000	60
NMsJ6hNDVPemv6F	50/2	sadasdas	RL1xtJnYkxGrTMz	2024-09-29 12:03:11	2024-09-29 15:17:23		0.1150	0.1170	4000	500.0000	72
WiOwCaQLmDFcZFg	60/2	sst	igD0v9DIJQhJeet	2024-09-22 15:24:38	2024-09-29 15:17:47		0.1080	0.1120	5000	0.0000	72
\.


--
-- Data for Name: dyes_category; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.dyes_category (uuid, name, upto_percentage, bleaching, id, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: order_entry; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.order_entry (uuid, order_info_uuid, lab_reference, color, po, style, count_length_uuid, quantity, company_price, party_price, swatch_approval_date, production_quantity, created_by, created_at, updated_at, remarks, bleaching, transfer_quantity, recipe_uuid, pi, delivered, warehouse, short_quantity, reject_quantity, production_quantity_in_kg, carton_quantity) FROM stdin;
\.


--
-- Data for Name: order_info; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.order_info (uuid, id, party_uuid, marketing_uuid, factory_uuid, merchandiser_uuid, buyer_uuid, is_sample, is_bill, delivery_date, created_by, created_at, updated_at, remarks, is_cash) FROM stdin;
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: thread; Owner: postgres
--

COPY thread.programs (uuid, dyes_category_uuid, material_uuid, quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: batch; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.batch (uuid, id, created_by, created_at, updated_at, remarks, batch_status, machine_uuid, slot, received) FROM stdin;
\.


--
-- Data for Name: batch_entry; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.batch_entry (uuid, batch_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks, sfg_uuid) FROM stdin;
\.


--
-- Data for Name: batch_production; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.batch_production (uuid, batch_entry_uuid, production_quantity, production_quantity_in_kg, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: dyed_tape_transaction; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.dyed_tape_transaction (uuid, order_description_uuid, colors, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: dyed_tape_transaction_from_stock; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.dyed_tape_transaction_from_stock (uuid, order_description_uuid, trx_quantity, tape_coil_uuid, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: dying_batch; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.dying_batch (uuid, id, mc_no, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: dying_batch_entry; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.dying_batch_entry (uuid, dying_batch_uuid, batch_entry_uuid, quantity, production_quantity, production_quantity_in_kg, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: material_trx_against_order_description; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.material_trx_against_order_description (uuid, order_description_uuid, material_uuid, trx_to, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: order_description; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.order_description (uuid, order_info_uuid, item, zipper_number, end_type, lock_type, puller_type, teeth_color, puller_color, special_requirement, hand, coloring_type, slider_provided, slider, slider_starting_section_enum, top_stopper, bottom_stopper, logo_type, is_logo_body, is_logo_puller, description, status, created_at, updated_at, remarks, slider_body_shape, slider_link, end_user, garment, light_preference, garments_wash, created_by, garments_remarks, tape_received, tape_transferred, slider_finishing_stock, nylon_stopper, tape_coil_uuid, teeth_type) FROM stdin;
\.


--
-- Data for Name: order_entry; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.order_entry (uuid, order_description_uuid, style, color, size, quantity, company_price, party_price, status, swatch_status_enum, swatch_approval_date, created_at, updated_at, remarks, bleaching) FROM stdin;
\.


--
-- Data for Name: order_info; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.order_info (uuid, id, reference_order_info_uuid, buyer_uuid, party_uuid, marketing_uuid, merchandiser_uuid, factory_uuid, is_sample, is_bill, is_cash, marketing_priority, factory_priority, status, created_by, created_at, updated_at, remarks, conversion_rate, print_in) FROM stdin;
\.


--
-- Data for Name: planning; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.planning (week, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: planning_entry; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.planning_entry (uuid, sfg_uuid, sno_quantity, factory_quantity, production_quantity, batch_production_quantity, created_at, updated_at, planning_week, sno_remarks, factory_remarks) FROM stdin;
\.


--
-- Data for Name: sfg; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.sfg (uuid, order_entry_uuid, recipe_uuid, dying_and_iron_prod, teeth_molding_stock, teeth_molding_prod, teeth_coloring_stock, teeth_coloring_prod, finishing_stock, finishing_prod, coloring_prod, warehouse, delivered, pi, remarks, short_quantity, reject_quantity) FROM stdin;
\.


--
-- Data for Name: sfg_production; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.sfg_production (uuid, sfg_uuid, section, production_quantity_in_kg, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: sfg_transaction; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.sfg_transaction (uuid, trx_from, trx_to, trx_quantity, slider_item_uuid, created_by, created_at, updated_at, remarks, sfg_uuid, trx_quantity_in_kg) FROM stdin;
\.


--
-- Data for Name: tape_coil; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.tape_coil (uuid, quantity, trx_quantity_in_coil, quantity_in_coil, remarks, item_uuid, zipper_number_uuid, name, raw_per_kg_meter, dyed_per_kg_meter, created_by, created_at, updated_at, is_import, is_reverse, trx_quantity_in_dying, stock_quantity) FROM stdin;
jztwOSkVzbK1cdp	0.0000	0.0000	100.0000		1wBWyD4Bn2eeKFH	NJIxKsOzEPNCT7p	#5 Nylon Long Chain (Reverse)	57.2400	56.2700	igD0v9DIJQhJeet	2024-09-16 12:25:51	\N	\N	reverse	0.0000	0.0000
wD8prbutCVFkZjQ	1400.0000	3867.0000	2894.4440		1wBWyD4Bn2eeKFH	NJIxKsOzEPNCT7p	#5 Nylon Long Chain (Front)	59.4000	56.3700	igD0v9DIJQhJeet	2024-09-16 12:25:12	\N	\N	forward	527.0000	490.0000
wVOFhnezqNyj6xJ	300.0000	0.0000	0.0000		0hSjjX1TuYx6sNP	eJujrClyQnVLwEb	#8 vislon tape	56.9200	55.9200	jk8y1aKmYx2oY3O	2024-09-28 13:40:12	2024-09-29 16:07:51	0	none	0.0000	0.0000
cIGDDofltcdaNKQ	99.0000	0.0000	0.0000		7alneHz7d3zLZoZ	eJujrClyQnVLwEb	#8 Metal	100.0000	90.0000	Kzha6MUjxDGgKfs	2024-09-24 11:43:33	\N	0	none	0.0000	0.0000
VvnPX1FVCb8M7P3	200.0000	0.0000	0.0000		7alneHz7d3zLZoZ	eJujrClyQnVLwEb	#8 metal tape	57.0000	56.0000	jk8y1aKmYx2oY3O	2024-09-28 13:41:31	2024-09-29 16:08:04	0	none	0.0000	0.0000
kil5YxmHUMUJsSB	1090.9990	0.0000	0.0000		0hSjjX1TuYx6sNP	TjuNcvgu9S8dIZm	#3 Vislon Tape	108.6900	105.8000	RL1xtJnYkxGrTMz	2024-09-14 16:06:40	\N	0	none	0.0000	2.0000
hNglHy9HZHjyH3F	489.5000	0.0000	0.0000	Remarks	7alneHz7d3zLZoZ	TjuNcvgu9S8dIZm	#3 Metal Zipper Tape	102.0000	99.0000	RL1xtJnYkxGrTMz	2024-09-12 16:24:46	2024-09-18 13:15:49	1	reverse	0.0000	66.4000
ZRheI3jRxeJVq3H	10.0000	0.0000	20.0000		1wBWyD4Bn2eeKFH	TjuNcvgu9S8dIZm	#3 Nylon Long Chain Front	59.4000	56.3700	RL1xtJnYkxGrTMz	2024-09-14 16:10:12	2024-09-14 16:47:51	0	forward	0.0000	0.0000
dGwoRulpe3N4Nge	0.0000	0.0000	0.0000		1wBWyD4Bn2eeKFH	TjuNcvgu9S8dIZm	#3 Nylon Zipper Long Chain	92.8500	91.3700	RL1xtJnYkxGrTMz	2024-09-12 16:28:51	2024-09-14 13:33:06	1	forward	0.0000	0.0000
4SttnOS63iPVGhz	0.0000	0.0000	0.0000		0hSjjX1TuYx6sNP	NJIxKsOzEPNCT7p	#5 Vislon Tape	86.8000	85.8000	RL1xtJnYkxGrTMz	2024-09-14 16:04:05	\N	0	none	0.0000	0.0000
Qv1lnlPOOmR6L3J	377.0000	218.0000	405.0000		1wBWyD4Bn2eeKFH	TjuNcvgu9S8dIZm	#3 nylon tape reverse	100.0000	55.0000	jk8y1aKmYx2oY3O	2024-09-28 12:35:00	\N	0	reverse	0.0000	0.0000
\.


--
-- Data for Name: tape_coil_production; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.tape_coil_production (uuid, section, tape_coil_uuid, production_quantity, wastage, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: tape_coil_required; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.tape_coil_required (uuid, end_type_uuid, item_uuid, nylon_stopper_uuid, zipper_number_uuid, top, bottom, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: tape_coil_to_dyeing; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.tape_coil_to_dyeing (uuid, tape_coil_uuid, order_description_uuid, trx_quantity, created_by, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: tape_trx; Type: TABLE DATA; Schema: zipper; Owner: postgres
--

COPY zipper.tape_trx (uuid, tape_coil_uuid, trx_quantity, created_by, created_at, updated_at, remarks, to_section) FROM stdin;
\.


--
-- Name: lc_sequence; Type: SEQUENCE SET; Schema: commercial; Owner: postgres
--

SELECT pg_catalog.setval('commercial.lc_sequence', 1, true);


--
-- Name: pi_sequence; Type: SEQUENCE SET; Schema: commercial; Owner: postgres
--

SELECT pg_catalog.setval('commercial.pi_sequence', 1, true);


--
-- Name: challan_sequence; Type: SEQUENCE SET; Schema: delivery; Owner: postgres
--

SELECT pg_catalog.setval('delivery.challan_sequence', 1, true);


--
-- Name: packing_list_sequence; Type: SEQUENCE SET; Schema: delivery; Owner: postgres
--

SELECT pg_catalog.setval('delivery.packing_list_sequence', 1, true);


--
-- Name: migrations_details_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.migrations_details_id_seq', 131, true);


--
-- Name: info_id_seq; Type: SEQUENCE SET; Schema: lab_dip; Owner: postgres
--

SELECT pg_catalog.setval('lab_dip.info_id_seq', 1, true);


--
-- Name: recipe_id_seq; Type: SEQUENCE SET; Schema: lab_dip; Owner: postgres
--

SELECT pg_catalog.setval('lab_dip.recipe_id_seq', 1, true);


--
-- Name: shade_recipe_sequence; Type: SEQUENCE SET; Schema: lab_dip; Owner: postgres
--

SELECT pg_catalog.setval('lab_dip.shade_recipe_sequence', 1, true);


--
-- Name: purchase_description_sequence; Type: SEQUENCE SET; Schema: purchase; Owner: postgres
--

SELECT pg_catalog.setval('purchase.purchase_description_sequence', 1, true);


--
-- Name: thread_batch_sequence; Type: SEQUENCE SET; Schema: thread; Owner: postgres
--

SELECT pg_catalog.setval('thread.thread_batch_sequence', 1, true);


--
-- Name: thread_order_info_sequence; Type: SEQUENCE SET; Schema: thread; Owner: postgres
--

SELECT pg_catalog.setval('thread.thread_order_info_sequence', 1, true);


--
-- Name: batch_id_seq; Type: SEQUENCE SET; Schema: zipper; Owner: postgres
--

SELECT pg_catalog.setval('zipper.batch_id_seq', 1, true);


--
-- Name: dying_batch_id_seq; Type: SEQUENCE SET; Schema: zipper; Owner: postgres
--

SELECT pg_catalog.setval('zipper.dying_batch_id_seq', 1, false);


--
-- Name: order_info_sequence; Type: SEQUENCE SET; Schema: zipper; Owner: postgres
--

SELECT pg_catalog.setval('zipper.order_info_sequence', 1, true);


--
-- Name: bank bank_pkey; Type: CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (uuid);


--
-- Name: lc lc_pkey; Type: CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_pkey PRIMARY KEY (uuid);


--
-- Name: pi_cash_entry pi_cash_entry_pkey; Type: CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pkey PRIMARY KEY (uuid);


--
-- Name: pi_cash pi_cash_pkey; Type: CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_pkey PRIMARY KEY (uuid);


--
-- Name: challan_entry challan_entry_pkey; Type: CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);


--
-- Name: challan challan_pkey; Type: CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);


--
-- Name: packing_list_entry packing_list_entry_pkey; Type: CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_pkey PRIMARY KEY (uuid);


--
-- Name: packing_list packing_list_pkey; Type: CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_pkey PRIMARY KEY (uuid);


--
-- Name: migrations_details migrations_details_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.migrations_details
    ADD CONSTRAINT migrations_details_pkey PRIMARY KEY (id);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (uuid);


--
-- Name: designation designation_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (uuid);


--
-- Name: policy_and_notice policy_and_notice_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_pkey PRIMARY KEY (uuid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);


--
-- Name: info info_pkey; Type: CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);


--
-- Name: recipe_entry recipe_entry_pkey; Type: CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_pkey PRIMARY KEY (uuid);


--
-- Name: recipe recipe_pkey; Type: CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (uuid);


--
-- Name: shade_recipe_entry shade_recipe_entry_pkey; Type: CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_pkey PRIMARY KEY (uuid);


--
-- Name: shade_recipe shade_recipe_pkey; Type: CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_pkey PRIMARY KEY (uuid);


--
-- Name: info info_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (uuid);


--
-- Name: section section_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);


--
-- Name: stock_to_sfg stock_to_sfg_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_pkey PRIMARY KEY (uuid);


--
-- Name: trx trx_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_pkey PRIMARY KEY (uuid);


--
-- Name: type type_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (uuid);


--
-- Name: used used_pkey; Type: CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_pkey PRIMARY KEY (uuid);


--
-- Name: buyer buyer_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_name_unique UNIQUE (name);


--
-- Name: buyer buyer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (uuid);


--
-- Name: factory factory_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_name_unique UNIQUE (name);


--
-- Name: factory factory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_pkey PRIMARY KEY (uuid);


--
-- Name: machine machine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (uuid);


--
-- Name: marketing marketing_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_name_unique UNIQUE (name);


--
-- Name: marketing marketing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_pkey PRIMARY KEY (uuid);


--
-- Name: merchandiser merchandiser_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_name_unique UNIQUE (name);


--
-- Name: merchandiser merchandiser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_pkey PRIMARY KEY (uuid);


--
-- Name: party party_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_name_unique UNIQUE (name);


--
-- Name: party party_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (uuid);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (uuid);


--
-- Name: section section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (uuid);


--
-- Name: description description_pkey; Type: CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (uuid);


--
-- Name: entry entry_pkey; Type: CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (uuid);


--
-- Name: vendor vendor_pkey; Type: CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (uuid);


--
-- Name: assembly_stock assembly_stock_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_pkey PRIMARY KEY (uuid);


--
-- Name: coloring_transaction coloring_transaction_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_pkey PRIMARY KEY (uuid);


--
-- Name: die_casting die_casting_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_pkey PRIMARY KEY (uuid);


--
-- Name: die_casting_production die_casting_production_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_pkey PRIMARY KEY (uuid);


--
-- Name: die_casting_to_assembly_stock die_casting_to_assembly_stock_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_pkey PRIMARY KEY (uuid);


--
-- Name: die_casting_transaction die_casting_transaction_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_pkey PRIMARY KEY (uuid);


--
-- Name: production production_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (uuid);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (uuid);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);


--
-- Name: trx_against_stock trx_against_stock_pkey; Type: CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_pkey PRIMARY KEY (uuid);


--
-- Name: batch_entry batch_entry_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);


--
-- Name: batch_entry_production batch_entry_production_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_pkey PRIMARY KEY (uuid);


--
-- Name: batch_entry_trx batch_entry_trx_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_pkey PRIMARY KEY (uuid);


--
-- Name: batch batch_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);


--
-- Name: challan_entry challan_entry_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_pkey PRIMARY KEY (uuid);


--
-- Name: challan challan_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_pkey PRIMARY KEY (uuid);


--
-- Name: count_length count_length_uuid_pk; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_uuid_pk PRIMARY KEY (uuid);


--
-- Name: dyes_category dyes_category_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_pkey PRIMARY KEY (uuid);


--
-- Name: order_entry order_entry_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);


--
-- Name: order_info order_info_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (uuid);


--
-- Name: batch_entry batch_entry_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_pkey PRIMARY KEY (uuid);


--
-- Name: batch batch_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (uuid);


--
-- Name: batch_production batch_production_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_pkey PRIMARY KEY (uuid);


--
-- Name: dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_pkey PRIMARY KEY (uuid);


--
-- Name: dyed_tape_transaction dyed_tape_transaction_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_pkey PRIMARY KEY (uuid);


--
-- Name: dying_batch_entry dying_batch_entry_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_pkey PRIMARY KEY (uuid);


--
-- Name: dying_batch dying_batch_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dying_batch
    ADD CONSTRAINT dying_batch_pkey PRIMARY KEY (uuid);


--
-- Name: material_trx_against_order_description material_trx_against_order_description_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_pkey PRIMARY KEY (uuid);


--
-- Name: order_description order_description_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_pkey PRIMARY KEY (uuid);


--
-- Name: order_entry order_entry_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_pkey PRIMARY KEY (uuid);


--
-- Name: order_info order_info_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_pkey PRIMARY KEY (uuid);


--
-- Name: planning_entry planning_entry_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_pkey PRIMARY KEY (uuid);


--
-- Name: planning planning_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_pkey PRIMARY KEY (week);


--
-- Name: sfg sfg_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_pkey PRIMARY KEY (uuid);


--
-- Name: sfg_production sfg_production_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_pkey PRIMARY KEY (uuid);


--
-- Name: sfg_transaction sfg_transaction_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_pkey PRIMARY KEY (uuid);


--
-- Name: tape_coil tape_coil_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_pkey PRIMARY KEY (uuid);


--
-- Name: tape_coil_production tape_coil_production_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_pkey PRIMARY KEY (uuid);


--
-- Name: tape_coil_required tape_coil_required_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_pkey PRIMARY KEY (uuid);


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_pkey PRIMARY KEY (uuid);


--
-- Name: tape_trx tape_to_coil_pkey; Type: CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_pkey PRIMARY KEY (uuid);


--
-- Name: pi_cash_entry sfg_after_commercial_pi_entry_delete_trigger; Type: TRIGGER; Schema: commercial; Owner: postgres
--

CREATE TRIGGER sfg_after_commercial_pi_entry_delete_trigger AFTER DELETE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_delete_function();


--
-- Name: pi_cash_entry sfg_after_commercial_pi_entry_insert_trigger; Type: TRIGGER; Schema: commercial; Owner: postgres
--

CREATE TRIGGER sfg_after_commercial_pi_entry_insert_trigger AFTER INSERT ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_insert_function();


--
-- Name: pi_cash_entry sfg_after_commercial_pi_entry_update_trigger; Type: TRIGGER; Schema: commercial; Owner: postgres
--

CREATE TRIGGER sfg_after_commercial_pi_entry_update_trigger AFTER UPDATE ON commercial.pi_cash_entry FOR EACH ROW EXECUTE FUNCTION commercial.sfg_after_commercial_pi_entry_update_function();


--
-- Name: challan_entry packing_list_after_challan_entry_delete; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER packing_list_after_challan_entry_delete AFTER DELETE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_delete_function();


--
-- Name: challan_entry packing_list_after_challan_entry_insert; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER packing_list_after_challan_entry_insert AFTER INSERT ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_insert_function();


--
-- Name: challan_entry packing_list_after_challan_entry_update; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER packing_list_after_challan_entry_update AFTER UPDATE ON delivery.challan_entry FOR EACH ROW EXECUTE FUNCTION delivery.packing_list_after_challan_entry_update_function();


--
-- Name: packing_list_entry sfg_after_challan_receive_status_delete; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER sfg_after_challan_receive_status_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_delete_function();


--
-- Name: packing_list_entry sfg_after_challan_receive_status_insert; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER sfg_after_challan_receive_status_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_insert_function();


--
-- Name: packing_list_entry sfg_after_challan_receive_status_update; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER sfg_after_challan_receive_status_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_challan_receive_status_update_function();


--
-- Name: packing_list_entry sfg_after_packing_list_entry_delete; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER sfg_after_packing_list_entry_delete AFTER DELETE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_delete_function();


--
-- Name: packing_list_entry sfg_after_packing_list_entry_insert; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER sfg_after_packing_list_entry_insert AFTER INSERT ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_insert_function();


--
-- Name: packing_list_entry sfg_after_packing_list_entry_update; Type: TRIGGER; Schema: delivery; Owner: postgres
--

CREATE TRIGGER sfg_after_packing_list_entry_update AFTER UPDATE ON delivery.packing_list_entry FOR EACH ROW EXECUTE FUNCTION delivery.sfg_after_packing_list_entry_update_function();


--
-- Name: info material_stock_after_material_info_delete; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_info_delete AFTER DELETE ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_delete();


--
-- Name: info material_stock_after_material_info_insert; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_info_insert AFTER INSERT ON material.info FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_info_insert();


--
-- Name: trx material_stock_after_material_trx_delete; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_trx_delete AFTER DELETE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_delete();


--
-- Name: trx material_stock_after_material_trx_insert; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_trx_insert AFTER INSERT ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_insert();


--
-- Name: trx material_stock_after_material_trx_update; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_trx_update AFTER UPDATE ON material.trx FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_trx_update();


--
-- Name: used material_stock_after_material_used_delete; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_used_delete AFTER DELETE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_delete();


--
-- Name: used material_stock_after_material_used_insert; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_used_insert AFTER INSERT ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_insert();


--
-- Name: used material_stock_after_material_used_update; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_after_material_used_update AFTER UPDATE ON material.used FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_material_used_update();


--
-- Name: stock_to_sfg material_stock_sfg_after_stock_to_sfg_delete; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_delete AFTER DELETE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_delete();


--
-- Name: stock_to_sfg material_stock_sfg_after_stock_to_sfg_insert; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_insert AFTER INSERT ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_insert();


--
-- Name: stock_to_sfg material_stock_sfg_after_stock_to_sfg_update; Type: TRIGGER; Schema: material; Owner: postgres
--

CREATE TRIGGER material_stock_sfg_after_stock_to_sfg_update AFTER UPDATE ON material.stock_to_sfg FOR EACH ROW EXECUTE FUNCTION material.material_stock_sfg_after_stock_to_sfg_update();


--
-- Name: entry material_stock_after_purchase_entry_delete; Type: TRIGGER; Schema: purchase; Owner: postgres
--

CREATE TRIGGER material_stock_after_purchase_entry_delete AFTER DELETE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_delete();


--
-- Name: entry material_stock_after_purchase_entry_insert; Type: TRIGGER; Schema: purchase; Owner: postgres
--

CREATE TRIGGER material_stock_after_purchase_entry_insert AFTER INSERT ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_insert();


--
-- Name: entry material_stock_after_purchase_entry_update; Type: TRIGGER; Schema: purchase; Owner: postgres
--

CREATE TRIGGER material_stock_after_purchase_entry_update AFTER UPDATE ON purchase.entry FOR EACH ROW EXECUTE FUNCTION material.material_stock_after_purchase_entry_update();


--
-- Name: die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_delete AFTER DELETE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_delete_funct();


--
-- Name: die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_insert AFTER INSERT ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_insert_funct();


--
-- Name: die_casting_to_assembly_stock assembly_stock_after_die_casting_to_assembly_stock_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER assembly_stock_after_die_casting_to_assembly_stock_update AFTER UPDATE ON slider.die_casting_to_assembly_stock FOR EACH ROW EXECUTE FUNCTION slider.assembly_stock_after_die_casting_to_assembly_stock_update_funct();


--
-- Name: die_casting_production slider_die_casting_after_die_casting_production_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_die_casting_after_die_casting_production_delete AFTER DELETE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_delete();


--
-- Name: die_casting_production slider_die_casting_after_die_casting_production_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_die_casting_after_die_casting_production_insert AFTER INSERT ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_insert();


--
-- Name: die_casting_production slider_die_casting_after_die_casting_production_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_die_casting_after_die_casting_production_update AFTER UPDATE ON slider.die_casting_production FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_die_casting_production_update();


--
-- Name: trx_against_stock slider_die_casting_after_trx_against_stock_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_die_casting_after_trx_against_stock_delete AFTER DELETE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_delete();


--
-- Name: trx_against_stock slider_die_casting_after_trx_against_stock_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_die_casting_after_trx_against_stock_insert AFTER INSERT ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_insert();


--
-- Name: trx_against_stock slider_die_casting_after_trx_against_stock_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_die_casting_after_trx_against_stock_update AFTER UPDATE ON slider.trx_against_stock FOR EACH ROW EXECUTE FUNCTION slider.slider_die_casting_after_trx_against_stock_update();


--
-- Name: coloring_transaction slider_stock_after_coloring_transaction_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_coloring_transaction_delete AFTER DELETE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_delete();


--
-- Name: coloring_transaction slider_stock_after_coloring_transaction_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_coloring_transaction_insert AFTER INSERT ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_insert();


--
-- Name: coloring_transaction slider_stock_after_coloring_transaction_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_coloring_transaction_update AFTER UPDATE ON slider.coloring_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_coloring_transaction_update();


--
-- Name: die_casting_transaction slider_stock_after_die_casting_transaction_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_die_casting_transaction_delete AFTER DELETE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_delete();


--
-- Name: die_casting_transaction slider_stock_after_die_casting_transaction_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_die_casting_transaction_insert AFTER INSERT ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_insert();


--
-- Name: die_casting_transaction slider_stock_after_die_casting_transaction_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_die_casting_transaction_update AFTER UPDATE ON slider.die_casting_transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_die_casting_transaction_update();


--
-- Name: production slider_stock_after_slider_production_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_slider_production_delete AFTER DELETE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_delete();


--
-- Name: production slider_stock_after_slider_production_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_slider_production_insert AFTER INSERT ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_insert();


--
-- Name: production slider_stock_after_slider_production_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_slider_production_update AFTER UPDATE ON slider.production FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_slider_production_update();


--
-- Name: transaction slider_stock_after_transaction_delete; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_transaction_delete AFTER DELETE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_delete();


--
-- Name: transaction slider_stock_after_transaction_insert; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_transaction_insert AFTER INSERT ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_insert();


--
-- Name: transaction slider_stock_after_transaction_update; Type: TRIGGER; Schema: slider; Owner: postgres
--

CREATE TRIGGER slider_stock_after_transaction_update AFTER UPDATE ON slider.transaction FOR EACH ROW EXECUTE FUNCTION slider.slider_stock_after_transaction_update();


--
-- Name: batch order_entry_after_batch_is_drying_update_function; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER order_entry_after_batch_is_drying_update_function AFTER UPDATE ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_drying_update();


--
-- Name: batch order_entry_after_batch_is_dyeing_update_function; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER order_entry_after_batch_is_dyeing_update_function AFTER UPDATE OF is_drying_complete ON thread.batch FOR EACH ROW EXECUTE FUNCTION thread.order_entry_after_batch_is_dyeing_update();


--
-- Name: batch_entry_production thread_batch_entry_after_batch_entry_production_delete; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER thread_batch_entry_after_batch_entry_production_delete AFTER DELETE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_delete_funct();


--
-- Name: batch_entry_production thread_batch_entry_after_batch_entry_production_insert; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER thread_batch_entry_after_batch_entry_production_insert AFTER INSERT ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_insert_funct();


--
-- Name: batch_entry_production thread_batch_entry_after_batch_entry_production_update; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER thread_batch_entry_after_batch_entry_production_update AFTER UPDATE ON thread.batch_entry_production FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_after_batch_entry_production_update_funct();


--
-- Name: batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx AFTER INSERT ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_funct();


--
-- Name: batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_delete; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_delete AFTER DELETE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_delete();


--
-- Name: batch_entry_trx thread_batch_entry_and_order_entry_after_batch_entry_trx_update; Type: TRIGGER; Schema: thread; Owner: postgres
--

CREATE TRIGGER thread_batch_entry_and_order_entry_after_batch_entry_trx_update AFTER UPDATE ON thread.batch_entry_trx FOR EACH ROW EXECUTE FUNCTION public.thread_batch_entry_and_order_entry_after_batch_entry_trx_update();


--
-- Name: dyed_tape_transaction order_description_after_dyed_tape_transaction_delete_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER order_description_after_dyed_tape_transaction_delete_trigger AFTER DELETE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_delete();


--
-- Name: dyed_tape_transaction order_description_after_dyed_tape_transaction_insert_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER order_description_after_dyed_tape_transaction_insert_trigger AFTER INSERT ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_insert();


--
-- Name: dyed_tape_transaction order_description_after_dyed_tape_transaction_update_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER order_description_after_dyed_tape_transaction_update_trigger AFTER UPDATE ON zipper.dyed_tape_transaction FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_dyed_tape_transaction_update();


--
-- Name: order_entry sfg_after_order_entry_delete; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_order_entry_delete AFTER DELETE ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_delete();


--
-- Name: order_entry sfg_after_order_entry_insert; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_order_entry_insert AFTER INSERT ON zipper.order_entry FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_order_entry_insert();


--
-- Name: sfg_production sfg_after_sfg_production_delete_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_sfg_production_delete_trigger AFTER DELETE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_delete_function();


--
-- Name: sfg_production sfg_after_sfg_production_insert_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_sfg_production_insert_trigger AFTER INSERT ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_insert_function();


--
-- Name: sfg_production sfg_after_sfg_production_update_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_sfg_production_update_trigger AFTER UPDATE ON zipper.sfg_production FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_production_update_function();


--
-- Name: sfg_transaction sfg_after_sfg_transaction_delete_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_sfg_transaction_delete_trigger AFTER DELETE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_delete_function();


--
-- Name: sfg_transaction sfg_after_sfg_transaction_insert_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_sfg_transaction_insert_trigger AFTER INSERT ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_insert_function();


--
-- Name: sfg_transaction sfg_after_sfg_transaction_update_trigger; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER sfg_after_sfg_transaction_update_trigger AFTER UPDATE ON zipper.sfg_transaction FOR EACH ROW EXECUTE FUNCTION zipper.sfg_after_sfg_transaction_update_function();


--
-- Name: material_trx_against_order_description stock_after_material_trx_against_order_description_delete; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER stock_after_material_trx_against_order_description_delete AFTER DELETE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_delete_funct();


--
-- Name: material_trx_against_order_description stock_after_material_trx_against_order_description_insert; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER stock_after_material_trx_against_order_description_insert AFTER INSERT ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_insert_funct();


--
-- Name: material_trx_against_order_description stock_after_material_trx_against_order_description_update; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER stock_after_material_trx_against_order_description_update AFTER UPDATE ON zipper.material_trx_against_order_description FOR EACH ROW EXECUTE FUNCTION zipper.stock_after_material_trx_against_order_description_update_funct();


--
-- Name: tape_coil_production tape_coil_after_tape_coil_production; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_after_tape_coil_production AFTER INSERT ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production();


--
-- Name: tape_coil_production tape_coil_after_tape_coil_production_delete; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_after_tape_coil_production_delete AFTER DELETE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_delete();


--
-- Name: tape_coil_production tape_coil_after_tape_coil_production_update; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_after_tape_coil_production_update AFTER UPDATE ON zipper.tape_coil_production FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_coil_production_update();


--
-- Name: tape_trx tape_coil_after_tape_trx_after_delete; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_after_tape_trx_after_delete AFTER DELETE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_delete();


--
-- Name: tape_trx tape_coil_after_tape_trx_after_insert; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_after_tape_trx_after_insert AFTER INSERT ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_insert();


--
-- Name: tape_trx tape_coil_after_tape_trx_after_update; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_after_tape_trx_after_update AFTER UPDATE ON zipper.tape_trx FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_after_tape_trx_update();


--
-- Name: dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_del; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_del AFTER DELETE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_del();


--
-- Name: dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_ins; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_ins AFTER INSERT ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_ins();


--
-- Name: dyed_tape_transaction_from_stock tape_coil_and_order_description_after_dyed_tape_transaction_upd; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_and_order_description_after_dyed_tape_transaction_upd AFTER UPDATE ON zipper.dyed_tape_transaction_from_stock FOR EACH ROW EXECUTE FUNCTION zipper.tape_coil_and_order_description_after_dyed_tape_transaction_upd();


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_after_delete; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_to_dyeing_after_delete AFTER DELETE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_delete();


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_after_insert; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_to_dyeing_after_insert AFTER INSERT ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_insert();


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_after_update; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER tape_coil_to_dyeing_after_update AFTER UPDATE ON zipper.tape_coil_to_dyeing FOR EACH ROW EXECUTE FUNCTION zipper.order_description_after_tape_coil_to_dyeing_update();


--
-- Name: batch_production zipper_batch_entry_after_batch_production_delete; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER zipper_batch_entry_after_batch_production_delete AFTER DELETE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_delete();


--
-- Name: batch_production zipper_batch_entry_after_batch_production_insert; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER zipper_batch_entry_after_batch_production_insert AFTER INSERT ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_insert();


--
-- Name: batch_production zipper_batch_entry_after_batch_production_update; Type: TRIGGER; Schema: zipper; Owner: postgres
--

CREATE TRIGGER zipper_batch_entry_after_batch_production_update AFTER UPDATE ON zipper.batch_production FOR EACH ROW EXECUTE FUNCTION public.zipper_batch_entry_after_batch_production_update();


--
-- Name: bank bank_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.bank
    ADD CONSTRAINT bank_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: lc lc_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: lc lc_party_uuid_party_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.lc
    ADD CONSTRAINT lc_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);


--
-- Name: pi_cash pi_cash_bank_uuid_bank_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_bank_uuid_bank_uuid_fk FOREIGN KEY (bank_uuid) REFERENCES commercial.bank(uuid);


--
-- Name: pi_cash pi_cash_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: pi_cash_entry pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_pi_cash_uuid_pi_cash_uuid_fk FOREIGN KEY (pi_cash_uuid) REFERENCES commercial.pi_cash(uuid);


--
-- Name: pi_cash_entry pi_cash_entry_sfg_uuid_sfg_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);


--
-- Name: pi_cash_entry pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash_entry
    ADD CONSTRAINT pi_cash_entry_thread_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (thread_order_entry_uuid) REFERENCES thread.order_entry(uuid);


--
-- Name: pi_cash pi_cash_factory_uuid_factory_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);


--
-- Name: pi_cash pi_cash_lc_uuid_lc_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_lc_uuid_lc_uuid_fk FOREIGN KEY (lc_uuid) REFERENCES commercial.lc(uuid);


--
-- Name: pi_cash pi_cash_marketing_uuid_marketing_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);


--
-- Name: pi_cash pi_cash_merchandiser_uuid_merchandiser_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);


--
-- Name: pi_cash pi_cash_party_uuid_party_uuid_fk; Type: FK CONSTRAINT; Schema: commercial; Owner: postgres
--

ALTER TABLE ONLY commercial.pi_cash
    ADD CONSTRAINT pi_cash_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);


--
-- Name: challan challan_assign_to_users_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);


--
-- Name: challan challan_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: challan_entry challan_entry_challan_uuid_challan_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);


--
-- Name: challan_entry challan_entry_packing_list_uuid_packing_list_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan_entry
    ADD CONSTRAINT challan_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);


--
-- Name: challan challan_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);


--
-- Name: packing_list packing_list_challan_uuid_challan_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES delivery.challan(uuid);


--
-- Name: packing_list packing_list_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: packing_list_entry packing_list_entry_packing_list_uuid_packing_list_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_packing_list_uuid_packing_list_uuid_fk FOREIGN KEY (packing_list_uuid) REFERENCES delivery.packing_list(uuid);


--
-- Name: packing_list_entry packing_list_entry_sfg_uuid_sfg_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list_entry
    ADD CONSTRAINT packing_list_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);


--
-- Name: packing_list packing_list_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: delivery; Owner: postgres
--

ALTER TABLE ONLY delivery.packing_list
    ADD CONSTRAINT packing_list_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);


--
-- Name: designation designation_department_uuid_department_uuid_fk; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.designation
    ADD CONSTRAINT designation_department_uuid_department_uuid_fk FOREIGN KEY (department_uuid) REFERENCES hr.department(uuid);


--
-- Name: policy_and_notice policy_and_notice_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.policy_and_notice
    ADD CONSTRAINT policy_and_notice_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: users users_designation_uuid_designation_uuid_fk; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.users
    ADD CONSTRAINT users_designation_uuid_designation_uuid_fk FOREIGN KEY (designation_uuid) REFERENCES hr.designation(uuid);


--
-- Name: info info_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: info info_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);


--
-- Name: info info_thread_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.info
    ADD CONSTRAINT info_thread_order_info_uuid_order_info_uuid_fk FOREIGN KEY (thread_order_info_uuid) REFERENCES thread.order_info(uuid);


--
-- Name: recipe recipe_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: recipe_entry recipe_entry_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: recipe_entry recipe_entry_recipe_uuid_recipe_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe_entry
    ADD CONSTRAINT recipe_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);


--
-- Name: recipe recipe_lab_dip_info_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.recipe
    ADD CONSTRAINT recipe_lab_dip_info_uuid_info_uuid_fk FOREIGN KEY (lab_dip_info_uuid) REFERENCES lab_dip.info(uuid);


--
-- Name: shade_recipe shade_recipe_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.shade_recipe
    ADD CONSTRAINT shade_recipe_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: shade_recipe_entry shade_recipe_entry_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: shade_recipe_entry shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk; Type: FK CONSTRAINT; Schema: lab_dip; Owner: postgres
--

ALTER TABLE ONLY lab_dip.shade_recipe_entry
    ADD CONSTRAINT shade_recipe_entry_shade_recipe_uuid_shade_recipe_uuid_fk FOREIGN KEY (shade_recipe_uuid) REFERENCES lab_dip.shade_recipe(uuid);


--
-- Name: info info_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: info info_section_uuid_section_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_section_uuid_section_uuid_fk FOREIGN KEY (section_uuid) REFERENCES material.section(uuid);


--
-- Name: info info_type_uuid_type_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.info
    ADD CONSTRAINT info_type_uuid_type_uuid_fk FOREIGN KEY (type_uuid) REFERENCES material.type(uuid);


--
-- Name: section section_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.section
    ADD CONSTRAINT section_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: stock stock_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.stock
    ADD CONSTRAINT stock_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: stock_to_sfg stock_to_sfg_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: stock_to_sfg stock_to_sfg_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: stock_to_sfg stock_to_sfg_order_entry_uuid_order_entry_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.stock_to_sfg
    ADD CONSTRAINT stock_to_sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);


--
-- Name: trx trx_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: trx trx_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.trx
    ADD CONSTRAINT trx_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: type type_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.type
    ADD CONSTRAINT type_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: used used_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: used used_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: material; Owner: postgres
--

ALTER TABLE ONLY material.used
    ADD CONSTRAINT used_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: buyer buyer_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: factory factory_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: factory factory_party_uuid_party_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factory
    ADD CONSTRAINT factory_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);


--
-- Name: machine machine_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: marketing marketing_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: marketing marketing_user_uuid_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing
    ADD CONSTRAINT marketing_user_uuid_users_uuid_fk FOREIGN KEY (user_uuid) REFERENCES hr.users(uuid);


--
-- Name: merchandiser merchandiser_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: merchandiser merchandiser_party_uuid_party_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchandiser
    ADD CONSTRAINT merchandiser_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);


--
-- Name: party party_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: description description_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: description description_vendor_uuid_vendor_uuid_fk; Type: FK CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.description
    ADD CONSTRAINT description_vendor_uuid_vendor_uuid_fk FOREIGN KEY (vendor_uuid) REFERENCES purchase.vendor(uuid);


--
-- Name: entry entry_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: entry entry_purchase_description_uuid_description_uuid_fk; Type: FK CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.entry
    ADD CONSTRAINT entry_purchase_description_uuid_description_uuid_fk FOREIGN KEY (purchase_description_uuid) REFERENCES purchase.description(uuid);


--
-- Name: vendor vendor_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: purchase; Owner: postgres
--

ALTER TABLE ONLY purchase.vendor
    ADD CONSTRAINT vendor_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: assembly_stock assembly_stock_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.assembly_stock
    ADD CONSTRAINT assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: coloring_transaction coloring_transaction_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: coloring_transaction coloring_transaction_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);


--
-- Name: coloring_transaction coloring_transaction_stock_uuid_stock_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.coloring_transaction
    ADD CONSTRAINT coloring_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);


--
-- Name: die_casting die_casting_end_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);


--
-- Name: die_casting die_casting_item_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);


--
-- Name: die_casting die_casting_logo_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);


--
-- Name: die_casting_production die_casting_production_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: die_casting_production die_casting_production_die_casting_uuid_die_casting_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);


--
-- Name: die_casting_production die_casting_production_order_description_uuid_order_description; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_production
    ADD CONSTRAINT die_casting_production_order_description_uuid_order_description FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: die_casting die_casting_puller_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);


--
-- Name: die_casting die_casting_slider_body_shape_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);


--
-- Name: die_casting die_casting_slider_link_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);


--
-- Name: die_casting_to_assembly_stock die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_assembly_stock_uuid_assembly_stoc FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);


--
-- Name: die_casting_to_assembly_stock die_casting_to_assembly_stock_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_to_assembly_stock
    ADD CONSTRAINT die_casting_to_assembly_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: die_casting_transaction die_casting_transaction_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: die_casting_transaction die_casting_transaction_die_casting_uuid_die_casting_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);


--
-- Name: die_casting_transaction die_casting_transaction_stock_uuid_stock_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting_transaction
    ADD CONSTRAINT die_casting_transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);


--
-- Name: die_casting die_casting_zipper_number_properties_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.die_casting
    ADD CONSTRAINT die_casting_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);


--
-- Name: production production_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: production production_stock_uuid_stock_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.production
    ADD CONSTRAINT production_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);


--
-- Name: stock stock_order_description_uuid_order_description_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.stock
    ADD CONSTRAINT stock_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: transaction transaction_assembly_stock_uuid_assembly_stock_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_assembly_stock_uuid_assembly_stock_uuid_fk FOREIGN KEY (assembly_stock_uuid) REFERENCES slider.assembly_stock(uuid);


--
-- Name: transaction transaction_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: transaction transaction_stock_uuid_stock_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.transaction
    ADD CONSTRAINT transaction_stock_uuid_stock_uuid_fk FOREIGN KEY (stock_uuid) REFERENCES slider.stock(uuid);


--
-- Name: trx_against_stock trx_against_stock_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: trx_against_stock trx_against_stock_die_casting_uuid_die_casting_uuid_fk; Type: FK CONSTRAINT; Schema: slider; Owner: postgres
--

ALTER TABLE ONLY slider.trx_against_stock
    ADD CONSTRAINT trx_against_stock_die_casting_uuid_die_casting_uuid_fk FOREIGN KEY (die_casting_uuid) REFERENCES slider.die_casting(uuid);


--
-- Name: batch batch_coning_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_coning_created_by_users_uuid_fk FOREIGN KEY (coning_created_by) REFERENCES hr.users(uuid);


--
-- Name: batch batch_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: batch batch_dyeing_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_created_by_users_uuid_fk FOREIGN KEY (dyeing_created_by) REFERENCES hr.users(uuid);


--
-- Name: batch batch_dyeing_operator_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_operator_users_uuid_fk FOREIGN KEY (dyeing_operator) REFERENCES hr.users(uuid);


--
-- Name: batch batch_dyeing_supervisor_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_dyeing_supervisor_users_uuid_fk FOREIGN KEY (dyeing_supervisor) REFERENCES hr.users(uuid);


--
-- Name: batch_entry batch_entry_batch_uuid_batch_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES thread.batch(uuid);


--
-- Name: batch_entry batch_entry_order_entry_uuid_order_entry_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry
    ADD CONSTRAINT batch_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);


--
-- Name: batch_entry_production batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);


--
-- Name: batch_entry_production batch_entry_production_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry_production
    ADD CONSTRAINT batch_entry_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: batch_entry_trx batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES thread.batch_entry(uuid);


--
-- Name: batch_entry_trx batch_entry_trx_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch_entry_trx
    ADD CONSTRAINT batch_entry_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: batch batch_lab_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_lab_created_by_users_uuid_fk FOREIGN KEY (lab_created_by) REFERENCES hr.users(uuid);


--
-- Name: batch batch_machine_uuid_machine_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);


--
-- Name: batch batch_pass_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_pass_by_users_uuid_fk FOREIGN KEY (pass_by) REFERENCES hr.users(uuid);


--
-- Name: batch batch_yarn_issue_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.batch
    ADD CONSTRAINT batch_yarn_issue_created_by_users_uuid_fk FOREIGN KEY (yarn_issue_created_by) REFERENCES hr.users(uuid);


--
-- Name: challan challan_assign_to_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_assign_to_users_uuid_fk FOREIGN KEY (assign_to) REFERENCES hr.users(uuid);


--
-- Name: challan challan_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: challan_entry challan_entry_challan_uuid_challan_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_challan_uuid_challan_uuid_fk FOREIGN KEY (challan_uuid) REFERENCES thread.challan(uuid);


--
-- Name: challan_entry challan_entry_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: challan_entry challan_entry_order_entry_uuid_order_entry_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan_entry
    ADD CONSTRAINT challan_entry_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES thread.order_entry(uuid);


--
-- Name: challan challan_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.challan
    ADD CONSTRAINT challan_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);


--
-- Name: count_length count_length_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.count_length
    ADD CONSTRAINT count_length_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: dyes_category dyes_category_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.dyes_category
    ADD CONSTRAINT dyes_category_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: order_entry order_entry_count_length_uuid_count_length_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_count_length_uuid_count_length_uuid_fk FOREIGN KEY (count_length_uuid) REFERENCES thread.count_length(uuid);


--
-- Name: order_entry order_entry_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: order_entry order_entry_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES thread.order_info(uuid);


--
-- Name: order_entry order_entry_recipe_uuid_recipe_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_entry
    ADD CONSTRAINT order_entry_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);


--
-- Name: order_info order_info_buyer_uuid_buyer_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);


--
-- Name: order_info order_info_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: order_info order_info_factory_uuid_factory_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);


--
-- Name: order_info order_info_marketing_uuid_marketing_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);


--
-- Name: order_info order_info_merchandiser_uuid_merchandiser_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);


--
-- Name: order_info order_info_party_uuid_party_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);


--
-- Name: programs programs_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: programs programs_dyes_category_uuid_dyes_category_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_dyes_category_uuid_dyes_category_uuid_fk FOREIGN KEY (dyes_category_uuid) REFERENCES thread.dyes_category(uuid);


--
-- Name: programs programs_material_uuid_info_uuid_fk; Type: FK CONSTRAINT; Schema: thread; Owner: postgres
--

ALTER TABLE ONLY thread.programs
    ADD CONSTRAINT programs_material_uuid_info_uuid_fk FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: batch batch_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: batch_entry batch_entry_batch_uuid_batch_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_batch_uuid_batch_uuid_fk FOREIGN KEY (batch_uuid) REFERENCES zipper.batch(uuid);


--
-- Name: batch_entry batch_entry_sfg_uuid_sfg_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch_entry
    ADD CONSTRAINT batch_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);


--
-- Name: batch batch_machine_uuid_machine_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch
    ADD CONSTRAINT batch_machine_uuid_machine_uuid_fk FOREIGN KEY (machine_uuid) REFERENCES public.machine(uuid);


--
-- Name: batch_production batch_production_batch_entry_uuid_batch_entry_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);


--
-- Name: batch_production batch_production_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.batch_production
    ADD CONSTRAINT batch_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: dyed_tape_transaction dyed_tape_transaction_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_order_description_uuid_order_d; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_order_description_uuid_order_d FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: dyed_tape_transaction_from_stock dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction_from_stock
    ADD CONSTRAINT dyed_tape_transaction_from_stock_tape_coil_uuid_tape_coil_uuid_ FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);


--
-- Name: dyed_tape_transaction dyed_tape_transaction_order_description_uuid_order_description_; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dyed_tape_transaction
    ADD CONSTRAINT dyed_tape_transaction_order_description_uuid_order_description_ FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: dying_batch_entry dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_batch_entry_uuid_batch_entry_uuid_fk FOREIGN KEY (batch_entry_uuid) REFERENCES zipper.batch_entry(uuid);


--
-- Name: dying_batch_entry dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.dying_batch_entry
    ADD CONSTRAINT dying_batch_entry_dying_batch_uuid_dying_batch_uuid_fk FOREIGN KEY (dying_batch_uuid) REFERENCES zipper.dying_batch(uuid);


--
-- Name: material_trx_against_order_description material_trx_against_order_description_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: material_trx_against_order_description material_trx_against_order_description_material_uuid_info_uuid_; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_material_uuid_info_uuid_ FOREIGN KEY (material_uuid) REFERENCES material.info(uuid);


--
-- Name: material_trx_against_order_description material_trx_against_order_description_order_description_uuid_o; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.material_trx_against_order_description
    ADD CONSTRAINT material_trx_against_order_description_order_description_uuid_o FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: order_description order_description_bottom_stopper_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_bottom_stopper_properties_uuid_fk FOREIGN KEY (bottom_stopper) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_coloring_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_coloring_type_properties_uuid_fk FOREIGN KEY (coloring_type) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: order_description order_description_end_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_type_properties_uuid_fk FOREIGN KEY (end_type) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_end_user_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_end_user_properties_uuid_fk FOREIGN KEY (end_user) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_hand_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_hand_properties_uuid_fk FOREIGN KEY (hand) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_item_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_item_properties_uuid_fk FOREIGN KEY (item) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_light_preference_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_light_preference_properties_uuid_fk FOREIGN KEY (light_preference) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_lock_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_lock_type_properties_uuid_fk FOREIGN KEY (lock_type) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_logo_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_logo_type_properties_uuid_fk FOREIGN KEY (logo_type) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_nylon_stopper_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_nylon_stopper_properties_uuid_fk FOREIGN KEY (nylon_stopper) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_order_info_uuid_order_info_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_order_info_uuid_order_info_uuid_fk FOREIGN KEY (order_info_uuid) REFERENCES zipper.order_info(uuid);


--
-- Name: order_description order_description_puller_color_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_color_properties_uuid_fk FOREIGN KEY (puller_color) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_puller_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_puller_type_properties_uuid_fk FOREIGN KEY (puller_type) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_slider_body_shape_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_body_shape_properties_uuid_fk FOREIGN KEY (slider_body_shape) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_slider_link_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_link_properties_uuid_fk FOREIGN KEY (slider_link) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_slider_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_slider_properties_uuid_fk FOREIGN KEY (slider) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_tape_coil_uuid_tape_coil_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);


--
-- Name: order_description order_description_teeth_color_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_color_properties_uuid_fk FOREIGN KEY (teeth_color) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_teeth_type_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_teeth_type_properties_uuid_fk FOREIGN KEY (teeth_type) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_top_stopper_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_top_stopper_properties_uuid_fk FOREIGN KEY (top_stopper) REFERENCES public.properties(uuid);


--
-- Name: order_description order_description_zipper_number_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_description
    ADD CONSTRAINT order_description_zipper_number_properties_uuid_fk FOREIGN KEY (zipper_number) REFERENCES public.properties(uuid);


--
-- Name: order_entry order_entry_order_description_uuid_order_description_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_entry
    ADD CONSTRAINT order_entry_order_description_uuid_order_description_uuid_fk FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: order_info order_info_buyer_uuid_buyer_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_buyer_uuid_buyer_uuid_fk FOREIGN KEY (buyer_uuid) REFERENCES public.buyer(uuid);


--
-- Name: order_info order_info_factory_uuid_factory_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_factory_uuid_factory_uuid_fk FOREIGN KEY (factory_uuid) REFERENCES public.factory(uuid);


--
-- Name: order_info order_info_marketing_uuid_marketing_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_marketing_uuid_marketing_uuid_fk FOREIGN KEY (marketing_uuid) REFERENCES public.marketing(uuid);


--
-- Name: order_info order_info_merchandiser_uuid_merchandiser_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_merchandiser_uuid_merchandiser_uuid_fk FOREIGN KEY (merchandiser_uuid) REFERENCES public.merchandiser(uuid);


--
-- Name: order_info order_info_party_uuid_party_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.order_info
    ADD CONSTRAINT order_info_party_uuid_party_uuid_fk FOREIGN KEY (party_uuid) REFERENCES public.party(uuid);


--
-- Name: planning planning_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.planning
    ADD CONSTRAINT planning_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: planning_entry planning_entry_planning_week_planning_week_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_planning_week_planning_week_fk FOREIGN KEY (planning_week) REFERENCES zipper.planning(week);


--
-- Name: planning_entry planning_entry_sfg_uuid_sfg_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.planning_entry
    ADD CONSTRAINT planning_entry_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);


--
-- Name: sfg sfg_order_entry_uuid_order_entry_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_order_entry_uuid_order_entry_uuid_fk FOREIGN KEY (order_entry_uuid) REFERENCES zipper.order_entry(uuid);


--
-- Name: sfg_production sfg_production_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: sfg_production sfg_production_sfg_uuid_sfg_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_production
    ADD CONSTRAINT sfg_production_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);


--
-- Name: sfg sfg_recipe_uuid_recipe_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg
    ADD CONSTRAINT sfg_recipe_uuid_recipe_uuid_fk FOREIGN KEY (recipe_uuid) REFERENCES lab_dip.recipe(uuid);


--
-- Name: sfg_transaction sfg_transaction_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: sfg_transaction sfg_transaction_sfg_uuid_sfg_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_sfg_uuid_sfg_uuid_fk FOREIGN KEY (sfg_uuid) REFERENCES zipper.sfg(uuid);


--
-- Name: sfg_transaction sfg_transaction_slider_item_uuid_stock_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.sfg_transaction
    ADD CONSTRAINT sfg_transaction_slider_item_uuid_stock_uuid_fk FOREIGN KEY (slider_item_uuid) REFERENCES slider.stock(uuid);


--
-- Name: tape_coil tape_coil_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: tape_coil tape_coil_item_uuid_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);


--
-- Name: tape_coil_production tape_coil_production_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: tape_coil_production tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_production
    ADD CONSTRAINT tape_coil_production_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);


--
-- Name: tape_coil_required tape_coil_required_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: tape_coil_required tape_coil_required_end_type_uuid_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_end_type_uuid_properties_uuid_fk FOREIGN KEY (end_type_uuid) REFERENCES public.properties(uuid);


--
-- Name: tape_coil_required tape_coil_required_item_uuid_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_item_uuid_properties_uuid_fk FOREIGN KEY (item_uuid) REFERENCES public.properties(uuid);


--
-- Name: tape_coil_required tape_coil_required_nylon_stopper_uuid_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_nylon_stopper_uuid_properties_uuid_fk FOREIGN KEY (nylon_stopper_uuid) REFERENCES public.properties(uuid);


--
-- Name: tape_coil_required tape_coil_required_zipper_number_uuid_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_required
    ADD CONSTRAINT tape_coil_required_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_order_description_uuid_order_description_uu; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_order_description_uuid_order_description_uu FOREIGN KEY (order_description_uuid) REFERENCES zipper.order_description(uuid);


--
-- Name: tape_coil_to_dyeing tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil_to_dyeing
    ADD CONSTRAINT tape_coil_to_dyeing_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);


--
-- Name: tape_coil tape_coil_zipper_number_uuid_properties_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_coil
    ADD CONSTRAINT tape_coil_zipper_number_uuid_properties_uuid_fk FOREIGN KEY (zipper_number_uuid) REFERENCES public.properties(uuid);


--
-- Name: tape_trx tape_to_coil_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: tape_trx tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_to_coil_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);


--
-- Name: tape_trx tape_trx_created_by_users_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_created_by_users_uuid_fk FOREIGN KEY (created_by) REFERENCES hr.users(uuid);


--
-- Name: tape_trx tape_trx_tape_coil_uuid_tape_coil_uuid_fk; Type: FK CONSTRAINT; Schema: zipper; Owner: postgres
--

ALTER TABLE ONLY zipper.tape_trx
    ADD CONSTRAINT tape_trx_tape_coil_uuid_tape_coil_uuid_fk FOREIGN KEY (tape_coil_uuid) REFERENCES zipper.tape_coil(uuid);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

