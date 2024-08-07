import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { designation } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.insert(designation)
		.values(req.body)
		.returning({ insertedName: designation.designation });

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: designationPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.update(designation)
		.set(req.body)
		.where(eq(designation.uuid, req.params.uuid))
		.returning({ updatedName: designation.designation });

	designationPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: designationPromise,
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
				msg: `Error updating designation - ${error.message}`,
			};

			handleResponse({
				promise: designationPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.delete(designation)
		.where(eq(designation.uuid, req.params.uuid))
		.returning({ deletedName: designation.designation });

	designationPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: designationPromise,
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
				msg: `Error deleting designation - ${error.message}`,
			};

			handleResponse({
				promise: designationPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(designation);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Designation list',
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

	const designationPromise = db
		.select()
		.from(designation)
		.where(eq(designation.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Designation',
	};

	handleResponse({
		promise: designationPromise,
		res,
		next,
		...toast,
	});
}
