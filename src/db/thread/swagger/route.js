// * Thread Machine * //
import SE from '../../../util/swagger_example.js';

// * Thread Count Length * //

export const pathThreadCountLength = {
	'/thread/count-length': {
		get: {
			tags: ['thread.count_length'],
			summary: 'Get all Thread Count Length',
			description: 'Get all Thread Count Length',
			responses: {
				200: SE.response_schema_ref(200, 'thread/count_length'),
			},
		},
		post: {
			tags: ['thread.count_length'],
			summary: 'Create Thread Count Length',
			description: 'Create Thread Count Length',
			requestBody: SE.requestBody_schema_ref('thread/count_length'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/count_length'),
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'thread/count_length'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['thread.count_length'],
			summary: 'Update Thread Count Length',
			description: 'Update Thread Count Length',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/count_length'),
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				201: SE.response_schema_ref(201, 'thread/count_length'),
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
			parameters: [
				SE.parameter_query('own_uuid', 'own_uuid'),
				SE.parameter_query('type', 'type', ['sample', 'bulk', 'all']),
			],
			responses: {
				200: SE.response_schema_ref(200, 'thread/order_info'),
			},
		},

		post: {
			tags: ['thread.order_info'],
			summary: 'Create Thread Order Info',
			description: 'Create Thread Order Info',
			requestBody: SE.requestBody_schema_ref('thread/order_info'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/order_info'),
			},
		},
	},
	'/thread/order-info/{uuid}': {
		get: {
			tags: ['thread.order_info'],
			summary: 'Get Thread Order Info',
			description: 'Get Thread Order Info',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'thread/order_info'),
			},
		},
		put: {
			tags: ['thread.order_info'],
			summary: 'Update Thread Order Info',
			description: 'Update Thread Order Info',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			requestBody: SE.requestBody_schema_ref('thread/order_info'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/order_info'),
			},
		},
		delete: {
			tags: ['thread.order_info'],
			summary: 'Delete Thread Order Info',
			description: 'Delete Thread Order Info',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				201: SE.response(201),
			},
		},
	},
	'/thread/order-info-details/by/{order_info_uuid}': {
		get: {
			tags: ['thread.order_info'],
			summary: 'Get Thread Order Info Details by Order Info UUID',
			description: 'Get Thread Order Info Details by Order Info UUID',
			parameters: [
				SE.parameter_params('order_info_uuid', 'order_info_uuid'),
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
						recipe_uuid: SE.uuid(),
						recipe_name: SE.string(),
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
						bleaching: SE.string('bleaching'),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						index: SE.integer(),
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
			parameters: [
				SE.parameter_query('type', 'type', [
					'pending',
					'completed',
					'all',
				]),
			],

			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.integer(),
					order_number: SE.string(),
					style: SE.string(),
					color: SE.string(),
					recipe_uuid: SE.uuid(),
					recipe_name: SE.string(),
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
				200: SE.response_schema_ref(200, 'thread/order_entry'),
			},
		},
		post: {
			tags: ['thread.order_entry'],
			summary: 'Create Thread Order Entry',
			description: 'Create Thread Order Entry',
			requestBody: SE.requestBody_schema_ref('thread/order_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/order_entry'),
			},
		},
	},
	'/thread/order-entry/{uuid}': {
		get: {
			tags: ['thread.order_entry'],
			summary: 'Get Thread Order Entry',
			description: 'Get Thread Order Entry',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'thread/order_entry'),
			},
		},
		put: {
			tags: ['thread.order_entry'],
			summary: 'Update Thread Order Entry',
			description: 'Update Thread Order Entry',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			requestBody: SE.requestBody_schema_ref('thread/order_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/order_entry'),
			},
		},
		delete: {
			tags: ['thread.order_entry'],
			summary: 'Delete Thread Order Entry',
			description: 'Delete Thread Order Entry',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				200: SE.response(200),
			},
		},
	},
	'/thread/order-entry/by/{order_info_uuid}': {
		get: {
			tags: ['thread.order_entry'],
			summary: 'Get Thread Order Entry by Order Info UUID',
			description: 'Get Thread Order Entry by Order Info UUID',
			parameters: [
				SE.parameter_params('order_info_uuid', 'order_info_uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					lab_reference: SE.string('Lab Reference'),
					color: SE.string('black'),
					recipe_uuid: SE.uuid(),
					recipe_name: SE.string('Shade Recipe Name'),
					po: SE.string('po 1'),
					style: SE.string('style 1'),
					count_length_uuid: SE.uuid(),
					count: SE.string('40'),
					length: SE.string('2'),
					count_length_name: SE.string('40/2'),
					quantity: SE.integer(10),
					company_price: SE.number(10),
					party_price: SE.number(10),
					swatch_approval_date: SE.date_time(),
					production_quantity: SE.integer(10),
					bleaching: SE.string('bleaching'),
					transfer_quantity: SE.integer(10),
					carton_quantity: SE.integer(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					index: SE.integer(10),
				}),
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
				200: SE.response_schema_ref(200, 'thread/batch_entry'),
			},
		},
		post: {
			tags: ['thread.batch_entry'],
			summary: 'Create Thread Batch Entry',
			description: 'Create Thread Batch Entry',
			requestBody: SE.requestBody_schema_ref('thread/batch_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/batch_entry'),
			},
		},
	},
	'/thread/batch-entry/{uuid}': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get Thread Batch Entry',
			description: 'Get Thread Batch Entry',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'thread/batch_entry'),
			},
		},
		put: {
			tags: ['thread.batch_entry'],
			summary: 'Update Thread Batch Entry',
			description: 'Update Thread Batch Entry',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/batch_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/batch_entry'),
			},
		},
		delete: {
			tags: ['thread.batch_entry'],
			summary: 'Delete Thread Batch Entry',
			description: 'Delete Thread Batch Entry',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				200: SE.response(200),
			},
		},
	},
	'/thread/order-batch': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get Order Details for Batch Entry',
			description: 'Get Order Details for Batch Entry',
			produces: ['application/json'],
			parameters: [
				SE.parameter_query('batch_type', 'batch_type', [
					'normal',
					'extra',
				]),
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					'uuid',
					'6fm2IOdfSc5p3nJ'
				),
				SE.parameter_query('type', 'type', ['sample ', 'bulk', 'all']),
			],
			responses: {
				200: SE.response_schema(200, {
					order_entry_uuid: SE.uuid(),
					order_number: SE.string(),
					style: SE.string(),
					color: SE.string(),
					recipe_uuid: SE.uuid(),
					recipe_name: SE.string(),
					po: SE.string(),
					count_length_uuid: SE.uuid(),
					count: SE.integer(),
					length: SE.integer(),
					min_weight: SE.number(),
					count_length_name: SE.string(),
					order_quantity: SE.integer(),
					transfer_quantity: SE.integer(10),
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
				SE.parameter_params(
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
					coning_carton_quantity: SE.integer(10),
					order_number: SE.string('TH24-0001'),
					total_quantity: SE.integer(10),
					balance_quantity: SE.integer(10),
					transfer_quantity: SE.integer(10),
					transfer_carton_quantity: SE.integer(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
					yarn_quantity: SE.integer(10),
				}),
			},
		},
	},
	'/thread/batch-entry-details': {
		get: {
			tags: ['thread.batch_entry'],
			summary: 'Get Batch Entry Details',
			description: 'Get Batch Entry Details',
			produces: ['application/json'],
			responses: {
				200: SE.response_schema(200, {
					batch_entry_uuid: SE.uuid(),
					batch_uuid: SE.uuid(),
					batch_number: SE.string('TB24-0001'),
					order_entry_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('TO24-0001'),
					color: SE.string('black'),
					po: SE.string('po 1'),
					style: SE.string('style 1'),
					bleaching: SE.string('bleaching'),
					count_length_uuid: SE.uuid(),
					count_length: SE.string('40/2'),
					batch_quantity: SE.number(10),
					quantity: SE.integer(10),
					coning_production_quantity: SE.integer(10),
					coning_carton_quantity: SE.integer(10),
					transfer_quantity: SE.integer(10),
					transfer_carton_quantity: SE.integer(10),
					balance_quantity: SE.integer(10),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					yarn_quantity: SE.integer(10),
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
			parameters: [
				SE.parameter_query('type', 'type', [
					'pending',
					'completed',
					'all',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.number(10),
					machine_uuid: SE.uuid(),
					machine_name: SE.string('Machine Name'),
					slot: SE.number(10),
					lab_created_by: SE.uuid(),
					lab_created_by_name: SE.string('John Doe'),
					lab_created_at: SE.date_time(),
					lab_updated_at: SE.date_time(),
					dyeing_operator: SE.string('Dyeing Operator'),
					reason: SE.string('Reason'),
					category: SE.string('Category'),
					status: SE.string('Status'),
					pass_by: SE.uuid(),
					pass_by_name: SE.string('John Doe'),
					shift: SE.string('Shift'),
					dyeing_supervisor: SE.uuid(),
					dyeing_supervisor_name: SE.string('John Doe'),
					dyeing_created_by: SE.uuid(),
					dyeing_created_by_name: SE.string('John Doe'),
					yarn_quantity: SE.number(10.0),
					yarn_issue_created_by: SE.uuid(),
					yarn_issue_created_by_name: SE.string('John Doe'),
					yarn_issue_created_at: SE.date_time(),
					yarn_issue_updated_at: SE.date_time(),
					is_drying_complete: SE.string(0),
					drying_created_at: SE.date_time(),
					drying_updated_at: SE.date_time(),
					coning_operator: SE.string('Coning Operator'),
					coning_supervisor: SE.string('Coning Supervisor'),
					coning_machines: SE.string('Coning Machines'),
					coning_created_by: SE.uuid(),
					coning_created_by_name: SE.string('John Doe'),
					coning_created_at: SE.date_time(),
					coning_updated_at: SE.date_time(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.batch'],
			summary: 'Create Thread Batch',
			description: 'Create Thread Batch',
			requestBody: SE.requestBody_schema_ref('thread/batch'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/batch'),
			},
		},
	},
	'/thread/batch/{uuid}': {
		get: {
			tags: ['thread.batch'],
			summary: 'Get Thread Batch',
			description: 'Get Thread Batch',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'thread/batch'),
			},
		},
		put: {
			tags: ['thread.batch'],
			summary: 'Update Thread Batch',
			description: 'Update Thread Batch',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			requestBody: SE.requestBody_schema_ref('thread/batch'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/batch'),
			},
		},
		delete: {
			tags: ['thread.batch'],
			summary: 'Delete Thread Batch',
			description: 'Delete Thread Batch',
			parameters: [
				SE.parameter_params('uuid', 'uuid', 'uuid', 'igD0v9DIJQhJeet'),
			],
			responses: {
				201: SE.response(201),
			},
		},
	},
	'/thread/batch-details/by/{batch_uuid}': {
		get: {
			tags: ['thread.batch'],
			summary: 'Get Batch Details by Batch UUID',
			description: 'Get Batch Details by Batch UUID',
			parameters: [
				SE.parameter_params('batch_uuid', 'batch_uuid'),
				SE.parameter_query('is_update', 'is_update', ['true', 'false']),
				SE.parameter_query('type', 'type', ['sample', 'bulk', 'all']),
			],
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
						coning_carton_quantity: SE.integer(10),
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
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('Dyes Category Name'),
					upto_percentage: SE.number(10.0),
					bleaching: SE.string('Bleaching'),
					id: SE.integer(5),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.dyes_category'],
			summary: 'Create Thread Dyes Category',
			description: 'Create Thread Dyes Category',
			requestBody: SE.requestBody_schema_ref('thread/dyes_category'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/dyes_category'),
			},
		},
	},
	'/thread/dyes-category/{uuid}': {
		get: {
			tags: ['thread.dyes_category'],
			summary: 'Get Thread Dyes Category',
			description: 'Get Thread Dyes Category',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string(),
					upto_percentage: SE.number('10.0'),
					bleaching: SE.string('Bleaching'),
					id: SE.integer(5),
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/dyes_category'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/dyes_category'),
			},
		},

		delete: {
			tags: ['thread.dyes_category'],
			summary: 'Delete Thread Dyes Category',
			description: 'Delete Thread Dyes Category',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
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
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					dyes_category_uuid: SE.uuid(),
					dyes_category_name: SE.string('Dyes Category Name'),
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					quantity: SE.number(10.0),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.programs'],
			summary: 'Create Thread Programs',
			description: 'Create Thread Programs',
			requestBody: SE.requestBody_schema_ref('thread/programs'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/programs'),
			},
		},
	},
	'/thread/programs/{uuid}': {
		get: {
			tags: ['thread.programs'],
			summary: 'Get Thread Programs',
			description: 'Get Thread Programs',
			parameters: [SE.parameter_params('uuid', 'uuid')],
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/programs'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/programs'),
			},
		},

		delete: {
			tags: ['thread.programs'],
			summary: 'Delete Thread Programs',
			description: 'Delete Thread Programs',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
			},
		},
	},
};

