import {
	integer,
	jsonb,
	pgSchema,
	serial,
	text,
	timestamp,
	pgMaterializedView,
} from 'drizzle-orm/pg-core';
import { DateTime } from '../variables.js';

// Create audit schema
export const audit = pgSchema('audit');

// Global audit log table to track all database changes
export const global_audit_log = audit.table('global_audit_log', {
	id: serial('id').primaryKey(),

	// Table information
	schema_name: text('schema_name').notNull(),
	table_name: text('table_name').notNull(),
	record_id: text('record_id').notNull(), // The UUID/ID of the affected record

	// Operation details
	operation: text('operation').notNull(), // INSERT, UPDATE, DELETE
	column_name: text('column_name'), // NULL for INSERT/DELETE, specific column for UPDATE

	// Values
	old_value: jsonb('old_value'), // Previous value (NULL for INSERT)
	new_value: jsonb('new_value'), // New value (NULL for DELETE)

	// Change metadata
	changed_at: timestamp('changed_at', { withTimezone: true })
		.notNull()
		.defaultNow(),

	// Audit metadata
	remarks: text('remarks'),
});

// Materialized view for global audit log with aggregated data and optimized queries
export const global_audit_log_mv = audit.materializedView('global_audit_log_mv', {
	id: serial('id').primaryKey(),

	// Table information
	schema_name: text('schema_name').notNull(),
	table_name: text('table_name').notNull(),
	record_id: text('record_id').notNull(),

	// Operation details
	operation: text('operation').notNull(),
	column_name: text('column_name'),

	// Values
	old_value: jsonb('old_value'),
	new_value: jsonb('new_value'),

	// Change metadata
	changed_at: timestamp('changed_at', { withTimezone: true }).notNull(),

	// Additional computed fields for better performance
	change_date: timestamp('change_date', { withTimezone: true }).notNull(), // Date only for daily aggregations
	table_full_name: text('table_full_name').notNull(), // schema_name.table_name for easier filtering

	// Audit metadata
	remarks: text('remarks'),
}).as((qb) => {
	return qb
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
			change_date: qb.raw(`DATE(${global_audit_log.changed_at})`),
			table_full_name: qb.raw(`CONCAT(${global_audit_log.schema_name}, '.', ${global_audit_log.table_name})`),
			remarks: global_audit_log.remarks,
		})
		.from(global_audit_log);
});

export default audit;
