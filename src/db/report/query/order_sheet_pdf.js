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
                            v_order_details_full.*, 
                            tape_coil_required.top::float8, 
                            tape_coil_required.bottom::float8,
                            tape_coil_required.raw_mtr_per_kg::float8 as raw_per_kg_meter,
                            tape_coil_required.dyed_mtr_per_kg::float8 as dyed_per_kg_meter,
                            pi_cash_grouped.pi_numbers,
                            od_given.order_entry
                        FROM 
                            zipper.v_order_details_full 
                        LEFT JOIN 
                            zipper.tape_coil_required 
                        ON 
                            v_order_details_full.item = tape_coil_required.item_uuid  
                            AND v_order_details_full.zipper_number = tape_coil_required.zipper_number_uuid 
                            AND v_order_details_full.end_type = tape_coil_required.end_type_uuid 
                            AND (
                                lower(v_order_details_full.item_name) != 'nylon' 
                                OR v_order_details_full.nylon_stopper = tape_coil_required.nylon_stopper_uuid
                            )
                        LEFT JOIN
                            zipper.tape_coil ON v_order_details_full.tape_coil_uuid = tape_coil.uuid
                        LEFT JOIN (
                            SELECT vodf.order_info_uuid, array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers
                            FROM
                                zipper.v_order_details_full vodf
                                LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                                LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                                LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
                                LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                            WHERE pi_cash.id IS NOT NULL
                            GROUP BY vodf.order_info_uuid
                        ) pi_cash_grouped ON v_order_details_full.order_info_uuid = pi_cash_grouped.order_info_uuid
                        LEFT JOIN (
                                SELECT
                                    od.uuid,
                                    jsonb_agg(json_build_object(
                                        'uuid', oe.uuid, 
                                        'order_description_uuid', oe.order_description_uuid,
                                        'style', oe.style,
                                        'color', oe.color,
                                        'size', oe.size,
                                        'quantity', oe.quantity,
                                        'bleaching', oe.bleaching,
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
                        ) od_given ON od_given.uuid = v_order_details_full.order_description_uuid 
                        WHERE
                            DATE(v_order_details_full.order_description_created_at) = ${date}
                        ORDER BY
                            order_number ASC, item_description ASC;`;

		const thread_query = sql`
                        SELECT 
                            order_info.uuid,
                            order_info.id,
                            CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
                            pi_cash_grouped.pi_numbers,
                            order_info.party_uuid,
                            party.name AS party_name,
                            order_info.marketing_uuid,
                            marketing.name AS marketing_name,
                            order_info.factory_uuid,
                            factory.name AS factory_name,
                            factory.address AS factory_address,
                            order_info.merchandiser_uuid,
                            merchandiser.name AS merchandiser_name,
                            order_info.buyer_uuid,
                            buyer.name AS buyer_name,
                            order_info.is_sample,
                            order_info.is_bill,
                            order_info.is_cash,
                            order_info.delivery_date,
                            order_info.created_by,
                            hr.users.name AS created_by_name,
                            order_info.created_at,
                            order_info.updated_at,
                            order_info.remarks,
                            swatch_approval_counts.swatch_approval_count,
                            order_entry_counts.order_entry_count,
                            CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatches_approved,
                            order_info.revision_no,
                            order_info.is_cancelled,
                            toe_given.order_entry
                        FROM 
                            thread.order_info
                        LEFT JOIN 
                            hr.users ON order_info.created_by = hr.users.uuid
                        LEFT JOIN 
                            public.party ON order_info.party_uuid = public.party.uuid
                        LEFT JOIN 
                            public.marketing ON order_info.marketing_uuid = public.marketing.uuid
                        LEFT JOIN 
                            public.factory ON order_info.factory_uuid = public.factory.uuid
                        LEFT JOIN 
                            public.merchandiser ON order_info.merchandiser_uuid = public.merchandiser.uuid
                        LEFT JOIN 
                            public.buyer ON order_info.buyer_uuid = public.buyer.uuid
                        LEFT JOIN (
                                    SELECT COUNT(toe.swatch_approval_date) AS swatch_approval_count, toe.order_info_uuid as order_info_uuid
                                    FROM thread.order_entry toe
                                    GROUP BY toe.order_info_uuid
                        ) swatch_approval_counts ON order_info.uuid = swatch_approval_counts.order_info_uuid
                        LEFT JOIN (
                                    SELECT COUNT(*) AS order_entry_count, toe.order_info_uuid as order_info_uuid
                                    FROM thread.order_entry toe
                                    GROUP BY toe.order_info_uuid
                        ) order_entry_counts ON order_info.uuid = order_entry_counts.order_info_uuid
                        LEFT JOIN (
                            SELECT toi.uuid as order_info_uuid, array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers
                            FROM
                                thread.order_info toi
                                LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
                                LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
                                LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                            WHERE pi_cash.id IS NOT NULL
                            GROUP BY toi.uuid
                        ) pi_cash_grouped ON order_info.uuid = pi_cash_grouped.order_info_uuid
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
                                        'bleaching', toe.bleaching,
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
                        ) toe_given ON toe_given.order_info_uuid = order_info.uuid
                        WHERE
                            DATE(order_info.created_at) = ${date}
                        ORDER BY
                            order_number ASC;
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
