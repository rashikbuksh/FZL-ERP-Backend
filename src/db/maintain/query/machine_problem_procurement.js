import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { machine_problem_procurement, machine_problem } from '../schema.js';
import * as materialSchema from '../../material/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const machine_problem_procurementEntryPromise = db
		.insert(machine_problem_procurement)
		.values(req.body)
		.returning({ insertedUuid: machine_problem_procurement.uuid });

	try {
		const data = await machine_problem_procurementEntryPromise;

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

	const machine_problem_procurementEntryPromise = db
		.update(machine_problem_procurement)
		.set(req.body)
		.where(eq(machine_problem_procurement.uuid, req.params.uuid))
		.returning({ updatedUuid: machine_problem_procurement.uuid });

	try {
		const data = await machine_problem_procurementEntryPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const machine_problem_procurementEntryPromise = db
		.delete(machine_problem_procurement)
		.where(eq(machine_problem_procurement.uuid, req.params.uuid))
		.returning({ deletedUuid: machine_problem_procurement.uuid });

	try {
		const data = await machine_problem_procurementEntryPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const machine_problem_procurementEntryPromise = db
		.select({
			uuid: machine_problem_procurement.uuid,
			machine_problem_uuid:
				machine_problem_procurement.machine_problem_uuid,
			machine_problem_procurement_id: sql`concat('MP', to_char(machine_problem_procurement.created_at, 'YY'), '-', machine_problem_procurement.id::text)`,
			machine_problem_id: sql`concat('MT', to_char(machine_problem.created_at, 'YY'), '-', machine_problem.id::text)`,
			material_uuid: machine_problem_procurement.material_uuid,
			material_name: materialSchema.info.name,
			quantity: machine_problem_procurement.quantity,
			description: machine_problem_procurement.description,
			created_by: machine_problem_procurement.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine_problem_procurement.created_at,
			updated_at: machine_problem_procurement.updated_at,
			remarks: machine_problem_procurement.remarks,
		})
		.from(machine_problem_procurement)
		.leftJoin(
			materialSchema.info,
			eq(
				machine_problem_procurement.material_uuid,
				materialSchema.info.uuid
			)
		)
		.leftJoin(
			machine_problem,
			eq(
				machine_problem_procurement.machine_problem_uuid,
				machine_problem.uuid
			)
		)
		.leftJoin(
			hrSchema.users,
			eq(machine_problem_procurement.created_by, hrSchema.users.uuid)
		)
		.where(eq(machine_problem_procurement.uuid, req.params.uuid));

	try {
		const data = await machine_problem_procurementEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'machine_problem_procurement selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const machine_problem_procurementEntryPromise = db
		.select({
			uuid: machine_problem_procurement.uuid,
			machine_problem_uuid:
				machine_problem_procurement.machine_problem_uuid,
			machine_problem_procurement_id: sql`concat('MP', to_char(machine_problem_procurement.created_at, 'YY'), '-', machine_problem_procurement.id::text)`,
			machine_problem_id: sql`concat('MT', to_char(machine_problem.created_at, 'YY'), '-', machine_problem.id::text)`,
			material_uuid: machine_problem_procurement.material_uuid,
			material_name: materialSchema.info.name,
			quantity: machine_problem_procurement.quantity,
			description: machine_problem_procurement.description,
			created_by: machine_problem_procurement.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine_problem_procurement.created_at,
			updated_at: machine_problem_procurement.updated_at,
			remarks: machine_problem_procurement.remarks,
		})
		.from(machine_problem_procurement)
		.leftJoin(
			materialSchema.info,
			eq(
				machine_problem_procurement.material_uuid,
				materialSchema.info.uuid
			)
		)
		.leftJoin(
			machine_problem,
			eq(
				machine_problem_procurement.machine_problem_uuid,
				machine_problem.uuid
			)
		)
		.leftJoin(
			hrSchema.users,
			eq(machine_problem_procurement.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(machine_problem_procurement.created_at));

	try {
		const data = await machine_problem_procurementEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'machine_problem_procurement selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
