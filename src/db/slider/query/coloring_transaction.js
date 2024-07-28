import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { coloring_transaction } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const coloringTransactionPromise = db
		.insert(coloring_transaction)
		.values(req.body)
		.returning();
	handleResponse(coloringTransactionPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const coloringTransactionPromise = db
		.update(coloring_transaction)
		.set(req.body)
		.where(eq(coloring_transaction.uuid, req.params.uuid))
		.returning();
	handleResponse(coloringTransactionPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const coloringTransactionPromise = db
		.delete(coloring_transaction)
		.where(eq(coloring_transaction.uuid, req.params.uuid))
		.returning();
	handleResponse(coloringTransactionPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(coloring_transaction);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const coloringTransactionPromise = db
		.select()
		.from(coloring_transaction)
		.where(eq(coloring_transaction.uuid, req.params.uuid));
	handleResponse(coloringTransactionPromise, res, next);
}
