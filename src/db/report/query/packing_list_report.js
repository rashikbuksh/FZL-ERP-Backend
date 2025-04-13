import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectPackingList(req, res, next) {
	const { type } = req.query;

	let query = sql`
					WITH pi_cash_grouped AS (
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
                    SELECT  dvl.*,
							SUM(ple.quantity)::float8 as total_quantity,
							SUM(ple.poli_quantity)::float8 as total_poly_quantity,
							ARRAY_AGG(DISTINCT CASE 
								WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape' THEN oe.color ELSE toe.color END) as color,
							ARRAY_AGG(DISTINCT CASE
								WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape' THEN oe.size ELSE NULL END) as size,
							ARRAY_AGG(DISTINCT CASE
								WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape' THEN oe.style ELSE toe.style END) as style,
							ARRAY_AGG(DISTINCT 
							CASE 
								WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape'
								THEN CONCAT(oe.style, ' / ', oe.color, ' / ', oe.size) 
								ELSE CONCAT (toe.style, ' / ', toe.color) 
							END) as style_color_size,
							CASE 
                                WHEN vodf.order_type = 'tape' THEN 'Meter' 
                                WHEN vodf.order_type = 'slider' THEN 'Pcs' 
                                WHEN vodf.is_inch = 1 THEN 'Inch' 
                                WHEN dvl.item_for = 'thread' OR dvl.item_for = 'sample_thread' THEN 'Cone' 
                                ELSE 'Cm' 
                            END as unit,
							ARRAY_AGG(
								CASE WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape' 
								THEN vodf.item_description ELSE CONCAT('"', cl.count, ' - ', cl.length) 
								END
							) as item_description,
							ch.created_at as challan_created_at,
							CASE WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape' THEN pcg.pi_numbers ELSE pcgt.pi_numbers END as pi_numbers,
							CASE WHEN dvl.item_for = 'zipper' OR dvl.item_for = 'sample_zipper' OR dvl.item_for = 'slider' OR dvl.item_for = 'tape' THEN pcg.lc_numbers ELSE pcgt.lc_numbers END as lc_numbers
						FROM delivery.v_packing_list dvl
						LEFT JOIN delivery.challan ch ON dvl.challan_uuid = ch.uuid
						LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
						LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
						LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
						LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
						LEFT JOIN pi_cash_grouped pcg ON vodf.order_info_uuid = pcg.order_info_uuid
						LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
						LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
						LEFT JOIN pi_cash_grouped_thread pcgt ON toe.order_info_uuid = pcgt.order_info_uuid
						WHERE 1=1
						${
							type === 'pending'
								? sql`AND dvl.challan_uuid IS NULL`
								: type === 'challan'
									? sql`AND dvl.challan_uuid IS NOT NULL`
									: type === 'gate_pass'
										? sql`AND dvl.gate_pass = 1`
										: sql``
						}
						GROUP BY dvl.uuid,
							dvl.order_info_uuid,
							dvl.packing_list_wise_rank,
							dvl.packing_list_wise_count,
							dvl.packing_number,
							dvl.order_number,
							dvl.item_for,
							dvl.challan_uuid,
							dvl.challan_number,
							dvl.carton_size,
							dvl.carton_weight,
							dvl.carton_uuid,
							dvl.carton_name,
							dvl.is_warehouse_received,
							dvl.factory_uuid,
							dvl.factory_name,
							dvl.buyer_uuid,
							dvl.buyer_name,
							dvl.party_uuid,
							dvl.party_name,
							dvl.created_by,
							dvl.created_by_name,
							dvl.created_at,
							dvl.updated_at,
							dvl.remarks,
							dvl.gate_pass,
							dvl.marketing_uuid,
							dvl.marketing_name,
							vodf.order_type,
							vodf.is_inch,
							dvl.warehouse_received_date,
                            dvl.gate_pass_date,
							ch.created_at,
							pcg.pi_numbers,
							pcg.lc_numbers,
							pcgt.pi_numbers,
							pcgt.lc_numbers
						ORDER BY dvl.created_at DESC;`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing List',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
