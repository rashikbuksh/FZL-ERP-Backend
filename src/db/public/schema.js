import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
} from 'drizzle-orm/pg-core';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import { order_description } from '../zipper/schema.js';
import { order_info } from '../thread/schema.js';

export const buyer = pgTable('buyer', {
	uuid: uuid_primary,
	name: text('name').notNull().unique(),
	short_name: text('short_name').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const party = pgTable('party', {
	uuid: uuid_primary,
	name: text('name').notNull().unique(),
	short_name: text('short_name').notNull(),
	address: text('address').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
	parent_party_uuid: defaultUUID('parent_party_uuid')
		.references(() => party.uuid)
		.default(null),
});

export const marketing = pgTable('marketing', {
	uuid: uuid_primary,
	name: text('name').notNull().unique(),
	short_name: text('short_name').default(null),
	user_uuid: defaultUUID('user_uuid').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
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
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const factory = pgTable('factory', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(() => party.uuid),
	name: text('name').notNull().unique(),
	phone: text('phone').default(null),
	address: text('address').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const section = pgTable('section', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	remarks: text('remarks').default(null),
});

export const properties = pgTable(
	'properties',
	{
		uuid: uuid_primary,
		item_for: text('item_for').notNull(),
		type: text('type').notNull(),
		name: text('name').notNull(),
		short_name: text('short_name').notNull(),
		order_sheet_name: text('order_sheet_name'),
		created_by: defaultUUID('created_by'),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		updated_by: defaultUUID('updated_by')
			.references(() => hrSchema.users.uuid)
			.default(null),
		remarks: text('remarks').default(null),
	},
	(table) => [
		index('public_properties_type_idx').on(table.type),
		index('public_properties_name_idx').on(table.name),
	]
);

export const machine = pgTable('machine', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	is_vislon: integer('is_vislon').default(0),
	is_metal: integer('is_metal').default(0),
	is_nylon: integer('is_nylon').default(0),
	is_sewing_thread: integer('is_sewing_thread').default(0),
	is_bulk: integer('is_bulk').default(0),
	is_sample: integer('is_sample').default(0),
	min_capacity: PG_DECIMAL('min_capacity').notNull(),
	max_capacity: PG_DECIMAL('max_capacity').notNull(),
	water_capacity: PG_DECIMAL('water_capacity').default(0),
	created_by: defaultUUID('created_by')
		.notNull()
		.references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

export const marketing_team = pgTable('marketing_team', {
	uuid: uuid_primary,
	name: text('name').notNull().unique(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const marketing_team_entry = pgTable('marketing_team_entry', {
	uuid: uuid_primary,
	marketing_team_uuid: defaultUUID('marketing_team_uuid').references(
		() => marketing_team.uuid
	),
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => marketing.uuid
	),
	is_team_leader: boolean('is_team_leader').default(false),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const marketing_team_member_target = pgTable(
	'marketing_team_member_target',
	{
		uuid: uuid_primary,
		marketing_uuid: defaultUUID('marketing_uuid').references(
			() => marketing.uuid
		),
		year: integer('year').notNull(),
		month: integer('month').notNull(),
		zipper_amount: PG_DECIMAL('zipper_amount').default(0),
		thread_amount: PG_DECIMAL('thread_amount').default(0),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		updated_by: defaultUUID('updated_by')
			.references(() => hrSchema.users.uuid)
			.default(null),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		remarks: text('remarks').default(null),
	}
);

export const product_enum = pgEnum('product_enum', ['zipper', 'thread']);

export const production_capacity = pgTable('production_capacity', {
	uuid: uuid_primary,
	product: product_enum().default('zipper'),
	item: defaultUUID('item').references(() => properties.uuid),

	nylon_stopper: defaultUUID('nylon_stopper').references(
		() => properties.uuid
	),
	zipper_number: defaultUUID('zipper_number').references(
		() => properties.uuid
	),
	end_type: defaultUUID('end_type').references(() => properties.uuid),
	quantity: PG_DECIMAL('quantity').notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const subscription = pgTable('subscription', {
	id: serial('id'),
	endpoint: text('endpoint').notNull().unique(),
	created_at: DateTime('created_at').notNull(),
});

export const complaint = pgTable('complaint', {
	uuid: uuid_primary,
	order_description_uuid: defaultUUID('order_description_uuid')
		.references(() => order_description.uuid)
		.default(null),
	thread_order_info_uuid: defaultUUID('thread_order_info_uuid')
		.references(() => order_info.uuid)
		.default(null),
	file: text('file').default(null),
	name: text('name').notNull(),
	description: text('description').default(null),
	root_cause_analysis: text('root_cause_analysis').default(null),
	issue_department: text('issue_department').default(null),
	solution: text('solution').default(null),
	future_proof: text('future_proof').default(null),
	created_at: DateTime('created_at').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	is_resolved: boolean('is_resolved').default(false),
	is_resolved_date: DateTime('is_resolved_date').default(null),
});

export default buyer;
