import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectDelivery(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
        SELECT
            vpl.packing_list_uuid,
            vpl.challan_uuid,
            vpl.challan_number,
            vpl.packing_number as packing_list_number,
            vpl.order_description_uuid,
            vpl.order_number,
            vpl.item_description,
            vodf.party_name,
            vodf.party_uuid,
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
            delivery.v_packing_list_details vpl
        WHERE 
            vpl.item_for = 'zipper' OR vpl.item_for = 'sample_zipper' OR vpl.item_for = 'tape' OR vpl.item_for = 'slider'`;

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

export async function selectDeliveryThread(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const query = sql`
                SELECT
                    vpl.packing_list_uuid,
                    vpl.challan_uuid,
                    vpl.challan_number,
                    vpl.packing_number as packing_list_number,
                    vpl.order_description_uuid,
                    vpl.order_number,
                    vpl.item_description,
                    vodf.party_name,
                    vodf.party_uuid,
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
                    delivery.v_packing_list_details vpl
                WHERE 
                    vpl.item_for = 'thread' OR vpl.item_for = 'sample_thread'`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select',
			message: 'delivery thread',
		};
		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
