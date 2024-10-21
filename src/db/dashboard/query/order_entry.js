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
                    (SELECT DATE(created_at) as date, SUM(quantity) as total_quantity
                    FROM zipper.order_entry
                    GROUP BY DATE(created_at)) z
                FULL OUTER JOIN 
                    (SELECT DATE(created_at) as date, SUM(quantity) as total_quantity
                    FROM thread.order_entry
                    GROUP BY DATE(created_at)) t
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
