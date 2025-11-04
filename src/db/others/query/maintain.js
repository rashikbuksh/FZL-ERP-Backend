import { desc, ne, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import * as maintainSchema from '../../maintain/schema.js';

const utilityPrevious = alias(maintainSchema.utility, 'utility_previous');

export async function selectUtilityDate(req, res, next) {
	const utilityPromise = db
		.select({
			value: sql`${maintainSchema.utility.date}`,
			label: sql`${maintainSchema.utility.date}`,
		})
		.from(maintainSchema.utility)
		.leftJoin(
			utilityPrevious,
			ne(utilityPrevious.date, maintainSchema.utility.previous_date)
		)
		.orderBy(desc(maintainSchema.utility.date));

	try {
		const [data] = await utilityPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'utility date list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
