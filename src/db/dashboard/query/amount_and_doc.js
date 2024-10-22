import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectAmountAndDoc(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_doc_rcv_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_doc_rcv,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_acceptance_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_acceptance_due,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_maturity_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_maturity_due,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_payment_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_payment_due
                        FROM (
                            SELECT 
                                lc.*,
                                CASE WHEN is_old_pi = 0 THEN(	
                                    SELECT 
                                        SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
                                    FROM commercial.pi_cash 
                                        LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
                                        LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                                        LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
                                    WHERE pi_cash.lc_uuid = lc.uuid
                                ) ELSE lc.lc_value::float8 END AS total_value
                            FROM
                                commercial.lc
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
                                lc.handover_date IS NOT NULL
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Amount and Doc',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
