import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import { sql } from 'drizzle-orm';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function getOrderDetailsPagination(req, res, next) {
	const {
		all,
		approved,
		type,
		own_uuid,
		start_date,
		end_date,
		marketing_uuid,
		buyer_uuid,
		party_uuid,
		order_info_uuid,
	} = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const count_query = sql`
        SELECT COUNT(*) AS total_count
        FROM zipper.v_order_details vod
        LEFT JOIN (
            SELECT 
                order_info_uuid, 
                COUNT(*) AS order_number_wise_count
            FROM zipper.v_order_details
            GROUP BY order_info_uuid
        ) order_number_wise_counts
        ON vod.order_info_uuid = order_number_wise_counts.order_info_uuid
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
						? sql`all_approval_counts.swatch_approval_count > 0`
						: sql`1=1`
			}
            ${
				type === 'bulk'
					? sql`AND vod.is_sample = 0`
					: type === 'sample'
						? sql`AND vod.is_sample = 1`
						: sql`AND 1=1`
			}
			${start_date && end_date ? sql` AND vod.order_description_created_at::date BETWEEN ${start_date}::date AND ${end_date}::date` : sql``}
            ${marketingUuid != null ? sql` AND vod.marketing_uuid = ${marketingUuid}` : sql``}
			${order_info_uuid ? sql` AND vod.order_info_uuid = ${order_info_uuid}` : sql``}
			${buyer_uuid ? sql` AND vod.buyer_uuid = ${buyer_uuid}` : sql``}
			${party_uuid ? sql` AND vod.party_uuid = ${party_uuid}` : sql``}
			${marketing_uuid ? sql` AND vod.marketing_uuid = ${marketing_uuid}` : sql``}
        `;

		let { limit, page, orderby, sort } = req.query;

		limit = limit || 10;
		page = page || 1;

		const sql_query = sql`
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
                order_info_uuid, 
                COUNT(*) AS order_number_wise_count
            FROM zipper.v_order_details
            GROUP BY order_info_uuid
        ) order_number_wise_counts
        ON vod.order_info_uuid = order_number_wise_counts.order_info_uuid
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
						: sql``
			}
			${start_date && end_date ? sql` AND vod.order_description_created_at::date BETWEEN ${start_date}::date AND ${end_date}::date` : sql``}
            ${marketingUuid != null ? sql` AND vod.marketing_uuid = ${marketingUuid}` : sql``}
			${order_info_uuid ? sql` AND vod.order_info_uuid = ${order_info_uuid}` : sql``}
			${buyer_uuid ? sql` AND vod.buyer_uuid = ${buyer_uuid}` : sql``}
			${party_uuid ? sql` AND vod.party_uuid = ${party_uuid}` : sql``}
			${marketing_uuid ? sql` AND vod.marketing_uuid = ${marketing_uuid}` : sql``}
        ${orderby || sort ? sql` ORDER BY ${sql.raw(sort)} ${sql.raw(orderby)} ` : sql` ORDER BY order_description_created_at DESC `}
        LIMIT ${limit} OFFSET ${page * limit - limit}
		`;

		// Execute the queries
		const dataPromise = db.execute(sql_query);
		const countPromise = db.execute(count_query);

		const [dataResult, countResult] = await Promise.all([
			dataPromise,
			countPromise,
		]);

		// Calculate pagination metadata
		const totalRecords = countResult.rows[0]?.total_count || 0;
		const pagination = {
			total_record: totalRecords,
			current_page: Number(page),
			total_page: Math.ceil(totalRecords / limit),
			next_page:
				Number(page) + 1 > Math.ceil(totalRecords / limit)
					? null
					: Number(page) + 1,
			prev_page: Number(page) - 1 <= 0 ? null : Number(page) - 1,
		};

		// Prepare the response
		const response = {
			pagination: pagination,
			data: dataResult.rows,
		};

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};

		res.status(200).json({ toast, ...response });
	} catch (error) {
		await handleError({ error, res });
	}
}
