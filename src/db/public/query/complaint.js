import { and, desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as threadSchema from '../../thread/schema.js';
import * as viewSchema from '../../view/schema.js';
import { complaint } from '../schema.js';

import {
	insertFile,
	updateFile,
	deleteFile,
} from '../../../util/upload_files.js';
import { sanitizePayload } from '../../variables.js';

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

export async function insertImage(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const formData = sanitizePayload(req.body);
	const files = Array.isArray(req.files) ? req.files : [];

	const storedPaths = [];
	for (const f of files) {
		if (f) {
			// ensure await
			const p = await insertFile(f, 'public/complaint');
			storedPaths.push(p);
		}
	}

	// If your complaint.file column is json/jsonb keep as array; if it's text, JSON.stringify it:
	const fileValue = storedPaths.length ? JSON.stringify(storedPaths) : null;

	const payload = {
		...formData,
		file: fileValue,
	};

	const complaintPromise = db
		.insert(complaint)
		.values(payload)
		.returning({ insertedName: complaint.name });

	try {
		const data = await complaintPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
		if (!res.headersSent) res.status(400).json({ error: error.message });
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

export async function updateImage(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const formData = sanitizePayload(req.body);

	const { file_string } = formData;

	// file_string is expected to be an json string of array
	const file_string_parsed = file_string
		? Array.isArray(file_string)
			? file_string
			: JSON.parse(file_string)
		: [];

	// Support array insertion (append multiple new files to existing list)
	const files = Array.isArray(req.files)
		? req.files
		: req.files
			? [req.files]
			: [];

	if (files.length) {
		// Fetch existing record's file field
		const existing = await db
			.select({ file: complaint.file })
			.from(complaint)
			.where(eq(complaint.uuid, req.params.uuid))
			.limit(1);

		// Determine which existing files to delete
		let filesToDelete = [];
		if (existing.length) {
			for (const p of existing) {
				const existingFiles = p.file ? JSON.parse(p.file) : [];
				filesToDelete = existingFiles.filter(
					(f) =>
						!file_string_parsed || !file_string_parsed.includes(f)
				);
			}
		}

		if (filesToDelete.length) {
			for (const p of filesToDelete) {
				deleteFile(p.file);
			}
		}

		let newPaths = [];
		// Retain files that are in file_string
		newPaths = file_string_parsed ? [...file_string_parsed] : [];

		// Insert each new file and collect paths
		for (const f of files) {
			if (!f) continue;
			const stored = await insertFile(f, 'public/complaint');
			newPaths.push(stored);
		}

		formData.file = JSON.stringify(newPaths); // Keep consistent with insertImage implementation
	}

	const complaintPromise = db
		.update(complaint)
		.set(formData)
		.where(eq(complaint.uuid, req.params.uuid))
		.returning({ updatedName: complaint.name });

	try {
		const data = await complaintPromise;
		if (!data.length) {
			return res.status(404).json({
				toast: {
					status: 404,
					type: 'update',
					message: 'Not found',
				},
			});
		}
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
		if (!res.headersSent) res.status(400).json({ error: error.message });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// First, we need to check if the document exists and get its file path
	const oldFilePath = db
		.select()
		.from(complaint)
		.where(eq(complaint.uuid, req.params.uuid));

	const oldFile = await oldFilePath;

	if (oldFile && oldFile[0].file) {
		// If there is an old file, delete it
		try {
			await deleteFile(oldFile[0].file);
		} catch (error) {
			console.error('Error deleting file:', error);
		}
	}

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
	const { own_uuid, is_resolved } = req.query;

	const complaintPromise = db
		.select({
			uuid: complaint.uuid,
			order_description_uuid: complaint.order_description_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			thread_order_info_uuid: complaint.thread_order_info_uuid,
			thread_order_number: sql`concat('ST', CASE WHEN thread.order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(thread.order_info.created_at, 'YY'), '-', (thread.order_info.id))`,
			file: complaint.file,
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
			is_resolved: complaint.is_resolved,
			is_resolved_date: complaint.is_resolved_date,
			marketing_name: viewSchema.v_order_details_full.marketing_name,
			party_name: viewSchema.v_order_details_full.party_name,
			buyer_name: viewSchema.v_order_details_full.buyer_name,
			merchandiser_name:
				viewSchema.v_order_details_full.merchandiser_name,
			factory_name: viewSchema.v_order_details_full.factory_name,
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

	const filterConditions = [];

	if (own_uuid) {
		filterConditions.push(eq(complaint.created_by, own_uuid));
	}
	if (is_resolved === 'true') {
		filterConditions.push(eq(complaint.is_resolved, true));
	}
	if (is_resolved === 'false') {
		filterConditions.push(eq(complaint.is_resolved, false));
	}
	if (filterConditions.length > 0) {
		complaintPromise.where(and(...filterConditions));
	}

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

		return await res.status(200).json(combinedData);
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
			file: complaint.file,
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
			is_resolved: complaint.is_resolved,
			is_resolved_date: complaint.is_resolved_date,
			marketing_name: viewSchema.v_order_details_full.marketing_name,
			party_name: viewSchema.v_order_details_full.party_name,
			buyer_name: viewSchema.v_order_details_full.buyer_name,
			merchandiser_name:
				viewSchema.v_order_details_full.merchandiser_name,
			factory_name: viewSchema.v_order_details_full.factory_name,
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

	const { is_zipper, own_uuid } = req.query;

	const complaintPromise = db
		.select({
			uuid: complaint.uuid,
			order_description_uuid: complaint.order_description_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			thread_order_info_uuid: complaint.thread_order_info_uuid,
			thread_order_number: sql`concat('ST', CASE WHEN thread.order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(thread.order_info.created_at, 'YY'), '-', (thread.order_info.id))`,
			file: complaint.file,
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
			is_resolved: complaint.is_resolved,
			is_resolved_date: complaint.is_resolved_date,
			marketing_name: viewSchema.v_order_details_full.marketing_name,
			party_name: viewSchema.v_order_details_full.party_name,
			buyer_name: viewSchema.v_order_details_full.buyer_name,
			merchandiser_name:
				viewSchema.v_order_details_full.merchandiser_name,
			factory_name: viewSchema.v_order_details_full.factory_name,
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

	// is_zipper and own_uuid both present means filter by own_uuid
	let filterCondition;

	if (is_zipper && own_uuid) {
		filterCondition =
			is_zipper === 'true'
				? and(
						eq(complaint.created_by, own_uuid),
						eq(
							complaint.order_description_uuid,
							order_description_uuid
						)
					)
				: is_zipper === 'false'
					? and(
							eq(complaint.created_by, own_uuid),
							eq(
								complaint.thread_order_info_uuid,
								order_description_uuid
							)
						)
					: eq(complaint.created_by, own_uuid);
	} else if (is_zipper && !own_uuid) {
		// only is_zipper present means no filter
		filterCondition =
			is_zipper === 'true'
				? eq(complaint.order_description_uuid, order_description_uuid)
				: is_zipper === 'false'
					? eq(
							complaint.thread_order_info_uuid,
							order_description_uuid
						)
					: sql`1=1`; // no filter
	} else if (!is_zipper && own_uuid) {
		// only own_uuid present means filter by own_uuid for both
		filterCondition = eq(complaint.created_by, own_uuid);
	} else {
		// none present means no filter
		filterCondition = sql`1=1`; // no filter
	}
	complaintPromise.where(filterCondition);

	complaintPromise.orderBy(desc(complaint.created_at));

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
