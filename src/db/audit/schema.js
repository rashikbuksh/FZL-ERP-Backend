import {
	integer,
	jsonb,
	pgSchema,
	serial,
	text,
	timestamp,
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

export default audit;
