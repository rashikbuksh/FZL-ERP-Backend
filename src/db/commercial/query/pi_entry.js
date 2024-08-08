import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { pi_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db.insert(pi_entry).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: pi_entryPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.update(pi_entry)
		.set(req.body)
		.where(eq(pi_entry.uuid, req.params.uuid))
		.returning({ updatedName: pi_entry.name });

	pi_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: pi_entryPromise,
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
				msg: `Error updating pi_entry - ${error.message}`,
			};

			handleResponse({
				promise: pi_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.delete(pi_entry)
		.where(eq(pi_entry.uuid, req.params.uuid))
		.returning({ deletedName: pi_entry.name });

	pi_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: pi_entryPromise,
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
				msg: `Error deleting pi_entry - ${error.message}`,
			};

			handleResponse({
				promise: pi_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: pi_entry.uuid,
			pi_uuid: pi_entry.pi_uuid,
			sfg_uuid: pi_entry.sfg_uuid,
			pi_quantity: pi_entry.pi_quantity,
			created_at: pi_entry.created_at,
			updated_at: pi_entry.updated_at,
			remarks: pi_entry.remarks,
		})
		.from(pi_entry)
		.orderBy(pi_entry.created_at, 'desc');

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'pi_entry list',
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

	const pi_entryPromise = db
		.select({
			uuid: pi_entry.uuid,
			pi_uuid: pi_entry.pi_uuid,
			sfg_uuid: pi_entry.sfg_uuid,
			pi_quantity: pi_entry.pi_quantity,
			created_at: pi_entry.created_at,
			updated_at: pi_entry.updated_at,
			remarks: pi_entry.remarks,
		})
		.from(pi_entry)
		.where(eq(pi_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'pi_entry',
	};
	handleResponse({
		promise: pi_entryPromise,
		res,
		next,
		...toast,
	});
}
