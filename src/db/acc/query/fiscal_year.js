import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { currency, fiscal_year } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';
import { decimalToNumber } from '../../variables.js';
import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.insert(fiscal_year)
		.values(req.body)
		.returning({ insertedYear: fiscal_year.year_no });

	try {
		const data = await fyPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Fiscal Year ${data[0].insertedYear} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.update(fiscal_year)
		.set(req.body)
		.where(eq(fiscal_year.uuid, req.params.uuid))
		.returning({ updatedYear: fiscal_year.year_no });

	try {
		const data = await fyPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `Fiscal Year ${data[0].updatedYear} updated`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.delete(fiscal_year)
		.where(eq(fiscal_year.uuid, req.params.uuid))
		.returning({ deletedYear: fiscal_year.year_no });

	try {
		const data = await fyPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Fiscal Year ${data[0].deletedYear} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: fiscal_year.uuid,
			year_no: fiscal_year.year_no,
			start_date: fiscal_year.start_date,
			end_date: fiscal_year.end_date,
			active: fiscal_year.active,
			locked: fiscal_year.locked,
			jan_budget: decimalToNumber(fiscal_year.jan_budget),
			feb_budget: decimalToNumber(fiscal_year.feb_budget),
			mar_budget: decimalToNumber(fiscal_year.mar_budget),
			apr_budget: decimalToNumber(fiscal_year.apr_budget),
			may_budget: decimalToNumber(fiscal_year.may_budget),
			jun_budget: decimalToNumber(fiscal_year.jun_budget),
			jul_budget: decimalToNumber(fiscal_year.jul_budget),
			aug_budget: decimalToNumber(fiscal_year.aug_budget),
			sep_budget: decimalToNumber(fiscal_year.sep_budget),
			oct_budget: decimalToNumber(fiscal_year.oct_budget),
			nov_budget: decimalToNumber(fiscal_year.nov_budget),
			dec_budget: decimalToNumber(fiscal_year.dec_budget),
			created_by: fiscal_year.created_by,
			created_by_name: createdByUser.name,
			created_at: fiscal_year.created_at,
			updated_by: fiscal_year.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: fiscal_year.updated_at,
			remarks: fiscal_year.remarks,
			currency_uuid: fiscal_year.currency_uuid,
			currency_name: sql`${currency.currency} || ' (' || ${
				currency.symbol
			} || ')'`,
			rate: decimalToNumber(fiscal_year.rate),
		})
		.from(fiscal_year)
		.leftJoin(createdByUser, eq(fiscal_year.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(fiscal_year.updated_by, updatedByUser.uuid))
		.leftJoin(currency, eq(fiscal_year.currency_uuid, currency.uuid))
		.orderBy(desc(fiscal_year.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Fiscal Years',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.select({
			uuid: fiscal_year.uuid,
			year_no: fiscal_year.year_no,
			start_date: fiscal_year.start_date,
			end_date: fiscal_year.end_date,
			active: fiscal_year.active,
			locked: fiscal_year.locked,
			jan_budget: decimalToNumber(fiscal_year.jan_budget),
			feb_budget: decimalToNumber(fiscal_year.feb_budget),
			mar_budget: decimalToNumber(fiscal_year.mar_budget),
			apr_budget: decimalToNumber(fiscal_year.apr_budget),
			may_budget: decimalToNumber(fiscal_year.may_budget),
			jun_budget: decimalToNumber(fiscal_year.jun_budget),
			jul_budget: decimalToNumber(fiscal_year.jul_budget),
			aug_budget: decimalToNumber(fiscal_year.aug_budget),
			sep_budget: decimalToNumber(fiscal_year.sep_budget),
			oct_budget: decimalToNumber(fiscal_year.oct_budget),
			nov_budget: decimalToNumber(fiscal_year.nov_budget),
			dec_budget: decimalToNumber(fiscal_year.dec_budget),
			created_by: fiscal_year.created_by,
			created_by_name: createdByUser.name,
			created_at: fiscal_year.created_at,
			updated_by: fiscal_year.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: fiscal_year.updated_at,
			remarks: fiscal_year.remarks,
			currency_uuid: fiscal_year.currency_uuid,
			currency_name: sql`${currency.currency} || ' (' || ${
				currency.symbol
			} || ')'`,
			rate: decimalToNumber(fiscal_year.rate),
		})
		.from(fiscal_year)
		.leftJoin(createdByUser, eq(fiscal_year.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(fiscal_year.updated_by, updatedByUser.uuid))
		.leftJoin(currency, eq(fiscal_year.currency_uuid, currency.uuid))
		.where(eq(fiscal_year.uuid, req.params.uuid));

	try {
		const data = await fyPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Fiscal Year',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
