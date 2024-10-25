// * Delivery PackingList * //

import SE from '../../../util/swagger_example.js';
import { challan } from '../schema.js';

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
									carton_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									carton_name: {
										type: 'string',
										example: 'Carton 1',
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
	'/delivery/packing-list/details/{packing_list_uuid}': {
		get: {
			tags: ['delivery.packing-list'],
			summary: 'Get a packing list details by packing_list_uuid',
			description: 'Get a packing list details by packing_list_uuid',
			// operationId: "getPackingListDetailsByPackingListUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'packing_list_uuid',
					in: 'path',
					description: ' packing list to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
				SE.parameter_query('is_update', 'is_update', [true, false]),
			],
			responses: {
				200: {
					description: 'Return packing list',
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
									packing_list_entry: {
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Packing list not found',
				},
			},
		},
	},
	'/delivery/order-for-packing-list/{order_info_uuid}': {
		get: {
			tags: ['delivery.packing-list'],
			summary: 'Get all orders for packing list',
			description: 'Get all orders for packing list',
			// operationId: "getAllOrdersForPackingList",
			responses: {
				200: {
					description: 'Return list of orders for packing list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'NP-3-AL-SP',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									style_color_size: {
										type: 'string',
										example: 'Style -1 / Black / 20',
									},
									order_quantity: {
										type: 'number',
										example: 100,
									},
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									warehouse: SE.number(10),
									delivered: SE.number(10),
									balance_quantity: SE.number(10),
								},
							},
						},
					},
				},
			},
		},
	},
};

