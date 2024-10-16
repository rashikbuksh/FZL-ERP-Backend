import { Router } from 'express';
import SE, { SED } from '../../util/swagger_example.js';

import * as challanRegistrationOperations from './query/challan_register.js';
import * as goodsInWarehouseOperations from './query/goods_in_warehouse.js';
import * as orderEntryFeedOperations from './query/order_entry_feed.js';
import * as piRegisterOperations from './query/pi_register.js';
import * as productionStatusOperations from './query/production_status.js';
import * as sampleLeadTimeOperations from './query/sample_lead_time.js';
import * as workInHandOperations from './query/work_in_hand.js';

const dashBoardRouter = Router();

//challan register routes

dashBoardRouter.get(
	'/challan-register',
	challanRegistrationOperations.selectChallanRegister
);

dashBoardRouter.get(
	'/goods-in-warehouse',
	goodsInWarehouseOperations.selectGoodsInWarehouse
);

dashBoardRouter.get('/work-in-hand', workInHandOperations.selectWorkInHand);

dashBoardRouter.get(
	'/sample-lead-time',
	sampleLeadTimeOperations.selectSampleLeadTime
);

dashBoardRouter.get(
	'/production-status',
	productionStatusOperations.selectProductionStatus
);

dashBoardRouter.get(
	'/order-entry-feed',
	orderEntryFeedOperations.selectOrderEntryFeed
);

dashBoardRouter.get('/pi-register', piRegisterOperations.selectPiRegister);

const pathDashboard = {
	'/dashboard/challan-register': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get challan register summary',
			description: 'Get challan register summary',
			parameters: [
				{
					name: 'start_date',
					in: 'query',
					required: false,
					description: 'Start date for the summary',
					schema: {
						type: 'string',
						format: 'date',
					},
				},
				{
					name: 'end_date',
					in: 'query',
					required: false,
					description: 'End date for the summary',
					schema: {
						type: 'string',
						format: 'date',
					},
				},
			],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							properties: {
								total_number_of_challan: {
									type: 'number',
									example: 100,
								},
								chart_data: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											item_name: {
												type: 'string',
												example: 'Vislon',
											},
											number_of_challan: {
												type: 'number',
												example: 50,
											},
											amount: {
												type: 'number',
												example: 50,
											},
										},
									},
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
	'/dashboard/goods-in-warehouse': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get goods in warehouse summary',
			description: 'Get goods in warehouse summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							properties: {
								total_number_of_carton: {
									type: 'number',
									example: 100,
								},
								chart_data: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											item_name: {
												type: 'string',
												example: 'Vislon',
											},
											number_of_carton: {
												type: 'number',
												example: 50,
											},
											amount: {
												type: 'number',
												example: 50,
											},
										},
									},
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
	'/dashboard/work-in-hand': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get work in hand summary',
			description: 'Get work in hand summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									item_name: {
										type: 'string',
										example: 'Vislon',
									},
									Approved: {
										type: 'number',
										example: 50,
									},
									Not_Approved: {
										type: 'number',
										example: 50,
									},
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
	'/dashboard/sample-lead-time': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get sample lead time summary',
			description: 'Get sample lead time summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									sample_order_no: {
										type: 'string',
										example: 'Z21-0001',
									},
									issue_date: {
										type: 'string',
										example: '2021-01-01',
									},
									status: {
										type: 'string',
										example: 'Pending',
									},
									delivery_last_date: {
										type: 'string',
										example: '2021-01-01',
									},
									delivery_quantity: {
										type: 'number',
										example: 50,
									},
									order_quantity: {
										type: 'number',
										example: 50,
									},
									delivery_order_quantity: {
										type: 'string',
										example: '50/100',
									},
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
	'/dashboard/production-status': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get production status summary',
			description: 'Get production status summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									item_name: {
										type: 'string',
										example: 'Vislon',
									},
									nylon_stopper_name: {
										type: 'string',
										example: 'Vislon',
									},
									total_quantity: {
										type: 'number',
										example: 50,
									},
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
	'/dashboard/order-entry-feed': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get order entry feed summary',
			description: 'Get order entry feed summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_no: {
										type: 'string',
										example: 'Z21-0001',
									},
									party_name: {
										type: 'string',
										example: 'ppp',
									},
									marketing_name: {
										type: 'string',
										example: 'mmm',
									},
									item: {
										type: 'string',
										example: 'V-3-OE-RP',
									},
									quantity: {
										type: 'number',
										example: 50,
									},
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
	'/dashboard/pi-register': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get pi register summary',
			description: 'Get pi register summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: SE.uuid(),
									pi_cash_number: SE.string('PI24-0001'),
									party_uuid: SE.uuid(),
									party_name: SE.string('4F'),
									lc_uuid: SE.uuid(),
									lc_number: SE.string('2406-234-765'),
									file_number: SE.string('LC24-0001'),
									total_pi_value: SE.number(1000),
									bank_name: SE.string('Bank 1'),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
};

export const pathDashboards = {
	...pathDashboard,
};

export const tagDashboards = [
	{
		name: 'Dashboard',
	},
];

export { dashBoardRouter };
