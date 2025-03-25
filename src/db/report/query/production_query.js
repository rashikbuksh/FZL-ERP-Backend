import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function selectItemWiseProduction(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	const query = sql`
        SELECT 
            vodf.item_name,
            vodf.nylon_stopper_name,
            SUM(packing_list_sum.total_packing_list_quantity) as total_production
        FROM
            zipper.v_order_details_full vodf
        LEFT JOIN (
                SELECT 
                    od.item,
                    od.nylon_stopper,
                    SUM(ple.quantity) as total_packing_list_quantity
                FROM 
                    delivery.packing_list_entry ple
                LEFT JOIN 
                    delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                LEFT JOIN
                    zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                WHERE
                    ${from && to ? sql`pl.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                GROUP BY
                    od.item,
                    od.nylon_stopper
        ) packing_list_sum ON vodf.item = packing_list_sum.item AND vodf.nylon_stopper = packing_list_sum.nylon_stopper
        GROUP BY 
            vodf.item_name,
            vodf.nylon_stopper_name
        `;

	try {
		const data = await db.execute(query);
		return res.status(200).json({ data });
	} catch (error) {
		handleError({ error, res });
	}
}
