import { and, eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import hr, * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { info, stock, trx } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db.insert(trx).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.material_name} created`,
	};

	handleResponse({ promise: trxPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.update(trx)
		.set(req.body)
		.where(eq(trx.uuid, req.params.uuid))
		.returning({ updatedName: trx.material_name });

	trxPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: trxPromise,
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
				msg: `Error updating trx - ${error.message}`,
			};

			handleResponse({
				promise: trxPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.delete(trx)
		.where(eq(trx.uuid, req.params.uuid))
		.returning({ deletedName: trx.material_name });

	trxPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: trxPromise,
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
				msg: `Error deleting trx - ${error.message}`,
			};

			handleResponse({
				promise: trxPromise,
				res,
				next,
				...toast,
			});
		});
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
		.leftJoin(info)
		.on(trx.material_uuid.equals(info.uuid))
		.leftJoin(hrSchema.users)
		.on(trx.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(hrSchema.users.department_uuid.equals(hrSchema.department.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Trx list',
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
		.leftJoin(info)
		.on(trx.material_uuid.equals(info.uuid))
		.leftJoin(hrSchema.users)
		.on(trx.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(hrSchema.users.department_uuid.equals(hrSchema.department.uuid))
		.where(eq(trx.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Trx',
	};

	handleResponse({ promise: trxPromise, res, next, ...toast });
}

export async function selectMaterialTrxByMaterialTrxTo(req, res, next) {
	const { material_uuid, trx_to } = req.params;

	const trxPromise = await db
		.select({
			uuid: trx.uuid,
			material_uuid: trx.material_uuid,
			stock: stock.stock,
			material_name: info.name,
			unit: info.unit,
			trx_to: trx.trx_to,
			quantity: trx.trx_quantity,
			created_by: trx.created_by,
			created_by_name: users.name,
			created_at: trx.created_at,
			updated_at: trx.updated_at,
			remarks: trx.remarks,
		})
		.from(trx)
		.innerJoin(stock, eq(stock.material_uuid, trx.material_uuid))
		.innerJoin(info, eq(info.uuid, trx.material_uuid))
		.innerJoin(users, eq(users.uuid, trx.created_by))
		.where(
			and(eq(stock.material_uuid, material_uuid), eq(trx.trx_to, trx_to))
		);

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Trx',
	};

	handleResponse({ promise: trxPromise, res, next, ...toast });
}
