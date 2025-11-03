import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { utility, utility_entry } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const utility_entryPromise = db
		.insert(utility_entry)
		.values(req.body)
		.returning({ insertedUuid: utility_entry.uuid });

	try {
		const data = await utility_entryPromise;

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

	const utility_entryPromise = db
		.update(utility_entry)
		.set(req.body)
		.where(eq(utility_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: utility_entry.uuid });

	try {
		const data = await utility_entryPromise;

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
	const utility_entryPromise = db
		.delete(utility_entry)
		.where(eq(utility_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: utility_entry.uuid });

	try {
		const data = await utility_entryPromise;

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
	const utility_entryPromise = db
		.select({
			uuid: utility_entry.uuid,
			utility_uuid: utility_entry.utility_uuid,
			utility_id: sql`concat('U', to_char(utility.created_at, 'YY'), '-', utility.id::text)`,
			date: utility_entry.date,
			previous_date: utility.previous_date,
			off_day: utility.off_day,
			type: utility.type,
			reading: utility_entry.reading,
			voltage_ratio: utility_entry.voltage_ratio,
			unit_cost: utility_entry.unit_cost,
			created_at: utility_entry.created_at,
			created_by: utility_entry.created_by,
			created_by_name: createdByUser.name,
			updated_at: utility_entry.updated_at,
			updated_by: utility_entry.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: utility_entry.remarks,
		})
		.from(utility_entry)
		.leftJoin(utility, eq(utility_entry.utility_uuid, utility.uuid))
		.leftJoin(
			createdByUser,
			eq(utility_entry.created_by, createdByUser.uuid)
		)
		.leftJoin(
			updatedByUser,
			eq(utility_entry.updated_by, updatedByUser.uuid)
		)
		.where(eq(utility_entry.uuid, req.params.uuid));

	try {
		const data = await utility_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'utility_entry selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const utility_entryEntryPromise = db
		.select({
			uuid: utility_entry.uuid,
			utility_uuid: utility_entry.utility_uuid,
			utility_id: sql`concat('U', to_char(utility.created_at, 'YY'), '-', utility.id::text)`,
			date: utility_entry.date,
			previous_date: utility.previous_date,
			off_day: utility.off_day,
			type: utility.type,
			reading: utility_entry.reading,
			voltage_ratio: utility_entry.voltage_ratio,
			unit_cost: utility_entry.unit_cost,
			created_at: utility_entry.created_at,
			created_by: utility_entry.created_by,
			created_by_name: createdByUser.name,
			updated_at: utility_entry.updated_at,
			updated_by: utility_entry.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: utility_entry.remarks,
		})
		.from(utility_entry)
		.leftJoin(utility, eq(utility_entry.utility_uuid, utility.uuid))
		.leftJoin(
			createdByUser,
			eq(utility_entry.created_by, createdByUser.uuid)
		)
		.leftJoin(
			updatedByUser,
			eq(utility_entry.updated_by, updatedByUser.uuid)
		)
		.orderBy(desc(utility_entry.created_at));

	try {
		const data = await utility_entryEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'utility_entry selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
