import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { pi } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db.insert(pi).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: piPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.update(pi)
		.set(req.body)
		.where(eq(pi.uuid, req.params.uuid))
		.returning({ updatedName: pi.name });

	piPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: piPromise,
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
				msg: `Error updating pi - ${error.message}`,
			};

			handleResponse({
				promise: piPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.delete(pi)
		.where(eq(pi.uuid, req.params.uuid))
		.returning({ deletedName: pi.name });

	piPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: piPromise,
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
				type: 'delete',
				msg: `Error deleting pi - ${error.message}`,
			};

			handleResponse({
				promise: piPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(pi);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Pi list',
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

	const piPromise = db.select().from(pi).where(eq(pi.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Pi',
	};

	handleResponse({
		promise: piPromise,
		res,
		next,
		...toast,
	});
}
