import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { dyed_tape_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(dyed_tape_transaction)
		.values(req.body)
		.returning({
			insertedUuid: dyed_tape_transaction.uuid,
		});
	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(dyed_tape_transaction)
		.set(req.body)
		.where(eq(dyed_tape_transaction.uuid, req.params.uuid))
		.returning({ updatedUuid: dyed_tape_transaction.uuid });

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(dyed_tape_transaction)
		.where(eq(dyed_tape_transaction.uuid, req.params.uuid))
		.returning({ deletedUuid: dyed_tape_transaction.uuid });

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: dyed_tape_transaction.uuid,
			order_description_uuid:
				dyed_tape_transaction.order_description_uuid,
			section: dyed_tape_transaction.section,
			trx_quantity: dyed_tape_transaction.trx_quantity,
			created_by: dyed_tape_transaction.created_by,
			created_by_name: dyed_tape_transaction.created_by_name,
			created_at: dyed_tape_transaction.created_at,
			updated_at: dyed_tape_transaction.updated_at,
			remarks: dyed_tape_transaction.remarks,
		})
		.from(dyed_tape_transaction)
		.leftJoin(
			hrSchema.users,
			eq(dyed_tape_transaction.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'dyed_tape_transaction list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: dyed_tape_transaction.uuid,
			order_description_uuid:
				dyed_tape_transaction.order_description_uuid,
			section: dyed_tape_transaction.section,
			trx_quantity: dyed_tape_transaction.trx_quantity,
			created_by: dyed_tape_transaction.created_by,
			created_by_name: dyed_tape_transaction.created_by_name,
			created_at: dyed_tape_transaction.created_at,
			updated_at: dyed_tape_transaction.updated_at,
			remarks: dyed_tape_transaction.remarks,
		})
		.from(dyed_tape_transaction)
		.leftJoin(
			hrSchema.users,
			eq(dyed_tape_transaction.created_by, hrSchema.users.uuid)
		)
		.where(eq(dyed_tape_transaction.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'dyed_tape_transaction',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
