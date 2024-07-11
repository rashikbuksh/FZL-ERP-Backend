import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { die_casting } from "../../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.insert(die_casting)
		.values(req.body)
		.returning();
	handleResponse(dieCastingPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.update(die_casting)
		.set(req.body)
		.where(eq(die_casting.uuid, req.params.uuid))
		.returning();
	handleResponse(dieCastingPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.delete(die_casting)
		.where(eq(die_casting.uuid, req.params.uuid))
		.returning();
	handleResponse(dieCastingPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(die_casting);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.select()
		.from(die_casting)
		.where(eq(die_casting.uuid, req.params.uuid));
	handleResponse(dieCastingPromise, res, next);
}
