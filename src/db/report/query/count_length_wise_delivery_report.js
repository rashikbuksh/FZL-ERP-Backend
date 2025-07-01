import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function selectCountLengthWiseDeliveryReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, from, to } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
            SELECT 
                SUM(ple.quantity)::float8,
                CONCAT('"', cl.count)
            FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            LEFT JOIN delivery.challan ch ON pl.challan_uuid = ch.uuid
            LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
            LEFT JOIN thread.count_length cl ON cl.uuid = toe.count_length_uuid
            WHERE 
                ch.uuid IS NOT NULL AND ch.is_delivered = 1 AND ple.thread_order_entry_uuid IS NOT NULL
                AND ch.delivery_date::date BETWEEN ${from} AND ${to}
            GROUP BY cl.count
        `;

		const data = await db.execute(query);

		const toast = {
			status: 200,
			type: 'select',
			message: 'challan qty of count length',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		handleError(res, error);
	}
}
