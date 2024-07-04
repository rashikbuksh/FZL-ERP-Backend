import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { designation } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.insert(designation)
		.values(req.body)
		.returning();
	handleResponse(designationPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.update(designation)
		.set(req.body)
		.where(eq(designation.uuid, req.params.uuid))
		.returning();
	handleResponse(designationPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.delete(designation)
		.where(eq(designation.uuid, req.params.uuid))
		.returning();
	handleResponse(designationPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(designation);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.select()
		.from(designation)
		.where(eq(designation.uuid, req.params.uuid));
	handleResponse(designationPromise, res, next);
}
