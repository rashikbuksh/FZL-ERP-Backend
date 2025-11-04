import { and, desc, ne, sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import * as maintainSchema from '../../maintain/schema.js';

export async function selectUtilityDate(req, res, next) {
	const { current } = req.query;
	const utilityPromise = db
		.selectDistinct({
			value: maintainSchema.utility.date,
			label: maintainSchema.utility.date,
		})
		.from(maintainSchema.utility)
		.where(
			and(
				sql`${maintainSchema.utility.date} NOT IN (
				SELECT DISTINCT ${maintainSchema.utility.previous_date} 
				FROM ${maintainSchema.utility} 
				WHERE ${maintainSchema.utility.previous_date} IS NOT NULL
			)`,
				current ? ne(maintainSchema.utility.date, current) : sql`true`
			)
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
