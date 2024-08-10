import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import { properties } from '../public/schema.js';
import slider from '../slider/schema.js';
import { order_description } from '../zipper/schema.js';
import * as infoOperations from './query/info.js';
import * as sectionOperations from './query/section.js';
import * as stockOperations from './query/stock.js';
import * as stockToSfgOperations from './query/stock_to_sfg.js';
import * as trxOperations from './query/trx.js';
import * as typeOperations from './query/type.js';
import * as usedOperations from './query/used.js';

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
									uuid: { type: 'string' },
									section_uuid: { type: 'string' },
									section_name: { type: 'string' },
									type_uuid: { type: 'string' },
									type_name: { type: 'string' },
									name: { type: 'string' },
									unit: { type: 'string' },
									threshold: { type: 'number' },
									description: { type: 'string' },
									created_at: { type: 'string' },
									updated_at: { type: 'string' },
									remarks: { type: 'string' },
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
				{
					in: 'body',
					name: 'body',
					description:
						'Material info object that needs to be updated in the material.info',
					required: true,
					schema: {
						$ref: '#/definitions/material/info',
					},
				},
			],
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
materialRouter.get('/info/:uuid', validateUuidParam(), infoOperations.select);
materialRouter.post('/info', infoOperations.insert);
materialRouter.put('/info/:uuid', infoOperations.update);
materialRouter.delete(
	'/info/:uuid',
	validateUuidParam(),
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
				{
					in: 'body',
					name: 'body',
					description:
						'Material section object that needs to be updated in the material.section',
					required: true,
					schema: {
						$ref: '#/definitions/material/section',
					},
				},
			],
			responses: {
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
	validateUuidParam(),
	sectionOperations.select
);
materialRouter.post('/section', sectionOperations.insert);
materialRouter.put('/section/:uuid', sectionOperations.update);
materialRouter.delete(
	'/section/:uuid',
	validateUuidParam(),
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
									uuid: { type: 'string' },
									material_uuid: { type: 'string' },
									material_name: { type: 'string' },
									stock: { type: 'number' },
									tape_making: { type: 'number' },
									coil_forming: { type: 'number' },
									dying_and_iron: { type: 'number' },
									m_gapping: { type: 'number' },
									v_gapping: { type: 'number' },
									v_teeth_molding: { type: 'number' },
									m_teeth_molding: { type: 'number' },
									teeth_assembling_and_polishing: {
										type: 'number',
									},
									m_teeth_cleaning: { type: 'number' },
									v_teeth_cleaning: { type: 'number' },
									plating_and_iron: { type: 'number' },
									m_sealing: { type: 'number' },
									v_sealing: { type: 'number' },
									n_t_cutting: { type: 'number' },
									v_t_cutting: { type: 'number' },
									m_stopper: { type: 'number' },
									v_stopper: { type: 'number' },
									n_stopper: { type: 'number' },
									cutting: { type: 'number' },
									qc_and_packing: { type: 'number' },
									die_casting: { type: 'number' },
									slider_assembly: { type: 'number' },
									coloring: { type: 'string' },
									remarks: { type: 'string' },
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
					format: 'uuid',
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
					format: 'uuid',
				},
				{
					in: 'body',
					name: 'body',
					description:
						'Material stock object that needs to be updated in the material.stock',
					required: true,
					schema: {
						$ref: '#/definitions/material/stock',
					},
				},
			],
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
					format: 'uuid',
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
};

