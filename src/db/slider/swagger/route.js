import SE, { SED } from '../../../util/swagger_example.js';

// * Slider Stock * //
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
									uuid: SE.uuid(),
									order_info_uuid: SE.uuid(),
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
									zipper_number: SE.uuid(),
									zipper_number_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_number_short_name: {
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
									lock_type: SE.uuid(),
									lock_type_name: {
										type: 'string',
										example: 'Auto Lock',
									},
									lock_type_short_name: {
										type: 'string',
										example: 'AL',
									},
									puller_type: SE.uuid(),
									puller_type_name: {
										type: 'string',
										example: 'puller name',
									},
									puller_type_short_name: {
										type: 'string',
										example: 'puller short name',
									},
									puller_color: {
										type: 'string',
										example: 'red',
									},
									puller_color_name: {
										type: 'string',
										example: 'red',
									},
									puller_color_short_name: {
										type: 'string',
										example: 'red',
									},
									puller_link: SE.uuid(),
									puller_link_name: {
										type: 'string',
										example: 'puller link name',
									},
									puller_link_short_name: {
										type: 'string',
										example: 'puller link short name',
									},
									slider: SE.uuid(),
									slider_name: {
										type: 'string',
										example: 'slider name',
									},
									slider_short_name: {
										type: 'string',
										example: 'slider short name',
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
										example: 'slider link name',
									},
									slider_link_short_name: {
										type: 'string',
										example: 'slider link short name',
									},
									coloring_type: SE.uuid(),
									coloring_type_name: {
										type: 'string',
										example: 'coloring type name',
									},
									coloring_type_short_name: {
										type: 'string',
										example: 'coloring type short name',
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
									is_logo_body: {
										type: 'number',
										example: 0,
									},
									is_logo_puller: {
										type: 'number',
										example: 0,
									},
									order_quantity: SE.number(1),
									body_quantity: SE.number(1),
									cap_quantity: SE.number(1),
									puller_quantity: SE.number(1),
									link_quantity: SE.number(1),
									sa_prod: SE.number(1),
									coloring_stock: SE.number(1),
									coloring_prod: SE.number(1),
									trx_to_finishing: SE.number(1),
									u_top_quantity: SE.number(1),
									h_bottom_quantity: SE.number(1),
									box_pin_quantity: SE.number(1),
									two_way_pin_quantity: SE.number(1),
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
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									order_info_uuid: SE.uuid(),
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
									zipper_number: SE.uuid(),
									zipper_number_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_number_short_name: {
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
									lock_type: SE.uuid(),
									lock_type_name: {
										type: 'string',
										example: 'Auto Lock',
									},
									lock_type_short_name: {
										type: 'string',
										example: 'AL',
									},
									puller_type: SE.uuid(),
									puller_type_name: {
										type: 'string',
										example: 'puller name',
									},
									puller_type_short_name: {
										type: 'string',
										example: 'puller short name',
									},
									puller_color: {
										type: 'string',
										example: 'red',
									},
									puller_color_name: {
										type: 'string',
										example: 'red',
									},
									puller_color_short_name: {
										type: 'string',
										example: 'red',
									},
									puller_link: SE.uuid(),
									puller_link_name: {
										type: 'string',
										example: 'puller link name',
									},
									puller_link_short_name: {
										type: 'string',
										example: 'puller link short name',
									},
									slider: SE.uuid(),
									slider_name: {
										type: 'string',
										example: 'slider name',
									},
									slider_short_name: {
										type: 'string',
										example: 'slider short name',
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
										example: 'slider link name',
									},
									slider_link_short_name: {
										type: 'string',
										example: 'slider link short name',
									},
									coloring_type: SE.uuid(),
									coloring_type_name: {
										type: 'string',
										example: 'coloring type name',
									},
									coloring_type_short_name: {
										type: 'string',
										example: 'coloring type short name',
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
									is_logo_body: {
										type: 'number',
										example: 0,
									},
									is_logo_puller: {
										type: 'number',
										example: 0,
									},
									order_quantity: SE.number(1),
									body_quantity: SE.number(1),
									cap_quantity: SE.number(1),
									puller_quantity: SE.number(1),
									link_quantity: SE.number(1),
									sa_prod: SE.number(1),
									coloring_stock: SE.number(1),
									coloring_prod: SE.number(1),
									trx_to_finishing: SE.number(1),
									u_top_quantity: SE.number(1),
									h_bottom_quantity: SE.number(1),
									box_pin_quantity: SE.number(1),
									two_way_pin_quantity: SE.number(1),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
								},
							},
						},
					},
				},
				400: SE.response(400),
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
				400: SE.response(400),
				404: {
					description: 'Stock not found',
				},
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
				400: SE.response(400),
				404: {
					description: 'Stock not found',
				},
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
									puller_link: SE.uuid(),
									puller_link_name: {
										type: 'string',
										example: 'puller link name',
									},
									puller_link_short_name: {
										type: 'string',
										example: 'puller link short name',
									},
									stopper_type: SE.uuid(),
									stopper_type_name: {
										type: 'string',
										example: 'stopper type name',
									},
									stopper_type_short_name: {
										type: 'string',
										example: 'stopper type short name',
									},
									quantity: SE.number(1),
									weight: SE.number(1),
									pcs_per_kg: SE.number(1),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									is_body: {
										type: 'number',
										example: 0,
									},
									is_puller: {
										type: 'number',
										example: 0,
									},
									is_cap: {
										type: 'number',
										example: 0,
									},
									is_link: {
										type: 'number',
										example: 0,
									},
									is_h_bottom: {
										type: 'number',
										example: 0,
									},
									is_u_top: {
										type: 'number',
										example: 0,
									},
									is_box_pin: {
										type: 'number',
										example: 0,
									},
									is_two_way_pin: {
										type: 'number',
										example: 0,
									},
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
							slider_body_shape: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							slider_body_shape_name: {
								type: 'string',
								example: 'body shape name',
							},
							slider_body_shape_short_name: {
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
							is_body: {
								type: 'number',
								example: 0,
							},
							is_puller: {
								type: 'number',
								example: 0,
							},
							is_cap: {
								type: 'number',
								example: 0,
							},
							is_link: {
								type: 'number',
								example: 0,
							},
							is_h_bottom: {
								type: 'number',
								example: 0,
							},
							is_u_top: {
								type: 'number',
								example: 0,
							},
							is_box_pin: {
								type: 'number',
								example: 0,
							},
							is_two_way_pin: {
								type: 'number',
								example: 0,
							},
							quantity_in_sa: {
								type: 'number',
								example: 0.0,
							},
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
};

