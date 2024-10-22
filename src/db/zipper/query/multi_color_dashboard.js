import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { decimalToNumber } from '../../variables.js';
import { multi_color_dashboard } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchProductionPromise = db
		.insert(multi_color_dashboard)
		.values(req.body)
		.returning({ insertedUuid: multi_color_dashboard.uuid });

	try {
		const data = await batchProductionPromise;

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

	const batchProductionPromise = db
		.update(multi_color_dashboard)
		.set(req.body)
		.where(eq(multi_color_dashboard.uuid, req.params.uuid))
		.returning({ updatedUuid: multi_color_dashboard.uuid });

	try {
		const data = await batchProductionPromise;
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

	const batchProductionPromise = db
		.delete(multi_color_dashboard)
		.where(eq(multi_color_dashboard.uuid, req.params.uuid))
		.returning({ deletedUuid: multi_color_dashboard.uuid });

	try {
		const data = await batchProductionPromise;
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
	const query = sql`
		SELECT
			mcd.uuid,
			mcd.order_description_uuid,
			vodf.order_number,
			vodf.item_description,
			mcd.expected_tape_quantity::float8 AS expected_tape_quantity,
			mcd.is_swatch_approved,
			mcd.tape_quantity,
			mcd.coil_uuid,
			mi.name AS coil_name,
			mcd.coil_quantity::float8 AS coil_quantity,
			mcd.thread_name,
			mcd.thread_quantity::float8,
			mcd.is_coil_received_sewing,
			mcd.is_thread_received_sewing,
			mcd.remarks
		FROM
			zipper.multi_color_dashboard mcd
		LEFT JOIN
			material.info mi ON mcd.coil_uuid = mi.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON mcd.order_description_uuid = vodf.order_description_uuid;
	`;
	const resultPromise = db
		.select({
			uuid: multi_color_dashboard.uuid,
			order_description_uuid:
				multi_color_dashboard.order_description_uuid,
			expected_tape_quantity: decimalToNumber(
				multi_color_dashboard.expected_tape_quantity
			),
			is_swatch_approved: multi_color_dashboard.is_swatch_approved,
			tape_quantity: multi_color_dashboard.tape_quantity,
			coil_uuid: multi_color_dashboard.coil_uuid,
			coil_name: materialSchema.info.name,
			coil_quantity: decimalToNumber(multi_color_dashboard.coil_quantity),
			thread_name: multi_color_dashboard.thread_name,
			thread_quantity: multi_color_dashboard.thread_quantity,
			is_coil_received_sewing:
				multi_color_dashboard.is_coil_received_sewing,
			is_thread_received_sewing:
				multi_color_dashboard.is_thread_received_sewing,
			remarks: multi_color_dashboard.remarks,
		})
		.from(multi_color_dashboard)
		.leftJoin(
			materialSchema.info,
			eq(multi_color_dashboard.coil_uuid, materialSchema.info.uuid)
		)
		.leftJoin(
			sql`zipper.v_order_details`,
			eq(
				multi_color_dashboard.order_description_uuid,
				sql`v_order_details.order_description_uuid`
			)
		);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'multi_color_dashboard',
		};
		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: multi_color_dashboard.uuid,
			order_description_uuid:
				multi_color_dashboard.order_description_uuid,
			expected_tape_quantity: decimalToNumber(
				multi_color_dashboard.expected_tape_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				multi_color_dashboard.production_quantity_in_kg
			),
			is_swatch_approved: multi_color_dashboard.is_swatch_approved,
			tape_quantity: multi_color_dashboard.tape_quantity,
			coil_uuid: multi_color_dashboard.coil_uuid,
			coil_name: materialSchema.info.name,
			coil_quantity: decimalToNumber(multi_color_dashboard.coil_quantity),
			thread_name: multi_color_dashboard.thread_name,
			thread_quantity: multi_color_dashboard.thread_quantity,
			is_coil_received_sewing:
				multi_color_dashboard.is_coil_received_sewing,
			is_thread_received_sewing:
				multi_color_dashboard.is_thread_received_sewing,
			remarks: multi_color_dashboard.remarks,
		})
		.from(multi_color_dashboard)
		.leftJoin(
			materialSchema.info,
			eq(multi_color_dashboard.coil_uuid, materialSchema.info.uuid)
		)
		.leftJoin(
			sql`zipper.v_order_details`,
			eq(
				multi_color_dashboard.order_description_uuid,
				sql`v_order_details.order_description_uuid`
			)
		)
		.where(eq(multi_color_dashboard.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'multi_color_dashboard',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
