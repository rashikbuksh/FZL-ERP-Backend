import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { tape_coil_production } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.insert(tape_coil_production)
		.values(req.body)
		.returning();
	handleResponse(tapeCoilProductionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.update(tape_coil_production)
		.set(req.body)
		.where(eq(tape_coil_production.uuid, req.params.uuid))
		.returning();
	handleResponse(tapeCoilProductionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.delete(tape_coil_production)
		.where(eq(tape_coil_production.uuid, req.params.uuid))
		.returning();
	handleResponse(tapeCoilProductionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(tape_coil_production);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.select()
		.from(tape_coil_production)
		.where(eq(tape_coil_production.uuid, req.params.uuid));
	handleResponse(tapeCoilProductionPromise, res, next);
}
