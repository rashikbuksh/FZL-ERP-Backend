import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';

export async function selectGoodsInWarehouse(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		    WITH challan_data AS (
        SELECT
            sum(sfg.warehouse)::float8 as amount,
            count(*)::float8 as number_of_carton,
            CASE 
                WHEN vodf.nylon_stopper_name = 'Metallic' THEN vodf.item_name || ' Metallic'
                WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                ELSE vodf.item_name
            END as item_name
        FROM
            delivery.packing_list pl
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN zipper.v_order_details_full vodf ON pl.order_info_uuid = vodf.order_info_uuid
            LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
        WHERE pl.challan_uuid IS NULL
        GROUP BY
            item_name, vodf.nylon_stopper_name, vodf.item_name
        UNION
        SELECT
            sum(toe.warehouse)::float8  as amount,
            sum(toe.carton_quantity)::float8 as number_of_carton,
            'Sewing Thread' as item_name
        FROM
            thread.order_entry toe
            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
    )
    SELECT
        *,
        (SELECT SUM(number_of_carton) FROM challan_data)::float8 as total_number
    FROM challan_data;
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
