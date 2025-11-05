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
                ue.reading::float8 AS current_reading,
                ue.reading::float8 - COALESCE(ue_prev.reading, 0)::float8 AS reading_difference,
                (ue.reading::float8 - COALESCE(ue_prev.reading, 0)::float8) * ue.voltage_ratio::float8 * ue.unit_cost::float8 AS reading_cost
            FROM
                maintain.utility u
            LEFT JOIN
                maintain.utility_entry ue ON ue.utility_uuid = u.uuid
            LEFT JOIN
                maintain.utility u_prev ON u.previous_date::date = u_prev.date::date
            LEFT JOIN 
                maintain.utility_entry ue_prev ON u_prev.uuid = ue_prev.utility_uuid AND ue.type = ue_prev.type
            WHERE ue.type IS NOT NULL
            ORDER BY u.date, ue.type
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

			// Create unique key for date + group combination
			const dateGroupKey = `${row.date}_${groupKey}`;

			if (!acc[dateGroupKey]) {
				acc[dateGroupKey] = {
					date: row.date,
					off_day: row.off_day,
					entries: [],
				};
			}

			// Check if entry with this type already exists for this date
			const existingEntry = acc[dateGroupKey].entries.find(
				(entry) => entry.type === row.type
			);

			if (!existingEntry) {
				acc[dateGroupKey].entries.push({
					type: row.type,
					current_reading: row.current_reading,
					reading_difference: row.reading_difference,
					reading_cost: row.reading_cost,
				});
			}

			return acc;
		}, {});

		// Convert grouped data to an array and group by actual group key
		const finalGroupedData = {};
		Object.keys(groupedData).forEach((dateGroupKey) => {
			const data = groupedData[dateGroupKey];
			const groupKey = dateGroupKey.split('_').slice(1).join('_'); // Extract group from dateGroupKey

			if (!finalGroupedData[groupKey]) {
				finalGroupedData[groupKey] = [];
			}

			finalGroupedData[groupKey].push({
				date: data.date,
				off_day: data.off_day,
				entries: data.entries,
			});
		});

		// Convert to final array format
		const finalData = Object.keys(finalGroupedData).map((key) => ({
			group: key,
			dates: finalGroupedData[key],
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
