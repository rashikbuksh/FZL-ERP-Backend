import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function utilityReport(req, res, next) {
	const { month, year } = req.query;

	const monthInt = month ? parseInt(month) : null;
	const yearInt = year ? parseInt(year) : null;

	try {
		const query = sql`
            SELECT 
                u.date::date,
                u.off_day,
                ue.type,
                ue.reading::float8 AS current_reading,
                ROUND((ue.reading::float8 - COALESCE(ue_prev.reading, 0)::float8)::numeric, 2)::float8 AS reading_difference,
                ROUND(((ue.reading::float8 - COALESCE(ue_prev.reading, 0)::float8) * ue.voltage_ratio::float8 * ue.unit_cost::float8)::numeric, 2)::float8 AS reading_cost
            FROM
                maintain.utility u
            LEFT JOIN
                maintain.utility_entry ue ON ue.utility_uuid = u.uuid
            LEFT JOIN
                maintain.utility u_prev ON u.previous_date::date = u_prev.date::date
            LEFT JOIN 
                maintain.utility_entry ue_prev ON u_prev.uuid = ue_prev.utility_uuid AND ue.type = ue_prev.type
            WHERE ue.type IS NOT NULL
                ${month ? sql`AND EXTRACT(MONTH FROM u.date) = ${monthInt}` : sql``}
                ${year ? sql`AND EXTRACT(YEAR FROM u.date) = ${yearInt}` : sql``}
            ORDER BY u.date DESC, ue.type ASC
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// group data using date
		const groupedData = data.rows.reduce((acc, curr) => {
			if (!acc[curr.date]) {
				acc[curr.date] = {
					date: curr.date,
					off_day: curr.off_day,
					entries: [],
				};
			}
			acc[curr.date].entries.push({
				type: curr.type,
				current_reading: curr.current_reading,
				reading_difference: curr.reading_difference,
				reading_cost: curr.reading_cost,
			});
			return acc;
		}, {});

		// convert grouped data to array
		const finalData = Object.values(groupedData);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Utility Report',
		};

		res.status(200).json({ toast, data: finalData });
	} catch (error) {
		await handleError({ error, res });
	}
}
