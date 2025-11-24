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
                CASE WHEN lc.is_old_pi = 0 THEN COALESCE(pc_total.calc_total, lc.lc_value::float8) ELSE lc.lc_value::float8 END AS total_value,
                MIN(marketing.name) as marketing_name,
                MIN(bank.name) as bank_name,
                lc.party_bank,
                -- total_value already computed above; removed duplicate computation
                CASE WHEN is_old_pi = 0 THEN jsonb_agg(DISTINCT vpc.order_numbers) ELSE manual_pi.order_numbers END AS order_numbers,
                CASE WHEN is_old_pi = 0 THEN jsonb_agg(DISTINCT vpc.thread_order_numbers) ELSE manual_pi.thread_order_numbers END AS thread_order_numbers,
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
            -- Pre-aggregated total for performance instead of correlated subquery
            LEFT JOIN LATERAL (
                SELECT SUM(
                        CASE
                            WHEN pce.thread_order_entry_uuid IS NULL AND vodf2.order_type = 'tape' THEN COALESCE(pce.pi_cash_quantity,0) * COALESCE(oe2.party_price,0)
                            WHEN pce.thread_order_entry_uuid IS NULL AND vodf2.order_type != 'tape' THEN COALESCE(pce.pi_cash_quantity,0) * COALESCE(oe2.party_price,0) / 12
                            ELSE COALESCE(pce.pi_cash_quantity,0) * COALESCE(toe2.party_price,0)
                        END
                    ) AS calc_total
                FROM commercial.pi_cash pc2
                LEFT JOIN commercial.pi_cash_entry pce ON pc2.uuid = pce.pi_cash_uuid
                LEFT JOIN zipper.sfg sfg2 ON pce.sfg_uuid = sfg2.uuid
                LEFT JOIN zipper.order_entry oe2 ON sfg2.order_entry_uuid = oe2.uuid
                LEFT JOIN zipper.v_order_details_full vodf2 ON oe2.order_description_uuid = vodf2.order_description_uuid
                LEFT JOIN thread.order_entry toe2 ON pce.thread_order_entry_uuid = toe2.uuid
                WHERE pc2.lc_uuid = lc.uuid
            ) pc_total ON TRUE
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
            GROUP BY lc.uuid, party.uuid, lc_entry.uuid, manual_pi.order_numbers, manual_pi.thread_order_numbers, pc_total.calc_total
            ORDER BY lc.created_at DESC
            `
		);

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// order_numbers and thread_order_numbers are array of array of strings, we need to flatten them
		// e.g. [['ORD-001', 'ORD-002'], ['ORD-003']] => ['ORD-001', 'ORD-002', 'ORD-003']
		data.rows = data.rows
			.map((row) => {
				if (row.is_old_pi === 0) {
					const orderNumbersArr = Array.isArray(row.order_numbers)
						? row.order_numbers.flat().filter(Boolean)
						: [];
					const threadOrderNumbersArr = Array.isArray(
						row.thread_order_numbers
					)
						? row.thread_order_numbers.flat().filter(Boolean)
						: [];

					// Deduplicate by order_info_uuid (if object) or value
					const uniqueOrders = [];
					const seenOrders = new Set();
					for (const o of orderNumbersArr) {
						// o may be an object {quantity, delivered, order_number, packing_list, order_info_uuid}
						const key =
							o && typeof o === 'object' && 'order_info_uuid' in o
								? o.order_info_uuid
								: JSON.stringify(o);
						if (!seenOrders.has(key)) {
							seenOrders.add(key);
							uniqueOrders.push(o);
						}
					}

					const uniqueThreadOrders = [];
					const seenThread = new Set();
					for (const o of threadOrderNumbersArr) {
						const key =
							o && typeof o === 'object' && 'order_info_uuid' in o
								? o.order_info_uuid
								: JSON.stringify(o);
						if (!seenThread.has(key)) {
							seenThread.add(key);
							uniqueThreadOrders.push(o);
						}
					}

					return {
						...row,
						order_numbers: uniqueOrders,
						thread_order_numbers: uniqueThreadOrders,
					};
				}
				// Return row unchanged for old PI
				return row;
			})
			.filter(Boolean);

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
