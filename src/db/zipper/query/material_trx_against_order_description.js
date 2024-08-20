import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { material_trx_against_order_description } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const materialTrxAgainstOrderPromise = db
		.insert(material_trx_against_order_description)
		.values(req.body)
		.returning({
			insertedUuid: material_trx_against_order_description.uuid,
		});
	try {
		const data = await materialTrxAgainstOrderPromise;

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

	const materialTrxAgainstOrderPromise = db
		.update(material_trx_against_order_description)
		.set(req.body)
		.where(eq(material_trx_against_order_description.uuid, req.params.uuid))
		.returning({
			updatedUuid: material_trx_against_order_description.uuid,
		});

	try {
		const data = await materialTrxAgainstOrderPromise;
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

	const materialTrxAgainstOrderPromise = db
		.delete(material_trx_against_order_description)
		.where(eq(material_trx_against_order_description.uuid, req.params.uuid))
		.returning({
			deletedUuid: material_trx_against_order_description.uuid,
		});

	try {
		const data = await materialTrxAgainstOrderPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const query = sql`
    SELECT
        mtaod.uuid,
        mtaod.order_description_uuid,
        vod.order_number as order_number,
        mtaod.material_uuid,
        info.name as material_name,
        mtaod.trx_to,
        mtaod.trx_quantity,
        mtaod.created_by,
        users.name as created_by_name,
        mtaod.created_at,
        mtaod.updated_at
    FROM 
        zipper.material_trx_against_order_description mtaod
    LEFT JOIN
        zipper.v_order_details vod ON mtaod.order_description_uuid = vod.order_description_uuid
    LEFT JOIN
        material.info info ON mtaod.material_uuid = info.uuid
    LEFT JOIN
        hr.users users ON mtaod.created_by = users.uuid
    `;

	const materialTrxAgainstOrderPromise = db.execute(query);

	try {
		const data = await materialTrxAgainstOrderPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'material_trx_against_order_description list',
		};
		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
    SELECT
        mtaod.uuid,
        mtaod.order_description_uuid,
        vod.order_number as order_number,
        mtaod.material_uuid,
        info.name as material_name,
        mtaod.trx_to,
        mtaod.trx_quantity,
        mtaod.created_by,
        users.name as created_by_name,
        mtaod.created_at,
        mtaod.updated_at
    FROM 
        zipper.material_trx_against_order_description mtaod
    LEFT JOIN
        zipper.v_order_details vod ON mtaod.order_description_uuid = vod.order_description_uuid
    LEFT JOIN
        material.info info ON mtaod.material_uuid = info.uuid
    LEFT JOIN
        hr.users users ON mtaod.created_by = users.uuid
    WHERE
        mtaod.uuid = ${req.params.uuid}
    `;

	const materialTrxAgainstOrderPromise = db.execute(query);

	try {
		const data = await materialTrxAgainstOrderPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'material_trx_against_order_description details',
		};
		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
