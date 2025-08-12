import SE, { SED } from '../../../util/swagger_example.js';

export const defSectionMachine = SED({
	required: [
		'uuid',
		'name',
		'section',
		'name',
		'status',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		section: SE.string('Section 1'),
		name: SE.string('Machine 1'),
		status: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Maintain/SectionMachine',
});

export const defIssue = SED({
	required: [
		'uuid',
		'section_machine_uuid',
		'section',
		'problem_type',
		'description',
		'emergence',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		section_machine_uuid: SE.uuid(),
		section: SE.string('Section 1'),
		extra_section: SE.string('extra_section'),
		problem_type: SE.string('machine'),
		description: SE.string('description'),
		emergence: SE.string('emergence'),
		parts_problem: SE.string('die_casting'),
		maintain_condition: SE.string('pending'),
		maintain_description: SE.string('maintain_description'),
		maintain_date: SE.date_time(),
		maintain_by: SE.uuid(),
		maintain_remarks: SE.string('maintain_remarks'),
		verification_approved: SE.integer(0),
		verification_date: SE.date_time(),
		verification_by: SE.uuid(),
		verification_remarks: SE.string('verification_remarks'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Maintain/Issue',
});

export const defIssueProcurement = SED({
	required: ['uuid', 'issue_uuid', 'quantity', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		issue_uuid: SE.uuid(),
		quantity: SE.number(10),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Maintain/IssueProcurement',
});

// * Marge All
export const defMaintain = {
	section_machine: defSectionMachine,
	issue: defIssue,
	issue_procurement: defIssueProcurement,
};

// * Tag

export const tagMaintain = [
	{
		name: 'maintain.section_machine',
		description: 'Everything about section machine',
		externalDocs: {
			description: 'Find out more about section machine',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'maintain.issue',
		description: 'Operations about issues',
	},
	{
		name: 'maintain.issue_procurement',
		description: 'Operations about issue procurement',
	},
];
