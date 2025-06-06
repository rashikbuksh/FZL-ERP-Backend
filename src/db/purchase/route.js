import { Router } from 'express';
import * as descriptionOperations from './query/description.js';
import * as entryOperations from './query/entry.js';
import * as vendorOperations from './query/vendor.js';

const purchaseRouter = Router();

// Vendor routes
purchaseRouter.get('/vendor', vendorOperations.selectAll);
purchaseRouter.get('/vendor/:uuid', vendorOperations.select);
purchaseRouter.post('/vendor', vendorOperations.insert);
purchaseRouter.put('/vendor/:uuid', vendorOperations.update);
purchaseRouter.delete('/vendor/:uuid', vendorOperations.remove);

// Description routes
purchaseRouter.get('/description', descriptionOperations.selectAll);
purchaseRouter.get(
	'/description/:uuid',

	descriptionOperations.select
);
purchaseRouter.post('/description', descriptionOperations.insert);
purchaseRouter.put('/description/:uuid', descriptionOperations.update);
purchaseRouter.delete(
	'/description/:uuid',

	descriptionOperations.remove
);
purchaseRouter.get(
	'/purchase-details/by/:purchase_description_uuid',
	descriptionOperations.selectPurchaseDetailsByPurchaseDescriptionUuid
);
purchaseRouter.get(
	'/purchase-log',
	descriptionOperations.selectAllPurchaseDescriptionAndEntry
);

// Entry routes
purchaseRouter.get('/entry', entryOperations.selectAll);
purchaseRouter.get('/entry/:uuid', entryOperations.select);
purchaseRouter.post('/entry', entryOperations.insert);
purchaseRouter.put('/entry/:uuid', entryOperations.update);
purchaseRouter.delete(
	'/entry/:uuid',

	entryOperations.remove
);
purchaseRouter.get(
	'/entry/by/:purchase_description_uuid',
	entryOperations.selectEntryByPurchaseDescriptionUuid
);

export { purchaseRouter };
