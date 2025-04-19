import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectPiToBeSubmittedDashboard(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
    WITH pi_data AS (
            SELECT 
                party.uuid,
                party.name,
                vodf_grouped.total_quantity::float8,
                vodf_grouped.total_pi::float8,
                vodf_grouped.total_balance_pi_quantity::float8,
                vodf_grouped.total_balance_pi_value::float8,
                vodf_grouped.total_delivered::float8,
                vodf_grouped.total_undelivered_balance_quantity::float8
            FROM
                public.party party
            LEFT JOIN (
                SELECT 
                    SUM(order_entry.quantity) AS total_quantity,
                    SUM(order_entry.quantity - sfg.pi) AS total_balance_pi_quantity,
                    SUM((order_entry.quantity - sfg.pi) * order_entry.party_price) AS total_balance_pi_value,
                    SUM(sfg.pi) AS total_pi,
                    SUM(sfg.delivered) AS total_delivered,
                    SUM(order_entry.quantity - sfg.delivered) AS total_undelivered_balance_quantity,
                    vodf.party_uuid,
                    vodf.party_name
                FROM
                    zipper.sfg
                LEFT JOIN
                    zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                LEFT JOIN 
                    zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    vodf.party_uuid, vodf.party_name
            ) vodf_grouped ON party.uuid = vodf_grouped.party_uuid
            WHERE 
                vodf_grouped.total_quantity > 0 OR vodf_grouped.total_delivered > 0 OR vodf_grouped.total_balance_pi_quantity > 0 OR vodf_grouped.total_undelivered_balance_quantity > 0
        )
        SELECT 
            pi_data.*,
            (SELECT COUNT(*) FROM pi_data) AS total_number,
            (SELECT SUM(total_balance_pi_value) FROM pi_data) AS total_amount
        FROM
            pi_data
    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const totalNumberOfPi =
			data.rows.length > 0 ? data.rows[0].total_number : 0;
		const totalAmount =
			data.rows.length > 0 ? data.rows[0].total_amount : 0;
		const chartData = data.rows.map((row) => {
			const { total_number, ...rest } = row;
			return rest;
		});

		const response = {
			total_number: totalNumberOfPi,
			total_amount: totalAmount,
			chart_data: chartData,
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Pi To Be Submitted',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
