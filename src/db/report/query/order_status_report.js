import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function ProductionReportSnm(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            WITH
                pi_cash_grouped AS (
                    SELECT 
                        vodf.order_info_uuid, 
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'pi_number', CASE
                                    WHEN pi_cash.is_pi = 1 THEN concat(
                                        'PI', to_char(pi_cash.created_at, 'YY'), '-', (pi_cash.id::text)
                                    )
                                    ELSE concat(
                                        'CI', to_char(pi_cash.created_at, 'YY'), '-', (pi_cash.id::text)
                                    )
                                END, 'pi_cash_uuid', pi_cash.uuid
                            )
                        ) as pi_numbers, 
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'lc_number', CASE WHEN lc.lc_number IS NOT NULL THEN concat('''', lc.lc_number) ELSE NULL END, 'lc_uuid', lc.uuid
                            )
                        ) as lc_numbers
                    FROM
                        zipper.v_order_details_full vodf
                        LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                        LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                        LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
                        LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                        LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
                    WHERE
                        pi_cash.id IS NOT NULL
                    GROUP BY
                        vodf.order_info_uuid
                ),
                sfg_production_sum AS (
                    SELECT
                        oe.uuid as order_entry_uuid,
                        SUM(
                            CASE
                                WHEN sfg_prod.section = 'finishing' THEN sfg_prod.production_quantity
                                ELSE 0
                            END
                        ) AS finishing_quantity
                    FROM
                        zipper.finishing_batch_production sfg_prod
                        LEFT JOIN zipper.finishing_batch_entry fbe ON sfg_prod.finishing_batch_entry_uuid = fbe.uuid
                        LEFT JOIN zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    GROUP BY
                        oe.uuid
                ),
                dyed_tape_transaction_sum AS (
                    SELECT 
                        order_description_uuid, 
                        SUM(trx_quantity) AS total_trx_quantity
                    FROM (
                        SELECT dtt.order_description_uuid, dtt.trx_quantity
                        FROM zipper.dyed_tape_transaction dtt
                        
                        UNION ALL
                        
                        SELECT dttfs.order_description_uuid, dttfs.trx_quantity
                        FROM zipper.dyed_tape_transaction_from_stock dttfs
                    ) combined_transactions
                    GROUP BY order_description_uuid
                ),
                slider_production_sum AS (
                    SELECT
                        od.uuid as order_description_uuid,
                        SUM(
                            CASE
                                WHEN production.section = 'coloring' THEN production.production_quantity
                                ELSE 0
                            END
                        ) AS coloring_production_quantity,
                        SUM(
                            CASE
                                WHEN production.section = 'coloring' THEN production.weight
                                ELSE 0
                            END
                        ) as coloring_production_quantity_weight
                    FROM slider.production
                        LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
                        LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
                        LEFT JOIN zipper.order_description od ON finishing_batch.order_description_uuid = od.uuid
                    GROUP BY
                        od.uuid
                ),
                dyeing_batch_entry_sum AS (
                    SELECT
                        dyeing_batch_entry.dyeing_batch_uuid,
                        dyeing_batch_entry.sfg_uuid,
                        SUM(dyeing_batch_entry.quantity) as total_quantity,
                        SUM(
                            dyeing_batch_entry.production_quantity_in_kg
                        ) as total_production_quantity
                    FROM zipper.dyeing_batch_entry
                    GROUP BY
                        dyeing_batch_entry.dyeing_batch_uuid,
                        dyeing_batch_entry.sfg_uuid
                ),
                dyeing_batch_main AS (
                    SELECT
                        oe.uuid as order_entry_uuid,
                        dyeing_batch.uuid as dyeing_batch_uuid,
                        CONCAT(
                            'B',
                            to_char(dyeing_batch.created_at, 'YY'),
                            '-',
                            (dyeing_batch.id::text)
                        ) as dyeing_batch_number,
                        dyeing_batch.production_date as production_date,
                        dbes.total_quantity as total_quantity,
                        dbes.total_production_quantity as total_production_quantity,
                        CASE
                            WHEN dyeing_batch.received = 1 THEN TRUE
                            ELSE FALSE
                        END as received,
                        machine.name as dyeing_machine,
                        dyeing_batch.created_at as batch_created_at,
                        ROUND(
                            (
                                CASE
                                    WHEN vodf.order_type = 'tape' THEN (
                                        (
                                            tcr.top + tcr.bottom + dbes.total_quantity
                                        ) * 1
                                    ) / 100 / tcr.dyed_mtr_per_kg::float8
                                    ELSE (
                                        (
                                            tcr.top + tcr.bottom + CASE
                                                WHEN vodf.is_inch = 1 THEN CAST(
                                                    CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC
                                                )
                                                ELSE CAST(oe.size AS NUMERIC)
                                            END
                                        ) * dbes.total_quantity::float8
                                    ) / 100 / tcr.dyed_mtr_per_kg::float8
                                END
                            )::numeric,
                            3
                        ) as expected_kg
                    FROM
                        zipper.dyeing_batch dyeing_batch
                        LEFT JOIN public.machine machine ON dyeing_batch.machine_uuid = machine.uuid
                        LEFT JOIN dyeing_batch_entry_sum dbes ON dyeing_batch.uuid = dbes.dyeing_batch_uuid
                        LEFT JOIN zipper.sfg sfg ON dbes.sfg_uuid = sfg.uuid
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                        LEFT JOIN zipper.tape_coil_required tcr ON vodf.item = tcr.item_uuid
                        AND vodf.zipper_number = tcr.zipper_number_uuid
                        AND (
                            CASE
                                WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT'
                                ELSE vodf.end_type = tcr.end_type_uuid
                            END
                        )
                    WHERE
                        vodf.order_description_uuid IS NOT NULL
                        AND vodf.is_cancelled = FALSE
                        AND (
                            lower(vodf.item_name) != 'nylon'
                            OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
                        )
                )
            SELECT
                vodf.order_info_uuid,
                vodf.item,
                vodf.created_at,
                vodf.updated_at,
                vodf.order_number,
                vodf.party_name,
                vodf.marketing_name,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.item_name,
                CONCAT(
                    vodf.item_name,
                    CASE
                        WHEN vodf.nylon_stopper_name IS NOT NULL THEN ' - '
                        ELSE ' '
                    END,
                    vodf.nylon_stopper_name
                ) as item_name_with_stopper,
                vodf.nylon_stopper_name,
                vodf.zipper_number_name,
                vodf.end_type_name,
                oe.uuid as order_entry_uuid,
                oe.style,
                oe.color,
                oe.color_ref,
                oe.color_ref_entry_date,
                oe.color_ref_update_date,
                oe.size::float8,
                -- Conditional fields based on row numbers
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN oe.quantity::float8 ELSE NULL END as quantity,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN oe.party_price::float8 ELSE NULL END as party_price,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN oe.company_price::float8 ELSE NULL END as company_price,
                oe.swatch_approval_date,
                CASE
                    WHEN sfg.recipe_uuid IS NOT NULL THEN oe.swatch_approval_date
                    ELSE null
                END as swatch_approval_date,
                CASE
                    WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 AND sfg.recipe_uuid IS NULL THEN oe.quantity::float8
                    ELSE NULL
                END as not_approved_quantity,
                CASE
                    WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 AND sfg.recipe_uuid IS NOT NULL THEN oe.quantity::float8
                    ELSE NULL
                END as approved_quantity,
                sfg.recipe_uuid,
                recipe.name as recipe_name,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN coalesce(oe.quantity, 0)::float8 ELSE NULL END as total_quantity,
                CASE
                    WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 AND (
                        vodf.end_type_name = '2 Way - Close End'
                        OR vodf.end_type_name = '2 Way - Open End'
                    ) THEN oe.quantity::float8 * 2
                    WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN oe.quantity::float8
                    ELSE NULL
                END as total_slider_required,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN sfg.delivered::float8 ELSE NULL END as delivered,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN sfg.warehouse::float8 ELSE NULL END as warehouse,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN (oe.quantity::float8 - sfg.delivered::float8) ELSE NULL END as balance_quantity,
                vodf.order_type,
                vodf.is_inch,
                CASE
                    WHEN vodf.order_type = 'tape' THEN 'Meter'
                    WHEN vodf.order_type = 'slider' THEN 'Pcs'
                    WHEN vodf.is_inch = 1 THEN 'Inch'
                    ELSE 'Cm'
                END as unit,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN coalesce(sfg_production_sum.finishing_quantity, 0)::float8 ELSE NULL END as total_finishing_quantity,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY vodf.order_description_uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0)::float8 ELSE NULL END AS total_dyeing_quantity,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY vodf.order_description_uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN coalesce(slider_production_sum.coloring_production_quantity, 0)::float8 ELSE NULL END as total_coloring_quantity,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY vodf.order_description_uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN coalesce(slider_production_sum.coloring_production_quantity_weight, 0)::float8 ELSE NULL END as total_coloring_quantity_weight,
                coalesce(
                    pi_cash_grouped.pi_numbers,
                    '[]'
                ) as pi_numbers,
                coalesce(
                    pi_cash_grouped.lc_numbers,
                    '[]'
                ) as lc_numbers,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN dyeing_batch_main.expected_kg ELSE NULL END as expected_kg,
                dyeing_batch_main.dyeing_batch_uuid,
                dyeing_batch_main.dyeing_batch_number,
                dyeing_batch_main.production_date,
                dyeing_batch_main.total_quantity::float8,
                dyeing_batch_main.total_production_quantity::float8,
                CASE WHEN ROW_NUMBER() OVER (PARTITION BY oe.uuid ORDER BY dyeing_batch_main.batch_created_at) = 1 THEN dyeing_batch_main.received ELSE NULL END as received,
                dyeing_batch_main.dyeing_machine,
                dyeing_batch_main.batch_created_at,
                dyeing_batch_main.expected_kg as batch_expected_kg,
                vodf.sno_from_head_office,
                vodf.sno_from_head_office_time,
                vodf.sno_from_head_office_by,
                vodf.sno_from_head_office_by_name,
                vodf.receive_by_factory,
                vodf.receive_by_factory_time,
                vodf.receive_by_factory_by,
                vodf.receive_by_factory_by_name,
                vodf.production_pause,
                vodf.production_pause_time,
                vodf.production_pause_by,
                vodf.production_pause_by_name
            FROM
                zipper.v_order_details_full vodf
                LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                LEFT JOIN lab_dip.recipe ON sfg.recipe_uuid = recipe.uuid
                LEFT JOIN sfg_production_sum ON sfg_production_sum.order_entry_uuid = oe.uuid
                LEFT JOIN dyed_tape_transaction_sum ON dyed_tape_transaction_sum.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN slider_production_sum ON slider_production_sum.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
                LEFT JOIN dyeing_batch_main ON oe.uuid = dyeing_batch_main.order_entry_uuid
            WHERE 
                vodf.order_description_uuid IS NOT NULL 
                AND vodf.is_cancelled = FALSE
                ${own_uuid ? sql` AND vodf.marketing_uuid = ${marketingUuid}` : sql``}
                ${from && to ? sql` AND vodf.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql``}
            ORDER BY vodf.item_name DESC
    `;

		// AND (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8) > 0

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

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
    WITH
    pi_cash_grouped_thread AS (
        SELECT
            toi.uuid as order_info_uuid,
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'pi_number',
                    CASE
                        WHEN pi_cash.is_pi = 1 THEN concat(
                            'PI',
                            to_char(pi_cash.created_at, 'YY'),
                            '-',
                            (pi_cash.id::text)
                        )
                        ELSE concat(
                            'CI',
                            to_char(pi_cash.created_at, 'YY'),
                            '-',
                            (pi_cash.id::text)
                        )
                    END,
                    'pi_cash_uuid',
                    pi_cash.uuid
                )
            ) as pi_numbers,
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'lc_number',
                    CASE
                        WHEN lc.lc_number IS NOT NULL THEN concat('''', lc.lc_number)
                        ELSE NULL
                    END,
                    'lc_uuid',
                    lc.uuid
                )
            ) as lc_numbers
        FROM
            thread.order_info toi
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
            LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
            LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
        WHERE
            pi_cash.id IS NOT NULL
        GROUP BY
            toi.uuid
    )
