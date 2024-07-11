import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { batch_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.insert(batch_entry)
		.values(req.body)
		.returning();
	handleResponse(batchEntryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.update(batch_entry)
		.set(req.body)
		.where(eq(batch_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(batchEntryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.delete(batch_entry)
		.where(eq(batch_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(batchEntryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(batch_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.select()
		.from(batch_entry)
		.where(eq(batch_entry.uuid, req.params.uuid));
	handleResponse(batchEntryPromise, res, next);
}
