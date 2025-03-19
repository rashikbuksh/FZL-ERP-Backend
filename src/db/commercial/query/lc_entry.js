import { eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { lc_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lc_entryPromise = db
		.insert(lc_entry)
		.values(req.body)
		.returning({ insertedId: lc_entry.uuid });
	try {
		const data = await lc_entryPromise;
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

	const lc_entryPromise = db
		.update(lc_entry)
		.set(req.body)
		.where(eq(lc_entry.uuid, req.params.uuid))
		.returning({ updatedId: lc_entry.uuid });
	try {
		const data = await lc_entryPromise;
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

	const lc_entryPromise = db
		.delete(lc_entry)
		.where(eq(lc_entry.uuid, req.params.uuid))
		.returning({ deletedId: lc_entry.uuid });
	try {
		const data = await lc_entryPromise;
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
			lc_entry.uuid,
            lc_entry.lc_uuid,
			lc_entry.payment_date,
			lc_entry.ldbc_fdbc,
			lc_entry.acceptance_date,
			lc_entry.maturity_date,
			lc_entry.handover_date,
			lc_entry.receive_date,
			lc_entry.document_submission_date,
			lc_entry.bank_forward_date,
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
			message: 'lc_entry list',
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
			lc_entry.receive_date,
			lc_entry.document_submission_date,
			lc_entry.bank_forward_date,
            lc_entry.amount::float8,
            lc_entry.created_at,
			lc_entry.updated_at,
			lc_entry.remarks
		FROM
			commercial.lc_entry
		WHERE lc_entry.uuid = ${req.params.uuid}
		GROUP BY lc_entry.uuid`;

	const lc_entryPromise = db.execute(query);

	try {
		const data = await lc_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc_entry',
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
			lc_entry.receive_date,
			lc_entry.document_submission_date,
			lc_entry.bank_forward_date,
            lc_entry.created_at,
			lc_entry.updated_at,
			lc_entry.remarks
		FROM
			commercial.lc_entry
		WHERE lc_entry.lc_uuid = ${req.params.lc_uuid}
		ORDER BY lc_entry.created_at ASC`;

	const lc_entryPromise = db.execute(query);

	try {
		const data = await lc_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc_entry entry',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcEntryByLcNumber(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { lc_number } = req.params;

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
			lc_entry.receive_date,
			lc_entry.document_submission_date,
			lc_entry.bank_forward_date,
            lc_entry.created_at,
			lc_entry.updated_at,
			lc_entry.remarks
		FROM
			commercial.lc_entry
		LEFT JOIN 
			commercial.lc ON lc_entry.lc_uuid = lc.uuid
		WHERE lc.lc_number = ${lc_number}
		ORDER BY lc_entry.created_at ASC`;

	const lc_entryPromise = db.execute(query);

	try {
		const data = await lc_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'lc_entry entry',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
