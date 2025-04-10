import { Router } from 'express';
import * as dyedTapeTransactionOperations from './query/dyed_tape_transaction.js';
import * as dyedTapeTransactionFromStockOperations from './query/dyed_tape_transaction_from_stock.js';
import * as dyeingBatchOperations from './query/dyeing_batch.js';
import * as dyeingBatchEntryOperations from './query/dyeing_batch_entry.js';
import * as dyeingBatchProductionOperations from './query/dyeing_batch_production.js';
import * as finishingBatchOperations from './query/finishing_batch.js';
import * as finishingBatchEntryOperations from './query/finishing_batch_entry.js';
import * as finishingBatchProductionOperations from './query/finishing_batch_production.js';
import * as finishingBatchTransactionOperations from './query/finishing_batch_transaction.js';
import * as materialTrxAgainstOrderOperations from './query/material_trx_against_order_description.js';
import * as multiColorDashboardOperations from './query/multi_color_dashboard.js';
import * as multiColorTapeReceiveOperations from './query/multi_color_tape_receive.js';
import * as orderDescriptionOperations from './query/order_description.js';
import * as orderEntryOperations from './query/order_entry.js';
import * as orderInfoOperations from './query/order_info.js';
import * as planningOperations from './query/planning.js';
import * as planningEntryOperations from './query/planning_entry.js';
import * as sfgOperations from './query/sfg.js';
import * as tapeCoilOperations from './query/tape_coil.js';
import * as tapeCoilProductionOperations from './query/tape_coil_production.js';
import * as tapeCoilRequiredOperations from './query/tape_coil_required.js';
import * as tapeCoilToDyeingOperations from './query/tape_coil_to_dyeing.js';
import * as tapeTrxOperations from './query/tape_trx.js';
import * as orderEntryLogOperations from './query/order_entry_log.js';

const zipperRouter = Router();

// --------------------- ORDER INFO ROUTES ---------------------

zipperRouter.get('/order-info', orderInfoOperations.selectAll);
zipperRouter.get('/order-info/:uuid', orderInfoOperations.select);
zipperRouter.post('/order-info', orderInfoOperations.insert);
zipperRouter.put('/order-info/:uuid', orderInfoOperations.update);
zipperRouter.delete('/order-info/:uuid', orderInfoOperations.remove);
zipperRouter.get('/order/details', orderInfoOperations.getOrderDetails);
zipperRouter.get(
	'/order/details/by/:own_uuid',
	orderInfoOperations.getOrderDetailsByOwnUuid
);
zipperRouter.put(
	'/order-info/print-in/update/by/:uuid',
	orderInfoOperations.updatePrintIn
);
zipperRouter.get('/tape-assigned', orderInfoOperations.getTapeAssigned);

// --------------------- ORDER DESCRIPTION ROUTES ---------------------

zipperRouter.get('/order-description', orderDescriptionOperations.selectAll);
zipperRouter.get('/order-description/:uuid', orderDescriptionOperations.select);
zipperRouter.post('/order-description', orderDescriptionOperations.insert);
zipperRouter.put('/order-description/:uuid', orderDescriptionOperations.update);
zipperRouter.delete(
	'/order-description/:uuid',
	orderDescriptionOperations.remove
);
zipperRouter.get(
	'/order/description/full/uuid/by/:order_description_uuid',
	orderDescriptionOperations.selectOrderDescriptionFullByOrderDescriptionUuid
);
zipperRouter.get(
	'/order/details/single-order/by/:order_description_uuid/UUID',
	orderDescriptionOperations.selectOrderDescriptionUuidToGetOrderDescriptionAndOrderEntry
);
zipperRouter.get(
	'/order/details/single-order/by/:order_number',
	orderDescriptionOperations.selectOrderNumberToGetOrderDescriptionAndOrderEntry
);
zipperRouter.get(
	'/order/details/single-order/by/:order_number/marketing/:marketing_uuid',
	orderDescriptionOperations.selectOrderNumberToGetOrderDescriptionAndOrderEntryOfMarketing
);
zipperRouter.put(
	'/order/description/update/by/:tape_coil_uuid',
	orderDescriptionOperations.updateOrderDescriptionByTapeCoil
);

// --------------------- ORDER ENTRY ROUTES ---------------------

