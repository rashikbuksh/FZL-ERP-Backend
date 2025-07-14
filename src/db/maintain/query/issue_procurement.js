import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { issue_procurement, issue } from '../schema.js';
import * as materialSchema from '../../material/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const issue_procurementEntryPromise = db
		.insert(issue_procurement)
		.values(req.body)
		.returning({ insertedUuid: issue_procurement.uuid });

	try {
		const data = await issue_procurementEntryPromise;

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

	const issue_procurementEntryPromise = db
		.update(issue_procurement)
		.set(req.body)
		.where(eq(issue_procurement.uuid, req.params.uuid))
		.returning({ updatedUuid: issue_procurement.uuid });

	try {
		const data = await issue_procurementEntryPromise;

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
	const issue_procurementEntryPromise = db
		.delete(issue_procurement)
		.where(eq(issue_procurement.uuid, req.params.uuid))
		.returning({ deletedUuid: issue_procurement.uuid });

	try {
		const data = await issue_procurementEntryPromise;

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
	const issue_procurementEntryPromise = db
		.select({
			uuid: issue_procurement.uuid,
			issue_uuid: issue_procurement.issue_uuid,
			issue_id: sql`concat('MT', to_char(issue.created_at, 'YY'), '-', issue.id::text)`,
			material_uuid: issue_procurement.material_uuid,
			material_name: materialSchema.info.name,
			quantity: issue_procurement.quantity,
			description: issue_procurement.description,
			created_by: issue_procurement.created_by,
			created_by_name: hrSchema.users.name,
			created_at: issue_procurement.created_at,
			updated_at: issue_procurement.updated_at,
			remarks: issue_procurement.remarks,
		})
		.from(issue_procurement)
		.leftJoin(
			materialSchema.info,
			eq(issue_procurement.material_uuid, materialSchema.info.uuid)
		)
		.leftJoin(issue, eq(issue_procurement.issue_uuid, issue.uuid))
		.leftJoin(
			hrSchema.users,
			eq(issue_procurement.created_by, hrSchema.users.uuid)
		)
		.where(eq(issue_procurement.uuid, req.params.uuid));

	try {
		const data = await issue_procurementEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'issue_procurement selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const issue_procurementEntryPromise = db
		.select({
			uuid: issue_procurement.uuid,
			issue_uuid: issue_procurement.issue_uuid,
			issue_id: sql`concat('MT', to_char(issue.created_at, 'YY'), '-', issue.id::text)`,
			material_uuid: issue_procurement.material_uuid,
			material_name: materialSchema.info.name,
			quantity: issue_procurement.quantity,
			description: issue_procurement.description,
			created_by: issue_procurement.created_by,
			created_by_name: hrSchema.users.name,
			created_at: issue_procurement.created_at,
			updated_at: issue_procurement.updated_at,
			remarks: issue_procurement.remarks,
		})
		.from(issue_procurement)
		.leftJoin(
			materialSchema.info,
			eq(issue_procurement.material_uuid, materialSchema.info.uuid)
		)
		.leftJoin(issue, eq(issue_procurement.issue_uuid, issue.uuid))
		.leftJoin(
			hrSchema.users,
			eq(issue_procurement.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(issue_procurement.created_at));

	try {
		const data = await issue_procurementEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'issue_procurement selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
