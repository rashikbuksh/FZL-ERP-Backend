import { request, Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import { marketing, merchandiser, properties } from '../public/schema.js';
import * as bankOperations from './query/bank.js';
import * as lcOperations from './query/lc.js';
import * as piOperations from './query/pi.js';
import * as piEntryOperations from './query/pi_entry.js';

const commercialRouter = Router();

// bank
export const pathCommercialBank = {
	'/commercial/bank': {
		get: {
			tags: ['commercial.bank'],
			summary: 'Get all banks',
			description: 'All banks',
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/commercial/bank',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['commercial.bank'],
			summary: 'Create a bank',
			description: 'Create a bank',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/bank',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},

				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/commercial/bank/{uuid}': {
		get: {
			tags: ['commercial.bank'],
			summary: 'Get a bank',
			description: ' Get a bank by uuid',
			//operationId: "getBankByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: "Bank's uuid",
					required: true,
					type: 'string',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Bank not found',
				},
			},
		},
		put: {
			tags: ['commercial.bank'],
			summary: 'Update a bank',
			description: 'Update a bank by uuid',
			//operationId: "updateBankByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'BankUuid',
					in: 'path',
					description: 'bank to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Bank object need to be updated to the commercial.bank',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/bank',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Bank not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.bank'],
			summary: 'Delete a bank',
			description: 'Delete a bank by uuid',
			//operationId: "deleteBankByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: "Bank's uuid",
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
					description: 'Bank not found',
				},
			},
		},
	},
};

// bank routes
commercialRouter.get('/bank', bankOperations.selectAll);
commercialRouter.get('/bank/:uuid', bankOperations.select);
commercialRouter.post('/bank', bankOperations.insert);
commercialRouter.put('/bank/:uuid', bankOperations.update);
commercialRouter.delete(
	'/bank/:uuid',

	bankOperations.remove
);

// lc
export const pathCommercialLc = {
	'/commercial/lc': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get all lcs',
			description: 'All lcs',
			responses: {
				200: {
					description: 'Returns a all lcs',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/commercial/lc',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['commercial.lc'],
			summary: 'Create a lc',
			description: 'Create a lc',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Lc objects that needs to be added to the commercial.lc',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/lc',
					},
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/commercial/lc',
						},
					},
				},

				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/commercial/lc/{uuid}': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get a lc',
			description: ' Get a lc by uuid',
			//operationId: "getLcByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lc to get',
					required: true,
					type: 'string',
					Format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lc not found',
				},
			},
		},
		put: {
			tags: ['commercial.lc'],
			summary: 'Update a lc',
			description: 'Update a lc by uuid',
			//operationId: "updateLcByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lc to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Lc object need to be updated to the commercial.lc',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/lc',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lc not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.lc'],
			summary: 'Delete a lc',
			description: 'Delete a lc by uuid',
			//operationId: "deleteLcByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lc to delete',
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
					description: 'Lc not found',
				},
			},
		},
	},
};

// lc routes
commercialRouter.get('/lc', lcOperations.selectAll);
commercialRouter.get('/lc/:uuid', lcOperations.select);
commercialRouter.post('/lc', lcOperations.insert);
commercialRouter.put('/lc/:uuid', lcOperations.update);
commercialRouter.delete('/lc/:uuid', lcOperations.remove);

