import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { order_description } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.insert(order_description)
		.values(req.body)
		.returning();
	handleResponse(orderDescriptionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.update(order_description)
		.set(req.body)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning();
	handleResponse(orderDescriptionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.delete(order_description)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning();
	handleResponse(orderDescriptionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(order_description);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.select()
		.from(order_description)
		.where(eq(order_description.uuid, req.params.uuid));
	handleResponse(orderDescriptionPromise, res, next);
}
