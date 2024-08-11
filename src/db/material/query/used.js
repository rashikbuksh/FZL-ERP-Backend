import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { info, used } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(used).values(req.body).returning({
		insertedId: used.section,
	});
	try {
		const data = await usedPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.update(used)
		.set(req.body)
		.where(eq(used.uuid, req.params.uuid))
		.returning({ updatedName: used.section });

	try {
		const data = await usedPromise;
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

	const usedPromise = db
		.delete(used)
		.where(eq(used.uuid, req.params.uuid))
		.returning({ deletedName: used.section });

	try {
		const data = await usedPromise;
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
		message: 'Used list',
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
		message: 'Used',
	};

	handleResponse({ promise: usedPromise, res, next, ...toast });
}
