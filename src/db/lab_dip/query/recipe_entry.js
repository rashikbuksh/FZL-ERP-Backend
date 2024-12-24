import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { decimalToNumber } from '../../variables.js';
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
			quantity: decimalToNumber(recipe_entry.quantity),
			material_uuid: recipe_entry.material_uuid,
			material_name: materialSchema.info.name,
			unit: materialSchema.info.unit,
			created_at: recipe_entry.created_at,
			updated_at: recipe_entry.updated_at,
			remarks: recipe_entry.remarks,
		})
		.from(recipe_entry)
		.leftJoin(recipe, eq(recipe.uuid, recipe_entry.recipe_uuid))
		.leftJoin(
			materialSchema.info,
			eq(materialSchema.info.uuid, recipe_entry.material_uuid)
		)
		.orderBy(desc(recipe_entry.created_at));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe_entry',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.select({
			uuid: recipe_entry.uuid,
			recipe_uuid: recipe_entry.recipe_uuid,
			recipe_name: recipe.name,
			color: recipe_entry.color,
			quantity: decimalToNumber(recipe_entry.quantity),
			material_uuid: recipe_entry.material_uuid,
			material_name: materialSchema.info.name,
			unit: materialSchema.info.unit,
			created_at: recipe_entry.created_at,
			updated_at: recipe_entry.updated_at,
			remarks: recipe_entry.remarks,
		})
		.from(recipe_entry)
		.leftJoin(recipe, eq(recipe.uuid, recipe_entry.recipe_uuid))
		.leftJoin(
			materialSchema.info,
			eq(materialSchema.info.uuid, recipe_entry.material_uuid)
		)
		.where(eq(recipe_entry.uuid, req.params.uuid));

	try {
		const data = await recipe_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe_entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectRecipeEntryByRecipeUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.select({
			uuid: recipe_entry.uuid,
			recipe_uuid: recipe_entry.recipe_uuid,
			recipe_name: recipe.name,
			color: recipe_entry.color,
			quantity: decimalToNumber(recipe_entry.quantity),
			material_uuid: recipe_entry.material_uuid,
			material_name: materialSchema.info.name,
			unit: materialSchema.info.unit,
			created_at: recipe_entry.created_at,
			updated_at: recipe_entry.updated_at,
			remarks: recipe_entry.remarks,
		})
		.from(recipe_entry)
		.leftJoin(recipe, eq(recipe.uuid, recipe_entry.recipe_uuid))
		.leftJoin(
			materialSchema.info,
			eq(materialSchema.info.uuid, recipe_entry.material_uuid)
		)
		.where(eq(recipe_entry.recipe_uuid, req.params.recipe_uuid))
		.orderBy(desc(materialSchema.info.name));

	try {
		const data = await recipe_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe_entry',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
