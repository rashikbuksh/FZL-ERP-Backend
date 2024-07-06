import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { order_entry } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.insert(order_entry)
		.values(req.body)
		.returning();
	handleResponse(orderEntryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.update(order_entry)
		.set(req.body)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(orderEntryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning();
	handleResponse(orderEntryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(order_entry);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.select()
		.from(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid));
	handleResponse(orderEntryPromise, res, next);
}
