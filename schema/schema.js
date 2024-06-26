import {
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").unique(),
});
export const authOtps = pgTable("auth_otp", {
	id: serial("id").primaryKey(),
	phone: varchar("phone", { length: 256 }),
	userId: integer("user_id").references(() => users.id),
});

export const postSchema = pgSchema("post");

export const posts = postSchema.table("posts", {
	id: serial("id").primaryKey(),
	title: text("title"),
	content: text("content"),
	userId: integer("user_id").references(() => users.id),
});

export const comments = postSchema.table("comments", {
	id: serial("id").primaryKey(),
	content: text("content"),
	postId: integer("post_id").references(() => posts.id),
	userId: integer("user_id").references(() => users.id),
});
