import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { stock_to_sfg } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(stock_to_sfg).values(req.body).returning();
	handleResponse(usedPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.update(stock_to_sfg)
		.set(req.body)
		.where(eq(stock_to_sfg.uuid, req.params.uuid))
		.returning();
	handleResponse(usedPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.delete(stock_to_sfg)
		.where(eq(stock_to_sfg.uuid, req.params.uuid))
		.returning();
	handleResponse(usedPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(stock_to_sfg);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select()
		.from(stock_to_sfg)
		.where(eq(stock_to_sfg.uuid, req.params.uuid));
	handleResponse(usedPromise, res, next);
}
