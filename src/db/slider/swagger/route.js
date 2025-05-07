import SE from '../../../util/swagger_example.js';

// * Slider Stock * //
export const pathSliderStock = {
	'/slider/stock': {
		get: {
			tags: ['slider.stock'],
			summary: 'Get all stock',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('item description'),
					order_quantity: SE.number(1),
					body_quantity: SE.number(1),
					cap_quantity: SE.number(1),
					puller_quantity: SE.number(1),
					link_quantity: SE.number(1),
					sa_prod: SE.number(1),
					sa_prod_weight: SE.number(1),
					coloring_stock: SE.number(1),
					coloring_stock_weight: SE.number(1),
					coloring_prod: SE.number(1),
					coloring_prod_weight: SE.number(1),
					finishing_stock: SE.number(1),
					finishing_stock_weight: SE.number(1),
					trx_to_finishing: SE.number(1),
					trx_to_finishing_weight: SE.number(1),
					u_top_quantity: SE.number(1),
					h_bottom_quantity: SE.number(1),
					box_pin_quantity: SE.number(1),
					two_way_pin_quantity: SE.number(1),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
					item: SE.uuid(),
					item_name: SE.string('item name'),
					item_short_name: SE.string('item short name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper name'),
					zipper_number_short_name: SE.string('zipper short name'),
					end_type: SE.uuid(),
					end_type_name: SE.string('end type name'),
					end_type_short_name: SE.string('end type short name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock type name'),
					lock_type_short_name: SE.string('lock type short name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller type name'),
					puller_type_short_name: SE.string('puller type short name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller color name'),
					puller_color_short_name: SE.string(
						'puller color short name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider link name'),
					slider_link_short_name: SE.string('slider link short name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider name'),
					slider_short_name: SE.string('slider short name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider body shape name'),
					slider_body_shape_short_name: SE.string(
						'slider body shape short name'
					),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring type name'),
					coloring_type_short_name: SE.string(
						'coloring type short name'
					),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo type name'),
					logo_type_short_name: SE.string('logo type short name'),
					is_logo_body: SE.number(1),
					is_logo_puller: SE.number(1),
					order_type: SE.string('order type'),
				}),
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
				405: SE.response(405),
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
				SE.parameter_params(
					'get using uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('item description'),
					order_quantity: SE.number(1),
					body_quantity: SE.number(1),
					cap_quantity: SE.number(1),
					puller_quantity: SE.number(1),
					link_quantity: SE.number(1),
					sa_prod: SE.number(1),
					sa_prod_weight: SE.number(1),
					coloring_stock: SE.number(1),
					coloring_stock_weight: SE.number(1),
					coloring_prod: SE.number(1),
					coloring_prod_weight: SE.number(1),
					finishing_stock: SE.number(1),
					finishing_stock_weight: SE.number(1),
					trx_to_finishing: SE.number(1),
					trx_to_finishing_weight: SE.number(1),
					u_top_quantity: SE.number(1),
					h_bottom_quantity: SE.number(1),
					box_pin_quantity: SE.number(1),
					two_way_pin_quantity: SE.number(1),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
					item: SE.uuid(),
					item_name: SE.string('item name'),
					item_short_name: SE.string('item short name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper name'),
					zipper_number_short_name: SE.string('zipper short name'),
					end_type: SE.uuid(),
					end_type_name: SE.string('end type name'),
					end_type_short_name: SE.string('end type short name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock type name'),
					lock_type_short_name: SE.string('lock type short name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller type name'),
					puller_type_short_name: SE.string('puller type short name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller color name'),
					puller_color_short_name: SE.string(
						'puller color short name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider link name'),
					slider_link_short_name: SE.string('slider link short name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider name'),
					slider_short_name: SE.string('slider short name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider body shape name'),
					slider_body_shape_short_name: SE.string(
						'slider body shape short name'
					),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring type name'),
					coloring_type_short_name: SE.string(
						'coloring type short name'
					),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo type name'),
					logo_type_short_name: SE.string('logo type short name'),
					is_logo_body: SE.number(1),
					is_logo_puller: SE.number(1),
					order_type: SE.string('order type'),
				}),
				400: SE.response(400),
				404: SE.response(404),
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
				SE.parameter_params(
					'get using uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
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
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.stock'],
			summary: 'Deletes a stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'get using uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/slider/stock/by/{from_section}': {
		get: {
			tags: ['slider.stock'],
			summary: 'Gets a stock by from section',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'from_section',
					'from_section',
					'string',
					'sa_prod'
				),
				SE.parameter_query('from', 'from', SE.date_time()),
				SE.parameter_query('to', 'to', SE.date_time()),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					order_description_uuid: SE.uuid(),
					party_name: SE.string('party name'),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('item description'),
					item: SE.uuid(),
					item_name: SE.string('item name'),
					item_short_name: SE.string('item short name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper name'),
					zipper_number_short_name: SE.string('zipper short name'),
					end_type: SE.uuid(),
					end_type_name: SE.string('end type name'),
					end_type_short_name: SE.string('end type short name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock type name'),
					lock_type_short_name: SE.string('lock type short name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller type name'),
					puller_type_short_name: SE.string('puller type short name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller color name'),
					puller_color_short_name: SE.string(
						'puller color short name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider link name'),
					slider_link_short_name: SE.string('slider link short name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider name'),
					slider_short_name: SE.string('slider short name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider body shape name'),
					slider_body_shape_short_name: SE.string(
						'slider body shape short name'
					),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring type name'),
					coloring_type_short_name: SE.string(
						'coloring type short name'
					),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo type name'),
					logo_type_short_name: SE.string('logo type short name'),
					is_logo_body: SE.number(1),
					is_logo_puller: SE.number(1),
					order_type: SE.string('order type'),
					order_quantity: SE.number(1),
					body_quantity: SE.number(1),
					cap_quantity: SE.number(1),
					puller_quantity: SE.number(1),
					link_quantity: SE.number(1),
					sa_prod: SE.number(1),
					sa_prod_weight: SE.number(1),
					coloring_stock: SE.number(1),
					coloring_stock_weight: SE.number(1),
					coloring_prod: SE.number(1),
					coloring_prod_weight: SE.number(1),
					finishing_stock: SE.number(1),
					finishing_stock_weight: SE.number(1),
					trx_to_finishing: SE.number(1),
					trx_to_finishing_weight: SE.number(1),
					u_top_quantity: SE.number(1),
					h_bottom_quantity: SE.number(1),
					box_pin_quantity: SE.number(1),
					two_way_pin_quantity: SE.number(1),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
					max_sa_quantity_with_link: SE.number(1),
					max_sa_quantity_without_link: SE.number(1),
					total_trx_quantity: SE.number(1),
					trx_weight: SE.number(1),
					total_production_quantity: SE.number(1),
					total_production_weight: SE.number(1),
					balance_quantity: SE.number(1),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Slider Die Casting * //
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
									uuid: SE.uuid(),
									name: {
										type: 'string',
										example: 'die_casting 1',
									},
									item: SE.uuid(),
									item_name: {
										type: 'string',
										example: 'item name',
									},
									item_short_name: {
										type: 'string',
										example: 'item short name',
									},
									zipper_number: SE.uuid(),
									zipper_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_short_name: {
										type: 'string',
										example: 'zipper short name',
									},
									end_type: SE.uuid(),
									end_type_name: {
										type: 'string',
										example: 'end type name',
									},
									end_type_short_name: {
										type: 'string',
										example: 'end type short name',
									},
									puller_type: SE.uuid(),
									puller_type_name: {
										type: 'string',
										example: 'puller type name',
									},
									puller_type_short_name: {
										type: 'string',
										example: 'puller type short name',
									},
									logo_type: SE.uuid(),
									logo_type_name: {
										type: 'string',
										example: 'logo type name',
									},
									logo_type_short_name: {
										type: 'string',
										example: 'logo type short name',
									},
									slider_body_shape: SE.uuid(),
									slider_body_shape_name: {
										type: 'string',
										example: 'body shape name',
									},
									slider_body_shape_short_name: {
										type: 'string',
										example: 'body shape short name',
									},
									slider_link: SE.uuid(),
									slider_link_name: {
										type: 'string',
										example: 'puller link name',
									},
									slider_link_short_name: {
										type: 'string',
										example: 'puller link short name',
									},
									quantity: SE.number(1),
									weight: SE.number(1),
									pcs_per_kg: SE.number(1),
									created_by: SE.uuid(),
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									type: SE.string('body'),
									quantity_in_sa: SE.number(1),
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
				405: SE.response(405),
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
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						properties: {
							uuid: SE.uuid(),
							name: {
								type: 'string',
								example: 'die_casting 1',
							},
							item: SE.uuid(),
							item_name: {
								type: 'string',
								example: 'item name',
							},
							item_short_name: {
								type: 'string',
								example: 'item short name',
							},
							zipper_number: SE.uuid(),
							zipper_name: {
								type: 'string',
								example: 'zipper name',
							},
							zipper_short_name: {
								type: 'string',
								example: 'zipper short name',
							},
							end_type: SE.uuid(),
							end_type_name: {
								type: 'string',
								example: 'end type name',
							},
							end_type_short_name: {
								type: 'string',
								example: 'end type short name',
							},
							puller_type: SE.uuid(),
							puller_type_name: {
								type: 'string',
								example: 'puller type name',
							},
							puller_type_short_name: {
								type: 'string',
								example: 'puller type short name',
							},

							logo_type: SE.uuid(),
							logo_type_name: {
								type: 'string',
								example: 'logo type name',
							},
							logo_type_short_name: {
								type: 'string',
								example: 'logo type short name',
							},
							slider_body_shape: SE.uuid(),
							slider_body_shape_name: {
								type: 'string',
								example: 'body shape name',
							},
							slider_body_shape_short_name: {
								type: 'string',
								example: 'body shape short name',
							},
							slider_link: SE.uuid(),
							slider_link_name: {
								type: 'string',
								example: 'puller link name',
							},
							slider_link_short_name: {
								type: 'string',
								example: 'puller link short name',
							},
							quantity: SE.number(1),
							weight: SE.number(1),
							pcs_per_kg: SE.number(1),
							created_by: SE.uuid(),
							created_by_name: {
								type: 'string',
								example: 'John Doe',
							},
							created_at: SE.date_time(),
							updated_at: SE.date_time(),
							remarks: SE.string('remarks'),
							type: SE.string('body'),
							quantity_in_sa: SE.number(1),
						},
					},
				},
				400: SE.response(400),
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
				400: SE.response(400),
				404: {
					description: 'Die casting not found',
				},
				405: SE.response(405),
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
				400: SE.response(400),
				404: {
					description: 'Die casting not found',
				},
			},
		},
	},
	'/slider/die-casting-trx-log': {
		get: {
			tags: ['slider.die_casting'],
			summary: 'Gets all transactions from die casting',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [],
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
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Slider Die Casting Assembly Stock * //
export const pathSliderAssemblyStock = {
	'/slider/assembly-stock': {
		get: {
			tags: ['slider.assembly_stock'],
			summary: 'Get all assembly stock',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('name'),
					die_casting_body_uuid: SE.uuid(),
					die_casting_body_name: SE.string('body name'),
					die_casting_puller_uuid: SE.uuid(),
					die_casting_puller_name: SE.string('puller name'),
					die_casting_cap_uuid: SE.uuid(),
					die_casting_cap_name: SE.string('cap name'),
					die_casting_link_uuid: SE.uuid(),
					die_casting_link_name: SE.string('link name'),
					quantity: SE.number(1),
					weight: SE.number(1),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.assembly_stock'],
			summary: 'create a assembly stock',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref('slider/assembly_stock'),
			response: {
				200: SE.response_schema_ref('slider/assembly_stock'),
				405: SE.response(405),
			},
		},
	},
	'/slider/assembly-stock/{uuid}': {
		get: {
			tags: ['slider.assembly_stock'],
			summary: 'Gets a assembly stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'assembly_stock_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			responses: {
				200: SE.response_schema_ref('slider/assembly_stock'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['slider.assembly_stock'],
			summary: 'Update an existing assembly stock',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'assembly_stock_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			requestBody: SE.requestBody_schema_ref('slider/assembly_stock'),
			responses: {
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.assembly_stock'],
			summary: 'Deletes a assembly stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'assembly_stock_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			responses: {
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

export const pathSliderDieCastingToAssemblyStock = {
	'/slider/die-casting-to-assembly-stock': {
		get: {
			tags: ['slider.die_casting_to_assembly_stock'],
			summary: 'Get all die casting to assembly stock',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					assembly_stock_uuid: SE.uuid(),
					assembly_stock_name: SE.string('assembly stock name'),
					quantity: SE.number(1),
					weight: SE.number(1),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.die_casting_to_assembly_stock'],
			summary: 'create a die casting to assembly stock',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'slider/die_casting_to_assembly_stock'
			),
			responses: {
				200: SE.response_schema_ref(
					'slider/die_casting_to_assembly_stock'
				),
				405: SE.response(405),
			},
		},
	},
	'/slider/die-casting-to-assembly-stock/{uuid}': {
		get: {
			tags: ['slider.die_casting_to_assembly_stock'],
			summary: 'Gets a die casting to assembly stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'die_casting_to_assembly_stock_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			responses: {
				200: SE.response_schema_ref(
					'slider/die_casting_to_assembly_stock'
				),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['slider.die_casting_to_assembly_stock'],
			summary: 'Update an existing die casting to assembly stock',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'die_casting_to_assembly_stock_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'slider/die_casting_to_assembly_stock'
			),
			responses: {
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.die_casting_to_assembly_stock'],
			summary: 'Deletes a die casting to assembly stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'die_casting_to_assembly_stock_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			responses: {
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/slider/assembly-production-log': {
		get: {
			tags: ['slider.die_casting_to_assembly_stock'],
			summary: 'Gets all production log for assembly',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					stock_uuid: SE.uuid(),
					production_quantity: SE.number(1),
					quantity: SE.number(1),
					weight: SE.number(1),
					wastage: SE.number(1),
					section: SE.string('section'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
					item: SE.uuid(),
					item_name: SE.string('item name'),
					item_short_name: SE.string('item short name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper name'),
					zipper_number_short_name: SE.string('zipper short name'),
					end_type: SE.uuid(),
					end_type_name: SE.string('end type name'),
					end_type_short_name: SE.string('end type short name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock type name'),
					lock_type_short_name: SE.string('lock type short name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller type name'),
					puller_type_short_name: SE.string('puller type short name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller color name'),
					puller_color_short_name: SE.string(
						'puller color short name'
					),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo type name'),
					logo_type_short_name: SE.string('logo type short name'),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider link name'),
					slider_link_short_name: SE.string('slider link short name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider name'),
					slider_short_name: SE.string('slider short name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider body shape name'),
					slider_body_shape_short_name: SE.string(
						'slider body shape short name'
					),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring type name'),
					coloring_type_short_name: SE.string(
						'coloring type short name'
					),
					order_quantity: SE.number(1),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('item description'),
					sa_prod: SE.number(1),
					coloring_stock: SE.number(1),
					coloring_prod: SE.number(1),
					max_coloring_quantity: SE.number(1),
					with_link: SE.number(1),
					max_sa_quantity: SE.number(1),
					against_order: SE.string('TRUE'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Slider Die Casting Production * //
export const pathSliderDieCastingProduction = {
	'/slider/die-casting-production': {
		get: {
			tags: ['slider.die_casting_production'],
			summary: 'Get all die casting production',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					die_casting_uuid: SE.uuid(),
					die_casting_name: SE.string('die casting name'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					mc_no: SE.number(1),
					cavity_goods: SE.number(1),
					cavity_defect: SE.number(1),
					push: SE.number(1),
					production_quantity: SE.number(1),
					weight: SE.number(1),
					pcs_per_kg: SE.number(1),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.die_casting_production'],
			summary: 'create a die casting production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/die_casting_production',
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
							$ref: '#/definitions/slider/die_casting_production',
						},
					},
				},
				405: SE.response(405),
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
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					die_casting_uuid: SE.uuid(),
					die_casting_name: SE.string('die casting name'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					mc_no: SE.number(1),
					cavity_goods: SE.number(1),
					cavity_defect: SE.number(1),
					push: SE.number(1),
					production_quantity: SE.number(1),
					weight: SE.number(1),
					pcs_per_kg: SE.number(1),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
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
				SE.parameter_params(
					'die_casting_production_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'slider/die_casting_production'
			),
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					die_casting_uuid: SE.uuid(),
					die_casting_name: SE.string('die casting name'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					mc_no: SE.number(1),
					cavity_goods: SE.number(1),
					cavity_defect: SE.number(1),
					push: SE.number(1),
					production_quantity: SE.number(1),
					weight: SE.number(1),
					pcs_per_kg: SE.number(1),
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
		delete: {
			tags: ['slider.die_casting_production'],
			summary: 'Deletes a die casting production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'die_casting_production_uuid',
					'uuid',
					'uuid',
					'igD0v9DIJQhJeet'
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

// * Slider Die Casting Transaction * //
export const pathSliderDieCastingTransaction = {
	'/slider/die-casting-transaction': {
		get: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Get all die casting transaction',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					die_casting_uuid: SE.uuid(),
					name: SE.string('V-3-OE-SP'),
					stock_uuid: SE.uuid(),
					order_item_description: SE.string('Z24-0001 - N-5-OE-RP'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					order_description_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Nylon'),
					item_short_name: SE.string('N'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('3'),
					zipper_number_short_name: SE.string('3'),
					end_type: SE.uuid(),
					end_type_name: SE.string('Open End'),
					end_type_short_name: SE.string('OE'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('Normal Puller'),
					puller_type_short_name: SE.string('NP'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('Standard'),
					slider_body_shape_short_name: SE.string('SP'),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('Standard'),
					slider_link_short_name: SE.string('SP'),
					trx_quantity: SE.number(1),
					weight: SE.number(1),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.die_casting_transaction'],
			summary: 'create a die casting transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: SE.requestBody_schema_ref(
				'slider/die_casting_transaction'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'slider/die_casting_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
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
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					die_casting_uuid: SE.uuid(),
					name: SE.string('V-3-OE-SP'),
					stock_uuid: SE.uuid(),
					order_item_description: SE.string('Z24-0001 - N-5-OE-RP'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					order_description_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Nylon'),
					item_short_name: SE.string('N'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('3'),
					zipper_number_short_name: SE.string('3'),
					end_type: SE.uuid(),
					end_type_name: SE.string('Open End'),
					end_type_short_name: SE.string('OE'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('Normal Puller'),
					puller_type_short_name: SE.string('NP'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('Standard'),
					slider_body_shape_short_name: SE.string('SP'),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('Standard'),
					slider_link_short_name: SE.string('SP'),
					trx_quantity: SE.number(1),
					weight: SE.number(1),
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
			tags: ['slider.die_casting_transaction'],
			summary: 'Update an existing die casting transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Die casting transaction to update',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref(
				'slider/die_casting_transaction'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'slider/die_casting_transaction'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Deletes a die casting transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Die casting transaction to update',
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
	'/slider/die-casting/for/slider-stock/{order_info_uuid}': {
		get: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Get stock using Order Number',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('stock information', 'order_info_uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					stock_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-5-OE-RP'),
					order_info_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Nylon'),
					item_short_name: SE.string('N'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('3'),
					zipper_number_short_name: SE.string('3'),
					end_type: SE.uuid(),
					end_type_name: SE.string('Open End'),
					end_type_short_name: SE.string('OE'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('Normal Puller'),
					puller_type_short_name: SE.string('NP'),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('FZL'),
					logo_type_short_name: SE.string('FZL'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('Black'),
					puller_color_short_name: SE.string('B'),
					order_quantity: SE.number(100),
					provided_quantity: SE.number(100),
					balance_quantity: SE.number(100),
				}),
			},
		},
	},
	'/slider/die-casting/for/slider-stock-multi/{order_info_uuids}': {
		get: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Get stock using Order Number',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('stock information', 'order_info_uuids'),
			],
			responses: {
				200: SE.response_schema(200, {
					stock_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('N-5-OE-RP'),
					order_info_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Nylon'),
					item_short_name: SE.string('N'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('3'),
					zipper_number_short_name: SE.string('3'),
					end_type: SE.uuid(),
					end_type_name: SE.string('Open End'),
					end_type_short_name: SE.string('OE'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('Normal Puller'),
					puller_type_short_name: SE.string('NP'),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('FZL'),
					logo_type_short_name: SE.string('FZL'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('Black'),
					puller_color_short_name: SE.string('B'),
					order_quantity: SE.number(100),
					provided_quantity: SE.number(100),
					balance_quantity: SE.number(100),
				}),
			},
		},
	},
};

// * Slider Transaction * //
const pathSliderTransaction = {
	'/slider/transaction': {
		get: {
			tags: ['slider.transaction'],
			summary: 'Get all transaction',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					stock_uuid: SE.uuid(),
					from_section: SE.string('from_section'),
					to_section: SE.string('to_section'),
					trx_quantity: SE.number(100),
					trx_quantity_in_kg: SE.number(100),
					weight: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
					item: SE.uuid(),
					item_name: SE.string('item_name'),
					item_short_name: SE.string('item_short_name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper_number_name'),
					zipper_number_short_name: SE.string(
						'zipper_number_short_name'
					),
					end_type: SE.uuid(),
					end_type_name: SE.string('end_type_name'),
					end_type_short_name: SE.string('end_type_short_name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock_type_name'),
					lock_type_short_name: SE.string('lock_type_short_name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller_type_name'),
					puller_type_short_name: SE.string('puller_type_short_name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller_color_name'),
					puller_color_short_name: SE.string(
						'puller_color_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo_type_name'),
					logo_type_short_name: SE.string('logo_type_short_name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider_name'),
					slider_short_name: SE.string('slider_short_name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider_body_shape_name'),
					slider_body_shape_short_name: SE.string(
						'slider_body_shape_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring_type_name'),
					coloring_type_short_name: SE.string(
						'coloring_type_short_name'
					),
					order_quantity: SE.number(1),
					is_logo_body: SE.number(1),
					is_puller: SE.number(1),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
				}),
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
			requestBody: SE.requestBody_schema_ref('slider/transaction'),
			responses: {
				200: SE.response_schema_ref(200, 'slider/transaction'),
				405: SE.response(405),
			},
		},
	},
	'/slider/transaction/{uuid}': {
		get: {
			tags: ['slider.transaction'],
			summary: 'Gets a transaction',
			description: '',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('uuid', 'transaction to get'),
				SE.parameter_query('from_section', 'from_section', [
					'sa_prod',
					'coloring_stock',
					'coloring_prod',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					stock_uuid: SE.uuid(),
					from_section: SE.string('from_section'),
					to_section: SE.string('to_section'),
					trx_quantity: SE.number(100),
					trx_quantity_in_kg: SE.number(100),
					weight: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
					item: SE.uuid(),
					item_name: SE.string('item_name'),
					item_short_name: SE.string('item_short_name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper_number_name'),
					zipper_number_short_name: SE.string(
						'zipper_number_short_name'
					),
					end_type: SE.uuid(),
					end_type_name: SE.string('end_type_name'),
					end_type_short_name: SE.string('end_type_short_name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock_type_name'),
					lock_type_short_name: SE.string('lock_type_short_name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller_type_name'),
					puller_type_short_name: SE.string('puller_type_short_name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller_color_name'),
					puller_color_short_name: SE.string(
						'puller_color_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo_type_name'),
					logo_type_short_name: SE.string('logo_type_short_name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider_name'),
					slider_short_name: SE.string('slider_short_name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider_body_shape_name'),
					slider_body_shape_short_name: SE.string(
						'slider_body_shape_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring_type_name'),
					coloring_type_short_name: SE.string(
						'coloring_type_short_name'
					),
					order_quantity: SE.number(1),
					is_logo_body: SE.number(1),
					is_puller: SE.number(1),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['slider.transaction'],
			summary: 'Update an existing transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'Transaction to update')],
			requestBody: SE.requestBody_schema_ref('slider/transaction'),
			responses: {
				200: SE.response_schema_ref(200, 'slider/transaction'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.transaction'],
			summary: 'Deletes a transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'Transaction to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/slider/transaction/by/{from_section}': {
		get: {
			tags: ['slider.transaction'],
			summary: 'Gets a transaction',
			description: '',
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'from_section',
					'from_section',
					'string',
					'coloring_prod'
				),
				SE.parameter_query('from_date', 'from_date'),
				SE.parameter_query('to_date', 'to_date'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'slider/transaction'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Slider Coloring Transaction * //
const pathSliderColoringTransaction = {
	'/slider/coloring-transaction': {
		get: {
			tags: ['slider.coloring_transaction'],
			summary: 'Get all coloring transaction',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					stock_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					trx_quantity: SE.number(1),
					weight: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.coloring_transaction'],
			summary: 'create a coloring transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref(
				'slider/coloring_transaction'
			),
			responses: {
				200: SE.response_schema_ref(200, 'slider/coloring_transaction'),
				405: SE.response(405),
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
				SE.parameter_params('Coloring transaction to get', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'slider/coloring_transaction'),
				400: SE.response(400),
				404: SE.response(404),
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
				SE.parameter_params('Coloring transaction to get', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref(
				'slider/coloring_transaction'
			),
			responses: {
				200: SE.response_schema_ref(200, 'slider/coloring_transaction'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.coloring_transaction'],
			summary: 'Deletes a coloring transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

//* Trx Against Stock *//
const pathTrxAgainstStock = {
	'/slider/trx-against-stock': {
		get: {
			tags: ['slider.trx_against_stock'],
			summary: 'Get all transaction against stock',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('die casting name'),
					die_casting_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('item_name'),
					item_short_name: SE.string('item_short_name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper_number_name'),
					zipper_number_short_name: SE.string(
						'zipper_number_short_name'
					),
					end_type: SE.uuid(),
					end_type_name: SE.string('end_type_name'),
					end_type_short_name: SE.string('end_type_short_name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock_type_name'),
					lock_type_short_name: SE.string('lock_type_short_name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller_type_name'),
					puller_type_short_name: SE.string('puller_type_short_name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider_body_shape_name'),
					slider_body_shape_short_name: SE.string(
						'slider_body_shape_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					quantity: SE.number(1),
					weight: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.trx_against_stock'],
			summary: 'create a transaction against stock',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('slider/trx_against_stock'),
			responses: {
				200: SE.response_schema_ref(200, 'slider/trx_against_stock'),
				405: SE.response(405),
			},
		},
	},
	'/slider/trx-against-stock/{uuid}': {
		get: {
			tags: ['slider.trx_against_stock'],
			summary: 'Gets a transaction against stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					name: SE.string('die casting name'),
					die_casting_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('item_name'),
					item_short_name: SE.string('item_short_name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper_number_name'),
					zipper_number_short_name: SE.string(
						'zipper_number_short_name'
					),
					end_type: SE.uuid(),
					end_type_name: SE.string('end_type_name'),
					end_type_short_name: SE.string('end_type_short_name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock_type_name'),
					lock_type_short_name: SE.string('lock_type_short_name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller_type_name'),
					puller_type_short_name: SE.string('puller_type_short_name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider_body_shape_name'),
					slider_body_shape_short_name: SE.string(
						'slider_body_shape_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					quantity: SE.number(1),
					weight: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['slider.trx_against_stock'],
			summary: 'Update an existing transaction against stock',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/trx_against_stock',
						},
					},
				},
			},
			responses: {
				200: SE.response_schema_ref(200, 'slider/trx_against_stock'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.trx_against_stock'],
			summary: 'Deletes a transaction against stock',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

const pathSliderProduction = {
	'/slider/production': {
		get: {
			tags: ['slider.production'],
			summary: 'Get all production',
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					stock_uuid: SE.uuid(),
					production_quantity: SE.number(100),
					weight: SE.number(100),
					wastage: SE.number(1),
					section: SE.string('sa_prod'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['slider.production'],
			summary: 'create a production',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('slider/production'),
			responses: {
				200: SE.response_schema_ref(200, 'slider/production'),
				405: SE.response(405),
			},
		},
	},
	'/slider/production/{uuid}': {
		get: {
			tags: ['slider.production'],
			summary: 'Gets a production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'slider/production'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['slider.production'],
			summary: 'Update an existing production',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('slider/production'),
			responses: {
				200: SE.response_schema_ref(200, 'slider/production'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['slider.production'],
			summary: 'Deletes a production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'uuid')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/slider/production/by/{section}': {
		get: {
			tags: ['slider.production'],
			summary: 'Gets a production',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('section', 'section', 'string', 'sa_prod'),
				SE.parameter_query('from', 'from', SE.date_time()),
				SE.parameter_query('to', 'to', SE.date_time()),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					stock_uuid: SE.uuid(),
					production_quantity: SE.number(100),
					weight: SE.number(100),
					wastage: SE.number(1),
					section: SE.string('sa_prod'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
					item: SE.uuid(),
					item_name: SE.string('item_name'),
					item_short_name: SE.string('item_short_name'),
					zipper_number: SE.uuid(),
					zipper_number_name: SE.string('zipper_number_name'),
					zipper_number_short_name: SE.string(
						'zipper_number_short_name'
					),
					end_type: SE.uuid(),
					end_type_name: SE.string('end_type_name'),
					end_type_short_name: SE.string('end_type_short_name'),
					lock_type: SE.uuid(),
					lock_type_name: SE.string('lock_type_name'),
					lock_type_short_name: SE.string('lock_type_short_name'),
					puller_type: SE.uuid(),
					puller_type_name: SE.string('puller_type_name'),
					puller_type_short_name: SE.string('puller_type_short_name'),
					puller_color: SE.uuid(),
					puller_color_name: SE.string('puller_color_name'),
					puller_color_short_name: SE.string(
						'puller_color_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					logo_type: SE.uuid(),
					logo_type_name: SE.string('logo_type_name'),
					logo_type_short_name: SE.string('logo_type_short_name'),
					slider: SE.uuid(),
					slider_name: SE.string('slider_name'),
					slider_short_name: SE.string('slider_short_name'),
					slider_body_shape: SE.uuid(),
					slider_body_shape_name: SE.string('slider_body_shape_name'),
					slider_body_shape_short_name: SE.string(
						'slider_body_shape_short_name'
					),
					slider_link: SE.uuid(),
					slider_link_name: SE.string('slider_link_name'),
					slider_link_short_name: SE.string('slider_link_short_name'),
					coloring_type: SE.uuid(),
					coloring_type_name: SE.string('coloring_type_name'),
					coloring_type_short_name: SE.string(
						'coloring_type_short_name'
					),
					order_quantity: SE.number(1),
					is_logo_body: SE.number(1),
					is_puller: SE.number(1),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					sa_prod: SE.number(1),
					coloring_stock: SE.number(1),
					coloring_prod: SE.number(1),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

export const pathSlider = {
	...pathSliderStock,
	...pathSliderDieCasting,
	...pathSliderAssemblyStock,
	...pathSliderDieCastingToAssemblyStock,
	...pathSliderDieCastingProduction,
	...pathSliderDieCastingTransaction,
	...pathSliderTransaction,
	...pathSliderColoringTransaction,
	...pathTrxAgainstStock,
	...pathSliderProduction,
};
