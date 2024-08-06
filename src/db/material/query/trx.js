import { and, eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import { users } from "../../hr/schema.js";
import db from "../../index.js";
import { info, stock, trx } from "../schema.js";

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

export async function selectMaterialTrxByMaterialTrxTo(req, res, next) {
	const { material_uuid, trx_to } = req.params;

	const trxPromise = await db
		.select({
			uuid: trx.uuid,
			material_uuid: trx.material_uuid,
			stock: stock.stock,
			material_name: info.name,
			unit: info.unit,
			trx_to: trx.trx_to,
			quantity: trx.trx_quantity,
			created_by: trx.created_by,
			created_by_name: users.name,
			created_at: trx.created_at,
			updated_at: trx.updated_at,
			remarks: trx.remarks,
		})
		.from(trx)
		.innerJoin(stock, eq(stock.material_uuid, trx.material_uuid))
		.innerJoin(info, eq(info.uuid, trx.material_uuid))
		.innerJoin(users, eq(users.uuid, trx.created_by))
		.where(
			and(eq(stock.material_uuid, material_uuid), eq(trx.trx_to, trx_to))
		);

	handleResponse(trxPromise, res, next);
}