export const pathThreadBatchEntryProduction = {
	'/thread/batch-entry-production': {
		get: {
			tags: ['thread.batch_entry_production'],
			summary: 'Get all Thread Batch Entry Production',
			description: 'Get all Thread Batch Entry Production',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_entry_uuid: SE.uuid(),
					production_quantity: SE.integer(),
					coning_carton_quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.batch_entry_production'],
			summary: 'Create Thread Batch Entry Production',
			description: 'Create Thread Batch Entry Production',
			requestBody: SE.requestBody_schema_ref(
				'thread/batch_entry_production'
			),
			responses: {
				201: SE.response_schema_ref(
					201,
					'thread/batch_entry_production'
				),
			},
		},
	},

	'/thread/batch-entry-production/{uuid}': {
		get: {
			tags: ['thread.batch_entry_production'],
			summary: 'Get Thread Batch Entry Production',
			description: 'Get Thread Batch Entry Production',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_entry_uuid: SE.uuid(),
					production_quantity: SE.integer(),
					coning_carton_quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		put: {
			tags: ['thread.batch_entry_production'],
			summary: 'Update Thread Batch Entry Production',
			description: 'Update Thread Batch Entry Production',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref(
				'thread/batch_entry_production'
			),
			responses: {
				201: SE.response_schema_ref(
					201,
					'thread/batch_entry_production'
				),
			},
		},

		delete: {
			tags: ['thread.batch_entry_production'],
			summary: 'Delete Thread Batch Entry Production',
			description: 'Delete Thread Batch Entry Production',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
			},
		},
	},
	'/thread/batch-entry-production-details': {
		get: {
			tags: ['thread.batch_entry_production'],
			summary: 'Get Batch Entry Production Details',
			description: 'Get Batch Entry Production Details',
			parameters: [
				SE.parameter_query('from', 'from'),
				SE.parameter_query('to', 'to'),
			],
			produces: ['application/json'],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_entry_uuid: SE.uuid(),
					production_quantity: SE.integer(),
					coning_carton_quantity: SE.integer(),
					batch_uuid: SE.uuid(),
					batch_number: SE.string('TB24-0001'),
					order_entry_uuid: SE.uuid(),
					order_number: SE.string('TO24-0001'),
					order_info_uuid: SE.uuid(),
					color: SE.string('black'),
					po: SE.string('po 1'),
					style: SE.string('style 1'),
					bleaching: SE.string('bleaching'),
					count_length_uuid: SE.uuid(),
					count_length: SE.string('40/2'),
					batch_quantity: SE.number(10),
					quantity: SE.integer(10),
					coning_production_quantity: SE.integer(10),
					coning_carton_quantity: SE.integer(10),
					transfer_quantity: SE.integer(10),
					balance_quantity: SE.integer(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					production_remarks: SE.string('Remarks'),
				}),
			},
		},
	},
};

