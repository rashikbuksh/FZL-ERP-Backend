import { request, Router } from 'express';
import { properties } from '../public/schema.js';
import * as coloringTransactionOperations from './query/coloring_transaction.js';
import * as dieCastingOperations from './query/die_casting.js';
import * as dieCastingProductionOperations from './query/die_casting_production.js';
import * as dieCastingTransactionOperations from './query/die_casting_transaction.js';
import * as stockOperations from './query/stock.js';
import * as transactionOperations from './query/transaction.js';

const sliderRouter = Router();

// --------------------- STOCK ---------------------

export const pathSliderStock = {
	'/slider/stock': {
		get: {
			tags: ['slider.stock'],
			summary: 'Get all stock',
			responses: {
				200: {
					description: 'Success',
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
										xample: 'igD0v9DIJQhJeet',
									},
									item_name: {
										type: 'string',
										example: 'item name',
									},
									item_short_name: {
										type: 'string',
										example: 'item short name',
									},

									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_short_name: {
										type: 'string',
										example: 'zipper short name',
									},
									end_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_type_name: {
										type: 'string',
										example: 'end type name',
									},
									end_type_short_name: {
										type: 'string',
										example: 'end type short name',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_name: {
										type: 'string',
										example: 'puller name',
									},
									puller_short_name: {
										type: 'string',
										example: 'puller short name',
									},

									color: {
										type: 'string',
										example: 'red',
									},
									order_quantity: {
										type: 'number',
										example: 0.0,
									},
									body_quantity: {
										type: 'number',
										example: 0.0,
									},
									cap_quantity: {
										type: 'number',
										example: 0.0,
									},
									puller_quantity: {
										type: 'number',
										example: 0.0,
									},
									link_quantity: {
										type: 'number',
										example: 0.0,
									},
									sa_prod: {
										type: 'number',
										example: 0.0,
									},
									coloring_stock: {
										type: 'number',
										example: 0.0,
									},
									coloring_prod: {
										type: 'number',
										example: 0.0,
									},
									trx_to_finishing: {
										type: 'number',
										example: 0.0,
									},
									u_top_quantity: {
										type: 'number',
										example: 0.0,
									},
									h_bottom_quantity: {
										type: 'number',
										example: 0.0,
									},
									box_pin_quantity: {
										type: 'number',
										example: 0.0,
									},
									two_way_pin_quantity: {
										type: 'number',
										example: 0.0,
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
			tags: ['slider.stock'],
			summary: 'create a stock',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/stock',
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
							$ref: '#/definitions/slider/stock',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/slider/stock/{uuid}': {
		get: {
			tags: ['slider.stock'],
			summary: 'Gets a stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'stock to get',
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
					description: 'Stock not found',
				},
			},
		},
		put: {
			tags: ['slider.stock'],
			summary: 'Update an existing stock',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Stock to update',
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
							$ref: '#/definitions/slider/stock',
						},
					},
				},
			},

			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Stock not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.stock'],
			summary: 'Deletes a stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Stock to delete',
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
					description: 'Stock not found',
				},
			},
		},
	},
};

// --------------------- STOCK ROUTES ---------------------

sliderRouter.get('/stock', stockOperations.selectAll);
sliderRouter.get('/stock/:uuid', stockOperations.select);
sliderRouter.post('/stock', stockOperations.insert);
sliderRouter.put('/stock/:uuid', stockOperations.update);
sliderRouter.delete('/stock/:uuid', stockOperations.remove);

// --------------------- DIE CASTING ---------------------

