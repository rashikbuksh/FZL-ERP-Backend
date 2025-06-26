import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function threadProductionStatusOrderWise(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, status, from, to } = req?.query;

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
            SELECT
                order_info.uuid as order_info_uuid,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                thread_batch.thread_batch as thread_batch,
                order_info.created_at as order_created_at,
                order_info.updated_at as order_updated_at,
                order_info.party_uuid,
                party.name as party_name,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_info.buyer_uuid,
                buyer.name as buyer_name,
                order_entry.style as style,
                order_entry.color as color,
                order_entry.color_ref as color_ref,
                order_entry.color_ref_entry_date as color_ref_entry_date,
                order_entry.color_ref_update_date as color_ref_update_date,
                order_entry.swatch_approval_date as swatch_approval_date,
                CONCAT('"', count_length.count, ' - ', count_length.length) as count_length_name,
                ROUND(coalesce(order_entry.quantity::float8, 0)::numeric,3)::float8 as total_quantity,
                ROUND(coalesce(CASE WHEN order_entry.recipe_uuid IS NOT NULL THEN order_entry.quantity::float8 ELSE 0 END, 0)::numeric,3)::float8 as total_approved_quantity,
                ROUND(coalesce(order_entry_batch_entry_quantity_length.total_weight::float8, 0)::numeric,3)::float8 as total_weight,
                ROUND(coalesce(order_entry_batch_entry_quantity_length.yarn_quantity::float8, 0)::numeric,3)::float8 as yarn_quantity,
                ROUND(coalesce(order_entry_batch_entry_coning.total_coning_production_quantity::float8, 0)::numeric,3)::float8 as total_coning_production_quantity,
                ROUND(coalesce(order_entry.warehouse::float8, 0)::numeric,3)::float8 as warehouse,
                (coalesce(order_entry.quantity::float8, 0) - coalesce(thread_challan_sum.total_delivery_delivered_quantity,0)::numeric - coalesce(thread_challan_sum.total_delivery_balance_quantity,0)::numeric)::float8 as balance_quantity,
                ROUND(coalesce(thread_challan_sum.total_delivery_delivered_quantity,0)::numeric,3)::float8 as total_delivery_delivered_quantity,
                ROUND(coalesce(thread_challan_sum.total_delivery_balance_quantity,0)::numeric,3)::float8 as total_delivery_balance_quantity,
                ROUND(coalesce(thread_challan_sum.total_short_quantity,0)::numeric,3)::float8 as total_short_quantity,
                ROUND(coalesce(thread_challan_sum.total_reject_quantity,0)::numeric,3)::float8 as total_reject_quantity
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
            LEFT JOIN 
                public.buyer ON order_info.buyer_uuid = buyer.uuid
            LEFT JOIN (
                SELECT 
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
                    SUM(bep.production_quantity) as total_coning_production_quantity,
                    order_entry.uuid as order_entry_uuid
                FROM
                    thread.batch_entry_production bep
                LEFT JOIN thread.batch_entry ON bep.batch_entry_uuid = batch_entry.uuid
                LEFT JOIN 
                    thread.batch ON batch_entry.batch_uuid = batch.uuid
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.order_info ON order_entry.order_info_uuid = order_info.uuid
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
                LEFT JOIN 
                    thread.order_info toi ON toe.order_info_uuid = toi.uuid
                WHERE 
                    ple.thread_order_entry_uuid IS NOT NULL
                GROUP BY
                    toe.uuid
            ) thread_challan_sum ON thread_challan_sum.order_entry_uuid = order_entry.uuid
            LEFT JOIN (
                SELECT 
                    toi.uuid as order_info_uuid,
                    COALESCE(
                        jsonb_agg(DISTINCT jsonb_build_object('batch_uuid', batch.uuid, 'batch_number', batch.batch_number, 'batch_date', batch.production_date, 'batch_quantity', batch.total_quantity::float8, 'balance_quantity', batch.total_quantity::float - batch.transfer_quantity::float8))
                        FILTER (WHERE batch.uuid IS NOT NULL), '[]'
                    ) AS thread_batch
                FROM
                    thread.order_info toi
                LEFT JOIN (
                    SELECT 
                        batch.uuid,
                        CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_number,
                        batch.production_date::date as production_date,
                        SUM(batch_entry.quantity) as total_quantity,
                        SUM(batch_entry.transfer_quantity) as transfer_quantity,
                        order_entry.order_info_uuid
                    FROM
                        thread.batch_entry
                    LEFT JOIN thread.batch ON batch_entry.batch_uuid = batch.uuid
                    LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                    GROUP BY
                        batch.uuid, order_entry.order_info_uuid
                ) batch ON toi.uuid = batch.order_info_uuid
                GROUP BY
                    toi.uuid
            ) thread_batch ON thread_batch.order_info_uuid = order_info.uuid
            WHERE
                ${own_uuid == null ? sql`TRUE` : sql`order_info.marketing_uuid = ${marketingUuid}`}
                AND ${from && to ? sql` order_info.created_at BETWEEN ${from}::timestamp AND ${to}::timestamp + interval '23 hours 59 minutes 59 seconds'` : sql`TRUE`}
            `;

		// query.append(
		// 	sql`GROUP BY
		//         order_info.uuid, party.name, marketing.name, thread_batch.thread_batch, order_info.created_at, order_info.updated_at, order_info.party_uuid, order_info.marketing_uuid, order_info.is_sample, order_info.id, thread_challan_sum.total_delivery_delivered_quantity, thread_challan_sum.total_delivery_balance_quantity, thread_challan_sum.total_short_quantity, thread_challan_sum.total_reject_quantity
		//     `
		// );

		if (status === 'completed') {
			query.append(
				sql` AND order_entry.quantity = coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 0 `
			);
		} else if (status === 'pending') {
			query.append(
				sql` AND order_entry.quantity > coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 0 `
			);
		} else if (status === 'over_delivered') {
			query.append(
				sql` AND order_entry.quantity < coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 0 `
			);
		} else if (status === 'sample_completed') {
			query.append(
				sql` AND order_entry.quantity = coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 1 `
			);
		} else if (status === 'sample_pending') {
			query.append(
				sql` AND order_entry.quantity > coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 1 `
			);
		} else if (status === 'sample_over_delivered') {
			query.append(
				sql` AND order_entry.quantity < coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 1 `
			);
		}

		query.append(sql` ORDER BY order_info.created_at DESC`);

		const resultPromise = db.execute(query);

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
