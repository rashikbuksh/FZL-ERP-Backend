import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function selectItemWiseProduction(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
        SELECT 
            CASE 
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                THEN vodf.item_name || ' ' || 'Plastic'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                THEN vodf.item_name || ' ' || 'Invisible'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                THEN vodf.item_name
                ELSE vodf.item_name 
            END as item_name,
            COALESCE(SUM(packing_list_sum.total_packing_list_quantity),0)::float8 as total_production
        FROM
            zipper.v_order_details_full vodf
        LEFT JOIN (
                SELECT 
                    DISTINCT od.uuid as order_description_uuid,
                    SUM(ple.quantity) as total_packing_list_quantity
                FROM 
                    delivery.packing_list_entry ple
                LEFT JOIN 
                    delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                LEFT JOIN
                    zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                WHERE
                    pl.item_for NOT IN ('thread', 'sample_thread') 
                    AND od.uuid IS NOT null
                    AND ${from && to ? sql`pl.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                GROUP BY
                    od.uuid
        ) packing_list_sum ON vodf.order_description_uuid = packing_list_sum.order_description_uuid
        WHERE
            ${own_uuid ? sql`vodf.marketing_uuid = ${marketingUuid}` : sql`1=1`} AND item_name IS NOT null
        GROUP BY 
            CASE 
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                THEN vodf.item_name || ' ' || 'Plastic'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                THEN vodf.item_name || ' ' || 'Invisible'
                WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                THEN vodf.item_name
                ELSE vodf.item_name 
            END
        UNION 
        SELECT 
            'Thread' as item_name,
            COALESCE(SUM(packing_list_sum.total_packing_list_quantity),0)::float8 as total_production
        FROM
            thread.order_info toi
        LEFT JOIN (
                SELECT 
                    oe.order_info_uuid as order_info_uuid,
                    SUM(ple.quantity) as total_packing_list_quantity
                FROM 
                    delivery.packing_list_entry ple
                LEFT JOIN 
                    delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                LEFT JOIN
                    thread.order_entry oe ON ple.thread_order_entry_uuid = oe.uuid
                WHERE
                    oe.order_info_uuid IS NOT null
                    AND pl.item_for IN ('thread', 'sample_thread') AND ${from && to ? sql`pl.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                GROUP BY
                    oe.order_info_uuid
        ) packing_list_sum ON toi.uuid = packing_list_sum.order_info_uuid
        WHERE
            ${own_uuid ? sql`toi.marketing_uuid = ${marketingUuid}` : sql`1=1`}
        GROUP BY 
            item_name 
        `;
		const data = await db.execute(query);

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item Wise Production',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectItemZipperEndWiseProduction(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, from, to } = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    SELECT 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END as item_name,
                        vodf.zipper_number_name,
                        vodf.end_type_name,
                        COALESCE(SUM(
                            packing_list_sum.total_packing_list_quantity
                        ),0)::float8 as total_production,
                        CASE 
                            WHEN vodf.order_type = 'tape' THEN 'Meter' 
                            WHEN vodf.order_type = 'slider' THEN 'Pcs'
                            WHEN vodf.is_inch = 1 THEN 'Inch'
                            ELSE 'CM' 
                        END as unit
                    FROM
                        zipper.v_order_details_full vodf
                    LEFT JOIN (
                        SELECT 
                            od.uuid as order_description_uuid,
                            SUM(ple.quantity) as total_packing_list_quantity
                        FROM 
                            delivery.packing_list_entry ple
                        LEFT JOIN 
                            delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                        LEFT JOIN
                            zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
                        LEFT JOIN
                            zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN
                            zipper.order_description od ON oe.order_description_uuid = od.uuid
                        WHERE
                            pl.item_for NOT IN ('thread', 'sample_thread') 
                            AND ${from && to ? sql`pl.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                        GROUP BY
                            od.uuid
                    ) packing_list_sum ON vodf.order_description_uuid = packing_list_sum.order_description_uuid
                    WHERE
                        ${own_uuid ? sql`vodf.marketing_uuid = ${marketingUuid}` : sql`1=1`}
                    GROUP BY 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Plastic')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name = 'Invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND vodf.nylon_stopper_name != 'Plastic')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END,
                        vodf.zipper_number_name,
                        vodf.end_type_name,
                        vodf.order_type,
                        vodf.is_inch
                    HAVING SUM(packing_list_sum.total_packing_list_quantity) > 0
                    ORDER BY 
                        item_name, zipper_number_name, end_type_name;`;
		const resultPromise = db.execute(query);

		// group data using item_name
		const data = await resultPromise;

		if (!Array.isArray(data.rows)) {
			throw new TypeError('Expected data to be an array');
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item zipper number end wise Production',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
