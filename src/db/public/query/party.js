import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { party } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db.insert(party).values(req.body).returning();
	handleResponse(partyPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.update(party)
		.set(req.body)
		.where(eq(party.uuid, req.params.uuid))
		.returning();
	handleResponse(partyPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.delete(party)
		.where(eq(party.uuid, req.params.uuid))
		.returning();
	handleResponse(partyPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(party);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.select()
		.from(party)
		.where(eq(party.uuid, req.params.uuid));
	handleResponse(partyPromise, res, next);
}
