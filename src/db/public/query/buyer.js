import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { buyer } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.insert(buyer)
		.values(req.body)
		.returning({ insertedName: buyer.name });

	try {
		const data = await buyerPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.update(buyer)
		.set(req.body)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning({ updatedName: buyer.name });

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.delete(buyer)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning({ deletedName: buyer.name });

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAll(req, res, next) {
	const buyerPromise = db.select().from(buyer);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Buyer list',
	};

	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.select()
		.from(buyer)
		.where(eq(buyer.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Buyer',
	};

	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}
