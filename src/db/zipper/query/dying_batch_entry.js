import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { dying_batch_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchEntryPromise = db
		.insert(dying_batch_entry)
		.values(req.body)
		.returning();
	handleResponse(dyingBatchEntryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchEntryPromise = db
		.update(dying_batch_entry)
		.set(req.body)
		.where(eq(dying_batch_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(dyingBatchEntryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchEntryPromise = db
		.delete(dying_batch_entry)
		.where(eq(dying_batch_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(dyingBatchEntryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(dying_batch_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchEntryPromise = db
		.select()
		.from(dying_batch_entry)
		.where(eq(dying_batch_entry.uuid, req.params.uuid));
	handleResponse(dyingBatchEntryPromise, res, next);
}
