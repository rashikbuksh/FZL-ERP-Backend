import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { lc_entry_others } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lc_entry_othersPromise = db
		.insert(lc_entry_others)
		.values(req.body)
		.returning({ insertedId: lc_entry_others.uuid });
	try {
		const data = await lc_entry_othersPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lc_entry_othersPromise = db
		.update(lc_entry_others)
		.set(req.body)
		.where(eq(lc_entry_others.uuid, req.params.uuid))
		.returning({ updatedId: lc_entry_others.uuid });
	try {
		const data = await lc_entry_othersPromise;
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

	const lc_entry_othersPromise = db
		.delete(lc_entry_others)
		.where(eq(lc_entry_others.uuid, req.params.uuid))
		.returning({ deletedId: lc_entry_others.uuid });
	try {
		const data = await lc_entry_othersPromise;
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
	const query = sql`
		SELECT
			lc_entry_others.uuid,
            lc_entry_others.lc_uuid,
			lc_entry_others.ud_no,
			lc_entry_others.ud_received,
			lc_entry_others.up_number,
			lc_entry_others.up_number_updated_at,
            lc_entry_others.created_at,
			lc_entry_others.updated_at,
			lc_entry_others.remarks
		FROM
			commercial.lc_entry_others
		ORDER BY lc_entry_others.created_at DESC
		`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'lc_entry_others list',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			lc_entry_others.uuid,
            lc_entry_others.lc_uuid,
			lc_entry_others.ud_no,
			lc_entry_others.ud_received,
			lc_entry_others.up_number,
			lc_entry_others.up_number_updated_at,
            lc_entry_others.created_at,
			lc_entry_others.updated_at,
			lc_entry_others.remarks
		FROM
			commercial.lc_entry_others
		WHERE lc_entry_others.uuid = ${req.params.uuid}
		GROUP BY lc_entry_others.uuid`;

	const lc_entry_othersPromise = db.execute(query);

	try {
		const data = await lc_entry_othersPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc_entry_others',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcEntryOthersByLcUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			lc_entry_others.uuid,
            lc_entry_others.lc_uuid,
			lc_entry_others.ud_no,
			lc_entry_others.ud_received,
			lc_entry_others.up_number,
			lc_entry_others.up_number_updated_at,
            lc_entry_others.created_at,
			lc_entry_others.updated_at,
			lc_entry_others.remarks
		FROM
			commercial.lc_entry_others
		WHERE lc_entry_others.lc_uuid = ${req.params.lc_uuid}
		ORDER BY lc_entry_others.created_at ASC`;

	const lc_entry_othersPromise = db.execute(query);

	try {
		const data = await lc_entry_othersPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc_entry_others entry',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
