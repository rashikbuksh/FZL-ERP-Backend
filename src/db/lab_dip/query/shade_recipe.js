import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { shade_recipe, shade_recipe_entry } from '../schema.js';

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
		.delete(shade_recipe_entry)
		.where(eq(shade_recipe_entry.shade_recipe_uuid, req.params.uuid))

		.then(() =>
			db
				.delete(shade_recipe)
				.where(eq(shade_recipe.uuid, req.params.uuid))
				.returning({ deletedName: shade_recipe.name })
		);

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
			id: shade_recipe.id,
			shade_recipe_id: sql`concat('TSR', to_char(shade_recipe.created_at, 'YY'), '-', LPAD(shade_recipe.id::text, 4, '0'))`,
			sub_streat: shade_recipe.sub_streat,
			lab_status: shade_recipe.lab_status,
			bleaching: shade_recipe.bleaching,
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
			id: shade_recipe.id,
			shade_recipe_id: sql`concat('TSR', to_char(shade_recipe.created_at, 'YY'), '-', LPAD(shade_recipe.id::text, 4, '0'))`,
			sub_streat: shade_recipe.sub_streat,
			lab_status: shade_recipe.lab_status,
			bleaching: shade_recipe.bleaching,
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

export async function selectShadeRecipeDetailsByShadeRecipeUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;
	const { shade_recipe_uuid } = req.params;
	try {
		const api = await createApi(req);

		const fetchData = async (endpoint) =>
			await api.get(`${endpoint}/${shade_recipe_uuid}`);

		const [shade_recipe, shade_recipe_entry] = await Promise.all([
			fetchData('/lab-dip/shade-recipe'),
			fetchData('/lab-dip/shade-recipe-entry/by'),
		]);

		const response = {
			...shade_recipe?.data?.data[0],
			shade_recipe_entry: shade_recipe_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Order Description Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
