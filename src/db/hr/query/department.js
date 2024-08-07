import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { department } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.insert(department)
		.values(req.body)
		.returning({ insertedName: department.department });

	departmentPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'create',
				msg: `${result[0].insertedName} created`,
			};

			handleResponse({
				promise: departmentPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'create',
				msg: `Error creating department - ${error.message}`,
			};

			handleResponse({
				promise: departmentPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.update(department)
		.set(req.body)
		.where(eq(department.uuid, req.params.uuid))
		.returning({ updatedName: department.department });

	departmentPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: departmentPromise,
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
				promise: departmentPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.delete(department)
		.where(eq(department.uuid, req.params.uuid))
		.returning({ deletedName: department.department });

	departmentPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: departmentPromise,
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
				promise: departmentPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(department);

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

	const departmentPromise = db
		.select()
		.from(department)
		.where(eq(department.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Designation',
	};

	handleResponse({
		promise: departmentPromise,
		res,
		next,
		...toast,
	});
}
