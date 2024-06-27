import db from "./db.js";
import * as schema from "./schema/index.js";

// await server
// 	.insert(schema.users)
// 	.values({ name: "Dan" })
// 	.returning();

const gg = await db.select().from(schema.users);

console.log(gg, "users");