zipperRouter.get('/order-entry', orderEntryOperations.selectAll);
zipperRouter.get('/order-entry/:uuid', orderEntryOperations.select);
zipperRouter.post('/order-entry', orderEntryOperations.insert);
zipperRouter.put('/order-entry/:uuid', orderEntryOperations.update);
zipperRouter.delete('/order-entry/:uuid', orderEntryOperations.remove);
zipperRouter.get(
	'/order/entry/full/uuid/by/:order_description_uuid',
	orderEntryOperations.selectOrderEntryFullByOrderDescriptionUuid
);
zipperRouter.get(
	'/order-all-info/by/:order_number',
	orderEntryOperations.selectOrderAllInfoByOrderInfoUuid
);

// --------------------- SFG ROUTES ---------------------

zipperRouter.get('/sfg', sfgOperations.selectAll);
zipperRouter.get('/sfg/:uuid', sfgOperations.select);
zipperRouter.post('/sfg', sfgOperations.insert);
zipperRouter.put('/sfg/:uuid', sfgOperations.update);
zipperRouter.delete('/sfg/:uuid', sfgOperations.remove);
zipperRouter.get('/sfg-swatch', sfgOperations.selectSwatchInfo);
zipperRouter.put('/sfg-swatch/:uuid', sfgOperations.updateSwatchBySfgUuid);
zipperRouter.get('/sfg/by/:section', sfgOperations.selectSfgBySection);

// --------------------- Finishing Batch Production ---------------------

zipperRouter.get(
	'/finishing-batch-production',
	finishingBatchProductionOperations.selectAll
);
zipperRouter.get(
	'/finishing-batch-production/:uuid',
	// validateUuidParam(),
	finishingBatchProductionOperations.select
);
zipperRouter.post(
	'/finishing-batch-production',
	finishingBatchProductionOperations.insert
);
zipperRouter.put(
	'/finishing-batch-production/:uuid',
	finishingBatchProductionOperations.update
);
zipperRouter.delete(
	'/finishing-batch-production/:uuid',
	// validateUuidParam(),
	finishingBatchProductionOperations.remove
);
zipperRouter.get(
	'/finishing-batch-production/by/:section',
	finishingBatchProductionOperations.selectBySection
);

// --------------------- FINISHING BATCH TRANSACTION ROUTES ---------------------

zipperRouter.get(
	'/finishing-batch-transaction',
	finishingBatchTransactionOperations.selectAll
);
zipperRouter.get(
	'/finishing-batch-transaction/:uuid',
	// validateUuidParam(),
	finishingBatchTransactionOperations.select
);
zipperRouter.post(
	'/finishing-batch-transaction',
	finishingBatchTransactionOperations.insert
);
zipperRouter.put(
	'/finishing-batch-transaction/:uuid',
	finishingBatchTransactionOperations.update
);
zipperRouter.delete(
	'/finishing-batch-transaction/:uuid',
	// validateUuidParam(),
	finishingBatchTransactionOperations.remove
);
zipperRouter.get(
	'/finishing-batch-transaction/by/:trx_from',
	// validateUuidParam(),
	finishingBatchTransactionOperations.selectByTrxFrom
);

// --------------------- DYED TAPE TRANSACTION ROUTES ---------------------

zipperRouter.get(
	'/dyed-tape-transaction',
	dyedTapeTransactionOperations.selectAll
);

zipperRouter.get(
	'/dyed-tape-transaction/:uuid',
	dyedTapeTransactionOperations.select
);

zipperRouter.post(
	'/dyed-tape-transaction',
	dyedTapeTransactionOperations.insert
);

zipperRouter.put(
	'/dyed-tape-transaction/:uuid',
	dyedTapeTransactionOperations.update
);

zipperRouter.delete(
	'/dyed-tape-transaction/:uuid',
	dyedTapeTransactionOperations.remove
);

zipperRouter.get(
	'/dyed-tape-transaction/by/:item_name',
	dyedTapeTransactionOperations.selectDyedTapeTransactionBySection
);

// --------------------- DYED TAPE TRANSACTION FROM STOCK ROUTES ---------------------

zipperRouter.get(
	'/dyed-tape-transaction-from-stock',
	dyedTapeTransactionFromStockOperations.selectAll
);

zipperRouter.get(
	'/dyed-tape-transaction-from-stock/:uuid',
	dyedTapeTransactionFromStockOperations.select
);

zipperRouter.post(
	'/dyed-tape-transaction-from-stock',
	dyedTapeTransactionFromStockOperations.insert
);

zipperRouter.put(
	'/dyed-tape-transaction-from-stock/:uuid',
	dyedTapeTransactionFromStockOperations.update
);

