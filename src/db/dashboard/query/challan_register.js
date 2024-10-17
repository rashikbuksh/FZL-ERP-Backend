import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectChallanRegister(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { start_date, end_date } = req.query;

	const query = sql`
        WITH challan_data AS (
            SELECT 
                sum(ple.quantity)::float8 as amount,
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
            WHERE
                ${start_date ? sql`pl.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
            GROUP BY
                item_name, vodf.nylon_stopper_name, vodf.item_name
            UNION 
            SELECT 
                sum(ce.quantity)::float8 as amount,
                count(*) as number_of_challan,
                'sewing_thread' as item_name
            FROM
                thread.challan c 
                LEFT JOIN thread.order_info oi ON c.order_info_uuid = oi.uuid
                LEFT JOIN thread.challan_entry ce ON c.uuid = ce.challan_uuid
            WHERE
                ${start_date ? sql`ce.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
            GROUP BY
                item_name
        )
        SELECT
            *,
            (SELECT SUM(number_of_challan) FROM challan_data) as total_number_of_challan
        FROM challan_data;
        `;

	if (start_date && end_date) {
		// Execute the query with the date range
		console.log(query);
	}
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const totalNumberOfChallan =
			data.rows.length > 0 ? data.rows[0].total_number_of_challan : 0;
		const chartData = data.rows.map((row) => {
			const { total_number_of_challan, ...rest } = row;
			return rest;
		});

		const response = {
			total_number_of_challan: totalNumberOfChallan,
			chart_data: chartData,
		};
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan register summary',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
