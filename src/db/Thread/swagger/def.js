import SE, { SED } from '../../../util/swagger_example.js';

export const defThreadCountLength = {
	type: 'object',
	required: [
		'uuid',
		'count',
		'length',
		'sst',
		'min_weight',
		'max_weight',
		'cone_per_carton',
		'price',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		count: SE.number(10),
		length: SE.number(10),
		sst: SE.number(10),
		min_weight: SE.number(10),
		max_weight: SE.number(10),
		cone_per_carton: SE.number(10),
		price: SE.number(10),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
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
		'is_cash',
		'delivery_date',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		party_uuid: SE.uuid(),
		marketing_uuid: SE.uuid(),
		factory_uuid: SE.uuid(),
		merchandiser_uuid: SE.uuid(),
		buyer_uuid: SE.uuid(),
		is_sample: SE.number(0),
		is_bill: SE.number(0),
		is_cash: SE.number(0),
		delivery_date: SE.date_time(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
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
		'recipe_uuid',
		'po',
		'style',
		'count_length_uuid',
		'quantity',
		'company_price',
		'party_price',
		'swatch_approval_date',
		'production_quantity',
		'bleaching',
		'created_by',
		'created_at',
		'pi',
		'delivered',
		'warehouse',
		'short_quantity',
		'reject_quantity',
		'production_quantity_in_kg',
		'carton_quantity',
	],

	properties: {
		uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		lab_reference: SE.string('lab_reference'),
		color: SE.string('color'),
		recipe_uuid: SE.uuid(),
		po: SE.string('po'),
		style: SE.string('style'),
		count_length_uuid: SE.uuid(),
		quantity: SE.number(10),
		company_price: SE.number(10),
		party_price: SE.number(10),
		swatch_approval_date: SE.date_time(),
		production_quantity: SE.number(10),
		bleaching: SE.string('bleaching'),
		transfer_quantity: SE.number(10),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		pi: SE.string('pi'),
		delivered: SE.number(10),
		warehouse: SE.number(10),
		short_quantity: SE.number(10),
		reject_quantity: SE.number(10),
		production_quantity_in_kg: SE.number(10),
		carton_quantity: SE.number(10),
	},
	xml: {
		name: 'Thread/OrderEntry',
	},
};

export const defThreadBatch = {
	type: 'object',
	required: [
		'uuid',
		'machine_uuid',
		'slot',
		'lab_created_by',
		'lab_created_at',
		'dyeing_operator',
		'reason',
		'category',
		'status',
		'pass_by',
		'shift',
		'dyeing_supervisor',
		'dyeing_created_by',
		'dyeing_created_at',
		'yarn_quantity',
		'yarn_issue_created_by',
		'yarn_issue_created_at',
		'is_drying_complete',
		'drying_created_at',
		'coning_operator',
		'coning_supervisor',
		'coning_machines',
		'coning_created_by',
		'coning_created_at',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		machine_uuid: SE.uuid(),
		slot: SE.integer(1),
		lab_created_by: SE.uuid(),
		lab_created_at: SE.date_time(),
		lab_updated_at: SE.date_time(),
		dyeing_operator: SE.uuid(),
		reason: SE.string('reason'),
		category: SE.string('category'),
		status: SE.string('status'),
		pass_by: SE.uuid(),
		shift: SE.string('shift'),
		dyeing_supervisor: SE.uuid(),
		dyeing_created_by: SE.uuid(),
		dyeing_created_at: SE.date_time(),
		dyeing_updated_at: SE.date_time(),
		yarn_quantity: SE.number(10),
		yarn_issue_created_by: SE.uuid(),
		yarn_issue_created_at: SE.date_time(),
		yarn_issue_updated_at: SE.date_time(),
		is_drying_complete: {
			type: 'string',
			example: 'Dyeing Complete',
		},
		drying_created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		drying_updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
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
		coning_created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		coning_created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		coning_updated_at: {
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
		'coning_carton_quantity',
		'transfer_carton_quantity',
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
		coning_carton_quantity: {
			type: 'number',
			example: 10.0,
		},
		transfer_quantity: {
			type: 'number',
			example: 10.0,
		},
		transfer_carton_quantity: {
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

export const defThreadDyesCategory = {
	type: 'object',
	required: [
		'uuid',
		'name',
		'upto_percentage',
		'bleaching',
		'id',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Dyes Category Name',
		},
		upto_percentage: {
			type: 'number',
			example: 10.0,
		},
		bleaching: {
			type: 'string',
			example: 'Bleaching',
		},
		id: {
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
		name: 'Thread/DyesCategory',
	},
};

export const defThreadPrograms = {
	type: 'object',
	required: [
		'uuid',
		'dyes_category_uuid',
		'material_uuid',
		'quantity',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		dyes_category_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
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
		name: 'Thread/Programs',
	},
};

export const defThreadBatchEntryProduction = {
	type: 'object',
	required: [
		'uuid',
		'batch_entry_uuid',
		'production_quantity',
		'coning_carton_quantity',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		batch_entry_uuid: SE.uuid(),
		production_quantity: SE.number(10),
		coning_carton_quantity: SE.number(10),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: {
		name: 'Thread/BatchEntryProduction',
	},
};

export const defThreadBatchEntryTrx = {
	type: 'object',
	required: [
		'uuid',
		'batch_entry_uuid',
		'quantity',
		'carton_quantity',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		batch_entry_uuid: SE.uuid(),
		quantity: SE.number(10),
		carton_quantity: SE.number(10),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: {
		name: 'Thread/BatchEntryTrx',
	},
};

export const defThreadChallan = {
	type: 'object',
	required: [
		'uuid',
		'order_info_uuid',
		'carton_quantity',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		carton_quantity: SE.number(10),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: {
		name: 'Thread/Challan',
	},
};

export const defThreadChallanEntry = {
	type: 'object',
	required: [
		'uuid',
		'challan_uuid',
		'order_entry_uuid',
		'quantity',
		'created_by',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		challan_uuid: SE.uuid(),
		order_entry_uuid: SE.uuid(),
		quantity: SE.number(10),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: {
		name: 'Thread/ChallanEntry',
	},
};

// * Marge All

export const defThread = {
	count_length: defThreadCountLength,
	order_info: defThreadOrderInfo,
	order_entry: defThreadOrderEntry,
	batch: defThreadBatch,
	batch_entry: defThreadBatchEntry,
	dyes_category: defThreadDyesCategory,
	programs: defThreadPrograms,
	batch_entry_production: defThreadBatchEntryProduction,
	batch_entry_trx: defThreadBatchEntryTrx,
	challan: defThreadChallan,
	challan_entry: defThreadChallanEntry,
};

// * Tag
export const tagThread = [
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
	{
		name: 'thread.dyes_category',
		description: 'Thread Dyes Category',
	},
	{
		name: 'thread.programs',
		description: 'Thread Programs',
	},
	{
		name: 'thread.batch_entry_production',
		description: 'Thread Batch Entry Production',
	},
	{
		name: 'thread.batch_entry_trx',
		description: 'Thread Batch Entry Trx',
	},
	{
		name: 'thread.challan',
		description: 'Thread Challan',
	},
	{
		name: 'thread.challan_entry',
		description: 'Thread Challan Entry',
	},
];