// * Delivery PackingListEntry * //

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
	'/delivery/packing-list-entry/by/{packing_list_uuid}': {
		get: {
			tags: ['delivery.packing-list-entry'],
			summary: 'Get a packing list entry by packing_list_uuid',
			description: 'Get a packing list entry by packing_list_uuid',
			// operationId: "getPackingListEntryByPackingListUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'packing_list_uuid',
					in: 'path',
					description: ' packing list entry to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Return packing list entry',
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Packing list entry not found',
				},
			},
		},
	},
	'/delivery/packing-list-entry/by/multi-packing-list-uuid/{packing_list_uuids}':
		{
			get: {
				tags: ['delivery.packing-list-entry'],
				summary: 'Get a packing list entry by packing_list_uuid',
				description: 'Get a packing list entry by packing_list_uuid',
				// operationId: "getPackingListEntryByPackingListUuid",
				produces: ['application/json'],
				parameters: [
					SE.parameter_params(
						'packing_list_uuids',
						'packing_list_uuids'
					),
				],
				responses: {
					200: {
						description: 'Return packing list entry',
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

// * Delivery Challan * //

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
									challan_number: {
										type: 'string',
										example: 'ZC24-0001',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'John Doe',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'John Doe',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'John Doe',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_address: {
										type: 'string',
										example: 'Dhaka, Bangladesh',
									},
									factory_name: {
										type: 'string',
										example: 'John Doe',
									},
									vehicle_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									vehicle_name: {
										type: 'string',
										example: 'DHK-1234',
									},
									vehicle_driver_name: {
										type: 'string',
										example: 'John Doe',
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
									gate_pass: {
										type: 'string',
										example: '123456',
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
	'/delivery/challan/details/{challan_uuid}': {
		get: {
			tags: ['delivery.challan'],
			summary: 'Get a challan details by challan_uuid',
			description: 'Get a challan details by challan_uuid',
			// operationId: "getChallanDetailsByChallanUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'challan_uuid',
					in: 'path',
					description: ' challan to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Return challan details',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									challan_number: {
										type: 'string',
										example: 'ZC24-0001',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'John Doe',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'John Doe',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'John Doe',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_address: {
										type: 'string',
										example: 'Dhaka, Bangladesh',
									},
									factory_name: {
										type: 'string',
										example: 'John Doe',
									},
									vehicle_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									vehicle_name: {
										type: 'string',
										example: 'DHK-1234',
									},
									vehicle_driver_name: {
										type: 'string',
										example: 'John Doe',
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
									gate_pass: {
										type: 'string',
										example: '123456',
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
									challan_entry: {
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

// * Delivery ChallanEntry * //
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
	'/delivery/challan-entry/by/{challan_uuid}': {
		get: {
			tags: ['delivery.challan-entry'],
			summary: 'Get a challan entry by challan_uuid',
			description: 'Get a challan entry by challan_uuid',
			// operationId: "getChallanEntryByChallanUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'challan_uuid',
					in: 'path',
					description: ' challan to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Return challan entry',
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Challan entry not found',
				},
			},
		},
	},
	'/delivery/remove-challan-entry-by/{packing_list_uuid}': {
		delete: {
			tags: ['delivery.challan-entry'],
			summary: 'Remove a challan entry by packing_list_uuid',
			description: 'Remove a challan entry by packing_list_uuid',
			// operationId: "removeChallanEntryByPackingListUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'packing_list_uuid',
					in: 'path',
					description: ' packing list to remove',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
			},
		},
	},
};

export const pathDeliveryVehicle = {
	'/delivery/vehicle': {
		get: {
			tags: ['delivery.vehicle'],
			summary: 'Get all vehicles',
			description: 'Get all vehicles',
			// operationId: "getVehicle",
			responses: {
				200: {
					description: 'Return list of vehicles',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									type: {
										type: 'string',
										example: 'Truck',
									},
									number: {
										type: 'string',
										example: 'KA-01-AB-1234',
									},
									driver_name: {
										type: 'string',
										example: 'John Doe',
									},
									active: {
										type: 'number',
										example: 1,
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
			tags: ['delivery.vehicle'],
			summary: 'Create a new vehicle',
			description: 'Create a new vehicle',
			// operationId: "createVehicle",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/delivery/vehicle',
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
							$ref: '#/definitions/delivery/vehicle',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/delivery/vehicle/{uuid}': {
		get: {
			tags: ['delivery.vehicle'],
			summary: 'Get a vehicle by uuid',
			description: 'Get a vehicle by uuid',
			// operationId: "getVehicleByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' vehicle to get',
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
					description: 'Vehicle not found',
				},
			},
		},
		put: {
			tags: ['delivery.vehicle'],
			summary: 'Update a vehicle by uuid',
			description: 'Update a vehicle by uuid',
			// operationId: "updateVehicleByUuid",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' vehicle to update',
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
							$ref: '#/definitions/delivery/vehicle',
						},
					},
				},
			},

			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Vehicle not found',
				},
				405: { description: 'Validation exception' },
			},
		},
		delete: {
			tags: ['delivery.vehicle'],
			summary: 'Delete a vehicle by uuid',
			description: 'Delete a vehicle by uuid',
			// operationId: "deleteVehicleByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'vehicle to delete',
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
					description: 'Vehicle not found',
				},
			},
		},
	},
};

export const pathDeliveryCarton = {
	'/delivery/carton': {
		get: {
			tags: ['delivery.carton'],
			summary: 'Get all cartons',
			description: 'Get all cartons',
			// operationId: "getCarton",
			responses: {
				200: {
					description: 'Return list of cartons',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									size: {
										type: 'string',
										example: 'Small',
									},
									name: {
										type: 'string',
										example: 'Carton 1',
									},
									used_for: {
										type: 'string',
										example: 'Packing',
									},
									active: {
										type: 'number',
										example: 1,
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
			tags: ['delivery.carton'],
			summary: 'Create a new carton',
			description: 'Create a new carton',
			// operationId: "createCarton",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/delivery/carton',
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
							$ref: '#/definitions/delivery/carton',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/delivery/carton/{uuid}': {
		get: {
			tags: ['delivery.carton'],
			summary: 'Get a carton by uuid',
			description: 'Get a carton by uuid',
			// operationId: "getCartonByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' carton to get',
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
					description: 'Carton not found',
				},
			},
		},
		put: {
			tags: ['delivery.carton'],
			summary: 'Update a carton by uuid',
			description: 'Update a carton by uuid',
			// operationId: "updateCartonByUuid",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' carton to update',
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
							$ref: '#/definitions/delivery/carton',
						},
					},
				},
			},

			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Carton not found',
				},
				405: { description: 'Validation exception' },
			},
		},
		delete: {
			tags: ['delivery.carton'],
			summary: 'Delete a carton by uuid',
			description: 'Delete a carton by uuid',
			// operationId: "deleteCartonByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'carton to delete',
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
					description: 'Carton not found',
				},
			},
		},
	},
};

export const pathDelivery = {
	...pathDeliveryPackingList,
	...pathDeliveryPackingListEntry,
	...pathDeliveryChallan,
	...pathDeliveryChallanEntry,
	...pathDeliveryVehicle,
	...pathDeliveryCarton,
	
};
