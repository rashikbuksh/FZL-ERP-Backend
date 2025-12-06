import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function ProductionReportSnm(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
            WITH
                -- Pre-filter order data to reduce dataset size early
                filtered_orders AS (
                    SELECT DISTINCT
                        vodf.order_info_uuid,
                        vodf.order_description_uuid,
                        vodf.item,
                        vodf.created_at,
                        vodf.updated_at,
                        vodf.order_number,
                        vodf.party_name,
                        vodf.marketing_name,
                        vodf.item_description,
                        vodf.item_name,
                        vodf.nylon_stopper_name,
                        vodf.zipper_number_name,
                        vodf.puller_color_name,
                        vodf.teeth_color_name,
                        vodf.end_type_name,
                        vodf.order_type,
                        vodf.is_inch,
                        vodf.end_type,
                        vodf.zipper_number,
                        vodf.nylon_stopper,
                        vodf.sno_from_head_office,
                        vodf.sno_from_head_office_time,
                        vodf.sno_from_head_office_by,
                        vodf.sno_from_head_office_by_name,
                        vodf.receive_by_factory,
                        vodf.receive_by_factory_time,
                        vodf.receive_by_factory_by,
                        vodf.receive_by_factory_by_name,
                        vodf.created_by_name,
                        vodf.order_description_updated_by_name as updated_by_name,
                        vodf.order_description_created_at,
                        vodf.order_description_updated_at,
                        vodf.is_fashion
                    FROM zipper.v_order_details_full vodf
                    WHERE 
                        vodf.order_description_uuid IS NOT NULL 
                        AND vodf.is_cancelled = FALSE
                        ${own_uuid ? sql` AND vodf.marketing_uuid = ${marketingUuid}` : sql``}
                        ${from && to ? sql` AND vodf.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql``}
                ),
                -- Optimized pi_cash aggregation with indexed joins
                pi_cash_grouped AS (
                    SELECT 
                        fo.order_info_uuid,
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'pi_number', 
                                CASE WHEN pi_cash.is_pi = 1 
                                    THEN 'PI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
                                    ELSE 'CI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
                                END,
                                'pi_cash_uuid', pi_cash.uuid
                            )
                        ) FILTER (WHERE pi_cash.id IS NOT NULL) as pi_numbers,
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'lc_number', CASE WHEN lc.lc_number IS NOT NULL THEN '''' || lc.lc_number ELSE NULL END,
                                'lc_uuid', lc.uuid
                            )
                        ) FILTER (WHERE lc.uuid IS NOT NULL) as lc_numbers
                    FROM filtered_orders fo
                    INNER JOIN zipper.order_entry oe ON fo.order_description_uuid = oe.order_description_uuid
                    INNER JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                    INNER JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
                    INNER JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                    LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
                    GROUP BY fo.order_info_uuid
                ),
                -- Optimized production sum with better indexing
                sfg_production_sum AS (
                    SELECT
                        oe.uuid as order_entry_uuid,
                        ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY oe.created_at) as batch_rank,
                        SUM(sfg_prod.production_quantity) FILTER (WHERE sfg_prod.section = 'finishing') AS finishing_quantity
                    FROM filtered_orders fo
                    INNER JOIN zipper.order_entry oe ON fo.order_description_uuid = oe.order_description_uuid
                    INNER JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                    INNER JOIN zipper.finishing_batch_entry fbe ON fbe.sfg_uuid = sfg.uuid
                    INNER JOIN zipper.finishing_batch_production sfg_prod ON sfg_prod.finishing_batch_entry_uuid = fbe.uuid
                    WHERE sfg_prod.section = 'finishing'
                    GROUP BY oe.uuid
                ),
                -- Simplified dyed tape transaction aggregation
                dyed_tape_transaction_sum AS (
                    SELECT 
                        fo.order_description_uuid,
                        COALESCE(
                            SUM(dtt.trx_quantity), 0
                        ) + COALESCE(
                            SUM(dttfs.trx_quantity), 0
                        ) AS total_trx_quantity
                    FROM filtered_orders fo
                    LEFT JOIN zipper.dyed_tape_transaction dtt ON fo.order_description_uuid = dtt.order_description_uuid
                    LEFT JOIN zipper.dyed_tape_transaction_from_stock dttfs ON fo.order_description_uuid = dttfs.order_description_uuid
                    GROUP BY fo.order_description_uuid
                ),
                -- Optimized slider production aggregation
                slider_production_sum AS (
                    SELECT
                        fo.order_description_uuid,
                        SUM(production.production_quantity) FILTER (WHERE production.section = 'coloring') AS coloring_production_quantity,
                        SUM(production.weight) FILTER (WHERE production.section = 'coloring') as coloring_production_quantity_weight
                    FROM filtered_orders fo
                    INNER JOIN zipper.finishing_batch fb ON fo.order_description_uuid = fb.order_description_uuid
                    INNER JOIN slider.stock ON stock.finishing_batch_uuid = fb.uuid
                    INNER JOIN slider.production ON production.stock_uuid = stock.uuid
                    WHERE production.section = 'coloring'
                    GROUP BY fo.order_description_uuid
                ),
                -- Pre-aggregated dyeing batch entries
                dyeing_batch_entry_agg AS (
                    SELECT
                        dbe.dyeing_batch_uuid,
                        dbe.sfg_uuid,
                        SUM(dbe.quantity) as total_quantity,
                        SUM(dbe.production_quantity_in_kg) as total_production_quantity
                    FROM zipper.dyeing_batch_entry dbe
                    INNER JOIN zipper.sfg sfg ON dbe.sfg_uuid = sfg.uuid
                    INNER JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    INNER JOIN filtered_orders fo ON oe.order_description_uuid = fo.order_description_uuid
                    GROUP BY dbe.dyeing_batch_uuid, dbe.sfg_uuid
                ),
                -- Optimized dyeing batch main with pre-calculated values
                dyeing_batch_main AS (
                    SELECT
                        oe.uuid as order_entry_uuid,
                        db.uuid as dyeing_batch_uuid,
                        'B' || to_char(db.created_at, 'YY') || '-' || db.id::text as dyeing_batch_number,
                        db.production_date,
                        dbea.total_quantity,
                        dbea.total_production_quantity,
                        CASE WHEN db.received = 1 THEN true ELSE false END as received,
                        db.yarn_issued::float8,
                        db.yarn_issued_date,
                        db.received_date,
                        db.batch_status,
                        db.batch_status_date,
                        db.batch_type,
                        (machine.name || ' (' || machine.min_capacity::float8::text || ' - ' || machine.max_capacity::float8::text || ')') as dyeing_machine,
                        db.created_at as batch_created_at,
                        ROUND(
                            CASE
                                WHEN fo.order_type = 'tape' THEN 
                                    (tcr.top + tcr.bottom + dbea.total_quantity) / 100.0 / tcr.dyed_mtr_per_kg
                                ELSE 
                                    (tcr.top + tcr.bottom + 
                                     CASE WHEN fo.is_inch = 1 
                                          THEN oe.size::numeric * 2.54 
                                          ELSE oe.size::numeric 
                                     END
                                    ) * dbea.total_quantity / 100.0 / tcr.dyed_mtr_per_kg
                            END, 3
                        ) as expected_kg,
                        ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY db.created_at) as batch_rank
                    FROM zipper.dyeing_batch db
                    INNER JOIN public.machine machine ON db.machine_uuid = machine.uuid
                    INNER JOIN dyeing_batch_entry_agg dbea ON db.uuid = dbea.dyeing_batch_uuid
                    INNER JOIN zipper.sfg sfg ON dbea.sfg_uuid = sfg.uuid
                    INNER JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    INNER JOIN filtered_orders fo ON oe.order_description_uuid = fo.order_description_uuid
                    INNER JOIN zipper.tape_coil_required tcr ON (
                        fo.item = tcr.item_uuid
                        AND fo.zipper_number = tcr.zipper_number_uuid
                        AND CASE 
                            WHEN fo.order_type = 'tape' 
                            THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT'
                            ELSE fo.end_type = tcr.end_type_uuid
                        END
                        AND (lower(fo.item_name) != 'nylon' OR fo.nylon_stopper = tcr.nylon_stopper_uuid)
                    )
                ),
                order_entry_expected_kg AS (
					SELECT
						oe.uuid as order_entry_uuid,
						ROUND(
							CASE
								WHEN fo.order_type = 'tape' THEN 
									(tcr.top + tcr.bottom + oe.quantity) / 100.0 / tcr.dyed_mtr_per_kg
								ELSE 
									(tcr.top + tcr.bottom +	
										CASE WHEN fo.is_inch = 1
											THEN oe.size::numeric * 2.54
											ELSE oe.size::numeric
										END
									) * oe.quantity / 100.0 / tcr.dyed_mtr_per_kg
							END, 3
						) as expected_kg
					FROM zipper.order_entry oe
					INNER JOIN filtered_orders fo ON oe.order_description_uuid = fo.order_description_uuid
					INNER JOIN zipper.tape_coil_required tcr ON (
						fo.item = tcr.item_uuid
						AND fo.zipper_number = tcr.zipper_number_uuid
						AND CASE 
							WHEN fo.order_type = 'tape' 
							THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT'
							ELSE fo.end_type = tcr.end_type_uuid
						END
						AND (lower(fo.item_name) != 'nylon' OR fo.nylon_stopper = tcr.nylon_stopper_uuid)
					)
				),
                -- packing list delivery dates aggregation
                pl_delivery_dates AS (
                    SELECT
                        vpld.sfg_uuid,
                        MIN(vpld.created_at) AS first_production_date,
                        MAX(vpld.created_at) AS last_production_date,
                        MIN(ch.created_at) AS first_delivery_date,
                        MAX(ch.created_at) AS last_delivery_date
                    FROM delivery.v_packing_list_details vpld
                    LEFT JOIN delivery.challan ch ON vpld.challan_uuid = ch.uuid
                    WHERE vpld.is_deleted = FALSE AND vpld.item_for NOT IN ('thread', 'sample_thread')
                    GROUP BY vpld.sfg_uuid
                )
            -- Main query with reduced window functions
            SELECT
                fo.order_info_uuid,
                fo.item,
                fo.created_at,
                fo.updated_at,
                fo.order_number,
                fo.party_name,
                fo.marketing_name,
                fo.order_description_uuid,
                fo.item_description,
                fo.item_name,
                fo.item_name || 
                    CASE WHEN fo.nylon_stopper_name IS NOT NULL 
                        THEN ' - ' || fo.nylon_stopper_name 
                        ELSE COALESCE(' ' || fo.nylon_stopper_name, '')   
                    END || 
                    CASE WHEN fo.is_fashion = TRUE THEN ' (FZ)' ELSE '' END 
                as item_name_with_stopper,
                fo.nylon_stopper_name,
                fo.zipper_number_name,
                fo.end_type_name,
                fo.puller_color_name,
                fo.teeth_color_name,
                oe.uuid as order_entry_uuid,
                oe.style,
                oe.color,
                oe.color_ref,
                oe.color_ref_entry_date,
                oe.color_ref_update_date,
                oe.size::float8,
                oe.bulk_approval,
                oe.bulk_approval_date,
                -- Fixed conditional fields to show quantities even when no dyeing batch
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(oe.quantity::float8 AS TEXT) ELSE '--' END as quantity,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(oe.party_price::float8 AS TEXT) ELSE '--' END as party_price,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(oe.company_price::float8 AS TEXT) ELSE '--' END as company_price,
                CASE WHEN sfg.recipe_uuid IS NOT NULL THEN oe.swatch_approval_date END as swatch_approval_date,
                oe.swatch_approval_received as swatch_approval_received,
                oe.swatch_approval_received_date as swatch_approval_received_date,
                CASE WHEN (dbm.batch_rank = 1 OR dbm.batch_rank IS NULL) AND sfg.recipe_uuid IS NULL THEN CAST(oe.quantity::float8 AS TEXT) ELSE '--' END as not_approved_quantity,
                CASE WHEN (dbm.batch_rank = 1 OR dbm.batch_rank IS NULL) AND sfg.recipe_uuid IS NOT NULL THEN CAST(oe.quantity::float8 AS TEXT) ELSE '--' END as approved_quantity,
                sfg.recipe_uuid,
                recipe.name as recipe_name,
                CASE 
                    WHEN (dbm.batch_rank = 1 OR dbm.batch_rank IS NULL) AND fo.end_type_name IN ('2 Way - Close End', '2 Way - Open End') 
                    THEN CAST(oe.quantity::float8 * 2 AS TEXT)
                    WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL 
                    THEN CAST(oe.quantity::float8 AS TEXT)
                    ELSE '--'
                END as total_slider_required,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(sfg.delivered::float8 AS TEXT) ELSE '--' END as delivered,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(sfg.warehouse::float8 AS TEXT) ELSE '--' END as warehouse,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST((CASE WHEN fo.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END - sfg.delivered::float8) AS TEXT) ELSE '--' END as balance_quantity,
                fo.order_type,
                fo.is_inch,
                CASE
                    WHEN fo.order_type = 'tape' THEN 'Meter'
                    WHEN fo.order_type = 'slider' THEN 'Pcs'
                    WHEN fo.is_inch = 1 THEN 'Inch'
                    ELSE 'Cm'
                END as unit,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(COALESCE(sps.finishing_quantity, 0)::float8 AS TEXT) ELSE '--' END as total_finishing_quantity,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(COALESCE(dtts.total_trx_quantity, 0)::float8 AS TEXT) ELSE '--' END AS total_dyeing_quantity,
                CASE WHEN fo.order_description_uuid = LAG(fo.order_description_uuid) OVER (ORDER BY fo.order_description_uuid, fo.created_at) THEN '--' ELSE CAST(COALESCE(slps.coloring_production_quantity, 0)::float8 AS TEXT) END as total_coloring_quantity,
                CASE WHEN fo.order_description_uuid = LAG(fo.order_description_uuid) OVER (ORDER BY fo.order_description_uuid, fo.created_at) THEN '--' ELSE CAST(COALESCE(slps.coloring_production_quantity_weight, 0)::float8 AS TEXT) END as total_coloring_quantity_weight,
                COALESCE(pcg.pi_numbers, '[]') as pi_numbers,
                COALESCE(pcg.lc_numbers, '[]') as lc_numbers,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN CAST(COALESCE(oeek.expected_kg, 0) AS TEXT) ELSE '--' END as expected_kg,
                dbm.dyeing_batch_uuid,
                dbm.dyeing_batch_number,
                dbm.production_date,
                COALESCE(dbm.total_quantity, 0)::float8 as total_quantity,
                COALESCE(dbm.total_production_quantity, 0)::float8 as total_production_quantity,
                CASE WHEN dbm.batch_rank = 1 OR dbm.batch_rank IS NULL THEN COALESCE(dbm.received, false) ELSE false END as received,
                dbm.yarn_issued,
                dbm.yarn_issued_date,
                dbm.received_date,
                dbm.batch_status,
                dbm.batch_status_date,
                dbm.dyeing_machine,
                dbm.batch_created_at,
                COALESCE(dbm.expected_kg, 0)::float8 as batch_expected_kg,
                dbm.batch_type,
                fo.sno_from_head_office,
                fo.sno_from_head_office_time,
                fo.sno_from_head_office_by,
                fo.sno_from_head_office_by_name,
                fo.receive_by_factory,
                fo.receive_by_factory_time,
                fo.receive_by_factory_by,
                fo.receive_by_factory_by_name,
                fo.created_by_name,
                fo.updated_by_name,
                pl_delivery_dates.first_production_date,
                pl_delivery_dates.last_production_date,
                pl_delivery_dates.first_delivery_date,
                pl_delivery_dates.last_delivery_date
            FROM filtered_orders fo
            INNER JOIN zipper.order_entry oe ON fo.order_description_uuid = oe.order_description_uuid
            INNER JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
            LEFT JOIN order_entry_expected_kg oeek ON oe.uuid = oeek.order_entry_uuid
            LEFT JOIN lab_dip.recipe ON sfg.recipe_uuid = recipe.uuid
            LEFT JOIN sfg_production_sum sps ON sps.order_entry_uuid = oe.uuid
            LEFT JOIN dyed_tape_transaction_sum dtts ON dtts.order_description_uuid = fo.order_description_uuid
            LEFT JOIN slider_production_sum slps ON slps.order_description_uuid = fo.order_description_uuid
            LEFT JOIN pi_cash_grouped pcg ON fo.order_info_uuid = pcg.order_info_uuid
            LEFT JOIN dyeing_batch_main dbm ON oe.uuid = dbm.order_entry_uuid
            LEFT JOIN pl_delivery_dates ON pl_delivery_dates.sfg_uuid = sfg.uuid
            ORDER BY fo.item_name DESC;
        `;

		const resultPromise = db.execute(query);
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report S&M',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportThreadSnm(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
            WITH
                -- Pre-filter and cache thread order data early
                filtered_thread_orders AS (
                    SELECT 
                        oi.uuid,
                        oi.created_at,
                        oi.updated_at,
                        oi.party_uuid,
                        oi.marketing_uuid,
                        oi.is_sample,
                        oi.id,
                        oi.sno_from_head_office,
                        oi.sno_from_head_office_time,
                        oi.sno_from_head_office_by,
                        oi.receive_by_factory,
                        oi.receive_by_factory_time,
                        oi.receive_by_factory_by,
                        oi.production_pause,
                        oi.production_pause_time,
                        oi.production_pause_by
                    FROM thread.order_info oi
                    WHERE 1=1
                        ${own_uuid ? sql` AND oi.marketing_uuid = ${marketingUuid}` : sql``}
                        ${from && to ? sql` AND oi.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql``}
                ),
                -- Optimized pi_cash aggregation for thread orders
                pi_cash_grouped_thread AS (
                    SELECT
                        fto.uuid as order_info_uuid,
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'pi_number',
                                CASE WHEN pi_cash.is_pi = 1 
                                     THEN 'PI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
                                     ELSE 'CI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
                                END,
                                'pi_cash_uuid', pi_cash.uuid
                            )
                        ) FILTER (WHERE pi_cash.id IS NOT NULL) as pi_numbers,
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'lc_number', CASE WHEN lc.lc_number IS NOT NULL THEN '''' || lc.lc_number ELSE NULL END,
                                'lc_uuid', lc.uuid
                            )
                        ) FILTER (WHERE lc.uuid IS NOT NULL) as lc_numbers
                    FROM filtered_thread_orders fto
                    INNER JOIN thread.order_entry toe ON fto.uuid = toe.order_info_uuid
                    INNER JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
                    INNER JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                    LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
                    GROUP BY fto.uuid
                ),
                -- Pre-aggregated batch production data
                batch_production_sum AS (
                    SELECT
                        toe.uuid as order_entry_uuid,
                        SUM(be.coning_production_quantity) AS coning_production_quantity,
                        SUM(be.yarn_quantity) AS yarn_quantity
                    FROM filtered_thread_orders fto
                    INNER JOIN thread.order_entry toe ON fto.uuid = toe.order_info_uuid
                    INNER JOIN thread.batch_entry be ON be.order_entry_uuid = toe.uuid
                    WHERE toe.quantity > 0 AND toe.quantity IS NOT NULL
                    GROUP BY toe.uuid
                ),
                -- Optimized batch data with ranking
                thread_batch_main AS (
                    SELECT
                        toe.uuid as order_entry_uuid,
                        b.uuid as batch_uuid,
                        'B' || to_char(b.created_at, 'YY') || '-' || b.id::text as batch_number,
                        b.production_date,
                        beql.total_quantity,
                        beql.damaged_quantity,
                        beql.coning_production_quantity,
                        beql.total_weight as yarn_issued,
                        b.status,
                        b.status_date,
                        b.is_drying_complete,
                        b.drying_created_at,
                        (machine.name || ' (' || machine.min_capacity::float8::text || ' - ' || machine.max_capacity::float8::text || ')') as machine,
                        b.created_at as batch_created_at,
                        b.batch_type,
                        ROUND(beql.total_quantity::numeric * tcl.max_weight::numeric, 3) as expected_kg,
                        ROW_NUMBER() OVER (PARTITION BY toe.uuid ORDER BY b.created_at) as batch_rank
                    FROM thread.batch b
                    INNER JOIN public.machine ON b.machine_uuid = machine.uuid
                    INNER JOIN (
                        SELECT
                            SUM(be.quantity) as total_quantity,
                            SUM(be.damaged_quantity) as damaged_quantity,
                            SUM(be.coning_production_quantity) as coning_production_quantity,
                            SUM(be.yarn_quantity) as total_weight,
                            be.batch_uuid,
                            be.order_entry_uuid
                        FROM thread.batch_entry be
                        GROUP BY be.batch_uuid, be.order_entry_uuid
                    ) beql ON b.uuid = beql.batch_uuid
                    INNER JOIN thread.order_entry toe ON beql.order_entry_uuid = toe.uuid
                    INNER JOIN filtered_thread_orders fto ON toe.order_info_uuid = fto.uuid
                    INNER JOIN thread.count_length tcl ON toe.count_length_uuid = tcl.uuid
                    WHERE toe.quantity > 0 AND toe.quantity IS NOT NULL
                ),
                -- packing list delivery dates aggregation
                pl_delivery_dates AS (
                    SELECT
                        vpld.thread_order_entry_uuid,
                        MIN(vpld.created_at) AS first_production_date,
                        MAX(vpld.created_at) AS last_production_date,
                        MIN(ch.created_at) AS first_delivery_date,
                        MAX(ch.created_at) AS last_delivery_date
                    FROM delivery.v_packing_list_details vpld
                    LEFT JOIN delivery.challan ch ON vpld.challan_uuid = ch.uuid
                    WHERE vpld.is_deleted = FALSE AND vpld.item_for IN ('thread', 'sample_thread')
                    GROUP BY vpld.thread_order_entry_uuid
                )
            -- Main optimized query
            SELECT
                fto.uuid,
                fto.created_at,
                fto.updated_at,
                'Sewing Thread' as item_name,
                fto.party_uuid,
                party.name as party_name,
                fto.marketing_uuid,
                marketing.name as marketing_name,
                'ST' || 
                CASE WHEN fto.is_sample = 1 THEN 'S' ELSE '' END ||
                to_char(fto.created_at, 'YY') || '-' || fto.id::text as order_number,
                toe.uuid as order_entry_uuid,
                toe.style,
                toe.color,
                toe.color_ref,
                toe.color_ref_entry_date,
                toe.color_ref_update_date,
                toe.recipe_uuid,
                -- Simplified conditional fields using batch_rank
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST(toe.quantity::float8 AS TEXT) ELSE '--' END as quantity,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST(toe.party_price::float8 AS TEXT) ELSE '--' END as party_price,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST(toe.company_price::float8 AS TEXT) ELSE '--' END as company_price,
                toe.swatch_approval_received_date as swatch_approval_date,
                toe.swatch_approval_received as swatch_approval_received,
                recipe.name as recipe_name,
                CASE WHEN (tbm.batch_rank = 1 OR tbm.batch_rank IS NULL) AND toe.recipe_uuid IS NULL THEN CAST(toe.quantity::float8 AS TEXT) ELSE '--' END as not_approved_quantity,
                CASE WHEN (tbm.batch_rank = 1 OR tbm.batch_rank IS NULL) AND toe.recipe_uuid IS NOT NULL THEN CAST(toe.quantity::float8 AS TEXT) ELSE '--' END as approved_quantity,
                '"' || count_length.count as count,
                count_length.length,
                '"' || count_length.count || ' - ' || count_length.length as count_length_name,
                fto.uuid as order_info_uuid,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST(toe.delivered::float8 AS TEXT) ELSE '--' END as delivered,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST(toe.warehouse::float8 AS TEXT) ELSE '--' END as warehouse,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN (CAST(toe.quantity::float8 - toe.delivered::float8 AS TEXT)) ELSE '--' END as balance_quantity,
                COALESCE(pcgt.pi_numbers, '[]') as pi_numbers,
                COALESCE(pcgt.lc_numbers, '[]') as lc_numbers,
                -- CASE WHEN tbm.batch_rank = 1 THEN COALESCE(bps.coning_production_quantity, 0)::float8 ELSE '--' END as total_coning_production_quantity,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST(COALESCE(bps.yarn_quantity, 0)::float8 AS TEXT) ELSE '--' END as total_yarn_quantity,
                CASE WHEN tbm.batch_rank = 1 OR tbm.batch_rank IS NULL THEN CAST((toe.quantity * count_length.max_weight)::float8 AS TEXT) ELSE '--' END as total_expected_weight,
                tbm.batch_uuid,
                tbm.status,
                tbm.status_date,
                tbm.batch_number,
                tbm.production_date,
                COALESCE(tbm.total_quantity, 0)::float8 as total_quantity,
                COALESCE(tbm.yarn_issued, 0)::float8 as yarn_issued,
                tbm.is_drying_complete,
                tbm.drying_created_at,
                tbm.machine,
                tbm.batch_created_at,
                COALESCE(tbm.expected_kg, 0)::float8 as batch_expected_kg,
                tbm.batch_type,
                COALESCE(tbm.damaged_quantity, 0)::float8 as damaged_quantity,
                COALESCE(tbm.coning_production_quantity, 0)::float8 as total_coning_production_quantity,
                fto.sno_from_head_office,
                fto.sno_from_head_office_time,
                fto.sno_from_head_office_by,
                sno_from_head_office_by.name as sno_from_head_office_by_name,
                fto.receive_by_factory,
                fto.receive_by_factory_time,
                fto.receive_by_factory_by,
                receive_by_factory_by.name as receive_by_factory_by_name,
                pl_delivery_dates.first_production_date,
                pl_delivery_dates.last_production_date,
                pl_delivery_dates.first_delivery_date,
                pl_delivery_dates.last_delivery_date
            FROM filtered_thread_orders fto
            INNER JOIN thread.order_entry toe ON fto.uuid = toe.order_info_uuid
            INNER JOIN thread.count_length ON toe.count_length_uuid = count_length.uuid
            LEFT JOIN lab_dip.recipe ON toe.recipe_uuid = recipe.uuid
            LEFT JOIN public.party ON fto.party_uuid = party.uuid
            LEFT JOIN public.marketing ON fto.marketing_uuid = marketing.uuid
            LEFT JOIN pi_cash_grouped_thread pcgt ON fto.uuid = pcgt.order_info_uuid
            LEFT JOIN batch_production_sum bps ON bps.order_entry_uuid = toe.uuid
            LEFT JOIN thread_batch_main tbm ON toe.uuid = tbm.order_entry_uuid
            LEFT JOIN hr.users sno_from_head_office_by ON fto.sno_from_head_office_by = sno_from_head_office_by.uuid
            LEFT JOIN hr.users receive_by_factory_by ON fto.receive_by_factory_by = receive_by_factory_by.uuid
            LEFT JOIN hr.users production_pause_by ON fto.production_pause_by = production_pause_by.uuid
            LEFT JOIN pl_delivery_dates ON pl_delivery_dates.thread_order_entry_uuid = toe.uuid
            WHERE toe.quantity > 0 AND toe.quantity IS NOT NULL
            ORDER BY fto.created_at DESC;
        `;

		const resultPromise = db.execute(query);
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
