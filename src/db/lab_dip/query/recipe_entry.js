import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { recipe, recipe_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.insert(recipe_entry)
		.values(req.body)
		.returning({ insertedId: recipe_entry.uuid });

	try {
		const data = await recipe_entryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.update(recipe_entry)
		.set(req.body)
		.where(eq(recipe_entry.uuid, req.params.uuid))
		.returning({ updatedId: recipe_entry.uuid });

	try {
		const data = await recipe_entryPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.delete(recipe_entry)
		.where(eq(recipe_entry.uuid, req.params.uuid))
		.returning({ deletedId: recipe_entry.uuid });

	try {
		const data = await recipe_entryPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: recipe_entry.uuid,
			recipe_uuid: recipe_entry.recipe_uuid,
			recipe_name: recipe.name,
			color: recipe_entry.color,
			quantity: recipe_entry.quantity,
			created_at: recipe_entry.created_at,
			updated_at: recipe_entry.updated_at,
			remarks: recipe_entry.remarks,
		})
		.from(recipe_entry)
		.leftJoin(recipe, eq(recipe.uuid, recipe_entry.recipe_uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Recipe_entry list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.select({
			uuid: recipe_entry.uuid,
			recipe_uuid: recipe_entry.recipe_uuid,
			recipe_name: recipe.name,
			color: recipe_entry.color,
			quantity: recipe_entry.quantity,
			created_at: recipe_entry.created_at,
			updated_at: recipe_entry.updated_at,
			remarks: recipe_entry.remarks,
		})
		.from(recipe_entry)
		.leftJoin(recipe, eq(recipe.uuid, recipe_entry.recipe_uuid))
		.where(eq(recipe_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Recipe_entry',
	};
	handleResponse({ promise: recipe_entryPromise, res, next, ...toast });
}

export async function selectRecipeEntryByRecipeUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.select({
			uuid: recipe_entry.uuid,
			recipe_uuid: recipe_entry.recipe_uuid,
			recipe_name: recipe.name,
			color: recipe_entry.color,
			quantity: recipe_entry.quantity,
			created_at: recipe_entry.created_at,
			updated_at: recipe_entry.updated_at,
			remarks: recipe_entry.remarks,
		})
		.from(recipe_entry)
		.leftJoin(recipe, eq(recipe.uuid, recipe_entry.recipe_uuid))
		.where(eq(recipe_entry.recipe_uuid, req.params.recipe_uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Recipe_entry',
	};
	handleResponse({ promise: recipe_entryPromise, res, next, ...toast });
}
