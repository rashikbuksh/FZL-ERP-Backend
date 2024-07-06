import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { sfg_production } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.insert(sfg_production)
		.values(req.body)
		.returning();
	handleResponse(sfgProductionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.update(sfg_production)
		.set(req.body)
		.where(eq(sfg_production.uuid, req.params.uuid))
		.returning();
	handleResponse(sfgProductionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.delete(sfg_production)
		.where(eq(sfg_production.uuid, req.params.uuid))
		.returning();
	handleResponse(sfgProductionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(sfg_production);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.select()
		.from(sfg_production)
		.where(eq(sfg_production.uuid, req.params.uuid));
	handleResponse(sfgProductionPromise, res, next);
}
