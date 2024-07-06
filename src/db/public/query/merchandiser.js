import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { merchandiser } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.insert(merchandiser)
		.values(req.body)
		.returning();
	handleResponse(merchandiserPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.update(merchandiser)
		.set(req.body)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning();
	handleResponse(merchandiserPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.delete(merchandiser)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning();
	handleResponse(merchandiserPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(merchandiser);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.select()
		.from(merchandiser)
		.where(eq(merchandiser.uuid, req.params.uuid));
	handleResponse(merchandiserPromise, res, next);
}
