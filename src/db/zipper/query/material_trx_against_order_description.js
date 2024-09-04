import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { material_trx_against_order_description } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const materialTrxAgainstOrderPromise = db
		.insert(material_trx_against_order_description)
		.values(req.body)
		.returning({
			insertedUuid: material_trx_against_order_description.material_uuid,
		});
	try {
		const data = await materialTrxAgainstOrderPromise;

		const materialName = db
			.select({
				insertedUuid: materialSchema.info.name,
			})
			.from(materialSchema.info)
			.where(eq(materialSchema.info.uuid, data[0].insertedUuid));

		const materialNameData = await materialName;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${materialNameData[0].insertedUuid} inserted`,
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
			updatedUuid: material_trx_against_order_description.material_uuid,
		});

	try {
		const data = await materialTrxAgainstOrderPromise;

		const materialName = db
			.select({
				updatedUuid: materialSchema.info.name,
			})
			.from(materialSchema.info)
			.where(eq(materialSchema.info.uuid, data[0].updatedUuid));

		const materialNameData = await materialName;

		const toast = {
			status: 201,
			type: 'update',
			message: `${materialNameData[0].updatedUuid} updated`,
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
			deletedUuid: material_trx_against_order_description.material_uuid,
		});

	try {
		const data = await materialTrxAgainstOrderPromise;

		const materialName = db
			.select({
				deletedUuid: materialSchema.info.name,
			})
			.from(materialSchema.info)
			.where(eq(materialSchema.info.uuid, data[0].deletedUuid));

		const materialNameData = await materialName;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${materialNameData[0].deletedUuid} deleted`,
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
		vod.item_description,
        mtaod.material_uuid,
        info.name as material_name,
        mtaod.trx_to,
        mtaod.trx_quantity,
        mtaod.created_by,
		info.unit,
		stock.stock,
        users.name as created_by_name,
        mtaod.created_at,
        mtaod.updated_at,
		mtaod.remarks
    FROM 
        zipper.material_trx_against_order_description mtaod
    LEFT JOIN
        zipper.v_order_details vod ON mtaod.order_description_uuid = vod.order_description_uuid
    LEFT JOIN
        material.info info ON mtaod.material_uuid = info.uuid
    LEFT JOIN
        hr.users users ON mtaod.created_by = users.uuid
	LEFT JOIN 
		material.stock stock ON mtaod.material_uuid = stock.material_uuid
	ORDER BY mtaod.created_at DESC
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
		vod.item_description,
        mtaod.material_uuid,
        info.name as material_name,
        mtaod.trx_to,
        mtaod.trx_quantity,
        mtaod.created_by,
		info.unit,
		stock.stock,
        users.name as created_by_name,
        mtaod.created_at,
        mtaod.updated_at,
		mtaod.remarks
    FROM 
        zipper.material_trx_against_order_description mtaod
    LEFT JOIN
        zipper.v_order_details vod ON mtaod.order_description_uuid = vod.order_description_uuid
    LEFT JOIN
        material.info info ON mtaod.material_uuid = info.uuid
    LEFT JOIN
        hr.users users ON mtaod.created_by = users.uuid
	LEFT JOIN 
		material.stock stock ON mtaod.material_uuid = stock.material_uuid
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
		res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterialTrxLogAgainstOrderByTrxTo(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
    SELECT
        mtaod.uuid,
        mtaod.order_description_uuid,
        vod.order_number as order_number,
		vod.item_description,
        mtaod.material_uuid,
        info.name as material_name,
        mtaod.trx_to,
        mtaod.trx_quantity,
        mtaod.created_by,
		info.unit,
		stock.stock,
        users.name as created_by_name,
        mtaod.created_at,
        mtaod.updated_at,
		mtaod.remarks
    FROM 
        zipper.material_trx_against_order_description mtaod
    LEFT JOIN
        zipper.v_order_details vod ON mtaod.order_description_uuid = vod.order_description_uuid
    LEFT JOIN
        material.info info ON mtaod.material_uuid = info.uuid
    LEFT JOIN
        hr.users users ON mtaod.created_by = users.uuid
	LEFT JOIN 
		material.stock stock ON mtaod.material_uuid = stock.material_uuid
    WHERE
        mtaod.trx_to = ${req.params.trx_to}
    `;

	const materialTrxAgainstOrderPromise = db.execute(query);

	try {
		const data = await materialTrxAgainstOrderPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'material_trx_against_order_description details by trx_to',
		};
		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterialTrxAgainstOrderDescriptionByMultipleTrxTo(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	try {
		const api = await createApi(req);

		const { trx_tos } = req.params;

		const trx_to = trx_tos.split(',');

		const fetchData = async (endpoint) =>
			await api
				.get(`/zipper/material-trx-against-order/by/${endpoint}`)
				.then((res) => {
					return res?.data;
				});

		const promises = trx_to.map(async (field) => {
			const data = await fetchData(field);
			return data;
		});

		const results = await Promise.all(promises);

		const data = results.reduce((acc, result, index) => {
			return [
				...acc,
				...(Array.isArray(result?.data) ? result?.data : []),
			];
		}, []);

		const toast = {
			status: 200,
			type: 'select',
			message:
				'material_trx_against_order_description by multiple trx_to',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
