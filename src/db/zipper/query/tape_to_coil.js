import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { tape_to_coil } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.insert(tape_to_coil)
		.values(req.body)
		.returning();
	handleResponse(tapeToCoilPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.update(tape_to_coil)
		.set(req.body)
		.where(eq(tape_to_coil.uuid, req.params.uuid))
		.returning();
	handleResponse(tapeToCoilPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.delete(tape_to_coil)
		.where(eq(tape_to_coil.uuid, req.params.uuid))
		.returning();
	handleResponse(tapeToCoilPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(tape_to_coil);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.select()
		.from(tape_to_coil)
		.where(eq(tape_to_coil.uuid, req.params.uuid));
	handleResponse(tapeToCoilPromise, res, next);
}
