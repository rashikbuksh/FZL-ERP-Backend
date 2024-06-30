import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../util/index.js";
import db from "../index.js";
import { users } from "./schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db.insert(users).values(req.body).returning();
	handleResponse(userPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.update(users)
		.set(req.body)
		.where(eq(users.uuid, req.params.uuid))
		.returning();

	handleResponse(userPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.delete(users)
		.where(eq(users.uuid, req.params.uuid))
		.returning();
	handleResponse(userPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(users);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.select()
		.from(users)
		.where(eq(users.uuid, req.params.uuid));
	handleResponse(userPromise, res, next);
}
