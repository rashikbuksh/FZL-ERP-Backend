import SE, { SED } from '../../../util/swagger_example.js';

// * Purchase Vendor * //
const pathPurchaseVendor = {
	'/purchase/vendor': {
		get: {
			summary: 'Get all vendors',
			tags: ['purchase.vendor'],
			operationId: 'getVendors',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/purchase/vendor',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a vendor',
			tags: ['purchase.vendor'],
			operationId: 'createVendor',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/purchase/vendor',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/purchase/vendor/{uuid}': {
		get: {
			summary: 'Get a vendor',
			tags: ['purchase.vendor'],
			operationId: 'getVendor',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Vendor UUID',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/purchase/vendor',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a vendor',
			tags: ['purchase.vendor'],
			operationId: 'updateVendor',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/purchase/vendor',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a vendor',
			tags: ['purchase.vendor'],
			operationId: 'deleteVendor',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Purchase Description * //
const pathPurchaseDescription = {
	'/purchase/description': {
		get: {
			summary: 'Get all descriptions',
			tags: ['purchase.description'],
			operationId: 'getDescriptions',
			parameters: [
				SE.parameter_query('s_type', 's_type', ['rm', 'accessories']),
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_id: {
										type: 'string',
										example: 'SR24-0001',
									},
									vendor_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									vendor_name: {
										type: 'string',
										example: 'John Doe',
									},
									is_local: {
										type: 'integer',
										example: 1,
									},
									lc_number: {
										type: 'string',
										example: '123456789',
									},
									challan_number: {
										type: 'string',
										example: '123456789',
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
										example: 'This is a description',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a description',
			tags: ['purchase.description'],
			operationId: 'createDescription',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/purchase/description',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/purchase/description/{uuid}': {
		get: {
			summary: 'Get a description',
			tags: ['purchase.description'],
			operationId: 'getDescription',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/purchase/description',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a description',
			tags: ['purchase.description'],
			operationId: 'updateDescription',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/purchase/description',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_id: {
										type: 'string',
										example: 'SR24-0001',
									},
									vendor_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									vendor_name: {
										type: 'string',
										example: 'John Doe',
									},
									is_local: {
										type: 'integer',
										example: 1,
									},
									lc_number: {
										type: 'string',
										example: '123456789',
									},
									challan_number: {
										type: 'string',
										example: '123456789',
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
										example: 'This is a description',
									},
								},
							},
						},
					},
				},
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a description',
			tags: ['purchase.description'],
			operationId: 'deleteDescription',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_id: {
										type: 'string',
										example: 'SR24-0001',
									},
									vendor_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									vendor_name: {
										type: 'string',
										example: 'John Doe',
									},
									is_local: {
										type: 'integer',
										example: 1,
									},
									lc_number: {
										type: 'string',
										example: '123456789',
									},
									challan_number: {
										type: 'string',
										example: '123456789',
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
										example: 'This is a description',
									},
								},
							},
						},
					},
				},
				204: {
					description: 'No Content',
				},
			},
		},
	},
	'/purchase/purchase-details/by/{purchase_description_uuid}': {
		get: {
			summary: 'Get purchase details by purchase description UUID',
			tags: ['purchase.description'],
			operationId: 'getPurchaseDetailsByPurchaseDescriptionUuid',
			parameters: [
				{
					name: 'purchase_description_uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_id: {
										type: 'string',
										example: 'SR24-0001',
									},
									vendor_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									vendor_name: {
										type: 'string',
										example: 'John Doe',
									},
									is_local: {
										type: 'integer',
										example: 1,
									},
									lc_number: {
										type: 'string',
										example: '123456789',
									},
									challan_number: {
										type: 'string',
										example: '123456789',
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
										example: 'This is a description',
									},
									purchase: {
										type: 'object',
										properties: {
											uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											purchase_description_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											material_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											material_name: {
												type: 'string',
												example: 'nylon',
											},
											unit: {
												type: 'string',
												example: 'kg',
											},
											quantity: {
												type: 'number',
												example: 1000.0,
											},
											price: {
												type: 'number',
												example: 1111.0,
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
												example: 'This is an entry',
											},
										},
									},
								},
							},
						},
					},
				},
				204: {
					description: 'No Content',
				},
			},
		},
	},
	'/purchase/purchase-log': {
		get: {
			summary: 'Get purchase log',
			tags: ['purchase.description'],
			operationId: 'getPurchaseLog',
			parameters: [
				SE.parameter_query('s_type', 's_type', ['rm', 'accessories']),
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										uuid: SE.uuid(),
										purchase_id: {
											type: 'string',
											example: 'SR24-0001',
										},
										vendor_uuid: SE.uuid(),
										vendor_name: {
											type: 'string',
											example: 'John Doe',
										},
										is_local: {
											type: 'integer',
											example: 1,
										},
										lc_number: {
											type: 'string',
											example: '123456789',
										},
										challan_number: {
											type: 'string',
											example: '123456789',
										},
										material_uuid: SE.uuid(),
										material_name: {
											type: 'string',
											example: 'material 1',
										},
										quantity: SE.number(10.0),
										price: SE.number(10.0),
										unit: {
											type: 'string',
											example: 'kg',
										},
										created_by: SE.uuid(),
										created_by_name: {
											type: 'string',
											example: 'John Doe',
										},
										created_at: SE.date_time(),
										updated_at: SE.date_time(),
										remarks: {
											type: 'string',
											example: 'This is a description',
										},
										entry_remarks: {
											type: 'string',
											example: 'This is an entry',
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

// * Purchase Entry * //

const pathPurchaseEntry = {
	'/purchase/entry': {
		get: {
			summary: 'Get all entries',
			tags: ['purchase.entry'],
			operationId: 'getEntries',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'nylon',
									},
									unit: {
										type: 'string',
										example: 'kg',
									},
									quantity: {
										type: 'number',
										example: 1000.0,
									},
									price: {
										type: 'number',
										example: 1111.0,
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
										example: 'This is an entry',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create an entry',
			tags: ['purchase.entry'],
			operationId: 'createEntry',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/purchase/entry',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/purchase/entry/{uuid}': {
		get: {
			summary: 'Get an entry',
			tags: ['purchase.entry'],
			operationId: 'getEntry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'nylon',
									},
									unit: {
										type: 'string',
										example: 'kg',
									},
									quantity: {
										type: 'number',
										example: 1000.0,
									},
									price: {
										type: 'number',
										example: 1111.0,
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
										example: 'This is an entry',
									},
								},
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update an entry',
			tags: ['purchase.entry'],
			operationId: 'updateEntry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/purchase/entry',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete an entry',
			tags: ['purchase.entry'],
			operationId: 'deleteEntry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
	'/purchase/entry/by/{purchase_description_uuid}': {
		get: {
			summary: 'Get an entry by purchase description UUID',
			tags: ['purchase.entry'],
			operationId: 'getEntryByPurchaseDescriptionUuid',
			parameters: [
				{
					name: 'purchase_description_uuid',
					in: 'path',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									purchase_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'nylon',
									},
									unit: {
										type: 'string',
										example: 'kg',
									},
									quantity: {
										type: 'number',
										example: 1000.0,
									},
									price: {
										type: 'number',
										example: 1111.0,
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
										example: 'This is an entry',
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

export const pathPurchase = {
	...pathPurchaseVendor,
	...pathPurchaseDescription,
	...pathPurchaseEntry,
};
