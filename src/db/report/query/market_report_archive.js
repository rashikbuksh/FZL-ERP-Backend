import { desc, eq, ne, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { market_report_archive } from '../schema.js';
import { users } from '../../hr/schema.js';

// Generate and save market report snapshot
export async function generateMarketReportSnapshot(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from_date, to_date, report_name, remarks } = req.body;

	try {
		// Run the existing market report query
		const query = sql`
            -- Your existing market report query here
            -- Copy the entire query from selectMarketReport function
        `;

		const reportData = await db.execute(query);

		// Save snapshot to archive table
		const snapshot = await db
			.insert(market_report_archive)
			.values({
				report_name:
					report_name || `Market Report ${from_date} to ${to_date}`,
				from_date,
				to_date,
				generated_by: req.user_uuid,
				report_data: reportData.rows,
				status: 'pending',
				remarks: remarks || null,
			})
			.returning();

		const toast = {
			status: 201,
			type: 'create',
			message: 'Market report snapshot generated successfully',
		};

		return res.status(201).json({ toast, data: snapshot[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

// List all snapshots (excluding deleted)
export async function listMarketReportSnapshots(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { status: filter_status } = req.query;

	try {
		const query = db
			.select({
				uuid: market_report_archive.uuid,
				report_name: market_report_archive.report_name,
				from_date: market_report_archive.from_date,
				to_date: market_report_archive.to_date,
				generated_at: market_report_archive.generated_at,
				generated_by: market_report_archive.generated_by,
				generated_by_name: users.name,
				status: market_report_archive.status,
				confirmed_at: market_report_archive.confirmed_at,
				confirmed_by: market_report_archive.confirmed_by,
				remarks: market_report_archive.remarks,
			})
			.from(market_report_archive)
			.leftJoin(users, eq(market_report_archive.generated_by, users.uuid))
			.where(ne(market_report_archive.status, 'deleted'))
			.orderBy(desc(market_report_archive.generated_at));

		// Apply status filter if provided
		if (filter_status && ['pending', 'confirmed'].includes(filter_status)) {
			query.where(eq(market_report_archive.status, filter_status));
		}

		const data = await query;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Market report snapshots fetched',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get specific snapshot with full report data
export async function getMarketReportSnapshot(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid: snapshot_uuid } = req.params;

	try {
		const data = await db
			.select({
				uuid: market_report_archive.uuid,
				report_name: market_report_archive.report_name,
				from_date: market_report_archive.from_date,
				to_date: market_report_archive.to_date,
				generated_at: market_report_archive.generated_at,
				generated_by: market_report_archive.generated_by,
				generated_by_name: users.name,
				status: market_report_archive.status,
				confirmed_at: market_report_archive.confirmed_at,
				confirmed_by: market_report_archive.confirmed_by,
				report_data: market_report_archive.report_data,
				remarks: market_report_archive.remarks,
				created_at: market_report_archive.created_at,
				updated_at: market_report_archive.updated_at,
			})
			.from(market_report_archive)
			.leftJoin(users, eq(market_report_archive.generated_by, users.uuid))
			.where(eq(market_report_archive.uuid, snapshot_uuid))
			.limit(1);

		if (!data.length) {
			return res.status(404).json({
				toast: {
					status: 404,
					type: 'error',
					message: 'Report snapshot not found',
				},
			});
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Market report snapshot fetched',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Confirm/Keep report
export async function confirmMarketReportSnapshot(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid: snapshot_uuid } = req.params;
	const { remarks } = req.body;

	try {
		const updated = await db
			.update(market_report_archive)
			.set({
				status: 'confirmed',
				confirmed_at: new Date(),
				confirmed_by: req.user_uuid,
				remarks: remarks || market_report_archive.remarks,
				updated_at: new Date(),
			})
			.where(eq(market_report_archive.uuid, snapshot_uuid))
			.returning();

		if (!updated.length) {
			return res.status(404).json({
				toast: {
					status: 404,
					type: 'error',
					message: 'Report snapshot not found',
				},
			});
		}

		const toast = {
			status: 200,
			type: 'update',
			message: 'Market report confirmed successfully',
		};

		return res.status(200).json({ toast, data: updated[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Delete report (soft delete)
export async function deleteMarketReportSnapshot(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid: snapshot_uuid } = req.params;

	try {
		// Soft delete - mark as deleted
		const deleted = await db
			.update(market_report_archive)
			.set({
				status: 'deleted',
				updated_at: new Date(),
			})
			.where(eq(market_report_archive.uuid, snapshot_uuid))
			.returning({ uuid: market_report_archive.uuid });

		// If you want hard delete instead, use:
		// const deleted = await db
		//     .delete(market_report_archive)
		//     .where(eq(market_report_archive.uuid, snapshot_uuid))
		//     .returning({ uuid: market_report_archive.uuid });

		if (!deleted.length) {
			return res.status(404).json({
				toast: {
					status: 404,
					type: 'error',
					message: 'Report snapshot not found',
				},
			});
		}

		const toast = {
			status: 200,
			type: 'delete',
			message: 'Market report deleted successfully',
		};

		return res.status(200).json({ toast, data: deleted[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Update report remarks
export async function updateMarketReportSnapshot(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid: snapshot_uuid } = req.params;
	const { report_name, remarks } = req.body;

	try {
		const updated = await db
			.update(market_report_archive)
			.set({
				report_name: report_name || market_report_archive.report_name,
				remarks: remarks || market_report_archive.remarks,
				updated_at: new Date(),
			})
			.where(eq(market_report_archive.uuid, snapshot_uuid))
			.returning();

		if (!updated.length) {
			return res.status(404).json({
				toast: {
					status: 404,
					type: 'error',
					message: 'Report snapshot not found',
				},
			});
		}

		const toast = {
			status: 200,
			type: 'update',
			message: 'Market report updated successfully',
		};

		return res.status(200).json({ toast, data: updated[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
