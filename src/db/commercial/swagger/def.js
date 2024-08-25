import SE, { SED } from '../../../util/swagger_example.js';

//* ./schema.js#bank

export const defCommercialBank = SED({
	// type: 'object',
	required: ['uuid', 'name', 'swift_code', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Bangladesh Bank'),
		swift_code: SE.string('BB'),
		address: SE.string('Dhaka, Bangladesh'),
		policy: SE.string('Policy'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/Bank',
});

export const defCommercialLc = SED({
	type: 'object',
	required: [
		'uuid',
		'party_uuid',
		'file_no',
		'lc_number',
		'lc_date',
		'ldbc_fdbc',
		'commercial_executive',
		'party_bank',
		'expiry_date',
		'at_sight',
		'created_at',
		'created_by',
	],
	properties: {
		uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		file_no: SE.string('1234/2024'),
		lc_number: SE.string('1234/2024'),
		lc_date: SE.date_time(),
		payment_value: SE.number(1000.0),
		payment_date: SE.date_time(),
		ldbc_fdbc: SE.string('LDBC'),
		acceptance_date: SE.date_time(),
		maturity_date: SE.date_time(),
		commercial_executive: SE.string('John Doe'),
		party_bank: SE.string('Bangladesh Bank'),
		production_complete: SE.integer(0),
		lc_cancel: SE.integer(0),
		handover_date: SE.date_time(),
		shipment_date: SE.date_time(),
		expiry_date: SE.date_time(),
		ud_no: SE.string('1234/2024'),
		ud_received: SE.date_time(),
		at_sight: SE.string('At Sight'),
		amd_date: SE.date_time(),
		amd_count: SE.integer(0),
		problematical: SE.integer(0),
		epz: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Commercial/Lc',
	},
});

export const defCommercialPi = {
	type: 'object',
	required: [
		'uuid',
		'lc_uuid',
		'order_info_ids',
		'marketing_uuid',
		'party_uuid',
		'merchandiser_uuid',
		'factory_uuid',
		'bank_uuid',
		'validity',
		'payment',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: {
			type: 'integer',
			example: 1,
		},
		lc_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_info_uuids: {
			type: 'array',
			items: {
				type: 'string',
			},
			example: '[{"J3Au9M73Zb9saxj"}]',
		},
		marketing_uuid: {
			type: 'string',
			example: 'j14NcevenyrWSei',
		},
		party_uuid: {
			type: 'string',
			example: 'cf-daf86b3eedf1',
		},
		merchandiser_uuid: {
			type: 'string',
			example: 'LDedGLTqSAipBf1',
		},
		factory_uuid: {
			type: 'string',
			example: 'cf-daf86b3eedf1',
		},
		bank_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		validity: {
			type: 'integer',
			example: 0,
		},
		payment: {
			type: 'integer',
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
		name: 'Commercial/Pi',
	},
};

export const defCommercialPiEntry = {
	type: 'object',
	required: ['uuid', 'pi_uuid', 'sfg_uuid', 'pi_quantity', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		pi_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		sfg_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		pi_quantity: {
			type: 'number',
			example: 1000.0,
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
		name: 'Commercial/PiEntry',
	},
};

// * Marge All
export const defCommercial = {
	bank: defCommercialBank,
	lc: defCommercialLc,
	pi: defCommercialPi,
	pi_entry: defCommercialPiEntry,
};

// * Tag
export const tagCommercial = [
	{
		name: 'commercial.bank',
		description: 'Everything about commercial bank',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.lc',
		description: 'Operations about commercial lc',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.pi',
		description: 'Operations about commercial pi',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.pi_entry',
		description: 'Operations about commercial pi_entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];
