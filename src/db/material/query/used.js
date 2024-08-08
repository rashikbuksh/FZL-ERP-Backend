import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import material, { info, used } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(used).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.material_name} created`,
	};

	handleResponse({ promise: usedPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.update(used)
		.set(req.body)
		.where(eq(used.uuid, req.params.uuid))
		.returning({ updatedName: used.material_name });

	usedPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: usedPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating used - ${error.message}`,
			};

			handleResponse({
				promise: usedPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.delete(used)
		.where(eq(used.uuid, req.params.uuid))
		.returning({ deletedName: used.material_name });

	usedPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: usedPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting used - ${error.message}`,
			};

			handleResponse({
				promise: usedPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			section: used.section,
			used_quantity: used.used_quantity,
			wastage: used.wastage,
			created_by: used.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation,
			user_department: hrSchema.department,
			created_at: used.created_at,
			updated_at: used.updated_at,
			remarks: used.remarks,
		})
		.from(used)
		.leftJoin(info)
		.on(used.material_uuid.equals(info.uuid))
		.leftJoin(hrSchema.users)
		.on(used.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(hrSchema.users.department_uuid.equals(hrSchema.department.uuid));
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Used list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			section: used.section,
			used_quantity: used.used_quantity,
			wastage: used.wastage,
			created_by: used.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation,
			user_department: hrSchema.department,
			created_at: used.created_at,
			updated_at: used.updated_at,
			remarks: used.remarks,
		})
		.from(used)
		.leftJoin(info)
		.on(used.material_uuid.equals(info.uuid))
		.leftJoin(hrSchema.users)
		.on(used.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(hrSchema.users.department_uuid.equals(hrSchema.department.uuid))
		.where(eq(used.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Used',
	};

	handleResponse({ promise: usedPromise, res, next, ...toast });
}
