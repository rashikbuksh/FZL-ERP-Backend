import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { order_entry, sfg_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.insert(sfg_transaction)
		.values(req.body)
		.returning({ insertedId: sfg_transaction.uuid });

	try {
		const data = await sfgTransactionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.update(sfg_transaction)
		.set(req.body)
		.where(eq(sfg_transaction.uuid, req.params.uuid))
		.returning({ updatedId: sfg_transaction.uuid });

	try {
		const data = await sfgTransactionPromise;
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

	const sfgTransactionPromise = db
		.delete(sfg_transaction)
		.where(eq(sfg_transaction.uuid, req.params.uuid))
		.returning({ deletedId: sfg_transaction.uuid });

	try {
		const data = await sfgTransactionPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: sfg_transaction.uuid,
			order_entry_uuid: sfg_transaction.order_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: order_entry.quantity,
			trx_from: sfg_transaction.trx_from,
			trx_to: sfg_transaction.trx_to,
			trx_quantity: sfg_transaction.trx_quantity,
			slider_item_uuid: sfg_transaction.slider_item_uuid,
			created_by: sfg_transaction.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: sfg_transaction.created_at,
			updated_at: sfg_transaction.updated_at,
		})
		.from(sfg_transaction)
		.leftJoin(
			order_entry,
			eq(sfg_transaction.order_entry_uuid, order_entry.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(sfg_transaction.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'SFG transaction list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}
export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.select({
			uuid: sfg_transaction.uuid,
			order_entry_uuid: sfg_transaction.order_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: order_entry.quantity,
			trx_from: sfg_transaction.trx_from,
			trx_to: sfg_transaction.trx_to,
			trx_quantity: sfg_transaction.trx_quantity,
			slider_item_uuid: sfg_transaction.slider_item_uuid,
			created_by: sfg_transaction.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: sfg_transaction.created_at,
			updated_at: sfg_transaction.updated_at,
		})
		.from(sfg_transaction)
		.leftJoin(
			order_entry,
			eq(sfg_transaction.order_entry_uuid, order_entry.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(sfg_transaction.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		)
		.where(eq(sfg_transaction.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'SFG Transaction',
	};
	handleResponse({
		promise: sfgTransactionPromise,
		res,
		next,
		...toast,
	});
}
