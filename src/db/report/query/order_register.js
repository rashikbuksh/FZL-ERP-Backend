import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderRegisterReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const query = sql`
            SELECT
                vpld.order_info_uuid,
                vpld.order_number,
                vpld.packing_list_uuid,
                vpld.packing_list_number,
            FROM 
                delivery.v_packing_list_details vpld
            LEFT JOIN 
                delivery.v_packing_lists vpl ON vpld.packing_list_uuid = vpl.uuid
            WHERE 
                vpld.order_info_uuid = ${order_info_uuid}
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order register report',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
