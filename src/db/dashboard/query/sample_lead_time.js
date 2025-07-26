import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectSampleLeadTime(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
    WITH zipper_results AS (
        SELECT
            CONCAT('Z', CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi.created_at, 'YY'), '-', oi.id::text) AS sample_order_no,
            oi.created_at AS issue_date,
            CASE 
                WHEN MAX(pl.challan_uuid) IS NULL THEN 'Pending' 
                ELSE 'Processing' 
            END AS status,
            MAX(c.created_at) AS delivery_last_date,
            SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) AS delivery_quantity,
            oe_sum.order_quantity AS order_quantity,
            CONCAT(SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END), '/', oe_sum.order_quantity) AS delivery_order_quantity
        FROM
            zipper.order_info oi
            LEFT JOIN zipper.order_description od ON oi.uuid = od.order_info_uuid
            LEFT JOIN zipper.order_entry oe ON od.uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    SUM(CASE WHEN vodf.order_type = 'tape' THEN COALESCE(oe.size::float8, 0) ELSE COALESCE(oe.quantity::float8, 0) END) AS order_quantity,
                    vodf.order_description_uuid
                FROM
                    zipper.order_entry oe
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                WHERE
                    vodf.is_sample = 1
                GROUP BY
                    vodf.order_description_uuid
            ) oe_sum ON oe.order_description_uuid = oe_sum.order_description_uuid
            LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
            LEFT JOIN delivery.packing_list_entry ple ON sfg.uuid = ple.sfg_uuid
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            LEFT JOIN delivery.challan c ON pl.challan_uuid = c.uuid
        WHERE
            oi.is_sample = 1 AND od.uuid IS NOT NULL
        GROUP BY
            oi.id, oi.is_sample, oi.created_at, oe_sum.order_quantity
        HAVING
            SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) < oe_sum.order_quantity
    ),
    thread_results AS (
        SELECT
            CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) AS sample_order_no,
            toi.created_at AS issue_date,
            CASE WHEN MAX(tc.uuid) IS NULL THEN 'Pending' ELSE 'Processing' END AS status,
            MAX(tc.created_at) AS delivery_last_date,
            SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END) AS delivery_quantity,
            SUM(toe.quantity::float8) AS order_quantity,
            CONCAT(SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END), '/', SUM(toe.quantity::float8)) AS delivery_order_quantity
        FROM
            thread.order_info toi
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN delivery.packing_list_entry ple ON toe.uuid = ple.thread_order_entry_uuid
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            LEFT JOIN delivery.challan tc ON pl.challan_uuid = tc.uuid
        WHERE 
            toi.is_sample = 1
        GROUP BY
            toi.id, toi.is_sample, toi.created_at
        HAVING
            SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END) < SUM(toe.quantity::float8)
    )
    SELECT *, (SELECT COUNT(*) FROM (SELECT * FROM zipper_results UNION ALL SELECT * FROM thread_results) AS combined) AS total_number
    FROM (
        SELECT * FROM zipper_results
        UNION ALL
        SELECT * FROM thread_results
    ) AS combined_results
    ORDER BY issue_date DESC;
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
