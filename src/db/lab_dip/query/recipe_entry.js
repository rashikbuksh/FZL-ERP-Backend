import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { recipe_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.insert(recipe_entry)
		.values(req.body)
		.returning();
	handleResponse(recipe_entryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.update(recipe_entry)
		.set(req.body)
		.where(eq(recipe_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(recipe_entryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.delete(recipe_entry)
		.where(eq(recipe_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(recipe_entryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(recipe_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entryPromise = db
		.select()
		.from(recipe_entry)
		.where(eq(recipe_entry.uuid, req.params.uuid));
	handleResponse(recipe_entryPromise, res, next);
}
