import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { policy_and_notice, users } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const policyAndNoticePromise = db
		.insert(policy_and_notice)
		.values(req.body)
		.returning({ insertedId: policy_and_notice.title });

	try {
		const data = await policyAndNoticePromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const policyAndNoticePromise = db
		.update(policy_and_notice)
		.set(req.body)
		.where(eq(policy_and_notice.uuid, req.params.uuid))
		.returning({ updatedId: policy_and_notice.title });

	try {
		const data = await policyAndNoticePromise;
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

	const policyAndNoticePromise = db
		.delete(policy_and_notice)
		.where(eq(policy_and_notice.uuid, req.params.uuid))
		.returning({ deletedId: policy_and_notice.title });

	try {
		const data = await policyAndNoticePromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const policyAndNoticePromise = db
		.select({
			uuid: policy_and_notice.uuid,
			title: policy_and_notice.title,
			sub_title: policy_and_notice.sub_title,
			url: policy_and_notice.url,
			type: policy_and_notice.type,
			created_at: policy_and_notice.created_at,
			updated_at: policy_and_notice.updated_at,
			created_by: policy_and_notice.created_by,
			created_by_name: users.name,
			remarks: policy_and_notice.remarks,
			status: policy_and_notice.status,
		})
		.from(policy_and_notice)
		.leftJoin(users, eq(policy_and_notice.created_by, users.uuid))
		.orderBy(desc(policy_and_notice.created_at));

	try {
		const data = await policyAndNoticePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Privacy and Notice',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!validateRequest(req, next)) return;

	const policyAndNoticePromise = db
		.select({
			uuid: policy_and_notice.uuid,
			title: policy_and_notice.title,
			sub_title: policy_and_notice.sub_title,
			url: policy_and_notice.url,
			type: policy_and_notice.type,
			created_at: policy_and_notice.created_at,
			updated_at: policy_and_notice.updated_at,
			created_by: policy_and_notice.created_by,
			created_by_name: users.name,
			remarks: policy_and_notice.remarks,
			status: policy_and_notice.status,
		})
		.from(policy_and_notice)
		.leftJoin(users, eq(policy_and_notice.created_by, users.uuid))
		.where(eq(policy_and_notice.uuid, req.params.uuid));

	try {
		const data = await policyAndNoticePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Privacy and Notice',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPolicy(req, res, next) {
	if (!validateRequest(req, next)) return;

	const policyPromise = db
		.select({
			uuid: policy_and_notice.uuid,
			title: policy_and_notice.title,
			type: policy_and_notice.type,
			created_at: policy_and_notice.created_at,
			updated_at: policy_and_notice.updated_at,
			created_by: policy_and_notice.created_by,
			created_by_name: users.name,
			remarks: policy_and_notice.remarks,
			status: policy_and_notice.status,
		})
		.from(policy_and_notice)
		.leftJoin(users, eq(policy_and_notice.created_by, users.uuid))
		.where(eq(policy_and_notice.type, 'policy'));

	try {
		const data = await policyPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Privacy and Notice',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectNotice(req, res, next) {
	if (!validateRequest(req, next)) return;

	const noticePromise = db
		.select({
			uuid: policy_and_notice.uuid,
			title: policy_and_notice.title,
			type: policy_and_notice.type,
			created_at: policy_and_notice.created_at,
			updated_at: policy_and_notice.updated_at,
			created_by: policy_and_notice.created_by,
			created_by_name: users.name,
			remarks: policy_and_notice.remarks,
			status: policy_and_notice.status,
		})
		.from(policy_and_notice)
		.leftJoin(users, eq(policy_and_notice.created_by, users.uuid))
		.where(eq(policy_and_notice.type, 'notice'));

	try {
		const data = await noticePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Privacy and Notice',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
