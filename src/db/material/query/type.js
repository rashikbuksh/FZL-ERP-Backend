import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { type } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db.insert(type).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({ promise: typePromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.update(type)
		.set(req.body)
		.where(eq(type.uuid, req.params.uuid))
		.returning({ updatedName: type.name });

	typePromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: typePromise,
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
				msg: `Error updating type - ${error.message}`,
			};

			handleResponse({
				promise: typePromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.delete(type)
		.where(eq(type.uuid, req.params.uuid))
		.returning({ deletedName: type.name });

	typePromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: typePromise,
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
				msg: `Error deleting type - ${error.message}`,
			};

			handleResponse({
				promise: typePromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(type);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Type list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.select()
		.from(type)
		.where(eq(type.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Type',
	};

	handleResponse({ promise: typePromise, res, next, ...toast });
}
