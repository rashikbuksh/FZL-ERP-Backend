import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { transaction } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.insert(transaction)
		.values(req.body)
		.returning();
	handleResponse(transactionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.update(transaction)
		.set(req.body)
		.where(eq(transaction.uuid, req.params.uuid))
		.returning();
	handleResponse(transactionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.delete(transaction)
		.where(eq(transaction.uuid, req.params.uuid))
		.returning();
	handleResponse(transactionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(transaction);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.select()
		.from(transaction)
		.where(eq(transaction.uuid, req.params.uuid));
	handleResponse(transactionPromise, res, next);
}