zipperRouter.delete(
	'/dyed-tape-transaction-from-stock/:uuid',
	dyedTapeTransactionFromStockOperations.remove
);

// ---------------------DYEING  BATCH ROUTES ---------------------

zipperRouter.get('/dyeing-batch', dyeingBatchOperations.selectAll);
zipperRouter.get('/dyeing-batch/:uuid', dyeingBatchOperations.select);
zipperRouter.post('/dyeing-batch', dyeingBatchOperations.insert);
zipperRouter.put('/dyeing-batch/:uuid', dyeingBatchOperations.update);
zipperRouter.delete(
	'/dyeing-batch/:uuid',
	// validateUuidParam(),
	dyeingBatchOperations.remove
);
zipperRouter.get(
	'/dyeing-batch-details/:dyeing_batch_uuid',
	dyeingBatchOperations.selectBatchDetailsByBatchUuid
);

// --------------------- DYEING BATCH ENTRY ROUTES ---------------------

zipperRouter.get('/dyeing-batch-entry', dyeingBatchEntryOperations.selectAll);
zipperRouter.get(
	'/dyeing-batch-entry/:uuid',
	// validateUuidParam(),
	dyeingBatchEntryOperations.select
);
zipperRouter.post('/dyeing-batch-entry', dyeingBatchEntryOperations.insert);
zipperRouter.put(
	'/dyeing-batch-entry/:uuid',
	dyeingBatchEntryOperations.update
);
zipperRouter.delete(
	'/dyeing-batch-entry/:uuid',
	// validateUuidParam(),
	dyeingBatchEntryOperations.remove
);
zipperRouter.get(
	'/dyeing-batch-entry/by/dyeing-batch-uuid/:dyeing_batch_uuid',
	dyeingBatchEntryOperations.selectBatchEntryByBatchUuid
);
zipperRouter.get(
	'/dyeing-order-batch',
	dyeingBatchEntryOperations.getOrderDetailsForBatchEntry
);

// --------------------- TAPE COIL ROUTES ---------------------

zipperRouter.get('/tape-coil', tapeCoilOperations.selectAll);
zipperRouter.get('/tape-coil/:uuid', tapeCoilOperations.select);
zipperRouter.post('/tape-coil', tapeCoilOperations.insert);
zipperRouter.put('/tape-coil/:uuid', tapeCoilOperations.update);
zipperRouter.delete('/tape-coil/:uuid', tapeCoilOperations.remove);
zipperRouter.get('/tape-coil/by/nylon', tapeCoilOperations.selectByNylon);
zipperRouter.get(
	'/tape-coil-dashboard',
	tapeCoilOperations.selectTapeCoilDashboard
);

// --------------------- TAPE COIL PRODUCTION ROUTES ---------------------

zipperRouter.get(
	'/tape-coil-production',
	tapeCoilProductionOperations.selectAll
);
zipperRouter.get(
	'/tape-coil-production/:uuid',
	tapeCoilProductionOperations.select
);
zipperRouter.post('/tape-coil-production', tapeCoilProductionOperations.insert);
zipperRouter.put(
	'/tape-coil-production/:uuid',
	tapeCoilProductionOperations.update
);
zipperRouter.delete(
	'/tape-coil-production/:uuid',
	tapeCoilProductionOperations.remove
);
zipperRouter.get(
	'/tape-coil-production/by/:section',
	tapeCoilProductionOperations.selectTapeCoilProductionBySection
);

// --------------------- TAPE TO COIL ROUTES ---------------------

zipperRouter.get('/tape-trx', tapeTrxOperations.selectAll);
zipperRouter.get('/tape-trx/:uuid', tapeTrxOperations.select);
zipperRouter.post('/tape-trx', tapeTrxOperations.insert);
zipperRouter.put('/tape-trx/:uuid', tapeTrxOperations.update);
zipperRouter.delete('/tape-trx/:uuid', tapeTrxOperations.remove);
zipperRouter.get('/tape-trx/by/:section', tapeTrxOperations.selectBySection);

// --------------------- TAPE COIL REQUIRED ROUTES ---------------------

zipperRouter.get('/tape-coil-required', tapeCoilRequiredOperations.selectAll);
zipperRouter.get(
	'/tape-coil-required/:uuid',
	tapeCoilRequiredOperations.select
);
zipperRouter.post('/tape-coil-required', tapeCoilRequiredOperations.insert);
zipperRouter.put(
	'/tape-coil-required/:uuid',
	tapeCoilRequiredOperations.update
);
zipperRouter.delete(
	'/tape-coil-required/:uuid',
	tapeCoilRequiredOperations.remove
);

