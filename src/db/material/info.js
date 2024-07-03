import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../util/index.js";
import db from "../index.js";
import { info } from "./schema.js";

async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db.insert(info).values(req.body).returning();
	handleResponse(infoPromise, res, next, 201);
}

async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.update(info)
		.set(req.body)
		.where(eq(info.uuid, req.params.uuid))
		.returning();
	handleResponse(infoPromise, res, next, 201);
}

async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.delete(info)
		.where(eq(info.uuid, req.params.uuid))
		.returning();
	handleResponse(infoPromise, res, next);
}

async function selectAll(req, res, next) {
	const resultPromise = db.select().from(info);
	handleResponse(resultPromise, res, next);
}

async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.select()
		.from(info)
		.where(eq(info.uuid, req.params.uuid));
	handleResponse(infoPromise, res, next);
}
