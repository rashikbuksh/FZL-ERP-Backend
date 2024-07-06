import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { marketing } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db.insert(marketing).values(req.body).returning();
	handleResponse(marketingPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.update(marketing)
		.set(req.body)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning();
	handleResponse(marketingPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.delete(marketing)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning();
	handleResponse(marketingPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(marketing);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.select()
		.from(marketing)
		.where(eq(marketing.uuid, req.params.uuid));
	handleResponse(marketingPromise, res, next);
}
