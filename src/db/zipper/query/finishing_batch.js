import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as sliderSchema from '../../slider/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as viewSchema from '../../view/schema.js';
import { finishing_batch } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchPromise = db
		.insert(finishing_batch)
		.values(req.body)
		.returning({
			insertedUuid: sql`concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text))`,
		});

	try {
		const data = await finishingBatchPromise;

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

	const finishingBatchPromise = db
		.update(finishing_batch)
		.set(req.body)
		.where(eq(finishing_batch.uuid, req.params.uuid))
		.returning({
			updatedUuid: sql`concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text))`,
		});

	try {
		const data = await finishingBatchPromise;

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

	const finishingBatchPromise = db
		.delete(finishing_batch)
		.where(eq(finishing_batch.uuid, req.params.uuid))
		.returning({
			deletedUuid: sql`concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text))`,
		});

	try {
		const data = await finishingBatchPromise;
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
	const resultPromise = db
		.select({
			uuid: finishing_batch.uuid,
			id: finishing_batch.id,
			batch_number: sql`concat('FB', to_char(${finishing_batch.created_at}, 'YY'::text), '-', lpad((${finishing_batch.id})::text, 4, '0'::text))`,
			order_info_uuid: viewSchema.v_order_details_full.order_info_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			order_type: viewSchema.v_order_details_full.order_type,
			slider_provided: viewSchema.v_order_details_full.slider_provided,
			order_description_uuid: finishing_batch.order_description_uuid,
			slider_lead_time: finishing_batch.slider_lead_time,
			dyeing_lead_time: finishing_batch.dyeing_lead_time,
			status: finishing_batch.status,
			slider_finishing_stock: finishing_batch.slider_finishing_stock,
			created_by: finishing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch.created_at,
			updated_at: finishing_batch.updated_at,
			remarks: finishing_batch.remarks,
			stock_uuid: sliderSchema.stock.uuid,
			stock_batch_quantity: sliderSchema.stock.batch_quantity,
			total_batch_quantity: sql`finishing_batch_entry_total.total_batch_quantity`,
			colors: sql`finishing_batch_entry_total.colors`,
			production_date: finishing_batch.production_date,
		})
		.from(finishing_batch)
		.leftJoin(
			viewSchema.v_order_details_full,
			eq(
				viewSchema.v_order_details_full.order_description_uuid,
				finishing_batch.order_description_uuid
			)
		)
		.leftJoin(
			sliderSchema.stock,
			eq(sliderSchema.stock.finishing_batch_uuid, finishing_batch.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, finishing_batch.created_by)
		)
		.leftJoin(
			sql`(
			SELECT 
				finishing_batch_uuid, 
				SUM(quantity) AS total_batch_quantity,
				(
				SELECT ARRAY_AGG(DISTINCT color) 
				FROM zipper.order_entry
				LEFT JOIN zipper.sfg ON order_entry.uuid = sfg.order_entry_uuid
				WHERE sfg.uuid = finishing_batch_entry.sfg_uuid
				) AS colors
			FROM 
				zipper.finishing_batch_entry
			GROUP BY 
				finishing_batch_entry.finishing_batch_uuid, finishing_batch_entry.sfg_uuid
			) as finishing_batch_entry_total`,
			sql`${finishing_batch.uuid} = finishing_batch_entry_total.finishing_batch_uuid`
		)
		.orderBy(desc(finishing_batch.created_at));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: finishing_batch.uuid,
			id: finishing_batch.id,
			batch_number: sql`concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text))`,
			order_info_uuid: viewSchema.v_order_details_full.order_info_uuid,
			order_number: viewSchema.v_order_details_full.order_number,
			item_description: viewSchema.v_order_details_full.item_description,
			order_type: viewSchema.v_order_details_full.order_type,
			slider_provided: viewSchema.v_order_details_full.slider_provided,
			order_description_uuid: finishing_batch.order_description_uuid,
			slider_lead_time: finishing_batch.slider_lead_time,
			dyeing_lead_time: finishing_batch.dyeing_lead_time,
			status: finishing_batch.status,
			slider_finishing_stock: finishing_batch.slider_finishing_stock,
			created_by: finishing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch.created_at,
			updated_at: finishing_batch.updated_at,
			remarks: finishing_batch.remarks,
			stock_uuid: sliderSchema.stock.uuid,
			stock_batch_quantity: sliderSchema.stock.batch_quantity,
			production_date: finishing_batch.production_date,
		})
		.from(finishing_batch)
		.leftJoin(
			viewSchema.v_order_details_full,
			eq(
				viewSchema.v_order_details_full.order_description_uuid,
				finishing_batch.order_description_uuid
			)
		)
		.leftJoin(
			sliderSchema.stock,
			eq(finishing_batch.uuid, sliderSchema.stock.finishing_batch_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch.created_by, hrSchema.users.uuid)
		)
		.where(eq(finishing_batch.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getFinishingBatchByFinishingBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		const api = await createApi(req);

		const { finishing_batch_uuid } = req.params;

		const { is_update } = req.query;

		const fetchData = async (endpoint) =>
			await api.get(`/zipper/${endpoint}/${finishing_batch_uuid}`);

		const [finishing_batch, finishing_batch_entry] = await Promise.all([
			fetchData('finishing-batch'),
			fetchData('finishing-batch-entry/by/finishing-batch-uuid'),
		]);

		let new_finishing_batch_entry = null;

		if (is_update === 'true') {
			// get order_description_uuid from finishing_batch
			const order_description_uuid =
				finishing_batch?.data?.data?.order_description_uuid;

			const order_description = await api.get(
				`/zipper/finishing-order-batch/${order_description_uuid}`
			);

			// remove the sfg_uuid from the order_description if that exists in the finishing_batch_entry
			const sfg_uuid = finishing_batch_entry?.data?.data?.map(
				(entry) => entry.sfg_uuid
			);

			new_finishing_batch_entry = order_description?.data?.data;

			if (sfg_uuid) {
				if (!Array.isArray(new_finishing_batch_entry)) {
					new_finishing_batch_entry = [];
				}
				new_finishing_batch_entry = new_finishing_batch_entry.filter(
					(uuid) => !sfg_uuid.includes(uuid.sfg_uuid)
				);
			}
		}

		const response = {
			...finishing_batch?.data?.data,
			finishing_batch_entry: finishing_batch_entry?.data?.data || [],
		};

		if (is_update === 'true') {
			response.new_finishing_batch_entry = new_finishing_batch_entry;
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
