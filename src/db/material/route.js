import { Router } from 'express';
import * as infoOperations from './query/info.js';
import * as sectionOperations from './query/section.js';
import * as stockOperations from './query/stock.js';
import * as stockToSfgOperations from './query/stock_to_sfg.js';
import * as trxOperations from './query/trx.js';
import * as typeOperations from './query/type.js';
import * as usedOperations from './query/used.js';
import material from './schema.js';

const materialRouter = Router();

// info routes

materialRouter.get('/info', infoOperations.selectAll);
materialRouter.get('/info/:uuid', infoOperations.select);
materialRouter.post('/info', infoOperations.insert);
materialRouter.put('/info/:uuid', infoOperations.update);
materialRouter.delete(
	'/info/:uuid',

	infoOperations.remove
);

// section routes

materialRouter.get('/section', sectionOperations.selectAll);
materialRouter.get(
	'/section/:uuid',
	sectionOperations.select
);
materialRouter.post('/section', sectionOperations.insert);
materialRouter.put('/section/:uuid', sectionOperations.update);
materialRouter.delete(
	'/section/:uuid',

	sectionOperations.remove
);

// stock routes

materialRouter.get('/stock', stockOperations.selectAll);
materialRouter.get('/stock/:uuid', stockOperations.select);
materialRouter.post('/stock', stockOperations.insert);
materialRouter.put('/stock/:uuid', stockOperations.update);
materialRouter.delete('/stock/:uuid', stockOperations.remove);
materialRouter.get(
	'/stock-threshold',
	stockOperations.selectMaterialBelowThreshold
);
materialRouter.get(
	'/stock/by/single-field/:fieldName',
	stockOperations.selectMaterialStockForAFieldName
);
materialRouter.get(
	'/stock/by/multi-field/:fieldNames',
	stockOperations.selectMaterialStockForMultiFieldNames
);

// trx routes

materialRouter.get('/trx', trxOperations.selectAll);
materialRouter.get('/trx/:uuid', trxOperations.select);
materialRouter.post('/trx', trxOperations.insert);
materialRouter.put('/trx/:uuid', trxOperations.update);
materialRouter.delete('/trx/:uuid', trxOperations.remove);
materialRouter.get(
	'/trx/by/:material_uuid/:trx_to',

	trxOperations.selectMaterialTrxByMaterialTrxTo
);

// type routes

materialRouter.get('/type', typeOperations.selectAll);
materialRouter.get('/type/:uuid', typeOperations.select);
materialRouter.post('/type', typeOperations.insert);
materialRouter.put('/type/:uuid', typeOperations.update);
materialRouter.delete(
	'/type/:uuid',

	typeOperations.remove
);

// used routes

materialRouter.get('/used', usedOperations.selectAll);
materialRouter.get('/used/:uuid', usedOperations.select);
materialRouter.post('/used', usedOperations.insert);
materialRouter.put('/used/:uuid', usedOperations.update);
materialRouter.delete(
	'/used/:uuid',

	usedOperations.remove
);
materialRouter.get('/used/by/:section', usedOperations.selectUsedBySection);
materialRouter.get(
	'/used/multi-section/by/:sections',
	usedOperations.selectUsedForMultipleSection
);

// stock_to_sfg routes
materialRouter.get('/stock-to-sfg', stockToSfgOperations.selectAll);
materialRouter.get(
	'/stock-to-sfg/:uuid',

	stockToSfgOperations.select
);
materialRouter.post('/stock-to-sfg', stockToSfgOperations.insert);
materialRouter.put('/stock-to-sfg/:uuid', stockToSfgOperations.update);
materialRouter.delete(
	'/stock-to-sfg/:uuid',

	stockToSfgOperations.remove
);

export { materialRouter };
