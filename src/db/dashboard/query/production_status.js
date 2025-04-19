import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectProductionStatus(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { start_date, end_date } = req.query;

	const query = sql`
                SELECT 
                    TRIM(BOTH ' ' FROM LOWER(CASE 
                        WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                        WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                        ELSE vodf.item_name
                    END)) as item_name,
                    COALESCE(sfg_production_sum.finishing_quantity::float8, 0) AS total_quantity
                FROM
                    zipper.v_order_details_full vodf
                LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                LEFT JOIN zipper.sfg ON oe.uuid = sfg.order_entry_uuid
                LEFT JOIN (
                    SELECT 
                        TRIM(BOTH ' ' FROM LOWER(CASE 
                            WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                            WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                            ELSE vodf.item_name
                        END)) as item_name,
                        SUM(CASE 
                            WHEN fb_prod.section = 'finishing' THEN fb_prod.production_quantity::float8 
                            ELSE 0 
                        END) AS finishing_quantity
                    FROM 
                        zipper.finishing_batch_production fb_prod
                    LEFT JOIN
                        zipper.finishing_batch_entry fbe ON fb_prod.finishing_batch_entry_uuid = fbe.uuid
                    LEFT JOIN 
                        zipper.sfg ON fbe.sfg_uuid = sfg.uuid
                    LEFT JOIN 
                        zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN 
                        zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        fb_prod.created_at BETWEEN '2025-04-19'::TIMESTAMP AND '2025-04-19'::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
                    GROUP BY 
                        TRIM(BOTH ' ' FROM LOWER(CASE 
                            WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                            WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                            ELSE vodf.item_name
                        END))
                    ) sfg_production_sum ON sfg_production_sum.item_name = TRIM(BOTH ' ' FROM LOWER(CASE 
                            WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                            WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                            ELSE vodf.item_name
                        END))
                WHERE vodf.order_description_uuid IS NOT NULL
                    AND vodf.is_cancelled = FALSE
                GROUP BY 
                    TRIM(BOTH ' ' FROM LOWER(CASE 
                        WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                        WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                        ELSE vodf.item_name
                    END)),
                    sfg_production_sum.finishing_quantity

                UNION    

                SELECT
                        'Sewing Thread' as item_name,
                        SUM(prod_quantity.total_quantity) as total_quantity
                FROM 
                    thread.order_info
                LEFT JOIN (
                    SELECT
                        SUM(batch_entry_production.production_quantity) as total_quantity,
                        order_entry.order_info_uuid
                    FROM
                        thread.batch_entry_production
                    LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                    LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                    WHERE ${start_date ? sql`batch_entry_production.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                    GROUP BY
                        order_entry.order_info_uuid
                ) prod_quantity ON order_info.uuid = prod_quantity.order_info_uuid
                GROUP BY item_name;
    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Production Status',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
