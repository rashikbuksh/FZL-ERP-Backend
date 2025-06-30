import { asc, desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import {
	dyeing_batch_entry,
	finishing_batch_entry,
	finishing_batch_production,
	order_description,
	order_entry,
	order_entry_log,
	sfg,
} from '../schema.js';

const findOrCreateArray = (array, key, value, createFn) => {
	if (!array) {
		array = [];
	}
	let index = array.findIndex((item) =>
		key
			.map((indKey, index) => item[indKey] === value[index])
			.every((item) => item)
	);
	if (index === -1) {
		array.push(createFn());
		index = array.length - 1;
	}
	return array[index];
};

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const order_entryPromise = db
		.insert(order_entry)
		.values(req.body)
		.returning({ insertedUuid: order_entry.uuid });

	try {
		const data = await order_entryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} added`,
		};

		res.status(201).send({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		order_description_uuid,
		style,
		color,
		size,
		quantity,
		company_price,
		party_price,
		status,
		swatch_status,
		swap_approval_date,
		bleaching,
		created_by,
		created_at,
		updated_at,
		remarks,
		index,
		color_ref,
		color_ref_update_date,
	} = req.body;

	const order_entryPromise = db
		.update(order_entry)
		.set({
			order_description_uuid,
			style,
			color,
			size,
			quantity,
			company_price,
			party_price,
			status,
			swatch_status,
			swap_approval_date,
			bleaching,
			created_by,
			created_at,
			updated_at,
			remarks,
			index,
			color_ref,
			color_ref_update_date,
		})
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: order_entry.uuid });

	try {
		const data = await order_entryPromise;

		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(200).send({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryLogPromise = db
		.delete(order_entry_log)
		.where(eq(order_entry_log.order_entry_uuid, req.params.uuid))
		.returning({ deletedIdOrderEntryLog: order_entry_log.id });

	const sfgPromise = db
		.delete(sfg)
		.where(eq(sfg.order_entry_uuid, req.params.uuid))
		.returning({ deletedUuidSfg: sfg.uuid });

	const orderEntryPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: order_entry.uuid });

	try {
		await orderEntryLogPromise;
		await sfgPromise;
		const data = await orderEntryPromise;

		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).send({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const order_entryPromise = db
		.select()
		.from(order_entry)
		.orderBy(desc(order_entry.created_at));

	try {
		const data = await order_entryPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Entry',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const order_entryPromise = db
		.select()
		.from(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid));

	try {
		const data = await order_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Entry',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderEntryFullByOrderDescriptionUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { order_description_uuid } = req.params;

	const orderEntryPromise = db
		.select({
			order_entry_uuid: order_entry.uuid,
			order_description_uuid: order_entry.order_description_uuid,
			style: order_entry.style,
			color: order_entry.color,
			color_ref: order_entry.color_ref,
			color_ref_entry_date: order_entry.color_ref_entry_date,
			color_ref_update_date: order_entry.color_ref_update_date,
			size: order_entry.size,
			is_inch: order_description.is_inch,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			order_entry_status: order_entry.status,
			swatch_status: order_entry.swatch_status,
			swatch_approval_date: order_entry.swatch_approval_date,
			bleaching: order_entry.bleaching,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			teeth_molding_stock: decimalToNumber(sfg.teeth_molding_stock),
			teeth_molding_prod: decimalToNumber(sfg.teeth_molding_prod),
			dying_and_iron_prod: decimalToNumber(sfg.dying_and_iron_prod),
			total_teeth_molding: sql`
				SUM(
					CASE WHEN finishing_batch_production.section = 'teeth_molding' THEN finishing_batch_production.production_quantity ELSE 0 END
				)::float8
			`,
			teeth_coloring_stock: decimalToNumber(sfg.teeth_coloring_stock),
			teeth_coloring_prod: decimalToNumber(sfg.teeth_coloring_prod),
			total_teeth_coloring: sql`
				SUM(
					CASE WHEN finishing_batch_production.section = 'teeth_coloring' THEN finishing_batch_production.production_quantity ELSE 0 END
				)::float8
			`,
			finishing_stock: decimalToNumber(sfg.finishing_stock),
			finishing_prod: decimalToNumber(sfg.finishing_prod),
			finishing_balance: sql`(order_entry.quantity - sfg.warehouse - sfg.delivered)::float8`,
			total_finishing: sql`
				SUM(
					CASE WHEN finishing_batch_production.section = 'finishing' THEN finishing_batch_production.production_quantity ELSE 0 END
				)::float8
			`,
			coloring_prod: decimalToNumber(sfg.coloring_prod),
			total_pi_quantity: decimalToNumber(sfg.pi),
			total_warehouse_quantity: decimalToNumber(sfg.warehouse),
			total_delivery_quantity: decimalToNumber(sfg.delivered),
			total_reject_quantity: decimalToNumber(sfg.reject_quantity),
			total_short_quantity: decimalToNumber(sfg.short_quantity),
			index: order_entry.index,
			planning_batch_quantity: sql`
				(
					SELECT SUM(finishing_batch_entry.quantity)::float8
					FROM zipper.finishing_batch_entry
					WHERE finishing_batch_entry.sfg_uuid = sfg.uuid
				)
			`,
		})
		.from(order_entry)
		.leftJoin(
			order_description,
			eq(order_entry.order_description_uuid, order_description.uuid)
		)
		.leftJoin(sfg, eq(order_entry.uuid, sfg.order_entry_uuid))
		.leftJoin(
			finishing_batch_entry,
			eq(sfg.uuid, finishing_batch_entry.sfg_uuid)
		)
		.leftJoin(
			finishing_batch_production,
			eq(
				finishing_batch_entry.uuid,
				finishing_batch_production.finishing_batch_entry_uuid
			)
		)
		.leftJoin(dyeing_batch_entry, eq(sfg.uuid, dyeing_batch_entry.sfg_uuid))
		.where(eq(order_description.uuid, order_description_uuid))
		.groupBy(order_entry.uuid, sfg.uuid, order_description.is_inch)
		.orderBy(asc(order_entry.index));

	try {
		const data = await orderEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Entry Full',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderAllInfoByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_number } = req.params;
	const { order_description_uuid } = req.query;

	const query = sql`
		SELECT 
			vodf.order_description_uuid,
			vodf.order_info_uuid,
			vodf.item_description,
			CONCAT(
                    CASE WHEN (vodf.zipper_number_name IS NOT NULL AND vodf.zipper_number_name != '---') THEN '#' ELSE '' END,
                    vodf.zipper_number_name, 
                    CASE WHEN (vodf.item_name IS NOT NULL AND vodf.item_name != '---') THEN ' - ' ELSE '' END,
                    vodf.item_name, 
                    CASE WHEN (vodf.nylon_stopper_name IS NOT NULL AND vodf.nylon_stopper_name != '---') THEN ' / ' ELSE '' END,
                    CASE WHEN (vodf.nylon_stopper_name IS NOT NULL AND vodf.nylon_stopper_name != '---') THEN vodf.nylon_stopper_name ELSE '' END,
                    CASE WHEN is_multi_color = 1 THEN ' (Multi Color) ' ELSE '' END,
					CASE WHEN order_type = 'tape' THEN ' Long Chain ' ELSE '' END, 
					CASE WHEN (vodf.end_type_name IS NOT NULL AND vodf.end_type_name != '---') THEN ' / ' ELSE '' END,
					CASE WHEN (vodf.end_type_name IS NOT NULL AND vodf.end_type_name != '---') THEN vodf.end_type_name ELSE '' END,
					CASE WHEN (vodf.hand_name IS NOT NULL AND vodf.hand_name != '---' AND (lower(vodf.end_type_name) != 'close end' AND lower(vodf.end_type_name) != '2 way - close end')) THEN ' / ' ELSE '' END,
					CASE WHEN (lower(vodf.end_type_name) != 'close end' AND lower(vodf.end_type_name) != '2 way - close end') THEN vodf.hand_name ELSE '' END,
					CASE WHEN (vodf.teeth_type_name IS NOT NULL AND vodf.teeth_type_name != '---') THEN ' / Teeth: ' ELSE '' END,
					CASE WHEN (vodf.teeth_type_name IS NOT NULL AND vodf.teeth_type_name != '---') THEN vodf.teeth_type_name ELSE '' END,
					CASE WHEN (vodf.teeth_color_name IS NOT NULL AND vodf.teeth_color_name != '---') THEN ' / Teeth: ' ELSE '' END,
					CASE WHEN (vodf.teeth_color_name IS NOT NULL AND vodf.teeth_color_name != '---') THEN vodf.teeth_color_name ELSE '' END,
					CASE WHEN vodf.is_waterproof = true THEN ' (Waterproof) ' ELSE '' END
				) as tape,
			CONCAT(
                vodf.puller_type_name, 
                CASE WHEN (vodf.puller_type_name IS NOT NULL AND vodf.puller_type_name != '---') THEN ' Puller' ELSE '' END,
                CASE WHEN (vodf.lock_type_name IS NOT NULL AND vodf.lock_type_name != '---') THEN ' / ' ELSE '' END,
                CASE WHEN (vodf.lock_type_name IS NOT NULL AND vodf.lock_type_name != '---') THEN vodf.lock_type_name ELSE '' END,
                CASE WHEN (vodf.coloring_type_name IS NOT NULL AND vodf.coloring_type_name != '---') THEN ' / ' ELSE '' END,
                CASE WHEN (vodf.coloring_type_name IS NOT NULL AND vodf.coloring_type_name != '---') THEN vodf.coloring_type_name ELSE '' END, 
                CASE WHEN (vodf.puller_color_name IS NOT NULL AND vodf.puller_color_name != '---') THEN ' / Slider: ' ELSE '' END,
                CASE WHEN (vodf.puller_color_name IS NOT NULL AND vodf.puller_color_name != '---') THEN vodf.puller_color_name ELSE '' END,
                CASE WHEN (vodf.slider_name IS NOT NULL AND vodf.slider_name != '---') THEN ' / ' ELSE '' END,
                CASE WHEN (vodf.slider_name IS NOT NULL AND vodf.slider_name != '---') THEN vodf.slider_name ELSE '' END,
                CASE WHEN (vodf.slider_body_shape_name IS NOT NULL AND vodf.slider_body_shape_name != '---') THEN ' / ' ELSE '' END,
                CASE WHEN (vodf.slider_body_shape_name IS NOT NULL AND vodf.slider_body_shape_name != '---') THEN vodf.slider_body_shape_name ELSE '' END,
                CASE WHEN (vodf.slider_link_name IS NOT NULL AND vodf.slider_link_name != '---') THEN ' / ' ELSE '' END,
                CASE WHEN (vodf.slider_link_name IS NOT NULL AND vodf.slider_link_name != '---') THEN vodf.slider_link_name ELSE '' END,
                CASE WHEN (vodf.logo_type_name IS NOT NULL AND vodf.logo_type_name != '---') THEN ' / ' ELSE '' END,
                CASE WHEN (vodf.logo_type_name IS NOT NULL AND vodf.logo_type_name != '---') THEN vodf.logo_type_name ELSE '' END,
                CASE WHEN (vodf.logo_type_name IS NOT NULL AND vodf.logo_type_name != '---') THEN 
                    CONCAT(
                        ' (', 
                        CASE WHEN vodf.is_logo_body = 1 THEN 'B' ELSE '' END, 
                        CASE WHEN vodf.is_logo_puller = 1 THEN ' P' ELSE '' END, 
                        ')'
                    ) 
                ELSE '' END,
                CASE WHEN (vodf.top_stopper_name IS NOT NULL AND vodf.top_stopper_name != '---') THEN ' / Top Stopper: ' ELSE '' END,
                CASE WHEN (vodf.top_stopper_name IS NOT NULL AND vodf.top_stopper_name != '---') THEN vodf.top_stopper_name ELSE '' END,
                CASE WHEN (vodf.bottom_stopper_name IS NOT NULL AND vodf.bottom_stopper_name != '---') THEN ' / Bottom Stopper: ' ELSE '' END,
                CASE WHEN (vodf.bottom_stopper_name IS NOT NULL AND vodf.bottom_stopper_name != '---') THEN vodf.bottom_stopper_name ELSE '' END,
                ' / ',
                REPLACE(vodf.slider_provided::text, '_', ' ')
            ) as slider,
            vodf.special_requirement,
            vodf.order_type,
            vodf.is_multi_color,
            vodf.is_waterproof,
            vodf.description,
			vodf.remarks,
            vodf.light_preference_name,
            vodf.garments_wash,
			vodf.garments_remarks,
            vodf.revision_no,
			oe.style,
			oe.color_ref_entry_date,
			oe.color_ref_update_date,
			CONCAT(oe.color, CASE WHEN oe.color_ref IS NOT NULL AND oe.color_ref != '' THEN ' (REF: ' ELSE '' END, oe.color_ref, CASE WHEN oe.color_ref IS NOT NULL AND oe.color_ref != '' THEN ')' ELSE '' END) as color,
			oe.size::float8,
			vodf.is_inch,
			oe.quantity::float8 as quantity,
			oe.bleaching,
			CASE 
				WHEN vodf.is_inch = 1 THEN 'Inch' 
				ELSE 
					CASE 
						WHEN vodf.order_type = 'tape' THEN 'Meter'
						ELSE 'CM'
					END 
			END as unit,
			vodf.order_description_created_at,
			vodf.order_description_updated_at
		FROM 
			zipper.v_order_details_full vodf
		LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
		WHERE
			vodf.order_number = ${order_number} AND ${order_description_uuid ? sql`vodf.order_description_uuid = ${order_description_uuid}` : sql`true`}
		ORDER BY
			oe.size::float8 ASC
	`;

	// ! Removing order quantity SUM from the query as it is not needed FOR NOW
	// SUM(oe.quantity)::float8 as quantity,
	// GROUP BY
	// 		oe.size,
	// 		vodf.order_description_uuid,
	// 		vodf.order_info_uuid,
	// 		vodf.item_description,
	//         vodf.zipper_number_name,
	//         vodf.item_name,
	//         vodf.nylon_stopper_name,
	//         vodf.is_multi_color,
	//         vodf.end_type_name,
	//         vodf.hand_name,
	//         vodf.teeth_type_name,
	//         vodf.teeth_color_name,
	//         vodf.is_waterproof,
	//         vodf.puller_type_name,
	//         vodf.lock_type_name,
	//         vodf.coloring_type_name,
	//         vodf.puller_color_name,
	//         vodf.slider_name,
	//         vodf.slider_body_shape_name,
	//         vodf.slider_link_name,
	//         vodf.logo_type_name,
	//         vodf.is_logo_body,
	//         vodf.is_logo_puller,
	//         vodf.top_stopper_name,
	//         vodf.bottom_stopper_name,
	//         vodf.slider_provided,
	//         vodf.special_requirement,
	//         vodf.order_type,
	//         vodf.description,
	//         vodf.remarks,
	//         vodf.light_preference_name,
	//         vodf.garments_wash,
	//         vodf.garments_remarks,
	//         vodf.revision_no,
	//         oe.style,
	//         oe.color,
	//         oe.size,
	//         vodf.is_inch,
	//         oe.bleaching,
	// 		vodf.order_description_created_at,
	// 		vodf.order_description_updated_at

	const orderEntryPromise = db.execute(query);

	try {
		const data = await orderEntryPromise;

		let arrayData;

		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				style,
				tape,
				slider,
				order_description_uuid,
				item_description,
				special_requirement,
				order_type,
				is_multi_color,
				is_waterproof,
				description,
				remarks,
				light_preference_name,
				garments_wash,
				garments_remarks,
				revision_no,
				order_entry_uuid,
				color,
				size,
				is_inch,
				unit,
				quantity,
				company_price,
				party_price,
				order_entry_status,
				swatch_status,
				swatch_approval_date,
				bleaching,
				created_at,
				updated_at,
				index,
				order_entry_remarks,
				order_description_created_at,
				order_description_updated_at,
			} = row;

			// group using style then tape,slider and other vodf fields, then order_entry fields

			const styleEntry = findOrCreateArray(
				acc,
				['style'],
				[style],
				() => ({
					style,
					order_description_created_at,
					order_description_updated_at,
					item_description: [],
				})
			);

			const itemDescription = findOrCreateArray(
				styleEntry.item_description,
				['tape', 'slider', 'order_description_uuid'],
				[tape, slider, order_description_uuid],
				() => ({
					order_description_uuid,
					tape,
					slider,
					special_requirement,
					order_type,
					is_multi_color,
					is_waterproof,
					description,
					light_preference_name,
					garments_wash,
					revision_no,
					garments_remarks,
					remarks,
					details: [],
				})
			);

			itemDescription.details.push({
				order_entry_uuid,
				color,
				size,
				is_inch,
				unit,
				quantity,
				company_price,
				party_price,
				order_entry_status,
				swatch_status,
				swatch_approval_date,
				bleaching,
				created_at,
				updated_at,
				index,
				order_entry_remarks,
			});

			return acc;
		}, []);

		// arrayData will be same as groupedData but it will have extra group of color

		arrayData = data?.rows.reduce(
			(acc, row) => {
				const {
					style,
					tape,
					slider,
					order_description_uuid,
					item_description,
					special_requirement,
					order_type,
					is_multi_color,
					is_waterproof,
					description,
					remarks,
					light_preference_name,
					garments_wash,
					garments_remarks,
					revision_no,
					order_entry_uuid,
					color,
					size,
					is_inch,
					unit,
					quantity,
					company_price,
					party_price,
					order_entry_status,
					swatch_status,
					swatch_approval_date,
					bleaching,
					created_at,
					updated_at,
					index,
					order_entry_remarks,
					order_description_created_at,
					order_description_updated_at,
				} = row;

				// group using style then tape,slider and other vodf fields, then order_entry fields

				const styleEntry = findOrCreateArray(
					acc,
					['style'],
					[style],
					() => ({
						style,
						order_description_created_at,
						order_description_updated_at,
						item_description: [],
					})
				);

				const itemDescription = findOrCreateArray(
					styleEntry.item_description,
					['tape', 'slider', 'order_description_uuid'],
					[tape, slider, order_description_uuid],
					() => ({
						order_description_uuid,
						tape,
						slider,
						special_requirement,
						order_type,
						is_multi_color,
						is_waterproof,
						description,
						light_preference_name,
						garments_wash,
						revision_no,
						garments_remarks,
						remarks,
						details: [],
					})
				);

				const colorEntry = findOrCreateArray(
					itemDescription.details,
					['color'],
					[color],
					() => ({
						color,
						sizes: [],
					})
				);

				colorEntry.sizes.push({
					order_entry_uuid,
					style,
					size,
					is_inch,
					unit,
					quantity,
					company_price,
					party_price,
					order_entry_status,
					swatch_status,
					swatch_approval_date,
					bleaching,
					created_at,
					updated_at,
					index,
					order_entry_remarks,
				});

				return acc;
			},

			[]
		);

		const response = {
			data: groupedData,
			pageData: arrayData,
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Entry Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBulkApprovalInfo(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { type, order_type } = req.query;

	const query = sql`
				SELECT
					oe.uuid AS uuid,
					sfg.uuid AS sfg_uuid,
					oe.order_description_uuid AS order_description_uuid,
					vod.order_info_uuid,
					oe.style AS style,
					oe.color AS color,
					oe.color_ref,
					oe.color_ref_entry_date,
					oe.color_ref_update_date,
					vod.is_inch,
					oe.size,
					CASE 
						WHEN vod.order_type = 'tape' THEN 'Meter' 
						WHEN vod.order_type = 'slider' THEN 'Pcs'
						WHEN vod.is_inch = 1 THEN 'Inch'
						ELSE 'CM' 
					END AS unit,
					oe.bleaching,
					oe.quantity::float8 AS quantity,
					sfg.recipe_uuid AS recipe_uuid,
					recipe.name AS recipe_name,
					sfg.remarks AS remarks,
					vod.order_number AS order_number,
					vod.item_description AS item_description,
					vod.order_type,
					vod.order_description_created_at,
					oe.swatch_approval_date,
					COALESCE(dyeing_batch.total_quantity > 0, FALSE) AS is_batch_created,
					vod.receive_by_factory,
					vod.receive_by_factory_time,
					vod.receive_by_factory_by,
					vod.receive_by_factory_by_name,
					oe.bulk_approval_date,
					oe.bulk_approval
				FROM
					zipper.sfg sfg
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
				LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
				LEFT JOIN (
					SELECT 
						dyeing_batch_entry.sfg_uuid,
						SUM(dyeing_batch_entry.quantity) AS total_quantity
					FROM 
						zipper.dyeing_batch_entry
					GROUP BY 
						dyeing_batch_entry.sfg_uuid
				) dyeing_batch ON dyeing_batch.sfg_uuid = sfg.uuid
				WHERE 
					vod.order_type != 'slider' 
					AND vod.is_cancelled = FALSE
					AND vod.production_pause = FALSE
					AND vod.receive_by_factory = TRUE
					AND vod.is_sample = 0
					${
						type === 'pending'
							? sql`AND oe.bulk_approval = FALSE`
							: type === 'completed'
								? sql`AND oe.bulk_approval = TRUE`
								: sql``
					}
					${
						order_type === 'complete_order'
							? sql`AND oe.quantity <= sfg.delivered AND oe.bulk_approval = TRUE`
							: order_type === 'incomplete_order'
								? sql`AND oe.quantity > sfg.delivered`
								: sql``
					}
				ORDER BY 
					vod.order_description_created_at DESC,
					oe.bulk_approval_date ASC`;

	const swatchPromise = db.execute(query);

	try {
		const data = await swatchPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'swatch info',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateBulkApprovalBySfgUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.update(order_entry)
		.set({
			bulk_approval_date: req.body.bulk_approval_date,
			bulk_approval: req.body.bulk_approval,
		})
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedId: order_entry.uuid });

	try {
		const data = await orderEntryPromise;
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

export async function selectSwatchApprovalReceived(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { type, order_type } = req.query;

	const query = sql`
				SELECT
					sfg.uuid AS sfg_uuid,
					oe.uuid AS uuid,
					oe.order_description_uuid AS order_description_uuid,
					vod.order_info_uuid,
					oe.style AS style,
					oe.color AS color,
					oe.color_ref,
					oe.color_ref_entry_date,
					oe.color_ref_update_date,
					vod.is_inch,
					oe.size,
					CASE 
						WHEN vod.order_type = 'tape' THEN 'Meter' 
						WHEN vod.order_type = 'slider' THEN 'Pcs'
						WHEN vod.is_inch = 1 THEN 'Inch'
						ELSE 'CM' 
					END AS unit,
					oe.bleaching,
					oe.quantity::float8 AS quantity,
					sfg.recipe_uuid AS recipe_uuid,
					recipe.name AS recipe_name,
					sfg.remarks AS remarks,
					vod.order_number AS order_number,
					vod.item_description AS item_description,
					vod.order_type,
					vod.order_description_created_at,
					oe.swatch_approval_date,
					COALESCE(dyeing_batch.total_quantity > 0, FALSE) AS is_batch_created,
					vod.receive_by_factory,
					vod.receive_by_factory_time,
					vod.receive_by_factory_by,
					vod.receive_by_factory_by_name,
					oe.swatch_approval_received,
					oe.swatch_approval_received_date,
					oe.swatch_approval_received_by,
					swatch_approval_received_by.name as swatch_approval_received_by_name
				FROM
					zipper.sfg sfg
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
				LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
				LEFT JOIN (
					SELECT 
						dyeing_batch_entry.sfg_uuid,
						SUM(dyeing_batch_entry.quantity) AS total_quantity
					FROM 
						zipper.dyeing_batch_entry
					GROUP BY 
						dyeing_batch_entry.sfg_uuid
				) dyeing_batch ON dyeing_batch.sfg_uuid = sfg.uuid
				LEFT JOIN hr.users swatch_approval_received_by ON oe.swatch_approval_received_by = swatch_approval_received_by.uuid
				WHERE 
					vod.order_type != 'slider' 
					AND vod.is_cancelled = FALSE
					AND vod.production_pause = FALSE
					AND vod.receive_by_factory = TRUE
					${
						type === 'pending'
							? sql` AND oe.swatch_approval_received = FALSE`
							: type === 'completed'
								? sql` AND oe.swatch_approval_received = TRUE`
								: sql``
					}
					${
						order_type === 'complete_order'
							? sql` AND oe.quantity <= sfg.delivered AND oe.swatch_approval_received = TRUE`
							: order_type === 'incomplete_order'
								? sql` AND oe.quantity > sfg.delivered`
								: sql``
					}
				ORDER BY 
					vod.order_description_created_at DESC,
					oe.swatch_approval_received ASC`;

	const swatchPromise = db.execute(query);

	try {
		const data = await swatchPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'swatch info',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchApprovalReceivedByUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryPromise = db
		.update(order_entry)
		.set({
			swatch_approval_received: req.body.swatch_approval_received,
			swatch_approval_received_date:
				req.body.swatch_approval_received_date,
			swatch_approval_received_by: req.body.swatch_approval_received_by,
		})
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedId: order_entry.uuid });

	try {
		const data = await orderEntryPromise;
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
