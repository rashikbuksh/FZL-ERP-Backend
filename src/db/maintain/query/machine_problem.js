import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { machine_problem, section_machine } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

const maintain_by_user = alias(hrSchema.users, 'maintain_by_user');
const verification_by_user = alias(hrSchema.users, 'verification_by_user');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const machine_problemEntryPromise = db
		.insert(machine_problem)
		.values(req.body)
		.returning({ insertedUuid: machine_problem.uuid });

	try {
		const data = await machine_problemEntryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const machine_problemEntryPromise = db
		.update(machine_problem)
		.set(req.body)
		.where(eq(machine_problem.uuid, req.params.uuid))
		.returning({ updatedUuid: machine_problem.uuid });

	try {
		const data = await machine_problemEntryPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const machine_problemEntryPromise = db
		.delete(machine_problem)
		.where(eq(machine_problem.uuid, req.params.uuid))
		.returning({ deletedUuid: machine_problem.uuid });

	try {
		const data = await machine_problemEntryPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const machine_problemEntryPromise = db
		.select({
			id: machine_problem.id,
			uuid: machine_problem.uuid,
			machine_problem_id: sql`concat('MT', to_char(machine_problem.created_at, 'YY'), '-', machine_problem.id::text)`,
			section_machine_uuid: machine_problem.section_machine_uuid,
			section_machine_name: section_machine.name,
			section: machine_problem.section,
			problem_type: machine_problem.problem_type,
			description: machine_problem.description,
			emergence: machine_problem.emergence,
			maintain_condition: machine_problem.maintain_condition,
			maintain_description: machine_problem.maintain_description,
			maintain_date: machine_problem.maintain_date,
			maintain_by: machine_problem.maintain_by,
			maintain_by_name: maintain_by_user.name,
			maintain_remarks: machine_problem.maintain_remarks,
			verification_approved: machine_problem.verification_approved,
			verification_date: machine_problem.verification_date,
			verification_by: machine_problem.verification_by,
			verification_by_name: verification_by_user.name,
			verification_remarks: machine_problem.verification_remarks,
			created_by: machine_problem.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine_problem.created_at,
			updated_at: machine_problem.updated_at,
			remarks: machine_problem.remarks,
		})
		.from(machine_problem)
		.leftJoin(
			section_machine,
			eq(machine_problem.section_machine_uuid, section_machine.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(machine_problem.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			maintain_by_user,
			eq(machine_problem.maintain_by, maintain_by_user.uuid)
		)
		.leftJoin(
			verification_by_user,
			eq(machine_problem.verification_by, verification_by_user.uuid)
		)
		.where(eq(machine_problem.uuid, req.params.uuid));

	try {
		const data = await machine_problemEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'machine_problem selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const machine_problemEntryPromise = db
		.select({
			id: machine_problem.id,
			uuid: machine_problem.uuid,
			machine_problem_id: sql`concat('MT', to_char(machine_problem.created_at, 'YY'), '-', machine_problem.id::text)`,
			section_machine_uuid: machine_problem.section_machine_uuid,
			section_machine_name: section_machine.name,
			section: machine_problem.section,
			problem_type: machine_problem.problem_type,
			description: machine_problem.description,
			emergence: machine_problem.emergence,
			maintain_condition: machine_problem.maintain_condition,
			maintain_description: machine_problem.maintain_description,
			maintain_date: machine_problem.maintain_date,
			maintain_by: machine_problem.maintain_by,
			maintain_by_name: maintain_by_user.name,
			maintain_remarks: machine_problem.maintain_remarks,
			verification_approved: machine_problem.verification_approved,
			verification_date: machine_problem.verification_date,
			verification_by: machine_problem.verification_by,
			verification_by_name: verification_by_user.name,
			verification_remarks: machine_problem.verification_remarks,
			created_by: machine_problem.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine_problem.created_at,
			updated_at: machine_problem.updated_at,
			remarks: machine_problem.remarks,
		})
		.from(machine_problem)
		.leftJoin(
			section_machine,
			eq(machine_problem.section_machine_uuid, section_machine.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(machine_problem.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			maintain_by_user,
			eq(machine_problem.maintain_by, maintain_by_user.uuid)
		)
		.leftJoin(
			verification_by_user,
			eq(machine_problem.verification_by, verification_by_user.uuid)
		)
		.orderBy(desc(machine_problem.created_at));

	try {
		const data = await machine_problemEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'machine_problem selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
