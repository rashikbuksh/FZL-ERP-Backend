import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { properties } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.insert(properties)
		.values(req.body)
		.returning();
	handleResponse(propertiesPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.update(properties)
		.set(req.body)
		.where(eq(properties.uuid, req.params.uuid))
		.returning();
	handleResponse(propertiesPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.delete(properties)
		.where(eq(properties.uuid, req.params.uuid))
		.returning();
	handleResponse(propertiesPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(properties);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.select()
		.from(properties)
		.where(eq(properties.uuid, req.params.uuid));
	handleResponse(propertiesPromise, res, next);
}
