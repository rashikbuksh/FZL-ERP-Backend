import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectCashInvoice(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                     SELECT 
                         pi_cash.uuid,
                         CASE 
                            WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
                            ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
                         END AS id,
                         pe.value,
                         pe.order_number,
                         pi_cash.receive_amount::float8
                    FROM
                        commercial.pi_cash pi_cash
                    LEFT JOIN (
                        SELECT
                            pe.pi_cash_uuid,
                           SUM(CASE 
                                WHEN pe.thread_order_entry_uuid IS NULL 
                                THEN 
                                    CASE 
                                        WHEN vodf.order_type = 'tape' 
                                        THEN oe.size::float8 * (oe.party_price::float8)::float8 
                                        ELSE ROUND(pe.pi_cash_quantity * oe.party_price/12, 2)::float8 
                                    END
                                ELSE ROUND(pe.pi_cash_quantity * toe.party_price, 2)::float8 
                            END) as value,
                            array_agg(DISTINCT vodf.order_number) AS order_number
                        
                        FROM
                            commercial.pi_cash_entry pe
                            LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
                            LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                            LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                            LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
                            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                            LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
                        GROUP BY
                            pe.pi_cash_uuid
                    ) AS pe ON pi_cash.uuid = pe.pi_cash_uuid
                    
                    ORDER BY pi_cash.created_at DESC;
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All cash invoices fetched',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
