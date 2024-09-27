import { eq, desc } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';

import db from '../../index.js';
import { batch_entry_trx } from '../schema.js';
import * as hrSchema from '../../hr/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(batch_entry_trx)
		.values(req.body)
		.returning({ insertedId: batch_entry_trx.uuid });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(batch_entry_trx)
		.set(req.body)
		.where(eq(batch_entry_trx.uuid, req.params.uuid))
		.returning({ updatedId: batch_entry_trx.uuid });

	try {
		const data = await resultPromise;

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
	const resultPromise = db
		.delete(batch_entry_trx)
		.where(eq(batch_entry_trx.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${req.params.uuid} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry_trx.uuid,
			batch_entry_uuid: batch_entry_trx.batch_entry_uuid,
			quantity: batch_entry_trx.quantity,
			created_by: batch_entry_trx.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry_trx.created_at,
			updated_at: batch_entry_trx.updated_at,
			remarks: batch_entry_trx.remarks,
		})
		.from(batch_entry_trx)
		.leftJoin(
			hrSchema.users,
			eq(batch_entry_trx.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(batch_entry_trx.created_at));

	const toast = {
		status: 200,
		type: 'select all',
		message: 'batch_entry_trx list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry_trx.uuid,
			batch_entry_uuid: batch_entry_trx.batch_entry_uuid,
			quantity: batch_entry_trx.quantity,
			created_by: batch_entry_trx.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry_trx.created_at,
			updated_at: batch_entry_trx.updated_at,
			remarks: batch_entry_trx.remarks,
		})
		.from(batch_entry_trx)
		.leftJoin(
			hrSchema.users,
			eq(batch_entry_trx.created_by, hrSchema.users.uuid)
		)
		.where(eq(batch_entry_trx.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry_trx',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
