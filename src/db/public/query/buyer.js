import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { buyer } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db.insert(buyer).values(req.body).returning();
	handleResponse(buyerPromise, res, next, 201, "Buyer created", "create");
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db.update(buyer).set(req.body).where(eq(buyer.uuid, req.params.uuid)).returning();
	handleResponse(buyerPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db.delete(buyer).where(eq(buyer.uuid, req.params.uuid)).returning();
	handleResponse(buyerPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(buyer);
	handleResponse(resultPromise, res, next, 200, "", "select_all");
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db.select().from(buyer).where(eq(buyer.uuid, req.params.uuid));
	handleResponse(buyerPromise, res, next);
}
