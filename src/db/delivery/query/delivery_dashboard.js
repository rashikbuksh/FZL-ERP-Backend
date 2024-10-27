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

export async function selectDeliveryThread(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const query = sql`
                SELECT 
                    CONCAT('TC' ,to_char(tc.created_at, 'YY'), '-', LPAD(tc.id::text, 4, '0')) as challan_number,
                    CONCAT('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
                    toi.uuid as order_info_uuid,
                    tce.challan_uuid,
                    CONCAT(tcl.count, '-', tcl.length) as count_length,
                    toe.style,
                    toe.color,
                    tce.quantity::float8 as challan_quantity,
                    CASE 
                        WHEN tc.gate_pass = 1 AND tc.received = 1 THEN 'delivered'
                        WHEN tc.gate_pass = 1 AND tc.received = 0 THEN 'in vehicle'
                        WHEN tc.gate_pass = 0 THEN 'in warehouse'
                    ELSE 'in floor' END as status
                FROM
                    thread.challan_entry tce
                LEFT JOIN
                    thread.challan tc ON tce.challan_uuid = tc.uuid
                LEFT JOIN
                    thread.order_entry toe ON tce.order_entry_uuid = toe.uuid
                LEFT JOIN
                    thread.count_length tcl ON toe.count_length_uuid = tcl.uuid
                LEFT JOIN
                    thread.order_info toi ON toe.order_info_uuid = toi.uuid`;

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
