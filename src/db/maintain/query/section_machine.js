import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { section_machine } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const section_machineEntryPromise = db
		.insert(section_machine)
		.values(req.body)
		.returning({ insertedUuid: section_machine.id });

	try {
		const data = await section_machineEntryPromise;

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

	const section_machineEntryPromise = db
		.update(section_machine)
		.set(req.body)
		.where(eq(section_machine.uuid, req.params.uuid))
		.returning({ updatedUuid: section_machine.id });

	try {
		const data = await section_machineEntryPromise;

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
	const section_machineEntryPromise = db
		.delete(section_machine)
		.where(eq(section_machine.uuid, req.params.uuid))
		.returning({ deletedUuid: section_machine.id });

	try {
		const data = await section_machineEntryPromise;

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
	const section_machineEntryPromise = db
		.select({
			id: section_machine.id,
			uuid: section_machine.uuid,
			section_machine_id: sql`concat('MT', to_char(section_machine.created_at, 'YY'), '-', section_machine.id::text)`,
			section: section_machine.section,
			name: section_machine.name,
			status: section_machine.status,
			created_by: section_machine.created_by,
			created_by_name: hrSchema.users.name,
			created_at: section_machine.created_at,
			updated_at: section_machine.updated_at,
			remarks: section_machine.remarks,
		})
		.from(section_machine)
		.leftJoin(
			hrSchema.users,
			eq(section_machine.created_by, hrSchema.users.uuid)
		)
		.where(eq(section_machine.uuid, req.params.uuid));

	try {
		const data = await section_machineEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'section_machine selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const section_machineEntryPromise = db
		.select({
			id: section_machine.id,
			uuid: section_machine.uuid,
			section_machine_id: sql`concat('MT', to_char(section_machine.created_at, 'YY'), '-', section_machine.id::text)`,
			section: section_machine.section,
			name: section_machine.name,
			status: section_machine.status,
			created_by: section_machine.created_by,
			created_by_name: hrSchema.users.name,
			created_at: section_machine.created_at,
			updated_at: section_machine.updated_at,
			remarks: section_machine.remarks,
		})
		.from(section_machine)
		.leftJoin(
			hrSchema.users,
			eq(section_machine.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(section_machine.created_at));

	try {
		const data = await section_machineEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'section_machine selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
