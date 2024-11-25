import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { marketing, marketing_team, marketing_team_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_team_entryPromise = db
		.insert(marketing_team_entry)
		.values(req.body)
		.returning({ insertedId: marketing_team_entry.uuid });

	try {
		const data = await marketing_team_entryPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_team_entryPromise = db
		.update(marketing_team_entry)
		.set(req.body)
		.where(eq(marketing_team_entry.uuid, req.params.uuid))
		.returning({ updatedId: marketing_team_entry.uuid });

	try {
		const data = await marketing_team_entryPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_team_entryPromise = db
		.delete(marketing_team_entry)
		.where(eq(marketing_team_entry.uuid, req.params.uuid))
		.returning({ deletedId: marketing_team_entry.uuid });

	try {
		const data = await marketing_team_entryPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function select(req, res, next) {
	const marketing_team_entryPromise = db
		.select({
			uuid: marketing_team_entry.uuid,
			marketing_team_uuid: marketing_team_entry.marketing_team_uuid,
			marketing_team_name: marketing_team.name,
			marketing_uuid: marketing_team_entry.marketing_uuid,
			marketing_name: marketing.name,
			is_team_leader: marketing_team_entry.is_team_leader,
			created_at: marketing_team_entry.created_at,
			updated_at: marketing_team_entry.updated_at,
			created_by: marketing_team_entry.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team_entry.remarks,
		})
		.from(marketing_team_entry)
		.leftJoin(
			marketing_team,
			eq(marketing_team.uuid, marketing_team_entry.marketing_team_uuid)
		)
		.leftJoin(
			marketing,
			eq(marketing.uuid, marketing_team_entry.marketing_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team_entry.created_by, hrSchema.users.uuid)
		)
		.where(eq(marketing_team_entry.uuid, req.params.uuid));

	try {
		const data = await marketing_team_entryPromise;
		const toast = {
			status: 200,
			message: 'marketing_team_entry select',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAll(req, res, next) {
	const marketing_team_entryPromise = db
		.select({
			uuid: marketing_team_entry.uuid,
			marketing_team_uuid: marketing_team_entry.marketing_team_uuid,
			marketing_team_name: marketing_team.name,
			marketing_uuid: marketing_team_entry.marketing_uuid,
			marketing_name: marketing.name,
			is_team_leader: marketing_team_entry.is_team_leader,
			created_at: marketing_team_entry.created_at,
			updated_at: marketing_team_entry.updated_at,
			created_by: marketing_team_entry.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team_entry.remarks,
		})
		.from(marketing_team_entry)
		.leftJoin(
			marketing_team,
			eq(marketing_team.uuid, marketing_team_entry.marketing_team_uuid)
		)
		.leftJoin(
			marketing,
			eq(marketing.uuid, marketing_team_entry.marketing_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team_entry.created_by, hrSchema.users.uuid)
		);

	try {
		const data = await marketing_team_entryPromise;
		const toast = {
			status: 200,
			message: 'marketing_team_entry list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAllByMarketingTeamUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const marketing_team_entryPromise = db
		.select({
			uuid: marketing_team_entry.uuid,
			marketing_team_uuid: marketing_team_entry.marketing_team_uuid,
			marketing_team_name: marketing_team.name,
			marketing_uuid: marketing_team_entry.marketing_uuid,
			marketing_name: marketing.name,
			is_team_leader: marketing_team_entry.is_team_leader,
			created_at: marketing_team_entry.created_at,
			updated_at: marketing_team_entry.updated_at,
			created_by: marketing_team_entry.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team_entry.remarks,
		})
		.from(marketing_team_entry)
		.leftJoin(
			marketing_team,
			eq(marketing_team.uuid, marketing_team_entry.marketing_team_uuid)
		)
		.leftJoin(
			marketing,
			eq(marketing.uuid, marketing_team_entry.marketing_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team_entry.created_by, hrSchema.users.uuid)
		)
		.where(
			eq(
				marketing_team_entry.marketing_team_uuid,
				req.params.marketing_team_uuid
			)
		);

	try {
		const data = await marketing_team_entryPromise;
		const toast = {
			status: 200,
			message: 'marketing_team_entry list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}
