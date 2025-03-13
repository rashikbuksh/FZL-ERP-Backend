import { and, desc, eq, sql } from 'drizzle-orm';
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
	const { type } = req.query;
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
			party_uuid: viewSchema.v_order_details_full.party_uuid,
			party_name: viewSchema.v_order_details_full.party_name,
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
			total_batch_production_quantity: sql`finishing_batch_entry_total.total_batch_production_quantity::float8`,
			colors: sql`finishing_batch_entry_total.colors`,
			production_date: sql`finishing_batch.production_date::date`,
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
					SUM(finishing_batch_entry.finishing_prod) as total_batch_production_quantity,
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
		.where(
			type === 'pending'
				? sql`finishing_batch_entry_total.total_batch_quantity - finishing_batch_entry_total.total_batch_production_quantity > 0`
				: type === 'completed'
					? sql`finishing_batch_entry_total.total_batch_quantity - finishing_batch_entry_total.total_batch_production_quantity = 0`
					: sql`1=1`
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
			production_date: sql`finishing_batch.production_date::date`,
			end_type_uuid: viewSchema.v_order_details_full.end_type,
			end_type_name: viewSchema.v_order_details_full.end_type_name,
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
			CONCAT(item_properties.short_name, nylon_stopper_properties.short_name, '-', zipper_number_properties.short_name, '-', end_type_properties.short_name,' (', production_capacity.quantity::float8, ')') AS item_description_quantity

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
		ORDER BY
			item_description ASC
	`;

	const resultPromise = sql`
	SELECT 
		subquery.item,
		subquery.item_name,
        subquery.nylon_stopper,
        subquery.zipper_number,
		subquery.zipper_number_name,
        subquery.end_type,
		subquery.end_type_name,
		subquery.production_date,
		SUM(subquery.total_batch_quantity)::float8 AS total_batch_quantity_sum,
		subquery.order_numbers AS order_numbers,
		subquery.batch_numbers AS batch_numbers
			FROM (
				SELECT 
					vodf.item,
					vodf.item_name,
					vodf.nylon_stopper,
					vodf.zipper_number,
					vodf.zipper_number_name,
					vodf.end_type,
					vodf.end_type_name,
					finishing_batch.production_date::date as production_date,
					SUM(finishing_batch_entry.quantity) AS total_batch_quantity,
					jsonb_agg(DISTINCT 
						jsonb_build_object(
							'batch_uuid', finishing_batch.uuid, 
							'batch_number', CONCAT('FB', to_char(finishing_batch.created_at, 'YY'), '-', lpad(finishing_batch.id::text, 4, '0')), 
							'order_description_uuid', vodf.order_description_uuid, 
							'order_number', vodf.order_number,
							'batch_quantity', fb_sum.batch_quantity::float8,
							'production_quantity', coalesce(fbp.production_quantity, 0)::float8,
							'balance_quantity', fb_sum.batch_quantity::float8 - coalesce(fbp.production_quantity, 0)::float8
						)
					) AS batch_numbers,
					jsonb_agg(DISTINCT jsonb_build_object('value', vodf.order_description_uuid, 'label', vodf.order_number)) AS order_numbers
				FROM
					zipper.finishing_batch
				LEFT JOIN
					zipper.v_order_details_full vodf ON vodf.order_description_uuid = finishing_batch.order_description_uuid
				LEFT JOIN
					public.production_capacity pc ON pc.item = vodf.item AND pc.nylon_stopper = vodf.nylon_stopper AND pc.zipper_number = vodf.zipper_number AND pc.end_type = vodf.end_type
				LEFT JOIN
					zipper.finishing_batch_entry ON finishing_batch.uuid = finishing_batch_entry.finishing_batch_uuid
				LEFT JOIN 
					(
						SELECT
							finishing_batch_entry.finishing_batch_uuid,
							SUM(finishing_batch_entry.quantity) as batch_quantity,
							SUM(finishing_batch_entry.finishing_prod) as total_finishing_production_quantity
						FROM
							zipper.finishing_batch_entry
						GROUP BY
							finishing_batch_entry.finishing_batch_uuid
					) fb_sum ON fb_sum.finishing_batch_uuid = finishing_batch.uuid
				LEFT JOIN 
					(
						SELECT
							finishing_batch_entry.finishing_batch_uuid,
							SUM(fbp.production_quantity) as production_quantity
						FROM
							zipper.finishing_batch_production fbp
						LEFT JOIN zipper.finishing_batch_entry ON finishing_batch_entry.uuid = fbp.finishing_batch_entry_uuid
						WHERE fbp.section = 'finishing'
						GROUP BY
							finishing_batch_entry.finishing_batch_uuid
					) fbp ON fbp.finishing_batch_uuid = finishing_batch.uuid
				WHERE
					${from_date && to_date ? sql`DATE(finishing_batch.production_date) BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
					AND fb_sum.batch_quantity::float8 - coalesce(fbp.production_quantity, 0)::float8 > 0
				GROUP BY
					vodf.item,
					vodf.item_name,
					vodf.nylon_stopper,
					vodf.zipper_number,
					vodf.zipper_number_name,
					vodf.end_type,
					vodf.end_type_name,
					finishing_batch.production_date
			) subquery
            GROUP BY 
				subquery.item,
				subquery.item_name,
				subquery.nylon_stopper,
				subquery.zipper_number,
				subquery.zipper_number_name,
				subquery.end_type,
				subquery.end_type_name,
				subquery.production_date,
				subquery.order_numbers,
				subquery.batch_numbers
	`;

	try {
		const capacityQueryResult = await db.execute(CapacityQuery); // Fetch capacity query results
		const dataResult = await db.execute(resultPromise); // Fetch main query results
		// console.log('dataResult:', dataResult.rows);

		const dateWiseData = {};

		dataResult.rows.forEach((dataRow) => {
			const productionDate = dataRow.production_date.split(' ')[0];
			if (!dateWiseData[productionDate]) {
				dateWiseData[productionDate] = [];
			}
			dateWiseData[productionDate].push(dataRow);
		});

		const zipperNumberUUID = capacityQueryResult.rows.find(
			(row) => row.zipper_number_name === '3'
		).zipper_number;

		const formattedData = capacityQueryResult.rows.reduce(
			(acc, capacityRow) => {
				const matchingDataRows = Object.keys(dateWiseData).reduce(
					(innerAcc, date) => {
						const filteredRows = dateWiseData[date].filter(
							(dataRow) => {
								const itemName =
									dataRow.item_name.toLowerCase();
								const endTypeName =
									dataRow.end_type_name.toLowerCase();
								const zipperNumberName =
									dataRow.zipper_number_name.toLowerCase();

								if (
									itemName === 'metal' &&
									endTypeName === 'close end' &&
									zipperNumberName === '4.5'
								) {
									return (
										dataRow.item === capacityRow.item &&
										dataRow.end_type ===
											capacityRow.end_type &&
										capacityRow.zipper_number ===
											zipperNumberUUID
									);
								} else {
									// Default matching criteria
									return (
										dataRow.item === capacityRow.item &&
										dataRow.nylon_stopper ===
											capacityRow.nylon_stopper &&
										dataRow.zipper_number ===
											capacityRow.zipper_number &&
										dataRow.end_type ===
											capacityRow.end_type
									);
								}
							}
						);
						return innerAcc.concat(filteredRows);
					},
					[]
				);

				const formattedRows = matchingDataRows.map(
					(matchingDataRow) => ({
						item_description_quantity:
							capacityRow.item_description_quantity,
						item_description: capacityRow.item_description,
						production_capacity_quantity:
							capacityRow.production_capacity_quantity,
						production_date:
							matchingDataRow.production_date.split(' ')[0],
						production_quantity:
							matchingDataRow.total_batch_quantity_sum,
						order_numbers: matchingDataRow.order_numbers,
						batch_numbers: matchingDataRow.batch_numbers,
						order_description_uuid:
							matchingDataRow.order_description_uuid,
						finishing_batch_uuid:
							matchingDataRow.finishing_batch_uuid,
					})
				);

				return acc.concat(formattedRows);
			},
			[]
		);

		const dateRange = [];
		let currentDate = new Date(from_date);
		const endDate = new Date(to_date);

		while (currentDate <= endDate) {
			dateRange.push(currentDate.toISOString().split('T')[0]);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		const groupedData = dateRange.reduce((acc, date) => {
			acc[date] = (
				formattedData.filter((item) => item.production_date === date) ||
				[]
			).map((item) => ({
				...item,
				production_date: date,
				production_quantity: item.production_quantity,
			}));

			// Add items with zero production quantity if they are not present for the current date
			capacityQueryResult.rows.forEach((capacityRow) => {
				const itemDescription = capacityRow.item_description;
				if (
					!acc[date].some(
						(d) => d.item_description === itemDescription
					)
				) {
					acc[date].push({
						production_capacity_quantity:
							capacityRow.production_capacity_quantity,
						item_description: itemDescription,
						item_description_quantity:
							capacityRow.item_description_quantity,
						production_date: date,
						production_quantity: 0,
						order_numbers: [],
						batch_numbers: [],
						order_description_uuid: null,
						finishing_batch_uuid: null,
					});
				}
			});

			// Sort the data based on the order of capacityQueryResult's item_description_quantity
			acc[date].sort((a, b) => {
				const aIndex = capacityQueryResult.rows.findIndex(
					(row) =>
						row.item_description_quantity ===
						a.item_description_quantity
				);
				const bIndex = capacityQueryResult.rows.findIndex(
					(row) =>
						row.item_description_quantity ===
						b.item_description_quantity
				);
				return aIndex - bIndex;
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

export async function getDailyProductionPlan(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { date, item } = req.query;

	const query = sql`
							SELECT
								DATE(production_date),
								vodf.item_description,
								vodf.order_number,
								vodf.party_name,
								zoe.style,
								zoe.color,
								zoe.size,
								zfbe.quantity::float8,
								vodf.order_type,
								CASE 
									WHEN vodf.order_type = 'tape' THEN 'Meter'
									WHEN vodf.is_inch = 1 THEN 'Inch'
									ELSE 'Cm'
								END AS unit,
								CONCAT('FB', to_char(zfb.created_at, 'YY'), '-', lpad(zfb.id::text, 4, '0')) AS batch_number
							FROM 
								zipper.finishing_batch zfb
							LEFT JOIN
								zipper.finishing_batch_entry zfbe ON zfb.uuid = zfbe.finishing_batch_uuid
							LEFT JOIN
								zipper.sfg zs ON zfbe.sfg_uuid = zs.uuid
							LEFT JOIN
								zipper.order_entry zoe ON zs.order_entry_uuid = zoe.uuid
							LEFT JOIN
								zipper.v_order_details_full vodf ON zfb.order_description_uuid = vodf.order_description_uuid
							WHERE
								DATE(zfb.production_date) = ${date} 
								AND zfbe.quantity - zfbe.finishing_prod > 0
								AND (${
									item == 'all' || item == ''
										? sql`1=1`
										: item == 'nylon_plastic'
											? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) = 'plastic'`
											: item == 'nylon'
												? sql`lower(vodf.item_name) = 'nylon' AND lower(vodf.nylon_stopper_name) != 'plastic'`
												: sql`lower(vodf.item_name) = ${item}`
								})
							ORDER BY
								vodf.order_number ASC, batch_number ASC, vodf.item_description, zoe.style ASC, zoe.color ASC, zoe.size ASC	
							`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'production_plan',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getPlanningInfoFromDateAndOrderDescription(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { date, order_description_uuid } = req.query;

	const orderAllItemQuery = sql`
		SELECT
			vodf.item,
			vodf.item_name,
			vodf.nylon_stopper,
			vodf.zipper_number,
			vodf.zipper_number_name,
			vodf.end_type,
			vodf.end_type_name
		FROM
			zipper.v_order_details_full vodf
		WHERE
			vodf.order_description_uuid = ${order_description_uuid}
	`;
	try {
		const orderAllItemResult = await db.execute(orderAllItemQuery);

		const orderQuery = sql`
					SELECT 
						finishing_batch.uuid as batch_uuid, 
						CONCAT('FB', to_char(finishing_batch.created_at, 'YY'), '-', lpad(finishing_batch.id::text, 4, '0')) as batch_number, 
						vodf.order_description_uuid as order_description_uuid, 
						vodf.order_number as order_number,
						fb_sum.batch_quantity::float8 as batch_quantity,
						coalesce(fbp.production_quantity, 0)::float8 as production_quantity,
						fb_sum.batch_quantity::float8 - coalesce(fbp.production_quantity, 0)::float8 as balance_quantity
					FROM
						zipper.finishing_batch
					LEFT JOIN
						zipper.v_order_details_full vodf ON vodf.order_description_uuid = finishing_batch.order_description_uuid
					LEFT JOIN 
						(
							SELECT
								finishing_batch_entry.finishing_batch_uuid,
								SUM(finishing_batch_entry.quantity) as batch_quantity,
								SUM(finishing_batch_entry.finishing_prod) as total_finishing_production_quantity
							FROM
								zipper.finishing_batch_entry
							GROUP BY
								finishing_batch_entry.finishing_batch_uuid
						) fb_sum ON fb_sum.finishing_batch_uuid = finishing_batch.uuid
					LEFT JOIN 
						(
							SELECT
								finishing_batch_entry.finishing_batch_uuid,
								SUM(fbp.production_quantity) as production_quantity
							FROM
								zipper.finishing_batch_production fbp
							LEFT JOIN zipper.finishing_batch_entry ON finishing_batch_entry.uuid = fbp.finishing_batch_entry_uuid
							WHERE fbp.section = 'finishing'
							GROUP BY
								finishing_batch_entry.finishing_batch_uuid
						) fbp ON fbp.finishing_batch_uuid = finishing_batch.uuid
					WHERE
						fb_sum.batch_quantity::float8 - coalesce(fbp.production_quantity, 0)::float8 > 0 
						AND ${date ? sql`DATE(finishing_batch.production_date) = ${date}` : sql`1=1`}
						AND ${orderAllItemResult.rows[0].item ? sql`vodf.item = ${orderAllItemResult.rows[0].item}` : sql`1=1`}
						AND ${orderAllItemResult.rows[0].item.toLowerCase() === 'metal' && (orderAllItemResult.rows[0].zipper_number_name === '3' || orderAllItemResult.rows[0].zipper_number_name === '4.5') ? sql`(vodf.zipper_number_name = '3' OR vodf.zipper_number_name = '4.5')` : orderAllItemResult.rows[0].zipper_number_name ? sql`vodf.zipper_number = ${orderAllItemResult.rows[0].zipper_number}` : sql`1=1`}
						AND ${orderAllItemResult.rows[0].end_type ? sql`vodf.end_type = ${orderAllItemResult.rows[0].end_type}` : sql`1=1`}
						AND ${orderAllItemResult.rows[0].nylon_stopper ? sql`vodf.nylon_stopper = ${orderAllItemResult.rows[0].nylon_stopper}` : sql`1=1`}
		`;

		const dataResult = await db.execute(orderQuery); // Fetch main query results

		const data = {
			batch_numbers: dataResult.rows,
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'production_plan',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
