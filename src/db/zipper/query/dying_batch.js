import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { dying_batch } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.insert(dying_batch)
		.values(req.body)
		.returning();
	handleResponse(dyingBatchPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.update(dying_batch)
		.set(req.body)
		.where(eq(dying_batch.uuid, req.params.uuid))
		.returning();
	handleResponse(dyingBatchPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.delete(dying_batch)
		.where(eq(dying_batch.uuid, req.params.uuid))
		.returning();
	handleResponse(dyingBatchPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(dying_batch);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.select()
		.from(dying_batch)
		.where(eq(dying_batch.uuid, req.params.uuid));
	handleResponse(dyingBatchPromise, res, next);
}
