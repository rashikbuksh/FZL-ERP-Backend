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
            vpl.style,
            vpl.color,
            vpl.size,
            vpl.quantity as packing_list_quantity,
            CASE 
                WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 1 AND vpl.receive_status = 1) THEN 'delivered'
                WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 1 AND vpl.receive_status = 0) THEN 'in vehicle'
                WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 0) THEN 'in warehouse'
                ELSE 'in floor'
            END as status,
            p.name as party_name
        FROM
            delivery.v_packing_list_details vpl
        LEFT JOIN 
            zipper.order_info oi ON vpl.order_info_uuid = oi.uuid
        LEFT JOIN
            public.party p ON oi.party_uuid = p.uuid
        WHERE 
            vpl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape')
            AND vpl.is_deleted = false`;

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
                    vpl.style,
                    vpl.color,
                    vpl.size,
                    vpl.quantity as packing_list_quantity,
                    CASE 
                        WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 1 AND vpl.receive_status = 1) THEN 'delivered'
                        WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 1 AND vpl.receive_status = 0) THEN 'in vehicle'
                        WHEN (vpl.is_warehouse_received = 'true' AND vpl.gate_pass = 0) THEN 'in warehouse'
                        ELSE 'in floor'
                    END as status,
                    p.name as party_name
                FROM
                    delivery.v_packing_list_details vpl
                LEFT JOIN
                    thread.order_info oi ON vpl.order_info_uuid = oi.uuid
                LEFT JOIN
                    public.party p ON oi.party_uuid = p.uuid
                WHERE 
                    vpl.item_for IN ('thread', 'sample_thread')
                    AND vpl.is_deleted = false`;

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
