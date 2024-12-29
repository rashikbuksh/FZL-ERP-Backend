import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
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

	try {
		const data = await finishingBatchEntryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch_entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
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
			coalesce(fbe_given.given_quantity::float8, 0) as given_quantity,
			coalesce(
				CASE 
					WHEN vodf.order_type = 'tape' 
					THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
					ELSE oe.quantity::float8 
				END 
				- coalesce(fbe_given.given_quantity::float8,0)
			,0) as balance_quantity,
			0 as quantity,
			coalesce(
				CASE 
					WHEN vodf.order_type = 'tape' 
					THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
					ELSE oe.quantity::float8 
				END 
				- coalesce(fbe_given.given_quantity::float8,0)
			,0) as max_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg,
			vodf.order_type,
			vodf.slider_provided
		FROM
			zipper.sfg sfg
		LEFT JOIN 
			lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
            zipper.multi_color_dashboard mcd ON oe.order_description_uuid = mcd.order_description_uuid
		LEFT JOIN
			zipper.tape_coil_required tcr ON vodf.item = tcr.item_uuid 
        	AND vodf.zipper_number = tcr.zipper_number_uuid 
			AND CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END 
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
		WHERE 
			CASE 
                WHEN vodf.order_type = 'slider' 
                THEN 1=1 
                WHEN (vodf.is_multi_color = 1 AND mcd.is_swatch_approved = 1)
                THEN 1=1
                ELSE sfg.recipe_uuid IS NOT NULL 
            END
		AND (
			CASE 
				WHEN vodf.order_type = 'tape' 
				THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
				ELSE oe.quantity::float8 
			END
			- coalesce(fbe_given.given_quantity,0)
			) > 0
		AND vodf.order_description_uuid = ${req.params.order_description_uuid}
		AND
	 	(
	 		lower(vodf.item_name) != 'nylon'
	 		OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
	 	)`;

	// AND coalesce(oe.quantity,0) - coalesce(fbe_given.given_quantity,0) > 0
	// AND
	// 	(
	// 		lower(vodf.item_name) != 'nylon'
	// 		OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
	// 	)

	// NOTE: vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END
	// NOTE: for tape order, specific end type is set to close_end

	// NOTE: CASE WHEN vodf.order_type = 'tape' THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 ELSE oe.quantity::float8 END

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

export async function selectMaxProductionQuantityForFinishingBatch(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { production_date } = req.query;

	const max_possible_quantity_query = sql`
			SELECT
				(SUM(finishing_batch_entry.quantity)::float8) as total_production,
				pc.quantity::float8 as production_capacity_quantity,
				pc.quantity::float8 - (SUM(finishing_batch_entry.quantity)::float8) as total_production_capacity
			FROM
				zipper.finishing_batch_entry
			LEFT JOIN
				zipper.finishing_batch ON finishing_batch_entry.finishing_batch_uuid = finishing_batch.uuid
			LEFT JOIN
				zipper.v_order_details_full vodf ON finishing_batch.order_description_uuid = vodf.order_description_uuid
			LEFT JOIN 
				public.production_capacity pc ON (
								vodf.item = pc.item 
								AND vodf.zipper_number = pc.zipper_number 
								AND vodf.end_type = pc.end_type
								AND (
									lower(vodf.item_name) != 'nylon' 
									OR vodf.nylon_stopper = pc.nylon_stopper
								))
			WHERE
				finishing_batch.production_date = ${production_date}::TIMESTAMP AND finishing_batch.order_description_uuid = ${req.params.order_description_uuid}
			GROUP BY
				finishing_batch.order_description_uuid, pc.quantity
`;

	try {
		const max_possible_quantity = await db.execute(
			max_possible_quantity_query
		);
		console.log(max_possible_quantity);

		const toast = {
			status: 200,
			type: 'select',
			message: 'Max Production Quantity',
		};

		return res.status(200).json({
			toast,
			data: max_possible_quantity.rows[0],
		});
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
			concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0')) as recipe_id,
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
			fbe.quantity::float8 as batch_quantity,
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
			sfg.warehouse::float8 as warehouse,
			fbe.created_by,
			users.name as created_by_name,
			fbe.created_at,
			fbe.updated_at,
			fbe.remarks,
			coalesce(
				(
					CASE 
						WHEN vodf.order_type = 'tape' 
						THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
						ELSE oe.quantity::float8 
					END 
					- coalesce(fbe_given.given_quantity::float8,0)
				)
			,0) as balance_quantity,
			coalesce(
				(
					CASE 
						WHEN vodf.order_type = 'tape' 
						THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
						ELSE oe.quantity::float8 
					END 
					- coalesce(fbe_given.given_quantity::float8,0)
				) + coalesce(fbe.quantity::float8,0)
			,0) as max_quantity
		FROM
			zipper.finishing_batch_entry fbe
		LEFT JOIN 
			zipper.sfg ON fbe.sfg_uuid = sfg.uuid
		LEFT JOIN 
			lab_dip.recipe ON sfg.recipe_uuid = recipe.uuid
		LEFT JOIN 
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN
			hr.users ON fbe.created_by = users.uuid
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

export async function selectFinishingBatchEntryBySection(req, res, next) {
	const { section } = req.params;

	const { item_name, nylon_stopper } = req.query;

	const query = sql`
		SELECT
			zfbe.uuid as finishing_batch_entry_uuid,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			sfg.uuid as sfg_uuid,
			sfg.order_entry_uuid as order_entry_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			vod.order_info_uuid,
			oe.order_description_uuid as order_description_uuid,
			oe.style as style,
			oe.color as color,
			oe.size,
			CASE 
				WHEN vod.order_type = 'tape' THEN 'Meter' 
				WHEN vod.order_type = 'slider' THEN 'Pcs'
				WHEN vod.is_inch = 1 THEN 'Inch'
				ELSE 'CM' 
			END as unit,
			concat(oe.style, '/', oe.color, '/', oe.size) as style_color_size,
			CASE 
				WHEN od.order_type = 'tape' 
				THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
				ELSE oe.quantity::float8 
			END as order_quantity,
			zfbe.quantity::float8 as batch_quantity,
			sfg.recipe_uuid as recipe_uuid,
			recipe.name as recipe_name,
			od.item,
			op_item.name as item_name,
			op_item.short_name as item_short_name,
			od.coloring_type,
			op_coloring_type.name as coloring_type_name,
			op_coloring_type.short_name as coloring_type_short_name,
			vod.nylon_stopper_name,
			zfb.slider_finishing_stock::float8 as slider_finishing_stock,
			sfg.dying_and_iron_prod::float8 as dying_and_iron_prod,
			zfbe.teeth_molding_prod::float8 as teeth_molding_prod,
			zfbe.teeth_coloring_stock::float8 as teeth_coloring_stock,
			zfbe.finishing_stock::float8 as finishing_stock,
			zfbe.finishing_prod::float8 as finishing_prod,
			sfg.warehouse::float8 as warehouse,
			sfg.delivered::float8 as delivered,
			sfg.pi::float8 as pi,
			sfg.short_quantity::float8 as short_quantity,
			sfg.reject_quantity::float8 as reject_quantity,
			sfg.remarks as remarks,
			CASE 
				WHEN lower(${item_name}) = 'vislon'
					THEN (zfbe.quantity - (
						COALESCE(zfbe.finishing_prod, 0)
					))::float8 
				WHEN ${section} = 'finishing_prod'
					THEN (zfbe.quantity - (
						COALESCE(zfbe.finishing_prod, 0)
					))::float8 
				WHEN ${section} = 'teeth_coloring_prod'
					THEN (zfbe.quantity - (
						COALESCE(zfbe.finishing_stock, 0) + 
						COALESCE(zfbe.finishing_prod, 0)
					))::float8
				WHEN ${section} = 'teeth_molding_prod'
					THEN (zfbe.quantity - (
						COALESCE(zfbe.teeth_molding_prod, 0) + 
						COALESCE(zfbe.teeth_coloring_stock, 0) + 
						COALESCE(zfbe.finishing_stock, 0) + 
						COALESCE(zfbe.finishing_prod, 0)
					))::float8
				ELSE (
					zfbe.quantity::float8 - COALESCE(sfg.warehouse, 0)::float8 - COALESCE(sfg.delivered, 0)::float8
				)::float8 END 
			as balance_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(trx_quantity)::float8 > 0 
							THEN SUM(trx_quantity)::float8
						ELSE SUM(trx_quantity_in_kg)::float8
					END
				FROM zipper.finishing_batch_transaction zfbt
				WHERE zfbt.finishing_batch_entry_uuid = zfbe.uuid AND zfbt.trx_from = ${section}
			), 0)::float8 as total_trx_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(production_quantity)::float8 > 0 
							THEN SUM(production_quantity)::float8
						ELSE SUM(production_quantity_in_kg)::float8
					END
				FROM zipper.finishing_batch_production zfbp
				WHERE zfbp.finishing_batch_entry_uuid = zfbe.uuid AND 
					CASE 
						WHEN ${section} = 'finishing_prod' 
							THEN zfbp.section = 'finishing' 
						WHEN ${section} = 'teeth_coloring_prod'
							THEN zfbp.section = 'teeth_coloring'
						WHEN ${section} = 'teeth_molding_prod'
							THEN zfbp.section = 'teeth_molding'
						ELSE zfbp.section = ${section} END
			), 0)::float8 as total_production_quantity,
			od.tape_transferred::float8,
			sfg.dyed_tape_used_in_kg::float8,
			COALESCE(od.tape_received,0)::float8 as tape_received,
			(COALESCE(od.tape_transferred,0) - COALESCE(sfg.dyed_tape_used_in_kg,0))::float8 as tape_stock,
			od.is_multi_color,
			od.order_type,
			vod.party_name,
			vod.buyer_name,
			vod.factory_name
		FROM
			zipper.finishing_batch_entry zfbe
			LEFT JOIN zipper.sfg sfg ON zfbe.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.finishing_batch zfb ON zfbe.finishing_batch_uuid = zfb.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
			LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid AND zfb.order_description_uuid = vod.order_description_uuid
			LEFT JOIN zipper.order_description od ON oe.order_description_uuid = od.uuid
			LEFT JOIN public.properties op_item ON od.item = op_item.uuid
			LEFT JOIN public.properties op_coloring_type ON od.coloring_type = op_coloring_type.uuid
			WHERE
				od.tape_coil_uuid IS NOT NULL
				${item_name ? sql`AND lower(op_item.name) = lower(${item_name})` : sql``}
				${nylon_stopper ? (nylon_stopper == 'plastic' ? sql`AND lower(vod.nylon_stopper_name) = 'plastic'` : sql`AND lower(vod.nylon_stopper_name) != 'plastic'`) : sql``}
			ORDER BY zfbe.created_at DESC
		`;

	const sfgPromise = db.execute(query);

	try {
		const data = await sfgPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch_entry list',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
