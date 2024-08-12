import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { die_casting, die_casting_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingTransactionPromise = db
		.insert(die_casting_transaction)
		.values(req.body)
		.returning({ insertedId: die_casting_transaction.uuid });
	try {
		const data = await dieCastingTransactionPromise;
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

	const dieCastingTransactionPromise = db
		.update(die_casting_transaction)
		.set(req.body)
		.where(eq(die_casting_transaction.uuid, req.params.uuid))
		.returning({ updatedId: die_casting_transaction.uuid });
	try {
		const data = await dieCastingTransactionPromise;
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

	const dieCastingTransactionPromise = db
		.delete(die_casting_transaction)
		.where(eq(die_casting_transaction.uuid, req.params.uuid))
		.returning({ deletedId: die_casting_transaction.uuid });
	try {
		const data = await dieCastingTransactionPromise;
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
			uuid: die_casting_transaction.uuid,
			die_casting_uuid: die_casting_transaction.die_casting_uuid,
			die_casting_name: die_casting.name,
			stock_uuid: die_casting_transaction.stock_uuid,
			trx_quantity: die_casting_transaction.trx_quantity,
			created_by: die_casting_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_transaction.created_at,
			updated_at: die_casting_transaction.updated_at,
			remarks: die_casting_transaction.remarks,
		})
		.from(die_casting_transaction)
		.leftJoin(
			die_casting,
			eq(die_casting.uuid, die_casting_transaction.die_casting_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, die_casting_transaction.created_by)
		);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'die_casting_transaction list,',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingTransactionPromise = db
		.select({
			uuid: die_casting_transaction.uuid,
			die_casting_uuid: die_casting_transaction.die_casting_uuid,
			die_casting_name: die_casting.name,
			stock_uuid: die_casting_transaction.stock_uuid,
			trx_quantity: die_casting_transaction.trx_quantity,
			created_by: die_casting_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_transaction.created_at,
			updated_at: die_casting_transaction.updated_at,
			remarks: die_casting_transaction.remarks,
		})
		.from(die_casting_transaction)
		.leftJoin(
			die_casting,
			eq(die_casting.uuid, die_casting_transaction.die_casting_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, die_casting_transaction.created_by)
		)
		.where(eq(die_casting_transaction.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'die_casting_transaction',
	};

	handleResponse({
		promise: dieCastingTransactionPromise,
		res,
		next,
		...toast,
	});
}
