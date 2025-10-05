import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';

import db from '../../index.js';

export async function maintenanceDashboard(req, res, next) {
	const query = sql`SELECT 
                            -- submitted (filter on created_at)
                            SUM(CASE WHEN created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_today,
                            SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE THEN 1 ELSE 0 END) AS submitted_yesterday,
                            SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '6 day' AND created_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_last_seven_day,
                            SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '1 month' AND created_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_last_one_month,
                            SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '1 year' AND created_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_last_one_year,

                            -- resolved (verification_approved = true, use verification_date)
                            SUM(CASE WHEN verification_approved = TRUE AND verification_date >= CURRENT_DATE AND verification_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_today,
                            SUM(CASE WHEN verification_approved = TRUE AND verification_date >= CURRENT_DATE - INTERVAL '1 day' AND verification_date < CURRENT_DATE THEN 1 ELSE 0 END) AS resolved_yesterday,
                            SUM(CASE WHEN verification_approved = TRUE AND verification_date >= CURRENT_DATE - INTERVAL '6 day' AND verification_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_last_seven_day,
                            SUM(CASE WHEN verification_approved = TRUE AND verification_date >= CURRENT_DATE - INTERVAL '1 month' AND verification_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_last_one_month,
                            SUM(CASE WHEN verification_approved = TRUE AND verification_date >= CURRENT_DATE - INTERVAL '1 year' AND verification_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_last_one_year,

                            -- awaiting_response (maintain_condition = 'waiting', use maintain_date)
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date >= CURRENT_DATE AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_today,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date < CURRENT_DATE THEN 1 ELSE 0 END) AS awaiting_yesterday,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_last_seven_day,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_last_one_month,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_last_one_year,

                            -- ongoing (maintain_condition = 'ongoing', use maintain_date)
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date >= CURRENT_DATE AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_today,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date < CURRENT_DATE THEN 1 ELSE 0 END) AS ongoing_yesterday,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_last_seven_day,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_last_one_month,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_last_one_year

                        FROM maintain.issue;`;

	const maintenanceDashboardPromise = db.execute(query);

	try {
		const data = await maintenanceDashboardPromise;

		// console.log(data.rows);

		// console.log(data.rows[0]);

		//const row = data && data[0] && data[0][0] ? data[0][0] : {};

		const result = {
			submitted: {
				today: Number(data.rows[0].submitted_today || 0),
				yesterday: Number(data.rows[0].submitted_yesterday || 0),
				last_seven_day: Number(
					data.rows[0].submitted_last_seven_day || 0
				),
				last_one_month: Number(
					data.rows[0].submitted_last_one_month || 0
				),
				last_one_year: Number(
					data.rows[0].submitted_last_one_year || 0
				),
			},
			resolved: {
				today: Number(data.rows[0].resolved_today || 0),
				yesterday: Number(data.rows[0].resolved_yesterday || 0),
				last_seven_day: Number(
					data.rows[0].resolved_last_seven_day || 0
				),
				last_one_month: Number(
					data.rows[0].resolved_last_one_month || 0
				),
				last_one_year: Number(data.rows[0].resolved_last_one_year || 0),
			},
			awaiting_response: {
				today: Number(data.rows[0].awaiting_today || 0),
				yesterday: Number(data.rows[0].awaiting_yesterday || 0),
				last_seven_day: Number(
					data.rows[0].awaiting_last_seven_day || 0
				),
				last_one_month: Number(
					data.rows[0].awaiting_last_one_month || 0
				),
				last_one_year: Number(data.rows[0].awaiting_last_one_year || 0),
			},
			ongoing: {
				today: Number(data.rows[0].ongoing_today || 0),
				yesterday: Number(data.rows[0].ongoing_yesterday || 0),
				last_seven_day: Number(
					data.rows[0].ongoing_last_seven_day || 0
				),
				last_one_month: Number(
					data.rows[0].ongoing_last_one_month || 0
				),
				last_one_year: Number(data.rows[0].ongoing_last_one_year || 0),
			},
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'maintenance dashboard data retrieved',
		};
		return await res.status(200).json({ toast, data: result });
	} catch (error) {
		await handleError({ error, res });
	}
}
