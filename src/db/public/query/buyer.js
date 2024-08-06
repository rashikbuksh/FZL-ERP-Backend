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
		msg: `${req.body.name} created`,
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
		.returning({ updatedName: buyer.name });

	buyerPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: buyerPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating buyer - ${error.message}`,
			};

			handleResponse({
				promise: buyerPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.delete(buyer)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning({ deletedName: buyer.name });

	buyerPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: buyerPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			// for error
			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting buyer - ${error.message}`,
			};

			handleResponse({
				promise: buyerPromise,
				res,
				next,
				...toast,
			});
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
