import { desc, eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { merchandiser, party } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.insert(merchandiser)
		.values(req.body)
		.returning({ insertedName: merchandiser.name });

	try {
		const data = await merchandiserPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.update(merchandiser)
		.set(req.body)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning({ updatedName: merchandiser.name });

	try {
		const data = await merchandiserPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.delete(merchandiser)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning({ deletedName: merchandiser.name });

	try {
		const data = await merchandiserPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: merchandiser.uuid,
			party_uuid: merchandiser.party_uuid,
			party_name: party.name,
			name: merchandiser.name,
			email: merchandiser.email,
			phone: merchandiser.phone,
			address: merchandiser.address,
			created_at: merchandiser.created_at,
			updated_at: merchandiser.updated_at,
			created_by: merchandiser.created_by,
			created_by_name: hrSchema.users.name,
			remarks: merchandiser.remarks,
		})
		.from(merchandiser)
		.leftJoin(party, eq(merchandiser.party_uuid, party.uuid))
		.leftJoin(
			hrSchema.users,
			eq(merchandiser.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(merchandiser.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Merchandiser list',
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

	const merchandiserPromise = db
		.select({
			uuid: merchandiser.uuid,
			party_uuid: merchandiser.party_uuid,
			party_name: party.name,
			name: merchandiser.name,
			email: merchandiser.email,
			phone: merchandiser.phone,
			address: merchandiser.address,
			created_at: merchandiser.created_at,
			updated_at: merchandiser.updated_at,
			created_by: merchandiser.created_by,
			created_by_name: hrSchema.users.name,
			remarks: merchandiser.remarks,
		})
		.from(merchandiser)
		.leftJoin(party, eq(merchandiser.party_uuid, party.uuid))
		.leftJoin(
			hrSchema.users,
			eq(merchandiser.created_by, hrSchema.users.uuid)
		)
		.where(eq(merchandiser.uuid, req.params.uuid));

	try {
		const data = await merchandiserPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Merchandiser by uuid',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
