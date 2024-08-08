import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';

import hr, * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';

import { bank, lc, pi } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db.insert(pi).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: piPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.update(pi)
		.set(req.body)
		.where(eq(pi.uuid, req.params.uuid))
		.returning({ updatedName: pi.name });

	piPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: piPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			//for error message
			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating pi - ${error.message}`,
			};

			handleResponse({
				promise: piPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.delete(pi)
		.where(eq(pi.uuid, req.params.uuid))
		.returning({ deletedName: pi.name });

	piPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: piPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			//for error message
			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting pi - ${error.message}`,
			};

			handleResponse({
				promise: piPromise,
				res,
				next,
				...toast,
			});
		});
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
		.leftJoin(hrSchema.users)
		.on(pi.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(
			hrSchema.designation.department_uuid.equals(
				hrSchema.department.uuid
			)
		)
		.leftJoin(publicSchema.marketing)
		.on(pi.marketing_uuid.equals(publicSchema.marketing.uuid))
		.leftJoin(publicSchema.party)
		.on(pi.party_uuid.equals(publicSchema.party.uuid))
		.leftJoin(publicSchema.merchandiser)
		.on(pi.merchandiser_uuid.equals(publicSchema.merchandiser.uuid))
		.leftJoin(publicSchema.factory)
		.on(pi.factory_uuid.equals(publicSchema.factory.uuid))
		.leftJoin(bank)
		.on(pi.bank_uuid.equals(bank.uuid));

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
		.leftJoin(hrSchema.users)
		.on(pi.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(
			hrSchema.designation.department_uuid.equals(
				hrSchema.department.uuid
			)
		)
		.leftJoin(publicSchema.marketing)
		.on(pi.marketing_uuid.equals(publicSchema.marketing.uuid))
		.leftJoin(publicSchema.party)
		.on(pi.party_uuid.equals(publicSchema.party.uuid))
		.leftJoin(publicSchema.merchandiser)
		.on(pi.merchandiser_uuid.equals(publicSchema.merchandiser.uuid))
		.leftJoin(publicSchema.factory)
		.on(pi.factory_uuid.equals(publicSchema.factory.uuid))
		.leftJoin(bank)
		.on(pi.bank_uuid.equals(bank.uuid))
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
