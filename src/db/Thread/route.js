import { Router } from 'express';
import * as batchOperations from './query/batch.js';
import * as batch_entryOperations from './query/batch_entry.js';
import * as count_lengthOperations from './query/count_length.js';
import * as machineOperations from './query/machine.js';
import * as order_entryOperations from './query/order_entry.js';
import * as order_infoOperations from './query/order_info.js';

const threadRouter = Router();

// machine routes
threadRouter.get('/machine', machineOperations.selectAll);
threadRouter.get('/machine/:uuid', machineOperations.select);
threadRouter.post('/machine', machineOperations.insert);
threadRouter.put('/machine/:uuid', machineOperations.update);
threadRouter.delete('/machine/:uuid', machineOperations.remove);

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

// batch routes
threadRouter.get('/batch', batchOperations.selectAll);
threadRouter.get('/batch/:uuid', batchOperations.select);
threadRouter.post('/batch', batchOperations.insert);
threadRouter.put('/batch/:uuid', batchOperations.update);
threadRouter.delete('/batch/:uuid', batchOperations.remove);

export { threadRouter };
