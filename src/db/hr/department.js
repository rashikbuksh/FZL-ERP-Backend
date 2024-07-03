import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../util/index.js";
import db from "../index.js";
import { department } from "./schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.insert(department)
		.values(req.body)
		.returning();
	handleResponse(departmentPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.update(department)
		.set(req.body)
		.where(eq(department.uuid, req.params.uuid))
		.returning();
	handleResponse(departmentPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.delete(department)
		.where(eq(department.uuid, req.params.uuid))
		.returning();
	handleResponse(departmentPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(department);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.select()
		.from(department)
		.where(eq(department.uuid, req.params.uuid));
	handleResponse(departmentPromise, res, next);
}
