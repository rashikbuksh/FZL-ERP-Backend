import SE, { SED } from '../../../util/swagger_example.js';

//* ./schema.js#packing_list
export const defPackingList = SED({
	// type: 'object',
	required: [
		'uuid',
		'carton_size',
		'carton_weight',
		'order_info_uuid',
		'challan_uuid',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		carton_size: SE.string('10x10x10'),
		carton_weight: SE.string('10kg'),
		order_info_uuid: SE.uuid(),
		challan_uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/PackingList',
});

export const defPackingListEntry = SED({
	// type: 'object',
	required: [
		'uuid',
		'packing_list_uuid',
		'sfg_uuid',
		'quantity',
		'short_quantity',
		'reject_quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		packing_list_uuid: SE.uuid(),
		sfg_uuid: SE.uuid(),
		quantity: SE.number(100),
		short_quantity: SE.number(0),
		reject_quantity: SE.number(0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/PackingListEntry',
});

export const defChallan = SED({
	type: 'object',
	required: [
		'uuid',
		'order_info_uuid',
		'carton_quantity',
		'assign_to',
		'get_pass',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		carton_quantity: SE.number(100),
		assign_to: SE.uuid(),
		get_pass: SE.number(0),
		receive_status: SE.number(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/Challan',
});

export const defChallanEntry = SED({
	// type: 'object',
	required: ['uuid', 'challan_uuid', 'packing_list_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		challan_uuid: SE.uuid(),
		packing_list_uuid: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/ChallanEntry',
});

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
		name: 'delivery.packing-list',
		description: 'Operations about Packing List',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'delivery.packing-list-entry',
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
		name: 'delivery.challan-entry',
		description: 'Operations about Challan Entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];
