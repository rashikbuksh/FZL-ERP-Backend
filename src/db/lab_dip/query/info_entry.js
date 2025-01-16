import { desc, eq, sql } from 'drizzle-orm';
import { alias, uuid } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { info, info_entry, recipe } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoEntryPromise = db
		.insert(info_entry)
		.values(req.body)
		.returning({ insertedUuid: info_entry.uuid });

	try {
		const data = await infoEntryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoEntryPromise = db
		.update(info_entry)
		.set(req.body)
		.where(eq(info_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: info_entry.uuid });

	try {
		const data = await infoEntryPromise;

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
	const infoEntryPromise = db
		.delete(info_entry)
		.where(eq(info_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: info_entry.uuid });

	try {
		const data = await infoEntryPromise;

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
	const infoEntryPromise = db
		.select({
			uuid: info_entry.uuid,
			lab_dip_info_uuid: info_entry.lab_dip_info_uuid,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', LPAD(info.id::text, 4, '0'))`,
			info_name: info.name,
			recipe_uuid: info_entry.recipe_uuid,
			recipe_id: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'))`,
			recipe_name: recipe.name,
			approved: info_entry.approved,
			approved_date: info_entry.approved_date,
			marketing_approved: info_entry.marketing_approved,
			marketing_approved_date: info_entry.marketing_approved_date,
			created_by: info_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: info_entry.created_at,
			updated_at: info_entry.updated_at,
			remarks: info_entry.remarks,
		})
		.from(info_entry)
		.leftJoin(
			hrSchema.users,
			eq(info_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(recipe, eq(info_entry.recipe_uuid, recipe.uuid))
		.leftJoin(info, eq(info_entry.lab_dip_info_uuid, info.uuid))
		.where(eq(info_entry.uuid, req.params.uuid));

	try {
		const data = await infoEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'info_entry selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const infoEntryPromise = db
		.select({
			uuid: info_entry.uuid,
			lab_dip_info_uuid: info_entry.lab_dip_info_uuid,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', LPAD(info.id::text, 4, '0'))`,
			info_name: info.name,
			recipe_uuid: info_entry.recipe_uuid,
			recipe_id: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'))`,
			recipe_name: recipe.name,
			approved: info_entry.approved,
			approved_date: info_entry.approved_date,
			marketing_approved: info_entry.marketing_approved,
			marketing_approved_date: info_entry.marketing_approved_date,
			created_by: info_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: info_entry.created_at,
			updated_at: info_entry.updated_at,
			remarks: info_entry.remarks,
		})
		.from(info_entry)
		.leftJoin(
			hrSchema.users,
			eq(info_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(recipe, eq(info_entry.recipe_uuid, recipe.uuid))
		.leftJoin(info, eq(info_entry.lab_dip_info_uuid, info.uuid))
		.orderBy(desc(info_entry.created_at));

	try {
		const data = await infoEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'info_entry selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
