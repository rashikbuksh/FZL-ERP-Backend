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
otherRouter.get('/marketing/value/label', otherOperations.selectMarketing);
otherRouter.get(
	'/order-properties/by/:type_name',
	otherOperations.selectOrderProperties
);

// zipper
otherRouter.get('/order/info/value/label', otherOperations.selectOrderInfo);
otherRouter.get(
	'/order/order_description_uuid/by/:order_number',
	otherOperations.selectOrderInfoToGetOrderDescription
);
otherRouter.get('/order/entry/value/label', otherOperations.selectOrderEntry);
otherRouter.get(
	'/order-number-for-pi/value/label/:marketing_uuid/:party_uuid',
	otherOperations.selectOrderNumberForPi
);
otherRouter.get(
	'/order/description/value/label',
	otherOperations.selectOrderDescription
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

// commercial
otherRouter.get('/bank/value/label', otherOperations.selectBank);
otherRouter.get(
	'/lc/value/label/:party_uuid',
	otherOperations.selectLCByPartyUuid
);
otherRouter.get('/pi/value/label', otherOperations.selectPi);

// hr
otherRouter.get('/department/value/label', otherOperations.selectDepartment);

// lab_dip
otherRouter.get(
	'/lab-dip/recipe/value/label',
	otherOperations.selectLabDipRecipe
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
	'/other/marketing/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all marketing',
			description: 'All marketing',
			operationId: 'getAllMarketing',
			responses: {
				200: {
					description: 'Returns a all marketing.',
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
	'/other/order/info/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order info',
			description: 'All order info',
			operationId: 'getAllOrderInfo',
			responses: {
				200: {
					description: 'Returns a all order info.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'Z24-0001',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order-properties/by/{type_name}': {
		get: {
			tags: ['others'],
			summary: 'get all order properties',
			description: 'All order properties',
			operationId: 'getAllOrderProperties',
			parameters: [
				{
					name: 'type_name',
					in: 'path',
					description: 'type of order properties',
					required: true,
					type: 'string',
					example: 'item',
				},
			],
			responses: {
				200: {
					description: 'Returns a all order properties.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'nylon' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order/entry/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order entry',
			description: 'All order entry',
			operationId: 'getAllOrderEntry',
			responses: {
				200: {
					description: 'Returns a all order entry.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example:
											'Z24-0001 ⇾ N-5-OE-SP ⇾ st1 ⇾ black ⇾ 1000 ⇾ 1000',
									},
									can_trf_quantity: {
										type: 'number',
										example: 100,
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

const pathCommercial = {
	'/other/bank/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all banks',
			description: 'All banks',
			operationId: 'getAllBanks',
			responses: {
				200: {
					description: 'Returns all banks.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									label: {
										type: 'string',
										example: 'Bank-0001',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/lc/value/label/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get all LCs',
			description: 'All LCs',
			operationId: 'getAllLCs',
			parameters: [
				{
					name: 'party_uuid',
					in: 'path',
					description: "party's uuid",
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Returns all LCs.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									label: {
										type: 'string',
										example: 'LC-0001',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/pi/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all PIs',
			description: 'All PIs',
			operationId: 'getAllPIs',
			responses: {
				200: {
					description: 'Returns all PIs.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									label: {
										type: 'string',
										example: 'PI24-0001',
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

const pathZipper = {
	'/other/order/order_description_uuid/by/{order_number}': {
		get: {
			tags: ['others'],
			summary: 'get order description uuid by order number',
			description: 'Order description uuid by order number',
			operationId: 'getOrderDescriptionUuid',
			parameters: [
				{
					name: 'order_number',
					in: 'path',
					description: 'order number',
					required: true,
					type: 'string',
					example: 'Z24-0003',
				},
			],
			responses: {
				200: {
					description: 'Returns a order description uuid.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_info_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									reference_order_info_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									order_description_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									buyer_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									buyer_name: {
										type: 'string',
										example: 'John',
									},
									party_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									party_name: {
										type: 'string',
										example: 'John',
									},
									marketing_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									marketing_name: {
										type: 'string',
										example: 'John',
									},
									merchandiser_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									merchandiser_name: {
										type: 'string',
										example: 'John',
									},
									factory_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									factory_name: {
										type: 'string',
										example: 'John',
									},
									is_sample: {
										type: 'integer',
										example: 1,
									},
									is_bill: {
										type: 'integer',
										example: 1,
									},
									is_cash: {
										type: 'integer',
										example: 1,
									},
									marketing_priority: {
										type: 'string',
										example: '',
									},
									factory_priority: {
										type: 'string',
										example: '',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order-number-for-pi/value/label/{marketing_uuid}/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get order number for pi',
			description: 'Order number for pi',
			operationId: 'getOrderNumberForPi',
			parameters: [
				{
					name: 'marketing_uuid',
					in: 'path',
					description: 'marketing uuid',
					required: true,
					type: 'string',
					example: '2ggcphnwHGzEUGy',
				},
				{
					name: 'party_uuid',
					in: 'path',
					description: 'party uuid',
					required: true,
					type: 'string',
					example: '2ggcphnwHGzEUGy',
				},
			],
			responses: {
				200: {
					description: 'Returns a order number.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'Z24-0001',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order/description/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order descriptions',
			description: 'All order descriptions',
			operationId: 'getAllOrderDescriptions',
			responses: {
				200: {
					description: 'Returns a all order descriptions.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'Z24-0001 -> N-5-OE-SP',
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

const pathHr = {
	'/other/department/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all departments',
			description: 'All departments',
			operationId: 'getAllDepartments',
			responses: {
				200: {
					description: 'Returns a all departments.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'Admin' },
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathLabDip = {
	'/other/lab-dip/recipe/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all lab dip recipes',
			description: 'All lab dip recipes',
			operationId: 'getAllLabDipRecipes',
			responses: {
				200: {
					description: 'Returns a all lab dip recipes.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'LDR24-0001 - Recipe 1',
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

export const pathOthers = {
	...pathPublic,
	...pathPurchase,
	...pathMaterial,
	...pathCommercial,
	...pathZipper,
	...pathHr,
	...pathLabDip,
};

export const tagOthers = [
	{
		name: 'others',
	},
];

export { otherRouter };
