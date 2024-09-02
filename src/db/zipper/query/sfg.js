import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
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
			order_quantity: order_entry.quantity,
			recipe_uuid: sfg.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			dying_and_iron_prod: sfg.dying_and_iron_prod,
			teeth_molding_stock: sfg.teeth_molding_stock,
			teeth_molding_prod: sfg.teeth_molding_prod,
			teeth_coloring_stock: sfg.teeth_coloring_stock,
			teeth_coloring_prod: sfg.teeth_coloring_prod,
			finishing_stock: sfg.finishing_stock,
			finishing_prod: sfg.finishing_prod,
			coloring_prod: sfg.coloring_prod,
			warehouse: sfg.warehouse,
			delivered: sfg.delivered,
			pi: sfg.pi,
			remarks: sfg.remarks,
		})
		.from(sfg)
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			labDipSchema.recipe,
			eq(sfg.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.where(
			recipe_uuid === 'true' ? sql`sfg.recipe_uuid IS NOT NULL` : null
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'sfg list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgPromise = db
		.select({
			uuid: sfg.uuid,
			order_entry_uuid: sfg.order_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: order_entry.quantity,
			recipe_uuid: sfg.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			dying_and_iron_prod: sfg.dying_and_iron_prod,
			teeth_molding_stock: sfg.teeth_molding_stock,
			teeth_molding_prod: sfg.teeth_molding_prod,
			teeth_coloring_stock: sfg.teeth_coloring_stock,
			teeth_coloring_prod: sfg.teeth_coloring_prod,
			finishing_stock: sfg.finishing_stock,
			finishing_prod: sfg.finishing_prod,
			coloring_prod: sfg.coloring_prod,
			warehouse: sfg.warehouse,
			delivered: sfg.delivered,
			pi: sfg.pi,
			remarks: sfg.remarks,
		})
		.from(sfg)
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			labDipSchema.recipe,
			eq(sfg.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.where(eq(sfg.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'sfg',
	};

	handleResponse({ promise: sfgPromise, res, next, ...toast });
}

export async function selectSwatchInfo(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`SELECT
					sfg.uuid as uuid,
					sfg.order_entry_uuid as order_entry_uuid,
					oe.order_description_uuid as order_description_uuid,
					oe.style as style,
					oe.color as color,
					oe.size as size,
					oe.quantity as quantity,
					sfg.recipe_uuid as recipe_uuid,
					recipe.name as recipe_name,
					sfg.remarks as remarks,
					vod.order_number as order_number,
					vod.item_description as item_description
				FROM
					zipper.sfg sfg
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
					LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid`;

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

export async function selectSfgBySection(req, res, next) {
	const { section } = req.params;

	const { item_name, stopper_type } = req.query;

	const query = sql`
		SELECT
			sfg.uuid as sfg_uuid,
			sfg.order_entry_uuid as order_entry_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			vod.order_info_uuid,
			oe.order_description_uuid as order_description_uuid,
			oe.style as style,
			oe.color as color,
			oe.size as size,
			concat(oe.style, '/', oe.color, '/', oe.size) as style_color_size,
			oe.quantity as order_quantity,
			sfg.recipe_uuid as recipe_uuid,
			recipe.name as recipe_name,
			od.item,
			op_item.name as item_name,
			op_item.short_name as item_short_name,
			od.stopper_type,
			op_stopper_type.name as stopper_type_name,
			op_stopper_type.short_name as stopper_type_short_name,
			od.coloring_type,
			op_coloring_type.name as coloring_type_name,
			op_coloring_type.short_name as coloring_type_short_name,
			od.nylon_plastic_finishing,
			od.nylon_metallic_finishing,
			od.vislon_teeth_molding,
			od.metal_teeth_molding,
			sfg.dying_and_iron_prod as dying_and_iron_prod,
			sfg.teeth_molding_stock as teeth_molding_stock,
			sfg.teeth_molding_prod as teeth_molding_prod,
			sfg.teeth_coloring_stock as teeth_coloring_stock,
			sfg.teeth_coloring_prod as teeth_coloring_prod,
			sfg.finishing_stock as finishing_stock,
			sfg.finishing_prod as finishing_prod,
			sfg.warehouse as warehouse,
			sfg.delivered as delivered,
			sfg.pi as pi,
			sfg.remarks as remarks,
			(oe.quantity - COALESCE(sfg.delivered, 0)) as balance_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(trx_quantity) > 0 THEN SUM(trx_quantity)
						ELSE SUM(trx_quantity_in_kg)
					END
				FROM zipper.sfg_transaction sfgt
				WHERE sfgt.sfg_uuid = sfg.uuid AND sfgt.trx_from = ${section}
			), 0) as total_trx_quantity,
			COALESCE(ss.coloring_prod,0) as coloring_prod
		FROM
			zipper.sfg sfg
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
			LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
			LEFT JOIN zipper.order_description od ON oe.order_description_uuid = od.uuid
			LEFT JOIN public.properties op_item ON od.item = op_item.uuid
			LEFT JOIN public.properties op_stopper_type ON od.stopper_type = op_stopper_type.uuid
			LEFT JOIN public.properties op_coloring_type ON od.coloring_type = op_coloring_type.uuid
			LEFT JOIN slider.stock ss ON vod.order_info_uuid = ss.order_info_uuid
		`;
	// WHERE
	// sfg.recipe_uuid IS NOT NULL AND sfg.recipe_uuid != '' // * for development purpose

	if (item_name) {
		query.append(sql` WHERE lower(op_item.name) = lower(${item_name})`);
	}

	if (stopper_type) {
		query.append(
			sql` AND lower(op_stopper_type.name) = lower(${stopper_type})`
		);
	}

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
