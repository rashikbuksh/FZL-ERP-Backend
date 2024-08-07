import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { recipe } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db.insert(recipe).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: recipePromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.update(recipe)
		.set(req.body)
		.where(eq(recipe.uuid, req.params.uuid))
		.returning({ updatedName: recipe.name });

	recipePromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: recipePromise,
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
				msg: `Error updating recipe - ${error.message}`,
			};

			handleResponse({
				promise: recipePromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.delete(recipe)
		.where(eq(recipe.uuid, req.params.uuid))
		.returning({ deletedName: recipe.name });

	recipePromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: recipePromise,
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
				msg: `Error deleting recipe - ${error.message}`,
			};

			handleResponse({
				promise: recipePromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(recipe);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Recipe list',
	};
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.select()
		.from(recipe)
		.where(eq(recipe.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Recipe',
	};
	handleResponse({ promise: recipePromise, res, next, ...toast });
}
