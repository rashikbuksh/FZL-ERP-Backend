import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectTeamOrMarketingTargetAchievement(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { type } = req.params;

	let query;

	if (type === 'team') {
		query = sql`
            SELECT
                marketing_team.name,
                marketing_team_entry.marketing_uuid,
                marketing.name,
                marketing_team_entry.is_team_leader,
                coalesce(marketing_team_member_target.zipper_amount,0) as zipper_target,
                coalesce(marketing_team_member_target.thread_amount,0) as thread_target,
                coalesce(marketing_team_member_target.year,0) as year,
                coalesce(achievement.zipper_achievement,0) as zipper_achievement,
                coalesce(achievement.thread_achievement,0) as thread_achievement
            FROM
                public.marketing
            LEFT JOIN
                public.marketing_team_entry ON marketing.uuid = marketing_team_entry.marketing_uuid
            LEFT JOIN
                public.marketing_team ON marketing_team_entry.marketing_team_uuid = marketing_team.uuid
            LEFT JOIN
                public.marketing_team_member_target ON marketing.uuid = marketing_team_member_target.marketing_uuid
            LEFT JOIN (
                SELECT SUM(
                    CASE 
                        WHEN pl.item_for = 'zipper' 
                        THEN 
                            CASE 
                                WHEN vodf.order_type = 'tape'
                                THEN coalesce(oe.size::float8 * oe.company_price,0)::float8
                                ELSE coalesce(ple.quantity * oe.company_price,0)::float8
                            END
                        ELSE 0
                    END
                ) as zipper_achievement, 
                SUM(
                    CASE 
                        WHEN pl.item_for = 'thread'
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
            `;
	} else if (type === 'marketing') {
		query = sql`
            SELECT
                marketing_team.name,
                marketing_team_entry.marketing_uuid,
                marketing.name,
                marketing_team_entry.is_team_leader,
                coalesce(marketing_team_member_target.zipper_amount,0) as zipper_target,
                coalesce(marketing_team_member_target.thread_amount,0) as thread_target,
                coalesce(marketing_team_member_target.year,0) as year,
                coalesce(achievement.zipper_achievement,0) as zipper_achievement,
                coalesce(achievement.thread_achievement,0) as thread_achievement
            FROM
                public.marketing
            LEFT JOIN
                public.marketing_team_entry ON marketing.uuid = marketing_team_entry.marketing_uuid
            LEFT JOIN
                public.marketing_team ON marketing_team_entry.marketing_team_uuid = marketing_team.uuid
            LEFT JOIN
                public.marketing_team_member_target ON marketing.uuid = marketing_team_member_target.marketing_uuid
            LEFT JOIN (
                SELECT SUM(
                    CASE 
                        WHEN pl.item_for = 'zipper' 
                        THEN 
                            CASE 
                                WHEN vodf.order_type = 'tape'
                                THEN coalesce(oe.size::float8 * oe.company_price,0)::float8
                                ELSE coalesce(ple.quantity * oe.company_price,0)::float8
                            END
                        ELSE 0
                    END
                ) as zipper_achievement, 
                SUM(
                    CASE 
                        WHEN pl.item_for = 'thread'
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
            `;
	}

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Stock status',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
