import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';

import { finishing_batch_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchEntryPromise = db
		.insert(finishing_batch_entry)
		.values(req.body)
		.returning({ insertedUuid: finishing_batch_entry.uuid });

	try {
		const data = await finishingBatchEntryPromise;

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

	const finishingBatchEntryPromise = db
		.update(finishing_batch_entry)
		.set(req.body)
		.where(eq(finishing_batch_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: finishing_batch_entry.uuid });

	try {
		const data = await finishingBatchEntryPromise;
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

	const finishingBatchEntryPromise = db
		.delete(finishing_batch_entry)
		.where(eq(finishing_batch_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: finishing_batch_entry.uuid });

	try {
		const data = await finishingBatchEntryPromise;
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
	const finishingBatchEntryPromise = db
		.select({
			uuid: finishing_batch_entry.uuid,
			finishing_batch_uuid: finishing_batch_entry.finishing_batch_uuid,
			sfg_uuid: finishing_batch_entry.sfg_uuid,
			quantity: decimalToNumber(finishing_batch_entry.quantity),
			dyed_tape_used_in_kg: decimalToNumber(
				finishing_batch_entry.dyed_tape_used_in_kg
			),
			teeth_molding_prod: decimalToNumber(
				finishing_batch_entry.teeth_molding_prod
			),
			teeth_coloring_stock: decimalToNumber(
				finishing_batch_entry.teeth_coloring_stock
			),
			finishing_stock: decimalToNumber(
				finishing_batch_entry.finishing_stock
			),
			finishing_prod: decimalToNumber(
				finishing_batch_entry.finishing_prod
			),
			warehouse: decimalToNumber(finishing_batch_entry.warehouse),
			created_by: finishing_batch_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_entry.created_at,
			updated_at: finishing_batch_entry.updated_at,
			remarks: finishing_batch_entry.remarks,
		})
		.from(finishing_batch_entry)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, finishing_batch_entry.created_by)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'finishing_batch_entry list',
	};

	handleResponse({
		promise: finishingBatchEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchEntryPromise = db
		.select({
			uuid: finishing_batch_entry.uuid,
			finishing_batch_uuid: finishing_batch_entry.finishing_batch_uuid,
			sfg_uuid: finishing_batch_entry.sfg_uuid,
			quantity: decimalToNumber(finishing_batch_entry.quantity),
			dyed_tape_used_in_kg: decimalToNumber(
				finishing_batch_entry.dyed_tape_used_in_kg
			),
			teeth_molding_prod: decimalToNumber(
				finishing_batch_entry.teeth_molding_prod
			),
			teeth_coloring_stock: decimalToNumber(
				finishing_batch_entry.teeth_coloring_stock
			),
			finishing_stock: decimalToNumber(
				finishing_batch_entry.finishing_stock
			),
			finishing_prod: decimalToNumber(
				finishing_batch_entry.finishing_prod
			),
			warehouse: decimalToNumber(finishing_batch_entry.warehouse),
			created_by: finishing_batch_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_entry.created_at,
			updated_at: finishing_batch_entry.updated_at,
			remarks: finishing_batch_entry.remarks,
		})
		.from(finishing_batch_entry)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, finishing_batch_entry.created_by)
		)
		.where(eq(finishing_batch_entry.uuid, req.params.uuid));

	try {
		const data = await finishingBatchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch_entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetailsForFinishingBatchEntry(req, res, next) {
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
			coalesce(fbe_given.given_quantity::float8, 0) as given_quantity,
			coalesce(
				coalesce(oe.quantity::float8,0) - coalesce(fbe_given.given_quantity::float8,0)
			,0) as balance_quantity,
			0 as quantity,
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
					SUM(fbe.quantity::float8) AS given_quantity
				FROM
					zipper.finishing_batch_entry fbe
				LEFT JOIN 
					zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
				GROUP BY
					sfg.uuid
			) AS fbe_given ON sfg.uuid = fbe_given.sfg_uuid
		WHERE sfg.recipe_uuid IS NOT NULL AND 
					coalesce(oe.quantity,0) - coalesce(fbe_given.given_quantity,0) > 0 AND
					(
						lower(vodf.item_name) != 'nylon' 
						OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
					)
				AND vodf.order_description_uuid = ${req.params.order_description_uuid}`;

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

export async function getFinishingBatchEntryByFinishingBatchUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			fbe.uuid as uuid,
			sfg.recipe_uuid as recipe_uuid,
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
			fbe.sfg_uuid,
			fbe.quantity::float8 as quantity,
			fbe.dyed_tape_used_in_kg::float8 as dyed_tape_used_in_kg,
			fbe.teeth_molding_prod::float8 as teeth_molding_prod,
			fbe.teeth_coloring_stock::float8 as teeth_coloring_stock,
			fbe.finishing_stock::float8 as finishing_stock,
			fbe.finishing_prod::float8 as finishing_prod,
			fbe.warehouse::float8 as warehouse,
			fbe.created_by,
			users.name as created_by_name,
			fbe.created_at,
			fbe.updated_at,
			fbe.remarks
		FROM
			zipper.finishing_batch_entry fbe
		LEFT JOIN 
			zipper.sfg ON fbe.sfg_uuid = sfg.uuid
		LEFT JOIN 
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN
			hr.users ON fbe.created_by = users.uuid
		WHERE
			fbe.finishing_batch_uuid = ${req.params.finishing_batch_uuid}
		ORDER BY
			fbe.created_at DESC`;

	const batchEntryPromise = db.execute(query);

	try {
		const data = await batchEntryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch_entry By finishing_batch_uuid',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
