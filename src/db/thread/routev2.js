import { Router } from 'express';
import * as order_entryOperationsV2 from './query/order_entry_v2.js';
import * as order_infoOperationsV2 from './query/order_info_v2.js';

const threadRouterV2 = Router();

// order_info routes
threadRouterV2.get('/order-info', order_infoOperationsV2.selectAll);
threadRouterV2.get('/order-info/:uuid', order_infoOperationsV2.select);
threadRouterV2.post('/order-info', order_infoOperationsV2.insert);
threadRouterV2.put('/order-info/:uuid', order_infoOperationsV2.update);
threadRouterV2.delete('/order-info/:uuid', order_infoOperationsV2.remove);
threadRouterV2.get(
	'/order-info-details/by/:order_info_uuid',
	order_infoOperationsV2.selectOrderDetailsByOrderInfoUuid
);
threadRouterV2.get('/order-swatch', order_infoOperationsV2.selectThreadSwatch);

// order_entry routes
threadRouterV2.get('/order-entry', order_entryOperationsV2.selectAll);
threadRouterV2.get('/order-entry/:uuid', order_entryOperationsV2.select);
threadRouterV2.post('/order-entry', order_entryOperationsV2.insert);
threadRouterV2.put('/order-entry/:uuid', order_entryOperationsV2.update);
threadRouterV2.delete('/order-entry/:uuid', order_entryOperationsV2.remove);
threadRouterV2.get(
	'/order-entry/by/:order_info_uuid',
	order_entryOperationsV2.selectOrderEntryByOrderInfoUuid
);

export { threadRouterV2 };
