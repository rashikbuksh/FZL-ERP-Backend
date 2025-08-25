import { asc, eq, sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import * as accountSchema from '../../acc/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';

export async function selectHead(req, res, next) {
	const headPromise = db
		.select({
			value: accountSchema.head.uuid,
			label: accountSchema.head.name,
		})
		.from(accountSchema.head);
	try {
		const data = await headPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'head list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectCurrency(req, res, next) {
	const currencyPromise = db
		.select({
			value: accountSchema.currency.uuid,
			label: sql`${accountSchema.currency.currency} || ' (' || ${accountSchema.currency.symbol} || ')'`,
			conversion_rate: decimalToNumber(
				accountSchema.currency.conversion_rate
			),
			default: accountSchema.currency.default,
			symbol: accountSchema.currency.symbol,
		})
		.from(accountSchema.currency)
		.orderBy(asc(accountSchema.currency.currency_name));
	try {
		const data = await currencyPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'currency list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectGroup(req, res, next) {
	const groupPromise = db
		.select({
			value: accountSchema.group.uuid,
			label: accountSchema.group.name,
		})
		.from(accountSchema.group);
	try {
		const data = await groupPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'group list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLedger(req, res, next) {
	const ledgerPromise = db
		.select({
			value: accountSchema.ledger.uuid,
			label: sql`CONCAT(${accountSchema.ledger.name}, ' (', (COALESCE(voucher_total.total_debit_amount, 0) - COALESCE(voucher_total.total_credit_amount, 0))::float8, ')')`,
			has_cost_center: sql`CASE WHEN cost_center.cost_center_count > 0 THEN TRUE ELSE FALSE END`,
			cost_center_count: sql`COALESCE(cost_center.cost_center_count, 0)::float8`,
		})
		.from(accountSchema.ledger)
		.leftJoin(
			sql`
				(
				SELECT 
					COUNT(cost_center.uuid) as cost_center_count,
					cost_center.ledger_uuid
				FROM acc.cost_center
				GROUP BY cost_center.ledger_uuid
				) as cost_center
			`,
			eq(accountSchema.ledger.uuid, sql`cost_center.ledger_uuid`)
		)
		.leftJoin(
			sql`
				(
				SELECT 
					SUM(
						CASE WHEN voucher_entry.type = 'dr' THEN voucher_entry.amount ELSE 0 END
					) as total_debit_amount,
					SUM(
						CASE WHEN voucher_entry.type = 'cr' THEN voucher_entry.amount ELSE 0 END
					) as total_credit_amount,
					voucher_entry.ledger_uuid
				FROM acc.voucher_entry
				GROUP BY voucher_entry.ledger_uuid
				) as voucher_total
			`,
			eq(accountSchema.ledger.uuid, sql`voucher_total.ledger_uuid`)
		);

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'ledger list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectCostCenter(req, res, next) {
	const { ledger_uuid } = req.query;

	const costCenterPromise = db
		.select({
			value: accountSchema.cost_center.uuid,
			label: sql`CONCAT(${accountSchema.cost_center.name}, ' - ', ${accountSchema.cost_center.invoice_no} )`,
		})
		.from(accountSchema.cost_center);

	if (ledger_uuid) {
		costCenterPromise.where(
			eq(accountSchema.cost_center.ledger_uuid, ledger_uuid)
		);
	}

	try {
		const data = await costCenterPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'cost center list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get All Table Names in a Schema
export async function getAccountsTableNames(req, res, next) {
	const { schema_name } = req.query;
	try {
		const result = await db.execute(sql`
			SELECT 
				CONCAT(table_schema, '.', table_name) as value, 
				CONCAT(table_schema, '.', table_name) as label, 
				table_schema as schema_name
			FROM information_schema.tables
			WHERE ${schema_name ? sql`table_schema = ${schema_name}` : sql` 1=1 `}
			AND table_type = 'BASE TABLE' 
			AND table_name NOT LIKE 'pg%'
			AND table_name IN ('lc', 'description', 'vendor', 'party', 'pi_cash');
		`);

		const toast = {
			status: 200,
			type: 'select',
			message: 'All schema names retrieved successfully',
		};

		res.status(200).json({
			toast,
			data: result?.rows,
		});
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get Selected Tables uuid, id or name
export async function getSelectedTableData(req, res, next) {
	const { table_name } = req.params;

	let result;

	console.log(`Fetching data for table: ${table_name}`);

	const option = [
		{ value: 'commercial.lc', label: 'LC' },
		{ value: 'purchase.description', label: 'SR' },
		{ value: 'commercial.pi_cash', label: 'CI' },
	];

	try {
		if (
			[
				'commercial.lc',
				'purchase.description',
				'commercial.pi_cash',
			].includes(table_name)
		) {
			result =
				table_name == 'commercial.pi_cash'
					? await db.execute(sql`
						SELECT 
							uuid as value,
							concat(${sql.raw(`'${option.find((val) => val.value == table_name).label}'`)}, to_char(created_at, 'YY'::text), '-', id::text) as label
						FROM ${sql.raw(table_name)}
						WHERE ${sql.raw(table_name)}.is_pi = 0;
					`)
					: await db.execute(sql`
						SELECT 
							uuid as value,
							concat(${sql.raw(`'${option.find((val) => val.value == table_name).label}'`)}, to_char(created_at, 'YY'::text), '-', id::text) as label
						FROM ${sql.raw(table_name)};
					`);
		} else if (['purchase.vendor', 'public.party'].includes(table_name)) {
			result = await db.execute(sql`
				SELECT 
					uuid as value,
					name as label
				FROM ${sql.raw(table_name)};
			`);
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Selected table data retrieved successfully',
		};

		res.status(200).json({
			toast,
			data: result?.rows || {},
		});
	} catch (error) {
		await handleError({ error, res });
	}
}
