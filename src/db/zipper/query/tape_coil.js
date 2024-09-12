import { and, desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import zipper, { tape_coil } from '../schema.js';

const itemProperties = alias(publicSchema.properties, 'itemProperties');
const zipperNumberProperties = alias(
	publicSchema.properties,
	'zipperNumberProperties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.insert(tape_coil)
		.values(req.body)
		.returning({ insertedId: tape_coil.uuid });

	try {
		const data = await tapeCoilPromise;
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

	const tapeCoilPromise = db
		.update(tape_coil)
		.set(req.body)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning({ updatedId: tape_coil.uuid });

	try {
		const data = await tapeCoilPromise;
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

	const tapeCoilPromise = db
		.delete(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning({ deletedId: tape_coil.uuid });
	try {
		const data = await tapeCoilPromise;
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
			uuid: tape_coil.uuid,
			item_uuid: tape_coil.item_uuid,
			item_name: itemProperties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipperNumberProperties.name,
			name: tape_coil.name,
			is_import: tape_coil.is_import,
			is_reverse: tape_coil.is_reverse,
			top: tape_coil.top,
			bottom: tape_coil.bottom,
			raw_per_kg_meter: tape_coil.raw_per_kg_meter,
			dyed_per_kg_meter: tape_coil.dyed_per_kg_meter,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			quantity_in_coil: tape_coil.quantity_in_coil,
			created_by: tape_coil.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil.created_at,
			updated_at: tape_coil.updated_at,
			remarks: tape_coil.remarks,
		})
		.from(tape_coil)
		.leftJoin(hrSchema.users, eq(tape_coil.created_by, hrSchema.users.uuid))
		.leftJoin(itemProperties, eq(tape_coil.item_uuid, itemProperties.uuid))
		.leftJoin(
			zipperNumberProperties,
			eq(tape_coil.zipper_number_uuid, zipperNumberProperties.uuid)
		)
		.orderBy(tape_coil.created_at, desc);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_coil list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select()
		.from(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid));

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByNylon(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select()
		.from(tape_coil)
		.leftJoin(itemProperties, eq(tape_coil.item_uuid, itemProperties.uuid))
		.leftJoin(
			zipperNumberProperties,
			eq(tape_coil.zipper_number_uuid, zipperNumberProperties.uuid)
		)
		.where(
			or(
				eq(itemProperties.name, 'Nylon Metallic'),
				eq(itemProperties.name, 'Nylon Plastic')
			)
		);
	const toast = {
		status: 200,
		type: 'select',
		message: 'tape_coil',
	};
	handleResponse({ promise: tapeCoilPromise, res, next, ...toast });
}
