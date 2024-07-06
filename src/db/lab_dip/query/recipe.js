import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { recipe } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db.insert(recipe).values(req.body).returning();
	handleResponse(recipePromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.update(recipe)
		.set(req.body)
		.where(eq(recipe.uuid, req.params.uuid))
		.returning();
	handleResponse(recipePromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.delete(recipe)
		.where(eq(recipe.uuid, req.params.uuid))
		.returning();
	handleResponse(recipePromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(recipe);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipePromise = db
		.select()
		.from(recipe)
		.where(eq(recipe.uuid, req.params.uuid));
	handleResponse(recipePromise, res, next);
}
