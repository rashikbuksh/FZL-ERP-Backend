import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectPiRegister(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { start_date, end_date } = req.query;

	console.log(start_date, end_date);

	const query = sql`
                SELECT 
                    pi_cash.uuid,
                    CASE WHEN is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END AS pi_cash_number,
                    pi_cash.party_uuid,
                    party.name as party_name,
                    pi_cash.lc_uuid,
                    lc.lc_number,
                    CASE WHEN lc.uuid IS NOT NULL THEN concat('LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')) ELSE NULL END as file_number,
                    ROUND(coalesce(pi_cash_entry_order_numbers.total_zipper_pi_price, 0)::numeric + coalesce(pi_cash_entry_order_numbers.total_thread_pi_price, 0)::numeric, 4)::float8 as total_pi_value,
                    bank.name as bank_name
                FROM
                    commercial.pi_cash
                LEFT JOIN
                    hr.users ON pi_cash.created_by = users.uuid
                LEFT JOIN 
                    commercial.bank ON pi_cash.bank_uuid = bank.uuid
                LEFT JOIN
                    commercial.lc ON pi_cash.lc_uuid = lc.uuid
                LEFT JOIN
                    public.party ON pi_cash.party_uuid = party.uuid
                LEFT JOIN (
                    SELECT 
                        pi_cash_uuid, 
                        SUM(pe.pi_cash_quantity)::float8 as total_pi_quantity,
                        SUM(pe.pi_cash_quantity * coalesce(oe.party_price/12, 0))::float8 as total_zipper_pi_price, 
                        SUM(pe.pi_cash_quantity * coalesce(toe.party_price, 0))::float8 as total_thread_pi_price
                    FROM
                        commercial.pi_cash_entry pe 
                        LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                        LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
                        LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    GROUP BY pi_cash_uuid
                ) pi_cash_entry_order_numbers ON pi_cash.uuid = pi_cash_entry_order_numbers.pi_cash_uuid
                WHERE 
                    ${start_date ? sql`pi_cash.created_at BETWEEN ${start_date}::TIMESTAMP AND ${end_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Production Status',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
