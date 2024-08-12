import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { die_casting_transaction } from '../schema.js';

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
	handleResponse(dieCastingTransactionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(die_casting_transaction);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingTransactionPromise = db
		.select()
		.from(die_casting_transaction)
		.where(eq(die_casting_transaction.uuid, req.params.uuid));
	handleResponse(dieCastingTransactionPromise, res, next);
}
