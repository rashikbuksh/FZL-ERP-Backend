import { and, desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
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
			uuid: sql`DISTINCT finishing_batch.uuid`,
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
			slider_finishing_stock: decimalToNumber(
				finishing_batch.slider_finishing_stock
			),
			created_by: finishing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch.created_at,
			updated_at: finishing_batch.updated_at,
			remarks: finishing_batch.remarks,
			stock_uuid: sliderSchema.stock.uuid,
			stock_batch_quantity: decimalToNumber(
				sliderSchema.stock.batch_quantity
			),
			total_batch_quantity: sql`finishing_batch_entry_total.total_batch_quantity::float8`,
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
				DISTINCT finishing_batch_uuid, 
				SUM(finishing_batch_entry.quantity) AS total_batch_quantity,
				ARRAY_AGG(DISTINCT order_entry.color) as colors
			FROM 
				zipper.finishing_batch_entry
			LEFT JOIN 
				zipper.sfg ON finishing_batch_entry.sfg_uuid = sfg.uuid
			LEFT JOIN 
				zipper.order_entry ON order_entry.uuid = sfg.order_entry_uuid
			GROUP BY 
				finishing_batch_entry.finishing_batch_uuid
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
			slider_finishing_stock: decimalToNumber(
				finishing_batch.slider_finishing_stock
			),
			created_by: finishing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch.created_at,
			updated_at: finishing_batch.updated_at,
			remarks: finishing_batch.remarks,
			stock_uuid: sliderSchema.stock.uuid,
			stock_batch_quantity: decimalToNumber(
				sliderSchema.stock.batch_quantity
			),
			total_batch_quantity: sql`finishing_batch_entry_total.total_batch_quantity::float8`,
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
				DISTINCT finishing_batch_uuid, 
				SUM(finishing_batch_entry.quantity) AS total_batch_quantity,
				ARRAY_AGG(DISTINCT order_entry.color) as colors
			FROM 
				zipper.finishing_batch_entry
			LEFT JOIN 
				zipper.sfg ON finishing_batch_entry.sfg_uuid = sfg.uuid
			LEFT JOIN 
				zipper.order_entry ON order_entry.uuid = sfg.order_entry_uuid
			GROUP BY 
				finishing_batch_entry.finishing_batch_uuid
			) as finishing_batch_entry_total`,
			sql`${finishing_batch.uuid} = finishing_batch_entry_total.finishing_batch_uuid`
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

export async function getFinishingBatchCapacityDetails(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { from_date, to_date } = req.query;
	console.log('from_date:', from_date);
	console.log('to_date:', to_date);
	const CapacityQuery = sql`
		SELECT
			item_properties.uuid AS item,
			item_properties.name AS item_name,
			nylon_stopper_properties.uuid AS nylon_stopper,
			nylon_stopper_properties.name AS nylon_stopper_name,
			zipper_number_properties.uuid AS zipper_number,
			zipper_number_properties.name AS zipper_number_name,
			end_type_properties.uuid AS end_type,
			end_type_properties.name AS end_type_name,
			production_capacity.quantity::float8 AS production_capacity_quantity,
			CONCAT(item_properties.short_name, nylon_stopper_properties.short_name, '-', zipper_number_properties.short_name, '-', end_type_properties.short_name) AS item_description,
			CONCAT(item_properties.short_name, nylon_stopper_properties.short_name, '-', zipper_number_properties.short_name, '-', end_type_properties.short_name,'(', production_capacity.quantity::float8, ')') AS item_description_quantity

		FROM
			public.production_capacity
		LEFT JOIN
			public.properties item_properties ON production_capacity.item = item_properties.uuid
		LEFT JOIN
			public.properties nylon_stopper_properties ON production_capacity.nylon_stopper = nylon_stopper_properties.uuid
		LEFT JOIN
			public.properties zipper_number_properties ON production_capacity.zipper_number = zipper_number_properties.uuid
		LEFT JOIN
			public.properties end_type_properties ON production_capacity.end_type = end_type_properties.uuid
			
	`;

	const resultPromise = sql`
	SELECT 
		subquery.item,
        subquery.nylon_stopper,
        subquery.zipper_number,
        subquery.end_type,
		subquery.production_date,
		SUM(subquery.total_batch_quantity)::float8 AS total_batch_quantity_sum,
		subquery.order_numbers AS order_numbers,
		subquery.batch_numbers AS batch_numbers
			FROM (
				SELECT 
					vodf.item,
					vodf.nylon_stopper,
					vodf.zipper_number,
					vodf.end_type,
					finishing_batch.production_date,
					SUM(finishing_batch_entry.quantity) AS total_batch_quantity,
					array_agg(DISTINCT vodf.order_number) AS order_numbers,
        array_agg(DISTINCT CONCAT('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text))) AS batch_numbers
				FROM
					zipper.finishing_batch
				LEFT JOIN
					zipper.v_order_details_full vodf ON vodf.order_description_uuid = finishing_batch.order_description_uuid
				LEFT JOIN
					public.production_capacity pc ON pc.item = vodf.item AND pc.nylon_stopper = vodf.nylon_stopper AND pc.zipper_number = vodf.zipper_number AND pc.end_type = vodf.end_type
				LEFT JOIN
					zipper.finishing_batch_entry ON finishing_batch.uuid = finishing_batch_entry.finishing_batch_uuid
				WHERE
					DATE(finishing_batch.production_date) BETWEEN ${from_date} AND ${to_date} 
				GROUP BY
					vodf.item,
					vodf.nylon_stopper,
					vodf.zipper_number,
					vodf.end_type,
					finishing_batch.production_date
			) subquery
            GROUP BY 
				subquery.item,
				subquery.nylon_stopper,
				subquery.zipper_number,
				subquery.end_type,
				subquery.production_date,
				subquery.order_numbers,
				subquery.batch_numbers
	`;

	try {
		const capacityQueryResult = await db.execute(CapacityQuery); // Fetch capacity query results
		const dataResult = await db.execute(resultPromise); // Fetch main query results
		// console.log('capacityQueryResult:', capacityQueryResult.rows);
		console.log('dataResult:', dataResult.rows);

		const formattedData = capacityQueryResult.rows.map((capacityRow) => {
			const matchingDataRow = dataResult.rows.find(
				(dataRow) =>
					dataRow.item === capacityRow.item &&
					dataRow.nylon_stopper === capacityRow.nylon_stopper &&
					dataRow.zipper_number === capacityRow.zipper_number &&
					dataRow.end_type === capacityRow.end_type
			);

			return {
				item_description_quantity:
					capacityRow.item_description_quantity,
				item_description: capacityRow.item_description,
				production_capacity_quantity:
					capacityRow.production_capacity_quantity,
				production_date: matchingDataRow
					? matchingDataRow.production_date.split(' ')[0]
					: null,
				production_quantity: matchingDataRow
					? matchingDataRow.total_batch_quantity_sum
					: 0,
				order_numbers: matchingDataRow
					? matchingDataRow.order_numbers
					: [],
				batch_numbers: matchingDataRow
					? matchingDataRow.batch_numbers
					: [],
			};
		});

		console.log('formattedData:', formattedData);

		const dateRange = [];
		let currentDate = new Date(from_date);
		const endDate = new Date(to_date);

		while (currentDate <= endDate) {
			dateRange.push(currentDate.toISOString().split('T')[0]);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		const groupedData = dateRange.reduce((acc, date) => {
			acc[date] = formattedData.map((item) => {
				const productionQuantity =
					item.production_date === date
						? item.production_quantity
						: 0;
				return {
					...item,
					production_date: date,
					production_quantity: productionQuantity,
				};
			});
			return acc;
		}, {});

		const response = Object.keys(groupedData).map((date) => ({
			production_date: date,
			data: groupedData[date],
		}));

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
