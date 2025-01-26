import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectItemZipperEndApprovedQuantity(req, res, next) {
	if (!(await validateRequest(req, next))) return;

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
                        vodf.zipper_number_name,
                        vodf.end_type_name,
                        sum(
                            CASE 
                                WHEN sfg.recipe_uuid IS NULL 
                                THEN oe.quantity::float8  
                                ELSE 0 
                            END
                        ) as not_approved,
                        sum(
                            CASE 
                                WHEN vodf.order_type = 'slider' 
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                WHEN sfg.recipe_uuid IS NOT NULL 
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                ELSE 0 
                            END
                        ) as approved
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        vodf.order_type != 'slider'
                    GROUP BY 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END,
                        vodf.zipper_number_name,
                        vodf.end_type_name
                    ORDER BY 
                        item_name, zipper_number_name, end_type_name;

    `;
	const resultPromise = db.execute(query);

	try {
		// group data using item_name
		const data = await resultPromise;

		if (!Array.isArray(data.rows)) {
			throw new TypeError('Expected data to be an array');
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item zipper number end wise approved quantity',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
