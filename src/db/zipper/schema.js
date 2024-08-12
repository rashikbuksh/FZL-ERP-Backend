import { sql } from 'drizzle-orm';
import { decimal, integer, pgSchema, serial, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as labDipSchema from '../lab_dip/schema.js';
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

export const def_zipper_order_info = {
	type: 'object',
	required: [
		'uuid',
		'buyer_uuid',
		'party_uuid',
		'marketing_uuid',
		'merchandiser_uuid',
		'factory_uuid',
		'is_sample',
		'is_bill',
		'marketing_priority',
		'factory_priority',
		'status',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: { type: 'number', example: 1 },
		reference_order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		buyer_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		party_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		marketing_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		merchandiser_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		factory_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		is_sample: { type: 'integer', example: 0 },
		is_bill: { type: 'integer', example: 0 },
		is_cash: { type: 'integer', example: 0 },
		marketing_priority: {
			type: 'string',
			example: 'Urgent',
		},
		merchandiser_priority: {
			type: 'string',
			example: 'Urgent',
		},
		factory_priority: {
			type: 'string',
			example: 'FIFO',
		},
		status: { type: 'integer', example: 0 },
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			example: '2021-08-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			example: '2021-08-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'zipper.order_info',
	},
};

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

export const def_zipper_order_description = {
	type: 'object',
	required: [
		'uuid',
		'order_info_uuid',
		'item',
		'zipper_number',
		'end_type',
		'lock_type',
		'puller_type',
		'teeth_color',
		'puller_color',
		'hand',
		'stopper_type',
		'coloring_type',
		'slider',
		'top_stopper',
		'bottom_stopper',
		'logo_type',
		'is_logo_body',
		'is_logo_puller',
		'slider_body_shape',
		'slider_link',
		'end_user',
		'light_preference',
		'garments_wash',
		'puller_link',
		'created_by',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		item: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		zipper_number: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		end_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		lock_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		teeth_color: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_color: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		special_requirement: {
			type: 'object',
			example: '{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
		},
		hand: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stopper_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		coloring_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		is_slider_provided: {
			type: 'integer',
			example: 0,
		},
		slider: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		slider_starting_section: {
			type: 'string',
			example: 'die_casting',
		},
		top_stopper: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		bottom_stopper: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		logo_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		is_logo_body: {
			type: 'integer',
			example: 0,
		},
		is_logo_puller: {
			type: 'integer',
			example: 0,
		},
		description: {
			type: 'string',
			example: 'Description',
		},
		status: {
			type: 'integer',
			example: 0,
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
		slider_body_shape: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		slider_link: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		end_user: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		garment: {
			type: 'string',
			example: 'Garment',
		},
		light_preference: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		garments_wash: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_link: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
	},
	xml: {
		name: 'zipper.order_description',
	},
};

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

export const def_zipper_order_entry = {
	type: 'object',
	required: [
		'uuid',
		'order_description_uuid',
		'style',
		'color',
		'size',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_description_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		style: {
			type: 'string',
			example: 'style 1',
		},
		color: {
			type: 'string',
			example: 'black',
		},
		size: {
			type: 'number',
			example: 10,
		},
		quantity: {
			type: 'number',
			example: 100,
		},
		company_price: {
			type: 'number',
			example: 10.5,
		},
		party_price: {
			type: 'number',
			example: 10.5,
		},
		status: {
			type: 'integer',
			example: 0,
		},
		swatch_status: {
			type: 'string',
			example: 'Pending',
		},
		swap_approval_date: {
			type: 'string',
			example: '2021-08-01 00:00:00',
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			example: '2021-08-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			example: '2021-08-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Order-Entry',
	},
};

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

export const def_zipper_sfg = {
	type: 'object',
	required: ['uuid', 'order_entry_uuid', 'recipe_uuid'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_entry_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		recipe_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		dying_and_iron_prod: {
			type: 'number',
			example: 0.0,
		},
		teeth_molding_stock: {
			type: 'number',
			example: 0.0,
		},
		teeth_molding_prod: {
			type: 'number',
			example: 0.0,
		},
		teeth_coloring_stock: {
			type: 'number',
			example: 0.0,
		},
		teeth_coloring_prod: {
			type: 'number',
			example: 0.0,
		},
		finishing_stock: {
			type: 'number',
			example: 0.0,
		},
		finishing_prod: {
			type: 'number',
			example: 0.0,
		},
		coloring_prod: {
			type: 'number',
			example: 0.0,
		},
		warehouse: {
			type: 'number',
			example: 0.0,
		},
		delivered: {
			type: 'number',
			example: 0.0,
		},
		pi: {
			type: 'number',
			example: 0.0,
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Sfg',
	},
};

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

export const def_zipper_sfg_production = {
	type: 'object',
	required: [
		'uuid',
		'sfg_uuid',
		'section',
		'production_quantity',
		'wastage',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		sfg_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section: {
			type: 'string',
			example: 'section 1',
		},
		used_quantity: {
			type: 'number',
			example: 10,
		},
		production_quantity: {
			type: 'number',
			example: 10,
		},
		wastage: {
			type: 'number',
			example: 10,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Sfg-Production',
	},
};

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

export const def_zipper_sfg_transaction = {
	type: 'object',
	required: [
		'uuid',
		'order_entry_uuid',
		'section',
		'trx_from',
		'trx_to',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_entry_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section: {
			type: 'string',
			example: 'section',
		},
		trx_from: {
			type: 'string',
			example: 'trx_from',
		},
		trx_to: {
			type: 'string',
			example: 'trx_to',
		},
		trx_quantity: {
			type: 'number',
			example: 100,
		},
		slider_item_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Sfg-Transaction',
	},
};

// zipper batch
export const batch = zipper.table('batch', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const def_zipper_batch = {
	type: 'object',
	required: ['uuid', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Batch',
	},
};

export const batch_entry = zipper.table('batch_entry', {
	uuid: uuid_primary,
	batch_uuid: defaultUUID('batch_uuid'),
	sfg_uuid: defaultUUID('sfg_uuid'),
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

export const def_zipper_batch_entry = {
	type: 'object',
	required: [
		'uuid',
		'batch_uuid',
		'sfg_uuid',
		'quantity',
		'production_quantity',
		'production_quantity_in_kg',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		batch_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		sfg_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 100,
		},
		production_quantity: {
			type: 'number',
			example: 100,
		},
		production_quantity_in_kg: {
			type: 'number',
			example: 100,
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Batch-Entry',
	},
};

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

export const def_zipper_dying_batch = {
	type: 'object',
	required: ['uuid', 'mc_no', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
		},
		id: {
			type: 'serial',
		},
		mc_no: {
			type: 'integer',
		},
		created_by: {
			type: 'string',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Zipper/Dying-Batch',
	},
};

export const dying_batch_entry = zipper.table('dying_batch_entry', {
	uuid: uuid_primary,
	dying_batch_uuid: defaultUUID('dying_batch_uuid'),
	batch_entry_uuid: defaultUUID('batch_entry_uuid'),
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

export const def_zipper_dying_batch_entry = {
	type: 'object',
	required: [
		'uuid',
		'dying_batch_uuid',
		'batch_entry_uuid',
		'quantity',
		'production_quantity',
		'production_quantity_in_kg',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		dying_batch_uuid: {
			type: 'string',
		},
		batch_entry_uuid: {
			type: 'string',
		},
		quantity: {
			type: 'number',
		},
		production_quantity: {
			type: 'number',
		},
		production_quantity_in_kg: {
			type: 'number',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Zipper/Dying-Batch-Entry',
	},
};

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

export const def_zipper_tape_coil = {
	type: 'object',
	required: [
		'uuid',
		'type',
		'zipper_number',
		'quantity',
		'trx_quantity_in_coil',
		'quantity_in_coil',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		type: {
			type: 'string',
			example: 'nylon',
		},
		zipper_number: {
			type: 'number',
			example: 1.0,
		},
		quantity: {
			type: 'number',
			example: 100,
		},
		trx_quantity_in_coil: {
			type: 'number',
			example: 100,
		},
		quantity_in_coil: {
			type: 'number',
			example: 100,
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Tape-Coil',
	},
};

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

export const def_zipper_tape_to_coil = {
	type: 'object',
	required: [
		'uuid',
		'tape_coil_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		tape_coil_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_quantity: {
			type: 'number',
			example: 100,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Tape-To-Coil',
	},
};

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

export const def_zipper_tape_coil_production = {
	type: 'object',
	required: [
		'uuid',
		'section',
		'tape_coil_uuid',
		'production_quantity',
		'wastage',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section: {
			type: 'string',
			example: 'Molding',
		},
		tape_coil_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		production_quantity: {
			type: 'number',
			example: 100,
		},
		wastage: {
			type: 'number',
			example: 0,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Tape-Coil-Production',
	},
};

//....................FOR TESTING.......................
export const defZipper = {
	order_info: def_zipper_order_info,
	order_description: def_zipper_order_description,
	order_entry: def_zipper_order_entry,
	sfg: def_zipper_sfg,
	sfg_production: def_zipper_sfg_production,
	sfg_transaction: def_zipper_sfg_transaction,
	batch: def_zipper_batch,
	batch_entry: def_zipper_batch_entry,
	dying_batch: def_zipper_dying_batch,
	dying_batch_entry: def_zipper_dying_batch_entry,
	tape_coil: def_zipper_tape_coil,
	tape_to_coil: def_zipper_tape_to_coil,
	tape_coil_production: def_zipper_tape_coil_production,
};

export const tagZipper = [
	{
		name: 'zipper.order_info',
		description: 'Zipper Order Info',
	},
	{
		name: 'zipper.order_description',
		description: 'Zipper Order Description',
	},
	{
		name: 'zipper.order_entry',
		description: 'Zipper Order Entry',
	},
	{
		name: 'zipper.sfg',
		description: 'Zipper SFG',
	},
	{
		name: 'zipper.sfg_production',
		description: 'Zipper SFG Production',
	},
	{
		name: 'zipper.sfg_transaction',
		description: 'Zipper SFG Transaction',
	},
	{
		name: 'zipper.batch',
		description: 'Zipper Batch',
	},
	{
		name: 'zipper.batch_entry',
		description: 'Zipper Batch Entry',
	},
	{
		name: 'zipper.dying_batch',
		description: 'Zipper Dying Batch',
	},
	{
		name: 'zipper.dying_batch_entry',
		description: 'Zipper Dying Batch Entry',
	},
	{
		name: 'zipper.tape_coil',
		description: 'Zipper Tape Coil',
	},
	{
		name: 'zipper.tape_to_coil',
		description: 'Zipper Tape To Coil',
	},
	{
		name: 'zipper.tape_coil_production',
		description: 'Zipper Tape Coil Production',
	},
];

export default zipper;
