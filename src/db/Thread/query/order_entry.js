import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
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
			message: `${data[0].insertedId} inserted`,
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
		.returning({ updatedId: order_entry.uuid });

	try {
		const data = await resultPromise;

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
			shade_recipe_uuid: order_entry.shade_recipe_uuid,
			shade_recipe_name: labDipSchema.shade_recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: order_entry.quantity,
			company_price: order_entry.company_price,
			party_price: order_entry.party_price,
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: order_entry.production_quantity,
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.shade_recipe,
			eq(order_entry.shade_recipe_uuid, labDipSchema.shade_recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'order_entry list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			shade_recipe_uuid: order_entry.shade_recipe_uuid,
			shade_recipe_name: labDipSchema.shade_recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: order_entry.quantity,
			company_price: order_entry.company_price,
			party_price: order_entry.party_price,
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: order_entry.production_quantity,
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.shade_recipe,
			eq(order_entry.shade_recipe_uuid, labDipSchema.shade_recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.where(eq(order_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'order_entry detail',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
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
			shade_recipe_uuid: order_entry.shade_recipe_uuid,
			shade_recipe_name: labDipSchema.shade_recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: order_entry.quantity,
			company_price: order_entry.company_price,
			party_price: order_entry.party_price,
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: order_entry.production_quantity,
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.shade_recipe,
			eq(order_entry.shade_recipe_uuid, labDipSchema.shade_recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.where(eq(order_entry.order_info_uuid, req.params.order_info_uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'order_entry detail',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
