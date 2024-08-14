import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { tape_coil, tape_coil_production } from '../schema.js';

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
			type: tape_coil.type,
			zipper_number: tape_coil.zipper_number,
			type_of_zipper: sql`CONCAT(tape_coil.type, ' - ', tape_coil.zipper_number)`,
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
		);

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
			type: tape_coil.type,
			zipper_number: tape_coil.zipper_number,
			type_of_zipper: sql`CONCAT(tape_coil.type, ' - ', tape_coil.zipper_number)`,
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
		.where(eq(tape_coil_production.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'tape_coil_production',
	};
	handleResponse({ promise: tapeCoilProductionPromise, res, next, ...toast });
}

export async function selectTapeCoilProductionBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilProductionPromise = db
		.select({
			uuid: tape_coil_production.uuid,
			section: tape_coil_production.section,
			tape_coil_uuid: tape_coil_production.tape_coil_uuid,
			type: tape_coil.type,
			zipper_number: tape_coil.zipper_number,
			type_of_zipper: sql`CONCAT(tape_coil.type, ' - ', tape_coil.zipper_number)`,
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
		.where(eq(tape_coil_production.section, req.params.section));

	const toast = {
		status: 200,
		type: 'select_all',
		message: `tape_coil_production of ${req.params.section}`,
	};
	handleResponse({ promise: tapeCoilProductionPromise, res, next, ...toast });
}
