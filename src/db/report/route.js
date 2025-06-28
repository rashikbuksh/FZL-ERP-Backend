import { Router } from 'express';

import SE, { SED } from '../../util/swagger_example.js';
import { selectCashInvoice } from './query/cash_invoice.js';
import { selectChallanPdf } from './query/challan_pdf.js';
import { selectCountLengthWiseDeliveryReport } from './query/count_length_wise_delivery_report.js';
import {
	selectDeliveryReportThread,
	selectDeliveryReportZipper,
} from './query/delivery_report.js';
import { deliveryStatementReport } from './query/delivery_statement.js';
import {
	selectItemZipperEndApprovedQuantity,
	selectPartyWiseApprovedQuantity,
} from './query/item_zipper_number_end_wise_approved.js';
import { selectLabDip } from './query/lab_dip.js';
import { MaterialStockReport } from './query/material_stock_report.js';
import {
	selectOrderRegisterReport,
	selectOrderRegisterReportForPackingList,
} from './query/order_register.js';
import { selectOrderSheetPdf } from './query/order_sheet_pdf.js';
import { selectPackingList } from './query/packing_list_report.js';
import { ProductionReportThreadPartyWise } from './query/party_wise_thread_production_report.js';
import {
	selectProductWiseConsumption,
	selectProductWiseConsumptionForOrder,
} from './query/product_wise_consumption.js';
import {
	selectItemWiseProduction,
	selectItemZipperEndWiseProduction,
} from './query/production_query.js';
import * as reportOperations from './query/query.js';
import { selectEDReport } from './query/report_for_ed.js';
import {
	selectSampleReport,
	selectSampleReportByDate,
	selectSampleReportByDateCombined,
	selectThreadSampleReportByDate,
} from './query/sample_report.js';
import { selectThreadBatchReport } from './query/thread_batch_report.js';
import {
	threadProductionReportByDate,
	threadProductionReportPartyWiseByDate,
} from './query/thread_production_report_by_date.js';
import { threadProductionStatusOrderWise } from './query/thread_production_report_order_wise.js';
import {
	selectOrderSheetSendReceiveReport,
	selectOrderSheetSendReceiveReportThread,
} from './query/order_sheet_send_receive_report.js';
import { selectIndividualMaterialReport } from './query/individual_material_report.js';

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

