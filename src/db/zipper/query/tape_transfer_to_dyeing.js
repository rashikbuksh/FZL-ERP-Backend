import { eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { tape_transfer_to_dyeing } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(tape_transfer_to_dyeing)
		.values(req.body)
		.returning({
			insertedUuid: tape_transfer_to_dyeing.uuid,
		});

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(tape_transfer_to_dyeing)
		.set(req.body)
		.where(eq(tape_transfer_to_dyeing.uuid, req.params.uuid))
		.returning({ updatedUuid: tape_transfer_to_dyeing.uuid });

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(tape_transfer_to_dyeing)
		.where(eq(tape_transfer_to_dyeing.uuid, req.params.uuid))
		.returning({ deletedUuid: tape_transfer_to_dyeing.uuid });

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from, to, transfer_type } = req.query;

	const query = sql`
        SELECT
            tttd.uuid AS uuid,
            tttd.tape_coil_uuid,
            tc.name AS tape_coil_name,
            tttd.trx_quantity::float8 AS trx_quantity,
            tttd.tape_transfer_type,
            tttd.created_by,
            u.name AS created_by_name,
            tttd.created_at AS created_at,
            tttd.updated_at AS updated_at,
            tttd.remarks AS remarks
        FROM zipper.tape_transfer_to_dyeing tttd
        LEFT JOIN hr.users u ON tttd.created_by = u.uuid
        LEFT JOIN zipper.tape_coil tc ON tttd.tape_coil_uuid = tc.uuid
        WHERE 
            ${from && to ? sql`tttd.created_at BETWEEN ${from}::timestamp AND ${to}::timestamp + interval '23 hours 59 minutes 59 seconds'` : sql`TRUE`}
			${transfer_type ? sql`AND tttd.tape_transfer_type = ${transfer_type}` : sql``}
        ORDER BY tttd.created_at DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'tape_transfer_to_dyeing list',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const query = sql`
        SELECT
            tttd.uuid AS uuid,
            tttd.tape_coil_uuid,
            tc.name AS tape_coil_name,
            tttd.trx_quantity::float8 AS trx_quantity,
            tttd.tape_transfer_type,
            tttd.created_by,
            u.name AS created_by_name,
            tttd.created_at AS created_at,
            tttd.updated_at AS updated_at,
            tttd.remarks AS remarks
        FROM zipper.tape_transfer_to_dyeing tttd
        LEFT JOIN hr.users u ON tttd.created_by = u.uuid
        LEFT JOIN zipper.tape_coil tc ON tttd.tape_coil_uuid = tc.uuid
        WHERE tttd.uuid = ${req.params.uuid}
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_transfer_to_dyeing list',
		};

		return res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
