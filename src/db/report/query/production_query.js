import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function selectItemWiseProduction(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	const query = sql`
        SELECT 
            CASE 
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                THEN vodf.item_name || ' ' || 'Plastic'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                THEN vodf.item_name || ' ' || 'Invisible'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                THEN vodf.item_name
                ELSE vodf.item_name 
            END as item_name,
            SUM(packing_list_sum.total_packing_list_quantity) as total_production
        FROM
            zipper.v_order_details_full vodf
        LEFT JOIN (
                SELECT 
                    od.uuid as order_description_uuid,
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
                    pl.item_for NOT IN ('thread', 'sample_thread') AND ${from && to ? sql`pl.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                GROUP BY
                    od.uuid
        ) packing_list_sum ON vodf.order_description_uuid = packing_list_sum.order_description_uuid
        GROUP BY 
            CASE 
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                THEN vodf.item_name || ' ' || 'Plastic'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                THEN vodf.item_name || ' ' || 'Invisible'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                THEN vodf.item_name
                ELSE vodf.item_name 
            END as item_name
        UNION 
        
        `;

	try {
		const data = await db.execute(query);
		return res.status(200).json({ data });
	} catch (error) {
		handleError({ error, res });
	}
}
