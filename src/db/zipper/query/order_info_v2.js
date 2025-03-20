import { handleError } from '../../../util/index.js';
import db from '../../index.js';

import { sql } from 'drizzle-orm';
import { constructSelectAllQuery } from '@/db/variables.js';

export async function getOrderDetailsPagination(req, res, next) {
	const { all, approved, type, own_uuid } = req.query;

	// console.log(all, '- all', approved, '- approved');

	let marketingUuid = null;

	// get marketing_uuid from own_uuid

	const marketingUuidQuery = sql`
        SELECT uuid
        FROM public.marketing
        WHERE user_uuid = ${own_uuid}
        `;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			if (
				marketingUuidData &&
				marketingUuidData.rows &&
				marketingUuidData.rows.length > 0
			) {
				marketingUuid = marketingUuidData.rows[0].uuid;
			} else {
				marketingUuid = null;
			}
		}

		const query = sql`
        SELECT 
            vod.*, 
            order_number_wise_counts.order_number_wise_count AS order_number_wise_count,
            all_approval_counts.swatch_approval_count,
            all_approval_counts.order_entry_count,
            CASE WHEN all_approval_counts.price_approval_count IS NULL THEN 0 ELSE all_approval_counts.price_approval_count END AS price_approval_count,
            CASE WHEN all_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatch_approved
        FROM zipper.v_order_details vod
        LEFT JOIN (
            SELECT 
                order_number, 
                COUNT(*) AS order_number_wise_count
            FROM zipper.v_order_details
            GROUP BY order_number
        ) order_number_wise_counts
        ON vod.order_number = order_number_wise_counts.order_number
        LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
        LEFT JOIN (
            SELECT 
                COUNT(oe.swatch_approval_date) AS swatch_approval_count, 
                COUNT(*) AS order_entry_count, 
                COUNT(CASE WHEN oe.party_price > 0 AND oe.company_price > 0 THEN 1 END) AS price_approval_count,
                oe.order_description_uuid
            FROM zipper.order_entry oe
            GROUP BY oe.order_description_uuid
        ) all_approval_counts ON vod.order_description_uuid = all_approval_counts.order_description_uuid
        WHERE vod.order_description_uuid IS NOT NULL 
            AND ${
				all === 'true'
					? sql`1=1`
					: approved === 'true'
						? sql`swatch_approval_counts.swatch_approval_count > 0`
						: sql`1=1`
			}
            ${
				type === 'bulk'
					? sql`AND vod.is_sample = 0`
					: type === 'sample'
						? sql`AND vod.is_sample = 1`
						: sql`AND 1=1`
			}
            ${marketingUuid != null ? sql`AND vod.marketing_uuid = ${marketingUuid}` : sql`AND 1=1`}
        ORDER BY vod.order_description_created_at DESC, order_number_wise_rank ASC`;

		const resultPromiseForCount = await db.execute(query);

		const baseQuery = constructSelectAllQuery(
			resultPromise,
			req.query,
			'order_description_created_at'
		);

		const pagination = {
			total_record: resultPromiseForCount.length,
			current_page: Number(req.query.page) || 1,
			total_page: Math.ceil(
				resultPromiseForCount.length / req.query.limit
			),
			next_page:
				Number(req.query.page) + 1 >
				Math.ceil(resultPromiseForCount.length / req.query.limit)
					? null
					: Number(req.query.page) + 1,
			prev_page: req.query.page - 1 <= 0 ? null : req.query.page - 1,
		};

		const data = await baseQuery;

		const response = {
			pagination: pagination,
			data,
		};

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
