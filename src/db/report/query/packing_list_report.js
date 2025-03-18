import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectPackingList(req, res, next) {
	let query = sql`
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
                            END as unit
						FROM delivery.v_packing_list dvl
						LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
						LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
						LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
						LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
						LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
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
							vodf.is_inch
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
