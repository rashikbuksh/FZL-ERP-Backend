import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { description } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.insert(description)
		.values(req.body)
		.returning();
	handleResponse(descriptionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.update(description)
		.set(req.body)
		.where(eq(description.uuid, req.params.uuid))
		.returning();
	handleResponse(descriptionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.delete(description)
		.where(eq(description.uuid, req.params.uuid))
		.returning();
	handleResponse(descriptionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(description);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.select()
		.from(description)
		.where(eq(description.uuid, req.params.uuid));
	handleResponse(descriptionPromise, res, next);
}
