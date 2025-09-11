import { Router } from 'express';

import * as bankOperations from './query/bank.js';
import * as cashReceiveOperations from './query/cash_receive.js';
import * as lcOperations from './query/lc.js';
import * as lcEntryOperations from './query/lc_entry.js';
import * as lcEntryOthersOperations from './query/lc_entry_others.js';
import * as manualPiOperations from './query/manual_pi.js';
import * as manualPiEntryOperations from './query/manual_pi_entry.js';
import * as piCashOperations from './query/pi_cash.js';
import * as piCashEntryOperations from './query/pi_cash_entry.js';

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
commercialRouter.get(
	'/lc-pi-cash/by/:lc_uuid',
	lcOperations.selectLcPiByLcUuid
);
commercialRouter.get(
	'/lc/by/lc-number/:lc_number',
	lcOperations.selectLcByLcNumber
);

// * LC Entry
commercialRouter.get('/lc-entry', lcEntryOperations.selectAll);
commercialRouter.get('/lc-entry/:uuid', lcEntryOperations.select);
commercialRouter.post('/lc-entry', lcEntryOperations.insert);
commercialRouter.put('/lc-entry/:uuid', lcEntryOperations.update);
commercialRouter.delete('/lc-entry/:uuid', lcEntryOperations.remove);
commercialRouter.get(
	'/lc-entry/by/:lc_uuid',
	lcEntryOperations.selectLcEntryByLcUuid
);
commercialRouter.get(
	'/lc-entry/by/lc-number/:lc_number',
	lcEntryOperations.selectLcEntryByLcNumber
);

// * LC Entry Others
commercialRouter.get('/lc-entry-others', lcEntryOthersOperations.selectAll);
commercialRouter.get('/lc-entry-others/:uuid', lcEntryOthersOperations.select);
commercialRouter.post('/lc-entry-others', lcEntryOthersOperations.insert);
commercialRouter.put('/lc-entry-others/:uuid', lcEntryOthersOperations.update);
commercialRouter.delete(
	'/lc-entry-others/:uuid',
	lcEntryOthersOperations.remove
);
commercialRouter.get(
	'/lc-entry-others/by/:lc_uuid',
	lcEntryOthersOperations.selectLcEntryOthersByLcUuid
);

commercialRouter.get(
	'/lc-entry-others/by/lc-number/:lc_number',
	lcEntryOthersOperations.selectLcEntryOthersByLcNumber
);

// * Manual Pi routes
commercialRouter.get('/manual-pi', manualPiOperations.selectAll);
commercialRouter.get('/manual-pi/:uuid', manualPiOperations.select);
commercialRouter.post('/manual-pi', manualPiOperations.insert);
commercialRouter.put('/manual-pi/:uuid', manualPiOperations.update);
commercialRouter.delete('/manual-pi/:uuid', manualPiOperations.remove);
commercialRouter.get(
	'/manual-pi/details/by/:manual_pi_uuid',
	manualPiOperations.selectManualPiByManualPiUuid
);
commercialRouter.put(
	'/manual-pi-lc-uuid/:manual_pi_uuid',
	manualPiOperations.updateManualPiPutLcByPiUuid
);
commercialRouter.get(
	'/manual-pi/by/lc-uuid/:lc_uuid',
	manualPiOperations.selectByLcUuid
);

// * Manual Pi Entry routes
commercialRouter.get('/manual-pi-entry', manualPiEntryOperations.selectAll);
commercialRouter.get('/manual-pi-entry/:uuid', manualPiEntryOperations.select);
commercialRouter.post('/manual-pi-entry', manualPiEntryOperations.insert);
commercialRouter.put('/manual-pi-entry/:uuid', manualPiEntryOperations.update);
commercialRouter.delete(
	'/manual-pi-entry/:uuid',
	manualPiEntryOperations.remove
);
commercialRouter.get(
	'/manual-pi-entry/by/:manual_pi_uuid',
	manualPiEntryOperations.selectByManualPiUuid
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
	'/pi-cash-lc-uuid/:pi_cash_uuid',
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
commercialRouter.put(
	'/pi-cash-update-is-completed/:pi_cash_uuid',
	piCashOperations.updatePiPutIsCompletedByPiUuid
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
	'/pi-cash-entry/by/:pi_cash_uuid',
	piCashEntryOperations.selectPiEntryByPiUuid
);
commercialRouter.get(
	'/pi-cash-entry/details/by/:order_info_uuid',
	piCashEntryOperations.selectPiEntryByOrderInfoUuid
);
commercialRouter.get(
	'/pi-cash-entry/thread-details/by/:order_info_uuid',
	piCashEntryOperations.selectPiEntryByThreadOrderInfoUuid
);
commercialRouter.get(
	'/pi-cash/details/by/order-info-ids/:order_info_uuids/:party_uuid/:marketing_uuid',
	piCashEntryOperations.selectPiEntryByPiDetailsByOrderInfoUuids
);
commercialRouter.get(
	'/pi-cash/thread-details/by/order-info-ids/:order_info_uuids/:party_uuid/:marketing_uuid',
	piCashEntryOperations.selectPiEntryByPiDetailsByThreadOrderInfoUuids
);

// * cash_receive routes
commercialRouter.get('/cash-receive', cashReceiveOperations.selectAll);
commercialRouter.get('/cash-receive/:uuid', cashReceiveOperations.select);
commercialRouter.post('/cash-receive', cashReceiveOperations.insert);
commercialRouter.put('/cash-receive/:uuid', cashReceiveOperations.update);
commercialRouter.delete('/cash-receive/:uuid', cashReceiveOperations.remove);

export { commercialRouter };
