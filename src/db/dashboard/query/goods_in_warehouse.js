import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectGoodsInWarehouse(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		WITH packing_list_data AS (
            SELECT
                sum(ple.quantity)::float8 as amount,
                pl_count.count as number_of_carton,
                TRIM(BOTH ' ' FROM LOWER(CASE 
                    WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                    WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                    ELSE vodf.item_name
                END)) as item_name
            FROM
                delivery.packing_list pl
                LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN zipper.sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN (
                    SELECT COUNT(*) as count, packing_list.order_info_uuid
                    FROM delivery.packing_list 
					WHERE packing_list.challan_uuid IS NULL AND packing_list.is_warehouse_received = true
                    GROUP BY packing_list.order_info_uuid
                ) AS pl_count ON pl.order_info_uuid = pl_count.order_info_uuid
            WHERE pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
            GROUP BY
                TRIM(BOTH ' ' FROM LOWER(CASE 
                    WHEN vodf.nylon_stopper_name != 'Plastic' THEN vodf.item_name
                    WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                    ELSE vodf.item_name
                END)),
                item_name,
                pl_count.count
            UNION
            SELECT
                sum(ple.quantity)::float8  as amount,
                pl_count.count as number_of_carton,
                'Sewing Thread' as item_name
            FROM
                delivery.packing_list pl
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
            LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
            LEFT JOIN (
                    SELECT COUNT(*) as count, packing_list.order_info_uuid
                    FROM delivery.packing_list 
					WHERE packing_list.challan_uuid IS NULL AND packing_list.is_warehouse_received = true
                    GROUP BY packing_list.order_info_uuid
            ) AS pl_count ON pl.order_info_uuid = pl_count.order_info_uuid
            WHERE pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
            GROUP BY
                item_name, 
                pl_count.count
        )
        SELECT
            SUM(amount) as amount,
            SUM(number_of_carton) as number_of_carton,
            item_name,
            (SELECT SUM(number_of_carton) FROM packing_list_data) as total_number
        FROM packing_list_data
        WHERE item_name IS NOT NULL
        GROUP BY
                item_name;
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const totalNumberOfCarton =
			data.rows.length > 0 ? data.rows[0].total_number : 0;
		const chartData = data.rows.map((row) => {
			const { total_number, ...rest } = row;
			return rest;
		});

		const response = {
			total_number: totalNumberOfCarton,
			chart_data: chartData,
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Goods in Warehouse',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