// --------------------- PlANNING ROUTES ---------------------
zipperRouter.get('/planning', planningOperations.selectAll);
zipperRouter.get('/planning/:week', planningOperations.select);
zipperRouter.post('/planning', planningOperations.insert);
zipperRouter.put('/planning/:week', planningOperations.update);
zipperRouter.delete('/planning/:week', planningOperations.remove);
zipperRouter.get(
	'/planning/by/:planning_week',
	planningOperations.selectPlanningByPlanningWeek
);
zipperRouter.get(
	'/planning-details/by/:planning_week',
	planningOperations.selectPlanningAndPlanningEntryByPlanningWeek
);

// --------------------- PlANNING ---------------------
zipperRouter.get('/planning-entry', planningEntryOperations.selectAll);
zipperRouter.get('/planning-entry/:uuid', planningEntryOperations.select);
zipperRouter.post('/planning-entry', planningEntryOperations.insert);
zipperRouter.put('/planning-entry/:uuid', planningEntryOperations.update);
zipperRouter.delete('/planning-entry/:uuid', planningEntryOperations.remove);
zipperRouter.get(
	'/planning-entry/by/:planning_week',
	planningEntryOperations.selectPlanningEntryByPlanningWeek
);
zipperRouter.get(
	'/order-planning',
	planningEntryOperations.getOrderDetailsForPlanningEntry
);
zipperRouter.post(
	'/planning-entry/for/factory',
	planningEntryOperations.insertOrUpdatePlanningEntryByFactory
);

// --------------------- material trx against order ---------------------
zipperRouter.get(
	'/material-trx-against-order',
	materialTrxAgainstOrderOperations.selectAll
);
zipperRouter.get(
	'/material-trx-against-order/:uuid',
	materialTrxAgainstOrderOperations.select
);
zipperRouter.post(
	'/material-trx-against-order',
	materialTrxAgainstOrderOperations.insert
);
zipperRouter.put(
	'/material-trx-against-order/:uuid',
	materialTrxAgainstOrderOperations.update
);
zipperRouter.delete(
	'/material-trx-against-order/:uuid',
	materialTrxAgainstOrderOperations.remove
);
zipperRouter.get(
	'/material-trx-against-order/by/:trx_to',
	materialTrxAgainstOrderOperations.selectMaterialTrxLogAgainstOrderByTrxTo
);
zipperRouter.get(
	'/material-trx-against-order/multiple/by/:trx_tos',
	materialTrxAgainstOrderOperations.selectMaterialTrxAgainstOrderDescriptionByMultipleTrxTo
);

//.............Tape Coil To Dyeing.....................//
zipperRouter.get('/tape-coil-to-dyeing', tapeCoilToDyeingOperations.selectAll);
zipperRouter.get(
	'/tape-coil-to-dyeing/:uuid',
	tapeCoilToDyeingOperations.select
);
zipperRouter.post('/tape-coil-to-dyeing', tapeCoilToDyeingOperations.insert);
zipperRouter.put(
	'/tape-coil-to-dyeing/:uuid',
	tapeCoilToDyeingOperations.update
);
zipperRouter.delete(
	'/tape-coil-to-dyeing/:uuid',
	tapeCoilToDyeingOperations.remove
);
zipperRouter.get(
	'/tape-coil-to-dyeing/by/type/nylon',
	tapeCoilToDyeingOperations.selectTapeCoilToDyeingByNylon
);
zipperRouter.get(
	'/tape-coil-to-dyeing/by/type/tape',
	tapeCoilToDyeingOperations.selectTapeCoilToDyeingForTape
);

//.............Batch Production.....................//

zipperRouter.get(
	'/dyeing-batch-production',
	dyeingBatchProductionOperations.selectAll
);
zipperRouter.get(
	'/dyeing-batch-production/:uuid',
	dyeingBatchProductionOperations.select
);
zipperRouter.post(
	'/dyeing-batch-production',
	dyeingBatchProductionOperations.insert
);
zipperRouter.put(
	'/dyeing-batch-production/:uuid',
	dyeingBatchProductionOperations.update
);
zipperRouter.delete(
	'/dyeing-batch-production/:uuid',
	dyeingBatchProductionOperations.remove
);

