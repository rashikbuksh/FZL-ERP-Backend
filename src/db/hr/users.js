import { eq } from "drizzle-orm";
import db from "../index.js";
import { users } from "./schema.js";

export async function insert(data) {
	return await db.insert(users).values(data).returning();
}

export async function update(data) {
	return await db
		.update(users)
		.set(data)
		.where(eq(users.id, data.id))
		.returning();
}

export async function remove(id) {
	return await db.delete(users).where(eq(users.id, id)).returning();
}

export async function select() {
	const result = await db.select().from(users);
	console.log(result);
	return result;
}
