import { desc } from 'drizzle-orm';
import { Router } from 'express';
import * as batchOperations from './query/batch.js';
import * as batchEntryOperations from './query/batch_entry.js';
import * as dyingBatchOperations from './query/dying_batch.js';
import * as dyingBatchEntryOperations from './query/dying_batch_entry.js';
import * as orderDescriptionOperations from './query/order_description.js';
import * as orderEntryOperations from './query/order_entry.js';
import * as orderInfoOperations from './query/order_info.js';
import * as sfgOperations from './query/sfg.js';
import * as sfgProductionOperations from './query/sfg_production.js';
import * as sfgTransactionOperations from './query/sfg_transaction.js';
import * as tapeCoilOperations from './query/tape_coil.js';
import * as tapeCoilProductionOperations from './query/tape_coil_production.js';
import * as tapeToCoilOperations from './query/tape_to_coil.js';

const zipperRouter = Router();

// --------------------- ORDER ---------------------

export const pathZipperOrderInfo = {
	'/zipper/order-info': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get all Order Info',
			responses: {
				200: {
					description: 'Returns all Order Info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: { type: 'number', example: 1 },
									reference_order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'John',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'John',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'John',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'John',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'John',
									},
									is_sample: { type: 'integer', example: 0 },
									is_bill: { type: 'integer', example: 0 },
									is_cash: { type: 'integer', example: 0 },
									marketing_priority: {
										type: 'string',
										example: 'Urgent',
									},
									factory_priority: {
										type: 'string',
										example: 'FIFO',
									},
									status: { type: 'integer', example: 0 },
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John',
									},
									created_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
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
			tags: ['zipper.order_info'],
			summary: 'create a order info',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								reference_order_info_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								buyer_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								party_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								marketing_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								merchandiser_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								factory_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								is_sample: { type: 'integer', example: 0 },
								is_bill: { type: 'integer', example: 0 },
								is_cash: { type: 'integer', example: 0 },
								marketing_priority: {
									type: 'string',
									example: 'Urgent',
								},
								factory_priority: {
									type: 'string',
									example: 'FIFO',
								},
								status: { type: 'integer', example: 0 },
								created_by: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								created_at: {
									type: 'string',
									example: '2021-08-01 00:00:00',
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
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/order_info',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/order-info/{uuid}': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Gets a Order Info',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'orderInfo to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'Returns all Order Info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: { type: 'number', example: 1 },
									reference_order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'John',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'John',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'John',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'John',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'John',
									},
									is_sample: { type: 'integer', example: 0 },
									is_bill: { type: 'integer', example: 0 },
									is_cash: { type: 'integer', example: 0 },
									marketing_priority: {
										type: 'string',
										example: 'Urgent',
									},
									merchandiser_priority: {
										type: 'string',
										example: 'Urgent',
									},
									factory_priority: {
										type: 'string',
										example: 'FIFO',
									},
									status: { type: 'integer', example: 0 },
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John',
									},
									created_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
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
					description: 'User not found',
				},
			},
		},
		put: {
			tags: ['zipper.order_info'],
			summary: 'Update an existing order info',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'uuid - string. length: 15',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'order info object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/order_info',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'order info not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.order_info'],
			summary: 'Deletes a order info',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'order info to delete',
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
					description: 'Order Info not found',
				},
			},
		},
	},
};

// --------------------- ORDER INFO ROUTES ---------------------

zipperRouter.get('/order-info', orderInfoOperations.selectAll);
zipperRouter.get(
	'/order-info/:uuid',
	// validateUuidParam(),
	orderInfoOperations.select
);
zipperRouter.post('/order-info', orderInfoOperations.insert);
zipperRouter.put('/order-info/:uuid', orderInfoOperations.update);
zipperRouter.delete(
	'/order-info/:uuid',
	// validateUuidParam(),
	orderInfoOperations.remove
);

// --------------------- ORDER DESCRIPTION ---------------------

