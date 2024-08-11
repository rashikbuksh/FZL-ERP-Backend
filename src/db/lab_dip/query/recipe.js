import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import hr, * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { recipe } from '../schema.js';

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
			lab_dip_info_uuid: recipe.lab_dip_info_uuid,
			name: recipe.name,
			approved: recipe.approved,
			created_by: recipe.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			status: recipe.status,
			created_at: recipe.created_at,
			updated_at: recipe.updated_at,
			remarks: recipe.remarks,
		})
		.from(recipe)
		.leftJoin(hrSchema.users, eq(recipe.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department.uuid)
		);

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
			lab_dip_info_uuid: recipe.lab_dip_info_uuid,
			name: recipe.name,
			approved: recipe.approved,
			created_by: recipe.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			status: recipe.status,
			created_at: recipe.created_at,
			updated_at: recipe.updated_at,
			remarks: recipe.remarks,
		})
		.from(recipe)
		.leftJoin(hr.users, eq(recipe.created_by, hr.users.uuid))
		.leftJoin(
			hr.designation,
			eq(hr.users.designation_uuid, hr.designation.uuid)
		)
		.leftJoin(
			hr.department,
			eq(hr.users.department_uuid, hr.department.uuid)
		)
		.where(eq(recipe.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Recipe',
	};
	handleResponse({ promise: recipePromise, res, next, ...toast });
}
