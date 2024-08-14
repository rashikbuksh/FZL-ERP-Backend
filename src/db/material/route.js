import { Router } from 'express';
import * as infoOperations from './query/info.js';
import * as sectionOperations from './query/section.js';
import * as stockOperations from './query/stock.js';
import * as stockToSfgOperations from './query/stock_to_sfg.js';
import * as trxOperations from './query/trx.js';
import * as typeOperations from './query/type.js';
import * as usedOperations from './query/used.js';
import material from './schema.js';

const materialRouter = Router();

// info routes
export const pathMaterialInfo = {
	'/material/info': {
		get: {
			tags: ['material.info'],
			summary: 'Get all material info',
			description: 'Get all material info',
			responses: {
				200: {
					description: 'Returns all material info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									section_name: {
										type: 'string',
										example: 'section 1',
									},
									type_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									type_name: {
										type: 'string',
										example: 'type 1',
									},
									name: {
										type: 'string',
										example: 'material 1',
									},
									short_name: {
										type: 'string',
										example: 'm1',
									},
									stock: { type: 'number', example: 10.0 },
									unit: { type: 'string', example: 'kg' },
									threshold: {
										type: 'number',
										example: 10.0,
									},
									description: {
										type: 'string',
										example: 'material 1',
									},
									created_at: {
										type: 'string',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
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
			tags: ['material.info'],
			summary: 'Create a new material info',
			description: 'Create a new material info',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Material info object that needs to be added to the material.info',
					required: true,
					schema: {
						$ref: '#/definitions/material/info',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/material/info',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/material/info/{uuid}': {
		get: {
			tags: ['material.info'],
			summary: 'Get material info by uuid',
			description: 'Get material info by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material info to get',
					required: true,
					type: 'string',
					format: 'uuid',
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
							section_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							section_name: {
								type: 'string',
								example: 'section 1',
							},
							type_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							type_name: {
								type: 'string',
								example: 'type 1',
							},
							name: {
								type: 'string',
								example: 'material 1',
							},
							short_name: {
								type: 'string',
								example: 'm1',
							},
							stock: { type: 'number', example: 10.0 },
							unit: { type: 'string', example: 'kg' },
							threshold: {
								type: 'number',
								example: 10.0,
							},
							description: {
								type: 'string',
								example: 'material 1',
							},
							created_at: {
								type: 'string',
								example: '2024-01-01 00:00:00',
							},
							updated_at: {
								type: 'string',
								example: '2024-01-01 00:00:00',
							},
							remarks: {
								type: 'string',
								example: 'This is an entry',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material info not found',
				},
			},
		},
		put: {
			tags: ['material.info'],
			summary: 'Update an existing material info',
			description: 'Update an existing material info',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material info to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/info',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material info not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.info'],
			summary: 'Delete a material info',
			description: 'Delete a material info',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material info to delete',
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
					description: 'Material info not found',
				},
			},
		},
	},
};

materialRouter.get('/info', infoOperations.selectAll);
materialRouter.get('/info/:uuid', infoOperations.select);
materialRouter.post('/info', infoOperations.insert);
materialRouter.put('/info/:uuid', infoOperations.update);
materialRouter.delete(
	'/info/:uuid',

	infoOperations.remove
);

// section routes
export const pathMaterialSection = {
	'/material/section': {
		get: {
			tags: ['material.section'],
			summary: 'Get all material section',
			description: 'Get all material section',
			responses: {
				200: {
					description: 'Returns all material section',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/material/section',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['material.section'],
			summary: 'Create a new material section',
			description: 'Create a new material section',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Material section object that needs to be added to the material.section',
					required: true,
					schema: {
						$ref: '#/definitions/material/section',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/material/section',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/material/section/{uuid}': {
		get: {
			tags: ['material.section'],
			summary: 'Get material section by uuid',
			description: 'Get material section by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material section to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/section',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material section not found',
				},
			},
		},
		put: {
			tags: ['material.section'],
			summary: 'Update an existing material section',
			description: 'Update an existing material section',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material section to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/section',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/section',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material section not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.section'],
			summary: 'Delete a material section',
			description: 'Delete a material section',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material section to delete',
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
					description: 'Material section not found',
				},
			},
		},
	},
};

materialRouter.get('/section', sectionOperations.selectAll);
materialRouter.get(
	'/section/:uuid',

	sectionOperations.select
);
materialRouter.post('/section', sectionOperations.insert);
materialRouter.put('/section/:uuid', sectionOperations.update);
materialRouter.delete(
	'/section/:uuid',

	sectionOperations.remove
);

// stock routes
export const pathMaterialStock = {
	'/material/stock': {
		get: {
			tags: ['material.stock'],
			summary: 'Get all material stock',
			description: 'Get all material stock',
			responses: {
				200: {
					description: 'Returns all material stock',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'material 1',
									},
									stock: { type: 'number', example: 10.0 },
									tape_making: {
										type: 'number',
										example: 10.0,
									},
									coil_forming: {
										type: 'number',
										example: 10.0,
									},
									dying_and_iron: {
										type: 'number',
										example: 10.0,
									},
									m_gapping: {
										type: 'number',
										example: 10.0,
									},
									v_gapping: {
										type: 'number',
										example: 10.0,
									},
									v_teeth_molding: {
										type: 'number',
										example: 10.0,
									},
									m_teeth_molding: {
										type: 'number',
										example: 10.0,
									},
									teeth_assembling_and_polishing: {
										type: 'number',
										example: 10.0,
									},
								},
								m_teeth_cleaning: {
									type: 'number',
									example: 10.0,
								},
								v_teeth_cleaning: {
									type: 'number',
									example: 10.0,
								},
								plating_and_iron: {
									type: 'number',
									example: 10.0,
								},
								m_sealing: { type: 'number', example: 10.0 },
								v_sealing: { type: 'number', example: 10.0 },
								n_t_cutting: { type: 'number', example: 10.0 },
								v_t_cutting: { type: 'number', example: 10.0 },
								m_stopper: { type: 'number', example: 10.0 },
								v_stopper: { type: 'number', example: 10.0 },
								n_stopper: { type: 'number', example: 10.0 },
								cutting: { type: 'number', example: 10.0 },
								qc_and_packing: {
									type: 'number',
									example: 10.0,
								},
								die_casting: { type: 'number', example: 10.0 },
								slider_assembly: {
									type: 'number',
									example: 10.0,
								},
								coloring: { type: 'string', example: 10.0 },
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
		post: {
			tags: ['material.stock'],
			summary: 'Create a new material stock',
			description: 'Create a new material stock',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/stock',
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
							$ref: '#/definitions/material/stock',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/material/stock/{uuid}': {
		get: {
			tags: ['material.stock'],
			summary: 'Get material stock by uuid',
			description: 'Get material stock by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material stock to get',
					required: true,
					type: 'string',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock not found',
				},
			},
		},
		put: {
			tags: ['material.stock'],
			summary: 'Update an existing material stock',
			description: 'Update an existing material stock',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material stock to update',
					required: true,
					type: 'string',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/stock',
						},
					},
				},
			},
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.stock'],
			summary: 'Delete a material stock',
			description: 'Delete a material stock',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material stock to delete',
					required: true,
					type: 'string',
				},
			],
			responses: {
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock not found',
				},
			},
		},
	},
	'/material/stock-threshold': {
		get: {
			tags: ['material.stock'],
			summary: 'Get all material stock below threshold',
			description: 'Get all material stock below threshold',
			responses: {
				200: {
					description: 'Returns all material stock below threshold',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/material/stock',
								},
							},
						},
					},
				},
			},
		},
	},
	'/material/stock/by/single-field/{fieldName}': {
		get: {
			tags: ['material.stock'],
			summary: 'Get material stock for a field name',
			description: 'Get material stock for a field name',
			produces: ['application/json'],
			parameters: [
				{
					name: 'fieldName',
					in: 'path',
					description: ' field name to get stock',
					required: true,
					type: 'string',
					example: 'tape_making',
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
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							material_name: {
								type: 'string',
								example: 'material 1',
							},
							stock: { type: 'number', example: 10.0 },
							fieldName: { type: 'number', example: 10.0 },
							remarks: {
								type: 'string',
								example: 'This is an entry',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock not found',
				},
			},
		},
	},
	'/material/stock/by/multi-field/{fieldNames}': {
		get: {
			tags: ['material.stock'],
			summary: 'Get material stock for multiple field names',
			description: 'Get material stock for multiple field names',
			produces: ['application/json'],
			parameters: [
				{
					name: 'fieldNames',
					in: 'path',
					description: ' field names to get stock',
					required: true,
					type: 'string',
					example: 'tape_making,coil_forming',
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
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							material_name: {
								type: 'string',
								example: 'material 1',
							},
							stock: { type: 'number', example: 10.0 },
							fieldNames: { type: 'number', example: 10.0 },
							remarks: {
								type: 'string',
								example: 'This is an entry',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock not found',
				},
			},
		},
	},
};

materialRouter.get('/stock', stockOperations.selectAll);
materialRouter.get('/stock/:uuid', stockOperations.select);
materialRouter.post('/stock', stockOperations.insert);
materialRouter.put('/stock/:uuid', stockOperations.update);
materialRouter.delete('/stock/:uuid', stockOperations.remove);
materialRouter.get(
	'/stock-threshold',
	stockOperations.selectMaterialBelowThreshold
);
materialRouter.get(
	'/stock/by/single-field/:fieldName',
	stockOperations.selectMaterialStockForAFieldName
);
materialRouter.get(
	'/stock/by/multi-field/:fieldNames',
	stockOperations.selectMaterialStockForMultiFieldNames
);

// trx routes
export const pathMaterialTrx = {
	'/material/trx': {
		get: {
			tags: ['material.trx'],
			summary: 'Get all material trx',
			description: 'Get all material trx',
			responses: {
				200: {
					description: 'Returns all material trx',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'material 1',
									},
									trx_to: {
										type: 'string',
										example: 'tape_making',
									},
									trx_quantity: {
										type: 'number',
										example: 10.0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'admin',
									},
									user_designation: {
										type: 'string',
										example: 'Admin',
									},
									user_department: {
										type: 'string',
										example: 'Admin',
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
			tags: ['material.trx'],
			summary: 'Create a new material trx',
			description: 'Create a new material trx',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Material trx object that needs to be added to the material.trx',
					required: true,
					schema: {
						$ref: '#/definitions/material/trx',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/material/trx',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/material/trx/{uuid}': {
		get: {
			tags: ['material.trx'],
			summary: 'Get material trx by uuid',
			description: 'Get material trx by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material trx to get',
					required: true,
					type: 'string',
					format: 'uuid',
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
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							material_name: {
								type: 'string',
								example: 'material 1',
							},
							trx_to: {
								type: 'string',
								example: 'tape_making',
							},
							trx_quantity: {
								type: 'number',
								example: 10.0,
							},
							created_by: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by_name: {
								type: 'string',
								example: 'admin',
							},
							user_designation: {
								type: 'string',
								example: 'Admin',
							},
							user_department: {
								type: 'string',
								example: 'Admin',
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material trx not found',
				},
			},
		},
		put: {
			tags: ['material.trx'],
			summary: 'Update an existing material trx',
			description: 'Update an existing material trx',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material trx to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							trx_to: {
								type: 'string',
								example: 'tape_making',
							},
							trx_quantity: {
								type: 'number',
								example: 10.0,
							},
							created_by: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
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
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/trx',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material trx not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.trx'],
			summary: 'Delete a material trx',
			description: 'Delete a material trx',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material trx to delete',
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
					description: 'Material trx not found',
				},
			},
		},
	},
	'/material/trx/by/{material_uuid}/{trx_to}': {
		get: {
			tags: ['material.trx'],
			summary: 'Get selected material trx by material uuid and trx_to',
			description:
				'Get selected material trx by material uuid and trx_to',
			produces: ['application/json'],
			parameters: [
				{
					name: 'material_uuid',
					in: 'path',
					description: ' material uuid to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
				{
					name: 'trx_to',
					in: 'path',
					description: ' trx_to to get',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/trx',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material trx not found',
				},
			},
		},
	},
};

materialRouter.get('/trx', trxOperations.selectAll);
materialRouter.get('/trx/:uuid', trxOperations.select);
materialRouter.post('/trx', trxOperations.insert);
materialRouter.put('/trx/:uuid', trxOperations.update);
materialRouter.delete('/trx/:uuid', trxOperations.remove);
materialRouter.get(
	'/trx/by/:material_uuid/:trx_to',

	trxOperations.selectMaterialTrxByMaterialTrxTo
);

// type routes
export const pathMaterialType = {
	'/material/type': {
		get: {
			tags: ['material.type'],
			summary: 'Get all material type',
			description: 'Get all material type',
			responses: {
				200: {
					description: 'Returns all material type',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/material/type',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['material.type'],
			summary: 'Create a new material type',
			description: 'Create a new material type',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Material type object that needs to be added to the material.type',
					required: true,
					schema: {
						$ref: '#/definitions/material/type',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/material/type',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/material/type/{uuid}': {
		get: {
			tags: ['material.type'],
			summary: 'Get material type by uuid',
			description: 'Get material type by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material type to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/type',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material type not found',
				},
			},
		},
		put: {
			tags: ['material.type'],
			summary: 'Update an existing material type',
			description: 'Update an existing material type',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material type to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/type',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/type',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material type not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.type'],
			summary: 'Delete a material type',
			description: 'Delete a material type',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material type to delete',
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
					description: 'Material type not found',
				},
			},
		},
	},
};

materialRouter.get('/type', typeOperations.selectAll);
materialRouter.get('/type/:uuid', typeOperations.select);
materialRouter.post('/type', typeOperations.insert);
materialRouter.put('/type/:uuid', typeOperations.update);
materialRouter.delete(
	'/type/:uuid',

	typeOperations.remove
);

// used routes
export const pathMaterialUsed = {
	'/material/used': {
		get: {
			tags: ['material.used'],
			summary: 'Get all material used',
			description: 'Get all material used',
			responses: {
				200: {
					description: 'Returns all material used',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'material 1',
									},
									stock: { type: 'number', example: 10.0 },
									tape_making: {
										type: 'number',
										example: 10.0,
									},
									coil_forming: {
										type: 'number',
										example: 10.0,
									},
									dying_and_iron: {
										type: 'number',
										example: 10.0,
									},
									m_gapping: {
										type: 'number',
										example: 10.0,
									},
									v_gapping: {
										type: 'number',
										example: 10.0,
									},
									v_teeth_molding: {
										type: 'number',
										example: 10.0,
									},
									m_teeth_molding: {
										type: 'number',
										example: 10.0,
									},
									teeth_assembling_and_polishing: {
										type: 'number',
										example: 10.0,
									},
									m_teeth_cleaning: {
										type: 'number',
										example: 10.0,
									},
									v_teeth_cleaning: {
										type: 'number',
										example: 10.0,
									},
									plating_and_iron: {
										type: 'number',
										example: 10.0,
									},
									m_sealing: {
										type: 'number',
										example: 10.0,
									},
									v_sealing: {
										type: 'number',
										example: 10.0,
									},
									n_t_cutting: {
										type: 'number',
										example: 10.0,
									},
									v_t_cutting: {
										type: 'number',
										example: 10.0,
									},
									m_stopper: {
										type: 'number',
										example: 10.0,
									},
									v_stopper: {
										type: 'number',
										example: 10.0,
									},
									n_stopper: {
										type: 'number',
										example: 10.0,
									},
									cutting: { type: 'number', example: 10.0 },
									qc_and_packing: {
										type: 'number',
										example: 10.0,
									},
									die_casting: {
										type: 'number',
										example: 10.0,
									},
									slider_assembly: {
										type: 'number',
										example: 10.0,
									},
									coloring: { type: 'number', example: 10.0 },
									used_quantity: {
										type: 'number',
										example: 10.0,
									},
									wastage: { type: 'number', example: 10.0 },
									section: {
										type: 'string',
										example: 'tape_making',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'admin',
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
			tags: ['material.used'],
			summary: 'Create a new material used',
			description: 'Create a new material used',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Material used object that needs to be added to the material.used',
					required: true,
					schema: {
						$ref: '#/definitions/material/used',
					},
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/material/used',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/material/used/{uuid}': {
		get: {
			tags: ['material.used'],
			summary: 'Get material used by uuid',
			description: 'Get material used by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material used to get',
					required: true,
					type: 'string',
					format: 'uuid',
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
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							material_name: {
								type: 'string',
								example: 'material 1',
							},
							stock: { type: 'number', example: 10.0 },
							tape_making: { type: 'number', example: 10.0 },
							coil_forming: { type: 'number', example: 10.0 },
							dying_and_iron: { type: 'number', example: 10.0 },
							m_gapping: { type: 'number', example: 10.0 },
							v_gapping: { type: 'number', example: 10.0 },
							v_teeth_molding: { type: 'number', example: 10.0 },
							m_teeth_molding: { type: 'number', example: 10.0 },
							teeth_assembling_and_polishing: {
								type: 'number',
								example: 10.0,
							},
							m_teeth_cleaning: { type: 'number', example: 10.0 },
							v_teeth_cleaning: { type: 'number', example: 10.0 },
							plating_and_iron: { type: 'number', example: 10.0 },
							m_sealing: { type: 'number', example: 10.0 },
							v_sealing: { type: 'number', example: 10.0 },
							n_t_cutting: { type: 'number', example: 10.0 },
							v_t_cutting: { type: 'number', example: 10.0 },
							m_stopper: { type: 'number', example: 10.0 },
							v_stopper: { type: 'number', example: 10.0 },
							n_stopper: { type: 'number', example: 10.0 },
							cutting: { type: 'number', example: 10.0 },
							qc_and_packing: { type: 'number', example: 10.0 },
							die_casting: { type: 'number', example: 10.0 },
							slider_assembly: { type: 'number', example: 10.0 },
							coloring: { type: 'number', example: 10.0 },
							used_quantity: {
								type: 'number',
								example: 10.0,
							},
							wastage: { type: 'number', example: 10.0 },
							section: {
								type: 'string',
								example: 'tape_making',
							},
							created_by: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by_name: {
								type: 'string',
								example: 'admin',
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
			400: {
				description: 'Invalid UUID supplied',
			},
			404: {
				description: 'Material used not found',
			},
		},
		put: {
			tags: ['material.used'],
			summary: 'Update an existing material used',
			description: 'Update an existing material used',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material used to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/used',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/used',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material used not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.used'],
			summary: 'Delete a material used',
			description: 'Delete a material used',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material used to delete',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material used not found',
				},
			},
		},
	},
	'/material/used/by/{section}': {
		get: {
			tags: ['material.used'],
			summary: 'Get material used by section',
			description: 'Get material used by section',
			produces: ['application/json'],
			parameters: [
				{
					name: 'section',
					in: 'path',
					description: ' section to get',
					required: true,
					type: 'string',
					example: 'tape_making',
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
							material_uuid: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							material_name: {
								type: 'string',
								example: 'material 1',
							},
							stock: { type: 'number', example: 10.0 },
							tape_making: { type: 'number', example: 10.0 },
							coil_forming: { type: 'number', example: 10.0 },
							dying_and_iron: { type: 'number', example: 10.0 },
							m_gapping: { type: 'number', example: 10.0 },
							v_gapping: { type: 'number', example: 10.0 },
							v_teeth_molding: { type: 'number', example: 10.0 },
							m_teeth_molding: { type: 'number', example: 10.0 },
							teeth_assembling_and_polishing: {
								type: 'number',
								example: 10.0,
							},
							m_teeth_cleaning: { type: 'number', example: 10.0 },
							v_teeth_cleaning: { type: 'number', example: 10.0 },
							plating_and_iron: { type: 'number', example: 10.0 },
							m_sealing: { type: 'number', example: 10.0 },
							v_sealing: { type: 'number', example: 10.0 },
							n_t_cutting: { type: 'number', example: 10.0 },
							v_t_cutting: { type: 'number', example: 10.0 },
							m_stopper: { type: 'number', example: 10.0 },
							v_stopper: { type: 'number', example: 10.0 },
							n_stopper: { type: 'number', example: 10.0 },
							cutting: { type: 'number', example: 10.0 },
							qc_and_packing: { type: 'number', example: 10.0 },
							die_casting: { type: 'number', example: 10.0 },
							slider_assembly: { type: 'number', example: 10.0 },
							coloring: { type: 'number', example: 10.0 },
							used_quantity: {
								type: 'number',
								example: 10.0,
							},
							wastage: { type: 'number', example: 10.0 },
							section: {
								type: 'string',
								example: 'tape_making',
							},
							created_by: {
								type: 'string',
								example: 'igD0v9DIJQhJeet',
							},
							created_by_name: {
								type: 'string',
								example: 'admin',
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material used not found',
				},
			},
		},
	},
};

materialRouter.get('/used', usedOperations.selectAll);
materialRouter.get('/used/:uuid', usedOperations.select);
materialRouter.post('/used', usedOperations.insert);
materialRouter.put('/used/:uuid', usedOperations.update);
materialRouter.delete(
	'/used/:uuid',

	usedOperations.remove
);
materialRouter.get('/used/by/:section', usedOperations.selectUsedBySection);

// stock_to_sfg

export const pathMaterialStockToSFG = {
	'/material/stock-to-sfg': {
		get: {
			tags: ['material.stock_to_sfg'],
			summary: 'Get all material stock_to_sfg',
			description: 'Get all material stock_to_sfg',
			responses: {
				200: {
					description: 'Returns all material stock_to_sfg',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									material_name: {
										type: 'string',
										example: 'material 1',
									},
									unit: { type: 'string', example: 'kg' },
									stock: { type: 'number', example: 10.0 },
									order_entry_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_description_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									trx_to: {
										type: 'string',
										example: 'tape_making',
									},
									trx_quantity: {
										type: 'number',
										example: 10.0,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'admin',
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
									order_number: {
										type: 'string',
										example: 'Z24-0010',
									},
									item_description: {
										type: 'string',
										example: 'item description',
									},
									style: {
										type: 'string',
										example: 'st1',
									},
									color: {
										type: 'string',
										example: 'black',
									},
									size: {
										type: 'string',
										example: '10',
									},
									style_color_size: {
										type: 'string',
										example: 'st1-black-10',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['material.stock_to_sfg'],
			summary: 'Create a new material stock_to_sfg',
			description: 'Create a new material stock_to_sfg',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/stock_to_sfg',
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
							$ref: '#/definitions/material/stock_to_sfg',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},
	'/material/stock-to-sfg/{uuid}': {
		get: {
			tags: ['material.stock_to_sfg'],
			summary: 'Get material stock_to_sfg by uuid',
			description: 'Get material stock_to_sfg by uuid',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: ' material stock_to_sfg to get',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'object',
						items: {
							properties: {
								uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								material_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								material_name: {
									type: 'string',
									example: 'material 1',
								},
								unit: { type: 'string', example: 'kg' },
								stock: { type: 'number', example: 10.0 },
								order_entry_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								order_description_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								trx_to: {
									type: 'string',
									example: 'tape_making',
								},
								trx_quantity: {
									type: 'number',
									example: 10.0,
								},
								created_by: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								created_by_name: {
									type: 'string',
									example: 'admin',
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
								order_number: {
									type: 'string',
									example: 'Z24-0010',
								},
								item_description: {
									type: 'string',
									example: 'item description',
								},
								style: {
									type: 'string',
									example: 'st1',
								},
								color: {
									type: 'string',
									example: 'black',
								},
								size: {
									type: 'string',
									example: '10',
								},
								style_color_size: {
									type: 'string',
									example: 'st1-black-10',
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock_to_sfg not found',
				},
			},
		},
		put: {
			tags: ['material.stock_to_sfg'],
			summary: 'Update an existing material stock_to_sfg',
			description: 'Update an existing material stock_to_sfg',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material stock_to_sfg to update',
					required: true,
					type: 'string',
					format: 'uuid',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/material/stock_to_sfg',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						$ref: '#/definitions/material/stock_to_sfg',
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material stock_to_sfg not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['material.stock_to_sfg'],
			summary: 'Delete a material stock_to_sfg',
			description: 'Delete a material stock_to_sfg',
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'material stock_to_sfg to delete',
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
					description: 'Material stock_to_sfg not found',
				},
			},
		},
	},
};

// stock_to_sfg routes
materialRouter.get('/stock-to-sfg', stockToSfgOperations.selectAll);
materialRouter.get(
	'/stock-to-sfg/:uuid',

	stockToSfgOperations.select
);
materialRouter.post('/stock-to-sfg', stockToSfgOperations.insert);
materialRouter.put('/stock-to-sfg/:uuid', stockToSfgOperations.update);
materialRouter.delete(
	'/stock-to-sfg/:uuid',

	stockToSfgOperations.remove
);

export const pathMaterial = {
	...pathMaterialInfo,
	...pathMaterialSection,
	...pathMaterialStock,
	...pathMaterialTrx,
	...pathMaterialType,
	...pathMaterialUsed,
	...pathMaterialStockToSFG,
};
export { materialRouter };
