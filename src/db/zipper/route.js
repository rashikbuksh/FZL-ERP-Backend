import { Router } from 'express';
import { factory } from '../public/schema.js';
import * as batchOperations from './query/batch.js';
import * as batchEntryOperations from './query/batch_entry.js';
import * as dyingBatchOperations from './query/dying_batch.js';
import * as dyingBatchEntryOperations from './query/dying_batch_entry.js';
import * as materialTrxAgainstOrderOperations from './query/material_trx_against_order_description.js';
import * as orderDescriptionOperations from './query/order_description.js';
import * as orderEntryOperations from './query/order_entry.js';
import * as orderInfoOperations from './query/order_info.js';
import * as planningOperations from './query/planning.js';
import * as planningEntryOperations from './query/planning_entry.js';
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
					example: 'igD0v9DIJQhJeet',
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
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'order info deleted',
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Order Info not found',
				},
			},
		},
	},
	'/zipper/order/details': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get Order Details',
			responses: {
				200: {
					description: 'Returns all Order Details',
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
										example: 'Z21-0010',
									},
									item_description: {
										type: 'string',
										example: 'N-5-OE-SP',
									},
									reference_order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
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
										example: 'Urgent',
									},
									status: { type: 'integer', example: 0 },
									created_by_uuid: {
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
									order_number_wise_rank: {
										type: 'integer',
										example: 1,
									},
									order_number_wise_count: {
										type: 'integer',
										example: 1,
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
zipperRouter.get('/order/details', orderInfoOperations.getOrderDetails);

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
									},
									item_name: {
										type: 'string',
										example: 'John',
									},
									item_short_name: {
										type: 'string',
										example: 'John',
									},
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_number_name: {
										type: 'string',
										example: 'John',
									},
									zipper_number_short_name: {
										type: 'string',
										example: 'John',
									},
									end_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_type_name: {
										type: 'string',
										example: 'John',
									},
									end_type_short_name: {
										type: 'string',
										example: 'John',
									},
									lock_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lock_type_name: {
										type: 'string',
										example: 'John',
									},
									lock_type_short_name: {
										type: 'string',
										example: 'John',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_type_name: {
										type: 'string',
										example: 'John',
									},
									puller_type_short_name: {
										type: 'string',
										example: 'John',
									},
									teeth_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									teeth_color_name: {
										type: 'string',
										example: 'John',
									},
									teeth_color_short_name: {
										type: 'string',
										example: 'John',
									},
									puller_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_color_name: {
										type: 'string',
										example: 'John',
									},
									puller_color_short_name: {
										type: 'string',
										example: 'John',
									},
									special_requirement: {
										type: 'string',
										example:
											'{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
									},
									hand: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									hand_name: {
										type: 'string',
										example: 'John',
									},
									hand_short_name: {
										type: 'string',
										example: 'John',
									},
									stopper_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									stopper_type_name: {
										type: 'string',
										example: 'John',
									},
									stopper_type_short_name: {
										type: 'string',
										example: 'John',
									},
									coloring_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coloring_type_name: {
										type: 'string',
										example: 'John',
									},
									coloring_type_short_name: {
										type: 'string',
										example: 'John',
									},
									is_slider_provided: {
										type: 'integer',
										example: 0,
									},
									slider: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_name: {
										type: 'string',
										example: 'John',
									},
									slider_short_name: {
										type: 'string',
										example: 'John',
									},
									top_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									top_stopper_name: {
										type: 'string',
										example: 'John',
									},
									top_stopper_short_name: {
										type: 'string',
										example: 'John',
									},
									bottom_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bottom_stopper_name: {
										type: 'string',
										example: 'John',
									},
									bottom_stopper_short_name: {
										type: 'string',
										example: 'John',
									},
									logo_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									logo_type_name: {
										type: 'string',
										example: 'John',
									},
									logo_type_short_name: {
										type: 'string',
										example: 'John',
									},
									is_logo_body: {
										type: 'integer',
										example: 0,
									},
									is_logo_puller: {
										type: 'integer',
										example: 0,
									},
									description: {
										type: 'string',
										example: 'description',
									},
									status: {
										type: 'integer',
										example: 0,
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
									slider_body_shape: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_body_shape_name: {
										type: 'string',
										example: 'John',
									},
									slider_body_shape_short_name: {
										type: 'string',
										example: 'John',
									},
									slider_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_link_name: {
										type: 'string',
										example: 'John',
									},
									slider_link_short_name: {
										type: 'string',
										example: 'John',
									},
									end_user: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_user_name: {
										type: 'string',
										example: 'John',
									},
									end_user_short_name: {
										type: 'string',
										example: 'John',
									},
									garment: {
										type: 'string',
										example: 'garments',
									},
									light_preference: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									light_preference_name: {
										type: 'string',
										example: 'John',
									},
									light_preference_short_name: {
										type: 'string',
										example: 'John',
									},
									garments_wash: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garments_wash_name: {
										type: 'string',
										example: 'John',
									},
									garments_wash_short_name: {
										type: 'string',
										example: 'John',
									},
									puller_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_link_name: {
										type: 'string',
										example: 'John',
									},
									puller_link_short_name: {
										type: 'string',
										example: 'John',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									garments_remarks: {
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
							},
							zipper_number: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							end_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							lock_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							puller_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							teeth_color: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							puller_color: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							special_requirement: {
								type: 'string',
								example: '{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
							},
							hand: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							stopper_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							coloring_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							is_slider_provided: {
								type: 'integer',
								example: 0,
							},
							slider: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							top_stopper: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							bottom_stopper: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							logo_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							is_logo_body: {
								type: 'integer',
								example: 0,
							},
							is_logo_puller: {
								type: 'integer',
								example: 0,
							},
							description: {
								type: 'string',
								example: 'description',
							},
							status: {
								type: 'integer',
								example: 0,
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
							slider_body_shape: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							slider_link: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							end_user: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							garment: {
								type: 'string',
								example: 'garments',
							},
							light_preference: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							garments_wash: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							puller_link: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by_name: {
								type: 'string',
								example: 'John Doe',
							},
							garments_remarks: {
								type: 'string',
								example: 'Remarks',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/order_description',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						properties: {
							order_info_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							item: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							zipper_number: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							end_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							lock_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							puller_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							teeth_color: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							puller_color: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							special_requirement: {
								type: 'string',
								example: '{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
							},
							hand: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							stopper_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							coloring_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							is_slider_provided: {
								type: 'integer',
								example: 0,
							},
							slider: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							top_stopper: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							bottom_stopper: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							logo_type: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							is_logo_body: {
								type: 'integer',
								example: 0,
							},
							is_logo_puller: {
								type: 'integer',
								example: 0,
							},
							description: {
								type: 'string',
								example: 'description',
							},
							status: {
								type: 'integer',
								example: 0,
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
							slider_body_shape: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							slider_link: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							end_user: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							garment: {
								type: 'string',
								example: 'garments',
							},
							light_preference: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							garments_wash: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							puller_link: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by_name: {
								type: 'string',
								example: 'John Doe',
							},
							garments_remarks: {
								type: 'string',
								example: 'Remarks',
							},
						},
					},
				},
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
	'/zipper/order/description/full/uuid/by/{order_description_uuid}': {
		get: {
			tags: ['zipper.order_description'],
			summary: 'Gets a Order Description Full by Order Description UUID',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'order_description_uuid',
					in: 'path',
					description: 'orderDescription to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description:
						'Returns all Order Description Full by Order Description UUID',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0010',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lock_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									teeth_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									special_requirement: {
										type: 'string',
										example:
											'{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
									},
									hand: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									stopper_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coloring_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									is_slider_provided: {
										type: 'integer',
										example: 0,
									},
									slider: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									top_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bottom_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									logo_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									is_logo_body: {
										type: 'integer',
										example: 0,
									},
									is_logo_puller: {
										type: 'integer',
										example: 0,
									},
									description: {
										type: 'string',
										example: 'description',
									},
									status: {
										type: 'integer',
										example: 0,
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
									slider_body_shape: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_user: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garment: {
										type: 'string',
										example: 'garments',
									},
									light_preference: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garments_wash: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
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
	},
	'/zipper/order/details/single-order/by/{order_description_uuid}/UUID': {
		get: {
			tags: ['zipper.order_description'],
			summary:
				'Gets a Order Description UUID to get Order Description and Order Entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'order_description_uuid',
					in: 'path',
					description: 'orderDescription to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description:
						'Returns all Order Description UUID to get Order Description and Order Entry',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0010',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lock_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									teeth_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									special_requirement: {
										type: 'string',
										example:
											'{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
									},
									hand: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									stopper_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coloring_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									is_slider_provided: {
										type: 'integer',
										example: 0,
									},
									slider: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									top_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bottom_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									logo_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									is_logo_body: {
										type: 'integer',
										example: 0,
									},
									is_logo_puller: {
										type: 'integer',
										example: 0,
									},
									description: {
										type: 'string',
										example: 'description',
									},
									status: {
										type: 'integer',
										example: 0,
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
									slider_body_shape: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_user: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garment: {
										type: 'string',
										example: 'garments',
									},
									light_preference: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garments_wash: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									order_entry: {
										type: 'object',
										properties: {
											order_entry_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											order_description_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											style: {
												type: 'string',
												example: 'style 1',
											},
											color: {
												type: 'string',
												example: 'black',
											},
											size: {
												type: 'number',
												example: 10,
											},
											quantity: {
												type: 'number',
												example: 100,
											},
											company_price: {
												type: 'number',
												example: 10.5,
											},
											party_price: {
												type: 'number',
												example: 10.5,
											},
											status: {
												type: 'integer',
												example: 0,
											},
											swatch_status: {
												type: 'string',
												example: 'Pending',
											},
											swap_approval_date: {
												type: 'string',
												example: '2021-08-01 00:00:00',
											},
											created_by: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											created_at: {
												type: 'string',
												example: '2021-08-01 00:00:00',
											},
											updated_at: {
												type: 'string',
												example: '2021-08-01 00:00:00',
											},
											teeth_molding_stock: {
												type: 'number',
												example: 10,
											},
											teeth_molding_prod: {
												type: 'number',
												example: 10,
											},
											total_teeth_molding: {
												type: 'number',
												example: 10,
											},
											teeth_coloring_stock: {
												type: 'number',
												example: 10,
											},
											teeth_coloring_prod: {
												type: 'number',
												example: 10,
											},
											total_teeth_coloring: {
												type: 'number',
												example: 10,
											},
											finishing_stock: {
												type: 'number',
												example: 10,
											},
											finishing_prod: {
												type: 'number',
												example: 10,
											},
											total_finishing: {
												type: 'number',
												example: 10,
											},
											coloring_prod: {
												type: 'number',
												example: 10,
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
					description: 'User not found',
				},
			},
		},
	},
	'/zipper/order/details/single-order/by/{order_number}': {
		get: {
			tags: ['zipper.order_description'],
			summary:
				'Gets a Order Number to get Order Description and Order Entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'order_number',
					in: 'path',
					description: 'orderDescription to get',
					required: true,
					type: 'string',
					example: 'Z24-0010',
				},
			],
			responses: {
				200: {
					description:
						'Returns all Order Number to get Order Description and Order Entry',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0010',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lock_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									teeth_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_color: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									special_requirement: {
										type: 'string',
										example:
											'{igD0v9DIJQhJeet,igD0v9DIJQhJeey}',
									},
									hand: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									stopper_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coloring_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									is_slider_provided: {
										type: 'integer',
										example: 0,
									},
									slider: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									top_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bottom_stopper: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									logo_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									is_logo_body: {
										type: 'integer',
										example: 0,
									},
									is_logo_puller: {
										type: 'integer',
										example: 0,
									},
									description: {
										type: 'string',
										example: 'description',
									},
									status: {
										type: 'integer',
										example: 0,
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
									slider_body_shape: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									end_user: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garment: {
										type: 'string',
										example: 'garments',
									},
									light_preference: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									garments_wash: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									puller_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									order_entry: {
										type: 'object',
										properties: {
											order_entry_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											order_description_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											style: {
												type: 'string',
												example: 'style 1',
											},
											color: {
												type: 'string',
												example: 'black',
											},
											size: {
												type: 'number',
												example: 10,
											},
											quantity: {
												type: 'number',
												example: 100,
											},
											company_price: {
												type: 'number',
												example: 10.5,
											},
											party_price: {
												type: 'number',
												example: 10.5,
											},
											status: {
												type: 'integer',
												example: 0,
											},
											swatch_status: {
												type: 'string',
												example: 'Pending',
											},
											swap_approval_date: {
												type: 'string',
												example: '2021-08-01 00:00:00',
											},
											created_by: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											created_at: {
												type: 'string',
												example: '2021-08-01 00:00:00',
											},
											updated_at: {
												type: 'string',
												example: '2021-08-01 00:00:00',
											},
											teeth_molding_stock: {
												type: 'number',
												example: 10,
											},
											teeth_molding_prod: {
												type: 'number',
												example: 10,
											},
											total_teeth_molding: {
												type: 'number',
												example: 10,
											},
											teeth_coloring_stock: {
												type: 'number',
												example: 10,
											},
											teeth_coloring_prod: {
												type: 'number',
												example: 10,
											},
											total_teeth_coloring: {
												type: 'number',
												example: 10,
											},
											finishing_stock: {
												type: 'number',
												example: 10,
											},
											finishing_prod: {
												type: 'number',
												example: 10,
											},
											total_finishing: {
												type: 'number',
												example: 10,
											},
											coloring_prod: {
												type: 'number',
												example: 10,
											},
											created_by: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											created_by_name: {
												type: 'string',
												example: 'John Doe',
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
					description: 'User not found',
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
zipperRouter.get(
	'/order/description/full/uuid/by/:order_description_uuid',
	orderDescriptionOperations.selectOrderDescriptionFullByOrderDescriptionUuid
);
zipperRouter.get(
	'/order/details/single-order/by/:order_description_uuid/UUID',
	orderDescriptionOperations.selectOrderDescriptionUuidToGetOrderDescriptionAndOrderEntry
);
zipperRouter.get(
	'/order/details/single-order/by/:order_number',
	orderDescriptionOperations.selectOrderNumberToGetOrderDescriptionAndOrderEntry
);

// /order/details/single-order/by/:id/marketing/:marketing_id -> pending

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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									style: {
										type: 'string',
										example: 'style 1',
									},
									color: {
										type: 'string',
										example: 'black',
									},
									size: {
										type: 'number',
										example: 10,
									},
									quantity: {
										type: 'number',
										example: 100,
									},
									company_price: {
										type: 'number',
										example: 10.5,
									},
									party_price: {
										type: 'number',
										example: 10.5,
									},
									status: {
										type: 'integer',
										example: 0,
									},
									swatch_status: {
										type: 'string',
										example: 'Pending',
									},
									swap_approval_date: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
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
			tags: ['zipper.order_entry'],
			summary: 'create a order entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				description: 'Order Entry',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/order_entry',
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
					example: 'igD0v9DIJQhJeet',
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
			],
			requestBody: {
				description: 'Order Entry',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/order_entry',
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
							$ref: '#/definitions/zipper/order_entry',
						},
					},
				},
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
				200: {
					description: 'order entry deleted',
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Order Entry not found',
				},
			},
		},
	},
	'/zipper/order/entry/full/uuid/by/{order_description_uuid}': {
		get: {
			tags: ['zipper.order_entry'],
			summary: 'Gets a Order Entry Full By Order Description UUID',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'order_description_uuid',
					in: 'path',
					description: 'orderDescription to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description:
						'Returns all Order Entry Full By Order Description UUID',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_entry_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									style: {
										type: 'string',
										example: 'style 1',
									},
									color: {
										type: 'string',
										example: 'black',
									},
									size: {
										type: 'number',
										example: 10,
									},
									quantity: {
										type: 'number',
										example: 100,
									},
									company_price: {
										type: 'number',
										example: 10.5,
									},
									party_price: {
										type: 'number',
										example: 10.5,
									},
									status: {
										type: 'integer',
										example: 0,
									},
									swatch_status: {
										type: 'string',
										example: 'Pending',
									},
									swap_approval_date: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										example: '2021-08-01 00:00:00',
									},
									teeth_molding_stock: {
										type: 'number',
										example: 10,
									},
									teeth_molding_prod: {
										type: 'number',
										example: 10,
									},
									total_teeth_molding: {
										type: 'number',
										example: 10,
									},
									teeth_coloring_stock: {
										type: 'number',
										example: 10,
									},
									teeth_coloring_prod: {
										type: 'number',
										example: 10,
									},
									total_teeth_coloring: {
										type: 'number',
										example: 10,
									},
									finishing_stock: {
										type: 'number',
										example: 10,
									},
									finishing_prod: {
										type: 'number',
										example: 10,
									},
									total_finishing: {
										type: 'number',
										example: 10,
									},
									coloring_prod: {
										type: 'number',
										example: 10,
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
					description: 'Order Entry not found',
				},
			},
		},
	},
};

// --------------------- ORDER ENTRY ROUTES ---------------------

zipperRouter.get('/order-entry', orderEntryOperations.selectAll);
zipperRouter.get('/order-entry/:uuid', orderEntryOperations.select);
zipperRouter.post('/order-entry', orderEntryOperations.insert);
zipperRouter.put('/order-entry/:uuid', orderEntryOperations.update);
zipperRouter.delete('/order-entry/:uuid', orderEntryOperations.remove);
zipperRouter.get(
	'/order/entry/full/uuid/by/:order_description_uuid',
	orderEntryOperations.selectOrderEntryFullByOrderDescriptionUuid
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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_entry_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_quantity: {
										type: 'number',
										example: 10,
									},
									recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_name: {
										type: 'string',
										example: 'recipe 1',
									},
									dying_and_iron_prod: {
										type: 'number',
										example: 10,
									},
									teeth_molding_stock: {
										type: 'number',
										example: 10,
									},
									teeth_molding_prod: {
										type: 'number',
										example: 10,
									},
									teeth_coloring_stock: {
										type: 'number',
										example: 10,
									},
									teeth_coloring_prod: {
										type: 'number',
										example: 10,
									},
									finishing_stock: {
										type: 'number',
										example: 10,
									},
									finishing_prod: {
										type: 'number',
										example: 10,
									},
									coloring_prod: {
										type: 'number',
										example: 10,
									},
									warehouse: {
										type: 'string',
										example: 'warehouse 1',
									},
									delivered: {
										type: 'number',
										example: 10,
									},
									pi: {
										type: 'string',
										example: 'pi 1',
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
			tags: ['zipper.sfg'],
			summary: 'create a sfg',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				description: 'SFG object that needs to be added to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/sfg',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns a SFG',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/sfg',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'SFG object that needs to be updated to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/sfg',
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
							$ref: '#/definitions/zipper/sfg',
						},
					},
				},
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
					type: 'uuid',
					example: 'igD0v9DIJQhJeet',
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'SFG not found',
				},
			},
		},
	},
	'/zipper/sfg-swatch': {
		get: {
			tags: ['zipper.sfg'],
			summary: 'Get all SFG Swatch Info',
			responses: {
				200: {
					description: 'Returns all SFG Swatch Info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_entry_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									style: {
										type: 'string',
										example: 'style 1',
									},
									color: {
										type: 'string',
										example: 'black',
									},
									size: {
										type: 'number',
										example: 10,
									},
									quantity: {
										type: 'number',
										example: 10,
									},
									recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_name: {
										type: 'string',
										example: 'recipe 1',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0010',
									},
									item_description: {
										type: 'string',
										example: 'item description',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/zipper/sfg-swatch/{uuid}': {
		put: {
			tags: ['zipper.sfg'],
			summary: 'Update an existing swatch by sfg uuid',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'SFG object that needs to be updated to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								recipe_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
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
							$ref: '#/definitions/zipper/sfg',
						},
					},
				},
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
	},
};

