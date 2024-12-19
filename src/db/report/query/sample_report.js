import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectSampleReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
    WITH zipper_results AS (
        SELECT
            CONCAT('Z', CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')) AS sample_order_no,
            oi.created_at AS issue_date,
            CASE WHEN MAX(pl.challan_uuid) IS NULL THEN 'Pending' ELSE 'Processing' END AS status,
            MAX(c.created_at) AS delivery_last_date,
            SUM(CASE WHEN pl.challan_uuid IS NOT NULL THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) AS delivery_quantity,
            SUM(COALESCE(oe.quantity::float8, 0)) AS order_quantity,
            CONCAT(SUM(CASE WHEN pl.challan_uuid IS NOT NULL THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END), '/', SUM(COALESCE(oe.quantity::float8, 0))) AS delivery_order_quantity
        FROM
            zipper.order_info oi
            LEFT JOIN delivery.packing_list pl ON oi.uuid = pl.order_info_uuid
            LEFT JOIN delivery.challan c ON pl.challan_uuid = c.uuid
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN zipper.order_description od ON oi.uuid = od.order_info_uuid
            LEFT JOIN zipper.order_entry oe ON od.uuid = oe.order_description_uuid
        WHERE
            oi.is_sample = 1 AND od.uuid IS NOT NULL
        GROUP BY
            oi.id, oi.created_at, oi.is_sample
    ),
    thread_results AS (
        SELECT
            CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS sample_order_no,
            toi.created_at AS issue_date,
            CASE WHEN MAX(tc.uuid) IS NULL THEN 'Pending' ELSE 'Processing' END AS status,
            MAX(tc.created_at) AS delivery_last_date,
            SUM(CASE WHEN tc.uuid IS NULL THEN 0 ELSE tce.quantity::float8 END) AS delivery_quantity,
            SUM(toe.quantity::float8) AS order_quantity,
            CONCAT(SUM(CASE WHEN tc.uuid IS NULL THEN 0 ELSE tce.quantity::float8 END), '/', SUM(toe.quantity::float8)) AS delivery_order_quantity
        FROM
            thread.order_info toi
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN thread.challan_entry tce ON tce.order_entry_uuid = toe.uuid
            LEFT JOIN thread.challan tc ON tce.challan_uuid = tc.uuid
        WHERE 
            toi.is_sample = 1
        GROUP BY
            toi.id, toi.created_at, toi.is_sample
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

		const toast = {
			status: 200,
			type: 'select',
			message: 'Sample report',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectSampleReportByDate(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { date } = req.query;

	const query = sql`
                     SELECT 
                           CONCAT('Z', 
                                    CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END,
                                    to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')
                                ) AS order_number,
                           pm.name AS marketing_name,
                           pp.name AS party_name,
                           op_item.name AS item_name,
                           oe.created_at::date AS issue_date,
                           CONCAT(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) as item_description,
                           ARRAY_AGG(DISTINCT oe.size) AS size,
                           od.is_inch,
                           od.is_meter,
                           od.is_cm,
                            SUM(oe.quantity) AS total_quantity,
                           oe.remarks
                        FROM
                            zipper.order_info oi
                        LEFT JOIN zipper.order_description od ON od.order_info_uuid = oi.uuid
                        LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = od.uuid 
                        LEFT JOIN public.marketing pm ON pm.uuid = oi.marketing_uuid
                        LEFT JOIN public.party pp ON pp.uuid = oi.party_uuid
                        LEFT JOIN public.properties op_item ON op_item.uuid = od.item
                        LEFT JOIN public.properties op_nylon_stopper ON op_nylon_stopper.uuid = od.nylon_stopper
                        LEFT JOIN public.properties op_zipper ON op_zipper.uuid = od.zipper_number
                        LEFT JOIN public.properties op_end ON op_end.uuid = od.end_type
                        LEFT JOIN public.properties op_puller ON op_puller.uuid = od.puller_type
                        WHERE
                            oi.is_sample = 1 AND oe.created_at::date = ${date}
                        GROUP BY
                            op_puller.short_name,op_end.short_name,op_zipper.short_name,op_nylon_stopper.short_name,op_item.short_name, oi.is_sample, oi.id, oi.created_at, pm.name, pp.name, op_item.name, oe.created_at, od.is_inch, od.is_meter, od.is_cm, od.is_inch, od.is_meter, od.is_cm, oe.remarks
                        ORDER BY
                            oe.created_at DESC;                 
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Sample report by date',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
