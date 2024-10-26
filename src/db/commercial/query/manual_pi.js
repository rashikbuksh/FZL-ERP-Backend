import { asc, desc, eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { bank, manual_pi } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db.insert(manual_pi).values(req.body).returning({
		insertedName: manual_pi.pi_number,
	});
	try {
		const data = await manualPiPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedName} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db
		.update(manual_pi)
		.set(req.body)
		.where(eq(manual_pi.uuid, req.params.uuid))
		.returning({ updatedName: manual_pi.pi_number });

	try {
		const data = await manualPiPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db
		.delete(manual_pi)
		.where(eq(manual_pi.uuid, req.params.uuid))
		.returning({ deletedName: manual_pi.pi_number });

	try {
		const data = await manualPiPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: manual_pi.uuid,
			pi_uuids: manual_pi.pi_uuids,
			marketing_uuid: manual_pi.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			party_uuid: manual_pi.party_uuid,
			party_name: publicSchema.party.name,
			buyer_uuid: manual_pi.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			merchandiser_uuid: manual_pi.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: manual_pi.factory_uuid,
			factory_name: publicSchema.factory.name,
			bank_uuid: manual_pi.bank_uuid,
			bank_name: bank.name,
			bank_address: bank.name,
			bank_swift_code: bank.swift_code,
			bank_policy: bank.policy,
			routing_no: bank.routing_no,
			validity: manual_pi.validity,
			payment: manual_pi.payment,
			remarks: manual_pi.remarks,
			created_by: manual_pi.created_by,
			created_by_name: hrSchema.users.name,
			receive_amount: manual_pi.receive_amount,
			weight: manual_pi.weight,
			date: manual_pi.date,
			pi_number: manual_pi.pi_number,
			created_at: manual_pi.created_at,
			updated_at: manual_pi.updated_at,
		})
		.from(manual_pi)
		.leftJoin(hrSchema.users, eq(manual_pi.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.marketing,
			eq(manual_pi.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(manual_pi.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(manual_pi.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(bank, eq(manual_pi.bank_uuid, bank.uuid))
		.orderBy(asc(manual_pi.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'manual_pi list',
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

	const manualPiPromise = db
		.select({
			uuid: manual_pi.uuid,
			pi_uuids: manual_pi.pi_uuids,
			marketing_uuid: manual_pi.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			party_uuid: manual_pi.party_uuid,
			party_name: publicSchema.party.name,
			buyer_uuid: manual_pi.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			merchandiser_uuid: manual_pi.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: manual_pi.factory_uuid,
			factory_name: publicSchema.factory.name,
			bank_uuid: manual_pi.bank_uuid,
			bank_name: bank.name,
			bank_address: bank.name,
			bank_swift_code: bank.swift_code,
			bank_policy: bank.policy,
			routing_no: bank.routing_no,
			validity: manual_pi.validity,
			payment: manual_pi.payment,
			remarks: manual_pi.remarks,
			created_by: manual_pi.created_by,
			created_by_name: hrSchema.users.name,
			receive_amount: manual_pi.receive_amount,
			weight: manual_pi.weight,
			date: manual_pi.date,
			pi_number: manual_pi.pi_number,
			created_at: manual_pi.created_at,
			updated_at: manual_pi.updated_at,
		})
		.from(manual_pi)
		.leftJoin(hrSchema.users, eq(manual_pi.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.marketing,
			eq(manual_pi.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(manual_pi.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(manual_pi.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(bank, eq(manual_pi.bank_uuid, bank.uuid))
		.where(eq(manual_pi.uuid, req.params.uuid));

	try {
		const data = await manualPiPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'manual_pi',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectManualPiByManualPiUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { manual_pi_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${manual_pi_uuid}`)
				.then((response) => response);

		const [manual_pi, manual_pi_entry] = await Promise.all([
			fetchData('/commercial/manual-pi/'),
			fetchData('/commercial/manual-pi-entry/by'),
		]);

		const response = {
			...manual_pi?.data?.data,
			manual_pi_entry: manual_pi_entry || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Manual Pi Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
