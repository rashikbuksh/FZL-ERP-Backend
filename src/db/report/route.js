import { Router } from 'express';

import SE, { SED } from '../../util/swagger_example.js';
import { selectCashInvoice } from './query/cash_invoice.js';
import { selectLabDip } from './query/lab_dip.js';
import { MaterialStockReport } from './query/material_stock_report.js';
import { ProductionReportThreadPartyWise } from './query/party_wise_thread_production_report.js';
import {
	threadProductionReportByDate,
	threadProductionReportPartyWiseByDate,
} from './query/thread_production_report_by_date.js';
import * as reportOperations from './query/query.js';
import {
	selectSampleReport,
	selectSampleReportByDate,
} from './query/sample_report.js';
import { threadProductionStatusOrderWise } from './query/thread_production_report_order_wise.js';
const reportRouter = Router();

// * Zipper Production Status Report
reportRouter.get(
	'/zipper-production-status-report',
	reportOperations.zipperProductionStatusReport
);

// * Daily Challan Report
reportRouter.get('/daily-challan-report', reportOperations.dailyChallanReport);

// * Pi Register Report
reportRouter.get('/pi-register-report', reportOperations.PiRegister);

// * Pi To Be Register Report
reportRouter.get('/pi-to-be-register-report', reportOperations.PiToBeRegister);

// * Pi To Be Register Report Thread
reportRouter.get(
	'/pi-to-be-register-report-thread',
	reportOperations.PiToBeRegisterThread
);

// * LCReport
reportRouter.get('/lc-report', reportOperations.LCReport);

// * Thread Batch Wise Report
reportRouter.get(
	'/thread-production-batch-wise-report',
	reportOperations.threadProductionStatusBatchWise
);
//* Thread Production Status By Date
reportRouter.get(
	'/thread-production-report-by-date',
	threadProductionReportByDate
);

//* Thread Production Status Party Wise By Date
reportRouter.get(
	'/thread-production-report-party-wise-by-date',
	threadProductionReportPartyWiseByDate
);

// * Production Report Director
reportRouter.get(
	'/production-report-director',
	reportOperations.ProductionReportDirector
);

// * Production Report Thread Director
reportRouter.get(
	'/production-report-thread-director',
	reportOperations.ProductionReportThreadDirector
);

// * Production Report Sales & Marketing
reportRouter.get(
	'/production-report-sales-marketing',
	reportOperations.ProductionReportSnm
);

// * Production Report Thread Sales & Marketing
reportRouter.get(
	'/production-report-thread-sales-marketing',
	reportOperations.ProductionReportThreadSnm
);

//* Daily Production Report
reportRouter.get(
	'/daily-production-report',
	reportOperations.dailyProductionReport
);

//* Delivery Statement Report
reportRouter.get(
	'/delivery-statement-report',
	reportOperations.deliveryStatementReport
);

//* Party Wise Production Report Thread
reportRouter.get(
	'/production-report-thread-party-wise',
	ProductionReportThreadPartyWise
);

//* Material Stock Report
reportRouter.get('/material-stock-report', MaterialStockReport);

// * Sample Report
reportRouter.get('/sample-report', selectSampleReport);
reportRouter.get('/sample-report-by-date', selectSampleReportByDate);

// * Cash Invoice Report
reportRouter.get('/cash-invoice-report', selectCashInvoice);

// * Thread Production Status Order Wise
reportRouter.get(
	'/thread-production-status-order-wise',
	threadProductionStatusOrderWise
);

// * lab dip data
reportRouter.get('/lab-dip', selectLabDip);

