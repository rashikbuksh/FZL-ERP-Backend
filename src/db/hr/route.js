import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import { type } from '../material/schema.js';
import { properties } from '../public/schema.js';
import * as departmentOperations from './query/department.js';
import * as designationOperations from './query/designation.js';
import * as policyAndNoticeOperations from './query/policy_and_notice.js';
import * as userOperations from './query/users.js';

const hrRouter = Router();

// user routes
export const pathHrUser = {
	'/hr/user/login': {
		post: {
			tags: ['hr.user'],
			summary: 'validate a user',
			description: 'Validate user credentials',
			operationId: 'validateUser',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								email: {
									type: 'string',
									description: "User's email address",
									example: 'admin@fzl.com',
								},
								pass: {
									type: 'string',
									description: "User's password",
									example: '1234',
								},
							},
							required: ['email', 'pass'],
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/hr/user': {
		get: {
			tags: ['hr.user'],
			summary: 'get all users',
			description: 'All users',
			operationId: 'getAllUsers', // unique identifier of an operation or a route
			responses: {
				200: {
					description: 'Returns a all user.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
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
										example: 'john@fzl.com',
									},
									designation_uuid: {
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
					},
				},
			},
		},
		post: {
			tags: ['hr.user'],
			summary: 'create a user',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/hr/user',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/hr/user',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'User to get',
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
			},
		},
		put: {
			tags: ['hr.user'],
			summary: 'Update an existing user',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'User to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
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
				},
			},
			responses: {
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
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'User to delete',
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
					description: 'User not found',
				},
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
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'User access to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/hr/user',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'User access not found',
				},
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
				200: {
					description: 'Returns all common user.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
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
										example: 'admin@fzl.com',
									},
									designaiton_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									designation: {
										type: 'string',
										example: 'Admin',
									},
									ext: {
										type: 'string',
										example: '123',
									},
									phone: {
										type: 'string',
										example: '12345678910',
									},
								},
							},
						},
					},
				},
			},
		},
	},
};

hrRouter.post('/user/login', userOperations.loginUser);
hrRouter.get('/user/can-access/:uuid', userOperations.selectUsersAccessPages);
hrRouter.get('/user', userOperations.selectAll);
hrRouter.get('/user/:uuid', validateUuidParam(), userOperations.select);
hrRouter.post('/user', userOperations.insert);
hrRouter.put('/user/:uuid', userOperations.update);
hrRouter.delete('/user/:uuid', validateUuidParam(), userOperations.remove);
hrRouter.get('/user-common', userOperations.selectCommonUsers);

// department routes
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
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/hr/department',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/hr/department',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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

hrRouter.get('/department', departmentOperations.selectAll);
hrRouter.get(
	'/department/:uuid',
	validateUuidParam(),
	departmentOperations.select
);
hrRouter.post('/department', departmentOperations.insert);
hrRouter.put('/department/:uuid', departmentOperations.update);
hrRouter.delete(
	'/department/:uuid',
	validateUuidParam(),
	departmentOperations.remove
);

// designation routes
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
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/hr/designation',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/hr/designation',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'Designation to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Designation object that needs to be updated to the hr.designation',
					required: true,
					schema: {
						$ref: '#/definitions/hr/designation',
					},
				},
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

hrRouter.get('/designation', designationOperations.selectAll);
hrRouter.get(
	'/designation/:uuid',
	validateUuidParam(),
	designationOperations.select
);
hrRouter.post('/designation', designationOperations.insert);
hrRouter.put('/designation/:uuid', designationOperations.update);
hrRouter.delete(
	'/designation/:uuid',
	validateUuidParam(),
	designationOperations.remove
);

// privacy_and_policy routes

hrRouter.get('/policy-and-notice', policyAndNoticeOperations.selectAll);
hrRouter.get(
	'/policy-and-notice/:uuid',
	validateUuidParam(),
	policyAndNoticeOperations.select
);
hrRouter.post('/policy-and-notice', policyAndNoticeOperations.insert);
hrRouter.put('/policy-and-notice/:uuid', policyAndNoticeOperations.update);
hrRouter.delete(
	'/policy-and-notice/:uuid',
	validateUuidParam(),
	policyAndNoticeOperations.remove
);
hrRouter.get(
	'/policy-and-notice/policy',
	policyAndNoticeOperations.selectPolicy
);
hrRouter.get(
	'/policy-and-notice/notice',
	policyAndNoticeOperations.selectNotice
);

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
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/hr/policy_and_notice',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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

export { hrRouter };
