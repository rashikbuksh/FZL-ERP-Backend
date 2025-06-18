import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function threadProductionReportByDate(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, date } = req?.query;

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
                batch.uuid,
                CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) AS batch_number,
                batch.created_at AS batch_created_at,
                order_entry.uuid as order_entry_uuid,
                order_info.uuid as order_info_uuid,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                order_info.created_at as order_created_at,
                order_info.updated_at as order_updated_at,
                order_info.is_sample,
                order_info.party_uuid,
                party.name as party_name,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_entry.style,
                order_entry.color,
                order_entry.color_ref,
                recipe.name as recipe_name,
                order_entry.swatch_approval_date,
                order_entry.count_length_uuid,
                count_length.count,
                count_length.length,
                batch_entry_quantity_length.total_quantity::float8,
                batch_entry_quantity_length.total_weight::float8,
                batch_entry_quantity_length.yarn_quantity::float8,
                batch.is_drying_complete,
                batch_entry_coning.total_coning_production_quantity::float8,
                batch.remarks,
                batch_entry.created_at as batch_entry_created_at
            FROM
                thread.batch_entry
            LEFT JOIN 
                thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
            LEFT JOIN 
                lab_dip.recipe ON order_entry.recipe_uuid = recipe.uuid
            LEFT JOIN
                thread.batch ON batch.uuid = batch_entry.batch_uuid
            LEFT JOIN
                thread.order_info ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT 
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(batch_entry.yarn_quantity) as yarn_quantity,
                    SUM(count_length.max_weight * batch_entry.quantity) as total_weight,
                    batch_entry.batch_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                GROUP BY
                    batch_entry.batch_uuid
            ) batch_entry_quantity_length ON batch.uuid = batch_entry_quantity_length.batch_uuid
            LEFT JOIN (
                SELECT 
                    SUM(coning_production_quantity) as total_coning_production_quantity,
                    batch_uuid
                FROM
                    thread.batch_entry
                GROUP BY
                    batch_uuid
            ) batch_entry_coning ON batch.uuid = batch_entry_coning.batch_uuid
            WHERE batch.uuid IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`order_info.marketing_uuid = ${marketingUuid}`} AND batch_entry.created_at::date = ${date}
        `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Production Status By Date',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function threadProductionReportPartyWiseByDate(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, date } = req?.query;

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
                    party.name as party_name,
                    SUM(batch_entry_quantity_length.total_quantity)::float8 as total_quantity,
                    SUM(batch_entry_quantity_length.total_weight)::float8 as total_weight,
                    SUM(batch_entry_quantity_length.yarn_quantity)::float8 as yarn_quantity,
                    SUM(batch_entry_coning.total_coning_production_quantity)::float8 as total_coning_production_quantity    
                FROM
                    thread.batch_entry
                LEFT JOIN 
                    thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN 
                    lab_dip.recipe ON order_entry.recipe_uuid = recipe.uuid
                LEFT JOIN
                    thread.batch ON batch.uuid = batch_entry.batch_uuid
                LEFT JOIN
                    thread.order_info ON order_entry.order_info_uuid = order_info.uuid
                LEFT JOIN
                    thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                LEFT JOIN
                    public.party ON order_info.party_uuid = party.uuid
                LEFT JOIN
                    public.marketing ON order_info.marketing_uuid = marketing.uuid
                LEFT JOIN (
                    SELECT 
                        SUM(batch_entry.quantity) as total_quantity,
                        SUM(batch_entry.yarn_quantity) as yarn_quantity,
                        SUM(count_length.max_weight * batch_entry.quantity) as total_weight,
                        batch_entry.batch_uuid
                    FROM
                        thread.batch_entry
                    LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                    LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                    GROUP BY
                        batch_entry.batch_uuid
                ) batch_entry_quantity_length ON batch.uuid = batch_entry_quantity_length.batch_uuid
                LEFT JOIN (
                    SELECT 
                        SUM(coning_production_quantity) as total_coning_production_quantity,
                        batch_uuid
                    FROM
                        thread.batch_entry
                    GROUP BY
                        batch_uuid
                ) batch_entry_coning ON batch.uuid = batch_entry_coning.batch_uuid
                WHERE batch.uuid IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`order_info.marketing_uuid = ${marketingUuid}`} AND batch_entry.created_at::date = ${date}
                GROUP BY
                    party.name
        `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Production Status Party Wise By Date',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
