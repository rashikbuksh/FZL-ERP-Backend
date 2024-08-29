// * Thread Machine * //
import SE from '../../../util/swagger_example.js';

export const pathThreadMachine = {
	'/thread/machine': {
		get: {
			tags: ['thread.machine'],
			summary: 'Get all Thread Machine',
			description: 'Get all Thread Machine',
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
										example: 'Machine Name',
									},
									capacity: {
										type: 'number',
										example: 10.0,
									},
									water_capacity: {
										type: 'number',
										example: 10.0,
									},
									leveling_agent_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									leveling_agent_quantity: {
										type: 'number',
										example: 10.0,
									},
									buffering_agent_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buffering_agent_quantity: {
										type: 'number',
										example: 10.0,
									},
									sequestering_agent_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									sequestering_agent_quantity: {
										type: 'number',
										example: 10.0,
									},
									caustic_soad_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									caustic_soad_quantity: {
										type: 'number',
										example: 10.0,
									},
									hydros_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									hydros_quantity: {
										type: 'number',
										example: 10.0,
									},
									neotrolizer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									neotrolizer_quantity: {
										type: 'number',
										example: 10.0,
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
			tags: ['thread.machine'],
			summary: 'Create Thread Machine',
			description: 'Create Thread Machine',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/machine',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
	},
	'/thread/machine/{uuid}': {
		get: {
			tags: ['thread.machine'],
			summary: 'Get Thread Machine',
			description: 'Get Thread Machine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
						example: 'igD0v9DIJQhJeet',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							properties: {
								uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								name: {
									type: 'string',
									example: 'Machine Name',
								},
								capacity: {
									type: 'number',
									example: 10.0,
								},
								water_capacity: {
									type: 'number',
									example: 10.0,
								},
								leveling_agent_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								leveling_agent_quantity: {
									type: 'number',
									example: 10.0,
								},
								buffering_agent_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								buffering_agent_quantity: {
									type: 'number',
									example: 10.0,
								},
								sequestering_agent_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								sequestering_agent_quantity: {
									type: 'number',
									example: 10.0,
								},
								caustic_soad_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								caustic_soad_quantity: {
									type: 'number',
									example: 10.0,
								},
								hydros_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								hydros_quantity: {
									type: 'number',
									example: 10.0,
								},
								neotrolizer_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								neotrolizer_quantity: {
									type: 'number',
									example: 10.0,
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
		put: {
			tags: ['thread.machine'],
			summary: 'Update Thread Machine',
			description: 'Update Thread Machine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/machine',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
		delete: {
			tags: ['thread.machine'],
			summary: 'Delete Thread Machine',
			description: 'Delete Thread Machine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Count Length * //

export const pathThreadCountLength = {
	'/thread/count-length': {
		get: {
			tags: ['thread.count_length'],
			summary: 'Get all Thread Count Length',
			description: 'Get all Thread Count Length',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/count_length',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.count_length'],
			summary: 'Create Thread Count Length',
			description: 'Create Thread Count Length',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/count_length',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/count_length',
							},
						},
					},
				},
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/thread/count-length/{uuid}': {
		get: {
			tags: ['thread.count_length'],
			summary: 'Get Thread Count Length',
			description: 'Get Thread Count Length',
			parameters: [SE.parameter_uuid('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					count: SE.string(),
					length: SE.string(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['thread.count_length'],
			summary: 'Update Thread Count Length',
			description: 'Update Thread Count Length',
			parameters: [SE.parameter_uuid('uuid', 'uuid')],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/count_length',
						},
					},
				},
			},
			responses: {
				201: SE.response_schema_ref(201, 'thread/count_length'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},

		delete: {
			tags: ['thread.count_length'],
			summary: 'Delete Thread Count Length',
			description: 'Delete Thread Count Length',
			parameters: [SE.parameter_uuid('uuid', 'uuid')],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/count_length',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Order Info * //

export const pathThreadOrderInfo = {
	'/thread/order-info': {
		get: {
			tags: ['thread.order_info'],
			summary: 'Get all Thread Order Info',
			description: 'Get all Thread Order Info',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/order_info',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.order_info'],
			summary: 'Create Thread Order Info',
			description: 'Create Thread Order Info',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order_info',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-info/{uuid}': {
		get: {
			tags: ['thread.order_info'],
			summary: 'Get Thread Order Info',
			description: 'Get Thread Order Info',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.order_info'],
			summary: 'Update Thread Order Info',
			description: 'Update Thread Order Info',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order_info',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.order_info'],
			summary: 'Delete Thread Order Info',
			description: 'Delete Thread Order Info',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-info-details/by/{order_info_uuid}': {
		get: {
			tags: ['thread.order_info'],
			summary: 'Get Thread Order Info Details by Order Info UUID',
			description: 'Get Thread Order Info Details by Order Info UUID',
			parameters: [
				SE.parameter_uuid('order_info_uuid', 'order_info_uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					party_uuid: SE.uuid(),
					party_name: SE.string(),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('John Doe'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('John Doe'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('John Doe'),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('John Doe'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
					order_entry: {
						uuid: SE.uuid(),
						order_info_uuid: SE.uuid(),
						lab_reference: SE.string(),
						color: SE.string(),
						shade_recipe_uuid: SE.uuid(),
						shade_recipe_name: SE.string(),
						po: SE.string(),
						style: SE.string(),
						count_length_uuid: SE.uuid(),
						count: SE.string(),
						length: SE.string(),
						count_length_name: SE.string(),
						quantity: SE.integer(),
						company_price: SE.number(),
						party_price: SE.number(),
						swatch_approval_date: SE.date_time(),
						production_quantity: SE.integer(),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
					},
				}),
			},
		},
	},
	'/thread/order-swatch': {
		get: {
			tags: ['thread.order_info'],
			summary: 'Get Thread Order Swatch',
			description: 'Get Thread Order Swatch',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.integer(),
					order_number: SE.string(),
					style: SE.string(),
					color: SE.string(),
					shade_recipe_uuid: SE.uuid(),
					shade_recipe_name: SE.string(),
					po: SE.string(),
					count_length_uuid: SE.uuid(),
					count: SE.integer(),
					length: SE.integer(),
					count_length_name: SE.string(),
					order_quantity: SE.integer(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},
	},
};

// * Thread Order Entry * //

export const pathThreadOrderEntry = {
	'/thread/order-entry': {
		get: {
			tags: ['thread.order_entry'],
			summary: 'Get all Thread Order Entry',
			description: 'Get all Thread Order Entry',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/order_entry',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['thread.order_entry'],
			summary: 'Create Thread Order Entry',
			description: 'Create Thread Order Entry',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order_entry',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-entry/{uuid}': {
		get: {
			tags: ['thread.order_entry'],
			summary: 'Get Thread Order Entry',
			description: 'Get Thread Order Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.order_entry'],
			summary: 'Update Thread Order Entry',
			description: 'Update Thread Order Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order_entry',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.order_entry'],
			summary: 'Delete Thread Order Entry',
			description: 'Delete Thread Order Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-entry/by/{order_info_uuid}': {
		get: {
			tags: ['thread.order_entry'],
			summary: 'Get Thread Order Entry by Order Info UUID',
			description: 'Get Thread Order Entry by Order Info UUID',
			parameters: [
				SE.parameter_uuid('order_info_uuid', 'order_info_uuid'),
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/order_entry',
								},
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Batch Entry * //

export const pathThreadBatchEntry = {
	'/thread/batch-entry': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get all Thread Batch Entry',
			description: 'Get all Thread Batch Entry',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/batch_entry',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.batch_entry'],
			summary: 'Create Thread Batch Entry',
			description: 'Create Thread Batch Entry',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch_entry',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/batch-entry/{uuid}': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get Thread Batch Entry',
			description: 'Get Thread Batch Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.batch_entry'],
			summary: 'Update Thread Batch Entry',
			description: 'Update Thread Batch Entry',
			parameters: [SE.parameter_uuid('uuid', 'uuid')],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch_entry',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.batch_entry'],
			summary: 'Delete Thread Batch Entry',
			description: 'Delete Thread Batch Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-batch': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get Order Details for Batch Entry',
			description: 'Get Order Details for Batch Entry',
			produces: ['application/json'],
			responses: {
				200: SE.response_schema(200, {
					order_entry_uuid: SE.uuid(),
					order_number: SE.string(),
					style: SE.string(),
					color: SE.string(),
					shade_recipe_uuid: SE.uuid(),
					shade_recipe_name: SE.string(),
					po: SE.string(),
					count_length_uuid: SE.uuid(),
					count: SE.integer(),
					length: SE.integer(),
					count_length_name: SE.string(),
					order_quantity: SE.integer(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/thread/batch-entry/by/{batch_uuid}': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get Thread Batch Entry by Batch UUID',
			description: 'Get Thread Batch Entry by Batch UUID',
			parameters: [
				SE.parameter_uuid(
					'batch_uuid',
					'batch_uuid',
					'uuid',
					'6fm2IOdfSc5p3nJ'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					color: SE.string('black'),
					po: SE.string('po 1'),
					style: SE.string('style 1'),
					count_length_uuid: SE.uuid(),
					count_length: SE.string('40/2'),
					order_quantity: SE.number(10),
					quantity: SE.integer(10),

					coning_production_quantity: SE.integer(10),
					coning_production_quantity_in_kg: SE.integer(10),
					order_number: SE.string('TH24-0001'),
					total_quantity: SE.integer(10),
					balance_quantity: SE.integer(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},
	},
};

// * Thread Batch * //

export const pathThreadBatch = {
	'/thread/batch': {
		get: {
			tags: ['thread.batch'],
			summary: 'Get all Thread Batch',
			description: 'Get all Thread Batch',
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
									id: {
										type: 'number',
										example: 0,
									},
									machine_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									machine_name: {
										type: 'string',
										example: 'Machine Name',
									},
									lab_created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lab_created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									lab_created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									lab_updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									dyeing_operator: {
										type: 'string',
										example: 'Dyeing Operator',
									},
									reason: {
										type: 'string',
										example: 'Reason',
									},
									category: {
										type: 'string',
										example: 'Category',
									},
									status: {
										type: 'string',
										example: 'Status',
									},
									pass_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									pass_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									shift: {
										type: 'string',
										example: 'Shift',
									},
									dyeing_supervisor: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									dyeing_supervisor_name: {
										type: 'string',
										example: 'John Doe',
									},
									dyeing_created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									dyeing_created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									yarn_quantity: {
										type: 'number',
										example: 10.0,
									},
									yarn_issue_created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									yarn_issue_created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									yarn_issue_created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									yarn_issue_updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									is_drying_complete: {
										type: 'string',
										example: 'Dyeing Complete',
									},
									drying_created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									drying_updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									coning_operator: {
										type: 'string',
										example: 'Coning Operator',
									},
									coning_supervisor: {
										type: 'string',
										example: 'Coning Supervisor',
									},
									coning_machines: {
										type: 'string',
										example: 'Coning Machines',
									},
									coning_created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coning_created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									coning_created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									coning_updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
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
			tags: ['thread.batch'],
			summary: 'Create Thread Batch',
			description: 'Create Thread Batch',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},
	},
	'/thread/batch/{uuid}': {
		get: {
			tags: ['thread.batch'],
			summary: 'Get Thread Batch',
			description: 'Get Thread Batch',
			parameters: [SE.parameter_uuid('uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'thread/batch'),
			},
		},
		put: {
			tags: ['thread.batch'],
			summary: 'Update Thread Batch',
			description: 'Update Thread Batch',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.batch'],
			summary: 'Delete Thread Batch',
			description: 'Delete Thread Batch',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},
	},
	'/thread/batch-details/by/{batch_uuid}': {
		get: {
			tags: ['thread.batch'],
			summary: 'Get Batch Details by Batch UUID',
			description: 'Get Batch Details by Batch UUID',
			parameters: [SE.parameter_uuid('batch_uuid', 'batch_uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.integer(),
					batch_id: SE.string('TB24-0001'),
					dyeing_operator: SE.string(),
					reason: SE.string(),
					category: SE.string(),
					status: SE.string(),
					pass_by: SE.string(),
					shift: SE.string(),
					yarn_quantity: SE.integer(10),
					dyeing_supervisor: SE.string(),
					is_dyeing_complete: SE.integer(),
					coning_operator: SE.string(),
					coning_supervisor: SE.string(),
					coning_machines: SE.string(),
					created_by: SE.uuid(),
					created_by_name: SE.string(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
					batch_entry: SE.sub_response_schema({
						uuid: SE.uuid(),
						batch_uuid: SE.uuid(),
						order_entry_uuid: SE.uuid(),
						color: SE.string('black'),
						po: SE.string('po 1'),
						style: SE.string('style 1'),
						count_length_uuid: SE.uuid(),
						count_length: SE.string('40/2'),
						order_quantity: SE.number(10),
						quantity: SE.integer(10),

						coning_production_quantity: SE.integer(10),
						coning_production_quantity_in_kg: SE.integer(10),
						order_number: SE.string('TH24-0001'),
						total_quantity: SE.integer(10),
						balance_quantity: SE.integer(10),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						remarks: SE.string(),
					}),
				}),
			},
		},
	},
};

export const pathThreadDyesCategory = {
	'/thread/dyes-category': {
		get: {
			tags: ['thread.dyes_category'],
			summary: 'Get all Thread Dyes Category',
			description: 'Get all Thread Dyes Category',
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
										example: 'Dyes Category Name',
									},
									upto_percentage: {
										type: 'number',
										example: 10.0,
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
			tags: ['thread.dyes_category'],
			summary: 'Create Thread Dyes Category',
			description: 'Create Thread Dyes Category',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/dyes_category',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/dyes_category',
							},
						},
					},
				},
			},
		},
	},
	'/thread/dyes-category/{uuid}': {
		get: {
			tags: ['thread.dyes_category'],
			summary: 'Get Thread Dyes Category',
			description: 'Get Thread Dyes Category',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string(),
					upto_percentage: SE.number('10.0'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},
		put: {
			tags: ['thread.dyes_category'],
			summary: 'Update Thread Dyes Category',
			description: 'Update Thread Dyes Category',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/dyes_category',
						},
					},
				},
			},

			responses: {
				201: SE.response_schema_ref(201, 'thread/dyes_category'),
			},
		},

		delete: {
			tags: ['thread.dyes_category'],
			summary: 'Delete Thread Dyes Category',
			description: 'Delete Thread Dyes Category',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: SE.response_schema_ref(201, 'thread/dyes_category'),
			},
		},
	},
};

export const pathThreadPrograms = {
	'/thread/programs': {
		get: {
			tags: ['thread.programs'],
			summary: 'Get all Thread Programs',
			description: 'Get all Thread Programs',
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
									dyes_category_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									dyes_category_name: {
										type: 'string',
										example: 'Dyes Category Name',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'Material Name',
									},
									quantity: {
										type: 'number',
										example: 10.0,
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
			tags: ['thread.programs'],
			summary: 'Create Thread Programs',
			description: 'Create Thread Programs',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/programs',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/programs',
							},
						},
					},
				},
			},
		},
	},
	'/thread/programs/{uuid}': {
		get: {
			tags: ['thread.programs'],
			summary: 'Get Thread Programs',
			description: 'Get Thread Programs',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					dyes_category_uuid: SE.uuid(),
					dyes_category_name: SE.string('Dyes Category Name'),
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					quantity: SE.number(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},

		put: {
			tags: ['thread.programs'],
			summary: 'Update Thread Programs',
			description: 'Update Thread Programs',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/programs',
						},
					},
				},
			},

			responses: {
				201: SE.response_schema_ref(201, 'thread/programs'),
			},
		},

		delete: {
			tags: ['thread.programs'],
			summary: 'Delete Thread Programs',
			description: 'Delete Thread Programs',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: SE.response_schema_ref(201, 'thread/programs'),
			},
		},
	},
};

// * Thread * //

export const pathThread = {
	...pathThreadMachine,
	...pathThreadCountLength,
	...pathThreadOrderInfo,
	...pathThreadOrderEntry,
	...pathThreadBatchEntry,
	...pathThreadBatch,
	...pathThreadDyesCategory,
	...pathThreadPrograms,
};
