import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { currency } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const currencyPromise = db
		.insert(currency)
		.values(req.body)
		.returning({ insertedName: currency.currency });

	try {
		const data = await currencyPromise;

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

	const currencyPromise = db
		.update(currency)
		.set(req.body)
		.where(eq(currency.uuid, req.params.uuid))
		.returning({ updatedName: currency.currency });

	try {
		const data = await currencyPromise;

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

	const currencyPromise = db
		.delete(currency)
		.where(eq(currency.uuid, req.params.uuid))
		.returning({ deletedName: currency.currency });

	try {
		const data = await currencyPromise;

		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: currency.uuid,
			currency: currency.currency,
			currency_name: currency.currency_name,
			symbol: currency.symbol,
			created_by: currency.created_by,
			created_by_name: createdByUser.name,
			created_at: currency.created_at,
			updated_by: currency.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: currency.updated_at,
			remarks: currency.remarks,
		})
		.from(currency)
		.leftJoin(createdByUser, eq(currency.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(currency.updated_by, updatedByUser.uuid))
		.orderBy(desc(currency.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Currencies',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const currencyPromise = db
		.select({
			uuid: currency.uuid,
			currency: currency.currency,
			currency_name: currency.currency_name,
			symbol: currency.symbol,
			created_by: currency.created_by,
			created_by_name: createdByUser.name,
			created_at: currency.created_at,
			updated_by: currency.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: currency.updated_at,
			remarks: currency.remarks,
		})
		.from(currency)
		.leftJoin(createdByUser, eq(currency.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(currency.updated_by, updatedByUser.uuid))
		.where(eq(currency.uuid, req.params.uuid));

	try {
		const data = await currencyPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Currency',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}
