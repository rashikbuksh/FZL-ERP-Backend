import { desc } from 'drizzle-orm';
import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import * as descriptionOperations from './query/description.js';
import * as entryOperations from './query/entry.js';
import * as vendorOperations from './query/vendor.js';
import purchase from './schema.js';

const purchaseRouter = Router();

// Vendor
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

// Vendor routes
purchaseRouter.get('/vendor', vendorOperations.selectAll);
purchaseRouter.get(
	'/vendor/:uuid',

	vendorOperations.select
);
purchaseRouter.post('/vendor', vendorOperations.insert);
purchaseRouter.put('/vendor/:uuid', vendorOperations.update);
purchaseRouter.delete(
	'/vendor/:uuid',

	vendorOperations.remove
);

// Description

const pathPurchaseDescription = {
	'/purchase/description': {
		get: {
			summary: 'Get all descriptions',
			tags: ['purchase.description'],
			operationId: 'getDescriptions',
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
	'/purchase/description/by/{purchase_description_uuid}': {
		get: {
			summary: 'Get a description by purchase description UUID',
			tags: ['purchase.description'],
			operationId: 'getDescriptionByPurchaseDescriptionUuid',
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
};

// Description routes
purchaseRouter.get('/description', descriptionOperations.selectAll);
purchaseRouter.get(
	'/description/:uuid',

	descriptionOperations.select
);
purchaseRouter.post('/description', descriptionOperations.insert);
purchaseRouter.put('/description/:uuid', descriptionOperations.update);

purchaseRouter.delete(
	'/description/:uuid',

	descriptionOperations.remove
);
purchaseRouter.get(
	'/description/by/:purchase_description_uuid',
	descriptionOperations.selectDescriptionByPurchaseDescriptionUuid
);
purchaseRouter.get(
	'/purchase-details/by/:purchase_description_uuid',
	descriptionOperations.selectPurchaseDetailsByPurchaseDescriptionUuid
);

// Entry

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

// Entry routes
purchaseRouter.get('/entry', entryOperations.selectAll);
purchaseRouter.get('/entry/:uuid', entryOperations.select);
purchaseRouter.post('/entry', entryOperations.insert);
purchaseRouter.put('/entry/:uuid', entryOperations.update);
purchaseRouter.delete(
	'/entry/:uuid',

	entryOperations.remove
);
purchaseRouter.get(
	'/entry/by/:purchase_description_uuid',
	entryOperations.selectEntryByPurchaseDescriptionUuid
);

export const pathPurchase = {
	...pathPurchaseVendor,
	...pathPurchaseDescription,
	...pathPurchaseEntry,
};

export { purchaseRouter };
