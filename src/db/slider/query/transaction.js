import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { stock, transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.insert(transaction)
		.values(req.body)
		.returning({ insertedSection: transaction.section });

	try {
		const data = await transactionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedSection} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.update(transaction)
		.set(req.body)
		.where(eq(transaction.uuid, req.params.uuid))
		.returning({ updatedSection: transaction.section });
	try {
		const data = await transactionPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedSection} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.delete(transaction)
		.where(eq(transaction.uuid, req.params.uuid))
		.returning({ deletedSection: transaction.section });
	try {
		const data = await transactionPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedSection} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const query = sql`
		SELECT
			transaction.uuid,
			transaction.stock_uuid,
			transaction.section,
			transaction.trx_quantity,
			transaction.created_by,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
			stock.item,
			stock.zipper_number,
			stock.end_type,
			stock.puller_type,
			stock.puller_color,
			order_info.uuid AS order_info_uuid
		FROM
			zipper.transaction
		LEFT JOIN
			zipper.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN
			zipper.v_order_details vod ON stock.order_info_uuid = vod.order_info_uuid
	`;

	const transactionPromise = db.execute(query);

	try {
		const data = await transactionPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Transaction list',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			transaction.uuid,
			transaction.stock_uuid,
			transaction.section,
			transaction.trx_quantity,
			transaction.created_by,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
			stock.item,

			stock.zipper_number,
			stock.end_type,
			stock.puller_type,
			stock.puller_color,
			order_info.uuid AS order_info_uuid
		FROM
			zipper.transaction
		LEFT JOIN
			zipper.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN
			zipper.v_order_details vod ON stock.order_info_uuid = vod.order_info_uuid
		WHERE
			transaction.uuid = ${req.params.uuid}
	`;

	const transactionPromise = db.execute(query);

	try {
		const data = await transactionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'transaction',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
