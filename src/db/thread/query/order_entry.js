import { asc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import { decimalToNumber } from '../../variables.js';
import { count_length, order_entry, order_info } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(order_entry)
		.values(req.body)
		.returning({ insertedId: order_entry.uuid });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(order_entry)
		.set(req.body)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedId: order_entry.order_info_uuid });

	try {
		const data = await resultPromise;

		const order_info_number = db
			.select({
				updatedId: sql`concat('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			})
			.from(order_info)
			.where(eq(order_info.uuid, data[0].updatedId));

		const orderInfoNumber = await order_info_number;

		const toast = {
			status: 201,
			type: 'update',
			message: `${orderInfoNumber[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const resultPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ deletedId: order_entry.uuid });

	try {
		const data = await resultPromise;

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
			uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				order_entry.production_quantity
			),
			bleaching: order_entry.bleaching,
			transfer_quantity: decimalToNumber(order_entry.transfer_quantity),
			carton_quantity: decimalToNumber(order_entry.carton_quantity),
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
			pi: decimalToNumber(order_entry.pi),
			delivered: decimalToNumber(order_entry.delivered),
			warehouse: decimalToNumber(order_entry.warehouse),
			short_quantity: decimalToNumber(order_entry.short_quantity),
			reject_quantity: decimalToNumber(order_entry.reject_quantity),
			production_quantity_in_kg: decimalToNumber(
				order_entry.production_quantity_in_kg
			),
			carton_quantity: order_entry.carton_quantity,
			index: order_entry.index,
			damage_quantity: decimalToNumber(order_entry.damage_quantity),
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.orderBy(asc(order_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				order_entry.production_quantity
			),
			bleaching: order_entry.bleaching,
			transfer_quantity: decimalToNumber(order_entry.transfer_quantity),
			carton_quantity: decimalToNumber(order_entry.carton_quantity),
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
			pi: decimalToNumber(order_entry.pi),
			delivered: decimalToNumber(order_entry.delivered),
			warehouse: decimalToNumber(order_entry.warehouse),
			short_quantity: decimalToNumber(order_entry.short_quantity),
			reject_quantity: decimalToNumber(order_entry.reject_quantity),
			production_quantity_in_kg: decimalToNumber(
				order_entry.production_quantity_in_kg
			),
			carton_quantity: order_entry.carton_quantity,
			index: order_entry.index,
			damage_quantity: decimalToNumber(order_entry.damage_quantity),
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.where(eq(order_entry.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry',
		};
		return await res.status(201).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderEntryByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: order_entry.uuid,
			order_entry_uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			max_weight: count_length.max_weight,
			min_weight: count_length.min_weight,
			cone_per_carton: count_length.cone_per_carton,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				order_entry.production_quantity
			),
			bleaching: order_entry.bleaching,
			transfer_quantity: decimalToNumber(order_entry.transfer_quantity),
			carton_quantity: decimalToNumber(order_entry.carton_quantity),
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
			pi: decimalToNumber(order_entry.pi),
			delivered: decimalToNumber(order_entry.delivered),
			warehouse: decimalToNumber(order_entry.warehouse),
			short_quantity: decimalToNumber(order_entry.short_quantity),
			reject_quantity: decimalToNumber(order_entry.reject_quantity),
			production_quantity_in_kg: decimalToNumber(
				order_entry.production_quantity_in_kg
			),
			carton_quantity: order_entry.carton_quantity,
			index: order_entry.index,
			damage_quantity: decimalToNumber(order_entry.damage_quantity),
			batch_quantity: decimalToNumber(
				sql`COALESCE(batch.total_batch_quantity, 0)`
			),
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.leftJoin(
			sql`
				(
					SELECT 
						batch_entry.order_entry_uuid,
						SUM(batch_entry.quantity) AS total_batch_quantity
					FROM thread.batch_entry
					GROUP BY batch_entry.order_entry_uuid
				) AS batch
			`,
			sql`batch.order_entry_uuid = order_entry.uuid`
		)
		.where(eq(order_entry.order_info_uuid, req.params.order_info_uuid))
		.orderBy(asc(order_entry.index));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
