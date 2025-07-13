import { boolean, pgSchema, serial, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';
import { material } from '../schema.js';

const maintain = pgSchema('maintain');

export const section_machine = maintain.table('section_machine', {
	id: serial('id'),
	uuid: uuid_primary,
	section: text().notNull(),
	name: text().notNull(),
	status: boolean().default(false),
	created_at: DateTime().notNull(),
	updated_at: DateTime().default(null),
	created_by: defaultUUID('created_by')
		.references(() => hrSchema.users.uuid)
		.notNull(),
	remarks: text().default(null),
});

export const machine_problem_type = maintain.enum('machine_problem_type', [
	'machine',
	'others',
]);

export const maintain_condition_type = maintain.enum(
	'maintain_condition_type',
	['okay', 'waiting', 'pending']
);

export const machine_problem = maintain.table('machine_problem', {
	id: serial('id'),
	uuid: uuid_primary,
	// ---------------- Machine Problem Info ----------------
	section_machine_uuid: defaultUUID('section_machine_uuid')
		.references(() => section_machine.uuid)
		.notNull(),
	section: text('section').notNull(),
	problem_type: machine_problem_type().default('machine'),
	description: text('description').notNull(),
	emergence: text('emergence').notNull(),
	// ---------------- Machine Maintain Info ----------------
	maintain_condition: maintain_condition_type().default('pending'),
	maintain_description: text('maintain_description').default(null),
	maintain_date: DateTime('maintain_date').default(null),
	maintain_by: defaultUUID('maintain_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	maintain_remarks: text('maintain_remarks').default(null),
	// ---------------- Machine Verification Info ----------------
	verification_approved: boolean('verification_approved').default(false),
	verification_date: DateTime('verification_date').default(null),
	verification_by: defaultUUID('verification_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	verification_remarks: text('verification_remarks').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text().default(null),
});

export const machine_problem_procurement = maintain.table(
	'machine_problem_procurement',
	{
		uuid: uuid_primary,
		machine_problem_uuid: defaultUUID('machine_problem_uuid').references(
			() => machine_problem.uuid
		),
		material_uuid: defaultUUID('material_uuid').references(
			() => material.uuid
		),
		quantity: PG_DECIMAL('quantity').notNull(),
		description: text('description').default(null),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		remarks: text().default(null),
	}
);

export default maintain;
