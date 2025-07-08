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
                pl_count.count as number_of_challan,
                TRIM(BOTH ' ' FROM LOWER(CASE 
                    WHEN LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%' THEN vodf.item_name
                    WHEN LOWER(vodf.nylon_stopper_name) LIKE 'plastic%' THEN vodf.item_name || ' Plastic'
                    ELSE vodf.item_name
                END)) as item_name
            FROM
                delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN zipper.sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN (
                    SELECT COUNT(*) as count, packing_list.order_info_uuid
                    FROM delivery.packing_list 
                    WHERE packing_list.challan_uuid IS NOT NULL AND packing_list.order_info_uuid IS NOT NULL
                    GROUP BY packing_list.order_info_uuid
                ) AS pl_count ON pl.order_info_uuid = pl_count.order_info_uuid
                LEFT JOIN delivery.challan ch ON pl.challan_uuid = ch.uuid
            WHERE
                ${start_date && end_date ? sql`ch.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`} 
                AND pl.challan_uuid IS NOT NULL 
                AND ple.sfg_uuid IS NOT NULL
            GROUP BY
                TRIM(BOTH ' ' FROM LOWER(CASE 
                    WHEN LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%' THEN vodf.item_name
                    WHEN LOWER(vodf.nylon_stopper_name) LIKE 'plastic%' THEN vodf.item_name || ' Plastic'
                    ELSE vodf.item_name
                END)),
                item_name,
                pl_count.count
            UNION 
            SELECT 
                sum(ple.quantity)::float8 as amount,
                pl_count.count as number_of_challan,
                'Sewing Thread' as item_name
            FROM
                delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                LEFT JOIN (
                    SELECT COUNT(*) as count, packing_list.thread_order_info_uuid
                    FROM delivery.packing_list 
					WHERE packing_list.challan_uuid IS NOT NULL AND packing_list.thread_order_info_uuid IS NOT NULL
                    GROUP BY packing_list.thread_order_info_uuid
                ) AS pl_count ON pl.thread_order_info_uuid = pl_count.thread_order_info_uuid
                LEFT JOIN delivery.challan ch ON pl.challan_uuid = ch.uuid
            WHERE
                ${start_date && end_date ? sql`ch.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`} 
                AND pl.challan_uuid IS NOT NULL 
                AND ple.thread_order_entry_uuid IS NOT NULL
            GROUP BY
                item_name, pl_count.count
        )
        SELECT
            SUM(amount) as amount,
            SUM(number_of_challan) as number_of_challan,
            item_name,
            (SELECT SUM(number_of_challan) FROM challan_data) as total_number
        FROM challan_data
        GROUP BY
                item_name;
        `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const totalNumberOfChallan =
			data.rows.length > 0 ? data.rows[0].total_number : 0;
		const chartData = data.rows.map((row) => {
			const { total_number, ...rest } = row;
			return rest;
		});

		const response = {
			total_number: totalNumberOfChallan,
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
