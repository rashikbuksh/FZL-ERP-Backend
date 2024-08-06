import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { properties } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.insert(properties)
		.values(req.body)
		.returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.update(properties)
		.set(req.body)
		.where(eq(properties.uuid, req.params.uuid))
		.returning({ updatedName: properties.name });

	propertiesPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: propertiesPromise,
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
				msg: `Error updating properties - ${error.message}`,
			};

			handleResponse({
				promise: propertiesPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.delete(properties)
		.where(eq(properties.uuid, req.params.uuid))
		.returning({ deletedName: properties.name });

	propertiesPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: propertiesPromise,
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
				msg: `Error deleting properties - ${error.message}`,
			};

			handleResponse({
				promise: propertiesPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(properties);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Property list',
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

	const propertiesPromise = db
		.select()
		.from(properties)
		.where(eq(properties.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Property',
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}
