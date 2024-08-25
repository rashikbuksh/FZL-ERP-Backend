import { Router } from 'express';
import * as coloringTransactionOperations from './query/coloring_transaction.js';
import * as dieCastingOperations from './query/die_casting.js';
import * as dieCastingProductionOperations from './query/die_casting_production.js';
import * as dieCastingTransactionOperations from './query/die_casting_transaction.js';
import * as stockOperations from './query/stock.js';
import * as transactionOperations from './query/transaction.js';

const sliderRouter = Router();

// --------------------- STOCK ROUTES ---------------------

sliderRouter.get('/stock', stockOperations.selectAll);
sliderRouter.get('/stock/:uuid', stockOperations.select);
sliderRouter.post('/stock', stockOperations.insert);
sliderRouter.put('/stock/:uuid', stockOperations.update);
sliderRouter.delete('/stock/:uuid', stockOperations.remove);

// --------------------- DIE CASTING ROUTES ---------------------

sliderRouter.get('/die-casting', dieCastingOperations.selectAll);
sliderRouter.get('/die-casting/:uuid', dieCastingOperations.select);
sliderRouter.post('/die-casting', dieCastingOperations.insert);
sliderRouter.put('/die-casting/:uuid', dieCastingOperations.update);
sliderRouter.delete(
	'/die-casting/:uuid',

	dieCastingOperations.remove
);

// --------------------- DIE CASTING PRODUCTION ROUTES ---------------------

sliderRouter.get(
	'/die-casting-production',
	dieCastingProductionOperations.selectAll
);
sliderRouter.get(
	'/die-casting-production/:uuid',

	dieCastingProductionOperations.select
);
sliderRouter.post(
	'/die-casting-production',
	dieCastingProductionOperations.insert
);
sliderRouter.put(
	'/die-casting-production/:uuid',
	dieCastingProductionOperations.update
);
sliderRouter.delete(
	'/die-casting-production/:uuid',

	dieCastingProductionOperations.remove
);

// --------------------- DIE CASTING TRANSACTION ROUTES ---------------------

sliderRouter.get(
	'/die-casting-transaction',
	dieCastingTransactionOperations.selectAll
);
sliderRouter.get(
	'/die-casting-transaction/:uuid',

	dieCastingTransactionOperations.select
);
sliderRouter.post(
	'/die-casting-transaction',
	dieCastingTransactionOperations.insert
);
sliderRouter.put(
	'/die-casting-transaction/:uuid',
	dieCastingTransactionOperations.update
);
sliderRouter.delete(
	'/die-casting-transaction/:uuid',

	dieCastingTransactionOperations.remove
);
sliderRouter.get(
	'/die-casting/for/slider-stock/:order_info_uuid',
	dieCastingTransactionOperations.selectDieCastingForSliderStockByOrderInfoUuid
);
sliderRouter.get(
	'/die-casting/for/slider-stock-multi/:order_info_uuids',
	dieCastingTransactionOperations.selectDieCastingForSliderStockByOrderInfoUuids
);

// --------------------- Transaction Routes ---------------------

sliderRouter.get('/transaction', transactionOperations.selectAll);
sliderRouter.get(
	'/transaction/:uuid',

	transactionOperations.select
);
sliderRouter.post('/transaction', transactionOperations.insert);
sliderRouter.put('/transaction/:uuid', transactionOperations.update);
sliderRouter.delete(
	'/transaction/:uuid',

	transactionOperations.remove
);

// --------------------- Coloring Transaction Routes ---------------------

sliderRouter.get(
	'/coloring-transaction',
	coloringTransactionOperations.selectAll
);
sliderRouter.get(
	'/coloring-transaction/:uuid',

	coloringTransactionOperations.select
);
sliderRouter.post(
	'/coloring-transaction',
	coloringTransactionOperations.insert
);
sliderRouter.put(
	'/coloring-transaction/:uuid',
	coloringTransactionOperations.update
);
sliderRouter.delete(
	'/coloring-transaction/:uuid',

	coloringTransactionOperations.remove
);

export { sliderRouter };
