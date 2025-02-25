import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderRegisterReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const query = sql`
            SELECT 
				vodf.order_info_uuid,
				vodf.order_number,
				vodf.created_at,
				vodf.party_name,
				vodf.buyer_name,
				vodf.merchandiser_name,
				vodf.marketing_name,
				pi_cash_grouped.pi_numbers,
				pi_cash_grouped.lc_numbers,
				vodf.order_description_uuid,
				vodf.item_description,
				oe.uuid as order_entry_uuid,
				null as count_length_name,
				sfg.uuid as sfg_uuid,
				oe.style,
				oe.color,
				oe.size,
				oe.quantity as order_quantity,
				challan_object.challan_array
			FROM
				zipper.v_order_details_full vodf
			LEFT JOIN (
					SELECT 
						vodf.order_info_uuid, 
						array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers,
						array_agg(DISTINCT lc.lc_number) as lc_numbers
					FROM
						zipper.v_order_details_full vodf
					LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
					LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
					LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
					LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
					WHERE pi_cash.id IS NOT NULL
					GROUP BY vodf.order_info_uuid
			) pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
			LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
			LEFT JOIN zipper.sfg ON sfg.order_entry_uuid = oe.uuid
			LEFT JOIN
				(
					SELECT 
						ple.sfg_uuid,
						jsonb_agg(
							jsonb_build_object(
								'challan_number', 
								CASE WHEN pl.item_for IN ('thread', 'sample_thread') 
									THEN concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) 
									ELSE concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
								END,
								'challan_date', challan.created_at,
								'quantity', ple.quantity
							)
						) AS challan_array
					FROM
						delivery.packing_list_entry ple
					LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
					LEFT JOIN delivery.challan ON pl.challan_uuid = challan.uuid
					WHERE challan.uuid IS NOT NULL
					GROUP BY ple.sfg_uuid
				) challan_object ON sfg.uuid = challan_object.sfg_uuid
			WHERE
				vodf.order_info_uuid = ${order_info_uuid}
			UNION
			SELECT 
				toi.uuid as order_info_uuid,
				concat('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
				toi.created_at,
				p.name as party_name,
				b.name as buyer_name,
				m.name as merchandiser_name,
				mk.name as marketing_name,
				pi_cash_grouped.pi_numbers,
				pi_cash_grouped.lc_numbers,
				null as order_description_uuid,
				null as item_description,
				toe.uuid as order_entry_uuid,
				CONCAT(cl.count, ' - ', cl.length) as count_length_name,
				null as sfg_uuid,
				toe.style,
				toe.color,
				null as size,
				toe.quantity as order_quantity,
				challan_object.challan_array
			FROM
				thread.order_info toi
			LEFT JOIN public.party p ON toi.party_uuid = p.uuid
			LEFT JOIN public.buyer b ON toi.buyer_uuid = b.uuid
			LEFT JOIN public.merchandiser m ON toi.merchandiser_uuid = m.uuid
			LEFT JOIN public.marketing mk ON toi.marketing_uuid = mk.uuid
			LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
			LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
			LEFT JOIN (
					SELECT 
						toe.uuid as order_info_uuid,
						array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers,
						array_agg(DISTINCT lc.lc_number) as lc_numbers
					FROM
						thread.order_info toi
					LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
					LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
					LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
					LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
					WHERE pi_cash.id IS NOT NULL
					GROUP BY toe.uuid
			) pi_cash_grouped ON toe.uuid = pi_cash_grouped.order_info_uuid
			LEFT JOIN
				(
					SELECT 
						ple.thread_order_entry_uuid,
						jsonb_agg(
							jsonb_build_object(
								'challan_number', 
								CASE WHEN pl.item_for IN ('thread', 'sample_thread') 
									THEN concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) 
									ELSE concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
								END,
								'challan_date', challan.created_at,
								'quantity', ple.quantity
							)
						) AS challan_array
					FROM
						delivery.packing_list_entry ple
					LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
					LEFT JOIN delivery.challan ON pl.challan_uuid = challan.uuid
					WHERE challan.uuid IS NOT NULL
					GROUP BY ple.thread_order_entry_uuid
				) challan_object ON toe.uuid = challan_object.thread_order_entry_uuid
			WHERE
				toi.uuid = ${order_info_uuid};
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order register report',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
