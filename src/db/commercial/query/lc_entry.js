import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { lc, pi_cash } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.insert(lc)
		.values(req.body)
		.returning({ insertedId: lc.lc_number });
	try {
		const data = await lcPromise;
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

	const lcPromise = db
		.update(lc)
		.set(req.body)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ updatedId: lc.lc_number });
	try {
		const data = await lcPromise;
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

	const lcPromise = db
		.delete(lc)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ deletedId: lc.lc_number });
	try {
		const data = await lcPromise;
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
	const { own_uuid } = req?.query;

	const query = sql`
		SELECT
			lc_entry.uuid,
            lc_entry.lc_uuid,
			lc_entry.payment_date,
			lc_entry.ldbc_fdbc,
			lc_entry.acceptance_date,
			lc_entry.maturity_date,
			lc_entry.handover_date,
			lc_entry.document_receive_date,
			lc_entry.payment_value::float8,
            lc_entry.amount::float8,
            lc_entry.created_at,
			lc_entry.updated_at,
			lc_entry.remarks
		FROM
			commercial.lc_entry
		ORDER BY lc_entry.created_at DESC
		`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'lc list',
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
			lc_entry.uuid,
            lc_entry.lc_uuid,
			lc_entry.payment_date,
			lc_entry.ldbc_fdbc,
			lc_entry.acceptance_date,
			lc_entry.maturity_date,
			lc_entry.handover_date,
			lc_entry.document_receive_date,
			lc_entry.payment_value::float8,
            lc_entry.amount::float8,
            lc_entry.created_at,
			lc_entry.updated_at,
			lc_entry.remarks
		FROM
			commercial.lc_entry
		WHERE lc_entry.uuid = ${req.params.uuid}
		GROUP BY lc_entry.uuid`;

	const lcPromise = db.execute(query);

	try {
		const data = await lcPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcEntryByLcUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			lc_entry.uuid,
            lc_entry.lc_uuid,
			lc_entry.payment_date,
			lc_entry.ldbc_fdbc,
			lc_entry.acceptance_date,
			lc_entry.maturity_date,
			lc_entry.handover_date,
			lc_entry.document_receive_date,
			lc_entry.payment_value::float8,
            lc_entry.amount::float8,
            lc_entry.created_at,
			lc_entry.updated_at,
			lc_entry.remarks
		FROM
			commercial.lc_entry
		WHERE lc_entry.lc_uuid = ${req.params.lc_uuid}
		GROUP BY lc_entry.uuid`;

	const lcPromise = db.execute(query);

	try {
		const data = await lcPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc entry',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
