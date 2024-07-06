import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { bank } from "../schema.js";

export async function insert(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const bankPromise = db.insert(bank).values(req.body).returning();
    handleResponse(bankPromise, res, next, 201);
}

export async function update(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const bankPromise = db
        .update(bank)
        .set(req.body)
        .where(eq(bank.uuid, req.params.uuid))
        .returning();
    handleResponse(bankPromise, res, next, 201);
}

export async function remove(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const bankPromise = db
        .delete(bank)
        .where(eq(bank.uuid, req.params.uuid))
        .returning();
    handleResponse(bankPromise, res, next);
}

export async function selectAll(req, res, next) {
    const resultPromise = db.select().from(bank);
    handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const bankPromise = db
        .select()
        .from(bank)
        .where(eq(bank.uuid, req.params.uuid));
    handleResponse(bankPromise, res, next);
}