export const pathSliderDieCasting = {
	'/slider/die-casting': {
		get: {
			tags: ['slider.die_casting'],
			summary: 'Get all die casting',
			responses: {
				200: {
					description: 'Success',
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
										example: 'die_casting 1',
									},
									item: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item_name: {
										type: 'string',
										example: 'item name',
									},
									item_short_name: {
										type: 'string',
										example: 'item short name',
									},
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_short_name: {
										type: 'string',
										example: 'zipper short name',
									},
									end_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_type_name: {
										type: 'string',
										example: 'end type name',
									},
									end_type_short_name: {
										type: 'string',
										example: 'end type short name',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_type_name: {
										type: 'string',
										example: 'puller type name',
									},
									puller_type_short_name: {
										type: 'string',
										example: 'puller type short name',
									},

									logo_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									logo_type_name: {
										type: 'string',
										example: 'logo type name',
									},
									logo_type_short_name: {
										type: 'string',
										example: 'logo type short name',
									},
									body_shape: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									body_shape_name: {
										type: 'string',
										example: 'body shape name',
									},
									body_shape_short_name: {
										type: 'string',
										example: 'body shape short name',
									},
									puller_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_link_name: {
										type: 'string',
										example: 'puller link name',
									},
									puller_link_short_name: {
										type: 'string',
										example: 'puller link short name',
									},
									stopper_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									stopper_type_name: {
										type: 'string',
										example: 'stopper type name',
									},
									stopper_type_short_name: {
										type: 'string',
										example: 'stopper type short name',
									},
									quantity: {
										type: 'number',
										example: 0.0,
									},
									weight: {
										type: 'number',
										example: 0.0,
									},
									pcs_per_kg: {
										type: 'number',
										example: 0.0,
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
			tags: ['slider.die_casting'],
			summary: 'create a die casting',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/die_casting',
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
							$ref: '#/definitions/slider/die_casting',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/slider/die-casting/{uuid}': {
		get: {
			tags: ['slider.die_casting'],
			summary: 'Gets a die casting',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'die casting to get',
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
					description: 'Die casting not found',
				},
			},
		},
		put: {
			tags: ['slider.die_casting'],
			summary: 'Update an existing die casting',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/die_casting',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Die casting not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.die_casting'],
			summary: 'Deletes a die casting',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting to delete',
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
					description: 'Die casting not found',
				},
			},
		},
	},
};

// --------------------- DIE CASTING ROUTES ---------------------

sliderRouter.get('/die-casting', dieCastingOperations.selectAll);
sliderRouter.get('/die-casting/:uuid', dieCastingOperations.select);
sliderRouter.post('/die-casting', dieCastingOperations.insert);
sliderRouter.put('/die-casting/:uuid', dieCastingOperations.update);
sliderRouter.delete(
	'/die-casting/:uuid',

	dieCastingOperations.remove
);

// --------------------- DIE CASTING PRODUCTION ---------------------

export const pathSliderDieCastingProduction = {
	'/slider/die-casting-production': {
		get: {
			tags: ['slider.die_casting_production'],
			summary: 'Get all die casting production',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/slider/die_casting_production',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['slider.die_casting_production'],
			summary: 'create a die casting production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'User object that needs to be added to the slider.die_casting_production',
					required: true,
					schema: {
						$ref: '#/definitions/slider/die_casting_production',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/slider/die_casting_production',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/slider/die-casting-production/{uuid}': {
		get: {
			tags: ['slider.die_casting_production'],
			summary: 'Gets a die casting production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'die casting production to get',
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
					description: 'Die casting production not found',
				},
			},
		},
		put: {
			tags: ['slider.die_casting_production'],
			summary: 'Update an existing die casting production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting production to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'User object that needs to be updated to the slider.die_casting_production',
					required: true,
					schema: {
						$ref: '#/definitions/slider/die_casting_production',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Die casting production not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.die_casting_production'],
			summary: 'Deletes a die casting production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting production to delete',
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
					description: 'Die casting production not found',
				},
			},
		},
	},
};

// --------------------- DIE CASTING PRODUCTION ROUTES ---------------------

sliderRouter.get(
	'/die-casting-production',
	dieCastingProductionOperations.selectAll
);
sliderRouter.get(
	'/die-casting-production/:uuid',

	dieCastingProductionOperations.select
);
sliderRouter.post(
	'/die-casting-production',
	dieCastingProductionOperations.insert
);
sliderRouter.put(
	'/die-casting-production/:uuid',
	dieCastingProductionOperations.update
);
sliderRouter.delete(
	'/die-casting-production/:uuid',

	dieCastingProductionOperations.remove
);

// --------------------- DIE CASTING TRANSACTION ---------------------

export const pathSliderDieCastingTransaction = {
	'/slider/die-casting-transaction': {
		get: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Get all die casting transaction',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/slider/die_casting_transaction',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['slider.die_casting_transaction'],
			summary: 'create a die casting transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'User object that needs to be added to the slider.die_casting_transaction',
					required: true,
					schema: {
						$ref: '#/definitions/slider/die_casting_transaction',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/slider/die_casting_transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/slider/die-casting-transaction/{uuid}': {
		get: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Gets a die casting transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'die casting transaction to get',
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
					description: 'Die casting transaction not found',
				},
			},
		},
		put: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Update an existing die casting transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting transaction to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'User object that needs to be updated to the slider.die_casting_transaction',
					required: true,
					schema: {
						$ref: '#/definitions/slider/die_casting_transaction',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Die casting transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Deletes a die casting transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting transaction to delete',
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
					description: 'Die casting transaction not found',
				},
			},
		},
	},
};

