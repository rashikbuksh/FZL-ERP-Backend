import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { die_casting, trx_against_stock } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(trx_against_stock)
		.values(req.body)
		.returning({ insertedId: trx_against_stock.uuid });

	try {
		const data = await resultPromise;
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

	const resultPromise = db
		.update(trx_against_stock)
		.set(req.body)
		.where(eq(trx_against_stock.uuid, req.params.uuid))
		.returning({ updatedId: trx_against_stock.uuid });

	try {
		const data = await resultPromise;
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

	const resultPromise = db
		.delete(trx_against_stock)
		.where(eq(trx_against_stock.uuid, req.params.uuid))
		.returning({ deletedId: trx_against_stock.uuid });

	try {
		const data = await resultPromise;
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
			uuid: trx_against_stock.uuid,
			die_casting_uuid: trx_against_stock.die_casting_uuid,
			quantity: trx_against_stock.quantity,
			created_by: trx_against_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: trx_against_stock.created_at,
			updated_at: trx_against_stock.updated_at,
			remarks: trx_against_stock.remarks,
		})
		.from(trx_against_stock)
		.leftJoin(
			hrSchema.users,
			eq(trx_against_stock.created_by, hrSchema.users.uuid)
		);
	const toast = {
		status: 201,
		type: 'select_all',
		message: 'Trx against stock list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: trx_against_stock.uuid,
			die_casting_uuid: trx_against_stock.die_casting_uuid,
			quantity: trx_against_stock.quantity,
			created_by: trx_against_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: trx_against_stock.created_at,
			updated_at: trx_against_stock.updated_at,
			remarks: trx_against_stock.remarks,
		})
		.from(trx_against_stock)
		.leftJoin(
			hrSchema.users,
			eq(trx_against_stock.created_by, hrSchema.users.uuid)
		)
		.where(eq(trx_against_stock.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'select',
			message: `${data[0].uuid} selected`,
		};
		return await res.status(201).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
