import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectTeamOrMarketingTargetAchievement(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { year, type } = req.params;

	let query;

	if (type === 'team') {
		query = sql`
            SELECT
                marketing_team.name as team_name,
                ARRAY_AGG(marketing.name) as marketing_name,
                SUM(marketing_team_member_target.zipper_amount)::float8 as zipper_target,
                SUM(marketing_team_member_target.thread_amount)::float8 as thread_target,
                coalesce(marketing_team_member_target.year) as year,
                marketing_team_member_target.month,
                ROUND(SUM(achievement.zipper_achievement)::numeric, 3) as zipper_achievement,
                ROUND(SUM(achievement.thread_achievement)::numeric, 3) as thread_achievement
            FROM
                public.marketing
            LEFT JOIN
                public.marketing_team_entry ON marketing.uuid = marketing_team_entry.marketing_uuid
            LEFT JOIN
                public.marketing_team ON marketing_team_entry.marketing_team_uuid = marketing_team.uuid
            LEFT JOIN
                public.marketing_team_member_target ON marketing.uuid = marketing_team_member_target.marketing_uuid
            LEFT JOIN (
                SELECT 
                    SUM(
                        CASE 
                            WHEN item_for IN ('zipper', 'sample_zipper', 'slider') 
                            THEN coalesce(ple.quantity::float8 * oe.company_price::float8/12,0)::float8
                            WHEN item_for IN ('tape')
                            THEN coalesce(oe.size::float8 * oe.company_price::float8,0)::float8
                            ELSE 0
                        END
                    ) as zipper_achievement, 
                    SUM(
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread')
                            THEN coalesce(ple.quantity * toe.company_price,0)::float8
                            ELSE 0
                        END
                    ) as thread_achievement,
                    marketing.uuid as marketing_uuid
                FROM
                    delivery.challan
                LEFT JOIN 
                    delivery.packing_list pl ON challan.uuid = pl.challan_uuid
                LEFT JOIN
                    delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN
                    zipper.sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                LEFT JOIN public.marketing ON vodf.marketing_uuid = marketing.uuid OR toi.marketing_uuid = marketing.uuid
                GROUP BY marketing.uuid
            ) as achievement ON marketing.uuid = achievement.marketing_uuid
            WHERE 
                marketing_team_member_target.year = ${year} AND marketing_team.name IS NOT NULL
            GROUP BY
                marketing_team.name, marketing_team_member_target.year, marketing_team_member_target.month
            `;
	} else if (type === 'marketing') {
		query = sql`
            SELECT
                marketing_team.name,
                marketing_team_entry.marketing_uuid,
                marketing.name,
                marketing_team_entry.is_team_leader,
                SUM(marketing_team_member_target.zipper_amount)::float8 as zipper_target,
                SUM(marketing_team_member_target.thread_amount)::float8 as thread_target,
                coalesce(marketing_team_member_target.year,0) as year,
                marketing_team_member_target.month,
                ROUND(SUM(achievement.zipper_achievement)::numeric, 3) as zipper_achievement,
                ROUND(SUM(achievement.thread_achievement)::numeric, 3) as thread_achievement
            FROM
                public.marketing
            LEFT JOIN
                public.marketing_team_entry ON marketing.uuid = marketing_team_entry.marketing_uuid
            LEFT JOIN
                public.marketing_team ON marketing_team_entry.marketing_team_uuid = marketing_team.uuid
            LEFT JOIN
                public.marketing_team_member_target ON marketing.uuid = marketing_team_member_target.marketing_uuid
            LEFT JOIN (
                SELECT 
                    SUM(
                        CASE 
                            WHEN item_for IN ('zipper', 'sample_zipper', 'slider') 
                            THEN coalesce(ple.quantity::float8 * oe.company_price::float8/12,0)::float8
                            WHEN item_for IN ('tape')
                            THEN coalesce(oe.size::float8 * oe.company_price::float8,0)::float8
                            ELSE 0
                        END
                    ) as zipper_achievement, 
                    SUM(
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread')
                            THEN coalesce(ple.quantity * toe.company_price,0)::float8
                            ELSE 0
                        END
                    ) as thread_achievement,
                    marketing.uuid as marketing_uuid
                FROM
                    delivery.challan
                LEFT JOIN 
                    delivery.packing_list pl ON challan.uuid = pl.challan_uuid
                LEFT JOIN
                    delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN
                    zipper.sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                LEFT JOIN public.marketing ON vodf.marketing_uuid = marketing.uuid OR toi.marketing_uuid = marketing.uuid
                GROUP BY marketing.uuid
            ) as achievement ON marketing.uuid = achievement.marketing_uuid
            WHERE 
                marketing_team_member_target.year = ${year}
            `;
	}

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const formattedData = data.rows.reduce((acc, row) => {
			const monthIndex = acc.findIndex(
				(item) => item.month === row.month
			);
			const teamOrMarketing = {
				name: row.team_name || row.name,
				target_for_zipper: row.zipper_target,
				target_for_thread: row.thread_target,
				achievement_for_zipper: row.zipper_achievement,
				achievement_for_thread: row.thread_achievement,
			};

			if (monthIndex === -1) {
				acc.push({
					month: row.month,
					[type === 'team' ? 'teams' : 'marketing']: [
						teamOrMarketing,
					],
				});
			} else {
				acc[monthIndex][type === 'team' ? 'teams' : 'marketing'].push(
					teamOrMarketing
				);
			}

			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select',
			message: 'Stock status',
		};

		return await res.status(200).json({ toast, data: formattedData });
	} catch (error) {
		await handleError({ error, res });
	}
}