export const pathThreadBatchEntryTrx = {
	'/thread/batch-entry-trx': {
		get: {
			tags: ['thread.batch_entry_trx'],
			summary: 'Get all Thread Batch Entry Trx',
			description: 'Get all Thread Batch Entry Trx',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_entry_uuid: SE.uuid(),
					quantity: SE.integer(),
					carton_quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.batch_entry_trx'],
			summary: 'Create Thread Batch Entry Trx',
			description: 'Create Thread Batch Entry Trx',
			requestBody: SE.requestBody_schema_ref('thread/batch_entry_trx'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/batch_entry_trx'),
			},
		},
	},

	'/thread/batch-entry-trx/{uuid}': {
		get: {
			tags: ['thread.batch_entry_trx'],
			summary: 'Get Thread Batch Entry Trx',
			description: 'Get Thread Batch Entry Trx',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_entry_uuid: SE.uuid(),
					quantity: SE.integer(),
					carton_quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		put: {
			tags: ['thread.batch_entry_trx'],
			summary: 'Update Thread Batch Entry Trx',
			description: 'Update Thread Batch Entry Trx',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/batch_entry_trx'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/batch_entry_trx'),
			},
		},

		delete: {
			tags: ['thread.batch_entry_trx'],
			summary: 'Delete Thread Batch Entry Trx',
			description: 'Delete Thread Batch Entry Trx',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
			},
		},
	},
	'/thread/batch-entry-trx-details': {
		get: {
			tags: ['thread.batch_entry_trx'],
			summary: 'Get Batch Entry Trx Details',
			description: 'Get Batch Entry Trx Details',
			produces: ['application/json'],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_entry_uuid: SE.uuid(),
					quantity: SE.integer(),
					carton_quantity: SE.integer(),
					batch_uuid: SE.uuid(),
					batch_number: SE.string('TB24-0001'),
					order_entry_uuid: SE.uuid(),
					order_number: SE.string('TO24-0001'),
					color: SE.string('black'),
					po: SE.string('po 1'),
					style: SE.string('style 1'),
					bleaching: SE.string('bleaching'),
					count_length_uuid: SE.uuid(),
					count_length: SE.string('40/2'),
					batch_quantity: SE.number(10),
					quantity: SE.integer(10),
					coning_production_quantity: SE.integer(10),
					coning_carton_quantity: SE.integer(10),
					transfer_quantity: SE.integer(10),
					balance_quantity: SE.integer(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					trx_remarks: SE.string('Remarks'),
				}),
			},
		},
	},
};

