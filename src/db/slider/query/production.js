import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';

import * as hrSchema from '../../hr/schema.js';

import { production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(production)
		.values(req.body)
		.returning({ insertedId: production.uuid });

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
		.update(production)
		.set(req.body)
		.where(eq(production.uuid, req.params.uuid))
		.returning({ updatedId: production.uuid });

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
		.delete(production)
		.where(eq(production.uuid, req.params.uuid))
		.returning({ deletedId: production.uuid });

	try {
		const data = await resultPromise;

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
			uuid: production.uuid,
			stock_uuid: production.stock_uuid,
			production_quantity: production.production_quantity,
			wastage: production.wastage,
			created_by: production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: production.created_at,
			updated_at: production.updated_at,
			remarks: production.remarks,
		})
		.from(production)
		.leftJoin(
			hrSchema.users,
			eq(production.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'production list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: production.uuid,
			stock_uuid: production.stock_uuid,
			production_quantity: production.production_quantity,
			wastage: production.wastage,
			created_by: production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: production.created_at,
			updated_at: production.updated_at,
			remarks: production.remarks,
		})
		.from(production)
		.leftJoin(
			hrSchema.users,
			eq(production.created_by, hrSchema.users.uuid)
		)
		.where(eq(production.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'production',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
