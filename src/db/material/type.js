import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../util/index.js";
import db from "../index.js";
import { type } from "./schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db.insert(type).values(req.body).returning();
	handleResponse(typePromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.update(type)
		.set(req.body)
		.where(eq(type.uuid, req.params.uuid))
		.returning();
	handleResponse(typePromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.delete(type)
		.where(eq(type.uuid, req.params.uuid))
		.returning();
	handleResponse(typePromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(type);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.select()
		.from(type)
		.where(eq(type.uuid, req.params.uuid));
	handleResponse(typePromise, res, next);
}