// pi
export const pathCommercialPi = {
	'/commercial/pi': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get all pis',
			description: 'All pis',
			responses: {
				200: {
					description: 'Returns a all pis',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									lc_uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									order_info_ids: {
										type: 'array',
										items: {
											type: 'string',
											example:
												'123e4567-e89b-12d3-a456-426614174000',
										},
									},
									marketing_uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									marketing_name: {
										type: 'string',
										example: 'marketing',
									},
									party_uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									party_name: {
										type: 'string',
										example: 'party',
									},
									merchandiser_uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									merchandiser_name: {
										type: 'string',
										example: 'merchandiser',
									},
									factory_uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									factory_name: {
										type: 'string',
										example: 'ABC',
									},
									bank_uuid: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									bank_name: {
										type: 'string',
										example: 'Bangladesh Bank',
									},

									bank_swift_code: {
										type: 'string',
										example: 'BB',
									},
									validity: {
										type: 'string',
										example: '2021-12-12',
									},
									payment: {
										type: 'string',
										example: 'paid',
									},
									created_by: {
										type: 'string',
										example:
											'123e4567-e89b-12d3-a456-426614174000',
									},
									user_name: {
										type: 'string',
										example: 'John Doe',
									},
									user_designation: {
										type: 'string',
										example: 'Manager',
									},
									user_department: {
										type: 'string',
										example: 'HR',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
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
			tags: ['commercial.pi'],
			summary: 'Create a pi',
			description: 'Create a pi',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Pi objects that needs to be added to the commercial.pi',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/pi',
					},
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/commercial/pi',
						},
					},
				},

				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/commercial/pi/{uuid}': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get a pi',
			description: ' Get a pi by uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					Format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
		put: {
			tags: ['commercial.pi'],
			summary: 'Update a pi',
			description: 'Update a pi by uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'pi to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Pi object need to be updated to the commercial.pi',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/pi',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.pi'],
			summary: 'Delete a pi',
			description: 'Delete a pi by uuid',
			//operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi to delete',
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
					description: 'Pi not found',
				},
			},
		},
	},
};

// pi routes
commercialRouter.get('/pi', piOperations.selectAll);
commercialRouter.get('/pi/:uuid', piOperations.select);
commercialRouter.post('/pi', piOperations.insert);
commercialRouter.put('/pi/:uuid', piOperations.update);
commercialRouter.delete('/pi/:uuid', piOperations.remove);

// pi_entry
export const pathCommercialPiEntry = {
	'/commercial/pi-entry': {
		get: {
			tags: ['commercial.pi_entry'],
			summary: 'Get all pi_entries',
			description: 'All pi_entries',
			responses: {
				200: {
					description: 'Returns a all pi_entries',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/commercial/pi_entry',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['commercial.pi_entry'],
			summary: 'Create a pi_entry',
			description: 'Create a pi_entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Pi_entry objects that needs to be added to the commercial.pi_entry',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/pi_entry',
					},
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/commercial/pi_entry',
						},
					},
				},

				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/commercial/pi-entry/{uuid}': {
		get: {
			tags: ['commercial.pi_entry'],
			summary: 'Get a pi_entry',
			description: ' Get a pi_entry by uuid',
			//operationId: "getPiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi_entry to get',
					required: true,
					type: 'string',
					Format: 'uuid',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi_entry not found',
				},
			},
		},
		put: {
			tags: ['commercial.pi_entry'],
			summary: 'Update a pi_entry',
			description: 'Update a pi_entry by uuid',
			//operationId: "updatePiEntryByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'pi_entry to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Pi_entry object need to be updated to the commercial.pi_entry',
					required: true,
					schema: {
						$ref: '#/definitions/commercial/pi_entry',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi_entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.pi_entry'],
			summary: 'Delete a pi_entry',
			description: 'Delete a pi_entry by uuid',
			//operationId: "deletePiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi_entry to delete',
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
					description: 'Pi_entry not found',
				},
			},
		},
	},
};

// pi_entry routes
commercialRouter.get('/pi-entry', piEntryOperations.selectAll);
commercialRouter.get(
	'/pi-entry/:uuid',

	piEntryOperations.select
);
commercialRouter.post('/pi-entry', piEntryOperations.insert);
commercialRouter.put('/pi-entry/:uuid', piEntryOperations.update);
commercialRouter.delete(
	'/pi-entry/:uuid',

	piEntryOperations.remove
);

export const pathCommercial = {
	...pathCommercialBank,
	...pathCommercialLc,
	...pathCommercialPi,
	...pathCommercialPiEntry,
};
export { commercialRouter };
