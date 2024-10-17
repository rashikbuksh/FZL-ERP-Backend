import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectSampleLeadTime(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
    WITH combined_results AS (
        SELECT DISTINCT
            CONCAT('Z', to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')) as sample_order_no,
            oi.created_at as issue_date,
            CASE WHEN pl.challan_uuid = NULL THEN 'Pending' ELSE 'Processing' END as status,
            (SELECT c.created_at FROM delivery.challan c WHERE pl.challan_uuid = c.uuid ORDER BY 
            c.created_at DESC LIMIT 1) as delivery_last_date,
            CASE WHEN ple.quantity is NULL THEN 0 ELSE ple.quantity::float8 END as delivery_quantity,
            CASE WHEN oe.quantity is NULL THEN 0 ELSE oe.quantity::float8 END as order_quantity,
            CONCAT(CASE WHEN ple.quantity is NULL THEN 0 ELSE ple.quantity::float8 END, '/', CASE WHEN oe.quantity is NULL THEN 0 ELSE oe.quantity::float8 END) as delivery_order_quantity
        FROM
            zipper.order_info oi
            LEFT JOIN delivery.packing_list pl ON oi.uuid = pl.order_info_uuid
            LEFT JOIN delivery.challan c ON pl.challan_uuid = c.uuid
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN zipper.order_description od ON oi.uuid = od.order_info_uuid
            LEFT JOIN zipper.order_entry oe ON od.uuid = oe.order_description_uuid
        WHERE
            oi.is_sample = 1 

        UNION
        SELECT DISTINCT
            CONCAT('T', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as sample_order_no,
            toi.created_at as issue_date,
            CASE WHEN tce.challan_uuid = NULL THEN 'Pending' ELSE 'Processing' END as status,
            (SELECT tc.created_at FROM thread.challan tc WHERE tce.challan_uuid = tc.uuid ORDER BY
            tc.created_at DESC LIMIT 1) as delivery_last_date,
            CASE WHEN tce.quantity is NULL THEN 0 ELSE tce.quantity::float8 END as delivery_quantity,
            CASE WHEN toe.quantity is NULL THEN 0 ELSE toe.quantity::float8 END as order_quantity,
            CONCAT(CASE WHEN tce.quantity is NULL THEN 0 ELSE tce.quantity::float8 END, '/', CASE WHEN toe.quantity is NULL THEN 0 ELSE toe.quantity::float8 END) as delivery_order_quantity
        FROM
            thread.order_info toi
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN thread.challan_entry tce ON tce.order_entry_uuid = toe.uuid
            LEFT JOIN thread.challan tc ON tce.challan_uuid = tc.uuid
        WHERE 
            toi.is_sample = 1
        )
    SELECT *, (SELECT COUNT(*) FROM combined_results) as total_number
    FROM combined_results
    ORDER BY issue_date DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const totalNumberOfOrder =
			data.rows.length > 0 ? data.rows[0].total_number : 0;

		const chartData = data.rows.map((row) => {
			const { total_number, ...rest } = row;
			return rest;
		});

		const response = {
			total_number: totalNumberOfOrder,
			chart_data: chartData,
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Sample Lead Time',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
