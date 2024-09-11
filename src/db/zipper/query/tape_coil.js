import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { tape_coil } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.insert(tape_coil)
		.values(req.body)
		.returning({ insertedId: tape_coil.uuid });

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.update(tape_coil)
		.set(req.body)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning({ updatedId: tape_coil.uuid });

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.delete(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning({ deletedId: tape_coil.uuid });
	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(tape_coil);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_coil list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select()
		.from(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid));

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByNylon(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select()
		.from(tape_coil)
		.where(eq(tape_coil.type, 'nylon'));
	const toast = {
		status: 200,
		type: 'select',
		message: 'tape_coil',
	};
	handleResponse({ promise: tapeCoilPromise, res, next, ...toast });
}
