import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { packing_list_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.insert(packing_list_entry)
		.values(req.body)
		.returning();
	handleResponse(packing_list_entryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.update(packing_list_entry)
		.set(req.body)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(packing_list_entryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.delete(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(packing_list_entryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(packing_list_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.select()
		.from(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid));
	handleResponse(packing_list_entryPromise, res, next);
}
