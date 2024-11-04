import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { dyeing_batch_entry, sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyeingBatchEntryPromise = db
		.insert(dyeing_batch_entry)
		.values(req.body)
		.returning({ insertedUuid: dyeing_batch_entry.uuid });

	try {
		const data = await dyeingBatchEntryPromise;

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

	const dyeingBatchEntryPromise = db
		.update(dyeing_batch_entry)
		.set(req.body)
		.where(eq(dyeing_batch_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: dyeing_batch_entry.uuid });

	try {
		const data = await dyeingBatchEntryPromise;
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

	const dyeingBatchEntryPromise = db
		.delete(dyeing_batch_entry)
		.where(eq(dyeing_batch_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: dyeing_batch_entry.uuid });

	try {
		const data = await dyeingBatchEntryPromise;
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
		.leftJoin(batch, eq(batch.uuid, dyeing_batch_entry.batch_uuid))
		.leftJoin(sfg, eq(sfg.uuid, dyeing_batch_entry.sfg_uuid))
		.orderBy(desc(dyeing_batch_entry.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'batch entry list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyeingBatchEntryPromise = db
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
		.leftJoin(batch, eq(batch.uuid, dyeing_batch_entry.batch_uuid))
		.leftJoin(sfg, eq(sfg.uuid, dyeing_batch_entry.sfg_uuid))
		.where(eq(dyeing_batch_entry.uuid, req.params.uuid));

	try {
		const data = await dyeingBatchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBatchEntryByBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { batch_uuid } = req.params;

	const query = sql`
		SELECT
			be.uuid as dyeing_batch_entry_uuid,
			bp_given.batch_production_uuid,
			be.batch_uuid,
			be.sfg_uuid,
			be.quantity::float8,
			be.production_quantity::float8,
			be.production_quantity_in_kg::float8,
			be.created_at,
			be.updated_at,
			be.remarks as batch_remarks,
			oe.style,
			oe.color,
			CASE 
                WHEN vodf.is_inch = 1 
					THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
				ELSE CAST(oe.size AS NUMERIC)
            END as size,
			oe.quantity::float8 as order_quantity,
			vodf.order_number,
			vodf.item_description,
			bp_given.given_production_quantity::float8,
			bp_given.given_production_quantity_in_kg::float8,
			COALESCE(oe.quantity::float8 - be.quantity::float8,0) as balance_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg
		FROM
			zipper.dyeing_batch_entry be
		LEFT JOIN
			zipper.batch b ON be.batch_uuid = b.uuid
		LEFT JOIN 
			zipper.sfg sfg ON be.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			zipper.tape_coil_required tcr ON oe.order_description_uuid = vodf.order_description_uuid AND vodf.item = tcr.item_uuid 
        AND vodf.zipper_number = tcr.zipper_number_uuid 
        AND vodf.end_type = tcr.end_type_uuid 
		LEFT JOIN
			zipper.tape_coil tc ON  vodf.tape_coil_uuid = tc.uuid AND vodf.item = tc.item_uuid 
		AND vodf.zipper_number = tc.zipper_number_uuid 
		LEFT JOIN
			(
				SELECT
					dyeing_batch_entry.uuid as dyeing_batch_entry_uuid,
					bp.uuid as batch_production_uuid,
					SUM(bp.production_quantity::float8) AS given_production_quantity,
					SUM(bp.production_quantity_in_kg::float8) AS given_production_quantity_in_kg
				FROM
					zipper.batch_production bp
				LEFT JOIN 
					zipper.dyeing_batch_entry ON bp.dyeing_batch_entry_uuid = dyeing_batch_entry.uuid
				GROUP BY
					dyeing_batch_entry.uuid, bp.uuid
			) AS bp_given ON be.uuid = bp_given.dyeing_batch_entry_uuid
		WHERE
			be.batch_uuid = ${batch_uuid} AND CASE WHEN lower(vodf.item_name) = 'nylon' THEN vodf.nylon_stopper = tcr.nylon_stopper_uuid ELSE TRUE END`;

	const dyeingBatchEntryPromise = db.execute(query);

	try {
		const data = await dyeingBatchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch_entry By dyeing_batch_entry_uuid',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetailsForBatchEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			sfg.uuid as sfg_uuid,
			sfg.recipe_uuid as recipe_uuid,
			concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0')) as recipe_id,
			oe.style,
			oe.color,
			CASE 
                WHEN vodf.is_inch = 1 
					THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                ELSE CAST(oe.size AS NUMERIC)
            END as size,
			oe.quantity::float8 as order_quantity,
			oe.bleaching,
			vodf.order_number,
			vodf.item_description,
			be_given.given_quantity::float8,
			be_given.given_production_quantity::float8,
			be_given.given_production_quantity_in_kg::float8,
			coalesce(
				coalesce(oe.quantity::float8,0) - coalesce(be_given.given_quantity::float8,0)
			,0) as balance_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg
		FROM
			zipper.sfg sfg
		LEFT JOIN 
			lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN
			zipper.tape_coil_required tcr ON oe.order_description_uuid = vodf.order_description_uuid 
		AND vodf.item = tcr.item_uuid 
        AND vodf.zipper_number = tcr.zipper_number_uuid 
        AND vodf.end_type = tcr.end_type_uuid 
		LEFT JOIN
			zipper.tape_coil tc ON  vodf.tape_coil_uuid = tc.uuid AND vodf.item = tc.item_uuid 
		AND vodf.zipper_number = tc.zipper_number_uuid 
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
				sfg.recipe_uuid IS NOT NULL AND 
					coalesce(oe.quantity,0) - coalesce(be_given.given_quantity,0) > 0 AND
					(
						lower(vodf.item_name) != 'nylon' 
						OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
					) `;

	const dyeingBatchEntryPromise = db.execute(query);

	try {
		const data = await dyeingBatchEntryPromise;

		const batch_data = { dyeing_batch_entry: data?.rows };

		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch_entry By dyeing_batch_entry_uuid',
		};

		return res.status(200).json({ toast, data: batch_data });
	} catch (error) {
		await handleError({ error, res });
	}
}
