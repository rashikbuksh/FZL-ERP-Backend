import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function selectProductWiseConsumption(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, type, from_date, to_date } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    SELECT 
                        CONCAT(
                            vodf.item_name, 
							CASE WHEN vodf.nylon_stopper_name IS NOT NULL THEN ' ' ELSE '' END,
                            vodf.nylon_stopper_name, 
							CASE WHEN vodf.zipper_number_name IS NOT NULL THEN ' - ' ELSE '' END, 
                            vodf.zipper_number_name, 
							CASE WHEN vodf.end_type_name IS NOT NULL THEN ' - ' ELSE '' END,
                            vodf.end_type_name, 
							CASE WHEN vodf.puller_type_name IS NOT NULL THEN ' - ' ELSE '' END,
							vodf.puller_type_name
                        ) AS item_description,
						vodf.item_name,
						vodf.nylon_stopper_name,
						vodf.zipper_number_name,
						vodf.end_type_name,
						vodf.puller_type_name,
                        SUM(
                            CASE 
                                WHEN vodf.is_inch = 1 THEN oe.quantity * CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                                WHEN vodf.order_type = 'tape' THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)
                                ELSE oe.quantity * CAST(oe.size AS NUMERIC)
                            END
                        )::float8 as total_cm,
                        SUM(oe.quantity) AS total_quantity,
						ROUND(
							CAST(
									(
										COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0)::float8 + 
										COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0)::float8
									) AS NUMERIC
							), 2
						)::float8 AS total_dyeing_transaction_quantity,
						COALESCE(tcr.raw_mtr_per_kg, 0)::float8 AS mtr_per_kg,
						COALESCE(tcr.top, 0)::float8 as top,
						COALESCE(tcr.bottom, 0)::float8 as bottom,
						COALESCE((production_sum.coloring_production_quantity::float8),0)::float8 AS total_coloring_production_quantity,
						SUM(sfg.delivered)::float8 as total_delivered_quantity
					FROM
						zipper.v_order_details_full vodf
					LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.tape_coil_required tcr 
						ON vodf.item = tcr.item_uuid 
						AND vodf.zipper_number = tcr.zipper_number_uuid 
						AND (CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END)
					LEFT JOIN (
						SELECT 
							SUM(dtt.trx_quantity) AS total_trx_quantity, 
							vodf.item,
							vodf.zipper_number,
							vodf.nylon_stopper,
							vodf.end_type,
							vodf.puller_type
						FROM zipper.dyed_tape_transaction dtt
						LEFT JOIN zipper.v_order_details_full vodf ON dtt.order_description_uuid = vodf.order_description_uuid
						GROUP BY 
							vodf.item,
							vodf.zipper_number,
							vodf.nylon_stopper,
							vodf.end_type,
							vodf.puller_type
					) dyed_tape_transaction_sum ON 
					 	(vodf.item = dyed_tape_transaction_sum.item
						AND vodf.zipper_number = dyed_tape_transaction_sum.zipper_number
						AND (
							lower(vodf.item_name) != 'nylon' 
							OR vodf.nylon_stopper = dyed_tape_transaction_sum.nylon_stopper
						)
						AND vodf.end_type = dyed_tape_transaction_sum.end_type
						AND vodf.puller_type = dyed_tape_transaction_sum.puller_type)
					LEFT JOIN (
						SELECT SUM(dttfs.trx_quantity) AS total_trx_quantity, 
							vodf.item,
							vodf.zipper_number,
							vodf.nylon_stopper,
							vodf.end_type,
							vodf.puller_type
						FROM zipper.dyed_tape_transaction_from_stock dttfs
						LEFT JOIN zipper.v_order_details_full vodf ON dttfs.order_description_uuid = vodf.order_description_uuid
						GROUP BY 
							vodf.item,
							vodf.zipper_number,
							vodf.nylon_stopper,
							vodf.end_type,
							vodf.puller_type
					) dyed_tape_transaction_from_stock_sum ON 
					 	(vodf.item = dyed_tape_transaction_from_stock_sum.item
						AND vodf.zipper_number = dyed_tape_transaction_from_stock_sum.zipper_number
						AND (
							lower(vodf.item_name) != 'nylon' 
							OR vodf.nylon_stopper = dyed_tape_transaction_from_stock_sum.nylon_stopper
						)
						AND vodf.end_type = dyed_tape_transaction_from_stock_sum.end_type
						AND vodf.puller_type = dyed_tape_transaction_from_stock_sum.puller_type)
					LEFT JOIN (
						SELECT 
							SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity,
							od.item,
							od.zipper_number,
							od.nylon_stopper,
							od.end_type,
							od.puller_type
						FROM slider.production
						LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
						LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
						LEFT JOIN zipper.order_description od ON finishing_batch.order_description_uuid = od.uuid
						GROUP BY 
							od.item,
							od.zipper_number,
							od.nylon_stopper,
							od.end_type,
							od.puller_type
					) production_sum ON 
						(vodf.item = production_sum.item
						AND vodf.zipper_number = production_sum.zipper_number
						AND (
							lower(vodf.item_name) != 'nylon'
							OR vodf.nylon_stopper = production_sum.nylon_stopper
						)
						AND vodf.end_type = production_sum.end_type
						AND vodf.puller_type = production_sum.puller_type)
                    WHERE 
						(
							lower(vodf.item_name) != 'nylon' 
							OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
						)
						AND ${
							type == 'nylon_plastic'
								? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) LIKE 'plastic%'`
								: type == 'nylon'
									? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) NOT LIKE 'plastic%'`
									: type == 'all'
										? sql`TRUE`
										: sql`lower(vodf.item_name) = ${type}`
						}
						AND ${
							from_date && to_date
								? sql`vodf.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
								: sql`TRUE`
						}
						AND vodf.is_cancelled = FALSE
					GROUP BY
						vodf.item_name,
						vodf.nylon_stopper_name,
						vodf.zipper_number_name,
						vodf.end_type_name,
						vodf.puller_type_name,
						tcr.raw_mtr_per_kg,
						tcr.top,
						tcr.bottom,
						dyed_tape_transaction_sum.total_trx_quantity,
						dyed_tape_transaction_from_stock_sum.total_trx_quantity,
						production_sum.coloring_production_quantity
					ORDER BY
                        vodf.item_name
						`;

		// The following commented lines are the original conditions that were used to filter the results.
		// AND (COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0) +
		// 	COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0)) > 0
		// AND COALESCE(production_sum.coloring_production_quantity, 0) > 0

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All product wise consumption fetched successfully',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}

export async function selectProductWiseConsumptionForOrder(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, type, from_date, to_date } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
                    SELECT 
						vodf.marketing_name,
                        vodf.order_number,
						vodf.party_name,
						vodf.factory_name,
						vodf.created_at,
						vodf.item_description,
						vodf.order_description_uuid,
						CONCAT(
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
							ELSE '' END
						) AS specification,
						ARRAY_AGG(oe.style) as styles,
						ARRAY_AGG(oe.color) as colors,
						ARRAY_AGG(oe.color_ref) as color_refs,
						CONCAT(
							MIN(
								CASE 
									WHEN vodf.is_inch = 1 
										THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
								ELSE CAST(oe.size AS NUMERIC) END), ' - ', 
							MAX(
								CASE 
									WHEN vodf.is_inch = 1 
										THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
								ELSE CAST(oe.size AS NUMERIC) END)
						) AS sizes,
						SUM(oe.quantity)::float8 AS total_quantity,
						SUM(sfg.delivered)::float8 as total_delivered_quantity,
                        SUM(
                            CASE 
                                WHEN vodf.is_inch = 1 THEN oe.quantity * CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                                WHEN vodf.order_type = 'tape' THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)
                                ELSE oe.quantity * CAST(oe.size AS NUMERIC)
                            END
                        )::float8 as total_cm,
						ROUND(
							CAST(
									(
										COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0)::float8 + 
										COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0)::float8
									) AS NUMERIC
							), 2
						)::float8 AS total_dyeing_transaction_quantity,
						COALESCE(tcr.raw_mtr_per_kg, 0)::float8 AS mtr_per_kg,
						COALESCE(tcr.top, 0)::float8 as top,
						COALESCE(tcr.bottom, 0)::float8 as bottom,
						COALESCE((production_sum.coloring_production_quantity::float8),0)::float8 AS total_coloring_production_quantity
					FROM
						zipper.v_order_details_full vodf
					LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.tape_coil_required tcr 
						ON vodf.item = tcr.item_uuid 
						AND vodf.zipper_number = tcr.zipper_number_uuid 
						AND (CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END)
					LEFT JOIN (
						SELECT 
							SUM(dtt.trx_quantity) AS total_trx_quantity, 
							vodf.order_description_uuid
						FROM zipper.dyed_tape_transaction dtt
						LEFT JOIN zipper.v_order_details_full vodf ON dtt.order_description_uuid = vodf.order_description_uuid
						GROUP BY vodf.order_description_uuid
					) dyed_tape_transaction_sum ON vodf.order_description_uuid = dyed_tape_transaction_sum.order_description_uuid
					LEFT JOIN (
						SELECT 
							SUM(dttfs.trx_quantity) AS total_trx_quantity, 
							vodf.order_description_uuid
						FROM zipper.dyed_tape_transaction_from_stock dttfs
						LEFT JOIN zipper.v_order_details_full vodf ON dttfs.order_description_uuid = vodf.order_description_uuid
						GROUP BY 
							vodf.order_description_uuid
					) dyed_tape_transaction_from_stock_sum ON 
						vodf.order_description_uuid = dyed_tape_transaction_from_stock_sum.order_description_uuid
					LEFT JOIN (
						SELECT 
							SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity,
							od.uuid as order_description_uuid
						FROM slider.production
						LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
						LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
						LEFT JOIN zipper.order_description od ON finishing_batch.order_description_uuid = od.uuid
						GROUP BY od.uuid
					) production_sum ON vodf.order_description_uuid = production_sum.order_description_uuid
                    WHERE 
						(
							lower(vodf.item_name) != 'nylon' 
							OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
						)
						AND ${
							type == 'nylon_plastic'
								? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) LIKE 'plastic%'`
								: type == 'nylon'
									? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) NOT LIKE 'plastic%'`
									: type == 'all'
										? sql`TRUE`
										: sql`lower(vodf.item_name) = ${type}`
						}
						AND ${
							from_date && to_date
								? sql`vodf.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
								: sql`TRUE`
						}
					GROUP BY 
						vodf.marketing_name,
                        vodf.order_number,
						vodf.order_description_uuid,
						vodf.party_name,
						vodf.factory_name,
						vodf.created_at,
						vodf.item_description,
						vodf.lock_type_name, 
						vodf.teeth_color_name, 
						vodf.puller_color_name, 
						vodf.hand_name, 
						vodf.coloring_type_name, 
						vodf.slider_name, 
						vodf.top_stopper_name, 
						vodf.bottom_stopper_name, 
						vodf.logo_type_name, 
						vodf.is_logo_body,
						vodf.is_logo_puller,
						dyed_tape_transaction_sum.total_trx_quantity,
						dyed_tape_transaction_from_stock_sum.total_trx_quantity,
						production_sum.coloring_production_quantity,
						tcr.raw_mtr_per_kg,
						tcr.top,
						tcr.bottom,
						vodf.item_name
					ORDER BY
                        vodf.marketing_name
						`;

		// The following commented lines are the original conditions that were used to filter the results.
		// AND (COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0) +
		// 	COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0)) > 0
		// AND COALESCE(production_sum.coloring_production_quantity, 0) > 0

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All product wise consumption fetched successfully',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
