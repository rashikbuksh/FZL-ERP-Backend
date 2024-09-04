import SE from '../../../util/swagger_example.js';
import { update } from '../query/department.js';

// * Hr User * //
export const pathHrUser = {
	'/hr/user/login': {
		post: {
			tags: ['hr.user'],
			summary: 'validate a user',
			description: 'Validate user credentials',
			operationId: 'validateUser',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody(
				{
					email: SE.string('admin@fzl.com'),
					pass: SE.string('1234'),
				},
				['email', 'pass']
			),
			responses: {
				200: SE.response(200),
				405: SE.response(405),
			},
		},
	},
	'/hr/user': {
		get: {
			tags: ['hr.user'],
			summary: 'get all users',
			description: 'All users',
			operationId: 'getAllUsers',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('John Doe'),
					email: SE.string('john@fzl.com'),
					designation_uuid: SE.uuid(),
					designation: SE.string('HR Manager'),
					department_uuid: SE.uuid(),
					department: SE.string('HR'),
					ext: SE.string('562'),
					phone: SE.string('01521533595'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					status: SE.integer(1),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['hr.user'],
			summary: 'create a user',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('hr/user'),
			responses: {
				200: SE.response_schema_ref(200, 'hr/user'),
				405: SE.response(405),
			},
		},
	},
	'/hr/user/{uuid}': {
		get: {
			tags: ['hr.user'],
			summary: 'Gets a user',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('hr.user to get')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('John Doe'),
					email: SE.string('john@fzl.com'),
					designation_uuid: SE.uuid(),
					designation: SE.string('HR Manager'),
					department_uuid: SE.uuid(),
					department: SE.string('HR'),
					ext: SE.string('562'),
					phone: SE.string('01521533595'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					status: SE.integer(1),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['hr.user'],
			summary: 'Update an existing user',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('hr.user to update')],
			requestBody: SE.requestBody({
				name: SE.string('John Doe'),
				email: SE.string('john@fzl.com'),
				designation_uuid: SE.uuid(),
				ext: SE.string('562'),
				phone: SE.string('01521533595'),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				status: SE.integer(1),
				remarks: SE.string('remarks'),
			}),
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						properties: {
							name: {
								type: 'string',
								example: 'John Doe',
							},
							email: {
								type: 'string',
								example: 'john@fzl.com',
							},
							designation_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							ext: {
								type: 'string',
								example: '123',
							},
							phone: {
								type: 'string',
								example: '12345678910',
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
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'User not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['hr.user'],
			summary: 'Deletes a user',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('hr.user to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/hr/user/can-access/{uuid}': {
		get: {
			tags: ['hr.user'],
			summary: 'Gets a user access',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('hr.user access to get')],
			responses: {
				200: SE.response_schema(200, {
					can_access: SE.string('1,2,3'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['hr.user'],
			summary: 'create a user access',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('hr.user access to update')],
			requestBody: SE.requestBody(
				{
					can_access: SE.string('1,2,3'),
				},
				['can_access']
			),
			responses: {
				200: SE.response_schema(200, {
					can_access: SE.string('1,2,3'),
				}),
				405: SE.response(405),
			},
		},
	},
	'/hr/user-common': {
		get: {
			tags: ['hr.user'],
			summary: 'get all common users',
			description: 'All common users',
			operationId: 'getAllCommonUsers', // unique identifier of an operation or a route
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('John Doe'),
					email: SE.string('admin@fzl.com'),
					designation_uuid: SE.uuid(),
					designation: SE.string('Admin'),
					ext: SE.string('123'),
					phone: SE.string('01521533595'),
				}),
			},
		},
	},
	'/hr/user/status/{uuid}': {
		put: {
			tags: ['hr.user'],
			summary: 'Update an existing user status',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'User status to update',
					'uuid',
					'string',
					'uuid'
				),
			],
			requestBody: SE.requestBody(
				{
					status: SE.integer(1),
					updated_at: SE.date_time(),
				},
				['status']
			),
			responses: {
				200: SE.response_schema(200, {
					status: SE.integer(1),
					updated_at: SE.date_time(),
				}),
				405: SE.response(405),
			},
		},
	},
};

// * Hr Department * //

export const pathHrDepartment = {
	'/hr/department': {
		get: {
			tags: ['hr.department'],
			summary: 'get all departments',
			description: 'All departments',
			responses: {
				200: {
					description: 'Returns a all department.',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/hr/department',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['hr.department'],
			summary: 'create a department',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('hr/department'),
			responses: {
				200: SE.response_schema_ref(200, 'hr/department'),
				405: SE.response(405),
			},
		},
	},
	'/hr/department/{uuid}': {
		get: {
			tags: ['hr.department'],
			summary: 'Gets a department',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Department to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Department not found',
				},
			},
		},
		put: {
			tags: ['hr.department'],
			summary: 'Update an existing department',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Department to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Department object that needs to be updated to the hr.department',
					required: true,
					schema: {
						$ref: '#/definitions/hr/department',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Department not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['hr.department'],
			summary: 'Deletes a department',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Department to delete',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Department not found',
				},
			},
		},
	},
};

// * Hr Designation * //

export const pathHrDesignation = {
	'/hr/designation': {
		get: {
			tags: ['hr.designation'],
			summary: 'get all designations',
			description: 'All designations',
			responses: {
				200: {
					description: 'Returns a all designation.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									designation: {
										type: 'string',
										example: 'Admin',
									},
									department_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									department: {
										type: 'string',
										example: 'Admin',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['hr.designation'],
			summary: 'create a designation',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('hr/designation'),
			responses: {
				200: SE.response_schema_ref(200, 'hr/designation'),
				405: SE.response(405),
			},
		},
	},
	'/hr/designation/{uuid}': {
		get: {
			tags: ['hr.designation'],
			summary: 'Gets a designation',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Designation to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						properties: {
							uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							designation: {
								type: 'string',
								example: 'Admin',
							},
							department_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							department: {
								type: 'string',
								example: 'Admin',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Designation not found',
				},
			},
		},
		put: {
			tags: ['hr.designation'],
			summary: 'Update an existing designation',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Designation to update'),
				SE.parameter_schema_ref(
					'Designation object that needs to be updated to the hr.designation',
					'hr/designation'
				),
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Designation not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['hr.designation'],
			summary: 'Deletes a designation',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Designation to delete',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Designation not found',
				},
			},
		},
	},
};

// * Hr Policy and Notice * //
const pathHrPrivacyAndNotice = {
	'/hr/policy-and-notice': {
		get: {
			tags: ['hr.policy_and_notice'],
			summary: 'get all privacy and policy',
			description: 'All privacy and policy',
			responses: {
				200: {
					description: 'Returns a all privacy and policy.',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/hr/policy_and_notice',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['hr.policy_and_notice'],
			summary: 'create a privacy and policy',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('hr/policy_and_notice'),
			responses: {
				200: SE.response_schema_ref(200, 'hr/policy_and_notice'),
				405: SE.response(405),
			},
		},
	},
	'/hr/policy-and-notice/{uuid}': {
		get: {
			tags: ['hr.policy_and_notice'],
			summary: 'Gets a privacy and policy',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'string -> uuid, length: 15',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Privacy and policy not found',
				},
			},
		},
		put: {
			tags: ['hr.policy_and_notice'],
			summary: 'Update an existing privacy and policy',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Privacy and policy to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/hr/policy_and_notice',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Privacy and policy not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['hr.policy_and_notice'],
			summary: 'Deletes a privacy and policy',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Privacy and policy to delete',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Privacy and policy not found',
				},
			},
		},
	},
	'/hr/policy-and-notice/policy': {
		get: {
			tags: ['hr.policy_and_notice'],
			summary: 'Gets a privacy and policy',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/hr/policy_and_notice',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Privacy and policy not found',
				},
			},
		},
	},
	'/hr/policy-and-notice/notice': {
		get: {
			tags: ['hr.policy_and_notice'],
			summary: 'Gets a privacy and policy',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/hr/policy_and_notice',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Privacy and policy not found',
				},
			},
		},
	},
};

export const pathHr = {
	...pathHrUser,
	...pathHrDepartment,
	...pathHrDesignation,
	...pathHrPrivacyAndNotice,
};
