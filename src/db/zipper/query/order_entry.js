import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { order_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.insert(order_entry)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: orderEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.update(order_entry)
		.set(req.body)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 201,
		type: 'update',
		msg: 'Order entry updated',
	};

	handleResponse({
		promise: orderEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Order entry deleted',
	};

	handleResponse({
		promise: orderEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const orderEntryPromise = db.select().from(order_entry);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Order entry list',
	};

	handleResponse({
		promise: orderEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.select()
		.from(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Order Entry',
	};

	handleResponse({
		promise: orderEntryPromise,
		res,
		next,
		...toast,
	});
}