// * Slider Die Casting Production * //
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
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									die_casting_uuid: SE.uuid(),
									die_casting_name: {
										type: 'string',
										example: 'die casting name',
									},
									order_info_uuid: SE.uuid(),
									order_number: {
										type: 'string',
										example: 'order number',
									},
									mc_no: {
										type: 'number',
										example: 0,
									},
									cavity_goods: {
										type: 'number',
										example: 0,
									},
									cavity_defect: {
										type: 'number',
										example: 0,
									},
									push: {
										type: 'number',
										example: 0,
									},
									production_quantity: {
										type: 'number',
										example: 0,
									},
									weight: SE.number(1),
									pcs_per_kg: SE.number(1),
									created_by: SE.uuid(),
									created_by_name: SE.string('John Doe'),
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
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						properties: {
							uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							die_casting_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							die_casting_name: {
								type: 'string',
								example: 'die casting name',
							},
							order_info_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							order_number: {
								type: 'string',
								example: 'order number',
							},
							mc_no: {
								type: 'number',
								example: 0,
							},
							cavity_goods: {
								type: 'number',
								example: 0,
							},
							cavity_defect: {
								type: 'number',
								example: 0,
							},
							push: {
								type: 'number',
								example: 0,
							},
							production_quantity: {
								type: 'number',
								example: 0,
							},
							weight: {
								type: 'number',
								example: 0.0,
							},
							pcs_per_kg: {
								type: 'number',
								example: 0.0,
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
								example: 'remarks',
							},
						},
					},
				},
				400: SE.response(400),
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
					example: 'igD0v9DIJQhJeet',
				},
			],
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
				400: SE.response(400),
				404: {
					description: 'Die casting production not found',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting production to delete',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: SE.response(400),
				404: {
					description: 'Die casting production not found',
				},
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
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									die_casting_uuid: SE.uuid(),
									die_casting_name: SE.string('V-3-OE-SP'),
									stock_uuid: SE.uuid(),
									trx_quantity: SE.number(1),
									type: SE.string('body'),
									created_by: SE.uuid(),
									created_by_name: SE.string('John Doe'),
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
				200: SE.response_schema_ref(
					200,
					'slider/die_casting_transaction'
				),
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
	'/slider/die-casting-insert/by/order': {
		post: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Insert die casting by order',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody({
				is_body: SE.number(1),
				is_body_uuid: SE.uuid(),
				is_cap: SE.number(1),
				is_cap_uuid: SE.uuid(),
				is_puller: SE.number(1),
				is_puller_uuid: SE.uuid(),
				is_link: SE.number(1),
				is_link_uuid: SE.uuid(),
				item: SE.uuid(),
				zipper_number: SE.uuid(),
				end_type: SE.uuid(),
				logo_type: SE.uuid(),
				puller_type: SE.uuid(),
				slider_body_shape: SE.uuid(),
				puller_link: SE.uuid(),
				order_info_uuid: SE.string(),
				trx_quantity: SE.number(100),
				created_by: SE.uuid(),
				created_by_name: SE.string('John Doe'),
				remarks: SE.string(),
			}),
			responses: {
				200: SE.response_schema_ref(
					200,
					'slider/die_casting_transaction'
				),
				405: SE.response(405),
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
					section: SE.string('section'),
					trx_quantity: SE.number(100),
					trx_quantity_in_kg: SE.number(100),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string(),
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
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [SE.parameter_params('uuid', 'transaction to get')],
			responses: {
				200: SE.response_schema_ref(200, 'slider/transaction'),
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
					die_casting_uuid: SE.uuid(),
					quantity: SE.number(1),
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
					wastage: SE.number(1),
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
};

export const pathSlider = {
	...pathSliderStock,
	...pathSliderDieCasting,
	...pathSliderDieCastingProduction,
	...pathSliderDieCastingTransaction,
	...pathSliderTransaction,
	...pathSliderColoringTransaction,
	...pathTrxAgainstStock,
	...pathSliderProduction,
};
