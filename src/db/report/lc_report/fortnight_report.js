import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function fortnightReport(req, res, next) {
	const { own_uuid, handover, acceptance, maturity, payment } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
            SELECT 
                CONCAT('LC', to_char(lc.created_at, 'YY'), '-', (lc.id::text)) AS file_number,
                lc.uuid,
                lc.lc_number,
                lc.lc_date,
                party.uuid as party_uuid,
                party.name as party_name,
                lc.created_at,
                lc.updated_at,
                lc.remarks,
                lc.commercial_executive,
                lc.party_bank,
                lc_entry.handover_date,
                lc_entry.document_receive_date,
                lc_entry.acceptance_date,
                lc_entry.maturity_date,
                lc_entry.payment_date,
                lc_entry.ldbc_fdbc,
                lc.shipment_date,
                lc.expiry_date,
                lc_entry.amount::float8,
                lc_entry.payment_value,
                CASE
                    WHEN is_old_pi = 0 THEN (
                        SELECT SUM(
                                CASE
                                    WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type = 'tape' THEN coalesce(
                                        pi_cash_entry.pi_cash_quantity, 0
                                    ) * coalesce(order_entry.party_price, 0)
                                    WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type != 'tape' THEN coalesce(
                                        pi_cash_entry.pi_cash_quantity, 0
                                    ) * coalesce(order_entry.party_price, 0) / 12
                                    ELSE coalesce(
                                        pi_cash_entry.pi_cash_quantity, 0
                                    ) * coalesce(toe.party_price, 0)
                                END
                            )
                        FROM commercial.pi_cash
                            LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
                            LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                            LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                            LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                            LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                        WHERE
                            pi_cash.lc_uuid = lc.uuid
                    )
                    ELSE lc.lc_value::float8
                END AS total_value,
                (jsonb_agg(marketing.name))[1] as marketing_name,
                (jsonb_agg(bank.name))[1] as bank_name,
                lc.party_bank,
                CASE WHEN is_old_pi = 0 THEN(	
                    SELECT 
                        SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
                    FROM commercial.pi_cash 
                        LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
                        LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                        LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
                    WHERE pi_cash.lc_uuid = lc.uuid
                )::float8 ELSE lc.lc_value::float8 END AS total_value,
                CASE WHEN is_old_pi = 0 THEN jsonb_agg(vpc.order_numbers) ELSE manual_pi.order_numbers END AS order_numbers,
                CASE WHEN is_old_pi = 0 THEN jsonb_agg(vpc.thread_order_numbers) ELSE manual_pi.thread_order_numbers END AS thread_order_numbers,
                lc.is_old_pi
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
            LEFT JOIN 
                commercial.v_pi_cash vpc ON pi_cash.uuid = vpc.pi_cash_uuid
            LEFT JOIN (
                SELECT
                    manual_pi.lc_uuid,
                    CASE
                        WHEN mpe.is_zipper = TRUE THEN JSONB_AGG(mpe.order_number)
                        ELSE NULL
                    END AS order_numbers,
                    CASE
                        WHEN mpe.is_zipper = FALSE THEN JSONB_AGG(mpe.order_number)
                        ELSE NULL
                    END AS thread_order_numbers
                FROM commercial.manual_pi
                LEFT JOIN commercial.manual_pi_entry mpe ON manual_pi.uuid = mpe.manual_pi_uuid
                WHERE manual_pi.lc_uuid IS NOT NULL
                GROUP BY manual_pi.lc_uuid, mpe.is_zipper
            ) AS manual_pi ON manual_pi.lc_uuid = lc.uuid
            WHERE
                ${own_uuid == null ? sql`TRUE` : sql`pi_cash.marketing_uuid = ${marketingUuid}`}
        `;

		if (acceptance == 'true') {
			query.append(
				sql` AND lc_entry.handover_date IS NOT NULL AND lc_entry.acceptance_date IS NULL`
			);
		} else if (maturity == 'true') {
			query.append(
				sql` AND lc_entry.handover_date IS NOT NULL AND lc_entry.acceptance_date IS NOT NULL AND lc_entry.maturity_date IS NULL`
			);
		} else {
			query.append(sql` AND lc_entry.handover_date IS NULL`);
		}

		query.append(
			sql` 
            GROUP BY lc.uuid, party.uuid, lc_entry.uuid, manual_pi.order_numbers, manual_pi.thread_order_numbers
            ORDER BY lc.created_at DESC
            `
		);

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// order_numbers and thread_order_numbers are array of array of strings, we need to flatten them
		// e.g. [['ORD-001', 'ORD-002'], ['ORD-003']] => ['ORD-001', 'ORD-002', 'ORD-003']
		data.rows = data.rows.map((row) => {
			if (row.is_old_pi === 0) {
				return {
					...row,
					order_numbers: row.order_numbers.flat(),
					thread_order_numbers: row.thread_order_numbers.flat(),
				};
			}
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'LC Report',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
