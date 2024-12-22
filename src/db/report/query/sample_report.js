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
                            oi.uuid as order_info_uuid,
                           pm.name AS marketing_name,
                           pp.name AS party_name,
                           op_item.name AS item_name,
                           oe.created_at::date AS issue_date,
                           CONCAT(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) as item_description,
                           od.uuid as order_description_uuid,
                           oe.size,
                           od.is_inch,
                           od.is_meter,
                           od.is_cm,
                           oe.quantity,
                           oe.remarks,
                           od.order_type,
                           oe.style,
                           oe.color,
                           CONCAT(
                                COALESCE(op_item.name, ''),
                                CASE WHEN op_zipper.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_zipper.name, ''),
                                CASE WHEN op_end.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_end.name, ''),
                                CASE WHEN op_hand.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_hand.name, ''),
                                CASE WHEN op_teeth_type.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_teeth_type.name, ''),
                                CASE WHEN op_teeth_color.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_teeth_color.name, ''),
                                CASE WHEN op_nylon_stopper.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_nylon_stopper.name, '')
                                ) AS item_details,
                        CONCAT(
                                COALESCE(op_puller.name, ''),
                                CASE WHEN op_puller_color.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_puller_color.name, ''),
                                CASE WHEN op_coloring.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_coloring.name, ''),
                                CASE WHEN op_slider.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_slider.name, ''),
                                CASE WHEN op_top_stopper.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_top_stopper.name, ''),
                                CASE WHEN op_bottom_stopper.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_bottom_stopper.name, ''),
                                CASE WHEN op_logo.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_logo.name, ''),
                                CASE WHEN op_slider_body_shape.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_slider_body_shape.name, ''),
                                CASE WHEN op_slider_link.name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(op_slider_link.name, '')
                            ) AS slider_details,
                        CONCAT(
                                od.garment,
                                COALESCE(op_end_user.name, ''),
                                CASE WHEN op_light_preference.name IS NOT NULL THEN ' ,' ELSE '' END,
                                COALESCE(op_light_preference.name, '')
                            ) AS other_details
                        FROM
                            zipper.order_info oi
                        LEFT JOIN zipper.order_description od ON od.order_info_uuid = oi.uuid
                        LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = od.uuid 
                        LEFT JOIN public.marketing pm ON pm.uuid = oi.marketing_uuid
                        LEFT JOIN public.party pp ON pp.uuid = oi.party_uuid
                        LEFT JOIN public.properties op_item ON op_item.uuid = od.item
                        LEFT JOIN public.properties op_zipper ON op_zipper.uuid = od.zipper_number
                        LEFT JOIN public.properties op_end ON op_end.uuid = od.end_type
                        LEFT JOIN public.properties op_hand ON op_hand.uuid = od.hand
                        LEFT JOIN public.properties op_lock ON op_lock.uuid = od.lock_type
                        LEFT JOIN public.properties op_teeth_type ON op_teeth_type.uuid = od.teeth_type
                        LEFT JOIN public.properties op_teeth_color ON op_teeth_color.uuid = od.teeth_color
                        LEFT JOIN public.properties op_nylon_stopper ON op_nylon_stopper.uuid = od.nylon_stopper
                        LEFT JOIN public.properties op_puller ON op_puller.uuid = od.puller_type
                        LEFT JOIN public.properties op_puller_color ON op_puller_color.uuid = od.puller_color
                        LEFT JOIN public.properties op_coloring ON op_coloring.uuid = od.coloring_type
                        LEFT JOIN public.properties op_slider ON op_slider.uuid = od.slider
                        LEFT JOIN public.properties op_top_stopper ON op_top_stopper.uuid = od.top_stopper
                        LEFT JOIN public.properties op_bottom_stopper ON op_bottom_stopper.uuid = od.bottom_stopper
                        LEFT JOIN public.properties op_logo ON op_logo.uuid = od.logo_type
                        LEFT JOIN public.properties op_slider_body_shape ON op_slider_body_shape.uuid = od.slider_body_shape
                        LEFT JOIN public.properties op_slider_link ON op_slider_link.uuid = od.slider_link
                        LEFT JOIN public.properties op_end_user ON op_end_user.uuid = od.end_user
                        LEFT JOIN public.properties op_light_preference ON op_light_preference.uuid = od.light_preference
                        WHERE
                            oi.is_sample = 1 AND oe.created_at::date = ${date}
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
