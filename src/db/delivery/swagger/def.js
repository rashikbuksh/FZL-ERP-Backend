//* ./schema.js#packing_list
export const defPackingList = {
	type: 'object',
	required: [
		'uuid',
		'carton_size',
		'carton_weight',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		carton_size: {
			type: 'string',
			example: '10x10x10',
		},
		carton_weight: {
			type: 'string',
			example: '10kg',
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
		name: 'Delivery/PackingList',
	},
};

export const defPackingListEntry = {
	type: 'object',
	required: [
		'uuid',
		'packing_list_uuid',
		'sfg_uuid',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		packing_list_uuid: {
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
		name: 'Delivery/PackingListEntry',
	},
};

export const defChallan = {
	type: 'object',
	required: [
		'uuid',
		'carton_quantity',
		'assign_to',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		carton_quantity: {
			type: 'number',
			example: 100,
		},
		assign_to: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		receive_status: {
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
		name: 'Delivery/Challan',
	},
};

export const defChallanEntry = {
	type: 'object',
	required: [
		'uuid',
		'challan_uuid',
		'packing_list_uuid',
		'delivery_quantity',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		challan_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		packing_list_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		delivery_quantity: {
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
		name: 'Delivery/ChallanEntry',
	},
};

// * Marge All

export const defDelivery = {
	packing_list: defPackingList,
	packing_list_entry: defPackingListEntry,
	challan: defChallan,
	challan_entry: defChallanEntry,
};

// * Tag
export const tagDelivery = [
	{
		name: 'delivery.packing_list',
		description: 'Operations about Packing List',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'delivery.packing_list_entry',
		description: 'Operations about Packing List Entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'delivery.challan',
		description: 'Operations about Challan',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'delivery.challan_entry',
		description: 'Operations about Challan Entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];
