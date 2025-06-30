import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderEntryTotalOrdersAndItemWiseQuantity(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { from, to } = req.query;

	const query = sql`
              	SELECT 
					COALESCE(z.date, t.date) AS date,
					COALESCE(z.total_quantity, 0)::float8 AS zipper,
					COALESCE(t.total_quantity, 0)::float8 AS thread,
					COALESCE(z.nylon_plastic_quantity, 0)::float8 AS nylon_plastic,
					COALESCE(z.nylon_quantity, 0)::float8 AS nylon,
					COALESCE(z.metal_quantity, 0)::float8 AS metal,
					COALESCE(z.vislon_quantity, 0)::float8 AS vislon
				FROM 
					(
						SELECT 
							DATE(vodf.order_description_created_at) AS date, 
							SUM(zoe.quantity) AS total_quantity,
							SUM(CASE WHEN (LOWER(vodf.item_name) = 'nylon' AND LOWER(vodf.nylon_stopper_name) = 'plastic') THEN zoe.quantity ELSE 0 END)::float8 AS nylon_plastic_quantity,
							SUM(CASE WHEN (LOWER(vodf.item_name) = 'nylon' AND LOWER(vodf.nylon_stopper_name) != 'plastic') THEN zoe.quantity ELSE 0 END)::float8 AS nylon_quantity,
							SUM(CASE WHEN (LOWER(vodf.item_name) = 'metal') THEN zoe.quantity ELSE 0 END)::float8 AS metal_quantity,
							SUM(CASE WHEN (LOWER(vodf.item_name) = 'vislon') THEN zoe.quantity ELSE 0 END)::float8 AS vislon_quantity
						FROM zipper.order_entry zoe
						LEFT JOIN zipper.v_order_details_full vodf ON zoe.order_description_uuid = vodf.order_description_uuid
						WHERE vodf.is_cancelled = false ${from && to ? sql` AND vodf.order_description_created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql``} 
						GROUP BY DATE(vodf.order_description_created_at)
					) z
				FULL OUTER JOIN 
					(
						SELECT 
							DATE(toi.created_at) AS date, 
							SUM(toe.quantity) AS total_quantity
						FROM thread.order_entry toe 
						LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
						WHERE toi.is_cancelled = false 
						${from && to ? sql` AND toi.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql``}
						GROUP BY DATE(toi.created_at)
					) t
				ON z.date = t.date
				ORDER BY date DESC;
                `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Order entry',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
