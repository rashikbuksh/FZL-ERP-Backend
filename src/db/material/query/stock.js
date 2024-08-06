import { eq, lt } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { info, stock } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db.insert(stock).values(req.body).returning();
	handleResponse(stockPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.update(stock)
		.set(req.body)
		.where(eq(stock.uuid, req.params.uuid))
		.returning();
	handleResponse(stockPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.delete(stock)
		.where(eq(stock.uuid, req.params.uuid))
		.returning();
	handleResponse(stockPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(stock);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	// if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.select()
		.from(stock)
		.where(eq(stock.uuid, req.params.uuid));
	handleResponse(stockPromise, res, next);
}

export async function selectMaterialBelowThreshold(req, res, next) {
	const stockPromise = db
		.select({
			uuid: info.uuid,
			name: info.name,
			stock: stock.stock,
			threshold: info.threshold,
			unit: info.unit,
		})
		.from(stock)
		.innerJoin(info, eq(stock.material_uuid, info.uuid))
		.where(lt(stock.stock, info.threshold));

	handleResponse(stockPromise, res, next);
}
