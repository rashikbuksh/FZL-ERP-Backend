import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { vendor } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db.insert(vendor).values(req.body).returning();
	handleResponse(vendorPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.update(vendor)
		.set(req.body)
		.where(eq(vendor.uuid, req.params.uuid))
		.returning();
	handleResponse(vendorPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.delete(vendor)
		.where(eq(vendor.uuid, req.params.uuid))
		.returning();
	handleResponse(vendorPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(vendor);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.select()
		.from(vendor)
		.where(eq(vendor.uuid, req.params.uuid));
	handleResponse(vendorPromise, res, next);
}
