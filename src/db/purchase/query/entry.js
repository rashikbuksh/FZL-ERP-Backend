import { eq } from "drizzle-orm";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { entry } from "../schema.js";

export async function insert(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const entryPromise = db.insert(entry).values(req.body).returning();
    handleResponse(entryPromise, res, next, 201);
}

export async function update(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const entryPromise = db
        .update(entry)
        .set(req.body)
        .where(eq(entry.uuid, req.params.uuid))
        .returning();
    handleResponse(entryPromise, res, next, 201);
}

export async function remove(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const entryPromise = db
        .delete(entry)
        .where(eq(entry.uuid, req.params.uuid))
        .returning();
    handleResponse(entryPromise, res, next);
}

export async function selectAll(req, res, next) {
    const resultPromise = db.select().from(entry);
    handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
    if (!(await validateRequest(req, next))) return;

    const entryPromise = db
        .select()
        .from(entry)
        .where(eq(entry.uuid, req.params.uuid));
    handleResponse(entryPromise, res, next);
}

