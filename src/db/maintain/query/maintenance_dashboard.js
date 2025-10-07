import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';

import db from '../../index.js';

export async function maintenanceDashboard(req, res, next) {
	const query = sql`SELECT 
                            -- submitted (filter on created_at)
                            SUM(CASE WHEN created_at::date >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_today,
                            SUM(CASE WHEN created_at::date >= CURRENT_DATE - INTERVAL '1 day' AND created_at::date < CURRENT_DATE THEN 1 ELSE 0 END) AS submitted_yesterday,
                            SUM(CASE WHEN created_at::date >= CURRENT_DATE - INTERVAL '6 day' AND created_at::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_last_seven_day,
                            SUM(CASE WHEN created_at::date >= CURRENT_DATE - INTERVAL '1 month' AND created_at::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_last_one_month,
                            SUM(CASE WHEN created_at::date >= CURRENT_DATE - INTERVAL '1 year' AND created_at::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS submitted_last_one_year,

							 -- unresolved: not verified yet (verification_approved IS NOT TRUE)
                            SUM(CASE WHEN maintain_condition != 'okay' AND created_at::date < CURRENT_DATE - INTERVAL '7 day' THEN 1 ELSE 0 END) AS unresolved_over_one_week,
                            SUM(CASE WHEN maintain_condition != 'okay' AND created_at::date < CURRENT_DATE - INTERVAL '1 month' THEN 1 ELSE 0 END) AS unresolved_over_one_month,

                            -- resolved (maintain_condition = 'okay', use maintain_date)
                            SUM(CASE WHEN maintain_condition = 'okay' AND maintain_date::date >= CURRENT_DATE AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_today,
                            SUM(CASE WHEN maintain_condition = 'okay' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date::date < CURRENT_DATE THEN 1 ELSE 0 END) AS resolved_yesterday,
							SUM(CASE WHEN maintain_condition = 'okay' AND maintain_date::date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_last_seven_day,
							SUM(CASE WHEN maintain_condition = 'okay' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_last_one_month,
							SUM(CASE WHEN maintain_condition = 'okay' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS resolved_last_one_year,

                            -- awaiting_response (maintain_condition = 'waiting', use maintain_date)
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date::date >= CURRENT_DATE AND maintain_date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_today,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date::date < CURRENT_DATE THEN 1 ELSE 0 END) AS awaiting_yesterday,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date::date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_last_seven_day,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_last_one_month,
                            SUM(CASE WHEN maintain_condition = 'waiting' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS awaiting_last_one_year,

                            -- ongoing (maintain_condition = 'ongoing', use maintain_date::date)
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date::date >= CURRENT_DATE AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_today,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date::date < CURRENT_DATE THEN 1 ELSE 0 END) AS ongoing_yesterday,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date::date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_last_seven_day,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_last_one_month,
                            SUM(CASE WHEN maintain_condition = 'ongoing' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS ongoing_last_one_year,

							--rejected (maintain_condition = 'rejected', use maintain_date)
							SUM(CASE WHEN maintain_condition = 'rejected' AND maintain_date::date >= CURRENT_DATE AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS rejected_today,
							SUM(CASE WHEN maintain_condition = 'rejected' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date::date < CURRENT_DATE THEN 1 ELSE 0 END) AS rejected_yesterday,
							SUM(CASE WHEN maintain_condition = 'rejected' AND maintain_date::date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS rejected_last_seven_day,
							SUM(CASE WHEN maintain_condition = 'rejected' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS rejected_last_one_month,
							SUM(CASE WHEN maintain_condition = 'rejected' AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day' THEN 1 ELSE 0 END) AS rejected_last_one_year,

							-- avg resolution time (maintain_date - created_at) in seconds for ranges
                            AVG(EXTRACT(EPOCH FROM (maintain_date - created_at))) FILTER (
                                WHERE maintain_condition = 'okay'
                                AND maintain_date::date >= CURRENT_DATE AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day'
                            ) AS avg_resolution_today_seconds,
							AVG(EXTRACT(EPOCH FROM (maintain_date - created_at))) FILTER (
								WHERE maintain_condition = 'okay'	
								AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 day' AND maintain_date::date < CURRENT_DATE
							) AS avg_resolution_yesterday_seconds,
							AVG(EXTRACT(EPOCH FROM (maintain_date - created_at))) FILTER (
								WHERE maintain_condition = 'okay'
								AND maintain_date::date >= CURRENT_DATE - INTERVAL '6 day' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day'
							) AS avg_resolution_last_seven_day_seconds,
							AVG(EXTRACT(EPOCH FROM (maintain_date - created_at))) FILTER (
								WHERE maintain_condition = 'okay'
								AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 month' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day'
							) AS avg_resolution_last_one_month_seconds,
							AVG(EXTRACT(EPOCH FROM (maintain_date - created_at))) FILTER (
								WHERE maintain_condition = 'okay'
								AND maintain_date::date >= CURRENT_DATE - INTERVAL '1 year' AND maintain_date::date < CURRENT_DATE + INTERVAL '1 day'
							) AS avg_resolution_last_one_year_seconds
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
			avg_resolution_time_seconds: {
				today: Number(data.rows[0].avg_resolution_today_seconds || 0),
				yesterday: Number(
					data.rows[0].avg_resolution_yesterday_seconds || 0
				),
				last_seven_day: Number(
					data.rows[0].avg_resolution_last_seven_day_seconds || 0
				),
				last_one_month: Number(
					data.rows[0].avg_resolution_last_one_month_seconds || 0
				),
				last_one_year: Number(
					data.rows[0].avg_resolution_last_one_year_seconds || 0
				),
			},
			unresolved: {
				over_one_week: Number(
					data.rows[0].unresolved_over_one_week || 0
				),
				over_one_month: Number(
					data.rows[0].unresolved_over_one_month || 0
				),
			},
			rejected: {
				today: Number(data.rows[0].rejected_today || 0),
				yesterday: Number(data.rows[0].rejected_yesterday || 0),
				last_seven_day: Number(
					data.rows[0].rejected_last_seven_day || 0
				),
				last_one_month: Number(
					data.rows[0].rejected_last_one_month || 0
				),
				last_one_year: Number(data.rows[0].rejected_last_one_year || 0),
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
