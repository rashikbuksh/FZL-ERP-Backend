import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as zipperSchema from '../../zipper/schema.js';
import * as threadSchema from '../../thread/schema.js';
import { info, recipe } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

const thread = alias(threadSchema.order_info, 'thread');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.insert(recipe)
		.values(req.body)
		.returning({ insertedName: recipe.name });

	try {
		const data = await recipePromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.update(recipe)
		.set(req.body)
		.where(eq(recipe.uuid, req.params.uuid))
		.returning({ updatedName: recipe.name });

	try {
		const data = await recipePromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.delete(recipe)
		.where(eq(recipe.uuid, req.params.uuid))
		.returning({ deletedName: recipe.name });

	try {
		const data = await recipePromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: recipe.uuid,
			id: recipe.id,
			recipe_id: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'))`,
			lab_dip_info_uuid: recipe.lab_dip_info_uuid,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', LPAD(info.id::text, 4, '0'))`,
			order_info_uuid: info.order_info_uuid,
			thread_order_info_uuid: info.thread_order_info_uuid,
			order_number: sql`
                CASE 
                    WHEN info.order_info_uuid IS NOT NULL THEN CONCAT('Z', to_char(zipper.order_info.created_at, 'YY'), '-', LPAD(zipper.order_info.id::text, 4, '0'))
                    WHEN info.thread_order_info_uuid IS NOT NULL THEN CONCAT('TO', to_char(thread.created_at, 'YY'), '-', LPAD(thread.id::text, 4, '0'))
                    ELSE NULL
                END
            `,
			name: recipe.name,
			approved: recipe.approved,
			created_by: recipe.created_by,
			created_by_name: hrSchema.users.name,
			status: recipe.status,
			sub_streat: recipe.sub_streat,
			bleaching: recipe.bleaching,
			created_at: recipe.created_at,
			updated_at: recipe.updated_at,
			remarks: recipe.remarks,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(info, eq(recipe.lab_dip_info_uuid, info.uuid))
		.leftJoin(
			zipperSchema.order_info,
			eq(info.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(thread, eq(info.thread_order_info_uuid, thread.uuid))
		.orderBy(desc(recipe.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Recipe list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.select({
			uuid: recipe.uuid,
			id: recipe.id,
			recipe_id: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'))`,
			lab_dip_info_uuid: recipe.lab_dip_info_uuid,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', LPAD(info.id::text, 4, '0'))`,
			order_info_uuid: info.order_info_uuid,
			thread_order_info_uuid: info.thread_order_info_uuid,
			order_number: sql`
                CASE 
                    WHEN info.order_info_uuid IS NOT NULL THEN CONCAT('Z', to_char(zipper.order_info.created_at, 'YY'), '-', LPAD(zipper.order_info.id::text, 4, '0'))
                    WHEN info.thread_order_info_uuid IS NOT NULL THEN CONCAT('TO', to_char(thread.created_at, 'YY'), '-', LPAD(thread.id::text, 4, '0'))
                    ELSE NULL
                END
            `,
			name: recipe.name,
			approved: recipe.approved,
			created_by: recipe.created_by,
			created_by_name: hrSchema.users.name,
			status: recipe.status,
			sub_streat: recipe.sub_streat,
			bleaching: recipe.bleaching,
			created_at: recipe.created_at,
			updated_at: recipe.updated_at,
			remarks: recipe.remarks,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(info, eq(recipe.lab_dip_info_uuid, info.uuid))
		.leftJoin(
			zipperSchema.order_info,
			eq(info.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(thread, eq(info.thread_order_info_uuid, thread.uuid))
		.where(eq(recipe.uuid, req.params.uuid));

	try {
		const data = await recipePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe',
		};
		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectRecipeDetailsByRecipeUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { recipe_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${recipe_uuid}`)
				.then((response) => response);

		const [recipe, recipe_entry] = await Promise.all([
			fetchData('/lab-dip/recipe'),
			fetchData('/lab-dip/recipe-entry/by'),
		]);

		const response = {
			...recipe?.data?.data,
			recipe_entry: recipe_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Recipe Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectRecipeByLabDipInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.select({
			recipe_uuid: recipe.uuid,
			recipe_name: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'), ' - ', recipe.name )`,
			status: recipe.status,
			approved: recipe.approved,
			recipe_created_at: recipe.created_at,
			recipe_updated_at: recipe.updated_at,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(info, eq(recipe.lab_dip_info_uuid, info.uuid))
		.leftJoin(
			zipperSchema.order_info,
			eq(info.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.where(eq(recipe.lab_dip_info_uuid, req.params.lab_dip_info_uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Recipe',
	};
	handleResponse({ promise: recipePromise, res, next, ...toast });
}

export async function updateRecipeByLabDipInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { lab_dip_info_uuid, approved, status } = req.body;

	const { recipe_uuid } = req.params;

	const recipePromise = db
		.update(recipe)
		.set({
			lab_dip_info_uuid: lab_dip_info_uuid,
			approved: approved,
			status: status,
		})
		.where(eq(recipe.uuid, recipe_uuid))
		.returning({
			updatedName: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'), ' - ', recipe.name )`,
		});

	try {
		const data = await recipePromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateRecipeWhenRemoveLabDipInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { recipe_uuid } = req.params;

	const recipePromise = db
		.update(recipe)
		.set({ lab_dip_info_uuid: null })
		.where(eq(recipe.uuid, recipe_uuid))
		.returning({
			updatedName: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'), ' - ', recipe.name )`,
		});

	try {
		const data = await recipePromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
