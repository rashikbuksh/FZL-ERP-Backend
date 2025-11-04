import { desc, ne, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import * as maintainSchema from '../../maintain/schema.js';

const utilityPrevious = alias(maintainSchema.utility, 'utility_previous');

export async function selectUtilityDate(req, res, next) {
	const utilityPromise = db
		.selectDistinct({
			value: maintainSchema.utility.date,
			label: maintainSchema.utility.date,
		})
		.from(maintainSchema.utility)
		.where(
			sql`${maintainSchema.utility.date} NOT IN (
				SELECT DISTINCT ${maintainSchema.utility.previous_date} 
				FROM ${maintainSchema.utility} 
				WHERE ${maintainSchema.utility.previous_date} IS NOT NULL
			)`
		)
		.orderBy(desc(maintainSchema.utility.date));

	try {
		const data = await utilityPromise;

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
