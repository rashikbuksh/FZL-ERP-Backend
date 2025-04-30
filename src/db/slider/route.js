import { Router } from 'express';
import * as assemblyStockOperations from './query/assembly_stock.js';
import * as coloringTransactionOperations from './query/coloring_transaction.js';
import * as dieCastingOperations from './query/die_casting.js';
import * as dieCastingProductionOperations from './query/die_casting_production.js';
import * as dieCastingToAssemblyStockOperations from './query/die_casting_to_assembly_stock.js';
import * as dieCastingTransactionOperations from './query/die_casting_transaction.js';
import * as productionOperations from './query/production.js';
import * as stockOperations from './query/stock.js';
import * as transactionOperations from './query/transaction.js';
import * as trxAgainstStockOperations from './query/trx_against_stock.js';

const sliderRouter = Router();

// --------------------- STOCK ROUTES ---------------------

sliderRouter.get('/stock', stockOperations.selectAll);
sliderRouter.get('/stock/:uuid', stockOperations.select);
sliderRouter.post('/stock', stockOperations.insert);
sliderRouter.put('/stock/:uuid', stockOperations.update);
sliderRouter.delete('/stock/:uuid', stockOperations.remove);
sliderRouter.get(
	'/stock/by/:from_section',
	stockOperations.selectStockByFromSection
);

// --------------------- DIE CASTING ROUTES ---------------------

sliderRouter.get('/die-casting', dieCastingOperations.selectAll);
sliderRouter.get('/die-casting/:uuid', dieCastingOperations.select);
sliderRouter.post('/die-casting', dieCastingOperations.insert);
sliderRouter.put('/die-casting/:uuid', dieCastingOperations.update);
sliderRouter.delete(
	'/die-casting/:uuid',

	dieCastingOperations.remove
);
sliderRouter.get(
	'/die-casting-trx-log',
	dieCastingOperations.selectTransactionsFromDieCasting
);

// --------------------- Assembly Stock ---------------------

sliderRouter.get('/assembly-stock', assemblyStockOperations.selectAll);
sliderRouter.get('/assembly-stock/:uuid', assemblyStockOperations.select);
sliderRouter.post('/assembly-stock', assemblyStockOperations.insert);
sliderRouter.put('/assembly-stock/:uuid', assemblyStockOperations.update);
sliderRouter.delete('/assembly-stock/:uuid', assemblyStockOperations.remove);
sliderRouter.get(
	'/assembly-production-log',
	assemblyStockOperations.selectProductionLogForAssembly
);

// --------------------- Die Casting to Assembly Stock ---------------------

sliderRouter.get(
	'/die-casting-to-assembly-stock',
	dieCastingToAssemblyStockOperations.selectAll
);
sliderRouter.get(
	'/die-casting-to-assembly-stock/:uuid',
	dieCastingToAssemblyStockOperations.select
);
sliderRouter.post(
	'/die-casting-to-assembly-stock',
	dieCastingToAssemblyStockOperations.insert
);
sliderRouter.put(
	'/die-casting-to-assembly-stock/:uuid',
	dieCastingToAssemblyStockOperations.update
);
sliderRouter.delete(
	'/die-casting-to-assembly-stock/:uuid',
	dieCastingToAssemblyStockOperations.remove
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
sliderRouter.get(
	'/transaction/by/:from_section',
	transactionOperations.selectTransactionByFromSection
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

// --------------------- Trx Against Stock Routes ---------------------

sliderRouter.get('/trx-against-stock', trxAgainstStockOperations.selectAll);
sliderRouter.get('/trx-against-stock/:uuid', trxAgainstStockOperations.select);
sliderRouter.post('/trx-against-stock', trxAgainstStockOperations.insert);
sliderRouter.put('/trx-against-stock/:uuid', trxAgainstStockOperations.update);
sliderRouter.delete(
	'/trx-against-stock/:uuid',
	trxAgainstStockOperations.remove
);

// ---------------------  Production Routes ---------------------

sliderRouter.get('/production', productionOperations.selectAll);
sliderRouter.get('/production/:uuid', productionOperations.select);
sliderRouter.post('/production', productionOperations.insert);
sliderRouter.put('/production/:uuid', productionOperations.update);
sliderRouter.delete('/production/:uuid', productionOperations.remove);
sliderRouter.get(
	'/production/by/:section',
	productionOperations.selectProductionBySection
);

export { sliderRouter };
