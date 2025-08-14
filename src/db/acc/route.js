import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';

import * as currencyOperations from './query/currency.js';
import * as fiscalYearOperations from './query/fiscal_year.js';
import * as headOperations from './query/head.js';
import * as groupOperations from './query/group.js';
import * as ledgerOperations from './query/ledger.js';
import * as costCenterOperations from './query/cost_center.js';
import * as voucherOperations from './query/voucher.js';
import * as voucherEntryOperations from './query/voucher_entry.js';
import * as voucherEntryCostCenterOperations from './query/voucher_entry_cost_center.js';
import * as voucherEntryPaymentOperations from './query/voucher_entry_payment.js';

const accRouter = Router();

// Currency routes
accRouter.get('/currency', currencyOperations.selectAll);
accRouter.get(
	'/currency/:uuid',
	validateUuidParam(),
	currencyOperations.select
);
accRouter.post('/currency', currencyOperations.insert);
accRouter.put('/currency/:uuid', currencyOperations.update);
accRouter.delete(
	'/currency/:uuid',
	validateUuidParam(),
	currencyOperations.remove
);

// Fiscal Year routes
accRouter.get('/fiscal-year', fiscalYearOperations.selectAll);
accRouter.get(
	'/fiscal-year/:uuid',
	validateUuidParam(),
	fiscalYearOperations.select
);
accRouter.post('/fiscal-year', fiscalYearOperations.insert);
accRouter.put('/fiscal-year/:uuid', fiscalYearOperations.update);
accRouter.delete(
	'/fiscal-year/:uuid',
	validateUuidParam(),
	fiscalYearOperations.remove
);

// Head routes
accRouter.get('/head', headOperations.selectAll);
accRouter.get('/head/:uuid', validateUuidParam(), headOperations.select);
accRouter.post('/head', headOperations.insert);
accRouter.put('/head/:uuid', headOperations.update);
accRouter.delete('/head/:uuid', validateUuidParam(), headOperations.remove);

// Group routes
accRouter.get('/group', groupOperations.selectAll);
accRouter.get('/group/:uuid', validateUuidParam(), groupOperations.select);
accRouter.post('/group', groupOperations.insert);
accRouter.put('/group/:uuid', groupOperations.update);
accRouter.delete('/group/:uuid', validateUuidParam(), groupOperations.remove);

// Ledger routes
accRouter.get('/ledger', ledgerOperations.selectAll);
accRouter.get('/ledger/:uuid', validateUuidParam(), ledgerOperations.select);
accRouter.post('/ledger', ledgerOperations.insert);
accRouter.put('/ledger/:uuid', ledgerOperations.update);
accRouter.delete('/ledger/:uuid', validateUuidParam(), ledgerOperations.remove);

// Cost Center routes
accRouter.get('/cost-center', costCenterOperations.selectAll);
accRouter.get(
	'/cost-center/:uuid',
	validateUuidParam(),
	costCenterOperations.select
);
accRouter.post('/cost-center', costCenterOperations.insert);
accRouter.put('/cost-center/:uuid', costCenterOperations.update);
accRouter.delete(
	'/cost-center/:uuid',
	validateUuidParam(),
	costCenterOperations.remove
);

// Voucher routes
accRouter.get('/voucher', voucherOperations.selectAll);
accRouter.get('/voucher/:uuid', validateUuidParam(), voucherOperations.select);
accRouter.post('/voucher', voucherOperations.insert);
accRouter.put('/voucher/:uuid', voucherOperations.update);
accRouter.delete(
	'/voucher/:uuid',
	validateUuidParam(),
	voucherOperations.remove
);

// Voucher Entry routes
accRouter.get('/voucher-entry', voucherEntryOperations.selectAll);
accRouter.get(
	'/voucher-entry/:uuid',
	validateUuidParam(),
	voucherEntryOperations.select
);
accRouter.post('/voucher-entry', voucherEntryOperations.insert);
accRouter.put('/voucher-entry/:uuid', voucherEntryOperations.update);
accRouter.delete(
	'/voucher-entry/:uuid',
	validateUuidParam(),
	voucherEntryOperations.remove
);

// Voucher Entry Cost Center routes
accRouter.get(
	'/voucher-entry-cost-center',
	voucherEntryCostCenterOperations.selectAll
);
accRouter.get(
	'/voucher-entry-cost-center/:uuid',
	validateUuidParam(),
	voucherEntryCostCenterOperations.select
);
accRouter.post(
	'/voucher-entry-cost-center',
	voucherEntryCostCenterOperations.insert
);
accRouter.put(
	'/voucher-entry-cost-center/:uuid',
	voucherEntryCostCenterOperations.update
);
accRouter.delete(
	'/voucher-entry-cost-center/:uuid',
	validateUuidParam(),
	voucherEntryCostCenterOperations.remove
);

// Voucher Entry Payment routes
accRouter.get(
	'/voucher-entry-payment',
	voucherEntryPaymentOperations.selectAll
);
accRouter.get(
	'/voucher-entry-payment/:uuid',
	validateUuidParam(),
	voucherEntryPaymentOperations.select
);
accRouter.post('/voucher-entry-payment', voucherEntryPaymentOperations.insert);
accRouter.put(
	'/voucher-entry-payment/:uuid',
	voucherEntryPaymentOperations.update
);
accRouter.delete(
	'/voucher-entry-payment/:uuid',
	validateUuidParam(),
	voucherEntryPaymentOperations.remove
);

export { accRouter };
