import { request, Router } from 'express';
import {
	marketing,
	merchandiser,
	party,
	properties,
} from '../public/schema.js';

import * as bankOperations from './query/bank.js';
import * as lcOperations from './query/lc.js';
import * as piOperations from './query/pi.js';
import * as piEntryOperations from './query/pi_entry.js';
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

// pi routes
commercialRouter.get('/pi', piOperations.selectAll);
commercialRouter.get('/pi/:uuid', piOperations.select);
commercialRouter.post('/pi', piOperations.insert);
commercialRouter.put('/pi/:uuid', piOperations.update);
commercialRouter.delete('/pi/:uuid', piOperations.remove);
commercialRouter.get('/pi/by/:pi_uuid', piOperations.selectPiByPiUuid);
commercialRouter.get(
	'/pi/details/:pi_uuid',
	piOperations.selectPiDetailsByPiUuid
);
commercialRouter.put(
	'/pi-lc-uuid/:pi_uuid',
	piOperations.updatePiPutLcByPiUuid
);
commercialRouter.get('/pi-lc/:lc_uuid', piOperations.selectPiByLcUuid);
commercialRouter.put(
	'/pi-lc-null/:pi_uuid',
	piOperations.updatePiToNullByPiUuid
);
commercialRouter.get(
	'/pi-uuid/:pi_id',
	piOperations.selectPiUuidByPiId
);
commercialRouter.get('/pi/details/by/pi-id/:pi_id', piOperations.selectPiDetailsByPiId);

// pi_entry routes
commercialRouter.get('/pi-entry', piEntryOperations.selectAll);
commercialRouter.get(
	'/pi-entry/:uuid',

	piEntryOperations.select
);
commercialRouter.post('/pi-entry', piEntryOperations.insert);
commercialRouter.put('/pi-entry/:uuid', piEntryOperations.update);
commercialRouter.delete(
	'/pi-entry/:uuid',

	piEntryOperations.remove
);
commercialRouter.use(
	'/pi-entry/by/:pi_uuid',
	piEntryOperations.selectPiEntryByPiUuid
);
commercialRouter.get(
	'/pi-entry/details/by/:order_info_uuid',
	piEntryOperations.selectPiEntryByOrderInfoUuid
);
commercialRouter.get(
	'/pi/details/by/order-info-ids/:order_info_uuids/:party_uuid/:marketing_uuid',
	piEntryOperations.selectPiEntryByPiDetailsByOrderInfoUuids
);

export { commercialRouter };
