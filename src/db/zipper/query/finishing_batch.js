import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
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
	const query = sql`
		SELECT 
			finishing_batch.uuid,
			finishing_batch.id,
			concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text)) as batch_number,
			vodf.order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_type,
			vodf.slider_provided,
			finishing_batch.order_description_uuid,
			vodf.item_description,
			finishing_batch.slider_lead_time,
			finishing_batch.dyeing_lead_time,
			finishing_batch.status,
			finishing_batch.slider_finishing_stock,
			finishing_batch.created_by,
			users.name as created_by_name,
			finishing_batch.created_at,
			finishing_batch.updated_at,
			finishing_batch.remarks,
			ss.uuid as stock_uuid,
			ss.batch_quantity as stock_batch_quantity
		FROM zipper.finishing_batch
		LEFT JOIN zipper.v_order_details_full vodf ON finishing_batch.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN slider.stock ss ON finishing_batch.uuid = ss.finishing_batch_uuid
		LEFT JOIN hr.users ON finishing_batch.created_by = users.uuid
		ORDER BY finishing_batch.created_at DESC
	`;

	const finishingBatchPromise = db.execute(query);

	try {
		const data = await finishingBatchPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch',
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
			finishing_batch.uuid,
			finishing_batch.id,
			concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text)) as batch_number,
			vodf.order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_type,
			vodf.slider_provided,
			finishing_batch.order_description_uuid,
			vodf.item_description,
			finishing_batch.slider_lead_time,
			finishing_batch.dyeing_lead_time,
			finishing_batch.status,
			finishing_batch.slider_finishing_stock,
			finishing_batch.created_by,
			users.name as created_by_name,
			finishing_batch.created_at,
			finishing_batch.updated_at,
			finishing_batch.remarks,
			ss.uuid as stock_uuid,
			ss.batch_quantity as stock_batch_quantity
		FROM zipper.finishing_batch
		LEFT JOIN zipper.v_order_details_full vodf ON finishing_batch.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN slider.stock ss ON finishing_batch.uuid = ss.finishing_batch_uuid
		LEFT JOIN hr.users ON finishing_batch.created_by = users.uuid
		WHERE finishing_batch.uuid = ${req.params.uuid}
		ORDER BY finishing_batch.created_at DESC
	`;

	const finishingBatchPromise = db.execute(query);

	try {
		const data = await finishingBatchPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch',
		};
		return res.status(200).json({ toast, data: data.rows[0] });
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

export async function selectFinishingBatchBySection(req, res, next) {
	const { section } = req.params;

	const { item_name, nylon_stopper } = req.query;

	const query = sql`
		SELECT
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			sfg.uuid as sfg_uuid,
			sfg.order_entry_uuid as order_entry_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			vod.order_info_uuid,
			oe.order_description_uuid as order_description_uuid,
			oe.style as style,
			oe.color as color,
			CASE 
                WHEN vod.is_inch = 1 
					THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                ELSE CAST(oe.size AS NUMERIC)
            END as size,
			concat(oe.style, '/', oe.color, '/', 
					CASE 
                        WHEN vod.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                        ELSE CAST(oe.size AS NUMERIC)
                    END
			) as style_color_size,
			oe.quantity::float8 as order_quantity,
			sfg.recipe_uuid as recipe_uuid,
			recipe.name as recipe_name,
			od.item,
			op_item.name as item_name,
			op_item.short_name as item_short_name,
			od.coloring_type,
			op_coloring_type.name as coloring_type_name,
			op_coloring_type.short_name as coloring_type_short_name,
			od.slider_finishing_stock::float8,
			sfg.dying_and_iron_prod::float8 as dying_and_iron_prod,
			sfg.teeth_molding_prod::float8 as teeth_molding_prod,
			sfg.teeth_coloring_stock::float8 as teeth_coloring_stock,
			sfg.finishing_stock::float8 as finishing_stock,
			sfg.finishing_prod::float8 as finishing_prod,
			sfg.warehouse::float8 as warehouse,
			sfg.delivered::float8 as delivered,
			sfg.pi::float8 as pi,
			sfg.short_quantity::float8,
			sfg.reject_quantity::float8,
			sfg.remarks as remarks,
			CASE 
				WHEN lower(${item_name}) = 'vislon'
					THEN (oe.quantity - (
						COALESCE(zfbe.finishing_prod, 0) + 
						COALESCE(zfbe.warehouse, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8 
				WHEN ${section} = 'finishing_prod'
					THEN (oe.quantity - (
						COALESCE(zfbe.finishing_prod, 0) + 
						COALESCE(zfbe.warehouse, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8 
				WHEN ${section} = 'teeth_coloring_prod'
					THEN (oe.quantity - (
						COALESCE(zfbe.finishing_stock, 0) + 
						COALESCE(zfbe.finishing_prod, 0) + 
						COALESCE(zfbe.finishing_prod, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8
				WHEN ${section} = 'teeth_molding_prod'
					THEN (oe.quantity - (
						COALESCE(zfbe.teeth_molding_prod, 0) + 
						COALESCE(zfbe.teeth_coloring_stock, 0) + 
						COALESCE(zfbe.finishing_stock, 0) + 
						COALESCE(zfbe.finishing_prod, 0) + 
						COALESCE(zfbe.warehouse, 0) + 
						COALESCE(sfg.delivered, 0)
					))::float8
				ELSE (oe.quantity - COALESCE(zfbe.warehouse, 0) - COALESCE(sfg.delivered, 0))::float8 END 
			as balance_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(trx_quantity)::float8 > 0 
							THEN SUM(trx_quantity)::float8
						ELSE SUM(trx_quantity_in_kg)::float8
					END
				FROM zipper.finishing_batch_transaction zfbt
				WHERE zfbt.finishing_batch_entry_uuid = zfbt.uuid AND zfbt.trx_from = ${section}
			), 0)::float8 as total_trx_quantity,
			COALESCE((
				SELECT 
					CASE 
						WHEN SUM(production_quantity)::float8 > 0 
							THEN SUM(production_quantity)::float8
						ELSE SUM(production_quantity_in_kg)::float8
					END
				FROM zipper.finishing_batch_production zfbp
				WHERE zfbp.finishing_batch_entry_uuid = zfbe.uuid AND 
					CASE 
						WHEN ${section} = 'finishing_prod' 
							THEN zfbp.section = 'finishing' 
						WHEN ${section} = 'teeth_coloring_prod'
							THEN zfbp.section = 'teeth_coloring'
						WHEN ${section} = 'teeth_molding_prod'
							THEN zfbp.section = 'teeth_molding'
						ELSE zfbp.section = ${section} END
			), 0)::float8 as total_production_quantity,
			od.tape_transferred,
			sfg.dyed_tape_used_in_kg,
			COALESCE(od.tape_received,0)::float8 as tape_received,
			COALESCE(od.tape_transferred,0)::float8 - COALESCE(sfg.dyed_tape_used_in_kg,0) as tape_stock,
			COALESCE(od.slider_finishing_stock,0)::float8 as slider_finishing_stock,
			od.is_multi_color
		FROM
			zipper.finishing_batch_entry zfbe
			LEFT JOIN zipper.sfg sfg ON zfbe.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.finishing_batch zfb ON zfbe.finishing_batch_uuid = zfb.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
			LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid AND zfb.order_description_uuid = vod.order_description_uuid
			LEFT JOIN zipper.order_description od ON oe.order_description_uuid = od.uuid
			LEFT JOIN public.properties op_item ON od.item = op_item.uuid
			LEFT JOIN public.properties op_coloring_type ON od.coloring_type = op_coloring_type.uuid
			WHERE
				od.tape_coil_uuid IS NOT NULL
				${item_name ? sql`AND lower(op_item.name) = lower(${item_name})` : sql``}
				${nylon_stopper ? sql`AND lower(vod.nylon_stopper_name) = lower(${nylon_stopper})` : sql``}
			ORDER BY oe.created_at, sfg.uuid DESC
		`;

	const sfgPromise = db.execute(query);

	try {
		const data = await sfgPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'sfg list',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
