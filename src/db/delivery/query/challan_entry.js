import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { challan_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.insert(challan_entry)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: challan_entryPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.update(challan_entry)
		.set(req.body)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning({ updatedName: challan_entry.name });

	challan_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: challan_entryPromise,
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
				msg: `Error updating challan_entry - ${error.message}`,
			};

			handleResponse({
				promise: challan_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.delete(challan_entry)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning({ deletedName: challan_entry.name });

	challan_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} removed`,
			};

			handleResponse({
				promise: challan_entryPromise,
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
				msg: `Error removing challan_entry - ${error.message}`,
			};

			handleResponse({
				promise: challan_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(challan_entry);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Challan_entry list',
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

	const challan_entryPromise = db
		.select()
		.from(challan_entry)
		.where(eq(challan_entry.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Challan_entry',
	};

	handleResponse({
		promise: challan_entryPromise,
		res,
		next,
		...toast,
	});
}
