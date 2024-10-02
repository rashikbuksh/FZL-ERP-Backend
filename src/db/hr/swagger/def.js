import SE, { SED } from '../../../util/swagger_example.js';

//* ./schema.js#department
export const defDepartment = SED({
	required: ['uuid', 'department', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		department: SE.string('HR'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Hr/Department',
});

export const defDesignation = SED({
	required: ['uuid', 'department_uuid', 'designation'],
	properties: {
		uuid: SE.uuid(),
		designation: SE.string('HR Manager'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Hr/Designation',
});

export const defHrUser = SED({
	required: [
		'uuid',
		'name',
		'email',
		'pass',
		'designation_uuid',
		'department_uuid',
		'can_access',
		'created_at',
		'status',
	],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('John Doe'),
		email: SE.string('john@fzl.com'),
		pass: SE.string('1234'),
		designation_uuid: SE.uuid(),
		department_uuid: SE.uuid(),
		can_access: SE.string('1,2,3'),
		ext: SE.string('562'),
		phone: SE.string('01521533595'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		status: SE.string('active'),
		remarks: SE.string('remarks'),
	},
	xml: 'Hr/User',
});

export const defPolicyAndNotice = SED({
	required: [
		'uuid',
		'type',
		'title',
		'sub_title',
		'url',
		'created_by',
		'created_at',
		'status',
	],
	properties: {
		uuid: SE.uuid(),
		type: SE.string('privacy'),
		title: SE.string('Privacy Policy'),
		sub_title: SE.string('Privacy Policy'),
		url: SE.string('http://fzl.com'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		status: SE.integer(1),
		remarks: SE.string('remarks'),
	},
	xml: 'Hr/PolicyAndNotice',
});

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
