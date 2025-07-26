import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { packing_list_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// const { item_for } = req.body;

	req.body.map((item) => {
		if (item.item_for == 'thread' || item.item_for == 'sample_thread') {
			const { order_entry_uuid } = item;
			item.thread_order_entry_uuid = order_entry_uuid;
			item.order_entry_uuid = null;
		}
	});

	// if (item_for == 'thread' || item_for == 'sample_thread') {
	// 	const { order_entry_uuid } = req.body;
	// 	req.body.thread_order_entry_uuid = order_entry_uuid;
	// 	req.body.order_entry_uuid = null;
	// }

	const packing_list_entryPromise = db
		.insert(packing_list_entry)
		.values(req.body)
		.returning({ insertedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_for } = req.body;

	if (item_for == 'thread' || item_for == 'sample_thread') {
		const { order_entry_uuid } = req.body;
		req.body.thread_order_entry_uuid = order_entry_uuid;
		req.body.order_entry_uuid = null;
	}

	const packing_list_entryPromise = db
		.update(packing_list_entry)
		.set(req.body)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ updatedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.delete(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ deletedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const query = sql`
		SELECT 
			ple.uuid,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.thread_order_entry_uuid,
			ple.quantity::float8,
			ple.poli_quantity,
			ple.short_quantity::float8,
			ple.reject_quantity::float8,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_info_uuid ELSE toi.uuid END as order_info_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_number ELSE CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) END as order_number,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN CONCAT(vodf.item_description, ' - teeth: ', vodf.teeth_color_name) ELSE tc.count END as item_description,
			vodf.teeth_color_name,
			vodf.order_description_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.style ELSE toe.style END as style,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color ELSE toe.color END as color,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color_ref ELSE toe.color_ref END as color_ref,
			CASE 
				WHEN ple.sfg_uuid IS NOT NULL 
				THEN oe.size::float8 
				ELSE tc.length 
			END as size,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.quantity::float8 ELSE toe.quantity END as order_quantity,
			sfg.uuid as sfg_uuid,
			CASE WHEN sfg.uuid IS NOT NULL THEN sfg.warehouse::float8 ELSE toe.warehouse::float8 END as warehouse,
			CASE WHEN sfg.uuid IS NOT NULL THEN  sfg.delivered::float8 ELSE toe.delivered::float8 END as delivered,
			tc.cone_per_carton,
			vodf.order_type,
			vodf.is_inch,
			vodf.is_meter,
			CASE
				WHEN sfg.uuid IS NOT NULL
				THEN
					CASE
						WHEN order_type = 'tape'
						THEN (oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
						ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
					END
				ELSE (toe.quantity - toe.warehouse - toe.delivered)::float8
			END as balance_quantity
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
		LEFT JOIN
			thread.order_info toi ON toe.order_info_uuid = toi.uuid
		LEFT JOIN
			thread.count_length tc ON tc.uuid = toe.count_length_uuid
		ORDER BY
			ple.created_at, ple.uuid DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'packing list entry',
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
			ple.uuid,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.thread_order_entry_uuid,
			ple.quantity::float8,
			ple.poli_quantity,
			ple.short_quantity::float8,
			ple.reject_quantity::float8,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_info_uuid ELSE toi.uuid END as order_info_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_number ELSE CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) END as order_number,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.item_description ELSE tc.count END as item_description,
			vodf.order_description_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.style ELSE toe.style END as style,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color ELSE toe.color END as color,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color_ref ELSE toe.color_ref END as color_ref,
			CASE 
				WHEN ple.sfg_uuid IS NOT NULL 
				THEN oe.size::float8 
				ELSE tc.length 
			END as size,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.quantity::float8 ELSE toe.quantity END as order_quantity,
			sfg.uuid as sfg_uuid,
			CASE WHEN sfg.uuid IS NOT NULL THEN sfg.warehouse::float8 ELSE toe.warehouse::float8 END as warehouse,
			CASE WHEN sfg.uuid IS NOT NULL THEN  sfg.delivered::float8 ELSE toe.delivered::float8 END as delivered,
			tc.cone_per_carton,
			vodf.order_type,
			vodf.is_inch,
			vodf.is_meter,
			CASE
				WHEN sfg.uuid IS NOT NULL
				THEN
					CASE
						WHEN order_type = 'tape'
						THEN (oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
						ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
					END
				ELSE (toe.quantity - toe.warehouse - toe.delivered)::float8
			END as balance_quantity
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
		LEFT JOIN
			thread.order_info toi ON toe.order_info_uuid = toi.uuid
		LEFT JOIN
			thread.count_length tc ON tc.uuid = toe.count_length_uuid
		WHERE 
			ple.uuid = ${req.params.uuid}
		ORDER BY
			ple.created_at, ple.uuid DESC
	`;

	const packing_list_entryPromise = db.execute(query);

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing_list_entry',
		};
		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPackingListEntryByPackingListUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT DISTINCT
			CONCAT('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 5, '0')) as packing_number_v1,
        	CONCAT('PL', to_char(pl.created_at, 'YY-MM'), '-', pl.id::text) as packing_number,
			ple.uuid,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.thread_order_entry_uuid,
			ple.quantity::float8,
			ple.poli_quantity,
			coalesce(ple.short_quantity, 0)::float8 as short_quantity,
			coalesce(ple.reject_quantity, 0)::float8 as reject_quantity,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_info_uuid ELSE toi.uuid END as order_info_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_number ELSE CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) END as order_number,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN CONCAT(vodf.item_description, ' - teeth: ', vodf.teeth_color_name) ELSE tc.count END as item_description,
			vodf.order_description_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.style ELSE toe.style END as style,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color ELSE toe.color END as color,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color_ref ELSE toe.color_ref END as color_ref,
			CASE 
				WHEN ple.sfg_uuid IS NOT NULL THEN 
					CASE 
						WHEN vodf.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
							ELSE CAST(oe.size AS NUMERIC)
					END 
				ELSE tc.length 
			END as size_cm,
			CASE WHEN 
				ple.sfg_uuid IS NOT NULL THEN 
					CAST(oe.size AS NUMERIC)
				ELSE
					tc.length
			END as size,
			vodf.is_inch,
			concat(oe.style, ' / ', oe.color, ' / ', CAST(oe.size AS NUMERIC)) as style_color_size,
			CASE 
				WHEN ple.sfg_uuid IS NOT NULL THEN 
					CASE
						WHEN order_type = 'tape' THEN oe.size::float8 
						ELSE oe.quantity::float8 
					END
				ELSE toe.quantity::float8 
			END as order_quantity,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN sfg.warehouse::float8 ELSE toe.warehouse::float8 END as warehouse,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN sfg.delivered::float8 ELSE toe.delivered::float8 END as delivered,
			tc.cone_per_carton,
			vodf.order_type,
			vodf.is_inch,
			vodf.is_meter,
			CASE
				WHEN sfg.uuid IS NOT NULL
				THEN
					CASE
						WHEN order_type = 'tape'
						THEN (CAST(oe.size AS NUMERIC) - sfg.warehouse::float8 - sfg.delivered::float8)::float8
						ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
					END
				ELSE (toe.quantity - toe.warehouse - toe.delivered)::float8
			END as balance_quantity,
			CASE 
				WHEN ple.sfg_uuid IS NOT NULL THEN 
					CASE WHEN pl.item_for = 'sample_zipper' 
						THEN (ple.quantity + 
											CASE
												WHEN order_type = 'tape'
												THEN (oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
												ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
											END)::float8
						ELSE (ple.quantity + LEAST((
							CASE
								WHEN order_type = 'tape'
								THEN (oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
								ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
							END
						), sfg.finishing_prod)::float8)
					END
				ELSE 
					(ple.quantity + LEAST((toe.quantity - toe.warehouse - toe.delivered), toe.production_quantity)::float8)
				END as max_quantity,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN sfg.finishing_prod::float8 ELSE toe.production_quantity END as finishing_prod,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN zlr.name ELSE tlr.name END as recipe_name,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN zlr.uuid ELSE tlr.uuid END as recipe_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN zlr.sub_streat ELSE tlr.sub_streat END as sub_streat,
			pl.item_for,
			CASE 
				WHEN ple.sfg_uuid IS NULL THEN 'Meter'
				WHEN vodf.order_type = 'tape' THEN 'Meter' 
				WHEN vodf.order_type = 'slider' THEN 'Pcs'
				WHEN vodf.is_inch = 1 THEN 'Inch'
				ELSE 'Cm'
			END as unit
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN
			delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN 
			lab_dip.recipe zlr ON sfg.recipe_uuid = zlr.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
		LEFT JOIN 
			lab_dip.recipe tlr ON toe.recipe_uuid = tlr.uuid
		LEFT JOIN
			thread.order_info toi ON toe.order_info_uuid = toi.uuid
		LEFT JOIN
			thread.count_length tc ON tc.uuid = toe.count_length_uuid
		LEFT JOIN
			(SELECT
				tbe.order_entry_uuid,
				SUM(tbe.coning_production_quantity) as coning_production_quantity
			FROM
				thread.batch_entry tbe
			GROUP BY
				tbe.uuid) total_production_quantity ON total_production_quantity.order_entry_uuid = toe.uuid
		WHERE 
			ple.packing_list_uuid = ${req.params.packing_list_uuid}
		ORDER BY
			ple.created_at, ple.uuid DESC
	`;

	const packing_list_entryPromise = db.execute(query);

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing_list_entry',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPackingListEntryByChallanUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			ple.uuid,
			CONCAT('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 5, '0')) as packing_number_v1,
        	CONCAT('PL', to_char(pl.created_at, 'YY-MM'), '-', pl.id::text) as packing_number,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.thread_order_entry_uuid,
			coalesce(ple.quantity,0)::float8 as quantity,
			coalesce(ple.poli_quantity,0)::float8 as poli_quantity,
			coalesce(ple.short_quantity,0)::float8 as short_quantity,
			coalesce(ple.reject_quantity,0)::float8 as reject_quantity,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_info_uuid ELSE toi.uuid END as order_info_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.order_number ELSE CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) END as order_number,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.item_description ELSE tc.count END as item_description,
			CASE WHEN ple.sfg_uuid IS NOT NULL 
				THEN CONCAT(
                    vodf.lock_type_name, 
                    CASE WHEN (vodf.teeth_color_name IS NOT NULL OR vodf.teeth_color_name != '---') THEN ', teeth: ' ELSE '' END,
                    vodf.teeth_color_name, 
                    CASE WHEN (vodf.puller_color_name IS NOT NULL OR vodf.puller_color_name != '---') THEN ', puller: ' ELSE '' END,
                    vodf.puller_color_name, 
                    CASE WHEN (vodf.hand_name IS NOT NULL OR vodf.hand_name != '---') THEN ', ' ELSE '' END,
                    vodf.hand_name, 
                    CASE WHEN (vodf.coloring_type_name IS NOT NULL OR vodf.coloring_type_name != '---') THEN ', type: ' ELSE '' END, 
                    vodf.coloring_type_name, 
                    CASE WHEN (vodf.slider_name IS NOT NULL OR vodf.slider_name != '---') THEN ', ' ELSE '' END,
                    vodf.slider_name, 
                    CASE WHEN (vodf.top_stopper_name IS NOT NULL OR vodf.top_stopper_name != '---') THEN ', ' ELSE '' END,
                    vodf.top_stopper_name, 
                    CASE WHEN (vodf.bottom_stopper_name IS NOT NULL OR vodf.bottom_stopper_name != '---') THEN ', ' ELSE '' END,
                    vodf.bottom_stopper_name, 
                    CASE WHEN (vodf.logo_type_name IS NOT NULL OR vodf.logo_type_name != '---') THEN ', ' ELSE '' END,
                    vodf.logo_type_name, 
                    CASE WHEN (vodf.logo_type_name IS NOT NULL AND vodf.logo_type_name != '---') THEN 
                        CONCAT(
                            ' (', 
                            CASE WHEN vodf.is_logo_body = 1 THEN 'B' ELSE '' END, 
                            CASE WHEN vodf.is_logo_puller = 1 THEN ' P' ELSE '' END, 
                            ')'
                        ) 
                    ELSE '' 
                    END
				) 
				ELSE null
			END as specification,
			vodf.order_description_uuid,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.style ELSE toe.style END as style,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color ELSE toe.color END as color,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.color_ref ELSE toe.color_ref END as color_ref,
			CASE 
				WHEN ple.sfg_uuid IS NOT NULL 
				THEN CAST(oe.size AS NUMERIC)
				ELSE tc.length 
			END as size_cm,
			CASE WHEN
				ple.sfg_uuid IS NOT NULL THEN
					CAST(oe.size AS NUMERIC)
				ELSE
					tc.length
			END as size,
			vodf.is_inch,
			concat(oe.style, ' / ', oe.color, ' / ', CAST(oe.size AS NUMERIC)) as style_color_size,
			CASE WHEN ple.sfg_uuid IS NOT NULL THEN oe.quantity::float8 ELSE toe.quantity END as order_quantity,
			sfg.uuid as sfg_uuid,
			CASE WHEN sfg.uuid IS NOT NULL THEN sfg.warehouse::float8 ELSE toe.warehouse::float8 END as warehouse,
			CASE WHEN sfg.uuid IS NOT NULL THEN sfg.delivered::float8 ELSE toe.delivered::float8 END as delivered,
			tc.cone_per_carton,
			vodf.order_type,
			vodf.is_inch,
			vodf.is_meter,
			CASE
				WHEN sfg.uuid IS NOT NULL
				THEN
					CASE
						WHEN order_type = 'tape'
						THEN (oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
						ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8
					END
				ELSE (toe.quantity - toe.warehouse - toe.delivered)::float8
			END as balance_quantity,
			CASE WHEN sfg.uuid IS NOT NULL THEN zlr.name ELSE tlr.name END as recipe_name
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
		LEFT JOIN
			thread.order_info toi ON toe.order_info_uuid = toi.uuid
		LEFT JOIN
			thread.count_length tc ON tc.uuid = toe.count_length_uuid
		LEFT JOIN
			delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
		LEFT JOIN
			lab_dip.recipe zlr ON sfg.recipe_uuid = zlr.uuid
		LEFT JOIN
			lab_dip.recipe tlr ON toe.recipe_uuid = tlr.uuid
		WHERE 
			pl.challan_uuid = ${req.params.challan_uuid}
		ORDER BY
			pl.id ASC, vodf.item_description ASC, specification ASC, oe.style ASC, oe.color ASC, oe.size::float8 ASC
	`;

	const packing_list_entryPromise = db.execute(query);

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing_list_entry',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPackingListEntryByMultiPackingListUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;
	try {
		const { packing_list_uuids } = req.params;

		const api = await createApi(req);

		const fetchData = async (packing_list_uuid) =>
			await api
				.get(`/delivery/packing-list-entry/by/${packing_list_uuid}`)
				.then((response) => response);

		const packing_list_uuid = packing_list_uuids
			.split(',')
			.map(String)
			.map((String) => [String])
			.flat();

		const packing_list_entryPromise = await Promise.all(
			packing_list_uuid.map((uuid) => fetchData(uuid))
		);

		const response = {
			packing_list_entry: packing_list_entryPromise?.reduce(
				(acc, result) => {
					return [...acc, ...result?.data?.data];
				},
				[]
			),
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing_list_entry',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
