import { Router } from 'express';
import * as cartonOperations from './query/carton.js';
import * as challanOperations from './query/challan.js';
import * as deliveryOperations from './query/delivery_dashboard.js';
import * as packingListOperations from './query/packing_list.js';
import * as packingListEntryOperations from './query/packing_list_entry.js';
import * as quantityReturnOperations from './query/quantity_return.js';
import * as vehicleOperations from './query/vehicle.js';

const deliveryRouter = Router();

// packing_list routes

deliveryRouter.get('/packing-list', packingListOperations.selectAll);
deliveryRouter.get(
	'/packing-list/:uuid',

	packingListOperations.select
);
deliveryRouter.post('/packing-list', packingListOperations.insert);
deliveryRouter.put('/packing-list/:uuid', packingListOperations.update);
deliveryRouter.delete(
	'/packing-list/:uuid',

	packingListOperations.remove
);
deliveryRouter.get(
	'/packing-list/details/:packing_list_uuid',
	packingListOperations.selectPackingListDetailsByPackingListUuid
);
deliveryRouter.get(
	'/order-for-packing-list/:order_info_uuid',
	packingListOperations.selectAllOrderForPackingList
);
deliveryRouter.put(
	'/update-challan-uuid/for-packing-list/:packing_list_uuid',
	packingListOperations.setChallanUuidOfPackingList
);
deliveryRouter.get(
	'/packing-list-received-log',
	packingListOperations.selectPackingListReceivedLog
);

deliveryRouter.get(
	'/packing-list-warehouse-out-log',
	packingListOperations.selectPackingListWarehouseOutLog
);
deliveryRouter.get(
	'/packing-list-received-warehouse-notout-log',
	packingListOperations.selectPackingListReceivedWarehouseLog
);
deliveryRouter.get(
	'/sync-packing-list-challan-for-order',
	packingListOperations.syncPackingListAndChallanForAllOrder
);

// packing_list_entry routes
deliveryRouter.get('/packing-list-entry', packingListEntryOperations.selectAll);
deliveryRouter.get(
	'/packing-list-entry/:uuid',

	packingListEntryOperations.select
);
deliveryRouter.post('/packing-list-entry', packingListEntryOperations.insert);
deliveryRouter.put(
	'/packing-list-entry/:uuid',
	packingListEntryOperations.update
);
deliveryRouter.delete(
	'/packing-list-entry/:uuid',

	packingListEntryOperations.remove
);
deliveryRouter.get(
	'/packing-list-entry/by/:packing_list_uuid',
	packingListEntryOperations.selectPackingListEntryByPackingListUuid
);
deliveryRouter.get(
	'/packing-list-entry/by/multi-packing-list-uuid/:packing_list_uuids',
	packingListEntryOperations.selectPackingListEntryByMultiPackingListUuid
);
deliveryRouter.get(
	'/packing-list-entry-for-challan/:challan_uuid',
	packingListEntryOperations.selectPackingListEntryByChallanUuid
);

// challan routes

deliveryRouter.get('/challan', challanOperations.selectAll);
deliveryRouter.get(
	'/challan/:uuid',

	challanOperations.select
);
deliveryRouter.post('/challan', challanOperations.insert);
deliveryRouter.put('/challan/:uuid', challanOperations.update);
deliveryRouter.delete(
	'/challan/:uuid',

	challanOperations.remove
);
deliveryRouter.get(
	'/challan/details/:challan_uuid',
	challanOperations.selectChallanDetailsByChallanUuid
);
deliveryRouter.put(
	'/challan/update-receive-status/:uuid',
	challanOperations.updateReceivedStatus
);

deliveryRouter.put(
	'/challan/update-delivered/:uuid',
	challanOperations.updateDelivered
);
deliveryRouter.delete(
	'/challan/delete-challan-packing-list-ref/:challan_number/:uuid',
	challanOperations.removeChallanAndPLRef
);
deliveryRouter.put(
	'/challan/is-out-for-delivery/:uuid',
	challanOperations.updateIsOutForDelivery
);
// updateIsOutForDelivery;

// * vehicle routes

deliveryRouter.get('/vehicle', vehicleOperations.selectAll);
deliveryRouter.get(
	'/vehicle/:uuid',

	vehicleOperations.select
);

deliveryRouter.post('/vehicle', vehicleOperations.insert);
deliveryRouter.put('/vehicle/:uuid', vehicleOperations.update);
deliveryRouter.delete(
	'/vehicle/:uuid',

	vehicleOperations.remove
);

// carton routes

deliveryRouter.get('/carton', cartonOperations.selectAll);
deliveryRouter.get(
	'/carton/:uuid',

	cartonOperations.select
);
deliveryRouter.post('/carton', cartonOperations.insert);
deliveryRouter.put('/carton/:uuid', cartonOperations.update);
deliveryRouter.delete(
	'/carton/:uuid',

	cartonOperations.remove
);

// delivery_dashboard routes
deliveryRouter.get('/dashboard', deliveryOperations.selectDelivery);
deliveryRouter.get(
	'/dashboard-thread',
	deliveryOperations.selectDeliveryThread
);

// * quantity_return routes
deliveryRouter.get('/quantity-return', quantityReturnOperations.selectAll);
deliveryRouter.get('/quantity-return/:uuid', quantityReturnOperations.select);
deliveryRouter.post('/quantity-return', quantityReturnOperations.insert);
deliveryRouter.put('/quantity-return/:uuid', quantityReturnOperations.update);
deliveryRouter.delete(
	'/quantity-return/:uuid',
	quantityReturnOperations.remove
);
deliveryRouter.get(
	'/zipper-order-entry/by/:order_info_uuid',
	quantityReturnOperations.selectOrderEntryFullByOrderInfoUuid
);
deliveryRouter.get(
	'/thread-order-entry/by/:order_info_uuid',
	quantityReturnOperations.selectOrderEntryByOrderInfoUuid
);

export { deliveryRouter };
