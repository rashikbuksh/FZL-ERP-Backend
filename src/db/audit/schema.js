import {
	integer,
	jsonb,
	pgSchema,
	serial,
	text,
	timestamp,
	pgMaterializedView,
} from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID } from '../variables.js';
import { users } from '../hr/schema.js';

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
	changed_by: defaultUUID('changed_by')
		.references(() => users.uuid)
		.default(null),

	// Audit metadata
	remarks: text('remarks'),
});

export default audit;
