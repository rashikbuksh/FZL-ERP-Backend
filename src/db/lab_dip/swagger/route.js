// * LabDip Info * //
export const pathLabDipInfo = {
	'/lab-dip/info': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get all lab dip info',
			description: 'Get all lab dip info',
			parameters: [],
			responses: {
				200: {
					description: 'Returns all lab dip info',
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
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
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
	'/lab-dip/info/by/{lab_dip_info_uuid}': {
		get: {
			tags: ['lab_dip.info'],
			summary: 'Get lab dip info by lab_dip_info_uuid',
			description: 'Get lab dip info by lab_dip_info_uuid',
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									info_id: {
										type: 'string',
										example: 'LDI24-0001',
									},
									name: {
										type: 'string',
										example: 'Lab Dip 1',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									buyer_name: {
										type: 'string',
										example: 'Buyer 1',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'Party 1',
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'Marketing 1',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'Merchandiser 1',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'Factory 1',
									},
									lab_status: {
										type: 'string',
										example: 'Pending',
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
									recipe: {
										type: 'object',
										properties: {
											recipe_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
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
};

// * LabDip Recipe * //

export const pathLabDipRecipe = {
	'/lab-dip/recipe': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get all lab dip recipe',
			description: 'Get all lab dip recipe',
			responses: {
				200: {
					description: 'Returns all lab dip recipe',
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
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
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
	'/lab-dip/recipe/by/{recipe_uuid}': {
		get: {
			tags: ['lab_dip.recipe'],
			summary: 'Get lab dip recipe by recipe_uuid',
			description: 'Get lab dip recipe by recipe_uuid',
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
					description: 'Lab dip recipe found',
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
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
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
									recipe_entry: {
										type: 'object',
										properties: {
											uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											recipe_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'number',
										example: 1,
									},
									recipe_id: {
										type: 'string',
										example: 'LDR24-0001',
									},
									lab_dip_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									name: {
										type: 'string',
										example: 'Recipe 1',
									},
									approved: {
										type: 'number',
										example: 0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									status: {
										type: 'number',
										example: 0,
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
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
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
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
					description: 'Lab dip recipe entry not found',
				},
			},
		},
	},
};

//* LabDip Shade Recipe *//

export const pathLabDipShadeRecipe = {
	'/lab-dip/shade-recipe': {
		get: {
			tags: ['lab_dip.shade_recipe'],
			summary: 'Get all lab dip shade recipe',
			description: 'Get all lab dip shade recipe',
			responses: {
				200: {
					description: 'Returns all lab dip shade recipe',
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
										example: 'Recipe 1',
									},
									sub_streat : {
										type: 'string',
										example: 'Sub Streat',
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
			tags: ['lab_dip.shade_recipe'],
			summary: 'Create a lab dip shade recipe',
			description: 'Create a lab dip shade recipe',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/shade_recipe',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip shade recipe created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/shade_recipe',
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

	'/lab-dip/shade-recipe/{uuid}': {

		get: {
			tags: ['lab_dip.shade_recipe'],
			summary: 'Get lab dip shade recipe by uuid',
			description: 'Get lab dip shade recipe by uuid',
			operationId: 'getLabDipShadeRecipe',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip shade recipe to get',
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
					description: 'Lab dip shade recipe not found',
				},
			},
		},

		put: {
			tags: ['lab_dip.shade_recipe'],
			summary: 'Update an existing lab dip shade recipe',
			description: 'Update an existing lab dip shade recipe',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip shade recipe to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/shade_recipe',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip shade recipe not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},

		delete: {
			tags: ['lab_dip.shade_recipe'],
			summary: 'Delete a lab dip shade recipe',
			description: 'Delete a lab dip shade recipe',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip shade recipe to delete',
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
					description: 'Lab dip shade recipe not found',
				},
			},
		},
	},
};

export const pathLabDipShadeRecipeEntry = {
	'/lab-dip/shade-recipe-entry': {
		get: {
			tags: ['lab_dip.shade_recipe_entry'],
			summary: 'Get all lab dip shade recipe entry',
			description: 'Get all lab dip shade recipe entry',
			responses: {
				200: {
					description: 'Returns all lab dip shade recipe entry',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									shade_recipe_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									shade_recipe_name: {
										type: 'string',
										example: 'Recipe 1',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'Material 1',
									},
									quantity: {
										type: 'number',
										example: 10.0,
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
			tags: ['lab_dip.shade_recipe_entry'],
			summary: 'Create a lab dip shade recipe entry',
			description: 'Create a lab dip shade recipe entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/shade_recipe_entry',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Lab dip shade recipe entry created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/lab_dip/shade_recipe_entry',
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

	'/lab-dip/shade-recipe-entry/{uuid}': {

		get: {
			tags: ['lab_dip.shade_recipe_entry'],
			summary: 'Get lab dip shade recipe entry by uuid',
			description: 'Get lab dip shade recipe entry by uuid',
			operationId: 'getLabDipShadeRecipeEntry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'lab dip shade recipe entry to get',
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
					description: 'Lab dip shade recipe entry not found',
				},
			},
		},
		
		put: {

			tags: ['lab_dip.shade_recipe_entry'],
			summary: 'Update an existing lab dip shade recipe entry',
			description: 'Update an existing lab dip shade recipe entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip shade recipe entry to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/lab_dip/shade_recipe_entry',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lab dip shade recipe entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},

		delete: {
			tags: ['lab_dip.shade_recipe_entry'],
			summary: 'Delete a lab dip shade recipe entry',
			description: 'Delete a lab dip shade recipe entry',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lab dip shade recipe entry to delete',
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
					description: 'Lab dip shade recipe entry not found',
				},
			},
		},
	},
};


export const pathLabDip = {
	...pathLabDipInfo,
	...pathLabDipRecipe,
	...pathLabDipRecipeEntry,
	...pathLabDipShadeRecipe,
	...pathLabDipShadeRecipeEntry
};
