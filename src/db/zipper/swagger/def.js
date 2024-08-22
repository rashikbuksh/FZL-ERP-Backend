// * Zipper Order Info * //
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

// * Zipper Order Description * //
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

// * Zipper Order Entry * //
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

// * Zipper Sfg * //
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

// * Zipper Sfg production * //
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

// * Zipper sfg transaction * //
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

// * Zipper Batch * //
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
// * Zipper Dyeing Batch Entry * //
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

// * Zipper Dyeing Batch * //
export const def_zipper_dying_batch = {
	type: 'object',
	required: ['uuid', 'mc_no', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: {
			type: 'serial',
			example: 1,
		},
		mc_no: {
			type: 'integer',
			example: 1,
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
		name: 'Zipper/Dying-Batch',
	},
};

// * Zipper Dyeing Batch Entry * //
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
			example: 'igD0v9DIJQhJeet',
		},
		dying_batch_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		batch_entry_uuid: {
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
		name: 'Zipper/Dying-Batch-Entry',
	},
};

// * Zipper Tape Coil * //
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

// * Zipper Tape To Coil * //
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

// * Zipper Tape Coil Production * //
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

// * Zipper Planning * //
export const def_zipper_planning = {
	type: 'object',
	required: ['week', 'created_by', 'created_at'],
	properties: {
		week: {
			type: 'string',
			example: '24-32',
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
		name: 'Zipper/Planning',
	},
};

// * Zipper Planning Entry * //
export const def_zipper_planning_entry = {
	type: 'object',
	required: [
		'uuid',
		'planning_week',
		'sfg_uuid',
		'sno_quantity',
		'factory_quantity',
		'production_quantity',
		'batch_production_quantity',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		planning_week: {
			type: 'string',
			example: '24-32',
		},
		sfg_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		sno_quantity: {
			type: 'number',
			example: 100,
		},
		factory_quantity: {
			type: 'number',
			example: 100,
		},
		production_quantity: {
			type: 'number',
			example: 100,
		},
		batch_production_quantity: {
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
		sno_remarks: {
			type: 'string',
			example: 'Remarks',
		},
		factory_remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Planning-Entry',
	},
};
// * Zipper material trx against order description * //
export const def_zipper_material_trx_against_order_description = {
	type: 'object',
	required: [
		'uuid',
		'order_description_uuid',
		'material_uuid',
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
		order_description_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_to: {
			type: 'string',
			example: 'teeth_molding',
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
		name: 'Zipper/Material_trx_against_order_description',
	},
};
// * Zipper tape coil to dyeing * //

export const def_zipper_tape_coil_to_dyeing = {
	type: 'object',
	required: [
		'uuid',
		'tape_coil_uuid',
		'order_description_uuid',
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
		order_description_uuid: {
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
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Zipper/Tape-Coil-To-Dyeing',
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
	planning: def_zipper_planning,
	planning_entry: def_zipper_planning_entry,
	material_trx_against_order_description:
		def_zipper_material_trx_against_order_description,
	tape_coil_to_dyeing: def_zipper_tape_coil_to_dyeing,
};

// * Zipper Tag * //
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
	{
		name: 'zipper.planning',
		description: 'Zipper Planning',
	},
	{
		name: 'zipper.planning_entry',
		description: 'Zipper Planning Entry',
	},
	{
		name: 'zipper.material_trx_against_order_description',
		description: 'Zipper Material Trx Against Order Description',
	},
	{
		name: 'zipper.tape_coil_to_dyeing',
		description: 'Zipper Tape Coil To Dyeing',
	},
];
