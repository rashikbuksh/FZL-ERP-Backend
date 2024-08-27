export const defThreadMachine = {
	type: 'object',
	required: ['uuid', 'name', 'capacity', 'created_by', 'created_at'],

	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Machine Name',
		},
		capacity: {
			type: 'number',
			example: 10.0,
		},
		water_capacity: {
			type: 'number',
			example: 10.0,
		},
		leveling_agent_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		leveling_agent_quantity: {
			type: 'number',
			example: 10.0,
		},
		buffering_agent_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		buffering_agent_quantity: {
			type: 'number',
			example: 10.0,
		},
		sequestering_agent_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		sequestering_agent_quantity: {
			type: 'number',
			example: 10.0,
		},
		caustic_soad_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		caustic_soad_quantity: {
			type: 'number',
			example: 10.0,
		},
		hydros_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		hydros_quantity: {
			type: 'number',
			example: 10.0,
		},
		neotrolizer_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		neotrolizer_quantity: {
			type: 'number',
			example: 10.0,
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
		name: 'Thread/Machine',
	},
};

export const defThreadCountLength = {
	type: 'object',
	required: [
		'uuid',
		'count',
		'length',
		'weight',
		'sst',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		count: {
			type: 'number',
			example: 10.0,
		},
		length: {
			type: 'number',
			example: 10.0,
		},
		weight: {
			type: 'number',
			example: 10.0,
		},
		sst: {
			type: 'string',
			example: 'SST',
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
		name: 'Thread/CountLength',
	},
};

export const defThreadOrderInfo = {
	type: 'object',
	required: [
		'uuid',
		'id',
		'party_uuid',
		'marketing_uuid',
		'factory_uuid',
		'merchandiser_uuid',
		'buyer_uuid',
		'is_sample',
		'is_bill',
		'delivery_date',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: {
			type: 'number',
			example: 0,
		},
		party_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		marketing_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		factory_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		merchandiser_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		buyer_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		is_sample: {
			type: 'string',
			example: 'Sample',
		},
		is_bill: {
			type: 'string',
			example: 'Bill',
		},
		delivery_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
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
		name: 'Thread/OrderInfo',
	},
};

export const defThreadOrderEntry = {
	type: 'object',
	required: [
		'uuid',
		'order_info_uuid',
		'lab_reference',
		'color',
		'shade_recipe_uuid',
		'po',
		'style',
		'count_length_uuid',
		'quantity',
		'company_price',
		'party_price',
		'swatch_approval_date',
		'production_quantity',
		'created_by',
		'created_at',
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
		lab_reference: {
			type: 'string',
			example: 'Lab Reference',
		},
		color: {
			type: 'string',
			example: 'Color',
		},
		shade_recipe_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		po: {
			type: 'string',
			example: 'PO',
		},
		style: {
			type: 'string',
			example: 'Style',
		},
		count_length_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 10.0,
		},
		company_price: {
			type: 'number',
			example: 10.0,
		},
		party_price: {
			type: 'number',
			example: 10.0,
		},
		swatch_approval_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		production_quantity: {
			type: 'number',
			example: 10.0,
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
		name: 'Thread/OrderEntry',
	},
};

export const defThreadBatch = {
	type: 'object',
	required: [
		'uuid',
		'id',
		'dyeing_operator',
		'reason',
		'category',
		'status',
		'pass_by',
		'shift',
		'yarn_quantity',
		'dyeing_supervisor',
		'is_dyeing_complete',
		'coning_operator',
		'coning_supervisor',
		'coning_machines',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: {
			type: 'number',
			example: 0,
		},
		dyeing_operator: {
			type: 'string',
			example: 'Dyeing Operator',
		},
		reason: {
			type: 'string',
			example: 'Reason',
		},
		category: {
			type: 'string',
			example: 'Category',
		},
		status: {
			type: 'string',
			example: 'Status',
		},
		pass_by: {
			type: 'string',
			example: 'Pass By',
		},
		shift: {
			type: 'string',
			example: 'Shift',
		},
		yarn_quantity: {
			type: 'number',
			example: 10.0,
		},
		dyeing_supervisor: {
			type: 'string',
			example: 'Dyeing Supervisor',
		},
		is_dyeing_complete: {
			type: 'string',
			example: 'Dyeing Complete',
		},
		coning_operator: {
			type: 'string',
			example: 'Coning Operator',
		},
		coning_supervisor: {
			type: 'string',
			example: 'Coning Supervisor',
		},
		coning_machines: {
			type: 'string',
			example: 'Coning Machines',
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
		name: 'Thread/Batch',
	},
};

export const defThreadBatchEntry = {
	type: 'object',
	required: [
		'uuid',
		'batch_uuid',
		'order_entry_uuid',
		'quantity',

		'coning_production_quantity',
		'coning_production_quantity_in_kg',
		'created_by',
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
		order_entry_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 10.0,
		},

		coning_production_quantity: {
			type: 'number',
			example: 10.0,
		},
		coning_production_quantity_in_kg: {
			type: 'number',
			example: 10.0,
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
		name: 'Thread/BatchEntry',
	},
};

// * Marge All

export const defThread = {
	machine: defThreadMachine,
	count_length: defThreadCountLength,
	order_info: defThreadOrderInfo,
	order_entry: defThreadOrderEntry,
	batch: defThreadBatch,
	batch_entry: defThreadBatchEntry,
};

// * Tag
export const tagThread = [
	{
		name: 'thread.machine',
		description: 'Thread Machine',
	},
	{
		name: 'thread.count_length',
		description: 'Thread Count Length',
	},
	{
		name: 'thread.order_info',
		description: 'Thread Order Info',
	},
	{
		name: 'thread.order_entry',
		description: 'Thread Order Entry',
	},
	{
		name: 'thread.batch',
		description: 'Thread Batch',
	},
	{
		name: 'thread.batch_entry',
		description: 'Thread Batch Entry',
	},
];
