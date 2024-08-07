import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { recipe_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.insert(recipe_entry)
		.values(req.body)
		.returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: recipe_entryPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.update(recipe_entry)
		.set(req.body)
		.where(eq(recipe_entry.uuid, req.params.uuid))
		.returning({ updatedName: recipe_entry.name });

	recipe_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: recipe_entryPromise,
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
				msg: `Error updating recipe_entry - ${error.message}`,
			};

			handleResponse({
				promise: recipe_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.delete(recipe_entry)
		.where(eq(recipe_entry.uuid, req.params.uuid))
		.returning({ deletedName: recipe_entry.name });

	recipe_entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: recipe_entryPromise,
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
				msg: `Error deleting recipe_entry - ${error.message}`,
			};

			handleResponse({
				promise: recipe_entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(recipe_entry);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Recipe_entry list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.select()
		.from(recipe_entry)
		.where(eq(recipe_entry.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Recipe_entry',
	};
	handleResponse({ promise: recipe_entryPromise, res, next, ...toast });
}
