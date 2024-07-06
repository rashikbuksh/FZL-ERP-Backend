import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { pi_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db.insert(pi_entry).values(req.body).returning();
	handleResponse(pi_entryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.update(pi_entry)
		.set(req.body)
		.where(eq(pi_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(pi_entryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.delete(pi_entry)
		.where(eq(pi_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(pi_entryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(pi_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.select()
		.from(pi_entry)
		.where(eq(pi_entry.uuid, req.params.uuid));
	handleResponse(pi_entryPromise, res, next);
}
