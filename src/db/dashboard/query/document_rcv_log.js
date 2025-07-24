import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectDocumentRcvLog(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { start_date, end_date } = req.query;

	const query = sql`
        SELECT 
                count(*) as total_count,
                CONCAT('LC', to_char(lc.created_at, 'YY'), '-', lc.id::text) AS file_number,
                party.name as party_name,
                marketing.name as marketing_name,
                CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(
						coalesce(pi_cash_entry.pi_cash_quantity,0)  
						* CASE 
							WHEN vodf.order_type = 'tape' 
							THEN coalesce(order_entry.party_price,0) 
							ELSE coalesce(order_entry.party_price,0)/12 
						END
					)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
					LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
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
                lc_entry.handover_date IS NOT NULL AND lc_entry.document_receive_date IS NULL AND  ${start_date ? sql`lc.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
            GROUP BY
                lc.created_at, lc.id, party.name, marketing.name, lc.lc_value, lc.lc_date, lc.is_old_pi, lc.uuid
            ORDER BY lc.lc_date DESC LIMIT 10
            
        `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const total_count = data.rows.length;
		const chart_data = data.rows.map((row) => ({
			file_number: row.file_number,
			party_name: row.party_name,
			marketing_name: row.marketing_name,
			lc_value: row.lc_value,
			lc_date: row.lc_date,
		}));
		const response = {
			total_number: total_count,
			chart_data: chart_data,
		};
		const toast = {
			status: 200,
			type: 'select',
			message: 'Document Receive Log',
		};
		res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
