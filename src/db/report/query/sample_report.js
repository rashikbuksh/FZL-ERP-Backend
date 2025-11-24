import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function selectSampleReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                        WITH zipper_results AS (
                            SELECT
                                CONCAT('Z', CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi.created_at, 'YY'), '-', (oi.id::text)) AS sample_order_no,
                                oi.created_at AS issue_date,
                                CASE WHEN MAX(pl.challan_uuid) IS NULL THEN 'Pending' ELSE 'Processing' END AS status,
                                MAX(c.created_at) AS delivery_last_date,
                                SUM(CASE WHEN pl.challan_uuid IS NOT NULL THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) AS delivery_quantity,
                                SUM(COALESCE(oe.quantity::float8, 0)) AS order_quantity,
                                CONCAT(SUM(CASE WHEN pl.challan_uuid IS NOT NULL THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END), '/', SUM(COALESCE(oe.quantity::float8, 0))) AS delivery_order_quantity,
                                oi.marketing_uuid
                            FROM
                                zipper.order_info oi
                                LEFT JOIN delivery.packing_list pl ON oi.uuid = pl.order_info_uuid
                                LEFT JOIN delivery.challan c ON pl.challan_uuid = c.uuid
                                LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                                LEFT JOIN zipper.order_description od ON oi.uuid = od.order_info_uuid
                                LEFT JOIN zipper.order_entry oe ON od.uuid = oe.order_description_uuid
                            WHERE
                                oi.is_sample = 1 AND od.uuid IS NOT NULL AND oi.is_cancelled = FALSE
                            GROUP BY
                                oi.id, oi.created_at, oi.is_sample, oi.marketing_uuid
                        ),
                        thread_results AS (
                            SELECT
                                CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text)) AS sample_order_no,
                                toi.created_at AS issue_date,
                                CASE WHEN MAX(tc.uuid) IS NULL THEN 'Pending' ELSE 'Processing' END AS status,
                                MAX(tc.created_at) AS delivery_last_date,
                                SUM(CASE WHEN tc.uuid IS NULL THEN 0 ELSE ple.quantity::float8 END) AS delivery_quantity,
                                SUM(toe.quantity::float8) AS order_quantity,
                                CONCAT(SUM(CASE WHEN tc.uuid IS NULL THEN 0 ELSE ple.quantity::float8 END), '/', SUM(toe.quantity::float8)) AS delivery_order_quantity,
                                toi.marketing_uuid
                            FROM
                                thread.order_info toi
                                LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
                                LEFT JOIN delivery.packing_list_entry ple ON ple.thread_order_entry_uuid = toe.uuid
                                LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                                LEFT JOIN delivery.challan tc ON pl.challan_uuid = tc.uuid
                            WHERE
                                toi.is_sample = 1 AND toi.is_cancelled = FALSE
                            GROUP BY
                                toi.id, toi.created_at, toi.is_sample, toi.marketing_uuid
                        )
                        SELECT *, (SELECT COUNT(*) FROM (SELECT * FROM zipper_results UNION ALL SELECT * FROM thread_results) AS combined) AS total_number
                        FROM (
                            SELECT * FROM zipper_results
                            UNION ALL
                            SELECT * FROM thread_results
                        ) AS combined_results
                        WHERE
                            ${own_uuid == null ? sql`TRUE` : sql`combined_results.marketing_uuid = ${marketingUuid}`}
                        ORDER BY issue_date DESC;`;

		const resultPromise = db.execute(query);

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

	const { own_uuid, date, to_date, is_sample, show_zero_balance } =
		req?.query;

	let toDate = to_date === null || to_date === undefined ? null : to_date;

	if (toDate) {
	} else {
		toDate = date;
	}

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                        SELECT 
                            vodf.order_number,
                            vodf.order_info_uuid,
                            vodf.marketing_name,
                            vodf.party_name,
                            vodf.item_name,
                            oe.created_at::date AS issue_date,
                            vodf.item_description,
                            vodf.order_description_uuid,
                            oe.size,
                            vodf.is_inch,
                            vodf.is_meter,
                            vodf.is_cm,
                            oe.quantity::float8,
                            oe.remarks,
                            vodf.order_type,
                            oe.style,
                            oe.color,
                            oe.color_ref,
                            oe.color_ref_entry_date,
                            oe.color_ref_update_date,
                            oe.company_price::float8,
                            oe.party_price::float8,
                            sfg.pi::float8,
                            sfg.finishing_prod::float8,
                            (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8) as balance,
                            sfg.warehouse::float8,
                            sfg.delivered::float8,
                            oe.quantity::float8 - sfg.delivered::float8 as delivered_balance,
                            CONCAT(
                                CASE WHEN vodf.item_name IS NOT NULL AND vodf.item_name != '---' THEN vodf.item_name ELSE '' END,
                                CASE WHEN vodf.zipper_number_name IS NOT NULL AND vodf.zipper_number_name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN vodf.zipper_number_name IS NOT NULL AND vodf.zipper_number_name != '---' THEN vodf.zipper_number_name ELSE '' END,
                                CASE WHEN vodf.end_type_name IS NOT NULL AND vodf.end_type_name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN vodf.end_type_name IS NOT NULL AND vodf.end_type_name != '---' THEN vodf.end_type_name ELSE '' END,
                                CASE WHEN vodf.hand_name IS NOT NULL AND vodf.hand_name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN vodf.hand_name IS NOT NULL AND vodf.hand_name != '---' THEN vodf.hand_name ELSE '' END,
                                CASE WHEN vodf.teeth_type_name IS NOT NULL AND vodf.teeth_type_name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN vodf.teeth_type_name IS NOT NULL AND vodf.teeth_type_name != '---' THEN vodf.teeth_type_name ELSE '' END,
                                CASE WHEN vodf.teeth_color_name IS NOT NULL AND vodf.teeth_color_name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN vodf.teeth_color_name IS NOT NULL AND vodf.teeth_color_name != '---' THEN vodf.teeth_color_name ELSE '' END,
                                CASE WHEN vodf.nylon_stopper_name IS NOT NULL AND vodf.nylon_stopper_name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN vodf.nylon_stopper_name IS NOT NULL AND vodf.nylon_stopper_name != '---' THEN vodf.nylon_stopper_name ELSE '' END
                            ) AS item_details,
                            CONCAT(
                                COALESCE(vodf.puller_type_name, ''),
                                CASE WHEN vodf.puller_color_name IS NOT NULL THEN ', Puller: ' ELSE '' END,
                                COALESCE(vodf.puller_color_name, ''),
                                CASE WHEN vodf.coloring_type_name IS NOT NULL THEN ', Slider: ' ELSE '' END,
                                COALESCE(vodf.coloring_type_name, ''),
                                CASE WHEN vodf.slider_name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(vodf.slider_name, ''),
                                CASE WHEN vodf.top_stopper_name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(vodf.top_stopper_name, ''),
                                CASE WHEN vodf.bottom_stopper_name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(vodf.bottom_stopper_name, ''),
                                CASE WHEN vodf.logo_type_name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(vodf.logo_type_name, ''),
                                CASE WHEN vodf.slider_body_shape_name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(vodf.slider_body_shape_name, ''),
                                CASE WHEN vodf.slider_link_name IS NOT NULL THEN ', ' ELSE '' END,
                                COALESCE(vodf.slider_link_name, '')
                            ) AS slider_details,
                            CONCAT(
                                vodf.garment,
                                COALESCE(vodf.end_user_name, ''),
                                CASE WHEN vodf.light_preference_name IS NOT NULL THEN ' ,' ELSE '' END,
                                COALESCE(vodf.light_preference_name, '')
                            ) AS other_details,
                            ch_details.challan_info,
                            oe.bulk_approval,
                            oe.bulk_approval_date
                        FROM
                            zipper.order_info oi
                        LEFT JOIN zipper.order_description od ON od.order_info_uuid = oi.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = od.uuid
                        LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = vodf.order_description_uuid 
                        LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN (
                            SELECT 
                                ple.sfg_uuid,
                                json_agg(
                                    jsonb_build_object(
                                        'challan_uuid', ch.uuid,
                                        'challan_number', CONCAT('ZC', to_char(ch.created_at, 'YY'), '-', ch.id),
                                        'challan_date', ch.created_at,
                                        'is_delivered', ch.is_delivered,
                                        'challan_quantity', COALESCE(ple.quantity, 0)::float8,
                                        'packing_list_uuid', pl.uuid,
                                        'packing_list_number', CONCAT('ZP', to_char(pl.created_at, 'YY'), '-', pl.id)
                                    )
                                ) AS challan_info
                            FROM
                                delivery.challan ch
                            LEFT JOIN delivery.packing_list pl ON ch.uuid = pl.challan_uuid
                            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                            GROUP BY 
                                ple.sfg_uuid
                        ) ch_details ON ch_details.sfg_uuid = sfg.uuid
                        WHERE
                            oe.quantity IS NOT NULL
                            AND vodf.order_description_uuid IS NOT NULL
                            ${is_sample ? sql` AND oi.is_sample = ${is_sample}` : sql``}
                            ${
								date && toDate
									? sql` AND od.created_at BETWEEN ${date}::TIMESTAMP AND ${toDate}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'`
									: sql``
							}
                            ${own_uuid ? sql` AND oi.marketing_uuid = ${marketingUuid}` : sql``}
                            ${
								show_zero_balance == 1
									? sql``
									: sql` AND (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8) > 0`
							}
                        ORDER BY
                            order_number ASC, item_description ASC`;

		const resultPromise = db.execute(query);

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

export async function selectSampleReportByDateCombined(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { date, to_date, is_sample } = req.query;
	const { own_uuid } = req?.query;

	let toDate = to_date;

	if (toDate) {
	} else {
		toDate = date;
	}

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                        SELECT 
                            CONCAT('Z', 
                                    CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END,
                                    to_char(oi.created_at, 'YY'), '-', oi.id::text
                                ) AS order_number,
                            oi.uuid as order_info_uuid,
                            pm.name AS marketing_name,
                            pp.name AS party_name,
                            op_item.name AS item_name,
                            od.created_at AS issue_date,
                            CONCAT(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) as item_description,
                            od.uuid as order_description_uuid,
                            od.is_inch,
                            od.is_meter,
                            od.is_cm,
                            od_given.remarks,
                            od.order_type,
                            od_given.style,
                            od_given.color,
                            od_given.color_ref,
                            od_given.size,
                            od_given.total_quantity::float8,
                            CONCAT(
                                CASE WHEN op_item.name IS NOT NULL AND op_item.name != '---' THEN op_item.name ELSE '' END,
                                CASE WHEN op_zipper.name IS NOT NULL AND op_zipper.name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN op_zipper.name IS NOT NULL AND op_zipper.name != '---' THEN op_zipper.name ELSE '' END,
                                CASE WHEN op_end.name IS NOT NULL AND op_end.name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN op_end.name IS NOT NULL AND op_end.name != '---' THEN op_end.name ELSE '' END,
                                CASE WHEN op_hand.name IS NOT NULL AND op_hand.name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN op_hand.name IS NOT NULL AND op_hand.name != '---' THEN op_hand.name ELSE '' END,
                                CASE WHEN op_teeth_type.name IS NOT NULL AND op_teeth_type.name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN op_teeth_type.name IS NOT NULL AND op_teeth_type.name != '---' THEN op_teeth_type.name ELSE '' END,
                                CASE WHEN op_teeth_color.name IS NOT NULL AND op_teeth_color.name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN op_teeth_color.name IS NOT NULL AND op_teeth_color.name != '---' THEN op_teeth_color.name ELSE '' END,
                                CASE WHEN op_nylon_stopper.name IS NOT NULL AND op_nylon_stopper.name != '---' THEN ', ' ELSE '' END,
                                CASE WHEN op_nylon_stopper.name IS NOT NULL AND op_nylon_stopper.name != '---' THEN op_nylon_stopper.name ELSE '' END
                                ) AS item_details,
                            CONCAT(
                                COALESCE(op_puller.name, ''),
                                CASE WHEN op_puller_color.name IS NOT NULL THEN ', Puller: ' ELSE '' END,
                                COALESCE(op_puller_color.name, ''),
                                CASE WHEN op_coloring.name IS NOT NULL THEN ', Slider: ' ELSE '' END,
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
                        LEFT JOIN
                                (SELECT
                                    od.uuid,
                                    SUM(oe.quantity) as total_quantity,
                                    array_agg(DISTINCT oe.style) as style,
                                    array_agg(DISTINCT oe.color) as color,
                                    array_agg(DISTINCT oe.color_ref) as color_ref,
                                    array_agg(DISTINCT oe.size) as size,
                                    array_agg(DISTINCT TO_CHAR(oe.created_at, 'YYYY-MM-DD')) as created_at,
                                    array_agg(DISTINCT oe.remarks) as remarks
                                FROM
                                    zipper.order_description od
                                LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = od.uuid
                                GROUP BY
                                    od.uuid
                                ) od_given ON od_given.uuid = od.uuid 
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
                            oi.is_sample = ${is_sample} 
                            AND od.created_at BETWEEN ${date}::TIMESTAMP and ${toDate}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
                            AND ${own_uuid ? sql`oi.marketing_uuid = ${marketingUuid}` : sql`TRUE`}
                        UNION
                        SELECT 
                            CONCAT('ST', 
                                    CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END,
                                    to_char(toi.created_at, 'YY'), '-', (toi.id::text)
                                ) AS order_number,
                            toi.uuid as order_info_uuid,
                            pmt.name AS marketing_name,
                            ppt.name AS party_name,
                            'Sewing Thread' AS item_name,
                            toi.created_at AS issue_date,
                            null as item_description,
                            null as order_description_uuid,
                            0 as is_inch,
                            1 as is_meter,
                            0 as is_cm,
                            toe_given.remarks,
                            null as order_type,
                            toe_given.style,
                            toe_given.color,
                            toe_given.size,
                            toe_given.total_quantity::float8,
                            toe_given.count_length_names AS item_details,
                            null as slider_details,
                            null as other_details
                        FROM 
                            thread.order_info toi
                        LEFT JOIN public.marketing pmt ON pmt.uuid = toi.marketing_uuid
                        LEFT JOIN public.party ppt ON ppt.uuid = toi.party_uuid
                        LEFT JOIN (
                            SELECT 
                                toe.order_info_uuid,
                                string_agg(DISTINCT cl.count, ', ') as name,
                                array_agg(DISTINCT TO_CHAR(toe.created_at, 'YYYY-MM-DD')) as created_at,
                                array_agg(DISTINCT toe.style) as style,
                                array_agg(DISTINCT toe.color) as color,
                                array_agg(DISTINCT toe.color_ref) as color_ref,
                                array_agg(DISTINCT cl.length::text) as size,
                                array_agg(DISTINCT toe.remarks) as remarks,
                                SUM(toe.quantity) as total_quantity,
                                string_agg(DISTINCT CONCAT(cl.count, ' - ', cl.length), ', ') as count_length_names
                            FROM
                                thread.order_entry toe
                            LEFT JOIN 
                                thread.count_length cl ON cl.uuid = toe.count_length_uuid
                            GROUP BY
                                toe.order_info_uuid
                        ) toe_given ON toe_given.order_info_uuid = toi.uuid
                        WHERE
                            toi.is_sample = ${is_sample} 
                            AND toi.created_at BETWEEN ${date}::TIMESTAMP and ${toDate}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
                            AND ${own_uuid ? sql`toi.marketing_uuid = ${marketingUuid}` : sql`TRUE`}
                        ORDER BY
                            order_number ASC, item_description ASC;
                    `;

		const resultPromise = db.execute(query);

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

