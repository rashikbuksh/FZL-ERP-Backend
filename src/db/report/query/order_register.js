import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderRegisterReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const query = sql`
            WITH 
				target_order AS (
					SELECT ${order_info_uuid} as order_uuid
				),
				challan_agg AS (
					SELECT 
						sfg.order_entry_uuid,
						vodf.order_info_uuid,
						vodf.order_description_uuid,
						vodf.item_description,
						CASE 
							WHEN vodf.order_type = 'tape' THEN 'Meter' 
							WHEN vodf.order_type = 'slider' THEN 'Pcs'
							WHEN vodf.is_inch = 1 THEN 'Inch'
							ELSE 'Cm'
						END as unit,
						sfg.uuid AS sfg_uuid,
						oe.style,
						oe.color,
						oe.color_ref,
						oe.size,
						oe.quantity AS order_quantity,
						jsonb_agg(
							DISTINCT jsonb_build_object(
								'challan_number', 
								CASE WHEN challan.uuid IS NOT NULL 
									THEN 'ZC' || to_char(challan.created_at, 'YY') || '-' || challan.id::text
									ELSE NULL 
								END,
								'challan_uuid', challan.uuid,
								'challan_date', challan.created_at,
								'quantity', COALESCE(ple_sum.quantity::float8, 0),
								'order_entry_uuid', sfg.order_entry_uuid
							)
						) FILTER (WHERE challan.uuid IS NOT NULL) AS challan_array
					FROM zipper.v_order_details_full vodf
					CROSS JOIN target_order to_filter
					INNER JOIN zipper.order_entry oe ON oe.order_description_uuid = vodf.order_description_uuid
					INNER JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN delivery.packing_list pl ON pl.order_info_uuid = vodf.order_info_uuid
					LEFT JOIN delivery.challan ON pl.challan_uuid = challan.uuid
					LEFT JOIN (
						SELECT 
							pl.challan_uuid, 
							ple.sfg_uuid,
							SUM(ple.quantity) as quantity
						FROM delivery.packing_list_entry ple
						INNER JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
						WHERE pl.item_for NOT IN ('thread', 'sample_thread') 
						AND pl.challan_uuid IS NOT NULL
						GROUP BY pl.challan_uuid, ple.sfg_uuid
					) ple_sum ON challan.uuid = ple_sum.challan_uuid AND sfg.uuid = ple_sum.sfg_uuid
					WHERE vodf.order_info_uuid = to_filter.order_uuid
					GROUP BY vodf.order_info_uuid, vodf.order_description_uuid, vodf.item_description, 
							vodf.order_type, vodf.is_inch, sfg.order_entry_uuid, sfg.uuid, 
							oe.style, oe.color, oe.color_ref, oe.size, oe.quantity
				),
				pi_cash_grouped AS (
					SELECT 
						vodf.order_info_uuid,
						pi_cash.uuid as pi_cash_uuid,
						CASE WHEN pi_cash.is_pi = 1 
							THEN 'PI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
							ELSE 'CI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
						END as pi_numbers
					FROM zipper.v_order_details_full vodf
					CROSS JOIN target_order to_filter
					INNER JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
					INNER JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
					INNER JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
					INNER JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
					WHERE vodf.order_info_uuid = to_filter.order_uuid
					AND pi_cash.id IS NOT NULL
				),
				challan_agg_thread AS (
					SELECT 
						toe.uuid as order_entry_uuid,
						toe.order_info_uuid,
						'Cone' as unit,
						cl.count || ' - ' || cl.length as count_length_name,
						toe.style,
						toe.color,
						toe.color_ref,
						toe.quantity AS order_quantity,
						jsonb_agg(
							DISTINCT jsonb_build_object(
								'challan_number', 
								CASE WHEN challan.uuid IS NOT NULL 
									THEN 'TC' || to_char(challan.created_at, 'YY') || '-' || challan.id::text
									ELSE NULL 
								END,
								'challan_uuid', challan.uuid,
								'challan_date', challan.created_at,
								'quantity', COALESCE(ple_sum.quantity::float8, 0),
								'order_entry_uuid', toe.uuid
							)
						) FILTER (WHERE challan.uuid IS NOT NULL) AS challan_array
					FROM thread.order_entry toe 
					CROSS JOIN target_order to_filter
					INNER JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
					INNER JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
					LEFT JOIN delivery.packing_list pl ON pl.thread_order_info_uuid = toi.uuid
					LEFT JOIN delivery.challan ON pl.challan_uuid = challan.uuid
					LEFT JOIN (
						SELECT 
							pl.challan_uuid, 
							ple.thread_order_entry_uuid,
							SUM(ple.quantity) as quantity
						FROM delivery.packing_list_entry ple
						INNER JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
						WHERE pl.item_for IN ('thread', 'sample_thread') 
						AND pl.challan_uuid IS NOT NULL
						GROUP BY pl.challan_uuid, ple.thread_order_entry_uuid
					) ple_sum ON challan.uuid = ple_sum.challan_uuid AND toe.uuid = ple_sum.thread_order_entry_uuid
					WHERE toi.uuid = to_filter.order_uuid
					GROUP BY toe.order_info_uuid, toe.uuid, cl.count, cl.length, 
							toe.style, toe.color, toe.color_ref, toe.quantity
				),
				pi_cash_grouped_thread AS (
					SELECT 
						toe.order_info_uuid,
						pi_cash.uuid as pi_cash_uuid,
						CASE WHEN pi_cash.is_pi = 1 
							THEN 'PI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
							ELSE 'CI' || to_char(pi_cash.created_at, 'YY') || '-' || pi_cash.id::text
						END as pi_numbers
					FROM thread.order_entry toe
					CROSS JOIN target_order to_filter
					INNER JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
					INNER JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
					INNER JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
					WHERE toi.uuid = to_filter.order_uuid
					AND pi_cash.id IS NOT NULL
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
				pi_cash_grouped.pi_cash_uuid,
				jsonb_agg(
					DISTINCT jsonb_build_object(
						'order_description_uuid', vodf.order_description_uuid,
						'item_description', vodf.item_description,
						'order_entry_uuid', challan_agg.order_entry_uuid,
						'sfg_uuid', challan_agg.sfg_uuid,
						'unit', challan_agg.unit,
						'style', challan_agg.style,
						'color', challan_agg.color,
						'color_ref', challan_agg.color_ref,
						'size', challan_agg.size,
						'order_quantity', challan_agg.order_quantity,
						'challan_array', COALESCE(challan_agg.challan_array, '[]'::jsonb)
					)
				) FILTER (WHERE challan_agg.order_entry_uuid IS NOT NULL) AS order_entry
			FROM zipper.v_order_details_full vodf
			CROSS JOIN target_order to_filter
			LEFT JOIN pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
			LEFT JOIN challan_agg ON vodf.order_description_uuid = challan_agg.order_description_uuid
			WHERE vodf.order_info_uuid = to_filter.order_uuid
			GROUP BY vodf.order_info_uuid, vodf.order_number, vodf.created_at, vodf.party_name, 
					vodf.buyer_name, vodf.merchandiser_name, vodf.marketing_name, 
					pi_cash_grouped.pi_numbers, pi_cash_grouped.pi_cash_uuid

			UNION ALL

			SELECT 
				toi.uuid as order_info_uuid,
				'ST' || CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END || 
				to_char(toi.created_at, 'YY') || '-' || toi.id::text as order_number,
				toi.created_at,
				p.name as party_name,
				b.name as buyer_name,
				m.name as merchandiser_name,
				mk.name as marketing_name,
				pi_cash_grouped_thread.pi_numbers,
				pi_cash_grouped_thread.pi_cash_uuid,
				jsonb_agg(
					DISTINCT jsonb_build_object(
						'order_entry_uuid', challan_agg_thread.order_entry_uuid,
						'unit', challan_agg_thread.unit,
						'item_description', challan_agg_thread.count_length_name,
						'style', challan_agg_thread.style,
						'color', challan_agg_thread.color,
						'color_ref', challan_agg_thread.color_ref,
						'order_quantity', challan_agg_thread.order_quantity,
						'challan_array', COALESCE(challan_agg_thread.challan_array, '[]'::jsonb)
					)
				) FILTER (WHERE challan_agg_thread.order_entry_uuid IS NOT NULL) AS order_entry
			FROM thread.order_info toi
			CROSS JOIN target_order to_filter
			LEFT JOIN public.party p ON toi.party_uuid = p.uuid
			LEFT JOIN public.buyer b ON toi.buyer_uuid = b.uuid
			LEFT JOIN public.merchandiser m ON toi.merchandiser_uuid = m.uuid
			LEFT JOIN public.marketing mk ON toi.marketing_uuid = mk.uuid
			LEFT JOIN pi_cash_grouped_thread ON toi.uuid = pi_cash_grouped_thread.order_info_uuid
			LEFT JOIN challan_agg_thread ON toi.uuid = challan_agg_thread.order_info_uuid
			WHERE toi.uuid = to_filter.order_uuid
			GROUP BY toi.uuid, toi.created_at, p.name, b.name, m.name, mk.name, 
					pi_cash_grouped_thread.pi_numbers, pi_cash_grouped_thread.pi_cash_uuid;
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

export async function selectOrderRegisterReportForPackingList(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const query = sql`
            WITH packing_list_agg AS (
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
					oe.style,
					oe.color,
					oe.color_ref,
					oe.size,
					oe.quantity AS order_quantity,
					jsonb_agg(
						DISTINCT 
							jsonb_build_object(
							'packing_list_number', 
							CASE WHEN pl.uuid IS NOT NULL THEN concat('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 5, '0')) ELSE NULL END,
							'packing_list_uuid', pl.uuid,
							'packing_list_date', pl.created_at,
							'quantity', COALESCE(ple_sum.quantity::float8, 0),
							'order_entry_uuid', sfg.order_entry_uuid
							)
					) FILTER (
						WHERE
							pl.uuid IS NOT NULL
					) AS pl_array
				FROM
					zipper.order_entry oe
				INNER JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				INNER JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN delivery.packing_list pl ON vodf.order_info_uuid = pl.order_info_uuid
				LEFT JOIN (
					SELECT 
						pl.uuid as packing_list_uuid, 
						ple.sfg_uuid,
						SUM(ple.quantity) as quantity
					FROM 
						delivery.packing_list_entry ple
					INNER JOIN 
						delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
					WHERE 
						pl.item_for NOT IN ('thread', 'sample_thread')
					GROUP BY pl.uuid, ple.sfg_uuid
				) ple_sum ON pl.uuid = ple_sum.packing_list_uuid AND sfg.uuid = ple_sum.sfg_uuid
				WHERE vodf.order_info_uuid = ${order_info_uuid}
				GROUP BY sfg.order_entry_uuid, sfg.uuid, oe.order_description_uuid, oe.style, oe.color, oe.color_ref, oe.size, oe.quantity, vodf.order_info_uuid, vodf.order_description_uuid, vodf.item_description, vodf.order_type, vodf.is_inch
			),
			pi_cash_grouped AS (
				SELECT 
					DISTINCT pi_cash.uuid as pi_cash_uuid,
					CASE WHEN pi_cash.is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END as pi_numbers,
					vodf.order_info_uuid
				FROM
					zipper.v_order_details_full vodf
				INNER JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				INNER JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				INNER JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
				INNER JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
				LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
				WHERE pi_cash.id IS NOT NULL 
				AND vodf.order_info_uuid = ${order_info_uuid}
			),
			packing_list_agg_thread AS (
				SELECT 
					toe.order_info_uuid,
					'Cone' as unit,
					toe.uuid as order_entry_uuid,
					CONCAT(cl.count, ' - ', cl.length) as count_length_name,
					toe.style,
					toe.color,
					toe.color_ref,
					toe.quantity AS order_quantity,
					jsonb_agg(
						DISTINCT 
							jsonb_build_object(
								'packing_list_number', 
								CASE WHEN pl.uuid IS NOT NULL THEN concat('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 5, '0')) ELSE NULL END,
								'packing_list_uuid', pl.uuid,
								'packing_list_date', pl.created_at,
								'quantity', COALESCE(ple_sum.quantity::float8, 0),
								'order_entry_uuid', toe.uuid
							)
					) FILTER (
						WHERE
							pl.uuid IS NOT NULL
					) AS pl_array
				FROM
					thread.order_entry toe 
				INNER JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
				INNER JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
				LEFT JOIN delivery.packing_list pl ON toi.uuid = pl.thread_order_info_uuid
				LEFT JOIN (
					SELECT 
						pl.uuid as packing_list_uuid, 
						ple.thread_order_entry_uuid,
						SUM(ple.quantity) as quantity
					FROM 
						delivery.packing_list_entry ple
					INNER JOIN 
						delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
					WHERE 
						pl.item_for IN ('thread', 'sample_thread')
					GROUP BY pl.uuid, ple.thread_order_entry_uuid
				) ple_sum ON (pl.uuid = ple_sum.packing_list_uuid AND toe.uuid = ple_sum.thread_order_entry_uuid)
				WHERE toi.uuid = ${order_info_uuid}
				GROUP BY toe.order_info_uuid, toe.uuid, cl.count, cl.length, toe.style, toe.color, toe.color_ref, toe.quantity
			),
			pi_cash_grouped_thread AS (
				SELECT 
					DISTINCT pi_cash.uuid as pi_cash_uuid,
					CASE WHEN pi_cash.is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END as pi_numbers,
					toe.order_info_uuid as order_info_uuid
				FROM
					thread.order_entry toe
				INNER JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
				INNER JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
				LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
				WHERE pi_cash.id IS NOT NULL 
				AND toe.order_info_uuid = ${order_info_uuid}
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
				pi_cash_grouped.pi_cash_uuid,
				jsonb_agg(
					DISTINCT jsonb_build_object(
						'order_description_uuid', vodf.order_description_uuid,
						'item_description', vodf.item_description,
						'order_entry_uuid', packing_list_agg.order_entry_uuid,
						'sfg_uuid', packing_list_agg.sfg_uuid,
						'unit', packing_list_agg.unit,
						'style', packing_list_agg.style,
						'color', packing_list_agg.color,
						'color_ref', packing_list_agg.color_ref,
						'size', packing_list_agg.size,
						'order_quantity', packing_list_agg.order_quantity,
						'pl_array', COALESCE(packing_list_agg.pl_array, '[]'::jsonb)
					)
				) FILTER (WHERE packing_list_agg.order_entry_uuid IS NOT NULL) AS order_entry
			FROM
				zipper.v_order_details_full vodf
			LEFT JOIN pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
			LEFT JOIN packing_list_agg ON vodf.order_description_uuid = packing_list_agg.order_description_uuid
			WHERE
				vodf.order_info_uuid = ${order_info_uuid}
			GROUP BY vodf.order_info_uuid, vodf.order_number, vodf.created_at, vodf.party_name, vodf.buyer_name, vodf.merchandiser_name, vodf.marketing_name, pi_cash_grouped.pi_numbers, pi_cash_grouped.pi_cash_uuid

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
				pi_cash_grouped_thread.pi_cash_uuid,
				jsonb_agg(
					DISTINCT jsonb_build_object(
						'order_entry_uuid', packing_list_agg_thread.order_entry_uuid,
						'unit', packing_list_agg_thread.unit,
						'item_description', packing_list_agg_thread.count_length_name,
						'style', packing_list_agg_thread.style,
						'color', packing_list_agg_thread.color,
						'color_ref', packing_list_agg_thread.color_ref,
						'order_quantity', packing_list_agg_thread.order_quantity,
						'pl_array', COALESCE(packing_list_agg_thread.pl_array, '[]'::jsonb)
					)
				) FILTER (WHERE packing_list_agg_thread.order_entry_uuid IS NOT NULL) AS order_entry
			FROM
				thread.order_info toi
			LEFT JOIN public.party p ON toi.party_uuid = p.uuid
			LEFT JOIN public.buyer b ON toi.buyer_uuid = b.uuid
			LEFT JOIN public.merchandiser m ON toi.merchandiser_uuid = m.uuid
			LEFT JOIN public.marketing mk ON toi.marketing_uuid = mk.uuid
			LEFT JOIN pi_cash_grouped_thread ON toi.uuid = pi_cash_grouped_thread.order_info_uuid
			LEFT JOIN packing_list_agg_thread ON toi.uuid = packing_list_agg_thread.order_info_uuid
			WHERE
				toi.uuid = ${order_info_uuid}
			GROUP BY toi.uuid, toi.created_at, p.name, b.name, m.name, mk.name, pi_cash_grouped_thread.pi_numbers, pi_cash_grouped_thread.pi_cash_uuid;
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
