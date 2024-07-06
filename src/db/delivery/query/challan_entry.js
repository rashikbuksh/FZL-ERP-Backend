import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { challan_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.insert(challan_entry)
		.values(req.body)
		.returning();
	handleResponse(challan_entryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.update(challan_entry)
		.set(req.body)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(challan_entryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.delete(challan_entry)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(challan_entryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(challan_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.select()
		.from(challan_entry)
		.where(eq(challan_entry.uuid, req.params.uuid));
	handleResponse(challan_entryPromise, res, next);
}
