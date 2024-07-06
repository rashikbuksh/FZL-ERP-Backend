import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { challan } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db.insert(challan).values(req.body).returning();
	handleResponse(challanPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db
		.update(challan)
		.set(req.body)
		.where(eq(challan.uuid, req.params.uuid))
		.returning();
	handleResponse(challanPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db
		.delete(challan)
		.where(eq(challan.uuid, req.params.uuid))
		.returning();
	handleResponse(challanPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(challan);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db
		.select()
		.from(challan)
		.where(eq(challan.uuid, req.params.uuid));
	handleResponse(challanPromise, res, next);
}
