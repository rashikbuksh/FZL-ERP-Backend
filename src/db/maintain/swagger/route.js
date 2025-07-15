import SE from '../../../util/swagger_example.js';

// * Maintain Section Machine * //
export const pathMaintainSectionMachine = {
	'/maintain/section-machine': {
		get: {
			tags: ['maintain.section_machine'],
			summary: 'Get all section machine info',
			description: 'Get all section machine info',
			responses: {
				200: SE.response_schema_ref(
					'maintain/section-machine',
					'Returns all section machine info'
				),
			},
		},
		post: {
			tags: ['maintain.section_machine'],
			summary: 'Create a machine section info',
			description: 'Create a machine section info',
			operationId: 'createMaintainInfo',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref('maintain/section-machine'),
			responses: {
				200: SE.response_schema_ref(
					'maintain/section-machine',
					'Lab dip info created successfully'
				),
				405: SE.response(405, 'Invalid input'),
			},
		},
	},
	'/maintain/section-machine/{uuid}': {
		get: {
			tags: ['maintain.section_machine'],
			summary: 'Get machine section info by uuid',
			description: 'Get machine section info by uuid',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine Section info to get',
					true
				),
			],
			responses: {
				200: SE.response_schema_ref(
					'maintain/section-machine',
					'Machine Section info found'
				),
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine Section info not found'),
			},
		},
		put: {
			tags: ['maintain.section_machine'],
			summary: 'Update an existing machine section info',
			description: 'Update an existing machine section info',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine Section info to update',
					true
				),
			],
			requestBody: SE.requestBody_schema_ref('maintain/section-machine'),
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine Section info not found'),
				405: SE.response(405, 'Validation exception'),
			},
		},
		delete: {
			tags: ['maintain.section_machine'],
			summary: 'Delete a machine section info',
			description: 'Delete a machine section info',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine Section info to delete',
					true
				),
			],
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine Section info not found'),
			},
		},
	},
};

// * Maintain Machine Problem * //

export const pathMaintainIssue = {
	'/maintain/issue': {
		get: {
			tags: ['maintain.issue'],
			summary: 'Get all machine problem info',
			description: 'Get all machine problem info',
			parameters: [],
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue',
					'Returns all machine problem info'
				),
			},
		},
		post: {
			tags: ['maintain.issue'],
			summary: 'Create a machine problem info entry',
			description: 'Create a machine problem info entry',
			operationId: 'createMaintainIssueEntry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref('maintain/issue'),
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue',
					'Machine problem info entry created successfully'
				),
				405: SE.response(405, 'Invalid input'),
			},
		},
	},
	'/maintain/issue/{uuid}': {
		get: {
			tags: ['maintain.issue'],
			summary: 'Get lab dip info entry by uuid',
			description: 'Get lab dip info entry by uuid',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine problem info entry to get',
					true
				),
			],
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue',
					'Machine problem info entry found'
				),
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem info entry not found'),
			},
		},
		put: {
			tags: ['maintain.issue'],
			summary: 'Update an existing lab dip info entry',
			description: 'Update an existing lab dip info entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine problem info entry to update',
					true
				),
			],
			requestBody: SE.requestBody_schema_ref('maintain/issue'),
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem info entry not found'),
				405: SE.response(405, 'Validation exception'),
			},
		},
		delete: {
			tags: ['maintain.issue'],
			summary: 'Delete a lab dip info entry',
			description: 'Delete a lab dip info entry',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine problem info entry to delete',
					true
				),
			],
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem info entry not found'),
			},
		},
	},
};

// * Maintain Machine Problem Procurement * //

export const pathMaintainIssueProcurement = {
	'/maintain/issue-procurement': {
		get: {
			tags: ['maintain.issue_procurement'],
			summary: 'Get all machine problem procurement',
			description: 'Get all machine problem procurement',
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue-procurement',
					'Returns all machine problem procurement'
				),
			},
		},
		post: {
			tags: ['maintain.issue_procurement'],
			summary: 'Create a machine problem procurement',
			description: 'Create a machine problem procurement',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'maintain/issue-procurement'
			),
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue-procurement',
					'Machine problem procurement created successfully'
				),
				405: SE.response(405, 'Invalid input'),
			},
		},
	},
	'/maintain/issue-procurement/{uuid}': {
		get: {
			tags: ['maintain.issue_procurement'],
			summary: 'Get lab dip issue_procurement by uuid',
			description: 'Get lab dip issue_procurement by uuid',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine problem procurement to get',
					true
				),
			],
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue-procurement',
					'Machine problem procurement found'
				),
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem procurement not found'),
			},
		},
		put: {
			tags: ['maintain.issue_procurement'],
			summary: 'Update an existing Maintain issue_procurement',
			description: 'Update an existing Maintain issue_procurement',
			operationId: 'updateMaintainIssueProcurement',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine problem procurement to update',
					true
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'maintain/issue-procurement'
			),
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem procurement not found'),
				405: SE.response(405, 'Validation exception'),
			},
		},
		delete: {
			tags: ['maintain.issue_procurement'],
			summary: 'Delete a Maintain issue_procurement',
			description: 'Delete a Maintain issue_procurement',
			operationId: 'deleteMaintainIssueProcurement',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'uuid',
					'uuid',
					'Machine problem procurement to delete',
					true
				),
			],
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem procurement not found'),
			},
		},
	},
	'/maintain/issue-procurement/by/{issue_uuid}': {
		get: {
			tags: ['maintain.issue_procurement'],
			summary: 'Get all issue procurement by issue UUID',
			description: 'Get all issue procurement by issue UUID',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'issue_uuid',
					'uuid',
					'Issue UUID to get procurement for',
					true
				),
			],
			responses: {
				200: SE.response_schema_ref(
					'maintain/issue-procurement',
					'Returns all issue procurement for the specified issue UUID'
				),
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(
					404,
					'No issue procurement found for the specified issue UUID'
				),
			},
		},
	},
};

export const pathMaintain = {
	...pathMaintainSectionMachine,
	...pathMaintainIssue,
	...pathMaintainIssueProcurement,
};
