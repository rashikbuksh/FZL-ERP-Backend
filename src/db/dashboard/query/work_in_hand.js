import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectWorkInHand(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
               SELECT 
                        CASE 
                            WHEN vodf.item_name = 'Nylon' 
                            THEN vodf.item_name || ' ' || vodf.nylon_stopper_name 
                            ELSE vodf.item_name 
                        END as item_name,
                        sum(
                            CASE 
                                WHEN sfg.recipe_uuid IS NULL 
                                THEN oe.quantity::float8  
                                ELSE 0 
                            END
                        ) as Not_Approved,
                        sum(
                            CASE 
                                WHEN sfg.recipe_uuid IS NOT NULL 
                                THEN oe.quantity::float8  
                                ELSE 0 
                            END
                        ) as Approved
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        sfg.recipe_uuid IS NULL 
                        OR sfg.recipe_uuid IS NOT NULL
                    GROUP BY 
                        vodf.item_name, 
                        vodf.nylon_stopper_name

                    UNION
                    SELECT 
                        'Sewing Thread' as item_name,
                        sum(
                            CASE 
                                WHEN toe.recipe_uuid IS NULL 
                                THEN toe.quantity::float8  
                                ELSE 0 
                            END
                        ) as Not_Approved,
                        sum(
                            CASE 
                                WHEN toe.recipe_uuid IS NOT NULL 
                                THEN toe.quantity::float8  
                                ELSE 0 
                            END
                        ) as Approved
                    FROM
                        thread.order_entry toe

                    WHERE 
                        toe.recipe_uuid IS NULL 
                        OR toe.recipe_uuid IS NOT NULL
                    GROUP BY
                        item_name

    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Work in Hand',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
