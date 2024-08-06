import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { factory } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db.insert(factory).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.update(factory)
		.set(req.body)
		.where(eq(factory.uuid, req.params.uuid))
		.returning();
	const toast = {
		status: 201,
		type: 'update',
		msg: 'Factory updated',
	};
	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.delete(factory)
		.where(eq(factory.uuid, req.params.uuid))
		.returning();
	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Factory deleted',
	};
	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(factory);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Factory list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.select()
		.from(factory)
		.where(eq(factory.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Factory',
	};
	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}
