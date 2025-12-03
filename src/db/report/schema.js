import { pgSchema, text, timestamp, date } from 'drizzle-orm/pg-core';
import { users } from '../hr/schema.js';

// If you have a report schema, use it. Otherwise, use default public schema
export const reportSchema = pgSchema('report');

export const market_report_archive = reportSchema.table(
	'market_report_archive',
	{
		uuid: uuid_primary,
		report_name: text('report_name').notNull(),
		from_date: date('from_date').notNull(),
		to_date: date('to_date').notNull(),
		generated_at: timestamp('generated_at').defaultNow(),
		generated_by: defaultUUID('generated_by').references(() => users.uuid),
		status: text('status').default('pending'), // 'pending', 'confirmed', 'deleted'
		confirmed_at: timestamp('confirmed_at'),
		confirmed_by: defaultUUID('confirmed_by').references(() => users.uuid),
		file: text('file'),
		remarks: text('remarks'),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	}
);

// Relations for better type safety
import { relations } from 'drizzle-orm';
import { defaultUUID, uuid_primary } from '../variables.js';

export const marketReportArchiveRelations = relations(
	market_report_archive,
	({ one }) => ({
		generated_by_user: one(users, {
			fields: [market_report_archive.generated_by],
			references: [users.uuid],
			relationName: 'generated_by',
		}),
		confirmed_by_user: one(users, {
			fields: [market_report_archive.confirmed_by],
			references: [users.uuid],
			relationName: 'confirmed_by',
		}),
	})
);
