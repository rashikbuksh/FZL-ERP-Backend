import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function utilityReport(req, res, next) {
	try {
		const query = sql`
            SELECT 
                u.date::date,
                ue.type,
                ue.reading AS current_reading,
                ue.reading - COALESCE(ue_prev.reading, 0) AS consumption_reading,
                ue.reading - COALESCE(ue_prev.reading, 0) * ue.voltage_ratio * ue.unit_cost AS consumption_cost
            FROM
                maintain.utility_entry ue
            LEFT JOIN
                maintain.utility u ON ue.utility_uuid = u.uuid
            LEFT JOIN
                maintain.utility u_prev ON u.previous_date::date = u_prev.date::date
            LEFT JOIN 
                maintain.utility_entry ue_prev ON u_prev.uuid = ue_prev.utility_uuid
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Utility Report',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
