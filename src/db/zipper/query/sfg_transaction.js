import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { sfg_transaction } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.insert(sfg_transaction)
		.values(req.body)
		.returning();
	handleResponse(sfgTransactionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.update(sfg_transaction)
		.set(req.body)
		.where(eq(sfg_transaction.uuid, req.params.uuid))
		.returning();
	handleResponse(sfgTransactionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.delete(sfg_transaction)
		.where(eq(sfg_transaction.uuid, req.params.uuid))
		.returning();
	handleResponse(sfgTransactionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(sfg_transaction);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.select()
		.from(sfg_transaction)
		.where(eq(sfg_transaction.uuid, req.params.uuid));
	handleResponse(sfgTransactionPromise, res, next);
}
