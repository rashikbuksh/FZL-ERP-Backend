import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectChallanRegister(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { start_date, end_date } = req.query;
	console.log(start_date, end_date);
	let query = sql`
		SELECT 
                ple.quantity::float8 as amount,
                null as sewing_thread,
                CASE 
                        WHEN vodf.nylon_stopper_name = 'Metallic' THEN vodf.item_name || ' Metallic'
                        WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                        ELSE vodf.item_name
                END as item_name
        FROM
            delivery.packing_list pl
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN zipper.v_order_details_full vodf ON pl.order_info_uuid = vodf.order_info_uuid
        UNION 
        SELECT 
                ce.quantity::float8 as amount,
                concat('ST', to_char(oi.created_at, 'YY'), '-', lpad(oi.id::text, 4, '0')) AS sewing_thread,
                null as item_name
            FROM
                thread.challan c 
                LEFT JOIN thread.order_info oi ON c.order_info_uuid = oi.uuid
                LEFT JOIN thread.challan_entry ce ON c.uuid = ce.challan_uuid
    `;
	if (start_date && end_date) {
		query = sql`${query} WHERE (pl.created_at BETWEEN ${start_date} AND ${end_date} OR ce.created_at BETWEEN ${start_date} AND ${end_date})`;
	}
	const resultPromise = db.execute(query);
	try {
		const result = await resultPromise;
		// Accessing the rows directly, assuming result.rows contains the data
		const data = result.rows || result; // Adjust this based on the structure of result

		let totalChallanCount = 0;
		const summary = data.reduce((acc, row) => {
			const key = row.item_name || row.sewing_thread;
			if (key.startsWith('ST')) {
				if (!acc.sewing_thread) {
					acc.sewing_thread = {
						number_of_challan: 0,
						amount: 0,
					};
				}

				acc.sewing_thread.number_of_challan += 1;
				acc.sewing_thread.amount += parseFloat(row.amount);
			} else {
				if (!acc[key]) {
					acc[key] = { number_of_challan: 0, amount: 0 };
				}
				acc[key].number_of_challan += 1;
				acc[key].amount += parseFloat(row.amount);
			}
			totalChallanCount += 1;
			return acc;
		}, {});
		summary.totalChallanCount = totalChallanCount;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Challan register summary',
		};

		return await res.status(200).json({ toast, data: summary });
	} catch (error) {
		await handleError({ error, res });
	}
}
