import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { marketing, marketing_team_member_target } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_team_member_targetPromise = db
		.insert(marketing_team_member_target)
		.values(req.body)
		.returning({ insertedId: marketing_team_member_target.uuid });

	try {
		const data = await marketing_team_member_targetPromise;
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

	const marketing_team_member_targetPromise = db
		.update(marketing_team_member_target)
		.set(req.body)
		.where(eq(marketing_team_member_target.uuid, req.params.uuid))
		.returning({ updatedId: marketing_team_member_target.uuid });

	try {
		const data = await marketing_team_member_targetPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_team_member_targetPromise = db
		.delete(marketing_team_member_target)
		.where(eq(marketing_team_member_target.uuid, req.params.uuid))
		.returning({ deletedId: marketing_team_member_target.uuid });

	try {
		const data = await marketing_team_member_targetPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedId} removed`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const marketing_team_member_targetPromise = db
		.select({
			uuid: marketing_team_member_target.uuid,
			marketing_uuid: marketing_team_member_target.marketing_uuid,
			marketing_name: marketing.name,
			year: marketing_team_member_target.year,
			month: marketing_team_member_target.month,
			amount: sql`(marketing_team_member_target.zipper_amount + marketing_team_member_target.thread_amount)::float8`,
			zipper_amount: decimalToNumber(
				marketing_team_member_target.zipper_amount
			),
			thread_amount: decimalToNumber(
				marketing_team_member_target.thread_amount
			),
			created_at: marketing_team_member_target.created_at,
			updated_at: marketing_team_member_target.updated_at,
			created_by: marketing_team_member_target.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team_member_target.remarks,
		})
		.from(marketing_team_member_target)
		.leftJoin(
			marketing,
			eq(marketing.uuid, marketing_team_member_target.marketing_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team_member_target.created_by, hrSchema.users.uuid)
		)
		.where(eq(marketing_team_member_target.uuid, req.params.uuid));

	try {
		const data = await marketing_team_member_targetPromise;
		const toast = {
			status: 200,
			message: 'marketing_team_member_target select',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAll(req, res, next) {
	const marketing_team_member_targetPromise = db
		.select({
			uuid: marketing_team_member_target.uuid,
			marketing_uuid: marketing_team_member_target.marketing_uuid,
			marketing_name: marketing.name,
			year: marketing_team_member_target.year,
			month: marketing_team_member_target.month,
			amount: sql`(marketing_team_member_target.zipper_amount + marketing_team_member_target.thread_amount)::float8`,
			zipper_amount: decimalToNumber(
				marketing_team_member_target.zipper_amount
			),
			thread_amount: decimalToNumber(
				marketing_team_member_target.thread_amount
			),
			created_at: marketing_team_member_target.created_at,
			updated_at: marketing_team_member_target.updated_at,
			created_by: marketing_team_member_target.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team_member_target.remarks,
		})
		.from(marketing_team_member_target)
		.leftJoin(
			marketing,
			eq(marketing.uuid, marketing_team_member_target.marketing_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team_member_target.created_by, hrSchema.users.uuid)
		);

	try {
		const data = await marketing_team_member_targetPromise;
		const toast = {
			status: 200,
			message: 'marketing_team_member_target list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
