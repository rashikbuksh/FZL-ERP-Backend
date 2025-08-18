import { asc, sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import * as accountSchema from '../../acc/schema.js';
import db from '../../index.js';

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
