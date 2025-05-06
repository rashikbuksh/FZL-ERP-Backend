import SE, { SED } from '../../../util/swagger_example.js';
// */schema.js#vendor
export const defPurchaseVendor = SED({
	required: [
		'uuid',
		'name',
		'email',
		'office_address',
		'contact_number',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Z Group'),
		contact_name: SE.string('Jahid Hasan'),
		email: SE.string('z456@gmail.com'),
		office_address: SE.string('Dhaka, Bangladesh'),
		contact_number: SE.string('01700000000'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('This is a vendor'),
		store_type: SE.string('rm'),
	},
	xml: 'Purchase/Vendor',
});

export const defPurchaseDescription = SED({
	required: ['uuid', 'vendor_uuid', 'created_by', 'created_at', 'is_local'],
	properties: {
		uuid: SE.uuid(),
		vendor_uuid: SE.uuid(),
		is_local: SE.integer(1),
		lc_number: SE.string('1234'),
		challan_number: SE.string('1234'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('This is a description'),
		store_type: SE.string('rm'),
	},
	xml: 'Purchase/Description',
});

export const defPurchaseEntry = SED({
	required: [
		'uuid',
		'purchase_description_uuid',
		'material_uuid',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		purchase_description_uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		quantity: SE.number(1000.0),
		price: SE.number(1111.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('This is a entry'),
	},
	xml: 'Purchase/Entry',
});

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
