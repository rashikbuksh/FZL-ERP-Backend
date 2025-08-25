import {
	boolean,
	decimal,
	integer,
	pgSchema,
	serial,
	text,
	unique,
} from 'drizzle-orm/pg-core';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import * as zipperSchema from '../zipper/schema.js';

const material = pgSchema('material');

export const store_type_enum = material.enum('store_type_enum', [
	'rm',
	'accessories',
	'maintenance',
]);

export const section = material.table(
	'section',
	{
		uuid: uuid_primary,
		name: text('name').notNull(),
		short_name: text('short_name').default(null),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		updated_by: defaultUUID('updated_by')
			.references(() => hrSchema.users.uuid)
			.default(null),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		remarks: text('remarks').default(null),
		index: integer('index').default(0),
		store_type: store_type_enum('store_type').default('rm'),
	},
	(t) => ({
		material_section_name_store_type_unique: unique(
			'material_section_name_store_type_unique'
		).on(t.name, t.store_type),
	})
);

export const type = material.table(
	'type',
	{
		uuid: uuid_primary,
		name: text('name').notNull().unique(),
		short_name: text('short_name').default(null),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		updated_by: defaultUUID('updated_by')
			.references(() => hrSchema.users.uuid)
			.default(null),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		remarks: text('remarks').default(null),
		store_type: store_type_enum('store_type').default('rm'),
	},
	(t) => ({
		material_type_name_store_type_unique: unique(
			'material_type_name_store_type_unique'
		).on(t.name, t.store_type),
	})
);

export const info = material.table(
	'info',
	{
		uuid: uuid_primary,
		index: integer('index').default(0),
		section_uuid: defaultUUID('section_uuid').references(
			() => section.uuid
		),
		type_uuid: defaultUUID('type_uuid').references(() => type.uuid),
		name: text('name').notNull().unique(),
		short_name: text('short_name').default(null),
		unit: text('unit').notNull(),
		threshold: decimal('threshold', {
			precision: 20,
			scale: 4,
		})
			.notNull()
			.default(0.0),
		is_priority_material: integer('is_priority_material').default(0),
		average_lead_time: integer('average_lead_time').default(0),
		description: text('description').default(null),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		updated_by: defaultUUID('updated_by')
			.references(() => hrSchema.users.uuid)
			.default(null),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		remarks: text('remarks').default(null),
		store_type: store_type_enum('store_type').notNull().default('rm'),
		is_hidden: boolean('is_hidden').default(false),
	},
	(t) => ({
		material_info_name_store_type_unique: unique(
			'material_info_name_store_type_unique'
		).on(t.name, t.store_type),
	})
);

export const stock = material.table('stock', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid, {
		onDelete: 'CASCADE',
	}),
	stock: decimal('stock', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	booking: PG_DECIMAL('booking').default(0.0),
	lab_dip: PG_DECIMAL('lab_dip').default(0.0),
	tape_making: PG_DECIMAL('tape_making').default(0.0),
	box_pin_metal: PG_DECIMAL('box_pin_metal').default(0.0),
	chemicals_dyeing: PG_DECIMAL('chemicals_dyeing').default(0.0),
	chemicals_coating: PG_DECIMAL('chemicals_coating').default(0.0),
	coating_epoxy_paint_harmes: PG_DECIMAL(
		'coating_epoxy_paint_harmes'
	).default(0.0),
	coil_forming_sewing: PG_DECIMAL('coil_forming_sewing').default(0.0),
	coil_forming_sewing_forming: PG_DECIMAL(
		'coil_forming_sewing_forming'
	).default(0.0),
	dyeing: PG_DECIMAL('dyeing').default(0.0),
	elastic: PG_DECIMAL('elastic').default(0.0),
	electroplating: PG_DECIMAL('electroplating').default(0.0),
	gtz_india_pvt_ltd_electroplating: PG_DECIMAL(
		'gtz_india_pvt_ltd_electroplating'
	).default(0.0),
	gtz_india_pvt_ltd_teeth_plating: PG_DECIMAL(
		'gtz_india_pvt_ltd_teeth_plating'
	).default(0.0),
	invisible: PG_DECIMAL('invisible').default(0.0),
	metal_finishing: PG_DECIMAL('metal_finishing').default(0.0),
	metal: PG_DECIMAL('metal').default(0.0),
	metal_teeth_electroplating: PG_DECIMAL(
		'metal_teeth_electroplating'
	).default(0.0),
	metal_teeth_molding: PG_DECIMAL('metal_teeth_molding').default(0.0),
	metal_teeth_plating: PG_DECIMAL('metal_teeth_plating').default(0.0),
	nylon: PG_DECIMAL('nylon').default(0.0),
	nylon_finishing: PG_DECIMAL('nylon_finishing').default(0.0),
	nylon_gapping: PG_DECIMAL('nylon_gapping').default(0.0),
	pigment_dye: PG_DECIMAL('pigment_dye').default(0.0),
	qlq_enterprise_bangladesh_ltd_chemical: PG_DECIMAL(
		'qlq_enterprise_bangladesh_ltd_chemical'
	).default(0.0),
	die_casting: PG_DECIMAL('die_casting').default(0.0),
	slider_assembly: PG_DECIMAL('slider_assembly').default(0.0),
	sewing_thread_finishing: PG_DECIMAL('sewing_thread_finishing').default(0.0),
	sewing_thread: PG_DECIMAL('sewing_thread').default(0.0),
	slider_coating_epoxy_paint: PG_DECIMAL(
		'slider_coating_epoxy_paint'
	).default(0.0),
	slider_electroplating: PG_DECIMAL('slider_electroplating').default(0.0),
	soft_winding: PG_DECIMAL('soft_winding').default(0.0),
	tape_loom: PG_DECIMAL('tape_loom').default(0.0),
	thread_dying: PG_DECIMAL('thread_dying').default(0.0),
	vislon_finishing: PG_DECIMAL('vislon_finishing').default(0.0),
	vislon_gapping: PG_DECIMAL('vislon_gapping').default(0.0),
	vislon_injection: PG_DECIMAL('vislon_injection').default(0.0),
	vislon_open_injection: PG_DECIMAL('vislon_open_injection').default(0.0),
	vislon: PG_DECIMAL('vislon').default(0.0),
	zipper_dying: PG_DECIMAL('zipper_dying').default(0.0),
	remarks: text('remarks').default(null),
});

export const trx = material.table('trx', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	booking_uuid: defaultUUID('booking_uuid')
		.references(() => booking.uuid)
		.default(null),
});

export const used = material.table('used', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	section: text('section').notNull(),
	used_quantity: decimal('used_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	wastage: decimal('wastage', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

//stock to sfg table
export const stock_to_sfg = material.table('stock_to_sfg', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => zipperSchema.order_entry.uuid
	),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

// booking
export const booking = material.table('booking', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	material_uuid: defaultUUID('material_uuid')
		.references(() => info.uuid)
		.default(null),
	marketing_uuid: defaultUUID('marketing_uuid')
		.references(() => publicSchema.marketing.uuid)
		.default(null),
	quantity: PG_DECIMAL('quantity').notNull(),
	trx_quantity: PG_DECIMAL('trx_quantity').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

export default material;
