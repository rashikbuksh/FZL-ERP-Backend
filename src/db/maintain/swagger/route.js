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

export const pathMaintainMachineProblem = {
	'/maintain/machine-problem': {
		get: {
			tags: ['maintain.machine_problem'],
			summary: 'Get all machine problem info',
			description: 'Get all machine problem info',
			parameters: [],
			responses: {
				200: SE.response_schema_ref(
					'maintain/machine-problem',
					'Returns all machine problem info'
				),
			},
		},
		post: {
			tags: ['maintain.machine_problem'],
			summary: 'Create a machine problem info entry',
			description: 'Create a machine problem info entry',
			operationId: 'createMaintainMachineProblemEntry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref('maintain/machine-problem'),
			responses: {
				200: SE.response_schema_ref(
					'maintain/machine-problem',
					'Machine problem info entry created successfully'
				),
				405: SE.response(405, 'Invalid input'),
			},
		},
	},
	'/maintain/machine-problem/{uuid}': {
		get: {
			tags: ['maintain.machine_problem'],
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
					'maintain/machine-problem',
					'Machine problem info entry found'
				),
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem info entry not found'),
			},
		},
		put: {
			tags: ['maintain.machine_problem'],
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
			requestBody: SE.requestBody_schema_ref('maintain/machine-problem'),
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem info entry not found'),
				405: SE.response(405, 'Validation exception'),
			},
		},
		delete: {
			tags: ['maintain.machine_problem'],
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

export const pathMaintainMachineProblemProcurement = {
	'/maintain/machine-problem-procurement': {
		get: {
			tags: ['maintain.machine_problem_procurement'],
			summary: 'Get all machine problem procurement',
			description: 'Get all machine problem procurement',
			responses: {
				200: SE.response_schema_ref(
					'maintain/machine-problem-procurement',
					'Returns all machine problem procurement'
				),
			},
		},
		post: {
			tags: ['maintain.machine_problem_procurement'],
			summary: 'Create a machine problem procurement',
			description: 'Create a machine problem procurement',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'maintain/machine-problem-procurement'
			),
			responses: {
				200: SE.response_schema_ref(
					'maintain/machine-problem-procurement',
					'Machine problem procurement created successfully'
				),
				405: SE.response(405, 'Invalid input'),
			},
		},
	},
	'/maintain/machine-problem-procurement/{uuid}': {
		get: {
			tags: ['maintain.machine_problem_procurement'],
			summary: 'Get lab dip machine_problem_procurement by uuid',
			description: 'Get lab dip machine_problem_procurement by uuid',
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
					'maintain/machine-problem-procurement',
					'Machine problem procurement found'
				),
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem procurement not found'),
			},
		},
		put: {
			tags: ['maintain.machine_problem_procurement'],
			summary: 'Update an existing Maintain machine_problem_procurement',
			description:
				'Update an existing Maintain machine_problem_procurement',
			operationId: 'updateMaintainMachineProblemProcurement',
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
				'maintain/machine-problem-procurement'
			),
			responses: {
				400: SE.response(400, 'Invalid UUID supplied'),
				404: SE.response(404, 'Machine problem procurement not found'),
				405: SE.response(405, 'Validation exception'),
			},
		},
		delete: {
			tags: ['maintain.machine_problem_procurement'],
			summary: 'Delete a Maintain machine_problem_procurement',
			description: 'Delete a Maintain machine_problem_procurement',
			operationId: 'deleteMaintainMachineProblemProcurement',
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
};

export const pathMaintain = {
	...pathMaintainSectionMachine,
	...pathMaintainMachineProblem,
	...pathMaintainMachineProblemProcurement,
};
