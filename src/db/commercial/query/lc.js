import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { lc } from '../schema.js';

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

	const query = sql`
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
			concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')
				)) as pi_ids,
			party.name AS party_name,
			CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					(SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12))::float8
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.lc_value::float8,
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
		WHERE ${own_uuid == null ? sql`TRUE` : sql`pi_cash.marketing_uuid = ${own_uuid}`}
		GROUP BY lc.uuid, party.name, users.name
		ORDER BY lc.created_at DESC
		`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

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
			concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')
			)) as pi_cash_ids,
			party.name AS party_name,
			CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.lc_value::float8,
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
			CASE WHEN is_old_pi = 0 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE lc.pi_number END
			) as pi_cash_ids,
			party.name AS party_name,
			CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')
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
			lc.remarks
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
