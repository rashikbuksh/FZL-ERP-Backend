import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { marketing } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db.insert(marketing).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.update(marketing)
		.set(req.body)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 201,
		type: 'update',
		msg: 'Marketing updated',
	};

	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.delete(marketing)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Marketing deleted',
	};

	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(marketing);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Marketing list',
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

	const marketingPromise = db
		.select()
		.from(marketing)
		.where(eq(marketing.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Marketing',
	};

	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}
