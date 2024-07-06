import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { used } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(used).values(req.body).returning();
	handleResponse(usedPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.update(used)
		.set(req.body)
		.where(eq(used.uuid, req.params.uuid))
		.returning();
	handleResponse(usedPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.delete(used)
		.where(eq(used.uuid, req.params.uuid))
		.returning();
	handleResponse(usedPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(used);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select()
		.from(used)
		.where(eq(used.uuid, req.params.uuid));
	handleResponse(usedPromise, res, next);
}
