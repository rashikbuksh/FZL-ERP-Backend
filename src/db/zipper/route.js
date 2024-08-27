import { Router } from 'express';
import * as batchOperations from './query/batch.js';
import * as batchEntryOperations from './query/batch_entry.js';
import * as batchProductionOperations from './query/batch_production.js';
import * as dyingBatchOperations from './query/dying_batch.js';
import * as dyingBatchEntryOperations from './query/dying_batch_entry.js';
import * as materialTrxAgainstOrderOperations from './query/material_trx_against_order_description.js';
import * as orderDescriptionOperations from './query/order_description.js';
import * as orderEntryOperations from './query/order_entry.js';
import * as orderInfoOperations from './query/order_info.js';
import * as planningOperations from './query/planning.js';
import * as planningEntryOperations from './query/planning_entry.js';
import * as sfgOperations from './query/sfg.js';
import * as sfgProductionOperations from './query/sfg_production.js';
import * as sfgTransactionOperations from './query/sfg_transaction.js';
import * as tapeCoilOperations from './query/tape_coil.js';
import * as tapeCoilProductionOperations from './query/tape_coil_production.js';
import * as tapeCoilToDyeingOperations from './query/tape_coil_to_dyeing.js';
import * as tapeToCoilOperations from './query/tape_to_coil.js';

import * as dyedTapeTransactionOperations from './query/dyed_tape_transaction.js';
const zipperRouter = Router();

// --------------------- ORDER INFO ROUTES ---------------------

zipperRouter.get('/order-info', orderInfoOperations.selectAll);
zipperRouter.get(
	'/order-info/:uuid',
	// validateUuidParam(),
	orderInfoOperations.select
);
zipperRouter.post('/order-info', orderInfoOperations.insert);
zipperRouter.put('/order-info/:uuid', orderInfoOperations.update);
zipperRouter.delete(
	'/order-info/:uuid',
	// validateUuidParam(),
	orderInfoOperations.remove
);
zipperRouter.get('/order/details', orderInfoOperations.getOrderDetails);

// --------------------- ORDER DESCRIPTION ROUTES ---------------------

