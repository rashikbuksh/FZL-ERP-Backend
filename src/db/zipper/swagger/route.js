import SE from '../../../util/swagger_example.js';

const order_info_extra_schema = SE.response_schema(200, {
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
	marketing_priority: SE.string('Urgent'),
	factory_priority: SE.string('FIFO'),
	status: SE.number(0),
	created_by: SE.uuid(),
	created_by_name: SE.string('John'),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
	remarks: SE.string('Remarks'),
});

// * Zipper Order Info * //
export const pathZipperOrderInfo = {
	'/zipper/order-info': {
		get: {
			tags: ['zipper.order_info'],
			summary: 'Get all Order Info',
			responses: {
				200: order_info_extra_schema,
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
			parameters: [SE.parameter_uuid('GET DATA')],
			responses: {
				200: order_info_extra_schema,
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
			parameters: [SE.parameter_uuid('PUT DATA')],
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
			parameters: [SE.parameter_uuid('order info to delete')],
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
};

const order_description_fields = {
	uuid: SE.uuid(),
	order_info_uuid: SE.uuid(),
	tape_received: SE.number(0),
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
	puller_color: SE.uuid(),
	puller_color_name: SE.string('Black'),
	puller_color_short_name: SE.string('B'),
	special_requirement: SE.string(
		'{"values":"{\\"values\\":[\\"v3c2emB4mU1LV6j\\"]}"}'
	),
	hand: SE.uuid(),
	hand_name: SE.string('Right'),
	hand_short_name: SE.string('R'),
	stopper_type: SE.uuid(),
	stopper_type_name: SE.string('Metal'),
	stopper_type_short_name: SE.string('M'),
	coloring_type: SE.uuid(),
	coloring_type_name: SE.string('Dyed'),
	coloring_type_short_name: SE.string('D'),
	is_slider_provided: SE.number(0),
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
	garments_wash_name: SE.string('John'),
	garments_wash_short_name: SE.string('John'),
	puller_link: SE.uuid(),
	puller_link_name: SE.string('John'),
	puller_link_short_name: SE.string('John'),
	created_by: SE.uuid(),
	created_by_name: SE.string('John Doe'),
	garments_remarks: SE.string('Remarks'),
};

const order_description_merge_schema_fields = {
	order_description_uuid: SE.uuid(),
	order_number: SE.string('Z24-0010'),
	order_info_uuid: SE.uuid(),
	item: SE.uuid(),
	zipper_number: SE.uuid(),
	end_type: SE.uuid(),
	lock_type: SE.uuid(),
	puller_type: SE.uuid(),
	teeth_color: SE.uuid(),
	puller_color: SE.uuid(),
	special_requirement: SE.string(
		'{"values":"{\\"values\\":[\\"v3c2emB4mU1LV6j\\"]}"}'
	),
	hand: SE.uuid(),
	stopper_type: SE.uuid(),
	coloring_type: SE.uuid(),
	is_slider_provided: SE.number(0),
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
	puller_link: SE.uuid(),
	created_by: SE.uuid(),
	created_by_name: SE.string('John Doe'),
	garments_remarks: SE.string('Remarks'),
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
			parameters: [SE.parameter_uuid('GET DATA')],
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
			parameters: [SE.parameter_uuid('PUT DATA')],
			requestBody: SE.requestBody({
				order_info_uuid: SE.uuid(),
				item: SE.uuid(),
				zipper_number: SE.uuid(),
				end_type: SE.uuid(),
				lock_type: SE.uuid(),
				puller_type: SE.uuid(),
				teeth_color: SE.uuid(),
				puller_color: SE.uuid(),
				special_requirement: SE.string(
					'{"values":"{\\"values\\":[\\"v3c2emB4mU1LV6j\\"]}"}'
				),
				hand: SE.uuid(),
				stopper_type: SE.uuid(),
				coloring_type: SE.uuid(),
				is_slider_provided: SE.number(0),
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
				puller_link: SE.uuid(),
				created_by: SE.uuid(),
				created_by_name: SE.string('John Doe'),
				garments_remarks: SE.string('Remarks'),
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
			parameters: [SE.parameter_uuid('order description to delete')],
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
				SE.parameter_uuid(
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
				SE.parameter_uuid(
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
				SE.parameter_uuid('orderDescription to get', 'order_number'),
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
};

const order_entry_fields = {
	uuid: SE.uuid(),
	order_description_uuid: SE.uuid(),
	style: SE.string('style 1'),
	color: SE.string('black'),
	size: SE.number(10),
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
			parameters: [SE.parameter_uuid('order entry to get', 'uuid')],
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
			parameters: [SE.parameter_uuid('order entry to update', 'uuid')],
			requestBody: SE.requestBody({
				order_description_uuid: SE.uuid(),
				style: SE.string('style 1'),
				color: SE.string('black'),
				size: SE.number(10),
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
			parameters: [SE.parameter_uuid('order entry to delete', 'uuid')],
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
				SE.parameter_uuid(
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
			parameters: [SE.parameter_uuid('SFG to get', 'uuid')],
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
			parameters: [SE.parameter_uuid('sfg to update', 'uuid')],
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
			parameters: [SE.parameter_uuid('sfg to delete', 'uuid')],
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
			parameters: [SE.parameter_uuid('sfg to update', 'uuid')],
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
};

const sfg_production_extra_fields = {
	uuid: SE.uuid(),
	sfg_uuid: SE.uuid(),
	section: SE.string('section 1'),
	used_quantity: SE.number(10),
	production_quantity: SE.number(10),
	wastage: SE.number(10),
	created_by: SE.uuid(),
	user_name: SE.string('John Doe'),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
	remarks: SE.string('Remarks'),
};

// * Zipper SFG Production * //
export const pathZipperSfgProduction = {
	'/zipper/sfg-production': {
		get: {
			tags: ['zipper.sfg_production'],
			summary: 'Get all SFG Production',
			responses: {
				200: SE.response_schema(200, sfg_production_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.sfg_production'],
			summary: 'create a sfg production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/sfg_production'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/sfg_production'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('SFG Production to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/sfg_production'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.sfg_production'],
			summary: 'Update an existing sfg production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('sfg production to update', 'uuid')],
			requestBody: SE.requestBody({
				sfg_uuid: SE.uuid(),
				section: SE.string('section 1'),
				used_quantity: SE.number(10),
				production_quantity: SE.number(10),
				wastage: SE.number(10),
				created_by: SE.uuid(),
				user_name: SE.string('John Doe'),
				created_at: SE.date_time(),
				updated_at: SE.date_time(),
				remarks: SE.string('Remarks'),
			}),
			responses: {
				200: SE.requestBody_schema_ref(200, 'zipper/sfg_production'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.sfg_production'],
			summary: 'Deletes a sfg production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('sfg production to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

const sfg_transaction_extra_fields = {
	uuid: SE.uuid(),
	order_entry_uuid: SE.uuid(),
	order_description_uuid: SE.uuid(),
	order_quantity: SE.number(10),
	trx_from: SE.string('trx from'),
	trx_to: SE.string('trx to'),
	trx_quantity: SE.number(10),
	slider_item_uuid: SE.uuid(),
	created_by: SE.uuid(),
	created_by_name: SE.string('John Doe'),
	remarks: SE.string('Remarks'),
	created_at: SE.date_time(),
	updated_at: SE.date_time(),
};

// * Zipper SFG Transaction * //
export const pathZipperSfgTransaction = {
	'/zipper/sfg-transaction': {
		get: {
			tags: ['zipper.sfg_transaction'],
			summary: 'Get all SFG Transaction',
			responses: {
				200: SE.response_schema(200, sfg_transaction_extra_fields),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.sfg_transaction'],
			summary: 'create a sfg transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/sfg_transaction'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/sfg_transaction'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('SFG Transaction to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/sfg_transaction'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_uuid('sfg transaction to update', 'uuid'),
			],
			requestBody: SE.requestBody({
				order_entry_uuid: SE.uuid(),
				order_description_uuid: SE.uuid(),
				order_quantity: SE.number(10),
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
				200: SE.response_schema_ref(200, 'zipper/sfg_transaction'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.sfg_transaction'],
			summary: 'Deletes a sfg transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_uuid('sfg transaction to delete', 'uuid'),
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
export const pathZipperBatch = {
	'/zipper/batch': {
		get: {
			tags: ['zipper.batch'],
			summary: 'Get all Batch',
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		post: {
			tags: ['zipper.batch'],
			summary: 'create a batch',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('batch to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.batch'],
			summary: 'Update an existing batch',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('batch to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/batch-details/{batch_uuid}': {
		get: {
			tags: ['zipper.batch'],
			summary: 'Get a Batch by Batch UUID',
			description: '',
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('batch to get', 'batch_uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Batch Entry * //
export const pathZipperBatchEntry = {
	'/zipper/batch-entry': {
		get: {
			tags: ['zipper.batch_entry'],
			summary: 'Get all Batch Entry',
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch_entry'),
			},
		},
		post: {
			tags: ['zipper.batch_entry'],
			summary: 'create a batch entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/batch_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('batch entry to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.batch_entry'],
			summary: 'Update an existing batch entry',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('batch entry to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/batch_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.batch_entry'],
			summary: 'Deletes a batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('batch entry to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/batch-entry/by/batch-uuid/{batch_uuid}': {
		get: {
			tags: ['zipper.batch_entry'],
			summary: 'Get a Batch Entry by Batch Entry UUID',
			description: '',
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('batch entry to get', 'batch_uuid')],
			responses: {
				200: SE.response(200, {
					batch_entry_uuid: SE.uuid(),
					batch_uuid: SE.uuid(),
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
				}),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/order-batch': {
		get: {
			tags: ['zipper.batch_entry'],
			summary: 'Get Order Details for Batch Entry',
			description: '',
			produces: ['application/json'],
			responses: {
				200: SE.response(200, {
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
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Dying Batch * //
export const pathZipperDyingBatch = {
	'/zipper/dying-batch': {
		get: {
			tags: ['zipper.dying_batch'],
			summary: 'Get all Dying Batch',
			responses: {
				200: SE.response(200, {
					uuid: SE.uuid(),
					id: SE.integer(1),
					mc_no: SE.string('MC-001'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
				}),
			},
		},
		post: {
			tags: ['zipper.dying_batch'],
			summary: 'create a dying batch',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/dying_batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('dying batch to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		put: {
			tags: ['zipper.dying_batch'],
			summary: 'Update an existing dying batch',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('dying batch to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/dying_batch'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dying_batch'],
			summary: 'Deletes a dying batch',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('dying batch to delete', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Zipper Dying Batch Entry * //
export const pathZipperDyingBatchEntry = {
	'/zipper/dying-batch-entry': {
		get: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'Get all Dying Batch',
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch_entry'),
			},
		},
		post: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'create a dying batch entry',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/dying_batch_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('dying batch entry to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
				SE.parameter_uuid('dying batch entry to update', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('zipper/dying_batch_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/dying_batch_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.dying_batch_entry'],
			summary: 'Deletes a dying batch entry',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_uuid('dying batch entry to delete', 'uuid'),
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

// * Zipper Tape Coil * //
export const pathZipperTapeCoil = {
	'/zipper/tape-coil': {
		get: {
			tags: ['zipper.tape_coil'],
			summary: 'Get all Tape Coil',
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil'),
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
			parameters: [SE.parameter_uuid('tape coil to get', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_coil'),
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
			parameters: [SE.parameter_uuid('tape coil to update', 'uuid')],
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
			parameters: [SE.parameter_uuid('tape coil to delete', 'uuid')],
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
				200: SE.response(200, {
					uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
					trx_quantity_in_coil: SE.number(100),
					quantity_in_coil: SE.number(100),
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
				200: SE.response(200, {
					uuid: SE.uuid(),
					section: SE.string('zipper'),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
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
				SE.parameter_uuid('tape coil production to get', 'uuid'),
			],
			responses: {
				200: SE.response(200, {
					uuid: SE.uuid(),
					section: SE.string('zipper'),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
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
				SE.parameter_uuid('tape coil production to update', 'uuid'),
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
				SE.parameter_uuid('tape coil production to delete', 'uuid'),
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
				SE.parameter_uuid(
					'tape coil production to get',
					'section',
					'string'
				),
			],
			responses: {
				200: SE.response(200, {
					uuid: SE.uuid(),
					section: SE.string('zipper'),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
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
export const pathZipperTapeToCoil = {
	'/zipper/tape-to-coil': {
		get: {
			tags: ['zipper.tape_to_coil'],
			summary: 'Get all Tape To Coil',
			responses: {
				200: SE.response(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('nylon 3'),
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
			tags: ['zipper.tape_to_coil'],
			summary: 'create a tape to coil',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('zipper/tape_to_coil'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_to_coil'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_uuid('tape to coil to get', 'uuid')],
			responses: {
				200: SE.response(200, {
					uuid: SE.uuid(),
					tape_coil_uuid: SE.uuid(),
					type: SE.string('nylon'),
					zipper_number: SE.number(3),
					type_of_zipper: SE.string('nylon 3'),
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
			tags: ['zipper.tape_to_coil'],
			summary: 'Update an existing tape to coil',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('tape to coil to update', 'uuid')],
			requestBody: SE.requestBody_schema_ref('zipper/tape_to_coil'),
			responses: {
				200: SE.response_schema_ref(200, 'zipper/tape_to_coil'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['zipper.tape_to_coil'],
			summary: 'Deletes a tape to coil',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_uuid('tape to coil to delete', 'uuid')],
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
				200: SE.response(200, {
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
				SE.parameter_uuid('planning to get', 'week', 'string'),
			],
			responses: {
				200: SE.response(200, {
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
				SE.parameter_uuid('planning to update', 'week', 'string'),
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
				SE.parameter_uuid('planning to delete', 'week', 'string'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/zipper/planning/by/{planning_week}': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning by Planning UUID',
			parameters: [
				SE.parameter_uuid('planning to get', 'planning_week', 'string'),
			],
			responses: {
				200: SE.response(200, {
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
	},
	'/zipper/planning-details/by/{planning_week}': {
		get: {
			tags: ['zipper.planning'],
			summary: 'Get all Planning and Planning Entry by Planning UUID',
			parameters: [
				SE.parameter_uuid('planning to get', 'planning_week', 'string'),
			],
			responses: {
				200: SE.response(200, {
					week: SE.string('24-32'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
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
				200: SE.response(200, {
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

// * Zipper Material Trx Against Order Description * //
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
									stock: {
										type: 'number',
										example: 100,
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
							stock: {
								type: 'number',
								example: 100,
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
									stock: {
										type: 'number',
										example: 100,
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
	'/zipper/material-trx-against-order/multiple/by/{trx_tos}': {
		get: {
			tags: ['zipper.material_trx_against_order_description'],
			summary: 'Get all Material Trx by trx_to',
			parameters: [
				{
					name: 'trx_tos',
					in: 'path',
					description: 'material trx to get',
					required: true,
					type: 'string',
					example: 'teeth_molding,teeth_cutting',
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
									stock: {
										type: 'number',
										example: 100,
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

// * Zipper Tape Coil To Dyeing * //
export const pathZipperTapeCoilToDyeing = {
	'/zipper/tape-coil-to-dyeing': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Get all Tape Coil To Dyeing',
			responses: {
				200: {
					description: 'Returns all Tape Coil To Dyeing',
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
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									trx_quantity: {
										type: 'number',
										example: 100,
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
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									type: {
										type: 'string',
										example: 'Nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									type_of_zipper: {
										type: 'string',
										example: 'Nylon 3',
									},
								},
							},
						},
					},
				},
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
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_coil_to_dyeing',
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
							$ref: '#/definitions/zipper/tape_coil_to_dyeing',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/zipper/tape-coil-to-dyeing/{uuid}': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Gets a tape coil to dyeing',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil to dyeing to get',
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
							tape_coil_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							order_description_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							trx_quantity: {
								type: 'number',
								example: 100,
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
							order_number: {
								type: 'string',
								example: 'Z24-0001',
							},
							item_description: {
								type: 'string',
								example: 'N-3-OE-SP',
							},
							type: {
								type: 'string',
								example: 'Nylon',
							},
							zipper_number: {
								type: 'number',
								example: 3,
							},
							type_of_zipper: {
								type: 'string',
								example: 'Nylon 3',
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
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Update an existing tape coil to dyeing',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil to dyeing to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/zipper/tape_coil_to_dyeing',
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
							$ref: '#/definitions/zipper/tape_coil_to_dyeing',
						},
					},
				},

				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'tape coil to dyeing not found',
				},

				405: {
					description: 'Validation exception',
				},
			},
		},

		delete: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Deletes a tape coil to dyeing',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'tape coil to dyeing to delete',
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
							$ref: '#/definitions/zipper/tape_coil_to_dyeing',
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'tape coil to dyeing not found',
				},
			},
		},
	},
	'/zipper/tape-coil-to-dyeing/by/type/nylon': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Get all Tape Coil To Dyeing by type nylon',
			responses: {
				200: {
					description:
						'Returns all Tape Coil To Dyeing by type nylon',
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
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									trx_quantity: {
										type: 'number',
										example: 100,
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
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									type: {
										type: 'string',
										example: 'Nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									type_of_zipper: {
										type: 'string',
										example: 'Nylon 3',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/zipper/tape-coil-to-dyeing/by/type/tape': {
		get: {
			tags: ['zipper.tape_coil_to_dyeing'],
			summary: 'Get all Tape Coil To Dyeing by type tape',
			responses: {
				200: {
					description: 'Returns all Tape Coil To Dyeing by type tape',
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
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									trx_quantity: {
										type: 'number',
										example: 100,
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
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'N-3-OE-SP',
									},
									type: {
										type: 'string',
										example: 'Nylon',
									},
									zipper_number: {
										type: 'number',
										example: 3,
									},
									type_of_zipper: {
										type: 'string',
										example: 'Nylon 3',
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

// * Zipper Path Zipper * //

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
	...pathZipperTapeCoilToDyeing,
};
