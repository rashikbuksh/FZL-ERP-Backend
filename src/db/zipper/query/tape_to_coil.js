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
import { tape_coil, tape_to_coil } from '../schema.js';

const item_properties = alias(publicSchema.properties, 'item_properties');
const zipper_number_properties = alias(
	publicSchema.properties,
	'zipper_number_properties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.insert(tape_to_coil)
		.values(req.body)
		.returning({ insertedId: tape_to_coil.uuid });

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
		.update(tape_to_coil)
		.set(req.body)
		.where(eq(tape_to_coil.uuid, req.params.uuid))
		.returning({ updatedId: tape_to_coil.uuid });

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
		.delete(tape_to_coil)
		.where(eq(tape_to_coil.uuid, req.params.uuid))
		.returning({ deletedId: tape_to_coil.uuid });
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
			uuid: tape_to_coil.uuid,
			tape_coil_uuid: tape_to_coil.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			quantity_in_coil: tape_coil.quantity_in_coil,
			to_section: tape_to_coil.to_section,
			trx_quantity: tape_to_coil.trx_quantity,
			created_by: tape_to_coil.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_to_coil.created_at,
			updated_at: tape_to_coil.updated_at,
			remarks: tape_to_coil.remarks,
		})
		.from(tape_to_coil)
		.leftJoin(tape_coil, eq(tape_to_coil.tape_coil_uuid, tape_coil.uuid))
		.leftJoin(
			hrSchema.users,
			eq(tape_to_coil.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.orderBy(desc(tape_to_coil.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_to_coil list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeToCoilPromise = db
		.select({
			uuid: tape_to_coil.uuid,
			tape_coil_uuid: tape_to_coil.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			quantity_in_coil: tape_coil.quantity_in_coil,
			to_section: tape_to_coil.to_section,
			trx_quantity: tape_to_coil.trx_quantity,
			created_by: tape_to_coil.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_to_coil.created_at,
			updated_at: tape_to_coil.updated_at,
			remarks: tape_to_coil.remarks,
		})
		.from(tape_to_coil)
		.leftJoin(tape_coil, eq(tape_to_coil.tape_coil_uuid, tape_coil.uuid))
		.leftJoin(
			hrSchema.users,
			eq(tape_to_coil.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(eq(tape_to_coil.uuid, req.params.uuid));

	try {
		const data = await tapeToCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_to_coil',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
