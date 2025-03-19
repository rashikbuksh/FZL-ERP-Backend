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
		created_by: SE.uuid(),
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
		'is_old_pi',
		'pi_number',
		'lc_value',
		'export_lc_number',
		'export_lc_date',
		'export_expire_date',
		'up_date',
		'up_number',
		'created_at',
		'created_by',
	],
	properties: {
		uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		id: SE.integer(1),
		lc_number: SE.string('1234/2024'),
		lc_date: SE.date_time(),
		commercial_executive: SE.string('John Doe'),
		party_bank: SE.string('Bangladesh Bank'),
		production_complete: SE.integer(0),
		lc_cancel: SE.integer(0),
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
		is_old_pi: SE.integer(0),
		pi_number: SE.string('1234/2024'),
		lc_value: SE.number(1000.0),
		export_lc_number: SE.string('1234/2024'),
		export_lc_date: SE.date_time(),
		export_expire_date: SE.date_time(),
		up_date: SE.date_time(),
		up_number: SE.string('1234/2024'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/Lc',
});

export const defCommercialLcEntry = SED({
	type: 'object',
	required: ['uuid', 'lc_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		lc_uuid: SE.uuid(),
		ldbc_fdbc: SE.string('LDBC'),
		receive_date: SE.date_time(),
		handover_date: SE.date_time(),
		document_submission_date: SE.date_time(),
		document_receive_date: SE.date_time(),
		bank_forward_date: SE.date_time(),
		acceptance_date: SE.date_time(),
		maturity_date: SE.date_time(),
		payment_date: SE.date_time(),
		payment_value: SE.number(1000.0),
		amount: SE.number(1000.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/LcEntry',
});

export const defCommercialLcEntryOthers = SED({
	type: 'object',
	required: ['uuid', 'lc_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		lc_uuid: SE.uuid(),
		ud_no: SE.string('12346gdfh'),
		ud_received: SE.date_time(),
		up_number: SE.string('dsab13'),
		up_number_updated_at: SE.date_time(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/LcEntryOthers',
});

export const defCommercialManualPi = SED({
	type: 'object',
	required: [
		'uuid',
		'pi_uuids',
		'marketing_uuid',
		'party_uuid',
		'buyer_uuid',
		'merchandiser_uuid',
		'factory_uuid',
		'bank_uuid',
		'validity',
		'payment',
		'created_by',
		'receive_amount',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		pi_uuids: SE.array([SE.uuid()]),
		marketing_uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		buyer_uuid: SE.uuid(),
		merchandiser_uuid: SE.uuid(),
		factory_uuid: SE.uuid(),
		bank_uuid: SE.uuid(),
		validity: SE.integer(0),
		payment: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		receive_amount: SE.number(1000.0),
		weight: SE.number(1000.0),
		date: SE.date_time(),
		pi_number: SE.string('1234/2024'),
	},
	xml: 'Commercial/ManualPi',
});

export const defCommercialManualPiEntry = SED({
	type: 'object',
	required: [
		'uuid',
		'manual_pi_uuid',
		'order_number',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		manual_pi_uuid: SE.uuid(),
		order_number: SE.string('1234/2024'),
		po: SE.string('PO'),
		style: SE.string('Style'),
		item: SE.string('Item'),
		specification: SE.string('Specification'),
		size: SE.string('Size'),
		quantity: SE.number(1000.0),
		unit_price: SE.number(1000.0),
		is_zipper: SE.integer(0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/ManualPiEntry',
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
		is_rtgs: SE.boolean(false),
		conversion_rate: SE.number(1000.0),
		weight: SE.number(1000.0),
		cross_weight: SE.number(1000.0),
		receive_amount: SE.number(1000.0),
		thread_order_info_uuids: SE.array([SE.uuid()]),
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
		thread_order_entry_uuid: SE.uuid(),
	},
	xml: 'Commercial/PiCashEntry',
});

export const defCommercialCashReceive = SED({
	type: 'object',
	required: ['uuid', 'pi_cash_uuid', 'amount', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		pi_cash_uuid: SE.uuid(),
		amount: SE.number(1000.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Commercial/CashReceive',
});

// * Marge All
export const defCommercial = {
	bank: defCommercialBank,
	lc: defCommercialLc,
	lc_entry: defCommercialLcEntry,
	lc_entry_others: defCommercialLcEntryOthers,
	pi_cash: defCommercialPiCash,
	pi_cash_entry: defCommercialPiCashEntry,
	manual_pi: defCommercialManualPi,
	manual_pi_entry: defCommercialManualPiEntry,
	cash_receive: defCommercialCashReceive,
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
		name: 'commercial.lc_entry',
		description: 'Operations about commercial lc_entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.lc_entry_others',
		description: 'Operations about commercial lc_entry_others',
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
	{
		name: 'commercial.manual_pi',
		description: 'Operations about commercial manual_pi',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.manual_pi_entry',
		description: 'Operations about commercial manual_pi_entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'commercial.cash_receive',
		description: 'Operations about commercial cash_receive',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];
