import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { order_description, order_info, tape_coil } from '../schema.js';

// public.properties
const itemProperties = alias(publicSchema.properties, 'itemProperties');
const zipperProperties = alias(publicSchema.properties, 'zipperProperties');
const endTypeProperties = alias(publicSchema.properties, 'endTypeProperties');
const lockTypeProperties = alias(publicSchema.properties, 'lockTypeProperties');
const pullerTypeProperties = alias(
	publicSchema.properties,
	'pullerTypeProperties'
);
const teethColorProperties = alias(
	publicSchema.properties,
	'teethColorProperties'
);
const teethTypeProperties = alias(
	publicSchema.properties,
	'teethTypeProperties'
);
const pullerColorProperties = alias(
	publicSchema.properties,
	'pullerColorProperties'
);
const handProperties = alias(publicSchema.properties, 'handProperties');
const nylonStopperProperties = alias(
	publicSchema.properties,
	'nylonStopperProperties'
);
const coloringProperties = alias(publicSchema.properties, 'coloringProperties');
const sliderProperties = alias(publicSchema.properties, 'sliderProperties');
const topStopperProperties = alias(
	publicSchema.properties,
	'topStopperProperties'
);
const bottomStopperProperties = alias(
	publicSchema.properties,
	'bottomStopperProperties'
);
const logoTypeProperties = alias(publicSchema.properties, 'logoTypeProperties');
const sliderBodyShapeProperties = alias(
	publicSchema.properties,
	'sliderBodyShapeProperties'
);
const sliderLinkProperties = alias(
	publicSchema.properties,
	'sliderLinkProperties'
);
const endUserProperties = alias(publicSchema.properties, 'endUserProperties');
const lightPreferenceProperties = alias(
	publicSchema.properties,
	'lightPreferenceProperties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		order_info_uuid,
		item,
		nylon_stopper,
		zipper_number,
		end_type,
		lock_type,
		puller_type,
		teeth_color,
		teeth_type,
		puller_color,
		special_requirement,
		hand,
		coloring_type,
		slider_provided,
		slider,
		slider_starting_section,
		top_stopper,
		bottom_stopper,
		logo_type,
		is_logo_body,
		is_logo_puller,
		description,
		status,
		created_at,
		remarks,
		slider_body_shape,
		slider_link,
		end_user,
		garment,
		light_preference,
		garments_wash,
		created_by,
		garments_remarks,
		is_inch,
		is_meter,
		is_cm,
		order_type,
		is_multi_color,
		is_waterproof,
		revision_no,
		is_marketing_checked,
	} = req.body;

	const orderDescriptionPromise = db
		.insert(order_description)
		.values({
			uuid,
			order_info_uuid,
			item,
			nylon_stopper,
			zipper_number,
			end_type,
			lock_type,
			puller_type,
			teeth_color,
			teeth_type,
			puller_color,
			special_requirement,
			hand,
			coloring_type,
			slider_provided,
			slider,
			slider_starting_section,
			top_stopper,
			bottom_stopper,
			logo_type,
			is_logo_body,
			is_logo_puller,
			description,
			status,
			created_at,
			remarks,
			slider_body_shape,
			slider_link,
			end_user,
			garment,
			light_preference,
			garments_wash,
			created_by,
			garments_remarks,
			is_inch,
			is_meter,
			is_cm,
			order_type,
			is_multi_color,
			is_waterproof,
			revision_no,
			is_marketing_checked,
		})
		.returning({ insertedUuid: order_description.uuid });

	try {
		const data = await orderDescriptionPromise;
		const toast = {
			status: 200,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		order_info_uuid,
		item,
		nylon_stopper,
		zipper_number,
		end_type,
		lock_type,
		puller_type,
		teeth_color,
		teeth_type,
		puller_color,
		special_requirement,
		hand,
		coloring_type,
		slider_provided,
		slider,
		slider_starting_section,
		top_stopper,
		bottom_stopper,
		logo_type,
		is_logo_body,
		is_logo_puller,
		description,
		status,
		created_at,
		updated_at,
		remarks,
		slider_body_shape,
		slider_link,
		end_user,
		garment,
		light_preference,
		garments_wash,
		created_by,
		garments_remarks,
		is_inch,
		is_meter,
		is_cm,
		order_type,
		is_multi_color,
		is_waterproof,
		revision_no,
		is_marketing_checked,
	} = req.body;

	const orderDescriptionPromise = db
		.update(order_description)
		.set({
			order_info_uuid,
			item,
			nylon_stopper,
			zipper_number,
			end_type,
			lock_type,
			puller_type,
			teeth_color,
			teeth_type,
			puller_color,
			special_requirement,
			hand,
			coloring_type,
			slider_provided,
			slider,
			slider_starting_section,
			top_stopper,
			bottom_stopper,
			logo_type,
			is_logo_body,
			is_logo_puller,
			description,
			status,
			created_at,
			updated_at,
			remarks,
			slider_body_shape,
			slider_link,
			end_user,
			garment,
			light_preference,
			garments_wash,
			created_by,
			garments_remarks,
			is_inch,
			is_meter,
			is_cm,
			order_type,
			is_multi_color,
			is_waterproof,
			revision_no,
			is_marketing_checked,
		})
		.where(eq(order_description.uuid, req.params.uuid))
		.returning({ updatedUuid: order_description.uuid });

	try {
		const data = await orderDescriptionPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.delete(order_description)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning({ deletedUuid: order_description.uuid });

	try {
		const data = await orderDescriptionPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const orderDescriptionPromise = db
		.select({
			uuid: order_description.uuid,
			order_info_uuid: order_description.order_info_uuid,
			tape_received: decimalToNumber(order_description.tape_received),
			multi_color_tape_received: decimalToNumber(
				order_description.multi_color_tape_received
			),
			tape_transferred: decimalToNumber(
				order_description.tape_transferred
			),
			item: order_description.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			nylon_stopper: order_description.nylon_stopper,
			nylon_stopper_name: nylonStopperProperties.name,
			nylon_stopper_short_name: nylonStopperProperties.short_name,
			zipper_number: order_description.zipper_number,
			zipper_number_name: zipperProperties.name,
			zipper_number_short_name: zipperProperties.short_name,
			end_type: order_description.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			lock_type: order_description.lock_type,
			lock_type_name: lockTypeProperties.name,
			lock_type_short_name: lockTypeProperties.short_name,
			puller_type: order_description.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			teeth_color: order_description.teeth_color,
			teeth_color_name: teethColorProperties.name,
			teeth_color_short_name: teethColorProperties.short_name,
			teeth_type: order_description.teeth_type,
			teeth_type_name: teethTypeProperties.name,
			teeth_type_short_name: teethTypeProperties.short_name,
			puller_color: order_description.puller_color,
			puller_color_name: pullerColorProperties.name,
			puller_color_short_name: pullerColorProperties.short_name,
			special_requirement: order_description.special_requirement,
			hand: order_description.hand,
			hand_name: handProperties.name,
			hand_short_name: handProperties.short_name,
			coloring_type: order_description.coloring_type,
			coloring_type_name: coloringProperties.name,
			coloring_type_short_name: coloringProperties.short_name,
			slider_provided: order_description.slider_provided,
			slider: order_description.slider,
			slider_name: sliderProperties.name,
			slider_short_name: sliderProperties.short_name,
			slider_starting_section: order_description.slider_starting_section,
			top_stopper: order_description.top_stopper,
			top_stopper_name: topStopperProperties.name,
			top_stopper_short_name: topStopperProperties.short_name,
			bottom_stopper: order_description.bottom_stopper,
			bottom_stopper_name: bottomStopperProperties.name,
			bottom_stopper_short_name: bottomStopperProperties.short_name,
			logo_type: order_description.logo_type,
			logo_type_name: logoTypeProperties.name,
			logo_type_short_name: logoTypeProperties.short_name,
			is_logo_body: order_description.is_logo_body,
			is_logo_puller: order_description.is_logo_puller,
			description: order_description.description,
			status: order_description.status,
			created_at: order_description.created_at,
			updated_at: order_description.updated_at,
			remarks: order_description.remarks,
			slider_body_shape: order_description.slider_body_shape,
			slider_body_shape_name: sliderBodyShapeProperties.name,
			slider_body_shape_short_name: sliderBodyShapeProperties.short_name,
			slider_link: order_description.slider_link,
			slider_link_name: sliderLinkProperties.name,
			slider_link_short_name: sliderLinkProperties.short_name,
			end_user: order_description.end_user,
			end_user_name: endUserProperties.name,
			end_user_short_name: endUserProperties.short_name,
			garment: order_description.garment,
			light_preference: order_description.light_preference,
			light_preference_name: lightPreferenceProperties.name,
			light_preference_short_name: lightPreferenceProperties.short_name,
			garments_wash: order_description.garments_wash,
			created_by: order_description.created_by,
			created_by_name: hrSchema.users.name,
			garments_remarks: order_description.garments_remarks,
			tape_coil_uuid: order_description.tape_coil_uuid,
			tape_name: tape_coil.name,
			is_inch: order_description.is_inch,
			is_meter: order_description.is_meter,
			is_cm: order_description.is_cm,
			order_type: order_description.order_type,
			is_multi_color: order_description.is_multi_color,
			is_waterproof: order_description.is_waterproof,
			revision_no: order_description.revision_no,
			is_marketing_checked: order_description.is_marketing_checked,
		})
		.from(order_description)
		.where(
			eq(order_description.order_info_uuid, req.params.order_info_uuid)
		)
		.leftJoin(
			order_info,
			eq(order_description.order_info_uuid, order_info.uuid)
		)
		.leftJoin(
			itemProperties,
			eq(order_description.item, itemProperties.uuid)
		)
		.leftJoin(
			nylonStopperProperties,
			eq(order_description.nylon_stopper, nylonStopperProperties.uuid)
		)
		.leftJoin(
			zipperProperties,
			eq(order_description.zipper_number, zipperProperties.uuid)
		)
		.leftJoin(
			endTypeProperties,
			eq(order_description.end_type, endTypeProperties.uuid)
		)
		.leftJoin(
			lockTypeProperties,
			eq(order_description.lock_type, lockTypeProperties.uuid)
		)
		.leftJoin(
			pullerTypeProperties,
			eq(order_description.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(
			teethColorProperties,
			eq(order_description.teeth_color, teethColorProperties.uuid)
		)
		.leftJoin(
			teethTypeProperties,
			eq(order_description.teeth_type, teethTypeProperties.uuid)
		)
		.leftJoin(
			pullerColorProperties,
			eq(order_description.puller_color, pullerColorProperties.uuid)
		)
		.leftJoin(
			handProperties,
			eq(order_description.hand, handProperties.uuid)
		)
		.leftJoin(
			coloringProperties,
			eq(order_description.coloring_type, coloringProperties.uuid)
		)
		.leftJoin(
			sliderProperties,
			eq(order_description.slider, sliderProperties.uuid)
		)
		.leftJoin(
			topStopperProperties,
			eq(order_description.top_stopper, topStopperProperties.uuid)
		)
		.leftJoin(
			bottomStopperProperties,
			eq(order_description.bottom_stopper, bottomStopperProperties.uuid)
		)
		.leftJoin(
			logoTypeProperties,
			eq(order_description.logo_type, logoTypeProperties.uuid)
		)
		.leftJoin(
			sliderBodyShapeProperties,
			eq(
				order_description.slider_body_shape,
				sliderBodyShapeProperties.uuid
			)
		)
		.leftJoin(
			sliderLinkProperties,
			eq(order_description.slider_link, sliderLinkProperties.uuid)
		)
		.leftJoin(
			endUserProperties,
			eq(order_description.end_user, endUserProperties.uuid)
		)
		.leftJoin(
			lightPreferenceProperties,
			eq(
				order_description.light_preference,
				lightPreferenceProperties.uuid
			)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_description.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			tape_coil,
			eq(order_description.tape_coil_uuid, tape_coil.uuid)
		)
		.orderBy(desc(order_description.created_at));

	try {
		const data = await orderDescriptionPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Description list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.select({
			uuid: order_description.uuid,
			order_info_uuid: order_description.order_info_uuid,
			tape_received: decimalToNumber(order_description.tape_received),
			multi_color_tape_received: decimalToNumber(
				order_description.multi_color_tape_received
			),
			tape_transferred: decimalToNumber(
				order_description.tape_transferred
			),
			item: order_description.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			nylon_stopper: order_description.nylon_stopper,
			nylon_stopper_name: nylonStopperProperties.name,
			nylon_stopper_short_name: nylonStopperProperties.short_name,
			zipper_number: order_description.zipper_number,
			zipper_number_name: zipperProperties.name,
			zipper_number_short_name: zipperProperties.short_name,
			end_type: order_description.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			lock_type: order_description.lock_type,
			lock_type_name: lockTypeProperties.name,
			lock_type_short_name: lockTypeProperties.short_name,
			puller_type: order_description.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			teeth_color: order_description.teeth_color,
			teeth_color_name: teethColorProperties.name,
			teeth_color_short_name: teethColorProperties.short_name,
			teeth_type: order_description.teeth_type,
			teeth_type_name: teethTypeProperties.name,
			teeth_type_short_name: teethTypeProperties.short_name,
			puller_color: order_description.puller_color,
			puller_color_name: pullerColorProperties.name,
			puller_color_short_name: pullerColorProperties.short_name,
			special_requirement: order_description.special_requirement,
			hand: order_description.hand,
			hand_name: handProperties.name,
			hand_short_name: handProperties.short_name,
			coloring_type: order_description.coloring_type,
			coloring_type_name: coloringProperties.name,
			coloring_type_short_name: coloringProperties.short_name,
			slider_provided: order_description.slider_provided,
			slider: order_description.slider,
			slider_name: sliderProperties.name,
			slider_short_name: sliderProperties.short_name,
			slider_starting_section: order_description.slider_starting_section,
			top_stopper: order_description.top_stopper,
			top_stopper_name: topStopperProperties.name,
			top_stopper_short_name: topStopperProperties.short_name,
			bottom_stopper: order_description.bottom_stopper,
			bottom_stopper_name: bottomStopperProperties.name,
			bottom_stopper_short_name: bottomStopperProperties.short_name,
			logo_type: order_description.logo_type,
			logo_type_name: logoTypeProperties.name,
			logo_type_short_name: logoTypeProperties.short_name,
			is_logo_body: order_description.is_logo_body,
			is_logo_puller: order_description.is_logo_puller,
			description: order_description.description,
			status: order_description.status,
			created_at: order_description.created_at,
			updated_at: order_description.updated_at,
			remarks: order_description.remarks,
			slider_body_shape: order_description.slider_body_shape,
			slider_body_shape_name: sliderBodyShapeProperties.name,
			slider_body_shape_short_name: sliderBodyShapeProperties.short_name,
			slider_link: order_description.slider_link,
			slider_link_name: sliderLinkProperties.name,
			slider_link_short_name: sliderLinkProperties.short_name,
			end_user: order_description.end_user,
			end_user_name: endUserProperties.name,
			end_user_short_name: endUserProperties.short_name,
			garment: order_description.garment,
			light_preference: order_description.light_preference,
			light_preference_name: lightPreferenceProperties.name,
			light_preference_short_name: lightPreferenceProperties.short_name,
			garments_wash: order_description.garments_wash,
			created_by: order_description.created_by,
			created_by_name: hrSchema.users.name,
			garments_remarks: order_description.garments_remarks,
			tape_coil_uuid: order_description.tape_coil_uuid,
			tape_name: tape_coil.name,
			is_inch: order_description.is_inch,
			is_meter: order_description.is_meter,
			is_cm: order_description.is_cm,
			order_type: order_description.order_type,
			is_multi_color: order_description.is_multi_color,
			is_waterproof: order_description.is_waterproof,
			revision_no: order_description.revision_no,
			is_marketing_checked: order_description.is_marketing_checked,
		})
		.from(order_description)
		.where(
			eq(order_description.order_info_uuid, req.params.order_info_uuid)
		)
		.leftJoin(
			order_info,
			eq(order_description.order_info_uuid, order_info.uuid)
		)
		.leftJoin(
			itemProperties,
			eq(order_description.item, itemProperties.uuid)
		)
		.leftJoin(
			nylonStopperProperties,
			eq(order_description.nylon_stopper, nylonStopperProperties.uuid)
		)
		.leftJoin(
			zipperProperties,
			eq(order_description.zipper_number, zipperProperties.uuid)
		)
		.leftJoin(
			endTypeProperties,
			eq(order_description.end_type, endTypeProperties.uuid)
		)
		.leftJoin(
			lockTypeProperties,
			eq(order_description.lock_type, lockTypeProperties.uuid)
		)
		.leftJoin(
			pullerTypeProperties,
			eq(order_description.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(
			teethColorProperties,
			eq(order_description.teeth_color, teethColorProperties.uuid)
		)
		.leftJoin(
			teethTypeProperties,
			eq(order_description.teeth_type, teethTypeProperties.uuid)
		)
		.leftJoin(
			pullerColorProperties,
			eq(order_description.puller_color, pullerColorProperties.uuid)
		)
		.leftJoin(
			handProperties,
			eq(order_description.hand, handProperties.uuid)
		)
		.leftJoin(
			coloringProperties,
			eq(order_description.coloring_type, coloringProperties.uuid)
		)
		.leftJoin(
			sliderProperties,
			eq(order_description.slider, sliderProperties.uuid)
		)
		.leftJoin(
			topStopperProperties,
			eq(order_description.top_stopper, topStopperProperties.uuid)
		)
		.leftJoin(
			bottomStopperProperties,
			eq(order_description.bottom_stopper, bottomStopperProperties.uuid)
		)
		.leftJoin(
			logoTypeProperties,
			eq(order_description.logo_type, logoTypeProperties.uuid)
		)
		.leftJoin(
			sliderBodyShapeProperties,
			eq(
				order_description.slider_body_shape,
				sliderBodyShapeProperties.uuid
			)
		)
		.leftJoin(
			sliderLinkProperties,
			eq(order_description.slider_link, sliderLinkProperties.uuid)
		)
		.leftJoin(
			endUserProperties,
			eq(order_description.end_user, endUserProperties.uuid)
		)
		.leftJoin(
			lightPreferenceProperties,
			eq(
				order_description.light_preference,
				lightPreferenceProperties.uuid
			)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_description.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			tape_coil,
			eq(order_description.tape_coil_uuid, tape_coil.uuid)
		)
		.where(eq(order_description.uuid, req.params.uuid));

	try {
		const data = await orderDescriptionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Description',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDescriptionFullByOrderDescriptionUuid(
	req,
	res,
	next
) {
	if (!validateRequest(req, next)) return;

	const { order_description_uuid } = req.params;

	const query = sql`
		SELECT 
			v_order_details_full.*, 
			tape_coil_required.top::float8, 
			tape_coil_required.bottom::float8,
			tape_coil_required.raw_mtr_per_kg::float8 as raw_per_kg_meter,
			tape_coil_required.dyed_mtr_per_kg::float8 as dyed_per_kg_meter,
			pi_cash_grouped.pi_numbers
		FROM 
			zipper.v_order_details_full 
		LEFT JOIN 
			zipper.tape_coil_required 
		ON 
			v_order_details_full.item = tape_coil_required.item_uuid  
			AND v_order_details_full.zipper_number = tape_coil_required.zipper_number_uuid 
			AND v_order_details_full.end_type = tape_coil_required.end_type_uuid 
			AND (
				lower(v_order_details_full.item_name) != 'nylon' 
				OR v_order_details_full.nylon_stopper = tape_coil_required.nylon_stopper_uuid
			)
		LEFT JOIN
			zipper.tape_coil ON v_order_details_full.tape_coil_uuid = tape_coil.uuid
		LEFT JOIN (
			SELECT vodf.order_info_uuid, array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers
			FROM
				zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
				LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
			WHERE pi_cash.id IS NOT NULL
			GROUP BY vodf.order_info_uuid
		) pi_cash_grouped ON v_order_details_full.order_info_uuid = pi_cash_grouped.order_info_uuid
		WHERE 
			v_order_details_full.order_description_uuid = ${order_description_uuid}`;

	const orderInfoPromise = db.execute(query);

	try {
		const data = await orderInfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Order Description full',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDescriptionUuidToGetOrderDescriptionAndOrderEntry(
	req,
	res,
	next
) {
	if (!validateRequest(req, next)) return;

	const { order_description_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/by/${order_description_uuid}`)
				.then((response) => response);

		const [order_description, order_entry] = await Promise.all([
			fetchData('/zipper/order/description/full/uuid'),
			fetchData('/zipper/order/entry/full/uuid'),
		]);

		const orderEntriesWithHistory = await Promise.all(
			(order_entry?.data?.data || []).map(async (entry) => {
				// console.log('entry', entry.order_entry_uuid);
				const historyResponse = await api.get(
					`/zipper/order-entry-log?order_entry_uuid=${entry.order_entry_uuid}`
				);
				//console.log('historyResponse', historyResponse?.data?.data);
				return {
					...entry,
					history: historyResponse?.data?.data || [],
				};
			})
		);

		const response = {
			...order_description?.data?.data[0],
			order_entry: orderEntriesWithHistory,
		};

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Order Description Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderNumberToGetOrderDescriptionAndOrderEntry(
	req,
	res,
	next
) {
	if (!validateRequest(req, next)) return;

	const { order_number } = req.params;

	try {
		const api = await createApi(req);

		const { data: get_order_description_uuid } = await api.get(
			`/other/order/order_description_uuid/by/${order_number}`
		);

		const fetchDetailsAndEntries = async (order_description_uuid) => {
			const fetchData = async (endpoint) =>
				await api.get(`${endpoint}/by/${order_description_uuid}`);

			const [order_description, order_entry] = await Promise.all([
				fetchData('/zipper/order/description/full/uuid'),
				fetchData('/zipper/order/entry/full/uuid'),
			]);

			const orderEntriesWithHistory = await Promise.all(
				(order_entry?.data?.data || []).map(async (entry) => {
					// console.log('entry', entry.order_entry_uuid);
					const historyResponse = await api.get(
						`/zipper/order-entry-log?order_entry_uuid=${entry.order_entry_uuid}`
					);
					//console.log('historyResponse', historyResponse?.data?.data);
					return {
						...entry,
						history: historyResponse?.data?.data || [],
					};
				})
			);

			const response = {
				...order_description?.data?.data[0],
				order_entry: orderEntriesWithHistory,
			};

			return response;
		};

		const responses = await Promise.all(
			get_order_description_uuid?.data?.map((uuid) =>
				fetchDetailsAndEntries(uuid.order_description_uuid)
			)
		);

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Order Description list',
		};

		res.status(200).json({ toast, data: responses });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderNumberToGetOrderDescriptionAndOrderEntryOfMarketing(
	req,
	res,
	next
) {
	if (!validateRequest(req, next)) return;

	const { order_number, marketing_uuid } = req.params;

	try {
		const api = await createApi(req);

		let marketingUuid = null;
		const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${marketing_uuid};`;

		if (marketing_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const { data: get_order_description_uuid } = await api.get(
			`/other/order/order_description_uuid/by/${order_number}?marketing_uuid=${marketingUuid}`
		);

		const fetchDetailsAndEntries = async (order_description_uuid) => {
			const fetchData = async (endpoint) =>
				await api.get(`${endpoint}/by/${order_description_uuid}`);

			const [order_description, order_entry] = await Promise.all([
				fetchData('/zipper/order/description/full/uuid'),
				fetchData('/zipper/order/entry/full/uuid'),
			]);

			const response = {
				...order_description?.data?.data[0],
				order_entry: order_entry?.data?.data || [],
			};

			return response;
		};

		const responses = await Promise.all(
			get_order_description_uuid?.data?.map((uuid) =>
				fetchDetailsAndEntries(uuid.order_description_uuid)
			)
		);

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Order Description list',
		};

		res.status(200).json({ toast, data: responses });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateOrderDescriptionByTapeCoil(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { tape_coil_uuid } = req.params;
	// console.log('tape_coil_uuid', tape_coil_uuid);

	const orderDescriptionPromise = db
		.update(order_description)
		.set({ tape_coil_uuid })
		.where(eq(order_description.uuid, req.body.order_description_uuid))
		.returning({ updatedUuid: order_description.uuid });

	try {
		const data = await orderDescriptionPromise;

		if (data.length === 0 || !data[0].updatedUuid) {
			throw new Error('Update failed, no data returned');
		}

		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
