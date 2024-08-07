import { Router } from 'express';

import * as otherOperations from './query/query.js';

const otherRouter = Router();

// public
otherRouter.get('/party/value/label', otherOperations.selectParty);
otherRouter.get(
	'/marketing-user/value/label',
	otherOperations.selectMarketingUser
);
otherRouter.get('/buyer/value/label', otherOperations.selectBuyer);
otherRouter.get(
	'/merchandiser/value/label/:party_uuid',
	otherOperations.selectSpecificMerchandiser
);
otherRouter.get(
	'/factory/value/label/:party_uuid',
	otherOperations.selectSpecificFactory
);

// purchase
otherRouter.get('/vendor/value/label', otherOperations.selectVendor);

// material
otherRouter.get(
	'/material-section/value/label',
	otherOperations.selectMaterialSection
);
otherRouter.get(
	'/material-type/value/label',
	otherOperations.selectMaterialType
);
otherRouter.get(
	'/material/value/label/unit/quantity',
	otherOperations.selectMaterial
);

const pathPublic = {
	'/other/party/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all parties',
			description: 'All parties',
			operationId: 'getAllParties',
			responses: {
				200: {
					description: 'Returns a all parties.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/marketing-user/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all marketing users',
			description: 'All marketing users',
			operationId: 'getAllMarketingUsers',
			responses: {
				200: {
					description: 'Returns a all marketing user.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/buyer/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all buyers',
			description: 'All buyers',
			operationId: 'getAllBuyers',
			responses: {
				200: {
					description: 'Returns a all buyers.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/merchandiser/value/label/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get filtered merchandisers by party',
			description: 'Filtered merchandisers by party',
			operationId: 'getFilteredMerchandisers',
			parameters: [
				{
					name: 'party_uuid',
					in: 'path',
					description: "party's uuid",
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'Returns a all merchandisers.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/factory/value/label/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get filtered factories by party',
			description: 'Filtered factories by party',
			operationId: 'getFilteredFactories',
			parameters: [
				{
					name: 'party_uuid',
					in: 'path',
					description: "party's uuid",
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'Returns a all factories.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathPurchase = {
	'/other/vendor/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all vendors',
			description: 'All vendors',
			operationId: 'getAllVendors',
			responses: {
				200: {
					description: 'Returns a all vendors.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathMaterial = {
	'/other/material-section/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all material sections',
			description: 'All material sections',
			operationId: 'getAllMaterialSections',
			responses: {
				200: {
					description: 'Returns a all material sections.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/material-type/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all material types',
			description: 'All material types',
			operationId: 'getAllMaterialTypes',
			responses: {
				200: {
					description: 'Returns a all material types.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/material/value/label/unit/quantity': {
		get: {
			tags: ['others'],
			summary: 'get all materials',
			description: 'All materials',
			operationId: 'getAllMaterials',
			responses: {
				200: {
					description: 'Returns a all materials.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: { type: 'string' },
									label: { type: 'string' },
									unit: { type: 'string' },
									stock: { type: 'number' },
								},
							},
						},
					},
				},
			},
		},
	},
};

export const pathOthers = { ...pathPublic, ...pathPurchase, ...pathMaterial };

export const tagOthers = [
	{
		name: 'others',
	},
];

export { otherRouter };
