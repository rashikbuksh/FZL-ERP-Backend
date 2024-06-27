import {
	decimal,
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const hr = pgSchema("hr");

export const department = hr.table("department", {
	uuid: uuid("uuid").primaryKey(),
	department: text("department").notNull(),
});

export const designation = hr.table("designation", {
	uuid: uuid("uuid").primaryKey(),
	department_uuid: uuid("department_uuid").references(() => department.uuid),
	designation: text("designation").notNull(),
});

export const users = hr.table("users", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	pass: text("pass").notNull(),
	designation_uuid: uuid("designation_uuid").references(
		() => designation.uuid
	),
	can_access: text("can_access").notNull(),
	ext: text("ext"),
	phone: text("phone"),
	created_at: text("created_at").notNull(),
	updated_at: text("updated_at").notNull(),
	status: text("status").notNull(),
	remarks: text("remarks"),
});
