import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { tape_coil_required } from '../schema.js';
const endTypeProperties = alias(publicSchema.properties, 'endTypeProperties');
const itemProperties = alias(publicSchema.properties, 'itemProperties');
const nylonStopperProperties = alias(
	publicSchema.properties,
	'nylonStopperProperties'
);
const zipperNumberProperties = alias(
	publicSchema.properties,
	'zipperNumberProperties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilRequiredPromise = db
		.insert(tape_coil_required)
		.values(req.body)
		.returning({ insertedId: tape_coil_required.uuid });

	try {
		const data = await tapeCoilRequiredPromise;
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

	const tapeCoilRequiredPromise = db
		.update(tape_coil_required)
		.set(req.body)
		.where(eq(tape_coil_required.uuid, req.params.uuid))
		.returning({ updatedId: tape_coil_required.uuid });

	try {
		const data = await tapeCoilRequiredPromise;
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
	const tapeCoilRequiredPromise = db
		.delete(tape_coil_required)
		.where(eq(tape_coil_required.uuid, req.params.uuid));

	try {
		const data = await tapeCoilRequiredPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const tapeCoilRequiredPromise = db
		.select({
			uuid: tape_coil_required.uuid,
			end_type_uuid: tape_coil_required.end_type_uuid,
			end_type_name: endTypeProperties.name,
			item_uuid: tape_coil_required.item_uuid,
			item_name: itemProperties.name,
			nylon_stopper_uuid: tape_coil_required.nylon_stopper_uuid,
			nylon_stopper_name: nylonStopperProperties.name,
			zipper_number_uuid: tape_coil_required.zipper_number_uuid,
			zipper_number_name: zipperNumberProperties.name,
			top: tape_coil_required.top,
			bottom: tape_coil_required.bottom,
			raw_mtr_per_kg: tape_coil_required.raw_mtr_per_kg,
			dyed_mtr_per_kg: tape_coil_required.dyed_mtr_per_kg,
			created_by: tape_coil_required.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_required.created_at,
			updated_at: tape_coil_required.updated_at,
			remarks: tape_coil_required.remarks,
		})
		.from(tape_coil_required)
		.leftJoin(
			hrSchema.users,
			eq(tape_coil_required.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			endTypeProperties,
			eq(tape_coil_required.end_type_uuid, endTypeProperties.uuid)
		)
		.leftJoin(
			itemProperties,
			eq(tape_coil_required.item_uuid, itemProperties.uuid)
		)
		.leftJoin(
			nylonStopperProperties,
			eq(
				tape_coil_required.nylon_stopper_uuid,
				nylonStopperProperties.uuid
			)
		)
		.leftJoin(
			zipperNumberProperties,
			eq(
				tape_coil_required.zipper_number_uuid,
				zipperNumberProperties.uuid
			)
		)

		.orderBy(desc(tape_coil_required.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_coil_required list',
	};

	handleResponse({ promise: tapeCoilRequiredPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const tapeCoilRequiredPromise = db
		.select({
			uuid: tape_coil_required.uuid,
			end_type_uuid: tape_coil_required.end_type_uuid,
			end_type_name: endTypeProperties.name,
			item_uuid: tape_coil_required.item_uuid,
			item_name: itemProperties.name,
			nylon_stopper_uuid: tape_coil_required.nylon_stopper_uuid,
			nylon_stopper_name: nylonStopperProperties.name,
			zipper_number_uuid: tape_coil_required.zipper_number_uuid,
			zipper_number_name: zipperNumberProperties.name,
			top: tape_coil_required.top,
			bottom: tape_coil_required.bottom,
			raw_mtr_per_kg: tape_coil_required.raw_mtr_per_kg,
			dyed_mtr_per_kg: tape_coil_required.dyed_mtr_per_kg,
			created_by: tape_coil_required.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_required.created_at,
			updated_at: tape_coil_required.updated_at,
			remarks: tape_coil_required.remarks,
		})
		.from(tape_coil_required)
		.leftJoin(
			hrSchema.users,
			eq(tape_coil_required.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			endTypeProperties,
			eq(tape_coil_required.end_type_uuid, endTypeProperties.uuid)
		)
		.leftJoin(
			itemProperties,
			eq(tape_coil_required.item_uuid, itemProperties.uuid)
		)
		.leftJoin(
			nylonStopperProperties,
			eq(
				tape_coil_required.nylon_stopper_uuid,
				nylonStopperProperties.uuid
			)
		)
		.leftJoin(
			zipperNumberProperties,
			eq(
				tape_coil_required.zipper_number_uuid,
				zipperNumberProperties.uuid
			)
		)
		.where(eq(tape_coil_required.uuid, req.params.uuid))
		.orderBy(desc(tape_coil_required.created_at));

	try {
		const data = await tapeCoilRequiredPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_required detail',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
