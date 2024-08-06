import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { order_description } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.insert(order_description)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.update(order_description)
		.set(req.body)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 201,
		type: 'update',
		msg: 'Order Description updated',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.delete(order_description)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Order Description deleted',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const orderDescriptionPromise = db.select().from(order_description);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Order description list',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.select()
		.from(order_description)
		.where(eq(order_description.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Order description',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}
