import { asc, desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import {
	order_description,
	order_entry,
	sfg,
	sfg_production,
} from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		order_description_uuid,
		style,
		color,
		size,
		quantity,
		company_price,
		party_price,
		status,
		swatch_status,
		swap_approval_date,
		created_by,
		created_at,
		remarks,
	} = req.body;

	const order_entryPromise = db
		.insert(order_entry)
		.values({
			uuid,
			order_description_uuid,
			style,
			color,
			size,
			quantity,
			company_price,
			party_price,
			status,
			swatch_status,
			swap_approval_date,
			created_by,
			created_at,
			remarks,
		})
		.returning({ insertedUuid: order_entry.uuid });

	try {
		const data = await order_entryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} added`,
		};

		res.status(201).send({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		order_description_uuid,
		style,
		color,
		size,
		quantity,
		company_price,
		party_price,
		status,
		swatch_status,
		swap_approval_date,
		created_by,
		created_at,
		updated_at,
		remarks,
	} = req.body;

	const order_entryPromise = db
		.update(order_entry)
		.set({
			order_description_uuid,
			style,
			color,
			size,
			quantity,
			company_price,
			party_price,
			status,
			swatch_status,
			swap_approval_date,
			created_by,
			created_at,
			updated_at,
			remarks,
		})
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: order_entry.uuid });

	try {
		const data = await order_entryPromise;

		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(200).send({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: order_entry.uuid });

	try {
		const data = await orderEntryPromise;

		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).send({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const order_entryPromise = db
		.select()
		.from(order_entry)
		.orderBy(desc(order_entry.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Order entry list',
	};

	handleResponse({
		promise: order_entryPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const order_entryPromise = db
		.select()
		.from(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid));

	try {
		const data = await order_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Entry',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderEntryFullByOrderDescriptionUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { order_description_uuid } = req.params;

	const orderEntryPromise = db
		.select({
			order_entry_uuid: order_entry.uuid,
			order_description_uuid: order_entry.order_description_uuid,
			style: order_entry.style,
			color: order_entry.color,
			size: order_entry.size,
			quantity: order_entry.quantity,
			company_price: order_entry.company_price,
			party_price: order_entry.party_price,
			order_entry_status: order_entry.status,
			swatch_status: order_entry.swatch_status,
			swatch_approval_date: order_entry.swatch_approval_date,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			teeth_molding_stock: sfg.teeth_molding_stock,
			teeth_molding_prod: sfg.teeth_molding_prod,
			dying_and_iron_prod: sfg.dying_and_iron_prod,
			total_teeth_molding: sql`SUM(
				CASE WHEN sfg_production.section = 'teeth_molding' THEN sfg_production.production_quantity ELSE 0 END
				)`,
			teeth_coloring_stock: sfg.teeth_coloring_stock,
			teeth_coloring_prod: sfg.teeth_coloring_prod,
			total_teeth_coloring: sql`SUM(
				CASE WHEN sfg_production.section = 'teeth_coloring' THEN sfg_production.production_quantity ELSE 0 END
				)`,
			finishing_stock: sfg.finishing_stock,
			finishing_prod: sfg.finishing_prod,
			total_finishing: sql`SUM(
				CASE WHEN sfg_production.section = 'finishing' THEN sfg_production.production_quantity ELSE 0 END
				)`,
			coloring_prod: sfg.coloring_prod,
		})
		.from(order_entry)
		.leftJoin(
			order_description,
			eq(order_entry.order_description_uuid, order_description.uuid)
		)
		.leftJoin(sfg, eq(order_entry.uuid, sfg.order_entry_uuid))
		.leftJoin(sfg_production, eq(sfg.uuid, sfg_production.sfg_uuid))
		.where(eq(order_description.uuid, order_description_uuid))
		.groupBy(order_entry.uuid, sfg.uuid)
		.orderBy(asc(order_entry.size));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Order Entry Full',
	};

	handleResponse({
		promise: orderEntryPromise,
		res,
		next,
		...toast,
	});
}
