import { integer, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

const hr = pgSchema('hr');

export const department = hr.table('department', {
	uuid: uuid_primary,
	department: text('department').notNull().unique(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const designation = hr.table('designation', {
	uuid: uuid_primary,
	designation: text('designation').notNull().unique(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const users = hr.table('users', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	pass: text('pass').notNull(),
	designation_uuid: defaultUUID('designation_uuid').references(
		() => designation.uuid
	),
	department_uuid: defaultUUID('department_uuid').references(
		() => department.uuid
	),
	can_access: text('can_access').default(null),
	ext: text('ext').default(null),
	phone: text('phone').default(null),
	created_at: text('created_at').notNull(),
	updated_at: text('updated_at').default(null),
	status: text('status').default(0),
	remarks: text('remarks').default(null),
});

export const policy_and_notice = hr.table('policy_and_notice', {
	uuid: uuid_primary,
	type: text('type').notNull(),
	title: text('title').notNull(),
	sub_title: text('sub_title').notNull(),
	url: text('url').notNull(),
	created_by: defaultUUID('created_by').references(() => users.uuid),
	created_at: text('created_at').notNull(),
	updated_at: text('updated_at').default(null),
	status: integer('status').notNull(),
	remarks: text('remarks').default(null),
});

export default hr;
