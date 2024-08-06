import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { buyer } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db.insert(buyer).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: 'Buyer created',
	};

	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.update(buyer)
		.set(req.body)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning();
	handleResponse(buyerPromise, res, next, 201);

	const toast = {
		status: 201,
		type: 'update',
		msg: 'Buyer updated',
	};

	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.delete(buyer)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Buyer deleted',
	};

	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const buyerPromise = db.select().from(buyer);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Buyer list',
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
		msg: 'Buyer',
	};

	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}