export const pathThreadChallan = {
	'/thread/challan': {
		get: {
			tags: ['thread.challan'],
			summary: 'Get all Thread Challan',
			description: 'Get all Thread Challan',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					carton_quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.challan'],
			summary: 'Create Thread Challan',
			description: 'Create Thread Challan',
			requestBody: SE.requestBody_schema_ref('thread/challan'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/challan'),
			},
		},
	},

	'/thread/challan/{uuid}': {
		get: {
			tags: ['thread.challan'],
			summary: 'Get Thread Challan',
			description: 'Get Thread Challan',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					carton_quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		put: {
			tags: ['thread.challan'],
			summary: 'Update Thread Challan',
			description: 'Update Thread Challan',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/challan'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/challan'),
			},
		},

		delete: {
			tags: ['thread.challan'],
			summary: 'Delete Thread Challan',
			description: 'Delete Thread Challan',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
			},
		},
	},
	'/thread/order-details-for-challan/by/{order_info_uuid}': {
		get: {
			tags: ['thread.challan'],
			summary: 'Get Order Details for Challan',
			description: 'Get Order Details for Challan',
			parameters: [
				SE.parameter_params('order_info_uuid', 'order_info_uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					order_entry_uuid: SE.uuid(),
					order_number: SE.string(),
					style: SE.string(),
					color: SE.string(),
					recipe_uuid: SE.uuid(),
					recipe_name: SE.string(),
					po: SE.string(),
					count_length_uuid: SE.uuid(),
					count: SE.string(),
					length: SE.string(),
					min_weight: SE.number(),
					count_length_name: SE.string(),
					order_quantity: SE.integer(),
					transfer_quantity: SE.integer(10),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},
	},
	'/thread/challan-details/by/{challan_uuid}': {
		get: {
			tags: ['thread.challan'],
			summary: 'Get Challan Details by Challan UUID',
			description: 'Get Challan Details by Challan UUID',
			parameters: [
				SE.parameter_params('challan_uuid', 'challan_uuid'),
				SE.parameter_query('is_update', 'is_update', ['false', 'true']),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					carton_quantity: SE.integer(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},
	},
};

export const pathThreadChallanEntry = {
	'/thread/challan-entry': {
		get: {
			tags: ['thread.challan_entry'],
			summary: 'Get all Thread Challan Entry',
			description: 'Get all Thread Challan Entry',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					challan_uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['thread.challan_entry'],
			summary: 'Create Thread Challan Entry',
			description: 'Create Thread Challan Entry',
			requestBody: SE.requestBody_schema_ref('thread/challan_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/challan_entry'),
			},
		},
	},

	'/thread/challan-entry/{uuid}': {
		get: {
			tags: ['thread.challan_entry'],
			summary: 'Get Thread Challan Entry',
			description: 'Get Thread Challan Entry',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					challan_uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					quantity: SE.integer(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		put: {
			tags: ['thread.challan_entry'],
			summary: 'Update Thread Challan Entry',
			description: 'Update Thread Challan Entry',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('thread/challan_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'thread/challan_entry'),
			},
		},

		delete: {
			tags: ['thread.challan_entry'],
			summary: 'Delete Thread Challan Entry',
			description: 'Delete Thread Challan Entry',
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
			},
		},
	},
	'/thread/challan-entry/by/{challan_uuid}': {
		get: {
			tags: ['thread.challan_entry'],
			summary: 'Get Thread Challan Entry by Challan UUID',
			description: 'Get Thread Challan Entry by Challan UUID',
			parameters: [SE.parameter_params('challan_uuid', 'challan_uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					challan_uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					quantity: SE.integer(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
	},
};

// * Thread * //

export const pathThread = {
	...pathThreadCountLength,
	...pathThreadOrderInfo,
	...pathThreadOrderEntry,
	...pathThreadBatchEntry,
	...pathThreadBatch,
	...pathThreadDyesCategory,
	...pathThreadPrograms,
	...pathThreadBatchEntryProduction,
	...pathThreadBatchEntryTrx,
	...pathThreadChallan,
	...pathThreadChallanEntry,
};
