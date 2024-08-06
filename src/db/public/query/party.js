import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { party } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db.insert(party).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: partyPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.update(party)
		.set(req.body)
		.where(eq(party.uuid, req.params.uuid))
		.returning();
	const toast = {
		status: 201,
		type: 'update',
		msg: 'Party updated',
	};
	handleResponse({
		promise: partyPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.delete(party)
		.where(eq(party.uuid, req.params.uuid))
		.returning();
	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Party deleted',
	};
	handleResponse({
		promise: partyPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(party);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Party list',
	};
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.select()
		.from(party)
		.where(eq(party.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Party',
	};
	handleResponse({
		promise: partyPromise,
		res,
		next,
		...toast,
	});
}