export async function selectThreadSampleReportByDate(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, date, is_sample } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                     SELECT 
                            CONCAT('ST', 
                                    CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END,
                                    to_char(toi.created_at, 'YY'), '-', (toi.id::text)
                                ) AS order_number,
                            toi.uuid as order_info_uuid,
                            pmt.name AS marketing_name,
                            ppt.name AS party_name,
                            'Sewing Thread' AS item_name,
                            toi.created_at AS issue_date,
                            0 as is_inch,
                            1 as is_meter,
                            0 as is_cm,
                            toe_given.remarks,
                            null as order_type,
                            toe_given.style,
                            toe_given.color,
                            toe_given.size,
                            toe_given.total_quantity,
                            toe_given.count_length_names AS item_details,
                            null as slider_details,
                            null as other_details
                        FROM 
                            thread.order_info toi
                        LEFT JOIN public.marketing pmt ON pmt.uuid = toi.marketing_uuid
                        LEFT JOIN public.party ppt ON ppt.uuid = toi.party_uuid
                        LEFT JOIN (
                            SELECT 
                                toe.order_info_uuid,
                                string_agg(DISTINCT cl.count, ', ') as name,
                                array_agg(DISTINCT TO_CHAR(toe.created_at, 'YYYY-MM-DD')) as created_at,
                                array_agg(DISTINCT toe.style) as style,
                                array_agg(DISTINCT toe.color) as color,
                                array_agg(DISTINCT toe.color_ref) as color_ref,
                                array_agg(DISTINCT cl.length::text) as size,
                                array_agg(DISTINCT toe.remarks) as remarks,
                                SUM(toe.quantity) as total_quantity,
                                string_agg(DISTINCT CONCAT(cl.count, ' - ', cl.length), ', ') as count_length_names
                            FROM
                                thread.order_entry toe
                            LEFT JOIN 
                                thread.count_length cl ON cl.uuid = toe.count_length_uuid
                            GROUP BY
                                toe.order_info_uuid
                        ) toe_given ON toe_given.order_info_uuid = toi.uuid
                        WHERE
                            toi.is_sample = ${is_sample} AND ${date} = toi.created_at::date AND ${own_uuid ? sql`toi.marketing_uuid = ${marketingUuid}` : sql`TRUE`}
                        ORDER BY
                            order_number ASC, item_description ASC;
                        `;

		const resultPromise = db.execute(query);

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
