import { sql } from 'drizzle-orm';
import { decimal, integer, pgSchema, serial, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as materialSchema from '../material/schema.js';
import * as threadSchema from '../Thread/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const lab_dip = pgSchema('lab_dip');

export const info = lab_dip.table('info', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	name: text('name').notNull(),
	order_info_uuid: defaultUUID('order_info_uuid')
		.references(() => zipperSchema.order_info.uuid)
		.default(null),
	thread_order_info_uuid: defaultUUID('thread_order_info_uuid')
		.references(() => threadSchema.order_info.uuid)
		.default(null),
	lab_status: integer('lab_status').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const recipe = lab_dip.table('recipe', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	lab_dip_info_uuid: defaultUUID('lab_dip_info_uuid').references(
		() => info.uuid
	),
	name: text('name').notNull(),
	approved: integer('approved').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	status: integer('status').default(0),
	sub_streat: text('sub_streat').default(null),
	bleaching: text('bleaching').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const recipe_entry = lab_dip.table('recipe_entry', {
	uuid: uuid_primary,
	recipe_uuid: defaultUUID('recipe_uuid').references(() => recipe.uuid),
	color: text('color').notNull(),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	material_uuid: defaultUUID('material_uuid').references(
		() => materialSchema.info.uuid
	),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const lab_dip_shade_recipe_sequence = lab_dip.sequence(
	'shade_recipe_sequence',
	{
		startWith: 1,
		increment: 1,
	}
);

export const shade_recipe = lab_dip.table('shade_recipe', {
	uuid: uuid_primary,
	id: integer('id')
		.notNull()
		.default(sql`nextval('lab_dip.shade_recipe_sequence')`),
	name: text('name').notNull(),
	sub_streat: text('sub_streat').default(null),
	lab_status: integer('lab_status').default(0),
	bleaching: text('bleaching').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const shade_recipe_entry = lab_dip.table('shade_recipe_entry', {
	uuid: uuid_primary,
	shade_recipe_uuid: defaultUUID('shade_recipe_uuid').references(
		() => shade_recipe.uuid
	),
	material_uuid: defaultUUID('material_uuid').references(
		() => materialSchema.info.uuid
	),
	quantity: PG_DECIMAL('quantity'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default lab_dip;
