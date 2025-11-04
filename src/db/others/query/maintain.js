import { asc, eq, sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import * as maintainSchema from '../../maintain/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';

export async function selectUtilityDate(req, res, next) {
	const utilityPromise = db
		.select({
			value: sql`${maintainSchema.utility.date}`,
			label: sql`${maintainSchema.utility.date}`,
		})
		.from(maintainSchema.utility)
		.limit(1);

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
