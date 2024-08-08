import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { packing_list } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.insert(packing_list)
		.values(req.body)
		.returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: packing_listPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.update(packing_list)
		.set(req.body)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({ updatedName: packing_list.name });

	packing_listPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: packing_listPromise,
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
				msg: `Error updating packing_list - ${error.message}`,
			};

			handleResponse({
				promise: packing_listPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.delete(packing_list)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({ deletedName: packing_list.name });

	packing_listPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: packing_listPromise,
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
				msg: `Error deleting packing_list - ${error.message}`,
			};

			handleResponse({
				promise: packing_listPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(packing_list);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Packing list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.select()
		.from(packing_list)
		.where(eq(packing_list.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Packing list',
	};
	handleResponse({
		promise: packing_listPromise,
		res,
		next,
		...toast,
	});
}
