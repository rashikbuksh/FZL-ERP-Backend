import { request, response, Router } from 'express';
import { properties } from '../public/schema.js';
import * as challanOperations from './query/challan.js';
import * as challanEntryOperations from './query/challan_entry.js';
import * as packingListOperations from './query/packing_list.js';
import * as packingListEntryOperations from './query/packing_list_entry.js';

const deliveryRouter = Router();

// packing_list routes
export const pathDeliveryPackingList = {
	'/delivery/packing-list': {
		get: {
			tags: ['delivery.packing-list'],
			summary: 'Get all packing lists',
			description: 'Get all packing lists',
			// operationId: "getPackingList",
			responses: {
				200: {
					description: 'Return list of packing lists',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									carton_size: {
										type: 'string',
										example: '10x10x10',
									},
									carton_weight: {
										type: 'string',
										example: '10kg',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
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
			tags: ['delivery.packing-list'],
			summary: 'Create a new packing list',
			description: 'Create a new packing list',
			// operationId: "createPackingList",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/delivery/packing_list',
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
							$ref: '#/definitions/delivery/packing_list',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/delivery/packing-list/{uuid}': {
		get: {
			tags: ['delivery.packing-list'],
			summary: 'Get a packing list by uuid',
			description: 'Get a packing list by uuid',
			// operationId: "getPackingListByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' packing list to get',
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
					description: 'Packing list not found',
				},
			},
		},
		put: {
			tags: ['delivery.packing-list'],
			summary: 'Update a packing list by uuid',
			description: 'Update a packing list by uuid',
			// operationId: "updatePackingListByUuid",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' packing list to update',
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
							$ref: '#/definitions/delivery/packing_list',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Packing list not found',
				},
				405: { description: 'Validation exception' },
			},
		},
		delete: {
			tags: ['delivery.packing-list'],
			summary: 'Delete a packing list by uuid',
			description: 'Delete a packing list by uuid',
			// operationId: "deletePackingListByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'packing list to delete',
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
					description: 'Packing list not found',
				},
			},
		},
	},
};

deliveryRouter.get('/packing-list', packingListOperations.selectAll);
deliveryRouter.get(
	'/packing-list/:uuid',

	packingListOperations.select
);
deliveryRouter.post('/packing-list', packingListOperations.insert);
deliveryRouter.put('/packing-list/:uuid', packingListOperations.update);
deliveryRouter.delete(
	'/packing-list/:uuid',

	packingListOperations.remove
);

// packing_list_entry routes
export const pathDeliveryPackingListEntry = {
	'/delivery/packing-list-entry': {
		get: {
			tags: ['delivery.packing-list-entry'],
			summary: 'Get all packing list entries',
			description: 'Get all packing list entries',
			// operationId: "getPackingListEntry",
			responses: {
				200: {
					description: 'Return list of packing list entries',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									packing_list_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									quantity: {
										type: 'number',
										example: 100,
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
			tags: ['delivery.packing-list-entry'],
			summary: 'Create a new packing list entry',
			description: 'Create a new packing list entry',
			// operationId: "createPackingListEntry",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/delivery/packing_list_entry',
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
							$ref: '#/definitions/delivery/packing_list_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/delivery/packing-list-entry/{uuid}': {
		get: {
			tags: ['delivery.packing-list-entry'],
			summary: 'Get a packing list entry by uuid',
			description: 'Get a packing list entry by uuid',
			// operationId: "getPackingListEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' packing list entry to get',
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
					description: 'Packing list entry not found',
				},
			},
		},
		put: {
			tags: ['delivery.packing-list-entry'],
			summary: 'Update a packing list entry by uuid',
			description: 'Update a packing list entry by uuid',
			// operationId: "updatePackingListEntryByUuid",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' packing list entry to update',
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
							$ref: '#/definitions/delivery/packing_list_entry',
						},
					},
				},
			},

			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Packing list entry not found',
				},
				405: { description: 'Validation exception' },
			},
		},
		delete: {
			tags: ['delivery.packing-list-entry'],
			summary: 'Delete a packing list entry by uuid',
			description: 'Delete a packing list entry by uuid',
			// operationId: "deletePackingListEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'packing list entry to delete',
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
					description: 'Packing list entry not found',
				},
			},
		},
	},
};

deliveryRouter.get('/packing-list-entry', packingListEntryOperations.selectAll);
deliveryRouter.get(
	'/packing-list-entry/:uuid',

	packingListEntryOperations.select
);
deliveryRouter.post('/packing-list-entry', packingListEntryOperations.insert);
deliveryRouter.put(
	'/packing-list-entry/:uuid',
	packingListEntryOperations.update
);
deliveryRouter.delete(
	'/packing-list-entry/:uuid',

	packingListEntryOperations.remove
);

