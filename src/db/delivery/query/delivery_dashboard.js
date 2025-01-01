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
            p.name as party_name,
            p.uuid as party_uuid,
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
        LEFT JOIN
            zipper.order_entry zoe ON vpl.order_entry_uuid = zoe.uuid
        LEFT JOIN 
            zipper.order_description zod ON zoe.order_description_uuid = zod.uuid
        LEFT JOIN
            zipper.order_info zoi ON zod.order_info_uuid = zoi.uuid
        LEFT JOIN
            public.party p ON zoi.party_uuid = p.uuid
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
                    p.name as party_name,
                    p.uuid as party_uuid,
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
                LEFT JOIN 
                    thread.order_entry toe ON vpl.order_entry_uuid = toe.uuid
                LEFT JOIN
                    thread.order_info oi ON toe.order_info_uuid = oi.uuid
                LEFT JOIN
                    public.party p ON oi.party_uuid = p.uuid
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
