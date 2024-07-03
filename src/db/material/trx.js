import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../util/index.js";
import db from "../index.js";
import { trx } from "./schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db.insert(trx).values(req.body).returning();
	handleResponse(trxPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.update(trx)
		.set(req.body)
		.where(eq(trx.uuid, req.params.uuid))
		.returning();
	handleResponse(trxPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.delete(trx)
		.where(eq(trx.uuid, req.params.uuid))
		.returning();
	handleResponse(trxPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(trx);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const trxPromise = db
		.select()
		.from(trx)
		.where(eq(trx.uuid, req.params.uuid));
	handleResponse(trxPromise, res, next);
}
