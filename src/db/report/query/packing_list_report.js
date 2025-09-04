import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function selectPackingList(req, res, next) {
	const { type, from_date, to_date, order_type, item_type } = req.query;

	let query = sql`
					WITH pi_cash_grouped AS (
						SELECT 
							jsonb_agg(
								json_build_object(
									'pi_cash_uuid', subquery.uuid, 
									'pi_numbers', 
									CASE 
										WHEN subquery.is_pi = 1 THEN concat('PI', to_char(subquery.created_at, 'YY'), '-', LPAD(subquery.id::text, 4, '0')) 
										ELSE concat('CI', to_char(subquery.created_at, 'YY'), '-', LPAD(subquery.id::text, 4, '0')) 
									END
								)
							) AS pi_object,
							subquery.order_info_uuid
						FROM (
							SELECT DISTINCT ON (pi_cash.uuid, vodf.order_info_uuid)
								pi_cash.uuid,
								pi_cash.is_pi,
								pi_cash.created_at,
								pi_cash.id,
								vodf.order_info_uuid
							FROM 
								zipper.v_order_details_full vodf
							LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
							LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
							LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
							LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
							WHERE pi_cash.id IS NOT NULL
						) subquery
						GROUP BY subquery.order_info_uuid
					),
					pi_cash_grouped_thread AS (
						SELECT 
							jsonb_agg(
								json_build_object(
									'pi_cash_uuid', subquery.uuid, 
									'pi_numbers', 
									CASE 
										WHEN subquery.is_pi = 1 THEN concat('PI', to_char(subquery.created_at, 'YY'), '-', LPAD(subquery.id::text, 4, '0')) 
										ELSE concat('CI', to_char(subquery.created_at, 'YY'), '-', LPAD(subquery.id::text, 4, '0')) 
									END
								)
							) AS pi_object,
							subquery.order_info_uuid
						FROM (
							SELECT DISTINCT ON (pi_cash.uuid, toe.order_info_uuid)
								pi_cash.uuid,
								pi_cash.is_pi,
								pi_cash.created_at,
								pi_cash.id,
								toe.order_info_uuid
							FROM 
								thread.order_entry toe
							LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
							LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
							WHERE pi_cash.id IS NOT NULL
						) subquery
						GROUP BY subquery.order_info_uuid
					)
                    SELECT  dvl.*,
							SUM(ple.quantity)::float8 as total_quantity,
							SUM(ple.poli_quantity)::float8 as total_poly_quantity,
							ARRAY_AGG(DISTINCT CASE 
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color ELSE toe.color END) as color,
							ARRAY_AGG(DISTINCT CASE
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color_ref ELSE toe.color_ref END) as color_ref,
							ARRAY_AGG(DISTINCT CASE
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.size ELSE NULL END) as size,
							ARRAY_AGG(DISTINCT CASE
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.style ELSE toe.style END) as style,
							ARRAY_AGG(DISTINCT 
							CASE 
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
								THEN CONCAT(oe.style, ' / ', oe.color, ' / ', oe.size) 
								ELSE CONCAT (toe.style, ' / ', toe.color) 
							END) as style_color_size,
							CASE 
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
								THEN oe.company_price
								ELSE toe.company_price
							END as company_price,
							CASE 
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
								THEN oe.party_price
								ELSE toe.party_price
							END as party_price,
							CASE 
                                WHEN vodf.order_type = 'tape' THEN 'Meter' 
                                WHEN vodf.order_type = 'slider' THEN 'Pcs' 
                                WHEN vodf.is_inch = 1 THEN 'Inch' 
                                WHEN dvl.item_for IN ('thread', 'sample_thread') THEN 'Cone' 
                                ELSE 'Cm' 
                            END as unit,
							ARRAY_AGG(
                                DISTINCT CASE 
                                    WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN vodf.item_name
                                    ELSE 'thread'
							    END
                            ) as item_type,
							ARRAY_AGG(
								DISTINCT CASE WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
								THEN vodf.zipper_number_name 
								ELSE null 
								END
							) as zipper_number_name,
							ARRAY_AGG(
								DISTINCT CASE WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
								THEN vodf.end_type_name 
								ELSE null 
								END
							) as end_type_name,
							ARRAY_AGG(
								DISTINCT CASE WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
								THEN vodf.item_description ELSE CONCAT('"', cl.count, ' - ', cl.length) 
								END
							) as item_description,
							ch.created_at as challan_created_at,
							CASE WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN pcg.pi_object ELSE pcgt.pi_object END as pi_numbers,
							CASE WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') 
								THEN ROUND((SUM(ple.quantity) / 12)::numeric * oe.company_price, 3) ELSE ROUND((SUM(ple.quantity))::numeric * toe.company_price, 3) 
							END::float8 as total_amount_without_commission,
							CASE 
								-- zipper order
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider') AND oe.party_price > 0
								THEN ROUND((SUM(ple.quantity) / 12)::numeric * oe.party_price, 3) 
								WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider') AND oe.party_price = 0
								THEN ROUND((SUM(ple.quantity) / 12)::numeric * oe.company_price, 3)
								-- tape order 
								WHEN dvl.item_for = 'tape' AND oe.party_price > 0
								THEN ROUND((SUM(ple.quantity))::numeric * oe.party_price, 3) 
								WHEN dvl.item_for = 'tape' AND oe.party_price = 0
								THEN ROUND((SUM(ple.quantity))::numeric * oe.company_price, 3)
								-- thread order
								WHEN dvl.item_for NOT IN ('zipper', 'sample_zipper', 'slider', 'tape') AND toe.party_price > 0
								THEN ROUND((SUM(ple.quantity))::numeric * toe.party_price, 3)
								WHEN dvl.item_for NOT IN ('zipper', 'sample_zipper', 'slider', 'tape') AND toe.party_price = 0
								THEN ROUND((SUM(ple.quantity))::numeric * toe.company_price, 3)
								-- default
								ELSE NULL
							END::float8 as total_amount_with_commission,
							CASE 
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape'))
								THEN ROUND((SUM(ple.quantity) / 12)::numeric * oe.company_price, 3) 
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for NOT IN ('zipper', 'sample_zipper', 'slider', 'tape'))
								THEN ROUND((SUM(ple.quantity))::numeric * toe.company_price, 3)
								ELSE NULL
							END::float8 as challan_total_amount_without_commission,
							CASE 
								-- zipper order
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for IN ('zipper', 'sample_zipper', 'slider') AND oe.party_price > 0)
								THEN ROUND((SUM(ple.quantity) / 12)::numeric * oe.party_price, 3) 
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for IN ('zipper', 'sample_zipper', 'slider') AND oe.party_price = 0)
								THEN ROUND((SUM(ple.quantity) / 12)::numeric * oe.company_price, 3)
								-- tape order 
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for = 'tape' AND oe.party_price > 0)
								THEN ROUND((SUM(ple.quantity))::numeric * oe.party_price, 3) 
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for = 'tape' AND oe.party_price = 0)
								THEN ROUND((SUM(ple.quantity))::numeric * oe.company_price, 3)
								-- thread order
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for NOT IN ('zipper', 'sample_zipper', 'slider', 'tape') AND toe.party_price > 0)
								THEN ROUND((SUM(ple.quantity))::numeric * toe.party_price, 3)
								WHEN (dvl.challan_uuid IS NOT NULL AND dvl.item_for NOT IN ('zipper', 'sample_zipper', 'slider', 'tape') AND toe.party_price = 0)
								THEN ROUND((SUM(ple.quantity))::numeric * toe.company_price, 3)
								-- default
								ELSE NULL
							END::float8 as challan_total_amount_with_commission
						FROM delivery.v_packing_list dvl
						LEFT JOIN delivery.challan ch ON dvl.challan_uuid = ch.uuid
						LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
						LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
						LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
						LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
						LEFT JOIN pi_cash_grouped pcg ON vodf.order_info_uuid = pcg.order_info_uuid
						LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
						LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
						LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
						LEFT JOIN pi_cash_grouped_thread pcgt ON toe.order_info_uuid = pcgt.order_info_uuid
						WHERE 1=1
						${
							type === 'pending'
								? sql` AND dvl.challan_uuid IS NULL`
								: type === 'challan'
									? sql` AND dvl.challan_uuid IS NOT NULL`
									: type === 'gate_pass'
										? sql` AND dvl.gate_pass = 1`
										: sql``
						}
						${from_date && to_date ? sql` AND dvl.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP` : sql``}
						${order_type == 'sample' ? sql` AND (vodf.is_sample = 1 OR toi.is_sample = 1)` : order_type == 'bulk' ? sql` AND (vodf.is_sample = 0 AND toi.is_sample = 0)` : sql``}
						${item_type === 'zipper_sample' ? sql`AND vodf.is_sample = 1` : item_type === 'zipper_bulk' ? sql`AND vodf.is_sample = 0` : item_type === 'thread' ? sql` AND (toi.is_sample = 0 OR toi.is_sample = 1)` : item_type === 'all' ? sql`` : sql``}
						AND dvl.is_deleted = false
						GROUP BY 
							dvl.uuid,
							dvl.order_info_uuid,
							dvl.packing_list_wise_rank,
							dvl.packing_list_wise_count,
							dvl.packing_number,
                            dvl.packing_number_v1,
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
							oe.company_price,
							oe.party_price,
							toe.company_price,
							toe.party_price,
							ch.uuid,
							pcg.pi_object,
							pcgt.pi_object,
							dvl.warehouse_received_by,
							dvl.warehouse_received_by_name,
							dvl.gate_pass_by,
							dvl.gate_pass_by_name,
                            dvl.is_sample,
							dvl.is_deleted,
							dvl.deleted_time,
							dvl.deleted_by,
							dvl.deleted_by_name
						ORDER BY dvl.created_at DESC;
			`;

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
