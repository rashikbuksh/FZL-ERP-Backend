import { eq } from 'drizzle-orm';
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
