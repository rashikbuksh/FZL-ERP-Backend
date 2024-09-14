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
import { tape_coil, tape_coil_production } from '../schema.js';

const item_properties = alias(publicSchema.properties, 'item_properties');
const zipper_number_properties = alias(
	publicSchema.properties,
	'zipper_number_properties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.insert(tape_coil_production)
		.values(req.body)
		.returning({ insertedSection: tape_coil_production.section });

	try {
		const data = await tapeCoilProductionPromise;
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

	const tapeCoilProductionPromise = db
		.update(tape_coil_production)
		.set(req.body)
		.where(eq(tape_coil_production.uuid, req.params.uuid))
		.returning({ updatedSection: tape_coil_production.section });

	try {
		const data = await tapeCoilProductionPromise;
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

	const tapeCoilProductionPromise = db
		.delete(tape_coil_production)
		.where(eq(tape_coil_production.uuid, req.params.uuid))
		.returning({ deletedSection: tape_coil_production.section });
	try {
		const data = await tapeCoilProductionPromise;
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
			uuid: tape_coil_production.uuid,
			section: tape_coil_production.section,
			tape_coil_uuid: tape_coil_production.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			quantity_in_coil: tape_coil.quantity_in_coil,
			production_quantity: tape_coil_production.production_quantity,
			wastage: tape_coil_production.wastage,
			created_by: tape_coil_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_production.created_at,
			updated_at: tape_coil_production.updated_at,
			remarks: tape_coil_production.remarks,
		})
		.from(tape_coil_production)
		.leftJoin(
			tape_coil,
			eq(tape_coil_production.tape_coil_uuid, tape_coil.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(tape_coil_production.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.orderBy(desc(tape_coil_production.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_coil_production list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.select({
			uuid: tape_coil_production.uuid,
			section: tape_coil_production.section,
			tape_coil_uuid: tape_coil_production.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			quantity_in_coil: tape_coil.quantity_in_coil,
			production_quantity: tape_coil_production.production_quantity,
			wastage: tape_coil_production.wastage,
			created_by: tape_coil_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_production.created_at,
			updated_at: tape_coil_production.updated_at,
			remarks: tape_coil_production.remarks,
		})
		.from(tape_coil_production)
		.leftJoin(
			tape_coil,
			eq(tape_coil_production.tape_coil_uuid, tape_coil.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(tape_coil_production.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(eq(tape_coil_production.uuid, req.params.uuid));

	try {
		const data = await tapeCoilProductionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_production',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectTapeCoilProductionBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.select({
			uuid: tape_coil_production.uuid,
			section: tape_coil_production.section,
			tape_coil_uuid: tape_coil_production.tape_coil_uuid,
			name: tape_coil.name,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			quantity: tape_coil.quantity,
			trx_quantity_in_coil: tape_coil.trx_quantity_in_coil,
			quantity_in_coil: tape_coil.quantity_in_coil,
			production_quantity: tape_coil_production.production_quantity,
			wastage: tape_coil_production.wastage,
			created_by: tape_coil_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_production.created_at,
			updated_at: tape_coil_production.updated_at,
			remarks: tape_coil_production.remarks,
		})
		.from(tape_coil_production)
		.leftJoin(
			tape_coil,
			eq(tape_coil_production.tape_coil_uuid, tape_coil.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(tape_coil_production.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(eq(tape_coil_production.section, req.params.section))
		.orderBy(desc(tape_coil_production.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: `tape_coil_production of ${req.params.section}`,
	};
	handleResponse({ promise: tapeCoilProductionPromise, res, next, ...toast });
}
