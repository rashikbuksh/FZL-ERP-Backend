import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import * as buyerOperations from './query/buyer.js';
import * as factoryOperations from './query/factory.js';
import * as marketingOperations from './query/marketing.js';
import * as merchandiserOperations from './query/merchandiser.js';
import * as partyOperations from './query/party.js';
import * as propertiesOperations from './query/properties.js';
import * as sectionOperations from './query/section.js';

const publicRouter = Router();

// buyer
const pathPublicBuyer = {
	'/public/buyer': {
		get: {
			summary: 'Get all buyers',
			tags: ['public.buyer'],
			operationId: 'getBuyers',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/buyer',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a buyer',
			tags: ['public.buyer'],
			operationId: 'createBuyer',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/buyer',
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
	'/buyer/{uuid}': {
		get: {
			summary: 'Get a buyer',
			tags: ['public.buyer'],
			operationId: 'getBuyer',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the buyer',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/buyer',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a buyer',
			tags: ['public.buyer'],
			operationId: 'updateBuyer',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the buyer',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/buyer',
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
			summary: 'Delete a buyer',
			tags: ['public.buyer'],
			operationId: 'deleteBuyer',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the buyer',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// buyer routes
publicRouter.get('/buyer', buyerOperations.selectAll);
publicRouter.get('/buyer/:uuid', buyerOperations.select);
publicRouter.post('/buyer', buyerOperations.insert);
publicRouter.put('/buyer/:uuid', buyerOperations.update);
publicRouter.delete(
	'/buyer/:uuid',
	//
	buyerOperations.remove
);

// factory
const pathPublicFactory = {
	'/factory': {
		get: {
			summary: 'Get all factories',
			tags: ['public.factory'],
			operationId: 'getFactories',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/factory',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a factory',
			tags: ['public.factory'],
			operationId: 'createFactory',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/factory',
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
	'/factory/{uuid}': {
		get: {
			summary: 'Get a factory',
			tags: ['public.factory'],
			operationId: 'getFactory',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the factory',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/factory',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a factory',
			tags: ['public.factory'],
			operationId: 'updateFactory',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the factory',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/factory',
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
			summary: 'Delete a factory',
			tags: ['public.factory'],
			operationId: 'deleteFactory',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the factory',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// factory routes
publicRouter.get('/factory', factoryOperations.selectAll);
publicRouter.get(
	'/factory/:uuid',

	factoryOperations.select
);
publicRouter.post('/factory', factoryOperations.insert);
publicRouter.put('/factory/:uuid', factoryOperations.update);
publicRouter.delete(
	'/factory/:uuid',

	factoryOperations.remove
);

// marketing
const pathPublicMarketing = {
	'/marketing': {
		get: {
			summary: 'Get all marketing',
			tags: ['public.marketing'],
			operationId: 'getMarketings',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/marketing',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a marketing',
			tags: ['public.marketing'],
			operationId: 'createMarketing',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/marketing',
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
	'/marketing/{uuid}': {
		get: {
			summary: 'Get a marketing',
			tags: ['public.marketing'],
			operationId: 'getMarketing',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the marketing',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/marketing',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a marketing',
			tags: ['public.marketing'],
			operationId: 'updateMarketing',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the marketing',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/marketing',
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
			summary: 'Delete a marketing',
			tags: ['public.marketing'],
			operationId: 'deleteMarketing',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the marketing',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// marketing routes
publicRouter.get('/marketing', marketingOperations.selectAll);
publicRouter.get(
	'/marketing/:uuid',

	marketingOperations.select
);
publicRouter.post('/marketing', marketingOperations.insert);
publicRouter.put('/marketing/:uuid', marketingOperations.update);
publicRouter.delete(
	'/marketing/:uuid',

	marketingOperations.remove
);

// merchandiser
const pathPublicMerchandiser = {
	'/merchandiser': {
		get: {
			summary: 'Get all merchandisers',
			tags: ['public.merchandiser'],
			operationId: 'getMerchandisers',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/merchandiser',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'createMerchandiser',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/merchandiser',
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
	'/merchandiser/{uuid}': {
		get: {
			summary: 'Get a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'getMerchandiser',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the merchandiser',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/merchandiser',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'updateMerchandiser',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the merchandiser',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/merchandiser',
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
			summary: 'Delete a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'deleteMerchandiser',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the merchandiser',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// merchandiser routes
publicRouter.get('/merchandiser', merchandiserOperations.selectAll);
publicRouter.get(
	'/merchandiser/:uuid',

	merchandiserOperations.select
);
publicRouter.post('/merchandiser', merchandiserOperations.insert);
publicRouter.put('/merchandiser/:uuid', merchandiserOperations.update);
publicRouter.delete(
	'/merchandiser/:uuid',

	merchandiserOperations.remove
);

// party
const pathPublicParty = {
	'/party': {
		get: {
			summary: 'Get all parties',
			tags: ['public.party'],
			operationId: 'getParties',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/party',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a party',
			tags: ['public.party'],
			operationId: 'createParty',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/party',
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
	'/party/{uuid}': {
		get: {
			summary: 'Get a party',
			tags: ['public.party'],
			operationId: 'getParty',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the party',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/party',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a party',
			tags: ['public.party'],
			operationId: 'updateParty',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the party',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/party',
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
			summary: 'Delete a party',
			tags: ['public.party'],
			operationId: 'deleteParty',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the party',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// party routes
publicRouter.get('/party', partyOperations.selectAll);
publicRouter.get('/party/:uuid', partyOperations.select);
publicRouter.post('/party', partyOperations.insert);
publicRouter.put('/party/:uuid', partyOperations.update);
publicRouter.delete(
	'/party/:uuid',

	partyOperations.remove
);

// properties
const pathPublicProperties = {
	'/properties': {
		get: {
			summary: 'Get all properties',
			tags: ['public.properties'],
			operationId: 'getProperties',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/properties',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a properties',
			tags: ['public.properties'],
			operationId: 'createProperties',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/properties',
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
	'/properties/{uuid}': {
		get: {
			summary: 'Get a properties',
			tags: ['public.properties'],
			operationId: 'getProperties',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the properties',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/properties',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a properties',
			tags: ['public.properties'],
			operationId: 'updateProperties',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the properties',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/properties',
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
			summary: 'Delete a properties',
			tags: ['public.properties'],
			operationId: 'deleteProperties',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the properties',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// properties routes
publicRouter.get('/properties', propertiesOperations.selectAll);
publicRouter.get(
	'/properties/:uuid',

	propertiesOperations.select
);
publicRouter.post('/properties', propertiesOperations.insert);
publicRouter.put('/properties/:uuid', propertiesOperations.update);
publicRouter.delete(
	'/properties/:uuid',

	propertiesOperations.remove
);

// section
const pathPublicSection = {
	'/section': {
		get: {
			summary: 'Get all sections',
			tags: ['public.section'],
			operationId: 'getSections',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/section',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a section',
			tags: ['public.section'],
			operationId: 'createSection',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/section',
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
	'/section/{uuid}': {
		get: {
			summary: 'Get a section',
			tags: ['public.section'],
			operationId: 'getSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/section',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a section',
			tags: ['public.section'],
			operationId: 'updateSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/section',
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
			summary: 'Delete a section',
			tags: ['public.section'],
			operationId: 'deleteSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
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

// section routes
publicRouter.get('/section', sectionOperations.selectAll);
publicRouter.get(
	'/section/:uuid',

	sectionOperations.select
);
publicRouter.post('/section', sectionOperations.insert);
publicRouter.put('/section/:uuid', sectionOperations.update);
publicRouter.delete(
	'/section/:uuid',

	sectionOperations.remove
);

export const pathPublic = {
	...pathPublicBuyer,
	...pathPublicFactory,
	...pathPublicMarketing,
	...pathPublicMerchandiser,
	...pathPublicParty,
	...pathPublicProperties,
	...pathPublicSection,
};

export { publicRouter };