// --------------------- SFG ROUTES ---------------------

zipperRouter.get('/sfg', sfgOperations.selectAll);
zipperRouter.get('/sfg/:uuid', sfgOperations.select);
zipperRouter.post('/sfg', sfgOperations.insert);
zipperRouter.put('/sfg/:uuid', sfgOperations.update);
zipperRouter.delete('/sfg/:uuid', sfgOperations.remove);
zipperRouter.get('/sfg-swatch', sfgOperations.selectSwatchInfo);
zipperRouter.put('/sfg-swatch/:uuid', sfgOperations.updateSwatchBySfgUuid);

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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section: {
										type: 'string',
										example: 'section 1',
									},
									used_quantity: {
										type: 'number',
										example: 10,
									},
									production_quantity: {
										type: 'number',
										example: 10,
									},
									wastage: {
										type: 'number',
										example: 10,
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
										example: 'Production',
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
			tags: ['zipper.sfg_production'],
			summary: 'create a sfg production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				description:
					'SFG Production object that needs to be added to the zipper',
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/sfg_production',
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
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns a SFG Production',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/sfg_production',
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

					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'SFG Production object that needs to be updated to the zipper',

				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/sfg_production',
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
							$ref: '#/definitions/zipper/sfg_production',
						},
					},
				},
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
					example: 'igD0v9DIJQhJeet',
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
	'/sfg-production/:uuid',
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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_entry_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_quantity: {
										type: 'number',
										example: 10,
									},
									trx_from: {
										type: 'string',
										example: 'trx from',
									},
									trx_to: {
										type: 'string',
										example: 'trx to',
									},
									trx_quantity: {
										type: 'number',
										example: 10,
									},
									slider_item_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									user_designation: {
										type: 'string',
										example: 'HR',
									},
									user_department: {
										type: 'string',
										example: 'HR',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2021-08-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
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
			tags: ['zipper.sfg_transaction'],
			summary: 'create a sfg transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				description:
					'SFG Transaction object that needs to be added to the zipper',
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/sfg_transaction',
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
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns a SFG Transaction',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/sfg_transaction',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'SFG Transaction object that needs to be updated to the zipper',

				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/sfg_transaction',
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
							$ref: '#/definitions/zipper/sfg_transaction',
						},
					},
				},
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
					example: 'igD0v9DIJQhJeet',
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
			requestBody: {
				description:
					'Batch object that needs to be added to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/batch',
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
				200: {
					description: 'Returns a Batch',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/batch',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'Batch object that needs to be updated to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/batch',
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
							$ref: '#/definitions/zipper/batch',
						},
					},
				},
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
			requestBody: {
				description:
					'Batch Entry object that needs to be added to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/batch_entry',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns a Batch Entry',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/batch_entry',
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
			],
			requestBody: {
				description:
					'Batch Entry object that needs to be updated to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/batch_entry',
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
							$ref: '#/definitions/zipper/batch_entry',
						},
					},
				},
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
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/batch_entry',
						},
					},
				},
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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'serial',
										example: 1,
									},
									mc_no: {
										type: 'integer',
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
			tags: ['zipper.dying_batch'],
			summary: 'create a dying batch',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				description:
					'Dying Batch object that needs to be added to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/dying_batch',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns a Dying Batch',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/dying_batch',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'Dying Batch object that needs to be updated to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/dying_batch',
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
							$ref: '#/definitions/zipper/dying_batch',
						},
					},
				},
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
					example: 'igD0v9DIJQhJeet',
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
			requestBody: {
				description:
					'Dying Batch Entry object that needs to be added to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/dying_batch_entry',
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns a Dying Batch Entry',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/zipper/dying_batch_entry',
							},
						},
					},
				},
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				description:
					'Dying Batch Entry object that needs to be updated to the zipper',
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/dying_batch_entry',
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
							$ref: '#/definitions/zipper/dying_batch_entry',
						},
					},
				},
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
					example: 'igD0v9DIJQhJeet',
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
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_coil',
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
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/tape_coil',
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
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_coil',
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
							$ref: '#/definitions/zipper/tape_coil',
						},
					},
				},
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
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/tape_coil',
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Tape Coil not found',
				},
			},
		},
	},
	'/zipper/tape-coil/by/nylon': {
		get: {
			tags: ['zipper.tape_coil'],
			summary: 'Get all Tape Coil by Nylon',
			responses: {
				200: {
					description: 'Returns all Tape Coil by Nylon',
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
										example: 'nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									trx_quantity_in_coil: {
										type: 'number',
										example: 100,
									},
									quantity_in_coil: {
										type: 'number',
										example: 100,
									},
									remarks: {
										type: 'string',
										example: 'Good',
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
zipperRouter.get('/tape-coil/by/nylon', tapeCoilOperations.selectByNylon);

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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section: {
										type: 'string',
										example: 'zipper',
									},
									tape_coil_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									type: {
										type: 'string',
										example: 'nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									type_of_zipper: {
										type: 'string',
										example: 'nylon 3',
									},
									quantity: {
										type: 'number',
										example: 10,
									},
									trx_quantity_in_coil: {
										type: 'number',
										example: 10,
									},
									quantity_in_coil: {
										type: 'number',
										example: 10,
									},
									production_quantity: {
										type: 'number',
										example: 10,
									},
									wastage: {
										type: 'number',
										example: 10,
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
										example: 'Good',
									},
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
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_coil_production',
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
							section: {
								type: 'string',
								example: 'zipper',
							},
							tape_coil_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							type: {
								type: 'string',
								example: 'nylon',
							},
							zipper_number: {
								type: 'number',
								example: 3,
							},
							type_of_zipper: {
								type: 'string',
								example: 'nylon 3',
							},
							quantity: {
								type: 'number',
								example: 10,
							},
							trx_quantity_in_coil: {
								type: 'number',
								example: 10,
							},
							quantity_in_coil: {
								type: 'number',
								example: 10,
							},
							production_quantity: {
								type: 'number',
								example: 10,
							},
							wastage: {
								type: 'number',
								example: 10,
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
								example: 'Good',
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
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_coil_production',
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
							$ref: '#/definitions/zipper/tape_coil_production',
						},
					},
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Tape Coil Production not found',
				},
			},
		},
	},
	'/zipper/tape-coil-production/by/{section}': {
		get: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Get all Tape Coil Production by Section',
			parameters: [
				{
					name: 'section',
					in: 'path',
					description: 'tape coil production to update',
					required: true,
					type: 'string',
					example: 'tape',
				},
			],
			responses: {
				200: {
					description: 'Returns all Tape Coil Production by Section',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section: {
										type: 'string',
										example: 'zipper',
									},
									tape_coil_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									type: {
										type: 'string',
										example: 'nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									type_of_zipper: {
										type: 'string',
										example: 'nylon 3',
									},
									quantity: {
										type: 'number',
										example: 10,
									},
									trx_quantity_in_coil: {
										type: 'number',
										example: 10,
									},
									quantity_in_coil: {
										type: 'number',
										example: 10,
									},
									production_quantity: {
										type: 'number',
										example: 10,
									},
									wastage: {
										type: 'number',
										example: 10,
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
										example: 'Good',
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
zipperRouter.get(
	'/tape-coil-production/by/:section',
	tapeCoilProductionOperations.selectTapeCoilProductionBySection
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
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									tape_coil_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									type: {
										type: 'string',
										example: 'nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									type_of_zipper: {
										type: 'string',
										example: 'nylon 3',
									},
									trx_quantity: {
										type: 'number',
										example: 10,
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
			tags: ['zipper.tape_to_coil'],
			summary: 'create a tape to coil',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_to_coil',
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
							tape_coil_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							type: {
								type: 'string',
								example: 'nylon',
							},
							zipper_number: {
								type: 'number',
								example: 3,
							},
							type_of_zipper: {
								type: 'string',
								example: 'nylon 3',
							},
							trx_quantity: {
								type: 'number',
								example: 10,
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
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_to_coil',
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
							$ref: '#/definitions/zipper/tape_to_coil',
						},
					},
				},
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

// --------------------- PlANNING ---------------------

export const pathZipperPlanning = {
	'/zipper/planning': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning',
			responses: {
				200: {
					description: 'Returns all Planning',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									week: {
										type: 'string',
										example: '24-32',
									},
									week_id: {
										type: 'string',
										example: 'DP-24-W32',
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
			tags: ['zipper.planning'],
			summary: 'create a planning',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/planning',
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
							$ref: '#/definitions/zipper/planning',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/planning/{week}': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Gets a Planning',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'week',
					in: 'path',
					description: 'planning to get',
					required: true,
					type: 'string',
					example: '24-32',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						properties: {
							week: {
								type: 'string',
								example: '24-32',
							},
							week_id: {
								type: 'string',
								example: 'DP-24-W32',
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

				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'User not found',
				},
			},
		},

		put: {
			tags: ['zipper.planning'],
			summary: 'Update an existing planning',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'week',
					in: 'path',
					description: 'planning to update',
					required: true,
					type: 'string',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/planning',
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
							$ref: '#/definitions/zipper/planning',
						},
					},
				},

				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'planning not found',
				},

				405: {
					description: 'Validation exception',
				},
			},
		},

		delete: {
			tags: ['zipper.planning'],

			summary: 'Deletes a planning',

			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'week',
					in: 'path',
					description: 'planning to delete',
					required: true,
					type: 'string',
				},
			],

			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/planning',
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Planning not found',
				},
			},
		},
	},
	'/zipper/planning/by/{planning_week}': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning by Planning UUID',
			parameters: [
				{
					name: 'planning_week',
					in: 'path',
					description: 'planning to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns all Planning by Planning UUID',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									week: {
										type: 'integer',
										example: 1,
									},
									week_id: {
										type: 'string',
										example: 'DP-24-W32',
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
	},
	'/zipper/planning-details/by/{planning_week}': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning and Planning Entry by Planning UUID',
			parameters: [
				{
					name: 'planning_week',
					in: 'path',
					description: 'planning to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description:
						'Returns all Planning and Planning Entry by Planning UUID',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									week: {
										type: 'string',
										example: '24-32',
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
									planning_entry: {
										type: 'object',
										properties: {
											uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											planning_week: {
												type: 'string',
												example: '24-32',
											},
											sfg_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											sno_quantity: {
												type: 'number',
												example: 100,
											},
											factory_quantity: {
												type: 'number',
												example: 100,
											},
											production_quantity: {
												type: 'number',
												example: 100,
											},
											batch_production_quantity: {
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
			},
		},
	},
};

// --------------------- PlANNING ROUTES ---------------------
zipperRouter.get('/planning', planningOperations.selectAll);
zipperRouter.get('/planning/:week', planningOperations.select);
zipperRouter.post('/planning', planningOperations.insert);
zipperRouter.put('/planning/:week', planningOperations.update);
zipperRouter.delete('/planning/:week', planningOperations.remove);
zipperRouter.get(
	'/planning/by/:planning_week',
	planningOperations.selectPlanningByPlanningWeek
);
zipperRouter.get(
	'/planning-details/by/:planning_week',
	planningOperations.selectPlanningAndPlanningEntryByPlanningWeek
);

// --------------------- PlANNING ---------------------

export const pathZipperPlanningEntry = {
	'/zipper/planning-entry': {
		get: {
			tags: ['zipper.planning_entry'],
			summary: 'Get all Planning',
			responses: {
				200: {
					description: 'Returns all Planning',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									planning_week: {
										type: 'string',
										example: '23-32',
									},
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									sno_quantity: {
										type: 'number',
										example: 100,
									},
									factory_quantity: {
										type: 'number',
										example: 100,
									},
									production_quantity: {
										type: 'number',
										example: 100,
									},
									batch_production_quantity: {
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
									sno_remarks: {
										type: 'string',
										example: 'Remarks',
									},
									factory_remarks: {
										type: 'string',
										example: 'Remarks',
									},
									style: {
										type: 'string',
										example: 'Style 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									size: {
										type: 'number',
										example: 10,
									},
									order_quantity: {
										type: 'number',
										example: 100,
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.planning_entry'],
			summary: 'create a planning entry for sno',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
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
								planning_week: {
									type: 'string',
									example: '24-32',
								},
								sfg_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								sno_quantity: {
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
								sno_remarks: {
									type: 'string',
									example: 'Remarks',
								},
								factory_remarks: {
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
							$ref: '#/definitions/zipper/planning_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/planning-entry/{uuid}': {
		get: {
			tags: ['zipper.planning_entry'],
			summary: 'Gets a planning entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'planning_entry to get',
					required: true,
					type: 'string',
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
							planning_week: {
								type: 'string',
								example: '24-32',
							},
							sfg_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							sno_quantity: {
								type: 'number',
								example: 100,
							},
							factory_quantity: {
								type: 'number',
								example: 100,
							},
							production_quantity: {
								type: 'number',
								example: 100,
							},
							batch_production_quantity: {
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
							sno_remarks: {
								type: 'string',
								example: 'Remarks',
							},
							factory_remarks: {
								type: 'string',
								example: 'Remarks',
							},
							style: {
								type: 'string',
								example: 'Style 1',
							},
							color: {
								type: 'string',
								example: 'Red',
							},
							size: {
								type: 'number',
								example: 10,
							},
							order_quantity: {
								type: 'number',
								example: 100,
							},
							order_number: {
								type: 'string',
								example: 'Z24-0001',
							},
							item_description: {
								type: 'string',
								example: 'N-3-OE-SP',
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
			tags: ['zipper.planning_entry'],
			summary: 'Update an existing planning_entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'planning_entry to update',
					required: true,
					type: 'string',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/planning_entry',
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
							$ref: '#/definitions/zipper/planning_entry',
						},
					},
				},

				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'planning not found',
				},

				405: {
					description: 'Validation exception',
				},
			},
		},

		delete: {
			tags: ['zipper.planning_entry'],

			summary: 'Deletes a planning_entry',

			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'planning_entry to delete',
					required: true,
					type: 'string',
				},
			],

			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/planning_entry',
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Planning_entry not found',
				},
			},
		},
	},
	'/zipper/planning-entry/by/{planning_week}': {
		get: {
			tags: ['zipper.planning_entry'],
			summary: 'Get all Planning Entry by Planning UUID',
			parameters: [
				{
					name: 'planning_week',
					in: 'path',
					description: 'planning entry to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns all Planning Entry by Planning UUID',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									planning_week: {
										type: 'string',
										example: '24-32',
									},
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									sno_quantity: {
										type: 'number',
										example: 100,
									},
									factory_quantity: {
										type: 'number',
										example: 100,
									},
									production_quantity: {
										type: 'number',
										example: 100,
									},
									batch_production_quantity: {
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
									sno_remarks: {
										type: 'string',
										example: 'Remarks',
									},
									factory_remarks: {
										type: 'string',
										example: 'Remarks',
									},
									style: {
										type: 'string',
										example: 'Style 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									size: {
										type: 'number',
										example: 10,
									},
									order_quantity: {
										type: 'number',
										example: 100,
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									given_sno_quantity: {
										type: 'number',
										example: 100,
									},
									given_factory_quantity: {
										type: 'number',
										example: 100,
									},
									given_production_quantity: {
										type: 'number',
										example: 100,
									},
									given_batch_production_quantity: {
										type: 'number',
										example: 100,
									},
									balance_sno_quantity: {
										type: 'number',
										example: 100,
									},
									balance_factory_quantity: {
										type: 'number',
										example: 100,
									},
									balance_production_quantity: {
										type: 'number',
										example: 100,
									},
									balance_batch_production_quantity: {
										type: 'number',
										example: 100,
									},
									max_sno_quantity: {
										type: 'number',
										example: 100,
									},
									max_factory_quantity: {
										type: 'number',
										example: 100,
									},
									max_production_quantity: {
										type: 'number',
										example: 100,
									},
									max_batch_production_quantity: {
										type: 'number',
										example: 100,
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/zipper/order-planning': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Order Planning',
			responses: {
				200: {
					description: 'Returns all Order Planning',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									style: {
										type: 'string',
										example: 'Style 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									size: {
										type: 'number',
										example: 100,
									},
									order_quantity: {
										type: 'number',
										example: 100,
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									given_sno_quantity: {
										type: 'number',
										example: 100,
									},
									given_factory_quantity: {
										type: 'number',
										example: 100,
									},
									given_production_quantity: {
										type: 'number',
										example: 100,
									},
									given_batch_production_quantity: {
										type: 'number',
										example: 100,
									},
									balance_sno_quantity: {
										type: 'number',
										example: 100,
									},
									balance_factory_quantity: {
										type: 'number',
										example: 100,
									},
									balance_production_quantity: {
										type: 'number',
										example: 100,
									},
									balance_batch_production_quantity: {
										type: 'number',
										example: 100,
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/zipper/planning-entry/for/factory': {
		post: {
			tags: ['zipper.planning_entry'],
			summary: 'create a planning entry for factory',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
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
								planning_week: {
									type: 'string',
									example: '24-32',
								},
								sfg_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								factory_quantity: {
									type: 'number',
									example: 100,
								},
								production_quantity: {
									type: 'number',
									example: 100,
								},
								batch_production_quantity: {
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
								sno_remarks: {
									type: 'string',
									example: 'Remarks',
								},
								factory_remarks: {
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
							$ref: '#/definitions/zipper/planning_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
};

zipperRouter.get('/planning-entry', planningEntryOperations.selectAll);
zipperRouter.get('/planning-entry/:uuid', planningEntryOperations.select);
zipperRouter.post('/planning-entry', planningEntryOperations.insert);
zipperRouter.put('/planning-entry/:uuid', planningEntryOperations.update);
zipperRouter.delete('/planning-entry/:uuid', planningEntryOperations.remove);
zipperRouter.get(
	'/planning-entry/by/:planning_week',
	planningEntryOperations.selectPlanningEntryByPlanningWeek
);
zipperRouter.get(
	'/order-planning',
	planningEntryOperations.getOrderDetailsForPlanningEntry
);
zipperRouter.post(
	'/planning-entry/for/factory',
	planningEntryOperations.insertOrUpdatePlanningEntryByFactory
);

// --------------------- material trx against order ---------------------

export const pathZipperMaterialTrxAgainstOrderDescription = {
	'/zipper/material-trx-against-order': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Get all Material Trx',
			responses: {
				200: {
					description: 'Returns all Material Trx',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'Material 1',
									},
									trx_quantity: {
										type: 'number',
										example: 100,
									},
									trx_to: {
										type: 'string',
										example: 'teeth_molding',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
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
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'create a material trx',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/material_trx_against_order_description',
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
							$ref: '#/definitions/zipper/material_trx_against_order_description',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/zipper/material-trx-against-order/{uuid}': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Gets a material trx',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material trx to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
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
							order_description_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							order_number: {
								type: 'string',
								example: 'Z24-0001',
							},
							item_description: {
								type: 'string',
								example: 'N-3-OE-SP',
							},
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							material_name: {
								type: 'string',
								example: 'Material 1',
							},
							trx_quantity: {
								type: 'number',
								example: 100,
							},
							trx_to: {
								type: 'string',
								example: 'teeth_molding',
							},
							remarks: {
								type: 'string',
								example: 'Remarks',
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
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Update an existing material trx',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material trx to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/material_trx_against_order_description',
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
							$ref: '#/definitions/zipper/material_trx_against_order_description',
						},
					},
				},

				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'material trx not found',
				},

				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Deletes a material trx',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material trx to delete',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/zipper/material_trx_against_order_description',
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'material trx not found',
				},
			},
		},
	},
	'/zipper/material-trx-against-order/by/{trx_to}': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Get all Material Trx by trx_to',
			parameters: [
				{
					name: 'trx_to',
					in: 'path',
					description: 'material trx to get',
					required: true,
					type: 'string',
					example: 'teeth_molding',
				},
			],
			responses: {
				200: {
					description: 'Returns all Material Trx by trx_to',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'Material 1',
									},
									trx_quantity: {
										type: 'number',
										example: 100,
									},
									trx_to: {
										type: 'string',
										example: 'teeth_molding',
									},
									remarks: {
										type: 'string',
										example: 'Remarks',
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
								},
							},
						},
					},
				},
			},
		},
	},
};

zipperRouter.get(
	'/material-trx-against-order',
	materialTrxAgainstOrderOperations.selectAll
);
zipperRouter.get(
	'/material-trx-against-order/:uuid',
	materialTrxAgainstOrderOperations.select
);
zipperRouter.post(
	'/material-trx-against-order',
	materialTrxAgainstOrderOperations.insert
);
zipperRouter.put(
	'/material-trx-against-order/:uuid',
	materialTrxAgainstOrderOperations.update
);
zipperRouter.delete(
	'/material-trx-against-order/:uuid',
	materialTrxAgainstOrderOperations.remove
);
zipperRouter.get(
	'/material-trx-against-order/by/:trx_to',
	materialTrxAgainstOrderOperations.selectMaterialTrxLogAgainstOrderByTrxTo
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
	...pathZipperPlanning,
	...pathZipperPlanningEntry,
	...pathZipperMaterialTrxAgainstOrderDescription,
};

export { zipperRouter };