SELECT
    order_info.uuid,
    order_info.created_at,
    order_info.updated_at,
    'Sewing Thread' as item_name,
    order_info.party_uuid,
    party.name as party_name,
    order_info.marketing_uuid,
    marketing.name as marketing_name,
    CONCAT(
        'ST',
        CASE
            WHEN order_info.is_sample = 1 THEN 'S'
            ELSE ''
        END,
        to_char(order_info.created_at, 'YY'),
        '-',
        (order_info.id::text)
    ) as order_number,
    order_entry.uuid as order_entry_uuid,
    order_entry.style,
    order_entry.color,
    order_entry.color_ref,
    order_entry.color_ref_entry_date,
    order_entry.color_ref_update_date,
    order_entry.recipe_uuid,
    -- Conditional fields based on row number
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN order_entry.quantity::float8 ELSE NULL END as quantity,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN order_entry.party_price::float8 ELSE NULL END as party_price,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN order_entry.company_price::float8 ELSE NULL END as company_price,
    order_entry.swatch_approval_date,
    order_entry.recipe_uuid,
    recipe.name as recipe_name,
    order_entry.swatch_approval_date,
    CASE
        WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
             AND order_entry.recipe_uuid IS NULL THEN order_entry.quantity::float8
        ELSE NULL
    END as not_approved_quantity,
    CASE
        WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
             AND order_entry.recipe_uuid IS NOT NULL THEN order_entry.quantity::float8
        ELSE NULL
    END as approved_quantity,
    CONCAT('"', count_length.count) as count,
    count_length.length,
    CONCAT(
        '"',
        count_length.count,
        ' - ',
        count_length.length
    ) as count_length_name,
    order_info.uuid as order_info_uuid,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN order_entry.delivered::float8 ELSE NULL END as delivered,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN order_entry.warehouse::float8 ELSE NULL END as warehouse,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN (order_entry.quantity::float8 - order_entry.delivered::float8) ELSE NULL END as balance_quantity,
    coalesce(
        pi_cash_grouped_thread.pi_numbers,
        '[]'
    ) as pi_numbers,
    coalesce(
        pi_cash_grouped_thread.lc_numbers,
        '[]'
    ) as lc_numbers,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN coalesce(batch_production_sum.coning_production_quantity, 0)::float8 ELSE NULL END as total_coning_production_quantity,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN coalesce(batch_production_sum.yarn_quantity, 0)::float8 ELSE NULL END as total_yarn_quantity,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY order_entry.uuid, order_info.uuid ORDER BY batch.batch_created_at) = 1 
         THEN (order_entry.quantity * count_length.max_weight)::float8 ELSE NULL END as total_expected_weight,
    batch.batch_uuid,
    batch.batch_number,
    batch.production_date,
    batch.total_quantity::float8,
    batch.yarn_issued::float8,
    batch.is_drying_complete,
    batch.machine,
    batch.batch_created_at,
    batch.expected_kg as batch_expected_kg,
    order_info.sno_from_head_office,
    order_info.sno_from_head_office_time,
    order_info.sno_from_head_office_by,
    sno_from_head_office_by.name as sno_from_head_office_by_name,
    order_info.receive_by_factory,
    order_info.receive_by_factory_time,
    order_info.receive_by_factory_by,
    receive_by_factory_by.name as receive_by_factory_by_name,
    order_info.production_pause,
    order_info.production_pause_time,
    order_info.production_pause_by,
    production_pause_by.name as production_pause_by_name
    FROM 
        thread.order_info
    LEFT JOIN thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
    LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
    LEFT JOIN lab_dip.recipe ON order_entry.recipe_uuid = recipe.uuid
    LEFT JOIN public.party ON order_info.party_uuid = party.uuid
    LEFT JOIN public.marketing ON order_info.marketing_uuid = marketing.uuid
    LEFT JOIN pi_cash_grouped_thread ON order_info.uuid = pi_cash_grouped_thread.order_info_uuid
    LEFT JOIN (
        SELECT
            toi.uuid as order_info_uuid,
            SUM(toe.quantity) as total_quantity
        FROM thread.order_entry toe
            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
        GROUP BY
            toi.uuid
    ) order_info_total_quantity ON order_info.uuid = order_info_total_quantity.order_info_uuid
    LEFT JOIN (
        SELECT
            order_entry.uuid as order_entry_uuid,
            SUM(
                batch_entry.coning_production_quantity
            ) AS coning_production_quantity,
            SUM(batch_entry.yarn_quantity) AS yarn_quantity
        FROM thread.batch_entry
            LEFT JOIN thread.batch ON batch_entry.batch_uuid = batch.uuid
            LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
        GROUP BY
            order_entry.uuid
    ) batch_production_sum ON batch_production_sum.order_entry_uuid = order_entry.uuid
    LEFT JOIN (
        SELECT
            order_entry.uuid as order_entry_uuid,
            batch.uuid as batch_uuid,
            CONCAT(
                'B',
                to_char(batch.created_at, 'YY'),
                '-',
                (batch.id::text)
            ) as batch_number,
            batch.production_date as production_date,
            batch_entry_quantity_length.total_quantity as total_quantity,
            batch_entry_quantity_length.total_weight as yarn_issued,
            batch.is_drying_complete,
            machine.name as machine,
            batch.created_at as batch_created_at,
            ROUND(
                batch_entry_quantity_length.total_quantity::numeric * tcl.max_weight::numeric,
                3
            ) as expected_kg
        FROM
            thread.batch
            LEFT JOIN public.machine ON batch.machine_uuid = machine.uuid
            LEFT JOIN (
                SELECT
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(batch_entry.yarn_quantity) as total_weight,
                    batch_entry.batch_uuid,
                    batch_entry.order_entry_uuid
                FROM thread.batch_entry
                GROUP BY
                    batch_entry.batch_uuid,
                    batch_entry.order_entry_uuid
            ) batch_entry_quantity_length ON batch.uuid = batch_entry_quantity_length.batch_uuid
            LEFT JOIN thread.order_entry ON batch_entry_quantity_length.order_entry_uuid = order_entry.uuid
            LEFT JOIN thread.count_length tcl ON order_entry.count_length_uuid = tcl.uuid
    ) batch ON order_entry.uuid = batch.order_entry_uuid
    LEFT JOIN hr.users sno_from_head_office_by ON order_info.sno_from_head_office_by = sno_from_head_office_by.uuid
    LEFT JOIN hr.users receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
    LEFT JOIN hr.users production_pause_by ON order_info.production_pause_by = production_pause_by.uuid
    WHERE 
        order_entry.quantity > 0 AND order_entry.quantity IS NOT NULL
        ${own_uuid == null ? sql`` : sql` AND order_info.marketing_uuid = ${marketingUuid}`}
        ${from && to ? sql` AND order_info.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql``}
    ORDER BY order_info.created_at DESC
    `;

		const resultPromise = db.execute(query);
		const data = await resultPromise;

		// Convert NULL values to dashes for display
		const processedData = data?.rows?.map((row) => ({
			...row,
			quantity: row.quantity ?? '-',
			not_approved_quantity: row.not_approved_quantity ?? '-',
			approved_quantity: row.approved_quantity ?? '-',
			total_yarn_quantity: row.total_yarn_quantity ?? '-',
			total_coning_production_quantity:
				row.total_coning_production_quantity ?? '-',
			warehouse: row.warehouse ?? '-',
			delivered: row.delivered ?? '-',
			balance_quantity: row.balance_quantity ?? '-',
			party_price: row.party_price ?? '-',
			company_price: row.company_price ?? '-',
			total_expected_weight: row.total_expected_weight ?? '-',
		}));

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: processedData });
	} catch (error) {
		await handleError({ error, res });
	}
}
