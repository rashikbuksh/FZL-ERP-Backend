import { request, Router } from 'express';
import {
	marketing,
	merchandiser,
	party,
	properties,
} from '../public/schema.js';

import * as bankOperations from './query/bank.js';
import * as lcOperations from './query/lc.js';
import * as piCashOperations from './query/pi_cash.js';
import * as piCashEntryOperations from './query/pi_cash_entry.js';
import commercial from './schema.js';

const commercialRouter = Router();

// bank routes
commercialRouter.get('/bank', bankOperations.selectAll);
commercialRouter.get('/bank/:uuid', bankOperations.select);
commercialRouter.post('/bank', bankOperations.insert);
commercialRouter.put('/bank/:uuid', bankOperations.update);
commercialRouter.delete('/bank/:uuid', bankOperations.remove);

// lc routes
commercialRouter.get('/lc', lcOperations.selectAll);
commercialRouter.get('/lc/:uuid', lcOperations.select);
commercialRouter.post('/lc', lcOperations.insert);
commercialRouter.put('/lc/:uuid', lcOperations.update);
commercialRouter.delete('/lc/:uuid', lcOperations.remove);
commercialRouter.get('/lc-pi/by/:lc_uuid', lcOperations.selectLcPiByLcUuid);
commercialRouter.get(
	'/lc/by/lc-number/:lc_number',
	lcOperations.selectLcByLcNumber
);

// pi_cash routes
commercialRouter.get('/pi-cash', piCashOperations.selectAll);
commercialRouter.get('/pi-cash/:uuid', piCashOperations.select);
commercialRouter.post('/pi-cash', piCashOperations.insert);
commercialRouter.put('/pi-cash/:uuid', piCashOperations.update);
commercialRouter.delete('/pi-cash/:uuid', piCashOperations.remove);
commercialRouter.get(
	'/pi-cash/details/:pi_cash_uuid',
	piCashOperations.selectPiDetailsByPiUuid
);
commercialRouter.put(
	'/pi-cash-lc-uuid/:pi_uuid',
	piCashOperations.updatePiPutLcByPiUuid
);
commercialRouter.get('/pi-cash-lc/:lc_uuid', piCashOperations.selectPiByLcUuid);
commercialRouter.put(
	'/pi-cash-lc-null/:pi_cash_uuid',
	piCashOperations.updatePiToNullByPiUuid
);
commercialRouter.get(
	'/pi-cash-uuid/:pi_cash_id',
	piCashOperations.selectPiUuidByPiId
);
commercialRouter.get(
	'/pi-cash/details/by/pi-cash-id/:pi_cash_id',
	piCashOperations.selectPiDetailsByPiId
);

// pi_cash_entry routes
commercialRouter.get('/pi-cash-entry', piCashEntryOperations.selectAll);
commercialRouter.get(
	'/pi-cash-entry/:uuid',

	piCashEntryOperations.select
);
commercialRouter.post('/pi-cash-entry', piCashEntryOperations.insert);
commercialRouter.put('/pi-cash-entry/:uuid', piCashEntryOperations.update);
commercialRouter.delete(
	'/pi-cash-entry/:uuid',

	piCashEntryOperations.remove
);
commercialRouter.use(
	'/pi-cash-entry/by/:pi_uuid',
	piCashEntryOperations.selectPiEntryByPiUuid
);
commercialRouter.get(
	'/pi-cash-entry/details/by/:order_info_uuid',
	piCashEntryOperations.selectPiEntryByOrderInfoUuid
);
commercialRouter.get(
	'/pi-cash/details/by/order-info-ids/:order_info_uuids/:party_uuid/:marketing_uuid',
	piCashEntryOperations.selectPiEntryByPiDetailsByOrderInfoUuids
);

export { commercialRouter };
