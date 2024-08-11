import { and, eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import hr, * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { info, stock, trx } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.insert(trx)
		.values(req.body)
		.returning({ insertedId: trx.material_uuid });

	try {
		const data = await trxPromise;
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

	const trxPromise = db
		.update(trx)
		.set(req.body)
		.where(eq(trx.uuid, req.params.uuid))
		.returning({ updatedId: trx.material_uuid });

	try {
		const data = await trxPromise;
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

	const trxPromise = db
		.delete(trx)
		.where(eq(trx.uuid, req.params.uuid))
		.returning({ deletedId: trx.material_uuid });

	try {
		const data = await trxPromise;
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
			uuid: trx.uuid,
			material_uuid: trx.material_uuid,
			material_name: info.name,
			trx_to: trx.trx_to,
			trx_quantity: trx.trx_quantity,
			created_by: trx.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: trx.created_at,
			updated_at: trx.updated_at,
			remarks: trx.remarks,
		})
		.from(trx)
		.leftJoin(info, eq(trx.material_uuid, info.uuid))
		.leftJoin(hrSchema.users, eq(trx.created_by, hrSchema.users.uuid))
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
		message: 'Trx list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.select({
			uuid: trx.uuid,
			material_uuid: trx.material_uuid,
			material_name: info.name,
			trx_to: trx.trx_to,
			trx_quantity: trx.trx_quantity,
			created_by: trx.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: trx.created_at,
			updated_at: trx.updated_at,
			remarks: trx.remarks,
		})
		.from(trx)
		.leftJoin(info, eq(trx.material_uuid, info.uuid))
		.leftJoin(hrSchema.users, eq(trx.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department.uuid)
		)
		.where(eq(trx.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Trx',
	};

	handleResponse({ promise: trxPromise, res, next, ...toast });
}

export async function selectMaterialTrxByMaterialTrxTo(req, res, next) {
	const { material_uuid, trx_to } = req.params;

	const trxPromise = await db
		.select({
			uuid: trx.uuid,
			material_uuid: trx.material_uuid,
			material_name: info.name,
			trx_to: trx.trx_to,
			trx_quantity: trx.trx_quantity,
			created_by: trx.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: trx.created_at,
			updated_at: trx.updated_at,
			remarks: trx.remarks,
		})
		.from(trx)
		.leftJoin(info, eq(trx.material_uuid, info.uuid))
		.leftJoin(hrSchema.users, eq(trx.created_by, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department.uuid)
		)
		.where(
			and(eq(stock.material_uuid, material_uuid), eq(trx.trx_to, trx_to))
		);

	const toast = {
		status: 200,
		type: 'select',
		message: 'Trx',
	};

	handleResponse({ promise: trxPromise, res, next, ...toast });
}
