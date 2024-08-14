import { request, Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import * as infoOperations from './query/info.js';
import * as recipeOperations from './query/recipe.js';
import * as recipeEntryOperations from './query/recipe_entry.js';

const labDipRouter = Router();

// info routes
export const pathLabDipInfo = {
	'/lab-dip/info': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get all lab dip info',
			description: 'Get all lab dip info',
			parameters: [],
			responses: {
				200: {
					description: 'Returns all lab dip info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['lab_dip.info'],
			summary: 'Create a lab dip info',
			description: 'Create a lab dip info',
			operationId: 'createLabDipInfo',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/info',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip info created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/info',
							},
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/lab-dip/info/{uuid}': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip info by uuid',
			description: 'Get lab dip info by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip info to get',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip info found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.info'],
			summary: 'Update an existing lab dip info',
			description: 'Update an existing lab dip info',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip info to update',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/info',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.info'],
			summary: 'Delete a lab dip info',
			description: 'Delete a lab dip info',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip info to delete',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
			},
		},
	},
	'/lab-dip/info/by/{lab_dip_info_uuid}': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip info by lab_dip_info_uuid',
			description: 'Get lab dip info by lab_dip_info_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'lab_dip_info_uuid',
					in: 'path',
					description: 'lab dip info to get',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip info found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
			},
		},
	},
	'/lab-dip/info/details/{lab_dip_info_uuid}': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip recipe by lab_dip_info_uuid',
			description: 'Get lab dip recipe by lab_dip_info_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'lab_dip_info_uuid',
					in: 'path',
					description: 'lab dip info to get',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip info found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
									recipe: {
										type: 'object',
										properties: {
											recipe_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											recipe_name: {
												type: 'string',
												example:
													'LDR24-0001 - Recipe 1',
											},
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
			},
		},
	},
};

labDipRouter.get('/info', infoOperations.selectAll);
labDipRouter.get('/info/:uuid', validateUuidParam(), infoOperations.select);
labDipRouter.post('/info', infoOperations.insert);
labDipRouter.put('/info/:uuid', infoOperations.update);
labDipRouter.delete('/info/:uuid', validateUuidParam(), infoOperations.remove);
labDipRouter.get(
	'/info/by/:lab_dip_info_uuid',
	infoOperations.selectInfoByLabDipInfoUuid
);
labDipRouter.get(
	'/info/details/:lab_dip_info_uuid',
	infoOperations.selectInfoRecipeByLabDipInfoUuid
);

// recipe routes

export const pathLabDipRecipe = {
	'/lab-dip/recipe': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get all lab dip recipe',
			description: 'Get all lab dip recipe',
			responses: {
				200: {
					description: 'Returns all lab dip recipe',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['lab_dip.recipe'],
			summary: 'Create a lab dip recipe',
			description: 'Create a lab dip recipe',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip recipe created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/recipe',
							},
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/lab-dip/recipe/{uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe by uuid',
			description: 'Get lab dip recipe by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip recipe to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.recipe'],
			summary: 'Update an existing lab dip recipe',
			description: 'Update an existing lab dip recipe',
			operationId: 'updateLabDipRecipe',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.recipe'],
			summary: 'Delete a lab dip recipe',
			description: 'Delete a lab dip recipe',
			operationId: 'deleteLabDipRecipe',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe to delete',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
			},
		},
	},
	'/lab-dip/recipe/by/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe by recipe_uuid',
			description: 'Get lab dip recipe by recipe_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'lab dip recipe to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
			},
		},
	},
	'/lab-dip/recipe/details/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe details by recipe_uuid',
			description: 'Get lab dip recipe details by recipe_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'lab dip recipe to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe details found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
									recipe_entry: {
										type: 'object',
										properties: {
											uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											recipe_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											recipe_name: {
												type: 'string',
												example: 'Recipe 1',
											},
											color: {
												type: 'string',
												example: 'Red',
											},
											quantity: {
												type: 'number',
												example: 10.0,
											},
											created_at: {
												type: 'string',
												format: 'date-time',
												example: '2024-01-01 00:00:00',
											},
											updated_at: {
												type: 'string',
												format: 'date-time',
												example: '2024-01-01 00:00:00',
											},
											remarks: {
												type: 'string',
												example: 'Remarks',
											},
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe details not found',
				},
			},
		},
	},
	'/lab-dip/info-recipe/by/{lab_dip_info_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe by lab_dip_info_uuid',
			description: 'Get lab dip recipe by lab_dip_info_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'lab_dip_info_uuid',
					in: 'path',
					description: 'lab dip info to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
			},
		},
	},
	'/lab-dip/update-recipe/by/{recipe_uuid}': {
		put: {
			tags: ['lab_dip.recipe'],
			summary: 'Update an existing lab dip recipe by recipe_uuid',
			description: 'Update an existing lab dip recipe by recipe_uuid',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'Lab dip info to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								lab_dip_info_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
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
					description: 'Lab dip recipe not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
	},
	'/lab-dip/update-recipe/remove-lab-dip-info-uuid/by/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Update an existing lab dip recipe by recipe_uuid',
			description: 'Update an existing lab dip recipe by recipe_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'Lab dip info to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe updated successfully',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
			},
		},
	},
};

