// */schema.js#vendor

export const defPurchaseVendor = {
	type: 'object',
	required: ['uuid', 'name', 'email', 'office_address'],
	properties: {
		uuid: {
			type: 'string',
			example: '123e4567-e89b-12d3-a456-426614174000',
		},
		name: {
			type: 'string',
			example: 'Z Group',
		},
		contact_name: {
			type: 'string',
			example: 'Jahid Hasan',
		},
		email: {
			type: 'string',
			example: 'z456@gmail.com',
		},
		office_address: {
			type: 'string',
			example: 'Dhaka, Bangladesh',
		},
		contact_number: {
			type: 'string',
			example: '01700000000',
		},
		remarks: {
			type: 'string',
			example: 'This is a vendor',
		},
	},
	xml: {
		name: 'Purchase/Vendor',
	},
};

export const defPurchaseDescription = {
	type: 'object',
	required: ['uuid', 'vendor_uuid', 'created_by', 'created_at', 'is_local'],
	properties: {
		uuid: {
			type: 'string',
			example: '123e4567-e89b-12d3-a456-426614174002',
		},
		vendor_uuid: {
			type: 'string',
			example: '123e4567-e89b-12d3-a456-426614174000',
		},
		is_local: {
			type: 'integer',
			example: 1,
		},
		lc_number: {
			type: 'string',
			example: '1234',
		},
		created_by: {
			type: 'string',
			example: '1234567890',
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
			example: 'This is a description',
		},
	},
	xml: {
		name: 'Purchase/Description',
	},
};

export const defPurchaseEntry = {
	type: 'object',
	required: [
		'uuid',
		'purchase_description_uuid',
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
		purchase_description_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 1000.0,
		},
		price: {
			type: 'number',
			example: 1111.0,
		},
		created_by: {
			type: 'string',
			example: '1234567890',
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
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Purchase/Entry',
	},
};

// * Marge All * //
export const defPurchase = {
	vendor: defPurchaseVendor,
	description: defPurchaseDescription,
	entry: defPurchaseEntry,
};

// * Tag //
export const tagPurchase = [
	{
		'purchase.vendor': {
			name: 'Vendor',
			description: 'Vendor',
		},
	},
	{
		'purchase.description': {
			name: 'Description',
			description: 'Description',
		},
	},
	{
		'purchase.entry': {
			name: 'Entry',
			description: 'Entry',
		},
	},
];
