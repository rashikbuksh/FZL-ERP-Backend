import { decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import * as zipperSchema from '../zipper/schema.js';

const commercial = pgSchema('commercial');

export const bank = commercial.table('bank', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	swift_code: text('swift_code').notNull(),
	address: text('address').default(null),
	policy: text('policy').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defCommercialBank = {
	type: 'object',
	required: ['uuid', 'name', 'swift_code', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Bangladesh Name',
		},
		swift_code: {
			type: 'string',
			example: 'BNGD',
		},
		address: {
			type: 'string',
			example: 'Dhaka, Bangladesh',
		},
		policy: {
			type: 'string',
			example: 'policy_name',
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
		name: 'Commercial/Bank',
	},
};

export const lc = commercial.table('lc', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	file_no: text('file_no').notNull(),
	lc_number: text('lc_number').notNull(),
	lc_date: text('lc_date').notNull(),
	payment_value: decimal('payment_value', {
		precision: 20,
		scale: 4,
	}).notNull(),
	payment_date: DateTime('payment_date').default(null),
	ldbc_fdbc: text('ldbc_fdbc').notNull(),
	acceptance_date: DateTime('acceptance_date').default(null),
	maturity_date: DateTime('maturity_date').default(null),
	commercial_executive: text('commercial_executive').notNull(),
	party_bank: text('party_bank').notNull(),
	production_complete: integer('production_complete').default(0),
	lc_cancel: integer('lc_cancel').default(0),
	handover_date: DateTime('handover_date').default(null),
	shipment_date: DateTime('shipment_date').default(null),
	expiry_date: DateTime('expiry_date').default(null),
	ud_no: text('ud_no').default(null),
	ud_received: text('ud_received').default(null),
	at_sight: text('at_sight').notNull(),
	amd_date: DateTime('amd_date').default(null),
	amd_count: integer('amd_count').default(0),
	problematical: integer('problematical').default(0),
	epz: integer('epz').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defCommercialLc = {
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
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		party_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		file_no: {
			type: 'string',
			example: '1234/2024',
		},
		lc_number: {
			type: 'string',
			example: '1234/2024',
		},
		lc_date: {
			type: 'string',
			example: '2024-01-01 00:00:00',
		},
		payment_value: {
			type: 'number',
			example: 1000.0,
		},
		payment_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		ldbc_fdbc: {
			type: 'string',
			example: 'LDBC',
		},
		acceptance_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		maturity_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		commercial_executive: {
			type: 'string',
			example: 'John Doe',
		},
		party_bank: {
			type: 'string',
			example: 'Bangladesh Bank',
		},
		production_complete: {
			type: 'integer',
			example: 0,
		},
		lc_cancel: {
			type: 'integer',
			example: 0,
		},
		handover_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		shipment_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		expiry_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		ud_no: {
			type: 'string',
			example: '1234/2024',
		},
		ud_received: {
			type: 'string',
			example: '2024-01-01 00:00:00',
		},
		at_sight: {
			type: 'string',
			example: 'At Sight',
		},
		amd_date: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		amd_count: {
			type: 'integer',
			example: 0,
		},
		problematical: {
			type: 'integer',
			example: 0,
		},
		epz: {
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
		name: 'Commercial/Lc',
	},
};

export const pi = commercial.table('pi', {
	uuid: uuid_primary,
	lc_uuid: defaultUUID('lc_uuid')
		.default(null)
		.references(() => lc.uuid),
	order_info_ids: text('order_info_ids').notNull(), // need review
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	merchandiser_uuid: defaultUUID('merchandiser_uuid').references(
		() => publicSchema.party.uuid
	),
	factory_uuid: defaultUUID('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	bank_uuid: defaultUUID('bank_uuid').references(() => bank.uuid),
	validity: integer('validity').notNull(), // need review
	payment: integer('payment').notNull(), // need review
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
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
		lc_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_info_ids: {
			type: 'array',
			items: {
				type: 'string',
			},
			example: '[{"igD0v9DIJQhJeet"}]',
		},
		marketing_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		party_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		merchandiser_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		factory_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
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

export const pi_entry = commercial.table('pi_entry', {
	uuid: uuid_primary,
	pi_uuid: defaultUUID('pi_uuid').references(() => pi.uuid),
	sfg_uuid: defaultUUID('sfg_uuid').references(() => zipperSchema.sfg.uuid),
	pi_quantity: decimal('pi_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

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

//..................FOR TESTING.......................

export const defCommercial = {
	bank: defCommercialBank,
	lc: defCommercialLc,
	pi: defCommercialPi,
	pi_entry: defCommercialPiEntry,
};

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

export default commercial;
