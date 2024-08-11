import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';

import hr, * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';

import { bank, lc, pi } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.insert(pi)
		.values(req.body)
		.returning({ insertedId: pi.order_info_ids });
	try {
		const data = await piPromise;
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

	const piPromise = db
		.update(pi)
		.set(req.body)
		.where(eq(pi.uuid, req.params.uuid))
		.returning({ insertedUserName: pi.created_by });

	try {
		const data = await piPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `updated by ${data[0].insertedUserName} `,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.delete(pi)
		.where(eq(pi.uuid, req.params.uuid))
		.returning({ deletedId: pi.uuid });

	try {
		const data = await piPromise;
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
			uuid: pi.uuid,
			lc_uuid: pi.lc_uuid,
			lc_number: lc.lc_number,
			order_info_id: pi.order_info_ids,
			marketing_uuid: pi.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			party_uuid: pi.party_uuid,
			party_name: publicSchema.party.name,
			merchandiser_uuid: pi.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: pi.factory_uuid,
			factory_name: publicSchema.factory.name,
			bank_uuid: pi.bank_uuid,
			bank_name: bank.name,
			bank_swift_code: bank.swift_code,
			validity: pi.validity,
			payment: pi.payment,
			created_by: pi.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: pi.created_at,
			updated_at: pi.updated_at,
			remarks: pi.remarks,
		})
		.from(pi)
		.leftJoin(hrSchema.users, eq(pi.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(pi.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(pi.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(pi.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(pi.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(bank, eq(pi.bank_uuid, bank.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Pi list',
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

	const piPromise = db
		.select({
			uuid: pi.uuid,
			lc_uuid: pi.lc_uuid,
			lc_number: lc.lc_number,
			order_info_id: pi.order_info_ids,
			marketing_uuid: pi.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			party_uuid: pi.party_uuid,
			party_name: publicSchema.party.name,
			merchandiser_uuid: pi.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: pi.factory_uuid,
			factory_name: publicSchema.factory.name,
			bank_uuid: pi.bank_uuid,
			bank_name: bank.name,
			bank_swift_code: bank.swift_code,
			validity: pi.validity,
			payment: pi.payment,
			created_by: pi.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: pi.created_at,
			updated_at: pi.updated_at,
			remarks: pi.remarks,
		})
		.from(pi)
		.leftJoin(hrSchema.users, eq(pi.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(pi.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(pi.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(pi.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(pi.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(bank, eq(pi.bank_uuid, bank.uuid))
		.where(eq(pi.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Pi',
	};

	handleResponse({
		promise: piPromise,
		res,
		next,
		...toast,
	});
}
