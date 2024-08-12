import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as zipperSchema from '../../zipper/schema.js';
import { info, stock_to_sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(stock_to_sfg).values(req.body).returning({
		insertedId: stock_to_sfg.material_uuid,
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
		.update(stock_to_sfg)
		.set(req.body)
		.where(eq(stock_to_sfg.uuid, req.params.uuid))
		.returning({ updatedName: stock_to_sfg.material_uuid });

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
		.delete(stock_to_sfg)
		.where(eq(stock_to_sfg.uuid, req.params.uuid))
		.returning({ deletedName: stock_to_sfg.material_uuid });

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
			uuid: stock_to_sfg.uuid,
			material_uuid: stock_to_sfg.material_uuid,
			material_name: info.name,
			order_entry_uuid: stock_to_sfg.order_entry_uuid,
			order_description_uuid:
				zipperSchema.order_entry.order_description_uuid,
			trx_to: stock_to_sfg.trx_to,
			trx_quantity: stock_to_sfg.trx_quantity,
			created_by: stock_to_sfg.created_by,
			created_by_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: stock_to_sfg.created_at,
			updated_at: stock_to_sfg.updated_at,
			remarks: stock_to_sfg.remarks,
		})
		.from(stock_to_sfg)
		.leftJoin(info, eq(stock_to_sfg.material_uuid, info.uuid))
		.leftJoin(
			zipperSchema.order_entry,
			eq(stock_to_sfg.order_entry_uuid, zipperSchema.order_entry.uuid)
		)
		.leftJoin(
			zipperSchema.order_description,
			eq(
				stock_to_sfg.order_description_uuid,
				zipperSchema.order_description.uuid
			)
		)
		.leftJoin(
			hrSchema.users,
			eq(stock_to_sfg.created_by, hrSchema.users.uuid)
		)
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
		message: 'Stock to SFG list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select({
			uuid: stock_to_sfg.uuid,
			material_uuid: stock_to_sfg.material_uuid,
			material_name: info.name,
			order_entry_uuid: stock_to_sfg.order_entry_uuid,
			order_description_uuid:
				zipperSchema.order_entry.order_description_uuid,
			trx_to: stock_to_sfg.trx_to,
			trx_quantity: stock_to_sfg.trx_quantity,
			created_by: stock_to_sfg.created_by,
			created_by_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: stock_to_sfg.created_at,
			updated_at: stock_to_sfg.updated_at,
			remarks: stock_to_sfg.remarks,
		})
		.from(stock_to_sfg)
		.leftJoin(info, eq(stock_to_sfg.material_uuid, info.uuid))
		.leftJoin(
			zipperSchema.order_entry,
			eq(stock_to_sfg.order_entry_uuid, zipperSchema.order_entry.uuid)
		)
		.leftJoin(
			zipperSchema.order_description,
			eq(
				stock_to_sfg.order_description_uuid,
				zipperSchema.order_description.uuid
			)
		)
		.leftJoin(
			hrSchema.users,
			eq(stock_to_sfg.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department.uuid)
		)
		.where(eq(stock_to_sfg.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Stock to SFG',
	};

	handleResponse({ promise: usedPromise, res, next, ...toast });
}
