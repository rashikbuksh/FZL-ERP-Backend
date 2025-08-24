import SE, { SED } from '../../../util/swagger_example.js';

//* ./schema.js#currency
export const defCurrency = SED({
	required: ['uuid', 'currency', 'currency_name', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		currency: SE.string('USD'),
		currency_name: SE.string('US Dollar'),
		symbol: SE.string('$'),
		conversion_rate: SE.number(1),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		default: SE.boolean(false),
	},
	xml: 'Acc/Currency',
});

//* ./schema.js#fiscal_year
export const defFiscalYear = SED({
	required: ['uuid', 'year_no', 'start_date', 'end_date', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		year_no: SE.integer(2025),
		start_date: SE.date_time(),
		end_date: SE.date_time(),
		active: SE.boolean(true),
		locked: SE.boolean(true),
		jan_budget: SE.number(0),
		feb_budget: SE.number(0),
		mar_budget: SE.number(0),
		apr_budget: SE.number(0),
		may_budget: SE.number(0),
		jun_budget: SE.number(0),
		jul_budget: SE.number(0),
		aug_budget: SE.number(0),
		sep_budget: SE.number(0),
		oct_budget: SE.number(0),
		nov_budget: SE.number(0),
		dec_budget: SE.number(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/FiscalYear',
});

//* ./schema.js#head
export const defHead = SED({
	required: ['uuid', 'name', 'title', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Cash'),
		title: SE.string('Cash Head'),
		bs: SE.boolean(true),
		is_fixed: SE.boolean(true),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/Head',
});

//* ./schema.js#group
export const defGroup = SED({
	required: ['uuid', 'name', 'head_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Current Assets'),
		head_uuid: SE.uuid(),
		code: SE.string('CA001'),
		is_fixed: SE.boolean(true),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/Group',
});

//* ./schema.js#ledger
export const defLedger = SED({
	required: [
		'uuid',
		'name',
		'account_no',
		'type',
		'group_uuid',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		table_name: SE.string('ledger'),
		table_uuid: SE.uuid(),
		name: SE.string('Cash Ledger'),
		category: SE.string('cash'),
		account_no: SE.string('1001'),
		type: SE.string('asset'),
		is_active: SE.boolean(true),
		restrictions: SE.string('none'),
		group_uuid: SE.uuid(),
		vat_deduction: SE.number(0),
		tax_deduction: SE.number(0),
		old_ledger_id: SE.integer(null),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		narration: SE.string('narration'),
	},
	xml: 'Acc/Ledger',
});

//* ./schema.js#cost_center
export const defCostCenter = SED({
	required: ['uuid', 'name', 'ledger_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Project A'),
		ledger_uuid: SE.uuid(),
		table_name: SE.string('cost_center'),
		table_uuid: SE.uuid(),
		invoice_no: SE.string('INV-001'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/CostCenter',
});

//* ./schema.js#voucher
export const defVoucher = SED({
	required: ['uuid', 'date', 'category', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		date: SE.date_time(),
		category: SE.string('payment'),
		vat_deduction: SE.number(0),
		tax_deduction: SE.number(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/Voucher',
});

//* ./schema.js#voucher_entry
export const defVoucherEntry = SED({
	required: ['uuid', 'index', 'ledger_uuid', 'type', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		index: SE.integer(1),
		ledger_uuid: SE.uuid(),
		type: SE.string('dr'),
		amount: SE.number(1000),
		is_need_cost_center: SE.boolean(false),
		is_payment: SE.boolean(false),
		description: SE.string('Payment for services'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		voucher_uuid: SE.uuid(),
		currency_uuid: SE.uuid(),
		conversion_rate: SE.number(1),
	},
	xml: 'Acc/VoucherEntry',
});

//* ./schema.js#voucher_entry_cost_center
export const defVoucherEntryCostCenter = SED({
	required: ['uuid', 'index', 'cost_center_uuid', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		index: SE.integer(1),
		voucher_entry_uuid: SE.uuid(),
		cost_center_uuid: SE.uuid(),
		amount: SE.number(100),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/VoucherEntryCostCenter',
});

//* ./schema.js#voucher_entry_payment
export const defVoucherEntryPayment = SED({
	required: [
		'uuid',
		'index',
		'voucher_entry_uuid',
		'payment_type',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		index: SE.integer(1),
		voucher_entry_uuid: SE.uuid(),
		payment_type: SE.string('cash'),
		trx_no: SE.string('TRX123'),
		date: SE.date_time(),
		amount: SE.number(500),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_by: SE.uuid(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Acc/VoucherEntryPayment',
});

// * Merge All
export const defAcc = {
	currency: defCurrency,
	fiscal_year: defFiscalYear,
	head: defHead,
	group: defGroup,
	ledger: defLedger,
	cost_center: defCostCenter,
	voucher: defVoucher,
	voucher_entry: defVoucherEntry,
	voucher_entry_cost_center: defVoucherEntryCostCenter,
	voucher_entry_payment: defVoucherEntryPayment,
};

// * Tag
export const tagAcc = [
	{ name: 'acc.currency', description: 'Currency operations' },
	{ name: 'acc.fiscal_year', description: 'Fiscal year operations' },
	{ name: 'acc.head', description: 'Head operations' },
	{ name: 'acc.group', description: 'Group operations' },
	{ name: 'acc.ledger', description: 'Ledger operations' },
	{ name: 'acc.cost_center', description: 'Cost center operations' },
	{ name: 'acc.voucher', description: 'Voucher operations' },
	{ name: 'acc.voucher_entry', description: 'Voucher entry operations' },
	{
		name: 'acc.voucher_entry_cost_center',
		description: 'Voucher entry cost center operations',
	},
	{
		name: 'acc.voucher_entry_payment',
		description: 'Voucher entry payment operations',
	},
];
