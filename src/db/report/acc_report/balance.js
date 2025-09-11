import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

import { head } from '../../acc/schema.js';

export async function balanceReport(req, res, next) {
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
                                            COALESCE(SUM(CASE WHEN ve.type = 'cr' THEN ve.amount ELSE 0 END), 0) as total_credit_amount,
                                            COALESCE(SUM(CASE WHEN ve.type = 'dr' THEN ve.amount ELSE 0 END), 0) as total_debit_amount
                                        FROM acc.ledger l
                                        LEFT JOIN acc.voucher_entry ve ON l.uuid = ve.ledger_uuid
                                        WHERE l.group_uuid = g.uuid
                                        GROUP BY l.uuid, l.name
                                    ) ll
                                  ) as leader_list
                              FROM acc.group g
                              WHERE g.head_uuid = h.uuid
                          ) gl
                        ) as groupe_list
                    FROM acc.head h
                    WHERE h.type = head.type  -- Match heads to the outer type
                ) hl
            )`,
		})
		.from(head)
		.where(
			sql`${head.type} IN ('assets', 'liability', 'income', 'expense')`
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
