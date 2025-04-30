import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { coloring_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const coloringTransactionPromise = db
		.insert(coloring_transaction)
		.values(req.body)
		.returning({ insertedId: coloring_transaction.uuid });

	try {
		const data = await coloringTransactionPromise;
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

	const coloringTransactionPromise = db
		.update(coloring_transaction)
		.set(req.body)
		.where(eq(coloring_transaction.uuid, req.params.uuid))
		.returning({ updatedId: coloring_transaction.uuid });
	try {
		const data = await coloringTransactionPromise;
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

	const coloringTransactionPromise = db
		.delete(coloring_transaction)
		.where(eq(coloring_transaction.uuid, req.params.uuid))
		.returning({ deletedId: coloring_transaction.uuid });
	try {
		const data = await coloringTransactionPromise;
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
			uuid: coloring_transaction.uuid,
			stock_uuid: coloring_transaction.stock_uuid,
			order_info_uuid: coloring_transaction.order_info_uuid,
			trx_quantity: decimalToNumber(coloring_transaction.trx_quantity),
			weight: decimalToNumber(coloring_transaction.weight),
			created_by: coloring_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: coloring_transaction.created_at,
			updated_at: coloring_transaction.updated_at,
			remarks: coloring_transaction.remarks,
		})
		.from(coloring_transaction)
		.leftJoin(
			hrSchema.users,
			eq(coloring_transaction.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		)
		.orderBy(desc(coloring_transaction.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All coloring_transactions list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const coloringTransactionPromise = db
		.select({
			uuid: coloring_transaction.uuid,
			stock_uuid: coloring_transaction.stock_uuid,
			order_info_uuid: coloring_transaction.order_info_uuid,
			trx_quantity: decimalToNumber(coloring_transaction.trx_quantity),
			weight: decimalToNumber(coloring_transaction.weight),
			created_by: coloring_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: coloring_transaction.created_at,
			updated_at: coloring_transaction.updated_at,
			remarks: coloring_transaction.remarks,
		})
		.from(coloring_transaction)
		.where(eq(coloring_transaction.uuid, req.params.uuid))
		.leftJoin(
			hrSchema.users,
			eq(coloring_transaction.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		);

	try {
		const data = await coloringTransactionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `${req.params.uuid} selected`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
