import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

import * as hrSchema from '../hr/schema.js';

export const buyer = pgTable('buyer', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const party = pgTable('party', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const marketing = pgTable('marketing', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	user_uuid: defaultUUID('user_uuid').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const merchandiser = pgTable('merchandiser', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(() => party.uuid),
	name: text('name').notNull(),
	email: text('email').default(null),
	phone: text('phone').default(null),
	address: text('address').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const factory = pgTable('factory', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(() => party.uuid),
	name: text('name').notNull(),
	phone: text('phone').default(null),
	address: text('address').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const section = pgTable('section', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	remarks: text('remarks').default(null),
});

export const properties = pgTable('properties', {
	uuid: uuid_primary,
	item_for: text('item_for').notNull(),
	type: text('type').notNull(),
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default buyer;
