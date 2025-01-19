import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function ProductionReportThreadPartyWise(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, from, to } = req?.query;

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
                party.uuid as party_uuid,
                party.name as party_name,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                coalesce(prod_quantity.total_quantity,0)::float8 as total_quantity
            FROM
                thread.order_info
            LEFT JOIN
                thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT
                    order_entry.order_info_uuid,
                    order_entry.count_length_uuid,
                    SUM(batch_entry_production.production_quantity) as total_quantity
                FROM
                    thread.batch_entry_production
                LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                GROUP BY
                    order_entry.order_info_uuid, order_entry.count_length_uuid
            ) prod_quantity ON order_info.uuid = prod_quantity.order_info_uuid AND order_entry.count_length_uuid = prod_quantity.count_length_uuid
			WHERE
				${own_uuid == null ? sql`TRUE` : sql`marketing.uuid = ${marketingUuid}`}
				${from && to ? sql` AND order_info.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql``}
            GROUP BY 
                party.uuid, party.name, count_length.count, count_length.length, prod_quantity.total_quantity
            ORDER BY party.name DESC, count_length.count ASC, count_length.length ASC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// count_length_names will be column names and its values will be the total quantity
		// for that count_length_name
		const count_length_names_set = new Set();
		const party_wise_data = {};

		data?.rows.forEach((row) => {
			const {
				party_uuid,
				party_name,
				count_length_name,
				total_quantity,
			} = row;

			if (!party_wise_data[party_uuid]) {
				party_wise_data[party_uuid] = {
					party_name,
					total_quantity: 0,
					count_length_names: {},
				};
			}

			party_wise_data[party_uuid].total_quantity += total_quantity;
			party_wise_data[party_uuid].count_length_names[count_length_name] =
				(party_wise_data[party_uuid].count_length_names[
					count_length_name
				] || 0) + total_quantity;

			count_length_names_set.add(count_length_name);
		});

		const count_length_names_array = Array.from(count_length_names_set);

		const party_wise_data_array = Object.values(party_wise_data);

		const formatted_data = party_wise_data_array.map((party_data) => {
			const formatted_party_data = {
				party_name: party_data.party_name,
				total_quantity: party_data.total_quantity,
			};

			count_length_names_array.forEach((count_length_name) => {
				formatted_party_data[count_length_name] =
					party_data.count_length_names[count_length_name] || 0;
			});

			return formatted_party_data;
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Party Wise',
		};

		res.status(200).json({ toast, data: formatted_data });
	} catch (error) {
		await handleError({ error, res });
	}
}
