import { eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { marketing_team } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_teamPromise = db
		.insert(marketing_team)
		.values(req.body)
		.returning({ insertedName: marketing_team.name });

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
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

	const marketing_teamPromise = db
		.update(marketing_team)
		.set(req.body)
		.where(eq(marketing_team.uuid, req.params.uuid))
		.returning({ updatedName: marketing_team.name });

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
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

	const marketing_teamPromise = db
		.delete(marketing_team)
		.where(eq(marketing_team.uuid, req.params.uuid))
		.returning({ deletedName: marketing_team.name });

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
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
	const marketing_teamPromise = db
		.select({
			uuid: marketing_team.uuid,
			name: marketing_team.name,
			created_at: marketing_team.created_at,
			updated_at: marketing_team.updated_at,
			created_by: marketing_team.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team.remarks,
		})
		.from(marketing_team)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team.created_by, hrSchema.users.uuid)
		)
		.where(eq(marketing_team.uuid, req.params.uuid));

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 200,
			message: 'marketing_team select',
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
	const marketing_teamPromise = db
		.select({
			uuid: marketing_team.uuid,
			name: marketing_team.name,
			created_at: marketing_team.created_at,
			updated_at: marketing_team.updated_at,
			created_by: marketing_team.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team.remarks,
		})
		.from(marketing_team)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team.created_by, hrSchema.users.uuid)
		);

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 200,
			message: 'marketing_team list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}
export async function selectMarketingTeamDetailsByMarketingTeamUuid(
	req,
	res,
	next
) {
	if (!validateRequest(req, next)) return;
	try {
		const { marketing_team_uuid } = req.params;
		const api = await createApi(req);

		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${marketing_team_uuid}`)
				.then((response) => response);

		const [marketing_team, marketing_team_entry] = await Promise.all([
			fetchData('/public/marketing-team'),
			fetchData('/public/marketing-team-entry/by'),
		]);

		const response = {
			...marketing_team?.data?.data[0],
			marketing_team_entry: marketing_team_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			message: 'marketing_team list',
		};
		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}
