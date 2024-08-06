import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { properties } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.insert(properties)
		.values(req.body)
		.returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.update(properties)
		.set(req.body)
		.where(eq(properties.uuid, req.params.uuid))
		.returning();
	const toast = {
		status: 201,
		type: 'update',
		msg: 'Properties updated',
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.delete(properties)
		.where(eq(properties.uuid, req.params.uuid))
		.returning();
	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Properties deleted',
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(properties);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Property list',
	};
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.select()
		.from(properties)
		.where(eq(properties.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Property',
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}
