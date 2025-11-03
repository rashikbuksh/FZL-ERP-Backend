import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { utility } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const utilityPromise = db
		.insert(utility)
		.values(req.body)
		.returning({ insertedUuid: utility.id });

	try {
		const data = await utilityPromise;

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

	const utilityPromise = db
		.update(utility)
		.set(req.body)
		.where(eq(utility.uuid, req.params.uuid))
		.returning({ updatedUuid: utility.id });

	try {
		const data = await utilityPromise;

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
	const utilityPromise = db
		.delete(utility)
		.where(eq(utility.uuid, req.params.uuid))
		.returning({ deletedUuid: utility.id });

	try {
		const data = await utilityPromise;

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
	const utilityPromise = db
		.select({
			id: utility.id,
			uuid: utility.uuid,
			utility_id: sql`concat('U', to_char(utility.created_at, 'YY'), '-', utility.id::text)`,
			date: utility.date,
			previous_date: utility.previous_date,
			off_day: utility.off_day,
			created_at: utility.created_at,
			created_by: utility.created_by,
			created_by_name: createdByUser.name,
			updated_at: utility.updated_at,
			updated_by: utility.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: utility.remarks,
			utility_entries: sql`(
				SELECT json_agg(ue_data) FROM (
					SELECT
						ue.uuid,
						ue.utility_uuid,
						ue.type,
						ue.reading,
						ue.voltage_ratio,
						ue.unit_cost,
						ue.created_at,
						ue.created_by,
						creator.name AS created_by_name,
						ue.updated_at,
						ue.updated_by,
						updater.name AS updated_by_name,
						ue.remarks
					FROM utility_entry ue
					LEFT JOIN hr_schema.users AS creator ON ue.created_by = creator.uuid
					LEFT JOIN hr_schema.users AS updater ON ue.updated_by = updater.uuid
					WHERE ue.utility_uuid = utility.uuid
				) AS ue_data
			)`,
		})
		.from(utility)
		.leftJoin(createdByUser, eq(utility.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(utility.updated_by, updatedByUser.uuid))
		.where(eq(utility.uuid, req.params.uuid));

	try {
		const data = await utilityPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'utility selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const utilityEntryPromise = db
		.select({
			id: utility.id,
			uuid: utility.uuid,
			utility_id: sql`concat('U', to_char(utility.created_at, 'YY'), '-', utility.id::text)`,
			date: utility.date,
			previous_date: utility.previous_date,
			off_day: utility.off_day,
			created_at: utility.created_at,
			created_by: utility.created_by,
			created_by_name: createdByUser.name,
			updated_at: utility.updated_at,
			updated_by: utility.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: utility.remarks,
		})
		.from(utility)
		.leftJoin(createdByUser, eq(utility.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(utility.updated_by, updatedByUser.uuid))
		.orderBy(desc(utility.date));

	try {
		const data = await utilityEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'utility selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
