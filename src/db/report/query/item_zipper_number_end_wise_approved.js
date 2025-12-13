import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function selectItemZipperEndApprovedQuantity(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid } = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    SELECT 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) = 'invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END as item_name,
                        vodf.zipper_number_name,
                        vodf.end_type_name,
                        SUM(oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 as total_quantity,
                        sum(
                            CASE 
                                WHEN sfg.recipe_uuid IS NULL 
                                THEN oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8
                                ELSE 0 
                            END
                        )::float8 as not_approved,
                        sum(
                            CASE 
                                WHEN vodf.order_type = 'slider' 
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                WHEN sfg.recipe_uuid IS NOT NULL 
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                ELSE 0 
                            END
                        )::float8 as approved
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        vodf.is_cancelled = FALSE
                        AND ${own_uuid ? sql`vodf.marketing_uuid = ${marketingUuid}` : sql`1=1`}
                    GROUP BY 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) = 'invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END,
                        vodf.zipper_number_name,
                        vodf.end_type_name
                    ORDER BY 
                        item_name, zipper_number_name, end_type_name;

    `;
		const resultPromise = db.execute(query);

		// group data using item_name
		const data = await resultPromise;

		if (!Array.isArray(data.rows)) {
			throw new TypeError('Expected data to be an array');
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item zipper number end wise approved quantity',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectItemZipperEndSwatchApprovedQuantity(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid } = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    SELECT 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) = 'invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END as item_name,
                        vodf.zipper_number_name,
                        vodf.end_type_name,
                        SUM(oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 as total_quantity,
                        sum(
                            CASE 
                                WHEN oe.swatch_approval_received = FALSE
                                THEN oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8
                                ELSE 0 
                            END
                        )::float8 as not_approved,
                        sum(
                            CASE 
                                WHEN vodf.order_type = 'slider'
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                WHEN oe.swatch_approval_received = TRUE
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                ELSE 0 
                            END
                        )::float8 as approved
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        vodf.is_cancelled = FALSE
                        AND ${own_uuid ? sql`vodf.marketing_uuid = ${marketingUuid}` : sql`1=1`}
                    GROUP BY 
                        CASE 
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
                            THEN vodf.item_name || ' ' || 'Plastic'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) = 'invisible')
                            THEN vodf.item_name || ' ' || 'Invisible'
                            WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
                            THEN vodf.item_name
                            ELSE vodf.item_name 
                        END,
                        vodf.zipper_number_name,
                        vodf.end_type_name
                    ORDER BY 
                        item_name, zipper_number_name, end_type_name;

    `;
		const resultPromise = db.execute(query);

		// group data using item_name
		const data = await resultPromise;

		if (!Array.isArray(data.rows)) {
			throw new TypeError('Expected data to be an array');
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item zipper number end wise approved quantity',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectPartyWiseApprovedQuantity(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid } = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    SELECT 
                        vodf.party_name,
                        sum(
                            CASE 
                                WHEN sfg.recipe_uuid IS NULL 
                                THEN oe.quantity::float8  
                                ELSE 0 
                            END
                        ) as not_approved,
                        sum(
                            CASE 
                                WHEN vodf.order_type = 'slider' 
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                WHEN sfg.recipe_uuid IS NOT NULL 
                                THEN oe.quantity::float8  - sfg.warehouse::float8 - sfg.delivered::float8
                                ELSE 0 
                            END
                        ) as approved
                    FROM
                        zipper.sfg sfg 
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    WHERE 
                        vodf.is_cancelled = FALSE
                        AND ${own_uuid ? sql`vodf.marketing_uuid = ${marketingUuid}` : sql`1=1`}
                    GROUP BY 
                        vodf.party_name
                    ORDER BY 
                        vodf.party_name;
    `;
		const resultPromise = db.execute(query);

		// group data using item_name
		const data = await resultPromise;

		if (!Array.isArray(data.rows)) {
			throw new TypeError('Expected data to be an array');
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Item zipper number end wise approved quantity',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
