import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { lc } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db.insert(lc).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: lcPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.update(lc)
		.set(req.body)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ updatedName: lc.name });
	lcPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			//for error message
			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating lc - ${error.message}`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.delete(lc)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ deletedName: lc.name });
	lcPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting lc - ${error.message}`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(lc);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'lc list',
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

	const lcPromise = db.select().from(lc).where(eq(lc.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'lc',
	};

	handleResponse({
		promise: lcPromise,
		res,
		next,
		...toast,
	});
}
