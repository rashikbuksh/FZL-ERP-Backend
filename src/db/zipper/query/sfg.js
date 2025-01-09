import { and, desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import { decimalToNumber } from '../../variables.js';
import { order_entry, sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const sfgPromise = db
		.insert(sfg)
		.values(req.body)
		.returning({ insertedId: sfg.uuid });

	try {
		const data = await sfgPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.update(sfg)
		.set(req.body)
		.where(eq(sfg.uuid, req.params.uuid))
		.returning({ updatedId: sfg.uuid });
	try {
		const data = await sfgPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.delete(sfg)
		.where(eq(sfg.uuid, req.params.uuid))
		.returning({ deletedId: sfg.uuid });
	try {
		const data = await sfgPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { recipe_uuid } = req.query;

	const resultPromise = db
		.select({
			uuid: sfg.uuid,
			order_entry_uuid: sfg.order_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: decimalToNumber(order_entry.quantity),
			recipe_uuid: sfg.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			dying_and_iron_prod: decimalToNumber(sfg.dying_and_iron_prod),
			teeth_molding_stock: decimalToNumber(sfg.teeth_molding_stock),
			teeth_molding_prod: decimalToNumber(sfg.teeth_molding_prod),
			teeth_coloring_stock: decimalToNumber(sfg.teeth_coloring_stock),
			teeth_coloring_prod: decimalToNumber(sfg.teeth_coloring_prod),
			finishing_stock: decimalToNumber(sfg.finishing_stock),
			finishing_prod: decimalToNumber(sfg.finishing_prod),
			coloring_prod: decimalToNumber(sfg.coloring_prod),
			warehouse: decimalToNumber(sfg.warehouse),
			delivered: decimalToNumber(sfg.delivered),
			pi: decimalToNumber(sfg.pi),
			short_quantity: decimalToNumber(sfg.short_quantity),
			reject_quantity: decimalToNumber(sfg.reject_quantity),
			remarks: sfg.remarks,
		})
		.from(sfg)
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			labDipSchema.recipe,
			eq(sfg.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.where(recipe_uuid === 'true' ? sql`sfg.recipe_uuid IS NOT NULL` : null)
		.orderBy(desc(sfg.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'sfg list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.select({
			uuid: sfg.uuid,
			order_entry_uuid: sfg.order_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: decimalToNumber(order_entry.quantity),
			recipe_uuid: sfg.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			dying_and_iron_prod: decimalToNumber(sfg.dying_and_iron_prod),
			teeth_molding_stock: decimalToNumber(sfg.teeth_molding_stock),
			teeth_molding_prod: decimalToNumber(sfg.teeth_molding_prod),
			teeth_coloring_stock: decimalToNumber(sfg.teeth_coloring_stock),
			teeth_coloring_prod: decimalToNumber(sfg.teeth_coloring_prod),
			finishing_stock: decimalToNumber(sfg.finishing_stock),
			finishing_prod: decimalToNumber(sfg.finishing_prod),
			coloring_prod: decimalToNumber(sfg.coloring_prod),
			warehouse: decimalToNumber(sfg.warehouse),
			delivered: decimalToNumber(sfg.delivered),
			pi: decimalToNumber(sfg.pi),
			short_quantity: decimalToNumber(sfg.short_quantity),
			reject_quantity: decimalToNumber(sfg.reject_quantity),
			remarks: sfg.remarks,
		})
		.from(sfg)
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			labDipSchema.recipe,
			eq(sfg.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.where(eq(sfg.uuid, req.params.uuid));

	try {
		const data = await sfgPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'sfg',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectSwatchInfo(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { type } = req.query;

	const query = sql`SELECT
					sfg.uuid as uuid,
					sfg.order_entry_uuid as order_entry_uuid,
					oe.order_description_uuid as order_description_uuid,
					od.order_info_uuid,
					oe.style as style,
					oe.color as color,
					od.is_inch,
					oe.size,
					CASE 
						WHEN vod.order_type = 'tape' THEN 'Meter' 
						WHEN vod.order_type = 'slider' THEN 'Pcs'
						WHEN vod.is_inch = 1 THEN 'Inch'
						ELSE 'CM' 
					END as unit,
					oe.bleaching,
					oe.quantity::float8 as quantity,
					sfg.recipe_uuid as recipe_uuid,
					recipe.name as recipe_name,
					sfg.remarks as remarks,
					vod.order_number as order_number,
					vod.item_description as item_description,
					vod.order_type,
					od.created_at,
					oe.swatch_approval_date
				FROM
					zipper.sfg sfg
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
					LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
					LEFT JOIN zipper.order_description od ON oe.order_description_uuid = od.uuid
				WHERE 
					od.order_type != 'slider' ${
						type === 'pending'
							? sql`AND sfg.recipe_uuid IS NULL`
							: type === 'completed'
								? sql`AND sfg.recipe_uuid IS NOT NULL`
								: sql``
					}
				ORDER BY 
					od.created_at DESC,
					sfg.recipe_uuid ASC`;

	const swatchPromise = db.execute(query);

	try {
		const data = await swatchPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'swatch info',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchBySfgUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.update(sfg)
		.set({ recipe_uuid: req.body.recipe_uuid })
		.where(eq(sfg.uuid, req.params.uuid))
		.returning({ updatedId: sfg.uuid });

	const query = sql`
			UPDATE zipper.order_entry
			SET swatch_approval_date = ${req.body.swatch_approval_date}
			FROM zipper.sfg
			WHERE order_entry.uuid = sfg.order_entry_uuid
			AND sfg.uuid = ${req.params.uuid}
			RETURNING order_entry.uuid AS updatedId;
		`;

	const orderEntryPromise = db.execute(query);

	try {
		const data = await sfgPromise;
		const data2 = await orderEntryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} - ${data2.rows[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectSfgBySection(req, res, next) {
	const { section } = req.params;

	const { item_name, nylon_stopper } = req.query;

	const query = sql`
		SELECT
			sfg.uuid as sfg_uuid,
			sfg.order_entry_uuid as order_entry_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			vod.order_info_uuid,
			vod.order_type,
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
			oe.quantity::float8 as order_quantity,
			sfg.recipe_uuid as recipe_uuid,
			recipe.name as recipe_name,
			od.item,
			op_item.name as item_name,
			op_item.short_name as item_short_name,
			od.coloring_type,
			op_coloring_type.name as coloring_type_name,
			op_coloring_type.short_name as coloring_type_short_name,
			od.slider_finishing_stock::float8,
			sfg.dying_and_iron_prod::float8 as dying_and_iron_prod,
			sfg.teeth_molding_stock::float8 as teeth_molding_stock,
			sfg.teeth_molding_prod::float8 as teeth_molding_prod,
			sfg.teeth_coloring_stock::float8 as teeth_coloring_stock,
			sfg.teeth_coloring_prod::float8 as teeth_coloring_prod,
			sfg.finishing_stock::float8 as finishing_stock,
			sfg.finishing_prod::float8 as finishing_prod,
			sfg.warehouse::float8 as warehouse,
			sfg.delivered::float8 as delivered,
			sfg.pi::float8 as pi,
			sfg.short_quantity::float8,
			sfg.reject_quantity::float8,
			sfg.remarks as remarks,
			CASE 
				WHEN lower(${item_name}) = 'vislon'
					THEN (oe.quantity - (
						COALESCE(sfg.finishing_prod, 0) + 
						COALESCE(sfg.warehouse, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8 
				WHEN ${section} = 'finishing_prod'
					THEN (oe.quantity - (
						COALESCE(sfg.finishing_prod, 0) + 
						COALESCE(sfg.warehouse, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8 
				WHEN ${section} = 'teeth_coloring_prod'
					THEN (oe.quantity - (
						COALESCE(sfg.teeth_coloring_prod, 0) +
						COALESCE(sfg.finishing_stock, 0) + 
						COALESCE(sfg.finishing_prod, 0) + 
						COALESCE(sfg.finishing_prod, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8
				WHEN ${section} = 'teeth_molding_prod'
					THEN (oe.quantity - (
						COALESCE(sfg.teeth_molding_prod, 0) + 
						COALESCE(sfg.teeth_coloring_stock, 0) + 
						COALESCE(sfg.teeth_coloring_prod, 0) + 
						COALESCE(sfg.finishing_stock, 0) + 
						COALESCE(sfg.finishing_prod, 0) + 
						COALESCE(sfg.warehouse, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8
				ELSE (oe.quantity - COALESCE(sfg.warehouse, 0) - COALESCE(sfg.delivered, 0))::float8 END 
			as balance_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(trx_quantity)::float8 > 0 
							THEN SUM(trx_quantity)::float8
						ELSE SUM(trx_quantity_in_kg)::float8
					END
				FROM zipper.sfg_transaction sfgt
				WHERE sfgt.sfg_uuid = sfg.uuid AND sfgt.trx_from = ${section}
			), 0)::float8 as total_trx_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(production_quantity)::float8 > 0 
							THEN SUM(production_quantity)::float8
						ELSE SUM(production_quantity_in_kg)::float8
					END
				FROM zipper.sfg_production sfgp
				WHERE sfgp.sfg_uuid = sfg.uuid AND 
					CASE 
						WHEN ${section} = 'finishing_prod' 
							THEN sfgp.section = 'finishing' 
						WHEN ${section} = 'teeth_coloring_prod'
							THEN sfgp.section = 'teeth_coloring'
						WHEN ${section} = 'teeth_molding_prod'
							THEN sfgp.section = 'teeth_molding'
						ELSE sfgp.section = ${section} END
			), 0)::float8 as total_production_quantity,
			od.tape_transferred,
			sfg.dyed_tape_used_in_kg,
			COALESCE(od.tape_received,0)::float8 as tape_received,
			COALESCE(od.tape_transferred,0)::float8 - COALESCE(sfg.dyed_tape_used_in_kg,0) as tape_stock,
			COALESCE(od.slider_finishing_stock,0)::float8 as slider_finishing_stock,
			od.is_multi_color
		FROM
			zipper.sfg sfg
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
			LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
			LEFT JOIN zipper.order_description od ON oe.order_description_uuid = od.uuid
			LEFT JOIN public.properties op_item ON od.item = op_item.uuid
			LEFT JOIN public.properties op_coloring_type ON od.coloring_type = op_coloring_type.uuid
			WHERE
				od.tape_coil_uuid IS NOT NULL
				${item_name ? sql`AND lower(op_item.name) = lower(${item_name})` : sql``}
				${nylon_stopper == 'plastic' ? sql`AND lower(vod.nylon_stopper_name) = 'plastic` : sql`AND lower(vod.nylon_stopper_name) != 'plastic`}
			ORDER BY oe.created_at DESC
		`;

	const sfgPromise = db.execute(query);

	try {
		const data = await sfgPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'sfg list',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
