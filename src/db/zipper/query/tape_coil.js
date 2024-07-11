import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { tape_coil } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db.insert(tape_coil).values(req.body).returning();
	handleResponse(tapeCoilPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.update(tape_coil)
		.set(req.body)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning();
	handleResponse(tapeCoilPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.delete(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning();
	handleResponse(tapeCoilPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(tape_coil);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select()
		.from(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid));
	handleResponse(tapeCoilPromise, res, next);
}
