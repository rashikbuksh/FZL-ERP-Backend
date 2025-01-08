import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { dyeing_batch, dyeing_batch_entry, sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.insert(dyeing_batch_entry)
		.values(req.body)
		.returning({ insertedUuid: dyeing_batch_entry.uuid });

	try {
		const data = await batchEntryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.update(dyeing_batch_entry)
		.set(req.body)
		.where(eq(dyeing_batch_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: dyeing_batch_entry.uuid });

	try {
		const data = await batchEntryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.delete(dyeing_batch_entry)
		.where(eq(dyeing_batch_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: dyeing_batch_entry.uuid });

	try {
		const data = await batchEntryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: dyeing_batch_entry.uuid,
			dyeing_batch_uuid: dyeing_batch_entry.dyeing_batch_uuid,
			sfg_uuid: dyeing_batch_entry.sfg_uuid,
			quantity: decimalToNumber(dyeing_batch_entry.quantity),
			production_quantity: decimalToNumber(
				dyeing_batch_entry.production_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				dyeing_batch_entry.production_quantity_in_kg
			),
			created_at: dyeing_batch_entry.created_at,
			updated_at: dyeing_batch_entry.updated_at,
			remarks: dyeing_batch_entry.remarks,
		})
		.from(dyeing_batch_entry)
		.leftJoin(
			dyeing_batch,
			eq(dyeing_batch.uuid, dyeing_batch_entry.dyeing_batch_uuid)
		)
		.leftJoin(sfg, eq(sfg.uuid, dyeing_batch_entry.sfg_uuid))
		.orderBy(desc(dyeing_batch_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch entry',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchEntryPromise = db
		.select({
			uuid: dyeing_batch_entry.uuid,
			dyeing_batch_uuid: dyeing_batch_entry.dyeing_batch_uuid,
			sfg_uuid: dyeing_batch_entry.sfg_uuid,
			quantity: decimalToNumber(dyeing_batch_entry.quantity),
			production_quantity: decimalToNumber(
				dyeing_batch_entry.production_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				dyeing_batch_entry.production_quantity_in_kg
			),
			created_at: dyeing_batch_entry.created_at,
			updated_at: dyeing_batch_entry.updated_at,
			remarks: dyeing_batch_entry.remarks,
		})
		.from(dyeing_batch_entry)
		.leftJoin(
			dyeing_batch,
			eq(dyeing_batch.uuid, dyeing_batch_entry.dyeing_batch_uuid)
		)
		.leftJoin(sfg, eq(sfg.uuid, dyeing_batch_entry.sfg_uuid))
		.where(eq(dyeing_batch_entry.uuid, req.params.uuid));

	try {
		const data = await batchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBatchEntryByBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { dyeing_batch_uuid } = req.params;

	const query = sql`
		SELECT
			DISTINCT be.uuid as dyeing_batch_entry_uuid,
			bp_given.dyeing_batch_production_uuid,
			be.dyeing_batch_uuid,
			be.sfg_uuid,
			be.quantity::float8,
			be.production_quantity::float8,
			be.production_quantity_in_kg::float8,
			be.created_at,
			be.updated_at,
			be.remarks,
			oe.style,
			oe.color,
			oe.size,
			CASE 
				WHEN vodf.order_type = 'tape' THEN 'Meter' 
				WHEN vodf.order_type = 'slider' THEN 'Pcs'
				WHEN vodf.is_inch = 1 THEN 'Inch'
				ELSE 'CM' 
			END as unit,
			oe.quantity::float8 as order_quantity,
			oe.bleaching,
			vodf.order_number,
			vodf.item_description,
			bp_given.given_production_quantity::float8,
			bp_given.given_production_quantity_in_kg::float8,
			COALESCE(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 * 100 ELSE oe.quantity::float8 END - be_total.total_quantity, 0) as balance_quantity,
			COALESCE(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 * 100 ELSE oe.quantity::float8 END - be_total.total_quantity, 0) + be.quantity::float8 as max_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg,
			vodf.order_type,
			b.batch_type as batch_type,
			vodf.is_sample
		FROM
			zipper.dyeing_batch_entry be
		LEFT JOIN
			zipper.dyeing_batch b ON be.dyeing_batch_uuid = b.uuid
		LEFT JOIN 
			zipper.sfg sfg ON be.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
        LEFT JOIN
            zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
            public.properties op_item ON op_item.uuid = vodf.item
        LEFT JOIN 
            public.properties op_nylon_stopper ON op_nylon_stopper.uuid = vodf.nylon_stopper
        LEFT JOIN 
            public.properties op_zipper ON op_zipper.uuid = vodf.zipper_number
        LEFT JOIN 
            public.properties op_end ON op_end.uuid = vodf.end_type
        LEFT JOIN 
            public.properties op_puller ON op_puller.uuid = vodf.puller_type
        LEFT JOIN
            zipper.tape_coil_required tcr ON vodf.item = tcr.item_uuid 
				AND vodf.zipper_number = tcr.zipper_number_uuid 
				AND CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END 
        LEFT JOIN
			zipper.tape_coil tc ON tc.uuid = vodf.tape_coil_uuid
		LEFT JOIN
			(
				SELECT
					dyeing_batch_entry.uuid as dyeing_batch_entry_uuid,
					bp.uuid as dyeing_batch_production_uuid,
					SUM(bp.production_quantity::float8) AS given_production_quantity,
					SUM(bp.production_quantity_in_kg::float8) AS given_production_quantity_in_kg
				FROM
					zipper.dyeing_batch_production bp
				LEFT JOIN 
					zipper.dyeing_batch_entry ON bp.dyeing_batch_entry_uuid = dyeing_batch_entry.uuid
				GROUP BY
					dyeing_batch_entry.uuid, bp.uuid
			) AS bp_given ON be.uuid = bp_given.dyeing_batch_entry_uuid
		LEFT JOIN 
			(
				SELECT sfg.order_entry_uuid, SUM(be.quantity::float8) as total_quantity
				FROM zipper.dyeing_batch_entry be
				LEFT JOIN zipper.sfg ON be.sfg_uuid = sfg.uuid
				GROUP BY sfg.order_entry_uuid
			) AS be_total ON oe.uuid = be_total.order_entry_uuid
		WHERE 
			be.dyeing_batch_uuid = ${dyeing_batch_uuid}
			AND (
				 	lower(op_item.name) != 'nylon' 
					OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
				)`;

	const batchEntryPromise = db.execute(query);

	try {
		const data = await batchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch_entry By batch_entry_uuid',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetailsForBatchEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { batch_type, order_info_uuid, type } = req.query;

	const query = sql`
		SELECT
			DISTINCT sfg.uuid as sfg_uuid,
			sfg.recipe_uuid as recipe_uuid,
			concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0')) as recipe_id,
			oe.style,
			oe.color,
			vodf.order_type,
			oe.size,
			CASE 
				WHEN vodf.order_type = 'tape' THEN 'Meter' 
				WHEN vodf.order_type = 'slider' THEN 'Pcs'
				WHEN vodf.is_inch = 1 THEN 'Inch'
				ELSE 'CM' 
			END as unit,
			oe.quantity::float8 as order_quantity,
			oe.bleaching,
			vodf.order_number,
			vodf.item_description,
			coalesce(be_given.given_quantity, 0)::float8 as given_quantity,
			coalesce(be_given.given_production_quantity, 0)::float8 as given_production_quantity,
			coalesce(be_given.given_production_quantity_in_kg, 0)::float8 as given_production_quantity_in_kg,
			coalesce(
				CASE 
					WHEN vodf.order_type = 'tape' 
					THEN oe.size::float8 
					ELSE oe.quantity::float8 
				END
				- coalesce(be_given.given_quantity::float8,0)
			,0)::float8 as balance_quantity,
				coalesce(
				CASE 
					WHEN vodf.order_type = 'tape' 
					THEN oe.size::float8 
					ELSE oe.quantity::float8 
				END
				- coalesce(be_given.given_quantity::float8,0)
			,0)::float8 as max_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			0 as quantity,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg,
			${batch_type == 'extra' ? sql`'extra'` : sql`'normal'`} as batch_type,
			vodf.is_sample
		FROM
			zipper.sfg sfg
		LEFT JOIN 
			lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
        LEFT JOIN
            zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
        LEFT JOIN 
            public.properties op_item ON op_item.uuid = vodf.item
        LEFT JOIN 
            public.properties op_nylon_stopper ON op_nylon_stopper.uuid = vodf.nylon_stopper
        LEFT JOIN 
            public.properties op_zipper ON op_zipper.uuid = vodf.zipper_number
        LEFT JOIN 
            public.properties op_end ON op_end.uuid = vodf.end_type
        LEFT JOIN 
            public.properties op_puller ON op_puller.uuid = vodf.puller_type
        LEFT JOIN
            zipper.tape_coil_required tcr ON vodf.item = tcr.item_uuid 
				AND vodf.zipper_number = tcr.zipper_number_uuid 
				AND CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END 
        LEFT JOIN
			zipper.tape_coil tc ON tc.uuid = vodf.tape_coil_uuid AND tc.item_uuid = vodf.item AND tc.zipper_number_uuid = vodf.zipper_number
        LEFT JOIN
            (
				SELECT
					sfg.uuid as sfg_uuid,
					SUM(be.quantity::float8) AS given_quantity,
					SUM(be.production_quantity::float8) AS given_production_quantity,
					SUM(be.production_quantity_in_kg::float8) AS given_production_quantity_in_kg
				FROM
					zipper.dyeing_batch_entry be
				LEFT JOIN 
					zipper.sfg sfg ON be.sfg_uuid = sfg.uuid
				GROUP BY
					sfg.uuid
			) AS be_given ON sfg.uuid = be_given.sfg_uuid
        WHERE
			vodf.tape_coil_uuid IS NOT NULL AND 
				sfg.recipe_uuid IS NOT NULL  
				${
					batch_type == 'extra'
						? sql``
						: sql`
							AND (
								CASE 
									WHEN vodf.order_type = 'tape' 
									THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
									ELSE oe.quantity::float8 
								END 
								- coalesce(be_given.given_quantity,0)
									) > 0
							`
				}
				AND 
				(
					lower(op_item.name) != 'nylon' 
					OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
				) 
				${order_info_uuid ? sql`AND vodf.order_info_uuid = ${order_info_uuid}` : sql``}
				 ${
						type === 'sample'
							? sql` AND vodf.is_sample = 1`
							: type === 'bulk'
								? sql` AND vodf.is_sample = 0`
								: type === 'all'
									? sql``
									: sql``
					}
		`;

	// NOTE: vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END
	// NOTE: for tape order, specific end type is set to close_end

	// NOTE: CASE WHEN vodf.order_type = 'tape' THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 ELSE oe.quantity::float8 END

	const batchEntryPromise = db.execute(query);

	try {
		const data = await batchEntryPromise;

		const batch_data = { dyeing_batch_entry: data?.rows };

		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch_entry By batch_entry_uuid',
		};

		return res.status(200).json({ toast, data: batch_data });
	} catch (error) {
		await handleError({ error, res });
	}
}
