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
	required: ['uuid', 'name', 'short_name', 'created_at', 'created_by'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		short_name: SE.string('JD'),
		address: SE.string('Address'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		created_by: SE.uuid(),
		remarks: SE.string('Remarks'),
		parent_party_uuid: SE.uuid(),
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
		created_by: SE.uuid(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/Factory',
});

export const defPublicSection = SED({
	required: ['uuid', 'name'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		short_name: SE.string('JD'),
		order_sheet_name: SE.string('JD (JD)'),
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

export const defMachine = {
	type: 'object',
	required: [
		'uuid',
		'name',
		'max_capacity',
		'min_capacity',
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
			example: 'Machine Name',
		},
		is_nylon: {
			type: 'number',
			example: 1,
		},
		is_metal: {
			type: 'number',
			example: 1,
		},
		is_vislon: {
			type: 'number',
			example: 1,
		},
		is_sewing_thread: {
			type: 'number',
			example: 1,
		},
		is_bulk: {
			type: 'number',
			example: 1,
		},
		is_sample: {
			type: 'number',
			example: 1,
		},
		max_capacity: {
			type: 'number',
			example: 10.0,
		},
		min_capacity: {
			type: 'number',
			example: 10.0,
		},
		water_capacity: {
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
		name: 'Public/Machine',
	},
};

export const defMarketingTeam = SED({
	required: ['uuid', 'name', 'created_at', 'created_by'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		created_by: SE.uuid(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/MarketingTeam',
});

export const defMarketingTeamEntry = SED({
	required: ['uuid', 'marketing_team_uuid', 'marketing_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		marketing_team_uuid: SE.uuid(),
		marketing_uuid: SE.uuid(),
		is_team_leader: SE.boolean(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		created_by: SE.uuid(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/MarketingTeamEntry',
});

export const defMarketingTeamMemberTarget = {
	required: [
		'uuid',
		'marketing_uuid',
		'year',
		'month',
		'amount',
		'created_at',
		'created_by',
	],

	properties: {
		uuid: SE.uuid(),
		marketing_uuid: SE.uuid(),
		year: SE.integer(),
		month: SE.integer(),
		amount: SE.number(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		created_by: SE.uuid(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/MarketingTeamMemberTarget',
};

export const defProductionCapacity = {
	required: [
		'uuid',
		'product',
		'item',
		'nylon_stopper',
		'zipper_number',
		'created_at',
	],

	properties: {
		uuid: SE.uuid(),
		product: SE.string('zipper'),
		item: SE.uuid(),
		nylon_stopper: SE.uuid(),
		zipper_number: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		created_by: SE.uuid(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Public/ProductionCapacity',
};

export const defSubscribe = SED({
	required: ['endpoint', 'expiration_time'],
	properties: {
		id: SE.integer(),
		endpoint: SE.string('https://example.com/endpoint'),
		created_at: SE.date_time(),
	},
	xml: 'Public/Subscribe',
});

export const defComplaint = SED({
	required: ['uuid', 'name', 'created_at', 'created_by'],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		thread_order_info_uuid: SE.uuid(),
		file: SE.array(SE.file()),
		name: SE.string('Complaint Name'),
		description: SE.string('Description of the complaint'),
		root_cause_analysis: SE.string('Root cause analysis details'),
		issue_department: SE.string('Department responsible for the issue'),
		solution: SE.string('Proposed solution for the complaint'),
		future_proof: SE.string('Measures to prevent future occurrences'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		created_by: SE.uuid(),
		updated_by: SE.uuid(),
		remarks: SE.string('Additional remarks about the complaint'),
		is_resolved: SE.boolean(),
	},
	xml: 'Public/Complaint',
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
	machine: defMachine,
	marketing_team: defMarketingTeam,
	marketing_team_entry: defMarketingTeamEntry,
	marketing_team_member_target: defMarketingTeamMemberTarget,
	production_capacity: defProductionCapacity,
	subscribe: defSubscribe,
	complaint: defComplaint,
};

// * Tag
export const tagPublic = [
	{
		name: 'public.buyer',
		description: 'buyer',
	},
	{
		name: 'public.party',
		description: 'party',
	},
	{
		name: 'public.marketing',
		description: 'marketing',
	},
	{
		name: 'public.merchandiser',
		description: 'merchandiser',
	},
	{
		name: 'public.factory',
		description: 'factory',
	},
	{
		name: 'public.section',
		description: 'section',
	},
	{
		name: 'public.properties',
		description: 'properties',
	},
	{
		name: 'public.machine',
		description: 'Machine',
	},

	{
		name: 'public.marketing_team',
		description: 'marketing_team',
	},
	{
		name: 'public.marketing_team_entry',
		description: 'marketing_team_entry',
	},
	{
		name: 'public.marketing_team_member_target',
		description: 'marketing_team_member_target',
	},
	{
		name: 'public.production_capacity',
		description: 'production_capacity',
	},
	{
		name: 'public.subscribe',
		description: 'subscribe',
	},
];
