import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectChallanRegister(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { start_date, end_date } = req.query;

	let query = sql`
		WITH challan_data AS (
        SELECT 
            sum(ple.quantity)::float8 as amount,
            null as sewing_thread,
            count(*) as number_of_challan,
            CASE 
                WHEN vodf.nylon_stopper_name = 'Metallic' THEN vodf.item_name || ' Metallic'
                WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                ELSE vodf.item_name
            END as item_name
        FROM
            delivery.packing_list pl
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN zipper.v_order_details_full vodf ON pl.order_info_uuid = vodf.order_info_uuid
        GROUP BY
            item_name, sewing_thread, vodf.nylon_stopper_name, vodf.item_name
        UNION 
        SELECT 
            sum(ce.quantity)::float8 as amount,
            'Sewing Thread' AS sewing_thread,
            count(*) as number_of_challan,
            null as item_name
        FROM
            thread.challan c 
            LEFT JOIN thread.order_info oi ON c.order_info_uuid = oi.uuid
            LEFT JOIN thread.challan_entry ce ON c.uuid = ce.challan_uuid
        GROUP BY
            sewing_thread
    )
    SELECT
        *,
        (SELECT SUM(number_of_challan) FROM challan_data) as total_number_of_challan
    FROM challan_data 
    `;
	if (start_date && end_date) {
		// convert day to date
		query.append(
			sql`WHERE (pl.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds' OR ce.created_at BETWEEN $${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds')`
		);
	}
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan register summary',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
