import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectCashInvoice(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const query = sql`
                   SELECT 
                        pi_cash.uuid,
                        CASE 
                            WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
                            ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
                        END AS id,
                        SUM(CASE 
                            WHEN pe.thread_order_entry_uuid IS NULL 
                            THEN 
                                CASE 
                                    WHEN vodf.order_type = 'tape' 
                                    THEN oe.size::float8 * (oe.party_price::float8)*pi_cash.conversion_rate::float8 
                                    ELSE ROUND(pe.pi_cash_quantity * oe.party_price/12*pi_cash.conversion_rate, 2)::float8 
                                END
                            ELSE ROUND(pe.pi_cash_quantity * toe.party_price*pi_cash.conversion_rate, 2)::float8 
                        END) as value,
                        jsonb_agg(DISTINCT
                            CASE 
                                WHEN pe.thread_order_entry_uuid IS NULL THEN 
                                    jsonb_build_object(
                                        'order_number', vodf.order_number, 
                                        'order_info_uuid', vodf.order_info_uuid
                                    )
                                ELSE 
                                    jsonb_build_object(
                                        'order_number', CONCAT(
                                            'ST', 
                                            CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, 
                                            TO_CHAR(toi.created_at, 'YY'), 
                                            '-', 
                                            LPAD(toi.id::text, 4, '0')
                                        ), 
                                        'thread_order_info_uuid', toi.uuid
                                    )
                            END
                        ) AS order_number,
                        pi_cash.receive_amount::float8
                    FROM
                        commercial.pi_cash pi_cash
                    LEFT JOIN commercial.pi_cash_entry pe ON pi_cash.uuid = pe.pi_cash_uuid
                    LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
                    WHERE 
                        pi_cash.is_pi = 0 AND ${own_uuid == null ? sql`TRUE` : sql`pi_cash.marketing_uuid = ${marketingUuid}`}
                    GROUP BY
                        pi_cash.uuid, pi_cash.is_pi, pi_cash.created_at, pi_cash.id, pi_cash.receive_amount
                    ORDER BY pi_cash.created_at DESC
                    `;

		const resultPromise = db.execute(query);

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
