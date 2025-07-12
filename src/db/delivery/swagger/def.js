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
		'carton_uuid',
		'created_by',
		'created_at',
		'is_warehouse_received',
	],
	properties: {
		uuid: SE.uuid(),
		carton_size: SE.string('10x10x10'),
		carton_weight: SE.string('10kg'),
		order_info_uuid: SE.uuid(),
		challan_uuid: SE.uuid(),
		carton_uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		is_warehouse_received: SE.boolean(false),
		gate_pass: SE.number(0),
		item_for: SE.string('zipper'),
		thread_order_info_uuid: SE.uuid(),
		warehouse_received_date: SE.date_time(),
		gate_pass_date: SE.date_time(),
		warehouse_received_by: SE.uuid(),
		gate_pass_by: SE.uuid(),
		is_deleted: SE.boolean(false),
		deleted_time: SE.date_time(),
		deleted_by: SE.uuid(),
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
		poli_quantity: SE.number(0),
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
		'vehicle_uuid',
		'carton_quantity',
		'assign_to',
		'get_pass',
		'receive_status',
		'name',
		'delivery_cost',
		'is_hand_delivery',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		vehicle_uuid: SE.uuid(),
		carton_quantity: SE.number(100),
		assign_to: SE.uuid(),
		get_pass: SE.number(0),
		is_own: SE.boolean(false),
		receive_status: SE.number(0),
		name: SE.string('name'),
		delivery_cost: SE.number(100),
		is_hand_delivery: SE.boolean(false),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		delivery_date: SE.date_time(),
		delivery_type: SE.string('delivery_type'),
		thread_order_info_uuid: SE.uuid(),
		receive_status_by: SE.uuid(),
		receive_status_date: SE.date_time(),
		is_delivered_by: SE.uuid(),
		is_delivered_date: SE.date_time(),
		is_out_for_delivery: SE.boolean(false),
		is_out_for_delivery_by: SE.uuid(),
		is_out_for_delivery_date: SE.date_time(),
	},
	xml: 'Delivery/Challan',
});

export const defVehicle = SED({
	// type: 'object',
	required: [
		'uuid',
		'type',
		'name',
		'number',
		'driver_name',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		type: SE.string('type'),
		name: SE.string('name'),
		number: SE.string('number'),
		driver_name: SE.string('driver_name'),
		active: SE.number(1),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/Vehicle',
});

export const defCarton = SED({
	// type: 'object',
	required: ['uuid', 'size', 'name', 'used_for', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		size: SE.string('size'),
		name: SE.string('name'),
		used_for: SE.string('used_for'),
		active: SE.number(1),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/Carton',
});

export const defQuantityReturn = SED({
	// type: 'object',
	required: ['uuid', 'created_at', 'created_by'],
	properties: {
		uuid: SE.uuid(),
		id: SE.number(1),
		order_entry_uuid: SE.uuid(),
		thread_order_entry_uuid: SE.uuid(),
		fresh_quantity: SE.number(0),
		repair_quantity: SE.number(0),
		is_completed: SE.boolean(false),
		completed_date: SE.date_time(),
		completed_by: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Delivery/QuantityReturn',
});

// * Marge All

export const defDelivery = {
	packing_list: defPackingList,
	packing_list_entry: defPackingListEntry,
	challan: defChallan,
	vehicle: defVehicle,
	carton: defCarton,
	quantity_return: defQuantityReturn,
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
		name: 'delivery.vehicle',
		description: 'Operations about Vehicle',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'delivery.carton',
		description: 'Operations about Carton',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'delivery.quantity_return',
		description: 'Operations about Quantity Return',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];
