import { and, desc, eq, gte, lte, ilike, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { global_audit_log } from '../schema.js';

// Get all audit logs with optional filters
export async function selectAll(req, res, next) {
	const {
		schema_name,
		table_name,
		record_id,
		operation,
		from_date,
		to_date,
		limit = 100,
		offset = 0,
	} = req.query;

	try {
		const whereConditions = [];

		if (schema_name) {
			whereConditions.push(eq(global_audit_log.schema_name, schema_name));
		}
		if (table_name) {
			whereConditions.push(eq(global_audit_log.table_name, table_name));
		}
		if (record_id) {
			whereConditions.push(eq(global_audit_log.record_id, record_id));
		}
		if (operation) {
			whereConditions.push(eq(global_audit_log.operation, operation));
		}
		if (from_date) {
			whereConditions.push(
				gte(global_audit_log.changed_at, new Date(from_date))
			);
		}
		if (to_date) {
			whereConditions.push(
				lte(global_audit_log.changed_at, new Date(to_date))
			);
		}

		const query = db
			.select({
				id: global_audit_log.id,
				schema_name: global_audit_log.schema_name,
				table_name: global_audit_log.table_name,
				record_id: global_audit_log.record_id,
				operation: global_audit_log.operation,
				column_name: global_audit_log.column_name,
				old_value: global_audit_log.old_value,
				new_value: global_audit_log.new_value,
				changed_at: global_audit_log.changed_at,
				created_at: global_audit_log.created_at,
				remarks: global_audit_log.remarks,
			})
			.from(global_audit_log)
			.where(
				whereConditions.length > 0 ? and(...whereConditions) : undefined
			)
			.orderBy(desc(global_audit_log.changed_at))
			.limit(parseInt(limit))
			.offset(parseInt(offset));

		const data = await query;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Global audit logs',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get audit log by ID
export async function select(req, res, next) {
	const { id } = req.params;

	try {
		const data = await db
			.select({
				id: global_audit_log.id,
				schema_name: global_audit_log.schema_name,
				table_name: global_audit_log.table_name,
				record_id: global_audit_log.record_id,
				operation: global_audit_log.operation,
				column_name: global_audit_log.column_name,
				old_value: global_audit_log.old_value,
				new_value: global_audit_log.new_value,
				changed_at: global_audit_log.changed_at,
				created_at: global_audit_log.created_at,
				remarks: global_audit_log.remarks,
			})
			.from(global_audit_log)
			.where(eq(global_audit_log.id, id))
			.limit(1);

		const toast = {
			status: 200,
			type: 'select',
			message: 'Global audit log',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get audit summary for a specific record
export async function getRecordHistory(req, res, next) {
	const { schema_name, table_name, record_id } = req.params;

	try {
		const data = await db
			.select({
				id: global_audit_log.id,
				operation: global_audit_log.operation,
				column_name: global_audit_log.column_name,
				old_value: global_audit_log.old_value,
				new_value: global_audit_log.new_value,
				changed_at: global_audit_log.changed_at,
			})
			.from(global_audit_log)
			.where(
				and(
					eq(global_audit_log.schema_name, schema_name),
					eq(global_audit_log.table_name, table_name),
					eq(global_audit_log.record_id, record_id)
				)
			)
			.orderBy(desc(global_audit_log.changed_at));

		const toast = {
			status: 200,
			type: 'select',
			message: `Audit history for ${schema_name}.${table_name} record ${record_id}`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get audit summary statistics
export async function getAuditStats(req, res, next) {
	const { from_date, to_date } = req.query;

	try {
		const whereConditions = [];
		if (from_date) {
			whereConditions.push(
				gte(global_audit_log.changed_at, new Date(from_date))
			);
		}
		if (to_date) {
			whereConditions.push(
				lte(global_audit_log.changed_at, new Date(to_date))
			);
		}

		const stats = await db.execute(sql`
			SELECT 
				schema_name,
				table_name,
				operation,
				COUNT(*) as count,
				COUNT(DISTINCT record_id) as unique_records,
				COUNT(DISTINCT changed_by) as unique_users,
				MIN(changed_at) as first_change,
				MAX(changed_at) as last_change
			FROM audit.global_audit_log
			${whereConditions.length > 0 ? sql`WHERE ${sql.join(whereConditions, sql` AND `)}` : sql``}
			GROUP BY schema_name, table_name, operation
			ORDER BY schema_name, table_name, operation
		`);

		const summary = await db.execute(sql`
			SELECT 
				operation,
				COUNT(*) as total_count,
				COUNT(DISTINCT CONCAT(schema_name, '.', table_name, '.', record_id)) as unique_record_changes
			FROM audit.global_audit_log
			${whereConditions.length > 0 ? sql`WHERE ${sql.join(whereConditions, sql` AND `)}` : sql``}
			GROUP BY operation
			ORDER BY total_count DESC
		`);

		const toast = {
			status: 200,
			type: 'select',
			message: 'Audit statistics',
		};

		res.status(200).json({
			toast,
			data: {
				detailed_stats: stats.rows,
				summary_stats: summary.rows,
			},
		});
	} catch (error) {
		await handleError({ error, res });
	}
}

// Get recent activity (last N changes)
export async function getRecentActivity(req, res, next) {
	const { limit = 50 } = req.query;

	try {
		const data = await db
			.select({
				id: global_audit_log.id,
				schema_name: global_audit_log.schema_name,
				table_name: global_audit_log.table_name,
				record_id: global_audit_log.record_id,
				operation: global_audit_log.operation,
				column_name: global_audit_log.column_name,
				changed_at: global_audit_log.changed_at,
			})
			.from(global_audit_log)
			.orderBy(desc(global_audit_log.changed_at))
			.limit(parseInt(limit));

		const toast = {
			status: 200,
			type: 'select',
			message: 'Recent audit activity',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Search audit logs
export async function searchAuditLogs(req, res, next) {
	const { search_term, limit = 100, offset = 0 } = req.query;

	if (!search_term) {
		return res.status(400).json({
			toast: {
				status: 400,
				type: 'error',
				message: 'Search term is required',
			},
		});
	}

	try {
		const data = await db.execute(sql`
			SELECT 
				gal.id,
				gal.schema_name,
				gal.table_name,
				gal.record_id,
				gal.operation,
				gal.column_name,
				gal.old_value,
				gal.new_value,
				gal.changed_at
			FROM audit.global_audit_log gal
			WHERE 
				gal.old_value::text ILIKE ${`%${search_term}%`}
				OR gal.new_value::text ILIKE ${`%${search_term}%`}
				OR gal.record_id ILIKE ${`%${search_term}%`}
			ORDER BY gal.changed_at DESC
			LIMIT ${parseInt(limit)}
			OFFSET ${parseInt(offset)}
		`);

		const toast = {
			status: 200,
			type: 'select',
			message: `Search results for "${search_term}"`,
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Enable/Disable audit logging
export async function toggleAuditLogging(req, res, next) {
	const { enabled } = req.body;

	try {
		await db.execute(sql`SELECT audit.set_audit_enabled(${enabled})`);

		const toast = {
			status: 200,
			type: 'update',
			message: `Audit logging ${enabled ? 'enabled' : 'disabled'}`,
		};

		res.status(200).json({ toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Clean up old audit logs
export async function cleanupOldLogs(req, res, next) {
	const { days_to_keep = 90 } = req.body;

	try {
		const result = await db.execute(sql`
			DELETE FROM audit.global_audit_log 
			WHERE changed_at < NOW() - INTERVAL '${days_to_keep} days'
		`);

		const toast = {
			status: 200,
			type: 'delete',
			message: `Cleaned up audit logs older than ${days_to_keep} days. Deleted ${result.rowCount} records.`,
		};

		res.status(200).json({ toast });
	} catch (error) {
		await handleError({ error, res });
	}
}
