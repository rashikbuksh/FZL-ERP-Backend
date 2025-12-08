import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectMarketReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { from_date, to_date } = req?.query;

	const startTime = Date.now();

	//  Packing list creation is considered as production

	try {
		const query = sql`
                    WITH production_all_sum AS (
                       SELECT 
                            vpl.packing_list_entry_uuid, 
                            coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                            coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 0)::float8 as total_prod_value_party,
                            coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value_company,
                            vpl.entry_created_at as created_at
                        FROM 
                            delivery.v_packing_list_details vpl 
                            LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                            LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                            AND oe.order_description_uuid = vodf.order_description_uuid 
                        WHERE 
                            vpl.item_for NOT IN ('thread', 'sample_thread')
                        GROUP BY 
                            vpl.packing_list_entry_uuid,
                            vodf.order_type,
                            oe.party_price,
                            oe.company_price,
                            vpl.entry_created_at
                    ),
                    -- Consolidated LC calculation to avoid duplication
                    lc_values AS (
                        SELECT 
                            lc.uuid as lc_uuid,
                            lc.party_uuid,
                            COALESCE(pi_cash.marketing_uuid, manual_pi_values.marketing_uuid) AS marketing_uuid,
                            lc.created_at,
                            concat('LC', to_char(lc.created_at, 'YY'), '-', lc.id::text) AS file_number,
                            CASE
                                WHEN lc.is_old_pi = 0 THEN COALESCE(pi_cash_agg.pi_cash_value, 0)
                                WHEN manual_pi_values.manual_pi_value IS NOT NULL AND manual_pi_values.manual_pi_value > 0 
                                    THEN manual_pi_values.manual_pi_value
                                ELSE lc.lc_value::float8
                            END AS lc_value
                        FROM commercial.lc
                        LEFT JOIN (
                            SELECT 
                                pi_cash.lc_uuid,
                                MIN(pi_cash.marketing_uuid) as marketing_uuid
                            FROM commercial.pi_cash
                            GROUP BY pi_cash.lc_uuid
                        ) pi_cash ON lc.uuid = pi_cash.lc_uuid
                        LEFT JOIN (
                            SELECT
                                pi_cash.lc_uuid,
                                SUM(
                                    CASE
                                        WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type = 'tape' 
                                            THEN COALESCE(pi_cash_entry.pi_cash_quantity, 0) * COALESCE(order_entry.party_price, 0)
                                        WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type != 'tape' 
                                            THEN COALESCE(pi_cash_entry.pi_cash_quantity, 0) * COALESCE(order_entry.party_price, 0) / 12
                                        ELSE COALESCE(pi_cash_entry.pi_cash_quantity, 0) * COALESCE(toe.party_price, 0)
                                    END
                                )::float8 AS pi_cash_value
                            FROM commercial.pi_cash
                            LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
                            LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                            LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                            LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                            LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                            GROUP BY pi_cash.lc_uuid
                        ) pi_cash_agg ON lc.uuid = pi_cash_agg.lc_uuid
                        LEFT JOIN (
                            SELECT 
                                manual_pi.lc_uuid,
                                MIN(manual_pi.marketing_uuid) as marketing_uuid,
                                SUM(
                                    CASE 
                                        WHEN manual_pi_entry.is_zipper = true 
                                            THEN manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8 / 12
                                        ELSE manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8
                                    END
                                )::float8 AS manual_pi_value
                            FROM commercial.manual_pi_entry
                            LEFT JOIN commercial.manual_pi ON manual_pi_entry.manual_pi_uuid = manual_pi.uuid
                            WHERE manual_pi.lc_uuid IS NOT NULL
                            GROUP BY manual_pi.lc_uuid
                        ) manual_pi_values ON manual_pi_values.lc_uuid = lc.uuid
                    )
                    , party_roots AS (
                        SELECT
                            p.uuid AS party_uuid,
                            COALESCE(p.parent_party_uuid, p.uuid) AS party_root_uuid,
                            p.name
                        FROM public.party p
                    )
                    , party_names AS (
                        SELECT
                            party_root_uuid,
                            MIN(CASE WHEN party_root_uuid = party_uuid THEN name END) AS parent_name,
                            array_to_string(array_agg(DISTINCT name) FILTER (WHERE party_root_uuid != party_uuid), ' / ') AS child_names
                        FROM party_roots
                        GROUP BY party_root_uuid
                    )
                    SELECT
                        ${from_date} as report_from_date,
                        ${to_date} as report_to_date,
                        MIN(marketing.name) as marketing_name,
                        -- Combined parent + child names (parent first, then distinct children)
                        (pn.parent_name || COALESCE(' / ' || pn.child_names, '')) AS party_name,
                        COALESCE(MAX(parent_party.uuid), MIN(party.uuid)) as party_uuid,
                        -- party wise order number, against order number -> pi, lc, cash invoice
                        (array_agg(zipper_object.order_details))[1] as order_details,
                        -- (array_agg(op_zipper_object.order_details))[1] as opening_order_details,
                        -- running totals
                        COALESCE(MAX(lc_totals.running_total_value::float8), 0) as running_total_lc_value,
                        COALESCE(MAX(lc_totals.running_total_value::float8 * 80), 0) as running_total_lc_value_bdt,
                        COALESCE(MAX(lc_totals.file_numbers), ARRAY[]::text[]) AS running_lc_file_numbers,
                        COALESCE(MAX(cash_totals.running_total_cash_received::float8), 0) as running_total_cash_received,
                        COALESCE(MAX(cash_totals.pi_cash_ids), ARRAY[]::text[]) AS running_pi_cash_ids,
                        COALESCE(zipper_object.total_ordered_quantity, 0)::float8 as total_ordered_quantity,
                        COALESCE(zipper_object.total_ordered_value_party, 0)::float8 as total_ordered_value_party,
                        COALESCE(zipper_object.total_ordered_value_company, 0)::float8 as total_ordered_value_company,
                        COALESCE(zipper_object.total_produced_quantity, 0)::float8 as total_produced_quantity,
                        COALESCE(zipper_object.total_produced_value_party, 0)::float8 as total_produced_value_party,
                        COALESCE(zipper_object.total_produced_value_party_bdt, 0)::float8 as total_produced_value_party_bdt,
                        COALESCE(zipper_object.total_produced_value_company, 0)::float8 as total_produced_value_company,
                        COALESCE(zipper_object.total_produced_value_company_bdt, 0)::float8 as total_produced_value_company_bdt,
                        COALESCE(zipper_object.total_produced_quantity_deleted, 0)::float8 as total_produced_quantity_deleted,
                        COALESCE(zipper_object.total_produced_value_party_deleted, 0)::float8 as total_produced_value_party_deleted,
                        COALESCE(zipper_object.total_produced_value_party_deleted_bdt, 0)::float8 as total_produced_value_party_deleted_bdt,
                        COALESCE(zipper_object.total_produced_value_company_deleted, 0)::float8 as total_produced_value_company_deleted,
                        COALESCE(zipper_object.total_produced_value_company_deleted_bdt, 0)::float8 as total_produced_value_company_deleted_bdt
                    FROM 
                        public.party
                    LEFT JOIN
                        zipper.v_order_details_full vodf ON party.uuid = vodf.party_uuid
                    LEFT JOIN
                        public.party parent_party ON party.parent_party_uuid = parent_party.uuid
                    LEFT JOIN
                        thread.order_info toi ON party.uuid = toi.party_uuid
                    LEFT JOIN
                        public.marketing ON marketing.uuid = vodf.marketing_uuid OR marketing.uuid = toi.marketing_uuid
                    LEFT JOIN (
                        SELECT
                            vodf.marketing_uuid,
                            pr.party_root_uuid,
                            SUM(oe_sum.total_quantity)::float8 as total_ordered_quantity,
                            SUM(oe_sum.total_quantity_party_price)::float8 as total_ordered_value_party,
                            SUM(oe_sum.total_quantity_company_price)::float8 as total_ordered_value_company,
                            SUM(COALESCE(production_quantity.total_prod_quantity, 0)::float8) as total_produced_quantity,
                            SUM(COALESCE(production_quantity.total_prod_value_party, 0)::float8) as total_produced_value_party,
                            SUM(COALESCE(production_quantity.total_prod_value_company, 0)::float8) as total_produced_value_company,
                            SUM(COALESCE(production_quantity.total_prod_value_party * pc.conversion_rate, 0)::float8) as total_produced_value_party_bdt,
                            SUM(COALESCE(production_quantity.total_prod_value_company * pc.conversion_rate, 0)::float8) as total_produced_value_company_bdt,
                            SUM(COALESCE(production_quantity.total_prod_quantity_deleted, 0)::float8) as total_produced_quantity_deleted,
                            SUM(COALESCE(production_quantity.total_prod_value_party_deleted, 0)::float8) as total_produced_value_party_deleted,
                            SUM(COALESCE(production_quantity.total_prod_value_company_deleted, 0)::float8) as total_produced_value_company_deleted,
                            SUM(COALESCE(production_quantity.total_prod_value_party_deleted * pc.conversion_rate, 0)::float8) as total_produced_value_party_deleted_bdt,
                            SUM(COALESCE(production_quantity.total_prod_value_company_deleted * pc.conversion_rate, 0)::float8) as total_produced_value_company_deleted_bdt,
                            jsonb_agg(
                                DISTINCT jsonb_build_object(
                                    'order_info_uuid',
                                    vodf.order_info_uuid,
                                    'order_number',
                                    vodf.order_number,
                                    'total_quantity',
                                    COALESCE(oe_sum.total_quantity, 0)::float8,
                                    'total_quantity_party_price',
                                    COALESCE(oe_sum.total_quantity_party_price, 0)::float8,
                                    'total_quantity_company_price',
                                    COALESCE(oe_sum.total_quantity_company_price, 0)::float8,
                                    'total_quantity_party_price_bdt',
                                    COALESCE(oe_sum.total_quantity_party_price * CASE WHEN vodf.is_cash = 1 THEN pc.conversion_rate ELSE '80'::float8 END, 0)::float8,
                                    'total_quantity_company_price_bdt',
                                    COALESCE(oe_sum.total_quantity_company_price * CASE WHEN vodf.is_cash = 1 THEN pc.conversion_rate ELSE '80'::float8 END, 0)::float8,
                                    'running_prod_quantity',
                                    COALESCE(production_quantity.total_prod_quantity, 0)::float8,
                                    'running_prod_value_party',
                                    COALESCE(production_quantity.total_prod_value_party , 0)::float8,
                                    'running_prod_value_company',
                                    COALESCE(production_quantity.total_prod_value_company, 0)::float8,
                                    'running_prod_value_party_bdt',
                                    COALESCE(production_quantity.total_prod_value_party * CASE WHEN vodf.is_cash = 1 THEN pc.conversion_rate ELSE '80'::float8 END, 0)::float8,
                                    'running_prod_value_company_bdt',
                                    COALESCE(production_quantity.total_prod_value_company * CASE WHEN vodf.is_cash = 1 THEN pc.conversion_rate ELSE '80'::float8 END, 0)::float8
                                )
                            ) FILTER ( WHERE oe_sum.total_quantity != 0 OR oe_sum.total_quantity IS NOT NULL ) AS order_details
                        FROM zipper.v_order_details_full vodf
                        LEFT JOIN party_roots pr ON pr.party_uuid = vodf.party_uuid
                        LEFT JOIN (
                            SELECT 
                                vpl.order_info_uuid,
                                SUM(pas.total_prod_quantity) FILTER (WHERE ${from_date && to_date ? sql`pas.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day'` : sql`1=1`}) as total_prod_quantity,
                                SUM(pas.total_prod_value_party) FILTER (WHERE ${from_date && to_date ? sql`pas.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day'` : sql`1=1`}) as total_prod_value_party,
                                SUM(pas.total_prod_value_company) FILTER (WHERE ${from_date && to_date ? sql`pas.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day'` : sql`1=1`}) as total_prod_value_company,
                                SUM(pas.total_prod_quantity) FILTER (WHERE ${from_date && to_date ? sql`CASE WHEN vpl.deleted_time IS NULL THEN (vpl.updated_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day') ELSE (vpl.deleted_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day') END AND vpl.is_deleted = true` : sql`1=1`}) as total_prod_quantity_deleted,
                                SUM(pas.total_prod_value_party) FILTER (WHERE ${from_date && to_date ? sql`CASE WHEN vpl.deleted_time IS NULL THEN (vpl.updated_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day') ELSE (vpl.deleted_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day') END AND vpl.is_deleted = true` : sql`1=1`}) as total_prod_value_party_deleted,
                                SUM(pas.total_prod_value_company) FILTER (WHERE ${from_date && to_date ? sql`CASE WHEN vpl.deleted_time IS NULL THEN (vpl.updated_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day') ELSE (vpl.deleted_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 day') END AND vpl.is_deleted = true` : sql`1=1`}) as total_prod_value_company_deleted
                            FROM
                                delivery.v_packing_list_details vpl
                            LEFT JOIN
                                production_all_sum pas ON vpl.packing_list_entry_uuid = pas.packing_list_entry_uuid
                            WHERE vpl.item_for NOT IN ('thread', 'sample_thread')
                            GROUP BY
                                vpl.order_info_uuid
                        ) AS production_quantity ON
                            vodf.order_info_uuid = production_quantity.order_info_uuid
                        LEFT JOIN (
                            SELECT
                                vodf.order_info_uuid,
                                SUM(
									oe.quantity
								) as total_quantity,
								SUM(
									oe.quantity * CASE
                                        WHEN vodf.order_type = 'tape' THEN oe.party_price
                                        ELSE (oe.party_price / 12)
                                    END
								) as total_quantity_party_price,
                                SUM(
                                    oe.quantity * CASE
                                        WHEN vodf.order_type = 'tape' THEN oe.company_price
                                        ELSE (oe.company_price / 12)
                                    END
                                ) as total_quantity_company_price
                            FROM
                                zipper.order_entry oe
                            LEFT JOIN
                                zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                            GROUP BY
                                vodf.order_info_uuid
                        ) AS oe_sum ON vodf.order_info_uuid = oe_sum.order_info_uuid
                        LEFT JOIN commercial.pi_cash pc ON EXISTS (
                            SELECT 1
                            FROM jsonb_array_elements_text(pc.order_info_uuids::jsonb) AS elem(val)
                            WHERE elem.val = vodf.order_info_uuid::text AND vodf.is_cash = 1
                        )
                        WHERE 
							production_quantity.total_prod_quantity IS NOT NULL
                        GROUP BY
                            vodf.marketing_uuid,
                            pr.party_root_uuid
                    ) AS zipper_object ON
                        zipper_object.marketing_uuid = vodf.marketing_uuid AND
                        zipper_object.party_root_uuid = COALESCE(parent_party.uuid, vodf.party_uuid)
                    LEFT JOIN (
                        SELECT 
                            COALESCE(p.parent_party_uuid, lv.party_uuid) AS party_root_uuid,
                            lv.marketing_uuid,
                            array_agg(DISTINCT lv.file_number) FILTER (WHERE ${from_date && to_date ? sql`lv.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}) AS file_numbers,
                            SUM(lv.lc_value) FILTER (WHERE ${from_date && to_date ? sql`lv.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}) AS running_total_value
                        FROM lc_values lv
                        LEFT JOIN public.party p ON p.uuid = lv.party_uuid
                        GROUP BY COALESCE(p.parent_party_uuid, lv.party_uuid), lv.marketing_uuid
                    ) AS lc_totals ON
                        lc_totals.party_root_uuid = COALESCE(parent_party.uuid, vodf.party_uuid) AND lc_totals.marketing_uuid = vodf.marketing_uuid
                    LEFT JOIN (
                        SELECT 
                            COALESCE(p.parent_party_uuid, pi_cash.party_uuid) AS party_root_uuid,
                            pi_cash.marketing_uuid,
                            array_agg(DISTINCT CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text)) FILTER (WHERE ${from_date && to_date ? sql`cash_receive.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 DAY'` : sql`1=1`}) AS pi_cash_ids,
                            SUM(cash_receive.amount) FILTER (WHERE ${from_date && to_date ? sql`cash_receive.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 DAY'` : sql`1=1`}) AS running_total_cash_received
                        FROM commercial.cash_receive
                        LEFT JOIN commercial.pi_cash ON cash_receive.pi_cash_uuid = pi_cash.uuid
                        LEFT JOIN public.party p ON p.uuid = pi_cash.party_uuid
                        WHERE pi_cash.uuid IS NOT NULL
                        GROUP BY COALESCE(p.parent_party_uuid, pi_cash.party_uuid), pi_cash.marketing_uuid
                    ) AS cash_totals ON 
                        cash_totals.party_root_uuid = COALESCE(parent_party.uuid, vodf.party_uuid) AND cash_totals.marketing_uuid = vodf.marketing_uuid
                    LEFT JOIN party_names pn ON pn.party_root_uuid = COALESCE(parent_party.uuid, party.uuid)
                    GROUP BY 
                        COALESCE(parent_party.uuid, party.uuid),
                        marketing.uuid,
                        pn.parent_name,
                        pn.child_names,
                        zipper_object.total_ordered_quantity,
                        zipper_object.total_ordered_value_party,
                        zipper_object.total_produced_value_party_bdt,
                        zipper_object.total_ordered_value_company,
                        zipper_object.total_produced_value_company_bdt,
                        zipper_object.total_produced_quantity,
                        zipper_object.total_produced_value_party,
                        zipper_object.total_produced_value_party_bdt,
                        zipper_object.total_produced_value_company,
                        zipper_object.total_produced_value_company_bdt,
                        zipper_object.total_produced_quantity_deleted,
                        zipper_object.total_produced_value_party_deleted,
                        zipper_object.total_produced_value_party_deleted_bdt,
                        zipper_object.total_produced_value_company_deleted,
                        zipper_object.total_produced_value_company_deleted_bdt
                    ORDER BY
                        marketing_name,
                        party_name
                    `;

		// ! opening totals (against from_date)
		// COALESCE(MAX(lc_totals.opening_total_value::float8), 0) as opening_total_lc_value,
		// COALESCE(MAX(cash_totals.opening_total_cash_received::float8), 0) as opening_total_cash_received,
		// COALESCE(op_zipper_object.total_ordered_quantity, 0)::float8 as opening_total_ordered_quantity,
		// COALESCE(op_zipper_object.total_ordered_value_party, 0)::float8 as opening_total_ordered_value_party,
		// COALESCE(op_zipper_object.total_ordered_value_company, 0)::float8 as opening_total_ordered_value_company,
		// COALESCE(op_zipper_object.total_produced_quantity, 0)::float8 as opening_total_produced_quantity,
		// COALESCE(op_zipper_object.total_produced_value_party, 0)::float8 as opening_total_produced_value_party,
		// COALESCE(op_zipper_object.total_produced_value_company, 0)::float8 as opening_total_produced_value_company,
		// COALESCE(op_zipper_object.total_produced_quantity_deleted, 0)::float8 as opening_total_produced_quantity_deleted,
		// COALESCE(op_zipper_object.total_produced_value_party_deleted, 0)::float8 as opening_total_produced_value_party_deleted,
		// COALESCE(op_zipper_object.total_produced_value_company_deleted, 0)::float8 as opening_total_produced_value_company_deleted

		// ! LC Total Opening
		// SUM(lc_value) FILTER (WHERE ${from_date ? sql`created_at < ${from_date}::TIMESTAMP` : sql`TRUE`}) AS opening_total_value

		// ! Cash Total Opening
		// SUM(cash_receive.amount) FILTER (WHERE ${from_date ? sql`cash_receive.created_at < ${from_date}::TIMESTAMP` : sql`TRUE`}) AS opening_total_cash_received

		// ! op_zipper_object is similar to zipper_object but for opening balances
		// LEFT JOIN (
		//     SELECT
		//         vodf.marketing_uuid,
		//         vodf.party_uuid,
		//         SUM(oe_sum.total_quantity)::float8 as total_ordered_quantity,
		//         SUM(oe_sum.total_quantity_party_price)::float8 as total_ordered_value_party,
		//         SUM(oe_sum.total_quantity_company_price)::float8 as total_ordered_value_company,
		//         SUM(COALESCE(opening_quantity.total_prod_quantity, 0)::float8) as total_produced_quantity,
		//         SUM(COALESCE(opening_quantity.total_prod_value_party, 0)::float8) as total_produced_value_party,
		//         SUM(COALESCE(opening_quantity.total_prod_value_company, 0)::float8) as total_produced_value_company,
		//         SUM(COALESCE(opening_quantity.total_prod_quantity_deleted, 0)::float8) as total_produced_quantity_deleted,
		//         SUM(COALESCE(opening_quantity.total_prod_value_party_deleted, 0)::float8) as total_produced_value_party_deleted,
		//         SUM(COALESCE(opening_quantity.total_prod_value_company_deleted, 0)::float8) as total_produced_value_company_deleted,
		//         jsonb_agg(
		//             DISTINCT jsonb_build_object(
		//                 'order_info_uuid',
		//                 vodf.order_info_uuid,
		//                 'order_number',
		//                 vodf.order_number,
		//                 'total_quantity',
		//                 COALESCE(oe_sum.total_quantity, 0)::float8,
		//                 'total_quantity_party_price',
		//                 COALESCE(oe_sum.total_quantity_party_price, 0)::float8,
		//                 'total_quantity_company_price',
		//                 COALESCE(oe_sum.total_quantity_company_price, 0)::float8,
		//                 'opening_prod_quantity',
		//                 COALESCE(opening_quantity.total_prod_quantity, 0)::float8,
		//                 'opening_prod_value_party',
		//                 COALESCE(opening_quantity.total_prod_value_party, 0)::float8,
		//                 'opening_prod_value_company',
		//                 COALESCE(opening_quantity.total_prod_value_company, 0)::float8
		//             )
		//         ) FILTER ( WHERE oe_sum.total_quantity != 0 OR oe_sum.total_quantity IS NOT NULL ) AS order_details
		//     FROM zipper.v_order_details_full vodf
		//     LEFT JOIN (
		//         SELECT
		//             vpl.order_info_uuid,
		//             SUM(pas.total_prod_quantity) FILTER (WHERE ${from_date ? sql`pas.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}) as total_prod_quantity,
		//             SUM(pas.total_prod_value_party) FILTER (WHERE ${from_date ? sql`pas.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}) as total_prod_value_party,
		//             SUM(pas.total_prod_value_company) FILTER (WHERE ${from_date ? sql`pas.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}) as total_prod_value_company,
		//             SUM(pas.total_prod_quantity) FILTER (WHERE ${from_date ? sql`CASE WHEN vpl.deleted_time IS NULL THEN vpl.updated_at < ${from_date}::TIMESTAMP ELSE vpl.deleted_time < ${from_date}::TIMESTAMP END AND vpl.is_deleted = true` : sql`1=1`}) as total_prod_quantity_deleted,
		//             SUM(pas.total_prod_value_party) FILTER (WHERE ${from_date ? sql`CASE WHEN vpl.deleted_time IS NULL THEN vpl.updated_at < ${from_date}::TIMESTAMP ELSE vpl.deleted_time < ${from_date}::TIMESTAMP END AND vpl.is_deleted = true` : sql`1=1`}) as total_prod_value_party_deleted,
		//             SUM(pas.total_prod_value_company) FILTER (WHERE ${from_date ? sql`CASE WHEN vpl.deleted_time IS NULL THEN vpl.updated_at < ${from_date}::TIMESTAMP ELSE vpl.deleted_time < ${from_date}::TIMESTAMP END AND vpl.is_deleted = true` : sql`1=1`}) as total_prod_value_company_deleted
		//         FROM
		//             delivery.v_packing_list_details vpl
		//         LEFT JOIN
		//             production_all_sum pas ON vpl.packing_list_entry_uuid = pas.packing_list_entry_uuid
		//         WHERE
		//             vpl.is_deleted = false
		//             AND vpl.item_for NOT IN ('thread', 'sample_thread')
		//         GROUP BY
		//             vpl.order_info_uuid
		//     ) AS opening_quantity ON
		//         vodf.order_info_uuid = opening_quantity.order_info_uuid
		//     LEFT JOIN (
		//         SELECT
		//             vodf.order_info_uuid,
		//             SUM(
		//                 oe.quantity
		//             ) as total_quantity,
		//             SUM(
		//                 oe.quantity * CASE
		//                     WHEN vodf.order_type = 'tape' THEN oe.party_price
		//                     ELSE (oe.party_price / 12)
		//                 END
		//             ) as total_quantity_party_price,
		//             SUM(
		//                 oe.quantity * CASE
		//                     WHEN vodf.order_type = 'tape' THEN oe.company_price
		//                     ELSE (oe.company_price / 12)
		//                 END
		//             ) as total_quantity_company_price
		//         FROM
		//             zipper.order_entry oe
		//         LEFT JOIN
		//             zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		//         GROUP BY
		//             vodf.order_info_uuid
		//     ) AS oe_sum ON vodf.order_info_uuid = oe_sum.order_info_uuid
		//     WHERE
		//         opening_quantity.total_prod_quantity IS NOT NULL
		//     GROUP BY
		//         vodf.marketing_uuid,
		//         vodf.party_uuid
		// ) AS op_zipper_object ON
		//     op_zipper_object.marketing_uuid = vodf.marketing_uuid AND
		//     op_zipper_object.party_uuid = vodf.party_uuid

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const endTime = Date.now();
		console.log(`Query execution time: ${endTime - startTime} ms`);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Market Report fetched',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
