//* ./schema.js#buyer

export const defPublicBuyer = {
	type: 'object',
	required: ['uuid', 'name'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		short_name: {
			type: 'string',
			example: 'JD',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Public/Buyer',
	},
};

export const defPublicParty = {
	type: 'object',
	required: ['uuid', 'name', 'short_name', 'remarks'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		short_name: {
			type: 'string',
			example: 'JD',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Public/Party',
	},
};

export const defPublicMarketing = {
	type: 'object',
	required: ['uuid', 'name', 'user_uuid'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		short_name: {
			type: 'string',
			example: 'JD',
		},
		user_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Public/Marketing',
	},
};

export const defPublicMerchandiser = {
	type: 'object',
	required: ['uuid', 'party_uuid', 'name', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		party_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		email: {
			type: 'string',
			example: 'johndoe@gmail.com',
		},
		phone: {
			type: 'string',
			example: '1234567890',
		},
		address: {
			type: 'string',
			example: 'Address',
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
	},
	xml: {
		name: 'Public/Merchandiser',
	},
};

export const defPublicFactory = {
	type: 'object',
	required: ['uuid', 'party_uuid', 'name', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		party_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		phone: {
			type: 'string',
			example: '123456789',
		},
		address: {
			type: 'string',
			example: 'Address',
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
	},
	xml: {
		name: 'Public/Factory',
	},
};

export const defPublicSection = {
	type: 'object',
	required: ['uuid', 'name'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		short_name: {
			type: 'string',
			example: 'JD',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Public/Section',
	},
};

export const defPublicProperties = {
	type: 'object',
	required: ['uuid', 'item_for', 'type', 'name', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		item_for: {
			type: 'string',
			example: 'Item	for',
		},
		type: {
			type: 'string',
			example: 'Type',
		},
		name: {
			type: 'string',
			example: 'John Doe',
		},
		short_name: {
			type: 'string',
			example: 'JD',
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
		name: 'Public/Properties',
	},
};

// * Marge All
export const defPublic = {
	buyer: defPublicBuyer,
	party: defPublicParty,
	marketing: defPublicMarketing,
	merchandiser: defPublicMerchandiser,
	factory: defPublicFactory,
	section: defPublicSection,
	properties: defPublicProperties,
};

// * Tag
export const tagPublic = [
	{
		'public.buyer': {
			name: 'buyer',
			description: 'buyer',
		},
	},
	{
		'public.party': {
			name: 'party',
			description: 'party',
		},
	},
	{
		'public.marketing': {
			name: 'marketing',
			description: 'marketing',
		},
	},
	{
		'public.merchandiser': {
			name: 'merchandiser',
			description: 'merchandiser',
		},
	},
	{
		'public.factory': {
			name: 'factory',
			description: 'factory',
		},
	},
	{
		'public.section': {
			name: 'section',
			description: 'section',
		},
	},
	{
		'public.properties': {
			name: 'properties',
			description: 'properties',
		},
	},
];
