import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { policy_and_notice } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const policyAndNoticePromise = db
		.insert(policy_and_notice)
		.values(req.body)
		.returning({ insertedId: policy_and_notice.title });

	policyAndNoticePromise.then((result) => {
		const toast = {
			status: 201,
			type: 'create',
			msg: `${result[0].insertedId} created`,
		};

		handleResponse({
			promise: policyAndNoticePromise,
			res,
			next,
			...toast,
		});
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const policyAndNoticePromise = db
		.update(policy_and_notice)
		.set(req.body)
		.where(eq(policy_and_notice.uuid, req.params.uuid))
		.returning({ updatedId: policy_and_notice.title });

	policyAndNoticePromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedId} updated`,
			};

			handleResponse({
				promise: policyAndNoticePromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating privacy and notice - ${error.message}`,
			};

			handleResponse({
				promise: policyAndNoticePromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const policyAndNoticePromise = db
		.delete(policy_and_notice)
		.where(eq(policy_and_notice.uuid, req.params.uuid))
		.returning({ deletedId: policy_and_notice.title });

	policyAndNoticePromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedId} deleted`,
			};

			handleResponse({
				promise: policyAndNoticePromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting privacy and notice - ${error.message}`,
			};

			handleResponse({
				promise: policyAndNoticePromise,
				res,
				next,
				...toast,
			});
		});
}

export function selectAll(req, res, next) {
	const policyAndNoticePromise = db.select().from(policy_and_notice);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Privacy and Notice List',
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
		msg: 'Privacy and Notice',
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
		msg: 'Policy',
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
		msg: 'Notice',
	};

	handleResponse({
		promise: noticePromise,
		res,
		next,
		...toast,
	});
}
