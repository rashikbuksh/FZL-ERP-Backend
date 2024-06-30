import {
	decimal,
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	uuid,
} from "drizzle-orm/pg-core";

export const buyer = pgTable("buyer", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name"),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export default buyer;
