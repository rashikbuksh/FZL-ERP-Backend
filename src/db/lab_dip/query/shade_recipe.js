import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { shade_recipe } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(shade_recipe)
		.values(req.body)
		.returning({ insertedName: shade_recipe.name });

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
		.update(shade_recipe)
		.set(req.body)
		.where(eq(shade_recipe.uuid, req.params.uuid))
		.returning({ updatedName: shade_recipe.name });

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
	const resultPromise = db
		.delete(shade_recipe)
		.where(eq(shade_recipe.uuid, req.params.uuid))
		.returning({ deletedName: shade_recipe.name });

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
			uuid: shade_recipe.uuid,
			name: shade_recipe.name,
			sub_streat: shade_recipe.sub_streat,
			created_by: shade_recipe.created_by,
			created_by_name: hrSchema.users.name,
			created_at: shade_recipe.created_at,
			updated_at: shade_recipe.updated_at,
			remarks: shade_recipe.remarks,
		})
		.from(shade_recipe)
		.leftJoin(
			hrSchema.users,
			eq(shade_recipe.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'shade_recipe list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: shade_recipe.uuid,
			name: shade_recipe.name,
			sub_streat: shade_recipe.sub_streat,
			created_by: shade_recipe.created_by,
			created_by_name: hrSchema.users.name,
			created_at: shade_recipe.created_at,
			updated_at: shade_recipe.updated_at,
			remarks: shade_recipe.remarks,
		})
		.from(shade_recipe)
		.leftJoin(
			hrSchema.users,
			eq(shade_recipe.created_by, hrSchema.users.uuid)
		)
		.where(eq(shade_recipe.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'shade_recipe',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
