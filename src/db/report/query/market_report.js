import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectMarketReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { from_date, to_date } = req?.query;

	try {
		const query = sql`
                    WITH opening_all_sum AS (
                        SELECT 
                            vpl.packing_list_entry_uuid,
                            coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                            coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 0)::float8 as total_prod_value_party,
                            coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value_company
                        FROM 
                            delivery.v_packing_list_details vpl 
                            LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                            LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                            AND oe.order_description_uuid = vodf.order_description_uuid 
                        WHERE 
                            ${from_date ? sql`vpl.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}
                            AND vpl.item_for NOT IN ('thread', 'sample_thread')
                            AND vpl.is_deleted = false
                        GROUP BY 
                            vpl.packing_list_entry_uuid,
                            vodf.order_type,
                            oe.party_price,
                            oe.company_price
                    ),
                    running_all_sum AS (
                        SELECT 
                            vpl.packing_list_entry_uuid, 
                            coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                            coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 0)::float8 as total_prod_value_party,
                            coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value_company
                        FROM 
                            delivery.v_packing_list_details vpl 
                            LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                            LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                            AND oe.order_description_uuid = vodf.order_description_uuid 
                        WHERE 
                            ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                            AND vpl.item_for NOT IN ('thread', 'sample_thread')
                            AND vpl.is_deleted = false
                        GROUP BY 
                            vpl.packing_list_entry_uuid,
                            vodf.order_type,
                            oe.party_price,
                            oe.company_price
                    )
                    SELECT
                        MIN(marketing.name) as marketing_name,
                        MIN(party.name) as party_name,
                        MIN(party.uuid) as party_uuid,
                        -- party wise order number, against order number -> pi, lc, cash invoice
                        jsonb_agg(DISTINCT elem) FILTER (WHERE elem IS NOT NULL) as order_details,
                        MAX(total_lc.total_value) as total_lc_value,
                        MAX(cash_received.total_cash_received) as total_cash_received
                    FROM 
                        public.party
                    LEFT JOIN
                        zipper.v_order_details_full vodf ON party.uuid = vodf.party_uuid
                    LEFT JOIN
                        thread.order_info toi ON party.uuid = toi.party_uuid
                    LEFT JOIN
                        public.marketing ON marketing.uuid = vodf.marketing_uuid OR marketing.uuid = toi.marketing_uuid
                    LEFT JOIN (
                        SELECT
                            vodf.marketing_uuid,
                            vodf.party_uuid,
                            jsonb_agg(
                                DISTINCT jsonb_build_object(
                                    'order_info_uuid',
                                    vodf.order_info_uuid,
                                    'order_number',
                                    vodf.order_number,
                                    'total_quantity',
                                    oe_sum.total_quantity,
                                    'total_quantity_party_price',
                                    oe_sum.total_quantity_party_price,
                                    'total_quantity_company_price',
                                    oe_sum.total_quantity_company_price,
                                    'total_prod_quantity',
                                    production_quantity.total_prod_quantity,
                                    'total_prod_value_party',
                                    production_quantity.total_prod_value_party,
                                    'total_prod_value_company',
                                    production_quantity.total_prod_value_company
                                )
                            ) FILTER ( WHERE oe_sum.total_quantity != 0 OR oe_sum.total_quantity IS NOT NULL ) AS order_details
                        FROM zipper.v_order_details_full vodf
                        LEFT JOIN (
                            SELECT 
                                vpl.order_info_uuid,
                                SUM(ras.total_prod_quantity) as total_prod_quantity,
                                SUM(ras.total_prod_value_party) as total_prod_value_party,
                                SUM(ras.total_prod_value_company) as total_prod_value_company
                            FROM
                                delivery.v_packing_list_details vpl
                            LEFT JOIN
                                running_all_sum ras ON vpl.packing_list_entry_uuid = ras.packing_list_entry_uuid
                            WHERE 
                                vpl.is_deleted = false
                                AND vpl.item_for NOT IN ('thread', 'sample_thread')
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
                        GROUP BY
                            vodf.marketing_uuid,
                            vodf.party_uuid
                    ) AS zipper_object ON
                        zipper_object.marketing_uuid = vodf.marketing_uuid AND
                        zipper_object.party_uuid = vodf.party_uuid
                    LEFT JOIN (
                        SELECT 
                            lc.party_uuid,
                            CASE WHEN pi_cash.uuid IS NOT NULL THEN pi_cash.marketing_uuid ELSE manual_pi_values.marketing_uuid END AS marketing_uuid,
                            SUM(
                                CASE
                                    WHEN is_old_pi = 0 THEN (
                                        SELECT SUM(
                                                CASE
                                                    WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type = 'tape' THEN coalesce(
                                                        pi_cash_entry.pi_cash_quantity, 0
                                                    ) * coalesce(order_entry.party_price, 0)
                                                    WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type != 'tape' THEN coalesce(
                                                        pi_cash_entry.pi_cash_quantity, 0
                                                    ) * coalesce(order_entry.party_price, 0) / 12
                                                    ELSE coalesce(
                                                        pi_cash_entry.pi_cash_quantity, 0
                                                    ) * coalesce(toe.party_price, 0)
                                                END
                                            )
                                        FROM commercial.pi_cash
                                            LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
                                            LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                                            LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                                            LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                                            LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                                        WHERE
                                            pi_cash.lc_uuid = lc.uuid
                                    )
                                    WHEN (manual_pi_values.manual_pi_value::float8 IS NOT NULL OR manual_pi_values.manual_pi_value::float8 > 0)
                                        THEN manual_pi_values.manual_pi_value::float8
                                    ELSE lc.lc_value::float8
                                END
                            ) AS total_value
                        FROM commercial.lc
                        LEFT JOIN commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
                        LEFT JOIN (
                            SELECT 
                                manual_pi.lc_uuid,
                                manual_pi.marketing_uuid,
                                SUM(CASE WHEN manual_pi_entry.is_zipper = true THEN (manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8 / 12) ELSE (manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8) END) AS manual_pi_value
                            FROM commercial.manual_pi_entry
                            LEFT JOIN commercial.manual_pi ON manual_pi_entry.manual_pi_uuid = manual_pi.uuid
                            WHERE manual_pi.lc_uuid IS NOT NULL
                            GROUP BY 
                                manual_pi.lc_uuid, manual_pi.marketing_uuid
                        ) manual_pi_values ON manual_pi_values.lc_uuid = lc.uuid 
                        WHERE
                            ${from_date && to_date ? sql`lc.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 DAY'` : sql`1=1`}
                        GROUP BY lc.party_uuid, CASE WHEN pi_cash.uuid IS NOT NULL THEN pi_cash.marketing_uuid ELSE manual_pi_values.marketing_uuid END
                    ) AS total_lc ON
                        total_lc.party_uuid = vodf.party_uuid AND total_lc.marketing_uuid = vodf.marketing_uuid
                    LEFT JOIN 
                        (
                            SELECT 
                                SUM(cash_receive.amount) AS total_cash_received,
                                pi_cash.marketing_uuid,
                                pi_cash.party_uuid
                            FROM 
                                commercial.cash_receive
                            LEFT JOIN 
                                commercial.pi_cash ON cash_receive.pi_cash_uuid = pi_cash.uuid
                            WHERE 
                                ${from_date && to_date ? sql`cash_receive.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + INTERVAL '1 DAY'` : sql`1=1`}
                            GROUP BY 
                                pi_cash.marketing_uuid,
                                pi_cash.party_uuid
                        ) AS cash_received ON 
                            cash_received.party_uuid = vodf.party_uuid AND cash_received.marketing_uuid = vodf.marketing_uuid
                    CROSS JOIN LATERAL jsonb_array_elements(zipper_object.order_details) AS elem
                    WHERE zipper_object.order_details IS NOT NULL
                    GROUP BY 
                        party.uuid,
                        marketing.uuid
                    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Market Report fetched',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
