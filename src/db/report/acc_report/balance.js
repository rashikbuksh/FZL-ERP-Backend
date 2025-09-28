import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

import { head } from '../../acc/schema.js';

export async function balanceReport(req, res, next) {
	const { from_date, to_date } = req.query;

	const fromDate = from_date
		? new Date(from_date).toISOString().split('T')[0]
		: new Date().toISOString().split('T')[0];
	const toDate = to_date
		? new Date(to_date).toISOString().split('T')[0]
		: new Date().toISOString().split('T')[0];

	const year = new Date(toDate).getFullYear();
	const fromYear = new Date(fromDate).getFullYear();
	const ytdStart = `${fromYear}-01-01`;
	//const today = new Date().toISOString().split('T')[0];
	const ytdEnd = toDate;
	const prevYear = year - 1;
	const prevStart = `${prevYear}-01-01`;
	const prevEnd = `${prevYear}-12-31`;

	// console.log({ fromDate, toDate, ytdStart, ytdEnd, prevStart, prevEnd });

	const headPromise = db
		.select({
			type: head.type,
			headList: sql`(SELECT json_agg(row_to_json(hl))
                FROM (
                    SELECT
                        h.uuid,
                        h.name as head_name,
                        (SELECT json_agg(row_to_json(gl))
                          FROM (
                              SELECT
                                  g.uuid,
                                  g.name as group_name,
                                  (SELECT json_agg(row_to_json(ll))
                                    FROM (
                                        SELECT
                                            l.uuid,
                                            l.name as leader_name,

                                           -- current period sums (filter by voucher entry created_at)
                                            COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${fromDate}::date AND ${toDate}::date AND ve.type = 'cr' THEN ve.amount ELSE 0 END), 0) as total_credit_current_amount,
                                            COALESCE(
                                              COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${fromDate}::date AND ${toDate}::date AND ve.type = 'dr' THEN ve.amount ELSE 0 END), 0)
                                              + COALESCE(MAX(CASE WHEN l.created_at::date BETWEEN ${fromDate}::date AND ${toDate}::date THEN l.initial_amount ELSE 0 END), 0),
                                            0) as total_debit_current_amount,

                                            -- net for current period (debit - credit)
                                            (
                                              COALESCE(
                                                COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${fromDate}::date AND ${toDate}::date AND ve.type = 'dr' THEN ve.amount ELSE 0 END), 0)
                                                + COALESCE(MAX(CASE WHEN l.created_at::date BETWEEN ${fromDate}::date AND ${toDate}::date THEN l.initial_amount ELSE 0 END), 0),
                                              0)
                                              -
                                              COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${fromDate}::date AND ${toDate}::date AND ve.type = 'cr' THEN ve.amount ELSE 0 END), 0)
                                            ) as total_net_current_amount,

                                            -- year to date (from Jan 1 of from_date's year up to toDate)
                                            COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${ytdStart} AND ${ytdEnd} AND ve.type = 'cr' THEN ve.amount ELSE 0 END), 0) as total_credit_ytd_amount,
                                            COALESCE(
                                              COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${ytdStart} AND ${ytdEnd} AND ve.type = 'dr' THEN ve.amount ELSE 0 END), 0)
                                              + COALESCE(MAX(CASE WHEN l.created_at::date BETWEEN ${ytdStart} AND ${ytdEnd} THEN l.initial_amount ELSE 0 END), 0),
                                            0) as total_debit_ytd_amount,

                                            -- net year to date (debit - credit)
                                            (
                                              COALESCE(
                                                COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${ytdStart} AND ${ytdEnd} AND ve.type = 'dr' THEN ve.amount ELSE 0 END), 0)
                                                + COALESCE(MAX(CASE WHEN l.created_at::date BETWEEN ${ytdStart} AND ${ytdEnd} THEN l.initial_amount ELSE 0 END), 0),
                                              0)
                                              -
                                              COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${ytdStart} AND ${ytdEnd} AND ve.type = 'cr' THEN ve.amount ELSE 0 END), 0)
                                            ) as total_net_ytd_amount,

                                            -- last year (full previous year)
                                            COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${prevStart} AND ${prevEnd} AND ve.type = 'cr' THEN ve.amount ELSE 0 END), 0) as total_credit_last_year_amount,
                                            COALESCE(
                                              COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${prevStart} AND ${prevEnd} AND ve.type = 'dr' THEN ve.amount ELSE 0 END), 0)
                                              + COALESCE(MAX(CASE WHEN l.created_at::date BETWEEN ${prevStart} AND ${prevEnd} THEN l.initial_amount ELSE 0 END), 0),
                                            0) as total_debit_last_year_amount,

                                            -- net last year (debit - credit)
                                            (
                                              COALESCE(
                                                COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${prevStart} AND ${prevEnd} AND ve.type = 'dr' THEN ve.amount ELSE 0 END), 0)
                                                + COALESCE(MAX(CASE WHEN l.created_at::date BETWEEN ${prevStart} AND ${prevEnd} THEN l.initial_amount ELSE 0 END), 0),
                                              0)
                                              -
                                              COALESCE(SUM(CASE WHEN ve.created_at::date BETWEEN ${prevStart} AND ${prevEnd} AND ve.type = 'cr' THEN ve.amount ELSE 0 END), 0)
                                            ) as total_net_last_year_amount

                                        FROM acc.ledger l
                                        LEFT JOIN acc.voucher_entry ve ON l.uuid = ve.ledger_uuid
                                        WHERE l.group_uuid = g.uuid
                                        GROUP BY l.uuid, l.name
                                    ) ll
                                  ) as leader_list
                              FROM acc.group g
                              WHERE g.head_uuid = h.uuid
                                AND EXISTS (
                                  SELECT 1 FROM acc.ledger l_chk WHERE l_chk.group_uuid = g.uuid
                                )
                          ) gl
                        ) as groupe_list
                    FROM acc.head h
                    WHERE h.type = head.type
                      AND EXISTS (
                        SELECT 1
                        FROM acc.group g_chk
                        JOIN acc.ledger l_chk2 ON l_chk2.group_uuid = g_chk.uuid
                        WHERE g_chk.head_uuid = h.uuid
                      )
                ) hl
            )`,
		})
		.from(head)
		.where(
			sql`${head.type} IN ('assets', 'liability', 'income', 'expense')
                 AND EXISTS (
                   SELECT 1
                   FROM acc.head h2
                   JOIN acc.group g2 ON g2.head_uuid = h2.uuid
                   JOIN acc.ledger l2 ON l2.group_uuid = g2.uuid
                   WHERE h2.type = ${head.type}
                 )`
		) // Filter by relevant types
		.groupBy(head.type);

	try {
		const data = await headPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Balance Report',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

// const headPromise = db
// 	.select({
// 		type: head.type,
// 		headList: sql`(SELECT json_agg(row_to_json(hl))
//                 FROM (
//                     SELECT
//                         h.uuid,
//                         h.name as head_name,
//                         (SELECT json_agg(row_to_json(gl))
//                           FROM (
//                               SELECT
//                                   g.uuid,
//                                   g.name as group_name,
//                                   (SELECT json_agg(row_to_json(ll))
//                                     FROM (
//                                         SELECT
//                                             l.uuid,
//                                             l.name as leader_name,
//                                             COALESCE(SUM(CASE WHEN ve.type = 'cr' THEN ve.amount ELSE 0 END), 0) as total_credit_amount,
//                                             COALESCE(SUM(CASE WHEN ve.type = 'dr' THEN ve.amount ELSE 0 END), 0) as total_debit_amount
//                                         FROM acc.ledger l
//                                         LEFT JOIN acc.voucher_entry ve ON l.uuid = ve.ledger_uuid
//                                         WHERE l.group_uuid = g.uuid
//                                         GROUP BY l.uuid, l.name
//                                     ) ll
//                                   ) as leader_list
//                               FROM acc.group g
//                               WHERE g.head_uuid = h.uuid
//                           ) gl
//                         ) as groupe_list
//                     FROM acc.head h
//                     WHERE h.type = head.type  -- Match heads to the outer type
//                 ) hl
//             )`,
// 	})
// 	.from(head)
// 	.where(sql`${head.type} IN ('assets', 'liability', 'income', 'expense')`) // Filter by relevant types
// 	.groupBy(head.type);
