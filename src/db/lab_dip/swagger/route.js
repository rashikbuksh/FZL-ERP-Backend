import SE, { SED } from '../../../util/swagger_example.js';

// * LabDip Info * //
export const pathLabDipInfo = {
	'/lab-dip/info': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get all lab dip info',
			description: 'Get all lab dip info',
			parameters: [
				SE.parameter_query(
					'type',
					'type',
					[
						'zipper_sample',
						'zipper_bulk',
						'thread_sample',
						'thread_bulk',
						'all',
					],
					true
				),
			],
			responses: {
				200: {
					description: 'Returns all lab dip info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.number(1),
									info_id: SE.string('LDI24-0001'),
									name: SE.string('Lab Dip 1'),
									order_info_uuid: SE.uuid(),
									thread_order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									buyer_uuid: SE.uuid(),
									buyer_name: SE.string('Buyer 1'),
									party_uuid: SE.uuid(),
									party_name: SE.string('Party 1'),
									marketing_uuid: SE.uuid(),
									marketing_name: SE.string('Marketing 1'),
									merchandiser_uuid: SE.uuid(),
									merchandiser_name:
										SE.string('Merchandiser 1'),
									factory_uuid: SE.uuid(),
									factory_name: SE.string('Factory 1'),
									lab_status: SE.string('pending'),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
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
			tags: ['lab_dip.info'],
			summary: 'Create a lab dip info',
			description: 'Create a lab dip info',
			operationId: 'createLabDipInfo',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/info',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip info created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/info',
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
	'/lab-dip/info/{uuid}': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip info by uuid',
			description: 'Get lab dip info by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip info to get',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip info found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.integer(0),
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: SE.uuid(),
									thread_order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									buyer_uuid: SE.uuid(),
									buyer_name: SE.string('Buyer 1'),
									party_uuid: SE.uuid(),
									party_name: SE.string('Party 1'),
									marketing_uuid: SE.uuid(),
									marketing_name: SE.string('Marketing 1'),
									merchandiser_uuid: SE.uuid(),
									merchandiser_name:
										SE.string('Merchandiser 1'),
									factory_uuid: SE.uuid(),
									factory_name: SE.string('Factory 1'),
									lab_status: SE.string('pending'),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
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
					description: 'Lab dip info not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.info'],
			summary: 'Update an existing lab dip info',
			description: 'Update an existing lab dip info',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip info to update',
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
							$ref: '#/definitions/lab_dip/info',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.info'],
			summary: 'Delete a lab dip info',
			description: 'Delete a lab dip info',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip info to delete',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info not found',
				},
			},
		},
	},
	'/lab-dip/info/details/{lab_dip_info_uuid}': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip recipe by lab_dip_info_uuid',
			description: 'Get lab dip recipe by lab_dip_info_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'lab_dip_info_uuid',
					in: 'path',
					description: 'lab dip info to get',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip info found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.integer(0),
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: SE.uuid(),
									thread_order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									buyer_uuid: SE.uuid(),
									buyer_name: SE.string('Buyer 1'),
									party_uuid: SE.uuid(),
									party_name: SE.string('Party 1'),
									marketing_uuid: SE.uuid(),
									marketing_name: SE.string('Marketing 1'),
									merchandiser_uuid: SE.uuid(),
									merchandiser_name:
										SE.string('Merchandiser 1'),
									factory_uuid: SE.uuid(),
									factory_name: SE.string('Factory 1'),
									lab_status: SE.string('pending'),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									recipe: {
										type: 'object',
										properties: {
											recipe_uuid: SE.uuid(),
											recipe_name: {
												type: 'string',
												example:
													'LDR24-0001 - Recipe 1',
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
					description: 'Lab dip info not found',
				},
			},
		},
	},
	'/lab-dip/info-recipe-dashboard': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip info recipe dashboard',
			description: 'Get lab dip info recipe dashboard',
			produces: ['application/json'],
			parameters: [],
			responses: {
				200: {
					description: 'Lab dip info recipe dashboard found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									order_info_uuid: SE.uuid(),
									info_name: SE.string('Lab Dip 1'),
									info_entry_uuid: SE.uuid(),
									approved: SE.number(0),
									approved_date: SE.date_time(),
									recipe_uuid: SE.uuid(),
									recipe_name: SE.string(
										'LDR25-0001 - Recipe 1'
									),
									is_zipper_order: SE.number(0),
								},
							},
						},
					},
				},
			},
		},
	},
};

