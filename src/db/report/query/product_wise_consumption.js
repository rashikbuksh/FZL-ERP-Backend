import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectProductWiseConsumption(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { own_uuid, type, from_date, to_date } = req?.query;

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
                        SUM(
                            CASE 
                                WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                                WHEN vodf.order_type = 'tape' THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)
                                ELSE CAST(oe.size AS NUMERIC)
                            END
                        )::float8 as total_cm,
                        SUM(oe.quantity) AS total_quantity,
						ROUND(
							CAST(
								SUM(
									COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0)::float8 + 
									COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0)::float8
								) AS NUMERIC
							), 2
						)::float8 AS total_dyeing_transaction_quantity,
						COALESCE(tcr.raw_mtr_per_kg, 0)::float8 AS mtr_per_kg,
						COALESCE(SUM(production_sum.coloring_production_quantity::float8),0)::float8 AS total_coloring_production_quantity
					FROM
						zipper.v_order_details_full vodf
					LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN zipper.tape_coil_required tcr 
						ON vodf.item = tcr.item_uuid 
						AND vodf.zipper_number = tcr.zipper_number_uuid 
						AND (CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END)
					LEFT JOIN (
						SELECT 
							SUM(dtt.trx_quantity) AS total_trx_quantity, dtt.order_description_uuid
						FROM zipper.dyed_tape_transaction dtt
						GROUP BY dtt.order_description_uuid
					) dyed_tape_transaction_sum ON dyed_tape_transaction_sum.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN (
						SELECT SUM(dttfs.trx_quantity) AS total_trx_quantity, dttfs.order_description_uuid
						FROM zipper.dyed_tape_transaction_from_stock dttfs
						GROUP BY dttfs.order_description_uuid
					) dyed_tape_transaction_from_stock_sum ON dyed_tape_transaction_from_stock_sum.order_description_uuid = vodf.order_description_uuid
					 LEFT JOIN (
						SELECT 
							od.uuid as order_description_uuid,
							SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity
						FROM slider.production
						LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
						LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
						LEFT JOIN zipper.order_description od ON finishing_batch.order_description_uuid = od.uuid
						GROUP BY od.uuid
					) production_sum ON production_sum.order_description_uuid = vodf.order_description_uuid
                    WHERE 
						(
							lower(vodf.item_name) != 'nylon' 
							OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
						)
						AND ${
							type == 'nylon_plastic'
								? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) = 'plastic'`
								: type == 'nylon'
									? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) != 'plastic'`
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
						vodf.item_name,
						vodf.nylon_stopper_name,
						vodf.zipper_number_name,
						vodf.end_type_name,
						vodf.puller_type_name,
						tcr.raw_mtr_per_kg
					ORDER BY
                        vodf.item_name
						`;

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
