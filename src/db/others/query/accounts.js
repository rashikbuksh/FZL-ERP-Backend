import { and, asc, desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber, GetMarketingOwnUUID } from '../../variables.js';
import * as accountSchema from '../../acc/schema.js';

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