zipperRouter.get('/order-description', orderDescriptionOperations.selectAll);
zipperRouter.get(
	'/order-description/:uuid',
	// validateUuidParam(),
	orderDescriptionOperations.select
);
zipperRouter.post('/order-description', orderDescriptionOperations.insert);
zipperRouter.put('/order-description/:uuid', orderDescriptionOperations.update);
zipperRouter.delete(
	'/order-description/:uuid',
	// validateUuidParam(),
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

// --------------------- SFG ROUTES ---------------------

zipperRouter.get('/sfg', sfgOperations.selectAll);
zipperRouter.get('/sfg/:uuid', sfgOperations.select);
zipperRouter.post('/sfg', sfgOperations.insert);
zipperRouter.put('/sfg/:uuid', sfgOperations.update);
zipperRouter.delete('/sfg/:uuid', sfgOperations.remove);
zipperRouter.get('/sfg-swatch', sfgOperations.selectSwatchInfo);
zipperRouter.put('/sfg-swatch/:uuid', sfgOperations.updateSwatchBySfgUuid);
zipperRouter.get('/sfg/by/:section', sfgOperations.selectSfgBySection);

// --------------------- SFG PRODUCTION ROUTES ---------------------

zipperRouter.get('/sfg-production', sfgProductionOperations.selectAll);
zipperRouter.get(
	'/sfg-production/:uuid',
	// validateUuidParam(),
	sfgProductionOperations.select
);
zipperRouter.post('/sfg-production', sfgProductionOperations.insert);
zipperRouter.put('/sfg-production/:uuid', sfgProductionOperations.update);
zipperRouter.delete(
	'/sfg-production/:uuid',
	// validateUuidParam(),
	sfgProductionOperations.remove
);

// --------------------- SFG TRANSACTION ROUTES ---------------------

zipperRouter.get('/sfg-transaction', sfgTransactionOperations.selectAll);
zipperRouter.get(
	'/sfg-transaction/:uuid',
	// validateUuidParam(),
	sfgTransactionOperations.select
);
zipperRouter.post('/sfg-transaction', sfgTransactionOperations.insert);
zipperRouter.put('/sfg-transaction/:uuid', sfgTransactionOperations.update);
zipperRouter.delete(
	'/sfg-transaction/:uuid',
	// validateUuidParam(),
	sfgTransactionOperations.remove
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

// --------------------- BATCH ROUTES ---------------------

zipperRouter.get('/batch', batchOperations.selectAll);
zipperRouter.get('/batch/:uuid', batchOperations.select);
zipperRouter.post('/batch', batchOperations.insert);
zipperRouter.put('/batch/:uuid', batchOperations.update);
zipperRouter.delete(
	'/batch/:uuid',
	// validateUuidParam(),
	batchOperations.remove
);
zipperRouter.get(
	'/batch-details/:batch_uuid',
	batchOperations.selectBatchDetailsByBatchUuid
);

// --------------------- BATCH ENTRY ROUTES ---------------------

zipperRouter.get('/batch-entry', batchEntryOperations.selectAll);
zipperRouter.get(
	'/batch-entry/:uuid',
	// validateUuidParam(),
	batchEntryOperations.select
);
zipperRouter.post('/batch-entry', batchEntryOperations.insert);
zipperRouter.put('/batch-entry/:uuid', batchEntryOperations.update);
zipperRouter.delete(
	'/batch-entry/:uuid',
	// validateUuidParam(),
	batchEntryOperations.remove
);
zipperRouter.get(
	'/batch-entry/by/batch-uuid/:batch_uuid',
	batchEntryOperations.selectBatchEntryByBatchUuid
);
zipperRouter.get(
	'/order-batch',
	batchEntryOperations.getOrderDetailsForBatchEntry
);

// --------------------- DYING BATCH ROUTES ---------------------

zipperRouter.get('/dying-batch', dyingBatchOperations.selectAll);
zipperRouter.get(
	'/dying-batch/:uuid',
	// validateUuidParam(),
	dyingBatchOperations.select
);
zipperRouter.post('/dying-batch', dyingBatchOperations.insert);
zipperRouter.put('/dying-batch/:uuid', dyingBatchOperations.update);
zipperRouter.delete(
	'/dying-batch/:uuid',
	// validateUuidParam(),
	dyingBatchOperations.remove
);

// --------------------- DYING BATCH ENTRY ROUTES ---------------------

zipperRouter.get('/dying-batch-entry', dyingBatchEntryOperations.selectAll);
zipperRouter.get(
	'/dying-batch-entry/:uuid',
	// validateUuidParam(),
	dyingBatchEntryOperations.select
);
zipperRouter.post('/dying-batch-entry', dyingBatchEntryOperations.insert);
zipperRouter.put('/dying-batch-entry/:uuid', dyingBatchEntryOperations.update);
zipperRouter.delete(
	'/dying-batch-entry/:uuid',
	// validateUuidParam(),
	dyingBatchEntryOperations.remove
);

// --------------------- TAPE COIL ROUTES ---------------------

zipperRouter.get('/tape-coil', tapeCoilOperations.selectAll);
zipperRouter.get(
	'/tape-coil/:uuid',
	// validateUuidParam(),
	tapeCoilOperations.select
);
zipperRouter.post('/tape-coil', tapeCoilOperations.insert);
zipperRouter.put('/tape-coil/:uuid', tapeCoilOperations.update);
zipperRouter.delete(
	'/tape-coil/:uuid',
	// validateUuidParam(),
	tapeCoilOperations.remove
);
zipperRouter.get('/tape-coil/by/nylon', tapeCoilOperations.selectByNylon);

// --------------------- TAPE COIL PRODUCTION ROUTES ---------------------

zipperRouter.get(
	'/tape-coil-production',
	tapeCoilProductionOperations.selectAll
);
zipperRouter.get(
	'/tape-coil-production/:uuid',
	// validateUuidParam(),
	tapeCoilProductionOperations.select
);
zipperRouter.post('/tape-coil-production', tapeCoilProductionOperations.insert);
zipperRouter.put(
	'/tape-coil-production/:uuid',
	tapeCoilProductionOperations.update
);
zipperRouter.delete(
	'/tape-coil-production/:uuid',
	// validateUuidParam(),
	tapeCoilProductionOperations.remove
);
zipperRouter.get(
	'/tape-coil-production/by/:section',
	tapeCoilProductionOperations.selectTapeCoilProductionBySection
);

// --------------------- TAPE TO COIL ROUTES ---------------------

zipperRouter.get('/tape-to-coil', tapeToCoilOperations.selectAll);
zipperRouter.get(
	'/tape-to-coil/:uuid',
	// validateUuidParam(),
	tapeToCoilOperations.select
);
zipperRouter.post('/tape-to-coil', tapeToCoilOperations.insert);
zipperRouter.put('/tape-to-coil/:uuid', tapeToCoilOperations.update);
zipperRouter.delete(
	'/tape-to-coil/:uuid',
	// validateUuidParam(),
	tapeToCoilOperations.remove
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
	// validateUuidParam(),
	tapeCoilToDyeingOperations.select
);
zipperRouter.post('/tape-coil-to-dyeing', tapeCoilToDyeingOperations.insert);
zipperRouter.put(
	'/tape-coil-to-dyeing/:uuid',
	tapeCoilToDyeingOperations.update
);
zipperRouter.delete(
	'/tape-coil-to-dyeing/:uuid',
	// validateUuidParam(),
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

zipperRouter.get('/batch-production', batchProductionOperations.selectAll);
zipperRouter.get(
	'/batch-production/:uuid',
	// validateUuidParam(),
	batchProductionOperations.select
);
zipperRouter.post('/batch-production', batchProductionOperations.insert);
zipperRouter.put('/batch-production/:uuid', batchProductionOperations.update);
zipperRouter.delete(
	'/batch-production/:uuid',
	// validateUuidParam(),
	batchProductionOperations.remove
);

export { zipperRouter };
