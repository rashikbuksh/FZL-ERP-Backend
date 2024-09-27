import { eq, desc } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';

import db from '../../index.js';
import { batch_entry, batch_entry_production } from '../schema.js';

import * as hrSchema from '../../hr/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(batch_entry_production)
		.values(req.body)
		.returning({ insertedId: batch_entry_production.uuid });

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
		.update(batch_entry_production)
		.set(req.body)
		.where(eq(batch_entry_production.uuid, req.params.uuid))
		.returning({ updatedId: batch_entry_production.uuid });

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
		.delete(batch_entry_production)
		.where(eq(batch_entry_production.uuid, req.params.uuid));

	try {
		await resultPromise;

		return await res.status(204).json();
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry_production.uuid,
			batch_entry_uuid: batch_entry_production.batch_entry_uuid,
			production_quantity: batch_entry_production.production_quantity,
			production_quantity_in_kg:
				batch_entry_production.production_quantity_in_kg,
			created_by: batch_entry_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry_production.created_at,
			updated_at: batch_entry_production.updated_at,
			remarks: batch_entry_production.remarks,
		})
		.from(batch_entry_production)
		.join(
			hrSchema.users,
			eq(batch_entry_production.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(batch_entry_production.created_at));

	const toast = {
		status: 200,
		type: 'select all',
		message: 'batch_entry_production list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry_production.uuid,
			batch_entry_uuid: batch_entry_production.batch_entry_uuid,
			production_quantity: batch_entry_production.production_quantity,
			production_quantity_in_kg:
				batch_entry_production.production_quantity_in_kg,
			created_by: batch_entry_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry_production.created_at,
			updated_at: batch_entry_production.updated_at,
			remarks: batch_entry_production.remarks,
		})
		.from(batch_entry_production)
		.join(
			hrSchema.users,
			eq(batch_entry_production.created_by, hrSchema.users.uuid)
		)
		.where(eq(batch_entry_production.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry_production',
		};
		return await res.status(201).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
