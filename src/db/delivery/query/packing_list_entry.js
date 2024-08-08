import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { packing_list_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.insert(packing_list_entry)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: packing_list_entryPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.update(packing_list_entry)
		.set(req.body)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ updatedName: packing_list_entry.name });

	packing_list_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: packing_list_entryPromise,
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
				msg: `Error updating packing_list_entry - ${error.message}`,
			};

			handleResponse({
				promise: packing_list_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.delete(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ deletedName: packing_list_entry.name });

	packing_list_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: packing_list_entryPromise,
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
				msg: `Error deleting packing_list_entry - ${error.message}`,
			};

			handleResponse({
				promise: packing_list_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(packing_list_entry);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Packing_list_entry list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.select()
		.from(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Packing_list_entry',
	};
	handleResponse({ promise: packing_list_entryPromise, res, next, ...toast });
}
