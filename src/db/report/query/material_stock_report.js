import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function MaterialStockReport(req, res, next) {
	const { from_date, to_date, own_uuid, store_type } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;
	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                m.uuid as material_uuid,
                ms.name as material_section_name,
                m.name as material_name,
                m.unit as material_unit,
                ROUND((coalesce(opening_purchase.total_purchase_quantity, 0) - COALESCE(opening_material_consumption.total_issue_quantity,0) - COALESCE(opening_s2s_consumption.total_s2s_issue_quantity, 0))::numeric, 2)::float8 as opening_quantity,
                ROUND(coalesce(purchase.total_purchase_quantity, 0)::numeric, 2)::float8 as purchase_quantity,
                ROUND((coalesce(material_consumption.total_issue_quantity, 0) + COALESCE(s2s_consumption.total_s2s_issue_quantity, 0))::numeric, 2)::float8 as consumption_quantity,
                ROUND((coalesce(opening_purchase.total_purchase_quantity, 0) - COALESCE(opening_material_consumption.total_issue_quantity,0) - COALESCE(opening_s2s_consumption.total_s2s_issue_quantity, 0) 
                + coalesce(purchase.total_purchase_quantity, 0) - coalesce(material_consumption.total_issue_quantity, 0) - COALESCE(s2s_consumption.total_s2s_issue_quantity, 0))::numeric, 2)::float8 as closing_quantity
            FROM 
                material.info m 
            LEFT JOIN
                material.section ms ON m.section_uuid = ms.uuid
            LEFT JOIN 
                (
                    SELECT 
                        material_uuid,
                        SUM(quantity)::float8 as total_purchase_quantity
                    FROM 
                        purchase.entry
                    LEFT JOIN
                        material.info mi ON mi.uuid = purchase.entry.material_uuid
                    WHERE 
                        entry.created_at < ${from_date}::TIMESTAMP
                        AND ${store_type ? sql`mi.store_type = ${store_type}` : sql`true`}
                    GROUP BY 
                        material_uuid
                ) opening_purchase ON m.uuid = opening_purchase.material_uuid
            LEFT JOIN 
                (
                    SELECT 
                        material_uuid,
                        SUM(quantity)::float8 as total_purchase_quantity
                    FROM
                        purchase.entry
                    LEFT JOIN 
                        material.info mi ON mi.uuid = purchase.entry.material_uuid
                    WHERE 
                        entry.created_at >= ${from_date}::TIMESTAMP AND entry.created_at <= ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
                        AND ${store_type ? sql`mi.store_type = ${store_type}` : sql`true`}
                    GROUP BY
                        material_uuid
                ) purchase ON m.uuid = purchase.material_uuid
            LEFT JOIN 
                (
                    SELECT 
                        mi.uuid as material_uuid,
                        SUM(COALESCE(mtrx.trx_quantity, 0))::float8 as total_issue_quantity
                    FROM 
                        material.info mi
                    LEFT JOIN 
                        material.trx mtrx ON (mi.uuid = mtrx.material_uuid AND mtrx.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds')
                    WHERE 
                        ${store_type ? sql`mi.store_type = ${store_type}` : sql`true`}
                    GROUP BY 
                        mi.uuid
                ) material_consumption ON m.uuid = material_consumption.material_uuid
            LEFT JOIN 
                (
                    SELECT 
                        mi.uuid as material_uuid,
                        SUM(COALESCE(s2s.trx_quantity, 0))::float8 as total_s2s_issue_quantity
                    FROM 
                        material.info mi
                    LEFT JOIN 
                        zipper.material_trx_against_order_description s2s ON (mi.uuid = s2s.material_uuid AND s2s.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds')
                    WHERE 
                        ${store_type ? sql`mi.store_type = ${store_type}` : sql`true`}
                    GROUP BY 
                        mi.uuid
                ) s2s_consumption ON m.uuid = s2s_consumption.material_uuid
            LEFT JOIN 
                (
                    SELECT 
                        mi.uuid as material_uuid,
                        SUM(COALESCE(mtrx.trx_quantity, 0))::float8 as total_issue_quantity
                    FROM 
                        material.info mi
                    LEFT JOIN 
                        material.trx mtrx ON mi.uuid = mtrx.material_uuid AND mtrx.created_at <= ${from_date}::TIMESTAMP
                    WHERE
                        ${store_type ? sql`mi.store_type = ${store_type}` : sql`true`}
                    GROUP BY 
                        mi.uuid
                ) opening_material_consumption ON m.uuid = opening_material_consumption.material_uuid
            LEFT JOIN 
                (
                    SELECT 
                        mi.uuid as material_uuid,
                        SUM(COALESCE(s2s.trx_quantity, 0))::float8 as total_s2s_issue_quantity
                    FROM 
                        material.info mi
                    LEFT JOIN 
                        zipper.material_trx_against_order_description s2s ON mi.uuid = s2s.material_uuid AND s2s.created_at <= ${from_date}::TIMESTAMP
                    WHERE 
                        ${store_type ? sql`mi.store_type = ${store_type}` : sql`true`}
                    GROUP BY 
                        mi.uuid
                ) opening_s2s_consumption ON m.uuid = opening_s2s_consumption.material_uuid
            WHERE
                ${store_type ? sql`m.store_type = ${store_type}` : sql`true`}
            ORDER BY ms.index, m.name;
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Party Wise',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
