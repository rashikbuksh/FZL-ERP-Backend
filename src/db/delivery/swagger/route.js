// * Delivery PackingList * //

import SE from '../../../util/swagger_example.js';

export const pathDeliveryPackingList = {
	'/delivery/packing-list': {
		get: {
			tags: ['delivery.packing-list'],
			summary: 'Get all packing lists',
			description: 'Get all packing lists',
			// operationId: "getPackingList",
			parameters: [
				SE.parameter_query('challan_uuid', 'challan_uuid'),
				SE.parameter_query('can_show', 'can_show'),
			],
			responses: {
				200: {
					description: 'Return list of packing lists',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									carton_size: {
										type: 'string',
										example: '10x10x10',
									},
									carton_weight: {
										type: 'string',
										example: '10kg',
									},
									carton_uuid: SE.uuid(),
									carton_name: {
										type: 'string',
										example: 'Carton 1',
									},
									created_by: SE.uuid(),
									created_at: SE.date_time(),
									created_by_name: SE.string('merc'),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
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
									uuid: SE.uuid(),
									carton_size: {
										type: 'string',
										example: '10x10x10',
									},
									carton_weight: {
										type: 'string',
										example: '10kg',
									},
									created_by: SE.uuid(),
									created_at: SE.date_time(),
									created_by_name: SE.string('merc'),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									packing_list_entry: {
										type: 'object',
										properties: {
											uuid: SE.uuid(),
											packing_list_uuid: SE.uuid(),
											sfg_uuid: SE.uuid(),
											quantity: {
												type: 'number',
												example: 100,
											},
											created_at: SE.date_time(),
											updated_at: SE.date_time(),
											remarks: SE.string('remarks'),
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
			produces: ['application/json'],
			parameters: [
				{
					name: 'order_info_uuid',
					in: 'path',
					description: ' order_info_uuid to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
				SE.parameter_query('item_for', 'item_for', [
					'zipper',
					'thread',
					'sample_zipper',
					'sample_thread',
				]),
			],
			responses: {
				200: {
					description: 'Return list of orders for packing list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_info_uuid: SE.uuid(),
									order_number: SE.string('Z24-0001'),
									item_description: {
										type: 'string',
										example: 'NP-3-AL-SP',
									},
									order_description_uuid: SE.uuid(),
									style_color_size: {
										type: 'string',
										example: 'Style -1 / Black / 20',
									},
									order_quantity: SE.number(0),
									sfg_uuid: SE.uuid(),
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
	'/delivery/update-challan-uuid/for-packing-list/{uuid}': {
		put: {
			tags: ['delivery.packing-list'],
			summary: 'Update challan_uuid for packing list',
			description: 'Update challan_uuid for packing list',
			// operationId: "updateChallanUuidForPackingList",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody('challan_uuid', 'challan_uuid'),
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
									uuid: SE.uuid(),
									packing_list_uuid: SE.uuid(),
									sfg_uuid: SE.uuid(),
									quantity: SE.number(0),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
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
									uuid: SE.uuid(),
									packing_list_uuid: SE.uuid(),
									sfg_uuid: SE.uuid(),
									quantity: SE.number(0),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
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
	'/delivery/packing-list-entry-for-challan/{challan_uuid}': {
		get: {
			tags: ['delivery.packing-list-entry'],
			summary: 'Get a packing list entry by challan_uuid',
			description: 'Get a packing list entry by challan_uuid',
			// operationId: "getPackingListEntryByPackingListUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'challan_uuid',
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
									uuid: SE.uuid(),
									packing_list_uuid: SE.uuid(),
									sfg_uuid: SE.uuid(),
									quantity: SE.number(0),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
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
			parameters: [
				SE.parameter_query('delivery_date', 'delivery_date'),
				SE.parameter_query('vehicle', 'vehicle'),
			],
			responses: {
				200: {
					description: 'Return list of challans',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									challan_number: SE.string('Z24-0001'),
									order_info_uuid: SE.uuid(),
									order_number: SE.string('Z24-0001'),
									buyer_uuid: SE.uuid(),
									buyer_name: SE.string('merc'),
									party_uuid: SE.uuid(),
									party_name: SE.string('merc'),
									merchandiser_uuid: SE.uuid(),
									merchandiser_name: SE.string('merc'),
									factory_uuid: SE.uuid(),
									factory_address: SE.string('address'),
									factory_name: SE.string('name'),
									vehicle_uuid: SE.uuid(),
									vehicle_name: SE.string('name'),
									vehicle_driver_name: SE.string('name'),
									carton_quantity: SE.number(100),
									assign_to: SE.uuid(),
									assign_to_name: SE.string('name'),
									receive_status: SE.number(0),
									gate_pass: SE.number(0),
									is_own: SE.boolean(false),
									name: SE.string('name'),
									delivery_cost: SE.number(0),
									is_hand_delivery: SE.boolean(false),
									created_by: SE.uuid(),
									created_by_name: SE.string('merc'),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									delivery_date: SE.date_time(),
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
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
			parameters: [SE.parameter_params('challan_uuid', 'challan_uuid')],
			responses: {
				200: {
					description: 'Return challan details',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									challan_number: SE.string('Z24-0001'),
									order_info_uuid: SE.uuid(),
									order_number: SE.string('Z24-0001'),
									buyer_uuid: SE.uuid(),
									buyer_name: SE.string('merc'),
									party_uuid: SE.uuid(),
									party_name: SE.string('merc'),
									merchandiser_uuid: SE.uuid(),
									merchandiser_name: SE.string('merc'),
									factory_uuid: SE.uuid(),
									factory_address: SE.string('address'),
									factory_name: SE.string('merc'),
									vehicle_uuid: SE.uuid(),
									vehicle_name: SE.string('DHK-1234'),
									vehicle_driver_name: SE.string('merc'),
									carton_quantity: SE.number(0),
									assign_to: SE.uuid(),
									assign_to_name: SE.string('merc'),
									receive_status: SE.number(0),
									gate_pass: SE.number(0),
									is_own: SE.boolean(false),
									name: SE.string('merc'),
									delivery_cost: SE.number(0),
									is_hand_delivery: SE.boolean(false),
									created_by: SE.uuid(),
									created_by_name: SE.string('merc'),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									delivery_date: SE.date_time(),
									delivery_type: SE.string('delivery_type'),
									challan_entry: {
										type: 'object',
										properties: {
											uuid: SE.uuid(),
											challan_uuid: SE.uuid(),
											challan_assign_to: SE.uuid(),
											challan_assign_to_name:
												SE.string('merc'),
											challan_created_by: SE.uuid(),
											challan_created_by_name:
												SE.string('merc'),
											packing_list_uuid: SE.uuid(),
											delivery_quantity: SE.number(100),
											created_at: SE.date_time(),
											updated_at: SE.date_time(),
											remarks: SE.string('remarks'),
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
	'/delivery/challan/update-receive-status/{uuid}': {
		put: {
			tags: ['delivery.challan'],
			summary: 'Update receive status for challan',
			description: 'Update receive status for challan',
			// operationId: "updateReceiveStatusForChallan",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody('receive_status', 'receive_status'),
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
	},
	'/delivery/challan/update-delivered/{uuid}': {
		put: {
			tags: ['delivery.challan'],
			summary: 'Update delivered for challan',
			description: 'Update delivered for challan',
			// operationId: "updateDeliveredForChallan",
			consumes: 'application/json',
			produces: 'application/json',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody('is_delivered', 'is_delivered'),
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
									uuid: SE.uuid(),
									type: {
										type: 'string',
										example: 'Truck',
									},
									number: {
										type: 'string',
										example: 'KA-01-AB-1234',
									},
									driver_name: SE.string('merc'),
									active: {
										type: 'number',
										example: 1,
									},
									created_by: SE.uuid(),
									created_by_name: SE.string('merc'),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
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
	'/delivery/dashboard': {
		get: {
			tags: ['delivery.vehicle'],
			summary: 'Get delivery summary',
			description: 'Get delivery summary',
			parameters: [],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									challan_number: SE.string('Challan 1'),
									packing_list_number: SE.string('Packing 1'),
									order_number: SE.string('Order 1'),
									item_description: SE.string('Item 1'),
									style: SE.string('Style 1'),
									size: SE.string('Size 1'),
									packing_list_quantity: SE.number(1000),
									status: SE.string('In Warehouse'),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/delivery/dashboard-thread': {
		get: {
			tags: ['delivery.vehicle'],
			summary: 'Get delivery summary thread',
			description: 'Get delivery summary thread',
			parameters: [],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									challan_number: SE.string('Challan 1'),
									order_number: SE.string('Order 1'),
									count_length: SE.number(1000),
									style: SE.string('Style 1'),
									color: SE.string('Color 1'),
									challan_quantity: SE.number(1000),
									status: SE.string('In Warehouse'),
								},
							},
						},
					},
				},
				500: SE.response(500),
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
									uuid: SE.uuid(),
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
									created_by: SE.uuid(),
									created_by_name: SE.string('merc'),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
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
	// ...pathDeliveryChallanEntry,
	...pathDeliveryVehicle,
	...pathDeliveryCarton,
};
