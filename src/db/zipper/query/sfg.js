import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { sfg } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db.insert(sfg).values(req.body).returning();
	handleResponse(sfgPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.update(sfg)
		.set(req.body)
		.where(eq(sfg.uuid, req.params.uuid))
		.returning();
	handleResponse(sfgPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.delete(sfg)
		.where(eq(sfg.uuid, req.params.uuid))
		.returning();
	handleResponse(sfgPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(sfg);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.select()
		.from(sfg)
		.where(eq(sfg.uuid, req.params.uuid));
	handleResponse(sfgPromise, res, next);
}
