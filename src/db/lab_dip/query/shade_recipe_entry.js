import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { shade_recipe, shade_recipe_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(shade_recipe_entry)
		.values(req.body)
		.returning({ insertedId: shade_recipe_entry.uuid });

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
		.update(shade_recipe_entry)
		.set(req.body)
		.where(eq(shade_recipe_entry.uuid, req.params.uuid))
		.returning({ updatedId: shade_recipe_entry.uuid });

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
		.delete(shade_recipe_entry)
		.where(eq(shade_recipe_entry.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'remove',
			message: `${data} removed`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: shade_recipe_entry.uuid,
			shade_recipe_uuid: shade_recipe_entry.shade_recipe_uuid,
			shade_recipe_name: shade_recipe.name,
			material_uuid: shade_recipe_entry.material_uuid,
			material_name: materialSchema.info.name,
			quantity: shade_recipe_entry.quantity,
			created_at: shade_recipe_entry.created_at,
			updated_at: shade_recipe_entry.updated_at,
			remarks: shade_recipe_entry.remarks,
		})
		.from(shade_recipe_entry)
		.leftJoin(
			shade_recipe,
			eq(shade_recipe_entry.shade_recipe_uuid, shade_recipe.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(shade_recipe_entry.material_uuid, materialSchema.info.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'shade_recipe_entry list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: shade_recipe_entry.uuid,
			shade_recipe_uuid: shade_recipe_entry.shade_recipe_uuid,
			shade_recipe_name: shade_recipe.name,
			material_uuid: shade_recipe_entry.material_uuid,
			material_name: materialSchema.info.name,
			quantity: shade_recipe_entry.quantity,
			created_at: shade_recipe_entry.created_at,
			updated_at: shade_recipe_entry.updated_at,
			remarks: shade_recipe_entry.remarks,
		})
		.from(shade_recipe_entry)
		.leftJoin(
			shade_recipe,
			eq(shade_recipe_entry.shade_recipe_uuid, shade_recipe.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(shade_recipe_entry.material_uuid, materialSchema.info.uuid)
		)
		.where(eq(shade_recipe_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'shade_recipe_entry',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
