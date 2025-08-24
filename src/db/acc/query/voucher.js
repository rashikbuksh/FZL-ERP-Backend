import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import { createApi } from '../../../util/api.js';
import db from '../../index.js';
import { currency, voucher } from '../schema.js';
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
		.returning({ insertedDate: voucher.date });

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
		.returning({ updatedDate: voucher.date });

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

	const voucherPromise = db
		.delete(voucher)
		.where(eq(voucher.uuid, req.params.uuid))
		.returning({ deletedDate: voucher.date });

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
			currency_name: sql`currency.currency || ' ' || currency.currency_name`,
			currency_symbol: currency.symbol,
			conversion_rate: decimalToNumber(voucher.conversion_rate),
		})
		.from(voucher)
		.leftJoin(createdByUser, eq(voucher.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(voucher.updated_by, updatedByUser.uuid))
		.leftJoin(currency, eq(voucher.currency_uuid, currency.uuid))
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
			currency_name: sql`currency.currency || ' ' || currency.currency_name`,
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
