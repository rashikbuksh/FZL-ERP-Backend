import { Router } from 'express';

import * as ReportRoutes from './path.js';

import * as marketReportArchiveOperations from './query/market_report_archive.js';

import { selectCashInvoice } from './query/cash_invoice.js';
import { selectChallanPdf } from './query/challan_pdf.js';
import { selectCountLengthWiseDeliveryReport } from './query/count_length_wise_delivery_report.js';
import {
	selectDeliveryReportThread,
	selectDeliveryReportZipper,
} from './query/delivery_report.js';
import {
	deliveryStatementReport,
	deliveryStatementReportPDF,
} from './query/delivery_statement.js';
import {
	selectItemZipperEndApprovedQuantity,
	selectPartyWiseApprovedQuantity,
	selectItemZipperEndSwatchApprovedQuantity,
} from './query/item_zipper_number_end_wise_approved.js';
import { selectLabDip } from './query/lab_dip.js';
import {
	MaterialStockReport,
	MaterialStockReportV2,
} from './query/material_stock_report.js';
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
import {
	ProductionReportSnm,
	ProductionReportThreadSnm,
} from './query/order_status_report.js';
import { selectItemMarketingOrderQuantity } from './query/item_wise_order.js';
import { zipperBatchReportOnReceivedDate } from './query/zipper_batch_report.js';
import { selectSampleBulkItemWiseStatus } from './query/sample_bulk_item_wise_status.js';

import { fortnightReport } from './lc_report/fortnight_report.js';
import { PaymentReport } from './lc_report/payment_report.js';

import { balanceReport } from './acc_report/balance.js';
import {
	chartOfAccountsReport,
	chartOfAccountsReportTableView,
} from './acc_report/chart_of_accounts.js';
import { utilityReport } from './maintain/utility_report.js';
import { selectMarketReport } from './query/market_report.js';

const reportRouter = Router();

// * Zipper Production Status Report
reportRouter.get(
	'/zipper-production-status-report',
	reportOperations.zipperProductionStatusReport
);

reportRouter.get(
	'/zipper-production-status-report-v2',
	reportOperations.zipperProductionStatusReportV2
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
reportRouter.get('/production-report-sales-marketing', ProductionReportSnm);

// * Production Report Thread Sales & Marketing
reportRouter.get(
	'/production-report-thread-sales-marketing',
	ProductionReportThreadSnm
);

//* Daily Production Report
reportRouter.get(
	'/daily-production-report',
	reportOperations.dailyProductionReport
);

//* Delivery Statement Report
reportRouter.get('/delivery-statement-report', deliveryStatementReport);
reportRouter.get('/delivery-statement-report/pdf', deliveryStatementReportPDF);

//* Party Wise Production Report Thread
reportRouter.get(
	'/production-report-thread-party-wise',
	ProductionReportThreadPartyWise
);

//* Material Stock Report
reportRouter.get('/material-stock-report', MaterialStockReport);
reportRouter.get('/v2/material-stock-report', MaterialStockReportV2);

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

// * Item Zipper Number End Wise Swatch Approved
reportRouter.get(
	'/item-zipper-number-end-wise-swatch-approved',
	selectItemZipperEndSwatchApprovedQuantity
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
reportRouter.get(
	'/item-marketing-wise-order-quantity',
	selectItemMarketingOrderQuantity
);
// * Zipper Batch Report
reportRouter.get('/zipper-batch-report', zipperBatchReportOnReceivedDate);

// * sample_bulk_item_wise_status
reportRouter.get(
	'/order-item-type-wise-status',
	selectSampleBulkItemWiseStatus
);

// * LC FORTNIGHT REPORT
reportRouter.get('/lc-fortnight-report', fortnightReport);
reportRouter.get('/lc-payment-report', PaymentReport);

// * ACC BALANCE REPORT
reportRouter.get('/acc-balance-report', balanceReport);

// * Chart of Accounts (Tree View)
reportRouter.get('/chart-of-accounts', chartOfAccountsReport);

// * Chart of Accounts (Table View)
reportRouter.get(
	'/chart-of-accounts-table-view',
	chartOfAccountsReportTableView
);

// * Utility Report
reportRouter.get('/utility-report', utilityReport);

// * Market Report
reportRouter.get('/market-report', selectMarketReport);

// * Market Report Archive routes
reportRouter.post(
	'/market-report-archive',
	marketReportArchiveOperations.insert
);
reportRouter.get(
	'/market-report-archive',
	marketReportArchiveOperations.selectAll
);
reportRouter.get(
	'/market-report-archive/:uuid',
	marketReportArchiveOperations.select
);
reportRouter.delete(
	'/market-report-archive/:uuid',
	marketReportArchiveOperations.remove
);
reportRouter.post(
	'/market-report-archive/:uuid',
	marketReportArchiveOperations.update
);
reportRouter.post(
	'/market-report-archive/:uuid/confirm',
	marketReportArchiveOperations.confirmMarketReport
);

export const pathReport = {
	...ReportRoutes.pathReport,
};

export const tagReport = [
	{
		name: 'report',
		description: 'Report Operations',
	},
];

export { reportRouter };
