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
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_number_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_number_short_name: {
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
									lock_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lock_type_name: {
										type: 'string',
										example: 'Auto Lock',
									},
									lock_type_short_name: {
										type: 'string',
										example: 'AL',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
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
									slider: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_name: {
										type: 'string',
										example: 'slider name',
									},
									slider_short_name: {
										type: 'string',
										example: 'slider short name',
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
									slider_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_link_name: {
										type: 'string',
										example: 'slider link name',
									},
									slider_link_short_name: {
										type: 'string',
										example: 'slider link short name',
									},
									coloring_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coloring_type_name: {
										type: 'string',
										example: 'coloring type name',
									},
									coloring_type_short_name: {
										type: 'string',
										example: 'coloring type short name',
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
									is_logo_body: {
										type: 'number',
										example: 0,
									},
									is_logo_puller: {
										type: 'number',
										example: 0,
									},
									order_quantity: {
										type: 'number',
										example: 0.0,
									},
									body_quantity: {
										type: 'number',
										example: 0.0,
									},
									cap_quantity: {
										type: 'number',
										example: 0.0,
									},
									puller_quantity: {
										type: 'number',
										example: 0.0,
									},
									link_quantity: {
										type: 'number',
										example: 0.0,
									},
									sa_prod: {
										type: 'number',
										example: 0.0,
									},
									coloring_stock: {
										type: 'number',
										example: 0.0,
									},
									coloring_prod: {
										type: 'number',
										example: 0.0,
									},
									trx_to_finishing: {
										type: 'number',
										example: 0.0,
									},
									u_top_quantity: {
										type: 'number',
										example: 0.0,
									},
									h_bottom_quantity: {
										type: 'number',
										example: 0.0,
									},
									box_pin_quantity: {
										type: 'number',
										example: 0.0,
									},
									two_way_pin_quantity: {
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
				405: {
					description: 'Invalid input',
				},
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
									zipper_number: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									zipper_number_name: {
										type: 'string',
										example: 'zipper name',
									},
									zipper_number_short_name: {
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
									lock_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lock_type_name: {
										type: 'string',
										example: 'Auto Lock',
									},
									lock_type_short_name: {
										type: 'string',
										example: 'AL',
									},
									puller_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
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
									slider: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_name: {
										type: 'string',
										example: 'slider name',
									},
									slider_short_name: {
										type: 'string',
										example: 'slider short name',
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
									slider_link: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									slider_link_name: {
										type: 'string',
										example: 'slider link name',
									},
									slider_link_short_name: {
										type: 'string',
										example: 'slider link short name',
									},
									coloring_type: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									coloring_type_name: {
										type: 'string',
										example: 'coloring type name',
									},
									coloring_type_short_name: {
										type: 'string',
										example: 'coloring type short name',
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
									is_logo_body: {
										type: 'number',
										example: 0,
									},
									is_logo_puller: {
										type: 'number',
										example: 0,
									},
									order_quantity: {
										type: 'number',
										example: 0.0,
									},
									body_quantity: {
										type: 'number',
										example: 0.0,
									},
									cap_quantity: {
										type: 'number',
										example: 0.0,
									},
									puller_quantity: {
										type: 'number',
										example: 0.0,
									},
									link_quantity: {
										type: 'number',
										example: 0.0,
									},
									sa_prod: {
										type: 'number',
										example: 0.0,
									},
									coloring_stock: {
										type: 'number',
										example: 0.0,
									},
									coloring_prod: {
										type: 'number',
										example: 0.0,
									},
									trx_to_finishing: {
										type: 'number',
										example: 0.0,
									},
									u_top_quantity: {
										type: 'number',
										example: 0.0,
									},
									h_bottom_quantity: {
										type: 'number',
										example: 0.0,
									},
									box_pin_quantity: {
										type: 'number',
										example: 0.0,
									},
									two_way_pin_quantity: {
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
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Stock not found',
				},
				405: {
					description: 'Validation exception',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
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
				405: {
					description: 'Invalid input',
				},
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
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Die casting not found',
				},
				405: {
					description: 'Validation exception',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
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
				405: {
					description: 'Invalid input',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Die casting production not found',
				},
				405: {
					description: 'Validation exception',
				},
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
				400: {
					description: 'Invalid UUID supplied',
				},
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
									stock_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									trx_quantity: {
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
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/die_casting_transaction',
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
							$ref: '#/definitions/slider/die_casting_transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'die casting transaction to get',
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
					description: 'Die casting transaction not found',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting transaction to update',
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
							$ref: '#/definitions/slider/die_casting_transaction',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Die casting transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.die_casting_transaction'],
			summary: 'Deletes a die casting transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Die casting transaction to delete',
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
					description: 'Die casting transaction not found',
				},
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
									stock_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section: {
										type: 'string',
										example: 'section',
									},
									trx_quantity: {
										type: 'number',
										example: 0.0,
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
										example: 'HR',
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
					},
				},
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
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/transaction',
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
							$ref: '#/definitions/slider/transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'transaction to get',
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
					description: 'Transaction not found',
				},
			},
		},
		put: {
			tags: ['slider.transaction'],
			summary: 'Update an existing transaction',
			description: '',
			// operationId: "updatePet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Transaction to update',
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
							$ref: '#/definitions/slider/transaction',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.transaction'],
			summary: 'Deletes a transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Transaction to delete',
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
					description: 'Transaction not found',
				},
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
									stock_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									trx_quantity: {
										type: 'number',
										example: 0.0,
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
										example: 'HR',
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
					},
				},
			},
		},
		post: {
			tags: ['slider.coloring_transaction'],
			summary: 'create a coloring transaction',
			description: '',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/slider/coloring_transaction',
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
							$ref: '#/definitions/slider/coloring_transaction',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'coloring transaction to get',
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
					description: 'Coloring transaction not found',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'Coloring transaction to update',
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
							$ref: '#/definitions/slider/coloring_transaction',
						},
					},
				},
			},

			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Coloring transaction not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['slider.coloring_transaction'],
			summary: 'Deletes a coloring transaction',
			description: '',
			// operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Coloring transaction to delete',
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
					description: 'Coloring transaction not found',
				},
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
};
