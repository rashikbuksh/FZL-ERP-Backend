import { eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
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
	const resultPromise = db
		.select({
			uuid: lc.uuid,
			party_uuid: lc.party_uuid,
			party_name: publicSchema.party.name,
			file_no: lc.file_no,
			lc_number: lc.lc_number,
			lc_date: lc.lc_date,
			payment_value: lc.payment_value,
			payment_date: lc.payment_date,
			ldbc_fdbc: lc.ldbc_fdbc,
			acceptance_date: lc.acceptance_date,
			maturity_date: lc.maturity_date,
			commercial_executive: lc.commercial_executive,
			party_bank: lc.party_bank,
			production_complete: lc.production_complete,
			lc_cancel: lc.lc_cancel,
			handover_date: lc.handover_date,
			shipment_date: lc.shipment_date,
			expiry_date: lc.expiry_date,
			ud_no: lc.ud_no,
			ud_received: lc.ud_received,
			at_sight: lc.at_sight,
			amd_date: lc.amd_date,
			amd_count: lc.amd_count,
			problematical: lc.problematical,
			epz: lc.epz,
			created_by: lc.created_by,
			created_by_name: hrSchema.users.name,
			created_at: lc.created_at,
			updated_at: lc.updated_at,
			remarks: lc.remarks,
		})
		.from(lc)
		.leftJoin(hrSchema.users, eq(lc.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.party,
			eq(lc.party_uuid, publicSchema.party.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'lc list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.select({
			uuid: lc.uuid,
			party_uuid: lc.party_uuid,
			party_name: publicSchema.party.name,
			file_no: lc.file_no,
			lc_number: lc.lc_number,
			lc_date: lc.lc_date,
			payment_value: lc.payment_value,
			payment_date: lc.payment_date,
			ldbc_fdbc: lc.ldbc_fdbc,
			acceptance_date: lc.acceptance_date,
			maturity_date: lc.maturity_date,
			commercial_executive: lc.commercial_executive,
			party_bank: lc.party_bank,
			production_complete: lc.production_complete,
			lc_cancel: lc.lc_cancel,
			handover_date: lc.handover_date,
			shipment_date: lc.shipment_date,
			expiry_date: lc.expiry_date,
			ud_no: lc.ud_no,
			ud_received: lc.ud_received,
			at_sight: lc.at_sight,
			amd_date: lc.amd_date,
			amd_count: lc.amd_count,
			problematical: lc.problematical,
			epz: lc.epz,
			created_by: lc.created_by,
			created_by_name: hrSchema.users.name,
			created_at: lc.created_at,
			updated_at: lc.updated_at,
			remarks: lc.remarks,
		})
		.from(lc)
		.leftJoin(hrSchema.users, eq(lc.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.party,
			eq(lc.party_uuid, publicSchema.party.uuid)
		)
		.where(eq(lc.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'lc',
	};

	handleResponse({
		promise: lcPromise,
		res,
		next,
		...toast,
	});
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
			...lc?.data?.data[0],
			pi: pi?.data?.data || [],
		};

		console.log(response, 'response');

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
