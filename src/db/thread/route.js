import { Router } from 'express';
import * as batchOperations from './query/batch.js';
import * as batch_entryOperations from './query/batch_entry.js';
import * as batchEntryProductionOperations from './query/batch_entry_production.js';
import * as batchEntryTrxOperations from './query/batch_entry_trx.js';
import * as count_lengthOperations from './query/count_length.js';
import * as dyes_categoryOperations from './query/dyes_category.js';
import * as order_entryOperations from './query/order_entry.js';
import * as order_infoOperations from './query/order_info.js';
import * as programsOperations from './query/programs.js';

const threadRouter = Router();

// count_length routes
threadRouter.get('/count-length', count_lengthOperations.selectAll);
threadRouter.get('/count-length/:uuid', count_lengthOperations.select);
threadRouter.post('/count-length', count_lengthOperations.insert);
threadRouter.put('/count-length/:uuid', count_lengthOperations.update);
threadRouter.delete('/count-length/:uuid', count_lengthOperations.remove);

// order_info routes
threadRouter.get('/order-info', order_infoOperations.selectAll);
threadRouter.get('/order-info/:uuid', order_infoOperations.select);
threadRouter.post('/order-info', order_infoOperations.insert);
threadRouter.put('/order-info/:uuid', order_infoOperations.update);
threadRouter.delete('/order-info/:uuid', order_infoOperations.remove);
threadRouter.get(
	'/order-info-details/by/:order_info_uuid',
	order_infoOperations.selectOrderDetailsByOrderInfoUuid
);
threadRouter.put(
	'/order-info/send-from-ho/update/by/:uuid',
	order_infoOperations.updateSendFromHeadOffice
);
threadRouter.put(
	'/order-info/receive-from-factory/update/by/:uuid',
	order_infoOperations.updateReceiveByFactory
);
threadRouter.put(
	'/order-info/production-pause/update/by/:uuid',
	order_infoOperations.updateProductionPause
);
threadRouter.get('/order-swatch', order_infoOperations.selectThreadSwatch);

// order_entry routes
threadRouter.get('/order-entry', order_entryOperations.selectAll);
threadRouter.get('/order-entry/:uuid', order_entryOperations.select);
threadRouter.post('/order-entry', order_entryOperations.insert);
threadRouter.put('/order-entry/:uuid', order_entryOperations.update);
threadRouter.delete('/order-entry/:uuid', order_entryOperations.remove);
threadRouter.get(
	'/order-entry/by/:order_info_uuid',
	order_entryOperations.selectOrderEntryByOrderInfoUuid
);

// batch_entry routes
threadRouter.get('/batch-entry', batch_entryOperations.selectAll);
threadRouter.get('/batch-entry/:uuid', batch_entryOperations.select);
threadRouter.post('/batch-entry', batch_entryOperations.insert);
threadRouter.put('/batch-entry/:uuid', batch_entryOperations.update);
threadRouter.delete('/batch-entry/:uuid', batch_entryOperations.remove);
threadRouter.get(
	'/order-batch',
	batch_entryOperations.getOrderDetailsForBatchEntry
);
threadRouter.get(
	'/batch-entry/by/:batch_uuid',
	batch_entryOperations.getBatchEntryByBatchUuid
);
threadRouter.get(
	'/batch-entry-details',
	batch_entryOperations.getBatchEntryDetails
);

// batch routes
threadRouter.get('/batch', batchOperations.selectAll);
threadRouter.get('/batch/:uuid', batchOperations.select);
threadRouter.post('/batch', batchOperations.insert);
threadRouter.put('/batch/:uuid', batchOperations.update);
threadRouter.delete('/batch/:uuid', batchOperations.remove);
threadRouter.get(
	'/batch-details/by/:batch_uuid',
	batchOperations.selectBatchDetailsByBatchUuid
);

// dyes_category routes
threadRouter.get('/dyes-category', dyes_categoryOperations.selectAll);
threadRouter.get('/dyes-category/:uuid', dyes_categoryOperations.select);
threadRouter.post('/dyes-category', dyes_categoryOperations.insert);
threadRouter.put('/dyes-category/:uuid', dyes_categoryOperations.update);
threadRouter.delete('/dyes-category/:uuid', dyes_categoryOperations.remove);

// programs routes
threadRouter.get('/programs', programsOperations.selectAll);
threadRouter.get('/programs/:uuid', programsOperations.select);
threadRouter.post('/programs', programsOperations.insert);
threadRouter.put('/programs/:uuid', programsOperations.update);
threadRouter.delete('/programs/:uuid', programsOperations.remove);

// batch_entry_production routes
threadRouter.get(
	'/batch-entry-production',
	batchEntryProductionOperations.selectAll
);
threadRouter.get(
	'/batch-entry-production/:uuid',
	batchEntryProductionOperations.select
);
threadRouter.post(
	'/batch-entry-production',
	batchEntryProductionOperations.insert
);
threadRouter.put(
	'/batch-entry-production/:uuid',
	batchEntryProductionOperations.update
);
threadRouter.delete(
	'/batch-entry-production/:uuid',
	batchEntryProductionOperations.remove
);
threadRouter.get(
	'/batch-entry-production-details',
	batchEntryProductionOperations.getBatchEntryProductionDetails
);

// batch_entry_trx routes
threadRouter.get('/batch-entry-trx', batchEntryTrxOperations.selectAll);
threadRouter.get('/batch-entry-trx/:uuid', batchEntryTrxOperations.select);
threadRouter.post('/batch-entry-trx', batchEntryTrxOperations.insert);
threadRouter.put('/batch-entry-trx/:uuid', batchEntryTrxOperations.update);
threadRouter.delete('/batch-entry-trx/:uuid', batchEntryTrxOperations.remove);
threadRouter.get(
	'/batch-entry-trx-details',
	batchEntryTrxOperations.getBatchEntryTrxDetails
);

export { threadRouter };
