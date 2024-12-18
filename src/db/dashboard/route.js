import { Router } from 'express';
import SE, { SED } from '../../util/swagger_example.js';

import * as amountAndDocOperations from './query/amount_and_doc.js';
import * as challanRegistrationOperations from './query/challan_register.js';
import * as documentRcvLogOperations from './query/document_rcv_log.js';
import * as goodsInWarehouseOperations from './query/goods_in_warehouse.js';
import * as lcFeedOperations from './query/lc_feed.js';
import * as orderEntryOperations from './query/order_entry.js';
import * as orderEntryFeedOperations from './query/order_entry_feed.js';
import * as piRegisterOperations from './query/pi_register.js';
import * as piToBeSubmittedOperations from './query/pi_to_be_submitted.js';
import * as productionStatusOperations from './query/production_status.js';
import * as sampleLeadTimeOperations from './query/sample_lead_time.js';
import * as stockStatusOperations from './query/stock_status.js';
import { selectTeamOrMarketingTargetAchievement } from './query/team_marketing_target_achievement.js';
import * as topSalesOperations from './query/top_sales.js';
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

dashBoardRouter.get(
	'/pi-to-be-submitted',
	piToBeSubmittedOperations.selectPiToBeSubmittedDashboard
);

dashBoardRouter.get(
	'/document-rcv-log',
	documentRcvLogOperations.selectDocumentRcvLog
);

dashBoardRouter.get('/lc-feed', lcFeedOperations.selectLcFeed);

dashBoardRouter.get('/stock-status', stockStatusOperations.selectStockStatus);

dashBoardRouter.get('/order-entry', orderEntryOperations.selectOrderEntry);

dashBoardRouter.get(
	'/amount-and-doc',
	amountAndDocOperations.selectAmountAndDoc
);

dashBoardRouter.get('/top-sales', topSalesOperations.selectTopSales);

dashBoardRouter.get(
	'/document-rcv-due',
	amountAndDocOperations.selectDocumentRcvDue
);

dashBoardRouter.get(
	'/acceptance-due',
	amountAndDocOperations.selectAcceptanceDue
);

dashBoardRouter.get('/maturity-due', amountAndDocOperations.selectMaturityDue);

dashBoardRouter.get('/payment-due', amountAndDocOperations.selectPaymentDue);

dashBoardRouter.get(
	'/amount-percentage',
	amountAndDocOperations.selectAmountPercentage
);

dashBoardRouter.get('/no-of-doc', amountAndDocOperations.selectNoOfDoc);

dashBoardRouter.get(
	'/team-marketing-target-achievement/:year/:type',
	selectTeamOrMarketingTargetAchievement
);

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
	'/dashboard/pi-to-be-submitted': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get pi to be submitted summary',
			description: 'Get pi to be submitted summary',
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
									name: SE.string('PI24-0001'),
									total_quantity: SE.uuid(),
									total_pi: SE.string('4F'),
									total_balance_pi_quantity: SE.uuid(),
									total_balance_pi_value:
										SE.string('2406-234-765'),
									total_delivered: SE.string('LC24-0001'),
									total_undelivered_balance_quantity:
										SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/document-rcv-log': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get document receive log summary',
			description: 'Get document receive log summary',
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
							schema: {
								type: 'object',
								properties: {
									total_count: SE.number(100),
									chart_data: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												file_number:
													SE.string('LC24-0001'),
												party_name: SE.string('4F'),
												marketing_name:
													SE.string('Marketing 1'),
												lc_value: SE.number(1000),
												lc_date:
													SE.string('2021-01-01'),
											},
										},
									},
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/lc-feed': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get lc feed summary',
			description: 'Get lc feed summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									file_number: SE.string('LC24-0001'),
									party_name: SE.string('4F'),
									marketing_name: SE.string('Marketing 1'),
									lc_value: SE.number(1000),
									lc_date: SE.string('2021-01-01'),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/stock-status': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get stock status summary',
			description: 'Get stock status summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: SE.string('Vislon'),
									threshold: SE.number(1000),
									stock: SE.number(1000),
									unit: SE.string('kg'),
									last_purchase_date: SE.string('2021-01-01'),
									lead_time: SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/order-entry': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get order entry summary',
			description: 'Get order entry summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									date: SE.string('2021-01-01'),
									zipper: SE.integer(1000),
									thread: SE.integer(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/amount-and-doc': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get amount and doc summary',
			description: 'Get amount and doc summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									total_doc_rcv_due: SE.number(1000),
									number_of_pending_doc_rcv: SE.number(1000),
									total_acceptance_due: SE.number(1000),
									number_of_pending_acceptance_due:
										SE.number(1000),
									total_maturity_due: SE.number(1000),
									number_of_pending_maturity_due:
										SE.number(1000),
									total_payment_due: SE.number(1000),
									number_of_pending_payment_due:
										SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/top-sales': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get top sales summary',
			description: 'Get top sales summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: SE.string('Vislon'),
									sales: SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/document-rcv-due': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get document receive due summary',
			description: 'Get document receive due summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									total_doc_rcv_due: SE.number(1000),
									number_of_pending_doc_rcv: SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/acceptance-due': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get acceptance due summary',
			description: 'Get acceptance due summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									total_acceptance_due: SE.number(1000),
									number_of_pending_acceptance_due:
										SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/maturity-due': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get maturity due summary',
			description: 'Get maturity due summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									total_maturity_due: SE.number(1000),
									number_of_pending_maturity_due:
										SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/payment-due': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get payment due summary',
			description: 'Get payment due summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									total_payment_due: SE.number(1000),
									number_of_pending_payment_due:
										SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/amount-percentage': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get amount percentage summary',
			description: 'Get amount percentage summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: SE.string('Vislon'),
									Amount: SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},

	'/dashboard/no-of-doc': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get number of doc summary',
			description: 'Get number of doc summary',
			parameters: [],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: SE.string('Vislon'),
									no_of_doc: SE.number(1000),
								},
							},
						},
					},
				},
				500: SE.response(500),
			},
		},
	},
	'/dashboard/team-marketing-target-achievement/{year}/{type}': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get team marketing target achievement summary',
			description: 'Get team marketing target achievement summary',
			parameters: [
				{
					name: 'year',
					in: 'path',
					required: true,
					description: 'Year of the target',
					schema: {
						type: 'number',
						example: 2021,
					},
				},
				{
					name: 'type',
					in: 'path',
					required: true,
					description: 'Type of the target',
					schema: {
						type: 'string',
						enum: ['team', 'marketing'],
					},
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									team_name: SE.string('Team 1'),
									marketing_uuid: SE.uuid(),
									marketing_name: SE.string('Marketing 1'),
									is_team_leader: SE.boolean(true),
									zipper_target: SE.number(1000),
									thread_target: SE.number(1000),
									year: SE.number(2021),
									zipper_achievement: SE.number(1000),
									thread_achievement: SE.number(1000),
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
