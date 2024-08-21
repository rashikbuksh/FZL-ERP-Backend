import { sql } from 'drizzle-orm';
import { decimal, integer, pgSchema, serial, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as labDipSchema from '../lab_dip/schema.js';
import * as materialSchema from '../material/schema.js';
import * as publicSchema from '../public/schema.js';
import * as sliderSchema from '../slider/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

const zipper = pgSchema('zipper');

export const order_info_sequence = zipper.sequence('order_info_sequence', {
	startWith: 1,
	increment: 1,
});

export const swatchStatusEnum = zipper.enum('swatch_status_enum', [
	'pending',
	'approved',
	'rejected',
]);

export const sliderStartingSectionEnum = zipper.enum(
	'slider_starting_section_enum',
	['die_casting', 'slider_assembly', 'coloring']
);

export const order_info = zipper.table('order_info', {
	uuid: uuid_primary,
	id: integer('id')
		.default(sql`nextval('zipper.order_info_sequence')`)
		.notNull(),
	reference_order_info_uuid: defaultUUID('reference_order_info_uuid').default(
		null
	),
	buyer_uuid: defaultUUID('buyer_uuid').references(
		() => publicSchema.buyer.uuid
	),
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	merchandiser_uuid: defaultUUID('merchandiser_uuid').references(
		() => publicSchema.merchandiser.uuid
	),
	factory_uuid: defaultUUID('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	is_sample: integer('is_sample').default(0),
	is_bill: integer('is_bill').default(0),
	is_cash: integer('is_cash').default(0),
	marketing_priority: text('marketing_priority').default(null),
	factory_priority: text('factory_priority').default(null),
	status: integer('status').notNull().default(0),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const order_description = zipper.table('order_description', {
	uuid: uuid_primary,
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => order_info.uuid
	),
	item: defaultUUID('item'),
	zipper_number: defaultUUID('zipper_number'),
	end_type: defaultUUID('end_type'),
	lock_type: defaultUUID('lock_type'),
	puller_type: defaultUUID('puller_type'),
	teeth_color: defaultUUID('teeth_color'),
	puller_color: defaultUUID('puller_color'),
	special_requirement: text('special_requirement').default(null),
	hand: defaultUUID('hand'),
	stopper_type: defaultUUID('stopper_type'),
	coloring_type: defaultUUID('coloring_type'),
	is_slider_provided: integer('is_slider_provided').default(0),
	slider: defaultUUID('slider'),
	slider_starting_section: sliderStartingSectionEnum(
		'slider_starting_section_enum'
	),
	top_stopper: defaultUUID('top_stopper'),
	bottom_stopper: defaultUUID('bottom_stopper'),
	logo_type: defaultUUID('logo_type'),
	is_logo_body: integer('is_logo_body').notNull().default(0),
	is_logo_puller: integer('is_logo_puller').notNull().default(0),
	description: text('description').default(null),
	status: integer('status').notNull().default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	slider_body_shape: defaultUUID('slider_body_shape'),
	slider_link: defaultUUID('slider_link'),
	end_user: defaultUUID('end_user'),
	garment: text('garment').default(null),
	light_preference: defaultUUID('light_preference'),
	garments_wash: defaultUUID('garments_wash'),
	puller_link: defaultUUID('puller_link'),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	garments_remarks: text('garments_remarks').default(null),
});

export const order_entry = zipper.table('order_entry', {
	uuid: uuid_primary,
	order_description_uuid: defaultUUID('order_description_uuid').references(
		() => order_description.uuid
	),
	style: text('style').notNull(),
	color: text('color').notNull(),
	size: text('size').notNull(),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	company_price: decimal('company_price', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	party_price: decimal('party_price', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	status: integer('status').default(1),
	swatch_status: swatchStatusEnum('swatch_status_enum').default('pending'),
	swatch_approval_date: text('swatch_approval_date').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const sfg = zipper.table('sfg', {
	uuid: uuid_primary,
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => order_entry.uuid
	),
	recipe_uuid: defaultUUID('recipe_uuid')
		.default(null)
		.references(() => labDipSchema.recipe.uuid),
	// dying_and_iron_stock: decimal("dying_and_iron_stock").default(0.0), // dying_and_iron has been moved to dying_batch table
	dying_and_iron_prod: decimal('dying_and_iron_prod', {
		precision: 20,
		scale: 4,
	}).default(0),
	teeth_molding_stock: decimal('teeth_molding_stock', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	teeth_molding_prod: decimal('teeth_molding_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	teeth_coloring_stock: decimal('teeth_coloring_stock', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	teeth_coloring_prod: decimal('teeth_coloring_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	finishing_stock: decimal('finishing_stock', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	finishing_prod: decimal('finishing_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	// die_casting_prod: decimal("die_casting_prod").default(0),
	// slider_assembly_stock: decimal("slider_assembly_stock").default(0),
	// slider_assembly_prod: decimal("slider_assembly_prod").default(0),
	// coloring_stock: decimal("coloring_stock").default(0.0), // slider section has been moved to slider schema
	coloring_prod: decimal('coloring_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	warehouse: decimal('warehouse', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	delivered: decimal('delivered', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	pi: decimal('pi', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	remarks: text('remarks').default(null),
});

export const sfg_production = zipper.table('sfg_production', {
	uuid: uuid_primary,
	sfg_uuid: defaultUUID('sfg_uuid').references(() => sfg.uuid),
	section: text('section').notNull(),
	used_quantity: decimal('used_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	wastage: decimal('wastage', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const sfg_transaction = zipper.table('sfg_transaction', {
	uuid: uuid_primary,
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => order_entry.uuid
	),
	trx_from: text('trx_from').notNull(),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	slider_item_uuid: defaultUUID('slider_item_uuid').references(
		() => sliderSchema.stock.uuid
	),
	//	slider_item_uuid: uuid('slider_item_uuid').references(() => sliderSchema.stock.uuid),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

// zipper batch
export const batch = zipper.table('batch', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const batch_entry = zipper.table('batch_entry', {
	uuid: uuid_primary,
	batch_uuid: defaultUUID('batch_uuid'),
	sfg_uuid: defaultUUID('sfg_uuid'),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	production_quantity_in_kg: decimal('production_quantity_in_kg', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

// dying batch
export const dying_batch = zipper.table('dying_batch', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	mc_no: integer('mc_no').notNull(),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const dying_batch_entry = zipper.table('dying_batch_entry', {
	uuid: uuid_primary,
	dying_batch_uuid: defaultUUID('dying_batch_uuid').references(
		() => dying_batch.uuid
	),
	batch_entry_uuid: defaultUUID('batch_entry_uuid').references(
		() => batch_entry.uuid
	),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	production_quantity_in_kg: decimal('production_quantity_in_kg', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

// tape and coil
export const tape_coil = zipper.table('tape_coil', {
	uuid: uuid_primary,
	type: text('type').notNull(),
	zipper_number: decimal('zipper_number', {
		precision: 2,
		scale: 1,
	}).notNull(),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	trx_quantity_in_coil: decimal('trx_quantity_in_coil', {
		precision: 20,
		scale: 4,
	}).notNull(),
	quantity_in_coil: decimal('quantity_in_coil', {
		precision: 20,
		scale: 4,
	}).notNull(),
	remarks: text('remarks').default(null),
});

export const tape_to_coil = zipper.table('tape_to_coil', {
	uuid: uuid_primary,
	tape_coil_uuid: defaultUUID('tape_coil_uuid').references(
		() => tape_coil.uuid
	),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const tape_coil_production = zipper.table('tape_coil_production', {
	uuid: uuid_primary,
	section: text('section').notNull(),
	tape_coil_uuid: defaultUUID('tape_coil_uuid').references(
		() => tape_coil.uuid
	),
	production_quantity: decimal('production_quantity', {
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
	remarks: text('remarks').default(null),
});

export const planning = zipper.table('planning', {
	week: text('week').primaryKey(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const planning_entry = zipper.table('planning_entry', {
	uuid: uuid_primary,
	planning_week: defaultUUID('planning_week').references(() => planning.week),
	sfg_uuid: defaultUUID('sfg_uuid').references(() => sfg.uuid),
	sno_quantity: decimal('sno_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	factory_quantity: decimal('factory_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	batch_production_quantity: decimal('batch_production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	sno_remarks: text('sno_remarks').default(null),
	factory_remarks: text('factory_remarks').default(null),
});

export const material_trx_against_order_description = zipper.table(
	'material_trx_against_order_description',
	{
		uuid: uuid_primary,
		order_description_uuid: defaultUUID(
			'order_description_uuid'
		).references(() => order_description.uuid),
		material_uuid: defaultUUID('material_uuid').references(
			() => materialSchema.info.uuid
		),
		trx_to: text('trx_to').notNull(),
		trx_quantity: decimal('trx_quantity', {
			precision: 20,
			scale: 4,
		}).notNull(),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		remarks: text('remarks').default(null),
	}
);

export default zipper;
