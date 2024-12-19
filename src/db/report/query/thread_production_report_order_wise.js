import { and, eq, min, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function threadProductionStatusOrderWise(req, res, next) {
	const query = sql`
            SELECT
                order_entry.uuid as order_entry_uuid,
                order_info.uuid as order_info_uuid,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                order_info.created_at as order_created_at,
                order_info.updated_at as order_updated_at,
                order_info.party_uuid,
                party.name as party_name,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_entry.style,
                order_entry.color,
                order_entry.swatch_approval_date,
                order_entry.count_length_uuid,
                count_length.count,
                count_length.length,
                order_entry_batch_entry_quantity_length.total_quantity::float8,
                order_entry_batch_entry_quantity_length.total_weight::float8,
                order_entry_batch_entry_quantity_length.yarn_quantity::float8,
                order_entry_batch_entry_coning.total_coning_production_quantity::float8,
                order_entry.warehouse::float8,
                coalesce(thread_challan_sum.total_delivery_delivered_quantity,0)::float8 as total_delivery_delivered_quantity,
                coalesce(thread_challan_sum.total_delivery_balance_quantity,0)::float8 as total_delivery_balance_quantity,
                coalesce(thread_challan_sum.total_short_quantity,0)::float8 as total_short_quantity,
                coalesce(thread_challan_sum.total_reject_quantity,0)::float8 as total_reject_quantity
            FROM
                thread.order_entry
            LEFT JOIN
                thread.order_info ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT 
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(batch_entry.yarn_quantity) as yarn_quantity,
                    SUM(count_length.max_weight * batch_entry.quantity) as total_weight,
                    order_entry.uuid as order_entry_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                GROUP BY
                    order_entry.uuid
            ) order_entry_batch_entry_quantity_length ON order_entry.uuid = order_entry_batch_entry_quantity_length.order_entry_uuid
            LEFT JOIN (
                SELECT 
                    SUM(coning_production_quantity) as total_coning_production_quantity,
                    order_entry.uuid as order_entry_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                GROUP BY
                    order_entry.uuid
            ) order_entry_batch_entry_coning ON order_entry.uuid = order_entry_batch_entry_coning.order_entry_uuid
             LEFT JOIN (
                SELECT 
                    toe.uuid as order_entry_uuid,
                    SUM(CASE WHEN (pl.gate_pass = 1 AND ple.thread_order_entry_uuid IS NOT NULL) THEN ple.quantity ELSE 0 END) AS total_delivery_delivered_quantity,
                    SUM(CASE WHEN (pl.gate_pass = 0 AND ple.thread_order_entry_uuid IS NOT NULL) THEN ple.quantity ELSE 0 END) AS total_delivery_balance_quantity,
                    SUM(ple.short_quantity)AS total_short_quantity,
                    SUM(ple.reject_quantity) AS total_reject_quantity
                FROM
                    delivery.packing_list pl
                LEFT JOIN
                    delivery.challan ON challan.uuid = pl.challan_uuid
                LEFT JOIN 
                    delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN
                    thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                WHERE 
                    toe.uuid IS NOT NULL
                GROUP BY
                    toe.uuid
            ) thread_challan_sum ON thread_challan_sum.order_entry_uuid = order_entry.uuid
            ORDER BY 
                order_info.created_at DESC
            `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Production Status Batch Wise',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
