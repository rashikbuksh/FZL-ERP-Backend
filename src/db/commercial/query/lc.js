import { eq, sql, desc } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { lc, pi } from '../schema.js';

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
	const query = sql`
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
			concat('PI', to_char(pi.created_at, 'YY'), '-', LPAD(pi.id::text, 4, '0')
			)) as pi_ids,
			party.name AS party_name,
			(	
				SELECT 
					SUM(coalesce(pi.payment,0) * coalesce(order_entry.party_price,0))
				FROM commercial.pi 
					LEFT JOIN commercial.pi_entry ON pi.uuid = pi_entry.pi_uuid 
					LEFT JOIN zipper.sfg ON pi_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi.lc_uuid = lc.uuid
			) AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.payment_value,
			lc.payment_date,
			lc.ldbc_fdbc,
			lc.acceptance_date,
			lc.maturity_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.lc_cancel,
			lc.handover_date,
			lc.document_receive_date,
			lc.shipment_date,
			lc.expiry_date,
			lc.ud_no,
			lc.ud_received,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
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
			commercial.pi ON lc.uuid = pi.lc_uuid
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
			concat('PI', to_char(pi.created_at, 'YY'), '-', LPAD(pi.id::text, 4, '0')
			)) as pi_ids,
			party.name AS party_name,
			(	
				SELECT 
					SUM(coalesce(pi.payment,0)  * coalesce(order_entry.party_price,0))
				FROM commercial.pi 
					LEFT JOIN commercial.pi_entry ON pi.uuid = pi_entry.pi_uuid 
					LEFT JOIN zipper.sfg ON pi_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi.lc_uuid = lc.uuid
			) AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.payment_value,
			lc.payment_date,
			lc.ldbc_fdbc,
			lc.acceptance_date,
			lc.maturity_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.lc_cancel,
			lc.handover_date,
			lc.document_receive_date,
			lc.shipment_date,
			lc.expiry_date,
			lc.ud_no,
			lc.ud_received,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
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
			commercial.pi ON lc.uuid = pi.lc_uuid
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

		const [lc, pi] = await Promise.all([
			fetchData('lc'),
			fetchData('pi-lc'),
		]);

		const response = {
			...lc?.data?.data,
			pi: pi?.data?.data || [],
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

	const query = sql`
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
			concat('PI', to_char(pi.created_at, 'YY'), '-', LPAD(pi.id::text, 4, '0')
			)) as pi_ids,
			party.name AS party_name,
			(	
				SELECT 
					SUM(coalesce(pi.payment,0)  * coalesce(order_entry.party_price,0))
				FROM commercial.pi 
					LEFT JOIN commercial.pi_entry ON pi.uuid = pi_entry.pi_uuid 
					LEFT JOIN zipper.sfg ON pi_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi.lc_uuid = lc.uuid
			) AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.payment_value,
			lc.payment_date,
			lc.ldbc_fdbc,
			lc.acceptance_date,
			lc.maturity_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.lc_cancel,
			lc.handover_date,
			lc.document_receive_date,
			lc.shipment_date,
			lc.expiry_date,
			lc.ud_no,
			lc.ud_received,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
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
			commercial.pi ON lc.uuid = pi.lc_uuid
		WHERE lc.lc_number = ${req.params.lc_number}
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
