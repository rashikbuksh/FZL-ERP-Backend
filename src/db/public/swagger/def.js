import SE, { SED } from '../../../util/swagger_example.js';
//* ./schema.js#buyer
export const defPublicBuyer = SED({
	required: ['uuid', 'name'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		short_name: SE.string('JD'),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/Buyer',
});

export const defPublicParty = SED({
	required: ['uuid', 'name', 'short_name', 'remarks'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		short_name: SE.string('JD'),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/Party',
});

export const defPublicMarketing = SED({
	required: ['uuid', 'name', 'user_uuid'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		short_name: SE.string('JD'),
		user_uuid: SE.uuid(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/Marketing',
});

export const defPublicMerchandiser = SED({
	required: ['uuid', 'party_uuid', 'name', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		name: SE.string('John Doe'),
		email: SE.string('johndoe@gmail.com'),
		phone: SE.string('123456789'),
		address: SE.string('Address'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
	},
	xml: 'Public/Merchandiser',
});

export const defPublicFactory = SED({
	required: ['uuid', 'party_uuid', 'name', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		name: SE.string('John Doe'),
		phone: SE.string('123456789'),
		address: SE.string('Address'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
	},
	xml: 'Public/Factory',
});

export const defPublicSection = SED({
	required: ['uuid', 'name'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		short_name: SE.string('JD'),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/Section',
});

export const defPublicProperties = SED({
	required: ['uuid', 'item_for', 'type', 'name', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		item_for: SE.string('Item For'),
		type: SE.string('Type'),
		name: SE.string('Name'),
		short_name: SE.string('Short Name'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/Properties',
});

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
