import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { batch } from "../schema.js";

export async function insert(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const batchPromise = db.insert(batch).values(req.body).returning();
    handleResponse(batchPromise, res, next, 201);
}

export async function update(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const batchPromise = db
        .update(batch)
        .set(req.body)
        .where(eq(batch.uuid, req.params.uuid))
        .returning();
    handleResponse(batchPromise, res, next, 201);
}

export async function remove(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const batchPromise = db
        .delete(batch)
        .where(eq(batch.uuid, req.params.uuid))
        .returning();
    handleResponse(batchPromise, res, next);
}

export async function selectAll(req, res, next) {
    const resultPromise = db.select().from(batch);
    handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const batchPromise = db
        .select()
        .from(batch)
        .where(eq(batch.uuid, req.params.uuid));
    handleResponse(batchPromise, res, next);
}

