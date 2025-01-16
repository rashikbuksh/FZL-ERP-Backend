import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectWorkInHand(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                    SELECT 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END as item_name,
                        sum(
                            CASE 
                                WHEN vodf.order_type != 'slider' AND sfg.recipe_uuid IS NULL 
                                THEN oe.quantity::float8  
                                ELSE 0 
                            END
                        ) as not_approved,
                        sum(
                            CASE 
                                WHEN vodf.order_type = 'slider' 
                                THEN oe.quantity::float8  
                                WHEN sfg.recipe_uuid IS NOT NULL 
                                THEN oe.quantity::float8  
                                ELSE 0 
                            END
                        ) as approved
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
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
                        ) as not_approved,
                        sum(
                            CASE 
                                WHEN toe.recipe_uuid IS NOT NULL 
                                THEN toe.quantity::float8  
                                ELSE 0 
                            END
                        ) as approved
                    FROM
                        thread.order_entry toe
                    GROUP BY
                        item_name

    `;
	const resultPromise = db.execute(query);

	try {
		// group data using item_name
		const data = await resultPromise;

		if (!Array.isArray(data.rows)) {
			throw new TypeError('Expected data to be an array');
		}

		const groupedData = data.rows.reduce((acc, item) => {
			if (!acc[item.item_name]) {
				acc[item.item_name] = {
					not_approved: 0,
					approved: 0,
				};
			}

			acc[item.item_name].not_approved += parseFloat(item.not_approved);
			acc[item.item_name].approved += parseFloat(item.approved);

			return acc;
		}, {});

		const toast = {
			status: 200,
			type: 'select',
			message: 'Work in Hand',
		};

		return res.status(200).json({ toast, data: groupedData });
	} catch (error) {
		handleError({ error, res });
	}
}
