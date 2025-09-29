import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

import { head } from '../../acc/schema.js';

export async function chartOfAccountsReport(req, res, next) {
	// const { from_date, to_date, type } = req.query;

	// const fromDate = from_date
	// 	? new Date(from_date).toISOString().split('T')[0]
	// 	: new Date().toISOString().split('T')[0];
	// const toDate = to_date
	// 	? new Date(to_date).toISOString().split('T')[0]
	// 	: new Date().toISOString().split('T')[0];

	// const year = new Date(toDate).getFullYear();
	// const fromYear = new Date(fromDate).getFullYear();
	// const ytdStart = `${fromYear}-01-01`;
	// //const today = new Date().toISOString().split('T')[0];
	// const ytdEnd = toDate;
	// const prevYear = year - 1;
	// const prevStart = `${prevYear}-01-01`;
	// const prevEnd = `${prevYear}-12-31`;

	// console.log({ fromDate, toDate, ytdStart, ytdEnd, prevStart, prevEnd });

	const headPromise = db
		.select({
			type: head.type,
			children: sql`(
            SELECT COALESCE(json_agg(head_obj), '[]'::json)
            FROM (
                SELECT
                    json_build_object(
                        'name', (COALESCE(h.group_number::text, '') || ' ' || h.name),
                        'account_type', h.type,
                        'children',
                            COALESCE(
                                (
                                    SELECT json_agg(group_obj)
                                    FROM (
                                        SELECT
                                            json_build_object(
                                                'name', (COALESCE(g.group_number::text, '') || ' ' || g.name),
                                                'children',
                                                    COALESCE(
                                                        (
                                                            SELECT json_agg(ledger_obj)
                                                            FROM (
                                                                SELECT
                                                                    json_build_object(
                                                                        'name', (COALESCE(l.group_number::text, '') || ' ' || l.name),
                                                                        'account_tag', 'Ledger',
                                                                        'children', json_build_array(json_build_object('name', (COALESCE(l.group_number::text, '') || ' ' || l.name)))
                                                                    ) AS ledger_obj
                                                                FROM acc.ledger l
                                                                WHERE l.group_uuid = g.uuid
                                                                GROUP BY l.uuid, l.name, l.group_number
                                                            ) ledger_obj
                                                        ),
                                                        '[]'::json
                                                    )
                                            ) AS group_obj
                                        FROM acc.group g
                                        WHERE g.head_uuid = h.uuid
                                    ) group_obj
                                ),
                                '[]'::json
                            )
                    ) AS head_obj
                FROM acc.head h
                WHERE h.type = head.type
            ) head_obj
        )`,
		})
		.from(head)
		.where(
			sql`${head.type} IN ('assets', 'liability', 'income', 'expense')`
		)
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
