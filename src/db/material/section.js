import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../util/index.js";
import db from "../index.js";
import { section } from "./schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db.insert(section).values(req.body).returning();
	handleResponse(sectionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.update(section)
		.set(req.body)
		.where(eq(section.uuid, req.params.uuid))
		.returning();
	handleResponse(sectionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.delete(section)
		.where(eq(section.uuid, req.params.uuid))
		.returning();
	handleResponse(sectionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(section);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.select()
		.from(section)
		.where(eq(section.uuid, req.params.uuid));
	handleResponse(sectionPromise, res, next);
}
