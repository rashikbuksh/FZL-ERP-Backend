import SE from '../../../util/swagger_example.js';

//* Currency
export const pathAccCurrency = {
	'/acc/currency': {
		get: {
			tags: ['acc.currency'],
			summary: 'Get all currencies',
			responses: { 200: SE.response_schema_ref(200, 'acc/currency') },
		},
		post: {
			tags: ['acc.currency'],
			summary: 'Create a currency',
			requestBody: SE.requestBody_schema_ref('acc/currency'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/currency'),
				405: SE.response(405),
			},
		},
	},
	'/acc/currency/{uuid}': {
		get: {
			tags: ['acc.currency'],
			summary: 'Get a currency',
			parameters: [SE.parameter_params('Currency to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/currency'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.currency'],
			summary: 'Update a currency',
			parameters: [SE.parameter_params('Currency to update')],
			requestBody: SE.requestBody_schema_ref('acc/currency'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/currency'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.currency'],
			summary: 'Delete a currency',
			parameters: [SE.parameter_params('Currency to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Fiscal Year
export const pathAccFiscalYear = {
	'/acc/fiscal-year': {
		get: {
			tags: ['acc.fiscal_year'],
			summary: 'Get all fiscal years',
			responses: { 200: SE.response_schema_ref(200, 'acc/fiscal_year') },
		},
		post: {
			tags: ['acc.fiscal_year'],
			summary: 'Create a fiscal year',
			requestBody: SE.requestBody_schema_ref('acc/fiscal_year'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/fiscal_year'),
				405: SE.response(405),
			},
		},
	},
	'/acc/fiscal-year/{uuid}': {
		get: {
			tags: ['acc.fiscal_year'],
			summary: 'Get a fiscal year',
			parameters: [SE.parameter_params('Fiscal year to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/fiscal_year'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.fiscal_year'],
			summary: 'Update a fiscal year',
			parameters: [SE.parameter_params('Fiscal year to update')],
			requestBody: SE.requestBody_schema_ref('acc/fiscal_year'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/fiscal_year'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.fiscal_year'],
			summary: 'Delete a fiscal year',
			parameters: [SE.parameter_params('Fiscal year to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Head
export const pathAccHead = {
	'/acc/head': {
		get: {
			tags: ['acc.head'],
			summary: 'Get all heads',
			responses: { 200: SE.response_schema_ref(200, 'acc/head') },
		},
		post: {
			tags: ['acc.head'],
			summary: 'Create a head',
			requestBody: SE.requestBody_schema_ref('acc/head'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/head'),
				405: SE.response(405),
			},
		},
	},
	'/acc/head/{uuid}': {
		get: {
			tags: ['acc.head'],
			summary: 'Get a head',
			parameters: [SE.parameter_params('Head to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/head'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.head'],
			summary: 'Update a head',
			parameters: [SE.parameter_params('Head to update')],
			requestBody: SE.requestBody_schema_ref('acc/head'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/head'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.head'],
			summary: 'Delete a head',
			parameters: [SE.parameter_params('Head to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Group
export const pathAccGroup = {
	'/acc/group': {
		get: {
			tags: ['acc.group'],
			summary: 'Get all groups',
			responses: { 200: SE.response_schema_ref(200, 'acc/group') },
		},
		post: {
			tags: ['acc.group'],
			summary: 'Create a group',
			requestBody: SE.requestBody_schema_ref('acc/group'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/group'),
				405: SE.response(405),
			},
		},
	},
	'/acc/group/{uuid}': {
		get: {
			tags: ['acc.group'],
			summary: 'Get a group',
			parameters: [SE.parameter_params('Group to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/group'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.group'],
			summary: 'Update a group',
			parameters: [SE.parameter_params('Group to update')],
			requestBody: SE.requestBody_schema_ref('acc/group'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/group'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.group'],
			summary: 'Delete a group',
			parameters: [SE.parameter_params('Group to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Ledger
export const pathAccLedger = {
	'/acc/ledger': {
		get: {
			tags: ['acc.ledger'],
			summary: 'Get all ledgers',
			responses: { 200: SE.response_schema_ref(200, 'acc/ledger') },
		},
		post: {
			tags: ['acc.ledger'],
			summary: 'Create a ledger',
			requestBody: SE.requestBody_schema_ref('acc/ledger'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/ledger'),
				405: SE.response(405),
			},
		},
	},
	'/acc/ledger/{uuid}': {
		get: {
			tags: ['acc.ledger'],
			summary: 'Get a ledger',
			parameters: [SE.parameter_params('Ledger to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/ledger'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.ledger'],
			summary: 'Update a ledger',
			parameters: [SE.parameter_params('Ledger to update')],
			requestBody: SE.requestBody_schema_ref('acc/ledger'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/ledger'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.ledger'],
			summary: 'Delete a ledger',
			parameters: [SE.parameter_params('Ledger to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Cost Center
export const pathAccCostCenter = {
	'/acc/cost-center': {
		get: {
			tags: ['acc.cost_center'],
			summary: 'Get all cost centers',
			responses: { 200: SE.response_schema_ref(200, 'acc/cost_center') },
		},
		post: {
			tags: ['acc.cost_center'],
			summary: 'Create a cost center',
			requestBody: SE.requestBody_schema_ref('acc/cost_center'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/cost_center'),
				405: SE.response(405),
			},
		},
	},
	'/acc/cost-center/{uuid}': {
		get: {
			tags: ['acc.cost_center'],
			summary: 'Get a cost center',
			parameters: [SE.parameter_params('Cost center to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/cost_center'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.cost_center'],
			summary: 'Update a cost center',
			parameters: [SE.parameter_params('Cost center to update')],
			requestBody: SE.requestBody_schema_ref('acc/cost_center'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/cost_center'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.cost_center'],
			summary: 'Delete a cost center',
			parameters: [SE.parameter_params('Cost center to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Voucher
export const pathAccVoucher = {
	'/acc/voucher': {
		get: {
			tags: ['acc.voucher'],
			summary: 'Get all vouchers',
			responses: { 200: SE.response_schema_ref(200, 'acc/voucher') },
		},
		post: {
			tags: ['acc.voucher'],
			summary: 'Create a voucher',
			requestBody: SE.requestBody_schema_ref('acc/voucher'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher'),
				405: SE.response(405),
			},
		},
	},
	'/acc/voucher/{uuid}': {
		get: {
			tags: ['acc.voucher'],
			summary: 'Get a voucher',
			parameters: [SE.parameter_params('Voucher to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.voucher'],
			summary: 'Update a voucher',
			parameters: [SE.parameter_params('Voucher to update')],
			requestBody: SE.requestBody_schema_ref('acc/voucher'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.voucher'],
			summary: 'Delete a voucher',
			parameters: [SE.parameter_params('Voucher to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Voucher Entry
export const pathAccVoucherEntry = {
	'/acc/voucher-entry': {
		get: {
			tags: ['acc.voucher_entry'],
			summary: 'Get all voucher entries',
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry'),
			},
		},
		post: {
			tags: ['acc.voucher_entry'],
			summary: 'Create a voucher entry',
			requestBody: SE.requestBody_schema_ref('acc/voucher_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry'),
				405: SE.response(405),
			},
		},
	},
	'/acc/voucher-entry/{uuid}': {
		get: {
			tags: ['acc.voucher_entry'],
			summary: 'Get a voucher entry',
			parameters: [SE.parameter_params('Voucher entry to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.voucher_entry'],
			summary: 'Update a voucher entry',
			parameters: [SE.parameter_params('Voucher entry to update')],
			requestBody: SE.requestBody_schema_ref('acc/voucher_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.voucher_entry'],
			summary: 'Delete a voucher entry',
			parameters: [SE.parameter_params('Voucher entry to delete')],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Voucher Entry Cost Center
export const pathAccVoucherEntryCostCenter = {
	'/acc/voucher-entry-cost-center': {
		get: {
			tags: ['acc.voucher_entry_cost_center'],
			summary: 'Get all voucher entry cost centers',
			responses: {
				200: SE.response_schema_ref(
					200,
					'acc/voucher_entry_cost_center'
				),
			},
		},
		post: {
			tags: ['acc.voucher_entry_cost_center'],
			summary: 'Create a voucher entry cost center',
			requestBody: SE.requestBody_schema_ref(
				'acc/voucher_entry_cost_center'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'acc/voucher_entry_cost_center'
				),
				405: SE.response(405),
			},
		},
	},
	'/acc/voucher-entry-cost-center/{uuid}': {
		get: {
			tags: ['acc.voucher_entry_cost_center'],
			summary: 'Get a voucher entry cost center',
			parameters: [
				SE.parameter_params('Voucher entry cost center to get'),
			],
			responses: {
				200: SE.response_schema_ref(
					200,
					'acc/voucher_entry_cost_center'
				),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.voucher_entry_cost_center'],
			summary: 'Update a voucher entry cost center',
			parameters: [
				SE.parameter_params('Voucher entry cost center to update'),
			],
			requestBody: SE.requestBody_schema_ref(
				'acc/voucher_entry_cost_center'
			),
			responses: {
				200: SE.response_schema_ref(
					200,
					'acc/voucher_entry_cost_center'
				),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.voucher_entry_cost_center'],
			summary: 'Delete a voucher entry cost center',
			parameters: [
				SE.parameter_params('Voucher entry cost center to delete'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Voucher Entry Payment
export const pathAccVoucherEntryPayment = {
	'/acc/voucher-entry-payment': {
		get: {
			tags: ['acc.voucher_entry_payment'],
			summary: 'Get all voucher entry payments',
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry_payment'),
			},
		},
		post: {
			tags: ['acc.voucher_entry_payment'],
			summary: 'Create a voucher entry payment',
			requestBody: SE.requestBody_schema_ref('acc/voucher_entry_payment'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry_payment'),
				405: SE.response(405),
			},
		},
	},
	'/acc/voucher-entry-payment/{uuid}': {
		get: {
			tags: ['acc.voucher_entry_payment'],
			summary: 'Get a voucher entry payment',
			parameters: [SE.parameter_params('Voucher entry payment to get')],
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry_payment'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['acc.voucher_entry_payment'],
			summary: 'Update a voucher entry payment',
			parameters: [
				SE.parameter_params('Voucher entry payment to update'),
			],
			requestBody: SE.requestBody_schema_ref('acc/voucher_entry_payment'),
			responses: {
				200: SE.response_schema_ref(200, 'acc/voucher_entry_payment'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['acc.voucher_entry_payment'],
			summary: 'Delete a voucher entry payment',
			parameters: [
				SE.parameter_params('Voucher entry payment to delete'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

//* Merge All
export const pathAcc = {
	...pathAccCurrency,
	...pathAccFiscalYear,
	...pathAccHead,
	...pathAccGroup,
	...pathAccLedger,
	...pathAccCostCenter,
	...pathAccVoucher,
	...pathAccVoucherEntry,
	...pathAccVoucherEntryCostCenter,
	...pathAccVoucherEntryPayment,
};
