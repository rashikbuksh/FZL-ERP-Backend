import { boolean, pgSchema, serial, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';
import * as materialSchema from '../material/schema.js';

export const maintain = pgSchema('maintain');

export const section_machine = maintain.table('section_machine', {
	id: serial('id'),
	uuid: uuid_primary,
	section: text().notNull(),
	name: text().notNull(),
	status: boolean().default(false),
	created_at: DateTime().notNull(),
	updated_at: DateTime().default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
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
	['okay', 'rejected', 'waiting', 'ongoing']
);

export const parts_enum = maintain.enum('parts_enum', [
	'die_casting',
	'assembly',
	'electro_plating',
	'painting',
	'thread',
	'zipper',
	'teeth_molding',
	'box_pin',
	'iron',
	'finishing',
	'teeth_coloring',
]);

export const issue = maintain.table('issue', {
	id: serial('id'),
	uuid: uuid_primary,
	// ---------------- Machine Problem Info ----------------
	section_machine_uuid: defaultUUID('section_machine_uuid')
		.references(() => section_machine.uuid)
		.notNull(),
	section: text('section').notNull(),
	extra_section: text('extra_section').default('normal'),
	problem_type: machine_problem_type().default('machine'),
	description: text('description').notNull(),
	emergence: text('emergence').notNull(),
	parts_problem: parts_enum('parts_enum').default(null),
	// ---------------- Machine Maintain Info ----------------
	maintain_condition: maintain_condition_type().default('waiting'),
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
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text().default(null),
});

export const issue_procurement = maintain.table('issue_procurement', {
	uuid: uuid_primary,
	issue_uuid: defaultUUID('issue_uuid').references(() => issue.uuid),
	material_uuid: defaultUUID('material_uuid').references(
		() => materialSchema.info.uuid
	),
	quantity: PG_DECIMAL('quantity').notNull(),
	description: text('description').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text().default(null),
});

export default maintain;
