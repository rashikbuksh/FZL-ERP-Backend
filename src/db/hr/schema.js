import { integer, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import { defaultUUID, uuid_primary } from '../variables.js';

const hr = pgSchema('hr');

export const department = hr.table('department', {
	uuid: uuid_primary,
	department: text('department').notNull(),
});

export const defDepartment = {
	type: 'object',
	required: ['uuid', 'department'],
	properties: {
		uuid: {
			type: 'string',
		},
		department: {
			type: 'string',
		},
	},
	xml: {
		name: 'Hr/Department',
	},
};

export const designation = hr.table('designation', {
	uuid: uuid_primary,
	department_uuid: defaultUUID('department_uuid'),
	designation: text('designation').notNull(),
});

export const defDesignation = {
	type: 'object',
	required: ['uuid', 'department_uuid', 'designation'],
	properties: {
		uuid: {
			type: 'string',
		},
		department_uuid: {
			type: 'string',
		},
		designation: {
			type: 'string',
		},
	},
	xml: {
		name: 'Hr/Designation',
	},
};

export const users = hr.table('users', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	email: text('email').notNull(),
	pass: text('pass').notNull(),
	designation_uuid: defaultUUID('designation_uuid'),
	can_access: text('can_access').notNull(),
	ext: text('ext').default(null),
	phone: text('phone').default(null),
	created_at: text('created_at').notNull(),
	updated_at: text('updated_at').default(null),
	status: text('status').notNull(),
	remarks: text('remarks').default(null),
});

export const defHrUser = {
	type: 'object',
	required: [
		'uuid',
		'name',
		'email',
		'pass',
		'designation_uuid',
		'can_access',
		'created_at',
		'status',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		email: {
			type: 'string',
		},
		pass: {
			type: 'string',
		},
		designation_uuid: {
			type: 'string',
		},
		can_access: {
			type: 'string',
		},
		ext: {
			type: 'string',
		},
		phone: {
			type: 'string',
		},
		created_at: {
			type: 'string',
		},
		updated_at: {
			type: 'string',
		},
		status: {
			type: 'string',
		},
		remarks: {
			type: 'string',
		},
	},
	xml: {
		name: 'Hr/User',
	},
};

export const policy_and_notice = hr.table('policy_and_notice', {
	uuid: uuid_primary,
	type: text('type').notNull(),
	title: text('title').notNull(),
	sub_title: text('sub_title').notNull(),
	url: text('url').notNull(),
	created_at: text('created_at').notNull(),
	updated_at: text('updated_at').default(null),
	status: integer('status').notNull(),
	remarks: text('remarks').default(null),
});

export const defPolicyAndNotice = {
	type: 'object',
	required: [
		'uuid',
		'type',
		'title',
		'sub_title',
		'url',
		'created_at',
		'status',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		type: {
			type: 'string',
			example: 'privacy',
		},
		title: {
			type: 'string',
			example: 'Privacy',
		},
		sub_title: {
			type: 'string',
			example: 'Privacy Policy',
		},
		url: {
			type: 'string',
			example: 'https://www.example.com',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2021-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2021-01-01 00:00:00',
		},
		status: {
			type: 'integer',
			example: 1,
		},
		remarks: {
			type: 'string',
			example: 'remarks',
		},
	},
	xml: {
		name: 'Hr/PolicyAndNotice',
	},
};

// ------------- FOR TESTING ----------------
export const defHr = {
	user: defHrUser,
	department: defDepartment,
	designation: defDesignation,
	policy_and_notice: defPolicyAndNotice,
};

export const tagHr = [
	{
		name: 'hr.user',
		description: 'Everything about your Users',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'hr.department',
		description: 'Operations about department',
	},
	{
		name: 'hr.designation',
		description: 'Operations about designation',
	},
	{
		name: 'hr.policy_and_notice',
		description: 'Operations about policy and notice',
	},
];

export default hr;
