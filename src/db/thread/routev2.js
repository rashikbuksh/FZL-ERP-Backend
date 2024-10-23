import * as order_entryOperations from './query/order_entry_v2.js';
import * as order_infoOperations from './query/order_info_v2.js';

const threadRouterV2 = Router();

// order_info routes
threadRouterV2.get('/order-info', order_infoOperations.selectAll);
threadRouterV2.get('/order-info/:uuid', order_infoOperations.select);
threadRouterV2.post('/order-info', order_infoOperations.insert);
threadRouterV2.put('/order-info/:uuid', order_infoOperations.update);
threadRouterV2.delete('/order-info/:uuid', order_infoOperations.remove);
threadRouterV2.get(
	'/order-info-details/by/:order_info_uuid',
	order_infoOperations.selectOrderDetailsByOrderInfoUuid
);
threadRouterV2.get('/order-swatch', order_infoOperations.selectThreadSwatch);

// order_entry routes
threadRouterV2.get('/order-entry', order_entryOperations.selectAll);
threadRouterV2.get('/order-entry/:uuid', order_entryOperations.select);
threadRouterV2.post('/order-entry', order_entryOperations.insert);
threadRouterV2.put('/order-entry/:uuid', order_entryOperations.update);
threadRouterV2.delete('/order-entry/:uuid', order_entryOperations.remove);
threadRouterV2.get(
	'/order-entry/by/:order_info_uuid',
	order_entryOperations.selectOrderEntryByOrderInfoUuid
);

export { threadRouterV2 };