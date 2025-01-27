import { and, eq, min, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderSheetPdf(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { date } = req.query;

	try {
		const zipper_query = sql`
                        SELECT 
                            CONCAT('Z', 
                                        CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END,
                                        to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')
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
                            od.order_type,
                            od_given.order_entry,
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
                                ) AS other_details,
                            vodf.order_description_remarks as remarks,
                            vodf.special_requirement,
                            vodf.order_type,
                            vodf.is_multi_color,
                            vodf.is_waterproof,
                            vodf.description,
                            vodf.remarks,
                            vodf.light_preference_name,
                            vodf.garments_wash,
                            vodf.garments_remarks,
                            vodf.revision_no,
                            true as is_zipper
                        FROM
                            zipper.order_info oi
                        LEFT JOIN zipper.order_description od ON od.order_info_uuid = oi.uuid
                        LEFT JOIN
                                (
                                SELECT
                                    od.uuid,
                                    jsonb_agg(json_build_object(
                                        'order_entry_uuid', oe.uuid, 
                                        'style', oe.style,
                                        'color', oe.color,
                                        'size', oe.size,
                                        'quantity', oe.quantity,
                                        'created_at', oe.created_at,
                                        'updated_at', oe.updated_at,
                                        'index', oe.index,
                                        'remarks', oe.remarks
                                    )) as order_entry
                                FROM
                                    zipper.order_description od
                                LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = od.uuid
                                GROUP BY
                                    od.uuid
                                ) od_given ON od_given.uuid = od.uuid 
                        LEFT JOIN zipper.v_order_details_full vodf ON od.uuid = vodf.order_description_uuid
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
                            DATE(od.created_at) = ${date}
                        ORDER BY
                            order_number ASC, item_description ASC;`;

		const thread_query = sql`SELECT 
                            CONCAT('ST', 
                                    CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END,
                                    to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')
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
                            null as order_type,
                            toe_given.order_entry,
                            array_to_string(toe_given.item_details, ', ') as item_details,
                            null as slider_details,
                            null as other_details,
                            false as is_zipper,
                            toi.remarks,
                        FROM 
                            thread.order_info toi
                        LEFT JOIN public.marketing pmt ON pmt.uuid = toi.marketing_uuid
                        LEFT JOIN public.party ppt ON ppt.uuid = toi.party_uuid
                        LEFT JOIN (
                            SELECT 
                                toe.order_info_uuid,
                                jsonb_agg(json_build_object(
                                        'order_entry_uuid', toe.uuid, 
                                        'style', toe.style,
                                        'color', toe.color,
                                        'count', cl.count,
                                        'length', cl.length,
                                        'count_length_name', CONCAT(cl.count, ' - ', cl.length),
                                        'quantity', toe.quantity,
                                        'created_at', toe.created_at,
                                        'updated_at', toe.updated_at,
                                        'index', toe.index,
                                        'remarks', toe.remarks
                                    )) as order_entry,
                                ARRAY_AGG(CONCAT(cl.count, ' - ', cl.length)) as item_details
                            FROM
                                thread.order_entry toe
                            LEFT JOIN 
                                thread.count_length cl ON cl.uuid = toe.count_length_uuid
                            GROUP BY
                                toe.order_info_uuid
                        ) toe_given ON toe_given.order_info_uuid = toi.uuid
                        WHERE
                            DATE(toi.created_at) = ${date}
                        ORDER BY
                            order_number ASC, item_description ASC;
                    `;

		const zipperResultPromise = db.execute(zipper_query);
		const threadResultPromise = db.execute(thread_query);

		const zipper_data = await zipperResultPromise;
		const thread_data = await threadResultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Sample report by date',
		};

		return res.status(200).json({
			toast,
			data: {
				zipper: zipper_data?.rows,
				thread: thread_data?.rows,
			},
		});
	} catch (error) {
		await handleError({ error, res });
	}
}
