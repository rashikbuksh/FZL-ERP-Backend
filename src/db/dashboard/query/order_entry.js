import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
              	SELECT 
                    COALESCE(z.date, t.date) as date,
                    COALESCE(z.total_quantity, 0)::float8 as zipper,
                    COALESCE(t.total_quantity, 0)::float8 as thread
                FROM 
                    (
						SELECT DATE(zod.created_at) as date, SUM(zoe.quantity) as total_quantity
						FROM zipper.order_entry zoe
						LEFT JOIN zipper.order_description zod ON zoe.order_description_uuid = zod.uuid
						GROUP BY DATE(zod.created_at)
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