// challan routes
export const pathDeliveryChallan = {
	'/delivery/challan': {
		get: {
			tags: ['delivery.challan'],
			summary: 'Get all challans',
			description: 'Get all challans',
			// operationId: "getChallan",
			responses: {
				200: {
					description: 'Return list of challans',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									carton_quantity: {
										type: 'number',
										example: 100,
									},
									assign_to: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									assign_to_name: {
										type: 'string',
										example: 'John Doe',
									},
									receive_status: {
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
			tags: ['delivery.challan'],
			summary: 'Create a new challan',
			description: 'Create a new challan',
			// operationId: "createChallan",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/delivery/challan',
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
							$ref: '#/definitions/delivery/challan',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/delivery/challan/{uuid}': {
		get: {
			tags: ['delivery.challan'],
			summary: 'Get a challan by uuid',
			description: 'Get a challan by uuid',
			// operationId: "getChallanByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' challan to get',
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
					description: 'Challan not found',
				},
			},
		},
		put: {
			tags: ['delivery.challan'],
			summary: 'Update a challan by uuid',
			description: 'Update a challan by uuid',
			// operationId: "updateChallanByUuid",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' challan to update',
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
							$ref: '#/definitions/delivery/challan',
						},
					},
				},
			},

			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Challan not found',
				},
				405: { description: 'Validation exception' },
			},
		},
		delete: {
			tags: ['delivery.challan'],
			summary: 'Delete a challan by uuid',
			description: 'Delete a challan by uuid',
			// operationId: "deleteChallanByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'challan to delete',
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
					description: 'Challan not found',
				},
			},
		},
	},
};

deliveryRouter.get('/challan', challanOperations.selectAll);
deliveryRouter.get(
	'/challan/:uuid',

	challanOperations.select
);
deliveryRouter.post('/challan', challanOperations.insert);
deliveryRouter.put('/challan/:uuid', challanOperations.update);
deliveryRouter.delete(
	'/challan/:uuid',

	challanOperations.remove
);

// challan_entry routes
export const pathDeliveryChallanEntry = {
	'/delivery/challan-entry': {
		get: {
			tags: ['delivery.challan-entry'],
			summary: 'Get all challan entries',
			description: 'Get all challan entries',
			// operationId: "getChallanEntry",
			responses: {
				200: {
					description: 'Return list of challan entries',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									challan_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									challan_assign_to: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									challan_assign_to_name: {
										type: 'string',
										example: 'John Doe',
									},
									challan_created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									challan_created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									packing_list_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									delivery_quantity: {
										type: 'number',
										example: 100,
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
			tags: ['delivery.challan-entry'],
			summary: 'Create a new challan entry',
			description: 'Create a new challan entry',
			// operationId: "createChallanEntry",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/delivery/challan_entry',
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
							$ref: '#/definitions/delivery/challan_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/delivery/challan-entry/{uuid}': {
		get: {
			tags: ['delivery.challan-entry'],
			summary: 'Get a challan entry by uuid',
			description: 'Get a challan entry by uuid',
			// operationId: "getChallanEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' challan entry to get',
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
					description: 'Challan entry not found',
				},
			},
		},
		put: {
			tags: ['delivery.challan-entry'],
			summary: 'Update a challan entry by uuid',
			description: 'Update a challan entry by uuid',
			// operationId: "updateChallanEntryByUuid",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' challan entry to update',
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
							$ref: '#/definitions/delivery/challan_entry',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Challan entry not found',
				},
				405: { description: 'Validation exception' },
			},
		},
		delete: {
			tags: ['delivery.challan-entry'],
			summary: 'Delete a challan entry by uuid',
			description: 'Delete a challan entry by uuid',
			// operationId: "deleteChallanEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'challan entry to delete',
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
					description: 'Challan entry not found',
				},
			},
		},
	},
};

deliveryRouter.get('/challan-entry', challanEntryOperations.selectAll);
deliveryRouter.get(
	'/challan-entry/:uuid',

	challanEntryOperations.select
);
deliveryRouter.post('/challan-entry', challanEntryOperations.insert);
deliveryRouter.put('/challan-entry/:uuid', challanEntryOperations.update);
deliveryRouter.delete(
	'/challan-entry/:uuid',

	challanEntryOperations.remove
);
export const pathDelivery = {
	...pathDeliveryPackingList,
	...pathDeliveryPackingListEntry,
	...pathDeliveryChallan,
	...pathDeliveryChallanEntry,
};

export { deliveryRouter };