export const pathReport = {
	'/report/zipper-production-status-report': {
		get: {
			summary: 'Zipper Production Status Report',
			description: 'Zipper Production Status Report',
			tags: ['report'],
			operationId: 'zipperProductionStatusReport',
			parameters: [SE.parameter_query('status', 'status', [])],
			responses: {
				200: {
					description: 'Zipper Production Status Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('zipperProductionStatusReport'),
							},
						},
					},
				},
			},
		},
	},
	'/report/daily-challan-report': {
		get: {
			summary: 'Daily Challan Report',
			description: 'Daily Challan Report',
			tags: ['report'],
			operationId: 'dailyChallanReport',
			parameters: [],
			responses: {
				200: {
					description: 'Daily Challan Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('dailyChallanReport'),
							},
						},
					},
				},
			},
		},
	},
	'/report/pi-register-report': {
		get: {
			summary: 'Pi Register Report',
			description: 'Pi Register Report',
			tags: ['report'],
			operationId: 'PiRegister',
			parameters: [],
			responses: {
				200: {
					description: 'Pi Register Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('PiRegister'),
							},
						},
					},
				},
			},
		},
	},
	'/report/pi-to-be-register-report': {
		get: {
			summary: 'Pi To Be Register Report',
			description: 'Pi To Be Register Report',
			tags: ['report'],
			operationId: 'PiToBeRegister',
			parameters: [SE.parameter_query('own_uuid', 'own_uuid', '[]')],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string(),
					total_quantity: SE.number(3950),
					total_pi: SE.number(610),
					total_balance_pi_quantity: SE.number(3340),
					total_balance_pi_value: SE.number(101555),
					total_delivered: SE.number(0),
					total_undelivered_balance_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/pi-to-be-register-report-thread': {
		get: {
			summary: 'Pi To Be Register Report Thread',
			description: 'Pi To Be Register Report Thread',
			tags: ['report'],
			operationId: 'PiToBeRegisterThread',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string(),
					total_quantity: SE.number(3950),
					total_pi: SE.number(610),
					total_balance_pi_quantity: SE.number(3340),
					total_balance_pi_value: SE.number(101555),
					total_delivered: SE.number(0),
					total_undelivered_balance_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/lc-report': {
		get: {
			summary: 'LCReport',
			description: 'LCReport',
			tags: ['report'],
			operationId: 'LCReport',
			parameters: [
				SE.parameter_query('document_receiving', 'document_receiving', [
					true,
					false,
				]),
				SE.parameter_query('acceptance', 'acceptance', [true, false]),
				SE.parameter_query('maturity', 'maturity', [true, false]),
				SE.parameter_query('payment', 'payment', [true, false]),
			],
			responses: {
				200: SE.response_schema(200, {
					file_number: SE.string('LC24-0001'),
					uuid: SE.uuid(),
					lc_number: SE.number(610),
					lc_date: SE.date_time(),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					payment_value: SE.number(101555),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					commercial_executive: SE.string('Commercial Executive'),
					handover_date: SE.date_time(),
					document_receive_date: SE.date_time(),
					acceptance_date: SE.date_time(),
					maturity_date: SE.date_time(),
					payment_date: SE.date_time(),
					ldbc_fdbc: SE.string('LDBC/FDBC'),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					ud_no: SE.string('UD No'),
					ud_received: SE.string('UD Received'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('Marketing Name'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bank Name'),
					party_bank: SE.string('Party Bank'),
				}),
			},
		},
	},
	'/report/thread-production-batch-wise-report': {
		get: {
			summary: 'Thread Batch Wise Report',
			description: 'Thread Batch Wise Report',
			tags: ['report'],
			operationId: 'threadProductionStatusBatchWise',
			parameters: [SE.parameter_query('status', 'status', [])],
			responses: {
				200: SE.response_schema(200, {
					batch_number: SE.string('Batch Number'),
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-director': {
		get: {
			summary: 'Production Report Director',
			description: 'Production Report Director',
			tags: ['report'],
			operationId: 'ProductionReportDirector',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-thread-director': {
		get: {
			summary: 'Production Report Thread Director',
			description: 'Production Report Thread Director',
			tags: ['report'],
			operationId: 'ProductionReportThreadDirector',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-sales-marketing': {
		get: {
			summary: 'Production Report Sales & Marketing',
			description: 'Production Report Sales & Marketing',
			tags: ['report'],
			operationId: 'ProductionReportSnm',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-thread-sales-marketing': {
		get: {
			summary: 'Production Report Thread Sales & Marketing',
			description: 'Production Report Thread Sales & Marketing',
			tags: ['report'],
			operationId: 'ProductionReportThreadSnm',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/daily-production-report': {
		get: {
			summary: 'Daily Production Report',
			description: 'Daily Production Report',
			tags: ['report'],
			operationId: 'dailyProductionReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Item Name'),
					order_number: SE.string('Order Number'),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					order_description_uuid: SE.uuid(),
					item_description: SE.string('Item Description'),
					end_type: SE.uuid(),
					end_type_name: SE.string('End Type Name'),
					order_entry_uuid: SE.uuid(),
					size: SE.string('Size'),
					opening_total_close_end_quantity: SE.number(610),
					opening_total_open_end_quantity: SE.number(610),
					opening_total_quantity: SE.number(610),
					opening_total_quantity_dzn: SE.number(610),
					opening_unit_price_dzn: SE.number(610),
					opening_unit_price_pcs: SE.number(610),
					opening_total_close_end_value: SE.number(610),
					opening_total_open_end_value: SE.number(610),
					opening_total_value: SE.number(610),
					challan_numbers: SE.string('Challan Numbers'),
					challan_date: SE.date_time(),
					running_total_close_end_quantity: SE.number(610),
					running_total_open_end_quantity: SE.number(610),
					running_total_quantity: SE.number(610),
					running_total_quantity_dzn: SE.number(610),
					running_unit_price_dzn: SE.number(610),
					running_unit_price_pcs: SE.number(610),
					running_total_close_end_value: SE.number(610),
					running_total_open_end_value: SE.number(610),
					running_total_value: SE.number(610),
				}),
			},
		},
	},
	'/report/delivery-statement-report': {
		get: {
			summary: 'Delivery Statement Report',
			description: 'Delivery Statement Report',
			tags: ['report'],
			operationId: 'deliveryStatementReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Item Name'),
					order_number: SE.string('Order Number'),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					order_description_uuid: SE.uuid(),
					item_description: SE.string('Item Description'),
					end_type: SE.uuid(),
					end_type_name: SE.string('End Type Name'),
					order_entry_uuid: SE.uuid(),
					size: SE.string('Size'),
					opening_total_close_end_quantity: SE.number(610),
					opening_total_open_end_quantity: SE.number(610),
					opening_total_quantity: SE.number(610),
					opening_total_quantity_dzn: SE.number(610),
					opening_unit_price_dzn: SE.number(610),
					opening_unit_price_pcs: SE.number(610),
					opening_total_close_end_value: SE.number(610),
					opening_total_open_end_value: SE.number(610),
					opening_total_value: SE.number(610),
					challan_numbers: SE.string('Challan Numbers'),
					challan_date: SE.date_time(),
					running_total_close_end_quantity: SE.number(610),
					running_total_open_end_quantity: SE.number(610),
					running_total_quantity: SE.number(610),
					running_total_quantity_dzn: SE.number(610),
					running_unit_price_dzn: SE.number(610),
					running_unit_price_pcs: SE.number(610),
					running_total_close_end_value: SE.number(610),
					running_total_open_end_value: SE.number(610),
					running_total_value: SE.number(610),
				}),
			},
		},
	},
	'/report/production-report-thread-party-wise': {
		get: {
			summary: 'Party Wise Production Report Thread',
			description: 'Party Wise Production Report Thread',
			tags: ['report'],
			operationId: 'ProductionReportThreadPartyWise',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					count_length_name: SE.string('Count Length Name'),
					total_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/material-stock-report': {
		get: {
			summary: 'Material Stock Report',
			description: 'Material Stock Report',
			tags: ['report'],
			operationId: 'MaterialStockReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					material_section_name: SE.string('Section Name'),
					material_unit: SE.string('Material Unit'),
					opening_quantity: SE.number(610),
					purchase_quantity: SE.number(610),
					consumption_quantity: SE.number(610),
					closing_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/sample-report': {
		get: {
			summary: 'Sample Report',
			description: 'Sample Report',
			tags: ['report'],
			operationId: 'selectSampleReport',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					sample_order_no: SE.string('Sample Order No'),
					issue_date: SE.date_time(),
					status: SE.string('Status'),
					delivery_last_date: SE.date_time(),
					delivery_quantity: SE.number(610),
					order_quantity: SE.number(610),
					delivery_order_quantity: SE.string(
						'Delivery Order Quantity'
					),
				}),
			},
		},
	},
	'/report/sample-report-by-date': {
		get: {
			summary: 'Sample Report By Date',
			description: 'Sample Report By Date',
			tags: ['report'],
			operationId: 'selectSampleReportByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
			],
			responses: {
				200: SE.response_schema(200, {
					sample_order_no: SE.string('Sample Order No'),
					issue_date: SE.date_time(),
					status: SE.string('Status'),
					delivery_last_date: SE.date_time(),
					delivery_quantity: SE.number(610),
					order_quantity: SE.number(610),
					delivery_order_quantity: SE.string(
						'Delivery Order Quantity'
					),
				}),
			},
		},
	},
	'/report/cash-invoice-report': {
		get: {
			summary: 'Cash Invoice Report',
			description: 'Cash Invoice Report',
			tags: ['report'],
			operationId: 'selectCashInvoice',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.string('ID'),
					value: SE.number(610),
					order_number: SE.string('Order Number'),
					receive_amount: SE.number(610),
				}),
			},
		},
	},
	'/report/thread-production-status-order-wise': {
		get: {
			summary: 'Thread Production Status Order Wise',
			description: 'Thread Production Status Order Wise',
			tags: ['report'],
			operationId: 'threadProductionStatusOrderWise',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					order_entry_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					order_created_at: SE.date_time(),
					order_updated_at: SE.date_time(),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('Marketing Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					swatch_approval_date: SE.date_time(),
					count_length_uuid: SE.uuid(),
					count: SE.string('Count'),
					length: SE.string('Length'),
					total_quantity: SE.number(610),
					total_weight: SE.number(610),
					yarn_quantity: SE.number(610),
					total_coning_production_quantity: SE.number(610),
					warehouse: SE.number(610),
					total_delivery_delivered_quantity: SE.number(610),
					total_delivery_balance_quantity: SE.number(610),
					total_short_quantity: SE.number(610),
					total_reject_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/lab-dip': {
		get: {
			summary: 'lab dip data',
			description: 'lab dip data',
			tags: ['report'],
			operationId: 'selectLabDip',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					info_id: SE.string('Info ID'),
					lab_dip_name: SE.string('Lab Dip Name'),
					lab_status: SE.number(610),
					recipe_id: SE.string('Recipe ID'),
					recipe_name: SE.string('Recipe Name'),
					recipe_status: SE.number(610),
					order_entry_created_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/thread-production-report-by-date': {
		get: {
			summary: 'Thread Production Status By Date',
			description: 'Thread Production Status By Date',
			tags: ['report'],
			operationId: 'threadProductionReportByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('own_uuid', 'own_uuid', '2024-10-01'),
			],
			responses: {
				200: SE.response_schema(200, {
					party_name: SE.string('Party Name'),
					total_quantity: SE.number(610),
					total_weight: SE.number(610),
					yarn_quantity: SE.number(610),
					total_coning_production_quantity: SE.number(610),
				}),
			},
		},
	},

	'/report/thread-production-report-party-wise-by-date': {
		get: {
			summary: 'Thread Production Status Party Wise By Date',
			description: 'Thread Production Status Party Wise By Date',
			tags: ['report'],
			operationId: 'threadProductionReportPartyWiseByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('own_uuid', 'own_uuid', '2024-10-01'),
			],
			responses: {
				200: SE.response_schema(200, {
					party_name: SE.string('Party Name'),
					total_quantity: SE.number(610),
					total_weight: SE.number(610),
					yarn_quantity: SE.number(610),
					total_coning_production_quantity: SE.number(610),
				}),
			},
		},
	},
};

export const tagReport = [
	{
		name: 'report',
		description: 'Report Operations',
	},
];

export { reportRouter };
