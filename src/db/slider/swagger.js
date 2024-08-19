// * ./schema.js#stock
export const defStock = {
	type: 'object',
	required: [
		'uuid',
		'order_info_uuid',
		'item',
		'zipper_number',
		'end_type',
		'puller_type',
		'color',
		'order_quantity',
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
		puller_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		color: {
			type: 'string',
			example: 'red',
		},
		order_quantity: {
			type: 'number',
			example: 0.0,
		},
		body_quantity: {
			type: 'number',
			example: 0.0,
		},
		cap_quantity: {
			type: 'number',
			example: 0.0,
		},
		puller_quantity: {
			type: 'number',
			example: 0.0,
		},
		link_quantity: {
			type: 'number',
			example: 0.0,
		},
		sa_prod: {
			type: 'number',
			example: 0.0,
		},
		coloring_stock: {
			type: 'number',
			example: 0.0,
		},
		coloring_prod: {
			type: 'number',
			example: 0.0,
		},
		trx_to_finishing: {
			type: 'number',
			example: 0.0,
		},
		u_top_quantity: {
			type: 'number',
			example: 0.0,
		},
		h_bottom_quantity: {
			type: 'number',
			example: 0.0,
		},
		box_pin_quantity: {
			type: 'number',
			example: 0.0,
		},
		two_way_pin_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/Stock',
	},
};

export const defDieCasting = {
	type: 'object',
	required: [
		'uuid',
		'name',
		'item',
		'zipper_number',
		'end_type',
		'puller_type',
		'logo_type',
		'puller_link',
		'stopper_type',
		'quantity',
		'weight',
		'pcs_per_kg',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'die_casting 1',
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
		puller_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		logo_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		body_shape: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_link: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stopper_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 0.0,
		},
		weight: {
			type: 'number',
			example: 0.0,
		},
		pcs_per_kg: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/DieCasting',
	},
};
export const defDieCastingProduction = {
	type: 'object',
	required: [
		'uuid',
		'die_casting_uuid',
		'mc_no',
		'cavity_goods',
		'cavity_defect',
		'push',
		'weight',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		die_casting_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		mc_no: {
			type: 'number',
			example: 0,
		},
		cavity_goods: {
			type: 'number',
			example: 0,
		},
		cavity_defect: {
			type: 'number',
			example: 0,
		},
		push: {
			type: 'number',
			example: 0,
		},
		weight: {
			type: 'number',
			example: 0.0,
		},
		order_info_uuid: {
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/DieCastingProduction',
	},
};
export const defDieCastingTransaction = {
	type: 'object',
	required: [
		'uuid',
		'die_casting_uuid',
		'stock_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		die_casting_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stock_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/DieCastingTransaction',
	},
};
export const defTransaction = {
	type: 'object',
	required: [
		'uuid',
		'stock_uuid',
		'section',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stock_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section: {
			type: 'string',
			example: 'section',
		},
		trx_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/Transaction',
	},
};
export const defColoringTransaction = {
	type: 'object',
	required: [
		'uuid',
		'stock_uuid',
		'order_info_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stock_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/ColoringTransaction',
	},
};

// * Marge All
export const defSlider = {
	die_casting: defDieCasting,
	die_casting_production: defDieCastingProduction,
	die_casting_transaction: defDieCastingTransaction,
	stock: defStock,
	transaction: defTransaction,
	coloring_transaction: defColoringTransaction,
};

// * Tag
export const tagSlider = [
	{
		name: 'slider.stock',
		description: 'Stock',
	},
	{
		name: 'slider.die_casting',
		description: 'Die Casting',
	},
	{
		name: 'slider.die_casting_production',
		description: 'Die Casting Production',
	},
	{
		name: 'slider.die_casting_transaction',
		description: 'Die Casting Transaction',
	},
	{
		name: 'slider.transaction',
		description: 'Transaction',
	},
	{
		name: 'slider.coloring_transaction',
		description: 'Coloring Transaction',
	},
];

// * PATH
