import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { factory } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db.insert(factory).values(req.body).returning();
	handleResponse(factoryPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.update(factory)
		.set(req.body)
		.where(eq(factory.uuid, req.params.uuid))
		.returning();
	handleResponse(factoryPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.delete(factory)
		.where(eq(factory.uuid, req.params.uuid))
		.returning();
	handleResponse(factoryPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(factory);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.select()
		.from(factory)
		.where(eq(factory.uuid, req.params.uuid));
	handleResponse(factoryPromise, res, next);
}
