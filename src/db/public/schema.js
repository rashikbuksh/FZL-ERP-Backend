import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

import * as hrSchema from '../hr/schema.js';

export const buyer = pgTable('buyer', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	remarks: text('remarks').default(null),
});

export const defPublicBuyer = {
	type: 'object',
	required: ['uuid', 'name'],
	properties: {
		uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		short_name: {
			type: 'string',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Public/Buyer',
	},
};

export const party = pgTable('party', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').notNull(),
	remarks: text('remarks').notNull(),
});

export const defPublicParty = {
	type: 'object',
	required: ['uuid', 'name', 'short_name', 'remarks'],
	properties: {
		uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		short_name: {
			type: 'string',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Public/Party',
	},
};

export const marketing = pgTable('marketing', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	user_uuid: defaultUUID('user_uuid'),
	remarks: text('remarks').default(null),
});

export const defPublicMarketing = {
	type: 'object',
	required: ['uuid', 'name', 'user_uuid'],
	properties: {
		uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		short_name: {
			type: 'string',
		},
		user_uuid: {
			type: 'string',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Public/Marketing',
	},
};

export const merchandiser = pgTable('merchandiser', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(() => party.uuid),
	name: text('name').notNull(),
	email: text('email').default(null),
	phone: text('phone').default(null),
	address: text('address').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
});

export const defPublicMerchandiser = {
	type: 'object',
	required: ['uuid', 'party_uuid', 'name', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
		},
		party_uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		email: {
			type: 'string',
		},
		phone: {
			type: 'string',
		},
		address: {
			type: 'string',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
		},
	},
	xml: {
		name: 'Public/Merchandiser',
	},
};

export const factory = pgTable('factory', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(() => party.uuid),
	name: text('name').notNull(),
	phone: text('phone').default(null),
	address: text('address').default(null),
	created_at: DateTime('created_at', {
		mode: 'string',
		withTimezone: false,
	}).notNull(),
	updated_at: DateTime('updated_at', {
		mode: 'string',
		withTimezone: false,
	}).default(null),
});

export const defPublicFactory = {
	type: 'object',
	required: ['uuid', 'party_uuid', 'name', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
		},
		party_uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		phone: {
			type: 'string',
		},
		address: {
			type: 'string',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
		},
	},
	xml: {
		name: 'Public/Factory',
	},
};

export const section = pgTable('section', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	remarks: text('remarks').default(null),
});

export const defPublicSection = {
	type: 'object',
	required: ['uuid', 'name'],
	properties: {
		uuid: {
			type: 'string',
			format: 'uuid',
		},
		name: {
			type: 'string',
		},
		short_name: {
			type: 'string',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Public/Section',
	},
};

export const properties = pgTable('properties', {
	uuid: uuid_primary,
	item_for: text('item_for').notNull(),
	type: text('type').notNull().unique(),
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at', {
		mode: 'string',
		withTimezone: false,
	}).notNull(),
	updated_at: DateTime('updated_at', {
		mode: 'string',
		withTimezone: false,
	}).default(null),
	remarks: text('remarks').default(null),
});

export const defPublicProperties = {
	type: 'object',
	required: ['uuid', 'item_for', 'type', 'name', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
		},
		item_for: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		short_name: {
			type: 'string',
		},
		created_by: {
			type: 'string',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Public/Properties',
	},
};

//.....................FOR TESTING.......................
export const defPublic = {
	buyer: defPublicBuyer,
	party: defPublicParty,
	marketing: defPublicMarketing,
	merchandiser: defPublicMerchandiser,
	factory: defPublicFactory,
	section: defPublicSection,
	properties: defPublicProperties,
};

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

export default buyer;