// --------------------- DIE CASTING TRANSACTION ROUTES ---------------------

sliderRouter.get(
	'/die-casting-transaction',
	dieCastingTransactionOperations.selectAll
);
sliderRouter.get(
	'/die-casting-transaction/:uuid',

	dieCastingTransactionOperations.select
);
sliderRouter.post(
	'/die-casting-transaction',
	dieCastingTransactionOperations.insert
);
sliderRouter.put(
	'/die-casting-transaction/:uuid',
	dieCastingTransactionOperations.update
);
sliderRouter.delete(
	'/die-casting-transaction/:uuid',

	dieCastingTransactionOperations.remove
);

// --------------------- TRANSACTION ---------------------

const pathSliderTransaction = {
	'/slider/transaction': {
		get: {
			tags: ['slider.transaction'],
			summary: 'Get all transaction',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									stock_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section: {
										type: 'string',
										example: 'section',
									},
									trx_quantity: {
										type: 'number',
										example: 0.0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
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
									updated_at: {
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
			tags: ['slider.transaction'],
			summary: 'create a transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/transaction',
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
							$ref: '#/definitions/slider/transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/slider/transaction/{uuid}': {
		get: {
			tags: ['slider.transaction'],
			summary: 'Gets a transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'transaction to get',
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
					description: 'Transaction not found',
				},
			},
		},
		put: {
			tags: ['slider.transaction'],
			summary: 'Update an existing transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Transaction to update',
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
							$ref: '#/definitions/slider/transaction',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.transaction'],
			summary: 'Deletes a transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Transaction to delete',
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
					description: 'Transaction not found',
				},
			},
		},
	},
};

// --------------------- Transaction Routes ---------------------

sliderRouter.get('/transaction', transactionOperations.selectAll);
sliderRouter.get(
	'/transaction/:uuid',

	transactionOperations.select
);
sliderRouter.post('/transaction', transactionOperations.insert);
sliderRouter.put('/transaction/:uuid', transactionOperations.update);
sliderRouter.delete(
	'/transaction/:uuid',

	transactionOperations.remove
);

// --------------------- Coloring Transaction --------------------------------

const pathSliderColoringTransaction = {
	'/slider/coloring-transaction': {
		get: {
			tags: ['slider.coloring_transaction'],
			summary: 'Get all coloring transaction',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/slider/coloring_transaction',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['slider.coloring_transaction'],
			summary: 'create a coloring transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'User object that needs to be added to the slider.coloring_transaction',
					required: true,
					schema: {
						$ref: '#/definitions/slider/coloring_transaction',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/slider/coloring_transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/slider/coloring-transaction/{uuid}': {
		get: {
			tags: ['slider.coloring_transaction'],
			summary: 'Gets a coloring transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'coloring transaction to get',
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
					description: 'Coloring transaction not found',
				},
			},
		},
		put: {
			tags: ['slider.coloring_transaction'],
			summary: 'Update an existing coloring transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Coloring transaction to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'User object that needs to be updated to the slider.coloring_transaction',
					required: true,
					schema: {
						$ref: '#/definitions/slider/coloring_transaction',
					},
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Coloring transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.coloring_transaction'],
			summary: 'Deletes a coloring transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Coloring transaction to delete',
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
					description: 'Coloring transaction not found',
				},
			},
		},
	},
};

// --------------------- Coloring Transaction Routes ---------------------

sliderRouter.get(
	'/coloring-transaction',
	coloringTransactionOperations.selectAll
);
sliderRouter.get(
	'/coloring-transaction/:uuid',

	coloringTransactionOperations.select
);
sliderRouter.post(
	'/coloring-transaction',
	coloringTransactionOperations.insert
);
sliderRouter.put(
	'/coloring-transaction/:uuid',
	coloringTransactionOperations.update
);
sliderRouter.delete(
	'/coloring-transaction/:uuid',

	coloringTransactionOperations.remove
);

export const pathSlider = {
	...pathSliderStock,
	...pathSliderDieCasting,
	...pathSliderDieCastingProduction,
	...pathSliderDieCastingTransaction,
	...pathSliderTransaction,
	...pathSliderColoringTransaction,
};

export { sliderRouter };