// * LabDip Info Entry * //

export const pathLabDipInfoEntry = {
	'/lab-dip/info-entry': {
		get: {
			tags: ['lab_dip.info_entry'],
			summary: 'Get all lab dip info entry',
			description: 'Get all lab dip info entry',
			parameters: [],
			responses: {
				200: {
					description: 'Returns all lab dip info entry',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									lab_dip_info_uuid: SE.uuid(),
									recipe_uuid: SE.uuid(),
									approved: SE.integer(0),
									approved_date: SE.date_time(),
									created_by: SE.uuid(),
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
			tags: ['lab_dip.info_entry'],
			summary: 'Create a lab dip info entry',
			description: 'Create a lab dip info entry',
			operationId: 'createLabDipInfoEntry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/info_entry',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip info entry created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/info_entry',
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
	'/lab-dip/info-entry/{uuid}': {
		get: {
			tags: ['lab_dip.info_entry'],
			summary: 'Get lab dip info entry by uuid',
			description: 'Get lab dip info entry by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip info entry to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip info entry found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									lab_dip_info_uuid: SE.uuid(),
									recipe_uuid: SE.uuid(),
									approved: SE.integer(0),
									approved_date: SE.date_time(),
									created_by: SE.uuid(),
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
					description: 'Lab dip info entry not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.info_entry'],
			summary: 'Update an existing lab dip info entry',
			description: 'Update an existing lab dip info entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip info entry to update',
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
							$ref: '#/definitions/lab_dip/info_entry',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.info_entry'],
			summary: 'Delete a lab dip info entry',
			description: 'Delete a lab dip info entry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip info entry to delete',
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip info entry not found',
				},
			},
		},
	},
};

// * LabDip Recipe * //

export const pathLabDipRecipe = {
	'/lab-dip/recipe': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get all lab dip recipe',
			description: 'Get all lab dip recipe',
			parameters: [
				SE.parameter_query(
					'type',
					'type',
					['txp', 'ssp', 'zipper_sample', 'bulk', 'others'],
					true
				),
			],
			responses: {
				200: {
					description: 'Returns all lab dip recipe',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.integer(0),
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: SE.uuid(),
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: SE.integer(0),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
									status: SE.integer(0),
									sub_streat: {
										type: 'string',
										example: 'Sub Streat 1',
									},
									bleaching: {
										type: 'string',
										example: 'bleach',
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
		post: {
			tags: ['lab_dip.recipe'],
			summary: 'Create a lab dip recipe',
			description: 'Create a lab dip recipe',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip recipe created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/recipe',
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
	'/lab-dip/recipe/{uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe by uuid',
			description: 'Get lab dip recipe by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip recipe to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.integer(0),
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: SE.uuid(),
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: SE.integer(0),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
									status: SE.integer(0),
									sub_streat: {
										type: 'string',
										example: 'Sub Streat 1',
									},
									bleaching: {
										type: 'string',
										example: 'bleach',
									},
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
					description: 'Lab dip recipe not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.recipe'],
			summary: 'Update an existing lab dip recipe',
			description: 'Update an existing lab dip recipe',
			operationId: 'updateLabDipRecipe',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.recipe'],
			summary: 'Delete a lab dip recipe',
			description: 'Delete a lab dip recipe',
			operationId: 'deleteLabDipRecipe',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe to delete',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
			},
		},
	},
	'/lab-dip/recipe/details/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe details by recipe_uuid',
			description: 'Get lab dip recipe details by recipe_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'lab dip recipe to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe details found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.integer(0),
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: SE.uuid(),
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: SE.integer(0),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
									status: SE.integer(0),
									sub_streat: {
										type: 'string',
										example: 'Sub Streat 1',
									},
									bleaching: {
										type: 'string',
										example: 'bleach',
									},
									created_at: SE.date_time(),
									updated_at: SE.date_time(),
									remarks: SE.string('remarks'),
									recipe_entry: {
										type: 'object',
										properties: {
											uuid: SE.uuid(),
											recipe_uuid: SE.uuid(),
											recipe_name: SE.string('Recipe 1'),
											color: {
												type: 'string',
												example: 'Red',
											},
											quantity: {
												type: 'number',
												example: 10.0,
											},
											material_uuid: SE.uuid(),
											material_name: {
												type: 'string',
												example: 'Material 1',
											},
											unit: {
												type: 'string',
												example: 'kg',
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
					description: 'Lab dip recipe details not found',
				},
			},
		},
	},
	'/lab-dip/info-recipe/by/{lab_dip_info_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe by lab_dip_info_uuid',
			description: 'Get lab dip recipe by lab_dip_info_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'lab_dip_info_uuid',
					in: 'path',
					description: 'lab dip info to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									id: SE.integer(0),
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: SE.uuid(),
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									order_info_uuid: SE.uuid(),
									order_number: SE.string('ZS25-0001'),
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: SE.integer(0),
									created_by: SE.uuid(),
									created_by_name: SE.string('name'),
									status: SE.integer(0),
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
					description: 'Lab dip recipe not found',
				},
			},
		},
	},
	'/lab-dip/update-recipe/by/{recipe_uuid}': {
		put: {
			tags: ['lab_dip.recipe'],
			summary: 'Update an existing lab dip recipe by recipe_uuid',
			description: 'Update an existing lab dip recipe by recipe_uuid',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'Lab dip info to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								lab_dip_info_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								approved: {
									type: 'number',
									example: 0,
								},
								status: {
									type: 'number',
									example: 0,
								},
							},
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
	},
	'/lab-dip/update-recipe/remove-lab-dip-info-uuid/by/{recipe_uuid}': {
		put: {
			tags: ['lab_dip.recipe'],
			summary: 'Update an existing lab dip recipe by recipe_uuid',
			description: 'Update an existing lab dip recipe by recipe_uuid',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'Lab dip info to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
	},
};

