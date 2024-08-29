import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { sfg_production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.insert(sfg_production)
		.values(req.body)
		.returning({ insertedSection: sfg_production.section });
	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedSection} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.update(sfg_production)
		.set(req.body)
		.where(eq(sfg_production.uuid, req.params.uuid))
		.returning({ updatedSection: sfg_production.section });

	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedSection} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.delete(sfg_production)
		.where(eq(sfg_production.uuid, req.params.uuid))
		.returning({ deletedSection: sfg_production.section });
	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedSection} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: sfg_production.uuid,
			sfg_uuid: sfg_production.sfg_uuid,
			section: sfg_production.section,
			production_quantity_in_kg: sfg_production.production_quantity_in_kg,
			production_quantity: sfg_production.production_quantity,
			wastage: sfg_production.wastage,
			created_by: sfg_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: sfg_production.created_at,
			updated_at: sfg_production.updated_at,
			remarks: sfg_production.remarks,
		})
		.from(sfg_production)
		.leftJoin(
			hrSchema.users,
			eq(sfg_production.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'SFG Production list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.select({
			uuid: sfg_production.uuid,
			sfg_uuid: sfg_production.sfg_uuid,
			section: sfg_production.section,
			production_quantity_in_kg: sfg_production.production_quantity_in_kg,
			production_quantity: sfg_production.production_quantity,
			wastage: sfg_production.wastage,
			created_by: sfg_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: sfg_production.created_at,
			updated_at: sfg_production.updated_at,
			remarks: sfg_production.remarks,
		})
		.from(sfg_production)
		.leftJoin(
			hrSchema.users,
			eq(sfg_production.created_by, hrSchema.users.uuid)
		)
		.where(eq(sfg_production.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'SFG Production',
	};
	handleResponse({
		promise: sfgProductionPromise,
		res,
		next,
		...toast,
	});
}

export async function selectBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_name } = req.query;

	const query = sql`
		SELECT
			sfg_production.uuid,
			sfg_production.sfg_uuid,
			vodf.order_description_uuid,
			vodf.order_number,
			vodf.item_description,
			concat(oe.style, '-', oe.color, '-', oe.size) AS style_color_size,
			oe.quantity as order_quantity,
			sfg_production.section,
			sfg_production.production_quantity_in_kg,
			sfg_production.production_quantity,
			sfg_production.wastage,
			sfg_production.created_by,
			users.name AS created_by_name,
			sfg_production.created_at,
			sfg_production.updated_at,
			sfg_production.remarks
		FROM
			zipper.sfg_production
		LEFT JOIN
			hr.users ON sfg_production.created_by = users.uuid
		LEFT JOIN
			zipper.sfg ON sfg_production.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		WHERE
			lower(vodf.item_name) = lower(${item_name}) AND
			sfg_production.section = ${req.params.section}
	`;

	const sfgProductionPromise = db.execute(query);

	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'SFG Production',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
