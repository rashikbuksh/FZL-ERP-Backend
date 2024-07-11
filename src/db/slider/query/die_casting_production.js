import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { die_casting_production } from "../../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.insert(die_casting_production)
		.values(req.body)
		.returning();
	handleResponse(dieCastingProductionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.update(die_casting_production)
		.set(req.body)
		.where(eq(die_casting_production.uuid, req.params.uuid))
		.returning();
	handleResponse(dieCastingProductionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.delete(die_casting_production)
		.where(eq(die_casting_production.uuid, req.params.uuid))
		.returning();
	handleResponse(dieCastingProductionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(die_casting_production);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.select()
		.from(die_casting_production)
		.where(eq(die_casting_production.uuid, req.params.uuid));
	handleResponse(dieCastingProductionPromise, res, next);
}
