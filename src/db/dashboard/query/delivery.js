import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectDelivery(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
        SELECT
            vpl.challan_number,
            vpl.packing_number as packing_list_number,
            vpl.order_number,
            vpl.item_description,
            vpl.style,
            vpl.color,
            vpl.size,
            vpl.quantity as packing_list_quantity,
            CASE 
                WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 1 AND vpl.receive_status = 1) THEN 'delivered'
                WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 1 AND vpl.receive_status = 0) THEN 'in vehicle'
                WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 0) THEN 'in warehouse'
                ELSE 'in floor'
            END as status
        FROM
            delivery.v_packing_list vpl`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select',
			message: 'delivery',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
