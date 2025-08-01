import { and, desc, eq, gt, lte, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import * as threadSchema from '../../thread/schema.js';
import { dyes_category, programs } from '../../thread/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as zipperSchema from '../../zipper/schema.js';
import { info, info_entry, recipe } from '../schema.js';

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
	if (!(await validateRequest(req, next))) return;

	const { type } = req.query;

	const resultPromise = db
		.select({
			uuid: recipe.uuid,
			id: recipe.id,
			recipe_id: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text)`,
			lab_dip_info_uuid: info_entry.lab_dip_info_uuid,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', info.id::text)`,
			order_info_uuid: info.order_info_uuid,
			thread_order_info_uuid: info.thread_order_info_uuid,
			name: recipe.name,
			approved: info_entry.approved,
			status: recipe.status,
			sub_streat: recipe.sub_streat,
			bleaching: recipe.bleaching,
			remarks: recipe.remarks,
			approved_date: info_entry.approved_date,
			created_at: recipe.created_at,
			updated_at: recipe.updated_at,
			created_by: recipe.created_by,
			created_by_name: hrSchema.users.name,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(info_entry, eq(recipe.uuid, info_entry.recipe_uuid))
		.leftJoin(info, eq(info_entry.lab_dip_info_uuid, info.uuid))
		.where(type ? eq(recipe.sub_streat, type) : true)
		.orderBy(desc(recipe.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe list',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.select({
			uuid: recipe.uuid,
			id: recipe.id,
			recipe_id: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text)`,
			lab_dip_info_uuid: info_entry.lab_dip_info_uuid,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', info.id::text)`,
			order_info_uuid: info.order_info_uuid,
			thread_order_info_uuid: info.thread_order_info_uuid,
			name: recipe.name,
			approved: info_entry.approved,
			status: recipe.status,
			sub_streat: recipe.sub_streat,
			bleaching: recipe.bleaching,
			remarks: recipe.remarks,
			approved_date: info_entry.approved_date,
			created_at: recipe.created_at,
			updated_at: recipe.updated_at,
			created_by: recipe.created_by,
			created_by_name: hrSchema.users.name,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(info_entry, eq(recipe.uuid, info_entry.recipe_uuid))
		.leftJoin(info, eq(info_entry.lab_dip_info_uuid, info.uuid))
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

		const { bleaching } = recipe?.data?.data;

		const sum = recipe_entry?.data?.data.reduce(
			(acc, { quantity }) => acc + Number(quantity),
			0
		);
		let programsData = [];

		const dataPromise = db
			.select({
				uuid: programs.uuid,
				dyes_category_uuid: programs.dyes_category_uuid,
				dyes_category_name: dyes_category.name,
				material_uuid: programs.material_uuid,
				material_name: materialSchema.info.name,
				dyes_category_id: dyes_category.id,
				bleaching_program: dyes_category.bleaching,
				percentage: dyes_category.upto_percentage,
				quantity: decimalToNumber(programs.quantity),
				created_by: programs.created_by,
				created_by_name: hrSchema.users.name,
				created_at: programs.created_at,
				updated_at: programs.updated_at,
				remarks: programs.remarks,
			})
			.from(programs)
			.leftJoin(
				dyes_category,
				eq(programs.dyes_category_uuid, dyes_category.uuid)
			)
			.leftJoin(
				materialSchema.info,
				eq(programs.material_uuid, materialSchema.info.uuid)
			)
			.leftJoin(
				hrSchema.users,
				eq(programs.created_by, hrSchema.users.uuid)
			)
			.where(
				or(
					and(
						eq(bleaching, dyes_category.bleaching),
						gt(sum, 1.5),
						gt(dyes_category.upto_percentage, 1.5)
					),
					and(
						eq(bleaching, dyes_category.bleaching),
						gt(sum, 0), // 0.5
						lte(sum, 1.5),
						gt(dyes_category.upto_percentage, 0), // 0.5
						lte(dyes_category.upto_percentage, 1.5)
					)
					// and(
					// 	eq(bleaching, dyes_category.bleaching),
					// 	gt(sum, 0),
					// 	lte(sum, 0.5),
					// 	gt(dyes_category.upto_percentage, 0),
					// 	lte(dyes_category.upto_percentage, 0.5)
					// )
				)
			)
			.orderBy(desc(materialSchema.info.name));

		programsData = await dataPromise;

		const response = {
			...recipe?.data?.data,
			recipe_entry: recipe_entry?.data?.data || [],
			programs: programsData || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe Details Full',
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
			recipe_name: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text, ' - ', recipe.name )`,
			status: recipe.status,
			approved: info_entry.approved,
			recipe_created_at: recipe.created_at,
			recipe_updated_at: recipe.updated_at,
			approved_date: info_entry.approved_date,
			is_pps_req: info_entry.is_pps_req,
			is_pps_req_date: info_entry.is_pps_req_date,
			info_entry_uuid: info_entry.uuid,
			lad_dip_info_uuid: info_entry.lab_dip_info_uuid,
			info_entry_created_at: info_entry.created_at,
			info_entry_updated_at: info_entry.updated_at,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(info_entry, eq(recipe.uuid, info_entry.recipe_uuid))
		.leftJoin(info, eq(info_entry.lab_dip_info_uuid, info.uuid))
		.leftJoin(
			zipperSchema.order_info,
			eq(info.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.where(eq(info_entry.lab_dip_info_uuid, req.params.lab_dip_info_uuid));

	try {
		const data = await recipePromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Recipe',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
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
			updatedName: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text, ' - ', recipe.name )`,
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
			updatedName: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text, ' - ', recipe.name )`,
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