// --------------------- MULTI COLOR DASHBOARD ROUTES ---------------------
zipperRouter.get(
	'/multi-color-dashboard',
	multiColorDashboardOperations.selectAll
);
zipperRouter.get(
	'/multi-color-dashboard/:uuid',
	multiColorDashboardOperations.select
);
zipperRouter.post(
	'/multi-color-dashboard',
	multiColorDashboardOperations.insert
);
zipperRouter.put(
	'/multi-color-dashboard/:uuid',
	multiColorDashboardOperations.update
);
zipperRouter.delete(
	'/multi-color-dashboard/:uuid',
	multiColorDashboardOperations.remove
);

// --------------------- MULTI COLOR TAPES RECEIVE ROUTES ---------------------
zipperRouter.get(
	'/multi-color-tape-receive',
	multiColorTapeReceiveOperations.selectAll
);
zipperRouter.get(
	'/multi-color-tape-receive/:uuid',
	multiColorTapeReceiveOperations.select
);
zipperRouter.post(
	'/multi-color-tape-receive',
	multiColorTapeReceiveOperations.insert
);
zipperRouter.put(
	'/multi-color-tape-receive/:uuid',
	multiColorTapeReceiveOperations.update
);
zipperRouter.delete(
	'/multi-color-tape-receive/:uuid',
	multiColorTapeReceiveOperations.remove
);

// --------------------- FINISHING BATCH ROUTES ---------------------

zipperRouter.get('/finishing-batch', finishingBatchOperations.selectAll);
zipperRouter.get('/finishing-batch/:uuid', finishingBatchOperations.select);
zipperRouter.post('/finishing-batch', finishingBatchOperations.insert);
zipperRouter.put('/finishing-batch/:uuid', finishingBatchOperations.update);
zipperRouter.delete('/finishing-batch/:uuid', finishingBatchOperations.remove);
zipperRouter.get(
	'/finishing-batch/by/finishing_batch_uuid/:finishing_batch_uuid',
	finishingBatchOperations.getFinishingBatchByFinishingBatchUuid
);
zipperRouter.get(
	'/finishing-batch-capacity-details',
	finishingBatchOperations.getFinishingBatchCapacityDetails
);
zipperRouter.get(
	'/daily-production-plan',
	finishingBatchOperations.getDailyProductionPlan
);
zipperRouter.get(
	'/finishing-batch-planning-info',
	finishingBatchOperations.getPlanningInfoFromDateAndOrderDescription
);
zipperRouter.get(
	'/finishing-batch/update-is-completed/by/:uuid',
	finishingBatchOperations.updateFinishingBatchPutIsCompletedByFinishingBatchUuid
);

// --------------------- FINISHING BATCH ENTRY ROUTES ---------------------

zipperRouter.get(
	'/finishing-batch-entry',
	finishingBatchEntryOperations.selectAll
);
zipperRouter.get(
	'/finishing-batch-entry/:uuid',
	finishingBatchEntryOperations.select
);
zipperRouter.post(
	'/finishing-batch-entry',
	finishingBatchEntryOperations.insert
);
zipperRouter.put(
	'/finishing-batch-entry/:uuid',
	finishingBatchEntryOperations.update
);
zipperRouter.delete(
	'/finishing-batch-entry/:uuid',
	finishingBatchEntryOperations.remove
);
zipperRouter.get(
	'/finishing-order-batch/:order_description_uuid',
	finishingBatchEntryOperations.getOrderDetailsForFinishingBatchEntry
);
zipperRouter.get(
	'/finishing-batch-entry/production-quantity/max/:order_description_uuid',
	finishingBatchEntryOperations.selectMaxProductionQuantityForFinishingBatch
);
zipperRouter.get(
	'/finishing-batch-entry/by/finishing-batch-uuid/:finishing_batch_uuid',
	finishingBatchEntryOperations.getFinishingBatchEntryByFinishingBatchUuid
);
zipperRouter.get(
	'/finishing-batch/by/:section',
	finishingBatchEntryOperations.selectFinishingBatchEntryBySection
);

// --------------------- ORDER ENTRY LOG ROUTES ---------------------

zipperRouter.get('/order-entry-log', orderEntryLogOperations.selectAll);
zipperRouter.get('/order-entry-log/:id', orderEntryLogOperations.select);
zipperRouter.post('/order-entry-log', orderEntryLogOperations.insert);
zipperRouter.put('/order-entry-log/:id', orderEntryLogOperations.update);
zipperRouter.delete('/order-entry-log/:id', orderEntryLogOperations.remove);

export { zipperRouter };
