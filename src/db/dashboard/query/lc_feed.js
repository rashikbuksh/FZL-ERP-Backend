import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectLcFeed(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
     		SELECT
                CONCAT('LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')) AS file_number,
                party.name as party_name,
                marketing.name as marketing_name,
                lc.commercial_executive as commercial,
                CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS lc_value,
             lc.lc_date
            FROM
                commercial.lc
			LEFT JOIN 
				commercial.lc_entry ON lc.uuid = lc_entry.lc_uuid
            LEFT JOIN
                public.party ON lc.party_uuid = party.uuid
            LEFT JOIN 
                commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
            LEFT JOIN 
                public.marketing ON pi_cash.marketing_uuid = marketing.uuid
            LEFT JOIN
                hr.users ON lc.created_by = users.uuid
            LEFT JOIN
                commercial.bank ON pi_cash.bank_uuid = bank.uuid
            WHERE
                lc_entry.handover_date IS NOT NULL AND lc_entry.document_receive_date IS NULL
            GROUP BY
                lc.created_at, lc.id, party.name, marketing.name, lc.lc_value, lc.lc_date, lc.is_old_pi, lc.uuid
            ORDER BY lc.lc_date DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const response = data.rows.map((row) => ({
			file_number: row.file_number,
			party_name: row.party_name,
			marketing_name: row.marketing_name,
			lc_value: row.lc_value,
			lc_date: row.lc_date,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'LC feed',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError(error, res);
	}
}