export const pathZipperOrderDescription = {
	'/zipper/order-description': {
		get: {
			tags: ['zipper.order_description'],
			summary: 'Get all Order Description',
			responses: {
				200: {
					description: 'Returns all Order Description',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
										description: 'uuid',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
									created_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.order_description'],
			summary: 'create a order description',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Order Description',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/order_description',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/order_description',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/order-description/{uuid}': {
		get: {
			tags: ['zipper.order_description'],
			summary: 'Gets a Order Description',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'orderDescription to get',
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
		put: {
			tags: ['zipper.order_description'],
			summary: 'Update an existing order description',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'order description to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'order description object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/order_description',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'order description not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.order_description'],
			summary: 'Deletes a order description',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'order description to delete',
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
					description: 'Order Description not found',
				},
			},
		},
	},
};

// --------------------- ORDER DESCRIPTION ROUTES ---------------------

zipperRouter.get('/order-description', orderDescriptionOperations.selectAll);
zipperRouter.get(
	'/order-description/:uuid',
	// validateUuidParam(),
	orderDescriptionOperations.select
);
zipperRouter.post('/order-description', orderDescriptionOperations.insert);
zipperRouter.put('/order-description/:uuid', orderDescriptionOperations.update);
zipperRouter.delete(
	'/order-description/:uuid',
	// validateUuidParam(),
	orderDescriptionOperations.remove
);

// --------------------- ORDER ENTRY ---------------------

export const pathZipperOrderEntry = {
	'/zipper/order-entry': {
		get: {
			tags: ['zipper.order_entry'],
			summary: 'Get all Order Entry',
			responses: {
				200: {
					description: 'Returns all Order Entry',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/order_entry',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.order_entry'],
			summary: 'create a order entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Order Entry',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/order_entry',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/order_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/order-entry/{uuid}': {
		get: {
			tags: ['zipper.order_entry'],
			summary: 'Gets a Order Entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'orderEntry to get',
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
		put: {
			tags: ['zipper.order_entry'],
			summary: 'Update an existing order entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'order entry to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'order entry object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/order_entry',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'order entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.order_entry'],
			summary: 'Deletes a order entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'order entry to delete',
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
					description: 'Order Entry not found',
				},
			},
		},
	},
};

// --------------------- ORDER ENTRY ROUTES ---------------------

zipperRouter.get('/order-entry', orderEntryOperations.selectAll);
zipperRouter.get(
	'/order-entry/:uuid',
	// validateUuidParam(),
	orderEntryOperations.select
);
zipperRouter.post('/order-entry', orderEntryOperations.insert);
zipperRouter.put('/order-entry/:uuid', orderEntryOperations.update);
zipperRouter.delete(
	'/order-entry/:uuid',
	// validateUuidParam(),
	orderEntryOperations.remove
);

// --------------------- SFG ---------------------

export const pathZipperSfg = {
	'/zipper/sfg': {
		get: {
			tags: ['zipper.sfg'],
			summary: 'Get all SFG',
			responses: {
				200: {
					description: 'Returns all SFG',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/sfg',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.sfg'],
			summary: 'create a sfg',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'SFG',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/sfg',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/sfg',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/sfg/{uuid}': {
		get: {
			tags: ['zipper.sfg'],
			summary: 'Gets a SFG',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg to get',
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
		put: {
			tags: ['zipper.sfg'],
			summary: 'Update an existing sfg',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'sfg object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/sfg',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'sfg not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.sfg'],
			summary: 'Deletes a sfg',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg to delete',
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
					description: 'SFG not found',
				},
			},
		},
	},
};

// --------------------- SFG ROUTES ---------------------

zipperRouter.get('/sfg', sfgOperations.selectAll);
// zipperRouter.get("/sfg/:uuid", validateUuidParam(), sfgOperations.select);
zipperRouter.post('/sfg', sfgOperations.insert);
zipperRouter.put('/sfg/:uuid', sfgOperations.update);
// zipperRouter.delete("/sfg/:uuid", validateUuidParam(), sfgOperations.remove);

// --------------------- SFG PRODUCTION ---------------------

export const pathZipperSfgProduction = {
	'/zipper/sfg-production': {
		get: {
			tags: ['zipper.sfg_production'],
			summary: 'Get all SFG Production',
			responses: {
				200: {
					description: 'Returns all SFG Production',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/sfg_production',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.sfg_production'],
			summary: 'create a sfg production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'SFG Production',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/sfg_production',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/sfg_production',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/sfg-production/{uuid}': {
		get: {
			tags: ['zipper.sfg_production'],
			summary: 'Gets a SFG Production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfgProduction to get',
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
		put: {
			tags: ['zipper.sfg_production'],
			summary: 'Update an existing sfg production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg production to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'sfg production object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/sfg_production',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'sfg production not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.sfg_production'],
			summary: 'Deletes a sfg production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg production to delete',
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
					description: 'SFG Production not found',
				},
			},
		},
	},
};

// --------------------- SFG PRODUCTION ROUTES ---------------------

zipperRouter.get('/sfg-production', sfgProductionOperations.selectAll);
zipperRouter.get(
	'/sfg_production/:uuid',
	// validateUuidParam(),
	sfgProductionOperations.select
);
zipperRouter.post('/sfg-production', sfgProductionOperations.insert);
zipperRouter.put('/sfg-production/:uuid', sfgProductionOperations.update);
zipperRouter.delete(
	'/sfg-production/:uuid',
	// validateUuidParam(),
	sfgProductionOperations.remove
);

// --------------------- SFG TRANSACTION ---------------------

export const pathZipperSfgTransaction = {
	'/zipper/sfg-transaction': {
		get: {
			tags: ['zipper.sfg_transaction'],
			summary: 'Get all SFG Transaction',
			responses: {
				200: {
					description: 'Returns all SFG Transaction',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/sfg_transaction',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.sfg_transaction'],
			summary: 'create a sfg transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'SFG Transaction',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/sfg_transaction',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/sfg_transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/sfg-transaction/{uuid}': {
		get: {
			tags: ['zipper.sfg_transaction'],
			summary: 'Gets a SFG Transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfgTransaction to get',
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
		put: {
			tags: ['zipper.sfg_transaction'],
			summary: 'Update an existing sfg transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg transaction to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'sfg transaction object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/sfg_transaction',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'sfg transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.sfg_transaction'],
			summary: 'Deletes a sfg transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'sfg transaction to delete',
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
					description: 'SFG Transaction not found',
				},
			},
		},
	},
};

// --------------------- SFG TRANSACTION ROUTES ---------------------

zipperRouter.get('/sfg-transaction', sfgTransactionOperations.selectAll);
zipperRouter.get(
	'/sfg-transaction/:uuid',
	// validateUuidParam(),
	sfgTransactionOperations.select
);
zipperRouter.post('/sfg-transaction', sfgTransactionOperations.insert);
zipperRouter.put('/sfg-transaction/:uuid', sfgTransactionOperations.update);
zipperRouter.delete(
	'/sfg-transaction/:uuid',
	// validateUuidParam(),
	sfgTransactionOperations.remove
);

// --------------------- BATCH ---------------------

export const pathZipperBatch = {
	'/zipper/batch': {
		get: {
			tags: ['zipper.batch'],
			summary: 'Get all Batch',
			responses: {
				200: {
					description: 'Returns all Batch',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/batch',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.batch'],
			summary: 'create a batch',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Batch',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/batch',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/batch',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/batch/{uuid}': {
		get: {
			tags: ['zipper.batch'],
			summary: 'Gets a Batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'batch to get',
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
		put: {
			tags: ['zipper.batch'],
			summary: 'Update an existing batch',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'batch to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'batch object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/batch',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'batch not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
	},
};

// --------------------- BATCH ROUTES ---------------------

zipperRouter.get('/batch', batchOperations.selectAll);
// zipperRouter.get("/batch/:uuid", validateUuidParam(), batchOperations.select);
zipperRouter.post('/batch', batchOperations.insert);
zipperRouter.put('/batch/:uuid', batchOperations.update);
zipperRouter.delete(
	'/batch/:uuid',
	// validateUuidParam(),
	batchOperations.remove
);

// --------------------- BATCH ENTRY ---------------------

export const pathZipperBatchEntry = {
	'/zipper/batch-entry': {
		get: {
			tags: ['zipper.batch_entry'],
			summary: 'Get all Batch Entry',
			responses: {
				200: {
					description: 'Returns all Batch Entry',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/batch_entry',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.batch_entry'],
			summary: 'create a batch entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Batch Entry',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/batch_entry',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/batch_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/batch-entry/{uuid}': {
		get: {
			tags: ['zipper.batch_entry'],
			summary: 'Gets a Batch Entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'batchEntry to get',
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
		put: {
			tags: ['zipper.batch_entry'],
			summary: 'Update an existing batch entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'batch entry to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'batch entry object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/batch_entry',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'batch entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.batch_entry'],
			summary: 'Deletes a batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'batch entry to delete',
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
					description: 'Batch Entry not found',
				},
			},
		},
	},
};

// --------------------- BATCH ENTRY ROUTES ---------------------

zipperRouter.get('/batch-entry', batchEntryOperations.selectAll);
zipperRouter.get(
	'/batch-entry/:uuid',
	// validateUuidParam(),
	batchEntryOperations.select
);
zipperRouter.post('/batch-entry', batchEntryOperations.insert);
zipperRouter.put('/batch-entry/:uuid', batchEntryOperations.update);
zipperRouter.delete(
	'/batch-entry/:uuid',
	// validateUuidParam(),
	batchEntryOperations.remove
);

// --------------------- DYING BATCH ---------------------

export const pathZipperDyingBatch = {
	'/zipper/dying-batch': {
		get: {
			tags: ['zipper.dying_batch'],
			summary: 'Get all Dying Batch',
			responses: {
				200: {
					description: 'Returns all Dying Batch',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/dying_batch',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.dying_batch'],
			summary: 'create a dying batch',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Dying Batch',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/dying_batch',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/dying_batch',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/dying-batch/{uuid}': {
		get: {
			tags: ['zipper.dying_batch'],
			summary: 'Gets a Dying Batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'dyingBatch to get',
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
		put: {
			tags: ['zipper.dying_batch'],
			summary: 'Update an existing dying batch',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'dying batch to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'dying batch object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/dying_batch',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'dying batch not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.dying_batch'],
			summary: 'Deletes a dying batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'dying batch to delete',
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
					description: 'Dying Batch not found',
				},
			},
		},
	},
};

// --------------------- DYING BATCH ROUTES ---------------------

zipperRouter.get('/dying-batch', dyingBatchOperations.selectAll);
zipperRouter.get(
	'/dying-batch/:uuid',
	// validateUuidParam(),
	dyingBatchOperations.select
);
zipperRouter.post('/dying-batch', dyingBatchOperations.insert);
zipperRouter.put('/dying-batch/:uuid', dyingBatchOperations.update);
zipperRouter.delete(
	'/dying-batch/:uuid',
	// validateUuidParam(),
	dyingBatchOperations.remove
);

// --------------------- DYING BATCH ENTRY ---------------------

export const pathZipperDyingBatchEntry = {
	'/zipper/dying-batch-entry': {
		get: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'Get all Dying Batch',
			responses: {
				200: {
					description: 'Returns all Dying Batch',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/dying_batch_entry',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'create a dying batch entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Dying Batch Entry',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/dying_batch_entry',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/dying_batch_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/dying-batch-entry/{uuid}': {
		get: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'Gets a Dying Batch Entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'dyingBatchEntry to get',
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
					description: 'Dying Batch Entry not found',
				},
			},
		},
		put: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'Update an existing dying batch entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'dying batch entry to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'dying batch object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/dying_batch_entry',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'dying batch entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'Deletes a dying batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'dying batch to delete',
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
					description: 'Dying Batch Entry not found',
				},
			},
		},
	},
};

// --------------------- DYING BATCH ENTRY ROUTES ---------------------

zipperRouter.get('/dying-batch-entry', dyingBatchEntryOperations.selectAll);
zipperRouter.get(
	'/dying-batch-entry/:uuid',
	// validateUuidParam(),
	dyingBatchEntryOperations.select
);
zipperRouter.post('/dying-batch-entry', dyingBatchEntryOperations.insert);
zipperRouter.put('/dying-batch-entry/:uuid', dyingBatchEntryOperations.update);
zipperRouter.delete(
	'/dying-batch-entry/:uuid',
	// validateUuidParam(),
	dyingBatchEntryOperations.remove
);

// --------------------- TAPE COIL ---------------------

export const pathZipperTapeCoil = {
	'/zipper/tape-coil': {
		get: {
			tags: ['zipper.tape_coil'],
			summary: 'Get all Tape Coil',
			responses: {
				200: {
					description: 'Returns all Tape Coil',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/tape_coil',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.tape_coil'],
			summary: 'create a tape coil',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Tape Coil',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/tape_coil',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/tape_coil',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/tape-coil/{uuid}': {
		get: {
			tags: ['zipper.tape_coil'],
			summary: 'Gets a Tape Coil',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tapeCoil to get',
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
		put: {
			tags: ['zipper.tape_coil'],
			summary: 'Update an existing tape coil',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'tape coil object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/tape_coil',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'tape coil not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.tape_coil'],
			summary: 'Deletes a tape coil',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil to delete',
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
					description: 'Tape Coil not found',
				},
			},
		},
	},
};

// --------------------- TAPE COIL ROUTES ---------------------

zipperRouter.get('/tape-coil', tapeCoilOperations.selectAll);
zipperRouter.get(
	'/tape-coil/:uuid',
	// validateUuidParam(),
	tapeCoilOperations.select
);
zipperRouter.post('/tape-coil', tapeCoilOperations.insert);
zipperRouter.put('/tape-coil/:uuid', tapeCoilOperations.update);
zipperRouter.delete(
	'/tape-coil/:uuid',
	// validateUuidParam(),
	tapeCoilOperations.remove
);

// --------------------- TAPE COIL PRODUCTION ---------------------

export const pathZipperTapeCoilProduction = {
	'/zipper/tape-coil-production': {
		get: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Get all Tape Coil Production',
			responses: {
				200: {
					description: 'Returns all Tape Coil Production',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/tape_coil_production',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.tape_coil_production'],
			summary: 'create a tape coil production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Tape Coil Production',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/tape_coil_production',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/tape_coil_production',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/tape-coil-production/{uuid}': {
		get: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Gets a Tape Coil Production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tapeCoilProduction to get',
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
		put: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Update an existing tape coil production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil production to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'tape coil production object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/tape_coil_production',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'tape coil production not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Deletes a tape coil production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil production to delete',
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
					description: 'Tape Coil Production not found',
				},
			},
		},
	},
};

// --------------------- TAPE COIL PRODUCTION ROUTES ---------------------

zipperRouter.get(
	'/tape-coil-production',
	tapeCoilProductionOperations.selectAll
);
zipperRouter.get(
	'/tape-coil-production/:uuid',
	// validateUuidParam(),
	tapeCoilProductionOperations.select
);
zipperRouter.post('/tape-coil-production', tapeCoilProductionOperations.insert);
zipperRouter.put(
	'/tape-coil-production/:uuid',
	tapeCoilProductionOperations.update
);
zipperRouter.delete(
	'/tape-coil-production/:uuid',
	// validateUuidParam(),
	tapeCoilProductionOperations.remove
);

// --------------------- TAPE TO COIL ---------------------

export const pathZipperTapeToCoil = {
	'/zipper/tape-to-coil': {
		get: {
			tags: ['zipper.tape_to_coil'],
			summary: 'Get all Tape To Coil',
			responses: {
				200: {
					description: 'Returns all Tape To Coil',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/zipper/tape_to_coil',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.tape_to_coil'],
			summary: 'create a tape to coil',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Tape To Coil',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/tape_to_coil',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/tape_to_coil',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/tape-to-coil/{uuid}': {
		get: {
			tags: ['zipper.tape_to_coil'],
			summary: 'Gets a Tape To Coil',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tapeToCoil to get',
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
		put: {
			tags: ['zipper.tape_to_coil'],
			summary: 'Update an existing tape to coil',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape to coil to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'tape to coil object that needs to be updated to the zipper',
					required: true,
					schema: {
						$ref: '#/definitions/zipper/tape_to_coil',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'tape to coil not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.tape_to_coil'],
			summary: 'Deletes a tape to coil',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape to coil to delete',
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
					description: 'Tape To Coil not found',
				},
			},
		},
	},
};

// --------------------- TAPE TO COIL ROUTES ---------------------

zipperRouter.get('/tape-to-coil', tapeToCoilOperations.selectAll);
zipperRouter.get(
	'/tape-to-coil/:uuid',
	// validateUuidParam(),
	tapeToCoilOperations.select
);
zipperRouter.post('/tape-to-coil', tapeToCoilOperations.insert);
zipperRouter.put('/tape-to-coil/:uuid', tapeToCoilOperations.update);
zipperRouter.delete(
	'/tape-to-coil/:uuid',
	// validateUuidParam(),
	tapeToCoilOperations.remove
);

export const pathZipper = {
	...pathZipperOrderInfo,
	...pathZipperOrderDescription,
	...pathZipperOrderEntry,
	...pathZipperSfg,
	...pathZipperSfgProduction,
	...pathZipperSfgTransaction,
	...pathZipperBatch,
	...pathZipperBatchEntry,
	...pathZipperDyingBatch,
	...pathZipperDyingBatchEntry,
	...pathZipperTapeCoil,
	...pathZipperTapeCoilProduction,
	...pathZipperTapeToCoil,
};

export { zipperRouter };
