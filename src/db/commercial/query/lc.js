import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { lc } from '../schema.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.insert(lc)
		.values(req.body)
		.returning({ insertedId: lc.lc_number });
	try {
		const data = await lcPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.update(lc)
		.set(req.body)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ updatedId: lc.lc_number });
	try {
		const data = await lcPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.delete(lc)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ deletedId: lc.lc_number });
	try {
		const data = await lcPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { own_uuid } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
		WITH
			lc_entry_agg AS (
				SELECT lc_uuid, JSONB_AGG(
						JSONB_BUILD_OBJECT(
							'payment_date', payment_date, 'ldbc_fdbc', ldbc_fdbc, 'acceptance_date', acceptance_date, 'maturity_date', maturity_date, 'handover_date', handover_date, 'receive_date', receive_date, 'document_submission_date', document_submission_date, 'bank_forward_date', bank_forward_date, 'document_receive_date', document_receive_date, 'payment_value', payment_value, 'amount', amount
						)
					) AS lc_entry
				FROM commercial.lc_entry
				GROUP BY
					lc_uuid
			)
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
				CASE WHEN pi_cash.uuid IS NOT NULL 
					THEN concat(
						'PI',
						to_char(pi_cash.created_at, 'YY'),
						'-',
						pi_cash.id::text
					) ELSE lc.pi_number 
				END
			) as pi_ids,
			json_agg(
				json_build_object(
					'zipper', vpc.order_numbers,
					'thread', vpc.thread_order_numbers
				)
			) as order_numbers,
			party.name AS party_name,
			array_agg(
				marketing.name
			) as marketing_name,
			array_agg(
				DISTINCT bank.name
			) as bank_name,
			CASE
				WHEN is_old_pi = 0 THEN (
					SELECT SUM(
							CASE
								WHEN pi_cash_entry.thread_order_entry_uuid IS NULL THEN coalesce(
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
						LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
					WHERE
						pi_cash.lc_uuid = lc.uuid
				)
				ELSE lc.lc_value::float8
			END AS total_value,
			concat(
				'LC',
				to_char(lc.created_at, 'YY'),
				'-',
				lc.id::text
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.expiry_date,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
			lc.is_rtgs,
			lc.is_old_pi,
			lc.lc_cancel,
			lc.shipment_date,
			lc.pi_number,
			lc.lc_value::float8,
			lc.export_lc_number,
			lc.export_lc_date,
			lc.export_lc_expire_date,
			lc.up_date,
			lc.up_number,
			lc.created_by,
			users.name AS created_by_name,
			lc.created_at,
			lc.updated_at,
			lc.remarks,
			COALESCE(lc_entry_agg.lc_entry, '[]') AS lc_entry
		FROM commercial.lc
		LEFT JOIN lc_entry_agg ON lc.uuid = lc_entry_agg.lc_uuid
		LEFT JOIN hr.users ON lc.created_by = users.uuid
		LEFT JOIN public.party ON lc.party_uuid = party.uuid
		LEFT JOIN commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
		LEFT JOIN public.marketing ON pi_cash.marketing_uuid = marketing.uuid
		LEFT JOIN commercial.bank ON pi_cash.bank_uuid = bank.uuid
		LEFT JOIN commercial.v_pi_cash vpc ON vpc.pi_cash_uuid = pi_cash.uuid
		WHERE ${own_uuid == null ? sql`TRUE` : sql`pi_cash.marketing_uuid = ${marketingUuid}`}
		GROUP BY lc.uuid, party.name, users.name, lc_entry_agg.lc_entry
		ORDER BY lc.created_at DESC
		`;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// order_number object under that zipper and thread object

		// zipper: [
		//     {
		//       "quantity": 72000,
		//       "delivered": 52653,
		//       "order_number": "Z25-3975",
		//       "packing_list": 52653,
		//       "order_info_uuid": "t1fi8rpFsGZ0i2A"
		//     },
		//     {
		//       "quantity": 53630,
		//       "delivered": 53630,
		//       "order_number": "Z25-1687",
		//       "packing_list": 53630,
		//       "order_info_uuid": "Mazyn1gveylyly9"
		//     }
		// ],
		// thread: [
		// ]
		// },

		// If data.rows is an array of rows, and each row.order_numbers is a JSON array (from json_agg)
		const merged = {
			zipper: [],
			thread: [],
		};

		for (const row of data.rows) {
			// row.order_numbers is likely a JSON string or array, so parse if needed
			let orderNumbersArr = row.order_numbers;
			if (typeof orderNumbersArr === 'string') {
				orderNumbersArr = JSON.parse(orderNumbersArr);
			}
			if (Array.isArray(orderNumbersArr)) {
				for (const obj of orderNumbersArr) {
					if (obj.zipper) merged.zipper.push(...obj.zipper);
					if (obj.thread) merged.thread.push(...obj.thread);
				}
			}
		}

		// replace the data.rows order_numbers with merged

		for (const row of data.rows) {
			row.order_numbers = {
				zipper: merged.zipper,
				thread: merged.thread,
			};
		}

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'lc list',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
				CASE WHEN pi_cash.uuid IS NOT NULL THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) ELSE lc.pi_number END
			) as pi_ids,
			party.name AS party_name,
			CASE WHEN is_old_pi = 0 THEN (
				SELECT
					SUM(
						CASE
							WHEN pi_cash_entry.thread_order_entry_uuid IS NULL
							THEN coalesce(pi_cash_entry.pi_cash_quantity, 0) * coalesce(order_entry.party_price, 0) / 12
							ELSE coalesce(pi_cash_entry.pi_cash_quantity, 0) * coalesce(toe.party_price, 0)
						END
					)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
					LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', lc.id::text
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.expiry_date,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
			lc.is_rtgs,
			lc.is_old_pi,
			lc.lc_cancel,
			lc.shipment_date,
			lc.pi_number,
			lc.lc_value::float8,
			lc.export_lc_number,
			lc.export_lc_date,
			lc.export_lc_expire_date,
			lc.up_date,
			lc.up_number,
			lc.created_by,
			users.name AS created_by_name,
			lc.created_at,
			lc.updated_at,
			lc.remarks
		FROM
			commercial.lc
		LEFT JOIN
			hr.users ON lc.created_by = users.uuid
		LEFT JOIN
			public.party ON lc.party_uuid = party.uuid
		LEFT JOIN
			commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
		WHERE lc.uuid = ${req.params.uuid}
		GROUP BY lc.uuid, party.name, users.name`;

	const lcPromise = db.execute(query);

	try {
		const data = await lcPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcPiByLcUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		const api = await createApi(req);

		const { lc_uuid } = req.params;

		const fetchData = async (endpoint) =>
			await api.get(`/commercial/${endpoint}/${lc_uuid}`);

		const [lc, lc_entry, lc_entry_others, pi_cash] = await Promise.all([
			fetchData('lc'),
			fetchData('lc-entry/by'),
			fetchData('lc-entry-others/by'),
			fetchData('pi-cash-lc'),
		]);

		const response = {
			...lc?.data?.data,
			lc_entry: lc_entry?.data?.data || [],
			lc_entry_others: lc_entry_others?.data?.data || [],
			pi: pi_cash?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'lc',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcByLcNumber(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { lc_number } = req.params;
	const query = sql`
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
			CASE WHEN is_old_pi = 0 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) ELSE lc.pi_number END
			) as pi_cash_ids,
			party.name AS party_name,
			CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(
						CASE 
							WHEN pi_cash_entry.thread_order_entry_uuid IS NULL 
							THEN coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(order_entry.party_price,0)/12 
							ELSE coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(toe.party_price,0) 
						END
					)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
					LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', lc.id::text
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.lc_cancel,
			lc.shipment_date,
			lc.expiry_date,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
			lc.is_rtgs,
			lc.is_old_pi,
			lc.pi_number,
			lc.lc_value::float8,
			lc.created_by,
			users.name AS created_by_name,
			lc.created_at,
			lc.updated_at,
			lc.remarks,
			lc.export_lc_number,
			lc.export_lc_date,
			lc.export_lc_expire_date,
			lc.up_date,
			lc.up_number
		FROM
			commercial.lc
		LEFT JOIN
			hr.users ON lc.created_by = users.uuid
		LEFT JOIN
			public.party ON lc.party_uuid = party.uuid
		LEFT JOIN
			commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
		WHERE lc.lc_number = ${req.params.lc_number}
		GROUP BY lc.uuid, party.name, users.name`;

	try {
		const data = await db.execute(query);
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api.get(`/commercial/${endpoint}/${lc_number}`);

		const [lc_entry, lc_entry_others] = await Promise.all([
			fetchData('lc-entry/by/lc-number'),
			fetchData('lc-entry-others/by/lc-number'),
		]);

		const response = {
			...data?.rows[0],
			lc_entry: lc_entry?.data?.data || [],
			lc_entry_others: lc_entry_others?.data?.data || [],
		};
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc by lc number',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
