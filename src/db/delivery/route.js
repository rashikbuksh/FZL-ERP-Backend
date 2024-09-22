import { Router } from 'express';
import * as challanOperations from './query/challan.js';
import * as challanEntryOperations from './query/challan_entry.js';
import * as packingListOperations from './query/packing_list.js';
import * as packingListEntryOperations from './query/packing_list_entry.js';

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
	'/order-for-packing-list',
	packingListOperations.selectAllOrderForPackingList
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

// challan_entry routes

deliveryRouter.get('/challan-entry', challanEntryOperations.selectAll);
deliveryRouter.get(
	'/challan-entry/:uuid',

	challanEntryOperations.select
);
deliveryRouter.post('/challan-entry', challanEntryOperations.insert);
deliveryRouter.put('/challan-entry/:uuid', challanEntryOperations.update);
deliveryRouter.delete(
	'/challan-entry/:uuid',

	challanEntryOperations.remove
);
deliveryRouter.get(
	'/challan-entry/by/:challan_uuid',
	challanEntryOperations.selectChallanEntryByChallanUuid
);

export { deliveryRouter };
