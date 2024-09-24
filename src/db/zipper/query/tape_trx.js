import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { tape_coil, tape_trx } from '../schema.js';

const item_properties = alias(publicSchema.properties, 'item_properties');
const zipper_number_properties = alias(
	publicSchema.properties,
	'zipper_number_properties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.insert(tape_trx)
		.values(req.body)
		.returning({ insertedId: tape_trx.uuid });

	try {
		const data = await tapeToCoilPromise;
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

	const tapeToCoilPromise = db
		.update(tape_trx)
		.set(req.body)
		.where(eq(tape_trx.uuid, req.params.uuid))
		.returning({ updatedId: tape_trx.uuid });

	try {
		const data = await tapeToCoilPromise;
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

	const tapeToCoilPromise = db
		.delete(tape_trx)
		.where(eq(tape_trx.uuid, req.params.uuid))
		.returning({ deletedId: tape_trx.uuid });
	try {
		const data = await tapeToCoilPromise;
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
			uuid: tape_trx.uuid,
			tape_coil_uuid: tape_trx.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			trx_quantity_in_dying: tape_coil.trx_quantity_in_dying,
			quantity_in_coil: tape_coil.quantity_in_coil,
			to_section: tape_trx.to_section,
			trx_quantity: tape_trx.trx_quantity,
			created_by: tape_trx.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_trx.created_at,
			updated_at: tape_trx.updated_at,
			remarks: tape_trx.remarks,
		})
		.from(tape_trx)
		.leftJoin(tape_coil, eq(tape_trx.tape_coil_uuid, tape_coil.uuid))
		.leftJoin(hrSchema.users, eq(tape_trx.created_by, hrSchema.users.uuid))
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.orderBy(desc(tape_trx.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_trx list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.select({
			uuid: tape_trx.uuid,
			tape_coil_uuid: tape_trx.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			trx_quantity_in_dying: tape_coil.trx_quantity_in_dying,
			quantity_in_coil: tape_coil.quantity_in_coil,
			to_section: tape_trx.to_section,
			trx_quantity: tape_trx.trx_quantity,
			created_by: tape_trx.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_trx.created_at,
			updated_at: tape_trx.updated_at,
			remarks: tape_trx.remarks,
		})
		.from(tape_trx)
		.leftJoin(tape_coil, eq(tape_trx.tape_coil_uuid, tape_coil.uuid))
		.leftJoin(hrSchema.users, eq(tape_trx.created_by, hrSchema.users.uuid))
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(eq(tape_trx.uuid, req.params.uuid));

	try {
		const data = await tapeToCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_trx',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBySection(req, res, next) {
	const { section } = req.params;

	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.select({
			uuid: tape_trx.uuid,
			tape_coil_uuid: tape_trx.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			trx_quantity_in_dying: tape_coil.trx_quantity_in_dying,
			quantity_in_coil: tape_coil.quantity_in_coil,
			to_section: tape_trx.to_section,
			trx_quantity: tape_trx.trx_quantity,
			created_by: tape_trx.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_trx.created_at,
			updated_at: tape_trx.updated_at,
			remarks: tape_trx.remarks,
		})
		.from(tape_trx)
		.leftJoin(tape_coil, eq(tape_trx.tape_coil_uuid, tape_coil.uuid))
		.leftJoin(hrSchema.users, eq(tape_trx.created_by, hrSchema.users.uuid))
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(
			section.toLowerCase() === 'tape'
				? sql`LOWER(${item_properties.name}) != 'nylon' OR (LOWER(${item_properties.name}) = 'nylon' AND LOWER(${tape_trx.to_section}) = 'coil')`
				: section.toLowerCase() === 'coil'
					? sql`(LOWER(${item_properties.name}) = 'nylon' AND LOWER(${tape_trx.to_section}) != 'coil')`
					: sql`true`
		);
	try {
		const data = await tapeToCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_trx',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