labDipRouter.get('/recipe', recipeOperations.selectAll);
labDipRouter.get('/recipe/:uuid', validateUuidParam(), recipeOperations.select);
labDipRouter.post('/recipe', recipeOperations.insert);
labDipRouter.put('/recipe/:uuid', recipeOperations.update);
labDipRouter.delete(
	'/recipe/:uuid',
	validateUuidParam(),
	recipeOperations.remove
);
labDipRouter.get(
	'/recipe/by/:recipe_uuid',
	recipeOperations.selectRecipeByRecipeUuid
);
labDipRouter.get(
	'/recipe/details/:recipe_uuid',
	recipeOperations.selectRecipeDetailsByRecipeUuid
);
labDipRouter.get(
	'/info-recipe/by/:lab_dip_info_uuid',
	recipeOperations.selectRecipeByLabDipInfoUuid
);
labDipRouter.put(
	'/update-recipe/by/:recipe_uuid',
	recipeOperations.updateRecipeByLabDipInfoUuid
);
labDipRouter.get(
	'/update-recipe/remove-lab-dip-info-uuid/by/:recipe_uuid',
	recipeOperations.updateRecipeWhenRemoveLabDipInfoUuid
);

// recipe_entry routes
export const pathLabDipRecipeEntry = {
	'/lab-dip/recipe-entry': {
		get: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Get all lab dip recipe entry',
			description: 'Get all lab dip recipe entry',
			responses: {
				200: {
					description: 'Returns all lab dip recipe entry',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_name: {
										type: 'string',
										example: 'Recipe 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									quantity: {
										type: 'number',
										example: 10.0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Create a lab dip recipe entry',
			description: 'Create a lab dip recipe entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe_entry',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip recipe entry created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/recipe_entry',
							},
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/lab-dip/recipe-entry/{uuid}': {
		get: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Get lab dip recipe entry by uuid',
			description: 'Get lab dip recipe entry by uuid',
			operationId: 'getLabDipRecipeEntry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip recipe entry to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Update an existing lab dip recipe entry',
			description: 'Update an existing lab dip recipe entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe entry to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe_entry',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Delete a lab dip recipe entry',
			description: 'Delete a lab dip recipe entry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe entry to delete',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
			},
		},
	},
	'/lab-dip/recipe-entry/by/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Get lab dip recipe entry by recipe_uuid',
			description: 'Get lab dip recipe entry by recipe_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'lab dip recipe entry to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe entry found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_name: {
										type: 'string',
										example: 'Recipe 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									quantity: {
										type: 'number',
										example: 10.0,
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
			},
		},
	},
};

labDipRouter.get('/recipe-entry', recipeEntryOperations.selectAll);
labDipRouter.get(
	'/recipe-entry/:uuid',
	validateUuidParam(),
	recipeEntryOperations.select
);
labDipRouter.post('/recipe-entry', recipeEntryOperations.insert);
labDipRouter.put('/recipe-entry/:uuid', recipeEntryOperations.update);
labDipRouter.delete(
	'/recipe-entry/:uuid',
	validateUuidParam(),
	recipeEntryOperations.remove
);
labDipRouter.get(
	'/recipe-entry/by/:recipe_uuid',
	recipeEntryOperations.selectRecipeEntryByRecipeUuid
);

export const pathLabDip = {
	...pathLabDipInfo,
	...pathLabDipRecipe,
	...pathLabDipRecipeEntry,
};

export { labDipRouter };