// * LabDip Recipe Entry * //
export const pathLabDipRecipeEntry = {
	'/lab-dip/recipe-entry': {
		get: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Get all lab dip recipe entry',
			description: 'Get all lab dip recipe entry',
			responses: {
				200: {
					description: 'Returns all lab dip recipe entry',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									recipe_uuid: SE.uuid(),
									recipe_name: {
										type: 'string',
										example: 'Recipe 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									quantity: {
										type: 'number',
										example: 10.0,
									},
									material_uuid: SE.uuid(),
									material_name: {
										type: 'string',
										example: 'Material 1',
									},
									unit: {
										type: 'string',
										example: 'kg',
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
		post: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Create a lab dip recipe entry',
			description: 'Create a lab dip recipe entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe_entry',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip recipe entry created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/recipe_entry',
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
	'/lab-dip/recipe-entry/{uuid}': {
		get: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Get lab dip recipe entry by uuid',
			description: 'Get lab dip recipe entry by uuid',
			operationId: 'getLabDipRecipeEntry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip recipe entry to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
			},
		},
		put: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Update an existing lab dip recipe entry',
			description: 'Update an existing lab dip recipe entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe entry to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/recipe_entry',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Delete a lab dip recipe entry',
			description: 'Delete a lab dip recipe entry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip recipe entry to delete',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip recipe entry not found',
				},
			},
		},
	},
	'/lab-dip/recipe-entry/by/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe_entry'],
			summary: 'Get lab dip recipe entry by recipe_uuid',
			description: 'Get lab dip recipe entry by recipe_uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'recipe_uuid',
					in: 'path',
					description: 'lab dip recipe entry to get',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Lab dip recipe entry found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									recipe_uuid: SE.uuid(),
									recipe_name: {
										type: 'string',
										example: 'Recipe 1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									quantity: {
										type: 'number',
										example: 10.0,
									},
									material_uuid: SE.uuid(),
									material_name: {
										type: 'string',
										example: 'Material 1',
									},
									unit: {
										type: 'string',
										example: 'kg',
									},
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
					description: 'Lab dip recipe entry not found',
				},
			},
		},
	},
};

export const pathLabDip = {
	...pathLabDipInfo,
	...pathLabDipInfoEntry,
	...pathLabDipRecipe,
	...pathLabDipRecipeEntry,
};
