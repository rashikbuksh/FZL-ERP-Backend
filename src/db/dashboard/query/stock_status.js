import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectStockStatus(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
            	SELECT
                    mi.name,
                    mi.threshold::float8,
                    ms.stock::float8,
                    mi.unit,
                    mi.is_priority_material,
                     ( SELECT pd.created_at FROM purchase.description as pd
                        LEFT JOIN purchase.entry as pe ON pd.uuid = pe.purchase_description_uuid
                        WHERE pe.material_uuid = mi.uuid
                        ORDER BY pd.created_at DESC LIMIT 1) as last_purchase_date,
                    mi.average_lead_time as lead_time
                FROM
                    material.info mi
                LEFT JOIN
                    material.stock ms ON mi.uuid = ms.material_uuid
                ORDER BY mi.is_priority_material DESC, stock < threshold DESC LIMIT 10
                        `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const response = data.rows.map((row) => ({
			name: row.name,
			threshold: row.threshold,
			stock: row.stock,
			unit: row.unit,
			last_purchase_date: row.last_purchase_date,
			lead_time: row.lead_time,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'Stock status',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
