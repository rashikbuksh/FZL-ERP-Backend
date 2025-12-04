import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import { createApi } from '../../../util/api.js';
import db from '../../index.js';
import {
	currency,
	voucher,
	voucher_entry,
	voucher_entry_cost_center,
	voucher_entry_payment,
} from '../schema.js';
import { decimalToNumber } from '../../variables.js';

import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.insert(voucher)
		.values(req.body)
		.returning({
			insertedDate: sql`CONCAT('VO', TO_CHAR(${voucher.created_at}::timestamp, 'YY'), '-', ${voucher.id})`,
		});

	try {
		const data = await voucherPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Voucher for ${data[0].insertedDate} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.update(voucher)
		.set(req.body)
		.where(eq(voucher.uuid, req.params.uuid))
		.returning({
			updatedDate: sql`CONCAT('VO', TO_CHAR(${voucher.created_at}::timestamp, 'YY'), '-', ${voucher.id})`,
		});

	try {
		const data = await voucherPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `Voucher for ${data[0].updatedDate} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const getVoucherEntriesPromise = db
		.select()
		.from(voucher_entry)
		.where(eq(voucher_entry.voucher_uuid, req.params.uuid));

	// First, delete related voucher entries like voucher payments and voucher cost centers
	await getVoucherEntriesPromise.then(async (voucherEntries) => {
		for (const entry of voucherEntries) {
			// Delete voucher payments related to this voucher entry
			await db
				.delete(voucher_entry_payment)
				.where(
					eq(voucher_entry_payment.voucher_entry_uuid, entry.uuid)
				);
			// Delete voucher cost centers related to this voucher entry
			await db
				.delete(voucher_entry_cost_center)
				.where(
					eq(voucher_entry_cost_center.voucher_entry_uuid, entry.uuid)
				);
		}
	});

	// Then, delete the voucher entries themselves
	await db
		.delete(voucher_entry)
		.where(eq(voucher_entry.voucher_uuid, req.params.uuid));

	const voucherPromise = db
		.delete(voucher)
		.where(eq(voucher.uuid, req.params.uuid))
		.returning({
			deletedDate: sql`CONCAT('VO', TO_CHAR(${voucher.created_at}::timestamp, 'YY'), '-', ${voucher.id})`,
		});

	try {
		const data = await voucherPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Voucher for ${data[0].deletedDate} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: voucher.uuid,
			id: voucher.id,
			voucher_id: sql`CONCAT('VO', to_char(voucher.created_at, 'YY'), '-', voucher.id::text)`,
			date: voucher.date,
			category: voucher.category,
			vat_deduction: decimalToNumber(voucher.vat_deduction),
			tax_deduction: decimalToNumber(voucher.tax_deduction),
			created_by: voucher.created_by,
			created_by_name: createdByUser.name,
			created_at: voucher.created_at,
			updated_by: voucher.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: voucher.updated_at,
			remarks: voucher.remarks,
			narration: voucher.narration,
			currency_uuid: voucher.currency_uuid,
			currency_name: sql`currency.currency || ' (' || currency.symbol || ')'`,
			currency_symbol: currency.symbol,
			conversion_rate: decimalToNumber(voucher.conversion_rate),
			dr_ledgers: sql`COALESCE(voucher_agg.dr_ledgers, ARRAY[]::text[])`,
			cr_ledgers: sql`COALESCE(voucher_agg.cr_ledgers, ARRAY[]::text[])`,
			amount: sql`COALESCE(voucher_agg.amount, 0)::float8`,
		})
		.from(voucher)
		.leftJoin(createdByUser, eq(voucher.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(voucher.updated_by, updatedByUser.uuid))
		.leftJoin(currency, eq(voucher.currency_uuid, currency.uuid))
		.leftJoin(
			sql`(
				SELECT 
					voucher_entry.voucher_uuid, 
					array_agg(ledger.name::text) FILTER (WHERE voucher_entry.type = 'dr') as dr_ledgers,
    				array_agg(ledger.name::text) FILTER (WHERE voucher_entry.type = 'cr') as cr_ledgers,
    				SUM(
						CASE WHEN voucher_entry.type = 'dr' THEN voucher_entry.amount ELSE 0 END
					) as amount
				FROM acc.voucher_entry
				LEFT JOIN acc.ledger ON voucher_entry.ledger_uuid = ledger.uuid
				GROUP BY voucher_entry.voucher_uuid
			) as voucher_agg`,
			eq(voucher.uuid, sql`voucher_agg.voucher_uuid`)
		)
		.orderBy(desc(voucher.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Vouchers',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.select({
			uuid: voucher.uuid,
			id: voucher.id,
			voucher_id: sql`CONCAT('VO', to_char(voucher.created_at, 'YY'), '-', voucher.id::text)`,
			date: voucher.date,
			category: voucher.category,
			vat_deduction: decimalToNumber(voucher.vat_deduction),
			tax_deduction: decimalToNumber(voucher.tax_deduction),
			created_by: voucher.created_by,
			created_by_name: createdByUser.name,
			created_at: voucher.created_at,
			updated_by: voucher.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: voucher.updated_at,
			remarks: voucher.remarks,
			narration: voucher.narration,
			currency_uuid: voucher.currency_uuid,
			currency_name: sql`currency.currency || ' (' || currency.symbol || ')'`,
			currency_symbol: currency.symbol,
			conversion_rate: decimalToNumber(voucher.conversion_rate),
		})
		.from(voucher)
		.leftJoin(createdByUser, eq(voucher.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(voucher.updated_by, updatedByUser.uuid))
		.leftJoin(currency, eq(voucher.currency_uuid, currency.uuid))
		.where(eq(voucher.uuid, req.params.uuid));

	try {
		const data = await voucherPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByVoucherUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const api = await createApi(req);

		const { voucher_uuid } = req.params;

		const fetchData = async (endpoint) =>
			await api.get(`/acc/${endpoint}/${voucher_uuid}`);

		const [voucher, voucher_entry] = await Promise.all([
			fetchData('voucher'),
			fetchData('voucher-entry/by-voucher'),
		]);

		const response = {
			...voucher?.data?.data,
			voucher_entry: voucher_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
