import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectItemMarketingOrderQuantity(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from_date, to_date } = req.query;

	try {
		const query = sql`
                    SELECT 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
                            THEN vodf.item_name || ' ' || 'Plastic' || ' - ' || vodf.zipper_number_name
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) = 'invisible')
                            THEN vodf.item_name || ' ' || 'Invisible' || ' - ' || vodf.zipper_number_name
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
                            THEN vodf.item_name || ' - ' || vodf.zipper_number_name
                            ELSE vodf.item_name || ' - ' || vodf.zipper_number_name
                        END as item_name,
                        vodf.item_name as type,
                        vodf.marketing_name,
                        SUM(oe.quantity::float8)::float8 as marketing_quantity
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        vodf.is_cancelled = FALSE
                        ${from_date && to_date ? sql`AND vodf.order_description_created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql``}
                    GROUP BY 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
                            THEN vodf.item_name || ' ' || 'Plastic' || ' - ' || vodf.zipper_number_name
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) = 'invisible')
                            THEN vodf.item_name || ' ' || 'Invisible' || ' - ' || vodf.zipper_number_name
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
                            THEN vodf.item_name || ' - ' || vodf.zipper_number_name
                            ELSE vodf.item_name || ' - ' || vodf.zipper_number_name
                        END,
                        vodf.item_name,
                        vodf.marketing_name
                    UNION 
                    SELECT 
                        CONCAT('ST', ' - ', count_length.count, ' - ', count_length.length) as item_name,
                        'Thread' as type,
                        public.marketing.name as marketing_name,
                        SUM(oe.quantity::float8)::float8 as marketing_quantity
                    FROM
                        thread.order_entry oe
                        LEFT JOIN thread.count_length ON oe.count_length_uuid = count_length.uuid
                        LEFT JOIN thread.order_info oi ON oe.order_info_uuid = oi.uuid
                        LEFT JOIN public.marketing ON oi.marketing_uuid = public.marketing.uuid
                    WHERE 
                        oi.is_cancelled = FALSE
                        ${from_date && to_date ? sql`AND oi.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql``}
                    GROUP BY 
                        count_length.count, count_length.length, public.marketing.name, type
                    ORDER BY 
                        item_name;
    `;
		const resultPromise = db.execute(query);

		// group data using item_name
		const data = await resultPromise;

		// group data by item_name and calculate total_quantity from marketing_quantity, but do not change marketing_quantity

		//         "data": [
		//     {
		//       "item_name": "Metal",
		//       "total_quantity": 54800 + 548036,
		//       "marketing" : [
		//         {
		//             "marketing_name": "Abu Saeed",
		//             "marketing_quantity": 548036
		//         }
		// {
		//             "marketing_name": "Abu Saeed 2",
		//             "marketing_quantity": 54800
		//         }
		//       ]
		//     },
		// ]
		const groupedData = data.rows.reduce((acc, item) => {
			if (!acc[item.item_name]) {
				acc[item.item_name] = {
					item_name: item.item_name,
					type: item.type,
					marketing: [],
				};
			}
			acc[item.item_name].marketing.push({
				marketing_name: item.marketing_name,
				marketing_quantity: item.marketing_quantity,
			});
			return acc;
		}, {});

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item order quantity retrieved successfully',
		};

		return res
			.status(200)
			.json({ toast, data: Object.values(groupedData) });
	} catch (error) {
		handleError({ error, res });
	}
}
