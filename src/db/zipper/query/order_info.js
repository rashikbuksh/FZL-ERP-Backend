import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { order_info } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db.insert(order_info).values(req.body).returning();
	handleResponse(orderInfoPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.update(order_info)
		.set(req.body)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning();
	handleResponse(orderInfoPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning();
	handleResponse(orderInfoPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(order_info);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.select()
		.from(order_info)
		.where(eq(order_info.uuid, req.params.uuid));
	handleResponse(orderInfoPromise, res, next);
}
