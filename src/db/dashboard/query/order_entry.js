import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderEntryTotalOrdersAndItemWiseQuantity(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
              	SELECT 
                    COALESCE(z.date, t.date) as date,
                    COALESCE(z.total_quantity, 0)::float8 as zipper,
                    COALESCE(t.total_quantity, 0)::float8 as thread,
                    COALESCE(z.nylon_plastic_quantity, 0)::float8 as nylon_plastic,
                    COALESCE(z.nylon_quantity, 0)::float8 as nylon,
                    COALESCE(z.metal_quantity, 0)::float8 as metal,
                    COALESCE(z.vislon_quantity, 0)::float8 as vislon
                FROM 
                    (
						SELECT 
							DATE(vodf.order_description_created_at) as date, 
							SUM(zoe.quantity) as total_quantity,
							SUM(CASE WHEN (lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) = 'plastic') THEN zoe.quantity ELSE 0 END)::float8 as nylon_plastic_quantity,
							SUM(CASE WHEN (lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) != 'plastic') THEN zoe.quantity ELSE 0 END)::float8 as nylon_quantity,
							SUM(CASE WHEN (lower(vodf.item_name) = 'metal') THEN zoe.quantity ELSE 0 END)::float8 as metal_quantity,
							SUM(CASE WHEN (lower(vodf.item_name) = 'vislon') THEN zoe.quantity ELSE 0 END)::float8 as vislon_quantity
						FROM zipper.order_entry zoe
						LEFT JOIN zipper.v_order_details_full vodf ON zoe.order_description_uuid = vodf.order_description_uuid
						GROUP BY DATE(vodf.order_description_created_at)
					) z
                FULL OUTER JOIN 
                    (
						SELECT DATE(toi.created_at) as date, SUM(toe.quantity) as total_quantity
						FROM thread.order_entry toe 
						LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
						GROUP BY DATE(toi.created_at)
					) t
                ON z.date = t.date
				ORDER BY date DESC LIMIT 30;

                    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const response = data.rows.map((row) => ({
			date: row.date,
			zipper: row.zipper,
			thread: row.thread,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'Order entry',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
