import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderEntryTotalOrdersAndItemWiseQuantity(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
              	SELECT 
                    COALESCE(z.date) as date,
                    COALESCE(z.total_quantity, 0)::float8 as zipper,
                    0 as thread,
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
				UNION 
				SELECT
					COALESCE(t.date) as date,
					0 as zipper,
					COALESCE(t.total_quantity, 0)::float8 as thread,
					0 as nylon_plastic,
					0 as nylon,
					0 as metal,
					0 as vislon
                FROM 
                    (
						SELECT DATE(toi.created_at) as date, SUM(toe.quantity) as total_quantity
						FROM thread.order_entry toe 
						LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
						GROUP BY DATE(toi.created_at)
					) t
				ORDER BY date DESC;
                    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// same date showing twice, so need to merge them

		const response = data.rows?.reduce((acc, curr) => {
			const date = curr.date;

			const existing = acc.find((item) => item.date === date);

			if (existing) {
				existing.zipper += curr.zipper;
				existing.thread += curr.thread;
				existing.nylon_plastic += curr.nylon_plastic;
				existing.nylon += curr.nylon;
				existing.metal += curr.metal;
				existing.vislon += curr.vislon;
			} else {
				acc.push({
					date,
					zipper: curr.zipper,
					thread: curr.thread,
					nylon_plastic: curr.nylon_plastic,
					nylon: curr.nylon,
					metal: curr.metal,
					vislon: curr.vislon,
				});
			}

			return acc;
		}, []);

		console.log('response:', response);

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
