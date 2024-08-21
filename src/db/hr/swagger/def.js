//* ./schema.js#department
export const defDepartment = {
	type: 'object',
	required: ['uuid', 'department'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		department: {
			type: 'string',
			example: 'HR',
		},
	},
	xml: {
		name: 'Hr/Department',
	},
};

export const defDesignation = {
	type: 'object',
	required: ['uuid', 'department_uuid', 'designation'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		department_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		designation: {
			type: 'string',
			example: 'HR Manager',
		},
	},
	xml: {
		name: 'Hr/Designation',
	},
};

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
		pass: {
			type: 'string',
			example: 'password',
		},
		designation_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		can_access: {
			type: 'string',
			example: 'yes',
		},
		ext: {
			type: 'string',
			example: 'ext',
		},
		phone: {
			type: 'string',
			example: '1234567890',
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
			type: 'string',
			example: 'active',
		},
		remarks: {
			type: 'string',
			example: 'remarks',
		},
	},
	xml: {
		name: 'Hr/User',
	},
};

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

// * Marge All

export const defHr = {
	user: defHrUser,
	department: defDepartment,
	designation: defDesignation,
	policy_and_notice: defPolicyAndNotice,
};

// * Tag

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