// * Pi To Be Register Report Marketing Wise
reportRouter.get(
	'/pi-to-be-register-report-marketing-wise',
	reportOperations.PiToBeRegisterMarketingWise
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
reportRouter.get('/delivery-statement-report', deliveryStatementReport);

//* Party Wise Production Report Thread
reportRouter.get(
	'/production-report-thread-party-wise',
	ProductionReportThreadPartyWise
);

//* Material Stock Report
reportRouter.get('/material-stock-report', MaterialStockReport);

// * Individual Material Report
reportRouter.get(
	'/individual-material-report/:material_uuid',
	selectIndividualMaterialReport
);

// * Sample Report
reportRouter.get('/sample-report', selectSampleReport);
reportRouter.get('/sample-report-by-date', selectSampleReportByDate);
reportRouter.get(
	'/sample-report-by-date-combined',
	selectSampleReportByDateCombined
);
reportRouter.get(
	'/thread/sample-report-by-date',
	selectThreadSampleReportByDate
);

// * Cash Invoice Report
reportRouter.get('/cash-invoice-report', selectCashInvoice);

// * Thread Production Status Order Wise
reportRouter.get(
	'/thread-production-status-order-wise',
	threadProductionStatusOrderWise
);

// * lab dip data
reportRouter.get('/lab-dip', selectLabDip);

// * Item Zipper Number End Wise Approved
reportRouter.get(
	'/item-zipper-number-end-wise-approved',
	selectItemZipperEndApprovedQuantity
);

// * party wise approved quantity
reportRouter.get(
	'/party-wise-approved-quantity',
	selectPartyWiseApprovedQuantity
);

// * Order Sheet Pdf Report
reportRouter.get('/order-sheet-pdf-report', selectOrderSheetPdf);

// * Challan Pdf Report

reportRouter.get('/challan-pdf-report/:order_info_uuid', selectChallanPdf);

// * Report for ED
reportRouter.get('/report-for-ed', selectEDReport);

// * Order Register Report
reportRouter.get(
	'/order-register-report/:order_info_uuid',
	selectOrderRegisterReport
);

// * Order Register Report For Packing List
reportRouter.get(
	'/order-register-report-for-packing-list/:order_info_uuid',
	selectOrderRegisterReportForPackingList
);

reportRouter.get(
	'/count-length-wise-delivery-report',
	selectCountLengthWiseDeliveryReport
);

// * Delivery Report
reportRouter.get('/delivery-report', selectDeliveryReportZipper);

reportRouter.get('/delivery-report-thread', selectDeliveryReportThread);

// * Packing List Report
reportRouter.get('/packing-list-report', selectPackingList);

// * Production Report

// ? Item Wise Production Report
reportRouter.get('/item-wise-production-report', selectItemWiseProduction);

// ? Item Zipper End Wise Production Report
reportRouter.get(
	'/item-zipper-end-wise-production-report',
	selectItemZipperEndWiseProduction
);

// * Product Wise Consumption Report
reportRouter.get(
	'/product-wise-consumption-report',
	selectProductWiseConsumption
);

// * Product Wise Consumption For Order Report
reportRouter.get(
	'/product-wise-consumption-for-order-report',
	selectProductWiseConsumptionForOrder
);

// * Thread Batch Report
reportRouter.get('/thread-batch-report', selectThreadBatchReport);

// * Order Sheet Send Receive Report
reportRouter.get(
	'/order-sheet-send-receive-report',
	selectOrderSheetSendReceiveReport
);
reportRouter.get(
	'/order-sheet-send-receive-report-thread',
	selectOrderSheetSendReceiveReportThread
);

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
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
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
	'/report/pi-to-be-register-report-marketing-wise': {
		get: {
			summary: 'Pi To Be Register Report Marketing Wise',
			description: 'Pi To Be Register Report Marketing Wise',
			tags: ['report'],
			operationId: 'PiToBeRegisterMarketingWise',
			parameters: [SE.parameter_query('own_uuid', 'own_uuid', SE.uuid())],
			responses: {
				200: SE.response_schema(200, {
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string(),
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
			parameters: [
				SE.parameter_query('status', 'status', []),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('time_from', 'time_from', '00:00:00'),
				SE.parameter_query('time_to', 'time_to', '23:59:59'),
			],
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
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
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
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
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
				SE.parameter_query(
					'type',
					'type',
					['all', 'bulk', 'sample'],
					true
				),
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
				// marketing, party, type, own_uuid
				SE.parameter_query('marketing', 'marketing', SE.uuid()),
				SE.parameter_query('party', 'party', SE.uuid()),
				SE.parameter_query('type', 'type', ['zipper', 'thread']),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
				SE.parameter_query('report_for', 'report_for', ['accounts']),
				SE.parameter_query(
					'price_for',
					'price_for',
					['company', 'party'],
					true
				),
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
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
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
				SE.parameter_query(
					'store_type',
					'store_type',
					['rm', 'accessories'],
					true
				),
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
	'/report/individual-material-report/:material_uuid': {
		get: {
			summary: 'Individual Material Report',
			description: 'Individual Material Report',
			tags: ['report'],
			operationId: 'selectIndividualMaterialReport',
			parameters: [
				SE.parameter_params(
					'material_uuid',
					'material_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: SE.response_schema(200, {
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					store_type: SE.string('rm/accessories'),
					quantity: SE.number(610),
					price: SE.number(610),
					unit: SE.string('Unit'),
					purchase_description_uuid: SE.uuid(),
					is_local: SE.integer('1/0'),
					lc_number: SE.string('LC Number'),
					challan_number: SE.string('Challan Number'),
					purchase_created_at: SE.date_time(),
					purchase_id: SE.string('SR25-0001 / SRA25-0002'),
					vendor_uuid: SE.uuid(),
					vendor_name: SE.string('Vendor Name'),
					purchase_description_remarks: SE.string(
						'purchase_description_remarks'
					),
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
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('show_zero_balance', 'show_zero_balance', [
					'0',
					'1',
				]),
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
	'/report/sample-report-by-date-combined': {
		get: {
			summary: 'Sample Report By Date Combined',
			description: 'Sample Report By Date Combined',
			tags: ['report'],
			operationId: 'selectSampleReportByDateCombined',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
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
	'/report/thread/sample-report-by-date': {
		get: {
			summary: 'Thread Sample Report By Date',
			description: 'Thread Sample Report By Date',
			tags: ['report'],
			operationId: 'selectThreadSampleReportByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
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
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('status', 'status', [
					'completed',
					'pending',
				]),
			],
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
	'/report/item-zipper-number-end-wise-approved': {
		get: {
			summary: 'Item Zipper Number End Wise Approved',
			description: 'Item Zipper Number End Wise Approved',
			tags: ['report'],
			operationId: 'selectItemZipperEndApprovedQuantity',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					zipper_number_name: SE.string('Zipper Number Name'),
					end_type_name: SE.string('End Type Name'),
					not_approved: SE.number(610),
					approved: SE.number(610),
				}),
			},
		},
	},
	'/report/order-sheet-pdf-report': {
		get: {
			summary: 'Order Sheet Pdf Report',
			description: 'Order Sheet Pdf Report',
			tags: ['report'],
			operationId: 'selectOrderSheetPdf',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('type', 'type', ['zipper', 'thread']),
				SE.parameter_query('marketing', 'marketing', SE.uuid()),
				SE.parameter_query('party', 'party', SE.uuid()),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					order_entry: SE.sub_response_schema({
						order_entry_uuid: SE.uuid(),
						style: SE.string('Item Name'),
						color: SE.string('End Type Name'),
						size: SE.string('Size'),
						quantity: SE.number(610),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						index: SE.number(610),
						remarks: SE.string('Remarks'),
					}),
				}),
			},
		},
	},
	'/report/party-wise-approved-quantity': {
		get: {
			summary: 'Party Wise Approved Quantity',
			description: 'Party Wise Approved Quantity',
			tags: ['report'],
			operationId: 'selectPartyWiseApprovedQuantity',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					party_name: SE.string('Party Name'),
					not_approved: SE.number(610),
					approved: SE.number(610),
				}),
			},
		},
	},
	'/report/challan-pdf-report/{order_info_uuid}': {
		get: {
			summary: 'Challan Pdf Report',
			description: 'Challan Pdf Report',
			tags: ['report'],
			operationId: 'selectChallanPdf',
			parameters: [
				SE.parameter_params(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					challan_number: SE.string('ZC25-0001'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z25-0001'),
					total_carton_quantity: SE.number(610),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('Buyer Name'),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('Merchandiser Name'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('Factory Name'),
					factory_address: SE.string('Factory Address'),
					vehicle_uuid: SE.uuid(),
					vehicle_name: SE.string('Vehicle Name'),
					vehicle_driver_name: SE.string('Driver Name'),
					carton_quantity: SE.number(610),
					receive_status: SE.string('Receive Status'),
				}),
			},
		},
	},
	'/report/report-for-ed': {
		get: {
			summary: 'Report For ED',
			description: 'Report For ED',
			tags: ['report'],
			operationId: 'selectEDReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-register-report/{order_info_uuid}': {
		get: {
			summary: 'Order Register Report',
			description: 'Order Register Report',
			tags: ['report'],
			operationId: 'selectOrderRegisterReport',
			parameters: [
				SE.parameter_params(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-register-report-for-packing-list/{order_info_uuid}': {
		get: {
			summary: 'Order Register Report for Packing List',
			description: 'Order Register Report for Packing List',
			tags: ['report'],
			operationId: 'selectOrderRegisterReportForPackingList',
			parameters: [
				SE.parameter_params(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/delivery-report': {
		get: {
			summary: 'Delivery Report',
			description: 'Delivery Report',
			tags: ['report'],
			operationId: 'selectDeliveryReportZipper',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('order_type', 'order_type', [
					'all',
					'sample',
					'bulk',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/delivery-report-thread': {
		get: {
			summary: 'Delivery Report Thread',
			description: 'Delivery Report Thread',
			tags: ['report'],
			operationId: 'selectDeliveryReportThread',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('order_type', 'order_type', [
					'all',
					'sample',
					'bulk',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/count-length-wise-delivery-report': {
		get: {
			summary: 'Count Length Wise Delivery Report',
			description: 'Count Length Wise Delivery Report',
			tags: ['report'],
			operationId: 'selectCountLengthWiseDeliveryReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/packing-list-report': {
		get: {
			summary: 'Packing List Report',
			description: 'Packing List Report',
			tags: ['report'],
			operationId: 'selectPackingListReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('order_type', 'order_type', [
					'all',
					'sample',
					'bulk',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/item-wise-production-report': {
		get: {
			summary: 'Item Wise Production Report',
			description: 'Item Wise Production Report',
			tags: ['report'],
			operationId: 'selectItemWiseProductionReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					total_production: SE.number(610),
				}),
			},
		},
	},
	'/report/item-zipper-end-wise-production-report': {
		get: {
			summary: 'Item Zipper End Wise Production Report',
			description: 'Item Zipper End Wise Production Report',
			tags: ['report'],
			operationId: 'selectItemZipperEndWiseProductionReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					zipper_number_name: SE.string('Zipper Number Name'),
					end_type_name: SE.string('End Type Name'),
					total_production: SE.number(610),
				}),
			},
		},
	},
	'/report/product-wise-consumption-report': {
		get: {
			summary: 'Product Wise Consumption Report',
			description: 'Product Wise Consumption Report',
			tags: ['report'],
			operationId: 'selectProductWiseConsumptionReport',
			parameters: [
				SE.parameter_query(
					'type',
					'type',
					['nylon_plastic', 'nylon', 'vislon', 'metal', 'all'],
					true
				),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					product_name: SE.string('Product Name'),
					total_consumption: SE.number(610),
				}),
			},
		},
	},
	'/report/product-wise-consumption-for-order-report': {
		get: {
			summary: 'Product Wise Consumption For Order Report',
			description: 'Product Wise Consumption For Order Report',
			tags: ['report'],
			operationId: 'selectProductWiseConsumptionForOrder',
			parameters: [
				SE.parameter_query(
					'type',
					'type',
					['nylon_plastic', 'nylon', 'vislon', 'metal', 'all'],
					true
				),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					product_name: SE.string('Product Name'),
					total_consumption: SE.number(610),
				}),
			},
		},
	},
	'/report/thread-batch-report': {
		get: {
			summary: 'Thread Batch Report',
			description: 'Thread Batch Report',
			tags: ['report'],
			operationId: 'selectThreadBatchReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
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
	'/report/order-sheet-send-receive-report': {
		get: {
			summary: 'Order Sheet Send Receive Report',
			description: 'Order Sheet Send Receive Report',
			tags: ['report'],
			operationId: 'selectOrderSheetSendReceiveReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('date_type', 'date_type', [
					'sno',
					'factory',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-sheet-send-receive-report-thread': {
		get: {
			summary: 'Order Sheet Send Receive Report Thread',
			description: 'Order Sheet Send Receive Report Thread',
			tags: ['report'],
			operationId: 'selectOrderSheetSendReceiveReportThread',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('date_type', 'date_type', [
					'sno',
					'factory',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
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
