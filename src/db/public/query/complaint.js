import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { complaint } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core/alias.js';
import * as viewSchema from '../../view/schema.js';
import * as threadSchema from '../../thread/schema.js';

const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const complaintPromise = db
		.insert(complaint)
		.values(req.body)
		.returning({ insertedName: complaint.name });

	try {
		const data = await complaintPromise;
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

	const complaintPromise = db
		.update(complaint)
		.set(req.body)
		.where(eq(complaint.uuid, req.params.uuid))
		.returning({ updatedName: complaint.name });

	try {
		const data = await complaintPromise;
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

	const complaintPromise = db
		.delete(complaint)
		.where(eq(complaint.uuid, req.params.uuid))
		.returning({ deletedName: complaint.name });

	try {
		const data = await complaintPromise;
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

export async function selectAll(req, res, next) {
	const complaintPromise = db
		.select({
			uuid: complaint.uuid,
			order_description_uuid: complaint.order_description_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			thread_order_info_uuid: complaint.thread_order_info_uuid,
			thread_order_number: sql`concat('ST', CASE WHEN thread.order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(thread.order_info.created_at, 'YY'), '-', (thread.order_info.id))`,
			name: complaint.name,
			description: complaint.description,
			root_cause_analysis: complaint.root_cause_analysis,
			issue_department: complaint.issue_department,
			solution: complaint.solution,
			future_proof: complaint.future_proof,
			created_at: complaint.created_at,
			updated_at: complaint.updated_at,
			created_by: complaint.created_by,
			created_by_name: hrSchema.users.name,
			updated_by: complaint.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: complaint.remarks,
		})
		.from(complaint)
		.leftJoin(hrSchema.users, eq(complaint.created_by, hrSchema.users.uuid))
		.leftJoin(updatedByUser, eq(complaint.updated_by, updatedByUser.uuid))
		.leftJoin(
			viewSchema.v_order_details_full,
			eq(
				complaint.order_description_uuid,
				viewSchema.v_order_details_full.order_description_uuid
			)
		)
		.leftJoin(
			threadSchema.order_info,
			eq(complaint.thread_order_info_uuid, threadSchema.order_info.uuid)
		)
		.orderBy(desc(complaint.created_at));

	try {
		const data = await complaintPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'complaint',
		};

		const combinedData = {
			toast,
			data,
		};

		return combinedData;
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const complaintPromise = db
		.select({
			uuid: complaint.uuid,
			order_description_uuid: complaint.order_description_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			thread_order_info_uuid: complaint.thread_order_info_uuid,
			thread_order_number: sql`concat('ST', CASE WHEN thread.order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(thread.order_info.created_at, 'YY'), '-', (thread.order_info.id))`,
			name: complaint.name,
			description: complaint.description,
			root_cause_analysis: complaint.root_cause_analysis,
			issue_department: complaint.issue_department,
			solution: complaint.solution,
			future_proof: complaint.future_proof,
			created_at: complaint.created_at,
			updated_at: complaint.updated_at,
			created_by: complaint.created_by,
			created_by_name: hrSchema.users.name,
			updated_by: complaint.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: complaint.remarks,
		})
		.from(complaint)
		.leftJoin(hrSchema.users, eq(complaint.created_by, hrSchema.users.uuid))
		.leftJoin(updatedByUser, eq(complaint.updated_by, updatedByUser.uuid))
		.leftJoin(
			viewSchema.v_order_details_full,
			eq(
				complaint.order_description_uuid,
				viewSchema.v_order_details_full.order_description_uuid
			)
		)
		.leftJoin(
			threadSchema.order_info,
			eq(complaint.thread_order_info_uuid, threadSchema.order_info.uuid)
		)
		.where(eq(complaint.uuid, req.params.uuid));

	try {
		const data = await complaintPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'complaint by uuid',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByOrderDescriptionUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_description_uuid } = req.params;

	const { is_zipper } = req.query;

	const complaintPromise = db
		.select({
			uuid: complaint.uuid,
			order_description_uuid: complaint.order_description_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			thread_order_info_uuid: complaint.thread_order_info_uuid,
			thread_order_number: sql`concat('ST', CASE WHEN thread.order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(thread.order_info.created_at, 'YY'), '-', (thread.order_info.id))`,
			name: complaint.name,
			description: complaint.description,
			root_cause_analysis: complaint.root_cause_analysis,
			issue_department: complaint.issue_department,
			solution: complaint.solution,
			future_proof: complaint.future_proof,
			created_at: complaint.created_at,
			updated_at: complaint.updated_at,
			created_by: complaint.created_by,
			created_by_name: hrSchema.users.name,
			updated_by: complaint.updated_by,
			updated_by_name: updatedByUser.name,
			remarks: complaint.remarks,
		})
		.from(complaint)
		.leftJoin(hrSchema.users, eq(complaint.created_by, hrSchema.users.uuid))
		.leftJoin(updatedByUser, eq(complaint.updated_by, updatedByUser.uuid))
		.leftJoin(
			viewSchema.v_order_details_full,
			eq(
				complaint.order_description_uuid,
				viewSchema.v_order_details_full.order_description_uuid
			)
		)
		.leftJoin(
			threadSchema.order_info,
			eq(complaint.thread_order_info_uuid, threadSchema.order_info.uuid)
		)
		.where(
			is_zipper === 'true'
				? eq(complaint.order_description_uuid, order_description_uuid)
				: is_zipper === 'false'
					? eq(
							complaint.thread_order_info_uuid,
							order_description_uuid
						)
					: eq(
							complaint.order_description_uuid,
							order_description_uuid
						)
		);

	try {
		const data = await complaintPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'complaint by order description uuid',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
