import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { machine } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(machine)
		.values(req.body)
		.returning({ insertedName: machine.name });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(machine)
		.set(req.body)
		.where(eq(machine.uuid, req.params.uuid))
		.returning({ updatedName: machine.name });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const resultPromise = db
		.delete(machine)
		.where(eq(machine.uuid, req.params.uuid))
		.returning({ deletedName: machine.name });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: machine.uuid,
			name: machine.name,
			capacity: machine.capacity,
			water_capacity: machine.water_capacity,
			leveling_agent_uuid: machine.leveling_agent_uuid,
			leveling_agent_quantity: machine.leveling_agent_quantity,
			buffering_agent_uuid: machine.buffering_agent_uuid,
			buffering_agent_quantity: machine.buffering_agent_quantity,
			sequestering_agent_uuid: machine.sequestering_agent_uuid,
			sequestering_agent_quantity: machine.sequestering_agent_quantity,
			caustic_soad_uuid: machine.caustic_soad_uuid,
			caustic_soad_quantity: machine.caustic_soad_quantity,
			hydros_uuid: machine.hydros_uuid,
			hydros_quantity: machine.hydros_quantity,
			neotrolizer_uuid: machine.neotrolizer_uuid,
			neotrolizer_quantity: machine.neotrolizer_quantity,
			created_by: machine.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine.created_at,
			updated_at: machine.updated_at,
			remarks: machine.remarks,
		})

		.from(machine)
		.leftJoin(hrSchema.users, eq(machine.created_by, hrSchema.users.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Machine list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: machine.uuid,
			name: machine.name,
			capacity: machine.capacity,
			water_capacity: machine.water_capacity,
			leveling_agent_uuid: machine.leveling_agent_uuid,
			leveling_agent_quantity: machine.leveling_agent_quantity,
			buffering_agent_uuid: machine.buffering_agent_uuid,
			buffering_agent_quantity: machine.buffering_agent_quantity,
			sequestering_agent_uuid: machine.sequestering_agent_uuid,
			sequestering_agent_quantity: machine.sequestering_agent_quantity,
			caustic_soad_uuid: machine.caustic_soad_uuid,
			caustic_soad_quantity: machine.caustic_soad_quantity,
			hydros_uuid: machine.hydros_uuid,
			hydros_quantity: machine.hydros_quantity,
			neotrolizer_uuid: machine.neotrolizer_uuid,
			neotrolizer_quantity: machine.neotrolizer_quantity,
			created_by: machine.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine.created_at,
			updated_at: machine.updated_at,
			remarks: machine.remarks,
		})
		.from(machine)
		.leftJoin(hrSchema.users, eq(machine.created_by, hrSchema.users.uuid))
		.where(eq(machine.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Machine',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
