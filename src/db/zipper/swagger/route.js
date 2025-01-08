import { param } from 'express-validator';
import SE, { SED } from '../../../util/swagger_example.js';

// * Zipper Order Info * //
export const pathZipperOrderInfo = {
	'/zipper/order-info': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get all Order Info',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.number(1),
					reference_order_info_uuid: SE.uuid(),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('John'),
					party_uuid: SE.uuid(),
					party_name: SE.string('John'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('John'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('John'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('John'),
					is_sample: SE.number(0),
					is_bill: SE.number(0),
					is_cash: SE.number(0),
					conversion_rate: SE.number(0),
					marketing_priority: SE.string('Urgent'),
					factory_priority: SE.string('FIFO'),
					status: SE.number(0),
					created_by: SE.uuid(),
					created_by_name: SE.string('John'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['zipper.order_info'],
			summary: 'create a order info',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/order_info'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_info'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_params('GET DATA', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.number(1),
					reference_order_info_uuid: SE.uuid(),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('John'),
					party_uuid: SE.uuid(),
					party_name: SE.string('John'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('John'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('John'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('John'),
					is_sample: SE.number(0),
					is_bill: SE.number(0),
					is_cash: SE.number(0),
					conversion_rate: SE.number(0),
					marketing_priority: SE.string('Urgent'),
					factory_priority: SE.string('FIFO'),
					status: SE.number(0),
					created_by: SE.uuid(),
					created_by_name: SE.string('John'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.order_info'],
			summary: 'Update an existing order info',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('PUT DATA')],
			requestBody: SE.requestBody(
				{
					reference_order_info_uuid: SE.uuid(),
					buyer_uuid: SE.uuid(),
					party_uuid: SE.uuid(),
					marketing_uuid: SE.uuid(),
					merchandiser_uuid: SE.uuid(),
					factory_uuid: SE.uuid(),
					is_sample: SE.number(0),
					is_bill: SE.number(0),
					is_cash: SE.number(0),
					marketing_priority: SE.string('Urgent'),
					factory_priority: SE.string('FIFO'),
					status: SE.number(0),
					created_by: SE.uuid(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				},
				[]
			),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_info'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.order_info'],
			summary: 'Deletes a order info',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('order info to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/zipper/order/details': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get Order Details',
			parameters: [
				SE.parameter_query('all Order', 'all', [true, false]),
				SE.parameter_query('approved', 'approved', [true, false]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					reference_order_info_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('John'),
					party_uuid: SE.uuid(),
					party_name: SE.string('John'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('John'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('John'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('John'),
					is_sample: SE.number(0),
					is_bill: SE.number(0),
					is_cash: SE.number(0),
					marketing_priority: SE.string('Urgent'),
					factory_priority: SE.string('FIFO'),
					status: SE.number(0),
					created_by_uuid: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					order_number_wise_rank: SE.number(1),
					order_number_wise_count: SE.number(1),
				}),
			},
		},
	},
	'/zipper/tape-assigned': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get Tape Assigned',
			parameters: [
				SE.parameter_query('type', 'type', [
					'bulk_pending',
					'bulk_completed',
					'sample_pending',
					'sample_completed',
					'bulk_all',
					'sample_all',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_number: SE.string('Z24-0010'),
					item: SE.string('nylon'),
					party_uuid: SE.uuid(),
					party_name: SE.string('John'),
					item_description: SE.string('N-5-OE-SP'),
					item: SE.uuid(),
					item_name: SE.string('nylon'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('3'),
					is_multi_color: SE.number(0),
					tape_coil_uuid: SE.uuid(),
					order_number_wise_rank: SE.number(1),
					order_number_wise_count: SE.number(1),
				}),
			},
		},
	},

	'/zipper/order/details/by/{own_uuid}': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get Order Details by Ownn UUID',
			parameters: [
				SE.parameter_params('own_uuid', 'own_uuid'),
				SE.parameter_query('approved', 'approved', [true, false]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					reference_order_info_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('John'),
					party_uuid: SE.uuid(),
					party_name: SE.string('John'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('John'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('John'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('John'),
					is_sample: SE.number(0),
					is_bill: SE.number(0),
					is_cash: SE.number(0),
					marketing_priority: SE.string('Urgent'),
					factory_priority: SE.string('FIFO'),
					status: SE.number(0),
					created_by_uuid: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					order_number_wise_rank: SE.number(1),
					order_number_wise_count: SE.number(1),
				}),
			},
		},
	},
	'/zipper/order-info/print-in/update/by/{uuid}': {
		put: {
			tags: ['zipper.order_info'],
			summary: 'Update an existing order info print in',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('order info to update', 'uuid')],
			requestBody: SE.requestBody({
				print_in: SE.string('print in'),
			}),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_info'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

const order_description_fields = {
	uuid: SE.uuid(),
	order_info_uuid: SE.uuid(),
	tape_received: SE.number(0),
	multi_color_tape_received: SE.number(0),
	tape_transferred: SE.number(0),
	item: SE.uuid(),
	item_name: SE.string('nylon'),
	item_short_name: SE.string('nylon'),
	zipper_number: SE.uuid(),
	zipper_number_name: SE.string('3'),
	zipper_number_short_name: SE.string('3'),
	end_type: SE.uuid(),
	end_type_name: SE.string('Open End'),
	end_type_short_name: SE.string('OE'),
	lock_type: SE.uuid(),
	lock_type_name: SE.string('Auto Lock'),
	lock_type_short_name: SE.string('AL'),
	puller_type: SE.uuid(),
	puller_type_name: SE.string('Standard'),
	puller_type_short_name: SE.string('S'),
	teeth_color: SE.uuid(),
	teeth_color_name: SE.string('Black'),
	teeth_color_short_name: SE.string('B'),
	teeth_type: SE.uuid(),
	teeth_type_name: SE.string('Standard'),
	teeth_type_short_name: SE.string('S'),
	puller_color: SE.uuid(),
	puller_color_name: SE.string('Black'),
	puller_color_short_name: SE.string('B'),
	special_requirement: SE.string(
		'{"values":"{\\"values\\":[\\"v3c2emB4mU1LV6j\\"]}"}'
	),
	hand: SE.uuid(),
	hand_name: SE.string('Right'),
	hand_short_name: SE.string('R'),
	coloring_type: SE.uuid(),
	coloring_type_name: SE.string('Dyed'),
	coloring_type_short_name: SE.string('D'),
	slider_provided: SE.string('not_provided'),
	slider: SE.uuid(),
	slider_name: SE.string('John'),
	slider_short_name: SE.string('John'),
	top_stopper: SE.uuid(),
	top_stopper_name: SE.string('John'),
	top_stopper_short_name: SE.string('John'),
	bottom_stopper: SE.uuid(),
	bottom_stopper_name: SE.string('John'),
	bottom_stopper_short_name: SE.string('John'),
	logo_type: SE.uuid(),
	logo_type_name: SE.string('John'),
	logo_type_short_name: SE.string('John'),
	is_logo_body: SE.number(0),
	is_logo_puller: SE.number(0),
	description: SE.string('description'),
	status: SE.number(0),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
	remarks: SE.string('Remarks'),
	slider_body_shape: SE.uuid(),
	slider_body_shape_name: SE.string('John'),
	slider_body_shape_short_name: SE.string('John'),
	slider_link: SE.uuid(),
	slider_link_name: SE.string('John'),
	slider_link_short_name: SE.string('John'),
	end_user: SE.uuid(),
	end_user_name: SE.string('John'),
	end_user_short_name: SE.string('John'),
	garment: SE.uuid(),
	light_preference: SE.uuid(),
	light_preference_name: SE.string('John'),
	light_preference_short_name: SE.string('John'),
	garments_wash: SE.uuid(),
	created_by: SE.uuid(),
	created_by_name: SE.string('John Doe'),
	garments_remarks: SE.string('Remarks'),
	slider_finishing_stock: SE.number(0),
	is_inch: SE.number(0),
	order_type: SE.string('full'),
};

const order_description_merge_schema_fields = {
	order_description_uuid: SE.uuid(),
	order_number: SE.string('Z24-0010'),
	order_info_uuid: SE.uuid(),
	tape_received: SE.number(0),
	multi_color_tape_received: SE.number(0),
	tape_transferred: SE.number(0),
	item: SE.uuid(),
	zipper_number: SE.uuid(),
	end_type: SE.uuid(),
	lock_type: SE.uuid(),
	puller_type: SE.uuid(),
	teeth_color: SE.uuid(),
	teeth_type: SE.uuid(),
	puller_color: SE.uuid(),
	special_requirement: SE.string(
		'{"values":"{\\"values\\":[\\"v3c2emB4mU1LV6j\\"]}"}'
	),
	hand: SE.uuid(),
	coloring_type: SE.uuid(),
	slider_provided: SE.string('not_provided'),
	slider: SE.uuid(),
	top_stopper: SE.uuid(),
	bottom_stopper: SE.uuid(),
	logo_type: SE.uuid(),
	is_logo_body: SE.number(0),
	is_logo_puller: SE.number(0),
	description: SE.string('description'),
	status: SE.number(0),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
	remarks: SE.string('Remarks'),
	slider_body_shape: SE.uuid(),
	slider_link: SE.uuid(),
	end_user: SE.uuid(),
	garment: SE.uuid(),
	light_preference: SE.uuid(),
	garments_wash: SE.uuid(),
	created_by: SE.uuid(),
	created_by_name: SE.string('John Doe'),
	garments_remarks: SE.string('Remarks'),
	order_type: SE.string('full'),
};

// * Zipper Order Description * //
export const pathZipperOrderDescription = {
	'/zipper/order-description': {
		get: {
			tags: ['zipper.order_description'],
			summary: 'Get all Order Description',
			responses: {
				200: SE.response_schema(200, order_description_fields),
			},
		},
		post: {
			tags: ['zipper.order_description'],
			summary: 'create a order description',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/order_description'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_description'),
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
			parameters: [SE.parameter_params('GET DATA')],
			responses: {
				200: SE.response_schema(200, order_description_fields),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.order_description'],
			summary: 'Update an existing order description',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('PUT DATA')],
			requestBody: SE.requestBody({
				order_info_uuid: SE.uuid(),
				item: SE.uuid(),
				zipper_number: SE.uuid(),
				end_type: SE.uuid(),
				lock_type: SE.uuid(),
				puller_type: SE.uuid(),
				teeth_color: SE.uuid(),
				puller_color: SE.uuid(),
				teeth_type: SE.uuid(),
				special_requirement: SE.string(
					'{"values":"{\\"values\\":[\\"v3c2emB4mU1LV6j\\"]}"}'
				),
				hand: SE.uuid(),
				coloring_type: SE.uuid(),
				slider_provided: SE.string('not_provided'),
				slider: SE.uuid(),
				top_stopper: SE.uuid(),
				bottom_stopper: SE.uuid(),
				logo_type: SE.uuid(),
				is_logo_body: SE.number(0),
				is_logo_puller: SE.number(0),
				description: SE.string('description'),
				status: SE.number(0),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				remarks: SE.string('Remarks'),
				slider_body_shape: SE.uuid(),
				slider_link: SE.uuid(),
				end_user: SE.uuid(),
				garment: SE.uuid(),
				light_preference: SE.uuid(),
				garments_wash: SE.uuid(),
				created_by: SE.uuid(),
				created_by_name: SE.string('John Doe'),
				garments_remarks: SE.string('Remarks'),
				order_type: SE.string('full'),
			}),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_description'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.order_description'],
			summary: 'Deletes a order description',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('order description to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
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
				SE.parameter_params(
					'orderDescription to get',
					'order_description_uuid'
				),
			],
			responses: {
				200: SE.response_schema(
					200,
					order_description_merge_schema_fields
				),
				400: SE.response(400),
				404: SE.response(404),
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
				SE.parameter_params(
					'orderDescription to get',
					'order_description_uuid'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					...order_description_merge_schema_fields,
					order_entry: SE.sub_response_schema({
						order_entry_uuid: SE.uuid(),
						order_description_uuid: SE.uuid(),
						style: SE.string('style 1'),
						color: SE.string('black'),
						size: SE.number(10),
						is_inch: SE.number(0),
						quantity: SE.number(100),
						company_price: SE.number(10.5),
						party_price: SE.number(10.5),
						status: SE.number(0),
						swatch_status: SE.string('Pending'),
						swatch_approval_date: SE.date_time(),
						created_by: SE.uuid(),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						teeth_molding_stock: SE.number(10),
						teeth_molding_prod: SE.number(10),
						total_teeth_molding: SE.number(10),
						teeth_coloring_stock: SE.number(10),
						teeth_coloring_prod: SE.number(10),
						total_teeth_coloring: SE.number(10),
						finishing_stock: SE.number(10),
						finishing_prod: SE.number(10),
						total_finishing: SE.number(10),
						coloring_prod: SE.number(10),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						index: SE.number(1),
					}),
				}),
				400: SE.response(400),
				404: SE.response(404),
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
				SE.parameter_params('orderDescription to get', 'order_number'),
			],
			responses: {
				200: SE.response_schema(200, {
					...order_description_merge_schema_fields,
					order_entry: SE.sub_response_schema({
						order_entry_uuid: SE.uuid(),
						order_description_uuid: SE.uuid(),
						style: SE.string('style 1'),
						color: SE.string('black'),
						size: SE.number(10),
						is_inch: SE.number(0),
						quantity: SE.number(100),
						company_price: SE.number(10.5),
						party_price: SE.number(10.5),
						status: SE.number(0),
						swatch_status: SE.string('Pending'),
						swatch_approval_date: SE.date_time(),
						created_by: SE.uuid(),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						teeth_molding_stock: SE.number(10),
						teeth_molding_prod: SE.number(10),
						total_teeth_molding: SE.number(10),
						teeth_coloring_stock: SE.number(10),
						teeth_coloring_prod: SE.number(10),
						total_teeth_coloring: SE.number(10),
						finishing_stock: SE.number(10),
						finishing_prod: SE.number(10),
						total_finishing: SE.number(10),
						coloring_prod: SE.number(10),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						index: SE.number(1),
					}),
				}),
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'User not found',
				},
			},
		},
	},
	'/zipper/order/details/single-order/by/{order_number}/marketing/{marketing_uuid}':
		{
			get: {
				tags: ['zipper.order_description'],
				summary:
					'Gets a Order Number to get Order Description and Order Entry',
				description: '',
				// operationId: "deletePet",
				produces: ['application/json'],
				parameters: [
					SE.parameter_params(
						'orderDescription to get',
						'order_number'
					),
					SE.parameter_params(
						'orderDescription to get',
						'marketing_uuid'
					),
				],
				responses: {
					200: SE.response_schema(200, {
						...order_description_merge_schema_fields,
						order_entry: SE.sub_response_schema({
							order_entry_uuid: SE.uuid(),
							order_description_uuid: SE.uuid(),
							style: SE.string('style 1'),
							color: SE.string('black'),
							size: SE.number(10),
							is_inch: SE.number(0),
							quantity: SE.number(100),
							company_price: SE.number(10.5),
							party_price: SE.number(10.5),
							status: SE.number(0),
							swatch_status: SE.string('Pending'),
							swatch_approval_date: SE.date_time(),
							created_by: SE.uuid(),
							created_at: SE.date_time(),
							updated_at: SE.date_time(),
							teeth_molding_stock: SE.number(10),
							teeth_molding_prod: SE.number(10),
							total_teeth_molding: SE.number(10),
							teeth_coloring_stock: SE.number(10),
							teeth_coloring_prod: SE.number(10),
							total_teeth_coloring: SE.number(10),
							finishing_stock: SE.number(10),
							finishing_prod: SE.number(10),
							total_finishing: SE.number(10),
							coloring_prod: SE.number(10),
							created_by: SE.uuid(),
							created_by_name: SE.string('John Doe'),
							index: SE.number(1),
						}),
					}),
					400: {
						description: 'Invalid UUID supplied',
					},
					404: {
						description: 'User not found',
					},
				},
			},
		},
	'/zipper/order/description/update/by/{tape_coil_uuid}': {
		put: {
			tags: ['zipper.order_description'],
			summary: 'Update an existing order description',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'order description to update',
					'tape_coil_uuid'
				),
			],
			requestBody: SE.requestBody({
				order_description_uuid: SE.uuid(),
			}),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_description'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

const order_entry_fields = {
	uuid: SE.uuid(),
	order_description_uuid: SE.uuid(),
	style: SE.string('style 1'),
	color: SE.string('black'),
	size: SE.number(10),
	is_inch: SE.number(0),
	quantity: SE.number(100),
	company_price: SE.number(10.5),
	party_price: SE.number(10.5),
	status: SE.number(0),
	swatch_status: SE.string('Pending'),
	swatch_approval_date: SE.date_time(),
	created_by: SE.uuid(),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
};

const order_entry_merge_schema_fields = {
	order_entry_uuid: SE.uuid(),
	order_description_uuid: SE.uuid(),
	style: SE.string('style 1'),
	color: SE.string('black'),
	size: SE.number(10),
	is_inch: SE.number(0),
	quantity: SE.number(100),
	company_price: SE.number(10.5),
	party_price: SE.number(10.5),
	status: SE.number(0),
	swatch_status: SE.string('Pending'),
	swatch_approval_date: SE.date_time(),
	created_by: SE.uuid(),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
	teeth_molding_stock: SE.number(10),
	teeth_molding_prod: SE.number(10),
	total_teeth_molding: SE.number(10),
	teeth_coloring_stock: SE.number(10),
	teeth_coloring_prod: SE.number(10),
	total_teeth_coloring: SE.number(10),
	finishing_stock: SE.number(10),
	finishing_prod: SE.number(10),
	total_finishing: SE.number(10),
	coloring_prod: SE.number(10),
	index: SE.number(1),
};

// * Zipper Order Entry * //
export const pathZipperOrderEntry = {
	'/zipper/order-entry': {
		get: {
			tags: ['zipper.order_entry'],
			summary: 'Get all Order Entry',
			responses: {
				200: SE.response_schema(200, order_entry_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.order_entry'],
			summary: 'create a order entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/order_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_params('order entry to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, order_entry_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.order_entry'],
			summary: 'Update an existing order entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('order entry to update', 'uuid')],
			requestBody: SE.requestBody({
				order_description_uuid: SE.uuid(),
				style: SE.string('style 1'),
				color: SE.string('black'),
				size: SE.number(10),
				is_inch: SE.number(0),
				quantity: SE.number(100),
				company_price: SE.number(10.5),
				party_price: SE.number(10.5),
				status: SE.number(0),
				swatch_status: SE.string('Pending'),
				swatch_approval_date: SE.date_time(),
				created_by: SE.uuid(),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				teeth_molding_stock: SE.number(10),
				teeth_molding_prod: SE.number(10),
				total_teeth_molding: SE.number(10),
				teeth_coloring_stock: SE.number(10),
				teeth_coloring_prod: SE.number(10),
				total_teeth_coloring: SE.number(10),
				finishing_stock: SE.number(10),
				finishing_prod: SE.number(10),
				total_finishing: SE.number(10),
				coloring_prod: SE.number(10),
			}),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/order_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.order_entry'],
			summary: 'Deletes a order entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('order entry to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_params(
					'orderDescription to get',
					'order_description_uuid'
				),
			],
			responses: {
				200: SE.response_schema(200, order_entry_merge_schema_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

const sfg_extra_fields = {
	uuid: SE.uuid(),
	order_entry_uuid: SE.uuid(),
	order_description_uuid: SE.uuid(),
	order_quantity: SE.number(10),
	recipe_uuid: SE.uuid(),
	recipe_name: SE.string('recipe 1'),
	dying_and_iron_prod: SE.number(10),
	teeth_molding_stock: SE.number(10),
	teeth_molding_prod: SE.number(10),
	teeth_coloring_stock: SE.number(10),
	teeth_coloring_prod: SE.number(10),
	finishing_stock: SE.number(10),
	finishing_prod: SE.number(10),
	coloring_prod: SE.number(10),
	warehouse: SE.number(10),
	delivered: SE.number(10),
	pi: SE.number(10),
	remarks: SE.string('Remarks'),
};

// * Zipper SFG * //
export const pathZipperSfg = {
	'/zipper/sfg': {
		get: {
			tags: ['zipper.sfg'],
			operationId: 'findSfgByRecipeUuid',
			produces: ['application/json', 'application/xml'],
			parameters: [
				SE.parameter_query('recipe_uuid', 'recipe_uuid', [
					'true',
					'false',
				]),
			],
			summary: 'Get all SFG',
			responses: {
				200: SE.response_schema(200, sfg_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.sfg'],
			summary: 'create a sfg',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/sfg'),
			responses: {
				200: SE.response_schema(200, sfg_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_params('SFG to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, sfg_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.sfg'],
			summary: 'Update an existing sfg',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('sfg to update', 'uuid')],
			requestBody: SE.requestBody({
				order_entry_uuid: SE.uuid(),
				order_description_uuid: SE.uuid(),
				order_quantity: SE.number(10),
				recipe_uuid: SE.uuid(),
				recipe_name: SE.string('recipe 1'),
				dying_and_iron_prod: SE.number(10),
				teeth_molding_stock: SE.number(10),
				teeth_molding_prod: SE.number(10),
				teeth_coloring_stock: SE.number(10),
				teeth_coloring_prod: SE.number(10),
				finishing_stock: SE.number(10),
				finishing_prod: SE.number(10),
				coloring_prod: SE.number(10),
				warehouse: SE.number(10),
				delivered: SE.number(10),
				pi: SE.number(10),
				remarks: SE.string('Remarks'),
			}),
			responses: {
				200: SE.response_schema(200, sfg_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.sfg'],
			summary: 'Deletes a sfg',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('sfg to delete', 'uuid')],
			responses: {
				200: SE.response_schema(200, sfg_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/sfg-swatch': {
		get: {
			tags: ['zipper.sfg'],
			summary: 'Get all SFG Swatch Info',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					style: SE.string('style 1'),
					color: SE.string('black'),
					size: SE.number(10),
					quantity: SE.number(100),
					recipe_uuid: SE.uuid(),
					recipe_name: SE.string('recipe 1'),
					remarks: SE.string('Remarks'),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
				}),
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
			parameters: [SE.parameter_params('sfg to update', 'uuid')],
			requestBody: SE.requestBody({
				recipe_uuid: SE.uuid(),
			}),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/sfg'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/sfg/by/{section}': {
		get: {
			tags: ['zipper.sfg'],
			summary: 'Get all SFG by section',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'sfg to update',
					'section',
					'string',
					'teeth_molding'
				),
				SE.parameter_query('item_name', 'item_name', [
					'nylon',
					'metal',
					'vislon',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					sfg_uuid: SE.uuid(),
					order_entry_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					order_description_uuid: SE.uuid(),
					style: SE.string('style 1'),
					color: SE.string('black'),
					size: SE.number(10),
					style_color_size: SE.string('style 1 - black - 10'),
					order_quantity: SE.number(100),
					recipe_uuid: SE.uuid(),
					recipe_name: SE.string('recipe 1'),
					item: SE.uuid(),
					item_name: SE.string('nylon'),
					item_short_name: SE.string('n'),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('Dyed'),
					coloring_type_short_name: SE.string('D'),
					dying_and_iron_prod: SE.number(10),
					teeth_molding_stock: SE.number(10),
					teeth_molding_prod: SE.number(10),
					teeth_coloring_stock: SE.number(10),
					teeth_coloring_prod: SE.number(10),
					finishing_stock: SE.number(10),
					finishing_prod: SE.number(10),
					coloring_prod: SE.number(10),
					warehouse: SE.number(10),
					delivered: SE.number(10),
					pi: SE.number(10),
					remarks: SE.string('Remarks'),
					balance_quantity: SE.number(10),
					total_trx_quantity: SE.number(10),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Finishing Batch Production* //
export const pathZipperFinishingBatchProduction = {
	'/zipper/finishing-batch-production': {
		get: {
			tags: ['zipper.finishing_batch_production'],
			summary: 'Get all Finishing Batch  Production',
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_production'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.finishing_batch_production'],
			summary: 'create a Finishing Batch  production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref(
				'zipper/finishing_batch_production'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_production'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/finishing-batch-production/{uuid}': {
		get: {
			tags: ['zipper.finishing_batch_production'],
			summary: 'Gets a Finishing Batch  Production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('SFG Production to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_production'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.finishing_batch_production'],
			summary: 'Update an existing Finishing Batch  production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('sfg production to update', 'uuid'),
			],
			requestBody: SE.requestBody({
				finishing_batch_entry_uuid: SE.uuid(),
				section: SE.string('section 1'),
				production_quantity_in_kg: SE.number(10),
				production_quantity: SE.number(10),
				wastage: SE.number(10),
				created_by: SE.uuid(),
				created_by_name: SE.string('John Doe'),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				remarks: SE.string('Remarks'),
			}),
			responses: {
				200: SE.requestBody_schema_ref(
					200,
					'zipper/finishing_batch_production'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.finishing_batch_production'],
			summary: 'Deletes a Finishing Batch production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('sfg production to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/finishing-batch-production/by/{section}': {
		get: {
			tags: ['zipper.finishing_batch_production'],
			summary: 'Get all Finishing Batch Production by section',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'sfg production to update',
					'section',
					'string',
					'teeth_molding'
				),
				SE.parameter_query('item_name', 'item_name', [
					'nylon',
					'metal',
					'vislon',
				]),
				SE.parameter_query('nylon_stopper', 'string', [
					'plastic',
					'metallic',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					style_color_size: SE.string('style 1 - black - 10'),
					order_quantity: SE.number(100),
					section: SE.string('teeth_molding'),
					production_quantity: SE.number(10),
					production_quantity_in_kg: SE.number(10),
					wastage: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Finishing Batch Transaction * //
export const pathZipperFinishingBatchTransaction = {
	'/zipper/finishing-batch-transaction': {
		get: {
			tags: ['zipper.finishing_batch_transaction'],
			summary: 'Get all finishing batch Transaction',
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.finishing_batch_transaction'],
			summary: 'create a finishing batch transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref(
				'zipper/finishing_batch_transaction'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/finishing-batch-transaction/{uuid}': {
		get: {
			tags: ['zipper.finishing_batch_transaction'],
			summary: 'Gets a finishing batch Transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('SFG Transaction to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.finishing_batch_transaction'],
			summary: 'Update an existing sfg transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('sfg transaction to update', 'uuid'),
			],
			requestBody: SE.requestBody({
				sfg_uuid: SE.uuid(),
				trx_from: SE.string('trx from'),
				trx_to: SE.string('trx to'),
				trx_quantity: SE.number(10),
				slider_item_uuid: SE.uuid(),
				created_by: SE.uuid(),
				created_by_name: SE.string('John Doe'),
				remarks: SE.string('Remarks'),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
			}),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.finishing_batch_transaction'],
			summary: 'Deletes a finishing batch transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('sfg transaction to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/finishing-batch-transaction/by/{trx_from}': {
		get: {
			tags: ['zipper.finishing_batch_transaction'],
			summary: 'Get all finishing batch Transaction by trx_from',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'sfg transaction to update',
					'trx_from',
					'string',
					'teeth_molding_prod'
				),
				SE.parameter_query('item_name', 'item_name', [
					'nylon',
					'metal',
					'vislon',
				]),
				SE.parameter_query('nylon_stopper', 'string', [
					'plastic',
					'metallic',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					style_color_size: SE.string('style 1 - black - 10'),
					order_quantity: SE.number(100),
					trx_from: SE.string('teeth_molding_prod'),
					trx_to: SE.string('teeth_coloring_stock'),
					trx_quantity: SE.number(10),
					trx_quantity_in_kg: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Dyed Tape Transaction * //
export const pathZipperDyedTapeTransaction = {
	'/zipper/dyed-tape-transaction': {
		get: {
			tags: ['zipper.dyed_tape_transaction'],
			summary: 'Get all Dyed Tape Transaction',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					colors: SE.string('colors'),
					section: SE.string('section'),
					trx_quantity: SE.number('10.0'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.dyed_tape_transaction'],
			summary: 'create a dyed tape transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref(
				'zipper/dyed_tape_transaction'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/dyed_tape_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyed-tape-transaction/{uuid}': {
		get: {
			tags: ['zipper.dyed_tape_transaction'],
			summary: 'Gets a Dyed Tape Transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Dyed Tape Transaction to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					colors: SE.string('colors'),
					section: SE.string('section'),
					trx_quantity: SE.number('10.0'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.dyed_tape_transaction'],
			summary: 'Update an existing dyed tape transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('dyed tape transaction to update', 'uuid'),
			],
			requestBody: SE.requestBody({
				order_description_uuid: SE.uuid(),
				colors: SE.string('colors'),
				section: SE.string('section'),
				trx_quantity: SE.number('10.0'),
				created_by: SE.uuid(),
				created_by_name: SE.string('John Doe'),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				remarks: SE.string('remarks'),
			}),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/dyed_tape_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dyed_tape_transaction'],
			summary: 'Deletes a dyed tape transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('dyed tape transaction to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyed-tape-transaction/by/{item_name}': {
		get: {
			tags: ['zipper.dyed_tape_transaction'],
			summary: 'Get all Dyed Tape Transaction by section',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'dyed tape transaction to update',
					'item_name',
					'string',
					'nylon'
				),
				SE.parameter_query('nylon_stopper', 'nylon_stopper', [
					'plastic',
					'metallic',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-SP'),
					colors: SE.string('colors'),
					section: SE.string('section'),
					trx_quantity: SE.number('10.0'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Dyed Tape Transaction From Stock * //

export const pathZipperDyedTapeTransactionFromStock = {
	'/zipper/dyed-tape-transaction-from-stock': {
		get: {
			tags: ['zipper.dyed_tape_transaction_from_stock'],
			summary: 'Get all Dyed Tape Transaction From Stock',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					trx_quantity: SE.number('10.0'),
					tape_coil_uuid: SE.uuid(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.dyed_tape_transaction_from_stock'],
			summary: 'create a dyed tape transaction from stock',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref(
				'zipper/dyed_tape_transaction_from_stock'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/dyed_tape_transaction_from_stock'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyed-tape-transaction-from-stock/{uuid}': {
		get: {
			tags: ['zipper.dyed_tape_transaction_from_stock'],
			summary: 'Gets a Dyed Tape Transaction From Stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Dyed Tape Transaction From Stock to get',
					'uuid'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					trx_quantity: SE.number('10.0'),
					tape_coil_uuid: SE.uuid(),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.dyed_tape_transaction_from_stock'],
			summary: 'Update an existing dyed tape transaction from stock',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'dyed tape transaction from stock to update',
					'uuid'
				),
			],
			requestBody: SE.requestBody({
				order_description_uuid: SE.uuid(),
				trx_quantity: SE.number('10.0'),
				tape_coil_uuid: SE.uuid(),
				created_by: SE.uuid(),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				remarks: SE.string('remarks'),
			}),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/dyed_tape_transaction_from_stock'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dyed_tape_transaction_from_stock'],
			summary: 'Deletes a dyed tape transaction from stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'dyed tape transaction from stock to delete',
					'uuid'
				),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Batch * //
export const pathZipperDyeingBatch = {
	'/zipper/dyeing-batch': {
		get: {
			tags: ['zipper.dyeing_batch'],
			summary: 'Get all Dyeing Batch',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_id: SE.string('Z24-0010'),
					batch_status: SE.string('Pending'),
					machine_uuid: SE.uuid(),
					machine_name: SE.string('Machine 1'),
					slot: SE.number(1),
					received: SE.number(0),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.dyeing_batch'],
			summary: 'create a dyeing batch',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/dyeing_batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dyeing_batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyeing-batch/{uuid}': {
		get: {
			tags: ['zipper.dyeing_batch'],
			summary: 'Gets a Dyeing Batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('dyeing batch to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_id: SE.string('Z24-0010'),
					batch_status: SE.string('Pending'),
					machine_uuid: SE.uuid(),
					machine_name: SE.string('Machine 1'),
					slot: SE.number(1),
					received: SE.number(0),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.dyeing_batch'],
			summary: 'Update an existing dyeing batch',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('batch to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/dyeing_batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dyeing_batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dyeing_batch'],
			summary: 'Deletes a dyeing batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('batch to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyeing-batch-details/{dyeing_batch_uuid}': {
		get: {
			tags: ['zipper.dyeing_batch'],
			summary: 'Get a Dyeing Batch by Dyeing Batch UUID',
			description: '',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('batch to get', 'dyeing_batch_uuid'),
				SE.parameter_query('is_update', 'is_update', ['true', 'false']),
				SE.parameter_query('type', 'type', ['sample', 'bulk', 'all']),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_id: SE.string('Z24-0010'),
					batch_status: SE.string('Pending'),
					machine_uuid: SE.uuid(),
					machine_name: SE.string('Machine 1'),
					slot: SE.number(1),
					received: SE.number(0),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
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
};

// * Zipper Batch Entry * //
export const pathZipperDyeingBatchEntry = {
	'/zipper/dyeing-batch-entry': {
		get: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'Get all Dyeing Batch Entry',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_id: SE.string('Z24-0010'),
					batch_status: SE.string('Pending'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
			},
		},
		post: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'create a dyeing batch entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/dyeing_batch_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dyeing_batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyeing-batch-entry/{uuid}': {
		get: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'Gets a Dyeing Batch Entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('dyeing batch entry to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					batch_id: SE.string('Z24-0010'),
					batch_status: SE.string('Pending'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'Update an existing dyeing batch entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('batch entry to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/dyeing_batch_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dyeing_batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'Deletes a dyeing batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('batch entry to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyeing-batch-entry/by/dyeing-batch-uuid/{dyeing_batch_uuid}': {
		get: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'Get a Dyeing Batch Entry by Dyeing Batch Entry UUID',
			description: '',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('batch entry to get', 'dyeing_batch_uuid'),
				SE.parameter_query('type', 'type', ['sample', 'bulk', 'all']),
			],
			responses: {
				200: SE.response_schema(200, {
					dyeing_batch_entry_uuid: SE.uuid(),
					dyeing_batch_uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					quantity: SE.number(10),
					production_quantity: SE.number(10),
					production_quantity_in_kg: SE.number(10),
					remarks: SE.string('Remarks'),
					style: SE.string('style 1'),
					color: SE.string('black'),
					size: SE.number(10),
					order_quantity: SE.number(10),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-RP'),
					given_quantity: SE.number(10),
					given_production_quantity: SE.number(10),
					given_production_quantity_in_kg: SE.number(10),
					balance_quantity: SE.number(10),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyeing-order-batch': {
		get: {
			tags: ['zipper.dyeing_batch_entry'],
			summary: 'Get Order Details for Dyeing Batch Entry',
			description: '',
			produces: ['application/json'],
			parameters: [
				SE.parameter_query('batch_type', 'batch_type', [
					'normal',
					'extra',
				]),
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					'uuid'
				),
				SE.parameter_query('type', 'type', ['sample', 'bulk', 'all']),
			],
			responses: {
				200: SE.response_schema(200, {
					order_entry: SE.sub_response_schema({
						sfg_uuid: SE.uuid(),
						style: SE.string('style 1'),
						color: SE.string('black'),
						size: SE.number(10),
						order_quantity: SE.number(10),
						order_number: SE.string('Z24-0010'),
						item_description: SE.string('N-5-OE-RP'),
						given_quantity: SE.number(10),
						given_production_quantity: SE.number(10),
						given_production_quantity_in_kg: SE.number(10),
					}),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Tape Coil * //
export const pathZipperTapeCoil = {
	'/zipper/tape-coil': {
		get: {
			tags: ['zipper.tape_coil'],
			summary: 'Get all Tape Coil',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					zipper_number_uuid: SE.uuid(),
					name: SE.string('nylon'),
					is_import: SE.boolean(),
					is_reverse: SE.boolean(),
					raw_per_kg_meter: SE.number(10),
					dyed_per_kg_meter: SE.number(10),
					quantity: SE.number(10),
					trx_quantity_in_dying: SE.number(10),
					stock_quantity: SE.number(10),
					trx_quantity_in_coil: SE.number(10),
					quantity_in_coil: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['zipper.tape_coil'],
			summary: 'create a tape coil',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/tape_coil'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_params('tape coil to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					zipper_number_uuid: SE.uuid(),
					name: SE.string('nylon'),
					is_import: SE.boolean(),
					is_reverse: SE.boolean(),
					raw_per_kg_meter: SE.number(10),
					dyed_per_kg_meter: SE.number(10),
					quantity: SE.number(10),
					trx_quantity_in_dying: SE.number(10),
					stock_quantity: SE.number(10),
					trx_quantity_in_coil: SE.number(10),
					quantity_in_coil: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.tape_coil'],
			summary: 'Update an existing tape coil',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('tape coil to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/tape_coil'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.tape_coil'],
			summary: 'Deletes a tape coil',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('tape coil to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/tape-coil/by/nylon': {
		get: {
			tags: ['zipper.tape_coil'],
			summary: 'Get all Tape Coil by Nylon',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					item_uuid: SE.uuid(),
					zipper_number_uuid: SE.uuid(),
					name: SE.string('nylon'),
					is_import: SE.boolean(),
					is_reverse: SE.boolean(),
					raw_per_kg_meter: SE.number(10),
					dyed_per_kg_meter: SE.number(10),
					quantity: SE.number(10),
					trx_quantity_in_dying: SE.number(10),
					stock_quantity: SE.number(10),
					trx_quantity_in_coil: SE.number(10),
					quantity_in_coil: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
	},
};

// * Zipper Tape Coil Production * //
export const pathZipperTapeCoilProduction = {
	'/zipper/tape-coil-production': {
		get: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Get all Tape Coil Production',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					section: SE.string('zipper'),
					tape_coil_uuid: SE.uuid(),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					zipper_number_uuid: SE.uuid(),
					zipper_number_name: SE.string('nylon 3'),
					type_of_zipper: SE.string('nylon 3'),
					quantity: SE.number(10),
					trx_quantity_in_coil: SE.number(10),
					quantity_in_coil: SE.number(10),
					production_quantity: SE.number(10),
					wastage: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Good'),
				}),
			},
		},
		post: {
			tags: ['zipper.tape_coil_production'],
			summary: 'create a tape coil production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref(
				'zipper/tape_coil_production'
			),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil_production'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_params('tape coil production to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					section: SE.string('zipper'),
					tape_coil_uuid: SE.uuid(),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					zipper_number_uuid: SE.uuid(),
					zipper_number_name: SE.string('nylon 3'),
					type_of_zipper: SE.string('nylon 3'),
					quantity: SE.number(10),
					trx_quantity_in_coil: SE.number(10),
					quantity_in_coil: SE.number(10),
					production_quantity: SE.number(10),
					wastage: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Good'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_params('tape coil production to update', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref(
				'zipper/tape_coil_production'
			),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil_production'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Deletes a tape coil production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil production to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/tape-coil-production/by/{section}': {
		get: {
			tags: ['zipper.tape_coil_production'],
			summary: 'Get all Tape Coil Production by Section',
			parameters: [
				SE.parameter_params(
					'tape coil production to get',
					'section',
					'string'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					section: SE.string('zipper'),
					tape_coil_uuid: SE.uuid(),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					zipper_number_uuid: SE.uuid(),
					zipper_number_name: SE.string('nylon 3'),
					type_of_zipper: SE.string('nylon 3'),
					quantity: SE.number(10),
					trx_quantity_in_coil: SE.number(10),
					quantity_in_coil: SE.number(10),
					production_quantity: SE.number(10),
					wastage: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Good'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Tape To Coil * //
export const pathZipperTapeTrx = {
	'/zipper/tape-trx': {
		get: {
			tags: ['zipper.tape_trx'],
			summary: 'Get all Tape Trx',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('nylon 3'),
					to_section: SE.string('zipper'),
					trx_quantity: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.tape_trx'],
			summary: 'create a tape trx',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/tape_trx'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_trx'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/tape-trx/{uuid}': {
		get: {
			tags: ['zipper.tape_trx'],
			summary: 'Gets a Tape Trx',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('tape trx to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('nylon 3'),
					to_section: SE.string('zipper'),
					trx_quantity: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.tape_trx'],
			summary: 'Update an existing tape trx',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('tape trx to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/tape_trx'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_trx'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.tape_trx'],
			summary: 'Deletes a tape trx',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('tape trx to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/tape-trx/by/{section}': {
		get: {
			tags: ['zipper.tape_trx'],
			summary: 'Get all Tape Trx by Section',
			parameters: [
				SE.parameter_params('tape trx to get', 'section', 'string'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('nylon 3'),
					to_section: SE.string('zipper'),
					trx_quantity: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Tape Coil Required * //

export const pathZipperTapeCoilRequired = {
	'/zipper/tape-coil-required': {
		get: {
			tags: ['zipper.tape_coil_required'],
			summary: 'Get all Tape Coil Required',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					end_type_uuid: SE.uuid(),
					end_type_name: SE.string('End Type'),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					nylon_stopper_uuid: SE.uuid(),
					nylon_stopper_name: SE.string('nylon stopper'),
					zipper_number_uuid: SE.uuid(),
					zipper_number_name: SE.string('nylon 3'),
					top: SE.number(10),
					bottom: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.tape_coil_required'],
			summary: 'create a tape coil required',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/tape_coil_required'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil_required'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/tape-coil-required/{uuid}': {
		get: {
			tags: ['zipper.tape_coil_required'],
			summary: 'Gets a Tape Coil Required',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil required to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					end_type_uuid: SE.uuid(),
					end_type_name: SE.string('End Type'),
					item_uuid: SE.uuid(),
					item_name: SE.string('nylon'),
					nylon_stopper_uuid: SE.uuid(),
					nylon_stopper_name: SE.string('nylon stopper'),
					zipper_number_uuid: SE.uuid(),
					zipper_number_name: SE.string('nylon 3'),
					top: SE.number(10),
					bottom: SE.number(10),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.tape_coil_required'],
			summary: 'Update an existing tape coil required',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil required to update', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('zipper/tape_coil_required'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil_required'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.tape_coil_required'],
			summary: 'Deletes a tape coil required',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil required to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Planning * //
export const pathZipperPlanning = {
	'/zipper/planning': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning',
			responses: {
				200: SE.response_schema(200, {
					week: SE.string('24-32'),
					week_id: SE.string('DP-24-W32'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.planning'],
			summary: 'create a planning',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/planning'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/planning'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_params('planning to get', 'week', 'string'),
			],
			responses: {
				200: SE.response_schema(200, {
					week: SE.string('24-32'),
					week_id: SE.string('DP-24-W32'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_params('planning to update', 'week', 'string'),
			],
			requestBody: SE.requestBody_schema_ref('zipper/planning'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/planning'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.planning'],
			summary: 'Deletes a planning',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('planning to delete', 'week', 'string'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/planning-details/by/{planning_week}': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning and Planning Entry by Planning UUID',
			parameters: [
				SE.parameter_params(
					'planning to get',
					'planning_week',
					'string',
					'24-33'
				),
			],
			responses: {
				200: SE.response(200, {
					week: SE.string('24-32'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					planning_entry: SE.sub_response_schema({
						uuid: SE.uuid(),
						planning_week: SE.string('24-32'),
						sfg_uuid: SE.uuid(),
						sno_quantity: SE.number(100),
						factory_quantity: SE.number(100),
						production_quantity: SE.number(100),
						batch_production_quantity: SE.number(100),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						sno_remarks: SE.string('Remarks'),
						factory_remarks: SE.string('Remarks'),
						style: SE.string('style 1'),
						color: SE.string('black'),
						size: SE.number(10),
						order_quantity: SE.number(10),
						order_number: SE.string('Z24-0010'),
						item_description: SE.string('N-5-OE-RP'),
					}),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Planning Entry * //
export const pathZipperPlanningEntry = {
	'/zipper/planning-entry': {
		get: {
			tags: ['zipper.planning_entry'],
			summary: 'Get all Planning',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					planning_week: SE.string('24-32'),
					sfg_uuid: SE.uuid(),
					sno_quantity: SE.number(10),
					factory_quantity: SE.number(10),
					production_quantity: SE.number(10),
					batch_production_quantity: SE.number(10),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					sno_remarks: SE.string('Remarks'),
					factory_remarks: SE.string('Remarks'),
					style: SE.string('style 1'),
					color: SE.string('black'),
					size: SE.number(10),
					order_quantity: SE.number(10),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-RP'),
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			requestBody: SE.requestBody_schema_ref('zipper/planning_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/planning_entry'),
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
			parameters: [SE.parameter_params('planning entry to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					planning_week: SE.string('24-32'),
					sfg_uuid: SE.uuid(),
					sno_quantity: SE.number(10),
					factory_quantity: SE.number(10),
					production_quantity: SE.number(10),
					batch_production_quantity: SE.number(10),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					sno_remarks: SE.string('Remarks'),
					factory_remarks: SE.string('Remarks'),
					style: SE.string('style 1'),
					color: SE.string('black'),
					size: SE.number(10),
					order_quantity: SE.number(10),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-RP'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.planning_entry'],
			summary: 'Update an existing planning_entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('planning entry to get', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/planning_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/planning_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.planning_entry'],
			summary: 'Deletes a planning_entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('planning entry to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/zipper/planning-entry/by/{planning_week}': {
		get: {
			tags: ['zipper.planning_entry'],
			summary: 'Get all Planning Entry by Planning UUID',
			parameters: [
				SE.parameter_params(
					'planning entry to get',
					'planning_week',
					'string',
					'24-33'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					planning_week: SE.string('24-32'),
					sfg_uuid: SE.uuid(),
					sno_quantity: SE.number(100),
					factory_quantity: SE.number(100),
					production_quantity: SE.number(100),
					batch_production_quantity: SE.number(100),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					sno_remarks: SE.string('remarks'),
					factory_remarks: SE.string('remarks'),
					style: SE.string('style 1'),
					color: SE.string('Red'),
					size: SE.number(100),
					order_quantity: SE.number(100),
					order_number: SE.string('Z24-0010'),
					item_description: SE.string('N-5-OE-RP'),
					given_sno_quantity: SE.number(100),
					given_factory_quantity: SE.number(100),
					given_production_quantity: SE.number(100),
					given_batch_production_quantity: SE.number(100),
					balance_sno_quantity: SE.number(100),
					balance_factory_quantity: SE.number(100),
					balance_production_quantity: SE.number(100),
					balance_batch_production_quantity: SE.number(100),
					max_sno_quantity: SE.number(100),
					max_factory_quantity: SE.number(100),
					max_production_quantity: SE.number(100),
					max_batch_production_quantity: SE.number(100),
				}),
			},
		},
	},
	'/zipper/order-planning': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Order Planning',
			responses: {
				200: SE.response_schema(200, {
					sfg_uuid: SE.uuid(),
					style: SE.string('style - 1'),
					color: SE.string('red'),
					size: SE.number(100),
					order_quantity: SE.number(100),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					given_sno_quantity: SE.number(100),
					given_factory_quantity: SE.number(100),
					given_production_quantity: SE.number(100),
					given_batch_production_quantity: SE.number(100),
					balance_sno_quantity: SE.number(100),
					balance_factory_quantity: SE.number(100),
					balance_production_quantity: SE.number(100),
					balance_batch_production_quantity: SE.number(100),
				}),
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
			requestBody: SE.requestBody({
				uuid: SE.uuid(),
				planning_week: SE.string('24-32'),
				sfg_uuid: SE.uuid(),
				factory_quantity: SE.number(100),
				production_quantity: SE.number(100),
				batch_production_quantity: SE.number(100),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				sno_remarks: SE.string('remarks'),
				factory_remarks: SE.string('remarks'),
			}),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/planning_entry'),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Material Trx Against Order Description * //
export const pathZipperMaterialTrxAgainstOrderDescription = {
	'/zipper/material-trx-against-order': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Get all Material Trx',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					stock: SE.number(100),
					item_description: SE.string('N-3-OE-SP'),
					material_uuid: SE.uuid(),
					material_name: SE.string('Material 1'),
					trx_quantity: SE.number(100),
					trx_to: SE.string('teeth_molding'),
					remarks: SE.string('Remarks'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					booking_uuid: SE.uuid(),
					booking_number: SE.string('MB24-0001'),
				}),
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
			requestBody: SE.requestBody_schema_ref(
				'zipper/material_trx_against_order_description'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/material_trx_against_order_description'
				),
				405: SE.response(405),
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
			parameters: [SE.parameter_params('material trx to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					stock: SE.number(100),
					material_uuid: SE.uuid(),
					material_name: SE.string('Material 1'),
					trx_quantity: SE.number(100),
					trx_to: SE.string('teeth_molding'),
					remarks: SE.string('Remarks'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					booking_uuid: SE.uuid(),
					booking_number: SE.string('MB24-0001'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Update an existing material trx',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('material trx to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref(
				'zipper/material_trx_against_order_description'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/material_trx_against_order_description'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Deletes a material trx',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('material trx to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/zipper/material-trx-against-order/by/{trx_to}': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Get all Material Trx by trx_to',
			parameters: [SE.parameter_params('material trx to get', 'trx_to')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					stock: SE.number(100),
					item_description: SE.string('N-3-OE-SP'),
					material_uuid: SE.uuid(),
					material_name: SE.string('Material 1'),
					trx_quantity: SE.number(100),
					trx_to: SE.string('teeth_molding'),
					remarks: SE.string('Remarks'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					booking_uuid: SE.uuid(),
					booking_number: SE.string('MB24-0001'),
				}),
			},
		},
	},
	'/zipper/material-trx-against-order/multiple/by/{trx_tos}': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Get all Material Trx by trx_to',
			parameters: [
				SE.parameter_params(
					'material trx to get',
					'trx_tos',
					'string',
					'teeth_molding,teeth_color'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					stock: SE.number(100),
					item_description: SE.string('N-3-OE-SP'),
					material_uuid: SE.uuid(),
					material_name: SE.string('Material 1'),
					trx_quantity: SE.number(100),
					trx_to: SE.string('teeth_molding'),
					remarks: SE.string('Remarks'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					booking_uuid: SE.uuid(),
					booking_number: SE.string('MB24-0001'),
				}),
			},
		},
	},
};

// * Zipper Tape Coil To Dyeing * //
export const pathZipperTapeCoilToDyeing = {
	'/zipper/tape-coil-to-dyeing': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Get all Tape Coil To Dyeing',
			parameters: [
				SE.parameter_query('multi_color_tape', 'multi_color_tape', [
					'true',
					'false',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					trx_quantity: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					type: SE.string('Nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('Nylon 3'),
				}),
			},
		},

		post: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'create a tape coil to dyeing',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'zipper/tape_coil_to_dyeing'
			),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil_to_dyeing'),
				405: SE.response(405),
			},
		},
	},
	'/zipper/tape-coil-to-dyeing/{uuid}': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Gets a tape coil to dyeing',
			description: '',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil to dyeing to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					trx_quantity: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					type: SE.string('Nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('Nylon 3'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},

		put: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Update an existing tape coil to dyeing',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil to dyeing to update', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref(
				'zipper/tape_coil_to_dyeing'
			),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil_to_dyeing'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Deletes a tape coil to dyeing',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('tape coil to dyeing to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/zipper/tape-coil-to-dyeing/by/type/nylon': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Get all Tape Coil To Dyeing by type nylon',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					trx_quantity: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					type: SE.string('Nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('Nylon 3'),
				}),
			},
		},
	},
	'/zipper/tape-coil-to-dyeing/by/type/tape': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Get all Tape Coil To Dyeing by type tape',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					trx_quantity: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					type: SE.string('Tape'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('Tape 3'),
				}),
			},
		},
	},
};

// * Zipper Batch Production * //

export const pathZipperDyeingBatchProduction = {
	'/zipper/dyeing-batch-production': {
		get: {
			tags: ['zipper.dyeing_batch_production'],
			summary: 'Get all Dyeing Batch Production',
			responses: {
				200: {
					uuid: SE.uuid(),
					dyeing_batch_entry_uuid: SE.uuid(),
					production_quantity: SE.number(100),
					production_quantity_in_kg: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				},
			},
		},
		post: {
			tags: ['zipper.dyeing_batch_production'],
			summary: 'create a batch production',
			description: '',
			// operationId: "add
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'zipper/dyeing_batch_production'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/dyeing_batch_production'
				),
				405: SE.response(405),
			},
		},
	},
	'/zipper/dyeing-batch-production/{uuid}': {
		get: {
			tags: ['zipper.dyeing_batch_production'],
			summary: 'Gets a dyeing batch production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('dyeing batch production to get', 'uuid'),
			],
			responses: {
				200: {
					uuid: SE.uuid(),
					dyeing_batch_entry_uuid: SE.uuid(),
					production_quantity: SE.number(100),
					production_quantity_in_kg: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				},
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.dyeing_batch_production'],
			summary: 'Update an existing dyeing batch production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_schema_ref(
					'dyeing batch production to update',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'zipper/dyeing_batch_production'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/dyeing_batch_production'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dyeing_batch_production'],
			summary: 'Deletes a dyeing batch production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('batch production to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Zipper Multi  Color Dashboard * //

export const pathMultiColorDashboard = {
	'/zipper/multi-color-dashboard': {
		get: {
			tags: ['zipper.multi_color_dashboard'],
			summary: 'Get all Multi Color Dashboard',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					expected_tape_quantity: SE.number(100),
					production_quantity_in_kg: SE.number(100),
					is_swatch_approved: SE.integer(0),
					tape_quantity: SE.number(100),
					coil_uuid: SE.uuid(),
					coil_name: SE.string('Coil 1'),
					coil_quantity: SE.number(100),
					thread_name: SE.string('Thread 1'),
					thread_quantity: SE.number(100),
					is_coil_received_sewing: SE.integer(0),
					is_thread_received_sewing: SE.integer(0),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['zipper.multi_color_dashboard'],
			summary: 'create a multi color dashboard',
			description: '',
			// operationId: "add
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'zipper/multi_color_dashboard'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/multi_color_dashboard'
				),
				405: SE.response(405),
			},
		},
	},

	'/zipper/multi-color-dashboard/{uuid}': {
		get: {
			tags: ['zipper.multi_color_dashboard'],
			summary: 'Gets a multi color dashboard',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('multi color dashboard to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					expected_tape_quantity: SE.number(100),
					production_quantity_in_kg: SE.number(100),
					is_swatch_approved: SE.integer(0),
					tape_quantity: SE.number(100),
					coil_uuid: SE.uuid(),
					coil_name: SE.string('Coil 1'),
					coil_quantity: SE.number(100),
					thread_name: SE.string('Thread 1'),
					thread_quantity: SE.number(100),
					is_coil_received_sewing: SE.integer(0),
					is_thread_received_sewing: SE.integer(0),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.multi_color_dashboard'],
			summary: 'Update an existing multi color dashboard',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_schema_ref(
					'multi color dashboard to update',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'zipper/multi_color_dashboard'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/multi_color_dashboard'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.multi_color_dashboard'],
			summary: 'Deletes a multi color dashboard',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('multi color dashboard to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Zipper Multi Color Tape Receive * //

export const pathZipperMultiColorTapeReceive = {
	'/zipper/multi-color-tape-receive': {
		get: {
			tags: ['zipper.multi_color_tape_receive'],
			summary: 'Get all Multi Color Tape Receive',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					quantity: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),

				400: SE.response(400),
				404: SE.response(404),
			},
		},
		post: {
			tags: ['zipper.multi_color_tape_receive'],
			summary: 'create a multi color tape receive',
			description: '',
			// operationId: "add
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'zipper/multi_color_tape_receive'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/multi_color_tape_receive'
				),
				405: SE.response(405),
			},
		},
	},

	'/zipper/multi-color-tape-receive/{uuid}': {
		get: {
			tags: ['zipper.multi_color_tape_receive'],
			summary: 'Gets a multi color tape receive',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('multi color tape receive to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					quantity: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},

		put: {
			tags: ['zipper.multi_color_tape_receive'],
			summary: 'Update an existing multi color tape receive',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_schema_ref(
					'multi color tape receive to update',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'zipper/multi_color_tape_receive'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/multi_color_tape_receive'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},

		delete: {
			tags: ['zipper.multi_color_tape_receive'],
			summary: 'Deletes a multi color tape receive',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'multi color tape receive to delete',
					'uuid'
				),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

export const pathZipperFinishingBatch = {
	'/zipper/finishing-batch': {
		get: {
			tags: ['zipper.finishing_batch'],
			summary: 'Get all Finishing Batch',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.string('1'),
					order_description_uuid: SE.uuid(),
					slider_lead_time: SE.number(100),
					dyeing_lead_time: SE.number(100),
					status: SE.string('pending'),
					slider_finishing_stock: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['zipper.finishing_batch'],
			summary: 'create a finishing batch',
			description: '',
			// operationId: "add
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref('zipper/finishing_batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/finishing_batch'),
				405: SE.response(405),
			},
		},
	},
	'/zipper/finishing-batch/{uuid}': {
		get: {
			tags: ['zipper.finishing_batch'],
			summary: 'Gets a finishing batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('finishing batch to get', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.string('1'),
					order_description_uuid: SE.uuid(),
					slider_lead_time: SE.number(100),
					dyeing_lead_time: SE.number(100),
					status: SE.string('pending'),
					slider_finishing_stock: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.finishing_batch'],
			summary: 'Update an existing finishing batch',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_schema_ref(
					'finishing batch to update',
					'uuid',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref('zipper/finishing_batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/finishing_batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.finishing_batch'],
			summary: 'Deletes a finishing batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('finishing batch to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/zipper/finishing-batch/by/finishing_batch_uuid/{finishing_batch_uuid}': {
		get: {
			tags: ['zipper.finishing_batch'],
			summary: 'Get all Finishing Batch by finishing batch uuid',
			parameters: [
				SE.parameter_params(
					'finishing batch to get',
					'finishing_batch_uuid'
				),
				SE.parameter_query('is_update', 'is_update', ['true', 'false']),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.string('1'),
					order_description_uuid: SE.uuid(),
					slider_lead_time: SE.number(100),
					dyeing_lead_time: SE.number(100),
					status: SE.string('pending'),
					slider_finishing_stock: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
	},
	'/zipper/finishing-batch-capacity-details': {
		get: {
			tags: ['zipper.finishing_batch'],
			summary: 'Get all Finishing Batch Capacity Details',
			parameters: [
				SE.parameter_query('from_date', 'from_date', ['2024-01-01']),
				SE.parameter_query('to_date', 'to_date', ['2024-01-01']),
			],

			responses: {
				200: SE.response_schema(200, {
					finishing_batch_uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),

					slider_lead_time: SE.number(100),
					dyeing_lead_time: SE.number(100),
					status: SE.string('pending'),
					slider_finishing_stock: SE.number(100),
					created_by: SE.uuid(),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					item: SE.uuid(),
					item_name: SE.string('Item 1'),
					nylon_stopper: SE.uuid(),

					nylon_stopper_name: SE.string('Nylon Stopper'),

					zipper_number: SE.uuid(),

					zipper_number_name: SE.string('Zipper Number'),

					end_type: SE.uuid(),
					end_type_name: SE.string('End Type'),

					production_capacity_quantity: SE.number(100),

					production_quantity: SE.number(100),
				}),
			},
		},
	},
	'/zipper/daily-production-plan': {
		get: {
			tags: ['zipper.finishing_batch'],
			summary: 'Get all Daily Production Plan',
			parameters: [
				SE.parameter_query('date', 'date', ['2024-01-01']),
				SE.parameter_query('item', 'item', ['igD0v9DIJQhJeet']),
			],

			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					item_description: SE.string('Item 1'),
					order_number: SE.string('Z24-0001'),
					party_name: SE.string('Party 1'),
					style: SE.string('Style 1'),
					color: SE.string('Color 1'),
					size: SE.number(100),
					quantity: SE.number(100),
				}),
			},
		},
	},
};

// * Zipper Finishing Batch Entry * //

export const pathZipperFinishingBatchEntry = {
	'/zipper/finishing-batch-entry': {
		get: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'Get all Finishing Batch Entry',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					finishing_batch_uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					quantity: SE.number(100),
					dyed_tape_used_in_kg: SE.number(100),
					teeth_molding_prod: SE.number(100),
					teeth_coloring_stock: SE.number(100),
					finishing_stock: SE.number(100),
					finishing_prod: SE.number(100),
					warehouse: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'create a finishing batch entry',
			description: '',
			// operationId: "add
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'zipper/finishing_batch_entry'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_entry'
				),
				405: SE.response(405),
			},
		},
	},
	'/zipper/finishing-batch-entry/{uuid}': {
		get: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'Gets a finishing batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('finishing batch entry to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					finishing_batch_uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					quantity: SE.number(100),
					dyed_tape_used_in_kg: SE.number(100),
					teeth_molding_prod: SE.number(100),
					teeth_coloring_stock: SE.number(100),
					finishing_stock: SE.number(100),
					finishing_prod: SE.number(100),
					warehouse: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'Update an existing finishing batch entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_schema_ref(
					'finishing batch entry to update',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'zipper/finishing_batch_entry'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'zipper/finishing_batch_entry'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'Deletes a finishing batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('finishing batch entry to delete', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/zipper/finishing-order-batch/{order_description_uuid}': {
		get: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'Get all Finishing Batch Entry by order description uuid',
			parameters: [
				SE.parameter_params(
					'finishing batch entry to get',
					'order_description_uuid'
				),
				SE.parameter_query(
					'production_date',
					'production_date',
					'2021-01-01'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					sfg_uuid: SE.uuid(),
					recipe_uuid: SE.uuid(),
					recipe_id: SE.string('LDR24-0001'),
					style: SE.string('LDR'),
					color: SE.string('black'),
					size: SE.number(10),
					order_quantity: SE.number(100),
					bleaching: SE.string('bleaching'),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-3-OE-SP'),
					given_quantity: SE.number(100),
					given_production_quantity: SE.number(100),
					given_production_quantity_in_kg: SE.number(100),
					balance_quantity: SE.number(100),
					top: SE.number(100),
					bottom: SE.number(100),
					raw_per_kg_meter: SE.number(100),
					dyed_per_kg_meter: SE.number(100),
				}),
			},
		},
	},
	'/zipper/finishing-batch-entry/production-quantity/max/{order_description_uuid}':
		{
			get: {
				tags: ['zipper.finishing_batch_entry'],
				summary:
					'Get all Finishing Batch Entry by order description uuid',
				parameters: [
					SE.parameter_params(
						'finishing batch entry to get',
						'order_description_uuid'
					),
					SE.parameter_query(
						'production_date',
						'production_date',
						'2021-01-01'
					),
				],
				responses: {
					200: SE.response_schema(200, {
						max: SE.number(100),
					}),
				},
			},
		},
	'/zipper/finishing-batch-entry/by/finishing-batch-uuid/{finishing_batch_uuid}':
		{
			get: {
				tags: ['zipper.finishing_batch_entry'],
				summary:
					'Get all Finishing Batch Entry by finishing batch uuid',
				parameters: [
					SE.parameter_params(
						'finishing batch entry to get',
						'finishing_batch_uuid'
					),
				],
				responses: {
					200: SE.response_schema(200, {
						uuid: SE.uuid(),
						finishing_batch_uuid: SE.uuid(),
						sfg_uuid: SE.uuid(),
						quantity: SE.number(100),
						dyed_tape_used_in_kg: SE.number(100),
						teeth_molding_prod: SE.number(100),
						teeth_coloring_stock: SE.number(100),
						finishing_stock: SE.number(100),
						finishing_prod: SE.number(100),
						warehouse: SE.number(100),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						remarks: SE.string('Remarks'),
					}),
				},
			},
		},
	'/zipper/finishing-batch/by/{section}': {
		get: {
			tags: ['zipper.finishing_batch_entry'],
			summary: 'Get all Finishing Batch by section',
			parameters: [
				SE.parameter_params('finishing batch to get', 'section'),
				SE.parameter_query('item_name', 'item_name', ['vislon']),
				SE.parameter_query('nylon_stopper', 'nylon_stopper', [
					'true',
					'false',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.string('1'),
					order_description_uuid: SE.uuid(),
					slider_lead_time: SE.number(100),
					dyeing_lead_time: SE.number(100),
					status: SE.string('pending'),
					slider_finishing_stock: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
	},
};

// * Zipper Path Zipper * //
export const pathZipper = {
	...pathZipperOrderInfo,
	...pathZipperOrderDescription,
	...pathZipperOrderEntry,
	...pathZipperSfg,
	...pathZipperFinishingBatchProduction,
	...pathZipperFinishingBatchTransaction,
	...pathZipperDyeingBatch,
	...pathZipperDyeingBatchEntry,
	...pathZipperTapeCoil,
	...pathZipperTapeCoilProduction,
	...pathZipperTapeTrx,
	...pathZipperTapeCoilRequired,
	...pathZipperPlanning,
	...pathZipperPlanningEntry,
	...pathZipperMaterialTrxAgainstOrderDescription,
	...pathZipperTapeCoilToDyeing,
	...pathZipperDyeingBatchProduction,
	...pathZipperDyedTapeTransaction,
	...pathZipperDyedTapeTransactionFromStock,
	...pathMultiColorDashboard,
	...pathZipperMultiColorTapeReceive,
	...pathZipperFinishingBatch,
	...pathZipperFinishingBatchEntry,
};
