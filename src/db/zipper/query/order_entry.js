import { asc, desc, eq, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as deliverySchema from '../../delivery/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import {
	dyeing_batch_entry,
	finishing_batch_entry,
	finishing_batch_production,
	order_description,
	order_entry,
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

	const {
		uuid,
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
		remarks,
		is_inch,
		index,
	} = req.body;

	const order_entryPromise = db
		.insert(order_entry)
		.values({
			uuid,
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
			remarks,
			is_inch,
			index,
		})
		.returning({ insertedUuid: order_entry.uuid });

	try {
		const data = await order_entryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} added`,
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
		is_inch,
		index,
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
			is_inch,
			index,
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

	const sfgPromise = db
		.delete(sfg)
		.where(eq(sfg.order_entry_uuid, req.params.uuid))
		.returning({ deletedUuidSfg: sfg.uuid });

	const orderEntryPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: order_entry.uuid });

	try {
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
			size: order_entry.size,
			is_inch: order_entry.is_inch,
			quantity: decimalToNumber(order_entry.quantity),
			total_planning_quantity: sum(finishing_batch_entry.quantity),
			total_dyeing_quantity: sum(dyeing_batch_entry.quantity),
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
		.leftJoin(
			deliverySchema.packing_list_entry,
			eq(deliverySchema.packing_list_entry.sfg_uuid, sfg.uuid)
		)
		.leftJoin(
			deliverySchema.packing_list,
			eq(
				deliverySchema.packing_list.uuid,
				deliverySchema.packing_list_entry.packing_list_uuid
			)
		)
		.leftJoin(
			deliverySchema.challan,
			eq(
				deliverySchema.challan.uuid,
				deliverySchema.packing_list.challan_uuid
			)
		)
		.where(eq(order_description.uuid, order_description_uuid))
		.groupBy(order_entry.uuid, sfg.uuid)
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
			oe.color,
			oe.size,
			oe.is_inch,
			SUM(oe.quantity)::float8 as quantity,
			oe.company_price::float8,
			oe.party_price::float8,
			oe.status as order_entry_status,
			oe.swatch_status_enum as swatch_status,
			oe.swatch_approval_date,
			oe.bleaching,
			CASE 
				WHEN vodf.is_inch = 1 THEN 'Inch' 
				ELSE 
					CASE 
						WHEN vodf.order_type = 'tape' THEN 'Meter'
						ELSE 'CM'
					END 
			END as unit
		FROM 
			zipper.v_order_details_full vodf
		LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
		WHERE
			vodf.order_number = ${order_number} AND ${order_description_uuid ? sql`vodf.order_description_uuid = ${order_description_uuid}` : sql`true`}
		GROUP BY 
			oe.size,vodf.order_description_uuid, vodf.order_info_uuid, vodf.item_description, vodf.zipper_number_name, vodf.item_name, vodf.nylon_stopper_name, vodf.is_multi_color, vodf.end_type_name, vodf.hand_name, vodf.teeth_type_name, vodf.teeth_color_name, vodf.is_waterproof, vodf.puller_type_name, vodf.lock_type_name, vodf.coloring_type_name, vodf.puller_color_name, vodf.slider_name, vodf.slider_body_shape_name, vodf.slider_link_name, vodf.logo_type_name, vodf.is_logo_body, vodf.is_logo_puller, vodf.top_stopper_name, vodf.bottom_stopper_name, vodf.slider_provided, vodf.special_requirement, vodf.order_type, vodf.description, vodf.remarks, vodf.light_preference_name, vodf.garments_wash, vodf.garments_remarks, vodf.revision_no, oe.style, oe.color, oe.size, oe.is_inch, oe.company_price, oe.party_price, oe.status, oe.swatch_status_enum, oe.swatch_approval_date, oe.bleaching, vodf.is_inch
		ORDER BY
			oe.size
	`;

	const orderEntryPromise = db.execute(query);

	try {
		const data = await orderEntryPromise;

		let arrayData;

		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				style,
				tape,
				slider,
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
			} = row;

			// group using style then tape,slider and other vodf fields, then order_entry fields

			const styleEntry = findOrCreateArray(
				acc,
				['style'],
				[style],
				() => ({
					style,
					item_description: [],
				})
			);

			const itemDescription = findOrCreateArray(
				styleEntry.item_description,
				['tape', 'slider'],
				[tape, slider],
				() => ({
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
				} = row;

				// group using style then tape,slider and other vodf fields, then order_entry fields

				const styleEntry = findOrCreateArray(
					acc,
					['style'],
					[style],
					() => ({
						style,
						item_description: [],
					})
				);

				const itemDescription = findOrCreateArray(
					styleEntry.item_description,
					['tape', 'slider'],
					[tape, slider],
					() => ({
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
