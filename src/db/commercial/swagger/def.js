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
		routing_no: SE.string('Routing No'),
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
		'commercial_executive',
		'party_bank',
		'expiry_date',
		'at_sight',
		'is_rtgs',
		'created_at',
		'created_by',
	],
	properties: {
		uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		id: SE.integer(1),
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
		document_receive_date: SE.date_time(),
		shipment_date: SE.date_time(),
		expiry_date: SE.date_time(),
		ud_no: SE.string('1234/2024'),
		ud_received: SE.date_time(),
		at_sight: SE.string('At Sight'),
		amd_date: SE.date_time(),
		amd_count: SE.integer(0),
		problematical: SE.integer(0),
		epz: SE.integer(0),
		is_rtgs: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/Lc',
});

export const defCommercialPiCash = SED({
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
		'is_pi',
		'conversion_rate',
		'receive_amount',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		lc_uuid: SE.uuid(),
		order_info_uuids: SE.array([SE.uuid()]),
		marketing_uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		merchandiser_uuid: SE.uuid(),
		factory_uuid: SE.uuid(),
		bank_uuid: SE.uuid(),
		validity: SE.integer(0),
		payment: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		is_pi: SE.integer(0),
		conversion_rate: SE.number(1000.0),
		receive_amount: SE.number(1000.0),
	},
	xml: 'Commercial/PiCash',
});

export const defCommercialPiCashEntry = SED({
	// type: 'object',
	required: [
		'uuid',
		'pi_cash_uuid',
		'sfg_uuid',
		'pi_cash_quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		pi_cash_uuid: SE.uuid(),
		sfg_uuid: SE.uuid(),
		pi_cash_quantity: SE.number(1000.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/PiCashEntry',
});

// * Marge All
export const defCommercial = {
	bank: defCommercialBank,
	lc: defCommercialLc,
	pi_cash: defCommercialPiCash,
	pi_cash_entry: defCommercialPiCashEntry,
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
		name: 'commercial.pi_cash',
		description: 'Operations about commercial pi',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.pi_cash_entry',
		description: 'Operations about commercial pi_entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];
