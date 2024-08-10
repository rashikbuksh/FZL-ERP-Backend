import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { policy_and_notice } from '../schema.js';

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

export function selectAll(req, res, next) {
	const policyAndNoticePromise = db.select().from(policy_and_notice);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Privacy and Notice List',
	};

	handleResponse({
		promise: policyAndNoticePromise,
		res,
		next,
		...toast,
	});
}

export function select(req, res, next) {
	if (!validateRequest(req, next)) return;

	const policyAndNoticePromise = db
		.select()
		.from(policy_and_notice)
		.where(eq(policy_and_notice.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Privacy and Notice',
	};

	handleResponse({
		promise: policyAndNoticePromise,
		res,
		next,
		...toast,
	});
}

export function selectPolicy(req, res, next) {
	if (!validateRequest(req, next)) return;

	const policyPromise = db
		.select()
		.from(policy_and_notice)
		.where(eq(policy_and_notice.type, 'policy'));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Policy',
	};

	handleResponse({
		promise: policyPromise,
		res,
		next,
		...toast,
	});
}

export function selectNotice(req, res, next) {
	if (!validateRequest(req, next)) return;

	const noticePromise = db
		.select()
		.from(policy_and_notice)
		.where(eq(policy_and_notice.type, 'notice'));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Notice',
	};

	handleResponse({
		promise: noticePromise,
		res,
		next,
		...toast,
	});
}
