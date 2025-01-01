import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectMarketReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
                    SELECT 
                        marketing.uuid as marketing_uuid,
                        marketing.name as marketing_name,
                        party.uuid as party_uuid,
                        party.name as party_name,
                        ARRAY_AGG(DISTINCT vodf.order_number) as zipper_order_number,
                        ARRAY_AGG(DISTINCT toi.id) as thread_order_number
                    FROM 
                        public.party
                    LEFT JOIN
                        zipper.v_order_details_full vodf ON party.uuid = vodf.party_uuid
                    LEFT JOIN
                        thread.order_info toi ON party.uuid = toi.party_uuid
                    LEFT JOIN
                        public.marketing ON marketing.uuid = vodf.marketing_uuid OR marketing.uuid = toi.marketing_uuid
                    WHERE
                        ${own_uuid == null ? sql`TRUE` : sql`marketing.uuid = ${marketingUuid}`}
                    GROUP BY 
                        marketing.uuid, marketing.name, party.uuid, party.name
                    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All cash invoices fetched',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
