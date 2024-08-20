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

	console.log(req.query, 'req.query');

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
		.where(recipe_uuid == 'true' ? sql`sfg.recipe_uuid IS NOT NULL` : null);

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
