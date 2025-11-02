import { desc, eq, sql, asc } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { group, head, ledger, voucher_entry } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';
import { decimalToNumber } from '../../variables.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ledgerPromise = db
		.insert(ledger)
		.values(req.body)
		.returning({ insertedName: ledger.name });

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ledgerPromise = db
		.update(ledger)
		.set(req.body)
		.where(eq(ledger.uuid, req.params.uuid))
		.returning({ updatedName: ledger.name });

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ledgerPromise = db
		.delete(ledger)
		.where(eq(ledger.uuid, req.params.uuid))
		.returning({ deletedName: ledger.name });

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: ledger.uuid,
			id: ledger.id,
			ledger_id: sql`CONCAT('LE', to_char(ledger.created_at, 'YY'), '-', ledger.id::text)`,
			table_name: ledger.table_name,
			table_uuid: ledger.table_uuid,
			name: ledger.name,
			account_no: ledger.account_no,
			// type: ledger.type,
			is_active: ledger.is_active,
			restrictions: ledger.restrictions,
			group_uuid: ledger.group_uuid,
			group_name: group.name,
			head_uuid: group.head_uuid,
			head_name: sql`head.name || ' (' || head.type || ')'`,
			vat_deduction: decimalToNumber(ledger.vat_deduction),
			tax_deduction: decimalToNumber(ledger.tax_deduction),
			old_ledger_id: ledger.old_ledger_id,
			created_by: ledger.created_by,
			created_by_name: hrSchema.users.name,
			created_at: ledger.created_at,
			updated_by: ledger.updated_by,
			updated_at: ledger.updated_at,
			remarks: ledger.remarks,
			is_bank_ledger: ledger.is_bank_ledger,
			is_cash_ledger: ledger.is_cash_ledger,
			identifier: ledger.identifier,
			initial_amount: decimalToNumber(ledger.initial_amount),
			group_number: ledger.group_number,
			index: ledger.index,
			total_amount: sql`${ledger.initial_amount} ::float8 + (COALESCE(voucher_total.total_debit_amount, 0) - COALESCE(voucher_total.total_credit_amount, 0))::float8`,
		})
		.from(ledger)
		.leftJoin(group, eq(ledger.group_uuid, group.uuid))
		.leftJoin(head, eq(group.head_uuid, head.uuid))
		.leftJoin(hrSchema.users, eq(ledger.created_by, hrSchema.users.uuid))
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
		)
		.orderBy(asc(ledger.index));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Ledger',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: ledger.uuid,
			id: ledger.id,
			ledger_id: sql`CONCAT('LE', to_char(ledger.created_at, 'YY'), '-', ledger.id::text)`,
			table_name: ledger.table_name,
			table_uuid: ledger.table_uuid,
			name: ledger.name,
			account_no: ledger.account_no,
			// type: ledger.type,
			is_active: ledger.is_active,
			restrictions: ledger.restrictions,
			group_uuid: ledger.group_uuid,
			group_name: group.name,
			head_uuid: group.head_uuid,
			head_name: head.name,
			vat_deduction: decimalToNumber(ledger.vat_deduction),
			tax_deduction: decimalToNumber(ledger.tax_deduction),
			old_ledger_id: ledger.old_ledger_id,
			created_by: ledger.created_by,
			created_by_name: hrSchema.users.name,
			created_at: ledger.created_at,
			updated_by: ledger.updated_by,
			updated_at: ledger.updated_at,
			remarks: ledger.remarks,
			is_bank_ledger: ledger.is_bank_ledger,
			is_cash_ledger: ledger.is_cash_ledger,
			identifier: ledger.identifier,
			initial_amount: decimalToNumber(ledger.initial_amount),
			group_number: ledger.group_number,
			index: ledger.index,
			vouchers: sql`
			(
				SELECT COALESCE(
						JSONB_AGG(
							JSONB_BUILD_OBJECT(
								'uuid', ve.uuid, 
								'voucher_uuid', ve.voucher_uuid, 
								'voucher_id', CONCAT(
									'VO', TO_CHAR(v.created_at::timestamp, 'YY'), '-', v.id
								), 
								'ledger_uuid', ve.ledger_uuid, 
								'ledger_name', l.name,
								'category', v.category, 
								'date', v.date,
								'type', ve.type,
								'amount', ve.amount
							)
						), '[]'::jsonb
					)
				FROM acc.voucher_entry ve
				LEFT JOIN acc.voucher v ON ve.voucher_uuid = v.uuid
				LEFT JOIN acc.ledger l ON ve.ledger_uuid = l.uuid
				WHERE ve.ledger_uuid = ledger.uuid
			)
			`.as('vouchers'),
		})
		.from(ledger)
		.leftJoin(group, eq(ledger.group_uuid, group.uuid))
		.leftJoin(head, eq(group.head_uuid, head.uuid))
		.leftJoin(hrSchema.users, eq(ledger.created_by, hrSchema.users.uuid))
		.leftJoin(voucher_entry, eq(ledger.uuid, voucher_entry.ledger_uuid))
		.where(eq(ledger.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Ledger',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