materialRouter.get('/stock', stockOperations.selectAll);
materialRouter.get('/stock/:uuid', validateUuidParam(), stockOperations.select);
materialRouter.post('/stock', stockOperations.insert);
materialRouter.put('/stock/:uuid', stockOperations.update);
materialRouter.delete(
	'/stock/:uuid',
	validateUuidParam(),
	stockOperations.remove
);
materialRouter.get(
	'/stock-threshold',
	stockOperations.selectMaterialBelowThreshold
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
									uuid: { type: 'string' },
									material_uuid: { type: 'string' },
									material_name: { type: 'string' },
									trx_to: { type: 'string' },
									trx_quantity: { type: 'number' },
									created_by: { type: 'string' },
									user_name: { type: 'string' },
									user_designation: { type: 'string' },
									user_department: { type: 'string' },
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
									remarks: { type: 'string' },
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
				{
					in: 'body',
					name: 'body',
					description:
						'Material trx object that needs to be updated in the material.trx',
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
materialRouter.get('/trx/:uuid', validateUuidParam(), trxOperations.select);
materialRouter.post('/trx', trxOperations.insert);
materialRouter.put('/trx/:uuid', trxOperations.update);
materialRouter.delete('/trx/:uuid', validateUuidParam(), trxOperations.remove);
materialRouter.get(
	'/trx/by/:material_uuid/:trx_to',
	validateUuidParam(),
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
				{
					in: 'body',
					name: 'body',
					description:
						'Material type object that needs to be updated in the material.type',
					required: true,
					schema: {
						$ref: '#/definitions/material/type',
					},
				},
			],
			responses: {
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
materialRouter.get('/type/:uuid', validateUuidParam(), typeOperations.select);
materialRouter.post('/type', typeOperations.insert);
materialRouter.put('/type/:uuid', typeOperations.update);
materialRouter.delete(
	'/type/:uuid',
	validateUuidParam(),
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
									uuid: { type: 'string' },
									material_uuid: { type: 'string' },
									material_name: { type: 'string' },
									used_quantity: { type: 'number' },
									wastage: { type: 'number' },
									section: { type: 'string' },
									created_by: { type: 'string' },
									user_name: { type: 'string' },
									user_designation: { type: 'string' },
									user_department: { type: 'string' },
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

									remarks: { type: 'string' },
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
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Material used not found',
				},
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
				{
					in: 'body',
					name: 'body',
					description:
						'Material used object that needs to be updated in the material.used',
					required: true,
					schema: {
						$ref: '#/definitions/material/used',
					},
				},
			],
			responses: {
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
materialRouter.get('/used/:uuid', validateUuidParam(), usedOperations.select);
materialRouter.post('/used', usedOperations.insert);
materialRouter.put('/used/:uuid', usedOperations.update);
materialRouter.delete(
	'/used/:uuid',
	validateUuidParam(),
	usedOperations.remove
);

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
									uuid: { type: 'string' },
									material_uuid: { type: 'string' },
									material_name: { type: 'string' },
									order_entry_uuid: { type: 'string' },
									order_description_uuid: { type: 'string' },
									trx_to: { type: 'string' },
									trx_quantity: { type: 'number' },
									created_by: { type: 'string' },
									user_name: { type: 'string' },
									user_designation: { type: 'string' },
									user_department: { type: 'string' },
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
									remarks: { type: 'string' },
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
			parameters: [
				{
					in: 'body',
					name: 'body',
					description:
						'Material stock_to_sfg object that needs to be added to the material.stock_to_sfg',
					required: true,
					schema: {
						$ref: '#/definitions/material/stock_to_sfg',
					},
				},
			],
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
						type: 'array',
						items: {
							$ref: '#/definitions/material/stock_to_sfg',
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
				{
					in: 'body',
					name: 'body',
					description:
						'Material stock_to_sfg object that needs to be updated in the material.stock_to_sfg',
					required: true,
					schema: {
						$ref: '#/definitions/material/stock_to_sfg',
					},
				},
			],
			responses: {
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
	validateUuidParam(),
	stockToSfgOperations.select
);
materialRouter.post('/stock-to-sfg', stockToSfgOperations.insert);
materialRouter.put('/stock-to-sfg/:uuid', stockToSfgOperations.update);
materialRouter.delete(
	'/stock-to-sfg/:uuid',
	validateUuidParam(),
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
