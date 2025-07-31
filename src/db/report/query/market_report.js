import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function selectMarketReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { own_uuid, from_date, to_date, report_for } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    WITH running_all_sum AS (
                        SELECT 
                            vpl.packing_list_entry_uuid, 
                            coalesce(
                                SUM(
                                    CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                                ), 
                                0
                            )::float8 AS total_close_end_quantity, 
                            coalesce(
                                SUM(
                                    CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                                ), 
                                0
                            )::float8 AS total_open_end_quantity, 
                            coalesce(
                                SUM(
                                    CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                                ) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 
                                0
                            )::float8 as total_close_end_value_party,
                            coalesce(
                                SUM(
                                    CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                                ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                                0
                            )::float8 as total_close_end_value_company,

                            coalesce(
                                SUM(
                                    CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                                ) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 
                                0
                            )::float8 as total_open_end_value_party,
                            coalesce(
                                SUM(
                                    CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                                ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                                0
                            )::float8 as total_open_end_value_company,
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
                            AND ${report_for == 'accounts' ? sql`vpl.challan_uuid IS NOT NULL` : sql`1=1`}
                        GROUP BY 
                            vpl.packing_list_entry_uuid,
                            vodf.order_type,
                            oe.party_price,
                            oe.company_price
                        )
                    SELECT
                        marketing.name as marketing_name,
                        party.name as party_name,
                        -- party wise order number, against order number -> pi, lc, cash invoice
                        zipper_object.order_details
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
                                    'total_prod_quantity',
                                    production_quantity.total_prod_quantity,
                                    'total_prod_value_party',
                                    production_quantity.total_prod_value_party,
                                    'total_prod_value_company',
                                    production_quantity.total_prod_value_company
                                )
                            ) FILTER ( WHERE oe_sum.total_quantity != 0 ) AS order_details
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
									oe.quantity * oe.party_price
								) as total_quantity_party_price
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
                    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All cash invoices fetched',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
