import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { dyes_category } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(dyes_category)
		.values(req.body)
		.returning({ insertedName: dyes_category.name });

	try {
		const data = await resultPromise;

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

	const resultPromise = db
		.update(dyes_category)
		.set(req.body)
		.where(eq(dyes_category.uuid, req.params.uuid))
		.returning({ updatedName: dyes_category.name });

	try {
		const data = await resultPromise;

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

	const resultPromise = db
		.delete(dyes_category)
		.where(eq(dyes_category.uuid, req.params.uuid))
		.returning({ deletedName: dyes_category.name });

	try {
		const data = await resultPromise;

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
			uuid: dyes_category.uuid,
			name: dyes_category.name,
			pale: dyes_category.pale,
			medium: dyes_category.medium,
			dark: dyes_category.dark,
			created_by: dyes_category.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dyes_category.created_at,
			updated_at: dyes_category.updated_at,
			remarks: dyes_category.remarks,
		})
		.from(dyes_category)
		.leftJoin(
			hrSchema.users,
			eq(dyes_category.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'dyes_category list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: dyes_category.uuid,
			name: dyes_category.name,
			pale: dyes_category.pale,
			medium: dyes_category.medium,
			dark: dyes_category.dark,
			created_by: dyes_category.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dyes_category.created_at,
			updated_at: dyes_category.updated_at,
			remarks: dyes_category.remarks,
		})
		.from(dyes_category)
		.leftJoin(
			hrSchema.users,
			eq(dyes_category.created_by, hrSchema.users.uuid)
		)
		.where(eq(dyes_category.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'dyes_category',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
