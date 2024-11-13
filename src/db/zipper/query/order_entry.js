import { asc, desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as deliverySchema from '../../delivery/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import {
	finishing_batch_entry,
	finishing_batch_production,
	order_description,
	order_entry,
	sfg,
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
		bleaching,
		created_by,
		created_at,
		remarks,
		is_inch,
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
			bleaching,
			created_by,
			created_at,
			remarks,
			is_inch,
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
		bleaching,
		created_by,
		created_at,
		updated_at,
		remarks,
		is_inch,
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
			bleaching,
			created_by,
			created_at,
			updated_at,
			remarks,
			is_inch,
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

	try {
		const data = await order_entryPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Entry',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
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
			is_inch: order_entry.is_inch,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			order_entry_status: order_entry.status,
			swatch_status: order_entry.swatch_status,
			swatch_approval_date: order_entry.swatch_approval_date,
			bleaching: order_entry.bleaching,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			teeth_molding_stock: decimalToNumber(sfg.teeth_molding_stock),
			teeth_molding_prod: decimalToNumber(sfg.teeth_molding_prod),
			dying_and_iron_prod: decimalToNumber(sfg.dying_and_iron_prod),
			total_teeth_molding: sql`SUM(
				CASE WHEN finishing_batch_production.section = 'teeth_molding' THEN finishing_batch_production.production_quantity ELSE 0 END
				)::float8`,
			teeth_coloring_stock: decimalToNumber(sfg.teeth_coloring_stock),
			teeth_coloring_prod: decimalToNumber(sfg.teeth_coloring_prod),
			total_teeth_coloring: sql`SUM(
				CASE WHEN finishing_batch_production.section = 'teeth_coloring' THEN finishing_batch_production.production_quantity ELSE 0 END
				)::float8`,
			finishing_stock: decimalToNumber(sfg.finishing_stock),
			finishing_prod: decimalToNumber(sfg.finishing_prod),
			total_finishing: sql`SUM(
				CASE WHEN finishing_batch_production.section = 'finishing' THEN finishing_batch_production.production_quantity ELSE 0 END
				)::float8`,
			coloring_prod: decimalToNumber(sfg.coloring_prod),
			total_pi_quantity: decimalToNumber(sfg.pi),
			total_warehouse_quantity: sql`SUM(
				CASE WHEN packing_list.challan_uuid IS NULL THEN coalesce(packing_list_entry.quantity,0) ELSE 0 END
				)::float8`,
			total_delivery_quantity: sql`SUM(
				CASE WHEN packing_list.challan_uuid IS NOT NULL THEN coalesce(packing_list_entry.quantity,0) ELSE 0 END
				)::float8`,
			total_reject_quantity: decimalToNumber(sfg.reject_quantity),
			total_short_quantity: decimalToNumber(sfg.short_quantity),
		})
		.from(order_entry)
		.leftJoin(
			order_description,
			eq(order_entry.order_description_uuid, order_description.uuid)
		)
		.leftJoin(sfg, eq(order_entry.uuid, sfg.order_entry_uuid))
		.leftJoin(
			finishing_batch_entry,
			eq(sfg.uuid, finishing_batch_entry.sfg_uuid)
		)
		.leftJoin(
			finishing_batch_production,
			eq(
				finishing_batch_entry.uuid,
				finishing_batch_production.finishing_batch_entry_uuid
			)
		)
		.leftJoin(
			deliverySchema.packing_list_entry,
			eq(deliverySchema.packing_list_entry.sfg_uuid, sfg.uuid)
		)
		.leftJoin(
			deliverySchema.packing_list,
			eq(
				deliverySchema.packing_list.uuid,
				deliverySchema.packing_list_entry.packing_list_uuid
			)
		)
		.leftJoin(
			deliverySchema.challan,
			eq(
				deliverySchema.challan.uuid,
				deliverySchema.packing_list.challan_uuid
			)
		)
		.where(eq(order_description.uuid, order_description_uuid))
		.groupBy(order_entry.uuid, sfg.uuid)
		.orderBy(
			asc(order_entry.style),
			asc(order_entry.color),
			asc(order_entry.size)
		);

	try {
		const data = await orderEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Entry Full',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
