import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

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

export async function deliveryStatementReport(req, res, next) {
	const {
		from_date,
		to_date,
		own_uuid,
		marketing,
		party,
		type,
		order_info_uuid,
		report_for,
		price_for,
	} = req.query;

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
                    vpl.packing_list_entry_uuid,
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
                        ) * CASE WHEN vodf.order_type = 'tape' THEN ${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} ELSE (${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} / 12) END, 
                        0
                    )::float8 as total_close_end_value,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 
                        0
                    )::float8 as total_close_end_value_party,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value_company,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN ${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} ELSE (${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 
                        0
                    )::float8 as total_open_end_value_party,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value_company,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN ${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} ELSE (${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} / 12) END, 0)::float8 as total_prod_value,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 0)::float8 as total_prod_value_party,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value_company
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    ${from_date ? sql`vpl.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}
                    AND vpl.item_for NOT IN ('thread', 'sample_thread')
                    AND ${report_for == 'accounts' ? sql`vpl.challan_uuid IS NOT NULL` : sql`1=1`}
                GROUP BY 
                    vpl.packing_list_entry_uuid,
                    vodf.order_type,
                    oe.party_price,
                    oe.company_price
                ), 
            running_all_sum AS (
                SELECT 
                    vpl.packing_list_entry_uuid, 
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
                        ) * CASE WHEN vodf.order_type = 'tape' THEN ${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} ELSE (${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} / 12) END, 
                        0
                    )::float8 as total_close_end_value, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 
                        0
                    )::float8 as total_close_end_value_party,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value_company,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN ${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} ELSE (${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 
                        0
                    )::float8 as total_open_end_value_party,
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value_company,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN ${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} ELSE (${price_for === 'party' ? sql`oe.party_price` : sql`oe.company_price`} / 12) END, 0)::float8 as total_prod_value,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE (oe.party_price / 12) END, 0)::float8 as total_prod_value_party,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value_company
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                    AND vpl.item_for NOT IN ('thread', 'sample_thread')
                    AND ${report_for == 'accounts' ? sql`vpl.challan_uuid IS NOT NULL` : sql`1=1`}
                GROUP BY 
                    vpl.packing_list_entry_uuid,
                    vodf.order_type,
                    oe.party_price,
                    oe.company_price
                ),
                opening_all_sum_thread AS (
                    SELECT 
                        vpl.packing_list_entry_uuid,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ), 
                            0
                        )::float8 AS total_close_end_quantity,
                        0 as total_open_end_quantity,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ) * ${price_for === 'party' ? sql`toe.party_price` : sql`toe.company_price`}, 
                            0
                        )::float8 as total_close_end_value,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ) * toe.party_price, 
                            0
                        )::float8 as total_close_end_value_party,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ) * toe.company_price, 
                            0
                        )::float8 as total_close_end_value_company,
                        0 as total_open_end_value,
                        0 as total_open_end_value_party,
                        0 as total_open_end_value_company,
                        coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                        coalesce(SUM(vpl.quantity) * ${price_for === 'party' ? sql`toe.party_price` : sql`toe.company_price`}, 0)::float8 as total_prod_value,
                        coalesce(SUM(vpl.quantity) * toe.party_price, 0)::float8 as total_prod_value_party,
                        coalesce(SUM(vpl.quantity) * toe.company_price, 0)::float8 as total_prod_value_company
                    FROM
                        delivery.v_packing_list_details vpl
                        LEFT JOIN thread.order_info toi ON vpl.order_info_uuid = toi.uuid
                        LEFT JOIN thread.order_entry toe ON vpl.order_entry_uuid = toe.uuid
                        AND toi.uuid = toe.order_info_uuid
                    WHERE
                        ${from_date ? sql`vpl.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}
                        AND vpl.item_for IN ('thread', 'sample_thread')
                        AND ${report_for == 'accounts' ? sql`vpl.challan_uuid IS NOT NULL` : sql`1=1`}
                    GROUP BY
                        vpl.packing_list_entry_uuid, toe.party_price, toe.company_price
                ),
                running_all_sum_thread AS (
                    SELECT 
                        vpl.packing_list_entry_uuid,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ),
                            0
                        )::float8 AS total_close_end_quantity,
                        0 as total_open_end_quantity,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ) * ${price_for === 'party' ? sql`toe.party_price` : sql`toe.company_price`},
                            0
                        )::float8 as total_close_end_value,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ) * toe.party_price,
                            0
                        )::float8 as total_close_end_value_party,
                        coalesce(
                            SUM(
                                vpl.quantity ::float8
                            ) * toe.company_price,
                            0
                        )::float8 as total_close_end_value_company,
                        0 as total_open_end_value,
                        0 as total_open_end_value_party,
                        0 as total_open_end_value_company,
                        coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                        coalesce(SUM(vpl.quantity) * ${price_for === 'party' ? sql`toe.party_price` : sql`toe.company_price`}, 0)::float8 as total_prod_value,
                        coalesce(SUM(vpl.quantity) * toe.party_price, 0)::float8 as total_prod_value_party,
                        coalesce(SUM(vpl.quantity) * toe.company_price, 0)::float8 as total_prod_value_company
                    FROM
                        delivery.v_packing_list_details vpl
                        LEFT JOIN thread.order_info toi ON vpl.order_info_uuid = toi.uuid
                        LEFT JOIN thread.order_entry toe ON vpl.order_entry_uuid = toe.uuid
                        AND toi.uuid = toe.order_info_uuid
                    WHERE
                        ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                        AND vpl.item_for IN ('thread', 'sample_thread')
                        AND ${report_for == 'accounts' ? sql`vpl.challan_uuid IS NOT NULL` : sql`1=1`}
                    GROUP BY
                        vpl.packing_list_entry_uuid, toe.party_price, toe.company_price
                )
                SELECT 
                    vodf.marketing_uuid,
                    vodf.marketing_name,
                    vodf.order_info_uuid,
                    vodf.order_number,
                    CONCAT(vodf.order_number, ' - ', CASE WHEN vodf.is_cash = 0 THEN ' (PI)' ELSE ' (CASH)' END) as order_number_with_cash,
                    vodf.item_name,
                    CASE WHEN vodf.order_type = 'slider' THEN 'Slider' ELSE vodf.item_name END as type,
                    vodf.party_uuid,
                    vodf.party_name,
                    order_info_total_quantity.total_quantity,
                    vodf.order_description_uuid,
                    CONCAT(
                        vodf.item_description, 
                        CASE WHEN (vodf.lock_type_name IS NOT NULL OR vodf.lock_type_name != '---') THEN ', ' ELSE '' END,
                        vodf.lock_type_name, 
                        CASE WHEN (vodf.teeth_color_name IS NOT NULL OR vodf.teeth_color_name != '---') THEN ', teeth: ' ELSE '' END,
                        vodf.teeth_color_name, 
                        CASE WHEN (vodf.puller_color_name IS NOT NULL OR vodf.puller_color_name != '---') THEN ', puller: ' ELSE '' END,
                        vodf.puller_color_name, 
                        CASE WHEN (vodf.hand_name IS NOT NULL OR vodf.hand_name != '---') THEN ', ' ELSE '' END,
                        vodf.hand_name, 
                        CASE WHEN (vodf.coloring_type_name IS NOT NULL OR vodf.coloring_type_name != '---') THEN ', type: ' ELSE '' END, 
                        vodf.coloring_type_name, 
                        CASE WHEN (vodf.slider_name IS NOT NULL OR vodf.slider_name != '---') THEN ', ' ELSE '' END,
                        vodf.slider_name, 
                        CASE WHEN (vodf.top_stopper_name IS NOT NULL OR vodf.top_stopper_name != '---') THEN ', ' ELSE '' END,
                        vodf.top_stopper_name, 
                        CASE WHEN (vodf.bottom_stopper_name IS NOT NULL OR vodf.bottom_stopper_name != '---') THEN ', ' ELSE '' END,
                        vodf.bottom_stopper_name, 
                        CASE WHEN (vodf.logo_type_name IS NOT NULL OR vodf.logo_type_name != '---') THEN ', ' ELSE '' END,
                        vodf.logo_type_name, 
                        CASE WHEN (vodf.logo_type_name IS NOT NULL AND vodf.logo_type_name != '---') THEN 
                            CONCAT(
                                ' (', 
                                CASE WHEN vodf.is_logo_body = 1 THEN 'B' ELSE '' END, 
                                CASE WHEN vodf.is_logo_puller = 1 THEN ' P' ELSE '' END, 
                                ')'
                            ) 
                        ELSE '' 
                        END
                    ) as item_description,
                    vodf.end_type,
                    vodf.end_type_name,
                    vodf.order_type,
                    vodf.is_cash,
                    vodf.is_inch,
                    CONCAT('PL', to_char(pl.created_at, 'YY-MM'), '-', pl.id::text) AS packing_number,
                    DATE(pl.created_at) as packing_list_created_at,
                    CONCAT('ZC', to_char(ch.created_at, 'YY'), '-', LPAD(ch.id::text, 5, '0')) AS challan_number,
                    DATE(ch.created_at) as challan_created_at,
                    oe.size,
                    CASE 
                        WHEN vodf.order_type = 'tape' THEN 'Meter'
                        WHEN vodf.is_inch = 1 THEN 'Inch'
                        ELSE 'Cm'
                    END as unit,
                    CASE WHEN 
                        vodf.order_type = 'tape' THEN 'Mtr'
                        ELSE 'Dzn'
                    END as price_unit,
                    ROUND(oe.company_price::numeric, 3) as company_price_dzn, 
                    ROUND(oe.company_price / 12::numeric, 3) as company_price_pcs, 
                    ple.uuid as packing_list_entry_uuid,
                    'opening' as opening, 
                    COALESCE(opening_all_sum.total_close_end_quantity, 0)::float8 as opening_total_close_end_quantity, 
                    COALESCE(opening_all_sum.total_open_end_quantity, 0)::float8 as opening_total_open_end_quantity, 
                    COALESCE(opening_all_sum.total_prod_quantity, 0)::float8 as opening_total_quantity, 
                    COALESCE(opening_all_sum.total_prod_quantity, 0)::float8 / 12 as opening_total_quantity_dzn, 
                    COALESCE(opening_all_sum.total_close_end_value, 0)::float8 as opening_total_close_end_value,
                    COALESCE(opening_all_sum.total_close_end_value_party, 0)::float8 as opening_total_close_end_value_party,
                    COALESCE(opening_all_sum.total_close_end_value_company, 0)::float8 as opening_total_close_end_value_company,
                    COALESCE(opening_all_sum.total_open_end_value, 0)::float8 as opening_total_open_end_value, 
                    COALESCE(opening_all_sum.total_open_end_value_party, 0)::float8 as opening_total_open_end_value_party, 
                    COALESCE(opening_all_sum.total_open_end_value_company, 0)::float8 as opening_total_open_end_value_company, 
                    COALESCE(opening_all_sum.total_prod_value, 0)::float8 as opening_total_value, 
                    COALESCE(opening_all_sum.total_prod_value_party, 0)::float8 as opening_total_value_party,
                    COALESCE(opening_all_sum.total_prod_value_company, 0)::float8 as opening_total_value_company,
                    'running' as running, 
                    COALESCE(running_all_sum.total_close_end_quantity, 0)::float8 as running_total_close_end_quantity, 
                    COALESCE(running_all_sum.total_open_end_quantity, 0)::float8 as running_total_open_end_quantity, 
                    COALESCE(running_all_sum.total_prod_quantity, 0)::float8 as running_total_quantity, 
                    COALESCE(running_all_sum.total_prod_quantity, 0)::float8 / 12 as running_total_quantity_dzn, 
                    COALESCE(running_all_sum.total_close_end_value, 0)::float8 as running_total_close_end_value, 
                    COALESCE(running_all_sum.total_close_end_value_party, 0)::float8 as running_total_close_end_value_party, 
                    COALESCE(running_all_sum.total_close_end_value_company, 0)::float8 as running_total_close_end_value_company, 
                    COALESCE(running_all_sum.total_open_end_value, 0)::float8 as running_total_open_end_value, 
                    COALESCE(running_all_sum.total_open_end_value_party, 0)::float8 as running_total_open_end_value_party,
                    COALESCE(running_all_sum.total_open_end_value_company, 0)::float8 as running_total_open_end_value_company,
                    COALESCE(running_all_sum.total_prod_value, 0)::float8 as running_total_value, 
                    COALESCE(running_all_sum.total_prod_value_party, 0)::float8 as running_total_value_party,
                    COALESCE(running_all_sum.total_prod_value_company, 0)::float8 as running_total_value_company,
                    'closing' as closing, 
                    COALESCE(running_all_sum.total_close_end_quantity, 0)::float8 + COALESCE(opening_all_sum.total_close_end_quantity, 0)::float8 as closing_total_close_end_quantity, 
                    COALESCE(running_all_sum.total_open_end_quantity, 0)::float8 + COALESCE(opening_all_sum.total_open_end_quantity, 0)::float8 as closing_total_open_end_quantity, 
                    COALESCE(running_all_sum.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum.total_prod_quantity, 0)::float8 as closing_total_quantity, 
                    (COALESCE(running_all_sum.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) / 12 as closing_total_quantity_dzn, 
                    COALESCE(running_all_sum.total_close_end_value, 0)::float8 + COALESCE(opening_all_sum.total_close_end_value, 0)::float8 as closing_total_close_end_value, 
                    COALESCE(running_all_sum.total_close_end_value_party, 0)::float8 + COALESCE(opening_all_sum.total_close_end_value_party, 0)::float8 as closing_total_close_end_value_party,
                    COALESCE(running_all_sum.total_close_end_value_company, 0)::float8 + COALESCE(opening_all_sum.total_close_end_value_company, 0)::float8 as closing_total_close_end_value_company,
                    COALESCE(running_all_sum.total_open_end_value, 0)::float8 + COALESCE(opening_all_sum.total_open_end_value, 0)::float8 as closing_total_open_end_value, 
                    COALESCE(running_all_sum.total_open_end_value_party, 0)::float8 + COALESCE(opening_all_sum.total_open_end_value_party, 0)::float8 as closing_total_open_end_value_party,
                    COALESCE(running_all_sum.total_open_end_value_company, 0)::float8 + COALESCE(opening_all_sum.total_open_end_value_company, 0)::float8 as closing_total_open_end_value_company,
                    COALESCE(running_all_sum.total_prod_value, 0)::float8 + COALESCE(opening_all_sum.total_prod_value, 0)::float8 as closing_total_value,
                    COALESCE(running_all_sum.total_prod_value_party, 0)::float8 + COALESCE(opening_all_sum.total_prod_value_party, 0)::float8 as closing_total_value_party,
                    COALESCE(running_all_sum.total_prod_value_company, 0)::float8 + COALESCE(opening_all_sum.total_prod_value_company, 0)::float8 as closing_total_value_company,
                    pi_cash.is_pi,
                    CASE 
                        WHEN (vodf.is_cash = 0 AND pi_cash.conversion_rate IS NULL) THEN '80'::float8 
                        ELSE pi_cash.conversion_rate 
                    END as conversion_rate
                FROM 
                    delivery.packing_list_entry ple
                LEFT JOIN 
                    delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                LEFT JOIN 
                    delivery.challan ch ON pl.challan_uuid = ch.uuid
                LEFT JOIN 
                    zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN 
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN 
                    zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN 
                    opening_all_sum ON ple.uuid = opening_all_sum.packing_list_entry_uuid 
                LEFT JOIN 
                    running_all_sum ON ple.uuid = running_all_sum.packing_list_entry_uuid
                LEFT JOIN (
                    SELECT 
                        jsonb_array_elements_text(order_info_uuids::jsonb) AS order_info_uuid,
                        is_pi,
                        conversion_rate
                    FROM 
                        commercial.pi_cash
                ) pi_cash ON vodf.order_info_uuid::text = pi_cash.order_info_uuid
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
                WHERE 
                    vodf.item_description IS NOT NULL AND vodf.item_description != '---' 
                    AND COALESCE(
                            COALESCE(running_all_sum.total_prod_quantity, 0)::float8,
                            0
                        )::float8 > 0
                    AND ${marketing ? sql`vodf.marketing_uuid = ${marketing}` : sql`1=1`}
                    AND ${party ? sql`vodf.party_uuid = ${party}` : sql`1=1`}
                    AND ${from_date && to_date ? sql`pl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                    AND ${own_uuid ? sql`vodf.marketing_uuid = ${marketingUuid}` : sql`1=1`}
                UNION 
                SELECT 
                    toi.marketing_uuid,
                    marketing.name as marketing_name,
                    toi.uuid as order_info_uuid,
                    CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
                    CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0'), CASE WHEN toi.is_cash = 0 THEN '(PI)' ELSE '(CASH)' END) as order_number_with_cash,
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
                    toi.is_cash,
                    null as is_inch,
                    CONCAT('PL', to_char(pl.created_at, 'YY-MM'), '-', pl.id::text) AS packing_number,
                    DATE(pl.created_at) as packing_list_created_at,
                    CONCAT('TC', to_char(ch.created_at, 'YY'), '-', LPAD(ch.id::text, 5, '0')) AS challan_number,
                    DATE(ch.created_at) as challan_created_at,
                    count_length.length::text as size,
                    'Mtr' as unit,
                    'Mtr' as price_unit,
                    ROUND(toe.company_price::numeric, 3) as company_price_dzn,
                    ROUND(toe.company_price, 3) as company_price_pcs,
                    ple.uuid as packing_list_entry_uuid,
                    'opening' as opening,
                    COALESCE(opening_all_sum_thread.total_close_end_quantity, 0)::float8 as opening_total_close_end_quantity,
                    0 as opening_total_open_end_quantity,
                    COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8 as opening_total_quantity,
                    COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8 / 12 as opening_total_quantity_dzn,
                    COALESCE(opening_all_sum_thread.total_close_end_value, 0)::float8 as opening_total_close_end_value,
                    COALESCE(opening_all_sum_thread.total_close_end_value_party, 0)::float8 as opening_total_close_end_value_party,
                    COALESCE(opening_all_sum_thread.total_close_end_value_company, 0)::float8 as opening_total_close_end_value_company,
                    0 as opening_total_open_end_value,
                    0 as opening_total_open_end_value_party,
                    0 as opening_total_open_end_value_company,
                    COALESCE(opening_all_sum_thread.total_prod_value, 0)::float8 as opening_total_value,
                    COALESCE(opening_all_sum_thread.total_prod_value_party, 0)::float8 as opening_total_value_party,
                    COALESCE(opening_all_sum_thread.total_prod_value_company, 0)::float8 as opening_total_value_company,
                    'running' as running,
                    COALESCE(running_all_sum_thread.total_close_end_quantity, 0)::float8 as running_total_close_end_quantity,
                    0 as running_total_open_end_quantity,
                    COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 as running_total_quantity,
                    COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 / 12 as running_total_quantity_dzn,
                    COALESCE(running_all_sum_thread.total_close_end_value, 0)::float8 as running_total_close_end_value,
                    COALESCE(running_all_sum_thread.total_close_end_value_party, 0)::float8 as running_total_close_end_value_party,
                    COALESCE(running_all_sum_thread.total_close_end_value_company, 0)::float8 as running_total_close_end_value_company,
                    0 as running_total_open_end_value,
                    0 as running_total_open_end_value_party,
                    0 as running_total_open_end_value_company,
                    COALESCE(running_all_sum_thread.total_prod_value, 0)::float8 as running_total_value,
                    COALESCE(running_all_sum_thread.total_prod_value_party, 0)::float8 as running_total_value_party,
                    COALESCE(running_all_sum_thread.total_prod_value_company, 0)::float8 as running_total_value_company,
                    'closing' as closing,
                    COALESCE(running_all_sum_thread.total_close_end_quantity, 0)::float8 + COALESCE(opening_all_sum_thread.total_close_end_quantity, 0)::float8 as closing_total_close_end_quantity,
                    0 as closing_total_open_end_quantity,
                    COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8 as closing_total_quantity,
                    (COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_quantity, 0)::float8) / 12 as closing_total_quantity_dzn,
                    COALESCE(running_all_sum_thread.total_close_end_value, 0)::float8 + COALESCE(opening_all_sum_thread.total_close_end_value, 0)::float8 as closing_total_close_end_value,
                    COALESCE(running_all_sum_thread.total_close_end_value_party, 0)::float8 + COALESCE(opening_all_sum_thread.total_close_end_value_party, 0)::float8 as closing_total_close_end_value_party,
                    COALESCE(running_all_sum_thread.total_close_end_value_company, 0)::float8 + COALESCE(opening_all_sum_thread.total_close_end_value_company, 0)::float8 as closing_total_close_end_value_company,
                    0 as closing_total_open_end_value,
                    0 as closing_total_open_end_value_party,
                    0 as closing_total_open_end_value_company,
                    COALESCE(running_all_sum_thread.total_prod_value, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_value, 0)::float8 as closing_total_value,
                    COALESCE(running_all_sum_thread.total_prod_value_party, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_value_party, 0)::float8 as closing_total_value_party,
                    COALESCE(running_all_sum_thread.total_prod_value_company, 0)::float8 + COALESCE(opening_all_sum_thread.total_prod_value_company, 0)::float8 as closing_total_value_company,
                    pi_cash.is_pi,
                    CASE 
                        WHEN toi.is_cash = 0 THEN '80'::float8 
                        ELSE COALESCE(pi_cash.conversion_rate, 0) 
                    END as conversion_rate
                FROM
                    delivery.packing_list_entry ple 
                    LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                    LEFT JOIN delivery.challan ch ON pl.challan_uuid = ch.uuid
                    LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
                    LEFT JOIN public.party party ON toi.party_uuid = party.uuid
                    LEFT JOIN public.marketing marketing ON toi.marketing_uuid = marketing.uuid
                    LEFT JOIN opening_all_sum_thread ON ple.uuid = opening_all_sum_thread.packing_list_entry_uuid
                    LEFT JOIN running_all_sum_thread ON ple.uuid = running_all_sum_thread.packing_list_entry_uuid
                    LEFT JOIN (
                            SELECT 
                                jsonb_array_elements_text(thread_order_info_uuids::jsonb) AS order_info_uuid,
                                is_pi,
                                conversion_rate
                            FROM 
                                commercial.pi_cash
                        ) pi_cash ON toi.uuid::text = pi_cash.order_info_uuid
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
                    COALESCE(
                            COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8, 
                            0
                        )::float8 > 0 
                    AND ${marketing ? sql`toi.marketing_uuid = ${marketing}` : sql`1=1`}
                    AND ${party ? sql`toi.party_uuid = ${party}` : sql`1=1`} 
                    AND ${from_date && to_date ? sql`pl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                    AND ${own_uuid ? sql`toi.marketing_uuid = ${marketingUuid}` : sql`1=1`}
                ORDER BY
                    party_name, marketing_name, item_name DESC, packing_number ASC;
    `;
		// ! is_bill removed from where clause in main query of zipper and thread
		// ! warehouse_received removed from where clause in opening_all_sum, running_all_sum, opening_all_sum_thread, running_all_sum_thread
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// filter by type
		if (type === 'Thread') {
			data.rows = data.rows.filter((row) => row.type === 'Thread');
		} else if (type === 'Zipper') {
			data.rows = data.rows.filter((row) => row.type !== 'Thread');
		} else if (type === 'Nylon') {
			data.rows = data.rows.filter((row) => row.type === 'Nylon');
		} else if (type === 'Metal') {
			data.rows = data.rows.filter((row) => row.type === 'Metal');
		} else if (type === 'Vislon') {
			data.rows = data.rows.filter((row) => row.type === 'Vislon');
		} else {
		}

		let filterData = [];

		// filter by order_info_uuid
		if (order_info_uuid) {
			filterData = data?.rows?.filter(
				(row) => row.order_info_uuid === order_info_uuid
			);
		} else {
			filterData = data.rows;
		}

		// first group by type, then party_name, then order_number, then item_description, then size
		const groupedData = filterData.reduce((acc, row) => {
			const {
				type,
				party_uuid,
				party_name,
				total_quantity,
				marketing_uuid,
				marketing_name,
				order_number,
				order_number_with_cash,
				packing_number,
				packing_list_created_at,
				item_description,
				order_description_uuid,
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				packing_list_entry_uuid,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_close_end_value_party,
				opening_total_close_end_value_company,
				opening_total_open_end_value,
				opening_total_open_end_value_party,
				opening_total_open_end_value_company,
				opening_total_value,
				opening_total_value_party,
				opening_total_value_company,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_close_end_value_party,
				running_total_close_end_value_company,
				running_total_open_end_value,
				running_total_open_end_value_party,
				running_total_open_end_value_company,
				running_total_value,
				running_total_value_party,
				running_total_value_company,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_close_end_value_party,
				closing_total_close_end_value_company,
				closing_total_open_end_value,
				closing_total_open_end_value_party,
				closing_total_open_end_value_company,
				closing_total_value,
				closing_total_value_party,
				closing_total_value_company,
				is_pi,
				conversion_rate,
			} = row;

			// group using (type, party and marketing) together then order_number, item_description, size

			const typeEntry = findOrCreateArray(
				acc,
				['type', 'party_name', 'marketing_name'],
				[type, party_name, marketing_name],
				() => ({
					type,
					party_uuid,
					party_name,
					marketing_uuid,
					marketing_name,
					orders: [],
				})
			);

			const order = findOrCreateArray(
				typeEntry.orders,
				['order_number_with_cash'],
				[order_number_with_cash],
				() => ({
					order_number,
					order_number_with_cash,
					total_quantity,
					items: [],
				})
			);

			const item = findOrCreateArray(
				order.items,
				['item_description'],
				[item_description],
				() => ({
					order_description_uuid,
					item_description,
					packing_lists: [],
				})
			);

			const packing_lists = findOrCreateArray(
				item.packing_lists,
				['packing_number'],
				[packing_number],
				() => ({
					packing_number,
					packing_list_created_at,
					other: [],
				})
			);

			packing_lists.other.push({
				packing_list_entry_uuid,
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
				opening_total_close_end_value_party,
				opening_total_close_end_value_company,
				opening_total_open_end_value,
				opening_total_open_end_value_party,
				opening_total_open_end_value_company,
				opening_total_value,
				opening_total_value_party,
				opening_total_value_company,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_close_end_value_party,
				running_total_close_end_value_company,
				running_total_open_end_value,
				running_total_open_end_value_party,
				running_total_open_end_value_company,
				running_total_value,
				running_total_value_party,
				running_total_value_company,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_close_end_value_party,
				closing_total_close_end_value_company,
				closing_total_open_end_value,
				closing_total_open_end_value_party,
				closing_total_open_end_value_company,
				closing_total_value,
				closing_total_value_party,
				closing_total_value_company,
				is_pi,
				conversion_rate,
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
