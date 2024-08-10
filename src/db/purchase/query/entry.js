import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.insert(entry)
		.values(req.body)
		.returning({ insertedId: entry.uuid });

	try {
		const data = await entryPromise;
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

	const entryPromise = db
		.update(entry)
		.set(req.body)
		.where(eq(entry.uuid, req.params.uuid))
		.returning({ updatedId: entry.uuid });

	try {
		const data = await entryPromise;
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
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.delete(entry)
		.where(eq(entry.uuid, req.params.uuid))
		.returning({ deletedId: entry.uuid });

	try {
		const data = await entryPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_info_uuid: entry.material_info_uuid,
			material_name: materialSchema.info.name,
			quantity: entry.quantity,
			price: entry.price,
			created_by: entry.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(
			materialSchema.info,
			eq(entry.material_info_uuid, materialSchema.info.uuid)
		)
		.leftJoin(hrSchema.users, eq(entry.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department)
		);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Entry list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_info_uuid: entry.material_info_uuid,
			material_name: materialSchema.info.name,
			quantity: entry.quantity,
			price: entry.price,
			created_by: entry.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(
			materialSchema.info,
			eq(entry.material_info_uuid, materialSchema.info.uuid)
		)
		.leftJoin(hrSchema.users, eq(entry.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department.uuid)
		)
		.where(eq(entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Entry',
	};

	handleResponse({ promise: entryPromise, res, next, ...toast });
}
