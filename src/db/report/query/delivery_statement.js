import { and, eq, min, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function deliveryStatementReport(req, res, next) {
	const { from_date, to_date } = req.query;

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
           WITH opening_all_sum AS (
                SELECT 
                    oe.uuid as order_entry_uuid, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_open_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    vpl.is_warehouse_received = true 
                    AND ${from_date ? sql`vpl.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}
                GROUP BY 
                    oe.uuid, vodf.order_type
                ), 
                running_all_sum AS (
                SELECT 
                    oe.uuid as order_entry_uuid, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_open_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    vpl.is_warehouse_received = true 
                    AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}

                GROUP BY 
                    oe.uuid, vodf.order_type
                ),
                opening_all_sum_thread AS (
                    SELECT 
                        toe.uuid as order_entry_uuid,
                        coalesce(
                            SUM(
                                CASE WHEN vpl.item_for = 'thread' OR vpl.item_for = 'sample_thread' THEN vpl.quantity ::float8 ELSE 0 END
                            ), 
                            0
                        )::float8 AS total_close_end_quantity,
                        0 as total_open_end_quantity,
                        coalesce(
                            SUM(
                                CASE WHEN vpl.item_for = 'thread' OR vpl.item_for = 'sample_thread' THEN vpl.quantity ::float8 ELSE 0 END
                            ) * toe.company_price, 
                            0
                        )::float8 as total_close_end_value,
                        0 as total_open_end_value,
                        coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                        coalesce(SUM(vpl.quantity) * toe.company_price, 0)::float8 as total_prod_value
                    FROM
                        delivery.v_packing_list_details vpl
                        LEFT JOIN thread.order_info toi ON vpl.order_info_uuid = toi.uuid
                        LEFT JOIN thread.order_entry toe ON vpl.order_entry_uuid = toe.uuid
                        AND toi.uuid = toe.order_info_uuid
                    WHERE
                        vpl.is_warehouse_received = true
                        AND ${from_date ? sql`vpl.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}
                    GROUP BY
                        toe.uuid, toe.company_price
                ),
                running_all_sum_thread AS (
                    SELECT 
                        toe.uuid as order_entry_uuid,
                        coalesce(
                            SUM(
                                CASE WHEN vpl.item_for = 'thread' OR vpl.item_for = 'sample_thread' THEN vpl.quantity ::float8 ELSE 0 END
                            ),
                            0
                        )::float8 AS total_close_end_quantity,
                        0 as total_open_end_quantity,
                        coalesce(
                            SUM(
                                CASE WHEN vpl.item_for = 'thread' OR vpl.item_for = 'sample_thread' THEN vpl.quantity ::float8 ELSE 0 END
                            ) * toe.company_price,
                            0
                        )::float8 as total_close_end_value,
                        0 as total_open_end_value,
                        coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                        coalesce(SUM(vpl.quantity) * toe.company_price, 0)::float8 as total_prod_value
                    FROM
                        delivery.v_packing_list_details vpl
                        LEFT JOIN thread.order_info toi ON vpl.order_info_uuid = toi.uuid
                        LEFT JOIN thread.order_entry toe ON vpl.order_entry_uuid = toe.uuid
                        AND toi.uuid = toe.order_info_uuid
                    WHERE
                        vpl.is_warehouse_received = true
                        AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}

                    GROUP BY
                        toe.uuid, toe.company_price
				)
                SELECT 
                    vodf.marketing_uuid,
					vodf.marketing_name,
					vodf.order_info_uuid,
					vodf.order_number,
					vodf.item_name,
					CASE WHEN vodf.order_type = 'slider' THEN 'Slider' ELSE vodf.item_name END as type,
					vodf.party_uuid,
					vodf.party_name,
                    order_info_total_quantity.total_quantity,
					vodf.order_description_uuid,
					vodf.item_description,
					vodf.end_type,
					vodf.end_type_name,
					vodf.order_type,
					vodf.is_inch,
                    description_wise_price_size.size,
                    CASE 
                        WHEN vodf.order_type = 'tape' THEN 'Meter'
                        WHEN vodf.is_inch = 1 THEN 'Inch'
                        ELSE 'Cm'
                    END as unit,
                    CASE WHEN 
                        vodf.order_type = 'tape' THEN 'Mtr'
                        ELSE 'Dzn'
                    END as price_unit,
                    ROUND(description_wise_price_size.company_price::numeric, 3) as company_price_dzn, 
                    ROUND(description_wise_price_size.company_price / 12::numeric, 3) as company_price_pcs, 
                    'opening' as opening, 
                    SUM(COALESCE(opening_all_sum.total_close_end_quantity, 0)::float8) as opening_total_close_end_quantity, 
                    SUM(COALESCE(opening_all_sum.total_open_end_quantity, 0)::float8) as opening_total_open_end_quantity, 
                    SUM(COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) as opening_total_quantity, 
                    SUM(COALESCE(opening_all_sum.total_prod_quantity, 0)::float8 / 12) as opening_total_quantity_dzn, 
                    SUM(COALESCE(opening_all_sum.total_close_end_value, 0)::float8) as opening_total_close_end_value, 
                    SUM(COALESCE(opening_all_sum.total_open_end_value, 0)::float8) as opening_total_open_end_value, 
                    SUM(COALESCE(opening_all_sum.total_prod_value, 0)::float8) as opening_total_value, 
                    'running' as running, 
                    SUM(COALESCE(running_all_sum.total_close_end_quantity, 0)::float8) as running_total_close_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_open_end_quantity, 0)::float8) as running_total_open_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8) as running_total_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8 / 12) as running_total_quantity_dzn, 
                    SUM(COALESCE(running_all_sum.total_close_end_value, 0)::float8) as running_total_close_end_value, 
                    SUM(COALESCE(running_all_sum.total_open_end_value, 0)::float8) as running_total_open_end_value, 
                    SUM(COALESCE(running_all_sum.total_prod_value, 0)::float8) as running_total_value, 
                    'closing' as closing, 
                    SUM(COALESCE(running_all_sum.total_close_end_quantity, 0)::float8 + COALESCE(opening_all_sum.total_close_end_quantity, 0)::float8) as closing_total_close_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_open_end_quantity, 0)::float8 + COALESCE(opening_all_sum.total_open_end_quantity, 0)::float8) as closing_total_open_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) as closing_total_quantity, 
                    SUM((COALESCE(running_all_sum.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) / 12) as closing_total_quantity_dzn, 
                    SUM(COALESCE(running_all_sum.total_close_end_value, 0)::float8 + COALESCE(opening_all_sum.total_close_end_value, 0)::float8) as closing_total_close_end_value, 
                    SUM(COALESCE(running_all_sum.total_open_end_value, 0)::float8 + COALESCE(opening_all_sum.total_open_end_value, 0)::float8) as closing_total_open_end_value, 
                    SUM(COALESCE(running_all_sum.total_prod_value, 0)::float8 + COALESCE(opening_all_sum.total_prod_value, 0)::float8) as closing_total_value
                FROM 
                    zipper.v_order_details_full vodf 
                LEFT JOIN 
                    zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid 
                LEFT JOIN 
                    opening_all_sum ON oe.uuid = opening_all_sum.order_entry_uuid 
                LEFT JOIN 
                    running_all_sum ON oe.uuid = running_all_sum.order_entry_uuid 
                LEFT JOIN (
                    SELECT
                        vodf.order_info_uuid,
                        SUM(oe.quantity) as total_quantity
                    FROM
                        zipper.order_entry oe
                    LEFT JOIN
                        zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    GROUP BY
                        vodf.order_info_uuid
                ) order_info_total_quantity ON vodf.order_info_uuid = order_info_total_quantity.order_info_uuid
                LEFT JOIN (
					SELECT 
						oe.order_description_uuid, 
						oe.company_price,
						CASE 
							WHEN MAX(oe.size::float8) = MIN(oe.size::float8) 
							THEN MAX(oe.size::float8)::text 
							ELSE CONCAT(MAX(oe.size::float8)::text, ' - ', MIN(oe.size::float8)::text) 
						END as size
					FROM
						zipper.order_entry oe
					GROUP BY
						oe.order_description_uuid, oe.company_price
				) description_wise_price_size ON vodf.order_description_uuid = description_wise_price_size.order_description_uuid
                WHERE 
                    vodf.is_bill = 1 AND vodf.item_description IS NOT NULL AND vodf.item_description != '---' 
                    AND coalesce(
                            coalesce(
                            running_all_sum.total_close_end_quantity, 
                            0
                            )::float8 + coalesce(
                            running_all_sum.total_open_end_quantity, 
                            0
                            )::float8 + coalesce(
                            opening_all_sum.total_close_end_quantity, 
                            0
                            )::float8 + coalesce(
                            opening_all_sum.total_open_end_quantity, 
                            0
                            )::float8, 
                            0
                        )::float8 > 0
                GROUP BY 
                    description_wise_price_size.company_price,
					description_wise_price_size.size,
                    vodf.marketing_uuid,
					vodf.marketing_name,
					vodf.order_info_uuid,
					vodf.order_number,
					vodf.item_name,
					vodf.party_uuid,
					vodf.party_name,
                    order_info_total_quantity.total_quantity,
					vodf.order_description_uuid,
					vodf.item_description,
					vodf.end_type,
					vodf.end_type_name,
					vodf.order_type,
					vodf.is_inch
                UNION 
                SELECT 
                    toi.marketing_uuid,
                    marketing.name as marketing_name,
                    toi.uuid as order_info_uuid,
                    CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
                    'Sewing Thread' as item_name,
                    'Thread' as type,
                    toi.party_uuid,
                    party.name as party_name,
                    order_info_total_quantity.total_quantity,
                    count_length.uuid as order_description_uuid,
                    CONCAT(count_length.count, ' - ', count_length.length) as item_description,
                    null as end_type,
                    null as end_type_name,
                    null as order_type,
                    null as is_inch,
                    count_length.length::text as size,
                    'Mtr' as unit,
                    'Mtr' as price_unit,
                    ROUND(toe.company_price::numeric, 3) as company_price_dzn,
                    ROUND(toe.company_price, 3) as company_price_pcs,
                    'opening' as opening,
                    SUM(COALESCE(opening_all_sum_thread.total_close_end_quantity, 0)::float8) as opening_total_close_end_quantity,
                    0 as opening_total_open_end_quantity,
                    SUM(COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8) as opening_total_quantity,
                    SUM(COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8 / 12) as opening_total_quantity_dzn,
                    SUM(COALESCE(opening_all_sum_thread.total_close_end_value, 0)::float8) as opening_total_close_end_value,
                    0 as opening_total_open_end_value,
                    SUM(COALESCE(opening_all_sum_thread.total_prod_value, 0)::float8) as opening_total_value,
                    'running' as running,
                    SUM(COALESCE(running_all_sum_thread.total_close_end_quantity, 0)::float8) as running_total_close_end_quantity,
                    0 as running_total_open_end_quantity,
                    SUM(COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8) as running_total_quantity,
                    SUM(COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 / 12) as running_total_quantity_dzn,
                    SUM(COALESCE(running_all_sum_thread.total_close_end_value, 0)::float8) as running_total_close_end_value,
                    0 as running_total_open_end_value,
                    SUM(COALESCE(running_all_sum_thread.total_prod_value, 0)::float8) as running_total_value,
                    'closing' as closing,
                    SUM(COALESCE(running_all_sum_thread.total_close_end_quantity, 0)::float8 + COALESCE(opening_all_sum_thread.total_close_end_quantity, 0)::float8) as closing_total_close_end_quantity,
                    0 as closing_total_open_end_quantity,
                    SUM(COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8) as closing_total_quantity,
                    SUM((COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8) / 12) as closing_total_quantity_dzn,
                    SUM(COALESCE(running_all_sum_thread.total_close_end_value, 0)::float8 + COALESCE(opening_all_sum_thread.total_close_end_value, 0)::float8) as closing_total_close_end_value,
                    0 as closing_total_open_end_value,
                    SUM(COALESCE(running_all_sum_thread.total_prod_value, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_value, 0)::float8) as closing_total_value
                FROM
                    thread.order_info toi
                    LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
                    LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
                    LEFT JOIN public.party party ON toi.party_uuid = party.uuid
                    LEFT JOIN public.marketing marketing ON toi.marketing_uuid = marketing.uuid
                    LEFT JOIN opening_all_sum_thread ON toe.uuid = opening_all_sum_thread.order_entry_uuid
                    LEFT JOIN running_all_sum_thread ON toe.uuid = running_all_sum_thread.order_entry_uuid
                    LEFT JOIN (
                        SELECT 
                            toi.uuid as order_info_uuid,
                            SUM(toe.quantity) as total_quantity
                        FROM
                            thread.order_entry toe
                            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                        GROUP BY
                            toi.uuid
                    ) order_info_total_quantity ON toi.uuid = order_info_total_quantity.order_info_uuid
                WHERE
                    toi.is_bill = 1
                    AND coalesce(
                            coalesce(
                            running_all_sum_thread.total_close_end_quantity, 
                            0
                            )::float8 + coalesce(
                            running_all_sum_thread.total_open_end_quantity, 
                            0
                            )::float8 + coalesce(
                            opening_all_sum_thread.total_close_end_quantity, 
                            0
                            )::float8 + coalesce(
                            opening_all_sum_thread.total_open_end_quantity, 
                            0
                            )::float8, 
                            0
                        )::float8 > 0 
                GROUP BY
                    toe.company_price,
                    toi.marketing_uuid,
                    marketing.name,
                    order_info_total_quantity.total_quantity,
                    toi.uuid,
                    toi.party_uuid,
                    count_length.uuid,
                    party.name,
                    count_length.count,
                    count_length.length
                ORDER BY
                    party_name, marketing_name, item_name DESC;
    `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// first group by type, then party_name, then order_number, then item_description, then size
		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				type,
				party_name,
				total_quantity,
				marketing_name,
				order_number,
				item_description,
				order_description_uuid,
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_open_end_value,
				opening_total_value,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_open_end_value,
				closing_total_value,
			} = row;

			// group using (type, party and marketing) together then order_number, item_description, size

			const findOrCreateArray = (array, key, value, createFn) => {
				let index = array.findIndex((item) =>
					key
						.map((indKey, index) => item[indKey] === value[index])
						.every((item) => item)
				);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const findOrCreate = (array, key, value, createFn) => {
				let index = array.findIndex((item) => item[key] === value);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const typeEntry = findOrCreateArray(
				acc,
				['type', 'party_name', 'marketing_name'],
				[type, party_name, marketing_name],
				() => ({
					type,
					party_name,
					marketing_name,
					orders: [],
				})
			);

			const order = findOrCreateArray(
				typeEntry.orders,
				['order_number'],
				[order_number],
				() => ({
					order_number,
					total_quantity,
					items: [],
				})
			);

			const item = findOrCreate(
				order.items,
				'order_description_uuid',
				order_description_uuid,
				() => ({
					item_description,
					other: [],
				})
			);

			item.other.push({
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_open_end_value,
				opening_total_value,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_open_end_value,
				closing_total_value,
			});

			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Delivery Statement Report',
		};

		res.status(200).json({ toast, data: groupedData });
	} catch (error) {
		await handleError({ error, res });
	}
}
