import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderRegisterReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const query = sql`
            WITH challan_agg AS (
				SELECT 
					vodf.order_info_uuid,
					vodf.order_description_uuid,
					vodf.item_description,
					CASE 
						WHEN vodf.order_type = 'tape' THEN 'Meter' 
						WHEN vodf.order_type = 'slider' THEN 'Pcs'
						WHEN vodf.is_inch = 1 THEN 'Inch'
						ELSE 'Cm'
					END as unit,
					sfg.order_entry_uuid,
					sfg.uuid AS sfg_uuid,
					oe.order_description_uuid,
					oe.style,
					oe.color,
					oe.size,
					oe.quantity AS order_quantity,
					jsonb_agg(
						CASE WHEN challan.uuid IS NOT NULL THEN 
							jsonb_build_object(
							'challan_number', 
							CASE WHEN pl.item_for IN ('thread', 'sample_thread') 
								THEN concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) 
								ELSE concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
							END,
							'challan_uuid', challan.uuid,
							'challan_date', challan.created_at,
							'quantity', ple.quantity,
							'order_entry_uuid', sfg.order_entry_uuid
							)
						ELSE 'null' END
					) AS challan_array
				FROM
					zipper.order_entry oe
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN delivery.packing_list_entry ple ON sfg.uuid = ple.sfg_uuid
				LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
				LEFT JOIN delivery.challan ON pl.challan_uuid = challan.uuid
				GROUP BY sfg.order_entry_uuid, sfg.uuid, oe.order_description_uuid, oe.style, oe.color, oe.size, oe.quantity, vodf.order_info_uuid, vodf.order_description_uuid, vodf.item_description, vodf.order_type, vodf.is_inch
			),
			pi_cash_grouped AS (
				SELECT 
					vodf.order_info_uuid, 
					array_agg(DISTINCT CASE WHEN pi_cash.is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END) as pi_numbers,
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
			),
			challan_agg_thread AS (
				SELECT 
					toe.order_info_uuid,
					'Cone' as unit,
					toe.uuid as order_entry_uuid,
					CONCAT(cl.count, ' - ', cl.length) as count_length_name,
					toe.style,
					toe.color,
					toe.quantity AS order_quantity,
					jsonb_agg(
						CASE WHEN challan.uuid IS NOT NULL THEN 
							jsonb_build_object(
								'challan_number', 
								CASE WHEN pl.item_for IN ('thread', 'sample_thread') 
									THEN concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) 
									ELSE concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
								END,
								'challan_uuid', challan.uuid,
								'challan_date', challan.created_at,
								'quantity', ple.quantity,
								'order_entry_uuid', ple.thread_order_entry_uuid
							)
						ELSE 'null' END
					) AS challan_array
				FROM
					thread.order_entry toe 
				LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
				LEFT JOIN delivery.packing_list_entry ple ON toe.uuid = ple.thread_order_entry_uuid
				LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
				LEFT JOIN delivery.challan ON pl.challan_uuid = challan.uuid
				GROUP BY toe.order_info_uuid, toe.uuid, cl.count, cl.length, toe.style, toe.color, toe.quantity
			),
			pi_cash_grouped_thread AS (
				SELECT 
					toi.uuid as order_info_uuid,
					array_agg(DISTINCT CASE WHEN pi_cash.is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END) as pi_numbers,
					array_agg(DISTINCT lc.lc_number) as lc_numbers
				FROM
					thread.order_info toi
				LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
				LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
				LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
				LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
				WHERE pi_cash.id IS NOT NULL
				GROUP BY toi.uuid
			)
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
				jsonb_agg(
					jsonb_build_object(
						'order_description_uuid', vodf.order_description_uuid,
						'item_description', vodf.item_description,
						'order_entry_uuid', challan_agg.order_entry_uuid,
						'sfg_uuid', challan_agg.sfg_uuid,
						'unit', challan_agg.unit,
						'style', challan_agg.style,
						'color', challan_agg.color,
						'size', challan_agg.size,
						'order_quantity', challan_agg.order_quantity,
						'challan_array', challan_agg.challan_array
					)
				) AS order_entry
			FROM
				zipper.v_order_details_full vodf
			LEFT JOIN pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
			LEFT JOIN challan_agg ON vodf.order_info_uuid = challan_agg.order_info_uuid
			WHERE
				vodf.order_info_uuid = ${order_info_uuid}
			GROUP BY vodf.order_info_uuid, vodf.order_number, vodf.created_at, vodf.party_name, vodf.buyer_name, vodf.merchandiser_name, vodf.marketing_name, pi_cash_grouped.pi_numbers, pi_cash_grouped.lc_numbers

			UNION ALL

			SELECT 
				toi.uuid as order_info_uuid,
				concat('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
				toi.created_at,
				p.name as party_name,
				b.name as buyer_name,
				m.name as merchandiser_name,
				mk.name as marketing_name,
				pi_cash_grouped_thread.pi_numbers,
				pi_cash_grouped_thread.lc_numbers,
				jsonb_agg(
					jsonb_build_object(
						'order_entry_uuid', challan_agg_thread.order_entry_uuid,
						'unit', challan_agg_thread.unit,
						'count_length_name', challan_agg_thread.count_length_name,
						'style', challan_agg_thread.style,
						'color', challan_agg_thread.color,
						'order_quantity', challan_agg_thread.order_quantity,
						'challan_array', challan_agg_thread.challan_array
					)
				) AS order_entry
			FROM
				thread.order_info toi
			LEFT JOIN public.party p ON toi.party_uuid = p.uuid
			LEFT JOIN public.buyer b ON toi.buyer_uuid = b.uuid
			LEFT JOIN public.merchandiser m ON toi.merchandiser_uuid = m.uuid
			LEFT JOIN public.marketing mk ON toi.marketing_uuid = mk.uuid
			LEFT JOIN pi_cash_grouped_thread ON toi.uuid = pi_cash_grouped_thread.order_info_uuid
			LEFT JOIN challan_agg_thread ON toi.uuid = challan_agg_thread.order_info_uuid
			WHERE
				toi.uuid = ${order_info_uuid}
			GROUP BY toi.uuid, toi.created_at, p.name, b.name, m.name, mk.name, pi_cash_grouped_thread.pi_numbers, pi_cash_grouped_thread.lc_numbers;
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order register report',
		};

		res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		handleError(error, res);
	}
}
