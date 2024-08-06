import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { merchandiser } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.insert(merchandiser)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.update(merchandiser)
		.set(req.body)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 201,
		type: 'update',
		msg: 'Merchandiser updated',
	};

	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.delete(merchandiser)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Merchandiser deleted',
	};

	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(merchandiser);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Merchandiser list',
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

	const merchandiserPromise = db
		.select()
		.from(merchandiser)
		.where(eq(merchandiser.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Merchandiser',
	};
	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}
