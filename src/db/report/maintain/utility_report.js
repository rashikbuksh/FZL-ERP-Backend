import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function utilityReport(req, res, next) {
	try {
		const query = sql`
            SELECT 
                u.date::date,
                u.off_day,
                ue.type,
                ue.reading AS current_reading,
                ue.reading - COALESCE(ue_prev.reading, 0) AS reading_difference,
                (ue.reading - COALESCE(ue_prev.reading, 0)) * ue.voltage_ratio * ue.unit_cost AS reading_cost
            FROM
                maintain.utility_entry ue
            LEFT JOIN
                maintain.utility u ON ue.utility_uuid = u.uuid
            LEFT JOIN
                maintain.utility u_prev ON u.previous_date::date = u_prev.date::date
            LEFT JOIN 
                maintain.utility_entry ue_prev ON u_prev.uuid = ue_prev.utility_uuid AND ue.type = ue_prev.type
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// group data using type where ['fzl_peak_hour','fzl_off_hour'] will be together and ['tsl_peak_hour','tsl_off_hour'] will be together and ['boiler','gas_generator'] will be together
		const groupedData = data.rows.reduce((acc, row) => {
			let groupKey;
			if (row.type === 'fzl_peak_hour' || row.type === 'fzl_off_hour') {
				groupKey = 'fzl';
			} else if (
				row.type === 'tsl_peak_hour' ||
				row.type === 'tsl_off_hour'
			) {
				groupKey = 'tsl';
			} else if (row.type === 'boiler' || row.type === 'gas_generator') {
				groupKey = 'generators';
			}
			if (!acc[groupKey]) {
				acc[groupKey] = {
					date: row.date,
					off_day: row.off_day,
					entries: [],
				};
			}
			acc[groupKey].entries.push({
				type: row.type,
				current_reading: row.current_reading,
				reading_difference: row.reading_difference,
				reading_cost: row.reading_cost,
			});
			return acc;
		}, {});

		// Convert grouped data to an array
		const finalData = Object.keys(groupedData).map((key) => ({
			group: key,
			...groupedData[key],
		}));

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
